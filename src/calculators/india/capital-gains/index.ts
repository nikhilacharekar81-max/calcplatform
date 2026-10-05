import Decimal from "decimal.js";
import { roundMoney, compareMoney, isMonetaryLessOrEqual, isMonetaryExceeded } from "../../../engines/financial-maths/index.ts";
import { computeHoldingPeriodDaysAndMonths } from "../../../utils/dateUtils.ts";

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
  // Tax Payer Income Slab & Standalone Context
  annualOtherIncome?: number;
  baseIncome?: number;
  taxpayerCategory?: 'INDIVIDUAL' | 'HUF' | 'COMPANY' | 'FIRM';
  isStandaloneEstimate?: boolean;
  allowBasicExemptionAbsorption?: boolean;
}

export interface ComprehensiveCapitalGainsResult {
  assetCategory: AssetCategory;
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
  baseTaxRounded?: number;
  surchargeRounded?: number;
  cessRounded?: number;
  baseTaxFormatted?: string;
  surchargeFormatted?: string;
  cessFormatted?: string;
  totalTaxLiabilityFormatted?: string;
  unabsorbedStcl: number;
  unabsorbedLtcl: number;
  isStandaloneEstimate: boolean;
  basicExemptionAssumed: boolean;
}

/**
 * Statutory Income-tax Act Capital Gains Computation Engine (FY 2026-27 / AY 2027-28)
 */
