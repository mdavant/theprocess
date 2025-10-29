import React from 'react';
import { Home, Dumbbell, Apple, CalendarDays, LineChart, User as UserIcon } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Accueil', icon: <Home size={24} /> },
  { to: '/workouts', label: 'Séances', icon: <Dumbbell size={24} /> },
  { to: '/nutrition', label: 'Nutrition', icon: <Apple size={24} /> },
  { to: '/organization', label: 'Planning', icon: <CalendarDays size={24} /> },
  { to: '/progress', label: 'Progrès', icon: <LineChart size={24} /> },
  { to: '/profile', label: 'Profil', icon: <UserIcon size={24} /> },
];

export const MUSCLE_GROUPS = [
  'Pectoraux', 'Dos', 'Epaules', 'Quadriceps', 'Ischio-jambiers', 'Biceps', 'Triceps', 'Avant-Bras', 'Mollets', 'Abdos', 'Cardio'
];

export const ACTIVITY_LEVELS = {
  sedentary: { label: 'Sédentaire (peu ou pas d\'exercice)', value: 1.2 },
  light: { label: 'Léger (1-3 jours/semaine)', value: 1.375 },
  moderate: { label: 'Modéré (3-5 jours/semaine)', value: 1.55 },
  active: { label: 'Actif (6-7 jours/semaine)', value: 1.725 },
  veryActive: { label: 'Très actif (travail physique + exercice)', value: 1.9 },
};

export const GOALS = {
  cut: { label: 'Sèche (-20%)', value: 0.8 },
  maintain: { label: 'Maintien', value: 1.0 },
  bulk: { label: 'Prise de masse (+15%)', value: 1.15 },
};