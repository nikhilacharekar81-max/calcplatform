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
}

const RULE_ID = "IT-INDIA-AY-2026-27-INDIVIDUAL";

function ensureRuleRegistered(registry: IndiaRuleRegistry): void {
  if (!registry.resolve({ domain: "INCOME_TAX", ruleId: RULE_ID, version: "2026-27" })) {
    registry.register(INDIA_INCOME_TAX_AY_2026_27);
  }
}

function ageBand(age: number): IndiaTaxpayerAgeBand {
  if (!Number.isFinite(age) || age < 0) throw new Error("age must be >= 0");
  if (age >= 80) return "80_PLUS";
  if (age >= 60) return "60_TO_79";
  return "BELOW_60";
}

function roundRupee(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
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
  const maximumWithRelief = taxAtThreshold + (taxableIncome - threshold);
  const taxPlusSurcharge = baseTax + rawSurcharge;
  const marginalRelief = Math.min(
    rawSurcharge,
    Math.max(0, taxPlusSurcharge - maximumWithRelief),
  );

  return {
    surcharge: Math.max(0, rawSurcharge - marginalRelief),
    marginalRelief,
  };
}

export function calculateIndiaIncomeTax(
  input: IndiaIncomeTaxInput,
  registry: IndiaRuleRegistry = indiaRuleRegistry,
): IndiaIncomeTaxResult {
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
  const slabs = rules.slabs[ageBand(input.age ?? 30)];
  const standardDeduction = Math.min(rules.standardDeduction, salaryIncome);
  const taxableIncome = Math.max(0, input.grossIncome - standardDeduction - (input.regime === "OLD" ? additionalDeductions : 0));
  const incomeTaxBeforeRebate = taxAtIncome(taxableIncome, slabs);

  const rebate87A = input.resident !== false && taxableIncome <= rules.rebate87A.taxableIncomeLimit
    ? Math.min(incomeTaxBeforeRebate, rules.rebate87A.maxRebate)
    : 0;

  const taxAfterRebate = Math.max(0, incomeTaxBeforeRebate - rebate87A);
  const { surcharge, marginalRelief } = calculateSurchargeAndRelief(
    taxableIncome,
    taxAfterRebate,
    rules,
    slabs,
  );
  const healthAndEducationCess = (taxAfterRebate + surcharge) * rule.parameters.healthAndEducationCessRate / 100;
  const totalTax = roundRupee(taxAfterRebate + surcharge + healthAndEducationCess);

  return {
    assessmentYear: "AY-2026-27",
    regime: input.regime,
    grossIncome: input.grossIncome,
    standardDeduction: roundRupee(standardDeduction),
    additionalDeductions: roundRupee(input.regime === "OLD" ? additionalDeductions : 0),
    taxableIncome: roundRupee(taxableIncome),
    incomeTaxBeforeRebate: roundRupee(incomeTaxBeforeRebate),
    rebate87A: roundRupee(rebate87A),
    taxAfterRebate: roundRupee(taxAfterRebate),
    surcharge: roundRupee(surcharge),
    marginalRelief: roundRupee(marginalRelief),
    healthAndEducationCess: roundRupee(healthAndEducationCess),
    totalTax,
    effectiveTaxRatePercent: input.grossIncome === 0 ? 0 : roundRupee(totalTax / input.grossIncome * 100),
    totalTaxFormatted: formatIndianCurrency(totalTax),
  };
}