export function calculateStatutoryCapitalGains(
  input: ComprehensiveCapitalGainsInput
): ComprehensiveCapitalGainsResult {
  const transferExpenses = Math.max(0, input.transferExpenses ?? 0);
  const improvementCost = Math.max(0, input.improvementCost ?? 0);
  const broughtForwardStcl = Math.max(0, input.broughtForwardStcl ?? 0);
  const broughtForwardLtcl = Math.max(0, input.broughtForwardLtcl ?? 0);
  const annualOtherIncome = Math.max(0, input.baseIncome ?? input.annualOtherIncome ?? 0);
  const isStandalone = input.isStandaloneEstimate ?? true;
  const allowAbsorption = input.allowBasicExemptionAbsorption ?? false;

  const pDate = new Date(input.purchaseDate);
  const sDate = new Date(input.saleDate);

  const holdingInfo = computeHoldingPeriodDaysAndMonths(pDate, sDate);
  const holdingDays = holdingInfo.holdingDays;

  // Determine Short-Term vs Long-Term Holding Period using exact statutory rules
  let shortTerm = true;
  if (!isNaN(pDate.getTime()) && !isNaN(sDate.getTime())) {
    switch (input.assetCategory) {
      case 'listed_equity':
        shortTerm = holdingInfo.isShortTerm.equity;
        break;
      case 'real_estate':
        shortTerm = holdingInfo.isShortTerm.realEstate;
        break;
      case 'debt_mutual_funds':
        shortTerm = holdingInfo.isShortTerm.debtFund;
        break;
      case 'unlisted_shares':
        shortTerm = holdingInfo.isShortTerm.unlisted;
        break;
      case 'gold_jewelry':
        shortTerm = holdingInfo.isShortTerm.gold;
        break;
      default:
        shortTerm = holdingInfo.isShortTerm.other;
    }
  }

  const netSaleConsideration = Math.max(0, input.salePrice - transferExpenses);

  // Compute Cost of Acquisition (CoA)
  let indexedCoa = input.purchasePrice + improvementCost;
  if (!shortTerm && input.assetCategory === 'real_estate' && input.indexedCostOfAcquisition) {
    indexedCoa = input.indexedCostOfAcquisition + improvementCost;
  }

  let effectiveCoa = input.purchasePrice + improvementCost;
  if (!shortTerm && input.assetCategory === 'listed_equity' && input.applyGrandfathering) {
    if (pDate < new Date('2018-01-31')) {
      const fmv = input.jan312018Fmv ?? 0;
      const minVal = Math.min(fmv, input.salePrice);
      const legalCoa = Math.max(input.purchasePrice, minVal);
      effectiveCoa = legalCoa + improvementCost;
    }
  }

  const postJuly24 = sDate >= new Date('2024-07-23');
  let realEstateOptionUsed: string | undefined = undefined;

  // Real estate Option A (20% with indexation) vs Option B (12.5% without indexation) selection logic
  if (!shortTerm && input.assetCategory === 'real_estate') {
    if (input.acquisitionBeforeJuly24 && postJuly24) {
      const optionAIndexedGain = Math.max(0, netSaleConsideration - indexedCoa);
      const optionATaxEstimate = optionAIndexedGain * 0.20;

      const unindexedCoa = input.purchasePrice + improvementCost;
      const optionBUnindexedGain = Math.max(0, netSaleConsideration - unindexedCoa);
      const optionBTaxEstimate = optionBUnindexedGain * 0.125;

      if (isMonetaryLessOrEqual(optionBTaxEstimate, optionATaxEstimate)) {
        realEstateOptionUsed = 'Option B (12.5% without indexation)';
        effectiveCoa = unindexedCoa;
      } else {
        realEstateOptionUsed = 'Option A (20% with indexation)';
        effectiveCoa = indexedCoa;
      }
    } else if (postJuly24) {
      effectiveCoa = input.purchasePrice + improvementCost;
    } else {
      effectiveCoa = indexedCoa;
    }
  }

  const rawCapitalGain = netSaleConsideration - effectiveCoa;
  
  const currentStcg = shortTerm ? rawCapitalGain : 0;
  const currentLtcg = !shortTerm ? rawCapitalGain : 0;

  let taxableStcg = 0;
  let taxableLtcg = 0;
  let unabsorbedStcl = broughtForwardStcl;
  let unabsorbedLtcl = broughtForwardLtcl;

  let stcgOffset = 0;
  let stcgOffsetLtcg = 0;
  let ltclOffsetLtcg = 0;

  if (currentStcg < 0) {
    unabsorbedStcl += Math.abs(currentStcg);
    taxableStcg = 0;
  } else {
    if (unabsorbedStcl > 0) {
      stcgOffset = Math.min(currentStcg, unabsorbedStcl);
      taxableStcg = currentStcg - stcgOffset;
      unabsorbedStcl -= stcgOffset;
    } else {
      taxableStcg = currentStcg;
    }
  }

  if (currentLtcg < 0) {
    unabsorbedLtcl += Math.abs(currentLtcg);
    taxableLtcg = 0;
  } else {
    taxableLtcg = currentLtcg;
  }

  // Inter-head set-off
  if (unabsorbedStcl > 0 && taxableLtcg > 0) {
    stcgOffsetLtcg = Math.min(taxableLtcg, unabsorbedStcl);
    taxableLtcg -= stcgOffsetLtcg;
    unabsorbedStcl -= stcgOffsetLtcg;
  }
  if (unabsorbedLtcl > 0 && taxableLtcg > 0) {
    ltclOffsetLtcg = Math.min(taxableLtcg, unabsorbedLtcl);
    taxableLtcg -= ltclOffsetLtcg;
    unabsorbedLtcl -= ltclOffsetLtcg;
  }

  // Exemptions Sec 54, 54F, 54EC
  const sec54Cap = 100000000; // ₹10 Crore
  const sec54EcCap = 5000000;  // ₹50 Lakhs

  const exemptionSec54 = Math.min(input.assetCategory === 'real_estate' && !shortTerm ? taxableLtcg : 0, Math.min(input.reinvestmentSec54 ?? 0, sec54Cap));
  const exemptionSec54F = Math.min(input.assetCategory !== 'real_estate' && !shortTerm ? taxableLtcg : 0, Math.min(input.reinvestmentSec54F ?? 0, sec54Cap));
  const exemptionSec54EC = Math.min(taxableLtcg, Math.min(input.reinvestmentSec54EC ?? 0, sec54EcCap));

  const totalExemptionClaimed = Math.min(taxableLtcg, exemptionSec54 + exemptionSec54F + exemptionSec54EC);
  const netTaxableLtcgAfterExemption = Math.max(0, taxableLtcg - totalExemptionClaimed);

  let baseTax = 0;

  // Standalone mode / basic exemption absorption handling
  let effectiveOtherIncome = annualOtherIncome;
  if (isStandalone && allowAbsorption && effectiveOtherIncome === 0) {
    const basicExemption = 400000; // New Regime FY 2026-27 basic exemption limit
    effectiveOtherIncome = -basicExemption; // unexhausted basic exemption available for absorption
  }

  if (shortTerm) {
    if (input.assetCategory === 'listed_equity') {
      baseTax = taxableStcg * 0.20; // Sec 111A
    } else {
      const totalIncome = Math.max(0, effectiveOtherIncome + taxableStcg);
      const calculateSlabTax = (income: number) => {
        if (isMonetaryLessOrEqual(income, 400000)) return 0;
        if (isMonetaryLessOrEqual(income, 800000)) return (income - 400000) * 0.05;
        if (isMonetaryLessOrEqual(income, 1200000)) return 20000 + (income - 800000) * 0.10;
        if (isMonetaryLessOrEqual(income, 1600000)) return 60000 + (income - 1200000) * 0.15;
        if (isMonetaryLessOrEqual(income, 2000000)) return 120000 + (income - 1600000) * 0.20;
        if (isMonetaryLessOrEqual(income, 2400000)) return 200000 + (income - 2000000) * 0.25;
        return 300000 + (income - 2400000) * 0.30;
      };
      const taxTotal = calculateSlabTax(totalIncome);
      const taxOther = calculateSlabTax(Math.max(0, effectiveOtherIncome));
      baseTax = Math.max(0, taxTotal - taxOther);
    }
  } else {
    if (input.assetCategory === 'listed_equity') {
      const exemptionLimit = postJuly24 ? 125000 : 100000;
      const rate = postJuly24 ? 0.125 : 0.10;
      const taxableOverExemption = Math.max(0, netTaxableLtcgAfterExemption - exemptionLimit);
      baseTax = taxableOverExemption * rate;
    } else if (input.assetCategory === 'real_estate') {
      if (input.acquisitionBeforeJuly24 && postJuly24) {
        if (realEstateOptionUsed?.includes('Option B')) {
          // Option B: 12.5% without indexation
          const unindexedGain = Math.max(0, netSaleConsideration - (input.purchasePrice + improvementCost) - totalExemptionClaimed);
          baseTax = unindexedGain * 0.125;
        } else {
          // Option A: 20% with indexation
          const indexedGain = Math.max(0, netSaleConsideration - indexedCoa - totalExemptionClaimed);
          baseTax = indexedGain * 0.20;
        }
      } else if (postJuly24) {
        baseTax = netTaxableLtcgAfterExemption * 0.125;
      } else {
        baseTax = netTaxableLtcgAfterExemption * 0.20;
      }
    } else {
      const rate = postJuly24 ? 0.125 : 0.20;
      baseTax = netTaxableLtcgAfterExemption * rate;
    }
  }

  const totalIncomeForSurcharge = annualOtherIncome + taxableStcg + netTaxableLtcgAfterExemption;
  let surchargeRate = 0;
  if (isMonetaryExceeded(totalIncomeForSurcharge, 20000000)) {
    surchargeRate = (shortTerm && input.assetCategory !== 'listed_equity') ? 0.25 : 0.15;
  } else if (isMonetaryExceeded(totalIncomeForSurcharge, 10000000)) {
    surchargeRate = 0.15;
  } else if (isMonetaryExceeded(totalIncomeForSurcharge, 5000000)) {
    surchargeRate = 0.10;
  }

  const surcharge = baseTax * surchargeRate;
  const cess = (baseTax + surcharge) * 0.04;
  const totalTaxLiability = Math.round((baseTax + surcharge + cess) / 10) * 10;

  return {
    assetCategory: input.assetCategory,
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
    baseTax,
    surcharge,
    cess,
    totalTaxLiability,
    baseTaxRounded: Math.round(baseTax),
    surchargeRounded: Math.round(surcharge),
    cessRounded: Math.round(cess),
    baseTaxFormatted: `₹${Math.round(baseTax).toLocaleString('en-IN')}`,
    surchargeFormatted: `₹${Math.round(surcharge).toLocaleString('en-IN')}`,
    cessFormatted: `₹${Math.round(cess).toLocaleString('en-IN')}`,
    totalTaxLiabilityFormatted: `₹${totalTaxLiability.toLocaleString('en-IN')}`,
    unabsorbedStcl: roundMoney(unabsorbedStcl),
    unabsorbedLtcl: roundMoney(unabsorbedLtcl),
    isStandaloneEstimate: isStandalone,
    basicExemptionAssumed: allowAbsorption,
  };
}

