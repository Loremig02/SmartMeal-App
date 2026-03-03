import * as authService from '../services/auth.service.js';

/**
 * Controller per la registrazione
 */
export const register = async (req, res, next) => {
  try {
    const { nome, email, password } = req.body;

    const result = await authService.registerUser({ nome, email, password });

    res.status(201).json({
      message: 'Registrazione completata con successo',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    if (error.message === 'Email già registrata') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Controller per il login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    res.json({
      message: 'Login effettuato con successo',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    if (error.message === 'Credenziali non valide') {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Controller per il refresh token
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token mancante' });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      accessToken: result.accessToken
    });
  } catch (error) {
    if (error.message.includes('Refresh token')) {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Controller per ottenere i dati dell'utente corrente
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.json({ user });
  } catch (error) {
    if (error.message === 'Utente non trovato') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

/**
 * Controller per il logout
 * (Lato client dovrà rimuovere i token)
 */
export const logout = (req, res) => {
  res.json({ message: 'Logout effettuato con successo' });
};
