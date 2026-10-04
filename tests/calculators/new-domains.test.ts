import {
  calculatePercentage,
  calculatePercentageChange,
  calculateRatio,
  calculateAverage,
  calculateLcmGcd,
} from '../../src/calculators/maths/basic.ts';
import {
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateSip,
  calculateStepUpSip,
  calculateSwp,
  calculateCagr,
} from '../../src/calculators/investments/interest.ts';
import {
  calculateGratuity,
  calculateRetirementCorpus,
} from '../../src/calculators/india/retirement.ts';
import {
  calculateBmi,
  calculateBmr,
  calculateCalorieNeeds,
} from '../../src/calculators/health/metrics.ts';
import {
  calculateMargin,
  calculateMarkup,
  calculateBreakEven,
  calculateRoi,
} from '../../src/calculators/business/planning.ts';

export function runNewDomainsTests(): Array<{ name: string; passed: boolean; error?: string }> {
  const results: Array<{ name: string; passed: boolean; error?: string }> = [];

  function assert(condition: boolean, description: string) {
    if (condition) {
      results.push({ name: description, passed: true });
    } else {
      results.push({ name: description, passed: false, error: 'Assertion failed' });
    }
  }

  // 1. Core Maths
  const pct = calculatePercentage({ value: 500, percent: 15 });
  assert(pct.result === 75 && pct.resultFormatted === '75.00', 'Core Maths - Percentage Calculator');

  const change = calculatePercentageChange({ initialValue: 200, finalValue: 250 });
  assert(change.difference === 50 && change.percentChange === 25 && change.changeType === 'increase', 'Core Maths - Percentage Change (Increase)');

  const ratio = calculateRatio({ valueA: 15, valueB: 25 });
  assert(ratio.simplifiedA === 3 && ratio.simplifiedB === 5 && ratio.ratioString === '3 : 5', 'Core Maths - Ratio Simplification');

  const avg = calculateAverage({ valuesString: '10, 20, 30, 40, 50' });
  assert(avg.sum === 150 && avg.count === 5 && avg.average === 30, 'Core Maths - Arithmetic Mean Solver');

  const lcmGcd = calculateLcmGcd({ valueA: 12, valueB: 18 });
  assert(lcmGcd.gcd === 6 && lcmGcd.lcm === 36, 'Core Maths - LCM & HCF Solver');

  // 2. Investments
  const si = calculateSimpleInterest({ principal: 100000, rate: 7.5, years: 5 });
  assert(si.interestEarned === 37500 && si.totalValue === 137500, 'Investments - Simple Interest');

  const ci = calculateCompoundInterest({ principal: 100000, rate: 10, years: 10, compoundingFrequency: 'annually' });
  assert(ci.totalValue > 250000 && ci.chartData.length === 10, 'Investments - Compound Interest');

  const sip = calculateSip({ monthlyInvestment: 5000, rate: 12, years: 15 });
  assert(sip.totalInvested === 900000 && sip.totalValue > 2400000, 'Investments - SIP growth');

  const stepUp = calculateStepUpSip({ monthlyInvestment: 10000, stepUpPercent: 10, rate: 12, years: 15 });
  assert(stepUp.totalInvested > 1000000 && stepUp.totalValue > stepUp.totalInvested, 'Investments - Step-Up SIP growth');

  const swp = calculateSwp({ totalInvestment: 5000000, withdrawalAmount: 30000, rate: 8.5, years: 15 });
  assert(swp.totalWithdrawn === 5400000 && swp.remainingBalance > 0, 'Investments - SWP depletion curve');

  const cagr = calculateCagr({ initialValue: 100000, finalValue: 250000, years: 5 });
  assert(cagr.cagrFormatted === '20.11%', 'Investments - CAGR returns');

  // 3. Retirement
  const gratuity = calculateGratuity({ lastDrawnSalary: 100000, completedYearsOfService: 8, isCoveredUnderGratuityAct: true });
  assert(Math.round(gratuity.gratuityAmount) === Math.round((15 * 100000 * 8) / 26) && gratuity.taxableGratuity === 0, 'Retirement - Gratuity payout eligibility');

  const corpus = calculateRetirementCorpus({
    monthlyExpensesToday: 50000,
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    inflationPercent: 6,
    preRetirementReturnPercent: 12,
    postRetirementReturnPercent: 8
  });
  assert(corpus.targetCorpus > 0 && corpus.requiredMonthlySavings > 0, 'Retirement - Future Corpus projection');

  // 4. Health & Fitness
  const bmi = calculateBmi({ weightKg: 70, heightCm: 170 });
  assert(bmi.bmi > 24 && bmi.bmi < 25 && bmi.bmiCategory === 'Normal Weight', 'Health - Body Mass Index (BMI)');

  const bmr = calculateBmr({ weightKg: 70, heightCm: 170, ageYears: 30, gender: 'male' });
  assert(bmr.bmr > 1500 && bmr.bmr < 1700, 'Health - Basal Metabolic Rate (BMR)');

  const calories = calculateCalorieNeeds({ weightKg: 70, heightCm: 170, ageYears: 30, gender: 'male', activityLevel: 'sedentary' });
  assert(calories.tdee > calories.bmr && calories.weightLossCalories < calories.tdee, 'Health - Daily Energy Expenditure (TDEE)');

  // 5. Business
  const margin = calculateMargin({ revenue: 1000000, cost: 600000 });
  assert(margin.grossProfit === 400000 && margin.marginPercent === 40, 'Business - Gross Profit Margin');

  const markup = calculateMarkup({ cost: 500, markupPercent: 40 });
  assert(markup.sellingPrice === 700 && markup.grossProfit === 200, 'Business - Markup & Retail Pricing');

  const be = calculateBreakEven({ fixedCosts: 1000000, sellingPricePerUnit: 500, variableCostPerUnit: 300 });
  assert(be.breakEvenUnits === 5000 && be.breakEvenSales === 2500000, 'Business - Break-Even point threshold');

  const roi = calculateRoi({ amountInvested: 500000, amountReturned: 750000 });
  assert(roi.gain === 250000 && roi.roiPercent === 50, 'Business - Return on Investment (ROI)');

  return results;
}
