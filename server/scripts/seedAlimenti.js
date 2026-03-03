import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const alimentiTest = [
  { nome: 'Latte fresco', categoria: 'Latticini', quantita: 1, unitaMisura: 'l', giorniScadenza: 3 },
  { nome: 'Yogurt greco', categoria: 'Latticini', quantita: 2, unitaMisura: 'pezzi', giorniScadenza: 5 },
  { nome: 'Mozzarella', categoria: 'Latticini', quantita: 250, unitaMisura: 'g', giorniScadenza: 2 },
  { nome: 'Petto di pollo', categoria: 'Carne', quantita: 500, unitaMisura: 'g', giorniScadenza: 2 },
  { nome: 'Salmone fresco', categoria: 'Pesce', quantita: 300, unitaMisura: 'g', giorniScadenza: 1 },
  { nome: 'Spinaci freschi', categoria: 'Verdura', quantita: 200, unitaMisura: 'g', giorniScadenza: 4 },
  { nome: 'Pomodori', categoria: 'Verdura', quantita: 500, unitaMisura: 'g', giorniScadenza: 5 },
  { nome: 'Zucchine', categoria: 'Verdura', quantita: 400, unitaMisura: 'g', giorniScadenza: 6 },
  { nome: 'Mele', categoria: 'Frutta', quantita: 6, unitaMisura: 'pezzi', giorniScadenza: 10 },
  { nome: 'Banane', categoria: 'Frutta', quantita: 4, unitaMisura: 'pezzi', giorniScadenza: 3 },
  { nome: 'Pasta Barilla', categoria: 'Cereali e derivati', quantita: 500, unitaMisura: 'g', giorniScadenza: 180 },
  { nome: 'Riso Arborio', categoria: 'Cereali e derivati', quantita: 1, unitaMisura: 'kg', giorniScadenza: 365 },
  { nome: 'Ceci in scatola', categoria: 'Legumi', quantita: 400, unitaMisura: 'g', giorniScadenza: 730 },
  { nome: 'Passata di pomodoro', categoria: 'Conserve', quantita: 700, unitaMisura: 'ml', giorniScadenza: 365 },
  { nome: 'Succo d\'arancia', categoria: 'Bevande', quantita: 1, unitaMisura: 'l', giorniScadenza: 7 },
  { nome: 'Piselli surgelati', categoria: 'Surgelati', quantita: 450, unitaMisura: 'g', giorniScadenza: 180 },
];

async function seed() {
  const email = process.argv[2];

  if (!email) {
    console.error('Uso: node scripts/seedAlimenti.js <email>');
    process.exit(1);
  }

  // Trova l'utente
  const utente = await prisma.utente.findUnique({
    where: { email }
  });

  if (!utente) {
    console.error(`Utente con email ${email} non trovato!`);
    process.exit(1);
  }

  console.log(`Trovato utente: ${utente.nome} (${utente.id})`);

  // Calcola lo stato in base ai giorni alla scadenza
  const calcolaStato = (giorni) => {
    if (giorni <= 0) return 'Scaduto';
    if (giorni <= 3) return 'In Scadenza';
    return 'Fresco';
  };

  // Inserisci gli alimenti
  for (const alimento of alimentiTest) {
    const dataScadenza = new Date();
    dataScadenza.setDate(dataScadenza.getDate() + alimento.giorniScadenza);

    const created = await prisma.alimento.create({
      data: {
        idUtente: utente.id,
        nome: alimento.nome,
        categoria: alimento.categoria,
        quantita: alimento.quantita,
        unitaMisura: alimento.unitaMisura,
        dataScadenza: dataScadenza,
        stato: calcolaStato(alimento.giorniScadenza)
      }
    });

    console.log(`✓ Aggiunto: ${created.nome} (scade tra ${alimento.giorniScadenza} giorni)`);
  }

  console.log(`\n✅ Aggiunti ${alimentiTest.length} alimenti per ${utente.nome}`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
