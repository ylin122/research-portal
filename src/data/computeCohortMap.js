// Maps raw cloud-provider SKUs to canonical GPU cohorts.
// Single source of truth used by both the cron extractor and the UI.
//
// Add a row when a new GPU cohort launches OR a new SKU appears in the cron's
// "unmapped SKUs" warning. Keep the cohort name short — it becomes the chart
// label.

// Each entry: { provider, pattern (RegExp), cohort, gpus_per_instance, gpu_memory_gb, notes }
// `pattern` is matched against the provider-native SKU identifier:
//   - AWS: instance_type (e.g., "p5.48xlarge")
//   - Azure: armSkuName (e.g., "Standard_ND96isr_H100_v5")
//   - GCP: SKU description (e.g., "Nvidia H100 80GB Gpu running in Americas")

export const COHORT_MAP = [
  // ─── AWS NVIDIA ────────────────────────────────────────
  { provider: "AWS", pattern: /^p4d\.24xlarge$/,        cohort: "A100-40GB", gpus: 8, mem: 40 },
  { provider: "AWS", pattern: /^p4de\.24xlarge$/,       cohort: "A100-80GB", gpus: 8, mem: 80 },
  { provider: "AWS", pattern: /^p5\.48xlarge$/,         cohort: "H100",      gpus: 8, mem: 80 },
  { provider: "AWS", pattern: /^p5\.4xlarge$/,          cohort: "H100",      gpus: 1, mem: 80 },
  { provider: "AWS", pattern: /^p5e\.48xlarge$/,        cohort: "H200",      gpus: 8, mem: 141 },
  { provider: "AWS", pattern: /^p5en\.48xlarge$/,       cohort: "H200",      gpus: 8, mem: 141 },
  { provider: "AWS", pattern: /^p6-b200\.48xlarge$/,    cohort: "B200",      gpus: 8, mem: 192 },
  { provider: "AWS", pattern: /^p6-b300\.48xlarge$/,    cohort: "B300",      gpus: 8, mem: 288 },
  { provider: "AWS", pattern: /^p6e-gb200\.36xlarge$/,  cohort: "GB200",     gpus: 4, mem: 192 },

  // ─── Azure NVIDIA ──────────────────────────────────────
  { provider: "Azure", pattern: /_A100_v4$/,            cohort: "A100-80GB", gpus: 8, mem: 80 },
  { provider: "Azure", pattern: /_H100_v5$/,            cohort: "H100",      gpus: 8, mem: 80 },
  { provider: "Azure", pattern: /_H200_v5$/,            cohort: "H200",      gpus: 8, mem: 141 },
  { provider: "Azure", pattern: /_B200_v6$/,            cohort: "B200",      gpus: 8, mem: 192 },
  { provider: "Azure", pattern: /_GB200_v6$/,           cohort: "GB200",     gpus: 4, mem: 192 }, // ND128isr_NDR_GB200_v6
  // Older A100 40GB variant (Standard_ND96asr_v4)
  { provider: "Azure", pattern: /^Standard_ND96asr_v4$/, cohort: "A100-40GB", gpus: 8, mem: 40 },

  // ─── GCP NVIDIA ────────────────────────────────────────
  // GCP uses descriptive SKU names. Order matters — most specific first.
  { provider: "GCP", pattern: /\bH200\b/i,              cohort: "H200",      gpus: 1, mem: 141 },
  { provider: "GCP", pattern: /\bH100\s*80GB/i,         cohort: "H100",      gpus: 1, mem: 80 },
  { provider: "GCP", pattern: /\bA100\s*80GB/i,         cohort: "A100-80GB", gpus: 1, mem: 80 },
  { provider: "GCP", pattern: /\bA100\b/i,              cohort: "A100-40GB", gpus: 1, mem: 40 },
  { provider: "GCP", pattern: /\bB200\b/i,              cohort: "B200",      gpus: 1, mem: 192 },
  { provider: "GCP", pattern: /\bGB200\b/i,             cohort: "GB200",     gpus: 1, mem: 192 },
];

export function classifySku(provider, sku) {
  for (const m of COHORT_MAP) {
    if (m.provider === provider && m.pattern.test(sku)) return m;
  }
  return null;
}

// Display order in UI tables. Newest/most-expensive first.
export const COHORT_ORDER = ["GB200", "B300", "B200", "H200", "H100", "A100-80GB", "A100-40GB"];
