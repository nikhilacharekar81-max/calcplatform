/**
 * Auto Loan Calculation & Amortization Engine
 * Models auto payments, trade-in tax credits, underwater duration, depreciation, and 0% APR vs Rebate
 */

export interface AutoLoanInputs {
  vehiclePrice: number;
  downPaymentType: 'amount' | 'percentage';
  downPaymentValue: number;
  tradeInValue: number;
  tradeInOwed: number;
  salesTaxRate: number;
  applyTradeInTaxCredit: boolean;
  dealerFees: number;
  financeFees: boolean;
  loanTermMonths: number;
  annualRate: number;
  paymentFrequency: 'monthly' | 'biweekly';
  extraPayment: number;
  annualInsurance?: number;
  annualMaintenance?: number;
}

export interface MonthlyScheduleItem {
  period: number;
  month: number;
  startingBalance: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
  totalInterestPaid: number;
  vehicleValue: number;
  equity: number;
  isUnderwater: boolean;
}

export interface YearlyScheduleItem {
  year: number;
  startingBalance: number;
  totalPayments: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
  totalInterestPaid: number;
  vehicleValue: number;
  equity: number;
}

export interface AutoLoanResults {
  regularPayment: number;
  netFinancedPrincipal: number;
  totalInterestPaid: number;
  totalOutofPocket: number;
  totalLoanCost: number;
  upfrontCashNeeded: number;
  netTradeInEquity: number;
  underwaterMonthsCount: number;
  monthlySchedule: MonthlyScheduleItem[];
  yearlySchedule: YearlyScheduleItem[];
  termComparisons: Array<{
    termMonths: number;
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    underwaterMonths: number;
  }>;
}

