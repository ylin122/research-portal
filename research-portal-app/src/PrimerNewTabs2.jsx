// ─── PrimerNewTabs2.jsx ──────────────────────────────
// Additional industry primer tabs: Healthcare & Pharma, Healthcare Services,
// Energy & Materials, Real Estate, Utilities, IT Services & BPO

export default function PrimerNewTabs2({ subTab, expanded, toggle, isExp, T_, FONT }) {

  // ═══════════════════════════════════════════════════════
  // 1. HEALTHCARE & PHARMA
  // ═══════════════════════════════════════════════════════
  if (subTab === "healthpharma") {
    const HP_SUBS = {
      bigpharma: { name: "Big Pharma & Specialty", fullName: "Pharmaceutical — Large Cap & Specialty Pharma", category: "Pharmaceutical", color: "#3B82F6",
        tam: "$650B+ (2025)", growth: "~5-7% CAGR", icon: "💊",
        desc: "Large diversified pharmaceutical companies with broad therapeutic portfolios, global commercial infrastructure, and deep pipelines. Revenue driven by patented branded drugs with limited competition during patent life.",
        whatTheySell: "Patented branded drugs across oncology, immunology, cardiovascular, neuroscience, rare disease, vaccines. Also OTC/consumer health in some cases.",
        whoBuys: "Hospitals, pharmacies, PBMs, health systems, governments (public health), patients (via insurance). Payers negotiate formulary placement.",
        keyPlayers: ["Pfizer", "Johnson & Johnson (Innovative Medicine)", "Roche", "Novartis", "Merck & Co", "AbbVie", "Eli Lilly", "AstraZeneca", "Novo Nordisk", "Sanofi"],
        trends: "GLP-1 blockbusters reshaping market (Lilly, Novo). Oncology remains largest therapeutic area (~$220B). Patent cliffs ahead for Humira, Keytruda. M&A to fill pipelines. AI in drug discovery accelerating.",
      },
      biotech: { name: "Biotechnology", fullName: "Biotechnology — Emerging & Mid-Cap Biotech", category: "Biotechnology", color: "#8B5CF6",
        tam: "$180B+ (2025)", growth: "~8-12% CAGR", icon: "🧬",
        desc: "Companies developing biologic therapies (antibodies, gene/cell therapies, mRNA, ADCs) often with focused pipelines. High-risk/high-reward profile with binary clinical trial outcomes.",
        whatTheySell: "Biologic drugs (monoclonal antibodies, bispecifics, ADCs, gene therapies, cell therapies, mRNA therapeutics, RNAi). Many are pre-revenue with pipeline value.",
        whoBuys: "Hospital systems, specialty pharmacies, oncology centers, rare disease clinics. Payers/PBMs for reimbursement decisions.",
        keyPlayers: ["Amgen", "Gilead Sciences", "Regeneron", "Vertex Pharmaceuticals", "Moderna", "BioNTech", "Alnylam", "Seagen (Pfizer)", "Argenx"],
        trends: "ADCs (antibody-drug conjugates) booming. Gene therapy moving from rare to common diseases. GLP-1/obesity pipeline expanding. Biotech M&A wave as big pharma buys innovation. XBI index recovery in 2025.",
      },
      meddev: { name: "Medical Devices & Equipment", fullName: "Medical Devices, Diagnostics & Equipment", category: "Medical Devices", color: "#10B981",
        tam: "$550B+ (2025)", growth: "~5-7% CAGR", icon: "🩺",
        desc: "Companies manufacturing surgical instruments, implants, diagnostic equipment, imaging systems, and monitoring devices used in hospitals and ambulatory settings.",
        whatTheySell: "Surgical robots, orthopedic implants, cardiac devices (pacemakers, stents), in-vitro diagnostics (IVD), imaging (MRI, CT, ultrasound), patient monitoring, diabetes devices (CGM, pumps).",
        whoBuys: "Hospital systems, ambulatory surgery centers (ASCs), physician offices, clinical labs, patients (consumer health devices).",
        keyPlayers: ["Medtronic", "Abbott Laboratories", "Boston Scientific", "Intuitive Surgical", "Stryker", "Becton Dickinson", "Edwards Lifesciences", "Dexcom", "Siemens Healthineers", "GE HealthCare"],
        trends: "Robotic surgery expanding beyond da Vinci (Medtronic Hugo, J&J Ottava). CGM market growing 20%+ (Dexcom, Abbott). AI-powered diagnostics. Procedure volumes recovered and growing post-COVID.",
      },
      cro: { name: "Contract Research (CRO)", fullName: "Contract Research Organizations", category: "Services", color: "#F59E0B",
        tam: "$85B+ (2025)", growth: "~7-10% CAGR", icon: "🔬",
        desc: "Outsourced providers of clinical trial management, bioanalytical testing, regulatory consulting, and pharmacovigilance. Essential partners for pharma/biotech R&D.",
        whatTheySell: "Phase I-IV clinical trial management, site management, data management/biostatistics, regulatory submissions, real-world evidence, pharmacovigilance, central lab services.",
        whoBuys: "Big pharma, mid-cap/emerging biotech, medical device companies. Outsourced ~50%+ of total R&D spend.",
        keyPlayers: ["IQVIA", "Charles River Laboratories", "Labcorp Drug Development", "PPD (Thermo Fisher)", "ICON plc", "Syneos Health", "Medpace", "Parexel"],
        trends: "Biotech funding recovery driving CRO demand. Decentralized clinical trials (DCTs). AI for patient recruitment and site selection. FSP (functional service provider) model growing vs full-service.",
      },
      cdmo: { name: "Contract Manufacturing (CDMO)", fullName: "Contract Development & Manufacturing Organizations", category: "Services", color: "#F59E0B",
        tam: "$120B+ (2025)", growth: "~8-11% CAGR", icon: "🏭",
        desc: "Outsourced drug substance and drug product manufacturing for pharma/biotech. Includes process development, scale-up, and commercial supply across small molecule, biologics, and cell/gene therapy.",
        whatTheySell: "API synthesis (small molecule), biologics manufacturing (mAbs, ADCs), cell/gene therapy manufacturing, fill-finish, formulation development, sterile injectables.",
        whoBuys: "Pharma companies (to avoid capex), biotech (lack own manufacturing), generics makers, gene therapy developers.",
        keyPlayers: ["Lonza", "Samsung Biologics", "WuXi Biologics", "Catalent (Novo Holdings)", "Thermo Fisher (Patheon)", "Fujifilm Diosynth", "AGC Biologics"],
        trends: "Biologics CDMO growing faster than small molecule. ADC manufacturing is bottleneck. GLP-1 demand straining capacity. Onshoring/friendshoring post-COVID. WuXi under scrutiny re: geopolitics.",
      },
      animalhealth: { name: "Animal Health", fullName: "Animal Health & Veterinary", category: "Animal Health", color: "#84CC16",
        tam: "$45B+ (2025)", growth: "~6-8% CAGR", icon: "🐾",
        desc: "Pharmaceuticals, vaccines, diagnostics, and technology for companion animals (pets) and livestock/production animals.",
        whatTheySell: "Parasiticides, vaccines, antibiotics, pain management, diagnostics, monitoring technology, pet insurance-linked products.",
        whoBuys: "Veterinary clinics, pet owners, livestock producers, animal hospitals, agricultural operations.",
        keyPlayers: ["Zoetis (dominant — ~30% share)", "Elanco Animal Health", "Boehringer Ingelheim (Animal Health)", "Merck Animal Health", "IDEXX (diagnostics)"],
        trends: "Pet humanization trend driving companion animal spend. Zoetis dominance growing. Librela (pain) and Solensia blockbusters. Diagnostics at point-of-care growing. Livestock segment under pressure from sustainability.",
      },
      generics: { name: "Generic & Biosimilar", fullName: "Generic Pharmaceuticals & Biosimilars", category: "Generics", color: "#6366F1",
        tam: "$250B+ (2025)", growth: "~4-6% CAGR", icon: "💉",
        desc: "Off-patent copies of branded drugs (small molecule generics) and near-copies of biologic drugs (biosimilars). Lower prices, higher volumes, thinner margins.",
        whatTheySell: "Generic small molecule drugs, complex generics (injectables, inhalers), biosimilars (adalimumab, rituximab, bevacizumab), 505(b)(2) products.",
        whoBuys: "Pharmacies, hospitals, PBMs, government health programs (Medicare/Medicaid), patients seeking lower-cost alternatives.",
        keyPlayers: ["Teva Pharmaceutical", "Sandoz (Novartis spin-off)", "Viatris", "Hikma", "Sun Pharma", "Dr. Reddy's", "Fresenius Kabi (biosimilars)", "Amneal"],
        trends: "Humira biosimilar wave ($20B market opened). Biosimilar penetration accelerating in US. Pricing pressure on generics continues. Complex generics (injectables, inhalers) offer better margins. 505(b)(2) pathway attractive.",
      },
    };
    const HP_TAX = [
      { key: "pharma", label: "Pharmaceutical", color: "#3B82F6", icon: "💊", children: ["bigpharma"] },
      { key: "biotech", label: "Biotechnology", color: "#8B5CF6", icon: "🧬", children: ["biotech"] },
      { key: "devices", label: "Medical Devices", color: "#10B981", icon: "🩺", children: ["meddev"] },
      { key: "services", label: "CRO & CDMO Services", color: "#F59E0B", icon: "🔬", children: ["cro", "cdmo"] },
      { key: "animal", label: "Animal Health", color: "#84CC16", icon: "🐾", children: ["animalhealth"] },
      { key: "generics", label: "Generics & Biosimilars", color: "#6366F1", icon: "💉", children: ["generics"] },
    ];
    const HP_VALUE_CHAIN = [
      { label: "Discovery / R&D", color: "#8B5CF6", icon: "🧪", desc: "Target ID & lead optimization", rows: [{ sub: "Target Discovery", ex: "Academic labs, AI platforms" }, { sub: "Lead Optimization", ex: "Medicinal chemistry, CADD" }, { sub: "Preclinical", ex: "Charles River, Covance" }], buyers: "Pharma R&D, biotech, academic centers" },
      { label: "Clinical Trials / CRO", color: "#F59E0B", icon: "🔬", desc: "Phase I-III human testing", rows: [{ sub: "Phase I (Safety)", ex: "IQVIA, Medpace, ICON" }, { sub: "Phase II (Efficacy)", ex: "PPD, Parexel, Syneos" }, { sub: "Phase III (Pivotal)", ex: "IQVIA, Labcorp, ICON" }], buyers: "Pharma/biotech sponsors" },
      { label: "Regulatory / Approval", color: "#EF4444", icon: "📋", desc: "FDA/EMA review & approval", rows: [{ sub: "NDA / BLA Filing", ex: "FDA CDER, CBER" }, { sub: "510(k) / PMA", ex: "FDA CDRH (devices)" }, { sub: "EMA / ROW", ex: "EMA, PMDA, NMPA" }], buyers: "Pharma, biotech, medtech companies" },
      { label: "Manufacturing / CDMO", color: "#10B981", icon: "🏭", desc: "Drug substance & product mfg", rows: [{ sub: "Small Molecule", ex: "Lonza, Catalent, Patheon" }, { sub: "Biologics", ex: "Samsung Bio, WuXi, Fujifilm" }, { sub: "Cell & Gene", ex: "Lonza, Catalent, AGC" }], buyers: "Pharma companies, biotech" },
      { label: "Distribution", color: "#0EA5E9", icon: "🚚", desc: "Wholesale & specialty distribution", rows: [{ sub: "Wholesale", ex: "McKesson, AmerisourceBergen" }, { sub: "Specialty", ex: "ASD (AmerisourceBergen)" }, { sub: "PBM", ex: "CVS Caremark, Express Scripts, OptumRx" }], buyers: "Pharmacies, hospitals, payers" },
      { label: "Providers / Patients", color: "#6366F1", icon: "🏥", desc: "Prescribing & consumption", rows: [{ sub: "Hospitals", ex: "HCA, CommonSpirit, Ascension" }, { sub: "Physicians", ex: "Oncologists, PCPs, specialists" }, { sub: "Pharmacies", ex: "CVS, Walgreens, Amazon Pharmacy" }], buyers: "Patients, health systems" },
    ];
    const HP_REV_MODELS = [
      { name: "Branded Drug Sales (Patent-Protected)", color: "#3B82F6", icon: "💊",
        how: "Revenue from patented drugs with market exclusivity. Pricing power is high during patent life (typically 10-15 years from filing, ~7-10 years of commercial life). Revenue recognized on product shipment. Gross-to-net deductions for rebates, chargebacks, and co-pay assistance can be 40-60% of list price.",
        economics: "Gross margins: 80-90%. R&D investment: 15-25% of revenue. Sales & marketing: 20-30%. Peak sales for blockbusters: $5-20B+ annually (Humira peaked at $21B). Patent cliff creates sharp revenue decline at LOE.",
        examples: "Keytruda (Merck, ~$25B), Ozempic/Wegovy (Novo Nordisk, ~$30B), Humira (AbbVie, peaked $21B), Eliquis (BMS/Pfizer, ~$12B), Dupixent (Sanofi/Regeneron, ~$13B)",
        valuation: "Sum-of-the-parts: DCF each drug individually + pipeline risk-adjusted NPV. Typically 12-18x forward P/E. Pipeline value can be 30-50% of total enterprise value for growth pharma. Patent cliffs create valuation overhangs.",
        transition: "Branded → generic/biosimilar competition at LOE. Companies must continuously refill pipeline via internal R&D or M&A. Life cycle management strategies: new formulations, indications, combinations.",
      },
      { name: "Generic / Biosimilar", color: "#6366F1", icon: "💉",
        how: "Off-patent drug copies sold at 70-90% discount to branded. ANDA pathway for small molecule generics, 351(k) pathway for biosimilars. Revenue depends on market share capture at launch. Multiple competitors compress pricing over time.",
        economics: "Gross margins: 40-60% (generics), 50-70% (biosimilars). Volume-driven with thin margins per unit. First-to-file generics get 180-day exclusivity with premium pricing. Biosimilars have higher barriers (manufacturing complexity) and better margins.",
        examples: "Teva (diversified generics), Sandoz (biosimilar adalimumab), Viatris (complex generics), Coherus (biosimilar bevacizumab), Fresenius Kabi (biosimilar portfolio)",
        valuation: "Lower multiples: 6-10x EBITDA. Market values portfolio breadth and pipeline of upcoming LOE opportunities. Biosimilar-focused companies command premium to pure generics. Specialty/complex generics valued higher.",
        transition: "Generics companies increasingly pivoting to biosimilars and complex generics for better margins. Consolidation continues. Vertical integration (API + finished dosage) improves economics.",
      },
      { name: "Medical Device Sales + Service", color: "#10B981", icon: "🩺",
        how: "Capital equipment (imaging, surgical robots) sold upfront plus recurring revenue from consumables, instruments, and service contracts. Razor/razorblade model: place the capital equipment, profit from consumables. Service contracts are 15-20% of installed base annually.",
        economics: "Gross margins: 60-70% (devices), 80%+ (consumables). Service margins: 50-60%. Recurring consumables/service can be 60-70% of total revenue. Long sales cycles for capital (6-18 months). Procedure volume drives consumable pull-through.",
        examples: "Intuitive Surgical (da Vinci robot + instruments), Abbott (FreeStyle Libre CGM sensors), Medtronic (implants + monitoring), Stryker (orthopedic implants + navigation), Siemens Healthineers (imaging + service)",
        valuation: "15-25x forward P/E for medtech leaders. Higher multiples for companies with high recurring/consumable mix. Robotic surgery and CGM command premium valuations. Procedure volume growth is key metric.",
        transition: "Capital → recurring model shift. Companies adding digital health, AI diagnostics, and remote monitoring. Hospital budget pressures favor value-based purchasing. ASC shift benefits procedure-volume-driven companies.",
      },
      { name: "CRO / CDMO Fee-for-Service", color: "#F59E0B", icon: "🔬",
        how: "Revenue from contracted R&D services (CRO) or manufacturing services (CDMO). Typically structured as cost-plus or fixed-fee per study/project. Backlog-driven with multi-year visibility. Revenue recognition over the project lifecycle.",
        economics: "Gross margins: 30-40% (CRO), 25-35% (CDMO). EBITDA margins: 18-28% (CRO), 20-30% (CDMO). High labor content in CRO. Capital-intensive for CDMO. Book-to-bill ratio and backlog are key leading indicators.",
        examples: "IQVIA ($15B+ backlog), Charles River (discovery + safety), Lonza (biologics CDMO), Samsung Biologics (large-scale mAb), Catalent (fill-finish + gene therapy), Medpace (mid-cap CRO)",
        valuation: "CRO: 15-25x EBITDA for quality players. CDMO: 12-20x EBITDA. Backlog visibility supports premium. Market rewards therapeutic area diversification and customer concentration reduction. Biotech funding cycles impact CRO demand.",
        transition: "Outsourcing penetration still growing — pharma outsources ~50%+ of R&D, 30%+ of manufacturing. Trend toward strategic partnerships vs transactional. CDMOs adding development capabilities (D in CDMO). Biologics CDMO growing faster than small molecule.",
      },
      { name: "Royalty / Licensing", color: "#8B5CF6", icon: "📜",
        how: "Revenue from licensing IP (drug compounds, platform technology, patents) to other companies. Royalties typically 5-15% of net sales. Upfront payments + milestones + running royalties. Pure-play royalty companies aggregate streams.",
        economics: "Near 100% gross margin (no manufacturing or commercial costs). Highly predictable once drug is approved. Revenue scales with underlying drug sales. Risk: patent expiry and genericization of royalty-bearing products.",
        examples: "Royalty Pharma ($2B+ revenue from 35+ royalty streams), XOMA (anti-IL-6 royalties), academic institutions licensing to pharma, platform licensors (mRNA from Moderna/BioNTech to partners)",
        valuation: "Valued on DCF of royalty streams. Royalty Pharma trades at ~15x cash receipts. Premium for diversified royalty portfolios. Discount for concentrated single-product royalties. Duration of patent life is critical.",
        transition: "Growing asset class — PE and dedicated royalty funds actively acquiring streams. Pharma companies monetizing non-core royalties. Synthetic royalties (purchasing a % of future drug sales) emerging as financing tool.",
      },
    ];
    const HP_CONCEPTS = [
      { title: "Patent Cliff", desc: "The sharp revenue decline when a blockbuster drug loses patent exclusivity and faces generic/biosimilar competition. Branded revenue can fall 80-90% within 2-3 years of LOE. Example: Humira lost >$15B in US sales within 18 months of biosimilar entry. Companies must continuously refill pipelines to offset." },
      { title: "Pipeline Value (rNPV)", desc: "Risk-adjusted net present value of a pharma/biotech pipeline. Each program is DCF'd with probability-of-success adjustments: Phase I (~15% success), Phase II (~30%), Phase III (~55%), Filed (~85%). Pre-revenue biotech is valued almost entirely on pipeline rNPV. A single Phase III readout can move market cap by billions." },
      { title: "FDA Approval Pathway", desc: "NDA (New Drug Application) for small molecules, BLA (Biologics License Application) for biologics, 510(k) for medical devices (substantial equivalence), PMA (Pre-Market Approval) for higher-risk devices. ANDA for generics, 351(k) for biosimilars. Breakthrough Therapy Designation and Priority Review can accelerate timelines by 3-6 months." },
      { title: "PBM & Drug Pricing", desc: "Pharmacy Benefit Managers (CVS Caremark, Express Scripts, OptumRx) negotiate drug prices between pharma and payers. Gross-to-net spread (list price minus rebates) can be 40-60%. IRA allows Medicare to negotiate prices for top drugs starting 2026. 340B program provides discounted drugs to safety-net providers." },
      { title: "Biologics vs Small Molecule", desc: "Small molecules: chemically synthesized, oral pills, easily genericized at LOE. Biologics: produced in living cells, injectable/infused, complex to copy (biosimilars, not exact generics). Biologics are ~40% of pharma revenue and growing. Higher barriers to competition = longer revenue durability." },
      { title: "LOE (Loss of Exclusivity)", desc: "When patent protection and regulatory exclusivity expire, allowing generic/biosimilar competition. Tracked closely by investors. Key upcoming LOEs: Keytruda (2028), Opdivo (2028), Eliquis (2026), Entresto (2025). LOE exposure is the single biggest risk factor for pharma equities." },
    ];
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Healthcare & Pharma Primer</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Pharmaceuticals, biotech, medical devices, CRO/CDMO, and life sciences value chain</div>
        </div>

        {/* VALUE CHAIN */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare & Pharma Value Chain</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From drug discovery through to patients. ~$1.5T global pharmaceutical market (2025).</div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {HP_VALUE_CHAIN.map((stage, i, arr) => (
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
        </div>

        {/* TAXONOMY */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare & Pharma Taxonomy</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {HP_TAX.map(cat => (
              <div key={cat.key}>
                <div onClick={() => toggle("hptax_" + cat.key)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                  background: isExp("hptax_" + cat.key) ? cat.color + "22" : T_.bg,
                  borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("hptax_" + cat.key) ? cat.color + "44" : T_.border}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("hptax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                </div>
                {isExp("hptax_" + cat.key) && (
                  <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    {cat.children.map(childKey => {
                      const sub = HP_SUBS[childKey];
                      if (!sub) return null;
                      return (
                        <div key={childKey} onClick={() => toggle("hpsub_" + childKey)} style={{
                          padding: "10px 16px", background: isExp("hpsub_" + childKey) ? T_.bgInput : T_.bg,
                          borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("hpsub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("hpsub_" + childKey) && (
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

        {/* SUBSECTOR TAM CARDS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Addressable market estimates and growth rates across healthcare & pharma subsectors.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {Object.entries(HP_SUBS).map(([key, sub]) => (
              <div key={key} style={{
                padding: "14px 16px", background: T_.bg, borderRadius: 8,
                border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer",
              }} onClick={() => {
                const cat = HP_TAX.find(t => t.children.includes(key));
                if (cat) toggle("hptax_" + cat.key);
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

        {/* REVENUE MODELS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare & Pharma Revenue Models</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How healthcare and pharmaceutical companies generate revenue. Revenue model determines business quality, margin profile, and valuation multiples.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HP_REV_MODELS.map((model, i) => (
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

        {/* KEY CONCEPTS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {HP_CONCEPTS.map((c, i) => (
              <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>
          Sources: IQVIA Institute, EvaluatePharma, FDA Orange Book, company 10-Ks, GlobalData Pharma Intelligence. TAM and growth rates are approximate 2025 estimates.
        </div>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════
  // 2. HEALTHCARE IT & HEALTHCARE SERVICES
  // ═══════════════════════════════════════════════════════
  if (subTab === "healthservices") {
    const HS_SUBS = {
      hospitalsystems: { name: "Hospital & Health Systems", fullName: "Hospital Systems & Integrated Delivery Networks", category: "Provider Organizations", color: "#3B82F6",
        tam: "$1.3T+ (2025, US)", growth: "~4-6% CAGR", icon: "🏥",
        desc: "Large integrated delivery networks (IDNs) and hospital systems that provide inpatient, outpatient, and emergency care. Consolidation continues as scale drives payer leverage and operational efficiency.",
        whatTheySell: "Inpatient acute care, surgical services, emergency departments, outpatient clinics, imaging, lab services, employed physician practices.",
        whoBuys: "Patients (via insurance), Medicare/Medicaid (government payers), commercial payers (UNH, Elevance, Cigna, Aetna).",
        keyPlayers: ["HCA Healthcare (largest for-profit — 186 hospitals)", "CommonSpirit Health", "Ascension", "Kaiser Permanente", "Trinity Health", "Tenet Healthcare", "Universal Health Services"],
        trends: "Ongoing consolidation — top 10 systems operate 25%+ of US beds. Shift to outpatient/ASC settings. Margin pressure from labor costs. Revenue cycle complexity growing. AI for clinical documentation.",
      },
      ambulatory: { name: "Ambulatory / Outpatient", fullName: "Ambulatory Surgery Centers & Outpatient Care", category: "Provider Organizations", color: "#3B82F6",
        tam: "$300B+ (2025, US)", growth: "~7-9% CAGR", icon: "🩹",
        desc: "Ambulatory surgery centers (ASCs), urgent care clinics, freestanding imaging/lab centers, and outpatient specialty practices. The secular shift from hospital to lower-cost ambulatory settings.",
        whatTheySell: "Outpatient surgical procedures, urgent care visits, diagnostic imaging, physical therapy, dialysis, infusion services.",
        whoBuys: "Patients, commercial payers (prefer lower-cost settings), Medicare (increasingly reimbursing ASC procedures).",
        keyPlayers: ["United Surgical Partners (Tenet)", "SCA Health (UnitedHealth/Optum)", "AmSurg/Envision (KKR)", "DaVita (dialysis)", "Fresenius Medical Care", "Concentra (urgent care)"],
        trends: "Procedures migrating from hospital to ASC (~55% of eligible procedures now outpatient). Total joint replacement in ASCs growing fast. Payer-provider vertical integration (UNH/Optum owns SCA Health).",
      },
      managedcare: { name: "Managed Care (Health Insurers)", fullName: "Managed Care Organizations & Health Insurers", category: "Payer", color: "#10B981",
        tam: "$1.2T+ (2025, US premiums)", growth: "~5-8% CAGR", icon: "🛡️",
        desc: "Health insurance companies that manage risk, negotiate provider rates, and administer benefits for employer-sponsored, Medicare Advantage, Medicaid managed care, and individual/exchange populations.",
        whatTheySell: "Health insurance plans (employer, individual, Medicare Advantage, Medicaid managed care), pharmacy benefits (PBM), care management, analytics, and increasingly provider services.",
        whoBuys: "Employers (group coverage), individuals (ACA exchanges), CMS (Medicare Advantage bids), state Medicaid agencies.",
        keyPlayers: ["UnitedHealth Group (largest — $370B+ revenue)", "Elevance Health (Anthem)", "CVS Health (Aetna)", "Cigna Group", "Humana", "Centene (Medicaid)", "Molina Healthcare"],
        trends: "Medicare Advantage enrollment growing (~50%+ of eligible Medicare beneficiaries). Vertical integration (UNH into care delivery, CVS into primary care). Star Ratings driving MA economics. V28 risk model changes pressuring MA margins.",
      },
      rcm: { name: "Revenue Cycle Management", fullName: "Revenue Cycle Management (RCM)", category: "Healthcare IT", color: "#F59E0B",
        tam: "$50B+ (2025)", growth: "~10-12% CAGR", icon: "💰",
        desc: "Software and services to manage the financial lifecycle of patient encounters — from scheduling and registration through coding, billing, claims submission, denial management, and collections.",
        whatTheySell: "Patient registration/eligibility, charge capture, medical coding (ICD-10, CPT), claims submission, denial management, patient billing, analytics/reporting.",
        whoBuys: "Hospital systems, physician groups, ASCs, labs. CFO, revenue cycle VP. Outsourcing growing as complexity increases.",
        keyPlayers: ["R1 RCM (largest pure-play)", "Waystar", "Ensemble Health Partners", "Optum (Change Healthcare)", "nThrive/FinThrive", "Experian Health", "Availity"],
        trends: "AI for automated coding and denial prediction. Change Healthcare cyberattack (2024) highlighted criticality. Prior authorization automation. Shift from on-prem to cloud-based RCM. End-to-end outsourcing growing.",
      },
      vbc: { name: "Population Health & VBC", fullName: "Population Health Management & Value-Based Care", category: "Healthcare IT", color: "#8B5CF6",
        tam: "$25B+ (2025)", growth: "~15-18% CAGR", icon: "📊",
        desc: "Platforms and services enabling the shift from fee-for-service to value-based care — risk stratification, care coordination, quality measurement, and shared savings/risk arrangements.",
        whatTheySell: "Risk stratification analytics, care gap identification, care management platforms, quality measure reporting, ACO management tools, social determinants of health (SDOH) data.",
        whoBuys: "Health systems in value-based contracts, ACOs, Medicare Advantage plans, Medicaid managed care, primary care groups.",
        keyPlayers: ["Aledade (ACO enabler)", "Signify Health (CVS)", "Privia Health", "Evolent Health", "Optum (value-based care)", "agilon health", "Oak Street Health (CVS)"],
        trends: "CMS pushing value-based models (MSSP, ACO REACH). Primary care enablement platforms growing fast. Risk adjustment coding critical for MA economics. PE-backed VBC platforms consolidating.",
      },
      telehealth: { name: "Telehealth & Virtual Care", fullName: "Telehealth, Virtual Care & Digital Health", category: "Digital Health", color: "#0EA5E9",
        tam: "$40B+ (2025)", growth: "~12-15% CAGR", icon: "📱",
        desc: "Platforms for virtual physician visits, remote patient monitoring (RPM), digital therapeutics, and asynchronous care delivery.",
        whatTheySell: "Video/audio telehealth visits, remote patient monitoring devices and platforms, digital therapeutics (DTx), chronic care management, mental health platforms.",
        whoBuys: "Health systems (as a channel), employers (virtual-first plans), payers (cost reduction), patients (convenience), government (rural access).",
        keyPlayers: ["Teladoc Health", "Amwell", "MDLive (Evernorth/Cigna)", "Hims & Hers Health", "Doxy.me", "Ginger/Headspace (mental health)"],
        trends: "Post-COVID normalization at ~15-20% of visits (was ~1% pre-COVID, ~40% peak). GLP-1 prescribing driving DTC telehealth growth. RPM for chronic disease management. Mental health virtual care growing fastest. Reimbursement parity laws expanding.",
      },
      staffing: { name: "Healthcare Staffing", fullName: "Healthcare Staffing & Workforce Solutions", category: "Services", color: "#84CC16",
        tam: "$25B+ (2025, US)", growth: "~3-5% CAGR (normalizing)", icon: "👩‍⚕️",
        desc: "Temporary and permanent staffing for nurses, physicians, allied health professionals, and locum tenens. Post-COVID normalization after massive 2021-2022 spike.",
        whatTheySell: "Travel nursing, per diem nursing, locum tenens physicians, allied health staffing (radiology techs, therapists), permanent placement, workforce management technology.",
        whoBuys: "Hospital systems (fill gaps), outpatient facilities, government (VA, military), long-term care facilities.",
        keyPlayers: ["AMN Healthcare", "Aya Healthcare", "Cross Country Healthcare", "CHG Healthcare (locum tenens)", "Maxim Healthcare Group", "Medical Solutions"],
        trends: "Market normalizing after COVID-driven spike (travel nurse rates down 40%+ from peak). Internal float pools reducing agency dependence. AI-powered scheduling. International nurse recruitment growing.",
      },
      behavioral: { name: "Behavioral Health", fullName: "Behavioral Health & Mental Health Services", category: "Specialty Services", color: "#F97316",
        tam: "$80B+ (2025, US)", growth: "~8-10% CAGR", icon: "🧠",
        desc: "Inpatient and outpatient mental health, substance use disorder (SUD), eating disorder, and autism services. Massive supply-demand imbalance driving growth.",
        whatTheySell: "Inpatient psychiatric hospitals, residential treatment, intensive outpatient programs (IOP), partial hospitalization (PHP), outpatient therapy, ABA therapy (autism), MAT for substance use.",
        whoBuys: "Patients (increasingly covered by insurance), commercial payers (mental health parity laws), Medicaid, Medicare, employers (EAP).",
        keyPlayers: ["Acadia Healthcare (largest pure-play)", "Universal Health Services (behavioral)", "LifeStance Health (outpatient)", "Talkspace", "Cerebral", "BASS/Sequel Youth Services"],
        trends: "Mental health parity enforcement increasing coverage. Youth mental health crisis driving demand. PE investment in behavioral platforms. Virtual therapy adoption sticky post-COVID. ABA therapy for autism remains supply-constrained.",
      },
      postacute: { name: "Post-Acute & Home Health", fullName: "Post-Acute Care, Home Health & Hospice", category: "Specialty Services", color: "#EF4444",
        tam: "$150B+ (2025, US)", growth: "~6-8% CAGR", icon: "🏠",
        desc: "Skilled nursing facilities (SNFs), home health agencies, hospice care, and rehabilitation facilities. Care delivered after acute hospital stays or for chronic conditions at home.",
        whatTheySell: "Skilled nursing care, home health nursing/therapy, hospice/palliative care, inpatient rehabilitation, long-term acute care (LTAC).",
        whoBuys: "Medicare (primary payer for post-acute), Medicaid (long-term care), commercial payers, patients/families.",
        keyPlayers: ["Amedisys (UnitedHealth)", "Enhabit Home Health & Hospice", "LHC Group (UnitedHealth/Optum)", "Kindred (Humana)", "BrightSpring (KKR)", "Encompass Health (IRF)"],
        trends: "Hospital-at-home programs expanding. UnitedHealth acquiring home health aggressively (Amedisys, LHC Group). PDGM reimbursement model stabilizing. Labor shortages remain. SNF bed counts declining as care shifts home.",
      },
    };
    const HS_TAX = [
      { key: "providers", label: "Provider Organizations", color: "#3B82F6", icon: "🏥", children: ["hospitalsystems", "ambulatory"] },
      { key: "payer", label: "Payer / Managed Care", color: "#10B981", icon: "🛡️", children: ["managedcare"] },
      { key: "healthit", label: "Healthcare IT", color: "#F59E0B", icon: "💰", children: ["rcm", "vbc"] },
      { key: "digital", label: "Digital Health", color: "#0EA5E9", icon: "📱", children: ["telehealth"] },
      { key: "workforce", label: "Healthcare Workforce", color: "#84CC16", icon: "👩‍⚕️", children: ["staffing"] },
      { key: "specialty", label: "Specialty Services", color: "#F97316", icon: "🧠", children: ["behavioral", "postacute"] },
    ];
    const HS_VALUE_CHAIN = [
      { label: "Health Plans / Payers", color: "#10B981", icon: "🛡️", desc: "Insurance & risk management", rows: [{ sub: "Commercial", ex: "UNH, Elevance, Cigna, Aetna" }, { sub: "Medicare Advantage", ex: "UNH, Humana, CVS/Aetna" }, { sub: "Medicaid MCO", ex: "Centene, Molina, Elevance" }], buyers: "Employers, individuals, CMS, states" },
      { label: "Provider Organizations", color: "#3B82F6", icon: "🏥", desc: "Care delivery entities", rows: [{ sub: "Hospital Systems", ex: "HCA, CommonSpirit, Kaiser" }, { sub: "Physician Groups", ex: "Optum Care, Privia, agilon" }, { sub: "ASCs / Ambulatory", ex: "USPI, SCA Health, DaVita" }], buyers: "Patients (via insurance), payers" },
      { label: "Health IT Systems", color: "#F59E0B", icon: "💻", desc: "Technology infrastructure", rows: [{ sub: "EHR / PM", ex: "Epic, Oracle Health, athena" }, { sub: "RCM", ex: "R1 RCM, Waystar, FinThrive" }, { sub: "Analytics", ex: "Health Catalyst, Innovaccer" }], buyers: "Health systems, practices, payers" },
      { label: "Care Delivery", color: "#8B5CF6", icon: "🩺", desc: "Clinical workflows & services", rows: [{ sub: "Inpatient", ex: "Acute care, surgical, ICU" }, { sub: "Outpatient", ex: "Clinics, ASCs, imaging" }, { sub: "Virtual", ex: "Teladoc, Amwell, Hims" }], buyers: "Patients, families, caregivers" },
      { label: "Patient Outcomes", color: "#6366F1", icon: "📊", desc: "Quality, cost, satisfaction", rows: [{ sub: "Quality Metrics", ex: "HEDIS, Star Ratings, CMS" }, { sub: "Value-Based", ex: "Shared savings, bundled pay" }, { sub: "Patient Experience", ex: "HCAHPS, NPS, access" }], buyers: "CMS, payers, employers, patients" },
    ];
    const HS_REV_MODELS = [
      { name: "Fee-for-Service (FFS)", color: "#3B82F6", icon: "🧾",
        how: "Providers paid per service rendered — per office visit, per procedure, per test. Each service has a CPT code with an associated reimbursement rate. Volume-driven: more procedures = more revenue. Still ~60% of US healthcare spending.",
        economics: "Hospital operating margins: 2-8% (thin). Physician practice margins: 10-20%. Revenue scales with volume/acuity. Case mix index (CMI) measures patient complexity. DRG reimbursement for inpatient is the largest single payer mechanism.",
        examples: "HCA Healthcare (inpatient FFS), Tenet Healthcare (surgical volume), physician groups (E&M visit codes), labs (per-test CPT billing), imaging centers (per-scan)",
        valuation: "Hospital systems: 8-12x EBITDA. Physician practices: 10-15x EBITDA (platform), 6-8x (add-on). Volume growth and payer mix (commercial vs Medicare vs Medicaid) are key drivers. Labor costs are the largest expense (50-60% of revenue).",
        transition: "Slow shift toward value-based. CMS targeting 100% of Medicare in VBC arrangements by 2030. Commercial payers following. FFS will persist for surgical/procedural specialties but declining for primary care.",
      },
      { name: "Value-Based / Capitation", color: "#8B5CF6", icon: "📊",
        how: "Providers paid a fixed amount per patient per period (capitation) or share in savings/risk versus a cost benchmark. Rewards efficiency and prevention over volume. Partial risk (upside only) → full risk (upside + downside).",
        economics: "Margins improve with better patient outcomes and lower utilization. Risk-bearing entities can earn 3-8% operating margin. Requires investment in care management, analytics, and population health infrastructure. Revenue more predictable than FFS.",
        examples: "Kaiser Permanente (fully integrated capitation), agilon health (Medicare Advantage capitation), Aledade (ACO shared savings), Privia Health (partial risk contracts), ChenMed (seniors, full risk)",
        valuation: "VBC enablers: 15-25x EBITDA for fast growers. Premium for 'lives under management' growth. Investors value total medical spend under management and trend in medical cost ratio. High multiple but capital-light models.",
        transition: "CMS targeting all Medicare beneficiaries in accountable care by 2030. MA penetration (~52% of eligible seniors) naturally shifts more spend to capitation. Primary care is first to transition; specialty care slower.",
      },
      { name: "Insurance Premiums (MLR-based)", color: "#10B981", icon: "🛡️",
        how: "Health insurers collect premiums and pay medical claims. The difference (after admin/SGA) is profit. Medical Loss Ratio (MLR) = medical costs / premium revenue. ACA requires MLR of 80-85%+ (rebates if below). Revenue recognized as premiums earned.",
        economics: "MLR: 82-88% for managed care (higher for Medicaid, lower for commercial). Admin ratio: 10-15%. Operating margin: 3-6%. Scale matters — UNH earns $30B+ operating income on $370B+ revenue. Investment income on premium float adds margin.",
        examples: "UnitedHealth Group (largest — $370B revenue), Elevance Health, CVS/Aetna, Cigna Group, Humana (Medicare Advantage focused), Centene (Medicaid focused), Molina Healthcare (Medicaid)",
        valuation: "12-18x forward P/E for managed care. Premium growth and MLR trend are key metrics. Medicare Advantage Star Ratings drive bonus payments. Vertical integration (Optum for UNH, Evernorth for Cigna) drives incremental value.",
        transition: "MCOs becoming care delivery companies. UNH owns 90K+ physicians, pharmacies, home health. Vertical integration blurs payer-provider line. Government scrutiny on MA coding practices and prior authorization growing.",
      },
      { name: "SaaS (Health IT)", color: "#F59E0B", icon: "💻",
        how: "Recurring subscription fees for healthcare IT platforms — EHR, RCM, population health, analytics. Priced per provider, per bed, per member, or per transaction. Cloud-hosted with regular updates. Implementation services revenue upfront.",
        economics: "Gross margins: 65-80% (lower than pure software due to services component). Net retention: 105-115%. Implementation cycles: 6-18 months. Switching costs extremely high (especially EHR — Epic implementations take years). Long-term contracts (5-10 years for EHR).",
        examples: "Epic Systems (private — dominant hospital EHR), Veeva Systems (life sciences CRM), Health Catalyst (analytics), Waystar (RCM SaaS), Phreesia (patient access), Evolent (VBC platform)",
        valuation: "6-12x ARR for health IT SaaS. Premium for high retention and regulatory tailwinds (interoperability mandates). Epic is private but would command highest multiple. Health IT M&A active (Oracle/Cerner, Veracyte/Decipher).",
        transition: "Cloud migration from on-prem legacy systems ongoing. AI for clinical documentation (ambient listening by Nuance/Microsoft, Abridge, DeepScribe). Interoperability (FHIR) mandates creating API-first architectures.",
      },
      { name: "Staffing (Bill Rate Spread)", color: "#84CC16", icon: "👩‍⚕️",
        how: "Healthcare staffing companies earn the spread between what they bill the facility and what they pay the clinician. Bill rate minus pay rate = gross profit per hour. Volume x spread = revenue. Travel contracts typically 13 weeks.",
        economics: "Gross margins: 25-35%. EBITDA margins: 8-14%. Revenue per traveler: $150-200K+ annually. Bill rates normalized post-COVID (peak: $150+/hr for ICU nurses, now $70-90/hr). High revenue cyclicality with demand shocks.",
        examples: "AMN Healthcare (~$3B revenue), Aya Healthcare, Cross Country Healthcare, CHG Healthcare (locum tenens), Medical Solutions",
        valuation: "8-12x EBITDA (normalizing). Market penalized staffing firms as COVID surge unwound. Investors watch bill rate trends, traveler counts, and demand indicators (hospital vacancy rates). Shift to technology-enabled staffing (managed services).",
        transition: "Hospitals building internal float pools to reduce agency spend. Technology platforms (ShiftKey, CareRev) enabling gig-economy model for nursing. International recruitment programs. MSP/VMS technology consolidation.",
      },
      { name: "Per-Member-Per-Month (PMPM)", color: "#0EA5E9", icon: "🔁",
        how: "VBC enablers and care management companies paid a fixed monthly fee per member under their management. Revenue scales with covered lives, not utilization. Often layered on top of MA capitation payments.",
        economics: "Platform fees: $5-50+ PMPM depending on services (care management, analytics, network management). Margins improve with scale as fixed technology costs spread over more lives. Medical cost savings fund the PMPM fee for payers.",
        examples: "agilon health ($300+ PMPM on full risk lives), Evolent Health ($20-40 PMPM specialty management), Aledade (shared savings PMPM equivalent), Alignment Healthcare (MA-focused)",
        valuation: "Valued on lives under management x PMPM revenue potential. High-growth VBC platforms trade at 2-5x revenue. Key metrics: lives under management growth, medical margin trend, total cost of care reduction demonstrated.",
        transition: "Growing rapidly as more providers take on risk. PMPM model aligns incentives — provider is paid to keep patients healthy. Requires significant data/analytics infrastructure. Expect continued consolidation as scale matters.",
      },
    ];
    const HS_CONCEPTS = [
      { title: "Medical Loss Ratio (MLR)", desc: "The percentage of premium revenue spent on medical claims and quality improvement. ACA mandates minimum 80% (individual/small group) or 85% (large group). If an insurer's MLR is below minimum, it must rebate the difference. UNH targets ~82-84% commercial MLR. A 100bp MLR change on $300B of premiums = $3B impact." },
      { title: "DRG / Case Mix Index", desc: "Diagnosis-Related Groups: Medicare pays hospitals a fixed amount per inpatient admission based on diagnosis, not length of stay. Case Mix Index (CMI) measures average DRG weight (complexity). Higher CMI = more revenue per admission. Clinical documentation improvement (CDI) programs ensure accurate coding to optimize reimbursement." },
      { title: "Value-Based Care (VBC)", desc: "Payment models that reward quality and efficiency over volume. Spectrum: pay-for-performance (bonuses for quality) → bundled payments (fixed price per episode) → shared savings (split savings vs benchmark) → full capitation (fixed per-member payment). CMS goal: 100% of Medicare in accountable relationships by 2030." },
      { title: "Prior Authorization", desc: "Payer requirement that providers get approval before delivering certain services. Massive friction point: 34% of physicians report patient adverse events due to PA delays. CMS finalized rules requiring electronic PA and 72-hour response times for MA plans. Automation is a major healthIT opportunity." },
      { title: "Interoperability (FHIR)", desc: "FHIR (Fast Healthcare Interoperability Resources) is the modern standard for exchanging health data between systems. CMS mandates FHIR-based APIs for payers and providers. Epic and other EHR vendors now expose FHIR APIs. Enables patient data portability and third-party app ecosystems. Reduces vendor lock-in over time." },
      { title: "Provider Consolidation", desc: "Hospitals acquiring physician practices, PE rolling up specialty groups, payers acquiring providers. Top 10 health systems now control 25%+ of US hospital beds. UnitedHealth (Optum) employs 90K+ physicians. Consolidation drives scale for VBC contracting but raises antitrust concerns. FTC scrutiny increasing." },
    ];
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Healthcare IT & Services Primer</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Health systems, managed care, healthIT, digital health, and healthcare services value chain</div>
        </div>

        {/* VALUE CHAIN */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare Services Value Chain</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From payers through providers to patient outcomes. ~$4.5T US healthcare spending (2025).</div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {HS_VALUE_CHAIN.map((stage, i, arr) => (
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
        </div>

        {/* TAXONOMY */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare Services Taxonomy</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {HS_TAX.map(cat => (
              <div key={cat.key}>
                <div onClick={() => toggle("hstax_" + cat.key)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                  background: isExp("hstax_" + cat.key) ? cat.color + "22" : T_.bg,
                  borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("hstax_" + cat.key) ? cat.color + "44" : T_.border}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("hstax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                </div>
                {isExp("hstax_" + cat.key) && (
                  <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    {cat.children.map(childKey => {
                      const sub = HS_SUBS[childKey];
                      if (!sub) return null;
                      return (
                        <div key={childKey} onClick={() => toggle("hssub_" + childKey)} style={{
                          padding: "10px 16px", background: isExp("hssub_" + childKey) ? T_.bgInput : T_.bg,
                          borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("hssub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("hssub_" + childKey) && (
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

        {/* SUBSECTOR TAM CARDS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Addressable market estimates and growth rates across healthcare services subsectors.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {Object.entries(HS_SUBS).map(([key, sub]) => (
              <div key={key} style={{
                padding: "14px 16px", background: T_.bg, borderRadius: 8,
                border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer",
              }} onClick={() => {
                const cat = HS_TAX.find(t => t.children.includes(key));
                if (cat) toggle("hstax_" + cat.key);
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

        {/* REVENUE MODELS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Healthcare Services Revenue Models</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How healthcare services companies generate revenue. The US healthcare system is transitioning from volume-based to value-based payment — understanding where a company sits on this spectrum is critical.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HS_REV_MODELS.map((model, i) => (
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

        {/* KEY CONCEPTS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {HS_CONCEPTS.map((c, i) => (
              <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>
          Sources: CMS National Health Expenditure data, KFF, AHA Annual Survey, company 10-Ks, McKinsey Healthcare Practice. TAM and growth rates are approximate 2025 estimates.
        </div>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════
  // 3. ENERGY & MATERIALS
  // ═══════════════════════════════════════════════════════
  if (subTab === "energy") {
    const EN_SUBS = {
      oilgas: { name: "Oil & Gas (Upstream/Midstream/Downstream)", fullName: "Integrated & Independent Oil & Gas", category: "Oil & Gas", color: "#F59E0B",
        tam: "$3T+ (2025, global)", growth: "~2-4% CAGR (volume)", icon: "🛢️",
        desc: "Exploration & production (upstream), transportation & storage (midstream), and refining & marketing (downstream) of crude oil and natural gas. Cyclical, commodity-price-driven industry with massive capital intensity.",
        whatTheySell: "Crude oil, natural gas, NGLs, refined products (gasoline, diesel, jet fuel), petrochemical feedstocks, LNG.",
        whoBuys: "Refineries (crude), utilities/industrials (natgas), consumers (gasoline/diesel), petrochemical companies, LNG importers (Asia, Europe).",
        keyPlayers: ["ExxonMobil", "Chevron", "Shell", "BP", "TotalEnergies", "ConocoPhillips", "EOG Resources", "Pioneer (ExxonMobil)", "Enterprise Products (midstream)", "Kinder Morgan"],
        trends: "US shale maturation (Permian Basin dominance). LNG export boom. M&A consolidation (Exxon/Pioneer, Chevron/Hess). Capital discipline post-2020. Energy security driving investment. ESG pressures easing as pragmatism prevails.",
      },
      renewables: { name: "Renewable Energy (Solar/Wind)", fullName: "Renewable Energy Generation — Solar & Wind", category: "Renewables", color: "#10B981",
        tam: "$500B+ (2025, global investment)", growth: "~12-15% CAGR", icon: "☀️",
        desc: "Utility-scale and distributed solar PV, onshore and offshore wind power generation. Fastest-growing energy source globally, driven by cost declines, policy support (IRA), and corporate decarbonization targets.",
        whatTheySell: "Solar panels (modules), wind turbines, utility-scale power plants, distributed/rooftop solar, renewable energy certificates (RECs), clean electricity via PPAs.",
        whoBuys: "Utilities, corporates (C&I PPAs), residential customers, grid operators, governments.",
        keyPlayers: ["NextEra Energy (largest renewable operator)", "Brookfield Renewable", "Enphase Energy (microinverters)", "First Solar (US panels)", "Vestas (wind turbines)", "Orsted (offshore wind)", "SunPower", "Canadian Solar"],
        trends: "IRA providing 10-year tax credit visibility. Solar costs down 90%+ over 15 years. Interconnection queue backlog (2,600 GW in US queue). Offshore wind facing cost inflation. Utility-scale solar LCOE now cheapest new-build generation in most markets.",
      },
      storage: { name: "Energy Storage & Batteries", fullName: "Energy Storage Systems & Battery Technology", category: "Renewables", color: "#10B981",
        tam: "$60B+ (2025)", growth: "~25-30% CAGR", icon: "🔋",
        desc: "Lithium-ion batteries, grid-scale energy storage, and emerging battery technologies enabling renewable energy integration and EV adoption.",
        whatTheySell: "Battery cells (EV, grid), battery energy storage systems (BESS), power electronics/inverters, battery management systems, recycling services.",
        whoBuys: "Utilities (grid storage), EV manufacturers, renewable developers, commercial/industrial facilities, residential customers.",
        keyPlayers: ["CATL (dominant — ~37% global cell share)", "LG Energy Solution", "BYD", "Panasonic", "Samsung SDI", "Tesla (Megapack)", "Fluence Energy (grid BESS)"],
        trends: "Lithium-ion costs down ~90% over decade. Grid storage deployments accelerating (IRA tax credits). LFP chemistry gaining share over NMC. Sodium-ion emerging for stationary storage. 4-hour duration becoming standard for grid.",
      },
      mining: { name: "Mining & Metals", fullName: "Mining, Metals & Minerals", category: "Materials", color: "#6366F1",
        tam: "$1.8T+ (2025, global)", growth: "~3-5% CAGR", icon: "⛏️",
        desc: "Extraction and processing of metals (iron ore, copper, gold, aluminum, lithium) and minerals. Critical materials for infrastructure, energy transition, and technology.",
        whatTheySell: "Iron ore, copper, gold, aluminum/bauxite, lithium, nickel, cobalt, rare earths, metallurgical coal, potash.",
        whoBuys: "Steel mills (iron ore), electronics/construction (copper), EV battery makers (lithium, nickel, cobalt), jewelry/central banks (gold), agriculture (potash).",
        keyPlayers: ["BHP", "Rio Tinto", "Vale", "Glencore", "Freeport-McMoRan (copper)", "Newmont (gold)", "Albemarle (lithium)", "Southern Copper"],
        trends: "Copper super-cycle thesis (AI data centers + EVs + grid). Lithium price collapsed 80%+ from 2022 peak but demand trajectory intact. Critical minerals supply chain reshoring (IRA, EU Critical Raw Materials Act). ESG/sustainability requirements for mine permitting.",
      },
      chemicals: { name: "Chemicals (Specialty & Commodity)", fullName: "Specialty & Commodity Chemicals", category: "Materials", color: "#0EA5E9",
        tam: "$800B+ (2025, global)", growth: "~3-5% CAGR", icon: "⚗️",
        desc: "Production of commodity chemicals (ethylene, propylene, chlor-alkali) and specialty chemicals (coatings, adhesives, electronic chemicals, flavors & fragrances). Commodity chemicals are price-takers; specialty chemicals have pricing power.",
        whatTheySell: "Commodity: ethylene, polyethylene, propylene, PVC, caustic soda. Specialty: coatings, adhesives, sealants, electronic chemicals, water treatment chemicals, catalysts.",
        whoBuys: "Manufacturing (plastics, packaging), construction, automotive, agriculture, electronics, consumer goods, water utilities.",
        keyPlayers: ["BASF", "Dow", "LyondellBasell", "DuPont (specialty)", "Sherwin-Williams (coatings)", "PPG Industries", "Air Products (industrial gas)", "Linde (industrial gas)", "Ecolab"],
        trends: "Specialty chemicals commanding premium margins (15-25% EBITDA vs 10-15% commodity). Industrial gas duopoly (Air Products + Linde) with take-or-pay contracts. Sustainability/circular economy driving reformulation. Electronic chemicals growing with semiconductor capacity expansion.",
      },
      carboncapture: { name: "Carbon Capture & Cleantech", fullName: "Carbon Capture, Utilization & Storage (CCUS) and Cleantech", category: "Cleantech", color: "#84CC16",
        tam: "$15B+ (2025)", growth: "~30-40% CAGR", icon: "🌿",
        desc: "Technologies for capturing CO2 from industrial processes or ambient air, hydrogen production (blue/green), and other decarbonization technologies. Early-stage but massive policy tailwinds (IRA 45Q credits).",
        whatTheySell: "Point-source carbon capture equipment, direct air capture (DAC), CO2 transport/storage, blue hydrogen (SMR + CCS), green hydrogen (electrolysis), carbon credits.",
        whoBuys: "Industrial emitters (cement, steel, chemicals), power plants, oil & gas companies (EOR), governments (climate goals), voluntary carbon market buyers.",
        keyPlayers: ["Aker Carbon Capture", "Climeworks (DAC)", "Occidental (1PointFive DAC)", "Plug Power (green H2)", "Air Products (blue H2)", "Chart Industries (equipment)", "Carbon Clean"],
        trends: "IRA 45Q credit: $85/ton (point source), $180/ton (DAC). Over 100 CCUS projects announced globally. Hydrogen hubs funded by DOE ($7B). Economics still challenging without subsidies. Blue hydrogen more economic than green near-term.",
      },
    };
    const EN_TAX = [
      { key: "oilgas", label: "Oil & Gas", color: "#F59E0B", icon: "🛢️", children: ["oilgas"] },
      { key: "renew", label: "Renewable Energy", color: "#10B981", icon: "☀️", children: ["renewables", "storage"] },
      { key: "materials", label: "Mining & Materials", color: "#6366F1", icon: "⛏️", children: ["mining", "chemicals"] },
      { key: "cleantech", label: "Carbon Capture & Cleantech", color: "#84CC16", icon: "🌿", children: ["carboncapture"] },
    ];
    const EN_VALUE_CHAIN = [
      { label: "Exploration / Extraction", color: "#F59E0B", icon: "⛏️", desc: "Finding & producing resources", rows: [{ sub: "O&G E&P", ex: "ExxonMobil, ConocoPhillips, EOG" }, { sub: "Mining", ex: "BHP, Rio Tinto, Freeport" }, { sub: "Renewables Dev", ex: "NextEra, Orsted, Brookfield" }], buyers: "Resource owners, governments (leases)" },
      { label: "Processing / Refining", color: "#EF4444", icon: "🏭", desc: "Transforming raw to usable form", rows: [{ sub: "Refining", ex: "Valero, Marathon Petroleum" }, { sub: "Gas Processing", ex: "ONEOK, DCP Midstream" }, { sub: "Smelting/Processing", ex: "Alcoa, Nucor, Freeport" }], buyers: "Upstream producers (offtake)" },
      { label: "Transport / Midstream", color: "#3B82F6", icon: "🚚", desc: "Pipelines, shipping, storage", rows: [{ sub: "Pipelines", ex: "Enterprise Products, Kinder Morgan" }, { sub: "LNG Shipping", ex: "Cheniere, Tellurian" }, { sub: "Storage", ex: "Magellan, Plains All American" }], buyers: "Producers, refiners, utilities" },
      { label: "Distribution", color: "#8B5CF6", icon: "📦", desc: "Wholesale & retail delivery", rows: [{ sub: "Fuel Distribution", ex: "Sunoco LP, World Fuel" }, { sub: "Commodity Trading", ex: "Vitol, Trafigura, Glencore" }, { sub: "Utility Delivery", ex: "Local distribution companies" }], buyers: "End-market consumers, retailers" },
      { label: "End Markets", color: "#6366F1", icon: "🏠", desc: "Final consumption", rows: [{ sub: "Transportation", ex: "~28% of US energy (gasoline, jet)" }, { sub: "Industrial", ex: "~33% (manufacturing, mining)" }, { sub: "Residential/Comm", ex: "~22% (heating, electricity)" }, { sub: "Power Generation", ex: "~17% (utilities, grid)" }], buyers: "Consumers, businesses, utilities" },
    ];
    const EN_REV_MODELS = [
      { name: "Commodity Sales (Price-Taker)", color: "#F59E0B", icon: "🛢️",
        how: "Revenue = volume produced x commodity price. Companies are price-takers for oil, gas, metals, and bulk chemicals. Prices set by global supply/demand on exchanges (WTI, Brent, Henry Hub, LME). Hedging programs smooth but don't eliminate price risk.",
        economics: "Margins highly variable with commodity cycles. Oil: breakeven $30-50/bbl (US shale), $15-25 (Saudi). Mining: cash costs vary by asset quality. Gross margins can swing from 20% to 60%+ within a cycle. Capital intensity: 30-50% of revenue in capex.",
        examples: "ExxonMobil (oil/gas), ConocoPhillips (pure-play E&P), Freeport-McMoRan (copper), Newmont (gold), Dow (commodity chemicals), Nucor (steel)",
        valuation: "Cyclicals valued on mid-cycle earnings, EV/EBITDA (4-8x for diversified), P/NAV (upstream). Reserve life, cost curve position, and free cash flow yield are key metrics. Market often misprices cyclical troughs as structural declines.",
        transition: "Integrated majors diversifying into renewables and hydrogen. Mining companies positioning as 'critical minerals' suppliers for energy transition. Capital discipline era: returns to shareholders > growth capex.",
      },
      { name: "Midstream Toll / Fee-Based", color: "#3B82F6", icon: "🔧",
        how: "Revenue from transporting, storing, and processing commodities — charged per unit volume or capacity reserved. Take-or-pay contracts provide revenue floor regardless of throughput. Typically structured as MLPs or C-corps with high distribution yields.",
        economics: "Gross margins: 50-70% (low variable cost once built). EBITDA margins: 40-55%. 85-95% of revenue fee-based or hedged. Capital recycling: build asset → contract → drop down. Distribution coverage ratio target: 1.2-1.5x. Debt/EBITDA: 3.5-4.5x typical.",
        examples: "Enterprise Products Partners ($55B+ market cap), Kinder Morgan, Williams Companies (natgas pipelines), ONEOK, Energy Transfer, MPLX, Targa Resources",
        valuation: "8-12x EV/EBITDA. Yield-focused investors value distribution growth and coverage. Premium for long-duration contracts and investment-grade balance sheets. MLP structure provides tax-advantaged distributions.",
        transition: "MLPs converting to C-corps for broader investor base. Midstream pivoting to CO2 pipelines for CCUS and hydrogen transport. Natural gas infrastructure benefiting from LNG export growth and data center power demand.",
      },
      { name: "Contracted PPA (Renewables)", color: "#10B981", icon: "☀️",
        how: "Revenue from long-term Power Purchase Agreements (PPAs) — fixed or escalating price per MWh for 10-25 years. Provides revenue visibility similar to infrastructure assets. Also earn tax credits (ITC/PTC) and Renewable Energy Certificates (RECs).",
        economics: "Unlevered returns: 6-10% (utility-scale solar), 8-12% (onshore wind). IRA tax credits (PTC: $27.50/MWh, ITC: 30%) significantly improve economics. LCOE: solar $30-50/MWh, onshore wind $25-50/MWh. Contracted cash flows support 60-70% project leverage.",
        examples: "NextEra Energy Partners (contracted renewables), Brookfield Renewable, Clearway Energy, AES Corporation, Pattern Energy, corporate PPAs (Google, Amazon, Microsoft)",
        valuation: "YieldCo: 8-12x CAFD (cash available for distribution). Developer: sum-of-parts (operating + pipeline). Premium for contracted backlog and development pipeline. Interest rate sensitivity (infrastructure duration assets).",
        transition: "Corporate PPAs accelerating (tech companies targeting 24/7 clean energy). Storage + solar co-location becoming standard. Offshore wind facing cost resets. IRA provides 10-year policy certainty. Interconnection delays are key bottleneck.",
      },
      { name: "Specialty Chemical Pricing", color: "#0EA5E9", icon: "⚗️",
        how: "Revenue from differentiated chemical products with pricing power — formulations, specifications, and customer qualification create switching costs. Price based on performance value, not commodity benchmarks. Contract or spot pricing with cost pass-through clauses.",
        economics: "Gross margins: 40-55% (vs 15-25% commodity). EBITDA margins: 20-30%. R&D intensity: 3-6% of revenue. Customer qualification cycles: 6-18 months. Long product lifecycles with incremental reformulation. Revenue more stable than commodity chemicals.",
        examples: "Ecolab (water treatment), Sherwin-Williams (coatings), PPG (coatings), Entegris (electronic chemicals), Sika (construction chemicals), Ashland (specialty additives)",
        valuation: "12-18x EBITDA for specialty chemicals (vs 6-8x commodity). Market rewards pricing power, through-cycle stability, and organic growth. M&A-driven roll-up strategies (Danaher model). Margin expansion from portfolio mix shift.",
        transition: "Commodity chemical companies divesting low-margin segments to become 'specialty' (DuPont strategy). Electronic chemicals growing with semiconductor capex. Sustainability reformulation (water-based coatings, bio-based chemicals). Industrial gas business model considered best-in-class (take-or-pay, on-site).",
      },
      { name: "Royalty / Mineral Rights", color: "#8B5CF6", icon: "📜",
        how: "Revenue from owning mineral rights beneath the surface — landowner receives a royalty (typically 12.5-25%) on production without bearing any operating costs or capital expenditure. Pure revenue participation with zero cost basis.",
        economics: "100% gross margin (no operating costs). Revenue = production x commodity price x royalty rate. Zero capex obligation. No environmental liability. Valued on reserves/resources and decline rate. Extremely capital-efficient model.",
        examples: "Texas Pacific Land (largest private landowner in Permian), Viper Energy (Diamondback subsidiary), Freehold Royalties, Black Stone Minerals, Brigham Minerals (Sitio Royalties)",
        valuation: "Premium multiples: 12-18x cash flow. Market values perpetual, zero-cost revenue streams. Key metrics: net royalty acres, production per acre, reserve life, Permian Basin exposure. Scarcity value — mineral rights cannot be created.",
        transition: "Royalty companies consolidating fragmented mineral ownership. Permian Basin premium. Data center power demand creating new royalty opportunities for natural gas minerals. Some companies adding operated working interests for growth.",
      },
    ];
    const EN_CONCEPTS = [
      { title: "Breakeven Price", desc: "The commodity price at which a project or company generates zero economic profit. US shale: $40-55/bbl WTI breakeven. Saudi Aramco: ~$10-15/bbl lifting cost. Copper: $2.50-3.50/lb for most mines. Understanding cost curve position is essential for commodity equity analysis — lowest-cost producers survive cycles." },
      { title: "Reserve Replacement Ratio", desc: "Annual reserves added / annual production. Ratio >1.0x means the company is replacing what it produces (sustaining its asset base). Ratio <1.0x means reserve depletion. For mining, equivalent is 'reserve life' (reserves / annual production). Key sustainability metric for upstream and mining companies." },
      { title: "LCOE (Levelized Cost of Energy)", desc: "The all-in cost to generate one MWh of electricity over a power plant's lifetime, including construction, financing, fuel, and O&M. Solar LCOE: $30-50/MWh. Onshore wind: $25-50/MWh. Natural gas CCGT: $40-75/MWh. LCOE comparisons drive generation investment decisions. Note: does not include integration costs (storage, transmission)." },
      { title: "Crack Spread", desc: "The margin a refinery earns converting crude oil into refined products. Calculated as: (product prices) - (crude oil price). A '3-2-1 crack spread' assumes 3 barrels crude yields 2 barrels gasoline + 1 barrel diesel. Normalized: $10-20/bbl. 2022 spike: $40-60/bbl. Key driver of refining profitability (Valero, Marathon Petroleum)." },
      { title: "Midstream MLP Structure", desc: "Master Limited Partnerships: pass-through entities that avoid corporate tax. Pay out majority of cash flow as distributions. MLPs appeal to income investors (5-8% yields). K-1 tax forms complicate ownership. Many converting to C-corps for index inclusion and broader investor base. Still ~$500B of midstream market cap." },
      { title: "ESG / Energy Transition", desc: "The shift from fossil fuels to clean energy. Oil majors spending 5-15% of capex on low-carbon (hydrogen, CCUS, renewables). IRA allocated $369B for clean energy. Critical minerals (lithium, copper, nickel) are bottleneck for transition. Transition timeline: decades, not years — fossil fuels still ~80% of primary energy." },
      { title: "Decline Curves", desc: "Oil & gas wells produce less over time — initial production (IP) rate declines exponentially. Shale wells: ~70% decline in year 1, ~30% in year 2. Conventional: ~5-15% annual decline. Companies must continuously drill new wells to maintain production (treadmill effect). Decline rate x base production = required maintenance capex." },
    ];
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Energy & Materials Primer</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Oil & gas, renewables, mining, chemicals, and the energy transition value chain</div>
        </div>

        {/* VALUE CHAIN */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Energy & Materials Value Chain</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From resource extraction through processing and distribution to end markets. ~$8T global energy market (2025).</div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {EN_VALUE_CHAIN.map((stage, i, arr) => (
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
        </div>

        {/* TAXONOMY */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Energy & Materials Taxonomy</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EN_TAX.map(cat => (
              <div key={cat.key}>
                <div onClick={() => toggle("entax_" + cat.key)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                  background: isExp("entax_" + cat.key) ? cat.color + "22" : T_.bg,
                  borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("entax_" + cat.key) ? cat.color + "44" : T_.border}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("entax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                </div>
                {isExp("entax_" + cat.key) && (
                  <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    {cat.children.map(childKey => {
                      const sub = EN_SUBS[childKey];
                      if (!sub) return null;
                      return (
                        <div key={childKey} onClick={() => toggle("ensub_" + childKey)} style={{
                          padding: "10px 16px", background: isExp("ensub_" + childKey) ? T_.bgInput : T_.bg,
                          borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("ensub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("ensub_" + childKey) && (
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

        {/* SUBSECTOR TAM CARDS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Addressable market estimates and growth rates across energy & materials subsectors.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {Object.entries(EN_SUBS).map(([key, sub]) => (
              <div key={key} style={{
                padding: "14px 16px", background: T_.bg, borderRadius: 8,
                border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer",
              }} onClick={() => {
                const cat = EN_TAX.find(t => t.children.includes(key));
                if (cat) toggle("entax_" + cat.key);
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

        {/* REVENUE MODELS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Energy & Materials Revenue Models</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How energy and materials companies generate revenue. The key distinction is commodity exposure (price-taker) vs contracted/fee-based (pricing power).</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {EN_REV_MODELS.map((model, i) => (
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

        {/* KEY CONCEPTS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {EN_CONCEPTS.map((c, i) => (
              <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>
          Sources: EIA, IEA World Energy Outlook, BloombergNEF, Wood Mackenzie, S&P Global Commodity Insights, company 10-Ks. TAM and growth rates are approximate 2025 estimates.
        </div>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════
  // 4. REAL ESTATE
  // ═══════════════════════════════════════════════════════
  if (subTab === "realestate") {
    const RE_SUBS = {
      reitoffice: { name: "Office REITs", fullName: "Office Real Estate Investment Trusts", category: "REITs", color: "#3B82F6",
        tam: "$250B+ (2025, US office REIT equity)", growth: "~0-2% CAGR", icon: "🏢",
        desc: "REITs owning and operating office buildings — CBD high-rises, suburban office parks, and life science/lab buildings. Post-COVID work-from-home has structurally impaired traditional office demand.",
        whatTheySell: "Office space leased to tenants (5-10 year leases), building services, parking, conference facilities. Life science/lab space commands premium rents.",
        whoBuys: "Corporate tenants (law firms, financial services, tech companies), government agencies, life science/biotech companies.",
        keyPlayers: ["Boston Properties (BXP)", "Vornado Realty Trust", "SL Green Realty", "Kilroy Realty", "Alexandria Real Estate (life science)", "Healthpeak (life science)"],
        trends: "National office vacancy ~20%+ (highest in decades). Work-from-home structural headwind. Flight to quality (Class A trophy assets outperform). Life science/lab space much healthier (~5-8% vacancy). Conversions to residential accelerating.",
      },
      reitindustrial: { name: "Industrial REITs", fullName: "Industrial & Logistics Real Estate Investment Trusts", category: "REITs", color: "#10B981",
        tam: "$600B+ (2025, global industrial REIT equity)", growth: "~5-7% CAGR", icon: "🏗️",
        desc: "REITs owning warehouses, distribution centers, fulfillment facilities, and cold storage. E-commerce structural tailwind driving demand. Best-performing REIT sector over the past decade.",
        whatTheySell: "Warehouse/logistics space (3-7 year leases), last-mile distribution facilities, cold storage, data center-adjacent logistics.",
        whoBuys: "E-commerce (Amazon, Walmart), third-party logistics (3PL) providers, retailers, food/beverage, manufacturers.",
        keyPlayers: ["Prologis (largest — $110B+ market cap, ~1.2B sq ft)", "Duke Realty (Prologis)", "Rexford Industrial", "EastGroup Properties", "STAG Industrial", "Lineage (cold storage)"],
        trends: "E-commerce penetration driving warehouse demand (~3x sq ft vs brick-and-mortar per $1 of sales). Supply normalizing after 2021-2022 construction boom. Nearshoring/reshoring creating new demand. Mark-to-market rent spreads 40-60%+ for in-place leases.",
      },
      reitretail: { name: "Retail REITs", fullName: "Retail Real Estate Investment Trusts", category: "REITs", color: "#F59E0B",
        tam: "$200B+ (2025, US retail REIT equity)", growth: "~2-4% CAGR", icon: "🛒",
        desc: "REITs owning shopping centers, malls, outlets, and net lease retail properties. Bifurcated market: open-air grocery-anchored performing well, enclosed malls struggling.",
        whatTheySell: "Retail space leased to tenants, percentage rent (share of tenant sales), common area maintenance (CAM) fees, advertising/sponsorships.",
        whoBuys: "Grocery chains, restaurants, essential retailers (TJX, Dollar General), fitness, medical/dental, enclosed mall tenants (declining).",
        keyPlayers: ["Simon Property Group (malls/outlets)", "Realty Income (net lease)", "Kimco Realty (open-air)", "Regency Centers (grocery-anchored)", "NNN REIT (net lease)", "Agree Realty"],
        trends: "Open-air/grocery-anchored at 95%+ occupancy. Enclosed malls bifurcated: A-malls survive, B/C malls converting. Net lease (NNN) REITs growing via sale-leaseback acquisitions. Limited new retail construction supporting rent growth.",
      },
      reitresidential: { name: "Residential REITs", fullName: "Residential & Apartment Real Estate Investment Trusts", category: "REITs", color: "#8B5CF6",
        tam: "$250B+ (2025, US residential REIT equity)", growth: "~3-5% CAGR", icon: "🏠",
        desc: "REITs owning multifamily apartments, manufactured housing communities, and single-family rental homes. Benefits from housing affordability crisis limiting homeownership.",
        whatTheySell: "Apartment units (12-month leases), manufactured home sites, single-family rental homes, student housing, senior housing.",
        whoBuys: "Renters (individuals and families), students, seniors, workforce housing tenants.",
        keyPlayers: ["AvalonBay Communities", "Equity Residential", "Mid-America Apartment (MAA)", "Camden Property Trust", "Invitation Homes (SFR)", "Sun Communities (manufactured)", "American Homes 4 Rent"],
        trends: "Supply wave in Sunbelt markets (2024-2025) moderating rent growth. Coastal markets recovering. SFR (single-family rental) institutional ownership growing. Housing affordability keeping people in rental longer. Manufactured housing consistent performer.",
      },
      reitdatacenter: { name: "Data Center REITs", fullName: "Data Center Real Estate Investment Trusts", category: "REITs", color: "#06B6D4",
        tam: "$150B+ (2025, global data center REIT equity)", growth: "~15-20% CAGR", icon: "🖥️",
        desc: "REITs owning and operating data center facilities — colocation, hyperscale, and interconnection. Massive AI-driven demand creating the tightest supply-demand imbalance in any REIT sector.",
        whatTheySell: "Colocation space (cabinets, cages, suites), power capacity (per kW), interconnection (cross-connects), hyperscale build-to-suit leases. Power is the primary constraint.",
        whoBuys: "Hyperscalers (AWS, Azure, Google — largest tenants), enterprises, cloud providers, network providers, AI companies.",
        keyPlayers: ["Equinix (largest — $80B+ market cap, 260+ data centers)", "Digital Realty", "CyrusOne (KKR — private)", "QTS (Blackstone — private)", "CoreWeave (AI-focused)", "Switch"],
        trends: "AI driving unprecedented power demand (GPUs need 3-5x more power than traditional servers). Primary markets at <3% vacancy. Power availability is the bottleneck, not space. Multi-year lease commitments with 2-3% annual escalators. Nuclear/renewable power sourcing becoming competitive advantage.",
      },
      reithealthcare: { name: "Healthcare REITs", fullName: "Healthcare Real Estate Investment Trusts", category: "REITs", color: "#EF4444",
        tam: "$120B+ (2025, US healthcare REIT equity)", growth: "~3-5% CAGR", icon: "🏥",
        desc: "REITs owning medical office buildings, senior housing, skilled nursing facilities, hospitals, and life science buildings. Aging demographics provide long-term demand tailwind.",
        whatTheySell: "Medical office space, senior housing (operating and NNN), skilled nursing facilities, hospital buildings, post-acute care facilities.",
        whoBuys: "Physician groups, hospital systems, senior housing operators, skilled nursing operators, life science companies.",
        keyPlayers: ["Welltower (largest healthcare REIT)", "Ventas", "Healthpeak Properties", "Sabra Health Care REIT", "CareTrust REIT", "Medical Properties Trust"],
        trends: "Senior housing recovery post-COVID (occupancy rising from ~78% trough to ~85%+). Medical office stable but facing outpatient migration. Skilled nursing under reimbursement pressure. Senior housing supply limited (construction starts at 20-year lows).",
      },
      homebuilders: { name: "Homebuilders", fullName: "Residential Homebuilders & Land Developers", category: "Homebuilders", color: "#84CC16",
        tam: "$450B+ (2025, US new home sales)", growth: "~3-5% CAGR", icon: "🏡",
        desc: "Companies that acquire land, develop lots, and build single-family and multi-family homes for sale. Benefiting from chronic housing undersupply and lock-in effect (existing homeowners reluctant to sell at higher mortgage rates).",
        whatTheySell: "New single-family homes, townhomes, condominiums, lot development, mortgage origination (captive mortgage companies), title insurance.",
        whoBuys: "First-time homebuyers, move-up buyers, investors/rental operators, 55+ active adult buyers.",
        keyPlayers: ["D.R. Horton (largest — ~90K homes/year)", "Lennar", "NVR", "PulteGroup", "Toll Brothers (luxury)", "Meritage Homes", "Taylor Morrison"],
        trends: "Housing shortage of 3-5M units in US. Existing home inventory at historic lows (lock-in effect at 7%+ mortgage rates). Builders gaining share vs resale market. Land-light models (NVR, Meritage) gaining favor. Incentives (rate buydowns) replacing price cuts.",
      },
      creservices: { name: "CRE Services", fullName: "Commercial Real Estate Services & Brokerage", category: "Services", color: "#0EA5E9",
        tam: "$60B+ (2025, global CRE services)", growth: "~4-6% CAGR", icon: "📋",
        desc: "Advisory, brokerage, property management, and valuation services for commercial real estate owners, tenants, and investors.",
        whatTheySell: "Leasing brokerage, investment sales, property/facilities management, valuation/appraisal, project management, workplace consulting.",
        whoBuys: "Property owners/REITs, corporate occupiers, institutional investors, developers, government.",
        keyPlayers: ["CBRE Group (largest — $32B+ revenue)", "Jones Lang LaSalle (JLL)", "Cushman & Wakefield", "Colliers", "Newmark Group", "Marcus & Millichap (investment sales)"],
        trends: "Transaction volumes recovering from 2023-2024 trough. Property management outsourcing growing. Workplace strategy consulting (post-COVID office optimization). PropTech integration. Recurring revenue mix increasing (managed services > transaction fees).",
      },
      proptech: { name: "PropTech", fullName: "Property Technology & Real Estate Software", category: "Technology", color: "#F97316",
        tam: "$25B+ (2025)", growth: "~12-15% CAGR", icon: "💻",
        desc: "Technology platforms for real estate — property management software, listing platforms, mortgage technology, construction tech, and data/analytics platforms.",
        whatTheySell: "Property management software, listing/marketplace platforms, mortgage origination technology, construction management, tenant experience apps, real estate data/analytics.",
        whoBuys: "Property managers, landlords, brokers, mortgage lenders, developers, tenants/renters.",
        keyPlayers: ["CoStar Group (data/listings — $35B+ market cap)", "Yardi Systems (PM software)", "RealPage (Thoma Bravo)", "AppFolio", "Zillow (consumer listings)", "Procore (construction)"],
        trends: "AI for property valuation and market analytics. CoStar dominance in CRE data. RealPage antitrust scrutiny (algorithmic pricing). Tenant experience platforms growing. Digital mortgage/closing technology.",
      },
      mortgage: { name: "Mortgage & Lending", fullName: "Mortgage Origination, Servicing & Lending", category: "Financial", color: "#6366F1",
        tam: "$200B+ (2025, US mortgage industry revenue)", growth: "~2-4% CAGR (cyclical)", icon: "🏦",
        desc: "Companies originating, servicing, and securitizing residential and commercial mortgages. Highly rate-sensitive and cyclical business.",
        whatTheySell: "Mortgage origination (purchase + refinance), mortgage servicing (monthly payment collection), commercial real estate lending, bridge/mezzanine lending, mortgage insurance.",
        whoBuys: "Homebuyers (residential), property owners/developers (commercial), GSEs (Fannie/Freddie for securitization), institutional investors (MBS).",
        keyPlayers: ["Rocket Mortgage (largest non-bank originator)", "United Wholesale Mortgage", "loanDepot", "Pennymac Financial", "Mr. Cooper (servicing)", "Radian/MGIC (mortgage insurance)"],
        trends: "Origination volume depressed at 7%+ mortgage rates (down ~60% from 2021 peak). Servicing income elevated (MSR values rise with rates). Non-bank lenders gaining share from banks (now ~70%+ of originations). Digital mortgage experience improving. Rate cut expectations driving refi outlook.",
      },
    };
    const RE_TAX = [
      { key: "reits", label: "REITs", color: "#3B82F6", icon: "🏢", children: ["reitoffice", "reitindustrial", "reitretail", "reitresidential", "reitdatacenter", "reithealthcare"] },
      { key: "builders", label: "Homebuilders", color: "#84CC16", icon: "🏡", children: ["homebuilders"] },
      { key: "services", label: "CRE Services", color: "#0EA5E9", icon: "📋", children: ["creservices"] },
      { key: "tech", label: "PropTech", color: "#F97316", icon: "💻", children: ["proptech"] },
      { key: "finance", label: "Mortgage & Lending", color: "#6366F1", icon: "🏦", children: ["mortgage"] },
    ];
    const RE_VALUE_CHAIN = [
      { label: "Land / Development", color: "#84CC16", icon: "🌍", desc: "Land acquisition & entitlement", rows: [{ sub: "Land Banks", ex: "D.R. Horton, Lennar, NVR" }, { sub: "Developers", ex: "Brookfield, Hines, Related" }, { sub: "Entitlement", ex: "Zoning, permits, approvals" }], buyers: "Developers, homebuilders, investors" },
      { label: "Construction", color: "#F59E0B", icon: "🏗️", desc: "Building & delivering assets", rows: [{ sub: "General Contractors", ex: "Turner, Bechtel, AECOM" }, { sub: "Homebuilders", ex: "D.R. Horton, Lennar, PulteGroup" }, { sub: "Materials", ex: "Vulcan, Martin Marietta, CRH" }], buyers: "Developers, property owners" },
      { label: "Ownership / REIT", color: "#3B82F6", icon: "🏢", desc: "Asset ownership & capital structure", rows: [{ sub: "Public REITs", ex: "Prologis, Equinix, Welltower" }, { sub: "Private RE Funds", ex: "Blackstone, Brookfield, Starwood" }, { sub: "Direct Owners", ex: "Institutions, family offices" }], buyers: "Investors (equity + debt)" },
      { label: "Property Management", color: "#8B5CF6", icon: "🔧", desc: "Operating & maintaining assets", rows: [{ sub: "CRE Services", ex: "CBRE, JLL, Cushman" }, { sub: "Residential PM", ex: "Greystar, Lincoln Property" }, { sub: "PropTech", ex: "Yardi, RealPage, AppFolio" }], buyers: "Property owners, REITs" },
      { label: "Tenants / Buyers", color: "#6366F1", icon: "👥", desc: "End users of real estate", rows: [{ sub: "Corporate", ex: "Office, retail, industrial tenants" }, { sub: "Residential", ex: "Renters, homebuyers" }, { sub: "Specialized", ex: "Data centers, healthcare, storage" }], buyers: "Consumers, businesses" },
    ];
    const RE_REV_MODELS = [
      { name: "Rental Income (NOI)", color: "#3B82F6", icon: "🏢",
        how: "Revenue from leasing property to tenants. Net Operating Income (NOI) = rental revenue + other property income - operating expenses (property taxes, insurance, maintenance, utilities). NOI is the fundamental building block of real estate valuation.",
        economics: "NOI margins: 60-75% (varies by property type). Cap rates: 4-8% (NOI / property value). Same-store NOI growth: 2-5% for healthy REITs. Lease structures: triple net (NNN — tenant pays all expenses), gross, modified gross. Long lease terms provide visibility.",
        examples: "Prologis (industrial — 97% occupancy, 60%+ mark-to-market), Equinix (data center — $6B+ revenue, ~50% NOI margin), Realty Income (NNN retail — 99%+ occupancy), AvalonBay (apartments — 95%+ occupancy)",
        valuation: "REITs valued on P/FFO (14-25x), EV/EBITDA (15-25x), and NAV (premium/discount). Cap rate compression = value increase. Growth REITs (data center, industrial) trade at premium. Value REITs (office, retail) at discount.",
        transition: "NOI growth drivers: rent escalators (2-3% annual), mark-to-market on lease expiry, occupancy gains, and redevelopment. Expense management (energy efficiency, proptech) improving margins. Triple net structures shift expense risk to tenants.",
      },
      { name: "Development Gains", color: "#84CC16", icon: "🏗️",
        how: "Revenue from developing properties and selling or capitalizing them at values above development cost. Spread between development cost and stabilized value (development yield vs market cap rate). Higher risk but higher return than acquiring stabilized assets.",
        economics: "Development margins: 15-30% on cost (yield on cost of 6-9% vs cap rates of 4-6%). Construction period: 12-36 months. Pre-leasing reduces risk. Merchant build (sell upon completion) vs build-to-hold (retain in portfolio). Land cost: 15-25% of total development cost.",
        examples: "Prologis ($5B+ annual development starts), AvalonBay ($2B+ pipeline), homebuilders (D.R. Horton gross margin ~24%), Brookfield Asset Management (fund-level development)",
        valuation: "Development pipeline valued at risk-adjusted margin. Homebuilders: 1.0-2.0x book value. REIT developers: NAV premium for development pipeline. Key risk: construction cost overruns, lease-up delays, interest rate increases during construction.",
        transition: "REITs shifting from pure acquisition to development (higher returns). Homebuilders adopting land-light strategies (options vs ownership). Build-to-rent emerging as hybrid model. Modular/prefab construction reducing timelines and costs.",
      },
      { name: "Brokerage / Advisory Fees", color: "#0EA5E9", icon: "📋",
        how: "Revenue from commissions on property sales (investment sales) and leasing transactions, plus advisory fees for valuation, consulting, and capital markets services. Highly cyclical — transaction volumes drive revenue.",
        economics: "Leasing commissions: 2-6% of total lease value. Investment sales: 0.5-3% of transaction value. Advisory fees: fixed or hourly. Revenue is lumpy/cyclical. Operating margins: 10-18%. Transaction revenue: 40-60% of total for major firms. Managed services growing to smooth cycles.",
        examples: "CBRE ($32B+ revenue, 50%+ from advisory/transaction), JLL ($20B+ revenue), Cushman & Wakefield, Newmark Group, Marcus & Millichap (pure investment sales)",
        valuation: "10-14x EBITDA for diversified CRE services. Premium for recurring revenue mix (property/facilities management). Discount for transaction-heavy mix. M&A active — firms acquiring PM, project management, and tech platforms to diversify.",
        transition: "Shift from transaction-dependent to recurring managed services (property management, outsourced corporate real estate). Technology investment in data analytics and AI. Consolidation continuing as scale drives competitive advantage.",
      },
      { name: "Mortgage Origination & Servicing", color: "#6366F1", icon: "🏦",
        how: "Revenue from originating mortgages (gain on sale margin) and servicing existing loans (monthly servicing fee, typically 0.25-0.44% of loan balance annually). Origination is cyclical; servicing is more stable and inversely correlated with origination (rising rates hurt origination but increase servicing values).",
        economics: "Origination gain on sale margin: 50-150 bps. Servicing fee: 25-44 bps annually. MSR value rises with interest rates (prepayment risk decreases). Total industry origination: ~$1.5T (2025E, depressed). Servicing portfolios: $12T+ total US mortgage debt outstanding.",
        examples: "Rocket Mortgage ($500B+ total originations since 2015), United Wholesale Mortgage, Pennymac (origination + servicing), Mr. Cooper ($900B+ servicing portfolio), mortgage REITs (Annaly, AGNC)",
        valuation: "Originators: 1-3x book value (cyclical). Servicers: value of MSR portfolio + platform. Mortgage REITs: 0.8-1.2x book value, valued on dividend yield and book value stability. GSE reform remains wildcard.",
        transition: "Digital mortgage experience improving (Rocket pioneered). Non-bank lenders dominant (70%+ market share). Rising rates shift value to servicing. Potential for GSE reform (Fannie/Freddie privatization) under future administrations. AI for underwriting automation.",
      },
      { name: "Property Management Fees", color: "#8B5CF6", icon: "🔧",
        how: "Revenue from managing properties on behalf of owners — typically 2-5% of collected rent for residential, 1-4% of revenue for commercial. Includes leasing, maintenance, tenant relations, and financial reporting. Recurring and scalable.",
        economics: "Fee margins: 15-25% (labor-intensive). Revenue per unit: $50-200/month (residential), varies widely for commercial. Scale advantages: technology and centralized services improve margins at scale. Ancillary revenue from maintenance, insurance programs, and vendor rebates.",
        examples: "Greystar (largest apartment manager — 800K+ units), CBRE (largest commercial PM), Lincoln Property Company, RealPage/Yardi (tech-enabled PM), AppFolio (SMB PM software)",
        valuation: "PM businesses valued at 10-15x EBITDA. Premium for technology-enabled platforms and recurring contract base. Key metric: units/properties under management and retention rate. PropTech companies valued at higher SaaS multiples (5-10x revenue).",
        transition: "Technology transforming PM — AI for maintenance prediction, automated leasing, smart building management. Consolidation as tech-enabled managers gain share. Resident experience apps becoming expected. ESG/sustainability reporting requirements growing.",
      },
      { name: "REIT Distribution Model", color: "#F59E0B", icon: "💰",
        how: "REITs must distribute 90%+ of taxable income to shareholders as dividends. In exchange, REITs avoid corporate-level taxation. Investors receive income (dividends) plus potential capital appreciation from NAV growth. FFO (Funds from Operations) replaces earnings as the key profitability metric.",
        economics: "REIT dividend yields: 3-6% (varies by sector). Payout ratio: 60-80% of AFFO (adjusted FFO) is sustainable. Internal growth funded by retained cash flow + external capital (equity issuance, debt). Cost of capital discipline: only issue equity above NAV.",
        examples: "Realty Income (monthly dividend, 55+ year track record), Prologis (industrial REIT, ~2.5% yield + growth), Equinix (data center REIT, ~2% yield + 10%+ growth), Simon Property (mall REIT, ~5% yield)",
        valuation: "P/FFO: 14-25x (growth REITs higher). P/AFFO adjusts for maintenance capex. NAV: property values estimated using cap rates applied to NOI. Premium to NAV = market believes in future growth. Discount to NAV = market sees risk or value opportunity.",
        transition: "Low rate environment (2010-2021) drove REIT outperformance. Rising rates (2022-2024) pressured valuations. Future: AI-driven demand (data centers), housing shortage (residential), and e-commerce (industrial) create sector-specific tailwinds despite higher rates.",
      },
    ];
    const RE_CONCEPTS = [
      { title: "Cap Rate", desc: "Capitalization rate = NOI / Property Value. Inverse of a price-to-earnings ratio for real estate. Lower cap rate = higher value (more expensive). Industrial: 4-5%, Multifamily: 4.5-5.5%, Office: 6-8%+ (post-COVID), Retail: 5-7%. Cap rate = risk-free rate + risk premium. Rising interest rates generally push cap rates up (values down)." },
      { title: "NOI (Net Operating Income)", desc: "Property-level revenue minus property-level operating expenses (before debt service, capex, and corporate overhead). The fundamental unit of real estate value. Same-store NOI growth measures organic performance of the existing portfolio, excluding acquisitions and developments. Healthy REITs target 3-5% same-store NOI growth." },
      { title: "FFO / AFFO", desc: "Funds From Operations: net income + depreciation/amortization - gains on property sales. The REIT equivalent of earnings. AFFO (Adjusted FFO) further deducts maintenance capex and straight-line rent adjustments. AFFO is the best measure of recurring cash flow and dividend-paying capacity. P/AFFO is the REIT equivalent of P/E ratio." },
      { title: "Occupancy Rate", desc: "Percentage of rentable space that is leased. Physical occupancy (space in use) vs economic occupancy (revenue collected vs potential). Industrial: 95-98%, Multifamily: 94-96%, Retail: 92-96%, Office: 82-90% (post-COVID). Even small occupancy changes have outsized impact on NOI (high operating leverage)." },
      { title: "NAV (Net Asset Value)", desc: "Estimated market value of all properties minus debt. Calculated by applying cap rates to property-level NOI. P/NAV: >1.0x = premium (market expects growth), <1.0x = discount (potential value opportunity or structural concern). Activist investors target REITs trading at persistent NAV discounts." },
      { title: "LTV Ratio & Interest Rate Sensitivity", desc: "Loan-to-Value: total debt / total property value. Healthy REITs: 25-40% LTV. Higher LTV = more leveraged, more rate-sensitive. A 100bp rate increase on $10B of floating rate debt = $100M annual interest cost. Most REITs use fixed-rate debt with staggered maturities to reduce sensitivity. Balance sheet strength is critical in downturns." },
    ];
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Real Estate Primer</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>REITs, homebuilders, CRE services, PropTech, and real estate value chain</div>
        </div>

        {/* VALUE CHAIN */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Real Estate Value Chain</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From land development through ownership and management to end occupants. ~$45T US commercial + residential real estate (2025).</div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {RE_VALUE_CHAIN.map((stage, i, arr) => (
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
        </div>

        {/* TAXONOMY */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Real Estate Taxonomy</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RE_TAX.map(cat => (
              <div key={cat.key}>
                <div onClick={() => toggle("retax_" + cat.key)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                  background: isExp("retax_" + cat.key) ? cat.color + "22" : T_.bg,
                  borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("retax_" + cat.key) ? cat.color + "44" : T_.border}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("retax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                </div>
                {isExp("retax_" + cat.key) && (
                  <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    {cat.children.map(childKey => {
                      const sub = RE_SUBS[childKey];
                      if (!sub) return null;
                      return (
                        <div key={childKey} onClick={() => toggle("resub_" + childKey)} style={{
                          padding: "10px 16px", background: isExp("resub_" + childKey) ? T_.bgInput : T_.bg,
                          borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("resub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("resub_" + childKey) && (
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

        {/* SUBSECTOR TAM CARDS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Addressable market estimates and growth rates across real estate subsectors.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {Object.entries(RE_SUBS).map(([key, sub]) => (
              <div key={key} style={{
                padding: "14px 16px", background: T_.bg, borderRadius: 8,
                border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer",
              }} onClick={() => {
                const cat = RE_TAX.find(t => t.children.includes(key));
                if (cat) toggle("retax_" + cat.key);
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

        {/* REVENUE MODELS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Real Estate Revenue Models</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How real estate companies generate revenue. Understanding the NOI waterfall, REIT distribution structure, and cap rate dynamics is essential for real estate investing.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {RE_REV_MODELS.map((model, i) => (
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

        {/* KEY CONCEPTS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {RE_CONCEPTS.map((c, i) => (
              <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>
          Sources: Nareit, CBRE Research, Green Street Advisors, CoStar, company 10-Ks, Federal Reserve Flow of Funds. TAM and growth rates are approximate 2025 estimates.
        </div>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════
  // 5. UTILITIES
  // ═══════════════════════════════════════════════════════
  if (subTab === "utilities") {
    const UT_SUBS = {
      regelectric: { name: "Regulated Electric Utilities", fullName: "Regulated Electric Utility Companies", category: "Regulated Utilities", color: "#F59E0B",
        tam: "$500B+ (2025, US electric utility revenue)", growth: "~4-6% CAGR", icon: "⚡",
        desc: "Vertically integrated or transmission/distribution-only electric utilities operating under state regulatory commissions. Earn an allowed return on equity (ROE) on invested capital (rate base). The classic regulated utility model.",
        whatTheySell: "Electricity delivery (generation, transmission, distribution), grid reliability, customer service, energy efficiency programs, EV charging infrastructure.",
        whoBuys: "Residential, commercial, and industrial customers (captive — no choice of provider in most service territories). State regulators set rates.",
        keyPlayers: ["NextEra Energy (largest US utility by market cap — $160B+)", "Duke Energy", "Southern Company", "Dominion Energy", "American Electric Power (AEP)", "Xcel Energy", "Entergy"],
        trends: "Data center load growth creating unprecedented demand (5-7% annual growth vs historic 0-1%). Grid modernization/hardening investment. Renewable portfolio standards driving clean energy capex. Rate base growth of 6-8% supporting earnings growth. Wildfire risk management (California).",
      },
      reggas: { name: "Regulated Gas Utilities", fullName: "Regulated Natural Gas Distribution Utilities", category: "Regulated Utilities", color: "#3B82F6",
        tam: "$80B+ (2025, US gas utility revenue)", growth: "~3-5% CAGR", icon: "🔥",
        desc: "Local distribution companies (LDCs) delivering natural gas to residential, commercial, and industrial customers through regulated pipeline networks.",
        whatTheySell: "Natural gas delivery (not the commodity itself — gas cost is a pass-through), pipeline safety upgrades, meter/service installation, energy efficiency programs.",
        whoBuys: "Residential (heating/cooking), commercial (restaurants, offices), industrial (manufacturing, CHP), power generators.",
        keyPlayers: ["Southern Union (Sempra)", "Atmos Energy (pure-play gas LDC)", "South Jersey Industries", "New Jersey Resources", "Spire Inc.", "National Fuel Gas", "WGL Holdings"],
        trends: "Pipeline replacement programs driving rate base growth (aging infrastructure). Electrification risk from building codes (some cities banning new gas hookups). Renewable natural gas (RNG) and hydrogen blending as decarbonization pathways. Weather normalization mechanisms reducing earnings volatility.",
      },
      water: { name: "Water Utilities", fullName: "Regulated Water & Wastewater Utilities", category: "Regulated Utilities", color: "#0EA5E9",
        tam: "$40B+ (2025, US water utility revenue)", growth: "~5-7% CAGR", icon: "💧",
        desc: "Regulated water and wastewater utilities providing essential water supply, treatment, and wastewater collection/treatment services. Highly fragmented — 50,000+ water systems in the US, mostly municipal.",
        whatTheySell: "Potable water supply and distribution, wastewater collection and treatment, water quality testing, fire protection, stormwater management.",
        whoBuys: "Residential, commercial, industrial, and municipal customers. State PUCs regulate rates.",
        keyPlayers: ["American Water Works (largest — 14M+ people served)", "Essential Utilities (Aqua America)", "California Water Service", "SJW Group", "York Water (oldest US utility — 1816)", "Middlesex Water"],
        trends: "Municipal system acquisitions driving consolidation (fair market value legislation in 15+ states). Lead pipe replacement mandated by EPA. PFAS treatment requirements creating investment need. Rate base growth 7-9% for acquirers. Most defensive utility subsector.",
      },
      ipp: { name: "Independent Power Producers (IPPs)", fullName: "Independent Power Producers & Competitive Generators", category: "Competitive Generation", color: "#EF4444",
        tam: "$150B+ (2025, US competitive gen revenue)", growth: "~3-5% CAGR", icon: "🏭",
        desc: "Unregulated power generators selling electricity into competitive wholesale markets or via bilateral contracts. Own nuclear, gas, coal, and renewable assets. Revenue driven by power prices, capacity payments, and ancillary services.",
        whatTheySell: "Wholesale electricity (energy market), capacity payments (reliability), ancillary services (frequency regulation, reserves), clean energy attributes (RECs, carbon-free credits).",
        whoBuys: "Utilities (wholesale procurement), grid operators (PJM, ERCOT, CAISO), large C&I customers (bilateral PPAs), data center operators (clean energy PPAs).",
        keyPlayers: ["Vistra Corp (largest competitive gen)", "Constellation Energy (largest nuclear fleet — 32 GW)", "NRG Energy", "Talen Energy", "AES Corporation"],
        trends: "Nuclear renaissance driven by AI/data center demand for 24/7 carbon-free power. Constellation stock 5x'd in 2024 on nuclear re-rating. Power prices elevated in deregulated markets. Capacity market reforms. Coal retirements tightening supply-demand. Data centers signing 10-20 year nuclear PPAs.",
      },
      cleandev: { name: "Renewable / Clean Energy Developers", fullName: "Renewable Energy Development & YieldCos", category: "Clean Energy", color: "#10B981",
        tam: "$100B+ (2025, global renewable project equity)", growth: "~12-15% CAGR", icon: "☀️",
        desc: "Companies developing, building, and operating utility-scale solar, wind, and battery storage projects. Revenue from long-term PPAs and merchant sales. Includes YieldCos that own operating contracted assets.",
        whatTheySell: "Utility-scale solar and wind generation (via PPAs), battery storage services, renewable energy certificates (RECs), development pipeline, operating assets via YieldCos.",
        whoBuys: "Utilities (procurement targets), corporate buyers (C&I PPAs from Google, Amazon, Meta), community choice aggregators, grid operators.",
        keyPlayers: ["NextEra Energy Resources (NextEra's unregulated arm)", "Brookfield Renewable Partners", "Clearway Energy", "AES Clean Energy", "Invenergy (private)", "Orsted (offshore wind)", "Pattern Energy (CPPIB)"],
        trends: "IRA providing 10-year PTC/ITC visibility. Solar + storage co-location standard. Interconnection delays (4-5 year queue in some regions). Offshore wind cost resets (Orsted writedowns). Corporate PPA demand exceeding supply. Battery storage economics improving rapidly.",
      },
      multiutil: { name: "Multi-Utility Holding Companies", fullName: "Diversified Multi-Utility Holding Companies", category: "Diversified", color: "#8B5CF6",
        tam: "$300B+ (2025, US multi-utility market cap)", growth: "~4-6% CAGR", icon: "🏛️",
        desc: "Holding companies owning regulated electric, gas, and sometimes water utilities plus unregulated businesses (generation, trading, midstream). Diversification provides earnings stability.",
        whatTheySell: "Bundled utility services across multiple commodities (electric + gas), regulated T&D, competitive generation, energy trading, midstream/pipeline operations.",
        whoBuys: "Captive utility customers across service territories, wholesale power buyers, pipeline shippers.",
        keyPlayers: ["Sempra (electric + gas + LNG)", "CenterPoint Energy", "Eversource Energy", "WEC Energy Group", "Ameren Corporation", "CMS Energy", "DTE Energy", "Evergy"],
        trends: "Simplification trend — companies divesting unregulated assets to focus on regulated rate base growth (lower risk, higher multiple). Data center demand driving electric utility premium. Gas utility exposure increasingly viewed as potential stranded asset risk. Grid investment creating multi-decade capex runway.",
      },
    };
    const UT_TAX = [
      { key: "regulated", label: "Regulated Utilities", color: "#F59E0B", icon: "⚡", children: ["regelectric", "reggas", "water"] },
      { key: "competitive", label: "Competitive Generation", color: "#EF4444", icon: "🏭", children: ["ipp"] },
      { key: "clean", label: "Clean Energy", color: "#10B981", icon: "☀️", children: ["cleandev"] },
      { key: "diversified", label: "Diversified Multi-Utility", color: "#8B5CF6", icon: "🏛️", children: ["multiutil"] },
    ];
    const UT_VALUE_CHAIN = [
      { label: "Generation", color: "#EF4444", icon: "🏭", desc: "Power production", rows: [{ sub: "Nuclear", ex: "Constellation, Southern, Duke" }, { sub: "Natural Gas", ex: "Vistra, NRG, Calpine" }, { sub: "Renewables", ex: "NextEra, Brookfield, AES" }, { sub: "Coal (declining)", ex: "AEP, Duke (retiring)" }], buyers: "Grid operators, utilities, C&I" },
      { label: "Transmission", color: "#F59E0B", icon: "⚡", desc: "High-voltage bulk transport", rows: [{ sub: "Regulated T&D", ex: "AEP, Eversource, Entergy" }, { sub: "Merchant Tx", ex: "ITC Holdings, MidAmerican" }, { sub: "Grid Operators", ex: "PJM, ERCOT, CAISO, MISO" }], buyers: "Distribution utilities, large users" },
      { label: "Distribution", color: "#3B82F6", icon: "🔌", desc: "Local delivery to customers", rows: [{ sub: "Electric LDC", ex: "Duke, Southern, Xcel" }, { sub: "Gas LDC", ex: "Atmos, Spire, NJR" }, { sub: "Water", ex: "American Water, Essential" }], buyers: "End-use residential/C&I customers" },
      { label: "Retail / Customer", color: "#10B981", icon: "🏠", desc: "Billing, metering, programs", rows: [{ sub: "Regulated Retail", ex: "Bundled utility service" }, { sub: "Competitive Retail", ex: "TXU, Constellation, NRG" }, { sub: "DER / Rooftop", ex: "Sunrun, SunPower, Tesla" }], buyers: "Consumers, businesses" },
      { label: "Regulation / Rate Setting", color: "#8B5CF6", icon: "⚖️", desc: "Oversight & rate approval", rows: [{ sub: "State PUCs", ex: "CPUC, NYPSC, PUCT" }, { sub: "FERC", ex: "Interstate transmission/gas" }, { sub: "EPA / Emissions", ex: "Clean Air Act, PFAS rules" }], buyers: "Utilities (compliance), ratepayers" },
    ];
    const UT_REV_MODELS = [
      { name: "Regulated Rate Base (Cost-of-Service)", color: "#F59E0B", icon: "⚖️",
        how: "Revenue determined by regulators to cover prudently incurred costs plus an allowed return on invested capital (rate base). Formula: Revenue Requirement = Operating Expenses + Depreciation + Taxes + (Rate Base x Allowed ROE). Rate cases filed every 2-4 years to reset rates. Between rate cases, earnings can lag if costs rise faster than rates.",
        economics: "Allowed ROE: 9.0-10.5% (currently ~9.8% national average). Rate base growth: 6-9% for capex-intensive utilities. Earned ROE often 50-100bp below allowed. Regulatory lag: 6-18 months between spending and rate recovery. Equity ratio: 48-52% of capital structure (regulatory determination).",
        examples: "NextEra (FPL subsidiary — $35B+ rate base), Duke Energy ($65B+ rate base across states), Southern Company ($50B+ rate base), American Water Works ($15B+ rate base, 7-9% growth)",
        valuation: "P/E: 16-22x forward (premium for high rate base growth). EV/Rate Base: 1.3-1.8x. Market rewards predictable earnings growth (5-8% EPS CAGR target). Regulatory jurisdiction quality (constructive vs hostile) impacts premium. Dividend yield: 3-4%.",
        transition: "Data center demand creating unprecedented load growth opportunity. Grid modernization and hardening ($100B+ needed). EV charging infrastructure as new rate base. Performance-based ratemaking mechanisms evolving. Decoupling revenues from sales volume to reduce weather sensitivity.",
      },
      { name: "PPA / Contracted Generation", color: "#10B981", icon: "☀️",
        how: "Revenue from long-term Power Purchase Agreements (10-25 years) at fixed or escalating prices per MWh. Provides revenue certainty independent of volatile wholesale markets. Counterparty credit risk matters — investment-grade utility or corporate offtaker preferred.",
        economics: "Contract prices: $30-60/MWh (solar), $25-50/MWh (onshore wind), plus IRA tax credits (PTC $27.50/MWh, ITC 30%). Project-level unlevered returns: 6-10%. Tax equity financing captures ITC/PTC value. Contracted cash flows support 60-75% project-level debt.",
        examples: "NextEra Energy Resources (~25 GW contracted portfolio), Clearway Energy (8 GW+), AES Clean Energy, corporate PPAs (Microsoft, Google, Amazon, Meta collectively the largest clean energy buyers globally)",
        valuation: "YieldCo: 8-12x CAFD (cash available for distribution). Development premium for pipeline. Key metrics: contracted backlog (GW + $), average PPA remaining life, re-contracting risk. Interest rate sensitivity as duration assets.",
        transition: "PPAs evolving from flat to escalating structures. 24/7 matching (hourly clean energy) becoming new corporate standard. Storage-paired PPAs growing. Merchant tail risk at PPA expiry. Repowering older wind/solar assets extends useful life.",
      },
      { name: "Market-Based Wholesale", color: "#EF4444", icon: "📈",
        how: "Revenue from selling electricity into competitive wholesale markets (day-ahead and real-time). Price set by supply/demand fundamentals — marginal cost of the last generator dispatched. Nuclear and renewables are infra-marginal (lowest cost, always dispatched). Revenue streams: energy, capacity, ancillary services.",
        economics: "Power prices: $30-80/MWh (varies by region and time). Capacity payments: $30-150/MW-day (PJM, ISO-NE). Nuclear all-in cost: $25-35/MWh (lowest among dispatchable). Gas peaker margins: highly volatile. Spark spread (gas) and dark spread (coal) drive dispatch economics.",
        examples: "Constellation Energy (32 GW nuclear fleet — highest margins in competitive gen), Vistra Corp (diverse fleet + retail), NRG Energy (gas + retail), Talen Energy (nuclear + gas)",
        valuation: "EV/EBITDA: 6-10x (cyclical exposure). Nuclear assets re-rated to 12-15x on AI power demand thesis. Key: commodity price sensitivity, hedge book, capacity market exposure. Constellation trades at 25x+ P/E on nuclear scarcity premium. Free cash flow yield and capital allocation are key metrics.",
        transition: "Nuclear assets dramatically re-rated as only scalable 24/7 carbon-free generation. Data centers willing to pay premium for reliability + clean energy. Coal-to-gas switching continuing. Battery storage competing in ancillary services. Capacity markets reforming to value reliability.",
      },
      { name: "Renewable Energy Credits (RECs)", color: "#84CC16", icon: "🌿",
        how: "Revenue from selling environmental attributes of renewable generation, separate from the physical electricity. 1 REC = 1 MWh of renewable generation. Compliance RECs sold to utilities meeting Renewable Portfolio Standards (mandatory). Voluntary RECs sold to corporates meeting sustainability targets.",
        economics: "REC prices: $2-50+/MWh (varies dramatically by state and type). NJ SREC: $200+/MWh (solar-specific). National wind REC: $2-5/MWh. Compliance RECs more valuable than voluntary. Stacked with PTC/ITC — combined incentive value can exceed electricity sales revenue.",
        examples: "SolarEdge (residential solar RECs), community solar developers (state SREC programs), Constellation (nuclear zero-emission credits in IL/NJ), voluntary REC brokers (3Degrees, Schneider Electric)",
        valuation: "REC revenue is incremental margin. Policy risk: REC programs are state-determined and can change. States with aggressive RPS targets (CA, NJ, NY, MA) have highest-value RECs. Nuclear zero-emission credits (ZECs) saved multiple plants from closure.",
        transition: "Clean Energy Standards replacing RPS in some states (technology-neutral, including nuclear). 24/7 hourly matching devaluing annual RECs. EAC (Energy Attribute Certificate) standards evolving globally. Carbon pricing would increase clean energy attribute value.",
      },
      { name: "Rate Case Mechanism", color: "#8B5CF6", icon: "📋",
        how: "The formal regulatory process through which utilities request rate changes. General rate case: comprehensive review every 2-4 years. Interim mechanisms: riders, trackers, formula rates, and decoupling allow more frequent adjustments. The quality of regulatory mechanisms directly impacts earnings growth and investor returns.",
        economics: "Rate case duration: 6-18 months. Filing frequency: every 2-4 years. Forward-looking test years (vs historic) reduce regulatory lag. Capital trackers allow immediate cost recovery for specific programs (grid hardening, pipeline replacement). Constructive jurisdictions earn closer to allowed ROE.",
        examples: "NextEra/FPL (constructive FL regulation — settlement-based), Duke Energy (multi-state, varying quality), American Water (formula rates in IL), Atmos Energy (capex trackers in multiple states), AEP (TX wires investment)",
        valuation: "Regulatory quality is the #1 determinant of utility valuation premium. Forward test years, capital trackers, and short lag = premium. Hostile jurisdictions (some Northeastern states) = discount. Analysts rank regulatory jurisdictions annually. Multi-year rate plans provide visibility.",
        transition: "Performance-based ratemaking (PBR) emerging — utilities earn incentives for meeting reliability, customer satisfaction, and clean energy targets. Grid modernization riders becoming standard. Wildfire fund mechanisms (California). Data center demand creating rate case opportunities for load growth.",
      },
    ];
    const UT_CONCEPTS = [
      { title: "Rate Base", desc: "The total invested capital that a regulated utility is allowed to earn a return on. Rate base = net plant in service + construction work in progress (CWIP) + working capital - accumulated depreciation - deferred taxes. Rate base growth (capex - depreciation) is the primary driver of utility earnings growth. Higher rate base growth → higher earnings → higher stock price." },
      { title: "Allowed ROE", desc: "The return on equity that regulators permit the utility to earn on its rate base. Set in rate cases based on comparable risk, capital market conditions, and financial integrity. National average: ~9.8% (2025). Range: 9.0-10.5%. Every 25bp of allowed ROE on a $10B rate base = ~$25M of earnings impact. Utilities lobby for higher ROE; consumer advocates lobby for lower." },
      { title: "Rate Case Cycle", desc: "The recurring process of filing for new rates. Includes: filing (utility proposes new rates), discovery (intervenors review), hearings (expert testimony), and order (commission decides). Regulatory lag is the time between spending capital and earning a return on it. Interim mechanisms (trackers, riders, formula rates) reduce lag. Rate case outcomes are the most important events for utility stocks." },
      { title: "CapEx to Rate Base Growth", desc: "Utility earnings growth is driven by the formula: capital expenditure → rate base growth → earnings growth. If a utility spends $5B/year in capex with $3B of depreciation, rate base grows by ~$2B/year. At 50% equity ratio and 10% ROE, that adds ~$100M in annual earnings. This is why capex plans (5-year, 10-year) are the most closely watched utility disclosures." },
      { title: "Regulated vs Merchant", desc: "Regulated utilities earn stable, predictable returns set by regulators. Merchant/competitive generators earn volatile returns based on wholesale power prices. Market assigns regulated utilities 16-22x P/E; merchant generators 6-10x (historically). Nuclear assets are re-rating higher on scarcity value. Companies simplifying toward regulated earnings get multiple expansion." },
      { title: "Renewable Portfolio Standards (RPS)", desc: "State mandates requiring utilities to source a percentage of electricity from renewable sources. 30+ states have RPS targets, ranging from 25% to 100% by various dates. RPS drives regulated utility renewable capex (rate base growth opportunity). Creates demand for RECs. Federal clean energy standard proposed but not enacted. IRA provides 10-year federal incentive certainty." },
      { title: "Load Growth (Data Centers)", desc: "After 15+ years of flat US electricity demand (~0-1% growth), data center demand is driving a step-change. AI data centers consume 3-5x more power than traditional. Total US data center demand projected to reach 35-45 GW by 2030 (from ~20 GW today). Utilities with data center demand in service territory (Dominion/Virginia, AEP/Ohio, Duke/Carolinas) command premium valuations." },
    ];
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Utilities Primer</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Regulated utilities, competitive generation, clean energy, and the power value chain</div>
        </div>

        {/* VALUE CHAIN */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Utilities Value Chain</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From power generation through transmission and distribution to end customers and regulators. ~$500B US electric utility industry (2025).</div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {UT_VALUE_CHAIN.map((stage, i, arr) => (
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
        </div>

        {/* TAXONOMY */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Utilities Taxonomy</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {UT_TAX.map(cat => (
              <div key={cat.key}>
                <div onClick={() => toggle("uttax_" + cat.key)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                  background: isExp("uttax_" + cat.key) ? cat.color + "22" : T_.bg,
                  borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("uttax_" + cat.key) ? cat.color + "44" : T_.border}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("uttax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                </div>
                {isExp("uttax_" + cat.key) && (
                  <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    {cat.children.map(childKey => {
                      const sub = UT_SUBS[childKey];
                      if (!sub) return null;
                      return (
                        <div key={childKey} onClick={() => toggle("utsub_" + childKey)} style={{
                          padding: "10px 16px", background: isExp("utsub_" + childKey) ? T_.bgInput : T_.bg,
                          borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("utsub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("utsub_" + childKey) && (
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

        {/* SUBSECTOR TAM CARDS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Addressable market estimates and growth rates across utilities subsectors.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {Object.entries(UT_SUBS).map(([key, sub]) => (
              <div key={key} style={{
                padding: "14px 16px", background: T_.bg, borderRadius: 8,
                border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer",
              }} onClick={() => {
                const cat = UT_TAX.find(t => t.children.includes(key));
                if (cat) toggle("uttax_" + cat.key);
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

        {/* REVENUE MODELS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Utilities Revenue Models</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How utilities generate revenue. The regulated cost-of-service model provides predictable returns; competitive generation offers higher but more volatile returns.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {UT_REV_MODELS.map((model, i) => (
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

        {/* KEY CONCEPTS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {UT_CONCEPTS.map((c, i) => (
              <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>
          Sources: EIA, FERC, S&P Global Market Intelligence (RRA), Edison Electric Institute, company 10-Ks and investor presentations. TAM and growth rates are approximate 2025 estimates.
        </div>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════
  // 6. IT SERVICES & BPO
  // ═══════════════════════════════════════════════════════
  if (subTab === "itbpo") {
    const BP_SUBS = {
      bpo: { name: "Business Process Outsourcing (BPO)", fullName: "Business Process Outsourcing — General", category: "BPO", color: "#3B82F6",
        tam: "$280B+ (2025, global)", growth: "~8-10% CAGR", icon: "🏢",
        desc: "Outsourcing of non-core business processes to third-party providers — includes customer service, back-office operations, procurement, and supply chain management. Driven by labor arbitrage, process expertise, and increasingly automation.",
        whatTheySell: "Customer care/contact center operations, order management, claims processing, procurement/P2P, supply chain operations, content moderation, trust & safety, data entry/processing.",
        whoBuys: "Large enterprises across all industries (telecom, BFSI, healthcare, retail, tech). CPO, COO, CFO. Decisions driven by cost reduction and operational efficiency.",
        keyPlayers: ["Accenture (BPO division)", "Cognizant", "Genpact", "WNS Holdings", "EXL Service", "Concentrix", "Teleperformance", "Conduent"],
        trends: "AI/automation transforming BPO (RPA + GenAI reducing manual tasks 20-40%). Shift from FTE-based to outcome-based pricing. Nearshoring growth (LatAm, Eastern Europe). GCCs (captive centers) competing with third-party BPO. Platform BPO (tech + services) commanding premium.",
      },
      kpo: { name: "Knowledge Process Outsourcing (KPO)", fullName: "Knowledge Process Outsourcing — Analytics & Research", category: "KPO", color: "#8B5CF6",
        tam: "$50B+ (2025, global)", growth: "~12-15% CAGR", icon: "🧠",
        desc: "Outsourcing of knowledge-intensive work — data analytics, financial research, actuarial services, investment research, clinical data management, and engineering services. Higher-value, higher-margin than traditional BPO.",
        whatTheySell: "Data analytics & insights, financial research/modeling, actuarial services, investment operations, clinical data management, engineering design services, legal research/review.",
        whoBuys: "Financial services (banks, asset managers, insurers), pharmaceutical companies, consulting firms, corporates seeking analytics capabilities.",
        keyPlayers: ["EXL Service (analytics-led)", "WNS (analytics)", "Mu Sigma", "LatentView Analytics", "ZS Associates", "Evalueserve"],
        trends: "AI augmenting (not replacing) knowledge workers. Demand for advanced analytics/AI/ML talent. Financial services KPO growing with regulatory complexity. Clinical research KPO benefiting from pharma R&D spend. Blurring line between KPO and consulting.",
      },
      contactcenter: { name: "Contact Center / CX", fullName: "Contact Center & Customer Experience (CX) Services", category: "Customer Experience", color: "#10B981",
        tam: "$120B+ (2025, global)", growth: "~7-9% CAGR", icon: "📞",
        desc: "Outsourced customer service, technical support, sales, and omnichannel customer experience management. The largest segment of BPO, undergoing rapid transformation with AI chatbots and digital channels.",
        whatTheySell: "Inbound/outbound voice support, chat/messaging support, email management, social media customer service, technical support, sales/retention campaigns, omnichannel orchestration.",
        whoBuys: "Telecom, BFSI, retail/e-commerce, tech companies, healthcare, travel/hospitality. VP Customer Service, Chief Customer Officer.",
        keyPlayers: ["Teleperformance (largest — 500K+ employees)", "Concentrix (post-Webhelp merger)", "TTEC Holdings", "Foundever (Sitel + Synnex)", "Alorica", "TaskUs (digital-native)", "Majorel (Teleperformance)"],
        trends: "GenAI chatbots handling 30-40% of interactions (up from 15% pre-GPT). Agent-assist AI improving AHT and CSAT. Digital channels (chat, messaging) surpassing voice. Work-from-home model permanent for 30-40% of agents. Trust & safety/content moderation growing fast (social media platforms).",
      },
      fao: { name: "Finance & Accounting Outsourcing (FAO)", fullName: "Finance & Accounting Outsourcing", category: "F&A", color: "#F59E0B",
        tam: "$55B+ (2025, global)", growth: "~9-11% CAGR", icon: "💰",
        desc: "Outsourcing of finance and accounting processes — accounts payable, accounts receivable, general ledger, financial reporting, tax preparation, and treasury operations. Growing as CFOs seek efficiency and talent in tight labor market.",
        whatTheySell: "Accounts payable (P2P), accounts receivable (O2C), general ledger/close, financial planning & analysis (FP&A), tax compliance, treasury operations, audit support, intercompany accounting.",
        whoBuys: "Mid-market and large enterprises. CFO, VP Finance, Controller. Accounting firms outsourcing preparation work. Companies in industries with high-volume transaction processing.",
        keyPlayers: ["Genpact (strongest F&A brand)", "Accenture", "WNS", "EXL Service", "Infosys BPM", "Wipro", "HCLTech", "DXC Technology"],
        trends: "Automation of AP/AR (touchless invoice processing 60-80%). AI for anomaly detection in GL close. CFO talent shortage driving outsourcing. Controllership-as-a-service model emerging for mid-market. ESG reporting creating new compliance outsourcing demand.",
      },
      hro: { name: "HR Outsourcing (HRO)", fullName: "Human Resources Outsourcing", category: "HR", color: "#EF4444",
        tam: "$40B+ (2025, global)", growth: "~7-9% CAGR", icon: "👥",
        desc: "Outsourcing of HR functions — payroll administration, benefits management, recruitment process outsourcing (RPO), employee onboarding, compliance, and HR shared services.",
        whatTheySell: "Payroll processing (multi-country), benefits administration, recruitment process outsourcing (RPO), employee lifecycle management, HR compliance, learning administration, HR analytics.",
        whoBuys: "Mid-market and enterprise companies. CHRO, VP HR, payroll managers. Companies with complex multi-country operations especially benefit from HRO.",
        keyPlayers: ["ADP (payroll/HRO leader)", "Automatic Data Processing", "Alight Solutions", "Randstad (RPO)", "Kforce (RPO)", "Infosys BPM (HR)", "NGA Human Resources (Alight)"],
        trends: "Multi-country payroll consolidation (single provider for 50+ countries). RPO growing with hiring complexity. AI for resume screening and candidate matching. Employee experience platforms. Total workforce management (employees + contingent). Pay equity and compliance analytics.",
      },
      healthbpo: { name: "Healthcare BPO", fullName: "Healthcare Business Process Outsourcing", category: "Healthcare", color: "#06B6D4",
        tam: "$80B+ (2025, global)", growth: "~10-12% CAGR", icon: "🏥",
        desc: "Outsourcing of healthcare-specific processes — medical claims processing, medical coding, revenue cycle management, pharmacy benefits, utilization management, and clinical data management. Highly regulated, domain-expertise-intensive.",
        whatTheySell: "Medical claims adjudication, medical coding (ICD-10, CPT), prior authorization processing, revenue cycle management, pharmacy benefit administration, member enrollment, provider credentialing, clinical trial data management.",
        whoBuys: "Health insurers/payers, hospital systems, physician groups, pharmaceutical companies, PBMs. VP Operations, Chief Medical Officer (for clinical processes).",
        keyPlayers: ["Cognizant (healthcare BPO)", "Conduent (healthcare)", "Maximus (government healthcare)", "R1 RCM", "Omega Healthcare", "Access Healthcare", "GeBBS Healthcare Solutions"],
        trends: "AI for automated medical coding (accuracy 85-95%, reducing coder dependency). Prior authorization automation mandated by CMS. Claims denial management using predictive analytics. Interoperability (FHIR) creating data integration opportunities. Change Healthcare breach (2024) highlighting cybersecurity needs.",
      },
      lpo: { name: "Legal Process Outsourcing (LPO)", fullName: "Legal Process Outsourcing", category: "Legal", color: "#84CC16",
        tam: "$15B+ (2025, global)", growth: "~12-15% CAGR", icon: "⚖️",
        desc: "Outsourcing of legal processes — document review, contract management, legal research, compliance, patent services, and e-discovery. Growing as law firms and corporate legal departments face cost and talent pressures.",
        whatTheySell: "Document review (litigation), contract analysis and management, legal research, compliance monitoring, patent prosecution support, e-discovery processing, regulatory filing preparation.",
        whoBuys: "AmLaw 200 law firms, corporate legal departments (Fortune 500 GCs), in-house legal teams, compliance departments.",
        keyPlayers: ["UnitedLex (largest LPO)", "Integreon", "QuisLex", "Pangea3 (Thomson Reuters)", "Elevate Services", "Mindcrest", "CPA Global (Clarivate — patents)"],
        trends: "AI/GenAI revolutionizing document review (80%+ cost reduction vs manual). Contract AI (Ironclad, Evisort integration with LPO). Corporate legal spend under pressure (Alternative Legal Service Providers growing 20%+). ALSP market growing faster than traditional legal market. M&A due diligence outsourcing increasing.",
      },
    };
    const BP_TAX = [
      { key: "genbpo", label: "General BPO", color: "#3B82F6", icon: "🏢", children: ["bpo"] },
      { key: "kpo", label: "Knowledge Process Outsourcing", color: "#8B5CF6", icon: "🧠", children: ["kpo"] },
      { key: "cx", label: "Customer Experience", color: "#10B981", icon: "📞", children: ["contactcenter"] },
      { key: "fa", label: "Finance & Accounting", color: "#F59E0B", icon: "💰", children: ["fao"] },
      { key: "hr", label: "HR Outsourcing", color: "#EF4444", icon: "👥", children: ["hro"] },
      { key: "health", label: "Healthcare BPO", color: "#06B6D4", icon: "🏥", children: ["healthbpo"] },
      { key: "legal", label: "Legal Process Outsourcing", color: "#84CC16", icon: "⚖️", children: ["lpo"] },
    ];
    const BP_VALUE_CHAIN = [
      { label: "Client Business Processes", color: "#3B82F6", icon: "🏢", desc: "Core & non-core operations", rows: [{ sub: "Front Office", ex: "Customer service, sales support" }, { sub: "Middle Office", ex: "Claims, compliance, operations" }, { sub: "Back Office", ex: "F&A, HR, procurement, IT" }], buyers: "Internal stakeholders, end customers" },
      { label: "Process Design / Consulting", color: "#8B5CF6", icon: "📋", desc: "Assessment & optimization", rows: [{ sub: "Process Mining", ex: "Celonis, UiPath Process Mining" }, { sub: "Consulting", ex: "Accenture, McKinsey, Deloitte" }, { sub: "Benchmarking", ex: "SSON, Everest Group, HFS" }], buyers: "C-suite, transformation offices" },
      { label: "Transition / Migration", color: "#F59E0B", icon: "🔄", desc: "Knowledge transfer & ramp-up", rows: [{ sub: "KT (Knowledge Transfer)", ex: "6-12 week transition periods" }, { sub: "Hiring & Training", ex: "Domain + process training" }, { sub: "Tech Setup", ex: "Workflow tools, RPA, telephony" }], buyers: "BPO providers (investment phase)" },
      { label: "Steady-State Operations", color: "#10B981", icon: "⚙️", desc: "Ongoing service delivery", rows: [{ sub: "Delivery Centers", ex: "India, Philippines, LatAm, EE" }, { sub: "Quality Mgmt", ex: "SLA tracking, CSAT, Six Sigma" }, { sub: "Workforce Mgmt", ex: "Scheduling, attrition mgmt" }], buyers: "Client operations teams" },
      { label: "Continuous Improvement", color: "#EF4444", icon: "📈", desc: "Automation & optimization", rows: [{ sub: "RPA/Automation", ex: "UiPath, Automation Anywhere" }, { sub: "GenAI", ex: "Copilots, chatbots, agents" }, { sub: "Analytics", ex: "Process insights, predictive" }], buyers: "Client + provider (shared value)" },
    ];
    const BP_REV_MODELS = [
      { name: "FTE-Based Pricing", color: "#3B82F6", icon: "👤",
        how: "Revenue based on the number of full-time equivalent (FTE) resources deployed for the client. Client pays a monthly rate per FTE that covers salary, infrastructure, management overhead, and provider margin. The traditional BPO pricing model. Most transparent but least aligned with outcomes.",
        economics: "FTE cost (offshore India): $15-25K/year fully loaded. Bill rate: $25-50K/year (1.5-2.5x markup). Gross margin: 35-50%. EBITDA margin: 12-18%. Revenue scales linearly with headcount. Margin expansion from pyramid optimization (junior-heavy mix) and utilization improvement.",
        examples: "Teleperformance (contact center FTE), Genpact (F&A FTE teams), Cognizant (healthcare BPO FTEs), Infosys BPM (diverse FTE contracts), traditional IT outsourcing deals (Wipro, TCS)",
        valuation: "8-12x EBITDA for FTE-heavy BPO. Market discounts linear revenue models. Investors watch revenue per FTE, attrition rate, and utilization. Premium for companies demonstrating shift from FTE to outcome-based. PE targets this sector for operational improvement.",
        transition: "FTE model under structural pressure from AI/automation. Clients demanding productivity improvements (same output with fewer FTEs). Providers transitioning to hybrid models (base FTE + automation savings sharing). Pure FTE pricing declining from ~70% to ~50% of total BPO contracts.",
      },
      { name: "Transaction-Based Pricing", color: "#10B981", icon: "📊",
        how: "Revenue per unit of work completed — per claim processed, per invoice handled, per ticket resolved, per transaction adjudicated. Aligns payment with actual volume of work. More predictable for providers as pricing is pre-determined per unit.",
        economics: "Per-claim processing: $3-15 per claim. Per-invoice: $1-5 per invoice. Per-call: $5-25 per interaction. Margins improve with automation (reduce cost per unit while maintaining price per unit). Volume variability is risk — recession reduces transaction volumes.",
        examples: "Conduent (toll collection per transaction), Maximus (government claims per case), Omega Healthcare (per-chart medical coding), payment processors (Fiserv per-transaction), claims administrators",
        valuation: "10-14x EBITDA. Market values predictability of transaction flows and margin expansion potential from automation. Key risk: volume concentration in cyclical industries. Premium for high-volume, embedded transaction processing (similar to toll booth model).",
        transition: "Growing model as clients prefer variable cost structure. AI increasing per-unit margins (lower cost to process but price maintained). Risk: dramatic volume reduction from automation at client end. Some providers combining transaction pricing with minimum volume commitments.",
      },
      { name: "Outcome-Based / Gainsharing", color: "#8B5CF6", icon: "🎯",
        how: "Revenue tied to business outcomes achieved — cost savings delivered, revenue recovered, customer satisfaction improvement, cycle time reduction. Provider shares in the value created. Higher risk for provider but higher margin potential. Requires robust measurement and baseline.",
        economics: "Gainsharing split: 50/50 to 70/30 (client/provider). Margins: 20-35% (if outcomes achieved). Revenue less predictable but aligned with value. Requires upfront investment in analytics and automation. Payback period: 6-18 months on technology investment.",
        examples: "EXL Service (collections recovery — paid % of recovered amounts), R1 RCM (RCM outcome fees — % of revenue improvement), Genpact (cost savings sharing), WNS (procurement savings sharing)",
        valuation: "Premium multiples: 12-18x EBITDA for outcome-based BPO. Market rewards value alignment and margin expansion potential. Key risk: outcome measurement disputes and baseline gaming. Most attractive model for sophisticated investors.",
        transition: "Growing rapidly but still ~15-20% of total BPO contracts. GenAI accelerating outcome-based feasibility (providers can deliver more with less). Client sophistication increasing demand for outcome alignment. Hybrid models (base FTE + outcome bonus) most common transition path.",
      },
      { name: "Managed Services (SLA-Based)", color: "#F59E0B", icon: "📋",
        how: "Fixed monthly fee for managing an entire process or function to agreed service levels (SLAs). Provider takes responsibility for staffing, technology, and process management. Client pays for the output, not the input. Revenue is predictable and contractually committed.",
        economics: "Contract values: $5M-100M+ annually. Contract duration: 3-7 years. Margins: 15-25% EBITDA. Revenue visibility from long-term contracts. SLA penalties can reduce margin (typically 10-15% at risk). Rebid/renewal risk at contract expiry. Transition costs amortized over contract life.",
        examples: "Accenture (managed operations for F&A, procurement), Concentrix (managed CX programs), HCLTech (managed IT + BPO), DXC Technology (managed services), Unisys (managed workplace services)",
        valuation: "10-15x EBITDA. Market values contract backlog, renewal rates, and margin trajectory. Premium for long-duration contracts with blue-chip clients. Total Contract Value (TCV) and Annual Contract Value (ACV) are key booking metrics.",
        transition: "Replacing both FTE and project-based models. Managed services allow provider to optimize delivery (automation investment → margin expansion). Clients prefer single point of accountability. Multi-tower managed services (IT + BPO + consulting) growing. Cloud-based delivery platforms enabling new managed service models.",
      },
      { name: "Platform BPO (Tech + Services)", color: "#EF4444", icon: "💻",
        how: "Revenue from providing a technology platform combined with process operations — software-enabled BPO. The platform (workflow, analytics, automation) is core to the delivery model and creates switching costs. Hybrid between SaaS and services. Higher margins than pure FTE BPO.",
        economics: "Revenue per FTE: 2-3x traditional BPO (technology leverage). Gross margins: 45-60%. EBITDA margins: 20-30%. Platform licensing + services creates recurring revenue base. Client switching costs higher (technology + process dependency). Implementation cycle: 3-6 months.",
        examples: "EXL Service (analytics platform + operations), WNS (EXPIRIUS platform), TaskUs (digital AI platform + human delivery), Genpact (Cora AI platform), R1 RCM (technology-enabled RCM)",
        valuation: "15-22x EBITDA — premium to traditional BPO. Market values technology differentiation and margin profile closer to software. Key metrics: platform revenue as % of total, technology-led deal wins, margins. IPO/PE exit valuations significantly higher for platform BPO vs pure-play.",
        transition: "The future of BPO. Pure FTE providers must invest in technology platforms or face margin compression. GenAI enabling smaller providers to create platform capabilities. Risk: technology investment requires significant R&D spend. Winners will combine domain expertise + proprietary AI/automation + service delivery.",
      },
    ];
    const BP_CONCEPTS = [
      { title: "FTE Arbitrage", desc: "The core economics of offshore BPO: labor cost differential between client location (US/Europe) and delivery location (India, Philippines, LatAm). US knowledge worker: $80-150K. India equivalent: $15-30K. Arbitrage shrinking as offshore wages rise 8-12% annually but still 3-5x cost advantage. Nearshore (LatAm, Eastern Europe) offers 2-3x advantage with timezone alignment." },
      { title: "Automation (RPA / AI)", desc: "Robotic Process Automation (RPA) handles rule-based repetitive tasks (data entry, reconciliation). GenAI handles judgment-based tasks (document review, customer interaction, coding). Together, they're reducing FTE requirements 20-40% per process. BPO providers must invest in automation or face margin compression. The best providers use AI to improve service quality while reducing costs — sharing savings with clients." },
      { title: "Attrition Rate", desc: "Annual employee turnover rate. BPO industry average: 30-50% (contact centers can reach 80%+). Attrition is the #1 operational challenge — recruiting and training replacement costs $3-5K per agent. Offshore India BPO attrition: 25-40%. Philippines: 20-35%. Nearshore LatAm: 15-25%. Work-from-home has reduced attrition 5-10pp in many operations. Attrition management is a core competency differentiator." },
      { title: "AHT (Average Handle Time)", desc: "The average time to resolve a customer interaction — includes talk time, hold time, and after-call work. Contact center: voice AHT typically 6-12 minutes. Chat: 8-15 minutes. Email: 30-60 minutes. AI agent-assist tools reducing AHT 15-30%. Lower AHT = more interactions per agent = better unit economics. But optimizing only for AHT can hurt CSAT/quality." },
      { title: "CSAT / NPS", desc: "Customer Satisfaction Score (CSAT) and Net Promoter Score (NPS) measure service quality. CSAT: typically 75-90% for well-run BPO operations. NPS: +30 to +60 is good. These metrics increasingly tied to BPO provider compensation (SLA penalties/bonuses). AI sentiment analysis now measures real-time CSAT. Quality scores differentiate premium BPO providers from commodity players." },
      { title: "Onshore / Nearshore / Offshore Mix", desc: "Geographic delivery model. Onshore: same country as client (highest cost, best for complex/regulated work). Nearshore: adjacent timezone (LatAm for US, Eastern Europe for Western Europe — 2-3x cost advantage). Offshore: India, Philippines (3-5x cost advantage, timezone challenges). Optimal mix depends on process complexity, regulatory requirements, and client preferences. Trend toward nearshore growing fastest." },
      { title: "GCC (Global Capability Center)", desc: "Captive offshore centers owned by the client company (not a third-party BPO). GCCs compete directly with BPO providers. ~1,600+ GCCs in India employing 1.7M+ people. Companies like JPMorgan, Goldman Sachs, Google operate massive GCCs. GCC threat is real for commodity BPO. BPO providers differentiate with specialized domain expertise, technology platforms, and flexibility that GCCs struggle to replicate." },
    ];
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>IT Services & BPO Primer</div>
          <div style={{ fontSize: 14, color: T_.textDim, marginTop: 4 }}>Business process outsourcing, knowledge services, contact centers, and BPO value chain</div>
        </div>

        {/* VALUE CHAIN */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>BPO Value Chain</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>From client business processes through outsourcing lifecycle to continuous improvement. ~$400B global BPO market (2025).</div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
            {BP_VALUE_CHAIN.map((stage, i, arr) => (
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
        </div>

        {/* TAXONOMY */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>IT Services & BPO Taxonomy</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Click any category to expand subsectors. Click a subsector for details.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BP_TAX.map(cat => (
              <div key={cat.key}>
                <div onClick={() => toggle("bptax_" + cat.key)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
                  background: isExp("bptax_" + cat.key) ? cat.color + "22" : T_.bg,
                  borderRadius: 8, cursor: "pointer", border: `1px solid ${isExp("bptax_" + cat.key) ? cat.color + "44" : T_.border}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: cat.color, flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost }}>{cat.children.length} subsector{cat.children.length > 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 13, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("bptax_" + cat.key) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                </div>
                {isExp("bptax_" + cat.key) && (
                  <div style={{ marginLeft: 32, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                    {cat.children.map(childKey => {
                      const sub = BP_SUBS[childKey];
                      if (!sub) return null;
                      return (
                        <div key={childKey} onClick={() => toggle("bpsub_" + childKey)} style={{
                          padding: "10px 16px", background: isExp("bpsub_" + childKey) ? T_.bgInput : T_.bg,
                          borderRadius: 6, cursor: "pointer", border: `1px solid ${T_.border}`, transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: T_.text, flex: 1 }}>{sub.name}</span>
                            <span style={{ fontSize: 12, color: T_.textDim }}>{sub.tam}</span>
                            <span style={{ fontSize: 12, color: T_.green }}>{sub.growth}</span>
                            <span style={{ fontSize: 12, color: T_.textGhost, transition: "transform 0.2s", transform: isExp("bpsub_" + childKey) ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                          </div>
                          {isExp("bpsub_" + childKey) && (
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

        {/* SUBSECTOR TAM CARDS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>Subsector Overview — TAM & Growth</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 24 }}>Addressable market estimates and growth rates across BPO subsectors.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {Object.entries(BP_SUBS).map(([key, sub]) => (
              <div key={key} style={{
                padding: "14px 16px", background: T_.bg, borderRadius: 8,
                border: `1px solid ${sub.color}33`, borderLeft: `3px solid ${sub.color}`, cursor: "pointer",
              }} onClick={() => {
                const cat = BP_TAX.find(t => t.children.includes(key));
                if (cat) toggle("bptax_" + cat.key);
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

        {/* REVENUE MODELS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 6 }}>BPO Revenue Models</div>
          <div style={{ fontSize: 13, color: T_.textDim, marginBottom: 20 }}>How BPO companies generate revenue. The industry is shifting from input-based (FTE) to output-based (transaction/outcome) and platform-based models. Understanding the pricing model reveals the business quality.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {BP_REV_MODELS.map((model, i) => (
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

        {/* KEY CONCEPTS */}
        <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: T_.text, marginBottom: 16 }}>Key Concepts & Mental Models</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {BP_CONCEPTS.map((c, i) => (
              <div key={i} style={{ padding: "14px 16px", background: T_.bg, borderRadius: 8, border: `1px solid ${T_.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue, marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: T_.textGhost, fontStyle: "italic" }}>
          Sources: Everest Group, HFS Research, Gartner, NASSCOM, ISG Index, company 10-Ks and investor presentations. TAM and growth rates are approximate 2025 estimates.
        </div>
      </div>
    );
  }

  // No matching tab
  return null;
}
