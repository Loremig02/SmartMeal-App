import api from './api';

/**
 * Servizio per la gestione delle ricette
 */
const ricetteService = {
  /**
   * Genera una nuova ricetta con AI
   */
  generaRicetta: async (options = {}) => {
    const response = await api.post('/ricette/genera', options);
    return response.data;
  },

  /**
   * Salva una ricetta
   */
  salvaRicetta: async (ricettaData) => {
    const response = await api.post('/ricette', ricettaData);
    return response.data;
  },

  /**
   * Ottiene tutte le ricette salvate
   */
  getAllRicette: async () => {
    const response = await api.get('/ricette');
    return response.data;
  },

  /**
   * Ottiene una singola ricetta
   */
  getRicetta: async (id) => {
    const response = await api.get(`/ricette/${id}`);
    return response.data.ricetta;
  },

  /**
   * Elimina una ricetta
   */
  deleteRicetta: async (id) => {
    const response = await api.delete(`/ricette/${id}`);
    return response.data;
  }
};

export default ricetteService;
