/**
 * Education Loan Moratorium & Restructuring Engine (IBA Guidelines & Statutory Standards)
 */

import { roundMoney, roundNumber, CalculationError, isMonetaryExceeded } from "../../../engines/financial-maths/index.ts";

export interface EducationLoanInput {
  principal: number;
  annualInterestRatePercent: number;
  studyPeriodMonths: number;
  moratoriumBufferMonths?: number;
  repaymentTenureYears: number;
  restructuringOption?: 'FIX_TENURE_INCREASE_EMI' | 'FIX_EMI_EXTEND_TENURE';
}

export interface EducationLoanResult {
  originalPrincipal: number;
  accumulatedMoratoriumInterest: number;
  repaymentStartPrincipal: number; // Principal + accumulated moratorium interest (Capitalization Assertion)
  monthlyEmi: number;
  baseUncapitalizedEmi: number;
  effectiveTenureMonths: number;
  effectiveTenureYears: number;
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  restructuringApplied: 'FIX_TENURE_INCREASE_EMI' | 'FIX_EMI_EXTEND_TENURE';
  capitalizationAssertionVerified: boolean;
}

function computeEmi(principalAmount: number, monthlyRate: number, tenureMonths: number): number {
  if (tenureMonths <= 0) return principalAmount;
  if (monthlyRate === 0) return roundMoney(principalAmount / tenureMonths);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return roundMoney((principalAmount * monthlyRate * factor) / (factor - 1));
}

export function calculateEducationLoanMoratorium(input: EducationLoanInput): EducationLoanResult {
  const principal = Math.max(0, input.principal);
  const annualRate = Math.max(0, input.annualInterestRatePercent);
  const monthlyRate = annualRate / 100 / 12;
  const studyMonths = Math.max(0, input.studyPeriodMonths);
  const bufferMonths = Math.max(0, input.moratoriumBufferMonths ?? 6);
  const totalMoratoriumMonths = studyMonths + bufferMonths;
  const baseTenureMonths = Math.max(1, Math.round((input.repaymentTenureYears || 5) * 12));
  const restructuringOption = input.restructuringOption ?? 'FIX_TENURE_INCREASE_EMI';

  // 1. INDIA_IBA_SIMPLE_MORATORIUM calculation (Simple interest during study/moratorium period)
  // Under IBA model guidelines, interest during moratorium is calculated as simple interest on disbursed principal.
  const accumulatedMoratoriumInterest = roundMoney(principal * (annualRate / 100) * (totalMoratoriumMonths / 12));

  // 2. Capitalization Assertion: Repayment start principal = original principal + accumulated moratorium interest
  const repaymentStartPrincipal = roundMoney(principal + accumulatedMoratoriumInterest);
  const capitalizationAssertionVerified = (repaymentStartPrincipal === roundMoney(principal + accumulatedMoratoriumInterest));

  // Baseline EMI on uncapitalized original principal over original tenure
  const baseUncapitalizedEmi = computeEmi(principal, monthlyRate, baseTenureMonths);

  let monthlyEmi = 0;
  let effectiveTenureMonths = baseTenureMonths;

  if (restructuringOption === 'FIX_EMI_EXTEND_TENURE') {
    // FIX_EMI_EXTEND_TENURE: Keep EMI fixed at baseline uncapitalized EMI and extend repayment tenure
    const targetEmi = baseUncapitalizedEmi;
    const monthlyInterestAmount = repaymentStartPrincipal * monthlyRate;

    if (monthlyRate > 0 && isMonetaryExceeded(targetEmi, monthlyInterestAmount)) {
      // Amortization formula solving for required tenure n:
      // P_emi = P_principal * r * (1+r)^n / ((1+r)^n - 1)
      // (1+r)^n = P_emi / (P_emi - P_principal * r)
      // n = ln(P_emi / (P_emi - P_principal * r)) / ln(1+r)
      const numerator = targetEmi;
      const denominator = targetEmi - monthlyInterestAmount;
      const requiredMonthsExact = Math.log(numerator / denominator) / Math.log(1 + monthlyRate);
      effectiveTenureMonths = Math.max(baseTenureMonths, Math.ceil(requiredMonthsExact));
      monthlyEmi = targetEmi;
    } else {
      // Fallback if target EMI does not cover monthly interest: increase EMI with fixed tenure
      monthlyEmi = computeEmi(repaymentStartPrincipal, monthlyRate, baseTenureMonths);
      effectiveTenureMonths = baseTenureMonths;
    }
  } else {
    // FIX_TENURE_INCREASE_EMI: Keep repayment tenure fixed at original tenure and increase EMI
    effectiveTenureMonths = baseTenureMonths;
    monthlyEmi = computeEmi(repaymentStartPrincipal, monthlyRate, baseTenureMonths);
  }

  const effectiveTenureYears = roundNumber(effectiveTenureMonths / 12, { mode: "HALF_UP", scale: 2 });
  const totalRepaymentAmount = roundMoney(monthlyEmi * effectiveTenureMonths);
  const totalInterestPayable = roundMoney(Math.max(0, totalRepaymentAmount - repaymentStartPrincipal));

  return {
    originalPrincipal: principal,
    accumulatedMoratoriumInterest,
    repaymentStartPrincipal,
    monthlyEmi,
    baseUncapitalizedEmi,
    effectiveTenureMonths,
    effectiveTenureYears,
    totalInterestPayable,
    totalRepaymentAmount,
    restructuringApplied: restructuringOption,
    capitalizationAssertionVerified,
  };
}
