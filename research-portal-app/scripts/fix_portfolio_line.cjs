const dotenv = require('dotenv');
dotenv.config();
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function patch(id, data) {
  const r = await fetch(url + '/rest/v1/kb_articles?id=eq.' + id, {
    method: 'PATCH',
    headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(data),
  });
  return r.status;
}

(async () => {
  const r = await fetch(url + '/rest/v1/kb_articles?select=id,title,investment_implications&investment_implications=not.is.null', {
    headers: { apikey: key, Authorization: 'Bearer ' + key }
  });
  const articles = await r.json();
  let fixed = 0;

  for (const a of articles) {
    const impl = a.investment_implications || '';
    if (!impl.includes('Portfolio exposure:')) continue;
    // Already on its own line
    if (impl.includes('\n\nPortfolio exposure:')) continue;

    // Split at "Portfolio exposure:" and put it on its own line
    const idx = impl.indexOf('Portfolio exposure:');
    const before = impl.slice(0, idx).trimEnd();
    const portfolio = impl.slice(idx);

    const newImpl = before + '\n\nPortfolio exposure: ' + portfolio.replace('Portfolio exposure:', '').trim();
    const status = await patch(a.id, { investment_implications: newImpl });
    console.log(`  Fixed (${status}): ${a.title.slice(0, 70)}`);
    fixed++;
  }

  console.log(`\nDone. Fixed ${fixed} articles.`);
})();
