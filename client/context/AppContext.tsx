import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alimento, Ricetta, User, ToastMessage, ToastType } from '../types';
import authService from '../src/services/authService';
import alimentiService from '../src/services/alimentiService';
import ricetteService from '../src/services/ricetteService';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  alimenti: Alimento[];
  ricette: Ricetta[];
  toasts: ToastMessage[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nome: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addAlimento: (alimento: Omit<Alimento, 'id' | 'dataInserimento'>) => void;
  updateAlimento: (id: string, dati: Partial<Alimento>) => void;
  removeAlimento: (id: string, tipo: 'consumato' | 'sprecato') => void;
  generaRicetta: (selectedIngredientIds?: string[]) => Promise<Ricetta>;
  salvaRicetta: (ricetta: Ricetta) => void;
  eliminaRicetta: (id: string) => void;
  addToast: (type: ToastType, message: string) => void;
  refreshAlimenti: () => Promise<void>;
  refreshRicette: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [alimenti, setAlimenti] = useState<Alimento[]>([]);
  const [ricette, setRicette] = useState<Ricetta[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          // Load user data
          await refreshAlimenti();
          await refreshRicette();
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.logout();
        }
      }
    };
    checkAuth();
  }, []);

  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, type === 'error' ? 5000 : 3000);
  };

  const refreshAlimenti = async () => {
    try {
      const data = await alimentiService.getAllAlimenti();
      setAlimenti(data.alimenti || []);
    } catch (error) {
      console.error('Error loading alimenti:', error);
    }
  };

  const refreshRicette = async () => {
    try {
      const data = await ricetteService.getAllRicette();
      setRicette(data.ricette || []);
    } catch (error) {
      console.error('Error loading ricette:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      addToast('success', `Bentornato, ${response.user.nome}!`);
      // Load user data
      await refreshAlimenti();
      await refreshRicette();
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Errore durante il login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.register(nome, email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      addToast('success', 'Account creato con successo!');
      // Initialize empty data for new user
      setAlimenti([]);
      setRicette([]);
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Errore durante la registrazione');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    setAlimenti([]);
    setRicette([]);
    addToast('info', 'Disconnesso con successo');
  };

  const addAlimento = async (dati: Omit<Alimento, 'id' | 'dataInserimento'>) => {
    setLoading(true);
    try {
      await alimentiService.createAlimento(dati);
      await refreshAlimenti();
      addToast('success', 'Alimento aggiunto con successo');
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Errore durante l\'aggiunta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAlimento = async (id: string, dati: Partial<Alimento>) => {
    setLoading(true);
    try {
      await alimentiService.updateAlimento(id, dati);
      await refreshAlimenti();
      addToast('success', 'Alimento modificato con successo');
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Errore durante la modifica');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeAlimento = async (id: string, tipo: 'consumato' | 'sprecato') => {
    setLoading(true);
    try {
      await alimentiService.deleteAlimento(id, tipo === 'consumato' ? 'Consumato' : 'Sprecato');
      await refreshAlimenti();
      if (tipo === 'consumato') {
        addToast('success', 'Alimento segnato come consumato');
      } else {
        addToast('warning', 'Alimento segnato come sprecato');
      }
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Errore durante l\'eliminazione');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generaRicetta = async (selectedIngredientIds?: string[]) => {
    setLoading(true);
    try {
      const response = await ricetteService.generaRicetta({ selectedIngredientIds });
      addToast('success', 'Ricetta generata con successo!');
      return response.ricetta;
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Errore durante la generazione della ricetta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const salvaRicetta = async (ricetta: Ricetta) => {
    setLoading(true);
    try {
      console.log('Salvando ricetta:', ricetta);
      console.log('Ingredienti:', ricetta.ingredienti);
      console.log('Procedimento:', ricetta.procedimento);
      await ricetteService.salvaRicetta(ricetta);
      await refreshRicette();
      addToast('success', 'Ricetta salvata con successo');
    } catch (error: any) {
      console.error('Errore salvataggio completo:', error);
      console.error('Response data:', error.response?.data);

      // Handle both string and array error details
      let errorMessage = 'Errore durante il salvataggio';
      if (error.response?.data?.details) {
        if (typeof error.response.data.details === 'string') {
          errorMessage = error.response.data.details;
        } else if (Array.isArray(error.response.data.details)) {
          // details is an array of {field, message} objects
          errorMessage = error.response.data.details
            .map((err: any) => err.message || JSON.stringify(err))
            .join('; ');
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      addToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const eliminaRicetta = async (id: string) => {
    setLoading(true);
    try {
      await ricetteService.deleteRicetta(id);
      await refreshRicette();
      addToast('info', 'Ricetta eliminata');
    } catch (error: any) {
      addToast('error', error.response?.data?.error || 'Errore durante l\'eliminazione');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user, isAuthenticated, alimenti, ricette, toasts, loading,
      login, register, logout, addAlimento, updateAlimento, removeAlimento,
      generaRicetta, salvaRicetta, eliminaRicetta, addToast,
      refreshAlimenti, refreshRicette
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
