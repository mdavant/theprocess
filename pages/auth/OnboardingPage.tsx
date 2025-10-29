
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '../../components/ui';
import { Dumbbell } from 'lucide-react';
import { UserProfile } from '../../types';
import { ACTIVITY_LEVELS, GOALS } from '../../constants';
import { calculateMacros } from '../../utils/macros';
import { motion, AnimatePresence } from 'framer-motion';

type OnboardingData = Partial<UserProfile>;

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(() => {
        const savedProfile = localStorage.getItem('userProfile');
        return savedProfile ? JSON.parse(savedProfile) : {
            gender: 'male',
            goal: 'maintain',
            activityLevel: 1.55,
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = () => {
        const macroGoals = calculateMacros(data as UserProfile);
        localStorage.setItem('userProfile', JSON.stringify(data));
        localStorage.setItem('userMacroGoals', JSON.stringify(macroGoals));
        localStorage.setItem('onboardingComplete', 'true');
        navigate('/');
    };
    
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    
    const isStep1Valid = data.age && data.height && data.weight;
    
    const slideVariants = {
        hidden: { opacity: 0, x: 300 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -300 },
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <Dumbbell className="mx-auto text-accent h-10 w-10" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-light">
                      Votre Profil
                    </h1>
                    <p className="mt-2 text-text-dark">Aidez-nous à personnaliser votre expérience.</p>
                </div>

                <div className="relative overflow-hidden h-96">
                    <AnimatePresence>
                        {step === 1 && (
                             <motion.div key={1} variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute w-full space-y-4">
                                <h2 className="font-semibold text-center text-lg">Informations générales</h2>
                                <select name="gender" value={data.gender} onChange={handleChange} className="w-full min-h-11 px-3 py-2 bg-primary border border-secondary rounded-lg text-text-light">
                                    <option value="male">Homme</option>
                                    <option value="female">Femme</option>
                                </select>
                                <Input name="age" type="number" placeholder="Âge" value={data.age || ''} onChange={handleChange} required />
                                <Input name="height" type="number" placeholder="Taille (cm)" value={data.height || ''} onChange={handleChange} required />
                                <Input name="weight" type="number" placeholder="Poids (kg)" value={data.weight || ''} onChange={handleChange} required />
                                <Button onClick={nextStep} disabled={!isStep1Valid}>Suivant</Button>
                            </motion.div>
                        )}
                        {step === 2 && (
                             <motion.div key={2} variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute w-full space-y-4">
                                <h2 className="font-semibold text-center text-lg">Votre style de vie</h2>
                                <label className="block text-sm font-medium text-text mb-1.5">Niveau d'activité</label>
                                <select name="activityLevel" value={data.activityLevel} onChange={handleChange} className="w-full min-h-11 px-3 py-2 bg-primary border border-secondary rounded-lg text-text-light">
                                    {Object.entries(ACTIVITY_LEVELS).map(([key, level]) => <option key={key} value={level.value}>{level.label}</option>)}
                                </select>
                                <label className="block text-sm font-medium text-text mb-1.5 mt-4">Objectif principal</label>
                                <select name="goal" value={data.goal} onChange={handleChange} className="w-full min-h-11 px-3 py-2 bg-primary border border-secondary rounded-lg text-text-light">
                                    {Object.entries(GOALS).map(([key, goal]) => <option key={key} value={key}>{goal.label}</option>)}
                                </select>
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={prevStep}>Précédent</Button>
                                    <Button onClick={nextStep}>Suivant</Button>
                                </div>
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div key={3} variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute w-full space-y-4">
                                <h2 className="font-semibold text-center text-lg">Affiner votre objectif (Optionnel)</h2>
                                <Input name="targetWeight" type="number" placeholder="Poids visé (kg)" value={data.targetWeight || ''} onChange={handleChange} />
                                <Input name="deadline" type="date" label="Échéance" value={data.deadline || ''} onChange={handleChange} />
                                <p className="text-xs text-text-dark text-center">Cette étape permet d'affiner le calcul de vos besoins caloriques.</p>
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={prevStep}>Précédent</Button>
                                    <Button onClick={handleSubmit}>Terminer & Calculer</Button>
                                </div>
                                <Button variant="ghost" onClick={handleSubmit}>Passer cette étape</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
