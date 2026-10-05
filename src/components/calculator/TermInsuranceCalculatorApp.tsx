import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon,
  Sparkles,
  ArrowRight,
  Sliders,
  RotateCcw,
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
import {
  calculateTermLifeInsurance,
  calculateHumanLifeValue,
} from '../../calculators/india/insurance/life.ts';
import { AccessibleSlider } from '../common/AccessibleSlider.tsx';
import { AccessibleSummaryCard } from '../common/AccessibleSummaryCard.tsx';

interface TermInsuranceCalculatorAppProps {
  calculator?: Calculator;
}

export const TermInsuranceCalculatorApp: React.FC<TermInsuranceCalculatorAppProps> = () => {
  // 12 Baseline Inputs specified by user
  const [age, setAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [annualIncome, setAnnualIncome] = useState<number>(2000000); // ₹20 Lakh
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(70000); // ₹70,000 / mo
  const [outstandingLoans, setOutstandingLoans] = useState<number>(3500000); // ₹35 Lakh
  const [existingLifeCover, setExistingLifeCover] = useState<number>(5000000); // ₹50 Lakh
  const [savingsInvestments, setSavingsInvestments] = useState<number>(2500000); // ₹25 Lakh
  const [futureFinancialGoals, setFutureFinancialGoals] = useState<number>(3000000); // ₹30 Lakh
  const [goalYears, setGoalYears] = useState<number>(10); // 10 Years
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6%
  const [investmentReturn, setInvestmentReturn] = useState<number>(8.5); // 8.5%
  const [dependents, setDependents] = useState<number>(3);

  // What-If Interactive Inputs (initialized to baseline)
  const [whatIfInflation, setWhatIfInflation] = useState<number>(6.0);
  const [whatIfReturn, setWhatIfReturn] = useState<number>(8.5);
  const [whatIfRetirementAge, setWhatIfRetirementAge] = useState<number>(60);
  const [whatIfMonthlyExpenses, setWhatIfMonthlyExpenses] = useState<number>(70000);
  const [whatIfExistingCover, setWhatIfExistingCover] = useState<number>(5000000);

  // Synchronize What-If inputs when baseline values change
  const handleBaselineChange = (field: string, val: number) => {
    if (field === 'inflation') { setInflationRate(val); setWhatIfInflation(val); }
    if (field === 'return') { setInvestmentReturn(val); setWhatIfReturn(val); }
    if (field === 'retAge') { setRetirementAge(val); setWhatIfRetirementAge(val); }
    if (field === 'expenses') { setMonthlyExpenses(val); setWhatIfMonthlyExpenses(val); }
    if (field === 'cover') { setExistingLifeCover(val); setWhatIfExistingCover(val); }
  };

  // Baseline Calculation
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
    goalYears,
    inflationRate,
    investmentReturn,
  });

  // Human Life Value (HLV) Calculation
  const hlvResult = calculateHumanLifeValue({
    age,
    retirementAge,
    annualIncome,
    annualIncome,
    personalExpensesPercent: 30, // Using standard 30% personal expense assumption for HLV
    expectedIncomeGrowth: 8.0,
    inflationRate,
    investmentReturn,
  });

  // What-If Calculation
  const whatIfResult = calculateTermLifeInsurance({
    age,
    annualIncome,
    monthlyExpenses: whatIfMonthlyExpenses,
    retirementAge: whatIfRetirementAge,
    dependents,
    outstandingLoans,
    existingLifeCover: whatIfExistingCover,
    existingSavings: savingsInvestments,
    futureFinancialGoals,
    goalYears,
    inflationRate: whatIfInflation,
    investmentReturn: whatIfReturn,
  });

  const grossNeed = result.incomeReplacement + result.loanProtection + result.goalProtection;

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
    <main
      aria-label="Term Insurance Calculator Workspace"
      className="space-y-10 font-sans text-slate-800"
    >
      {/* Main Workspace Grid */}
      <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 12 WCAG AA Accessible Sliders */}
        <section
          aria-labelledby="term-inputs-title"
          className="lg:col-span-6 space-y-6"
        >
          <header className="border-b border-slate-200 pb-4">
            <h2 id="term-inputs-title" className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" aria-hidden="true" />
              Personal & Financial Inputs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Paired sliders and keyboard entry with WCAG 2.1 AA screen reader support.
            </p>
          </header>

          <fieldset className="space-y-5 border-none p-0 m-0">
            <legend className="sr-only">Term Insurance Input Controls</legend>

            {/* 1. Current Age */}
            <AccessibleSlider
              id="term-input-age"
              label="1. Current Age"
              value={age}
              min={18}
              max={65}
              unit="Yrs"
              valueText={`${age} years old`}
              onChange={(val) => setAge(val)}
            />

            {/* 2. Retirement / Protection Age */}
            <AccessibleSlider
              id="term-input-ret-age"
              label="2. Retirement / Protection Age"
              value={retirementAge}
              min={45}
              max={75}
              unit="Yrs"
              valueText={`Retirement target age ${retirementAge} years`}
              onChange={(val) => handleBaselineChange('retAge', val)}
            />

            {/* 3. Annual Income */}
            <AccessibleSlider
              id="term-input-annual-income"
              label="3. Annual Income (Reference / HLV)"
              value={annualIncome}
              min={100000}
              max={100000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(annualIncome)}
              minLabel="₹1 Lakh"
              maxLabel="₹10 Crore"
              helperText="Used as an income reference & Human Life Value input"
              onChange={(val) => setAnnualIncome(val)}
            />

            {/* 4. Monthly Living Expenses */}
            <AccessibleSlider
              id="term-input-monthly-expenses"
              label="4. Monthly Living Expenses"
              value={monthlyExpenses}
              min={0}
              max={1000000}
              step={5000}
              prefix="₹"
              unit="/mo"
              valueText={`${formatINR(monthlyExpenses)} per month`}
              minLabel="₹0"
              maxLabel="₹10 Lakh/mo"
              onChange={(val) => handleBaselineChange('expenses', val)}
            />

            {/* 5. Outstanding Loans / Liabilities */}
            <AccessibleSlider
              id="term-input-[#35-lakh-loans]"
              label="5. Outstanding Loans / Liabilities"
              value={outstandingLoans}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(outstandingLoans)}
              minLabel="₹0 (Debt Free)"
              maxLabel="₹5 Crore"
              onChange={(val) => setOutstandingLoans(val)}
            />

            {/* 6. Existing Life Insurance Cover */}
            <AccessibleSlider
              id="term-input-existing-cover"
              label="6. Existing Life Insurance Cover"
              value={existingLifeCover}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(existingLifeCover)}
              minLabel="₹0"
              maxLabel="₹5 Crore"
              onChange={(val) => handleBaselineChange('cover', val)}
            />

            {/* 7. Savings & Investments */}
            <AccessibleSlider
              id="term-input-savings"
              label="7. Savings & Investments"
              value={savingsInvestments}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(savingsInvestments)}
              minLabel="₹0"
              maxLabel="₹5 Crore"
              onChange={(val) => setSavingsInvestments(val)}
            />

            {/* 8. Future Financial Goals */}
            <AccessibleSlider
              id="term-input-goals"
              label="8. Future Financial Goals (Education / Marriage)"
              value={futureFinancialGoals}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(futureFinancialGoals)}
              minLabel="₹0"
              maxLabel="₹5 Crore"
              onChange={(val) => setFutureFinancialGoals(val)}
            />

            {/* 9. Years Until Goal */}
            <AccessibleSlider
              id="term-input-goal-years"
              label="9. Years Until Goal"
              value={goalYears}
              min={0}
              max={30}
              unit="Yrs"
              valueText={`${goalYears} years until target milestone`}
              minLabel="0 Yrs (Today)"
              maxLabel="30 Yrs"
              onChange={(val) => setGoalYears(val)}
            />

            {/* 10. Inflation Rate */}
            <AccessibleSlider
              id="term-input-inflation"
              label="10. Inflation Rate (% p.a.)"
              value={inflationRate}
              min={0}
              max={15}
              step={0.5}
              unit="%"
              valueText={`${inflationRate} percent per annum`}
              minLabel="0.0%"
              maxLabel="15.0%"
              onChange={(val) => handleBaselineChange('inflation', val)}
            />

            {/* 11. Expected Investment Return */}
            <AccessibleSlider
              id="term-input-return"
              label="11. Expected Investment Return (% p.a.)"
              value={investmentReturn}
              min={0}
              max={20}
              step={0.5}
              unit="%"
              valueText={`${investmentReturn} percent per annum`}
              minLabel="0.0%"
              maxLabel="20.0%"
              onChange={(val) => handleBaselineChange('return', val)}
            />

            {/* 12. Dependants */}
            <AccessibleSlider
              id="term-input-dependents"
              label="12. Dependants (Family Size)"
              value={dependents}
              min={0}
              max={10}
              unit="Members"
              valueText={`${dependents} dependent family members`}
              minLabel="0 Members"
              maxLabel="10 Members"
              helperText="Contextual reference for household sizing"
              onChange={(val) => setDependents(val)}
            />
          </fieldset>
        </section>

        {/* Right Column: WCAG AA Accessible Results Dashboard */}
        <section
          aria-label="Term Insurance Calculation Results Dashboard"
          className="lg:col-span-6 space-y-6"
        >
          {/* Output 8: Hero Recommended Term Cover */}
          <AccessibleSummaryCard
            id="hero-term-cover"
            title="Recommended Term Insurance Cover"
            value={formatINR(result.recommendedLifeCover)}
            formattedSubtitle={result.recommendedSumAssuredFormatted}
            badgeLabel={`${retirementAge - age} Working Yrs`}
            isHero={true}
            statusType={result.protectionGap > 0 ? 'warning' : 'success'}
            statusText={
              result.protectionGap > 0
                ? `Net Protection Gap of ${formatINR(result.protectionGap)} detected`
                : 'Existing cover & assets fully satisfy gross financial need'
            }
          />

          {/* Output 1: Human Life Value (HLV) Card */}
          <AccessibleSummaryCard
            id="card-hlv"
            title="1. Human Life Value (HLV)"
            value={formatINR(hlvResult.humanLifeValue)}
            formattedSubtitle={`(${hlvResult.humanLifeValueFormatted})`}
            badgeLabel="Earnings Capitalization"
            methodologyNote={`Huebner Model: Discounted PV of future net earnings over remaining ${retirementAge - age} working years.`}
          />

          {/* Outputs 2, 3, 4: Living Expense, Goals, and Loan Protection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AccessibleSummaryCard
              id="card-living-expense"
              title="2. Living Expense Corpus"
              value={formatINR(result.incomeReplacement)}
              formattedSubtitle={`Support over ${retirementAge - age} yrs`}
            />

            <AccessibleSummaryCard
              id="card-goals-corpus"
              title="3. Future Goals Corpus"
              value={formatINR(result.goalProtection)}
              formattedSubtitle="PV of milestone goals"
            />

            <AccessibleSummaryCard
              id="card-loan-protection"
              title="4. Loan Protection"
              value={formatINR(result.loanProtection)}
              formattedSubtitle="Full liability liquidation"
            />
          </div>

          {/* Output 5 & Output 6: Gross Need & Existing Resources Card */}
          <article
            aria-labelledby="gross-need-heading"
            className="p-4 sm:p-5 bg-white border border-slate-300 rounded-2xl space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 id="gross-need-heading" className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                5. Gross Insurance Need
              </h3>
              <output className="text-base sm:text-lg font-black text-slate-900" aria-live="polite">
                {formatINR(grossNeed)}
              </output>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-700 block">
                6. Existing Resources (Deductions)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Existing Life Cover:</span>
                  <span className="font-extrabold text-slate-900">{formatINR(result.existingCover)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Savings & Investments:</span>
                  <span className="font-extrabold text-slate-900">{formatINR(savingsInvestments)}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Output 9: Simple Calculation Breakdown Card */}
          <article
            aria-labelledby="breakdown-heading"
            className="p-5 bg-slate-900 text-white rounded-2xl space-y-3 border border-slate-800 shadow-md"
          >
            <h3 id="breakdown-heading" className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              9. Calculation Breakdown
            </h3>
            <div className="text-xs space-y-1.5 font-mono text-slate-200">
              <div className="flex justify-between">
                <span>Living Expenses:</span>
                <span className="font-bold">{formatINR(result.incomeReplacement)}</span>
              </div>
              <div className="flex justify-between">
                <span>Loans:</span>
                <span className="font-bold">{formatINR(result.loanProtection)}</span>
              </div>
              <div className="flex justify-between">
                <span>Future Goals:</span>
                <span className="font-bold">{formatINR(result.goalProtection)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-1 font-bold text-white text-sm">
                <span>Gross Need:</span>
                <span>{formatINR(grossNeed)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Less Existing Cover:</span>
                <span>−{formatINR(result.existingCover)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Less Savings & Investments:</span>
                <span>−{formatINR(savingsInvestments)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-1 font-black text-amber-300 text-sm sm:text-base">
                <span>Additional Cover Required:</span>
                <output aria-live="polite">{formatINR(result.protectionGap)}</output>
              </div>
            </div>
          </article>

          {/* Output 10: What-If Results Interactive Simulator Panel */}
          <article
            aria-labelledby="whatif-panel-heading"
            className="p-5 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 border border-slate-300 rounded-2xl space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
              <div>
                <h3 id="whatif-panel-heading" className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  10. What-If Scenario Analysis
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Tweak parameters dynamically to see how recommended cover changes under different future scenarios.
                </p>
              </div>
              <button
                onClick={() => {
                  setWhatIfInflation(inflationRate);
                  setWhatIfReturn(investmentReturn);
                  setWhatIfRetirementAge(retirementAge);
                  setWhatIfMonthlyExpenses(monthlyExpenses);
                  setWhatIfExistingCover(existingLifeCover);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 flex items-center gap-1.5 transition-all shadow-2xs"
                aria-label="Reset What-If Scenario Parameters to Baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Reset
              </button>
            </div>

            {/* What-If Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <AccessibleSlider
                id="whatif-slider-inflation"
                label="What-If Inflation"
                value={whatIfInflation}
                min={0}
                max={15}
                step={0.5}
                unit="%"
                valueText={`${whatIfInflation} percent`}
                onChange={(val) => setWhatIfInflation(val)}
              />

              <AccessibleSlider
                id="whatif-slider-return"
                label="What-If Return"
                value={whatIfReturn}
                min={0}
                max={20}
                step={0.5}
                unit="%"
                valueText={`${whatIfReturn} percent`}
                onChange={(val) => setWhatIfReturn(val)}
              />

              <AccessibleSlider
                id="whatif-slider-ret-age"
                label="What-If Retirement Age"
                value={whatIfRetirementAge}
                min={45}
                max={75}
                unit="Yrs"
                valueText={`${whatIfRetirementAge} years`}
                onChange={(val) => setWhatIfRetirementAge(val)}
              />

              <AccessibleSlider
                id="whatif-slider-expenses"
                label="What-If Expenses"
                value={whatIfMonthlyExpenses}
                min={0}
                max={500000}
                step={5000}
                prefix="₹"
                unit="/mo"
                valueText={`${formatINR(whatIfMonthlyExpenses)} per month`}
                onChange={(val) => setWhatIfMonthlyExpenses(val)}
              />
            </div>

            {/* What-If Result Comparison Banner */}
            <div className="p-3.5 bg-white border border-emerald-400 rounded-xl flex items-center justify-between flex-wrap gap-2 shadow-2xs">
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase block">
                  What-If Recommended Cover Shift
                </span>
                <div className="flex items-center gap-2 mt-0.5" aria-live="polite">
                  <span className="text-xs sm:text-sm line-through text-slate-500 font-semibold">{formatINR(result.recommendedLifeCover)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                  <output className="text-base sm:text-lg font-black text-emerald-800">{formatINR(whatIfResult.recommendedLifeCover)}</output>
                </div>
              </div>
              <div>
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 ${
                  whatIfResult.recommendedLifeCover > result.recommendedLifeCover
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : whatIfResult.recommendedLifeCover < result.recommendedLifeCover
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}>
                  {whatIfResult.recommendedLifeCover > result.recommendedLifeCover ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-800 shrink-0" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" aria-hidden="true" />
                  )}
                  {whatIfResult.recommendedLifeCover > result.recommendedLifeCover
                    ? `+${formatINR(whatIfResult.recommendedLifeCover - result.recommendedLifeCover)} Need`
                    : whatIfResult.recommendedLifeCover < result.recommendedLifeCover
                    ? `−${formatINR(result.recommendedLifeCover - whatIfResult.recommendedLifeCover)} Need`
                    : 'No Change'}
                </span>
              </div>
            </div>
          </article>

          {/* Stacked Bar Chart */}
          <article
            aria-label="Stacked Bar Chart: Total Needs vs Existing Setup"
            className="p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Total Needs vs Existing Setup (Stacked Chart)
                </h3>
                <p className="text-[11px] text-slate-600">
                  Visualizing how existing cover and savings reduce total need to form the protection gap.
                </p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={11} stroke="#475569" tickLine={false} />
                  <YAxis fontSize={11} stroke="#475569" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatINR(Number(value)),
                      name === 'incomeReplacement' ? 'Living Expenses Corpus' :
                      name === 'loanProtection' ? 'Outstanding Loans' :
                      name === 'goalProtection' ? 'Future Financial Goals' :
                      name === 'existingCover' ? 'Existing Life Cover' :
                      name === 'savingsInvestments' ? 'Savings & Investments' :
                      name === 'protectionGap' ? 'Net Protection Gap' : name
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
                      if (val === 'incomeReplacement') return 'Living Expenses';
                      if (val === 'loanProtection') return 'Loan Protection';
                      if (val === 'goalProtection') return 'Goal Protection';
                      if (val === 'existingCover') return 'Existing Cover';
                      if (val === 'savingsInvestments') return 'Savings/Investments';
                      if (val === 'protectionGap') return 'Protection Gap';
                      return val;
                    }}
                  />
                  <Bar dataKey="incomeReplacement" stackId="needs" fill="#2563eb" />
                  <Bar dataKey="loanProtection" stackId="needs" fill="#d97706" />
                  <Bar dataKey="goalProtection" stackId="needs" fill="#7c3aed" radius={[4, 4, 0, 0]} />

                  <Bar dataKey="existingCover" stackId="setup" fill="#059669" />
                  <Bar dataKey="savingsInvestments" stackId="setup" fill="#0891b2" />
                  <Bar dataKey="protectionGap" stackId="setup" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

        </section>
      </div>
    </main>
  );
};
