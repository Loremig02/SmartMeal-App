import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Input } from '../components/UI';
import { ChefHat } from 'lucide-react';

export const Register: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conferma, setConferma] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, loading } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!nome) newErrors.nome = 'Inserisci il tuo nome';
    if (!email) newErrors.email = 'Inserisci la tua email';
    if (!password || password.length < 6) newErrors.password = 'Minimo 6 caratteri';
    if (password !== conferma) newErrors.conferma = 'Le password non coincidono';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await register(nome, email, password);
      navigate('/dashboard');
    } catch (e) {
      // Handle generic error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <ChefHat className="w-7 h-7 text-primary-500" />
            </div>
          <h1 className="text-2xl font-bold text-gray-900">Crea il tuo account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input 
            label="Nome e Cognome" 
            placeholder="Il tuo nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            error={errors.nome}
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="La tua email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="Crea una password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
          />
          <Input 
            label="Conferma Password" 
            type="password" 
            placeholder="Ripeti la password"
            value={conferma}
            onChange={e => setConferma(e.target.value)}
            error={errors.conferma}
          />
          
          <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
            Registrati
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Hai già un account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Accedi</Link>
        </div>
      </div>
    </div>
  );
};