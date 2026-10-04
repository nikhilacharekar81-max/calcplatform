import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Calculator } from '../../types/schema.ts';
import { calculateTermLifeInsurance } from '../../calculators/india/insurance/life.ts';

interface TermInsuranceCalculatorAppProps {
  calculator?: Calculator;
}

export const TermInsuranceCalculatorApp: React.FC<TermInsuranceCalculatorAppProps> = () => {
  // 10 Inputs requested by the user
  const [age, setAge] = useState<number>(30);
  const [annualIncome, setAnnualIncome] = useState<number>(1200000); // ₹12 Lakh
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000); // ₹50,000 / mo
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [dependents, setDependents] = useState<number>(3);
  const [outstandingLoans, setOutstandingLoans] = useState<number>(2500000); // ₹25 Lakh
  const [existingLifeCover, setExistingLifeCover] = useState<number>(2000000); // ₹20 Lakh
  const [savingsInvestments, setSavingsInvestments] = useState<number>(1500000); // ₹15 Lakh
  const [futureFinancialGoals, setFutureFinancialGoals] = useState<number>(3000000); // ₹30 Lakh
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6%

  // Execute mathematical engine
  const result = calculateTermLifeInsurance({
    age,
    annualIncome,
    monthlyExpenses,
    retirementAge,
    dependents,
    outstandingLoans,
    existingLifeCover,
    existingSavings: savingsInvestments,
    futureFinancialGoals,
    inflationRate,
  });

  const formatINR = (val: number) => {
    if (isNaN(val) || val === null || val === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatShort = (val: number) => {
    if (isNaN(val) || val === 0) return '₹0';
    if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (Math.abs(val) >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Stacked Bar Chart Data
  // Bar 1: Stacked segments showing Income Replacement + Outstanding Loans + Future Goals.
  // Bar 2: Existing Life Cover + Savings/Investments, with the remaining delta clearly visualizing the Protection Gap.
  const chartData = [
    {
      name: 'Total Needs Breakdown',
      incomeReplacement: result.incomeReplacement,
      loanProtection: result.loanProtection,
      goalProtection: result.goalProtection,
      existingCover: 0,
      savingsInvestments: 0,
      protectionGap: 0,
    },
    {
      name: 'Existing Setup',
      incomeReplacement: 0,
      loanProtection: 0,
      goalProtection: 0,
      existingCover: result.existingCover,
      savingsInvestments: savingsInvestments,
      protectionGap: result.protectionGap,
    },
  ];

  return (
    <div className="space-y-10 font-sans text-[#404145]">
      {/* Main Grid: Inputs on Left, Output & Charts on Right */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 10 Inputs with Paired Sliders & Number Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#222325] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
              Personal & Financial Inputs
            </h2>
            <p className="text-xs text-[#74767e] mt-1">
              Adjust your profile parameters. Every slider is synchronized with direct keyboard entry.
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. Age */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Current Age</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={18}
                    max={65}
                    step={1}
                    value={age || ''}
                    onChange={(e) => setAge(e.target.value === '' ? 18 : Math.min(65, Math.max(18, Number(e.target.value))))}
                    className="w-16 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">Yrs</span>
                </div>
              </div>
              <input
                type="range"
                min={18}
                max={65}
                step={1}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>18 Yrs</span>
                <span>65 Yrs</span>
              </div>
            </div>

            {/* 2. Annual Income */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Gross Annual Income</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={100000}
                    max={100000000}
                    step={50000}
                    value={annualIncome || ''}
                    onChange={(e) => setAnnualIncome(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={100000}
                max={10000000}
                step={50000}
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹1 Lakh</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* 3. Monthly Expenses */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Monthly Living Expenses</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={10000}
                    max={1000000}
                    step={5000}
                    value={monthlyExpenses || ''}
                    onChange={(e) => setMonthlyExpenses(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-24 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">/mo</span>
                </div>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹10,000</span>
                <span>₹5 Lakh</span>
              </div>
            </div>

            {/* 4. Retirement Age */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Retirement Age</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={45}
                    max={75}
                    step={1}
                    value={retirementAge || ''}
                    onChange={(e) => setRetirementAge(e.target.value === '' ? 60 : Math.min(75, Math.max(45, Number(e.target.value))))}
                    className="w-16 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">Yrs</span>
                </div>
              </div>
              <input
                type="range"
                min={45}
                max={75}
                step={1}
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>45 Yrs</span>
                <span>75 Yrs</span>
              </div>
            </div>

            {/* 5. Dependents */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Number of Dependents</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={1}
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value === '' ? 0 : Math.min(10, Math.max(0, Number(e.target.value))))}
                    className="w-16 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">Members</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>0 (None)</span>
                <span>10 Dependents</span>
              </div>
            </div>

            {/* 6. Outstanding Loans */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Outstanding Loans & Debts</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={outstandingLoans || ''}
                    onChange={(e) => setOutstandingLoans(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={50000}
                value={outstandingLoans}
                onChange={(e) => setOutstandingLoans(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0 (Debt Free)</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            {/* 7. Existing Life Cover */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Existing Life Cover</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={existingLifeCover || ''}
                    onChange={(e) => setExistingLifeCover(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={50000}
                value={existingLifeCover}
                onChange={(e) => setExistingLifeCover(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            {/* 8. Savings / Investments */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Savings & Liquid Investments</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={savingsInvestments || ''}
                    onChange={(e) => setSavingsInvestments(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={50000}
                value={savingsInvestments}
                onChange={(e) => setSavingsInvestments(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            {/* 9. Future Financial Goals */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Future Financial Goals (Education, Marriage)</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={futureFinancialGoals || ''}
                    onChange={(e) => setFutureFinancialGoals(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={50000}
                value={futureFinancialGoals}
                onChange={(e) => setFutureFinancialGoals(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            {/* 10. Inflation Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Expected Inflation Rate</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={3}
                    max={12}
                    step={0.5}
                    value={inflationRate || ''}
                    onChange={(e) => setInflationRate(e.target.value === '' ? 6 : Math.min(12, Math.max(3, Number(e.target.value))))}
                    className="w-16 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">%</span>
                </div>
              </div>
              <input
                type="range"
                min={3}
                max={12}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>3.0% (Low)</span>
                <span>12.0% (High)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 6 Outputs & Stacked Bar Chart */}
        <div className="lg:col-span-6 space-y-6">
          {/* Primary Recommended Hero Card */}
          <div className="bg-gradient-to-br from-[#0c2a1a] via-[#103a22] to-[#081e13] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1dbf73]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1dbf73]/20 border border-[#1dbf73]/30 text-xs font-bold text-[#1dbf73]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Actuarial Protection Summary
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  {retirementAge - age} Working Yrs Remaining
                </span>
              </div>

              <div>
                <p className="text-xs text-emerald-200 font-medium">Recommended Life Cover</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {formatINR(result.recommendedLifeCover)}
                  </h3>
                  <span className="text-sm font-semibold text-[#1dbf73]">
                    ({result.recommendedSumAssuredFormatted})
                  </span>
                </div>
              </div>

              {/* 3 Core Summary Outputs */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-800/40">
                <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
                  <p className="text-[11px] text-emerald-300/80 font-medium">Existing Cover</p>
                  <p className="text-base sm:text-lg font-bold text-white mt-0.5">{formatINR(result.existingCover)}</p>
                </div>
                <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20">
                  <p className="text-[11px] text-emerald-300/80 font-medium">Net Protection Gap</p>
                  <p className={`text-base sm:text-lg font-bold mt-0.5 ${result.protectionGap > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatINR(result.protectionGap)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Protection Components Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-blue-600 block">Income Replacement</span>
              <p className="text-base font-extrabold text-[#222325]">{formatINR(result.incomeReplacement)}</p>
              <p className="text-[10px] text-slate-500">Living costs for {retirementAge - age} yrs</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-amber-600 block">Loan Protection</span>
              <p className="text-base font-extrabold text-[#222325]">{formatINR(result.loanProtection)}</p>
              <p className="text-[10px] text-slate-500">Full liability liquidation</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-purple-600 block">Goal Protection</span>
              <p className="text-base font-extrabold text-[#222325]">{formatINR(result.goalProtection)}</p>
              <p className="text-[10px] text-slate-500">Future education & milestones</p>
            </div>
          </div>

          {/* Stacked Bar Chart: Visual Breakdown Requested by User */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#222325] flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-[#1dbf73]" />
                  Total Needs vs Existing Setup (Stacked Breakdown)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Visualizing how existing assets offset total needs to form the Protection Gap.
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#64748b" tickLine={false} />
                  <YAxis fontSize={11} stroke="#64748b" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatINR(Number(value)),
                      name === 'incomeReplacement' ? 'Income Replacement' :
                      name === 'loanProtection' ? 'Outstanding Loans' :
                      name === 'goalProtection' ? 'Future Financial Goals' :
                      name === 'existingCover' ? 'Existing Life Cover' :
                      name === 'savingsInvestments' ? 'Savings & Liquid Investments' :
                      name === 'protectionGap' ? 'Net Protection Gap' : name
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    formatter={(val) => {
                      if (val === 'incomeReplacement') return 'Income Replacement';
                      if (val === 'loanProtection') return 'Loan Protection';
                      if (val === 'goalProtection') return 'Goal Protection';
                      if (val === 'existingCover') return 'Existing Cover';
                      if (val === 'savingsInvestments') return 'Savings/Investments';
                      if (val === 'protectionGap') return 'Protection Gap';
                      return val;
                    }}
                  />
                  {/* Bar 1: Needs segments */}
                  <Bar dataKey="incomeReplacement" stackId="needs" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="loanProtection" stackId="needs" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="goalProtection" stackId="needs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />

                  {/* Bar 2: Setup segments */}
                  <Bar dataKey="existingCover" stackId="setup" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="savingsInvestments" stackId="setup" fill="#06b6d4" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="protectionGap" stackId="setup" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tax & Regulatory Advisory:</strong> Term insurance premiums qualify for tax deduction under <strong>Section 80C</strong> up to ₹1.5 Lakh/year. Death benefits are 100% tax-free under <strong>Section 10(10D)</strong>. Individual term plans are exempt from GST (0%).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
