import { GoogleGenerativeAI } from '@google/generative-ai';
import { selezionaAlimentiPrioritari } from './fpsCalculator.js';

// Inizializza Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Prompt di sistema per il LLM
 * Secondo PRD sezione 6.5
 */
const SYSTEM_PROMPT = `Sei un assistente culinario specializzato nella riduzione dello spreco alimentare.

Genera una ricetta semplice e realistica utilizzando OBBLIGATORIAMENTE e PRIORITARIAMENTE
gli alimenti indicati come priority_foods, rispettando l'ordine di deperibilità e scadenza.

Usa gli ingredienti secondari solo se necessari.
Non proporre ingredienti che l'utente non possiede.
Spiega brevemente perché questa ricetta riduce lo spreco alimentare.

IMPORTANTE: Rispondi SOLO con un oggetto JSON valido nel seguente formato, senza testo aggiuntivo:
{
  "recipe_name": "Nome della ricetta",
  "ingredients": ["ingrediente 1 con quantità", "ingrediente 2 con quantità"],
  "steps": ["passo 1", "passo 2", "passo 3"],
  "prep_time": "tempo in minuti (es: 30 minuti)",
  "anti_waste_note": "spiegazione di come questa ricetta riduce lo spreco"
}`;

/**
 * Costruisce il prompt per l'AI includendo gli alimenti disponibili
 * @param {Array} priorityFoods - Alimenti prioritari
 * @param {Array} secondaryFoods - Alimenti secondari
 * @param {Object} constraints - Vincoli (difficoltà, tempo, ecc.)
 * @returns {string} Prompt completo
 */
const buildPrompt = (priorityFoods, secondaryFoods, constraints = {}) => {
  const difficultyText = constraints.difficulty || 'media';
  const timeText = constraints.time || '30-45 minuti';

  let prompt = `${SYSTEM_PROMPT}\n\n`;
  prompt += `ALIMENTI PRIORITARI (DEVONO essere usati nella ricetta):\n`;

  priorityFoods.forEach((food, index) => {
    prompt += `${index + 1}. ${food.name} (${food.quantity}) - scade tra ${food.expiry_in_days} giorni\n`;
  });

  if (secondaryFoods.length > 0) {
    prompt += `\nALIMENTI SECONDARI (opzionali, usa solo se necessario):\n`;
    secondaryFoods.forEach((food, index) => {
      prompt += `${index + 1}. ${food.name} (${food.quantity})\n`;
    });
  }

  prompt += `\nVINCOLI:\n`;
  prompt += `- Difficoltà: ${difficultyText}\n`;
  prompt += `- Tempo di preparazione desiderato: ${timeText}\n`;
  prompt += `- Obiettivo: ridurre sprechi alimentari\n\n`;
  prompt += `Genera la ricetta in formato JSON come specificato.`;

  return prompt;
};

/**
 * Genera una ricetta usando Google Gemini
 * @param {string} userId - ID dell'utente
 * @param {Array} alimenti - Tutti gli alimenti dell'utente
 * @param {Object} options - Opzioni (difficulty, time, etc.)
 * @returns {Promise<Object>} Ricetta generata
 */
export const generaRicetta = async (userId, alimenti, options = {}) => {
  try {
    // Verifica che ci siano alimenti disponibili
    if (!alimenti || alimenti.length === 0) {
      throw new Error('Nessun alimento disponibile per generare una ricetta');
    }

    // Seleziona alimenti prioritari usando il FPS
    const { priority_foods, secondary_foods } = selezionaAlimentiPrioritari(alimenti);

    if (priority_foods.length === 0) {
      throw new Error('Nessun alimento prioritario trovato');
    }

    // Costruisci il prompt
    const prompt = buildPrompt(priority_foods, secondary_foods, {
      difficulty: options.difficulty || 'media',
      time: options.time || '30-45 minuti'
    });

    // Inizializza il modello Gemini 2.5 Flash (il più recente e veloce)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Genera la ricetta
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Pulisci il testo da eventuali markdown code blocks
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parsa la risposta JSON
    let ricetta;
    try {
      ricetta = JSON.parse(text);
    } catch (parseError) {
      console.error('Errore parsing JSON:', text);
      throw new Error('Formato risposta AI non valido');
    }

    // Valida che la ricetta contenga tutti i campi necessari
    if (!ricetta.recipe_name || !ricetta.ingredients || !ricetta.steps) {
      throw new Error('Ricetta generata incompleta');
    }

    // Valida che almeno l'80% degli ingredienti prioritari sia usato
    const priorityFoodNames = priority_foods.map(f => f.name.toLowerCase());
    const ingredientsText = ricetta.ingredients.join(' ').toLowerCase();

    const usedPriorityFoods = priorityFoodNames.filter(name =>
      ingredientsText.includes(name)
    );

    const usagePercentage = (usedPriorityFoods.length / priorityFoodNames.length) * 100;

    if (usagePercentage < 80) {
      console.warn(`Solo ${usagePercentage}% degli ingredienti prioritari usati`);
    }

    // Arricchisci la risposta con metadati
    return {
      ...ricetta,
      metadata: {
        priority_foods_used: usedPriorityFoods.length,
        total_priority_foods: priorityFoodNames.length,
        usage_percentage: Math.round(usagePercentage),
        generated_at: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Errore generazione ricetta:', error);

    if (error.message.includes('API key')) {
      throw new Error('Configurazione API Gemini non valida');
    }

    throw error;
  }
};

/**
 * Salva una ricetta generata nel database
 * @param {string} userId - ID dell'utente
 * @param {Object} ricettaData - Dati della ricetta da salvare
 * @returns {Promise<Object>} Ricetta salvata
 */
export const salvaRicetta = async (userId, ricettaData) => {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  const ricetta = await prisma.ricetta.create({
    data: {
      idUtente: userId,
      titolo: ricettaData.recipe_name,
      tempoPreparazione: parseInt(ricettaData.prep_time) || null,
      contenutoJson: {
        ingredients: ricettaData.ingredients,
        steps: ricettaData.steps,
        metadata: ricettaData.metadata || {}
      },
      notaAntiSpreco: ricettaData.anti_waste_note
    }
  });

  return ricetta;
};
