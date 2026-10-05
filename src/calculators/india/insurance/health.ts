import {
  compoundInterest,
  roundMoney,
} from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface HealthInsuranceInput {
  ageOfEldestMember: number;
  familyMembersCount: number;
  includeParents80D?: boolean;
  parentsAgeAbove60?: boolean;
  preventiveCheckupAmount?: number;
  isGroupPolicy?: boolean;
  /** Optional user-specified additional coverage buffer */
  additionalCoverageBuffer?: number;
}

export interface HealthInsuranceResult {
  recommendedSumInsured: number;
  recommendedSumInsuredFormatted: string;
  baseCoverageNeed: number;
  selfFamily80dBucket: number;
  parents80dBucket: number;
  preventiveCheckupDeductionAllowed: number;
  totalSection80dTaxDeductionLimit: number;
  applicableGstPercent: number;
  planningAssumptionNote: string;
  disclaimer: string;
}

/**
 * 4. Health Insurance Calculator — Sizing Recommended Sum Insured & Separate Sec 80D Buckets
 */
export function calculateHealthInsurance(input: HealthInsuranceInput): HealthInsuranceResult {
  const age = Math.max(18, input.ageOfEldestMember);
  const members = Math.max(1, input.familyMembersCount);

  // Retrieve statutory parameters
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const sec80D = rule.parameters.section80D;
  const gstRules = rule.parameters.gstRatesPercent;

  // Base coverage guideline based on family composition and age
  let baseCoverage = age >= 60 ? 1000000 : age >= 45 ? 750000 : 500000;
  if (members > 2) {
    baseCoverage += (members - 2) * 250000;
  }
  if (input.additionalCoverageBuffer && input.additionalCoverageBuffer > 0) {
    baseCoverage += input.additionalCoverageBuffer;
  }

  // Cover standard market tiers
  const recommendedSumInsured = Math.ceil(baseCoverage / 100000) * 100000;

  // Modeling Separate Statutory Section 80D Buckets
  const selfBucket = age >= 60 ? sec80D.selfFamilySenior : sec80D.selfFamilyUnder60;
  let parentsBucket = 0;
  if (input.includeParents80D) {
    parentsBucket = input.parentsAgeAbove60 ? sec80D.parentsSenior : sec80D.parentsUnder60;
  }

  const preventiveClaimed = Math.min(
    sec80D.preventiveHealthCheckupSubLimit,
    Math.max(0, input.preventiveCheckupAmount || 0)
  );
  const total80dLimit = selfBucket + parentsBucket;

  // GST 0% Exemption Reform (Eff. 22 Sept 2025) for Individual Policies
  const gstPercent = input.isGroupPolicy ? gstRules.groupLifeHealthInsurance : gstRules.individualHealthInsurance;

  return {
    recommendedSumInsured,
    recommendedSumInsuredFormatted: `₹${(recommendedSumInsured / 100000).toFixed(2)} Lakh`,
    baseCoverageNeed: roundMoney(baseCoverage),
    selfFamily80dBucket: selfBucket,
    parents80dBucket: parentsBucket,
    preventiveCheckupDeductionAllowed: preventiveClaimed,
    totalSection80dTaxDeductionLimit: total80dLimit,
    applicableGstPercent: gstPercent,
    planningAssumptionNote: "Coverage benchmarks represent standard family protection guidelines. Premium pricing is determined strictly by insurer underwriting without arbitrary zonal or health loadings in this engine.",
    disclaimer: "Individual health insurance policies are exempt from GST (0%) effective September 22, 2025 per 56th GST Council decisions. Statutory Section 80D deductions are governed by the Income-tax Act.",
  };
}

export interface HealthCoverageInput {
  currentCoverageAmount: number;
  medicalInflationRatePercent?: number;
  yearsInFuture: number;
  selfAgeAbove60?: boolean;
  includeParentCover80D?: boolean;
  parentsAgeAbove60?: boolean;
  preventiveCheckupAmount?: number;
}

export interface HealthCoverageResult {
  currentCoverageAmount: number;
  projectedFutureTreatmentCost: number;
  projectedFutureTreatmentCostFormatted: string;
  additionalCoverageNeededInFuture: number;
  selfFamilySection80dLimit: number;
  parentsSection80dLimit: number;
  totalSection80dTaxBenefitAvailable: number;
}

/**
 * 5. Health Insurance Coverage Calculator — Medical Inflation Projector & Section 80D Bucket Optimiser
 */
export function calculateHealthCoverage(input: HealthCoverageInput): HealthCoverageResult {
  const currentCover = Math.max(0, input.currentCoverageAmount);
  // Do NOT fallback to 12% if user provides 0%: 0% inflation must be respected
  const inflationRate = input.medicalInflationRatePercent !== undefined ? input.medicalInflationRatePercent : 10;
  const medInflationDecimal = inflationRate / 100;
  const years = Math.max(0, input.yearsInFuture);

  const projectedFutureCost = compoundInterest(currentCover, medInflationDecimal, years, 1);
  const additionalCoverageNeeded = Math.max(0, projectedFutureCost - currentCover);

  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const s80D = rule.parameters.section80D;

  const selfLimit = input.selfAgeAbove60 ? s80D.selfFamilySenior : s80D.selfFamilyUnder60;
  let parentLimit = 0;
  if (input.includeParentCover80D) {
    parentLimit = input.parentsAgeAbove60 ? s80D.parentsSenior : s80D.parentsUnder60;
  }

  return {
    currentCoverageAmount: roundMoney(currentCover),
    projectedFutureTreatmentCost: roundMoney(projectedFutureCost),
    projectedFutureTreatmentCostFormatted: `₹${(projectedFutureCost / 100000).toFixed(2)} Lakh`,
    additionalCoverageNeededInFuture: roundMoney(additionalCoverageNeeded),
    selfFamilySection80dLimit: selfLimit,
    parentsSection80dLimit: parentLimit,
    totalSection80dTaxBenefitAvailable: selfLimit + parentLimit,
  };
}

