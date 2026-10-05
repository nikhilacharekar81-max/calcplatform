import { calculateIndiaIncomeTax } from "../../../src/calculators/india/incomeTax.ts";
import { indiaRuleRegistry } from "../../../src/rules/india/registry.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string): void {
  assert(actual === expected, `${message}: expected ${String(expected)}, got ${String(actual)}`);
}

function approx(actual: number, expected: number, tolerance = 0.01): void {
  assert(Math.abs(actual - expected) <= tolerance, `Expected ${actual} ≈ ${expected}`);
}

export function runIndiaIncomeTaxTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const runTest = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  runTest("India Tax - New Regime ₹12 Lakh Zero Tax via Section 87A Rebate", () => {
    const result = calculateIndiaIncomeTax({
      grossIncome: 1200000,
      salaryIncome: 1200000,
      regime: "NEW",
      age: 30,
      resident: true,
    });
    equal(result.standardDeduction, 75000, "New-regime standard deduction");
    equal(result.taxableIncome, 1125000, "New-regime taxable income");
    equal(result.rebate87A, 52500, "New-regime 87A rebate");
    equal(result.totalTax, 0, "New-regime tax at ₹12 lakh gross salary");
  });

  runTest("India Tax - New Regime ₹20 Lakh Salary Calculation", () => {
    const result = calculateIndiaIncomeTax({
      grossIncome: 2000000,
      salaryIncome: 2000000,
      regime: "NEW",
      age: 30,
      resident: true,
    });
    approx(result.taxAfterRebate, 185000);
    approx(result.healthAndEducationCess, 7400);
    approx(result.totalTax, 192400);
  });

  runTest("India Tax - Old Regime Below 60 ₹10 Lakh Salary", () => {
    const result = calculateIndiaIncomeTax({
      grossIncome: 1000000,
      salaryIncome: 1000000,
      regime: "OLD",
      age: 30,
      resident: true,
    });
    equal(result.standardDeduction, 50000, "Old-regime standard deduction");
    equal(result.taxableIncome, 950000, "Old-regime taxable income");
    approx(result.taxAfterRebate, 102500);
    approx(result.healthAndEducationCess, 4100);
    approx(result.totalTax, 106600);
  });

  runTest("India Tax - Old Regime Senior and Super-Senior Age Bands", () => {
    const senior = calculateIndiaIncomeTax({
      grossIncome: 1000000,
      salaryIncome: 1000000,
      regime: "OLD",
      age: 65,
      resident: true,
    });
    const superSenior = calculateIndiaIncomeTax({
      grossIncome: 1000000,
      salaryIncome: 1000000,
      regime: "OLD",
      age: 82,
      resident: true,
    });
    equal(senior.taxableIncome, 950000, "Senior taxable income");
    assert(superSenior.totalTax < senior.totalTax, "Super-senior tax should be lower due to higher initial exemption slab");
  });

  runTest("India Tax - Non-Resident 87A Exemption Ineligibility", () => {
    const result = calculateIndiaIncomeTax({
      grossIncome: 1000000,
      salaryIncome: 1000000,
      regime: "NEW",
      age: 30,
      resident: false,
    });
    equal(result.rebate87A, 0, "Non-resident 87A rebate must be 0");
    assert(result.totalTax > 0, "Non-resident must pay tax above exemption limit");
  });

  runTest("India Tax - Surcharge Marginal Relief Threshold", () => {
    const result = calculateIndiaIncomeTax({
      grossIncome: 5076000,
      salaryIncome: 5076000,
      regime: "NEW",
      age: 30,
      resident: true,
    });
    assert(result.marginalRelief > 0, "Marginal relief should reduce surcharge just above ₹50 lakh");
  });

  runTest("India Tax - Rule Registry ACTIVE_VERIFIED Status and Provenance Guard", () => {
    const rule = indiaRuleRegistry.resolveActiveVerified({
      domain: "INCOME_TAX",
      ruleId: "IT-INDIA-AY-2026-27-INDIVIDUAL",
      version: "2026-27",
    });
    equal(rule.status, "ACTIVE_VERIFIED", "Rule status must be ACTIVE_VERIFIED");
    equal(rule.assessmentYear, "AY-2026-27", "Assessment year");
    assert(rule.provenance.authority.includes("Income Tax Department"), "Authoritative government provenance");
  });

  runTest("India Tax - Negative Test: UNVERIFIED Rule Rejected from Production Resolution", () => {
    // Register temporary unverified rule
    const unverifiedRule = {
      ruleId: "TEST-UNVERIFIED-GST-2026",
      domain: "GST",
      jurisdiction: "IN" as const,
      version: "2026-draft",
      status: "UNVERIFIED" as const,
      parameters: { rates: [5, 12, 18, 28] },
      provenance: {
        authority: "Unverified Test Draft",
        sourceUrl: "https://example.com/draft",
        effectiveFrom: "2026-04-01",
        effectiveTo: null,
        verifiedAt: null,
      },
    };
    indiaRuleRegistry.register(unverifiedRule);

    let rejected = false;
    try {
      indiaRuleRegistry.resolveActiveVerified({
        domain: "GST",
        ruleId: "TEST-UNVERIFIED-GST-2026",
        version: "2026-draft",
      });
    } catch (err: any) {
      if (err.message.includes("is not production-active: UNVERIFIED")) {
        rejected = true;
      }
    }
    assert(rejected, "Attempt to resolve an UNVERIFIED rule must be rejected with an error");
  });

  runTest("India Tax - Negative Test: Special-Rate Income Blocked from Ordinary Slab Engine", () => {
    let rejected = false;
    try {
      calculateIndiaIncomeTax({
        grossIncome: 1500000,
        salaryIncome: 1000000,
        specialRateIncome: 500000, // Capital Gains / Crypto
        regime: "NEW",
        resident: true,
      });
    } catch (err: any) {
      if (err.message.includes("Special-rate income")) {
        rejected = true;
      }
    }
    assert(rejected, "Special-rate income must be explicitly rejected to prevent incorrect slab calculation");
  });

  runTest("India Tax - Two-Stage Pipeline: Raw Full-Precision Computation vs Statutory Rounding Boundary", async () => {
    const { calculateRawUnroundedIncomeTax, applyStatutoryRoundingBoundary } = await import("../../../src/calculators/india/incomeTax.ts");
    
    // Test input with fractional amount requiring statutory rounding
    const rawDetails = calculateRawUnroundedIncomeTax({
      grossIncome: 1545678,
      salaryIncome: 1545678,
      regime: "NEW",
      age: 30,
      resident: true,
    });

    // Verify rawDetails exposes 100% unrounded values
    assert(rawDetails.rawGrossIncome === 1545678, "Raw gross income");
    assert(rawDetails.rawStandardDeduction === 75000, "Raw standard deduction");
    assert(rawDetails.rawTaxableIncome === 1470678, "Raw taxable income before Sec 288A rounding");
    assert(rawDetails.rawTotalTaxBeforeStatutoryRounding > 0, "Raw unrounded tax float value present");

    // Stage 2: Apply statutory boundary
    const finalResult = applyStatutoryRoundingBoundary(rawDetails);
    
    // Sec 288A: Taxable income 1470678 rounded to 1470680 (nearest ₹10)
    equal(finalResult.taxableIncome, 1470680, "Sec 288A rounded taxable income");
    
    // Sec 288B: Final tax rounded to nearest ₹10
    equal(finalResult.totalTax % 10, 0, "Sec 288B final total tax rounded to multiple of 10");
    equal(finalResult.rawDetails.rawTotalTaxBeforeStatutoryRounding !== finalResult.totalTax, true, "Raw float tax preserved in rawDetails while totalTax is statutory rounded");
  });

  return results;
}
