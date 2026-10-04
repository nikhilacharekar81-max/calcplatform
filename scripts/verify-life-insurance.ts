import { calculateTermLifeInsurance } from '../src/calculators/india/insurance/life.ts';

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

// ----------------------------------------------------------------------------
// 25 INDEPENDENT NUMERICAL VERIFICATION SCENARIOS
// Raw independent arithmetic equations derived outside production helpers
// ----------------------------------------------------------------------------

// SCENARIO 01 — Normal Household Profile
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
  goalYears: 10,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const annualExp = 50000 * 12; // 6,00,000
  const yrs = 30;
  const inf = 0.06;
  const ret = 0.085;
  const realRate = (1 + ret) / (1 + inf) - 1; // 0.023584905660377353
  const expPV = Math.round(annualExp * (1 - Math.pow(1 + realRate, -yrs)) / realRate); // 12806751
  const debts = 2500000;
  const nominalGoal = Math.round(3000000 * Math.pow(1.06, 10)); // 5372543
  const goalPV = Math.round(nominalGoal / Math.pow(1.085, 10)); // 2376220
  const grossNeed = expPV + debts + goalPV; // 17682971
  const resources = 2000000 + 1500000; // 3500000
  const netGap = Math.max(0, grossNeed - resources); // 14182971
  const sumAssured = Math.ceil(netGap / 100000) * 100000; // 14200000
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 02 — Zero Expenses (Verify No Income Fallback)
addScenario('SCENARIO-02', 'Zero Expenses (No Fallback)', {
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

// SCENARIO 03 — Zero Inflation Rate
addScenario('SCENARIO-03', 'Zero Inflation Rate', {
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
  const nominalGoal = 1000000;
  const goalPV = Math.round(nominalGoal / Math.pow(1.08, 10)); // 463193
  const grossNeed = expPV + goalPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 04 — Zero Investment Return
addScenario('SCENARIO-04', 'Zero Investment Return', {
  age: 45,
  retirementAge: 60,
  monthlyExpenses: 30000,
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
  const expPV = Math.round((30000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 05 — Equal Inflation and Return (r_real = 0)
addScenario('SCENARIO-05', 'Equal Inflation & Return (r_real = 0)', {
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

// SCENARIO 06 — Inflation Greater Than Return (Negative Real Rate)
addScenario('SCENARIO-06', 'Inflation Greater Than Return', {
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
  const realRate = (1 + ret) / (1 + inf) - 1;
  const expPV = Math.round((25000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 07 — Return Greater Than Inflation
addScenario('SCENARIO-07', 'Return Greater Than Inflation (High Return)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 40000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 2000000,
  goalYears: 15,
  inflationRate: 5.0,
  investmentReturn: 10.0,
}, () => {
  const yrs = 30;
  const realRate = (1.10 / 1.05) - 1;
  const expPV = Math.round((40000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const nominalGoal = Math.round(2000000 * Math.pow(1.05, 15));
  const goalPV = Math.round(nominalGoal / Math.pow(1.10, 15));
  const grossNeed = expPV + goalPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 08 — Zero Future Goals
addScenario('SCENARIO-08', 'Zero Future Goals (Goals = 0)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 40000,
  outstandingLoans: 1500000,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 30;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((40000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 1500000;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 09 — Zero Goal Years
addScenario('SCENARIO-09', 'Zero Goal Years (Goal Today = PV)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 0,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 2500000,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const grossNeed = 2500000;
  const netGap = grossNeed;
  const sumAssured = 2500000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 10 — Long Goal Horizon (30 Years)
addScenario('SCENARIO-10', 'Long Goal Horizon (30 Years)', {
  age: 25,
  retirementAge: 60,
  monthlyExpenses: 0,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 1000000,
  goalYears: 30,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const nominalGoal = Math.round(1000000 * Math.pow(1.06, 30)); // 5743491
  const goalPV = Math.round(nominalGoal / Math.pow(1.085, 30)); // 496923
  const grossNeed = goalPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 11 — Zero Liabilities
addScenario('SCENARIO-11', 'Zero Liabilities (Loans = 0)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 40000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 1000000,
  goalYears: 5,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 30;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((40000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const nominalGoal = Math.round(1000000 * Math.pow(1.06, 5));
  const goalPV = Math.round(nominalGoal / Math.pow(1.085, 5));
  const grossNeed = expPV + goalPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 12 — High Debt Profile
addScenario('SCENARIO-12', 'High Debt Profile (₹2 Crore Debt)', {
  age: 40,
  retirementAge: 60,
  monthlyExpenses: 100000,
  outstandingLoans: 20000000,
  existingLifeCover: 5000000,
  existingSavings: 2500000,
  futureFinancialGoals: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 20;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((100000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 20000000;
  const resources = 5000000 + 2500000;
  const netGap = Math.max(0, grossNeed - resources);
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 13 — Zero Savings
addScenario('SCENARIO-13', 'Zero Savings (Savings = 0)', {
  age: 35,
  retirementAge: 60,
  monthlyExpenses: 50000,
  outstandingLoans: 1000000,
  existingLifeCover: 2000000,
  existingSavings: 0,
  futureFinancialGoals: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 25;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((50000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 1000000;
  const netGap = Math.max(0, grossNeed - 2000000);
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 14 — Savings Exceed Gross Need
addScenario('SCENARIO-14', 'Savings Exceed Gross Need', {
  age: 40,
  retirementAge: 60,
  monthlyExpenses: 20000,
  outstandingLoans: 500000,
  existingLifeCover: 1000000,
  existingSavings: 6000000,
  futureFinancialGoals: 500000,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 20;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((20000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 500000 + 500000;
  const resources = 1000000 + 6000000;
  const netGap = Math.max(0, grossNeed - resources); // 0
  const sumAssured = 0;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 15 — Existing Cover Exceeds Gross Need
addScenario('SCENARIO-15', 'Existing Cover Exceeds Gross Need', {
  age: 35,
  retirementAge: 60,
  monthlyExpenses: 30000,
  outstandingLoans: 1000000,
  existingLifeCover: 20000000,
  existingSavings: 1000000,
  futureFinancialGoals: 1000000,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 25;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((30000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV + 1000000 + 1000000;
  const resources = 20000000 + 1000000;
  const netGap = Math.max(0, grossNeed - resources); // 0
  const sumAssured = 0;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 16 — Zero Existing Cover
addScenario('SCENARIO-16', 'Zero Existing Cover (Cover = 0)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 40000,
  outstandingLoans: 1000000,
  existingLifeCover: 0,
  existingSavings: 500000,
  futureFinancialGoals: 1000000,
  goalYears: 10,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 30;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((40000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const nominalGoal = Math.round(1000000 * Math.pow(1.06, 10));
  const goalPV = Math.round(nominalGoal / Math.pow(1.085, 10));
  const grossNeed = expPV + 1000000 + goalPV;
  const netGap = Math.max(0, grossNeed - 500000);
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 17 — One-Year Support Horizon
addScenario('SCENARIO-17', 'One-Year Support Horizon (Age 59 -> 60)', {
  age: 59,
  retirementAge: 60,
  monthlyExpenses: 50000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 1;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((50000 * 12) * (1 - Math.pow(1 + realRate, -1)) / realRate);
  const grossNeed = expPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 18 — Long Support Horizon (40 Years Support Period)
addScenario('SCENARIO-18', 'Long Support Horizon (40 Years Support)', {
  age: 20,
  retirementAge: 60,
  monthlyExpenses: 30000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 40;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((30000 * 12) * (1 - Math.pow(1 + realRate, -40)) / realRate);
  const grossNeed = expPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 19 — Rounding Boundary Below ₹1 Lakh (₹1 -> ₹1,00,000)
addScenario('SCENARIO-19', 'Rounding Boundary Below ₹1 Lakh (₹1 -> ₹1,00,000)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 0,
  outstandingLoans: 1,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const grossNeed = 1;
  const netGap = 1;
  const sumAssured = 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 20 — Rounding Boundary Just Above ₹1 Lakh (₹1,00,001 -> ₹2,00,000)
addScenario('SCENARIO-20', 'Rounding Boundary Just Above ₹1 Lakh (₹1,00,001 -> ₹2,00,000)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 0,
  outstandingLoans: 100001,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const grossNeed = 100001;
  const netGap = 100001;
  const sumAssured = 200000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 21 — Very High Inflation (15%)
addScenario('SCENARIO-21', 'Very High Inflation (15%)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 40000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 1000000,
  goalYears: 10,
  inflationRate: 15.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 30;
  const realRate = (1.085 / 1.15) - 1; // negative real rate -0.0565217
  const expPV = Math.round((40000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const nominalGoal = Math.round(1000000 * Math.pow(1.15, 10));
  const goalPV = Math.round(nominalGoal / Math.pow(1.085, 10));
  const grossNeed = expPV + goalPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 22 — Very High Investment Return (15%)
addScenario('SCENARIO-22', 'Very High Investment Return (15%)', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 50000,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 2000000,
  goalYears: 15,
  inflationRate: 6.0,
  investmentReturn: 15.0,
}, () => {
  const yrs = 30;
  const realRate = (1.15 / 1.06) - 1; // 0.08490566
  const expPV = Math.round((50000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const nominalGoal = Math.round(2000000 * Math.pow(1.06, 15));
  const goalPV = Math.round(nominalGoal / Math.pow(1.15, 15));
  const grossNeed = expPV + goalPV;
  const netGap = grossNeed;
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 23 — Goal + Debt Heavy Profile
addScenario('SCENARIO-23', 'Goal + Debt Heavy Profile', {
  age: 32,
  retirementAge: 60,
  monthlyExpenses: 30000,
  outstandingLoans: 5000000,
  existingLifeCover: 1000000,
  existingSavings: 500000,
  futureFinancialGoals: 4000000,
  goalYears: 12,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 28;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((30000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const nominalGoal = Math.round(4000000 * Math.pow(1.06, 12));
  const goalPV = Math.round(nominalGoal / Math.pow(1.085, 12));
  const grossNeed = expPV + 5000000 + goalPV;
  const netGap = Math.max(0, grossNeed - 1500000);
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 24 — Expense Heavy Profile
addScenario('SCENARIO-24', 'Expense Heavy Profile (₹2 Lakh / Month)', {
  age: 35,
  retirementAge: 60,
  monthlyExpenses: 200000,
  outstandingLoans: 0,
  existingLifeCover: 5000000,
  existingSavings: 2000000,
  futureFinancialGoals: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  const yrs = 25;
  const realRate = (1.085 / 1.06) - 1;
  const expPV = Math.round((200000 * 12) * (1 - Math.pow(1 + realRate, -yrs)) / realRate);
  const grossNeed = expPV;
  const netGap = Math.max(0, grossNeed - 7000000);
  const sumAssured = Math.ceil(netGap / 100000) * 100000;
  return { grossNeed, netGap, sumAssured };
});

// SCENARIO 25 — All Monetary Optional Inputs = Zero
addScenario('SCENARIO-25', 'All Monetary Optional Inputs = Zero', {
  age: 30,
  retirementAge: 60,
  monthlyExpenses: 0,
  outstandingLoans: 0,
  existingLifeCover: 0,
  existingSavings: 0,
  futureFinancialGoals: 0,
  goalYears: 0,
  inflationRate: 6.0,
  investmentReturn: 8.5,
}, () => {
  return { grossNeed: 0, netGap: 0, sumAssured: 0 };
});

console.log('=== 25 INDEPENDENT NUMERICAL CROSS-CHECK SCENARIOS VERIFICATION ===\n');
let allPassed = true;
scenarios.forEach((s) => {
  const status = s.passed ? '[PASS]' : '[FAIL]';
  console.log(`${status} ${s.id}: ${s.name}`);
  console.log(`   Inputs: Age=${s.inputs.age}, RetAge=${s.inputs.retirementAge}, Exp=${s.inputs.monthlyExpenses}, Loans=${s.inputs.outstandingLoans}, Cover=${s.inputs.existingLifeCover}, Sav=${s.inputs.existingSavings}, Goals=${s.inputs.futureFinancialGoals}, GoalYrs=${s.inputs.goalYears}, Inf=${s.inputs.inflationRate}%, Ret=${s.inputs.investmentReturn}%`);
  console.log(`   Expected -> Gross Need: ₹${s.expectedGrossNeed.toLocaleString('en-IN')}, Net Gap: ₹${s.expectedNetProtectionGap.toLocaleString('en-IN')}, Sum Assured: ₹${s.expectedRecommendedSumAssured.toLocaleString('en-IN')}`);
  console.log(`   Actual   -> Gross Need: ₹${s.actualGrossNeed.toLocaleString('en-IN')}, Net Gap: ₹${s.actualNetProtectionGap.toLocaleString('en-IN')}, Sum Assured: ₹${s.actualRecommendedSumAssured.toLocaleString('en-IN')}`);
  if (!s.passed) {
    allPassed = false;
    console.error(`   DELTA EXCEEDED: ${s.delta}`);
  }
});

if (allPassed) {
  console.log('\n>>> ALL 25 INDEPENDENT NUMERICAL CROSS-CHECK SCENARIOS PASSED WITH 100% PRECISION! <<<');
} else {
  console.error('\n>>> NUMERICAL CROSS-CHECK FAILURE DETECTED <<<');
  process.exit(1);
}
