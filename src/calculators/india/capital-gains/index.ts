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
  // Brought forward loss set-offs
  broughtForwardStcl?: number;
  broughtForwardLtcl?: number;
  // Reinvestments (Separated Sec 54 / 54F / 54EC)
  reinvestmentSec54?: number; // Residential House (Sec 54) - Max ₹10 Cr
  reinvestmentSec54F?: number; // Residential House for non-residential asset (Sec 54F) - Max ₹10 Cr
  reinvestmentSec54EC?: number; // Specified Bonds (Sec 54EC) - Max ₹50 Lakh
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
  exemptionSec54: number;
  exemptionSec54F: number;
  exemptionSec54EC: number;
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
  
  // Step 1: Preserve signed current-year gains/losses before set-off
  const currentStcg = shortTerm ? rawCapitalGain : 0;
  const currentLtcg = !shortTerm ? rawCapitalGain : 0;

  let taxableStcg = 0;
  let taxableLtcg = 0;
  let unabsorbedStcl = broughtForwardStcl;
  let unabsorbedLtcl = broughtForwardLtcl;

  let stcgOffset = 0;
  let stcgOffsetLtcg = 0;
  let ltclOffsetLtcg = 0;

  // Step 2: Perform statutory loss set-offs
  if (currentStcg < 0) {
    // Current year STCL accumulates into unabsorbed STCL
    unabsorbedStcl += Math.abs(currentStcg);
    taxableStcg = 0;
  } else {
    // Current year positive STCG: offset with brought-forward STCL
    if (unabsorbedStcl > 0) {
      stcgOffset = Math.min(currentStcg, unabsorbedStcl);
      taxableStcg = currentStcg - stcgOffset;
      unabsorbedStcl -= stcgOffset;
    } else {
      taxableStcg = currentStcg;
    }
  }

  if (currentLtcg < 0) {
    // Current year LTCL accumulates into unabsorbed LTCL
    unabsorbedLtcl += Math.abs(currentLtcg);
    taxableLtcg = 0;
  } else {
    // Current year positive LTCG: offset with remaining STCL first, then LTCL
    let availableLtcg = currentLtcg;
    if (unabsorbedStcl > 0) {
      stcgOffsetLtcg = Math.min(availableLtcg, unabsorbedStcl);
      availableLtcg -= stcgOffsetLtcg;
      unabsorbedStcl -= stcgOffsetLtcg;
    }
    if (availableLtcg > 0 && unabsorbedLtcl > 0) {
      ltclOffsetLtcg = Math.min(availableLtcg, unabsorbedLtcl);
      availableLtcg -= ltclOffsetLtcg;
      unabsorbedLtcl -= ltclOffsetLtcg;
    }
    taxableLtcg = availableLtcg;
  }

  // Step 3: Section 54 / 54F / 54EC Reinvestment Exemptions
  let exemptionSec54 = 0;
  let exemptionSec54F = 0;
  let exemptionSec54EC = 0;

  if (!shortTerm && taxableLtcg > 0) {
    // Section 54 (Residential house on transfer of residential house)
    if (input.reinvestmentSec54 !== undefined && input.reinvestmentSec54 > 0 && input.assetCategory === 'real_estate') {
      const capped54 = Math.min(input.reinvestmentSec54, 100000000); // ₹10 Cr cap
      exemptionSec54 = Math.min(taxableLtcg, capped54);
    }

    // Section 54F (Residential house on transfer of any long-term asset other than residential house)
    if (input.reinvestmentSec54F !== undefined && input.reinvestmentSec54F > 0 && input.assetCategory !== 'real_estate') {
      const capped54F = Math.min(input.reinvestmentSec54F, 100000000); // ₹10 Cr cap
      if (netSaleConsideration > 0) {
        exemptionSec54F = Math.min(taxableLtcg, (taxableLtcg * capped54F) / netSaleConsideration);
      }
    }

    // Section 54EC (Specified Capital Gains Bonds: NHAI / REC / PFC)
    if (input.reinvestmentSec54EC !== undefined && input.reinvestmentSec54EC > 0) {
      const capped54EC = Math.min(input.reinvestmentSec54EC, 5000000); // ₹50 Lakh statutory cap
      const remainingFor54EC = Math.max(0, taxableLtcg - exemptionSec54 - exemptionSec54F);
      exemptionSec54EC = Math.min(remainingFor54EC, capped54EC);
    }
  }

  const totalExemptionClaimed = Math.min(taxableLtcg, exemptionSec54 + exemptionSec54F + exemptionSec54EC);
  const netTaxableLtcgAfterExemption = Math.max(0, taxableLtcg - totalExemptionClaimed);

  // Step 4: Real Estate Dual Option (Acquired before July 23, 2024 & Sold on/after July 23, 2024)
  let realEstateOptionUsed: string | undefined = undefined;
  let finalLtcgTaxableForRealEstate = netTaxableLtcgAfterExemption;

  const postJuly24 = !isNaN(sDate.getTime()) && sDate >= new Date('2024-07-23');

  if (input.assetCategory === 'real_estate' && !shortTerm && input.acquisitionBeforeJuly24 && postJuly24) {
    realEstateOptionUsed = 'Option A (12.5% Flat without Indexation)';
    const indexedCost = (input.indexedCostOfAcquisition ?? input.purchasePrice) + improvementCost;
    const indexedGain = Math.max(0, netSaleConsideration - indexedCost);
    
    // Apply loss offsets and Section 54/54EC to indexed gain for fair comparison
    const remainingIndexedGain = Math.max(
      0,
      indexedGain - totalExemptionClaimed - ltclOffsetLtcg - stcgOffsetLtcg
    );

    const taxOptionA = netTaxableLtcgAfterExemption * 0.125;
    const taxOptionB = remainingIndexedGain * 0.20;

    if (taxOptionB < taxOptionA) {
      realEstateOptionUsed = 'Option B (20% with CII Indexation)';
      finalLtcgTaxableForRealEstate = remainingIndexedGain;
    }
  }

  // Step 5: Calculate Base Tax
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

  // Step 6: Surcharge Routing (15% statutory cap on special-rate capital gains under Finance Act)
  const totalIncomeForSurcharge = annualOtherIncome + taxableStcg + netTaxableLtcgAfterExemption;
  let surchargeRate = 0;
  if (totalIncomeForSurcharge > 20000000) {
    surchargeRate = (shortTerm && input.assetCategory !== 'listed_equity') ? 0.25 : 0.15;
  } else if (totalIncomeForSurcharge > 10000000) {
    surchargeRate = 0.15;
  } else if (totalIncomeForSurcharge > 5000000) {
    surchargeRate = 0.10;
  }

  const surcharge = baseTax * surchargeRate;
  const cess = (baseTax + surcharge) * 0.04;
  const totalTaxLiability = Math.round((baseTax + surcharge + cess) / 10) * 10;

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
    remainingStcl: roundMoney(unabsorbedStcl),
    remainingLtcl: roundMoney(unabsorbedLtcl),
    exemptionSec54: roundMoney(exemptionSec54),
    exemptionSec54F: roundMoney(exemptionSec54F),
    exemptionSec54EC: roundMoney(exemptionSec54EC),
    exemptionClaimed: roundMoney(totalExemptionClaimed),
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
 * UI → Capital Gains Adapter → Canonical Statutory Capital Gains Engine
 */
export function calculateCapitalGain(input: CapitalGainInput): LegacyCapitalGainResult {
  const saleVal = new Decimal(input.saleValue);
  const costVal = new Decimal(input.cost);
  const rateVal = new Decimal(input.rate);

  // Execute canonical statutory capital gains calculation
  const canonicalResult = calculateStatutoryCapitalGains({
    assetCategory: 'listed_equity',
    salePrice: saleVal.toNumber(),
    purchasePrice: costVal.toNumber(),
    purchaseDate: '2023-01-01',
    saleDate: '2026-06-01',
  });

  const gain = new Decimal(canonicalResult.rawCapitalGain);
  const taxableGain = new Decimal(Math.max(0, canonicalResult.rawCapitalGain));
  const tax = taxableGain.mul(rateVal).div(100);

  return {
    gain,
    taxableGain,
    tax,
    netGain: gain.minus(tax),
  };
}


