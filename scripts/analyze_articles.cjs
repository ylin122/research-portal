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
  console.log('  PATCH', id, '->', r.status);
}

(async () => {
  await patch('gmail_19d8e37bc363c4db', {
    title: 'Software vs Semis: Why the Market Left Software for Dead \u2014 Matt Slotnick / Metacritic Capital (Apr 14, 2026)',
    summary: "Analysis of the software sector selloff triggered by Claude capabilities, which produced the 2nd worst day on record for software vs semis. Argues that while software companies are poorly messaging their response to AI agents, they remain the critical hub for organizing business work. The market is pricing in terminal value destruction, but the real risk is fighting agents rather than embracing them.",
    key_takeaways: [
      "Software vs semis had its 2nd worst day on record following Claude capabilities demonstration",
      "Software companies are antagonizing the AI agent ecosystem \u2014 calling agents parasites and threatening to tax agent access",
      "Software vendors remain the critical hub for organizing business workflows, but systems were built exclusively for human workers",
      "As agent-to-human work ratios shift, software must actively support agent workloads or risk being built around",
      "The market is pricing in near-zero terminal value for many software companies, which the author views as an overcorrection",
      "Software companies that embrace agents as first-class users will survive; those that fight will see the ecosystem route around them",
    ],
    investment_implications: "The software selloff creates potential value for companies that pivot to agent-native architectures, but most incumbents are still in denial. Watch for companies shifting from per-seat to per-workflow or per-outcome pricing as the clearest adaptation signal. Portfolio exposure: None directly \u2014 sector-level thesis on software disruption risk.",
    themes: ["AI Agents", "Software Disruption", "SaaS Pricing Models", "AI Infrastructure", "Enterprise Software", "Market Sentiment"],
    questions: [
      "Which software companies are most exposed to agent-driven workflow replacement?",
      "What does per-agent or per-workflow pricing look like for incumbents like Salesforce, ServiceNow, Workday?",
      "How quickly can agents actually replace human-operated SaaS workflows?",
      "Are there software companies that have already pivoted to agent-first architectures?",
      "What is the bear case for semis if software terminal value approaches zero?",
    ],
    published_date: "2026-04-14",
  });
  console.log('  Done: Software vs Semis');

  await patch('gmail_19d8e1ad8be756d2', {
    title: "China\u2019s Second Shock: The Assault on High-End Manufacturing \u2014 Financial Times (Apr 14, 2026)",
    summary: "FT deep-dive on China\u2019s second shock to global manufacturing \u2014 no longer just low-cost goods but an assault on high-end, technology-intensive products. EV charger sensor prices collapsed from Rmb200 to Rmb10 in six years, driving European competitors out. Vicious domestic competition, massive scale, engineering talent, and subsidies are producing world-beating Chinese champions destroying margins globally.",
    key_takeaways: [
      "Chinese EV charger sensor prices collapsed from ~Rmb200 ($30) to Rmb10 ($1.40) in six years, driving European competitors out entirely",
      "Mega-Senway went from 20K units in 2019 to projected 10M units in 2026, margins compressing but volume exploding",
      "Pattern repeating across high-end manufacturing: solar panels, EVs, batteries, industrial robots, advanced components",
      "First China shock (2000s) was low-cost goods; second shock targets technology-intensive sectors with higher margins",
      "China advantages: vicious domestic competition as natural selection, massive engineering talent, industrial-scale subsidies, speed of execution",
      "European and Japanese incumbents being systematically undercut even in segments they dominated for decades",
    ],
    investment_implications: "Bearish for European industrial and component companies competing where Chinese manufacturers have achieved scale. The compression from $30 to $1.40 per unit is the playbook China runs across high-end manufacturing. Companies with IP moats China cannot replicate (EUV lithography, advanced semiconductors) are relatively insulated. Portfolio exposure: ASML (via semi supply chain \u2014 China cannot replicate EUV).",
    themes: ["China Manufacturing", "Industrial Competition", "EV Supply Chain", "Trade Policy", "Geopolitics", "Margin Compression"],
    questions: [
      "Which European/Japanese industrial companies are most exposed to Chinese high-end manufacturing competition?",
      "How does this affect the semiconductor equipment industry where China depends on imports?",
      "What industries are next for the China second shock treatment?",
      "How do tariffs and export controls change the trajectory?",
      "Is there a parallel risk for US software from Chinese AI/software competitors?",
    ],
    published_date: "2026-04-14",
  });
  console.log('  Done: China Second Shock');

  await patch('gmail_19d8e0d46177565d', {
    title: "Samsung & SK Hynix Shift Engineers to HBM4, Outsource Photomasks; SK Hynix Cuts HBM4 Target 20-30% \u2014 Citrini Research (Apr 14, 2026)",
    summary: "Citrini Research recap on two Korean semiconductor developments: Samsung and SK Hynix are reassigning engineers from photomask shops to HBM4 divisions, forcing outsourcing of legacy-node photomask production to Japanese specialists. SK Hynix has reportedly cut its 2026 HBM4 shipment target by 20-30% due to yield and qualification challenges.",
    key_takeaways: [
      "Samsung and SK Hynix pulling experienced engineers from photomask divisions to HBM4 logic die implementation and yield improvement",
      "Legacy-node photomask production (non-EUV) being outsourced to Japanese specialists DNP (7912 JP) and Toppan Photomask (7911 JP)",
      "Cutting-edge EUV photomasks for 2-5nm processes remain manufactured in-house for security",
      "SK Hynix reportedly cut 2026 HBM4 shipment target by 20-30%, suggesting yield or qualification delays",
      "Creates new addressable market for Japanese photomask companies that previously did not exist",
      "Engineer reallocation signals how critical HBM4 is \u2014 both companies prioritizing it above other operations",
    ],
    investment_implications: "Photomask outsourcing is a second-order HBM demand beneficiary for Japanese specialists (DNP, Toppan). The SK Hynix HBM4 shipment cut is more significant: if confirmed, it tightens HBM supply and benefits Micron as #3 HBM supplier gaining share. Portfolio exposure: MU (benefits from SK Hynix supply constraints in HBM).",
    themes: ["HBM4", "Semiconductor Manufacturing", "Photomask", "SK Hynix", "Samsung", "Memory Supply Chain", "Japan Semiconductors"],
    questions: [
      "What is the photomask outsourcing opportunity for DNP and Toppan in dollar terms?",
      "Is SK Hynix HBM4 cut driven by yield issues, NVIDIA qualification delays, or demand factors?",
      "How does Samsung HBM4 progress compare \u2014 are they also cutting targets?",
      "What does reduced HBM4 supply mean for NVIDIA Rubin GPU production timelines?",
      "Could Micron capture meaningful HBM4 share if both Samsung and SK Hynix face delays?",
    ],
    published_date: "2026-04-14",
  });
  console.log('  Done: Samsung/SK Hynix HBM4');

  console.log('\nAll 3 articles analyzed.');
})();
