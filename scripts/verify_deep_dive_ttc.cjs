const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/../.env.local" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

(async () => {
  const { data, error } = await supabase
    .from("deep_dives")
    .select("id, title, topic, summary, sections")
    .eq("id", "ttc_inference_scaling")
    .single();
  if (error) { console.error("ERROR:", error); process.exit(1); }
  console.log("ID:       ", data.id);
  console.log("Title:    ", data.title);
  console.log("Topic:    ", data.topic);
  console.log("Sections: ", (data.sections || []).length);
  console.log("Summary:  ", (data.summary || "").slice(0, 120) + "...");
  console.log("");
  console.log("Section titles:");
  (data.sections || []).forEach((s, i) => console.log(`  ${i + 1}. ${s.title}`));
  process.exit(0);
})();
