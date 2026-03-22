import { useState } from "react";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// ─── SOFTWARE ECOSYSTEM DATA ──────────────────────────
const SW_SUBSECTORS = {
  crm: { name: "CRM", fullName: "Customer Relationship Management", category: "Horizontal Applications", color: "#3B82F6",
    tam: "$80B+ (2025)", growth: "~10-12% CAGR", icon: "👥",
    desc: "Software to manage customer interactions, sales pipelines, marketing campaigns, and service requests. The backbone of go-to-market operations for most enterprises.",
    whatTheySell: "Sales automation, contact management, lead scoring, pipeline analytics, customer 360 views, marketing automation, service ticketing.",
    whoBuys: "Sales teams, marketing teams, customer success, C-suite (CRO, CMO). Every company with customers.",
    keyPlayers: ["Salesforce", "Microsoft Dynamics 365", "HubSpot", "Zoho", "Oracle CX", "SAP CX", "Freshworks"],
    trends: "AI-powered lead scoring & forecasting. Conversational AI for service. Platform consolidation (CRM + marketing + service). Salesforce dominant at ~23% share.",
  },
  erp: { name: "ERP", fullName: "Enterprise Resource Planning", category: "Horizontal Applications", color: "#3B82F6",
    tam: "$65B+ (2025)", growth: "~9-11% CAGR", icon: "🏭",
    desc: "Integrated suites managing core business processes: finance, procurement, manufacturing, supply chain, HR. The system of record for the enterprise.",
    whatTheySell: "General ledger, accounts payable/receivable, procurement, inventory management, manufacturing planning, project accounting.",
    whoBuys: "CFO, COO, CIO. Mid-market to large enterprises. Manufacturing, retail, distribution heavily dependent.",
    keyPlayers: ["SAP S/4HANA", "Oracle Cloud ERP", "Microsoft Dynamics 365", "Workday (Financials)", "Infor", "NetSuite (Oracle)", "Epicor"],
    trends: "Cloud migration from on-prem (SAP S/4HANA deadline 2027). AI for demand forecasting. Industry-specific cloud ERP. SAP + Oracle dominate with ~55% combined share.",
  },
  hcm: { name: "HCM", fullName: "Human Capital Management", category: "Horizontal Applications", color: "#3B82F6",
    tam: "$30B+ (2025)", growth: "~10-12% CAGR", icon: "🧑‍💼",
    desc: "Software for managing the full employee lifecycle: recruiting, onboarding, payroll, benefits, performance, learning, workforce planning.",
    whatTheySell: "Payroll processing, benefits admin, talent acquisition (ATS), performance management, learning management (LMS), workforce analytics.",
    whoBuys: "CHRO, HR teams, payroll departments. Every company with employees.",
    keyPlayers: ["Workday", "ADP", "SAP SuccessFactors", "Oracle HCM Cloud", "UKG", "Paylocity", "Paycom", "Dayforce"],
    trends: "AI for resume screening & skills matching. Employee experience platforms. Pay equity analytics. Workday dominant in enterprise; ADP in payroll.",
  },
  collab: { name: "Collaboration & Productivity", fullName: "Collaboration, Communication & Productivity", category: "Horizontal Applications", color: "#3B82F6",
    tam: "$55B+ (2025)", growth: "~12-15% CAGR", icon: "💬",
    desc: "Tools for communication, document creation, project management, and team coordination. Became mission-critical post-COVID with hybrid work.",
    whatTheySell: "Messaging (chat/video), document editors, file storage, project management, whiteboarding, email, calendaring.",
    whoBuys: "Every knowledge worker. IT departments procure, but adoption is bottom-up. Sticky due to network effects.",
    keyPlayers: ["Microsoft 365 / Teams", "Google Workspace", "Slack (Salesforce)", "Zoom", "Atlassian (Jira/Confluence)", "Notion", "Asana", "Monday.com"],
    trends: "AI copilots embedded in every workflow. Microsoft Copilot vs Google Gemini. Consolidation of point tools into platforms. Microsoft dominant with ~45% share.",
  },
  bi: { name: "BI & Analytics", fullName: "Business Intelligence & Analytics", category: "Horizontal Applications", color: "#3B82F6",
    tam: "$35B+ (2025)", growth: "~11-13% CAGR", icon: "📊",
    desc: "Tools to visualize, analyze, and share data-driven insights. Bridges the gap between raw data and business decisions.",
    whatTheySell: "Dashboards, self-service analytics, data visualization, embedded analytics, reporting, natural language queries.",
    whoBuys: "Data analysts, business users, executives. Every department — finance, marketing, ops, product.",
    keyPlayers: ["Tableau (Salesforce)", "Power BI (Microsoft)", "Looker (Google)", "Qlik", "Domo", "ThoughtSpot", "Sisense"],
    trends: "AI/NLP-driven 'ask your data' interfaces. Embedded analytics in SaaS apps. Power BI gaining share rapidly (free with M365). Semantic layers gaining importance.",
  },
  scm: { name: "SCM", fullName: "Supply Chain Management", category: "Horizontal Applications", color: "#3B82F6",
    tam: "$20B+ (2025)", growth: "~11-13% CAGR", icon: "🚛",
    desc: "Software for planning, executing, and optimizing the flow of goods from raw materials to end customers.",
    whatTheySell: "Demand planning, inventory optimization, warehouse management (WMS), transportation management (TMS), procurement, order management.",
    whoBuys: "Supply chain leaders, COO, procurement teams. Manufacturing, retail, logistics-heavy industries.",
    keyPlayers: ["SAP SCM", "Oracle SCM Cloud", "Kinaxis", "Blue Yonder (Panasonic)", "Manhattan Associates", "Coupa", "E2open"],
    trends: "AI/ML for demand sensing. Supply chain digital twins. Post-COVID resilience focus driving investment. Real-time visibility platforms.",
  },
  mktg: { name: "Marketing & AdTech", fullName: "Marketing Technology & AdTech", category: "Horizontal Applications", color: "#3B82F6",
    tam: "$45B+ (2025)", growth: "~13-16% CAGR", icon: "📣",
    desc: "Tools for digital marketing, advertising, content management, and customer engagement across channels.",
    whatTheySell: "Marketing automation, email marketing, CMS, SEO tools, ad platforms, social media management, CDP (customer data platforms).",
    whoBuys: "CMO, marketing teams, growth teams, agencies. B2B and B2C companies.",
    keyPlayers: ["Adobe Experience Cloud", "Salesforce Marketing Cloud", "HubSpot", "Oracle Marketing", "The Trade Desk", "Braze", "Klaviyo"],
    trends: "AI-generated content and personalization. Cookie deprecation shifting to first-party data. CDP consolidation. Retail media networks growing fast.",
  },
  healthit: { name: "Healthcare IT", fullName: "Healthcare Information Technology", category: "Vertical Applications", color: "#8B5CF6",
    tam: "$55B+ (2025)", growth: "~12-15% CAGR", icon: "🏥",
    desc: "Software for hospitals, clinics, payers, and life sciences — EHR, clinical workflows, revenue cycle, telehealth, and drug development tools.",
    whatTheySell: "Electronic Health Records (EHR), practice management, revenue cycle management (RCM), clinical decision support, telehealth platforms, claims processing.",
    whoBuys: "Hospital systems, physician practices, health insurers, pharma/biotech. CIO, CMIO, CFO.",
    keyPlayers: ["Epic Systems", "Oracle Health (Cerner)", "Veeva Systems", "Athenahealth", "MEDITECH", "Teladoc", "GE HealthCare (digital)"],
    trends: "AI for clinical documentation (ambient listening). Interoperability mandates (FHIR). Epic dominates US hospitals (~38% of beds). Cloud migration of legacy EHR.",
  },
  fintech: { name: "Fintech / Financial Software", fullName: "Financial Technology & Banking Software", category: "Vertical Applications", color: "#8B5CF6",
    tam: "$65B+ (2025)", growth: "~10-12% CAGR", icon: "🏦",
    desc: "Software for banks, insurers, asset managers, and payments — core banking, payments processing, risk management, and compliance.",
    whatTheySell: "Core banking platforms, payment processing, fraud detection, compliance/RegTech, wealth management tools, insurance platforms, lending platforms.",
    whoBuys: "Banks, credit unions, insurance companies, asset managers, fintechs. CTO, CRO, compliance officers.",
    keyPlayers: ["FIS", "Fiserv", "Jack Henry", "Temenos", "Finastra", "Adyen", "Stripe", "Plaid", "nCino"],
    trends: "Real-time payments (FedNow). Embedded finance (BaaS). AI for fraud detection and underwriting. Open banking APIs. Legacy core modernization.",
  },
  legaltech: { name: "Legal Tech", fullName: "Legal Technology", category: "Vertical Applications", color: "#8B5CF6",
    tam: "$12B+ (2025)", growth: "~8-10% CAGR", icon: "⚖️",
    desc: "Software for law firms, corporate legal departments, and courts — contract management, e-discovery, legal research, practice management.",
    whatTheySell: "Legal research databases, contract lifecycle management (CLM), e-discovery, practice management, billing, document automation.",
    whoBuys: "Law firms (AmLaw 200), corporate legal departments (GC, CLO), government/courts.",
    keyPlayers: ["Thomson Reuters (Westlaw)", "LexisNexis (RELX)", "Ironclad", "DocuSign (CLM)", "Relativity", "Clio", "Harvey AI"],
    trends: "AI for contract review and legal research (Harvey, CoCounsel). Thomson Reuters & RELX duopoly in research. CLM fastest-growing subsegment.",
  },
  construction: { name: "Construction Tech", fullName: "Construction & Real Estate Technology", category: "Vertical Applications", color: "#8B5CF6",
    tam: "$15B+ (2025)", growth: "~12-14% CAGR", icon: "🏗️",
    desc: "Software for project management, BIM, estimating, safety, and asset management in construction and real estate.",
    whatTheySell: "Project management, Building Information Modeling (BIM), estimating/bidding, safety compliance, asset/facilities management, property management.",
    whoBuys: "General contractors, specialty contractors, owners/developers, architects, property managers.",
    keyPlayers: ["Procore", "Autodesk (BIM 360/ACC)", "Trimble", "Oracle Aconex", "CoStar", "Yardi"],
    trends: "AI for project risk prediction. Digital twins for buildings. Drone/IoT integration. Procore becoming the 'Salesforce of construction'. Low digitization = big TAM upside.",
  },
  edtech: { name: "EdTech", fullName: "Education Technology", category: "Vertical Applications", color: "#8B5CF6",
    tam: "$18B+ (2025)", growth: "~14-16% CAGR", icon: "🎓",
    desc: "Software for K-12 schools, universities, corporate training, and online learning platforms.",
    whatTheySell: "Learning Management Systems (LMS), student information systems (SIS), assessment tools, virtual classrooms, corporate training platforms.",
    whoBuys: "School districts, universities, corporate L&D teams, individual learners.",
    keyPlayers: ["PowerSchool", "Instructure (Canvas)", "Blackboard (Anthology)", "Coursera", "Docebo", "Cornerstone OnDemand"],
    trends: "AI tutoring and personalized learning. Micro-credentials and skills-based hiring. Corporate upskilling budgets growing. K-12 SIS consolidation.",
  },
  cloud: { name: "Cloud Platforms", fullName: "Cloud Infrastructure & Platform Services (IaaS/PaaS)", category: "Infrastructure Software", color: "#10B981",
    tam: "$250B+ (2025)", growth: "~20-22% CAGR", icon: "☁️",
    desc: "The foundational compute, storage, and networking services that power modern software. The 'operating system' of the internet.",
    whatTheySell: "Virtual machines, object storage, managed databases, serverless functions, container services, CDN, load balancing, managed Kubernetes.",
    whoBuys: "Every software company (as infrastructure). Enterprises migrating from on-prem. Startups (born in cloud). Government (FedRAMP).",
    keyPlayers: ["AWS (Amazon)", "Microsoft Azure", "Google Cloud (GCP)", "Oracle Cloud (OCI)", "IBM Cloud", "Alibaba Cloud"],
    trends: "AI workload migration driving GPU-as-a-service. Multi-cloud becoming default. Sovereign cloud for government. Edge computing. AWS ~31%, Azure ~25%, GCP ~11% share.",
  },
  database: { name: "Databases", fullName: "Database Management Systems", category: "Infrastructure Software", color: "#10B981",
    tam: "$100B+ (2025)", growth: "~14-16% CAGR", icon: "🗄️",
    desc: "Systems for storing, querying, and managing structured and unstructured data. Increasingly includes data warehouses and lakehouses.",
    whatTheySell: "Relational databases (OLTP), data warehouses (OLAP), NoSQL/document stores, graph databases, vector databases, time-series databases.",
    whoBuys: "Data engineers, application developers, data analysts. Every company that stores data.",
    keyPlayers: ["Oracle Database", "Snowflake", "Databricks", "MongoDB", "PostgreSQL (open source)", "Amazon (Redshift/Aurora/DynamoDB)", "Google BigQuery", "Pinecone (vector)"],
    trends: "Lakehouse architecture (Databricks vs Snowflake). Vector databases for AI/RAG. Serverless/consumption pricing. Open source vs commercial tension.",
  },
  devops: { name: "DevOps & CI/CD", fullName: "Developer Tools, DevOps & CI/CD", category: "Infrastructure Software", color: "#10B981",
    tam: "$25B+ (2025)", growth: "~18-20% CAGR", icon: "⚙️",
    desc: "Tools for building, testing, deploying, and managing software — from version control to infrastructure-as-code to continuous delivery.",
    whatTheySell: "Source control (Git), CI/CD pipelines, infrastructure-as-code (IaC), secrets management, configuration management, feature flags.",
    whoBuys: "Software developers, DevOps engineers, platform engineering teams, SREs.",
    keyPlayers: ["GitHub (Microsoft)", "GitLab", "HashiCorp (IBM)", "Jenkins (open source)", "CircleCI", "Terraform (HashiCorp)", "Pulumi"],
    trends: "AI code assistants (GitHub Copilot, Cursor). Platform engineering as discipline. GitOps workflows. Infrastructure-as-code becoming standard.",
  },
  observability: { name: "Observability", fullName: "Monitoring, Observability & APM", category: "Infrastructure Software", color: "#10B981",
    tam: "$22B+ (2025)", growth: "~14-16% CAGR", icon: "📡",
    desc: "Tools to monitor, debug, and understand the health and performance of applications and infrastructure.",
    whatTheySell: "Application performance monitoring (APM), log management, distributed tracing, infrastructure monitoring, real user monitoring, AIOps.",
    whoBuys: "SREs, DevOps teams, platform engineers, developers. Critical for any company running production workloads.",
    keyPlayers: ["Datadog", "Splunk (Cisco)", "Dynatrace", "New Relic", "Elastic", "Grafana Labs", "PagerDuty"],
    trends: "OpenTelemetry becoming standard. AI-powered root cause analysis. Consolidation of logs+metrics+traces. Datadog gaining share.",
  },
  containers: { name: "Containers & Orchestration", fullName: "Containers, Orchestration & Virtualization", category: "Infrastructure Software", color: "#10B981",
    tam: "$15B+ (2025)", growth: "~22-25% CAGR", icon: "📦",
    desc: "Technologies for packaging, deploying, and orchestrating containerized workloads. Kubernetes is the de facto standard.",
    whatTheySell: "Container runtimes, Kubernetes distributions, service mesh, container registries, serverless containers, hyperconverged infrastructure.",
    whoBuys: "Platform engineering teams, cloud architects, DevOps. Enterprises modernizing legacy applications.",
    keyPlayers: ["Kubernetes (CNCF/Google)", "Docker", "Red Hat OpenShift (IBM)", "VMware Tanzu (Broadcom)", "Rancher (SUSE)", "Nutanix"],
    trends: "Kubernetes everywhere (cloud, edge, on-prem). Service mesh simplification. WebAssembly (Wasm) as alternative. Platform engineering adoption.",
  },
  ipaas: { name: "iPaaS & Integration", fullName: "Integration Platform as a Service", category: "Middleware & Integration", color: "#0EA5E9",
    tam: "$12B+ (2025)", growth: "~20-25% CAGR", icon: "🔗",
    desc: "Platforms for connecting applications, data, and processes. The plumbing that makes the software stack work together.",
    whatTheySell: "Pre-built connectors, API-led connectivity, data transformation, workflow automation, event-driven integration, B2B/EDI integration.",
    whoBuys: "Integration architects, IT teams, ops teams. Any company with 5+ SaaS tools (most enterprises have 100+).",
    keyPlayers: ["MuleSoft (Salesforce)", "Boomi (TPG)", "Informatica", "Workato", "Celigo", "Tray.io", "Make (Integromat)"],
    trends: "AI-assisted mapping and transformation. Composable architecture driving API-first design. Low-code integration. Average enterprise uses 130+ SaaS apps.",
  },
  etl: { name: "ETL & Data Pipelines", fullName: "Extract, Transform, Load & Data Engineering", category: "Middleware & Integration", color: "#0EA5E9",
    tam: "$10B+ (2025)", growth: "~22-25% CAGR", icon: "🔀",
    desc: "Tools for moving and transforming data between systems — from operational databases to analytics warehouses and AI training sets.",
    whatTheySell: "Data ingestion connectors, ELT pipelines, data transformation (SQL-based), data quality, data cataloging, orchestration.",
    whoBuys: "Data engineers, analytics engineers, data platform teams. Any company doing analytics or AI.",
    keyPlayers: ["Fivetran", "dbt Labs", "Airbyte (open source)", "Matillion", "Stitch (Talend/Qlik)", "Apache Airflow", "Dagster", "Prefect"],
    trends: "ELT replacing ETL (transform in warehouse). dbt as standard transformation layer. Real-time/streaming pipelines. Data mesh. AI-generated data pipelines.",
  },
  api: { name: "API Management", fullName: "API Management & Gateway", category: "Middleware & Integration", color: "#0EA5E9",
    tam: "$8B+ (2025)", growth: "~18-22% CAGR", icon: "🌐",
    desc: "Platforms for designing, publishing, securing, and monitoring APIs. Critical as every company becomes an 'API company'.",
    whatTheySell: "API gateways, developer portals, rate limiting, authentication, API analytics, API design tools, GraphQL management.",
    whoBuys: "API platform teams, developers, architects. Companies exposing APIs to partners or monetizing data.",
    keyPlayers: ["Apigee (Google)", "Kong", "MuleSoft (Salesforce)", "AWS API Gateway", "Azure API Management", "Postman", "Rapid API"],
    trends: "API-first design becoming standard. GraphQL adoption. AI-generated APIs. API security as critical concern. API monetization models.",
  },
  endpoint: { name: "Endpoint Security", fullName: "Endpoint Detection & Response (EDR/XDR)", category: "Security Software", color: "#EF4444",
    tam: "$18B+ (2025)", growth: "~12-15% CAGR", icon: "🛡️",
    desc: "Software protecting laptops, servers, and mobile devices from malware, ransomware, and advanced threats.",
    whatTheySell: "Antivirus/anti-malware, endpoint detection and response (EDR), extended detection and response (XDR), threat hunting, device management.",
    whoBuys: "CISO, security operations teams (SOC), IT admins. Every organization with endpoints.",
    keyPlayers: ["CrowdStrike", "Microsoft Defender", "SentinelOne", "Palo Alto (Cortex XDR)", "Trellix", "Sophos", "Carbon Black (Broadcom)"],
    trends: "XDR consolidating multiple security tools. AI-driven threat detection. CrowdStrike dominant in enterprise EDR. Identity + endpoint convergence.",
  },
  network: { name: "Network Security", fullName: "Network Security & SASE/ZTNA", category: "Security Software", color: "#EF4444",
    tam: "$25B+ (2025)", growth: "~14-16% CAGR", icon: "🔒",
    desc: "Firewalls, secure web gateways, ZTNA, and SASE platforms protecting network traffic and enabling secure remote access.",
    whatTheySell: "Next-gen firewalls, SASE (Secure Access Service Edge), ZTNA (Zero Trust Network Access), SD-WAN, secure web gateways, DDoS protection.",
    whoBuys: "Network security teams, CISO, IT infrastructure teams. Enterprises with distributed workforces.",
    keyPlayers: ["Palo Alto Networks", "Fortinet", "Zscaler", "Cloudflare", "Cisco (Meraki)", "Netskope", "Check Point"],
    trends: "SASE consolidating networking + security. Zero Trust architecture standard. Cloud-delivered security. Palo Alto + Fortinet + Zscaler leading.",
  },
  iam: { name: "Identity & Access (IAM)", fullName: "Identity & Access Management", category: "Security Software", color: "#EF4444",
    tam: "$20B+ (2025)", growth: "~13-15% CAGR", icon: "🔑",
    desc: "Software managing who can access what — authentication, authorization, privileged access, and governance. 'Identity is the new perimeter.'",
    whatTheySell: "Single sign-on (SSO), multi-factor authentication (MFA), privileged access management (PAM), identity governance, CIEM (cloud identity).",
    whoBuys: "CISO, IAM teams, IT admins, compliance officers. Every organization managing user access.",
    keyPlayers: ["Okta", "Microsoft Entra ID", "CyberArk", "SailPoint", "Ping Identity", "OneSpan", "Auth0 (Okta)"],
    trends: "Passwordless authentication (passkeys/FIDO2). Machine identity management. CIEM for multi-cloud. Identity-first security. Okta dominant in workforce IAM.",
  },
  mlplatform: { name: "ML Platforms", fullName: "Machine Learning Platforms & MLOps", category: "AI / ML Software", color: "#F59E0B",
    tam: "$30B+ (2025)", growth: "~25-30% CAGR", icon: "🧠",
    desc: "Platforms for building, training, deploying, and managing ML models at scale — from experiment tracking to model serving.",
    whatTheySell: "Model training infrastructure, experiment tracking, feature stores, model registries, model serving, A/B testing, ML pipeline orchestration.",
    whoBuys: "ML engineers, data scientists, AI platform teams. Tech companies, large enterprises building custom AI.",
    keyPlayers: ["Databricks (MLflow)", "AWS SageMaker", "Google Vertex AI", "Azure ML", "Weights & Biases", "Hugging Face", "Anyscale (Ray)"],
    trends: "LLM fine-tuning and RAG infrastructure. GPU orchestration for training. Model evaluation frameworks. Open-source model hosting. Foundation model customization.",
  },
  aiapps: { name: "AI Applications", fullName: "AI-Native Applications & Copilots", category: "AI / ML Software", color: "#F59E0B",
    tam: "$25B+ (2025)", growth: "~40-50% CAGR", icon: "🤖",
    desc: "New category of software built AI-first — AI assistants, copilots, and agents that augment or automate knowledge work.",
    whatTheySell: "AI writing assistants, code copilots, AI search, AI agents, meeting summarizers, AI customer service bots, AI data analysts.",
    whoBuys: "Knowledge workers, developers, customer support teams, sales teams. Horizontal demand across all roles.",
    keyPlayers: ["GitHub Copilot (Microsoft)", "Cursor", "Glean", "Perplexity", "Jasper", "Writer", "Harvey AI", "Claude (Anthropic)"],
    trends: "Fastest-growing software category ever. Agentic AI (multi-step autonomous workflows). AI coding tools approaching 50% dev adoption. Enterprise AI search consolidating.",
  },
};

