import { useState } from "react";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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
        thesis: "Single clearest Jevons' beneficiary in software. Every AI model needs data pipelines, storage, compute. More AI = more data ingestion, transformations, queries, storage. Volume of data created is accelerating with AI as primary driver. These platforms benefit regardless of which AI app wins",
        winners: "Data platforms with consumption-based pricing — they win as volume grows regardless of AI app layer winners",
        losers: "Legacy on-prem data warehouses that can't handle AI workloads; ETL tools that AI pipelines replace",
        names: "Strongest beneficiaries: Snowflake, Databricks, MongoDB, Confluent. Also: Cloudera (hybrid), Precisely (data quality — AI needs clean data). At risk: legacy on-prem DW",
        metrics: "Watch: data platform consumption growth, volumes ingested, pipeline runs, storage growth, compute spend per customer" },
      { name: "IT Operations & Service Management", risk: "Medium-High", timeline: "2-4 years",
        thesis: "AI agents handling L1/L2 IT service desk tickets autonomously. ServiceNow embedding AI deeply. AIOps automating incident detection and remediation. Positive for platform vendors (more automation = more value = more pricing power) but negative for managed services headcount around ITSM",
        winners: "ITSM platform vendors embedding AI (ServiceNow dominant); AIOps platforms automating incident management",
        losers: "L1/L2 help desk outsourcers; managed services charging per-ticket; legacy ITOM without AI",
        names: "Strengthening: ServiceNow (Now Assist), BMC (HelixGPT). ITOM: Datadog, Dynatrace, Splunk (Cisco). At risk: help desk BPOs, SolarWinds (if AI modernization lags)",
        metrics: "Watch: AI ticket resolution rates, L1 deflection %, ServiceNow AI attach rates, MTTR with AIOps vs manual" },
      { name: "Backup & Data Protection", risk: "Low-Medium (Positive)", timeline: "3-5 years",
        thesis: "AI-powered ransomware makes attacks more sophisticated, increasing urgency for modern backup/recovery. AI also improves backup intelligence (anomaly detection, clean recovery validation). Net positive — more threats = more protection demand",
        winners: "Modern backup with AI threat detection and clean recovery; cyber vaulting leaders",
        losers: "Legacy backup without AI; tape-only; tools that can't validate recovery integrity",
        names: "Benefiting: Veeam, Cohesity, Rubrik, Commvault (Metallic). At risk: legacy Veritas (pre-merger), basic backup tools",
        metrics: "Watch: ransomware recovery SLA metrics, backup AI feature adoption, cyber vault deployment, data protection spend as % of IT budget" },
      { name: "DevOps & Developer Tools", risk: "Medium", timeline: "1-3 years",
        thesis: "Bifurcated impact. Infrastructure-layer tools (version control, observability, security scanning) benefit from AI-driven code volume explosion. But developer productivity point solutions (code quality scanners, manual testing tools, IDE plugins) face commoditization as AI coding assistants absorb their functionality inline. The key question: is the tool below the developer workflow (infrastructure) or within it (point solution)?",
        winners: "Infrastructure-layer platforms: version control (Perforce - large binary repos have no AI substitute), observability (Elastic, Datadog), AppSec scanning (Veracode - 45% of AI code fails security tests, demand surging). Tools that process MORE code as volume explodes",
        losers: "Point solutions absorbed by AI coding assistants: static analysis (SonarSource - code quality becoming a feature not a product, acquiring AI companies out of urgency), IDE productivity plugins (Idera/Visual Assist - directly replaced by Copilot/Cursor), manual testing tools, basic API testing (SmartBear testing side). PE roll-ups of aging dev tools (Idera)",
        names: "Benefiting: Veracode (81% ACV growth from AI code insecurity), Elastic (vector DB + AI search), Perforce (binary VCS insulated), GitHub. At risk: SonarSource (commoditizing), Idera (aging portfolio), SmartBear (testing side). Mixed: SolarWinds (competitive not AI threat)",
        metrics: "Watch: code volume (commits, PRs per dev), AppSec scan frequency and failure rates on AI code, static analysis tool churn rates, AI coding assistant adoption displacing standalone tools" },
      { name: "Content & Document Management", risk: "Medium", timeline: "2-4 years",
        thesis: "AI transforms document management from storage/retrieval to intelligent content processing. Auto-classification, summarization, extraction, compliance checking become native. Positive for platforms embedding AI; threatens manual document processing workflows",
        winners: "ECM platforms embedding AI content intelligence; intelligent document processing vendors",
        losers: "Manual document classification; ECM implementation consultants; basic DMS without AI",
        names: "Adapting: OpenText (Aviator AI), Hyland. Adjacent: Kofax (intelligent automation), ABBYY. At risk: legacy DMS without AI",
        metrics: "Watch: AI auto-classification accuracy, document processing throughput, ECM AI feature adoption" },
      { name: "Collaboration & Productivity", risk: "Medium", timeline: "2-4 years",
        thesis: "AI copilots in every productivity tool — meeting summarization, email drafting, document creation, PM automation. Microsoft Copilot for M365 most important. Question: does AI make platforms stickier or do AI-native tools displace?",
        winners: "Platform incumbents with AI distribution (Microsoft, Google); AI-native meeting/notes tools",
        losers: "Standalone meeting transcription, basic PM without AI, note-taking apps AI copilots absorb",
        names: "Strengthening: Microsoft (Copilot M365), Google (Gemini Workspace), Notion AI. At risk: Otter.ai, basic PM tools. Emerging: Granola, AI workspace tools",
        metrics: "Watch: Copilot M365 adoption, Copilot revenue per seat, AI feature usage in productivity suites, standalone tool churn" },
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
      { name: "Legal Tech & E-Discovery", risk: "Medium-High", timeline: "2-5 years",
        thesis: "AI accelerates document review (largest litigation cost), contract analysis, legal research. Privilege review done by AI with human oversight. Legal industry conservative, slowing adoption",
        winners: "AI-native legal platforms, e-discovery companies embedding LLMs, CLM with AI contract analysis",
        losers: "Contract attorney staffing, managed review relying on headcount, basic legal research without AI",
        names: "Adapting: Relativity (aiR), Thomson Reuters (CoCounsel/Harvey), LexisNexis. CLM: Icertis, Ironclad, Conga. AI-native: Harvey",
        metrics: "Watch: cost per document reviewed, review speed, AI vs manual accuracy, attorney utilization, CLM AI adoption" },
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
      { name: "Contact Center & Customer Support BPO", risk: "Very High", timeline: "1-3 years",
        thesis: "AI agents handling Tier 1 and increasingly Tier 2 tickets. Voice AI replacing IVR and basic agents. ROI immediate — pennies per interaction vs $5-15 human. Fastest-moving AI displacement area",
        winners: "AI-first CCaaS platforms, autonomous AI agent builders",
        losers: "Traditional BPO/contact center outsourcers, legacy CCaaS without AI",
        names: "At risk: Concentrix, TTEC, Teleperformance, Conduent. Transitioning: Five9, NICE, Genesys. AI-native: Sierra, Decagon, Bland.ai, Intercom (Fin)",
        metrics: "Watch: agent headcount at BPOs, AI deflection rates, cost-per-resolution, CSAT AI vs human, revenue per seat" },
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
        thesis: "Ambient AI scribes (listening, generating notes) among fastest-adopted AI in healthcare. Reduces physician burnout, improves documentation. Medical coding highly automatable. Creates rather than destroys software value",
        winners: "AI ambient scribe companies, EHR vendors embedding AI documentation",
        losers: "Medical transcription services, offshore coding companies, legacy documentation",
        names: "Winning: Abridge, Nuance/Microsoft (DAX), Nabla, Suki. EHR: Epic, Oracle Health, AthenaHealth. At risk: transcription/coding outsourcers",
        metrics: "Watch: ambient AI adoption, documentation time per encounter, coding accuracy, transcription revenue" },
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

