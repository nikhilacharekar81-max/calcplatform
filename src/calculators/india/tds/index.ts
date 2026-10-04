import Decimal from "decimal.js";

export function calculateTds(
  base: string | Decimal | number,
  rate: string | Decimal | number
): { tds: Decimal; net: Decimal } {
  const b = new Decimal(base);
  const tds = b.mul(rate).div(100);
  return { tds, net: b.minus(tds) };
}