const TAXONOMY = [
  { key: "horizontal", label: "Horizontal Applications", color: "#3B82F6", icon: "📱", children: ["crm","erp","hcm","collab","bi","scm","mktg"] },
  { key: "vertical", label: "Vertical Applications", color: "#8B5CF6", icon: "🏗️", children: ["healthit","fintech","legaltech","construction","edtech"] },
  { key: "infra", label: "Infrastructure Software", color: "#10B981", icon: "🖥️", children: ["cloud","database","devops","observability","containers"] },
  { key: "middleware", label: "Middleware & Integration", color: "#0EA5E9", icon: "🔗", children: ["ipaas","etl","api"] },
  { key: "security", label: "Security Software", color: "#EF4444", icon: "🛡️", children: ["endpoint","network","iam"] },
  { key: "aiml", label: "AI / ML Software", color: "#F59E0B", icon: "🧠", children: ["mlplatform","aiapps"] },
];

const VALUE_CHAIN = [
  { label: "Cloud & Hardware", color: "#64748B", icon: "🖥️", desc: "Physical infrastructure",
    rows: [{ sub: "Compute", ex: "AWS, Azure, GCP, OCI" }, { sub: "GPUs", ex: "NVIDIA, AMD, Google TPU" }, { sub: "Networking", ex: "Arista, Cisco, Juniper" }, { sub: "Storage", ex: "NetApp, Pure Storage, Dell" }],
    buyers: "Software companies, enterprises, governments" },
  { label: "Infrastructure SW", color: "#10B981", icon: "⚙️", desc: "Run & manage workloads",
    rows: [{ sub: "Databases", ex: "Oracle, Snowflake, MongoDB" }, { sub: "DevOps", ex: "GitHub, GitLab, HashiCorp" }, { sub: "Containers", ex: "Kubernetes, Docker, Red Hat" }, { sub: "Observability", ex: "Datadog, Splunk, Dynatrace" }],
    buyers: "Platform engineers, DevOps, SREs" },
  { label: "Middleware", color: "#0EA5E9", icon: "🔗", desc: "Connect apps to infra",
    rows: [{ sub: "iPaaS", ex: "MuleSoft, Boomi, Workato" }, { sub: "ETL/Pipelines", ex: "Fivetran, dbt, Airflow" }, { sub: "API Mgmt", ex: "Apigee, Kong, Postman" }, { sub: "Messaging", ex: "Kafka, RabbitMQ, Pulsar" }],
    buyers: "Integration architects, data engineers" },
  { label: "Application SW", color: "#3B82F6", icon: "📱", desc: "Business logic & workflows",
    rows: [{ sub: "CRM / Marketing", ex: "Salesforce, HubSpot, Adobe" }, { sub: "ERP / SCM", ex: "SAP, Oracle, Kinaxis" }, { sub: "HCM / Collab", ex: "Workday, Microsoft 365, Slack" }, { sub: "BI / Analytics", ex: "Tableau, Power BI, Looker" }],
    buyers: "Sales, finance, HR, marketing, ops teams" },
  { label: "Vertical Apps", color: "#8B5CF6", icon: "🏗️", desc: "Industry-specific software",
    rows: [{ sub: "Healthcare", ex: "Epic, Veeva, Oracle Health" }, { sub: "Fintech", ex: "FIS, Fiserv, Stripe, Plaid" }, { sub: "Legal", ex: "Thomson Reuters, LexisNexis" }, { sub: "Construction", ex: "Procore, Autodesk, Trimble" }],
    buyers: "Hospitals, banks, law firms, contractors" },
  { label: "End Users", color: "#6366F1", icon: "👥", desc: "Buyers & consumers",
    rows: [{ sub: "Enterprise", ex: "Fortune 500, Global 2000" }, { sub: "Mid-Market", ex: "1K-10K employees" }, { sub: "SMB", ex: "< 1K employees" }, { sub: "Consumer", ex: "Individuals, prosumers" }],
    buyers: "CIO, CFO, LOB leaders, individuals" },
];

