/**
 * USA jurisdiction layer extracted from the original Global Numerical & Financial Computation Engine v6.1.3.
 *
 * IMPORTANT: USA calculators remain here for backward compatibility.
 * Universal mathematical primitives are imported from ../../engines/financial-maths.
 */

import * as GlobalMath from "../../engines/financial-maths/index.ts";

const {
  ENGINE_VERSION,
  CalculationError,
  Money,
  assertFinite,
  assertNonNegative,
  assertPositive,
  assertInteger,
  nearlyZero,
  kahanSum,
  brent,
  pmt,
  pv,
  fv,
  nper,
  rate,
  npv,
  irr,
  xirr,
  mirr,
  periodsPerYear,
  toDate,
  dayCountFraction,
  generateAmortizationSchedule,
  mean,
  monteCarlo,
  bondPrice,
  bondYieldToMaturity,
  annuityPresentValue,
  annuityFutureValue,
  depreciation,
  progressiveTax,
  marginalTaxRate,
  vatFromNet,
  vatFromGross,
  salesTax,
  margin,
  markup,
  commission,
  houseAffordability,
  roi,
  mortgagePayoff,
  cashOrFinanceComparison,
  convertCurrency,
  inflationAdjustedFutureValue,
  compoundInterest,
} = GlobalMath;

type SolverResult = GlobalMath.SolverResult;
type Frequency = GlobalMath.Frequency;
type PaymentTiming = GlobalMath.PaymentTiming;
type AmortizationRow = GlobalMath.AmortizationRow;
type AmortizationResult = GlobalMath.AmortizationResult;
type TaxBracket = GlobalMath.TaxBracket;

export type USRegZUnitPeriod =
  | "DAY"
  | "WEEK"
  | "SEMIMONTH"
  | "MONTH"
  | "MONTHS_2"
  | "MONTHS_3"
  | "MONTHS_4"
  | "MONTHS_5"
  | "MONTHS_6"
  | "MONTHS_7"
  | "MONTHS_8"
  | "MONTHS_9"
  | "MONTHS_10"
  | "MONTHS_11"
  | "YEAR";

export interface USRegZFinanceChargeItem {
  amount: number;
  prepaid: boolean;
  description?: string;
}

export interface USRegZTransactionInput {
  creditExtended: number;
  prepaidFinanceCharges?: number;
  financeCharges?: readonly USRegZFinanceChargeItem[];
}

export interface USRegZAmountFinancedResult {
  creditExtended: number;
  prepaidFinanceCharges: number;
  amountFinanced: number;
}

export function calculateUSRegZAmountFinanced(
  input: USRegZTransactionInput
): USRegZAmountFinancedResult {
  assertNonNegative(input.creditExtended, "creditExtended");
  const explicit = input.prepaidFinanceCharges ?? 0;
  assertNonNegative(explicit, "prepaidFinanceCharges");

  const itemized = (input.financeCharges ?? [])
    .filter((item) => item.prepaid)
    .map((item) => {
      assertNonNegative(item.amount, `prepaid finance charge${item.description ? ` (${item.description})` : ""}`);
      return item.amount;
    });

  const itemizedTotal = kahanSum(itemized);
  if (itemized.length && Math.abs(itemizedTotal - explicit) > 1e-9) {
    throw new CalculationError(
      "REGZ_FINANCE_CHARGE_MISMATCH",
      "prepaidFinanceCharges must equal the sum of itemized prepaid finance charges."
    );
  }

  const prepaid = itemized.length ? itemizedTotal : explicit;
  if (prepaid > input.creditExtended) {
    throw new CalculationError("REGZ_AMOUNT_FINANCED", "Prepaid finance charges cannot exceed credit extended.");
  }

  return {
    creditExtended: input.creditExtended,
    prepaidFinanceCharges: prepaid,
    amountFinanced: input.creditExtended - prepaid
  };
}

export interface USRegZAPRPayment {
  date: Date | string;
  amount: number;
}

export interface USRegZActuarialAPRInput {
  amountFinanced: number;
  consummationDate: Date | string;
  payments: readonly USRegZAPRPayment[];
  unitPeriod?: USRegZUnitPeriod;
  tolerance?: number;
  maxIterations?: number;
}

export interface USRegZActuarialAPRResult extends SolverResult {
  annualPercentageRate: number;
  unitPeriod: USRegZUnitPeriod;
  unitPeriodsPerYear: number;
  amountFinanced: number;
}

function usRegZMonthsBetween(start: Date, end: Date): number {
  if (end < start) {
    throw new CalculationError("DATE_ORDER", "APR payment dates must be on or after consummationDate.");
  }
  let months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth());

  const candidate = GlobalMath.addMonths(start, months);
  if (candidate.getTime() > end.getTime()) months--;
  return Math.max(0, months);
}

function usRegZUnitPeriodsBetween(
  startValue: Date | string,
  endValue: Date | string,
  unitPeriod: USRegZUnitPeriod
): number {
  const start = toDate(startValue);
  const end = toDate(endValue);
  if (end < start) throw new CalculationError("DATE_ORDER", "APR dates must be ordered.");
  if (end.getTime() === start.getTime()) return 0;

  const days = (end.getTime() - start.getTime()) / 86400000;
  switch (unitPeriod) {
    case "DAY": return days;
    case "WEEK": return days / 7;
    case "SEMIMONTH": {
      const months = usRegZMonthsBetween(start, end);
      const anchor = GlobalMath.addMonths(start, months);
      const remainingDays = (end.getTime() - anchor.getTime()) / 86400000;
      return (months * 2) + remainingDays / 15;
    }
    case "MONTH": {
      const months = usRegZMonthsBetween(start, end);
      const anchor = GlobalMath.addMonths(start, months);
      const remainingDays = (end.getTime() - anchor.getTime()) / 86400000;
      return months + remainingDays / 30;
    }
    case "YEAR": {
      const months = usRegZMonthsBetween(start, end);
      const wholeYears = Math.floor(months / 12);
      const anchor = GlobalMath.addMonths(start, wholeYears * 12);
      const remainingMonths = usRegZMonthsBetween(anchor, end);
      const monthAnchor = GlobalMath.addMonths(anchor, remainingMonths);
      const remainingDays = (end.getTime() - monthAnchor.getTime()) / 86400000;
      return wholeYears + remainingMonths / 12 + remainingDays / 365;
    }
    default: {
      const match = /^MONTHS_(2|3|4|5|6|7|8|9|10|11)$/.exec(unitPeriod);
      if (!match) throw new CalculationError("REGZ_UNIT_PERIOD", `Unsupported unit period: ${unitPeriod}`);
      const monthsPerUnit = Number(match[1]);
      const months = usRegZMonthsBetween(start, end);
      const fullUnits = Math.floor(months / monthsPerUnit);
      const anchor = GlobalMath.addMonths(start, fullUnits * monthsPerUnit);
      const remainingDays = (end.getTime() - anchor.getTime()) / 86400000;
      return fullUnits + remainingDays / (30 * monthsPerUnit);
    }
  }
}

function usRegZPeriodsPerYear(unitPeriod: USRegZUnitPeriod): number {
  switch (unitPeriod) {
    case "DAY": return 365;
    case "WEEK": return 52;
    case "SEMIMONTH": return 24;
    case "MONTH": return 12;
    case "YEAR": return 1;
    default: return 12 / Number(unitPeriod.slice(7));
  }
}

