import { Alimento, ChartData, Ricetta, User } from './types';

export const CATEGORIE = [
  "Latticini",
  "Carne",
  "Pesce",
  "Verdura",
  "Frutta",
  "Cereali e derivati",
  "Legumi",
  "Conserve",
  "Bevande",
  "Surgelati",
  "Altro"
];

export const UNITA_MISURA = [
  "g",
  "kg",
  "ml",
  "l",
  "pezzi",
  "confezioni"
];

export const MOCK_USER: User = {
  email: "mario.rossi@email.com",
  nome: "Mario Rossi",
  dataRegistrazione: "2025-01-01"
};

export const MOCK_ALIMENTI: Alimento[] = [
  {
    id: "1",
    nome: "Latte fresco",
    categoria: "Latticini",
    quantita: 1,
    unitaMisura: "l",
    dataScadenza: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    dataInserimento: "2025-01-20"
  },
  {
    id: "2",
    nome: "Petto di pollo",
    categoria: "Carne",
    quantita: 500,
    unitaMisura: "g",
    dataScadenza: new Date(Date.now() + 172800000).toISOString().split('T')[0], // +2 days
    dataInserimento: "2025-01-22"
  },
  {
    id: "3",
    nome: "Yogurt greco",
    categoria: "Latticini",
    quantita: 2,
    unitaMisura: "pezzi",
    dataScadenza: new Date(Date.now() + 172800000).toISOString().split('T')[0], // +2 days
    dataInserimento: "2025-01-21"
  },
  {
    id: "4",
    nome: "Spinaci freschi",
    categoria: "Verdura",
    quantita: 200,
    unitaMisura: "g",
    dataScadenza: new Date().toISOString().split('T')[0], // Today
    dataInserimento: "2025-01-19"
  },
  {
    id: "5",
    nome: "Pasta Barilla",
    categoria: "Cereali e derivati",
    quantita: 500,
    unitaMisura: "g",
    dataScadenza: "2025-06-15",
    dataInserimento: "2025-01-10"
  },
  {
    id: "6",
    nome: "Passata di pomodoro",
    categoria: "Conserve",
    quantita: 700,
    unitaMisura: "ml",
    dataScadenza: "2025-12-01",
    dataInserimento: "2025-01-05"
  },
  {
    id: "7",
    nome: "Uova",
    categoria: "Latticini",
    quantita: 6,
    unitaMisura: "pezzi",
    dataScadenza: "2025-02-05",
    dataInserimento: "2025-01-23"
  },
  {
    id: "8",
    nome: "Mozzarella",
    categoria: "Latticini",
    quantita: 250,
    unitaMisura: "g",
    dataScadenza: new Date(Date.now() + 259200000).toISOString().split('T')[0], // +3 days
    dataInserimento: "2025-01-22"
  }
];

export const MOCK_CHART_DATA: ChartData[] = [
  { giorno: "Lun", consumati: 2, sprecati: 0 },
  { giorno: "Mar", consumati: 1, sprecati: 1 },
  { giorno: "Mer", consumati: 3, sprecati: 0 },
  { giorno: "Gio", consumati: 0, sprecati: 0 },
  { giorno: "Ven", consumati: 2, sprecati: 0 },
  { giorno: "Sab", consumati: 1, sprecati: 0 },
  { giorno: "Dom", consumati: 0, sprecati: 0 }
];

export const MOCK_RICETTA_GENERATA: Ricetta = {
  id: "r1",
  titolo: "Pollo cremoso agli spinaci",
  tempoPreparazione: 25,
  ingredienti: [
    "500 g di petto di pollo",
    "200 g di spinaci freschi",
    "100 ml di latte fresco",
    "125 g di yogurt greco",
    "50 g di parmigiano grattugiato",
    "1 spicchio d'aglio",
    "Sale e pepe q.b.",
    "Olio extravergine d'oliva"
  ],
  procedimento: [
    "Taglia il petto di pollo a bocconcini di circa 3 cm.",
    "In una padella ampia, scalda 2 cucchiai d'olio e rosola l'aglio per 1 minuto.",
    "Aggiungi il pollo e cuoci a fuoco vivace per 5-6 minuti fino a doratura.",
    "Aggiungi gli spinaci freschi e lascia appassire per 2-3 minuti.",
    "In una ciotola, mescola il latte con lo yogurt greco.",
    "Versa il composto cremoso nella padella e mescola bene.",
    "Cuoci a fuoco medio per 5 minuti fino a quando la salsa si addensa.",
    "Aggiungi il parmigiano, aggiusta di sale e pepe.",
    "Servi caldo accompagnato da riso o pane."
  ],
  notaAntiSpreco: "Questa ricetta utilizza il petto di pollo e gli spinaci che scadono oggi, insieme al latte e allo yogurt in scadenza nei prossimi giorni. Hai salvato circa €8 di ingredienti che sarebbero andati sprecati!"
};

export const TOAST_MESSAGES = {
  alimentoAggiunto: "Alimento aggiunto alla dispensa",
  alimentoModificato: "Alimento modificato con successo",
  alimentoRimossoConsumato: "Alimento rimosso - Ottimo, l'hai consumato!",
  alimentoRimossoSprecato: "Alimento rimosso - Peccato, registrato come spreco",
  ricettaSalvata: "Ricetta salvata con successo",
  ricettaEliminata: "Ricetta eliminata",
  erroreGenerico: "Si è verificato un errore. Riprova.",
  logout: "Logout effettuato"
};