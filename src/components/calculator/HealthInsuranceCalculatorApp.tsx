import React, { useState, useMemo } from 'react';
import {
  Activity,
  Heart,
  TrendingUp,
  MapPin,
  Users,
  Shield,
  HelpCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info
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

interface HealthInsuranceCalculatorAppProps {
  calculator?: Calculator;
}

export const HealthInsuranceCalculatorApp: React.FC<HealthInsuranceCalculatorAppProps> = () => {
  // 1. Inputs
  const [insureSelf, setInsureSelf] = useState<boolean>(true);
  const [insureSpouse, setInsureSpouse] = useState<boolean>(false);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [parentsCount, setParentsCount] = useState<number>(0);

  const [ageSelf, setAgeSelf] = useState<number>(30);
  const [ageSpouse, setAgeSpouse] = useState<number>(30);
  const [ageOldestChild, setAgeOldestChild] = useState<number>(5);
  const [ageOldestParent, setAgeOldestParent] = useState<number>(60);

  const [policyType, setPolicyType] = useState<'Individual' | 'Family Floater'>('Family Floater');
  const [sumInsuredValue, setSumInsuredValue] = useState<number>(1000000); // 10 Lakhs default
  const [voluntaryDeductible, setVoluntaryDeductible] = useState<number>(0); // Percentage
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  // Sum Insured options
  const sumInsuredOptions = [
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹15 Lakh', value: 1500000 },
    { label: '₹20 Lakh', value: 2000000 },
    { label: '₹25 Lakh', value: 2500000 },
    { label: '₹50 Lakh', value: 5000000 },
    { label: '₹1 Crore', value: 10000000 },
  ];

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

  // Base premium determined by oldest age (Standard Indian Market Underwriting Guideline Table)
  const getBasePremiumForAge = (age: number): number => {
    if (age < 25) return 6000;
    if (age <= 35) return 7500;
    if (age <= 45) return 9500;
    if (age <= 55) return 14000;
    if (age <= 65) return 22000;
    if (age <= 75) return 35000;
    return 50000;
  };

  // Sum Insured Multipliers
  const getSumInsuredMultiplier = (si: number): number => {
    if (si <= 500000) return 1.0;
    if (si <= 1000000) return 1.4;
    if (si <= 1500000) return 1.7;
    if (si <= 2000000) return 2.0;
    if (si <= 2500000) return 2.2;
    if (si <= 5000000) return 2.8;
    return 3.5; // 1 Crore
  };

  // 2. Premium Core Calculation Engine (Corrected Version)
  const calculation = useMemo(() => {
    // Determine oldest age covered
    let oldestAge = 0;
    const agesCovered: number[] = [];
    if (insureSelf) {
      agesCovered.push(ageSelf);
      oldestAge = Math.max(oldestAge, ageSelf);
    }
    if (insureSpouse) {
      agesCovered.push(ageSpouse);
      oldestAge = Math.max(oldestAge, ageSpouse);
    }
    if (childrenCount > 0) {
      agesCovered.push(ageOldestChild);
      oldestAge = Math.max(oldestAge, ageOldestChild);
    }
    if (parentsCount > 0) {
      agesCovered.push(ageOldestParent);
      oldestAge = Math.max(oldestAge, ageOldestParent);
    }

    if (agesCovered.length === 0) {
      return {
        annualPremium: 0,
        monthlyEquivalent: 0,
        peopleCount: 0,
        peopleCoveredText: 'No members selected',
        factors: [],
        chartDataSI: [],
        chartDataAge: [],
        total80DDeduction: 0,
        deductionSelf: 0,
        deductionParents: 0,
        limitSelf: 25000,
        limitParents: 25000
      };
    }

    const baseOldestPremium = getBasePremiumForAge(oldestAge);
    const siMultiplier = getSumInsuredMultiplier(sumInsuredValue);

    const activeAdults = (insureSelf ? 1 : 0) + (insureSpouse ? 1 : 0);
    const activeChildren = childrenCount;
    const activeParents = parentsCount;
    const totalPeople = activeAdults + activeChildren + activeParents;

    let basePremiumResult = 0;

    if (policyType === 'Individual') {
      // Individual: sum of individual base premiums
      let selfPrem = insureSelf ? getBasePremiumForAge(ageSelf) : 0;
      let spousePrem = insureSpouse ? getBasePremiumForAge(ageSpouse) : 0;
      let childPrem = activeChildren * 3000;
      let parentPrem = activeParents * getBasePremiumForAge(ageOldestParent);

      basePremiumResult = (selfPrem + spousePrem + childPrem + parentPrem) * siMultiplier;
    } else {
      // Family Floater
      // Floater factor for core family (Self + Spouse + Kids)
      let floaterAdultFactor = 1.0;
      if (activeAdults === 2) floaterAdultFactor = 1.5;

      let floaterChildFactor = activeChildren * 0.3; // +30% premium per kid in floater

      const primaryOldestAge = insureSelf || insureSpouse ? Math.max(insureSelf ? ageSelf : 0, insureSpouse ? ageSpouse : 0) : ageOldestChild;
      const primaryBase = getBasePremiumForAge(primaryOldestAge);
      
      let primaryFloaterPremium = primaryBase * (floaterAdultFactor + floaterChildFactor) * siMultiplier;

      // Parents in floaters or separate riders
      let parentsFloaterPremium = 0;
      if (activeParents > 0) {
        const parentBase = getBasePremiumForAge(ageOldestParent);
        const parentFloaterFactor = activeParents === 2 ? 1.6 : 1.0;
        parentsFloaterPremium = parentBase * parentFloaterFactor * siMultiplier * 1.1; // 10% premium loading for separate senior citizen risk
      }

      basePremiumResult = primaryFloaterPremium + parentsFloaterPremium;
    }

    // --- CORRECTION 3: Uniform Location Pricing for V1 (zoneMultiplier = 1.0) ---
    const zoneMultiplier = 1.0; 

    // Calculate premium with zone multiplier and deductible
    let calculatedPremium = basePremiumResult * zoneMultiplier * (1 - voluntaryDeductible / 100);

    // --- CORRECTION 1: Removed universal 5% female discount (multiplier remains 1.0) ---
    // --- CORRECTION 2: Removed universal +25% medical loading (multiplier remains 1.0) ---

    // Final calculations
    const annualPremium = Math.round(calculatedPremium);
    const monthlyEquivalent = Math.round(annualPremium / 12);

    // Factors list (All multipliers/assumptions transparently documented)
    const factors = [
      `Oldest Covered Age: Pricing is based on the oldest member age of ${oldestAge} years.`,
      `Policy Structure: Computed as ${policyType} (${totalPeople} member${totalPeople > 1 ? 's' : ''} total).`,
      `Cover multiplier: Sum Insured of ${formatShort(sumInsuredValue)} applies a factor of ${siMultiplier}x to base pricing.`,
      `Pre-existing Conditions: Standard indicative baseline assumed. Actual underwriting loads, waiting periods (2-4 years), or exclusions vary by provider.`,
      `Location & Gender Factors: A uniform baseline pricing structure is applied without arbitrary premium offsets.`
    ];

    // Generate bar chart data (Premium vs Sum Insured)
    const chartDataSI = sumInsuredOptions.map(opt => {
      const scaleMultiplier = getSumInsuredMultiplier(opt.value);
      let siBaseResult = 0;

      if (policyType === 'Individual') {
        let selfPrem = insureSelf ? getBasePremiumForAge(ageSelf) : 0;
        let spousePrem = insureSpouse ? getBasePremiumForAge(ageSpouse) : 0;
        let childPrem = activeChildren * 3000;
        let parentPrem = activeParents * getBasePremiumForAge(ageOldestParent);
        siBaseResult = (selfPrem + spousePrem + childPrem + parentPrem) * scaleMultiplier;
      } else {
        let floaterAdultFactor = 1.0;
        if (activeAdults === 2) floaterAdultFactor = 1.5;
        let floaterChildFactor = activeChildren * 0.3;
        const primaryOldestAge = insureSelf || insureSpouse ? Math.max(insureSelf ? ageSelf : 0, insureSpouse ? ageSpouse : 0) : ageOldestChild;
        const primaryBase = getBasePremiumForAge(primaryOldestAge);
        let primaryFloaterPremium = primaryBase * (floaterAdultFactor + floaterChildFactor) * scaleMultiplier;

        let parentsFloaterPremium = 0;
        if (activeParents > 0) {
          const parentBase = getBasePremiumForAge(ageOldestParent);
          const parentFloaterFactor = activeParents === 2 ? 1.6 : 1.0;
          parentsFloaterPremium = parentBase * parentFloaterFactor * scaleMultiplier * 1.1;
        }
        siBaseResult = primaryFloaterPremium + parentsFloaterPremium;
      }

      return {
        sumInsured: opt.label,
        premium: Math.round(siBaseResult * zoneMultiplier)
      };
    });

    // Generate line chart data (Premium vs Age)
    const testAges = [18, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
    const chartDataAge = testAges.map(age => {
      // Re-estimate baseline oldest premium for the graph
      const testBase = getBasePremiumForAge(age);
      let testBaseResult = 0;

      if (policyType === 'Individual') {
        let selfPrem = insureSelf ? testBase : 0;
        let spousePrem = insureSpouse ? getBasePremiumForAge(ageSpouse) : 0;
        let childPrem = activeChildren * 3000;
        let parentPrem = activeParents * getBasePremiumForAge(ageOldestParent);
        testBaseResult = (selfPrem + spousePrem + childPrem + parentPrem) * siMultiplier;
      } else {
        let floaterAdultFactor = 1.0;
        if (activeAdults === 2) floaterAdultFactor = 1.5;
        let floaterChildFactor = activeChildren * 0.3;
        let primaryFloaterPremium = testBase * (floaterAdultFactor + floaterChildFactor) * siMultiplier;

        let parentsFloaterPremium = 0;
        if (activeParents > 0) {
          const parentBase = getBasePremiumForAge(ageOldestParent);
          const parentFloaterFactor = activeParents === 2 ? 1.6 : 1.0;
          parentsFloaterPremium = parentBase * parentFloaterFactor * siMultiplier * 1.1;
        }
        testBaseResult = primaryFloaterPremium + parentsFloaterPremium;
      }

      return {
        age,
        premium: Math.round(testBaseResult * zoneMultiplier)
      };
    });

    // Generate readable covered text
    const membersText: string[] = [];
    if (insureSelf) membersText.push('Self');
    if (insureSpouse) membersText.push('Spouse');
    if (activeChildren > 0) membersText.push(`${activeChildren} Child${activeChildren > 1 ? 'ren' : ''}`);
    if (activeParents > 0) membersText.push(`${activeParents} Parent${activeParents > 1 ? 's' : ''}`);

    // Section 80D Tax Benefit Calculation
    const isSelfSenior = (insureSelf && ageSelf >= 60) || (insureSpouse && ageSpouse >= 60);
    const isParentSenior = activeParents > 0 && ageOldestParent >= 60;

    const limitSelf = isSelfSenior ? 50000 : 25000;
    const limitParents = isParentSenior ? 50000 : 25000;

    // Logic for benefit: premium paid up to the limit
    // If it's a floater, the premium is combined for Self+Spouse+Kids
    // Parents are separate in the engine calculation
    let premiumSelfFamily = 0;
    let premiumParents = 0;

    if (policyType === 'Individual') {
      let selfPrem = insureSelf ? getBasePremiumForAge(ageSelf) : 0;
      let spousePrem = insureSpouse ? getBasePremiumForAge(ageSpouse) : 0;
      let childPrem = activeChildren * 3000;
      premiumSelfFamily = (selfPrem + spousePrem + childPrem) * siMultiplier;
      premiumParents = (activeParents * getBasePremiumForAge(ageOldestParent)) * siMultiplier;
    } else {
      let floaterAdultFactor = 1.0;
      if (activeAdults === 2) floaterAdultFactor = 1.5;
      let floaterChildFactor = activeChildren * 0.3;
      const primaryOldestAge = insureSelf || insureSpouse ? Math.max(insureSelf ? ageSelf : 0, insureSpouse ? ageSpouse : 0) : ageOldestChild;
      const primaryBase = getBasePremiumForAge(primaryOldestAge);
      premiumSelfFamily = primaryBase * (floaterAdultFactor + floaterChildFactor) * siMultiplier;

      if (activeParents > 0) {
        const parentBase = getBasePremiumForAge(ageOldestParent);
        const parentFloaterFactor = activeParents === 2 ? 1.6 : 1.0;
        premiumParents = parentBase * parentFloaterFactor * siMultiplier * 1.1;
      }
    }

    const deductionSelf = Math.min(premiumSelfFamily, limitSelf);
    const deductionParents = Math.min(premiumParents, limitParents);
    const total80DDeduction = deductionSelf + deductionParents;

    return {
      annualPremium,
      monthlyEquivalent,
      peopleCount: totalPeople,
      peopleCoveredText: membersText.join(' + '),
      factors,
      chartDataSI,
      chartDataAge,
      total80DDeduction,
      deductionSelf,
      deductionParents,
      limitSelf,
      limitParents
    };
  }, [
    insureSelf,
    insureSpouse,
    childrenCount,
    parentsCount,
    ageSelf,
    ageSpouse,
    ageOldestChild,
    ageOldestParent,
    policyType,
    sumInsuredValue,
    voluntaryDeductible,
  ]);

  return (
    <main
      aria-label="Health Insurance Calculator Workspace"
      className="space-y-10 font-sans text-slate-800"
    >
      <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Column */}
        <section
          aria-labelledby="health-calc-inputs"
          className="lg:col-span-6 space-y-6"
        >
          <header className="border-b border-slate-200 pb-4">
            <h2 id="health-calc-inputs" className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" aria-hidden="true" />
              Premium & Cost Estimator Inputs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select members, ages, location, and coverage parameters to compute your policy premium.
            </p>
          </header>

          <fieldset className="space-y-5 border-none p-0 m-0">
            <legend className="sr-only">Members to Insure</legend>
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. People to Insure
            </span>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={insureSelf}
                  onChange={(e) => setInsureSelf(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Self (You)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={insureSpouse}
                  onChange={(e) => setInsureSpouse(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">Spouse</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="select-children" className="block text-xs font-semibold text-slate-700">
                  Number of Children
                </label>
                <select
                  id="select-children"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                >
                  <option value={0}>0 Children</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Children</option>
                  <option value={3}>3 Children</option>
                  <option value={4}>4 Children</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="select-parents" className="block text-xs font-semibold text-slate-700">
                  Number of Parents
                </label>
                <select
                  id="select-parents"
                  value={parentsCount}
                  onChange={(e) => setParentsCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                >
                  <option value={0}>0 Parents</option>
                  <option value={1}>1 Parent</option>
                  <option value={2}>2 Parents</option>
                </select>
              </div>
            </div>

            {/* Age sliders dynamically displayed if checked */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Member Ages
              </span>

              {insureSelf && (
                <AccessibleSlider
                  id="age-self-input"
                  label="Age of Self"
                  value={ageSelf}
                  min={18}
                  max={80}
                  unit="Yrs"
                  onChange={setAgeSelf}
                />
              )}

              {insureSpouse && (
                <AccessibleSlider
                  id="age-spouse-input"
                  label="Age of Spouse"
                  value={ageSpouse}
                  min={18}
                  max={80}
                  unit="Yrs"
                  onChange={setAgeSpouse}
                />
              )}

              {childrenCount > 0 && (
                <AccessibleSlider
                  id="age-child-input"
                  label="Age of Oldest Child"
                  value={ageOldestChild}
                  min={1}
                  max={25}
                  unit="Yrs"
                  onChange={setAgeOldestChild}
                />
              )}

              {parentsCount > 0 && (
                <AccessibleSlider
                  id="age-parent-input"
                  label="Age of Oldest Parent"
                  value={ageOldestParent}
                  min={35}
                  max={90}
                  unit="Yrs"
                  onChange={setAgeOldestParent}
                />
              )}
            </div>

            {/* Core Settings */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Policy & Coverage Details
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="select-policy-type" className="block text-xs font-semibold text-slate-700">
                    Policy Structure
                  </label>
                  <select
                    id="select-policy-type"
                    value={policyType}
                    onChange={(e) => setPolicyType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 font-medium"
                  >
                    <option value="Family Floater">Family Floater</option>
                    <option value="Individual">Individual Policy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="select-sum-insured" className="block text-xs font-semibold text-slate-700">
                    Sum Insured Cover
                  </label>
                  <select
                    id="select-sum-insured"
                    value={sumInsuredValue}
                    onChange={(e) => setSumInsuredValue(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-emerald-500 font-medium"
                  >
                    {sumInsuredOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </fieldset>
        </section>

        {/* Right Output Column */}
        <section
          aria-label="Health Insurance Results Panel"
          className="lg:col-span-6 space-y-6"
        >
          {/* Main Hero Card: Indicative Premium Estimate */}
          <AccessibleSummaryCard
            id="hero-health-premium"
            title="Indicative Premium Estimate"
            value={formatINR(calculation.annualPremium)}
            formattedSubtitle={`Monthly Equivalent: ${formatINR(calculation.monthlyEquivalent)}/month`}
            badgeLabel="Planning Estimate"
            isHero={true}
            statusType="success"
            statusText={
              calculation.annualPremium > 0
                ? `Plan covers: ${calculation.peopleCoveredText}`
                : 'Select family members to calculate premium cost.'
            }
          />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AccessibleSummaryCard
              id="card-sum-insured"
              title="Sum Insured Cover Selected"
              value={formatShort(sumInsuredValue)}
              formattedSubtitle="Underwriting limit per claim year"
            />

            <AccessibleSummaryCard
              id="card-80d-benefit"
              title="Sec 80D Tax Benefit"
              value={formatINR(calculation.total80DDeduction)}
              formattedSubtitle={`Max Limit: ${formatINR(calculation.limitSelf + calculation.limitParents)}`}
              statusType="success"
            />
          </div>

          {/* Core Underwriting Factors */}
          <article
            aria-labelledby="factors-heading"
            className="p-5 bg-slate-900 text-white rounded-2xl space-y-3.5 border border-slate-800 shadow-md"
          >
            <h3 id="factors-heading" className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Underwriting Parameters Checked
            </h3>
            <ul className="text-xs space-y-2 font-mono text-slate-200">
              {calculation.annualPremium > 0 ? (
                calculation.factors.map((factor, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-emerald-400 shrink-0">✔</span>
                    <span>{factor}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">Select members to view underwriting parameters.</li>
              )}
            </ul>
          </article>

          {/* Disclaimer (Correction 8) */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Indicative Premium Estimate:</strong> This is a planning projection. Actual premiums vary by insurer, product, underwriting, age, medical history, location and policy terms.
            </p>
          </div>

          {/* Chart 1: Premium vs Sum Insured (Bar Chart) */}
          {calculation.annualPremium > 0 && (
            <article
              aria-label="Chart: Premium vs Sum Insured"
              className="p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-3"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                Premium vs Sum Insured Cover Options
              </h3>
              <p className="text-[11px] text-slate-600 leading-normal">
                How premium levels adjust across standard coverage options under your chosen profile.
              </p>

              <div className="h-48 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calculation.chartDataSI} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="sumInsured" fontSize={10} stroke="#475569" tickLine={false} />
                    <YAxis fontSize={10} stroke="#475569" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                    <Tooltip
                      formatter={(v) => [formatINR(Number(v)), 'Est. Premium']}
                      contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                    />
                    <Bar dataKey="premium" name="Annual Premium" fill="#1dbf73" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          )}

          {/* Chart 2: Premium vs Age (Line Chart) */}
          {calculation.annualPremium > 0 && (
            <article
              aria-label="Chart: Premium vs Age Trajectory"
              className="p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-3"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                Cost Trajectory by Age (Aging Impact)
              </h3>
              <p className="text-[11px] text-slate-600 leading-normal">
                Visualizing how medical claim pricing brackets rise as members age.
              </p>

              <div className="h-48 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calculation.chartDataAge} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="age" fontSize={10} stroke="#475569" tickLine={false} unit=" yrs" />
                    <YAxis fontSize={10} stroke="#475569" tickLine={false} tickFormatter={(v) => formatShort(v)} />
                    <Tooltip
                      formatter={(v) => [formatINR(Number(v)), 'Est. Premium']}
                      contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="premium" name="Premium" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          )}

        </section>
      </div>

      {/* Transparent Calculation Methodology (Correction 10) */}
      <section className="bg-slate-50 border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="flex items-center justify-between w-full text-left focus:outline-hidden"
          aria-expanded={showMethodology}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="text-md sm:text-lg font-extrabold text-slate-900">
              Calculation Methodology & Underwriting Transparency
            </h2>
          </div>
          {showMethodology ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
        </button>

        <p className="text-xs text-slate-600 leading-relaxed">
          Indian health insurers compute risk premiums based on age, floater structures, and the sum insured. Under the Hood, standard rates use the following actuarial pricing matrices:
        </p>

        {showMethodology && (
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed animate-fadeIn">
            <div className="space-y-3.5">
              <h3 className="font-bold text-slate-900 text-sm">1. Oldest Age Bracket Baseline Rates</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full font-mono text-[11px] border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-900">
                      <th className="px-3 py-1.5 text-left font-bold">Age Bracket</th>
                      <th className="px-3 py-1.5 text-right font-bold">Annual Base Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-1.5 text-left">Under 25 Years</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹6,000</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-1.5 text-left">25 to 35 Years</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹7,500</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-1.5 text-left">36 to 45 Years</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹9,500</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-1.5 text-left">46 to 55 Years</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹14,000</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-1.5 text-left">56 to 65 Years</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹22,000</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-1.5 text-left">66 to 75 Years</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹35,000</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 text-left">Above 75 Years</td>
                      <td className="px-3 py-1.5 text-right font-bold">₹50,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500">
                *Rates correspond to primary oldest adult covered. Child-only premium is fixed at ₹3,000 in individual policies.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">2. Sum Insured Coverage Multipliers</h3>
                <p className="text-xs">
                  Increasing the sum insured compounds the risk cover but offers bulk-discount pricing brackets:
                </p>
                <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] mt-1 text-slate-600">
                  <li>₹5 Lakh: 1.00x Base</li>
                  <li>₹10 Lakh: 1.40x Base (Savings on second 5L)</li>
                  <li>₹15 Lakh: 1.70x Base</li>
                  <li>₹20 Lakh: 2.00x Base</li>
                  <li>₹25 Lakh: 2.20x Base</li>
                  <li>₹50 Lakh: 2.80x Base</li>
                  <li>₹1 Crore: 3.50x Base</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">3. Floater Multiplier Formulas</h3>
                <p className="text-xs">
                  A Family Floater policy shares a pool of cover across members. Surcharges:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Second Adult Factor:</strong> Adds +50% of the primary adult's rate (1.5x Multiplier).</li>
                  <li><strong>Child Surcharge:</strong> Adds +30% of base premium per child covered.</li>
                  <li><strong>Senior Citizen Parents:</strong> Placed in a separate pool at +10% senior citizens risk loading (1.1x multiplier for senior safety brackets).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
