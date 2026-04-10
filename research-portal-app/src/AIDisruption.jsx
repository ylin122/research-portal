import { useState, useEffect, useMemo } from "react";
import { T_, FONT } from "./lib/theme";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const SECTORS = [
  {
    key: "software", label: "Software", icon: "S", color: "#3B82F6",
    subsectors: [
      { name: "ERP & Core Business Software", risk: "Low-Medium", timeline: "3-5+ years",
        thesis: "AI enhances ERP (smarter forecasting, anomaly detection, natural language queries) but won't replace core systems of record. Switching costs enormous, data mission-critical, regulatory requirements demand auditability. AI is an upsell opportunity for incumbents, not a disruption threat",
        winners: "Incumbent ERP vendors embedding AI effectively and charging premium tiers",
        losers: "ERP vendors that fail to add AI; niche point solutions that AI copilots can replace",
        names: "Well-positioned: SAP (Joule), Oracle (AI agents), Microsoft (Copilot for Dynamics 365), Workday. Watch: Epicor, Infor, NetSuite",
        metrics: "Watch: AI feature attach rates, premium pricing for AI tiers, customer adoption of AI copilots within ERP, reduction in customization/consulting spend" },
      { name: "CRM & Sales Software", risk: "Medium", timeline: "2-4 years",
        thesis: "AI transforms CRM from data repository into autonomous selling engine. Lead scoring, email drafting, pipeline forecasting, call prep increasingly AI-driven. Bigger risk is to point-tool ecosystem around CRM that AI-native CRM may absorb",
        winners: "CRM platform vendors embedding AI natively (Salesforce, HubSpot); AI-native sales tools replacing point solutions",
        losers: "Standalone sales engagement tools, data enrichment vendors facing commoditization, forecasting point solutions, manual SDR/BDR outsourcing",
        names: "Strengthening: Salesforce (Agentforce), HubSpot (Breeze AI). At risk: ZoomInfo (data commoditizing), Outreach/Salesloft, Clari/Gong. Emerging: Clay, 11x (AI SDRs)",
        metrics: "Watch: point-solution attach rates declining, CRM AI feature adoption, SDR headcount trends, pipeline per rep with AI vs without" },
      { name: "HCM & HR Software", risk: "Low-Medium", timeline: "3-5 years",
        thesis: "AI enhances HR through resume screening, skills matching, sentiment analysis, predictive attrition. Core HCM (payroll, benefits, compliance) is system-of-record with regulatory limits on disruption. AI is upsell, not replacement. Biggest impact on talent acquisition",
        winners: "HCM incumbents embedding AI; AI-native recruiting tools",
        losers: "Standalone ATS if HCM absorbs; resume screening agencies; basic HR chatbot vendors",
        names: "Well-positioned: Workday, UKG (Bryte AI), ADP, Dayforce, isolved. Recruiting: HireVue, Eightfold AI, Paradox. At risk: staffing for white-collar roles",
        metrics: "Watch: time-to-hire with AI screening, recruiter headcount per role, AI feature adoption in HCM, self-service resolution rates" },
      { name: "Cybersecurity Software", risk: "Medium (Positive)", timeline: "Ongoing",
        thesis: "AI is net positive for cybersecurity — attack surface and threat sophistication increasing faster than human capacity. AI-powered SOC automation, threat detection, incident response becoming table stakes. Talent shortage (3.5M+ unfilled) makes AI augmentation essential. Category where AI expands TAM",
        winners: "AI-native security platforms with large data moats; vendors automating SOC workflows",
        losers: "Legacy SIEM without AI modernization; purely rule-based detection; security vendors that can't embed AI",
        names: "Benefiting: CrowdStrike (Charlotte AI), Palo Alto (XSIAM), SentinelOne (Purple AI), Abnormal Security, Wiz. At risk: Legacy SIEM (ArcSight/OpenText)",
        metrics: "Watch: mean time to detect/respond, false positive rates, SOC analyst productivity multiplier, AI feature adoption, security spend as % of IT budget" },
      { name: "Email & Endpoint Security", risk: "Medium (Positive)", timeline: "Ongoing",
        thesis: "AI-generated phishing more convincing and voluminous, increasing demand for AI-powered email security. Endpoint threats evolving with AI-assisted malware. Net positive for vendors that keep pace — arms race favors platform players with broad telemetry",
        winners: "AI-powered email security with behavioral analysis; EDR/XDR platforms with large telemetry",
        losers: "Signature-based detection; basic gateway/filtering without AI; narrow telemetry vendors",
        names: "Benefiting: Proofpoint, Abnormal Security, Sophos (MDR), SentinelOne. Adapting: Barracuda, SonicWall, WatchGuard, KnowBe4 (HRM+), Fortra. At risk: legacy gateway-only",
        metrics: "Watch: AI-generated phishing volume, detection rates for novel attacks, email security AI adoption, SAT effectiveness" },
      { name: "Identity & Access Management", risk: "Medium (Positive)", timeline: "2-4 years",
        thesis: "AI creates new identity attack vectors (deepfakes, credential stuffing at scale, synthetic identities) increasing demand for sophisticated IAM. Also enables better authentication (behavioral biometrics, continuous verification). Net positive. Identity is the new perimeter in zero-trust",
        winners: "IAM platforms with AI-powered adaptive authentication and threat detection",
        losers: "Static password-only auth, basic MFA without risk-based intelligence",
        names: "Benefiting: Ping Identity, CyberArk, Okta, SailPoint, Imprivata (healthcare). AI-native: Beyond Identity, Transmit Security",
        metrics: "Watch: identity-based attack volume, adaptive auth adoption, passwordless deployment, IAM spend as % of security budget" },
      { name: "BI & Analytics Software", risk: "High (Positive Disruption)", timeline: "1-3 years",
        thesis: "Most transformative AI force in BI in a decade. NLP querying democratizes analytics from trained analysts to every employee. Massively expands user base. Disruption to pre-built dashboards — AI makes every employee self-serve. Total queries could increase 100x",
        winners: "BI platforms with strong AI/NLP interfaces; data platforms billing on query volume (Jevons' beneficiary)",
        losers: "Dashboard-heavy BI without AI querying; analyst roles building static reports; BI consulting firms",
        names: "Well-positioned: ThoughtSpot (AI-first), Power BI (Copilot), Tableau, Qlik (AI). Data beneficiaries: Snowflake, Databricks. At risk: legacy reporting, BI consulting",
        metrics: "Watch: BI DAU as % of employees (historically <20%, AI could push 50%+), self-service query volume, data platform compute consumption" },
      { name: "Data Infrastructure & Databases", risk: "Low (Positive)", timeline: "Ongoing",
        thesis: "Single clearest Jevons' beneficiary in software. Every AI model needs data pipelines, storage, compute. More AI = more data ingestion, transformations, queries, storage. Key bifurcation: Databricks ($5.4B run-rate, 65% YoY growth, $1.4B AI revenue) is pulling ahead by building AI natively (acquired MosaicML, launched Agent Bricks, bought Neon for Lakebase). Snowflake (similar run-rate, 29% growth) partnered rather than built — AI adoption via Cortex slower. MongoDB pivoting strongly (Atlas 30% growth, Voyage AI acquisition for vector search). Consumption-based pricing means these platforms benefit from AI query volume explosion regardless of which AI app layer wins",
        winners: "Data platforms with consumption-based pricing: Databricks (AI-native leader, 65% growth), MongoDB (vector search pivot), Confluent (streaming for AI pipelines). Snowflake benefits but less AI-differentiated than Databricks",
        losers: "Legacy on-prem data warehouses that can't handle AI workloads; ETL tools that AI pipelines replace",
        names: "Strongest beneficiaries: Databricks (AI-native, $5.4B run-rate), MongoDB (vector DB + Atlas growth accelerating to 30%), Confluent. Also strong: Snowflake (29% growth but AI adoption lagging Databricks), Cloudera (hybrid), Precisely (data quality — AI needs clean data). At risk: legacy on-prem DW",
        metrics: "Watch: Databricks vs Snowflake AI revenue split, data platform consumption growth, MongoDB Atlas AI workload %, volumes ingested, compute spend per customer" },
      { name: "IT Operations & Service Management", risk: "Medium-High", timeline: "2-4 years",
        thesis: "Bifurcated: ServiceNow is among the strongest AI beneficiaries in enterprise software (Now Assist surpassed $600M ACV, doubling YoY, 45-60% ticket deflection rates, revenue approaching $15B by end of 2026, 20% subscription growth guided). All 6 disruption frameworks point positive for ServiceNow: no AI competition (AI makes it MORE valuable as orchestration layer), deeply proprietary workflow data, inelastic demand (you can't run IT without ITSM), extreme switching costs (12-18mo implementations), customers are NOT early adopters (enterprise IT procurement), revenue is critical (enables all IT operations). Negative for managed services headcount around ITSM and weaker ITSM players",
        winners: "ServiceNow (dominant — possibly strongest AI beneficiary position in entire portfolio, $600M+ AI ACV); AIOps platforms (Datadog, Dynatrace)",
        losers: "L1/L2 help desk outsourcers; managed services charging per-ticket; legacy ITOM without AI; weaker ITSM players (BMC if AI modernization lags)",
        names: "Strengthening: ServiceNow (Now Assist), BMC (HelixGPT). ITOM: Datadog, Dynatrace, Splunk (Cisco). At risk: help desk BPOs, SolarWinds (if AI modernization lags)",
        metrics: "Watch: AI ticket resolution rates, L1 deflection %, ServiceNow AI attach rates, MTTR with AIOps vs manual" },
      { name: "Backup & Data Protection", risk: "Low-Medium (Positive)", timeline: "3-5 years",
        thesis: "AI-powered ransomware makes attacks more sophisticated, increasing urgency for modern backup/recovery. AI also improves backup intelligence (anomaly detection, clean recovery validation). Net positive — more threats = more protection demand",
        winners: "Modern backup with AI threat detection and clean recovery; cyber vaulting leaders",
        losers: "Legacy backup without AI; tape-only; tools that can't validate recovery integrity",
        names: "Benefiting: Veeam, Cohesity, Rubrik, Commvault (Metallic). At risk: legacy Veritas (pre-merger), basic backup tools",
        metrics: "Watch: ransomware recovery SLA metrics, backup AI feature adoption, cyber vault deployment, data protection spend as % of IT budget" },
      { name: "DevOps & Developer Tools", risk: "Medium", timeline: "1-3 years",
        thesis: "Bifurcated impact. Infrastructure-layer tools (version control, observability) benefit from AI-driven code volume explosion. But standalone AppSec, code quality, and developer productivity tools face existential displacement as AI coding platforms (Cursor, Copilot, Windsurf) embed security scanning, testing, and code review directly into the IDE workflow. The scanning-as-a-separate-step model is a melting ice cube — AI labs and platforms have every incentive to ship secure code by default, eliminating the need for after-the-fact tools",
        winners: "Infrastructure-layer platforms: version control (Perforce - large binary repos have no AI substitute), observability (Elastic, Datadog), GitHub. Tools below the workflow that process MORE code as volume explodes",
        losers: "Standalone AppSec scanning (Veracode, Checkmarx - AI coding platforms embedding security inline, displacing separate scan-fix cycles), static analysis (SonarSource - code quality becoming a feature not a product), IDE productivity plugins (Idera/Visual Assist - directly replaced by Copilot/Cursor), manual testing tools, basic API testing (SmartBear testing side). PE roll-ups of aging dev tools (Idera)",
        names: "Benefiting: Elastic (vector DB + AI search), Perforce (binary VCS insulated), GitHub. Displaced: Veracode (near-term ACV growth is misleading - AI platforms embedding security inline will eliminate standalone scanning), SonarSource (commoditizing), Idera (aging portfolio), SmartBear (testing side). Mixed: SolarWinds (competitive not AI threat)",
        metrics: "Watch: AI coding platform security feature adoption (Cursor, Copilot inline scanning), standalone AppSec tool churn rates, AI-generated code security improvement over time, code volume (commits, PRs per dev)" },
      { name: "Content & Document Management", risk: "Medium", timeline: "2-4 years",
        thesis: "AI transforms document management from storage/retrieval to intelligent content processing. Auto-classification, summarization, extraction, compliance checking become native. Positive for platforms embedding AI; threatens manual document processing workflows",
        winners: "ECM platforms embedding AI content intelligence; intelligent document processing vendors",
        losers: "Manual document classification; ECM implementation consultants; basic DMS without AI",
        names: "Adapting: OpenText (Aviator AI), Hyland. Adjacent: Kofax (intelligent automation), ABBYY. At risk: legacy DMS without AI",
        metrics: "Watch: AI auto-classification accuracy, document processing throughput, ECM AI feature adoption" },
      { name: "Collaboration & Productivity", risk: "Medium", timeline: "3-5 years",
        thesis: "AI copilots in every productivity tool — meeting summarization, email drafting, document creation, PM automation. Microsoft Copilot for M365 most important but adoption slower than expected: only 15M paid seats (3.3% of 450M base) with just 35.8% active usage among those with access. Data governance concerns are the biggest blocker. Directionally right but enterprise procurement cycles and change management slow the rollout. Platform incumbents win long-term but timeline is extended",
        winners: "Platform incumbents with AI distribution (Microsoft, Google); AI-native meeting/notes tools",
        losers: "Standalone meeting transcription, basic PM without AI, note-taking apps AI copilots absorb",
        names: "Strengthening: Microsoft (Copilot M365 — $30/seat/mo but slow adoption), Google (Gemini Workspace), Notion AI. At risk: Otter.ai, basic PM tools. Emerging: Granola, AI workspace tools",
        metrics: "Watch: Copilot M365 paid seat penetration (currently 3.3%), active usage rate (currently 35.8%), data governance blockers, Copilot revenue per seat, standalone tool churn" },
      { name: "Marketing & AdTech Software", risk: "Medium", timeline: "2-4 years",
        thesis: "AI transforms ad creative, targeting, campaign optimization, personalization. Makes marketing more efficient but reduces need for complex multi-tool MarTech stacks. Meta/Google AI showing strong ROI. Disruption more to agencies than software",
        winners: "Ad platform duopoly (Google, Meta) with data + AI; AI creative tools; CDPs",
        losers: "Mid-tier agencies, manual campaign management, complex MarTech stacks simplified by AI",
        names: "Strengthening: Meta (Advantage+), Google (Pmax), Adobe (GenStudio/Firefly). At risk: The Trade Desk, smaller ad networks. Emerging: Jasper, Writer, Synthesia",
        metrics: "Watch: ROAS with AI vs manual, MarTech consolidation, agency revenue per client, AI creative adoption" },
      { name: "Vertical SaaS", risk: "Low-Medium", timeline: "3-5 years",
        thesis: "Relatively insulated — value in domain-specific workflows, regulatory compliance, deep integrations. AI is upsell lever within vertical platform. Switching costs and data lock-in remain strong moats",
        winners: "Vertical SaaS incumbents embedding AI (pricing optimization, demand forecasting, automated vertical workflows)",
        losers: "Vendors that don't add AI and lose to competitors who do; basic vertical tools AI-native horizontal platforms replace",
        names: "Well-positioned: Toast, Procore, Veeva, ServiceTitan, Applied Systems, Duck Creek, Storable, RealPage, CDK Global",
        metrics: "Watch: AI feature attach rates, premium tier pricing, NRR trends, competitive displacement from AI-enhanced rivals" },
      { name: "Legal Tech & E-Discovery", risk: "High", timeline: "1-3 years",
        thesis: "AI disruption accelerating faster than legal industry conservatism can resist. Harvey AI hit $195M ARR in 2025 (3.9x YoY growth, $11B valuation) — fastest-growing legal AI company. Document review (largest litigation cost) being compressed dramatically. Relativity defensively included aiR in core subscriptions at no extra cost — a sign of competitive pressure, not strength. Contract attorney staffing for document review is being decimated now. CLM and legal research following. Regulatory complexity and privilege review requirements create some floor but the labor-intensive model is structurally broken",
        winners: "AI-native legal platforms (Harvey leading at $195M ARR), e-discovery platforms embedding AI defensively (Relativity aiR), CLM with AI contract analysis",
        losers: "Contract attorney staffing (being displaced now, not in 3-5 years), managed review firms relying on headcount, basic legal research tools AI replaces, law firms slow to adopt AI",
        names: "Disrupting: Harvey ($11B valuation, 3.9x growth). Adapting defensively: Relativity (aiR included free — margin pressure), Thomson Reuters (CoCounsel). CLM: Icertis, Ironclad. At risk: contract attorney staffing firms, managed review companies",
        metrics: "Watch: Harvey ARR growth, Relativity aiR adoption and pricing pressure, cost per document reviewed (collapsing), contract attorney utilization rates, law firm AI adoption" },
      { name: "RPA & Intelligent Automation", risk: "High", timeline: "1-3 years",
        thesis: "GenAI is both massive tailwind and existential threat to RPA. Tailwind: AI makes automation accessible and expands automatable processes. Threat: LLMs handle unstructured tasks rules-based RPA cannot, potentially leapfrogging entire architecture",
        winners: "RPA vendors pivoting to AI-powered automation platforms; process mining feeding AI automation",
        losers: "Rules-based-only RPA; implementations that AI agents can replace entirely",
        names: "Pivoting: UiPath (AI-powered), Automation Anywhere (GenAI). Adjacent: Kofax, Blue Prism (SS&C). Process mining: Celonis. At risk: basic bot-only RPA",
        metrics: "Watch: % automations using AI vs pure rules, unstructured process automation rates, RPA vendor AI feature adoption" },
      { name: "Virtualization & End-User Computing", risk: "Low-Medium", timeline: "3-5 years",
        thesis: "AI workloads change infra requirements but don't disrupt VDI/DaaS delivery. AI enhances EUC through smarter resource allocation, predictive performance, automated troubleshooting. Bigger dynamic is Broadcom/VMware disruption creating alternatives opportunity",
        winners: "EUC platforms leveraging AI for resource optimization and IT ops automation",
        losers: "Legacy VDI without AI management; manual desktop support processes",
        names: "Adapting: Citrix (Aidrien AI), Omnissa (VMware EUC/KKR). Microsoft AVD (AI via Copilot). Broadcom disruption creates switching opportunity",
        metrics: "Watch: AI resource optimization savings, automated troubleshooting rates, VMware migration volumes" },
      { name: "GRC & Compliance Software", risk: "Medium (Positive)", timeline: "2-4 years",
        thesis: "AI automates audit evidence collection, continuous monitoring, risk assessment, regulatory change tracking. Complexity increasing (AI governance itself creates new compliance). Net positive — more regulation + AI automation = larger, stickier compliance budgets",
        winners: "GRC platforms with AI for continuous compliance; RegTech automating regulatory change",
        losers: "Manual audit processes; compliance consulting selling headcount for evidence gathering; spreadsheet GRC",
        names: "Benefiting: ServiceNow GRC, OneTrust, Drata, Vanta. At risk: manual audit firms, spreadsheet compliance",
        metrics: "Watch: continuous monitoring vs periodic audit adoption, compliance automation rates, GRC AI feature usage" },
      { name: "Procurement & Spend Management", risk: "Low-Medium", timeline: "3-5 years",
        thesis: "AI automates sourcing analysis, contract review, spend classification, supplier risk monitoring. Enhances rather than disrupts. Autonomous procurement (AI negotiating) is long-term vision but early innings",
        winners: "Procurement platforms embedding AI for autonomous sourcing and contract analysis",
        losers: "Manual sourcing consulting, procurement BPOs doing basic classification, vendors without AI roadmap",
        names: "Well-positioned: Coupa (Thoma Bravo), Jaggaer (Vista), SAP Ariba, GEP. At risk: manual procurement consulting. Emerging: Zip (intake), AI contract analysis",
        metrics: "Watch: autonomous sourcing adoption, AI-classified spend %, contract AI review rates, procurement cycle times" },
    ],
  },
  {
    key: "itservices", label: "IT Services", icon: "IT", color: "#10B981",
    subsectors: [
      { name: "Application Development & Maintenance", risk: "High", timeline: "2-4 years",
        thesis: "AI code generation compressing labor hours. Offshore labor arbitrage under structural pressure. Developer with AI tools does 2-3x the work. Fewer billable hours per project, not zero developers",
        winners: "Firms adopting AI tools fastest; shifting to outcome-based pricing; AI implementation specialists",
        losers: "Pure body shops selling headcount; low-complexity maintenance (most automatable); offshore-heavy firms slow to retool",
        names: "Most exposed: Tier 2/3 Indian IT (Virtusa, Mphasis, Hexaware, Zensar). Adapting: TCS, Infosys, Wipro, Accenture",
        metrics: "Watch: revenue per employee, utilization rates, pricing per FTE, AI tool adoption in delivery, % revenue from AI engagements" },
      { name: "QA Testing & Outsourced Testing", risk: "High", timeline: "2-4 years",
        thesis: "AI generates test cases, writes automated tests, finds bugs faster than manual QA. Testing outsourcing ($40B+) faces significant compression. GenAI accelerates automated testing 5-10x",
        winners: "AI-powered testing platforms (Mabl, Testim, Katalon), shifting testing left in SDLC",
        losers: "Manual QA outsourcing firms, headcount-based testing services",
        names: "At risk: QA at Cognizant, Wipro, HCL, Infosys. Tools: Tricentis, SmartBear, OpenText. AI-native: Mabl, Testim",
        metrics: "Watch: test automation coverage, QA headcount as % of dev teams, manual testing revenue at outsourcers" },
      { name: "IT Consulting & Strategy Advisory", risk: "Medium-High", timeline: "2-4 years",
        thesis: "AI compresses discovery/analysis phase of consulting. Junior consultants doing research, data analysis, slide building most exposed. Senior strategic judgment and client relationships less automatable. Partner-to-junior ratio will shift significantly",
        winners: "Firms leveraging AI to deliver faster at same price (margin expansion); AI strategy specialists",
        losers: "Pyramid staffing dependent on junior analyst labor; generic strategy on topics AI can research",
        names: "Adapting: Accenture, Deloitte, McKinsey (Lilli). At risk: mid-tier without AI investment. Also: Perficient, Synechron, Thoughtworks",
        metrics: "Watch: consultant-to-partner ratios, junior hiring trends, project delivery timelines, AI tool usage, revenue per consultant" },
      { name: "Cloud Migration & Implementation", risk: "Medium", timeline: "2-4 years",
        thesis: "AI accelerates migration planning, code conversion, infra assessment — fewer hours per project. But total migration volume still growing. Net: margin compression per project but sustained demand. Firms using AI to deliver faster win more",
        winners: "SI firms using AI to compress delivery; cloud-native consultancies",
        losers: "Billing T&M for manual migration assessments; slow implementers losing to AI-accelerated competitors",
        names: "Adapting: Accenture, WWT, Presidio, Trace3. Benefiting: AWS/Azure/GCP professional services. At risk: generic migration consultancies",
        metrics: "Watch: migration project timelines, billable hours per migration, win rates for AI-accelerated proposals" },
      { name: "Infrastructure Managed Services", risk: "Medium", timeline: "3-5 years",
        thesis: "AIOps and automated remediation reducing manual labor in monitoring, incidents, maintenance. Complex hybrid environments still require humans. Talent shortage creates demand floor. AI augments rather than replaces",
        winners: "MSPs leveraging AI for margin improvement; AIOps platform vendors",
        losers: "MSPs relying on NOC/SOC headcount for basic monitoring; can't invest in automation",
        names: "Adapting: Kyndryl, Ensono, Rackspace (if restructured). Tools: Datadog, Dynatrace. At risk: basic monitoring-only MSPs",
        metrics: "Watch: incidents per engineer, automated resolution rates, managed services margin expansion, AIOps adoption" },
      { name: "Cybersecurity Services (MSSPs)", risk: "Medium-High", timeline: "2-4 years",
        thesis: "Human-analyst-heavy SOC/MDR models face AI compression. AI triages, investigates, correlates alerts previously requiring large teams. But threat landscape growing, sustaining overall demand. Shift: fewer analysts doing more, not fewer services",
        winners: "MSSPs embedding AI into SOC (margin expansion); AI-native security ops platforms",
        losers: "MSSPs charging per-analyst with manual triage; manual penetration testing firms",
        names: "Adapting: Optiv (AI SOC), Arctic Wolf, Secureworks. Tools: CrowdStrike, Palo Alto (XSIAM), SentinelOne. At risk: labor-heavy MSSP models",
        metrics: "Watch: alerts per analyst, MSSP margin trends, AI investigation rates, SOC headcount per client" },
      { name: "IT Staffing & Staff Augmentation", risk: "Very High", timeline: "1-3 years",
        thesis: "AI tools making developers 2-3x productive drops demand for contract developers proportionally. IT staffing most directly exposed — sells labor hours with minimal value-add. Thin margins limit pivot ability",
        winners: "Staffing firms pivoting to AI/ML specialist placement; platforms matching AI-augmented talent",
        losers: "Generic IT staffing for commodity developer and QA roles",
        names: "At risk: TEKsystems (Allegis), Robert Half Technology, Kforce, Hays Technology. Protected: niche AI/ML staffing",
        metrics: "Watch: IT staffing revenue, bill rates commodity vs specialized, job posting volumes by skill" },
    ],
  },
  {
    key: "techservices", label: "Tech-Enabled Services & BPO", icon: "TE", color: "#F97316",
    subsectors: [
      { name: "Contact Center & Customer Support BPO", risk: "High", timeline: "2-4 years",
        thesis: "AI agents handling Tier 1 and increasingly Tier 2 tickets. Voice AI replacing IVR and basic agents. ROI immediate — pennies per interaction vs $5-15 human. However, displacement slower than initially expected: Concentrix Q1 FY26 revenue $2.50B (+5.4% YoY), Teleperformance crossed EUR 10B in FY25. Enterprise BPO contracts are 3-5yr terms with deeply embedded workflows — even willing customers can't rip out 10,000-seat operations overnight. Regulated industries (healthcare, financial services) move slowly. SMB/mid-market contact centers face 1-2yr disruption; enterprise BPO faces 3-5yr structural decline with margin compression before revenue collapse",
        winners: "AI-first CCaaS platforms, autonomous AI agent builders",
        losers: "Traditional BPO/contact center outsourcers (slow decline, not collapse), legacy CCaaS without AI. TTEC already in financial distress — weakest positioned",
        names: "At risk: TTEC (distressed), Conduent (weakest). Slower decline: Concentrix (still growing 5%), Teleperformance (EUR 10B+). Transitioning: Five9, NICE, Genesys. AI-native: Sierra, Decagon, Bland.ai, Intercom (Fin)",
        metrics: "Watch: agent headcount at BPOs, AI deflection rates, cost-per-resolution, BPO contract renewal terms (shortening?), TTEC viability, revenue per seat" },
      { name: "Data Entry & Document Processing BPO", risk: "Very High", timeline: "1-2 years",
        thesis: "OCR + LLMs + document understanding makes manual data entry nearly obsolete. Invoice processing, claims handling, form extraction automated rapidly. Lowest-hanging AI fruit with clearest ROI",
        winners: "Intelligent document processing platforms, RPA vendors adding AI",
        losers: "BPO firms dependent on data entry labor, large back-office headcounts",
        names: "At risk: WNS, EXL (BPO segments), Conduent, Xerox services. Benefiting: UiPath, Automation Anywhere, Hyperscience, ABBYY",
        metrics: "Watch: straight-through processing rates, BPO headcount in document verticals, automation pipeline" },
      { name: "Content & Creative Services", risk: "High", timeline: "1-3 years",
        thesis: "GenAI reduces content creation cost 10-50x. Marketing teams need fewer agencies/freelancers. SEO content farms face existential threat. Quality creative, brand strategy, complex campaigns still require human judgment",
        winners: "AI-native content platforms, companies embedding AI in creative workflows",
        losers: "Content mills, basic copywriting agencies, stock photo, low-end design freelancing, SEO farms",
        names: "At risk: Fiverr/Upwork (commodity creative), Getty Images. Benefiting: Adobe (Firefly), Canva (Magic Studio), Runway, Midjourney",
        metrics: "Watch: freelance GMV for creative, agency revenue per creative, AI content adoption, stock photo revenue" },
      { name: "Back-Office Finance & Accounting BPO", risk: "High", timeline: "2-4 years",
        thesis: "AI automates AP, expense management, reconciliation, financial close. Outsourced F&A labor faces compression. Complex judgment, audit, and regulatory requirements slow full automation",
        winners: "AI-powered F&A automation platforms, ERP vendors embedding AI in financial workflows",
        losers: "F&A BPO relying on labor arbitrage, traditional bookkeeping services",
        names: "At risk: F&A at Genpact, WNS, EXL. Benefiting: BlackLine, Stampli, Vic.ai, Brex. Emerging: AI accounting startups",
        metrics: "Watch: touchless invoice rates, financial close cycle times, F&A BPO headcount, AP/AR automation" },
      { name: "Insurance Claims Processing", risk: "High", timeline: "2-4 years",
        thesis: "AI image assessment (photo damage estimation), automated adjudication, fraud detection compressing manual claims labor. Auto claims most advanced. Health and property following. Massive labor pool exposed but regulatory complexity and litigation risk slow full automation",
        winners: "AI claims platforms with image/document AI; insurtech automating workflows",
        losers: "Claims processing outsourcers with large examiner headcount; manual adjusting firms",
        names: "Adapting: CCC Intelligent Solutions (AI estimation), Solera (Qapter), Enlyte/Mitchell. At risk: manual claims BPOs. AI-native: Tractable, Shift Technology",
        metrics: "Watch: auto-adjudication rates, claims cycle times, AI vs human estimation accuracy, examiner headcount" },
      { name: "Medical Coding & Transcription", risk: "Very High", timeline: "1-3 years",
        thesis: "Ambient AI scribes replacing traditional transcription. AI coding achieving human-level accuracy. Offshore medical coding workforce directly exposed. Clearest near-term displacement story in services",
        winners: "AI ambient scribe companies, AI coding platforms integrated with EHRs",
        losers: "Medical transcription services, offshore coding companies (India, Philippines), coding staffing agencies",
        names: "Disrupting: Abridge, Nuance/Microsoft (DAX), Suki AI, Nabla. At risk: offshore coding, transcription. Adapting: AthenaHealth, PointClickCare embedding AI coding",
        metrics: "Watch: ambient scribe adoption, coding accuracy AI vs human, transcription revenue, coding outsourcer headcount" },
      { name: "HR & Recruitment Process Outsourcing", risk: "High", timeline: "2-4 years",
        thesis: "AI screening resumes, scheduling interviews, conducting initial assessments, generating offers. RPO model (outsourced recruiting headcount) faces compression as AI handles top-of-funnel. Specialized/executive recruiting less affected than volume hiring",
        winners: "AI recruiting platforms, conversational AI for screening, skills assessment tools",
        losers: "Volume recruiting RPO firms, resume screening services, basic staffing for white-collar roles",
        names: "AI-native: Paradox, HireVue, Eightfold AI. At risk: RPO for volume hiring, Robert Half, Hays. Adapting: LinkedIn AI features",
        metrics: "Watch: time-to-hire with AI, recruiter headcount per req, RPO revenue, AI screening adoption" },
      { name: "Translation & Localization Services", risk: "Very High", timeline: "1-3 years",
        thesis: "LLMs good enough for 80%+ of commercial translation. Human translators increasingly reviewers/editors. $50B+ localization industry being restructured. Real-time translation and dubbing emerging. Literary/nuanced creative still human but small fraction of volume",
        winners: "AI translation platforms, real-time translation/dubbing, AI-first localization vendors",
        losers: "Traditional translation agencies, freelance translator marketplaces, per-word pricing models",
        names: "Disrupting: DeepL, Google Translate, OpenAI/Claude (multilingual). At risk: TransPerfect, Lionbridge, RWS. Adapting: Smartling, Lokalise. Emerging: HeyGen (dubbing), ElevenLabs",
        metrics: "Watch: human translator utilization, per-word pricing trends, MT quality scores, localization agency revenue per linguist" },
    ],
  },
  {
    key: "healthcare", label: "Healthcare IT", icon: "H", color: "#8B5CF6",
    subsectors: [
      { name: "Clinical Documentation & Coding", risk: "High (Positive Disruption)", timeline: "1-3 years",
        thesis: "Ambient AI scribes among fastest-adopted AI in healthcare — 93% of health systems projecting moderate-to-deep adoption. Reduces physician burnout, improves documentation. Medical coding highly automatable. CRITICAL CAVEAT: Epic launched AI Charting in Feb 2026, entering the ambient scribe market natively. Epic controls 38%+ of US hospitals. If Epic builds ambient AI natively into the EHR, standalone scribe vendors (Abridge at $5.3B valuation, Suki, Nabla) face the same platform-absorbs-feature risk as standalone AppSec tools face from Cursor/Copilot. Abridge has deep health system relationships (Mayo, Kaiser, MSK) but Epic's distribution advantage is existential. This is the biggest open question in healthcare AI",
        winners: "Epic (if AI Charting succeeds — platform distribution unmatched), EHR vendors embedding AI documentation natively. Near-term: Abridge ($5.3B, $773M raised), Nuance/Microsoft (DAX — 150+ health system deployments)",
        losers: "Medical transcription services (dying now), offshore coding companies (dying now). Potentially at risk: standalone ambient scribe vendors if Epic AI Charting gains traction — same platform risk as Veracode vs Cursor",
        names: "Platform risk: Epic (AI Charting launched Feb 2026 — could be category killer). Near-term leaders: Abridge ($5.3B valuation), Nuance/Microsoft (DAX). At risk from Epic: Suki, Nabla, smaller scribes. Already disrupted: transcription/coding outsourcers",
        metrics: "Watch: Epic AI Charting pilot adoption, Abridge retention in Epic hospitals, DAX vs Epic native head-to-head, ambient AI adoption rates, coding accuracy AI vs human" },
      { name: "EHR & Clinical Systems", risk: "Low-Medium (Positive)", timeline: "3-5 years",
        thesis: "EHRs are system of record — AI enhances, doesn't displace. AI features (CDS, order suggestions, inbox management, patient messaging) become embedded value-adds increasing stickiness and pricing power. Epic dominance means it sets pace for AI in clinical workflows",
        winners: "Dominant EHR vendors embedding AI; specialty EHRs adding AI for niche workflows",
        losers: "EHR vendors that can't invest in AI; standalone CDS tools absorbed by EHR AI",
        names: "Well-positioned: Epic (dominant, AI partnerships), Oracle Health (Cerner + Oracle AI). Adapting: AthenaHealth, PointClickCare. At risk: small EHRs without AI roadmap",
        metrics: "Watch: AI feature adoption in EHRs, physician satisfaction with AI, EHR AI premium tiers, standalone CDS displacement" },
      { name: "Revenue Cycle Management", risk: "Medium-High", timeline: "2-4 years",
        thesis: "AI automates prior auth, claims scrubbing, denial management, payment posting — employing hundreds of thousands. Economic incentive massive ($3T+ annual claims). But payer-provider interactions complex and regulatory",
        winners: "AI-powered RCM platforms automating prior auth and denials",
        losers: "RCM outsourcers relying on manual labor, traditional clearinghouses without AI",
        names: "Adapting: R1 RCM, Waystar, Ensemble Health Partners, FinThrive, Availity, Change Healthcare (UHG). AI-native: Akasa, Cedar. At risk: labor-heavy RCM outsourcers",
        metrics: "Watch: clean claim rates, days in AR, prior auth turnaround, RCM headcount per provider" },
      { name: "Claims & Payment Integrity", risk: "Medium (Positive)", timeline: "2-4 years",
        thesis: "AI improves fraud detection, waste identification, payment accuracy across $3T+ claims ecosystem. More data analyzed = more savings found (Jevons'). Positive for analytics platforms — value proposition strengthens as AI finds patterns humans miss",
        winners: "Payment integrity platforms with AI/ML; fraud detection vendors",
        losers: "Manual audit firms, rule-based-only claims review, payment integrity without AI",
        names: "Benefiting: Cotiviti (leader), Enlyte (auto/workers' comp), Gainwell Technologies. At risk: manual audit-only firms",
        metrics: "Watch: savings per claim dollar reviewed, AI vs rule-based detection, false positives, payment integrity revenue growth" },
      { name: "Medical Imaging & Radiology", risk: "Medium (Positive Disruption)", timeline: "3-7 years",
        thesis: "AI reading X-rays, CTs, MRIs, pathology with increasing accuracy. Not replacing radiologists near-term but augmenting — AI as second reader catching missed findings, prioritizing critical cases. FDA approval is gating factor",
        winners: "FDA-cleared AI imaging platforms; radiology workflow tools with AI triage",
        losers: "Radiology groups resisting AI; teleradiology where AI handles easy reads",
        names: "AI-native: Aidoc, Viz.ai (stroke), PathAI, Paige (cancer). Adapting: GE HealthCare, Siemens Healthineers, Philips. FDA clearances accelerating",
        metrics: "Watch: FDA AI/ML clearances, AI diagnostic accuracy vs radiologist, turnaround time, radiologist productivity" },
      { name: "Clinical Decision Support & Diagnostics", risk: "Medium (Positive)", timeline: "3-5 years",
        thesis: "AI at point of care for diagnosis assistance, treatment recommendations, drug interactions, care protocols. Enhances physician decisions without replacing. Regulatory and liability concerns slow adoption. Biggest impact in primary care and emergency",
        winners: "CDS embedded in EHR workflows; AI diagnostic tools with clinical validation",
        losers: "Basic rule-based CDS; standalone reference tools AI copilots replace",
        names: "Emerging: Google Health (Med-PaLM), Microsoft/Nuance CDS, UpToDate (Wolters Kluwer) adding AI. EHR-embedded: Epic CDS, Oracle Health",
        metrics: "Watch: CDS alert override rates (lower = more trusted), diagnostic accuracy with AI, clinical outcomes, physician adoption" },
      { name: "Population Health & Care Management", risk: "Medium (Positive)", timeline: "2-4 years",
        thesis: "AI improves risk stratification, care gap identification, chronic disease management at population scale. Enables proactive vs reactive care. Positive for platforms identifying high-risk patients — value-based care rewards this",
        winners: "Population health with AI risk stratification; care management with predictive analytics",
        losers: "Manual care coordination; basic claims-data-only analytics without AI",
        names: "Benefiting: WellSky, Cotiviti (risk adjustment). Adapting: Epic (Healthy Planet), Optum. Emerging: AI-native care management",
        metrics: "Watch: risk score accuracy, care gap closure rates, readmission rates with AI, PMPM cost in value-based contracts" },
      { name: "Telehealth & Virtual Care", risk: "Medium", timeline: "2-5 years",
        thesis: "AI triage and AI-first visits for simple conditions could reduce need for clinicians in low-acuity encounters. Regulatory/licensing/liability slow AI-autonomous care. Near-term: AI assists humans. Long-term: AI handles simple consults end-to-end",
        winners: "Telehealth embedding AI for triage and augmentation; AI symptom checkers with clinical validation",
        losers: "Basic video-only telehealth without AI; nurse triage for simple questions",
        names: "Adapting: Teladoc, Amwell (AI triage). Emerging: K Health (AI-first primary care). At risk: commodity telehealth for simple conditions",
        metrics: "Watch: AI triage accuracy, visit duration with AI, patient satisfaction, cost per virtual encounter" },
      { name: "Drug Discovery & Life Sciences", risk: "Medium (Positive Disruption)", timeline: "3-7 years",
        thesis: "AI accelerating target identification, molecular design, trial optimization. Compresses timelines, improves success rates. AlphaFold breakthroughs real. Still subject to biology, regulation, trial requirements AI can't shortcut",
        winners: "AI drug discovery platforms, CROs embedding AI in trial design",
        losers: "Traditional discovery CROs without AI, purely empirical screening",
        names: "AI-native: Recursion, Insilico Medicine, Isomorphic Labs. Adapting: Schrodinger, IQVIA, Veeva. All major pharma investing",
        metrics: "Watch: IND timelines, trial success rates with AI molecules, AI targets entering trials" },
    ],
  },
  {
    key: "internet", label: "Internet & Digital", icon: "I", color: "#F59E0B",
    subsectors: [
      { name: "Search & Information Retrieval", risk: "Very High", timeline: "1-3 years",
        thesis: "AI answers (Perplexity, ChatGPT, Google AI Overviews) fundamentally changing information discovery. Traditional search disrupted. Google challenged first time in 20 years. Search traffic declining for informational queries, threatening SEO/content/ad ecosystem",
        winners: "AI-native search (Perplexity, ChatGPT), Google (if AI Overviews succeed), proprietary data moats",
        losers: "SEO-dependent publishers, content farms, comparison/review sites, Google organic traffic dependents",
        names: "Under pressure: Yelp, TripAdvisor, publishers, Internet Brands. Adapting: Google. Disrupting: Perplexity, OpenAI, Anthropic",
        metrics: "Watch: Google query volumes, CTR on AI Overviews vs organic, Perplexity usage, publisher traffic from search" },
      { name: "Digital Advertising", risk: "Medium", timeline: "2-4 years",
        thesis: "AI transforming creative, targeting, optimization. Makes ads more efficient but reduces agency/ad-tech complexity. Meta/Google AI products showing strong ROI. Walled gardens get stronger with AI data advantages",
        winners: "Platform duopoly (Google, Meta) with data + AI; AI creative tools",
        losers: "Mid-tier agencies, manual campaign management, complex stacks simplified by AI",
        names: "Strengthening: Meta (Advantage+), Google (Pmax), Amazon Ads. At risk: The Trade Desk, Liftoff Mobile, smaller networks. Emerging: AI creative tools",
        metrics: "Watch: ROAS AI vs manual, agency revenue per client, programmatic CPMs, AI creative adoption" },
      { name: "E-Commerce & Marketplace", risk: "Low-Medium", timeline: "3-5 years",
        thesis: "AI improves personalization, discovery, virtual try-on, shopping assistants, dynamic pricing. Infrastructure not disrupted — AI enhances. Could AI shopping agents disintermediate traditional UX?",
        winners: "Platforms embedding AI into discovery/conversion; AI shopping agent companies",
        losers: "Sites with poor personalization; basic product listings; multi-channel tools AI simplifies",
        names: "Well-positioned: Amazon (Rufus), Shopify (Sidekick), Instacart. Adapting: CommerceHub (Rithum). Emerging: AI shopping agents",
        metrics: "Watch: conversion improvements from AI, AI assistant usage, AOV with personalization" },
      { name: "Website Hosting & Online Presence", risk: "Medium-High", timeline: "1-3 years",
        thesis: "AI website builders generate full sites from a prompt. Reduces need for manual design and potentially hosting management. Value shifts from infrastructure to AI-generated presence. SMBs who needed agencies can self-serve",
        winners: "Hosting/website platforms embedding AI builders; AI-first creation tools",
        losers: "Basic hosting without AI; SMB website design agencies; template builders without AI",
        names: "Adapting: GoDaddy (Airo AI), Newfold Digital, Constant Contact (AI email/web). At risk: basic hosting, SMB web agencies. AI-native: Wix AI, Durable, 10Web",
        metrics: "Watch: AI website creation adoption, SMB agency spend, hosting ARPU, time-to-launch" },
      { name: "Consumer Security & Identity Protection", risk: "Medium", timeline: "2-4 years",
        thesis: "AI-generated scams (deepfake voice, phishing, social engineering) more convincing and voluminous. Net positive for consumer security — more threats = more demand. But basic AV commoditized by OS-native (Defender). Value shifting to identity protection and scam detection",
        winners: "Consumer security pivoting to AI scam detection and identity protection",
        losers: "Basic AV-only commoditized by free OS protection; vendors without AI scam detection",
        names: "Adapting: Gen Digital (Norton/LifeLock/Avast), McAfee Consumer. Threat: Microsoft Defender (free). Emerging: AI identity protection, deepfake detection",
        metrics: "Watch: AI scam volume, consumer security subscriptions, identity theft rates, Defender adoption" },
      { name: "Social Media & Content Platforms", risk: "Medium", timeline: "2-5 years",
        thesis: "AI content flooding platforms creates moderation challenges and authenticity concerns. AI improves recommendation and personalization (positive for engagement). But synthetic content at scale potentially dilutes platform value",
        winners: "Platforms with strong network effects and AI recommendations; content moderation AI",
        losers: "Platforms vulnerable to AI spam/bots; UGC sites where AI content dilutes authenticity",
        names: "Strengthening: Meta (AI recommendations), TikTok, YouTube (AI tools). Moderation: Hive AI. Challenged: platforms without identity verification",
        metrics: "Watch: AI content as % of platform, engagement AI vs human content, moderation costs, bot rates" },
      { name: "Online Travel & Booking", risk: "Medium-High", timeline: "2-4 years",
        thesis: "AI travel agents plan complex trips via conversation, potentially disintermediating OTAs and metasearch. Users ask AI instead of searching across sites. Early innings but directionally threatening to aggregators",
        winners: "AI travel planning tools, platforms with direct supplier relationships",
        losers: "OTAs/metasearch relying on search traffic; travel content/review sites",
        names: "At risk: Booking/Expedia (if AI goes direct), TripAdvisor, travel content. Adapting: Booking (AI planner). Emerging: AI travel agents",
        metrics: "Watch: OTA traffic from search vs direct/AI, AI agent booking volume, OTA take rates" },
      { name: "Fintech & Digital Financial Services", risk: "Medium (Positive)", timeline: "2-5 years",
        thesis: "AI improves underwriting, fraud detection, robo-advisory, customer service. Net positive for platforms with data advantages. Regulatory scrutiny on AI in lending/insurance is a constraint",
        winners: "Fintech with large data moats; AI fraud detection; AI-native underwriting",
        losers: "Manual underwriting; rule-based fraud detection; human-only advisory for simple cases",
        names: "Benefiting: Stripe (AI fraud), Plaid (data), Block. Insurance: AI underwriting. Wealth: Betterment, Wealthfront. At risk: manual insurance underwriting",
        metrics: "Watch: AI underwriting accuracy, fraud detection rates, robo AUM growth, AI lending defaults vs traditional" },
    ],
  },
  {
    key: "education", label: "Education", icon: "E", color: "#0EA5E9",
    subsectors: [
      { name: "Tutoring & Learning Support", risk: "Very High (Positive Disruption)", timeline: "1-3 years",
        thesis: "AI tutoring provides personalized 1:1 instruction at near-zero marginal cost. Most transformative AI in education. Traditional tutoring and test prep face existential threat. K-12 adoption slower due to screen time, equity, integrity concerns",
        winners: "AI tutoring platforms, adaptive learning companies",
        losers: "Human tutoring services, test prep companies, basic e-learning AI generates on the fly",
        names: "Winning: Khan Academy (Khanmigo), Duolingo (Max), Photomath. At risk: Chegg (devastated), Course Hero, Varsity Tutors, Princeton Review/Kaplan",
        metrics: "Watch: Chegg trends (canary), AI tutor engagement, learning outcomes, tutoring company revenue" },
      { name: "K-12 EdTech & Digital Curriculum", risk: "Medium", timeline: "2-5 years",
        thesis: "AI generates and personalizes curriculum, reducing dependence on static textbooks. Adaptive learning dramatically better with LLMs. But K-12 procurement slow, budget-constrained (ESSER cliff), requires teacher buy-in. Publishers face long-term structural threat",
        winners: "Adaptive learning embedding AI; LMS (Canvas/Instructure) as distribution; AI content tools for teachers",
        losers: "Traditional textbook publishers if AI curriculum gains acceptance; static content; basic practice platforms AI tutors replace",
        names: "Adapting: Instructure (Canvas), Renaissance Learning, Imagine Learning, McGraw Hill, HMH. At risk: static textbook models",
        metrics: "Watch: AI content adoption in classrooms, adaptive learning outcomes, publisher digital revenue, teacher AI tool usage" },
      { name: "Higher Ed Administration & Technology", risk: "Medium", timeline: "2-4 years",
        thesis: "AI improves enrollment management (predictive yield), retention (early warning), admin efficiency (chatbots), financial aid processing. Net positive for platforms embedding AI. Enrollment cliff (~15% decline starting 2025) increases urgency",
        winners: "Higher ed platforms with AI enrollment prediction and retention; AI student service chatbots",
        losers: "Manual enrollment consulting; universities slow to adopt losing students to tech-forward competitors",
        names: "Adapting: Ellucian (SIS + AI), EAB Global (enrollment analytics), Salesforce Education Cloud. At risk: manual enrollment consulting",
        metrics: "Watch: enrollment prediction accuracy, chatbot deflection in student services, retention rates with AI, admin cost per student" },
      { name: "Corporate Learning & Development", risk: "High", timeline: "1-3 years",
        thesis: "AI generates training content at fraction of cost/time. Personalized paths replace one-size-fits-all. AI assesses skills and recommends upskilling real-time. LMS platforms face disruption if they don't embed AI. Compliance training (non-discretionary) more protected",
        winners: "AI learning platforms with content generation and personalized paths; skills assessment AI",
        losers: "Static content libraries, expensive custom course dev, generic LMS without AI, L&D consulting creating manual content",
        names: "Adapting: Cornerstone OnDemand, Skillsoft, Docebo, LinkedIn Learning. At risk: static content, custom course firms. AI-native: Sana Labs, Degreed",
        metrics: "Watch: AI course adoption, time to create training, learner engagement AI vs static, L&D creation spend" },
      { name: "Assessment & Credentialing", risk: "Medium-High", timeline: "2-4 years",
        thesis: "AI challenges assessment: students cheat with AI (undermining methods) and AI generates/grades efficiently (enabling new approaches). Forces rethinking measurement. Proctoring demand up. Credentials shifting toward demonstrated skills vs test scores",
        winners: "AI assessment platforms, skills-based credentialing, AI proctoring",
        losers: "Traditional test formats vulnerable to AI cheating, homework help sites",
        names: "Adapting: ETS, NWEA, Turnitin (AI detection), Ascend Learning. At risk: Chegg, Course Hero. Emerging: skills credentialing, AI proctoring",
        metrics: "Watch: AI detection adoption, test-optional movement, employer acceptance of AI-era credentials, proctoring revenue" },
      { name: "Online Learning Platforms (OPM/MOOC)", risk: "High", timeline: "2-4 years",
        thesis: "AI courses compete with human-taught at fraction of cost. OPM revenue-share model (40-60% of tuition) already under DOE scrutiny — AI makes university insourcing argument stronger. AI tutoring reduces need for instructor-led foundational courses. But credentials and brand still matter",
        winners: "Platforms leveraging AI for outcomes and cost reduction; micro-credential leaders",
        losers: "OPMs dependent on expensive enrollment marketing; commodity courses AI teaches better",
        names: "At risk: 2U/edX (OPM challenged), high-cost bootcamps. Adapting: Coursera, Udemy, Pluralsight (Vista). Emerging: AI-first learning platforms",
        metrics: "Watch: OPM revenue share trends, AI course completion vs instructor-led, cost per student acquisition, credential value" },
      { name: "Early Childhood & Childcare", risk: "Low", timeline: "5+ years",
        thesis: "Physical care, safety, social development for young children are inherently human. AI impact primarily on back-office (enrollment, billing, parent communication, scheduling). Business model is labor and facility constrained, not technology constrained",
        winners: "Childcare management software embedding AI for operations; platforms reducing admin burden",
        losers: "Very limited AI disruption risk in this segment",
        names: "Largely insulated: Bright Horizons, KinderCare, Learning Care Group, Spring Education. Back-office: Procare, HiMama",
        metrics: "Watch: admin cost per child, enrollment management efficiency, staff scheduling optimization" },
    ],
  },
]