export function calculateAutoLoan(inputs: AutoLoanInputs): AutoLoanResults {
  const price = Math.max(0, inputs.vehiclePrice || 0);
  const dpAmount = inputs.downPaymentType === 'percentage'
    ? (price * (inputs.downPaymentValue || 0)) / 100
    : Math.max(0, inputs.downPaymentValue || 0);

  const tradeInVal = Math.max(0, inputs.tradeInValue || 0);
  const tradeInOwed = Math.max(0, inputs.tradeInOwed || 0);
  const netTradeIn = tradeInVal - tradeInOwed;

  // State Trade-in Tax credit
  const taxableBase = inputs.applyTradeInTaxCredit ? Math.max(0, price - tradeInVal) : price;
  const salesTax = (taxableBase * (inputs.salesTaxRate || 0)) / 100;
  const fees = Math.max(0, inputs.dealerFees || 0);

  let financedPrincipal = price - dpAmount - netTradeIn + salesTax;
  let upfrontCash = dpAmount;

  if (inputs.financeFees) {
    financedPrincipal += fees;
  } else {
    upfrontCash += fees;
  }

  financedPrincipal = Math.max(0, financedPrincipal);
  const termMonths = Math.max(1, inputs.loanTermMonths || 60);
  const rate = Math.max(0, inputs.annualRate || 0);
  const isBiweekly = inputs.paymentFrequency === 'biweekly';

  const periodicRate = isBiweekly ? rate / 100 / 26 : rate / 100 / 12;
  const totalPeriods = isBiweekly ? Math.round((termMonths / 12) * 26) : termMonths;

  let basePayment = 0;
  if (periodicRate > 0) {
    basePayment = financedPrincipal * (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / (Math.pow(1 + periodicRate, totalPeriods) - 1);
  } else {
    basePayment = financedPrincipal / totalPeriods;
  }

  // Generate Amortization Schedule & Model Depreciation Decay Curve
  let currentBalance = financedPrincipal;
  let cumInterest = 0;
  let underwaterCount = 0;
  const monthlySchedule: MonthlyScheduleItem[] = [];

  for (let p = 1; p <= totalPeriods && currentBalance > 0.01; p++) {
    const month = isBiweekly ? Math.ceil(p / 2.166) : p;
    const startBal = currentBalance;
    const interest = currentBalance * periodicRate;
    let principal = (basePayment - interest) + (inputs.extraPayment || 0);

    if (principal > currentBalance) principal = currentBalance;
    currentBalance -= principal;
    cumInterest += interest;

    // Vehicle Depreciation Model (20% Year 1, 12%/yr Years 2-5)
    const yearFraction = month / 12;
    let depFactor = 1;
    if (yearFraction <= 1) {
      depFactor = 1 - (0.20 * yearFraction);
    } else {
      depFactor = 0.80 * Math.pow(1 - 0.12, yearFraction - 1);
    }
    const currentCarVal = price * Math.max(0.20, depFactor);
    const equity = currentCarVal - currentBalance;
    const isUnderwater = currentBalance > currentCarVal;
    if (isUnderwater) underwaterCount++;

    monthlySchedule.push({
      period: p,
      month,
      startingBalance: startBal,
      payment: principal + interest,
      principalPaid: principal,
      interestPaid: interest,
      endingBalance: currentBalance,
      totalInterestPaid: cumInterest,
      vehicleValue: currentCarVal,
      equity,
      isUnderwater,
    });
  }

  // Build Yearly Schedule
  const yearlySchedule: YearlyScheduleItem[] = [];
  const yearsTotal = Math.ceil(termMonths / 12);
  let yearStartBal = financedPrincipal;
  let yrPayment = 0;
  let yrPrincipal = 0;
  let yrInterest = 0;

  monthlySchedule.forEach((row) => {
    yrPayment += row.payment;
    yrPrincipal += row.principalPaid;
    yrInterest += row.interestPaid;

    if (row.month % 12 === 0 || row.period === monthlySchedule.length) {
      const yearIndex = Math.ceil(row.month / 12);
      yearlySchedule.push({
        year: yearIndex,
        startingBalance: yearStartBal,
        totalPayments: yrPayment,
        principalPaid: yrPrincipal,
        interestPaid: yrInterest,
        endingBalance: row.endingBalance,
        totalInterestPaid: row.totalInterestPaid,
        vehicleValue: row.vehicleValue,
        equity: row.equity,
      });
      yearStartBal = row.endingBalance;
      yrPayment = 0;
      yrPrincipal = 0;
      yrInterest = 0;
    }
  });

  // Alternative Term Matrix
  const termOptions = [36, 48, 60, 72, 84];
  const termComparisons = termOptions.map((t) => {
    const rMonthly = rate / 100 / 12;
    let pmt = 0;
    if (rMonthly > 0) {
      pmt = financedPrincipal * (rMonthly * Math.pow(1 + rMonthly, t)) / (Math.pow(1 + rMonthly, t) - 1);
    } else {
      pmt = financedPrincipal / t;
    }
    const totalCost = pmt * t;
    const totalInt = totalCost - financedPrincipal;
    return {
      termMonths: t,
      monthlyPayment: pmt,
      totalInterest: totalInt,
      totalCost,
      underwaterMonths: t >= 72 ? Math.round(t * 0.45) : t >= 60 ? Math.round(t * 0.3) : 0,
    };
  });

  return {
    regularPayment: basePayment,
    netFinancedPrincipal: financedPrincipal,
    totalInterestPaid: cumInterest,
    totalOutofPocket: upfrontCash + (basePayment * totalPeriods),
    totalLoanCost: financedPrincipal + cumInterest,
    upfrontCashNeeded: upfrontCash,
    netTradeInEquity: netTradeIn,
    underwaterMonthsCount: Math.round(underwaterCount / (isBiweekly ? 2.166 : 1)),
    monthlySchedule,
    yearlySchedule,
    termComparisons,
  };
}

export function calculate0PercentVsRebate(params: {
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  promotionalApr: number;
  standardApr: number;
  rebateAmount: number;
}) {
  const principalA = params.vehiclePrice - params.downPayment;
  const principalB = Math.max(0, params.vehiclePrice - params.downPayment - params.rebateAmount);

  const rA = (params.promotionalApr / 100) / 12;
  const pmtA = rA > 0 ? (principalA * rA * Math.pow(1 + rA, params.termMonths)) / (Math.pow(1 + rA, params.termMonths) - 1) : principalA / params.termMonths;
  const totalA = pmtA * params.termMonths;

  const rB = (params.standardApr / 100) / 12;
  const pmtB = rB > 0 ? (principalB * rB * Math.pow(1 + rB, params.termMonths)) / (Math.pow(1 + rB, params.termMonths) - 1) : principalB / params.termMonths;
  const totalB = pmtB * params.termMonths;

  const savings = Math.abs(totalA - totalB);
  const recommendedOption = totalA <= totalB ? 'promo' : 'rebate';

  return {
    promoOption: { financedAmount: principalA, monthlyPayment: pmtA, totalCost: totalA },
    rebateOption: { financedAmount: principalB, monthlyPayment: pmtB, totalCost: totalB },
    savings,
    recommendedOption,
  };
}
