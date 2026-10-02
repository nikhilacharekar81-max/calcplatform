import React, { useState, useMemo } from 'react';
import { Calculator, Sparkles, CheckCircle2 } from 'lucide-react';

export const FlatVsReducingCalculatorApp: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const calculations = useMemo(() => {
    const P = loanAmount;
    const R = interestRate;
    const N = tenureYears;
    const months = N * 12;

    // 1. Flat Rate Calculation
    const flatTotalInterest = P * (R / 100) * N;
    const flatTotalRepayment = P + flatTotalInterest;
    const flatEmi = Math.round(flatTotalRepayment / months);

    // 2. Reducing Balance Calculation
    const monthlyRate = R / 12 / 100;
    let reducingEmi = 0;
    if (monthlyRate > 0) {
      reducingEmi = Math.round(
        (P * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
      );
    } else {
      reducingEmi = Math.round(P / months);
    }

    const reducingTotalRepayment = reducingEmi * months;
    const reducingTotalInterest = Math.max(0, reducingTotalRepayment - P);

    // Savings
    const interestSavings = Math.max(0, flatTotalInterest - reducingTotalInterest);
    const emiDifference = Math.max(0, flatEmi - reducingEmi);

    return {
      flatEmi,
      flatTotalInterest,
      flatTotalRepayment,
      reducingEmi,
      reducingTotalInterest,
      reducingTotalRepayment,
      interestSavings,
      emiDifference,
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatRupee = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-8 my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1dbf73] text-white flex items-center justify-center shadow-md">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-[#1dbf73] uppercase tracking-wider">
              Interactive Comparison Tool
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Flat Rate vs. Reducing Balance Loan Calculator
            </h3>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Math Engine</span>
        </span>
      </div>

      {/* Main Grid: Control Panel + Results Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Control Panel */}
        <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-6">
          <h4 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Control Panel</span>
            <span className="text-[10px] text-slate-400 font-normal">(Input Numbers)</span>
          </h4>

          {/* Input 1: Loan Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-300">Loan Amount</label>
              <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-[#1dbf73]">₹</span>
                <input
                  type="number"
                  min={50000}
                  max={5000000}
                  step={10000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(50000, Math.min(5000000, Number(e.target.value) || 50000)))}
                  className="w-28 text-right bg-transparent text-sm font-black text-white focus:outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min={50000}
              max={5000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#1dbf73] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>₹50,000</span>
              <span>₹25,00,000</span>
              <span>₹50,00,000</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[100000, 300000, 500000, 1000000, 2000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    loanAmount === amt
                      ? 'bg-[#1dbf73] text-white'
                      : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  ₹{(amt / 100000).toFixed(0)} Lakh{amt >= 200000 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Interest Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-300">Interest Rate (% p.a.)</label>
              <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                <input
                  type="number"
                  min={5}
                  max={25}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(5, Math.min(25, Number(e.target.value) || 5)))}
                  className="w-16 text-right bg-transparent text-sm font-black text-white focus:outline-none"
                />
                <span className="text-xs font-bold text-[#1dbf73]">%</span>
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#1dbf73] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>5%</span>
              <span>15%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Input 3: Tenure */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-300">Loan Tenure</label>
              <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-sm font-black text-white">{tenureYears}</span>
                <span className="text-xs font-bold text-slate-400">Years</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={0.5}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#1dbf73] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>1 Year</span>
              <span>4 Years</span>
              <span>7 Years</span>
            </div>
          </div>
        </div>

        {/* Right Column: Results Panel (Side-by-Side Comparison) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Results Panel</span>
              <span className="text-[10px] text-[#1dbf73] font-bold">Side-by-Side Comparison</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Flat Rate Option */}
              <div className="bg-slate-800/90 p-5 rounded-2xl border border-rose-500/30 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-bl-xl border-l border-b border-rose-500/30">
                  Higher Cost
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">Option 1</span>
                  <h5 className="text-base font-black text-white">Flat Rate Loan</h5>
                  <p className="text-[11px] text-slate-400">Interest calculated on full principal throughout</p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-700/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Monthly EMI:</span>
                    <span className="text-sm font-black text-white">{formatRupee(calculations.flatEmi)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Total Interest Paid:</span>
                    <span className="text-sm font-extrabold text-rose-400">{formatRupee(calculations.flatTotalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-700/50">
                    <span className="text-slate-300 font-bold">Total Repayment:</span>
                    <span className="text-sm font-black text-white">{formatRupee(calculations.flatTotalRepayment)}</span>
                  </div>
                </div>
              </div>

              {/* Option B: Reducing Balance Option */}
              <div className="bg-slate-800/90 p-5 rounded-2xl border-2 border-[#1dbf73] space-y-4 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 bg-[#1dbf73] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-bl-xl shadow-xs">
                  Cheaper Option
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#1dbf73] uppercase tracking-wider">Option 2 (Recommended)</span>
                  <h5 className="text-base font-black text-white">Reducing Balance Loan</h5>
                  <p className="text-[11px] text-slate-400">Interest calculated on outstanding principal balance</p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-700/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Monthly EMI:</span>
                    <span className="text-sm font-black text-emerald-400">{formatRupee(calculations.reducingEmi)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Total Interest Paid:</span>
                    <span className="text-sm font-extrabold text-[#1dbf73]">{formatRupee(calculations.reducingTotalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-700/50">
                    <span className="text-slate-300 font-bold">Total Repayment:</span>
                    <span className="text-sm font-black text-white">{formatRupee(calculations.reducingTotalRepayment)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlight Box: Savings Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-[#1dbf73] text-white shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Smart Financial Choice</span>
            </div>
            <p className="text-sm sm:text-base font-black text-white leading-snug">
              By choosing a reducing-balance loan instead of a flat rate at the same nominal percentage of{' '}
              <span className="text-[#1dbf73]">{interestRate}%</span>, you save{' '}
              <span className="text-[#1dbf73] underline underline-offset-4 decoration-2">
                {formatRupee(calculations.interestSavings)}
              </span>{' '}
              in total interest!
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Your monthly EMI is also <span className="font-bold text-white">{formatRupee(calculations.emiDifference)} lower</span> every month!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
