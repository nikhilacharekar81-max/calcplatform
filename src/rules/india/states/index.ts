import type { StateTaxRule } from "./types.ts";

export * from "./types.ts";

// Maharashtra State Template / Specification (Draft / Unverified until state gazette verification)
export const MAHARASHTRA_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-MH-2026",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2026-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "MH",
    stateName: "Maharashtra",
    professionalTaxSchedule: [
      { monthlySalaryAbove: 7500, monthlyTax: 175, specialMonthTax: { month: 2, tax: 300 } },
      { monthlySalaryAbove: 10000, monthlyTax: 200, specialMonthTax: { month: 2, tax: 300 } },
    ],
    stampDutySchedule: [
      { category: "male", ratePercent: 5, metroCessPercent: 1 },
      { category: "female", ratePercent: 4, metroCessPercent: 1 },
      { category: "joint", ratePercent: 5, metroCessPercent: 1 },
    ],
    registrationChargeRatePercent: 1,
    maxRegistrationFee: 30000,
  },
  provenance: {
    authority: "Government of Maharashtra Department of Goods and Services Tax",
    sourceUrl: "https://mahagst.gov.in/",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    verifiedAt: null,
    verifiedBy: null,
  },
};

// Karnataka State Template
export const KARNATAKA_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-KA-2026",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2026-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "KA",
    stateName: "Karnataka",
    professionalTaxSchedule: [
      { monthlySalaryAbove: 25000, monthlyTax: 200 },
    ],
    stampDutySchedule: [
      { category: "general", ratePercent: 5 },
    ],
    registrationChargeRatePercent: 1,
  },
  provenance: {
    authority: "Government of Karnataka Commercial Taxes Department",
    sourceUrl: "https://karsgst.gov.in/",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    verifiedAt: null,
    verifiedBy: null,
  },
};

// Delhi State Template
export const DELHI_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-DL-2026",
  domain: "STAMP_DUTY",
  jurisdiction: "IN",
  version: "2026-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "DL",
    stateName: "Delhi",
    stampDutySchedule: [
      { category: "female", ratePercent: 4 },
      { category: "male", ratePercent: 6 },
      { category: "joint", ratePercent: 5 },
    ],
    registrationChargeRatePercent: 1,
  },
  provenance: {
    authority: "Revenue Department, Government of NCT of Delhi",
    sourceUrl: "https://revenue.delhi.gov.in/",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    verifiedAt: null,
    verifiedBy: null,
  },
};

export const STATE_RULE_REGISTRY: Record<string, StateTaxRule> = {
  MH: MAHARASHTRA_STATE_RULE,
  KA: KARNATAKA_STATE_RULE,
  DL: DELHI_STATE_RULE,
};
