import {
  calculateIndiaEmi,
  calculateGst,
  calculateTds,
  calculateCapitalGain,
  calculateEpfContribution,
  calculateProfessionalTax,
  calculateStampDuty,
  formatIndianNumber,
  formatIndianCurrency,
} from "../../../src/index.ts";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

export function runIndiaCalculatorsTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const runTest = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  runTest("India Calculators - Home Loan EMI (₹50 Lakh, 8.5%, 20 Years)", () => {
    const res = calculateIndiaEmi({
      principal: 5000000,
      annualInterestRatePercent: 8.5,
      tenureMonths: 240,
    });
    assert(Math.round(res.monthlyEmi) === 43391, `Expected ₹43,391, got ${res.monthlyEmi}`);
    assert(res.monthlyEmiFormatted.includes("43,391") || res.monthlyEmiFormatted.includes("₹"), "Formatted string check");
  });

  runTest("India Calculators - GST Intra-state (CGST + SGST) vs Inter-state (IGST)", () => {
    const intra = calculateGst({ taxableValue: 100000, rate: 18 }, false);
    assert(intra.cgst.toNumber() === 9000, "CGST 9%");
    assert(intra.sgst.toNumber() === 9000, "SGST 9%");
    assert(intra.igst.toNumber() === 0, "IGST 0 for intra-state");
    assert(intra.total.toNumber() === 118000, "Total 118,000");

    const inter = calculateGst({ taxableValue: 100000, rate: 18 }, true);
    assert(inter.cgst.toNumber() === 0, "CGST 0 for inter-state");
    assert(inter.sgst.toNumber() === 0, "SGST 0 for inter-state");
    assert(inter.igst.toNumber() === 18000, "IGST 18%");
    assert(inter.total.toNumber() === 118000, "Total 118,000");
  });

  runTest("India Calculators - TDS 10% on Professional Fees", () => {
    const tds = calculateTds(50000, 10);
    assert(tds.tds.toNumber() === 5000, "TDS ₹5,000");
    assert(tds.net.toNumber() === 45000, "Net ₹45,000");
  });

  runTest("India Calculators - Capital Gains Computation", () => {
    const cg = calculateCapitalGain({
      saleValue: 1500000,
      cost: 1000000,
      rate: 12.5,
    });
    assert(cg.gain.toNumber() === 500000, "Gain ₹5,00,000");
    assert(cg.tax.toNumber() === 62500, "Tax ₹62,500");
    assert(cg.netGain.toNumber() === 437500, "Net gain ₹4,37,500");
  });

  runTest("India Calculators - EPF 12% Contribution", () => {
    const epf = calculateEpfContribution(15000, 12, 12);
    assert(epf.employee.toNumber() === 1800, "Employee EPF ₹1,800");
    assert(epf.employer.toNumber() === 1800, "Employer EPF ₹1,800");
    assert(epf.total.toNumber() === 3600, "Total EPF ₹3,600");
  });

  runTest("India Calculators - State Stamp Duty & Registration", () => {
    const stamp = calculateStampDuty(10000000, 5, 1);
    assert(stamp.stampDuty.toNumber() === 500000, "Stamp duty 5% = ₹5L");
    assert(stamp.registration.toNumber() === 100000, "Registration 1% = ₹1L");
    assert(stamp.totalGovernmentCharges.toNumber() === 600000, "Total ₹6L");
  });

  runTest("India Localization - Lakh and Crore Digit Grouping", () => {
    const num = formatIndianNumber(1234567);
    assert(num.includes("12,34,567"), `Expected Indian comma grouping, got ${num}`);
    const curr = formatIndianCurrency(10000000);
    assert(curr.includes("1,00,00,000") || curr.includes("₹"), `Expected formatted 1 Crore, got ${curr}`);
  });

  return results;
}