const JEVONS_ELASTIC = [
  { area: "Software Development", icon: "S", color: "#3B82F6",
    before: "Code costs $150-300/hr to write. Only projects with clear ROI get funded. Internal tools, niche apps, and custom workflows are perpetually backlogged",
    after: "AI drops marginal cost of code toward zero. Every company becomes a software company. Internal tools that were never worth building at $500K get built for $5K. Total volume of software created explodes",
    beneficiaries: "Infrastructure and platform companies monetizing per-workload, per-compute, per-API call -AWS, Datadog, Cloudflare, Vercel, MongoDB. More software = more infrastructure. Also: dev tools, testing, security scanning (SonarSource, GitHub) -more code means more of everything downstream",
    metric: "Total global software output (lines of code, apps deployed, API calls), cloud compute consumption, dev tool seat growth",
  },
  { area: "Content & Creative", icon: "C", color: "#8B5CF6",
    before: "A blog post costs $500, a video $5,000, an ad creative $2,000. Content production is bottlenecked by human creative labor. Only high-value content gets produced",
    after: "AI drops creation cost 10-50x. Companies produce 10-100x more marketing material, personalized to every segment, every channel, every language. A/B testing goes from 3 variants to 300",
    beneficiaries: "Distribution and measurement become the bottleneck. Content management (Adobe), analytics (Amplitude, Mixpanel), personalization engines, ad platforms (Meta, Google -more creatives to test = more ad spend). Also: storage and CDN (Cloudflare, Fastly) from content volume explosion",
    metric: "Total content pieces produced per company, ad creative variants tested per campaign, personalization depth, CDN traffic volumes",
  },
  { area: "Customer Interactions", icon: "CI", color: "#10B981",
    before: "Each support ticket costs $5-15 with human agents. Companies minimize interactions -deflect with FAQs, make phone numbers hard to find, limit support hours. Only reactive, not proactive",
    after: "AI drops per-interaction cost to pennies. Companies can now afford to support every user proactively -onboarding, check-ins, upsell, retention. Support becomes a growth driver, not a cost center",
    beneficiaries: "Customer engagement platforms monetizing per-interaction or per-user -Intercom, Braze, Twilio/Segment. Total interaction volume goes way up even as unit cost collapses. CRM systems (Salesforce, HubSpot) processing more touchpoints per customer",
    metric: "Total customer interactions per user, support coverage hours, proactive vs reactive contact ratio, engagement platform message volumes",
  },
  { area: "Security Analysis", icon: "S", color: "#EF4444",
    before: "SOC analyst costs $120K/yr and can investigate ~20 alerts/day. Organizations only monitor the most critical systems. Many alerts are ignored or auto-closed. Entire classes of threats go unmonitored",
    after: "AI triages thousands of alerts, investigates anomalies, correlates signals. Organizations turn on monitoring they couldn't afford -every endpoint, API, data flow, user behavior pattern gets scrutinized",
    beneficiaries: "Security data platforms charging on ingestion volume -Splunk, CrowdStrike (Charlotte AI), Palo Alto (XSIAM), Wiz. More analysis = more data ingestion = more spend. Also: SIEM/XDR vendors, identity analytics",
    metric: "Total security telemetry ingested (GB/day), alert investigation coverage rate, mean time to detect, endpoints under active monitoring",
  },
  { area: "Legal & Compliance Work", icon: "L", color: "#F59E0B",
    before: "Document review costs $50-100/hr per contract attorney. Companies review only what litigation mandates. Proactive compliance reviews, contract audits, and risk assessments are deferred due to cost",
    after: "AI drops review cost 90%+. Companies review everything -every contract for risk clauses, every communication for compliance, every vendor agreement for exposure. Scope of legal oversight expands dramatically",
    beneficiaries: "E-discovery and legal data platforms charging per-GiB (Relativity, Everlaw) -volume processed explodes. Contract analysis platforms (Ironclad, Icertis). Compliance monitoring tools. Data volumes grow even as unit cost falls",
    metric: "Total documents reviewed per matter, contract audit coverage rates, compliance monitoring scope, legal tech platform data volumes",
  },
  { area: "Personalized Education", icon: "E", color: "#0EA5E9",
    before: "1:1 tutoring costs $50-100/hr. Only affluent families can afford it. Most students get one-size-fits-all instruction. Adaptive learning is limited by content creation costs",
    after: "AI tutoring approaches zero marginal cost. Every student gets a personal tutor that adapts in real-time. Total \u201ctutoring hours\u201d consumed could increase 100x+. Education shifts from batch delivery to individualized",
    beneficiaries: "Platforms monetizing engagement and outcomes -Khan Academy (Khanmigo), Duolingo, adaptive learning companies. Assessment/credentialing companies that verify learning (more learning = more need to measure). Infrastructure serving education (LMS platforms processing more interactions)",
    metric: "AI tutoring session hours per student, learning outcome improvements, platform engagement time, credential/assessment volume",
  },
  { area: "Data Analysis & Business Intelligence", icon: "D", color: "#34d673",
    before: "Data analysis requires skilled analysts ($100K-150K/yr each). Only strategic questions get answered. Most employees can't query data directly. Dashboards are static and pre-built by a small data team",
    after: "AI lets any employee ask questions of data in natural language. The number of analytical queries per organization could increase 100x. Every decision becomes data-informed, not just the big ones",
    beneficiaries: "Data platforms billing on query volume or compute -Snowflake, Databricks, BigQuery. BI tools with AI interfaces (Tableau, ThoughtSpot, Power BI). Data quality/governance tools (more queries = more need for clean, governed data)",
    metric: "Analytical queries per employee per day, data platform compute consumption, BI tool daily active users, self-service analytics adoption",
  },
];

