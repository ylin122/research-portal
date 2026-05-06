const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/../.env.local" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const ALIASES_BLOCK =
  "Also known as: test-time scaling, test-time compute (TTC), inference-time compute, test-time inference scaling, inference scaling laws. " +
  "Vendor branding: reasoning models (o-series, R-series, Grok-4), thinking models (Gemini Thinking), extended thinking (Claude). " +
  "Mechanism subsets: chain-of-thought (CoT), long-CoT, best-of-N, self-consistency, verifier-guided search, tree-of-thought, MCTS, self-refinement, Reflexion. " +
  "DO NOT confuse with: test-time training (TTT — actually updates weights), pretraining/Chinchilla scaling (opposite axis), inference optimization/efficiency (cheaper, not better).";

(async () => {
  const id = "inference_time_scaling";
  const { data: existing, error: fetchErr } = await supabase
    .from("concepts").select("*").eq("id", id).single();
  if (fetchErr) { console.error("FETCH ERROR:", fetchErr); process.exit(1); }

  const newExplanation =
    `**Also known as / vocabulary you'll see in the wild:**\n${ALIASES_BLOCK}\n\n` +
    existing.explanation;

  const { data, error } = await supabase
    .from("concepts")
    .update({ explanation: newExplanation, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();
  if (error) { console.error("UPDATE ERROR:", error); process.exit(1); }
  console.log("OK — concept updated:", data[0].id);
  console.log("First 400 chars of explanation:");
  console.log(data[0].explanation.slice(0, 400));
  process.exit(0);
})();
