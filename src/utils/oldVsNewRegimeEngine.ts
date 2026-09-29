/**
 * FY 2026-27 (AY 2027-28) Old vs. New Tax Regime Comparison Engine
 * Pure mathematical functions for simultaneous tax calculation,
 * Section 87A rebates, marginal relief mechanics, surcharges, and 4% Cess.
 */

export interface OldVsNewInputs {
  financialYear: '2026-2027';
  ageCategory: 'general' | 'senior' | 'superSenior'; // <60, 60-80, 80+
  isSalaried: boolean;

  // 1. Income from Salary
  basicSalary: number;
  hraReceived: number;
  specialAllowance: number;
  bonusVariable: number;
  otherAllowances: number;

  // 2. Other Incomes
  housePropertyRentalIncome: number;
  homeLoanInterestSec24: number; // Self-occupied (max ₹2L in Old Regime)
  savingsInterest: number;
  fixedDepositInterest: number;
  capitalGainsStcg: number; // 20% rate
  capitalGainsLtcg: number; // 12.5% rate above ₹1.25L exemption
  cryptoVdaIncome: number; // 30% flat rate
  otherSourcesIncome: number;

  // 3. Deductions (Old Regime)
  sec80C: number; // Max ₹1,50,000
  sec80D_Self: number; // Max ₹25,000 (<60) or ₹50,000 (Senior)
  sec80D_Parents: number; // Max ₹25,000 or ₹50,000
  sec80CCD1B_NPS: number; // Max ₹50,000
  sec80E_EducationLoan: number;
  sec80G_Donations: number;
  actualRentPaidYearly: number;
  isLivingInMetro: boolean;

  // 4. Deductions (New Regime)
  employerNpsSec80CCD2: number; // Up to 14% of Basic

  // Advance Tax / TDS Paid
  tdsAdvanceTaxPaid: number;
}

export interface SlabTierSegment {
  label: string;
  rateLabel: string;
  rate: number;
  from: number;
  to: number | null;
  taxableAmount: number;
  taxAmount: number;
  colorClass: string;
  percentOfTotal: number;
}

export interface SingleRegimeResult {
  regime: 'new' | 'old';
  regimeName: string;
  grossIncome: number;
  standardDeduction: number;
  hraExemption: number;
  homeLoanInterestDeduction: number;
  chapterVIADeductions: number;
  totalDeductionsAndExemptions: number;
  netTaxableIncome: number;

  // Slab & Special Tax
  slabTaxableIncome: number;
  baseTaxOnSlabs: number;
  specialRateTax: number;
  totalBaseTax: number;
  slabBreakdown: SlabTierSegment[];

  // Rebate u/s 87A & Marginal Relief
  sec87aRebate: number;
  marginalReliefSec87A: number;
  taxAfterRebateAndRelief: number;

  // Surcharge & Surcharge Relief
  surchargeRate: number;
  surchargeAmount: number;
  surchargeMarginalRelief: number;
  taxAfterSurcharge: number;

  // Final Liability
  healthAndEducationCess: number;
  totalTaxPayable: number;
  netPayableOrRefund: number;

  // Analytics
  effectiveTaxRate: number;
  marginalTaxRate: number;
  monthlyTakeHome: number;
  monthlyTaxTds: number;
}

export interface OldVsNewComparisonResult {
  newRegime: SingleRegimeResult;
  oldRegime: SingleRegimeResult;
  winningRegime: 'new' | 'old' | 'equal';
  winningRegimeName: string;
  annualSavings: number;
  monthlySavings: number;
  savingsPercentage: number;
  breakEvenDeductionsNeeded: number;
  differenceAmount: number;
}

export const DEFAULT_OLD_VS_NEW_INPUTS: OldVsNewInputs = {
  financialYear: '2026-2027',
  ageCategory: 'general',
  isSalaried: true,

  basicSalary: 900000,
  hraReceived: 180000,
  specialAllowance: 120000,
  bonusVariable: 75000,
  otherAllowances: 0,

  housePropertyRentalIncome: 0,
  homeLoanInterestSec24: 0,
  savingsInterest: 15000,
  fixedDepositInterest: 0,
  capitalGainsStcg: 0,
  capitalGainsLtcg: 0,
  cryptoVdaIncome: 0,
  otherSourcesIncome: 0,

  sec80C: 150000,
  sec80D_Self: 25000,
  sec80D_Parents: 25000,
  sec80CCD1B_NPS: 50000,
  sec80E_EducationLoan: 0,
  sec80G_Donations: 0,
  actualRentPaidYearly: 180000,
  isLivingInMetro: true,

  employerNpsSec80CCD2: 0,
  tdsAdvanceTaxPaid: 0,
};

