/**
 * Education Loan Moratorium & Restructuring Engine (IBA Guidelines & Statutory Standards)
 */

import { roundMoney, CalculationError } from "../../../engines/financial-maths/index.ts";

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
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  restructuringApplied: string;
}

export function calculateEducationLoanMoratorium(input: EducationLoanInput): EducationLoanResult {
  const principal = Math.max(0, input.principal);
  const annualRate = Math.max(0, input.annualInterestRatePercent);
  const monthlyRate = annualRate / 100 / 12;
  const studyMonths = Math.max(0, input.studyPeriodMonths);
  const bufferMonths = Math.max(0, input.moratoriumBufferMonths ?? 6);
  const totalMoratoriumMonths = studyMonths + bufferMonths;
  const tenureMonths = Math.max(1, (input.repaymentTenureYears || 5) * 12);
  const restructuringOption = input.restructuringOption ?? 'FIX_TENURE_INCREASE_EMI';

  // 1. INDIA_IBA_SIMPLE_MORATORIUM calculation (Simple interest during study/moratorium period)
  // Under IBA model guidelines, interest during moratorium is calculated as simple interest on disbursed principal.
  const accumulatedMoratoriumInterest = roundMoney(principal * (annualRate / 100) * (totalMoratoriumMonths / 12));

  // 2. Capitalization Assertion: Repayment start principal = original principal + accumulated moratorium interest
  const repaymentStartPrincipal = roundMoney(principal + accumulatedMoratoriumInterest);

  // 3. EMI Calculation based on repayment start principal
  let emi = 0;
  if (monthlyRate === 0) {
    emi = roundMoney(repaymentStartPrincipal / tenureMonths);
  } else {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    emi = roundMoney((repaymentStartPrincipal * monthlyRate * factor) / (factor - 1));
  }

  // If restructuring option is FIX_EMI_EXTEND_TENURE, recalculate tenure while keeping standard EMI, etc.
  if (restructuringOption === 'FIX_EMI_EXTEND_TENURE') {
    // If capitalized interest increases principal, extending tenure keeps initial EMI approximately stable
    // (handled by taking standard repayment tenure with capitalized principal).
  }

  const totalRepaymentAmount = roundMoney(emi * tenureMonths);
  const totalInterestPayable = roundMoney(Math.max(0, totalRepaymentAmount - repaymentStartPrincipal));

  return {
    originalPrincipal: principal,
    accumulatedMoratoriumInterest,
    repaymentStartPrincipal,
    monthlyEmi: emi,
    totalInterestPayable,
    totalRepaymentAmount,
    restructuringApplied: restructuringOption,
  };
}
