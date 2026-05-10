#!/usr/bin/env node
// Trial: hit free public pricing APIs and report what we can extract for H100.
// Goal: validate that auto-pull is feasible before building the full pipeline.
// No DB writes. Throwaway.
//
// Run: node scripts/trial-pricing-apis.mjs

const log = (...a) => console.log(...a);
const hr = () => log("─".repeat(72));

// ─────────────────────────────────────────────────────────────────────────
// 1) AWS — try multiple free public sources.
//    a) AWS public pricing JSON (awsstatic) — undocumented, used by pricing site
//    b) Vantage's community mirror — well-maintained, smaller
//    c) AWS Bulk API HEAD — confirm bulk path works (full file is ~1.5GB)
// ─────────────────────────────────────────────────────────────────────────
async function trialAWS() {
  hr();
  log("AWS — trying multiple free sources");
  hr();

  // (a) awsstatic — undocumented but used by AWS pricing webpage
  log("  (a) awsstatic on-demand JSON");
  const u1 = "https://a0.p.awsstatic.com/pricing/1.0/ec2/region/us-east-1/ondemand/linux/index.json";
  try {
    const t0 = Date.now();
    const r = await fetch(u1);
    log(`    ${r.ok ? "✓" : "✗"} HTTP ${r.status} (${(Date.now()-t0)/1000}s)`);
    if (r.ok) {
      const j = await r.json();
      const arr = j.prices || [];
      log(`    ${arr.length} rows; sample keys: ${Object.keys(arr[0] || {}).join(", ")}`);
    }
  } catch (e) { log(`    ✗ ${e.message}`); }

  // (b) Vantage mirror — community-maintained, ~5-10MB JSON of all EC2 pricing
  log("  (b) Vantage instances.json mirror");
  const u2 = "https://instances.vantage.sh/instances.json";
  try {
    const t0 = Date.now();
    const r = await fetch(u2);
    log(`    ${r.ok ? "✓" : "✗"} HTTP ${r.status} (${(Date.now()-t0)/1000}s)`);
    if (r.ok) {
      const j = await r.json();
      log(`    ${j.length} instance types`);
      // Find H100 (p5 family)
      const p5 = j.filter(i => /^p5/i.test(i.instance_type || ""));
      log(`    p5* (H100) instances: ${p5.length}`);
      p5.slice(0, 6).forEach(i => {
        const od = i.pricing?.["us-east-1"]?.linux?.ondemand;
        log(`      ${(i.instance_type || "?").padEnd(20)} $${od ?? "?"}/hr  GPU=${i.GPU || "?"}  GPU_model=${i.GPU_model || "?"}`);
      });
      // What other GPU families exist?
      const gpuFams = [...new Set(j.filter(i => i.GPU > 0).map(i => i.instance_type?.split(".")[0]))].sort();
      log(`    All GPU families: ${gpuFams.join(", ")}`);
    }
  } catch (e) { log(`    ✗ ${e.message}`); }

  // (c) AWS bulk pricing index (just HEAD to confirm it exists)
  log("  (c) AWS Bulk pricing index HEAD");
  const u3 = "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json";
  try {
    const t0 = Date.now();
    const r = await fetch(u3);
    log(`    ${r.ok ? "✓" : "✗"} HTTP ${r.status} (${(Date.now()-t0)/1000}s)`);
    if (r.ok) {
      const j = await r.json();
      const regions = Object.keys(j.regions || {});
      log(`    ${regions.length} regions; us-east-1 file URL:`);
      log(`    https://pricing.us-east-1.amazonaws.com${j.regions["us-east-1"]?.currentVersionUrl}`);
      log(`    (full us-east-1 EC2 file is ~1.5GB — production should use AWS SDK + StreamingBodyParser, or Vantage above)`);
    }
  } catch (e) { log(`    ✗ ${e.message}`); }
}

