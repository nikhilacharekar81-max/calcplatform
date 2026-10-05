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
  
  // Validate that sourceUrl is a valid HTTPS URL
  try {
    const parsedUrl = new URL(rule.provenance.sourceUrl);
    if (parsedUrl.protocol !== "https:") {
      throw new Error(`Rule sourceUrl must use HTTPS protocol, received: "${rule.provenance.sourceUrl}"`);
    }
  } catch (err: any) {
    if (!rule.provenance.sourceUrl.startsWith("urn:") && !rule.provenance.sourceUrl.startsWith("archive:")) {
      throw new Error(`Rule sourceUrl must be a valid HTTPS URL, received: "${rule.provenance.sourceUrl}"`);
    }
  }

  if (!rule.provenance.effectiveFrom || !/^\d{4}-\d{2}-\d{2}$/.test(rule.provenance.effectiveFrom)) {
    throw new Error(`Rule effectiveFrom must be in strict YYYY-MM-DD format, received: "${rule.provenance.effectiveFrom}"`);
  }

  // Validate date sequence if effectiveTo is specified
  if (rule.provenance.effectiveTo) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(rule.provenance.effectiveTo)) {
      throw new Error(`Rule effectiveTo must be in strict YYYY-MM-DD format, received: "${rule.provenance.effectiveTo}"`);
    }
    const fromTime = new Date(rule.provenance.effectiveFrom).getTime();
    const toTime = new Date(rule.provenance.effectiveTo).getTime();
    if (!isNaN(fromTime) && !isNaN(toTime) && fromTime > toTime) {
      throw new Error(`effectiveFrom (${rule.provenance.effectiveFrom}) cannot be later than effectiveTo (${rule.provenance.effectiveTo})`);
    }
  }

  if (rule.status === "ACTIVE_VERIFIED") {
    // Structural Guard: Reject placeholder references from ACTIVE_VERIFIED status
    const urlLower = rule.provenance.sourceUrl.toLowerCase();
    if (urlLower.includes("pending") || urlLower.includes("placeholder") || urlLower.includes("unverified") || urlLower.includes("example.com")) {
      throw new Error(`ACTIVE_VERIFIED rules cannot use placeholder or pending source URLs: "${rule.provenance.sourceUrl}"`);
    }

    if (!rule.provenance.verifiedAt || !/^\d{4}-\d{2}-\d{2}/.test(rule.provenance.verifiedAt)) {
      throw new Error("ACTIVE_VERIFIED rules require verifiedAt in strict date format (YYYY-MM-DD...)");
    }
    if (!rule.provenance.verifiedBy || typeof rule.provenance.verifiedBy !== "string" || rule.provenance.verifiedBy.trim().length === 0) {
      throw new Error("ACTIVE_VERIFIED rules require verifiedBy attribution");
    }
    if (!rule.provenance.sourceDocument || rule.provenance.sourceDocument.trim().length === 0) {
      throw new Error("ACTIVE_VERIFIED rules require sourceDocument reference");
    }
  }
}
