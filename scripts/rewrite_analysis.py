"""Rewrite article analyses with detailed key takeaways, investment implications, and open questions."""
import os
import sys
import io
import httpx
from dotenv import load_dotenv
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SCRIPT_DIR = Path(__file__).parent
load_dotenv(SCRIPT_DIR.parent / ".env")
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

ANALYSES = {
    "gmail_19d6ac41e7d5a3ce": {
        "summary": "Damnang\u2019s deep-dive argues TSMC is the singular bottleneck constraining AI compute scaling. Advanced node capacity (N3, N2) is fully allocated through 2027+. Every major AI chip \u2014 NVIDIA Blackwell/Vera Rubin, AMD MI400, Broadcom custom ASICs, Google TPUs, Amazon Trainium \u2014 depends on TSMC. Samsung and Intel Foundry remain 1-2 nodes behind and cannot absorb overflow. CoWoS advanced packaging adds a second critical bottleneck for HBM integration, limiting how fast memory bandwidth can scale even if DRAM supply is available.",
        "key_takeaways": [
            "TSMC advanced node capacity (N3/N2) is the binding constraint on AI compute scaling \u2014 not GPU design, not HBM supply, not power. The bottleneck is fab capacity.",
            "CoWoS advanced packaging is the second bottleneck \u2014 even with sufficient HBM supply, integration capacity limits how many AI chips can ship per quarter.",
            "Samsung Foundry and Intel Foundry are not viable alternatives at leading edge through at least 2027. Yield gaps remain 12-18 months behind TSMC.",
            "TSMC pricing power is structurally increasing \u2014 N2 wafers expected at 25-30% premium over N3. Customers have no alternative and are pre-paying for allocation.",
            "Every major AI chip customer (NVIDIA, AMD, Broadcom, Google, Amazon, Apple, Qualcomm) is competing for the same limited TSMC capacity. Allocation politics are intensifying.",
            "TSMC capex is rising but new fabs take 2-3 years to reach volume production. Arizona fab delays compound the problem.",
            "Custom ASIC proliferation (Google, Amazon, Meta, Microsoft, OpenAI) is adding more demand to TSMC\u2019s already maxed-out advanced nodes."
        ],
        "investment_implications": "Strongest bull case for TSM as a core portfolio holding \u2014 monopoly-like position with rising pricing power and multi-year revenue visibility. TSMC bottleneck is also indirectly bullish for MU and SK Hynix because HBM packaging capacity (CoWoS) limits total addressable chip volume, keeping memory allocation tight. Bearish signal for any AI chip company that cannot secure sufficient TSMC allocation \u2014 execution risk for smaller ASIC startups. ASML benefits as the sole EUV supplier enabling TSMC\u2019s node transitions.",
        "themes": ["TSMC", "Semiconductor Bottleneck", "CoWoS Packaging", "HBM", "AI Compute Scaling", "Foundry Economics", "Advanced Packaging"],
        "questions": [
            "How much of TSMC\u2019s 2027 N2 capacity is already contractually committed to hyperscalers vs. available for new customers?",
            "Can TSMC expand CoWoS advanced packaging capacity fast enough to support HBM4 integration for NVIDIA Vera Rubin in volume?",
            "What happens to AI chip startups (Cerebras, Groq, custom ASIC ventures) who cannot secure TSMC allocation \u2014 do they die or go to Samsung?",
            "Does the TSMC bottleneck create a structural opening for Samsung\u2019s HBM packaging business even if their logic foundry lags?",
            "How does TSMC\u2019s Arizona fab timeline (delayed to 2026-2027) affect US-based AI chip supply chains?",
            "At what point does TSMC\u2019s pricing power trigger customer pushback or accelerate Intel Foundry investment?"
        ],
    },
    "gmail_19d6118cdd2af576": {
        "summary": "Google DeepMind paper introducing the first systematic framework for adversarial attacks against autonomous AI agents navigating the web. As agents become key economic actors in a \u201cVirtual Agent Economy,\u201d they face a fundamentally new attack surface: the information environment itself. The paper identifies 6 categories of attack, maps critical gaps in current defenses, and proposes a research agenda for securing the agent ecosystem. This is not specific to any one model \u2014 it applies to the entire emerging agent landscape.",
        "key_takeaways": [
            "AI agents face a fundamentally new attack surface that traditional cybersecurity doesn\u2019t address \u2014 the information environment itself can be weaponized against them.",
            "6 attack categories identified: (1) Content Injection \u2014 exploiting gaps between human perception and machine parsing; (2) Semantic Manipulation \u2014 corrupting reasoning and verification; (3) Cognitive State \u2014 poisoning memory and learned behaviors; (4) Behavioral Control \u2014 hijacking agent capabilities for unauthorized actions like data exfiltration; (5) Systemic \u2014 cascading failure across multi-agent systems; (6) Human-in-the-Loop \u2014 exploiting cognitive biases of human overseers.",
            "Current agent defenses are fundamentally inadequate. Most agents have no adversarial robustness testing. The attack surface grows as agents gain more autonomy and tool access.",
            "Multi-agent systems create systemic risk \u2014 one compromised agent can propagate malicious behavior across an entire ecosystem of interacting agents.",
            "Human oversight is itself an attack vector. Adversaries can design traps that exploit cognitive biases (anchoring, authority bias, information overload) to manipulate the human overseer into approving malicious actions.",
            "The threat landscape includes commercial actors (surreptitious product endorsements), criminal actors (data exfiltration), and state-level actors (misinformation at scale).",
            "DeepMind proposes that securing agents requires both model-level defenses AND environment-level defenses \u2014 a fundamentally harder problem than traditional application security."
        ],
        "investment_implications": "The rapid deployment of AI agents is creating a massive new attack surface that current cybersecurity products don\u2019t address. This implies: (1) Expanding TAM for cybersecurity companies like CrowdStrike (CRWD) and Palo Alto Networks (PANW) as they build agent-security products; (2) A potential new product category \u2014 \u201cagent firewalls\u201d or \u201cagent SIEM\u201d \u2014 that could be a startup opportunity; (3) Risk factor for companies deploying agents without sufficient safety measures (liability exposure); (4) Bullish for companies building agent observability and governance tooling.",
        "themes": ["AI Safety", "Agent Security", "Adversarial ML", "Web Security", "Multi-Agent Systems", "Virtual Agent Economy", "Cybersecurity TAM"],
        "questions": [
            "Which cybersecurity companies are actively building agent-specific defense products? Is CrowdStrike or Palo Alto further ahead?",
            "How will enterprises evaluate agent safety before deployment \u2014 will there be an \u201cagent security certification\u201d standard?",
            "Does this paper\u2019s framework create a new product category \u2014 agent firewall, agent SIEM, agent governance platform?",
            "What regulatory frameworks will emerge around autonomous agent liability \u2014 who is liable when an agent is tricked into exfiltrating data?",
            "How does this affect the economics of agent deployment \u2014 does security overhead reduce the ROI of automation?",
            "Are there startups already building in this space that could be acquisition targets for CRWD/PANW?"
        ],
    },
    "19d5afc2bc8e6b65": {
        "summary": "Leopold Aschenbrenner\u2019s foundational 165-page essay arguing that AGI is strikingly plausible by 2027 based on extrapolating existing compute scaling trends. The core argument: GPT-2 to GPT-4 was preschooler to smart high-schooler in 4 years; another equivalent ~100,000x effective compute scaleup is expected by 2027, which would produce AGI-level systems. Three levers drive this: compute scaling ($100B+ clusters), algorithmic efficiency gains, and \u201cunhobbling\u201d (transforming chatbots into autonomous agents). If AI can automate AI research itself, this triggers an intelligence explosion \u2014 compressing a decade of progress into roughly one year. The national security implications are severe.",
        "key_takeaways": [
            "GPT-2 to GPT-4 represented a preschooler-to-smart-high-schooler qualitative jump in 4 years. Another equivalent jump \u2014 enabled by ~100,000x more effective compute \u2014 lands at AGI-level capability by ~2027.",
            "Three levers each contribute ~0.5 orders of magnitude per year: (1) compute scaling \u2014 $100B+ training clusters are plausible; (2) algorithmic efficiency \u2014 inference costs dropping ~1,000x every 2 years; (3) unhobbling \u2014 RLHF, chain-of-thought, scaffolding, tool use, long context.",
            "Current models are STILL incredibly hobbled: no long-term memory, can\u2019t use computers well, don\u2019t think before speaking, can\u2019t do week-long projects, aren\u2019t personalized. Fixing these alone = massive capability jump.",
            "Intelligence explosion scenario: Once AI can do the work of an AI researcher, it can improve itself. This compresses a decade of algorithmic progress into ~1 year. The feedback loop is the key risk/opportunity.",
            "$100B+ training clusters are not science fiction \u2014 they\u2019re rumored at Microsoft/OpenAI. Training compute has grown at 0.5 OOMs/year for 15 consecutive years.",
            "National security framing: AGI is being developed with startup-level security at companies that could be infiltrated by foreign intelligence services. The geopolitical stakes are existential.",
            "Test-time compute is a massive overhang \u2014 letting models \u201cthink\u201d for hours or days instead of seconds could unlock another order of magnitude of effective capability."
        ],
        "investment_implications": "This is the foundational thesis document for the AI capex supercycle. If even partially correct, it justifies: (1) Maximum conviction on compute infrastructure \u2014 NVDA, TSM, MU are the picks-and-shovels plays; (2) Long-duration exposure to semiconductor ETFs (SMH, SOXX, DRAM) because the buildout is multi-year; (3) Hyperscaler capex guidance ($75-135B/year each) is rational, not irrational; (4) Memory (HBM) demand is structurally undersupplied if training clusters scale to $100B+; (5) The intelligence explosion scenario, if it materializes, means current AI company valuations are either massively too high (disruption risk) or massively too low (winner-take-all dynamics).",
        "themes": ["AGI Timeline", "Compute Scaling", "AI Infrastructure", "National Security", "Intelligence Explosion", "Unhobbling", "Test-Time Compute", "Orders of Magnitude"],
        "questions": [
            "Are we seeing evidence of scaling law plateau in the latest frontier models (GPT-5, Claude 4, Gemini 3)? Or are the curves still holding?",
            "How does test-time compute (chain-of-thought, extended thinking) change the economics for neocloud providers \u2014 does inference demand explode?",
            "What is the realistic power grid capacity to support trillion-dollar training clusters by 2028? Is power the actual binding constraint?",
            "Is the 2027 AGI timeline still on track given current model capabilities, or has it slipped to 2028-2029?",
            "If intelligence explosion occurs, which companies are positioned to capture the value vs. which get disrupted?",
            "How should portfolio construction change if you assign >30% probability to AGI by 2028?"
        ],
    },
    "19d5adcfaee0d36a": {
        "summary": "SemiAnalysis reports that H100 1-year GPU rental contract prices have surged ~40% from $1.70/hr/GPU (Oct 2025) to $2.35/hr/GPU (Mar 2026). The key demand drivers: Anthropic\u2019s ARR nearly tripled in a single quarter from $9B to $25B+ (Claude Code identified as the inflection point), open-source model demand surged (GLM, Kimi K2.5), and capital raises by AI labs created new GPU demand. On-demand GPU capacity is completely sold out across all GPU types. Supply chain tightness extends beyond GPUs to DRAM, NAND, fiber optics, datacenter colocation, and gas turbines. SemiAnalysis is launching a GPU Rental Price Index to track this market in real time.",
        "key_takeaways": [
            "H100 1-year rental prices up ~40% in 5 months ($1.70 \u2192 $2.35/hr/GPU). On-demand capacity is completely sold out across ALL GPU types \u2014 no availability at any price.",
            "Anthropic\u2019s ARR tripled from $9B to $25B+ in a single quarter. Claude Code identified by SemiAnalysis as the inflection point that triggered the demand spike.",
            "Open-source models (GLM, Kimi K2.5) are a NEW source of GPU demand beyond frontier labs \u2014 this was not in prior supply/demand models.",
            "Supply chain tightness is broad-based: not just GPUs, but DRAM, NAND memory, fiber optic cables, datacenter colocation, and gas turbines are all in shortage.",
            "GPU rental pricing is becoming a real-time market signal for AI demand \u2014 analogous to oil futures for the energy market. SemiAnalysis launching a formal price index.",
            "Trying to rent GPU clusters in early 2026 is \u201clike trying to buy drugs\u201d (a16z quote) \u2014 high prices and almost zero availability.",
            "The demand spike is structural, not cyclical: Claude Code\u2019s success means coding/agent workloads are a permanent new demand category for GPU compute.",
            "Neocloud and hyperscaler customers who locked in capacity are not releasing it back despite price hikes \u2014 indicating they expect continued tightness."
        ],
        "investment_implications": "This is the strongest real-time confirmation of the GPU shortage thesis. Direct implications: (1) Neocloud positions validated \u2014 CoreWeave (CRWV), Nebius (NBIS) have pricing power and sold-out capacity; (2) Memory tightness validates MU and SK Hynix \u2014 DRAM/NAND shortage is part of the same supply chain crunch; (3) Optical networking (LITE, COHR) in shortage confirms AI infrastructure buildout is hitting physical supply constraints; (4) GPU rental price index could become a leading indicator for semiconductor earnings; (5) The breadth of supply chain tightness (memory + fiber + colo + power) suggests we are still in the early innings of the AI infrastructure buildout, not approaching a peak.",
        "themes": ["GPU Compute", "AI Infrastructure", "Neoclouds", "Supply Shortage", "Claude Code", "Memory Pricing", "GPU Rental Market", "Supply Chain"],
        "questions": [
            "Will the GB200/GB300 cluster ramp in H2 2026 relieve the GPU shortage, or will demand continue to outpace new capacity additions?",
            "How far can GPU rental prices rise before demand becomes price-elastic? Is there a ceiling, or is AI compute demand truly inelastic at current price levels?",
            "Are neocloud public equities (CRWV, NBIS, IREN) still mispriced relative to the GPU rental pricing reality, or has the market caught up?",
            "What happens to H100 rental pricing specifically when large AI lab GB300 megaclusters come online \u2014 does H100 pricing collapse or remain elevated for inference workloads?",
            "How does the GPU shortage affect AI startup formation \u2014 does compute scarcity become a moat for well-funded labs?",
            "Is the fiber optic / optical networking shortage a bigger bottleneck than people realize? What\u2019s the lead time on new capacity?"
        ],
    },
    "19d5ae6dfa7e842d": {
        "summary": "Foundation Capital (Jaya Gupta, Ashu Garg) argues that the AI agent revolution doesn\u2019t kill systems of record (Salesforce, Workday, SAP) \u2014 it raises the bar for what a good system of record looks like. The key insight: agents need more than just data access and governance rules. They need \u201ccontext graphs\u201d \u2014 a living record of decision traces that capture how rules were actually applied: exceptions, overrides, precedents, approvals, and cross-system context. This implicit knowledge currently lives in Slack threads, deal desk conversations, escalation calls, and people\u2019s heads. Agents that sit in the execution path can capture these traces and build the context graph as a new canonical layer between agents and systems of record.",
        "key_takeaways": [
            "Agents separate the UX of work from the data plane. Agents become the interface, but systems of record remain canonical underneath. The \u201cagents kill everything\u201d narrative is wrong.",
            "The missing layer is \u201ccontext graphs\u201d \u2014 decision traces that capture not just WHAT happened, but WHY: exceptions, overrides, precedents, approvals, policy versions applied.",
            "This implicit decision knowledge currently lives nowhere in enterprise systems \u2014 it\u2019s in Slack threads, deal desk conversations, escalation calls, and people\u2019s heads. It\u2019s the real operating system of enterprises.",
            "Distinction between RULES (what should happen in general) and DECISION TRACES (what happened in this specific case, under which policy version, with which exception, approved by whom).",
            "\u201cSystems of agents\u201d startups have a structural advantage because they sit in the execution path and can capture decision traces as they happen \u2014 incumbents would need to retrofit this.",
            "Context graphs become the real source of truth for AI autonomy \u2014 because they provide the precedent-based reasoning that allows agents to handle edge cases without human intervention.",
            "First movers will likely be vertical-specific: legal (case precedent), healthcare (treatment decisions), financial services (credit decisions, compliance exceptions)."
        ],
        "investment_implications": "This thesis has several implications: (1) Enterprise SoR incumbents (CRM, WDAY, SAP) are more durable than the \u201cagents kill everything\u201d narrative implies \u2014 they own canonical data that agents need; (2) BUT the real opportunity is the new context graph layer, which is a genuinely new software category, not an extension of existing vendors; (3) ServiceNow (NOW) and Palantir (PLTR) may be early movers in this space given their workflow/decision-making positioning; (4) Watch for startups building \u201csystem of record for decisions\u201d \u2014 this could be the next Salesforce-scale opportunity; (5) Companies with deep vertical expertise in regulated industries (legal, healthcare, financial services) have structural advantage in building context graphs.",
        "themes": ["AI Agents", "Enterprise Software", "Systems of Record", "Context Graphs", "Decision Traces", "Platform Shift", "VC Thesis", "Vertical SaaS"],
        "questions": [
            "Which startups are already building context graph / decision trace infrastructure? Has anyone raised Series A+ for this?",
            "Can incumbents (Salesforce, ServiceNow, Palantir) add this layer fast enough, or is it structurally different enough to require a new company?",
            "How does context graphs relate to the existing knowledge graph / RAG / vector database ecosystem? Is it complementary or competitive?",
            "What is the go-to-market for a \u201csystem of record for decisions\u201d \u2014 who is the buyer (CIO, COO, GC)?",
            "In which vertical will the first breakout context graph company emerge \u2014 legal (case law precedent), healthcare (treatment protocols), or financial services (credit/compliance)?",
            "How does this framework change the M&A landscape \u2014 will Salesforce/Microsoft acquire context graph startups?"
        ],
    },
}

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

for aid, data in ANALYSES.items():
    r = httpx.patch(
        f"{url}/rest/v1/kb_articles?id=eq.{aid}",
        headers=headers,
        json=data,
        timeout=30,
    )
    if r.status_code in (200, 204):
        print(f"  Updated: {aid}")
    else:
        print(f"  FAILED {aid}: {r.status_code} {r.text[:200]}")

print("\nDone.")
