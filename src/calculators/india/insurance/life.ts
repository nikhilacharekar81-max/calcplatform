import { roundMoney } from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface TermLifeInput {
  age?: number;
  currentAge?: number;
  annualIncome: number;
  monthlyExpenses?: number;
  retirementAge?: number;
  dependents?: number;
  outstandingLoans?: number;
  outstandingDebts?: number;
  existingLifeCover?: number;
  existingSavings?: number;
  futureFinancialGoals?: number;
  futureGoals?: number;
  goalYears?: number;
  yearsUntilGoal?: number;
  inflationRate?: number;
  expectedReturnPercent?: number;
  investmentReturn?: number;
  incomeMultipleYears?: number;
  estimatedAnnualPremium?: number;
  isGroupPolicy?: boolean;
}

export interface TermLifeResult {
  recommendedLifeCover: number;
  recommendedSumAssured: number;
  recommendedSumAssuredFormatted: string;
  existingCover: number;
  protectionGap: number;
  incomeReplacement: number;
  loanProtection: number;
  goalProtection: number;
  incomeReplacementNeed: number;
  outstandingDebts: number;
  netProtectionGap: number;
  section80cEligiblePremiumDeduction: number;
  /** @deprecated Backward-compatibility alias for section80cEligiblePremiumDeduction */
  section80cTaxBenefit: number;
  applicableGstPercent: number;
  section10_10dStatusNote: string;
  assumptions: {
    inflationRatePercent: number;
    investmentReturnPercent: number;
    dependentsCount: number;
  };
  disclaimer: string;
  termStackedBars: Array<{
    category: string;
    incomeReplacement?: number;
    loanProtection?: number;
    goalProtection?: number;
    existingCover?: number;
    existingSavings?: number;
    protectionGap?: number;
    total: number;
  }>;
}

/**
 * Calculates Present Value of an inflation-adjusted annuity of living expenses.
 * Uses real discount rate: r_real = (1 + r_return) / (1 + r_inflation) - 1.
 */
export function calculateLivingExpensesPV(
  annualExpenses: number,
  inflationRatePercent: number,
  expectedReturnPercent: number,
  years: number
): number {
  if (years <= 0 || annualExpenses <= 0) return 0;
  const inf = inflationRatePercent / 100;
  const ret = expectedReturnPercent / 100;
  const realRate = (1 + ret) / (1 + inf) - 1;

  if (Math.abs(realRate) < 0.0001) {
    return roundMoney(annualExpenses * years);
  }
  const pv = annualExpenses * (1 - Math.pow(1 + realRate, -years)) / realRate;
  return roundMoney(pv);
}

/**
 * 1. Term Insurance Calculator — Income Replacement, Debt, Goal & Net Protection Gap
 */
