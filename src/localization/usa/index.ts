export function formatUSCurrency(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) throw new Error("Value must be finite.");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatUSNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) throw new Error("Value must be finite.");
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}
