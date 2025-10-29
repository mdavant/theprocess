import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Exercise, WorkoutSet } from '../types';
import { ArrowLeft, History, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Metric = 'est1rm' | 'maxWeight' | 'volume' | 'maxReps';
type TimeFilter = '3m' | '6m' | 'all';

// Epley formula for 1RM estimation
const calculate1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
};

const ExerciseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [history, setHistory] = useState<{ date: string; sets: WorkoutSet[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'history' | 'progress'>('progress');
    const [selectedMetric, setSelectedMetric] = useState<Metric>('est1rm');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('3m');

    useEffect(() => {
        if (!id) {
            navigate('/workouts');
            return;
        }
        const fetchData = async () => {
            try {
                const { exercise, history } = await api.getExerciseHistoryAndDetails(id);
                setExercise(exercise || null);
                setHistory(history);
            } catch (error) {
                console.error("Failed to fetch exercise details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);
    
    const progressData = useMemo(() => {
        let data = history.map(({ date, sets }) => {
            const validSets = sets.filter(s => s.weight > 0 && s.reps > 0);
            if (validSets.length === 0) return null;

            const sessionDate = new Date(date);
            const est1rm = Math.max(...validSets.map(s => calculate1RM(s.weight, s.reps)));
            const maxWeight = Math.max(...validSets.map(s => s.weight));
            const volume = validSets.reduce((sum, s) => sum + s.weight * s.reps, 0);
            const maxReps = Math.max(...validSets.map(s => s.reps));

            return { date: sessionDate, name: sessionDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric'}), est1rm, maxWeight, volume, maxReps };
        }).filter(Boolean).sort((a,b) => a!.date.getTime() - b!.date.getTime());

        if (timeFilter !== 'all') {
            const now = new Date();
            let filterDate: Date | null = null;
            if (timeFilter === '3m') {
                filterDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            } else if (timeFilter === '6m') {
                filterDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            }
    
            if (filterDate) {
                data = data.filter(d => d!.date >= filterDate);
            }
        }
        
        return data as NonNullable<typeof data[0]>[];
    }, [history, timeFilter]);
    
    const kpiData = useMemo(() => {
        if (progressData.length === 0) return { est1rm: 0, maxWeight: 0, volume: 0, maxReps: 0 };
        return {
            est1rm: Math.max(...progressData.map(d => d.est1rm)),
            maxWeight: Math.max(...progressData.map(d => d.maxWeight)),
            volume: Math.max(...progressData.map(d => d.volume)),
            maxReps: Math.max(...progressData.map(d => d.maxReps)),
        };
    }, [progressData]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-light">Chargement...</div>;
    if (!exercise) return <div className="min-h-screen bg-background flex items-center justify-center text-text-light">Exercice non trouvé.</div>;

    const metricConfig = {
        est1rm: { label: 'Est 1RM (kg)', dataKey: 'est1rm', color: '#38bdf8' },
        maxWeight: { label: 'Poids maximal (kg)', dataKey: 'maxWeight', color: '#fb7185' },
        volume: { label: 'Volume (kg)', dataKey: 'volume', color: '#a78bfa' },
        maxReps: { label: 'Répétitions maximales', dataKey: 'maxReps', color: '#facc15' },
    }

    const renderChart = () => {
        const ChartComponent = selectedMetric === 'volume' ? BarChart : LineChart;
        const ChartElement = selectedMetric === 'volume' ? Bar : Line;
        const { dataKey, color } = metricConfig[selectedMetric];

        return (
            <ResponsiveContainer width="100%" height={250}>
                <ChartComponent data={progressData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c34" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} domain={['dataMin - 5', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid #2c2c34' }} labelStyle={{ color: '#f3f4f6' }} />
                    <ChartElement type="monotone" dataKey={dataKey} stroke={color} fill={color} strokeWidth={2} activeDot={{ r: 8 }} />
                </ChartComponent>
            </ResponsiveContainer>
        );
    }
    
    return (
        <div className="min-h-screen bg-background text-text-light flex flex-col">
            <header className="sticky top-0 bg-background/80 backdrop-blur-sm p-4 flex items-center border-b border-secondary z-20">
                <Button variant="ghost" className="w-auto h-auto p-2 mr-2" onClick={() => navigate(-1)}><ArrowLeft size={24} /></Button>
                <h1 className="text-xl font-bold">{exercise.name}</h1>
            </header>

            <div className="flex-shrink-0 border-b border-secondary">
                <div className="flex">
                    <button 
                        onClick={() => setActiveTab('progress')} 
                        className={`w-1/2 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none ${activeTab === 'progress' ? 'text-accent border-b-2 border-accent' : 'text-text-dark hover:text-text-light'}`}
                    >
                        <BarChart2 size={16}/>
                        <span>Progrès</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')} 
                        className={`w-1/2 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none ${activeTab === 'history' ? 'text-accent border-b-2 border-accent' : 'text-text-dark hover:text-text-light'}`}
                    >
                        <History size={16}/>
                        <span>Historique</span>
                    </button>
                </div>
            </div>

            <main className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'progress' && (
                    <div className="space-y-4">
                        <div className="flex bg-primary p-1 rounded-lg">
                           {(['3m', '6m', 'all'] as TimeFilter[]).map(filter => (
                               <button key={filter} onClick={() => setTimeFilter(filter)} className={`w-full py-2 text-sm rounded-md transition-colors ${timeFilter === filter ? 'bg-secondary text-text-light' : 'text-text-dark'}`}>
                                   {filter === '3m' ? '3 mois' : filter === '6m' ? '6 mois' : 'Toujours'}
                               </button>
                           ))}
                        </div>
                        
                        <div>{renderChart()}</div>

                        <div className="grid grid-cols-2 gap-3">
                           {(Object.keys(kpiData) as Metric[]).map(key => (
                               <div key={key} onClick={() => setSelectedMetric(key)} className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedMetric === key ? 'border-accent bg-accent/10' : 'border-secondary bg-primary'}`}>
                                   <p className="text-sm text-text-dark">{metricConfig[key].label}</p>
                                   <p className="text-2xl font-bold text-text-light">{kpiData[key]}</p>
                               </div>
                           ))}
                        </div>
                    </div>
                )}
                {activeTab === 'history' && (
                    <div className="space-y-4">
                        {history.length > 0 ? history.map((entry, idx) => (
                             <div key={idx} className="bg-primary border border-secondary rounded-xl p-4">
                                <p className="font-bold mb-2">{new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <div className="space-y-1 text-sm">
                                    {entry.sets.map((set, setIdx) => (
                                        <p key={setIdx} className="text-text">Série {setIdx + 1}: <span className="font-semibold text-text-light">{set.weight}kg x {set.reps} reps</span></p>
                                    ))}
                                </div>
                             </div>
                        )) : <p className="text-center text-text-dark">Aucun historique pour cet exercice.</p>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExerciseDetailPage;