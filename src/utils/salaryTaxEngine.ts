import { isMonetaryExceeded, isMonetaryLessOrEqual } from "../engines/financial-maths/index.ts";

/**
 * FY 2026-27 (AY 2027-28) Salary & Income Tax Computation Engine
 * Implements Indian Tax Laws including New Tax Regime & Old Tax Regime,
 * Section 87A Rebate with Marginal Relief, Surcharges, and 4% Health & Education Cess.
 */

export interface SalaryTaxInputs {
  // Assessment & Profile
  financialYear: '2026-2027';
  ageCategory: 'general' | 'senior' | 'superSenior'; // general <60, senior 60-80, superSenior >80
  isSalaried: boolean;

  // 1. Income from Salary
  basicSalary: number;
  dearnessAllowance: number;
  hraReceived: number;
  specialAllowance: number;
  ltaReceived: number;
  bonusVariable: number;
  otherAllowances: number;
  perquisites: number;

  // 2. House Property Income / Loss
  housingType: 'none' | 'self_occupied' | 'let_out';
  annualRentReceived: number;
  municipalTaxesPaid: number;
  homeLoanInterestSec24: number; // Max ₹2,00,000 for self-occupied in Old Regime

  // 3. Capital Gains
  stcgEquity111A: number; // 20% rate under FY 2026-27
  stcgOtherSlab: number; // at regular slab
  ltcgEquity112A: number; // 12.5% rate above ₹1.25 Lakh exemption
  ltcgOther112: number; // 12.5% rate

  // 4. Other Sources & Virtual Digital Assets (VDA)
  savingsInterest: number;
  fixedDepositInterest: number;
  dividendIncome: number;
  cryptoVdaGain: number; // Flat 30% under Sec 115BBH
  otherMiscellaneousIncome: number;

  // 5. Deductions (Old Regime)
  sec80C: number; // Max ₹1,50,000 (EPF, PPF, ELSS, Life Ins, Principal, etc.)
  sec80D_SelfFamily: number; // Max ₹25,000 (or ₹50,000 if senior)
  sec80D_Parents: number; // Max ₹25,000 (or ₹50,000 if senior)
  parentsAreSeniors: boolean;
  sec80CCD1B_NPS: number; // Max ₹50,000 self-contribution
  sec80E_EducationLoan: number; // Actual interest
  sec80G_Donations: number;
  sec80TTA_TTB_Savings: number; // Auto calculated up to ₹10k/₹50k

  // HRA Calculation parameters (Old Regime)
  isLivingInMetro: boolean;
  actualRentPaidYearly: number;

  // 6. Deductions (New Regime)
  employerNpsSec80CCD2: number; // Up to 14% of Basic for both central govt & private salaried

  // Optional: TDS or Advance Tax Paid
  tdsAdvanceTaxPaid: number;
}

export interface TaxSlabBreakdown {
  slab: string;
  rate: string;
  taxableInSlab: number;
  taxAmount: number;
}

export interface RegimeTaxResult {
  regime: 'new' | 'old';
  grossTotalIncome: number;
  totalExemptions: number;
  standardDeduction: number;
  totalDeductionsChapterVIA: number;
  netTaxableIncome: number;

  // Breakdown of Incomes
  salaryIncomeNet: number;
  housePropertyIncomeNet: number;
  specialRateIncome: number;
  specialRateTax: number;
  slabTaxableIncome: number;

  // Base Calculation
  baseTaxOnSlabs: number;
  slabBreakdown: TaxSlabBreakdown[];

  // Rebate & Marginal Relief
  sec87aRebate: number;
  marginalReliefSec87A: number;
  taxAfterRebate: number;

  // Surcharge & Surcharge Marginal Relief
  surchargeRate: number;
  surchargeAmount: number;
  surchargeMarginalRelief: number;
  taxAfterSurcharge: number;

  // Cess & Final Liability
  healthAndEducationCess: number;
  totalTaxLiability: number;
  netPayableOrRefund: number;

  // Statistical & KPI
  effectiveTaxRate: number; // (totalTaxLiability / grossTotalIncome) * 100
  marginalTaxRate: number;
  monthlyTakeHome: number;
  monthlyTaxLiability: number;
}

