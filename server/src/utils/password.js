import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash di una password usando bcrypt
 * @param {string} password - Password in chiaro
 * @returns {Promise<string>} Password hashata
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Confronta una password in chiaro con un hash
 * @param {string} password - Password in chiaro
 * @param {string} hash - Hash della password
 * @returns {Promise<boolean>} true se la password corrisponde
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
