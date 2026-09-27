/**
 * Safe Universal Mathematical Expression Evaluator
 * Evaluates mathematical formulas securely against user variables.
 */

export function evaluateFormula(
  formula: string,
  variables: Record<string, number | string | boolean>
): number {
  if (!formula || !formula.trim()) return 0;

  try {
    const cleaned = formula.trim();

    // Context dictionary with math helper functions
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
      // Tax calculation engines
      tax_us: (taxable: number, status: string) => {
        const brackets: Record<string, Array<{ min: number; max: number; rate: number }>> = {
          single: [
            { min: 0, max: 11925, rate: 0.10 },
            { min: 11925, max: 48475, rate: 0.12 },
            { min: 48475, max: 103350, rate: 0.22 },
            { min: 103350, max: 197300, rate: 0.24 },
            { min: 197300, max: 250525, rate: 0.32 },
            { min: 250525, max: 626350, rate: 0.35 },
            { min: 626350, max: Infinity, rate: 0.37 },
          ],
          married: [
            { min: 0, max: 23850, rate: 0.10 },
            { min: 23850, max: 96950, rate: 0.12 },
            { min: 96950, max: 206700, rate: 0.22 },
            { min: 206700, max: 394600, rate: 0.24 },
            { min: 394600, max: 501050, rate: 0.32 },
            { min: 501050, max: 751600, rate: 0.35 },
            { min: 751600, max: Infinity, rate: 0.37 },
          ],
          head: [
            { min: 0, max: 17000, rate: 0.10 },
            { min: 17000, max: 64850, rate: 0.12 },
            { min: 64850, max: 103350, rate: 0.22 },
            { min: 103350, max: 197300, rate: 0.24 },
            { min: 197300, max: 250500, rate: 0.32 },
            { min: 250500, max: 626350, rate: 0.35 },
            { min: 626350, max: Infinity, rate: 0.37 },
          ],
        };
        const list = brackets[status] || brackets.single;
        let tax = 0;
        for (const b of list) {
          if (taxable > b.min) {
            const chunk = Math.min(taxable, b.max) - b.min;
            tax += chunk * b.rate;
          }
        }
        return Math.round(tax);
      },
      tax_us_marginal: (taxable: number, status: string) => {
        const brackets: Record<string, Array<{ min: number; max: number; rate: number }>> = {
          single: [
            { min: 0, max: 11925, rate: 0.10 },
            { min: 11925, max: 48475, rate: 0.12 },
            { min: 48475, max: 103350, rate: 0.22 },
            { min: 103350, max: 197300, rate: 0.24 },
            { min: 197300, max: 250525, rate: 0.32 },
            { min: 250525, max: 626350, rate: 0.35 },
            { min: 626350, max: Infinity, rate: 0.37 },
          ],
          married: [
            { min: 0, max: 23850, rate: 0.10 },
            { min: 23850, max: 96950, rate: 0.12 },
            { min: 96950, max: 206700, rate: 0.22 },
            { min: 206700, max: 394600, rate: 0.24 },
            { min: 394600, max: 501050, rate: 0.32 },
            { min: 501050, max: 751600, rate: 0.35 },
            { min: 751600, max: Infinity, rate: 0.37 },
          ],
          head: [
            { min: 0, max: 17000, rate: 0.10 },
            { min: 17000, max: 64850, rate: 0.12 },
            { min: 64850, max: 103350, rate: 0.22 },
            { min: 103350, max: 197300, rate: 0.24 },
            { min: 197300, max: 250500, rate: 0.32 },
            { min: 250500, max: 626350, rate: 0.35 },
            { min: 626350, max: Infinity, rate: 0.37 },
          ],
        };
        const list = brackets[status] || brackets.single;
        let rate = 0;
        for (const b of list) {
          if (taxable > b.min) rate = b.rate * 100;
        }
        return rate;
      },
      tax_in: (taxable: number, regime: string) => {
        const brackets: Record<string, Array<{ min: number; max: number; rate: number }>> = {
          new: [
            { min: 0, max: 400000, rate: 0.00 },
            { min: 400000, max: 800000, rate: 0.05 },
            { min: 800000, max: 1200000, rate: 0.10 },
            { min: 1200000, max: 1600000, rate: 0.15 },
            { min: 1600000, max: 2000000, rate: 0.20 },
            { min: 2000000, max: 2400000, rate: 0.25 },
            { min: 2400000, max: Infinity, rate: 0.30 },
          ],
          old: [
            { min: 0, max: 250000, rate: 0.00 },
            { min: 250000, max: 500000, rate: 0.05 },
            { min: 500000, max: 1000000, rate: 0.20 },
            { min: 1000000, max: Infinity, rate: 0.30 },
          ],
        };
        const list = brackets[regime] || brackets.new;
        let tax = 0;
        for (const b of list) {
          if (taxable > b.min) {
            const chunk = Math.min(taxable, b.max) - b.min;
            tax += chunk * b.rate;
          }
        }
        if (regime === 'new' && taxable <= 1200000) {
          tax = 0;
        } else if (regime === 'old' && taxable <= 500000) {
          tax = 0;
        } else {
          tax += tax * 0.04;
        }
        return Math.round(tax);
      },
      tax_in_marginal: (taxable: number, regime: string) => {
        const brackets: Record<string, Array<{ min: number; max: number; rate: number }>> = {
          new: [
            { min: 0, max: 400000, rate: 0.00 },
            { min: 400000, max: 800000, rate: 0.05 },
            { min: 800000, max: 1200000, rate: 0.10 },
            { min: 1200000, max: 1600000, rate: 0.15 },
            { min: 1600000, max: 2000000, rate: 0.20 },
            { min: 2000000, max: 2400000, rate: 0.25 },
            { min: 2400000, max: Infinity, rate: 0.30 },
          ],
          old: [
            { min: 0, max: 250000, rate: 0.00 },
            { min: 250000, max: 500000, rate: 0.05 },
            { min: 500000, max: 1000000, rate: 0.20 },
            { min: 1000000, max: Infinity, rate: 0.30 },
          ],
        };
        const list = brackets[regime] || brackets.new;
        let rate = 0;
        for (const b of list) {
          if (taxable > b.min) rate = b.rate * 100;
        }
        return rate;
      },
    };

    // Populate user input variables
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

    let expression = cleaned.replace(/\^/g, '**');

    // Forbidden tokens for security
    const forbidden = [
      'window', 'document', 'fetch', 'XMLHttpRequest', 'eval', 'Function',
      'constructor', '__proto__', 'prototype', 'import', 'require', 'process',
      'global', 'setTimeout', 'setInterval', 'localStorage', 'sessionStorage',
      'cookie', 'location', 'alert', 'write', 'while', 'for', 'return'
    ];

    for (const token of forbidden) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(expression)) {
        console.warn(`Formula contains prohibited identifier: ${token}`);
        return 0;
      }
    }

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
    case 'currency_inr':
      formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0,
      }).format(Math.round(value));
      return `${prefix || '₹'}${formatted}${suffix ? ' ' + suffix : ''}`;

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

  const p = prefix ? prefix + (prefix.endsWith(' ') || prefix.endsWith('$') || prefix.endsWith('₹') ? '' : ' ') : '';
  const s = suffix ? (suffix.startsWith(' ') ? '' : ' ') + suffix : '';
  return `${p}${formatted}${s}`;
}