const TOP_DISRUPTED = [
  { name: "IT Staffing & Staff Augmentation", sector: "IT Services", risk: "Very High" },
  { name: "Data Entry & Document Processing BPO", sector: "Tech-Enabled Services & BPO", risk: "Very High" },
  { name: "Medical Coding & Transcription", sector: "Tech-Enabled Services & BPO", risk: "Very High" },
  { name: "Translation & Localization Services", sector: "Tech-Enabled Services & BPO", risk: "Very High" },
  { name: "Legal Tech & E-Discovery", sector: "Software", risk: "High" },
];

const TOP_BENEFITED = [
  { name: "Data Infrastructure & Databases", sector: "Software", risk: "Low (Positive)" },
  { name: "Cybersecurity Software", sector: "Software", risk: "Medium (Positive)" },
  { name: "IT Operations & Service Management", sector: "Software", risk: "Medium-High (Positive for platforms)" },
  { name: "BI & Analytics Software", sector: "Software", risk: "High (Positive Disruption)" },
  { name: "Email & Endpoint Security", sector: "Software", risk: "Medium (Positive)" },
];

const TOP_DISRUPTED_CO = [
  { name: "Virtusa", reason: "Pure offshore body shop selling developer headcount with no sector specialization. AI makes each dev 2-3x productive, directly compressing demand. No proprietary data, no switching costs, no regulatory moat. Weakest moat profile in portfolio (wt: 15/45)", sector: "IT Services" },
  { name: "UST Global", reason: "Offshore IT services with per-FTE billing. Same structural exposure as Virtusa - commodity labor with no defensible moats. App dev, testing, and maintenance all face AI-driven compression (wt: 15/45)", sector: "IT Services" },
  { name: "Liftoff Mobile", reason: "Smaller ad network competing against AI-powered walled gardens (Meta Advantage+, Google PMax). AI targeting advantages accrue to platforms with the most data. No moats of any kind (wt: 9/45)", sector: "AdTech" },
  { name: "Skillsoft", reason: "Melting ice cube. Static L&D content library with only 0.99% LMS market share (vs Cornerstone at 2.24%). FY2026 TDS revenue guided at $400-410M — declining. AI generates personalized training content at a fraction of cost, making static content libraries obsolete. No proprietary data (content is generic, not originated), no meaningful switching costs (easy to cancel), elastic demand (L&D budgets are discretionary and first cut). CAISY AI coach (1M+ launches) is too little too late — the core business model of selling pre-built content libraries is structurally broken when AI creates equivalent content on demand. Compliance training offers some regulatory protection but is small fraction of revenue (wt: 12/45)", sector: "Education" },
  { name: "ZoomInfo", reason: "Structural decline in progress — 2026 revenue guided at just 1% YoY growth ($1.25-1.27B). Q1 2025 revenue was down 1% YoY. Sales data enrichment being commoditized as AI tools (Clay, Apollo, LLMs) scrape, synthesize, and enrich contact data from public sources. ZoomInfo's data is aggregated, not truly originated — AI can replicate much of it. Low switching costs (easy to cancel), CRM AI features (Salesforce Agentforce at $500M+ ARR) absorbing standalone data products. Demand is elastic — ZoomInfo seats are first cut when budgets tighten. AI Copilot renewals showing only mid-to-high single-digit uplifts, insufficient to offset core decline (wt: 14/45)", sector: "Software" },
  { name: "Xerox", reason: "Document processing and print services in secular decline. AI automates document workflows via OCR + LLMs. Brand recognition (2) is the only meaningful moat but insufficient against structural business model decline (wt: 13/45)", sector: "BPO / Document" },
  { name: "Perficient", reason: "Generic digital consultancy selling implementation hours with no sector specialization. AI accelerates delivery - fewer billable hours per project. No proprietary data, no regulatory moat, no switching costs (wt: 15/45)", sector: "IT Consulting" },
  { name: "Kofax", reason: "Rules-based intelligent automation being leapfrogged by GenAI. LLMs handle unstructured tasks that Kofax's architecture cannot. No switching costs, no data moat, no ecosystem lock-in (wt: 11/45)", sector: "Software" },
  { name: "Idera", reason: "PE roll-up of aging dev tool point solutions being directly replaced by AI. Visual Assist (C++ productivity) made obsolete by Copilot/Cursor. Delphi ecosystem is declining regardless of AI. Sencha UI components AI generates on demand. No moat of any kind across the portfolio (wt: 15/45)", sector: "Software" },
  { name: "Veracode", reason: "Melting ice cube. Near-term ACV growth from AI code insecurity is misleading — AI coding platforms (Cursor, Copilot, Windsurf) are embedding security scanning directly into the IDE workflow, displacing standalone scan-fix cycles entirely. AI labs have every incentive to ship secure code by default. The same AI insecurity driving today's demand will be solved by the platforms themselves, not by a separate scanning vendor. Standalone AppSec is being absorbed into the development workflow (wt: 25/45)", sector: "Software" },
];

