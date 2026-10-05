import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon,
  Sparkles,
  Layers,
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
import { AccessibleSlider } from '../common/AccessibleSlider.tsx';
import { AccessibleSummaryCard } from '../common/AccessibleSummaryCard.tsx';

interface LifeInsuranceNeedsCalculatorAppProps {
  calculator?: Calculator;
}

export const LifeInsuranceNeedsCalculatorApp: React.FC<LifeInsuranceNeedsCalculatorAppProps> = () => {
  // Required Inputs
  const [age, setAge] = useState<number>(32);
  const [annualIncome, setAnnualIncome] = useState<number>(1500000); // ₹15 Lakh
  const [yearsOfSupportNeeded, setYearsOfSupportNeeded] = useState<number>(25); // 25 years
  const [homeLoan, setHomeLoan] = useState<number>(3000000); // ₹30 Lakh
  const [otherDebts, setOtherDebts] = useState<number>(500000); // ₹5 Lakh
  const [futureGoals, setFutureGoals] = useState<number>(2500000); // ₹25 Lakh
  const [finalEmergencyExpenses, setFinalEmergencyExpenses] = useState<number>(500000); // ₹5 Lakh
  const [existingLifeCover, setExistingLifeCover] = useState<number>(2000000); // ₹20 Lakh
  const [savings, setSavings] = useState<number>(1500000); // ₹15 Lakh
  const [inflationRate, setInflationRate] = useState<number>(6.0); // 6%

  // Optional Inputs
  const [employerLifeInsurance, setEmployerLifeInsurance] = useState<number>(1000000); // ₹10 Lakh
  const [spouseDependentIncome, setSpouseDependentIncome] = useState<number>(300000); // ₹3 Lakh/yr

  // Execute mathematical engine
  const result = calculateLifeInsuranceNeeds({
    age,
    annualIncome,
    yearsOfSupportNeeded,
    homeLoan,
    otherDebts,
    futureGoals,
    finalEmergencyExpenses,
    existingLifeCover,
    employerLifeInsurance,
    spouseDependentIncome,
    savings,
    inflationRate,
    investmentReturn: 8.5,
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

  // Grouped Bar Chart Data
  const chartData = [
    {
      metric: 'Financial Needs vs Resources',
      totalNeed: result.totalFinancialNeed,
      availableResources: result.availableResources,
      protectionGap: result.protectionGap,
    },
  ];

  return (
    <main
      aria-label="Life Insurance Needs Calculator Workspace"
      className="space-y-10 font-sans text-slate-800"
    >
      <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <section
          aria-labelledby="life-needs-inputs-title"
          className="lg:col-span-6 space-y-6"
        >
          <header className="border-b border-slate-200 pb-4">
            <h2 id="life-needs-inputs-title" className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" aria-hidden="true" />
              Life Needs Evaluation Parameters
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Comprehensive financial protection analysis factoring debts, goals, and optional family income.
            </p>
          </header>

          <fieldset className="space-y-5 border-none p-0 m-0">
            <legend className="sr-only">Primary Inputs</legend>

            <AccessibleSlider
              id="needs-input-age"
              label="1. Current Age"
              value={age}
              min={18}
              max={65}
              unit="Yrs"
              valueText={`${age} years old`}
              onChange={(val) => setAge(val)}
            />

            <AccessibleSlider
              id="needs-input-income"
              label="2. Annual Income"
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

            <AccessibleSlider
              id="needs-input-years"
              label="3. Years of Income Replacement"
              value={yearsOfSupportNeeded}
              min={5}
              max={40}
              unit="Yrs"
              valueText={`${yearsOfSupportNeeded} years support`}
              minLabel="5 Yrs"
              maxLabel="40 Yrs"
              onChange={(val) => setYearsOfSupportNeeded(val)}
            />

            <AccessibleSlider
              id="needs-input-homeloan"
              label="4. Home Loan Liability"
              value={homeLoan}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(homeLoan)}
              minLabel="₹0"
              maxLabel="₹5 Crore"
              onChange={(val) => setHomeLoan(val)}
            />

            <AccessibleSlider
              id="needs-input-otherdebts"
              label="5. Other Debts & Personal Loans"
              value={otherDebts}
              min={0}
              max={20000000}
              step={25000}
              prefix="₹"
              valueText={formatINR(otherDebts)}
              minLabel="₹0"
              maxLabel="₹2 Crore"
              onChange={(val) => setOtherDebts(val)}
            />

            <AccessibleSlider
              id="needs-input-goals"
              label="6. Education & Future Goals"
              value={futureGoals}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(futureGoals)}
              minLabel="₹0"
              maxLabel="₹5 Crore"
              onChange={(val) => setFutureGoals(val)}
            />

            <AccessibleSlider
              id="needs-input-emergency"
              label="7. Final & Emergency Expenses"
              value={finalEmergencyExpenses}
              min={0}
              max={5000000}
              step={25000}
              prefix="₹"
              valueText={formatINR(finalEmergencyExpenses)}
              minLabel="₹0"
              maxLabel="₹50 Lakh"
              onChange={(val) => setFinalEmergencyExpenses(val)}
            />

            <AccessibleSlider
              id="needs-input-cover"
              label="8. Existing Personal Life Insurance"
              value={existingLifeCover}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(existingLifeCover)}
              minLabel="₹0"
              maxLabel="₹5 Crore"
              onChange={(val) => setExistingLifeCover(val)}
            />

            <AccessibleSlider
              id="needs-input-savings"
              label="9. Savings & Liquid Investments"
              value={savings}
              min={0}
              max={50000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(savings)}
              minLabel="₹0"
              maxLabel="₹5 Crore"
              onChange={(val) => setSavings(val)}
            />

            <AccessibleSlider
              id="needs-input-inflation"
              label="10. Inflation Rate (% p.a.)"
              value={inflationRate}
              min={0}
              max={15}
              step={0.5}
              unit="%"
              valueText={`${inflationRate} percent per annum`}
              minLabel="0.0%"
              maxLabel="15.0%"
              onChange={(val) => setInflationRate(val)}
            />
          </fieldset>

          {/* Optional Inputs Accordion / Block */}
          <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Optional Family & Employer Resources
            </h3>

            <AccessibleSlider
              id="needs-input-employer-cover"
              label="Employer Group Life Insurance"
              value={employerLifeInsurance}
              min={0}
              max={20000000}
              step={50000}
              prefix="₹"
              valueText={formatINR(employerLifeInsurance)}
              minLabel="₹0"
              maxLabel="₹2 Crore"
              helperText="Group term policy provided by current employer"
              onChange={(val) => setEmployerLifeInsurance(val)}
            />

            <AccessibleSlider
              id="needs-input-spouse-income"
              label="Spouse / Secondary Dependent Income"
              value={spouseDependentIncome}
              min={0}
              max={5000000}
              step={25000}
              prefix="₹"
              unit="/yr"
              valueText={`${formatINR(spouseDependentIncome)} per year`}
              minLabel="₹0"
              maxLabel="₹50 Lakh/yr"
              helperText="Secondary earning contribution by spouse or family"
              onChange={(val) => setSpouseDependentIncome(val)}
            />
          </div>
        </section>

        {/* Right Column: All Requested Outputs */}
        <section
          aria-label="Life Needs Calculation Results Dashboard"
          className="lg:col-span-6 space-y-6"
        >
          {/* Primary Recommended Cover Card */}
          <AccessibleSummaryCard
            id="hero-needs-cover"
            title="Estimated Additional Life Insurance Required"
            value={formatINR(result.insuranceRequired)}
            formattedSubtitle={result.netInsuranceRequiredFormatted}
            badgeLabel={`${yearsOfSupportNeeded} Yrs Replacement`}
            isHero={true}
            statusType={result.protectionGap > 0 ? 'warning' : 'success'}
            statusText={
              result.protectionGap > 0
                ? `Net Protection Gap of ${formatINR(result.protectionGap)} detected`
                : 'Existing assets & resources fully cover total financial need'
            }
          />

          {/* Outputs 1 & 2: Total Financial Need vs Existing Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AccessibleSummaryCard
              id="card-total-need"
              title="1. Total Financial Need"
              value={formatINR(result.totalFinancialNeed)}
              formattedSubtitle="Living PV + Debts + Goals + Emergency"
            />

            <AccessibleSummaryCard
              id="card-existing-resources"
              title="2. Existing Resources"
              value={formatINR(result.availableResources)}
              formattedSubtitle="Personal + Employer Cover + Savings + Spouse Income"
            />
          </div>

          {/* Itemized Calculation Breakdown Card */}
          <article
            aria-labelledby="needs-breakdown-heading"
            className="p-5 bg-slate-900 text-white rounded-2xl space-y-3 border border-slate-800 shadow-md"
          >
            <h3 id="needs-breakdown-heading" className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Itemized Protection Breakdown
            </h3>
            <div className="text-xs space-y-1.5 font-mono text-slate-200">
              <div className="flex justify-between">
                <span>Income Replacement Corpus:</span>
                <span className="font-bold">{formatINR(result.incomeReplacementCorpus)}</span>
              </div>
              <div className="flex justify-between">
                <span>Home Loan Liability:</span>
                <span className="font-bold">{formatINR(result.homeLoanProtection)}</span>
              </div>
              <div className="flex justify-between">
                <span>Other Debts & Loans:</span>
                <span className="font-bold">{formatINR(result.otherDebtsProtection)}</span>
              </div>
              <div className="flex justify-between">
                <span>Education & Milestone Goals:</span>
                <span className="font-bold">{formatINR(result.futureFinancialGoals)}</span>
              </div>
              <div className="flex justify-between">
                <span>Final / Emergency Expenses:</span>
                <span className="font-bold">{formatINR(result.finalEmergencyExpenses)}</span>
              </div>

              <div className="flex justify-between border-t border-slate-700 pt-1 font-bold text-white text-sm">
                <span>Total Financial Need:</span>
                <span>{formatINR(result.totalFinancialNeed)}</span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>Less Personal Life Cover:</span>
                <span>−{formatINR(result.existingPersonalCover)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Less Employer Life Cover:</span>
                <span>−{formatINR(result.employerLifeInsurance)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Less Savings & Investments:</span>
                <span>−{formatINR(result.savingsAndInvestments)}</span>
              </div>
              {result.spouseIncomePresentValue > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Less Spouse Income PV:</span>
                  <span>−{formatINR(result.spouseIncomePresentValue)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-700 pt-1 font-black text-amber-300 text-sm sm:text-base">
                <span>Additional Insurance Required:</span>
                <output aria-live="polite">{formatINR(result.protectionGap)}</output>
              </div>
            </div>
          </article>

          {/* Methodology Comparison Panel: Income-Multiple vs DIME vs Detailed Needs */}
          <article
            aria-labelledby="comparison-heading"
            className="p-5 bg-white border border-slate-300 rounded-2xl space-y-3 shadow-2xs"
          >
            <h3 id="comparison-heading" className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Methodology Comparison (Income Multiple vs DIME vs Detailed Needs)
            </h3>
            <p className="text-[11px] text-slate-600 leading-normal">
              Comparing 3 industry-standard valuation approaches for your profile:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block">10x Income Multiple</span>
                <span className="text-sm font-extrabold text-slate-900 block">
                  {formatINR(result.methodologyComparison.incomeMultipleMethod)}
                </span>
                <span className="text-[10px] text-slate-500 block">Simple 10x salary thumb rule</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block">DIME Method</span>
                <span className="text-sm font-extrabold text-slate-900 block">
                  {formatINR(result.methodologyComparison.dimeMethod)}
                </span>
                <span className="text-[10px] text-slate-500 block">Debt + Income + Mortgage + Education</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
                <span className="font-bold text-emerald-900 block">Detailed Needs Analysis</span>
                <span className="text-sm font-black text-emerald-800 block">
                  {formatINR(result.methodologyComparison.detailedNeedsMethod)}
                </span>
                <span className="text-[10px] text-emerald-700 block font-medium">Actuarial PV Net Need (Recommended)</span>
              </div>
            </div>
          </article>

          {/* Grouped Bar Chart */}
          <article
            aria-label="Chart: Total Need vs Resources vs Gap"
            className="p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Visual Comparison: Need vs Resources
                </h3>
                <p className="text-[11px] text-slate-600">
                  Visualizing total financial obligations against available resources and net gap.
                </p>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="metric" fontSize={11} stroke="#475569" tickLine={false} />
                  <YAxis fontSize={11} stroke="#475569" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatINR(Number(value)),
                      name === 'totalNeed' ? 'Total Financial Need' :
                      name === 'availableResources' ? 'Available Resources' :
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
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="totalNeed" name="Total Financial Need" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="availableResources" name="Available Resources" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="protectionGap" name="Protection Gap" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

        </section>
      </div>
    </main>
  );
};
