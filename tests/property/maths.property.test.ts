import fc from "fast-check";
import {
  pmt,
  pv,
  compoundInterest,
  generateAmortizationSchedule,
} from "../../src/engines/financial-maths/index.ts";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

export function runPropertyBasedTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const runTest = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  runTest("Property-based - EMI non-negative and finite across 250 random parameter sets", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.35, noNaN: true }),
        fc.integer({ min: 1, max: 360 }),
        fc.double({ min: 100, max: 1e8, noNaN: true }),
        (annualRate: number, months: number, principal: number) => {
          const emi = Math.abs(pmt(annualRate / 12, months, principal));
          assert(Number.isFinite(emi), "EMI must be finite");
          assert(emi > 0, "EMI must be > 0 for positive principal");
        }
      ),
      { numRuns: 250 }
    );
  });

  runTest("Property-based - Principal Conservation invariant in loan amortization", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 25.0, noNaN: true }),
        fc.integer({ min: 1, max: 30 }),
        fc.double({ min: 10000, max: 50000000, noNaN: true }),
        (annualRate: number, termYears: number, principal: number) => {
          const schedule = generateAmortizationSchedule({
            principal,
            annualRate,
            term: termYears,
            termUnit: "YEARS",
            frequency: "MONTHLY",
          });
          const principalDiff = Math.abs(schedule.totalPrincipal - principal);
          assert(principalDiff < 0.01 * principal, `Principal conservation failed: diff=${principalDiff}`);
        }
      ),
      { numRuns: 100 }
    );
  });

  runTest("Property-based - PV/FV inverse relationship invariant", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 0.20, noNaN: true }),
        fc.integer({ min: 12, max: 240 }),
        fc.double({ min: 1000, max: 10000000, noNaN: true }),
        (ratePerYear: number, periods: number, initialPV: number) => {
          const r = ratePerYear / 12;
          const periodicPayment = pmt(r, periods, initialPV);
          const recoveredPV = pv(r, periods, periodicPayment);
          const diff = Math.abs(recoveredPV - initialPV);
          assert(diff / initialPV < 1e-4, `PV/FV round-trip diff too large: ${diff}`);
        }
      ),
      { numRuns: 100 }
    );
  });

  runTest("Property-based - Compound Interest monotonic growth with rate and time", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 1000000, noNaN: true }),
        fc.double({ min: 1, max: 15, noNaN: true }),
        fc.integer({ min: 1, max: 20 }),
        (principal: number, rate: number, years: number) => {
          const base = compoundInterest(principal, rate, years, 12);
          const higherRate = compoundInterest(principal, rate + 1, years, 12);
          const longerYears = compoundInterest(principal, rate, years + 1, 12);
          assert(higherRate > base, "Higher interest rate must yield higher future value");
          assert(longerYears > base, "Longer compounding period must yield higher future value");
        }
      ),
      { numRuns: 100 }
    );
  });

  return results;
}
