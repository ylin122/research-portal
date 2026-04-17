const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://azhbbywzspflrxpqrdqw.supabase.co",
  "sb_publishable_jcu88moYddHVgzWSZ6QX6w_FXD02T7Z"
);

const companies = [
  {
    id: "google_eq",
    name: "Alphabet / Google (GOOGL)",
    sector: "equity",
    sub: "megacap tech",
    fields: {
      overview: `• Alphabet Inc (Nasdaq: GOOGL/GOOG) — $3.6T market cap, largest digital advertising company globally
• Core segments: Google Services (Search, YouTube, Android, Chrome, Maps, Gmail, Play), Google Cloud (GCP), Other Bets (Waymo, Verily, Calico)
• CEO: Sundar Pichai. CFO: Ruth Porat. DeepMind CEO: Demis Hassabis
• FY2025 revenue ~$403B (+14% YoY). Operating income ~$125B. Net income ~$100B
• Google Cloud revenue ~$44B run rate (+29% YoY), now profitable at ~$2B quarterly operating income
• 2025 capex ~$75B, primarily AI/cloud infrastructure. Largest AI investor alongside Microsoft and Meta
• Cash position: ~$127B net cash. One of the strongest balance sheets in tech
• 182,000+ employees globally`,

      products: `• Google Search: ~90% global search market share. AI Overviews (SGE) rolling out. $175B+ annual search revenue
• YouTube: 2.7B+ monthly active users. $36B+ annual ad revenue. YouTube Premium, YouTube TV, Shorts
• Google Cloud Platform (GCP): 3rd largest cloud provider (~12% share). BigQuery, Vertex AI, GKE
• Android: ~72% global mobile OS market share. Google Play Store
• Gemini AI: Gemini 2.5 Pro (frontier model), Gemini Flash, Gemini Nano (on-device). Competing with GPT-4/Claude
• Google DeepMind: AlphaFold, AlphaGo legacy. Leading AI research lab. ~3,000 researchers
• TPU (Tensor Processing Unit): Custom AI chips. TPU v5p deployed, v6/v7 on roadmap. Alternative to NVIDIA GPUs
• Waymo: Leading autonomous driving. 100K+ paid rides/week in SF, Phoenix, LA, Austin. $45B+ implied valuation
• Google Workspace: Gmail, Docs, Sheets, Drive. 3B+ users. Enterprise ($300B+ TAM)
• Chrome: ~65% browser market share. Chromebook ecosystem
• Google Ads: Search ads, display (AdSense), YouTube ads, programmatic (DV360)`,

      customers: `• Advertisers: 8M+ active advertisers globally. Largest: Amazon, P&G, Samsung, Comcast
• Cloud: Enterprise (Target, Spotify, PayPal, Twitter/X), Public sector, Startups (Firebase)
• Consumer: 4.3B+ users across Google products. 2.7B YouTube MAU. 1.8B Gmail users
• Android OEMs: Samsung, Xiaomi, Oppo, Vivo — Google Mobile Services licensing
• AI/Cloud customers: Anthropic ($3B+ investment, GCP customer), Character.AI, Mistral
• Waymo riders: Consumer ride-hailing in 4 US cities`,

      industry: `• Digital advertising: $680B+ global market (2025). Google + Meta = ~50% duopoly. Growing 8-10%/yr
• Cloud infrastructure: $300B+ market growing 20%+. AWS #1 (31%), Azure #2 (25%), GCP #3 (12%)
• AI/ML: $200B+ market. Google competing on frontier models (Gemini), custom silicon (TPU), and cloud AI services
• Autonomous vehicles: $2T+ long-term TAM. Waymo is the clear technology leader with most real-world miles
• Mobile OS: Android ~72% global share. Generates revenue via Play Store (30% take rate), search defaults, licensing
• Key trends: AI shifting search UX (risk to ad model?), cloud AI becoming primary growth driver, TPU as NVIDIA alternative`,

      competitive: `• Search: Near-monopoly. Bing/Microsoft (2-3% share), Perplexity (AI-native search threat), TikTok (Gen Z search)
• Cloud: Behind AWS and Azure but growing fastest. Differentiation: data analytics (BigQuery), AI/ML (Vertex AI, TPU)
• AI models: Gemini vs GPT-4/Claude. Google has the data advantage (Search, YouTube) but slower to ship products
• Video: YouTube is #1 online video platform. Competition from TikTok (short-form), Netflix (long-form), Twitch (live)
• Autonomous driving: Waymo is the clear leader vs Cruise (paused), Tesla FSD (different approach), Baidu Apollo (China)
• Antitrust risk: DOJ search monopoly ruling (2024). Potential remedies: browser choice screens, default search unbundling
• Moats: Search data flywheel, YouTube content library, Android installed base, Google Maps data, AI talent (DeepMind)`,

      transactions: `• Wiz acquisition: $32B (2025) — largest ever tech acquisition. Cloud security
• Mandiant acquisition: $5.4B (2022) — cybersecurity
• Fitbit: $2.1B (2021) — wearables
• Anthropic investment: $3B+ — strategic AI investment, GCP customer lock-in
• Character.AI acquisition: $2.7B acqui-hire (2024) — AI talent (Noam Shazeer)
• Stock buybacks: $62B in 2024. $70B+ authorized. Returning ~60% of free cash flow to shareholders
• First-ever dividend initiated Q2 2024: $0.20/share quarterly ($10B/year annualized)`,
    },
  },
  {
    id: "tesla_eq",
    name: "Tesla (TSLA)",
    sector: "equity",
    sub: "megacap tech",
    fields: {
      overview: `• Tesla Inc (Nasdaq: TSLA) — $1.3T market cap. World's most valuable automaker
• CEO: Elon Musk (also CEO of SpaceX, xAI; CTO of X). CFO: Vaibhav Taneja
• Core business: Electric vehicles, energy storage (Megapack), solar, FSD/autonomy, Optimus robot, xAI integration
• FY2025 revenue ~$120B. Automotive revenue ~$95B. Energy ~$15B. Services ~$10B
• Delivered ~2.5M vehicles in 2025. Global EV market share ~15% (down from ~20% in 2023)
• 2025 capex ~$12B. Factories: Fremont CA, Austin TX, Shanghai, Berlin, planned Mexico
• TTM EPS ~$1.08. Forward EPS ~$2.81. Currently trading at ~325x TTM, ~125x forward
• ~150,000 employees globally`,

      products: `• Model Y: Best-selling car globally (any powertrain). ~60% of Tesla deliveries. Refreshed "Juniper" 2025
• Model 3: Sedan. Highland refresh 2024. ~25% of deliveries
• Model S/X: Premium sedan/SUV. Low volume (~3% of deliveries). Aging platform
• Cybertruck: Launched late 2023. Ramping production. Polarizing design. ~$80K+ average selling price
• Tesla Semi: Class 8 electric truck. Limited production. PepsiCo, UPS early customers
• Megapack: Grid-scale energy storage. $15B+ annual revenue. 40%+ gross margins. Fastest-growing segment
• Solar Roof / Powerwall: Residential energy. Smaller but growing
• Full Self-Driving (FSD): $8K-12K option or $99-199/mo subscription. L2+ ADAS. Not truly autonomous yet
• Optimus Robot: Humanoid robot. Prototype stage. Musk claims could be worth more than auto business
• TERAFAB: $20-25B chip fab JV with SpaceX/xAI announced Mar 2026. 1TW compute target
• Supercharger Network: 50K+ stations globally. Opening to other OEMs (NACS standard adopted)`,

      customers: `• Consumer EV buyers: Premium ($50-100K+ ASP). Demographic: tech-forward, environmentally conscious, Musk supporters
• Fleet/commercial: Hertz (scaled back), Uber/Lyft drivers, small business fleets
• Energy: Utilities (Megapack deployments), commercial/industrial, residential (Powerwall/Solar)
• Semi: PepsiCo, UPS, Sysco — early commercial truck customers
• FSD: ~2M vehicles with FSD hardware. Subscription conversion rate unclear
• Supercharger: All EV makers (Ford, GM, Rivian, Hyundai adopted NACS connector)`,

      industry: `• Global EV market: ~18M units in 2025, ~$500B. Growing 20-25%/yr. Tesla ~15% global share, declining
• Energy storage: $50B+ market growing 30%+. Tesla Megapack is market leader
• Autonomous driving: $2T+ long-term TAM. Tesla FSD (vision-only) vs Waymo (lidar-based) — different philosophies
• AI compute: TERAFAB positions Tesla in chip manufacturing. xAI Colossus is one of largest GPU clusters
• Key trends: Chinese EV competition (BYD surpassed Tesla in total deliveries), margin compression, FSD monetization unclear, energy becoming larger share of revenue and profit
• Robotaxi: Musk targeting 2026 launch in Austin/SF. Regulatory approval uncertain. Would transform economics
• Optimus: If humanoid robots reach scale, TAM could be $10T+. Highly speculative, 2028+ timeline`,

      competitive: `• EVs: BYD (largest EV maker by volume), Hyundai/Kia (fastest-growing), VW Group, Mercedes, BMW, Rivian, Lucid
• Tesla's edge: Brand, Supercharger network, vertical integration, FSD data advantage, manufacturing cost leadership
• Tesla's weakness: Margin compression (price cuts), aging Model S/X, Musk distraction (X, DOGE, politics), China competition
• Energy storage: BYD, Fluence, LG Energy Solution. Tesla Megapack has cost + integration advantage
• Autonomy: Waymo (technology leader, but geofenced), Cruise (paused), Baidu Apollo (China). Tesla has scale advantage (fleet data)
• Moats: Supercharger network (industry standard), brand loyalty, manufacturing scale, FSD data (billions of miles), Gigafactory cost advantage
• Risks: Musk key-man risk, political polarization hurting brand, Chinese tariffs/competition, FSD liability, valuation premium requires flawless execution`,

      transactions: `• TERAFAB: $20-25B chip fab JV with SpaceX/xAI (announced Mar 2026). Austin TX. Two chip families: edge inference + space
• xAI relationship: Musk's separate AI company. Colossus GPU cluster (100K+ H100s). Tesla providing Megapack power
• SpaceX synergy: Starlink for vehicle connectivity. SpaceX IPO expected H2 2026 at ~$1.5T
• Solaris Energy (SEI): 67% of SEI's orderbook is xAI/Colossus. 600 MW+ gas turbine fleet
• No major acquisitions. Tesla builds vs buys. Vertical integration strategy
• Stock: $35B+ buyback authorized but rarely used. No dividend. Musk owns ~13% (~$170B)`,
    },
  },
];

async function main() {
  for (const co of companies) {
    // Insert company
    const { error: coErr } = await supabase.from("companies").upsert(
      { id: co.id, name: co.name, sector: co.sector, sub: co.sub },
      { onConflict: "id" }
    );
    if (coErr) { console.error(`Company ${co.id}:`, coErr.message); continue; }
    console.log(`Company: ${co.name}`);

    // Insert fields
    for (const [fieldKey, text] of Object.entries(co.fields)) {
      const { error: fErr } = await supabase.from("company_fields").upsert(
        {
          company_id: co.id,
          field_key: fieldKey,
          text,
          date: new Date().toISOString().split("T")[0],
        },
        { onConflict: "company_id,field_key" }
      );
      if (fErr) console.error(`  Field ${fieldKey}:`, fErr.message);
      else console.log(`  ${fieldKey}: OK`);
    }
  }
  console.log("\nDone.");
}

main();
