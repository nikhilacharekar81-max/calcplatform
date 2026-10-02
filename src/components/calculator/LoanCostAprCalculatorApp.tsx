import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  Percent,
  Calendar,
  DollarSign,
  TrendingUp,
  Info,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Calculator } from '../../types/schema.ts';

interface LoanCostAprCalculatorAppProps {
  calculator: Calculator;
}

export const LoanCostAprCalculatorApp: React.FC<LoanCostAprCalculatorAppProps> = ({ calculator }) => {
  const [loanAmount, setLoanAmount] = useState<number>(1000000); // ₹10 Lakh
  const [interestRate, setInterestRate] = useState<number>(10.0); // 10% p.a.
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [tenureValue, setTenureValue] = useState<number>(5); // 5 Years or 60 Months
  
  // Upfront Fees & Charges
  const [feeType, setFeeType] = useState<'amount' | 'percent'>('amount');
  const [feeValue, setFeeValue] = useState<number>(15000); // ₹15,000 or 1.5%

  // Format currency helper
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(isNaN(val) ? 0 : val);
  };

  const formatLakhsWords = (val: number) => {
    if (isNaN(val) || val <= 0) return '';
    if (val >= 10000000) return `(${(val / 10000000).toFixed(2)} Crore)`;
    if (val >= 100000) return `(${(val / 100000).toFixed(2)} Lakhs)`;
    if (val >= 1000) return `(${(val / 1000).toFixed(1)} Thousand)`;
    return '';
  };

  // Convert tenure to total months
  const totalMonths = tenureUnit === 'years' ? Math.round((tenureValue || 0) * 12) : Math.round(tenureValue || 0);

  // Upfront Fees calculation
  const upfrontFees = feeType === 'amount' ? (feeValue || 0) : ((loanAmount || 0) * (feeValue || 0)) / 100;

  // Net Cash Disbursed
  const netCashDisbursed = Math.max(0, (loanAmount || 0) - upfrontFees);

  // Monthly EMI Calculation
  const monthlyRate = (interestRate || 0) / (12 * 100);
  const emi = totalMonths > 0
    ? (monthlyRate > 0
        ? ((loanAmount || 0) * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
        : (loanAmount || 0) / totalMonths)
    : 0;

  // Total Repayment & Interest
  const totalRepayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - (loanAmount || 0));

  // Total Outflow (Cost of Borrowing) = Total Repayment + Upfront Fees
  const totalOutflow = totalRepayment + upfrontFees;

  // Effective APR calculation using Newton-Raphson method
  const calculateEffectiveApr = () => {
    if (netCashDisbursed <= 0 || totalMonths <= 0 || emi <= 0) return interestRate || 0;
    
    let r = monthlyRate > 0 ? monthlyRate : 0.01;
    
    for (let i = 0; i < 50; i++) {
      let pv = 0;
      let dpv = 0;
      for (let t = 1; t <= totalMonths; t++) {
        const discount = Math.pow(1 + r, t);
        pv += emi / discount;
        dpv -= t * emi / (discount * (1 + r));
      }
      const diff = pv - netCashDisbursed;
      if (Math.abs(diff) < 1e-6) break;
      const step = diff / dpv;
      r -= step;
      if (r <= 0) r = 0.0001;
    }
    
    const effectiveAnnualRate = r * 12 * 100;
    return isNaN(effectiveAnnualRate) ? (interestRate || 0) : Math.max(0, effectiveAnnualRate);
  };

  const effectiveApr = calculateEffectiveApr();

  return (
    <div className="space-y-10 font-sans text-[#404145]">
      {/* Calculator Tool Card */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-[#e4e5e7]">
            <div className="p-2.5 rounded-2xl bg-[#f4fdf8] text-[#1dbf73]">
              <CalcIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#222325]">Loan Cost & APR Calculator</h2>
              <p className="text-xs text-[#74767e]">Compare advertised rates vs. true borrowing cost with upfront fees factored in.</p>
            </div>
          </div>

          {/* 1. Sanctioned Loan Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="loan-amount-input" className="text-sm font-bold text-[#222325]">
                Sanctioned Loan Amount (Principal)
              </label>
              <span className="text-xs font-medium text-[#1dbf73]">
                {formatLakhsWords(loanAmount)}
              </span>
            </div>
            <div className="relative rounded-2xl border-2 border-slate-200 focus-within:border-[#1dbf73] transition-all bg-slate-50/50 flex items-center overflow-hidden">
              <span className="pl-4 pr-2 text-slate-500 font-bold text-base select-none">₹</span>
              <input
                id="loan-amount-input"
                type="number"
                min={10000}
                max={500000000}
                step={10000}
                value={loanAmount || ''}
                onChange={(e) => setLoanAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="Enter sanctioned loan amount"
                className="w-full py-3 pr-4 bg-transparent text-[#222325] font-black text-lg focus:outline-none"
              />
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[200000, 500000, 1000000, 2500000, 5000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmount(amt)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                    loanAmount === amt
                      ? 'bg-[#f4fdf8] border-[#1dbf73] text-[#1dbf73]'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  ₹{amt >= 10000000 ? `${amt / 10000000} Cr` : amt >= 100000 ? `${amt / 100000} L` : `${amt / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Advertised Interest Rate Input */}
          <div className="space-y-2">
            <label htmlFor="interest-rate-input" className="text-sm font-bold text-[#222325]">
              Advertised Interest Rate (% p.a.)
            </label>
            <div className="relative rounded-2xl border-2 border-slate-200 focus-within:border-[#1dbf73] transition-all bg-slate-50/50 flex items-center overflow-hidden">
              <input
                id="interest-rate-input"
                type="number"
                min={1}
                max={50}
                step={0.1}
                value={interestRate || ''}
                onChange={(e) => setInterestRate(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="Enter advertised interest rate"
                className="w-full py-3 pl-4 pr-12 bg-transparent text-[#222325] font-black text-lg focus:outline-none"
              />
              <span className="absolute right-4 text-slate-500 font-bold text-sm select-none">% p.a.</span>
            </div>
            {/* Quick Interest Rate Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[8.5, 9.5, 10.5, 12.0, 14.0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setInterestRate(rate)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                    interestRate === rate
                      ? 'bg-[#f4fdf8] border-[#1dbf73] text-[#1dbf73]'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Loan Tenure Input & Toggle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="tenure-value-input" className="text-sm font-bold text-[#222325]">
                Loan Tenure
              </label>
              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (tenureUnit === 'months') {
                      setTenureUnit('years');
                      setTenureValue(Math.max(1, Math.round(tenureValue / 12)));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    tenureUnit === 'years' ? 'bg-white text-[#222325] shadow-xs' : 'text-[#74767e]'
                  }`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tenureUnit === 'years') {
                      setTenureUnit('months');
                      setTenureValue(Math.min(360, Math.round(tenureValue * 12)));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    tenureUnit === 'months' ? 'bg-white text-[#222325] shadow-xs' : 'text-[#74767e]'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>
            <div className="relative rounded-2xl border-2 border-slate-200 focus-within:border-[#1dbf73] transition-all bg-slate-50/50 flex items-center overflow-hidden">
              <input
                id="tenure-value-input"
                type="number"
                min={1}
                max={tenureUnit === 'years' ? 40 : 480}
                step={1}
                value={tenureValue || ''}
                onChange={(e) => setTenureValue(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder={`Enter tenure in ${tenureUnit}`}
                className="w-full py-3 pl-4 pr-24 bg-transparent text-[#222325] font-black text-lg focus:outline-none"
              />
              <span className="absolute right-4 text-slate-500 font-bold text-sm select-none">
                {tenureUnit === 'years' ? (tenureValue === 1 ? 'Year' : 'Years') : (tenureValue === 1 ? 'Month' : 'Months')} ({totalMonths} mos)
              </span>
            </div>
          </div>

          {/* 4. Upfront Fees & Charges Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label htmlFor="fee-value-input" className="text-sm font-bold text-[#222325]">
                Upfront Fees & Charges (Processing, Legal, etc.)
              </label>
              <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFeeType('amount')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    feeType === 'amount' ? 'bg-white text-[#222325] shadow-xs' : 'text-[#74767e]'
                  }`}
                >
                  ₹ Amount
                </button>
                <button
                  type="button"
                  onClick={() => setFeeType('percent')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    feeType === 'percent' ? 'bg-white text-[#222325] shadow-xs' : 'text-[#74767e]'
                  }`}
                >
                  % Loan
                </button>
              </div>
            </div>
            <div className="relative rounded-2xl border-2 border-slate-200 focus-within:border-[#1dbf73] transition-all bg-slate-50/50 flex items-center overflow-hidden">
              {feeType === 'amount' && (
                <span className="pl-4 pr-1 text-slate-500 font-bold text-base select-none">₹</span>
              )}
              <input
                id="fee-value-input"
                type="number"
                min={0}
                max={feeType === 'amount' ? 10000000 : 20}
                step={feeType === 'amount' ? 500 : 0.1}
                value={feeValue || ''}
                onChange={(e) => setFeeValue(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder={feeType === 'amount' ? 'Enter fee amount in ₹' : 'Enter fee as % of loan'}
                className="w-full py-3 px-4 bg-transparent text-[#222325] font-black text-lg focus:outline-none"
              />
              {feeType === 'percent' && (
                <span className="pr-4 text-slate-500 font-bold text-sm select-none">%</span>
              )}
            </div>
            <p className="text-xs text-[#74767e]">
              Calculated Upfront Deduction: <strong className="text-[#222325]">{formatINR(upfrontFees)}</strong>
            </p>
          </div>
        </div>

        {/* Right Outputs Summary Card ("Aha!" Moment) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0a2e15] via-[#0f3d1b] to-[#013a12] rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>True Cost & APR Insights</span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-white">Summary of Borrowing</h3>
          </div>

          <div className="space-y-4 divide-y divide-emerald-800/50">
            {/* Monthly EMI */}
            <div className="pt-2 flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-200/80 font-medium">Monthly EMI</p>
                <p className="text-xs text-emerald-300/60">Standard monthly installment</p>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">{formatINR(emi)}</p>
            </div>

            {/* Net Cash Disbursed */}
            <div className="pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-200/80 font-medium">Net Cash Disbursed</p>
                <p className="text-xs text-emerald-300/60">Loan amount minus upfront fees</p>
              </div>
              <p className="text-lg sm:text-xl font-bold text-emerald-200">{formatINR(netCashDisbursed)}</p>
            </div>

            {/* Total Interest Payable */}
            <div className="pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-200/80 font-medium">Total Interest Payable</p>
                <p className="text-xs text-emerald-300/60">Over {totalMonths} months</p>
              </div>
              <p className="text-lg sm:text-xl font-bold text-amber-300">{formatINR(totalInterest)}</p>
            </div>

            {/* Total Outflow */}
            <div className="pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-200/80 font-medium">Total Outflow (Cost)</p>
                <p className="text-xs text-emerald-300/60">Repayment + All Fees</p>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white">{formatINR(totalOutflow)}</p>
            </div>

            {/* Effective APR / True Borrowing Cost */}
            <div className="pt-4 flex justify-between items-center bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30">
              <div>
                <p className="text-sm font-bold text-emerald-200">Effective APR (True Cost)</p>
                <p className="text-xs text-emerald-300/70">Factoring in upfront deductions</p>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-black text-amber-400">{effectiveApr.toFixed(2)}%</p>
                <p className="text-[10px] text-emerald-300">Advertised: {(interestRate || 0).toFixed(2)}%</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 flex items-start gap-2.5 text-xs text-emerald-100">
            <Info className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <span>Because processing fees are deducted upfront, you receive less cash than sanctioned while paying interest on the full principal — pushing your Effective APR higher than the advertised rate.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
