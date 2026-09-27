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
  const title = settings.title || 'Key Assumptions & Statutory Disclosures';

  const assumptionSection = contentSections.find(
    (s) => s.isEnabled && (s.sectionType === 'assumptions' || s.title.toLowerCase().includes('assumption'))
  );

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
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

      {assumptionSection ? (
        <div
          className="text-xs sm:text-sm text-[#404145] leading-relaxed prose max-w-none"
          dangerouslySetInnerHTML={{ __html: assumptionSection.htmlContent }}
        />
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1.5 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Standard Regulatory & Computational Basis</span>
            </div>
            <p>
              Calculations assume uniform compounding periods, standard 30-day month conventions, and standard statutory thresholds. Actual financial institution terms or tax liabilities may differ slightly based on specific underwriting guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#404145]">
            <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e5e7] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1dbf73] shrink-0 mt-0.5" />
              <span>Constant interest rate is assumed over the entire selected amortization tenure.</span>
            </div>
            <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e5e7] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1dbf73] shrink-0 mt-0.5" />
              <span>All tax calculations reflect the latest enacted budget provisions and standard rebates.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
