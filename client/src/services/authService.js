import api from './api';

/**
 * Servizio di autenticazione
 */
const authService = {
  /**
   * Registra un nuovo utente
   */
  register: async (nome, email, password) => {
    const response = await api.post('/auth/register', { nome, email, password });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Effettua il login
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Effettua il logout
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  /**
   * Ottiene i dati dell'utente corrente
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  /**
   * Verifica se l'utente è autenticato
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export default authService;
