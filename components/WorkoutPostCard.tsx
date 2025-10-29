import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Workout, User } from '../types';
import { MoreHorizontal, Trash2, Pencil, ThumbsUp, MessageCircle, Share2, Trophy, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkoutPostCardProps {
  workout: Workout;
  user: User;
  onDelete: () => void;
  onModify: () => void;
}

const WorkoutPostCard: React.FC<WorkoutPostCardProps> = ({ workout, user, onDelete, onModify }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const workoutDate = new Date(workout.date);
    const formattedDate = workoutDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) + ' à ' + workoutDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };
    
    const exerciseSummary = workout.exercises.slice(0, 3).map(ex => ({
        name: ex.name,
        sets: ex.sets.length,
    }));

    return (
        <div className="bg-primary rounded-xl p-4 text-text-light font-sans flex flex-col gap-4 border border-secondary shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-grow">
                    <p className="font-bold">{user.username}</p>
                    <p className="text-sm text-text-dark">{formattedDate}</p>
                </div>
                <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-secondary">
                        <MoreHorizontal />
                    </button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-secondary rounded-lg shadow-xl z-10"
                                onMouseLeave={() => setMenuOpen(false)}
                            >
                                <ul className="p-1">
                                    <li>
                                        <button onClick={() => { onModify(); setMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent">
                                            <Pencil size={16} /> Modifier
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md text-red-500 hover:bg-accent hover:text-white">
                                            <Trash2 size={16} /> Supprimer
                                        </button>
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold capitalize">{workout.name}</h2>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1 text-center py-2">
                <div>
                    <p className="text-sm text-text-dark">Durée</p>
                    <p className="text-xl font-bold">{formatDuration(workout.durationMinutes)}</p>
                </div>
                <div>
                    <p className="text-sm text-text-dark">Volume</p>
                    <p className="text-xl font-bold">{workout.volumeKg.toLocaleString('fr-FR')} kg</p>
                </div>
                <div>
                    <p className="text-sm text-text-dark">Records</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <Trophy size={18} className="text-yellow-400" fill="currentColor" />
                        <span className="text-xl font-bold">{workout.recordsCount || 0}</span>
                    </div>
                </div>
            </div>

             {/* Exercise Summary */}
            <div className="space-y-2 border-t border-b border-secondary py-3">
                {exerciseSummary.map((ex, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <Dumbbell size={14} className="text-accent" />
                        <span className="font-semibold text-text-light">{ex.sets} x</span>
                        <span className="text-text">{ex.name}</span>
                    </div>
                ))}
            </div>

            {/* View Details Button */}
            <Link to={`/workout/${workout.id}`} className="w-full text-center py-2 text-sm font-semibold text-accent rounded-lg hover:bg-secondary transition-colors">
                Voir le détail
            </Link>

            {/* Footer */}
            <div className="border-t border-secondary pt-1">
                 <div className="flex justify-around w-full max-w-xs mx-auto">
                    <button className="text-text-dark hover:text-text-light transition-colors p-2 rounded-full hover:bg-secondary"><ThumbsUp size={20} /></button>
                    <button className="text-text-dark hover:text-text-light transition-colors p-2 rounded-full hover:bg-secondary"><MessageCircle size={20} /></button>
                    <button className="text-text-dark hover:text-text-light transition-colors p-2 rounded-full hover:bg-secondary"><Share2 size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutPostCard;