const JEVONS_INELASTIC = [
  { area: "Payroll Processing", reason: "You don't run payroll more often because it's cheaper. Volume fixed by headcount. AI is a cost-out, not a demand driver" },
  { area: "ERP / Core Transactions", reason: "Companies don't process more invoices because the software is smarter. Transaction volume is a function of business activity, not software cost" },
  { area: "Regulatory Filings", reason: "You file what regulators require, not more. Tax returns, SEC filings, compliance reports are non-discretionary and fixed in scope" },
  { area: "Infrastructure Maintenance", reason: "A mainframe or server needs maintaining whether the tooling costs $X or $X/2. AI improves efficiency but doesn't create new maintenance demand" },
  { area: "HR Administration", reason: "Onboarding, benefits enrollment, terminations are driven by headcount events, not by how cheap the software is. AI streamlines but doesn't expand volume" },
];

const TOP_DISRUPTED = [
  { name: "IT Staffing & Staff Augmentation", sector: "IT Services", risk: "Very High" },
  { name: "Contact Center & Customer Support BPO", sector: "Tech-Enabled Services & BPO", risk: "Very High" },
  { name: "Data Entry & Document Processing BPO", sector: "Tech-Enabled Services & BPO", risk: "Very High" },
  { name: "Medical Coding & Transcription", sector: "Tech-Enabled Services & BPO", risk: "Very High" },
  { name: "Translation & Localization Services", sector: "Tech-Enabled Services & BPO", risk: "Very High" },
];

