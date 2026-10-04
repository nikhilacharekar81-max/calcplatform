import { indiaRuleRegistry, listIndiaRules } from "../../../src/rules/india/registry.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string): void {
  assert(actual === expected, `${message}: expected ${String(expected)}, got ${String(actual)}`);
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export function runIndiaRegistryExpansionTests(): readonly TestResult[] {
  const results: TestResult[] = [];

  const runTest = (name: string, fn: () => void): void => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  runTest("India Registry - All Planned Domains Present", () => {
    const domains = new Set(listIndiaRules().map((r) => r.domain));
    assert(domains.has("INCOME_TAX"), "INCOME_TAX domain present");
    assert(domains.has("GST"), "GST domain present");
    assert(domains.has("TDS"), "TDS domain present");
    assert(domains.has("CAPITAL_GAINS"), "CAPITAL_GAINS domain present");
    assert(domains.has("EPF"), "EPF domain present");
    assert(domains.has("NPS"), "NPS domain present");
    assert(domains.has("PROFESSIONAL_TAX"), "PROFESSIONAL_TAX domain present");
    assert(domains.has("STAMP_DUTY"), "STAMP_DUTY domain present");
  });

  runTest("India Registry - ACTIVE_VERIFIED Allowed", () => {
    const rule = indiaRuleRegistry.resolveActiveVerified({
      domain: "INCOME_TAX",
      ruleId: "IT-INDIA-AY-2026-27-INDIVIDUAL",
      version: "2026-27",
    });
    equal(rule.status, "ACTIVE_VERIFIED", "Status must be ACTIVE_VERIFIED");
  });

  runTest("India Registry - UNVERIFIED Blocked from Production Execution", () => {
    let blocked = false;
    try {
      indiaRuleRegistry.resolveActiveVerified({
        domain: "GST",
        ruleId: "GST-INDIA-2026-UNVERIFIED",
        version: "2026-01",
      });
    } catch (err: any) {
      if (err.message.includes("is not production-active: UNVERIFIED")) {
        blocked = true;
      }
    }
    assert(blocked, "UNVERIFIED rule resolution must be blocked in production");
  });

  return results;
}
