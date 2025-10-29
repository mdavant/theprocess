import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Workout } from '../types';
import { api } from '../services/api';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '../components/ui';

const WorkoutDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/workouts');
      return;
    }
    const fetchWorkout = async () => {
      try {
        const data = await api.getWorkoutById(id);
        if (data) {
          setWorkout(data);
        } else {
          // Handle workout not found
        }
      } catch (error) {
        console.error('Failed to fetch workout details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text-light">Chargement...</div>;
  }

  if (!workout) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text-light">Séance non trouvée.</div>;
  }

  const workoutDate = new Date(workout.date);
  const formattedDate = workoutDate.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background text-text-light">
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm p-4 flex items-center border-b border-secondary">
        <Button variant="ghost" className="w-auto h-auto p-2 mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
        </Button>
        <div>
            <h1 className="text-xl font-bold">{workout.name}</h1>
            <p className="text-sm text-text-dark">{formattedDate}</p>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <div className="bg-primary border border-secondary rounded-xl p-4 grid grid-cols-3 text-center">
            <div>
                <p className="text-sm text-text-dark">Durée</p>
                <p className="font-bold text-lg">{workout.durationMinutes} min</p>
            </div>
            <div>
                <p className="text-sm text-text-dark">Volume</p>
                <p className="font-bold text-lg">{workout.volumeKg.toLocaleString('fr-FR')} kg</p>
            </div>
            <div>
                <p className="text-sm text-text-dark">Records</p>
                <p className="font-bold text-lg">{workout.recordsCount || 0}</p>
            </div>
        </div>

        <div className="space-y-4">
          {workout.exercises.map((ex) => (
            <div key={ex.exerciseId} className="bg-primary border border-secondary rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">{ex.name}</h3>
              <div className="space-y-2">
                 <div className="grid grid-cols-4 gap-2 text-xs text-text-dark uppercase font-semibold">
                    <span>Série</span>
                    <span>Précédent</span>
                    <span>Charge</span>
                    <span>Rép's</span>
                 </div>
                {ex.sets.map((set, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-center bg-secondary p-2 rounded-md">
                    <span className="font-bold">{index + 1}</span>
                    <span className="text-sm text-text-dark">{set.previousPerformance || '-'}</span>
                    <span>{set.weight} kg</span>
                    <div className="flex items-center gap-2">
                        <span>{set.reps}</span>
                        {set.isPr && <Star size={14} className="text-yellow-400 fill-current" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WorkoutDetailPage;
