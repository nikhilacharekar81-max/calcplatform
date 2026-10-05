import type { IndiaRuleEnvelope } from "./types.ts";

export interface GstRuleParameters {
  rates: readonly number[];
  compositionRates?: readonly number[];
}

export interface TdsRuleParameters {
  rates: Readonly<Record<string, number>>;
  thresholds?: Readonly<Record<string, number>>;
}

export interface CapitalGainsRuleParameters {
  holdingPeriodDays: Readonly<Record<string, number>>;
  rates: Readonly<Record<string, number>>;
  exemptionRules?: readonly string[];
}

export interface EpfRuleParameters {
  employeeRate: number;
  employerRate: number;
  wageCeiling?: number | null;
}

export interface NpsRuleParameters {
  tier1DeductionLimit?: number;
  additionalNpsLimit?: number;
  contributionLimits?: Readonly<Record<string, number>>;
  deductionLimits?: Readonly<Record<string, number>>;
}

export interface InsuranceRuleParameters {
  maxEntryAge?: number;
  minTermYears?: number;
  maxTermYears?: number;
}

export interface StateRateRuleParameters {
  state: string;
  rates: Readonly<Record<string, number>>;
  thresholds?: Readonly<Record<string, number>>;
}

export type GstRule = IndiaRuleEnvelope<GstRuleParameters>;
export type TdsRule = IndiaRuleEnvelope<TdsRuleParameters>;
export type CapitalGainsRule = IndiaRuleEnvelope<CapitalGainsRuleParameters>;
export type EpfRule = IndiaRuleEnvelope<EpfRuleParameters>;
export type NpsRule = IndiaRuleEnvelope<NpsRuleParameters>;
export type InsuranceRule = IndiaRuleEnvelope<InsuranceRuleParameters>;
export type StateRateRule = IndiaRuleEnvelope<StateRateRuleParameters>;