// ─────────────────────────────────────────────────────────────────────────
// 2) Azure — Retail Prices API. Free, no auth, OData filter.
// ─────────────────────────────────────────────────────────────────────────
async function trialAzure() {
  hr();
  log("Azure — Retail Prices API");
  hr();
  // Filter: Virtual Machines service, ND-series (H100/H200/A100), eastus, consumption
  const filter = `serviceName eq 'Virtual Machines' and armRegionName eq 'eastus' and contains(armSkuName, 'ND') and priceType eq 'Consumption'`;
  const url = `https://prices.azure.com/api/retail/prices?$filter=${encodeURIComponent(filter)}`;
  const t0 = Date.now();
  try {
    const r = await fetch(url);
    if (!r.ok) { log(`  ✗ HTTP ${r.status}`); return; }
    const j = await r.json();
    log(`  ✓ ${(Date.now()-t0)/1000}s, ${j.Items?.length ?? "?"} rows in first page (paginated, NextPageLink: ${j.NextPageLink ? "yes" : "no"})`);
    // Look for H100 specifically
    const h100 = (j.Items || []).filter(p => /H100/i.test(p.armSkuName || p.skuName || ""));
    log(`  H100 SKUs in page 1: ${h100.length}`);
    h100.slice(0, 6).forEach(p => {
      log(`    ${p.armSkuName?.padEnd(40) || p.skuName} $${p.unitPrice}/${p.unitOfMeasure} (${p.skuName})`);
    });
    // Distinct SKU names
    const distinctSkus = [...new Set((j.Items || []).map(p => p.armSkuName).filter(Boolean))];
    log(`  Distinct armSkuName values seen: ${distinctSkus.length}`);
    distinctSkus.slice(0, 8).forEach(s => log(`    ${s}`));
  } catch (e) {
    log(`  ✗ ${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 3) GCP — Cloud Billing Catalog. Needs API key. Note only.
// ─────────────────────────────────────────────────────────────────────────
async function trialGCP() {
  hr();
  log("GCP — Cloud Billing Catalog API");
  hr();
  if (!process.env.GCP_API_KEY) {
    log("  ⚠ GCP_API_KEY not set. Skipping. To enable:");
    log("    1. https://console.cloud.google.com/apis/library/cloudbilling.googleapis.com");
    log("    2. Create API key, restrict to Cloud Billing API");
    log("    3. export GCP_API_KEY=…  (free tier: 6 RPS, 1k QPD)");
    return;
  }
  // Compute Engine service ID is "6F81-5844-456A"
  const url = `https://cloudbilling.googleapis.com/v1/services/6F81-5844-456A/skus?key=${process.env.GCP_API_KEY}&pageSize=500`;
  const t0 = Date.now();
  try {
    const r = await fetch(url);
    if (!r.ok) { log(`  ✗ HTTP ${r.status}`); return; }
    const j = await r.json();
    log(`  ✓ ${(Date.now()-t0)/1000}s, ${j.skus?.length ?? "?"} rows in first page`);
    const h100 = (j.skus || []).filter(s => /H100/i.test(s.description || ""));
    log(`  H100 SKUs: ${h100.length}`);
    h100.slice(0, 6).forEach(s => {
      const p = s.pricingInfo?.[0]?.pricingExpression?.tieredRates?.[0]?.unitPrice;
      const usd = p ? Number(p.units || 0) + Number(p.nanos || 0) / 1e9 : "?";
      log(`    ${s.description.padEnd(60)} $${usd}/hr`);
    });
  } catch (e) {
    log(`  ✗ ${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 4) ArtificialAnalysis — token-based inference pricing.
//    Public read endpoints; some require X-API-Key for full data.
// ─────────────────────────────────────────────────────────────────────────
async function trialArtificialAnalysis() {
  hr();
  log("ArtificialAnalysis — LLM token pricing");
  hr();
  // Public endpoint used by their website
  const url = "https://artificialanalysis.ai/api/v2/data/llms/models";
  const t0 = Date.now();
  try {
    const r = await fetch(url, { headers: { "User-Agent": "research-portal-trial/0.1" } });
    if (!r.ok) { log(`  ✗ HTTP ${r.status} (may need API key — see https://artificialanalysis.ai/documentation)`); return; }
    const j = await r.json();
    const models = j.data || j.models || j;
    const arr = Array.isArray(models) ? models : [];
    log(`  ✓ ${(Date.now()-t0)/1000}s, ${arr.length} models`);
    // Sample a few with price info
    arr.slice(0, 5).forEach(m => {
      log(`    ${(m.name || m.model_name || "?").padEnd(40)} in: $${m.pricing?.input_per_million ?? "?"}/MTok  out: $${m.pricing?.output_per_million ?? "?"}/MTok`);
    });
    if (arr.length === 0) {
      log(`  (response shape unexpected — keys: ${Object.keys(j).slice(0,8).join(", ")})`);
    }
  } catch (e) {
    log(`  ✗ ${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
(async () => {
  log(`\nCompute pricing API trial — ${new Date().toISOString()}\n`);
  await trialAWS();
  await trialAzure();
  await trialGCP();
  await trialArtificialAnalysis();
  hr();
  log("Done.\n");
})();
