/**
 * Personal Loan & Debt Consolidation Engine
 * Models personal loan amortization, bi-weekly vs monthly schedules, lump sum extra payments,
 * side-by-side scenario comparisons (Loan A vs Loan B), and DTI ratio calculation.
 */

export interface LoanScheduleRow {
  month: number;
  startingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  cumulativeInterest: number;
}

export interface PersonalLoanInputs {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  extraPayment?: number;
  lumpSumAmount?: number;
  lumpSumMonth?: number;
  paymentFrequency?: 'monthly' | 'biweekly';
}

export function calculatePersonalLoan(inputs: PersonalLoanInputs) {
  const P = Math.max(0, inputs.loanAmount || 0);
  const annualRate = Math.max(0, inputs.interestRate || 0);
  const n = Math.max(1, inputs.loanTermMonths || 36);
  const extra = Math.max(0, inputs.extraPayment || 0);
  const lumpSum = Math.max(0, inputs.lumpSumAmount || 0);
  const lumpMonth = inputs.lumpSumMonth || 12;
  const isBiweekly = inputs.paymentFrequency === 'biweekly';

  const r = (annualRate / 100) / 12;
  const standardMonthly = r > 0 ? P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
  const baselineTotalInterest = (standardMonthly * n) - P;

  const biweeklyRate = (annualRate / 100) / 26;
  const biweeklyBase = standardMonthly / 2;

  const activeRate = isBiweekly ? biweeklyRate : r;
  const activeBase = isBiweekly ? biweeklyBase : standardMonthly;

  let remainingBalance = P;
  let cumInterest = 0;
  let actualPeriods = 0;
  const schedule: LoanScheduleRow[] = [];

  while (remainingBalance > 0.01 && actualPeriods < n * 3) {
    actualPeriods++;
    const interest = remainingBalance * activeRate;
    let principal = (activeBase - interest) + extra;

    if (actualPeriods === lumpMonth && lumpSum > 0) {
      principal += lumpSum;
    }

    if (principal > remainingBalance) principal = remainingBalance;

    cumInterest += interest;
    remainingBalance -= principal;
    if (remainingBalance < 0) remainingBalance = 0;

    schedule.push({
      month: actualPeriods,
      startingBalance: remainingBalance + principal,
      payment: principal + interest,
      principal,
      interest,
      remainingBalance,
      cumulativeInterest: cumInterest,
    });

    if (remainingBalance <= 0) break;
  }

  const interestSaved = Math.max(0, baselineTotalInterest - cumInterest);
  const actualMonths = isBiweekly ? Math.ceil(actualPeriods / 2.166) : actualPeriods;
  const monthsSaved = Math.max(0, n - actualMonths);

  return {
    loanAmount: P,
    standardMonthlyPayment: standardMonthly,
    periodicPayment: activeBase,
    totalInterest: cumInterest,
    totalCost: P + cumInterest,
    actualMonths,
    interestSaved,
    monthsSaved,
    schedule,
  };
}

export function calculateDtiRatio(params: {
  monthlyDebtPayments: number;
  grossMonthlyIncome: number;
}) {
  const debt = Math.max(0, params.monthlyDebtPayments || 0);
  const income = Math.max(1, params.grossMonthlyIncome || 1);
  const dti = (debt / income) * 100;

  let riskTier = 'Prime Tier (<35%)';
  let statusColor = 'emerald';
  if (dti > 50) {
    riskTier = 'High Default Risk (>50%)';
    statusColor = 'rose';
  } else if (dti > 43) {
    riskTier = 'Elevated Risk (44%-50%)';
    statusColor = 'amber';
  } else if (dti > 35) {
    riskTier = 'Acceptable (36%-43%)';
    statusColor = 'blue';
  }

  return {
    dtiPercentage: dti,
    riskTier,
    statusColor,
  };
}
