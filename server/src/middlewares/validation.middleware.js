import { z } from 'zod';

/**
 * Middleware di validazione usando Zod
 * @param {z.ZodSchema} schema - Schema Zod per la validazione
 * @returns {Function} Middleware Express
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dati non validi',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// Schema di validazione per registrazione
export const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri'),
    email: z.string().email('Email non valida'),
    password: z.string().min(6, 'La password deve contenere almeno 6 caratteri')
  })
});

// Schema di validazione per login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(1, 'Password richiesta')
  })
});
