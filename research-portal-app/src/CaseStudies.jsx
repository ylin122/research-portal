import { useState } from "react";
import { T_, FONT } from "./lib/theme";
import { VLine, VLineLabel, Box, DetailPanel } from "./lib/orgChart";

function ConceptAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: T_.bgPanel, borderRadius: 8, border: `1px solid ${open === i ? item.color + "40" : T_.border}`, overflow: "hidden", transition: "all .15s" }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: item.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</div>
                <div style={{ fontSize: 11, color: T_.textDim, marginTop: 1 }}>{item.summary}</div>
              </div>
            </div>
            <span style={{ fontSize: 9, color: T_.textGhost, transform: open === i ? "rotate(90deg)" : "rotate(0)", transition: "transform .15s", display: "inline-block", flexShrink: 0 }}>&#9654;</span>
          </div>
          {open === i && (
            <div style={{ padding: "0 14px 14px 28px", fontSize: 12, color: T_.textMid, lineHeight: 1.8 }}>{item.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CASES
   ═══════════════════════════════════════════════════════ */

const CASES = [
  { key: "fluor", label: "Fluor Corporation", sector: "E&C / Engineering", year: "2019", color: "#3B82F6" },
];

/* ═══════════════════════════════════════════════════════
   FLUOR CORPORATION — 2019 10-K CRISIS
   ═══════════════════════════════════════════════════════ */

function FluorCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    segments: (
      <DetailPanel title="Business Segments (Pre-Restructuring)" onClose={() => setDetail(null)}>
        <p><strong>Energy & Chemicals (E&C)</strong> — Fluor's largest and most established segment. Designed, built, and maintained oil refineries, petrochemical plants, LNG facilities, and offshore platforms for clients like ExxonMobil, Shell, and Saudi Aramco. Historically cost-reimbursable contracts with predictable margins.</p>
        <p><strong>Mining, Industrial, Infrastructure & Power (MIIP)</strong> — Covered mining and metals projects, life sciences, advanced manufacturing, transportation infrastructure, and power generation. This segment became the <span style={{ color: T_.red }}>epicenter of Fluor's 2019 crisis</span> — it was where the company had taken on the most fixed-price/lump-sum turnkey (LSTK) contracts, transferring construction risk from clients to Fluor.</p>
        <p><strong>Diversified Services</strong> — Staffing, equipment/fleet services, temporary facilities, and operations & maintenance for government and commercial clients. Included subsidiaries <strong>AMECO</strong> (equipment) and <strong>TRS Staffing Solutions</strong> (JV).</p>
        <p><strong>Government</strong> — Served U.S. and international government agencies including the Department of Energy (managed Savannah River nuclear site), FEMA disaster response logistics, and military base operations. Steady, lower-margin but reliable revenue.</p>
        <p style={{ color: T_.amber }}>After the crisis, Fluor reorganized from 4 segments to 3: <strong>Energy Solutions</strong>, <strong>Urban Solutions</strong>, and <strong>Mission Solutions</strong> (Government). The MIIP and Diversified Services segments were effectively dismantled.</p>
      </DetailPanel>
    ),
    accounting: (
      <DetailPanel title="The Accounting Problem — POC & ASC 606" onClose={() => setDetail(null)}>
        <p><strong>Percentage-of-completion (POC) accounting</strong> is the standard revenue recognition method for long-term construction contracts. Revenue is recognized proportional to the progress of the project, with the key input being the <strong>estimated total cost to complete</strong>.</p>
        <p>The fundamental problem: if management <span style={{ color: T_.red }}>underestimates remaining costs</span>, revenue and profit are overstated in earlier periods. When the true costs are finally recognized, the company takes a large catch-up charge — exactly what happened at Fluor.</p>
        <p><strong>ASC 606</strong> (adopted in 2018) was the new revenue recognition standard that replaced ASC 605. For E&C companies, it changed how "over time" revenue recognition worked and required more granular performance obligation analysis. Fluor's transition to ASC 606 coincided with the period when cost estimates were being questioned.</p>
        <p style={{ color: T_.red }}>The SEC investigation focused on whether Fluor had properly updated cost-to-complete estimates in a timely manner and whether the transition to ASC 606 was correctly applied. The delayed 10-K filing strongly suggested potential material weakness in internal controls over financial reporting (ICFR) under SOX Section 404.</p>
        <p><strong>The two primary problem projects:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>A gas-fired power plant in the Southeastern U.S.</li>
          <li>A large copper-gold mining/processing facility</li>
        </ul>
        <p>Both were fixed-price/LSTK contracts where cost escalation, design changes, labor productivity issues, and subcontractor problems drove overruns that were not reflected in estimates until Q4 2018.</p>
      </DetailPanel>
    ),
    secInvestigation: (
      <DetailPanel title="SEC Investigation & Delayed 10-K" onClose={() => setDetail(null)}>
        <p>In <strong>March 2019</strong>, Fluor announced it would delay filing its 2018 Form 10-K to conduct an internal review of its accounting practices. The company filed Form 12b-25 (NT 10-K) for a 15-day extension.</p>
        <p>The review focused on:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Percentage-of-completion revenue recognition on troubled projects</li>
          <li>Whether cost forecasts had been updated in a timely manner</li>
          <li>Potential misapplication of the new ASC 606 revenue recognition standard</li>
        </ul>
        <p>Fluor retained <strong>external counsel and forensic accountants</strong> and ultimately filed the 10-K in <strong>June 2019</strong>.</p>
        <p>On <strong>June 13, 2019</strong>, Fluor disclosed it had received a <span style={{ color: T_.red }}>subpoena from the SEC's Division of Enforcement</span> related to its revenue recognition practices. This triggered a further sell-off and raised fundamental questions about the reliability of Fluor's historical financial reporting.</p>
        <p style={{ color: T_.amber }}>The SEC investigation continued for several years. Fluor cooperated extensively throughout. The investigation was eventually resolved in 2021-2022 without major enforcement action, though the reputational damage was significant.</p>
      </DetailPanel>
    ),
    managementChanges: (
      <DetailPanel title="Management Turnover & Strategic Review" onClose={() => setDetail(null)}>
        <p>On <strong>May 6, 2019</strong>, CEO <strong>David Seaton</strong> stepped down. Seaton had been CEO since 2011 and had overseen the strategic push into more fixed-price work that ultimately caused the crisis.</p>
        <p><strong>Carlos Hernandez</strong>, a long-time Fluor executive and head of the Energy & Chemicals segment, was named interim CEO. On <strong>July 15, 2019</strong>, the board confirmed Hernandez as permanent Chairman and CEO.</p>
        <p>The board formed a <strong>special committee</strong> to oversee the internal review and SEC response. Several board members with financial/accounting expertise were given expanded oversight roles.</p>
        <p>In <strong>September 2019</strong>, Fluor announced a comprehensive strategic restructuring:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Reorganize from 4 segments to <strong>3 segments</strong>: Energy Solutions, Urban Solutions, Mission Solutions</li>
          <li>Divest non-core assets including <strong>AMECO</strong> (equipment) and <strong>Stork</strong> (European maintenance)</li>
          <li>Cost reduction program targeting <strong>$100M+</strong> in annual SG&A savings</li>
          <li><span style={{ color: T_.green }}>Halt pursuit of new fixed-price/lump-sum turnkey work</span> — the most important strategic shift</li>
        </ul>
      </DetailPanel>
    ),
    creditFacility: (
      <DetailPanel title="Credit Facility & Covenant Crisis" onClose={() => setDetail(null)}>
        <p>Fluor's primary liquidity backstop was a <strong>$1.8 billion revolving credit facility</strong> containing financial maintenance covenants:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Maximum leverage ratio</strong> (Total Debt / EBITDA)</li>
          <li><strong>Minimum interest coverage ratio</strong></li>
          <li><strong>Minimum net worth</strong> covenant</li>
        </ul>
        <p>The $1.1B+ in project charges <span style={{ color: T_.red }}>threatened covenant compliance</span>, creating acute liquidity risk. The delayed 10-K filing was itself a potential event of default under the credit agreement (failure to deliver timely financial statements).</p>
        <p>In <strong>late 2019</strong>, Fluor negotiated a <strong>credit facility amendment</strong>:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Modified covenant calculations (adjusting for one-time charges)</li>
          <li>Obtained waivers for the late filing</li>
          <li>Secured continued access to the revolver</li>
        </ul>
        <p style={{ color: T_.amber }}>The amendment came with <strong>more restrictive terms</strong>, higher pricing, and additional reporting requirements — typical of a distressed amendment where the borrower has limited leverage.</p>
      </DetailPanel>
    ),
    ratings: (
      <DetailPanel title="Credit Ratings & Fallen Angel Risk" onClose={() => setDetail(null)}>
        <p>Pre-crisis, Fluor was rated <strong>investment grade</strong> in the A-/A3 range — reflecting its blue-chip status in E&C.</p>
        <p>During 2019, all three agencies downgraded Fluor in rapid succession:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>S&P:</strong> A- → <span style={{ color: T_.amber }}>BBB</span> → <span style={{ color: T_.red }}>BBB-</span> (one notch above junk) with negative outlook</li>
          <li><strong>Moody's:</strong> A3 → <span style={{ color: T_.amber }}>Baa1</span> → <span style={{ color: T_.red }}>Baa3</span> with negative outlook</li>
          <li><strong>Fitch:</strong> Similar trajectory</li>
        </ul>
        <p>Fluor was teetering on the edge of <span style={{ color: T_.red }}>"fallen angel" status</span> — crossing from investment grade to high yield. This would have triggered:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Forced selling by IG-only bond funds and index-trackers</li>
          <li>Significantly increased borrowing costs</li>
          <li>Potential covenant triggers in the credit facility</li>
          <li>Loss of counterparty confidence on new project bids</li>
        </ul>
        <p style={{ color: T_.amber }}>For an E&C company, credit ratings are especially important because clients evaluate financial strength when awarding large, multi-year construction contracts. A junk rating could have created a vicious cycle — fewer project awards → less revenue → weaker credit metrics → further downgrades.</p>
      </DetailPanel>
    ),
    incentives: (
      <DetailPanel title="Executive Compensation & Incentive Misalignment" onClose={() => setDetail(null)}>
        <p><strong>CEO David Seaton's total compensation</strong> was approximately <strong>$13.2M (FY2017)</strong> and <strong>~$12M (FY2018)</strong>, with ~85-87% classified as "at risk." The problem wasn't whether pay was at risk — it was <em>what was being measured</em>.</p>
        <p><strong>Annual Incentive Plan (AIP) — Cash Bonus:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Primary metric: <span style={{ color: T_.red }}>Consolidated EPS</span> — directly inflated by optimistic cost-to-complete estimates under POC accounting</li>
          <li>Secondary: Segment operating profit (same vulnerability)</li>
          <li>New awards/backlog growth featured as a <strong>qualitative factor</strong> in individual performance assessments — used to justify discretionary upward adjustments</li>
        </ul>
        <p><strong>Long-Term Incentive Plan (LTIP) — Performance Share Units:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>~50% ROIC</strong> — directly inflated by the same optimistic cost estimates that inflated EPS</li>
          <li><strong>~50% Relative TSR</strong> vs peer group</li>
          <li>ROIC calculation included project earnings recognized under POC, meaning <span style={{ color: T_.red }}>management controlled the inputs to the formula on which they were paid</span></li>
        </ul>
        <p><strong>The backlog incentive loop:</strong> Fluor's backlog grew from ~$29B (2014) to ~$41B (2017). The CD&A section of proxy statements <strong>prominently celebrated backlog growth</strong> as evidence of management performance. But the compensation structure made <span style={{ color: T_.red }}>no distinction</span> between safe cost-reimbursable backlog and risky fixed-price/LSTK backlog. Management was rewarded for winning contracts regardless of risk profile.</p>
        <p style={{ color: T_.red }}><strong>The circular incentive:</strong> Aggressive bidding on LSTK contracts → inflated backlog (narrative win) → optimistic cost estimates to keep project margins positive → inflated EPS and ROIC (formulaic metrics that drive bonuses) → charges deferred until estimates can no longer be sustained → massive write-downs. The executives who created the problem were paid throughout the incubation period.</p>
        <p><strong>Clawback failure:</strong> Fluor's clawback policy was triggered only by <em>formal financial restatements</em>, not by project losses or charge-offs. Since the 2019 charges were treated as revisions to estimates (not restatements of prior periods), <span style={{ color: T_.red }}>no clawback was triggered</span> — despite $1.1B+ in losses on projects that had been showing profits in earlier periods.</p>
        <p><strong>Seaton's departure (May 2019):</strong> Characterized as a resignation, not termination for cause. Unvested PSUs from the 2017-2019 and 2018-2020 cycles would have paid at <strong>zero or near-zero</strong> due to collapsed ROIC/TSR. He received a separation agreement with consulting fees and extended benefits, but notably no large cash severance — the board was under pressure. His AIP payouts from 2016-2018, however, were already banked.</p>
        <p style={{ color: T_.amber }}><strong>Post-crisis changes:</strong> Under new leadership, Fluor added <strong>cash flow metrics</strong> to the AIP (harder to manipulate than EPS), de-emphasized backlog growth as a narrative metric, strengthened clawbacks to cover "material financial harm" beyond formal restatements, and added risk management factors to incentive evaluations.</p>
        <p><strong>Peer contrast:</strong> By 2017-2018, Jacobs and KBR had already shifted to <strong>EBITDA margin and cash flow</strong> metrics less susceptible to POC manipulation, and Jacobs specifically included a "backlog quality" metric distinguishing professional services from construction risk. Fluor was the outlier — increasing fixed-price exposure while maintaining the compensation structure most vulnerable to optimistic project accounting.</p>
      </DetailPanel>
    ),
    secEnforcement: (
      <DetailPanel title="SEC Enforcement Action (Nov 2023)" onClose={() => setDetail(null)}>
        <p>In <strong>November 2023</strong>, the SEC charged Fluor with violations of Sections 13(a), 13(b)(2)(A), and 13(b)(2)(B) of the Securities Exchange Act — relating to reporting, books and records, and internal controls (Administrative Proceeding No. 3-21798).</p>
        <p><strong>Key findings:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Fluor <span style={{ color: T_.red }}>failed to timely recognize cost increases</span> on certain projects</li>
          <li>This resulted in <strong>materially misstated financial statements for FY2015-2018</strong> — meaning the problem predated the 2019 disclosure by years</li>
          <li>Internal controls were inadequate to ensure cost-to-complete estimates were updated in a timely manner</li>
        </ul>
        <p>Fluor agreed to pay a <strong>$14.5 million civil penalty</strong> without admitting or denying findings. No individual executives were charged.</p>
        <p style={{ color: T_.red }}>The SEC's finding that financials were misstated for FY2015-2018 is critical context for the incentive misalignment story: executives were earning bonuses tied to EPS and ROIC that were being inflated by the very cost estimates the SEC later found were materially wrong. The $14.5M penalty was modest relative to the cumulative compensation paid out during the misstated years.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          <strong style={{ color: T_.text }}>Fluor Corporation</strong> was one of the world's largest publicly traded engineering, procurement, and construction (EPC) companies — a blue-chip name headquartered in Irving, Texas with ~$19B in revenue and a $29B backlog entering 2019. The company had quietly shifted its contract mix from safe <span style={{ color: T_.green }}>cost-reimbursable</span> work toward riskier <span style={{ color: T_.red }}>fixed-price/lump-sum turnkey (LSTK)</span> contracts, particularly in its MIIP segment. When two large LSTK projects blew up, Fluor took <span style={{ color: T_.red }}>$1.1B+ in charges</span>, couldn't file its 10-K on time, <span style={{ color: T_.red }}>lost its CEO</span>, drew an <span style={{ color: T_.red }}>SEC subpoena</span>, and watched its stock fall <span style={{ color: T_.red }}>~80%</span> from 2018 highs. The crisis exposed how <span style={{ color: T_.amber }}>percentage-of-completion accounting</span> gives management enormous discretion over reported earnings — and what happens when that discretion masks deteriorating project economics.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Revenue (2018)", v: "~$19.2B", c: T_.textMid },
            { l: "Project Charges", v: "$1.1B+", c: T_.red },
            { l: "Stock Decline", v: "~80%", c: T_.red },
            { l: "Pre-Crisis Rating", v: "A- / A3", c: T_.green },
            { l: "Post-Crisis Rating", v: "BBB- / Baa3", c: T_.red },
            { l: "CEO Departed", v: "May 2019", c: T_.amber },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         CORPORATE & CAPITAL STRUCTURE
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure (2019)</div>
          <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>Four operating segments pre-restructuring. Click any box for details.</div>
        </div>

        <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>
          {/* Parent */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              label="Fluor Corporation"
              sub="Parent · NYSE: FLR · Irving, TX · Founded 1912"
              color={T_.blue}
              badges={[
                { text: "PUBLIC COMPANY", color: T_.blue },
                { text: "DELAWARE INCORPORATED", color: T_.textMid },
              ]}
              onClick={() => toggle("segments")} selected={detail === "segments"}
              width={380}
            />
          </div>

          <VLine h={14} />

          {/* Four segments grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Box
              label="Energy & Chemicals"
              sub="Refineries, petrochemical, LNG, offshore"
              color={T_.green}
              badges={[{ text: "LARGEST SEGMENT", color: T_.green }, { text: "COST-REIMBURSABLE", color: T_.green }]}
              debt={[
                { name: "Revenue contribution", amount: "~40%", color: T_.green },
                { name: "Contract type", amount: "Mostly cost-plus", color: T_.green },
              ]}
            />
            <Box
              label="MIIP"
              sub="Mining, Industrial, Infrastructure & Power"
              color={T_.red}
              badges={[{ text: "PROBLEM SEGMENT", color: T_.red }, { text: "FIXED-PRICE / LSTK", color: T_.red }]}
              debt={[
                { name: "Project charges (2019)", amount: "$1.1B+", color: T_.red },
                { name: "Contract type", amount: "Fixed-price", color: T_.red },
              ]}
            />
            <Box
              label="Diversified Services"
              sub="Staffing, equipment, fleet, O&M services"
              color={T_.textMid}
              badges={[{ text: "AMECO", color: T_.textMid }, { text: "TRS STAFFING", color: T_.textMid }]}
              debt={[
                { name: "Stork acquisition (2016)", amount: "$695M", color: T_.amber },
                { name: "Status", amount: "Later divested", color: T_.amber },
              ]}
            />
            <Box
              label="Government"
              sub="DOE, FEMA, military base operations"
              color={T_.cyan}
              badges={[{ text: "STEADY / LOW MARGIN", color: T_.cyan }, { text: "SAVANNAH RIVER", color: T_.cyan }]}
              debt={[
                { name: "Contract type", amount: "Cost-plus", color: T_.green },
                { name: "Risk profile", amount: "Low", color: T_.green },
              ]}
            />
          </div>

          <VLine h={14} />

          {/* Capital structure */}
          <div style={{ fontSize: 13, fontWeight: 700, color: T_.text, textAlign: "center", marginBottom: 8 }}>Capital Structure</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Box
              label="Revolving Credit Facility"
              sub="Primary liquidity backstop · Maintenance covenants"
              color={T_.amber}
              badges={[{ text: "COVENANT RISK", color: T_.red }]}
              debt={[
                { name: "Facility size", amount: "$1.8B", color: T_.amber },
                { name: "Key covenants", amount: "Leverage / Coverage / Net Worth", color: T_.amber },
                { name: "Status (2019)", amount: "Amended", color: T_.red },
              ]}
              onClick={() => toggle("creditFacility")} selected={detail === "creditFacility"}
            />
            <Box
              label="Senior Unsecured Notes"
              sub="Investment-grade bonds · Multiple tranches"
              color={T_.blue}
              badges={[{ text: "FALLEN ANGEL RISK", color: T_.red }]}
              debt={[
                { name: "3.5% Notes due 2024", amount: "~$500M", color: T_.blue },
                { name: "4.25% Notes due 2028", amount: "~$600M", color: T_.blue },
                { name: "Total bonds outstanding", amount: "~$1.7B", color: T_.blue },
              ]}
              onClick={() => toggle("ratings")} selected={detail === "ratings"}
            />
          </div>
        </div>
      </div>

      {/* ── Detail click targets ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        <div onClick={() => toggle("accounting")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "accounting" ? `${T_.red}12` : T_.bgInput,
          border: `1px solid ${detail === "accounting" ? T_.red : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>The Accounting Problem</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>POC revenue recognition · ASC 606 transition · Cost estimate discretion</div>
        </div>
        <div onClick={() => toggle("secInvestigation")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "secInvestigation" ? `${T_.amber}12` : T_.bgInput,
          border: `1px solid ${detail === "secInvestigation" ? T_.amber : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber }}>SEC Investigation & Delayed 10-K</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>Subpoena Jun 2019 · NT 10-K filed · External forensic review</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        <div onClick={() => toggle("managementChanges")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "managementChanges" ? `${T_.accent}12` : T_.bgInput,
          border: `1px solid ${detail === "managementChanges" ? T_.accent : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent }}>Management & Strategic Review</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>CEO Seaton out May 2019 · Hernandez in · 4→3 segment reorg</div>
        </div>
        <div onClick={() => toggle("ratings")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "ratings" ? `${T_.blue}12` : T_.bgInput,
          border: `1px solid ${detail === "ratings" ? T_.blue : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue }}>Credit Ratings & Fallen Angel Risk</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>A- → BBB- · One notch above junk · Forced selling risk</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        <div onClick={() => toggle("incentives")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "incentives" ? `${T_.purple}12` : T_.bgInput,
          border: `1px solid ${detail === "incentives" ? T_.purple : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.purple }}>Incentive Misalignment & Exec Comp</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>CEO $13M/yr · EPS/ROIC driven · Backlog rewarded · No clawback triggered</div>
        </div>
        <div onClick={() => toggle("secEnforcement")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "secEnforcement" ? `${T_.red}12` : T_.bgInput,
          border: `1px solid ${detail === "secEnforcement" ? T_.red : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>SEC Enforcement (Nov 2023)</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>$14.5M penalty · FY2015-18 misstated · No individuals charged</div>
        </div>
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          {
            label: "Percentage-of-Completion (POC) Accounting",
            color: T_.red,
            summary: "Revenue recognized proportional to project progress — the key input is estimated cost to complete.",
            detail: "Under POC (now codified under ASC 606 as 'over time' recognition), an E&C company recognizes revenue as work progresses on a long-term contract. The critical variable is the estimated total cost to complete — if management underestimates remaining costs, revenue and profit are overstated in earlier periods. When the true costs are finally recognized, the company takes a large catch-up charge. This is exactly what happened at Fluor: management's cost-to-complete estimates on fixed-price projects were overly optimistic, and when reality caught up, $1.1B+ in charges hit in quick succession. The lesson: for any company using POC, always scrutinize the gap between reported earnings and operating cash flow — persistent divergence is a red flag."
          },
          {
            label: "Fixed-Price vs. Cost-Reimbursable Contracts",
            color: T_.amber,
            summary: "Who bears the construction risk — the contractor or the client?",
            detail: "In a cost-reimbursable (cost-plus) contract, the client pays for actual costs plus a fee — the contractor bears minimal cost risk. In a fixed-price or lump-sum turnkey (LSTK) contract, the contractor guarantees both the price and the performance of the completed facility. Schedule delays, scope changes, labor shortages, subcontractor failures — all become the contractor's problem. Fluor's strategic shift from cost-plus toward LSTK work, especially in the MIIP segment, transferred enormous construction risk onto Fluor's balance sheet. When projects went wrong, the losses were unbounded on the downside. Post-crisis, Fluor explicitly halted pursuit of new LSTK work — acknowledging the risk profile was incompatible with the company's risk management capabilities."
          },
          {
            label: "Earnings Quality in E&C Companies",
            color: T_.blue,
            summary: "Reported earnings under POC can diverge significantly from economic reality.",
            detail: "E&C companies have among the highest accounting discretion of any industry because POC revenue depends on management's estimate of future costs. Key red flags to watch: (1) Revenue growth without commensurate cash flow growth, (2) Growing unbilled receivables (revenue recognized but not yet billed to the client), (3) Declining or negative working capital trends, (4) Increasing mix of fixed-price contracts without proportional risk reserves, (5) Backlog that looks impressive by headline but conceals margin-destroying projects. Fluor's $29B backlog entering 2019 looked like a strength — but it concealed the LSTK projects that would generate $1.1B+ in losses."
          },
          {
            label: "Credit Agreement Covenants",
            color: T_.accent,
            summary: "Maintenance covenants in the revolver threatened breach after massive charges.",
            detail: "Fluor's $1.8B revolving credit facility contained financial maintenance covenants — leverage ratio, interest coverage, minimum net worth — that are tested periodically. When $1.1B+ in project charges hit EBITDA, these ratios were at risk of breach. A covenant violation would have triggered an event of default, potentially accelerating debt and cutting off liquidity access. Fluor negotiated a covenant amendment in late 2019 — modifying calculations to adjust for one-time charges and obtaining waivers. The amendment came with more restrictive terms and higher pricing. This cascade — operational failure → accounting charges → covenant stress → amendment with tighter terms — is a classic pattern in corporate distress. The delayed 10-K itself was also a potential default trigger (failure to deliver timely financial statements)."
          },
          {
            label: "Fallen Angel Risk",
            color: T_.purple,
            summary: "Crossing from investment grade to high yield triggers forced selling and a discontinuous cost increase.",
            detail: "A 'fallen angel' is a bond issuer downgraded from investment grade (BBB-/Baa3 or above) to high yield (BB+/Ba1 or below). The crossing creates a discontinuous impact because many institutional investors — insurance companies, pension funds, IG-only mutual funds — have mandates that prohibit holding high-yield debt. When an issuer falls below the line, these holders are forced to sell, creating a supply/demand imbalance that depresses bond prices beyond what fundamentals alone would justify. For Fluor, the BBB-/Baa3 rating with negative outlook meant it was one notch away from this cliff. For an E&C company, the impact goes beyond borrowing costs — clients evaluate financial strength when awarding large multi-year construction contracts, so a junk rating could create a vicious cycle of fewer awards → less revenue → weaker metrics → further downgrades."
          },
          {
            label: "Goodwill Impairment (ASC 350)",
            color: T_.emerald,
            summary: "When a reporting unit's fair value falls below carrying value, goodwill must be written down.",
            detail: "Goodwill represents the premium paid over fair value of net assets in an acquisition. Under ASC 350, companies must test goodwill for impairment at least annually (or when triggering events occur). When the fair value of a reporting unit falls below its carrying amount — including goodwill from prior acquisitions — a write-down is required. Fluor's massive losses in the MIIP segment triggered goodwill impairment testing, and the company recorded a goodwill impairment charge related to MIIP. This included goodwill from the 2016 Stork acquisition ($695M). Impairment charges are non-cash but signal that management overpaid for an acquisition or that the acquired business has deteriorated — both relevant for assessing management quality."
          },
          {
            label: "Material Weakness & SOX 404",
            color: T_.red,
            summary: "Delayed financial filings suggest potential deficiencies in internal controls.",
            detail: "The Sarbanes-Oxley Act Section 404 requires management (and auditors, for large filers) to assess the effectiveness of internal controls over financial reporting (ICFR). A 'material weakness' is a deficiency so severe that there is a reasonable possibility of a material misstatement in the financial statements. Fluor's inability to file its 10-K on time — requiring an internal review of accounting practices and retention of forensic accountants — is a strong signal of potential material weakness. The SEC subpoena further suggests regulators believed the controls were inadequate. For investors, a material weakness means you cannot trust that reported financial results accurately reflect economic reality — the most fundamental risk in any equity or credit investment."
          },
          {
            label: "Principal-Agent Problem & Incentive Misalignment",
            color: T_.purple,
            summary: "Management's comp structure rewarded the exact behaviors that created the crisis.",
            detail: "The principal-agent problem occurs when the agent (management) has incentives that diverge from the principal (shareholders). At Fluor, the AIP was driven by EPS and the LTIP by ROIC — both directly inflatable by understating cost-to-complete estimates under POC accounting. Management controlled the inputs to the formula on which they were paid. Backlog growth was celebrated in proxy statements as evidence of performance, but the comp structure made no distinction between safe cost-reimbursable backlog and risky LSTK backlog. The result: aggressive bidding inflated backlog (narrative win), optimistic estimates inflated EPS/ROIC (bonus metrics), and the charges only hit after years of payouts. CEO Seaton earned ~$13M in FY2017 while overseeing projects the SEC later found were materially misstated. Post-crisis, Fluor added cash flow metrics, backlog quality factors, and strengthened clawbacks — acknowledging the prior structure's failures."
          },
          {
            label: "Clawback Limitations",
            color: T_.red,
            summary: "Fluor's clawback required a formal restatement — project write-downs didn't qualify.",
            detail: "Clawback provisions allow companies to recover incentive compensation when the basis for the payout proves wrong. Fluor's pre-crisis clawback was triggered only by formal financial restatements — not by project losses, goodwill impairments, or charge-offs treated as 'changes in estimates.' Since Fluor's $1.1B+ in charges were classified as revisions to accounting estimates (forward-looking), not restatements of prior periods (backward-looking), no clawback was triggered. This is a critical gap: the SEC's 2023 enforcement action found FY2015-2018 financials were materially misstated, but the company settled without a formal restatement, so the clawback loophole persisted. Post-crisis, Fluor expanded the policy to cover 'material financial harm from risk management failures.' The SEC's 2022 Dodd-Frank clawback rules (effective 2023) now require listed companies to recoup incentive comp upon any accounting restatement, including 'little r' restatements — partially closing this gap."
          },
          {
            label: "Backlog Quality vs. Backlog Quantity",
            color: T_.amber,
            summary: "A $41B backlog that conceals margin-destroying LSTK projects is worse than a $20B backlog of cost-plus work.",
            detail: "For E&C companies, backlog is the most-cited forward metric — it represents contracted future work. But headline backlog tells you nothing about profitability or risk. Fluor's backlog grew from ~$29B (2014) to ~$41B (2017), which was presented as a management triumph. In reality, the growth was driven substantially by large fixed-price/LSTK wins in power and mining — contracts where Fluor bore the construction risk. When these projects blew up, the 'backlog growth' narrative reversed into '$1.1B in charges.' The lesson for investors: always decompose backlog by contract type (cost-plus vs. fixed-price), segment, and margin profile. A declining backlog of high-quality cost-reimbursable work is far healthier than a growing backlog laced with LSTK risk. Peers like Jacobs explicitly introduced a 'backlog quality' metric in their compensation structure — distinguishing professional services from construction risk."
          },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "2016", event: "Fluor acquires Stork, a European industrial maintenance business, for ~$695M. The acquisition adds to Diversified Services but later faces write-downs.", color: T_.textMid },
          { date: "2017-18", event: "Fluor increasingly pursues fixed-price/LSTK contracts in the MIIP segment, shifting risk profile. Revenue reaches ~$19.2B in 2018 with a $29B backlog.", color: T_.textMid },
          { date: "Nov 2018", event: "Q3 2018 earnings show early signs of MIIP weakness, but guidance maintained. Stock trading around $50-55.", color: T_.amber },
          { date: "Feb 18, 2019", event: "Q4 2018 earnings released. Fluor discloses $695M in pre-tax charges on problem projects — a gas-fired power plant and a copper-gold mining facility. Full year swings to a net loss. Stock drops sharply.", color: T_.red },
          { date: "Mar 2019", event: "Fluor announces it will delay filing its 2018 Form 10-K to conduct an internal review of percentage-of-completion accounting. Files NT 10-K (Form 12b-25) with the SEC.", color: T_.red },
          { date: "May 6, 2019", event: "CEO David Seaton resigns after 8 years. Carlos Hernandez (head of E&C segment) named interim CEO. Stock drops to mid-$20s.", color: T_.amber },
          { date: "May 2019", event: "Fluor announces a comprehensive strategic review of all business segments.", color: T_.textMid },
          { date: "Jun 2019", event: "Fluor files the delayed 2018 10-K.", color: T_.textMid },
          { date: "Jun 13, 2019", event: "Fluor discloses receipt of an SEC Division of Enforcement subpoena related to revenue recognition practices. Stock falls to low $20s.", color: T_.red },
          { date: "Jul 15, 2019", event: "Carlos Hernandez confirmed as permanent CEO and Chairman.", color: T_.textMid },
          { date: "Aug 1, 2019", event: "Q2 2019 earnings: additional project charges of ~$435M. Goodwill impairment recorded for MIIP segment. Revenue guidance slashed. Cumulative charges now exceed $1.1B. Stock drops below $20.", color: T_.red },
          { date: "Sep 2019", event: "Strategic restructuring announced: 4 segments → 3 (Energy Solutions, Urban Solutions, Mission Solutions). Plans to divest AMECO and Stork. $100M+ SG&A reduction targeted. Halts new LSTK work.", color: T_.amber },
          { date: "Q3 2019", event: "Fluor negotiates credit facility amendments with bank syndicate. Covenant calculations modified, waivers obtained, but terms tightened.", color: T_.amber },
          { date: "Nov 2019", event: "Q3 2019 earnings. Additional smaller charges. Company reaffirms restructuring plan. Stock around $15-18.", color: T_.textMid },
          { date: "Dec 2019", event: "Dividend reduced from $0.21 to $0.10/quarter. Year-end liquidity approximately $2.5B (cash + revolver availability).", color: T_.red },
          { date: "Mar 2020", event: "COVID-19 further pressures operations and stock — drops below $10 briefly. Dividend suspended entirely.", color: T_.red },
          { date: "2020-21", event: "New segment structure takes effect. AMECO divested. Stork divested. SEC investigation cooperated with and eventually resolved.", color: T_.amber },
          { date: "2023+", event: "Stock partially recovers to ~$25-35 as turnaround takes hold under new management, aided by infrastructure spending tailwinds (IIJA, IRA).", color: T_.green },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 4, alignItems: "flex-start" }}>
            <div style={{ width: 80, flexShrink: 0, fontSize: 10, fontWeight: 600, color: e.color, paddingTop: 2 }}>{e.date}</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.color, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontSize: 11, color: T_.textMid, lineHeight: 1.5 }}>{e.event}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */

export default function CaseStudies({ initialTab }) {
  const [activeCase, setActiveCase] = useState(initialTab || "fluor");

  return (
    <div style={{ padding: "36px 44px", maxWidth: "100%", fontFamily: FONT }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4, fontFamily: FONT }}>Case Studies</h1>
      <p style={{ fontSize: 12, color: T_.textDim, marginBottom: 20 }}>Investment situations worth studying — for interviews, investment history, or learning.</p>

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {CASES.map(c => (
          <button key={c.key} onClick={() => setActiveCase(c.key)} style={{
            padding: "6px 14px", borderRadius: 6, border: `1px solid ${activeCase === c.key ? c.color : T_.border}`,
            background: activeCase === c.key ? `${c.color}18` : T_.bgPanel,
            color: activeCase === c.key ? c.color : "#94A3B8",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, transition: "all .15s",
          }}>
            {c.label} <span style={{ fontSize: 10, color: T_.textGhost, marginLeft: 4 }}>{c.sector} · {c.year}</span>
          </button>
        ))}
      </div>

      {activeCase === "fluor" && <FluorCase />}
    </div>
  );
}
