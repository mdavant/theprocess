
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useActiveWorkout } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const ActiveWorkoutBanner: React.FC = () => {
    const { isWorkoutActive, isWorkoutMinimized, resumeWorkout, abandonWorkout } = useActiveWorkout();

    return (
        <AnimatePresence>
            {isWorkoutActive && isWorkoutMinimized && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-20 left-4 right-4 z-40"
                >
                    <div className="bg-primary border border-secondary rounded-xl p-3 shadow-lg flex items-center justify-between">
                        <p className="font-semibold text-text-light">Entraînement en cours</p>
                        <div className="flex items-center gap-6">
                            <button onClick={resumeWorkout} className="flex items-center gap-2 text-blue-500 font-semibold">
                                <Play size={18} fill="currentColor" />
                                <span>Reprendre</span>
                            </button>
                            <button onClick={abandonWorkout} className="flex items-center gap-2 text-red-500 font-semibold">
                                <X size={18} />
                                <span>Ignorer</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className="pb-24 pt-4 px-4">
        <Outlet />
      </main>
      <ActiveWorkoutBanner />
      <BottomNav />
    </div>
  );
};

export default MainLayout;
