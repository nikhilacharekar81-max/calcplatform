import React from 'react';
import { FileCheck, Sparkles, CheckCircle2, Edit3, ArrowRight, Layers } from 'lucide-react';
import { CalculatorExample } from '../../../types/schema.ts';

interface WorkedExamplesModuleProps {
  calculatorId?: string;
  calculatorSlug?: string;
  calculatorName?: string;
  examples?: CalculatorExample[];
  settings?: {
    title?: string;
  };
}

export const WorkedExamplesModule: React.FC<WorkedExamplesModuleProps> = ({
  calculatorId,
  calculatorSlug,
  calculatorName = 'Calculation',
  examples = [],
  settings = {},
}) => {
  const title = settings.title !== undefined ? settings.title : 'Worked Examples & Real Scenarios';
  const hasDisplayTitle = title && title.trim().length > 0;
  const activeExamples = examples.filter((e) => e.isEnabled !== false);

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      {hasDisplayTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0f0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
          </div>

          {calculatorId && (
            <a
              href={`/admin/content-seo?calculatorId=${calculatorId}&tab=examples`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
              title="Add, edit, or customize real worked examples with custom inputs and results"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Worked Examples</span>
            </a>
          )}
        </div>
      )}

      {activeExamples.length === 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-[#222325]">
                  Scenario A: Standard Baseline Evaluation
                </h3>
                <span className="text-[10px] uppercase font-bold bg-[#f4fdf8] text-[#1dbf73] px-2 py-0.5 rounded border border-[#d8f5e5]">
                  Benchmark
                </span>
              </div>
              <p className="text-xs text-[#62646a] leading-relaxed">
                Evaluate standard reference parameters to determine primary outputs, proportional ratios, and incremental changes.
              </p>
              <div className="p-2.5 bg-white rounded-md border border-[#e4e5e7] text-xs font-mono text-[#1dbf73] font-bold flex items-center justify-between">
                <span>Evaluated Baseline</span>
                <span className="text-xs font-semibold text-[#404145]">Standard Metric</span>
              </div>
            </div>

            <div className="p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-[#222325]">
                  Scenario B: High-Range Parameter Check
                </h3>
                <span className="text-[10px] uppercase font-bold bg-[#fafafa] text-[#74767e] px-2 py-0.5 rounded border border-[#e4e5e7]">
                  Comparative
                </span>
              </div>
              <p className="text-xs text-[#62646a] leading-relaxed">
                Test sensitive upper boundaries to examine compounding sensitivity, total cost scaling, and variance thresholds.
              </p>
              <div className="p-2.5 bg-white rounded-md border border-[#e4e5e7] text-xs font-mono text-[#222325] font-bold flex items-center justify-between">
                <span>Scaled Stress-Test</span>
                <span className="text-xs font-semibold text-[#1dbf73]">Dynamic Output</span>
              </div>
            </div>
          </div>

          {calculatorId && (
            <div className="p-4 bg-[#f4fdf8] rounded-xl border border-[#d8f5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#404145]">
                <Sparkles className="w-4 h-4 text-[#1dbf73] shrink-0" />
                <span>
                  <strong>Tip for Admins:</strong> You can add real worked case studies with exact numerical values and result highlights.
                </span>
              </div>
              <a
                href={`/admin/content-seo?calculatorId=${calculatorId}&tab=examples`}
                className="font-bold text-[#1dbf73] hover:underline shrink-0"
              >
                Customize Worked Examples &rarr;
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeExamples.map((ex, idx) => (
            <div
              key={ex.id || idx}
              className="p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] hover:border-[#1dbf73] transition-all space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-[#222325] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1dbf73] text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{ex.title}</span>
                </h3>
                <span className="text-[10px] font-bold bg-white text-[#74767e] px-2 py-0.5 rounded border border-[#e4e5e7]">
                  Example #{idx + 1}
                </span>
              </div>

              <p className="text-xs text-[#62646a] leading-relaxed whitespace-pre-line">{ex.description}</p>

              {/* Input values tag summary if provided */}
              {ex.inputValues && Object.keys(ex.inputValues).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.entries(ex.inputValues).map(([k, v]) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 bg-white text-[#404145] rounded border border-[#e4e5e7] text-[10px] font-mono"
                    >
                      <strong className="text-[#222325]">{k}:</strong> {String(v)}
                    </span>
                  ))}
                </div>
              )}

              {ex.resultSummary && (
                <div className="p-3 bg-white rounded-lg border border-[#d8f5e5] text-xs font-mono text-[#1dbf73] font-bold flex items-center justify-between">
                  <span className="text-[11px] text-[#74767e] font-sans font-semibold">Outcome:</span>
                  <span>{ex.resultSummary}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
