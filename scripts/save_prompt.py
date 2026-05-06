import httpx, os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

prompt_text = """Analyze [COMPANY] as an investment candidate using the framework below. Be concrete, specific, and operational. I want to understand how the business actually works, where it creates value, where it captures value, and where it is vulnerable. Avoid marketing language. Where information is unavailable or uncertain, say so explicitly, state your assumptions, and still give me your best informed view.

PART 0: Business Model Snapshot
Before the step-by-step walkthrough, briefly orient the analysis with the following:
1. What does [COMPANY] actually sell - what is the core product or suite, and how is it delivered (cloud-native SaaS, hybrid, on-prem, managed service)?
2. What are the major revenue streams and profit pools - break these out by type (subscription, usage-based, services, licensing, transactions)?
3. Who is the buyer, who is the end user, and who is the economic decision maker - and is the buying motion top-down (enterprise sales) or bottom-up (product-led growth / self-serve), or both?
4. Where does [COMPANY] sit in the value chain - is it a system of record, a system of engagement, a workflow layer, an analytics layer, infrastructure, or a platform that others build on? What systems sit immediately upstream and downstream?
5. Is this primarily a recurring revenue, transaction-driven, consumption-based, project-based, or hybrid business? What percentage of revenue is contractually recurring (ARR) vs. variable or one-time?

PART 1: End-to-End Product Workflow
Walk me through how [COMPANY]'s software is actually used by its customers, step by step. If the company has multiple products or modules, map each one separately and show how they connect. For each step:
1. User persona - Who is the actual user at this step (job title, department, technical proficiency)? Who is the buyer if different from the user? What are they doing day-to-day when they interact with this software, and what triggers them to open the product?
2. Input and system context - What data, content, or action does the user provide at this step? What data does the system pull automatically from integrations, prior steps, or third-party sources? Identify the key integrations and data flows - what other systems (ERP, CRM, data warehouse, HRIS, etc.) does [COMPANY]'s product connect to at this step, and how tightly coupled are those integrations?
3. What the software does - What does the product actually do at this step? Be specific about the processing logic: is it automation of a manual task, data transformation, workflow orchestration, analytics/reporting, AI/ML inference, or something else? Distinguish between core proprietary functionality and commodity features that any competitor could replicate.
4. Output and downstream recipient - What is the deliverable, alert, report, or action generated? Who receives it (another user, a downstream system, an external stakeholder, a regulator), and what do they do with it?
5. Manual or legacy alternative - If [COMPANY]'s software is not used at this step, what does the customer do instead? Be specific: is it spreadsheets, manual processes, an in-house build, a legacy on-prem tool, a different SaaS vendor, or simply not doing this task at all? How painful is the alternative - is it a minor inconvenience or operationally untenable at scale?
6. Adoption and expansion mechanics - How does usage of this step deepen over time? Does it start with a single team and spread to other departments (land-and-expand)? Does increasing data volume or user count make the product harder to leave? Identify what drives seat expansion, module upsell, or usage growth within an existing account.

Structure this as the full lifecycle from the first customer touchpoint to final value delivery.

PART 2: Competitive Overlay
At EACH step identified in Part 1, answer:
1. Direct competitors - Which companies offer a direct substitute for this specific step? Name the companies and the specific product or module. Do not just list industry peers generically - tell me who competes at this step and whether they compete on functionality, price, or go-to-market.
2. Adjacent and emerging threats - Which of the following could credibly displace [COMPANY] at this step, even if they don't compete there today? Which of these threats is most credible in the next 2-3 years, and why?
   - Platform incumbents expanding scope (e.g., Salesforce, Microsoft, SAP, ServiceNow, Workday adding overlapping modules)
   - AI-native startups rebuilding the workflow with a fundamentally different architecture or cost structure
   - Open-source or commoditized alternatives that are "good enough" for a meaningful customer segment
   - Customer's internal engineering team building in-house (the build-vs-buy risk)
   - Vertical integration by a supplier, partner, or customer that eliminates the need for [COMPANY]'s product
   - Regulatory or policy changes that create or remove the need for this function
3. Specific competitive advantage at this step - What gives [COMPANY] a defensible edge here? Be precise and select from (or combine):
   - Data moat: Proprietary data assets that improve with usage, training data for ML models, data network effects
   - Workflow entrenchment: Deep integration into the customer's daily operating cadence such that removal requires rearchitecting processes, not just swapping tools
   - Integration lock-in: Tight coupling with the customer's tech stack (API dependencies, data pipelines, embedded workflows) that makes switching technically costly
   - Network effects: Direct (more users = more value) or indirect (marketplace dynamics, developer ecosystem)
   - Switching cost / migration friction: Accumulated configuration, historical data, trained models, custom workflows, or institutional knowledge stored in the product
   - Regulatory or compliance lock-in: Certifications, audit trails, validated workflows that constrain switching
   - Cost advantage: Scale economics in infrastructure, data processing, or go-to-market
   - Product superiority: Genuine functional differentiation that competitors have not matched and cannot easily replicate
4. Specific disadvantage or vulnerability at this step - Where is [COMPANY] losing deals, losing share, or receiving negative feedback? To which competitor, and why? Is the product technically lagging, overpriced, poorly integrated, or losing developer/admin mindshare? Do not hedge - be honest.
5. Commodity vs. differentiation - Is this step a commodity function (standard API, data pass-through, table-stakes feature every competitor offers) or a differentiated function (proprietary data, unique ML model, workflow innovation, network effect)? If it is transitioning from differentiated toward commodity - or vice versa - say so and explain what is driving the shift.

PART 3: Value Capture Map
For each step, identify:
1. Monetization model - How does [COMPANY] generate revenue at this step? Be specific: per-seat/per-user subscription, usage-based or consumption-based pricing, per-transaction fee, percentage of value processed, platform fee, tiered feature gating, professional services, or hybrid. Is the revenue contractually recurring (ARR), usage-based (variable but repeatable), or one-time (implementation, migration)?
2. Revenue contribution - Approximate revenue contribution of this step if known or estimable. Is this a core ARR driver, a growth/expansion vector, an upsell/cross-sell module, a professional services wrapper, or a loss leader that enables monetization elsewhere?
3. Margin profile - What is the gross margin profile of this step? Distinguish between high-margin software revenue (70%+ GM), moderate-margin managed services or platform processing, and lower-margin professional services, implementation, or support. Are margins stable, expanding, or under pressure - and what is driving the trajectory?
4. Pricing power - Can [COMPANY] raise prices at this step without meaningful customer attrition or downsell? What is the evidence? Consider: historical price increases and customer response, contract escalators, competitive pricing pressure, value-to-cost ratio from the customer's perspective, and whether the product is a "must-have" line item or discretionary spend vulnerable to cuts in a downturn.
5. Value chain economics - Where in the customer's overall workflow does the most dollar value flow? What percentage of that total economic value is [COMPANY] capturing? Is there room to capture more (pricing upside), or is [COMPANY] already near the ceiling of what customers will tolerate? Are there steps where [COMPANY] creates significant value but fails to monetize it - and if so, is that a strategic choice or a competitive constraint?
6. Net retention mechanics - What drives net dollar retention at this step? Decompose into: seat expansion (more users), usage growth (more volume or transactions), module upsell (additional products), and price escalation - vs. churn and contraction. Is the expansion primarily organic (customers naturally use more) or sales-driven (requires active selling)?

PART 4: Honest Competitive Assessment
Synthesize Parts 1-3 into a candid competitive positioning analysis:
1. Where is the moat genuinely deep? What would it realistically take - in time, capital, data, engineering talent, and go-to-market effort - for a competitor to displace [COMPANY] here? Be specific about which moat type (data, workflow, integration, network effect, regulatory) is doing the heavy lifting.
2. Where is the moat shallow or eroding? What specific trends, competitive moves, or structural shifts are weakening their position? Pay particular attention to: AI-driven disruption that could commoditize core functionality, platform vendors bundling equivalent features at low or no marginal cost, and open-source alternatives reaching enterprise readiness.
3. Platform and ecosystem dependency risk - Is [COMPANY] dependent on a major cloud provider (AWS, Azure, GCP), marketplace, app store, or API partner? Could that platform become a competitor, change terms, or disintermediate [COMPANY]? How concentrated is this risk?
4. Single biggest competitive risk over a 3-year horizon - Name it, explain the mechanism by which it would damage the business, and assess the probability and severity.
5. Bull case the market may be underappreciating - What positive development, product optionality, market expansion, or structural tailwind is not fully reflected in consensus expectations?
6. Bear case that holders may be dismissing - What downside scenario, competitive threat, or structural headwind are current investors rationalizing away?
7. Customer relationship depth and ownership - Who within the customer organization owns the relationship with [COMPANY]? Map the stakeholders: is it the CIO/CTO (strategic, sticky), a VP or department head (important but replaceable), a team lead or admin (operational, at risk if that person leaves), or end users (broadly adopted but shallow)? Is the buying decision centralized (enterprise procurement) or decentralized (bottom-up adoption)? How does this affect defensibility?
8. Switching cost rating - Rate the overall switching cost as low / moderate / high / very high and explain why with specifics. Break it down:
   - Technical: Data migration complexity, integration rewiring, API dependencies, custom configuration that must be rebuilt
   - Operational: Retraining users, rebuilding workflows, productivity loss during transition, parallel-run requirements
   - Contractual: Multi-year terms, termination penalties, committed spend agreements
   - Strategic: Loss of historical data and analytics continuity, loss of trained ML models or accumulated intelligence, disruption to downstream systems that depend on [COMPANY]'s output

Final instruction: Be direct and opinionated. I am a portfolio manager and I need an honest assessment, not a balanced-on-both-sides hedge. Where you have conviction, state it clearly and explain your reasoning. Where evidence is thin, flag the uncertainty but still give me your best-informed view. Where the answer is "I don't know," say so rather than filling with generic software industry platitudes."""

record = {
    "id": "prompt_software_analysis",
    "title": "Software Company Analysis",
    "prompt_text": prompt_text,
    "created_at": "2026-04-05T00:00:00Z",
    "updated_at": "2026-04-05T00:00:00Z",
}

r = httpx.post(
    f"{url}/rest/v1/prompts",
    headers={"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates"},
    json=record,
    timeout=30,
)
print(f"Status: {r.status_code}")
if r.status_code not in (200, 201):
    print(r.text)
else:
    print("Prompt saved.")
