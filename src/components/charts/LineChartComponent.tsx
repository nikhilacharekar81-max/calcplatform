import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartParameters } from './types.ts';

interface LineChartProps {
  data: any[];
  parameters?: ChartParameters;
  title?: string;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  parameters = {},
  title,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
        No dataset available for Line Chart
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

  const firstItem = data[0] || {};
  const hasBalance = 'balance' in firstItem;
  const hasComparison = 'seriesA' in firstItem && 'seriesB' in firstItem;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            {title}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-medium">
            Trend Line
          </span>
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 15, bottom: 20 }}>
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
                name === 'balance' ? 'Outstanding Balance' :
                name === 'seriesA' ? 'Baseline Trajectory' :
                name === 'seriesB' ? 'Accelerated Trajectory' : name
              ]}
              labelFormatter={(label) => `Period / Year: ${label}`}
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

            {hasComparison ? (
              <>
                <Line
                  type="monotone"
                  dataKey="seriesA"
                  name="Baseline Trajectory"
                  stroke="#64748b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="seriesB"
                  name="Accelerated Trajectory"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </>
            ) : hasBalance ? (
              <Line
                type="monotone"
                dataKey="balance"
                name="Outstanding Principal Debt"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#dc2626' }}
                activeDot={{ r: 6 }}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                name="Metric Trend"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#2563eb' }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center">
        Depicting sequential amortized or compounding balances across the planned horizon.
      </p>
    </div>
  );
};
