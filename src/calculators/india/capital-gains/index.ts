import Decimal from "decimal.js";

export interface CapitalGainInput {
  saleValue: string | Decimal | number;
  cost: string | Decimal | number;
  rate: string | Decimal | number;
}

export function calculateCapitalGain(input: CapitalGainInput) {
  const gain = new Decimal(input.saleValue).minus(input.cost);
  const taxableGain = Decimal.max(gain, 0);
  const tax = taxableGain.mul(input.rate).div(100);
  return {
    gain,
    taxableGain,
    tax,
    netGain: gain.minus(tax),
  };
}
