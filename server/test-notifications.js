// Script di test per le notifiche email
// Esegui con: node test-notifications.js

import dotenv from 'dotenv';
import { runNotificationCheck } from './src/jobs/expiry-notification.job.js';

// Carica variabili d'ambiente
dotenv.config();

console.log('🧪 Test Notifiche Email SmartMeal');
console.log('================================\n');

// Esegui il controllo notifiche
await runNotificationCheck();

console.log('\n✅ Test completato!');
process.exit(0);
