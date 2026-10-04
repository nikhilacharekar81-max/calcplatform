import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from 'recharts';
import { ChartParameters } from './types.ts';

interface ComposedChartProps {
  data: any[];
  parameters?: ChartParameters;
  title?: string;
}

export const ComposedChartComponent: React.FC<ComposedChartProps> = ({
  data,
  parameters = {},
  title,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
        No dataset available for Composed Chart
      </div>
    );
  }

  const {
    showBrush = false,
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
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            {title}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium">
            Composed (Bar + Line)
          </span>
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value)),
                name === 'principal' ? 'Principal Repaid' :
                name === 'interest' ? 'Interest Paid' :
                name === 'balance' ? 'Outstanding Balance' : name
              ]}
              labelFormatter={(label) => `Year / Period: ${label}`}
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
            
            {/* Primary bar: Principal */}
            <Bar
              yAxisId="left"
              dataKey="principal"
              name="Principal Repaid"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              maxBarSize={38}
            />
            {/* Secondary bar: Interest */}
            {data[0]?.interest !== undefined && (
              <Bar
                yAxisId="left"
                dataKey="interest"
                name="Interest Paid"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                maxBarSize={38}
              />
            )}
            {/* Line: Outstanding Balance */}
            {data[0]?.balance !== undefined && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="balance"
                name="Outstanding Balance"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#dc2626' }}
                activeDot={{ r: 6 }}
              />
            )}

            {showBrush && (
              <Brush
                dataKey={xAxisKey}
                height={28}
                stroke="#2563eb"
                fill="#eff6ff"
                startIndex={0}
                endIndex={Math.min(data.length - 1, 10)}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center">
        Interactive timeline comparing amortized principal repayments against the remaining debt trajectory.
      </p>
    </div>
  );
};
