import express from 'express';
import * as ricetteController from '../controllers/ricette.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  generaRicettaSchema,
  salvaRicettaSchema,
  getRicettaSchema,
  deleteRicettaSchema
} from '../middlewares/ricetta.validation.js';

const router = express.Router();

// POST /api/ricette/genera - Genera ricetta con AI
router.post('/genera', validate(generaRicettaSchema), ricetteController.generaRicetta);

// GET /api/ricette - Lista ricette salvate
router.get('/', ricetteController.getAllRicette);

// GET /api/ricette/:id - Dettaglio ricetta
router.get('/:id', validate(getRicettaSchema), ricetteController.getRicetta);

// POST /api/ricette - Salva ricetta
router.post('/', validate(salvaRicettaSchema), ricetteController.salvaRicetta);

// DELETE /api/ricette/:id - Elimina ricetta
router.delete('/:id', validate(deleteRicettaSchema), ricetteController.deleteRicetta);

export default router;