export function calculateUSRegZActuarialAPR(
  input: USRegZActuarialAPRInput
): USRegZActuarialAPRResult {
  assertPositive(input.amountFinanced, "amountFinanced");
  if (!input.payments.length) throw new CalculationError("REGZ_PAYMENTS", "At least one payment is required.");

  const consummation = toDate(input.consummationDate);
  const payments = input.payments.map((payment) => {
    const date = toDate(payment.date);
    assertNonNegative(payment.amount, "payment amount");
    if (date <= consummation) {
      throw new CalculationError("REGZ_PAYMENT_DATE", "Payment dates must be after consummationDate.");
    }
    return { date, amount: payment.amount };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const unitPeriod = input.unitPeriod ?? "MONTH";
  const periodsPerYearValue = usRegZPeriodsPerYear(unitPeriod);
  const exponents = payments.map((payment) =>
    usRegZUnitPeriodsBetween(consummation, payment.date, unitPeriod)
  );

  const equation = (unitRate: number): number => {
    if (unitRate <= -1) return Number.POSITIVE_INFINITY;
    let sum = -input.amountFinanced;
    for (let i = 0; i < payments.length; i++) {
      sum += payments[i].amount / Math.pow(1 + unitRate, exponents[i]);
    }
    return sum;
  };

  const tolerance = input.tolerance ?? 1e-13;
  const maxIterations = input.maxIterations ?? 500;
  let lower = -0.999999999999;
  let upper = 1;
  let fLower = equation(lower);
  let fUpper = equation(upper);

  for (let i = 0; i < 64 && fLower * fUpper > 0; i++) {
    upper *= 2;
    fUpper = equation(upper);
    if (!Number.isFinite(fUpper)) break;
  }

  if (!Number.isFinite(fLower) || !Number.isFinite(fUpper) || fLower * fUpper > 0) {
    throw new CalculationError(
      "REGZ_NO_SOLUTION",
      "Could not bracket a unique actuarial APR solution for the supplied cash flows. " +
      "Check payment signs, amount financed, dates, and unit period."
    );
  }

  const solver = brent(equation, lower, upper, { tolerance, maxIterations });
  if (!solver.converged) {
    throw new CalculationError(
      "REGZ_APR_NO_CONVERGENCE",
      "Regulation Z actuarial APR iteration did not converge within the configured limit.",
      { iterations: solver.iterations, residual: solver.residual }
    );
  }

  const annualPercentageRate = solver.root * periodsPerYearValue;
  return {
    ...solver,
    annualPercentageRate,
    unitPeriod,
    unitPeriodsPerYear: periodsPerYearValue,
    amountFinanced: input.amountFinanced
  };
}

export function calculateUSRegZActuarialAPRFromTransaction(
  input: USRegZTransactionInput & Omit<USRegZActuarialAPRInput, "amountFinanced">
): USRegZActuarialAPRResult {
  const amount = calculateUSRegZAmountFinanced(input);
  return calculateUSRegZActuarialAPR({
    amountFinanced: amount.amountFinanced,
    consummationDate: input.consummationDate,
    payments: input.payments,
    unitPeriod: input.unitPeriod,
    tolerance: input.tolerance,
    maxIterations: input.maxIterations
  });
}

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualRate: number;
  termYears: number;
  propertyTaxAnnual?: number;
  homeInsuranceAnnual?: number;
  pmiAnnual?: number;
  hoaMonthly?: number;
  pointsPercent?: number;
  upfrontClosingCosts?: number;
  extraMonthlyPayment?: number;
  frequency?: Frequency;
}

export interface MortgageResult extends AmortizationResult {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  upfrontCosts: number;
  monthlyHousingPayment: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  ltv: number;
  totalHousingCost: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  assertNonNegative(input.homePrice, "homePrice");
  assertNonNegative(input.downPayment, "downPayment");

  if (input.downPayment > input.homePrice) {
    throw new CalculationError("DOWN_PAYMENT", "downPayment cannot exceed homePrice.");
  }

  const loanAmount = input.homePrice - input.downPayment;
  const points = loanAmount * (input.pointsPercent ?? 0) / 100;

  const extraPayment = input.extraMonthlyPayment ?? 0;
  const extraPayments =
    extraPayment > 0
      ? Array.from(
          { length: Math.ceil(input.termYears * 12) },
          (_, index) => ({
            period: index + 1,
            amount: extraPayment
          })
        )
      : [];

  const amortization = generateAmortizationSchedule({
    principal: loanAmount,
    annualRate: input.annualRate,
    term: input.termYears,
    termUnit: "YEARS",
    frequency: input.frequency ?? "MONTHLY",
    extraPayments
  });

  const monthlyPropertyTax = (input.propertyTaxAnnual ?? 0) / 12;
  const monthlyInsurance = (input.homeInsuranceAnnual ?? 0) / 12;
  const monthlyPMI = (input.pmiAnnual ?? 0) / 12;
  const monthlyHOA = input.hoaMonthly ?? 0;

  const monthlyHousingPayment =
    amortization.periodicPayment +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyPMI +
    monthlyHOA;

  const upfrontCosts = points + (input.upfrontClosingCosts ?? 0);

  return {
    ...amortization,
    homePrice: input.homePrice,
    downPayment: input.downPayment,
    loanAmount,
    upfrontCosts,
    monthlyHousingPayment,
    monthlyPrincipalAndInterest: amortization.periodicPayment,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    ltv: input.homePrice === 0 ? 0 : loanAmount / input.homePrice,
    totalHousingCost:
      amortization.totalPayments +
      12 * input.termYears *
        (monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA) +
      upfrontCosts
  };
}

export type USFilingStatus =
  | "SINGLE"
  | "MFJ"
  | "MFS"
  | "HOH"
  | "QSS";

export interface USFederalTaxRuleSet {
  taxYear: number;
  standardDeduction: Record<USFilingStatus, number>;
  ordinaryBrackets: Record<USFilingStatus, readonly TaxBracket[]>;
  additionalStandardDeductionAge65OrBlind: Record<USFilingStatus, number>;
  enhancedSeniorDeduction?: {
    amountPerEligiblePerson: number;
    phaseoutStartByStatus: Record<USFilingStatus, number>;
    phaseoutRate: number;
  };
  estateBasicExclusion: number;
  giftAnnualExclusionPerDonee: number;
}

export const US_FEDERAL_2026: USFederalTaxRuleSet = {
  taxYear: 2026,
  standardDeduction: {
    SINGLE: 16100,
    MFS: 16100,
    MFJ: 32200,
    QSS: 32200,
    HOH: 24150
  },
  ordinaryBrackets: {
    SINGLE: [
      { upTo: 12400, rate: 10 },
      { upTo: 50400, rate: 12 },
      { upTo: 105700, rate: 22 },
      { upTo: 201775, rate: 24 },
      { upTo: 256225, rate: 32 },
      { upTo: 640600, rate: 35 },
      { upTo: Infinity, rate: 37 }
    ],
    MFS: [
      { upTo: 12400, rate: 10 },
      { upTo: 50400, rate: 12 },
      { upTo: 105700, rate: 22 },
      { upTo: 201775, rate: 24 },
      { upTo: 256225, rate: 32 },
      { upTo: 320300, rate: 35 },
      { upTo: Infinity, rate: 37 }
    ],
    MFJ: [
      { upTo: 24800, rate: 10 },
      { upTo: 100800, rate: 12 },
      { upTo: 211400, rate: 22 },
      { upTo: 403550, rate: 24 },
      { upTo: 512450, rate: 32 },
      { upTo: 768700, rate: 35 },
      { upTo: Infinity, rate: 37 }
    ],
    QSS: [
      { upTo: 24800, rate: 10 },
      { upTo: 100800, rate: 12 },
      { upTo: 211400, rate: 22 },
      { upTo: 403550, rate: 24 },
      { upTo: 512450, rate: 32 },
      { upTo: 768700, rate: 35 },
      { upTo: Infinity, rate: 37 }
    ],
    HOH: [
      { upTo: 17700, rate: 10 },
      { upTo: 67450, rate: 12 },
      { upTo: 105700, rate: 22 },
      { upTo: 201750, rate: 24 },
      { upTo: 256200, rate: 32 },
      { upTo: 640600, rate: 35 },
      { upTo: Infinity, rate: 37 }
    ]
  },
  additionalStandardDeductionAge65OrBlind: {
    SINGLE: 2050,
    MFS: 1650,
    MFJ: 1650,
    QSS: 1650,
    HOH: 2050
  },
  enhancedSeniorDeduction: {
    amountPerEligiblePerson: 6000,
    phaseoutStartByStatus: {
      SINGLE: 75000, MFS: 75000, HOH: 75000, MFJ: 150000, QSS: 150000
    },
    phaseoutRate: 0.06
  },
  estateBasicExclusion: 15000000,
  giftAnnualExclusionPerDonee: 19000
};

export interface USPayrollRuleSet {
  taxYear: number;
  socialSecurityRate: number;
  medicareRate: number;
  socialSecurityWageBase: number;
  additionalMedicareRate: number;
  additionalMedicareThreshold: Record<USFilingStatus, number>;
}

export const US_PAYROLL_2026: USPayrollRuleSet = {
  taxYear: 2026,
  socialSecurityRate: 0.062,
  medicareRate: 0.0145,
  socialSecurityWageBase: 184500,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: {
    SINGLE: 200000,
    MFS: 125000,
    MFJ: 250000,
    QSS: 250000,
    HOH: 200000
  }
};

export interface USRetirementLimits {
  taxYear: number;
  iraContributionLimit: number;
  iraCatchUp50: number;
  k401ElectiveDeferral: number;
  k401CatchUp50: number;
  k401CatchUp60to63: number;
  k401AnnualAdditionsLimit: number;
  k401CompensationLimit: number;
  estateExclusion: number;
  giftAnnualExclusion: number;
}

export const US_RETIREMENT_2026: USRetirementLimits = {
  taxYear: 2026,
  iraContributionLimit: 7500,
  iraCatchUp50: 1100,
  k401ElectiveDeferral: 24500,
  k401CatchUp50: 8000,
  k401CatchUp60to63: 11250,
  k401AnnualAdditionsLimit: 72000,
  k401CompensationLimit: 360000,
  estateExclusion: 15000000,
  giftAnnualExclusion: 19000
};

function assertUSFilingStatus(status: USFilingStatus): void {
  if (!US_FEDERAL_2026.standardDeduction[status]) {
    throw new CalculationError("US_FILING_STATUS", `Unsupported U.S. filing status: ${status}`);
  }
}

function phaseoutLinear(
  amount: number,
  income: number,
  start: number,
  end: number
): number {
  if (amount <= 0) return 0;
  if (income <= start) return amount;
  if (income >= end) return 0;
  return amount * (end - income) / (end - start);
}

export interface USFederalIncomeTaxInput {
  filingStatus: USFilingStatus;
  grossIncome: number;
  adjustments?: number;
  itemizedDeductions?: number;
  useItemized?: boolean;
  age65Count?: number;
  blindCount?: number;
  eligibleSeniorDeductionCount?: number;
  additionalDeductions?: number;
  credits?: number;
  ruleSet?: USFederalTaxRuleSet;
}

export interface USFederalIncomeTaxResult {
  grossIncome: number;
  adjustedGrossIncome: number;
  deduction: number;
  taxableIncome: number;
  regularIncomeTax: number;
  credits: number;
  federalIncomeTax: number;
  effectiveRate: number;
  marginalRate: number;
}

export function calculateUSFederalIncomeTax(
  input: USFederalIncomeTaxInput
): USFederalIncomeTaxResult {
  const rules = input.ruleSet ?? US_FEDERAL_2026;
  assertUSFilingStatus(input.filingStatus);
  assertNonNegative(input.grossIncome, "grossIncome");
  assertNonNegative(input.adjustments ?? 0, "adjustments");
  assertNonNegative(input.itemizedDeductions ?? 0, "itemizedDeductions");
  assertNonNegative(input.additionalDeductions ?? 0, "additionalDeductions");
  assertNonNegative(input.credits ?? 0, "credits");

  const age65 = Math.max(0, Math.floor(input.age65Count ?? 0));
  const blind = Math.max(0, Math.floor(input.blindCount ?? 0));
  const seniorEligible = Math.max(0, Math.floor(input.eligibleSeniorDeductionCount ?? 0));

  const agi = Math.max(0, input.grossIncome - (input.adjustments ?? 0));
  const baseStandard = rules.standardDeduction[input.filingStatus];
  const additional =
    age65 * rules.additionalStandardDeductionAge65OrBlind[input.filingStatus] +
    blind * rules.additionalStandardDeductionAge65OrBlind[input.filingStatus];

  let deduction = input.useItemized
    ? Math.max(0, input.itemizedDeductions ?? 0)
    : baseStandard + additional;

  if (!input.useItemized && rules.enhancedSeniorDeduction && seniorEligible > 0) {
    const phaseoutStart = rules.enhancedSeniorDeduction.phaseoutStartByStatus[input.filingStatus];
    const phaseoutEnd = phaseoutStart +
      rules.enhancedSeniorDeduction.amountPerEligiblePerson /
      Math.max(1e-12, rules.enhancedSeniorDeduction.phaseoutRate);
    const perPerson = phaseoutLinear(
      rules.enhancedSeniorDeduction.amountPerEligiblePerson,
      agi,
      phaseoutStart,
      phaseoutEnd
    );
    deduction += perPerson * seniorEligible;
  }

  deduction += input.additionalDeductions ?? 0;
  const taxableIncome = Math.max(0, agi - deduction);
  const brackets = rules.ordinaryBrackets[input.filingStatus];
  const regularIncomeTax = progressiveTax(taxableIncome, brackets);
  const credits = Math.min(regularIncomeTax, input.credits ?? 0);
  const federalIncomeTax = Math.max(0, regularIncomeTax - credits);

  return {
    grossIncome: input.grossIncome,
    adjustedGrossIncome: agi,
    deduction,
    taxableIncome,
    regularIncomeTax,
    credits,
    federalIncomeTax,
    effectiveRate: input.grossIncome === 0 ? 0 : federalIncomeTax / input.grossIncome,
    marginalRate: taxableIncome === 0 ? 0 : marginalTaxRate(taxableIncome, brackets) / 100
  };
}

export interface USPayrollTaxInput {
  wages: number;
  filingStatus?: USFilingStatus;
  ruleSet?: USPayrollRuleSet;
}

export interface USPayrollTaxResult {
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  totalEmployeeFICA: number;
  employerSocialSecurity: number;
  employerMedicare: number;
  employerFICA: number;
}

export function calculateUSPayrollTaxes(
  input: USPayrollTaxInput
): USPayrollTaxResult {
  const rules = input.ruleSet ?? US_PAYROLL_2026;
  const status = input.filingStatus ?? "SINGLE";
  assertUSFilingStatus(status);
  assertNonNegative(input.wages, "wages");

  const socialSecurity = Math.min(input.wages, rules.socialSecurityWageBase) * rules.socialSecurityRate;
  const medicare = input.wages * rules.medicareRate;
  const additionalMedicare =
    Math.max(0, input.wages - rules.additionalMedicareThreshold[status]) *
    rules.additionalMedicareRate;
  const totalEmployeeFICA = socialSecurity + medicare + additionalMedicare;
  const employerSocialSecurity = socialSecurity;
  const employerMedicare = medicare;

  return {
    socialSecurity,
    medicare,
    additionalMedicare,
    totalEmployeeFICA,
    employerSocialSecurity,
    employerMedicare,
    employerFICA: employerSocialSecurity + employerMedicare
  };
}

export interface USTakeHomePayInput {
  annualGross: number;
  filingStatus: USFilingStatus;
  payPeriodsPerYear: number;
  pretaxDeductions?: number;
  postTaxDeductions?: number;
  federalCredits?: number;
  stateIncomeTax?: number;
  localIncomeTax?: number;
}

export interface USTakeHomePayResult {
  annualGross: number;
  taxableWagesForFederal: number;
  federalIncomeTax: number;
  employeeFICA: USPayrollTaxResult;
  stateIncomeTax: number;
  localIncomeTax: number;
  pretaxDeductions: number;
  postTaxDeductions: number;
  annualTakeHome: number;
  perPaycheckTakeHome: number;
}

export function calculateUSTakeHomePay(
  input: USTakeHomePayInput
): USTakeHomePayResult {
  assertNonNegative(input.annualGross, "annualGross");
  assertPositive(input.payPeriodsPerYear, "payPeriodsPerYear");
  assertNonNegative(input.pretaxDeductions ?? 0, "pretaxDeductions");
  assertNonNegative(input.postTaxDeductions ?? 0, "postTaxDeductions");
  assertNonNegative(input.stateIncomeTax ?? 0, "stateIncomeTax");
  assertNonNegative(input.localIncomeTax ?? 0, "localIncomeTax");

  const pretax = Math.min(input.annualGross, input.pretaxDeductions ?? 0);
  const federal = calculateUSFederalIncomeTax({
    filingStatus: input.filingStatus,
    grossIncome: Math.max(0, input.annualGross - pretax),
    credits: input.federalCredits ?? 0
  });
  const fica = calculateUSPayrollTaxes({
    wages: input.annualGross,
    filingStatus: input.filingStatus
  });
  const postTax = input.postTaxDeductions ?? 0;
  const state = input.stateIncomeTax ?? 0;
  const local = input.localIncomeTax ?? 0;
  const annualTakeHome = Math.max(
    0,
    input.annualGross - pretax - federal.federalIncomeTax - fica.totalEmployeeFICA - state - local - postTax
  );

  return {
    annualGross: input.annualGross,
    taxableWagesForFederal: Math.max(0, input.annualGross - pretax),
    federalIncomeTax: federal.federalIncomeTax,
    employeeFICA: fica,
    stateIncomeTax: state,
    localIncomeTax: local,
    pretaxDeductions: pretax,
    postTaxDeductions: postTax,
    annualTakeHome,
    perPaycheckTakeHome: annualTakeHome / input.payPeriodsPerYear
  };
}

export interface US401KProjectionInput {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualSalary: number;
  salaryGrowthRate?: number;
  employeeContributionRate: number;
  employerMatchRate?: number;
  employerMatchLimitPercent?: number;
  annualReturn: number;
  contributionFrequency?: Frequency;
  contributionTiming?: PaymentTiming;
  feesAnnual?: number;
  annualEmployeeLimit?: number;
  catchUp50?: number;
  catchUp60to63?: number;
  ruleSet?: USRetirementLimits;
}

export interface US401KProjectionYear {
  age: number;
  salary: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  investmentGrowth: number;
  fees: number;
  endingBalance: number;
}

export interface US401KProjectionResult {
  endingBalance: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalContributions: number;
  totalGrowth: number;
  totalFees: number;
  schedule: US401KProjectionYear[];
}

export function calculateUS401KProjection(
  input: US401KProjectionInput
): US401KProjectionResult {
  const rules = input.ruleSet ?? US_RETIREMENT_2026;
  assertInteger(input.currentAge, "currentAge");
  assertInteger(input.retirementAge, "retirementAge");
  if (input.retirementAge <= input.currentAge) {
    throw new CalculationError("AGE_ORDER", "retirementAge must exceed currentAge.");
  }
  assertNonNegative(input.currentBalance, "currentBalance");
  assertNonNegative(input.annualSalary, "annualSalary");
  assertNonNegative(input.employeeContributionRate, "employeeContributionRate");
  assertNonNegative(input.employerMatchRate ?? 0, "employerMatchRate");
  assertNonNegative(input.employerMatchLimitPercent ?? 0, "employerMatchLimitPercent");

  const employeeLimit = input.annualEmployeeLimit ?? rules.k401ElectiveDeferral;
  const catchUp50 = input.catchUp50 ?? rules.k401CatchUp50;
  const catchUp60to63 = input.catchUp60to63 ?? rules.k401CatchUp60to63;
  const matchLimit = input.employerMatchLimitPercent ?? 0;

  let balance = input.currentBalance;
  let salary = input.annualSalary;
  let totalEmployee = 0;
  let totalEmployer = 0;
  let totalGrowth = 0;
  let totalFees = 0;
  const schedule: US401KProjectionYear[] = [];

  for (let age = input.currentAge; age < input.retirementAge; age++) {
    const eligibleCatchUp = age >= 60 && age <= 63 ? catchUp60to63 : age >= 50 ? catchUp50 : 0;
    const desiredEmployee = salary * input.employeeContributionRate / 100;
    const regularEmployeeContribution = Math.min(desiredEmployee, employeeLimit, Math.min(salary, rules.k401AnnualAdditionsLimit));
    const desiredCatchUp = Math.max(0, desiredEmployee - regularEmployeeContribution);
    const catchUpContribution = Math.min(desiredCatchUp, eligibleCatchUp);
    const eligibleCompensation = Math.min(salary, rules.k401CompensationLimit);
    const matchableEmployeeContribution = matchLimit > 0
      ? Math.min(regularEmployeeContribution, eligibleCompensation * matchLimit / 100)
      : regularEmployeeContribution;
    const requestedEmployerContribution = matchableEmployeeContribution * (input.employerMatchRate ?? 0) / 100;
    const regularContributionRoom = Math.max(0, Math.min(salary, rules.k401AnnualAdditionsLimit) - regularEmployeeContribution);
    const employerContribution = Math.min(requestedEmployerContribution, regularContributionRoom);
    const employeeContribution = regularEmployeeContribution + catchUpContribution;
    const totalContribution = employeeContribution + employerContribution;
    const beginningContribution = input.contributionTiming === "BEGINNING" ? totalContribution : 0;
    const endingContribution = input.contributionTiming === "BEGINNING" ? 0 : totalContribution;
    const growth = (balance + beginningContribution) * input.annualReturn / 100;
    const fees = (balance + beginningContribution + endingContribution) * (input.feesAnnual ?? 0) / 100;
    balance += beginningContribution + growth - fees + endingContribution;

    totalEmployee += employeeContribution;
    totalEmployer += employerContribution;
    totalGrowth += growth;
    totalFees += fees;

    schedule.push({
      age,
      salary,
      employeeContribution,
      employerContribution,
      totalContribution,
      investmentGrowth: growth,
      fees,
      endingBalance: balance
    });

    salary *= 1 + (input.salaryGrowthRate ?? 0) / 100;
  }

  return {
    endingBalance: balance,
    totalEmployeeContributions: totalEmployee,
    totalEmployerContributions: totalEmployer,
    totalContributions: totalEmployee + totalEmployer,
    totalGrowth,
    totalFees,
    schedule
  };
}

export type USIRAStatus = "FULL" | "PARTIAL" | "NONE";

export interface USIRAPhaseoutRange {
  start: number;
  end: number;
}

export interface USIRAContributionResult {
  maximumContribution: number;
  status: USIRAStatus;
  phaseoutReduction: number;
  taxableCompensationLimit: number;
}

export function calculateUSIRARothContributionLimit(
  modifiedAGI: number,
  filingStatus: USFilingStatus,
  age: number,
  taxableCompensation: number
): USIRAContributionResult {
  assertNonNegative(modifiedAGI, "modifiedAGI");
  assertNonNegative(taxableCompensation, "taxableCompensation");
  const base = US_RETIREMENT_2026.iraContributionLimit + (age >= 50 ? US_RETIREMENT_2026.iraCatchUp50 : 0);
  let range: USIRAPhaseoutRange;

  if (filingStatus === "MFJ" || filingStatus === "QSS") range = { start: 242000, end: 252000 };
  else if (filingStatus === "MFS") range = { start: 0, end: 10000 };
  else range = { start: 153000, end: 168000 };

  const reductionBase = Math.max(0, modifiedAGI - range.start);
  const width = Math.max(1, range.end - range.start);
  const reduction = Math.min(base, base * reductionBase / width);
  const maxByIncome = Math.min(base, taxableCompensation);
  const maximumContribution = Math.max(0, maxByIncome - Math.min(maxByIncome, reduction));

  return {
    maximumContribution,
    status: maximumContribution <= 0 ? "NONE" : maximumContribution >= maxByIncome ? "FULL" : "PARTIAL",
    phaseoutReduction: Math.max(0, maxByIncome - maximumContribution),
    taxableCompensationLimit: taxableCompensation
  };
}

export interface USTraditionalIRADeductionResult {
  maximumContribution: number;
  deductibleContribution: number;
  status: USIRAStatus;
  phaseoutReduction: number;
}

export function calculateUSTraditionalIRADeduction(
  modifiedAGI: number,
  filingStatus: USFilingStatus,
  age: number,
  taxableCompensation: number,
  contributorCoveredByPlan: boolean,
  spouseCoveredByPlan = false
): USTraditionalIRADeductionResult {
  assertNonNegative(modifiedAGI, "modifiedAGI");
  assertNonNegative(taxableCompensation, "taxableCompensation");
  const maxContribution = Math.min(
    taxableCompensation,
    US_RETIREMENT_2026.iraContributionLimit + (age >= 50 ? US_RETIREMENT_2026.iraCatchUp50 : 0)
  );

  let start = 0;
  let end = 0;
  if (contributorCoveredByPlan) {
    if (filingStatus === "MFJ" || filingStatus === "QSS") { start = 129000; end = 149000; }
    else if (filingStatus === "MFS") { start = 0; end = 10000; }
    else { start = 81000; end = 91000; }
  } else if (spouseCoveredByPlan && (filingStatus === "MFJ" || filingStatus === "QSS")) {
    start = 242000;
    end = 252000;
  } else {
    return {
      maximumContribution: maxContribution,
      deductibleContribution: maxContribution,
      status: "FULL",
      phaseoutReduction: 0
    };
  }

  const deductible = phaseoutLinear(maxContribution, modifiedAGI, start, end);
  return {
    maximumContribution: maxContribution,
    deductibleContribution: deductible,
    status: deductible <= 0 ? "NONE" : deductible >= maxContribution ? "FULL" : "PARTIAL",
    phaseoutReduction: maxContribution - deductible
  };
}

const US_UNIFORM_LIFETIME_TABLE_2026: Record<number, number> = {
  72:27.4,73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,
  81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,88:13.7,89:12.9,
  90:12.2,91:11.5,92:10.8,93:10.1,94:9.5,95:8.9,96:8.4,97:7.8,98:7.3,
  99:6.8,100:6.4,101:6.0,102:5.6,103:5.2,104:4.9,105:4.6,106:4.3,107:4.1,
  108:3.9,109:3.7,110:3.5,111:3.4,112:3.3,113:3.1,114:3.0,115:2.9,116:2.8,
  117:2.7,118:2.5,119:2.3,120:2.0
};

export interface USRMDResult {
  age: number;
  priorYearEndBalance: number;
  distributionPeriod: number;
  rmd: number;
}

export function calculateUSRMD(
  age: number,
  priorYearEndBalance: number,
  customDistributionPeriod?: number
): USRMDResult {
  assertInteger(age, "age");
  assertNonNegative(priorYearEndBalance, "priorYearEndBalance");
  const distributionPeriod = customDistributionPeriod ?? US_UNIFORM_LIFETIME_TABLE_2026[Math.min(120, Math.max(72, age))];
  if (distributionPeriod === undefined || distributionPeriod <= 0) {
    throw new CalculationError("RMD_AGE", "RMD distribution period is unavailable for this age.");
  }
  return {
    age,
    priorYearEndBalance,
    distributionPeriod,
    rmd: priorYearEndBalance / distributionPeriod
  };
}

export function getUSRMDStartAge(birthYear: number): 72 | 73 | 75 {
  assertInteger(birthYear, "birthYear");
  if (birthYear < 1951) return 72;
  if (birthYear <= 1959) return 73;
  return 75;
}

export function calculateUSRMDForBirthYear(
  birthYear: number,
  age: number,
  priorYearEndBalance: number,
  customDistributionPeriod?: number
): USRMDResult {
  const startAge = getUSRMDStartAge(birthYear);
  if (age < startAge) {
    return { age, priorYearEndBalance, distributionPeriod: Infinity, rmd: 0 };
  }
  return calculateUSRMD(age, priorYearEndBalance, customDistributionPeriod);
}

export interface USSocialSecurityBenefitInput {
  primaryInsuranceAmountAtFRA: number;
  claimingAge: number;
  fullRetirementAge?: number;
  colaRate?: number;
  yearsToClaim?: number;
}

export interface USSocialSecurityBenefitResult {
  adjustedMonthlyBenefitAtClaim: number;
  annualBenefitAtClaim: number;
  adjustmentFactor: number;
}

export function calculateUSSocialSecurityBenefit(
  input: USSocialSecurityBenefitInput
): USSocialSecurityBenefitResult {
  assertNonNegative(input.primaryInsuranceAmountAtFRA, "primaryInsuranceAmountAtFRA");
  assertFinite(input.claimingAge, "claimingAge");
  const fra = input.fullRetirementAge ?? 67;
  const age = input.claimingAge;
  let adjustmentFactor: number;

  if (age === fra) adjustmentFactor = 1;
  else if (age < fra) {
    const monthsEarly = Math.max(0, Math.round((fra - age) * 12));
    const first36 = Math.min(monthsEarly, 36);
    const excess = Math.max(0, monthsEarly - 36);
    adjustmentFactor = 1 - first36 * (5 / 900) - excess * (5 / 1200);
  } else {
    const monthsDelayed = Math.min(36, Math.max(0, Math.round((age - fra) * 12)));
    adjustmentFactor = 1 + monthsDelayed * (2 / 300);
  }

  const cola = input.colaRate ?? 0;
  const years = Math.max(0, input.yearsToClaim ?? 0);
  const adjustedMonthlyBenefitAtClaim =
    input.primaryInsuranceAmountAtFRA * adjustmentFactor * Math.pow(1 + cola / 100, years);

  return {
    adjustedMonthlyBenefitAtClaim,
    annualBenefitAtClaim: adjustedMonthlyBenefitAtClaim * 12,
    adjustmentFactor
  };
}

export interface USMortgageEnhancedInput extends MortgageInput {
  closingCosts?: number;
  prepaidInterest?: number;
  prepaidEscrow?: number;
  pmiCancellationLTV?: number;
  mortgageInsuranceMonthly?: number;
  annualHomeAppreciation?: number;
  annualTaxGrowth?: number;
  annualInsuranceGrowth?: number;
}

export interface USMortgageEnhancedResult extends MortgageResult {
  totalCashToClose: number;
  estimatedClosingCosts: number;
  estimatedPrepaids: number;
  pmiCancellationPeriod?: number;
  projectedHomeValueAtPayoff: number;
  totalPMIPaid: number;
  pmiAutomaticTerminationPeriod?: number;
}

export function calculateUSMortgageEnhanced(
  input: USMortgageEnhancedInput
): USMortgageEnhancedResult {
  const base = calculateMortgage(input);
  const closingCosts = Math.max(0, input.closingCosts ?? input.upfrontClosingCosts ?? 0);
  const prepaids = Math.max(0, (input.prepaidInterest ?? 0) + (input.prepaidEscrow ?? 0));
  const totalCashToClose = input.downPayment + closingCosts + prepaids;
  const cancellationTarget = input.pmiCancellationLTV ?? 0.78;
  if (cancellationTarget <= 0 || cancellationTarget >= 1) {
    throw new CalculationError("PMI_LTV", "pmiCancellationLTV must be > 0 and < 1.");
  }
  let pmiCancellationPeriod: number | undefined;

  if ((input.pmiAnnual ?? input.mortgageInsuranceMonthly ?? 0) > 0) {
    const originalValueTarget = input.homePrice * cancellationTarget;
    const scheduledOnly = generateAmortizationSchedule({
      principal: base.principal,
      annualRate: input.annualRate,
      term: input.termYears,
      termUnit: "YEARS",
      frequency: "MONTHLY",
    });
    for (const row of scheduledOnly.rows) {
      if (row.endingBalance <= originalValueTarget + 1e-10) {
        pmiCancellationPeriod = row.period;
        break;
      }
    }
    if (pmiCancellationPeriod === undefined) {
      pmiCancellationPeriod = Math.floor(scheduledOnly.periods / 2) + 1;
    }
  }

  const pmiPerMonth = input.mortgageInsuranceMonthly ?? ((input.pmiAnnual ?? 0) / 12);
  const pmiMonths = pmiCancellationPeriod ?? base.payoffPeriod;
  const totalPMIPaid = pmiPerMonth * Math.min(pmiMonths, base.payoffPeriod);

  const projectedHomeValueAtPayoff =
    input.homePrice * Math.pow(1 + (input.annualHomeAppreciation ?? 0) / 100, base.payoffPeriod / 12);

  return {
    ...base,
    totalCashToClose,
    estimatedClosingCosts: closingCosts,
    estimatedPrepaids: prepaids,
    pmiCancellationPeriod,
    pmiAutomaticTerminationPeriod: pmiCancellationPeriod,
    projectedHomeValueAtPayoff,
    totalPMIPaid,
    totalHousingCost:
      base.totalHousingCost - base.monthlyPMI * 12 * input.termYears + totalPMIPaid
  };
}

export interface US2026AdditionalDeductionInput {
  filingStatus: USFilingStatus;
  modifiedAGI: number;
  qualifiedTips?: number;
  qualifiedOvertime?: number;
  qualifiedPassengerVehicleInterest?: number;
  enhancedSeniorDeductionCount?: number;
}

export interface US2026AdditionalDeductionResult {
  tipsDeduction: number;
  overtimeDeduction: number;
  vehicleInterestDeduction: number;
  seniorDeduction: number;
  totalAdditionalDeductions: number;
}

export function calculateUS2026AdditionalDeductions(
  input: US2026AdditionalDeductionInput
): US2026AdditionalDeductionResult {
  assertUSFilingStatus(input.filingStatus);
  assertNonNegative(input.modifiedAGI, "modifiedAGI");
  const joint = input.filingStatus === "MFJ" || input.filingStatus === "QSS";
  const tipsMax = 25000;
  const tips = Math.min(tipsMax, Math.max(0, input.qualifiedTips ?? 0));
  const tipsThreshold = joint ? 300000 : 150000;
  const tipsDeduction = Math.max(0, tips - Math.floor(Math.max(0, input.modifiedAGI - tipsThreshold) / 1000) * 100);

  const overtimeMax = joint ? 25000 : 12500;
  const overtime = Math.min(overtimeMax, Math.max(0, input.qualifiedOvertime ?? 0));
  const overtimeDeduction = Math.max(0, overtime - Math.floor(Math.max(0, input.modifiedAGI - tipsThreshold) / 1000) * 100);

  const vehicleMax = 10000;
  const vehicleThreshold = joint ? 200000 : 100000;
  const vehiclePhaseout = Math.max(0, input.modifiedAGI - vehicleThreshold);
  const vehiclePhaseoutUnits = Math.ceil(vehiclePhaseout / 1000);
  const vehicleDeduction = Math.max(
    0,
    Math.min(vehicleMax, Math.max(0, input.qualifiedPassengerVehicleInterest ?? 0))
      - vehiclePhaseoutUnits * 200
  );

  const seniorCount = Math.max(0, Math.floor(input.enhancedSeniorDeductionCount ?? 0));
  const seniorStart = joint ? 150000 : 75000;
  const seniorDeduction = phaseoutLinear(6000 * seniorCount, input.modifiedAGI, seniorStart, seniorStart + 100000);

  return {
    tipsDeduction,
    overtimeDeduction,
    vehicleInterestDeduction: vehicleDeduction,
    seniorDeduction,
    totalAdditionalDeductions: tipsDeduction + overtimeDeduction + vehicleDeduction + seniorDeduction
  };
}

export interface USAutoLoanInput {
  vehiclePrice: number;
  downPayment?: number;
  tradeInValue?: number;
  tradeInLoanBalance?: number;
  salesTaxRate?: number;
  titleRegistrationFees?: number;
  dealerFees?: number;
  financedFees?: number;
  annualRate: number;
  termMonths: number;
  extraMonthlyPayment?: number;
}

export interface USAutoLoanResult {
  taxablePurchasePrice: number;
  salesTax: number;
  negativeEquity: number;
  amountFinanced: number;
  monthlyPayment: number;
  totalInterest: number;
  totalOfPayments: number;
  totalCashDown: number;
}

export function calculateUSAutoLoan(input: USAutoLoanInput): USAutoLoanResult {
  assertNonNegative(input.vehiclePrice, "vehiclePrice");
  assertNonNegative(input.downPayment ?? 0, "downPayment");
  assertNonNegative(input.tradeInValue ?? 0, "tradeInValue");
  assertNonNegative(input.tradeInLoanBalance ?? 0, "tradeInLoanBalance");
  assertNonNegative(input.salesTaxRate ?? 0, "salesTaxRate");
  assertNonNegative(input.titleRegistrationFees ?? 0, "titleRegistrationFees");
  assertNonNegative(input.dealerFees ?? 0, "dealerFees");
  assertNonNegative(input.financedFees ?? 0, "financedFees");

  const tradeInValue = input.tradeInValue ?? 0;
  const tradeLoan = input.tradeInLoanBalance ?? 0;
  const negativeEquity = Math.max(0, tradeLoan - tradeInValue);
  const taxablePurchasePrice = Math.max(0, input.vehiclePrice - tradeInValue);
  const salesTax = taxablePurchasePrice * (input.salesTaxRate ?? 0) / 100;
  const amountFinanced = Math.max(
    0,
    input.vehiclePrice - (input.downPayment ?? 0) - tradeInValue + negativeEquity + salesTax + (input.titleRegistrationFees ?? 0) + (input.dealerFees ?? 0) + (input.financedFees ?? 0)
  );
  const payment = Math.abs(pmt(input.annualRate / 100 / 12, input.termMonths, amountFinanced));
  const schedule = generateAmortizationSchedule({
    principal: amountFinanced,
    annualRate: input.annualRate,
    term: input.termMonths,
    termUnit: "MONTHS",
    frequency: "MONTHLY",
    extraPayments: input.extraMonthlyPayment && input.extraMonthlyPayment > 0
      ? Array.from({ length: input.termMonths }, (_, i) => ({ period: i + 1, amount: input.extraMonthlyPayment! }))
      : []
  });

  return {
    taxablePurchasePrice,
    salesTax,
    negativeEquity,
    amountFinanced,
    monthlyPayment: payment,
    totalInterest: schedule.totalInterest,
    totalOfPayments: schedule.totalPayments,
    totalCashDown: input.downPayment ?? 0
  };
}

export interface USCreditCardInput {
  balance: number;
  apr: number;
  monthlyPayment: number;
  monthlyFee?: number;
  annualFee?: number;
  newMonthlyCharges?: number;
  minimumPaymentPercent?: number;
  minimumPaymentFloor?: number;
  maxMonths?: number;
}

export interface USCreditCardResult {
  months: number;
  totalPayments: number;
  totalInterest: number;
  totalFees: number;
  payoffPossible: boolean;
  schedule: Array<{
    month: number;
    beginningBalance: number;
    interest: number;
    fees: number;
    payment: number;
    charges: number;
    endingBalance: number;
  }>;
}

export function calculateUSCreditCardPayoff(input: USCreditCardInput): USCreditCardResult {
  assertNonNegative(input.balance, "balance");
  assertNonNegative(input.monthlyPayment, "monthlyPayment");
  assertNonNegative(input.monthlyFee ?? 0, "monthlyFee");
  assertNonNegative(input.annualFee ?? 0, "annualFee");
  assertNonNegative(input.newMonthlyCharges ?? 0, "newMonthlyCharges");
  assertPositive(input.maxMonths ?? 1200, "maxMonths");

  let balance = input.balance;
  let totalPayments = 0;
  let totalInterest = 0;
  let totalFees = 0;
  const schedule: USCreditCardResult["schedule"] = [];
  const monthlyRate = input.apr / 100 / 12;
  const maxMonths = Math.floor(input.maxMonths ?? 1200);

  for (let month = 1; month <= maxMonths && balance > 1e-10; month++) {
    const beginningBalance = balance;
    const interest = balance * monthlyRate;
    const fees = (input.monthlyFee ?? 0) + (month % 12 === 1 ? (input.annualFee ?? 0) : 0);
    const charges = input.newMonthlyCharges ?? 0;
    balance += interest + fees + charges;

    const minimum = Math.max(
      input.minimumPaymentFloor ?? 0,
      balance * (input.minimumPaymentPercent ?? 0) / 100
    );
    const payment = Math.min(balance, Math.max(input.monthlyPayment, minimum));
    balance -= payment;

    totalPayments += payment;
    totalInterest += interest;
    totalFees += fees;

    schedule.push({ month, beginningBalance, interest, fees, payment, charges, endingBalance: Math.max(0, balance) });
  }

  return {
    months: schedule.length,
    totalPayments,
    totalInterest,
    totalFees,
    payoffPossible: balance <= 1e-10,
    schedule
  };
}

export interface USDebtPayoffInput {
  debts: Array<{
    name?: string;
    balance: number;
    apr: number;
    minimumPayment: number;
  }>;
  extraMonthlyPayment: number;
  strategy?: "AVALANCHE" | "SNOWBALL";
}

export interface USDebtPayoffResult {
  months: number;
  totalInterest: number;
  totalPayments: number;
  order: string[];
  schedule: Array<{ month: number; totalBalance: number; interest: number; payments: number }>;
}

export function calculateUSDebtPayoff(input: USDebtPayoffInput): USDebtPayoffResult {
  if (!input.debts.length) throw new CalculationError("DEBTS", "At least one debt is required.");
  assertNonNegative(input.extraMonthlyPayment, "extraMonthlyPayment");

  const debts = input.debts.map((d, i) => ({
    name: d.name ?? `Debt ${i + 1}`,
    balance: d.balance,
    apr: d.apr,
    minimumPayment: d.minimumPayment
  }));
  for (const d of debts) {
    assertNonNegative(d.balance, `${d.name}.balance`);
    assertNonNegative(d.minimumPayment, `${d.name}.minimumPayment`);
    assertFinite(d.apr, `${d.name}.apr`);
  }

  let extra = input.extraMonthlyPayment;
  let month = 0;
  let totalInterest = 0;
  let totalPayments = 0;
  const order: string[] = [];
  const schedule: USDebtPayoffResult["schedule"] = [];

  while (debts.some(d => d.balance > 1e-8) && month < 2400) {
    month++;
    let monthInterest = 0;
    let monthPayments = 0;

    for (const d of debts) {
      if (d.balance <= 0) continue;
      const interest = d.balance * d.apr / 100 / 12;
      d.balance += interest;
      monthInterest += interest;
    }

    const activeBeforePayment = debts.filter(d => d.balance > 1e-8);
    const ranked = [...activeBeforePayment].sort((a, b) => {
      if ((input.strategy ?? "AVALANCHE") === "SNOWBALL") return a.balance - b.balance;
      return b.apr - a.apr;
    });
    const target = ranked[0];

    const newlyPaidOff: typeof debts = [];
    for (const d of debts) {
      if (d.balance <= 0) continue;
      const payment = Math.min(d.balance, d.minimumPayment + (d === target ? extra : 0));
      d.balance -= payment;
      monthPayments += payment;
      if (d.balance <= 1e-8 && !order.includes(d.name)) {
        order.push(d.name);
        newlyPaidOff.push(d);
      }
    }

    if (newlyPaidOff.length > 0) {
      extra += newlyPaidOff.reduce((sum, d) => sum + d.minimumPayment, 0);
    }

    totalInterest += monthInterest;
    totalPayments += monthPayments;
    schedule.push({
      month,
      totalBalance: debts.reduce((s, d) => s + Math.max(0, d.balance), 0),
      interest: monthInterest,
      payments: monthPayments
    });
  }

  return { months: month, totalInterest, totalPayments, order, schedule };
}

export interface USStudentLoanInput {
  principal: number;
  annualRate: number;
  termMonths: number;
  accruedInterest?: number;
  capitalizedInterest?: number;
  extraMonthlyPayment?: number;
  paymentOverride?: number;
}

export function calculateUSStudentLoan(input: USStudentLoanInput): AmortizationResult {
  const principal = input.principal + (input.capitalizedInterest ?? 0) + (input.accruedInterest ?? 0);
  const payment = input.paymentOverride ?? Math.abs(pmt(input.annualRate / 100 / 12, input.termMonths, principal));
  const extra = input.extraMonthlyPayment ?? 0;
  return generateAmortizationSchedule({
    principal,
    annualRate: input.annualRate,
    term: input.termMonths,
    termUnit: "MONTHS",
    frequency: "MONTHLY",
    paymentOverride: payment,
    extraPayments: extra > 0
      ? Array.from({ length: input.termMonths }, (_, i) => ({ period: i + 1, amount: extra }))
      : []
  });
}

export interface USCDInput {
  principal: number;
  annualAPY?: number;
  annualRate?: number;
  termMonths: number;
  compounding?: Frequency;
  earlyWithdrawalPenalty?: number;
}

export interface USCDResult {
  futureValue: number;
  interestEarned: number;
  penalty: number;
  maturityValueAfterPenalty: number;
}

export function calculateUSCD(input: USCDInput): USCDResult {
  assertNonNegative(input.principal, "principal");
  assertPositive(input.termMonths, "termMonths");
  const frequency = input.compounding ?? "MONTHLY";
  const periods = periodsPerYear(frequency);
  const years = input.termMonths / 12;
  let futureValue: number;

  if (input.annualAPY !== undefined) {
    futureValue = input.principal * Math.pow(1 + input.annualAPY / 100, years);
  } else {
    const nominal = input.annualRate ?? 0;
    futureValue = input.principal * Math.pow(1 + nominal / 100 / periods, years * periods);
  }

  const interestEarned = futureValue - input.principal;
  const penalty = Math.max(0, input.earlyWithdrawalPenalty ?? 0);
  return {
    futureValue,
    interestEarned,
    penalty,
    maturityValueAfterPenalty: Math.max(0, futureValue - penalty)
  };
}

export interface USAnnuityInput {
  presentValue?: number;
  futureValue?: number;
  payment?: number;
  rate: number;
  periods: number;
  paymentTiming?: PaymentTiming;
}

export function calculateUSAnnuityPayment(input: USAnnuityInput): number {
  const pv0 = input.presentValue ?? 0;
  const fv0 = input.futureValue ?? 0;
  const payment = pmt(input.rate, input.periods, pv0, fv0, input.paymentTiming === "BEGINNING" ? 1 : 0);
  return Math.abs(payment);
}

export interface USLeaseInput {
  capitalizedCost: number;
  residualValue: number;
  moneyFactor: number;
  termMonths: number;
  acquisitionFee?: number;
  downPayment?: number;
  salesTaxRate?: number;
}

export interface USLeaseResult {
  depreciationCharge: number;
  financeCharge: number;
  baseMonthlyPayment: number;
  salesTaxMonthly: number;
  totalMonthlyPayment: number;
  totalLeaseCost: number;
}

export function calculateUSLease(input: USLeaseInput): USLeaseResult {
  assertNonNegative(input.capitalizedCost, "capitalizedCost");
  assertNonNegative(input.residualValue, "residualValue");
  assertNonNegative(input.moneyFactor, "moneyFactor");
  assertPositive(input.termMonths, "termMonths");
  const adjustedCapCost = Math.max(0, input.capitalizedCost + (input.acquisitionFee ?? 0) - (input.downPayment ?? 0));
  const depreciationCharge = Math.max(0, adjustedCapCost - input.residualValue) / input.termMonths;
  const financeCharge = (adjustedCapCost + input.residualValue) * input.moneyFactor;
  const baseMonthlyPayment = depreciationCharge + financeCharge;
  const salesTaxMonthly = baseMonthlyPayment * (input.salesTaxRate ?? 0) / 100;
  const totalMonthlyPayment = baseMonthlyPayment + salesTaxMonthly;
  return {
    depreciationCharge,
    financeCharge,
    baseMonthlyPayment,
    salesTaxMonthly,
    totalMonthlyPayment,
    totalLeaseCost: totalMonthlyPayment * input.termMonths + (input.downPayment ?? 0)
  };
}

export interface USRentVsBuyInput {
  homePrice: number;
  downPayment: number;
  mortgageRate: number;
  mortgageTermYears: number;
  annualPropertyTax: number;
  annualInsurance: number;
  annualMaintenanceRate: number;
  annualHomeAppreciation: number;
  monthlyRent: number;
  annualRentGrowth: number;
  investmentReturn: number;
  years: number;
  sellingCostRate?: number;
}

export interface USRentVsBuyResult {
  buyCashFlow: number;
  rentCashFlow: number;
  futureHomeValue: number;
  futureMortgageBalance: number;
  netSaleProceeds: number;
  investmentValueOfDownPayment: number;
  buyAdvantageExcludingTaxes: number;
}

export function calculateUSRentVsBuy(input: USRentVsBuyInput): USRentVsBuyResult {
  const mortgage = generateAmortizationSchedule({
    principal: Math.max(0, input.homePrice - input.downPayment),
    annualRate: input.mortgageRate,
    term: input.mortgageTermYears,
    termUnit: "YEARS",
    frequency: "MONTHLY"
  });
  const months = Math.min(mortgage.rows.length, Math.max(1, Math.round(input.years * 12)));
  const row = mortgage.rows[months - 1];
  let rentTotal = 0;
  let rent = input.monthlyRent;
  for (let year = 0; year < Math.ceil(input.years); year++) {
    rentTotal += rent * 12;
    rent *= 1 + input.annualRentGrowth / 100;
  }
  let buyTotal = 0;
  for (let i = 0; i < months; i++) {
    const r = mortgage.rows[i];
    buyTotal += r.scheduledPayment + input.annualPropertyTax / 12 + input.annualInsurance / 12 + input.homePrice * input.annualMaintenanceRate / 100 / 12;
  }
  const futureHomeValue = input.homePrice * Math.pow(1 + input.annualHomeAppreciation / 100, input.years);
  const futureMortgageBalance = row?.endingBalance ?? 0;
  const netSaleProceeds = futureHomeValue * (1 - (input.sellingCostRate ?? 0) / 100) - futureMortgageBalance;
  const investmentValueOfDownPayment = input.downPayment * Math.pow(1 + input.investmentReturn / 100, input.years);
  return {
    buyCashFlow: buyTotal,
    rentCashFlow: rentTotal,
    futureHomeValue,
    futureMortgageBalance,
    netSaleProceeds,
    investmentValueOfDownPayment,
    buyAdvantageExcludingTaxes: netSaleProceeds - investmentValueOfDownPayment - (buyTotal - rentTotal)
  };
}

export interface USHELOCInput {
  initialBalance: number;
  annualRate: number;
  drawAmount?: number;
  drawPeriodMonths?: number;
  repaymentMonths: number;
  extraPayment?: number;
}

export interface USHELOCResult {
  initialPayment: number;
  totalInterest: number;
  totalPayments: number;
  schedule: AmortizationResult;
}

export function calculateUSHELOC(input: USHELOCInput): USHELOCResult {
  assertNonNegative(input.initialBalance, "initialBalance");
  assertFinite(input.annualRate, "annualRate");
  assertNonNegative(input.drawAmount ?? 0, "drawAmount");
  assertInteger(input.drawPeriodMonths ?? 0, "drawPeriodMonths");
  assertPositive(input.repaymentMonths, "repaymentMonths");
  const drawMonths = Math.max(0, input.drawPeriodMonths ?? 0);
  const totalDraw = input.drawAmount ?? 0;
  const monthlyRate = input.annualRate / 100 / 12;
  if (monthlyRate <= -1) throw new CalculationError("INVALID_RATE", "HELOC monthly rate must be > -100%.");

  const drawRows: AmortizationRow[] = [];
  let balance = input.initialBalance;
  let totalInterest = 0;
  let totalPayments = 0;
  for (let i = 1; i <= drawMonths; i++) {
    const draw = drawMonths > 0 ? totalDraw / drawMonths : 0;
    balance += draw;
    const interest = balance * monthlyRate;
    const payment = Math.max(0, interest);
    totalInterest += interest;
    totalPayments += payment;
    drawRows.push({
      period: i,
      beginningBalance: balance - draw,
      scheduledPayment: payment,
      extraPayment: 0,
      interest,
      principal: -draw,
      endingBalance: balance,
      cumulativeInterest: totalInterest,
      cumulativePrincipal: drawRows.reduce((sum, r) => sum + r.principal, 0) - draw,
      negativeAmortization: draw > 0
    });
  }

  const repayment = generateAmortizationSchedule({
    principal: balance,
    annualRate: input.annualRate,
    term: input.repaymentMonths,
    termUnit: "MONTHS",
    frequency: "MONTHLY",
    extraPayments: input.extraPayment && input.extraPayment > 0
      ? Array.from({ length: input.repaymentMonths }, (_, i) => ({ period: i + 1, amount: input.extraPayment! }))
      : []
  });

  const offsetRows = repayment.rows.map((row) => ({
    ...row,
    period: row.period + drawMonths,
    cumulativeInterest: totalInterest + row.cumulativeInterest,
    cumulativePrincipal: drawRows.reduce((sum, r) => sum + r.principal, 0) + row.cumulativePrincipal
  }));

  return {
    initialPayment: repayment.periodicPayment,
    totalInterest: totalInterest + repayment.totalInterest,
    totalPayments: totalPayments + repayment.totalPayments,
    schedule: {
      ...repayment,
      principal: input.initialBalance + totalDraw,
      totalInterest: totalInterest + repayment.totalInterest,
      totalPayments: totalPayments + repayment.totalPayments,
      totalPrincipal: input.initialBalance + totalDraw,
      rows: [...drawRows, ...offsetRows],
      payoffPeriod: drawMonths + repayment.payoffPeriod,
      payoffDate: offsetRows.length ? offsetRows[offsetRows.length - 1].date : undefined
    }
  };
}

export interface USDownPaymentInput {
  homePrice: number;
  targetPercent: number;
  currentSavings: number;
  monthlySavings: number;
  annualSavingsRate: number;
  closingCostsPercent?: number;
  otherCashNeeded?: number;
}

export function calculateUSDownPayment(input: USDownPaymentInput): {
  targetDownPayment: number;
  totalCashTarget: number;
  shortfall: number;
  monthsToTarget: number;
} {
  const targetDownPayment = input.homePrice * input.targetPercent / 100;
  const closingCosts = input.homePrice * (input.closingCostsPercent ?? 0) / 100;
  const totalCashTarget = targetDownPayment + closingCosts + (input.otherCashNeeded ?? 0);
  assertNonNegative(input.homePrice, "homePrice");
  assertNonNegative(input.targetPercent, "targetPercent");
  assertNonNegative(input.currentSavings, "currentSavings");
  assertNonNegative(input.monthlySavings, "monthlySavings");
  assertFinite(input.annualSavingsRate, "annualSavingsRate");
  const shortfall = Math.max(0, totalCashTarget - input.currentSavings);
  if (shortfall === 0) return { targetDownPayment, totalCashTarget, shortfall, monthsToTarget: 0 };
  const monthlyRate = input.annualSavingsRate / 100 / 12;
  if (monthlyRate <= -1) throw new CalculationError("INVALID_SAVINGS_RATE", "Monthly savings rate must be > -100%.");
  const futureValueAt = (months: number): number => {
    const growth = Math.pow(1 + monthlyRate, months);
    const contributionFV = nearlyZero(monthlyRate)
      ? input.monthlySavings * months
      : input.monthlySavings * ((growth - 1) / monthlyRate);
    return input.currentSavings * growth + contributionFV;
  };
  if (input.monthlySavings === 0 && futureValueAt(12000) < totalCashTarget) {
    return { targetDownPayment, totalCashTarget, shortfall, monthsToTarget: Infinity };
  }
  let low = 0;
  let high = 1;
  while (high < 12000 && futureValueAt(high) < totalCashTarget) high *= 2;
  if (futureValueAt(high) < totalCashTarget) {
    return { targetDownPayment, totalCashTarget, shortfall, monthsToTarget: Infinity };
  }
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (futureValueAt(mid) >= totalCashTarget) high = mid;
    else low = mid + 1;
  }
  return { targetDownPayment, totalCashTarget, shortfall, monthsToTarget: low };
}