/**
 * Calculates HRA exemption under Section 10(13A) (Old Regime only)
 */
export function calculateHraExemption(
  basicSalary: number,
  hraReceived: number,
  actualRentPaid: number,
  isMetro: boolean
): number {
  if (hraReceived <= 0 || actualRentPaid <= 0) return 0;
  const excessRent = Math.max(0, actualRentPaid - 0.1 * basicSalary);
  const salaryPercent = isMetro ? 0.5 * basicSalary : 0.4 * basicSalary;
  return Math.round(Math.max(0, Math.min(hraReceived, excessRent, salaryPercent)));
}

/**
 * Calculates New Tax Regime for FY 2026-27 (AY 2027-28)
 */
export function calculateNewRegime2026(inputs: OldVsNewInputs): SingleRegimeResult {
  const grossSalary =
    (inputs.basicSalary || 0) +
    (inputs.hraReceived || 0) +
    (inputs.specialAllowance || 0) +
    (inputs.bonusVariable || 0) +
    (inputs.otherAllowances || 0);

  const grossIncome =
    grossSalary +
    (inputs.housePropertyRentalIncome || 0) +
    (inputs.savingsInterest || 0) +
    (inputs.fixedDepositInterest || 0) +
    (inputs.capitalGainsStcg || 0) +
    (inputs.capitalGainsLtcg || 0) +
    (inputs.cryptoVdaIncome || 0) +
    (inputs.otherSourcesIncome || 0);

  // New Regime Standard Deduction: ₹75,000 for salaried
  const standardDeduction = inputs.isSalaried ? 75000 : 0;

  // Chapter VI-A allowed in New Regime: Section 80CCD(2) employer NPS (up to 14% of Basic)
  const maxNpsAllowed = 0.14 * (inputs.basicSalary || 0);
  const chapterVIADeductions = Math.min(inputs.employerNpsSec80CCD2 || 0, maxNpsAllowed);

  const totalDeductionsAndExemptions = standardDeduction + chapterVIADeductions;

  // Special Rate Incomes:
  const taxStcg = (inputs.capitalGainsStcg || 0) * 0.20;
  const taxableLtcg = Math.max(0, (inputs.capitalGainsLtcg || 0) - 125000);
  const taxLtcg = taxableLtcg * 0.125;
  const taxCrypto = (inputs.cryptoVdaIncome || 0) * 0.30;
  const specialRateTax = taxStcg + taxLtcg + taxCrypto;
  const specialRateIncome =
    (inputs.capitalGainsStcg || 0) +
    (inputs.capitalGainsLtcg || 0) +
    (inputs.cryptoVdaIncome || 0);

  // Regular Income subject to slabs
  const regularIncome =
    grossSalary +
    (inputs.housePropertyRentalIncome || 0) +
    (inputs.savingsInterest || 0) +
    (inputs.fixedDepositInterest || 0) +
    (inputs.otherSourcesIncome || 0);

  const slabTaxableIncome = Math.max(0, regularIncome - totalDeductionsAndExemptions);
  const netTaxableIncome = slabTaxableIncome + specialRateIncome;

  // Slab Breakdown (FY 2026-27 Slabs)
  const slabTiers = [
    { label: '₹0 - ₹4,00,000', rateLabel: 'Nil', rate: 0, from: 0, to: 400000, colorClass: 'bg-emerald-500' },
    { label: '₹4,00,001 - ₹8,00,000', rateLabel: '5%', rate: 0.05, from: 400000, to: 800000, colorClass: 'bg-teal-500' },
    { label: '₹8,00,001 - ₹12,00,000', rateLabel: '10%', rate: 0.10, from: 800000, to: 1200000, colorClass: 'bg-cyan-500' },
    { label: '₹12,00,001 - ₹16,00,000', rateLabel: '15%', rate: 0.15, from: 1200000, to: 1600000, colorClass: 'bg-blue-500' },
    { label: '₹16,00,001 - ₹20,00,000', rateLabel: '20%', rate: 0.20, from: 1600000, to: 2000000, colorClass: 'bg-indigo-500' },
    { label: '₹20,00,001 - ₹24,00,000', rateLabel: '25%', rate: 0.25, from: 2000000, to: 2400000, colorClass: 'bg-violet-500' },
    { label: 'Above ₹24,00,000', rateLabel: '30%', rate: 0.30, from: 2400000, to: null, colorClass: 'bg-rose-500' },
  ];

  let remaining = slabTaxableIncome;
  let baseTaxOnSlabs = 0;
  const slabBreakdown: SlabTierSegment[] = [];

  for (const tier of slabTiers) {
    if (remaining <= 0 && tier.from > 0) {
      slabBreakdown.push({
        ...tier,
        taxableAmount: 0,
        taxAmount: 0,
        percentOfTotal: 0,
      });
      continue;
    }

    const tierBand = tier.to ? tier.to - tier.from : remaining;
    const taxableInTier = Math.max(0, Math.min(remaining, tierBand));
    const taxInTier = taxableInTier * tier.rate;
    baseTaxOnSlabs += taxInTier;
    remaining = Math.max(0, remaining - taxableInTier);

    const percentOfTotal = slabTaxableIncome > 0 ? (taxableInTier / slabTaxableIncome) * 100 : 0;
    slabBreakdown.push({
      ...tier,
      taxableAmount: taxableInTier,
      taxAmount: taxInTier,
      percentOfTotal: Number(percentOfTotal.toFixed(1)),
    });
  }

  const totalBaseTax = baseTaxOnSlabs + specialRateTax;

  // Section 87A Rebate & Marginal Relief (New Regime threshold: ₹12,00,000)
  let sec87aRebate = 0;
  let marginalReliefSec87A = 0;
  let taxAfterRebateAndRelief = totalBaseTax;

  if (slabTaxableIncome <= 1200000) {
    sec87aRebate = Math.min(totalBaseTax, 60000);
    taxAfterRebateAndRelief = Math.max(0, totalBaseTax - sec87aRebate);
  } else {
    // Marginal Relief: Tax on income above ₹12L cannot exceed incremental income over ₹12L
    const excessOver12L = slabTaxableIncome - 1200000;
    if (baseTaxOnSlabs > excessOver12L) {
      marginalReliefSec87A = baseTaxOnSlabs - excessOver12L;
      taxAfterRebateAndRelief = excessOver12L + specialRateTax;
    }
  }

  // Surcharge (New Regime Caps at 25% above ₹2 Crores)
  let surchargeRate = 0;
  let surchargeAmount = 0;
  let surchargeMarginalRelief = 0;

  if (netTaxableIncome > 20000000) {
    surchargeRate = 0.25;
    surchargeAmount = taxAfterRebateAndRelief * 0.25;
    const taxAt2Cr = computeNewRegimeBaseTax(20000000);
    const maxPayable = taxAt2Cr + taxAt2Cr * 0.15 + (netTaxableIncome - 20000000);
    if (taxAfterRebateAndRelief + surchargeAmount > maxPayable) {
      surchargeMarginalRelief = taxAfterRebateAndRelief + surchargeAmount - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  } else if (netTaxableIncome > 10000000) {
    surchargeRate = 0.15;
    surchargeAmount = taxAfterRebateAndRelief * 0.15;
    const taxAt1Cr = computeNewRegimeBaseTax(10000000);
    const maxPayable = taxAt1Cr + taxAt1Cr * 0.10 + (netTaxableIncome - 10000000);
    if (taxAfterRebateAndRelief + surchargeAmount > maxPayable) {
      surchargeMarginalRelief = taxAfterRebateAndRelief + surchargeAmount - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  } else if (netTaxableIncome > 5000000) {
    surchargeRate = 0.10;
    surchargeAmount = taxAfterRebateAndRelief * 0.10;
    const taxAt50L = computeNewRegimeBaseTax(5000000);
    const maxPayable = taxAt50L + (netTaxableIncome - 5000000);
    if (taxAfterRebateAndRelief + surchargeAmount > maxPayable) {
      surchargeMarginalRelief = taxAfterRebateAndRelief + surchargeAmount - maxPayable;
      surchargeAmount = Math.max(0, surchargeAmount - surchargeMarginalRelief);
    }
  }

  const taxAfterSurcharge = taxAfterRebateAndRelief + surchargeAmount;
  const healthAndEducationCess = Math.round(taxAfterSurcharge * 0.04);
  const totalTaxPayable = Math.round(taxAfterSurcharge + healthAndEducationCess);
  const netPayableOrRefund = totalTaxPayable - (inputs.tdsAdvanceTaxPaid || 0);

  const effectiveTaxRate = grossIncome > 0 ? Number(((totalTaxPayable / grossIncome) * 100).toFixed(2)) : 0;
  const marginalTaxRate =
    slabTaxableIncome > 2400000
      ? 30
      : slabTaxableIncome > 2000000
      ? 25
      : slabTaxableIncome > 1600000
      ? 20
      : slabTaxableIncome > 1200000
      ? 15
      : slabTaxableIncome > 800000
      ? 10
      : slabTaxableIncome > 400000
      ? 5
      : 0;

  const monthlyTaxTds = Math.round(totalTaxPayable / 12);
  const monthlyTakeHome = Math.round((grossIncome - totalTaxPayable) / 12);

  return {
    regime: 'new',
    regimeName: 'New Tax Regime (FY 2026-27)',
    grossIncome,
    standardDeduction,
    hraExemption: 0,
    homeLoanInterestDeduction: 0,
    chapterVIADeductions,
    totalDeductionsAndExemptions,
    netTaxableIncome,
    slabTaxableIncome,
    baseTaxOnSlabs,
    specialRateTax,
    totalBaseTax,
    slabBreakdown,
    sec87aRebate,
    marginalReliefSec87A,
    taxAfterRebateAndRelief,
    surchargeRate,
    surchargeAmount,
    surchargeMarginalRelief,
    taxAfterSurcharge,
    healthAndEducationCess,
    totalTaxPayable,
    netPayableOrRefund,
    effectiveTaxRate,
    marginalTaxRate,
    monthlyTakeHome,
    monthlyTaxTds,
  };
}

function computeNewRegimeBaseTax(taxable: number): number {
  let rem = taxable;
  let tax = 0;
  if (rem > 400000) tax += Math.min(rem - 400000, 400000) * 0.05;
  if (rem > 800000) tax += Math.min(rem - 800000, 400000) * 0.10;
  if (rem > 1200000) tax += Math.min(rem - 1200000, 400000) * 0.15;
  if (rem > 1600000) tax += Math.min(rem - 1600000, 400000) * 0.20;
  if (rem > 2000000) tax += Math.min(rem - 2000000, 400000) * 0.25;
  if (rem > 2400000) tax += (rem - 2400000) * 0.30;
  return tax;
}

/**
 * Calculates Old Tax Regime for FY 2026-27 (AY 2027-28)
 */
export function calculateOldRegime(inputs: OldVsNewInputs): SingleRegimeResult {
  const grossSalary =
    (inputs.basicSalary || 0) +
    (inputs.hraReceived || 0) +
    (inputs.specialAllowance || 0) +
    (inputs.bonusVariable || 0) +
    (inputs.otherAllowances || 0);

  const grossIncome =
    grossSalary +
    (inputs.housePropertyRentalIncome || 0) +
    (inputs.savingsInterest || 0) +
    (inputs.fixedDepositInterest || 0) +
    (inputs.capitalGainsStcg || 0) +
    (inputs.capitalGainsLtcg || 0) +
    (inputs.cryptoVdaIncome || 0) +
    (inputs.otherSourcesIncome || 0);

  // Standard Deduction: ₹50,000 in Old Regime
  const standardDeduction = inputs.isSalaried ? 50000 : 0;

  // HRA Exemption
  const hraExemption = calculateHraExemption(
    inputs.basicSalary || 0,
    inputs.hraReceived || 0,
    inputs.actualRentPaidYearly || 0,
    inputs.isLivingInMetro
  );

  // Section 24 Home Loan Interest (capped at ₹2,00,000 for self-occupied)
  const homeLoanInterestDeduction = Math.min(200000, inputs.homeLoanInterestSec24 || 0);

  // Chapter VI-A Deductions
  const ded80C = Math.min(150000, Math.max(0, inputs.sec80C || 0));
  const max80DSelf = inputs.ageCategory !== 'general' ? 50000 : 25000;
  const ded80DSelf = Math.min(max80DSelf, Math.max(0, inputs.sec80D_Self || 0));
  const ded80DParents = Math.min(50000, Math.max(0, inputs.sec80D_Parents || 0));
  const ded80CCD1B = Math.min(50000, Math.max(0, inputs.sec80CCD1B_NPS || 0));
  const ded80E = Math.max(0, inputs.sec80E_EducationLoan || 0);
  const ded80G = Math.max(0, inputs.sec80G_Donations || 0);

  // Section 80TTA/TTB
  const maxSavingsDeduction = inputs.ageCategory === 'general' ? 10000 : 50000;
  const sec80TTA_TTB = Math.min(inputs.savingsInterest || 0, maxSavingsDeduction);

  const chapterVIADeductions =
    ded80C + ded80DSelf + ded80DParents + ded80CCD1B + ded80E + ded80G + sec80TTA_TTB;

  const totalDeductionsAndExemptions =
    standardDeduction + hraExemption + homeLoanInterestDeduction + chapterVIADeductions;

  // Special Rate Incomes:
  const taxStcg = (inputs.capitalGainsStcg || 0) * 0.20;
  const taxableLtcg = Math.max(0, (inputs.capitalGainsLtcg || 0) - 125000);
  const taxLtcg = taxableLtcg * 0.125;
  const taxCrypto = (inputs.cryptoVdaIncome || 0) * 0.30;
  const specialRateTax = taxStcg + taxLtcg + taxCrypto;
  const specialRateIncome =
    (inputs.capitalGainsStcg || 0) +
    (inputs.capitalGainsLtcg || 0) +
    (inputs.cryptoVdaIncome || 0);

  const regularIncome =
    grossSalary +
    (inputs.housePropertyRentalIncome || 0) +
    (inputs.savingsInterest || 0) +
    (inputs.fixedDepositInterest || 0) +
    (inputs.otherSourcesIncome || 0);

  const slabTaxableIncome = Math.max(0, regularIncome - totalDeductionsAndExemptions);
  const netTaxableIncome = slabTaxableIncome + specialRateIncome;

  // Age-based Slabs in Old Regime
  let basicExemptionLimit = 250000;
  if (inputs.ageCategory === 'senior') basicExemptionLimit = 300000;
  if (inputs.ageCategory === 'superSenior') basicExemptionLimit = 500000;

  const slabTiers: Array<{
    label: string;
    rateLabel: string;
    rate: number;
    from: number;
    to: number | null;
    colorClass: string;
  }> = [];

  slabTiers.push({
    label: `₹0 - ₹${(basicExemptionLimit / 100000).toFixed(1)}L`,
    rateLabel: 'Nil',
    rate: 0,
    from: 0,
    to: basicExemptionLimit,
    colorClass: 'bg-emerald-500',
  });

  if (basicExemptionLimit < 500000) {
    slabTiers.push({
      label: `₹${(basicExemptionLimit / 100000).toFixed(1)}L - ₹5,00,000`,
      rateLabel: '5%',
      rate: 0.05,
      from: basicExemptionLimit,
      to: 500000,
      colorClass: 'bg-teal-500',
    });
  }

  slabTiers.push({
    label: '₹5,00,001 - ₹10,00,000',
    rateLabel: '20%',
    rate: 0.20,
    from: 500000,
    to: 1000000,
    colorClass: 'bg-blue-500',
  });

  slabTiers.push({
    label: 'Above ₹10,00,000',
    rateLabel: '30%',
    rate: 0.30,
    from: 1000000,
    to: null,
    colorClass: 'bg-rose-500',
  });

  let remaining = slabTaxableIncome;
  let baseTaxOnSlabs = 0;
  const slabBreakdown: SlabTierSegment[] = [];

  for (const tier of slabTiers) {
    if (remaining <= 0 && tier.from > 0) {
      slabBreakdown.push({
        ...tier,
        taxableAmount: 0,
        taxAmount: 0,
        percentOfTotal: 0,
      });
      continue;
    }

    const tierBand = tier.to ? tier.to - tier.from : remaining;
    const taxableInTier = Math.max(0, Math.min(remaining, tierBand));
    const taxInTier = taxableInTier * tier.rate;
    baseTaxOnSlabs += taxInTier;
    remaining = Math.max(0, remaining - taxableInTier);

    const percentOfTotal = slabTaxableIncome > 0 ? (taxableInTier / slabTaxableIncome) * 100 : 0;
    slabBreakdown.push({
      ...tier,
      taxableAmount: taxableInTier,
      taxAmount: taxInTier,
      percentOfTotal: Number(percentOfTotal.toFixed(1)),
    });
  }

  const totalBaseTax = baseTaxOnSlabs + specialRateTax;

  // Section 87A Rebate (Old Regime threshold: ₹5,00,000)
  let sec87aRebate = 0;
  if (slabTaxableIncome <= 500000) {
    sec87aRebate = Math.min(totalBaseTax, 12500);
  }

  const taxAfterRebateAndRelief = Math.max(0, totalBaseTax - sec87aRebate);

  // Surcharges in Old Regime (scales up to 37% above ₹5 Crores)
  let surchargeRate = 0;
  let surchargeAmount = 0;
  let surchargeMarginalRelief = 0;

  if (netTaxableIncome > 50000000) {
    surchargeRate = 0.37;
    surchargeAmount = taxAfterRebateAndRelief * 0.37;
  } else if (netTaxableIncome > 20000000) {
    surchargeRate = 0.25;
    surchargeAmount = taxAfterRebateAndRelief * 0.25;
  } else if (netTaxableIncome > 10000000) {
    surchargeRate = 0.15;
    surchargeAmount = taxAfterRebateAndRelief * 0.15;
  } else if (netTaxableIncome > 5000000) {
    surchargeRate = 0.10;
    surchargeAmount = taxAfterRebateAndRelief * 0.10;
  }

  const taxAfterSurcharge = taxAfterRebateAndRelief + surchargeAmount;
  const healthAndEducationCess = Math.round(taxAfterSurcharge * 0.04);
  const totalTaxPayable = Math.round(taxAfterSurcharge + healthAndEducationCess);
  const netPayableOrRefund = totalTaxPayable - (inputs.tdsAdvanceTaxPaid || 0);

  const effectiveTaxRate = grossIncome > 0 ? Number(((totalTaxPayable / grossIncome) * 100).toFixed(2)) : 0;
  const marginalTaxRate = slabTaxableIncome > 1000000 ? 30 : slabTaxableIncome > 500000 ? 20 : slabTaxableIncome > basicExemptionLimit ? 5 : 0;

  const monthlyTaxTds = Math.round(totalTaxPayable / 12);
  const monthlyTakeHome = Math.round((grossIncome - totalTaxPayable) / 12);

  return {
    regime: 'old',
    regimeName: 'Old Tax Regime',
    grossIncome,
    standardDeduction,
    hraExemption,
    homeLoanInterestDeduction,
    chapterVIADeductions,
    totalDeductionsAndExemptions,
    netTaxableIncome,
    slabTaxableIncome,
    baseTaxOnSlabs,
    specialRateTax,
    totalBaseTax,
    slabBreakdown,
    sec87aRebate,
    marginalReliefSec87A: 0,
    taxAfterRebateAndRelief,
    surchargeRate,
    surchargeAmount,
    surchargeMarginalRelief,
    taxAfterSurcharge,
    healthAndEducationCess,
    totalTaxPayable,
    netPayableOrRefund,
    effectiveTaxRate,
    marginalTaxRate,
    monthlyTakeHome,
    monthlyTaxTds,
  };
}

/**
 * Executes simultaneous dual comparison calculation
 */
export function compareOldVsNewRegimes(inputs: OldVsNewInputs): OldVsNewComparisonResult {
  const newRegime = calculateNewRegime2026(inputs);
  const oldRegime = calculateOldRegime(inputs);

  const diff = oldRegime.totalTaxPayable - newRegime.totalTaxPayable;
  let winningRegime: 'new' | 'old' | 'equal' = 'equal';
  let winningRegimeName = 'Both Regimes Equal';
  let annualSavings = 0;

  if (diff > 0) {
    winningRegime = 'new';
    winningRegimeName = 'New Tax Regime';
    annualSavings = diff;
  } else if (diff < 0) {
    winningRegime = 'old';
    winningRegimeName = 'Old Tax Regime';
    annualSavings = Math.abs(diff);
  }

  const monthlySavings = Math.round(annualSavings / 12);
  const benchmark = Math.max(newRegime.totalTaxPayable, oldRegime.totalTaxPayable);
  const savingsPercentage = benchmark > 0 ? Number(((annualSavings / benchmark) * 100).toFixed(1)) : 0;

  // Approximate additional deductions needed in Old Regime to beat New Regime
  let breakEvenDeductionsNeeded = 0;
  if (winningRegime === 'new' && annualSavings > 0) {
    const marginalRate = oldRegime.marginalTaxRate > 0 ? oldRegime.marginalTaxRate / 100 : 0.20;
    breakEvenDeductionsNeeded = Math.round(annualSavings / marginalRate);
  }

  return {
    newRegime,
    oldRegime,
    winningRegime,
    winningRegimeName,
    annualSavings,
    monthlySavings,
    savingsPercentage,
    breakEvenDeductionsNeeded,
    differenceAmount: Math.abs(diff),
  };
}
