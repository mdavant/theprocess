
import React from 'react';
import Header from '../components/Header';
import ProgressChart from '../components/ProgressChart';
import { Card } from '../components/ui';

// Mock data for charts
const mockWeightData = [
  { name: 'Jan', weight: 80 },
  { name: 'Fev', weight: 81 },
  { name: 'Mar', weight: 80.5 },
  { name: 'Avr', weight: 82 },
  { name: 'Mai', weight: 83 },
];

const mockVolumeData = [
  { name: 'Sem 1', volume: 10500 },
  { name: 'Sem 2', volume: 11000 },
  { name: 'Sem 3', volume: 10800 },
  { name: 'Sem 4', volume: 11500 },
  { name: 'Sem 5', volume: 12000 },
];

const ProgressPage: React.FC = () => {
  return (
    <div>
      <Header title="Progrès" />
      <div className="space-y-6 mt-4">
        <Card>
            <h2 className="text-lg font-bold text-text-light mb-4">Poids du corps (kg)</h2>
            <ProgressChart data={mockWeightData} dataKey="weight" color="#d97706" />
        </Card>
        <Card>
            <h2 className="text-lg font-bold text-text-light mb-4">Volume d'entraînement (kg)</h2>
            <ProgressChart data={mockVolumeData} dataKey="volume" color="#d97706" />
        </Card>
        
        {/* TODO: Implement measurements and photos tabs */}
        <Card>
            <h2 className="text-lg font-bold text-text-light">Mensurations</h2>
            <p className="text-text-dark mt-2">Section pour suivre les mensurations (biceps, tour de taille, etc.) à venir.</p>
        </Card>
         <Card>
            <h2 className="text-lg font-bold text-text-light">Photos de progression</h2>
            <p className="text-text-dark mt-2">Section pour uploader et comparer des photos de progression à venir.</p>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
