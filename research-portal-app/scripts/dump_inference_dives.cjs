const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/../.env.local" });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);
(async () => {
  for (const id of ["ai-inference-time-scaling", "ttc_inference_scaling"]) {
    const { data, error } = await supabase.from("deep_dives").select("*").eq("id", id).single();
    if (error) { console.error(id, error); continue; }
    console.log("\n========================================");
    console.log("ID:     ", data.id);
    console.log("Title:  ", data.title);
    console.log("Topic:  ", data.topic);
    console.log("Summary:", data.summary);
    console.log("Sections:");
    (data.sections || []).forEach((s, i) => {
      console.log(`  ${i+1}. ${s.title}`);
    });
  }
  // Also dump the concept
  const { data: c } = await supabase.from("concepts").select("*").eq("id", "inference_time_scaling").single();
  console.log("\n=== CONCEPT inference_time_scaling ===");
  console.log(JSON.stringify(c, null, 2));
})();