export function calculateTermLifeInsurance(input: TermLifeInput): TermLifeResult {
  const annualIncome = Math.max(0, input.annualIncome ?? 0);
  const age = Math.max(18, input.age ?? input.currentAge ?? 30);
  const retAge = Math.max(age + 1, input.retirementAge ?? 60);
  const workingYears = Math.max(1, retAge - age);
  const dependents = Math.max(0, input.dependents ?? 0);

  const debts = Math.max(0, input.outstandingLoans ?? input.outstandingDebts ?? 0);
  const existingCover = Math.max(0, input.existingLifeCover ?? 0);
  const existingSavings = Math.max(0, input.existingSavings ?? 0);
  const goalToday = Math.max(0, input.futureFinancialGoals ?? input.futureGoals ?? 0);
  const goalYears = Math.max(0, input.goalYears ?? input.yearsUntilGoal ?? 0);
  const inflationRate = input.inflationRate !== undefined ? input.inflationRate : 6.0;
  const returnRate = input.investmentReturn ?? input.expectedReturnPercent ?? 8.5;

  const infDec = inflationRate / 100;
  const retDec = returnRate / 100;
  const futureNominalGoal = goalToday * Math.pow(1 + infDec, goalYears);
  const goalPV = goalYears > 0 && retDec >= 0
    ? futureNominalGoal / Math.pow(1 + retDec, goalYears)
    : futureNominalGoal;
  const goals = roundMoney(goalPV);

  // Income replacement need: calculated using monthly expenses or annual income multiple with dependents calibration
  let incomeReplacement: number;
  if (input.monthlyExpenses !== undefined) {
    const annualExp = Math.max(0, input.monthlyExpenses) * 12;
    incomeReplacement = calculateLivingExpensesPV(annualExp, inflationRate, returnRate, workingYears);
  } else {
    const multipleYears = input.incomeMultipleYears ?? Math.min(workingYears, Math.max(10, 10 + dependents * 2.5));
    incomeReplacement = annualIncome * multipleYears;
  }

  const grossNeed = incomeReplacement + debts + goals;
  const existingSetup = existingCover + existingSavings;
  const netProtectionGap = Math.max(0, grossNeed - existingSetup);
  const recommendedSumAssured = Math.ceil(netProtectionGap / 100000) * 100000;

  // Retrieve statutory parameters
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const max80cLimit = rule.parameters.section80C.maxDeductionLimit;
  const gstRules = rule.parameters.gstRatesPercent;

  const estPremium = input.estimatedAnnualPremium || (recommendedSumAssured * 0.001);
  // Section 80C deduction is based on actual eligible premium paid (capped at ₹1.5L and 10% of sum assured)
  const maxEligiblePremiumBySum = recommendedSumAssured > 0 ? (recommendedSumAssured * 0.10) : 0;
  const eligiblePremium = Math.min(estPremium, maxEligiblePremiumBySum);
  const section80cTaxBenefit = Math.min(max80cLimit, eligiblePremium);

  const section10_10dStatusNote = "Death benefit sum assured received by beneficiaries under a pure term life insurance policy is 100% tax-free under Section 10(10D) of the Income-tax Act.";

  const gstPercent = input.isGroupPolicy ? gstRules.groupLifeHealthInsurance : gstRules.individualLifeInsurance;

  // Visual Breakdown Dataset: Stacked Bar Chart (Total Needs vs Existing Setup)
  const termStackedBars = [
    {
      category: 'Total Needs Breakdown',
      incomeReplacement: roundMoney(incomeReplacement),
      loanProtection: roundMoney(debts),
      goalProtection: roundMoney(goals),
      total: roundMoney(grossNeed),
    },
    {
      category: 'Existing Setup',
      existingCover: roundMoney(existingCover),
      existingSavings: roundMoney(existingSavings),
      protectionGap: roundMoney(netProtectionGap),
      total: roundMoney(grossNeed),
    },
  ];

  return {
    recommendedLifeCover: recommendedSumAssured,
    recommendedSumAssured,
    recommendedSumAssuredFormatted: `₹${(recommendedSumAssured / 100000).toFixed(2)} Lakh`,
    existingCover: roundMoney(existingCover),
    protectionGap: roundMoney(netProtectionGap),
    incomeReplacement: roundMoney(incomeReplacement),
    loanProtection: roundMoney(debts),
    goalProtection: roundMoney(goals),
    incomeReplacementNeed: roundMoney(incomeReplacement),
    outstandingDebts: roundMoney(debts),
    netProtectionGap: roundMoney(netProtectionGap),
    section80cEligiblePremiumDeduction: roundMoney(section80cTaxBenefit),
    section80cTaxBenefit: roundMoney(section80cTaxBenefit),
    applicableGstPercent: gstPercent,
    section10_10dStatusNote,
    assumptions: {
      inflationRatePercent: inflationRate,
      investmentReturnPercent: returnRate,
      dependentsCount: dependents,
    },
    disclaimer: "Income replacement multiples are CalcPlatform Planning Assumptions. Individual life policies are exempt from GST (0%) post Sept 22, 2025.",
    termStackedBars,
  };
}

