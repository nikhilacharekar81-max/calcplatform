import { runUniversalMathsTests } from "./maths/universal-maths.test.ts";
import { runUSARegressionTests } from "./rules/usa/usa-regression.test.ts";
import { runIndiaIncomeTaxTests } from "./rules/india/india-income-tax.test.ts";
import { runIndiaCalculatorsTests } from "./calculators/india/india-calculators.test.ts";
import { runArchitectureTests } from "./architecture/dag-worker.test.ts";
import { runPropertyBasedTests } from "./property/maths.property.test.ts";
import { runIndiaRegistryExpansionTests } from "./rules/india/india-registry-expansion.test.ts";

async function main() {
  console.log("===============================================================");
  console.log(" GLOBAL FINANCIAL PLATFORM — VERIFICATION & TEST RUNNER");
  console.log("===============================================================\n");

  const suites = [
    { name: "1. Universal Maths Engine", run: runUniversalMathsTests },
    { name: "2. USA Rules & Regression Suite", run: runUSARegressionTests },
    { name: "3. India Income Tax (AY 2026-27)", run: runIndiaIncomeTaxTests },
    { name: "4. India Calculators & Localization", run: runIndiaCalculatorsTests },
    { name: "5. Calculation DAG & Worker Architecture", run: runArchitectureTests },
    { name: "6. Property-Based Invariants (fast-check)", run: runPropertyBasedTests },
    { name: "7. India Registry Expansion (Phase 5)", run: runIndiaRegistryExpansionTests },
  ];

  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of suites) {
    console.log(`\n--- Running Suite: ${suite.name} ---`);
    const startTime = Date.now();
    const results = suite.run();
    const elapsed = Date.now() - startTime;

    for (const res of results) {
      if (res.passed) {
        console.log(`  [PASS] ${res.name}`);
        totalPassed++;
      } else {
        console.error(`  [FAIL] ${res.name}: ${res.error}`);
        totalFailed++;
      }
    }
    console.log(`  Summary: ${results.filter(r => r.passed).length}/${results.length} passed in ${elapsed}ms`);
  }

  console.log("\n===============================================================");
  console.log(` FINAL TEST RESULT: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log("===============================================================");

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
