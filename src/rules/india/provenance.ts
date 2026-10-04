import type { IndiaRuleEnvelope } from "./types.ts";

export function assertProductionRule<T>(rule: IndiaRuleEnvelope<T>): IndiaRuleEnvelope<T> {
  if (rule.status !== "ACTIVE_VERIFIED") {
    throw new Error(`Rule ${rule.ruleId} is not production-active: ${rule.status}`);
  }
  if (!rule.provenance.verifiedAt) {
    throw new Error(`Rule ${rule.ruleId} has no verification timestamp`);
  }
  return rule;
}
