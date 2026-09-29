import React from 'react';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Building,
  TrendingDown,
  Coins,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calculator,
  UserCheck,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const OldVsNewRegimeGuideContent: React.FC = () => {
  return (
    <div className="w-full space-y-8 font-sans text-[#222325]">
      {/* 1. HERO INTRODUCTION & EXECUTIVE OVERVIEW */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Comprehensive Tax Guide &bull; FY 2026-27 (AY 2027-28)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
          Comprehensive Guide to the Old vs. New Tax Regime Comparison for FY 2026-27 (AY 2027-28)
        </h2>

        <p className="text-sm sm:text-base text-[#404145] leading-relaxed">
          Choosing the optimal income tax path is an annual exercise that directly dictates your disposable income, savings capacity, and overall financial health. With structured updates remaining stable under the tax framework for <strong>Financial Year (FY) 2026-27 (Assessment Year 2027-28)</strong>, taxpayers have a clear window to evaluate whether the simplified slabs of the New Tax Regime or the deduction-heavy framework of the Old Tax Regime serves them best.
        </p>

        <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
          This exhaustive guide provides a thorough, plain-English exploration of the mechanics, exemptions, special asset treatments, and compliance workflows governing both tax systems.
        </p>
      </section>

      {/* 2. DEEP-DIVE TAX SLAB ARCHITECTURE */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#222325]">
            Deep-Dive Tax Slab Architecture: Old vs. New Regimes
          </h3>
          <p className="text-xs sm:text-sm text-[#74767e] mt-1">
            To understand where your hard-earned money goes, you must first look at how the government structures tax brackets under each system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Tax Regime Framework Card */}
          <div className="bg-gradient-to-br from-[#f4fdf8] via-white to-[#eefcf4] rounded-3xl border border-[#1dbf73]/40 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1dbf73]" />
                <h4 className="text-base sm:text-lg font-extrabold text-[#222325]">
                  The New Tax Regime Framework
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1dbf73] text-white text-[11px] font-bold">
                Default Option
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
              The New Tax Regime is designed as the default option for individual taxpayers, prioritizing wider income brackets and lower base rates over itemized paperwork.
            </p>

            <ul className="space-y-2.5 text-xs text-[#404145]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0 mt-0.5" />
                <span>
                  <strong>Basic Exemption Limit:</strong> Income up to ₹4,00,000 attracts zero tax.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0 mt-0.5" />
                <span>
                  <strong>Progressive Slabs:</strong> Incremental brackets apply in ₹4 Lakh increments—ranging from 5% on ₹4L–8L, 10% on ₹8L–12L, 15% on ₹12L–16L, 20% on ₹16L–20L, 25% on ₹20L–24L, culminating in a maximum rate of 30% on taxable income exceeding ₹24,00,000.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0 mt-0.5" />
                <span>
                  <strong>Salaried Standard Deduction:</strong> Salaried individuals and pensioners can claim a flat ₹75,000 standard deduction, which directly reduces gross salary before slab calculations begin.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0 mt-0.5" />
                <span>
                  <strong>Rebate u/s 87A:</strong> Through the rebate mechanism, resident individuals with a net taxable income of up to ₹12,00,000 effectively pay zero tax, making salary incomes up to <strong>₹12,75,000 entirely tax-free</strong> when factoring in the standard deduction.
                </span>
              </li>
            </ul>
          </div>

          {/* Old Tax Regime Framework Card */}
          <div className="bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 rounded-3xl border border-blue-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h4 className="text-base sm:text-lg font-extrabold text-[#222325]">
                  The Old Tax Regime Framework
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                Deductions Heavy
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
              The Old Tax Regime preserves traditional tax-saving instruments, rewarding individuals who systematically lock funds into long-term savings, insurance, and housing loans.
            </p>

            <ul className="space-y-2.5 text-xs text-[#404145]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Basic Exemption Limit:</strong> Standard exemption starts at ₹2,50,000 for individuals below 60 years of age, with higher thresholds reserved for senior citizens.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Progressive Slabs:</strong> Income between ₹2.5 Lakh and ₹5 Lakh is taxed at 5%, income between ₹5 Lakh and ₹10 Lakh at 20%, and income above ₹10 Lakh at 30%.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Salaried Standard Deduction:</strong> Salaried taxpayers receive a flat ₹50,000 standard deduction.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Rebate u/s 87A:</strong> Tax liability is reduced to nil if net taxable income does not exceed ₹5,00,000.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. THE POWER PLAYER: CORPORATE NPS CONTRIBUTION [SECTION 80CCD(2)] */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-700">
          <Building className="w-5 h-5" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
            The Power Player: Corporate NPS Contribution [Section 80CCD(2)] Under Both Regimes
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          One of the most effective structural tools available to modern corporate employees is the employer National Pension System (NPS) contribution under Section 80CCD(2).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-[#222325] block">The Core Mechanism</span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Employers are permitted to contribute up to <strong>14% of an employee's basic salary</strong> (plus dearness allowance) into their Tier-1 NPS account.
            </p>
          </div>

          <div className="p-4 bg-[#f4fdf8] rounded-2xl border border-[#d8f5e5] space-y-1.5">
            <span className="text-xs font-bold text-[#1dbf73] block">Simultaneous Availability</span>
            <p className="text-xs text-[#404145] leading-relaxed">
              Unlike standard 80C instruments which are forfeited under the New Tax Regime, corporate NPS contributions under Section 80CCD(2) remain <strong>fully deductible simultaneously under both regimes</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-[#222325] block">CTC Restructuring</span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Employees can collaborate with corporate compensation teams to re-engineer their Cost to Company (CTC) packages, maximizing this employer-backed benefit to lower taxable income regardless of which tax path they choose for the year.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HANDLING CAPITAL GAINS & SPECIAL TAX RATES SEPARATELY */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#222325]">
          <Coins className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg sm:text-xl font-bold">
            Handling Capital Gains and Special Tax Rates Separately
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          When computing your overall annual tax burden, it is vital to recognize that regular income tax slabs do not apply uniformly to all revenue streams.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-amber-900 block">Asset Separation</span>
            <p className="text-xs text-amber-800 leading-relaxed">
              Profits derived from the sale of equity shares, mutual funds, real estate, or digital assets are classified as Short-Term Capital Gains (STCG) or Long-Term Capital Gains (LTCG). These gains are taxed at independent, flat statutory rates (e.g. STCG 111A @ 20%, LTCG 112A @ 12.5% above ₹1.25L, Crypto @ 30%).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#222325] block">Regime Independence</span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Because capital gains are governed by separate schedules, your choice between the Old and New Tax Regimes primarily impacts active earnings like salary, rental income, and business profits, rather than modifying how your investment yields are taxed.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SWITCHING FLEXIBILITY: SALARIED EMPLOYEES VS BUSINESS OWNERS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#222325]">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg sm:text-xl font-bold">
            Switching Flexibility: Salaried Employees vs. Business Owners
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          The regulatory freedom to toggle between tax systems varies depending on your professional profile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
            <span className="text-xs font-bold text-emerald-900 block">
              Salaried Professionals (Annual Flexibility)
            </span>
            <p className="text-xs text-emerald-800 leading-relaxed">
              If you earn income strictly under the head of "Salary" and possess no business or professional revenue, you have absolute freedom. You can select the New Tax Regime for one financial year, switch back to the Old Tax Regime the next, and readjust during any subsequent filing cycle.
            </p>
          </div>

          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
            <span className="text-xs font-bold text-rose-900 block">
              Business Owners & Freelancers (Once in a Lifetime)
            </span>
            <p className="text-xs text-rose-800 leading-relaxed">
              Taxpayers reporting income under business or professional heads face strict limitations. Once a business owner opts out of the New Tax Regime, they generally receive only a single opportunity in their lifetime to switch back, making long-term tax architecture decisions critical.
            </p>
          </div>
        </div>
      </section>

      {/* 6. THE CONCEPT OF THE "BREAK-EVEN THRESHOLD" */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#1dbf73]">
          <Calculator className="w-5 h-5" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
            The Concept of the "Break-Even Threshold"
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          Deciding whether the Old Regime's deductions outweigh the New Regime's lower slab rates comes down to calculating your personal break-even threshold.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-[#222325] block">Definition</span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              The break-even point is the exact total amount of itemized deductions (combining Section 80C, Section 80D, HRA, and Section 24 home loan interest) you must accumulate under the Old Regime to match the lower tax outflow of the New Regime.
            </p>
          </div>

          <div className="p-4 bg-[#f4fdf8] rounded-2xl border border-[#d8f5e5] space-y-1.5">
            <span className="text-xs font-bold text-[#1dbf73] block">The Rupee Calculation</span>
            <p className="text-xs text-[#404145] leading-relaxed">
              Across average middle-to-high income brackets, this threshold typically hovers between <strong>₹2.5 Lakhs and ₹3.75 Lakhs</strong> in aggregate deductions. If your verified deductions cross this amount, the Old Tax Regime proves beneficial; if they remain lower, the New Tax Regime wins.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SENIOR CITIZENS & SUPER SENIOR CITIZENS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
          Senior Citizens and Super Senior Citizens: Special Exemptions Under the Old Regime
        </h3>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          While the New Tax Regime treats all individuals equally under a unified slab schedule, the Old Tax Regime continues to honor age-based tax relief:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-[#222325] block">
              Senior Citizens (Aged 60 to 80)
            </span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              The basic exemption limit under the Old Regime is elevated to <strong>₹3,00,000</strong>, shielding a larger portion of initial income from tax.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-[#222325] block">
              Super Senior Citizens (Aged 80+)
            </span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              The basic exemption limit climbs further to <strong>₹5,00,000</strong> under the Old Regime.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-[#222325] block">Strategic Value</span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              For older taxpayers managing substantial medical insurance outlays, senior citizen fixed deposits (80TTB), and pension earnings, these higher basic exemptions make the Old Regime exceptionally competitive.
            </p>
          </div>
        </div>
      </section>

      {/* 8. STEP-BY-STEP GUIDE: HOW TO LOCK YOUR CHOICE ON THE GOVERNMENT ITR PORTAL */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#222325]">
          <FileText className="w-5 h-5 text-[#1dbf73]" />
          <h3 className="text-lg sm:text-xl font-bold">
            Step-by-Step Guide: How to Lock Your Choice on the Government ITR Portal
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          Once you run your numbers through a dual-regime calculator, finalizing your choice on the official government portal involves clear compliance steps:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-[#222325]">Employer TDS Intimation</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              At the start of the financial year, declare your preferred tax regime to your employer's payroll department so they can deduct accurate monthly TDS. This initial choice is fully flexible and not permanently binding.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-[#222325]">Filing Form 10IEA</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              If you earn business or professional income and intend to switch regimes, ensure that the requisite electronic forms (such as Form 10IEA) are submitted on the income tax portal prior to filing deadlines.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-[#222325]">Choosing Correct ITR Form</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              Select the right return schedule matching your income sources (such as ITR-1 or ITR-4 for simpler salary profiles, and ITR-2 or ITR-3 for capital gains or business portfolios).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h4 className="text-xs font-bold text-[#222325]">Final Portal Declaration</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              During the final submission process on the e-filing portal, explicitly verify and select your chosen tax regime before submitting and e-verifying your return.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
