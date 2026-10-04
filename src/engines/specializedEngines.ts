/**
 * Specialized Engines Suite:
 * - SIP & Step-Up SIP Engine
 * - SWP (Systematic Withdrawal Plan)
 * - PPF (Public Provident Fund 7.1%)
 * - EPF (Employee Provident Fund 8.25%)
 * - NPS (National Pension System)
 * - SSY (Sukanya Samriddhi Yojana 8.2%)
 * - FD (Fixed Deposit) Maturity
 * - Indian Land Unit Converter
 * - Health (BMI, BMR, TDEE, Macros)
 * - FIRE & Retirement Corpus
 * - CAGR & TVM
 */

export function calculateSip(params: {
  monthlyInvestment: number;
  expectedReturnAnnual: number;
  years: number;
  stepUpPercentage?: number;
}) {
  let monthly = Math.max(0, params.monthlyInvestment || 0);
  const r = (params.expectedReturnAnnual || 12) / 100 / 12;
  const years = Math.max(1, params.years || 15);
  const stepUp = (params.stepUpPercentage || 0) / 100;

  let totalInvested = 0;
  let corpus = 0;
  const yearlyChartData = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      corpus = (corpus + monthly) * (1 + r);
      totalInvested += monthly;
    }
    yearlyChartData.push({
      year: `Yr ${y}`,
      Invested: Math.round(totalInvested),
      WealthGained: Math.round(Math.max(0, corpus - totalInvested)),
      TotalCorpus: Math.round(corpus),
    });
    if (stepUp > 0) {
      monthly = monthly * (1 + stepUp);
    }
  }

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(Math.max(0, corpus - totalInvested)),
    maturityCorpus: Math.round(corpus),
    yearlyChartData,
  };
}

export function calculatePpf(params: {
  yearlyDeposit?: number;
  monthlyDeposit?: number;
  depositFrequency?: 'yearly' | 'monthly';
  depositTiming?: 'BEFORE_5TH' | 'AFTER_5TH';
  years?: number;
  rate?: number;
  ratePercent?: number;
}) {
  const years = Math.min(50, Math.max(15, params.years || 15));
  const ratePct = params.ratePercent ?? params.rate ?? 7.1;
  const annualRate = ratePct / 100;
  const monthlyRate = annualRate / 12;
  const freq = params.depositFrequency || (params.monthlyDeposit ? 'monthly' : 'yearly');
  const timing = params.depositTiming || 'BEFORE_5TH';

  let annualDeposit = 0;
  let monthlyAmt = 0;
  if (freq === 'monthly') {
    monthlyAmt = Math.min(12500, Math.max(50, params.monthlyDeposit || (params.yearlyDeposit ? params.yearlyDeposit / 12 : 12500)));
    annualDeposit = monthlyAmt * 12;
  } else {
    annualDeposit = Math.min(150000, Math.max(500, params.yearlyDeposit || 150000));
  }

  let balance = 0;
  let totalDeposited = 0;
  const chartData: Array<{ year: string; Invested: number; Interest: number; Balance: number }> = [];

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0;
    if (freq === 'yearly') {
      // Annual deposit before 5th of April vs later in the month
      const eligibleApril = timing === 'BEFORE_5TH';
      const balanceForYear = balance + annualDeposit;
      totalDeposited += annualDeposit;
      yearInterest = balance * annualRate + (eligibleApril ? annualDeposit * annualRate : annualDeposit * monthlyRate * 11);
      balance = balanceForYear + yearInterest;
    } else {
      // Monthly installment with statutory minimum balance accrual
      for (let m = 1; m <= 12; m++) {
        balance += monthlyAmt;
        totalDeposited += monthlyAmt;
        const monthlyAccrual = timing === 'BEFORE_5TH' ? balance * monthlyRate : (balance - monthlyAmt) * monthlyRate;
        yearInterest += monthlyAccrual;
      }
      balance += yearInterest;
    }

    chartData.push({
      year: `Yr ${y}`,
      Invested: Math.round(totalDeposited),
      Interest: Math.round(balance - totalDeposited),
      Balance: Math.round(balance),
    });
  }

  return {
    totalDeposited: Math.round(totalDeposited),
    interestEarned: Math.round(balance - totalDeposited),
    maturityAmount: Math.round(balance),
    applicableInterestRate: `${ratePct}%`,
    statutoryLockInYears: 15,
    taxBenefitStatus: 'EEE (Exempt under Sec 80C, interest exempt, maturity exempt)',
    chartData,
  };
}

