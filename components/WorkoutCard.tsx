
import React from 'react';
import type { Workout } from '../types';
import { Card } from './ui';
import { Calendar, Timer, Weight, Dumbbell } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const workoutDate = new Date(workout.date);
  const formattedDate = workoutDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-text-light">{workout.name}</h3>
        <div className="flex items-center gap-2 text-sm text-text-dark mt-1">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-accent" />
          <div>
            <p className="text-text-dark">Durée</p>
            <p className="font-semibold text-text-light">{workout.durationMinutes} min</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Weight size={16} className="text-accent" />
          <div>
            <p className="text-text-dark">Volume</p>
            <p className="font-semibold text-text-light">{workout.volumeKg} kg</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dumbbell size={16} className="text-accent" />
          <div>
            <p className="text-text-dark">Exercices</p>
            <p className="font-semibold text-text-light">{workout.exercises.length}</p>
          </div>
        </div>
      </div>
      
      {workout.notes && (
         <p className="text-sm text-text bg-secondary p-3 rounded-md italic">"{workout.notes}"</p>
      )}

    </Card>
  );
};

export default WorkoutCard;
