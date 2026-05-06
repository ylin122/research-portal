# Weekly Audit Report — 2026-04-06

## Summary
- **Companies:** 157 total, 2 fully filled, 20 with zero fields
- **Avg field completion:** 75%
- **Labels:** 32 public, 109 private, 16 unset
- **News freshness:** 1 fresh, 0 stale, 156 missing
- **Notes:** 109 companies have no research notes
- **KB articles:** 3, 0 not analyzed
- **Ideas pipeline:** 0 total | Q&A: 0 pending
- **Cross-check flags:** 0

## Critical Issues
- 16 companies missing public/private label

## Stale Data
- 16 companies with no field updates in 60+ days
- 43 potentially stale date references in Industry Research hardcoded data

## Completeness Gaps
- 20 companies with zero research fields filled
- 135 companies partially filled (missing: Cvent: financials | Cohesity: financials | Fortra: financials | McAfee Enterprise: financials | WatchGuard Technologies: financials)
- 109 companies with no research notes at all
- Wiki: raw_not_in_summaries — 1 raw files not summarized

## Accuracy Spot Check (verify via web search)
**Week 2935 sample:** MaxLinear, Colibri Group, Precisely, Ping Identity, Houghton Mifflin Harcourt
**Total checks:** 25

### Company Checks
**MaxLinear** (hardware/semiconductors)
- [ ] public_private: Verify MaxLinear is publicly traded. Find ticker and exchange.
  - Current: Public
- [ ] overview: Verify key claims: ownership, HQ, employee count, founding date. Flag anything incorrect.
  - Current: • Public fabless semiconductor company (Nasdaq: MXL) — designs RF, analog, and mixed-signal ICs for broadband, connectivity, and infrastructure
• Foun
- [ ] products: Verify main products/services are current. Check for major product launches or discontinuations in last 6 months.
  - Current: • Broadband access ICs: Cable modem, DSL, and fiber chipsets
• Connectivity: Wi-Fi and Ethernet controller ICs
• Infrastructure: Data center PAM4 opti
- [ ] transactions: Verify transaction details (acquirer, date, amount). Check for any new transactions not listed.
  - Current: • 2023: Broadcom's $3.8B acquisition attempt was terminated
• Market cap ~$2-3B...

**Colibri Group** (education/corporate)
- [ ] public_private: Verify Colibri Group is private. Check it has NOT IPO'd or been acquired by a public company.
  - Current: Private
- [ ] overview: Verify key claims: ownership, HQ, employee count, founding date. Flag anything incorrect.
  - Current: • Private online professional education and licensing company — provides pre-licensing, continuing education (CE), and exam preparation for profession
- [ ] products: Verify main products/services are current. Check for major product launches or discontinuations in last 6 months.
  - Current: • Revenue model: Mix of subscription (annual CE packages), per-course purchases, and exam prep fees. Revenue is highly recurring because continuing ed
- [ ] transactions: Verify transaction details (acquirer, date, amount). Check for any new transactions not listed.
  - Current: • 2019: Gridiron Capital recapitalization — management-led buyout with Gridiron as PE partner
• Under Gridiron: Aggressive acquisition strategy — acqu

**Precisely** (software/infrastructure)
- [ ] public_private: Verify Precisely is private. Check it has NOT IPO'd or been acquired by a public company.
  - Current: Private
- [ ] overview: Verify key claims: ownership, HQ, employee count, founding date. Flag anything incorrect.
  - Current: • Private data integrity software company headquartered in Burlington, MA
• Formed through a decade of PE-driven roll-ups: Syncsort (founded 1968) → 
- [ ] products: Verify main products/services are current. Check for major product launches or discontinuations in last 6 months.
  - Current: • Revenue model: Subscription/SaaS-based pricing for the Data Integrity Suite (cloud-hosted); legacy on-prem perpetual licenses still contribute but m
- [ ] transactions: Verify transaction details (acquirer, date, amount). Check for any new transactions not listed.
  - Current: • Jan 2026: Achieved FedRAMP Moderate authorization for Data Governance Service — unlocks federal procurement pipeline
• Jan 2023: Acquired Transerve

**Ping Identity** (software/security)
- [ ] public_private: Verify Ping Identity is private. Check it has NOT IPO'd or been acquired by a public company.
  - Current: Private
- [ ] overview: Verify key claims: ownership, HQ, employee count, founding date. Flag anything incorrect.
  - Current: • Private identity security company — provides enterprise identity and access management (IAM), single sign-on (SSO), multi-factor authentication (MFA
- [ ] products: Verify main products/services are current. Check for major product launches or discontinuations in last 6 months.
  - Current: • Revenue model: SaaS subscription — per-user or per-identity annual contracts
• PingOne Cloud Platform: Unified identity platform — SSO, MFA, directo
- [ ] transactions: Verify transaction details (acquirer, date, amount). Check for any new transactions not listed.
  - Current: • Oct 2022: Thoma Bravo acquired Ping Identity for $2.8B
• Jul 2023: Thoma Bravo also acquired ForgeRock for $2.3B — creating potential for Ping + For

**Houghton Mifflin Harcourt** (education/edtech)
- [ ] public_private: Verify Houghton Mifflin Harcourt is private. Check it has NOT IPO'd or been acquired by a public company.
  - Current: Private
- [ ] overview: Verify key claims: ownership, HQ, employee count, founding date. Flag anything incorrect.
  - Current: • Private K-12 education technology and curriculum company — one of the "Big 3" US K-12 curriculum publishers (alongside McGraw Hill and Savvas/Pearso
- [ ] products: Verify main products/services are current. Check for major product launches or discontinuations in last 6 months.
  - Current: • Revenue model: Mix of digital subscriptions (SaaS, per-student), curriculum adoptions (large multi-year district purchases — lumpy, adoption-cycle d
- [ ] transactions: Verify transaction details (acquirer, date, amount). Check for any new transactions not listed.
  - Current: • Apr 2023: Veritas Capital acquired HMH for $2.8B. Veritas also owns Savvas Learning (ex-Pearson K-12) — creating a unique situation where one PE fir

### Hardcoded Data Checks
- [ ] **AI Labs** — OpenAI valuation: Search for latest OpenAI valuation. Compare against what is in IndustryResearch.jsx.
- [ ] **AI Labs** — Anthropic ARR: Search for latest Anthropic ARR or revenue figure. Compare against portal data.
- [ ] **AI Labs** — AI lab latest models: For each lab (OpenAI, Anthropic, Google, xAI, Meta), verify the latest flagship model name is correct.
- [ ] **AI Labs** — AI lab CEO/leadership: Verify CEO for each AI lab has not changed.
- [ ] **AI-Native** — Fastest 0-$1B ARR: Verify current record holder for fastest 0 to $1B ARR among AI-native companies.

## Stats Snapshot
### Companies by Sector
- software/application: 39
- software/infrastructure: 22
- software/security: 17
- hardware/semiconductors: 14
- education/edtech: 9
- healthcare/analytics: 8
- internet/other: 7
- itservices/var: 6
- itservices/consulting: 5
- education/traditional: 4
- aidigital/compute: 4
- hardware/devices: 4
- hardware/other: 2
- education/corporate: 2
- internet/hosting: 2
- internet/marketplace: 2
- itservices/managed: 2
- healthcare/ehr: 2
- education/other: 2
- itservices/other: 1
- aidigital/shell: 1
- internet/adtech: 1
- healthcare/other: 1

### Priority Distribution
- High: 7
- Medium: 24
- Low: 9
- Watching: 0
- unset: 117

### KB Articles by Category
- articles: 3

### Ideas Pipeline
