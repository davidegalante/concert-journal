import https from 'https';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERRORE: Secrets mancanti su GitHub!');
  process.exit(1);
}

// Proviamo a leggere una tabella, se fallisce puntiamo all'URL radice
const url = `${SUPABASE_URL}/rest/v1/`; 

const options = {
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  }
};

console.log(`Paging Supabase: ${SUPABASE_URL}...`);

const req = https.get(url, options, (res) => {
  if (res.statusCode >= 200 && res.statusCode < 400) {
    console.log(`✅ Status: ${res.statusCode}. Il database è SVEGLIO!`);
  } else {
    console.error(`❌ Errore. Status: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (e) => {
  console.error(`❌ Errore connessione: ${e.message}`);
  process.exit(1);
});