export interface LifeNeedsInput {
  age?: number;
  currentAge?: number;
  annualIncome?: number;
  monthlyExpenses?: number;
  annualFamilyExpenses?: number;
  retirementAge?: number;
  dependents?: number;
  homeLoan?: number;
  otherDebts?: number;
  loans?: number;
  totalDebts?: number;
  finalEmergencyExpenses?: number;
  existingLifeCover?: number;
  existingLifeInsurance?: number;
  employerLifeInsurance?: number;
  spouseDependentIncome?: number;
  savings?: number;
  investments?: number;
  currentAssets?: number;
  futureGoals?: number;
  childrenEducationCostToday?: number;
  childrenMarriageCostToday?: number;
  goalYears?: number;
  yearsUntilGoal?: number;
  inflationRate?: number;
  inflationRatePercent?: number;
  investmentReturn?: number;
  expectedReturnRatePercent?: number;
  yearsOfSupportNeeded?: number;
  personalExpenseRatioPercent?: number;
}

export interface LifeNeedsResult {
  totalFinancialNeed: number;
  availableResources: number;
  insuranceRequired: number;
  protectionGap: number;
  totalFinancialNeedToday: number;
  incomeReplacementCorpus: number;
  homeLoanProtection: number;
  otherDebtsProtection: number;
  futureFinancialGoals: number;
  futureInflationAdjustedGoals: number;
  finalEmergencyExpenses: number;
  existingPersonalCover: number;
  employerLifeInsurance: number;
  savingsAndInvestments: number;
  spouseIncomePresentValue: number;
  existingResources: number;
  netInsuranceRequired: number;
  netInsuranceRequiredFormatted: string;
  methodologyComparison: {
    incomeMultipleMethod: number;
    dimeMethod: number;
    detailedNeedsMethod: number;
  };
  needsComparisonBars: Array<{
    category: string;
    totalNeed: number;
    availableResources: number;
    protectionGap: number;
  }>;
}

/**
 * 2. Life Insurance Needs Calculator — Comprehensive Net Need & Goal Discounting
 */
