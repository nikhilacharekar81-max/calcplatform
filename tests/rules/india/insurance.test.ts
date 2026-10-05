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
  vehicleInsurerProfileRegistry,
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
    familyMembersCount: 4,
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

  // 10b. Critical Illness with explicit ₹0 treatment cost
  const criticalZeroRes = calculateCriticalIllnessCover({
    annualLivingExpenses: 500000,
    yearsOfIncomeReplacementNeeded: 2,
    expectedSpecializedTreatmentCost: 0,
    existingHealthInsuranceCover: 200000,
  });
  assert(
    criticalZeroRes.treatmentSurchargeNeed === 0 && criticalZeroRes.incomeReplacementLumpSum === 1000000,
    "Critical Illness - Explicit ₹0 Treatment Cost strictly preserved without 15L fallback"
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

  // 13. Health Insurance 0% Medical Inflation Test
  const healthZeroInf = calculateHealthCoverage({
    currentCoverageAmount: 1000000,
    medicalInflationRatePercent: 0,
    yearsInFuture: 5,
  });
  assert(
    healthZeroInf.projectedFutureTreatmentCost === 1000000 && healthZeroInf.additionalCoverageNeededInFuture === 0,
    "Health Coverage - 0% Medical Inflation correctly preserves 100% principal"
  );

  // 14. Car Insurance Voluntary Deductible Discount & Fractional NCB & EV Discount
  vehicleInsurerProfileRegistry.registerProfile({
    insurerId: 'TEST_INSURER',
    insurerName: 'Test Insurer Ltd',
    discountSchedule: [
      { minDeductibleRupees: 2500, discountPercentOnOD: 20, maxDiscountRupees: 750 },
      { minDeductibleRupees: 5000, discountPercentOnOD: 25, maxDiscountRupees: 1500 },
      { minDeductibleRupees: 7500, discountPercentOnOD: 30, maxDiscountRupees: 2000 },
      { minDeductibleRupees: 15000, discountPercentOnOD: 35, maxDiscountRupees: 2500 },
    ],
  });

  const carEvRes = calculateCarInsurance({
    manufacturerListedExShowroomPrice: 1500000,
    vehicleAgeMonths: 30, // 2 to 3 years = 30% dep
    claimFreeYearsNCB: 2.5, // 2 completed years = 25% NCB
    voluntaryDeductible: 5000, // 25% discount on OD up to ₹1,500
    isElectricVehicle: true, // 15% discount on TP
    insurerId: 'TEST_INSURER',
  });
  assert(
    carEvRes.appliedDepreciationPercent === 30 &&
      carEvRes.noClaimBonusPercent === 25 &&
      carEvRes.voluntaryDeductibleDiscount > 0 &&
      carEvRes.voluntaryDeductibleDiscount <= 1500,
    "Car Insurance - 30% Depreciation, 25% Fractional NCB & Voluntary Deductible Percentage Discount"
  );

  // 15. New Vehicle Bundled Multi-Year Third Party Policy
  const newBikeRes = calculateBikeInsurance({
    manufacturerListedExShowroomPrice: 120000,
    bikeAgeMonths: 0,
    claimFreeYearsNCB: 0,
    engineCapacityCC: 125,
    isNewVehicle: true, // 5-Year bundled TP = ₹3,851
  });
  assert(
    newBikeRes.statutoryThirdPartyPremium === 3851 && newBikeRes.appliedDepreciationPercent === 0,
    "Bike Insurance - Brand New 5-Year Bundled Statutory Third Party Policy"
  );

  // 16. Personal Accident Weekly Benefit Income Cap
  const accidentCapRes = calculatePersonalAccidentCover({
    annualEarnedIncome: 260000, // ₹5,000/week
    outstandingDebts: 0,
  });
  assert(
    accidentCapRes.temporaryTotalDisabilityWeeklyBenefit === 5000,
    "Personal Accident - Weekly Benefit strictly capped at actual weekly income"
  );

  // 17. Travel Insurance Underscore Replacement & Threshold
  const travelAsiaRes = calculateTravelInsurance({
    destinationRegion: "ASIA_EXCLUDING_JAPAN",
    tripDurationDays: 10,
    travelerAge: 28,
    medicalCoverUsdThreshold: 75000,
  });
  assert(
    travelAsiaRes.recommendedMedicalSumInsuredUsd === 75000 &&
      travelAsiaRes.riskFactorNotes.includes("ASIA EXCLUDING JAPAN") &&
      !travelAsiaRes.riskFactorNotes.includes("_"),
    "Travel Insurance - Underscores fully replaced and custom threshold applied"
  );

  // 18. Life Insurance Hardened Goal Inflation & Zero Preservation
  const goalInflated = calculateLifeInsuranceNeeds({
    annualFamilyExpenses: 0,
    yearsOfSupportNeeded: 1,
    futureGoals: 1000000,
    goalYears: 10,
    inflationRate: 6.5,
    investmentReturn: 8.5,
  });
  const expectedInflatedGoal = 1000000 * Math.pow(1.065, 10);
  assert(
    Math.abs(goalInflated.futureInflationAdjustedGoals - expectedInflatedGoal) < 1.0,
    "Life Insurance - Explicit Goal Horizon Inflation Compounding"
  );

  const goalZeroInf = calculateLifeInsuranceNeeds({
    annualFamilyExpenses: 0,
    yearsOfSupportNeeded: 1,
    futureGoals: 1000000,
    goalYears: 10,
    inflationRate: 0,
  });
  assert(
    goalZeroInf.futureInflationAdjustedGoals === 1000000,
    "Life Insurance - Zero Inflation preserves Today's Goal Value"
  );

  // 19. Statutory Registry Active Verified Check
  const rule = indiaRuleRegistry.resolveActiveVerified({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  assert(
    rule.status === "ACTIVE_VERIFIED" && rule.domain === "INSURANCE",
    "Rule Registry - ACTIVE_VERIFIED INSURANCE Statutory Rule Envelope"
  );

  // 20. IDV Exact Depreciation Boundary Tests (6, 12, 24, 36, 48, 60 months)
  const idv6 = calculateCarInsurance({ manufacturerListedExShowroomPrice: 1000000, vehicleAgeMonths: 6, claimFreeYearsNCB: 0 });
  const idv12 = calculateCarInsurance({ manufacturerListedExShowroomPrice: 1000000, vehicleAgeMonths: 12, claimFreeYearsNCB: 0 });
  const idv24 = calculateCarInsurance({ manufacturerListedExShowroomPrice: 1000000, vehicleAgeMonths: 24, claimFreeYearsNCB: 0 });
  const idv36 = calculateCarInsurance({ manufacturerListedExShowroomPrice: 1000000, vehicleAgeMonths: 36, claimFreeYearsNCB: 0 });
  const idv48 = calculateCarInsurance({ manufacturerListedExShowroomPrice: 1000000, vehicleAgeMonths: 48, claimFreeYearsNCB: 0 });
  const idv60 = calculateCarInsurance({ manufacturerListedExShowroomPrice: 1000000, vehicleAgeMonths: 60, claimFreeYearsNCB: 0 });

  assert(
    idv6.appliedDepreciationPercent === 5 &&
    idv12.appliedDepreciationPercent === 15 &&
    idv24.appliedDepreciationPercent === 20 &&
    idv36.appliedDepreciationPercent === 30 &&
    idv48.appliedDepreciationPercent === 40 &&
    idv60.appliedDepreciationPercent === 50,
    "Car Insurance - IDV Depreciation Boundary Schedule (6m: 5%, 12m: 15%, 24m: 20%, 36m: 30%, 48m: 40%, 60m: 50%)"
  );

  // 21. Section 80C Renaming & Eligible Premium Deduction Key Test
  const term80c = calculateTermLifeInsurance({
    annualIncome: 1500000,
    age: 30,
    retirementAge: 60,
    estimatedAnnualPremium: 25000,
  });
  assert(
    term80c.section80cEligiblePremiumDeduction === 25000 &&
    term80c.section80cTaxBenefit === 25000,
    "Life Insurance - section80cEligiblePremiumDeduction Renaming with Alias"
  );

  // 22. Term Insurance Household Expense vs Personal Expense Mapping Direction Test
  const termLowExp = calculateTermLifeInsurance({ annualIncome: 2000000, monthlyExpenses: 40000, age: 30, retirementAge: 60 });
  const termHighExp = calculateTermLifeInsurance({ annualIncome: 2000000, monthlyExpenses: 90000, age: 30, retirementAge: 60 });
  assert(
    termHighExp.incomeReplacementNeed > termLowExp.incomeReplacementNeed &&
    termHighExp.recommendedSumAssured >= termLowExp.recommendedSumAssured,
    "Term Insurance - Higher Household Expenses Correctly Increase Required Cover"
  );

  // 23. Zero Personal Expense Ratio Preservation
  const lifeZeroPersonalExp = calculateLifeInsuranceNeeds({
    annualIncome: 1000000,
    personalExpenseRatioPercent: 0,
    yearsOfSupportNeeded: 10,
    inflationRate: 0,
    investmentReturn: 0,
  });
  assert(
    lifeZeroPersonalExp.incomeReplacementCorpus === 10000000,
    "Life Needs - 0% Personal Expense Ratio Preserves 100% Income for Dependents"
  );

  // 24. Canonical Health Coverage Complete Sizing Engine Test
  const canonicalCoverageSizing = calculateHealthCoverage({
    ageOfEldestMember: 48,
    adultsCount: 2,
    childrenCount: 2,
    seniorParentsCount: 1,
    hasChronicCondition: true,
    existingCover: 500000,
    medicalInflationRatePercent: 8,
    yearsInFuture: 10,
  });
  assert(
    canonicalCoverageSizing.recommendedSumInsured >= 1500000 &&
    canonicalCoverageSizing.chronicAdjustment === 500000 &&
    canonicalCoverageSizing.coverageGap > 0 &&
    canonicalCoverageSizing.futureProjections.length === 11,
    "Health Coverage - Canonical Sizing Engine Produces Structured Outputs & Future Projections"
  );

  return { passed, failed };
}
