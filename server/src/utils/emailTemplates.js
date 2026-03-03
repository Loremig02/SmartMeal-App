/**
 * Genera HTML per email di notifica alimenti in scadenza
 * @param {string} userName - Nome dell'utente
 * @param {Array} foods - Lista alimenti in scadenza
 * @returns {string} HTML dell'email
 */
export const generateEmailHTML = (userName, foods) => {
  const foodCount = foods.length;
  const foodRows = foods.map(food => generateFoodRow(food)).join('');

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartMeal - Alimenti in Scadenza</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; margin: 0; font-size: 28px;">🍽️ SmartMeal</h1>
        <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Il tuo assistente anti-spreco</p>
      </div>

      <!-- Greeting -->
      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #333;">Ciao <strong>${userName}</strong>,</p>
        <p style="margin: 0; font-size: 16px; color: #333;">
          Hai <strong style="color: #f97316;">${foodCount}</strong> ${foodCount === 1 ? 'alimento' : 'alimenti'} nella tua dispensa ${foodCount === 1 ? 'che necessita' : 'che necessitano'} attenzione:
        </p>
      </div>

      <!-- Food Table -->
      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f97316; color: white;">
            <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600;">Alimento</th>
            <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600;">Categoria</th>
            <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600;">Scadenza</th>
            <th style="padding: 12px; text-align: center; font-size: 14px; font-weight: 600;">Stato</th>
          </tr>
        </thead>
        <tbody>
          ${foodRows}
        </tbody>
      </table>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dispensa"
           style="display: inline-block; background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
          Vai alla Dispensa
        </a>
      </div>

      <!-- Tips Section -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          <strong>💡 Suggerimento:</strong> Usa lo Smart Chef per generare ricette con gli alimenti in scadenza e ridurre lo spreco!
        </p>
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #999; text-align: center;">
          Questa email è stata inviata automaticamente dal sistema SmartMeal.
        </p>
        <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
          Per gestire le tue notifiche, accedi al tuo profilo nell'app.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Genera riga HTML per singolo alimento
 * @param {Object} food - Oggetto alimento
 * @returns {string} HTML della riga
 */
const generateFoodRow = (food) => {
  const { nome, categoria, dataScadenza, stato } = food;
  const giorniRimanenti = calcolaGiorniRimanenti(dataScadenza);
  const statoColor = getStatoColor(stato);
  const dataFormattata = formatDate(dataScadenza);

  return `
    <tr style="border-bottom: 1px solid #f3f4f6;">
      <td style="padding: 12px; font-size: 14px; color: #333;">${nome}</td>
      <td style="padding: 12px; font-size: 14px; color: #666;">${categoria}</td>
      <td style="padding: 12px; font-size: 14px; color: #666;">${dataFormattata}</td>
      <td style="padding: 12px; text-align: center;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${statoColor.bg}; color: ${statoColor.text};">
          ${stato}
        </span>
        <div style="font-size: 11px; color: #999; margin-top: 4px;">${giorniRimanenti}</div>
      </td>
    </tr>
  `;
};

/**
 * Calcola giorni rimanenti alla scadenza
 * @param {Date|string} dataScadenza - Data di scadenza
 * @returns {string} Testo descrittivo
 */
const calcolaGiorniRimanenti = (dataScadenza) => {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);

  const scadenza = new Date(dataScadenza);
  scadenza.setHours(0, 0, 0, 0);

  const diffTime = scadenza - oggi;
  const giorni = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (giorni < 0) {
    const giorniPassati = Math.abs(giorni);
    return `Scaduto da ${giorniPassati} ${giorniPassati === 1 ? 'giorno' : 'giorni'}`;
  }
  if (giorni === 0) return 'Scade oggi!';
  if (giorni === 1) return 'Scade domani';
  return `Scade tra ${giorni} giorni`;
};

/**
 * Ottiene i colori per lo stato alimento
 * @param {string} stato - Stato dell'alimento
 * @returns {Object} Oggetto con background e text color
 */
const getStatoColor = (stato) => {
  switch (stato) {
    case 'Scaduto':
      return { bg: '#fee2e2', text: '#991b1b' }; // Red
    case 'In Scadenza':
      return { bg: '#fed7aa', text: '#9a3412' }; // Orange
    case 'Fresco':
      return { bg: '#d1fae5', text: '#065f46' }; // Green
    default:
      return { bg: '#f3f4f6', text: '#374151' }; // Gray
  }
};

/**
 * Formatta data in formato italiano
 * @param {Date|string} data - Data da formattare
 * @returns {string} Data formattata (es: "27 Gen 2026")
 */
const formatDate = (data) => {
  const date = new Date(data);
  const mesi = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  const giorno = date.getDate();
  const mese = mesi[date.getMonth()];
  const anno = date.getFullYear();
  return `${giorno} ${mese} ${anno}`;
};
