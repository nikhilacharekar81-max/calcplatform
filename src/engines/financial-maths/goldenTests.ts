/**
 * Financial Mathematics Engine — Golden Test Suite
 * Independent Mathematical Verifications for Core Numerical Primitives
 */

import {
  percentToDecimal,
  decimalToPercent,
  nominalToPeriodicRate,
  effectiveToPeriodicRate,
  nominalToEffectiveRate,
  effectiveToNominalRate,
  continuousToEffectiveRate,
  effectiveToContinuousRate,
  calculateRealRate,
  realReturn,
  annuityPV,
  annuityFV,
  annuityPresentValue,
  annuityFutureValue,
  growingAnnuityPV,
  growingAnnuityFV,
  discountedCashFlow,
  calculateInflationAdjustedCashFlowsPV,
  inflationAdjustedFutureValue,
  presentValueOfInflationAdjustedFuture,
  compoundInterest,
  roundMoney,
  houseAffordability,
  mortgagePayoff,
  refinanceComparison,
  cashOrFinanceComparison,
  depreciation,
  progressiveTax,
  vatFromNet,
  vatFromGross,
  commission,
} from './index.ts';
import { calculatorEngineRegistry } from '../calculatorEngineRegistry.ts';

export interface GoldenTestCase {
  id: string;
  category: string;
  description: string;
  inputs: Record<string, any>;
  expected: number;
  actual: number;
  tolerance: number;
  pass: boolean;
  notes?: string;
}

export interface GoldenTestSuiteResult {
  total: number;
  passed: number;
  failed: number;
  results: GoldenTestCase[];
  regressionSummary: {
    insurance24CrResolved: boolean;
    exactExpectedValue: number;
    actualEngineValue: number;
  };
}

