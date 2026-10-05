import React from 'react';
import { ShieldCheck, CheckCircle2, HelpCircle, Info, Sparkles, Sliders } from 'lucide-react';

export const TermInsuranceGuideContent: React.FC = () => {
  return (
    <div className="space-y-8 text-[#404145] font-sans">
      {/* Main Guide Content Card */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Header */}
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#222325]">
            How much term insurance do you need?
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            A term insurance policy is meant to give your family financial support if you are no longer around to provide for them. The right amount depends on your income, expenses, loans, existing insurance, savings and future goals.
          </p>
          <p className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            Use this calculator to get an estimate of the cover your family may need.
          </p>
        </div>

        {/* Section 1: What you need to enter */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            What you need to enter
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Current Age:</strong> Your present age.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Retirement Age:</strong> The age up to which you want to estimate income or financial support.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Annual Income:</strong> Your current yearly income.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Monthly Living Expenses:</strong> What you normally spend on household and living costs each month.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Outstanding Loans:</strong> Home loans, personal loans and liabilities that would need to be covered.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Existing Life Cover:</strong> Life insurance you already have.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Savings & Investments:</strong> Liquid savings and investments that could be used by your family.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Future Financial Goals:</strong> Money needed for goals such as children's education, marriage or major expenses.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Years Until Goal:</strong> How many years remain before the goal.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Inflation Rate:</strong> Expected yearly increase in expenses and future costs.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Expected Investment Return:</strong> Return assumed when calculating present value of future expenses/goals.
            </li>
            <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong>Dependants:</strong> Number of people financially dependent on you.
            </li>
          </ul>
        </div>

        {/* Section 2: Your Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Your Results
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-semibold">
            The calculator shows more than just one number:
          </p>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <strong className="text-emerald-900 block font-bold mb-1">Human Life Value (HLV)</strong>
              HLV estimates the present economic value of your future earnings over your working years. It is useful for understanding economic earning potential, but is not automatically the same as required life insurance cover.
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block font-bold mb-1">Living Expense Corpus</strong>
              Estimates the amount needed today to replace future living expenses considered in the calculation over your working horizon.
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block font-bold mb-1">Future Goals Corpus</strong>
              Future goals adjusted for expected inflation rate and brought back to today's value using expected investment return.
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block font-bold mb-1">Loan Protection</strong>
              Outstanding loans and liabilities added to the amount your family would need to pay off.
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block font-bold mb-1">Gross Insurance Need</strong>
              Combines major financial requirements: Living Expense Corpus + Loan Protection + Future Goals Corpus.
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block font-bold mb-1">Existing Resources</strong>
              Considers existing life insurance cover + savings/investments that reduce additional protection required.
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block font-bold mb-1">Additional Cover Required</strong>
              Gross Insurance Need − Existing Life Cover − Available Savings = Net Protection Gap.
            </div>
            <div className="p-3.5 bg-slate-900 text-white rounded-xl">
              <strong className="text-emerald-400 block font-bold mb-1">Recommended Cover</strong>
              Rounds the estimated protection gap according to rounding rules into a practical recommended term cover amount.
            </div>
          </div>
        </div>

        {/* Section 3: Why Your Number Can Change */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Why Your Number Can Change
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your insurance requirement is not fixed.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; Higher monthly expenses can increase required cover.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; A larger loan can increase required cover.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; More existing insurance reduces additional cover required.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; More available savings reduces protection gap.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; Higher inflation increases future financial needs.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; A longer support period increases amount required.</li>
          </ul>
        </div>

        {/* Section 4: HLV vs Insurance Requirement */}
        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-[#222325]">
            HLV vs Insurance Requirement
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            These two numbers answer different questions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-emerald-700 block mb-1">HLV asks:</strong>
              How much is your future earning capacity worth today?
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-blue-700 block mb-1">Needs Analysis asks:</strong>
              How much money may your family need after considering expenses, loans, goals, existing insurance and assets?
            </div>
          </div>
          <p className="text-xs text-slate-600 italic pt-1">
            Because of this, your HLV and recommended term insurance cover may be different.
          </p>
        </div>

        {/* Section 5: Example */}
        <div className="space-y-3 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
          <h3 className="text-lg font-bold text-[#222325]">
            Example
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Suppose a 30-year-old earns ₹20 lakh a year and spends ₹70,000 a month. They also have:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono font-bold text-emerald-950">
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Loans: ₹35 Lakh</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Cover: ₹50 Lakh</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Savings: ₹25 Lakh</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Goals: ₹30 Lakh</div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed pt-1">
            The calculator considers these figures together rather than simply applying a fixed income multiple:
          </p>
          <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-emerald-900 space-y-1">
            <p>Gross financial need</p>
            <p>→ minus existing resources</p>
            <p>→ additional insurance cover required</p>
          </div>
        </div>

        {/* Section 6: What-If Analysis */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1dbf73]" />
            What-If Analysis
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Not sure which assumptions to use? Change the Inflation rate, Expected investment return, Monthly expenses, Retirement age, or Existing life cover.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-semibold text-emerald-800">
            The calculator will recalculate the result so you can see how sensitive your insurance requirement is to these assumptions.
          </p>
        </div>

        {/* Section 7: How the Calculation Works & Assumptions */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325]">
            How the Calculation Works & Important Assumptions
          </h3>
          <div className="p-3.5 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl">
            Living expenses + liabilities + future goals − existing cover − available assets
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Future expenses increase with selected inflation rate.</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Future goals increase with inflation.</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Selected return is earned on corpus.</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Existing savings remain available.</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Existing cover remains available.</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Living expenses estimate ongoing support requirement.</li>
          </ul>
        </div>

        {/* Section 8: Is This the Same as an Insurance Quote? & Tax Note */}
        <div className="space-y-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
          <h3 className="text-lg font-bold text-[#222325]">
            Is This the Same as an Insurance Quote? & Indian Tax Note
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>No.</strong> This calculator estimates how much financial protection you may need. It is not an insurer's underwriting or premium-pricing engine. Premium depends on age, health, tobacco use, occupation, policy term, and sum assured.
          </p>
          <p className="text-xs text-blue-900 font-medium">
            <strong>Tax Note:</strong> For policies that qualify, Section 10(10D) of the Income Tax Act may provide an exemption for certain life insurance proceeds subject to applicable conditions.
          </p>
        </div>

      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#222325]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#74767e]">
              Common queries on term insurance sizing and needs analysis.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>What is a term insurance calculator?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              It is a tool that estimates how much life insurance cover you may need based on your income, expenses, liabilities, goals and existing financial resources.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>How much term insurance do I need?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              There is no single amount that works for everyone. Your expenses, loans, future goals, existing insurance and savings all matter.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>What is HLV?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Human Life Value is an estimate of the present economic value of a person's future earning capacity.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Is HLV the same as the required insurance cover?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Not necessarily. HLV measures future economic contribution, while a needs-based calculation looks at the financial requirements of the family.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I include my home loan?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes, if the loan would create a financial burden for your family and you want the calculation to account for it.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should existing life insurance be deducted?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes. Existing cover can reduce the amount of additional protection required.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should savings be deducted?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Savings and investments that are genuinely available to meet the family's financial needs can be considered as resources.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does inflation affect term insurance requirements?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes. Higher inflation can increase future expenses and financial goals, which can increase the estimated requirement.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I recalculate my insurance need?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              It is useful to review the calculation when your income, expenses, loans, family responsibilities, savings or major financial goals change.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Is this calculator financial advice?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. It is an illustrative calculation based on the information and assumptions you provide. It should not be treated as a personalised insurance recommendation.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
