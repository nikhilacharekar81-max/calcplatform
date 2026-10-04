import { RecommendedChartConfig } from './types.ts';

export interface ChartRuleContext {
  calculatorSlug?: string;
  category?: string;
  subcategory?: string;
  hasAmortization?: boolean;
  hasInvestmentSchedule?: boolean;
  hasRetirementDrawdown?: boolean;
  hasTaxComparison?: boolean;
  outputsCount?: number;
}

/**
 * Deterministic chart rule engine.
 * Maps calculator outputs to semantic Recharts recommendations without any external or AI runtime dependencies.
 */
export class ChartRules {
  /**
   * Evaluates available data context and recommends zero or more relevant chart configurations.
   */
  static evaluate(context: ChartRuleContext): RecommendedChartConfig[] {
    const recommendations: RecommendedChartConfig[] = [];
    const slug = (context.calculatorSlug || '').toLowerCase();
    const cat = (context.category || '').toLowerCase();

    // 1. LOAN & EMI CALCULATORS (Home loan, Car loan, Personal loan, Bike loan, Mortgage)
    if (context.hasAmortization || slug.includes('emi') || slug.includes('loan') || slug.includes('mortgage')) {
      recommendations.push({
        chartId: 'principal-vs-interest',
        componentName: 'DonutChart',
        title: 'Breakdown of Total Loan Payment',
        description: 'Visual ratio of Principal Amount borrowed vs Total Interest payable.',
        priority: 1,
        dataKey: 'principalVsInterest',
        parameters: {
          currencySymbol: '₹',
          colors: ['#3b82f6', '#f59e0b'],
        },
      });

      if (context.hasAmortization) {
        recommendations.push({
          chartId: 'outstanding-balance-trajectory',
          componentName: 'GradientAreaChart',
          title: 'Outstanding Loan Balance Trajectory',
          description: 'Shows how your principal balance decreases over the loan tenure.',
          priority: 2,
          dataKey: 'balanceSeries',
          parameters: {
            xAxisKey: 'period',
            primaryMetric: 'balance',
            currencySymbol: '₹',
            colors: ['#ef4444'],
          },
        });

        recommendations.push({
          chartId: 'annual-repayment-breakdown',
          componentName: 'GroupedBarChart',
          title: 'Yearly Repayment Composition',
          description: 'Annual distribution of principal paid versus interest charged.',
          priority: 3,
          dataKey: 'repaymentBreakdown',
          parameters: {
            xAxisKey: 'year',
            currencySymbol: '₹',
            dataSeries: [
              { key: 'principal', label: 'Principal Paid', color: '#3b82f6', type: 'bar' },
              { key: 'interest', label: 'Interest Charged', color: '#f59e0b', type: 'bar' },
            ],
          },
        });
      }
      return recommendations;
    }

    // 2. INVESTMENT & WEALTH CALCULATORS (SIP, Lump sum, Compound Interest, CAGR, Mutual Fund)
    if (context.hasInvestmentSchedule || slug.includes('sip') || slug.includes('compound') || slug.includes('investment') || slug.includes('mutual-fund') || slug.includes('fd') || slug.includes('rd') || slug.includes('ppf')) {
      recommendations.push({
        chartId: 'investment-growth-curve',
        componentName: 'GradientAreaChart',
        title: 'Investment Corpus Growth Over Time',
        description: 'Multi-year trajectory of total accumulated wealth vs invested capital.',
        priority: 1,
        dataKey: 'growthSeries',
        parameters: {
          xAxisKey: 'year',
          primaryMetric: 'corpus',
          currencySymbol: '₹',
          colors: ['#10b981'],
        },
      });

      recommendations.push({
        chartId: 'invested-vs-returns-breakdown',
        componentName: 'DonutChart',
        title: 'Total Invested vs Estimated Returns',
        description: 'Proportion of capital invested vs compounding wealth returns earned.',
        priority: 2,
        dataKey: 'contributionVsReturns',
        parameters: {
          currencySymbol: '₹',
          colors: ['#10b981', '#3b82f6'],
        },
      });
      return recommendations;
    }

    // 3. RETIREMENT & FIRE CALCULATORS
    if (context.hasRetirementDrawdown || slug.includes('retirement') || slug.includes('pension') || slug.includes('fire') || slug.includes('nps')) {
      recommendations.push({
        chartId: 'retirement-corpus-trajectory',
        componentName: 'LineChart',
        title: 'Retirement Corpus Accumulated & Drawdown Trajectory',
        description: 'Shows portfolio wealth sustainability throughout your retirement years.',
        priority: 1,
        dataKey: 'drawdownSeries',
        parameters: {
          xAxisKey: 'age',
          primaryMetric: 'corpus',
          currencySymbol: '₹',
          colors: ['#8b5cf6'],
        },
      });
      return recommendations;
    }

    // 4. INCOME TAX CALCULATORS (Old vs New Regime, Salary Tax, Tax Slabs)
    if (context.hasTaxComparison || slug.includes('tax') || slug.includes('income-tax') || slug.includes('regime') || slug.includes('salary')) {
      recommendations.push({
        chartId: 'old-vs-new-regime-tax-liability',
        componentName: 'GroupedBarChart',
        title: 'Tax Liability Comparison: Old vs New Regime',
        description: 'Direct comparison of total tax payable under both tax regimes.',
        priority: 1,
        dataKey: 'regimeComparison',
        parameters: {
          xAxisKey: 'regime',
          currencySymbol: '₹',
          dataSeries: [
            { key: 'taxPayable', label: 'Tax Payable (₹)', color: '#ef4444', type: 'bar' },
            { key: 'deductions', label: 'Total Deductions Allowed (₹)', color: '#10b981', type: 'bar' },
          ],
        },
      });
      return recommendations;
    }

    // 5. TAXABLE / COMPONENT BREAKDOWN CALCULATORS (GST, TDS, Capital Gains, EPF)
    if (slug.includes('gst') || slug.includes('tds') || slug.includes('capital-gains') || slug.includes('epf') || slug.includes('stamp-duty')) {
      if ((context.outputsCount || 0) >= 2) {
        recommendations.push({
          chartId: 'component-share-distribution',
          componentName: 'DonutChart',
          title: 'Component Share & Value Distribution',
          description: 'Visual breakdown of constituent tax & fee components.',
          priority: 1,
          dataKey: 'customSeries',
          parameters: {
            currencySymbol: '₹',
          },
        });
      }
      return recommendations;
    }

    // 6. GENERAL MATHEMATICS & SIMPLE ARITHMETIC (e.g., simple percentage, basic addition/subtraction)
    // Return 0 charts when visualization provides no information gain.
    return recommendations;
  }
}