export interface CapitalGainInput {
  saleValue: string | Decimal | number;
  cost: string | Decimal | number;
  rate?: string | Decimal | number;
  isStandaloneEstimate?: boolean;
  allowBasicExemptionAbsorption?: boolean;
  baseIncome?: number;
  annualOtherIncome?: number;
  assetCategory?: AssetCategory;
  purchaseDate?: string;
  saleDate?: string;
  acquisitionBeforeJuly24?: boolean;
  indexedCostOfAcquisition?: number;
  improvementCost?: number;
  transferExpenses?: number;
  applyGrandfathering?: boolean;
  jan312018Fmv?: number;
  broughtForwardStcl?: number;
  broughtForwardLtcl?: number;
  reinvestmentSec54?: number;
  reinvestmentSec54F?: number;
  reinvestmentSec54EC?: number;
}

export interface LegacyCapitalGainResult {
  gain: Decimal;
  taxableGain: Decimal;
  tax: Decimal;
  netGain: Decimal;
  isStandaloneEstimate: boolean;
  basicExemptionAssumed: boolean;
  canonicalDetails: ComprehensiveCapitalGainsResult;
}

export function calculateCapitalGain(input: CapitalGainInput): LegacyCapitalGainResult {
  const saleVal = new Decimal(input.saleValue);
  const costVal = new Decimal(input.cost);
  const rateVal = input.rate !== undefined && input.rate !== null ? new Decimal(input.rate) : null;
  const isStandalone = input.isStandaloneEstimate ?? true;
  const allowAbsorption = input.allowBasicExemptionAbsorption ?? false;

  const canonicalResult = calculateStatutoryCapitalGains({
    assetCategory: input.assetCategory ?? 'listed_equity',
    salePrice: saleVal.toNumber(),
    purchasePrice: costVal.toNumber(),
    purchaseDate: input.purchaseDate ?? '2023-01-01',
    saleDate: input.saleDate ?? '2026-06-01',
    isStandaloneEstimate: isStandalone,
    allowBasicExemptionAbsorption: allowAbsorption,
    baseIncome: input.baseIncome ?? input.annualOtherIncome,
    acquisitionBeforeJuly24: input.acquisitionBeforeJuly24,
    indexedCostOfAcquisition: input.indexedCostOfAcquisition,
    improvementCost: input.improvementCost,
    transferExpenses: input.transferExpenses,
    applyGrandfathering: input.applyGrandfathering,
    jan312018Fmv: input.jan312018Fmv,
    broughtForwardStcl: input.broughtForwardStcl,
    broughtForwardLtcl: input.broughtForwardLtcl,
    reinvestmentSec54: input.reinvestmentSec54,
    reinvestmentSec54F: input.reinvestmentSec54F,
    reinvestmentSec54EC: input.reinvestmentSec54EC,
  });

  const gain = new Decimal(canonicalResult.rawCapitalGain);
  const taxableGain = new Decimal(Math.max(0, canonicalResult.rawCapitalGain));
  const tax = rateVal !== null
    ? taxableGain.mul(rateVal).div(100)
    : new Decimal(canonicalResult.totalTaxLiability);

  return {
    gain,
    taxableGain,
    tax,
    netGain: gain.minus(tax),
    isStandaloneEstimate: isStandalone,
    basicExemptionAssumed: allowAbsorption,
    canonicalDetails: canonicalResult,
  };
}
