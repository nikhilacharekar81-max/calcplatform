export interface ChartParameters {
  showBrush?: boolean;
  primaryMetric?: string;
  secondaryMetric?: string;
  xAxisKey?: string;
  colors?: string[];
  height?: number;
  currencySymbol?: string;
  unit?: string;
  badge?: string;
  description?: string;
  dataSeries?: Array<{
    key: string;
    label: string;
    color?: string;
    type?: 'bar' | 'line' | 'area';
    stackId?: string;
  }>;
}

export interface RecommendedChartConfig {
  chartId: string;
  componentName: 'ComposedChart' | 'GroupedBarChart' | 'StackedBarChart' | 'GradientAreaChart' | 'DonutChart' | 'LineChart' | string;
  title: string;
  description?: string;
  priority: number;
  parameters?: ChartParameters;
  dataKey?: string; // which dataset slice to use (e.g. 'amortization', 'regimeComparison', 'compounding', 'slabs')
}

export interface KeyFinancialMetric {
  label: string;
  value: string;
  subtext?: string;
  status?: 'positive' | 'warning' | 'neutral' | 'highlight';
}

export interface StructuredAdvisoryLayout {
  calculatorType: 'home_loan' | 'income_tax' | 'sip_wealth' | 'hybrid_advisory' | string;
  scenarioTitle: string;
  executiveSummary: string;
  verdict: string;
  actionPoints: string[];
  recommendedCharts: RecommendedChartConfig[];
  keyMetrics: KeyFinancialMetric[];
  chartDataSets: {
    amortization?: any[];
    regimeComparison?: any[];
    compounding?: any[];
    slabs?: any[];
    customSeries?: any[];
  };
}
