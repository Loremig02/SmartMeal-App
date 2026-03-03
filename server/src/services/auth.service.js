import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

/**
 * Registra un nuovo utente
 * @param {Object} userData - Dati dell'utente (nome, email, password)
 * @returns {Promise<Object>} Utente creato e tokens
 */
export const registerUser = async ({ nome, email, password }) => {
  // Verifica se l'email esiste già
  const existingUser = await prisma.utente.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('Email già registrata');
  }

  // Hash della password
  const passwordHash = await hashPassword(password);

  // Crea l'utente
  const user = await prisma.utente.create({
    data: {
      nome,
      email,
      passwordHash
    },
    select: {
      id: true,
      nome: true,
      email: true,
      dataRegistrazione: true
    }
  });

  // Genera i tokens
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  return {
    user,
    accessToken,
    refreshToken
  };
};

/**
 * Login di un utente
 * @param {Object} credentials - Credenziali (email, password)
 * @returns {Promise<Object>} Utente e tokens
 */
export const loginUser = async ({ email, password }) => {
  // Trova l'utente
  const user = await prisma.utente.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Credenziali non valide');
  }

  // Verifica la password
  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Credenziali non valide');
  }

  // Genera i tokens
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  return {
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      dataRegistrazione: user.dataRegistrazione
    },
    accessToken,
    refreshToken
  };
};

/**
 * Rinnova l'access token usando il refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} Nuovo access token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verifica il refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Trova l'utente
    const user = await prisma.utente.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      throw new Error('Utente non trovato');
    }

    // Genera nuovo access token
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });

    return { accessToken };
  } catch (error) {
    throw new Error('Refresh token non valido o scaduto');
  }
};

/**
 * Ottiene i dati dell'utente corrente
 * @param {string} userId - ID dell'utente
 * @returns {Promise<Object>} Dati utente
 */
export const getCurrentUser = async (userId) => {
  const user = await prisma.utente.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nome: true,
      email: true,
      dataRegistrazione: true
    }
  });

  if (!user) {
    throw new Error('Utente non trovato');
  }

  return user;
};
