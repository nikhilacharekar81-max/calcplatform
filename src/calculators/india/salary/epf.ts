import Decimal from "decimal.js";

export function calculateEpfContribution(
  base: string | Decimal | number,
  employeeRate: string | Decimal | number,
  employerRate: string | Decimal | number
) {
  const b = new Decimal(base);
  const employee = b.mul(employeeRate).div(100);
  const employer = b.mul(employerRate).div(100);
  return {
    employee,
    employer,
    total: employee.plus(employer),
  };
}