export interface USRentalPropertyInput {
  purchasePrice: number;
  downPayment: number;
  mortgageRate: number;
  mortgageTermYears: number;
  monthlyRent: number;
  vacancyRate?: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  annualMaintenanceRate?: number;
  annualManagementRate?: number;
  monthlyHOA?: number;
  annualAppreciation?: number;
  sellingCostRate?: number;
}

export interface USRentalPropertyResult {
  monthlyMortgage: number;
  effectiveMonthlyRent: number;
  annualNOI: number;
  annualDebtService: number;
  annualCashFlowBeforeTax: number;
  capRate: number;
  cashOnCashReturn: number;
  projectedValueAfterOneYear: number;
}

export function calculateUSRentalProperty(input: USRentalPropertyInput): USRentalPropertyResult {
  const mortgage = generateAmortizationSchedule({
    principal: input.purchasePrice - input.downPayment,
    annualRate: input.mortgageRate,
    term: input.mortgageTermYears,
    termUnit: "YEARS",
    frequency: "MONTHLY"
  });
  const effectiveMonthlyRent = input.monthlyRent * (1 - (input.vacancyRate ?? 0) / 100);
  const annualOperatingExpenses =
    (input.annualPropertyTax ?? 0) +
    (input.annualInsurance ?? 0) +
    input.purchasePrice * (input.annualMaintenanceRate ?? 0) / 100 +
    effectiveMonthlyRent * 12 * (input.annualManagementRate ?? 0) / 100 +
    (input.monthlyHOA ?? 0) * 12;
  const annualNOI = effectiveMonthlyRent * 12 - annualOperatingExpenses;
  const annualDebtService = mortgage.periodicPayment * 12;
  const annualCashFlowBeforeTax = annualNOI - annualDebtService;
  const capRate = input.purchasePrice === 0 ? 0 : annualNOI / input.purchasePrice;
  const cashOnCashReturn = input.downPayment === 0 ? 0 : annualCashFlowBeforeTax / input.downPayment;
  return {
    monthlyMortgage: mortgage.periodicPayment,
    effectiveMonthlyRent,
    annualNOI,
    annualDebtService,
    annualCashFlowBeforeTax,
    capRate,
    cashOnCashReturn,
    projectedValueAfterOneYear: input.purchasePrice * (1 + (input.annualAppreciation ?? 0) / 100)
  };
}

