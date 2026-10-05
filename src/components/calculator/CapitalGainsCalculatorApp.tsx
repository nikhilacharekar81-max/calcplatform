import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  TrendingUp,
  ShieldAlert,
  FileText,
  Download,
  Printer,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  DollarSign,
  Building,
  Coins,
  Briefcase,
} from 'lucide-react';

export type AssetCategory =
  | 'listed_equity'
  | 'real_estate'
  | 'debt_mutual_funds'
  | 'unlisted_shares'
  | 'gold_jewelry';

export interface CapitalGainsInput {
  assetCategory: AssetCategory;
  salePrice: number;
  transferExpenses: number;
  purchasePrice: number;
  purchaseDate: string;
  saleDate: string;
  // Grandfathering (Sec 112A)
  applyGrandfathering: boolean;
  jan312018Fmv: number;
  // Real Estate Indexation & Acquisition Date check
  acquisitionBeforeJuly24: boolean;
  indexedCostOfAcquisition: number; // Option B CII indexed cost
  // Improvements
  improvementCost: number;
  // Loss Set-offs
  broughtForwardStcl: number;
  broughtForwardLtcl: number;
  // Reinvestments (Sec 54 / 54F / 54EC)
  reinvestmentSec54: number; // Residential house or 54EC bonds
  // Tax Payer Income Slab (for STCG / Debt funds slab taxation)
  annualOtherIncome: number;
}

export const CapitalGainsCalculatorApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parameters' | 'grandfathering' | 'losses' | 'reinvestments' | 'summary'>('parameters');

  const [input, setInput] = useState<CapitalGainsInput>({
    assetCategory: 'listed_equity',
    salePrice: 1500000,
    transferExpenses: 10000,
    purchasePrice: 500000,
    purchaseDate: '2019-05-15',
    saleDate: '2026-06-01',
    applyGrandfathering: false,
    jan312018Fmv: 750000,
    acquisitionBeforeJuly24: true,
    indexedCostOfAcquisition: 700000,
    improvementCost: 0,
    broughtForwardStcl: 0,
    broughtForwardLtcl: 0,
    reinvestmentSec54: 0,
    annualOtherIncome: 800000,
  });

  // Calculate Holding Period in Days
  const getHoldingDays = () => {
    const pDate = new Date(input.purchaseDate);
    const sDate = new Date(input.saleDate);
    if (isNaN(pDate.getTime()) || isNaN(sDate.getTime())) return 0;
    const diffTime = sDate.getTime() - pDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const holdingDays = getHoldingDays();

  // Determine STCG vs LTCG based on Asset Class & Holding Period
  const isShortTerm = () => {
    const pDate = new Date(input.purchaseDate);
    const sDate = new Date(input.saleDate);
    if (isNaN(pDate.getTime()) || isNaN(sDate.getTime())) return true;
    
    // Exact month-based calculation to avoid day-count edge cases
    const diffMonths = (sDate.getFullYear() - pDate.getFullYear()) * 12 + (sDate.getMonth() - pDate.getMonth());
    const isPastDay = sDate.getDate() >= pDate.getDate();
    const monthsHeld = isPastDay ? diffMonths : diffMonths - 1;

    switch (input.assetCategory) {
      case 'listed_equity':
        return monthsHeld < 12;
      case 'real_estate':
        return monthsHeld < 24;
      case 'debt_mutual_funds':
        if (pDate < new Date('2023-04-01')) return monthsHeld < 36;
        return true; 
      case 'unlisted_shares':
        return monthsHeld < 24;
      case 'gold_jewelry':
        return monthsHeld < 24;
      default:
        return monthsHeld < 36;
    }
  };

  const shortTerm = isShortTerm();

  // Net Sale Consideration
  const netSaleConsideration = Math.max(0, input.salePrice - input.transferExpenses);

  // Compute Cost of Acquisition (CoA) considering Section 112A Grandfathering if applicable
  const getEffectiveCoa = () => {
    if (shortTerm) return input.purchasePrice + input.improvementCost;

    if (input.assetCategory === 'listed_equity' && input.applyGrandfathering) {
      // Sec 112A: max(Actual Cost, min(Jan 31 2018 FMV, Full Sale Consideration))
      // Date guard: Purchase must be before Jan 31, 2018
      const pDate = new Date(input.purchaseDate);
      if (pDate < new Date('2018-01-31')) {
        const minVal = Math.min(input.jan312018Fmv, input.salePrice);
        const legalCoa = Math.max(input.purchasePrice, minVal);
        return legalCoa + input.improvementCost;
      }
    }

    return input.purchasePrice + input.improvementCost;
  };

  const effectiveCoa = getEffectiveCoa();
  // Allow rawCapitalGain to be negative (losses)
  const rawCapitalGain = netSaleConsideration - effectiveCoa;

  // Current year capital gain/loss
  const currentStcg = shortTerm ? rawCapitalGain : 0;
  const currentLtcg = !shortTerm ? rawCapitalGain : 0;

  // Taxable capital gains before brought forward loss set-offs (never negative)
  let taxableStcg = Math.max(0, currentStcg);
  let taxableLtcg = Math.max(0, currentLtcg);

  // STCL can offset both STCG and LTCG
  // LTCL can only offset LTCG
  let remainingStcl = input.broughtForwardStcl;
  let remainingLtcl = input.broughtForwardLtcl;

  let stcgOffset = 0;
  let stcgOffsetLtcg = 0;
  let ltclOffsetLtcg = 0;

  // Offset STCG with STCL first (only if taxableStcg is positive)
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

  // Apply Reinvestment Exemptions (Sec 54 / 54F / 54EC)
  // Sec 54 (House): Exemption = min(Capital Gain, Investment) - Cap 10Cr
  // Sec 54F (Other Assets): Exemption = Capital Gain * (Investment / Net Consideration) - Cap 10Cr
  // Sec 54EC (Bonds): Max 50L
  let exemptionClaimed = 0;
  if (!shortTerm) {
    // Enforcement of caps: Sec 54/54F = 10Cr, Sec 54EC = 50L
    // We assume the input field covers both, but we enforce the 10Cr aggregate cap.
    const cappedReinvestment = Math.min(input.reinvestmentSec54, 100000000); // 10 Cr cap
    
    if (input.assetCategory === 'real_estate') {
      exemptionClaimed = Math.min(Math.max(0, taxableLtcg), cappedReinvestment);
    } else {
      if (netSaleConsideration > 0) {
        exemptionClaimed = (Math.max(0, taxableLtcg) * cappedReinvestment) / netSaleConsideration;
        exemptionClaimed = Math.min(Math.max(0, taxableLtcg), exemptionClaimed);
      }
    }
    // Section 54EC cap (if specifically for bonds, usually 50L)
    // We'll apply it as an additional constraint if it looks like a bond investment.
  }
  
  const netTaxableLtcgAfterExemption = Math.max(0, taxableLtcg - exemptionClaimed);

  // Real Estate Dual Comparison (Acquired before July 23, 2024)
  let realEstateOptionUsed = 'Option A (12.5% Flat without Indexation)';
  let finalLtcgTaxableForRealEstate = netTaxableLtcgAfterExemption;

  if (input.assetCategory === 'real_estate' && !shortTerm && input.acquisitionBeforeJuly24) {
    const netSaleForIndexed = Math.max(0, input.salePrice - input.transferExpenses);
    // Indexation should also consider improvement costs (simplified as one indexed cost here)
    const indexedGain = Math.max(0, netSaleForIndexed - (input.indexedCostOfAcquisition + input.improvementCost));
    
    // Apply exemptions and losses to indexed gain too for fair comparison
    const remainingIndexedGain = Math.max(0, indexedGain - exemptionClaimed - ltclOffsetLtcg - stcgOffsetLtcg);
    
    const taxOptionA = netTaxableLtcgAfterExemption * 0.125;
    const taxOptionB = remainingIndexedGain * 0.20;

    if (taxOptionB < taxOptionA) {
      realEstateOptionUsed = 'Option B (20% with CII Indexation)';
      finalLtcgTaxableForRealEstate = remainingIndexedGain;
    }
  }

  // Calculate Tax Liability
  let baseTax = 0;

  if (shortTerm) {
    if (input.assetCategory === 'listed_equity') {
      baseTax = taxableStcg * 0.20; // STCG on listed equity under Sec 111A is 20%
    } else {
      // Slab rate taxation for non-equity assets (Gold, Property, Unlisted Shares, Debt MFs)
      const totalIncome = input.annualOtherIncome + taxableStcg;
      
      // Calculate tax on total income vs other income to find the marginal tax on STCG
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
      const taxOther = calculateSlabTax(input.annualOtherIncome);
      baseTax = Math.max(0, taxTotal - taxOther);
    }
  } else {
    // Long-Term Capital Gains
    // Date guard: July 23, 2024
    const sDate = new Date(input.saleDate);
    const postJuly24 = sDate >= new Date('2024-07-23');

    if (input.assetCategory === 'listed_equity') {
      const exemptionLimit = postJuly24 ? 125000 : 100000;
      const rate = postJuly24 ? 0.125 : 0.10;
      const exemptLtcg = Math.max(0, netTaxableLtcgAfterExemption - exemptionLimit);
      baseTax = exemptLtcg * rate;
    } else if (input.assetCategory === 'real_estate') {
      if (input.acquisitionBeforeJuly24 && postJuly24) {
        // Dual comparison only for sales on/after 23 July 2024
        if (realEstateOptionUsed.includes('Option B')) {
          baseTax = finalLtcgTaxableForRealEstate * 0.20;
        } else {
          baseTax = finalLtcgTaxableForRealEstate * 0.125;
        }
      } else {
        // Pre-July 24 or post-July 24 without dual option
        const rate = postJuly24 ? 0.125 : 0.20;
        baseTax = netTaxableLtcgAfterExemption * rate;
      }
    } else {
      const rate = postJuly24 ? 0.125 : 0.20;
      baseTax = netTaxableLtcgAfterExemption * rate;
    }
  }

  // Capital Gains Surcharge (Simplified 15% cap for CG)
  const totalIncomeForSurcharge = input.annualOtherIncome + taxableStcg + netTaxableLtcgAfterExemption;
  let surchargeRate = 0;
  if (totalIncomeForSurcharge > 20000000) surchargeRate = 0.15;
  else if (totalIncomeForSurcharge > 10000000) surchargeRate = 0.15;
  else if (totalIncomeForSurcharge > 5000000) surchargeRate = 0.10;

  const surcharge = baseTax * surchargeRate;
  const cess = (baseTax + surcharge) * 0.04;
  const totalTaxLiability = Math.round((baseTax + surcharge + cess) / 10) * 10;

  // Unabsorbed Losses Carried Forward
  const currentYearStcl = currentStcg < 0 ? Math.abs(currentStcg) : 0;
  const currentYearLtcl = currentLtcg < 0 ? Math.abs(currentLtcg) : 0;
  const unabsorbedStcl = remainingStcl + currentYearStcl;
  const unabsorbedLtcl = remainingLtcl + currentYearLtcl;

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ input, summary: { netSaleConsideration, effectiveCoa, rawCapitalGain, taxableStcg, taxableLtcg, totalTaxLiability, unabsorbedStcl, unabsorbedLtcl } }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `capital_gains_tax_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1dbf73]/20 text-[#1dbf73] text-xs font-bold uppercase tracking-wider border border-[#1dbf73]/30">
            <Coins className="w-4 h-4" />
            <span>Direct Tax Specialist &bull; FY 2026-27 Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Advanced India Capital Gains Tax Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-asset tax calculation engine featuring Sec 112A Grandfathering, Real Estate dual indexation comparisons, loss carry-forward ledgers, and Section 54/54F reinvestment exemptions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-white/20 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#1dbf73]" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONFIGURATION WIZARD (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Wizard Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto border border-slate-200">
            {[
              { id: 'parameters', label: '1. Asset & Dates' },
              { id: 'grandfathering', label: '2. Grandfathering' },
              { id: 'losses', label: '3. Loss Set-Offs' },
              { id: 'reinvestments', label: '4. Reinvestments' },
              { id: 'summary', label: '5. Final Tax' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-[#222325] shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-[#222325] hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Asset & Purchase/Sale Parameters */}
          {activeTab === 'parameters' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#1dbf73]" />
                <span>Asset Classification & Transaction Parameters</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Asset Category</label>
                  <select
                    value={input.assetCategory}
                    onChange={(e) => setInput((prev) => ({ ...prev, assetCategory: e.target.value as AssetCategory }))}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                  >
                    <option value="listed_equity">Listed Equity / Equity MFs / Business Trusts (Sec 111A / 112A)</option>
                    <option value="real_estate">Real Estate / Land & Building (Sec 112)</option>
                    <option value="debt_mutual_funds">Debt Mutual Funds & Specified MFs (Sec 50AA - Slab Rate)</option>
                    <option value="unlisted_shares">Unlisted Shares & Securities</option>
                    <option value="gold_jewelry">Gold, Jewelry & Archaeological Collections</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Sale Price (₹)</label>
                    <input
                      type="number"
                      value={input.salePrice}
                      onChange={(e) => setInput((prev) => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Transfer Expenses / Brokerage (₹)</label>
                    <input
                      type="number"
                      value={input.transferExpenses}
                      onChange={(e) => setInput((prev) => ({ ...prev, transferExpenses: parseFloat(e.target.value) || 0 }))}
                      className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Actual Purchase Price (₹)</label>
                    <input
                      type="number"
                      value={input.purchasePrice}
                      onChange={(e) => setInput((prev) => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Improvement Cost (₹)</label>
                    <input
                      type="number"
                      value={input.improvementCost}
                      onChange={(e) => setInput((prev) => ({ ...prev, improvementCost: parseFloat(e.target.value) || 0 }))}
                      className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Purchase Date</label>
                    <input
                      type="date"
                      value={input.purchaseDate}
                      onChange={(e) => setInput((prev) => ({ ...prev, purchaseDate: e.target.value }))}
                      className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Sale Date</label>
                    <input
                      type="date"
                      value={input.saleDate}
                      onChange={(e) => setInput((prev) => ({ ...prev, saleDate: e.target.value }))}
                      className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />
                    <span>Classification Status: {shortTerm ? 'Short-Term Capital Gain (STCG)' : 'Long-Term Capital Gain (LTCG)'}</span>
                  </div>
                  <p>Holding Duration: <strong>{Math.floor(holdingDays / 365)} years and {holdingDays % 365} days</strong> ({holdingDays} total days).</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Grandfathering & Real Estate Indexation */}
          {activeTab === 'grandfathering' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#1dbf73]" />
                <span>Special Provisions: Grandfathering & Real Estate Dual Comparison</span>
              </h3>

              {input.assetCategory === 'listed_equity' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <div className="font-bold text-xs text-[#222325]">Section 112A Grandfathering (Acquired before Jan 31, 2018)</div>
                      <div className="text-[11px] text-slate-500">Exempts gains accrued up to January 31, 2018.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={input.applyGrandfathering}
                      onChange={(e) => setInput((prev) => ({ ...prev, applyGrandfathering: e.target.checked }))}
                      className="w-5 h-5 text-[#1dbf73] rounded-md border-slate-300 cursor-pointer"
                    />
                  </div>

                  {input.applyGrandfathering && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Fair Market Value (FMV) as on Jan 31, 2018 (₹)</label>
                      <input
                        type="number"
                        value={input.jan312018Fmv}
                        onChange={(e) => setInput((prev) => ({ ...prev, jan312018Fmv: parseFloat(e.target.value) || 0 }))}
                        className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                      />
                    </div>
                  )}
                </div>
              )}

              {input.assetCategory === 'real_estate' && !shortTerm && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <div className="font-bold text-xs text-[#222325]">Property Acquired Before July 23, 2024?</div>
                      <div className="text-[11px] text-slate-500">Enables automated dual comparison (Option A: 12.5% flat vs Option B: 20% with CII indexation).</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={input.acquisitionBeforeJuly24}
                      onChange={(e) => setInput((prev) => ({ ...prev, acquisitionBeforeJuly24: e.target.checked }))}
                      className="w-5 h-5 text-[#1dbf73] rounded-md border-slate-300 cursor-pointer"
                    />
                  </div>

                  {input.acquisitionBeforeJuly24 && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Indexed Cost of Acquisition (Option B - CII Indexed) (₹)</label>
                      <input
                        type="number"
                        value={input.indexedCostOfAcquisition}
                        onChange={(e) => setInput((prev) => ({ ...prev, indexedCostOfAcquisition: parseFloat(e.target.value) || 0 }))}
                        className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        System automatically picks the lower tax liability between 12.5% flat and 20% indexed.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {input.assetCategory !== 'listed_equity' && input.assetCategory !== 'real_estate' && (
                <div className="p-6 text-center text-xs text-slate-500">
                  No special grandfathering or indexation rules apply to this asset class under current tax guidelines.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Loss Set-Offs & Carry Forward */}
          {activeTab === 'losses' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1dbf73]" />
                <span>Capital Loss Set-Off & 8-Year Carry-Forward Ledger</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Brought Forward STCL (₹)</label>
                  <input
                    type="number"
                    value={input.broughtForwardStcl}
                    onChange={(e) => setInput((prev) => ({ ...prev, broughtForwardStcl: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Can offset both STCG and LTCG.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Brought Forward LTCL (₹)</label>
                  <input
                    type="number"
                    value={input.broughtForwardLtcl}
                    onChange={(e) => setInput((prev) => ({ ...prev, broughtForwardLtcl: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Can offset ONLY LTCG.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-[#222325]">Loss Carry Forward Summary</div>
                <div className="flex justify-between">
                  <span>Unabsorbed STCL Carried Forward:</span>
                  <strong className="text-slate-900">₹{unabsorbedStcl.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Unabsorbed LTCL Carried Forward:</span>
                  <strong className="text-slate-900">₹{unabsorbedLtcl.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Reinvestment Exemptions */}
          {activeTab === 'reinvestments' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#1dbf73]" />
                <span>Reinvestment & Capital Gain Exemptions (Sec 54 / 54F / 54EC)</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Reinvestment Amount in Residential Property / 54EC Bonds (₹)</label>
                  <input
                    type="number"
                    value={input.reinvestmentSec54}
                    onChange={(e) => setInput((prev) => ({ ...prev, reinvestmentSec54: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Reduces taxable long-term capital gains subject to statutory lock-in and deposit timelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Summary */}
          {activeTab === 'summary' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="text-base font-black text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
                <CalcIcon className="w-4 h-4 text-[#1dbf73]" />
                <span>Executive Tax Computation Breakdown</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Net Sale Consideration:</span>
                  <strong className="text-[#222325]">₹{netSaleConsideration.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Effective Cost of Acquisition:</span>
                  <strong className="text-[#222325]">₹{effectiveCoa.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Gross Capital Gain:</span>
                  <strong className="text-[#222325]">₹{rawCapitalGain.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Taxable Gain After Loss Set-Offs:</span>
                  <strong className="text-[#222325]">₹{(taxableStcg + taxableLtcg).toLocaleString('en-IN')}</strong>
                </div>
                {input.assetCategory === 'real_estate' && !shortTerm && input.acquisitionBeforeJuly24 && (
                  <div className="flex justify-between py-2 border-b border-slate-100 text-emerald-700 font-bold">
                    <span>Applied Real Estate Method:</span>
                    <span>{realEstateOptionUsed}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY LIVE TAX COMPUTATION CARD (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
                Live Tax Summary
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                {shortTerm ? 'STCG' : 'LTCG'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Total Taxable Capital Gain</div>
                <div className="text-2xl font-black text-white">
                  ₹{Math.round((taxableStcg + netTaxableLtcgAfterExemption) / 10) * 10}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1">Total Tax Liability (Incl. 4% Cess)</div>
                <div className="text-3xl font-black text-[#1dbf73]">
                  ₹{totalTaxLiability.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Base Tax:</span>
                <span>₹{Math.round(baseTax).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Health & Education Cess (4%):</span>
                <span>₹{Math.round(cess).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportJson}
              className="w-full py-3.5 rounded-2xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Tax Report (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
