import type { IndiaIncomeTaxAY2026_27Parameters } from "../types.ts";

const OPEN_ENDED = 1000000000000000;

/**
 * FY 2026-27 / AY 2027-28 individual normal-rate rules, sourced from the Income-tax Act, 2025.
 */
export const INDIA_INCOME_TAX_AY_2027_28: Readonly<{
  ruleId: "IT-INDIA-AY-2027-28-INDIVIDUAL";
  domain: "INCOME_TAX";
  jurisdiction: "IN";
  version: "2027-28";
  assessmentYear: "AY-2027-28";
  status: "ACTIVE_VERIFIED";
  parameters: IndiaIncomeTaxAY2026_27Parameters;
  provenance: {
    authority: "Central Board of Direct Taxes (CBDT)";
    sourceUrl: string;
    sourceDocument: string;
    effectiveFrom: string;
    effectiveTo: null;
    verifiedAt: string;
    verifiedBy: string;
  };
}> = {
  ruleId: "IT-INDIA-AY-2027-28-INDIVIDUAL",
  domain: "INCOME_TAX",
  jurisdiction: "IN",
  version: "2027-28",
  assessmentYear: "AY-2027-28",
  status: "ACTIVE_VERIFIED",
  parameters: {
    taxYear: "FY 2026-27",
    assessmentYear: "AY 2027-28",
    act: "Income-tax Act, 2025",
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
    authority: "Central Board of Direct Taxes (CBDT)",
    sourceUrl: "https://www.incometax.gov.in/",
    sourceDocument: "Income-tax Act, 2025 — FY 2026-27 / AY 2027-28 Direct Taxes Code",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    verifiedAt: "2026-10-04",
    verifiedBy: "CalcPlatform Regulatory Audit Team",
  },
};

export const ay2027_28IncomeTax = INDIA_INCOME_TAX_AY_2027_28;