const TOP_BENEFITED = [
  { name: "Data Infrastructure & Databases", sector: "Software", risk: "Low (Positive)" },
  { name: "Cybersecurity Software", sector: "Software", risk: "Medium (Positive)" },
  { name: "BI & Analytics Software", sector: "Software", risk: "High (Positive Disruption)" },
  { name: "Email & Endpoint Security", sector: "Software", risk: "Medium (Positive)" },
  { name: "Clinical Documentation & Coding", sector: "Healthcare IT", risk: "High (Positive Disruption)" },
];

const TOP_DISRUPTED_CO = [
  { name: "Virtusa", reason: "Pure offshore body shop selling developer headcount with no sector specialization. AI makes each dev 2-3x productive, directly compressing demand. No proprietary data, no switching costs, no regulatory moat. Weakest moat profile in portfolio (wt: 15/45)", sector: "IT Services" },
  { name: "UST Global", reason: "Offshore IT services with per-FTE billing. Same structural exposure as Virtusa - commodity labor with no defensible moats. App dev, testing, and maintenance all face AI-driven compression (wt: 15/45)", sector: "IT Services" },
  { name: "Liftoff Mobile", reason: "Smaller ad network competing against AI-powered walled gardens (Meta Advantage+, Google PMax). AI targeting advantages accrue to platforms with the most data. No moats of any kind (wt: 9/45)", sector: "AdTech" },
  { name: "Skillsoft", reason: "Static L&D content library. AI generates personalized training at fraction of cost. No switching costs (easy to cancel), no proprietary data moat. Compliance training offers some regulatory protection but core content is commoditizing (wt: 12/45)", sector: "Education" },
  { name: "ZoomInfo", reason: "Sales data enrichment faces commoditization as AI tools scrape, synthesize, and enrich contact data natively. Low switching costs (easy to cancel), CRM AI features absorb standalone data products. Data moat eroding as web data becomes AI-accessible (wt: 14/45)", sector: "Software" },
  { name: "Xerox", reason: "Document processing and print services in secular decline. AI automates document workflows via OCR + LLMs. Brand recognition (2) is the only meaningful moat but insufficient against structural business model decline (wt: 13/45)", sector: "BPO / Document" },
  { name: "Perficient", reason: "Generic digital consultancy selling implementation hours with no sector specialization. AI accelerates delivery - fewer billable hours per project. No proprietary data, no regulatory moat, no switching costs (wt: 15/45)", sector: "IT Consulting" },
  { name: "Kofax", reason: "Rules-based intelligent automation being leapfrogged by GenAI. LLMs handle unstructured tasks that Kofax's architecture cannot. No switching costs, no data moat, no ecosystem lock-in (wt: 11/45)", sector: "Software" },
  { name: "Calabrio", reason: "Contact center workforce management facing AI transformation. AI scheduling, forecasting, and quality management replace core functionality. No switching costs, no proprietary data advantage (wt: 11/45)", sector: "Software" },
  { name: "Idera", reason: "PE roll-up of aging dev tool point solutions being directly replaced by AI. Visual Assist (C++ productivity) made obsolete by Copilot/Cursor. Delphi ecosystem is declining regardless of AI. Sencha UI components AI generates on demand. No moat of any kind across the portfolio (wt: 15/45)", sector: "Software" },
];

