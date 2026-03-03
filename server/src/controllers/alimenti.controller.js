import * as alimentiService from '../services/alimenti.service.js';

/**
 * Crea un nuovo alimento
 */
export const createAlimento = async (req, res, next) => {
  try {
    const alimento = await alimentiService.createAlimento(req.user.id, req.body);

    res.status(201).json({
      message: 'Alimento creato con successo',
      alimento
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ottiene tutti gli alimenti dell'utente
 */
export const getAllAlimenti = async (req, res, next) => {
  try {
    const { orderBy } = req.query;
    const alimenti = await alimentiService.getAllAlimenti(req.user.id, orderBy);

    res.json({
      alimenti,
      count: alimenti.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ottiene un singolo alimento
 */
export const getAlimento = async (req, res, next) => {
  try {
    const alimento = await alimentiService.getAlimentoById(req.user.id, req.params.id);

    res.json({ alimento });
  } catch (error) {
    if (error.message === 'Alimento non trovato') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Aggiorna un alimento
 */
export const updateAlimento = async (req, res, next) => {
  try {
    const alimento = await alimentiService.updateAlimento(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({
      message: 'Alimento aggiornato con successo',
      alimento
    });
  } catch (error) {
    if (error.message === 'Alimento non trovato') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Elimina un alimento
 */
export const deleteAlimento = async (req, res, next) => {
  try {
    const { tipoEvento } = req.body;

    const result = await alimentiService.deleteAlimento(
      req.user.id,
      req.params.id,
      tipoEvento
    );

    res.json(result);
  } catch (error) {
    if (error.message === 'Alimento non trovato') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Ottiene statistiche sugli alimenti
 */
export const getAlimentiStats = async (req, res, next) => {
  try {
    const stats = await alimentiService.getAlimentiStats(req.user.id);

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};
