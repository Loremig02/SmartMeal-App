import * as dashboardService from '../services/dashboard.service.js';

/**
 * Ottiene statistiche aggregate
 */
export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

/**
 * Ottiene trend temporale
 */
export const getTrend = async (req, res, next) => {
  try {
    const giorni = parseInt(req.query.giorni) || 30;

    if (giorni < 1 || giorni > 365) {
      return res.status(400).json({
        error: 'Il parametro giorni deve essere tra 1 e 365'
      });
    }

    const trend = await dashboardService.getTrendTemporale(req.user.id, giorni);

    res.json({ trend });
  } catch (error) {
    next(error);
  }
};

/**
 * Ottiene statistiche settimanali
 */
export const getStatisticheSettimanali = async (req, res, next) => {
  try {
    const settimanali = await dashboardService.getStatisticheSettimanali(req.user.id);

    res.json({ settimanali });
  } catch (error) {
    next(error);
  }
};

/**
 * Ottiene riepilogo completo dashboard
 */
export const getRiepilogo = async (req, res, next) => {
  try {
    const riepilogo = await dashboardService.getRiepilogoDashboard(req.user.id);

    res.json(riepilogo);
  } catch (error) {
    next(error);
  }
};
