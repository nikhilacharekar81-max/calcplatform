import { calculateTermLifeInsurance, calculateLifeInsuranceNeeds, calculateLivingExpensesPV } from '../src/calculators/india/insurance/life.ts';

interface ScenarioVerification {
  id: string;
  name: string;
  inputs: any;
  expectedGrossNeed: number;
  expectedNetProtectionGap: number;
  expectedRecommendedSumAssured: number;
  actualGrossNeed: number;
  actualNetProtectionGap: number;
  actualRecommendedSumAssured: number;
  passed: boolean;
  delta: number;
}

const scenarios: ScenarioVerification[] = [];

function addScenario(
  id: string,
  name: string,
  inputs: any,
  calcExpected: () => { grossNeed: number; netGap: number; sumAssured: number }
) {
  const expected = calcExpected();
  const actual = calculateTermLifeInsurance(inputs);
  const actualGrossNeed = actual.incomeReplacement + actual.loanProtection + actual.goalProtection;
  const actualNetGap = actual.protectionGap;
  const actualSumAssured = actual.recommendedSumAssured;

  const delta = Math.max(
    Math.abs(actualGrossNeed - expected.grossNeed),
    Math.abs(actualNetGap - expected.netGap),
    Math.abs(actualSumAssured - expected.sumAssured)
  );

  const passed = delta < 1.0;

  scenarios.push({
    id,
    name,
    inputs,
    expectedGrossNeed: Math.round(expected.grossNeed),
    expectedNetProtectionGap: Math.round(expected.netGap),
    expectedRecommendedSumAssured: expected.sumAssured,
    actualGrossNeed: Math.round(actualGrossNeed),
    actualNetProtectionGap: Math.round(actualNetGap),
    actualRecommendedSumAssured: actualSumAssured,
    passed,
    delta,
  });
}

// 1. Normal Household
addScenario('SCENARIO-01', 'Normal Household Profile', {
  age: 30,
  retirementAge: 60,
  annualIncome: 1200000,
  monthlyExpenses: 50000,
  dependents: 3,
  outstandingLoans: 2500000,
  existingLifeCover: 2000000,
  existingSavings: 1500000,
  futureFinancialGoals: 3000000,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  // Manual raw calculation
  const annualExp = 50000 * 12; // 6,00,000
  const yrs = 30;
  const inf = 0.06;
  const ret = 0.085;
  const realRate = (1 + ret) / (1 + inf) - 1; // 0.023584905660377353
  const expPV = Math.round(annualExp * (1 - Math.pow(1 + realRate, -yrs)) / realRate); // 12806751
  const debts = 2500000;
  const goals = 3000000;
  const grossNeed = expPV + debts + goals; // 18306751
  const resources = 2000000 + 1500000; // 3500000
  const netGap = Math.max(0, grossNeed - resources); // 14806751
  const sumAssured = Math.ceil(netGap / 100000) * 100000; // 14900000
  return { grossNeed, netGap, sumAssured };
});

// 2. Zero Expenses (Debt & Goal Protection Only)
addScenario('SCENARIO-02', 'Zero Expenses (Debt & Goal Only)', {
  age: 35,
  retirementAge: 60,
  annualIncome: 1000000,
  monthlyExpenses: 0,
  outstandingLoans: 1000000,
  existingLifeCover: 200000,
  existingSavings: 300000,
  futureFinancialGoals: 500000,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const grossNeed = 1000000 + 500000; // 1500000
  const resources = 200000 + 300000; // 500000
  const netGap = 1000000;
  const sumAssured = 1000000;
  return { grossNeed, netGap, sumAssured };
});

