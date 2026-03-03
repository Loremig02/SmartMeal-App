import { Resend } from 'resend';
import { generateEmailHTML } from '../utils/emailTemplates.js';

// Lazy initialization di Resend (inizializzato solo quando serve)
let resendInstance = null;

const getResendClient = () => {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY non configurata');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

/**
 * Invia email di notifica per alimenti in scadenza
 * @param {string} userEmail - Email dell'utente
 * @param {string} userName - Nome dell'utente
 * @param {Array} expiringFoods - Lista alimenti in scadenza
 * @returns {Promise<{success: boolean, messageId: string}>}
 */
export const sendExpiryNotification = async (userEmail, userName, expiringFoods) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY non configurata');
    }

    if (!process.env.RESEND_EMAIL_FROM) {
      throw new Error('RESEND_EMAIL_FROM non configurata');
    }

    // Genera HTML email
    const emailHtml = generateEmailHTML(userName, expiringFoods);

    // Ottieni client Resend (inizializzato lazy)
    const resend = getResendClient();

    // Invia email tramite Resend
    const { data, error } = await resend.emails.send({
      from: `SmartMeal <${process.env.RESEND_EMAIL_FROM}>`,
      to: userEmail,
      subject: '🔔 SmartMeal: Alimenti in scadenza nella tua dispensa',
      html: emailHtml
    });

    if (error) {
      throw new Error(`Errore Resend API: ${error.message}`);
    }

    return {
      success: true,
      messageId: data.id
    };

  } catch (error) {
    console.error(`❌ [Email Service] Errore invio email a ${userEmail}:`, error.message);
    throw error;
  }
};

/**
 * Verifica configurazione Resend API
 * @returns {Promise<boolean>}
 */
export const testEmailConnection = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ [Email Service] RESEND_API_KEY non configurata');
      return false;
    }

    if (!process.env.RESEND_EMAIL_FROM) {
      console.error('❌ [Email Service] RESEND_EMAIL_FROM non configurata');
      return false;
    }

    console.log('✅ [Email Service] Configurazione Resend verificata');
    return true;

  } catch (error) {
    console.error('❌ [Email Service] Errore verifica configurazione:', error.message);
    return false;
  }
};
