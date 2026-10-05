import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface AccessibleSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  valueText?: string;
  helperText?: string;
  errorText?: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
}

export const AccessibleSlider: React.FC<AccessibleSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  prefix,
  suffix,
  valueText,
  helperText,
  errorText,
  minLabel,
  maxLabel,
  onChange,
}) => {
  const numberInputId = `${id}-number-input`;
  const sliderInputId = `${id}-slider-input`;
  const helperTextId = helperText ? `${id}-helper-text` : undefined;
  const errorTextId = errorText ? `${id}-error-text` : undefined;
  const describedBy = [errorTextId, helperTextId].filter(Boolean).join(' ') || undefined;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange(min);
      return;
    }
    const num = Number(rawVal);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  const formattedValueText = valueText || `${prefix || ''}${value.toLocaleString('en-IN')}${unit ? ' ' + unit : ''}${suffix || ''}`;

  return (
    <div className="space-y-2">
      {/* Label and Numeric Input Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <label
          htmlFor={numberInputId}
          className="text-xs sm:text-sm font-bold text-slate-800 leading-snug cursor-pointer select-none"
        >
          {label}
        </label>

        <div className="flex items-center bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-300 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/30 transition-all shadow-2xs">
          {prefix && <span className="text-xs font-bold text-slate-600 mr-1 select-none">{prefix}</span>}
          <input
            id={numberInputId}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value || ''}
            onChange={handleInputChange}
            aria-describedby={describedBy}
            aria-label={`${label} numeric entry`}
            aria-invalid={Boolean(errorText)}
            className="w-24 text-right text-xs sm:text-sm font-extrabold text-slate-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && <span className="text-xs font-semibold text-slate-600 ml-1.5 select-none">{unit}</span>}
        </div>
      </div>

      {/* Accessible Dual-Control Range Slider */}
      <div className="relative pt-1">
        <input
          id={sliderInputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formattedValueText}
          aria-label={label}
          aria-describedby={describedBy}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all"
        />

        {/* Min/Max Accessibility Labels */}
        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mt-1 select-none">
          <span>{minLabel || `${prefix || ''}${min.toLocaleString('en-IN')}${unit ? ' ' + unit : ''}`}</span>
          <span>{maxLabel || `${prefix || ''}${max.toLocaleString('en-IN')}${unit ? ' ' + unit : ''}`}</span>
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p id={helperTextId} className="text-[11px] text-slate-600 leading-normal">
          {helperText}
        </p>
      )}

      {/* Error Message with Icon + High Contrast Text */}
      {errorText && (
        <div id={errorTextId} className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 p-2 rounded-lg border border-red-200" role="alert">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
          <span>{errorText}</span>
        </div>
      )}
    </div>
  );
};
