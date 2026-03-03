import { StatoAlimento } from '../types';

export function calcolaGiorniRimanenti(dataScadenza: string): number {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const scadenza = new Date(dataScadenza);
  scadenza.setHours(0, 0, 0, 0);
  const diffTime = scadenza.getTime() - oggi.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calcolaStato(dataScadenza: string): StatoAlimento {
  const diffDays = calcolaGiorniRimanenti(dataScadenza);
  
  if (diffDays < 0) return "scaduto";
  if (diffDays <= 3) return "in_scadenza";
  return "fresco";
}

export function formatScadenza(dataScadenza: string): string {
  const giorni = calcolaGiorniRimanenti(dataScadenza);
  
  if (giorni < 0) return `Scaduto da ${Math.abs(giorni)} giorn${Math.abs(giorni) === 1 ? 'o' : 'i'}`;
  if (giorni === 0) return "Scade oggi!";
  if (giorni === 1) return "Scade domani";
  return `Scade tra ${giorni} giorni`;
}

export function formatData(data: string): string {
  return new Date(data).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}