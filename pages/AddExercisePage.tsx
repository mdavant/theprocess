import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Exercise } from '../types';
import { api } from '../services/api';
import { X, Search, Plus, Check, Info } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { MUSCLE_GROUPS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const AddExercisePage: React.FC = () => {
    const navigate = useNavigate();
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        api.getExercises()
            .then(setAllExercises)
            .finally(() => setLoading(false));
    }, []);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleAddExercises = () => {
        const selectedExercises = allExercises.filter(ex => selectedIds.has(ex.id));
        navigate('/active-workout', { state: { newExercises: selectedExercises }, replace: true });
    };

    const filteredExercises = useMemo(() => {
        return allExercises.filter(ex =>
            ex.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allExercises, searchTerm]);

    const groupedExercises = useMemo(() => {
        return filteredExercises.reduce((acc, ex) => {
            const group = ex.muscleGroup;
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(ex);
            return acc;
        }, {} as Record<string, Exercise[]>);
    }, [filteredExercises]);

    const handleCreateExercise = async (newExerciseData: Omit<Exercise, 'id' | 'createdBy' | 'imageUrl'>) => {
        const newExercise = await api.createExercise(newExerciseData);
        // The mock API mutates the array, so our state reference is already updated.
        // We just need to trigger a re-render with a new array reference.
        // We don't add `newExercise` again, as that would cause a duplicate.
        setAllExercises(prev => [...prev]);
        toggleSelection(newExercise.id);
        setCreateModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-background text-text-light flex flex-col">
            <header className="sticky top-0 bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between border-b border-secondary">
                <button className="p-2 rounded-full hover:bg-secondary transition-colors" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>
                <h1 className="text-xl font-bold">Ajouter des exercices</h1>
                <div className="w-10"></div>
            </header>

            <div className="p-4 sticky top-[73px] bg-background z-10">
                <Input 
                    icon={<Search size={20} />} 
                    placeholder="Rechercher un exercice..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <main className="flex-grow p-4 space-y-4 overflow-y-auto pb-24">
                {loading ? <p>Chargement...</p> : (
                    MUSCLE_GROUPS.map(group => (
                        groupedExercises[group] && (
                            <div key={group}>
                                <h2 className="text-lg font-bold capitalize mb-2">{group}</h2>
                                <div className="space-y-2">
                                    {groupedExercises[group].map(ex => (
                                        <div 
                                            key={ex.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${selectedIds.has(ex.id) ? 'bg-accent/20 border-accent' : 'bg-primary border-secondary'}`}
                                        >
                                            <div 
                                                onClick={() => toggleSelection(ex.id)}
                                                className="flex items-center gap-3 flex-grow cursor-pointer"
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${selectedIds.has(ex.id) ? 'bg-accent border-accent' : 'border-text-dark'}`}>
                                                    {selectedIds.has(ex.id) && <Check size={16} className="text-white"/>}
                                                </div>
                                                <span className="font-medium">{ex.name}</span>
                                            </div>
                                            <Link to={`/exercise/${ex.id}`} className="p-2 text-text-dark hover:text-accent" onClick={e => e.stopPropagation()}>
                                                <Info size={20} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))
                )}
            </main>

            <footer className="sticky bottom-0 bg-primary/80 backdrop-blur-sm p-4 border-t border-secondary grid grid-cols-2 gap-4">
                <Button variant="secondary" onClick={() => setCreateModalOpen(true)}>
                    <Plus size={20} /> Créer un exercice
                </Button>
                <Button onClick={handleAddExercises} disabled={selectedIds.size === 0}>
                    Ajouter ({selectedIds.size})
                </Button>
            </footer>
            
            <CreateExerciseModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setCreateModalOpen(false)} 
                onCreate={handleCreateExercise} 
            />
        </div>
    );
};

const CreateExerciseModal: React.FC<{isOpen: boolean, onClose: () => void, onCreate: (data: Omit<Exercise, 'id' | 'createdBy' | 'imageUrl' | 'equipment'>) => void}> = ({isOpen, onClose, onCreate}) => {
    const [name, setName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState(MUSCLE_GROUPS[0]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !muscleGroup) return;
        onCreate({ name, muscleGroup });
        setName(''); setMuscleGroup(MUSCLE_GROUPS[0]);
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-primary w-full max-w-sm rounded-xl p-6 space-y-4 border border-secondary"
                        onClick={e => e.stopPropagation()}
                    >
                         <h2 className="text-xl font-bold">Créer un exercice</h2>
                         <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Nom de l'exercice" value={name} onChange={e => setName(e.target.value)} required />
                             <div>
                                <label className="block text-sm font-medium text-text mb-1.5">Groupe musculaire</label>
                                <select value={muscleGroup} onChange={e => setMuscleGroup(e.target.value)} className="w-full min-h-11 px-3 py-2 bg-secondary border border-secondary rounded-lg text-text-light">
                                    {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                             </div>
                             <div className="flex gap-2 pt-2">
                                <Button variant="secondary" type="button" onClick={onClose}>Annuler</Button>
                                <Button type="submit">Créer</Button>
                             </div>
                         </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AddExercisePage;