export function calculateLandConversion(params: {
  value: number;
  fromUnit: string;
  toUnit: string;
  state?: string;
}) {
  const val = Math.max(0, params.value || 0);
  const from = params.fromUnit.toLowerCase();
  const to = params.toUnit.toLowerCase();
  const state = (params.state || 'standard').toLowerCase();

  // State-specific and Standard land units in Square Feet
  const sqftRates: Record<string, number> = {
    sqft: 1,
    sqm: 10.7639,
    sqyd: 9,
    gaj: 9,
    acre: 43560,
    hectare: 107639,
    cent: 435.6, // South India (100 Cents = 1 Acre)
    guntha: 1089, // Maharashtra & South India (40 Gunthas = 1 Acre)
    ground: 2400, // Tamil Nadu
    ankanams: 72, // Andhra Pradesh & Telangana
    marla: 272.25, // Punjab / Haryana / HP (1 Kanal = 20 Marlas)
    kanal: 5445, // Punjab / Haryana / HP (8 Kanals = 1 Acre)
    bigha: state.includes('bengal') || state.includes('assam') ? 14400 : (state.includes('mp') ? 12000 : 27225), // Standard UP/North vs Bengal vs MP
    biswa: state.includes('bengal') ? 720 : 1361.25,
    katha: state.includes('bengal') || state.includes('bihar') ? 720 : 1361.25,
    chatak: 45, // Bengal
    dhur: 68.06, // Bihar / UP
  };

  const fromRate = sqftRates[from] || 1;
  const toRate = sqftRates[to] || 1;
  const sqftVal = val * fromRate;
  const converted = sqftVal / toRate;

  return {
    inputFormatted: `${val} ${from.toUpperCase()}`,
    sqftValue: Math.round(sqftVal),
    convertedValue: converted,
    convertedFormatted: `${converted.toFixed(3)} ${to.toUpperCase()}`,
    note: 'Note: Traditional units (Bigha, Biswa, Katha, Guntha) vary by state land revenue records and local registry bye-laws.',
  };
}

export function calculateHealthMetrics(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel?: number; // 1.2, 1.375, 1.55, 1.725
}) {
  const w = Math.max(1, params.weightKg || 70);
  const hMeters = Math.max(0.5, (params.heightCm || 170) / 100);
  const age = Math.max(1, params.age || 25);
  const act = params.activityLevel || 1.375;

  const bmi = w / (hMeters * hMeters);

  let category = 'Normal Weight';
  let categoryColor = '#10b981';
  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3b82f6';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    categoryColor = '#f59e0b';
  } else if (bmi >= 30) {
    category = 'Obese';
    categoryColor = '#ef4444';
  }

  // Mifflin-St Jeor equation for BMR
  let bmr = params.gender === 'male'
    ? 10 * w + 6.25 * (params.heightCm || 170) - 5 * age + 5
    : 10 * w + 6.25 * (params.heightCm || 170) - 5 * age - 161;

  const tdee = Math.round(bmr * act);

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    categoryColor,
    bmr: Math.round(bmr),
    tdee,
    idealWeightRange: [
      Math.round(18.5 * hMeters * hMeters),
      Math.round(24.9 * hMeters * hMeters),
    ],
    macros: [
      { name: 'Protein (30%)', value: Math.round((tdee * 0.3) / 4) },
      { name: 'Carbs (40%)', value: Math.round((tdee * 0.4) / 4) },
      { name: 'Fats (30%)', value: Math.round((tdee * 0.3) / 9) },
    ],
  };
}

export function calculateFireCorpus(params: {
  annualExpenses: number;
  currentSavings: number;
  monthlySavings: number;
  expectedReturnAnnual: number;
  swrPercentage?: number; // default 4%
}) {
  const exp = Math.max(0, params.annualExpenses || 600000);
  const current = Math.max(0, params.currentSavings || 0);
  const monthly = Math.max(0, params.monthlySavings || 0);
  const r = (params.expectedReturnAnnual || 8) / 100;
  const swr = (params.swrPercentage || 4) / 100;

  const targetCorpus = exp / swr;
  let corpus = current;
  let yearsToFire = 0;
  const trajectory = [];

  for (let y = 1; y <= 40; y++) {
    corpus = (corpus + monthly * 12) * (1 + r);
    if (corpus >= targetCorpus && yearsToFire === 0) {
      yearsToFire = y;
    }
    trajectory.push({
      year: `Yr ${y}`,
      Corpus: Math.round(corpus),
      Target: Math.round(targetCorpus),
    });
  }

  return {
    targetCorpus: Math.round(targetCorpus),
    yearsToIndependence: yearsToFire > 0 ? yearsToFire : 40,
    trajectory,
  };
}
