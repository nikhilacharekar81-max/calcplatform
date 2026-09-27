import React, { useState } from 'react';
import { Code2, ChevronDown, Edit3 } from 'lucide-react';
import { CalculatorOutput, CalculatorField } from '../../../types/schema.ts';

interface FormulaMethodologyModuleProps {
  calculatorId?: string;
  calculatorSlug?: string;
  outputs: CalculatorOutput[];
  fields: CalculatorField[];
  content?: {
    formulaExplanation?: string;
  };
  settings?: {
    title?: string;
    showStepByStep?: boolean;
    customExplanation?: string;
  };
}

export const FormulaMethodologyModule: React.FC<FormulaMethodologyModuleProps> = ({
  calculatorId,
  outputs = [],
  fields = [],
  content,
  settings = {},
}) => {
  const [expanded, setExpanded] = useState(true);
  const title = settings.title || 'Formula & Mathematical Logic';
  const showSteps = settings.showStepByStep !== false;
  const explanation = settings.customExplanation || content?.formulaExplanation;

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <Code2 className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {calculatorId && (
            <a
              href={`/admin/calculators/${calculatorId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fafafa] hover:bg-[#e4e5e7] text-[#404145] hover:text-[#222325] text-xs font-bold rounded-lg border border-[#e4e5e7] transition-colors cursor-pointer"
              title="Edit mathematical formulas and variable definitions in Admin Builder"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1dbf73]" />
              <span>Edit Formulas & Logic</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-[#74767e] hover:text-[#222325] cursor-pointer"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-6 pt-1">
          {/* Optional Narrative Methodology Explanation */}
          {explanation && (
            <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] text-xs sm:text-sm text-[#334155] leading-relaxed prose max-w-none font-sans">
              <div dangerouslySetInnerHTML={{ __html: explanation }} />
            </div>
          )}

          {/* Mathematical Equations & Output Formulas (Always Visible) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider">
                Mathematical Formulations & Logic
              </h3>
              <span className="text-[11px] font-mono text-[#74767e]">
                {outputs.length} formula {outputs.length === 1 ? 'output' : 'outputs'}
              </span>
            </div>

            {outputs.length > 0 ? (
              <div className="space-y-3">
                {outputs.map((out) => (
                  <div
                    key={out.id}
                    className="p-4 bg-[#fafafa] rounded-lg border border-[#e4e5e7] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#222325]">{out.label}</span>
                      <span className="text-[10px] font-mono text-[#74767e]">
                        Output ID: <strong className="text-[#222325]">{out.id}</strong>
                      </span>
                    </div>
                    <pre className="p-2.5 bg-white rounded border border-[#e4e5e7] font-mono text-xs text-[#1dbf73] overflow-x-auto font-bold shadow-2xs">
                      <code>{out.formula || `${out.id} = f(inputs)`}</code>
                    </pre>
                    {out.description && (
                      <p className="text-[11px] text-[#74767e]">{out.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#fafafa] rounded-lg border border-[#e4e5e7] text-xs text-[#74767e]">
                No explicit formulas configured for this calculator yet.
              </div>
            )}
          </div>

          {/* Variable Inputs Breakdown */}
          {showSteps && fields.length > 0 && (
            <div className="pt-4 border-t border-[#f0f0f0] space-y-3">
              <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider">
                Variable Definitions & Inputs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-[#fdfdfd] rounded-md border border-[#e4e5e7] text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#222325]">{f.label}</span>
                      <code className="font-mono text-[11px] text-[#74767e]">({f.id})</code>
                    </div>
                    <p className="text-[#74767e] text-[11px]">
                      {f.helpText || `Input parameter: ${f.type}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