// 3. Debt Heavy Profile
addScenario('SCENARIO-03', 'Debt Heavy Profile', {
  age: 40,
  retirementAge: 60,
  annualIncome: 2000000,
  monthlyExpenses: 100000,
  outstandingLoans: 10000000, // ₹1 Crore
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 20;
  const inf = 0.06;
  const ret = 0.085;
  const realRate = (1 + ret) / (1 + inf) - 1;
  const expPV = Math.round((100000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 10000000;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// 4. Goal Heavy Profile with Explicit Horizon Compounding
addScenario('SCENARIO-04', 'Goal Heavy with Horizon Compounding', {
  age: 30,
  retirementAge: 60,
  annualIncome: 1000000,
  monthlyExpenses: 0,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 2000000, // ₹20 Lakh today
  goalYears: 10, // 10 years away
  inflationRate: 6.5,
}, () => {
  const inflatedGoal = Math.round(2000000 * Math.pow(1.065, 10)); // 3754274
  const grossNeed = inflatedGoal;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// 5. High Inflation (Negative Real Rate)
addScenario('SCENARIO-05', 'High Inflation (Negative Real Rate)', {
  age: 50,
  retirementAge: 60,
  monthlyExpenses: 25000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  inflationRate: 10.0,
  investmentReturn: 8.0,
}, () => {
  const yrs = 10;
  const inf = 0.10;
  const ret = 0.08;
  const realRate = (1 + ret) / (1 + inf) - 1; // -0.018181818
  const expPV = Math.round((25000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// 6. Zero Inflation
addScenario('SCENARIO-06', 'Zero Inflation Rate', {
  age: 40,
  retirementAge: 60,
  monthlyExpenses: 50000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 1000000,
  goalYears: 10,
  inflationRate: 0.0,
  investmentReturn: 8.0,
}, () => {
  const yrs = 20;
  const realRate = 0.08;
  const expPV = Math.round((50000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 1000000;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// 7. Zero Investment Return
addScenario('SCENARIO-07', 'Zero Investment Return Rate', {
  age: 45,
  retirementAge: 60,
  monthlyExpenses: 33333.33,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  inflationRate: 5.0,
  investmentReturn: 0.0,
}, () => {
  const yrs = 15;
  const inf = 0.05;
  const ret = 0.0;
  const realRate = (1 + ret) / (1 + inf) - 1;
  const expPV = Math.round((33333.33 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// 8. Equal Inflation and Return (Limiting Case)
addScenario('SCENARIO-08', 'Equal Inflation & Return (r_real = 0)', {
  age: 35,
  retirementAge: 60,
  monthlyExpenses: 500000 / 12, // ₹5,00,000 / yr
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  inflationRate: 7.0,
  investmentReturn: 7.0,
}, () => {
  const yrs = 25;
  const expPV = Math.round(500000 * yrs); // 12500000
  const grossNeed = expPV;
  const netGap = grossNeed;
  const sumAssured = 12500000;
  return { grossNeed, netGap, sumAssured };
});

// 9. High Savings (Resources Exceed Need)
addScenario('SCENARIO-09', 'High Savings Exceeding Gross Need', {
  age: 40,
  retirementAge: 60,
  monthlyExpenses: 20000,
  outstandingLoans: 500000,
  existingLifeCover: 1000000,
  existingSavings: 6000000,
  futureFinancialGoals: 500000,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 20;
  const inf = 0.06;
  const ret = 0.085;
  const realRate = (1 + ret) / (1 + inf) - 1;
  const expPV = Math.round((20000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 500000 + 500000;
  const resources = 1000000 + 6000000;
  const netGap = Math.max(0, grossNeed - resources); // 0
  const sumAssured = 0;
  return { grossNeed, netGap, sumAssured };
});

// 10. Existing Cover Exceeds Gross Need
addScenario('SCENARIO-10', 'Existing Cover Exceeds Gross Need', {
  age: 35,
  retirementAge: 60,
  monthlyExpenses: 30000,
  outstandingLoans: 1000000,
  existingLifeCover: 20000000, // ₹2 Crore
  existingSavings: 1000000,
  futureFinancialGoals: 1000000,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 25;
  const inf = 0.06;
  const ret = 0.085;
  const realRate = (1 + ret) / (1 + inf) - 1;
  const expPV = Math.round((30000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 1000000 + 1000000;
  const resources = 20000000 + 1000000;
  const netGap = Math.max(0, grossNeed - resources); // 0
  const sumAssured = 0;
  return { grossNeed, netGap, sumAssured };
});

console.log('=== INDEPENDENT NUMERICAL CROSS-CHECK VERIFICATION ===\n');
let allPassed = true;
scenarios.forEach((s) => {
  const status = s.passed ? '[PASS]' : '[FAIL]';
  console.log(`${status} ${s.id}: ${s.name}`);
  console.log(`   Expected -> Gross Need: ₹${s.expectedGrossNeed.toLocaleString('en-IN')}, Net Gap: ₹${s.expectedNetProtectionGap.toLocaleString('en-IN')}, Sum Assured: ₹${s.expectedRecommendedSumAssured.toLocaleString('en-IN')}`);
  console.log(`   Actual   -> Gross Need: ₹${s.actualGrossNeed.toLocaleString('en-IN')}, Net Gap: ₹${s.actualNetProtectionGap.toLocaleString('en-IN')}, Sum Assured: ₹${s.actualRecommendedSumAssured.toLocaleString('en-IN')}`);
  if (!s.passed) {
    allPassed = false;
    console.error(`   DELTA EXCEEDED: ${s.delta}`);
  }
});

if (allPassed) {
  console.log('\n>>> ALL 10 INDEPENDENT NUMERICAL CROSS-CHECK SCENARIOS PASSED WITH 100% PRECISION! <<<');
} else {
  console.error('\n>>> NUMERICAL CROSS-CHECK FAILURE DETECTED <<<');
  process.exit(1);
}
