import React, { useState, useMemo } from 'react';
import {
  Activity,
  Heart,
  TrendingUp,
  Users,
  Shield,
  HelpCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  PieChart as PieIcon,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Calculator } from '../../types/schema.ts';
import { AccessibleSlider } from '../common/AccessibleSlider.tsx';
import { AccessibleSummaryCard } from '../common/AccessibleSummaryCard.tsx';

import { calculateHealthInsurance, calculateHealthCoverage } from '../../calculators/india/insurance/health.ts';

interface HealthInsuranceCoverageCalculatorAppProps {
  calculator?: Calculator;
}

export const HealthInsuranceCoverageCalculatorApp: React.FC<HealthInsuranceCoverageCalculatorAppProps> = () => {
  // 1. Inputs
  const [ageOfOldestMember, setAgeOfOldestMember] = useState<number>(35);
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [seniorParentsCount, setSeniorParentsCount] = useState<number>(0);
  const [hasExistingInsurance, setExistingInsurance] = useState<boolean>(true);
  const [existingCover, setExistingCover] = useState<number>(500000); // 5 Lakh default
  const [hasChronicCondition, setChronicCondition] = useState<boolean>(false);

  // Editable medical inflation rate (preserves 0% without fallback)
  const [medicalInflation, setMedicalInflation] = useState<number>(10);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  // Helper formatting
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatShort = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // 2. Calculations strictly routed through canonical statutory & coverage sizing engine
  const results = useMemo(() => {
    const canonicalCoverage = calculateHealthCoverage({
      ageOfEldestMember: ageOfOldestMember,
      adultsCount,
      childrenCount,
      seniorParentsCount,
      hasChronicCondition,
      existingCover: hasExistingInsurance ? existingCover : 0,
      medicalInflationRatePercent: medicalInflation,
      yearsInFuture: 15,
      selfAgeAbove60: ageOfOldestMember >= 60,
      includeParentCover80D: seniorParentsCount > 0,
      parentsAgeAbove60: true,
    });

    const recommendedCover = canonicalCoverage.recommendedSumInsured;
    const actualExistingCover = hasExistingInsurance ? existingCover : 0;
    const coverageGap = canonicalCoverage.coverageGap;

    const barChartData = [
      {
        name: 'Cover Sizing Overview',
        'Estimated Cover': recommendedCover,
        'Existing Cover': actualExistingCover,
        'Coverage Gap': coverageGap,
      },
    ];

    const futureChartData = canonicalCoverage.futureProjections.map((p) => ({
      year: p.yearLabel,
      cover: p.projectedCost,
    }));

    return {
      baseCover: canonicalCoverage.baseCoverageNeed,
      sizeAdjustment: canonicalCoverage.familyAdjustment,
      chronicAdjustment: canonicalCoverage.chronicAdjustment,
      recommendedCover,
      existingCoverText: formatINR(actualExistingCover),
      existingCoverValue: actualExistingCover,
      coverageGap,
      barChartData,
      futureChartData,
      statutoryDetails: canonicalCoverage,
    };
  }, [
    ageOfOldestMember,
    adultsCount,
    childrenCount,
    seniorParentsCount,
    hasExistingInsurance,
    existingCover,
    hasChronicCondition,
    medicalInflation,
  ]);

  return (
    <main
      aria-label="Health Insurance Coverage Calculator Workspace"
      className="space-y-10 font-sans text-slate-800"
    >
      <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Column */}
        <section
          aria-labelledby="coverage-calc-inputs"
          className="lg:col-span-6 space-y-6"
        >
          <header className="border-b border-slate-200 pb-4">
            <h2 id="coverage-calc-inputs" className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" aria-hidden="true" />
              Sizing Coverage Inputs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Provide family demographics, age indicators, and chronic factors to verify your net required coverage.
            </p>
          </header>

          <fieldset className="space-y-5 border-none p-0 m-0">
            <legend className="sr-only">Coverage Parameters</legend>

            <AccessibleSlider
              id="oldest-member-age"
              label="1. Age of Oldest Member"
              value={ageOfOldestMember}
              min={18}
              max={85}
              unit="Yrs"
              onChange={setAgeOfOldestMember}
            />

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label htmlFor="adults-count" className="block text-xs font-semibold text-slate-700">
                  Adults Count
                </label>
                <select
                  id="adults-count"
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 font-medium"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="children-count" className="block text-xs font-semibold text-slate-700">
                  Children Count
                </label>
                <select
                  id="children-count"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 font-medium"
                >
                  <option value={0}>0 Children</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Children</option>
                  <option value={3}>3 Children</option>
                  <option value={4}>4 Children</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="parents-count" className="block text-xs font-semibold text-slate-700">
                  Senior Parents
                </label>
                <select
                  id="parents-count"
                  value={seniorParentsCount}
                  onChange={(e) => setSeniorParentsCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 font-medium"
                >
                  <option value={0}>0 Parents</option>
                  <option value={1}>1 Parent</option>
                  <option value={2}>2 Parents</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Health Status & Existing Insurance
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="existing-insurance-select" className="block text-xs font-semibold text-slate-700">
                    Has Existing Health Insurance?
                  </label>
                  <select
                    id="existing-insurance-select"
                    value={hasExistingInsurance ? 'Yes' : 'No'}
                    onChange={(e) => setExistingInsurance(e.target.value === 'Yes')}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 font-medium"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="chronic-condition-select" className="block text-xs font-semibold text-slate-700">
                    Pre-existing Chronic Conditions?
                  </label>
                  <select
                    id="chronic-condition-select"
                    value={hasChronicCondition ? 'Yes' : 'No'}
                    onChange={(e) => setChronicCondition(e.target.value === 'Yes')}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 font-medium"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {hasExistingInsurance && (
                <div className="pt-2 animate-fadeIn">
                  <AccessibleSlider
                    id="existing-cover-slider"
                    label="Existing Health Cover Amount"
                    value={existingCover}
                    min={0}
                    max={5000000}
                    step={50000}
                    prefix="₹"
                    onChange={setExistingCover}
                  />
                </div>
              )}
            </div>

            {/* --- CORRECTION 5: Collapsible Advanced Settings for medical inflation slider --- */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-xs font-bold text-slate-700 uppercase tracking-wider focus:outline-hidden hover:text-slate-900"
              >
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  3. Advanced Sizing Assumptions
                </span>
                <span className="text-slate-400 text-sm font-bold">{showAdvanced ? '−' : '+'}</span>
              </button>

              {showAdvanced && (
                <div className="space-y-3 pt-2 animate-fadeIn">
                  <AccessibleSlider
                    id="inflation-slider"
                    label="Assumed Medical Inflation"
                    value={medicalInflation}
                    min={0}
                    max={25}
                    step={1}
                    unit="%"
                    onChange={setMedicalInflation}
                  />
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Medical expenses generally rise faster than baseline inflation. Modify this setting to customize the compounding curves of future healthcare cost projections.
                  </p>
                </div>
              )}
            </div>

          </fieldset>
        </section>

        {/* Right Output Column */}
        <section
          aria-label="Health Sizing Results Panel"
          className="lg:col-span-6 space-y-6"
        >
          {/* --- CORRECTION 4, 6, 9: Re-labelled to Estimated Health Insurance Cover --- */}
          <AccessibleSummaryCard
            id="hero-health-cover"
            title="Estimated Health Insurance Cover"
            value={formatINR(results.recommendedCover)}
            formattedSubtitle={
              results.coverageGap > 0
                ? `Coverage Gap: ${formatINR(results.coverageGap)} still required`
                : 'Existing health corpus fully shields the recommended protection limit.'
            }
            badgeLabel="Planning Estimate"
            isHero={true}
            statusType={results.coverageGap > 0 ? 'warning' : 'success'}
            statusText={
              results.coverageGap > 0
                ? `Coverage shortfall: Consider raising family sum insured by ${formatShort(results.coverageGap)}.`
                : 'Your family health shield meets standard planning parameters.'
            }
          />

          {/* Quick Stats Grid (Correction 6: Exact requested nomenclature) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AccessibleSummaryCard
              id="card-existing-cover"
              title="Existing Health Insurance"
              value={results.existingCoverText}
              formattedSubtitle="Current combined coverage"
            />

            <AccessibleSummaryCard
              id="card-coverage-gap"
              title="Coverage Gap"
              value={formatINR(results.coverageGap)}
              formattedSubtitle="Net protection deficit"
            />
          </div>

          {/* Itemized Coverage Sizing Breakdown */}
          <article
            aria-labelledby="sizing-breakdown-heading"
            className="p-5 bg-slate-900 text-white rounded-2xl space-y-3 border border-slate-800 shadow-md animate-fadeIn"
          >
            <h3 id="sizing-breakdown-heading" className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Detailed Coverage Sizing Breakdown
            </h3>
            <div className="text-xs space-y-2 font-mono text-slate-200">
              <div className="flex justify-between">
                <span>Base Coverage (Age Factor):</span>
                <span>{formatINR(results.baseCover)}</span>
              </div>
              <div className="flex justify-between">
                <span>Family Members Adjustment:</span>
                <span>+{formatINR(results.sizeAdjustment)}</span>
              </div>
              {results.chronicAdjustment > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Chronic Disease Loading Cover:</span>
                  <span>+{formatINR(results.chronicAdjustment)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-700 pt-1 text-white font-bold">
                <span>Estimated Coverage Requirement:</span>
                <span>{formatINR(results.recommendedCover)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Less Existing Health Insurance:</span>
                <span>−{formatINR(results.existingCoverValue)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-1 font-black text-amber-300 text-sm">
                <span>Net Coverage Gap:</span>
                <span>{formatINR(results.coverageGap)}</span>
              </div>
            </div>
          </article>

          {/* Planning Estimate Disclosure Notice (Correction 9) */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Planning Estimate Only:</strong> This tool produces an Estimated Health Insurance Cover based on actuarial guidelines. It does not constitute official or universally recommended financial advice.
            </p>
          </div>

          {/* Chart 1: Estimated Cover vs Existing Cover vs Coverage Gap (Bar Chart) */}
          <article
            aria-label="Chart: Coverage Gap Analysis"
            className="p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-3"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Coverage Comparison & Protection Gap
            </h3>
            <p className="text-[11px] text-slate-600 leading-normal">
              Comparing your estimated coverage requirement against existing health policy cushions.
            </p>

            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.barChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={10} stroke="#475569" tickLine={false} />
                  <YAxis fontSize={10} stroke="#475569" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(v) => [formatINR(Number(v)), '']}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  {/* CORRECTION 7: Series keys match exactly */}
                  <Bar dataKey="Estimated Cover" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Existing Cover" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Coverage Gap" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Chart 2: Future Cover Requirement (Optional Line Chart, enabled via explicit slider) */}
          <article
            aria-label="Chart: Future Coverage Projections"
            className="p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-3"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              Future Required Cover (Factoring {medicalInflation}% Assumed Medical Inflation)
            </h3>
            <p className="text-[11px] text-slate-600 leading-normal">
              How medical hospitalisation charges scale over 15 years, requiring standard policy indexation.
            </p>

            <div className="h-48 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.futureChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" fontSize={10} stroke="#475569" tickLine={false} />
                  <YAxis fontSize={10} stroke="#475569" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                  <Tooltip
                    formatter={(v) => [formatINR(Number(v)), 'Needed Cover']}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="cover" name="Inflation Adjusted Cover" stroke="#dc2626" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

        </section>
      </div>

      {/* Transparent Methodology Panel */}
      <section className="bg-slate-50 border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="flex items-center justify-between w-full text-left focus:outline-hidden"
          aria-expanded={showMethodology}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-md sm:text-lg font-extrabold text-slate-900">
              Coverage Sizing Rules & Transparent Formula Guide
            </h2>
          </div>
          {showMethodology ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
        </button>

        <p className="text-xs text-slate-600 leading-relaxed">
          Standard Indian financial planners compute family health insurance corpus sizes based on age profiles, family sizes, and specific health risk additions. This calculator utilizes the following open formula structure:
        </p>

        {showMethodology && (
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed animate-fadeIn">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Base Safety Limit by Oldest Age</h3>
                <p className="text-xs">
                  Older individuals carry higher healthcare risks, raising the starting baseline corpus required:
                </p>
                <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] mt-1 text-slate-600">
                  <li><strong>Oldest member under 45 years:</strong> ₹5,00,000 Base Cover</li>
                  <li><strong>Oldest member 45 to 60 years:</strong> ₹7,50,000 Base Cover</li>
                  <li><strong>Oldest member above 60 years:</strong> ₹10,00,000 Base Cover</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. Demographics & Family Size Cushions</h3>
                <p className="text-xs">
                  As members are added to the policy, the cover pool must be padded to prevent concurrent hospitalization shortfalls:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 font-mono text-[11px] mt-1">
                  <li><strong>Each Additional Adult (above 1):</strong> +₹2,00,000 Cover</li>
                  <li><strong>Each Child Covered:</strong> +₹1,50,000 Cover</li>
                  <li><strong>Each Senior Citizen Parent Covered:</strong> +₹5,00,000 Cover</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">3. Special Disease Sizing Cushion</h3>
                <p className="text-xs">
                  Having pre-existing chronic conditions (diabetes, hypertension, cardiac or renal elements) flags higher critical risk. An additive coverage buffer is applied:
                </p>
                <p className="font-semibold text-slate-900 font-mono mt-1 text-[11px]">
                  +₹5,00,000 Additive Sizing Buffer
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  *Note: This is an additive corpus cushion to ensure sufficient limits are available for claims; it is distinct from any premium loading percentage applied by underwriters.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">4. Slabs & Sizing Standards</h3>
                <p className="text-xs text-slate-600">
                  Raw coverage needs are automatically rounded upwards to the closest standard insurance market product sum insured slab:
                </p>
                <p className="font-mono text-[11px] text-slate-600 mt-1">
                  Slabs: 5L, 7.5L, 10L, 15L, 20L, 25L, 50L, and 1 Crore (100L).
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