const KEY_CONCEPTS = [
  { title: "Horizontal vs Vertical", desc: "Horizontal software serves all industries (CRM, ERP). Vertical software is built for one industry (healthcare, fintech). Horizontal has larger TAM but more competition; vertical has deeper moats and higher retention." },
  { title: "Platform vs Point Solution", desc: "Platforms (Salesforce, Microsoft) sell a broad suite and expand via ecosystem. Point solutions (Datadog, CrowdStrike) do one thing exceptionally well. Winner depends on whether buyer wants best-of-breed or consolidation." },
  { title: "On-Prem → Cloud → AI", desc: "Software is undergoing its third major architectural shift. On-prem (1990s-2000s) → Cloud/SaaS (2010s-2020s) → AI-native (2020s-2030s). Each transition creates new winners. Cloud migration is ~40% complete for enterprises." },
  { title: "Gross Margin as Moat Indicator", desc: "Software gross margins of 70-85% indicate strong pricing power. Infrastructure SW (cloud, databases) runs 60-75%. Services-heavy models run lower. Margin compression signals commoditization." },
  { title: "Net Dollar Retention (NDR)", desc: "The % of revenue retained from existing customers after expansion and churn. >120% = customers spend more each year (land and expand). <100% = net churn. Best SaaS: CrowdStrike ~120%, Snowflake ~127%, Datadog ~115%." },
  { title: "Rule of 40", desc: "Revenue growth % + free cash flow margin % should exceed 40% for a healthy SaaS company. A company growing 30% with 15% FCF margin scores 45 — excellent. Helps compare high-growth vs mature companies on the same scale." },
];

