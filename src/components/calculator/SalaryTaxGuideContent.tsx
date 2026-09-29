import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Percent,
  Coins,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Sparkles,
  Calculator as CalcIcon,
  Check,
  Building,
  Home,
  FileText,
  DollarSign,
} from 'lucide-react';

export const SalaryTaxGuideContent: React.FC = () => {
  return (
    <article className="w-full space-y-10 font-sans text-[#222325]">
      {/* 1. HERO INTRODUCTION / OVERVIEW */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Financial Year 2026-27 (AY 2027-28) Guide</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#222325] tracking-tight">
          FY 2026-27 Salary & Income Tax Calculator: Complete Guide
        </h2>

        <p className="text-sm sm:text-base text-[#404145] leading-relaxed">
          Figuring out your annual tax doesn't have to feel like decoding a secret code.
          Whether you are filing your taxes on your own or using an online salary tax
          calculator to plan your monthly budget, understanding how your earnings,
          deductions, and tax slabs fit together makes everything easy.
        </p>

        <p className="text-sm sm:text-base text-[#404145] leading-relaxed">
          This guide breaks down everything you need to know in very simple terms for{' '}
          <strong>Financial Year 2026-27 (Assessment Year 2027-28)</strong>.
        </p>

        <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#1dbf73] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
            <strong>Key Takeaway:</strong> Welcome to your go-to guide for calculating income
            tax for Financial Year 2026-27. Our online calculator tool is built to cut through
            the confusion, let you test your numbers instantly, and show you a clean
            side-by-side comparison of the Old and New Tax Regimes so you can keep more of
            your hard-earned money.
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE CALCULATOR INTERFACE WIDGET CALLOUT */}
      <section className="bg-gradient-to-r from-slate-900 via-[#1c2826] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
          <CalcIcon className="w-4 h-4" />
          <span>Interactive Calculator Engine</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          2. Interactive Calculator Interface Widget
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          At the heart of this page is our live calculator tool. It features straightforward
          boxes for your salary, allowances, and deductions, paired with a dual-column live
          comparison. As you type your numbers, you can instantly see how your tax shapes up
          under both systems side by side, along with your total yearly savings highlighted
          right at the top.
        </p>
      </section>

      {/* 3. STEP-BY-STEP GUIDE: HOW TO CALCULATE YOUR SALARY TAX ONLINE */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
            3. Step-by-Step Guide: How to Calculate Your Salary Tax Online
          </h3>
          <p className="text-xs sm:text-sm text-[#74767e] mt-1">
            Using a tax calculator gives you accurate results when you enter your figures step
            by step:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#fafafa] rounded-2xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#1dbf73] text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#222325]">
              Select the Financial Year
            </h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Make sure your tool is set to FY 2026-27 so it uses the correct current rules and
              updated slabs.
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-2xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#1dbf73] text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#222325]">
              Enter All Income Sources
            </h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Type in your main salary, rental earnings from property, interest earned from bank
              savings or fixed deposits, and any other extra money you made.
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-2xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#1dbf73] text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#222325]">
              Add Allowances (If Using Old Regime)
            </h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              If you claim perks like House Rent Allowance (HRA) or Leave Travel Allowance (LTA),
              note them down with rent paid.
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-2xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-[#1dbf73] text-white flex items-center justify-center text-xs font-bold">
              4
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#222325]">
              Input Tax-Saving Deductions
            </h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Add your Section 80C investments or medical insurance if sticking with the Old Tax
              Regime. (Under the New Regime, most boxes are skipped automatically).
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-2xl border border-slate-200 space-y-2 md:col-span-2 lg:col-span-2">
            <div className="w-7 h-7 rounded-lg bg-[#1dbf73] text-white flex items-center justify-center text-xs font-bold">
              5
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#222325]">Review Your Results</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Check your estimated tax across both systems instantly with side-by-side
              comparison, effective tax rate, and monthly take-home breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* 4. GROSS TOTAL INCOME VS NET TAXABLE INCOME */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-5">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          4. Understanding Gross Total Income vs. Net Taxable Income
        </h3>
        <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
          It helps to know the difference between total money earned and taxable money:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase">Input Aggregate</div>
            <h4 className="text-base font-bold text-[#222325]">Gross Total Income</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              All the money you receive from every source during the financial year before any
              deductions, exemptions, or allowances are taken out.
            </p>
          </div>

          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="text-xs font-bold text-[#1dbf73] uppercase">Tax Computation Base</div>
            <h4 className="text-base font-bold text-[#222325]">Net Taxable Income</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              What remains after subtracting standard deductions, exemptions, and eligible tax
              savers from your gross total. Tax brackets apply strictly to this final taxable
              number.
            </p>
          </div>
        </div>
      </section>

      {/* 5. NEW TAX REGIME SLABS & STANDARD DEDUCTIONS (FY 2026-27) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4fdf8] text-[#1dbf73] text-xs font-bold border border-[#d8f5e5]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Default Tax Framework</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
            5. New Tax Regime Slabs & Standard Deductions (FY 2026-27)
          </h3>
          <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
            The New Tax Regime is the default option for taxpayers, offering wider tax brackets
            and lower tax rates in exchange for letting go of most traditional deductions.
          </p>
        </div>

        {/* Slabs Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-[#fafafa] text-[#74767e] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Income Slab (Taxable)</th>
                <th className="py-3 px-4 font-bold">New Tax Rate</th>
                <th className="py-3 px-4 font-bold">Tax in Bracket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-[#222325]">
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold">Up to ₹4,00,000</td>
                <td className="py-2.5 px-4 text-[#1dbf73] font-bold">Nil (0%)</td>
                <td className="py-2.5 px-4 text-slate-500">₹0</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold">₹4,00,001 to ₹8,00,000</td>
                <td className="py-2.5 px-4 font-bold">5%</td>
                <td className="py-2.5 px-4">₹20,000 max</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold">₹8,00,001 to ₹12,00,000</td>
                <td className="py-2.5 px-4 font-bold">10%</td>
                <td className="py-2.5 px-4">₹40,000 max</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold">₹12,00,001 to ₹16,00,000</td>
                <td className="py-2.5 px-4 font-bold">15%</td>
                <td className="py-2.5 px-4">₹60,000 max</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold">₹16,00,001 to ₹20,00,000</td>
                <td className="py-2.5 px-4 font-bold">20%</td>
                <td className="py-2.5 px-4">₹80,000 max</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold">₹20,00,001 to ₹24,00,000</td>
                <td className="py-2.5 px-4 font-bold">25%</td>
                <td className="py-2.5 px-4">₹1,00,000 max</td>
              </tr>
              <tr className="hover:bg-slate-50/50 bg-emerald-50/20">
                <td className="py-2.5 px-4 font-bold">Above ₹24,00,000</td>
                <td className="py-2.5 px-4 font-extrabold text-[#1dbf73]">30%</td>
                <td className="py-2.5 px-4">30% on excess</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#f4fdf8] border border-[#d8f5e5] rounded-2xl flex items-center gap-3">
          <Info className="w-5 h-5 text-[#1dbf73] shrink-0" />
          <p className="text-xs sm:text-sm text-[#222325]">
            <strong>Standard Deduction of ₹75,000:</strong> Salaried employees and pensioners
            get a flat Standard Deduction of ₹75,000 under the New Tax Regime, which lowers your
            taxable salary right away.
          </p>
        </div>
      </section>

      {/* 6. OLD TAX REGIME DEDUCTIONS (80C, 80D, HRA) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-6">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          6. Old Tax Regime: Exploring Deductions Under Section 80C, 80D, and HRA
        </h3>
        <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
          The Old Tax Regime keeps the traditional system alive for people who prefer saving
          through specific government-approved channels:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-[#222325]">Section 80C (Max ₹1.5L)</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Lets you deduct up to ₹1.5 Lakhs for putting money into Public Provident Funds
              (PPF), Equity Linked Savings Schemes (ELSS), life insurance, or home loan principal
              payments.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-[#222325]">Section 80D Health Insurance</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Gives you deductions for paying health insurance premiums for yourself, your
              family (up to ₹25,000), and senior citizen parents (up to ₹50,000).
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-[#222325]">HRA & Home Loan Interest</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Provides relief on rent you pay under Section 10(13A) or up to ₹2,00,000 interest on
              housing loans under Section 24 for self-occupied properties.
            </p>
          </div>
        </div>
      </section>

      {/* 7 & 8. SECTION 87A REBATE & MARGINAL RELIEF */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-[#fafafa] rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-[#222325]">
              7. How Tax Rebates Under Section 87A Eliminate Tax Liability
            </h4>
            <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
              Tax rebates protect lower-income earners. Under Section 87A, if your net taxable
              income stays below the government's set limit (up to <strong>₹12 Lakhs taxable income</strong>{' '}
              under the New Regime), your tax bill is completely wiped out to zero. Online
              calculators apply this automatically when you qualify.
            </p>
          </div>

          <div className="p-6 bg-[#fafafa] rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-[#222325]">
              8. Marginal Relief Mechanics Explained
            </h4>
            <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
              Have you ever worried that getting a small salary raise will push you into a higher
              tax bracket and leave you with less take-home pay? Marginal relief stops this from
              happening. It ensures that any extra tax you pay on income crossing a threshold
              cannot be higher than the actual extra money you earned. Good calculators handle
              this math in the background so a minor raise never hurts your wallet.
            </p>
          </div>
        </div>
      </section>

      {/* 9, 10 & 11. CESS, SURCHARGE, AND EMPLOYER NPS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-6">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          Compliance & Additional Tax Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-[#222325]">9. Health and Education Cess (4%)</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              When you finish calculating your base tax across slabs, there is one final addition:
              a flat 4% Health and Education Cess. This is charged on top of your final computed
              tax amount. Automated calculators include this step so you see the exact final figure
              you need to pay.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-[#222325]">10. Surcharge Slabs & Capping</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              High-income earners have to pay an extra charge called a surcharge. The rules differ
              between the two systems: under the New Tax Regime, the highest surcharge rate is
              capped at 25%, whereas the Old Tax Regime scales up to a peak of 37% for ultra-high
              earners.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-[#222325]">11. Employer NPS [Sec 80CCD(2)]</h4>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Even though most deductions are cut under the New Tax Regime, employer
              contributions to the National Pension System (NPS) under Section 80CCD(2) remain
              fully allowed (up to 14% of basic salary for eligible workers). Splitting your CTC
              to include this is a smart way to lower your taxes under either system.
            </p>
          </div>
        </div>
      </section>

      {/* 12. TAX-FREE SALARY PRESETS (₹12,75,000 BREAKDOWN) */}
      <section className="bg-gradient-to-br from-[#f4fdf8] via-white to-[#eefcf4] rounded-3xl border border-[#1dbf73]/40 p-6 sm:p-9 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Zero-Tax Milestone Breakdown</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#222325]">
          12. Tax-Free Salary Presets / Quick Breakdowns
        </h3>
        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          Thanks to the ₹75,000 standard deduction under the New Regime, if your gross salary is
          up to <strong>₹12,75,000</strong>, your net taxable income drops right down to ₹12,00,000.
          Because of the Section 87A rebate, your final tax bill becomes zero.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white rounded-xl border border-[#d8f5e5] text-center">
            <span className="text-[10px] text-slate-500 block">Gross Salary</span>
            <span className="text-sm font-bold text-[#222325]">₹12,75,000</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#d8f5e5] text-center">
            <span className="text-[10px] text-slate-500 block">Standard Deduction</span>
            <span className="text-sm font-bold text-emerald-600">- ₹75,000</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#d8f5e5] text-center">
            <span className="text-[10px] text-slate-500 block">Net Taxable</span>
            <span className="text-sm font-bold text-[#222325]">₹12,00,000</span>
          </div>
          <div className="p-3 bg-[#1dbf73] text-white rounded-xl text-center">
            <span className="text-[10px] text-white/80 block">Final Tax Payable</span>
            <span className="text-sm font-black">₹0 (Nil)</span>
          </div>
        </div>
      </section>

      {/* 13 & 14. FILING DEADLINES & CAPITAL GAINS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase">
              <Calendar className="w-4 h-4" />
              <span>Compliance Timeline</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#222325]">
              13. Filing Deadlines and Compliance Timeline
            </h4>
            <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
              Once you finish calculating your taxes, keep an eye on the calendar. For regular
              individual taxpayers, the standard deadline to file your Income Tax Return (ITR) is{' '}
              <strong>July 31</strong>. Missing it means you can still file a belated return until
              December 31, but you will face late fees under Section 234F.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase">
              <Coins className="w-4 h-4" />
              <span>Special Tax Rates</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#222325]">
              14. Capital Gains and Special Tax Rates
            </h4>
            <ul className="text-xs sm:text-sm text-[#62646a] space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong>STCG on Equity (111A):</strong> Taxed at separate 20% flat rate.
              </li>
              <li>
                <strong>LTCG on Equity (112A):</strong> Profits above ₹1.25L exemption taxed at
                12.5%.
              </li>
              <li>
                <strong>Digital Assets / Crypto:</strong> Flat 30% tax under Section 115BBH.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 15 & 16. HOW TO CHOOSE & COMMON MISTAKES */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-9 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* How to Choose */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-[#222325]">
              15. How to Choose Between Old and New Tax Regimes
            </h4>
            <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
              Choosing the right option comes down to your personal spending and savings habits:
            </p>
            <div className="space-y-2 pt-1 text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-[#1dbf73]">Pick the New Regime</strong> if you want higher
                monthly take-home pay, do not carry a heavy home loan, and don't lock your money into
                traditional 80C investments.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <strong className="text-blue-600">Pick the Old Regime</strong> if your combined
                deductions (like HRA, home loan interest, 80C, and 80D) are large enough to save
                you more money than the lower tax rates of the New Regime.
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-[#222325]">
              16. Common Mistakes to Avoid When Using a Tax Calculator
            </h4>
            <ul className="text-xs sm:text-sm text-[#62646a] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Leaving Out Small Income:</strong> Forgetting tiny details like bank
                  account interest can cause mismatches when you file your final returns.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Mixing Up FY and AY:</strong> Always remember that Financial Year is
                  when you earn the money, and Assessment Year is when you file taxes for it.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Ignoring Surcharges:</strong> High earners should remember that
                  surcharges apply at very high income levels, which changes manual calculations.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
};