const TOP_BENEFITED_CO = [
  { name: "CrowdStrike", reason: "AI expands attack surface and threat sophistication - directly increasing demand. Massive proprietary threat telemetry (3) is a genuine data moat that strengthens with AI. Deep ecosystem (3), top-tier brand (3). AI is TAM expansion, not disruption (wt: 28/45)", sector: "Cybersecurity" },
  { name: "CCC Intelligent Solutions", reason: "20+ years of proprietary claims/repair data (3) that AI makes more valuable, not less. AI auto estimation expanding TAM. Deep insurer-body shop-OEM ecosystem (3) with high switching costs (3). AI is an upsell, not a threat (wt: 26/45)", sector: "Insurance Tech" },
  { name: "Cotiviti", reason: "Proprietary payment integrity patterns (3) across $3T+ claims. AI finds more waste/fraud = more value per dollar reviewed. Strongest moat profile in healthcare IT - regulatory (3), security (3), switching (3), contracts (3). Jevons' beneficiary (wt: 33/45)", sector: "Healthcare IT" },
  { name: "Proofpoint", reason: "AI-generated phishing directly increases demand for AI-powered email security. Proprietary threat telemetry (3), deep ecosystem integration (3), security IS the product (3). Business model is the solution to the AI threat problem (wt: 26/45)", sector: "Cybersecurity" },
  { name: "Sophos", reason: "MDR and endpoint security benefit from AI-driven threat escalation. Broad SMB telemetry (3) is a data moat. Security (3) requirement increases as AI-powered attacks grow. More threats = more demand (wt: 23/45)", sector: "Cybersecurity" },
  { name: "Elastic NV", reason: "AI's clearest infrastructure beneficiary in the portfolio. Vector database for RAG (2,700+ AI customers), more AI = more logs/telemetry to search. ELK stack deeply embedded as industry standard (ecosystem 3). 18% YoY growth with AI as primary driver. Infrastructure layer AI builds on, not replaces (wt: 31/45)", sector: "Data Infrastructure" },
  { name: "Synechron", reason: "Near-term AI beneficiary - financial services spending aggressively on AI implementation and need trusted partners with regulatory knowledge. FS domain expertise (regulatory 2, security 2) creates moats commodity IT firms lack. Margin compression is real long-term but demand tailwind is strong now (wt: 25/45)", sector: "IT Services" },
  { name: "Precisely", reason: "AI is only as good as data quality - garbage in, garbage out. Every enterprise AI initiative starts with data integrity. Deep ecosystem integration (3) as data quality backbone. AI increases demand for clean data (wt: 22/45)", sector: "Data Infrastructure" },
  { name: "Darktrace", reason: "AI-native threat detection built on proprietary unsupervised ML data (3). Growing attack surface from AI-powered threats directly expands addressable market. Security (3) is core to product (wt: 23/45)", sector: "Cybersecurity" },
  { name: "Infoblox", reason: "DNS/DDI infrastructure — picks-and-shovels layer that benefits from AI expansion. More AI applications = more DNS queries to manage and secure. AI-powered attacks (DGA, DNS tunneling, data exfiltration) directly increase demand for DNS-layer security. Proprietary DNS threat intelligence (2), extreme switching costs (3) (ripping out DDI is a network-down event), regulatory compliance for DNS logging (3), security IS the product (3), deep infrastructure embedding (3). One of the highest moat profiles in the portfolio (wt: 38/45)", sector: "Cybersecurity" },
];

