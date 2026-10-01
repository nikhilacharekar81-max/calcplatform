import React from 'react';

interface ResultCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, highlight = false }) => {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'bg-[#1dbf73]/5 border-[#1dbf73]/20' : 'bg-slate-50 border-slate-100'}`}>
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-black mt-1 ${highlight ? 'text-[#1dbf73]' : 'text-[#222325]'}`}>
        {value}
      </div>
    </div>
  );
};
