#!/usr/bin/env node
// One-off: read compute_prices back from Supabase and print headline matrix.
// Confirms cron writes landed correctly. Throwaway after Phase 2 verifies.
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "..", ".env.local") });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data, error } = await supabase
  .from("compute_prices")
  .select("*")
  .order("provider").order("cohort").order("surface");

if (error) { console.error(error); process.exit(1); }
console.log(`Rows in DB: ${data.length}\n`);

// Headline: lowest on-demand $/GPU-hr per cohort × provider
const matrix = {};
for (const r of data) {
  if (r.surface !== "on_demand") continue;
  matrix[r.cohort] ??= {};
  const cur = matrix[r.cohort][r.provider];
  if (cur == null || +r.hourly_per_gpu_usd < cur) matrix[r.cohort][r.provider] = +r.hourly_per_gpu_usd;
}
const cohorts = ["A100", "H100", "H200", "B200", "B300", "GB200"];
console.log("COHORT  AWS        AZURE      GCP");
for (const c of cohorts) {
  const m = matrix[c] || {};
  const fmt = v => v == null ? "—".padEnd(11) : `$${v.toFixed(2)}`.padEnd(11);
  console.log(c.padEnd(8) + fmt(m.AWS) + fmt(m.Azure) + fmt(m.GCP));
}
console.log("");
// Distinct surfaces actually present in DB
const surfaces = [...new Set(data.map(r => r.surface))].sort();
console.log(`Surfaces present: ${surfaces.join(", ")}`);
