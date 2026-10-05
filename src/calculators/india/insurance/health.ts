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
  ageOfEldestMember?: number;
  adultsCount?: number;
  childrenCount?: number;
  seniorParentsCount?: number;
  hasChronicCondition?: boolean;
  existingCover?: number;
  currentCoverageAmount?: number;
  medicalInflationRatePercent?: number;
  yearsInFuture?: number;
  selfAgeAbove60?: boolean;
  includeParentCover80D?: boolean;
  parentsAgeAbove60?: boolean;
  preventiveCheckupAmount?: number;
}

export interface FutureCoverageProjection {
  yearNumber: number;
  yearLabel: string;
  projectedCost: number;
}

export interface HealthCoverageResult {
  recommendedSumInsured: number;
  recommendedSumInsuredFormatted: string;
  baseCoverageNeed: number;
  familyAdjustment: number;
  chronicAdjustment: number;
  existingCover: number;
  coverageGap: number;
  futureProjections: FutureCoverageProjection[];
  currentCoverageAmount: number;
  projectedFutureTreatmentCost: number;
  projectedFutureTreatmentCostFormatted: string;
  additionalCoverageNeededInFuture: number;
  selfFamilySection80dLimit: number;
  parentsSection80dLimit: number;
  totalSection80dTaxBenefitAvailable: number;
  disclaimer: string;
}

/**
 * 5. Health Insurance Coverage Calculator — Canonical Coverage Sizing & Medical Inflation Projector
 */
export function calculateHealthCoverage(input: HealthCoverageInput): HealthCoverageResult {
  const age = Math.max(18, input.ageOfEldestMember ?? 35);
  const adults = Math.max(1, input.adultsCount ?? 1);
  const children = Math.max(0, input.childrenCount ?? 0);
  const seniorParents = Math.max(0, input.seniorParentsCount ?? 0);
  const totalFamilyMembers = adults + children + seniorParents;

  // Retrieve statutory parameters from canonical registry
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const s80D = rule.parameters.section80D;

  // Base coverage benchmark based on oldest age
  const effectiveAge = seniorParents > 0 ? Math.max(age, 60) : age;
  const baseCoverage = effectiveAge >= 60 ? 1000000 : effectiveAge >= 45 ? 750000 : 500000;

  // Family size adjustment (+2L per additional adult, +1.5L per child, +5L per senior parent)
  let familyAdjustment = 0;
  if (adults > 1) {
    familyAdjustment += (adults - 1) * 200000;
  }
  familyAdjustment += children * 150000;
  familyAdjustment += seniorParents * 500000;

  // Chronic disease protective buffer (+5L)
  const chronicAdjustment = input.hasChronicCondition ? 500000 : 0;

  const rawTotalNeed = input.currentCoverageAmount !== undefined && input.currentCoverageAmount > 0 && input.ageOfEldestMember === undefined
    ? input.currentCoverageAmount
    : baseCoverage + familyAdjustment + chronicAdjustment;

  // Map to standard Indian market Sum Insured tiers
  const coverSlabs = [500000, 750000, 1000000, 1500000, 2000000, 2500000, 5000000, 10000000];
  let recommendedSumInsured = coverSlabs[0];
  for (const slab of coverSlabs) {
    if (rawTotalNeed <= slab) {
      recommendedSumInsured = slab;
      break;
    }
    recommendedSumInsured = slab;
  }

  const existingCoverAmount = Math.max(0, input.existingCover ?? 0);
  const coverageGap = Math.max(0, recommendedSumInsured - existingCoverAmount);

  // Exact medical inflation preservation (0% must remain 0%)
  const inflationRate = input.medicalInflationRatePercent !== undefined ? input.medicalInflationRatePercent : 10;
  const medInflationDecimal = inflationRate / 100;
  const targetYears = input.yearsInFuture !== undefined ? Math.max(0, input.yearsInFuture) : 15;

  const futureProjections: FutureCoverageProjection[] = [];
  for (let y = 0; y <= targetYears; y++) {
    const projectedCost = Math.round(compoundInterest(recommendedSumInsured, medInflationDecimal, y, 1));
    futureProjections.push({
      yearNumber: y,
      yearLabel: `Yr ${y}`,
      projectedCost,
    });
  }

  const projectedFutureCost = compoundInterest(
    input.currentCoverageAmount !== undefined ? input.currentCoverageAmount : recommendedSumInsured,
    medInflationDecimal,
    targetYears,
    1
  );
  const additionalCoverageNeeded = Math.max(0, projectedFutureCost - (input.currentCoverageAmount ?? recommendedSumInsured));

  // Section 80D Statutory Limits
  const isSelfSenior = input.selfAgeAbove60 ?? (effectiveAge >= 60);
  const selfLimit = isSelfSenior ? s80D.selfFamilySenior : s80D.selfFamilyUnder60;
  const hasParents = input.includeParentCover80D ?? (seniorParents > 0);
  const isParentsSenior = input.parentsAgeAbove60 ?? (seniorParents > 0);
  const parentLimit = hasParents ? (isParentsSenior ? s80D.parentsSenior : s80D.parentsUnder60) : 0;

  return {
    recommendedSumInsured,
    recommendedSumInsuredFormatted: `₹${(recommendedSumInsured / 100000).toFixed(2)} Lakh`,
    baseCoverageNeed: roundMoney(baseCoverage),
    familyAdjustment: roundMoney(familyAdjustment),
    chronicAdjustment: roundMoney(chronicAdjustment),
    existingCover: roundMoney(existingCoverAmount),
    coverageGap: roundMoney(coverageGap),
    futureProjections,
    currentCoverageAmount: roundMoney(input.currentCoverageAmount ?? recommendedSumInsured),
    projectedFutureTreatmentCost: roundMoney(projectedFutureCost),
    projectedFutureTreatmentCostFormatted: `₹${(projectedFutureCost / 100000).toFixed(2)} Lakh`,
    additionalCoverageNeededInFuture: roundMoney(additionalCoverageNeeded),
    selfFamilySection80dLimit: selfLimit,
    parentsSection80dLimit: parentLimit,
    totalSection80dTaxBenefitAvailable: selfLimit + parentLimit,
    disclaimer: "Planning estimate only. Medical costs and insurer underwriting terms vary across regions, hospitals, and underwriters.",
  };
}


