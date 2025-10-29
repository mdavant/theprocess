
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, Button, Input } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'planning' | 'todo';

const OrganizationPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('planning');

    return (
        <div>
            <Header title="Organisation" />
            <div className="mt-4">
                <div className="flex bg-primary p-1 rounded-lg">
                    <button onClick={() => setActiveTab('planning')} className={`w-full py-2 rounded-md transition-colors ${activeTab === 'planning' ? 'bg-accent text-white' : 'text-text'}`}>Planning</button>
                    <button onClick={() => setActiveTab('todo')} className={`w-full py-2 rounded-md transition-colors ${activeTab === 'todo' ? 'bg-accent text-white' : 'text-text'}`}>To-do List</button>
                </div>

                <div className="mt-6">
                    {activeTab === 'planning' ? <PlanningView /> : <TodoView />}
                </div>
            </div>
        </div>
    );
};

const PlanningView: React.FC = () => {
    // Mock data for planning
    const events = [
        { time: '07:00', title: 'Réveil & Méditation', color: 'bg-blue-500' },
        { time: '08:00', title: 'Petit-déjeuner', color: 'bg-yellow-500' },
        { time: '09:00 - 12:00', title: 'Travail (Deep Work)', color: 'bg-red-500' },
        { time: '12:30', title: 'Déjeuner', color: 'bg-yellow-500' },
        { time: '14:00 - 17:00', title: 'Travail (Réunions)', color: 'bg-red-500' },
        { time: '18:00 - 19:30', title: 'Entraînement : Push Day', color: 'bg-green-500' },
        { time: '20:00', title: 'Dîner', color: 'bg-yellow-500' },
    ];
    return (
        <Card>
            <h2 className="text-lg font-bold text-text-light mb-4">Planning du jour</h2>
            <div className="space-y-3">
                {events.map(event => (
                    <div key={event.time} className="flex items-center gap-4">
                        <span className="w-24 text-right text-text-dark font-medium">{event.time}</span>
                        <div className={`flex-1 p-3 rounded-lg flex items-center ${event.color}`}>
                            <span className="font-semibold text-white">{event.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const TodoView: React.FC = () => {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Préparer les repas de la semaine', completed: false },
        { id: 2, text: 'Acheter de nouvelles chaussures de sport', completed: false },
        { id: 3, text: 'Planifier la séance de jambes de vendredi', completed: true },
    ]);
    const [newTodo, setNewTodo] = useState('');

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };
    
    const addTodo = () => {
        if(newTodo.trim()){
            setTodos([...todos, {id: Date.now(), text: newTodo, completed: false}]);
            setNewTodo('');
        }
    };

    return (
        <Card>
            <h2 className="text-lg font-bold text-text-light mb-4">To-do List</h2>
            <div className="flex gap-2 mb-4">
                <Input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Nouvelle tâche..."/>
                <Button onClick={addTodo} className="w-auto px-4">Ajouter</Button>
            </div>
            <ul className="space-y-3">
                <AnimatePresence>
                {todos.map(todo => (
                    <motion.li 
                        key={todo.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                    >
                        <motion.button whileTap={{ scale: 1.2 }} onClick={() => toggleTodo(todo.id)}>
                            <div className={`w-6 h-6 rounded-full border-2 ${todo.completed ? 'border-accent bg-accent' : 'border-text-dark'} flex items-center justify-center`}>
                                {todo.completed && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-3 h-3 bg-white rounded-full"/>}
                            </div>
                        </motion.button>
                        <span className={`flex-1 ${todo.completed ? 'line-through text-text-dark' : 'text-text-light'}`}>{todo.text}</span>
                    </motion.li>
                ))}
                </AnimatePresence>
            </ul>
        </Card>
    );
}

export default OrganizationPage;