const TOP_BENEFITED_CO = [
  { name: "CrowdStrike", reason: "AI expands attack surface and threat sophistication - directly increasing demand. Massive proprietary threat telemetry (3) is a genuine data moat that strengthens with AI. Deep ecosystem (3), top-tier brand (3). AI is TAM expansion, not disruption (wt: 28/45)", sector: "Cybersecurity" },
  { name: "CCC Intelligent Solutions", reason: "20+ years of proprietary claims/repair data (3) that AI makes more valuable, not less. AI auto estimation expanding TAM. Deep insurer-body shop-OEM ecosystem (3) with high switching costs (3). AI is an upsell, not a threat (wt: 26/45)", sector: "Insurance Tech" },
  { name: "Cotiviti", reason: "Proprietary payment integrity patterns (3) across $3T+ claims. AI finds more waste/fraud = more value per dollar reviewed. Strongest moat profile in healthcare IT - regulatory (3), security (3), switching (3), contracts (3). Jevons' beneficiary (wt: 33/45)", sector: "Healthcare IT" },
  { name: "Proofpoint", reason: "AI-generated phishing directly increases demand for AI-powered email security. Proprietary threat telemetry (3), deep ecosystem integration (3), security IS the product (3). Business model is the solution to the AI threat problem (wt: 26/45)", sector: "Cybersecurity" },
  { name: "Sophos", reason: "MDR and endpoint security benefit from AI-driven threat escalation. Broad SMB telemetry (3) is a data moat. Security (3) requirement increases as AI-powered attacks grow. More threats = more demand (wt: 23/45)", sector: "Cybersecurity" },
  { name: "Elastic NV", reason: "AI's clearest infrastructure beneficiary in the portfolio. Vector database for RAG (2,700+ AI customers), more AI = more logs/telemetry to search. ELK stack deeply embedded as industry standard (ecosystem 3). 18% YoY growth with AI as primary driver. Infrastructure layer AI builds on, not replaces (wt: 31/45)", sector: "Data Infrastructure" },
  { name: "Synechron", reason: "Near-term AI beneficiary - financial services spending aggressively on AI implementation and need trusted partners with regulatory knowledge. FS domain expertise (regulatory 2, security 2) creates moats commodity IT firms lack. Margin compression is real long-term but demand tailwind is strong now (wt: 25/45)", sector: "IT Services" },
  { name: "Veracode", reason: "Strongest near-term AI beneficiary in AppSec. 81% ACV growth in Q4 2025 driven by AI code insecurity. 45% of AI-generated code fails security tests, Java AI code at 70%+ failure rate. 'Treat all AI-generated code as untrusted' is becoming CISO consensus. More code = more scanning (wt: 25/45)", sector: "Cybersecurity" },
  { name: "Precisely", reason: "AI is only as good as data quality - garbage in, garbage out. Every enterprise AI initiative starts with data integrity. Deep ecosystem integration (3) as data quality backbone. AI increases demand for clean data (wt: 22/45)", sector: "Data Infrastructure" },
  { name: "Darktrace", reason: "AI-native threat detection built on proprietary unsupervised ML data (3). Growing attack surface from AI-powered threats directly expands addressable market. Security (3) is core to product (wt: 23/45)", sector: "Cybersecurity" },
];

