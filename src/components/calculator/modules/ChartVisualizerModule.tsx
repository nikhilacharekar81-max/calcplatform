import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { DynamicChartRenderer } from '../../charts/index.tsx';
import { ChartDataAdapter } from '../../charts/ChartDataAdapter.ts';
import { ChartRules } from '../../charts/ChartRules.ts';

interface ChartVisualizerModuleProps {
  calculatorSlug?: string;
  category?: string;
  outputs?: Array<{
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
  calculatedResults?: any;
}

export const ChartVisualizerModule: React.FC<ChartVisualizerModuleProps> = ({
  calculatorSlug,
  category,
  outputs = [],
  chartConfig,
  settings = {},
  calculatedResults,
}) => {
  const chartTitle = settings.chartTitle || chartConfig?.title || 'Visual Distribution & Projections';

  // 1. Convert output key-values into segment datasets
  const segments = ChartDataAdapter.fromOutputsToSegments(outputs);
  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);

  // 2. Evaluate chart recommendation rules
  const recommendedRules = ChartRules.evaluate({
    calculatorSlug,
    category,
    hasAmortization: !!calculatedResults?.rows || !!calculatedResults?.amortization,
    hasInvestmentSchedule: !!calculatedResults?.schedule || !!calculatedResults?.growthSeries,
    hasRetirementDrawdown: !!calculatedResults?.drawdown,
    hasTaxComparison: !!calculatedResults?.oldRegime || !!calculatedResults?.newRegime,
    outputsCount: outputs.length,
  });

  // Guard: if no numeric outputs or non-visual data, hide module or show friendly empty state
  if (segments.length === 0 && recommendedRules.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center text-xs text-slate-500">
        No numeric visualization available for current inputs.
      </div>
    );
  }

  // Map segments for Donut chart component
  const donutData = segments.map((s) => ({
    name: s.name,
    value: s.value,
    formatted: s.formatted,
    fill: s.color,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1dbf73] flex items-center justify-center border border-emerald-100">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">{chartTitle}</h2>
        </div>
      </div>

      {/* Render Recharts Donut / Visual Distribution */}
      <DynamicChartRenderer
        componentName="DonutChart"
        title="Value Distribution"
        data={donutData}
        parameters={{
          height: 300,
          currencySymbol: '₹',
        }}
      />
    </div>
  );
};