export interface USDebtToIncomeExtendedInput {
  grossMonthlyIncome: number;
  housingPayment: number;
  recurringDebtPayments: number;
  proposedLoanPayment?: number;
}

export function calculateUSDebtToIncomeExtended(input: USDebtToIncomeExtendedInput): {
  frontEndDTI: number;
  backEndDTI: number;
  totalWithProposedLoanDTI: number;
} {
  assertPositive(input.grossMonthlyIncome, "grossMonthlyIncome");
  const front = input.housingPayment / input.grossMonthlyIncome;
  const back = (input.housingPayment + input.recurringDebtPayments) / input.grossMonthlyIncome;
  const proposed = (input.housingPayment + input.recurringDebtPayments + (input.proposedLoanPayment ?? 0)) / input.grossMonthlyIncome;
  return { frontEndDTI: front, backEndDTI: back, totalWithProposedLoanDTI: proposed };
}

export interface USRefinanceInput {
  currentBalance: number;
  currentRate: number;
  remainingMonths: number;
  newRate: number;
  newTermMonths: number;
  closingCosts: number;
  points?: number;
  cashFlowSavingsAppliedToPrincipal?: boolean;
}

export interface USRefinanceResult {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  currentRemainingInterest: number;
  newInterest: number;
  interestSavingsBeforeCosts: number;
  netSavingsAfterCosts: number;
}

