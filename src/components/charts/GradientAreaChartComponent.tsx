import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartParameters } from './types.ts';

interface GradientAreaChartProps {
  data: any[];
  parameters?: ChartParameters;
  title?: string;
}

export const GradientAreaChartComponent: React.FC<GradientAreaChartProps> = ({
  data,
  parameters = {},
  title,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
        No dataset available for Gradient Area Chart
      </div>
    );
  }

  const {
    xAxisKey = 'year',
    height = 360,
    currencySymbol = '₹',
  } = parameters;

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    if (Math.abs(val) >= 10000000) return `${currencySymbol}${(val / 10000000).toFixed(2)} Cr`;
    if (Math.abs(val) >= 100000) return `${currencySymbol}${(val / 100000).toFixed(2)} L`;
    if (Math.abs(val) >= 1000) return `${currencySymbol}${(val / 1000).toFixed(1)}k`;
    return `${currencySymbol}${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {title}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
            Gradient Area Compounding
          </span>
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 15, bottom: 20 }}>
            <defs>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value)),
                name === 'invested' ? 'Total Amount Invested' :
                name === 'futureValue' ? 'Total Portfolio Wealth' :
                name === 'wealth' ? 'Total Portfolio Wealth' : name
              ]}
              labelFormatter={(label) => `Horizon: Year ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '12px', color: '#475569' }}
            />

            <Area
              type="monotone"
              dataKey="invested"
              name="Amount Invested"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInvested)"
            />
            <Area
              type="monotone"
              dataKey={data[0]?.futureValue !== undefined ? 'futureValue' : 'wealth'}
              name="Total Wealth (Principal + Returns)"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorWealth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center">
        The exponential compounding curve widening over time illustrates returns outpacing raw principal contributions.
      </p>
    </div>
  );
};
