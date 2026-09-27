import React from 'react';
import { BookOpen, CheckCircle2, ArrowRight, Edit3 } from 'lucide-react';
import { ContentSection } from '../../../types/schema.ts';

interface HowToGuideModuleProps {
  calculatorId?: string;
  calculatorSlug?: string;
  calculatorName?: string;
  usageInstructions?: string;
  contentSections?: ContentSection[];
  settings?: {
    title?: string;
  };
}

export const HowToGuideModule: React.FC<HowToGuideModuleProps> = ({
  calculatorId,
  calculatorSlug,
  calculatorName = 'Calculator',
  usageInstructions,
  contentSections = [],
  settings = {},
}) => {
  const title = settings.title || `How to Use This ${calculatorName.includes('Calculator') ? calculatorName : `${calculatorName} Calculator`}`;

  // Check if there is a specific 'how-to' section in contentSections
  const howToSection = contentSections.find(
    (s) => s.isEnabled && (s.sectionType === 'how-to' || s.title.toLowerCase().includes('how to'))
  );

  const guideHtml = howToSection?.htmlContent || usageInstructions;

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
        </div>

        {calculatorId && (
          <a
            href={`/admin/content-seo?calculatorId=${calculatorId}&tab=how-to`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
            title="Edit How to Use instructions, steps, and title"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit How-to Guide</span>
          </a>
        )}
      </div>

      {guideHtml ? (
        <div
          className="text-xs sm:text-sm text-[#404145] leading-relaxed prose max-w-none space-y-3"
          dangerouslySetInnerHTML={{ __html: guideHtml }}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed">
            Follow these standard steps to obtain precise, instantaneous calculation results:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-2">
              <div className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="text-xs font-bold text-[#222325]">Enter Parameters</h3>
              <p className="text-[11px] text-[#74767e] leading-normal">
                Input your numerical figures into the customizable fields or drag the sliders.
              </p>
            </div>

            <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-2">
              <div className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="text-xs font-bold text-[#222325]">Instant Recalculation</h3>
              <p className="text-[11px] text-[#74767e] leading-normal">
                The math engine immediately renders updated KPI cards, visual charts, and schedules.
              </p>
            </div>

            <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-2">
              <div className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="text-xs font-bold text-[#222325]">Share or Export</h3>
              <p className="text-[11px] text-[#74767e] leading-normal">
                Copy key figures, export schedules as CSV, or bookmark your pre-filled calculation URL.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
