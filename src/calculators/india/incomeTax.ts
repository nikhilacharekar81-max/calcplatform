import {
  IndiaRuleRegistry,
  indiaRuleRegistry,
} from "../../rules/india/registry.ts";
import {
  INDIA_INCOME_TAX_AY_2026_27,
} from "../../rules/india/income-tax/versions/ay-2026-27.ts";
import type {
  IndiaIncomeTaxAY2026_27Parameters,
  IndiaTaxRegime,
  IndiaTaxpayerAgeBand,
} from "../../rules/india/income-tax/types.ts";
import {
  progressiveTax,
  applySection288ARounding,
  applySection288BRounding,
  type TaxBracket,
} from "../../engines/financial-maths/index.ts";
import { formatIndianCurrency } from "../../localization/india/index.ts";

export interface IndiaIncomeTaxInput {
  /** Gross annual income before the standard deduction. */
  grossIncome: number;
  /** Salary/pension component eligible for the standard deduction. */
  salaryIncome?: number;
  /** Additional deductions/exemptions supplied by the caller; not rule-derived. */
  additionalDeductions?: number;
  regime: IndiaTaxRegime;
  age?: number;
  resident?: boolean;
  /** Special-rate income requiring separate statutory schedules (e.g. Capital Gains, VDA). */
  specialRateIncome?: number;
}

export interface RawIncomeTaxComputationDetails {
  assessmentYear: "AY-2026-27";
  regime: IndiaTaxRegime;
  rawGrossIncome: number;
  rawStandardDeduction: number;
  rawAdditionalDeductions: number;
  rawTaxableIncome: number;
  rawIncomeTaxBeforeRebate: number;
  rawRebate87A: number;
  rawTaxAfterRebate: number;
  rawTaxAfterRebateRelief: number;
  rawSurcharge: number;
  rawSurchargeMarginalRelief: number;
  rawTotalMarginalRelief: number;
  rawHealthAndEducationCess: number;
  rawTotalTaxBeforeStatutoryRounding: number;
}

export interface IndiaIncomeTaxResult {
  assessmentYear: "AY-2026-27";
  regime: IndiaTaxRegime;
  grossIncome: number;
  standardDeduction: number;
  additionalDeductions: number;
  taxableIncome: number;
  incomeTaxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  marginalRelief: number;
  healthAndEducationCess: number;
  totalTax: number;
  effectiveTaxRatePercent: number;
  totalTaxFormatted: string;
  rawDetails: RawIncomeTaxComputationDetails;
}

const RULE_ID = "IT-INDIA-AY-2026-27-INDIVIDUAL";

function ensureRuleRegistered(registry: IndiaRuleRegistry): void {
  if (!registry.resolve({ domain: "INCOME_TAX", ruleId: RULE_ID, version: "2026-27" })) {
    registry.register(INDIA_INCOME_TAX_AY_2026_27);
  }
}

function ageBand(age: number, resident: boolean): IndiaTaxpayerAgeBand {
  if (!Number.isFinite(age) || age < 0) throw new Error("age must be >= 0");
  if (!resident) return "BELOW_60"; // Senior slabs only apply to residents
  if (age >= 80) return "80_PLUS";
  if (age >= 60) return "60_TO_79";
  return "BELOW_60";
}

/**
 * Section 288B statutory rounding: Final aggregate amounts payable rounded off to nearest multiple of ₹10.
 */
function roundRupeeSection288B(value: number): number {
  return Math.round(value / 10) * 10;
}

/**
 * Section 288A statutory rounding: Taxable income rounded off to nearest multiple of ₹10.
 */
function roundIncomeSection288A(value: number): number {
  return Math.round(value / 10) * 10;
}

function surchargeRate(income: number, thresholds: IndiaIncomeTaxAY2026_27Parameters["newRegime"]["surcharge"]): number {
  let rate = 0;
  for (const tier of thresholds) {
    if (income > tier.incomeAbove) rate = tier.rate;
  }
  return rate;
}

function taxAtIncome(income: number, slabs: readonly TaxBracket[]): number {
  return progressiveTax(Math.max(0, income), slabs);
}

