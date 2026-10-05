import type { StateTaxRule } from "./types.ts";

export * from "./types.ts";

const UNVERIFIED_PROVENANCE = {
  authority: "Government State Revenue & Commercial Tax Departments",
  sourceUrl: "https://www.india.gov.in/",
  effectiveFrom: "2026-04-01",
  effectiveTo: null,
  verifiedAt: null,
  verifiedBy: null,
};

// 1. Maharashtra (MH)
export const MAHARASHTRA_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-MH-2025",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2025-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "MH",
    stateName: "Maharashtra",
    professionalTaxLevied: true,
    professionalTaxSchedule: [
      { monthlySalaryAbove: 7500, monthlyTax: 175, femaleExemptionThreshold: 25000 },
      { monthlySalaryAbove: 10000, monthlyTax: 200, specialMonthTax: { month: 2, tax: 300 }, femaleExemptionThreshold: 25000 },
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
    authority: "Maharashtra State Tax Department (PT) & Inspector General of Registration and Stamps (IGR Maharashtra)",
    sourceUrl: "https://mahagst.gov.in/",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    verifiedAt: "2026-10-04",
    verifiedBy: "Official Maharashtra PT Gazette & IGR Notification Review",
  },
};

// 2. Karnataka (KA)
export const KARNATAKA_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-KA-2026",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2026-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "KA",
    stateName: "Karnataka",
    professionalTaxLevied: true,
    professionalTaxSchedule: [
      { monthlySalaryAbove: 15000, monthlyTax: 200, specialMonthTax: { month: 2, tax: 300 } },
    ],
    stampDutySchedule: [
      { category: "general", ratePercent: 5 },
    ],
    registrationChargeRatePercent: 1,
  },
  provenance: {
    authority: "Karnataka Commercial Taxes Department",
    sourceUrl: "https://karsgst.gov.in/",
    effectiveFrom: "2025-04-01",
    effectiveTo: null,
    verifiedAt: "2026-10-04",
    verifiedBy: "Karnataka Commercial Taxes Notification Review",
  },
};

// 3. Delhi (DL)
export const DELHI_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-DL-2025",
  domain: "STAMP_DUTY",
  jurisdiction: "IN",
  version: "2025-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "DL",
    stateName: "Delhi",
    professionalTaxLevied: false,
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
    effectiveFrom: "2025-04-01",
    effectiveTo: null,
    verifiedAt: null,
    verifiedBy: null,
  },
};

// 4. Gujarat (GJ)
export const GUJARAT_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-GJ-2025",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2025-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "GJ",
    stateName: "Gujarat",
    professionalTaxLevied: true,
  },
  provenance: UNVERIFIED_PROVENANCE,
};

// 5. Tamil Nadu (TN)
export const TAMIL_NADU_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-TN-2025",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2025-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "TN",
    stateName: "Tamil Nadu",
    professionalTaxLevied: true,
  },
  provenance: UNVERIFIED_PROVENANCE,
};

// 6. West Bengal (WB)
export const WEST_BENGAL_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-WB-2025",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2025-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "WB",
    stateName: "West Bengal",
    professionalTaxLevied: true,
  },
  provenance: UNVERIFIED_PROVENANCE,
};

// 7. Telangana (TS)
export const TELANGANA_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-TS-2025",
  domain: "PROFESSIONAL_TAX",
  jurisdiction: "IN",
  version: "2025-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "TS",
    stateName: "Telangana",
    professionalTaxLevied: true,
  },
  provenance: UNVERIFIED_PROVENANCE,
};

// 8. Uttar Pradesh (UP)
export const UTTAR_PRADESH_STATE_RULE: StateTaxRule = {
  ruleId: "STATE-IN-UP-2025",
  domain: "STAMP_DUTY",
  jurisdiction: "IN",
  version: "2025-v1",
  status: "UNVERIFIED",
  parameters: {
    stateCode: "UP",
    stateName: "Uttar Pradesh",
    professionalTaxLevied: false,
  },
  provenance: UNVERIFIED_PROVENANCE,
};

// Helper factory for remaining states & UTs (Minimal draft registration templates without invented schedules)
function createDraftStateRule(code: string, name: string, authorityName = `Government of ${name}`): StateTaxRule {
  return {
    ruleId: `STATE-IN-${code}-2025`,
    domain: "JURISDICTION_REGISTRATION",
    jurisdiction: "IN",
    version: "2025-v1",
    status: "DRAFT",
    parameters: {
      stateCode: code,
      stateName: name,
    },
    provenance: {
      authority: authorityName,
      sourceUrl: "https://www.india.gov.in/",
      effectiveFrom: "2025-04-01",
      effectiveTo: null,
      verifiedAt: null,
      verifiedBy: null,
    },
  };
}

export const STATE_RULE_REGISTRY: Record<string, StateTaxRule> = {
  MH: MAHARASHTRA_STATE_RULE,
  KA: KARNATAKA_STATE_RULE,
  DL: DELHI_STATE_RULE,
  GJ: GUJARAT_STATE_RULE,
  TN: TAMIL_NADU_STATE_RULE,
  WB: WEST_BENGAL_STATE_RULE,
  TS: TELANGANA_STATE_RULE,
  UP: UTTAR_PRADESH_STATE_RULE,
  // Remaining 20 States (28 total states)
  AP: createDraftStateRule("AP", "Andhra Pradesh"),
  AR: createDraftStateRule("AR", "Arunachal Pradesh"),
  AS: createDraftStateRule("AS", "Assam"),
  BR: createDraftStateRule("BR", "Bihar"),
  CG: createDraftStateRule("CG", "Chhattisgarh"),
  GA: createDraftStateRule("GA", "Goa"),
  HR: createDraftStateRule("HR", "Haryana"),
  HP: createDraftStateRule("HP", "Himachal Pradesh"),
  JH: createDraftStateRule("JH", "Jharkhand"),
  KL: createDraftStateRule("KL", "Kerala"),
  MP: createDraftStateRule("MP", "Madhya Pradesh"),
  MN: createDraftStateRule("MN", "Manipur"),
  ML: createDraftStateRule("ML", "Meghalaya"),
  MZ: createDraftStateRule("MZ", "Mizoram"),
  NL: createDraftStateRule("NL", "Nagaland"),
  OD: createDraftStateRule("OD", "Odisha"),
  PB: createDraftStateRule("PB", "Punjab"),
  RJ: createDraftStateRule("RJ", "Rajasthan"),
  SK: createDraftStateRule("SK", "Sikkim"),
  TR: createDraftStateRule("TR", "Tripura"),
  UK: createDraftStateRule("UK", "Uttarakhand"),
  // 8 Union Territories
  AN: createDraftStateRule("AN", "Andaman and Nicobar Islands", "Andaman and Nicobar Administration"),
  CH: createDraftStateRule("CH", "Chandigarh", "Chandigarh Administration"),
  DN: createDraftStateRule("DN", "Dadra and Nagar Haveli and Daman and Diu", "Dadra and Nagar Haveli and Daman and Diu Administration"),
  JK: createDraftStateRule("JK", "Jammu and Kashmir", "Government of Jammu and Kashmir"),
  LA: createDraftStateRule("LA", "Ladakh", "Ladakh Administration"),
  LD: createDraftStateRule("LD", "Lakshadweep", "Lakshadweep Administration"),
  PY: createDraftStateRule("PY", "Puducherry", "Government of Puducherry"),
};