export default function Primer() {
  const [subTab, setSubTab] = useState("software");
  const [expanded, setExpanded] = useState({});
  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const isExp = (key) => !!expanded[key];

  return (
    <div style={{ flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: 1400, fontFamily: FONT }}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${T_.borderLight}` }}>
        {[{ key: "software", label: "Software" }, { key: "digiinfra", label: "Digital Infrastructure" }, { key: "itservices", label: "IT Services" }, { key: "healthit", label: "Healthcare IT" }, { key: "internet", label: "Internet" }].map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)} style={{
            padding: "10px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer",
            border: "none", borderBottom: subTab === t.key ? `2px solid ${T_.accent}` : "2px solid transparent",
            background: "transparent", color: subTab === t.key ? T_.text : T_.textGhost,
            fontFamily: FONT, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {subTab === "software" && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Software Industry Primer</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Ecosystem, subsectors, key players, and value chain</div>
          </div>

          {/* ─── VALUE CHAIN ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Software Ecosystem — Stack & Value Chain</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Value flows left to right. Each layer builds on the one below it. Security spans all layers.</div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {VALUE_CHAIN.map((stage, i, arr) => (
                <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                      <span style={{ fontSize: 14 }}>{stage.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                      {stage.rows.map(r => (
                        <div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div>
                          <div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}>
                      <span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>→</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "#EF444412", border: "1px dashed #EF444444", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🛡️</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444" }}>Security — Spans All Layers</span>
              </div>
              <div style={{ fontSize: 11, color: T_.textDim }}>Endpoint (CrowdStrike) · Network/SASE (Palo Alto, Zscaler) · Identity (Okta, CyberArk) · Cloud Security · SIEM (Splunk)</div>
            </div>
            <div style={{ marginTop: 4, background: "#F59E0B12", border: "1px dashed #F59E0B44", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🧠</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>AI / ML — Transforming Every Layer</span>
              </div>
              <div style={{ fontSize: 11, color: T_.textDim }}>ML Platforms (Databricks, SageMaker) · Copilots (GitHub Copilot, Cursor) · AI Apps (Glean, Perplexity, Harvey) · Foundation Models</div>
            </div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Each stage sells to the stage on its right. Cloud sells to infrastructure SW vendors, who sell to middleware providers, who enable application SW, which serves vertical apps and end users.</div>
          </div>

          {/* ─── TAXONOMY TREE ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Software Taxonomy</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TAXONOMY.map(cat => (
                <div key={cat.key}>
                  <div onClick={() => toggle("tax_" + cat.key)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                    background: isExp("tax_" + cat.key) ? cat.color + "22" : T_.bg,
                    borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("tax_" + cat.key) ? cat.color + "44" : T_.border}`,
                    transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsectors</span>
                    <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("tax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </div>
                  {isExp("tax_" + cat.key) && (
                    <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                      {cat.children.map(childKey => {
                        const sub = SW_SUBSECTORS[childKey];
                        if (!sub) return null;
                        return (
                          <div key={childKey} onClick={() => toggle("sub_" + childKey)} style={{
                            padding: "10px 16px", background: isExp("sub_" + childKey) ? T_.bgInput : T_.bg,
                            borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 16 }}>{sub.icon}</span>
                              <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                              <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                              <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                              <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("sub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                            </div>
                            {isExp("sub_" + childKey) && (
                              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                                <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 12, lineHeight: 1.6 }}>{sub.desc}</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
                                  <div>
                                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>What They Sell</div>
                                    <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{sub.whatTheySell}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Who Buys</div>
                                    <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{sub.whoBuys}</div>
                                  </div>
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Key Players</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {sub.keyPlayers.map(p => (
                                      <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Key Trends</div>
                                  <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{sub.trends}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── SUBSECTOR CARDS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Addressable market estimates and growth rates across software subsectors. TAM figures are approximate 2025 estimates.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {Object.entries(SW_SUBSECTORS).map(([key, sub]) => (
                <div key={key} style={{
                  padding: "14px 16px", background: T_.bg, borderRadius: 8,
                  border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer",
                }} onClick={() => {
                  const cat = TAXONOMY.find(t => t.children.includes(key));
                  if (cat) setExpanded(prev => ({ ...prev, ["tax_" + cat.key]: true, ["sub_" + key]: true }));
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{sub.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T_.text }}>{sub.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 8 }}>{sub.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <div style={{ fontSize: 10, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginTop: 8, lineHeight: 1.5 }}>{sub.keyPlayers.slice(0, 4).join(" · ")}{sub.keyPlayers.length > 4 ? " +" + (sub.keyPlayers.length - 4) + " more" : ""}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── KEY CONCEPTS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {KEY_CONCEPTS.map((c, i) => (
                <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>
            Sources: Gartner IT Spending Forecasts (2025), IDC Worldwide Software Tracker, Synergy Research Group, company 10-Ks, industry reports. TAM and growth rates are approximate 2025 estimates.
          </div>
        </div>
      )}

      {/* ═══════ DIGITAL INFRASTRUCTURE ═══════ */}
      {subTab === "digiinfra" && (() => {
        const DI_SUBS = {
          hyperscale: { name: "Hyperscale Cloud", fullName: "Hyperscale Cloud Data Centers", category: "Cloud Infrastructure", color: "#3B82F6",
            tam: "$250B+ (2025)", growth: "~20-22% CAGR", icon: "☁️",
            desc: "The foundational compute, storage, and networking operated by the Big 3 cloud providers (AWS, Azure, GCP) plus Oracle, IBM, and Alibaba. These companies build and operate massive data center campuses globally.",
            whatTheySell: "IaaS (VMs, storage, networking), PaaS (managed databases, serverless, Kubernetes), GPU-as-a-service for AI workloads, edge computing, sovereign cloud",
            whoBuys: "Every enterprise, every SaaS company, startups, government. CIO, CTO, platform engineering teams",
            keyPlayers: ["AWS (Amazon)", "Microsoft Azure", "Google Cloud (GCP)", "Oracle Cloud (OCI)", "IBM Cloud", "Alibaba Cloud"],
            trends: "AI workloads driving GPU capacity demand. $600-700B hyperscaler capex in 2026. Multi-cloud as default. Sovereign/government cloud. AWS ~31%, Azure ~25%, GCP ~11%",
          },
          neocloud: { name: "Neoclouds / GPU Cloud", fullName: "Specialized AI Cloud Infrastructure", category: "Cloud Infrastructure", color: "#3B82F6",
            tam: "$15-25B (2025)", growth: "~40-60% CAGR", icon: "⚡",
            desc: "Specialized GPU cloud providers purpose-built for AI training and inference. Fill the capacity gap that hyperscalers cannot build fast enough.",
            whatTheySell: "Reserved GPU clusters (H100, GB200), bare metal GPU servers, Kubernetes orchestration for AI, managed ML infrastructure",
            whoBuys: "AI frontier labs (OpenAI, Anthropic, Meta), enterprises training custom models, AI startups. CTO, ML infrastructure teams",
            keyPlayers: ["CoreWeave", "Lambda", "Together AI", "Nebius", "Voltage Park", "Crusoe Energy"],
            trends: "Explosive growth from AI training demand. NVIDIA partnership depth determines competitive position. $14B+ debt at CoreWeave signals capital intensity. Hyperscaler in-sourcing is the long-term risk",
          },
          dcbuilders: { name: "Data Center Builders", fullName: "AI Data Center Design, Build & Lease", category: "Data Center Real Estate", color: "#10B981",
            tam: "$147-236B (2025)", growth: "~24-32% CAGR", icon: "🏗️",
            desc: "Companies that design, build, and lease purpose-built data centers for AI/HPC workloads. The 'shell and power' providers — they supply the physical facility, power, and cooling.",
            whatTheySell: "Long-term data center leases (10-25 years), turnkey facility construction, liquid cooling infrastructure, power procurement and delivery",
            whoBuys: "Hyperscalers (AWS, Microsoft, Google), neoclouds (CoreWeave, Fluidstack), AI labs. Infrastructure procurement teams",
            keyPlayers: ["Applied Digital (APLD)", "TeraWulf (WULF)", "Cipher Digital (CIFR)", "IREN", "Core Scientific"],
            trends: "Crypto-to-AI pivot across the sector. Power is the binding constraint. 12-14 month build timelines. $16B+ contracted backlogs. Google/AWS credit backstops improving lease quality",
          },
          colocation: { name: "Colocation / Data Center REITs", fullName: "Enterprise Colocation & Data Center REITs", category: "Data Center Real Estate", color: "#10B981",
            tam: "$60-80B (2025)", growth: "~10-14% CAGR", icon: "🏢",
            desc: "Traditional data center operators providing rack space, power, and connectivity for enterprise IT workloads. Increasingly retrofitting for AI density.",
            whatTheySell: "Rack space, power (per kW), cross-connects, managed hosting, hybrid cloud connectivity",
            whoBuys: "Enterprise IT, financial services (low-latency), SaaS companies, telecom operators. CIO, infrastructure teams",
            keyPlayers: ["Equinix", "Digital Realty", "QTS (Blackstone)", "CyrusOne", "Vantage", "DataBank"],
            trends: "AI density requirements (100+ kW/rack) challenging legacy facilities. Equinix pivoting to AI/distributed inference. Power scarcity limiting new builds in key markets",
          },
          power: { name: "Power & Energy", fullName: "Data Center Power Infrastructure", category: "Power & Cooling", color: "#F59E0B",
            tam: "$20-30B (2025)", growth: "~15-20% CAGR", icon: "⚡",
            desc: "Power generation, transmission, and management infrastructure for data centers. Data centers consumed 4.4% of US electricity in 2023 — expected to triple by 2028.",
            whatTheySell: "Power generation (natural gas, nuclear, renewables), power purchase agreements (PPAs), backup generators, UPS systems, power distribution",
            whoBuys: "Data center operators, hyperscalers, utilities. Facilities teams, energy procurement",
            keyPlayers: ["Constellation Energy", "Vistra", "NextEra", "Babcock & Wilcox", "Bloom Energy", "Eaton", "Vertiv"],
            trends: "Nuclear power resurgence (Three Mile Island restart for Microsoft). Natural gas buildout for base load. Grid constraints are the #1 bottleneck. Renewable PPAs for ESG compliance",
          },
          cooling: { name: "Cooling & Thermal", fullName: "Data Center Cooling Solutions", category: "Power & Cooling", color: "#F59E0B",
            tam: "$10-15B (2025)", growth: "~20-25% CAGR", icon: "❄️",
            desc: "Cooling systems for data centers — increasingly critical as AI chips generate extreme heat density that traditional air cooling cannot handle.",
            whatTheySell: "Direct-to-chip liquid cooling, immersion cooling, rear-door heat exchangers, CRAH/CRAC units, cooling distribution units (CDUs)",
            whoBuys: "Data center operators, hyperscalers, colocation providers. Facilities engineering teams",
            keyPlayers: ["Vertiv", "Schneider Electric", "CoolIT Systems", "GRC (Green Revolution Cooling)", "Corintis", "Asetek"],
            trends: "Liquid cooling mandatory for GB200/B300 GPU racks (100+ kW). Air cooling hitting physical limits. Direct-to-chip becoming standard for AI clusters. Waterless cooling for water-scarce sites",
          },
          networking: { name: "Data Center Networking", fullName: "Data Center Networking & Interconnect", category: "Networking", color: "#0EA5E9",
            tam: "$15-20B (2025)", growth: "~15-20% CAGR", icon: "🌐",
            desc: "Switches, routers, and optical interconnects that connect servers within and between data centers. AI training requires massive east-west bandwidth.",
            whatTheySell: "Top-of-rack switches, spine switches, optical transceivers (800G/1.6T), InfiniBand/Ethernet fabrics, DCI (data center interconnect)",
            whoBuys: "Hyperscalers, data center operators, enterprise IT. Network architects",
            keyPlayers: ["Arista Networks", "Cisco", "Broadcom", "NVIDIA (InfiniBand)", "Coherent (transceivers)", "Ciena"],
            trends: "800G transceiver deployment accelerating. 1.6T on the horizon. InfiniBand vs Ethernet debate for AI clusters. Arista dominant in cloud switching",
          },
          gpuchips: { name: "AI Chips & Accelerators", fullName: "GPUs, ASICs & AI Accelerators", category: "Silicon", color: "#EF4444",
            tam: "$80-100B (2025)", growth: "~30-40% CAGR", icon: "🧠",
            desc: "The processors that power AI training and inference. NVIDIA dominates with 80%+ market share in AI accelerators.",
            whatTheySell: "GPUs (H100, B200, GB200), custom ASICs (Google TPU, Amazon Trainium), AI inference chips, networking chips (ConnectX)",
            whoBuys: "Hyperscalers, AI labs, neoclouds, enterprises. ML infrastructure teams",
            keyPlayers: ["NVIDIA", "AMD (MI300)", "Google (TPU)", "Amazon (Trainium/Inferentia)", "Broadcom (custom ASICs)", "Intel (Gaudi)", "Cerebras"],
            trends: "NVIDIA GB200/B300 NVL72 racks defining the market. Custom silicon (Google TPU, Amazon Trainium) as hyperscaler alternative. Inference chips growing faster than training. NVIDIA pricing power persists",
          },
        };
        const DI_TAX = [
          { key: "cloud", label: "Cloud Infrastructure", color: "#3B82F6", icon: "☁️", children: ["hyperscale","neocloud"] },
          { key: "dcre", label: "Data Center Real Estate", color: "#10B981", icon: "🏗️", children: ["dcbuilders","colocation"] },
          { key: "power", label: "Power & Cooling", color: "#F59E0B", icon: "⚡", children: ["power","cooling"] },
          { key: "connect", label: "Networking & Silicon", color: "#0EA5E9", icon: "🌐", children: ["networking","gpuchips"] },
        ];
        const DI_CHAIN = [
          { label: "Silicon", color: "#EF4444", icon: "🧠", desc: "AI chips & accelerators",
            rows: [{ sub: "GPUs", ex: "NVIDIA, AMD" }, { sub: "Custom ASICs", ex: "Google TPU, AWS Trainium" }, { sub: "Networking", ex: "Broadcom, Marvell" }],
            buyers: "Hyperscalers, neoclouds, AI labs" },
          { label: "Power & Cooling", color: "#F59E0B", icon: "⚡", desc: "Energy infrastructure",
            rows: [{ sub: "Generation", ex: "Constellation, Vistra" }, { sub: "Distribution", ex: "Eaton, Vertiv" }, { sub: "Cooling", ex: "Vertiv, CoolIT, GRC" }],
            buyers: "Data center operators" },
          { label: "DC Builders", color: "#10B981", icon: "🏗️", desc: "Build & lease facilities",
            rows: [{ sub: "AI Factories", ex: "APLD, TeraWulf, Cipher" }, { sub: "Colocation", ex: "Equinix, Digital Realty" }, { sub: "Neoclouds", ex: "CoreWeave, Lambda" }],
            buyers: "Hyperscalers, AI companies" },
          { label: "Cloud Platforms", color: "#3B82F6", icon: "☁️", desc: "Compute as a service",
            rows: [{ sub: "Hyperscale", ex: "AWS, Azure, GCP" }, { sub: "GPU Cloud", ex: "CoreWeave, Lambda" }, { sub: "Managed", ex: "Rackspace, Ensono" }],
            buyers: "Enterprises, SaaS, AI startups" },
          { label: "End Users", color: "#6366F1", icon: "👥", desc: "Consume compute",
            rows: [{ sub: "AI Labs", ex: "OpenAI, Anthropic, Meta" }, { sub: "Enterprise", ex: "Fortune 500" }, { sub: "SaaS/Startups", ex: "Software companies" }],
            buyers: "Every industry" },
        ];
        return (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Digital Infrastructure Primer</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>AI data centers, cloud infrastructure, power, cooling, and silicon</div>
          </div>
          {/* Value Chain */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Digital Infrastructure — Value Chain</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Silicon powers the chips → power & cooling run the facilities → builders construct and lease → cloud platforms deliver compute → end users consume</div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {DI_CHAIN.map((stage, i, arr) => (
                <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <span style={{ fontSize: 12 }}>{stage.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span>
                    </div>
                    <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 8 }}>{stage.desc}</div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                      {stage.rows.map(r => (
                        <div key={r.sub} style={{ background: T_.bg, borderRadius: 4, padding: "4px 6px" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div>
                          <div style={{ fontSize: 12, color: T_.textDim, lineHeight: 1.3 }}>{r.ex}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 6, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 4 }}>
                      <span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 3px", color: T_.textGhost, fontSize: 14, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: T_.textGhost, marginTop: 10, fontStyle: "italic" }}>$7T in total data center investment expected through 2030 (McKinsey). Global data center capacity expected to double from ~100GW to ~200GW by 2030. Power is the binding constraint.</div>
          </div>
          {/* Taxonomy */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Digital Infrastructure Taxonomy</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand subsectors</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {DI_TAX.map(cat => (
                <div key={cat.key}>
                  <div onClick={() => toggle("dtax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("dtax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("dtax_" + cat.key) ? cat.color + "44" : T_.border}`, transition: "all 0.15s" }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsectors</span>
                    <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("dtax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </div>
                  {isExp("dtax_" + cat.key) && (
                    <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                      {cat.children.map(ck => { const sub = DI_SUBS[ck]; if (!sub) return null; return (
                        <div key={ck} onClick={() => toggle("dsub_" + ck)} style={{ padding: "10px 16px", background: isExp("dsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("dsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("dsub_" + ck) && (
                            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                              <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
                                <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div>
                                <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div>
                              </div>
                              <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                            </div>
                          )}
                        </div>
                      ); })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Cards */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Subsector Overview — TAM & Growth</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Market size estimates for digital infrastructure subsectors</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {Object.entries(DI_SUBS).map(([key, sub]) => (
                <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }}
                  onClick={() => { const cat = DI_TAX.find(t => t.children.includes(key)); if (cat) setExpanded(prev => ({ ...prev, ["dtax_" + cat.key]: true, ["dsub_" + key]: true })); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div>
                  </div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginTop: 6, lineHeight: 1.4 }}>{sub.keyPlayers.slice(0, 4).join(" · ")}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>Sources: McKinsey Global Institute, Synergy Research, IDC, Data Center Dynamics, company filings. TAM and growth rates are approximate 2025 estimates.</div>
        </div>);
      })()}

      {/* ═══════ IT SERVICES ═══════ */}
      {subTab === "itservices" && (() => {
        const IT_SUBS = {
          consulting: { name: "IT Consulting", fullName: "IT Strategy & Digital Transformation Consulting", category: "Consulting", color: "#3B82F6",
            tam: "$500B+ (2025)", growth: "~7-10% CAGR", icon: "💼",
            desc: "Advisory and implementation services for digital transformation, cloud migration, application modernization, and technology strategy.",
            whatTheySell: "Strategy consulting, system integration, custom software development, change management, cloud migration, data/AI consulting",
            whoBuys: "CIO, CTO, CDO at large enterprises. Every industry undergoing digital transformation",
            keyPlayers: ["Accenture", "Deloitte", "IBM Consulting", "Wipro", "TCS", "Infosys", "Cognizant", "EPAM", "Perficient", "Thoughtworks"],
            trends: "AI implementation services fastest-growing segment. Offshore/nearshore delivery models. Platform-specific consulting (Salesforce, SAP, AWS). GCC (captive center) trend",
          },
          var: { name: "VARs / IT Solutions", fullName: "Value-Added Resellers & IT Solutions Providers", category: "Solutions", color: "#10B981",
            tam: "$200-250B (2025)", growth: "~5-7% CAGR", icon: "🔧",
            desc: "Companies that design, sell, deploy, and manage multi-vendor IT infrastructure solutions. The integrators between technology vendors and enterprise buyers.",
            whatTheySell: "Hardware/software resale, solution architecture, deployment services, managed services, cloud migration, security solutions",
            whoBuys: "Mid-market to large enterprise IT departments. CIO, IT directors needing multi-vendor integration",
            keyPlayers: ["CDW", "SHI", "World Wide Technology", "Insight Enterprises", "Presidio", "Trace3", "Ahead DB", "Optiv"],
            trends: "Shift from hardware resale (low margin) to managed services (recurring, higher margin). PE loves this space for the margin expansion story. Cloud and security driving services growth",
          },
          managed: { name: "Managed Services", fullName: "Managed IT Services & Outsourcing", category: "Managed Services", color: "#8B5CF6",
            tam: "$300B+ (2025)", growth: "~10-14% CAGR", icon: "🖥️",
            desc: "Ongoing IT operations management — enterprises outsource infrastructure, cloud, and application management to specialized providers.",
            whatTheySell: "Infrastructure management, cloud operations (CloudOps), help desk, NOC/SOC, application support, mainframe management",
            whoBuys: "Enterprise CIO/IT ops. Organizations that can't or won't staff full IT operations teams internally",
            keyPlayers: ["Kyndryl (IBM spinoff)", "DXC Technology", "Ensono", "Rackspace", "Unisys", "HCLTech"],
            trends: "Hybrid IT management (mainframe + cloud). AIOps reducing manual operations. MSPs serving SMB market growing faster than enterprise outsourcing",
          },
          msp: { name: "MSP Software", fullName: "Software for Managed Service Providers", category: "MSP Ecosystem", color: "#F59E0B",
            tam: "$5-8B (2025)", growth: "~12-15% CAGR", icon: "🛠️",
            desc: "Software platforms that MSPs use to manage multiple client environments — RMM, PSA, backup, and security tools purpose-built for the MSP business model.",
            whatTheySell: "Remote monitoring & management (RMM), professional services automation (PSA), backup/DR, security tools, IT documentation, billing",
            whoBuys: "MSPs (managed service providers) ranging from 1-person shops to large national providers",
            keyPlayers: ["ConnectWise", "Kaseya/Datto", "N-able", "NinjaRMM", "Syncro", "HaloPSA"],
            trends: "ConnectWise vs Kaseya rivalry defines the market. MSP cybersecurity is the growth driver. IT Glue (Kaseya) dominates documentation. Aggressive PE-driven M&A",
          },
          distribution: { name: "IT Distribution", fullName: "Technology Product Distribution", category: "Distribution", color: "#0EA5E9",
            tam: "$300B+ (2025)", growth: "~3-5% CAGR", icon: "📦",
            desc: "Wholesale distribution of technology hardware, software, and cloud services from vendors to resellers, MSPs, and retailers. High volume, low margin.",
            whatTheySell: "Hardware distribution (servers, PCs, networking), software licensing, cloud marketplace provisioning, logistics, financing",
            whoBuys: "Resellers, MSPs, retailers — the channel. Also cloud vendors seeking distribution reach",
            keyPlayers: ["TD SYNNEX", "Ingram Micro", "Arrow Electronics", "Westcon-Comstor", "ScanSource"],
            trends: "Cloud marketplace distribution growing faster than hardware. Vendor-direct threatening intermediary role. Consolidation (TD + SYNNEX merger). Low margin requires massive scale",
          },
        };
        const IT_TAX = [
          { key: "consult", label: "Consulting & Implementation", color: "#3B82F6", icon: "💼", children: ["consulting"] },
          { key: "solutions", label: "Solutions & Integration", color: "#10B981", icon: "🔧", children: ["var"] },
          { key: "mgd", label: "Managed Services & Outsourcing", color: "#8B5CF6", icon: "🖥️", children: ["managed","msp"] },
          { key: "dist", label: "Distribution", color: "#0EA5E9", icon: "📦", children: ["distribution"] },
        ];
        return (
        <div>
          <div style={{ marginBottom: 24 }}><div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>IT Services Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Consulting, VARs, managed services, MSP ecosystem, and distribution</div></div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 4 }}>IT Services Taxonomy</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {IT_TAX.map(cat => (
                <div key={cat.key}>
                  <div onClick={() => toggle("itax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("itax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("itax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsectors</span>
                    <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("itax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
                  </div>
                  {isExp("itax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = IT_SUBS[ck]; if (!sub) return null; return (
                    <div key={ck} onClick={() => toggle("isub_" + ck)} style={{ padding: "10px 16px", background: isExp("isub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("isub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span></div>
                      {isExp("isub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                        <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                        <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                      </div>}
                    </div>); })}</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {Object.entries(IT_SUBS).map(([key, sub]) => (
                <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = IT_TAX.find(t => t.children.includes(key)); if (cat) setExpanded(prev => ({ ...prev, ["itax_" + cat.key]: true, ["isub_" + key]: true })); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>);
      })()}

      {/* ═══════ HEALTHCARE IT ═══════ */}
      {subTab === "healthit" && (() => {
        const HI_SUBS = {
          ehr: { name: "EHR / EMR", fullName: "Electronic Health Records", category: "Clinical Systems", color: "#3B82F6",
            tam: "$35B+ (2025)", growth: "~5-8% CAGR", icon: "🏥",
            desc: "The clinical system of record for hospitals and physician practices — patient charting, orders, medications, results. Mission-critical and deeply embedded.",
            whatTheySell: "Inpatient EHR, ambulatory EHR, clinical documentation, CPOE, medication management, patient portals",
            whoBuys: "Hospital CIO/CMIO, physician practice administrators. Health systems, academic medical centers",
            keyPlayers: ["Epic Systems", "Oracle Health (Cerner)", "MEDITECH", "Athenahealth", "eClinicalWorks", "Veradigm (Allscripts)"],
            trends: "Epic dominant with ~38% of US hospital beds and growing. AI ambient documentation (record visits automatically). Cloud migration of on-prem EHR. Interoperability mandates (FHIR/TEFCA)",
          },
          rcm: { name: "Revenue Cycle Management", fullName: "Healthcare RCM Technology & Services", category: "Financial Operations", color: "#10B981",
            tam: "$25-30B (2025)", growth: "~10-14% CAGR", icon: "💰",
            desc: "Technology and services managing the healthcare payment lifecycle — from patient registration and insurance verification through claims submission, denial management, and collections.",
            whatTheySell: "Claims management, denial prevention, patient billing, coding automation, prior authorization, payment posting, analytics. Full outsourcing or modular tech",
            whoBuys: "Hospital CFO, revenue cycle directors, billing companies. Health systems, physician groups",
            keyPlayers: ["R1 RCM", "Waystar", "Ensemble Health Partners", "FinThrive", "Change Healthcare (Optum)", "Availity", "Cotiviti"],
            trends: "AI automating coding and denial management. Claim denial rates rising (30%+). Patient financial responsibility increasing. RCM outsourcing growing as hospitals lack specialized staff",
          },
          payerint: { name: "Payer / Claims Technology", fullName: "Health Insurance & Claims Processing", category: "Payer Technology", color: "#8B5CF6",
            tam: "$15-20B (2025)", growth: "~8-12% CAGR", icon: "📋",
            desc: "Software for health insurance companies — claims adjudication, member enrollment, care management, payment integrity, and risk adjustment.",
            whatTheySell: "Claims processing systems, payment integrity/fraud detection, risk adjustment, member engagement, care management, utilization review",
            whoBuys: "Health plan CIO/CTO, claims operations, medical directors. Health insurers, Medicaid agencies",
            keyPlayers: ["Cotiviti", "Gainwell Technologies", "Conduent", "HealthEdge", "Cognizant (TriZetto)", "Inovalon"],
            trends: "Payment integrity (identifying improper payments) is the highest-ROI segment. Medicaid technology modernization. AI for prior authorization automation. Value-based care analytics",
          },
          ltpac: { name: "Post-Acute / LTPAC", fullName: "Long-Term & Post-Acute Care Technology", category: "Post-Acute", color: "#F59E0B",
            tam: "$3-5B (2025)", growth: "~10-14% CAGR", icon: "🏠",
            desc: "EHR and care management for nursing homes, home health, hospice, and rehabilitation. Hospital EHRs (Epic) don't serve this market well.",
            whatTheySell: "Skilled nursing EHR, home health EHR, hospice EHR, care coordination, referral management, billing (MDS, OASIS)",
            whoBuys: "Nursing home operators, home health agencies, hospice providers. Post-acute care administrators",
            keyPlayers: ["PointClickCare", "MatrixCare (ResMed)", "WellSky", "NetSmart (Allscripts)", "Homecare Homebase (Hearst)"],
            trends: "PointClickCare dominant in skilled nursing (~70% share). Aging population driving demand. Hospital-at-home expanding the market. CMS interoperability mandates connecting acute-to-post-acute",
          },
          workforce: { name: "Healthcare Workforce", fullName: "Clinical Workforce Management", category: "Operations", color: "#EF4444",
            tam: "$3-5B (2025)", growth: "~15-20% CAGR", icon: "👩‍⚕️",
            desc: "Software for managing clinical staff scheduling, credentialing, and workforce optimization. Nursing shortage makes this critical.",
            whatTheySell: "Nurse scheduling, physician scheduling, credentialing, workforce analytics, agency staff management, float pool optimization",
            whoBuys: "CNO, CHRO, staffing directors at health systems. Hospitals managing 1,000+ clinical staff",
            keyPlayers: ["QGenda", "Symplr", "AMN Healthcare (tech)", "ShiftWizard", "Caliper/Sympler"],
            trends: "Nursing shortage driving 2-3x agency nurse costs. AI-powered demand forecasting. Reducing agency dependency is the #1 ROI driver. Labor is 50-60% of hospital expenses",
          },
        };
        const HI_TAX = [
          { key: "clinical", label: "Clinical Systems", color: "#3B82F6", icon: "🏥", children: ["ehr"] },
          { key: "financial", label: "Financial Operations", color: "#10B981", icon: "💰", children: ["rcm","payerint"] },
          { key: "postacute", label: "Post-Acute Care", color: "#F59E0B", icon: "🏠", children: ["ltpac"] },
          { key: "ops", label: "Operations & Workforce", color: "#EF4444", icon: "👩‍⚕️", children: ["workforce"] },
        ];
        return (
        <div>
          <div style={{ marginBottom: 24 }}><div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Healthcare IT Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>EHR, revenue cycle, payer technology, post-acute care, and workforce</div></div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Healthcare IT Taxonomy</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {HI_TAX.map(cat => (
                <div key={cat.key}>
                  <div onClick={() => toggle("htax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("htax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("htax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsectors</span>
                    <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("htax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
                  </div>
                  {isExp("htax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = HI_SUBS[ck]; if (!sub) return null; return (
                    <div key={ck} onClick={() => toggle("hsub_" + ck)} style={{ padding: "10px 16px", background: isExp("hsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("hsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span></div>
                      {isExp("hsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                        <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                        <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                      </div>}
                    </div>); })}</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {Object.entries(HI_SUBS).map(([key, sub]) => (
                <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = HI_TAX.find(t => t.children.includes(key)); if (cat) setExpanded(prev => ({ ...prev, ["htax_" + cat.key]: true, ["hsub_" + key]: true })); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>);
      })()}

      {/* ═══════ INTERNET ═══════ */}
      {subTab === "internet" && (() => {
        const IN_SUBS = {
          hosting: { name: "Hosting & Domains", fullName: "Web Hosting, Domains & Website Builders", category: "Web Infrastructure", color: "#3B82F6",
            tam: "$60-70B (2025)", growth: "~5-8% CAGR", icon: "🌐",
            desc: "Domain registration, web hosting, website builders, and online presence tools for SMBs and individuals. Commodity market with aggressive pricing competition.",
            whatTheySell: "Domain registration, shared/VPS/managed hosting, website builders, email hosting, SSL certificates, CDN",
            whoBuys: "SMBs, entrepreneurs, freelancers, bloggers. Anyone wanting an online presence",
            keyPlayers: ["GoDaddy", "Newfold Digital (Bluehost/HostGator)", "Hostinger", "IONOS", "Squarespace", "Wix", "Shopify"],
            trends: "AI website creation (GoDaddy Airo). Website builders (Squarespace, Wix) bypassing traditional hosting. Domain commoditization. Shopify dominating SMB e-commerce",
          },
          marketplace: { name: "Marketplaces & Directories", fullName: "Vertical Marketplaces & Directory Platforms", category: "Marketplaces", color: "#10B981",
            tam: "$15-25B (2025)", growth: "~8-12% CAGR", icon: "🏪",
            desc: "Online marketplaces and directory platforms connecting buyers with sellers/providers in specific verticals — health, legal, automotive, real estate.",
            whatTheySell: "Lead generation, advertising, listings, premium placements, SaaS for listed businesses, transaction facilitation",
            whoBuys: "Advertisers and listed businesses (pay for visibility), consumers (free to use). Model: monetize the supply side",
            keyPlayers: ["Internet Brands (WebMD, Martindale)", "Yelp", "Zillow", "CoStar", "Angi/HomeAdvisor", "ZocDoc"],
            trends: "AI search threatening traffic-based models. Vertical SaaS bundled with marketplace. Google commoditizing directory search. First-party data increasingly valuable",
          },
          consumersec: { name: "Consumer Security", fullName: "Consumer Cybersecurity & Identity Protection", category: "Consumer", color: "#EF4444",
            tam: "$10-14B (2025)", growth: "~5-8% CAGR", icon: "🔐",
            desc: "Antivirus, identity theft protection, VPN, and online privacy tools sold to individual consumers and families.",
            whatTheySell: "Antivirus, identity monitoring, VPN, password managers, dark web scanning, personal data cleanup, cyber insurance",
            whoBuys: "Consumers/families worried about online threats. B2C direct, OEM preloads, ISP partnerships",
            keyPlayers: ["Gen Digital (Norton/LifeLock/Avast)", "McAfee", "Bitdefender", "Kaspersky", "Aura"],
            trends: "Windows Defender commoditizing basic AV. Identity protection is the growth driver. AI-generated scams increasing threat sophistication. Subscription fatigue challenge",
          },
          emailmktg: { name: "Email & SMB Marketing", fullName: "Email Marketing & SMB Digital Marketing", category: "Marketing", color: "#F59E0B",
            tam: "$10-15B (2025)", growth: "~12-15% CAGR", icon: "📧",
            desc: "Email marketing, marketing automation, and digital marketing tools for SMBs. The workhorse channel for small business customer engagement.",
            whatTheySell: "Email campaigns, marketing automation, SMS marketing, social media management, CRM lite, landing pages",
            whoBuys: "SMBs (restaurants, retailers, nonprofits, real estate agents). Marketing managers at small businesses",
            keyPlayers: ["Mailchimp (Intuit)", "Constant Contact", "HubSpot (SMB tier)", "Brevo (Sendinblue)", "Klaviyo", "ActiveCampaign"],
            trends: "AI-generated email content. Mailchimp (Intuit) dominant with free tier. HubSpot moving downmarket. SMS and multichannel growing. Personalization becoming table stakes",
          },
          adtech: { name: "AdTech & Mobile", fullName: "Digital Advertising Technology & Mobile Marketing", category: "Advertising", color: "#8B5CF6",
            tam: "$350-400B (2025)", growth: "~10-15% CAGR", icon: "📱",
            desc: "Technology platforms for digital advertising — demand-side platforms, supply-side platforms, ad networks, attribution, and mobile marketing.",
            whatTheySell: "Programmatic ad buying (DSP), ad serving, mobile user acquisition, app monetization (rewarded video), attribution, creative optimization",
            whoBuys: "Advertisers and their agencies (demand side), publishers and app developers (supply side)",
            keyPlayers: ["Google (DV360)", "Meta (Ads)", "The Trade Desk", "AppLovin", "Liftoff/Vungle", "Unity Ads", "ironSource (Unity)"],
            trends: "Apple ATT permanently changed mobile ad targeting. AI-powered creative optimization. Retail media networks (Amazon, Walmart) growing fast. CTV/streaming ads emerging",
          },
        };
        const IN_TAX = [
          { key: "webinfra", label: "Web Infrastructure", color: "#3B82F6", icon: "🌐", children: ["hosting"] },
          { key: "mktp", label: "Marketplaces & Directories", color: "#10B981", icon: "🏪", children: ["marketplace"] },
          { key: "consumer", label: "Consumer Products", color: "#EF4444", icon: "🔐", children: ["consumersec"] },
          { key: "mktg", label: "Marketing & Advertising", color: "#F59E0B", icon: "📧", children: ["emailmktg","adtech"] },
        ];
        return (
        <div>
          <div style={{ marginBottom: 24 }}><div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Internet Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Hosting, marketplaces, consumer security, email marketing, and adtech</div></div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Internet Taxonomy</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click to expand</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {IN_TAX.map(cat => (
                <div key={cat.key}>
                  <div onClick={() => toggle("ntax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: isExp("ntax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("ntax_" + cat.key) ? cat.color + "44" : T_.border}` }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span><span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsectors</span>
                    <span style={{ fontSize: 12, color: T_.textGhost, transform: isExp("ntax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
                  </div>
                  {isExp("ntax_" + cat.key) && <div style={{ marginLeft: 32, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>{cat.children.map(ck => { const sub = IN_SUBS[ck]; if (!sub) return null; return (
                    <div key={ck} onClick={() => toggle("nsub_" + ck)} style={{ padding: "10px 16px", background: isExp("nsub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span><span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span><span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span><span style={{ fontSize: 13, color: T_.textGhost, transform: isExp("nsub_" + ck) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span></div>
                      {isExp("nsub_" + ck) && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 8, lineHeight: 1.5 }}>{sub.desc}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div><div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.5 }}>{sub.whoBuys}</div></div></div>
                        <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                        <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                      </div>}
                    </div>); })}</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {Object.entries(IN_SUBS).map(([key, sub]) => (
                <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = IN_TAX.find(t => t.children.includes(key)); if (cat) setExpanded(prev => ({ ...prev, ["ntax_" + cat.key]: true, ["nsub_" + key]: true })); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>);
      })()}
    </div>
  );
}
