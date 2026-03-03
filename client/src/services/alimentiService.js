import api from './api';

/**
 * Servizio per la gestione degli alimenti
 */
const alimentiService = {
  /**
   * Ottiene tutti gli alimenti
   */
  getAllAlimenti: async (orderBy = 'scadenza') => {
    const response = await api.get('/alimenti', { params: { orderBy } });
    return response.data;
  },

  /**
   * Ottiene un singolo alimento
   */
  getAlimento: async (id) => {
    const response = await api.get(`/alimenti/${id}`);
    return response.data.alimento;
  },

  /**
   * Crea un nuovo alimento
   */
  createAlimento: async (alimentoData) => {
    const response = await api.post('/alimenti', alimentoData);
    return response.data;
  },

  /**
   * Aggiorna un alimento
   */
  updateAlimento: async (id, alimentoData) => {
    const response = await api.put(`/alimenti/${id}`, alimentoData);
    return response.data;
  },

  /**
   * Elimina un alimento
   */
  deleteAlimento: async (id, tipoEvento) => {
    const response = await api.delete(`/alimenti/${id}`, {
      data: { tipoEvento }
    });
    return response.data;
  },

  /**
   * Ottiene statistiche sugli alimenti
   */
  getStats: async () => {
    const response = await api.get('/alimenti/stats');
    return response.data.stats;
  }
};

export default alimentiService;
