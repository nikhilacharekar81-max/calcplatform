import React, { useState, useMemo, useEffect } from 'react';
import {
  TDS_SECTIONS,
  DEFAULT_TDS_INPUTS,
  calculateTds,
  TdsInputState,
} from '../../utils/tdsEngine';
import {
  Calculator,
  ShieldAlert,
  HelpCircle,
  FileText,
  Share2,
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface TdsCalculatorAppProps {
  initialState?: Partial<TdsInputState>;
}

export const TdsCalculatorApp: React.FC<TdsCalculatorAppProps> = ({ initialState }) => {
  // Initialize state with URL query sync and localStorage
  const [inputs, setInputs] = useState<TdsInputState>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const saved = localStorage.getItem('tds_calc_state_2026');
      const parsedSaved = saved ? JSON.parse(saved) : {};

      const sectionKey = params.get('sec') || parsedSaved.sectionKey || DEFAULT_TDS_INPUTS.sectionKey;
      const grossAmount = params.has('amt')
        ? Number(params.get('amt'))
        : parsedSaved.grossAmount ?? DEFAULT_TDS_INPUTS.grossAmount;
      const payeeType = (params.get('payee') as any) || parsedSaved.payeeType || DEFAULT_TDS_INPUTS.payeeType;
      const isPanFurnished = params.has('pan')
        ? params.get('pan') === '1'
        : parsedSaved.isPanFurnished ?? DEFAULT_TDS_INPUTS.isPanFurnished;
      const aggregatePaidTillDate = params.has('agg')
        ? Number(params.get('agg'))
        : parsedSaved.aggregatePaidTillDate ?? DEFAULT_TDS_INPUTS.aggregatePaidTillDate;

      return {
        ...DEFAULT_TDS_INPUTS,
        ...parsedSaved,
        sectionKey: TDS_SECTIONS[sectionKey] ? sectionKey : '194J_PROF',
        grossAmount: isNaN(grossAmount) ? 75000 : grossAmount,
        payeeType: payeeType === 'Company/Firm' ? 'Company/Firm' : 'Individual/HUF',
        isPanFurnished,
        aggregatePaidTillDate: isNaN(aggregatePaidTillDate) ? 0 : aggregatePaidTillDate,
        ...initialState,
      };
    } catch {
      return { ...DEFAULT_TDS_INPUTS, ...initialState };
    }
  });

  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state to URL and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tds_calc_state_2026', JSON.stringify(inputs));
      const url = new URL(window.location.href);
      url.searchParams.set('sec', inputs.sectionKey);
      url.searchParams.set('amt', inputs.grossAmount.toString());
      url.searchParams.set('payee', inputs.payeeType);
      url.searchParams.set('pan', inputs.isPanFurnished ? '1' : '0');
      if ((inputs.aggregatePaidTillDate ?? 0) > 0) {
        url.searchParams.set('agg', (inputs.aggregatePaidTillDate ?? 0).toString());
      } else {
        url.searchParams.delete('agg');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, [inputs]);

  // Core Result Calculation with useMemo
  const result = useMemo(() => {
    return calculateTds(inputs);
  }, [inputs]);

  const currentSection = TDS_SECTIONS[inputs.sectionKey] || TDS_SECTIONS['194J_PROF'];

  // Quick Preset Handlers
  const applyPreset = (
    sec: string,
    amt: number,
    payee: 'Individual/HUF' | 'Company/Firm' = 'Individual/HUF',
    pan = true,
    agg = 0
  ) => {
    setInputs((prev) => ({
      ...prev,
      sectionKey: sec,
      grossAmount: amt,
      payeeType: payee,
      isPanFurnished: pan,
      aggregatePaidTillDate: agg,
      isForm15Submitted: false,
      hasForm13Certificate: false,
    }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_TDS_INPUTS);
  };

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvRows = [
      ['Tax Deduction at Source (TDS) Calculation Summary - FY 2026-27 (AY 2027-28)'],
      ['Generated Date', new Date().toLocaleDateString('en-IN')],
      [''],
      ['Parameter', 'Value'],
      ['TDS Section', `${result.section.code} - ${result.section.name}`],
      ['Payee Category', inputs.payeeType],
      ['PAN Furnished', inputs.isPanFurnished ? 'Yes' : 'No (Sec 206AA Penalty)'],
      ['Gross Payment / Invoice Amount', `INR ${result.grossAmount.toLocaleString('en-IN')}`],
      ['Aggregate Paid Till Date', `INR ${(inputs.aggregatePaidTillDate ?? 0).toLocaleString('en-IN')}`],
      ['Statutory Threshold Limit', `INR ${result.thresholdLimitUsed.toLocaleString('en-IN')}`],
      ['Threshold Status', result.isThresholdCrossed ? 'Threshold Crossed (TDS Applicable)' : 'Below Threshold'],
      ['Base TDS Rate (%)', `${result.baseTdsRate}%`],
      ['Effective Applied TDS Rate (%)', `${result.effectiveTdsRate}%`],
      ['Base TDS Deductible', `INR ${result.baseTdsAmount.toLocaleString('en-IN')}`],
      ['Surcharge Amount', `INR ${result.surchargeAmount.toLocaleString('en-IN')}`],
      ['Health & Education Cess (4%)', `INR ${result.cessAmount.toLocaleString('en-IN')}`],
      ['Total TDS to Deduct & Deposit', `INR ${result.totalTdsDeductible.toLocaleString('en-IN')}`],
      ['Net Amount Payable to Payee', `INR ${result.netPayableToPayee.toLocaleString('en-IN')}`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TDS_Summary_${result.section.code}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 1. TOP PRESET TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#222325] uppercase tracking-wider">
              Quick Calculation Scenarios (FY 2026-27)
            </h2>
            <p className="text-[11px] text-[#74767e]">
              One-click presets for common business payments
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('194J_PROF', 75000, 'Individual/HUF')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-[#1dbf73] hover:text-white transition-colors"
          >
            Doctor/CA Fee (₹75k)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('194I_BUILDING', 60000, 'Individual/HUF')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-[#1dbf73] hover:text-white transition-colors"
          >
            Office Rent (₹60k)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('194C_CONTRACTOR', 45000, 'Individual/HUF')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-[#1dbf73] hover:text-white transition-colors"
          >
            Contractor (₹45k)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('194Q_PURCHASE', 6500000, 'Company/Firm', true, 0)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-[#1dbf73] hover:text-white transition-colors"
          >
            Goods Purchase (₹65L)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('194S_CRYPTO', 30000, 'Individual/HUF')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-[#1dbf73] hover:text-white transition-colors"
          >
            Crypto VDA (₹30k)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SPLIT-SCREEN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE FORM (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Section & Payee Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1dbf73]" />
                <h3 className="text-sm font-bold text-[#222325]">1. Payment Type & Section</h3>
              </div>
              <span className="text-[11px] font-bold text-[#1dbf73] bg-[#f4fdf8] px-2.5 py-0.5 rounded-full border border-[#d8f5e5]">
                {currentSection.code} &bull; {currentSection.standardRate}%
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1.5">
                  Select TDS Section & Nature of Payment
                </label>
                <select
                  value={inputs.sectionKey}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      sectionKey: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white transition-all"
                >
                  <optgroup label="Professional, Technical & Rent">
                    <option value="194J_PROF">Sec 194J: Professional Fees (Medical, Legal, CA) - 10%</option>
                    <option value="194J_TECH">Sec 194J: Technical Services / Call Center - 2%</option>
                    <option value="194I_BUILDING">Sec 194I: Rent on Land / Building / Furniture - 10%</option>
                    <option value="194I_PLANT">Sec 194I: Rent on Plant / Machinery / Equipment - 2%</option>
                  </optgroup>
                  <optgroup label="Contracts, Commission & Interest">
                    <option value="194C_CONTRACTOR">Sec 194C: Contractor & Sub-Contractor (1% Ind / 2% Co)</option>
                    <option value="194H_COMMISSION">Sec 194H: Commission or Brokerage - 2%</option>
                    <option value="194A_INTEREST">Sec 194A: Interest on FD / Loan / NBFC - 10%</option>
                  </optgroup>
                  <optgroup label="Goods, Digital & Emerging Sections">
                    <option value="194Q_PURCHASE">Sec 194Q: Purchase of Goods exceeding ₹50L - 0.1%</option>
                    <option value="194R_PERQUISITES">Sec 194R: Business Perks / Benefits - 10%</option>
                    <option value="194S_CRYPTO">Sec 194S: Virtual Digital Assets / Crypto - 1%</option>
                    <option value="194T_PARTNER">Sec 194T: Partner Salary / Bonus / Interest - 10%</option>
                    <option value="194O_ECOMMERCE">Sec 194O: E-Commerce Participant Sales - 0.1%</option>
                  </optgroup>
                </select>
                <p className="text-[11px] text-[#74767e] mt-1.5 leading-relaxed">
                  {currentSection.description}
                </p>
              </div>

              {/* Payee Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1.5">
                  Payee Legal Entity Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, payeeType: 'Individual/HUF' }))}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      inputs.payeeType === 'Individual/HUF'
                        ? 'bg-[#f4fdf8] border-[#1dbf73] text-[#1dbf73] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Individual / HUF</span>
                    {inputs.payeeType === 'Individual/HUF' && <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, payeeType: 'Company/Firm' }))}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      inputs.payeeType === 'Company/Firm'
                        ? 'bg-[#f4fdf8] border-[#1dbf73] text-[#1dbf73] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Company / Firm / LLP</span>
                    {inputs.payeeType === 'Company/Firm' && <CheckCircle2 className="w-4 h-4 text-[#1dbf73]" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Transaction Amounts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#1dbf73]" />
                <h3 className="text-sm font-bold text-[#222325]">2. Transaction Amounts & Slabs</h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Threshold: {currentSection.thresholdDescription}
              </span>
            </div>

            <div className="space-y-4">
              {/* Current Invoice Amount */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#222325]">
                    Current Bill / Transaction Amount (₹)
                  </label>
                  <span className="text-xs font-extrabold text-[#1dbf73]">
                    ₹{inputs.grossAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={inputs.grossAmount || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        grossAmount: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full p-3 pl-8 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
                  />
                  <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={inputs.sectionKey === '194Q_PURCHASE' ? 10000000 : 500000}
                  step={inputs.sectionKey === '194Q_PURCHASE' ? 100000 : 5000}
                  value={Math.min(inputs.sectionKey === '194Q_PURCHASE' ? 10000000 : 500000, inputs.grossAmount)}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      grossAmount: Number(e.target.value),
                    }))
                  }
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73] mt-2"
                />
              </div>

              {/* Cumulative Paid Till Date */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#222325] flex items-center gap-1.5">
                    <span>Prior Cumulative Payments in FY 2026-27 (₹)</span>
                    <span
                      className="text-slate-400 cursor-pointer"
                      title="Total amounts already paid to this payee earlier in the current financial year to evaluate annual threshold limits"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </label>
                  <span className="text-xs font-bold text-slate-600">
                    ₹{(inputs.aggregatePaidTillDate ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={inputs.aggregatePaidTillDate || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        aggregatePaidTillDate: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    placeholder="0"
                    className="w-full p-3 pl-8 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
                  />
                  <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Compliance, PAN & Exemption Controls */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#1dbf73]" />
                <h3 className="text-sm font-bold text-[#222325]">3. Compliance & Exemption Toggles</h3>
              </div>
            </div>

            <div className="space-y-4">
              {/* PAN Status Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#222325] flex items-center gap-1.5">
                    <span>Is Valid PAN Furnished by Payee?</span>
                  </h4>
                  <p className="text-[11px] text-[#74767e] mt-0.5">
                    Non-furnishing of PAN triggers Section 206AA penalty rate of 20%
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInputs((prev) => ({ ...prev, isPanFurnished: !prev.isPanFurnished }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    inputs.isPanFurnished
                      ? 'bg-[#1dbf73] text-white shadow-xs'
                      : 'bg-rose-600 text-white shadow-xs'
                  }`}
                >
                  {inputs.isPanFurnished ? 'PAN Available (Yes)' : 'No PAN (20% TDS)'}
                </button>
              </div>

              {/* Missing PAN Warning Alert */}
              {!inputs.isPanFurnished && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Section 206AA Higher Deduction Triggered</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-800">
                    Because PAN is not furnished, TDS must be deducted at the higher penalty rate of <strong>20%</strong> (or the standard rate if higher).
                  </p>
                </div>
              )}

              {/* Form 15G / 15H Exemption Toggle (For Sec 194A) */}
              {currentSection.supportsForm15GH && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      Form 15G / Form 15H Self-Declaration
                    </h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Nil TDS deduction if payee submitted valid declaration for nil tax liability
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inputs.isForm15Submitted}
                    onChange={(e) => setInputs((prev) => ({ ...prev, isForm15Submitted: e.target.checked }))}
                    className="w-5 h-5 text-[#1dbf73] rounded-md border-slate-300 focus:ring-[#1dbf73] cursor-pointer"
                  />
                </div>
              )}

              {/* Lower Deduction Certificate (Form 13) */}
              {currentSection.supportsForm13 && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#222325]">
                        Assessing Officer Lower Deduction Certificate (Form 13)
                      </h4>
                      <p className="text-[11px] text-[#74767e]">
                        Payee holds a specific low-rate certificate u/s 197
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={inputs.hasForm13Certificate}
                      onChange={(e) =>
                        setInputs((prev) => ({ ...prev, hasForm13Certificate: e.target.checked }))
                      }
                      className="w-5 h-5 text-[#1dbf73] rounded-md border-slate-300 focus:ring-[#1dbf73] cursor-pointer"
                    />
                  </div>

                  {inputs.hasForm13Certificate && (
                    <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                        Certificate Rate (%):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={inputs.form13Rate}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            form13Rate: Math.max(0, Number(e.target.value) || 0),
                          }))
                        }
                        className="w-28 p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#222325] focus:ring-2 focus:ring-[#1dbf73]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Surcharge & 4% Cess Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#222325]">
                      Apply Surcharge & 4% Health/Education Cess
                    </h4>
                    <p className="text-[11px] text-[#74767e]">
                      For high-value corporate contracts or non-resident remittances
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inputs.applySurchargeAndCess}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, applySurchargeAndCess: e.target.checked }))
                    }
                    className="w-5 h-5 text-[#1dbf73] rounded-md border-slate-300 focus:ring-[#1dbf73] cursor-pointer"
                  />
                </div>

                {inputs.applySurchargeAndCess && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      Surcharge Rate (%):
                    </label>
                    <select
                      value={inputs.surchargeRate}
                      onChange={(e) =>
                        setInputs((prev) => ({ ...prev, surchargeRate: Number(e.target.value) }))
                      }
                      className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#222325]"
                    >
                      <option value="0">0% Surcharge</option>
                      <option value="10">10% Surcharge</option>
                      <option value="15">15% Surcharge</option>
                      <option value="25">25% Surcharge</option>
                    </select>
                    <span className="text-[11px] text-slate-500">+ 4% Cess automatic</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY RESULTS SUMMARY (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-md space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  TDS Summary & Net Outflow
                </span>
                <h3 className="text-lg font-extrabold text-[#222325]">
                  {result.section.code} Deduction
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  result.totalTdsDeductible > 0
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {result.statusBadge}
              </span>
            </div>

            {/* Hero Big Metric: Total TDS to Deduct */}
            <div className="bg-gradient-to-br from-[#f4fdf8] to-[#e7fbf0] rounded-2xl p-5 border border-[#1dbf73]/30 text-center space-y-1">
              <span className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
                Total TDS to Deduct & Deposit
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#222325]">
                ₹{result.totalTdsDeductible.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-[#404145]">
                Effective Rate: <strong>{result.effectiveTdsRate}%</strong> &bull; Gross: ₹
                {result.grossAmount.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Net Amount Payable Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">
                  Net Amount Payable to Payee
                </span>
                <span className="text-xl font-extrabold text-[#222325]">
                  ₹{result.netPayableToPayee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Invoice Value</span>
                <span className="text-xs font-bold text-slate-700">
                  ₹{result.grossAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Itemized Calculation Breakdown Table */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Invoice / Gross Amount:</span>
                <span className="font-bold text-[#222325]">
                  ₹{result.grossAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Statutory Section Threshold:</span>
                <span className="font-bold text-slate-700">
                  ₹{result.thresholdLimitUsed.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Taxable Base for TDS:</span>
                <span className="font-bold text-slate-800">
                  ₹{result.taxableBaseAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Standard Section Rate:</span>
                <span className="font-bold text-slate-700">{result.baseTdsRate}%</span>
              </div>

              {result.isMissingPanPenalty && (
                <div className="flex justify-between text-rose-700 font-bold bg-rose-50 p-1.5 rounded-lg">
                  <span>Sec 206AA Penalty Rate:</span>
                  <span>{result.effectiveTdsRate}%</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                <span>Base TDS Amount:</span>
                <span className="font-bold text-[#222325]">
                  ₹{result.baseTdsAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {inputs.applySurchargeAndCess && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Surcharge ({inputs.surchargeRate}%):</span>
                    <span className="font-bold text-slate-700">
                      ₹{result.surchargeAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Health & Education Cess (4%):</span>
                    <span className="font-bold text-slate-700">
                      ₹{result.cessAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm font-extrabold text-[#222325] pt-2 border-t border-slate-200">
                <span>Total TDS Deductible:</span>
                <span className="text-[#1dbf73]">
                  ₹{result.totalTdsDeductible.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Notes & Warnings */}
            {result.notes.length > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-[11px] text-amber-900">
                <span className="font-bold block">Compliance Notes:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                  {result.notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrint}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                title="Print Summary"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareUrl}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  copiedLink
                    ? 'bg-[#1dbf73] text-white'
                    : 'bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5] hover:bg-[#1dbf73] hover:text-white'
                }`}
                title="Copy shareable calculation link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