// Legacy hardcoded moat data - kept as reference only. Live data reads from Supabase.
const _MOAT_GROUPS_LEGACY = [
  { key: "software", label: "Software", icon: "S", color: "#3B82F6", companies: [
    { name: "Adeia", scores: [2,1,1,2,1,2,1,1,1] },
    { name: "Applied Systems", scores: [2,3,3,2,2,2,2,1,1] },
    { name: "Avalara", scores: [2,3,2,3,2,2,2,1,1] },
    { name: "Barracuda Networks", scores: [1,2,2,2,3,2,1,1,1] },
    { name: "BMC Software", scores: [1,2,3,1,2,2,2,1,2] },
    { name: "Calabrio", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "CDK Global", scores: [3,3,3,2,2,2,2,1,1] },
    { name: "Citrix (Cloud Software Group)", scores: [1,2,3,2,2,2,2,1,2] },
    { name: "Cloudera", scores: [1,2,2,1,2,2,1,1,2] },
    { name: "CoAdvantage", scores: [2,2,2,3,2,2,1,1,1] },
    { name: "Cohesity", scores: [1,2,2,2,3,2,2,1,3] },
    { name: "Confluence Technologies", scores: [2,2,2,3,2,2,1,1,1] },
    { name: "Conga", scores: [1,2,1,1,1,1,1,1,1] },
    { name: "ConnectWise", scores: [2,3,3,1,2,2,2,1,1] },
    { name: "Conservice", scores: [2,2,3,2,1,2,1,1,1] },
    { name: "Constant Contact", scores: [1,1,1,1,1,1,2,1,1] },
    { name: "Corel (Alludo)", scores: [1,1,1,1,1,1,2,1,1] },
    { name: "Cornerstone OnDemand", scores: [2,2,2,1,2,2,2,1,1] },
    { name: "CrowdStrike", scores: [3,3,2,2,3,2,3,1,1] },
    { name: "Cvent", scores: [1,2,1,1,1,1,2,1,1] },
    { name: "Darktrace", scores: [3,2,2,2,3,2,2,1,1] },
    { name: "Datasite", scores: [2,2,2,3,3,2,2,1,1] },
    { name: "Dayforce", scores: [2,3,3,3,3,2,2,1,1] },
    { name: "Duck Creek Technologies", scores: [2,3,3,3,2,2,2,1,1] },
    { name: "Dye & Durham", scores: [3,2,3,3,2,2,1,1,1] },
    { name: "ECI Software Solutions", scores: [2,2,3,1,1,2,1,1,1] },
    { name: "Elastic NV", scores: [2,2,2,3,2,2,2,1,3] },
    { name: "Electronics For Imaging", scores: [1,2,2,1,1,1,1,1,1] },
    { name: "Epicor Software", scores: [2,2,3,1,1,2,2,1,1] },
    { name: "EverCommerce", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "Finastra", scores: [2,3,3,3,3,3,2,1,1] },
    { name: "Fortra", scores: [2,2,2,2,3,2,1,1,1] },
    { name: "Gen Digital", scores: [1,1,1,1,3,1,3,1,1] },
    { name: "Idera", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "Infoblox", scores: [2,3,3,2,3,2,2,1,3] },
    { name: "isolved", scores: [2,2,3,3,2,2,1,1,1] },
    { name: "Ivanti", scores: [1,2,2,2,2,2,1,1,1] },
    { name: "Jaggaer", scores: [2,3,3,2,2,2,1,1,1] },
    { name: "JD Power", scores: [3,2,2,1,1,2,3,1,1] },
    { name: "Kaseya", scores: [2,3,3,1,2,2,2,1,1] },
    { name: "KnowBe4", scores: [2,2,1,2,3,2,2,1,1] },
    { name: "Kofax", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "LogMeIn", scores: [1,1,1,1,2,1,2,1,1] },
    { name: "McAfee Consumer", scores: [1,1,1,1,3,1,3,1,1] },
    { name: "McAfee Enterprise", scores: [2,2,2,2,3,2,2,1,1] },
    { name: "Motus", scores: [2,2,2,2,1,2,1,1,1] },
    { name: "N-able", scores: [1,2,2,1,2,2,1,1,1] },
    { name: "NCR Voyix", scores: [2,2,2,1,2,2,2,1,1] },
    { name: "Omnissa (EUC)", scores: [1,2,3,2,2,2,2,1,2] },
    { name: "OpenText", scores: [2,3,3,2,2,2,2,1,1] },
    { name: "Perforce", scores: [1,2,3,1,1,2,2,1,1] },
    { name: "Ping Identity", scores: [2,3,3,3,3,2,2,1,1] },
    { name: "Planview", scores: [2,2,2,1,1,2,1,1,1] },
    { name: "Precisely", scores: [2,3,2,2,2,2,2,1,2] },
    { name: "Proofpoint", scores: [3,3,2,2,3,2,2,1,1] },
    { name: "PTC", scores: [2,3,3,2,2,2,2,1,1] },
    { name: "Qlik", scores: [1,2,2,1,2,2,2,1,1] },
    { name: "Qualtrics", scores: [3,2,2,1,2,2,2,1,1] },
    { name: "Quest Software", scores: [1,2,2,1,1,2,1,1,1] },
    { name: "RealPage", scores: [3,3,3,2,2,2,2,1,1] },
    { name: "Relativity", scores: [2,3,3,3,3,2,3,1,1] },
    { name: "Rocket Software", scores: [1,2,3,2,2,2,1,1,2] },
    { name: "SmartBear", scores: [1,2,1,1,1,1,2,1,1] },
    { name: "Software AG", scores: [1,2,2,1,1,2,1,1,1] },
    { name: "SolarWinds", scores: [1,2,2,1,2,2,1,1,1] },
    { name: "SonarSource", scores: [2,2,2,1,2,2,2,1,1] },
    { name: "SonicWall", scores: [1,2,2,2,3,2,1,1,1] },
    { name: "Sophos", scores: [3,2,2,2,3,2,2,1,1] },
    { name: "Sovos Compliance", scores: [2,3,2,3,2,2,1,1,1] },
    { name: "SS&C Technologies", scores: [2,3,3,3,3,3,2,1,1] },
    { name: "Storable", scores: [2,3,3,1,1,2,2,1,1] },
    { name: "SUSE", scores: [1,3,3,2,2,2,2,1,3] },
    { name: "Taxwell", scores: [1,2,2,3,1,1,1,1,1] },
    { name: "Tenable", scores: [3,2,2,2,3,2,2,1,1] },
    { name: "TriNet Group", scores: [2,2,2,3,2,2,2,1,1] },
    { name: "Veracode", scores: [1,1,2,1,3,2,2,1,1] },
    { name: "WatchGuard Technologies", scores: [1,2,2,2,3,2,1,1,1] },
    { name: "ZoomInfo", scores: [1,1,1,1,1,1,2,1,1] },
    { name: "Zuora", scores: [2,2,2,1,1,2,1,1,1] },
    { name: "Zywave", scores: [2,2,2,2,1,2,1,1,1] },
    { name: "Caliper (Sympler)", scores: [1,2,2,2,2,2,1,1,1] },
  ]},
  { key: "healthcare", label: "Healthcare IT", icon: "H", color: "#8B5CF6", companies: [
    { name: "AthenaHealth", scores: [2,3,3,3,3,2,2,1,1] },
    { name: "CCC Intelligent Solutions", scores: [3,3,3,2,2,2,2,1,1] },
    { name: "Cotiviti", scores: [3,3,3,3,3,3,2,1,1] },
    { name: "Enlyte", scores: [3,3,3,3,2,2,1,1,1] },
    { name: "Ensemble Health Partners", scores: [2,3,2,3,3,2,1,1,1] },
    { name: "FinThrive", scores: [2,2,2,3,3,2,1,1,1] },
    { name: "Gainwell Technologies", scores: [3,3,3,3,3,3,1,1,1] },
    { name: "Imprivata", scores: [2,3,3,3,3,2,2,1,1] },
    { name: "PointClickCare", scores: [3,2,3,3,3,2,2,1,1] },
    { name: "R1 RCM", scores: [2,3,2,3,3,2,2,1,1] },
    { name: "Solera", scores: [3,3,3,2,2,2,2,1,1] },
    { name: "Waystar", scores: [2,3,2,3,3,2,2,1,1] },
    { name: "WellSky", scores: [2,3,3,3,3,2,2,1,1] },
  ]},
  { key: "itservices", label: "IT Services", icon: "IT", color: "#10B981", companies: [
    { name: "Ahead DB", scores: [1,2,2,1,2,2,1,1,2] },
    { name: "Ensono", scores: [1,2,2,1,2,2,1,1,2] },
    { name: "Insight Enterprises", scores: [1,2,1,1,1,2,1,1,2] },
    { name: "Optiv Security", scores: [1,2,2,2,3,2,2,1,1] },
    { name: "Perficient", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "Presidio", scores: [1,2,2,1,2,2,1,1,2] },
    { name: "Rackspace Technology", scores: [1,2,2,1,2,2,1,2,2] },
    { name: "Synechron", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "Thoughtworks", scores: [1,1,1,1,1,1,2,1,1] },
    { name: "Trace3", scores: [1,2,2,1,2,2,1,1,2] },
    { name: "UST Global", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "Virtusa", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "World Wide Technology", scores: [1,2,2,1,2,2,2,2,3] },
    { name: "Xerox", scores: [1,1,2,1,1,1,2,1,1] },
  ]},
  { key: "education", label: "Education", icon: "E", color: "#0EA5E9", companies: [
    { name: "Adtalem Global Education", scores: [1,2,2,3,2,2,2,2,1] },
    { name: "Ascend Learning", scores: [2,2,2,3,2,2,2,1,1] },
    { name: "Bright Horizons", scores: [1,1,2,3,2,2,3,3,1] },
    { name: "Cengage", scores: [2,2,2,2,1,2,2,1,1] },
    { name: "Colibri Group", scores: [1,2,2,3,1,2,1,1,1] },
    { name: "Cornerstone OnDemand", scores: [2,2,2,1,2,2,2,1,1] },
    { name: "EAB Global", scores: [3,2,2,2,2,2,2,1,1] },
    { name: "Ellucian", scores: [2,3,3,2,2,2,2,1,1] },
    { name: "Fullbloom", scores: [1,2,2,3,1,2,1,1,1] },
    { name: "Houghton Mifflin Harcourt", scores: [2,2,3,2,1,2,2,1,1] },
    { name: "Imagine Learning", scores: [2,2,2,2,1,2,1,1,1] },
    { name: "Instructure", scores: [2,3,3,2,2,2,2,1,1] },
    { name: "KinderCare", scores: [1,1,2,3,2,2,2,3,1] },
    { name: "Learning Care Group", scores: [1,1,2,3,2,2,2,3,1] },
    { name: "McGraw Hill", scores: [2,2,3,2,1,2,3,1,1] },
    { name: "Renaissance Learning", scores: [3,2,2,2,2,2,2,1,1] },
    { name: "Skillsoft", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "Spring Education", scores: [1,1,2,3,2,2,2,3,1] },
  ]},
  { key: "internet", label: "Internet & Digital", icon: "I", color: "#F59E0B", companies: [
    { name: "CommerceHub (Rithum)", scores: [2,3,2,1,1,2,1,1,1] },
    { name: "GoDaddy", scores: [1,2,2,1,2,1,3,1,2] },
    { name: "Internet Brands", scores: [2,1,2,1,1,1,2,1,1] },
    { name: "Liftoff Mobile", scores: [1,1,1,1,1,1,1,1,1] },
    { name: "Match Group", scores: [3,1,1,1,2,1,3,1,1] },
    { name: "Newfold Digital", scores: [1,1,2,1,1,1,2,1,2] },
    { name: "Snap Inc.", scores: [3,1,1,1,2,1,2,1,1] },
  ]},
  { key: "hardware", label: "Hardware & Infrastructure", icon: "HW", color: "#F97316", companies: [
    { name: "Allegro MicroSystems", scores: [2,2,2,1,1,1,1,3,1] },
    { name: "Altera", scores: [2,3,3,1,1,2,2,3,2] },
    { name: "Amkor Technology", scores: [1,2,2,1,1,2,1,3,2] },
    { name: "Applied Digital", scores: [1,1,1,1,2,1,1,3,2] },
    { name: "Celestica", scores: [1,2,2,1,1,2,1,3,1] },
    { name: "Cipher Digital", scores: [1,1,1,1,1,1,1,3,1] },
    { name: "Coherent", scores: [2,2,2,1,1,2,2,3,1] },
    { name: "CoreWeave", scores: [1,2,1,1,2,1,1,3,3] },
    { name: "Entegris", scores: [2,3,3,2,2,2,2,3,2] },
    { name: "Ingram Micro", scores: [2,3,3,1,1,2,2,3,3] },
    { name: "Kioxia", scores: [2,2,1,1,1,2,1,3,2] },
    { name: "MaxLinear", scores: [2,2,2,1,1,1,1,2,1] },
    { name: "MKS Instruments", scores: [2,3,3,1,1,2,2,3,2] },
    { name: "NCR Atleos", scores: [2,3,3,3,3,3,2,3,3] },
    { name: "On Semiconductor", scores: [2,2,2,2,1,2,2,3,1] },
    { name: "Seagate Technology", scores: [1,2,1,1,1,2,2,3,2] },
    { name: "Sensata Technologies", scores: [2,2,2,2,1,2,1,3,1] },
    { name: "Synaptics", scores: [2,2,1,1,1,1,1,2,1] },
    { name: "TeraWulf", scores: [1,1,1,1,1,1,1,3,1] },
    { name: "Tract Capital (Nvidia)", scores: [1,1,1,1,1,1,1,3,3] },
    { name: "TTM Technologies", scores: [1,2,1,2,2,2,1,3,1] },
    { name: "Ultra Clean Holdings", scores: [1,2,2,1,1,1,1,3,1] },
    { name: "Zebra Technologies", scores: [2,3,2,1,1,2,3,3,2] },
  ]},
];

