import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TaxComparisonChartProps {
  oldTax: number;
  newTax: number;
}

export const TaxComparisonChart: React.FC<TaxComparisonChartProps> = ({ oldTax, newTax }) => {
  const data = [
    { name: 'Old Regime', tax: oldTax },
    { name: 'New Regime', tax: newTax },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <h4 className="text-sm font-semibold text-slate-800">Tax Liability Comparison</h4>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none' }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Tax Liability']}
            />
            <Bar dataKey="tax" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
