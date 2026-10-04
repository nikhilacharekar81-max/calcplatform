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

interface GroupedBarChartProps {
  data: any[];
  parameters?: ChartParameters;
  title?: string;
}

export const GroupedBarChartComponent: React.FC<GroupedBarChartProps> = ({
  data,
  parameters = {},
  title,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
        No dataset available for Grouped Bar Chart
      </div>
    );
  }

  const {
    xAxisKey = 'label',
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

  // Inspect data keys to identify grouped metrics
  const firstItem = data[0] || {};
  const hasRegime = 'oldRegime' in firstItem && 'newRegime' in firstItem;
  const hasPrepay = 'prepaymentStrategy' in firstItem && 'sipStrategy' in firstItem;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            {title}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
            Side-by-Side Comparison
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
                name === 'oldRegime' ? 'Old Tax Regime' :
                name === 'newRegime' ? 'New Tax Regime' :
                name === 'prepaymentStrategy' ? 'Prepay Loan Strategy' :
                name === 'sipStrategy' ? 'Invest in SIP Strategy' :
                name === 'valueA' ? 'Scenario A' :
                name === 'valueB' ? 'Scenario B' : name
              ]}
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

            {hasRegime ? (
              <>
                <Bar
                  dataKey="oldRegime"
                  name="Old Tax Regime"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="newRegime"
                  name="New Tax Regime"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </>
            ) : hasPrepay ? (
              <>
                <Bar
                  dataKey="prepaymentStrategy"
                  name="Prepay Loan Strategy"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="sipStrategy"
                  name="Invest in SIP Strategy"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </>
            ) : (
              <>
                <Bar
                  dataKey="valueA"
                  name="Option A"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="valueB"
                  name="Option B"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center">
        Deterministic comparative evaluation contrasting financial alternatives under identical parameters.
      </p>
    </div>
  );
};
