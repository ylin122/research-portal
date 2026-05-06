import httpx, os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

prompt_text = """Analyze [COMPANY] as an investment candidate using the framework below. Be concrete, specific, and operational. I want to understand how the business actually works, where it creates value, where it captures value, and where it is vulnerable. Avoid marketing language. If information is unavailable, say so explicitly, state assumptions clearly, and still give me your best informed view.

PART 0: Business Model Snapshot
Before going step by step, briefly orient the analysis:
1. What does [COMPANY] actually sell
2. What are the major revenue streams and profit pools
3. Who is the buyer, who is the end user, and who is the economic decision maker
4. Where does [COMPANY] sit in the value chain
5. Is this primarily a recurring revenue, transaction driven, project based, asset intensive, labor intensive, or hybrid business

PART 1: End-to-End Business Analysis
Walk me through how [COMPANY] makes money, step by step - from the moment a customer need arises to the final delivery of value. Cover each major business line or segment if the company operates more than one.

For each step in the value chain:
1. Customer persona - Who is the buyer and who is the end user (they may differ)? Be specific: job title or role, industry context, what they are doing day-to-day when they encounter the need that [COMPANY] addresses, and what triggers the purchase decision.
2. What the customer pays for - What specifically is the customer buying (product, service, access, outcome, risk reduction, compliance, time savings, etc.)? Why are they willing to pay, and what drives urgency to buy now rather than defer?
3. How the business adds value - What does [COMPANY] actually do at this step that the customer cannot easily do themselves or source elsewhere? Describe the operational, technical, or institutional capability that underpins value delivery.
4. Output and recipient - What is the deliverable, outcome, or experience the customer receives? Who in the customer's organization (or value chain) ultimately benefits?
5. Alternatives and inaction - If the customer does not buy from [COMPANY], what do they do instead? Options include: a direct competitor, an in-house solution, a manual or legacy process, a different category of product/service entirely, or simply doing nothing. Be specific about which alternative is most common and why.

Structure this as the full lifecycle from initial customer need through final value delivery. If the business model involves distinct stages (e.g., land > expand > renew; or manufacture > distribute > service), map each stage explicitly.

PART 2: Competitive Overlay
Return to each step identified in Part 1 and answer the following:
1. Direct competitors - Which companies offer a direct substitute for this specific step? Name the companies and the specific competing product, service, or offering. Do not just list industry peers generically - tell me who competes at this step.
2. Adjacent and emerging threats - Which companies, technologies, or business model shifts could credibly displace [COMPANY] at this step, even if they don't compete there today? Consider: vertical integration by customers or suppliers, platform expansion by adjacent players, regulatory or policy changes, open-source or commoditized alternatives, and new market entrants.
3. Specific competitive advantage at this step - What gives [COMPANY] a defensible edge? Be precise and select from (or combine) the following categories:
   - Structural: Regulatory lock-in, government mandate or licensing, exclusive partnerships, supply chain control, scarcity of key inputs, proprietary infrastructure or assets
   - Behavioral: Customer habit and workflow entrenchment, switching costs and integration dependencies, brand trust and reputation, community or cultural identity, relationship depth with key decision-makers
   - Economic: Cost leadership, economies of scale or scope, pricing power from bundling, capital intensity as a barrier to entry, distribution or channel advantage
   - Technical / Informational: Proprietary data assets, network effects, product or performance superiority, IP and patents, security or compliance certifications, platform ecosystem and integrations
4. Specific disadvantage or vulnerability at this step - Where is [COMPANY] losing deals, losing market share, or underperforming? To whom, and why? Do not hedge - be honest about weaknesses.
5. Commodity vs. differentiation - Is this step commoditized (customers view offerings as interchangeable and buy on price) or differentiated (customers pay a premium for [COMPANY]'s specific offering)? If it's in transition from one to the other, say so and explain the direction.

PART 3: Value Capture Map
For each step in the value chain, assess how effectively [COMPANY] converts value creation into revenue and profit:
1. Monetization model - How does [COMPANY] generate revenue at this step? (e.g., subscription, per-unit pricing, licensing, transaction fees, service contracts, volume-based pricing, bundled pricing, razor-and-blade, advertising, take rate, etc.) Is the revenue recurring, repeatable, or one-time?
2. Revenue contribution - Approximate revenue contribution of this step if known or estimable. Is this a core revenue driver, a growth vector, an upsell/cross-sell module, or a loss leader that enables monetization elsewhere?
3. Margin profile - What is the gross margin profile of this step? (High-margin software/IP vs. lower-margin services, hardware, distribution, etc.) Are margins stable, expanding, or under pressure - and why?
4. Pricing power - Can [COMPANY] raise prices at this step without meaningful customer attrition? Why or why not? What is the evidence (historical price increases, contract escalators, competitive pricing dynamics, customer sensitivity)?
5. Value chain economics - Where in the overall workflow or value chain does the most dollar value flow? What percentage of that total economic value is [COMPANY] capturing vs. leaving to suppliers, channel partners, customers, or competitors? Are there steps where [COMPANY] is creating significant value but failing to capture it - and if so, why?

PART 4: Honest Competitive Assessment
Synthesize Parts 1-3 into a candid, opinionated competitive positioning analysis:
1. Where is the moat genuinely deep? What would it realistically take (time, capital, regulatory change, technological shift) for a competitor to displace [COMPANY] here?
2. Where is the moat shallow or eroding? What specific trends, competitive moves, or structural shifts are weakening their position?
3. Single biggest competitive risk over a 3-year horizon - Name it, explain the mechanism, and assess the probability and severity.
4. Bull case the market may be underappreciating - What positive development, optionality, or inflection point is not fully reflected in consensus expectations?
5. Bear case that holders may be dismissing - What downside scenario or structural headwind are current investors rationalizing away?
6. Customer relationship depth - Who within the customer organization owns the relationship with [COMPANY]? Is it the C-suite, a department head, a frontline manager, procurement, or an individual user who could switch unilaterally? How deep is the institutional dependency vs. individual preference?
7. Switching cost rating - Rate the overall switching cost as low / moderate / high / very high and explain why with specifics. Distinguish between technical switching costs (migration, integration), contractual switching costs (terms, penalties), and behavioral switching costs (retraining, workflow disruption, organizational inertia).

Final instruction: Be direct and opinionated. I am a portfolio manager and I need an honest assessment, not a balanced-on-both-sides hedge. Where you have conviction, state it clearly and explain your reasoning. Where evidence is thin, flag the uncertainty but still give me your best-informed view."""

record = {
    "id": "prompt_general_analysis",
    "title": "General Company Analysis",
    "prompt_text": prompt_text,
    "created_at": "2026-04-05T00:00:01Z",
    "updated_at": "2026-04-05T00:00:01Z",
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
    print("Prompt #2 saved.")
