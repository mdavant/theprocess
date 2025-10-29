import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, MoreVertical, Clock, Timer, Check, Trash2 } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { api } from '../services/api';
import { ActiveWorkout, PerformedExercise, WorkoutSet, Exercise } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveWorkout } from '../App';

// --- Utility Functions ---

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) { console.error(error); return initialValue; }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            setStoredValue(current => {
                const valueToStore = value instanceof Function ? value(current) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            });
        } catch (error) { console.error(error); }
    }, [key]);
    
    return [storedValue, setValue];
};

const formatTime = (seconds: number, showHours = false) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');
    return showHours ? `${String(h).padStart(2, '0')}:${mStr}:${sStr}` : `${mStr}:${sStr}`;
};

// --- Main Component ---

const ActiveWorkoutPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { abandonWorkout } = useActiveWorkout();
    const [workout, setWorkout] = useLocalStorage<ActiveWorkout | null>('activeWorkout', null);
    const [duration, setDuration] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [editingTimer, setEditingTimer] = useState<{exIndex: number, currentSeconds: number} | null>(null);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [isConfirmAbandonOpen, setIsConfirmAbandonOpen] = useState(false);

    useEffect(() => {
        if (!workout) {
            const newWorkout: ActiveWorkout = {
                name: `Séance du ${new Date().toLocaleDateString('fr-FR')}`,
                date: new Date().toISOString(),
                durationMinutes: 0,
                volumeKg: 0,
                exercises: [],
                notes: '',
            };
            setWorkout(newWorkout);
        }
    }, [workout, setWorkout]);
    
     useEffect(() => {
        if (location.state?.newExercises) {
            const newExercisesToAdd: Exercise[] = location.state.newExercises;
            
            setWorkout(prevWorkout => {
                if (!prevWorkout) return null;
                const performedExercises: PerformedExercise[] = newExercisesToAdd.map(ex => ({
                    exerciseId: ex.id,
                    name: ex.name,
                    muscleGroup: ex.muscleGroup,
                    restTimerSeconds: 90,
                    sets: [{ reps: 8, weight: 20, restMinutes: 1.5, status: 'pending', previousPerformance: 'N/A' }],
                }));
                return { ...prevWorkout, exercises: [...prevWorkout.exercises, ...performedExercises] };
            });

            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.state, navigate, setWorkout]);

    useEffect(() => {
        const durationInterval = setInterval(() => setDuration(prev => prev + 1), 1000);
        return () => clearInterval(durationInterval);
    }, []);

    useEffect(() => {
        if (isResting && restTimer > 0) {
            const timerInterval = setTimeout(() => setRestTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timerInterval);
        } else if (isResting && restTimer === 0) {
            setIsResting(false);
        }
    }, [isResting, restTimer]);

    const updateSet = (exIndex: number, setIndex: number, field: 'reps' | 'weight' | 'restMinutes', value: number) => {
        if (!workout) return;
        setWorkout(prev => {
            if (!prev) return null;
            const newWorkout = { ...prev };
            const exercises = [...newWorkout.exercises];
            const exercise = { ...exercises[exIndex] };
            const sets = [...exercise.sets];
            sets[setIndex] = { ...sets[setIndex], [field]: value };
            exercise.sets = sets;
            exercises[exIndex] = exercise;
            
            const volume = exercises.reduce((totalVol, ex) =>
                totalVol + ex.sets.reduce((exVol, set) => exVol + (set.status === 'completed' ? (set.reps * set.weight) : 0), 0), 0);

            return { ...newWorkout, exercises, volumeKg: Math.round(volume) };
        });
    };
    
    const toggleSetStatus = (exIndex: number, setIndex: number) => {
        if (!workout) return;

        const isCurrentlyCompleted = workout.exercises[exIndex].sets[setIndex].status === 'completed';
        const isNowCompleted = !isCurrentlyCompleted;

        setWorkout(prev => {
            if (!prev) return null;
            const newWorkout = JSON.parse(JSON.stringify(prev));
            const set = newWorkout.exercises[exIndex].sets[setIndex];
            
            set.status = isNowCompleted ? 'completed' : 'pending';
            
            const volumeChange = isNowCompleted 
                ? (set.reps * set.weight)
                : - (set.reps * set.weight);

            newWorkout.volumeKg = Math.round(newWorkout.volumeKg + volumeChange);
            return newWorkout;
        });

        if (isNowCompleted) {
            setRestTimer(workout.exercises[exIndex].restTimerSeconds);
            setIsResting(true);
        } else {
            setIsResting(false);
            setRestTimer(0);
        }
    };


    const addSet = (exIndex: number) => {
        if (!workout) return;
        const lastSet = workout.exercises[exIndex].sets.slice(-1)[0] || { reps: 8, weight: 50, restMinutes: 1.5, status: 'pending' };
        setWorkout(prev => {
             if (!prev) return null;
            const newWorkout = { ...prev };
            const exercises = [...newWorkout.exercises];
            const exercise = { ...exercises[exIndex] };
            exercise.sets = [...exercise.sets, { ...lastSet, status: 'pending' }];
            exercises[exIndex] = exercise;
            return { ...newWorkout, exercises };
        });
    };
    
    const removeExercise = (exIndex: number) => {
        if (!workout) return;
        setWorkout(prev => {
            if (!prev) return null;
            const newExercises = prev.exercises.filter((_, index) => index !== exIndex);
            return { ...prev, exercises: newExercises };
        });
        setOpenMenu(null);
    };

    const handleSaveWorkout = async (name: string, notes: string) => {
        if (!workout) return;
        setIsSaving(true);
        const finalWorkout = { 
            ...workout,
            name,
            notes,
            durationMinutes: Math.floor(duration / 60)
        };
        try {
            await api.saveWorkout(finalWorkout);
            setWorkout(null);
            localStorage.removeItem('activeWorkout');
            localStorage.removeItem('isWorkoutMinimized');
            navigate('/workouts', { replace: true });
        } catch (error) {
            console.error("Failed to save workout", error);
            setIsSaving(false);
        }
    };

    const handleDiscardWorkout = () => {
        localStorage.removeItem('activeWorkout');
        localStorage.removeItem('isWorkoutMinimized');
        navigate('/workouts', { replace: true });
    };

    
    const updateRestTimer = (exIndex: number, newSeconds: number) => {
        if (!workout) return;
        setWorkout(prev => {
            if (!prev) return null;
            const newWorkout = { ...prev };
            const exercises = [...newWorkout.exercises];
            exercises[exIndex] = { ...exercises[exIndex], restTimerSeconds: newSeconds };
            return { ...newWorkout, exercises };
        });
        setEditingTimer(null);
    };

    const stats = useMemo(() => {
        if (!workout) return { volume: 0, sets: 0 };
        return {
            volume: workout.volumeKg,
            sets: workout.exercises.reduce((count, ex) => count + ex.sets.filter(s => s.status === 'completed').length, 0),
        }
    }, [workout]);


    if (!workout) return null;

    return (
        <div className="bg-background min-h-screen text-text-light flex flex-col">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b border-secondary h-[70px]">
                <button className="p-2 rounded-full hover:bg-secondary transition-colors" onClick={() => setIsConfirmAbandonOpen(true)} aria-label="Abandonner la séance">
                    <ChevronDown size={24} />
                </button>
                <AnimatePresence>
                {isResting && (
                    <motion.div 
                        className="absolute left-1/2 -translate-x-1/2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="text-lg font-mono p-2 rounded-full px-4 transition-colors flex items-center gap-2 bg-blue-600 text-white animate-pulse">
                            <Timer size={18} />
                            <span>{formatTime(restTimer)}</span>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                <button onClick={() => setIsFinishModalOpen(true)} disabled={isSaving} className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Terminer la séance">
                    {isSaving ? "..." : <Check size={24} />}
                </button>
            </header>

            <main className="flex-grow p-4 space-y-4 overflow-y-auto pb-24">
                <div className="bg-primary border border-secondary rounded-xl p-4 grid grid-cols-3 text-center">
                    <div>
                        <p className="text-sm text-text-dark">Durée</p>
                        <p className="font-bold text-lg">{formatTime(duration, true)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-dark">Volume</p>
                        <p className="font-bold text-lg">{stats.volume} kg</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-dark">Séries</p>
                        <p className="font-bold text-lg">{stats.sets}</p>
                    </div>
                </div>

                {workout.exercises.map((ex, exIndex) => (
                    <div key={`${ex.exerciseId}-${exIndex}`} className="bg-primary border border-secondary rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-bold flex-grow">{ex.name}</h3>
                            <div className="flex items-center flex-shrink-0">
                                <button className="p-2 text-blue-400 hover:text-blue-300 rounded-full" onClick={() => setEditingTimer({ exIndex, currentSeconds: ex.restTimerSeconds })}>
                                    <Timer size={20}/>
                                </button>
                                <div className="relative">
                                    <button className="p-2 rounded-full" onClick={() => setOpenMenu(openMenu === exIndex ? null : exIndex)}><MoreVertical size={20}/></button>
                                    {openMenu === exIndex && (
                                        <div className="absolute right-0 mt-2 w-40 bg-secondary rounded-lg shadow-xl z-20">
                                            <button onClick={() => removeExercise(exIndex)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-500/20">
                                                <Trash2 size={16} /> Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-xs font-semibold grid grid-cols-12 gap-2 text-center text-text-dark uppercase">
                            <span className="col-span-1">#</span>
                            <span className="col-span-4">Précédent</span>
                            <span className="col-span-3">KG</span>
                            <span className="col-span-2">Rép's</span>
                            <span className="col-span-2"></span>
                        </div>
                        
                        {ex.sets.map((set, setIndex) => {
                            const isCompleted = set.status === 'completed';
                             return (
                                <motion.div layout key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                                    <div className={`col-span-1 font-bold text-center py-2 rounded-lg ${isCompleted ? 'bg-green-800/80' : 'bg-secondary'}`}>
                                        {setIndex + 1}
                                    </div>
                                    <div className="col-span-4 text-center text-sm text-text-dark py-2">{set.previousPerformance || '-'}</div>
                                    <input type="number" value={set.weight} onChange={e => updateSet(exIndex, setIndex, 'weight', +e.target.value)} className="col-span-3 bg-secondary text-center rounded-lg h-10 border-0 focus:ring-accent focus:ring-2 disabled:opacity-70" disabled={isCompleted}/>
                                    <input type="number" value={set.reps} onChange={e => updateSet(exIndex, setIndex, 'reps', +e.target.value)} className="col-span-2 bg-secondary text-center rounded-lg h-10 border-0 focus:ring-accent focus:ring-2 disabled:opacity-70" disabled={isCompleted}/>
                                    <div className="col-span-2 flex justify-center">
                                        <Button onClick={() => toggleSetStatus(exIndex, setIndex)} className={`w-10 h-10 p-0 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-secondary hover:bg-green-700/50'}`}>
                                            <Check size={20} />
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <Button variant="secondary" onClick={() => addSet(exIndex)}>+ Ajouter une série</Button>
                    </div>
                ))}
            </main>

            <Link
                to="/add-exercise"
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-accent text-white h-auto px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-accent-hover transition-transform duration-300 ease-in-out transform hover:scale-105 z-40 whitespace-nowrap"
                aria-label="Ajouter un exercice"
            >
                <Plus size={20} />
                <span className="font-semibold">Ajouter un exercice</span>
            </Link>
            
            <FinishWorkoutModal
                isOpen={isFinishModalOpen}
                onClose={() => setIsFinishModalOpen(false)}
                onSave={handleSaveWorkout}
                onDiscard={handleDiscardWorkout}
                isLoading={isSaving}
                isEmpty={workout.exercises.length === 0}
                initialName={workout.name}
                initialNotes={workout.notes || ''}
            />
            
             <ConfirmAbandonModal
                isOpen={isConfirmAbandonOpen}
                onClose={() => setIsConfirmAbandonOpen(false)}
                onConfirm={() => {
                    setIsConfirmAbandonOpen(false);
                    abandonWorkout(false);
                }}
            />
            
            <RestTimerModal
                isOpen={editingTimer !== null}
                onClose={() => setEditingTimer(null)}
                currentSeconds={editingTimer?.currentSeconds ?? 90}
                onSave={(newSeconds) => {
                    if (editingTimer) {
                        updateRestTimer(editingTimer.exIndex, newSeconds);
                    }
                }}
            />
        </div>
    );
};

// --- Finish Modal Component ---
const FinishWorkoutModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, notes: string) => void;
    onDiscard: () => void;
    isLoading: boolean;
    isEmpty: boolean;
    initialName: string;
    initialNotes: string;
}> = ({ isOpen, onClose, onSave, onDiscard, isLoading, isEmpty, initialName, initialNotes }) => {
    const [name, setName] = useState(initialName);
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setNotes(initialNotes);
        }
    }, [isOpen, initialName, initialNotes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name, notes);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="bg-primary w-full max-w-sm rounded-xl p-6 space-y-4 border border-secondary"
                        onClick={e => e.stopPropagation()}
                    >
                        {isEmpty ? (
                            <div className="text-center">
                                <h2 className="text-xl font-bold">Quitter la séance ?</h2>
                                <p className="text-text-dark my-2">Cette séance est vide. Aucune donnée ne sera sauvegardée.</p>
                                <div className="flex gap-4 pt-2">
                                    <Button variant="secondary" onClick={onClose}>Annuler</Button>
                                    <Button onClick={onDiscard} className="bg-red-600 hover:bg-red-700">Quitter</Button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-xl font-bold text-center mb-4">Terminer la séance</h2>
                                <div className="space-y-4">
                                    <Input
                                        label="Titre de la séance"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1.5">Description (optionnel)</label>
                                        <textarea
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            rows={3}
                                            placeholder="Ajoutez des notes sur votre séance..."
                                            className="w-full px-3 py-2 bg-primary border border-secondary rounded-lg text-text-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- Confirm Abandon Modal Component ---
const ConfirmAbandonModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="bg-primary w-full max-w-sm rounded-xl p-6 space-y-4 border border-secondary text-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold">
                            Abandonner la séance ?
                        </h2>
                        <p className="text-text-dark">
                           Êtes-vous sûr de vouloir abandonner cette séance ? Vos progrès non sauvegardés seront perdus.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Button variant="secondary" onClick={onClose}>
                                Annuler
                            </Button>
                            <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
                                Abandonner
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Rest Timer Modal Component ---

const timeOptions = Array.from({ length: 61 }, (_, i) => i * 5); // 0s to 5min (300s)

const RestTimerModal: React.FC<{isOpen: boolean, onClose: () => void, currentSeconds: number, onSave: (seconds: number) => void}> = ({isOpen, onClose, currentSeconds, onSave}) => {
    const [selectedTime, setSelectedTime] = useState(currentSeconds);
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemHeight = 40; // Corresponds to h-10
    const containerHeight = 192; // Corresponds to h-48
    const padding = (containerHeight - itemHeight) / 2;
    const isScrolling = useRef<ReturnType<typeof setTimeout> | null>(null);


    useEffect(() => {
        if (isOpen && scrollRef.current) {
            const closest = timeOptions.reduce((prev, curr) => (Math.abs(curr - currentSeconds) < Math.abs(prev - currentSeconds) ? curr : prev));
            const initialIndex = timeOptions.indexOf(closest);
            if (initialIndex > -1) {
                scrollRef.current.scrollTop = initialIndex * itemHeight;
                setSelectedTime(closest);
            }
        }
    }, [isOpen, currentSeconds]);

    const handleScroll = useCallback(() => {
        if (isScrolling.current) {
            clearTimeout(isScrolling.current);
        }

        if (scrollRef.current) {
            const index = Math.round(scrollRef.current.scrollTop / itemHeight);
            const newTime = timeOptions[index];
            if (newTime !== undefined && newTime !== selectedTime) {
                setSelectedTime(newTime);
            }
        }
        
        isScrolling.current = setTimeout(() => {
            handleSnap();
        }, 150);

    }, [selectedTime]);
    
    const handleSnap = () => {
         if (scrollRef.current) {
            const index = Math.round(scrollRef.current.scrollTop / itemHeight);
            scrollRef.current.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
        }
    }

    const formatTimeDisplay = (s: number) => {
        const m = Math.floor(s / 60);
        const remS = s % 60;
        if (m > 0 && remS > 0) return `${m}m ${remS}s`;
        if (m > 0) return `${m}m`;
        return `${s}s`;
    };
    
    const handleSave = () => onSave(selectedTime);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        className="bg-primary w-full max-w-sm rounded-t-2xl p-6 space-y-4 border-t border-secondary"
                        onClick={e => e.stopPropagation()}
                    >
                         <h2 className="text-xl font-bold text-center">Temps de repos</h2>
                         
                         <div className="relative h-48 my-4" aria-label="Sélecteur de temps">
                            <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-white/5 pointer-events-none z-10 border-y border-secondary/50" />
                            <div 
                                ref={scrollRef} 
                                onScroll={handleScroll}
                                className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
                            >
                                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                                <div style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px`}}>
                                {timeOptions.map(time => (
                                    <div key={time} className="snap-center h-10 flex items-center justify-center text-xl transition-all duration-200"
                                         style={{ 
                                             opacity: selectedTime === time ? 1 : 0.5,
                                             transform: `scale(${selectedTime === time ? 1.1 : 0.8})`,
                                         }}
                                    >
                                        {formatTimeDisplay(time)}
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSave} className="w-full rounded-full h-12 text-base">Terminé</Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ActiveWorkoutPage;