// Run: node insert-companies.cjs
// Inserts 5 new companies into Supabase

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const companies = [
  {
    id: "solarwinds_seed",
    name: "SolarWinds",
    sector: "software",
    sub: "infrastructure",
    priority: "Watching",
    fields: {
      overview: {
        text: `• Public IT management and observability software company (NYSE: SWI); headquartered in Austin, TX
• Founded 1999 by Donald Yonce and David Yonce; IPO'd in 2009; taken private by Silver Lake Partners and Thoma Bravo in 2016 for ~$4.5B; re-IPO'd on NYSE in Oct 2018
• Silver Lake and Thoma Bravo gradually reduced stakes post-IPO; Thoma Bravo fully exited by 2021
• ~2,300 employees; serves ~300,000 customers globally including ~98% of the Fortune 500
• CEO Sudhakar Ramakrishna (appointed Dec 2020, mid-crisis); prior CEO Kevin Thompson led through the PE era
• CRITICAL CONTEXT: SolarWinds was the victim of one of the most significant cyberattacks in history — the SUNBURST/Nobelium supply chain attack (discovered Dec 2020), attributed to Russian intelligence (SVR). Attackers compromised the Orion software build system, distributing backdoored updates to ~18,000 customers including US government agencies (Treasury, Commerce, DHS, DOE). This defined the company for 3+ years
• SEC filed enforcement action against SolarWinds and CISO Timothy Brown in Oct 2023 alleging fraud related to cybersecurity disclosures; court largely dismissed claims in Jul 2024 but the case established new precedent for CISO personal liability
• Revenue ~$788M in FY2024; transitioning from perpetual license to subscription model — subscription ARR growing 30%+ YoY`,
        date: "2026-03-21T00:00:00Z"
      },
      products: {
        text: `• Revenue model: Transitioning from perpetual licenses + maintenance to subscription/SaaS. Subscription ARR has been the fastest-growing segment (30%+ YoY growth). Maintenance renewals on legacy perpetual base still contribute significant recurring revenue but declining as share. Professional services supplemental
• SolarWinds Observability (SaaS): The strategic growth platform — unified full-stack observability covering infrastructure, applications, databases, networks, and logs in a single cloud-native SaaS platform. This is where the company is investing most heavily
• Orion Platform (legacy): The traditional on-prem IT monitoring suite — still the largest revenue contributor but being sunset/migrated to SaaS. Includes Network Performance Monitor (NPM), Server & Application Monitor (SAM), Database Performance Analyzer (DPA), and 50+ modules. This is the product that was compromised in the SUNBURST attack
• IT Service Management (ITSM): Help desk, ticketing, asset management, and IT operations management. Competes in the mid-market ITSM space
• Database Management: Performance monitoring, tuning, and management for SQL Server, Oracle, MySQL, PostgreSQL, and cloud databases. Strong niche position
• IT Security: Access Rights Manager, Security Event Manager, Patch Manager — grew in importance post-SUNBURST as SolarWinds invested heavily in its own security posture ("Secure by Design" initiative)
• Customers buy because: Need affordable, easy-to-deploy IT monitoring and management for hybrid environments. SolarWinds historically won on price-to-value ratio — enterprise-grade functionality at mid-market pricing. The "IT admin's best friend" positioning`,
        date: "2026-03-21T00:00:00Z"
      },
      customers: {
        text: `• Core customer profile: Broad — from SMB IT teams to large enterprise IT operations. Sweet spot is mid-market (500–10,000 employees) where IT teams need powerful monitoring without the cost and complexity of enterprise-grade tools like Datadog or Splunk
• ~300,000 customers including ~98% of the Fortune 500 — one of the broadest installed bases in IT management
• Key verticals: Government (federal, state, local — significant installed base but damaged by SUNBURST), financial services, healthcare, education, technology, and managed service providers (MSPs). Essentially horizontal — any organization with IT infrastructure is a potential customer
• Geography: Estimated ~60-65% North America, ~25-30% EMEA, ~10% APAC/rest of world. Strong in US government despite the breach
• Buying drivers: IT teams need to monitor networks, servers, applications, and databases without hiring expensive specialists or deploying complex platforms. SolarWinds sells to the IT generalist — the admin managing everything. Price sensitivity is the dominant factor for this buyer persona
• Channel: Mix of direct and channel. MSP/MSSP channel is a growing focus — SolarWinds N-able was spun off as a separate public company (NYSE: NABL) in Jul 2021 to focus on the MSP market independently
• Customer concentration is very low — no single customer represents a material share of revenue. This is a high-volume, mid-market business`,
        date: "2026-03-21T00:00:00Z"
      },
      industry: {
        text: `• IT monitoring and observability market estimated at ~$35-45B in 2025, growing at ~12-15% CAGR. SolarWinds at ~$788M revenue is a mid-tier player — below Datadog (~$2.1B), Splunk (now Cisco, ~$3.6B), and Dynatrace (~$1.4B) but above most niche vendors
• ITSM market is an additional ~$10-12B, growing at ~15-18% CAGR. SolarWinds competes in the mid-market segment
• Tailwind — Hybrid infrastructure complexity: Enterprises running hybrid on-prem + multi-cloud environments need unified monitoring. SolarWinds Observability addresses this. Time horizon: 5+ years
• Tailwind — Subscription transition: The shift from perpetual to subscription creates a near-term revenue headwind but long-term increases customer lifetime value and revenue predictability. Time horizon: 2-3 years to complete
• Tailwind — AI/ML in IT operations (AIOps): AI-assisted anomaly detection, root cause analysis, and automated remediation are becoming table stakes. SolarWinds is integrating AI across the platform. Time horizon: 3-5 years
• Headwind — SUNBURST reputational overhang: While fading, the breach still affects government procurement decisions and enterprise security-conscious buyers. Time horizon: 1-3 years remaining
• Headwind — Cloud-native competition: Datadog, Grafana Labs, and cloud-native monitoring tools are the default choice for cloud-first organizations. SolarWinds wins in hybrid/on-prem but struggles to win cloud-native greenfield. Time horizon: Permanent structural challenge
• Headwind — Commoditization: Open-source observability (Prometheus, Grafana, OpenTelemetry) is commoditizing basic monitoring. SolarWinds must differentiate on ease of use and breadth. Time horizon: Permanent
• Market growth (5yr): IT monitoring/observability grew at ~13-16% CAGR; cloud-native observability grew faster at ~25-30% (estimates based on Gartner, IDC)`,
        date: "2026-03-21T00:00:00Z"
      },
      competitive: {
        text: `• Datadog (public, ~$2.1B revenue): The dominant cloud-native observability platform. Wins on product breadth, developer experience, and cloud-native architecture. SolarWinds cannot compete for cloud-native workloads but wins in hybrid/on-prem where Datadog is weak. Price differential is massive — Datadog is 3-5x more expensive for comparable coverage
• Dynatrace (public, ~$1.4B revenue): AI-powered full-stack observability for large enterprises. Wins on automation and enterprise sales. SolarWinds competes in the mid-market where Dynatrace is too expensive and complex
• Splunk (Cisco, ~$3.6B revenue): Dominant in log management and SIEM. Less direct competitor but overlapping in observability. Cisco acquisition may accelerate bundling
• Grafana Labs (private, valued at $6B+): Open-source-first observability stack (Grafana, Loki, Tempo, Mimir). Growing fast with developers. Competes on price (free tier) and community
• ManageEngine (Zoho): Closest direct competitor in the mid-market IT management space. Similar price point, similar buyer persona. ManageEngine is privately held by Zoho and growing aggressively
• ServiceNow: Competes in ITSM. ServiceNow dominates enterprise ITSM; SolarWinds competes in mid-market where ServiceNow is overkill
• Competitive advantage: SolarWinds wins on price-to-value ratio (enterprise functionality at mid-market pricing), ease of deployment (hours not months), breadth of hybrid monitoring (network + server + database + app in one), and the massive installed base of 300,000 customers that creates upsell/cross-sell opportunity for the subscription transition
• Best at: Affordable hybrid IT monitoring for mid-market, database performance management, network monitoring, and ease of use for IT generalists
• Worst at: Cloud-native observability (loses to Datadog), enterprise ITSM (loses to ServiceNow), developer mindshare (loses to Grafana/open-source), and brand perception post-SUNBURST
• Biggest threat (3yr): Datadog moving downmarket with more affordable tiers and Grafana Labs expanding from open-source into enterprise. Both attack SolarWinds' core mid-market from different angles
• Largest opportunity (3yr): Subscription transition completing — if SolarWinds converts the massive perpetual installed base to subscription/SaaS, recurring revenue and margins improve structurally. The hybrid observability positioning is genuinely differentiated for organizations that aren't fully cloud-native`,
        date: "2026-03-21T00:00:00Z"
      },
      transactions: {
        text: `• Jul 2024: Federal court largely dismissed SEC fraud claims against SolarWinds and CISO Timothy Brown — only narrow claims about pre-breach security disclosures survived. Major legal victory but case set precedent for CISO personal liability
• Jul 2021: Spun off N-able (formerly SolarWinds MSP) as independent public company (NYSE: NABL) — separated the MSP-focused business to allow each entity to pursue distinct strategies
• Oct 2023: SEC filed enforcement action against SolarWinds and CISO Timothy Brown alleging fraud in cybersecurity disclosures pre- and post-SUNBURST. Landmark case for CISO liability
• Dec 2020: SUNBURST supply chain attack discovered — Russian SVR compromised Orion build system, backdoored updates distributed to ~18,000 customers including US government agencies. Sudhakar Ramakrishna appointed CEO amid the crisis
• Oct 2018: Re-IPO on NYSE at $15/share, raising ~$545M. Silver Lake and Thoma Bravo retained significant stakes
• Feb 2016: Silver Lake Partners and Thoma Bravo took SolarWinds private for ~$4.5B ($60.10/share). Under PE ownership, grew revenue from ~$620M to ~$1B (including N-able) and improved margins significantly
• 2015-2020: Multiple acquisitions including VividCortex (database observability), Samanage (ITSM), Loggly (log management), and Papertrail (log management) — building the observability platform`,
        date: "2026-03-21T00:00:00Z"
      },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "swi1", text: "The SUNBURST attack was the defining event but SolarWinds has largely moved past it operationally. The SEC case dismissal in Jul 2024 removed the largest legal overhang. The real question now is whether the subscription transition can accelerate — subscription ARR growing 30%+ is strong, but the total revenue growth is muted by perpetual license decline. Watch the net retention rate and subscription mix as leading indicators of whether the transition is working.", date: "2026-03-21T00:00:00Z" },
      { id: "swi2", text: "The mid-market positioning is both SolarWinds' strength and its ceiling. The company wins because it's affordable and easy to deploy — but that same positioning makes it hard to move upmarket where margins and deal sizes are better. Datadog coming downmarket and Grafana growing from open-source are the structural threats. SolarWinds needs the SaaS observability platform to succeed or it risks being permanently squeezed between free/open-source and premium enterprise tools.", date: "2026-03-21T00:00:00Z" },
      { id: "swi3", text: "The N-able spinoff (Jul 2021) was smart — it allowed SolarWinds to focus on the enterprise/mid-market IT monitoring story without the MSP business muddying the narrative. N-able has traded independently and both companies can pursue distinct strategies. For SolarWinds specifically, the 300,000 customer installed base is the key asset — converting even a fraction to the new SaaS observability platform drives significant ARR growth.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "planview_seed",
    name: "Planview",
    sector: "software",
    sub: "application",
    priority: "Watching",
    fields: {
      overview: {
        text: `• Private enterprise work and resource management software company — provides portfolio management, project management, agile planning, and value stream management for large enterprises
• Founded 1989 in Austin, TX; one of the original project portfolio management (PPM) vendors
• Owned by TPG Capital (acquired majority stake in Dec 2020 for ~$1.6B EV) and TA Associates (original PE investor since 2017)
• Led by CEO Razat Gaurav (appointed 2021, former CEO of Planview subsidiary Tasktop and Citrix executive)
• ~1,400 employees; headquartered in Austin, TX with global operations
• Serves ~4,500+ customers including many Fortune 500 enterprises across financial services, technology, healthcare, manufacturing, and government
• Acquisitions are core to the strategy: Spigit (innovation management, 2017), LeanKit (Kanban/lean, 2017), Tasktop (value stream management, 2021), and Claizen (collaborative work management, 2022) have been bolted on to build a comprehensive platform
• Gartner Magic Quadrant Leader for Adaptive Project Management and Reporting; Strong Performer in Forrester Wave for Value Stream Management`,
        date: "2026-03-21T00:00:00Z"
      },
      products: {
        text: `• Revenue model: Predominantly SaaS subscription — annual or multi-year contracts. Legacy on-prem perpetual licenses still exist but declining. Professional services supplement. Revenue is primarily recurring
• Planview Portfolios: Strategic Portfolio Management (SPM) — the flagship. Helps enterprises prioritize, plan, and manage portfolios of projects, programs, and investments. Answers "are we investing in the right things?" C-suite and PMO buyer
• Planview AgilePlace (formerly LeanKit): Enterprise Kanban and lean portfolio management — visual boards for managing work across teams. Popular with agile transformation initiatives
• Planview ProjectPlace: Collaborative work management for project teams — task management, document sharing, Gantt charts, team collaboration
• Planview Tasktop (Hub + Viz): Value Stream Management (VSM) — connects software delivery tools (Jira, GitHub, Jenkins, ServiceNow) to provide end-to-end visibility into the software delivery lifecycle. Acquired 2021 — this is the strategic growth bet
• Planview IdeaPlace (formerly Spigit): Innovation management — crowdsourcing ideas from employees, customers, and partners. Niche but differentiating
• Planview AdaptiveWork (formerly Clarizen): Cloud-based project and work management for professional services and marketing teams
• Customers buy because: Large enterprises need to connect strategy to execution — aligning investment decisions with project delivery, resource capacity, and business outcomes. Planview bridges the gap between C-suite strategic planning and operational execution across hundreds of projects and thousands of resources`,
        date: "2026-03-21T00:00:00Z"
      },
      customers: {
        text: `• Core customer profile: Large enterprise — organizations with 5,000+ employees running complex portfolios of projects, products, and programs. C-suite, PMO, IT leadership, and VP Engineering are the buyers
• ~4,500+ customers including significant Fortune 500 penetration
• Key verticals: Financial services (portfolio governance, regulatory compliance), technology (software delivery optimization via VSM), healthcare (clinical program management), manufacturing (product development portfolio), government (capital planning), and professional services
• Geography: Estimated ~55-60% North America, ~30-35% EMEA (strong in UK, Germany, Nordics), ~5-10% APAC. European presence is relatively strong for a US-based PPM vendor
• Buying drivers: Enterprises struggle to connect strategic priorities to operational execution — too many projects, not enough resources, no visibility into whether investments are delivering value. Planview provides the "air traffic control" layer. Regulatory and compliance requirements in financial services and government also drive demand for portfolio governance
• Switching costs are high — Planview is deeply embedded in enterprise planning and governance workflows. Migrating portfolio data, reports, and integrations is expensive and risky`,
        date: "2026-03-21T00:00:00Z"
      },
      industry: {
        text: `• Strategic Portfolio Management (SPM) market estimated at ~$4-5B in 2025, growing at ~12-14% CAGR
• Value Stream Management (VSM) is a newer, faster-growing segment at ~$1-2B, growing at ~20-25% CAGR — this is where Planview's Tasktop acquisition plays
• Broader project and portfolio management software market is ~$8-10B
• Planview at estimated $400-500M revenue is one of the top 3-4 SPM vendors globally
• Tailwind — Digital transformation governance: As enterprises invest billions in digital transformation, they need PPM tools to manage and govern those portfolios. Time horizon: 5+ years
• Tailwind — Value stream management: Software delivery optimization is a growing priority as engineering becomes the largest cost center. Tasktop positions Planview here. Time horizon: 3-5 years
• Tailwind — AI-assisted planning: AI can improve resource forecasting, project risk prediction, and portfolio optimization. Planview integrating AI features. Time horizon: 3-5 years
• Headwind — Fragmentation from agile tools: Jira, Asana, Monday.com, and other agile/project tools are expanding upmarket into portfolio management, fragmenting the buyer's attention. Time horizon: Ongoing
• Headwind — Microsoft Project/Planner: Microsoft bundling project management into M365 creates a "good enough" free alternative for basic use cases. Time horizon: Permanent for the low end
• Market growth (5yr): SPM market grew at ~10-13% CAGR; VSM grew faster at ~18-22% CAGR (estimates based on Gartner, Forrester)`,
        date: "2026-03-21T00:00:00Z"
      },
      competitive: {
        text: `• Broadcom (Clarity/Rally): Legacy PPM competitor inherited through CA Technologies acquisition. Declining investment and customer satisfaction — creates migration opportunity for Planview. Broadcom's serial neglect of acquired software assets is well-documented
• ServiceNow (SPM/ITBM): Expanding into strategic portfolio management through its IT Business Management module. Wins with organizations already on the ServiceNow platform. Growing threat because ServiceNow is already in the enterprise and can bundle SPM
• Atlassian (Jira Align): Agile portfolio management scaling from Jira. Wins with engineering-first organizations. Weaker in traditional PPM and C-suite strategic planning
• monday.com / Asana: Work management platforms moving upmarket. Win on UX and ease of adoption. Weaker in enterprise governance and strategic portfolio management. Threat is more about mindshare than direct displacement
• Smartsheet: Collaborative work management. Competes for mid-market project management but lacks Planview's enterprise SPM depth
• CloudBees / Plutora (VSM): Compete with Tasktop in value stream management. Smaller and less proven
• Competitive advantage: Planview is the only vendor offering strategic portfolio management + agile planning + value stream management + innovation management in a single platform. The depth of SPM capability (resource management, financial planning, capacity planning, scenario modeling) is unmatched by work management tools moving upmarket
• Best at: Enterprise strategic portfolio management, connecting strategy to execution, resource capacity planning, and regulated industry governance
• Worst at: UX and modern user experience (loses to Asana/monday.com), developer mindshare (loses to Atlassian), and competing against ServiceNow's bundling power
• Biggest threat (3yr): ServiceNow expanding SPM capabilities and bundling into existing enterprise agreements — if CIOs can get "good enough" portfolio management from ServiceNow, the standalone PPM budget is at risk
• Largest opportunity (3yr): VSM category growth — if Tasktop becomes the standard for connecting software delivery tools to business outcomes, Planview captures a fast-growing market that complements the core SPM business`,
        date: "2026-03-21T00:00:00Z"
      },
      transactions: {
        text: `• 2022: Acquired Clarizen (now AdaptiveWork) — cloud-based collaborative work management. Extended the platform into project-level work management for professional services and marketing teams
• Oct 2021: Acquired Tasktop — value stream management platform connecting DevOps tools. Strategic bet on the VSM category. Terms not disclosed. CEO Razat Gaurav was previously Tasktop CEO — effectively a reverse integration
• Dec 2020: TPG Capital acquired majority stake in Planview at ~$1.6B enterprise value. TA Associates retained minority position. TPG's thesis is platform consolidation in enterprise planning software
• 2017: TA Associates acquired Planview — the initial PE platform investment
• 2017: Acquired Spigit (innovation management) and LeanKit (Kanban/lean portfolio management) — first acquisitions under PE ownership
• Earlier: Acquired Innotas (cloud PPM, 2015), Troux Technologies (enterprise architecture, 2014) — building the platform through M&A over 10+ years`,
        date: "2026-03-21T00:00:00Z"
      },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "pv1", text: "The Tasktop acquisition and CEO Gaurav's appointment are the strategic pivot. Planview is betting that the future of enterprise planning extends from traditional PPM into software delivery visibility (VSM). If this works, it connects the C-suite investment question ('are we funding the right things?') to the engineering execution question ('is our software delivery pipeline healthy?'). No other PPM vendor has this end-to-end story. The risk is that VSM is still early and the buyer (VP Engineering) is different from the traditional PPM buyer (PMO/CIO).", date: "2026-03-21T00:00:00Z" },
      { id: "pv2", text: "TPG at ~$1.6B EV in Dec 2020 implies roughly 3-4x revenue. For a mature PPM software company with high switching costs and a strong subscription transition, this is reasonable PE entry pricing. The exit thesis likely depends on demonstrating subscription revenue acceleration, VSM category traction, and continued bolt-on M&A to build platform breadth. An exit in the 2025-2027 window at $2.5-3.5B would represent solid returns.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "cornerstone_seed",
    name: "Cornerstone OnDemand",
    sector: "software",
    sub: "application",
    priority: "Watching",
    fields: {
      overview: {
        text: `• Private human capital management (HCM) and talent management software company — provides learning management (LMS), talent management, workforce planning, and HR content for enterprises
• Founded 1999 in Santa Monica, CA by Adam Miller; IPO'd on Nasdaq (CSOD) in 2011
• Taken private by Clearlake Capital in Oct 2021 for $5.2B ($57.59/share)
• Acquired Saba Software (talent management competitor) for $1.4B in Apr 2020 — transformative deal that combined the #1 and #2 enterprise learning management vendors
• CEO Himanshu Palsule (appointed 2022, formerly CEO of Cornerstone predecessor and Epicor executive); Adam Miller stepped down post-take-private
• ~3,500-4,000 employees; headquartered in Santa Monica, CA
• Serves ~7,000+ organizations and ~125M+ users globally — one of the largest talent management platforms by user count
• Gartner Magic Quadrant Leader for Learning Management Systems; recognized in Talent Management and Talent Acquisition categories
• Under Clearlake ownership: operational restructuring, cost optimization, and product consolidation (Cornerstone + Saba integration)`,
        date: "2026-03-21T00:00:00Z"
      },
      products: {
        text: `• Revenue model: SaaS subscription — per-user annual contracts. Pricing scales with employee count and modules deployed. Content subscriptions are an additional recurring revenue stream. Professional services are supplemental
• Cornerstone Learning (LMS): The flagship — enterprise learning management system for employee training, compliance, and skills development. Largest standalone LMS vendor globally. Manages course delivery, tracking, certifications, and compliance training
• Cornerstone Content: Curated learning content library — thousands of courses from partners (LinkedIn Learning competitors) available as subscription add-on. Content-as-a-service is a growing revenue stream
• Cornerstone Talent Management: Performance management (goals, reviews, feedback), succession planning, compensation management, and career development. Competes with HCM suite vendors
• Cornerstone Recruiting: Applicant tracking and recruiting management — less established than the LMS but part of the talent suite
• Cornerstone HR: Core HR and workforce management capabilities — employee records, organizational management
• Cornerstone Skills Graph: AI-powered skills intelligence engine — maps employee skills, identifies gaps, recommends learning, and connects skills to internal mobility. This is the AI/differentiation bet
• EdCast (acquired 2022): Learning experience platform (LXP) — personalized learning journeys, knowledge sharing, content aggregation. Positioned as the modern front-end to the traditional LMS
• Customers buy because: Enterprises need to train employees at scale (compliance, upskilling, reskilling), manage talent processes (performance, succession), and increasingly connect learning to skills and career development. Regulatory compliance (HIPAA, OSHA, financial services training) makes LMS non-discretionary for many industries`,
        date: "2026-03-21T00:00:00Z"
      },
      customers: {
        text: `• Core customer profile: Large enterprise and upper-mid-market — organizations with 1,000+ employees needing structured learning and talent management programs
• ~7,000+ organizations and 125M+ users globally — massive scale
• Key verticals: Healthcare (compliance training — HIPAA, clinical), financial services (regulatory training), manufacturing (safety, compliance), government (workforce development), technology, and retail. Strong in heavily regulated industries where compliance training is mandatory
• Geography: Estimated ~50-55% North America, ~30-35% EMEA (strong European presence, especially post-Saba), ~10-15% APAC. More globally diversified than most US HCM vendors
• Buying drivers: Compliance training mandates (non-discretionary spend), employee upskilling/reskilling in response to AI and automation disruption, talent retention (development as engagement tool), and increasingly skills-based workforce planning. The post-COVID "skills gap" narrative has accelerated investment in learning platforms
• Switching costs are moderate to high — LMS is deeply integrated with HR systems, compliance tracking, and employee records. Migration involves moving course catalogs, completion histories, and compliance records`,
        date: "2026-03-21T00:00:00Z"
      },
      industry: {
        text: `• Learning Management System (LMS) market estimated at ~$18-22B in 2025, growing at ~14-18% CAGR — one of the largest and fastest-growing HCM subcategories
• Broader talent management software market is ~$12-15B, growing at ~10-13% CAGR
• Cornerstone at estimated $700-900M revenue is the largest standalone talent/learning management vendor — ahead of Saba (now integrated), SumTotal, and most LMS competitors. Behind only the mega HCM suites (Workday, SAP SuccessFactors, Oracle HCM) in total talent management
• Tailwind — Skills-based workforce planning: Enterprises shifting from job-based to skills-based talent strategies. Cornerstone's Skills Graph directly addresses this. Time horizon: 5+ years
• Tailwind — AI-powered learning: Personalized learning recommendations, AI-generated content, and adaptive learning paths. Cornerstone investing heavily here. Time horizon: 3-5 years
• Tailwind — Compliance training expansion: New regulations (AI governance, ESG reporting, data privacy) create new mandatory training categories. Time horizon: Permanent and expanding
• Headwind — HCM suite bundling: Workday, SAP SuccessFactors, and Oracle offer LMS as part of integrated HCM suites. "Good enough" bundled learning is the structural threat. Time horizon: Permanent
• Headwind — Modern LXP competition: Newer learning experience platforms (Degreed, 360Learning, Docebo) offer more modern UX and content-first approaches that appeal to L&D innovators. Time horizon: 3-5 years
• Market growth (5yr): LMS market grew at ~13-16% CAGR; LXP segment grew faster at ~20-25% CAGR (estimates based on Gartner, Brandon Hall Group)`,
        date: "2026-03-21T00:00:00Z"
      },
      competitive: {
        text: `• Workday (Learning module): The biggest structural threat. Workday customers can add Learning as a module within their existing HCM suite — no separate vendor needed. "Good enough" for organizations prioritizing HCM integration over LMS depth. Cornerstone wins on LMS feature depth, content breadth, and compliance capabilities
• SAP SuccessFactors (Learning): Same bundling dynamic as Workday. SAP shops can use SuccessFactors Learning. Cornerstone wins on standalone LMS quality and global compliance features
• Docebo (public, ~$200M revenue): Modern cloud LMS growing fast. Wins on UX, AI features, and mid-market appeal. Cornerstone wins on enterprise scale, compliance depth, and installed base
• Degreed: Learning experience platform focused on skills and upskilling. Positions as the "Netflix of learning." Different buyer persona (CLO/L&D innovation) than Cornerstone's traditional HR/compliance buyer
• 360Learning: Collaborative learning platform — peer-to-peer learning and content creation. Growing in European mid-market
• SumTotal (Skillsoft): Legacy LMS competitor. Weaker product investment under Skillsoft ownership. Losing share
• Competitive advantage: Cornerstone is the largest standalone learning and talent management platform by user count (125M+). The combination of LMS + LXP (EdCast) + content library + skills intelligence (Skills Graph) + talent management in one platform is unmatched among standalone vendors. Compliance training depth is a genuine moat in regulated industries
• Best at: Enterprise-scale compliance LMS, breadth of talent management capabilities, global deployment, content library, and regulated industry compliance
• Worst at: Modern UX (legacy platform perception vs. Docebo/Degreed), competing against HCM suite bundling (Workday, SAP), innovation speed under PE cost optimization, and mid-market where modern LMS vendors win on ease of use
• Biggest threat (3yr): Workday and SAP SuccessFactors continuing to improve bundled learning modules — if enterprises decide "good enough" integrated learning is preferable to best-of-breed, Cornerstone's standalone value prop weakens
• Largest opportunity (3yr): Skills-based talent management — if the Skills Graph becomes the standard for connecting learning to skills to careers, Cornerstone captures a strategic workflow that HCM suites don't do well. The AI-powered learning and content personalization angle also justifies premium pricing vs. basic LMS`,
        date: "2026-03-21T00:00:00Z"
      },
      transactions: {
        text: `• 2022: Acquired EdCast — learning experience platform (LXP). Extended the platform from traditional LMS into modern learning experiences, content curation, and knowledge sharing
• Oct 2021: Clearlake Capital completed $5.2B take-private ($57.59/share). Clearlake's thesis centers on operational optimization, Saba integration completion, and platform consolidation
• Apr 2020: Acquired Saba Software for $1.4B — combined the two largest enterprise LMS vendors. Saba had been acquired by Vector Capital (2015) and brought strong EMEA presence and government/public sector customers. Integration has been a multi-year effort
• 2018: Acquired Grovo (microlearning) and Clustree (AI-powered skills mapping, France-based) — early investments in skills intelligence and modern learning formats
• 2011: IPO on Nasdaq (CSOD) at $13/share
• Key M&A context: The Saba acquisition was transformative but integration-heavy. The EdCast acquisition adds the modern LXP layer. Under Clearlake, the focus has been on integration, cost rationalization, and positioning for exit`,
        date: "2026-03-21T00:00:00Z"
      },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "csod1", text: "The Clearlake take-private at $5.2B needs to show meaningful value creation for the exit math to work. Clearlake's playbook is operational optimization and margin expansion — standard for their strategy. The Saba integration was complex and likely consumed significant management attention in 2021-2023. The question is whether the combined platform (Cornerstone + Saba + EdCast) is now stable enough to demonstrate growth acceleration. Watch for subscription growth re-acceleration and net retention improvement as pre-exit indicators.", date: "2026-03-21T00:00:00Z" },
      { id: "csod2", text: "The HCM suite bundling threat is the existential strategic question. Workday and SAP customers can get 'good enough' learning without buying Cornerstone separately. Cornerstone's counter is that compliance-heavy industries need depth that bundled modules can't provide — and the Skills Graph / LXP layer differentiates beyond basic LMS. This argument is valid today but weakens every year as Workday Learning improves. The moat is in regulated industry compliance depth, not general corporate learning.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "calabrio_seed",
    name: "Calabrio",
    sector: "software",
    sub: "application",
    priority: "Watching",
    fields: {
      overview: {
        text: `• Private workforce engagement management (WEM) and contact center analytics software company — provides workforce management (WFM), quality management (QM), analytics, and AI-powered agent performance tools for contact centers
• Founded 2007 as a spinoff from Spanlink Communications; headquartered in Minneapolis, MN
• Originally built on the Cisco contact center platform; expanded to support Genesys, Amazon Connect, and other CCaaS platforms
• Owned by KKR (acquired in Oct 2021 from Clearlake Capital). Clearlake had acquired Calabrio in 2016
• Prior to KKR: Calabrio acquired Teleopti (Sweden-based WFM vendor) in Jun 2019 — transformative deal that doubled the company's scale and added deep European presence
• CEO Kevin Jones (appointed 2019); ~1,500-2,000 employees
• Serves ~7,500+ customers in 90+ countries; manages scheduling and performance for millions of contact center agents globally
• Positioned as the "pure-play WEM" alternative to the large CCaaS vendors (Genesys, NICE, Five9) who bundle WEM into their platforms
• Cloud revenue growing strongly; the company has been transitioning from on-prem to cloud-native SaaS delivery`,
        date: "2026-03-21T00:00:00Z"
      },
      products: {
        text: `• Revenue model: SaaS subscription (per-agent pricing) for cloud deployments; perpetual licenses + maintenance for legacy on-prem. Cloud mix growing rapidly — majority of new bookings are cloud. Professional services and training supplemental
• Calabrio ONE: The unified WEM suite — a single cloud platform combining workforce management, quality management, analytics, and agent empowerment tools. This is the core commercial offering
• Workforce Management (WFM): Forecasting, scheduling, real-time adherence, and intraday management for contact centers. Predicts call volumes and optimizes agent schedules. The largest revenue module and the product Calabrio is best known for. Teleopti acquisition (2019) brought best-in-class WFM algorithms
• Quality Management (QM): Call recording, screen recording, agent evaluation, coaching, and compliance monitoring. Helps supervisors assess and improve agent performance
• Analytics: Interaction analytics (speech and text), sentiment analysis, desktop analytics, and customer journey analytics. AI-powered insights from customer conversations
• Bot Analytics: Monitors and analyzes chatbot and virtual assistant performance — growing in importance as contact centers deploy AI
• Data Management: Calabrio Data Management for compliance, storage, and retrieval of interaction recordings
• Customers buy because: Contact centers need to accurately forecast demand, schedule agents (often the largest operational cost), monitor quality, maintain compliance (PCI-DSS for payment processing, HIPAA for healthcare), and extract insights from customer interactions. WFM alone can save 5-15% of labor costs — the ROI case is clear and quantifiable`,
        date: "2026-03-21T00:00:00Z"
      },
      customers: {
        text: `• Core customer profile: Mid-market to large enterprise contact centers — organizations with 100 to 10,000+ agents. Sweet spot is 200-5,000 agent contact centers
• ~7,500+ customers in 90+ countries; manages scheduling for millions of agents
• Key verticals: Financial services (banks, insurance — compliance-driven), healthcare (HIPAA compliance, patient engagement), retail (high-volume seasonal contact centers), telecommunications, travel/hospitality, government, and utilities. Concentrated in industries with large contact center operations
• Geography: Estimated ~50-55% North America, ~35-40% EMEA (strong European presence via Teleopti heritage — Sweden, UK, Germany, Nordics), ~5-10% APAC. More balanced globally than most US-based contact center vendors
• Buying drivers: Labor is 60-70% of contact center costs — even small improvements in scheduling accuracy and agent utilization deliver material savings. Compliance requirements (call recording, PCI-DSS, HIPAA) make QM non-discretionary. Analytics helps reduce churn, improve first-call resolution, and identify training needs
• Platform flexibility is a key selling point — Calabrio works across CCaaS platforms (Genesys, Amazon Connect, Cisco, Avaya) rather than locking customers into a single vendor's ecosystem`,
        date: "2026-03-21T00:00:00Z"
      },
      industry: {
        text: `• Workforce Engagement Management (WEM) market estimated at ~$4-5B in 2025, growing at ~12-15% CAGR. WFM specifically is the largest sub-segment at ~$2-3B
• Contact Center as a Service (CCaaS) market is ~$25-30B and growing at ~18-22% CAGR — Calabrio benefits from the broader CCaaS migration as contact centers move to cloud
• Calabrio at estimated $250-350M revenue is the largest independent/pure-play WEM vendor — behind only NICE (which bundles WEM into its CXone platform)
• Tailwind — Cloud contact center migration: On-prem contact centers migrating to CCaaS creates greenfield opportunities for cloud WEM. Time horizon: 5-7 years
• Tailwind — AI in contact centers: Conversational AI, agent assist, sentiment analysis, and automated quality scoring are transforming contact center operations. Calabrio integrating AI across the platform. Time horizon: 3-5 years
• Tailwind — Labor cost pressure: Tight labor markets and rising wages make WFM ROI even more compelling — every percentage of scheduling optimization saves real money. Time horizon: Permanent
• Headwind — CCaaS bundling: Genesys, NICE, Five9, and Amazon Connect are all building or acquiring WEM capabilities bundled into their platforms. "Good enough" bundled WFM is the structural threat. Time horizon: Ongoing and intensifying
• Headwind — AI replacing agents: If AI dramatically reduces the number of human agents, the addressable market for WFM and QM shrinks. Time horizon: 3-7 years, uncertain pace
• Market growth (5yr): WEM grew at ~11-14% CAGR; broader CCaaS grew at ~18-22% CAGR (estimates based on Gartner, DMG Consulting)`,
        date: "2026-03-21T00:00:00Z"
      },
      competitive: {
        text: `• NICE (public, WEM integrated into CXone): The dominant competitor. NICE CXone bundles WFM, QM, analytics, and interaction recording into the CCaaS platform. Largest WFM/WEM vendor by revenue. Calabrio competes by being platform-agnostic — works with any CCaaS/contact center vendor, while NICE pushes customers toward CXone lock-in
• Verint (public, ~$900M revenue): Workforce engagement and conversational AI. Historically the other major WEM player alongside NICE. Verint has pivoted toward AI/automation. Competes directly but Verint's complexity and pricing create an opening for Calabrio in the mid-market
• Genesys (private): Building native WEM capabilities into Genesys Cloud CX. Direct bundling threat for Calabrio's Genesys-deployed customer base
• Amazon Connect: AWS building workforce optimization features natively. Still early but the AWS distribution machine is formidable
• Alvaria (Aspect + Noble merger, PE-backed): Legacy WFM competitor. Smaller and losing share but still relevant in installed base
• Competitive advantage: Calabrio is the largest independent pure-play WEM vendor — platform-agnostic across CCaaS environments. Customers who don't want vendor lock-in choose Calabrio. The Teleopti WFM engine is considered best-in-class for scheduling algorithms. Cloud-native architecture is modern relative to legacy competitors. Strong European presence differentiates from US-centric alternatives
• Best at: WFM scheduling accuracy (Teleopti heritage), platform-agnostic deployment, mid-market pricing, and European market coverage
• Worst at: Enterprise scale vs. NICE/Verint, analytics depth vs. NICE, brand awareness vs. larger competitors, and competing against bundled CCaaS WEM
• Biggest threat (3yr): Genesys and Amazon Connect building native WEM that's "good enough" — if the platform vendors close the gap, the pure-play independent WEM value prop weakens
• Largest opportunity (3yr): AI-powered WEM differentiation — if Calabrio can deliver materially better AI analytics, automated QM, and predictive WFM than bundled alternatives, the premium for best-of-breed WEM is justified. The cloud migration wave also creates a 3-5 year window to convert on-prem WFM customers`,
        date: "2026-03-21T00:00:00Z"
      },
      transactions: {
        text: `• Oct 2021: KKR acquired Calabrio from Clearlake Capital. Terms not disclosed. KKR's thesis centers on the cloud transition, AI integration, and expansion of the WEM platform
• Jun 2019: Acquired Teleopti (Sweden) — best-in-class WFM vendor with strong European presence. Transformative deal that doubled scale and added superior scheduling algorithms. Combined entity became the largest independent WEM vendor
• 2016: Clearlake Capital acquired Calabrio — initial PE platform investment that professionalized the company and funded the Teleopti acquisition
• 2007: Founded as a spinoff from Spanlink Communications, initially focused on WFM for Cisco contact center environments
• Key context: KKR has held since Oct 2021 (~4.5 years). Typical hold is 5-7 years, suggesting exit planning in the 2026-2028 window. The cloud transition and AI features are the exit story`,
        date: "2026-03-21T00:00:00Z"
      },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "cal1", text: "The platform-agnostic positioning is Calabrio's key strategic asset and its primary defense against CCaaS bundling. Enterprises increasingly run multi-vendor contact center environments (Genesys for some, Amazon Connect for others, Cisco legacy). A single WEM layer across all platforms is genuinely valuable. The risk is if any single CCaaS vendor achieves enough dominance that multi-vendor WEM becomes unnecessary — but current market fragmentation suggests this is unlikely in the next 3-5 years.", date: "2026-03-21T00:00:00Z" },
      { id: "cal2", text: "KKR at ~4.5 years of ownership is approaching exit territory. The cloud transition and Teleopti integration should be largely complete by now, meaning the company should be demonstrating cloud ARR growth and margin expansion. The most likely exit paths are a strategic sale to a CCaaS vendor (Genesys, Cisco, or a PE-backed platform) or a secondary sale to another PE firm. An IPO is less likely given the company's scale. Watch for advisor mandates or strategic partnership announcements as pre-exit signals.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "qualtrics_seed",
    name: "Qualtrics",
    sector: "software",
    sub: "application",
    priority: "Watching",
    fields: {
      overview: {
        text: `• Private experience management (XM) software platform — helps organizations measure and improve customer experience (CX), employee experience (EX), product experience, and brand experience through surveys, analytics, and AI-driven insights
• Founded 2002 in Provo, UT by Ryan Smith, Jared Smith, Scott Smith, and Stuart Orgill. Started as an online survey tool and evolved into an enterprise experience management platform
• SAP acquired Qualtrics for $8B in Jan 2019 (just days before Qualtrics' planned IPO). SAP then took Qualtrics public again via IPO in Jan 2021 at $30/share (~$15B market cap on first day, peaked at ~$27B)
• Silver Lake and CPP Investments took Qualtrics private again in Jul 2023 for $12.5B ($18.15/share). SAP retained a minority stake. Third time private after being founded private → SAP acquisition → IPO → take-private
• CEO Zig Serafin (appointed 2021, formerly Qualtrics President and Microsoft executive); founder Ryan Smith remains Chairman
• ~6,000 employees; headquartered in Provo, UT and Seattle, WA
• ~20,000+ customers including 85% of the Fortune 500; processes ~3.5B+ survey responses annually
• Revenue ~$1.7B in 2023 (last disclosed); estimated ~$1.9-2.0B+ current. One of the largest pure-play SaaS companies by revenue`,
        date: "2026-03-21T00:00:00Z"
      },
      products: {
        text: `• Revenue model: SaaS subscription — annual or multi-year contracts. Per-user or platform-based pricing depending on the product line. Professional services (implementation, research advisory) are supplemental. Revenue is ~90%+ recurring
• Qualtrics XM Platform: The unified experience management platform — the foundation for all products. Includes survey design, distribution, data collection, analytics, AI/ML-powered insights, and action workflows
• CustomerXM (CX): Customer experience management — NPS surveys, CSAT, customer journey analytics, digital experience analytics, closed-loop ticketing, and frontline team coaching. The largest product line
• EmployeeXM (EX): Employee experience — engagement surveys, pulse surveys, 360 feedback, lifecycle surveys (onboarding, exit), DEI analytics, and manager action planning. Growing segment driven by post-COVID focus on employee engagement
• DesignXM (formerly StrategicResearch): Market research, concept testing, pricing research, and brand tracking. Replaces traditional market research agencies with software-driven research
• Qualtrics AI: AI layer across the platform — Text iQ (sentiment analysis), Stats iQ (statistical modeling), Predict iQ (churn prediction), and XM Discover (conversation analytics from Clarabridge acquisition). Generative AI features for automated insight generation
• Clarabridge (acquired 2021 for $1.1B): Conversation analytics — AI-powered analysis of unstructured customer feedback across social media, reviews, chat, email, and call transcripts. Integrated as XM Discover
• Customers buy because: Need to systematically collect, analyze, and act on experience data across customers and employees. Compliance-driven in some cases (employee engagement surveys mandated by boards). The insight-to-action workflow differentiates from basic survey tools`,
        date: "2026-03-21T00:00:00Z"
      },
      customers: {
        text: `• Core customer profile: Large enterprise — organizations with 5,000+ employees running structured CX and EX programs. Also serves mid-market and academic/research institutions through scaled offerings
• ~20,000+ customers including 85% of the Fortune 500 and 99 of the top 100 US business schools
• Key verticals: Financial services (customer satisfaction, NPS programs), healthcare (patient experience — HCAHPS compliance), technology, retail (customer experience), government/public sector, and higher education/academic research
• Geography: Estimated ~60-65% North America, ~25-30% EMEA, ~5-10% APAC. Growing international presence but still US-centric
• Buying drivers: Customer experience is a C-suite priority — NPS and CSAT are board-level metrics. Employee engagement is a retention and productivity lever. Market research budgets are shifting from agencies to software platforms. Regulatory requirements (HCAHPS in healthcare, employee engagement reporting) make some use cases non-discretionary
• Switching costs are moderate to high — enterprises build complex survey programs, integrations with CRM/HRIS systems, and historical benchmarking data on Qualtrics. Moving disrupts longitudinal data and established workflows`,
        date: "2026-03-21T00:00:00Z"
      },
      industry: {
        text: `• Experience Management (XM) market — Qualtrics essentially created and named this category. The combined TAM across CX software (~$12-15B), EX software (~$3-5B), and market research software (~$5-7B) is ~$20-27B, growing at ~12-15% CAGR
• Survey and feedback software specifically is ~$6-8B, growing at ~10-12% CAGR
• Qualtrics at ~$1.9-2.0B revenue is by far the largest pure-play XM/survey vendor — 5-10x larger than the next independent competitor (Medallia was acquired, SurveyMonkey/Momentive was acquired)
• Tailwind — CX as competitive differentiator: Customer experience quality directly impacts retention and revenue. C-suites continue to invest. Time horizon: Permanent
• Tailwind — Employee experience post-COVID: Hybrid work, retention challenges, and DEI focus have permanently elevated EX as a C-suite priority. Time horizon: 5+ years
• Tailwind — AI-powered insights: GenAI transforms unstructured feedback into actionable insights automatically — reduces the need for research analysts and increases platform value. Time horizon: 3-5 years
• Headwind — Survey fatigue: Consumers and employees are increasingly ignoring surveys — response rates declining. Qualtrics needs to evolve beyond survey-centric collection methods. Time horizon: Ongoing
• Headwind — CRM/HCM bundling: Salesforce (CX), Workday (EX), and Microsoft (Viva) are all adding experience/feedback capabilities bundled into existing platforms. "Good enough" integrated surveys are a structural threat. Time horizon: 3-5 years
• Headwind — Point solution competition: Niche competitors in each category (Medallia/Concentrix in CX, Culture Amp in EX, Dynata in research) chip away at specific use cases. Time horizon: Permanent
• Market growth (5yr): XM/CX software grew at ~12-14% CAGR; EX software grew faster at ~18-22% CAGR; survey tools grew at ~8-10% CAGR (estimates based on Gartner, Forrester)`,
        date: "2026-03-21T00:00:00Z"
      },
      competitive: {
        text: `• Medallia (now Concentrix): Was the closest direct CX competitor before Concentrix acquired it for $1.3B in 2023. Concentrix is integrating Medallia into its CX outsourcing services. Less of a standalone competitive threat now but still relevant in enterprise CX deals
• SurveyMonkey/Momentive (now Momentive): Acquired by Symphony Technology Group. Historically the high-volume survey tool; less enterprise. Not a direct competitor at the enterprise level but commoditizes the survey layer
• Culture Amp: Leading standalone employee experience/engagement platform. Wins in mid-market EX with modern UX. Competes directly with EmployeeXM. Threat in the mid-market where Qualtrics is perceived as expensive
• Salesforce: Adding CX survey and feedback capabilities natively. The CRM + CX bundling threat is real for Salesforce-centric enterprises
• Workday (Peakon): Acquired Peakon (employee engagement) and integrating into Workday HCM. The EX bundling threat for Workday customers
• Microsoft Viva Glint: Microsoft acquired Glint (employee engagement) and embedded in Microsoft Viva. Free/bundled for M365 Enterprise customers. The structural low-end EX threat
• Dynata / Forsta: Market research competitors — Forsta (Confirmit + FocusVision, PE-backed) competes in the research/DesignXM segment
• Competitive advantage: Qualtrics is the only platform covering CX + EX + product experience + market research in one platform. The AI layer (Text iQ, Predict iQ, XM Discover) is more mature than competitors. Scale advantage — 3.5B+ responses processed annually creates data network effects for benchmarking. Academic/research heritage gives credibility
• Best at: Enterprise-scale experience management across CX + EX, AI-powered text and sentiment analytics, academic and market research methodology, and Fortune 500 penetration
• Worst at: Pricing (perceived as expensive, especially for mid-market), UX modernization (legacy survey builder), competing against bundled CX/EX from CRM/HCM vendors, and demonstrating ROI for experience programs
• Biggest threat (3yr): Microsoft Viva Glint commoditizing basic EX surveys for M365 customers, and Salesforce embedding CX feedback natively. Both attack from the bundling angle
• Largest opportunity (3yr): AI-powered experience management — if Qualtrics can demonstrate that AI-driven insights from XM data are materially better than bundled alternatives, it justifies the standalone premium. The convergence of CX + EX data for holistic experience intelligence is a unique value prop no bundled tool can match`,
        date: "2026-03-21T00:00:00Z"
      },
      transactions: {
        text: `• Jul 2023: Silver Lake and CPP Investments completed $12.5B take-private ($18.15/share). SAP retained minority stake. Silver Lake's thesis centers on AI-driven XM platform expansion and operational efficiency
• 2023: Medallia acquired by Concentrix for $1.3B — removed Qualtrics' closest standalone competitor from the market
• 2022: Acquired Clarabridge for $1.1B — conversation analytics and NLP. Became XM Discover, the AI engine for unstructured feedback analysis. The most strategically important acquisition
• Jan 2021: Qualtrics re-IPO'd at $30/share as SAP subsidiary. Briefly reached ~$50+/share. Revenue at IPO was ~$1.1B
• Jan 2019: SAP acquired Qualtrics for $8B — just days before Qualtrics' planned standalone IPO. Controversial timing. SAP's thesis was to pair XM (Qualtrics) with operational data (SAP ERP) — "X-data + O-data." Integration with SAP was limited in practice
• 2014-2018: Raised ~$400M from Accel, Sequoia, Insight Partners at valuations up to $2.5B pre-SAP
• Key context: Silver Lake at ~3 years of ownership. Typical hold for Silver Lake is 5-7 years. The AI transformation and operational efficiency are the near-term value creation levers. Re-IPO in the 2026-2028 window at a premium to the $12.5B take-private is the likely exit path`,
        date: "2026-03-21T00:00:00Z"
      },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "qx1", text: "The $12.5B take-private by Silver Lake represents a significant discount to Qualtrics' peak public valuation (~$27B in 2021) but still prices the business at ~7x revenue — premium for a company with mid-teens growth. Silver Lake needs to re-accelerate growth and demonstrate AI-driven value to justify a re-IPO at $15-20B+. The key metrics to watch are subscription revenue growth, net retention rate, and AI feature adoption. If growth re-accelerates to 20%+ with expanding margins, the re-IPO math works.", date: "2026-03-21T00:00:00Z" },
      { id: "qx2", text: "The bundling threat from Microsoft (Viva Glint), Salesforce (CX), and Workday (Peakon) is real but often overstated. Qualtrics' customers are running sophisticated, multi-program XM initiatives that bundled point solutions can't replicate. The risk is at the low end — enterprises that were considering basic surveys may now use bundled tools instead. Qualtrics' opportunity is to move further up the value chain toward AI-driven experience intelligence, where bundled alternatives can't follow. The Clarabridge acquisition was the right move for this reason.", date: "2026-03-21T00:00:00Z" },
      { id: "qx3", text: "Qualtrics' ownership history is remarkable — private → SAP ($8B) → re-IPO → Silver Lake ($12.5B) in just 5 years. Each transaction generated returns for the seller. The SAP chapter was widely considered a strategic failure — the 'X-data + O-data' thesis never materialized in practice and SAP ultimately divested. Silver Lake's thesis is simpler: optimize operations, accelerate AI, and re-IPO as a standalone. The question is whether the experience management category has enough growth runway to justify standalone SaaS multiples, or whether it's a feature that eventually gets absorbed into CRM and HCM platforms.", date: "2026-03-21T00:00:00Z" }
    ]
  }
];

async function run() {
  for (const co of companies) {
    console.log(`Inserting ${co.name}...`);

    // Insert company
    const { error: coErr } = await supabase.from('companies').upsert({
      id: co.id, name: co.name, sector: co.sector, sub: co.sub, priority: co.priority || ''
    }, { onConflict: 'id' });
    if (coErr) { console.error(`  Company error:`, coErr); continue; }

    // Insert fields
    for (const [key, val] of Object.entries(co.fields)) {
      if (!val.text) continue;
      const { error: fErr } = await supabase.from('company_fields').upsert({
        company_id: co.id, field_key: key, text: val.text, date: val.date || null
      }, { onConflict: 'company_id,field_key' });
      if (fErr) console.error(`  Field ${key} error:`, fErr);
    }

    // Insert notes
    for (const note of (co.notes || [])) {
      const { error: nErr } = await supabase.from('company_notes').upsert({
        id: note.id, company_id: co.id, text: note.text, date: note.date
      }, { onConflict: 'id' });
      if (nErr) console.error(`  Note error:`, nErr);
    }

    console.log(`  Done.`);
  }
  console.log('\nAll companies inserted.');
}

run().catch(console.error);
