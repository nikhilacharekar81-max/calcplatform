/**
 * Mortgage & PITI Calculation Engine
 * Models Principal & Interest, Property Taxes, Homeowners Insurance, PMI cancellation (80% LTV), HOA, and extra payments
 */

export interface MortgageInputs {
  homePrice: number;
  downPaymentValue: number;
  downPaymentType: 'amount' | 'percentage';
  loanTermYears: number;
  interestRate: number;
  propertyTaxRate: number;
  homeInsurance: number;
  pmiRate: number;
  hoaFees: number;
  extraPaymentMonthly?: number;
  extraPaymentAnnual?: number;
  extraPaymentOneTime?: number;
  extraPaymentOneTimeMonth?: number;
}

export interface MortgageScheduleRow {
  period: number;
  startingBalance: number;
  principalPaid: number;
  interestPaid: number;
  pmiPaid: number;
  propertyTaxPaid: number;
  insurancePaid: number;
  extraPaid: number;
  endingBalance: number;
  totalInterestPaid: number;
  ltv: number;
}

export interface MortgageResults {
  loanAmount: number;
  downPaymentAmount: number;
  basePrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  initialMonthlyPmi: number;
  monthlyHoa: number;
  totalInitialMonthlyPayment: number;
  totalInterestPaid: number;
  totalCostOfLoan: number;
  interestSavings: number;
  timeSavingsMonths: number;
  pmiDropMonth: number | null;
  monthlySchedule: MortgageScheduleRow[];
  yearlySchedule: Array<{
    year: number;
    startingBalance: number;
    principalPaid: number;
    interestPaid: number;
    pmiPaid: number;
    propertyTaxPaid: number;
    insurancePaid: number;
    endingBalance: number;
    totalInterestPaid: number;
  }>;
  termComparisons: Array<{
    termYears: number;
    monthlyP_I: number;
    totalInterest: number;
    totalCost: number;
  }>;
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const price = Math.max(0, inputs.homePrice || 0);
  const dpAmount = inputs.downPaymentType === 'percentage'
    ? (price * (inputs.downPaymentValue || 0)) / 100
    : Math.max(0, inputs.downPaymentValue || 0);

  const loanAmount = Math.max(0, price - dpAmount);
  const years = Math.max(1, inputs.loanTermYears || 30);
  const totalMonths = years * 12;
  const apr = Math.max(0, inputs.interestRate || 0);
  const r = (apr / 100) / 12;

