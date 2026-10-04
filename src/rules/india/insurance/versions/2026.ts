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
    maxPremiumRatioOfSumAssuredPercent: number;
    annualAggregatePremiumThresholdNonUlip: number;
    modelingDisclaimer: string;
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
    effectiveFromDate: string; // "2025-09-22" GST Council Reform
    individualLifeInsurance: number; // 0% Exempt post Sept 22, 2025
    individualHealthInsurance: number; // 0% Exempt post Sept 22, 2025
    groupLifeHealthInsurance: number; // 18%
    motorInsurance: number; // 18%
    travelInsurance: number; // 18%
    propertyInsurance: number; // 18%
    businessInsurance: number; // 18%
    historicalPreSept2025IndividualRate: number; // 18%
  };
  planningAssumptions: {
    label: string;
    cityTierMultipliers: {
      TIER_1: number;
      TIER_2: number;
      TIER_3: number;
    };
    preExistingConditionMultiplier: number;
    roomCategoryMultipliers: {
      SHARED: number;
      SINGLE_PRIVATE: number;
      SUITE: number;
    };
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
      maxPremiumRatioOfSumAssuredPercent: 10,
      annualAggregatePremiumThresholdNonUlip: 500000,
      modelingDisclaimer: "Section 10(10D) modeling covers statutory sum-assured ratios and the ₹5L aggregate premium limit (Finance Act 2023). Complete legal tax-free status depends on individual policy terms and historical issuance dates.",
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
      effectiveFromDate: "2025-09-22",
      individualLifeInsurance: 0, // Exempt post Sept 22, 2025 GST Council decision
      individualHealthInsurance: 0, // Exempt post Sept 22, 2025 GST Council decision
      groupLifeHealthInsurance: 18,
      motorInsurance: 18,
      travelInsurance: 18,
      propertyInsurance: 18,
      businessInsurance: 18,
      historicalPreSept2025IndividualRate: 18,
    },
    planningAssumptions: {
      label: "CalcPlatform Planning Assumptions (Not IRDAI Statutory Rules)",
      cityTierMultipliers: {
        TIER_1: 1.5,
        TIER_2: 1.2,
        TIER_3: 1.0,
      },
      preExistingConditionMultiplier: 1.25,
      roomCategoryMultipliers: {
        SHARED: 1.0,
        SINGLE_PRIVATE: 1.15,
        SUITE: 1.3,
      },
    },
  },
  provenance: {
    authority: "GST Council 56th Meeting Decision (Eff. 22 Sept 2025), IRDAI & Income Tax Act, 1961",
    sourceUrl: "https://cbic-gst.gov.in / https://irdai.gov.in",
    sourceDocument: "GST Council Exemption Notification for Individual Life & Health Insurance (Sept 2025), IRDAI Motor Tariff & Income Tax Sec 80D/80C/10(10D)",
    effectiveFrom: "2025-09-22",
    effectiveTo: null,
    verifiedAt: "2026-04-01T00:00:00.000Z",
    verifiedBy: "CalcPlatform Regulatory Audit Team",
  },
};
