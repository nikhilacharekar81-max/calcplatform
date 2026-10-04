import type { IndiaRuleEnvelope } from "../../types.ts";

export interface IndiaInsuranceParameters {
  section80D: {
    selfFamilyUnder60: number;
    selfFamilySenior: number;
    parentsUnder60: number;
    parentsSenior: number;
    preventiveHealthCheckupSubLimit: number;
  };
  section80C: {
    maxDeductionLimit: number;
    maxPremiumPercentageOfSumAssured: number;
  };
  section10_10D: {
    maxTaxFreeAnnualPremiumThreshold: number;
  };
  motorIdvDepreciationPercent: Array<{
    minAgeMonths: number;
    maxAgeMonths: number;
    depreciationPercent: number;
  }>;
  motorNcbLadderPercent: Array<{
    claimFreeYears: number;
    ncbPercent: number;
  }>;
  gstRatesPercent: {
    lifeInsurance: number;
    healthInsurance: number;
    motorInsurance: number;
    travelInsurance: number;
    propertyInsurance: number;
    businessInsurance: number;
  };
}

export const INDIA_INSURANCE_STATUTORY_RULES_2026: IndiaRuleEnvelope<IndiaInsuranceParameters> = {
  ruleId: "INSURANCE-INDIA-2026",
  domain: "INSURANCE",
  jurisdiction: "IN",
  version: "2026-01",
  status: "ACTIVE_VERIFIED",
  parameters: {
    section80D: {
      selfFamilyUnder60: 25000,
      selfFamilySenior: 50000,
      parentsUnder60: 25000,
      parentsSenior: 50000,
      preventiveHealthCheckupSubLimit: 5000,
    },
    section80C: {
      maxDeductionLimit: 150000,
      maxPremiumPercentageOfSumAssured: 10,
    },
    section10_10D: {
      maxTaxFreeAnnualPremiumThreshold: 500000,
    },
    motorIdvDepreciationPercent: [
      { minAgeMonths: 0, maxAgeMonths: 6, depreciationPercent: 5 },
      { minAgeMonths: 6, maxAgeMonths: 12, depreciationPercent: 15 },
      { minAgeMonths: 12, maxAgeMonths: 24, depreciationPercent: 20 },
      { minAgeMonths: 24, maxAgeMonths: 36, depreciationPercent: 30 },
      { minAgeMonths: 36, maxAgeMonths: 48, depreciationPercent: 40 },
      { minAgeMonths: 48, maxAgeMonths: 60, depreciationPercent: 50 },
    ],
    motorNcbLadderPercent: [
      { claimFreeYears: 0, ncbPercent: 0 },
      { claimFreeYears: 1, ncbPercent: 20 },
      { claimFreeYears: 2, ncbPercent: 25 },
      { claimFreeYears: 3, ncbPercent: 35 },
      { claimFreeYears: 4, ncbPercent: 45 },
      { claimFreeYears: 5, ncbPercent: 50 },
    ],
    gstRatesPercent: {
      lifeInsurance: 18,
      healthInsurance: 18,
      motorInsurance: 18,
      travelInsurance: 18,
      propertyInsurance: 18,
      businessInsurance: 18,
    },
  },
  provenance: {
    authority: "Insurance Regulatory and Development Authority of India (IRDAI) & Income Tax Act, 1961",
    sourceUrl: "https://irdai.gov.in",
    sourceDocument: "IRDAI Motor Tariff Schedule & Income Tax Act Section 80D/80C Provisions",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    verifiedAt: "2026-04-01T00:00:00.000Z",
    verifiedBy: "CalcPlatform Regulatory Audit Team",
  },
};
