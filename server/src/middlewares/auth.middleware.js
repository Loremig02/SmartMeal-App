import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Middleware di autenticazione JWT
 * Verifica la presenza e validità del token JWT nell'header Authorization
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Estrae il token dall'header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token di autenticazione mancante'
      });
    }

    const token = authHeader.substring(7); // Rimuove "Bearer "

    // Verifica il token
    const decoded = verifyAccessToken(token);

    // Aggiunge i dati dell'utente alla request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token scaduto',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token non valido'
      });
    }

    return res.status(500).json({
      error: 'Errore nella verifica del token'
    });
  }
};
