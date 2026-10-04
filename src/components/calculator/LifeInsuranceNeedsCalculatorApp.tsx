import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  DollarSign,
  BarChart2,
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
import { calculateLifeInsuranceNeeds } from '../../calculators/india/insurance/life.ts';

interface LifeInsuranceNeedsCalculatorAppProps {
  calculator?: Calculator;
}

export const LifeInsuranceNeedsCalculatorApp: React.FC<LifeInsuranceNeedsCalculatorAppProps> = () => {
  // 12 Inputs requested by user
  const [age, setAge] = useState<number>(32);
  const [annualIncome, setAnnualIncome] = useState<number>(1500000); // ₹15 Lakh
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(60000); // ₹60,000 / mo
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [dependents, setDependents] = useState<number>(2);
  const [loans, setLoans] = useState<number>(2000000); // ₹20 Lakh
  const [existingLifeCover, setExistingLifeCover] = useState<number>(2500000); // ₹25 Lakh
  const [savings, setSavings] = useState<number>(1000000); // ₹10 Lakh
  const [investments, setInvestments] = useState<number>(1500000); // ₹15 Lakh
  const [futureGoals, setFutureGoals] = useState<number>(3500000); // ₹35 Lakh
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6%
  const [investmentReturn, setInvestmentReturn] = useState<number>(8.5); // 8.5%

  // Execute mathematical engine
  const result = calculateLifeInsuranceNeeds({
    age,
    annualIncome,
    monthlyExpenses,
    retirementAge,
    dependents,
    loans,
    existingLifeCover,
    savings,
    investments,
    futureGoals,
    inflationRate,
    investmentReturn,
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

  // Grouped Bar Chart Data (Comparison View)
  const chartData = [
    {
      metric: 'Financial Need vs Resources',
      totalNeed: result.totalFinancialNeed,
      availableResources: result.availableResources,
      protectionGap: result.protectionGap,
    },
  ];

  return (
    <div className="space-y-10 font-sans text-[#404145]">
      {/* Main Grid: Inputs on Left, Output & Charts on Right */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 12 Inputs with Paired Sliders & Numeric Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#222325] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
              Life Needs Evaluation Parameters
            </h2>
            <p className="text-xs text-[#74767e] mt-1">
              Deterministic capital needs analysis. All sliders are bi-directionally synchronized with text entry.
            </p>
          </div>

          <div className="space-y-4 max-h-[720px] overflow-y-auto pr-1">
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
                <label className="text-xs sm:text-sm font-bold text-slate-700">Annual Income</label>
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
                <label className="text-xs sm:text-sm font-bold text-slate-700">Monthly Household Expenses</label>
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
                <label className="text-xs sm:text-sm font-bold text-slate-700">Planned Retirement Age</label>
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
                <label className="text-xs sm:text-sm font-bold text-slate-700">Financial Dependents</label>
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
                <span>0</span>
                <span>10 Dependents</span>
              </div>
            </div>

            {/* 6. Loans */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Outstanding Loans</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={loans || ''}
                    onChange={(e) => setLoans(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={50000}
                value={loans}
                onChange={(e) => setLoans(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0</span>
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

            {/* 8. Savings */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Bank Savings & Deposits</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={savings || ''}
                    onChange={(e) => setSavings(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={10000000}
                step={50000}
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0</span>
                <span>₹1 Crore</span>
              </div>
            </div>

            {/* 9. Investments */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Investments (MFs, Stocks, Real Estate)</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={investments || ''}
                    onChange={(e) => setInvestments(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={50000}
                value={investments}
                onChange={(e) => setInvestments(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            {/* 10. Future Goals */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Future Financial Goals</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={50000000}
                    step={50000}
                    value={futureGoals || ''}
                    onChange={(e) => setFutureGoals(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20000000}
                step={50000}
                value={futureGoals}
                onChange={(e) => setFutureGoals(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹0</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            {/* 11. Inflation Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Inflation Rate (% p.a.)</label>
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
                <span>3.0%</span>
                <span>12.0%</span>
              </div>
            </div>

            {/* 12. Investment Return */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Expected Investment Return (% p.a.)</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={4}
                    max={15}
                    step={0.5}
                    value={investmentReturn || ''}
                    onChange={(e) => setInvestmentReturn(e.target.value === '' ? 8.5 : Math.min(15, Math.max(4, Number(e.target.value))))}
                    className="w-16 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">%</span>
                </div>
              </div>
              <input
                type="range"
                min={4}
                max={15}
                step={0.5}
                value={investmentReturn}
                onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>4.0%</span>
                <span>15.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Outputs & Grouped Bar Chart */}
        <div className="lg:col-span-6 space-y-6">
          {/* Primary Insurance Required Hero Card */}
          <div className="bg-gradient-to-br from-[#0c2a1a] via-[#103a22] to-[#081e13] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1dbf73]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1dbf73]/20 border border-[#1dbf73]/30 text-xs font-bold text-[#1dbf73]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Life Insurance Needs Assessment
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  {retirementAge - age} Working Yrs
                </span>
              </div>

              <div>
                <p className="text-xs text-emerald-200 font-medium">Total Insurance Required</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {formatINR(result.insuranceRequired)}
                  </h3>
                  <span className="text-sm font-semibold text-[#1dbf73]">
                    ({result.netInsuranceRequiredFormatted})
                  </span>
                </div>
              </div>

              {/* 3 Core Summary Outputs requested: Total Need, Available Resources, Protection Gap */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-emerald-800/40">
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-300/80 font-medium truncate">Total Financial Need</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5">{formatShort(result.totalFinancialNeed)}</p>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-300/80 font-medium truncate">Available Resources</p>
                  <p className="text-sm sm:text-base font-bold text-emerald-300 mt-0.5">{formatShort(result.availableResources)}</p>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-300/80 font-medium truncate">Protection Gap</p>
                  <p className={`text-sm sm:text-base font-bold mt-0.5 ${result.protectionGap > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatShort(result.protectionGap)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart (Comparison View) Requested by User */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#222325] flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#1dbf73]" />
                  Total Financial Need vs Available Resources (Comparison View)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Side-by-side comparative bars contrasting total need against available resources.
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="metric" fontSize={11} stroke="#64748b" tickLine={false} />
                  <YAxis fontSize={11} stroke="#64748b" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatINR(Number(value)),
                      name === 'totalNeed' ? 'Total Financial Need' :
                      name === 'availableResources' ? 'Available Resources (Cover + Assets)' :
                      name === 'protectionGap' ? 'Resulting Protection Gap' : name
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
                      if (val === 'totalNeed') return 'Total Financial Need';
                      if (val === 'availableResources') return 'Available Resources';
                      if (val === 'protectionGap') return 'Protection Gap';
                      return val;
                    }}
                  />
                  <Bar dataKey="totalNeed" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="availableResources" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="protectionGap" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Total Need Breakdown:</span>
                <span>{formatINR(result.totalFinancialNeed)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <div>Living Expenses PV: <strong className="text-slate-800">{formatShort(result.totalFinancialNeed - loans - futureGoals)}</strong></div>
                <div>Outstanding Loans: <strong className="text-slate-800">{formatShort(loans)}</strong></div>
                <div>Future Goals: <strong className="text-slate-800">{formatShort(futureGoals)}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
