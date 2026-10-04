import React from 'react';
import { Sliders, RotateCcw, HelpCircle } from 'lucide-react';
import { CalculatorField } from '../../../types/schema.ts';

interface InputsModuleProps {
  fields: CalculatorField[];
  formValues: Record<string, any>;
  onValueChange: (fieldId: string, value: any) => void;
  onReset?: () => void;
  settings?: {
    title?: string;
    layout?: 'single' | 'two-column';
    showResetButton?: boolean;
  };
}

export const InputsModule: React.FC<InputsModuleProps> = ({
  fields = [],
  formValues,
  onValueChange,
  onReset,
  settings = {},
}) => {
  const title = settings.title || 'Parameters & Inputs';
  const isTwoColumn = settings.layout !== 'single';
  const showReset = settings.showResetButton !== false;

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
        </div>
        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74767e] hover:text-[#1dbf73] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className={`grid gap-5 ${isTwoColumn ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {fields.map((field) => {
          const val = formValues[field.id] !== undefined ? formValues[field.id] : field.defaultValue;

          if (field.type === 'slider') {
            const min = field.min ?? 0;
            const max = field.max ?? 100;
            const step = field.step ?? 1;
            const numericVal = typeof val === 'number' ? val : parseFloat(val);
            const currentNum = isNaN(numericVal) ? min : numericVal;
            const sliderVal = Math.min(max, Math.max(min, currentNum));

            return (
              <div key={field.id} className="space-y-2.5 p-3.5 bg-[#fafbfc] rounded-xl border border-[#e4e5e7]/80 hover:border-[#1dbf73]/50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor={field.id} className="text-xs font-bold text-[#222325] flex items-center gap-1.5">
                    <span>{field.label}</span>
                    {field.helpText && (
                      <span className="text-[#95979d] hover:text-[#222325] transition-colors" title={field.helpText}>
                        <HelpCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </label>

                  {/* Paired Interactive Numeric Input */}
                  <div className="flex items-center bg-white border border-[#dadbdd] focus-within:border-[#1dbf73] focus-within:ring-2 focus-within:ring-[#1dbf73]/20 rounded-lg px-2.5 py-1 transition-all shadow-2xs">
                    {field.prefix && (
                      <span className="text-xs font-bold text-[#1dbf73] mr-1.5 select-none">
                        {field.prefix}
                      </span>
                    )}
                    <input
                      type="number"
                      id={`${field.id}-input`}
                      min={min}
                      max={max}
                      step={step}
                      value={val !== undefined && val !== null ? val : currentNum}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          onValueChange(field.id, '');
                        } else {
                          const parsed = parseFloat(raw);
                          onValueChange(field.id, isNaN(parsed) ? 0 : parsed);
                        }
                      }}
                      onBlur={() => {
                        if (val === '' || isNaN(Number(val))) {
                          onValueChange(field.id, field.defaultValue ?? min);
                        } else {
                          const n = Number(val);
                          if (n < min) onValueChange(field.id, min);
                          else if (n > max) onValueChange(field.id, max);
                        }
                      }}
                      className="w-24 sm:w-28 text-right font-mono font-bold text-xs sm:text-sm text-[#222325] bg-transparent outline-none"
                    />
                    {field.suffix && (
                      <span className="text-xs font-bold text-[#1dbf73] ml-1.5 select-none">
                        {field.suffix}
                      </span>
                    )}
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  id={field.id}
                  min={min}
                  max={max}
                  step={step}
                  value={sliderVal}
                  onChange={(e) => onValueChange(field.id, parseFloat(e.target.value))}
                  className="w-full accent-[#1dbf73] h-2 bg-[#e4e5e7] rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-[#95979d] font-mono">
                  <span>{field.prefix || ''}{min.toLocaleString()}{field.suffix || ''}</span>
                  <span>{field.prefix || ''}{max.toLocaleString()}{field.suffix || ''}</span>
                </div>
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.id} className="space-y-1.5">
                <label htmlFor={field.id} className="block text-xs font-bold text-[#222325]">
                  {field.label}
                </label>
                <select
                  id={field.id}
                  value={val}
                  onChange={(e) => onValueChange(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73]"
                >
                  {field.options?.map((opt) => (
                    <option key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {field.helpText && <p className="text-[11px] text-[#74767e]">{field.helpText}</p>}
              </div>
            );
          }

          if (field.type === 'checkbox') {
            return (
              <div key={field.id} className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id={field.id}
                  checked={Boolean(val)}
                  onChange={(e) => onValueChange(field.id, e.target.checked)}
                  className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded border-[#e4e5e7] focus:ring-[#1dbf73] cursor-pointer"
                />
                <label htmlFor={field.id} className="text-xs font-bold text-[#222325] cursor-pointer">
                  {field.label}
                  {field.helpText && <span className="block text-[11px] font-normal text-[#74767e]">{field.helpText}</span>}
                </label>
              </div>
            );
          }

          if (field.type === 'date') {
            return (
              <div key={field.id} className="space-y-1.5">
                <label htmlFor={field.id} className="block text-xs font-bold text-[#222325]">
                  {field.label}
                </label>
                <input
                  type="date"
                  id={field.id}
                  value={String(val || '')}
                  onChange={(e) => onValueChange(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73]"
                />
                {field.helpText && <p className="text-[11px] text-[#74767e]">{field.helpText}</p>}
              </div>
            );
          }

          // Default: Number or Text input
          return (
            <div key={field.id} className="space-y-1.5">
              <label htmlFor={field.id} className="block text-xs font-bold text-[#222325]">
                {field.label}
              </label>
              <div className="relative rounded-lg shadow-2xs">
                {field.prefix && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-xs font-semibold text-[#74767e]">{field.prefix}</span>
                  </div>
                )}
                <input
                  type="number"
                  id={field.id}
                  min={field.min}
                  max={field.max}
                  step={field.step || 'any'}
                  placeholder={field.placeholder}
                  value={val !== undefined ? val : ''}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    onValueChange(field.id, isNaN(parsed) ? '' : parsed);
                  }}
                  className={`w-full py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] font-semibold focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] ${
                    field.prefix ? 'pl-8' : 'pl-3.5'
                  } ${field.suffix ? 'pr-12' : 'pr-3.5'}`}
                />
                {field.suffix && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-xs font-semibold text-[#74767e]">{field.suffix}</span>
                  </div>
                )}
              </div>
              {field.helpText && <p className="text-[11px] text-[#74767e]">{field.helpText}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