function calculateSurchargeAndRelief(
  taxableIncome: number,
  baseTax: number,
  regimeRules: IndiaIncomeTaxAY2026_27Parameters["newRegime"],
  slabs: readonly TaxBracket[],
): { surcharge: number; marginalRelief: number } {
  const rate = surchargeRate(taxableIncome, regimeRules.surcharge);
  const rawSurcharge = baseTax * rate / 100;
  if (rate === 0) return { surcharge: 0, marginalRelief: 0 };

  let threshold = 0;
  for (const candidate of regimeRules.marginalReliefThresholds) {
    if (taxableIncome > candidate) threshold = candidate;
  }

  if (threshold === 0) return { surcharge: rawSurcharge, marginalRelief: 0 };

  const taxAtThreshold = taxAtIncome(threshold, slabs);
  const rateAtThreshold = surchargeRate(threshold, regimeRules.surcharge);
  const surchargeAtThreshold = taxAtThreshold * rateAtThreshold / 100;
  
  const maximumWithRelief = (taxAtThreshold + surchargeAtThreshold) + Math.max(0, taxableIncome - threshold);
  const taxPlusSurcharge = baseTax + rawSurcharge;
  const marginalRelief = Math.max(0, taxPlusSurcharge - maximumWithRelief);

  return {
    surcharge: Math.max(0, rawSurcharge - marginalRelief),
    marginalRelief,
  };
}

/**
 * STAGE 1: Isolated Raw Full-Precision Income Tax Calculation Engine.
 * Evaluates all statutory income-tax steps at 100% unrounded floating-point precision.
 */
export function calculateRawUnroundedIncomeTax(
  input: IndiaIncomeTaxInput,
  registry: IndiaRuleRegistry = indiaRuleRegistry,
): RawIncomeTaxComputationDetails {
  ensureRuleRegistered(registry);

  if (!Number.isFinite(input.grossIncome) || input.grossIncome < 0) {
    throw new Error("grossIncome must be >= 0");
  }
  const salaryIncome = input.salaryIncome ?? 0;
  const additionalDeductions = input.additionalDeductions ?? 0;
  if (!Number.isFinite(salaryIncome) || salaryIncome < 0 || salaryIncome > input.grossIncome) {
    throw new Error("salaryIncome must be between 0 and grossIncome");
  }
  if (!Number.isFinite(additionalDeductions) || additionalDeductions < 0) {
    throw new Error("additionalDeductions must be >= 0");
  }
  if (input.specialRateIncome && input.specialRateIncome > 0) {
    throw new Error(
      "Special-rate income (e.g. Capital Gains u/s 111A/112A, Virtual Digital Assets u/s 115BBH) cannot be calculated as ordinary slab income. Use dedicated capital gains calculators."
    );
  }

  const rule = registry.resolveActiveVerified<IndiaIncomeTaxAY2026_27Parameters>({
    domain: "INCOME_TAX",
    ruleId: RULE_ID,
    version: "2026-27",
  });

  const rules = input.regime === "NEW" ? rule.parameters.newRegime : rule.parameters.oldRegime;
  const slabs = rules.slabs[ageBand(input.age ?? 30, input.resident ?? true)];
  const rawStandardDeduction = Math.min(rules.standardDeduction, salaryIncome);
  const rawAdditionalDeductions = input.regime === "OLD" ? additionalDeductions : 0;

  // Unrounded raw taxable income
  const rawTaxableIncome = Math.max(0, input.grossIncome - rawStandardDeduction - rawAdditionalDeductions);

  // Full-precision tax before rebate
  const rawIncomeTaxBeforeRebate = taxAtIncome(rawTaxableIncome, slabs);

  // Section 87A rebate
  const rawRebate87A = input.resident !== false && rawTaxableIncome <= rules.rebate87A.taxableIncomeLimit
    ? Math.min(rawIncomeTaxBeforeRebate, rules.rebate87A.maxRebate)
    : 0;

  const rawTaxAfterRebate = Math.max(0, rawIncomeTaxBeforeRebate - rawRebate87A);

  // New Regime Marginal Relief for Rebate Boundary
  let rawTaxAfterRebateRelief = rawTaxAfterRebate;
  if (input.regime === "NEW" && rawTaxableIncome > rules.rebate87A.taxableIncomeLimit) {
    const excessIncome = rawTaxableIncome - rules.rebate87A.taxableIncomeLimit;
    if (rawTaxAfterRebate > excessIncome) {
      rawTaxAfterRebateRelief = excessIncome;
    }
  }

  const { surcharge: rawSurcharge, marginalRelief: rawSurchargeMarginalRelief } = calculateSurchargeAndRelief(
    rawTaxableIncome,
    rawTaxAfterRebateRelief,
    rules,
    slabs,
  );

  const rawTotalMarginalRelief = (rawTaxAfterRebate - rawTaxAfterRebateRelief) + rawSurchargeMarginalRelief;

  // Health & Education Cess (4%)
  const rawHealthAndEducationCess = (rawTaxAfterRebateRelief + rawSurcharge) * rule.parameters.healthAndEducationCessRate / 100;

  const rawTotalTaxBeforeStatutoryRounding = rawTaxAfterRebateRelief + rawSurcharge + rawHealthAndEducationCess;

  return {
    assessmentYear: "AY-2026-27",
    regime: input.regime,
    rawGrossIncome: input.grossIncome,
    rawStandardDeduction,
    rawAdditionalDeductions,
    rawTaxableIncome,
    rawIncomeTaxBeforeRebate,
    rawRebate87A,
    rawTaxAfterRebate,
    rawTaxAfterRebateRelief,
    rawSurcharge,
    rawSurchargeMarginalRelief,
    rawTotalMarginalRelief,
    rawHealthAndEducationCess,
    rawTotalTaxBeforeStatutoryRounding,
  };
}

