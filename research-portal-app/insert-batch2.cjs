require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const companies = [
  {
    id: "presidio_seed", name: "Presidio", sector: "itservices", sub: "consulting", priority: "Watching",
    fields: {
      overview: { text: `• Private IT solutions provider and digital transformation services company — designs, sells, deploys, and manages IT infrastructure, cloud, security, and digital solutions for enterprises
• Founded 2004 through a merger of multiple IT resellers; headquartered in New York, NY
• Owned by CD&R (Clayton, Dubilier & Rice) since Feb 2019 acquisition from BC Partners. BC Partners had acquired Presidio from buyout sponsors in 2015
• CEO Bob Cagnazzi (long-tenured, led through multiple PE cycles)
• ~3,000+ employees; operates across the US with ~60 offices
• Revenue estimated at $3.5-4.5B+ — one of the largest private IT solutions providers in North America
• Value-added reseller (VAR) heritage but has strategically shifted toward managed services, cloud, and consulting to increase recurring revenue and margins
• Key vendor partnerships: Cisco (historically the largest), Dell, HPE, Palo Alto Networks, AWS, Azure, Google Cloud — Presidio's value is assembling multi-vendor solutions
• Named to CRN Solution Provider 500 and recognized as a top Cisco partner globally`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Mix of product resale (hardware/software — lower margin, transactional), professional services (project-based), and managed/cloud services (recurring, higher margin). The strategic shift is toward recurring managed services to improve margin profile and valuation
• IT Infrastructure Solutions: Design, deployment, and management of enterprise networking, data center, collaboration, and compute infrastructure. Cisco, Dell, HPE are primary vendors. This is the legacy core — high revenue, lower margin
• Cloud Solutions: Multi-cloud strategy, migration, and management across AWS, Azure, and GCP. Cloud architecture, DevOps, and FinOps consulting. Growing segment as enterprises move workloads
• Cybersecurity: Security architecture, managed security services (MSSP), zero-trust implementation, and incident response. Partners with Palo Alto Networks, CrowdStrike, Fortinet. Fast-growing given the threat landscape
• Digital Infrastructure: Data center modernization, hyper-converged infrastructure, storage, and networking upgrades
• Managed Services: Ongoing IT operations management, monitoring, help desk, and NOC/SOC services delivered on a recurring contract basis. This is the margin and valuation driver — PE sponsors want to grow this as a % of total revenue
• Consulting & Advisory: IT strategy, digital transformation roadmaps, and technology assessments
• Customers buy because: Enterprises need help navigating complex multi-vendor IT environments. They lack the internal expertise to design, deploy, and manage infrastructure across networking, cloud, and security from multiple vendors. Presidio acts as the integrator and ongoing managed services provider`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Mid-market to large enterprise — organizations with complex IT environments requiring multi-vendor integration, managed services, and ongoing support. Sweet spot is 1,000-50,000 employees
• Key verticals: Financial services, healthcare, government (federal and state/local), education, retail, and manufacturing. Diversified across industries
• Geography: Primarily US — ~60 offices across the country. Limited international presence. Estimated 95%+ North America
• Buying drivers: IT complexity is increasing — hybrid cloud, security threats, and multi-vendor environments require specialist integrators. Enterprises that can't or won't build large internal IT teams outsource to providers like Presidio. The managed services component provides ongoing operational support
• Customer relationships are typically long-term — once Presidio deploys and manages infrastructure, switching is disruptive`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• IT solutions/VAR market in North America is ~$200-250B including hardware resale; the higher-value managed services and consulting segment is ~$60-80B, growing at ~8-12% CAGR
• Presidio at ~$3.5-4.5B revenue is among the top 10-15 IT solutions providers in the US, behind CDW (~$21B), Insight Enterprises (~$9B), and SHI (~$14B)
• Tailwind — Hybrid cloud migration: Enterprises moving to multi-cloud need integrators to design and manage hybrid environments. Time horizon: 5+ years
• Tailwind — Cybersecurity spending: Every enterprise is increasing security budgets. Managed security services is one of the fastest-growing segments. Time horizon: Permanent
• Tailwind — Managed services growth: Enterprises outsourcing IT operations to focus on core business. Recurring revenue model is attractive to PE. Time horizon: 5+ years
• Headwind — Hardware resale margin compression: Vendor-direct sales and marketplace purchasing compress resale margins. Time horizon: Permanent
• Headwind — Hyperscaler disintermediation: AWS, Azure, GCP selling directly to enterprises reduces the role of intermediaries for cloud-native workloads. Time horizon: Ongoing
• Market growth (5yr): IT solutions market grew at ~5-7% CAGR overall; managed services grew faster at ~10-14% CAGR (estimates)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• CDW (public, ~$21B revenue): The dominant IT solutions provider. Much larger scale, broader product catalog, and public company resources. Presidio competes on deeper solution design and managed services rather than volume resale
• SHI International (private, ~$14B revenue): Largest private IT solutions provider. Similar model but more focused on software licensing and asset management. Less services-heavy than Presidio
• Insight Enterprises (public, ~$9B revenue): Direct competitor in cloud, infrastructure, and managed services. Similar strategic shift toward services
• World Wide Technology (private, ~$17B revenue): Advanced technology solutions with deep lab/testing capabilities. Strong in federal/government. Competes on solution complexity
• Ahead (private): Smaller but similar positioning in cloud and managed services. More focused on a narrow set of vendor partnerships
• Competitive advantage: Presidio differentiates on solution design depth — not just reselling hardware but architecting complex multi-vendor environments and providing ongoing managed services. The Cisco partnership depth is a key asset. The managed services pivot increases stickiness vs. transactional resale competitors
• Best at: Multi-vendor solution design, Cisco ecosystem depth, managed services for mid-market, and security consulting
• Worst at: Scale vs. CDW/SHI, cloud-native consulting vs. born-in-cloud firms (Accenture Cloud, 2nd Watch), and international presence
• Biggest threat (3yr): Hyperscaler-direct sales reducing the integrator role for cloud workloads; CDW acquiring managed services capabilities through M&A
• Largest opportunity (3yr): Growing managed services as % of revenue — if Presidio can shift from 30-40% recurring to 50%+, the business deserves a meaningfully higher valuation multiple at exit`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Feb 2019: CD&R acquired Presidio from BC Partners. Terms not disclosed. CD&R's thesis centers on accelerating the managed services transition and growing the higher-margin recurring revenue streams
• 2015: BC Partners acquired Presidio — professionalized the business and grew revenue
• Under CD&R ownership: Invested in expanding cloud, security, and managed services capabilities. Organic growth supplemented by selective tuck-in acquisitions
• CD&R has held since Feb 2019 (~7 years) — at or past typical PE hold period. Exit planning is likely active`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "pres1", text: "CD&R at 7 years of ownership is past the typical hold period. The exit story depends on demonstrating that Presidio has successfully shifted from a hardware resale business (low margins, transactional) to a managed services and cloud solutions business (recurring, higher margins). The managed services mix as a percentage of total revenue is the single most important metric for exit valuation — the difference between 4-5x EBITDA (reseller multiple) and 8-12x EBITDA (services/recurring multiple) is massive.", date: "2026-03-21T00:00:00Z" },
      { id: "pres2", text: "The IT solutions provider space is consolidating rapidly. CDW, Insight, and others are acquiring to build scale and services capabilities. Presidio could be an acquisition target for a larger player seeking managed services revenue and Cisco ecosystem depth, or it could go to another PE sponsor in a secondary sale. The CD&R exit is the near-term catalyst to watch.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "ahead_seed", name: "Ahead", sector: "itservices", sub: "managed", priority: "Watching",
    fields: {
      overview: { text: `• Private IT services and consulting company focused on cloud, infrastructure, security, and managed services for mid-market and enterprise clients
• Founded 2007; headquartered in Chicago, IL
• Owned by Centerbridge Partners (acquired in 2021). Previous ownership included GI Partners
• CEO Daniel Kiely
• ~1,200-1,500 employees; primarily US-based operations
• Revenue estimated at $1-1.5B — smaller than the mega-VARs (CDW, SHI) but growing through managed services and consulting
• Differentiated by a "services-first" approach vs. traditional hardware resale — positions as a consultancy that also provides solutions rather than a reseller that also does services
• Key partnerships: Dell, VMware, AWS, Azure, Cisco, Palo Alto Networks, Nutanix
• Acquired RoundTower Technologies (2020) and other tuck-ins to expand geographic reach and services capabilities`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Mix of product resale, professional services (project-based consulting), and managed services (recurring contracts). Strategic focus on growing managed services and consulting revenue as a percentage of total
• Cloud Services: Multi-cloud architecture, migration, optimization, and management. AWS and Azure partnerships are core. Helps enterprises design and operate hybrid cloud environments
• Infrastructure Modernization: Data center transformation, hyper-converged infrastructure (HCI), server/storage upgrades, and network modernization. Dell and Nutanix are key vendor partners
• Security Services: Security assessments, zero-trust architecture, managed detection and response (MDR), and compliance consulting. Growing segment driven by threat landscape
• Managed Services: Ongoing IT operations management including monitoring, patching, help desk, and cloud management delivered as recurring contracts. The margin and valuation driver
• Digital Workplace: End-user computing, collaboration tools, and workspace modernization
• Data Analytics: Data platform design, business intelligence, and analytics consulting
• Customers buy because: Need expert guidance navigating complex IT modernization — cloud migration, security hardening, infrastructure refresh — without building large internal teams. AHEAD's consulting-led approach means they design the solution first, then implement and manage it`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Mid-market to large enterprise — organizations with 500-20,000 employees undergoing IT modernization
• Key verticals: Financial services, healthcare, manufacturing, technology, retail. Diversified but concentrated in industries with significant infrastructure needs
• Geography: Primarily US — headquartered in Chicago with offices across the Midwest, Southeast, and East Coast. Limited international presence
• Buying drivers: IT modernization pressure — legacy infrastructure needs to be refreshed, cloud migration is a priority, and security threats require professional help. Mid-market companies in particular lack the internal expertise that large enterprises can hire directly`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Same IT solutions and managed services market as Presidio — total North America market ~$200-250B; managed services and consulting sub-segment ~$60-80B growing at ~8-12% CAGR
• AHEAD at ~$1-1.5B is a mid-tier player — larger than boutique consultancies but smaller than CDW, SHI, Presidio, and WWT
• Tailwinds: Same structural drivers — cloud migration, security spending, managed services outsourcing. Time horizon: 5+ years
• Headwinds: Same challenges — hardware margin compression, hyperscaler direct, and competition from both larger VARs and cloud-native consultancies. Time horizon: Ongoing
• Market growth (5yr): IT solutions grew at ~5-7% CAGR; managed services at ~10-14% (estimates)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• CDW, SHI, Presidio, WWT, Insight: All larger IT solutions providers. AHEAD differentiates on being more consultative and services-led rather than volume resale. Smaller scale is a disadvantage for large enterprise deals but an advantage in personalized mid-market service
• Trace3: Similar size and positioning — cloud, infrastructure, security consulting. Most direct competitor
• Accenture / Deloitte (IT consulting): Compete for the same cloud and digital transformation budgets but at much higher price points and for much larger engagements
• Competitive advantage: Consulting-first culture, mid-market focus, strong Midwest/regional relationships, and ability to move faster than the mega-VARs on complex projects
• Best at: Mid-market cloud and infrastructure consulting, personalized service, and speed of delivery
• Worst at: Scale for large enterprise deals, national coverage vs. CDW/SHI, and brand recognition outside the Midwest`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2021: Centerbridge Partners acquired AHEAD from GI Partners. Terms not disclosed
• 2020: Acquired RoundTower Technologies — expanded managed services and geographic reach into Southeast US
• Under Centerbridge ownership: continued investment in cloud and managed services capabilities, selective tuck-in acquisitions
• Centerbridge at ~5 years of ownership — approaching typical exit window`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "ahead1", text: "AHEAD is a classic PE-backed IT services roll-up story — acquire a mid-market IT consultancy, grow managed services mix, bolt on tuck-in acquisitions for geographic expansion, and exit at a higher services multiple. The playbook is identical to Presidio, Trace3, and dozens of other PE-backed IT solutions providers. The differentiator would need to be meaningful managed services ARR growth and margin expansion to stand out in a crowded market.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "trace3_seed", name: "Trace3", sector: "itservices", sub: "consulting", priority: "Watching",
    fields: {
      overview: { text: `• Private IT solutions and consulting firm specializing in data intelligence, cloud, security, and infrastructure for mid-market and enterprise clients
• Founded 2002; headquartered in Irvine, CA
• Owned by H.I.G. Capital (acquired majority stake in 2021)
• CEO Reggie Thompson
• ~1,200+ employees; primarily US operations with offices across the West Coast, Southwest, and expanding nationally
• Revenue estimated at $1.5-2.5B — mid-tier IT solutions provider
• Differentiated by a "data-first" consulting approach — positions as a data intelligence and innovation consultancy rather than a traditional reseller
• Key partnerships: Dell, Cisco, Palo Alto Networks, Pure Storage, Nutanix, AWS, Azure, Google Cloud
• Innovation lab ("Trace3 Labs") for testing emerging technologies — AI/ML, edge computing, IoT — before recommending to clients`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Product resale (hardware/software), professional services, and growing managed services. Similar mix to peers but emphasizes consulting and data intelligence as differentiators
• Data Intelligence: Data strategy, analytics, AI/ML consulting, data engineering, and data platform design. The strategic differentiator — Trace3 leads with data consulting rather than infrastructure resale
• Cloud Solutions: Multi-cloud architecture, migration, and optimization. AWS, Azure, GCP partnership depth
• Cybersecurity: Security assessments, SIEM/SOAR implementation, zero-trust, and managed security services. Palo Alto Networks is a key partner
• Infrastructure: Data center modernization, networking, compute, and storage. Dell, Pure Storage, Nutanix are key vendors
• Innovation & Emerging Tech: Trace3 Labs evaluates emerging technologies (AI, edge, IoT) and advises clients on adoption — a consulting-led differentiator
• Managed Services: Monitoring, management, and operational support on a recurring basis
• Customers buy because: Need a technology partner that understands how to extract business value from data and emerging technologies, not just deploy infrastructure. The innovation lab and data intelligence focus attract clients looking for strategic guidance`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Mid-market to large enterprise — 500-25,000 employees. Strong in technology, financial services, healthcare, media/entertainment (LA/West Coast presence), and retail
• Geography: Originally West Coast focused (CA, AZ, NV, CO); expanding nationally under H.I.G. ownership. Estimated 95%+ US revenue
• Buying drivers: Enterprises need partners who can advise on data strategy and emerging technology adoption, not just sell hardware. Trace3's consulting-led approach appeals to CIOs and CTOs looking for innovation partners`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Same IT solutions market dynamics as Presidio and AHEAD — $200-250B total market, $60-80B services sub-segment
• Trace3 at ~$1.5-2.5B is a mid-tier player with a data/innovation differentiation angle
• Same tailwinds (cloud, security, managed services) and headwinds (margin compression, hyperscaler direct) as peers
• The data intelligence and AI consulting angle is genuinely differentiated and positions Trace3 well as enterprises invest in AI readiness`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Same competitive set as Presidio and AHEAD — CDW, SHI, WWT, Insight, Presidio, AHEAD
• Trace3 differentiates on the innovation/data intelligence angle — more consultative than pure resellers, more infrastructure-savvy than pure consultancies
• The Trace3 Labs concept is a genuine differentiator — clients can test emerging technologies in a lab environment before committing
• Best at: Data intelligence consulting, West Coast enterprise relationships, innovation advisory, and emerging technology evaluation
• Worst at: Scale vs. CDW/SHI, national coverage (expanding but still regional), and competing against large consultancies (Accenture, Deloitte) for pure strategy engagements`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2021: H.I.G. Capital acquired majority stake in Trace3. Terms not disclosed. H.I.G.'s thesis centers on national expansion and growing the data intelligence consulting practice
• Under H.I.G. ownership: geographic expansion beyond the West Coast, investment in managed services, and selective acquisitions
• H.I.G. at ~5 years of ownership — approaching exit window`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "tr1", text: "The data intelligence positioning is the right strategic move for an IT solutions provider. In a market full of interchangeable resellers, leading with data consulting and innovation labs creates a genuine differentiation story. The question is whether this translates to sustainably higher margins than peers or is primarily a marketing distinction. If Trace3 can demonstrate higher consulting revenue as a % of total vs. pure resellers, the exit multiple should reflect the premium positioning.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "perficient_seed", name: "Perficient", sector: "itservices", sub: "consulting", priority: "Watching",
    fields: {
      overview: { text: `• Private digital transformation consulting and IT services firm — provides strategy, design, development, and managed services for enterprise digital platforms
• Founded 1997; headquartered in St. Louis, MO
• Taken private by EQT Partners in Feb 2025 for ~$3B ($76/share, 58% premium to unaffected price). Previously publicly traded on Nasdaq (PRFT) since 1999
• CEO Tom Hogan; ~7,100+ professionals ("colleagues") as of the take-private
• Revenue ~$920M in 2024 (last public fiscal year)
• Operates a global delivery model — significant nearshore capabilities in Latin America (Colombia, Mexico) and offshore in India, China, and Eastern Europe
• Core platform expertise: Adobe, Salesforce, Microsoft, AWS, Google Cloud, Sitecore, and healthcare IT systems (Epic, Oracle Health)
• Named a leader by multiple analyst firms in digital experience, digital commerce, and cloud services
• 20+ years of public company history; the EQT take-private is the most significant ownership change in the company's history`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Predominantly professional services — time-and-materials and fixed-price project contracts. Growing managed services (recurring) and platform licensing/subscriptions. Services are ~85-90% of revenue
• Digital Strategy & Transformation: Business consulting, digital strategy, customer journey mapping, and operating model design. The front-end advisory that drives larger implementation engagements
• Digital Experience (DX): Website design, content management, personalization, and digital commerce on Adobe, Sitecore, Optimizely, and Salesforce Commerce Cloud. Largest service line — Perficient is a top-tier Adobe and Sitecore partner
• Cloud & Platform: Cloud migration, application modernization, DevOps, and platform engineering on AWS, Azure, and Google Cloud. Growing fast as enterprises modernize
• Data & Intelligence: Data engineering, analytics, AI/ML, and business intelligence. Helping enterprises build data platforms and deploy AI
• Product Development & Innovation: Custom application development, mobile apps, IoT solutions, and emerging technology implementation
• Healthcare IT: Specialized practice in Epic, Oracle Health (Cerner), and healthcare interoperability. Strong niche — healthcare IT consulting is complex and requires deep domain expertise
• Managed Services: Application management, infrastructure operations, and ongoing support on a recurring basis. The PE play is to grow this segment
• Customers buy because: Need expert help implementing and customizing enterprise digital platforms (Adobe, Salesforce, Epic). Internal teams lack the specialized skills. Global delivery model offers cost-effective execution via nearshore/offshore`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Large enterprise and upper-mid-market — organizations with complex digital platform needs. Fortune 1000 companies are the primary target
• ~300+ active clients across diversified industries
• Key verticals: Healthcare (Epic/Cerner implementations — high-value, sticky), financial services, retail/consumer (digital commerce), manufacturing, automotive, telecommunications, and energy
• Healthcare is the standout vertical — Perficient is one of the largest independent healthcare IT consulting firms in the US
• Geography: Estimated ~80% North America, ~20% international (primarily delivered through nearshore/offshore model). Revenue is US-centric but delivery is global
• Buying drivers: Enterprises need specialized consultants to implement and customize complex platforms. Adobe Experience Manager, Salesforce, Epic — these require deep domain and platform expertise that generalist consultancies don't have at the same depth`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Digital transformation consulting and IT services market is ~$500-700B globally; the US mid-market segment where Perficient primarily competes is ~$50-80B
• Perficient at ~$920M revenue is a mid-tier digital consultancy — below the Big 4/Accenture but above boutique firms. Comparable to Publicis Sapient, Thoughtworks, and EPAM in positioning
• Tailwind — Digital transformation spending: Enterprise digital budgets continue to grow as customer experience, cloud, and data become strategic priorities. Time horizon: 5+ years
• Tailwind — Healthcare IT modernization: Epic and Oracle Health implementations are multi-year, multi-million-dollar engagements. Healthcare IT is a secular growth area. Time horizon: 5-10 years
• Tailwind — AI implementation services: Enterprises need help deploying AI — creating demand for consulting around data readiness, model development, and integration. Time horizon: 3-5 years
• Headwind — Project-based revenue volatility: Consulting revenue can be cyclical — enterprise clients cut discretionary IT projects in downturns. Time horizon: Cyclical risk
• Headwind — Offshore competition: Indian IT services firms (TCS, Infosys, Wipro) offer lower-cost delivery. Perficient's nearshore model is more expensive than pure offshore. Time horizon: Permanent
• Market growth (5yr): IT consulting grew at ~7-10% CAGR; digital-specific consulting grew at ~12-15% CAGR (estimates)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Accenture (~$65B revenue): The dominant digital consultancy. Competes for the same large enterprise clients. Perficient wins on price, speed, and mid-market focus where Accenture is overkill
• EPAM Systems (public, ~$3.7B revenue): Digital platform engineering — similar positioning but more focused on software engineering. Stronger in product development; Perficient stronger in platform implementation
• Publicis Sapient (~$3B revenue): Digital transformation consulting within Publicis Groupe. Similar service mix and client profile
• Thoughtworks (public): Technology consulting focused on modern engineering practices. More developer-centric; Perficient is more platform-implementation-centric
• Indian IT firms (TCS, Infosys, Wipro, HCL): Compete on price for delivery-heavy engagements. Perficient's nearshore model is a middle ground between US onshore and India offshore
• Competitive advantage: Deep platform expertise (Adobe #1 partner status, Epic/healthcare specialization), nearshore delivery model (better timezone alignment and cultural fit than offshore), and mid-market focus where the Big 4 are too expensive and boutiques lack scale
• Best at: Adobe/Sitecore implementations, healthcare IT (Epic/Oracle Health), mid-market digital transformation, and nearshore delivery economics
• Worst at: Scale vs. Accenture/EPAM, pure software engineering (loses to Thoughtworks/EPAM), and price competitiveness vs. offshore Indian firms
• Biggest threat (3yr): AI automating routine consulting work (code generation, testing, documentation) reducing billable hours. Also offshore firms moving up the value chain
• Largest opportunity (3yr): Healthcare IT growth — Epic implementations are multi-year and Perficient is a top-3 Epic services partner. AI implementation services are a greenfield opportunity. Under EQT ownership, international expansion and M&A could accelerate growth significantly`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Feb 2025: EQT Partners completed ~$3B take-private of Perficient ($76/share, 58% premium). EQT's thesis centers on accelerating international expansion, growing managed services, and investing in AI capabilities. Largest transaction in Perficient's history
• Pre-take-private: Perficient made ~20+ acquisitions over its public company history, including Overactive (Latin America delivery, 2021), Brainjocks (Sitecore, 2020), and multiple healthcare IT consultancies
• 1999: IPO on Nasdaq (PRFT)
• Key context: EQT is a European PE firm with deep technology services expertise. The international expansion angle is significant — Perficient has been US-centric, and EQT can leverage its global network to expand into EMEA and APAC`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "perf1", text: "The EQT take-private at $3B (~3.3x revenue) is a fair price for a mid-tier IT consultancy with 7%+ organic growth and expanding margins. The 58% premium was generous and reflects EQT's conviction in the platform thesis. The key value creation levers are: (1) international expansion via EQT's network, (2) growing managed services from ~15% to 25%+ of revenue, (3) bolt-on M&A in healthcare IT and AI services, and (4) nearshore delivery expansion in Latin America. If EQT can grow revenue to $1.3-1.5B with improved margins, a 2028-2030 exit at $5-6B is achievable.", date: "2026-03-21T00:00:00Z" },
      { id: "perf2", text: "Healthcare IT is Perficient's most defensible moat. Epic implementations are extraordinarily complex, require deep domain expertise, and take 2-5 years. Once a hospital system selects an implementation partner, switching mid-project is nearly impossible. Perficient is a top-3 Epic services partner — this creates a recurring pipeline of multi-million-dollar engagements that is largely recession-resistant (hospitals must modernize regardless of macro conditions). This practice alone could justify premium valuation.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "synechron_seed", name: "Synechron", sector: "itservices", sub: "consulting", priority: "Watching",
    fields: {
      overview: { text: `• Private digital transformation consulting and technology services firm focused exclusively on financial services — banking, insurance, capital markets, and wealth management
• Founded 2001; dual-headquartered in New York, NY and Pune, India
• Owned by Ares Management (acquired majority stake in 2023). Previous investor was Avaequity (SMBC Group)
• CEO and Founder Faisal Husain — founder-led since inception
• ~18,000+ employees globally across the US, UK, Europe, Middle East, Asia, and Australia
• Revenue estimated at $1-1.5B — one of the largest pure-play financial services IT consultancies
• Exclusively focused on financial services — this vertical specialization is the core differentiator vs. horizontal IT consultancies
• Key capabilities: Digital transformation, core banking modernization, regulatory/compliance technology, AI/ML, blockchain, cloud migration, and data analytics — all purpose-built for financial services use cases`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Professional services (time-and-materials and fixed-price), managed services, and platform/accelerator licensing. Services are the vast majority of revenue. Offshore delivery from India provides margin advantage
• Digital Advisory & Consulting: Strategy, operating model design, and technology roadmaps for financial institutions. Front-end advisory that leads to larger implementation engagements
• Core Banking & Insurance Modernization: Implementation and migration of core banking platforms (Temenos, FIS, Finastra), insurance platforms, and capital markets systems. Complex, multi-year engagements
• Regulatory & Compliance Technology: RegTech consulting — KYC/AML, Basel III/IV, MiFID II, DORA, and other regulatory compliance implementations. Non-discretionary spend for financial institutions
• AI & Machine Learning: AI-powered risk modeling, fraud detection, robo-advisory, and intelligent automation for financial services. Growing practice
• Data & Analytics: Data engineering, analytics platforms, and data governance for financial institutions
• Cloud Migration: Moving financial services workloads to cloud (AWS, Azure, GCP) with regulatory compliance considerations unique to banking/insurance
• Blockchain & Digital Assets: Distributed ledger technology consulting for capital markets, trade finance, and digital asset custody
• Customers buy because: Financial services technology is uniquely complex — regulatory requirements, legacy core systems, real-time transaction processing, and data sensitivity create challenges that horizontal consultancies can't address with the same depth. Synechron's FS-only focus means every consultant understands the domain`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Large financial institutions — global banks, insurers, asset managers, capital markets firms, and payments companies. Enterprise-focused with average deal sizes in the multi-million dollar range
• Clients include many of the world's largest banks and financial institutions (specific names not disclosed)
• Key verticals: Banking (retail and commercial), capital markets (trading, post-trade), insurance, wealth/asset management, and payments/fintech. 100% financial services
• Geography: Truly global — US (~35-40%), UK/Europe (~30-35%), Asia-Pacific (~15-20%), Middle East (~5-10%). The global footprint is important because large banks operate globally and want consulting partners with matching geographic coverage
• Buying drivers: Regulatory compliance is the non-discretionary driver — financial institutions must modernize systems to meet evolving regulations (Basel III/IV, DORA, open banking). Legacy core banking systems are 20-30 years old and need replacement. Digital customer experience expectations are rising`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Financial services IT consulting and technology services market is ~$80-120B globally, growing at ~8-12% CAGR
• Synechron at ~$1-1.5B is a large pure-play FS consultancy — comparable to Sapient Global Markets (now Publicis Sapient FS) and Capco in positioning, though broader in technology services
• Tailwind — Core banking modernization: Legacy systems replacement is a multi-decade cycle. Banks are spending billions on core modernization. Time horizon: 10+ years
• Tailwind — Regulatory technology: Regulatory requirements keep expanding (DORA in EU, Basel IV, open banking). Compliance spending is non-discretionary. Time horizon: Permanent
• Tailwind — AI in financial services: Banks are among the largest AI adopters. AI consulting for risk, fraud, and automation is growing rapidly. Time horizon: 5+ years
• Headwind — Offshore pricing pressure: Indian IT firms (TCS, Infosys, Wipro) compete aggressively on price for financial services delivery. Time horizon: Permanent
• Headwind — Consulting spend cyclicality: Banks cut discretionary consulting in downturns. Time horizon: Cyclical risk`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Accenture (FS practice ~$10B+): The dominant financial services consultancy. Unmatched scale and breadth. Synechron wins on FS-only specialization and price
• Capco (Wipro, ~$1B revenue): Pure-play FS management and technology consulting. Most direct competitor in positioning. Capco is more management consulting; Synechron is more technology delivery
• TCS / Infosys / Wipro (FS practices): Large FS technology practices with offshore delivery. Compete on price. Synechron differentiates on domain expertise and consulting depth
• Publicis Sapient (FS practice): Digital transformation for banking. Similar positioning but part of larger Publicis group
• Competitive advantage: 100% financial services focus means every consultant, accelerator, and methodology is purpose-built for FS. The domain expertise depth is the moat — understanding bank regulatory requirements, core systems, and risk management at a level horizontal consultancies can't match
• Best at: Core banking modernization, regulatory compliance technology, and deep FS domain expertise
• Worst at: Scale vs. Accenture/TCS, non-FS diversification (single-industry concentration risk), and competing on price vs. pure offshore`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2023: Ares Management acquired majority stake in Synechron. Terms not disclosed. Ares' thesis centers on scaling the platform through organic growth and M&A in financial services technology
• Earlier: SMBC Group (via Avaequity) was a previous strategic investor
• Under Ares ownership: expected to pursue bolt-on acquisitions in FS-specific technology capabilities (AI, RegTech, core banking)
• Ares at ~3 years of ownership — early in the hold period with significant runway for growth`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "syn1", text: "The pure-play financial services focus is a genuinely defensible positioning. Banks prefer FS-specialist consultancies for complex core systems and regulatory work because the domain knowledge gap is too large for generalists to bridge quickly. The 18,000+ employee scale with founder-led management creates operational stability. Under Ares, the play is likely scale through M&A — acquiring smaller FS-focused consultancies to build a $2-3B platform that can compete with Accenture's FS practice on specialization while offering more competitive pricing.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "datasite_seed", name: "Datasite", sector: "software", sub: "application", priority: "Watching",
    fields: {
      overview: { text: `• Private SaaS platform for M&A deal management — provides virtual data rooms (VDRs), deal marketing, due diligence management, and AI-powered deal analytics for investment banks, PE firms, law firms, and corporates
• Originally founded as Merrill Corporation in 1968 (document management and printing); rebranded to Datasite in 2021 to reflect its software-first identity
• Owned by Harvest Partners (acquired in 2023 from private equity consortium of Siris Capital, Investcorp, and management). Previous ownership by DG FastChannel and various PE sponsors
• CEO Russ Hissom
• ~2,000+ employees globally; headquartered in Minneapolis, MN with offices in New York, London, Hong Kong, Sydney, and other financial centers
• Processes ~12,000+ deals annually across M&A, capital markets, restructuring, and other transactions
• Revenue estimated at $500-700M; predominantly recurring SaaS subscription with per-deal transaction components
• Market leader in virtual data rooms alongside Intralinks (SS&C) — the two dominant platforms for M&A due diligence`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: SaaS subscription with per-deal and per-page/per-user components. Recurring platform fees plus transaction-based pricing for individual deals. Revenue correlates with M&A deal volume — more deals = more revenue
• Virtual Data Room (VDR): The core product — secure document sharing platform for M&A due diligence. Sellers upload confidential documents, buyers review them under strict access controls. AI-powered document indexing, redaction, and Q&A management. This is what Datasite is known for
• Datasite Diligence: Enhanced due diligence workflow management — task tracking, checklists, analytics, and collaboration tools layered on top of the VDR
• Datasite Prepare: AI-powered deal preparation — helps sellers organize, index, and redact documents before uploading to the VDR. Reduces deal preparation time by weeks
• Datasite Acquire: Buy-side deal management — pipeline tracking, CIM distribution, and acquisition workflow management for PE firms and corporate development teams
• Datasite Outreach: Deal marketing and buyer outreach — targeted marketing of M&A opportunities to potential buyers. Replaces traditional CIM distribution
• Datasite Intelligence: AI analytics on deal activity — who's viewing what documents, engagement scoring, and predictive insights on buyer interest
• Customers buy because: M&A transactions require secure, controlled sharing of highly confidential financial data. Regulatory requirements, legal liability, and competitive sensitivity make dedicated VDR platforms non-negotiable for serious transactions. AI features now differentiate beyond basic document sharing`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: M&A deal professionals — investment banks (sell-side and buy-side), private equity firms, corporate development teams, law firms, and accounting/advisory firms
• Processes ~12,000+ deals annually — significant market share of global M&A transaction volume
• Key verticals: Financial services (investment banking), private equity, law firms, corporate M&A, and restructuring/bankruptcy
• Geography: Global — US (~45-50%), EMEA (~30-35%), APAC (~15-20%). London and Hong Kong offices serve major financial centers. M&A is a global activity
• Buying drivers: Every M&A transaction needs a VDR — it's non-discretionary infrastructure for deal-making. The choice of VDR is driven by security, ease of use, AI capabilities, brand trust, and relationship with the bankers running the process. Bulge bracket banks typically standardize on one or two VDR providers
• Revenue is cyclical — correlated with M&A deal volume. When deal activity increases, Datasite revenue grows; when M&A slows (as in 2022-2023), revenue contracts`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Virtual Data Room market estimated at ~$2.5-3.5B in 2025, growing at ~12-15% CAGR
• Broader deal management and M&A technology market is ~$5-7B when including related tools
• Datasite and Intralinks (SS&C) together control an estimated 50-60%+ of the enterprise VDR market
• Tailwind — M&A recovery: After a down cycle in 2022-2023, M&A deal volume is recovering in 2024-2026. PE dry powder ($2.5T+) and pent-up deal demand are drivers. Time horizon: 2-4 years of recovery
• Tailwind — AI in deal-making: AI-powered document analysis, due diligence automation, and deal analytics are expanding the value VDR platforms can deliver. Time horizon: 3-5 years
• Tailwind — Regulatory complexity: Cross-border M&A, data privacy (GDPR), and antitrust scrutiny increase the need for sophisticated deal management tools. Time horizon: Permanent
• Headwind — M&A cyclicality: VDR revenue is directly tied to deal volume — the single biggest risk factor. Time horizon: Cyclical, always present
• Headwind — Low-cost VDR competition: Cheaper alternatives (Box, SharePoint, smaller VDR providers) chip away at the low end. Time horizon: Ongoing for smaller deals
• Market growth (5yr): VDR market grew at ~10-14% CAGR; correlated with underlying M&A volume which was volatile (boom in 2021, bust in 2022-2023, recovery in 2024-2026) (estimates)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Intralinks (SS&C Technologies): The co-leader in enterprise VDRs. Historically the #1 brand; Datasite has gained share through AI investment and modern UX. The two compete head-to-head on virtually every major M&A transaction. SS&C's ownership provides financial stability but may limit product investment
• Box / Dropbox / SharePoint: Not true VDRs but increasingly used for smaller deals and non-M&A document sharing. Competitive threat at the low end where full VDR functionality is overkill
• Firmex (DiliTrust): Mid-market VDR targeting smaller transactions and law firms. Growing in the sub-$100M deal segment
• Ansarada: Australian VDR competitor with AI capabilities. Growing in APAC and mid-market globally
• Donnelley Financial Solutions (DFIN, public): Venue VDR — competes primarily in capital markets and SEC filings. Less focused on M&A
• Competitive advantage: AI-powered document intelligence (auto-indexing, redaction, analytics) is the current differentiator vs. Intralinks. The Datasite brand is trusted by the largest investment banks. Processing 12,000+ deals annually creates data network effects — AI models improve with more deal data
• Best at: Large-cap M&A transactions, AI-powered deal preparation and analytics, global coverage, and investment bank relationships
• Worst at: Small/mid-market deal pricing (Firmex and others are cheaper), non-M&A use cases, and M&A cyclicality exposure
• Biggest threat (3yr): Prolonged M&A downturn compressing revenue. Also, Intralinks investing heavily in AI to close the technology gap
• Largest opportunity (3yr): AI-driven expansion of deal management beyond basic VDR — if Datasite becomes the platform for the entire M&A lifecycle (preparation → marketing → diligence → integration), the revenue per deal and TAM expand significantly`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2023: Harvest Partners acquired Datasite from consortium of Siris Capital, Investcorp, and management. Terms not disclosed. Harvest Partners' thesis centers on M&A cycle recovery and AI-driven platform expansion
• 2021: Rebranded from Merrill Corporation to Datasite — signaling the shift from document services legacy to SaaS deal management platform
• 2016-2017: Consortium of Siris Capital, Investcorp, and management took Datasite (then Merrill) private
• Earlier: Long history of PE ownership and transformation from physical document printing/distribution (IPO prospectuses, legal filings) to digital SaaS platform
• The company's evolution from paper-based document management (1968) to AI-powered M&A SaaS (2025) is one of the more dramatic pivots in enterprise software`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "ds1", text: "Datasite's revenue is a direct proxy for M&A deal volume — this is both the opportunity and the risk. In a recovery year (2025-2026), revenue should grow meaningfully as PE firms put $2.5T+ of dry powder to work. The AI investment is smart timing — during the M&A downturn of 2022-2023, Datasite invested in AI features while deals were slow. Now those features differentiate as deal volume recovers. The cyclicality means entry timing matters enormously for PE returns.", date: "2026-03-21T00:00:00Z" },
      { id: "ds2", text: "The VDR market is essentially a duopoly between Datasite and Intralinks (SS&C). This concentration creates pricing power and barriers to entry — investment banks standardize on these platforms and switching is risky mid-transaction. The 50-60% combined market share is defensible because no bank will risk using an unproven VDR for a $5B M&A transaction. The AI features are the current competitive battleground — whichever platform delivers better document intelligence and deal analytics will gain share in the next cycle.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "instructure_seed", name: "Instructure", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private education technology company — the leading Learning Management System (LMS) provider for higher education and K-12 in North America
• Founded 2008 in Salt Lake City, UT by two BYU graduate students (Brian Whitmer and Devlin Daley); built Canvas LMS as a modern, cloud-native alternative to Blackboard
• Ownership: Thoma Bravo acquired Instructure in Mar 2020 for $2B ($47.60/share); KKR subsequently acquired from Thoma Bravo in Jul 2024 for reported $4.8B. Thoma Bravo more than doubled its investment in ~4 years
• CEO Steve Daly (appointed 2020 post-take-private)
• ~1,500-2,000 employees; headquartered in Salt Lake City, UT
• Canvas LMS is used by ~30M+ users globally, including ~90% of US higher education institutions (by enrollment)
• Revenue estimated at $500-600M; predominantly SaaS subscription with high retention rates (~95%+ net retention)
• Also serves K-12 school districts and corporate learning through Canvas and acquired products (Bridge, MasteryConnect, LearnPlatform)`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: SaaS subscription — annual or multi-year contracts priced per-student (higher ed) or per-district/school (K-12). Recurring revenue with very high retention. Professional services are supplemental
• Canvas LMS: The flagship — cloud-native learning management system for higher education and K-12. Course creation, assignment management, grading, discussions, video conferencing integration, analytics. The modern alternative that displaced Blackboard in higher ed. ~90% US higher ed market penetration by enrollment
• Canvas Studio: Video learning platform integrated with Canvas — video recording, sharing, annotation, and analytics for asynchronous learning
• Canvas Credentials (formerly Badgr): Digital credentialing and badging — issues verifiable digital certificates and micro-credentials
• MasteryConnect: K-12 assessment and mastery-based learning platform — formative assessments, benchmark testing, and standards mastery tracking
• LearnPlatform (acquired 2022): EdTech effectiveness evaluation — helps schools and districts measure the ROI of their technology investments. Unique positioning as the "analytics layer" for edtech purchasing decisions
• Bridge: Corporate learning and employee development platform — LMS and performance management for businesses. Extends Instructure beyond education into corporate L&D. Smaller but growing
• Customers buy because: LMS is mandatory infrastructure for modern education — every course, assignment, grade, and student interaction flows through it. Canvas won on superior cloud-native UX vs. Blackboard's legacy on-prem architecture. High switching costs once embedded in institutional workflows`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Higher education institutions (universities, community colleges), K-12 school districts, and corporate learning departments
• ~6,000+ institutions globally; ~30M+ users
• US higher education: ~90% market penetration by enrollment — near-monopoly position. Essentially every major US university runs Canvas
• K-12: Growing segment through MasteryConnect and Canvas for K-12. Penetration lower than higher ed but increasing
• International: Expanding in EMEA, APAC, and Latin America. Higher ed adoption outside the US is earlier stage — significant growth runway
• Corporate: Bridge serves mid-market corporate learning — smaller and more competitive segment
• Geography: Estimated ~70-75% North America, ~15-20% EMEA/APAC, ~5-10% rest of world. International expansion is a key growth vector
• Buying drivers: Institutions need a reliable, modern LMS that integrates with their student information systems, video tools, and assessment platforms. Accreditation requirements often mandate LMS usage. Once selected, institutions rarely switch — the integration with institutional processes is deep`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Learning Management System (LMS) market for education estimated at ~$18-22B in 2025, growing at ~14-18% CAGR
• Higher education LMS specifically is ~$5-7B, growing at ~10-12% CAGR (more mature in US, faster growth internationally)
• Instructure at ~$500-600M revenue is the #1 education LMS vendor globally by higher ed market share
• Tailwind — Digital learning normalization: Post-COVID, hybrid and online learning is permanent in higher ed. Every institution needs a robust LMS. Time horizon: Permanent
• Tailwind — International expansion: Canvas has ~90% US higher ed but much lower penetration internationally. Europe, APAC, and Latin America are growth markets. Time horizon: 5-10 years
• Tailwind — Corporate L&D: Bridge extends the TAM into corporate learning, leveraging the Canvas brand. Time horizon: 3-5 years
• Headwind — US higher ed saturation: ~90% penetration means organic growth in the US must come from price increases, upsell (Studio, Credentials), or K-12 expansion rather than new logos. Time horizon: Permanent
• Headwind — Open-source LMS: Moodle (open source, free) is the dominant alternative globally, especially in international markets with lower budgets. Time horizon: Permanent for price-sensitive markets
• Market growth (5yr): Education LMS grew at ~12-16% CAGR, accelerated by COVID. Post-COVID normalization is ~10-12% CAGR (estimates)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Blackboard (Anthology): The legacy incumbent that Canvas disrupted. Anthology (formed from Blackboard + Ellucian merger entities) still has significant installed base but has lost massive share to Canvas over the last decade. Legacy on-prem architecture and poor UX drove customers away
• Moodle (open source): The most widely used LMS globally by number of installations. Free and open-source. Dominant in Europe, APAC, and developing markets where budgets are limited. Canvas wins on UX, support, and cloud reliability but can't compete on price vs. free
• D2L Brightspace (public, ~$200M revenue): Canadian LMS competitor. Stronger in K-12 and growing in higher ed. Modern platform but smaller scale than Canvas. Most direct competitor for new higher ed wins
• Google Classroom: Free, bundled with Google Workspace. "Good enough" for K-12 basic use cases. Not a true enterprise LMS but commoditizes the low end
• Competitive advantage: Canvas is the de facto standard in US higher education — ~90% market share by enrollment is a near-monopoly. Cloud-native architecture (built from day one) vs. Blackboard's legacy. Modern API ecosystem enables rich integrations. The institutional switching costs are enormous — migrating years of course content, grades, and workflows is prohibitively expensive
• Best at: US higher education (dominant), UX and ease of use, cloud reliability, and integration ecosystem (LTI standards)
• Worst at: International markets (Moodle's free tier wins), K-12 (Google Classroom and others are entrenched), corporate learning (many competitors), and price-sensitive markets
• Biggest threat (3yr): D2L Brightspace gaining share in international higher ed before Canvas can expand. Also, AI-native learning platforms emerging that could leapfrog traditional LMS architecture
• Largest opportunity (3yr): International higher education expansion — Canvas has <20% share outside the US in a market that's much earlier in the cloud LMS adoption curve. If Canvas can replicate US success internationally, the revenue doubles. K-12 expansion via MasteryConnect and Canvas is also significant`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Jul 2024: KKR acquired Instructure from Thoma Bravo for reported $4.8B. Thoma Bravo's ~$2B investment in 2020 generated ~2.4x return in 4 years. KKR's thesis centers on international expansion, K-12 growth, and corporate learning (Bridge)
• 2022: Acquired LearnPlatform — edtech effectiveness and analytics platform for K-12 districts
• 2020-2022: Under Thoma Bravo, focused on operational efficiency, margin expansion, and product consolidation
• Mar 2020: Thoma Bravo acquired Instructure for $2B ($47.60/share). Take-private amid controversy — founder Adam Whitmer and some shareholders opposed the deal as undervalued
• Earlier acquisitions: MasteryConnect (K-12 assessment), Portfolium (student portfolios), Practice (video practice)`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "inst1", text: "The KKR acquisition at $4.8B (from Thoma Bravo's $2B entry 4 years prior) validates the thesis that education LMS is a durable, high-retention SaaS category. ~90% US higher ed market share with ~95%+ net retention is exceptional. KKR's growth plan is clear: international expansion (doubling the addressable market), K-12 penetration, and corporate learning via Bridge. The question is execution speed — D2L Brightspace and Moodle are also targeting international higher ed, and first-mover advantage matters in institutional LMS adoption.", date: "2026-03-21T00:00:00Z" },
      { id: "inst2", text: "The ~90% US higher ed penetration is both the strength and the ceiling. Canvas has essentially won the US market — but that means organic US growth is limited to price increases and module upsell (Studio, Credentials). All incremental growth must come from international higher ed, K-12, or corporate. International is the biggest lever but also the hardest — Moodle is free and deeply entrenched. KKR needs to crack the international playbook to justify the $4.8B entry price.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "ellucian_seed", name: "Ellucian", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private enterprise resource planning (ERP) and student information system (SIS) provider exclusively for higher education — the operating system for colleges and universities
• Formed in 2012 through the merger of SunGard Higher Education and Datatel; roots trace back to the 1960s (SCT, Datatel, SunGard HE)
• Owned by Vista Equity Partners and Evergreen Coast Capital (Elliott affiliate) since Oct 2021 acquisition from TPG Capital and Leonard Green & Partners. TPG and Leonard Green had acquired Ellucian in 2015
• CEO Laura Ipsen (appointed 2018); ~4,500+ employees
• Headquartered in Reston, VA
• Serves ~2,700+ institutions in 50+ countries — manages student records, financials, HR, financial aid, and enrollment for a significant share of global higher education
• Revenue estimated at $1.2-1.5B; mix of SaaS subscription (growing), maintenance on legacy on-prem, and professional services
• The "higher ed ERP" — similar market position to what SAP/Oracle are in enterprise. Most institutions have been running Ellucian systems for decades, creating massive switching costs`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Mix of SaaS subscription (Ellucian Cloud, growing), perpetual license maintenance (legacy Banner/Colleague — still the majority of recurring revenue), and professional services. The cloud transition is the strategic priority
• Ellucian Banner: The flagship ERP for large universities — student information, financial aid, finance, HR, and advancement. Legacy on-prem architecture with cloud-hosted options. Estimated 1,400+ institutions. Deep functionality but aging interface
• Ellucian Colleague: ERP for community colleges and smaller institutions — similar modules to Banner but different architecture and market segment. Estimated 900+ institutions
• Ellucian Cloud: Cloud-native platform and cloud-hosted versions of Banner and Colleague. The strategic growth bet. Includes Ellucian Experience (modern UI layer), Ellucian Intelligent Learning Platform, and cloud-native modules
• Ellucian CRM: Student recruitment and enrollment management — admissions CRM for higher ed. Competes with Salesforce Education Cloud and Technolutions Slate
• Ellucian Ethos: Integration platform connecting Ellucian systems with third-party applications. API-based interoperability — critical as institutions run hundreds of point solutions alongside the ERP
• Ellucian Analytics: Business intelligence and reporting for institutional decision-making
• Customers buy because: ERP is non-discretionary infrastructure — universities cannot process financial aid, register students, manage grades, or run payroll without it. Banner and Colleague are deeply embedded in institutional operations, with decades of customizations. Switching is extraordinarily expensive and risky (2-5+ year projects costing $10-50M+)`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Higher education institutions — four-year universities, community colleges, and technical colleges. Public and private, from small colleges to large state university systems
• ~2,700+ institutions in 50+ countries — one of the largest customer bases in higher ed technology
• Key segments: Large research universities (Banner), community colleges (Colleague), international institutions (growing)
• Geography: Estimated ~75-80% North America, ~15-20% international (UK, Australia, Middle East, Africa growing). International expansion is a priority
• Buying drivers: Institutions need to manage the student lifecycle end-to-end — recruitment, admissions, enrollment, financial aid, academics, advising, and alumni. Federal financial aid compliance (Title IV in the US) makes SIS/ERP mandatory and heavily regulated. Legacy Banner/Colleague customers face a "modernize or replace" decision — most choose to modernize with Ellucian rather than rip-and-replace
• Switching costs are among the highest in enterprise software — decades of customizations, integrations, and institutional process dependencies make migration to a competitor a 3-5+ year, multi-million-dollar project`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Higher education ERP/SIS market estimated at ~$8-12B globally, growing at ~8-12% CAGR
• Ellucian at ~$1.2-1.5B revenue is the dominant vendor — estimated 40-50%+ market share in North American higher ed ERP
• Tailwind — Cloud modernization: Legacy on-prem Banner and Colleague installations need to migrate to cloud. This creates a built-in upgrade revenue cycle. Time horizon: 5-10 years
• Tailwind — Student success and retention: Institutions investing in technology to improve student outcomes, retention, and graduation rates. Ellucian analytics and CRM address this. Time horizon: 5+ years
• Tailwind — International higher ed growth: Global enrollment is growing, especially in Middle East, Africa, and Asia. Time horizon: 5-10 years
• Headwind — Higher ed enrollment decline: US higher ed enrollment has been declining for years (demographic cliff). Fewer students = smaller IT budgets at some institutions. Time horizon: 5-10 years in the US
• Headwind — Cloud-native competitors: Workday Student and Oracle Student Cloud are attempting to enter higher ed with modern cloud-native ERPs. If they succeed, the legacy moat weakens. Time horizon: 3-7 years
• Market growth (5yr): Higher ed ERP market grew at ~7-10% CAGR (estimates based on Gartner, Tambellini Group)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Workday (Student): The most dangerous long-term competitor. Cloud-native ERP for higher ed. Still early — limited deployments — but Workday's brand and product quality are formidable. If Workday cracks the student information system market, it threatens Ellucian's core
• Oracle (Student Cloud / PeopleSoft Campus): PeopleSoft has significant legacy higher ed ERP market share. Oracle Student Cloud is the modern replacement. Slow adoption but Oracle's persistence is a long-term threat
• Jenzabar: Smaller higher ed ERP vendor targeting small private colleges. Not a threat for large institutions but competes in the small college segment
• Anthology (Blackboard): Post-merger entity with SIS capabilities. Less focused on ERP than Ellucian but expanding
• Salesforce Education Cloud: Competes specifically in CRM/enrollment management. Not a full ERP competitor but erodes Ellucian CRM revenue
• Competitive advantage: Installed base monopoly — 2,700+ institutions with decades of embedded systems. Switching costs are the highest in education technology (3-5+ year migration projects). Federal financial aid compliance requirements create regulatory moat. Ellucian Ethos integration platform makes it easier to modernize around the ERP rather than replace it
• Best at: Comprehensive higher ed ERP (finance, HR, financial aid, SIS all integrated), regulatory compliance (Title IV), installed base retention, and community college coverage (Colleague)
• Worst at: Modern UX (legacy Banner interface), cloud-native architecture (Workday is cleaner), CRM (Salesforce Education Cloud is superior), and competing for greenfield international deployments
• Biggest threat (3yr): Workday Student gaining meaningful higher ed deployments — even 50-100 institutions switching to Workday would change the narrative. Also, the US enrollment demographic cliff reducing total addressable spend
• Largest opportunity (3yr): Cloud migration of the installed base — if Ellucian successfully migrates 2,700+ institutions from on-prem to Ellucian Cloud, recurring revenue and margins improve dramatically. International expansion is also significant`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Oct 2021: Vista Equity Partners and Evergreen Coast Capital (Elliott affiliate) acquired Ellucian from TPG Capital and Leonard Green & Partners. Terms not disclosed but estimated $3.5-5B
• 2015: TPG Capital and Leonard Green & Partners acquired Ellucian — under their ownership, invested in cloud platform and international expansion
• 2012: SunGard Higher Education and Datatel merged to form Ellucian — combined the two largest higher ed ERP vendors into a single entity
• Vista/Evergreen at ~4.5 years of ownership — approaching typical exit window. Cloud migration progress and ARR growth are the key exit metrics`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "ell1", text: "Ellucian's moat is one of the deepest in enterprise software — 2,700 institutions running decades-old systems with millions of lines of customization. No institution takes ripping out their ERP lightly. The cloud migration is the value creation lever — converting maintenance revenue to cloud subscription at higher price points with better margins. Vista is the right owner for this playbook (they've done it with dozens of enterprise software companies). The question is pace — how fast can they move institutions to cloud without disruption?", date: "2026-03-21T00:00:00Z" },
      { id: "ell2", text: "Workday Student is the existential long-term threat but the near-term reality is that very few institutions have actually implemented it. Higher ed ERP migrations are so complex and risky that institutions default to the incumbent. Ellucian's strategy of putting a modern UI layer (Ellucian Experience) on top of the legacy ERP and enabling cloud hosting is the pragmatic response — give institutions a path to modernize without the risk of a full replacement. This buys Ellucian 5-10 years against Workday.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "internetbrands_seed", name: "Internet Brands", sector: "internet", sub: "marketplace", priority: "Watching",
    fields: {
      overview: { text: `• Private portfolio of vertical internet brands and SaaS platforms — operates online marketplaces, communities, and practice management software across automotive, legal, health, home/travel verticals
• Founded 1998 as CarsDirect.com; evolved into a portfolio company operating 100+ web properties
• Owned by KKR (acquired in 2014; KKR has maintained ownership for ~12 years, unusually long for PE)
• CEO Bob Brisco (long-tenured)
• ~4,500+ employees; headquartered in El Segundo, CA
• Operates a hybrid model: (1) high-traffic vertical web properties monetized through advertising and lead generation, and (2) vertical SaaS platforms providing practice management software to professionals (dentists, lawyers, doctors)
• Revenue estimated at $1-1.5B; mix of advertising/lead gen (transactional) and SaaS subscriptions (recurring)
• Key brands include WebMD (health), Martindale-Hubbell (legal), Demandforce (small business marketing), and numerous automotive, health, and legal web properties`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Diversified — advertising revenue (display, programmatic), lead generation fees, SaaS subscription (practice management software), and marketplace transaction fees. The strategic shift is toward recurring SaaS revenue
• Health vertical: WebMD (acquired 2017 for ~$2.8B) — the dominant consumer health information website. Monetized through pharmaceutical advertising and health-related content marketing. Also operates Medscape (physician professional network) and health practice management software
• Legal vertical: Martindale-Hubbell (lawyer directory and ratings), Nolo (legal information), and legal practice management SaaS. Advertising and lead generation for law firms
• Automotive vertical: CarsDirect, Autobytel, and related car buying/selling platforms. Lead generation for auto dealers
• Home & Travel: Various web properties in home services, travel, and related verticals
• Vertical SaaS: Demandforce (small business marketing automation), dental practice management, medical practice management, and legal practice management software. These are recurring subscription products sold to small professional practices
• Customers buy because: Professionals (dentists, lawyers, doctors) need practice management software and patient/client acquisition tools. Consumers use the web properties for research and decision-making. Advertisers pay to reach these audiences`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Two customer types: (1) Advertisers and lead buyers who pay to reach audiences on Internet Brands' web properties, and (2) small professional practices (dental, medical, legal) that subscribe to SaaS practice management tools
• Advertisers: Pharmaceutical companies (WebMD), auto dealers (CarsDirect), law firms (Martindale), and home service providers
• SaaS subscribers: Small to mid-size professional practices — dental offices, medical practices, law firms. Typically 1-50 person offices
• Geography: Primarily US — ~90%+ of revenue
• The dual revenue model (advertising + SaaS) provides diversification but also complexity`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Operates across multiple verticals — no single industry defines Internet Brands
• Digital advertising market is ~$500B+ globally; vertical advertising in health, legal, and auto is ~$15-25B
• Vertical SaaS for professional practices (dental, medical, legal) is ~$10-15B collectively, growing at ~10-15% CAGR
• Tailwind — Vertical SaaS adoption: Small practices increasingly adopting cloud-based practice management. Time horizon: 5+ years
• Tailwind — Digital health advertising: Pharma digital ad spend continues to shift from traditional to digital (WebMD benefits). Time horizon: 3-5 years
• Headwind — Ad revenue volatility: Digital advertising is cyclical and subject to platform algorithm changes. Time horizon: Permanent
• Headwind — Competition from Google/social: Google's health, legal, and auto content competes for the same search traffic. Time horizon: Permanent and intensifying
• Headwind — AI disruption: AI-generated health and legal information could reduce traffic to traditional web properties like WebMD. Time horizon: 2-5 years`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• WebMD competes with Healthline (Ziff Davis), Mayo Clinic online, Cleveland Clinic, and increasingly Google Health panels for consumer health traffic
• Legal: LegalZoom, Avvo (acquired by Internet Brands), FindLaw (Thomson Reuters) compete in legal directories and services
• Vertical SaaS: Dentrix (Henry Schein), Patterson dental software, Kareo/Tebra (medical), Clio (legal) compete in practice management
• Competitive advantage: Scale of audience (WebMD alone has ~80M+ monthly visitors), multi-vertical portfolio diversification, and the combination of audience reach + SaaS creates cross-sell opportunities (drive SaaS subscriptions from web property traffic)
• Best at: Consumer health content (WebMD dominance), legal directory brand (Martindale-Hubbell heritage), and portfolio diversification across verticals
• Worst at: Innovation speed (large portfolio of legacy web properties), competing with pure-play vertical SaaS vendors on product depth, and defending web traffic against Google and AI
• Biggest threat (3yr): AI-powered search reducing traffic to WebMD and other content properties. Google AI Overviews directly answering health and legal questions without click-through
• Largest opportunity (3yr): Converting web property traffic into SaaS subscriptions — using the audience reach to sell practice management software to the professionals who advertise on the platforms`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2017: Acquired WebMD for ~$2.8B — the largest and most transformative acquisition. Made Internet Brands the dominant player in consumer health information
• 2014: KKR acquired Internet Brands. KKR has held for ~12 years — significantly longer than typical PE hold periods
• Under KKR: Numerous bolt-on acquisitions across health, legal, and dental verticals, including Demandforce, various dental SaaS companies, and legal web properties
• The unusually long hold period suggests KKR sees continued value creation through SaaS transition and portfolio optimization`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "ib1", text: "KKR's 12-year hold period is extraordinary and raises questions about exit path. Either KKR sees significant unrealized value (SaaS transition driving higher multiples) or the exit options have been challenging (advertising-dependent businesses trade at lower multiples than pure SaaS). The WebMD acquisition was transformative for scale but the advertising revenue model faces structural headwinds from AI and Google. The bullish case is that the vertical SaaS components (practice management) eventually become the majority of revenue and justify a premium exit. The bearish case is that the web property traffic declines faster than SaaS revenue grows.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "godaddy_seed", name: "GoDaddy", sector: "internet", sub: "hosting", priority: "Watching",
    fields: {
      overview: { text: `• Public domain registrar, web hosting, and SMB online presence platform (NYSE: GDDY); the world's largest domain registrar with ~84M+ domains under management
• Founded 1997 in Scottsdale, AZ by Bob Parsons; IPO'd on NYSE in Apr 2015
• Significant PE history: KKR, Silver Lake, and others were major investors pre-IPO and post-IPO. Warburg Pincus invested $800M in 2011. The company has been predominantly institutional-investor-backed throughout its history
• CEO Aman Bhutani (appointed 2019, former Expedia executive); ~6,500+ employees
• Revenue ~$4.3-4.6B in 2024; one of the largest internet companies by revenue focused on SMBs
• Serves ~21M+ customers globally — overwhelmingly small businesses and entrepreneurs
• Strategy: Transitioning from commodity domain/hosting to a recurring commerce and marketing platform for SMBs. "Helping everyday entrepreneurs succeed" is the positioning
• Named to Fortune 500; ~$7-8B market cap as of early 2026`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Recurring subscription revenue across domains, hosting, commerce, and marketing products. Aftermarket domain transactions and advertising are supplemental. ~75%+ of revenue is recurring
• Domain Registration: Core product — domain search, registration, renewal, and management. ~84M+ domains under management. High-margin, recurring (annual renewals are near-automatic). The cash cow
• Web Hosting: Shared, WordPress, VPS, and dedicated hosting. Includes managed WordPress hosting (WooCommerce). Commodity product but still a significant revenue contributor
• GoDaddy Website Builder + Airo (AI): AI-powered website creation tool — generates complete websites from a business description. This is the product bet for the AI era. Airo can create a website, logo, email, and social posts in minutes
• GoDaddy Payments: Integrated payment processing for GoDaddy commerce customers. Growing payments GMV as GoDaddy pushes into commerce enablement
• Online Store: E-commerce capabilities integrated with GoDaddy websites — product catalogs, checkout, shipping, and inventory management
• Email & Professional: Microsoft 365 email, professional email hosting, and productivity tools bundled with domains
• Marketing & SEO: Email marketing, social media management, SEO tools, and digital advertising for SMBs
• Domain Aftermarket: GoDaddy Auctions and aftermarket transactions for premium domain names
• Customers buy because: Entrepreneurs and small businesses need to get online quickly and affordably. GoDaddy is the default starting point — buy a domain, build a website, set up email, process payments, all in one place. The brand awareness is massive (decades of Super Bowl ads)`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Micro-businesses and entrepreneurs — freelancers, small retailers, local services, side hustles, early-stage startups. Overwhelmingly <10 employees
• ~21M+ customers globally; majority are individuals and micro-businesses
• Key segments: Small business owners wanting online presence, domain investors/speculators, WordPress users, and small e-commerce sellers
• Geography: Estimated ~65-70% North America, ~20-25% international (EMEA, APAC, LATAM). Growing international presence but US-dominant
• Buying drivers: Price (introductory offers drive acquisition), brand recognition (GoDaddy is the most recognized domain brand), simplicity (one-stop shop), and increasingly AI-powered creation (Airo reduces the technical barrier to zero)
• Churn: SMB hosting is a high-churn business. Customers are price-sensitive and many businesses fail within 1-2 years. The offsetting factor is high domain renewal rates — domains are essential infrastructure customers rarely let lapse`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Global domain registration market: ~400M+ registered domains globally; the registrar market is ~$12-15B. GoDaddy is the clear #1 with ~20%+ global market share
• Web hosting market: ~$100B+ including cloud infrastructure; traditional shared hosting is ~$60-70B
• SMB online presence/commerce platform market: ~$20-30B, growing at ~10-14% CAGR
• Tailwind — SMB digitization: Every small business needs online presence. Digital-first is permanent. Time horizon: Permanent
• Tailwind — AI website creation: AI dramatically lowers the barrier to getting online — GoDaddy Airo can create a complete website in minutes. Expands the addressable market to non-technical entrepreneurs. Time horizon: 3-5 years
• Tailwind — Commerce enablement: GoDaddy Payments and online store expand ARPU beyond domains/hosting into transaction processing. Time horizon: 3-5 years
• Headwind — Domain commoditization: New TLDs and competition have compressed domain pricing. Time horizon: Permanent
• Headwind — Website builders (Squarespace, Wix, Shopify): All-in-one platforms bypass traditional domain + hosting model. Time horizon: Ongoing share shift
• Market growth (5yr): Domain market grew at ~4-6% CAGR; SMB commerce platforms grew at ~12-15% CAGR (estimates)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Squarespace (Permira, $7.2B take-private): All-in-one website builder bypassing traditional hosting. Better design, integrated commerce. Competes for the same SMB buyer. GoDaddy wins on domain reach and price; Squarespace wins on design quality
• Wix (public): Similar all-in-one model. Strong self-service UX. Growing e-commerce. Direct competitor for non-technical SMBs
• Shopify: Dominates SMB e-commerce. SMBs wanting online stores go to Shopify rather than GoDaddy's commerce tools
• Hostinger: Aggressive budget hosting competitor taking share with modern UX and low pricing
• IONOS (1&1, ~$1.5B+ revenue): European leader in hosting and domains. Strong EMEA competition
• Newfold Digital (Bluehost, HostGator, Network Solutions): Direct competitor in budget hosting and domains. Smaller scale and weaker brand
• Namecheap: Domain registrar competitor. Wins on price for domain-only customers
• Competitive advantage: Brand recognition (GoDaddy is the most recognized domain brand globally), ~84M domains under management (the largest base), one-stop-shop breadth (domain → website → email → commerce → payments), and AI-powered creation (Airo). The domain renewal base is a massive recurring revenue stream
• Best at: Domain registration at scale, brand awareness, introductory pricing for customer acquisition, and breadth of SMB tools in one platform
• Worst at: Design quality (Squarespace wins), e-commerce depth (Shopify wins), hosting performance (many competitors match or beat), and customer support reputation
• Biggest threat (3yr): AI website generators commoditizing the "get online" value prop — if AI makes website creation trivially easy everywhere, GoDaddy's builder differentiation erodes. Shopify and Squarespace continuing to capture SMBs who want more than basic hosting
• Largest opportunity (3yr): GoDaddy Airo + Payments creating a commerce-enabled platform that monetizes SMBs beyond domains. If ARPU grows from ~$200/year to $300+ through commerce and payments attach, the revenue expansion is significant without needing new customer acquisition`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2024-2025: Continued share buyback program — returning capital to shareholders as the business generates strong free cash flow
• 2021-2022: Multiple bolt-on acquisitions in payments and commerce capabilities
• 2019: Aman Bhutani appointed CEO — shifted strategy from domain/hosting toward commerce platform
• Apr 2015: IPO on NYSE at $20/share
• 2011: Warburg Pincus invested $800M; KKR, Silver Lake, and other institutional investors were significant pre-IPO shareholders
• 1997: Founded by Bob Parsons in Scottsdale, AZ
• Key context: GoDaddy is a public company with strong free cash flow generation and a buyback-driven capital return strategy. The strategic transformation from domain registrar to SMB commerce platform is the key narrative`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "gd1", text: "GoDaddy's transformation from domain registrar to SMB commerce platform is the strategic narrative. The domain business is a cash cow with high margins and near-automatic renewals — but it's low-growth. The growth comes from converting domain customers into website builders, commerce sellers, and payments processors. If GoDaddy can increase ARPU through commerce and payments attach, the revenue math works without heroic customer acquisition assumptions. Airo (AI website creation) could be a genuine inflection point — reducing the friction of getting online to near-zero expands the addressable market meaningfully.", date: "2026-03-21T00:00:00Z" },
      { id: "gd2", text: "The competitive positioning vs. Squarespace and Shopify is the key strategic question. GoDaddy has 21M customers vs. Squarespace's ~4M and Shopify's ~2M merchants — but GoDaddy's customers are lower-ARPU and many are domain-only. The bull case is that GoDaddy's massive customer base is an undermonetized asset that commerce and AI tools can unlock. The bear case is that the SMBs who want real websites and commerce go to Squarespace/Shopify, and GoDaddy is stuck with the domain-only and low-engagement tier.", date: "2026-03-21T00:00:00Z" }
    ]
  }
];

async function run() {
  // Move Newfold Digital to Internet > hosting
  console.log('Moving Newfold Digital to Internet > Hosting / Domains...');
  const { error: nfErr } = await supabase.from('companies').update({ sector: 'internet', sub: 'hosting' }).eq('id', 'newfold_seed');
  if (nfErr) console.error('Newfold move error:', nfErr);
  else console.log('  Done.');

  for (const co of companies) {
    console.log(`Inserting ${co.name}...`);
    const { error: coErr } = await supabase.from('companies').upsert({
      id: co.id, name: co.name, sector: co.sector, sub: co.sub, priority: co.priority || ''
    }, { onConflict: 'id' });
    if (coErr) { console.error(`  Company error:`, coErr); continue; }
    for (const [key, val] of Object.entries(co.fields)) {
      if (!val.text) continue;
      const { error: fErr } = await supabase.from('company_fields').upsert({
        company_id: co.id, field_key: key, text: val.text, date: val.date || null
      }, { onConflict: 'company_id,field_key' });
      if (fErr) console.error(`  Field ${key} error:`, fErr);
    }
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
