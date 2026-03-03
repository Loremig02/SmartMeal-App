/**
 * Calcola lo stato di un alimento in base ai giorni alla scadenza
 * Logica secondo PRD sezione 6.3:
 * - giorni > 3: FRESCO
 * - 1 <= giorni <= 3: IN_SCADENZA
 * - giorni <= 0: SCADUTO
 *
 * @param {Date} dataScadenza - Data di scadenza dell'alimento
 * @returns {string} Stato calcolato (Fresco, In Scadenza, Scaduto)
 */
export const calcolaStatoAlimento = (dataScadenza) => {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0); // Ignora l'orario

  const scadenza = new Date(dataScadenza);
  scadenza.setHours(0, 0, 0, 0);

  // Calcola la differenza in giorni
  const diffTime = scadenza - oggi;
  const giorniAllaScadenza = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (giorniAllaScadenza > 3) {
    return 'Fresco';
  } else if (giorniAllaScadenza >= 1) {
    return 'In Scadenza';
  } else {
    return 'Scaduto';
  }
};

/**
 * Calcola i giorni rimanenti alla scadenza
 * @param {Date} dataScadenza - Data di scadenza
 * @returns {number} Numero di giorni alla scadenza (può essere negativo se scaduto)
 */
export const calcolaGiorniAllaScadenza = (dataScadenza) => {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);

  const scadenza = new Date(dataScadenza);
  scadenza.setHours(0, 0, 0, 0);

  const diffTime = scadenza - oggi;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
