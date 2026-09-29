import React, { useState } from 'react';
import { Award, Copy, Check, Share2, TrendingUp, Sparkles, Code } from 'lucide-react';
import { CalculatorOutput, Calculator } from '../../../types/schema.ts';
import { EmbedModal } from '../EmbedModal.tsx';

interface ResultCardsModuleProps {
  calculator?: Calculator;
  outputs: Array<{
    def: CalculatorOutput;
    formatted: string;
    raw: number | string | boolean;
  }>;
  calculatorName?: string;
  settings?: {
    title?: string;
    highlightCardStyle?: 'emerald' | 'dark' | 'minimal';
    showShareActions?: boolean;
  };
}

export const ResultCardsModule: React.FC<ResultCardsModuleProps> = ({
  calculator,
  outputs = [],
  calculatorName = 'Calculator',
  settings = {},
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  const title = settings.title || 'Calculated Results';
  const cardStyle = settings.highlightCardStyle || 'emerald';
  const showShare = settings.showShareActions !== false;

  const highlightOutput = outputs.find((o) => o.def.highlight) || outputs[0];
  const secondaryOutputs = outputs.filter((o) => o !== highlightOutput);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const getHeroCardClasses = () => {
    if (cardStyle === 'dark') {
      return 'bg-[#1e1e1e] text-white border-black/20 shadow-md';
    }
    if (cardStyle === 'minimal') {
      return 'bg-white text-[#222325] border-2 border-[#1dbf73] shadow-xs';
    }
    return 'bg-gradient-to-br from-[#0c4a2c] via-[#105e38] to-[#1dbf73] text-white shadow-md border-emerald-800';
  };

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <Award className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEmbedModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] border border-[#d8f5e5] rounded-md text-xs font-bold text-[#1dbf73] transition-all cursor-pointer"
            title="Embed this calculator as an iframe or download HTML page"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Embed Widget</span>
          </button>

          {showShare && (
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e4e5e7] rounded-md text-xs font-bold text-[#404145] transition-all cursor-pointer"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1dbf73]" />
                  <span className="text-[#1dbf73]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#74767e]" />
                  <span>Share Calculation</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {calculator && (
        <EmbedModal
          calculator={calculator}
          isOpen={isEmbedModalOpen}
          onClose={() => setIsEmbedModalOpen(false)}
        />
      )}

      {/* Primary KPI Hero Card */}
      {highlightOutput && (
        <div className={`p-6 sm:p-7 rounded-xl border relative overflow-hidden ${getHeroCardClasses()}`}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className={`text-xs uppercase tracking-wider font-extrabold ${cardStyle === 'minimal' ? 'text-[#1dbf73]' : 'text-emerald-100 opacity-90'}`}>
                {highlightOutput.def.label}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                {highlightOutput.formatted}
              </div>
              {highlightOutput.def.description && (
                <p className={`text-xs ${cardStyle === 'minimal' ? 'text-[#74767e]' : 'text-emerald-50/90'} max-w-md pt-1`}>
                  {highlightOutput.def.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(highlightOutput.formatted, highlightOutput.def.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cardStyle === 'minimal'
                    ? 'bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5] hover:bg-[#eaf9f0]'
                    : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-xs border border-white/20'
                }`}
              >
                {copiedId === highlightOutput.def.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1dbf73]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Value</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Metric Result Cards */}
      {secondaryOutputs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {secondaryOutputs.map((out) => (
            <div
              key={out.def.id}
              className="p-4 sm:p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] hover:border-[#1dbf73] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#74767e] uppercase tracking-wider block mb-1">
                    {out.def.label}
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-[#222325] font-mono group-hover:text-[#1dbf73] transition-colors">
                    {out.formatted}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(out.formatted, out.def.id)}
                  title="Copy result"
                  className="p-1.5 rounded-md hover:bg-white text-[#95979d] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
                >
                  {copiedId === out.def.id ? (
                    <Check className="w-3.5 h-3.5 text-[#1dbf73]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {out.def.description && (
                <p className="text-[11px] text-[#74767e] mt-2 border-t border-[#f0f0f0] pt-2">
                  {out.def.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