  let baseMonthlyPI = 0;
  if (r > 0) {
    baseMonthlyPI = loanAmount * (r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
  } else {
    baseMonthlyPI = loanAmount / totalMonths;
  }

  const monthlyTax = (price * ((inputs.propertyTaxRate || 0) / 100)) / 12;
  const monthlyIns = (inputs.homeInsurance || 0) / 12;
  const monthlyHoa = inputs.hoaFees || 0;

  // PMI applies if down payment < 20%
  const isPmiRequired = dpAmount < price * 0.20;
  const annualPmiRate = (inputs.pmiRate || 0.85) / 100;
  const initialMonthlyPmi = isPmiRequired ? (loanAmount * annualPmiRate) / 12 : 0;

  // Generate Baseline Schedule for Savings Comparison
  const baselineTotalInterest = (baseMonthlyPI * totalMonths) - loanAmount;

  // Generate Accelerated Dynamic Schedule
  let currentBalance = loanAmount;
  let cumInterest = 0;
  let pmiDropMonth: number | null = null;
  const monthlySchedule: MortgageScheduleRow[] = [];

  const extraMo = inputs.extraPaymentMonthly || 0;
  const extraYr = inputs.extraPaymentAnnual || 0;
  const extraOneTime = inputs.extraPaymentOneTime || 0;
  const oneTimeMonth = inputs.extraPaymentOneTimeMonth || 1;

  for (let m = 1; m <= totalMonths * 2 && currentBalance > 0.01; m++) {
    const startBal = currentBalance;
    const interest = currentBalance * r;
    let extraThisMonth = extraMo;
    if (m % 12 === 0) extraThisMonth += extraYr;
    if (m === oneTimeMonth) extraThisMonth += extraOneTime;

    let principal = (baseMonthlyPI - interest) + extraThisMonth;
    if (principal > currentBalance) principal = currentBalance;

    currentBalance -= principal;
    cumInterest += interest;

    const currentLTV = (currentBalance / price) * 100;
    let currentPmi = 0;
    if (isPmiRequired && currentLTV > 80) {
      currentPmi = (loanAmount * annualPmiRate) / 12;
    } else if (isPmiRequired && currentLTV <= 80 && pmiDropMonth === null) {
      pmiDropMonth = m;
    }

    monthlySchedule.push({
      period: m,
      startingBalance: startBal,
      principalPaid: principal,
      interestPaid: interest,
      pmiPaid: currentPmi,
      propertyTaxPaid: monthlyTax,
      insurancePaid: monthlyIns,
      extraPaid: extraThisMonth,
      endingBalance: currentBalance,
      totalInterestPaid: cumInterest,
      ltv: currentLTV,
    });
  }

  // Yearly Summary
  const yearlySchedule: Array<{
    year: number;
    startingBalance: number;
    principalPaid: number;
    interestPaid: number;
    pmiPaid: number;
    propertyTaxPaid: number;
    insurancePaid: number;
    endingBalance: number;
    totalInterestPaid: number;
  }> = [];
  let yrStartBal = loanAmount;
  let yrPrinc = 0;
  let yrInt = 0;
  let yrPmi = 0;
  let yrTax = 0;
  let yrIns = 0;

  monthlySchedule.forEach((row) => {
    yrPrinc += row.principalPaid;
    yrInt += row.interestPaid;
    yrPmi += row.pmiPaid;
    yrTax += row.propertyTaxPaid;
    yrIns += row.insurancePaid;

    if (row.period % 12 === 0 || row.period === monthlySchedule.length) {
      const yearIndex = Math.ceil(row.period / 12);
      yearlySchedule.push({
        year: yearIndex,
        startingBalance: yrStartBal,
        principalPaid: yrPrinc,
        interestPaid: yrInt,
        pmiPaid: yrPmi,
        propertyTaxPaid: yrTax,
        insurancePaid: yrIns,
        endingBalance: row.endingBalance,
        totalInterestPaid: row.totalInterestPaid,
      });
      yrStartBal = row.endingBalance;
      yrPrinc = 0;
      yrInt = 0;
      yrPmi = 0;
      yrTax = 0;
      yrIns = 0;
    }
  });

  const actualMonths = monthlySchedule.length;
  const timeSavingsMonths = Math.max(0, totalMonths - actualMonths);
  const interestSavings = Math.max(0, baselineTotalInterest - cumInterest);

  // Term duration comparison
  const termOptions = [10, 15, 20, 30];
  const termComparisons = termOptions.map((t) => {
    const totalT = t * 12;
    let pi = 0;
    if (r > 0) {
      pi = loanAmount * (r * Math.pow(1 + r, totalT)) / (Math.pow(1 + r, totalT) - 1);
    } else {
      pi = loanAmount / totalT;
    }
    const cost = pi * totalT;
    return {
      termYears: t,
      monthlyP_I: pi,
      totalInterest: cost - loanAmount,
      totalCost: cost,
    };
  });

  return {
    loanAmount,
    downPaymentAmount: dpAmount,
    basePrincipalAndInterest: baseMonthlyPI,
    monthlyPropertyTax: monthlyTax,
    monthlyHomeInsurance: monthlyIns,
    initialMonthlyPmi,
    monthlyHoa,
    totalInitialMonthlyPayment: baseMonthlyPI + monthlyTax + monthlyIns + initialMonthlyPmi + monthlyHoa,
    totalInterestPaid: cumInterest,
    totalCostOfLoan: loanAmount + cumInterest,
    interestSavings,
    timeSavingsMonths,
    pmiDropMonth,
    monthlySchedule,
    yearlySchedule,
    termComparisons,
  };
}
