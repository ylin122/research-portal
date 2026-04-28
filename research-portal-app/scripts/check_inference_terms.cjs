const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/../.env.local" });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);
(async () => {
  const { data: concepts } = await supabase.from("concepts").select("id, title, one_liner, topic, explanation, key_points, related");
  console.log("=== CONCEPTS matching inference/TTC/reasoning ===");
  (concepts || []).forEach(c => {
    const blob = JSON.stringify(c).toLowerCase();
    if (blob.match(/inference[- ]time|test[- ]time|\bttc\b|reasoning model|chain[- ]of[- ]thought|thinking model|extended thinking/)) {
      console.log(`  [${c.id}] ${c.title} :: ${c.one_liner || ''}`);
    }
  });
  const { data: dives } = await supabase.from("deep_dives").select("id, title, topic");
  console.log("\n=== ALL DEEP DIVES ===");
  (dives || []).forEach(d => console.log(`  ${d.id} | ${d.title} | ${d.topic}`));
})();
