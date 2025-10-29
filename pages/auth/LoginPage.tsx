import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from '../../components/ui';
import { Dumbbell } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Dumbbell className="mx-auto text-accent h-12 w-12" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-light">
            TheProcess
          </h1>
          <p className="mt-2 text-text-dark">Connectez-vous à votre compte</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Mot de passe" required />
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
        <p className="text-center text-sm text-text-dark">
          Pas encore de compte ?{' '}
          <Link to="/auth/signup" className="font-semibold text-accent hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;