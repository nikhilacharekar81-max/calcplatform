export interface MarginInput {
  revenue: number;
  cost: number;
}
export interface MarginResult {
  grossProfit: number;
  marginPercent: number;
}

export function calculateMargin(input: MarginInput): MarginResult {
  const rev = Math.max(0, input.revenue);
  const cost = Math.max(0, input.cost);
  const grossProfit = rev - cost;
  const marginPercent = rev > 0 ? (grossProfit / rev) * 100 : 0;
  return {
    grossProfit,
    marginPercent,
  };
}

export interface MarkupInput {
  cost: number;
  markupPercent: number;
}
export interface MarkupResult {
  sellingPrice: number;
  grossProfit: number;
}

export function calculateMarkup(input: MarkupInput): MarkupResult {
  const cost = Math.max(0, input.cost);
  const mark = Math.max(0, input.markupPercent) / 100;
  const grossProfit = cost * mark;
  const sellingPrice = cost + grossProfit;
  return {
    sellingPrice,
    grossProfit,
  };
}

export interface BreakEvenInput {
  fixedCosts: number;
  sellingPricePerUnit: number;
  variableCostPerUnit: number;
}
export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenSales: number;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fixed = Math.max(0, input.fixedCosts);
  const price = Math.max(0, input.sellingPricePerUnit);
  const variable = Math.max(0, input.variableCostPerUnit);

  const marginPerUnit = price - variable;
  const breakEvenUnits = marginPerUnit > 0 ? fixed / marginPerUnit : 0;
  const breakEvenSales = breakEvenUnits * price;

  return {
    breakEvenUnits: Math.ceil(breakEvenUnits),
    breakEvenSales,
  };
}

export interface RoiInput {
  amountInvested: number;
  amountReturned: number;
}
export interface RoiResult {
  gain: number;
  roiPercent: number;
}

export function calculateRoi(input: RoiInput): RoiResult {
  const invested = Math.max(0, input.amountInvested);
  const returned = Math.max(0, input.amountReturned);
  const gain = returned - invested;
  const roiPercent = invested > 0 ? (gain / invested) * 100 : 0;
  return {
    gain,
    roiPercent,
  };
}
