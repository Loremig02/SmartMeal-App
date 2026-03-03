import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  try {
    console.log('🔍 Checking available models...');
    console.log('API Key:', process.env.GEMINI_API_KEY.substring(0, 20) + '...\n');

    // Chiamata diretta alle API REST di Google
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error:', response.status, response.statusText);
      console.error('Details:', error);
      return;
    }

    const data = await response.json();

    console.log('✅ Available models:');
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        console.log(`\n- ${model.name}`);
        console.log(`  Display Name: ${model.displayName}`);
        console.log(`  Supported: ${model.supportedGenerationMethods?.join(', ')}`);
      });
    } else {
      console.log('No models found');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

listModels();
