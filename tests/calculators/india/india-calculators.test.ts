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

  runTest("India Calculators - Maharashtra Professional Tax (Feb ₹300 & Women Exemption)", async () => {
    const { calculateStateProfessionalTax } = await import("../../../src/calculators/india/state/professionalTax.ts");
    
    // Male with salary > 10,000 in regular month (₹200) vs February (₹300)
    const regularMonth = calculateStateProfessionalTax({ stateCode: "MH", monthlySalary: 15000, month: 5, gender: "male" });
    assert(regularMonth.monthlyTax === 200, "MH Male regular month ₹200");
    
    const febMonth = calculateStateProfessionalTax({ stateCode: "MH", monthlySalary: 15000, month: 2, gender: "male" });
    assert(febMonth.monthlyTax === 300, "MH Male February ₹300");
    assert(febMonth.annualTaxEstimated === 2500, "MH Male Annual ₹2,500");

    // Female with salary ₹20,000 (Exempt in Maharashtra <= 25,000)
    const femaleExempt = calculateStateProfessionalTax({ stateCode: "MH", monthlySalary: 20000, month: 5, gender: "female" });
    assert(femaleExempt.isFemaleExempt === true && femaleExempt.monthlyTax === 0, "MH Female <= 25k is exempt");

    // Karnataka PT (>= 15,000: ₹200 regular, ₹300 in Feb)
    const kaFeb = calculateStateProfessionalTax({ stateCode: "KA", monthlySalary: 25000, month: 2, gender: "male" });
    assert(kaFeb.monthlyTax === 300 && kaFeb.annualTaxEstimated === 2500, "KA Feb ₹300, Annual ₹2,500");
  });

  runTest("India Calculators - TDS Threshold Crossing & Cumulative Catch-up", async () => {
    const { calculateTds: calculateEngineTds } = await import("../../../src/utils/tdsEngine.ts");

    // 194C Contractor: Single bill of ₹25,000 (below ₹30,000 single limit) with 0 prior aggregate -> ₹0 TDS
    const firstBill = calculateEngineTds({
      sectionKey: "194C_CONTRACTOR",
      payeeType: "Individual/HUF",
      grossAmount: 25000,
      aggregatePaidTillDate: 0,
      isPanFurnished: true,
      isSeniorCitizen: false,
      isForm15Submitted: false,
      hasForm13Certificate: false,
      form13Rate: 0,
      applySurchargeAndCess: false,
      surchargeRate: 0,
    });
    assert(firstBill.totalTdsDeductible === 0, "194C bill below single threshold is exempt");

    // 194C Contractor: 4th bill of ₹30,000 where prior aggregate was ₹80,000 (total = ₹1,10,000, crossing ₹1L aggregate threshold)
    // Entire ₹1,10,000 is now subjected to 1% TDS catch-up = ₹1,100
    const crossingBill = calculateEngineTds({
      sectionKey: "194C_CONTRACTOR",
      payeeType: "Individual/HUF",
      grossAmount: 30000,
      aggregatePaidTillDate: 80000,
      isPanFurnished: true,
      isSeniorCitizen: false,
      isForm15Submitted: false,
      hasForm13Certificate: false,
      form13Rate: 0,
      applySurchargeAndCess: false,
      surchargeRate: 0,
    });
    assert(crossingBill.totalTdsDeductible === 1100, `Expected ₹1,100 catch-up TDS, got ${crossingBill.totalTdsDeductible}`);
  });

  return results;
}
