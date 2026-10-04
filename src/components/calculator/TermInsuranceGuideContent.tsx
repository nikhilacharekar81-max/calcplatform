import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, HelpCircle, AlertTriangle, Layers, Percent } from 'lucide-react';

export const TermInsuranceGuideContent: React.FC = () => {
  return (
    <div className="space-y-8 text-[#404145] font-sans">
      {/* 1. What is Term Insurance */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1dbf73] flex items-center justify-center border border-emerald-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#222325]">
              Understanding Term Life Insurance & Income Replacement
            </h2>
            <p className="text-xs sm:text-sm text-[#74767e]">
              A pure risk protection vehicle securing your family's standard of living and debt obligations.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
          <p>
            A <strong>Term Insurance Policy</strong> is the most cost-effective and fundamental building block of personal financial risk management. Unlike traditional endowment or ULIP policies that bundle investment with insurance, term insurance offers pure life cover with no maturity savings component, yielding maximum sum assured per rupee spent on premium.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">01. Income Replacement</span>
              <p className="text-xs text-slate-600">
                Replaces monthly salary and living expenses for dependents until your planned retirement age.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">02. Liability Liquidation</span>
              <p className="text-xs text-slate-600">
                Liquidates outstanding home loans, car loans, and personal debts so assets are never encumbered.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">03. Future Goal Ringfencing</span>
              <p className="text-xs text-slate-600">
                Guarantees funding for children's higher education and marriage without liquidation distress.
              </p>
            </div>
          </div>

          <h3 className="text-base font-bold text-[#222325] pt-2">The Human Life Capital Protection Methodology</h3>
          <p>
            Our calculation engine uses the <strong>Actuarial Needs Analysis Model</strong>. The gross life insurance requirement is computed by summing the Present Value (PV) of inflation-adjusted future living expenses, all outstanding loans, and targeted future life goals. Existing assets and in-force life policies are then subtracted to determine your <strong>Net Protection Gap</strong>.
          </p>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl font-mono text-xs text-emerald-900 space-y-1">
            <p><strong>Gross Life Need</strong> = PV(Monthly Expenses × 12, Real Discount Rate, Years to Retirement) + Total Debts + Future Goals</p>
            <p><strong>Net Protection Gap</strong> = Max(0, Gross Life Need - [Existing Cover + Liquid Investments])</p>
          </div>
        </div>
      </div>

      {/* 2. FAQ Section */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#222325]">
              Frequently Asked Questions: Term Insurance
            </h3>
            <p className="text-xs sm:text-sm text-[#74767e]">
              Statutory guidelines, thumb rules, and claim taxability rules.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>What is the standard rule of thumb for life insurance cover?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              While a simple rule of thumb suggests 10x to 15x of annual income, comprehensive financial planning requires factoring in existing debts, years remaining until retirement, inflation-adjusted children's education milestones, and liquid savings. Our calculator provides this exact actuarial breakdown.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Are term insurance death benefits taxable?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Under Section 10(10D) of the Income Tax Act, any sum received under a life insurance policy (including death benefit sum assured) is 100% tax-free in the hands of the nominee.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I include my home loan in the term cover?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes, absolutely. Outstanding loans (home loans, vehicle loans, education loans) represent liabilities that your family would inherit or be pressured to pay off. Including outstanding debts in your term cover ensures your family retains the home debt-free.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
