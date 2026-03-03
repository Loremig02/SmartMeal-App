import jwt from 'jsonwebtoken';

/**
 * Genera un access token JWT
 * @param {Object} payload - Dati da includere nel token
 * @returns {string} Access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

/**
 * Genera un refresh token JWT
 * @param {Object} payload - Dati da includere nel token
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Verifica e decodifica un access token
 * @param {string} token - Token da verificare
 * @returns {Object} Payload decodificato
 * @throws {Error} Se il token non è valido
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verifica e decodifica un refresh token
 * @param {string} token - Token da verificare
 * @returns {Object} Payload decodificato
 * @throws {Error} Se il token non è valido
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
