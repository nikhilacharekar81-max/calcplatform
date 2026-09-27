/**
 * Compound Interest & Wealth Accumulation Engine
 * Models compounding frequencies, recurring deposits, deposit timing (ordinary vs due),
 * annual contribution step-ups, inflation discounting (Fisher equation), tax drag, and growth tipping points.
 */

export interface CompoundInputs {
  initialPrincipal: number;
  additionalContribution: number;
  contributionFrequency: 'monthly' | 'annually';
  depositTiming: 'beginning' | 'end';
  annualRate: number;
  compoundingFrequency: number; // 1, 2, 4, 12, 365
  years: number;
  annualStepUp?: number; // % annual contribution increase
  inflationRate?: number;
  taxRate?: number; // % tax drag
}

export interface CompoundYearRow {
  year: number;
  startingBalance: number;
  annualContributions: number;
  totalContributions: number;
  interestEarned: number;
  totalInterestEarned: number;
  endingBalance: number;
  realEndingBalance: number;
}

export interface CompoundResults {
  finalBalance: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterestEarned: number;
  finalRealBalance: number;
  effectiveApy: number;
  tippingPointMonth: number | null;
  yearlySchedule: CompoundYearRow[];
  monthlySchedule: Array<{
    month: number;
    year: number;
    startingBalance: number;
    contribution: number;
    interestEarned: number;
    endingBalance: number;
    totalInterestEarned: number;
    realEndingBalance: number;
  }>;
}

export function calculateCompoundInterest(inputs: CompoundInputs): CompoundResults {
  const P = Math.max(0, inputs.initialPrincipal || 0);
  const baseContrib = Math.max(0, inputs.additionalContribution || 0);
  const isMonthlyContrib = inputs.contributionFrequency === 'monthly';
  const isBeginning = inputs.depositTiming === 'beginning';
  const grossRate = Math.max(0, inputs.annualRate || 0) / 100;
  const taxDrag = Math.max(0, inputs.taxRate || 0) / 100;
  const netRate = grossRate * (1 - taxDrag);
  const inflation = Math.max(0, inputs.inflationRate || 0) / 100;
  const stepUp = Math.max(0, inputs.annualStepUp || 0) / 100;

  const years = Math.max(1, inputs.years || 20);
  const totalMonths = years * 12;
  const n = inputs.compoundingFrequency || 12;
  const monthlyRate = netRate / 12;

  // Effective APY
  const apy = (Math.pow(1 + netRate / n, n) - 1) * 100;

  let currentBalance = P;
  let cumContributions = 0;
  let cumInterest = 0;
  let tippingPointMonth: number | null = null;

  const monthlySchedule = [];
  const yearlySchedule: CompoundYearRow[] = [];

  let currentMonthlyContrib = baseContrib;
  let yrStartBal = P;
  let yrContrib = 0;
  let yrInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const currentYear = Math.ceil(m / 12);
    // Apply annual step-up to monthly contribution at beginning of each year
    if (m > 1 && (m - 1) % 12 === 0 && stepUp > 0) {
      currentMonthlyContrib = currentMonthlyContrib * (1 + stepUp);
    }

    const startBal = currentBalance;
    const monthlyDeposit = isMonthlyContrib ? currentMonthlyContrib : (m % 12 === 0 ? currentMonthlyContrib : 0);

    let interestEarned = 0;
    if (isBeginning) {
      currentBalance += monthlyDeposit;
      cumContributions += monthlyDeposit;
      interestEarned = currentBalance * monthlyRate;
      currentBalance += interestEarned;
    } else {
      interestEarned = currentBalance * monthlyRate;
      currentBalance += interestEarned + monthlyDeposit;
      cumContributions += monthlyDeposit;
    }

    cumInterest += interestEarned;
    yrContrib += monthlyDeposit;
    yrInterest += interestEarned;

    // Real inflation-adjusted purchasing power
    const realBalance = currentBalance / Math.pow(1 + inflation, m / 12);

    // Check Tipping Point (Cum Interest > Total Out of Pocket Deposits)
    const totalOutofPocket = P + cumContributions;
    if (cumInterest >= totalOutofPocket && tippingPointMonth === null) {
      tippingPointMonth = m;
    }

    monthlySchedule.push({
      month: m,
      year: currentYear,
      startingBalance: startBal,
      contribution: monthlyDeposit,
      interestEarned,
      endingBalance: currentBalance,
      totalInterestEarned: cumInterest,
      realEndingBalance: realBalance,
    });

    if (m % 12 === 0 || m === totalMonths) {
      yearlySchedule.push({
        year: currentYear,
        startingBalance: yrStartBal,
        annualContributions: yrContrib,
        totalContributions: cumContributions,
        interestEarned: yrInterest,
        totalInterestEarned: cumInterest,
        endingBalance: currentBalance,
        realEndingBalance: realBalance,
      });
      yrStartBal = currentBalance;
      yrContrib = 0;
      yrInterest = 0;
    }
  }

  return {
    finalBalance: currentBalance,
    totalPrincipal: P,
    totalContributions: cumContributions,
    totalInterestEarned: cumInterest,
    finalRealBalance: currentBalance / Math.pow(1 + inflation, years),
    effectiveApy: apy,
    tippingPointMonth,
    yearlySchedule,
    monthlySchedule,
  };
}
