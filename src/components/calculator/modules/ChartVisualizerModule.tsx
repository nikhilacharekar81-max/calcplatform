import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { DynamicChartRenderer } from '../../charts/index.tsx';
import { ChartDataAdapter } from '../../charts/ChartDataAdapter.ts';
import { ChartRules } from '../../charts/ChartRules.ts';
import {
  generateAmortizationSchedule,
  calculateInvestment,
  calculateRetirement,
} from '../../../engines/financial-maths/index.ts';

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
  formValues?: Record<string, any>;
  calculatedResults?: any;
}

export const ChartVisualizerModule: React.FC<ChartVisualizerModuleProps> = ({
  calculatorSlug,
  category,
  outputs = [],
  chartConfig,
  settings = {},
  formValues = {},
  calculatedResults,
}) => {
  const chartTitle = settings.chartTitle || chartConfig?.title || 'Visual Distribution & Projections';

  // 1. Derive or extract authentic mathematical results
  let amortizationData = { balanceSeries: [] as any[], repaymentBreakdown: [] as any[], principalVsInterest: [] as any[] };
  let investmentData = { growthSeries: [] as any[], contributionVsReturns: [] as any[] };
  let retirementData = { drawdownSeries: [] as any[], requiredVsProjected: [] as any[] };
  let taxData = { regimeComparison: [] as any[] };

  // Amortization (Loan / EMI)
  if (calculatedResults?.rows && Array.isArray(calculatedResults.rows)) {
    amortizationData = ChartDataAdapter.fromAmortizationResult(calculatedResults);
  } else if (formValues.principal || formValues.loanAmount || formValues.amount) {
    const P = Math.max(0, parseFloat(formValues.principal || formValues.loanAmount || formValues.amount || '0'));
    const rate = Math.max(0, parseFloat(formValues.rate || formValues.interestRate || '8.5'));
    const years = Math.max(1, parseFloat(formValues.years || formValues.tenure || '20'));
    if (P > 0 && rate > 0) {
      try {
        const schedule = generateAmortizationSchedule({
          principal: P,
          annualRate: rate,
          term: years,
          termUnit: 'YEARS',
          frequency: 'MONTHLY',
        });
        amortizationData = ChartDataAdapter.fromAmortizationResult(schedule);
      } catch (e) {
        console.warn('Amortization schedule generation error:', e);
      }
    }
  }

  // Investment (SIP / Compound Interest / Wealth)
  if (calculatedResults?.schedule && Array.isArray(calculatedResults.schedule)) {
    investmentData = ChartDataAdapter.fromInvestmentResult(calculatedResults);
  } else if (formValues.initial || formValues.monthlyInvestment || formValues.principal) {
    const init = Math.max(0, parseFloat(formValues.initial || formValues.principal || '0'));
    const monthly = Math.max(0, parseFloat(formValues.monthlyInvestment || formValues.contribution || '0'));
    const returnRate = Math.max(0, parseFloat(formValues.annualReturn || formValues.rate || '12'));
    const yrs = Math.max(1, parseFloat(formValues.years || formValues.tenure || '10'));
    if ((init > 0 || monthly > 0) && returnRate > 0) {
      try {
        const invRes = calculateInvestment({
          initial: init,
          contribution: monthly,
          annualReturn: returnRate,
          years: yrs,
          contributionFrequency: 'MONTHLY',
        });
        investmentData = ChartDataAdapter.fromInvestmentResult(invRes);
      } catch (e) {
        console.warn('Investment calculation error:', e);
      }
    }
  }

  // Retirement
  if (calculatedResults?.drawdown && Array.isArray(calculatedResults.drawdown)) {
    retirementData = ChartDataAdapter.fromRetirementResult(calculatedResults);
  }

  // Tax Comparison
  if (calculatedResults?.oldRegime || calculatedResults?.newRegime) {
    const oldT = calculatedResults.oldRegime?.totalTax ?? 0;
    const newT = calculatedResults.newRegime?.totalTax ?? 0;
    taxData = ChartDataAdapter.fromTaxComparison(oldT, newT);
  }

  // Generic scalar output segments
  const segments = ChartDataAdapter.fromOutputsToSegments(outputs);

  // 2. Build Dataset Map
  const chartDataSets: Record<string, any[]> = {
    balanceSeries: amortizationData.balanceSeries,
    repaymentBreakdown: amortizationData.repaymentBreakdown,
    principalVsInterest: amortizationData.principalVsInterest,
    growthSeries: investmentData.growthSeries,
    contributionVsReturns: investmentData.contributionVsReturns,
    drawdownSeries: retirementData.drawdownSeries,
    requiredVsProjected: retirementData.requiredVsProjected,
    regimeComparison: taxData.regimeComparison,
    customSeries: segments.map((s) => ({ name: s.name, value: s.value, formatted: s.formatted, fill: s.color })),
  };

  // 3. Evaluate Chart Recommendation Rules
  const recommendedRules = ChartRules.evaluate({
    calculatorSlug,
    category,
    hasAmortization: amortizationData.balanceSeries.length > 0,
    hasInvestmentSchedule: investmentData.growthSeries.length > 0,
    hasRetirementDrawdown: retirementData.drawdownSeries.length > 0,
    hasTaxComparison: taxData.regimeComparison.length > 0,
    outputsCount: outputs.length,
  });

  // Filter valid recommendations whose datasets actually exist and contain data
  const validRecommendations = recommendedRules.filter((rec) => {
    const dataset = rec.dataKey ? chartDataSets[rec.dataKey] : undefined;
    return Array.isArray(dataset) && dataset.length > 0;
  });

  // Fallback if no specific rule applied but numeric output segments exist
  if (validRecommendations.length === 0 && segments.length > 0) {
    validRecommendations.push({
      chartId: 'custom-segment-donut',
      componentName: 'DonutChart',
      title: chartTitle,
      priority: 1,
      dataKey: 'customSeries',
      parameters: {
        currencySymbol: '₹',
        height: 300,
      },
    });
  }

  // Guard: if no visual datasets exist
  if (validRecommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs text-center text-xs text-slate-500">
        No numeric visualization available for current inputs.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-8 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1dbf73] flex items-center justify-center border border-emerald-100">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">{chartTitle}</h2>
        </div>
      </div>

      {/* Render all valid recommended charts driven by real calculation datasets */}
      <div className="space-y-8">
        {validRecommendations.map((rec) => {
          const dataset = chartDataSets[rec.dataKey || 'customSeries'] || [];
          return (
            <div key={rec.chartId} className="space-y-2">
              {rec.description && (
                <p className="text-xs text-slate-500 font-medium px-1">{rec.description}</p>
              )}
              <DynamicChartRenderer
                componentName={rec.componentName}
                title={rec.title}
                data={dataset}
                parameters={{
                  ...(rec.parameters || {}),
                  height: 320,
                  currencySymbol: '₹',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