export function runGoldenTestSuite(): GoldenTestSuiteResult {
  const cases: GoldenTestCase[] = [];

  function evaluateTest(
    id: string,
    category: string,
    description: string,
    inputs: Record<string, any>,
    expected: number,
    actual: number,
    tolerance = 0.01,
    notes?: string
  ) {
    const diff = Math.abs(actual - expected);
    const pass = diff <= tolerance;
    cases.push({
      id,
      category,
      description,
      inputs,
      expected: roundMoney(expected),
      actual: roundMoney(actual),
      tolerance,
      pass,
      notes,
    });
  }

  // ==========================================================================
  // SECTION 1: CANONICAL RATE CONVERSIONS
  // ==========================================================================
  evaluateTest(
    'RATE-01',
    'Canonical Rate Conventions',
    'Convert 6.5% percentage representation to canonical decimal 0.065',
    { percent: 6.5 },
    0.065,
    percentToDecimal(6.5),
    1e-7
  );

  evaluateTest(
    'RATE-02',
    'Canonical Rate Conventions',
    'Convert canonical decimal 0.085 to 8.5%',
    { decimal: 0.085 },
    8.5,
    decimalToPercent(0.085),
    1e-7
  );

  evaluateTest(
    'RATE-03',
    'Rate Semantics: Nominal to Periodic',
    'Nominal 8.4% p.a. compounded monthly -> 0.7% (0.007) per period',
    { nominalRate: 0.084, frequency: 'MONTHLY' },
    0.007,
    nominalToPeriodicRate(0.084, 'MONTHLY'),
    1e-7
  );

  evaluateTest(
    'RATE-04',
    'Rate Semantics: Nominal to EAR',
    'Nominal 12.0% compounded monthly -> EAR = (1 + 0.01)^12 - 1 = 12.682503%',
    { nominalRate: 0.12, frequency: 'MONTHLY' },
    0.12682503,
    nominalToEffectiveRate(0.12, 'MONTHLY'),
    1e-6
  );

  evaluateTest(
    'RATE-05',
    'Rate Semantics: EAR to Nominal',
    'EAR 12.682503% compounded monthly -> Nominal 12.0%',
    { ear: 0.12682503013, frequency: 'MONTHLY' },
    0.12,
    effectiveToNominalRate(0.12682503013, 'MONTHLY'),
    1e-6
  );

  evaluateTest(
    'RATE-06',
    'Rate Semantics: EAR to Periodic',
    'EAR 12.682503% compounded monthly -> Periodic 1.0% (0.01)',
    { ear: 0.12682503013, frequency: 'MONTHLY' },
    0.01,
    effectiveToPeriodicRate(0.12682503013, 'MONTHLY'),
    1e-6
  );

  evaluateTest(
    'RATE-07',
    'Rate Semantics: Continuous to EAR',
    'Continuous rate 10% -> EAR = exp(0.10) - 1 = 10.5170918%',
    { continuousRate: 0.10 },
    0.105170918,
    continuousToEffectiveRate(0.10),
    1e-6
  );

  evaluateTest(
    'RATE-08',
    'Rate Semantics: EAR to Continuous',
    'EAR 10.5170918% -> Continuous = ln(1 + EAR) = 10.0%',
    { ear: 0.105170918 },
    0.10,
    effectiveToContinuousRate(0.105170918),
    1e-6
  );

  // ==========================================================================
  // SECTION 2: FISHER REAL RATES & INFLATION
  // ==========================================================================
  evaluateTest(
    'REAL-01',
    'Fisher Real Rate',
    'Nominal 8.5%, Inflation 6.0% -> r_real = 1.085 / 1.060 - 1 = 2.35849%',
    { nominal: 0.085, inflation: 0.060 },
    0.02358490566,
    calculateRealRate(0.085, 0.060),
    1e-7
  );

  evaluateTest(
    'REAL-02',
    'Fisher Real Rate',
    'Nominal 8.0%, Inflation 6.0% -> r_real = 1.080 / 1.060 - 1 = 1.88679%',
    { nominal: 0.080, inflation: 0.060 },
    0.01886792453,
    calculateRealRate(0.080, 0.060),
    1e-7
  );

  evaluateTest(
    'REAL-03',
    'Fisher Real Rate',
    'Nominal 10.0%, Inflation 6.0% -> r_real = 1.100 / 1.060 - 1 = 3.77358%',
    { nominal: 0.100, inflation: 0.060 },
    0.03773584906,
    calculateRealRate(0.100, 0.060),
    1e-7
  );

  evaluateTest(
    'REAL-04',
    'Fisher Real Rate (Nominal == Inflation)',
    'Nominal 6.0%, Inflation 6.0% -> r_real = 0.0%',
    { nominal: 0.060, inflation: 0.060 },
    0.0,
    calculateRealRate(0.060, 0.060),
    1e-7
  );

  evaluateTest(
    'REAL-05',
    'Fisher Real Rate (Zero Inflation)',
    'Nominal 8.5%, Inflation 0.0% -> r_real = 8.5%',
    { nominal: 0.085, inflation: 0.0 },
    0.085,
    calculateRealRate(0.085, 0.0),
    1e-7
  );

  evaluateTest(
    'REAL-06',
    'Fisher Real Rate (Negative Real Rate)',
    'Nominal 4.0%, Inflation 6.0% -> r_real = 1.04 / 1.06 - 1 = -1.88679%',
    { nominal: 0.040, inflation: 0.060 },
    -0.01886792453,
    calculateRealRate(0.040, 0.060),
    1e-7
  );

  // ==========================================================================
  // SECTION 3: ORDINARY ANNUITY & ANNUITY-DUE (PV / FV)
  // ==========================================================================
  evaluateTest(
    'ANN-PV-01',
    'Ordinary Annuity PV (END)',
    'P = 960000, r = 0.05, n = 10, END -> PV = 960000 * (1 - 1.05^-10) / 0.05',
    { payment: 960000, rate: 0.05, periods: 10, timing: 'END' },
    7412865.53,
    annuityPV(960000, 0.05, 10, 'END'),
    0.05
  );

  evaluateTest(
    'ANN-PV-02',
    'Annuity-Due PV (BEGINNING)',
    'P = 960000, r = 0.05, n = 10, BEGINNING -> PV = PV_ord * 1.05',
    { payment: 960000, rate: 0.05, periods: 10, timing: 'BEGINNING' },
    7783508.81,
    annuityPV(960000, 0.05, 10, 'BEGINNING'),
    0.05
  );

  evaluateTest(
    'ANN-PV-03',
    'Ordinary Annuity PV (Zero Rate Boundary)',
    'P = 960000, r = 0, n = 10, END -> PV = 960000 * 10 = 9600000',
    { payment: 960000, rate: 0, periods: 10, timing: 'END' },
    9600000.0,
    annuityPV(960000, 0, 10, 'END'),
    0.01
  );

  evaluateTest(
    'ANN-PV-04',
    'Annuity PV (Zero Periods Boundary)',
    'P = 960000, r = 0.05, n = 0 -> PV = 0',
    { payment: 960000, rate: 0.05, periods: 0 },
    0.0,
    annuityPV(960000, 0.05, 0),
    0.01
  );

  evaluateTest(
    'ANN-FV-01',
    'Ordinary Annuity FV (END)',
    'P = 10000, r = 0.08, n = 5, END -> FV = 10000 * (1.08^5 - 1) / 0.08',
    { payment: 10000, rate: 0.08, periods: 5, timing: 'END' },
    58666.01,
    annuityFV(10000, 0.08, 5, 'END'),
    0.05
  );

  evaluateTest(
    'ANN-FV-02',
    'Annuity-Due FV (BEGINNING)',
    'P = 10000, r = 0.08, n = 5, BEGINNING -> FV = 58666.01 * 1.08',
    { payment: 10000, rate: 0.08, periods: 5, timing: 'BEGINNING' },
    63359.29,
    annuityFV(10000, 0.08, 5, 'BEGINNING'),
    0.05
  );

  evaluateTest(
    'ANN-FV-03',
    'Annuity FV (Zero Rate Boundary)',
    'P = 10000, r = 0, n = 5 -> FV = 50000',
    { payment: 10000, rate: 0, periods: 5 },
    50000.0,
    annuityFV(10000, 0, 5),
    0.01
  );

  // ==========================================================================
  // SECTION 4: GROWING ANNUITIES (PV / FV)
  // ==========================================================================
  evaluateTest(
    'GROW-PV-01',
    'Growing Annuity PV (r != g)',
    'P1 = 100000, r = 0.08, g = 0.03, n = 5, END -> PV = 422035.09',
    { p1: 100000, r: 0.08, g: 0.03, n: 5, timing: 'END' },
    422035.09,
    growingAnnuityPV(100000, 0.08, 0.03, 5, 'END'),
    0.05
  );

  evaluateTest(
    'GROW-PV-02',
    'Growing Annuity PV (r == g Boundary)',
    'P1 = 100000, r = 0.05, g = 0.05, n = 5 -> PV = 5 * 100000 / 1.05 = 476190.48',
    { p1: 100000, r: 0.05, g: 0.05, n: 5 },
    476190.48,
    growingAnnuityPV(100000, 0.05, 0.05, 5, 'END'),
    0.05
  );

  evaluateTest(
    'GROW-FV-01',
    'Growing Annuity FV (r != g)',
    'P1 = 100000, r = 0.08, g = 0.03, n = 5, END -> FV = 620108.01',
    { p1: 100000, r: 0.08, g: 0.03, n: 5, timing: 'END' },
    620108.01,
    growingAnnuityFV(100000, 0.08, 0.03, 5, 'END'),
    0.05
  );

  evaluateTest(
    'GROW-FV-02',
    'Growing Annuity FV (r == g Boundary)',
    'P1 = 100000, r = 0.05, g = 0.05, n = 5 -> FV = 5 * 100000 * 1.05^4 = 607753.13',
    { p1: 100000, r: 0.05, g: 0.05, n: 5 },
    607753.13,
    growingAnnuityFV(100000, 0.05, 0.05, 5, 'END'),
    0.05
  );

  // ==========================================================================
  // SECTION 5: DISCOUNTED CASH FLOW (DCF / NPV)
  // ==========================================================================
  evaluateTest(
    'DCF-01',
    'Discounted Cash Flow (NPV)',
    'CF = [-100000, 30000, 40000, 50000], r = 0.10 -> NPV = -2103.68',
    { cashFlows: [-100000, 30000, 40000, 50000], r: 0.10 },
    -2103.68,
    discountedCashFlow([-100000, 30000, 40000, 50000], 0.10),
    0.05
  );

  // ==========================================================================
  // SECTION 6: INFLATION & COMPOUNDING
  // ==========================================================================
  evaluateTest(
    'INF-01',
    'Inflation Adjusted Future Value',
    'PV = 100000, Inflation = 0.06, Years = 10 -> FV = 100000 * 1.06^10 = 179084.77',
    { pv: 100000, inflation: 0.06, years: 10 },
    179084.77,
    inflationAdjustedFutureValue(100000, 0.06, 10),
    0.05
  );

  evaluateTest(
    'INF-02',
    'Purchasing Power PV of Future Value',
    'FV = 179084.77, Inflation = 0.06, Years = 10 -> PV = 100000.00',
    { fv: 179084.77, inflation: 0.06, years: 10 },
    100000.00,
    presentValueOfInflationAdjustedFuture(179084.77, 0.06, 10),
    0.05
  );

  evaluateTest(
    'CMP-01',
    'Compound Interest',
    'P = 100000, Rate = 0.08, Years = 5, Monthly Compounding -> 148984.57',
    { principal: 100000, rate: 0.08, years: 5, frequency: 12 },
    148984.57,
    compoundInterest(100000, 0.08, 5, 12),
    0.05
  );

  // ==========================================================================
  // SECTION 7: THE PREVIOUS ₹24.44 CRORE REGRESSION TEST SUITE
  // ==========================================================================
  const regressionBaselineActual = calculateInflationAdjustedCashFlowsPV(960000, 0.085, 0.060, 30);
  const regressionBaselineExpected = 20477492.40; // ₹2.05 Crores

  evaluateTest(
    'REGR-24CR-01',
    'Insurance Regression (Core Anomaly Fix)',
    'Living Expenses = ₹9,60,000/yr, Inflation = 6.0%, Return = 8.5%, Horizon = 30 yrs -> PV ≈ ₹2.05 Crores (NOT ₹24.44 Crores)',
    { annualExpense: 960000, inflation: 0.060, return: 0.085, years: 30 },
    regressionBaselineExpected,
    regressionBaselineActual,
    1.0,
    'Guarantees the previous ₹24.44 Crore inverse discounting / frequency bug is completely eliminated.'
  );

  evaluateTest(
    'REGR-24CR-02',
    'Insurance Regression: 6% Inflation / 8% Return',
    'Living Expenses = ₹9,60,000/yr, Inflation = 6.0%, Return = 8.0%, Horizon = 30 yrs -> PV = ₹2.18 Crores',
    { annualExpense: 960000, inflation: 0.060, return: 0.080, years: 30 },
    21839078.29,
    calculateInflationAdjustedCashFlowsPV(960000, 0.080, 0.060, 30),
    1.0
  );

  evaluateTest(
    'REGR-24CR-03',
    'Insurance Regression: 6% Inflation / 10% Return',
    'Living Expenses = ₹9,60,000/yr, Inflation = 6.0%, Return = 10.0%, Horizon = 30 yrs -> PV = ₹1.71 Crores',
    { annualExpense: 960000, inflation: 0.060, return: 0.100, years: 30 },
    17066394.23,
    calculateInflationAdjustedCashFlowsPV(960000, 0.100, 0.060, 30),
    1.0
  );

  evaluateTest(
    'REGR-24CR-04',
    'Insurance Regression: Zero Inflation / 8.5% Return',
    'Living Expenses = ₹9,60,000/yr, Inflation = 0.0%, Return = 8.5%, Horizon = 30 yrs -> PV = ₹1.03 Crores',
    { annualExpense: 960000, inflation: 0.000, return: 0.085, years: 30 },
    10316970.06,
    calculateInflationAdjustedCashFlowsPV(960000, 0.085, 0.000, 30),
    1.0
  );

  evaluateTest(
    'REGR-24CR-05',
    'Insurance Regression: Return Equal to Inflation (6% / 6%)',
    'Living Expenses = ₹9,60,000/yr, Inflation = 6.0%, Return = 6.0%, Horizon = 30 yrs -> PV = 960000 * 30 = ₹2.88 Crores',
    { annualExpense: 960000, inflation: 0.060, return: 0.060, years: 30 },
    28800000.00,
    calculateInflationAdjustedCashFlowsPV(960000, 0.060, 0.060, 30),
    1.0
  );

  // ==========================================================================
  // SECTION 8: HIGH-LEVEL FINANCIAL PRIMITIVES (CANONICAL RATE AUDIT)
  // ==========================================================================
  const affordResult = houseAffordability(10000, 36, 600, 0.06, 30, 50000);
  evaluateTest(
    'AFFORD-01',
    'House Affordability Max Loan',
    'Income = 10000, maxDTI = 36%, otherDebt = 600, rate = 6.0% (0.06), 30 yrs -> maxLoan = 500374.84',
    { monthlyIncome: 10000, maxDTIPercent: 36, otherDebt: 600, rateDecimal: 0.06, years: 30 },
    500374.84,
    affordResult.maxLoan,
    0.10
  );

  evaluateTest(
    'AFFORD-02',
    'House Affordability Max Home Price',
    'Max Loan 500374.84 + Down Payment 50000 -> 550374.84',
    { maxLoan: 500374.84, downPayment: 50000 },
    550374.84,
    affordResult.maxHomePrice,
    0.10
  );

  const payoff = mortgagePayoff(300000, 0.06, 360, 200);
  evaluateTest(
    'PAYOFF-01',
    'Mortgage Payoff Regular Payment',
    'Principal = 300000, rate = 0.06, 360 mos -> payment = 1798.65',
    { principal: 300000, rateDecimal: 0.06, remainingMonths: 360 },
    1798.65,
    payoff.regularPayment,
    0.05
  );

  const refi = refinanceComparison(400000, 0.065, 360, 0.050, 360, 5000);
  evaluateTest(
    'REFI-01',
    'Refinance Comparison Monthly Savings',
    'Balance = 400000, current = 0.065, new = 0.050, 360 mos -> savings = 380.98',
    { balance: 400000, currentRate: 0.065, newRate: 0.050, months: 360 },
    380.98,
    refi.monthlySavings,
    0.10
  );

  const cashFinance = cashOrFinanceComparison(50000, 50000, 0.06, 60, 0.08, 10000);
  evaluateTest(
    'CASHFIN-01',
    'Cash vs Finance Loan Payment',
    'Finance = 40000 net, rate = 0.06, 60 mos -> monthly payment = 773.31',
    { financeAmount: 40000, rateDecimal: 0.06, termMonths: 60 },
    773.31,
    cashFinance.loanPayment,
    0.05
  );

  evaluateTest(
    'DEP-01',
    'Declining Balance Depreciation (Canonical Decimal Rate)',
    'Cost = 100000, salvage = 10000, life = 5, period 1, rate = 0.40 -> dep = 40000',
    { cost: 100000, salvage: 10000, life: 5, period: 1, rate: 0.40 },
    40000.0,
    depreciation(100000, 10000, 5, 'DECLINING_BALANCE', 1, 0.40),
    0.01
  );

  const tax = progressiveTax(150000, [
    { upTo: 50000, rate: 10 },
    { upTo: 100000, rate: 20 },
    { upTo: Infinity, rate: 30 },
  ]);
  evaluateTest(
    'TAX-01',
    'Progressive Tax Calculation',
    'Taxable = 150000 across 10%, 20%, 30% brackets -> tax = 30000',
    { taxableIncome: 150000 },
    30000.0,
    tax,
    0.01
  );

  const vatNet = vatFromNet(1000, 20);
  evaluateTest(
    'VAT-01',
    'VAT from Net',
    'Net = 1000, VAT rate = 20% -> vat = 200, gross = 1200',
    { net: 1000, vatRatePercent: 20 },
    200.0,
    vatNet.vat,
    0.01
  );

  const vatGross = vatFromGross(1200, 20);
  evaluateTest(
    'VAT-02',
    'VAT from Gross',
    'Gross = 1200, VAT rate = 20% -> net = 1000',
    { gross: 1200, vatRatePercent: 20 },
    1000.0,
    vatGross.net,
    0.01
  );

  const comm = commission(50000, 10);
  evaluateTest(
    'COMM-01',
    'Commission Calculation',
    'Sales = 50000, rate = 10% -> commission = 5000',
    { sales: 50000, ratePercent: 10 },
    5000.0,
    comm,
    0.01
  );

  const regResult = calculatorEngineRegistry.executeEngine('calculateIndiaIncomeTax', {
    grossIncome: 1200000,
    regime: 'NEW',
    age: 30,
  });
  evaluateTest(
    'REGISTRY-01',
    'Advanced Calculator Engine Registry Dispatch',
    'Execute calculateIndiaIncomeTax via calculatorEngineRegistry -> success true',
    { grossIncome: 1200000, regime: 'NEW' },
    1,
    regResult.success ? 1 : 0,
    0.01
  );

  const total = cases.length;
  const passed = cases.filter((c) => c.pass).length;
  const failed = total - passed;

  return {
    total,
    passed,
    failed,
    results: cases,
    regressionSummary: {
      insurance24CrResolved: Math.abs(regressionBaselineActual - regressionBaselineExpected) < 1.0,
      exactExpectedValue: regressionBaselineExpected,
      actualEngineValue: regressionBaselineActual,
    },
  };
}
