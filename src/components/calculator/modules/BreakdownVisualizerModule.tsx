import React from 'react';
import { BarChart3, Layers } from 'lucide-react';

interface BreakdownVisualizerModuleProps {
  outputs: Array<{
    def: { id: string; label: string };
    formatted: string;
    raw: number | string | boolean;
  }>;
  settings?: {
    title?: string;
    showPercentages?: boolean;
  };
}

export const BreakdownVisualizerModule: React.FC<BreakdownVisualizerModuleProps> = ({
  outputs = [],
  settings = {},
}) => {
  const title = settings.title || 'Distribution Breakdown';
  const showPercentages = settings.showPercentages !== false;

  const validOutputs = outputs.filter((o) => typeof o.raw === 'number' && o.raw > 0);
  const total = validOutputs.reduce((acc, curr) => acc + (curr.raw as number), 0);

  const colors = ['bg-[#1dbf73]', 'bg-[#ff7640]', 'bg-[#4a73e8]', 'bg-[#f59e0b]', 'bg-[#8b5cf6]'];

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex items-center gap-2.5 border-b border-[#f0f0f0] pb-4">
        <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
          <BarChart3 className="w-4 h-4" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
      </div>

      {validOutputs.length === 0 || total === 0 ? (
        <p className="text-xs text-[#74767e]">No breakdown figures available.</p>
      ) : (
        <div className="space-y-6">
          {/* Multi-segmented visual bar */}
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-[#f0f0f0]">
            {validOutputs.map((item, idx) => {
              const pct = ( (item.raw as number) / total) * 100;
              return (
                <div
                  key={idx}
                  style={{ width: `${pct}%` }}
                  className={`${colors[idx % colors.length]} transition-all duration-500`}
                  title={`${item.def.label}: ${item.formatted} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Itemized Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {validOutputs.map((item, idx) => {
              const pct = ( (item.raw as number) / total) * 100;
              return (
                <div
                  key={idx}
                  className="p-3.5 bg-[#fafafa] rounded-lg border border-[#e4e5e7] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${colors[idx % colors.length]} shrink-0`} />
                    <span className="text-xs font-semibold text-[#404145] truncate">{item.def.label}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[#222325] block">{item.formatted}</span>
                    {showPercentages && (
                      <span className="text-[10px] text-[#74767e] font-mono">{pct.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
