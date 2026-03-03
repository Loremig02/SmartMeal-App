import * as ricetteService from '../services/ricette.service.js';
import * as aiService from '../services/ai.service.js';
import * as alimentiService from '../services/alimenti.service.js';

/**
 * Genera una ricetta usando AI
 */
export const generaRicetta = async (req, res, next) => {
  try {
    const { difficulty, time, selectedIngredientIds } = req.body;

    // Recupera gli alimenti dell'utente
    let alimenti = await alimentiService.getAllAlimenti(req.user.id);

    if (alimenti.length === 0) {
      return res.status(400).json({
        error: 'Nessun alimento disponibile nella dispensa. Aggiungi almeno un alimento per generare una ricetta.'
      });
    }

    // Se sono stati specificati ingredienti selezionati, filtra solo quelli
    if (selectedIngredientIds && selectedIngredientIds.length > 0) {
      alimenti = alimenti.filter(a => selectedIngredientIds.includes(a.id));

      if (alimenti.length === 0) {
        return res.status(400).json({
          error: 'Nessun ingrediente selezionato valido.'
        });
      }
    }

    // Genera la ricetta con AI
    const ricettaAI = await aiService.generaRicetta(req.user.id, alimenti, {
      difficulty,
      time
    });

    // Trasforma i campi dall'inglese all'italiano per il frontend
    const ricetta = {
      titolo: ricettaAI.recipe_name,
      ingredienti: ricettaAI.ingredients,
      procedimento: ricettaAI.steps,
      tempoPreparazione: ricettaAI.prep_time,
      notaAntiSpreco: ricettaAI.anti_waste_note,
      metadata: ricettaAI.metadata
    };

    res.json({
      message: 'Ricetta generata con successo',
      ricetta
    });

  } catch (error) {
    if (error.message.includes('API key') || error.message.includes('Gemini')) {
      return res.status(503).json({
        error: 'Servizio AI temporaneamente non disponibile',
        details: error.message
      });
    }

    if (error.message.includes('Nessun alimento')) {
      return res.status(400).json({ error: error.message });
    }

    next(error);
  }
};

/**
 * Salva una ricetta
 */
export const salvaRicetta = async (req, res, next) => {
  try {
    const ricetta = await ricetteService.salvaRicetta(req.user.id, req.body);

    res.status(201).json({
      message: 'Ricetta salvata con successo',
      ricetta
    });
  } catch (error) {
    res.status(400).json({
      error: 'Dati non validi',
      details: error.message
    });
  }
};

/**
 * Ottiene tutte le ricette salvate
 */
export const getAllRicette = async (req, res, next) => {
  try {
    const ricette = await ricetteService.getAllRicette(req.user.id);

    res.json({
      ricette,
      count: ricette.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ottiene una singola ricetta
 */
export const getRicetta = async (req, res, next) => {
  try {
    const ricetta = await ricetteService.getRicettaById(req.user.id, req.params.id);

    res.json({ ricetta });
  } catch (error) {
    if (error.message === 'Ricetta non trovata') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Elimina una ricetta
 */
export const deleteRicetta = async (req, res, next) => {
  try {
    const result = await ricetteService.deleteRicetta(req.user.id, req.params.id);

    res.json(result);
  } catch (error) {
    if (error.message === 'Ricetta non trovata') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};
