export interface PercentageInput {
  value: number;
  percent: number;
}
export interface PercentageResult {
  result: number;
  resultFormatted: string;
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const val = Math.max(0, input.value);
  const pct = Math.max(0, input.percent);
  const result = (val * pct) / 100;
  return {
    result,
    resultFormatted: result.toFixed(2),
  };
}

export interface PercentageChangeInput {
  initialValue: number;
  finalValue: number;
}
export interface PercentageChangeResult {
  difference: number;
  percentChange: number;
  percentChangeFormatted: string;
  changeType: 'increase' | 'decrease' | 'no_change';
}

export function calculatePercentageChange(input: PercentageChangeInput): PercentageChangeResult {
  const init = input.initialValue;
  const final = input.finalValue;
  const difference = final - init;
  let percentChange = 0;
  let changeType: 'increase' | 'decrease' | 'no_change' = 'no_change';

  if (init !== 0) {
    percentChange = (difference / Math.abs(init)) * 100;
  }

  if (difference > 0) {
    changeType = 'increase';
  } else if (difference < 0) {
    changeType = 'decrease';
  }

  return {
    difference,
    percentChange: Math.abs(percentChange),
    percentChangeFormatted: `${Math.abs(percentChange).toFixed(2)}%`,
    changeType,
  };
}

export interface RatioInput {
  valueA: number;
  valueB: number;
}
export interface RatioResult {
  simplifiedA: number;
  simplifiedB: number;
  ratioString: string;
  shareAPercent: number;
  shareBPercent: number;
}

export function calculateRatio(input: RatioInput): RatioResult {
  const a = Math.max(1, Math.round(input.valueA));
  const b = Math.max(1, Math.round(input.valueB));

  // Compute GCD
  const gcd = (x: number, y: number): number => {
    while (y !== 0) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  };

  const commonFactor = gcd(a, b);
  const simplifiedA = a / commonFactor;
  const simplifiedB = b / commonFactor;
  const total = a + b;

  return {
    simplifiedA,
    simplifiedB,
    ratioString: `${simplifiedA} : ${simplifiedB}`,
    shareAPercent: (a / total) * 100,
    shareBPercent: (b / total) * 100,
  };
}

export interface AverageInput {
  valuesString: string; // Comma-separated
}
export interface AverageResult {
  sum: number;
  count: number;
  average: number;
  min: number;
  max: number;
}

export function calculateAverage(input: AverageInput): AverageResult {
  const clean = input.valuesString || '0';
  const parts = clean.split(/[,;\s]+/).map(parseFloat).filter(n => !isNaN(n) && isFinite(n));
  if (parts.length === 0) {
    return { sum: 0, count: 0, average: 0, min: 0, max: 0 };
  }
  const sum = parts.reduce((s, x) => s + x, 0);
  const count = parts.length;
  return {
    sum,
    count,
    average: sum / count,
    min: Math.min(...parts),
    max: Math.max(...parts),
  };
}

export interface LcmGcdInput {
  valueA: number;
  valueB: number;
}
export interface LcmGcdResult {
  gcd: number;
  lcm: number;
}

export function calculateLcmGcd(input: LcmGcdInput): LcmGcdResult {
  const a = Math.max(1, Math.round(input.valueA));
  const b = Math.max(1, Math.round(input.valueB));

  const findGcd = (x: number, y: number): number => {
    while (y !== 0) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  };

  const gcd = findGcd(a, b);
  const lcm = (a * b) / gcd;

  return {
    gcd,
    lcm,
  };
}
