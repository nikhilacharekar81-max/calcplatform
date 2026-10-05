import Decimal from "decimal.js";
import { roundMoney } from "../../../engines/financial-maths/index.ts";

export type AssetCategory =
  | 'listed_equity'
  | 'real_estate'
  | 'debt_mutual_funds'
  | 'unlisted_shares'
  | 'gold_jewelry';

export interface ComprehensiveCapitalGainsInput {
  assetCategory: AssetCategory;
  salePrice: number;
  transferExpenses?: number;
  purchasePrice: number;
  purchaseDate: string;
  saleDate: string;
  // Grandfathering (Sec 112A)
  applyGrandfathering?: boolean;
  jan312018Fmv?: number;
  // Real Estate Indexation & Acquisition Date check
  acquisitionBeforeJuly24?: boolean;
  indexedCostOfAcquisition?: number;
  // Improvements
  improvementCost?: number;
  // Loss Set-offs
  broughtForwardStcl?: number;
  broughtForwardLtcl?: number;
  // Reinvestments (Sec 54 / 54F / 54EC)
  reinvestmentSec54?: number;
  // Tax Payer Income Slab (for STCG / Debt funds slab taxation)
  annualOtherIncome?: number;
}

export interface ComprehensiveCapitalGainsResult {
  holdingDays: number;
  isShortTerm: boolean;
  netSaleConsideration: number;
  effectiveCoa: number;
  rawCapitalGain: number;
  currentStcg: number;
  currentLtcg: number;
  taxableStcg: number;
  taxableLtcg: number;
  stcgOffset: number;
  stcgOffsetLtcg: number;
  ltclOffsetLtcg: number;
  remainingStcl: number;
  remainingLtcl: number;
  exemptionClaimed: number;
  netTaxableLtcgAfterExemption: number;
  realEstateOptionUsed?: string;
  baseTax: number;
  surcharge: number;
  cess: number;
  totalTaxLiability: number;
  unabsorbedStcl: number;
  unabsorbedLtcl: number;
}

/**
 * Statutory Income-tax Act Capital Gains Computation Engine (FY 2026-27)
 */
