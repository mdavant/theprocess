import { GOALS } from './constants';

export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  isPremium: boolean;
  profileVisibility: 'public' | 'private' | 'followers';
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  restMinutes: number; // Keep for compatibility if needed, but prefer restTimerSeconds on exercise
  isPr?: boolean;
  status: 'pending' | 'completed' | 'failed';
  previousPerformance?: string; // e.g., "50kg x 10"
}

export interface PerformedExercise {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  sets: WorkoutSet[];
  imageUrl?: string;
  notes?: string;
  restTimerSeconds: number; // Configurable rest time per exercise
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: string;
  durationMinutes: number;
  volumeKg: number;
  exercises: PerformedExercise[];
  notes?: string;
  recordsCount?: number;
}

export type ActiveWorkout = Omit<Workout, 'id' | 'userId'>;

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
  createdBy: string; // userId or 'system'
  imageUrl?: string;
}

export enum MealType {
  Breakfast = 'Petit déjeuner',
  Lunch = 'Déjeuner',
  Dinner = 'Dîner',
  Snack = 'En-cas'
}

export interface NutritionEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodName: string;
  quantity: string; // e.g., "100g" or "1 cup"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  dueDate?: string;
}

export interface ScheduleEvent {
  id: string;
  userId: string;
  title: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  category: string; // e.g., "Workout", "Work", "Meal Prep"
}

export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  weight: number; // kg
  height: number; // cm
  activityLevel: number; // factor
  goal: keyof typeof GOALS;
  targetWeight?: number; // kg
  deadline?: string; // YYYY-MM-DD
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}