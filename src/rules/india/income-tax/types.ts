import type { TaxBracket } from "../../../engines/financial-maths/index.ts";

export type IndiaTaxRegime = "OLD" | "NEW";
export type IndiaTaxpayerAgeBand = "BELOW_60" | "60_TO_79" | "80_PLUS";

export interface IndiaIncomeTaxRegimeRules {
  readonly standardDeduction: number;
  readonly slabs: Readonly<Record<IndiaTaxpayerAgeBand, readonly TaxBracket[]>>;
  readonly rebate87A: {
    readonly maxRebate: number;
    readonly taxableIncomeLimit: number;
  };
  readonly surcharge: readonly {
    readonly incomeAbove: number;
    readonly rate: number;
  }[];
  readonly marginalReliefThresholds: readonly number[];
}

export interface IndiaIncomeTaxAY2026_27Parameters {
  readonly taxYear: "AY-2026-27";
  readonly assessmentYear: "AY-2026-27";
  readonly act: "Income Tax Act, 1961";
  readonly healthAndEducationCessRate: number;
  readonly newRegime: IndiaIncomeTaxRegimeRules;
  readonly oldRegime: IndiaIncomeTaxRegimeRules;
}
