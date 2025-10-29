import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
import NutritionPage from './pages/NutritionPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import OrganizationPage from './pages/OrganizationPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import AddExercisePage from './pages/AddExercisePage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';

// --- Active Workout Context ---
interface ActiveWorkoutContextType {
    isWorkoutActive: boolean;
    isWorkoutMinimized: boolean;
    minimizeWorkout: () => void;
    resumeWorkout: () => void;
    abandonWorkout: (withConfirm?: boolean) => void;
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextType | undefined>(undefined);

export const useActiveWorkout = () => {
    const context = useContext(ActiveWorkoutContext);
    if (context === undefined) {
        throw new Error('useActiveWorkout must be used within an ActiveWorkoutProvider');
    }
    return context;
};

const ActiveWorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const getWorkoutStatus = () => {
        return !!localStorage.getItem('activeWorkout');
    };
    
    const getMinimizedStatus = () => {
        return getWorkoutStatus() && localStorage.getItem('isWorkoutMinimized') === 'true';
    };

    const [isWorkoutActive, setIsWorkoutActive] = useState(getWorkoutStatus());
    const [isWorkoutMinimized, setIsWorkoutMinimized] = useState(getMinimizedStatus());
    
    useEffect(() => {
        const syncState = () => {
            setIsWorkoutActive(getWorkoutStatus());
            setIsWorkoutMinimized(getMinimizedStatus());
        };

        const intervalId = setInterval(syncState, 500);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (location.pathname === '/active-workout' && isWorkoutMinimized) {
            setIsWorkoutMinimized(false);
            localStorage.setItem('isWorkoutMinimized', 'false');
        }
    }, [location.pathname, isWorkoutMinimized]);

    const minimizeWorkout = useCallback(() => {
        localStorage.setItem('isWorkoutMinimized', 'true');
        setIsWorkoutMinimized(true);
        navigate('/');
    }, [navigate]);

    const resumeWorkout = useCallback(() => {
        localStorage.setItem('isWorkoutMinimized', 'false');
        setIsWorkoutMinimized(false);
        navigate('/active-workout');
    }, [navigate]);

    const abandonWorkout = useCallback((withConfirm = true) => {
        const performAbandon = () => {
            localStorage.removeItem('activeWorkout');
            localStorage.removeItem('isWorkoutMinimized');
            setIsWorkoutActive(false);
            setIsWorkoutMinimized(false);
            if (location.pathname === '/active-workout') {
                navigate('/');
            }
        };

        if (withConfirm) {
            if (window.confirm("Êtes-vous sûr de vouloir abandonner cette séance ? Vos progrès non sauvegardés seront perdus.")) {
                performAbandon();
            }
        } else {
            performAbandon();
        }
    }, [navigate, location.pathname]);

    return (
        <ActiveWorkoutContext.Provider value={{ isWorkoutActive, isWorkoutMinimized, minimizeWorkout, resumeWorkout, abandonWorkout }}>
            {children}
        </ActiveWorkoutContext.Provider>
    );
};
// --- End of Context ---

const MainLayoutWithOnboardingCheck: React.FC = () => {
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    if (!onboardingComplete) {
        return <Navigate to="/onboarding" replace />;
    }
    return <MainLayout />;
}


const App: React.FC = () => {
  return (
    <HashRouter>
      <ActiveWorkoutProvider>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            {/* Full-screen pages */}
            <Route path="/active-workout" element={<ActiveWorkoutPage />} />
            <Route path="/workout/:id" element={<WorkoutDetailPage />} />
            <Route path="/add-exercise" element={<AddExercisePage />} />
            <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
            
            <Route path="/" element={<MainLayoutWithOnboardingCheck />}>
              <Route index element={<DashboardPage />} />
              <Route path="workouts" element={<WorkoutsPage />} />
              <Route path="nutrition" element={<NutritionPage />} />
              <Route path="organization" element={<OrganizationPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
      </ActiveWorkoutProvider>
    </HashRouter>
  );
};

export default App;