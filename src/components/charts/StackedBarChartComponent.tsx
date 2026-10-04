import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartParameters } from './types.ts';

interface StackedBarChartProps {
  data: any[];
  parameters?: ChartParameters;
  title?: string;
}

export const StackedBarChartComponent: React.FC<StackedBarChartProps> = ({
  data,
  parameters = {},
  title,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
        No dataset available for Stacked Bar Chart
      </div>
    );
  }

  const {
    xAxisKey = 'year',
    height = 360,
    currencySymbol = '₹',
    dataSeries,
    badge = 'Stacked Breakdown',
    description,
  } = parameters as any;

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
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
            {title}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium">
            {badge}
          </span>
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 15, bottom: 20 }}>
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
                name === 'principal' ? 'Principal Repaid' :
                name === 'interest' ? 'Interest Paid' :
                name === 'incomeReplacement' ? 'Income Replacement' :
                name === 'loanProtection' ? 'Outstanding Loans' :
                name === 'goalProtection' ? 'Future Goals' :
                name === 'existingCover' ? 'Existing Cover' :
                name === 'existingSavings' ? 'Savings / Investments' :
                name === 'protectionGap' ? 'Protection Gap' : name
              ]}
              labelFormatter={(label) => `${label}`}
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

            {Array.isArray(dataSeries) && dataSeries.length > 0 ? (
              dataSeries.map((s: any, idx: number) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label || s.key}
                  stackId={s.stackId || 'stack1'}
                  fill={s.color || '#3b82f6'}
                  radius={idx === dataSeries.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  maxBarSize={60}
                />
              ))
            ) : (
              <>
                <Bar
                  dataKey="principal"
                  name="Principal Portion"
                  stackId="amortization"
                  fill="#3b82f6"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="interest"
                  name="Interest Portion"
                  stackId="amortization"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {description && (
        <p className="mt-2 text-xs text-slate-500 text-center">
          {description}
        </p>
      )}
    </div>
  );
};
