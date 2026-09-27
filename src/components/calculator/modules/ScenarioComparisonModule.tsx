import React, { useState } from 'react';
import { GitCompare, ArrowRight, Check } from 'lucide-react';

interface ScenarioComparisonModuleProps {
  outputs: Array<{
    def: { id: string; label: string };
    formatted: string;
    raw: number | string | boolean;
  }>;
  settings?: {
    title?: string;
  };
}

export const ScenarioComparisonModule: React.FC<ScenarioComparisonModuleProps> = ({
  outputs = [],
  settings = {},
}) => {
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'baseline' | 'aggressive'>('baseline');
  const title = settings.title || 'Scenario Comparison & Sensitivity';

  const primaryOut = outputs.find((o) => typeof o.raw === 'number') || outputs[0];
  const baseNum = typeof primaryOut?.raw === 'number' ? primaryOut.raw : 10000;

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <GitCompare className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
        </div>

        <div className="bg-[#f0f0f0] p-0.5 rounded-lg flex text-xs font-semibold self-start sm:self-auto">
          {(['conservative', 'baseline', 'aggressive'] as const).map((sc) => (
            <button
              key={sc}
              type="button"
              onClick={() => setActiveScenario(sc)}
              className={`px-3 py-1.5 rounded-md capitalize transition-all cursor-pointer ${
                activeScenario === sc ? 'bg-white text-[#222325] shadow-2xs font-bold' : 'text-[#74767e]'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Conservative */}
        <div className={`p-4 rounded-xl border transition-all ${activeScenario === 'conservative' ? 'border-[#1dbf73] bg-[#f4fdf8] ring-1 ring-[#1dbf73]' : 'border-[#e4e5e7] bg-[#fafafa]'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#222325]">Conservative</span>
            <span className="text-[10px] font-mono text-[#74767e]">-15% variance</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#222325]">
            {(baseNum * 0.85).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#74767e] mt-2">Accounts for lower market performance or higher cost inflation.</p>
        </div>

        {/* Baseline */}
        <div className={`p-4 rounded-xl border transition-all ${activeScenario === 'baseline' ? 'border-[#1dbf73] bg-[#f4fdf8] ring-1 ring-[#1dbf73]' : 'border-[#e4e5e7] bg-[#fafafa]'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#222325]">Baseline (Current)</span>
            <span className="text-[10px] font-mono text-[#1dbf73] font-bold">Standard</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#1dbf73]">
            {primaryOut?.formatted || baseNum.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#74767e] mt-2">Calculated directly from your active parameters.</p>
        </div>

        {/* Aggressive */}
        <div className={`p-4 rounded-xl border transition-all ${activeScenario === 'aggressive' ? 'border-[#1dbf73] bg-[#f4fdf8] ring-1 ring-[#1dbf73]' : 'border-[#e4e5e7] bg-[#fafafa]'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#222325]">Optimistic</span>
            <span className="text-[10px] font-mono text-[#74767e]">+20% variance</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#222325]">
            {(baseNum * 1.20).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#74767e] mt-2">Higher yield projection with optimized compounding.</p>
        </div>
      </div>
    </div>
  );
};
