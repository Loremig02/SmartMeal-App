export interface User {
  email: string;
  nome: string;
  dataRegistrazione: string;
}

export type StatoAlimento = 'fresco' | 'in_scadenza' | 'scaduto' | 'critico' | 'attenzione';

export interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  quantita: number;
  unitaMisura: string;
  dataScadenza: string;
  dataInserimento: string;
  stato?: StatoAlimento;
}

export interface Ricetta {
  id: string;
  titolo: string;
  tempoPreparazione: number;
  ingredienti: string[];
  procedimento: string[];
  notaAntiSpreco: string;
  dataSalvataggio?: string;
}

export interface Statistiche {
  totaleAlimenti: number;
  inScadenza: number;
  scaduti: number;
  consumatiMese: number;
}

export interface ChartData {
  giorno: string;
  consumati: number;
  sprecati: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}