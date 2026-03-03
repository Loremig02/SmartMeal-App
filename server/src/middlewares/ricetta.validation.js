import { z } from 'zod';

// Schema per generazione ricetta
export const generaRicettaSchema = z.object({
  body: z.object({
    difficulty: z.enum(['facile', 'media', 'difficile']).optional(),
    time: z.string().optional()
  })
});

// Schema per salvataggio ricetta (usa nomi campi italiani)
export const salvaRicettaSchema = z.object({
  body: z.object({
    titolo: z.string().min(1, 'Nome ricetta obbligatorio'),
    ingredienti: z.array(z.string()).min(1, 'Almeno un ingrediente richiesto'),
    procedimento: z.array(z.string()).min(1, 'Almeno un passaggio richiesto'),
    tempoPreparazione: z.union([z.string(), z.number()]).optional(),
    notaAntiSpreco: z.string().optional(),
    metadata: z.object({}).passthrough().optional()
  })
});

// Schema per ottenere una ricetta
export const getRicettaSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID non valido')
  })
});

// Schema per eliminare una ricetta
export const deleteRicettaSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID non valido')
  })
});
