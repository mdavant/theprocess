import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button } from '../components/ui';
import { api } from '../services/api';
import { MealType, NutritionEntry, MacroGoals } from '../types';
import { Plus, Coffee, Soup, Salad, Apple as AppleIcon, Pencil, Trash2, ChevronDown } from 'lucide-react';
import CalorieSummary from '../components/CalorieSummary';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NutritionPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [entries, setEntries] = useState<NutritionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [macroGoals, setMacroGoals] = useState<MacroGoals | null>(null);
    const [expandedMeal, setExpandedMeal] = useState<MealType | null>(null);

    useEffect(() => {
        const storedGoals = localStorage.getItem('userMacroGoals');
        if (storedGoals) {
            setMacroGoals(JSON.parse(storedGoals));
        }
    }, []);

    useEffect(() => {
        const dateString = selectedDate.toISOString().split('T')[0];
        setLoading(true);
        api.getNutritionForDate(dateString)
            .then(setEntries)
            .catch(err => console.error("Failed to fetch nutrition data", err))
            .finally(() => setLoading(false));
    }, [selectedDate]);

    const handleDateChange = (days: number) => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        });
    };
    
    const formattedDate = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const selectedDay = new Date(selectedDate);
        selectedDay.setHours(0,0,0,0);

        if (today.getTime() === selectedDay.getTime()) return "Aujourd'hui";
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (yesterday.getTime() === selectedDay.getTime()) return "Hier";

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        if (tomorrow.getTime() === selectedDay.getTime()) return "Demain";
        
        return selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
    }, [selectedDate]);

    const totals = useMemo(() => {
        return entries.reduce((acc, entry) => {
            acc.calories += entry.calories;
            acc.protein += entry.protein;
            acc.carbs += entry.carbs;
            acc.fat += entry.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [entries]);

    const entriesByMeal = useMemo(() => {
        return entries.reduce((acc, entry) => {
            if (!acc[entry.mealType]) {
                acc[entry.mealType] = [];
            }
            acc[entry.mealType].push(entry);
            return acc;
        }, {} as Record<MealType, NutritionEntry[]>);
    }, [entries]);
    
    const toggleMeal = (meal: MealType) => {
        setExpandedMeal(prev => prev === meal ? null : meal);
    };

    const handleAddFood = (mealType: MealType) => {
        alert(`Ajouter un aliment pour: ${mealType}`);
    };

    const handleEditFood = (entryId: string) => {
        alert(`Modifier l'aliment ID: ${entryId}`);
    };

    const handleDeleteFood = (entryId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet aliment ?")) {
            setEntries(prev => prev.filter(e => e.id !== entryId));
            // In a real app, you would also make an API call here to delete the entry from the backend.
        }
    };


    const mealIcons: Record<MealType, React.ReactNode> = {
      [MealType.Breakfast]: <Coffee size={24} className="text-text-dark" />,
      [MealType.Lunch]: <Soup size={24} className="text-text-dark" />,
      [MealType.Dinner]: <Salad size={24} className="text-text-dark" />,
      [MealType.Snack]: <AppleIcon size={24} className="text-text-dark" />,
    };

    if (!macroGoals) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <h2 className="text-xl font-bold mb-4">Définissez vos objectifs nutritionnels</h2>
                <p className="mb-6 text-text-dark">Pour commencer à suivre votre nutrition, veuillez compléter votre profil.</p>
                <Link to="/onboarding"><Button>Commencer</Button></Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <CalorieSummary totals={totals} goals={macroGoals} formattedDate={formattedDate} onDateChange={handleDateChange} />
            
            {Object.values(MealType).map(meal => {
                const isExpanded = expandedMeal === meal;
                const mealEntries = entriesByMeal[meal] || [];
                const mealCalories = mealEntries.reduce((sum, e) => sum + e.calories, 0);
                const goalCalories = Math.round(macroGoals.calories * (meal === MealType.Breakfast ? 0.3 : meal === MealType.Lunch ? 0.4 : meal === MealType.Dinner ? 0.25 : 0.05));
                
                return (
                     <Card key={meal}>
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMeal(meal)}>
                           <div className="flex items-center gap-4">
                             <div className="bg-secondary p-3 rounded-full">
                                {mealIcons[meal]}
                             </div>
                             <div>
                                <h3 className="text-lg font-semibold">{meal}</h3>
                                <p className="text-sm text-text-dark">{mealCalories} / {goalCalories} kcal</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAddFood(meal); }} 
                                    className="p-3 rounded-full bg-accent text-white hover:bg-accent-hover"
                                    aria-label={`Ajouter un aliment pour ${meal}`}
                                >
                                    <Plus size={20}/>
                                </button>
                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                    <ChevronDown size={24} className="text-text-dark"/>
                                </motion.div>
                           </div>
                        </div>
                        <AnimatePresence>
                        {isExpanded && mealEntries.length > 0 && (
                            <motion.ul 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 mt-4 pt-4 border-t border-secondary overflow-hidden"
                            >
                                {mealEntries.map(entry => (
                                    <li key={entry.id} className="flex justify-between items-center text-sm hover:bg-secondary p-2 rounded-md">
                                        <div>
                                            <span className="text-text-light">{entry.foodName}</span>
                                            <span className="text-text-dark ml-2">({entry.quantity})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-text-light">{entry.calories} kcal</span>
                                            <button onClick={(e) => { e.stopPropagation(); handleEditFood(entry.id); }} className="p-1 text-text-dark hover:text-accent" aria-label={`Modifier ${entry.foodName}`}><Pencil size={16} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteFood(entry.id); }} className="p-1 text-text-dark hover:text-red-500" aria-label={`Supprimer ${entry.foodName}`}><Trash2 size={16} /></button>
                                        </div>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                        </AnimatePresence>
                    </Card>
                )
            })}
        </div>
    );
};

export default NutritionPage;