import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Workout, User } from '../types';
import { api } from '../services/api';
import WorkoutPostCard from '../components/WorkoutPostCard';
import { Plus } from 'lucide-react';

const WorkoutsPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [workoutsData, userData] = await Promise.all([
          api.getWorkouts(),
          api.getCurrentUser()
        ]);
        setWorkouts(workoutsData);
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteWorkout = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) {
      // In a real app, you'd call an API endpoint.
      // For this mock setup, we'll just filter the state.
      setWorkouts(currentWorkouts => currentWorkouts.filter(w => w.id !== id));
    }
  };

  const handleModifyWorkout = (id: string) => {
    // In a real app, this would navigate to an edit page.
    alert(`Redirection vers la page de modification pour la séance ${id}. (Fonctionnalité à implémenter)`);
    // Example: navigate(`/edit-workout/${id}`);
  };

  return (
    <div className="relative">
      <div className="space-y-4">
        {loading && <p className="text-center text-text-dark">Chargement des séances...</p>}
        {!loading && workouts.length === 0 && (
          <p className="text-center text-text-dark">Vous n'avez pas encore enregistré de séance.</p>
        )}
        {user && workouts.map(workout => (
          <WorkoutPostCard
            key={workout.id}
            workout={workout}
            user={user}
            onDelete={() => handleDeleteWorkout(workout.id)}
            onModify={() => handleModifyWorkout(workout.id)}
          />
        ))}
      </div>

      <Link
        to="/active-workout"
        className="fixed bottom-24 right-4 bg-accent text-white h-12 px-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-accent-hover transition-transform duration-300 ease-in-out transform hover:scale-105 z-40"
        aria-label="Démarrer un entraînement"
      >
        <Plus size={20} />
        <span className="font-semibold text-sm">Démarrer un entraînement</span>
      </Link>
    </div>
  );
};

export default WorkoutsPage;