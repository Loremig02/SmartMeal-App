import express from 'express';
import * as alimentiController from '../controllers/alimenti.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createAlimentoSchema,
  updateAlimentoSchema,
  deleteAlimentoSchema,
  getAlimentoSchema
} from '../middlewares/alimento.validation.js';

const router = express.Router();

// GET /api/alimenti - Lista alimenti con ordinamento opzionale
router.get('/', alimentiController.getAllAlimenti);

// GET /api/alimenti/stats - Statistiche alimenti
router.get('/stats', alimentiController.getAlimentiStats);

// GET /api/alimenti/:id - Dettaglio singolo alimento
router.get('/:id', validate(getAlimentoSchema), alimentiController.getAlimento);

// POST /api/alimenti - Crea nuovo alimento
router.post('/', validate(createAlimentoSchema), alimentiController.createAlimento);

// PUT /api/alimenti/:id - Aggiorna alimento
router.put('/:id', validate(updateAlimentoSchema), alimentiController.updateAlimento);

// DELETE /api/alimenti/:id - Elimina alimento
router.delete('/:id', validate(deleteAlimentoSchema), alimentiController.deleteAlimento);

export default router;
