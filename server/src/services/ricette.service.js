import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Salva una ricetta nel database
 */
export const salvaRicetta = async (userId, ricettaData) => {
  // Validazione campi obbligatori
  if (!ricettaData.titolo) {
    throw new Error('Il titolo della ricetta è obbligatorio');
  }

  if (!ricettaData.ingredienti || !Array.isArray(ricettaData.ingredienti) || ricettaData.ingredienti.length === 0) {
    throw new Error('Gli ingredienti sono obbligatori');
  }

  if (!ricettaData.procedimento || !Array.isArray(ricettaData.procedimento) || ricettaData.procedimento.length === 0) {
    throw new Error('Il procedimento è obbligatorio');
  }

  // Estrai il numero dal tempo di preparazione (es: "30 minuti" -> 30)
  let tempoPreparazione = null;
  if (ricettaData.tempoPreparazione) {
    const match = ricettaData.tempoPreparazione.toString().match(/\d+/);
    tempoPreparazione = match ? parseInt(match[0]) : null;
  }

  const ricetta = await prisma.ricetta.create({
    data: {
      idUtente: userId,
      titolo: ricettaData.titolo,
      tempoPreparazione,
      contenutoJson: {
        ingredienti: ricettaData.ingredienti,
        procedimento: ricettaData.procedimento,
        metadata: ricettaData.metadata || {}
      },
      notaAntiSpreco: ricettaData.notaAntiSpreco || null
    }
  });

  // Trasforma i dati per il frontend: estrae ingredienti e procedimento da contenutoJson
  return {
    id: ricetta.id,
    titolo: ricetta.titolo,
    tempoPreparazione: ricetta.tempoPreparazione,
    ingredienti: ricetta.contenutoJson.ingredienti || [],
    procedimento: ricetta.contenutoJson.procedimento || [],
    notaAntiSpreco: ricetta.notaAntiSpreco,
    dataSalvataggio: ricetta.dataCreazione,
    metadata: ricetta.contenutoJson.metadata
  };
};

/**
 * Ottiene tutte le ricette salvate di un utente
 */
export const getAllRicette = async (userId) => {
  const ricette = await prisma.ricetta.findMany({
    where: { idUtente: userId },
    orderBy: { dataCreazione: 'desc' }
  });

  // Trasforma i dati per il frontend: estrae ingredienti e procedimento da contenutoJson
  return ricette.map(ricetta => ({
    id: ricetta.id,
    titolo: ricetta.titolo,
    tempoPreparazione: ricetta.tempoPreparazione,
    ingredienti: ricetta.contenutoJson.ingredienti || [],
    procedimento: ricetta.contenutoJson.procedimento || [],
    notaAntiSpreco: ricetta.notaAntiSpreco,
    dataSalvataggio: ricetta.dataCreazione,
    metadata: ricetta.contenutoJson.metadata
  }));
};

/**
 * Ottiene una singola ricetta per ID
 */
export const getRicettaById = async (userId, ricettaId) => {
  const ricetta = await prisma.ricetta.findFirst({
    where: {
      id: ricettaId,
      idUtente: userId
    }
  });

  if (!ricetta) {
    throw new Error('Ricetta non trovata');
  }

  // Trasforma i dati per il frontend: estrae ingredienti e procedimento da contenutoJson
  return {
    id: ricetta.id,
    titolo: ricetta.titolo,
    tempoPreparazione: ricetta.tempoPreparazione,
    ingredienti: ricetta.contenutoJson.ingredienti || [],
    procedimento: ricetta.contenutoJson.procedimento || [],
    notaAntiSpreco: ricetta.notaAntiSpreco,
    dataSalvataggio: ricetta.dataCreazione,
    metadata: ricetta.contenutoJson.metadata
  };
};

/**
 * Elimina una ricetta
 */
export const deleteRicetta = async (userId, ricettaId) => {
  // Verifica che la ricetta esista e appartenga all'utente
  const ricetta = await prisma.ricetta.findFirst({
    where: {
      id: ricettaId,
      idUtente: userId
    }
  });

  if (!ricetta) {
    throw new Error('Ricetta non trovata');
  }

  await prisma.ricetta.delete({
    where: { id: ricettaId }
  });

  return { message: 'Ricetta eliminata con successo' };
};
