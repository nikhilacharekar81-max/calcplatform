import { compoundInterest, roundMoney } from '../../engines/financial-maths/index.ts';

export interface SimpleInterestInput {
  principal: number;
  rate: number;
  years: number;
}
export interface SimpleInterestResult {
  principal: number;
  interestEarned: number;
  totalValue: number;
}

export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const p = Math.max(0, input.principal);
  const r = Math.max(0, input.rate);
  const t = Math.max(0, input.years);
  const interestEarned = p * (r / 100) * t;
  return {
    principal: p,
    interestEarned: roundMoney(interestEarned),
    totalValue: roundMoney(p + interestEarned),
  };
}

export interface CompoundInterestInput {
  principal: number;
  rate: number;
  years: number;
  compoundingFrequency?: 'monthly' | 'quarterly' | 'half-yearly' | 'annually';
}
export interface CompoundInterestResult {
  principal: number;
  interestEarned: number;
  totalValue: number;
  chartData: Array<{ year: number; principal: number; interest: number; total: number }>;
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const p = Math.max(0, input.principal);
  const r = Math.max(0, input.rate);
  const t = Math.max(0, input.years);
  const freq = input.compoundingFrequency || 'annually';

  let n = 1;
  if (freq === 'monthly') n = 12;
  else if (freq === 'quarterly') n = 4;
  else if (freq === 'half-yearly') n = 2;

  const totalValue = p * Math.pow(1 + r / 100 / n, n * t);
  const interestEarned = totalValue - p;

  const chartData: any[] = [];
  for (let y = 1; y <= Math.ceil(t); y++) {
    const val = p * Math.pow(1 + r / 100 / n, n * y);
    chartData.push({
      year: y,
      principal: roundMoney(p),
      interest: roundMoney(val - p),
      total: roundMoney(val),
    });
  }

  return {
    principal: p,
    interestEarned: roundMoney(interestEarned),
    totalValue: roundMoney(totalValue),
    chartData,
  };
}

export interface SipInput {
  monthlyInvestment: number;
  rate: number;
  years: number;
}
export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
  chartData: Array<{ year: number; invested: number; returns: number; total: number }>;
}

export function calculateSip(input: SipInput): SipResult {
  const p = Math.max(0, input.monthlyInvestment);
  const annualRate = Math.max(0, input.rate);
  const years = Math.max(0, input.years);

  const monthlyRate = annualRate / 12 / 100;
  const months = Math.ceil(years * 12);

  let totalValue = 0;
  if (monthlyRate > 0) {
    totalValue = p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  } else {
    totalValue = p * months;
  }

  const totalInvested = p * months;
  const estimatedReturns = totalValue - totalInvested;

  const chartData: any[] = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const m = y * 12;
    let val = 0;
    if (monthlyRate > 0) {
      val = p * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
    } else {
      val = p * m;
    }
    const inv = p * m;
    chartData.push({
      year: y,
      invested: roundMoney(inv),
      returns: roundMoney(val - inv),
      total: roundMoney(val),
    });
  }

  return {
    totalInvested: roundMoney(totalInvested),
    estimatedReturns: roundMoney(estimatedReturns),
    totalValue: roundMoney(totalValue),
    chartData,
  };
}

export interface StepUpSipInput {
  monthlyInvestment: number;
  stepUpPercent: number;
  rate: number;
  years: number;
}
export interface StepUpSipResult {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
  chartData: Array<{ year: number; invested: number; returns: number; total: number }>;
}

export function calculateStepUpSip(input: StepUpSipInput): StepUpSipResult {
  const initialP = Math.max(0, input.monthlyInvestment);
  const stepUp = Math.max(0, input.stepUpPercent) / 100;
  const annualRate = Math.max(0, input.rate);
  const years = Math.max(0, input.years);

  const monthlyRate = annualRate / 12 / 100;
  let totalInvested = 0;
  let totalValue = 0;

  const chartData: any[] = [];

  for (let y = 1; y <= Math.ceil(years); y++) {
    // Current year monthly investment amount
    const yearPremium = initialP * Math.pow(1 + stepUp, y - 1);
    for (let m = 1; m <= 12; m++) {
      totalInvested += yearPremium;
      totalValue = (totalValue + yearPremium) * (1 + monthlyRate);
    }
    chartData.push({
      year: y,
      invested: roundMoney(totalInvested),
      returns: roundMoney(totalValue - totalInvested),
      total: roundMoney(totalValue),
    });
  }

  return {
    totalInvested: roundMoney(totalInvested),
    estimatedReturns: roundMoney(totalValue - totalInvested),
    totalValue: roundMoney(totalValue),
    chartData,
  };
}

export interface SwpInput {
  totalInvestment: number;
  withdrawalAmount: number;
  rate: number;
  years: number;
}
export interface SwpResult {
  totalInvested: number;
  totalWithdrawn: number;
  remainingBalance: number;
  chartData: Array<{ year: number; balance: number; withdrawn: number }>;
}

export function calculateSwp(input: SwpInput): SwpResult {
  const initial = Math.max(0, input.totalInvestment);
  const w = Math.max(0, input.withdrawalAmount);
  const annualRate = Math.max(0, input.rate);
  const years = Math.max(0, input.years);

  const monthlyRate = annualRate / 12 / 100;
  let balance = initial;
  let totalWithdrawn = 0;

  const chartData: any[] = [];

  for (let y = 1; y <= Math.ceil(years); y++) {
    for (let m = 1; m <= 12; m++) {
      if (balance > 0) {
        const withdraw = Math.min(balance, w);
        balance -= withdraw;
        totalWithdrawn += withdraw;
        balance = balance * (1 + monthlyRate);
      }
    }
    chartData.push({
      year: y,
      balance: roundMoney(balance),
      withdrawn: roundMoney(totalWithdrawn),
    });
  }

  return {
    totalInvested: initial,
    totalWithdrawn: roundMoney(totalWithdrawn),
    remainingBalance: roundMoney(balance),
    chartData,
  };
}

export interface CagrInput {
  initialValue: number;
  finalValue: number;
  years: number;
}
export interface CagrResult {
  cagr: number;
  cagrFormatted: string;
  absoluteReturnPercent: number;
}

export function calculateCagr(input: CagrInput): CagrResult {
  const init = Math.max(1, input.initialValue);
  const final = Math.max(0, input.finalValue);
  const years = Math.max(0.1, input.years);

  const cagr = (Math.pow(final / init, 1 / years) - 1) * 100;
  const abs = ((final - init) / init) * 100;

  return {
    cagr,
    cagrFormatted: `${cagr.toFixed(2)}%`,
    absoluteReturnPercent: abs,
  };
}
