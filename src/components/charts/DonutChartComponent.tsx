import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartParameters } from './types.ts';

interface DonutChartProps {
  data: any[];
  parameters?: ChartParameters;
  title?: string;
}

const DEFAULT_DONUT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
];

export const DonutChartComponent: React.FC<DonutChartProps> = ({
  data,
  parameters = {},
  title,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
        No dataset available for Donut Chart
      </div>
    );
  }

  const {
    height = 360,
    colors = DEFAULT_DONUT_COLORS,
    currencySymbol = '₹',
  } = parameters;

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    if (Math.abs(val) >= 10000000) return `${currencySymbol}${(val / 10000000).toFixed(2)} Cr`;
    if (Math.abs(val) >= 100000) return `${currencySymbol}${(val / 100000).toFixed(2)} L`;
    if (Math.abs(val) >= 1000) return `${currencySymbol}${(val / 1000).toFixed(1)}k`;
    return `${currencySymbol}${val.toLocaleString('en-IN')}`;
  };

  const totalValue = data.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            {title}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-medium">
            Proportional Donut
          </span>
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const numeric = Number(value) || 0;
                const pct = totalValue > 0 ? ((numeric / totalValue) * 100).toFixed(1) : '0';
                return [`${formatCurrency(numeric)} (${pct}%)`, name];
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={40}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#475569' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center">
        Total Evaluated Pool: <span className="font-semibold text-slate-700">{formatCurrency(totalValue)}</span>
      </p>
    </div>
  );
};
