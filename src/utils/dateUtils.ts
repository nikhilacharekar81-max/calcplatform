/**
 * Shared Calendar Date Utility providing a complete universal statutory date abstraction
 * using addCalendarMonthsClamped for every required asset-rule boundary.
 */

export function addCalendarMonthsClamped(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const originalDay = d.getDate();
  const originalMonthLastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const isOriginalEndofMonth = originalDay >= originalMonthLastDay;

  const targetMonth = d.getMonth() + months;
  const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  
  const daysInTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  const targetDay = isOriginalEndofMonth ? daysInTargetMonth : Math.min(originalDay, daysInTargetMonth);

  d.setFullYear(targetYear, normalizedMonth, targetDay);
  return d;
}

/**
 * Universal statutory date abstraction evaluating if an asset transfer is Short-Term.
 * Statutory Long-Term requires holding for at least thresholdMonths calendar months,
 * evaluated via exact boundary clamping: saleDate >= addCalendarMonthsClamped(purchaseDate, thresholdMonths).
 */
export function isShortTermHolding(purchaseDate: Date, saleDate: Date, thresholdMonths: number): boolean {
  if (isNaN(purchaseDate.getTime()) || isNaN(saleDate.getTime())) return true;
  const longTermBoundaryDate = addCalendarMonthsClamped(purchaseDate, thresholdMonths);
  return saleDate.getTime() < longTermBoundaryDate.getTime();
}

export function computeHoldingPeriodDaysAndMonths(purchaseDate: Date, saleDate: Date): {
  holdingDays: number;
  monthsHeld: number;
  isShortTerm: { equity: boolean; realEstate: boolean; debtFund: boolean; unlisted: boolean; gold: boolean; other: boolean };
} {
  const diffTime = saleDate.getTime() - purchaseDate.getTime();
  const holdingDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  let monthsHeld = 0;
  while (saleDate >= addCalendarMonthsClamped(purchaseDate, monthsHeld + 1)) {
    monthsHeld++;
  }

  return {
    holdingDays,
    monthsHeld,
    isShortTerm: {
      equity: isShortTermHolding(purchaseDate, saleDate, 12),
      realEstate: isShortTermHolding(purchaseDate, saleDate, 24),
      debtFund: purchaseDate < new Date('2023-04-01') ? isShortTermHolding(purchaseDate, saleDate, 36) : true,
      unlisted: isShortTermHolding(purchaseDate, saleDate, 24),
      gold: isShortTermHolding(purchaseDate, saleDate, 24),
      other: isShortTermHolding(purchaseDate, saleDate, 36),
    },
  };
}