export function calculateUSRefinance(input: USRefinanceInput): USRefinanceResult {
  const current = generateAmortizationSchedule({
    principal: input.currentBalance,
    annualRate: input.currentRate,
    term: input.remainingMonths,
    termUnit: "MONTHS",
    frequency: "MONTHLY"
  });
  const newLoan = generateAmortizationSchedule({
    principal: input.currentBalance,
    annualRate: input.newRate,
    term: input.newTermMonths,
    termUnit: "MONTHS",
    frequency: "MONTHLY"
  });
  const points = input.currentBalance * (input.points ?? 0) / 100;
  const costs = input.closingCosts + points;
  const monthlySavings = current.periodicPayment - newLoan.periodicPayment;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(costs / monthlySavings) : Infinity;
  return {
    currentPayment: current.periodicPayment,
    newPayment: newLoan.periodicPayment,
    monthlySavings,
    breakEvenMonths,
    currentRemainingInterest: current.totalInterest,
    newInterest: newLoan.totalInterest,
    interestSavingsBeforeCosts: current.totalInterest - newLoan.totalInterest,
    netSavingsAfterCosts: current.totalInterest - newLoan.totalInterest - costs
  };
}

export interface USAPRInput {
  amountFinanced: number;
  cashFlows: readonly { period: number; amount: number }[];
  periodsPerYear?: number;
}

