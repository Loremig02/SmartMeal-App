import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate, registerSchema, loginSchema } from '../middlewares/validation.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/auth/register - Registrazione nuovo utente
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login - Login utente
router.post('/login', validate(loginSchema), authController.login);

// POST /api/auth/refresh - Rinnovo access token
router.post('/refresh', authController.refresh);

// GET /api/auth/me - Dati utente corrente (protetta)
router.get('/me', authMiddleware, authController.getCurrentUser);

// POST /api/auth/logout - Logout (protetta)
router.post('/logout', authMiddleware, authController.logout);

export default router;
