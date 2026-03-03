import api from './api';

/**
 * Servizio per la dashboard
 */
const dashboardService = {
  /**
   * Ottiene il riepilogo completo della dashboard
   */
  getRiepilogo: async () => {
    const response = await api.get('/dashboard/riepilogo');
    return response.data;
  },

  /**
   * Ottiene statistiche aggregate
   */
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data.stats;
  },

  /**
   * Ottiene il trend temporale
   */
  getTrend: async (giorni = 30) => {
    const response = await api.get('/dashboard/trend', { params: { giorni } });
    return response.data.trend;
  },

  /**
   * Ottiene statistiche settimanali
   */
  getStatisticheSettimanali: async () => {
    const response = await api.get('/dashboard/settimanali');
    return response.data.settimanali;
  }
};

export default dashboardService;
