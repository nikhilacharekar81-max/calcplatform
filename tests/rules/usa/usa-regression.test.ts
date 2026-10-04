import {
  runUSRegressionSuite,
  calculateUSFederalIncomeTax,
  calculateUSPayrollTaxes,
  calculateUSTakeHomePay,
  calculateUSMortgageEnhanced,
  calculateUS401KProjection,
  calculateUSRegZActuarialAPR,
} from "../../../src/rules/usa/usa-engine.ts";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

export function runUSARegressionTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const runTest = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  runTest("USA Rules - Extracted Engine 32-Point Regression Suite", () => {
    const reg = runUSRegressionSuite();
    assert(reg.failed === 0, `USA regression failed: ${reg.failures.join(", ")}`);
    assert(reg.passed >= 32, "All 32 core checks must pass");
  });

  runTest("USA Rules - Federal Income Tax Single $120,000", () => {
    const tax = calculateUSFederalIncomeTax({
      filingStatus: "SINGLE",
      grossIncome: 120000,
    });
    assert(tax.deduction === 16100, "2026 Single Standard Deduction should be $16,100");
    assert(tax.taxableIncome === 103900, "Taxable income should be $103,900");
    assert(tax.federalIncomeTax > 15000 && tax.federalIncomeTax < 20000, "Federal tax range check");
  });

  runTest("USA Rules - FICA Social Security Cap $184,500", () => {
    const ficaHigh = calculateUSPayrollTaxes({
      wages: 250000,
    });
    assert(ficaHigh.socialSecurity === 184500 * 0.062, "Social Security capped at $184,500 wage base");
    assert(ficaHigh.medicare === 250000 * 0.0145, "Medicare uncapped");
  });

  runTest("USA Rules - Enhanced Mortgage & PMI Automatic Termination", () => {
    const mort = calculateUSMortgageEnhanced({
      homePrice: 500000,
      downPayment: 50000, // 90% LTV
      annualRate: 6.5,
      termYears: 30,
      pmiAnnual: 3600,
    });
    assert(mort.monthlyPrincipalAndInterest > 0, "Monthly P&I must be positive");
    assert(mort.pmiAutomaticTerminationPeriod !== undefined, "PMI termination period must be computed");
    assert(mort.pmiAutomaticTerminationPeriod! < 360, "PMI should terminate before 30-year maturity");
  });

  runTest("USA Rules - 401(k) Projection with 2026 Limits ($24,500 deferral)", () => {
    const res = calculateUS401KProjection({
      currentAge: 35,
      retirementAge: 65,
      currentBalance: 50000,
      annualSalary: 120000,
      employeeContributionRate: 15,
      employerMatchRate: 50,
      employerMatchLimitPercent: 6,
      annualReturn: 7,
    });
    assert(res.endingBalance > 1000000, "401k compounding over 30 years should exceed $1M");
    assert(res.totalEmployeeContributions > 0, "Employee contributions tracked");
    assert(res.totalEmployerContributions > 0, "Employer match tracked");
  });

  runTest("USA Rules - Regulation Z Actuarial APR", () => {
    const apr = calculateUSRegZActuarialAPR({
      amountFinanced: 9500, // $10k credit - $500 prepaid fee
      consummationDate: "2026-01-01",
      payments: Array.from({ length: 12 }, (_, i) => {
        const d = new Date(Date.UTC(2026, i + 1, 1));
        return { date: d.toISOString().split("T")[0], amount: 860 };
      }),
      unitPeriod: "MONTH",
    });
    assert(apr.converged, "Actuarial APR must converge");
    assert(apr.annualPercentageRate > 0, "APR must be positive");
  });

  return results;
}
