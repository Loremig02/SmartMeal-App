import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Input } from '../components/UI';
import { ChefHat } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Inserisci la tua email');
    if (!password) return setError('Inserisci la password');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      setError('Credenziali non valide');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4 rotate-3">
             <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Accedi a SmartMeal</h1>
          <p className="text-gray-500 text-sm mt-2">Gestisci la tua dispensa senza sprechi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="La tua email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            error={error && !email ? 'Campo richiesto' : ''}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="La tua password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            error={error && !password ? 'Campo richiesto' : ''}
          />
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</div>}
          
          <Button type="submit" loading={loading} className="w-full mt-4" size="lg">
            Accedi
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Non hai un account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">Registrati</Link>
        </div>
      </div>
    </div>
  );
};