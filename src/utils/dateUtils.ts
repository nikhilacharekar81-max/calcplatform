/**
 * Shared Statutory Date Utility
 *
 * Provides calendar date utilities for month-end clamping, statutory holding-period
 * threshold determinations (capital gains), and Financial Year (FY) date resolution.
 */

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns the total number of days in a specific month (0-indexed month).
 */
export function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate();
}

/**
 * Validates whether a date string is a valid ISO format (YYYY-MM-DD or full ISO).
 */
export function isValidIsoDateString(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

/**
 * Returns the Indian Financial Year string (e.g. "FY 2026-27") and boundary years for a given date.
 */
export function getIndianFinancialYearDetails(dateInput: Date | string): {
  fyString: string;
  startYear: number;
  endYear: number;
  startDateIso: string;
  endDateIso: string;
} {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return {
      fyString: "FY 2026-27",
      startYear: 2026,
      endYear: 2027,
      startDateIso: "2026-04-01",
      endDateIso: "2027-03-31",
    };
  }

  const year = d.getFullYear();
  const month = d.getMonth(); // 3 = April (0-indexed)
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;
  const fyString = `FY ${startYear}-${endYear.toString().slice(-2)}`;

  return {
    fyString,
    startYear,
    endYear,
    startDateIso: `${startYear}-04-01`,
    endDateIso: `${endYear}-03-31`,
  };
}

/**
 * Adds calendar months to a date, clamping day-of-month to the target month's maximum day
 * or preserving month-end behavior.
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
 * Evaluates whether an asset holding period is Short-Term based on a threshold in calendar months.
 * Long-Term requires holding for at least thresholdMonths calendar months, evaluated via:
 * saleDate >= addCalendarMonthsClamped(purchaseDate, thresholdMonths).
 */
export function isShortTermHolding(purchaseDate: Date, saleDate: Date, thresholdMonths: number): boolean {
  if (isNaN(purchaseDate.getTime()) || isNaN(saleDate.getTime())) return true;
  const longTermBoundaryDate = addCalendarMonthsClamped(purchaseDate, thresholdMonths);
  return saleDate.getTime() < longTermBoundaryDate.getTime();
}

/**
 * Computes holding duration in elapsed days, full calendar months held, and evaluates short-term
 * status across statutory asset categories.
 */
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
