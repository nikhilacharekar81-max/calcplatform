import {
  AmortizationResult,
  InvestmentResult,
  RetirementResult,
} from '../../engines/financial-maths/index.ts';

export interface StandardChartDataPoint {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Transforms pure mathematical result objects into standardized datasets
 * ready for Recharts components without duplicating any financial formulas.
 */
export class ChartDataAdapter {
  /**
   * Transforms loan amortization schedule into time-series balance decay & annual repayment data.
   */
  static fromAmortizationResult(result: AmortizationResult) {
    if (!result || !result.rows || result.rows.length === 0) {
      return { balanceSeries: [], repaymentBreakdown: [], principalVsInterest: [] };
    }

    // 1. Balance Decay Series (Monthly/Period trajectory)
    const balanceSeries = result.rows.map((row) => ({
      period: row.period,
      year: Math.ceil(row.period / 12),
      label: `Period ${row.period}`,
      balance: Math.round(row.endingBalance),
      cumulativeInterest: Math.round(row.cumulativeInterest),
      cumulativePrincipal: Math.round(row.cumulativePrincipal),
    }));

    // 2. Annual Repayment Breakdown (Principal vs Interest per year)
    const repaymentBreakdown = result.annual.map((ann) => ({
      year: `Year ${ann.year}`,
      principal: Math.round(ann.principal),
      interest: Math.round(ann.interest),
      totalPaid: Math.round(ann.payments),
      endingBalance: Math.round(ann.endingBalance),
    }));

    // 3. Overall Part-to-Whole Share (Donut/Pie dataset)
    const principalVsInterest = [
      { name: 'Principal Amount', value: Math.round(result.totalPrincipal), color: '#3b82f6' },
      { name: 'Total Interest', value: Math.round(result.totalInterest), color: '#f59e0b' },
    ];

    return {
      balanceSeries,
      repaymentBreakdown,
      principalVsInterest,
    };
  }

  /**
   * Transforms investment projection (SIP, Lump-sum, Compound Growth) into time-series growth datasets.
   */
  static fromInvestmentResult(result: InvestmentResult) {
    if (!result || !result.schedule || result.schedule.length === 0) {
      return { growthSeries: [], contributionVsReturns: [] };
    }

    // Aggregate by year for clean rendering
    const yearlyMap = new Map<number, { year: number; invested: number; growth: number; total: number }>();
    result.schedule.forEach((item) => {
      const yr = item.year;
      yearlyMap.set(yr, {
        year: yr,
        invested: Math.round(item.cumulativeContributions),
        growth: Math.round(Math.max(0, item.endingBalance - item.cumulativeContributions)),
        total: Math.round(item.endingBalance),
      });
    });

    const growthSeries = Array.from(yearlyMap.values()).map((item) => ({
      year: `Yr ${item.year}`,
      invested: item.invested,
      returns: item.growth,
      corpus: item.total,
    }));

    const contributionVsReturns = [
      { name: 'Total Invested', value: Math.round(result.totalContributions), color: '#10b981' },
      { name: 'Estimated Returns', value: Math.round(result.totalGrowth), color: '#3b82f6' },
    ];

    return {
      growthSeries,
      contributionVsReturns,
    };
  }

  /**
   * Transforms retirement projection into multi-stage accumulation and drawdown datasets.
   */
  static fromRetirementResult(result: RetirementResult) {
    if (!result || !result.drawdown) {
      return { drawdownSeries: [], requiredVsProjected: [] };
    }

    const drawdownSeries = result.drawdown.map((row) => ({
      age: `Age ${row.age}`,
      corpus: Math.round(row.endingBalance),
      withdrawal: Math.round(row.withdrawal),
      growth: Math.round(row.investmentGrowth),
    }));

    const requiredVsProjected = [
      {
        category: 'Retirement Corpus',
        projected: Math.round(result.nestEggNominal),
        todayDollars: Math.round(result.nestEggTodayDollars),
      },
    ];

    return {
      drawdownSeries,
      requiredVsProjected,
    };
  }

  /**
   * Transforms Tax Regime calculations into comparative bar datasets.
   */
  static fromTaxComparison(oldTax: number, newTax: number, oldDeductions = 0, newDeductions = 75000) {
    const regimeComparison = [
      {
        regime: 'Old Tax Regime',
        taxPayable: Math.round(oldTax),
        deductions: Math.round(oldDeductions),
        fill: '#ef4444',
      },
      {
        regime: 'New Tax Regime',
        taxPayable: Math.round(newTax),
        deductions: Math.round(newDeductions),
        fill: '#10b981',
      },
    ];

    return { regimeComparison };
  }

  /**
   * Generic adapter for key-value scalar outputs (e.g. GST, TDS, Fee breakdowns).
   */
  static fromOutputsToSegments(outputs: Array<{ def: { id: string; label: string }; formatted: string; raw: number | string | boolean }>) {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return outputs
      .filter((o) => typeof o.raw === 'number' && o.raw > 0)
      .map((o, idx) => ({
        name: o.def.label,
        value: Math.round(o.raw as number),
        formatted: o.formatted,
        color: colors[idx % colors.length],
      }));
  }
}
