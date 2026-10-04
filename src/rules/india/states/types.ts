import type { IndiaRuleEnvelope } from "../types.ts";

export type IndianStateCode =
  | "AP" | "AR" | "AS" | "BR" | "CG" | "GA" | "GJ" | "HR" | "HP" | "JH"
  | "KA" | "KL" | "MP" | "MH" | "MN" | "ML" | "MZ" | "NL" | "OD" | "PB"
  | "RJ" | "SK" | "TN" | "TS" | "TR" | "UP" | "UK" | "WB"
  | "AN" | "CH" | "DN" | "DL" | "JK" | "LA" | "LD" | "PY"
  | string;

export interface StateTaxRuleParameters {
  stateCode: IndianStateCode;
  stateName: string;
  professionalTaxLevied?: boolean;
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