export function calculateLifeInsuranceNeeds(input: LifeNeedsInput): LifeNeedsResult {
  const age = Math.max(18, input.age ?? input.currentAge ?? 32);
  const retAge = Math.max(age + 1, input.retirementAge ?? 60);
  const workingYears = Math.max(1, retAge - age);
  const annualIncome = Math.max(0, input.annualIncome ?? 0);

  let expenses = 0;
  if (input.annualFamilyExpenses !== undefined && input.annualFamilyExpenses !== null) {
    expenses = Math.max(0, input.annualFamilyExpenses);
  } else if (input.monthlyExpenses !== undefined && input.monthlyExpenses !== null) {
    expenses = Math.max(0, input.monthlyExpenses * 12);
  } else if (annualIncome > 0) {
    // Default family household expense (using configurable personalExpenseRatioPercent, default 30%)
    const personalExpPct = input.personalExpenseRatioPercent !== undefined ? input.personalExpenseRatioPercent : 30;
    expenses = annualIncome * Math.max(0, 1 - personalExpPct / 100);
  }

  const years = Math.max(1, input.yearsOfSupportNeeded || workingYears);
  const infRate = input.inflationRate ?? input.inflationRatePercent ?? 6.0;
  const returnRate = input.investmentReturn ?? input.expectedReturnRatePercent ?? 8.5;

  const incomeReplacementCorpus = calculateLivingExpensesPV(expenses, infRate, returnRate, years);

  const eduCost = Math.max(0, input.childrenEducationCostToday ?? 0);
  const marriageCost = Math.max(0, input.childrenMarriageCostToday ?? 0);
  const futureGoalsToday = Math.max(0, input.futureGoals ?? (eduCost + marriageCost));
  const goalYears = Math.max(0, input.goalYears ?? input.yearsUntilGoal ?? 0);

  const homeLoan = Math.max(0, input.homeLoan ?? 0);
  const otherDebts = Math.max(0, input.otherDebts ?? input.loans ?? input.totalDebts ?? 0);
  const emergencyExpenses = Math.max(0, input.finalEmergencyExpenses ?? 0);

  const savings = Math.max(0, input.savings ?? 0);
  const investments = Math.max(0, input.investments ?? 0);
  const savingsAndInvestments = Math.max(0, input.currentAssets ?? (savings + investments));
  
  const existingPersonalCover = Math.max(0, input.existingLifeCover ?? input.existingLifeInsurance ?? 0);
  const employerLifeInsurance = Math.max(0, input.employerLifeInsurance ?? 0);
  const spouseDependentIncomeAnnual = Math.max(0, input.spouseDependentIncome ?? 0);
  const spouseIncomePresentValue = calculateLivingExpensesPV(spouseDependentIncomeAnnual, infRate, returnRate, years);

  const infDec = infRate / 100;
  const retDec = returnRate / 100;
  const futureInflationAdjustedGoals = roundMoney(futureGoalsToday * Math.pow(1 + infDec, goalYears));
  const goalPV = goalYears > 0 && retDec >= 0
    ? futureInflationAdjustedGoals / Math.pow(1 + retDec, goalYears)
    : futureInflationAdjustedGoals;

  const totalNeed = incomeReplacementCorpus + roundMoney(goalPV) + homeLoan + otherDebts + emergencyExpenses;
  const availableResources = savingsAndInvestments + existingPersonalCover + employerLifeInsurance + spouseIncomePresentValue;
  const protectionGap = Math.max(0, totalNeed - availableResources);
  const netInsuranceRequired = Math.ceil(protectionGap / 100000) * 100000;

  // 3 Methodology Comparison Models (all properly net of existing cover):
  // 1. Income Multiple: 10x Annual Income minus existing personal & employer cover
  const grossIncomeMultiple = annualIncome * 10;
  const incomeMultipleMethod = Math.ceil(Math.max(0, grossIncomeMultiple - (existingPersonalCover + employerLifeInsurance)) / 100000) * 100000;

  // 2. DIME Method: Debt + Income Replacement + Mortgage + Education/Goals minus existing resources
  const dimeTotal = otherDebts + incomeReplacementCorpus + homeLoan + roundMoney(goalPV) + emergencyExpenses;
  const dimeMethod = Math.ceil(Math.max(0, dimeTotal - availableResources) / 100000) * 100000;

  // 3. Detailed Needs Analysis: Discounted PV Needs - Resources
  const detailedNeedsMethod = netInsuranceRequired;

  // Comparison View: Grouped Bar Chart
  const needsComparisonBars = [
    {
      category: 'Total Need',
      totalNeed: roundMoney(totalNeed),
      availableResources: 0,
      protectionGap: 0,
    },
    {
      category: 'Available Resources',
      totalNeed: 0,
      availableResources: roundMoney(availableResources),
      protectionGap: 0,
    },
    {
      category: 'Protection Gap',
      totalNeed: 0,
      availableResources: 0,
      protectionGap: roundMoney(protectionGap),
    },
  ];

  return {
    totalFinancialNeed: roundMoney(totalNeed),
    availableResources: roundMoney(availableResources),
    insuranceRequired: netInsuranceRequired,
    protectionGap: roundMoney(protectionGap),
    totalFinancialNeedToday: roundMoney(totalNeed),
    incomeReplacementCorpus: roundMoney(incomeReplacementCorpus),
    homeLoanProtection: roundMoney(homeLoan),
    otherDebtsProtection: roundMoney(otherDebts),
    futureFinancialGoals: roundMoney(futureGoalsToday),
    futureInflationAdjustedGoals: roundMoney(futureInflationAdjustedGoals),
    finalEmergencyExpenses: roundMoney(emergencyExpenses),
    existingPersonalCover: roundMoney(existingPersonalCover),
    employerLifeInsurance: roundMoney(employerLifeInsurance),
    savingsAndInvestments: roundMoney(savingsAndInvestments),
    spouseIncomePresentValue: roundMoney(spouseIncomePresentValue),
    existingResources: roundMoney(availableResources),
    netInsuranceRequired,
    netInsuranceRequiredFormatted: `₹${(netInsuranceRequired / 100000).toFixed(2)} Lakh`,
    methodologyComparison: {
      incomeMultipleMethod,
      dimeMethod,
      detailedNeedsMethod,
    },
    needsComparisonBars,
  };
}

