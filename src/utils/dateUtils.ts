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
  return saleDate.getTime() <= longTermBoundaryDate.getTime();
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

/**
 * Returns the US Tax Year string (e.g. "TY 2026") and standard dates for a given date.
 */
export function getUSTaxYearDetails(dateInput: Date | string): {
  taxYearString: string;
  startDateIso: string;
  endDateIso: string;
} {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return {
      taxYearString: "TY 2026",
      startDateIso: "2026-01-01",
      endDateIso: "2026-12-31",
    };
  }
  const year = d.getFullYear();
  return {
    taxYearString: `TY ${year}`,
    startDateIso: `${year}-01-01`,
    endDateIso: `${year}-12-31`,
  };
}

/**
 * Calculates day count fractions based on standard international financial conventions (30/360, ACT/360, ACT/365, ACT/ACT).
 */
export function computeDayCountFraction(
  startDate: Date,
  endDate: Date,
  convention: '30/360' | 'ACT/360' | 'ACT/365' | 'ACT/ACT'
): number {
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
  if (startDate > endDate) return -computeDayCountFraction(endDate, startDate, convention);

  const d1 = startDate.getDate();
  const m1 = startDate.getMonth();
  const y1 = startDate.getFullYear();
  const d2 = endDate.getDate();
  const m2 = endDate.getMonth();
  const y2 = endDate.getFullYear();

  switch (convention) {
    case '30/360': {
      const day1 = d1 === 31 ? 30 : d1;
      const day2 = d2 === 31 && day1 >= 30 ? 30 : d2;
      const days = 360 * (y2 - y1) + 30 * (m2 - m1) + (day2 - day1);
      return days / 360;
    }
    case 'ACT/360': {
      const diffMs = endDate.getTime() - startDate.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return days / 360;
    }
    case 'ACT/365': {
      const diffMs = endDate.getTime() - startDate.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return days / 365;
    }
    case 'ACT/ACT': {
      if (y1 === y2) {
        const daysInYear = isLeapYear(y1) ? 366 : 365;
        const diffMs = endDate.getTime() - startDate.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return days / daysInYear;
      } else {
        const endOfYear1 = new Date(y1, 11, 31);
        const startOfYear2 = new Date(y2, 0, 1);
        const fraction1 = (Math.floor((endOfYear1.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1) / (isLeapYear(y1) ? 366 : 365);
        const fraction2 = (Math.floor((endDate.getTime() - startOfYear2.getTime()) / (1000 * 60 * 60 * 24)) + 1) / (isLeapYear(y2) ? 366 : 365);
        const intermediateYears = y2 - y1 - 1;
        return fraction1 + intermediateYears + fraction2;
      }
    }
  }
}

/**
 * Returns the quarter name (e.g. Q1, Q2) and matching quarter-end date for a given date.
 */
export function getStatutoryQuarterEnd(dateInput: Date | string): {
  quarter: string;
  quarterEndIso: string;
} {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return { quarter: "Q1", quarterEndIso: "2026-03-31" };
  }
  const year = d.getFullYear();
  const month = d.getMonth();
  if (month <= 2) {
    return { quarter: "Q1", quarterEndIso: `${year}-03-31` };
  } else if (month <= 5) {
    return { quarter: "Q2", quarterEndIso: `${year}-06-30` };
  } else if (month <= 8) {
    return { quarter: "Q3", quarterEndIso: `${year}-09-30` };
  } else {
    return { quarter: "Q4", quarterEndIso: `${year}-12-31` };
  }
}

/**
 * Adds business days to a date, skipping weekends and optional observed holidays list.
 */
export function addBusinessDays(startDate: Date, businessDays: number, holidaysList: string[] = []): Date {
  const d = new Date(startDate.getTime());
  if (isNaN(d.getTime()) || businessDays === 0) return d;

  const holidays = new Set(holidaysList.map(h => new Date(h).toDateString()));
  let added = 0;
  const step = businessDays > 0 ? 1 : -1;
  const target = Math.abs(businessDays);

  while (added < target) {
    d.setDate(d.getDate() + step);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidays.has(d.toDateString());

    if (!isWeekend && !isHoliday) {
      added++;
    }
  }
  return d;
}

/**
 * Rolls non-business days to standard business days according to legal execution roll conventions.
 */
export function rollToBusinessDay(
  date: Date,
  rollConvention: 'FOLLOWING' | 'MODIFIED_FOLLOWING' | 'PRECEDING',
  holidaysList: string[] = []
): Date {
  const d = new Date(date.getTime());
  if (isNaN(d.getTime())) return d;

  const holidays = new Set(holidaysList.map(h => new Date(h).toDateString()));
  const isBusinessDay = (dateToCheck: Date): boolean => {
    const day = dateToCheck.getDay();
    return day !== 0 && day !== 6 && !holidays.has(dateToCheck.toDateString());
  };

  if (isBusinessDay(d)) return d;

  if (rollConvention === 'PRECEDING') {
    while (!isBusinessDay(d)) {
      d.setDate(d.getDate() - 1);
    }
    return d;
  }

  if (rollConvention === 'FOLLOWING') {
    while (!isBusinessDay(d)) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }

  if (rollConvention === 'MODIFIED_FOLLOWING') {
    const startMonth = d.getMonth();
    const temp = new Date(d.getTime());
    while (!isBusinessDay(temp)) {
      temp.setDate(temp.getDate() + 1);
    }
    if (temp.getMonth() === startMonth) {
      return temp;
    } else {
      while (!isBusinessDay(d)) {
        d.setDate(d.getDate() - 1);
      }
      return d;
    }
  }

  return d;
}
