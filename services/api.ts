// --- MOCK API FOR TheProcess ---
// In a real application, this file would be replaced with calls to a Supabase client.
import type { Workout, NutritionEntry, User, Exercise, WorkoutSet } from '../types';
import { MealType } from '../types';
import { MUSCLE_GROUPS } from '../constants';

const mockUser: User = {
    id: 'user_123',
    username: 'JohnFit',
    email: 'john.fit@example.com',
    bio: 'Lifting heavy things and eating clean. Following TheProcess.',
    avatarUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isPremium: true,
    profileVisibility: 'public',
};

const mockExercises: Exercise[] = [
    // Pectoraux
    { id: 'ex_1', name: 'Développé couché (Barre)', muscleGroup: 'Pectoraux', equipment: 'Barre', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif' },
    { id: 'ex_2', name: 'Développé couché (Haltères)', muscleGroup: 'Pectoraux', equipment: 'Haltères', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif' },
    { id: 'ex_3', name: 'Écarté incliné (Haltères)', muscleGroup: 'Pectoraux', equipment: 'Haltères', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Fly.gif' },
    { id: 'ex_4', name: 'Pompes', muscleGroup: 'Pectoraux', equipment: 'Poids du corps', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Push-up.gif' },
    { id: 'ex_20', name: 'Lever Seated Fly', muscleGroup: 'Pectoraux', equipment: 'Machine', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Lever-Seated-Fly.gif' },
    // Dos
    { id: 'ex_5', name: 'Tractions', muscleGroup: 'Dos', equipment: 'Poids du corps', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif' },
    { id: 'ex_6', name: 'Tirage vertical', muscleGroup: 'Dos', equipment: 'Machine', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif' },
    { id: 'ex_7', name: 'Rowing (Barre)', muscleGroup: 'Dos', equipment: 'Barre', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif' },
    // Epaules
    { id: 'ex_8', name: 'Développé militaire (Barre)', muscleGroup: 'Epaules', equipment: 'Barre', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Press.gif' },
    { id: 'ex_9', name: 'Élévations latérales (Haltères)', muscleGroup: 'Epaules', equipment: 'Haltères', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif' },
    // Quadriceps
    { id: 'ex_10', name: 'Squat (Barre)', muscleGroup: 'Quadriceps', equipment: 'Barre', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif' },
    { id: 'ex_11', name: 'Leg Press', muscleGroup: 'Quadriceps', equipment: 'Machine', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Leg-Press.gif' },
    // Biceps
    { id: 'ex_12', name: 'Curl (Haltères)', muscleGroup: 'Biceps', equipment: 'Haltères', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif' },
    // Triceps
    { id: 'ex_13', name: 'Dips', muscleGroup: 'Triceps', equipment: 'Poids du corps', createdBy: 'system', imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2022/07/Dips.gif' },
];

const mockWorkouts: Workout[] = [
  {
    id: 'workout_1',
    userId: 'user_123',
    name: '(vendredi)pec épaules',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 67,
    volumeKg: 4098,
    recordsCount: 2,
    exercises: [
      { exerciseId: 'ex_2', name: 'Développé couché (Haltères)', muscleGroup: 'Pectoraux', restTimerSeconds: 120, sets: [
          { reps: 10, weight: 30, restMinutes: 2, status: 'completed', previousPerformance: '28kg x 10' }, 
          { reps: 8, weight: 32, restMinutes: 2, status: 'completed', previousPerformance: '30kg x 8' }, 
          { reps: 6, weight: 34, restMinutes: 2, isPr: true, status: 'completed', previousPerformance: '32kg x 5' }, 
        ], imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif' 
      },
      { exerciseId: 'ex_9', name: 'Élévations latérales (Haltères)', muscleGroup: 'Epaules', restTimerSeconds: 90, sets: [
          { reps: 12, weight: 10, restMinutes: 1.5, isPr: true, status: 'completed', previousPerformance: '8kg x 12' }, 
          { reps: 10, weight: 10, restMinutes: 1.5, status: 'completed', previousPerformance: '8kg x 11' },
          { reps: 9, weight: 10, restMinutes: 1.5, status: 'completed', previousPerformance: '8kg x 10' }
        ], imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif' 
      },
      { exerciseId: 'ex_20', name: 'Lever Seated Fly', muscleGroup: 'Pectoraux', restTimerSeconds: 60, sets: [
          { reps: 15, weight: 40, restMinutes: 1, status: 'completed', previousPerformance: '35kg x 15' }, 
          { reps: 12, weight: 40, restMinutes: 1, status: 'completed', previousPerformance: '35kg x 12' }
        ], imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Lever-Seated-Fly.gif' 
      }
    ],
    notes: 'Good energy today.'
  },
   {
    id: 'workout_2',
    userId: 'user_123',
    name: '(mercredi)leg day',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 90,
    volumeKg: 15000,
    recordsCount: 1,
    exercises: [
      { exerciseId: 'ex_10', name: 'Squat (Barre)', muscleGroup: 'Quadriceps', restTimerSeconds: 180, sets: [
          { reps: 5, weight: 140, restMinutes: 3, isPr: true, status: 'completed', previousPerformance: '135kg x 5' }, 
          { reps: 5, weight: 140, restMinutes: 3, status: 'completed', previousPerformance: '135kg x 5' }, 
          { reps: 5, weight: 140, restMinutes: 3, status: 'completed', previousPerformance: '135kg x 4' }
        ], imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif' 
      },
      { exerciseId: 'ex_11', name: 'Leg Press', muscleGroup: 'Quadriceps', restTimerSeconds: 120, sets: [
          { reps: 10, weight: 250, restMinutes: 2, status: 'completed', previousPerformance: '240kg x 10' }, 
          { reps: 10, weight: 250, restMinutes: 2, status: 'completed', previousPerformance: '240kg x 9' }
        ], imageUrl: 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Leg-Press.gif' 
      },
    ],
  }
];

const mockNutrition: NutritionEntry[] = [
    { id: 'nut_1', userId: 'user_123', date: new Date().toISOString().split('T')[0], mealType: MealType.Breakfast, foodName: 'Oatmeal & Berries', quantity: '1 bowl', calories: 450, protein: 20, carbs: 75, fat: 8 },
    { id: 'nut_2', userId: 'user_123', date: new Date().toISOString().split('T')[0], mealType: MealType.Lunch, foodName: 'Chicken Breast & Rice', quantity: '150g chicken, 200g rice', calories: 600, protein: 50, carbs: 80, fat: 7 },
];

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    return mockUser;
  },
  getWorkouts: async (): Promise<Workout[]> => {
    await delay(500);
    return mockWorkouts;
  },
  getWorkoutById: async (id: string): Promise<Workout | undefined> => {
    await delay(400);
    return mockWorkouts.find(w => w.id === id);
  },
  saveWorkout: async (workout: Omit<Workout, 'id' | 'userId'>): Promise<Workout> => {
      await delay(500);
      const newWorkout: Workout = {
        ...workout,
        id: `workout_${Date.now()}`,
        userId: mockUser.id,
      };
      mockWorkouts.unshift(newWorkout);
      return newWorkout;
  },
  getNutritionForDate: async (date: string): Promise<NutritionEntry[]> => {
      await delay(400);
      return mockNutrition.filter(entry => entry.date === date);
  },
  addNutritionEntry: async (entry: Omit<NutritionEntry, 'id' | 'userId'>): Promise<NutritionEntry> => {
      await delay(300);
      const newEntry: NutritionEntry = {
          ...entry,
          id: `nut_${Date.now()}`,
          userId: mockUser.id,
      };
      mockNutrition.push(newEntry);
      return newEntry;
  },
  getExercises: async (): Promise<Exercise[]> => {
    await delay(500);
    return mockExercises;
  },
  createExercise: async (exerciseData: Omit<Exercise, 'id' | 'createdBy'>): Promise<Exercise> => {
    await delay(300);
    const newExercise: Exercise = {
        ...exerciseData,
        id: `ex_${Date.now()}`,
        createdBy: mockUser.id,
    };
    mockExercises.push(newExercise);
    return newExercise;
  },
  getExerciseHistoryAndDetails: async (exerciseId: string): Promise<{ exercise: Exercise | undefined; history: { date: string; sets: WorkoutSet[] }[] }> => {
    await delay(500);
    const exercise = mockExercises.find(ex => ex.id === exerciseId);
    const history: { date: string; sets: WorkoutSet[] }[] = [];

    // Add some more mock data for chart visualization
    for (let i = 10; i > 0; i--) {
        const date = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString();
        const baseWeight = 50 + (10 - i) * 2; // Progressively heavier
        if (exercise?.name.includes('Développé couché')) {
            history.push({
                date,
                sets: [
                    { reps: 10, weight: baseWeight - 5, restMinutes: 2, status: 'completed' },
                    { reps: 8, weight: baseWeight, restMinutes: 2, status: 'completed' },
                    { reps: 6 + (10 - i) % 3, weight: baseWeight + 5, restMinutes: 2, status: 'completed' },
                ],
            });
        }
    }

    mockWorkouts.forEach(workout => {
        const performedExercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);
        if (performedExercise) {
            history.push({
                date: workout.date,
                sets: performedExercise.sets,
            });
        }
    });

    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { exercise, history };
  },
};