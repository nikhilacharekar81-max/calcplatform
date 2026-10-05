/**
 * Shared Calendar Date Utility with robust addCalendarMonthsClamped (handling Jan 31, Feb 28/29 leap years, and month-end anniversary boundaries).
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

export function computeHoldingPeriodDaysAndMonths(purchaseDate: Date, saleDate: Date): { holdingDays: number; monthsHeld: number; isShortTerm: { equity: boolean; realEstate: boolean; debtFund: boolean; other: boolean } } {
  const diffTime = saleDate.getTime() - purchaseDate.getTime();
  const holdingDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const diffMonths = (saleDate.getFullYear() - purchaseDate.getFullYear()) * 12 + (saleDate.getMonth() - purchaseDate.getMonth());
  const isPastDay = saleDate.getDate() >= purchaseDate.getDate();
  const monthsHeld = isPastDay ? diffMonths : diffMonths - 1;

  return {
    holdingDays,
    monthsHeld,
    isShortTerm: {
      equity: holdingDays < 365, // Listed equity statutory 12-month / 365-day rule
      realEstate: monthsHeld < 24, // Real estate 24 months
      debtFund: purchaseDate < new Date('2023-04-01') ? monthsHeld < 36 : true, // Sec 50AA post-Apr 2023
      other: monthsHeld < 36,
    },
  };
}
