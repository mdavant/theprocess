
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '../components/ui';
import { Workout } from '../types';
import { api } from '../services/api';
import WorkoutCard from '../components/WorkoutCard';
import { Plus } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await api.getWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const startNewWorkout = () => {
    navigate('/active-workout');
  };

  return (
    <div>
      <Header title="Accueil" />
      <div className="space-y-6 mt-4">
        <Button onClick={startNewWorkout}>
          <Plus size={20} />
          Démarrer une séance
        </Button>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-light">Activité récente</h2>
            {loading ? (
                <p className="text-text-dark">Chargement des séances...</p>
            ) : workouts.length > 0 ? (
                workouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)
            ) : (
                <p className="text-text-dark">Aucune séance enregistrée pour le moment.</p>
            )}
        </div>
        
        {/* TODO: AdMob integration point */}
        <div className="h-16 bg-secondary rounded-lg flex items-center justify-center text-text-dark">
            Espace Publicitaire
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
