import React, { useState } from 'react';
import { TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
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
import { AccessibleSlider } from '../common/AccessibleSlider.tsx';
import { AccessibleSummaryCard } from '../common/AccessibleSummaryCard.tsx';

interface HumanLifeValueCalculatorAppProps {
  calculator?: Calculator;
}

export const HumanLifeValueCalculatorApp: React.FC<HumanLifeValueCalculatorAppProps> = () => {
  // 6 Clean Input Fields as specified
  const [age, setAge] = useState<number>(32);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [annualIncome, setAnnualIncome] = useState<number>(1800000); // ₹18 Lakh
  const [annualPersonalExpenses, setAnnualPersonalExpenses] = useState<number>(400000); // ₹4 Lakh personal expenses
  const [expectedIncomeGrowth, setExpectedIncomeGrowth] = useState<number>(8.0); // 8% p.a.
  const [investmentReturn, setInvestmentReturn] = useState<number>(7.5); // 7.5% discount rate

  const workingYears = Math.max(1, retirementAge - age);

  // Execute mathematical engine
  const result = calculateHumanLifeValue({
    age,
    annualIncome,
    annualPersonalExpenses,
    retirementAge,
    expectedIncomeGrowth,
    inflationRate: 6.0,
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
    <main
      aria-label="Human Life Value Calculator Workspace"
      className="space-y-10 font-sans text-slate-800"
    >
      <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 6 WCAG AA Accessible Sliders */}
        <section
          aria-labelledby="hlv-inputs-heading"
          className="lg:col-span-6 space-y-6"
        >
          <header className="border-b border-slate-200 pb-4">
            <h2 id="hlv-inputs-heading" className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" aria-hidden="true" />
              Human Capital & Economic Inputs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Adjust your key inputs to estimate the present worth of your future financial contributions.
            </p>
          </header>

          <fieldset className="space-y-5 border-none p-0 m-0">
            <legend className="sr-only">Human Life Value Input Controls</legend>

            {/* 1. Current Age */}
            <AccessibleSlider
              id="hlv-input-age"
              label="1. Current Age"
              value={age}
              min={18}
              max={65}
              unit="Yrs"
              valueText={`${age} years old`}
              onChange={(val) => setAge(val)}
            />

            {/* 2. Target Retirement Age */}
            <AccessibleSlider
              id="hlv-input-ret-age"
              label="2. Target Retirement Age"
              value={retirementAge}
              min={45}
              max={75}
              unit="Yrs"
              valueText={`Retirement age ${retirementAge} years`}
              onChange={(val) => setRetirementAge(val)}
            />

            {/* 3. Gross Annual Income */}
            <AccessibleSlider
              id="hlv-input-income"
              label="3. Gross Annual Income"
              value={annualIncome}
              min={100000}
              max={100000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(annualIncome)}
              minLabel="₹1 Lakh"
              maxLabel="₹10 Crore"
              onChange={(val) => setAnnualIncome(val)}
            />

            {/* 4. Annual Personal Expenses (Self Only) */}
            <AccessibleSlider
              id="hlv-input-personal-expenses"
              label="4. Annual Personal Expenses (Self Only)"
              value={annualPersonalExpenses}
              min={10000}
              max={50000000}
              step={25000}
              prefix="₹"
              unit="/yr"
              valueText={`${formatINR(annualPersonalExpenses)} per year`}
              minLabel="₹10,000"
              maxLabel="₹5 Crore"
              onChange={(val) => setAnnualPersonalExpenses(val)}
            />

            {/* 5. Expected Annual Income Growth (% p.a.) */}
            <AccessibleSlider
              id="hlv-input-growth"
              label="5. Expected Annual Income Growth (% p.a.)"
              value={expectedIncomeGrowth}
              min={0}
              max={20}
              step={0.5}
              unit="%"
              valueText={`${expectedIncomeGrowth} percent per annum`}
              minLabel="0.0% (Flat)"
              maxLabel="20.0% (Rapid)"
              onChange={(val) => setExpectedIncomeGrowth(val)}
            />

            {/* 6. Discount Rate / Investment Return (% p.a.) */}
            <AccessibleSlider
              id="hlv-input-discount"
              label="6. Discount Rate / Investment Return (% p.a.)"
              value={investmentReturn}
              min={4}
              max={15}
              step={0.5}
              unit="%"
              valueText={`${investmentReturn} percent per annum`}
              minLabel="4.0%"
              maxLabel="15.0%"
              onChange={(val) => setInvestmentReturn(val)}
            />
          </fieldset>
        </section>

        {/* Right Column: WCAG AA Summary Dashboard */}
        <section
          aria-label="Human Life Value Calculation Results Dashboard"
          className="lg:col-span-6 space-y-6"
        >
          {/* Primary Results Dashboard Card */}
          <AccessibleSummaryCard
            id="hero-hlv"
            title="Human Life Value (HLV)"
            value={formatINR(result.humanLifeValue)}
            formattedSubtitle={`(${result.humanLifeValueFormatted})`}
            badgeLabel={`${workingYears} Working Yrs Remaining`}
            isHero={true}
            methodologyNote={`Huebner Earnings Model: Present worth ($PV$) of net family contributions compounded at ${expectedIncomeGrowth}% growth and discounted at ${investmentReturn}% over ${workingYears} working years.`}
          />

          {/* 3 Core Output Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AccessibleSummaryCard
              id="card-annual-contrib"
              title="Annual Contribution"
              value={formatShort(result.financialContribution)}
              formattedSubtitle="Income minus personal spend"
            />

            <AccessibleSummaryCard
              id="card-future-income"
              title="Projected Future Income"
              value={formatShort(result.futureIncomeValue)}
              formattedSubtitle="Nominal earnings total"
            />

            <AccessibleSummaryCard
              id="card-pv-contrib"
              title="PV of Contributions"
              value={formatShort(result.totalLifetimeNetEarningsPV)}
              formattedSubtitle="Discounted present worth"
            />
          </div>

          {/* Gradient Area Chart */}
          <article
            aria-label="Chart: Year-by-Year Earnings and Present Value Discounting Trajectory"
            className="p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Year-by-Year Earnings & Present Value Trajectory
                </h3>
                <p className="text-[11px] text-slate-600">
                  Visualizing annual family contribution vs discounted present value over remaining {workingYears} working years.
                </p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.hlvTrajectory} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="hlvNominal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="hlvDiscounted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" fontSize={11} stroke="#475569" tickLine={false} interval={Math.ceil(result.hlvTrajectory.length / 6)} />
                  <YAxis fontSize={11} stroke="#475569" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatINR(Number(value)),
                      name === 'futureIncome' ? 'Annual Net Family Contribution' :
                      name === 'presentValue' ? 'Discounted Present Value (PV)' :
                      name === 'cumulativePV' ? 'Cumulative HLV' : name
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    formatter={(val) => {
                      if (val === 'futureIncome') return 'Projected Future Contribution';
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
          </article>
        </section>
      </div>
    </main>
  );
};
