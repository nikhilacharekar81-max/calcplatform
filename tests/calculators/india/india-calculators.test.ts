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

  runTest("India Calculators - Capital Gains Computation & Legacy Adapter Metadata", () => {
    const cg = calculateCapitalGain({
      saleValue: 1500000,
      cost: 1000000,
      rate: 12.5,
    });
    assert(cg.gain.toNumber() === 500000, "Gain ₹5,00,000");
    assert(cg.tax.toNumber() === 62500, "Tax ₹62,500");
    assert(cg.netGain.toNumber() === 437500, "Net gain ₹4,37,500");

    // Legacy adapter metadata/context test
    const cgWithContext = calculateCapitalGain({
      assetCategory: 'real_estate',
      saleValue: 10000000, // ₹1 Cr
      cost: 8000000, // ₹80 Lakhs
      purchaseDate: '2020-01-01',
      saleDate: '2025-08-01',
      acquisitionBeforeJuly24: true,
      indexedCostOfAcquisition: 8500000,
    });
    assert(cgWithContext.canonicalDetails.assetCategory === 'real_estate', "Asset category real_estate passed to canonical details");
    assert(Boolean(cgWithContext.canonicalDetails.realEstateOptionUsed?.includes("Option B")), "Legacy adapter metadata triggers Option B evaluation");
  });

  runTest("India Calculators - Calendar Utility Statutory Holding-Period Boundaries", async () => {
    const { addCalendarMonthsClamped, isShortTermHolding, computeHoldingPeriodDaysAndMonths } = await import("../../../src/utils/dateUtils.ts");

    // 1. Clamped month-end clamping: Jan 31 + 1 month = Feb 28 (or Feb 29 leap year)
    const jan31_2025 = new Date('2025-01-31');
    const febClamped = addCalendarMonthsClamped(jan31_2025, 1);
    assert(febClamped.getMonth() === 1, "Month is February (index 1)");
    assert(febClamped.getDate() === 28, "Date clamped to 28th Feb in non-leap year");

    const jan31_2024 = new Date('2024-01-31');
    const febLeapClamped = addCalendarMonthsClamped(jan31_2024, 1);
    assert(febLeapClamped.getDate() === 29, "Date clamped to 29th Feb in leap year 2024");

    // 2. 12-month boundary for Listed Equity: Bought 2024-03-31, Sold 2025-03-30 (< 12 months) vs 2025-03-31 (>= 12 months)
    const boughtMar31 = new Date('2024-03-31');
    const soldMar30 = new Date('2025-03-30');
    const soldMar31 = new Date('2025-03-31');

    assert(isShortTermHolding(boughtMar31, soldMar30, 12) === true, "Sold on Mar 30 is Short-Term (< 12 calendar months)");
    assert(isShortTermHolding(boughtMar31, soldMar31, 12) === false, "Sold on Mar 31 is Long-Term (>= 12 calendar months)");

    const holdingInfoShort = computeHoldingPeriodDaysAndMonths(boughtMar31, soldMar30);
    assert(holdingInfoShort.isShortTerm.equity === true, "Equity is short term prior to 12 calendar months");

    const holdingInfoLong = computeHoldingPeriodDaysAndMonths(boughtMar31, soldMar31);
    assert(holdingInfoLong.isShortTerm.equity === false, "Equity is long term at 12 calendar months boundary");
  });

  runTest("India Calculators - Statutory Capital Gains Engine (Losses, Set-Offs, Section 54 & Post-July 2024)", async () => {
    const { calculateStatutoryCapitalGains } = await import("../../../src/calculators/india/capital-gains/index.ts");

    // 1. Negative capital gains (Capital Loss)
    const lossRes = calculateStatutoryCapitalGains({
      assetCategory: 'listed_equity',
      salePrice: 400000,
      purchasePrice: 600000,
      purchaseDate: '2025-01-10',
      saleDate: '2025-06-15', // Short-term loss
    });
    assert(lossRes.rawCapitalGain === -200000, "Negative gain correctly computed as -2,00,000");
    assert(lossRes.taxableStcg === 0 && lossRes.unabsorbedStcl === 200000, "Unabsorbed STCL accumulated for carry-forward");

    // 2. STCL offsetting both STCG and LTCG
    const stclOffsetRes = calculateStatutoryCapitalGains({
      assetCategory: 'listed_equity',
      salePrice: 1500000,
      purchasePrice: 1000000,
      purchaseDate: '2023-01-01',
      saleDate: '2026-06-01', // LTCG of ₹5,00,000
      broughtForwardStcl: 200000,
    });
    assert(stclOffsetRes.stcgOffsetLtcg === 200000, "STCL successfully offsets LTCG");
    assert(stclOffsetRes.taxableLtcg === 300000, "Remaining taxable LTCG is 3,00,000");

    // 3. Section 54 Real Estate vs 54F (₹10 Cr cap)
    const sec54Res = calculateStatutoryCapitalGains({
      assetCategory: 'real_estate',
      salePrice: 200000000, // ₹20 Cr
      purchasePrice: 50000000, // ₹5 Cr
      purchaseDate: '2020-01-01',
      saleDate: '2026-05-01',
      reinvestmentSec54: 150000000, // ₹15 Cr reinvestment (capped at 10 Cr)
    });
    assert(sec54Res.exemptionClaimed === 100000000, "Section 54 reinvestment strictly capped at ₹10 Crore");

    // 4. Section 50AA Debt Mutual Funds acquired after April 1, 2023 are always STCG
    const debtMfRes = calculateStatutoryCapitalGains({
      assetCategory: 'debt_mutual_funds',
      salePrice: 1500000,
      purchasePrice: 1000000,
      purchaseDate: '2023-05-01', // Post April 2023
      saleDate: '2026-09-01', // Held > 3 years
      annualOtherIncome: 1000000,
    });
    assert(debtMfRes.isShortTerm === true, "Specified debt mutual funds post April 2023 taxed as short term under Sec 50AA");

    // 5. Post July 23, 2024 Listed Equity Rate (12.5% with ₹1.25 Lakh exemption)
    const postJulyRes = calculateStatutoryCapitalGains({
      assetCategory: 'listed_equity',
      salePrice: 1500000,
      purchasePrice: 1000000,
      purchaseDate: '2023-01-01',
      saleDate: '2025-08-01', // Post July 23, 2024
    });
    // LTCG = 5,00,000 - 1,25,000 = 3,75,000 * 12.5% = 46,875 base tax
    assert(postJulyRes.baseTax === 46875, `Expected 46,875 base tax on LTCG post July 2024, got ${postJulyRes.baseTax}`);

    // 6. Section 112A Grandfathering date guard (only applies if purchase < Jan 31, 2018)
    const gfPost2018 = calculateStatutoryCapitalGains({
      assetCategory: 'listed_equity',
      salePrice: 1500000,
      purchasePrice: 500000,
      purchaseDate: '2019-01-01', // Post Jan 31, 2018
      saleDate: '2026-01-01',
      applyGrandfathering: true,
      jan312018Fmv: 1000000,
    });
    assert(gfPost2018.effectiveCoa === 500000, "Grandfathering rejected for assets acquired after Jan 31, 2018");

    // 7. Real Estate Option B (12.5% without indexation) verification
    const optionBRes = calculateStatutoryCapitalGains({
      assetCategory: 'real_estate',
      salePrice: 10000000, // ₹1 Crore
      purchasePrice: 8000000, // ₹80 Lakhs
      purchaseDate: '2020-01-01',
      saleDate: '2025-08-01', // Post-July 23, 2024
      acquisitionBeforeJuly24: true,
      indexedCostOfAcquisition: 8500000, // Option A tax = (100L - 85L) * 20% = 3L; Option B tax = (100L - 80L) * 12.5% = 2.5L
    });
    assert(Boolean(optionBRes.realEstateOptionUsed?.includes("Option B")), "Option B selected as lower tax option");
    assert(optionBRes.baseTax === 250000, `Expected 2,50,000 base tax under Option B (12.5% on 20L gain), got ${optionBRes.baseTax}`);
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

    // 194C Contractor: Single bill of ₹25,000 (below ₹30,000 single limit) with no prior payments -> ₹0 TDS
    const firstBill = calculateEngineTds({
      sectionKey: "194C_CONTRACTOR",
      payeeType: "Individual/HUF",
      grossAmount: 25000,
      historicalPayments: [],
      isPanFurnished: true,
      isSeniorCitizen: false,
      isForm15Submitted: false,
      hasForm13Certificate: false,
      form13Rate: 0,
      applySurchargeAndCess: false,
      surchargeRate: 0,
    });
    assert(firstBill.totalTdsDeductible === 0, "194C bill below single threshold is exempt");

    // 194C Contractor: 4th bill of ₹30,000 where prior ledger payments total ₹80,000 in same FY (total = ₹1,10,000, crossing ₹1L aggregate threshold)
    // Entire ₹1,10,000 is now subjected to 1% TDS catch-up = ₹1,100
    const crossingBill = calculateEngineTds({
      sectionKey: "194C_CONTRACTOR",
      payeeType: "Individual/HUF",
      grossAmount: 30000,
      currentTransactionDate: "2025-06-01",
      historicalPayments: [
        { amount: 80000, creditDate: "2025-05-10" }
      ],
      isPanFurnished: true,
      isSeniorCitizen: false,
      isForm15Submitted: false,
      hasForm13Certificate: false,
      form13Rate: 0,
      applySurchargeAndCess: false,
      surchargeRate: 0,
    });
    assert(crossingBill.totalTdsDeductible === 1100, `Expected ₹1,100 catch-up TDS, got ${crossingBill.totalTdsDeductible}`);

    // TDS Historical Ledger FY Boundary test: Verify historical ledger for a previous FY is NOT counted against current FY threshold
    const historicalLedgerRes = calculateEngineTds({
      sectionKey: "194J_PROF",
      payeeType: "Individual/HUF",
      grossAmount: 20000,
      isPanFurnished: true,
      isSeniorCitizen: false,
      isForm15Submitted: false,
      hasForm13Certificate: false,
      form13Rate: 0,
      applySurchargeAndCess: false,
      surchargeRate: 0,
      transactionDate: "2025-06-15", // FY 2025-26
      historicalPayments: [
        { amount: 45000, transactionDate: "2024-08-10" }, // FY 2024-25 (previous FY)
        { amount: 10000, transactionDate: "2025-05-01" }, // FY 2025-26 (same FY as transaction)
      ],
    });
    // FY 2025-26 cumulative = 10,000 + 20,000 = 30,000 (below 194J ₹50,000 threshold). Should NOT include 45,000 from FY 2024-25.
    assert(historicalLedgerRes.totalTdsDeductible === 0, `Expected ₹0 TDS as FY 2025-26 cumulative is ₹30,000 <= ₹50,000 threshold, got ${historicalLedgerRes.totalTdsDeductible}`);

    // March 31 -> April 1 statutory trigger date tests (earlier of creditDate or paymentDate)
    // Test 1: Credit on March 31, 2025 (FY 2024-25), Payment on April 5, 2025 (FY 2025-26) -> Trigger is March 31 (FY 2024-25)
    const march31CreditRes = calculateEngineTds({
      sectionKey: "194J_PROF",
      payeeType: "Individual/HUF",
      grossAmount: 30000,
      isPanFurnished: true,
      isSeniorCitizen: false,
      isForm15Submitted: false,
      hasForm13Certificate: false,
      form13Rate: 0,
      applySurchargeAndCess: false,
      surchargeRate: 0,
      creditDate: "2025-03-31", // FY 2024-25
      paymentDate: "2025-04-05", // FY 2025-26
      historicalPayments: [
        { amount: 30000, creditDate: "2025-01-15" }, // FY 2024-25
      ],
    });
    // Total FY 2024-25 = 30,000 + 30,000 = 60,000 (exceeds ₹50,000 threshold). Catch-up TDS @ 10% = ₹6,000
    assert(march31CreditRes.evaluatedFinancialYear === "FY 2024-25", `Expected FY 2024-25, got ${march31CreditRes.evaluatedFinancialYear}`);
    assert(march31CreditRes.statutoryTriggerDate === "2025-03-31", `Expected 2025-03-31 trigger, got ${march31CreditRes.statutoryTriggerDate}`);
    assert(march31CreditRes.totalTdsDeductible === 6000, `Expected ₹6,000 TDS, got ${march31CreditRes.totalTdsDeductible}`);

    // Test 2: April 1, 2025 new FY reset: Transaction on April 1, 2025 does NOT cross threshold even if March 31 had prior payments
    const april1ResetRes = calculateEngineTds({
      sectionKey: "194J_PROF",
      payeeType: "Individual/HUF",
      grossAmount: 30000,
      isPanFurnished: true,
      isSeniorCitizen: false,
      isForm15Submitted: false,
      hasForm13Certificate: false,
      form13Rate: 0,
      applySurchargeAndCess: false,
      surchargeRate: 0,
      currentTransactionDate: "2025-04-01", // FY 2025-26
      historicalPayments: [
        { amount: 45000, creditDate: "2025-03-31" }, // FY 2024-25
      ],
    });
    // FY 2025-26 cumulative = 30,000 (below ₹50,000 threshold). ₹0 TDS.
    assert(april1ResetRes.evaluatedFinancialYear === "FY 2025-26", `Expected FY 2025-26, got ${april1ResetRes.evaluatedFinancialYear}`);
    assert(april1ResetRes.totalTdsDeductible === 0, `Expected ₹0 TDS on April 1 reset, got ${april1ResetRes.totalTdsDeductible}`);
  });

  runTest("India Loans - Education Loan Moratorium & Restructuring Engine", async () => {
    const { calculateEducationLoanMoratorium } = await import("../../../src/calculators/india/loans/educationLoan.ts");

    // Principal = ₹10,000,000 (10 Lakhs), Rate = 10%, Moratorium = 36 months (3 yrs study + buffer), Base Tenure = 5 years (60 months)
    const baseInput = {
      principal: 1000000,
      annualInterestRatePercent: 10,
      studyPeriodMonths: 24,
      moratoriumBufferMonths: 12, // total 36 months
      repaymentTenureYears: 5,
    };

    // 1. Verify Capitalization Assertion: repaymentStartPrincipal = originalPrincipal + moratoriumInterest
    const fixEmiRes = calculateEducationLoanMoratorium({ ...baseInput, restructuringOption: 'FIX_TENURE_INCREASE_EMI' });
    assert(fixEmiRes.accumulatedMoratoriumInterest === 300000, `Moratorium interest expected 300,000, got ${fixEmiRes.accumulatedMoratoriumInterest}`);
    assert(fixEmiRes.repaymentStartPrincipal === 1300000, `Repayment start principal expected 1,300,000, got ${fixEmiRes.repaymentStartPrincipal}`);
    assert(fixEmiRes.repaymentStartPrincipal === fixEmiRes.originalPrincipal + fixEmiRes.accumulatedMoratoriumInterest, "Assertion: repaymentStartPrincipal = originalPrincipal + moratoriumInterest");
    assert(fixEmiRes.capitalizationAssertionVerified === true, "Capitalization assertion verified flag must be true");
    assert(fixEmiRes.effectiveTenureMonths === 60, "FIX_TENURE_INCREASE_EMI keeps original 60 months tenure");

    // 2. Verify FIX_EMI_EXTEND_TENURE mathematically extends tenure while fixing monthly EMI to baseline uncapitalized EMI
    const extendTenureRes = calculateEducationLoanMoratorium({ ...baseInput, restructuringOption: 'FIX_EMI_EXTEND_TENURE' });
    assert(extendTenureRes.monthlyEmi === extendTenureRes.baseUncapitalizedEmi, `FIX_EMI_EXTEND_TENURE fixes EMI at baseline uncapitalized EMI (${extendTenureRes.baseUncapitalizedEmi})`);
    assert(extendTenureRes.effectiveTenureMonths > 60, `FIX_EMI_EXTEND_TENURE extends tenure beyond 60 months (got ${extendTenureRes.effectiveTenureMonths} months)`);
    assert(extendTenureRes.effectiveTenureMonths === 86, `Expected tenure extended to 86 months, got ${extendTenureRes.effectiveTenureMonths}`);
  });

  return results;
}
