export interface BmiInput {
  weightKg: number;
  heightCm: number;
}
export interface BmiResult {
  bmi: number;
  bmiCategory: string;
  idealWeightMin: number;
  idealWeightMax: number;
}

export function calculateBmi(input: BmiInput): BmiResult {
  const w = Math.max(1, input.weightKg);
  const h = Math.max(50, input.heightCm) / 100;

  const bmi = w / (h * h);

  let bmiCategory = 'Normal Weight';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = 'Overweight';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
  }

  // Ideal BMI range: 18.5 to 24.9
  const idealWeightMin = 18.5 * (h * h);
  const idealWeightMax = 24.9 * (h * h);

  return {
    bmi,
    bmiCategory,
    idealWeightMin,
    idealWeightMax,
  };
}

export interface BmrInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'male' | 'female';
}
export interface BmrResult {
  bmr: number;
}

export function calculateBmr(input: BmrInput): BmrResult {
  const w = Math.max(1, input.weightKg);
  const h = Math.max(50, input.heightCm);
  const age = Math.max(1, input.ageYears);
  const gender = input.gender || 'male';

  // Mifflin-St Jeor Equation
  let bmr = 10 * w + 6.25 * h - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  return {
    bmr,
  };
}

export interface CalorieNeedsInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
}
export interface CalorieNeedsResult {
  bmr: number;
  tdee: number;
  weightLossCalories: number;
  weightGainCalories: number;
}

export function calculateCalorieNeeds(input: CalorieNeedsInput): CalorieNeedsResult {
  const bmrRes = calculateBmr(input);
  const bmr = bmrRes.bmr;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };

  const multiplier = activityMultipliers[input.activityLevel] || 1.2;
  const tdee = bmr * multiplier;

  return {
    bmr,
    tdee,
    weightLossCalories: tdee - 500, // standard 500 kcal deficit
    weightGainCalories: tdee + 500,  // standard 500 kcal surplus
  };
}
