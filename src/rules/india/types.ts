export type IndiaRuleStatus =
  | "DRAFT"
  | "UNVERIFIED"
  | "ACTIVE_VERIFIED"
  | "SUPERSEDED"
  | "RETIRED";

export interface RuleProvenance {
  authority: string;
  sourceUrl: string;
  sourceDocument?: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  verifiedAt: string | null;
  verifiedBy?: string | null;
}

export interface IndiaRuleEnvelope<TParameters = unknown> {
  ruleId: string;
  domain: string;
  jurisdiction: "IN";
  version: string;
  assessmentYear?: string;
  status: IndiaRuleStatus;
  parameters: TParameters;
  provenance: RuleProvenance;
}

export type IndiaDomain =
  | "INCOME_TAX"
  | "GST"
  | "TDS"
  | "CAPITAL_GAINS"
  | "EPF"
  | "NPS"
  | "LOANS"
  | "INVESTMENTS"
  | "INSURANCE"
  | "PROPERTY"
  | "PROFESSIONAL_TAX"
  | "STAMP_DUTY";
