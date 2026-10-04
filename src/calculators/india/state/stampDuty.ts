import Decimal from "decimal.js";

export function calculateStampDuty(
  propertyValue: string | Decimal | number,
  rate: string | Decimal | number,
  registrationRate: string | Decimal | number = "0"
) {
  const value = new Decimal(propertyValue);
  const stampDuty = value.mul(rate).div(100);
  const registration = value.mul(registrationRate).div(100);
  return {
    stampDuty,
    registration,
    totalGovernmentCharges: stampDuty.plus(registration),
  };
}