export function calculateStatutoryCapitalGains(
  input: ComprehensiveCapitalGainsInput
): ComprehensiveCapitalGainsResult {
  const transferExpenses = Math.max(0, input.transferExpenses ?? 0);
  const improvementCost = Math.max(0, input.improvementCost ?? 0);
  const broughtForwardStcl = Math.max(0, input.broughtForwardStcl ?? 0);
  const broughtForwardLtcl = Math.max(0, input.broughtForwardLtcl ?? 0);
  const reinvestmentSec54 = Math.max(0, input.reinvestmentSec54 ?? 0);
  const annualOtherIncome = Math.max(0, input.annualOtherIncome ?? 0);

  const pDate = new Date(input.purchaseDate);
  const sDate = new Date(input.saleDate);

  let holdingDays = 0;
  if (!isNaN(pDate.getTime()) && !isNaN(sDate.getTime())) {
    const diffTime = sDate.getTime() - pDate.getTime();
    holdingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Determine Short-Term vs Long-Term Holding Period
  let shortTerm = true;
  if (!isNaN(pDate.getTime()) && !isNaN(sDate.getTime())) {
    const diffMonths = (sDate.getFullYear() - pDate.getFullYear()) * 12 + (sDate.getMonth() - pDate.getMonth());
    const isPastDay = sDate.getDate() >= pDate.getDate();
    const monthsHeld = isPastDay ? diffMonths : diffMonths - 1;

    switch (input.assetCategory) {
      case 'listed_equity':
        shortTerm = monthsHeld < 12;
        break;
      case 'real_estate':
        shortTerm = monthsHeld < 24;
        break;
      case 'debt_mutual_funds':
        // Post April 1, 2023: Specified mutual funds taxed as short-term under Sec 50AA
        if (pDate < new Date('2023-04-01')) {
          shortTerm = monthsHeld < 36;
        } else {
          shortTerm = true;
        }
        break;
      case 'unlisted_shares':
      case 'gold_jewelry':
        shortTerm = monthsHeld < 24;
        break;
      default:
        shortTerm = monthsHeld < 36;
    }
  }

  const netSaleConsideration = Math.max(0, input.salePrice - transferExpenses);

  // Compute Cost of Acquisition (CoA) considering Section 112A Grandfathering
  let effectiveCoa = input.purchasePrice + improvementCost;
  if (!shortTerm && input.assetCategory === 'listed_equity' && input.applyGrandfathering) {
    if (pDate < new Date('2018-01-31')) {
      const fmv = input.jan312018Fmv ?? 0;
      const minVal = Math.min(fmv, input.salePrice);
      const legalCoa = Math.max(input.purchasePrice, minVal);
      effectiveCoa = legalCoa + improvementCost;
    }
  }

  const rawCapitalGain = netSaleConsideration - effectiveCoa;
  const currentStcg = shortTerm ? rawCapitalGain : 0;
  const currentLtcg = !shortTerm ? rawCapitalGain : 0;

  let taxableStcg = Math.max(0, currentStcg);
  let taxableLtcg = Math.max(0, currentLtcg);

  let remainingStcl = broughtForwardStcl;
  let remainingLtcl = broughtForwardLtcl;

  let stcgOffset = 0;
  let stcgOffsetLtcg = 0;
  let ltclOffsetLtcg = 0;

  // Offset STCG with STCL first
  if (taxableStcg > 0 && remainingStcl > 0) {
    stcgOffset = Math.min(taxableStcg, remainingStcl);
    taxableStcg -= stcgOffset;
    remainingStcl -= stcgOffset;
  }

  // Remaining STCL can offset LTCG
  if (taxableLtcg > 0 && remainingStcl > 0) {
    stcgOffsetLtcg = Math.min(taxableLtcg, remainingStcl);
    taxableLtcg -= stcgOffsetLtcg;
    remainingStcl -= stcgOffsetLtcg;
  }

  // LTCL offsets LTCG
  if (taxableLtcg > 0 && remainingLtcl > 0) {
    ltclOffsetLtcg = Math.min(taxableLtcg, remainingLtcl);
    taxableLtcg -= ltclOffsetLtcg;
    remainingLtcl -= ltclOffsetLtcg;
  }

  // Section 54 / 54F / 54EC Reinvestment Exemptions (Capped at ₹10 Cr / ₹50 Lakh)
  let exemptionClaimed = 0;
  if (!shortTerm && reinvestmentSec54 > 0) {
    const cappedReinvestment = Math.min(reinvestmentSec54, 100000000); // 10 Cr cap
    if (input.assetCategory === 'real_estate') {
      exemptionClaimed = Math.min(taxableLtcg, cappedReinvestment);
    } else {
      if (netSaleConsideration > 0) {
        exemptionClaimed = (taxableLtcg * cappedReinvestment) / netSaleConsideration;
        exemptionClaimed = Math.min(taxableLtcg, exemptionClaimed);
      }
    }
  }

  const netTaxableLtcgAfterExemption = Math.max(0, taxableLtcg - exemptionClaimed);

  // Real Estate Dual Option (Acquired before July 23, 2024)
  let realEstateOptionUsed: string | undefined = undefined;
  let finalLtcgTaxableForRealEstate = netTaxableLtcgAfterExemption;

  const postJuly24 = !isNaN(sDate.getTime()) && sDate >= new Date('2024-07-23');

  if (input.assetCategory === 'real_estate' && !shortTerm && input.acquisitionBeforeJuly24 && postJuly24) {
    realEstateOptionUsed = 'Option A (12.5% Flat without Indexation)';
    const indexedCost = (input.indexedCostOfAcquisition ?? input.purchasePrice) + improvementCost;
    const indexedGain = Math.max(0, netSaleConsideration - indexedCost);
    const remainingIndexedGain = Math.max(0, indexedGain - exemptionClaimed - ltclOffsetLtcg - stcgOffsetLtcg);

    const taxOptionA = netTaxableLtcgAfterExemption * 0.125;
    const taxOptionB = remainingIndexedGain * 0.20;

    if (taxOptionB < taxOptionA) {
      realEstateOptionUsed = 'Option B (20% with CII Indexation)';
      finalLtcgTaxableForRealEstate = remainingIndexedGain;
    }
  }

  // Calculate Base Tax
  let baseTax = 0;
  if (shortTerm) {
    if (input.assetCategory === 'listed_equity') {
      baseTax = taxableStcg * 0.20; // Sec 111A 20%
    } else {
      // Slab rate for non-equity short-term
      const totalIncome = annualOtherIncome + taxableStcg;
      const calculateSlabTax = (income: number) => {
        if (income <= 400000) return 0;
        if (income <= 800000) return (income - 400000) * 0.05;
        if (income <= 1200000) return 20000 + (income - 800000) * 0.10;
        if (income <= 1600000) return 60000 + (income - 1200000) * 0.15;
        if (income <= 2000000) return 120000 + (income - 1600000) * 0.20;
        if (income <= 2400000) return 200000 + (income - 2000000) * 0.25;
        return 300000 + (income - 2400000) * 0.30;
      };

      const taxTotal = calculateSlabTax(totalIncome);
      const taxOther = calculateSlabTax(annualOtherIncome);
      baseTax = Math.max(0, taxTotal - taxOther);
    }
  } else {
    // Long-Term Capital Gains
    if (input.assetCategory === 'listed_equity') {
      const exemptionLimit = postJuly24 ? 125000 : 100000;
      const rate = postJuly24 ? 0.125 : 0.10;
      const taxableOverExemption = Math.max(0, netTaxableLtcgAfterExemption - exemptionLimit);
      baseTax = taxableOverExemption * rate;
    } else if (input.assetCategory === 'real_estate') {
      if (input.acquisitionBeforeJuly24 && postJuly24 && realEstateOptionUsed?.includes('Option B')) {
        baseTax = finalLtcgTaxableForRealEstate * 0.20;
      } else {
        const rate = postJuly24 ? 0.125 : 0.20;
        baseTax = netTaxableLtcgAfterExemption * rate;
      }
    } else {
      const rate = postJuly24 ? 0.125 : 0.20;
      baseTax = netTaxableLtcgAfterExemption * rate;
    }
  }

  // Surcharge (15% cap on capital gains)
  const totalIncomeForSurcharge = annualOtherIncome + taxableStcg + netTaxableLtcgAfterExemption;
  let surchargeRate = 0;
  if (totalIncomeForSurcharge > 20000000) surchargeRate = 0.15;
  else if (totalIncomeForSurcharge > 10000000) surchargeRate = 0.15;
  else if (totalIncomeForSurcharge > 5000000) surchargeRate = 0.10;

  const surcharge = baseTax * surchargeRate;
  const cess = (baseTax + surcharge) * 0.04;
  const totalTaxLiability = Math.round((baseTax + surcharge + cess) / 10) * 10;

  const currentYearStcl = currentStcg < 0 ? Math.abs(currentStcg) : 0;
  const currentYearLtcl = currentLtcg < 0 ? Math.abs(currentLtcg) : 0;
  const unabsorbedStcl = remainingStcl + currentYearStcl;
  const unabsorbedLtcl = remainingLtcl + currentYearLtcl;

  return {
    holdingDays,
    isShortTerm: shortTerm,
    netSaleConsideration: roundMoney(netSaleConsideration),
    effectiveCoa: roundMoney(effectiveCoa),
    rawCapitalGain: roundMoney(rawCapitalGain),
    currentStcg: roundMoney(currentStcg),
    currentLtcg: roundMoney(currentLtcg),
    taxableStcg: roundMoney(taxableStcg),
    taxableLtcg: roundMoney(taxableLtcg),
    stcgOffset: roundMoney(stcgOffset),
    stcgOffsetLtcg: roundMoney(stcgOffsetLtcg),
    ltclOffsetLtcg: roundMoney(ltclOffsetLtcg),
    remainingStcl: roundMoney(remainingStcl),
    remainingLtcl: roundMoney(remainingLtcl),
    exemptionClaimed: roundMoney(exemptionClaimed),
    netTaxableLtcgAfterExemption: roundMoney(netTaxableLtcgAfterExemption),
    realEstateOptionUsed,
    baseTax: roundMoney(baseTax),
    surcharge: roundMoney(surcharge),
    cess: roundMoney(cess),
    totalTaxLiability,
    unabsorbedStcl: roundMoney(unabsorbedStcl),
    unabsorbedLtcl: roundMoney(unabsorbedLtcl),
  };
}

// -------------------------------------------------------------
// Legacy Compatibility Adapter (Preserves { gain, taxableGain, tax, netGain })
// -------------------------------------------------------------

export interface CapitalGainInput {
  saleValue: string | Decimal | number;
  cost: string | Decimal | number;
  rate: string | Decimal | number;
}

export interface LegacyCapitalGainResult {
  gain: Decimal;
  taxableGain: Decimal;
  tax: Decimal;
  netGain: Decimal;
}

/**
 * Adapter mapping legacy caller contracts to canonical calculation engine
 */
export function calculateCapitalGain(input: CapitalGainInput): LegacyCapitalGainResult {
  const saleVal = new Decimal(input.saleValue);
  const costVal = new Decimal(input.cost);
  const rateVal = new Decimal(input.rate);

  const gain = saleVal.minus(costVal);
  const taxableGain = Decimal.max(gain, 0);
  const tax = taxableGain.mul(rateVal).div(100);

  return {
    gain,
    taxableGain,
    tax,
    netGain: gain.minus(tax),
  };
}

