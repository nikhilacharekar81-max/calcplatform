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
  const multipleYears = input.incomeMultipleYears !== undefined ? input.incomeMultipleYears : 10;

  // Accidental Death Sum Insured = (10x Annual Income) + Outstanding Debts
  const deathCoverNeeded = income * multipleYears + debts;
  const deathCover = Math.ceil(deathCoverNeeded / 500000) * 500000;

  // Permanent Total Disability Cover = 125% of Death Sum Insured
  const disabilityCover = Math.ceil((deathCover * 1.25) / 500000) * 500000;

  // Weekly Benefit for Temporary Total Disability = 1% of Sum Insured capped at ₹10,000/week OR weekly income
  const weeklyIncome = income / 52;
  const weeklyBenefit = Math.min(10000, weeklyIncome, roundMoney(deathCover * 0.01));

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

  const treatmentCost = input.expectedSpecializedTreatmentCost !== undefined ? input.expectedSpecializedTreatmentCost : 1500000;
  const existingCover = Math.max(0, input.existingHealthInsuranceCover || 0);

  const incomeReplacementNeed = expenses * replacementYears;
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
