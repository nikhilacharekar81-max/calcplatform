/**
 * Safe Mathematical Expression Evaluator
 * Evaluates expressions securely against a dictionary of variables.
 * Supports basic arithmetic (+, -, *, /, %, ^, **), comparisons (<, >, <=, >=, ==, !=),
 * ternary conditionals (cond ? trueVal : falseVal), and common math functions:
 * sqrt, pow, abs, round, floor, ceil, min, max, log, log10, exp, sin, cos, tan.
 */

export function evaluateFormula(
  formula: string,
  variables: Record<string, number | string | boolean>
): number {
  if (!formula || !formula.trim()) return 0;

  try {
    const cleaned = formula.trim();

    // Prepare context of safe Math helper functions and provided variables
    const context: Record<string, unknown> = {
      sqrt: Math.sqrt,
      pow: Math.pow,
      abs: Math.abs,
      round: Math.round,
      floor: Math.floor,
      ceil: Math.ceil,
      min: Math.min,
      max: Math.max,
      log: Math.log,
      log10: Math.log10,
      exp: Math.exp,
      sin: (deg: number) => Math.sin((deg * Math.PI) / 180),
      cos: (deg: number) => Math.cos((deg * Math.PI) / 180),
      tan: (deg: number) => Math.tan((deg * Math.PI) / 180),
      PI: Math.PI,
      E: Math.E,
    };

    // Populate user input variables (convert strings to numbers if numeric)
    for (const [key, val] of Object.entries(variables)) {
      if (typeof val === 'number') {
        context[key] = val;
      } else if (typeof val === 'boolean') {
        context[key] = val ? 1 : 0;
      } else if (typeof val === 'string') {
        const parsed = parseFloat(val);
        context[key] = isNaN(parsed) ? val : parsed;
      } else {
        context[key] = 0;
      }
    }

    // Replace '^' with '**' for exponentiation
    let expression = cleaned.replace(/\^/g, '**');

    // Security check: prohibit assignments, statements, prototypes, and forbidden tokens
    const forbidden = [
      'window', 'document', 'fetch', 'XMLHttpRequest', 'eval', 'Function',
      'constructor', '__proto__', 'prototype', 'import', 'require', 'process',
      'global', 'setTimeout', 'setInterval', 'localStorage', 'sessionStorage',
      'cookie', 'location', 'alert', 'write', 'while', 'for', 'return'
    ];

    for (const token of forbidden) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(expression)) {
        console.warn(`Formula contains forbidden identifier: ${token}`);
        return 0;
      }
    }

    // Safe execution sandbox passing context keys as arguments
    const keys = Object.keys(context);
    const values = Object.values(context);
    const fn = new Function(...keys, `"use strict"; return (${expression});`);
    const result = fn(...values);

    if (typeof result === 'number') {
      if (isNaN(result) || !isFinite(result)) return 0;
      return result;
    }

    const num = Number(result);
    return isNaN(num) || !isFinite(num) ? 0 : num;
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
