// Neocloud GPU pricing — manually curated from public pricing pages.
// Updated when prices change (typically quarterly). Last verified: 2026-05-10.
//
// Used by api/cron-compute-pricing.mjs to write a weekly snapshot row per
// (provider, cohort) into compute_prices, so the time series stays consistent
// with hyperscaler data even though there's no live API.
//
// To update: visit each provider's pricing page, refresh the values, and
// bump LAST_VERIFIED. The next cron run picks them up.

export const NEOCLOUD_LAST_VERIFIED = "2026-05-10";

export const NEOCLOUD_PRICES = [
  // ─── CoreWeave (us regions) — https://coreweave.com/pricing ───
  { provider: "CoreWeave", cohort: "A100-80GB", sku: "A100 80GB · 8-GPU node", gpus: 8, hourly_per_gpu_usd: 2.70 },
  { provider: "CoreWeave", cohort: "H100",      sku: "H100 · 8-GPU node",      gpus: 8, hourly_per_gpu_usd: 6.16 },
  { provider: "CoreWeave", cohort: "H200",      sku: "H200 · 8-GPU node",      gpus: 8, hourly_per_gpu_usd: 6.31 },
  { provider: "CoreWeave", cohort: "B200",      sku: "B200 · 8-GPU node",      gpus: 8, hourly_per_gpu_usd: 8.60 },
  { provider: "CoreWeave", cohort: "GB200",     sku: "GB200 NVL72 · 4-GPU",    gpus: 4, hourly_per_gpu_usd: 10.50 },

  // ─── Lambda Labs (us regions) — https://lambda.ai/service/gpu-cloud ───
  { provider: "Lambda",    cohort: "A100-80GB", sku: "A100 80GB · 8x SXM",     gpus: 8, hourly_per_gpu_usd: 2.79 },
  { provider: "Lambda",    cohort: "A100-40GB", sku: "A100 40GB · 8x SXM",     gpus: 8, hourly_per_gpu_usd: 1.99 },
  { provider: "Lambda",    cohort: "H100",      sku: "H100 · 8x SXM",          gpus: 8, hourly_per_gpu_usd: 3.99 },
  { provider: "Lambda",    cohort: "B200",      sku: "B200 · 8x SXM6",         gpus: 8, hourly_per_gpu_usd: 6.69 },

  // ─── Crusoe (us regions) — https://crusoe.ai/cloud/pricing ───
  { provider: "Crusoe",    cohort: "A100-80GB", sku: "A100 80GB · SXM",        gpus: 1, hourly_per_gpu_usd: 1.95 },
  { provider: "Crusoe",    cohort: "A100-40GB", sku: "A100 40GB · PCIe",       gpus: 1, hourly_per_gpu_usd: 1.45 },
  { provider: "Crusoe",    cohort: "H100",      sku: "H100 80GB · HGX",        gpus: 1, hourly_per_gpu_usd: 3.90 },
  { provider: "Crusoe",    cohort: "H200",      sku: "H200 141GB · HGX",       gpus: 1, hourly_per_gpu_usd: 4.29 },
];
