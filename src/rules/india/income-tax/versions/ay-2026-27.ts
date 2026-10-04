import type { IndiaIncomeTaxAY2026_27Parameters } from "../types.ts";

const OPEN_ENDED = 1000000000000000;

/**
 * AY 2026-27 individual/HUF normal-rate rules, sourced from official
 * Income Tax Department material. This rule set intentionally excludes
 * special-rate income, capital-gains schedules, AMT/MAT, and other advanced
 * provisions that require additional domain inputs.
 */
export const INDIA_INCOME_TAX_AY_2026_27: Readonly<{
  ruleId: "IT-INDIA-AY-2026-27-INDIVIDUAL";
  domain: "INCOME_TAX";
  jurisdiction: "IN";
  version: "2026-27";
  assessmentYear: "AY-2026-27";
  status: "ACTIVE_VERIFIED";
  parameters: IndiaIncomeTaxAY2026_27Parameters;
  provenance: {
    authority: "Income Tax Department, Government of India";
    sourceUrl: string;
    sourceDocument: string;
    effectiveFrom: "2025-04-01";
    effectiveTo: null;
    verifiedAt: "2026-10-04";
    verifiedBy: "Official Income Tax Department source review on 2026-10-04";
  };
}> = {
  ruleId: "IT-INDIA-AY-2026-27-INDIVIDUAL",
  domain: "INCOME_TAX",
  jurisdiction: "IN",
  version: "2026-27",
  assessmentYear: "AY-2026-27",
  status: "ACTIVE_VERIFIED",
  parameters: {
    taxYear: "AY-2026-27",
    assessmentYear: "AY-2026-27",
    act: "Income Tax Act, 1961",
    healthAndEducationCessRate: 4,
    newRegime: {
      standardDeduction: 75000,
      slabs: {
        BELOW_60: [
          { upTo: 400000, rate: 0 },
          { upTo: 800000, rate: 5 },
          { upTo: 1200000, rate: 10 },
          { upTo: 1600000, rate: 15 },
          { upTo: 2000000, rate: 20 },
          { upTo: 2400000, rate: 25 },
          { upTo: OPEN_ENDED, rate: 30 },
        ],
        "60_TO_79": [
          { upTo: 400000, rate: 0 },
          { upTo: 800000, rate: 5 },
          { upTo: 1200000, rate: 10 },
          { upTo: 1600000, rate: 15 },
          { upTo: 2000000, rate: 20 },
          { upTo: 2400000, rate: 25 },
          { upTo: OPEN_ENDED, rate: 30 },
        ],
        "80_PLUS": [
          { upTo: 400000, rate: 0 },
          { upTo: 800000, rate: 5 },
          { upTo: 1200000, rate: 10 },
          { upTo: 1600000, rate: 15 },
          { upTo: 2000000, rate: 20 },
          { upTo: 2400000, rate: 25 },
          { upTo: OPEN_ENDED, rate: 30 },
        ],
      },
      rebate87A: { maxRebate: 60000, taxableIncomeLimit: 1200000 },
      surcharge: [
        { incomeAbove: 5000000, rate: 10 },
        { incomeAbove: 10000000, rate: 15 },
        { incomeAbove: 20000000, rate: 25 },
      ],
      marginalReliefThresholds: [5000000, 10000000, 20000000],
    },
    oldRegime: {
      standardDeduction: 50000,
      slabs: {
        BELOW_60: [
          { upTo: 250000, rate: 0 },
          { upTo: 500000, rate: 5 },
          { upTo: 1000000, rate: 20 },
          { upTo: OPEN_ENDED, rate: 30 },
        ],
        "60_TO_79": [
          { upTo: 300000, rate: 0 },
          { upTo: 500000, rate: 5 },
          { upTo: 1000000, rate: 20 },
          { upTo: OPEN_ENDED, rate: 30 },
        ],
        "80_PLUS": [
          { upTo: 500000, rate: 0 },
          { upTo: 1000000, rate: 20 },
          { upTo: OPEN_ENDED, rate: 30 },
        ],
      },
      rebate87A: { maxRebate: 12500, taxableIncomeLimit: 500000 },
      surcharge: [
        { incomeAbove: 5000000, rate: 10 },
        { incomeAbove: 10000000, rate: 15 },
        { incomeAbove: 20000000, rate: 25 },
        { incomeAbove: 50000000, rate: 37 },
      ],
      marginalReliefThresholds: [5000000, 10000000, 20000000, 50000000],
    },
  },
  provenance: {
    authority: "Income Tax Department, Government of India",
    sourceUrl: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1",
    sourceDocument: "Income Tax Department — Salaried Individuals for AY 2026-27",
    effectiveFrom: "2025-04-01",
    effectiveTo: null,
    verifiedAt: "2026-10-04",
    verifiedBy: "Official Income Tax Department source review on 2026-10-04",
  },
};

export const ay2026_27IncomeTax = INDIA_INCOME_TAX_AY_2026_27;
