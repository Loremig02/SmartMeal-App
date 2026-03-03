import { z } from 'zod';

// Categorie consentite secondo il PRD
const categorieAlimenti = [
  'Latticini',
  'Carne',
  'Pesce',
  'Verdura',
  'Frutta',
  'Cereali e derivati',
  'Legumi',
  'Conserve',
  'Bevande',
  'Surgelati',
  'Altro'
];

// Unità di misura consentite
const unitaMisura = ['kg', 'g', 'l', 'ml', 'pezzi', 'confezioni'];

// Schema per la creazione di un alimento
export const createAlimentoSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Il nome è obbligatorio'),
    categoria: z.enum(categorieAlimenti, {
      errorMap: () => ({ message: 'Categoria non valida' })
    }),
    quantita: z.number().positive('La quantità deve essere maggiore di 0'),
    unitaMisura: z.enum(unitaMisura, {
      errorMap: () => ({ message: 'Unità di misura non valida' })
    }),
    dataScadenza: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Data di scadenza non valida')
  })
});

// Schema per l'aggiornamento di un alimento
export const updateAlimentoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID non valido')
  }),
  body: z.object({
    nome: z.string().min(1, 'Il nome è obbligatorio').optional(),
    categoria: z.enum(categorieAlimenti).optional(),
    quantita: z.number().positive('La quantità deve essere maggiore di 0').optional(),
    unitaMisura: z.enum(unitaMisura).optional(),
    dataScadenza: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Data di scadenza non valida').optional()
  })
});

// Schema per eliminazione alimento (include tipo evento per registro consumi)
export const deleteAlimentoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID non valido')
  }),
  body: z.object({
    tipoEvento: z.enum(['Consumato', 'Sprecato'], {
      errorMap: () => ({ message: 'Tipo evento deve essere "Consumato" o "Sprecato"' })
    })
  })
});

// Schema per ottenere un singolo alimento
export const getAlimentoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID non valido')
  })
});