export interface DualRegimeComparison {
  newRegime: RegimeTaxResult;
  oldRegime: RegimeTaxResult;
  recommendedRegime: 'new' | 'old' | 'equal';
  annualSavings: number;
  monthlySavings: number;
  savingsPercentage: number;
  breakEvenDeductionsNeeded: number; // Under Old Regime to match New Regime
}

export const DEFAULT_SALARY_INPUTS: SalaryTaxInputs = {
  financialYear: '2026-2027',
  ageCategory: 'general',
  isSalaried: true,

  // Salary
  basicSalary: 900000,
  hraReceived: 180000,
  dearnessAllowance: 0,
  specialAllowance: 120000,
  ltaReceived: 0,
  bonusVariable: 75000,
  otherAllowances: 0,
  perquisites: 0,

  // House Property
  housingType: 'none',
  annualRentReceived: 0,
  municipalTaxesPaid: 0,
  homeLoanInterestSec24: 0,

  // Capital Gains
  stcgEquity111A: 0,
  stcgOtherSlab: 0,
  ltcgEquity112A: 0,
  ltcgOther112: 0,

  // Other Sources
  savingsInterest: 15000,
  fixedDepositInterest: 0,
  dividendIncome: 0,
  cryptoVdaGain: 0,
  otherMiscellaneousIncome: 0,

  // Deductions Old Regime
  sec80C: 150000,
  sec80D_SelfFamily: 25000,
  sec80D_Parents: 25000,
  parentsAreSeniors: true,
  sec80CCD1B_NPS: 50000,
  sec80E_EducationLoan: 0,
  sec80G_Donations: 0,
  sec80TTA_TTB_Savings: 10000,

  isLivingInMetro: true,
  actualRentPaidYearly: 180000,

  // Deductions New Regime
  employerNpsSec80CCD2: 0,

  tdsAdvanceTaxPaid: 0,
};

/**
 * Calculates HRA exemption under Section 10(13A) (Old Regime only)
 */
export function computeHraExemption(
  basicSalary: number,
  dearnessAllowance: number,
  hraReceived: number,
  actualRentPaid: number,
  isMetro: boolean
): number {
  if (hraReceived <= 0 || actualRentPaid <= 0) return 0;
  const salaryForHra = basicSalary + dearnessAllowance;
  const excessRent = Math.max(0, actualRentPaid - 0.1 * salaryForHra);
  const salaryPercentage = isMetro ? 0.5 * salaryForHra : 0.4 * salaryForHra;
  const exemption = Math.min(hraReceived, excessRent, salaryPercentage);
  return Math.round(Math.max(0, exemption));
}

/**
 * Computes New Tax Regime for FY 2026-27 (AY 2027-28)
 * Slabs:
 * 0 - 4L: 0%
 * 4L - 8L: 5%
 * 8L - 12L: 10%
 * 12L - 16L: 15%
 * 16L - 20L: 20%
 * 20L - 24L: 25%
 * Above 24L: 30%
 *
 * Sec 87A: Up to 12L => Full Rebate (₹60,000).
 * Marginal Relief on ₹12L threshold: Tax cannot exceed incremental income over ₹12L.
 */
