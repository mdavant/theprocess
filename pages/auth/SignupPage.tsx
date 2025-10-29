import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from '../../components/ui';
import { Dumbbell } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup logic
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Dumbbell className="mx-auto text-accent h-12 w-12" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-light">
            Rejoignez TheProcess
          </h1>
          <p className="mt-2 text-text-dark">Créez votre compte pour commencer</p>
        </div>
        <form className="space-y-6" onSubmit={handleSignup}>
          <Input type="text" placeholder="Nom d'utilisateur" required />
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Mot de passe" required />
          <Button type="submit" className="w-full">
            Créer mon compte
          </Button>
        </form>
        <p className="text-center text-sm text-text-dark">
          Déjà un membre ?{' '}
          <Link to="/auth/login" className="font-semibold text-accent hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;