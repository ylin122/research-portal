require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const companies = [
  {
    id: "weldnorth_seed", name: "Weld North", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private digital education company — acquires and operates K-12 digital curriculum, virtual schooling, and educational technology platforms
• Founded 2015 by David Hall (CEO); headquartered in Bethesda, MD
• Owned by Weld North Education (management-owned holding company). David Hall's team has deep PE experience — Hall previously founded and led several education businesses
• Acquisitions include Edgenuity (K-12 digital curriculum and virtual learning), Imagine Learning (adaptive learning software — subsequently sold to Bain Capital in 2023), and other edtech properties
• ~1,500-2,000 employees estimated
• Revenue estimated at $400-600M; predominantly SaaS subscription from school district contracts
• Core asset is Edgenuity — one of the largest digital curriculum and virtual instruction platforms in US K-12 education, serving ~4M+ students across thousands of school districts
• Positioned at the intersection of edtech and the growing demand for virtual/hybrid learning options in K-12`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: SaaS subscription — annual or multi-year contracts with school districts priced per-student or per-school. Recurring revenue with high renewal rates driven by academic year cycles
• Edgenuity (core platform): K-12 digital curriculum — over 400 standards-aligned courses from grades 6-12 including core subjects, electives, AP, and CTE. Includes virtual instruction, credit recovery, intervention, and supplemental learning. Video-based lessons with embedded assessments
• Edgenuity Courseware: Standards-aligned digital curriculum with built-in assessments, progress monitoring, and teacher tools
• Virtual School Solutions: Full-time and supplemental virtual schooling platforms for school districts — enabling districts to operate their own virtual schools rather than outsourcing to charter operators
• Credit Recovery: Targeted courses for students who need to recover credits — a high-demand use case in US K-12
• Special Education & Intervention: Specialized digital curriculum for students with learning differences and those needing academic intervention
• Customers buy because: School districts need digital curriculum to serve diverse student needs — virtual learners, credit recovery, advanced coursework, intervention, and expanded course catalogs that small or rural schools cannot staff in person. Post-COVID, every district must offer some form of digital/virtual learning option`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: US K-12 school districts — public school systems purchasing digital curriculum for various student populations
• Serves ~4M+ students across thousands of school districts
• Key use cases: Virtual and blended learning, credit recovery (students who failed courses), expanded course catalogs for small/rural districts, homebound students, and intervention programs
• Geography: 100% US K-12 education
• Buying drivers: Post-COVID mandate for virtual learning options, credit recovery needs (persistent across all districts), teacher shortages (digital curriculum fills gaps), and expanded course access for underserved districts`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• K-12 digital curriculum and virtual learning market estimated at ~$8-12B in 2025, growing at ~10-14% CAGR
• Tailwind — Virtual learning normalization: Post-COVID, every state has legislation or policies enabling virtual schooling. Digital curriculum is now permanent infrastructure. Time horizon: Permanent
• Tailwind — Teacher shortages: US K-12 faces chronic teacher shortages, especially in STEM, special education, and rural areas. Digital curriculum fills the gap. Time horizon: 5-10+ years
• Headwind — Post-COVID enrollment normalization: The surge in virtual enrollment during COVID has partially reversed. Growth rates have normalized. Time horizon: 1-3 years of adjustment
• Headwind — Competition from free/state-provided content: Some states develop free digital curriculum, reducing the addressable market. Time horizon: Ongoing`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Imagine Learning (Bain Capital): Direct competitor in K-12 adaptive learning — was previously owned by Weld North, sold to Bain in 2023
• Curriculum Associates (i-Ready): Assessment and instruction platform. Strong in K-8 math and reading
• Stride (K12 Inc, public): Virtual school operator — competes for full-time virtual students but operates schools rather than selling curriculum to districts
• Pearson, HMH, McGraw Hill: Large publishers with digital curriculum offerings. More focused on core textbook replacement; Edgenuity is stronger in virtual instruction and credit recovery
• Competitive advantage: Edgenuity's video-based instruction model with real teachers differentiates from text-based competitors. Deep focus on credit recovery and virtual schooling use cases where Edgenuity has the largest market share
• Best at: Credit recovery, virtual school solutions for districts, and video-based instruction
• Worst at: Core instructional curriculum (Pearson/HMH stronger), adaptive learning (Imagine Learning stronger), and elementary grades (Edgenuity is 6-12 focused)`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2023: Sold Imagine Learning to Bain Capital — portfolio rationalization, focusing Weld North on the Edgenuity/virtual schooling platform
• 2021: Acquired Edgenuity — the core asset and largest K-12 digital curriculum platform
• 2020: Acquired Imagine Learning — adaptive learning software (subsequently divested to Bain)
• 2015: Founded by David Hall as a platform for acquiring and operating edtech companies`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "wn1", text: "The sale of Imagine Learning to Bain in 2023 was a clear signal that Weld North is focusing on the Edgenuity/virtual schooling thesis rather than building a diversified edtech conglomerate. Edgenuity's strength in credit recovery and virtual instruction is a defensible niche — these are use cases where school districts have few alternatives and outcomes are directly measurable. The question is whether the post-COVID normalization of virtual enrollment creates a growth ceiling or just a temporary deceleration.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "eab_seed", name: "EAB Global", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private higher education technology and research services company — provides enrollment management, student success technology, data analytics, and strategic research/advisory for colleges and universities
• Founded 2007 as the Education Advisory Board (spun off from The Advisory Board Company); headquartered in Washington, DC
• Owned by Vista Equity Partners (acquired in 2017)
• CEO David Felsenthal
• ~2,500+ employees; serves ~2,500+ institutions globally
• Revenue estimated at $500-700M; mix of SaaS subscription (technology platforms) and annual membership fees (research/advisory)
• Core platforms: Navigate (student success), Enroll360 (enrollment management), and Edify (data analytics)
• Positioned as the "research + technology" partner for higher ed institutions — combining strategic research with SaaS tools that operationalize the insights`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Annual SaaS subscription for technology platforms + annual membership fees for research and advisory services. Recurring revenue with multi-year contracts. High retention driven by institutional budgets and academic year planning cycles
• EAB Navigate: Student success and advising platform — predictive analytics, appointment scheduling, early alerts, degree planning, and student engagement tracking. Helps institutions identify at-risk students and intervene. The largest and most strategic product
• Enroll360: Enrollment management suite — recruitment CRM, marketing automation, financial aid optimization, and enrollment analytics. Helps institutions meet enrollment targets in a declining demographic environment
• Edify: Enterprise data platform — integrates data from multiple campus systems (SIS, LMS, finance, HR) into a unified analytics layer. Institutional decision-making powered by data
• Research & Advisory: Strategic research services — best practices, benchmarking, expert advisory, and peer networking for higher ed leaders. The original EAB business model
• Customers buy because: Higher education faces existential pressures — declining enrollment (demographic cliff), student retention challenges, budget constraints, and accountability demands. EAB provides both the research insight ("what to do") and the technology tools ("how to do it") to address these challenges`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Higher education institutions — four-year universities, community colleges, and some K-12 districts
• ~2,500+ institutions; significant penetration across US higher education
• Key segments: Enrollment-challenged institutions (Navigate + Enroll360 are critical tools), community colleges (large customer base), and regional public universities
• Geography: Primarily US (~85-90%); growing international presence
• Buying drivers: The demographic cliff (declining 18-year-old population starting ~2025-2026) creates urgent enrollment pressure. Student retention is a financial imperative — every student who drops out is lost tuition revenue. EAB's tools directly address both enrollment and retention`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Higher education technology and services market estimated at ~$15-20B, growing at ~8-12% CAGR
• Student success technology specifically is ~$2-4B, growing at ~15-20% CAGR — the fastest-growing sub-segment in higher ed technology
• Tailwind — Demographic cliff: Declining college-age population forces institutions to invest in enrollment optimization and student retention. Time horizon: 10+ years (the demographics are locked in)
• Tailwind — Accountability and outcomes focus: Federal and state governments increasingly tie funding to student outcomes (graduation rates, employment). Technology that improves outcomes becomes non-discretionary. Time horizon: 5+ years
• Headwind — Higher ed budget pressure: Many institutions face financial stress — budget cuts can affect EAB contract renewals. Time horizon: Ongoing
• Headwind — Competition from SIS/CRM vendors: Ellucian, Salesforce Education Cloud expanding into student success and enrollment. Time horizon: 3-5 years`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Ellucian: Competes with CRM and analytics capabilities. Ellucian is the ERP provider — EAB overlays on top. Some overlap in enrollment and analytics
• Salesforce Education Cloud: CRM and engagement platform for higher ed. Competes with Enroll360 for enrollment management
• Civitas Learning (now Anthology/Blackboard): Student success analytics — competes with Navigate
• Hobsons / Starfish (now EAB acquired some): Student success and enrollment tools — market has consolidated
• Competitive advantage: The research + technology combination is unique — no pure SaaS competitor offers the strategic advisory and best practices library that EAB provides alongside the technology. The installed base of 2,500+ institutions creates a network effect for benchmarking data
• Best at: Student success (Navigate is market-leading), enrollment management for enrollment-challenged institutions, and strategic research/advisory
• Worst at: Competing against Salesforce for CRM, enterprise data (Ellucian/Snowflake are stronger), and international markets`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2017: Vista Equity Partners acquired EAB. Vista's standard playbook — operational efficiency, SaaS transition, and margin expansion
• Under Vista: invested in Navigate and Enroll360 platform development, expanded customer base
• Vista at ~9 years of ownership — well past typical hold period. Exit planning should be active. The student success and enrollment category is hot given the demographic cliff, which could support a premium exit`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "eab1", text: "Vista at 9 years is extraordinarily long. The demographic cliff thesis makes EAB increasingly valuable — as enrollment declines, institutions become more desperate for tools that optimize recruitment and retain existing students. Navigate and Enroll360 become non-discretionary spend. A strategic acquirer (Ellucian, Anthology) or another PE firm focused on education would be logical buyers. The research + technology bundle creates a stickier relationship than pure SaaS competitors can offer.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "kindercare_seed", name: "KinderCare", sector: "education", sub: "traditional", priority: "Watching",
    fields: {
      overview: { text: `• Public early childhood education company (NYSE: KLC); the largest private provider of center-based childcare and early education in the United States
• Founded 1969; headquartered in Lake Oswego, OR (Portland metro)
• IPO'd on NYSE in Nov 2024 at $24/share after years of private ownership. Previously owned by Partners Group (acquired from KinderCare Education in 2015); before that, owned by Knowledge Universe (Michael Milken's education investment vehicle)
• CEO Paul Thompson
• ~33,000+ employees ("teachers and staff"); operates ~1,500+ childcare centers across 40 states and DC
• Serves ~161,000+ children daily across all programs
• Revenue ~$2.5B (2024); the largest pure-play childcare company in the US by center count and revenue
• Also operates Champions (before/after school programs in ~800+ schools) and CASA by KinderCare (employer-sponsored backup care)`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Tuition-based — parents pay weekly/monthly tuition for center-based childcare. Supplemented by employer partnerships (employer-sponsored care/subsidies) and government subsidies (CCDF, Head Start). Revenue is recurring (children enrolled for months/years) but not contractually locked (parents can withdraw)
• KinderCare Learning Centers: Full-day childcare and early education for infants through pre-K (ages 6 weeks to 5 years). Proprietary curriculum. ~1,500+ company-owned centers — the core business
• Champions: Before/after school programs and school-break care operating inside ~800+ elementary schools. Partnership model with school districts. Lower capital intensity than centers
• CASA by KinderCare: Employer-sponsored backup and emergency childcare — companies contract with KinderCare to provide childcare benefits for employees. Growing B2B channel
• Customers buy because: Working parents need reliable, safe, high-quality childcare. Childcare is essential infrastructure for workforce participation — parents cannot work without it. Quality, safety, convenience (proximity to home/work), and availability are the primary decision factors`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer: Working parents of children ages 6 weeks to 12 years (including Champions after-school)
• ~161,000+ children served daily
• Customer profile skews toward dual-income households and single working parents in suburban markets. Middle to upper-middle income — KinderCare pricing is above average for childcare but below premium Montessori/boutique options
• Geography: 40 US states + DC. Concentrated in suburban markets near employment centers
• Buying drivers: Proximity, safety/quality reputation, availability of infant care (hardest to find), employer partnerships, and increasingly government subsidies expanding access
• Employer channel (CASA) is growing — large corporations (tech, finance, healthcare) offering childcare benefits to attract and retain talent`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• US childcare market estimated at ~$60-65B in 2025; center-based care is ~$30-35B of that total
• Highly fragmented — ~60% of childcare is provided by independent/small operators. KinderCare and Bright Horizons are the only large-scale operators
• Tailwind — Workforce participation: Childcare is essential infrastructure for the labor market. Bipartisan political support for childcare investment is growing. Time horizon: Permanent
• Tailwind — Employer-sponsored benefits: Corporations increasingly offering childcare benefits to compete for talent. CASA and similar programs benefit. Time horizon: 5+ years
• Tailwind — Government subsidies: Federal and state childcare funding has expanded post-COVID (CCDF, state universal pre-K). Time horizon: 3-5+ years, policy-dependent
• Headwind — Labor costs: Childcare is labor-intensive (~60-70% of costs). Minimum wage increases and teacher shortages pressure margins. Time horizon: Permanent
• Headwind — Affordability crisis: Childcare costs $15,000-25,000+/year per child — unaffordable for many families. Limits demand growth. Time horizon: Permanent unless subsidies expand
• Market growth (5yr): Center-based childcare market grew at ~5-7% CAGR (estimate)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Bright Horizons (public, ~$2.5B revenue): Most direct competitor — employer-sponsored childcare and center-based care. Bright Horizons is more employer-focused (B2B); KinderCare is more consumer/retail-focused (B2C). Similar scale
• Learning Care Group (PE-backed): Third-largest center-based operator. Multiple brands (Childtime, La Petite, Tutor Time). Direct competitor in many markets
• Spring Education Group (PE-backed): Premium early ed and K-12 private schools. Competes at the higher end
• Independent operators: ~60% of market. Fragmented but collectively the largest "competitor." KinderCare wins on brand, consistency, and scale
• Competitive advantage: Scale (1,500+ centers is unmatched except by Bright Horizons), brand trust, proprietary curriculum, employer partnerships (CASA), and the Champions school-age program provides a differentiated channel
• Best at: Scale, brand recognition, suburban market coverage, and employer partnership programs
• Worst at: Premium positioning (loses to Montessori/boutique), affordability (costs are a barrier), and labor market competition (struggles to hire and retain teachers)`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Nov 2024: IPO on NYSE at $24/share. Partners Group exited via the public offering. Market cap ~$3-4B at IPO
• 2015: Partners Group acquired KinderCare
• Under Partners Group: Invested in center expansion, Champions program growth, and CASA employer channel development
• Earlier ownership: Knowledge Universe (Michael Milken) → various PE sponsors
• KinderCare has been PE-backed for most of its modern history; the 2024 IPO is the first time it's been public`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "kc1", text: "KinderCare's Nov 2024 IPO at $24/share was a significant milestone — the largest childcare-specific IPO in history. The investment thesis is straightforward: childcare is essential infrastructure with stable demand, and KinderCare is the largest operator in a highly fragmented market. The bear case is that childcare is a low-margin, labor-intensive business with structural affordability challenges. Margin expansion depends on tuition increases outpacing labor cost inflation — a difficult balance when parents are already stretched.", date: "2026-03-21T00:00:00Z" },
      { id: "kc2", text: "The employer-sponsored channel (CASA) is the most interesting growth vector. As corporations compete for talent, childcare benefits are becoming a strategic differentiator. If CASA can scale into a meaningful revenue stream, it diversifies KinderCare from pure B2C tuition and provides higher-margin, contractually recurring B2B revenue. Watch employer partnership growth as the leading indicator of whether KinderCare can break out of the low-margin childcare operator model.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "learningcare_seed", name: "Learning Care Group", sector: "education", sub: "traditional", priority: "Watching",
    fields: {
      overview: { text: `• Private center-based childcare and early education operator — the third-largest private childcare provider in the US behind KinderCare and Bright Horizons
• Formed through the 2005 merger of Childtime Learning Centers and Tutor Time; headquartered in Novi, MI
• Owned by American Securities (PE) since 2018
• CEO Mark Baiada
• ~17,000+ employees; operates ~900+ childcare centers across 37 states under multiple brands
• Brands include Childtime, La Petite Academy, Tutor Time, Montessori Unlimited, U.S. Swim School Association, and Young School
• Revenue estimated at $1-1.3B
• Multi-brand strategy differentiates from KinderCare's single-brand approach — each brand targets a different market segment and price point`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Tuition-based — parent-paid weekly/monthly tuition supplemented by government subsidies. Same model as KinderCare. Revenue is recurring but not contractually locked
• Childtime: Traditional full-day childcare and early education centers. Infants through school-age
• La Petite Academy: Full-day childcare with emphasis on school readiness. Slightly different brand positioning than Childtime
• Tutor Time: Premium-positioned childcare with proprietary "LifeSmart" curriculum. Higher price point
• Montessori Unlimited: Montessori-method early education centers. Premium segment
• Young School: School-age before/after care programs
• The multi-brand strategy allows Learning Care to serve different price points and educational philosophies without brand confusion
• Customers buy because: Same fundamental need as KinderCare — working parents need reliable childcare. Learning Care's multi-brand approach gives parents options across price points and educational approaches within the same operator's quality and safety standards`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer: Working parents — infants through school-age children
• ~900+ centers across 37 states
• Multi-brand strategy reaches broader demographic: Tutor Time and Montessori Unlimited serve higher-income families; Childtime and La Petite serve middle-income markets
• Geography: 37 US states — broad national coverage but below KinderCare's 40-state footprint
• Buying drivers: Same as industry — proximity, quality, safety, price, and availability. The brand variety is a competitive advantage for multi-market operators`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Same childcare industry dynamics as KinderCare — $60-65B US market, highly fragmented, 5-7% CAGR
• Learning Care at ~$1-1.3B is the #3 player behind KinderCare (~$2.5B) and Bright Horizons (~$2.5B)
• Same tailwinds (workforce participation, employer benefits, government subsidies) and headwinds (labor costs, affordability crisis) as the broader industry`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• KinderCare: The #1 operator. Larger scale, single brand, recently IPO'd. Learning Care competes on multi-brand flexibility
• Bright Horizons: More employer-focused model. Less direct overlap in the retail/consumer channel
• Spring Education: Competes at the premium end with Montessori and private school offerings
• Independent operators: Same 60% market share as for KinderCare
• Competitive advantage: Multi-brand strategy serving different market segments and price points. Allows geographic optimization — different brands for different neighborhoods. Montessori Unlimited provides premium positioning that KinderCare lacks
• Best at: Multi-segment coverage through brand portfolio, Montessori offering, and geographic flexibility
• Worst at: Scale vs. KinderCare and Bright Horizons, brand recognition (no single dominant brand), and employer channel (Bright Horizons and KinderCare are ahead)`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2018: American Securities acquired Learning Care Group. Terms not disclosed
• 2005: Childtime Learning Centers and Tutor Time merged to form Learning Care Group
• American Securities at ~8 years of ownership — well past typical hold period. Exit planning should be active. KinderCare's successful 2024 IPO at $3-4B market cap validates the childcare operator model for public markets or strategic sale`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "lcg1", text: "American Securities at 8 years of ownership and KinderCare's successful IPO creates a clear exit catalyst. Learning Care is the obvious #2/#3 childcare platform for either an IPO or a strategic sale. The multi-brand portfolio strategy is genuinely differentiated — it allows serving premium (Montessori Unlimited) and value (Childtime) segments simultaneously. The question is whether the multi-brand complexity adds operational overhead that offsets the market segmentation benefits.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "skillsoft_seed", name: "Skillsoft", sector: "education", sub: "corporate", priority: "Watching",
    fields: {
      overview: { text: `• Public corporate learning and talent development company (NYSE: SKIL); provides digital learning content, LMS, and workforce transformation solutions for enterprises
• Founded 1998; emerged from Chapter 11 bankruptcy in Sep 2020 and re-listed via SPAC merger with Churchill Capital Corp II in Jun 2021
• Acquired Codecademy (consumer/enterprise coding education) in Apr 2022 for ~$525M and Global Knowledge (IT training) in 2021
• CEO Ron Hovsepian (appointed 2020, former CEO of Novell)
• ~2,800 employees; headquartered in Nashua, NH
• Revenue ~$540-570M (FY2025); ~70% content subscriptions, 20% instructor-led training, 10% other
• Serves ~70% of the Fortune 1000; ~36M+ learners on the platform
• Stock has significantly underperformed since the SPAC listing — traded down ~90%+ from SPAC highs, reflecting market skepticism about the growth story
• Total debt of ~$580M+ creates financial pressure`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: SaaS subscription for content libraries and platform access (per-user or enterprise license), instructor-led training (project/transactional), and Codecademy consumer subscriptions (freemium to paid)
• Skillsoft Percipio: AI-powered learning platform — the core delivery mechanism. Content curation, personalized learning paths, skills assessments, analytics, and compliance training delivery
• Content Library: ~180,000+ courses, videos, books, and audiobooks covering business skills, leadership, technology, compliance, and professional development. The breadth of the content library is the competitive differentiator
• Codecademy: Interactive coding education platform — Python, JavaScript, SQL, data science, machine learning. ~45M+ registered users (mostly free). Enterprise version for corporate coding upskilling
• Global Knowledge (ILT): Instructor-led technology training — certifications for AWS, Cisco, Microsoft, CompTIA, etc. Classroom and virtual instructor-led training
• Compliance Training: Regulatory compliance courses (HIPAA, anti-harassment, OSHA, data privacy). Non-discretionary spend for enterprises
• Customers buy because: Enterprises need to continuously upskill employees — technology skills, leadership development, compliance requirements. Skillsoft provides the content library and platform at scale. Compliance training alone is a non-discretionary budget line`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Large enterprise — organizations with 1,000+ employees needing structured L&D programs. ~70% of Fortune 1000
• ~36M+ learners globally
• Key verticals: Technology, financial services, healthcare, government, manufacturing — horizontal across industries
• Geography: Estimated ~65% North America, ~25% EMEA, ~10% APAC
• Buying drivers: Employee upskilling (especially tech skills in the AI era), compliance training mandates, leadership development, and increasingly coding/data science skills via Codecademy`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Corporate learning and development market estimated at ~$50-60B globally, growing at ~8-12% CAGR
• Digital/online corporate learning specifically is ~$20-30B, growing at ~15-18% CAGR
• Skillsoft at ~$550M is a mid-tier player — below LinkedIn Learning (Microsoft) and Cornerstone but among the largest pure-play corporate learning content providers
• Tailwind — Skills gap and AI upskilling: Enterprises urgently need to reskill workers for AI. Coding, data science, and AI skills are in high demand. Time horizon: 5+ years
• Tailwind — Compliance training expansion: New regulations create new mandatory training categories. Time horizon: Permanent
• Headwind — LinkedIn Learning bundling: Microsoft bundles LinkedIn Learning with LinkedIn premium and M365 — massively commoditizes the corporate content market. Time horizon: Permanent and intensifying
• Headwind — Balance sheet pressure: ~$580M+ in debt on ~$550M revenue constrains investment and M&A. Time horizon: Until refinanced or reduced`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• LinkedIn Learning (Microsoft): The existential competitive threat. Bundled with LinkedIn premium subscriptions and M365 in some cases. Broad content library, growing rapidly, and backed by Microsoft's resources. Skillsoft cannot match the distribution or price
• Cornerstone OnDemand (Clearlake): Competes on LMS + content. Cornerstone's strength is the platform; Skillsoft's strength is the content library
• Udemy Business: Growing fast in enterprise learning with marketplace-sourced content. Modern UX. Competes on price and content freshness
• Pluralsight (Vista): Technology skills specifically. Stronger in developer/IT skills; Skillsoft is broader
• Coursera for Business: University-sourced content. Competes on credential quality
• Competitive advantage: One of the largest proprietary content libraries (180,000+ assets), breadth across business + technology + compliance, Codecademy for coding skills, and enterprise-grade compliance capabilities
• Best at: Content breadth, compliance training, and enterprise-scale deployment
• Worst at: UX (Percipio lags modern platforms), competing against LinkedIn Learning bundling, investor confidence (stock down 90%+), and balance sheet flexibility`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Apr 2022: Acquired Codecademy for ~$525M — interactive coding education. Aimed to add consumer-to-enterprise conversion and coding/data science content
• 2021: Acquired Global Knowledge — instructor-led IT training and certifications. Added classroom-based revenue
• Jun 2021: Re-listed via SPAC merger with Churchill Capital Corp II
• Sep 2020: Emerged from Chapter 11 bankruptcy — eliminated ~$2B in debt
• Key context: The post-SPAC performance has been poor. Stock has declined ~90%+ from SPAC highs. The Codecademy acquisition at $525M looks expensive in hindsight given the consumer freemium model's difficulty converting to enterprise revenue. Balance sheet remains levered`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "sk1", text: "Skillsoft's biggest challenge is the LinkedIn Learning juggernaut. Microsoft can bundle learning content with LinkedIn premium and M365 at marginal cost — Skillsoft has to charge standalone prices. The moat is in compliance training (which LinkedIn Learning doesn't focus on) and Codecademy's interactive coding platform (differentiated from video-based content). But the stock price tells the story — the market doesn't believe in the standalone corporate learning content model when LinkedIn Learning is bundled and Udemy undercuts on price. The debt load further constrains the company's options.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "renaissance_seed", name: "Renaissance Learning", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private K-12 education technology company — the leading provider of assessment, reading practice, and learning analytics software for US K-12 schools
• Founded 1986 in Wisconsin Rapids, WI by Judith and Terrence Paul; best known for Accelerated Reader (AR)
• Owned by Francisco Partners and TPG (co-acquired in 2018). Previously owned by Hellman & Friedman (2014) and was public prior (RLRN on Nasdaq)
• CEO Chris Bauleke
• ~4,500+ employees; headquartered in Bloomington, MN
• Serves ~50,000+ schools and ~18M+ students across the US and internationally
• Revenue estimated at $700-900M; predominantly SaaS subscription
• Core products: Star Assessments (formative/benchmark testing), Accelerated Reader (reading practice), myON (digital library), and Freckle (adaptive learning). The assessment platform is the strategic anchor`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: SaaS subscription — per-student or per-school annual contracts with school districts. High retention driven by state assessment alignment and academic year cycles
• Star Assessments: The flagship — computer-adaptive formative and benchmark assessments in reading, math, and early literacy. Used for universal screening, progress monitoring, and data-driven instruction. Aligned to state standards and approved as a benchmark assessment in most US states. This is Renaissance's competitive anchor
• Accelerated Reader (AR): The iconic reading practice program — students read books and take comprehension quizzes. Used in the majority of US K-12 schools. Decades of installed base
• myON: Digital library and reading platform — curated collection of digital books with reading tracking and analytics. Expands the AR ecosystem into digital reading
• Freckle: Adaptive practice platform for math, ELA, science, and social studies. Personalized practice at each student's level
• Schoolzilla: Data analytics platform for school districts — integrates data from multiple sources for district-level reporting and decision-making
• Customers buy because: Schools need assessment data to make instructional decisions — which students are on grade level, who needs intervention, where to allocate resources. Star Assessments is the most widely used formative assessment system in the US. AR is a cultural institution in K-12 reading programs`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: US K-12 school districts — both direct purchases and through state contracts. Elementary schools are the strongest segment (AR + Star)
• ~50,000+ schools serving ~18M+ students — massive installed base
• Key segments: Elementary and middle schools (AR/Star core market), district-wide assessment programs (Star), and intervention programs (Freckle)
• Geography: Estimated ~85-90% US, ~10-15% international (UK, Australia, Canada growing)
• Buying drivers: Federal and state accountability requirements mandate regular student assessment. ESSA (Every Student Succeeds Act) requires evidence-based intervention programs. Star is one of the most widely approved assessment tools for these requirements`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• K-12 assessment and instructional software market estimated at ~$8-12B in the US, growing at ~8-12% CAGR
• Renaissance at ~$700-900M is among the top 3-4 K-12 edtech vendors in the US by revenue
• Tailwind — Assessment-driven instruction: Schools increasingly use data to drive instructional decisions. Star is the leading formative assessment platform for this. Time horizon: Permanent
• Tailwind — Science of reading: National movement toward evidence-based reading instruction. AR and myON align with this. Time horizon: 5+ years
• Headwind — State funding volatility: ESSER (COVID relief) funds are expiring in 2024-2025 — school districts face budget pressure. Time horizon: 1-3 years of adjustment
• Headwind — Competition from free state assessments: Some states provide free benchmark assessments, reducing the addressable market for Star. Time horizon: Ongoing`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Curriculum Associates (i-Ready): Most direct competitor — i-Ready combines assessment + adaptive instruction in reading and math. Growing fast, especially in elementary. Competes head-to-head with Star + Freckle
• NWEA (MAP Growth): Nonprofit assessment organization. MAP Growth is a widely used alternative to Star for benchmark assessment. Strong in upper elementary and middle school
• Amplify (acquired by News Corp spinoff): K-12 curriculum and assessment. Competes in reading and science
• Lexia Learning (Cambium/Veritas): Reading intervention software. Competes with AR/myON in the reading space
• Competitive advantage: Installed base is massive — Star and AR are in ~50,000+ schools. Star is approved as a screening/benchmark tool in nearly every US state. The assessment-to-practice pipeline (Star identifies needs → Freckle/AR provides practice) is a closed-loop ecosystem
• Best at: Formative assessment (Star), reading practice (AR — cultural institution in schools), installed base scale, and state assessment approval
• Worst at: Adaptive instruction (i-Ready is more complete), modern UX (some products feel dated), and international markets`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2018: Francisco Partners and TPG co-acquired Renaissance Learning from Hellman & Friedman. Estimated $3-4B valuation
• Under Francisco Partners/TPG: Acquired Schoolzilla (data analytics) and invested in platform modernization
• 2014: Hellman & Friedman acquired Renaissance from public markets for ~$1.1B
• Francisco Partners and TPG at ~8 years of ownership — past typical hold period. Exit planning should be active`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "ren1", text: "Renaissance's assessment platform (Star) is the anchor — nearly every data-driven instructional decision in US K-12 starts with assessment data. Once a district adopts Star for universal screening, switching is very difficult (historical data, teacher training, state approval). The ESSER cliff (COVID funds expiring) is the near-term risk — districts may cut non-core subscriptions. But Star is core infrastructure for most districts, making it relatively resilient. Francisco Partners and TPG at 8 years need to execute an exit — the K-12 edtech market is being watched closely after the ESSER hangover to see whether growth normalizes or decelerates.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "hmh_seed", name: "Houghton Mifflin Harcourt", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private K-12 education technology and curriculum company — one of the "Big 3" US K-12 curriculum publishers (alongside McGraw Hill and Savvas/Pearson)
• Founded 1832 (one of the oldest publishers in America); headquartered in Boston, MA
• Owned by Veritas Capital (acquired in Apr 2023 for $2.8B after a bidding process). Previously publicly traded (Nasdaq: HMHC)
• Sold its consumer publishing division (trade books — "The Lord of the Rings," "Curious George") to HarperCollins for $349M in 2021 to focus entirely on K-12 education
• CEO/President Jim O'Neill
• ~4,000+ employees
• Revenue estimated at $1.5-1.8B; mix of digital subscriptions (growing), print curriculum (declining), and professional services
• The company has transformed from a traditional textbook publisher to a digital-first K-12 learning platform under the "HMH" brand`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Mix of digital subscriptions (SaaS, per-student), curriculum adoptions (large multi-year district purchases — lumpy, adoption-cycle driven), print materials (declining), and professional development services
• HMH Into Reading / Into Literature: Core reading and literature curriculum — ELA programs for K-12. Standards-aligned, digital-first with print supplements. Among the top-adopted ELA programs nationally
• HMH Into Math / Into AGA: Core math curriculum — K-12 math programs including algebra, geometry, and advanced math. Blended digital + print delivery
• HMH Into Science: K-12 science curriculum aligned to NGSS (Next Generation Science Standards)
• HMH Into Social Studies: Social studies curriculum
• Ed: The HMH digital learning platform — integrates all curriculum products into a single platform with adaptive practice, assessments, and teacher tools. This is the SaaS platform driving the digital transition
• Writable: AI-powered writing instruction and feedback platform. Growing tool for K-12 writing programs
• Waggle / Amira: Adaptive practice and AI reading tutor. Amira uses AI to listen to students read and provide feedback
• Customers buy because: School districts are mandated to adopt core curriculum for ELA, math, science, and social studies. State adoption cycles (typically 5-8 year cycles) drive large purchasing decisions. HMH is one of only 3 publishers with the scale and state approvals to compete for these major adoptions`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer: US K-12 school districts — purchasing curriculum for classroom instruction
• Serves millions of students across the US
• Key segments: State textbook adoptions (large, multi-year contracts), district-level purchases, and individual school purchases
• Geography: ~95%+ US; some international presence but minimal
• Buying drivers: State curriculum adoption cycles (states review and adopt curriculum on 5-8 year cycles), standards alignment (Common Core, NGSS), digital platform capabilities, and evidence of effectiveness. Purchasing decisions are politically influenced and lengthy`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• US K-12 curriculum and instructional materials market estimated at ~$10-14B, growing at ~4-7% CAGR overall (with digital growing 15-20%+ and print declining)
• The Big 3 publishers (HMH, McGraw Hill, Savvas/Pearson) collectively control ~60-70% of the core curriculum market
• Tailwind — Digital curriculum adoption: Schools transitioning from print textbooks to digital platforms. Each adoption cycle moves further digital. Time horizon: 5-10 years
• Tailwind — Science of reading: National movement driving new ELA/reading curriculum adoptions. HMH's Into Reading is well-positioned. Time horizon: 3-5 years
• Headwind — State adoption cycle lumpiness: Revenue is cyclical based on when large states (Texas, California, Florida) conduct curriculum reviews. Time horizon: Permanent characteristic
• Headwind — Open Educational Resources (OER): Free, open-source curriculum materials reduce the addressable market in some states. Time horizon: Ongoing but limited for core curriculum`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• McGraw Hill (Platinum Equity): Co-leader in K-12 curriculum. Similar product portfolio. Strongest in math and science. Competes head-to-head in every state adoption
• Savvas Learning (formerly Pearson K-12, Veritas Capital): Third member of the Big 3. Also owned by Veritas Capital (same PE owner as HMH — interesting dynamic). Competes across all subjects
• Amplify (News Corp): Digital-first K-12 curriculum — stronger in science (Amplify Science is market-leading) and reading intervention. Growing competitor for digital-native buyers
• Curriculum Associates (i-Ready): Competes in supplemental curriculum and assessment. Less direct overlap in core curriculum
• Competitive advantage: One of only 3 publishers with the scale, state approvals, and sales infrastructure to compete for major state curriculum adoptions. The Ed platform is the digital delivery mechanism. Amira (AI reading tutor) is a genuine differentiator
• Best at: Core ELA curriculum (Into Reading is top-adopted), large state adoption wins, established sales relationships with districts, and brand heritage (almost 200 years)
• Worst at: Innovation speed (legacy publisher culture), digital UX (Amplify is more modern), and non-core curriculum areas`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Apr 2023: Veritas Capital acquired HMH for $2.8B. Veritas also owns Savvas Learning (ex-Pearson K-12) — creating a unique situation where one PE firm owns 2 of the Big 3 K-12 curriculum publishers
• Nov 2021: Sold consumer publishing division (trade books) to HarperCollins (News Corp) for $349M — completed the pivot to K-12 education only
• Earlier: Emerged from Chapter 11 bankruptcy in 2012 (debt from leveraged acquisitions). Re-IPO'd on Nasdaq in 2013. History of financial distress driven by print-to-digital transition challenges`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "hmh1", text: "The most interesting dynamic is that Veritas Capital owns both HMH and Savvas Learning — 2 of the Big 3 K-12 curriculum publishers. This creates potential for operational synergies, shared digital platform development, and possibly a combined entity for exit. It also raises antitrust questions if they attempt to merge. The strategic question is whether Veritas is building a curriculum mega-platform or optimizing each for separate exits.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "colibri_seed", name: "Colibri Group", sector: "education", sub: "corporate", priority: "Watching",
    fields: {
      overview: { text: `• Private online professional education and licensing company — provides pre-licensing, continuing education (CE), and exam preparation for professionals in real estate, insurance, financial services, healthcare, and other licensed professions
• Founded 2012 (through consolidation of existing brands); headquartered in St. Louis, MO
• Owned by Gridiron Capital (since 2019 recapitalization). Management team retains significant equity
• CEO Jeff James
• ~1,500+ employees
• Revenue estimated at $300-500M; predominantly recurring subscription and per-course revenue
• Portfolio of education brands: Real Estate Express, McKissock Learning, Gold Coast Schools, Kaplan Professional (acquired), Bates White (acquired), and others
• Serves ~500,000+ professionals annually across licensed professions
• The thesis: Every licensed professional must complete continuing education to maintain their license — creating mandatory, recurring demand`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Mix of subscription (annual CE packages), per-course purchases, and exam prep fees. Revenue is highly recurring because continuing education is mandatory and cyclical (annual or biennial renewal requirements)
• Pre-Licensing Education: Courses required before professionals can take licensing exams (real estate salesperson, insurance agent, etc.)
• Continuing Education (CE): Mandatory courses professionals must complete to renew their licenses. Required by state regulators on annual or biennial cycles. The core revenue driver — 100% non-discretionary
• Exam Preparation: Study materials, practice exams, and prep courses for professional licensing exams
• Professional Development: Optional career advancement courses beyond mandatory CE
• Delivery: 100% online — self-paced courses, live webinars, and virtual classrooms. Digital-only model creates high margins
• Key verticals: Real estate (~40-50% of revenue estimated), insurance, financial services, healthcare (nursing, pharmacy), engineering, accounting
• Customers buy because: They have no choice — state regulators require continuing education for license renewal. Missing CE means losing your license and your ability to practice/earn. Demand is regulatory-driven and entirely non-discretionary`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile: Licensed professionals — real estate agents, insurance agents/brokers, financial advisors, nurses, engineers, accountants
• ~500,000+ professionals served annually
• Primarily individuals (B2C) purchasing their own CE courses; some B2B (brokerages, agencies purchasing for their agents)
• Geography: 100% US (state-by-state licensing requirements)
• Buying drivers: Entirely regulatory — professionals must complete state-mandated CE hours by specific deadlines. Price, convenience (online vs. classroom), and course availability are the selection criteria`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• US professional licensing and continuing education market estimated at ~$5-8B, growing at ~6-10% CAGR
• Colibri at ~$300-500M is one of the largest pure-play professional CE providers
• Tailwind — Regulatory expansion: More professions requiring licensure and CE over time. States adding new CE requirements (cybersecurity, ethics, DEI). Time horizon: Permanent
• Tailwind — Online migration: COVID permanently shifted CE delivery from classroom to online. Colibri is 100% online. Time horizon: Permanent
• Headwind — Competition from free/low-cost CE: State associations and industry groups sometimes offer low-cost CE, compressing pricing. Time horizon: Ongoing
• Headwind — Fragmented market: Thousands of small CE providers compete in local/niche markets. Time horizon: Permanent`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Kaplan (Graham Holdings): Large professional education brand. Colibri acquired some Kaplan Professional assets. Kaplan competes across multiple professional verticals
• CE Shop: Real estate-focused online CE competitor. Direct competitor in Colibri's largest vertical
• State associations: Many professional associations offer CE to members at low cost. Competition primarily on price
• Competitive advantage: Multi-vertical portfolio (real estate + insurance + healthcare + financial) creates cross-sell opportunities. 100% online delivery model is scalable with high margins. Brand portfolio addresses multiple state-specific markets. Roll-up strategy creates scale advantages over fragmented local competitors
• Best at: Real estate CE (largest market position), online delivery, multi-state coverage, and brand portfolio breadth
• Worst at: Competing against free association-provided CE, price-sensitive markets, and building brand loyalty in a commodity market`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2019: Gridiron Capital recapitalization — management-led buyout with Gridiron as PE partner
• Under Gridiron: Aggressive acquisition strategy — acquired Kaplan Professional real estate education, Gold Coast Schools, Bates White, and numerous smaller CE providers across verticals. Classic PE roll-up
• 2012: Founded through consolidation of professional education brands
• The roll-up continues — Colibri is actively acquiring smaller CE providers to expand vertical and geographic coverage`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "col1", text: "Colibri is a textbook PE roll-up in a non-discretionary market. Licensed professionals MUST complete CE — it's as close to guaranteed recurring demand as exists in education. The online delivery model creates high margins with minimal capital requirements. The growth strategy is straightforward: acquire small, fragmented CE providers across professional verticals, consolidate onto a common platform, and drive operational efficiency. The question is how large the addressable market can get — individual CE courses are low-ticket ($50-200), so scale requires very high volumes or expansion into higher-priced professional verticals.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "fullbloom_seed", name: "Fullbloom", sector: "education", sub: "other", priority: "Watching",
    fields: {
      overview: { text: `• Private special education and intervention services company — provides specialized instructional services (tutoring, intervention, special education staffing) to K-12 school districts under federal and state mandates
• Formed in 2020 from the rebranding and restructuring of Catapult Learning (formerly Platform Learning/EdisonLearning services division)
• Owned by Sandy River Education (management holding) with PE backing. Specific PE sponsors not prominently disclosed
• Includes brands: Catapult Learning (supplemental educational services), Specialized Education Services Inc (SESI — special education schools), and Fullbloom (corporate parent)
• Revenue estimated at $300-500M
• Serves hundreds of school districts and thousands of students requiring specialized instruction, particularly students with IEPs (Individualized Education Programs) and Title I eligible students
• The business model is driven by federal mandates — IDEA (Individuals with Disabilities Education Act) requires school districts to provide special education services, and many districts outsource to companies like Fullbloom`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Fee-for-service contracts with school districts — districts pay Fullbloom to provide specialized instructional services they cannot deliver internally. Revenue is project-based but recurring because the mandates are permanent
• Catapult Learning: Supplemental educational services — tutoring, intervention programs, and academic support for Title I and at-risk students. Deployed in-school or after-school within partner districts
• SESI (Specialized Education Services Inc): Operates non-public special education schools and programs for students with significant learning differences, behavioral challenges, and disabilities that cannot be served in traditional school settings
• Special Education Staffing: Provides specialized staff (special education teachers, paraprofessionals, therapists, behavior analysts) to school districts facing shortages
• Compensatory Education Services: Delivers services to students who were denied adequate education (often due to district failures) — court-ordered or settlement-driven
• Customers buy because: Federal law (IDEA) requires districts to provide appropriate special education services to all eligible students. Many districts lack the specialized staff and programs. Outsourcing to Fullbloom is often the only way to meet legal obligations. Title I funding supports supplemental services for at-risk students`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer: US K-12 school districts — purchasing specialized instructional services they cannot provide internally
• Serves hundreds of districts across multiple states
• Demand is mandate-driven — districts must serve students with IEPs regardless of budget conditions. This creates non-discretionary demand
• Geography: 100% US; concentrated in states with large urban districts and special education populations`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Special education services market estimated at ~$5-8B, growing at ~6-10% CAGR
• Driven by federal IDEA mandates, increasing special education identification rates, and chronic special education teacher shortages
• Tailwind — Special education teacher shortage: Severe and worsening — districts cannot hire enough special ed teachers. Outsourcing to companies like Fullbloom is the release valve. Time horizon: 5-10+ years
• Tailwind — Increasing special education identification: More students being identified for IEPs, especially post-COVID. Time horizon: 3-5+ years
• Headwind — Political scrutiny of outsourced education: Some critics oppose private companies providing public education services. Time horizon: Ongoing, policy-dependent
• Headwind — Budget constraints: While mandated, funding levels vary. Districts under financial pressure may push back on pricing. Time horizon: Cyclical`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Specialized Education Services: Fragmented market with many small local providers. Fullbloom is among the largest national providers
• Proximity Learning: Virtual special education and instructional services. Growing competitor using remote delivery model
• National staffing firms with education practices (Kelly Education, Swing Education)
• Competitive advantage: National scale, expertise in federal/state compliance, established district relationships, and ability to operate non-public special education schools (SESI) that few competitors can match
• The mandate-driven model creates a floor under demand — districts must provide services regardless of budget conditions`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2020: Rebranded from Catapult Learning to Fullbloom; restructured under Sandy River Education
• Earlier: History as part of EdisonLearning/Platform Learning ecosystem
• The company has been through multiple ownership and restructuring cycles — the current Fullbloom structure is the latest iteration`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "fb1", text: "Fullbloom's mandate-driven model is the key differentiator in the education services space. Districts don't choose whether to provide special education — they must. The question is whether they do it in-house or outsource. The special education teacher shortage is severe and worsening, which structurally increases outsourcing demand. However, the business is operationally complex (managing hundreds of district contracts, compliance requirements, staffing) and politically sensitive (private companies providing public education services). This limits both margins and scalability compared to pure SaaS edtech.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "ascend_seed", name: "Ascend Learning", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private education technology company focused on healthcare and other professional verticals — provides assessment, test preparation, curriculum, and certification platforms for nursing, medical, accounting, and fitness professions
• Formed through PE-driven consolidation; headquartered in Leawood, KS (Kansas City metro)
• Owned by Veritas Capital (acquired in 2019 from CDPQ and other investors). Previous PE owners include Bain Capital
• CEO Andrew Rosen
• ~2,500+ employees
• Revenue estimated at $600-800M; predominantly recurring subscription and per-exam fees
• Key brands: ATI Nursing (the dominant nursing assessment and test prep platform), NASM (National Academy of Sports Medicine — fitness certification), Becker (CPA exam prep), and Jones & Bartlett Learning (health sciences publishing)
• ATI Nursing is the crown jewel — used by ~90%+ of US nursing programs for NCLEX-RN preparation`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: SaaS subscription (per-student annual contracts for ATI), per-exam fees (certification exams), course purchases (Becker, NASM), and content licensing. Revenue is highly recurring because nursing schools purchase ATI annually and certification is mandatory
• ATI Nursing Education: Assessment, test prep, and clinical simulation for nursing students — the market leader. Includes comprehensive predictor exams, practice tests, remediation content, and NCLEX-RN preparation. Used by ~90%+ of US nursing programs. ~380,000+ nursing students annually
• Becker Professional Education: CPA exam preparation — one of the "Big 3" CPA review courses (alongside Wiley and Surgent). Also offers CMA and CIA exam prep
• NASM (National Academy of Sports Medicine): Personal trainer and fitness certification — the most recognized certification in the US fitness industry. ~100,000+ certified trainers
• Jones & Bartlett Learning: Health sciences and public safety educational content and publishing
• Ascend Clinical Solutions: Clinical decision support and healthcare education for practicing professionals
• Customers buy because: ATI — nursing schools need assessment data to predict NCLEX pass rates (accreditation depends on it). Becker — CPA candidates need comprehensive exam prep for a notoriously difficult exam. NASM — personal trainers need industry-recognized certification. All are high-stakes, mandatory, or career-essential purchases`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer profile depends on the brand:
  - ATI: US nursing schools and nursing students (B2B institutional sales to nursing programs)
  - Becker: Individual CPA candidates and accounting firms (B2C and B2B)
  - NASM: Individual fitness professionals and gyms (B2C and B2B)
• ATI serves ~380,000+ nursing students annually across ~2,300 nursing programs — essentially the entire US nursing education market
• Geography: Primarily US (~90%+); some international presence in nursing and fitness
• Buying drivers: Accreditation and licensure — nursing schools must demonstrate student readiness (ATI), CPA candidates must pass the exam (Becker), and personal trainers need certification (NASM). All non-discretionary`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Healthcare education technology market estimated at ~$5-8B, growing at ~10-15% CAGR
• Nursing education specifically is ~$1-2B market where ATI has ~90% penetration
• Tailwind — Nursing shortage: The US faces a severe and worsening nursing shortage — demand for new nurses drives enrollment in nursing programs, which drives ATI usage. Time horizon: 10+ years
• Tailwind — Professional certification growth: More professions requiring formal certification creates demand across Ascend's verticals. Time horizon: Permanent
• Headwind — Nursing school capacity constraints: Even as demand for nurses grows, nursing schools are constrained by faculty shortages and clinical site availability. This limits enrollment growth. Time horizon: 5+ years
• Market growth (5yr): Healthcare education technology grew at ~10-13% CAGR (estimate)`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Elsevier (RELX): Hesi exams compete with ATI in nursing assessment. The only meaningful competitor to ATI — market is essentially a duopoly. ATI has ~90%, Hesi has ~10%
• Wiley (CPA review): Competes with Becker for CPA exam prep. Becker is the premium choice; Wiley is price-competitive
• ACE / ACSM (fitness certifications): Compete with NASM for personal trainer certification. NASM has the strongest brand recognition
• Competitive advantage: Near-monopoly position in nursing education (ATI ~90%), strong brand recognition across professional verticals, and the non-discretionary nature of the end markets. Switching costs for nursing schools are very high — faculty are trained on ATI, curricula are mapped to ATI assessments, and NCLEX predictor data is longitudinal
• Best at: Nursing education assessment (near-monopoly), CPA exam prep (top brand), and fitness certification (market leader)
• Worst at: International markets, competing on price (premium-priced across all brands), and adjacent healthcare professional verticals`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2019: Veritas Capital acquired Ascend Learning. Terms not disclosed but estimated $3-4B
• Under Veritas: continued investment in ATI platform, potential bolt-on acquisitions in healthcare education
• Earlier PE ownership: Bain Capital, Providence Equity, and others. Ascend has been PE-backed for its entire modern history
• Veritas at ~7 years of ownership — past typical hold period. Veritas also owns HMH and Savvas, creating a large education portfolio`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "asc1", text: "ATI's ~90% penetration in US nursing programs is one of the most dominant market positions in all of education technology. Nursing schools functionally cannot operate their assessment and NCLEX prep programs without ATI. The nursing shortage ensures sustained enrollment demand, and the non-discretionary nature of the product (accreditation requires assessment data) creates a floor under revenue. Veritas at 7 years of ownership should be positioning for exit — the near-monopoly characteristics and non-discretionary demand should command a premium multiple.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "cengage_seed", name: "Cengage", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private higher education digital learning and curriculum company — one of the largest US college textbook and courseware publishers
• Founded 2007 (formed from Thomson Learning, the education division of Thomson Corporation, spun off after acquisition by Apax Partners and OMERS)
• Emerged from Chapter 11 bankruptcy in Apr 2014 after filing in Jul 2013 with $5.8B in debt
• Owned by institutional investors post-emergence; Michael Hansen served as CEO until 2024
• ~4,500 employees; headquartered in Boston, MA
• Revenue estimated at $1.3-1.5B
• Pioneer of the "Cengage Unlimited" subscription model — all-access digital subscription for students, launched 2018. Changed the economics of college course materials
• Key product: MindTap (digital learning platform) and Cengage Unlimited (subscription)`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Mix of digital subscription (Cengage Unlimited — per-student per-term), institutional courseware licenses, and print textbook sales (declining). The strategic shift to subscription has changed the revenue profile from lumpy textbook sales to more recurring digital revenue
• Cengage Unlimited: All-access subscription — students pay one price per semester for access to Cengage's entire digital catalog (thousands of courses across all subjects). Pioneered the "Netflix of textbooks" model for college. The most important strategic product
• MindTap: Digital courseware platform — integrates reading, assignments, study tools, and analytics into a single platform for each course. Faculty adopt MindTap for specific courses
• WebAssign: Online homework and assessment platform — dominant in STEM courses (physics, chemistry, math). High-usage, high-retention product
• SAM / Aplia / OWLv2: Subject-specific digital learning platforms for various disciplines
• Print textbooks: Still a revenue contributor but declining. Cengage uses print as a supplement to digital, not the primary product
• Customers buy because: College students need course materials — required by faculty. Cengage Unlimited makes it affordable (one price for all courses vs. $100-200 per textbook). Faculty adopt MindTap/WebAssign because it automates homework grading and provides analytics`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer: US college students (B2C subscription buyers) and higher education faculty/institutions (B2B adoption decisions)
• Serves millions of students across US higher education
• Faculty make the adoption decision (which courseware to require); students are the end users and payers
• Key segments: STEM (WebAssign — strongest), business, social sciences, and humanities
• Geography: Primarily US (~85-90%); some international presence
• Buying drivers: Faculty adopt based on content quality, digital platform features, and student affordability. The Cengage Unlimited subscription model is a competitive advantage because it's significantly cheaper than buying individual textbooks`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• US higher education learning materials market estimated at ~$10-14B, declining at ~2-4% CAGR overall (print decline offsetting digital growth)
• Digital courseware and platforms specifically growing at ~8-12% CAGR
• The Big 3 publishers (Pearson, McGraw Hill, Cengage) control ~60-70% of the US higher ed materials market
• Tailwind — Inclusive Access/Equitable Access: Institutional programs that auto-deliver digital materials to students at discounted rates. Growing rapidly as colleges adopt it. Time horizon: 3-5 years
• Tailwind — Digital-first adoption: Faculty increasingly adopting digital-only courseware. Time horizon: Permanent
• Headwind — OER (Open Educational Resources): Free textbooks and materials. Growing adoption in community colleges and some four-year programs. Time horizon: Ongoing
• Headwind — Enrollment decline: US college enrollment declining in some segments. Fewer students = less course material demand. Time horizon: 5-10 years`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Pearson (public, ~$4.5B revenue): The largest education company globally. Competing in the same digital transition. Pearson+ subscription model competes with Cengage Unlimited
• McGraw Hill (Platinum Equity): Direct competitor across all subjects. ALEKS (adaptive math) is differentiated. Attempted to merge with Cengage in 2019 — deal was blocked on antitrust grounds
• Competitive advantage: Cengage Unlimited was first-to-market with the all-access subscription model. WebAssign is dominant in STEM homework/assessment. Price positioning (more affordable than Pearson/McGraw Hill) resonates with cost-conscious students
• Best at: Subscription model (first mover), STEM platforms (WebAssign), and price competitiveness
• Worst at: Scale vs. Pearson, brand perception post-bankruptcy, and competing for faculty adoption against McGraw Hill in some subjects
• Biggest threat (3yr): Pearson+ and McGraw Hill subscription models catching up, OER adoption accelerating, and enrollment decline
• Largest opportunity (3yr): Inclusive/Equitable Access programs expanding — if every college auto-delivers Cengage Unlimited to students, the subscription penetration increases dramatically`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2019: Attempted merger with McGraw Hill — would have created a mega-publisher. Deal abandoned after DOJ antitrust concerns
• Apr 2014: Emerged from Chapter 11 bankruptcy — eliminated ~$4B in debt
• 2018: Launched Cengage Unlimited — the strategic pivot to subscription
• Key context: The failed McGraw Hill merger and the Chapter 11 history define the company's strategic positioning. Cengage has leaned into the subscription model and price competitiveness as differentiators since`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "cen1", text: "Cengage Unlimited was a bold strategic move — first to offer an all-access subscription for college course materials. It positioned Cengage as the affordable alternative in a market where students are increasingly price-sensitive. The question is whether subscription economics work long-term: if students pay $120/semester for unlimited access vs. $300+ for individual textbooks, Cengage needs higher volume to offset lower per-student revenue. The model works if Cengage Unlimited drives faculty adoption (more courses using Cengage because students already have access) and Inclusive Access programs expand.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "springed_seed", name: "Spring Education", sector: "education", sub: "traditional", priority: "Watching",
    fields: {
      overview: { text: `• Private premium early education and K-12 private school operator — owns and operates a portfolio of private school brands across the US
• Formed through consolidation; headquartered in Campbell, CA
• Owned by Spring Education Group (management) with backing from Primavera Capital Group (Hong Kong-based PE) and other institutional investors
• CEO Chris Gibbs
• Operates ~300+ school locations across 24 states serving ~30,000+ students
• Revenue estimated at $700M-1B
• Portfolio includes premium brands: Stratford School (STEM-focused K-8), BASIS Charter Schools (among the top-ranked schools in the US), LeafSpring Schools, Nobel Learning Communities, Merryhill School, and early education centers
• Differentiated from KinderCare/Learning Care by offering K-12 private education in addition to early childhood — a broader age range and premium positioning`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Tuition-based — parents pay annual tuition for private school enrollment. Pricing ranges from $15,000-30,000+/year depending on the school brand and grade level. Revenue is recurring (students enrolled for years) but driven by enrollment capacity and retention
• Early Education Centers: Premium early childhood education (infant through pre-K) across multiple brands. Higher quality and price point than KinderCare/Learning Care
• Stratford School: STEM-focused private school (preschool through 8th grade). Among the most recognized private school brands in California. Emphasis on STEM, Mandarin, and accelerated academics
• BASIS Schools: Internationally recognized for academic rigor — consistently ranked among the top public and private schools in the US by US News & World Report. Offers both charter (free) and private (tuition) models
• LeafSpring Schools: Premium early education focused on infant through school-age care
• Merryhill School / Nobel Learning: Additional private school brands across various markets
• Customers buy because: Parents seeking premium, rigorous academic environments that public schools cannot match. Willingness to pay $15,000-30,000+/year for perceived quality advantage, smaller class sizes, and specialized programs (STEM, language immersion)`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer: Affluent families willing to pay premium tuition for private education
• ~30,000+ students across 300+ locations in 24 states
• Demographic: Upper-middle to high-income families, particularly in suburban markets with strong property values
• Geography: Concentrated in California (Stratford), Arizona and Texas (BASIS), and across the Southeast and East Coast. US only
• Buying drivers: Academic quality, school reputation, small class sizes, STEM/specialized programs, and parental perception of advantage for college preparation`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• US private school market estimated at ~$70-80B (tuition revenue), relatively flat growth at ~3-5% CAGR due to enrollment stability
• Premium early education is the faster-growing segment at ~6-10% CAGR
• Tailwind — Dissatisfaction with public schools: Parental frustration with public school quality, safety, and politics drives demand for private alternatives. Time horizon: Ongoing
• Tailwind — Income growth among target demographic: Affluent families' income and wealth growth supports tuition increases. Time horizon: Long-term
• Headwind — Affordability ceiling: Even affluent families have limits on tuition tolerance. $25,000+ per year per child is significant. Time horizon: Permanent
• Headwind — Charter school competition: Free high-quality charter schools (like BASIS charter campuses) provide an alternative to private tuition. Time horizon: Permanent`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• KinderCare / Bright Horizons / Learning Care: Compete in early education but at a lower price point. Spring Education is positioned premium
• Independent private schools: The primary competition. Spring Education competes against thousands of independent private schools that operate as single campuses
• Competitive advantage: Multi-brand portfolio across early ed through K-12. Scale enables shared services (HR, finance, curriculum development) across 300+ locations. BASIS brand is a powerful draw for academically ambitious families
• Best at: Premium early education, STEM-focused K-8 (Stratford), academic rigor (BASIS), and multi-campus operational efficiency
• Worst at: Price accessibility (premium only), geographic concentration (California-heavy), and competing with free charter schools`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Primavera Capital Group is the primary PE backer; has invested over multiple years to build the portfolio
• The company has grown through serial acquisition of private school brands — Stratford, BASIS private campuses, LeafSpring, Nobel Learning, Merryhill, and others
• The consolidation strategy mirrors what KinderCare did in childcare — aggregate fragmented single-campus operators under one management platform`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "se1", text: "Spring Education's portfolio approach to private schools is a differentiated model. Most private schools are single-campus independents with no operational scale advantages. Spring Education brings PE-style operational efficiency (shared services, standardized curriculum, centralized management) to a highly fragmented market. The BASIS brand in particular is a powerful asset — consistently ranked as a top US school system. The question is how scalable premium private education is — tuition at $15,000-30,000+/year limits the addressable market to affluent families, and each new campus requires significant real estate and faculty investment.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "brighthorizons_seed", name: "Bright Horizons", sector: "education", sub: "traditional", priority: "Watching",
    fields: {
      overview: { text: `• Public employer-sponsored childcare and early education company (NYSE: BFAM); the #1 provider of employer-sponsored childcare in the US and the leading operator of workplace childcare centers globally
• Founded 1986 in Watertown, MA by Roger Brown and Linda Mason; headquartered in Newton, MA
• IPO'd on NYSE in Jan 2013 at $22/share; previously owned by Bain Capital (2008-2013 and earlier periods)
• CEO Stephen Kramer (appointed 2022)
• ~36,000+ employees globally; operates ~1,100+ childcare centers in the US, UK, Netherlands, Australia, and India
• Revenue ~$2.5-2.7B (2024); the largest childcare company globally by center count alongside KinderCare
• Three segments: Full Service Center-Based Care (~80% of revenue), Back-Up Care (~15%), and Educational Advisory (~5%)
• The employer-sponsored model is the key differentiator — Bright Horizons operates childcare centers at or near employer worksites, funded partly by employer subsidies`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Employer contracts (B2B — employers pay Bright Horizons to operate centers and provide benefits) + parent-paid tuition (supplemented by employer subsidies). Back-Up Care is a per-use fee model. Revenue is recurring through multi-year employer contracts
• Full Service Center-Based Care: Company-owned childcare centers, many located at or near employer worksites. Employers subsidize tuition for employees. Infants through school-age. ~1,100+ centers globally. The core business
• Back-Up Care: Emergency/backup childcare for employees when regular care falls through. Employers pre-purchase days for employees. Used by ~1,100+ employer clients including many Fortune 500 companies. High-margin, fast-growing segment
• Educational Advisory: College admissions advising, tuition assistance, and student loan repayment advisory — employer-sponsored education benefits. Smaller but growing
• Customers buy because: Employers use Bright Horizons to attract and retain talent — childcare benefits are a top-5 employee benefit. Working parents get subsidized, high-quality childcare at or near their workplace. The employer-sponsored model means parents pay less than market rate, increasing demand`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Two customer types: (1) Employer clients who contract for childcare/backup care services, and (2) parent end-users of the centers and services
• ~1,100+ employer clients for Back-Up Care including major corporations across finance, tech, consulting, healthcare, and government
• Geography: US (~75%), UK (~15%), Netherlands, Australia, India (~10% combined). The most global of the major childcare operators
• Employer client profile: Large enterprises (5,000+ employees) with competitive talent markets — financial services, technology, consulting, healthcare, and government
• Buying drivers for employers: Talent attraction and retention (childcare benefits reduce turnover), employee productivity (reliable childcare reduces absenteeism), and competitive benefits packages. For parents: subsidized cost, quality, and convenience`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Same US childcare market (~$60-65B) as KinderCare. Bright Horizons also operates internationally
• Employer-sponsored childcare specifically is ~$5-10B and growing at ~8-12% CAGR — faster than the overall childcare market
• Tailwind — Employer benefits competition: Companies competing for talent increasingly offer childcare benefits. Time horizon: 5+ years
• Tailwind — Back-up care growth: Relatively new benefit category growing rapidly as employers recognize the ROI of reducing childcare-related absenteeism. Time horizon: 5+ years
• Headwinds: Same as industry — labor costs, affordability, and teacher shortages`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• KinderCare: Most direct competitor in center-based care but KinderCare is more B2C/retail-focused. Bright Horizons dominates the employer-sponsored (B2B) model
• Learning Care Group: Competes in center-based care at a lower price point
• Care.com (IAC): Competes in backup care and caregiving benefits. Platform model vs. Bright Horizons' operated-center model
• Competitive advantage: The employer-sponsored model is the moat — multi-year employer contracts create recurring, subsidized revenue. The B2B relationship is stickier than B2C (employer contracts vs. individual parent decisions). Back-Up Care is a high-margin, high-growth segment with limited competition
• Best at: Employer-sponsored childcare (market leader), Back-Up Care (pioneered the category), international presence, and premium positioning
• Worst at: Retail/consumer childcare market (KinderCare is stronger), affordability (premium pricing limits non-employer-sponsored access), and growth in center count (capital-intensive)`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• Jan 2013: IPO on NYSE at $22/share. Stock has appreciated significantly since IPO
• 2008: Bain Capital acquired Bright Horizons
• Under public ownership: Expanded through organic center openings and selective acquisitions, including international expansion in UK and Australia
• Market cap ~$7-8B as of early 2026; a premium-valued childcare company reflecting the employer-sponsored recurring model`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "bh1", text: "Bright Horizons trades at a significant premium to KinderCare because the employer-sponsored model creates more predictable, higher-margin, stickier revenue. Employer contracts are multi-year and B2B — fundamentally different from KinderCare's B2C tuition model. Back-Up Care is the highest-growth, highest-margin segment — if it continues scaling, it could become the primary value driver over time. The comparison to KinderCare is instructive: similar revenue, but Bright Horizons commands roughly 2x the market cap because of the business model quality.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "mcgrawhill_seed", name: "McGraw Hill", sector: "education", sub: "edtech", priority: "Watching",
    fields: {
      overview: { text: `• Private education company — one of the "Big 3" US education publishers providing digital learning platforms, textbooks, and adaptive learning tools for K-12 and higher education
• Founded 1888; headquartered in New York, NY. One of the oldest education companies in the world
• Owned by Platinum Equity (acquired from Apollo Global Management in 2021). Apollo had acquired McGraw-Hill Education for $2.5B in 2013 after S&P Global (then McGraw-Hill Companies) divested the education division
• CEO Simon Allen (appointed 2019)
• ~4,500+ employees globally
• Revenue estimated at $1.5-1.8B
• Key products: ALEKS (adaptive math platform), Connect (higher ed digital platform), and comprehensive K-12 curriculum
• The failed 2019 merger with Cengage (blocked on antitrust) was a defining moment — confirmed that the Big 3 publishers will remain separate entities`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Mix of digital subscriptions (growing), institutional courseware licenses, print textbook sales (declining), and adaptive learning platform subscriptions. Digital is now the majority of revenue
• ALEKS: AI-powered adaptive learning platform for math and science — uses knowledge space theory to create individualized learning paths. Used in K-12 and higher education. One of the most validated adaptive learning systems in education. The crown jewel
• McGraw Hill Connect: Higher education digital courseware platform — integrates reading, assignments, assessments, and analytics. Faculty adopt Connect for specific courses. Competes with Cengage MindTap and Pearson MyLab
• McGraw Hill K-12 Curriculum: Core curriculum for ELA, math, science, and social studies. Competes in state adoption cycles alongside HMH and Savvas
• SIMnet: Simulated learning environment for technology skills (Microsoft Office, etc.)
• Sharpen: AI-powered tutoring platform — growing investment in AI-assisted learning
• Customers buy because: Faculty need comprehensive, standards-aligned course materials with digital delivery. ALEKS is adopted specifically for its adaptive math capabilities — proven to improve student outcomes. K-12 districts need state-approved curriculum for adoption cycles`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Dual market: Higher education (Connect, ALEKS — university/college course adoptions) and K-12 (curriculum — district/state adoptions)
• Serves millions of students globally
• Geography: Estimated ~70% North America, ~20% EMEA, ~10% APAC. Stronger internationally than Cengage
• Buying drivers: Same as Cengage — faculty adoption decisions, state curriculum cycles, and digital platform capabilities`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• Same education publishing market as Cengage and HMH — combined K-12 + higher ed is ~$25-30B globally
• McGraw Hill at ~$1.5-1.8B is the #2 or #3 education publisher globally depending on the metric (behind Pearson)
• Same tailwinds (digital adoption, inclusive access) and headwinds (OER, enrollment decline) as Cengage`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• Pearson: #1 education publisher globally. Competes across all segments
• Cengage: #3 publisher. Cengage Unlimited subscription competes for student wallet share
• HMH / Savvas (Veritas): Compete primarily in K-12 curriculum
• Competitive advantage: ALEKS is a genuine differentiator — no other publisher has a comparable adaptive learning engine with the same level of academic validation. Connect is competitive in higher ed digital. The brand carries 135+ years of heritage
• Best at: Adaptive math (ALEKS), higher ed STEM courseware, and international presence
• Worst at: Subscription model (behind Cengage Unlimited), K-12 market share vs. HMH, and print-to-digital transition pace`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2021: Platinum Equity acquired McGraw Hill from Apollo Global Management. Terms not disclosed but estimated ~$4-5B
• 2019: Attempted merger with Cengage — would have created a mega-publisher. Abandoned after DOJ antitrust concerns
• 2013: Apollo Global Management acquired McGraw-Hill Education for $2.5B from McGraw-Hill Companies (now S&P Global)
• Platinum Equity at ~5 years of ownership — approaching exit window`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "mgh1", text: "ALEKS is the strategic asset that differentiates McGraw Hill from other publishers. It's one of the only truly adaptive learning systems in widespread use, backed by decades of cognitive science research. If AI-powered personalized learning becomes the standard for education, ALEKS gives McGraw Hill a credible platform to build on. Platinum Equity at 5 years will be looking at exit options — the education publisher space has seen significant PE activity (Veritas buying both HMH and Savvas) and a strategic consolidation play could emerge.", date: "2026-03-21T00:00:00Z" }
    ]
  },
  {
    id: "adtalem_seed", name: "Adtalem Global Education", sector: "education", sub: "other", priority: "Watching",
    fields: {
      overview: { text: `• Public healthcare-focused for-profit education company (NYSE: ATGE); operates medical schools, nursing programs, and healthcare professional education institutions
• Founded 1973 as DeVry Inc (originally DeVry University); rebranded to Adtalem Global Education in 2017 and pivoted entirely to healthcare education
• Divested DeVry University to Cogswell Education (Jan 2018) and Keller Graduate School to strategic buyer — completed the pivot from broad for-profit education to healthcare-only
• CEO Stephen Beard (appointed 2022)
• ~5,000+ employees; headquartered in Chicago, IL
• Revenue ~$1.5-1.7B (FY2025); predominantly tuition from healthcare-focused institutions
• Key institutions: Ross University School of Medicine (Caribbean medical school), Chamberlain University (nursing — largest grantor of BSN degrees in the US), and American University of the Caribbean School of Medicine
• Unique positioning: The only scaled, public company focused exclusively on for-profit healthcare education — specifically medical and nursing programs where there is chronic undersupply`, date: "2026-03-21T00:00:00Z" },
      products: { text: `• Revenue model: Tuition-based — students pay tuition for degree programs. Supplemented by government financial aid (Title IV) which represents the majority of student funding. Revenue is recurring (students enrolled for 2-4+ year programs) with predictable cohort-based enrollment
• Chamberlain University: Nursing and healthcare programs — BSN (largest grantor in the US), MSN, DNP, and other healthcare degrees. Multiple campuses and online. The growth engine
• Ross University School of Medicine (RUSM): Caribbean-based MD program. Students complete basic sciences in Barbados, clinical rotations in the US. Pipeline of physicians for underserved markets
• American University of the Caribbean School of Medicine (AUC): Similar Caribbean MD program based in Sint Maarten
• Walden University (recently divested aspects): Graduate education — was part of the portfolio but Adtalem has been streamlining to pure healthcare focus
• Customers buy because: Aspiring doctors and nurses need accredited programs to enter their professions. US medical school and nursing school seats are in chronic shortage — Caribbean medical schools and scaled nursing programs provide access for students who cannot get into US MD programs or find available nursing school slots`, date: "2026-03-21T00:00:00Z" },
      customers: { text: `• Core customer: Students pursuing healthcare careers — aspiring physicians (RUSM, AUC) and nurses (Chamberlain)
• ~80,000+ students enrolled across all institutions
• Student profile: Career-changers, non-traditional students, and students who did not gain admission to US-based MD programs. Chamberlain serves a broader nursing student demographic including working adults
• Geography: US-based students primarily (Chamberlain); Caribbean-based medical schools (RUSM in Barbados, AUC in Sint Maarten) serving US students who complete clinical rotations in the US
• Buying drivers: Career opportunity (nursing and physician salaries are strong), chronic shortage of healthcare professionals creates job security, and limited seats in US programs create demand for alternative pathways`, date: "2026-03-21T00:00:00Z" },
      industry: { text: `• US healthcare professional education market estimated at ~$30-40B; nursing education specifically is ~$8-12B
• Adtalem at ~$1.5-1.7B is the largest pure-play for-profit healthcare education company
• Tailwind — Nursing and physician shortages: Severe and worsening — the US needs 200,000+ additional nurses by 2030. Creates sustained enrollment demand. Time horizon: 10+ years
• Tailwind — Regulatory stability: The current regulatory environment for for-profit education is more favorable than the 2010-2016 Obama-era crackdown. Time horizon: Administration-dependent
• Headwind — For-profit stigma: For-profit education companies face reputational and regulatory scrutiny. Gainful employment rules and borrower defense claims are risks. Time horizon: Permanent
• Headwind — Caribbean medical school perception: RUSM and AUC face perception challenges vs. US-based MD programs. Match rates and licensure outcomes are scrutinized. Time horizon: Permanent`, date: "2026-03-21T00:00:00Z" },
      competitive: { text: `• National University (Chamberlain competitor): Large private nonprofit university with nursing programs
• Western Governors University: Nonprofit online university with growing nursing programs. Growing fast
• Caribbean medical schools: St. George's University (the largest and most established Caribbean med school), Saba, and others compete with RUSM and AUC
• Public universities: State nursing and medical programs are the primary competitors but have limited capacity — the shortage of seats is what creates demand for Adtalem's programs
• Competitive advantage: Scale (Chamberlain is the largest BSN grantor in the US), online delivery capability (reaches students nationwide), and the healthcare-only focus. The nursing shortage ensures demand
• Best at: Scaled nursing education (Chamberlain), alternative MD pathways (RUSM/AUC), and online/hybrid delivery
• Worst at: Brand perception (for-profit stigma), Caribbean medical school reputation vs. US MD programs, and regulatory risk`, date: "2026-03-21T00:00:00Z" },
      transactions: { text: `• 2022: Divested Walden University to Adtalem — actually acquired Walden via merger with National Education Holdings earlier; subsequently divested financial services education assets to focus pure-play healthcare
• 2018: Divested DeVry University — completed pivot from broad for-profit education to healthcare-only
• 2017: Rebranded from DeVry Education Group to Adtalem Global Education
• Earlier: Acquired Chamberlain College of Nursing, Ross University, American University of the Caribbean over multiple years to build the healthcare education portfolio
• The transformation from DeVry (broad for-profit with significant regulatory issues) to Adtalem (healthcare-focused, nursing shortage thesis) is one of the more successful strategic pivots in for-profit education`, date: "2026-03-21T00:00:00Z" },
      financials: { text: "", date: "" }
    },
    notes: [
      { id: "adt1", text: "Adtalem's pivot from DeVry (struggling, regulatory-challenged for-profit) to a pure-play healthcare education company is the investment story. Chamberlain University producing the most BSN graduates in the US while the nursing shortage worsens is a powerful demand thesis. The risk is entirely regulatory — a hostile administration could tighten gainful employment rules or Title IV access for for-profit institutions. The Caribbean medical school business (RUSM, AUC) is more controversial — match rates and student outcomes are scrutinized, and these programs lack the brand premium of US MD programs. Chamberlain nursing is the better business; the medical schools are the risk.", date: "2026-03-21T00:00:00Z" }
    ]
  }
];

async function run() {
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
