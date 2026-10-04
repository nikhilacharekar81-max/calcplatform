/** Indian display formatting only. It does not change numerical values. */
export function formatIndianNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) throw new Error("Value must be finite.");
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatIndianCurrency(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) throw new Error("Value must be finite.");
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}
