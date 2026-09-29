import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Edit3 } from 'lucide-react';
import { CalculatorFAQ } from '../../../types/schema.ts';

interface FaqAccordionModuleProps {
  calculatorId?: string;
  calculatorSlug?: string;
  faqs?: Array<CalculatorFAQ | { question: string; answer: string; isEnabled?: boolean }>;
  settings?: {
    title?: string;
    allowMultipleOpen?: boolean;
  };
}

export const FaqAccordionModule: React.FC<FaqAccordionModuleProps> = ({
  calculatorId,
  calculatorSlug,
  faqs = [],
  settings = {},
}) => {
  const validFaqs = faqs.filter((f) => f.isEnabled !== false);
  const [openIndices, setOpenIndices] = useState<number[]>(() => validFaqs.map((_, i) => i));
  const title = settings.title || 'Frequently Asked Questions';
  const allowMultiple = settings.allowMultipleOpen !== undefined ? settings.allowMultipleOpen : true;

  const toggleFaq = (idx: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(idx) ? [] : [idx]));
    }
  };

  if (validFaqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
        </div>

        {calculatorId && (
          <a
            href={`/admin/content-seo?calculatorId=${calculatorId}&tab=faqs`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
            title="Add, edit, or customize FAQ questions and rich-text answers"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit FAQs</span>
          </a>
        )}
      </div>

      <div className="space-y-3">
        {validFaqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className="border border-[#e4e5e7] rounded-xl overflow-hidden transition-all bg-white"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-4.5 flex items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors cursor-pointer select-none"
              >
                <span className="text-xs sm:text-sm font-bold text-[#222325]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#74767e] transition-transform shrink-0 ${
                    isOpen ? 'rotate-180 text-[#1dbf73]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 pt-1 text-xs sm:text-sm text-[#62646a] leading-relaxed border-t border-[#f5f5f5] bg-[#fafafa]"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
