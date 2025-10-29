import React from 'react';
import { Card, Button } from './ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalorieSummaryProps {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  formattedDate: string;
  onDateChange: (days: number) => void;
}

const CircularProgress: React.FC<{ value: number; maxValue: number; size: number; strokeWidth: number }> = ({ value, maxValue, size, strokeWidth }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(value / (maxValue || 1), 1);
    const offset = circumference - progress * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    stroke="#2c2c34"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke="url(#gradient)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
                 <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text-light">{Math.max(0, (maxValue || 0) - value)}</span>
                <span className="text-sm text-text-dark">Restantes</span>
            </div>
        </div>
    )
}

const MacroBar: React.FC<{ name: string, value: number, maxValue: number, color: string }> = ({ name, value, maxValue, color }) => {
    const percentage = Math.min((value / (maxValue || 1)) * 100, 100);
    return (
        <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-text-light">{name}</span>
                <span className="text-text-dark">{Math.round(value)} / {maxValue} g</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
                <div 
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${percentage}%`, transition: 'width 0.5s ease-out' }}
                ></div>
            </div>
        </div>
    )
}

const CalorieSummary: React.FC<CalorieSummaryProps> = ({ totals, goals, formattedDate, onDateChange }) => {
  const burnedCalories = 0; // Placeholder for burned calories feature
  
  return (
    <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => onDateChange(-1)} className="p-2 h-auto w-auto"><ChevronLeft size={24} /></Button>
            <h2 className="font-bold text-lg text-text-light text-center">{formattedDate}</h2>
            <Button variant="ghost" onClick={() => onDateChange(1)} className="p-2 h-auto w-auto"><ChevronRight size={24} /></Button>
        </div>

        <div className="border-t border-secondary my-4"></div>

        <div className="flex justify-between items-center text-center">
            <div>
                <p className="text-xl font-bold text-text-light">{totals.calories}</p>
                <p className="text-sm text-text-dark">Mangées</p>
            </div>
            <CircularProgress value={totals.calories} maxValue={goals.calories} size={120} strokeWidth={10} />
            <div>
                <p className="text-xl font-bold text-text-light">{burnedCalories}</p>
                <p className="text-sm text-text-dark">Brûlées</p>
            </div>
        </div>
        <div className="mt-6 space-y-4">
            <MacroBar name="Glucides" value={totals.carbs} maxValue={goals.carbs} color="bg-sky-500" />
            <MacroBar name="Protéines" value={totals.protein} maxValue={goals.protein} color="bg-rose-500" />
            <MacroBar name="Lipides" value={totals.fat} maxValue={goals.fat} color="bg-amber-500" />
        </div>
    </Card>
  );
};

export default CalorieSummary;