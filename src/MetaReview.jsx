import { useState } from "react";
import FinancialsTab from "./FinancialsTab";
import { RESEARCH_FIELDS as FIELDS, reviewStyles as s, fmtShort } from "./GenericReview";

export default function MetaReview({ companyId, companyName, curFields, updateField, editingField, setEditingField }) {
  const [metaTab, setMetaTab] = useState("recent");

  return (
    <>
      {/* Meta Sub-Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1E293B" }}>
        {[
          { key: "recent", label: "Research" },
          { key: "overview", label: "Overview" },
          { key: "financials", label: "Financials" },
          { key: "orgchart", label: "Org Chart" },
          { key: "contracts", label: "Supply Chain & Customers" },
          { key: "sentiment", label: "Sentiment" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMetaTab(tab.key)}
            style={{
              padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
              background: "transparent",
              color: metaTab === tab.key ? "#F8FAFC" : "#64748B",
              borderBottom: metaTab === tab.key ? "2px solid #3B82F6" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== RECENT UPDATES TAB ===== */}
      {metaTab === "recent" && (
        <div style={s.section}>
          {FIELDS.map(f => {
            const fd = curFields?.[f.key];
            const isEditing = editingField === f.key;
            const hasContent = fd?.text?.trim();
            return (
              <div key={f.key} style={s.section}>
                <div style={s.sectionHdr}>
                  <span>{f.label}</span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {fd?.date && <span style={s.sectionDate}>{fmtShort(fd.date)}</span>}
                    {hasContent && !isEditing && <button style={s.btnSmall} onClick={() => setEditingField(f.key)}>Edit</button>}
                  </div>
                </div>
                {(isEditing || !hasContent) ? (
                  <div>
                    <textarea style={s.textarea} rows={6}
                      value={fd?.text || ""}
                      onChange={e => updateField(companyId, f.key, e.target.value)}
                      placeholder={f.ph}
                      autoFocus={isEditing} />
                    {isEditing && <button style={{ ...s.btnSmall, marginTop: 10 }} onClick={() => setEditingField(null)}>Done</button>}
                  </div>
                ) : (
                  <div style={s.proseBody} onClick={() => setEditingField(f.key)}>{fd.text}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== OVERVIEW TAB ===== */}
      {metaTab === "overview" && (<>
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Meta Platforms (META)</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>NASDAQ &middot; Menlo Park, CA &middot; Founded 2004 &middot; Mark Zuckerberg controlling shareholder (~13% economic / ~58% voting)</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>As of</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>Apr 2026</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.7, marginTop: 12 }}>
            Meta operates the largest digital advertising platform after Google, monetizing ~3.9B family-of-apps daily actives (Facebook, Instagram, WhatsApp, Messenger, Threads). The ad business is the cash engine; Reality Labs (AR/VR) and AI infrastructure are the two long-cycle bets that consume capital. Since 2H 2024 the strategic narrative has pivoted from "Year of Efficiency" (2023) to AI-first capex acceleration: $66-72B FY25 capex, raised guide for FY26, $35B+ in third-party GPU contracts (CoreWeave + Nebius), $14.3B Scale AI deal, and a new <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Meta Superintelligence Labs</span> unit run by Alexandr Wang.
          </div>
        </div>

        {/* Segment Snapshot */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Segment Snapshot (FY2025 est.)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Family of Apps (FoA)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#10B981", marginTop: 4 }}>~$185-190B rev</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 6, lineHeight: 1.6 }}>
                ~98% of total revenue. Operating margin ~50%+. ~3.9B DAP. Facebook (~3.1B MAU), Instagram (~2.2B MAU), WhatsApp (~2.5B MAU), Messenger, Threads (~350M+ MAU). Ad ARPU strongest in NA/EU. Reels + AI-driven targeting + Click-to-Message ads driving growth.
              </div>
            </div>
            <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Reality Labs (RL)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#EF4444", marginTop: 4 }}>~$2-3B rev / ~$18-20B op loss</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 6, lineHeight: 1.6 }}>
                Quest 3/3S, Ray-Ban Meta (with EssilorLuxottica), Ray-Ban Display (Sep 2025, w/ neural wristband), Orion AR prototype. Cumulative RL losses ~$70B+ since 2020. Zuckerberg has framed this as a multi-decade bet; investors increasingly tolerant since AI capex pivot took center stage.
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: Meta 10-K FY2024, Q3 2025 earnings, Family of Apps DAP definition (de-duplicated). FY2025 figures are consensus/management commentary pending Q4 FY25 print.</div>
        </div>

        {/* Key Events Timeline */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Key Events Timeline</div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "0–6 Months (Apr–Oct 2026)", color: "#3B82F6", events: [
                { date: "Apr 30", event: "Q1 2026 earnings", type: "Earnings", detail: "First print after FY26 capex revision. Focus: Reels monetization, ad price/volume mix, Reality Labs Quest seasonality. Capex pacing for Hyperion + Prometheus." },
                { date: "Apr 9", event: "$21B CoreWeave expansion", type: "Contract", detail: "Total Meta–CoreWeave commitment now ~$35B through 2032 (initial $14.2B Sep 2025 + $21B expansion). GB300 Blackwell Ultra. Meta is CoreWeave's largest single backlog customer." },
                { date: "Apr 2026", event: "$8.5B IG-rated GPU debt (Meta-anchored)", type: "Financing", detail: "First-ever investment-grade GPU-backed financing — A3 (Moody's) / A-low (DBRS), SOFR+225 / ~5.9% fixed, Mar 2032 maturity. Anchored by Blackstone Credit. Structured against Meta contract cash flows." },
                { date: "Jun 2026", event: "Llama 5 expected", type: "Product", detail: "Tentative; Meta Superintelligence Labs (Wang) leading. Reasoning + multimodal targeted as differentiation vs Llama 4 reception." },
                { date: "Sep 2026", event: "Meta Connect 2026", type: "Product", detail: "Quest 4 / new Ray-Ban Meta SKUs / Orion productization roadmap expected. Watch for AR price/spec disclosures." },
              ]},
              { label: "Past 6–18 Months", color: "#F59E0B", events: [
                { date: "Jan 2026", event: "Q4 2025 earnings", type: "Earnings", detail: "Record FY25 revenue (~$185-190B). FY26 capex guide raised materially above prior $90-100B preview. Operator margin held in low-40s despite RL drag. Effective tax rate ~16-18%." },
                { date: "Sep 2025", event: "$27B Nebius GPU deal", type: "Contract", detail: "Meta becomes anchor customer for Nebius (ex-Yandex AI cloud spinout). Multi-year capacity agreement. NVIDIA also took a $2B stake in Nebius alongside the deal." },
                { date: "Sep 2025", event: "$14.2B initial CoreWeave deal", type: "Contract", detail: "First Meta–CoreWeave master service agreement. Used as collateral basis for the eventual $8.5B IG DDTL." },
                { date: "Sep 2025", event: "Meta Connect 2025", type: "Product", detail: "Ray-Ban Display (HUD glasses with neural wristband), Quest 3S Xbox edition, Orion roadmap update. Zuckerberg framed AI + AR as the next decade's compute platform." },
                { date: "Aug 2025", event: "AI talent war", type: "M&A", detail: "Meta offered reportedly $100M+ packages to senior researchers from OpenAI, Google DeepMind, Anthropic. Built Meta Superintelligence Labs (MSL) under Alexandr Wang. Cost of talent step-functioned." },
                { date: "Jun 2025", event: "Scale AI deal — $14.3B for 49%", type: "M&A", detail: "Non-voting stake; Alexandr Wang joins Meta as Chief AI Officer. Structured as investment + license to avoid antitrust review. Marks Meta's most aggressive AI move since Llama strategy." },
                { date: "Apr 2025", event: "Llama 4 (Scout / Maverick)", type: "Product", detail: "Open-weight release. Mixed reception — strong long-context, weaker reasoning vs frontier closed models. Catalyzed the talent overhaul that produced MSL." },
                { date: "Jan 2025", event: "Joel Kaplan replaces Nick Clegg as President of Global Affairs", type: "Regulatory", detail: "Pivot to lighter content moderation regime, end of third-party fact-checking program in US. Aligned with new political environment." },
              ]},
              { label: "Strategic Backdrop (12–36 Months)", color: "#8B5CF6", events: [
                { date: "2024", event: "Llama 3 / 3.1 / 3.2", type: "Product", detail: "Llama 3.1 (405B, Jul 2024) was first true frontier-class open-weight model. 3.2 (Sep 2024) added multimodal. Established Meta as the open-weight reference platform." },
                { date: "2024", event: "FY24 revenue $164.5B (+22%)", type: "Earnings", detail: "Operating margin expanded from 25% (2022) to 42%. Capex stepped up to ~$37B. Reality Labs loss $17.7B." },
                { date: "2023", event: "\"Year of Efficiency\"", type: "Earnings", detail: "Two rounds of layoffs (~21K total). Stock recovered from ~$90 (Nov 2022) to >$350 by YE2023. Permanent operating leverage reset." },
                { date: "2022", event: "First debt issuance ($10B)", type: "Financing", detail: "Inaugural senior unsecured notes (Aug 2022). Maintained net cash position. Has since added multiple tranches in 2024–2025 to fund AI capex." },
                { date: "2021", event: "Meta rebrand + RL spin-out reporting", type: "Regulatory", detail: "Facebook → Meta Platforms. Began reporting Reality Labs as separate segment in Q4 2021. Sets up multi-decade RL/AR thesis." },
              ]},
            ].map((col, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: col.color, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${col.color}` }}>{col.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.events.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: "#0B0F19", borderRadius: 6, border: "1px solid #1E293B" }}>
                      <div style={{ width: 85, minWidth: 85 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: col.color }}>{c.date}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{c.event}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{c.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supply Chain & Ecosystem Map */}
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Meta Supply Chain &amp; Ecosystem Map</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {[
            { label: "Customers (Demand)", items: [
              { name: "Advertisers (10M+ active)", sub: "No single advertiser >5%. Top 100 ~25% of FoA revenue. E-commerce, gaming, financial services, retail, CPG.", color: "#F59E0B" },
              { name: "Cross-border e-com (Temu, Shein)", sub: "Were top 5–10 advertisers in 2023–2024; Temu reportedly cut ad spend in 2025 — watched as recurring earnings swing factor.", color: "#F59E0B" },
              { name: "End users (~3.9B DAP)", sub: "Engagement is the indirect 'customer' — drives ad inventory volume + targeting quality.", color: "#F59E0B" },
              { name: "Llama developers / enterprises", sub: "Open-weight strategy = no direct revenue, but builds platform optionality and recruits AI talent.", color: "#F59E0B" },
            ]},
            { label: "Meta Platforms", items: [
              { name: "Family of Apps", sub: "FB, IG, WhatsApp, Messenger, Threads. Ad-monetized. ~98% of revenue.", color: "#3B82F6" },
              { name: "Reality Labs", sub: "Quest, Ray-Ban Meta (w/ EssilorLuxottica), Orion AR. ~$70B cumulative loss since 2020.", color: "#3B82F6" },
              { name: "Meta Superintelligence Labs", sub: "Formed Jun 2025 under Alexandr Wang. Frontier model + AGI research. Combines FAIR + GenAI org.", color: "#3B82F6" },
            ]},
            { label: "AI Compute (Silicon)", items: [
              { name: "NVIDIA", sub: "Primary GPU vendor — H100, H200, B100/B200, GB200/GB300, Vera Rubin. Largest customer relationship after the hyperscalers.", color: "#10B981" },
              { name: "AMD", sub: "MI300X / MI325X — secondary supplier; capacity reserved for inference workloads.", color: "#10B981" },
              { name: "Broadcom (MTIA partner)", sub: "Custom ASIC design partner for MTIA v1 (inference, deployed 2024) and MTIA v2 (training, 2025–2026 ramp). Strategic dependency.", color: "#10B981" },
              { name: "TSMC", sub: "Foundry for MTIA + Quest SoC. N3/N3E for MTIA v2; future N2 capacity reserved for MTIA v3.", color: "#10B981" },
            ]},
            { label: "AI Compute (Capacity)", items: [
              { name: "Self-built data centers", sub: "Hyperion (LA, ~5 GW, $10B+), Prometheus (OH, ~2 GW), Mesa AZ, Eagle Mountain UT, Richland WA, Gallatin TN, Forest City NC, Altoona IA, Los Lunas NM. ~25 sites globally.", color: "#10B981" },
              { name: "CoreWeave", sub: "$35B total commitment through 2032 (~$5B+ implied annual run rate). GB300 Blackwell Ultra. Largest CRWV customer by backlog.", color: "#10B981" },
              { name: "Nebius", sub: "$27B multi-year capacity agreement (Sep 2025). Anchor customer; helped Nebius secure NVIDIA $2B equity stake.", color: "#10B981" },
            ]},
            { label: "Reality Labs Hardware", items: [
              { name: "Foxconn / Pegatron / Goertek", sub: "Quest assembly (Vietnam, China). Goertek leads acoustic / optical modules.", color: "#10B981" },
              { name: "EssilorLuxottica", sub: "Ray-Ban Meta brand + retail JV. Multi-year extension signed 2024 covering future smart-glasses lineup.", color: "#10B981" },
              { name: "Luxshare", sub: "Smart glasses assembly (Ray-Ban Meta, Ray-Ban Display).", color: "#10B981" },
            ]},
            { label: "Power & Real Estate", items: [
              { name: "PPAs (NextEra, RWE, Apex Clean, Invenergy)", sub: "12+ GW of contracted clean power across active campuses. Meta has been the #2 corporate PPA buyer globally for several years.", color: "#10B981" },
              { name: "Entergy / TVA / utility grids", sub: "Hyperion (Entergy LA), Prometheus (AEP/utility OH), Gallatin (TVA). Grid interconnect risk = real and rising." },
            ]},
            { label: "Competitors / Peer Set", items: [
              { name: "Alphabet (GOOGL)", sub: "Closest peer in ads + AI infra. Search, YouTube, Android, GCP, Gemini.", color: "#EF4444" },
              { name: "TikTok / ByteDance", sub: "Direct user / engagement competitor; biggest threat to Reels + Instagram. US ban legislation = recurring tailwind/risk for Meta.", color: "#EF4444" },
              { name: "Apple", sub: "Vision Pro = AR/VR competitor; ATT = ongoing ad targeting headwind; AI distribution gatekeeper.", color: "#EF4444" },
              { name: "OpenAI / Anthropic / Google DeepMind", sub: "Closed-model frontier labs. Meta competes via open-weight Llama + MSL.", color: "#EF4444" },
              { name: "Snap, Pinterest, Reddit, X", sub: "Smaller social ad pools — incremental rather than existential.", color: "#94A3B8" },
            ]},
          ].map((layer, li) => (
            <div key={li} style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
              <div style={{ width: 200, minWidth: 200, background: "#0B0F19", padding: "12px 14px", display: "flex", alignItems: "center", borderRight: "1px solid #1E293B" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px" }}>{layer.label}</span>
              </div>
              <div style={{ flex: 1, display: "flex", gap: 0, flexWrap: "wrap", background: "#111827" }}>
                {layer.items.map((item, ii) => (
                  <div key={ii} style={{ flex: "1 1 220px", padding: "10px 14px", borderRight: ii < layer.items.length - 1 ? "1px solid #1E293B" : "none" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: item.color || "#94A3B8" }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: "#64748B", marginTop: 2, lineHeight: 1.4 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Flow: Silicon → Capacity (self-built + 3rd-party GPU clouds) → Family of Apps + RL + MSL → Advertisers / End users. Power & PPAs gate the buildout. Sources: Meta 10-K FY2024, Q3 2025 earnings, CoreWeave / Nebius IR, BNEF corporate PPA tracker, Open Compute Project.</div>

        {/* AI Capex Snapshot */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>AI Infrastructure & Capex</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Meta is the third-largest AI capex spender globally (after Microsoft and Google) and the largest open-weight model lab. ~1.3M+ H100-equivalents end-2025 fleet target; ~600K H100s deployed end-2024.</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { label: "FY2024 Capex (actual)", value: "~$37B", sub: "+62% YoY", color: "#94A3B8" },
              { label: "FY2025 Capex (guide)", value: "~$66-72B", sub: "Raised mid-year from $60-65B", color: "#3B82F6" },
              { label: "FY2026 Capex (guide)", value: "~$90-115B", sub: "Range reflects Q4 25 guide step-up", color: "#F59E0B" },
              { label: "GPU Fleet (end-2025 est.)", value: "~1.3M", sub: "H100-equivalents incl. B200/GB300", color: "#10B981" },
              { label: "3rd-Party GPU Backlog", value: "$62B+", sub: "$35B CoreWeave + $27B Nebius", color: "#8B5CF6" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: "12px 16px", flex: "1 1 180px" }}>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Sources: Meta Q3 2025 earnings, Q4 2025 guidance preview, CoreWeave 8-K (Apr 2026), Nebius IR. FY26 capex range reflects analyst-implied translation of "materially higher" management commentary.</div>
        </div>
      </>)}

      {/* ===== ORG CHART TAB ===== */}
      {metaTab === "orgchart" && (<>
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Meta Corporate &amp; Subsidiary Structure</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Dual-class shareholder structure. Zuckerberg holds majority of Class B (10 votes/share) — controls ~58% of voting power.</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>As of</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>Apr 2026</div>
            </div>
          </div>
        </div>

        {/* Parent Entity */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
          <div style={{ background: "linear-gradient(135deg, #1E3A5F, #0B1929)", border: "2px solid #3B82F6", borderRadius: 12, padding: "20px 40px", textAlign: "center", minWidth: 460 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>Meta Platforms, Inc.</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Parent &middot; Delaware &middot; NASDAQ:META &middot; CIK 0001326801</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>Two reportable segments: Family of Apps + Reality Labs. Issuer of all senior unsecured notes.</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>S&P: AA-</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>Moody's: A1</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.15)", color: "#60A5FA" }}>Fitch: A+</span>
            </div>
          </div>
          <div style={{ width: 2, height: 24, background: "#1E293B" }} />
        </div>

        {/* Subsidiary cards */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 2, height: 20, background: "#1E293B" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: "92%", height: 2, background: "#1E293B", position: "relative" }}>
            {[0, 20, 40, 60, 80, 100].map(p => (
              <div key={p} style={{ position: "absolute", left: `${p}%`, top: -4, width: 2, height: 10, background: "#1E293B", transform: "translateX(-1px)" }} />
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          {[
            { name: "Facebook / Messenger", tag: "FoA", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6",
              segment: "Family of Apps", users: "~3.1B MAU", lead: "Tom Alison (Head of Facebook)", legal: "Meta Platforms, Inc. directly",
              notes: "Core legacy property. Reels + AI ranking now key revenue driver. Click-to-Message ads bridging into WhatsApp Business." },
            { name: "Instagram", tag: "FoA", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6",
              segment: "Family of Apps", users: "~2.2B MAU", lead: "Adam Mosseri (Head of Instagram)", legal: "Instagram, LLC (subsidiary)",
              notes: "Highest-monetizing app for younger demos. Reels + Shopping + DM ads = three growth vectors. Threads incubated here." },
            { name: "WhatsApp", tag: "FoA", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6",
              segment: "Family of Apps", users: "~2.5B MAU", lead: "Will Cathcart (Head of WhatsApp)", legal: "WhatsApp LLC (subsidiary)",
              notes: "Acquired 2014 ($19B). E2E encrypted. Business Platform + Click-to-Message = monetization wedge. Largest in India / LATAM / EU." },
            { name: "Threads", tag: "FoA", tagBg: "rgba(59,130,246,0.12)", tagColor: "#3B82F6", color: "#3B82F6",
              segment: "Family of Apps", users: "~350M+ MAU", lead: "Reports into Mosseri / Instagram", legal: "Operated under Instagram, LLC",
              notes: "Launched Jul 2023. Ads ramping 2025–2026. ActivityPub federation = optionality vs X. Fastest app to 100M users in history." },
            { name: "Reality Labs", tag: "RL", tagBg: "rgba(245,158,11,0.12)", tagColor: "#F59E0B", color: "#F59E0B",
              segment: "Reality Labs", users: "Quest install base est. ~25M+", lead: "Andrew Bosworth (CTO + Head of RL)", legal: "Multiple entities incl. Oculus VR, LLC",
              notes: "Quest 3/3S, Ray-Ban Meta (JV w/ EssilorLuxottica), Ray-Ban Display + neural wristband (Sep 2025), Orion AR prototype. ~$18-20B annual op loss." },
            { name: "Meta Superintelligence Labs", tag: "AI", tagBg: "rgba(139,92,246,0.12)", tagColor: "#A78BFA", color: "#A78BFA",
              segment: "Family of Apps (cost center)", users: "—", lead: "Alexandr Wang (Chief AI Officer)", legal: "Internal unit (Jun 2025)",
              notes: "Created post Llama 4. Combines FAIR + GenAI org under Wang. Partner: Scale AI (49% non-voting stake, $14.3B Jun 2025). Llama 5 + frontier reasoning targets." },
            { name: "Meta Platforms Ireland Ltd.", tag: "INTL", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981",
              segment: "International ops", users: "—", lead: "Local MD", legal: "Dublin",
              notes: "Books most non-US ad revenue. GDPR / DSA compliance entity. Subject to multiple ongoing EU investigations." },
            { name: "Meta Payments / Pay", tag: "FINTECH", tagBg: "rgba(16,185,129,0.12)", tagColor: "#10B981", color: "#10B981",
              segment: "FoA (small)", users: "—", lead: "Reports into FoA", legal: "Multiple state-licensed money transmitter entities",
              notes: "Powers WhatsApp Pay, IG checkout, FB Marketplace payments. Diem/Libra was wound down 2022; Pay is the surviving rail." },
            { name: "CTRL-Labs / Onavo / acquired tech", tag: "OTHER", tagBg: "rgba(100,116,139,0.12)", tagColor: "#94A3B8", color: "#94A3B8",
              segment: "Various", users: "—", lead: "Integrated into RL / Security", legal: "Wound into parent entities",
              notes: "CTRL-Labs (2019, ~$500M-1B) → neural wristband for Ray-Ban Display. Onavo wound down 2019. Smaller bolt-ons folded into core." },
          ].map((e, i) => (
            <div key={i} style={{ background: "#111827", border: "1px solid #1E293B", borderRadius: 8, padding: "12px 12px 10px" }}>
              <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, background: e.tagBg, color: e.tagColor, fontWeight: 600, display: "inline-block", marginBottom: 6 }}>{e.tag}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", marginBottom: 2, lineHeight: 1.2 }}>{e.name}</div>
              <div style={{ fontSize: 9, color: "#64748B", marginBottom: 8 }}>{e.segment} &middot; {e.legal}</div>
              <div style={{ fontSize: 10, color: "#E2E8F0", lineHeight: 1.7 }}>
                <div><span style={{ color: "#64748B", fontWeight: 600 }}>Users:</span> {e.users}</div>
                <div><span style={{ color: "#64748B", fontWeight: 600 }}>Leadership:</span> {e.lead}</div>
                <div style={{ marginTop: 4, color: "#94A3B8", fontStyle: "italic" }}>{e.notes}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Debt Structure — Inside vs Outside Meta Corp */}
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, marginTop: 8 }}>Debt Structure — What's Inside vs Outside the Meta Corporate Borrower</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16, lineHeight: 1.7 }}>
          Meta has two distinct credit silos. <span style={{ color: "#10B981", fontWeight: 700 }}>Inside</span> the Meta Platforms, Inc. corporate borrower: a clean stack of senior unsecured notes, fully recourse, sitting alongside ~$60-70B of cash. <span style={{ color: "#F59E0B", fontWeight: 700 }}>Outside</span> the corporate borrower (off-balance-sheet to Meta but economically attached to it): a rapidly growing pile of project-finance JVs (Hyperion LA), GPU-backed SPV debt at vendor counterparties (CoreWeave CCAC VIII, Nebius), build-to-suit lease obligations, and ~12 GW of long-dated PPAs. Meta credit holders only have first-claim on Inside; equity holders bear the economics of both.
        </div>

        {/* Side-by-side summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg, #0B2818, #061509)", border: "1.5px solid #10B981", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "#6EE7B7", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700, marginBottom: 4 }}>Inside Meta Corporate Borrower</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 10 }}>Recourse, on-balance-sheet, A1/AA-/A+ rated</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "#E2E8F0", lineHeight: 1.6 }}>
              <div><span style={{ color: "#6EE7B7", fontWeight: 700 }}>Senior unsecured notes:</span> ~$28-30B outstanding across 2022 / 2024 / 2025 issuances. Maturities 2027–2064.</div>
              <div><span style={{ color: "#6EE7B7", fontWeight: 700 }}>Operating lease liabilities:</span> ~$22-25B (long-term DC + office leases under ASC 842). Reported as lease liabilities, not debt — but contractually senior fixed claims.</div>
              <div><span style={{ color: "#6EE7B7", fontWeight: 700 }}>Revolver / commercial paper:</span> $5B revolver (undrawn historically); CP program available but rarely tapped.</div>
              <div><span style={{ color: "#6EE7B7", fontWeight: 700 }}>Net cash position:</span> ~$60-70B cash + securities &gt; ~$30B funded debt. Net cash positive even after AI capex acceleration.</div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #2A1B05, #150D03)", border: "1.5px solid #F59E0B", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "#FCD34D", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700, marginBottom: 4 }}>Outside Meta Corporate Borrower</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 10 }}>Off-balance-sheet to Meta; SPV / vendor / JV-level debt; non-recourse</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "#E2E8F0", lineHeight: 1.6 }}>
              <div><span style={{ color: "#FCD34D", fontWeight: 700 }}>Hyperion LA JV (Blue Owl / PIMCO):</span> ~$26-29B project finance + JV debt at the SPV. Meta is partner/offtaker — likely deconsolidated. Reported Oct/Nov 2025.</div>
              <div><span style={{ color: "#FCD34D", fontWeight: 700 }}>CoreWeave CCAC VIII (DDTL 4.0):</span> $8.5B IG-rated GPU-backed loan (A3 / A-low). Borrower = CoreWeave SPV. Meta is offtaker on $19.2B contract; not a guarantor.</div>
              <div><span style={{ color: "#FCD34D", fontWeight: 700 }}>Nebius vendor financing:</span> Multi-billion-$ tranches at Nebius level, supported by Meta's $27B capacity contract. Meta is offtaker, not borrower.</div>
              <div><span style={{ color: "#FCD34D", fontWeight: 700 }}>Other project finance / BTS leases:</span> Selected DC sites built by 3rd-party developers under build-to-suit leases.</div>
              <div><span style={{ color: "#FCD34D", fontWeight: 700 }}>PPA portfolio:</span> ~12 GW long-dated power contracts. Disclosed as commitments, not debt — but multi-decade fixed claims.</div>
            </div>
          </div>
        </div>

        {/* Inside detail — Senior Unsecured Notes */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: "rgba(16,185,129,0.12)", color: "#10B981" }}>INSIDE — RECOURSE</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>Senior Unsecured Notes (Meta Platforms, Inc. as issuer)</div>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>~$28-30B aggregate outstanding. All issued at the parent. Pari passu. Make-whole call standard. No financial maintenance covenants.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 800 }}>
              <thead>
                <tr>
                  {["Issue", "Size", "Coupon", "Maturity", "Use of Proceeds", "Notes"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { issue: "Aug 2022 inaugural — 4 tranches", size: "$10.0B", coupon: "3.50–4.65%", mat: "2027 / 2032 / 2052 / 2062", use: "General corporate purposes / buybacks / capex", notes: "First-ever Meta debt issuance. 4 tranches priced 5/10/30/40 yr. Stock was at the post-2022 lows; pricing was wide vs subsequent issuance." },
                  { issue: "May 2024 follow-on", size: "~$10.5B", coupon: "5.20–5.85%", mat: "2027 / 2031 / 2034 / 2054 / 2064", use: "AI capex / buybacks / GCP", notes: "Issued as AI capex began to scale. Order book reportedly 4–5x oversubscribed at launch." },
                  { issue: "2025 issuance (rolling)", size: "~$10-15B est.", coupon: "5.0–5.7%", mat: "2030–2055", use: "AI capex (Hyperion / Prometheus / GPU procurement / DC fit-out)", notes: "Rolling tranches throughout the year to fund capex without burning operating cash. Funds the 'inside' borrower while SPVs fund themselves." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.issue}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#10B981", fontWeight: 600 }}>{row.size}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.coupon}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0" }}>{row.mat}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.use}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: Meta 10-K (debt footnote), 424B prospectus supplements, Bloomberg new-issue data, Trace pricing. Tranche-level coupons rounded; 2025 issuance amount estimated pending 10-K detail.</div>
        </div>

        {/* Outside detail — Hyperion */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>OUTSIDE — PROJECT FINANCE</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>Hyperion LA SPV / JV (Blue Owl Capital + PIMCO)</div>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Reported Oct/Nov 2025: Meta is teaming with Blue Owl Capital and PIMCO on a ~$26-29B financing structure for the 5 GW Hyperion campus in Richland Parish, LA. Structured as a JV / SPV where the partners own most of the equity + debt, Meta has development &amp; operating rights and a long-term offtake/lease obligation. Subject to final accounting, the SPV is likely <span style={{ fontWeight: 700, color: "#FCD34D" }}>not consolidated</span> on Meta's balance sheet — but Meta's contractual obligation to take capacity is disclosed as a commitment.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 800 }}>
              <thead>
                <tr>
                  {["Element", "Value", "Detail"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { el: "Total project size", val: "~$26-29B", det: "Single largest off-balance-sheet financing in tech history if consummated as reported. Phased capacity buildout over 5+ years." },
                  { el: "Capacity", val: "~5 GW (Hyperion LA)", det: "Multi-phase. Powered by Entergy Louisiana. AI training-class campus targeted from late 2026 onward." },
                  { el: "Borrower / Issuer", val: "Hyperion SPV (JV)", det: "Bankruptcy-remote vehicle. Lenders: Blue Owl Capital (equity + debt), PIMCO (anchor debt buyer), syndicate of insurance accounts." },
                  { el: "Meta role", val: "Minority partner / Offtaker", det: "Meta provides development know-how + long-term lease/tolling commitment. Not the borrower; not a guarantor of project debt." },
                  { el: "Recourse to Meta Corp", val: "None on debt", det: "Project debt is non-recourse to Meta Platforms, Inc. Meta's exposure = future fixed payments under the offtake/lease (disclosed as commitment in 10-K Note)." },
                  { el: "Accounting", val: "Likely deconsolidated", det: "Subject to ASC 810 VIE analysis. If Meta is not the primary beneficiary (no controlling financial interest), JV is not consolidated and project debt does not appear on Meta B/S." },
                  { el: "Why this structure", val: "Capacity off-credit", det: "Lets Meta lock in 5 GW of AI capacity without adding ~$26-29B to its own debt stack — preserves A1/AA-/A+ ratings + net cash positioning. Investors get IG project paper with Meta offtake credit underneath." },
                  { el: "Status", val: "Reported, not yet final", det: "FT / Bloomberg / WSJ reported terms in late 2025. Final accounting + structure may differ from reporting." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.el}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontWeight: 600, whiteSpace: "nowrap" }}>{row.val}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12 }}>{row.det}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: FT (Oct 2025), Bloomberg, WSJ, Reuters reporting on Meta–Blue Owl–PIMCO Hyperion structure. Specific tranche / equity / debt split was not fully disclosed at announcement; verify in eventual 10-K commitments footnote and Blue Owl IR.</div>
        </div>

        {/* Outside detail — GPU SPV financings */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>OUTSIDE — GPU-BACKED VENDOR DEBT</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>SPV / DDTL Financings Anchored by Meta Offtake Contracts</div>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Meta-anchored capacity contracts at CoreWeave and Nebius give those vendors the cash-flow visibility to raise project-level secured debt against the GPU clusters. Meta is the offtaker (creates the contract), <span style={{ fontWeight: 700, color: "#F8FAFC" }}>not</span> the issuer or guarantor of the SPV debt. From a credit perspective, this debt is invisible at the Meta corporate level but is what enables Meta's third-party GPU backlog to scale to $60B+.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 1000 }}>
              <thead>
                <tr>
                  {["Facility", "Borrower (SPV)", "Size", "Rate / Rating", "Maturity", "Collateral", "Meta's Role", "Source"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    fac: "DDTL 4.0 (Meta Facility)", borrower: "CCAC VIII, LLC (CoreWeave SPV, Delaware)",
                    size: "$8.5B", rate: "SOFR+225 / ~5.9% fixed · A3 (Moody's) / A-low (DBRS)",
                    mat: "Mar 2032",
                    coll: "GB300 NVL72 GPU clusters + Meta contract cash flows (~$19.2B). LTV ~44%.",
                    role: "Offtaker on $19.2B initial contract. NOT a guarantor; non-recourse to Meta. Provides the cash flow that anchors the IG rating.",
                    src: "CoreWeave 8-K (Apr 2026); MUFG / Morgan Stanley (co-structuring); Blackstone Credit (anchor)"
                  },
                  {
                    fac: "Nebius vendor debt (multi-tranche)", borrower: "Nebius Group N.V. + sub-SPVs",
                    size: "Several $B — exact tranches not all public", rate: "Mix of secured loans + unsecured (HY)",
                    mat: "Various (rolling)",
                    coll: "GPU fleet + DC assets at Nebius operating subs. Some tranches enhanced by Meta capacity-contract revenue assignment.",
                    role: "Offtaker on $27B multi-year capacity agreement (Sep 2025). NOT a guarantor; not recourse to Meta. Anchor customer status enables the financing.",
                    src: "Nebius IR; Bloomberg debt distribution"
                  },
                  {
                    fac: "Future GPU SPV pipeline", borrower: "TBD (additional vendor SPVs)",
                    size: "Open — depends on backlog growth", rate: "Pricing benchmarked to DDTL 4.0 IG print",
                    mat: "TBD",
                    coll: "GPU clusters + future Meta offtake contracts",
                    role: "Pattern: every major Meta capacity contract creates eligible offtake collateral for vendor-side financing. Watch for repeat IG GPU-backed deals at Nebius / Galaxy / others.",
                    src: "Sell-side credit research"
                  },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.fac}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.borrower}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontWeight: 600, whiteSpace: "nowrap" }}>{row.size}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.rate}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.mat}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.coll}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.role}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 10 }}>{row.src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outside detail — Leases & Commitments */}
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: "rgba(139,92,246,0.12)", color: "#A78BFA" }}>OFF-B/S — DEBT-LIKE OBLIGATIONS</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>Other Off-Balance-Sheet / Debt-Like Commitments</div>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>These items are typically not classified as "debt" on the balance sheet but are functional fixed claims that bondholders + analysts look through.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Item", "Approx Size", "Treatment", "Why It's Debt-Like"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { item: "Build-to-suit DC leases", size: "Multi-$B (estimated)", treatment: "ASC 842 operating lease — already on B/S as lease liability ($22-25B aggregate)", why: "Long-dated fixed payments to 3rd-party DC developers. Effectively debt with a real-asset wrapper." },
                  { item: "PPA portfolio", size: ">12 GW contracted", treatment: "Off-balance-sheet — disclosed as purchase commitment in 10-K", why: "10-20 yr fixed-volume / fixed-price power obligations. Functions as long-dated payable that doesn't show in funded debt." },
                  { item: "GPU offtake contracts (CoreWeave $35B + Nebius $27B + others)", size: "$60B+ aggregate over 5-7 yrs", treatment: "Off-balance-sheet purchase commitment", why: "Take-or-pay style multi-year obligations. Non-cancelable in most cases. Underpins vendor-side debt above." },
                  { item: "Reality Labs / acquisition earn-outs", size: "Smaller", treatment: "Contingent — disclosed in commitments footnote", why: "EssilorLuxottica JV future contributions; Scale AI deal earn-back / commercial commitments." },
                  { item: "Litigation / regulatory accruals", size: "Variable", treatment: "On B/S as accrued liabilities when probable + estimable", why: "Active FTC trial, EU DMA / DSA fines. Step-changes can be material (e.g., past $5B FTC settlement)." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.item}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#A78BFA", fontWeight: 600 }}>{row.size}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.treatment}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12 }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aggregate view + analytical implications */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Why This Split Matters</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 6 }}>For Meta credit holders (bondholders)</div>
              <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.7 }}>
                You only have first-claim on the <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Inside</span> stack. The Inside stack is small relative to FCF and net cash positive — that's why you get A1 / AA-. The growing Outside stack is non-recourse to you, but the <span style={{ fontStyle: "italic" }}>obligations</span> Meta has to those SPVs (offtake / lease payments) are senior to your claim because they're operating expenses. Watch contractual obligations footnote, not just funded debt.
              </div>
            </div>
            <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", marginBottom: 6 }}>For equity holders</div>
              <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.7 }}>
                Meta gets the economic exposure of the Outside stack without the rating agency penalty. Net debt screens look benign while real lease + offtake commitments scale rapidly. <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Bear case</span>: capex + commitments outpace ad cash flow, forcing buyback pause or worse. <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Bull case</span>: AI inference revenue + ad-stack AI gains absorb the obligations and ratings go up with debt as growth materializes.
              </div>
            </div>
            <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 6 }}>For rating agencies</div>
              <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.7 }}>
                Moody's / S&P / Fitch all add some adjusted-debt treatment for operating leases (already done) + offtake commitments + JV obligations when calculating leverage ratios. Hyperion JV is the first mega-deal that will test how aggressively they look through. Watch agency methodology updates in 2026.
              </div>
            </div>
            <div style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", marginBottom: 6 }}>Equity / Liquidity — capital allocation</div>
              <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.7 }}>
                Class A common ~2.2B outstanding. Class B (10 votes/share) gives Zuckerberg ~58% voting control. ~$60-70B cash &amp; securities; net cash positive even after AI capex acceleration. Active ~$50B buyback authorization with multiple historical refresh increments. Buyback can be the swing variable if Outside obligations consume more FCF than expected.
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 14, fontStyle: "italic" }}>Sources: Meta 10-K (commitments footnote), 424B prospectus supplements, FT/Bloomberg/WSJ Hyperion reporting, CoreWeave 8-K (DDTL 4.0), Nebius IR, Moody's / S&P methodology papers on adjusted leverage.</div>
        </div>
      </>)}

      {/* ===== SUPPLY CHAIN & CUSTOMERS TAB ===== */}
      {metaTab === "contracts" && (<>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Supply Chain &amp; Customers</div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>Meta is unusual: it is simultaneously the largest customer of multiple AI infra vendors AND a major supplier of open-weight AI to the developer ecosystem. Customer concentration is low on the demand side (advertising) but supplier concentration is rising fast on the infrastructure side (NVIDIA, TSMC, Broadcom, CoreWeave).</div>

        {/* Demand side — Advertiser concentration */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Demand Side: Advertiser Concentration</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>10M+ active advertisers globally. No single advertiser exceeds ~5% of revenue. Top 100 ≈ 25% of FoA revenue. Largest exposure is to e-commerce / cross-border categories.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 800 }}>
              <thead>
                <tr>
                  {["Category", "Est. % of FoA Rev", "Direction", "Notable Advertisers", "Risk Factor"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: "Online commerce", pct: "~22-25%", dir: "Stable", names: "Amazon, Shopify ecosystem, Etsy, eBay, Walmart Connect", risk: "Tariff regime + consumer goods cycle. ATT-driven measurement still a drag (improving via AI)." },
                  { cat: "Cross-border e-com (China)", pct: "~8-12%", dir: "Volatile", names: "Temu (PDD), Shein, AliExpress", risk: "Single-customer swing factor. Temu cut spend mid-2025. De minimis tariff changes are a recurring shock." },
                  { cat: "Gaming / mobile apps", pct: "~10-12%", dir: "Stable", names: "Tencent / NetEase titles, Scopely, Playtika, Microsoft (Xbox / Activision)", risk: "Soft on Apple ATT; Meta's AAA mobile install ad targeting recovering with AI ranking." },
                  { cat: "Financial services / fintech", pct: "~8-10%", dir: "Growth", names: "JPM, BofA, Citi, Robinhood, Wealthfront", risk: "Reg / compliance scrutiny rising in EU + US." },
                  { cat: "CPG / retail / brand", pct: "~10-12%", dir: "Cyclical", names: "P&G, Unilever, Nestlé, Coca-Cola, PepsiCo, L'Oréal", risk: "Tied to global ad spend cycle. Largest advertisers run multi-year RFPs." },
                  { cat: "DTC / SMB long tail", pct: "~25-30%", dir: "Growth", names: "Millions of SMBs via self-serve. Click-to-Message ads and WhatsApp Business monetization main growth wedge.", risk: "SMB churn correlates with macro. Self-serve = no salesperson defending." },
                  { cat: "Auto / travel", pct: "~5-8%", dir: "Recovering", names: "Major OEMs (Toyota, GM, Hyundai), Booking, Expedia, Marriott", risk: "Tied to auto / travel demand cycles." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{row.cat}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.pct}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#10B981", fontSize: 11 }}>{row.dir}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.names}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Category-level shares are estimates (Meta does not break out advertiser concentration directly). Sources: sell-side ad-channel checks (Evercore, MoffettNathanson, Bernstein), Meta earnings call commentary, eMarketer, MAGNA.</div>
        </div>

        {/* Supply side — major commitments */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Supply Side: Major AI Infrastructure Commitments</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>~$62B+ in third-party GPU capacity through 2032 across two anchor partners. Strategic ASIC bet via Broadcom / TSMC. Power &amp; PPA pipeline &gt; 12 GW.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 1000 }}>
              <thead>
                <tr>
                  {["Counterparty", "Type", "Commitment", "Term", "What it covers", "Strategic Role", "Risk", "Source"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { cp: "NVIDIA", type: "GPU supplier", commit: "Multi-year — undisclosed dollar value", term: "Rolling", covers: "H100, H200, B100/B200, GB200/GB300, Vera Rubin (late 2026+)", role: "Primary frontier-training silicon", risk: "Single-vendor concentration. Allocation politics. Pricing power tilted to NVIDIA.", src: "Earnings calls; NVIDIA customer disclosures" },
                  { cp: "Broadcom (MTIA)", type: "Custom ASIC partner", commit: "Multi-year design + supply", term: "Through MTIA v3", covers: "MTIA v1 (inference, deployed 2024), v2 (training, ramping 2025-26), v3 (in dev)", role: "Reduces NVIDIA dependency long-term; lower TCO for inference", risk: "Execution risk on training-class ASIC. Schedule slippage = NVIDIA capex stays elevated.", src: "Broadcom earnings calls; Meta MTIA technical posts" },
                  { cp: "TSMC", type: "Foundry", commit: "Wafer allocation (size undisclosed)", term: "Multi-node (N3 → N2)", covers: "MTIA v2 on N3/N3E; MTIA v3 reserved on N2; Quest SoC on N5/N4", role: "Sole frontier-node foundry for Meta silicon", risk: "Geopolitical (Taiwan), node-leader pricing, capacity competition with Apple/AMD/NVIDIA.", src: "TSMC earnings; technology disclosures" },
                  { cp: "AMD", type: "GPU supplier (secondary)", commit: "Undisclosed", term: "Rolling", covers: "MI300X / MI325X / MI350 — primarily inference", role: "Diversification hedge against NVIDIA", risk: "Software stack (ROCm) lag still real for training; mostly inference deployments.", src: "AMD earnings; channel checks" },
                  { cp: "CoreWeave", type: "GPU cloud", commit: "$35B (initial $14.2B + $21B expansion)", term: "Through 2032", covers: "GB300 NVL72 capacity. Underpinned $8.5B IG-rated DDTL 4.0.", role: "Largest 3rd-party capacity partner; flex above self-built", risk: "Counterparty (CoreWeave is BB-rated). Delivery timing on Blackwell Ultra. Pricing reset clauses.", src: "CoreWeave 8-K (Apr 9 2026); CRWV IR" },
                  { cp: "Nebius", type: "GPU cloud", commit: "$27B multi-year", term: "Through ~2031", covers: "GPU capacity primarily in EU + MENA + US sites", role: "Geographic + counterparty diversification vs CoreWeave", risk: "Nebius operating history is shorter; integration risk; concentration in single anchor (Meta).", src: "Nebius announcement (Sep 2025)" },
                  { cp: "EssilorLuxottica", type: "Reality Labs partner", commit: "JV — multi-year extension (2024)", term: "Through ~2030+", covers: "Ray-Ban Meta + Ray-Ban Display SKUs + future smart-glasses lineup", role: "Brand + retail distribution for AR strategy", risk: "Single-partner concentration on consumer wearable side; recently tested by Display reception.", src: "EssilorLuxottica IR; press releases" },
                  { cp: "Foxconn / Pegatron / Goertek / Luxshare", type: "Reality Labs assembly", commit: "Multi-vendor", term: "Per SKU", covers: "Quest assembly (Vietnam/China); smart-glasses optical/acoustic modules", role: "Hardware supply chain", risk: "Standard contract manufacturing risk; geopolitical (China exposure).", src: "Industry teardowns; supply chain checks" },
                  { cp: "PPA portfolio (NextEra, RWE, Apex, Invenergy, etc.)", type: "Power supply", commit: ">12 GW contracted clean PPA pipeline", term: "10-20 yr", covers: "Wind, solar, nuclear (Constellation deal 2024), some battery storage", role: "Sustainability + grid availability for AI capex buildout", risk: "Grid interconnect timing is gating factor for new DC sites — not power-cost.", src: "BNEF corporate PPA tracker; Meta sustainability reports" },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6", whiteSpace: "nowrap" }}>{row.cp}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11, whiteSpace: "nowrap" }}>{row.type}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F8FAFC", fontWeight: 600 }}>{row.commit}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#E2E8F0", fontSize: 11 }}>{row.term}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.covers}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.role}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#F59E0B", fontSize: 11 }}>{row.risk}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 10 }}>{row.src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DC Footprint */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 4, letterSpacing: "-0.3px" }}>Data Center Footprint (selected)</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>~25 owned campuses globally. Build cadence accelerated post-2023; Hyperion (LA) is Meta's largest single project ever. ~12+ GW power contracted.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Site", "Region", "Capacity", "Status", "Notes"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { site: "Hyperion (Richland Parish, LA)", region: "USA", cap: "~5 GW (multi-phase)", status: "Under build", notes: "Largest Meta project ever. >$10B announced; expansions reported. Entergy power. Targeted for AI training scale-out late 2026 onward." },
                  { site: "Prometheus (New Albany / Ohio cluster)", region: "USA", cap: "~2 GW", status: "Active + expanding", notes: "Existing Ohio campus expanded into Meta's first explicitly AI-dedicated US site. AEP / utility power." },
                  { site: "Mesa, AZ", region: "USA", cap: "Multi-hundred MW", status: "Active", notes: "Sustainability flagship — water recycling, on-site solar partnerships." },
                  { site: "Eagle Mountain, UT", region: "USA", cap: "Multi-hundred MW", status: "Active + expanding", notes: "Expanded multiple times since 2018. Cool / dry climate efficiency advantage." },
                  { site: "Richland, WA", region: "USA", cap: "Multi-hundred MW", status: "Active + expanding", notes: "Hydro power. Cool climate. Long-tenured site." },
                  { site: "Forest City, NC; Altoona, IA; Henrico, VA; Newton, GA; Gallatin, TN; Los Lunas, NM; etc.", region: "USA", cap: "100s of MW each", status: "Active", notes: "Network of established US campuses dating back to 2010s." },
                  { site: "Luleå, Sweden; Clonee, Ireland; Odense, Denmark; Talavera de la Reina, Spain", region: "EU", cap: "Multi-hundred MW each", status: "Active", notes: "EU footprint serves European ad ops + GDPR / data residency." },
                  { site: "Singapore", region: "APAC", cap: "150-200 MW", status: "Active", notes: "First Meta APAC owned campus." },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 600, color: "#F8FAFC", fontSize: 11 }}>{row.site}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.region}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 700 }}>{row.cap}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                        background: row.status === "Active" ? "rgba(16,185,129,0.12)" : row.status === "Under build" ? "rgba(245,158,11,0.12)" : "rgba(59,130,246,0.12)",
                        color: row.status === "Active" ? "#10B981" : row.status === "Under build" ? "#F59E0B" : "#3B82F6",
                      }}>{row.status}</span>
                    </td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #1E293B10", color: "#64748B", fontSize: 11 }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>Sources: Meta sustainability reports, "Building Meta" infrastructure posts, datacenterdynamics.com, Open Compute Project disclosures. Capacity figures are approximate aggregate IT load; many campuses are multi-phase.</div>
        </div>

        {/* Risk summary */}
        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Cross-Cutting Risk Map</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { color: "#EF4444", title: "NVIDIA Concentration", desc: "Despite MTIA + AMD, frontier training is still ~95% NVIDIA. Allocation politics + price/performance pacing dictate Meta's training cadence." },
              { color: "#F59E0B", title: "Counterparty (CoreWeave, Nebius)", desc: "$62B+ commitments to BB-rated/private GPU clouds. Operational + delivery risk, but $8.5B IG DDTL was structured to absorb that risk for Meta's piece." },
              { color: "#3B82F6", title: "Reality Labs Cumulative Loss", desc: "$70B+ cumulative loss with no near-term breakeven. Tolerated only because ad business is strong; sensitivity rises if AI ROI doubts return." },
              { color: "#8B5CF6", title: "Regulatory (EU DSA / DMA, US FTC)", desc: "Active FTC antitrust trial on Instagram/WhatsApp acquisitions. EU DMA gatekeeper obligations on FB / IG / WhatsApp Marketplace, Messenger interop. DSA fines for content moderation." },
              { color: "#10B981", title: "Supervoting Structure", desc: "Zuckerberg's ~58% voting control means strategic pivots (e.g., RL spend, AI talent splurge) are not constrained by activists or hostile acquirers. Both a feature and a risk." },
              { color: "#F59E0B", title: "Talent / People Cost", desc: "Post-MSL hiring spree step-functioned senior AI compensation. Rivalry with OpenAI / Google means retention costs structurally higher going forward." },
            ].map((r, i) => (
              <div key={i} style={{ background: "#0B0F19", border: "1px solid #1E293B", borderRadius: 6, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: r.color, marginBottom: 6 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "#E2E8F0", lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginBottom: 24 }}>Sources: Meta 10-K FY2024, Q1–Q3 2025 earnings, NVIDIA / AMD / Broadcom earnings, CoreWeave 8-K, Nebius IR, EssilorLuxottica IR, BNEF, sustainability reports. Specific commitment values rounded.</div>
      </>)}

      {/* ===== SENTIMENT TAB ===== */}
      {metaTab === "sentiment" && (<>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Market Sentiment</div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 24 }}>~50 sell-side analysts. Consensus: Buy. Investment grade across all three majors. Equity narrative oscillates between AI capex anxiety and ad-business operating leverage; credit narrative is cleaner — robust FCF, low net leverage, growing absolute debt stack.</div>

        {/* Consensus Snapshot */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Consensus Rating", value: "Buy", sub: "~50 analysts; ~80% Buy / ~15% Hold / ~5% Sell", color: "#10B981" },
            { label: "Avg Price Target", value: "~$700-800", sub: "Range varies widely with capex assumptions", color: "#3B82F6" },
            { label: "Credit Ratings", value: "A1 / AA- / A+", sub: "Moody's / S&P / Fitch — stable outlook", color: "#10B981" },
            { label: "Net Cash / (Debt)", value: "Net cash positive", sub: "~$60-70B cash & securities vs ~$30B+ debt", color: "#10B981" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#111827", borderRadius: 10, border: "1px solid #1E293B", padding: "14px 18px", flex: "1 1 200px", minWidth: 200 }}>
              <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Sentiment Timeline */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Sentiment Arc: 2022 → Present</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { phase: "Current (Apr 2026)", sentiment: "Cautious-Constructive", color: "#3B82F6", desc: "Stock recovering from Q4 25 capex shock. Bull case = ad ops leverage + AI ranking driving Reels monetization + WhatsApp Business inflection. Bear case = $90-115B FY26 capex with no clean ROI signal yet, RL still bleeding, MSL talent costs. Q1 26 print (Apr 30) is a near-term sentiment fulcrum." },
              { phase: "Q4 2025 / Capex Shock (Jan-Feb 2026)", sentiment: "Reset", color: "#EF4444", desc: "Stock pulled back ~15-20% on FY26 capex revision. PT cuts across the street (avg PT down ~10-15%). Several Hold downgrades. Comparison to 2022 'Year-of-Efficiency' setup — but with the structural difference that revenue is still growing 18-20%." },
              { phase: "AI Capex Acceleration (Sep-Dec 2025)", sentiment: "Mixed", color: "#F59E0B", desc: "$14.2B CoreWeave + $27B Nebius announcements raised eyebrows. Ray-Ban Display launched to mixed reception. Llama 4 still under scrutiny. Bulls: open-source platform value + ad-tech AI moats. Bears: $40B+ in 3rd-party GPU commitments raises questions about MTIA execution." },
              { phase: "Scale AI / MSL Era (Jun-Aug 2025)", sentiment: "Bullish — AI Re-Rate", color: "#10B981", desc: "Scale AI deal + Wang appointment + AI talent splurge re-rated Meta as a frontier AI player. Stock hit new highs. Wells Fargo, Goldman, JPM raised PTs. The narrative shifted from 'Llama 4 disappointed' to 'Meta has the capital and the now the talent to compete at frontier.'" },
              { phase: "Llama 4 Disappointment (Apr-May 2025)", sentiment: "Bearish on AI thesis", color: "#EF4444", desc: "Llama 4 Scout/Maverick released to mixed reviews. Key concerns: weak reasoning, benchmark cherry-picking accusations, gap to GPT-4.5 / Claude 3.7 / Gemini 2.5. Stock briefly underperformed mega-cap peers. Catalyzed the talent overhaul." },
              { phase: "Reels + Ad-Stack AI (2024)", sentiment: "Bullish", color: "#10B981", desc: "FY24 revenue $164.5B (+22%). Reels monetization gap to feed nearly closed. Advantage+ AI auto-bidding adoption broadly. Stock 2x'd. Capex stepped up but ad business operating leverage offset it." },
              { phase: "Year of Efficiency (2023)", sentiment: "V-shaped recovery", color: "#10B981", desc: "Two layoff rounds. OpEx reset. Stock from ~$90 (Nov 22) to >$350 (YE23). Permanent operating margin reset from 25% to 40%+. Established Zuckerberg + Susan Li capital discipline credibility." },
              { phase: "Reality Labs Trough (2022)", sentiment: "Capitulation", color: "#EF4444", desc: "Stock $90 in Nov 2022. ATT impact + RL spend without revenue. CDS widened materially. Activist letters (Altimeter Brad Gerstner). Inflection that produced Year of Efficiency." },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B" }}>
                <div style={{ width: 220, minWidth: 220, background: "#0B0F19", padding: "12px 14px", borderRight: "1px solid #1E293B" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{p.phase}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginTop: 4 }}>{p.sentiment}</div>
                </div>
                <div style={{ flex: 1, padding: "12px 14px", background: "#111827" }}>
                  <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyst Coverage */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Analyst Coverage Detail</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12, minWidth: 800 }}>
              <thead>
                <tr>
                  {["Firm", "Rating", "Price Target", "Last Action", "Key Thesis"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { firm: "Wells Fargo", rating: "Overweight", pt: "$870", action: "Raised post Scale AI", thesis: "AI capex eventually monetizes via ad-stack + Llama distribution. Top pick within mega-cap." },
                  { firm: "JPMorgan", rating: "Overweight", pt: "$820", action: "Trimmed in Feb 2026", thesis: "Operating leverage thesis intact even with capex step-up. WhatsApp Business as untapped TAM." },
                  { firm: "Morgan Stanley", rating: "Overweight", pt: "$800", action: "Reiterated post Q3 25", thesis: "Reels monetization + AI ranking are durable margin drivers. RL is option value." },
                  { firm: "Goldman Sachs", rating: "Buy", pt: "$790", action: "Cut from $850 (Feb 2026)", thesis: "Ad-stack moats deepen with AI. Capex worth funding given reinvestment runway." },
                  { firm: "Evercore ISI", rating: "Outperform", pt: "$770", action: "Cut PT, raised conviction (Feb 2026)", thesis: "Best risk/reward in mega-cap. $60-70B cash gives downside cushion." },
                  { firm: "BofA Securities", rating: "Buy", pt: "$760", action: "Reiterated", thesis: "Ad ROAS gains under-appreciated. MTIA reduces long-term NVIDIA dependency." },
                  { firm: "Citi", rating: "Buy", pt: "$740", action: "Cut from $800 (Feb 2026)", thesis: "Ad business inflecting; capex digestion is the bear-case overhang." },
                  { firm: "Barclays", rating: "Overweight", pt: "$720", action: "Cut from $790 (Feb 2026)", thesis: "Llama 4 reset already in numbers. Watch MTIA v2 ramp." },
                  { firm: "Deutsche Bank", rating: "Buy", pt: "$700", action: "Reiterated", thesis: "Cleanest mega-cap ad story. Reality Labs spend tolerated as long as RL revenue grows >50%." },
                  { firm: "Bernstein", rating: "Market Perform", pt: "$640", action: "Downgrade Mar 2026", thesis: "Capex cycle lengthening; ROIC compression. Stock fairly valued at ~25x next-12-mo." },
                  { firm: "MoffettNathanson", rating: "Buy", pt: "$760", action: "Reiterated", thesis: "Channel checks bullish on Reels CPM growth. Cross-border softness is the swing factor." },
                  { firm: "Needham", rating: "Hold", pt: "n/a", action: "Reiterated", thesis: "Valuation full given AI capex absorbing FCF." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC", whiteSpace: "nowrap" }}>{row.firm}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
                        background: row.rating.includes("Buy") || row.rating.includes("Overweight") || row.rating.includes("Outperform") ? "rgba(16,185,129,0.12)" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                        color: row.rating.includes("Buy") || row.rating.includes("Overweight") || row.rating.includes("Outperform") ? "#10B981" : row.rating.includes("Sell") || row.rating.includes("Underperform") ? "#EF4444" : "#F59E0B",
                      }}>{row.rating}</span>
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#3B82F6" }}>{row.pt}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8", fontSize: 11 }}>{row.action}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12, maxWidth: 380 }}>{row.thesis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 10, fontStyle: "italic" }}>PTs are illustrative rounded estimates based on the post-Q4 25 sell-side reset. Verify in Bloomberg / FactSet before acting.</div>
        </div>

        {/* Credit Research */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Credit Research &amp; Ratings</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Agency / Firm", "Rating", "Outlook", "Key Points"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { agency: "Moody's", rating: "A1", outlook: "Stable", points: "Cited dominant ad platform, robust FCF, conservative net leverage despite rising absolute debt. Watch item: capex pace + Reality Labs losses." },
                  { agency: "S&P Global", rating: "AA-", outlook: "Stable", points: "Highest of the three. Strong business risk profile (advertising scale). Financial profile cushioned by net cash position. Capex monitored." },
                  { agency: "Fitch", rating: "A+", outlook: "Stable", points: "Comparable to Moody's. Notes: any sustained FCF deterioration from AI capex would pressure rating; unlikely near-term given ad ops leverage." },
                  { agency: "CreditSights", rating: "Outperform", outlook: "—", points: "Spreads have tightened over time as ratings stabilized at high single-A / AA-. Long-end spreads (2055/2062) still command premium given duration + capex tail risk." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.agency}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(16,185,129,0.12)", color: "#10B981" }}>{row.rating}</span>
                    </td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: row.outlook === "Positive" ? "#10B981" : row.outlook === "Negative" ? "#EF4444" : "#94A3B8", fontWeight: 600 }}>{row.outlook}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 12, maxWidth: 500 }}>{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: Moody's, S&P Global Ratings, Fitch issuer reports; CreditSights Meta credit notes; Bloomberg.</div>
        </div>

        {/* Insider / Ownership */}
        <div style={s.card}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Insider Activity &amp; Ownership</div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Insider Selling — Recurring Pattern</div>
          <div style={{ background: "#0B0F19", borderRadius: 8, border: "1px solid #1E293B", padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7 }}>
              Mark Zuckerberg has sold material amounts of stock under 10b5-1 plans annually since 2023 (proceeds funding the Chan Zuckerberg Initiative + personal). Susan Li, Bosworth, Cox have followed similar pre-arranged plan patterns. <span style={{ fontWeight: 700, color: "#F59E0B" }}>The market generally views Meta insider sales as non-signal</span> given (a) plan-driven cadence, (b) Zuckerberg's still-overwhelming ownership, (c) tax/charitable rationale. No insider buying in years (none expected — supervoting structure makes it pointless).
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Top Institutional Holders</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
              <thead>
                <tr>
                  {["Holder", "% Ownership (Class A)", "Type", "Notes"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #1E293B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { holder: "Mark Zuckerberg (founder)", pct: "~13% economic / ~58% voting", type: "Insider — Class B supervoting", notes: "Controlling shareholder. No realistic dilution event without his cooperation." },
                  { holder: "Vanguard", pct: "~8.5%", type: "Index / Active", notes: "Largest institutional holder via index funds + active. Standard mega-cap exposure." },
                  { holder: "BlackRock", pct: "~6.5%", type: "Index / Active", notes: "Second-largest. iShares + active mandates." },
                  { holder: "State Street", pct: "~4.0%", type: "Index", notes: "SPDR / index exposure." },
                  { holder: "Fidelity / FMR", pct: "~3.5%", type: "Active", notes: "Magellan + Contrafund + others. One of the larger active holders." },
                  { holder: "Capital Group", pct: "~3.0%", type: "Active", notes: "Long-term active holder; American Funds family." },
                  { holder: "Geode Capital", pct: "~2.0%", type: "Index", notes: "Sub-advisor to Fidelity index products." },
                  { holder: "T. Rowe Price", pct: "~1.8%", type: "Active", notes: "Significant active position; rotates with macro/AI views." },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", fontWeight: 700, color: "#F8FAFC" }}>{row.holder}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#3B82F6", fontWeight: 600 }}>{row.pct}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#94A3B8" }}>{row.type}</td>
                    <td style={{ padding: "10px 10px", borderBottom: "1px solid #1E293B10", color: "#CBD5E1", fontSize: 11 }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, fontStyle: "italic" }}>Sources: Meta 2025 Proxy Statement (DEF 14A), 13F filings (Q4 2025), MarketBeat, Fintel, SEC Form 4 filings. Class B supervoting structure means voting share differs materially from economic share.</div>
        </div>
      </>)}

      {/* ===== FINANCIALS TAB ===== */}
      {metaTab === "financials" && (
        <FinancialsTab ticker="META" companyId={companyId} companyName={companyName}
          curFields={curFields} updateField={updateField} />
      )}
    </>
  );
}