export function calculateUSAPRFromCashFlows(input: USAPRInput): SolverResult {
  assertPositive(input.amountFinanced, "amountFinanced");
  if (!input.cashFlows.length) throw new CalculationError("APR_CASH_FLOWS", "At least one cash flow is required.");
  const periodsPerYearValue = input.periodsPerYear ?? 12;
  assertPositive(periodsPerYearValue, "periodsPerYear");
  const flows = [
    { period: 0, amount: -input.amountFinanced },
    ...input.cashFlows.map((f, index) => {
      assertFinite(f.period, `cashFlows[${index}].period`);
      if (f.period < 0) throw new CalculationError("APR_PERIOD", `cashFlows[${index}].period must be >= 0.`);
      assertFinite(f.amount, `cashFlows[${index}].amount`);
      return { period: f.period, amount: f.amount };
    })
  ];
  if (!flows.some((f) => f.amount > 0)) throw new CalculationError("APR_SIGN", "At least one positive cash flow is required.");
  const fn = (periodicRate: number): number => flows.reduce(
    (sum, f) => sum + f.amount / Math.pow(1 + periodicRate, f.period),
    0
  );
  let upper = 0.1;
  let lower = -0.999999999;
  let fLower = fn(lower);
  let fUpper = fn(upper);
  for (let i = 0; i < 80 && fLower * fUpper > 0; i++) {
    upper = Math.min(1e6, upper * 2);
    fUpper = fn(upper);
  }
  if (fLower * fUpper > 0) {
    throw new CalculationError("APR_NO_BRACKET", "Unable to bracket an APR root in the supported rate domain.");
  }
  const solver = brent(fn, lower, upper, { tolerance: 1e-12, maxIterations: 300 });
  return {
    ...solver,
    root: solver.root * periodsPerYearValue,
    residual: fn(solver.root)
  };
}

