import type { IndiaRuleEnvelope } from "../types.ts";

export type IndianStateCode =
  | "MH" // Maharashtra
  | "GJ" // Gujarat
  | "KA" // Karnataka
  | "DL" // Delhi
  | "TN" // Tamil Nadu
  | "WB" // West Bengal
  | "TS" // Telangana
  | "UP" // Uttar Pradesh
  | string;

export interface StateTaxRuleParameters {
  stateCode: IndianStateCode;
  stateName: string;
  professionalTaxSchedule?: Array<{
    monthlySalaryAbove: number;
    monthlyTax: number;
    specialMonthTax?: { month: number; tax: number };
  }>;
  stampDutySchedule?: Array<{
    category: "male" | "female" | "joint" | "general";
    ratePercent: number;
    metroCessPercent?: number;
    localBodyTaxPercent?: number;
  }>;
  registrationChargeRatePercent?: number;
  maxRegistrationFee?: number;
}

export type StateTaxRule = IndiaRuleEnvelope<StateTaxRuleParameters>;
