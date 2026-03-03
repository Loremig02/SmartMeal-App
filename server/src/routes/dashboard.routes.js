import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

// GET /api/dashboard/riepilogo - Riepilogo completo
router.get('/riepilogo', dashboardController.getRiepilogo);

// GET /api/dashboard/stats - Statistiche aggregate
router.get('/stats', dashboardController.getStats);

// GET /api/dashboard/trend - Trend temporale
router.get('/trend', dashboardController.getTrend);

// GET /api/dashboard/settimanali - Statistiche settimanali
router.get('/settimanali', dashboardController.getStatisticheSettimanali);

export default router;
