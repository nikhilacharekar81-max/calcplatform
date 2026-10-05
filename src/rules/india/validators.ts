import type { IndiaRuleEnvelope } from "./types.ts";

export function validateRuleEnvelope<T>(rule: IndiaRuleEnvelope<T>): void {
  if (!rule.ruleId || !rule.domain || rule.jurisdiction !== "IN") {
    throw new Error("Invalid rule identity");
  }
  if (!rule.version) {
    throw new Error("Rule version is required");
  }
  if (!rule.provenance.authority || typeof rule.provenance.authority !== "string") {
    throw new Error("Rule authority is required");
  }
  if (!rule.provenance.sourceUrl) {
    throw new Error("Rule source URL is required");
  }
  
  // Validate that sourceUrl is a valid HTTP or HTTPS URL (no multiple URLs or plain text)
  try {
    const parsedUrl = new URL(rule.provenance.sourceUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error(`Rule sourceUrl must be a valid HTTP/HTTPS URL, received: "${rule.provenance.sourceUrl}"`);
  }

  if (!rule.provenance.effectiveFrom) {
    throw new Error("Rule effectiveFrom is required");
  }

  // Validate date sequence if effectiveTo is specified
  if (rule.provenance.effectiveTo) {
    const fromTime = new Date(rule.provenance.effectiveFrom).getTime();
    const toTime = new Date(rule.provenance.effectiveTo).getTime();
    if (!isNaN(fromTime) && !isNaN(toTime) && fromTime > toTime) {
      throw new Error(`effectiveFrom (${rule.provenance.effectiveFrom}) cannot be later than effectiveTo (${rule.provenance.effectiveTo})`);
    }
  }

  if (rule.status === "ACTIVE_VERIFIED") {
    if (!rule.provenance.verifiedAt) {
      throw new Error("ACTIVE_VERIFIED rules require verifiedAt");
    }
    if (!rule.provenance.verifiedBy || typeof rule.provenance.verifiedBy !== "string") {
      throw new Error("ACTIVE_VERIFIED rules require verifiedBy attribution");
    }
  }
}