/**
 * STAGE 2: Explicit Statutory Rounding Boundary.
 * Maps raw full-precision calculation details to final statutory outputs per Section 288A and Section 288B.
 */
export function applyStatutoryRoundingBoundary(
  rawDetails: RawIncomeTaxComputationDetails
): IndiaIncomeTaxResult {
  // Section 288A: Taxable income rounded to nearest multiple of ₹10
  const taxableIncome = applySection288ARounding(rawDetails.rawTaxableIncome);

  // Section 288B: Final aggregate tax liability rounded to nearest multiple of ₹10
  const totalTax = applySection288BRounding(rawDetails.rawTotalTaxBeforeStatutoryRounding);

  return {
    assessmentYear: rawDetails.assessmentYear,
    regime: rawDetails.regime,
    grossIncome: rawDetails.rawGrossIncome,
    standardDeduction: rawDetails.rawStandardDeduction,
    additionalDeductions: rawDetails.rawAdditionalDeductions,
    taxableIncome,
    incomeTaxBeforeRebate: rawDetails.rawIncomeTaxBeforeRebate,
    rebate87A: rawDetails.rawRebate87A,
    taxAfterRebate: rawDetails.rawTaxAfterRebateRelief,
    surcharge: rawDetails.rawSurcharge,
    marginalRelief: rawDetails.rawTotalMarginalRelief,
    healthAndEducationCess: rawDetails.rawHealthAndEducationCess,
    totalTax,
    effectiveTaxRatePercent: rawDetails.rawGrossIncome === 0 ? 0 : Number((totalTax / rawDetails.rawGrossIncome * 100).toFixed(2)),
    totalTaxFormatted: formatIndianCurrency(totalTax),
    rawDetails,
  };
}

/**
 * Main Income Tax Calculator entry point executing Stage 1 (Raw Precision) -> Stage 2 (Statutory Boundary).
 */
export function calculateIndiaIncomeTax(
  input: IndiaIncomeTaxInput,
  registry: IndiaRuleRegistry = indiaRuleRegistry,
): IndiaIncomeTaxResult {
  const rawDetails = calculateRawUnroundedIncomeTax(input, registry);
  return applyStatutoryRoundingBoundary(rawDetails);
}

export const calculateIndiaIncomeTaxAY2026_27 = calculateIndiaIncomeTax;
