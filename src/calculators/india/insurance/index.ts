import Decimal from "decimal.js";

export function calculateInsuranceCoverMultiple(
  annualIncome: string | Decimal | number,
  multiple: string | Decimal | number
) {
  return new Decimal(annualIncome).mul(multiple);
}
