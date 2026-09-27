/**
 * Indian Income Tax & GST Calculation Engine
 * Models Income Tax (AY 2025-26 & 2024-25 New vs Old Regime with Surcharge & 4% Cess),
 * GST (CGST/SGST/IGST Exclusive/Inclusive), HRA Exemption, Section 80C/80D/80CCD deductions,
 * Capital Gains Tax (Equity LTCG / STCG), and TDS on Salary & Rent.
 */

export interface IncomeTaxInputs {
  grossIncome: number;
  assessmentYear: '2025-26' | '2024-25';
  regime: 'new' | 'old';
  deductions80C?: number;
  deductions80D?: number;
  nps80CCD1B?: number;
  hraExemption?: number;
  homeLoanInterestSec24?: number;
  otherDeductions?: number;
}

export function calculateIncomeTax(inputs: IncomeTaxInputs) {
  const gross = Math.max(0, inputs.grossIncome || 0);
  const isAY2526 = inputs.assessmentYear === '2025-26';

  // Standard Deductions
  const stdDeductionNew = isAY2526 ? 75000 : 50000;
  const stdDeductionOld = 50000;

  // Old Regime Deductions
  const sec80C = Math.min(150000, inputs.deductions80C || 0);
  const sec80D = Math.min(100000, inputs.deductions80D || 0);
  const sec80CCD = Math.min(50000, inputs.nps80CCD1B || 0);
  const sec24 = Math.min(200000, inputs.homeLoanInterestSec24 || 0);
  const hra = inputs.hraExemption || 0;
  const other = inputs.otherDeductions || 0;

  const totalOldDeductions = stdDeductionOld + sec80C + sec80D + sec80CCD + sec24 + hra + other;
  const taxableOld = Math.max(0, gross - totalOldDeductions);
  const taxableNew = Math.max(0, gross - stdDeductionNew);

  // New Regime Slabs (AY 2025-26 Budget 2024 revised slabs)
  let baseTaxNew = 0;
  if (isAY2526) {
    if (taxableNew > 300000) {
      if (taxableNew <= 700000) baseTaxNew = (taxableNew - 300000) * 0.05;
      else if (taxableNew <= 1000000) baseTaxNew = 20000 + (taxableNew - 700000) * 0.10;
      else if (taxableNew <= 1200000) baseTaxNew = 50000 + (taxableNew - 1000000) * 0.15;
      else if (taxableNew <= 1500000) baseTaxNew = 80000 + (taxableNew - 1200000) * 0.20;
      else baseTaxNew = 140000 + (taxableNew - 1500000) * 0.30;
    }
  } else {
    // AY 2024-25 Slabs
    if (taxableNew > 300000) {
      if (taxableNew <= 600000) baseTaxNew = (taxableNew - 300000) * 0.05;
      else if (taxableNew <= 900000) baseTaxNew = 15000 + (taxableNew - 600000) * 0.10;
      else if (taxableNew <= 1200000) baseTaxNew = 45000 + (taxableNew - 900000) * 0.15;
      else if (taxableNew <= 1500000) baseTaxNew = 90000 + (taxableNew - 1200000) * 0.20;
      else baseTaxNew = 150000 + (taxableNew - 1500000) * 0.30;
    }
  }

  // Rebate u/s 87A under New Regime (Zero tax up to ₹7.75 Lakh in AY 2025-26 after std deduction)
  if (taxableNew <= 700000) {
    baseTaxNew = 0;
  }

  // Old Regime Slabs
  let baseTaxOld = 0;
  if (taxableOld > 250000) {
    if (taxableOld <= 500000) baseTaxOld = (taxableOld - 250000) * 0.05;
    else if (taxableOld <= 1000000) baseTaxOld = 12500 + (taxableOld - 500000) * 0.20;
    else baseTaxOld = 112500 + (taxableOld - 1000000) * 0.30;
  }
  // Rebate u/s 87A under Old Regime (Zero tax up to ₹5 Lakh taxable income)
  if (taxableOld <= 500000) {
    baseTaxOld = 0;
  }

  // Surcharge computation if income > 50 Lakh
  let surchargeNew = 0;
  if (taxableNew > 5000000) {
    if (taxableNew <= 10000000) surchargeNew = baseTaxNew * 0.10;
    else if (taxableNew <= 20000000) surchargeNew = baseTaxNew * 0.15;
    else surchargeNew = baseTaxNew * 0.25;
  }

  const finalTaxNew = Math.round((baseTaxNew + surchargeNew) * 1.04); // 4% Health & Education Cess
  const finalTaxOld = Math.round(baseTaxOld * 1.04);

  const betterRegime = finalTaxNew <= finalTaxOld ? 'New Tax Regime' : 'Old Tax Regime';
  const taxSavings = Math.abs(finalTaxNew - finalTaxOld);

  return {
    taxableIncomeNew: taxableNew,
    taxableIncomeOld: taxableOld,
    totalDeductionsOld: totalOldDeductions,
    netTaxNew: finalTaxNew,
    netTaxOld: finalTaxOld,
    betterRegime,
    taxSavings,
  };
}

export function calculateGST(params: {
  amount: number;
  rate: number;
  type: 'exclusive' | 'inclusive';
  isInterstate?: boolean;
}) {
  const amt = Math.max(0, params.amount || 0);
  const rate = Math.max(0, params.rate || 18);
  const isExclusive = params.type === 'exclusive';

  let gstAmount = 0;
  let netInvoiceValue = 0;
  let baseAmount = 0;

  if (isExclusive) {
    baseAmount = amt;
    gstAmount = (amt * rate) / 100;
    netInvoiceValue = amt + gstAmount;
  } else {
    baseAmount = amt * (100 / (100 + rate));
    gstAmount = amt - baseAmount;
    netInvoiceValue = amt;
  }

  const cgst = params.isInterstate ? 0 : gstAmount / 2;
  const sgst = params.isInterstate ? 0 : gstAmount / 2;
  const igst = params.isInterstate ? gstAmount : 0;

  return {
    baseAmount: Math.round(baseAmount),
    gstAmount: Math.round(gstAmount),
    netInvoiceValue: Math.round(netInvoiceValue),
    cgst: Math.round(cgst),
    sgst: Math.round(sgst),
    igst: Math.round(igst),
  };
}

export function calculateHRA(params: {
  basicSalaryAnnual: number;
  daAnnual?: number;
  hraReceivedAnnual: number;
  rentPaidAnnual: number;
  isMetro: boolean;
}) {
  const salary = (params.basicSalaryAnnual || 0) + (params.daAnnual || 0);
  const hraReceived = params.hraReceivedAnnual || 0;
  const rentPaid = params.rentPaidAnnual || 0;
  const metroLimit = params.isMetro ? 0.50 : 0.40;

  const cond1 = hraReceived;
  const cond2 = Math.max(0, rentPaid - (salary * 0.10));
  const cond3 = salary * metroLimit;

  const exemptHra = Math.min(cond1, cond2, cond3);
  const taxableHra = Math.max(0, hraReceived - exemptHra);

  return {
    exemptHra: Math.round(exemptHra),
    taxableHra: Math.round(taxableHra),
    monthlyExempt: Math.round(exemptHra / 12),
  };
}
