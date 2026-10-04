import Decimal from "decimal.js";

export function calculateProfessionalTax(
  taxableSalary: string | Decimal | number,
  applicableTax: string | Decimal | number
) {
  const salary = new Decimal(taxableSalary);
  const tax = Decimal.min(Decimal.max(new Decimal(applicableTax), 0), salary);
  return {
    tax,
    netSalaryAfterProfessionalTax: salary.minus(tax),
  };
}
