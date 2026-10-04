import { annuityPresentValue, roundMoney } from '../../engines/financial-maths/index.ts';

export interface GratuityInput {
  lastDrawnSalary: number; // Basic + DA
  completedYearsOfService: number;
  isCoveredUnderGratuityAct?: boolean;
}
export interface GratuityResult {
  gratuityAmount: number;
  taxFreeLimit: number;
  taxableGratuity: number;
}

export function calculateGratuity(input: GratuityInput): GratuityResult {
  const salary = Math.max(0, input.lastDrawnSalary);
  const years = Math.max(0, input.completedYearsOfService);
  const covered = input.isCoveredUnderGratuityAct !== false;

  let gratuityAmount = 0;
  if (covered) {
    gratuityAmount = (15 * salary * years) / 26;
  } else {
    gratuityAmount = (15 * salary * years) / 30; // standard non-covered formula
  }

  const taxFreeLimit = 2000000; // ₹20 Lakh limit as per latest rules
  const taxableGratuity = Math.max(0, gratuityAmount - taxFreeLimit);

  return {
    gratuityAmount: roundMoney(gratuityAmount),
    taxFreeLimit,
    taxableGratuity: roundMoney(taxableGratuity),
  };
}

export interface RetirementCorpusInput {
  monthlyExpensesToday: number;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  inflationPercent: number;
  preRetirementReturnPercent: number;
  postRetirementReturnPercent: number;
}
export interface RetirementCorpusResult {
  monthlyExpensesAtRetirement: number;
  targetCorpus: number;
  requiredMonthlySavings: number;
}

export function calculateRetirementCorpus(input: RetirementCorpusInput): RetirementCorpusResult {
  const expToday = Math.max(0, input.monthlyExpensesToday);
  const currentAge = Math.max(18, input.currentAge);
  const retAge = Math.max(currentAge + 1, input.retirementAge || 60);
  const lifeExp = Math.max(retAge + 1, input.lifeExpectancy || 85);
  const inf = (input.inflationPercent || 6) / 100;
  const preReturn = (input.preRetirementReturnPercent || 12) / 100;
  const postReturn = (input.postRetirementReturnPercent || 8) / 100;

  const yearsToRetire = retAge - currentAge;
  const yearsInRetirement = lifeExp - retAge;

  // 1. Inflate expenses to retirement age
  const monthlyExpensesAtRetirement = expToday * Math.pow(1 + inf, yearsToRetire);
  const annualExpensesAtRetirement = monthlyExpensesAtRetirement * 12;

  // 2. Compute post-retirement real rate of return
  const postRealRate = (1 + postReturn) / (1 + inf) - 1;

  // 3. Compute target corpus (PV of inflation-adjusted annuity)
  const targetCorpus = annuityPresentValue(annualExpensesAtRetirement, postRealRate, yearsInRetirement);

  // 4. Compute required monthly savings to accumulate target corpus
  const monthlyPreReturn = preReturn / 12;
  const totalMonths = yearsToRetire * 12;

  let requiredMonthlySavings = 0;
  if (monthlyPreReturn > 0) {
    requiredMonthlySavings = targetCorpus / (((Math.pow(1 + monthlyPreReturn, totalMonths) - 1) / monthlyPreReturn) * (1 + monthlyPreReturn));
  } else {
    requiredMonthlySavings = targetCorpus / totalMonths;
  }

  return {
    monthlyExpensesAtRetirement: roundMoney(monthlyExpensesAtRetirement),
    targetCorpus: roundMoney(targetCorpus),
    requiredMonthlySavings: roundMoney(requiredMonthlySavings),
  };
}
