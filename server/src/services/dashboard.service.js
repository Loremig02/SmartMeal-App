import { PrismaClient } from '@prisma/client';
import { getAllAlimenti } from './alimenti.service.js';

const prisma = new PrismaClient();

/**
 * Ottiene statistiche aggregate per la dashboard
 */
export const getDashboardStats = async (userId) => {
  // Statistiche alimenti correnti
  const alimenti = await getAllAlimenti(userId);

  const totaleAlimenti = alimenti.length;
  const alimentiFreschi = alimenti.filter(a => a.stato === 'Fresco').length;
  const alimentiInScadenza = alimenti.filter(a => a.stato === 'In Scadenza').length;
  const alimentiScaduti = alimenti.filter(a => a.stato === 'Scaduto').length;

  // Statistiche dal registro consumi
  const registroStats = await prisma.registroConsumi.groupBy({
    by: ['tipoEvento'],
    where: { idUtente: userId },
    _count: { tipoEvento: true }
  });

  const alimentiConsumati = registroStats.find(r => r.tipoEvento === 'Consumato')?._count.tipoEvento || 0;
  const alimentiSprecati = registroStats.find(r => r.tipoEvento === 'Sprecato')?._count.tipoEvento || 0;

  // Distribuzione per categoria (alimenti correnti)
  const distribuzioneCategoria = alimenti.reduce((acc, alimento) => {
    acc[alimento.categoria] = (acc[alimento.categoria] || 0) + 1;
    return acc;
  }, {});

  // Statistiche categorie più sprecate (dal registro)
  const categorieSprecate = await prisma.registroConsumi.groupBy({
    by: ['categoria'],
    where: {
      idUtente: userId,
      tipoEvento: 'Sprecato'
    },
    _count: { categoria: true },
    orderBy: {
      _count: {
        categoria: 'desc'
      }
    },
    take: 5
  });

  return {
    alimentiCorrenti: {
      totale: totaleAlimenti,
      freschi: alimentiFreschi,
      inScadenza: alimentiInScadenza,
      scaduti: alimentiScaduti
    },
    storico: {
      consumati: alimentiConsumati,
      sprecati: alimentiSprecati,
      totale: alimentiConsumati + alimentiSprecati
    },
    percentualiSpreco: {
      percentualeSprecata: alimentiConsumati + alimentiSprecati > 0
        ? Math.round((alimentiSprecati / (alimentiConsumati + alimentiSprecati)) * 100)
        : 0
    },
    distribuzioneCategoria,
    categorieSprecate: categorieSprecate.map(c => ({
      categoria: c.categoria,
      count: c._count.categoria
    }))
  };
};

/**
 * Ottiene trend temporale (ultimi 30 giorni)
 */
export const getTrendTemporale = async (userId, giorni = 30) => {
  const dataInizio = new Date();
  dataInizio.setDate(dataInizio.getDate() - giorni);

  // Consumi e sprechi giornalieri
  const eventi = await prisma.registroConsumi.findMany({
    where: {
      idUtente: userId,
      dataEvento: {
        gte: dataInizio
      }
    },
    orderBy: {
      dataEvento: 'asc'
    }
  });

  // Raggruppa per data e tipo
  const trendMap = {};

  eventi.forEach(evento => {
    const dataKey = evento.dataEvento.toISOString().split('T')[0];

    if (!trendMap[dataKey]) {
      trendMap[dataKey] = {
        data: dataKey,
        consumati: 0,
        sprecati: 0
      };
    }

    if (evento.tipoEvento === 'Consumato') {
      trendMap[dataKey].consumati++;
    } else {
      trendMap[dataKey].sprecati++;
    }
  });

  const trend = Object.values(trendMap);

  return {
    periodo: `Ultimi ${giorni} giorni`,
    dataInizio: dataInizio.toISOString().split('T')[0],
    dataFine: new Date().toISOString().split('T')[0],
    trend
  };
};

/**
 * Ottiene statistiche settimanali
 */
export const getStatisticheSettimanali = async (userId) => {
  const dataInizio = new Date();
  dataInizio.setDate(dataInizio.getDate() - 7);

  const eventiSettimana = await prisma.registroConsumi.findMany({
    where: {
      idUtente: userId,
      dataEvento: {
        gte: dataInizio
      }
    }
  });

  const consumati = eventiSettimana.filter(e => e.tipoEvento === 'Consumato').length;
  const sprecati = eventiSettimana.filter(e => e.tipoEvento === 'Sprecato').length;

  return {
    periodo: 'Ultimi 7 giorni',
    consumati,
    sprecati,
    totale: consumati + sprecati,
    percentualeSprecata: consumati + sprecati > 0
      ? Math.round((sprecati / (consumati + sprecati)) * 100)
      : 0
  };
};

/**
 * Ottiene il riepilogo completo per la dashboard
 */
export const getRiepilogoDashboard = async (userId) => {
  const [stats, trend, settimanali] = await Promise.all([
    getDashboardStats(userId),
    getTrendTemporale(userId, 30),
    getStatisticheSettimanali(userId)
  ]);

  return {
    statistiche: stats,
    trend,
    settimanali
  };
};