// Weighted moat tiers: T1=3x, T2=2x, T3=1x. Max weighted = 45
const MOAT_DEFS = [
  { key: "data", label: "Proprietary Data", tier: 1, weight: 3 },
  { key: "switching", label: "Switching Cost", tier: 1, weight: 3 },
  { key: "regulatory", label: "Regulatory & Compliance", tier: 2, weight: 2 },
  { key: "ecosystem", label: "Ecosystem & Integration", tier: 2, weight: 2 },
  { key: "security", label: "Security", tier: 2, weight: 2 },
  { key: "contracts", label: "Long-term Contracts", tier: 3, weight: 1 },
  { key: "brand", label: "Brand & Trust", tier: 3, weight: 1 },
  { key: "infra", label: "Infrastructure Support", tier: 3, weight: 1 },
];
const MOAT_KEYS = MOAT_DEFS.map(d => d.key);
const MOAT_MAX = 45; // 2*3*3 + 3*2*3 + 3*1*3

// Map DB sector to moat group
const SECTOR_TO_GROUP = {
  software: { key: "software", label: "Software", icon: "S", color: "#3B82F6" },
  healthcare: { key: "healthcare", label: "Healthcare IT", icon: "H", color: "#8B5CF6" },
  itservices: { key: "itservices", label: "IT Services", icon: "IT", color: "#10B981" },
  education: { key: "education", label: "Education", icon: "E", color: "#0EA5E9" },
  internet: { key: "internet", label: "Internet & Digital", icon: "I", color: "#F59E0B" },
  hardware: { key: "hardware", label: "Hardware & Infrastructure", icon: "HW", color: "#F97316" },
  aidigital: { key: "hardware", label: "Hardware & Infrastructure", icon: "HW", color: "#F97316" },
};

function buildMoatGroups(companies) {
  if (!companies || !companies.length) return [];
  const groups = {};
  for (const co of companies) {
    if (!co.moats || co.sector === "sources") continue;
    const g = SECTOR_TO_GROUP[co.sector];
    if (!g || g.key === "hardware") continue; // exclude hardware & infrastructure
    if (!groups[g.key]) groups[g.key] = { ...g, companies: [] };
    const m = co.moats;
    groups[g.key].companies.push({
      name: co.name,
      scores: MOAT_KEYS.map(k => m[k] || 1),
    });
  }
  for (const g of Object.values(groups)) g.companies.sort((a, b) => a.name.localeCompare(b.name));
  const order = ["software", "healthcare", "itservices", "education", "internet"];
  return order.map(k => groups[k]).filter(Boolean);
}

function weightedTotal(scores) {
  return MOAT_DEFS.reduce((s, def, i) => s + (scores[i] || 1) * def.weight, 0);
}

