import Decimal from "decimal.js";

export function calculatePropertyValue(
  area: string | Decimal | number,
  ratePerUnit: string | Decimal | number
) {
  return new Decimal(area).mul(ratePerUnit);
}
