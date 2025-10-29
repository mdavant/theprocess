
import React from 'react';
import Header from '../components/Header';
import { Card, Button } from '../components/ui';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  // Mock data, replace with API call
  const user = {
    username: 'JohnFit',
    avatarUrl: 'https://picsum.photos/seed/johnfit/200',
    bio: 'Lifting heavy things and eating clean. Following TheProcess.',
    stats: {
      workouts: 52,
      followers: 125,
      following: 89,
    },
    isPremium: true
  };

  return (
    <div>
      <Header title="Profil" actions={
        <button onClick={() => navigate('/settings')} className="p-2 rounded-full hover:bg-secondary">
          <Settings size={22} />
        </button>
      } />
      <div className="mt-4 space-y-6">
        <Card className="flex flex-col items-center text-center">
            <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-accent" />
            <h2 className="text-2xl font-bold text-text-light mt-4">{user.username}</h2>
            {user.isPremium && <span className="text-xs font-semibold bg-accent text-white px-2 py-0.5 rounded-full mt-1">PREMIUM</span>}
            <p className="text-text mt-2 max-w-md">{user.bio}</p>
        </Card>
        
        <Card>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-text-light">{user.stats.workouts}</p>
                    <p className="text-sm text-text-dark">Séances</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-text-light">{user.stats.followers}</p>
                    <p className="text-sm text-text-dark">Abonnés</p>
                </div>
                 <div>
                    <p className="text-2xl font-bold text-text-light">{user.stats.following}</p>
                    <p className="text-sm text-text-dark">Abonnements</p>
                </div>
            </div>
        </Card>

        {/* TODO: Social features implementation */}
         <Card>
            <h3 className="text-lg font-bold text-text-light mb-2">Découvrir</h3>
            <p className="text-text-dark">Trouvez et suivez d'autres utilisateurs pour voir leur progression. (Fonctionnalité à venir)</p>
        </Card>

      </div>
    </div>
  );
};

export default ProfilePage;
