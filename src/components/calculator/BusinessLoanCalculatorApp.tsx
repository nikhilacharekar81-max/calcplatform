import React, { useState, useMemo } from 'react';
import {
  Building2,
  Calculator as CalcIcon,
  DollarSign,
  Percent,
  Calendar,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { Calculator } from '../../types/schema.ts';

interface BusinessLoanCalculatorAppProps {
  calculator?: Calculator;
}

export const BusinessLoanCalculatorApp: React.FC<BusinessLoanCalculatorAppProps> = ({ calculator }) => {
  // 1. Core Inputs
  const [loanAmount, setLoanAmount] = useState<number>(2500000); // 25 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(13.5); // 13.5% default business loan rate
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [tenureMonthsInput, setTenureMonthsInput] = useState<number>(60);

  // 2. Optional Processing Fee Controls
  const [enableProcessingFee, setEnableProcessingFee] = useState<boolean>(false);
  const [feeType, setFeeType] = useState<'percent' | 'flat'>('percent');
  const [feePercent, setFeePercent] = useState<number>(2.0); // 2% typical for MSME
  const [feeFlatAmount, setFeeFlatAmount] = useState<number>(25000);

  // 3. Amortization View Mode
  const [amortizationView, setAmortizationView] = useState<'yearly' | 'monthly'>('yearly');
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  // Formatters
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const formatLakhs = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return formatINR(val);
  };

  // Calculations
  const calculatedTotalMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureMonthsInput;
  const monthlyRate = interestRate / 12 / 100;

  const { emi, totalPayment, totalInterest, processingFeeAmount, totalUpfrontFee, netDisbursed, totalCostOfLoan } = useMemo(() => {
    let computedEmi = 0;
    if (monthlyRate > 0 && calculatedTotalMonths > 0) {
      computedEmi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, calculatedTotalMonths)) /
        (Math.pow(1 + monthlyRate, calculatedTotalMonths) - 1);
    } else if (calculatedTotalMonths > 0) {
      computedEmi = loanAmount / calculatedTotalMonths;
    }

    const computedTotalPayment = computedEmi * calculatedTotalMonths;
    const computedTotalInterest = Math.max(0, computedTotalPayment - loanAmount);

    let rawFee = 0;
    if (enableProcessingFee) {
      rawFee = feeType === 'percent' ? (loanAmount * feePercent) / 100 : feeFlatAmount;
    }
    const computedTotalUpfrontFee = rawFee;
    const computedNetDisbursed = Math.max(0, loanAmount - computedTotalUpfrontFee);
    const computedTotalCostOfLoan = computedTotalPayment + computedTotalUpfrontFee;

    return {
      emi: computedEmi,
      totalPayment: computedTotalPayment,
      totalInterest: computedTotalInterest,
      processingFeeAmount: rawFee,
      totalUpfrontFee: computedTotalUpfrontFee,
      netDisbursed: computedNetDisbursed,
      totalCostOfLoan: computedTotalCostOfLoan,
    };
  }, [loanAmount, monthlyRate, calculatedTotalMonths, enableProcessingFee, feeType, feePercent, feeFlatAmount]);

  // Amortization Schedule
  const yearlySchedule = useMemo(() => {
    let balance = loanAmount;
    const schedule = [];
    const numYears = Math.ceil(calculatedTotalMonths / 12);

    for (let yr = 1; yr <= numYears; yr++) {
      let yrPrincipal = 0;
      let yrInterest = 0;
      const startBalance = balance;
      const monthsInThisYear = Math.min(12, calculatedTotalMonths - (yr - 1) * 12);

      for (let m = 1; m <= monthsInThisYear; m++) {
        const mInterest = balance * monthlyRate;
        const mPrincipal = Math.min(balance, emi - mInterest);
        yrInterest += mInterest;
        yrPrincipal += mPrincipal;
        balance = Math.max(0, balance - mPrincipal);
      }

      schedule.push({
        year: yr,
        openingBalance: startBalance,
        principalPaid: yrPrincipal,
        interestPaid: yrInterest,
        totalPaid: yrPrincipal + yrInterest,
        closingBalance: balance,
      });
    }
    return schedule;
  }, [loanAmount, calculatedTotalMonths, monthlyRate, emi]);

  const monthlySchedule = useMemo(() => {
    let balance = loanAmount;
    const schedule = [];

    for (let m = 1; m <= calculatedTotalMonths; m++) {
      const startBalance = balance;
      const mInterest = balance * monthlyRate;
      const mPrincipal = Math.min(balance, emi - mInterest);
      balance = Math.max(0, balance - mPrincipal);

      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        monthInYear: ((m - 1) % 12) + 1,
        openingBalance: startBalance,
        principalPaid: mPrincipal,
        interestPaid: mInterest,
        totalPaid: mPrincipal + mInterest,
        closingBalance: balance,
      });
    }
    return schedule;
  }, [loanAmount, calculatedTotalMonths, monthlyRate, emi]);

  // JSON Export
  const handleExportJson = () => {
    const report = {
      calculator: 'Business Loan EMI Calculator',
      currency: 'INR',
      parameters: {
        loanAmount,
        interestRateAnnualPercent: interestRate,
        tenureYears: calculatedTotalMonths / 12,
        tenureMonths: calculatedTotalMonths,
        hasProcessingFee: enableProcessingFee,
        processingFeeAmount: enableProcessingFee ? processingFeeAmount : 0,
        totalUpfrontFee: enableProcessingFee ? totalUpfrontFee : 0,
      },
      results: {
        monthlyEmi: Math.round(emi),
        principalAmount: loanAmount,
        totalInterestPayable: Math.round(totalInterest),
        totalRepayment: Math.round(totalPayment),
        netDisbursedAmount: enableProcessingFee ? Math.round(netDisbursed) : loanAmount,
        totalCostOfBorrowing: Math.round(totalCostOfLoan),
      },
      amortizationSummary: yearlySchedule.map((row) => ({
        year: row.year,
        openingBalance: Math.round(row.openingBalance),
        principalPaid: Math.round(row.principalPaid),
        interestPaid: Math.round(row.interestPaid),
        totalPayment: Math.round(row.totalPaid),
        closingBalance: Math.round(row.closingBalance),
      })),
      generatedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `business_loan_emi_plan_${Date.now()}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Main Workspace (Split Grid) - At Very Top */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INTERACTIVE INPUT CONTROLS (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-[#222325] flex items-center gap-2">
              <CalcIcon className="w-4 h-4 text-[#1dbf73]" />
              <span>Input Business Loan Parameters</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                title="Export plan JSON"
              >
                <Download className="w-3.5 h-3.5 text-[#1dbf73]" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 cursor-pointer"
                title="Print report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <span className="text-xs font-bold text-slate-500 ml-1">₹ INR</span>
            </div>
          </div>

          {/* 1. Loan Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                1. Business Loan Amount (Principal)
              </label>
              <span className="text-xs font-extrabold text-[#1dbf73] bg-[#f4fdf8] border border-[#d8f5e5] px-2.5 py-0.5 rounded-full">
                {formatLakhs(loanAmount)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min={50000}
                max={100000000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
              />
            </div>

            <input
              type="range"
              min={100000}
              max={10000000}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
              className="w-full accent-[#1dbf73] cursor-pointer"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[500000, 1000000, 2000000, 2500000, 5000000, 10000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                    loanAmount === amt
                      ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {formatLakhs(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interest Rate & Tenure Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  2. Annual Interest Rate (% p.a.)
                </label>
                <span className="text-xs font-bold text-emerald-700">{interestRate}%</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={36}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full pr-8 pl-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={24}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className="w-full accent-[#1dbf73] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>PSU Banks (8.5-12%)</span>
                <span>NBFCs (14-20%)</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  3. Loan Tenure
                </label>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setTenureUnit('years');
                      setTenureYears(Math.max(1, Math.round(calculatedTotalMonths / 12)));
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      tenureUnit === 'years' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTenureUnit('months');
                      setTenureMonthsInput(calculatedTotalMonths);
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      tenureUnit === 'months' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500'
                    }`}
                  >
                    Months
                  </button>
                </div>
              </div>

              {tenureUnit === 'years' ? (
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full pr-12 pl-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(parseInt(e.target.value) || 1)}
                    className="w-full mt-2 accent-[#1dbf73] cursor-pointer"
                  />
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      min={6}
                      max={180}
                      value={tenureMonthsInput}
                      onChange={(e) => setTenureMonthsInput(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full pr-14 pl-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={120}
                    step={3}
                    value={tenureMonthsInput}
                    onChange={(e) => setTenureMonthsInput(parseInt(e.target.value) || 1)}
                    className="w-full mt-2 accent-[#1dbf73] cursor-pointer"
                  />
                </div>
              )}

              <div className="text-[10px] text-slate-500 font-medium">
                Total Repayment Period: <strong>{calculatedTotalMonths} Months</strong> ({ (calculatedTotalMonths / 12).toFixed(1) } Years)
              </div>
            </div>
          </div>

          {/* 4. OPTIONAL PROCESSING FEES SECTION */}
          <div className="pt-4 border-t border-slate-100 space-y-4 bg-[#fafbfc] p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-xs font-bold text-[#222325] cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableProcessingFee}
                  onChange={(e) => setEnableProcessingFee(e.target.checked)}
                  className="w-4 h-4 text-[#1dbf73] rounded border-slate-300 focus:ring-[#1dbf73] cursor-pointer"
                />
                <span>Include Processing Fees &amp; Deductions (Optional)</span>
              </label>
              <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>

            {enableProcessingFee && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Fee Calculation Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFeeType('percent')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          feeType === 'percent'
                            ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        % of Loan
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeeType('flat')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          feeType === 'flat'
                            ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Flat Fee (₹)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {feeType === 'percent' ? 'Fee Percentage (%)' : 'Flat Fee Amount (₹)'}
                    </label>
                    {feeType === 'percent' ? (
                      <div className="relative">
                        <input
                          type="number"
                          step="0.25"
                          min={0}
                          max={10}
                          value={feePercent}
                          onChange={(e) => setFeePercent(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full pr-8 pl-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          %
                        </span>
                      </div>
                    ) : (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          step={1000}
                          min={0}
                          value={feeFlatAmount}
                          onChange={(e) => setFeeFlatAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full pl-7 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                  <span>Upfront Processing Fee:</span>
                  <span className="font-mono font-bold text-slate-700">
                    {formatINR(totalUpfrontFee)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY RESULTS SUMMARY (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Monthly Repayment Summary</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                FY 2026-27
              </span>
            </div>

            {/* Prominent Monthly EMI */}
            <div className="bg-slate-800/70 p-4 sm:p-5 rounded-2xl border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Monthly EMI
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#1dbf73]/20 text-[#1dbf73] text-[10px] font-extrabold uppercase border border-[#1dbf73]/30">
                  Fixed Monthly
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#1dbf73] tracking-tight">
                {formatINR(emi)}
              </div>
              <p className="text-xs text-slate-300">
                The estimated amount payable every month.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-between border-t border-slate-700/60">
                <span>Daily servicing run-rate:</span>
                <strong className="text-slate-200">{formatINR(emi / 30)} / day</strong>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between items-center">
                <span>Principal Borrowed:</span>
                <span className="font-bold text-white text-sm">{formatINR(loanAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Interest Payable:</span>
                <span className="font-bold text-amber-400 text-sm">{formatINR(totalInterest)}</span>
              </div>

              {enableProcessingFee && (
                <>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Upfront Processing Fee:</span>
                    <span className="font-semibold text-rose-300">{formatINR(totalUpfrontFee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 font-bold">
                    <span>Net Amount Credited (Disbursal):</span>
                    <span>{formatINR(netDisbursed)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-slate-800 font-bold text-white text-base">
                <span>Total Repayment:</span>
                <span className="text-[#1dbf73]">{formatINR(totalPayment)}</span>
              </div>

              {enableProcessingFee && (
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>Total Cost (Repayment + Fees):</span>
                  <span className="font-bold text-white">{formatINR(totalCostOfLoan)}</span>
                </div>
              )}
            </div>

            {/* Visual Breakdown Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-emerald-400">Principal: {principalRatio.toFixed(1)}%</span>
                <span className="text-amber-400">Interest: {interestRatio.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${principalRatio}%` }} className="bg-[#1dbf73] transition-all duration-300" />
                <div style={{ width: `${interestRatio}%` }} className="bg-amber-400 transition-all duration-300" />
              </div>
            </div>

            {/* Quick DSCR & Tax Advice Callout */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Business Income Tax Benefit</span>
              </div>
              <p>Interest paid on business loans and processing fee charges are classified as legitimate business revenue expenses, deductible from gross taxable business profits under the Income Tax Act.</p>
            </div>

            <button
              type="button"
              onClick={handleExportJson}
              className="w-full py-3 rounded-2xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Calculation Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* AMORTISATION SCHEDULE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#222325] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#1dbf73]" />
              <span>Business Loan Amortisation Schedule</span>
            </h3>
            <p className="text-xs text-[#74767e]">
              Detailed breakdown illustrating how each periodic instalment reduces principal balance versus interest cost
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setAmortizationView('yearly')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  amortizationView === 'yearly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly View
              </button>
              <button
                type="button"
                onClick={() => setAmortizationView('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  amortizationView === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly View ({calculatedTotalMonths} Months)
              </button>
            </div>
          </div>
        </div>

        {amortizationView === 'yearly' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                  <th className="p-3">Year</th>
                  <th className="p-3">Opening Balance (₹)</th>
                  <th className="p-3">Principal Paid (₹)</th>
                  <th className="p-3">Interest Paid (₹)</th>
                  <th className="p-3">Total Annual Payment (₹)</th>
                  <th className="p-3">Closing Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#404145]">
                {yearlySchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-[#222325]">Year {row.year}</td>
                    <td className="p-3 text-slate-600">{formatINR(row.openingBalance)}</td>
                    <td className="p-3 font-semibold text-emerald-700">{formatINR(row.principalPaid)}</td>
                    <td className="p-3 font-semibold text-amber-700">{formatINR(row.interestPaid)}</td>
                    <td className="p-3 font-bold text-[#222325]">{formatINR(row.totalPaid)}</td>
                    <td className="p-3 font-bold text-slate-800">{formatINR(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-slate-100 text-slate-900 font-bold border-b border-slate-200 z-10">
                  <tr>
                    <th className="p-3">Month</th>
                    <th className="p-3">Opening Balance (₹)</th>
                    <th className="p-3">Principal (₹)</th>
                    <th className="p-3">Interest (₹)</th>
                    <th className="p-3">Total Monthly EMI (₹)</th>
                    <th className="p-3">Closing Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#404145]">
                  {(showFullSchedule ? monthlySchedule : monthlySchedule.slice(0, 24)).map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-[#222325]">Month {row.month} (Yr {row.year})</td>
                      <td className="p-3 text-slate-600">{formatINR(row.openingBalance)}</td>
                      <td className="p-3 font-semibold text-emerald-700">{formatINR(row.principalPaid)}</td>
                      <td className="p-3 font-semibold text-amber-700">{formatINR(row.interestPaid)}</td>
                      <td className="p-3 font-bold text-[#222325]">{formatINR(row.totalPaid)}</td>
                      <td className="p-3 font-bold text-slate-800">{formatINR(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {monthlySchedule.length > 24 && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  {showFullSchedule ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Show Less (First 24 Months)</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>View Full {monthlySchedule.length} Months Schedule</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
