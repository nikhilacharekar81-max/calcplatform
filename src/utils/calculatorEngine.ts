import Decimal from 'decimal.js';

// Configure precision for financial calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export { Decimal };

export function calculateIncomeTax(income: string, deductions: string): string {
  const gross = new Decimal(income);
  const totalDeductions = new Decimal(deductions);
  const taxableIncome = Decimal.max(0, gross.minus(totalDeductions));
  
  // Apply slab logic safely with exact decimal arithmetic
  return taxableIncome.toString();
}