export interface HumanLifeValueInput {
  age?: number;
  currentAge?: number;
  retirementAge?: number;
  annualIncome: number;
  annualPersonalExpenses?: number;
  personalExpensesPercent?: number;
  expectedIncomeGrowth?: number;
  expectedAnnualIncomeGrowthPercent?: number;
  inflationRate?: number;
  investmentReturn?: number;
  discountRatePercent?: number;
}

export interface HumanLifeValueResult {
  humanLifeValue: number;
  humanLifeValueFormatted: string;
  futureIncomeValue: number;
  financialContribution: number;
  estimatedInsuranceRequirement: number;
  totalLifetimeNetEarningsPV: number;
  effectiveWorkingYears: number;
  realDiscountRatePercent: number;
  hlvTrajectory: Array<{
    year: string;
    age: number;
    presentValue: number;
    futureIncome: number;
    realPurchasingPower: number;
    cumulativePV: number;
  }>;
}

/**
 * 3. Human Life Value (HLV) Calculator — Discounted Present Value of Future Lifetime Net Earnings
 */
export function calculateHumanLifeValue(input: HumanLifeValueInput): HumanLifeValueResult {
  const age = Math.max(18, input.age ?? input.currentAge ?? 30);
  const retAge = Math.max(age + 1, input.retirementAge ?? 60);
  const workingYears = Math.max(1, retAge - age);

  const grossIncome = Math.max(0, input.annualIncome);

  let netAnnualContribution: number;
  if (input.annualPersonalExpenses !== undefined && input.annualPersonalExpenses >= 0) {
    netAnnualContribution = Math.max(0, grossIncome - input.annualPersonalExpenses);
  } else {
    const personalExpPct = (input.personalExpensesPercent !== undefined ? input.personalExpensesPercent : 30) / 100;
    netAnnualContribution = grossIncome * (1 - personalExpPct);
  }

  const growthRate = Math.max(0, input.expectedIncomeGrowth ?? input.expectedAnnualIncomeGrowthPercent ?? 8) / 100;
  const discountRate = Math.max(0, input.investmentReturn ?? input.discountRatePercent ?? 7.5) / 100;
  const inflationRate = Math.max(0, input.inflationRate !== undefined ? input.inflationRate : 6.0) / 100;

  // Real discount rate via Fisher equation
  const realDiscountRate = (1 + discountRate) / (1 + inflationRate) - 1;

  // Year-by-year curve: present value, nominal earnings, and real purchasing power up to retirement
  const hlvTrajectory: Array<{
    year: string;
    age: number;
    presentValue: number;
    futureIncome: number;
    realPurchasingPower: number;
    cumulativePV: number;
  }> = [];

  let cumPV = 0;
  let cumNominal = 0;

  for (let t = 1; t <= workingYears; t++) {
    const yrAge = age + t;
    const nominalNet = netAnnualContribution * Math.pow(1 + growthRate, t - 1);
    const pv = nominalNet / Math.pow(1 + discountRate, t);
    const realPower = nominalNet / Math.pow(1 + inflationRate, t - 1);
    cumPV += pv;
    cumNominal += nominalNet;

    hlvTrajectory.push({
      year: `Age ${yrAge}`,
      age: yrAge,
      presentValue: roundMoney(pv),
      futureIncome: roundMoney(nominalNet),
      realPurchasingPower: roundMoney(realPower),
      cumulativePV: roundMoney(cumPV),
    });
  }

  const hlv = roundMoney(cumPV);
  const estimatedInsurance = Math.ceil(hlv / 100000) * 100000;

  return {
    humanLifeValue: hlv,
    humanLifeValueFormatted: `₹${(Math.ceil(hlv / 100000) / 100).toFixed(2)} Crore`,
    futureIncomeValue: roundMoney(cumNominal),
    financialContribution: roundMoney(netAnnualContribution),
    estimatedInsuranceRequirement: estimatedInsurance,
    totalLifetimeNetEarningsPV: hlv,
    effectiveWorkingYears: workingYears,
    realDiscountRatePercent: parseFloat((realDiscountRate * 100).toFixed(2)),
    hlvTrajectory,
  };
}
