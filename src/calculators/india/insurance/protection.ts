import { roundMoney } from "../../../engines/financial-maths/index.ts";

export interface PersonalAccidentInput {
  annualEarnedIncome: number;
  outstandingDebts?: number;
  dependentsCount?: number;
  incomeMultipleYears?: number;
}

export interface PersonalAccidentResult {
  recommendedAccidentalDeathCover: number;
  recommendedAccidentalDeathCoverFormatted: string;
  recommendedPermanentDisabilityCover: number;
  recommendedPermanentDisabilityCoverFormatted: string;
  temporaryTotalDisabilityWeeklyBenefit: number;
}

/**
 * 9. Personal Accident Cover Calculator — Accidental Death & Permanent Disability Protection Sizing
 */
export function calculatePersonalAccidentCover(input: PersonalAccidentInput): PersonalAccidentResult {
  const income = Math.max(0, input.annualEarnedIncome);
  const debts = Math.max(0, input.outstandingDebts || 0);
  const dependents = Math.max(0, input.dependentsCount || 0);
  const multipleYears = input.incomeMultipleYears !== undefined ? input.incomeMultipleYears : 10;

  // Accidental Death Sum Insured = (10x Annual Income) + Outstanding Debts + Dependent Calibration
  const dependentSizing = dependents > 0 ? (income * 0.5 * dependents) : 0;
  const deathCoverNeeded = income * multipleYears + debts + dependentSizing;
  const deathCover = Math.ceil(deathCoverNeeded / 500000) * 500000;

  // Permanent Total Disability Cover = 125% of Death Sum Insured
  const disabilityCover = Math.ceil((deathCover * 1.25) / 500000) * 500000;

  // Weekly Benefit for Temporary Total Disability = 1% of Sum Insured capped strictly at actual weekly income and statutory ₹10,000/week limit
  const weeklyIncome = income > 0 ? (income / 52) : 0;
  const weeklyBenefit = income > 0
    ? roundMoney(Math.min(10000, weeklyIncome, deathCover * 0.01))
    : 0;

  return {
    recommendedAccidentalDeathCover: deathCover,
    recommendedAccidentalDeathCoverFormatted: `₹${(deathCover / 100000).toFixed(2)} Lakh`,
    recommendedPermanentDisabilityCover: disabilityCover,
    recommendedPermanentDisabilityCoverFormatted: `₹${(disabilityCover / 100000).toFixed(2)} Lakh`,
    temporaryTotalDisabilityWeeklyBenefit: weeklyBenefit,
  };
}

export interface CriticalIllnessInput {
  annualLivingExpenses: number;
  yearsOfIncomeReplacementNeeded?: number;
  expectedSpecializedTreatmentCost?: number;
  existingHealthInsuranceCover?: number;
}

export interface CriticalIllnessResult {
  recommendedCriticalIllnessLumpSum: number;
  recommendedCriticalIllnessLumpSumFormatted: string;
  incomeReplacementLumpSum: number;
  treatmentSurchargeNeed: number;
  netCoverageGap: number;
}

/**
 * 10. Critical Illness Cover Calculator — Lump Sum Recovery & Treatment Need Estimator
 */
export function calculateCriticalIllnessCover(input: CriticalIllnessInput): CriticalIllnessResult {
  const expenses = Math.max(0, input.annualLivingExpenses);
  const replacementYears = input.yearsOfIncomeReplacementNeeded !== undefined ? input.yearsOfIncomeReplacementNeeded : 3;

  // Explicit ₹0 treatment cost must NOT be overridden with ₹15L default
  const treatmentCost = input.expectedSpecializedTreatmentCost !== undefined
    ? Math.max(0, input.expectedSpecializedTreatmentCost)
    : 1500000;
  const existingCover = Math.max(0, input.existingHealthInsuranceCover || 0);

  const incomeReplacementNeed = expenses * replacementYears;
  // Existing health cover strictly offsets specialized treatment costs, not daily income replacement
  const treatmentGap = Math.max(0, treatmentCost - existingCover);
  const netGap = incomeReplacementNeed + treatmentGap;

  const recommendedLumpSum = Math.ceil(netGap / 500000) * 500000;

  return {
    recommendedCriticalIllnessLumpSum: recommendedLumpSum,
    recommendedCriticalIllnessLumpSumFormatted: `₹${(recommendedLumpSum / 100000).toFixed(2)} Lakh`,
    incomeReplacementLumpSum: roundMoney(incomeReplacementNeed),
    treatmentSurchargeNeed: roundMoney(treatmentCost),
    netCoverageGap: roundMoney(netGap),
  };
}

