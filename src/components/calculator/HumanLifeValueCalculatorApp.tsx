import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  DollarSign,
  Activity,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Calculator } from '../../types/schema.ts';
import { calculateHumanLifeValue } from '../../calculators/india/insurance/life.ts';

interface HumanLifeValueCalculatorAppProps {
  calculator?: Calculator;
}

export const HumanLifeValueCalculatorApp: React.FC<HumanLifeValueCalculatorAppProps> = () => {
  // 7 Inputs requested by the user
  const [age, setAge] = useState<number>(32);
  const [annualIncome, setAnnualIncome] = useState<number>(1800000); // ₹18 Lakh
  const [annualPersonalExpenses, setAnnualPersonalExpenses] = useState<number>(400000); // ₹4 Lakh personal expenses
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [expectedIncomeGrowth, setExpectedIncomeGrowth] = useState<number>(8.0); // 8% p.a.
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6% p.a.
  const [investmentReturn, setInvestmentReturn] = useState<number>(8.5); // 8.5% discount rate

  // Execute mathematical engine
  const result = calculateHumanLifeValue({
    age,
    annualIncome,
    annualPersonalExpenses,
    retirementAge,
    expectedIncomeGrowth,
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

  return (
    <div className="space-y-10 font-sans text-[#404145]">
      {/* Main Grid: Inputs on Left, Output & Gradient Area Chart on Right */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 7 Inputs with Paired Sliders & Number Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#222325] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
              Human Capital & Economic Inputs
            </h2>
            <p className="text-xs text-[#74767e] mt-1">
              Prof. Solomon Huebner income capitalization model. Interactive paired sliders and numeric entry.
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

            {/* 3. Annual Personal Expenses */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Annual Personal Expenses (Self Only)</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-slate-500 mr-1 select-none">₹</span>
                  <input
                    type="number"
                    min={10000}
                    max={50000000}
                    step={25000}
                    value={annualPersonalExpenses || ''}
                    onChange={(e) => setAnnualPersonalExpenses(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">/yr</span>
                </div>
              </div>
              <input
                type="range"
                min={10000}
                max={2000000}
                step={25000}
                value={annualPersonalExpenses}
                onChange={(e) => setAnnualPersonalExpenses(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹10,000</span>
                <span>₹20 Lakh</span>
              </div>
            </div>

            {/* 4. Retirement Age */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Target Retirement Age</label>
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

            {/* 5. Expected Income Growth */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Expected Annual Income Growth</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    value={expectedIncomeGrowth || ''}
                    onChange={(e) => setExpectedIncomeGrowth(e.target.value === '' ? 0 : Math.min(20, Math.max(0, Number(e.target.value))))}
                    className="w-16 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={expectedIncomeGrowth}
                onChange={(e) => setExpectedIncomeGrowth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>0.0% (Flat)</span>
                <span>20.0% (Rapid)</span>
              </div>
            </div>

            {/* 6. Inflation Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Inflation Rate (% p.a.)</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={2}
                    max={12}
                    step={0.5}
                    value={inflationRate || ''}
                    onChange={(e) => setInflationRate(e.target.value === '' ? 6 : Math.min(12, Math.max(2, Number(e.target.value))))}
                    className="w-16 text-right text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs font-semibold text-slate-500 ml-1 select-none">%</span>
                </div>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1dbf73]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>2.0%</span>
                <span>12.0%</span>
              </div>
            </div>

            {/* 7. Investment Return / Discount Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Discount Rate / Investment Return</label>
                <div className="flex items-center bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 focus-within:border-[#1dbf73] focus-within:bg-white transition-all">
                  <input
                    type="number"
                    min={4}
                    max={15}
                    step={0.5}
                    value={investmentReturn || ''}
                    onChange={(e) => setInvestmentReturn(e.target.value === '' ? 7.5 : Math.min(15, Math.max(4, Number(e.target.value))))}
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

        {/* Right Column: 4 Outputs & Gradient Area Chart */}
        <div className="lg:col-span-6 space-y-6">
          {/* Primary HLV Hero Card */}
          <div className="bg-gradient-to-br from-[#0c2a1a] via-[#103a22] to-[#081e13] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1dbf73]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1dbf73]/20 border border-[#1dbf73]/30 text-xs font-bold text-[#1dbf73]">
                  <Activity className="w-3.5 h-3.5" />
                  Human Life Value (HLV) Model
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  {retirementAge - age} Working Yrs
                </span>
              </div>

              <div>
                <p className="text-xs text-emerald-200 font-medium">Human Life Value (Present Worth of Future Earnings)</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {formatINR(result.humanLifeValue)}
                  </h3>
                  <span className="text-sm font-semibold text-[#1dbf73]">
                    ({result.humanLifeValueFormatted})
                  </span>
                </div>
              </div>

              {/* 3 Outputs: Future Income Value, Financial Contribution, Estimated Insurance Requirement */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-emerald-800/40">
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-300/80 font-medium truncate">Future Gross Income</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5">{formatShort(result.futureIncomeValue)}</p>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-300/80 font-medium truncate">Annual Contribution</p>
                  <p className="text-sm sm:text-base font-bold text-emerald-300 mt-0.5">{formatShort(result.financialContribution)}</p>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-300/80 font-medium truncate">Estimated Insurance</p>
                  <p className="text-sm sm:text-base font-bold text-amber-400 mt-0.5">{formatShort(result.estimatedInsuranceRequirement)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Area Chart: Visual Breakdown Requested by User */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#222325] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#1dbf73]" />
                  Year-by-Year Earnings & Present Value Discounting Trajectory
                </h4>
                <p className="text-[11px] text-slate-500">
                  Illustrating how future annual earnings degrade in present-day value due to inflation and discount rates.
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.hlvTrajectory} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="hlvNominal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="hlvDiscounted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" fontSize={11} stroke="#64748b" tickLine={false} interval={Math.ceil(result.hlvTrajectory.length / 6)} />
                  <YAxis fontSize={11} stroke="#64748b" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatINR(Number(value)),
                      name === 'futureIncome' ? 'Nominal Family Contribution' :
                      name === 'presentValue' ? 'Discounted Present Value (PV)' :
                      name === 'cumulativePV' ? 'Cumulative HLV' : name
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
                      if (val === 'futureIncome') return 'Nominal Contribution (with Growth)';
                      if (val === 'presentValue') return 'Discounted Present Value (PV)';
                      return val;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="futureIncome"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#hlvNominal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="presentValue"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#hlvDiscounted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              The gap between nominal earnings and discounted PV illustrates the compounding time value of money and inflation erosion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
