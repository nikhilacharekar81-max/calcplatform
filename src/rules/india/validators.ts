import type { IndiaRuleEnvelope } from "./types.ts";

export function validateRuleEnvelope<T>(rule: IndiaRuleEnvelope<T>): void {
  if (!rule.ruleId || !rule.domain || rule.jurisdiction !== "IN") {
    throw new Error("Invalid rule identity");
  }
  if (!rule.version) {
    throw new Error("Rule version is required");
  }
  if (!rule.provenance.authority) {
    throw new Error("Rule authority is required");
  }
  if (!rule.provenance.sourceUrl) {
    throw new Error("Rule source URL is required");
  }
  if (!rule.provenance.effectiveFrom) {
    throw new Error("Rule effectiveFrom is required");
  }
  if (rule.status === "ACTIVE_VERIFIED" && !rule.provenance.verifiedAt) {
    throw new Error("ACTIVE_VERIFIED rules require verifiedAt");
  }
}
