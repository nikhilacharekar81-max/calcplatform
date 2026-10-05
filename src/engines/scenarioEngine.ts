import { calculateIndiaIncomeTaxAY2026_27 } from '../calculators/india/incomeTax.ts';

export interface ScenarioInputParams {
  annualIncome?: number;
  homeLoanAmount?: number;
  homeLoanInterestRate?: number;
  homeLoanTenureYears?: number;
  monthlyInvestment?: number;
  sipReturnRate?: number;
  sipHorizonYears?: number;
  section80C?: number;
  section80D?: number;
  customIntent?: string;
}

export function calculateDeterministicScenario(params: ScenarioInputParams) {
  const loanAmount = params.homeLoanAmount ?? 4500000;
  const loanRate = params.homeLoanInterestRate ?? 8.75;
  const loanYears = params.homeLoanTenureYears ?? 20;

  const monthlySip = params.monthlyInvestment ?? 25000;
  const sipRate = params.sipReturnRate ?? 12.0;
  const sipYears = params.sipHorizonYears ?? loanYears;

  const income = params.annualIncome ?? 1800000;
  const ded80C = params.section80C ?? 150000;
  const ded80D = params.section80D ?? 25000;

  // 1. Amortization Schedule (Deterministic Home Loan Calculation)
  const monthlyRate = loanRate / 12 / 100;
  const totalMonths = loanYears * 12;
  const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  let balance = loanAmount;
  const yearlyAmortization: Array<{
    year: number;
    principal: number;
    interest: number;
    balance: number;
    totalPaid: number;
  }> = [];

  for (let y = 1; y <= loanYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) break;
      const interestPortion = balance * monthlyRate;
      const principalPortion = Math.min(balance, emi - interestPortion);
      balance -= principalPortion;
      yearPrincipal += principalPortion;
      yearInterest += interestPortion;
    }
    yearlyAmortization.push({
      year: y,
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      balance: Math.max(0, Math.round(balance)),
      totalPaid: Math.round(yearPrincipal + yearInterest),
    });
  }

  const totalInterestPaid = yearlyAmortization.reduce((acc, curr) => acc + curr.interest, 0);

  // 2. Compounding SIP Schedule (Deterministic Wealth Growth)
  const monthlySipRate = sipRate / 12 / 100;
  const yearlyCompounding: Array<{
    year: number;
    invested: number;
    wealth: number;
    gains: number;
  }> = [];

  let cumulativeSip = 0;
  for (let y = 1; y <= sipYears; y++) {
    const monthsPassed = y * 12;
    cumulativeSip = monthlySip * monthsPassed;
    // FV of annuity: P * (( (1 + r)^n - 1 ) / r) * (1 + r)
    const futureValue = monthlySip * ((Math.pow(1 + monthlySipRate, monthsPassed) - 1) / monthlySipRate) * (1 + monthlySipRate);
    yearlyCompounding.push({
      year: y,
      invested: Math.round(cumulativeSip),
      wealth: Math.round(futureValue),
      gains: Math.max(0, Math.round(futureValue - cumulativeSip)),
    });
  }

  const totalSipInvested = monthlySip * 12 * sipYears;
  const finalSipCorpus = yearlyCompounding[yearlyCompounding.length - 1]?.wealth ?? 0;

  // 3. Tax Regime Comparison (Deterministic Old vs New Regime via Statutory AY 2026-27 Engine)
  // Sec 24b Home Loan Interest: up to ₹2,00,000 in Old Regime
  const homeLoanInterestDeduction = Math.min(200000, yearlyAmortization[0]?.interest ?? 200000);
  const eligibleOldAdditionalDeductions = Math.min(150000, ded80C) + ded80D + homeLoanInterestDeduction;

  const oldRegimeRes = calculateIndiaIncomeTaxAY2026_27({
    grossIncome: income,
    salaryIncome: income,
    additionalDeductions: eligibleOldAdditionalDeductions,
    regime: 'OLD',
  });

  const newRegimeRes = calculateIndiaIncomeTaxAY2026_27({
    grossIncome: income,
    salaryIncome: income,
    regime: 'NEW',
  });

  const oldTax = oldRegimeRes.totalTax;
  const newTax = newRegimeRes.totalTax;
  const oldDeductions = oldRegimeRes.standardDeduction + oldRegimeRes.additionalDeductions;
  const newDeductions = newRegimeRes.standardDeduction + newRegimeRes.additionalDeductions;
  const oldTaxable = oldRegimeRes.taxableIncome;
  const newTaxable = newRegimeRes.taxableIncome;

  const regimeComparison = [
    { label: 'Gross Annual Income', oldRegime: income, newRegime: income },
    { label: 'Eligible Deductions', oldRegime: oldDeductions, newRegime: newDeductions },
    { label: 'Net Taxable Income', oldRegime: oldTaxable, newRegime: newTaxable },
    { label: 'Total Tax Payable', oldRegime: oldTax, newRegime: newTax },
    { label: 'Net In-Hand Take Home', oldRegime: income - oldTax, newRegime: income - newTax },
  ];

  const taxSlabsDistribution = [
    { name: 'Take-Home Cashflow', value: income - Math.min(oldTax, newTax) },
    { name: 'Income Tax Liability', value: Math.min(oldTax, newTax) },
    { name: 'Home Loan Annual EMI', value: Math.round(emi * 12) },
    { name: 'Planned Annual SIP', value: monthlySip * 12 },
  ];

  return {
    rawInputs: { loanAmount, loanRate, loanYears, monthlySip, sipRate, sipYears, income, ded80C, ded80D },
    summary: {
      monthlyEmi: Math.round(emi),
      totalLoanInterest: Math.round(totalInterestPaid),
      totalCostOfLoan: Math.round(loanAmount + totalInterestPaid),
      totalSipInvested: Math.round(totalSipInvested),
      finalSipCorpus: Math.round(finalSipCorpus),
      sipWealthGain: Math.round(finalSipCorpus - totalSipInvested),
      oldRegimeTax: oldTax,
      newRegimeTax: newTax,
      taxDifference: Math.abs(oldTax - newTax),
      recommendedRegime: newTax <= oldTax ? 'New Tax Regime' : 'Old Tax Regime',
    },
    chartDataSets: {
      amortization: yearlyAmortization,
      regimeComparison,
      compounding: yearlyCompounding,
      slabs: taxSlabsDistribution,
    },
  };
}
