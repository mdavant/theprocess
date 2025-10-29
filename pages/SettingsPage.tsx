
import React from 'react';
import Header from '../components/Header';
import { Card, Button } from '../components/ui';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const isPremium = true; // Mock data
  const navigate = useNavigate();

  const handleManageSubscription = () => {
    // TODO: Stripe / Gumroad integration
    alert('Redirection vers la page de gestion de l\'abonnement.');
  };

  return (
    <div className="min-h-screen bg-background">
        <div className="p-4">
            <Header title="Réglages" />
            <div className="space-y-6 mt-4">
                
                <Card>
                    <h2 className="text-lg font-bold text-text-light mb-4">Compte</h2>
                    <ul className="divide-y divide-secondary">
                        <SettingsItem label="Modifier le profil" />
                        <SettingsItem label="Changer le mot de passe" />
                         <SettingsItem label="Mes objectifs nutritionnels" onClick={() => navigate('/onboarding')} />
                        <SettingsItem label="Notifications" />
                    </ul>
                </Card>

                <Card>
                    <h2 className="text-lg font-bold text-text-light mb-2">Abonnement TheProcess</h2>
                    {isPremium ? (
                        <>
                            <p className="text-text mb-4">Vous êtes un membre Premium. Merci pour votre soutien !</p>
                            <Button variant="secondary" onClick={handleManageSubscription}>Gérer mon abonnement</Button>
                        </>
                    ) : (
                        <>
                            <p className="text-text mb-4">Passez à Premium pour débloquer des statistiques avancées, plus d'options de planification et supprimer les publicités.</p>
                            <Button onClick={handleManageSubscription}>Passer à Premium</Button>
                        </>
                    )}
                </Card>

                <Card>
                    <h2 className="text-lg font-bold text-text-light mb-4">Autre</h2>
                    <ul className="divide-y divide-secondary">
                        <SettingsItem label="Politique de confidentialité" />
                        <SettingsItem label="Conditions d'utilisation" />
                        <SettingsItem label="Aide & Support" />
                    </ul>
                </Card>
                
                <Button variant="ghost" className="text-red-500">
                    Se déconnecter
                </Button>
            </div>
        </div>
    </div>
  );
};

const SettingsItem: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
    <li className="flex justify-between items-center py-3 cursor-pointer" onClick={onClick}>
        <span className="text-text-light">{label}</span>
        <ChevronRight className="text-text-dark" size={20} />
    </li>
);

export default SettingsPage;
