import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, unit, ...props }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700">{label}</label>
      <div className="relative">
        <input
          {...props}
          className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white transition-all"
        />
        {unit && (
          <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
