import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, HelpCircle, Layers, TrendingUp } from 'lucide-react';

export const LifeInsuranceNeedsGuideContent: React.FC = () => {
  return (
    <div className="space-y-8 text-[#404145] font-sans">
      {/* 1. Overview */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1dbf73] flex items-center justify-center border border-emerald-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#222325]">
              Capital Needs Analysis for Life Insurance
            </h2>
            <p className="text-xs sm:text-sm text-[#74767e]">
              A comprehensive financial methodology to protect your family's lifestyle, future aspirations, and debt clearance.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
          <p>
            The <strong>Capital Needs Analysis (CNA)</strong> approach is the gold standard used by certified financial planners (CFP) to compute the exact insurance sum assured an individual requires. Rather than relying on arbitrary rules of thumb, CNA models real-world cash flow obligations.
          </p>

          <h3 className="text-base font-bold text-[#222325] pt-2">The Real Rate of Return Discounting Method</h3>
          <p>
            When an insurance claim is paid out, the lump sum is not spent immediately in year one. Instead, it is invested by the surviving family in fixed-income or balanced instruments to generate income over 20–30 years. Therefore, future family living expenses are discounted using the <strong>Real Rate of Return</strong>:
          </p>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl font-mono text-xs text-emerald-900 space-y-1">
            <p><strong>Real Rate of Return (r)</strong> = (1 + Nominal Investment Return) / (1 + Inflation Rate) - 1</p>
            <p><strong>PV of Living Expenses</strong> = Annual Expenses × [1 - (1 + r)^(-Years)] / r</p>
            <p><strong>Total Financial Need</strong> = PV of Living Expenses + Outstanding Loans + Future Life Goals</p>
            <p><strong>Net Insurance Required</strong> = Max(0, Total Financial Need - [Existing Cover + Savings + Liquid Investments])</p>
          </div>
        </div>
      </div>

      {/* 2. FAQs */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#222325]">
              Frequently Asked Questions: Life Insurance Needs
            </h3>
            <p className="text-xs sm:text-sm text-[#74767e]">
              Clarifying assets, inflation adjustment, and coverage review frequencies.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Why should I deduct existing investments from my insurance need?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Liquid assets such as mutual funds, fixed deposits, and stocks already provide financial support to your family. Deducting these assets prevents over-insuring and unnecessary high premium costs, leaving you with the exact net protection gap that must be bridged.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>How often should I recalculate my life insurance needs?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              You should recalculate your life insurance need every 3 to 5 years, or whenever a major life milestone occurs: marriage, birth of a child, purchasing a home with a large mortgage, or a significant salary increase.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
