import { calcolaGiorniAllaScadenza } from '../utils/statoAlimento.js';

/**
 * Mappa delle categorie e relativi pesi di deperibilità
 * Secondo PRD sezione 6.5:
 * - ALTA (3): Pesce, Carne, Latticini freschi, Verdure
 * - MEDIA (2): Uova, Formaggi stagionati
 * - BASSA (1): Pasta, Riso, Legumi secchi, Conserve, Bevande
 */
const categoriaDeperibilita = {
  'Pesce': 3,
  'Carne': 3,
  'Latticini': 3,
  'Verdura': 3,
  'Frutta': 3,
  'Uova': 2,
  'Cereali e derivati': 1,
  'Legumi': 1,
  'Conserve': 1,
  'Bevande': 1,
  'Surgelati': 2,
  'Altro': 1
};

/**
 * Calcola il peso di deperibilità in base alla categoria
 * @param {string} categoria - Categoria dell'alimento
 * @returns {number} Peso deperibilità (1-3)
 */
export const getPesoDeperibilita = (categoria) => {
  return categoriaDeperibilita[categoria] || 1;
};

/**
 * Calcola il peso di scadenza
 * Formula: max(0, 10 - giorniAllaScadenza)
 * @param {Date} dataScadenza - Data di scadenza dell'alimento
 * @returns {number} Peso scadenza (0-10)
 */
export const getPesoScadenza = (dataScadenza) => {
  const giorni = calcolaGiorniAllaScadenza(dataScadenza);
  return Math.max(0, 10 - giorni);
};

/**
 * Calcola il Food Priority Score (FPS)
 * Formula: FPS = (PesoDeperibilità × 2) + (PesoScadenza × 3)
 *
 * @param {Object} alimento - Oggetto alimento con categoria e dataScadenza
 * @returns {number} Food Priority Score
 */
export const calcolaFPS = (alimento) => {
  const pesoDeperibilita = getPesoDeperibilita(alimento.categoria);
  const pesoScadenza = getPesoScadenza(alimento.dataScadenza);

  const fps = (pesoDeperibilita * 2) + (pesoScadenza * 3);

  return fps;
};

/**
 * Ordina gli alimenti per Food Priority Score (decrescente)
 * Gli alimenti con FPS più alto hanno priorità maggiore
 *
 * @param {Array} alimenti - Array di alimenti
 * @returns {Array} Array ordinato per FPS decrescente
 */
export const ordinaPerFPS = (alimenti) => {
  return alimenti
    .map(alimento => ({
      ...alimento,
      fps: calcolaFPS(alimento),
      giorniAllaScadenza: calcolaGiorniAllaScadenza(alimento.dataScadenza)
    }))
    .sort((a, b) => b.fps - a.fps);
};

/**
 * Seleziona gli alimenti prioritari per la generazione di ricette
 * @param {Array} alimenti - Array di alimenti
 * @param {number} topN - Numero di alimenti prioritari da selezionare (default: 7)
 * @returns {Object} Oggetto con priority_foods e secondary_foods
 */
export const selezionaAlimentiPrioritari = (alimenti, topN = 5) => {
  const alimentiConFPS = ordinaPerFPS(alimenti);

  // Seleziona i top N come prioritari
  const priorityFoods = alimentiConFPS.slice(0, topN).map(a => ({
    name: a.nome,
    quantity: `${a.quantita} ${a.unitaMisura}`,
    expiry_in_days: a.giorniAllaScadenza,
    fps: a.fps,
    categoria: a.categoria
  }));

  // Gli altri con FPS >= 5 diventano secondary
  const secondaryFoods = alimentiConFPS
    .slice(topN)
    .filter(a => a.fps >= 5)
    .map(a => ({
      name: a.nome,
      quantity: `${a.quantita} ${a.unitaMisura}`,
      categoria: a.categoria
    }));

  return {
    priority_foods: priorityFoods,
    secondary_foods: secondaryFoods
  };
};

/**
 * Debug: stampa tabella con calcolo FPS
 * Utile per verificare i calcoli
 */
export const debugFPS = (alimenti) => {
  const alimentiConFPS = ordinaPerFPS(alimenti);

  console.table(alimentiConFPS.map(a => ({
    Nome: a.nome,
    Categoria: a.categoria,
    GiorniScadenza: a.giorniAllaScadenza,
    PesoDeperibilità: getPesoDeperibilita(a.categoria),
    PesoScadenza: getPesoScadenza(a.dataScadenza),
    FPS: a.fps
  })));
};
