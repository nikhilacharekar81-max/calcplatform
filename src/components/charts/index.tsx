import React from 'react';
import { ComposedChartComponent } from './ComposedChartComponent.tsx';
import { GroupedBarChartComponent } from './GroupedBarChartComponent.tsx';
import { StackedBarChartComponent } from './StackedBarChartComponent.tsx';
import { GradientAreaChartComponent } from './GradientAreaChartComponent.tsx';
import { DonutChartComponent } from './DonutChartComponent.tsx';
import { LineChartComponent } from './LineChartComponent.tsx';
import { ChartParameters } from './types.ts';

// 1. Factory Pattern: Definitive Component Registry
export const CHART_REGISTRY: Record<string, React.FC<any>> = {
  ComposedChart: ComposedChartComponent,
  GroupedBarChart: GroupedBarChartComponent,
  StackedBarChart: StackedBarChartComponent,
  GradientAreaChart: GradientAreaChartComponent,
  DonutChart: DonutChartComponent,
  LineChart: LineChartComponent,
  // Common aliases to ensure resilient mapping from LLM responses
  composed_chart: ComposedChartComponent,
  grouped_bar_chart: GroupedBarChartComponent,
  stacked_bar_chart: StackedBarChartComponent,
  gradient_area_chart: GradientAreaChartComponent,
  donut_chart: DonutChartComponent,
  line_chart: LineChartComponent,
  AreaChart: GradientAreaChartComponent,
  BarChart: GroupedBarChartComponent,
  PieChart: DonutChartComponent,
};

// 2. Schema-Driven Dynamic Chart Renderer
export interface DynamicChartRendererProps {
  componentName: string;
  data: any[];
  title?: string;
  parameters?: ChartParameters;
  priority?: number;
}

export const DynamicChartRenderer: React.FC<DynamicChartRendererProps> = ({
  componentName,
  data,
  title,
  parameters = {},
}) => {
  const TargetChartComponent = CHART_REGISTRY[componentName];

  if (!TargetChartComponent) {
    return (
      <div className="w-full bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-center text-slate-500">
        <p className="text-sm font-medium">Chart visualization not registered: <code className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-xs">{componentName}</code></p>
        <p className="text-xs text-slate-400 mt-1">Available components: ComposedChart, GroupedBarChart, StackedBarChart, GradientAreaChart, DonutChart, LineChart</p>
      </div>
    );
  }

  return (
    <TargetChartComponent
      data={data}
      title={title}
      parameters={parameters}
    />
  );
};

export * from './types.ts';
export {
  ComposedChartComponent,
  GroupedBarChartComponent,
  StackedBarChartComponent,
  GradientAreaChartComponent,
  DonutChartComponent,
  LineChartComponent,
};