export interface USHELOCInterestOnlyInput {
  balance: number;
  annualRate: number;
  months: number;
}

export function calculateUSHELOCInterestOnly(input: USHELOCInterestOnlyInput): {
  monthlyInterest: number;
  totalInterest: number;
  annualizedInterestRate: number;
} {
  assertNonNegative(input.balance, "balance");
  assertPositive(input.months, "months");
  const monthlyInterest = input.balance * input.annualRate / 100 / 12;
  return {
    monthlyInterest,
    totalInterest: monthlyInterest * input.months,
    annualizedInterestRate: input.annualRate / 100
  };
}

export interface USCurrencyConversionResult {
  convertedAmount: number;
  rate: number;
  inverseRate: number;
}

export function calculateUSCurrencyConversion(
  amount: number,
  rate: number
): USCurrencyConversionResult {
  assertFinite(amount, "amount");
  assertPositive(rate, "rate");
  return { convertedAmount: amount * rate, rate, inverseRate: 1 / rate };
}

export interface USInflationResult {
  futureValue: number;
  presentValue: number;
  cumulativeInflation: number;
  annualInflationRate: number;
}

export function calculateUSInflation(
  amount: number,
  annualInflationRate: number,
  years: number
): USInflationResult {
  assertNonNegative(amount, "amount");
  assertFinite(annualInflationRate, "annualInflationRate");
  assertNonNegative(years, "years");
  const factor = Math.pow(1 + annualInflationRate / 100, years);
  return {
    futureValue: amount * factor,
    presentValue: amount / factor,
    cumulativeInflation: factor - 1,
    annualInflationRate: annualInflationRate / 100
  };
}

export interface USPercentOffResult {
  discountAmount: number;
  finalPrice: number;
  effectiveDiscountRate: number;
}

export function calculateUSPercentOff(price: number, percentOff: number): USPercentOffResult {
  assertNonNegative(price, "price");
  assertNonNegative(percentOff, "percentOff");
  const discountAmount = price * percentOff / 100;
  return { discountAmount, finalPrice: Math.max(0, price - discountAmount), effectiveDiscountRate: percentOff / 100 };
}

export interface USCommissionResult {
  commission: number;
  totalCompensation: number;
}

export function calculateUSCommission(
  sales: number,
  commissionRate: number,
  baseSalary = 0,
  quota = 0
): USCommissionResult {
  assertNonNegative(sales, "sales");
  assertNonNegative(commissionRate, "commissionRate");
  const commissionableSales = Math.max(0, sales - quota);
  const commission = commissionableSales * commissionRate / 100;
  return { commission, totalCompensation: baseSalary + commission };
}

export interface USMarriageTaxComparisonInput {
  spouse1Income: number;
  spouse2Income: number;
  spouse1Adjustments?: number;
  spouse2Adjustments?: number;
  spouse1Credits?: number;
  spouse2Credits?: number;
}

export interface USMarriageTaxComparisonResult {
  combinedIncome: number;
  marriedFilingJointlyTax: number;
  singleTaxesCombined: number;
  marriageTaxDifference: number;
}

export function calculateUSMarriageTaxComparison(
  input: USMarriageTaxComparisonInput
): USMarriageTaxComparisonResult {
  const s1 = calculateUSFederalIncomeTax({
    filingStatus: "SINGLE",
    grossIncome: input.spouse1Income,
    adjustments: input.spouse1Adjustments,
    credits: input.spouse1Credits
  });
  const s2 = calculateUSFederalIncomeTax({
    filingStatus: "SINGLE",
    grossIncome: input.spouse2Income,
    adjustments: input.spouse2Adjustments,
    credits: input.spouse2Credits
  });
  const joint = calculateUSFederalIncomeTax({
    filingStatus: "MFJ",
    grossIncome: input.spouse1Income + input.spouse2Income,
    adjustments: (input.spouse1Adjustments ?? 0) + (input.spouse2Adjustments ?? 0),
    credits: (input.spouse1Credits ?? 0) + (input.spouse2Credits ?? 0)
  });
  const singles = s1.federalIncomeTax + s2.federalIncomeTax;
  return {
    combinedIncome: input.spouse1Income + input.spouse2Income,
    marriedFilingJointlyTax: joint.federalIncomeTax,
    singleTaxesCombined: singles,
    marriageTaxDifference: joint.federalIncomeTax - singles
  };
}

export interface USEstateTaxInput {
  grossEstate: number;
  deductions?: number;
  adjustedTaxableGifts?: number;
  priorTaxableGifts?: number;
  exemption?: number;
}

export interface USEstateTaxResult {
  taxableEstate: number;
  tentativeTaxBase: number;
  estimatedEstateTax: number;
  netEstateAfterTax: number;
}

export function calculateUSEstateTax(input: USEstateTaxInput): USEstateTaxResult {
  assertNonNegative(input.grossEstate, "grossEstate");
  assertNonNegative(input.deductions ?? 0, "deductions");
  assertNonNegative(input.adjustedTaxableGifts ?? 0, "adjustedTaxableGifts");
  const exemption = input.exemption ?? US_RETIREMENT_2026.estateExclusion;
  const taxableEstate = Math.max(0, input.grossEstate - (input.deductions ?? 0));
  const tentativeTaxBase = Math.max(0, taxableEstate + (input.adjustedTaxableGifts ?? 0) - exemption);
  const estimatedEstateTax = tentativeTaxBase * 0.40;
  return {
    taxableEstate,
    tentativeTaxBase,
    estimatedEstateTax,
    netEstateAfterTax: Math.max(0, input.grossEstate - estimatedEstateTax)
  };
}

export interface USPaybackResult {
  paybackPeriods: number;
  discountedPaybackPeriods: number;
  recovered: boolean;
}

export function calculateUSPayback(
  initialInvestment: number,
  cashFlows: readonly number[],
  discountRate = 0
): USPaybackResult {
  assertNonNegative(initialInvestment, "initialInvestment");
  assertFinite(discountRate, "discountRate");
  if (discountRate <= -100) throw new CalculationError("INVALID_DISCOUNT_RATE", "discountRate must be > -100%.");
  let cumulative = 0;
  let discounted = 0;
  let payback = Infinity;
  let discountedPayback = Infinity;
  for (let i = 0; i < cashFlows.length; i++) {
    const cf = cashFlows[i];
    assertFinite(cf, `cashFlows[${i}]`);
    cumulative += cf;
    discounted += cf / Math.pow(1 + discountRate / 100, i + 1);
    if (payback === Infinity && cumulative >= initialInvestment) {
      payback = (i + 1) - (cumulative - initialInvestment) / Math.max(Math.abs(cf), 1e-12);
      if (cf < 0) payback = Infinity;
    }
    if (discountedPayback === Infinity && discounted >= initialInvestment) {
      discountedPayback = (i + 1) - (discounted - initialInvestment) / Math.max(Math.abs(cf / Math.pow(1 + discountRate / 100, i + 1)), 1e-12);
      if (cf < 0) discountedPayback = Infinity;
    }
  }
  return { paybackPeriods: payback, discountedPaybackPeriods: discountedPayback, recovered: Number.isFinite(payback) };
}

export const USA_RULE_SNAPSHOT_METADATA = Object.freeze({
  taxYear: 2026,
  engineVersion: ENGINE_VERSION,
  federalTaxSource: "IRS 2026 inflation adjustments / Revenue Procedure 2025-32",
  retirementSource: "IRS Notice 2025-67 / 2026 retirement limits",
  rmdSource: "IRS Publication 590-B / Uniform Lifetime Table",
  socialSecuritySource: "SSA 2026 COLA and contribution/base information",
  aprSource: "CFPB Regulation Z Appendix J"
});

