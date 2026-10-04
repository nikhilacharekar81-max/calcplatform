import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, HelpCircle, Layers, Activity } from 'lucide-react';

export const HumanLifeValueGuideContent: React.FC = () => {
  return (
    <div className="space-y-8 text-[#404145] font-sans">
      {/* 1. Overview */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1dbf73] flex items-center justify-center border border-emerald-100 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#222325]">
              Human Life Value (HLV) Capitalization Principle
            </h2>
            <p className="text-xs sm:text-sm text-[#74767e]">
              Economic valuation of an individual's earning capacity and family financial contribution.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
          <p>
            Introduced by economist <strong>Dr. Solomon S. Huebner</strong> (the father of modern financial planning), <strong>Human Life Value (HLV)</strong> is defined as the present monetary value of all future earnings that an individual will devote to their dependents throughout their working lifetime.
          </p>

          <h3 className="text-base font-bold text-[#222325] pt-2">The 4-Step HLV Computation Formula</h3>
          <p>
            The model computes the economic damages a household would suffer in the event of untimely demise by executing a discounted cash flow (DCF) across four structured steps:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-blue-600 uppercase">Step 1: Net Family Contribution</span>
              <p className="text-xs text-slate-600">
                Annual Income minus personal living expenses and personal taxes = pure financial surplus provided to family.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-emerald-600 uppercase">Step 2: Career Span Projection</span>
              <p className="text-xs text-slate-600">
                Working years calculated as (Target Retirement Age - Current Age).
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-purple-600 uppercase">Step 3: Income Growth Modeling</span>
              <p className="text-xs text-slate-600">
                Future annual earnings compounding at the expected career promotion and increment rate.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-amber-600 uppercase">Step 4: Present Value Capitalization</span>
              <p className="text-xs text-slate-600">
                Discounting future annual contributions back to today's rupees using the safe investment return rate.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl font-mono text-xs text-emerald-900 space-y-1">
            <p><strong>Contribution(t)</strong> = (Gross Income - Personal Expenses) × (1 + Growth Rate)^(t - 1)</p>
            <p><strong>PV(t)</strong> = Contribution(t) / (1 + Discount Rate)^t</p>
            <p><strong>Human Life Value (HLV)</strong> = ∑ PV(t) for t = 1 to (Retirement Age - Current Age)</p>
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
              Frequently Asked Questions: Human Life Value (HLV)
            </h3>
            <p className="text-xs sm:text-sm text-[#74767e]">
              How HLV compares with Needs Analysis and when to use each.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>What is the difference between HLV and Needs Analysis?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              <strong>HLV</strong> focuses on your economic earning capacity (what you would have contributed to the family until retirement). <strong>Needs Analysis</strong> focuses on specific expenses and liabilities (what your family specifically needs to spend). Ideally, both methods converge closely for mid-career professionals.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Why does HLV decrease as I get older?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Because the number of remaining working years decreases. A 30-year-old has 30 years of future salary to replace, while a 55-year-old has only 5 years remaining, naturally resulting in a lower future earnings capitalization.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
