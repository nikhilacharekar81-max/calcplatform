/**
 * Safe Mathematical Expression Evaluator
 * Evaluates expressions securely against a dictionary of variables.
 * Supports basic arithmetic (+, -, *, /, %, ^, **), comparisons (<, >, <=, >=, ==, !=),
 * ternary conditionals (cond ? trueVal : falseVal), and common math functions:
 * sqrt, pow, abs, round, floor, ceil, min, max, log, log10, exp, sin, cos, tan.
 */

import { evaluateExpression } from '../engines/financial-maths/index.ts';

export function evaluateFormula(
  formula: string,
  variables: Record<string, number | string | boolean>
): number {
  if (!formula || !formula.trim()) return 0;

  try {
    const numericContext: Record<string, number> = {
      PI: Math.PI,
      E: Math.E,
    };

    for (const [key, val] of Object.entries(variables)) {
      if (typeof val === 'number') {
        numericContext[key] = val;
      } else if (typeof val === 'boolean') {
        numericContext[key] = val ? 1 : 0;
      } else if (typeof val === 'string') {
        const parsed = parseFloat(val);
        numericContext[key] = isNaN(parsed) ? 0 : parsed;
      } else {
        numericContext[key] = 0;
      }
    }

    const result = evaluateExpression(formula, numericContext);
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return result;
    }
    return 0;
  } catch (err) {
    console.error('Calculation evaluation error:', err, 'for formula:', formula);
    return 0;
  }
}

export function formatResultValue(
  value: number,
  format: string = 'number',
  prefix: string = '',
  suffix: string = ''
): string {
  if (isNaN(value) || !isFinite(value)) return '0';

  let formatted = '';

  switch (format) {
    case 'currency':
      formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      return `${prefix || '$'}${formatted}${suffix ? ' ' + suffix : ''}`;

    case 'percent':
      formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      return `${prefix ? prefix + ' ' : ''}${formatted}%${suffix ? ' ' + suffix : ''}`;

    case 'integer':
      formatted = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(Math.round(value));
      break;

    case 'decimal_2':
      formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      break;

    case 'decimal_4':
      formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(value);
      break;

    case 'time_duration': {
      const years = Math.floor(value / 12);
      const months = Math.round(value % 12);
      if (years > 0 && months > 0) {
        return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
      } else if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${months} month${months > 1 ? 's' : ''}`;
      }
    }

    case 'number':
    default:
      formatted = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 4,
      }).format(value);
      break;
  }

  const p = prefix ? prefix + (prefix.endsWith(' ') || prefix.endsWith('$') ? '' : ' ') : '';
  const s = suffix ? (suffix.startsWith(' ') ? '' : ' ') + suffix : '';
  return `${p}${formatted}${s}`;
}
