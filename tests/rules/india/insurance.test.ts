import {
  calculateTermLifeInsurance,
  calculateLifeInsuranceNeeds,
  calculateHumanLifeValue,
  calculateHealthInsurance,
  calculateHealthCoverage,
  calculateCarInsurance,
  calculateBikeInsurance,
  calculateTravelInsurance,
  calculatePersonalAccidentCover,
  calculateCriticalIllnessCover,
  calculateHomeInsurance,
  calculateBusinessInsurance,
} from "../../../src/calculators/india/insurance/index.ts";
import { indiaRuleRegistry } from "../../../src/rules/india/registry.ts";

export function runInsuranceTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      passed++;
      console.log(`  [PASS] ${description}`);
    } else {
      failed++;
      console.error(`  [FAIL] ${description}`);
    }
  }

  console.log("--- Running Suite: 8. India Insurance Domain Models ---");

  // 1. Term Life Insurance - GST 0% Exempt Reform & Sec 10(10D)
  const termRes = calculateTermLifeInsurance({
    annualIncome: 1200000,
    currentAge: 30,
    retirementAge: 60,
    outstandingDebts: 2000000,
    existingLifeCover: 1000000,
  });
  assert(
    termRes.recommendedSumAssured > 0 && termRes.applicableGstPercent === 0,
    "Term Insurance - Recommended Sum Assured & GST 0% Exemption Reform"
  );

  // 2. Life Insurance Needs
  const lifeNeedsRes = calculateLifeInsuranceNeeds({
    annualFamilyExpenses: 600000,
    yearsOfSupportNeeded: 20,
    childrenEducationCostToday: 2000000,
    childrenMarriageCostToday: 1500000,
    totalDebts: 2500000,
    currentAssets: 1000000,
    existingLifeInsurance: 2000000,
  });
  assert(
    lifeNeedsRes.netInsuranceRequired > 0,
    "Life Insurance Needs - Discounted Net Need Sizing"
  );

  // 3. Human Life Value (HLV)
  const hlvRes = calculateHumanLifeValue({
    currentAge: 30,
    retirementAge: 60,
    annualIncome: 1500000,
    personalExpensesPercent: 30,
    expectedAnnualIncomeGrowthPercent: 8,
    discountRatePercent: 7,
  });
  assert(
    hlvRes.humanLifeValue > 10000000,
    "Human Life Value - PV Discounted Earnings Sizing"
  );

  // 4. Health Insurance - Separate Sec 80D Buckets (Self + Senior Parents)
  const healthRes = calculateHealthInsurance({
    ageOfEldestMember: 35,
    cityTier: "TIER_1",
    familyMembersCount: 4,
    preferredRoomCategory: "SINGLE_PRIVATE",
    includeParents80D: true,
    parentsAgeAbove60: true,
  });
  assert(
    healthRes.recommendedSumInsured >= 750000 &&
      healthRes.selfFamily80dBucket === 25000 &&
      healthRes.parents80dBucket === 50000 &&
      healthRes.totalSection80dTaxDeductionLimit === 75000 &&
      healthRes.applicableGstPercent === 0,
    "Health Insurance - Separate Sec 80D Buckets (₹25k Self + ₹50k Senior Parents) & 0% GST"
  );

  // 5. Health Insurance Coverage
  const healthCovRes = calculateHealthCoverage({
    currentCoverageAmount: 500000,
    medicalInflationRatePercent: 12,
    yearsInFuture: 10,
    selfAgeAbove60: false,
    includeParentCover80D: true,
    parentsAgeAbove60: true,
  });
  assert(
    healthCovRes.projectedFutureTreatmentCost > healthCovRes.currentCoverageAmount &&
      healthCovRes.totalSection80dTaxBenefitAvailable === 75000,
    "Health Coverage - Medical Inflation Compounding & Combined Sec 80D Buckets"
  );

  // 6. Car Insurance - IDV Depreciation & Illustrative OD Label
  const carRes = calculateCarInsurance({
    manufacturerListedExShowroomPrice: 1000000,
    vehicleAgeMonths: 18,
    claimFreeYearsNCB: 2,
    engineCapacityCC: 1200,
  });
  assert(
    carRes.insuredDeclaredValueIDV === 800000 &&
      carRes.appliedDepreciationPercent === 20 &&
      carRes.noClaimBonusPercent === 25 &&
      carRes.estimatedOwnDamageLabel.includes("Illustrative Only"),
    "Car Insurance - Manufacturer Price IDV (20%), NCB (25%) & Illustrative OD Label"
  );

  // 7. Bike Insurance
  const bikeRes = calculateBikeInsurance({
    manufacturerListedExShowroomPrice: 150000,
    bikeAgeMonths: 8,
    claimFreeYearsNCB: 1,
    engineCapacityCC: 125,
  });
  assert(
    bikeRes.insuredDeclaredValueIDV === 127500 && bikeRes.appliedDepreciationPercent === 15,
    "Bike Insurance - Two-Wheeler Manufacturer Price IDV & Premium"
  );

  // 8. Travel Insurance
  const travelRes = calculateTravelInsurance({
    destinationRegion: "USA_CANADA",
    tripDurationDays: 15,
    travelerAge: 35,
  });
  assert(
    travelRes.recommendedMedicalSumInsuredUsd === 250000 && travelRes.estimatedTotalPremiumInr > 0,
    "Travel Insurance - Destination Risk Sizing & Premium Calculation"
  );

  // 9. Personal Accident Cover
  const accidentRes = calculatePersonalAccidentCover({
    annualEarnedIncome: 1000000,
    outstandingDebts: 1500000,
  });
  assert(
    accidentRes.recommendedAccidentalDeathCover >= 10000000 && accidentRes.temporaryTotalDisabilityWeeklyBenefit > 0,
    "Personal Accident - Accidental Death & Permanent Disability Cover"
  );

  // 10. Critical Illness Cover
  const criticalRes = calculateCriticalIllnessCover({
    annualLivingExpenses: 600000,
    yearsOfIncomeReplacementNeeded: 3,
    expectedSpecializedTreatmentCost: 1500000,
  });
  assert(
    criticalRes.recommendedCriticalIllnessLumpSum >= 3000000,
    "Critical Illness - 3-Year Income Replacement & Treatment Lump Sum"
  );

  // 11. Home Insurance
  const homeRes = calculateHomeInsurance({
    builtUpAreaSqFt: 1200,
    constructionCostPerSqFt: 2500,
    contentsValuationToday: 500000,
  });
  assert(
    homeRes.structureReconstructionSumInsured === 3000000 && homeRes.totalHomeInsuranceSumInsured === 3500000,
    "Home Insurance - Reconstruction Cost & Contents Sizing"
  );

  // 12. Business Insurance
  const bizRes = calculateBusinessInsurance({
    buildingReconstructionValue: 5000000,
    plantMachineryStockValue: 10000000,
    annualGrossProfit: 3000000,
    indemnityPeriodMonths: 12,
  });
  assert(
    bizRes.propertyMaterialDamageSumInsured === 15000000 && bizRes.businessInterruptionGrossProfitSumInsured === 3000000,
    "Business Insurance - Material Damage & Gross Profit Interruption"
  );

  // 13. Statutory Registry Active Verified Check
  const rule = indiaRuleRegistry.resolveActiveVerified({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  assert(
    rule.status === "ACTIVE_VERIFIED" && rule.domain === "INSURANCE",
    "Rule Registry - ACTIVE_VERIFIED INSURANCE Statutory Rule Envelope"
  );

  return { passed, failed };
}
