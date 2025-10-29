
import { GOALS } from '../constants';
import { UserProfile } from '../types';

export interface MacroCalculatorInput extends UserProfile {}

export interface MacroResult {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

/**
 * Calculates BMR using the Mifflin-St Jeor equation.
 * BMR (Basal Metabolic Rate)
 */
const calculateBMR = (input: Omit<MacroCalculatorInput, 'activityLevel' | 'goal'>): number => {
  const { gender, age, weight, height } = input;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Calculates TDEE and macronutrient split.
 * TDEE (Total Daily Energy Expenditure)
 */
export const calculateMacros = (input: MacroCalculatorInput): MacroResult => {
  const bmr = calculateBMR(input);
  const baseTdee = bmr * input.activityLevel;
  let finalCalories = baseTdee;
  
  // Prioritize specific weight goal with deadline over generic goal
  if (input.targetWeight && input.deadline && input.targetWeight !== input.weight) {
    const deadlineDate = new Date(input.deadline);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (deadlineDate > today) {
      const days = (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      if (days > 7) { // Ensure the goal is reasonably paced
        const totalCalorieDiff = (input.targetWeight - input.weight) * 7700; // 7700 kcal per kg
        const dailyAdjustment = totalCalorieDiff / days;
        finalCalories += dailyAdjustment;
      }
    }
  } else {
    finalCalories *= GOALS[input.goal].value;
  }


  // Standard macro split: 30% protein, 40% carbs, 30% fat
  const proteinCalories = finalCalories * 0.30;
  const carbsCalories = finalCalories * 0.40;
  const fatCalories = finalCalories * 0.30;

  const proteinGrams = Math.round(proteinCalories / 4); // 4 calories per gram
  const carbsGrams = Math.round(carbsCalories / 4); // 4 calories per gram
  const fatGrams = Math.round(fatCalories / 9); // 9 calories per gram

  return {
    calories: Math.round(finalCalories),
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
  };
};
