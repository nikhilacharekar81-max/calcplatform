import {
  annuityPresentValue,
  roundMoney,
} from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface TermLifeInput {
  annualIncome: number;
  currentAge: number;
  retirementAge?: number;
  outstandingDebts?: number;
  existingLifeCover?: number;
  existingSavings?: number;
  incomeMultipleYears?: number;
  estimatedAnnualPremium?: number;
  isGroupPolicy?: boolean;
}

export interface TermLifeResult {
  recommendedSumAssured: number;
  recommendedSumAssuredFormatted: string;
  incomeReplacementNeed: number;
  outstandingDebts: number;
  netProtectionGap: number;
  section80cTaxBenefit: number;
  applicableGstPercent: number;
  section10_10dStatusNote: string;
  disclaimer: string;
}

/**
 * 1. Term Insurance Calculator — Income Multiple & Net Protection Gap Methodology
 */
export function calculateTermLifeInsurance(input: TermLifeInput): TermLifeResult {
  const annualIncome = Math.max(0, input.annualIncome);
  const age = Math.max(18, input.currentAge);
  const retAge = Math.max(age + 1, input.retirementAge || 60);
  const workingYears = Math.min(40, retAge - age);
  const multipleYears = input.incomeMultipleYears || Math.min(15, workingYears);

  const debts = Math.max(0, input.outstandingDebts || 0);
  const existingCover = Math.max(0, input.existingLifeCover || 0);
  const existingSavings = Math.max(0, input.existingSavings || 0);

  const incomeReplacement = annualIncome * multipleYears;
  const grossNeed = incomeReplacement + debts;
  const netProtectionGap = Math.max(0, grossNeed - existingCover - existingSavings);

  const recommendedSumAssured = Math.ceil(netProtectionGap / 100000) * 100000;

  // Retrieve statutory parameters
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const max80cLimit = rule.parameters.section80C.maxDeductionLimit;
  const sec10_10D = rule.parameters.section10_10D;
  const gstRules = rule.parameters.gstRatesPercent;

  // Verified Section 10(10D) ratio check
  const estPremium = input.estimatedAnnualPremium || (recommendedSumAssured * 0.001); // illustrative ~0.1% premium ratio for term cover
  const premiumToSumRatio = recommendedSumAssured > 0 ? (estPremium / recommendedSumAssured) * 100 : 0;
  const satisfies10_10DRatio = premiumToSumRatio <= sec10_10D.maxPremiumRatioOfSumAssuredPercent;

  const section10_10dStatusNote = satisfies10_10DRatio
    ? "Maturity proceed is modeled as tax-exempt under Sec 10(10D) (Annual premium ≤ 10% of sum assured)."
    : "Warning: Premium ratio exceeds 10% of sum assured. Maturity proceeds may not qualify for Sec 10(10D) exemption.";

  // GST 0% Exemption Reform (Eff. 22 Sept 2025) for Individual Life Policies
  const gstPercent = input.isGroupPolicy ? gstRules.groupLifeHealthInsurance : gstRules.individualLifeInsurance;

  return {
    recommendedSumAssured,
    recommendedSumAssuredFormatted: `₹${(recommendedSumAssured / 100000).toFixed(2)} Lakh`,
    incomeReplacementNeed: roundMoney(incomeReplacement),
    outstandingDebts: roundMoney(debts),
    netProtectionGap: roundMoney(netProtectionGap),
    section80cTaxBenefit: max80cLimit,
    applicableGstPercent: gstPercent,
    section10_10dStatusNote,
    disclaimer: "Income replacement multiples are CalcPlatform Planning Assumptions. Individual life policies are exempt from GST (0%) post Sept 22, 2025.",
  };
}

export interface LifeNeedsInput {
  annualFamilyExpenses: number;
  yearsOfSupportNeeded: number;
  childrenEducationCostToday: number;
  childrenMarriageCostToday: number;
  inflationRatePercent?: number;
  expectedReturnRatePercent?: number;
  totalDebts: number;
  currentAssets: number;
  existingLifeInsurance: number;
}

export interface LifeNeedsResult {
  totalFinancialNeedToday: number;
  futureInflationAdjustedGoals: number;
  existingResources: number;
  netInsuranceRequired: number;
  netInsuranceRequiredFormatted: string;
}

/**
 * 2. Life Insurance Needs Calculator — Comprehensive Net Need & Goal Discounting
 */
export function calculateLifeInsuranceNeeds(input: LifeNeedsInput): LifeNeedsResult {
  const expenses = Math.max(0, input.annualFamilyExpenses);
  const years = Math.max(1, input.yearsOfSupportNeeded);
  const infRate = (input.inflationRatePercent || 6) / 100;
  const returnRate = (input.expectedReturnRatePercent || 8) / 100;

  const realRate = (1 + returnRate) / (1 + infRate) - 1;
  const expensesPV = annuityPresentValue(expenses, realRate, years);

  const eduCost = Math.max(0, input.childrenEducationCostToday);
  const marriageCost = Math.max(0, input.childrenMarriageCostToday);
  const debts = Math.max(0, input.totalDebts);
  const assets = Math.max(0, input.currentAssets);
  const existingCover = Math.max(0, input.existingLifeInsurance);

  const totalGoals = eduCost + marriageCost;
  const totalNeed = expensesPV + totalGoals + debts;
  const existingResources = assets + existingCover;
  const netInsuranceRequired = Math.max(0, totalNeed - existingResources);

  return {
    totalFinancialNeedToday: roundMoney(totalNeed),
    futureInflationAdjustedGoals: roundMoney(totalGoals),
    existingResources: roundMoney(existingResources),
    netInsuranceRequired: Math.ceil(netInsuranceRequired / 100000) * 100000,
    netInsuranceRequiredFormatted: `₹${(Math.ceil(netInsuranceRequired / 100000)).toFixed(2)} Lakh`,
  };
}

export interface HumanLifeValueInput {
  currentAge: number;
  retirementAge: number;
  annualIncome: number;
  personalExpensesPercent: number;
  expectedAnnualIncomeGrowthPercent: number;
  discountRatePercent?: number;
}

export interface HumanLifeValueResult {
  humanLifeValue: number;
  humanLifeValueFormatted: string;
  totalLifetimeNetEarningsPV: number;
  effectiveWorkingYears: number;
}

/**
 * 3. Human Life Value (HLV) Calculator — Discounted Present Value of Future Lifetime Net Earnings
 */
export function calculateHumanLifeValue(input: HumanLifeValueInput): HumanLifeValueResult {
  const age = Math.max(18, input.currentAge);
  const retAge = Math.max(age + 1, input.retirementAge || 60);
  const workingYears = retAge - age;

  const grossIncome = Math.max(0, input.annualIncome);
  const personalExpPct = Math.min(80, Math.max(10, input.personalExpensesPercent)) / 100;
  const netAnnualContribution = grossIncome * (1 - personalExpPct);

  const growthRate = Math.max(0, input.expectedAnnualIncomeGrowthPercent) / 100;
  const discountRate = Math.max(0, input.discountRatePercent || 7) / 100;

  const netDiscountRate = (1 + discountRate) / (1 + growthRate) - 1;
  const hlv = annuityPresentValue(netAnnualContribution, netDiscountRate, workingYears);

  return {
    humanLifeValue: roundMoney(hlv),
    humanLifeValueFormatted: `₹${(Math.ceil(hlv / 100000) / 100).toFixed(2)} Crore`,
    totalLifetimeNetEarningsPV: roundMoney(netAnnualContribution * workingYears),
    effectiveWorkingYears: workingYears,
  };
}
