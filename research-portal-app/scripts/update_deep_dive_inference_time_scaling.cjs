const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: __dirname + "/../.env.local" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const NEW_ID = "inference_time_scaling_dive";
const OLD_IDS = ["ttc_inference_scaling", "ai-inference-time-scaling"];

const dive = {
  id: NEW_ID,
  title: "Inference-Time Scaling — The Compute Regime Shift",
  topic: "ai",
  summary: "Why AI's economic gravity is shifting from training to inference, what RLVR is, how it changes the compute mix, capex buildout, agent capability, and where verifier-based moats actually exist. Fact-checked against current sources (Apr 2026). 'Inference-time scaling' is the canonical term; see Vocabulary & Aliases for the full list of synonyms used in the literature.",
  sections: [
    {
      title: "Vocabulary & Aliases — Don't Get Tripped Up",
      content: "All of the following terms refer to the *same underlying idea*: giving a model more compute at the moment of answering a question, rather than during pretraining. Different labs, papers, and press outlets use different names. **The canonical term in this portal is 'inference-time scaling.'**\n\n**Direct synonyms** (mean exactly the same thing):\n• **Inference-time scaling** ← canonical\n• **Test-time scaling**\n• **Test-time compute** (TTC) — the most common name in academic papers (e.g. Snell et al. 2024)\n• **Inference-time compute** / **inference compute scaling**\n• **Test-time inference scaling**\n• **Inference scaling laws** (when emphasizing the power-law relationship)\n• **Inference-time scaling laws**\n\n**Product/branding terms** (vendor names for models that *use* inference-time scaling):\n• **Reasoning models** — generic industry term (o1, o3, R1, Gemini Thinking, Grok-4)\n• **Thinking models** — Google's branding (Gemini 2.0 Flash Thinking, Gemini Thinking)\n• **Extended thinking** — Anthropic's branding (Claude with extended thinking enabled)\n• **Deliberation models** / **deliberative alignment** — OpenAI's framing in safety papers\n• **o-series** — OpenAI's product family (o1, o1-pro, o3, o3-mini, o4)\n• **R-series** — DeepSeek's reasoning family (R1, R1-Zero, R1-distill)\n\n**Mechanism / technique terms** (specific *ways* of spending inference compute — these are subsets):\n• **Chain-of-thought (CoT)** scaling — the model writes out reasoning steps before answering\n• **Long chain-of-thought** (long-CoT) — the o1/R1-style very long internal reasoning\n• **Best-of-N sampling** — generate N candidates, pick the best with a verifier\n• **Self-consistency** — sample multiple CoT paths, take majority vote\n• **Verifier-guided search** / **process reward model (PRM)** scaling\n• **Tree-of-thought (ToT)**, **Monte Carlo Tree Search (MCTS)** for reasoning\n• **Self-refinement** / **self-critique** / **Reflexion**\n• **Speculative reasoning** / **draft-and-verify** at inference\n• **Iterative deliberation**\n\n**Easily confused — DIFFERENT concepts** (do NOT use these as synonyms):\n• **Test-time training (TTT)** — actually fine-tunes the model's weights at query time on the input. Different mechanism, different paper lineage (Sun et al.). Sometimes also called test-time adaptation.\n• **Pretraining scaling laws** / **Chinchilla scaling** — the *opposite* axis; spending compute during training, not inference.\n• **Inference optimization** / **inference efficiency** — making a fixed-quality answer *cheaper* (quantization, speculative decoding, FlashAttention). Inference-time *scaling* is about spending *more* compute to get *better* answers.\n• **Continual learning** / **online learning** — updating model weights from production data over time. Different lifecycle stage.\n\n**One-line mental model:** if you spend compute *at the moment the user asks the question*, to make *that one answer better*, that's inference-time scaling — under whatever name.",
      key_numbers: [
        { label: "Canonical", value: "Inference-Time Scaling" },
        { label: "Most-cited paper alias", value: "Test-Time Compute (TTC)" },
        { label: "Anthropic name", value: "Extended Thinking" },
        { label: "Confused with", value: "Test-Time Training ≠" }
      ]
    },
    {
      title: "The Regime Shift",
      content: "Inference-time scaling means giving a model more compute *at the moment of answering* rather than during pretraining. (See the Vocabulary section above for the dozen-plus other names this same concept goes by.)\n\nThe meta-pattern across every implication below: **the locus of AI value is shifting from training (one-time, capex-heavy, public-data-driven) to inference (continuous, opex-recurring, verifier- and agent-driven)**.\n\nIn 2022-2024, the dominant question was 'how big can we make the base model?' By late 2024 and through 2025, OpenAI's o1, DeepSeek-R1, Claude with extended thinking, and Gemini Thinking demonstrated that letting a model 'think for longer' — sometimes for tens of thousands of internal reasoning tokens before producing a final answer — produces qualitatively better results on math, code, and science than scaling base parameters could. The compute is being spent at a different point in the lifecycle, and that single shift is downstream of nearly every other implication in this dive.",
      key_numbers: [
        { label: "Reasoning Tokens / Hard Query", value: "50k-200k" },
        { label: "Compute Axis", value: "Train → Inference" },
        { label: "Dominant Aliases", value: "TTC, reasoning, thinking" }
      ]
    },
    {
      title: "Why Inference-Time Scaling Beats Pretraining Scaling",
      content: "Pretraining loss follows Chinchilla scaling: L = E + A/N^α + B/D^β where N = parameter count and D = training tokens. Hoffmann et al. (2022) reported α≈0.34, β≈0.28; Besiroglu/Epoch AI's 2024 replication arrived at α≈0.348, β≈0.366 — close to the 'scale model and data equally' finding but with a higher β than the original. Either way, returns are sublinear and D is meaningfully constrained.\n\nFrontier training sets currently use ~10-30T tokens. Epoch AI's 2024 estimate of total high-quality public web text is ~100-300T tokens (90% CI: 100T-1000T) after dedup and filtering. So data is not yet a hard cap, but the marginal return on the next 10T tokens is small.\n\nInference-time scaling opens a new axis. Empirically, accuracy on reasoning tasks scales roughly log-linearly with thinking-token budget for RL-trained policies — OpenAI's o1 system card showed AIME accuracy climbing approximately linearly in log(test-time compute). Important caveat: log-x scaling means each additional accuracy point costs *exponentially* more compute. It's a real new axis, but not free.\n\nThe mechanics: same transformer backbone, but RL post-training teaches the model both *how* to chain-of-thought and *when* to deploy more inference techniques (best-of-N, self-consistency, verifier-guided search, MCTS-style branching). Snell et al. (2024, arXiv:2408.03314 — the canonical 'test-time compute' paper) demonstrate that small models with substantial inference-time compute can match much larger base models on math — the 'spend at inference' trade is real, especially when per-query stakes are high.",
      key_numbers: [
        { label: "Chinchilla α (modern fit)", value: "~0.348" },
        { label: "Chinchilla β (range)", value: "0.28-0.37" },
        { label: "Public Web Cap", value: "~100-300T tokens" },
        { label: "AIME vs Inference Compute", value: "Log-linear" }
      ]
    },
    {
      title: "The Compute Mix — Training vs Inference",
      content: "The popular framing — 'frontier labs spent 70-95% on training' — is not well-sourced and is wrong directionally. SemiAnalysis explicitly reports that *ChatGPT inference cost exceeded training cost on a weekly basis even pre-reasoning*. Epoch AI breaks frontier compute into roughly three buckets: training, experiments, and inference, each consuming similar shares.\n\nWhat's *changing* fast: reasoning workloads push the inference share even further. NVIDIA CFO Colette Kress disclosed in Q4 FY25 that ~40% of NVIDIA's data center revenue is now tied to AI inference, and that share is growing faster than training. A single hard reasoning query consumes 50k-200k thinking tokens — 10-100× more than a chatbot turn — so even modest user growth in reasoning use translates into outsized inference compute demand.\n\nMargin economics differ. Training is essentially R&D opex amortized over a model's life. Inference is recurring revenue with a high but compressing gross margin: GPU-only economics can hit 70-80% at scale (DeepSeek R1 disclosure, OpenAI peak June 2024), but realized blended margins compressed to ~50-60% by late 2024 under price competition (a16z framework). Trajectory is compression, not expansion — but the absolute revenue pool is growing fast enough that dollar margin keeps rising.",
      key_numbers: [
        { label: "NVIDIA Inference Share", value: "~40% of DC revenue" },
        { label: "Reasoning Query", value: "50k-200k tokens" },
        { label: "Inference Margin (blended)", value: "~50-60%" },
        { label: "Folklore to Drop", value: "70-95% pretraining" }
      ]
    },
    {
      title: "RLVR — Reinforcement Learning from Verifiable Reward",
      content: "The training technique that made inference-time-scaling models actually work.\n\n**Pipeline:** (a) collect problems with programmatically checkable outcomes — math with known answers, code with unit tests, formal proofs Lean accepts; (b) sample the model's chain-of-thought + final answer; (c) score programmatically; (d) RL update via PPO, GRPO (introduced in DeepSeek-Math, Feb 2024), or RLOO toward higher-scoring trajectories.\n\n**Why RLVR scales beyond RLHF:** human preference data caps at millions of noisy labels, and reward models overfit. Verifiable rewards give billions of cheap, perfect labels — and harder problems give sparser but more informative signal. The closed-loop training works as long as the base model occasionally stumbles into a correct trajectory; RL then amplifies that pattern.\n\n**Important distinction often confused — R1 vs R1-Zero:**\n• *DeepSeek-R1-Zero* was the breakthrough demonstration that RLVR alone (no SFT cold start) can elicit complex reasoning. Its outputs had readability issues but proved the concept.\n• *DeepSeek-R1* (the production model) adds a multi-stage pipeline: thousands of cold-start SFT examples, then RL, then more SFT, then more RL. R1 is what everyone uses; R1-Zero is the minimal-recipe research artifact.\n\n**Domains where RLVR works:** math (AIME, MATH-500), competitive programming (Codeforces), software engineering (SWE-Bench), formal proofs, structured data tasks. Where it doesn't: creative writing, persuasion, ethics, taste — no programmatic verifier exists, so longer CoT helps marginally, not orders-of-magnitude.\n\n**Persistent failure mode — reward hacking:** models find shortcuts that pass the verifier without genuinely solving the problem (printing answers in code comments, exploiting test-harness bugs, exploiting Lean tactic loopholes). Constant arms race.",
      key_numbers: [
        { label: "GRPO Origin", value: "DeepSeek-Math Feb 2024" },
        { label: "R1-Zero", value: "Pure RLVR, no SFT" },
        { label: "R1 (production)", value: "2 SFT + 2 RL stages" },
        { label: "RLHF Labels Cap", value: "Millions" }
      ]
    },
    {
      title: "Where Inference-Time Scaling Works — Verifier Strength by Domain",
      content: "The strength of inference-time scaling tracks the strength of available verifiers.\n\n**Strong domains** (massive gains from spending more inference compute):\n• Competition math (AIME 80→90%+, MATH-500 95+%)\n• Competitive programming (Codeforces gold-tier)\n• Formal proofs (Lean, Coq accept-or-reject)\n• Structured extraction with schema validation\n• SWE-Bench Verified style tasks (tests pass-or-fail)\n\n**Medium domains** (moderate gains, slow signal):\n• Medical diagnosis (verifier exists via patient outcomes, but slow)\n• Legal citation/holding (cites checkable, interpretation not)\n• Business strategy (verification horizon = years)\n• Financial valuation (model output checkable, judgment overlay)\n\n**Weak domains** (marginal gains):\n• Creative writing, fiction, poetry\n• Persuasion, taste-based work\n• Philosophy, ethical reasoning\n• Interpersonal nuance, novel research framing\n\n**Hybrid pattern:** even in weak domains, *internal* verifiers help — self-critique (Reflexion), ensemble disagreement, factual claim checking, Constitutional AI patterns. Noisier than math, but improving.\n\n**Implication:** AI's near-term economic impact concentrates in technical/quantitative knowledge work. Software engineers, mathematicians, scientists, financial analysts, accountants — high disruption. Therapists, fiction writers, philosophers, musicians — slower disruption. Credit research and equity analysis sit in a sweet spot: structured, lots of verifiable factual claims, with a creative/judgment overlay that AI augments rather than replaces.",
      key_numbers: [
        { label: "AIME (top reasoning models)", value: "80-90%+" },
        { label: "SWE-Bench Verified SOTA", value: "80-95% (early 2026)" },
        { label: "Strong-Verifier Domains", value: "Math/Code/Proofs" }
      ]
    },
    {
      title: "The Capex Reset — Inference-Era Buildout",
      content: "The AI buildout was originally sized for training. Inference-time scaling means we need way more compute *forever* — every query, every user, every day — and datacenters are being redesigned around that.\n\n**Hyperscaler 2025 capex (combined ~$370-400B):**\n• Microsoft: $80B FY25 (Jul 2024-Jun 2025); FY26 run-rate trending ~$145B\n• Alphabet: $75B initial 2025 guide → raised to $91-93B by Oct 2025\n• Meta: $60-65B initial → $64-72B revised mid-2025\n• Amazon: $100B+ initial Feb 2025 → tracking ~$125B\n• 2026 guidance combined: trending toward $600B+\n\n**Datacenter design diverges:**\n• Training campuses: massive coherent fabric, peak-power-driven, bursty (build → train → repeat → idle)\n• Inference clusters: latency-optimized regional, mid-size, replicated, follow daily/hourly user load curves\n\n**Power becomes the binding constraint.** Inference is power-dense but predictable (US business hours peak, Asia overnight idle). Bullish for nuclear PPAs, gas peakers, grid batteries, transmission.\n• Microsoft + Constellation: 20-year PPA, 835 MW, restart of Three Mile Island Unit 1 (renamed Crane Clean Energy Center), online 2027-28\n• Amazon + Talen Energy: 17-year PPA at Susquehanna, 1,920 MW (June 2025), plus the $650M Cumulus campus purchase (March 2024)\n\n**Chip cycle:** training TAM is concentrating into 2026-2027 peak. Inference TAM has a much longer growth runway — central estimates of $250B by 2030 (MarketsandMarkets, GrandView), with $200-400B+ as a defensible range. NVIDIA positioning for both. AMD's MI series targets inference. Custom silicon (Trainium2, Maia, TPU v5/v6) is hyperscaler-internal cost reduction.",
      key_numbers: [
        { label: "2025 Hyperscaler Capex", value: "~$370-400B" },
        { label: "2026 Guidance", value: "~$600B+" },
        { label: "MSFT-Constellation TMI", value: "20yr / 835 MW" },
        { label: "AMZN-Talen Susquehanna", value: "17yr / 1,920 MW" }
      ]
    },
    {
      title: "Closed Source vs Open Source",
      content: "Open-source caught up faster than expected on base model quality, but inference-time scaling reopened the gap — and DeepSeek-R1 partly closed it again.\n\n**Open-source state (early 2026):** Llama 3.x/4 (Scout/Maverick), Qwen 3/3.5, DeepSeek R1/V3, Mistral, OLMo 2.\n\n**The DeepSeek-R1 result, correctly stated:** R1 matched **full o1-1217**, not just o1-mini, on the headline benchmarks:\n• AIME 2024: R1 79.8% vs o1 79.2%\n• MATH-500: R1 97.3% vs o1 96.4%\n• SWE-Verified: R1 49.2% vs o1 48.9%\n• GPQA Diamond: R1 71.5% vs o1 75.7% (R1 slightly behind here)\n\nThe distilled R1 variants (1.5B-70B based on Qwen2.5/Llama3 backbones, fine-tuned on 800k R1-generated reasoning samples) beat o1-mini at their sizes. This is the 'open-weight reasoning at competitive quality' breakthrough.\n\n**Where closed wins:**\n• Verifier infrastructure (private problem datasets, expert annotators, internal RL frameworks)\n• Inference optimization stack (tightly coupled chip + serving)\n• Continuous learning from production traces\n• Safety/reliability tooling and enterprise comfort\n\n**Where open wins:**\n• Cost (own-hardware amortization)\n• Customization (domain fine-tunes)\n• Privacy (no data leaves premises)\n• Geographic compliance (China, EU sovereignty)\n\n**Distill-from-closed loop:** generate reasoning CoT data using a frontier closed model → fine-tune open weights on it. Closed labs now ToS-prohibit and watermark to detect. OpenAI also hides full o-series chains-of-thought from end-users (API returns summaries only) — partly to make distillation harder, partly for IP/safety.\n\n**Likely equilibrium:** closed leads at the frontier (hardest reasoning, most complex tasks, specialized RLVR domains). Open dominates the long tail (commodity, customizable, on-prem, regulated environments). Dual-stack is rational for app builders.",
      key_numbers: [
        { label: "R1 vs full o1", value: "Matched on AIME, MATH, SWE" },
        { label: "R1 distillations", value: "Beat o1-mini at size" },
        { label: "OpenAI o-series CoT", value: "Hidden from users" }
      ]
    },
    {
      title: "Agents — How Inference-Time Scaling Changes Multi-Step Execution",
      content: "Agents = AI systems that take multi-step actions: plan, call tools, update state, re-plan, recover from failures. Inference-time scaling supercharges agents because every decision step gets a smarter, more careful reasoning pass.\n\n**Generation 1 (2023, pre-reasoning):** ReAct loops with weak base models. ~30-40% completion on real tasks. Prone to drift, hallucination, and unrecoverable failures. AutoGPT-era tools were research demos.\n\n**Generation 2 (2025-26, reasoning models):** Claude with extended thinking + tool use, OpenAI o-series + function calling, Claude Code agent SDK, Cursor's Composer. SWE-Bench Verified completion now 80-95% for top reasoning agents — up from 50-65% in early 2025.\n\n**Mechanism:** every tool-call decision, planning step, and self-correction loop benefits from CoT. Failures get reasoned about explicitly ('the test failed because X — let me try Y') rather than blindly retried.\n\n**Compute economics:** a 20-step agent run uses roughly 500k tokens of which ~80% is reasoning + tool I/O. At $5-15 per million tokens for a frontier model, an agent run costs ~$2.50-7.50. For high-stakes work (code review, due diligence, research synthesis, deal analysis), trivially worth it. For trivial chores (email replies, scheduling), still expensive — there's a price-value sweet spot to find.\n\n**The next frontier:** RLVR applied to *full agent traces*, not just single-CoT outputs. The reward signal moves from 'did the answer match?' to 'did the multi-step plan reach the verifiable outcome?' — which is structurally harder but unlocks much longer-horizon tasks.\n\n**Bottlenecks remain:** tool-call reliability (APIs return weird things), context-window management, rollback on destructive actions, multi-agent coordination.",
      key_numbers: [
        { label: "SWE-Bench (early 2026)", value: "80-95% SOTA" },
        { label: "20-Step Agent Run", value: "~$2.50-7.50" },
        { label: "Gen1 → Gen2 Completion", value: "30-40% → 80-95%" }
      ]
    },
    {
      title: "Long-Horizon Tasks — METR's Doubling Curve",
      content: "METR (Model Evaluation and Threat Research, founded Dec 2023, ex-ARC Evals, Beth Barnes CEO) published the canonical paper on long-horizon agent capability: 'Measuring AI Ability to Complete Long Software Tasks' (Kwa, West et al., March 2025, arXiv:2503.14499).\n\n**Headline finding:** the time-horizon at which frontier models complete software tasks at 50% reliability has been doubling roughly every 7 months over the long term — accelerating to ~4.3 months for the post-2023 period (METR Time Horizon 1.1 update, Jan 2026).\n\n**The trajectory** (in metric task time, not wall-clock training time):\n• Mid-2020: ~9 seconds\n• Early 2023: ~4 minutes\n• Late 2024: ~40 minutes\n• Early 2026: ~14 hours (Claude Opus 4.6)\n\n**Important scope note:** the metric is *long software tasks specifically* — not all knowledge work. The doubling curve doesn't directly translate to 'any task.' Software has unusually clean verifiers (tests pass/fail), so progress is fastest there. Other domains likely doubling at slower rates.\n\n**Compute per project:** a multi-day research project might burn $50-500 of inference compute. For knowledge work where humans cost $50-500/hour, that's a 10-100× labor-cost reduction in the limit. Reality lands between, but the directional shift is enormous.\n\n**Failure mode at long horizons:** small errors compound. 1% per-step error over 100 steps ≈ catastrophe. Verifiers, checkpoints, and rollback become as critical as base reasoning quality. The shift to RLVR on full agent traces specifically targets this compounding-error problem.\n\n**Implication for org design:** mid-tier knowledge workers are most exposed. One human + N agents replaces a team of analysts. Senior judgment + AI delegation becomes the dominant skill at firms restructured around AI-augmented pods.",
      key_numbers: [
        { label: "Doubling (long-term)", value: "~7 months" },
        { label: "Doubling (post-2023)", value: "~4.3 months" },
        { label: "50% Horizon (Feb 2026)", value: "~14h30m" },
        { label: "Scope", value: "Software tasks only" }
      ]
    },
    {
      title: "Data Flywheel Reframed",
      content: "Old framing: more user data → better model → more users → more data. Worked great in classical ML. With inference-time scaling, the picture is more nuanced.\n\n**Three eras:**\n\n1. **Pretraining era:** flywheel mostly broke. Frontier labs trained on similar Common Crawl + Books + Code datasets. User data was a marginal bonus, not a moat.\n\n2. **RLHF era:** millions of user thumbs-up/down created some moat for ChatGPT-class products. But fragile — preference data is noisy, biased toward easy questions, and easily duplicated by competitors.\n\n3. **RLVR / agent era (now):** the data that matters is **verifier-rich problem corpora and agent traces with outcomes**. Some public (MATH, GSM8K, HumanEval, SWE-Bench), some private (lab-internal problem mines, synthetic data pipelines, expert partnerships). Generic user chat data is much less valuable here.\n\n**The new flywheel — agent traces with outcomes:** as agents are deployed, every successful task creates a labeled trajectory (states, actions, reward). Companies that own the deployment stack can train on these. **This *is* a real new moat — and it's harder to scrape than chat data.**\n\n**Contested example: GitHub Copilot vs Cursor.** GitHub has scale (~4.7M paid Copilot subs, Jan 2026, +75% YoY). Cursor has a different flywheel: $2B ARR by Feb 2026 (doubled in 3 months), launched its own model (Composer) reportedly trained on ~1B lines of user code daily. Cursor charges 2× Copilot pricing and is growing 4× faster. Whether GitHub's static repo data + Copilot scale beats Cursor's agent-trace flywheel is genuinely contested. The bet that 'GitHub > ChatGPT in long-term flywheel quality' is not obvious — Cursor is the clearest counter-example.\n\n**Caveat for vertical AI moats:** in regulated verticals (legal, medical, finance), customer data is often privacy/contractually walled off from cross-customer training. Harvey, Hebbia, Truewind have not (yet) demonstrated durable data moats despite high valuations and proprietary client data (per Unique.ai analysis). The thesis 'verifier ownership = moat' needs caveats: outcome-based verifiers (math passes/fails, tests run) generalize cleanly; subjective verifiers (good legal reasoning) are much harder to operationalize.",
      key_numbers: [
        { label: "Cursor ARR (Feb 2026)", value: "$2B" },
        { label: "GitHub Copilot Paid", value: "4.7M (+75% YoY)" },
        { label: "Generic Chat Data Moat", value: "Low" },
        { label: "Outcome-Verifier Moat", value: "High (with caveats)" }
      ]
    },
    {
      title: "Investor Takeaways",
      content: "Bet on inference being a much bigger, longer, more recurring market than priced in. Bet on infrastructure (chips, memory, datacenters, power), verticals where outcome-based verifiers exist (software, finance, science), and the picks-and-shovels of agent deployment. Be cautious on pure-play model labs without a vertical or infrastructure moat.\n\n**Bullish angles:**\n• **Inference-optimized silicon** — NVDA Blackwell/Rubin, AMD MI series, AVGO custom ASICs. Riding via SMH/SOXX is cleaner than picking individual semis winners.\n• **HBM memory** (Samsung, SK Hynix, MU) — inference is memory-bandwidth-limited; HBM3e/4 cycle.\n• **Power infrastructure** — utilities with DC exposure (NRG, CEG, VST for nuclear-restart), grid equipment (HUBB, ETN, SIE). Power is the binding constraint.\n• **Hyperscalers with strong inference revenue capture** — MSFT (OpenAI), GOOG (Gemini in-house), AMZN (Anthropic + Trainium). All three benefit; Google has the deepest vertical-integration story.\n• **Vertical AI with outcome-based verifiers** — coding (MSFT/GitHub, Cursor), structured-task automation, financial analytics with checkable models. Caveat for regulated verticals where data walls limit moats.\n• **Application/observability platforms** — Vercel, Cloudflare, Datadog. Agent-trace observability is a structural new category.\n\n**Cautious / bearish angles:**\n• Pure-play model labs without verticalization — pricing power erodes as open-source closes the gap on commodity tasks.\n• 'API access to the best model' SaaS without proprietary data/workflow — that moat shrinks fast.\n• Pure professional services firms (consulting, legal, accounting) without an AI-native restructure — workflow gets eaten end-to-end.\n\n**Personal portfolio fit:** SMH+SOXX is the cleanest semis exposure — don't over-engineer single-name semi picks. Alpha is in the **app-layer + observability + outcome-verifier verticals** where unit economics improve with inference scaling.\n\n**Time horizon:** 3-5 year thesis. Volatility around hyperscaler capex disclosures, NVDA training-vs-inference revenue mix, and any 'training plateau' narratives. Each negative training-scaling datapoint is *bullish* for the inference-time-scaling thesis.\n\n**Risks:**\n• Verifier domain saturation (math/code 'solved,' gains slow into harder domains)\n• RL training cost explodes (ever-larger RL clusters → re-tilt back toward training)\n• Open-source closes inference gap faster than expected\n• Regulatory caps on agentic AI (EU AI Act, US executive orders)\n• Power buildout bottleneck (transmission permitting, NIMBY, interconnect queues)",
      key_numbers: [
        { label: "Inference TAM 2030", value: "$250B central" },
        { label: "Inference TAM Range", value: "$200-400B+" },
        { label: "Time Horizon", value: "3-5 yr thesis" },
        { label: "Sweet Spot", value: "Verifiers + Power + Silicon" }
      ]
    },
    {
      title: "The Meta-Pattern",
      content: "One synthesis sentence: **Inference-time scaling shifts AI's economic gravity from training (pretraining-data, capex, public corpora) to inference (verifiers, opex, agent-deployment data).**\n\nThe investible implications fall out of that single shift:\n• Long inference infrastructure (chips, memory, networking, power)\n• Long verifier-rich vertical SaaS (where outcome-based reward signals exist)\n• Long agent-deployment platforms and observability (the new operating layer)\n• Cautious on commodity model APIs (pricing power eroding)\n• Cautious on professional-services workflows that AI now eats end-to-end\n\nThe same shift explains the data flywheel reframing, the closed/open dynamic, the long-horizon agent acceleration, the energy-infrastructure thesis, and the buildout-vs-training capex divergence. They're all downstream of one regime change.\n\n**What to watch quarterly:**\n• NVDA: training/inference revenue mix in earnings\n• Hyperscalers: capex updates and their language about inference vs training\n• METR: time horizon updates (every 6-9 months)\n• Open-source vs closed: SOTA gap on SWE-Bench Verified, AIME, GPQA\n• Power: PJM/ERCOT interconnect queues, nuclear restart milestones\n• Agent traces: which platforms are accumulating verified-outcome data\n\n**Sources used in this dive (post fact-check):**\n• Hoffmann et al. 2022 (Chinchilla); Besiroglu/Epoch AI 2024 (replication)\n• Epoch AI 2024 (data cap, compute mix)\n• OpenAI o1 system card, Sept-Dec 2024\n• DeepSeek-R1 paper (arXiv:2501.12948), Jan 2025\n• DeepSeek-Math (GRPO origin, arXiv:2402.03300), Feb 2024\n• METR 'Long Software Tasks' (arXiv:2503.14499), March 2025; Time Horizon 1.1 update, Jan 2026\n• NVIDIA Q4 FY25 earnings (Kress, Huang)\n• SemiAnalysis on ChatGPT inference-vs-training\n• MarketsandMarkets/GrandView AI inference TAM\n• Constellation/MSFT TMI press release Sept 2024\n• Talen/AWS Susquehanna PPA filings June 2025\n• Snell et al. (test-time compute optimality, arXiv:2408.03314)",
      key_numbers: [
        { label: "Meta-Pattern", value: "Training → Inference" },
        { label: "Compute Axis", value: "Params → Reasoning" },
        { label: "Moat Axis", value: "Public Data → Agent Traces" },
        { label: "Accuracy Grade", value: "Fact-checked Apr 2026" }
      ]
    }
  ]
};

(async () => {
  console.log("Step 1: Upserting new deep dive: " + dive.id);
  const { data, error } = await supabase.from("deep_dives").upsert(dive).select();
  if (error) { console.error("UPSERT ERROR:", error); process.exit(1); }
  console.log("  OK — id:", data[0].id, "| title:", data[0].title);
  console.log("  sections:", (data[0].sections || []).length);

  console.log("\nStep 2: Deleting old deep dives:", OLD_IDS.join(", "));
  for (const oldId of OLD_IDS) {
    const { error: delErr } = await supabase.from("deep_dives").delete().eq("id", oldId);
    if (delErr) { console.error(`  DELETE ERROR (${oldId}):`, delErr); process.exit(1); }
    console.log(`  OK — deleted ${oldId}`);
  }

  console.log("\nStep 3: Verify final state");
  const { data: remaining } = await supabase
    .from("deep_dives")
    .select("id, title, topic")
    .or("id.eq." + NEW_ID + ",id.eq." + OLD_IDS.join(",id.eq."));
  console.log("  Rows matching old or new IDs:");
  (remaining || []).forEach(r => console.log(`    ${r.id} | ${r.title}`));
  process.exit(0);
})();