export function computeNewTaxRegime2026(inputs: SalaryTaxInputs): RegimeTaxResult {
  const grossSalary =
    inputs.basicSalary +
    inputs.dearnessAllowance +
    inputs.hraReceived +
    inputs.specialAllowance +
    inputs.ltaReceived +
    inputs.bonusVariable +
    inputs.otherAllowances +
    inputs.perquisites;

  // New Regime Standard Deduction: ₹75,000 for salaried
  const standardDeduction = inputs.isSalaried ? 75000 : 0;
  const salaryIncomeNet = Math.max(0, grossSalary - standardDeduction);

  // House Property in New Regime: Only let out property loss can be set off against rental income (no self-occupied loss allowed)
  let housePropertyIncomeNet = 0;
  if (inputs.housingType === 'let_out') {
    const netAnnualValue = Math.max(0, inputs.annualRentReceived - inputs.municipalTaxesPaid);
    const statutoryDeduction30 = 0.3 * netAnnualValue;
    const netLetOut = netAnnualValue - statutoryDeduction30 - inputs.homeLoanInterestSec24;
    housePropertyIncomeNet = netLetOut; // Can be positive or negative against other let-out income
  }

  // Other Sources
  const otherSourcesIncome =
    inputs.savingsInterest +
    inputs.fixedDepositInterest +
    inputs.dividendIncome +
    inputs.otherMiscellaneousIncome +
    inputs.stcgOtherSlab;

  // Special Rate Incomes:
  // STCG 111A: 20%
  const taxStcg111A = inputs.stcgEquity111A * 0.20;

  // LTCG 112A: 12.5% on gains exceeding ₹1,25,000
  const taxableLtcg112A = Math.max(0, inputs.ltcgEquity112A - 125000);
  const taxLtcg112A = taxableLtcg112A * 0.125;

  // LTCG 112: 12.5%
  const taxLtcgOther = inputs.ltcgOther112 * 0.125;

  // Crypto / VDA 115BBH: Flat 30%
  const taxCrypto = inputs.cryptoVdaGain * 0.30;

  const specialRateIncome =
    inputs.stcgEquity111A + inputs.ltcgEquity112A + inputs.ltcgOther112 + inputs.cryptoVdaGain;
  const specialRateTax = taxStcg111A + taxLtcg112A + taxLtcgOther + taxCrypto;

  // Chapter VI-A Deductions allowed in New Regime: Section 80CCD(2) employer NPS (up to 14% basic)
  const maxNpsAllowed = 0.14 * inputs.basicSalary;
  const employerNpsDeduction = Math.min(inputs.employerNpsSec80CCD2 || 0, maxNpsAllowed);

  const grossTotalIncome =
    grossSalary +
    Math.max(0, housePropertyIncomeNet) +
    otherSourcesIncome +
    specialRateIncome;

  // Slab Taxable Income
  const slabTaxableIncome = Math.max(
    0,
    salaryIncomeNet +
      housePropertyIncomeNet +
      otherSourcesIncome -
      employerNpsDeduction
  );

  const netTaxableIncome = slabTaxableIncome + specialRateIncome;

  // Slab Breakdown Calculation (FY 2026-27 Slabs)
  const slabBreakdown: TaxSlabBreakdown[] = [];
  let remainingSlabIncome = slabTaxableIncome;
  let baseTaxOnSlabs = 0;

  // 1. Up to ₹4,00,000: Nil
  const slab1 = Math.min(remainingSlabIncome, 400000);
  slabBreakdown.push({ slab: '₹0 - ₹4,00,000', rate: 'Nil', taxableInSlab: slab1, taxAmount: 0 });
  remainingSlabIncome = Math.max(0, remainingSlabIncome - 400000);

  // 2. ₹4,00,001 - ₹8,00,000: 5%
  const slab2 = Math.min(remainingSlabIncome, 400000);
  const tax2 = slab2 * 0.05;
  baseTaxOnSlabs += tax2;
  slabBreakdown.push({ slab: '₹4,00,001 - ₹8,00,000', rate: '5%', taxableInSlab: slab2, taxAmount: tax2 });
  remainingSlabIncome = Math.max(0, remainingSlabIncome - 400000);

  // 3. ₹8,00,001 - ₹12,00,000: 10%
  const slab3 = Math.min(remainingSlabIncome, 400000);
  const tax3 = slab3 * 0.10;
  baseTaxOnSlabs += tax3;
  slabBreakdown.push({ slab: '₹8,00,001 - ₹12,00,000', rate: '10%', taxableInSlab: slab3, taxAmount: tax3 });
  remainingSlabIncome = Math.max(0, remainingSlabIncome - 400000);

  // 4. ₹12,00,001 - ₹16,00,000: 15%
  const slab4 = Math.min(remainingSlabIncome, 400000);
  const tax4 = slab4 * 0.15;
  baseTaxOnSlabs += tax4;
  slabBreakdown.push({ slab: '₹12,00,001 - ₹16,00,000', rate: '15%', taxableInSlab: slab4, taxAmount: tax4 });
  remainingSlabIncome = Math.max(0, remainingSlabIncome - 400000);

  // 5. ₹16,00,001 - ₹20,00,000: 20%
  const slab5 = Math.min(remainingSlabIncome, 400000);
  const tax5 = slab5 * 0.20;
  baseTaxOnSlabs += tax5;
  slabBreakdown.push({ slab: '₹16,00,001 - ₹20,00,000', rate: '20%', taxableInSlab: slab5, taxAmount: tax5 });
  remainingSlabIncome = Math.max(0, remainingSlabIncome - 400000);

  // 6. ₹20,00,001 - ₹24,00,000: 25%
  const slab6 = Math.min(remainingSlabIncome, 400000);
  const tax6 = slab6 * 0.25;
  baseTaxOnSlabs += tax6;
  slabBreakdown.push({ slab: '₹20,00,001 - ₹24,00,000', rate: '25%', taxableInSlab: slab6, taxAmount: tax6 });
  remainingSlabIncome = Math.max(0, remainingSlabIncome - 400000);

  // 7. Above ₹24,00,000: 30%
  if (remainingSlabIncome > 0) {
    const tax7 = remainingSlabIncome * 0.30;
    baseTaxOnSlabs += tax7;
    slabBreakdown.push({ slab: 'Above ₹24,00,000', rate: '30%', taxableInSlab: remainingSlabIncome, taxAmount: tax7 });
  }

  const totalBaseTax = baseTaxOnSlabs + specialRateTax;

  // Section 87A Rebate & Marginal Relief (New Regime threshold: ₹12,00,000)
  // Eligibility check should consider Total Taxable Income (including special rates)
  let sec87aRebate = 0;
  let marginalReliefSec87A = 0;
  let taxAfterRebate = totalBaseTax;

  if (isMonetaryLessOrEqual(netTaxableIncome, 1200000)) {
    // 100% rebate on base tax up to ₹60,000
    sec87aRebate = Math.min(totalBaseTax, 60000);
    taxAfterRebate = Math.max(0, totalBaseTax - sec87aRebate);
  } else {
    // Marginal relief if slabTaxableIncome is slightly above ₹12,00,000
    // Rule: Total tax on income cannot exceed the incremental income above ₹12,00,000
    const incomeExcess = slabTaxableIncome - 1200000;
    if (isMonetaryExceeded(baseTaxOnSlabs, incomeExcess)) {
      marginalReliefSec87A = baseTaxOnSlabs - incomeExcess;
      taxAfterRebate = incomeExcess + specialRateTax;
    }
  }

  // Surcharge (New Regime Caps at 25% above ₹2 Crores)
  let surchargeRate = 0;
  let surchargeAmount = 0;
  let surchargeMarginalRelief = 0;

  if (isMonetaryExceeded(netTaxableIncome, 20000000)) {
    surchargeRate = 0.25;
    surchargeAmount = taxAfterRebate * 0.25;
    // Marginal relief on 2 Crore
    const taxAt2Cr = computeBaseTaxNewRegime(20000000);
    const maxPayable = taxAt2Cr + (taxAt2Cr * 0.15) + (netTaxableIncome - 20000000);
    if (isMonetaryExceeded(taxAfterRebate + surchargeAmount, maxPayable)) {
      surchargeMarginalRelief = (taxAfterRebate + surchargeAmount) - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  } else if (isMonetaryExceeded(netTaxableIncome, 10000000)) {
    surchargeRate = 0.15;
    surchargeAmount = taxAfterRebate * 0.15;
    const taxAt1Cr = computeBaseTaxNewRegime(10000000);
    const maxPayable = taxAt1Cr + (taxAt1Cr * 0.10) + (netTaxableIncome - 10000000);
    if (isMonetaryExceeded(taxAfterRebate + surchargeAmount, maxPayable)) {
      surchargeMarginalRelief = (taxAfterRebate + surchargeAmount) - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  } else if (isMonetaryExceeded(netTaxableIncome, 5000000)) {
    surchargeRate = 0.10;
    surchargeAmount = taxAfterRebate * 0.10;
    const taxAt50L = computeBaseTaxNewRegime(5000000);
    const maxPayable = taxAt50L + (netTaxableIncome - 5000000);
    if (isMonetaryExceeded(taxAfterRebate + surchargeAmount, maxPayable)) {
      surchargeMarginalRelief = (taxAfterRebate + surchargeAmount) - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  }

  const taxAfterSurcharge = taxAfterRebate + surchargeAmount;
  const healthAndEducationCess = taxAfterSurcharge * 0.04;
  const totalTaxLiability = Math.round((taxAfterSurcharge + healthAndEducationCess) / 10) * 10;
  const netPayableOrRefund = totalTaxLiability - (inputs.tdsAdvanceTaxPaid || 0);

  const effectiveTaxRate = grossTotalIncome > 0 ? (totalTaxLiability / grossTotalIncome) * 100 : 0;
  const marginalTaxRate = slabTaxableIncome > 2400000 ? 30 : slabTaxableIncome > 2000000 ? 25 : slabTaxableIncome > 1600000 ? 20 : slabTaxableIncome > 1200000 ? 15 : slabTaxableIncome > 800000 ? 10 : slabTaxableIncome > 400000 ? 5 : 0;

  const monthlyTaxLiability = Math.round(totalTaxLiability / 12);
  const monthlyTakeHome = Math.round((grossTotalIncome - totalTaxLiability) / 12);

  return {
    regime: 'new',
    grossTotalIncome,
    totalExemptions: 0,
    standardDeduction,
    totalDeductionsChapterVIA: employerNpsDeduction,
    netTaxableIncome,
    salaryIncomeNet,
    housePropertyIncomeNet,
    specialRateIncome,
    specialRateTax,
    slabTaxableIncome,
    baseTaxOnSlabs,
    slabBreakdown,
    sec87aRebate,
    marginalReliefSec87A,
    taxAfterRebate,
    surchargeRate,
    surchargeAmount,
    surchargeMarginalRelief,
    taxAfterSurcharge,
    healthAndEducationCess,
    totalTaxLiability,
    netPayableOrRefund,
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
    marginalTaxRate,
    monthlyTakeHome,
    monthlyTaxLiability,
  };
}

function computeBaseTaxNewRegime(taxableIncome: number): number {
  let rem = taxableIncome;
  let tax = 0;
  if (rem > 400000) {
    tax += Math.min(rem - 400000, 400000) * 0.05;
  }
  if (rem > 800000) {
    tax += Math.min(rem - 800000, 400000) * 0.10;
  }
  if (rem > 1200000) {
    tax += Math.min(rem - 1200000, 400000) * 0.15;
  }
  if (rem > 1600000) {
    tax += Math.min(rem - 1600000, 400000) * 0.20;
  }
  if (rem > 2000000) {
    tax += Math.min(rem - 2000000, 400000) * 0.25;
  }
  if (rem > 2400000) {
    tax += (rem - 2400000) * 0.30;
  }
  return tax;
}

/**
 * Computes Old Tax Regime for FY 2026-27 (AY 2027-28)
 * Slabs (General <60 yrs):
 * 0 - 2.5L: Nil
 * 2.5L - 5L: 5%
 * 5L - 10L: 20%
 * Above 10L: 30%
 *
 * Sec 87A: Up to 5L => Full Rebate (₹12,500).
 */
function computeBaseTaxOldRegime(taxableIncome: number, inputs: SalaryTaxInputs): number {
  let basicExemptionLimit = 250000;
  if (inputs.ageCategory === 'senior') basicExemptionLimit = 300000;
  if (inputs.ageCategory === 'superSenior') basicExemptionLimit = 500000;

  let remaining = taxableIncome;
  let tax = 0;
  if (remaining > basicExemptionLimit) {
      if (basicExemptionLimit < 500000) {
        const band2 = 500000 - basicExemptionLimit;
        const s2 = Math.min(remaining - basicExemptionLimit, band2);
        tax += s2 * 0.05;
      }
  }
  if (remaining > 500000) {
    tax += Math.min(remaining - 500000, 500000) * 0.20;
  }
  if (remaining > 1000000) {
    tax += (remaining - 1000000) * 0.30;
  }
  return tax;
}

export function computeOldTaxRegime(inputs: SalaryTaxInputs): RegimeTaxResult {
  const grossSalary =
    inputs.basicSalary +
    inputs.dearnessAllowance +
    inputs.hraReceived +
    inputs.specialAllowance +
    inputs.ltaReceived +
    inputs.bonusVariable +
    inputs.otherAllowances +
    inputs.perquisites;

  // HRA Exemption Sec 10(13A)
  const hraExemption = computeHraExemption(
    inputs.basicSalary,
    inputs.dearnessAllowance,
    inputs.hraReceived,
    inputs.actualRentPaidYearly,
    inputs.isLivingInMetro
  );

  const totalExemptions = hraExemption + (inputs.ltaReceived || 0);

  // Standard Deduction in Old Regime: ₹50,000 for salaried
  const standardDeduction = inputs.isSalaried ? 50000 : 0;
  const salaryIncomeNet = Math.max(0, grossSalary - totalExemptions - standardDeduction);

  // House Property Loss/Income under Old Regime:
  // Self-occupied: Sec 24 deduction up to ₹2,00,000 loss
  let housePropertyIncomeNet = 0;
  if (inputs.housingType === 'self_occupied') {
    housePropertyIncomeNet = -Math.min(200000, inputs.homeLoanInterestSec24);
  } else if (inputs.housingType === 'let_out') {
    const netAnnualValue = Math.max(0, inputs.annualRentReceived - inputs.municipalTaxesPaid);
    const statutory30 = 0.3 * netAnnualValue;
    const netLetOut = netAnnualValue - statutory30 - inputs.homeLoanInterestSec24;
    housePropertyIncomeNet = Math.max(-200000, netLetOut); // Max set-off loss capped at ₹2,00,000
  }

  // Other Sources
  const isSenior = inputs.ageCategory === 'senior' || inputs.ageCategory === 'superSenior';
  const savingsDeductionMax = isSenior ? 50000 : 10000;
  
  // 80TTB for seniors includes FD interest; 80TTA for others only Savings interest
  const eligibleInterestForDeduction = isSenior 
    ? (inputs.savingsInterest + inputs.fixedDepositInterest)
    : inputs.savingsInterest;
    
  const sec80TTA_TTB = Math.min(eligibleInterestForDeduction, savingsDeductionMax);

  const otherSourcesIncome =
    inputs.savingsInterest +
    inputs.fixedDepositInterest +
    inputs.dividendIncome +
    inputs.otherMiscellaneousIncome +
    inputs.stcgOtherSlab;

  // Special Rate Incomes:
  const taxStcg111A = inputs.stcgEquity111A * 0.20;
  const taxableLtcg112A = Math.max(0, inputs.ltcgEquity112A - 125000);
  const taxLtcg112A = taxableLtcg112A * 0.125;
  const taxLtcgOther = inputs.ltcgOther112 * 0.125;
  const taxCrypto = inputs.cryptoVdaGain * 0.30;

  const specialRateIncome =
    inputs.stcgEquity111A + inputs.ltcgEquity112A + inputs.ltcgOther112 + inputs.cryptoVdaGain;
  const specialRateTax = taxStcg111A + taxLtcg112A + taxLtcgOther + taxCrypto;

  // Chapter VI-A Deductions
  const ded80C = Math.min(150000, inputs.sec80C || 0);
  const ded80D_Self = Math.min(inputs.ageCategory !== 'general' ? 50000 : 25000, inputs.sec80D_SelfFamily || 0);
  const ded80D_Parents = Math.min(inputs.parentsAreSeniors ? 50000 : 25000, inputs.sec80D_Parents || 0);
  const ded80CCD1B = Math.min(50000, inputs.sec80CCD1B_NPS || 0);
  const ded80E = inputs.sec80E_EducationLoan || 0;
  const ded80G = inputs.sec80G_Donations || 0;

  const totalDeductionsChapterVIA =
    ded80C +
    ded80D_Self +
    ded80D_Parents +
    ded80CCD1B +
    ded80E +
    ded80G +
    sec80TTA_TTB;

  const grossTotalIncome =
    grossSalary +
    (housePropertyIncomeNet > 0 ? housePropertyIncomeNet : 0) +
    otherSourcesIncome +
    specialRateIncome;

  const slabTaxableIncome = Math.max(
    0,
    salaryIncomeNet +
      housePropertyIncomeNet +
      otherSourcesIncome -
      totalDeductionsChapterVIA
  );

  const netTaxableIncome = slabTaxableIncome + specialRateIncome;

  // Slabs computation based on Age Category
  const slabBreakdown: TaxSlabBreakdown[] = [];
  let remaining = slabTaxableIncome;
  let baseTaxOnSlabs = 0;

  let basicExemptionLimit = 250000;
  if (inputs.ageCategory === 'senior') basicExemptionLimit = 300000;
  if (inputs.ageCategory === 'superSenior') basicExemptionLimit = 500000;

  // Slab 1: Exemption
  const s1 = Math.min(remaining, basicExemptionLimit);
  slabBreakdown.push({ slab: `₹0 - ₹${(basicExemptionLimit / 100000).toFixed(1)}L`, rate: 'Nil', taxableInSlab: s1, taxAmount: 0 });
  remaining = Math.max(0, remaining - basicExemptionLimit);

  // Slab 2: Up to 5L (5%)
  if (basicExemptionLimit < 500000) {
    const band2 = 500000 - basicExemptionLimit;
    const s2 = Math.min(remaining, band2);
    const t2 = s2 * 0.05;
    baseTaxOnSlabs += t2;
    slabBreakdown.push({ slab: `₹${(basicExemptionLimit / 100000).toFixed(1)}L - ₹5,00,000`, rate: '5%', taxableInSlab: s2, taxAmount: t2 });
    remaining = Math.max(0, remaining - band2);
  }

  // Slab 3: ₹5L - ₹10L (20%)
  const s3 = Math.min(remaining, 500000);
  const t3 = s3 * 0.20;
  baseTaxOnSlabs += t3;
  slabBreakdown.push({ slab: '₹5,00,001 - ₹10,00,000', rate: '20%', taxableInSlab: s3, taxAmount: t3 });
  remaining = Math.max(0, remaining - 500000);

  // Slab 4: Above ₹10L (30%)
  if (remaining > 0) {
    const t4 = remaining * 0.30;
    baseTaxOnSlabs += t4;
    slabBreakdown.push({ slab: 'Above ₹10,00,000', rate: '30%', taxableInSlab: remaining, taxAmount: t4 });
  }

  const totalBaseTax = baseTaxOnSlabs + specialRateTax;

  // Section 87A Rebate (Old Regime threshold: ₹5,00,000)
  let sec87aRebate = 0;
  if (isMonetaryLessOrEqual(netTaxableIncome, 500000)) {
    sec87aRebate = Math.min(totalBaseTax, 12500);
  }

  const taxAfterRebate = Math.max(0, totalBaseTax - sec87aRebate);

  // Surcharges (Old Regime can go up to 37% above ₹5 Crores)
  let surchargeRate = 0;
  let surchargeAmount = 0;
  let surchargeMarginalRelief = 0;

  if (isMonetaryExceeded(netTaxableIncome, 50000000)) {
    surchargeRate = 0.37;
    surchargeAmount = taxAfterRebate * 0.37;
  } else if (isMonetaryExceeded(netTaxableIncome, 20000000)) {
    surchargeRate = 0.25;
    surchargeAmount = taxAfterRebate * 0.25;
    const taxAt2Cr = computeBaseTaxOldRegime(20000000, inputs);
    const maxPayable = taxAt2Cr + (taxAt2Cr * 0.15) + (netTaxableIncome - 20000000);
    if (isMonetaryExceeded(taxAfterRebate + surchargeAmount, maxPayable)) {
      surchargeMarginalRelief = (taxAfterRebate + surchargeAmount) - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  } else if (isMonetaryExceeded(netTaxableIncome, 10000000)) {
    surchargeRate = 0.15;
    surchargeAmount = taxAfterRebate * 0.15;
    const taxAt1Cr = computeBaseTaxOldRegime(10000000, inputs);
    const maxPayable = taxAt1Cr + (taxAt1Cr * 0.10) + (netTaxableIncome - 10000000);
    if (isMonetaryExceeded(taxAfterRebate + surchargeAmount, maxPayable)) {
      surchargeMarginalRelief = (taxAfterRebate + surchargeAmount) - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  } else if (isMonetaryExceeded(netTaxableIncome, 5000000)) {
    surchargeRate = 0.10;
    surchargeAmount = taxAfterRebate * 0.10;
    const taxAt50L = computeBaseTaxOldRegime(5000000, inputs);
    const surchargeAt50L = taxAt50L * 0.10;
    const maxPayable = (taxAt50L + surchargeAt50L) + (netTaxableIncome - 5000000);
    if (isMonetaryExceeded(taxAfterRebate + surchargeAmount, maxPayable)) {
      surchargeMarginalRelief = (taxAfterRebate + surchargeAmount) - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  }

  const taxAfterSurcharge = taxAfterRebate + surchargeAmount;
  const healthAndEducationCess = taxAfterSurcharge * 0.04;
  const totalTaxLiability = Math.round((taxAfterSurcharge + healthAndEducationCess) / 10) * 10;
  const netPayableOrRefund = totalTaxLiability - (inputs.tdsAdvanceTaxPaid || 0);

  const effectiveTaxRate = grossTotalIncome > 0 ? (totalTaxLiability / grossTotalIncome) * 100 : 0;
  const marginalTaxRate = slabTaxableIncome > 1000000 ? 30 : slabTaxableIncome > 500000 ? 20 : slabTaxableIncome > basicExemptionLimit ? 5 : 0;

  const monthlyTaxLiability = Math.round(totalTaxLiability / 12);
  const monthlyTakeHome = Math.round((grossTotalIncome - totalTaxLiability) / 12);

  return {
    regime: 'old',
    grossTotalIncome,
    totalExemptions,
    standardDeduction,
    totalDeductionsChapterVIA,
    netTaxableIncome,
    salaryIncomeNet,
    housePropertyIncomeNet,
    specialRateIncome,
    specialRateTax,
    slabTaxableIncome,
    baseTaxOnSlabs,
    slabBreakdown,
    sec87aRebate,
    marginalReliefSec87A: 0,
    taxAfterRebate,
    surchargeRate,
    surchargeAmount,
    surchargeMarginalRelief,
    taxAfterSurcharge,
    healthAndEducationCess,
    totalTaxLiability,
    netPayableOrRefund,
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
    marginalTaxRate,
    monthlyTakeHome,
    monthlyTaxLiability,
  };
}

/**
 * High-level Dual Regime Comparison Engine
 */
export function calculateDualSalaryTax(inputs: SalaryTaxInputs): DualRegimeComparison {
  const newRegime = computeNewTaxRegime2026(inputs);
  const oldRegime = computeOldTaxRegime(inputs);

  const diff = oldRegime.totalTaxLiability - newRegime.totalTaxLiability;
  let recommendedRegime: 'new' | 'old' | 'equal' = 'equal';
  let annualSavings = 0;

  if (diff > 0) {
    recommendedRegime = 'new';
    annualSavings = diff;
  } else if (diff < 0) {
    recommendedRegime = 'old';
    annualSavings = Math.abs(diff);
  }

  const monthlySavings = Math.round(annualSavings / 12);
  const baseForPct = Math.max(newRegime.totalTaxLiability, oldRegime.totalTaxLiability);
  const savingsPercentage = baseForPct > 0 ? Number(((annualSavings / baseForPct) * 100).toFixed(1)) : 0;

  // Approximate additional deductions required under Old Regime to match New Regime tax
  let breakEvenDeductionsNeeded = 0;
  if (recommendedRegime === 'new' && annualSavings > 0) {
    const marginalRate = oldRegime.marginalTaxRate > 0 ? oldRegime.marginalTaxRate / 100 : 0.20;
    breakEvenDeductionsNeeded = Math.round(annualSavings / marginalRate);
  }

  return {
    newRegime,
    oldRegime,
    recommendedRegime,
    annualSavings,
    monthlySavings,
    savingsPercentage,
    breakEvenDeductionsNeeded,
  };
}
