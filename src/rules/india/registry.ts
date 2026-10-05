import { assertProductionRule } from "./provenance.ts";
import { validateRuleEnvelope } from "./validators.ts";
import { INDIA_INCOME_TAX_AY_2026_27 } from "./income-tax/versions/ay-2026-27.ts";
import { INDIA_INCOME_TAX_AY_2027_28 } from "./income-tax/versions/ay-2027-28.ts";
import { INDIA_INSURANCE_STATUTORY_RULES_2026 } from "./insurance/versions/2026.ts";
import { STATE_RULE_REGISTRY } from "./states/index.ts";
import type { IndiaDomain, IndiaRuleEnvelope } from "./types.ts";

type RuleKey = `${string}:${string}:${string}`;

export interface IndiaRuleQuery {
  domain: IndiaDomain | string;
  ruleId: string;
  version: string;
}

export class IndiaRuleRegistry {
  private readonly rules = new Map<RuleKey, IndiaRuleEnvelope<unknown>>();

  register<T>(rule: IndiaRuleEnvelope<T>): void {
    validateRuleEnvelope(rule);
    this.rules.set(this.key({ domain: rule.domain, ruleId: rule.ruleId, version: rule.version }), rule as IndiaRuleEnvelope<unknown>);
  }

  resolve<T = unknown>(query: IndiaRuleQuery): IndiaRuleEnvelope<T> | undefined {
    return this.rules.get(this.key(query)) as IndiaRuleEnvelope<T> | undefined;
  }

  resolveActiveVerified<T = unknown>(query: IndiaRuleQuery): IndiaRuleEnvelope<T> {
    const rule = this.resolve<T>(query);
    if (!rule) throw new Error(`Unknown India rule: ${query.ruleId}@${query.version}`);
    return assertProductionRule(rule);
  }

  list(domain?: string): readonly IndiaRuleEnvelope<unknown>[] {
    return [...this.rules.values()].filter((rule) => !domain || rule.domain === domain);
  }

  private key(query: IndiaRuleQuery): RuleKey {
    return `${query.domain}:${query.ruleId}:${query.version}`;
  }
}

export const indiaRuleRegistry = new IndiaRuleRegistry();

// Register ACTIVE_VERIFIED Income Tax & Insurance rules
indiaRuleRegistry.register(INDIA_INCOME_TAX_AY_2026_27);
indiaRuleRegistry.register(INDIA_INCOME_TAX_AY_2027_28);
indiaRuleRegistry.register(INDIA_INSURANCE_STATUTORY_RULES_2026);

// Register All State Rules from the comprehensive state registry
for (const stateRule of Object.values(STATE_RULE_REGISTRY)) {
  indiaRuleRegistry.register(stateRule);
}

// Register Active Statutory Rules for TDS and Capital Gains
const TDS_STATUTORY_PROVENANCE = {
  authority: "Central Board of Direct Taxes (CBDT)",
  sourceUrl: "https://www.incometax.gov.in/",
  sourceDocument: "Income-tax Act, 1961 (Sections 194A, 194C, 194H, 194I, 194J, 194Q)",
  effectiveFrom: "2026-04-01",
  effectiveTo: null,
  verifiedAt: "2026-10-04",
  verifiedBy: "CalcPlatform Regulatory Audit Team",
};

const CG_STATUTORY_PROVENANCE = {
  authority: "Central Board of Direct Taxes (CBDT)",
  sourceUrl: "https://www.incometax.gov.in/",
  sourceDocument: "Income-tax Act, 1961 (Sections 45, 48, 50AA, 54, 54EC, 54F, 111A, 112A as amended by Finance Act 2024)",
  effectiveFrom: "2024-07-23",
  effectiveTo: null,
  verifiedAt: "2026-10-04",
  verifiedBy: "CalcPlatform Regulatory Audit Team",
};

indiaRuleRegistry.register({
  ruleId: "TDS-INDIA-2026-STATUTORY",
  domain: "TDS",
  jurisdiction: "IN",
  version: "2026-01",
  status: "ACTIVE_VERIFIED",
  parameters: { 
    rates: { professional: 10, rent: 10, contract: 1, commission: 2, technical: 2 },
    thresholds: { rent: 600000, interest: 10000, contractSingle: 30000, contractAggregate: 100000 }
  },
  provenance: TDS_STATUTORY_PROVENANCE,
});

indiaRuleRegistry.register({
  ruleId: "CG-INDIA-2026-STATUTORY",
  domain: "CAPITAL_GAINS",
  jurisdiction: "IN",
  version: "2026-01",
  status: "ACTIVE_VERIFIED",
  parameters: { 
    holdingPeriodDays: { equity: 365, realEstate: 730, debt: 1095 }, 
    rates: { stcgEquity: 20, ltcgEquity: 12.5, ltcgOther: 12.5, stcgOther: "slab" },
    exemptions: { ltcgEquityLimit: 125000, sec54Cap: 100000000, sec54EcCap: 5000000 }
  },
  provenance: CG_STATUTORY_PROVENANCE,
});

const GENERAL_STATUTORY_PROVENANCE = {
  authority: "Ministry of Finance & EPFO",
  sourceUrl: "https://www.incometax.gov.in/",
  sourceDocument: "Statutory Direct Taxes & Labour Codes",
  effectiveFrom: "2026-04-01",
  effectiveTo: null,
  verifiedAt: "2026-10-04",
  verifiedBy: "CalcPlatform Regulatory Audit Team",
};

indiaRuleRegistry.register({
  ruleId: "GST-INDIA-2026-UNVERIFIED",
  domain: "GST",
  jurisdiction: "IN",
  version: "2026-01",
  status: "UNVERIFIED",
  parameters: { rates: [5, 12, 18, 28] },
  provenance: GENERAL_STATUTORY_PROVENANCE,
});

indiaRuleRegistry.register({
  ruleId: "EPF-INDIA-2026-STATUTORY",
  domain: "EPF",
  jurisdiction: "IN",
  version: "2026-01",
  status: "UNVERIFIED",
  parameters: { employeeRate: 12, employerRate: 12, wageCeiling: 15000 },
  provenance: GENERAL_STATUTORY_PROVENANCE,
});

indiaRuleRegistry.register({
  ruleId: "NPS-INDIA-2026-STATUTORY",
  domain: "NPS",
  jurisdiction: "IN",
  version: "2026-01",
  status: "UNVERIFIED",
  parameters: { tier1DeductionLimit: 150000, additionalNpsLimit: 50000 },
  provenance: GENERAL_STATUTORY_PROVENANCE,
});

export function getIndiaRule<T = unknown>(ruleId: string): IndiaRuleEnvelope<T> {
  const rule = [...indiaRuleRegistry.list()].find((candidate) => candidate.ruleId === ruleId);
  if (!rule) throw new Error(`Unknown India rule: ${ruleId}`);
  return rule as IndiaRuleEnvelope<T>;
}

export function getActiveIndiaRule<T = unknown>(ruleId: string): IndiaRuleEnvelope<T> {
  const rule = getIndiaRule<T>(ruleId);
  return assertProductionRule(rule);
}

export function listIndiaRules(domain?: IndiaDomain): readonly IndiaRuleEnvelope<unknown>[] {
  return indiaRuleRegistry.list(domain);
}
