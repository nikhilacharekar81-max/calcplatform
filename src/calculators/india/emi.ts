import { pmt } from "../../engines/financial-maths/index.ts";
import { formatIndianCurrency } from "../../localization/india/index.ts";

export interface IndiaEmiInput {
  principal: number;
  annualInterestRatePercent: number;
  tenureMonths: number;
}

export interface IndiaEmiResult {
  monthlyEmi: number;
  monthlyEmiFormatted: string;
}

/**
 * Proof that an India calculator can use the same universal maths engine.
 * No RBI/bank-specific assumptions are embedded here.
 */
export function calculateIndiaEmi(input: IndiaEmiInput): IndiaEmiResult {
  if (!Number.isFinite(input.principal) || input.principal < 0) {
    throw new Error("principal must be >= 0");
  }
  if (!Number.isFinite(input.annualInterestRatePercent) || input.annualInterestRatePercent < 0) {
    throw new Error("annualInterestRatePercent must be >= 0");
  }
  if (!Number.isInteger(input.tenureMonths) || input.tenureMonths <= 0) {
    throw new Error("tenureMonths must be a positive integer");
  }

  const monthlyRate = input.annualInterestRatePercent / 100 / 12;
  const monthlyEmi = Math.abs(pmt(monthlyRate, input.tenureMonths, input.principal));

  return {
    monthlyEmi,
    monthlyEmiFormatted: formatIndianCurrency(monthlyEmi),
  };
}
