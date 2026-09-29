import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  OldVsNewInputs,
  DEFAULT_OLD_VS_NEW_INPUTS,
  compareOldVsNewRegimes,
  OldVsNewComparisonResult,
} from '../../utils/oldVsNewRegimeEngine';
import {
  Calculator,
  Trophy,
  Sparkles,
  TrendingDown,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Home,
  Building,
  Coins,
  DollarSign,
  Percent,
  CheckCircle2,
  Share2,
  HelpCircle,
} from 'lucide-react';

const STORAGE_KEY = 'old_vs_new_tax_regime_state_v1';

export const OldVsNewRegimeCalculatorApp: React.FC = () => {
  // 1. Initialize state from URL params or LocalStorage
  const [inputs, setInputs] = useState<OldVsNewInputs>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlSalary = searchParams.get('salary');
      if (urlSalary) {
        return {
          ...DEFAULT_OLD_VS_NEW_INPUTS,
          basicSalary: Number(urlSalary) || DEFAULT_OLD_VS_NEW_INPUTS.basicSalary,
          sec80C: searchParams.has('c80') ? Number(searchParams.get('c80')) : DEFAULT_OLD_VS_NEW_INPUTS.sec80C,
          sec80D_Self: searchParams.has('d80') ? Number(searchParams.get('d80')) : DEFAULT_OLD_VS_NEW_INPUTS.sec80D_Self,
          hraReceived: searchParams.has('hra') ? Number(searchParams.get('hra')) : DEFAULT_OLD_VS_NEW_INPUTS.hraReceived,
          actualRentPaidYearly: searchParams.has('rent') ? Number(searchParams.get('rent')) : DEFAULT_OLD_VS_NEW_INPUTS.actualRentPaidYearly,
        };
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_OLD_VS_NEW_INPUTS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_OLD_VS_NEW_INPUTS;
  });

  const [activeTab, setActiveTab] = useState<'salary' | 'deductions' | 'house' | 'other'>('salary');
  const [copied, setCopied] = useState(false);
  const [showSlabBreakdown, setShowSlabBreakdown] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // 2. Memoized Tax Computation
  const result: OldVsNewComparisonResult = useMemo(() => {
    return compareOldVsNewRegimes(inputs);
  }, [inputs]);

  // 3. Bidirectional Sync: LocalStorage & URL Params
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));

      const params = new URLSearchParams(window.location.search);
      params.set('salary', String(inputs.basicSalary || 0));
      params.set('c80', String(inputs.sec80C || 0));
      params.set('d80', String(inputs.sec80D_Self || 0));
      params.set('hra', String(inputs.hraReceived || 0));
      params.set('rent', String(inputs.actualRentPaidYearly || 0));

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } catch {
      // Ignore URL sync errors
    }
  }, [inputs]);

  const handleInputChange = (field: keyof OldVsNewInputs, value: any) => {
    let sanitized = value;
    if (typeof value === 'number') {
      sanitized = isNaN(value) ? 0 : Math.max(0, value);
      // Hard cap 80C at ₹1,50,000
      if (field === 'sec80C') {
        sanitized = Math.min(150000, sanitized);
      }
      if (field === 'sec80CCD1B_NPS') {
        sanitized = Math.min(50000, sanitized);
      }
    }
    setInputs((prev) => ({ ...prev, [field]: sanitized }));
  };

  const applyPreset = (preset: 'preset_8L' | 'preset_12_75L' | 'preset_15L' | 'preset_25L' | 'preset_50L') => {
    if (preset === 'preset_8L') {
      setInputs((prev) => ({
        ...prev,
        basicSalary: 500000,
        hraReceived: 180000,
        specialAllowance: 120000,
        bonusVariable: 0,
        actualRentPaidYearly: 144000,
        sec80C: 100000,
        sec80D_Self: 15000,
        homeLoanInterestSec24: 0,
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
        sec80D_Self: 25000,
        sec80CCD1B_NPS: 50000,
        homeLoanInterestSec24: 0,
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
        sec80D_Self: 25000,
        sec80D_Parents: 25000,
        sec80CCD1B_NPS: 50000,
        homeLoanInterestSec24: 0,
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
        sec80D_Self: 25000,
        sec80D_Parents: 50000,
        sec80CCD1B_NPS: 50000,
        homeLoanInterestSec24: 200000,
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
        sec80D_Self: 25000,
        sec80D_Parents: 50000,
        sec80CCD1B_NPS: 50000,
        homeLoanInterestSec24: 200000,
      }));
    }
  };

  const handleReset = () => {
    setInputs(DEFAULT_OLD_VS_NEW_INPUTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatINR = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val || 0));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleTooltip = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* 1. PRESET & TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#222325]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
          <span>Quick Scenario Presets:</span>
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
            title="Reset to default values"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 2. SPLIT-SCREEN MAIN WORKSPACE (Desktop: 7-5 grid, Mobile: Stack) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INTERACTIVE INPUT FORMS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Age Category & Taxpayer Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#222325] flex items-center gap-1.5">
                <span>Taxpayer Age Category:</span>
                <span className="text-slate-400 cursor-pointer" onClick={() => toggleTooltip('age')}>
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                (Affects Old Regime basic exemption)
              </span>
            </div>

            {activeTooltip === 'age' && (
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs leading-relaxed border border-blue-200">
                Under Old Regime: General (&lt;60) gets ₹2.5L exemption, Senior (60-80) gets ₹3L exemption, and Super Senior (80+) gets ₹5L exemption. New Regime has unified ₹4L slab for all ages.
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('ageCategory', 'general')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  inputs.ageCategory === 'general'
                    ? 'bg-[#222325] text-white border-[#222325] shadow-xs'
                    : 'bg-[#fafafa] text-[#404145] border-slate-200 hover:bg-slate-100'
                }`}
              >
                &lt; 60 Years
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('ageCategory', 'senior')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  inputs.ageCategory === 'senior'
                    ? 'bg-[#222325] text-white border-[#222325] shadow-xs'
                    : 'bg-[#fafafa] text-[#404145] border-slate-200 hover:bg-slate-100'
                }`}
              >
                60 - 80 Years
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('ageCategory', 'superSenior')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  inputs.ageCategory === 'superSenior'
                    ? 'bg-[#222325] text-white border-[#222325] shadow-xs'
                    : 'bg-[#fafafa] text-[#404145] border-slate-200 hover:bg-slate-100'
                }`}
              >
                80+ Years
              </button>
            </div>
          </div>

          {/* Tabbed Input Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tab Headers */}
            <div className="flex items-center border-b border-slate-200 bg-[#fafafa] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('salary')}
                className={`px-4 sm:px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'salary'
                    ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                    : 'border-transparent text-[#62646a] hover:text-[#222325]'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>1. Salary & Income</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('deductions')}
                className={`px-4 sm:px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'deductions'
                    ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                    : 'border-transparent text-[#62646a] hover:text-[#222325]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>2. Deductions (80C, 80D, HRA)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('house')}
                className={`px-4 sm:px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'house'
                    ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                    : 'border-transparent text-[#62646a] hover:text-[#222325]'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>3. Home Loan (Sec 24)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('other')}
                className={`px-4 sm:px-5 py-3.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'other'
                    ? 'border-[#1dbf73] text-[#1dbf73] bg-white shadow-2xs'
                    : 'border-transparent text-[#62646a] hover:text-[#222325]'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>4. Capital Gains & Other</span>
              </button>
            </div>

            {/* Tab Form Fields */}
            <div className="p-6 space-y-6">
              {/* TAB 1: SALARY & INCOME */}
              {activeTab === 'salary' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Basic Salary Slider & Numeric Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#222325]">
                        Annual Basic Salary
                      </label>
                      <span className="text-xs font-black text-[#1dbf73] font-mono">
                        {formatINR(inputs.basicSalary)}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={inputs.basicSalary || ''}
                        onChange={(e) => handleInputChange('basicSalary', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] focus:bg-white focus:border-[#1dbf73] outline-hidden transition-all"
                        placeholder="e.g. 900000"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="25000"
                      value={inputs.basicSalary || 0}
                      onChange={(e) => handleInputChange('basicSalary', Number(e.target.value))}
                      className="w-full accent-[#1dbf73] cursor-pointer"
                    />
                  </div>

                  {/* Allowances Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        House Rent Allowance (HRA)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inputs.hraReceived || ''}
                          onChange={(e) => handleInputChange('hraReceived', Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 180000"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        Special Allowance
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
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 120000"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        Performance Bonus / Variable Pay
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
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 75000"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        Other Allowances & Perquisites
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inputs.otherAllowances || ''}
                          onChange={(e) =>
                            handleInputChange('otherAllowances', Number(e.target.value))
                          }
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DEDUCTIONS (80C, 80D, HRA, NPS) */}
              {activeTab === 'deductions' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* HRA Rent Calculation Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#222325] flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#1dbf73]" />
                        <span>HRA Exemption Calculator (Old Regime)</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        Exempt: {formatINR(result.oldRegime.hraExemption)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#62646a] block mb-1">
                          Annual Rent Paid:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={inputs.actualRentPaidYearly || ''}
                            onChange={(e) =>
                              handleInputChange('actualRentPaidYearly', Number(e.target.value))
                            }
                            className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                            placeholder="e.g. 180000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#62646a] block mb-1">
                          City Type:
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleInputChange('isLivingInMetro', true)}
                            className={`py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              inputs.isLivingInMetro
                                ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            Metro (50%)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange('isLivingInMetro', false)}
                            className={`py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              !inputs.isLivingInMetro
                                ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            Non-Metro (40%)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 80C */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#222325] flex items-center gap-1.5">
                        <span>Section 80C (PPF, EPF, ELSS, Life Insurance)</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                          Max ₹1,50,000
                        </span>
                      </label>
                      <span className="text-xs font-bold text-slate-600 font-mono">
                        {formatINR(inputs.sec80C)}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        max="150000"
                        value={inputs.sec80C || ''}
                        onChange={(e) => handleInputChange('sec80C', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                        placeholder="Max 150000"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={inputs.sec80C || 0}
                      onChange={(e) => handleInputChange('sec80C', Number(e.target.value))}
                      className="w-full accent-[#1dbf73] cursor-pointer"
                    />
                  </div>

                  {/* Section 80D Self & Parents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        80D Health Insurance (Self & Family)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inputs.sec80D_Self || ''}
                          onChange={(e) => handleInputChange('sec80D_Self', Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="Max ₹25k / ₹50k"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        80D Health Insurance (Parents)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inputs.sec80D_Parents || ''}
                          onChange={(e) => handleInputChange('sec80D_Parents', Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="Max ₹25k / ₹50k"
                        />
                      </div>
                    </div>
                  </div>

                  {/* NPS & Employer NPS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        NPS Self [Section 80CCD(1B)]
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          max="50000"
                          value={inputs.sec80CCD1B_NPS || ''}
                          onChange={(e) =>
                            handleInputChange('sec80CCD1B_NPS', Number(e.target.value))
                          }
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="Max 50000 (Old Regime)"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                        <span>Employer NPS [80CCD(2)]</span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                          Both Regimes
                        </span>
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
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="Up to 14% Basic"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HOUSE PROPERTY & LOAN */}
              {activeTab === 'house' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#222325]">
                        Home Loan Interest on Self-Occupied Property (Sec 24)
                      </label>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                        Max ₹2,00,000 (Old Regime)
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        max="200000"
                        value={inputs.homeLoanInterestSec24 || ''}
                        onChange={(e) =>
                          handleInputChange('homeLoanInterestSec24', Number(e.target.value))
                        }
                        className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                        placeholder="Max ₹2,00,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#222325]">
                      Net Annual Rental Income (from Let-Out Property)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={inputs.housePropertyRentalIncome || ''}
                        onChange={(e) =>
                          handleInputChange('housePropertyRentalIncome', Number(e.target.value))
                        }
                        className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                        placeholder="e.g. 0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CAPITAL GAINS & OTHER */}
              {activeTab === 'other' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        Savings Bank Account Interest
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
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 15000"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325]">
                        Fixed Deposit Interest & Other
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
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 0"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                        <span>STCG Equity (111A)</span>
                        <span className="text-[10px] text-slate-500 font-bold">20% Tax</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inputs.capitalGainsStcg || ''}
                          onChange={(e) =>
                            handleInputChange('capitalGainsStcg', Number(e.target.value))
                          }
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 0"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#222325] flex items-center justify-between">
                        <span>LTCG Equity (112A)</span>
                        <span className="text-[10px] text-slate-500 font-bold">12.5% &gt; ₹1.25L</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inputs.capitalGainsLtcg || ''}
                          onChange={(e) =>
                            handleInputChange('capitalGainsLtcg', Number(e.target.value))
                          }
                          className="w-full pl-8 pr-3 py-2 bg-[#fafafa] border border-slate-200 rounded-xl text-xs font-bold text-[#222325] outline-hidden focus:border-[#1dbf73]"
                          placeholder="e.g. 0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY WINNER & COMPARISON CARD (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* WINNER HERO BANNER */}
          <div
            className={`p-6 rounded-3xl border shadow-sm transition-all ${
              result.winningRegime === 'new'
                ? 'bg-gradient-to-br from-[#f4fdf8] via-white to-[#eefcf4] border-[#1dbf73]'
                : result.winningRegime === 'old'
                ? 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border-blue-400'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                  result.winningRegime === 'new'
                    ? 'bg-[#1dbf73] text-white'
                    : result.winningRegime === 'old'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>
                  {result.winningRegime === 'new'
                    ? 'New Tax Regime Wins'
                    : result.winningRegime === 'old'
                    ? 'Old Tax Regime Wins'
                    : 'Equal Tax Liability'}
                </span>
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#222325] tracking-tight">
              {result.annualSavings > 0 ? (
                <>
                  Save <span className="text-[#1dbf73]">{formatINR(result.annualSavings)}</span>/year
                </>
              ) : (
                'Zero Tax Difference'
              )}
            </h3>

            <p className="text-xs text-[#62646a] mt-1.5 leading-relaxed">
              {result.winningRegime === 'new'
                ? `The New Regime offers lower slab rates and a ₹75,000 standard deduction, saving you ${formatINR(
                    result.monthlySavings
                  )} per month in take-home pay.`
                : `Your high tax deductions (80C, 80D, HRA, Home Loan) total ${formatINR(
                    result.oldRegime.totalDeductionsAndExemptions
                  )}, saving you ${formatINR(result.annualSavings)} compared to the New Regime.`}
            </p>

            {/* Break-even deductions metric if New Regime wins */}
            {result.winningRegime === 'new' && result.breakEvenDeductionsNeeded > 0 && (
              <div className="mt-4 p-3 bg-white/80 rounded-xl border border-slate-200/80 text-[11px] text-[#404145]">
                💡 <strong>Break-Even Insight:</strong> You would need approximately{' '}
                <strong className="text-[#222325]">
                  {formatINR(result.oldRegime.totalDeductionsAndExemptions + result.breakEvenDeductionsNeeded)}
                </strong>{' '}
                in total deductions under the Old Regime to match the New Regime's tax savings.
              </div>
            )}
          </div>

          {/* DUAL-COLUMN SIDE-BY-SIDE COMPARISON CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-[#222325] uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Side-by-Side Comparison</span>
              <span className="text-slate-400 font-normal normal-case">FY 2026-27</span>
            </h4>

            {/* Table Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[#74767e]">
                    <th className="py-2 text-left font-medium">Metric</th>
                    <th
                      className={`py-2 text-right font-bold ${
                        result.winningRegime === 'new' ? 'text-[#1dbf73]' : 'text-[#222325]'
                      }`}
                    >
                      New Regime
                    </th>
                    <th
                      className={`py-2 text-right font-bold ${
                        result.winningRegime === 'old' ? 'text-blue-600' : 'text-[#222325]'
                      }`}
                    >
                      Old Regime
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 text-[#62646a]">Gross Income</td>
                    <td className="py-2 text-right font-semibold text-[#222325]">
                      {formatINR(result.newRegime.grossIncome)}
                    </td>
                    <td className="py-2 text-right font-semibold text-[#222325]">
                      {formatINR(result.oldRegime.grossIncome)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 text-[#62646a]">Standard Deduction</td>
                    <td className="py-2 text-right font-semibold text-emerald-600">
                      - {formatINR(result.newRegime.standardDeduction)}
                    </td>
                    <td className="py-2 text-right font-semibold text-emerald-600">
                      - {formatINR(result.oldRegime.standardDeduction)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 text-[#62646a]">Exemptions & 80C/80D</td>
                    <td className="py-2 text-right font-semibold text-emerald-600">
                      - {formatINR(result.newRegime.chapterVIADeductions)}
                    </td>
                    <td className="py-2 text-right font-semibold text-emerald-600">
                      - {formatINR(result.oldRegime.totalDeductionsAndExemptions - result.oldRegime.standardDeduction)}
                    </td>
                  </tr>

                  <tr className="bg-slate-50/70 font-bold">
                    <td className="py-2 text-[#222325] pl-1">Net Taxable Income</td>
                    <td className="py-2 text-right font-mono text-[#222325] pr-1">
                      {formatINR(result.newRegime.netTaxableIncome)}
                    </td>
                    <td className="py-2 text-right font-mono text-[#222325] pr-1">
                      {formatINR(result.oldRegime.netTaxableIncome)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 text-[#62646a]">Base Slab Tax</td>
                    <td className="py-2 text-right font-semibold text-[#222325]">
                      {formatINR(result.newRegime.baseTaxOnSlabs)}
                    </td>
                    <td className="py-2 text-right font-semibold text-[#222325]">
                      {formatINR(result.oldRegime.baseTaxOnSlabs)}
                    </td>
                  </tr>

                  {(result.newRegime.sec87aRebate > 0 || result.oldRegime.sec87aRebate > 0) && (
                    <tr>
                      <td className="py-2 text-emerald-700 font-medium">87A Rebate</td>
                      <td className="py-2 text-right font-bold text-emerald-700">
                        - {formatINR(result.newRegime.sec87aRebate)}
                      </td>
                      <td className="py-2 text-right font-bold text-emerald-700">
                        - {formatINR(result.oldRegime.sec87aRebate)}
                      </td>
                    </tr>
                  )}

                  {result.newRegime.marginalReliefSec87A > 0 && (
                    <tr>
                      <td className="py-2 text-indigo-700 font-medium">Marginal Relief (87A)</td>
                      <td className="py-2 text-right font-bold text-indigo-700">
                        - {formatINR(result.newRegime.marginalReliefSec87A)}
                      </td>
                      <td className="py-2 text-right font-mono text-slate-400">₹0</td>
                    </tr>
                  )}

                  <tr>
                    <td className="py-2 text-[#62646a]">Cess (4%)</td>
                    <td className="py-2 text-right font-semibold text-[#222325]">
                      + {formatINR(result.newRegime.healthAndEducationCess)}
                    </td>
                    <td className="py-2 text-right font-semibold text-[#222325]">
                      + {formatINR(result.oldRegime.healthAndEducationCess)}
                    </td>
                  </tr>

                  {/* Net Payable Final Row */}
                  <tr className="border-t-2 border-slate-200">
                    <td className="py-3 text-xs font-black text-[#222325]">Total Tax Payable</td>
                    <td
                      className={`py-3 text-right text-sm font-black ${
                        result.winningRegime === 'new'
                          ? 'text-[#1dbf73] bg-[#f4fdf8] px-2 rounded-lg'
                          : 'text-[#222325]'
                      }`}
                    >
                      {formatINR(result.newRegime.totalTaxPayable)}
                    </td>
                    <td
                      className={`py-3 text-right text-sm font-black ${
                        result.winningRegime === 'old'
                          ? 'text-blue-600 bg-blue-50 px-2 rounded-lg'
                          : 'text-[#222325]'
                      }`}
                    >
                      {formatINR(result.oldRegime.totalTaxPayable)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MULTI-COLORED SEGMENTED TAX PROGRESS BAR */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#222325]">
                <span>New Regime Tax Tier Breakdown:</span>
                <span className="text-slate-500 font-normal">
                  {result.newRegime.effectiveTaxRate}% effective rate
                </span>
              </div>

              {/* Progress Track */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                {result.newRegime.slabBreakdown
                  .filter((sb) => sb.percentOfTotal > 0)
                  .map((sb, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${sb.percentOfTotal}%` }}
                      className={`${sb.colorClass} transition-all hover:opacity-90`}
                      title={`${sb.label} (${sb.rateLabel}): ${formatINR(sb.taxableAmount)}`}
                    />
                  ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#62646a] pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Nil (0-4L)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> 5% (4-8L)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> 10% (8-12L)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> 15% (12-16L)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> 20% (16-20L)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> 30% (&gt;24L)
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2 px-3 bg-[#fafafa] hover:bg-slate-100 text-[#222325] text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1dbf73]" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share Comparison</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2 px-3 bg-[#222325] hover:bg-[#333] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                <span>Print Summary</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAILED SLAB-BY-SLAB BREAKDOWN (ALWAYS OPEN BY DEFAULT) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <button
          type="button"
          onClick={() => setShowSlabBreakdown(!showSlabBreakdown)}
          className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#222325] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#1dbf73]" />
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
                New Tax Regime (FY 2026-27 Slabs)
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
                        <td className="py-2 px-3 font-medium text-[#222325]">{sb.label}</td>
                        <td className="py-2 px-3 font-semibold text-slate-600">{sb.rateLabel}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700">
                          {formatINR(sb.taxableAmount)}
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
                Old Tax Regime Slabs ({inputs.ageCategory === 'general' ? '<60 yrs' : inputs.ageCategory === 'senior' ? 'Senior' : 'Super Senior'})
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
                        <td className="py-2 px-3 font-medium text-[#222325]">{sb.label}</td>
                        <td className="py-2 px-3 font-semibold text-slate-600">{sb.rateLabel}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700">
                          {formatINR(sb.taxableAmount)}
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
