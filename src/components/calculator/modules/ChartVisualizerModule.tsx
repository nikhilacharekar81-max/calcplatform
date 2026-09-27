import React, { useState } from 'react';
import { PieChart as PieChartIcon, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';

interface ChartVisualizerModuleProps {
  outputs: Array<{
    def: { id: string; label: string };
    formatted: string;
    raw: number | string | boolean;
  }>;
  chartConfig?: {
    enabled?: boolean;
    chartType?: 'donut' | 'area' | 'bar' | 'line' | 'trajectory' | 'montecarlo';
    title?: string;
    segments?: Array<{ label: string; outputId: string; color?: string }>;
  };
  settings?: {
    chartType?: 'donut' | 'area' | 'bar' | 'line' | 'trajectory' | 'montecarlo';
    chartTitle?: string;
    showLegend?: boolean;
  };
}

export const ChartVisualizerModule: React.FC<ChartVisualizerModuleProps> = ({
  outputs = [],
  chartConfig,
  settings = {},
}) => {
  const chartType = settings.chartType || chartConfig?.chartType || 'donut';
  const chartTitle = settings.chartTitle || chartConfig?.title || 'Visual Distribution & Projections';
  const showLegend = settings.showLegend !== false;

  // Extract numeric segments
  const segments = chartConfig?.segments && chartConfig.segments.length > 0
    ? chartConfig.segments.map((seg, idx) => {
        const out = outputs.find((o) => o.def.id === seg.outputId);
        const val = typeof out?.raw === 'number' ? Math.max(0, out.raw) : 0;
        const defaultColors = ['#1dbf73', '#ff7640', '#4a73e8', '#f59e0b', '#8b5cf6', '#06b6d4'];
        return {
          label: seg.label || out?.def.label || `Segment ${idx + 1}`,
          value: val,
          formatted: out?.formatted || String(val),
          color: seg.color || defaultColors[idx % defaultColors.length],
        };
      })
    : outputs
        .filter((o) => typeof o.raw === 'number' && o.raw > 0)
        .slice(0, 4)
        .map((o, idx) => {
          const defaultColors = ['#1dbf73', '#ff7640', '#4a73e8', '#f59e0b'];
          return {
            label: o.def.label,
            value: o.raw as number,
            formatted: o.formatted,
            color: defaultColors[idx % defaultColors.length],
          };
        });

  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);

  // Calculate angles for SVG donut
  let cumulativeAngle = 0;
  const donutSlices = segments.map((seg) => {
    const percentage = totalValue > 0 ? (seg.value / totalValue) * 100 : 0;
    const strokeDasharray = `${percentage} ${100 - percentage}`;
    const strokeDashoffset = -cumulativeAngle;
    cumulativeAngle += percentage;
    return {
      ...seg,
      percentage: percentage.toFixed(1),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{chartTitle}</h2>
        </div>
      </div>

      {segments.length === 0 || totalValue === 0 ? (
        <div className="p-8 text-center text-xs text-[#74767e] bg-[#fafafa] rounded-xl border border-dashed border-[#e4e5e7]">
          No numerical distribution data available for current inputs.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Visual SVG Donut/Bar Chart */}
          <div className="md:col-span-6 flex flex-col items-center justify-center relative">
            {chartType === 'donut' ? (
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#f0f0f0"
                    strokeWidth="4.5"
                  />
                  {donutSlices.map((slice, idx) => (
                    <circle
                      key={idx}
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="5"
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-500 ease-out hover:opacity-80"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] font-bold text-[#74767e] uppercase tracking-wider">Total</span>
                  <span className="text-sm sm:text-base font-extrabold font-mono text-[#222325]">
                    {segments[0]?.formatted.replace(/[0-9.,]/g, '')}{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ) : (
              /* Bar Chart representation */
              <div className="w-full space-y-4">
                {segments.map((seg, idx) => {
                  const pct = totalValue > 0 ? (seg.value / totalValue) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-[#222325]">
                        <span>{seg.label}</span>
                        <span className="font-mono">{seg.formatted} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 w-full bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: seg.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend & Breakdown stats */}
          {showLegend && (
            <div className="md:col-span-6 space-y-3.5">
              <span className="text-xs font-bold text-[#74767e] uppercase tracking-wider block">
                Component Share
              </span>
              <div className="space-y-2.5">
                {donutSlices.map((slice, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e5e7] flex items-center justify-between hover:border-[#1dbf73] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="text-xs font-bold text-[#222325]">{slice.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold font-mono text-[#222325] block">
                        {slice.formatted}
                      </span>
                      <span className="text-[10px] font-semibold text-[#74767e]">
                        {slice.percentage}%
                      </span>
                    </div>
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
