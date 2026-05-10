#!/usr/bin/env node
// Dry-run of the weekly pricing cron. Pulls AWS (Vantage) + Azure (Retail
// Prices) + GCP (Cloud Billing Catalog), classifies SKUs against the cohort
// map, and prints exactly the rows that would be upserted into compute_prices.
// No DB writes.
//
// Run: node scripts/dry-run-pricing-cron.mjs
// With GCP: GCP_API_KEY=… node scripts/dry-run-pricing-cron.mjs

import { COHORT_MAP, classifySku, COHORT_ORDER } from "../src/data/computeCohortMap.js";

const today = new Date().toISOString().slice(0, 10);
const log = (...a) => console.log(...a);
const hr = () => log("─".repeat(80));

const rows = []; // accumulates would-be DB rows
const unmapped = { AWS: new Set(), Azure: new Set(), GCP: new Set() };

// ───────────────────────── AWS via Vantage ─────────────────────────
async function pullAWS() {
  const url = "https://instances.vantage.sh/instances.json";
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Vantage HTTP ${r.status}`);
  const data = await r.json();
  let mapped = 0, withPrice = 0;
  for (const inst of data) {
    const t = inst.instance_type;
    if (!t) continue;
    // Only consider GPU/accelerator families to keep noise down
    if (!/^(p[2-9]|g[2-9]|trn|inf|dl)/.test(t)) continue;
    const m = classifySku("AWS", t);
    if (!m) {
      // Only flag p-series we don't classify (skip g-series for now since
      // they're inference-tier and out of v1 scope)
      if (/^p[2-9]/.test(t)) unmapped.AWS.add(t);
      continue;
    }
    mapped++;
    const region = "us-east-1";
    const od = inst.pricing?.[region]?.linux?.ondemand;
    if (od == null || od === "" || od === "N/A") continue;
    const hourly = parseFloat(od);
    if (!isFinite(hourly)) continue;
    withPrice++;
    rows.push({
      as_of_date: today,
      provider: "AWS",
      instance_sku: t,
      cohort: m.cohort,
      gpus_per_instance: m.gpus,
      region,
      surface: "on_demand",
      hourly_usd: +hourly.toFixed(4),
      hourly_per_gpu_usd: +(hourly / m.gpus).toFixed(4),
    });
  }
  log(`  AWS: ${mapped} SKUs classified, ${withPrice} with us-east-1 on-demand price`);
}

// ───────────────────────── Azure ─────────────────────────
async function pullAzure() {
  // Pull all GPU-relevant SKUs (ND-series). May be paginated.
  const baseFilter = `serviceName eq 'Virtual Machines' and armRegionName eq 'eastus' and contains(armSkuName, 'ND') and priceType eq 'Consumption'`;
  let url = `https://prices.azure.com/api/retail/prices?$filter=${encodeURIComponent(baseFilter)}`;
  let pages = 0, items = 0, mapped = 0;
  // Aggregate: for the same (sku, region, surface), prefer the lowest price
  // (spot SKUs often appear twice — once as on-demand, once as spot)
  const seen = new Map();
  while (url && pages < 10) {
    pages++;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Azure HTTP ${r.status}`);
    const j = await r.json();
    for (const p of j.Items || []) {
      items++;
      const sku = p.armSkuName;
      if (!sku) continue;
      const m = classifySku("Azure", sku);
      if (!m) { unmapped.Azure.add(sku); continue; }
      const surface = /spot/i.test(p.skuName || "") ? "spot" :
                      /low\s*priority/i.test(p.skuName || "") ? "low_priority" :
                      "on_demand";
      const key = `${sku}|${p.armRegionName}|${surface}`;
      const hourly = parseFloat(p.unitPrice);
      if (!isFinite(hourly) || hourly <= 0) continue;
      // Take the lowest price seen for the (sku, region, surface) tuple.
      // Azure returns multiple variants (with/without OS, etc.) per SKU.
      const prev = seen.get(key);
      if (prev == null || hourly < prev.hourly_usd) {
        seen.set(key, {
          as_of_date: today,
          provider: "Azure",
          instance_sku: sku,
          cohort: m.cohort,
          gpus_per_instance: m.gpus,
          region: p.armRegionName,
          surface,
          hourly_usd: +hourly.toFixed(4),
          hourly_per_gpu_usd: +(hourly / m.gpus).toFixed(4),
        });
      }
    }
    url = j.NextPageLink || null;
  }
  for (const row of seen.values()) { rows.push(row); mapped++; }
  log(`  Azure: ${pages} page(s), ${items} raw items, ${mapped} classified rows`);
}

// ───────────────────────── GCP ─────────────────────────
async function pullGCP() {
  if (!process.env.GCP_API_KEY) {
    log("  GCP: skipped (no GCP_API_KEY)");
    return;
  }
  // Compute Engine service id is "6F81-5844-456A"
  const base = `https://cloudbilling.googleapis.com/v1/services/6F81-5844-456A/skus?key=${process.env.GCP_API_KEY}`;
  let pageToken = "", pages = 0, items = 0, mapped = 0;
  while (pages < 20) {
    pages++;
    const url = base + (pageToken ? `&pageToken=${pageToken}` : "") + "&pageSize=5000";
    const r = await fetch(url);
    if (!r.ok) throw new Error(`GCP HTTP ${r.status}`);
    const j = await r.json();
    for (const sku of j.skus || []) {
      items++;
      const desc = sku.description || "";
      // Restrict to GPU SKUs (skip CPU/network/storage/licensing)
      if (!/\bGPU\b|\bGpu\b/.test(desc)) continue;
      if (/Licensing Fee/i.test(desc)) continue;
      if (sku.category?.usageType !== "OnDemand" && sku.category?.usageType !== "Preemptible") continue;
      const m = classifySku("GCP", desc);
      if (!m) { unmapped.GCP.add(desc); continue; }
      // Take Americas region only for v1 to mirror us-east-1/eastus
      const region = (sku.serviceRegions || [])[0] || "global";
      if (!/us-/i.test(region) && region !== "global") continue;
      const tier = sku.pricingInfo?.[0]?.pricingExpression?.tieredRates?.[0]?.unitPrice;
      if (!tier) continue;
      const hourly = Number(tier.units || 0) + Number(tier.nanos || 0) / 1e9;
      if (!isFinite(hourly) || hourly <= 0) continue;
      // GCP collapses many products under usageType="OnDemand". Disambiguate by description:
      //   - "Spot Preemptible" / "Preemptible" → spot
      //   - "Reserved … Calendar Mode" / "in Calendar Mode" → reserved (long-term commit)
      //   - "DWS … Defined Duration" / "DWS Calendar Mode" → committed_short (1-7 day flex)
      //   - everything else → on_demand (standard list)
      let surface;
      if (sku.category?.usageType === "Preemptible" || /Spot Preemptible|\bPreemptible\b/i.test(desc)) {
        surface = "spot";
      } else if (/Calendar Mode/i.test(desc) && !/DWS/i.test(desc)) {
        surface = "reserved";
      } else if (/DWS|Defined Duration/i.test(desc)) {
        surface = "committed_short";
      } else {
        surface = "on_demand";
      }
      rows.push({
        as_of_date: today,
        provider: "GCP",
        instance_sku: desc,
        cohort: m.cohort,
        gpus_per_instance: m.gpus,
        region,
        surface,
        hourly_usd: +hourly.toFixed(4),
        hourly_per_gpu_usd: +(hourly / m.gpus).toFixed(4),
      });
      mapped++;
    }
    pageToken = j.nextPageToken || "";
    if (!pageToken) break;
  }
  log(`  GCP: ${pages} page(s), ${items} raw items, ${mapped} classified rows`);
}

// ───────────────────────── main ─────────────────────────
(async () => {
  log(`\nDry-run cron — ${today}\n`);
  hr(); log("PULL"); hr();
  try { await pullAWS(); } catch (e) { log(`  AWS error: ${e.message}`); }
  try { await pullAzure(); } catch (e) { log(`  Azure error: ${e.message}`); }
  try { await pullGCP(); } catch (e) { log(`  GCP error: ${e.message}`); }

  hr(); log(`ROWS THAT WOULD BE WRITTEN  (total: ${rows.length})`); hr();
  // Sort: provider, cohort order, surface, sku
  rows.sort((a, b) => {
    if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
    const ai = COHORT_ORDER.indexOf(a.cohort), bi = COHORT_ORDER.indexOf(b.cohort);
    if (ai !== bi) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    if (a.surface !== b.surface) return a.surface.localeCompare(b.surface);
    return a.instance_sku.localeCompare(b.instance_sku);
  });
  log(
    "PROVIDER".padEnd(8) +
    "COHORT".padEnd(8) +
    "SURFACE".padEnd(12) +
    "GPU#".padEnd(5) +
    "$/INSTANCE-HR".padEnd(15) +
    "$/GPU-HR".padEnd(11) +
    "REGION".padEnd(14) +
    "SKU"
  );
  for (const r of rows) {
    log(
      r.provider.padEnd(8) +
      r.cohort.padEnd(8) +
      r.surface.padEnd(12) +
      String(r.gpus_per_instance).padEnd(5) +
      `$${r.hourly_usd.toFixed(4)}`.padEnd(15) +
      `$${r.hourly_per_gpu_usd.toFixed(4)}`.padEnd(11) +
      r.region.padEnd(14) +
      r.instance_sku
    );
  }

  hr(); log("UNMAPPED SKUs  (extend src/data/computeCohortMap.js to capture)"); hr();
  for (const [provider, set] of Object.entries(unmapped)) {
    if (set.size === 0) continue;
    log(`  ${provider}: ${set.size}`);
    [...set].slice(0, 20).forEach(s => log(`    ${s}`));
    if (set.size > 20) log(`    … ${set.size - 20} more`);
  }
  log("");

  hr(); log("HEADLINE: $/GPU-HR ON-DEMAND BY COHORT × PROVIDER (us regions)"); hr();
  // Build the comparison matrix
  const matrix = {}; // cohort -> provider -> min $/GPU-hr (on-demand)
  for (const r of rows) {
    if (r.surface !== "on_demand") continue;
    matrix[r.cohort] ??= {};
    const cur = matrix[r.cohort][r.provider];
    if (cur == null || r.hourly_per_gpu_usd < cur) matrix[r.cohort][r.provider] = r.hourly_per_gpu_usd;
  }
  log("COHORT".padEnd(8) + "AWS".padEnd(11) + "AZURE".padEnd(11) + "GCP".padEnd(11));
  for (const c of COHORT_ORDER) {
    const m = matrix[c] || {};
    const fmt = (v) => v == null ? "—".padEnd(11) : `$${v.toFixed(2)}`.padEnd(11);
    log(c.padEnd(8) + fmt(m.AWS) + fmt(m.Azure) + fmt(m.GCP));
  }
  log("");
})();
