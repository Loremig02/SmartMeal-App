import { PrismaClient } from '@prisma/client';
import { calcolaStatoAlimento } from '../utils/statoAlimento.js';

const prisma = new PrismaClient();

/**
 * Crea un nuovo alimento
 */
export const createAlimento = async (userId, alimentoData) => {
  const { nome, categoria, quantita, unitaMisura, dataScadenza } = alimentoData;

  // Calcola lo stato in base alla data di scadenza
  const stato = calcolaStatoAlimento(new Date(dataScadenza));

  const alimento = await prisma.alimento.create({
    data: {
      idUtente: userId,
      nome,
      categoria,
      quantita,
      unitaMisura,
      dataScadenza: new Date(dataScadenza),
      stato
    }
  });

  return alimento;
};

/**
 * Ottiene tutti gli alimenti di un utente
 */
export const getAllAlimenti = async (userId, orderBy = 'scadenza') => {
  let orderByClause = {};

  if (orderBy === 'scadenza') {
    orderByClause = { dataScadenza: 'asc' };
  } else if (orderBy === 'nome') {
    orderByClause = { nome: 'asc' };
  } else if (orderBy === 'categoria') {
    orderByClause = { categoria: 'asc' };
  } else {
    orderByClause = { dataInserimento: 'desc' };
  }

  const alimenti = await prisma.alimento.findMany({
    where: { idUtente: userId },
    orderBy: orderByClause
  });

  // Ricalcola lo stato per ogni alimento
  const alimentiConStatoAggiornato = alimenti.map(alimento => ({
    ...alimento,
    stato: calcolaStatoAlimento(alimento.dataScadenza)
  }));

  return alimentiConStatoAggiornato;
};

/**
 * Ottiene un singolo alimento per ID
 */
export const getAlimentoById = async (userId, alimentoId) => {
  const alimento = await prisma.alimento.findFirst({
    where: {
      id: alimentoId,
      idUtente: userId
    }
  });

  if (!alimento) {
    throw new Error('Alimento non trovato');
  }

  // Ricalcola lo stato
  return {
    ...alimento,
    stato: calcolaStatoAlimento(alimento.dataScadenza)
  };
};

/**
 * Aggiorna un alimento
 */
export const updateAlimento = async (userId, alimentoId, updateData) => {
  // Verifica che l'alimento esista e appartenga all'utente
  const esistente = await prisma.alimento.findFirst({
    where: {
      id: alimentoId,
      idUtente: userId
    }
  });

  if (!esistente) {
    throw new Error('Alimento non trovato');
  }

  // Se viene aggiornata la data di scadenza, ricalcola lo stato
  if (updateData.dataScadenza) {
    updateData.stato = calcolaStatoAlimento(new Date(updateData.dataScadenza));
    updateData.dataScadenza = new Date(updateData.dataScadenza);
  }

  const alimento = await prisma.alimento.update({
    where: { id: alimentoId },
    data: updateData
  });

  return alimento;
};

/**
 * Elimina un alimento e registra l'evento nel RegistroConsumi
 */
export const deleteAlimento = async (userId, alimentoId, tipoEvento) => {
  // Verifica che l'alimento esista e appartenga all'utente
  const alimento = await prisma.alimento.findFirst({
    where: {
      id: alimentoId,
      idUtente: userId
    }
  });

  if (!alimento) {
    throw new Error('Alimento non trovato');
  }

  // Usa una transazione per garantire atomicità
  const result = await prisma.$transaction(async (tx) => {
    // Registra l'evento nel RegistroConsumi
    await tx.registroConsumi.create({
      data: {
        idUtente: userId,
        nomeAlimento: alimento.nome,
        categoria: alimento.categoria,
        dataEvento: new Date(),
        tipoEvento
      }
    });

    // Elimina l'alimento
    await tx.alimento.delete({
      where: { id: alimentoId }
    });
  });

  return { message: 'Alimento eliminato con successo', tipoEvento };
};

/**
 * Ottiene statistiche sugli alimenti
 */
export const getAlimentiStats = async (userId) => {
  const alimenti = await getAllAlimenti(userId);

  const totale = alimenti.length;
  const inScadenza = alimenti.filter(a => a.stato === 'In Scadenza').length;
  const scaduti = alimenti.filter(a => a.stato === 'Scaduto').length;
  const freschi = alimenti.filter(a => a.stato === 'Fresco').length;

  return {
    totale,
    freschi,
    inScadenza,
    scaduti
  };
};