export default function AIDisruption({ companies, initialTab }) {
  const [expanded, setExpanded] = useState({});
  const [subTab, setSubTab] = useState(initialTab || "disruption");
  useEffect(() => { if (initialTab) setSubTab(initialTab); }, [initialTab]);
  const [moatSort, setMoatSort] = useState({ key: "total", group: null });
  const dynamicMoatGroups = buildMoatGroups(companies);
  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const isExp = (key) => !!expanded[key];

  const riskColor = (risk) => {
    if (risk.includes("Very High")) return "#EF4444";
    if (risk.includes("High") && risk.includes("Positive")) return "#34d673";
    if (risk.includes("High")) return "#F97316";
    if (risk.includes("Medium") && risk.includes("Positive")) return "#34d673";
    if (risk.includes("Medium")) return "#F59E0B";
    if (risk.includes("Low") && risk.includes("Positive")) return "#34d673";
    if (risk.includes("Low")) return "#FBBF24";
    return T_.textDim;
  };

  return (
    <div style={{ flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: 1750, fontFamily: FONT }}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${T_.borderLight}` }}>
        {[{ key: "disruption", label: "Disruption Map" }, { key: "moats", label: "Moat vs AI" }, { key: "diffusion", label: "AI Diffusion" }, { key: "jevons", label: "Jevons' Paradox" }].map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)} style={{
            padding: "10px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer",
            border: "none", borderBottom: subTab === t.key ? `2px solid ${T_.accent}` : "2px solid transparent",
            background: "transparent", color: subTab === t.key ? T_.text : T_.textGhost,
            fontFamily: FONT, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ─── MOAT ANALYSIS TAB ─── */}
      {subTab === "moats" && (() => {
        const scoreLabel = ["", "Weak", "Med", "Strong"];
        const scoreBg = (v) => ["", "#EF444433", "#F59E0B33", "#34d67333"][v];
        const scoreColor = (v) => ["", "#EF4444", "#F59E0B", "#34d673"][v];
        const totalColor = (t) => t >= 33 ? "#34d673" : t >= 21 ? "#F59E0B" : "#EF4444";
        const tierColor = { 1: "#34d673", 2: "#F59E0B", 3: T_.textGhost };
        const colHeaders = [
          { key: "name", label: "Company" },
          ...MOAT_DEFS.map(d => ({ key: d.key, label: d.label, tier: d.tier, weight: d.weight })),
          { key: "total", label: "Score" },
        ];
        const colDef = "minmax(130px,1.5fr) repeat(8, minmax(46px,1fr)) minmax(58px,0.8fr)";
        const sortCo = (companies, gKey) => {
          const sk = moatSort.group === gKey ? moatSort.key : "total";
          return [...companies].sort((a, b) => {
            if (sk === "name") return a.name.localeCompare(b.name);
            if (sk === "total") return weightedTotal(b.scores) - weightedTotal(a.scores);
            const i = MOAT_KEYS.indexOf(sk);
            if (i >= 0) return b.scores[i] - a.scores[i] || weightedTotal(b.scores) - weightedTotal(a.scores);
            return 0;
          });
        };
        return (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Moat vs AI</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>How protected is each portfolio company from AI disruption? Eight moats weighted by structural importance (T1: 3x, T2: 2x, T3: 1x)</div>
          </div>

          {/* Legend */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "12px 20px", marginBottom: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, color: T_.textGhost, fontWeight: 600 }}>MOAT STRENGTH:</div>
            {[{ l: "Strong", c: "#34d673" }, { l: "Medium", c: "#F59E0B" }, { l: "Weak", c: "#EF4444" }].map(r => (
              <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: r.c }} />
                <span style={{ fontSize: 11, color: T_.textMid }}>{r.l}</span>
              </div>
            ))}
            <div style={{ width: 1, height: 16, background: T_.border, margin: "0 4px" }} />
            <div style={{ fontSize: 12, color: T_.textGhost, fontWeight: 600 }}>TIERS:</div>
            {[{ l: "T1 (3x)", c: "#34d673" }, { l: "T2 (2x)", c: "#F59E0B" }, { l: "T3 (1x)", c: T_.textGhost }].map(r => (
              <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: r.c }} />
                <span style={{ fontSize: 11, color: T_.textMid }}>{r.l}</span>
              </div>
            ))}
            <div style={{ width: 1, height: 16, background: T_.border, margin: "0 4px" }} />
            <div style={{ fontSize: 12, color: T_.textGhost, fontWeight: 600 }}>RESILIENCE (/{MOAT_MAX}):</div>
            {[{ l: "33+ Strong", c: "#34d673" }, { l: "21-32 Medium", c: "#F59E0B" }, { l: "<21 Weak", c: "#EF4444" }].map(r => (
              <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: r.c }} />
                <span style={{ fontSize: 11, color: T_.textMid }}>{r.l}</span>
              </div>
            ))}
          </div>

          {/* Sector Groups */}
          {dynamicMoatGroups.map(group => {
            const gExp = !isExp("moat_" + group.key);
            const sorted = sortCo(group.companies, group.key);
            const avgScore = Math.round(group.companies.reduce((s,c) => s + weightedTotal(c.scores), 0) / group.companies.length);
            return (
            <div key={group.key} style={{ marginBottom: 12 }}>
              <div
                onClick={() => toggle("moat_" + group.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  background: gExp ? group.color + "18" : T_.bgPanel,
                  borderRadius: gExp ? "10px 10px 0 0" : 10, cursor: "pointer",
                  border: `1px solid ${gExp ? group.color + "44" : T_.border}`,
                  borderBottom: gExp ? "none" : undefined,
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 6, background: group.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: group.color }}>{group.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{group.label}</div>
                  <div style={{ fontSize: 11, color: T_.textDim }}>{group.companies.length} companies &middot; avg resilience: <span style={{ color: totalColor(avgScore), fontWeight: 600 }}>{avgScore}/{MOAT_MAX}</span></div>
                </div>
                <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: gExp ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
              </div>

              {gExp && (
                <div style={{ background: T_.bgPanel, borderRadius: "0 0 10px 10px", border: `1px solid ${group.color}44`, borderTop: "none", overflow: "hidden" }}>
                  {/* Table Header */}
                  <div style={{ display: "grid", gridTemplateColumns: colDef, padding: "8px 12px", borderBottom: `1px solid ${T_.border}`, background: T_.bgInput }}>
                    {colHeaders.map((col, ci) => (
                      <div key={ci} onClick={() => setMoatSort({ key: col.key, group: group.key })} style={{
                        fontSize: 9, fontWeight: 600,
                        color: moatSort.group === group.key && moatSort.key === col.key ? T_.accent : T_.textGhost,
                        textTransform: "uppercase", cursor: "pointer", letterSpacing: 0.3,
                        textAlign: ci >= 1 ? "center" : "left",
                      }}>
                        {col.tier && <span style={{ color: tierColor[col.tier], marginRight: 2 }}>{col.weight}x</span>}
                        {col.label}{moatSort.group === group.key && moatSort.key === col.key ? " ▼" : ""}
                      </div>
                    ))}
                  </div>
                  {/* Rows */}
                  {sorted.map((co, ri) => {
                    const wt = weightedTotal(co.scores);
                    return (
                      <div key={ri} style={{
                        display: "grid", gridTemplateColumns: colDef,
                        padding: "5px 12px", borderBottom: ri < sorted.length - 1 ? `1px solid ${T_.borderLight}` : "none",
                        background: ri % 2 === 0 ? "transparent" : T_.bg + "44",
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: T_.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{co.name}</div>
                        {co.scores.map((s, si) => (
                          <div key={si} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style={{
                              fontSize: 9, fontWeight: 600, padding: "2px 2px", borderRadius: 3,
                              background: scoreBg(s), color: scoreColor(s), minWidth: 32, textAlign: "center",
                            }}>{scoreLabel[s]}</div>
                          </div>
                        ))}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                          <div style={{ width: 24, height: 5, borderRadius: 3, background: T_.bg, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(wt / MOAT_MAX) * 100}%`, borderRadius: 3, background: totalColor(wt) }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: totalColor(wt) }}>{wt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            );
          })}
        </div>
        );
      })()}

      {/* ─── JEVONS' PARADOX TAB ─── */}
      {subTab === "jevons" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Jevons' Paradox & AI</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>When AI collapses the cost of producing X and demand for X is elastic, total consumption of X explodes. The question for every sector: was demand previously supply-constrained or price-constrained?</div>
          </div>

          {/* Framework Box */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.accent}44`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.accent, marginBottom: 12 }}>The Framework</div>
            <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, marginBottom: 16 }}>
              In 1865, William Stanley Jevons observed that as steam engines became more fuel-efficient, total coal consumption increased rather than decreased. The efficiency gains made coal-powered applications economically viable in entirely new contexts, and aggregate demand exploded.
            </div>
            <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, marginBottom: 16 }}>
              The same logic applies to AI. When AI reduces the cost of code, content, analysis, customer interactions, or legal review by 10-100x, the question is not "will less of it be produced?" but rather "how much latent demand was suppressed by the old cost structure?" Where demand is elastic, the Jevons' effect dominates and total spending on the activity (and its supporting infrastructure) increases even as unit costs fall.
            </div>

            {/* Historical Precedents */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Historical Precedents - Jevons' Paradox in Technology</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { tech: "Cloud Computing (2006-present)", period: "2006-present",
                    expected: "Cloud would reduce total IT infrastructure spending by eliminating on-prem waste",
                    actual: "Global IT infrastructure spending increased from ~$300B (2006) to $800B+ (2025). Cloud made compute so cheap and accessible that startups, experiments, and use cases that were never viable on-prem became possible. Total compute consumption grew 10-100x",
                    displaced: "On-prem server vendors (Sun Microsystems — acquired by Oracle), traditional hosting providers, hardware resellers, and the in-house data center operations model. Companies like Rackable Systems and smaller hosting firms were squeezed. IT procurement cycles and capital budgets shifted from hardware capex to cloud opex",
                    parallel: "Directly analogous to AI - cheaper compute didn't reduce spend, it expanded the addressable market for compute-dependent applications" },
                  { tech: "GPS & Navigation (2000s)", period: "2000-present",
                    expected: "Free GPS navigation would destroy the map and navigation industry ($3B market)",
                    actual: "Free turn-by-turn navigation enabled ride-sharing (Uber/Lyft, $100B+ market), delivery platforms (DoorDash, Instacart, $200B+ GMV), fleet optimization, and location-based services. The 'navigation' market went from $3B to powering $500B+ in location-dependent commerce",
                    displaced: "Dedicated GPS device makers (Garmin consumer nav, TomTom), paper map publishers (Rand McNally), MapQuest, and the entire standalone navigation hardware category. TomTom's consumer revenue collapsed ~80%. Garmin survived by pivoting to fitness/aviation/marine",
                    parallel: "When AI makes a capability free, the industries built on top of that capability can be orders of magnitude larger than the original market it disrupted" },
                  { tech: "E-Commerce & Retail (1995-present)", period: "1995-present",
                    expected: "Online shopping would reduce total retail spending and destroy physical retail",
                    actual: "Total US retail spending grew from $2.7T (2000) to $7.1T (2024). E-commerce didn't just shift spending online - it expanded total consumption by reducing friction, enabling long-tail products, and creating entirely new categories (subscription boxes, DTC brands, marketplace commerce). Physical retail revenue also grew in absolute terms",
                    displaced: "Mail-order catalogs (Sears catalog, JCPenney), department stores (Sears, Macy's, JCPenney — all shrank dramatically), shopping mall traffic, Borders/bookstores, Tower Records, and brick-and-mortar retailers that couldn't adapt. Retail employment per dollar of sales declined even as total retail grew",
                    parallel: "AI reduces friction in discovery and purchasing - total commerce volume increases as personalization, recommendations, and AI shopping assistants make buying easier" },
                  { tech: "Internet & Information (1990s-2000s)", period: "1993-present",
                    expected: "Free information online would destroy publishing, media, and information services",
                    actual: "Total information consumption exploded. More content was created in 2010 than in all of prior human history. Newspapers declined but total spending on digital content, streaming, social media, and information services dwarfs the old media economy. The 'paper' economy was $300B; the digital information economy is $3T+",
                    displaced: "Print newspapers (US daily circulation fell from 62M to 21M), Yellow Pages (revenue collapsed from $14B to ~$2B), encyclopedias (Britannica stopped printing), video rental stores (Blockbuster), record stores, classified ad businesses, and traditional print advertising revenue",
                    parallel: "AI makes content creation nearly free - total content produced and consumed explodes, benefiting distribution, analytics, and infrastructure" },
                  { tech: "Spreadsheets & Accounting (1980s)", period: "1979-present",
                    expected: "VisiCalc and Lotus 1-2-3 would eliminate accounting and bookkeeping jobs",
                    actual: "The number of accounting and financial analyst jobs in the US grew from ~340K (1980) to ~1.4M (2020). Spreadsheets made analysis so fast and cheap that every department started doing it - finance, marketing, operations, HR. Total demand for quantitative analysis exploded across the economy",
                    displaced: "Mechanical adding machines and calculators (Monroe, Friden, Marchant), ledger book manufacturers, rooms of human 'computers' doing manual calculations, and typing pools. The specific role of manual bookkeeping clerk declined even as the broader finance profession grew",
                    parallel: "AI analytics tools let any employee query data - total analytical queries and data-informed decisions increase 100x" },
                  { tech: "ATMs & Bank Tellers (1970s-2010s)", period: "1970-present",
                    expected: "ATMs would replace bank tellers and reduce branch employment",
                    actual: "ATM deployment reduced the cost of operating a bank branch by ~50%, making it economical to open far more branches. Total number of bank teller jobs in the US actually increased from ~300K (1970) to ~600K (2010) before declining. The cheaper branch model expanded total banking access",
                    displaced: "Nothing was fully killed — but the teller role shifted from cash handling to sales/advisory. The narrow task of 'dispensing cash' was displaced, while the branch became a sales channel. Post-2010, mobile banking finally started reducing both branch count and teller headcount",
                    parallel: "AI agents reduce cost of customer interactions - companies expand service coverage, touchpoints, and engagement rather than just cutting headcount" },
                  { tech: "Steam Engine & Coal (1865)", period: "1760s-1900s",
                    expected: "More efficient engines would reduce coal consumption",
                    actual: "Coal consumption increased 10x. Efficiency made coal economically viable for factories, railways, ships, and mines that previously couldn't justify the cost. New industries were created entirely around cheap steam power",
                    displaced: "Water mills (location-constrained), wind-powered mills, animal power (horses, oxen for heavy transport), manual labor in factories, canal transport (replaced by railways), and sailing ships for freight. Entire geographic patterns of industry shifted — factories no longer needed to be near rivers",
                    parallel: "AI makes cognitive labor cheaper - total demand for cognitive output (code, analysis, content, decisions) increases, not decreases" },
                ].map((item, idx) => (
                  <div key={idx} onClick={() => toggle("hist_" + idx)} style={{
                    background: isExp("hist_" + idx) ? T_.bg : T_.bgInput,
                    borderRadius: 8, padding: "12px 16px", cursor: "pointer",
                    border: `1px solid ${isExp("hist_" + idx) ? T_.accent + "33" : T_.borderLight}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: T_.text }}>{item.tech}</span>
                        <span style={{ fontSize: 12, color: T_.textGhost, marginLeft: 10 }}>{item.period}</span>
                      </div>
                      <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("hist_" + idx) ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
                    </div>
                    {isExp("hist_" + idx) && (
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                          <div>
                            <div style={{ fontSize: 11, color: T_.red, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Expected Outcome</div>
                            <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{item.expected}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: T_.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>What Actually Happened</div>
                            <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{item.actual}</div>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T_.purple, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>What Was Displaced</div>
                          <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{item.displaced}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T_.amber, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>AI Parallel</div>
                          <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{item.parallel}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: T_.bg, borderRadius: 8, padding: 16, border: `1px solid ${T_.green}33` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.green, marginBottom: 8 }}>Elastic Demand (Jevons' Applies)</div>
                <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6 }}>TAM expands. Volume explodes. Infrastructure and platform companies win. Cost per unit falls but total spend rises. Invest in the picks and shovels beneath the activity</div>
              </div>
              <div style={{ background: T_.bg, borderRadius: 8, padding: 16, border: `1px solid ${T_.textGhost}33` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.textDim, marginBottom: 8 }}>Inelastic Demand (AI = Pure Cost-Out)</div>
                <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6 }}>TAM flat. AI is a margin story, not a growth story. Incumbents with switching costs benefit. No new demand created. Invest in the moat, not the growth</div>
              </div>
            </div>
          </div>

          {/* Counter-thesis: AI Displaces Knowledge Work */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.red}33`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.red, marginBottom: 12 }}>Counter-Thesis: What If AI Displaces Knowledge Work Itself?</div>
            <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, marginBottom: 16 }}>
              Every historical Jevons' example displaced a narrow task within a broader human-directed workflow. The steam engine replaced muscle. ATMs replaced cash dispensing. Spreadsheets replaced arithmetic. In each case, the human stayed in the loop directing what to build, what to analyze, what to decide.
            </div>
            <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, marginBottom: 16 }}>
              AI is different because it goes after the entire cognitive stack &mdash; not just "do this calculation faster" but "figure out what question to ask, answer it, and act on it." That is not task substitution. It is role substitution. The uncomfortable question for every sector: is the human the bottleneck that was suppressing demand (Jevons' applies), or is the human the producer being replaced while the output keeps growing without them?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: T_.bg, borderRadius: 8, padding: 16, border: `1px solid ${T_.green}33` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.green, marginBottom: 8 }}>Where Jevons' Still Holds</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>When AI makes a cognitive task cheaper but humans still define the what and why. More code gets written because humans want more software. More content gets created because humans have more ideas to express. The human is the demand signal. AI is the production tool. Volume explodes</div>
                </div>
                <div style={{ background: T_.bg, borderRadius: 8, padding: 16, border: `1px solid ${T_.red}33` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.red, marginBottom: 8 }}>Where Jevons' Breaks Down</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>When AI can autonomously close the loop &mdash; identify the problem, design the solution, execute it, evaluate the result &mdash; without a human in the chain. Demand for the output may still grow, but demand for human knowledge workers producing that output does not. Economic value accrues to capital (AI infrastructure owners) not labor</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>The Key Distinction: Jevons' on Output vs Jevons' on Labor</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { area: "Code", output: "Total software created explodes (Jevons' on output)", labor: "Software engineers needed to produce it may decline (labor displaced)", who: "AWS, Cloudflare, Datadog benefit. Developer headcount at IT services firms does not" },
                { area: "Legal Review", output: "Total documents reviewed explodes (every contract, every communication)", labor: "Contract attorneys and managed review headcount shrinks dramatically", who: "Relativity, Everlaw (platforms) benefit. Staffing agencies and review providers do not" },
                { area: "Data Analysis", output: "Total analytical queries per organization increases 100x", labor: "Junior analyst and BI developer roles compress", who: "Snowflake, Databricks, ThoughtSpot benefit. Analyst headcount at consulting firms may not" },
                { area: "Content", output: "Total marketing content produced per company increases 10-100x", labor: "Copywriters, basic designers, content agency headcount declines", who: "Adobe, Canva, Meta/Google (ad platforms) benefit. Creative staffing agencies do not" },
                { area: "Customer Support", output: "Total customer interactions per company increases dramatically", labor: "Tier 1 and Tier 2 agent headcount collapses", who: "Intercom, Twilio benefit. Concentrix, TTEC, Teleperformance do not" },
                { area: "Security Analysis", output: "Total alerts investigated and threats monitored expands 10x", labor: "SOC analyst headcount per unit of monitoring declines", who: "CrowdStrike, Palo Alto (platforms) benefit. MSSP headcount-based models compressed" },
              ].map((item, idx) => (
                <div key={idx} style={{ background: T_.bg, borderRadius: 8, padding: "12px 16px", border: `1px solid ${T_.borderLight}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.text, marginBottom: 6 }}>{item.area}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: T_.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Output (Expands)</div>
                      <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.5 }}>{item.output}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T_.red, textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Labor (Compresses)</div>
                      <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.5 }}>{item.labor}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T_.blue, textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>Who Benefits</div>
                      <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.5 }}>{item.who}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: T_.amber, lineHeight: 1.8, fontStyle: "italic", borderTop: `1px solid ${T_.borderLight}`, paddingTop: 14 }}>
              Bottom line: Jevons' paradox likely still applies to total output, but the economic beneficiary shifts from labor to infrastructure. The total pie of software, content, analysis, and interactions grows &mdash; but the human share of producing it shrinks. For portfolio construction, this means overweight platforms and infrastructure (consumption-based revenue models), underweight labor-dependent services (headcount-based revenue models).
            </div>
          </div>

        </div>
      )}

      {/* ─── DISRUPTION MAP TAB ─── */}
      {subTab === "disruption" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>AI Disruption Map</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>How AI reshapes each sector I cover. Risk levels, timelines, winners, losers, and what to watch</div>
          </div>

      {/* Legend */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "16px 24px", marginBottom: 24, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: T_.textGhost, fontWeight: 600 }}>DISRUPTION RISK:</div>
        {[
          { label: "Very High", color: "#EF4444" },
          { label: "High", color: "#F97316" },
          { label: "Medium", color: "#F59E0B" },
          { label: "Low", color: "#FBBF24" },
          { label: "Positive Disruption", color: "#34d673" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: 12, color: T_.textMid }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Top 5 Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#EF4444", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Top 5 Most Disrupted</div>
          {TOP_DISRUPTED.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${T_.borderLight}` : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#EF444422", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#EF4444", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T_.text }}>{item.name}</div>
                <div style={{ fontSize: 11, color: T_.textGhost }}>{item.sector}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: riskColor(item.risk), background: riskColor(item.risk) + "18", padding: "2px 8px", borderRadius: 4 }}>{item.risk}</div>
            </div>
          ))}
        </div>
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#34d673", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Top 5 Most Benefited</div>
          {TOP_BENEFITED.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${T_.borderLight}` : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#34d67322", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#34d673", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T_.text }}>{item.name}</div>
                <div style={{ fontSize: 11, color: T_.textGhost }}>{item.sector}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: riskColor(item.risk), background: riskColor(item.risk) + "18", padding: "2px 8px", borderRadius: 4 }}>{item.risk}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Companies Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#EF4444", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>10 Most Disrupted Companies</div>
          <div style={{ fontSize: 11, color: T_.textGhost, marginBottom: 14 }}>Based on current business model — assuming no adaptation</div>
          {TOP_DISRUPTED_CO.map((co, i) => (
            <div key={i} onClick={() => toggle("dco_" + i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < 9 ? `1px solid ${T_.borderLight}` : "none", cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#EF444422", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#EF4444", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T_.text }}>{co.name}</span>
                  <span style={{ fontSize: 10, color: T_.textGhost, background: T_.bgInput, padding: "1px 6px", borderRadius: 3 }}>{co.sector}</span>
                </div>
                {isExp("dco_" + i) && (
                  <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6, marginTop: 4 }}>{co.reason}</div>
                )}
              </div>
              <span style={{ fontSize: 10, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("dco_" + i) ? "rotate(90deg)" : "rotate(0deg)", marginTop: 3 }}>&#9654;</span>
            </div>
          ))}
        </div>
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#34d673", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>10 Most Benefited Companies</div>
          <div style={{ fontSize: 11, color: T_.textGhost, marginBottom: 14 }}>Based on current business model — assuming no adaptation by competitors</div>
          {TOP_BENEFITED_CO.map((co, i) => (
            <div key={i} onClick={() => toggle("bco_" + i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < 9 ? `1px solid ${T_.borderLight}` : "none", cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "#34d67322", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#34d673", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T_.text }}>{co.name}</span>
                  <span style={{ fontSize: 10, color: T_.textGhost, background: T_.bgInput, padding: "1px 6px", borderRadius: 3 }}>{co.sector}</span>
                </div>
                {isExp("bco_" + i) && (
                  <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6, marginTop: 4 }}>{co.reason}</div>
                )}
              </div>
              <span style={{ fontSize: 10, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("bco_" + i) ? "rotate(90deg)" : "rotate(0deg)", marginTop: 3 }}>&#9654;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sectors */}
      {SECTORS.map(sector => (
        <div key={sector.key} style={{ marginBottom: 20 }}>
          <div
            onClick={() => toggle("sec_" + sector.key)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
              background: isExp("sec_" + sector.key) ? sector.color + "18" : T_.bgPanel,
              borderRadius: 10, cursor: "pointer",
              border: `1px solid ${isExp("sec_" + sector.key) ? sector.color + "44" : T_.border}`,
              transition: "all 0.15s",
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: sector.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: sector.color }}>{sector.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: T_.text }}>{sector.label}</div>
              <div style={{ fontSize: 12, color: T_.textDim }}>{sector.subsectors.length} areas assessed</div>
            </div>
            <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("sec_" + sector.key) ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
          </div>

          {isExp("sec_" + sector.key) && (
            <div style={{ marginLeft: 20, marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {sector.subsectors.map((sub, idx) => (
                <div key={idx}>
                  <div
                    onClick={() => toggle("sub_" + sector.key + "_" + idx)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                      background: isExp("sub_" + sector.key + "_" + idx) ? T_.bgPanel : T_.bg,
                      borderRadius: 8, cursor: "pointer",
                      border: `1px solid ${isExp("sub_" + sector.key + "_" + idx) ? T_.border : T_.borderLight}`,
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: riskColor(sub.risk), flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: T_.text }}>{sub.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: riskColor(sub.risk), marginRight: 8 }}>{sub.risk}</div>
                    <div style={{ fontSize: 11, color: T_.textGhost, background: T_.bgInput, padding: "2px 8px", borderRadius: 4 }}>{sub.timeline}</div>
                    <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("sub_" + sector.key + "_" + idx) ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
                  </div>

                  {isExp("sub_" + sector.key + "_" + idx) && (
                    <div style={{ marginLeft: 22, marginTop: 8, padding: "18px 22px", background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Investment Thesis</div>
                        <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.7 }}>{sub.thesis}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, color: T_.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Winners</div>
                          <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{sub.winners}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T_.red, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Losers</div>
                          <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{sub.losers}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: T_.blue, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Named Companies</div>
                        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{sub.names}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: T_.amber, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Key Metrics to Watch</div>
                        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{sub.metrics}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
        </div>
      )}

      {/* ─── AI DIFFUSION TIMELINE ─── */}
      {subTab === "diffusion" && <AIDiffusionTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// AI DIFFUSION TIMELINE
// ═══════════════════════════════════════════════════════

const DIFFUSION_LAYERS = [
  { key: "research", label: "Research & Models", color: "#a78bfa" },
  { key: "consumer", label: "Consumer Adoption", color: "#3B82F6" },
  { key: "enterprise", label: "Enterprise Production", color: "#f5a623" },
  { key: "infrastructure", label: "Infrastructure", color: "#34d673" },
  { key: "regulation", label: "Regulation & Policy", color: "#f87171" },
];

// confidence: "sourced" = hard data from public source, "estimated" = synthesized from multiple sources, "projected" = future speculation
const DIFFUSION_MILESTONES = [
  // Research & Models
  { year: 2012, layer: "research", label: "AlexNet wins ImageNet", detail: "Deep learning proves viable for computer vision. AlexNet achieves 15.3% top-5 error vs. runner-up's 26.2% — nearly halving the error rate. Kicks off the neural network renaissance.", pct: 5,
    confidence: "sourced", source: "Krizhevsky et al., ImageNet Classification with Deep Convolutional Neural Networks (NeurIPS 2012)", sourceUrl: "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" },
  { year: 2014, layer: "research", label: "GANs introduced", detail: "Ian Goodfellow publishes Generative Adversarial Networks. Foundation for all generative AI image/video models.", pct: 8,
    confidence: "sourced", source: "Goodfellow et al., Generative Adversarial Nets (NeurIPS 2014)", sourceUrl: "https://arxiv.org/abs/1406.2661" },
  { year: 2017, layer: "research", label: "\"Attention Is All You Need\"", detail: "Google publishes the Transformer paper. Architecture that powers GPT, BERT, and every modern LLM. The single most consequential AI paper.", pct: 15,
    confidence: "sourced", source: "Vaswani et al., Attention Is All You Need (NeurIPS 2017)", sourceUrl: "https://arxiv.org/abs/1706.03762" },
  { year: 2018, layer: "research", label: "BERT & GPT-1", detail: "Google's BERT and OpenAI's GPT-1 demonstrate transfer learning at scale. Pre-training + fine-tuning paradigm established.", pct: 20,
    confidence: "sourced", source: "OpenAI (GPT-1), Google AI Blog (BERT)", sourceUrl: "https://arxiv.org/abs/1810.04805" },
  { year: 2020, layer: "research", label: "GPT-3 (175B params)", detail: "Scaling laws validated. Few-shot learning emerges. First model that feels 'intelligent' in conversation. API access only.", pct: 35,
    confidence: "sourced", source: "Brown et al., Language Models are Few-Shot Learners (OpenAI, 2020)", sourceUrl: "https://arxiv.org/abs/2005.14165" },
  { year: 2023, layer: "research", label: "GPT-4 + open-source explosion", detail: "GPT-4 achieves human-level on professional exams. Llama 2 open-sourced. Mistral, Claude 2 launch. Model capability commoditizing rapidly.", pct: 60,
    confidence: "sourced", source: "OpenAI GPT-4 Technical Report; Meta Llama 2 announcement", sourceUrl: "https://arxiv.org/abs/2303.08774" },
  { year: 2024, layer: "research", label: "Llama 3, Claude 3.5, multimodal", detail: "Open-source closes gap with frontier. Vision, audio, video understanding. Reasoning models (o1). Cost per token drops 10-100x from GPT-3 era.", pct: 75,
    confidence: "estimated", source: "Synthesis of model announcements and benchmark comparisons (Meta, Anthropic, OpenAI)" },
  { year: 2025, layer: "research", label: "Claude 4, agentic reasoning", detail: "Extended thinking, tool use, multi-step agents. Models can write, debug, and deploy code autonomously. Open-weight models approach frontier.", pct: 85,
    confidence: "estimated", source: "Anthropic, OpenAI, Meta model releases and capability demonstrations" },
  { year: 2027, layer: "research", label: "Projected: autonomous research agents", detail: "Models capable of sustained multi-day research tasks. Self-improving code generation. Science automation begins.", pct: 92,
    confidence: "projected" },

  // Consumer Adoption
  { year: 2011, layer: "consumer", label: "Siri launches", detail: "Apple ships first mainstream voice assistant. Limited NLU but introduces millions to AI interaction.", pct: 3,
    confidence: "sourced", source: "Apple iPhone 4S launch (Oct 2011)" },
  { year: 2014, layer: "consumer", label: "Alexa launches", detail: "Amazon Echo brings always-on AI to homes. 600M+ Alexa-enabled endpoints by 2025.", pct: 5,
    confidence: "sourced", source: "Amazon device announcements; Jassy 2025 shareholder letter (600M endpoints)", sourceUrl: "https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-2025-letter-to-shareholders" },
  { year: 2018, layer: "consumer", label: "Smart speakers mainstream", detail: "~100M smart speakers sold globally (~64M in the U.S.). AI assistants become normal but capabilities plateau.", pct: 10,
    confidence: "sourced", source: "Canalys: 100M global installed base by end 2018; Voicebot.ai: ~66M US adults by Jan 2019", sourceUrl: "https://www.canalys.com/newsroom/smart-speaker-installed-base-to-hit-100-million-by-end-of-2018" },
  { year: 2022.9, layer: "consumer", label: "ChatGPT launches (Nov)", detail: "100M users in ~2 months. Fastest consumer app adoption ever recorded at the time. Consumer tipping point.", pct: 25,
    confidence: "sourced", source: "UBS / Similarweb analysis (Feb 2023); confirmed in Jassy 2025 letter", sourceUrl: "https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/" },
  { year: 2023, layer: "consumer", label: "AI tools go mainstream", detail: "Midjourney, Copilot, Claude, Perplexity reach millions. AI image generation normalized. Students, writers, developers adopt daily.", pct: 40,
    confidence: "estimated", source: "Synthesis of user reports: Midjourney ~16M users (Discord), GitHub Copilot ~1.8M paid subscribers (Microsoft FY24 Q2)" },
  { year: 2024, layer: "consumer", label: "AI coding tools gain traction", detail: "GitHub Copilot exceeds 1.8M paid subscribers. Stack Overflow 2024 survey: 76% of developers use or plan to use AI tools. Adoption accelerating but depth varies.", pct: 50,
    confidence: "sourced", source: "Stack Overflow 2024 Developer Survey; GitHub/Microsoft earnings reports", sourceUrl: "https://survey.stackoverflow.co/2024/ai" },
  { year: 2025, layer: "consumer", label: "AI assistants in every OS", detail: "Apple Intelligence, Windows Copilot, Google Gemini embedded in OS layer. 1B+ devices with on-device AI. Usage still shallow for most.", pct: 58,
    confidence: "estimated", source: "Apple WWDC 2024 (Apple Intelligence announcement), Microsoft Build, Google I/O device projections" },
  { year: 2027, layer: "consumer", label: "Projected: AI-first interfaces", detail: "Conversational interfaces replace traditional UI for many tasks. Search, email, scheduling primarily AI-mediated.", pct: 72,
    confidence: "projected" },
  { year: 2030, layer: "consumer", label: "Projected: ubiquitous AI", detail: "AI interaction as natural as using electricity. Embedded in every product, service, and workflow.", pct: 85,
    confidence: "projected" },

  // Enterprise Production
  { year: 2015, layer: "enterprise", label: "ML in ad targeting & fraud", detail: "Google, Meta, financial institutions deploy ML at scale for narrow, high-value use cases. Not 'AI' in public consciousness yet.", pct: 3,
    confidence: "estimated", source: "Industry knowledge — Google/Meta ML ad systems, JPMorgan fraud detection widely reported" },
  { year: 2019, layer: "enterprise", label: "AutoML & managed ML services", detail: "AWS SageMaker, Google AutoML lower barrier. Most enterprises still in 'data science team builds custom models' phase. Few production deployments.", pct: 6,
    confidence: "estimated", source: "McKinsey Global AI Survey 2019: 58% of orgs adopted AI in at least one function, but most were pilots", sourceUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/global-survey-the-state-of-ai-in-2019" },
  { year: 2023, layer: "enterprise", label: "Enterprise pilot explosion", detail: "McKinsey 2023: 55% of orgs adopted AI (up from 50% in 2022), but only 27% of revenue from AI-enabled products. Most deployments still narrow.", pct: 12,
    confidence: "sourced", source: "McKinsey Global Survey on AI 2023", sourceUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-in-2023-generative-ais-breakout-year" },
  { year: 2024, layer: "enterprise", label: "Copilots ship in enterprise SaaS", detail: "ServiceNow Now Assist ($600M ACV, doubling YoY), Salesforce Agentforce, Microsoft 365 Copilot. AI embedded in existing workflows.", pct: 18,
    confidence: "sourced", source: "ServiceNow Q4 FY25 earnings ($600M AI ACV); Microsoft/Salesforce earnings calls", sourceUrl: "https://www.servicenow.com/company/media/press-room/servicenow-q4-fy2025-earnings.html" },
  { year: 2025, layer: "enterprise", label: "First production agentic workflows", detail: "Companies deploying AI agents for L1 support, code review, data analysis. AWS AI revenue >$15B run rate. Still early innings of enterprise deployment.", pct: 25,
    confidence: "estimated", source: "AWS AI run rate from Jassy 2025 letter; adoption % is synthesis of McKinsey, Gartner, Bain surveys" },
  { year: 2027, layer: "enterprise", label: "Projected: early majority adoption", detail: "30-40% of enterprise workflows AI-augmented. AI-native companies outperform peers by measurable margin. Laggards face competitive pressure.", pct: 40,
    confidence: "projected" },
  { year: 2030, layer: "enterprise", label: "Projected: AI-native operations", detail: "60%+ of knowledge work augmented. Autonomous agents handle routine operations. Human role shifts to oversight, judgment, creativity.", pct: 65,
    confidence: "projected" },

  // Infrastructure
  { year: 2012, layer: "infrastructure", label: "GPUs repurposed for ML", detail: "Researchers discover NVIDIA GPUs dramatically accelerate neural network training. CUDA ecosystem begins.", pct: 3,
    confidence: "sourced", source: "AlexNet trained on 2x NVIDIA GTX 580 GPUs — catalyzed GPU-for-ML movement" },
  { year: 2016, layer: "infrastructure", label: "Google TPU v1", detail: "First custom AI chip. Signals that general-purpose GPUs may not be the endgame for AI compute.", pct: 6,
    confidence: "sourced", source: "Google blog announcement (May 2016)", sourceUrl: "https://cloud.google.com/blog/products/ai-machine-learning/an-in-depth-look-at-googles-first-tensor-processing-unit-tpu" },
  { year: 2020, layer: "infrastructure", label: "A100 GPU era begins", detail: "NVIDIA A100 becomes the standard AI training chip. Cloud providers begin building dedicated AI clusters.", pct: 12,
    confidence: "sourced", source: "NVIDIA A100 launch (GTC 2020)" },
  { year: 2023, layer: "infrastructure", label: "GPU shortage peaks", detail: "H100 demand far exceeds supply. Wait times stretch to 8-11 months. AI compute becomes a strategic bottleneck. Shortage eases by early 2024.", pct: 20,
    confidence: "estimated", source: "Tom's Hardware, GPU Utils — H100 lead times 8-11 months in 2023, dropped to 8-12 weeks by early 2024", sourceUrl: "https://www.tomshardware.com/pc-components/gpus/nvidias-h100-ai-gpu-shortages-ease-as-lead-times-drop-from-up-to-four-months-to-8-12-weeks" },
  { year: 2023.5, layer: "infrastructure", label: "Hyperscaler capex surge", detail: "Combined hyperscaler total capex ~$155B in 2023 (MSFT+GOOG+AMZN+META). AI is a growing but not yet dominant share of total capex.", pct: 30,
    confidence: "estimated", source: "Hyperscaler 10-K filings (combined total capex ~$155B); AI-specific share was a subset. By 2025-26, AI becomes ~75% of total", sourceUrl: "https://epoch.ai/data-insights/hyperscaler-capex-trend" },
  { year: 2024, layer: "infrastructure", label: "Custom silicon race", detail: "Amazon Trainium2 (~30% better price-performance vs GPUs), Google TPU v5, Microsoft Maia. Hyperscalers reducing NVIDIA dependence.", pct: 42,
    confidence: "sourced", source: "Jassy 2025 shareholder letter (Trainium2 price-performance); Google Cloud Next (TPU v5)", sourceUrl: "https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-2025-letter-to-shareholders" },
  { year: 2025, layer: "infrastructure", label: "Power becomes the bottleneck", detail: "AWS adds 3.8 GW capacity in trailing 12 months, plans to double total by 2027. Amazon custom chips biz (Graviton + Trainium + Nitro) >$20B run rate. Power, not chips, is the new constraint.", pct: 55,
    confidence: "sourced", source: "Jassy 2025 shareholder letter ($20B chips run rate); AWS Q3 2025 earnings (3.8 GW)", sourceUrl: "https://www.aboutamazon.com/news/company-news/amazon-ceo-andy-jassy-2025-letter-to-shareholders" },
  { year: 2027, layer: "infrastructure", label: "Projected: distributed AI compute", detail: "Edge inference, on-device models, satellite-connected AI. Compute moves from centralized clouds toward the edge.", pct: 68,
    confidence: "projected" },
  { year: 2030, layer: "infrastructure", label: "Projected: mature AI infrastructure", detail: "AI compute as utility. Custom silicon dominant. Power infrastructure caught up. Cost per inference drops 100x from 2024.", pct: 80,
    confidence: "projected" },

  // Regulation
  { year: 2016, layer: "regulation", label: "EU GDPR adopted (effective 2018)", detail: "Not AI-specific but establishes data rights framework that constrains AI training data. Sets precedent for tech regulation.", pct: 5,
    confidence: "sourced", source: "EU GDPR — adopted April 2016, enforced May 2018", sourceUrl: "https://gdpr.eu/tag/gdpr/" },
  { year: 2021, layer: "regulation", label: "EU AI Act proposed", detail: "First comprehensive AI regulation framework. Risk-based approach: unacceptable, high, limited, minimal risk categories.", pct: 10,
    confidence: "sourced", source: "European Commission AI Act proposal (April 2021)", sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence" },
  { year: 2023, layer: "regulation", label: "Biden AI Executive Order", detail: "EO 14110 (Oct 2023): reporting requirements for frontier models, safety testing mandates. Fully revoked by Trump EO on Jan 20, 2025, replaced with 'Removing Barriers to American Leadership in AI'.", pct: 18,
    confidence: "sourced", source: "White House EO 14110 (Oct 30, 2023); Trump EO revoking portions (Jan 2025)", sourceUrl: "https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/" },
  { year: 2024, layer: "regulation", label: "EU AI Act enters force", detail: "World's first comprehensive AI law. Entered force Aug 1, 2024. Phased enforcement: banned practices Feb 2025, high-risk obligations Aug 2026.", pct: 28,
    confidence: "sourced", source: "EU AI Act — entered force Aug 1, 2024", sourceUrl: "https://artificialintelligenceact.eu/ai-act-implementation-timeline/" },
  { year: 2025, layer: "regulation", label: "AI licensing & liability debates", detail: "Multiple jurisdictions debating AI liability frameworks. Copyright lawsuits ongoing (NYT v. OpenAI). No global consensus.", pct: 35,
    confidence: "estimated", source: "Synthesis of ongoing regulatory developments — no single definitive source" },
  { year: 2027, layer: "regulation", label: "Projected: compliance frameworks mature", detail: "Industry standards for AI safety, testing, and audit. Compliance becomes a cost of doing business, not a barrier.", pct: 48,
    confidence: "projected" },
];

// Generate S-curve data points for chart — split into historical (solid) and projected (dashed)
function generateSCurveData(currentYear) {
  const years = [];
  for (let y = 2010; y <= 2031; y++) years.push(y);

  return years.map(year => {
    const point = { year };
    DIFFUSION_LAYERS.forEach(layer => {
      const milestones = DIFFUSION_MILESTONES.filter(m => m.layer === layer.key).sort((a, b) => a.year - b.year);
      const before = milestones.filter(m => m.year <= year);
      const after = milestones.filter(m => m.year > year);
      let val = 0;
      if (before.length === 0) { val = 0; }
      else if (after.length === 0) { val = before[before.length - 1].pct; }
      else {
        const prev = before[before.length - 1];
        const next = after[0];
        const t = (year - prev.year) / (next.year - prev.year);
        const smooth = t * t * (3 - 2 * t);
        val = Math.round(prev.pct + (next.pct - prev.pct) * smooth);
      }
      // Split into two series: historical and projected
      if (year <= currentYear) {
        point[layer.key] = val;
        point[layer.key + "_proj"] = val; // overlap point for continuity
      } else {
        point[layer.key] = null;
        point[layer.key + "_proj"] = val;
      }
    });
    return point;
  });
}

const CONFIDENCE_STYLES = {
  sourced:   { label: "Sourced",   bg: "#34d67318", border: "#34d67340", color: "#34d673" },
  estimated: { label: "Estimated", bg: "#f5a62318", border: "#f5a62340", color: "#f5a623" },
  projected: { label: "Projected", bg: "#f8717118", border: "#f8717140", color: "#f87171" },
};

function AIDiffusionTab() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [hoveredMilestone, setHoveredMilestone] = useState(null);
  const currentYear = 2026;
  const chartData = useMemo(() => generateSCurveData(currentYear), [currentYear]);

  const visibleLayers = selectedLayer ? DIFFUSION_LAYERS.filter(l => l.key === selectedLayer) : DIFFUSION_LAYERS;
  const timelineMilestones = selectedLayer
    ? DIFFUSION_MILESTONES.filter(m => m.layer === selectedLayer)
    : DIFFUSION_MILESTONES;

  // Group milestones by year for the timeline
  const milestonesByYear = {};
  timelineMilestones.forEach(m => {
    const yr = Math.floor(m.year);
    if (!milestonesByYear[yr]) milestonesByYear[yr] = [];
    milestonesByYear[yr].push(m);
  });
  const sortedYears = Object.keys(milestonesByYear).map(Number).sort((a, b) => a - b);

  const layerColor = (key) => DIFFUSION_LAYERS.find(l => l.key === key)?.color || T_.textDim;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    // Dedupe — show each layer once, preferring the historical value
    const seen = {};
    const items = [];
    payload.forEach(p => {
      const baseKey = p.dataKey.replace("_proj", "");
      if (p.value == null || seen[baseKey]) return;
      seen[baseKey] = true;
      const isProj = p.dataKey.endsWith("_proj") && label > currentYear;
      items.push({ baseKey, value: p.value, color: p.color, isProj });
    });
    return (
      <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 8, padding: "12px 16px", fontSize: 12, fontFamily: FONT }}>
        <div style={{ fontWeight: 600, color: T_.text, marginBottom: 6 }}>{label}{label > currentYear ? " (projected)" : ""}</div>
        {items.map(p => (
          <div key={p.baseKey} style={{ color: p.color, marginBottom: 2 }}>
            {DIFFUSION_LAYERS.find(l => l.key === p.baseKey)?.label}: {p.value}%{p.isProj ? " *" : ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>AI Diffusion Timeline</div>
        <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4, lineHeight: 1.6 }}>
          How AI adoption is spreading across research, consumer, enterprise, infrastructure, and regulation — tracked on S-curves over time.
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 11, color: T_.textGhost }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 20, height: 2, background: T_.textMid, display: "inline-block" }} /> Sourced data
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 20, height: 2, background: T_.textMid, display: "inline-block", borderTop: "2px dashed " + T_.textGhost, height: 0 }} /> Projected
        </span>
        {Object.entries(CONFIDENCE_STYLES).map(([k, v]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: 3, background: v.color, display: "inline-block" }} /> {v.label}
          </span>
        ))}
      </div>

      {/* Layer filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => setSelectedLayer(null)} style={{
          padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT,
          background: !selectedLayer ? T_.accent + "22" : "transparent",
          border: `1px solid ${!selectedLayer ? T_.accent : T_.border}`,
          color: !selectedLayer ? T_.accent : T_.textGhost, transition: "all 0.15s",
        }}>All Layers</button>
        {DIFFUSION_LAYERS.map(l => (
          <button key={l.key} onClick={() => setSelectedLayer(selectedLayer === l.key ? null : l.key)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT,
            background: selectedLayer === l.key ? l.color + "22" : "transparent",
            border: `1px solid ${selectedLayer === l.key ? l.color : T_.border}`,
            color: selectedLayer === l.key ? l.color : T_.textGhost, transition: "all 0.15s",
          }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: l.color, marginRight: 6 }} />
            {l.label}
          </button>
        ))}
      </div>

      {/* S-Curve Chart — solid lines for historical, dashed for projected */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "24px 24px 12px", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T_.text }}>Adoption S-Curves</div>
          <div style={{ fontSize: 11, color: T_.textGhost }}>Dashed lines = projected beyond {currentYear}</div>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {DIFFUSION_LAYERS.map(l => (
                <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={l.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={l.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T_.border} />
            <XAxis dataKey="year" tick={{ fill: T_.textGhost, fontSize: 11 }} tickLine={false} axisLine={{ stroke: T_.border }} />
            <YAxis tick={{ fill: T_.textGhost, fontSize: 11 }} tickLine={false} axisLine={{ stroke: T_.border }} domain={[0, 100]}
              tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={currentYear} stroke={T_.textGhost} strokeDasharray="4 4" label={{ value: "Now", fill: T_.textGhost, fontSize: 11, position: "top" }} />
            {/* Historical lines (solid) */}
            {visibleLayers.map(l => (
              <Area key={l.key} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={2}
                fill={`url(#grad-${l.key})`} dot={false} activeDot={{ r: 4, fill: l.color }} connectNulls={false} />
            ))}
            {/* Projected lines (dashed) */}
            {visibleLayers.map(l => (
              <Area key={l.key + "_proj"} type="monotone" dataKey={l.key + "_proj"} stroke={l.color} strokeWidth={2}
                strokeDasharray="6 4" fill="none" dot={false} activeDot={{ r: 4, fill: l.color, strokeDasharray: "" }} connectNulls={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Current state summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
        {DIFFUSION_LAYERS.map(l => {
          const latest = DIFFUSION_MILESTONES.filter(m => m.layer === l.key && m.year <= currentYear).sort((a, b) => b.year - a.year)[0];
          const phase = latest?.pct < 16 ? "Innovators / Early Adopters" : latest?.pct < 50 ? "Crossing the Chasm" : latest?.pct < 84 ? "Early → Late Majority" : "Saturation";
          const conf = latest?.confidence || "estimated";
          const cs = CONFIDENCE_STYLES[conf];
          return (
            <div key={l.key} style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 18, cursor: "pointer", transition: "border-color 0.15s",
              borderColor: selectedLayer === l.key ? l.color : T_.border }}
              onClick={() => setSelectedLayer(selectedLayer === l.key ? null : l.key)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: l.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: T_.text }}>{l.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: l.color }}>{latest?.pct || 0}%</div>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: cs.bg, border: `1px solid ${cs.border}`, color: cs.color }}>{cs.label}</span>
              </div>
              <div style={{ fontSize: 11, color: T_.textDim, lineHeight: 1.4, marginTop: 4 }}>{phase}</div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T_.text, marginBottom: 20 }}>Milestone Timeline</div>
        <div style={{ position: "relative" }}>
          {sortedYears.map((yr, yi) => {
            const isFuture = yr > currentYear;
            return (
              <div key={yr} style={{ display: "flex", gap: 20 }}>
                {/* Year marker */}
                <div style={{ width: 52, flexShrink: 0, textAlign: "right", paddingTop: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFuture ? T_.textGhost : T_.text, fontStyle: isFuture ? "italic" : "normal" }}>{yr}</span>
                </div>
                {/* Vertical line */}
                <div style={{ width: 20, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: yr === currentYear ? T_.accent : isFuture ? T_.border : T_.textGhost, flexShrink: 0, marginTop: 4 }} />
                  {yi < sortedYears.length - 1 && <div style={{ width: 1, flex: 1, background: isFuture ? `${T_.border}80` : T_.border, minHeight: 10, borderLeft: isFuture ? `1px dashed ${T_.border}` : "none" }} />}
                </div>
                {/* Milestones for this year */}
                <div style={{ flex: 1, paddingBottom: 20 }}>
                  {milestonesByYear[yr].map((m, mi) => {
                    const cs = CONFIDENCE_STYLES[m.confidence || "estimated"];
                    const isOpen = hoveredMilestone === `${yr}-${mi}`;
                    return (
                      <div key={mi} style={{ marginBottom: mi < milestonesByYear[yr].length - 1 ? 12 : 0, cursor: "pointer" }}
                        onClick={() => setHoveredMilestone(isOpen ? null : `${yr}-${mi}`)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 4, background: layerColor(m.layer), flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: isFuture ? T_.textDim : T_.text }}>{m.label}</span>
                          <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: cs.bg, border: `1px solid ${cs.border}`, color: cs.color, flexShrink: 0 }}>{cs.label}</span>
                          <span style={{ fontSize: 10, color: T_.textGhost, marginLeft: "auto", flexShrink: 0 }}>{m.pct}%</span>
                        </div>
                        {isOpen && (
                          <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.7, marginTop: 6, marginLeft: 16, padding: "10px 14px",
                            background: T_.bgInput, borderRadius: 6, border: `1px solid ${T_.borderLight}` }}>
                            <div style={{ marginBottom: m.source ? 8 : 0 }}>{m.detail}</div>
                            {m.source && (
                              <div style={{ fontSize: 11, color: T_.textGhost, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 8, marginTop: 4 }}>
                                <span style={{ color: cs.color, fontWeight: 600 }}>{cs.label}:</span>{" "}
                                {m.sourceUrl
                                  ? <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: T_.blue, textDecoration: "none" }}>{m.source}</a>
                                  : m.source}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
