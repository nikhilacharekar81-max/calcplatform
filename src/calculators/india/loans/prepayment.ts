/**
 * Loan part-prepayment calculator.
 *
 * The lump sum is paid after `prepaymentAfterMonths` EMIs, so it reduces the OUTSTANDING balance at that
 * time (not the original principal). Two strategies:
 *  - reduce_tenure: keep the EMI, finish earlier (last EMI is the smaller residual amount)
 *  - reduce_emi:    keep the remaining tenure, lower the EMI
 */
export type PrepaymentStrategy = "reduce_tenure" | "reduce_emi";

export interface PrepaymentInput {
  principal: number;
  annualRatePercent: number;
  tenureMonths: number;
  prepaymentAmount: number;
  /** Number of EMIs already paid when the lump sum is paid (0 = at disbursal). */
  prepaymentAfterMonths: number;
  strategy: PrepaymentStrategy;
}

export interface PrepaymentResult {
  originalEmi: number;
  paidMonthsBeforePrepayment: number;
  outstandingBeforePrepayment: number;
  prepaymentApplied: number;
  principalAfterPrepayment: number;
  newEmi: number;
  remainingMonthsOriginal: number;
  remainingMonthsNew: number;
  totalMonthsNew: number;
  originalTotalPayment: number;
  newTotalPayment: number;
  interestSaved: number;
  monthsSaved: number;
}

function emiFor(p: number, r: number, n: number): number {
  if (n <= 0 || p <= 0) return 0;
  if (r === 0) return p / n;
  const g = Math.pow(1 + r, n);
  return (p * r * g) / (g - 1);
}

function balanceAfter(p: number, r: number, emi: number, k: number): number {
  if (k <= 0) return p;
  if (r === 0) return Math.max(0, p - emi * k);
  const g = Math.pow(1 + r, k);
  return Math.max(0, p * g - (emi * (g - 1)) / r);
}

export function calculatePrepayment(input: PrepaymentInput): PrepaymentResult {
  const n = Math.max(1, Math.round(input.tenureMonths));
  const r = Math.max(0, input.annualRatePercent) / 12 / 100;
  const principal = Math.max(0, input.principal);
  const emi = emiFor(principal, r, n);
  const k = Math.min(n - 1, Math.max(0, Math.floor(input.prepaymentAfterMonths || 0)));

  const outstanding = balanceAfter(principal, r, emi, k);
  const applied = Math.min(Math.max(0, input.prepaymentAmount), outstanding);
  const newPrincipal = Math.max(0, outstanding - applied);
  const remainingOriginal = n - k;
  const originalTotalPayment = emi * n;

  let newEmi = emi;
  let remainingNew = remainingOriginal;
  let remainingPayments = emi * remainingOriginal;

  if (newPrincipal <= 0) {
    newEmi = 0;
    remainingNew = 0;
    remainingPayments = 0;
  } else if (input.strategy === "reduce_emi") {
    newEmi = emiFor(newPrincipal, r, remainingOriginal);
    remainingPayments = newEmi * remainingOriginal;
  } else if (r === 0) {
    remainingNew = Math.ceil(newPrincipal / emi - 1e-9);
    remainingPayments = newPrincipal;
  } else {
    const exact = -Math.log(1 - (newPrincipal * r) / emi) / Math.log(1 + r);
    remainingNew = Math.max(1, Math.ceil(exact - 1e-9));
    const balBeforeLast = balanceAfter(newPrincipal, r, emi, remainingNew - 1);
    remainingPayments = emi * (remainingNew - 1) + balBeforeLast * (1 + r);
  }

  const newTotalPayment = emi * k + applied + remainingPayments;
  return {
    originalEmi: emi,
    paidMonthsBeforePrepayment: k,
    outstandingBeforePrepayment: outstanding,
    prepaymentApplied: applied,
    principalAfterPrepayment: newPrincipal,
    newEmi,
    remainingMonthsOriginal: remainingOriginal,
    remainingMonthsNew: remainingNew,
    totalMonthsNew: k + remainingNew,
    originalTotalPayment,
    newTotalPayment,
    interestSaved: Math.max(0, originalTotalPayment - newTotalPayment),
    monthsSaved: Math.max(0, remainingOriginal - remainingNew),
  };
}
