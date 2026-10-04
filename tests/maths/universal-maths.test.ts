import {
  pmt,
  pv,
  fv,
  nper,
  rate,
  npv,
  irr,
  xirr,
  generateAmortizationSchedule,
  compoundInterest,
  progressiveTax,
  mean,
  median,
  variance,
  standardDeviation,
  evaluateExpression,
  runRegressionSuite,
} from "../../src/engines/financial-maths/index.ts";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

export function runUniversalMathsTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const runTest = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  runTest("Universal Maths - Built-in Regression Suite", () => {
    const regression = runRegressionSuite();
    assert(regression.failed === 0, `Regression failed: ${regression.failures.join(", ")}`);
    assert(regression.passed > 0, "No tests were executed in regression suite");
  });

  runTest("Universal Maths - PMT, PV, FV consistency", () => {
    const r = 0.08 / 12;
    const n = 240;
    const principal = 1000000;
    const payment = pmt(r, n, principal);
    assert(payment < 0, "PMT outflow should be negative");
    const recoveredPV = pv(r, n, payment);
    assert(Math.abs(recoveredPV - principal) < 1e-4, "Recovered PV should equal initial principal");
  });

  runTest("Universal Maths - Amortization Principal Conservation", () => {
    const schedule = generateAmortizationSchedule({
      principal: 500000,
      annualRate: 7.5,
      term: 10,
      termUnit: "YEARS",
      frequency: "MONTHLY",
    });
    assert(schedule.rows.length === 120, "Should have 120 monthly rows");
    assert(Math.abs(schedule.totalPrincipal - 500000) < 1e-4, "Total principal repaid must match loan amount");
    assert(schedule.rows[schedule.rows.length - 1].endingBalance <= 1e-6, "Final ending balance must be ~0");
  });

  runTest("Universal Maths - Compound Interest Exponential Curve", () => {
    const fv1 = compoundInterest(100000, 10, 10, 1);
    const fv12 = compoundInterest(100000, 10, 10, 12);
    assert(fv12 > fv1, "Monthly compounding should yield more than annual compounding");
    assert(fv1 > 200000, "10% over 10 years should more than double the principal");
  });

  runTest("Universal Maths - Expression Parser AST Precedence", () => {
    assert(evaluateExpression("2 + 3 * 4") === 14, "Multiplication before addition");
    assert(evaluateExpression("-2^2") === -4, "Unary minus after power: -(2^2) = -4");
    assert(evaluateExpression("(2 + 3) * 4") === 20, "Parentheses override");
  });

  runTest("Universal Maths - Progressive Tax Slabs", () => {
    const brackets = [
      { upTo: 10000, rate: 0 },
      { upTo: 50000, rate: 10 },
      { upTo: 100000, rate: 20 },
      { upTo: Infinity, rate: 30 },
    ];
    const taxAt60k = progressiveTax(60000, brackets);
    // 0 on first 10k, 10% on 40k = 4000, 20% on 10k = 2000 => Total 6000
    assert(taxAt60k === 6000, `Expected 6000 tax, got ${taxAt60k}`);
  });

  return results;
}
