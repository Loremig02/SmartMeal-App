import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendExpiryNotification } from '../services/email.service.js';

const prisma = new PrismaClient();

/**
 * Inizializza il job di notifica scadenze
 * Esegue controllo giornaliero alle 9:00 AM (configurabile)
 */
export const initExpiryNotificationJob = () => {
  const schedule = process.env.NOTIFICATION_SCHEDULE || '0 9 * * *';

  console.log(`📧 [Notification Job] Inizializzato con schedule: ${schedule}`);

  cron.schedule(schedule, async () => {
    await runNotificationCheck();
  });
};

/**
 * Esegue il controllo e l'invio delle notifiche
 * Può essere chiamato manualmente per test
 */
export const runNotificationCheck = async () => {
  console.log('🔔 [Notification Job] Avvio controllo scadenze...');

  const startTime = new Date();
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    // 1. Query alimenti in scadenza o scaduti
    const expiringFoods = await prisma.alimento.findMany({
      where: {
        OR: [
          { stato: 'In Scadenza' },
          { stato: 'Scaduto' }
        ]
      },
      include: {
        utente: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        dataScadenza: 'asc'
      }
    });

    console.log(`📊 [Notification Job] Trovati ${expiringFoods.length} alimenti in scadenza`);

    if (expiringFoods.length === 0) {
      console.log('✅ [Notification Job] Nessun alimento in scadenza. Nessuna notifica da inviare.');
      return;
    }

    // 2. Raggruppa alimenti per utente
    const userFoodsMap = new Map();

    for (const food of expiringFoods) {
      const userId = food.utente.id;

      if (!userFoodsMap.has(userId)) {
        userFoodsMap.set(userId, {
          user: food.utente,
          foods: []
        });
      }

      userFoodsMap.get(userId).foods.push({
        nome: food.nome,
        categoria: food.categoria,
        dataScadenza: food.dataScadenza,
        stato: food.stato
      });
    }

    console.log(`👥 [Notification Job] ${userFoodsMap.size} utenti da notificare`);

    // 3. Invia email a ogni utente
    for (const [userId, { user, foods }] of userFoodsMap) {
      try {
        console.log(`📧 [Notification Job] Invio email a ${user.email} (${foods.length} alimenti)...`);

        await sendExpiryNotification(user.email, user.nome, foods);

        successCount++;
        console.log(`✅ [Notification Job] Email inviata con successo a ${user.email}`);

      } catch (error) {
        errorCount++;
        const errorMsg = `Errore invio a ${user.email}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`❌ [Notification Job] ${errorMsg}`);
      }
    }

    // 4. Summary log finale
    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 [Notification Job] Riepilogo Esecuzione');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏱️  Durata: ${duration}s`);
    console.log(`📧 Email inviate: ${successCount}/${userFoodsMap.size}`);
    console.log(`✅ Successi: ${successCount}`);
    console.log(`❌ Errori: ${errorCount}`);
    console.log(`🍽️  Alimenti controllati: ${expiringFoods.length}`);

    if (errors.length > 0) {
      console.log('');
      console.log('❌ Dettagli Errori:');
      errors.forEach(err => console.log(`   - ${err}`));
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

  } catch (error) {
    console.error('❌ [Notification Job] Errore critico durante esecuzione:', error);
    throw error;
  }
};

/**
 * Esegue il controllo immediatamente (per test)
 * @returns {Promise<void>}
 */
export const runNotificationNow = async () => {
  console.log('🧪 [Notification Job] Esecuzione manuale richiesta...');
  await runNotificationCheck();
};
