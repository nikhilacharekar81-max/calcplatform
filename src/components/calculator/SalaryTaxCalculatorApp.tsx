import React, { useState, useMemo } from 'react';
import {
  SalaryTaxInputs,
  DEFAULT_SALARY_INPUTS,
  calculateDualSalaryTax,
  DualRegimeComparison,
} from '../../utils/salaryTaxEngine';
import {
  Calculator as CalcIcon,
  TrendingDown,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Printer,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Building,
  Home,
  Percent,
  Coins,
  ShieldCheck,
  Info,
  DollarSign,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface SalaryTaxCalculatorAppProps {
  initialInputs?: Partial<SalaryTaxInputs>;
}

export const SalaryTaxCalculatorApp: React.FC<SalaryTaxCalculatorAppProps> = ({
  initialInputs,
}) => {
  const [inputs, setInputs] = useState<SalaryTaxInputs>({
    ...DEFAULT_SALARY_INPUTS,
    ...initialInputs,
  });

  const [activeInputTab, setActiveInputTab] = useState<
    'salary' | 'house' | 'capital_gains' | 'other' | 'deductions'
  >('salary');

  const [showSlabBreakdown, setShowSlabBreakdown] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute dual regime tax results
  const result: DualRegimeComparison = useMemo(() => {
    return calculateDualSalaryTax(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof SalaryTaxInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]: typeof value === 'number' ? (isNaN(value) ? 0 : Math.max(0, value)) : value,
    }));
  };

  const applyPreset = (preset: 'preset_8L' | 'preset_12_75L' | 'preset_15L' | 'preset_25L' | 'preset_50L') => {
    if (preset === 'preset_8L') {
      setInputs((prev) => ({
        ...prev,
        basicSalary: 480000,
        hraReceived: 180000,
        specialAllowance: 140000,
        bonusVariable: 0,
        actualRentPaidYearly: 144000,
        sec80C: 100000,
        sec80D_SelfFamily: 15000,
      }));
    } else if (preset === 'preset_12_75L') {
      // Zero-tax sweet spot under New Regime
      setInputs((prev) => ({
        ...prev,
        basicSalary: 765000,
        hraReceived: 255000,
        specialAllowance: 255000,
        bonusVariable: 0,
        actualRentPaidYearly: 240000,
        sec80C: 150000,
        sec80D_SelfFamily: 25000,
        sec80CCD1B_NPS: 50000,
      }));
    } else if (preset === 'preset_15L') {
      setInputs((prev) => ({
        ...prev,
        basicSalary: 900000,
        hraReceived: 300000,
        specialAllowance: 200000,
        bonusVariable: 100000,
        actualRentPaidYearly: 300000,
        sec80C: 150000,
        sec80D_SelfFamily: 25000,
        sec80D_Parents: 25000,
        sec80CCD1B_NPS: 50000,
      }));
    } else if (preset === 'preset_25L') {
      setInputs((prev) => ({
        ...prev,
        basicSalary: 1500000,
        hraReceived: 500000,
        specialAllowance: 300000,
        bonusVariable: 200000,
        actualRentPaidYearly: 480000,
        sec80C: 150000,
        sec80D_SelfFamily: 25000,
        sec80D_Parents: 50000,
        sec80CCD1B_NPS: 50000,
        homeLoanInterestSec24: 200000,
        housingType: 'self_occupied',
      }));
    } else if (preset === 'preset_50L') {
      setInputs((prev) => ({
        ...prev,
        basicSalary: 3000000,
        hraReceived: 1000000,
        specialAllowance: 600000,
        bonusVariable: 400000,
        actualRentPaidYearly: 720000,
        sec80C: 150000,
        sec80D_SelfFamily: 25000,
        sec80D_Parents: 50000,
        sec80CCD1B_NPS: 50000,
        homeLoanInterestSec24: 200000,
        housingType: 'self_occupied',
      }));
    }
  };

  const handleReset = () => {
    setInputs(DEFAULT_SALARY_INPUTS);
  };

  const formatINR = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val || 0));
  };

  const formatNumberOnly = (val: number): string => {
    return new Intl.NumberFormat('en-IN').format(Math.round(val || 0));
  };

  const handleCopySummary = () => {
    const text = `📊 FY 2026-27 Salary Tax Calculation Summary:
• Gross Total Income: ${formatINR(result.newRegime.grossTotalIncome)}
• New Regime Tax: ${formatINR(result.newRegime.totalTaxLiability)} (Effective: ${result.newRegime.effectiveTaxRate}%)
• Old Regime Tax: ${formatINR(result.oldRegime.totalTaxLiability)} (Effective: ${result.oldRegime.effectiveTaxRate}%)
• Recommendation: ${
      result.recommendedRegime === 'new'
        ? `New Regime saves ${formatINR(result.annualSavings)}/year`
        : result.recommendedRegime === 'old'
        ? `Old Regime saves ${formatINR(result.annualSavings)}/year`
        : 'Both regimes have identical tax liability'
    }
• Monthly Take-Home (New Regime): ${formatINR(result.newRegime.monthlyTakeHome)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* 1. SCENARIO PRESETS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#222325]">
          <span className="w-2 h-2 rounded-full bg-[#1dbf73]" />
          <span>Quick Salary Presets (FY 2026-27):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('preset_8L')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#404145] text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            ₹8 Lakhs
          </button>
          <button
            type="button"
            onClick={() => applyPreset('preset_12_75L')}
            className="px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] font-bold text-xs rounded-lg border border-[#d8f5e5] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>₹12.75L (Zero Tax)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPreset('preset_15L')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#404145] text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            ₹15 Lakhs
          </button>
          <button
            type="button"
            onClick={() => applyPreset('preset_25L')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#404145] text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            ₹25 Lakhs
          </button>
          <button
            type="button"
            onClick={() => applyPreset('preset_50L')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#404145] text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            ₹50 Lakhs
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ml-1"
            title="Reset to default inputs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. DUAL REGIME RECOMMENDATION HERO CARD */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
          result.recommendedRegime === 'new'
            ? 'bg-gradient-to-br from-[#f4fdf8] via-white to-[#eefcf4] border-[#1dbf73]/40'
            : result.recommendedRegime === 'old'
            ? 'bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/40 border-blue-200'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  result.recommendedRegime === 'new'
                    ? 'bg-[#1dbf73] text-white'
                    : result.recommendedRegime === 'old'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-600 text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>
                  {result.recommendedRegime === 'new'
                    ? 'New Tax Regime is Optimal'
                    : result.recommendedRegime === 'old'
                    ? 'Old Tax Regime is Optimal'
                    : 'Both Regimes Result in Equal Tax'}
                </span>
              </span>

              <span className="text-xs font-semibold text-slate-500">
                FY 2026-27 (AY 2027-28)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
              {result.annualSavings > 0 ? (
                <>
                  You save{' '}
                  <span className="text-[#1dbf73]">
                    {formatINR(result.annualSavings)}
                  </span>{' '}
                  per year with the{' '}
                  {result.recommendedRegime === 'new'
                    ? 'New Regime'
                    : 'Old Regime'}
                </>
              ) : (
                'Zero Tax Difference Between Regimes'
              )}
            </h2>

            <p className="text-xs sm:text-sm text-[#62646a] max-w-2xl leading-relaxed">
              {result.recommendedRegime === 'new'
                ? `The New Tax Regime provides a flat ₹75,000 Standard Deduction, revised 5%-30% slabs, and full Section 87A rebate ensuring ₹0 tax up to ₹12.75 Lakhs salary. You save ${formatINR(
                    result.monthlySavings
                  )} extra take-home every month.`
                : `Your claimed exemptions & Chapter VI-A deductions (HRA, 80C, 80D, Home Loan interest) total ${formatINR(
                    result.oldRegime.totalDeductionsChapterVIA +
                      result.oldRegime.totalExemptions
                  )}, reducing your Old Regime tax by ${formatINR(
                    result.annualSavings
                  )} compared to the New Regime.`}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#222325] text-xs font-bold rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#1dbf73]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-[#222325] hover:bg-[#333] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Print Tax Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. DUAL-COLUMN LIVE SIDE-BY-SIDE REGIME COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* === COLUMN 1: NEW TAX REGIME (FY 2026-27) === */}
        <div
          className={`rounded-3xl border p-6 sm:p-7 space-y-6 transition-all ${
            result.recommendedRegime === 'new'
              ? 'bg-white border-[#1dbf73] ring-2 ring-[#1dbf73]/20 shadow-md'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f4fdf8] text-[#1dbf73] text-[11px] font-bold border border-[#d8f5e5]">
                  Default & Simplified
                </span>
                {result.recommendedRegime === 'new' && (
                  <span className="text-[11px] font-bold text-[#1dbf73] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Best Choice
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-[#222325] mt-1">
                New Tax Regime (FY 2026-27)
              </h3>
              <p className="text-xs text-[#74767e] mt-0.5">
                Section 115BAC (Revised Slabs & ₹75k Standard Deduction)
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#74767e] uppercase tracking-wider block">
                Total Tax Payable
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#222325] tracking-tight">
                {formatINR(result.newRegime.totalTaxLiability)}
              </div>
              <span className="text-[11px] font-bold text-[#1dbf73]">
                {result.newRegime.effectiveTaxRate}% effective tax rate
              </span>
            </div>
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-[#62646a]">Gross Total Income:</span>
              <span className="font-bold text-[#222325]">
                {formatINR(result.newRegime.grossTotalIncome)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-[#62646a]">
                <span>Standard Deduction (Salaried):</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                  ₹75,000
                </span>
              </div>
              <span className="font-bold text-emerald-600">
                - {formatINR(result.newRegime.standardDeduction)}
              </span>
            </div>

            {result.newRegime.totalDeductionsChapterVIA > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#62646a]">
                  Employer NPS Section 80CCD(2):
                </span>
                <span className="font-bold text-emerald-600">
                  - {formatINR(result.newRegime.totalDeductionsChapterVIA)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 bg-slate-50 px-3 rounded-xl">
              <span className="font-bold text-[#222325]">
                Net Taxable Income:
              </span>
              <span className="font-extrabold text-sm text-[#222325]">
                {formatINR(result.newRegime.netTaxableIncome)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-[#62646a]">Base Tax on Slabs:</span>
              <span className="font-semibold text-[#222325]">
                {formatINR(result.newRegime.baseTaxOnSlabs)}
              </span>
            </div>

            {result.newRegime.sec87aRebate > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-emerald-700">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">
                    Section 87A Tax Rebate (Up to ₹12L):
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    100% Offset
                  </span>
                </div>
                <span className="font-bold">
                  - {formatINR(result.newRegime.sec87aRebate)}
                </span>
              </div>
            )}

            {result.newRegime.marginalReliefSec87A > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-indigo-700 bg-indigo-50/60 px-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-bold">Marginal Relief (Sec 87A):</span>
                </div>
                <span className="font-bold">
                  - {formatINR(result.newRegime.marginalReliefSec87A)}
                </span>
              </div>
            )}

            {result.newRegime.surchargeAmount > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-amber-700">
                <span className="font-medium">
                  Surcharge ({(result.newRegime.surchargeRate * 100).toFixed(0)}%):
                </span>
                <span className="font-bold">
                  + {formatINR(result.newRegime.surchargeAmount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-[#62646a]">Health & Education Cess (4%):</span>
              <span className="font-semibold text-[#222325]">
                + {formatINR(result.newRegime.healthAndEducationCess)}
              </span>
            </div>
          </div>

          {/* Monthly KPI Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#fafafa] rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-[#74767e] uppercase block">
                Monthly In-Hand Salary
              </span>
              <div className="text-base font-extrabold text-[#1dbf73] mt-0.5">
                {formatINR(result.newRegime.monthlyTakeHome)}
              </div>
            </div>
            <div className="p-3 bg-[#fafafa] rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-[#74767e] uppercase block">
                Monthly Tax TDS
              </span>
              <div className="text-base font-extrabold text-[#222325] mt-0.5">
                {formatINR(result.newRegime.monthlyTaxLiability)}
              </div>
            </div>
          </div>
        </div>

        {/* === COLUMN 2: OLD TAX REGIME === */}
        <div
          className={`rounded-3xl border p-6 sm:p-7 space-y-6 transition-all ${
            result.recommendedRegime === 'old'
              ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-md'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  Deductions Heavy
                </span>
                {result.recommendedRegime === 'old' && (
                  <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Best Choice
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-[#222325] mt-1">
                Old Tax Regime
              </h3>
              <p className="text-xs text-[#74767e] mt-0.5">
                Full 80C, 80D, HRA & Section 24 Home Loan Exemptions
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#74767e] uppercase tracking-wider block">
                Total Tax Payable
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#222325] tracking-tight">
                {formatINR(result.oldRegime.totalTaxLiability)}
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                {result.oldRegime.effectiveTaxRate}% effective tax rate
              </span>
            </div>
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-[#62646a]">Gross Total Income:</span>
              <span className="font-bold text-[#222325]">
                {formatINR(result.oldRegime.grossTotalIncome)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-[#62646a]">Standard Deduction (Salaried):</span>
              <span className="font-bold text-emerald-600">
                - {formatINR(result.oldRegime.standardDeduction)}
              </span>
            </div>

            {result.oldRegime.totalExemptions > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#62646a]">
                  HRA & LTA Exemptions (Sec 10):
                </span>
                <span className="font-bold text-emerald-600">
                  - {formatINR(result.oldRegime.totalExemptions)}
                </span>
              </div>
            )}

            {result.oldRegime.totalDeductionsChapterVIA > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#62646a]">
                  Chapter VI-A Deductions (80C, 80D, NPS):
                </span>
                <span className="font-bold text-emerald-600">
                  - {formatINR(result.oldRegime.totalDeductionsChapterVIA)}
                </span>
              </div>
            )}

            {result.oldRegime.housePropertyIncomeNet < 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-[#62646a]">
                  Home Loan Interest Loss (Sec 24):
                </span>
                <span className="font-bold text-emerald-600">
                  {formatINR(result.oldRegime.housePropertyIncomeNet)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-2 bg-slate-50 px-3 rounded-xl">
              <span className="font-bold text-[#222325]">
                Net Taxable Income:
              </span>
              <span className="font-extrabold text-sm text-[#222325]">
                {formatINR(result.oldRegime.netTaxableIncome)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-[#62646a]">Base Tax on Slabs:</span>
              <span className="font-semibold text-[#222325]">
                {formatINR(result.oldRegime.baseTaxOnSlabs)}
              </span>
            </div>

            {result.oldRegime.sec87aRebate > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-emerald-700">
                <span className="font-semibold">
                  Section 87A Rebate (Up to ₹5L):
                </span>
                <span className="font-bold">
                  - {formatINR(result.oldRegime.sec87aRebate)}
                </span>
              </div>
            )}

            {result.oldRegime.surchargeAmount > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-amber-700">
                <span className="font-medium">
                  Surcharge ({(result.oldRegime.surchargeRate * 100).toFixed(0)}%):
                </span>
                <span className="font-bold">
                  + {formatINR(result.oldRegime.surchargeAmount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-[#62646a]">Health & Education Cess (4%):</span>
              <span className="font-semibold text-[#222325]">
                + {formatINR(result.oldRegime.healthAndEducationCess)}
              </span>
            </div>
          </div>

          {/* Monthly KPI Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#fafafa] rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-[#74767e] uppercase block">
                Monthly In-Hand Salary
              </span>
              <div className="text-base font-extrabold text-slate-800 mt-0.5">
                {formatINR(result.oldRegime.monthlyTakeHome)}
              </div>
            </div>
            <div className="p-3 bg-[#fafafa] rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-[#74767e] uppercase block">
                Monthly Tax TDS
              </span>
              <div className="text-base font-extrabold text-[#222325] mt-0.5">
                {formatINR(result.oldRegime.monthlyTaxLiability)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE INPUTS CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-[#fafafa] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveInputTab('salary')}
            className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeInputTab === 'salary'
                ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                : 'border-transparent text-[#62646a] hover:text-[#222325] hover:bg-slate-100/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>1. Salary & Allowances</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveInputTab('deductions')}
            className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeInputTab === 'deductions'
                ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                : 'border-transparent text-[#62646a] hover:text-[#222325] hover:bg-slate-100/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2. Deductions (80C, 80D, HRA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveInputTab('house')}
            className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeInputTab === 'house'
                ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                : 'border-transparent text-[#62646a] hover:text-[#222325] hover:bg-slate-100/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>3. House Property & Loan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveInputTab('capital_gains')}
            className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeInputTab === 'capital_gains'
                ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                : 'border-transparent text-[#62646a] hover:text-[#222325] hover:bg-slate-100/60'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>4. Capital Gains & Crypto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveInputTab('other')}
            className={`px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeInputTab === 'other'
                ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                : 'border-transparent text-[#62646a] hover:text-[#222325] hover:bg-slate-100/60'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>5. Other Sources</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: SALARY */}
          {activeInputTab === 'salary' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#222325]">
                    Annual Salary Breakdown (CTC Components)
                  </h3>
                  <p className="text-xs text-[#74767e]">
                    Enter figures from your salary slip or annual compensation structure.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[#62646a]">
                    Employment Type:
                  </label>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isSalaried', !inputs.isSalaried)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      inputs.isSalaried
                        ? 'bg-[#f4fdf8] text-[#1dbf73] border-[#d8f5e5]'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {inputs.isSalaried ? 'Salaried Employee' : 'Self-Employed / Freelancer'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Basic Salary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Basic Salary (Annual)</span>
                    <span className="text-[11px] text-[#1dbf73] font-mono font-bold">
                      {formatINR(inputs.basicSalary)}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.basicSalary || ''}
                      onChange={(e) => handleInputChange('basicSalary', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden transition-all"
                      placeholder="e.g. 900000"
                    />
                  </div>
                </div>

                {/* HRA Received */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatINR(inputs.hraReceived)}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.hraReceived || ''}
                      onChange={(e) => handleInputChange('hraReceived', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden transition-all"
                      placeholder="e.g. 180000"
                    />
                  </div>
                </div>

                {/* Special Allowance */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Special Allowance</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatINR(inputs.specialAllowance)}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.specialAllowance || ''}
                      onChange={(e) =>
                        handleInputChange('specialAllowance', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden transition-all"
                      placeholder="e.g. 120000"
                    />
                  </div>
                </div>

                {/* Bonus / Variable */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Performance Bonus / Variable</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatINR(inputs.bonusVariable)}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.bonusVariable || ''}
                      onChange={(e) =>
                        handleInputChange('bonusVariable', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden transition-all"
                      placeholder="e.g. 75000"
                    />
                  </div>
                </div>

                {/* LTA Received */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Leave Travel Allowance (LTA)</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatINR(inputs.ltaReceived)}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.ltaReceived || ''}
                      onChange={(e) => handleInputChange('ltaReceived', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden transition-all"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>

                {/* Other Allowances & Perquisites */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Other Allowances / Perquisites</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatINR(inputs.otherAllowances + inputs.perquisites)}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={(inputs.otherAllowances || 0) + (inputs.perquisites || 0) || ''}
                      onChange={(e) =>
                        handleInputChange('otherAllowances', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden transition-all"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDUCTIONS & EXEMPTIONS */}
          {activeInputTab === 'deductions' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#222325]">
                  Chapter VI-A Tax Deductions & HRA Exemptions
                </h3>
                <p className="text-xs text-[#74767e]">
                  These deductions apply primarily to the Old Tax Regime (with 80CCD(2) employer NPS also allowed under New Regime).
                </p>
              </div>

              {/* HRA Exemption Calculator inputs */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#1dbf73]" />
                    <span className="text-xs font-bold text-[#222325]">
                      House Rent Allowance (HRA) Exemption Calculator
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    Exemption: {formatINR(result.oldRegime.totalExemptions)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#404145]">
                      Annual Rent Paid to Landlord:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={inputs.actualRentPaidYearly || ''}
                        onChange={(e) =>
                          handleInputChange('actualRentPaidYearly', Number(e.target.value))
                        }
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                        placeholder="e.g. 180000"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#404145]">
                      Accommodation City Type:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('isLivingInMetro', true)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          inputs.isLivingInMetro
                            ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Metro (50% Basic)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('isLivingInMetro', false)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          !inputs.isLivingInMetro
                            ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Non-Metro (40% Basic)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Chapter VI-A Deductions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 80C */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Section 80C (Max ₹1.5L)</span>
                    <span className="text-[10px] text-slate-500">EPF, PPF, ELSS, LIC</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.sec80C || ''}
                      onChange={(e) => handleInputChange('sec80C', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] outline-hidden"
                      placeholder="Max 150000"
                    />
                  </div>
                </div>

                {/* 80D Self */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Section 80D (Self & Family)</span>
                    <span className="text-[10px] text-slate-500">Health Insurance</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.sec80D_SelfFamily || ''}
                      onChange={(e) =>
                        handleInputChange('sec80D_SelfFamily', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] outline-hidden"
                      placeholder="Max 25000 / 50000"
                    />
                  </div>
                </div>

                {/* 80D Parents */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Section 80D (Parents)</span>
                    <span className="text-[10px] text-slate-500">Max ₹25k / ₹50k Senior</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.sec80D_Parents || ''}
                      onChange={(e) =>
                        handleInputChange('sec80D_Parents', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] outline-hidden"
                      placeholder="e.g. 25000"
                    />
                  </div>
                </div>

                {/* NPS 80CCD(1B) Self */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>NPS Self Contribution 80CCD(1B)</span>
                    <span className="text-[10px] text-slate-500">Max ₹50,000</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.sec80CCD1B_NPS || ''}
                      onChange={(e) =>
                        handleInputChange('sec80CCD1B_NPS', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] outline-hidden"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </div>

                {/* Employer NPS 80CCD(2) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>Employer NPS 80CCD(2)</span>
                      <span className="px-1.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded font-bold">
                        Both Regimes
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-500">Up to 14% Basic</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.employerNpsSec80CCD2 || ''}
                      onChange={(e) =>
                        handleInputChange('employerNpsSec80CCD2', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] outline-hidden"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>

                {/* 80E Education Loan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>80E Education Loan Interest</span>
                    <span className="text-[10px] text-slate-500">No Upper Limit</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.sec80E_EducationLoan || ''}
                      onChange={(e) =>
                        handleInputChange('sec80E_EducationLoan', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] outline-hidden"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOUSE PROPERTY */}
          {activeInputTab === 'house' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#222325]">
                  Income / Loss from House Property & Home Loan (Section 24)
                </h3>
                <p className="text-xs text-[#74767e]">
                  Under Old Regime, up to ₹2,00,000 home loan interest on self-occupied property reduces taxable income.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('housingType', 'none')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    inputs.housingType === 'none'
                      ? 'border-[#1dbf73] bg-[#f4fdf8] text-[#1dbf73]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold block">No Home Loan</span>
                  <span className="text-[11px] text-[#74767e]">Living in rented / own house without loan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('housingType', 'self_occupied')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    inputs.housingType === 'self_occupied'
                      ? 'border-[#1dbf73] bg-[#f4fdf8] text-[#1dbf73]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold block">Self-Occupied Property</span>
                  <span className="text-[11px] text-[#74767e]">Max ₹2 Lakhs interest deduction (Old Regime)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('housingType', 'let_out')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    inputs.housingType === 'let_out'
                      ? 'border-[#1dbf73] bg-[#f4fdf8] text-[#1dbf73]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold block">Rented / Let-Out Property</span>
                  <span className="text-[11px] text-[#74767e]">Rental income after 30% statutory deduction</span>
                </button>
              </div>

              {inputs.housingType !== 'none' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#222325]">
                      Home Loan Interest (Sec 24)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={inputs.homeLoanInterestSec24 || ''}
                        onChange={(e) =>
                          handleInputChange('homeLoanInterestSec24', Number(e.target.value))
                        }
                        className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                        placeholder="Max ₹2,00,000 for self-occupied"
                      />
                    </div>
                  </div>

                  {inputs.housingType === 'let_out' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#222325]">
                          Annual Rent Received from Tenant
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={inputs.annualRentReceived || ''}
                            onChange={(e) =>
                              handleInputChange('annualRentReceived', Number(e.target.value))
                            }
                            className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                            placeholder="e.g. 240000"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#222325]">
                          Municipal Taxes Paid
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={inputs.municipalTaxesPaid || ''}
                            onChange={(e) =>
                              handleInputChange('municipalTaxesPaid', Number(e.target.value))
                            }
                            className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                            placeholder="e.g. 15000"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CAPITAL GAINS & CRYPTO */}
          {activeInputTab === 'capital_gains' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#222325]">
                  Capital Gains & Virtual Digital Assets (FY 2026-27 Rates)
                </h3>
                <p className="text-xs text-[#74767e]">
                  Taxed at statutory separate rates: STCG 111A @ 20%, LTCG 112A @ 12.5% (above ₹1.25L exemption), Crypto/VDA @ 30%.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* STCG 111A */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>STCG Equity (Sec 111A)</span>
                    <span className="text-[10px] text-slate-500 font-bold">20% Tax</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.stcgEquity111A || ''}
                      onChange={(e) =>
                        handleInputChange('stcgEquity111A', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>

                {/* LTCG 112A */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>LTCG Equity (Sec 112A)</span>
                    <span className="text-[10px] text-slate-500 font-bold">12.5% above ₹1.25L</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.ltcgEquity112A || ''}
                      onChange={(e) =>
                        handleInputChange('ltcgEquity112A', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>

                {/* LTCG 112 Other */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>LTCG Real Estate / Other (112)</span>
                    <span className="text-[10px] text-slate-500 font-bold">12.5% Tax</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.ltcgOther112 || ''}
                      onChange={(e) =>
                        handleInputChange('ltcgOther112', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>

                {/* Crypto 115BBH */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                    <span>Crypto / VDA Gains (115BBH)</span>
                    <span className="text-[10px] text-rose-600 font-bold">Flat 30% Tax</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.cryptoVdaGain || ''}
                      onChange={(e) =>
                        handleInputChange('cryptoVdaGain', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OTHER SOURCES */}
          {activeInputTab === 'other' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#222325]">
                  Income from Other Sources & Bank Interest
                </h3>
                <p className="text-xs text-[#74767e]">
                  Savings account interest is eligible for Section 80TTA deduction up to ₹10,000 under the Old Regime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325]">
                    Savings Account Interest
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.savingsInterest || ''}
                      onChange={(e) =>
                        handleInputChange('savingsInterest', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                      placeholder="e.g. 15000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325]">
                    Fixed Deposit (FD) / Recurring Deposit Interest
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.fixedDepositInterest || ''}
                      onChange={(e) =>
                        handleInputChange('fixedDepositInterest', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#222325]">
                    Dividend & Miscellaneous Receipts
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={inputs.dividendIncome || ''}
                      onChange={(e) =>
                        handleInputChange('dividendIncome', Number(e.target.value))
                      }
                      className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                      placeholder="e.g. 0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. SLAB BREAKDOWN ACCORDION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <button
          type="button"
          onClick={() => setShowSlabBreakdown(!showSlabBreakdown)}
          className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#222325] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1dbf73]" />
            <span>Detailed Tax Slab Calculation Breakdown (Slab-by-Slab)</span>
          </div>
          {showSlabBreakdown ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showSlabBreakdown && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
            {/* New Regime Slabs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
                New Regime (FY 2026-27 Slabs)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[#74767e]">
                      <th className="py-2 px-3">Income Slab</th>
                      <th className="py-2 px-3">Rate</th>
                      <th className="py-2 px-3 text-right">Taxable in Slab</th>
                      <th className="py-2 px-3 text-right">Tax Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.newRegime.slabBreakdown.map((sb, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-medium text-[#222325]">{sb.slab}</td>
                        <td className="py-2 px-3 font-semibold text-slate-600">{sb.rate}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700">
                          {formatINR(sb.taxableInSlab)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#222325]">
                          {formatINR(sb.taxAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Old Regime Slabs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Old Regime Slabs
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[#74767e]">
                      <th className="py-2 px-3">Income Slab</th>
                      <th className="py-2 px-3">Rate</th>
                      <th className="py-2 px-3 text-right">Taxable in Slab</th>
                      <th className="py-2 px-3 text-right">Tax Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.oldRegime.slabBreakdown.map((sb, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-medium text-[#222325]">{sb.slab}</td>
                        <td className="py-2 px-3 font-semibold text-slate-600">{sb.rate}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700">
                          {formatINR(sb.taxableInSlab)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#222325]">
                          {formatINR(sb.taxAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
