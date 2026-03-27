import { useState, useEffect } from "react";

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

export default function Primer({ initialTab }) {
  const [subTab, setSubTab] = useState(initialTab || "software");
  useEffect(() => { if (initialTab) setSubTab(initialTab); }, [initialTab]);
  const [expanded, setExpanded] = useState({});
  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const isExp = (key) => !!expanded[key];

  return (
    <div style={{ flex: 1, padding: "36px 52px", overflowY: "auto", maxWidth: 1750, fontFamily: FONT }}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${T_.borderLight}` }}>
        {[{ key: "software", label: "Software" }, { key: "semis", label: "Semiconductors" }, { key: "digiinfra", label: "Digital Infrastructure" }, { key: "itservices", label: "IT Services" }, { key: "healthit", label: "Healthcare IT" }, { key: "internet", label: "Internet" }, { key: "education", label: "Education" }].map(t => (
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

          {/* ─── REVENUE MODELS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Software Revenue Models</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How software companies make money. The revenue model defines the business quality — recurring subscription commands premium multiples; perpetual license trades at a discount. Most companies are in transition between models.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "SaaS Subscription", color: "#10B981", icon: "🔄",
                  how: "Customers pay a recurring fee (monthly or annually) for access to cloud-hosted software. Typically priced per-user, per-seat, or per-module. Revenue is recognized ratably over the contract term",
                  economics: "Gross margins: 70-85%. Net dollar retention: 110-130% for best-in-class. Revenue is predictable and compounds. Customer acquisition cost (CAC) recovered over 12-18 months. LTV/CAC ratio of 3-5x is healthy",
                  examples: "Salesforce (per-seat CRM), Workday (per-employee HCM), Datadog (per-host monitoring), ServiceNow (per-user ITSM)",
                  valuation: "Highest multiples: 8-20x ARR for growth SaaS. Market rewards predictability, retention, and expansion revenue. The 'Rule of 40' (growth% + FCF%) is the key health metric",
                  transition: "This is where every software company wants to be. Companies transitioning from perpetual to subscription (e.g., Adobe in 2012, Autodesk in 2016) see short-term revenue dips but long-term value creation",
                },
                { name: "Consumption / Usage-Based", color: "#3B82F6", icon: "📊",
                  how: "Customers pay based on actual usage — per API call, per GB stored, per query, per transaction. No fixed commitment; bill scales with consumption. Sometimes combined with a base subscription + overage",
                  economics: "Gross margins: 60-80% (lower than pure SaaS due to infrastructure costs). Revenue grows with customer workload — natural expansion without sales effort. But revenue can decline if usage drops (macro sensitivity)",
                  examples: "Snowflake (per-credit compute), AWS/Azure (per-hour/GB), Twilio (per-message/call), Datadog (per-host, usage tiers), Stripe (per-transaction %)",
                  valuation: "Trades at premium when usage is growing (implies product-market fit). Discount when usage decelerates. Investors scrutinize 'net revenue retention' and 'dollar-based net expansion rate' closely",
                  transition: "Growing model — aligns vendor revenue with customer value. Risk: unpredictable revenue makes forecasting harder. Some companies (Elastic, HashiCorp) have shifted from subscription to consumption",
                },
                { name: "Perpetual License + Maintenance", color: "#F59E0B", icon: "📜",
                  how: "Customer pays a one-time license fee upfront for the right to use the software forever. Then pays an annual maintenance fee (typically 18-22% of license) for updates, patches, and support. Maintenance is recurring; license is one-time",
                  economics: "License gross margins: 90%+ (nearly pure profit). Maintenance gross margins: 85-90%. Maintenance renewal rates: 90-95%. The maintenance stream is the recurring cash flow that PE sponsors value. Total revenue is lumpy due to large license deals",
                  examples: "Oracle Database (on-prem), BMC Mainframe (AMI), Quest Software (AD tools), legacy SAP, legacy Microsoft (before M365). Most PE-owned enterprise software still has significant perpetual revenue",
                  valuation: "Lower multiples: 3-6x EBITDA for perpetual-heavy. Market penalizes lumpiness and perceived obsolescence. PE sponsors buy perpetual businesses cheaply and try to transition to subscription for multiple expansion",
                  transition: "Declining model — most vendors are forcing customers to subscription/cloud. The perpetual→subscription transition is the #1 value creation lever in PE-owned software. Revenue temporarily dips during transition, then re-accelerates at higher recurring quality",
                },
                { name: "Transaction / Per-Unit Fees", color: "#8B5CF6", icon: "💳",
                  how: "Revenue generated per transaction processed, per document filed, per claim adjudicated, per search performed. Volume-based — more activity = more revenue. Often embedded in customer workflows as 'tolls'",
                  economics: "Margins vary: 50-80% depending on processing costs. Revenue scales with economic activity (e.g., M&A volume for Datasite, auto claims for CCC, tax filings for Avalara). Recurring in practice but not contractually guaranteed",
                  examples: "Datasite (per-deal VDR), CCC Intelligent Solutions (per-claim), Avalara (per-transaction tax calc), Solera/Audatex (per-estimate), Dye & Durham (per-search)",
                  valuation: "Valued on revenue predictability and volume trends. Companies with high-volume, embedded transaction flows trade at 5-10x revenue. Cyclical exposure (M&A volume, auto claims volume) is a risk",
                  transition: "Stable model for companies embedded in transaction workflows. The key question is whether the volume base is growing or shrinking and whether pricing power exists to raise per-unit fees",
                },
                { name: "Freemium / Open Source + Commercial", color: "#EF4444", icon: "🆓",
                  how: "Core product is free (open source or freemium). Revenue comes from paid tiers with enterprise features — security, compliance, management, support, and hosting. The free tier drives adoption; commercial tier drives revenue",
                  economics: "Conversion rates: 2-5% of free users become paid. But the free tier creates massive top-of-funnel — millions of users at zero acquisition cost. Paid tier margins: 70-85%. The challenge: monetizing a user base that expects free",
                  examples: "GitLab (open core), Elastic (open source + paid), Grafana Labs (open source + cloud), SonarSource (SonarQube free + enterprise), MongoDB (community + Atlas), HashiCorp (Terraform open + enterprise)",
                  valuation: "Premium when conversion rates are improving and community is growing. Discount when open-source alternatives fork or when monetization stalls. Investors track 'free to paid conversion rate' and 'community growth'",
                  transition: "Increasingly common model. Tension: open-source community wants everything free; company needs revenue. Some companies (Elastic, Redis, MongoDB) have changed licenses to prevent cloud providers from competing with their own product",
                },
                { name: "Platform / Marketplace Fees", color: "#0EA5E9", icon: "🏪",
                  how: "Revenue from operating a platform or marketplace — take rates on transactions, listing fees, advertising, and premium placements. The platform connects buyers and sellers and takes a cut",
                  economics: "Take rates: 5-30% depending on the marketplace. Network effects create winner-take-most dynamics. Gross margins: 60-90%. The moat is the two-sided network — more buyers attract more sellers and vice versa",
                  examples: "Shopify (merchant subscriptions + payment processing), Cvent Supplier Network (venue marketplace), Internet Brands (advertising + lead gen), ConnectWise Marketplace (ISV integrations)",
                  valuation: "Highest multiples when network effects are demonstrated. GMV (gross merchandise value) and take rate trends are key metrics. Platforms with strong network effects can trade at 10-20x revenue",
                  transition: "The aspirational model — every software company wants 'platform economics.' In practice, few achieve genuine network effects. Most 'platforms' are really bundles of products marketed as platforms",
                },
              ].map((model, i) => (
                <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{model.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div>
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div>
                      <div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div>
                    <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div>
                  </div>
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


      {/* ═══════ SEMICONDUCTORS ═══════ */}
      {subTab === "semis" && (() => {
        const SEMI_SUBS = {
          eda: { name: "EDA Tools", fullName: "Electronic Design Automation", category: "EDA & IP", color: "#F59E0B", tam: "$16B+ (2025)", growth: "~12-14% CAGR", icon: "🖊️", desc: "Software tools used to design, simulate, verify, and test semiconductor chips before fabrication. Without EDA, no chip gets made. A duopoly with extremely high barriers to entry.", whatTheySell: "RTL synthesis, place & route, timing analysis, physical verification (DRC/LVS), analog/mixed-signal simulation, power analysis, formal verification, DFT", whoBuys: "Every chip designer — fabless (NVIDIA, Qualcomm), IDMs (Intel, TI), and foundries (TSMC). 100% of advanced chips designed with these tools", keyPlayers: ["Synopsys", "Cadence Design Systems", "Siemens EDA (Mentor)", "Ansys (simulation)", "Keysight"], trends: "AI-driven chip design (Synopsys DSO.ai). Exploding complexity at 3nm/2nm driving tool spend. Multi-die (chiplet) design tools. Synopsys + Cadence hold ~70% share" },
          ip: { name: "Semiconductor IP", fullName: "Silicon IP & Design Blocks", category: "EDA & IP", color: "#F59E0B", tam: "$8B+ (2025)", growth: "~14-16% CAGR", icon: "🧩", desc: "Pre-designed, verified blocks of silicon logic that chip designers license rather than build from scratch. Arm CPU cores are the most important IP in the industry — in 99% of smartphones.", whatTheySell: "Processor cores (CPU, GPU, NPU), interface IP (PCIe, USB, DDR, Ethernet), analog IP (PHY, PLL, ADC), security IP, memory compilers", whoBuys: "Fabless designers who don't want to reinvent standard blocks. Apple licenses Arm ISA then designs custom cores. Every SoC uses licensed IP", keyPlayers: ["Arm Holdings", "Synopsys (IP group)", "Cadence (IP group)", "Alphawave Semi", "Rambus", "Ceva", "Imagination Technologies"], trends: "Arm's dominance extending from mobile → data center → auto. RISC-V as open-source alternative gaining traction. Chiplet interoperability (UCIe) creating new IP demand. Arm IPO valued IP model at ~$65B" },
          gpu: { name: "GPUs & AI Accelerators", fullName: "Graphics & AI Compute Processors", category: "Logic & Compute", color: "#3B82F6", tam: "$120B+ (2025)", growth: "~30-40% CAGR", icon: "🎮", desc: "Massively parallel processors optimized for matrix math — originally for graphics, now the engine behind all AI training and most inference. NVIDIA's CUDA ecosystem is the deepest moat in semiconductors.", whatTheySell: "Data center GPUs (H100, B200, Vera Rubin), gaming GPUs (GeForce), AI training clusters (DGX), networking (InfiniBand/NVLink), inference accelerators", whoBuys: "Hyperscalers (Microsoft, Google, Meta, Amazon), AI labs (OpenAI, Anthropic), sovereign AI programs, enterprises, gamers", keyPlayers: ["NVIDIA (dominant — 80%+ DC GPU share)", "AMD (MI300X/MI400)", "Intel (Gaudi/Arc)", "Google (TPU — internal)", "AWS (Trainium — internal)"], trends: "Demand far exceeds supply through 2026. Blackwell architecture shipping. HBM memory bottleneck. CUDA lock-in is deep. Annual GPU revenue may exceed $200B by 2027" },
          cpu: { name: "CPUs", fullName: "Central Processing Units", category: "Logic & Compute", color: "#3B82F6", tam: "$80B+ (2025)", growth: "~5-8% CAGR", icon: "💻", desc: "General-purpose processors for PCs, servers, and embedded systems. x86 (Intel/AMD) dominates PC/server. Arm dominates mobile and is rapidly gaining in data center.", whatTheySell: "Server CPUs (Xeon, EPYC, Graviton), client CPUs (Core, Ryzen), embedded processors, edge/IoT processors", whoBuys: "PC OEMs (Dell, Lenovo, HP), server OEMs, hyperscalers (AWS Graviton, Microsoft Cobalt), enterprises", keyPlayers: ["Intel", "AMD", "Arm (architecture)", "Qualcomm (Snapdragon X for PC)", "AWS Graviton", "Ampere Computing"], trends: "AMD taking server share (now ~25%+). Arm server CPUs growing fast. Intel restructuring (foundry separation). AI PCs with NPUs. x86 share slowly declining in data center" },
          asic: { name: "Custom ASICs", fullName: "Application-Specific Integrated Circuits", category: "Logic & Compute", color: "#3B82F6", tam: "$30B+ (2025)", growth: "~18-22% CAGR", icon: "🔧", desc: "Custom-designed chips built for a specific workload — more efficient than GPUs for high-volume, well-defined tasks. Hyperscalers increasingly designing their own.", whatTheySell: "Custom AI accelerators (Google TPU, AWS Trainium, Meta MTIA), networking ASICs, video encoding ASICs, storage controllers", whoBuys: "Hyperscalers (Google, Amazon, Microsoft, Meta), large enterprises, telcos, automotive OEMs", keyPlayers: ["Broadcom (ASIC design services — largest)", "Marvell (custom compute)", "Google (TPU)", "AWS (Trainium)", "Microsoft (Maia)", "Meta (MTIA)"], trends: "Hyperscaler ASIC spending accelerating ($10B+ combined). Broadcom ASIC revenue ~$12B+ in 2025. 2-3 year design cycle. Trade-off: cheaper per FLOP at scale but less flexible than GPUs" },
          fpga: { name: "FPGAs", fullName: "Field-Programmable Gate Arrays", category: "Logic & Compute", color: "#3B82F6", tam: "$8B+ (2025)", growth: "~6-8% CAGR", icon: "🧮", desc: "Reconfigurable chips that can be reprogrammed after manufacturing. Bridge between flexibility of software and efficiency of ASICs. Used in networking, defense, and accelerated computing.", whatTheySell: "FPGA devices, adaptive SoCs, SmartNICs, acceleration cards, development tools", whoBuys: "Telecom (5G), defense/aerospace, data centers, automotive, industrial", keyPlayers: ["AMD (Xilinx — dominant)", "Intel (Altera)", "Lattice Semiconductor", "Microchip (Microsemi)"], trends: "Xilinx (AMD) dominates high-end. Intel separated Altera as independent entity. Adaptive computing (FPGA + CPU + AI on same chip). Niche but high-margin" },
          dram: { name: "DRAM", fullName: "Dynamic Random-Access Memory", category: "Memory", color: "#06B6D4", tam: "$100B+ (2025)", growth: "~15-20% CAGR (cyclical)", icon: "⚡", desc: "Volatile memory used for active data processing in every computing device. Highly cyclical — only 3 major producers left globally.", whatTheySell: "DDR5 modules (servers/PCs), LPDDR5 (mobile), HBM (AI accelerators), specialty DRAM (automotive)", whoBuys: "Server OEMs, PC OEMs, smartphone makers, GPU companies (HBM), hyperscalers", keyPlayers: ["Samsung (~40% share)", "SK Hynix (~30% share)", "Micron (~25% share)"], trends: "HBM demand 3-4x'd for AI GPUs. DDR5 server transition. Samsung losing HBM share to SK Hynix. Memory supercycle driven by AI" },
          hbm: { name: "HBM", fullName: "High Bandwidth Memory", category: "Memory", color: "#06B6D4", tam: "$25B+ (2025)", growth: "~60-80% CAGR", icon: "🏎️", desc: "Stacked DRAM dies providing massive bandwidth for AI accelerators. The critical bottleneck for GPU supply — HBM capacity limits how many GPUs can ship.", whatTheySell: "HBM3 (H100/H200), HBM3E (B200/B300), upcoming HBM4. 8-12 layers stacked with >1 TB/s bandwidth", whoBuys: "NVIDIA (>50% of HBM production), AMD, Google (TPU), Intel, hyperscaler ASIC programs", keyPlayers: ["SK Hynix (HBM leader — ~50% share)", "Samsung (~35% share)", "Micron (~15% share)"], trends: "HBM revenue: $2B (2023) → $25B+ (2025) → $50B+ (2027E). SK Hynix dominant. TSMC CoWoS packaging is the bottleneck. HBM4 expected 2026 with 2x bandwidth" },
          nand: { name: "NAND Flash", fullName: "NAND Flash Memory & SSDs", category: "Memory", color: "#06B6D4", tam: "$70B+ (2025)", growth: "~10-15% CAGR (cyclical)", icon: "💾", desc: "Non-volatile storage memory used in SSDs, smartphones, USB drives, and data centers. Produced in 200+ layer 3D structures.", whatTheySell: "Enterprise SSDs, client SSDs, embedded NAND, USB/SD cards, managed NAND solutions", whoBuys: "Data centers, PC OEMs, smartphone makers, enterprise storage, automotive", keyPlayers: ["Samsung (~32% share)", "Kioxia/WD (~30%)", "SK Hynix/Solidigm (~20%)", "Micron (~14%)"], trends: "200+ layer 3D NAND race. QLC for cost-optimized storage. PCIe Gen5 SSDs. Kioxia-WD merger completed" },
          litho: { name: "Lithography", fullName: "Photolithography Equipment", category: "Equipment", color: "#EF4444", tam: "$28B+ (2025)", growth: "~12-15% CAGR", icon: "🔬", desc: "The most critical step in chipmaking — uses light to print circuit patterns onto silicon wafers. ASML has a complete monopoly on EUV lithography.", whatTheySell: "EUV scanners ($350M+ each), High-NA EUV ($400M+, sub-2nm), DUV immersion scanners (mature nodes)", whoBuys: "TSMC (~35% of ASML revenue), Samsung, Intel, SK Hynix, Micron. Only ~50 EUV tools shipped per year", keyPlayers: ["ASML (100% monopoly on EUV)", "Canon (DUV — legacy)", "Nikon (DUV — legacy)"], trends: "High-NA EUV for 2nm and beyond. ASML backlog $36B+. Export controls block EUV to China. Each EUV machine weighs 150 tons. ~$4B+ in annual R&D" },
          etch: { name: "Etch, Deposition & CMP", fullName: "Etch, Thin Film Deposition & Planarization", category: "Equipment", color: "#EF4444", tam: "$40B+ (2025)", growth: "~10-12% CAGR", icon: "⚗️", desc: "After lithography, circuits must be etched (material removed), deposited (material added), and planarized (surface leveled). More total spend than lithography.", whatTheySell: "Plasma etch, CVD/PVD deposition, ALD (atomic layer deposition), CMP polishers, epitaxy, ion implantation", whoBuys: "All fabs — foundry, memory, IDMs. Each fab has 100s of these tools", keyPlayers: ["Applied Materials (broadest portfolio)", "Lam Research (etch leader)", "Tokyo Electron (TEL)", "ASM International (ALD)"], trends: "3D architectures (GAA, 200+ layer NAND) require more steps → driving tool intensity up ~15% per node. Backside power delivery at 2nm creates new etch demand" },
          inspect: { name: "Process Control & Inspection", fullName: "Wafer Inspection & Metrology", category: "Equipment", color: "#EF4444", tam: "$12B+ (2025)", growth: "~10-12% CAGR", icon: "🔍", desc: "Equipment that inspects wafers and measures critical dimensions during manufacturing. KLA dominates with ~55% share.", whatTheySell: "Optical wafer inspection, e-beam inspection, overlay metrology, CD-SEM, defect review, film measurement", whoBuys: "All fabs. Process control is ~12-15% of total equipment spend — growing as yields at advanced nodes are harder", keyPlayers: ["KLA (dominant — ~55% share)", "Applied Materials (e-beam)", "Onto Innovation", "Hitachi High-Tech", "Lasertec (EUV mask)"], trends: "AI/ML for defect classification. E-beam growing for smallest features. EUV mask inspection bottleneck (Lasertec monopoly). Spend per wafer rising 15-20% per node" },
          advpkg: { name: "Advanced Packaging", fullName: "Advanced Semiconductor Packaging (2.5D/3D)", category: "Packaging & Test", color: "#8B5CF6", tam: "$20B+ (2025)", growth: "~20-25% CAGR", icon: "🏗️", desc: "Connecting multiple chiplets and HBM stacks in a single package. The key bottleneck for AI GPU supply — TSMC CoWoS capacity limits how many GPUs ship.", whatTheySell: "2.5D interposer packaging (CoWoS, EMIB), 3D stacking (SoIC, Foveros), fan-out (InFO), hybrid bonding", whoBuys: "NVIDIA (CoWoS for every DC GPU), AMD, Apple, Google, Broadcom, AWS", keyPlayers: ["TSMC (CoWoS, SoIC — dominant)", "Intel (Foveros, EMIB)", "Samsung (I-Cube)", "ASE (OSAT leader)", "Amkor"], trends: "CoWoS is THE bottleneck — TSMC expanding to 80K+ wafers/mo by 2026. Every AI GPU requires CoWoS. Chiplet architecture (UCIe) replacing monolithic dies" },
          analog: { name: "Analog & Mixed-Signal", fullName: "Analog, Power Management & Signal Chain ICs", category: "Analog & Mixed-Signal", color: "#84CC16", tam: "$85B+ (2025)", growth: "~6-8% CAGR", icon: "📐", desc: "Chips that interface between the real world and digital systems. In every electronic device — extremely long product lifecycles and sticky customer relationships.", whatTheySell: "Power management ICs, voltage regulators, op-amps, data converters (ADC/DAC), sensor interfaces, clock/timing", whoBuys: "Every electronics maker — industrial, automotive, consumer, telecom, medical, data center. Products sell for 10-20+ years", keyPlayers: ["Texas Instruments (TI — ~18% share)", "Analog Devices (ADI)", "Infineon", "NXP", "ON Semiconductor", "STMicro", "Microchip", "Renesas"], trends: "TI's 300mm fab strategy driving cost advantage. Auto & industrial ~60% of analog revenue. Long design cycles (2-5 years) create massive switching costs. Steady 'toll booth' model" },
          power: { name: "Power Semiconductors", fullName: "Discrete Power Devices (SiC, GaN, IGBT)", category: "Power & Discrete", color: "#84CC16", tam: "$25B+ (2025)", growth: "~10-14% CAGR", icon: "⚡", desc: "Discrete devices for power conversion — EV inverters, solar inverters, grid infrastructure, motor drives.", whatTheySell: "Silicon carbide (SiC) MOSFETs, GaN FETs, silicon IGBTs, power MOSFETs, power modules", whoBuys: "EV/auto OEMs, renewable energy, industrial motor drives, data center power supplies", keyPlayers: ["Infineon (market leader)", "ON Semiconductor", "STMicroelectronics", "Wolfspeed (SiC)", "Rohm"], trends: "SiC displacing silicon IGBTs in EVs. GaN taking over chargers. EV traction inverter = $500-800 of SiC per vehicle. Wolfspeed struggling with profitability" },
          opto: { name: "Optoelectronics", fullName: "Optical Components, Transceivers & Image Sensors", category: "Optoelectronics", color: "#F97316", tam: "$45B+ (2025)", growth: "~15-20% CAGR", icon: "💡", desc: "Components converting between light and electrical signals — optical transceivers for data center networking, image sensors for cameras, LEDs/lasers.", whatTheySell: "Optical transceivers (800G→1.6T), VCSELs/EELs, image sensors (CMOS), silicon photonics, coherent optics", whoBuys: "Hyperscalers (DC interconnects), telecom carriers, smartphone OEMs, auto (LiDAR)", keyPlayers: ["Broadcom (silicon photonics)", "Coherent", "Lumentum", "Fabrinet (contract mfg)", "Sony (image sensors)", "AAOI"], trends: "800G→1.6T transceiver migration driving growth. Co-packaged optics reducing power. LPO vs CPO debate" },
        };
        const SEMI_TAX = [
          { key: "edaip", label: "EDA & Silicon IP", color: "#F59E0B", icon: "🖊️", children: ["eda", "ip"] },
          { key: "logic", label: "Logic & Compute", color: "#3B82F6", icon: "💎", children: ["gpu", "cpu", "asic", "fpga"] },
          { key: "memory", label: "Memory", color: "#06B6D4", icon: "⚡", children: ["dram", "hbm", "nand"] },
          { key: "equip", label: "Equipment", color: "#EF4444", icon: "⚙️", children: ["litho", "etch", "inspect"] },
          { key: "pkg", label: "Packaging & Test", color: "#8B5CF6", icon: "📦", children: ["advpkg"] },
          { key: "analog", label: "Analog & Mixed-Signal", color: "#84CC16", icon: "📐", children: ["analog"] },
          { key: "discrete", label: "Power & Discrete", color: "#84CC16", icon: "⚡", children: ["power"] },
          { key: "opto", label: "Optoelectronics", color: "#F97316", icon: "💡", children: ["opto"] },
        ];
        return (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Semiconductor Industry Primer</div>
            <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>From design to fabrication to packaging — the full chip value chain, subsectors, and key players</div>
          </div>
          {/* Value Chain */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Semiconductor Value Chain</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From design tools through to end markets. Each stage depends on the one to its left. ~$600B industry (2025).</div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {[
                { label: "EDA & IP", color: "#F59E0B", icon: "🖊️", desc: "Design tools & silicon IP", rows: [{ sub: "EDA Tools", ex: "Synopsys, Cadence, Siemens EDA" }, { sub: "IP Cores", ex: "Arm, Synopsys IP, Cadence IP" }, { sub: "Verification", ex: "Synopsys, Cadence, Ansys" }], buyers: "Chip designers (fabless, IDMs)" },
                { label: "Chip Design", color: "#3B82F6", icon: "💎", desc: "Fabless & IDM designers", rows: [{ sub: "Logic / GPU", ex: "NVIDIA, AMD, Qualcomm, Apple" }, { sub: "Memory", ex: "Samsung, SK Hynix, Micron" }, { sub: "Analog", ex: "TI, ADI, NXP, Infineon" }, { sub: "Custom ASIC", ex: "Broadcom, Marvell, Google" }], buyers: "OEMs, hyperscalers, auto, mobile" },
                { label: "Equipment", color: "#EF4444", icon: "⚙️", desc: "Machines that make chips", rows: [{ sub: "Lithography", ex: "ASML (monopoly: EUV)" }, { sub: "Etch & Dep", ex: "Lam Research, Applied Materials" }, { sub: "Inspection", ex: "KLA, Onto Innovation" }, { sub: "Test", ex: "Teradyne, Advantest" }], buyers: "Foundries, IDMs, memory fabs" },
                { label: "Foundry / Fab", color: "#10B981", icon: "🏭", desc: "Manufacturing the silicon", rows: [{ sub: "Leading Edge", ex: "TSMC (60%+ share), Samsung" }, { sub: "Mature Nodes", ex: "GlobalFoundries, UMC, SMIC" }, { sub: "Memory Fab", ex: "Samsung, SK Hynix, Micron" }], buyers: "Fabless designers (NVDA, AMD)" },
                { label: "Packaging & Test", color: "#8B5CF6", icon: "📦", desc: "Assembly & final test", rows: [{ sub: "Advanced", ex: "TSMC CoWoS, Intel Foveros" }, { sub: "OSAT", ex: "ASE, Amkor, JCET" }, { sub: "Substrates", ex: "Ibiden, Shinko, Unimicron" }], buyers: "Foundries, fabless (final assembly)" },
                { label: "End Markets", color: "#6366F1", icon: "🌐", desc: "Who buys the chips", rows: [{ sub: "Data Center", ex: "~30% of semi revenue (AI)" }, { sub: "Mobile", ex: "~22% (smartphones)" }, { sub: "Auto", ex: "~14% (ADAS, EV)" }, { sub: "PC/Consumer", ex: "~18% (laptops, gaming)" }], buyers: "Hyperscalers, Apple, OEMs, auto" },
              ].map((stage, i, arr) => (
                <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                    <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                      {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                    </div>
                    <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "#06B6D412", border: "1px dashed #06B6D444", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>🔬</span><span style={{ fontSize: 13, fontWeight: 700, color: "#06B6D4" }}>Materials & Chemicals — Feed Every Fab</span></div>
              <div style={{ fontSize: 11, color: T_.textDim }}>Wafers (Shin-Etsu, SUMCO) · Photoresist (JSR, TOK) · Gases (Air Liquide, Linde) · CMP (Entegris) · Chemicals (BASF, Merck KGaA)</div>
            </div>
            <div style={{ marginTop: 4, background: "#F59E0B12", border: "1px dashed #F59E0B44", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>🌏</span><span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>Geopolitics & Trade — Shapes the Entire Industry</span></div>
              <div style={{ fontSize: 11, color: T_.textDim }}>US export controls (NVDA, ASML) · CHIPS Act subsidies · China self-sufficiency push (SMIC) · Taiwan concentration risk</div>
            </div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>EDA & IP enable chip design → Equipment enables manufacturing → Foundries fabricate wafers → OSAT packages & tests → End markets consume. Timeline: ~2-4 years from design start to volume revenue.</div>
          </div>
          {/* End Market Breakdown */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>End Market Demand — $600B+ Industry (2025E)</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Where the chips go. Data center share has doubled since 2020, driven by AI infrastructure buildout.</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { name: "Data Center / AI", pct: 30, rev: "$180B+", color: "#3B82F6", growth: "~25-30% CAGR", drivers: "AI training & inference GPUs, HBM, networking ASICs, AI accelerators. Hyperscaler capex driving unprecedented demand", top: "NVIDIA, AMD, Broadcom, Marvell, Intel" },
                { name: "Mobile", pct: 22, rev: "$130B+", color: "#8B5CF6", growth: "~5-7% CAGR", drivers: "Smartphone SoCs, modems, RF front-end, power management. AI on-device features driving upgrade cycles", top: "Qualcomm, MediaTek, Apple, Skyworks" },
                { name: "PC & Consumer", pct: 18, rev: "$105B+", color: "#6366F1", growth: "~3-5% CAGR", drivers: "CPUs, GPUs, memory, SSDs, gaming, IoT. AI PC refresh cycle starting 2025-2026", top: "Intel, AMD, NVIDIA, Micron, Samsung" },
                { name: "Automotive", pct: 14, rev: "$85B+", color: "#10B981", growth: "~12-15% CAGR", drivers: "ADAS/self-driving, EV power semis, infotainment. $ content per vehicle rising from $500 → $1,500+", top: "Infineon, NXP, ON Semi, TI, STMicro" },
                { name: "Industrial", pct: 12, rev: "$70B+", color: "#F59E0B", growth: "~8-10% CAGR", drivers: "Factory automation, power grid, renewables, robotics, medical devices, defense", top: "TI, ADI, STMicro, Microchip, Renesas" },
              ].map(m => (
                <div key={m.name} style={{ flex: m.pct, background: m.color + "12", border: `1px solid ${m.color}33`, borderRadius: 8, padding: "12px 10px", minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: T_.text, margin: "2px 0" }}>{m.pct}%</div>
                  <div style={{ fontSize: 12, color: T_.text, marginBottom: 4 }}>{m.rev}</div>
                  <div style={{ fontSize: 11, color: T_.green, marginBottom: 8 }}>{m.growth}</div>
                  <div style={{ fontSize: 11, color: T_.textDim, lineHeight: 1.5, marginBottom: 8 }}>{m.drivers}</div>
                  <div style={{ fontSize: 10, color: T_.textGhost, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Key:</span> {m.top}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>Sources: SIA, WSTS, Gartner (2025E). Data center share was ~15% in 2020 — AI has doubled it. Auto content per vehicle expected to reach $1,500 by 2030 (McKinsey).</div>
          </div>
          {/* Taxonomy */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Semiconductor Taxonomy</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click any category to expand. Click a subsector for full details.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SEMI_TAX.map(cat => (
                <div key={cat.key}>
                  <div onClick={() => toggle("stax_" + cat.key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", background: isExp("stax_" + cat.key) ? cat.color + "22" : T_.bg, borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("stax_" + cat.key) ? cat.color + "44" : T_.border}`, transition: "all 0.15s" }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("stax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </div>
                  {isExp("stax_" + cat.key) && (
                    <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                      {cat.children.map(ck => { const sub = SEMI_SUBS[ck]; if (!sub) return null; return (
                        <div key={ck} onClick={() => toggle("ssub_" + ck)} style={{ padding: "10px 16px", background: isExp("ssub_" + ck) ? T_.bgInput : T_.bg, borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("ssub_" + ck) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("ssub_" + ck) && (
                            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T_.borderLight}` }} onClick={e => e.stopPropagation()}>
                              <div style={{ fontSize: 13, color: T_.textMid, marginBottom: 12, lineHeight: 1.6 }}>{sub.desc}</div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
                                <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{sub.whatTheySell}</div></div>
                                <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{sub.whoBuys}</div></div>
                              </div>
                              <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 10, border: `1px solid ${cat.color}44` }}>{p}</span>)}</div></div>
                              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{sub.trends}</div></div>
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
          {/* Subsector Cards */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Click any card to expand details in the taxonomy above.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {Object.entries(SEMI_SUBS).map(([key, sub]) => (
                <div key={key} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }}
                  onClick={() => { const cat = SEMI_TAX.find(t => t.children.includes(key)); if (cat) setExpanded(prev => ({ ...prev, ["stax_" + cat.key]: true, ["ssub_" + key]: true })); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><span style={{ fontSize: 16 }}>{sub.icon}</span><span style={{ fontSize: 14, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 8 }}>{sub.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div><div style={{ fontSize: 10, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div>
                  </div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginTop: 8, lineHeight: 1.5 }}>{sub.keyPlayers.slice(0, 4).join(" · ")}{sub.keyPlayers.length > 4 ? " +" + (sub.keyPlayers.length - 4) + " more" : ""}</div>
                </div>
              ))}
            </div>
          </div>
          {/* ─── REVENUE MODELS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Semiconductor Revenue Models</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How semiconductor companies make money. Revenue models vary dramatically across the value chain — from IP licensing (near-zero marginal cost) to foundry manufacturing (massive capex). The model determines cyclicality, margins, and valuation.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Chip Sales (Fabless)", color: "#3B82F6", icon: "💎",
                  how: "Design chips, outsource manufacturing to foundries (TSMC), sell finished chips to OEMs and hyperscalers. Revenue recognized on chip shipment. Priced per unit — ASPs range from $1 (IoT) to $30,000+ (AI GPUs)",
                  economics: "Gross margins: 55-75% (NVIDIA ~75%, AMD ~52%, Qualcomm ~56%). R&D is the major cost (20-30% of revenue). No fab capex — capital-light model. Revenue is cyclical, tied to end-market demand and inventory cycles",
                  examples: "NVIDIA (GPUs — $120B+ revenue), AMD (CPUs/GPUs), Qualcomm (mobile SoCs), Broadcom (networking/custom ASICs), Marvell (infrastructure), MediaTek",
                  valuation: "Trades on revenue growth and margin expansion. AI GPU companies (NVIDIA) at 25-40x forward earnings. Diversified fabless (Broadcom, Qualcomm) at 15-25x. Cyclical discount for inventory-heavy names",
                  transition: "Dominant model for high-performance logic. Fabless won because TSMC's manufacturing scale is unbeatable. Intel trying to shift from IDM to foundry model — the most important transition in semis" },
                { name: "IP Licensing & Royalties", color: "#F59E0B", icon: "📜",
                  how: "License semiconductor IP (processor cores, interface blocks) to chip designers who embed it in their chips. Revenue from upfront license fees + per-unit royalties on every chip shipped using the IP",
                  economics: "Gross margins: 90-95% — near-zero marginal cost (IP is designed once, licensed infinitely). Royalty revenue scales with chip volumes. High R&D to create IP, but once created, extremely high-margin recurring revenue",
                  examples: "Arm Holdings (CPU architecture — royalties on 30B+ chips/year), Synopsys/Cadence (IP groups), Rambus (memory interface IP), CEVA (DSP/AI IP), Imagination Technologies (GPU IP)",
                  valuation: "Premium multiples: Arm trades at 40-60x forward earnings reflecting the royalty model's leverage. Every new chip design that uses Arm generates royalties for 5-10+ years. Investors pay for visibility and margin quality",
                  transition: "Growing model as chiplet architectures increase IP reuse. RISC-V (open-source ISA) is the disruptive threat to Arm's royalty model — but Arm's ecosystem depth and verification costs create massive switching barriers" },
                { name: "EDA Software (Subscription + License)", color: "#10B981", icon: "🖊️",
                  how: "Sell chip design software tools on time-based subscription (3-year terms typical) or perpetual license + maintenance. Every chip designer in the world must use EDA tools — 100% attach rate for advanced chip design",
                  economics: "Gross margins: 85-90%. Subscription revenue is ~90%+ recurring. Revenue grows with semiconductor R&D spending (which grows 8-12% annually). Near-monopoly pricing power — Synopsys + Cadence = ~70% market share",
                  examples: "Synopsys (~$6B revenue, ~90% recurring), Cadence (~$4.5B revenue), Siemens EDA (Mentor Graphics). Also Ansys (simulation, acquired by Synopsys)",
                  valuation: "Premium SaaS multiples: 12-18x forward revenue. Market rewards the recurring nature, duopoly pricing power, and secular growth tied to semiconductor complexity. EDA is 'software picks and shovels' for the chip boom",
                  transition: "Stable model — EDA has been subscription-based for decades. AI is increasing tool complexity and spend per designer. Synopsys acquiring Ansys signals platform expansion beyond core EDA" },
                { name: "Foundry Manufacturing (Per-Wafer)", color: "#EF4444", icon: "🏭",
                  how: "Manufacture chips on behalf of fabless designers. Revenue is per-wafer, priced by process node (3nm costs ~$20,000+/wafer vs $2,000 for mature nodes). Long-term supply agreements with minimum volume commitments",
                  economics: "Gross margins: 50-60% (TSMC ~55%). Massive capex: TSMC spends $30-35B+/year on fabs. Depreciation is the largest cost. Utilization rates drive profitability — below 70% utilization crushes margins. Leading-edge fabs cost $20B+ to build",
                  examples: "TSMC (60%+ foundry market share, ~$90B revenue), Samsung Foundry (~15%), GlobalFoundries (~7%), UMC, SMIC (China)",
                  valuation: "TSMC at 20-25x forward earnings — premium for monopoly-like position in advanced nodes. Mature foundries (GFS, UMC) at 10-15x. Capital intensity limits multiples vs fabless. Investors watch capex/revenue ratio and utilization",
                  transition: "Concentration risk is extreme — TSMC manufactures 90%+ of advanced chips. Intel IFS (foundry services) is the strategic alternative but years behind. Geopolitical risk (Taiwan) is the industry's biggest vulnerability" },
                { name: "Equipment Sales + Service", color: "#8B5CF6", icon: "⚙️",
                  how: "Sell semiconductor manufacturing equipment to fabs (capital equipment — one-time) plus ongoing service, spare parts, and upgrades (recurring). Equipment orders are placed 6-18 months before delivery",
                  economics: "Gross margins: 45-65% on equipment, 70%+ on service. Service/installed base revenue is 25-40% of total and highly recurring. Revenue is cyclical — tied to fab capex spending. ASML's EUV machines cost $350-400M each",
                  examples: "ASML (lithography — monopoly, ~$30B revenue), Applied Materials (broadest portfolio, ~$27B), Lam Research (etch, ~$17B), KLA (inspection, ~$11B), Tokyo Electron",
                  valuation: "15-25x forward earnings. ASML at premium (monopoly). Service mix increasing improves revenue quality. Investors track WFE (wafer fab equipment) spending forecasts and order backlog as leading indicators",
                  transition: "AI driving a structural uplift in equipment spending (more advanced packaging, more process steps per wafer). China buying mature-node equipment aggressively before export controls tighten further" },
                { name: "Memory (Commodity Cycles)", color: "#06B6D4", icon: "⚡",
                  how: "Manufacture and sell memory chips (DRAM, NAND, HBM) as commodity products. Prices set by supply-demand balance — can swing 50%+ in a year. Revenue = bits shipped × price per bit. Only 3 DRAM and 5 NAND producers globally",
                  economics: "Gross margins: 20-70% depending on cycle (trough: 20-30%, peak: 55-70%). Massive capex ($15-20B+/year per company). Oligopoly pricing — 3 DRAM producers control 95%+ of market. HBM is high-margin ($15-20+ per GB vs $3-5 for standard DRAM)",
                  examples: "Samsung (largest memory company, ~$70B memory revenue), SK Hynix (~$45B, HBM leader), Micron (~$30B). HBM specifically: SK Hynix > Samsung > Micron",
                  valuation: "Cyclical multiples: 1-3x book value. Investors buy at trough margins (when stocks look expensive on P/E) and sell at peak margins (when P/E looks cheap). HBM exposure commands premium — SK Hynix re-rated from 1x to 2x+ book on HBM demand",
                  transition: "HBM is transforming memory economics — high-margin, capacity-constrained, and structurally growing with AI. Traditional DRAM/NAND remains cyclical but AI demand may dampen the amplitude of cycles" }
              ].map((model, i) => (
                <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{model.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div>
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div>
                      <div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div>
                    <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Concepts */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Fabless vs IDM vs Foundry", desc: "Fabless (NVIDIA, AMD) design chips but outsource manufacturing to foundries (TSMC). IDMs (Intel, TI) design AND manufacture. Foundries (TSMC) manufacture for others. Fabless dominates AI/mobile; IDM persists in analog/memory." },
                { title: "Moore's Law Status", desc: "Transistor density still doubles every ~2-3 years but cost-per-transistor scaling has slowed since 28nm. Leading edge costs $500M+ per tape-out. Only TSMC, Samsung, Intel can do <7nm. Economic scaling now comes from chiplets." },
                { title: "Process Nodes (What 3nm Means)", desc: "Node names are marketing — they don't refer to actual dimensions. Real metric is transistor density (M/mm²). TSMC N3: ~291M/mm². Gate-All-Around (GAA/nanosheets) replaces FinFET at 2nm for better power efficiency." },
                { title: "The Equipment Cycle", desc: "Equipment spending is a leading indicator for chip supply 2-3 years out. Orders → fab construction (1-2yr) → wafer production → chip revenue. WFE spending hit ~$100B in 2025. ASML order book is the best forward indicator." },
                { title: "Memory Cycles", desc: "DRAM/NAND is deeply cyclical — prices swing 50%+ in a year. Shortage → high prices → capex → oversupply → crash → cuts → shortage. AI demand (HBM) may dampen traditional cyclicality." },
                { title: "Design to Revenue Timeline", desc: "New chip: 2-4 years from architecture to volume revenue. Design (1-2yr) → tape-out (3-6mo) → packaging (1-3mo) → qualification (3-6mo) → ramp. This lag is why semi cycles overshoot." },
              ].map((c, i) => (
                <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>Sources: SIA, WSTS, Gartner, IDC, TrendForce, SemiAnalysis, company 10-Ks, ASML/TSMC/NVIDIA earnings. TAM and growth rates are approximate 2025 estimates.</div>
        </div>);
      })()}


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
          
          {/* ─── REVENUE MODELS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Digital Infrastructure Revenue Models</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How data center and cloud infrastructure companies make money. Models range from hyperscaler cloud (consumption-based, massive scale) to data center leasing (real estate economics) to equipment manufacturing.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Cloud Consumption (IaaS/PaaS)", color: "#3B82F6", icon: "☁️",
                  how: "Customers pay for cloud compute, storage, and networking based on actual usage — per hour, per GB, per query. No upfront commitment for on-demand; reserved instances offer discounts for 1-3 year commitments",
                  economics: "Gross margins: 60-70% (AWS ~62%, Azure ~72%, GCP improving). Massive capex ($50-100B+/year per hyperscaler). Revenue grows with customer workload expansion. Net revenue retention 120-130%+ as customers increase cloud usage",
                  examples: "AWS (~$110B revenue), Microsoft Azure (~$80B), Google Cloud (~$45B), Oracle Cloud (OCI), IBM Cloud",
                  valuation: "Hyperscalers valued as part of parent companies. Standalone: 8-15x revenue for cloud businesses. Growth rate and margin trajectory are key. AWS is the profit engine of Amazon",
                  transition: "Dominant model — 40%+ of enterprise workloads now in cloud. AI workloads (GPU-as-a-service) are the fastest-growing segment. Multi-cloud is default, reducing lock-in but increasing total spend" },
                { name: "Long-Term Data Center Leasing", color: "#10B981", icon: "🏗️",
                  how: "Build purpose-built data centers and lease them to hyperscalers/neoclouds on 10-25 year contracts. Revenue = power capacity (MW) × lease rate ($/kW/month). Leases often have credit enhancement from investment-grade tenants",
                  economics: "Target NOI margins: 70-85%. Massive upfront construction cost ($10-15M per MW). Revenue is highly predictable once leased (10-25 year terms). Key metric: contracted backlog and time-to-revenue. Construction execution risk is the primary operational risk",
                  examples: "Applied Digital (~$16B contracted), TeraWulf (~$12.8B contracted), Cipher Digital (~$9.3B contracted), Equinix, Digital Realty, QTS (Blackstone)",
                  valuation: "Traditional colocation: 20-25x EBITDA (REIT multiples). AI data center builders: valued on contracted backlog and MW under development — higher multiples when backlog visibility is strong. Crypto-to-AI pivots trade at a discount until HPC revenue materializes",
                  transition: "AI demand has transformed this from a slow-growth REIT business to a high-growth infrastructure play. The constraint is power — companies with secured grid interconnections and fast build timelines command premium lease rates" },
                { name: "GPU-as-a-Service (Neocloud)", color: "#8B5CF6", icon: "⚡",
                  how: "Lease GPU compute capacity to AI labs and enterprises via cloud platform. Revenue from multi-year take-or-pay contracts with committed minimum spend. Higher up the stack than DC leasing — includes software orchestration layer",
                  economics: "Gross margins: 50-65%. GPU depreciation is the major cost (GPUs lose value as new generations launch every 12-18 months). Revenue highly concentrated in top customers. Adjusted EBITDA margins 55-62% (CoreWeave). Massive debt ($14B+ at CoreWeave) funds GPU purchases",
                  examples: "CoreWeave (~$5.1B revenue, $66.8B backlog), Lambda (~$800M funding), Together AI, Nebius (NVIDIA-backed), Voltage Park",
                  valuation: "Valued on revenue growth and backlog. CoreWeave at ~8-10x forward revenue. Key risk: GPU collateral depreciation — loans secured by GPUs that lose value. Refinancing walls create liquidity risk",
                  transition: "New model created by AI demand explosion. The question is durability — will hyperscalers eventually build enough internal capacity to reduce outsourcing to neoclouds? NVIDIA partnership depth determines competitive position" },
                { name: "Managed Services (Recurring)", color: "#F59E0B", icon: "🖥️",
                  how: "Ongoing management of customer IT infrastructure — monitoring, patching, help desk, cloud optimization. Monthly/annual contracts with SLAs. Revenue recognized ratably over the contract term",
                  economics: "Gross margins: 30-50% (labor-intensive). Revenue is recurring with 90%+ retention. Lower margin than software but predictable. Pricing pressure from offshore competition. Scale economics improve with automation (AIOps)",
                  examples: "Rackspace (~$2.7B), Ensono (~$600-800M), Kyndryl (~$15B), DXC Technology. Also embedded in VARs like Presidio and WWT",
                  valuation: "6-10x EBITDA for managed services. Premium when recurring mix is high and automation drives margin expansion. Discount for declining legacy hosting (Rackspace) vs growing cloud management",
                  transition: "Shifting from managing on-prem infrastructure (declining) to managing cloud environments (growing). AIOps and automation reducing headcount per customer — the margin expansion story PE sponsors target" }
              ].map((model, i) => (
                <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{model.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div>
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div>
                      <div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div>
                    <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div>
                  </div>
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
          {/* Value Chain */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>IT Services — Value Chain</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Technology vendors sell through the services ecosystem to reach enterprise buyers. Each layer adds value on top of the one to its left.</div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {[
                { label: "Technology Vendors", color: "#64748B", icon: "🏭", desc: "Build the products",
                  rows: [{ sub: "Software", ex: "Microsoft, SAP, Salesforce, ServiceNow" }, { sub: "Infrastructure", ex: "Cisco, Dell, HP, Palo Alto" }, { sub: "Cloud", ex: "AWS, Azure, GCP" }],
                  buyers: "Sell through channel or direct" },
                { label: "Distribution", color: "#0EA5E9", icon: "📦", desc: "Wholesale & logistics",
                  rows: [{ sub: "Broadline", ex: "TD SYNNEX, Ingram Micro" }, { sub: "Specialty", ex: "Arrow, Westcon-Comstor" }, { sub: "Cloud Marketplace", ex: "Ingram Cloud, Pax8" }],
                  buyers: "VARs, MSPs, resellers" },
                { label: "VARs & Integrators", color: "#10B981", icon: "🔧", desc: "Design & deploy solutions",
                  rows: [{ sub: "Enterprise", ex: "CDW, WWT, SHI, Insight" }, { sub: "Mid-Market", ex: "Presidio, Trace3, Ahead DB" }, { sub: "Security", ex: "Optiv, Guidepoint" }],
                  buyers: "Enterprise IT departments" },
                { label: "Consulting", color: "#3B82F6", icon: "💼", desc: "Strategy & implementation",
                  rows: [{ sub: "Global SI", ex: "Accenture, Deloitte, IBM" }, { sub: "Digital", ex: "Perficient, EPAM, Thoughtworks" }, { sub: "Specialist", ex: "Synechron (FS), Virtusa" }],
                  buyers: "CIO, CTO, business leaders" },
                { label: "Managed Services", color: "#8B5CF6", icon: "🖥️", desc: "Ongoing operations",
                  rows: [{ sub: "Enterprise", ex: "Kyndryl, DXC, Ensono" }, { sub: "MSP (SMB)", ex: "ConnectWise, Kaseya/Datto" }, { sub: "Security", ex: "Optiv MSSP, Sophos MDR" }],
                  buyers: "Orgs outsourcing IT ops" },
                { label: "End Customers", color: "#6366F1", icon: "👥", desc: "Consume IT services",
                  rows: [{ sub: "Enterprise", ex: "Fortune 500, Global 2000" }, { sub: "Mid-Market", ex: "1K-10K employees" }, { sub: "SMB", ex: "< 1K employees (via MSPs)" }],
                  buyers: "Every industry" },
              ].map((stage, i, arr) => (
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
                  {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>IT services is a ~$1T+ global market. The key trend is the shift from hardware resale (low margin, transactional) to managed services and consulting (recurring, higher margin). PE sponsors target this margin expansion story aggressively.</div>
          </div>
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>IT Services Taxonomy</div>
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
          {/* ─── REVENUE MODELS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>IT Services Revenue Models</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How IT services companies make money. The industry spans from high-volume product resale (low margin) to strategic consulting (high margin). The PE playbook: buy a reseller cheaply, grow the services mix, sell at a services multiple.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Product Resale (VAR)", color: "#64748B", icon: "📦",
                  how: "Purchase hardware and software from vendors (Cisco, Dell, HP, Microsoft) at distributor pricing, sell to enterprises at a markup. Revenue recognized on product shipment. Vendor rebates, MDF (market development funds), and deal registration improve effective margins",
                  economics: "Gross margins: 12-20% on products (thin). Vendor rebates add 3-8% effective margin. Revenue is transactional and lumpy — tied to customer refresh cycles. Working capital intensive (inventory and receivables). Revenue per employee is high ($500K-1M+) but margin per employee is low",
                  examples: "CDW (~$21B revenue, ~18% GM), SHI (~$14B), Insight (~$9B), World Wide Technology (~$17-20B). Also Presidio, Trace3, Ahead DB at smaller scale",
                  valuation: "4-6x EBITDA for resale-heavy businesses. Market penalizes the transactional, low-margin nature. The entire PE playbook is to shift this mix toward services to justify higher exit multiples",
                  transition: "Declining as a standalone model — vendors increasingly sell direct and through cloud marketplaces. VARs must add services value (design, deployment, managed services) or become irrelevant commodity middlemen" },
                { name: "Professional Services (Project-Based)", color: "#3B82F6", icon: "💼",
                  how: "Sell consulting and implementation expertise on a time-and-materials (hourly rate × hours) or fixed-price project basis. Revenue recognized as work is performed. Projects range from weeks (assessments) to years (large transformations)",
                  economics: "Gross margins: 30-45%. Utilization rate is the key metric — billable hours as % of available hours (target: 70-80%). Onshore rates: $150-300/hr. Nearshore: $40-80/hr. Offshore: $20-40/hr. Blend ratio determines profitability. Revenue is volatile — discretionary projects cut in downturns",
                  examples: "Accenture (~$65B), Deloitte consulting, EPAM (~$3.7B), Perficient (~$920M), Thoughtworks, Virtusa, Synechron",
                  valuation: "8-14x EBITDA for high-quality consultancies. Premium for specialized expertise (healthcare IT, financial services), high utilization, and offshore leverage. Discount for generic SI work and high client concentration",
                  transition: "AI is the disruptive force — code generation (Copilot/Cursor) could reduce billable hours for implementation work. Consulting firms pivoting to AI implementation services to offset. The question: does AI reduce demand for consultants or create new demand?" },
                { name: "Managed IT Services (Recurring)", color: "#10B981", icon: "🔄",
                  how: "Deliver ongoing IT operations on monthly/annual contracts — monitoring, patching, help desk, NOC/SOC, cloud management. Revenue recognized ratably. Priced per device, per user, or per environment. SLAs define service quality",
                  economics: "Gross margins: 35-55%. Recurring revenue with 90-95% retention. Higher margin than project work because automation (RMM tools, scripting) reduces labor over time. Predictable cash flows make this the PE favorite",
                  examples: "Ensono (~$600-800M), managed services divisions within Presidio, WWT, CDW. MSP-specific: ConnectWise ecosystem, Kaseya/Datto ecosystem serving thousands of MSPs",
                  valuation: "10-14x EBITDA — significant premium over resale (4-6x) and project services (8-14x). The recurring, predictable nature commands SaaS-like multiples. This is why every VAR and SI is trying to grow managed services",
                  transition: "The fastest-growing segment in IT services. Every PE-backed VAR (Presidio, Ahead, Trace3) is measured on managed services as % of total revenue. Moving from 20-30% to 50%+ managed services can double the exit multiple" },
                { name: "MSP Software (SaaS for MSPs)", color: "#F59E0B", icon: "🛠️",
                  how: "Sell SaaS software to managed service providers — RMM, PSA, backup, security tools. Per-endpoint, per-technician, or per-device monthly pricing. MSPs are the customer; their SMB clients are the end users",
                  economics: "Gross margins: 70-80% (software economics). Revenue scales with endpoints under management — as MSPs grow, they add more devices and products. Net retention 110-120%+. Land-and-expand model",
                  examples: "ConnectWise (~$1-1.3B), Kaseya/Datto (~$1.5-2B+), N-able (~$450-500M), NinjaRMM, Syncro, HaloPSA",
                  valuation: "12-20x ARR for high-growth MSP software. Datto acquired for $6.2B (~8-9x revenue). ConnectWise likely valued at $4-6B+. The embedded, mission-critical nature (MSPs run their entire business on these tools) commands premium",
                  transition: "Consolidating rapidly through PE-driven M&A. ConnectWise vs Kaseya is the defining rivalry. Cybersecurity is the growth driver — MSPs adding security services to their stack creates demand for MSSP tools" },
                { name: "IT Distribution (Wholesale)", color: "#0EA5E9", icon: "🚛",
                  how: "Wholesale distribution of hardware, software, and cloud services from vendors to resellers/MSPs/retailers. Revenue = product cost + small markup (2-5%). High volume, low margin. Also earn vendor incentives and rebates",
                  economics: "Gross margins: 6-8%. Operating margins: 2-4%. Revenue in the tens of billions but profit is thin. Working capital intensive — distributors finance inventory and extend credit. Value is in logistics, credit, and vendor relationships at massive scale",
                  examples: "TD SYNNEX (~$57B revenue), Ingram Micro (~$47-50B), Arrow Electronics (~$30B), Westcon-Comstor, ScanSource",
                  valuation: "6-10x EBITDA. Low margins limit multiples. Cloud marketplace distribution (Pax8, Ingram Cloud) growing faster and commanding slight premium. Consolidation trend (TD + SYNNEX merged) drives scale economics",
                  transition: "Cloud marketplace distribution is the growth segment — resellers provision cloud services through distributor marketplaces. Traditional hardware distribution is flat to declining. Vendor-direct and marketplace-direct threaten the intermediary role long-term" }
              ].map((model, i) => (
                <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{model.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div>
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div>
                      <div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div>
                    <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Key Concepts */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Resale vs Services Mix", desc: "The % of revenue from recurring managed services vs. one-time hardware resale defines valuation. A VAR at 30% services trades at 4-5x EBITDA. At 50%+ services, it's 8-12x. PE sponsors buy VARs specifically to shift this mix." },
                { title: "Channel Economics", desc: "Technology vendors pay channel partners 15-40% margins on product sales, plus rebates and incentives (MDF, deal registration). Partners that achieve top-tier vendor status (Cisco Gold, Dell Titanium) get better economics." },
                { title: "MSP vs MSSP", desc: "MSPs manage IT infrastructure (servers, networks, endpoints). MSSPs specialize in security operations (SOC, SIEM, incident response). The line is blurring as MSPs add security and MSSPs add management. ConnectWise and Kaseya serve both." },
                { title: "Offshore / Nearshore Arbitrage", desc: "IT consulting firms use offshore (India — $20-40/hr) and nearshore (LATAM — $40-70/hr) delivery to compete with onshore rates ($150-250/hr). The blend ratio determines margin. Firms like Perficient, Virtusa, and UST leverage this model." },
              ].map((c, i) => (
                <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
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
          {/* Value Chain */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare IT — Value Chain</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Patient care generates data → clinical systems capture it → financial systems monetize it → analytics optimize it → payers adjudicate it</div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {[
                { label: "Clinical Systems", color: "#3B82F6", icon: "🏥", desc: "Capture clinical data",
                  rows: [{ sub: "Hospital EHR", ex: "Epic, Oracle Health, MEDITECH" }, { sub: "Ambulatory EHR", ex: "Athenahealth, eClinicalWorks" }, { sub: "Post-Acute EHR", ex: "PointClickCare, WellSky" }, { sub: "Specialty", ex: "Veeva (pharma), ModMed" }],
                  buyers: "Hospitals, practices, nursing homes" },
                { label: "Revenue Cycle", color: "#10B981", icon: "💰", desc: "Turn care into revenue",
                  rows: [{ sub: "Coding & Billing", ex: "R1 RCM, Ensemble, FinThrive" }, { sub: "Claims Mgmt", ex: "Waystar, Change Healthcare" }, { sub: "Patient Payments", ex: "Cedar, InstaMed" }, { sub: "Denial Mgmt", ex: "Waystar, Cotiviti" }],
                  buyers: "Hospital CFO, billing companies" },
                { label: "Payer Technology", color: "#8B5CF6", icon: "📋", desc: "Adjudicate & pay claims",
                  rows: [{ sub: "Claims Processing", ex: "Gainwell, HealthEdge, TriZetto" }, { sub: "Payment Integrity", ex: "Cotiviti, Change Healthcare" }, { sub: "Risk Adjustment", ex: "Cotiviti, Inovalon" }, { sub: "Care Management", ex: "HealthEdge, Conduent" }],
                  buyers: "Health plans, Medicaid agencies" },
                { label: "Data & Analytics", color: "#F59E0B", icon: "📊", desc: "Insights & optimization",
                  rows: [{ sub: "Clinical Analytics", ex: "Health Catalyst, Arcadia" }, { sub: "Pop Health", ex: "Innovaccer, Lightbeam" }, { sub: "Quality/HEDIS", ex: "Cotiviti, Inovalon" }, { sub: "AI/Automation", ex: "Ambient AI, coding AI" }],
                  buyers: "CMO, quality teams, data teams" },
                { label: "Workforce & Ops", color: "#EF4444", icon: "👩‍⚕️", desc: "Staff & operate",
                  rows: [{ sub: "Scheduling", ex: "QGenda, Symplr" }, { sub: "Credentialing", ex: "Symplr, Modio" }, { sub: "Staffing", ex: "AMN Healthcare, Aya" }, { sub: "Optimization", ex: "Caliper/Sympler, LeanTaaS" }],
                  buyers: "CNO, CHRO, staffing directors" },
              ].map((stage, i, arr) => (
                <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                    <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                      {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                    </div>
                    <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "#3B82F612", border: "1px dashed #3B82F644", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>🔗</span><span style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6" }}>Interoperability — Connects All Systems</span></div>
              <div style={{ fontSize: 11, color: T_.textDim }}>FHIR/HL7 standards · HIEs · TEFCA framework · Epic Care Everywhere · CommonWell</div>
            </div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>US healthcare is a $4.5T industry. ~25% of spend goes to administration. Epic dominates hospitals (~38% of beds); the rest of the ecosystem is highly fragmented.</div>
          </div>
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
          {/* ─── REVENUE MODELS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare IT Revenue Models</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How healthcare technology companies make money. Revenue models range from per-patient SaaS to percentage-of-collections RCM. Healthcare's regulatory complexity and mission-critical nature create high switching costs and sticky recurring revenue across most models.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "EHR / Clinical SaaS (Per-Patient/Per-Provider)", color: "#3B82F6", icon: "🏥",
                  how: "Hospitals and practices pay annual subscriptions for EHR and clinical software. Priced per-provider, per-bed, or per-patient. Multi-year contracts (3-7 years) with large upfront implementation projects. Revenue recognized ratably over the contract",
                  economics: "Gross margins: 60-75% (lower than pure SaaS due to hosting complexity and support). Implementation services are 15-25% of initial deal value (lower margin). Retention: 95%+ — ripping out an EHR is a 3-5 year, $10-50M+ project. Epic charges $1,000-2,000+ per provider/year",
                  examples: "Epic Systems (private, dominant in hospitals), Oracle Health/Cerner, athenahealth (~$1.8-2.2B), PointClickCare (LTPAC — ~70% of skilled nursing), MEDITECH, eClinicalWorks",
                  valuation: "8-15x revenue for high-retention clinical SaaS. Athenahealth acquired at $17B (~8-9x revenue). PointClickCare valued at $4B+ reflecting near-monopoly in LTPAC. Epic's implied valuation would be astronomical if it were public",
                  transition: "Cloud migration is the current wave — legacy on-prem EHR moving to cloud-hosted or cloud-native. AI ambient documentation (recording and transcribing clinical encounters) is the next product cycle creating upsell opportunity" },
                { name: "RCM Outsourcing (Percentage of Collections)", color: "#10B981", icon: "💰",
                  how: "Full revenue cycle management outsourcing — provider pays a percentage of net patient revenue collected (typically 4-7%) or per-encounter fee. RCM company embeds staff in hospitals to manage coding, billing, claims, and collections end-to-end",
                  economics: "Gross margins: 25-40% (labor-intensive — thousands of coders, billers, and collectors). Revenue is highly recurring (multi-year contracts, 3-5 year terms). Revenue scales with healthcare volume — more patients = more claims = more revenue. R1 RCM manages ~$60B in patient revenue",
                  examples: "R1 RCM (~$2.3B revenue, taken private for $8.9B), Ensemble Health Partners (~$1-1.5B), Conifer Health (Tenet). Smaller: AGS Health, GeBBS Healthcare",
                  valuation: "12-16x EBITDA for scaled RCM outsourcers. Premium for technology-enabled models (Cloudmed analytics + services). The $8.9B R1 RCM take-private reflects the market's appetite for recurring healthcare services revenue",
                  transition: "AI is the transformation catalyst — automated coding, AI-powered denial prediction, and robotic process automation reduce labor intensity and improve margins. Companies that successfully layer AI onto services models will see significant margin expansion" },
                { name: "RCM Technology (SaaS + Transaction)", color: "#8B5CF6", icon: "💳",
                  how: "Software platforms for claims management, denial prevention, patient payments, and analytics. Revenue from SaaS subscriptions plus per-claim or per-transaction fees. Technology-first model vs the labor-heavy outsourcing model",
                  economics: "Gross margins: 65-80% (software economics). Revenue is recurring and grows with claims volume. Per-transaction pricing means revenue scales with healthcare activity without proportional cost increase. Net retention 110-115%",
                  examples: "Waystar (~$800-900M, IPO'd 2024), FinThrive (~$500-700M), Change Healthcare (now Optum/UHG), Availity, Olive AI (struggling)",
                  valuation: "8-12x revenue for RCM technology. Waystar IPO'd at ~$5-7B market cap (~7-8x revenue). Technology-only models command premium over outsourcing because margins are higher and scalability is better",
                  transition: "The market is splitting between pure technology (Waystar, FinThrive) and technology + services (R1 RCM, Ensemble). Pure tech has better margins but lower revenue per customer. The question is whether AI enables tech-only to replace services-heavy" },
                { name: "Payment Integrity (Savings-Based)", color: "#F59E0B", icon: "🔍",
                  how: "Analyze healthcare claims to identify overpayments, fraud, and coding errors for health plans. Revenue based on a percentage of identified savings — if Cotiviti finds $10B in improper payments, it earns a cut of the recovery",
                  economics: "Gross margins: 50-70%. Revenue directly tied to claims volume and savings rate. Highly recurring — health plans process millions of claims annually and need continuous monitoring. ROI is clear and quantifiable: $1 spent returns $5-10+ in savings identified",
                  examples: "Cotiviti (~$1-1.3B, processes $1T+ in claims), Change Healthcare/Optum (payment integrity division), Inovalon, Gainwell Technologies (Medicaid)",
                  valuation: "10-15x EBITDA. Premium for scale and proprietary data/algorithms. Cotiviti at estimated $4-6B+ valuation. The savings-based model aligns incentives perfectly — Cotiviti only earns when it delivers measurable value",
                  transition: "AI improving detection rates — more sophisticated algorithms find more savings. Expanding from post-payment review (after claim is paid) to pre-payment prevention (stop improper payment before it happens). Pre-payment is more valuable and stickier" },
                { name: "Government Health IT (Long-Term Contracts)", color: "#EF4444", icon: "🏛️",
                  how: "Build and operate health IT systems for state Medicaid agencies and federal programs. Revenue from long-term government contracts (5-10+ years with extensions). Per-claim, per-member, or fixed-price contracts. Procurement cycles are 1-3 years",
                  economics: "Gross margins: 30-45% (complex implementations, government pricing pressure). Revenue is extremely sticky — switching a state MMIS system takes 3-5 years and costs hundreds of millions. Backlog provides multi-year visibility. Payment timing can be lumpy",
                  examples: "Gainwell Technologies (~$1.5-2B, processes $100B+ in Medicaid claims across 30+ states), Maximus, Deloitte (Medicaid SI), Accenture (government health)",
                  valuation: "8-12x EBITDA for government health IT. Premium for contract backlog and incumbent advantage. Discount for government procurement complexity and margin pressure. Gainwell acquired for $5B reflecting the captive Medicaid franchise",
                  transition: "Medicaid modernization is a decade-long opportunity — legacy MMIS systems being replaced with modern, modular architectures. CMS promoting modularity means more vendors can compete for pieces, but incumbent advantage remains massive" }
              ].map((model, i) => (
                <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{model.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div>
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div>
                      <div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div>
                    <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Key Concepts */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Epic's Dominance", desc: "Epic controls ~38% of US hospital beds and growing. Privately held, refuses to sell. Wins almost every new hospital EHR deal. Competing with Epic in hospital EHR is nearly impossible." },
                { title: "Revenue Cycle = Hidden Goldmine", desc: "Hospitals lose 3-5% of revenue to claim denials, underpayments, and billing errors. RCM tech recovers this — every $1 spent returns $3-5+ in recovered revenue. 30%+ of claims are initially denied." },
                { title: "Post-Acute is the Next Frontier", desc: "Hospital EHRs don't serve nursing homes, home health, or hospice well. Post-acute tech is earlier in digitization. PointClickCare has ~70% of skilled nursing — similar to Epic in hospitals." },
                { title: "Labor is #1 Cost & Problem", desc: "Labor is 50-60% of hospital expenses. Nursing shortage (200,000+ needed by 2030) makes workforce tech critical. Reducing agency nurse dependency by 10% saves millions annually." },
              ].map((c, i) => (
                <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
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
          {/* Value Chain */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Internet — Value Chain</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>Infrastructure enables online presence → content/commerce attracts users → monetization extracts value through ads, subscriptions, and transactions</div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {[
                { label: "Infrastructure", color: "#64748B", icon: "🌐", desc: "Enable online presence",
                  rows: [{ sub: "Domains", ex: "GoDaddy, Newfold, Namecheap" }, { sub: "Hosting", ex: "GoDaddy, Hostinger, IONOS" }, { sub: "CDN/DNS", ex: "Cloudflare, Akamai, Infoblox" }],
                  buyers: "SMBs, developers, enterprises" },
                { label: "Build & Create", color: "#3B82F6", icon: "🛠️", desc: "Create web presence",
                  rows: [{ sub: "Website Builders", ex: "Squarespace, Wix, WordPress" }, { sub: "E-Commerce", ex: "Shopify, WooCommerce, BigCommerce" }, { sub: "CMS", ex: "WordPress, Contentful, Sanity" }],
                  buyers: "SMBs, entrepreneurs, agencies" },
                { label: "Content & Commerce", color: "#10B981", icon: "🏪", desc: "Attract users & sell",
                  rows: [{ sub: "Marketplaces", ex: "Internet Brands (WebMD), Zillow" }, { sub: "Consumer Apps", ex: "Gen Digital (Norton), McAfee" }, { sub: "Content Sites", ex: "WebMD, Martindale, directories" }],
                  buyers: "Consumers, advertisers" },
                { label: "Engage & Market", color: "#F59E0B", icon: "📧", desc: "Acquire & retain users",
                  rows: [{ sub: "Email Marketing", ex: "Mailchimp, Constant Contact" }, { sub: "SMB Marketing", ex: "HubSpot, Brevo, ActiveCampaign" }, { sub: "Social/SEO", ex: "Hootsuite, Semrush, Moz" }],
                  buyers: "SMB marketing teams" },
                { label: "Monetize", color: "#8B5CF6", icon: "💰", desc: "Ads, subs & transactions",
                  rows: [{ sub: "Ad Networks", ex: "Google Ads, Meta Ads, AppLovin" }, { sub: "Mobile AdTech", ex: "Liftoff/Vungle, Unity, ironSource" }, { sub: "Subscriptions", ex: "SaaS/consumer subscription models" }],
                  buyers: "Advertisers, app developers" },
              ].map((stage, i, arr) => (
                <div key={stage.label} style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ flex: 1, background: stage.color + "0A", border: `1px solid ${stage.color}33`, borderRadius: 8, padding: "12px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}><span style={{ fontSize: 14 }}>{stage.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.label}</span></div>
                    <div style={{ fontSize: 11, color: T_.textDim, marginBottom: 10 }}>{stage.desc}</div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                      {stage.rows.map(r => (<div key={r.sub} style={{ background: T_.bg, borderRadius: 5, padding: "5px 8px" }}><div style={{ fontSize: 11, fontWeight: 600, color: stage.color }}>{r.sub}</div><div style={{ fontSize: 10, color: T_.textDim, lineHeight: 1.4 }}>{r.ex}</div></div>))}
                    </div>
                    <div style={{ fontSize: 10, color: T_.textGhost, marginTop: 8, borderTop: `1px solid ${T_.borderLight}`, paddingTop: 5 }}><span style={{ fontWeight: 600 }}>Buyers:</span> {stage.buyers}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "#EF444412", border: "1px dashed #EF444444", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>🤖</span><span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444" }}>AI Disruption Risk — Across All Layers</span></div>
              <div style={{ fontSize: 11, color: T_.textDim }}>AI search replacing directories · AI website builders · AI-generated content · AI ad optimization · ChatGPT/Perplexity reducing web traffic</div>
            </div>
            <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 12, fontStyle: "italic" }}>The internet sector in this context covers PE-owned and mid-market companies that monetize web traffic, online presence, and digital marketing — not the hyperscale platforms (Google, Meta, Amazon). Revenue models are primarily advertising, subscriptions, and lead generation.</div>
          </div>
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
          {/* ─── REVENUE MODELS ─── */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Internet Revenue Models</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How internet companies in the PE/mid-market universe make money. Unlike hyperscale platforms (Google, Meta), these companies monetize through domains, hosting subscriptions, advertising on vertical properties, and consumer security subscriptions.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Domain Registration & Hosting (Subscription)", color: "#3B82F6", icon: "🌐",
                  how: "Annual domain registration fees ($10-20/year) plus monthly/annual hosting subscriptions ($5-50/month). Domains are auto-renewing infrastructure — businesses cannot operate without them. Hosting includes server space, email, and basic tools",
                  economics: "Domain margins: 50-60% (ICANN fees are the primary cost). Hosting margins: 40-60% (infrastructure + support costs). Domain renewal rates: 85-90%+ (near-automatic). Hosting churn: 15-25% annually (SMBs are price-sensitive). Revenue is highly recurring but ARPU is low ($150-250/year)",
                  examples: "GoDaddy (~$4.3-4.6B revenue, 84M+ domains), Newfold Digital (Bluehost, HostGator, Network Solutions), Hostinger, IONOS (1&1)",
                  valuation: "3-5x revenue for hosting/domain companies. GoDaddy at ~$7-8B market cap (~1.6x revenue). Premium for domain portfolio (near-zero churn) vs hosting (high churn). The transition to commerce/payments increases ARPU and justifies higher multiples",
                  transition: "Shifting from commodity hosting to commerce enablement (payments, online store, marketing). Website builders (Squarespace, Wix, Shopify) bypass traditional hosting entirely — the structural threat to legacy hosting companies" },
                { name: "Advertising & Lead Generation", color: "#F59E0B", icon: "📣",
                  how: "Monetize web traffic through display advertising, sponsored listings, and lead generation fees. Advertisers pay per impression (CPM), per click (CPC), or per lead/action (CPA). Traffic is the raw material — more visitors = more ad revenue",
                  economics: "Gross margins: 70-85% (content costs are largely fixed). Revenue directly correlated with traffic volume and ad pricing (CPMs). Seasonal patterns (Q4 strongest for ad spend). Vulnerable to Google algorithm changes and AI search disruption",
                  examples: "Internet Brands (WebMD — pharma ads, Martindale — legal lead gen), Yelp, Zillow (real estate lead gen). Also Liftoff/Vungle (mobile ad-tech)",
                  valuation: "2-4x revenue for ad-dependent businesses. Discount relative to SaaS because revenue is less predictable and more vulnerable to platform changes. Premium for owned audience/traffic vs intermediated",
                  transition: "AI search (ChatGPT, Perplexity) is the existential threat — if users get answers directly from AI instead of visiting WebMD or directory sites, traffic-dependent revenue models collapse. Companies pivoting to vertical SaaS to reduce ad dependency" },
                { name: "Consumer Security (Auto-Renewing Subscription)", color: "#EF4444", icon: "🔐",
                  how: "Sell antivirus, identity protection, VPN, and privacy tools to consumers on annual auto-renewing subscriptions. Priced at $30-150/year per household. Acquired through OEM preloads (new PC trial → paid conversion), direct marketing, and ISP partnerships",
                  economics: "Gross margins: 80-85%. Auto-renewal retention: 70-80%. OEM preload conversion: 15-25%. High customer acquisition cost offset by multi-year retention. Identity protection (LifeLock, $150+/year) has higher ARPU than basic antivirus ($30-50/year)",
                  examples: "Gen Digital (Norton/LifeLock/Avast — ~$3.8B revenue, 500M+ users, 65M+ paid), McAfee (~$1.8-2B, 25M+ paid subscribers)",
                  valuation: "3-5x revenue. Gen Digital at ~$15-18B market cap. Valued on subscriber count, ARPU trends, and retention. Identity protection growing faster than antivirus — shifts the ARPU mix higher",
                  transition: "Windows Defender commoditizing basic antivirus. Growth comes from identity protection and 'digital safety' bundles (VPN, dark web monitoring, privacy tools) that command higher ARPU. AI-generated scams increasing consumer threat awareness — potential demand driver" },
                { name: "SMB Marketing SaaS (Per-Contact Subscription)", color: "#10B981", icon: "📧",
                  how: "Monthly/annual subscriptions for email marketing, marketing automation, and digital marketing tools. Priced by contact list size — more contacts = higher tier. Revenue recognized ratably. SMBs use these to communicate with customers and drive repeat business",
                  economics: "Gross margins: 65-75%. Churn: 3-5% monthly for SMB (high — small businesses fail or switch frequently). Revenue per customer: $300-1,500/year. Land-and-expand as contact lists grow. Freemium-to-paid conversion for low-end (Mailchimp free tier)",
                  examples: "Mailchimp/Intuit (~$1.5B revenue, dominant via free tier), Constant Contact (~$400-500M), HubSpot (SMB tier), Klaviyo (~$900M, e-commerce focused), Brevo (Sendinblue), ActiveCampaign",
                  valuation: "4-8x revenue for SMB marketing SaaS. Mailchimp acquired by Intuit for $12B (~8x revenue). Constant Contact likely valued at $2-3B. Premium for low churn and ARPU expansion; discount for high SMB churn rates",
                  transition: "AI-generated email content and personalization becoming table stakes. Mailchimp (Intuit) dominant through free tier. The competitive moat is the contact database and sending reputation — hard for new entrants to replicate at scale" },
                { name: "Mobile Ad-Tech (Performance-Based)", color: "#8B5CF6", icon: "📱",
                  how: "Help mobile app developers acquire users (demand side) and monetize through in-app ads (supply side). Revenue from performance fees — per install (CPI), per action (CPA), or per impression (CPM). ML algorithms optimize ad targeting and bidding in real-time",
                  economics: "Gross margins: 30-50% (significant ad inventory costs). Revenue scales with mobile ad spending. Apple ATT privacy changes (2021) permanently reduced targeting precision — required rebuilding attribution models. Seasonal (Q4 holiday gaming installs strongest)",
                  examples: "AppLovin (~$4B revenue, dominant), Liftoff/Vungle (~$500-800M), Unity Ads, ironSource (now Unity), Digital Turbine, Moloco",
                  valuation: "5-15x EBITDA. AppLovin re-rated dramatically (stock up 700%+ in 2024) on AI-powered ad optimization. Premium for proprietary ML and owned demand. Discount for intermediary-only models without owned inventory",
                  transition: "AI/ML is the differentiator — companies with better ad optimization algorithms win disproportionate share. AppLovin's AXON engine proved that superior ML can drive outsized returns. First-party data becoming critical as third-party tracking disappears" }
              ].map((model, i) => (
                <div key={i} style={{ background: T_.bg, borderRadius: 10, border: `1px solid ${model.color}33`, borderLeft: `4px solid ${model.color}`, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{model.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: model.color }}>{model.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>How It Works</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.how}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Unit Economics</div>
                      <div style={{ fontSize: 13, color: T_.text, lineHeight: 1.6 }}>{model.economics}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Examples</div>
                      <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{model.examples}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Valuation Impact</div>
                      <div style={{ fontSize: 13, color: T_.green, lineHeight: 1.6 }}>{model.valuation}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Transition Dynamics</div>
                    <div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.6 }}>{model.transition}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Key Concepts */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { title: "Traffic = Revenue", desc: "Internet businesses monetize through traffic → ads/leads/subscriptions. Any disruption to traffic (Google algorithm changes, AI search, Apple privacy) directly impacts revenue. WebMD, Martindale, and directories are especially vulnerable to AI search cannibalization." },
                { title: "Domain = Infrastructure", desc: "Domains are the one truly non-discretionary internet product — businesses cannot exist online without them. Renewal rates are near-automatic (95%+). GoDaddy manages 84M+ domains. This is the cash cow that funds everything else." },
                { title: "All-in-One Builders vs Traditional Hosting", desc: "Squarespace, Wix, and Shopify offer complete online presence solutions that bypass traditional domain + hosting. This structural shift threatens GoDaddy, Newfold, and legacy hosting. The SMB who would have bought hosting 5 years ago now goes directly to Squarespace." },
                { title: "Consumer Security = Fear-Based Recurring", desc: "Norton/LifeLock and McAfee sell protection against threats consumers can't evaluate — identity theft, viruses, scams. The value prop is peace of mind. Auto-renewing subscriptions with 70-80% retention. Windows Defender commoditizing the low end." },
              ].map((c, i) => (
                <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        
        </div>);
      })()}

      {subTab === "education" && (() => {
        const ED_SUBS = {
          k12sis: { name: "K-12 SIS & Admin", fullName: "K-12 Student Information Systems & Administration", category: "K-12 Software", color: "#3B82F6",
            tam: "$8-10B (2025)", growth: "~8-10% CAGR", icon: "🏫",
            desc: "Software managing student records, enrollment, attendance, grading, scheduling, and district administration for K-12 schools and districts.",
            whatTheySell: "Student information systems (SIS), enrollment management, grade books, attendance tracking, parent portals, district data analytics, state reporting",
            whoBuys: "School districts, superintendents, IT directors, registrars. Procurement is highly influenced by state mandates and funding cycles (ESSER, Title I)",
            keyPlayers: ["PowerSchool (Vista Equity)", "Infinite Campus", "Skyward (Roper Technologies)", "Illuminate Education", "Frontline Education (Roper)", "Tyler Technologies (school ERP)"],
            trends: "PowerSchool dominates with ~40-50M student records. Consolidation under PE (Vista, Roper). Federal ESSER funding winding down creating budget pressure. AI for early warning systems and student outcomes.",
          },
          k12lms: { name: "K-12 LMS & Curriculum", fullName: "K-12 Learning Management & Digital Curriculum", category: "K-12 Software", color: "#3B82F6",
            tam: "$6-8B (2025)", growth: "~10-12% CAGR", icon: "📚",
            desc: "Platforms for delivering digital curriculum, managing assignments, assessments, and personalized learning in K-12 classrooms. Surged post-COVID.",
            whatTheySell: "Learning management systems, digital textbooks, adaptive learning platforms, assessment tools, content authoring, classroom collaboration",
            whoBuys: "Teachers, curriculum directors, district CTOs. Adoption driven by state standards alignment and 1:1 device initiatives",
            keyPlayers: ["Canvas (Instructure/Thoma Bravo)", "Google Classroom", "Schoology (PowerSchool)", "Clever (connecting apps)", "Newsela", "IXL Learning", "Khan Academy (nonprofit)"],
            trends: "Google Classroom and Canvas dominate. Clever has become the SSO/integration standard for K-12 edtech. AI-powered adaptive learning gaining traction. Post-COVID adoption permanent but growth normalizing.",
          },
          higher: { name: "Higher Ed Software", fullName: "Higher Education Technology", category: "Higher Education", color: "#8B5CF6",
            tam: "$12-15B (2025)", growth: "~9-11% CAGR", icon: "🎓",
            desc: "Software for colleges and universities covering student lifecycle, enrollment management, financials, research administration, and online program management.",
            whatTheySell: "SIS, CRM for enrollment, ERP/financials, LMS, online program management (OPM), student success/retention platforms, research grant management",
            whoBuys: "University CIOs, provosts, enrollment VPs, CFOs. Decision-making is slow, committee-driven, and budget-constrained",
            keyPlayers: ["Ellucian (Vista Equity)", "Workday Student", "Oracle Student Cloud", "Anthology (Blackboard + Campus Management)", "Salesforce Education Cloud", "Instructure (Canvas)", "2U/edX"],
            trends: "Ellucian dominates legacy SIS (Banner/Colleague) but cloud migration is slow. Workday and Oracle competing for cloud ERP modernization. OPM market under pressure (2U struggles). Enrollment cliff (demographics) hitting regional schools hard.",
          },
          corporate: { name: "Corporate L&D", fullName: "Corporate Learning & Development", category: "Corporate Training", color: "#10B981",
            tam: "$15-20B (2025)", growth: "~12-15% CAGR", icon: "💼",
            desc: "Platforms for employee training, upskilling, compliance, and professional development. Spans LMS, content marketplaces, and skills assessment.",
            whatTheySell: "Learning management systems (LMS), learning experience platforms (LXP), compliance training content, skills assessment, virtual labs, coaching platforms",
            whoBuys: "CHROs, L&D directors, compliance officers. Enterprise-wide procurement. Compliance training is non-discretionary.",
            keyPlayers: ["Cornerstone OnDemand (Clearlake)", "SAP Litmos", "Docebo", "Degreed", "Coursera for Business", "LinkedIn Learning (Microsoft)", "Udemy Business", "Skillsoft (Thoma Bravo)"],
            trends: "AI-powered personalized learning paths. Skills-based learning replacing role-based. LinkedIn Learning leveraging Microsoft distribution. Compliance training growing with regulatory burden. LXP vs LMS debate (LXP = Netflix-style discovery).",
          },
          opm: { name: "OPM & Online Learning", fullName: "Online Program Management & Direct-to-Consumer Learning", category: "Online Learning", color: "#F59E0B",
            tam: "$10-12B (2025)", growth: "~8-12% CAGR", icon: "🌐",
            desc: "Companies that partner with universities to build and manage online degree programs, plus consumer-facing platforms for certificates, bootcamps, and professional education.",
            whatTheySell: "Online degree program management, student marketing/enrollment, course platform infrastructure, certificates and micro-credentials, bootcamps",
            whoBuys: "University deans and continuing education divisions (OPM). Individual learners and employers (DTC). Government workforce development programs",
            keyPlayers: ["2U/edX (PE-backed post-restructuring)", "Coursera (NYSE: COUR)", "Udemy", "Pluralsight (Vista Equity)", "Noodle Partners", "Keypath Education"],
            trends: "OPM revenue-share model under pressure as universities insource and DOE scrutinizes bundled services. Coursera and Udemy shifting to enterprise/B2B. AI certificates and GenAI courses driving short-term demand. Bootcamp market consolidating after 2022 bust.",
          },
          assess: { name: "Assessment & Testing", fullName: "Educational Assessment & Standardized Testing", category: "Assessment", color: "#0EA5E9",
            tam: "$5-7B (2025)", growth: "~6-8% CAGR", icon: "📝",
            desc: "Companies providing standardized testing, formative assessment, certification exams, and psychometric services for K-12, higher ed, and professional licensure.",
            whatTheySell: "Standardized test development and administration, formative assessment platforms, test delivery infrastructure, psychometrics, certification exam management",
            whoBuys: "State education agencies, school districts, professional licensing boards, certification bodies, universities",
            keyPlayers: ["Pearson (assessments division)", "ETS (nonprofit, SAT/GRE)", "Prometric (owned by ETS)", "ACT Inc (nonprofit)", "NWEA (MAP assessments)", "Cambium Assessment (CAI)", "PSI Services (Apax Partners)"],
            trends: "Remote/online proctoring adoption post-COVID permanent for professional exams. AI-powered item generation and adaptive testing. Test-optional movement in college admissions pressuring SAT/ACT volume. Formative (ongoing) assessment growing vs summative (end-of-year).",
          },
          edtic: { name: "EdTech Infrastructure", fullName: "Education IT Infrastructure & Services", category: "Infrastructure", color: "#64748B",
            tam: "$20-25B (2025)", growth: "~6-8% CAGR", icon: "🖥️",
            desc: "Hardware, networking, device management, and IT services specifically for schools and universities. The physical and digital infrastructure enabling edtech.",
            whatTheySell: "Chromebooks and devices, campus networking (Wi-Fi), device management (MDM), school cybersecurity, cloud hosting, IT managed services for education",
            whoBuys: "School and university IT departments, CTOs. State and federal E-Rate funding programs subsidize connectivity and hardware",
            keyPlayers: ["Google (Chromebook ecosystem)", "Apple (iPad + Apple School Manager)", "Cisco Meraki (campus networking)", "CDW-G (education reseller)", "Jamf (Apple MDM)", "Lightspeed Systems (filtering/safety)"],
            trends: "Chromebooks dominate K-12 (60%+ share). E-Rate funding sustains school networking spend. Student safety and content filtering mandated in many states. 1:1 device programs now standard. Cybersecurity for schools becoming critical.",
          },
        };
        const ED_TAX = [
          { key: "k12", label: "K-12 Education", color: "#3B82F6", icon: "🏫", children: ["k12sis","k12lms"] },
          { key: "highered", label: "Higher Education", color: "#8B5CF6", icon: "🎓", children: ["higher"] },
          { key: "corplearn", label: "Corporate Learning & Development", color: "#10B981", icon: "💼", children: ["corporate"] },
          { key: "online", label: "Online Learning & OPM", color: "#F59E0B", icon: "🌐", children: ["opm"] },
          { key: "assessments", label: "Assessment & Testing", color: "#0EA5E9", icon: "📝", children: ["assess"] },
          { key: "infra", label: "Education IT Infrastructure", color: "#64748B", icon: "🖥️", children: ["edtic"] },
        ];
        const ED_REVMODELS = [
          { model: "SaaS Subscription (Per-Student/Per-Seat)", desc: "Dominant model in K-12 and higher ed SIS/LMS. Districts and universities pay per-student or per-user annually. High retention due to switching costs. PowerSchool, Ellucian, Canvas.", color: "#3B82F6" },
          { model: "Freemium / Ad-Supported", desc: "Consumer and K-12 platforms offer free tiers (Google Classroom, Khan Academy, Duolingo) to build adoption, then monetize via premium features, enterprise sales, or advertising.", color: "#10B981" },
          { model: "Revenue Share (OPM)", desc: "Online program managers take 40-60% of tuition revenue in exchange for marketing, enrollment, platform, and student support. Model under DOE scrutiny and university pushback. 2U, Keypath, Noodle.", color: "#F59E0B" },
          { model: "Content Licensing & Marketplace", desc: "Publishers and content platforms sell or license digital curriculum, textbooks, and training content. Moving from one-time purchase to subscription. Pearson, McGraw-Hill, Cengage, Udemy, LinkedIn Learning.", color: "#8B5CF6" },
          { model: "Per-Exam / Per-Certification", desc: "Assessment companies charge per test administered or per certification issued. Prometric, PSI, Pearson VUE. Stable recurring demand driven by professional licensing requirements.", color: "#0EA5E9" },
          { model: "Government-Funded / Grant-Dependent", desc: "Significant portion of education spending is government-funded (E-Rate, ESSER, Title I, Pell Grants). Budget cycles and policy changes create demand volatility. ESSER cliff in 2024-2025 is a near-term headwind.", color: "#EF4444" },
        ];
        const ED_KEYCONCEPTS = [
          { term: "ESSER Funding Cliff", def: "Elementary and Secondary School Emergency Relief funds (~$190B total) from COVID stimulus. Must be obligated by Sep 2024. As funds expire, districts face significant budget pressure, directly impacting edtech procurement." },
          { term: "Enrollment Cliff (Higher Ed)", def: "Projected ~15% decline in traditional college-age students starting ~2025 due to post-2008 birth rate decline. Hits regional/less-selective schools hardest. Drives demand for enrollment management tech and online programs." },
          { term: "E-Rate Program", def: "FCC program providing $2-4B annually in discounts for school/library broadband and networking. The primary funding mechanism for K-12 IT infrastructure. Stable but subject to political appropriations." },
          { term: "OPM (Online Program Management)", def: "Third-party companies that partner with universities to recruit students, build/run online degree programs, and provide platform infrastructure in exchange for tuition revenue share (typically 40-60%). DOE investigating whether this constitutes improper incentive compensation." },
          { term: "1:1 Device Programs", def: "Policy of providing every student with a personal computing device (typically Chromebook). Now standard in most US K-12 districts post-COVID. Creates captive ecosystem for software and management tools." },
          { term: "LMS vs LXP", def: "LMS (Learning Management System) = structured, admin-driven, compliance-focused (Canvas, Blackboard, Cornerstone). LXP (Learning Experience Platform) = learner-driven, Netflix-style discovery, skills-focused (Degreed, EdCast). Market trending toward convergence." },
          { term: "Adaptive Learning", def: "AI/algorithm-driven instruction that adjusts content difficulty and pacing based on individual student performance. IXL, DreamBox, ALEKS (McGraw-Hill). Evidence of efficacy is mixed but adoption growing." },
          { term: "Micro-Credentials / Stackable Certificates", def: "Short-form credentials (Google Career Certificates, Coursera Professional Certificates, university micro-masters) that can be stacked toward a degree. Growing alternative to traditional 4-year programs. Employer recognition still nascent." },
        ];
        return (
        <div>
          <div style={{ marginBottom: 24 }}><div style={{ fontSize: 22, fontWeight: 500, color: T_.text }}>Education & Education Services Primer</div><div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>K-12, higher ed, corporate learning, online platforms, assessment, and infrastructure</div></div>
          {/* Value Chain */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Education Ecosystem — Value Chain</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From infrastructure through content delivery to the learner. Each layer enables the next.</div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              {[
                { label: "Infrastructure & Devices", color: "#64748B", icon: "🖥️", desc: "Physical and digital foundation",
                  rows: [{ sub: "Devices", ex: "Chromebooks, iPads, laptops" }, { sub: "Connectivity", ex: "Campus Wi-Fi, broadband (E-Rate)" }, { sub: "MDM & Security", ex: "Jamf, Lightspeed, GoGuardian" }],
                  buyers: "School/university IT departments" },
                { label: "Platform & Admin", color: "#3B82F6", icon: "🏫", desc: "Systems of record",
                  rows: [{ sub: "SIS / ERP", ex: "PowerSchool, Ellucian, Infinite Campus" }, { sub: "LMS", ex: "Canvas, Google Classroom, Blackboard" }, { sub: "Integration", ex: "Clever (SSO/rostering), ClassLink" }],
                  buyers: "IT directors, registrars, admins" },
                { label: "Content & Curriculum", color: "#8B5CF6", icon: "📚", desc: "What students learn",
                  rows: [{ sub: "Publishers", ex: "Pearson, McGraw-Hill, Cengage" }, { sub: "Digital Curriculum", ex: "Newsela, IXL, Khan Academy" }, { sub: "Corporate Content", ex: "LinkedIn Learning, Udemy, Skillsoft" }],
                  buyers: "Curriculum directors, L&D teams" },
                { label: "Assessment & Analytics", color: "#0EA5E9", icon: "📝", desc: "Measuring outcomes",
                  rows: [{ sub: "Summative", ex: "ETS, ACT, NWEA, Pearson" }, { sub: "Formative", ex: "Edulastic, Illuminate, MasteryConnect" }, { sub: "Analytics", ex: "Tableau for Ed, BrightBytes, Civitas" }],
                  buyers: "State agencies, testing directors" },
                { label: "Online & OPM", color: "#F59E0B", icon: "🌐", desc: "Alternative delivery",
                  rows: [{ sub: "OPM", ex: "2U/edX, Noodle, Keypath" }, { sub: "DTC Platforms", ex: "Coursera, Udemy, Pluralsight" }, { sub: "Bootcamps", ex: "General Assembly, Flatiron" }],
                  buyers: "University deans, individual learners" },
                { label: "Learners & Employers", color: "#10B981", icon: "👥", desc: "End consumers",
                  rows: [{ sub: "K-12 Students", ex: "~50M in US public schools" }, { sub: "Higher Ed", ex: "~20M enrolled in US colleges" }, { sub: "Workforce", ex: "Employers funding upskilling" }],
                  buyers: "Students, parents, HR/L&D" },
              ].map((stage, i, arr) => (
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
                  {i < arr.length - 1 && <div style={{ display: "flex", alignItems: "center", padding: "0 4px", color: T_.textGhost, fontSize: 16, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "#EF444412", border: "1px dashed #EF444444", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444" }}>ESSER Cliff — Near-Term Budget Headwind</span>
              </div>
              <div style={{ fontSize: 11, color: T_.textDim }}>$190B in COVID stimulus for K-12 expiring 2024-2025. Districts face 10-20% budget gaps. Directly impacts edtech procurement and staffing.</div>
            </div>
            <div style={{ marginTop: 4, background: "#F59E0B12", border: "1px dashed #F59E0B44", borderRadius: 6, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🧠</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>AI — Disrupting Content, Assessment & Tutoring</span>
              </div>
              <div style={{ fontSize: 11, color: T_.textDim }}>GenAI tutoring (Khanmigo), AI-generated assessments, automated grading, adaptive learning. Academic integrity concerns (cheating) creating demand for detection tools.</div>
            </div>
          </div>

          {/* Taxonomy Tree */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Education Taxonomy</div>
            <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ED_TAX.map(cat => (
                <div key={cat.key}>
                  <div onClick={() => toggle("edtax_" + cat.key)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                    background: isExp("edtax_" + cat.key) ? cat.color + "22" : T_.bg,
                    borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("edtax_" + cat.key) ? cat.color + "44" : T_.border}`,
                    transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsectors</span>
                    <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("edtax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </div>
                  {isExp("edtax_" + cat.key) && (
                    <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                      {cat.children.map(childKey => {
                        const sub = ED_SUBS[childKey];
                        if (!sub) return null;
                        return (
                          <div key={childKey} onClick={() => toggle("edsub_" + childKey)} style={{
                            background: isExp("edsub_" + childKey) ? sub.color + "15" : T_.bg,
                            borderRadius: 8, padding: "12px 16px", cursor: "pointer",
                            border: `1px solid ${isExp("edsub_" + childKey) ? sub.color + "44" : T_.borderLight}`,
                            transition: "all 0.15s",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 16 }}>{sub.icon}</span>
                              <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                              <span style={{ fontSize: 12, color: T_.textGhost }}>{sub.tam}</span>
                              <span style={{ fontSize: 12, color: T_.green, fontWeight: 600 }}>{sub.growth}</span>
                              <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("edsub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                            </div>
                            {isExp("edsub_" + childKey) && <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                              <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.5 }}>{sub.desc}</div>
                              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>What They Sell</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.5 }}>{sub.whatTheySell}</div></div>
                              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Who Buys</div><div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.5 }}>{sub.whoBuys}</div></div>
                              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Players</div><div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{sub.keyPlayers.map(p => <span key={p} style={{ fontSize: 12, background: sub.color + "22", color: sub.color, padding: "3px 10px", borderRadius: 20, border: `1px solid ${sub.color}33`, fontWeight: 500 }}>{p}</span>)}</div></div>
                              <div><div style={{ fontSize: 11, color: T_.textGhost, textTransform: "uppercase", marginBottom: 4 }}>Key Trends</div><div style={{ fontSize: 13, color: T_.amber, lineHeight: 1.5 }}>{sub.trends}</div></div>
                            </div>
                            }
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TAM Overview Grid */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Subsector Overview — TAM & Growth</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {Object.entries(ED_SUBS).map(([key, sub]) => (
                <div key={key} style={{ padding: "12px 14px", background: T_.bg, borderRadius: 8, border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer" }} onClick={() => { const cat = ED_TAX.find(t => t.children.includes(key)); if (cat) setExpanded(prev => ({ ...prev, ["edtax_" + cat.key]: true, ["edsub_" + key]: true })); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 14 }}>{sub.icon}</span><span style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.name}</span></div>
                  <div style={{ fontSize: 12, color: T_.textDim, marginBottom: 6 }}>{sub.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>TAM</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.text }}>{sub.tam}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: T_.textGhost, textTransform: "uppercase" }}>Growth</div><div style={{ fontSize: 16, fontWeight: 700, color: T_.green }}>{sub.growth}</div></div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Models */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Revenue Models in Education</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
              {ED_REVMODELS.map(rm => (
                <div key={rm.model} style={{ background: T_.bg, borderRadius: 8, padding: "14px 16px", border: `1px solid ${rm.color}33`, borderLeft: `3px solid ${rm.color}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: rm.color, marginBottom: 6 }}>{rm.model}</div>
                  <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.5 }}>{rm.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Concepts */}
          <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
              {ED_KEYCONCEPTS.map(kc => (
                <div key={kc.term} style={{ background: T_.bg, borderRadius: 8, padding: "14px 16px", border: `1px solid ${T_.border}` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 6 }}>{kc.term}</div>
                  <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.5 }}>{kc.def}</div>
                </div>
              ))}
            </div>
          </div>

        </div>);
      })()}
    </div>
  );
}