export const USA_CALCULATOR_ENGINE_CAPABILITIES = Object.freeze({
  "mortgage-calculator": ["calculateUSMortgageEnhanced", "generateAmortizationSchedule", "pmt"],
  "loan-calculator": ["generateAmortizationSchedule", "pmt", "rate", "nper"],
  "auto-loan-calculator": ["calculateUSAutoLoan", "generateAmortizationSchedule"],
  "interest-calculator": ["compoundInterest", "pmt", "fv", "pv"],
  "payment-calculator": ["pmt", "generateAmortizationSchedule"],
  "retirement-calculator": ["calculateRetirement", "calculateUSSocialSecurityBenefit", "calculateUSRMD", "monteCarlo"],
  "amortization-calculator": ["generateAmortizationSchedule"],
  "investment-calculator": ["calculateInvestment", "irr", "xirr", "monteCarlo"],
  "currency-calculator": ["calculateUSCurrencyConversion", "convertCurrency"],
  "inflation-calculator": ["calculateUSInflation", "inflationAdjustedFutureValue"],
  "finance-calculator": ["pmt", "pv", "fv", "npv", "irr", "xirr", "mirr"],
  "mortgage-payoff-calculator": ["mortgagePayoff", "generateAmortizationSchedule"],
  "income-tax-calculator": ["calculateUSFederalIncomeTax", "calculateUSPayrollTaxes"],
  "compound-interest-calculator": ["compoundInterest", "calculateInvestment"],
  "salary-calculator": ["calculateUSTakeHomePay", "calculateUSPayrollTaxes"],
  "401k-calculator": ["calculateUS401KProjection"],
  "interest-rate-calculator": ["rate", "irr", "xirr"],
  "sales-tax-calculator": ["salesTax", "vatFromGross"],
  "house-affordability-calculator": ["houseAffordability", "calculateUSDebtToIncomeExtended"],
  "savings-calculator": ["calculateInvestment", "calculateUSDownPayment"],
  "rent-calculator": ["calculateUSInflation", "calculateUSRentVsBuy"],
  "marriage-tax-calculator": ["calculateUSMarriageTaxComparison"],
  "estate-tax-calculator": ["calculateUSEstateTax"],
  "pension-calculator": ["annuityPresentValue", "annuityFutureValue"],
  "social-security-calculator": ["calculateUSSocialSecurityBenefit"],
  "annuity-calculator": ["calculateUSAnnuityPayment", "annuityPresentValue", "annuityFutureValue"],
  "annuity-payout-calculator": ["calculateUSAnnuityPayment"],
  "credit-card-calculator": ["calculateUSCreditCardPayoff"],
  "credit-cards-payoff-calculator": ["calculateUSCreditCardPayoff"],
  "debt-payoff-calculator": ["calculateUSDebtPayoff"],
  "debt-consolidation-calculator": ["calculateUSDebtPayoff", "calculateUSRefinance"],
  "repayment-calculator": ["generateAmortizationSchedule"],
  "student-loan-calculator": ["calculateUSStudentLoan"],
  "cd-calculator": ["calculateUSCD"],
  "bond-calculator": ["bondPrice", "bondYieldToMaturity"],
  "mutual-fund-calculator": ["calculateInvestment", "roi"],
  "roth-ira-calculator": ["calculateUSIRARothContributionLimit", "calculateInvestment"],
  "ira-calculator": ["calculateUSTraditionalIRADeduction", "calculateInvestment"],
  "rmd-calculator": ["calculateUSRMD", "calculateUSRMDForBirthYear", "getUSRMDStartAge"],
  "vat-calculator": ["vatFromNet", "vatFromGross"],
  "cash-back-or-low-interest-calculator": ["cashOrFinanceComparison"],
  "auto-lease-calculator": ["calculateUSLease"],
  "depreciation-calculator": ["depreciation"],
  "average-return-calculator": ["mean", "irr", "xirr"],
  "margin-calculator": ["margin", "markup"],
  "debt-to-income-ratio-calculator": ["calculateUSDebtToIncomeExtended"],
  "real-estate-calculator": ["calculateUSRentalProperty", "calculateUSMortgageEnhanced"],
  "take-home-paycheck-calculator": ["calculateUSTakeHomePay"],
  "personal-loan-calculator": ["generateAmortizationSchedule"],
  "boat-loan-calculator": ["generateAmortizationSchedule"],
  "lease-calculator": ["calculateUSLease"],
  "refinance-calculator": ["calculateUSRefinance"],
  "budget-calculator": ["calculateUSTakeHomePay", "kahanSum"],
  "rental-property-calculator": ["calculateUSRentalProperty"],
  "irr-calculator": ["irr", "xirr", "mirr"],
  "roi-calculator": ["roi"],
  "apr-calculator": ["calculateUSAPRFromCashFlows"],
  "home-equity-loan-calculator": ["generateAmortizationSchedule"],
  "heloc-calculator": ["calculateUSHELOC", "calculateUSHELOCInterestOnly"],
  "down-payment-calculator": ["calculateUSDownPayment"],
  "rent-vs-buy-calculator": ["calculateUSRentVsBuy"],
  "payback-period-calculator": ["calculateUSPayback"],
  "present-value-calculator": ["pv"],
  "future-value-calculator": ["fv"],
  "commission-calculator": ["calculateUSCommission"],
  "percent-off-calculator": ["calculateUSPercentOff"]
} as const);

export function getUSCalculatorCapabilities(slug: string): readonly string[] {
  return (USA_CALCULATOR_ENGINE_CAPABILITIES as Record<string, readonly string[]>)[slug] ?? [];
}

export function runUSRegressionSuite(): {
  passed: number;
  failed: number;
  failures: string[];
} {
  const failures: string[] = [];
  const check = (name: string, condition: boolean): void => {
    if (!condition) failures.push(name);
  };

  try {
    check("Money fixed scale", Money.from("123.45").toNumber() === 123.45);
    check("Money addition", Money.from("1.25").add(Money.from("2.75")).toNumber() === 4);
    check("2026 single standard deduction", US_FEDERAL_2026.standardDeduction.SINGLE === 16100);
    check("2026 401k limit", US_RETIREMENT_2026.k401ElectiveDeferral === 24500);
    check("2026 401k annual additions", US_RETIREMENT_2026.k401AnnualAdditionsLimit === 72000);
    check("2026 IRA limit", US_RETIREMENT_2026.iraContributionLimit === 7500);
    check("2026 SS wage base", US_PAYROLL_2026.socialSecurityWageBase === 184500);
    check("2026 RMD age 73 denominator", calculateUSRMD(73, 26500).distributionPeriod === 26.5);
    check("Mortgage payment positive", calculateUSMortgageEnhanced({ homePrice: 400000, downPayment: 80000, annualRate: 6, termYears: 30 }).monthlyPrincipalAndInterest > 0);
    check("Federal tax nonnegative", calculateUSFederalIncomeTax({ filingStatus: "SINGLE", grossIncome: 100000 }).federalIncomeTax >= 0);
    check("FICA wage cap", calculateUSPayrollTaxes({ wages: 1000000 }).socialSecurity === 184500 * 0.062);
    check("APR solver", Math.abs(calculateUSAPRFromCashFlows({ amountFinanced: 1000, cashFlows: [{ period: 1, amount: 1000 }], periodsPerYear: 12 }).root) < 1e-12);
    const regzAmount = calculateUSRegZAmountFinanced({
      creditExtended: 1000,
      prepaidFinanceCharges: 50
    });
    check("Reg Z amount financed subtracts prepaid charges", regzAmount.amountFinanced === 950);
    const regzApr = calculateUSRegZActuarialAPR({
      amountFinanced: 950,
      consummationDate: "2026-01-01",
      payments: [{ date: "2026-02-01", amount: 1000 }],
      unitPeriod: "MONTH"
    });
    check("Reg Z actuarial APR includes prepaid finance charge", regzApr.annualPercentageRate > 0);
    const pmi = calculateUSMortgageEnhanced({
      homePrice: 400000,
      downPayment: 40000,
      annualRate: 6,
      termYears: 30,
      pmiAnnual: 4800
    });
    check("PMI termination uses original value", (pmi.pmiAutomaticTerminationPeriod ?? Infinity) < 360);
    check("PMI total is finite", Number.isFinite(pmi.totalPMIPaid));
    check("Money cents conversion", Money.from("123.456").toCents() === 12346n);
    const zeroLoan = generateAmortizationSchedule({ principal: 1000, annualRate: 0, term: 12, termUnit: "PERIODS", frequency: "MONTHLY" });
    check("Zero-rate loan pays exact principal", Math.abs(zeroLoan.totalPrincipal - 1000) < 1e-10);
    const negativeLoan = generateAmortizationSchedule({ principal: 1000, annualRate: -1, term: 12, termUnit: "PERIODS", frequency: "MONTHLY" });
    check("Negative-rate loan supported", negativeLoan.totalPrincipal > 999);
    const leapFraction = dayCountFraction("2024-02-29", "2025-02-28", "ACTUAL_ACTUAL");
    check("Leap-year day count is exact-year-aware", Math.abs(leapFraction - (307 / 366 + 58 / 365)) < 1e-12);
    const fortyYear = generateAmortizationSchedule({ principal: 100000, annualRate: 6, term: 40, termUnit: "YEARS", frequency: "MONTHLY" });
    check("40-year mortgage has 480 periods", fortyYear.periods === 480);
    const weekly = generateAmortizationSchedule({ principal: 1000, annualRate: 0, term: 52, termUnit: "PERIODS", frequency: "WEEKLY" });
    check("Weekly zero-rate loan", Math.abs(weekly.totalPrincipal - 1000) < 1e-8);
    const drift = generateAmortizationSchedule({ principal: 400000, annualRate: 6, term: 30, termUnit: "YEARS", frequency: "MONTHLY", settlementRounding: { mode: "HALF_UP", scale: 2 } });
    check("360-period principal settles exactly", Math.abs(drift.totalPrincipal - 400000) < 1e-9);
    check("Rounded rows reconcile principal", Math.abs(drift.rows.reduce((sum, row) => sum + row.principal, 0) - 400000) < 1e-9);
    check("Rounded rows reconcile payments", Math.abs(drift.rows.reduce((sum, row) => sum + row.scheduledPayment + row.extraPayment, 0) - drift.totalPayments) < 1e-7);
    const pmiExtra = calculateUSMortgageEnhanced({ homePrice: 400000, downPayment: 40000, annualRate: 6, termYears: 30, pmiAnnual: 4800, extraMonthlyPayment: 200 });
    const pmiScheduled = calculateUSMortgageEnhanced({ homePrice: 400000, downPayment: 40000, annualRate: 6, termYears: 30, pmiAnnual: 4800 });
    check("PMI automatic termination ignores extra payments", pmiExtra.pmiAutomaticTerminationPeriod === pmiScheduled.pmiAutomaticTerminationPeriod);
    check("Vehicle phaseout uses $200 per $1,000", calculateUS2026AdditionalDeductions({ filingStatus: "SINGLE", modifiedAGI: 101000, qualifiedPassengerVehicleInterest: 10000 }).vehicleInterestDeduction === 9800);
    check("Date parser rejects ambiguous locale strings", (() => { try { toDate("01/02/2026"); return false; } catch (e: any) { return e instanceof CalculationError && e.code === "AMBIGUOUS_DATE"; } })());
    check("Date parser accepts ISO date", toDate("2026-02-01").toISOString().startsWith("2026-02-01"));
    check("Down payment compounds existing savings", calculateUSDownPayment({ homePrice: 20000, targetPercent: 100, currentSavings: 10000, monthlySavings: 0, annualSavingsRate: 12 }).monthsToTarget === 70);
    check("RMD birth-year start age", getUSRMDStartAge(1960) === 75);
    check("Payback rejects discount rate <= -100%", (() => { try { calculateUSPayback(100, [100], -100); return false; } catch (e: any) { return e instanceof CalculationError && e.code === "INVALID_DISCOUNT_RATE"; } })());
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  const totalChecks = 32;
  return { passed: totalChecks - failures.length, failed: failures.length, failures };
}