// Moat scores: 1=Weak (red), 2=Medium (yellow), 3=Strong (green)
// Columns: [data, ecoInteg, switchCost, regulatory, security, contracts, brand, physical, infraSupport]
const MOAT_GROUPS = [
  { key: "software", label: "Software", icon: "S", color: "#3B82F6", companies: [
    { name: "Adeia", scores: [2,1,1,2,1,2,1,1,1] },
    { name: "Applied Systems", scores: [2,3,3,2,2,2,2,1,1] },
    { name: "Avalara", scores: [2,3,2,3,2,2,2,1,1] },
    { name: "Barracuda Networks", scores: [1,2,2,2,3,2,1,1,1] },
    { name: "BMC Software", scores: [1,2,3,1,2,2,2,1,2] },
    { name: "Calabrio", scores: [1,2,1,1,1,1,1,1,1] },
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
    { name: "Elastic NV", scores: [1,2,2,1,2,2,2,1,2] },
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
    { name: "Kofax", scores: [1,2,1,1,1,1,1,1,1] },
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
    { name: "SonarSource", scores: [2,3,2,2,2,2,2,1,1] },
    { name: "SonicWall", scores: [1,2,2,2,3,2,1,1,1] },
    { name: "Sophos", scores: [3,2,2,2,3,2,2,1,1] },
    { name: "Sovos Compliance", scores: [2,3,2,3,2,2,1,1,1] },
    { name: "SS&C Technologies", scores: [2,3,3,3,3,3,2,1,1] },
    { name: "Storable", scores: [2,3,3,1,1,2,2,1,1] },
    { name: "SUSE", scores: [1,3,3,2,2,2,2,1,3] },
    { name: "Taxwell", scores: [1,2,2,3,1,1,1,1,1] },
    { name: "Tenable", scores: [3,2,2,2,3,2,2,1,1] },
    { name: "TriNet Group", scores: [2,2,2,3,2,2,2,1,1] },
    { name: "Veracode", scores: [2,2,2,2,3,2,2,1,1] },
    { name: "WatchGuard Technologies", scores: [1,2,2,2,3,2,1,1,1] },
    { name: "ZoomInfo", scores: [2,2,1,1,1,1,2,1,1] },
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
    { name: "Skillsoft", scores: [1,2,1,2,1,1,2,1,1] },
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

export default function AIDisruption({ companies }) {
  const [expanded, setExpanded] = useState({});
  const [subTab, setSubTab] = useState("disruption");
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
    <div style={{ flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: 1400, fontFamily: FONT }}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${T_.borderLight}` }}>
        {[{ key: "disruption", label: "Disruption Map" }, { key: "moats", label: "Moat vs AI" }, { key: "jevons", label: "Jevons' Paradox" }].map(t => (
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
                    parallel: "Directly analogous to AI - cheaper compute didn't reduce spend, it expanded the addressable market for compute-dependent applications" },
                  { tech: "GPS & Navigation (2000s)", period: "2000-present",
                    expected: "Free GPS navigation would destroy the map and navigation industry ($3B market)",
                    actual: "Free turn-by-turn navigation enabled ride-sharing (Uber/Lyft, $100B+ market), delivery platforms (DoorDash, Instacart, $200B+ GMV), fleet optimization, and location-based services. The 'navigation' market went from $3B to powering $500B+ in location-dependent commerce",
                    parallel: "When AI makes a capability free, the industries built on top of that capability can be orders of magnitude larger than the original market it disrupted" },
                  { tech: "E-Commerce & Retail (1995-present)", period: "1995-present",
                    expected: "Online shopping would reduce total retail spending and destroy physical retail",
                    actual: "Total US retail spending grew from $2.7T (2000) to $7.1T (2024). E-commerce didn't just shift spending online - it expanded total consumption by reducing friction, enabling long-tail products, and creating entirely new categories (subscription boxes, DTC brands, marketplace commerce). Physical retail revenue also grew in absolute terms",
                    parallel: "AI reduces friction in discovery and purchasing - total commerce volume increases as personalization, recommendations, and AI shopping assistants make buying easier" },
                  { tech: "Internet & Information (1990s-2000s)", period: "1993-present",
                    expected: "Free information online would destroy publishing, media, and information services",
                    actual: "Total information consumption exploded. More content was created in 2010 than in all of prior human history. Newspapers declined but total spending on digital content, streaming, social media, and information services dwarfs the old media economy. The 'paper' economy was $300B; the digital information economy is $3T+",
                    parallel: "AI makes content creation nearly free - total content produced and consumed explodes, benefiting distribution, analytics, and infrastructure" },
                  { tech: "Spreadsheets & Accounting (1980s)", period: "1979-present",
                    expected: "VisiCalc and Lotus 1-2-3 would eliminate accounting and bookkeeping jobs",
                    actual: "The number of accounting and financial analyst jobs in the US grew from ~340K (1980) to ~1.4M (2020). Spreadsheets made analysis so fast and cheap that every department started doing it - finance, marketing, operations, HR. Total demand for quantitative analysis exploded across the economy",
                    parallel: "AI analytics tools let any employee query data - total analytical queries and data-informed decisions increase 100x" },
                  { tech: "ATMs & Bank Tellers (1970s-2010s)", period: "1970-present",
                    expected: "ATMs would replace bank tellers and reduce branch employment",
                    actual: "ATM deployment reduced the cost of operating a bank branch by ~50%, making it economical to open far more branches. Total number of bank teller jobs in the US actually increased from ~300K (1970) to ~600K (2010) before declining. The cheaper branch model expanded total banking access",
                    parallel: "AI agents reduce cost of customer interactions - companies expand service coverage, touchpoints, and engagement rather than just cutting headcount" },
                  { tech: "Steam Engine & Coal (1865)", period: "1760s-1900s",
                    expected: "More efficient engines would reduce coal consumption",
                    actual: "Coal consumption increased 10x. Efficiency made coal economically viable for factories, railways, ships, and mines that previously couldn't justify the cost. New industries were created entirely around cheap steam power",
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

          {/* Elastic Demand Areas */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.green, marginBottom: 6 }}>Where Demand Is Elastic -Jevons' Beneficiaries</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>These areas had latent demand suppressed by cost. AI unlocks it. Total consumption increases even as unit cost falls</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {JEVONS_ELASTIC.map((item, idx) => (
                <div key={idx}>
                  <div onClick={() => toggle("jev_" + idx)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                    background: isExp("jev_" + idx) ? item.color + "15" : T_.bg,
                    borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${isExp("jev_" + idx) ? item.color + "44" : T_.borderLight}`,
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: item.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: item.color }}>{item.icon}</div>
                    <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: T_.text }}>{item.area}</div>
                    <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("jev_" + idx) ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
                  </div>
                  {isExp("jev_" + idx) && (
                    <div style={{ marginLeft: 44, marginTop: 8, padding: "18px 22px", background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Before AI (Constrained)</div>
                          <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{item.before}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: T_.green, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>After AI (Jevons' Effect)</div>
                          <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{item.after}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: T_.blue, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Who Benefits (Picks & Shovels)</div>
                        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{item.beneficiaries}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: T_.amber, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>What to Measure</div>
                        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{item.metric}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inelastic Areas */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.textDim, marginBottom: 6 }}>Where Demand Is Inelastic -AI = Cost-Out Only</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 16 }}>These areas have fixed demand driven by business activity or regulation. AI reduces cost but doesn't create new volume</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {JEVONS_INELASTIC.map((item, idx) => (
                <div key={idx} style={{ background: T_.bg, borderRadius: 8, padding: "14px 16px", border: `1px solid ${T_.borderLight}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.textDim, marginBottom: 6 }}>{item.area}</div>
                  <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.5 }}>{item.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Implications */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.accent}33`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.accent, marginBottom: 16 }}>Investment Implications</div>
            <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.8, marginBottom: 16 }}>
              The biggest Jevons' beneficiaries are companies that: (1) charge per-unit-of-consumption (API calls, GiB processed, endpoints, interactions, compute hours), (2) sit in the infrastructure layer below the AI application, and (3) benefit from volume regardless of who builds the AI app on top.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: T_.bg, borderRadius: 8, padding: 16, border: `1px solid ${T_.green}33` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T_.green, marginBottom: 8 }}>Strongest Jevons' Beneficiaries</div>
                <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6 }}>Cloud/compute (AWS, Azure, GCP), observability (Datadog, Dynatrace), security platforms (CrowdStrike, Palo Alto), data platforms (Snowflake, Databricks, MongoDB), edge/CDN (Cloudflare), developer platforms (GitHub, Vercel), communication platforms (Twilio)</div>
              </div>
              <div style={{ background: T_.bg, borderRadius: 8, padding: 16, border: `1px solid ${T_.red}33` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T_.red, marginBottom: 8 }}>Most Exposed to Volume Compression</div>
                <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.6 }}>IT staffing (headcount-based), BPO/outsourcing (labor arbitrage), content mills (commodity creation), manual QA testing (hours-based), basic data entry services, contact center outsourcers (per-agent), offshore body shops (per-FTE)</div>
              </div>
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
    </div>
  );
}
