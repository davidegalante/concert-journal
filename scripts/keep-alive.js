const https = require('https');

// Legge le variabili d'ambiente (impostate nei Secrets di GitHub)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERRORE: Variabili d\'ambiente SUPABASE_URL o SUPABASE_ANON_KEY mancanti.');
  process.exit(1);
}

// Costruiamo l'URL per la REST API di Supabase.
// Selezioniamo solo l'ID di un solo concerto per rendere la chiamata leggerissima.
const url = `${SUPABASE_URL}/rest/v1/concerts?select=id&limit=1`;

const options = {
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  }
};

console.log(`Esecuzione Ping Keep-Alive verso: ${SUPABASE_URL}...`);

const req = https.get(url, options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Keep-alive ping riuscito! Il database è attivo.');
      // Opzionale: stampa i dati per debug (se ci sono)
      // console.log(data);
    } else {
      console.error(`❌ Keep-alive ping fallito. Risposta: ${data}`);
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Errore di connessione: ${e.message}`);
  process.exit(1);
});

req.end();