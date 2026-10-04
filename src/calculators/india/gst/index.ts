import Decimal from "decimal.js";

export interface GstInput {
  taxableValue: string | Decimal | number;
  rate: string | Decimal | number;
}

export interface GstResult {
  cgst: Decimal;
  sgst: Decimal;
  igst: Decimal;
  totalTax: Decimal;
  total: Decimal;
}

export function calculateGst(input: GstInput, interState = false): GstResult {
  const value = new Decimal(input.taxableValue);
  const rate = new Decimal(input.rate).div(100);
  const totalTax = value.mul(rate);
  const cgst = interState ? new Decimal(0) : totalTax.div(2);
  const sgst = interState ? new Decimal(0) : totalTax.div(2);
  const igst = interState ? totalTax : new Decimal(0);
  return {
    cgst,
    sgst,
    igst,
    totalTax,
    total: value.plus(totalTax)
  };
}
