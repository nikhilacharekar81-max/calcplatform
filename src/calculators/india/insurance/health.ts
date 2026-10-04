import {
  compoundInterest,
  roundMoney,
} from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface HealthInsuranceInput {
  ageOfEldestMember: number;
  cityTier: "TIER_1" | "TIER_2" | "TIER_3";
  familyMembersCount: number;
  hasPreExistingConditions?: boolean;
  preferredRoomCategory?: "SINGLE_PRIVATE" | "SUITE" | "SHARED";
}

export interface HealthInsuranceResult {
  recommendedSumInsured: number;
  recommendedSumInsuredFormatted: string;
  baseCoverageNeed: number;
  cityMultiplierFactor: number;
  section80dTaxDeductionLimit: number;
  disclaimer: string;
}

/**
 * 4. Health Insurance Calculator — Sizing Recommended Sum Insured by City Tier & Demographics
 */
export function calculateHealthInsurance(input: HealthInsuranceInput): HealthInsuranceResult {
  const age = Math.max(18, input.ageOfEldestMember);
  const members = Math.max(1, input.familyMembersCount);

  // Base coverage benchmark in India
  let baseCoverage = age >= 60 ? 1000000 : age >= 45 ? 750000 : 500000;
  if (members > 2) {
    baseCoverage += (members - 2) * 250000;
  }

  // City Tier Multiplier Factor
  let cityFactor = 1.0;
  if (input.cityTier === "TIER_1") cityFactor = 1.5; // Metro healthcare cost premium
  else if (input.cityTier === "TIER_2") cityFactor = 1.2;

  // Pre-existing conditions loading
  if (input.hasPreExistingConditions) {
    baseCoverage *= 1.25;
  }

  // Preferred Room Category
  if (input.preferredRoomCategory === "SUITE") baseCoverage *= 1.3;

  const recommendedSumInsured = Math.ceil((baseCoverage * cityFactor) / 100000) * 100000;

  // Fetch Section 80D limits from India Rule Registry
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const sec80D = rule.parameters.section80D;
  const maxTaxDeduction = age >= 60 ? sec80D.selfFamilySenior : sec80D.selfFamilyUnder60;

  return {
    recommendedSumInsured,
    recommendedSumInsuredFormatted: `₹${(recommendedSumInsured / 100000).toFixed(2)} Lakh`,
    baseCoverageNeed: roundMoney(baseCoverage),
    cityMultiplierFactor: cityFactor,
    section80dTaxDeductionLimit: maxTaxDeduction,
    disclaimer: "Health insurance requirement estimate based on prevailing metro treatment costs and IRDAI Section 80D tax limits.",
  };
}

export interface HealthCoverageInput {
  currentCoverageAmount: number;
  medicalInflationRatePercent?: number;
  yearsInFuture: number;
  includeParentCover80D?: boolean;
  parentsAgeAbove60?: boolean;
  selfAgeAbove60?: boolean;
}

export interface HealthCoverageResult {
  currentCoverageAmount: number;
  projectedFutureTreatmentCost: number;
  projectedFutureTreatmentCostFormatted: string;
  additionalCoverageNeededInFuture: number;
  totalSection80dTaxBenefitAvailable: number;
}

/**
 * 5. Health Insurance Coverage Calculator — Medical Inflation Projector & Section 80D Optimisation
 */
export function calculateHealthCoverage(input: HealthCoverageInput): HealthCoverageResult {
  const currentCover = Math.max(0, input.currentCoverageAmount);
  const medInflation = (input.medicalInflationRatePercent || 12) / 100;
  const years = Math.max(0, input.yearsInFuture);

  // Future treatment cost projection under compounding medical inflation
  const projectedFutureCost = compoundInterest(currentCover, medInflation, years, 1);
  const additionalCoverageNeeded = Math.max(0, projectedFutureCost - currentCover);

  // Retrieve statutory Section 80D Limits
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const s80D = rule.parameters.section80D;

  let total80dLimit = input.selfAgeAbove60 ? s80D.selfFamilySenior : s80D.selfFamilyUnder60;
  if (input.includeParentCover80D) {
    total80dLimit += input.parentsAgeAbove60 ? s80D.parentsSenior : s80D.parentsUnder60;
  }

  return {
    currentCoverageAmount: roundMoney(currentCover),
    projectedFutureTreatmentCost: roundMoney(projectedFutureCost),
    projectedFutureTreatmentCostFormatted: `₹${(projectedFutureCost / 100000).toFixed(2)} Lakh`,
    additionalCoverageNeededInFuture: roundMoney(additionalCoverageNeeded),
    totalSection80dTaxBenefitAvailable: total80dLimit,
  };
}
