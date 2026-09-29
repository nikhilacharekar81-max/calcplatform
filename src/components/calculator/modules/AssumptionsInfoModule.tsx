import React from 'react';
import { Info, AlertCircle, ShieldCheck, Edit3 } from 'lucide-react';
import { ContentSection } from '../../../types/schema.ts';

interface AssumptionsInfoModuleProps {
  calculatorId?: string;
  calculatorSlug?: string;
  contentSections?: ContentSection[];
  settings?: {
    title?: string;
  };
}

export const AssumptionsInfoModule: React.FC<AssumptionsInfoModuleProps> = ({
  calculatorId,
  calculatorSlug,
  contentSections = [],
  settings = {},
}) => {
  const title = settings.title !== undefined ? settings.title : 'Key Assumptions & Statutory Disclosures';
  const hasDisplayTitle = title && title.trim().length > 0;

  const assumptionSection = contentSections.find(
    (s) => s.isEnabled && (s.sectionType === 'assumptions' || s.title.toLowerCase().includes('assumption'))
  );

  if (!assumptionSection || !assumptionSection.htmlContent || assumptionSection.htmlContent.trim().length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      {hasDisplayTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0f0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
          </div>

          {calculatorId && (
            <a
              href={`/admin/content-seo?calculatorId=${calculatorId}&tab=assumptions`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
              title="Edit assumptions, regulatory basis, and statutory disclosures"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Assumptions</span>
            </a>
          )}
        </div>
      )}

      <div
        className="text-xs sm:text-sm text-[#404145] leading-relaxed prose max-w-none"
        dangerouslySetInnerHTML={{ __html: assumptionSection.htmlContent }}
      />
    </div>
  );
};
