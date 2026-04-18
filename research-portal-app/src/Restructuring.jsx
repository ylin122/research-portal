import { useState, useEffect } from "react";
import { T_, FONT } from "./lib/theme";

/* ═══════════════════════════════════════════════════════
   ORG CHART PRIMITIVES — bond-prospectus style
   ═══════════════════════════════════════════════════════ */

// Vertical line connector
function VLine({ h = 28, color, dashed }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 0, height: h, borderLeft: `2px ${dashed ? "dashed" : "solid"} ${color || T_.border}` }} />
    </div>
  );
}

// Label on the connector
function VLineLabel({ label, color, h = 36 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: h }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 0, height: h / 2 - 8, borderLeft: `2px solid ${color || T_.border}` }} />
        <span style={{ fontSize: 9, color: color || T_.textGhost, background: T_.bg, padding: "0 6px", whiteSpace: "nowrap" }}>{label}</span>
        <div style={{ width: 0, height: h / 2 - 8, borderLeft: `2px solid ${color || T_.border}` }} />
      </div>
    </div>
  );
}

// Entity box — the core building block
function Box({ label, sub, color, borderColor, badges, debt, selected, onClick, dashed, width }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? `${color}10` : T_.bgPanel,
        border: `2px ${dashed ? "dashed" : "solid"} ${selected ? color : (borderColor || color || T_.border)}`,
        borderRadius: 8, padding: "12px 16px",
        cursor: onClick ? "pointer" : "default",
        width: width || "auto",
        transition: "border-color .15s, background .15s",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: color || T_.text, lineHeight: 1.3 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: T_.textDim, marginTop: 3, lineHeight: 1.4 }}>{sub}</div>}
      {badges && (
        <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
          {badges.map((b, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 3, background: `${b.color}18`, color: b.color }}>{b.text}</span>
          ))}
        </div>
      )}
      {debt && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {debt.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, padding: "3px 6px", borderRadius: 3, background: `${d.color}10`, border: `1px solid ${d.color}25` }}>
              <span style={{ color: T_.textMid, flex: 1 }}>{d.name}</span>
              <span style={{ color: d.color, fontWeight: 700, marginLeft: 8 }}>{d.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Detail flyout
function DetailPanel({ title, onClose, children }) {
  return (
    <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.accent}40`, padding: "16px 20px", marginTop: 16, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T_.accent }}>{title}</div>
        <span onClick={onClose} style={{ fontSize: 11, color: T_.textGhost, cursor: "pointer", padding: "2px 8px" }}>✕</span>
      </div>
      <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.9 }}>{children}</div>
    </div>
  );
}

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
   WINDSTREAM CASE
   ═══════════════════════════════════════════════════════ */

const CASES = [
  { key: "windstream", label: "Windstream Holdings", sector: "Telecom", year: "2019", color: "#3B82F6" },
  { key: "envision", label: "Envision Healthcare", sector: "Healthcare", year: "2023", color: "#8B5CF6" },
  { key: "serta", label: "Serta Simmons Bedding", sector: "Consumer / Mattress", year: "2023", color: "#10B981" },
  { key: "diebold", label: "Diebold Nixdorf", sector: "Banking / Retail Tech", year: "2023", color: "#F59E0B" },
  { key: "jcrew", label: "J.Crew Group", sector: "Retail / Apparel", year: "2020", color: "#EC4899" },
  { key: "petsmart", label: "PetSmart / Chewy", sector: "Retail / Pet", year: "2018", color: "#06B6D4" },
  { key: "incora", label: "Wesco / Incora", sector: "Aerospace / Distribution", year: "2023-25", color: "#14B8A6" },
  { key: "caesars", label: "Caesars Entertainment", sector: "Gaming / Hospitality", year: "2015-17", color: "#EAB308" },
  { key: "xerox", label: "Xerox Holdings", sector: "Document / Print · ONGOING", year: "2025-26", color: "#EF4444" },
];

function WindstreamCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    holdco: (
      <DetailPanel title="Windstream Holdings, Inc." onClose={() => setDetail(null)}>
        <p>Delaware corp. Public parent (WIN → WINMQ). <strong>No operations, no revenue, no employees.</strong> Not a borrower, co-issuer, or guarantor on any operating-level debt. Not subject to any restrictive covenants in Services' debt agreements.</p>
        <p>Only obligations: corporate overhead + common dividend (eliminated Feb 2017). When OpCo couldn't upstream cash, HoldCo was stranded — structural subordination in practice.</p>
      </DetailPanel>
    ),
    midwest: (
      <DetailPanel title="Windstream Holding of the Midwest, Inc." onClose={() => setDetail(null)}>
        <p>Nebraska corp. <strong>f/k/a Alltel Communications Holdings of the Midwest, Inc.</strong> — a legacy entity inherited from the pre-Windstream Alltel structure. Intermediate holding company between Holdings and Services. <strong>Guarantor</strong> of the credit facility.</p>
        <p>Issued its own <strong>$100M of 6.75% Secured Notes due April 1, 2028</strong> — originally issued by ALLTEL long before the Windstream combination. The indenture contains its own sale-and-leaseback restriction, which is why these notes formed a <strong>separate treatment class</strong> in the plan. An unusual structural wrinkle that creates a mini capital structure between HoldCo and OpCo.</p>
        <p>Under the plan, Midwest Notes Claims received replacement term loans under the New Exit Facility.</p>
      </DetailPanel>
    ),
    opco: (
      <DetailPanel title="Windstream Services, LLC (OpCo)" onClose={() => setDetail(null)}>
        <p>Delaware LLC (f/k/a Windstream Corporation). <strong>Primary operating entity. Borrower</strong> under the senior secured credit facility. Co-issuer of all notes with Windstream Finance Corp. Admin Agent: JPMorgan Chase.</p>
        <p style={{ color: T_.amber }}>All ~$5.6B of funded debt sits at this entity. 155+ subsidiaries beneath it, 92 of which guarantee the credit facility. Revenue, EBITDA, and all operations flow through here.</p>
      </DetailPanel>
    ),
    firstlien: (
      <DetailPanel title="1st Lien Secured (~$3,151M)" onClose={() => setDetail(null)}>
        <p><strong>RCF</strong> (~$800M committed) + <strong>Term Loans</strong> (2 tranches, ~$1.8B) + <strong>8.625% 1L Notes due 2025</strong> (~$400M). All pari passu. LIBOR + spread (floating) and 8.625% (fixed).</p>
        <p>1st priority lien on substantially all assets. Full recourse to Services + 92 guarantor subsidiaries. Collateral: sub equity, A/R, equipment, IP. Excludes real property (transferred to Uniti).</p>
        <p>Elliott Management held ~$531M TL + ~$355M notes + ~$250M RCF.</p>
        <p style={{ color: T_.amber }}><strong>Recovery: 62.8%–71.3%.</strong> Fulcrum security. Received equity in reorganized Windstream Holdings II + new exit debt ($1.25B facilities + $1.4B new 7.750% Notes). 1L holders became the new private owners.</p>
      </DetailPanel>
    ),
    secondlien: (
      <DetailPanel title="2nd Lien Secured (~$1,235M)" onClose={() => setDetail(null)}>
        <p><strong>10.500% 2L Notes due 2024</strong> (~$415M) + <strong>9.000% 2L Notes due 2025</strong> (~$820M). Same collateral as 1L, but contractually junior via intercreditor agreement.</p>
        <p>Standstill provision restricted 2L from taking enforcement actions, giving 1L time to act first.</p>
        <p style={{ color: T_.red }}><strong>Recovery: ~0%</strong> ($0.00125 per $1.00). Because 1L only recovered ~65%, zero residual collateral value remained. Being secured means nothing if senior liens consume everything.</p>
      </DetailPanel>
    ),
    unsecured: (
      <DetailPanel title="Senior Unsecured Notes (~$1,183M)" onClose={() => setDetail(null)}>
        <p>Six series: 7.750% due 2020 (~$651M) · 7.750% due 2021 · 7.500% due 2022 (~$340M) · 7.500% due 2023 · <strong style={{ color: T_.red }}>6.375% due 2023 (~$700M, THE AURELIUS NOTES)</strong> · 8.750% due 2024 (~$500M).</p>
        <p>Co-issued by Services + Finance Corp. Guaranteed by restricted subs on unsecured basis. Class 6A (Obligor General Unsecured).</p>
        <p style={{ color: T_.red }}><strong>Recovery: ~0%.</strong> Court crammed down this class. Aurelius held 25%+ of the 6.375% tranche — weaponized the sale-leaseback covenant to trigger the restructuring.</p>
      </DetailPanel>
    ),
    subs: (
      <DetailPanel title="Operating Subsidiaries" onClose={() => setDetail(null)}>
        <p>155+ entities across 18 states. <strong>92 guarantors</strong> of the credit facility, 63+ non-guarantors.</p>
        <p><strong>ILECs:</strong> Windstream Alabama, Arkansas, Florida, Georgia, Kentucky E/W, Mississippi, Missouri, Nebraska, New York, North Carolina, Ohio, Oklahoma, Pennsylvania, South Carolina, Western Reserve + Valor TX entities + Iowa Telecom + D&E/North Pittsburgh.</p>
        <p><strong>CLECs:</strong> PAETEC, McLeodUSA, US LEC (9 states), Cavalier, NuVox (7 states), Talk America, Broadview, EarthLink.</p>
        <p style={{ color: T_.amber }}>Many state ILECs (FL, GA, KY, MS, MO, NE, NY, NC, OH, PA) were NOT guarantors — state regulators restricted pledging local telephone assets. Assets in non-guarantor subs are harder for secured lenders to reach.</p>
        <p>Source: SEC Exhibit 21, FY2018 (CIK 0001282266).</p>
      </DetailPanel>
    ),
    uniti: (
      <DetailPanel title="Uniti Group / Master Lease / 2020 Settlement" onClose={() => setDetail(null)}>
        <p><strong>April 24, 2015:</strong> Windstream spun off fiber/copper network into Communications Sales &amp; Leasing, Inc. (renamed Uniti Group Inc., NASDAQ: UNIT). Transferred-asset value was <strong>$7.45B</strong>; Windstream received ~$1.035B cash + $2.45B of Uniti debt securities at spin.</p>
        <p><strong>Structure:</strong> Uniti Group Inc. → Uniti Group LP (f/k/a CSL Capital) → Uniti Leasing LLC (f/k/a CSL National, LP) [holds the assets].</p>
        <p><strong>Master Lease:</strong> 15-year initial term (with four 5-year renewal options), triple-net, <strong>~$650M/yr base rent</strong> with escalators. This became effectively super-senior — an operating cost that must be paid to keep the business running.</p>
        <p style={{ color: T_.red }}>Aurelius argued this violated the 6.375% Notes indenture's sale-leaseback covenant. Judge Furman (SDNY) agreed Feb 15, 2019, in <em>U.S. Bank v. Windstream Services</em>, 17-cv-07857, after a July 2018 bench trial. ~$310M accelerated → cross-default → Ch.11 filed Feb 25, 2019.</p>
        <p><strong>The 2020 Settlement (Mar 2 announced, Apr 20 executed):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>$1.75B Growth Capital Improvements</strong> staged through 2029: $125M Y1 / $225M Y2-5 / $175M Y6-7 / $125M Y8-10. Base rent steps up 8.0% of new investment with 0.5% annual escalator.</li>
          <li><strong>$400M cash</strong> from Uniti to Windstream, paid in 20 equal quarterly installments post-emergence at <strong>9% interest</strong>.</li>
          <li>Uniti sold <strong>~38.6M shares of UNIT common at $6.33/share (~$244.5M)</strong> to certain Windstream 1L creditors; proceeds routed to Windstream as settlement consideration.</li>
          <li>Uniti purchased <strong>~$40M of Windstream-owned fiber assets</strong> (4,100 route miles / 0.4M strand miles / $8M EBITDA of IRUs).</li>
          <li>Modified Master Lease terms (bifurcation + extensions).</li>
        </ul>
        <p style={{ color: T_.amber }}>Windstream was ~65% of Uniti's revenue — massive leverage in the negotiation. Windstream also sued Uniti in an adversary proceeding (Jul 2019) seeking recharacterization of the Master Lease as a financing rather than a true lease, which would have converted Uniti's claims to unsecured — this leverage drove Uniti to settle.</p>
      </DetailPanel>
    ),
    postEmergence: (
      <DetailPanel title="Post-Emergence & The 2025 Uniti Merger — Full Narrative Closure" onClose={() => setDetail(null)}>
        <p><strong>Sep 21, 2020:</strong> Windstream emerges as Windstream Holdings II, LLC (private). Elliott Management + other former 1L lenders own the reorganized company. Over $4B of pre-petition debt eliminated. Exit financing: $750M exit term loan + $500M exit revolver + $1.4B of new 7.750% first-lien notes due 2028 (issued by Windstream Escrow LLC / Windstream Escrow Finance Corp.).</p>
        <p><strong>2020-2024 (private):</strong> Elliott operates Windstream, deploying the $1.75B Uniti FTTP investment commitment and executing a fiber-to-the-home build-out strategy (Kinetic Fiber). Windstream also benefited from a dramatically different rates/credit environment than at filing — summer 2020 exit financing was executed in the post-COVID-liquidity era, a tailwind to recoveries.</p>
        <p style={{ color: T_.accent }}><strong>May 3, 2024 — Merger Announced.</strong> Uniti Group and Windstream announce an all-stock merger: "Uniti to Merge with Windstream Creating Premier Insurgent Fiber Provider." The REIT that spun off Windstream's network in 2015 agrees to buy Windstream itself back.</p>
        <p><strong>Merger consideration to Windstream equityholders (Elliott et al.):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>~<strong>35.42%</strong> of new Uniti common stock</li>
          <li><strong>$575M</strong> of newly issued <strong>11% cumulative preferred stock</strong></li>
          <li>Warrants for ~<strong>6.9% fully-diluted</strong> common</li>
          <li><strong>$370.7M cash</strong> (funded from Uniti revolver borrowings)</li>
        </ul>
        <p>Legacy Uniti holders retained ~<strong>62%</strong> of the combined company. Uniti stockholders approved <strong>Apr 2, 2025</strong>. Merger <strong>CLOSED Aug 1, 2025</strong>.</p>
        <p style={{ color: T_.green }}><strong>Full narrative closure:</strong> Aurelius weaponized a sale-leaseback covenant in 2017 to force a Ch.11 over the 2015 Uniti spin. Elliott and other 1L holders took the company private at emergence in 2020. Five years later (2025), Elliott exited into a merger with the exact same REIT counterparty that had precipitated the bankruptcy. The spin-off was unwound. Windstream's fiber network and its operations are once again owned by a single corporate parent — this time as a combined fiber pure-play rather than an ILEC saddled with a super-senior lease obligation.</p>
      </DetailPanel>
    ),
    planTreatment: (
      <DetailPanel title="Chapter 11 Plan Treatment — Class Recoveries" onClose={() => setDetail(null)}>
        <p>Plan confirmed <strong>Jun 26, 2020</strong> by Judge Robert Drain (S.D.N.Y.) via bench ruling. Emerged <strong>Sep 21, 2020</strong> as Windstream Holdings II, LLC (private). ~203 debtor entities (count varied as debtors were added to the consolidated case).</p>
        <p style={{ color: T_.amber }}><strong>Contested confirmation:</strong> The 2L ad hoc group and the Official Committee of Unsecured Creditors actively <strong>contested the debtors' valuation at confirmation</strong>, arguing that value broke through the 1L and into the 2L/unsecured classes. Judge Drain overruled the objections at the Jun 26, 2020 bench ruling, finding valuation supported cramdown. The UCC/2L also unsuccessfully sought standing to pursue estate causes of action against the 1L holders.</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Class</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Treatment</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Recovery</th>
          </tr></thead>
          <tbody>
            {[
              { cls: "DIP Claims ($1B)", treat: "Paid in full or rolled into exit facilities", rec: "100%", c: T_.green },
              { cls: "1st Lien (~$3,151M)", treat: "New equity + exit debt ($1.25B + $1.4B Notes)", rec: "62.8–71.3%", c: T_.amber },
              { cls: "Midwest Notes", treat: "6.750% Secured Notes at Midwest HoldCo", rec: "Varies", c: T_.purple },
              { cls: "2nd Lien (~$1,235M)", treat: "$0.00125 per $1.00", rec: "~0%", c: T_.red },
              { cls: "Sr Unsecured (~$1,183M)", treat: "Crammed down — $0", rec: "~0%", c: T_.red },
              { cls: "Equity (Public)", treat: "Cancelled", rec: "0%", c: T_.red },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.cls}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.treat}</td>
                <td style={{ padding: "6px 8px", color: r.c, fontWeight: 600, textAlign: "right" }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: T_.amber }}><strong>Exit Financing:</strong> $750M exit term loan + $500M exit revolver + $1.4B new 7.750% Senior Secured Notes due 2028 (issued by Windstream Escrow LLC / Windstream Escrow Finance Corp.). Over <strong>$4B of pre-petition debt eliminated</strong> through equitization.</p>
        <p><strong>New Ownership:</strong> Elliott Management (largest holder), other former 1st lien lenders. Private company post-emergence.</p>
        <p><strong>Uniti Settlement:</strong> $1.75B FTTP network upgrade commitment staged through 2029 + $400M cash at 9% + $244.5M share sale + $40M fiber asset purchase + modified lease terms. See Uniti panel for full details.</p>
        <p style={{ color: T_.blue }}><strong>State regulatory approvals:</strong> Required approvals from ~18 state PUCs plus FCC change-of-control at emergence — a significant gating factor on the 6-month gap between confirmation (Jun 26, 2020) and effective date (Sep 21, 2020).</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>COVID timing angle: The Uniti settlement and Plan Support Agreement were negotiated in Feb-Mar 2020 exactly as COVID lockdowns began. Exit financing executed in summer 2020 in a dramatically different rates/credit environment than at filing — a tailwind to recoveries.</em></p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Rural/regional telecom (18 states). Distress from <span style={{ color: T_.red }}>secular decline</span> + <span style={{ color: T_.red }}>overleveraged M&A</span> + <span style={{ color: T_.red }}>2015 Uniti REIT spin-off</span> that moved network assets outside the credit group. <span style={{ color: T_.amber }}>Aurelius</span> exploited a <span style={{ color: T_.accent }}>sale-leaseback covenant breach</span> to force Ch.11. The Uniti spin-off created a structural problem: network assets that generated revenue were owned by a separate public REIT, while Windstream was obligated to pay <strong>~$650M/yr</strong> in rent — effectively a super-senior claim ahead of all debt. Elliott and other 1L holders took the company private at emergence (Sep 2020). In a <span style={{ color: T_.green }}>full narrative closure</span>, the same Uniti REIT <strong>merged with Windstream on Aug 1, 2025</strong> — unwinding the 2015 spin-off and reuniting the fiber network with operations under a single parent.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Total Debt", v: "~$5.6B", c: T_.red },
            { l: "Filed", v: "Feb 25, 2019", c: T_.red },
            { l: "Emerged", v: "Sep 21, 2020", c: T_.green },
            { l: "Debt Eliminated", v: ">$4B", c: T_.green },
            { l: "Time in Ch.11", v: "~19 months", c: T_.textMid },
            { l: "Fulcrum", v: "1st Lien", c: T_.blue },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>Click any entity for details. Case 19-22312, S.D.N.Y., Judge Robert Drain.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.red}50`, background: `${T_.red}08`, display: "inline-block" }} /><span style={{ color: T_.red }}>Outside Credit Group</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: Equity */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box label="Public Shareholders" sub="Common equity" color={T_.textGhost} badges={[{ text: "CANCELLED — $0", color: T_.red }]} width={340} />
        </div>

        <VLineLabel label="100% equity ownership" />

        {/* ROW 2: HoldCo */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Windstream Holdings, Inc."
            sub="HoldCo · Delaware · No operations · Not a borrower or guarantor"
            color={T_.red}
            badges={[{ text: "STRUCTURALLY SUBORDINATED", color: T_.red }, { text: "NOT A LOAN PARTY", color: T_.red }]}
            onClick={() => toggle("holdco")} selected={detail === "holdco"}
            width={400}
          />
        </div>

        <VLineLabel label="100% equity" />

        {/* ROW 3: Intermediate */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Windstream Holding of the Midwest, Inc."
            sub="Intermediate HoldCo · Nebraska · Guarantor"
            color={T_.purple}
            badges={[{ text: "GUARANTOR", color: T_.green }]}
            debt={[{ name: "6.750% Secured Notes due 2028", amount: "Secured", color: T_.purple }]}
            onClick={() => toggle("midwest")} selected={detail === "midwest"}
            width={440}
          />
        </div>

        <VLineLabel label="100% equity" />

        {/* ROW 4: OpCo — Borrower */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Windstream Services, LLC"
            sub="OpCo · Delaware · Borrower & Co-Issuer · Admin Agent: JPMorgan Chase"
            color={T_.blue}
            badges={[
              { text: "BORROWER", color: T_.blue },
              { text: "RESTRICTED SUB", color: T_.green },
            ]}
            onClick={() => toggle("opco")} selected={detail === "opco"}
            width={440}
          />
        </div>

        <VLine h={14} />

        {/* DEBT STACK */}
        <div style={{ border: `1px solid ${T_.border}`, borderRadius: 10, padding: 16, background: T_.bgPanel, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Debt Stack at Windstream Services (Priority Order ↓)</div>

          {/* 1st Lien */}
          <div onClick={() => toggle("firstlien")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "firstlien" ? T_.green : T_.border}`, background: detail === "firstlien" ? `${T_.green}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.green }}>1st Lien Secured</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>RCF + Term Loans + 8.625% Notes</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.green }}>~$3,151M</div>
                <div style={{ fontSize: 9, color: T_.amber }}>FULCRUM · Recovery: 62.8–71.3%</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Elliott: ~$1.1B", "92 sub guarantees", "Became new owners"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.green}15`, color: T_.green }}>{t}</span>)}
            </div>
          </div>

          {/* 2nd Lien */}
          <div onClick={() => toggle("secondlien")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "secondlien" ? T_.amber : T_.border}`, background: detail === "secondlien" ? `${T_.amber}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.amber }}>2nd Lien Secured</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>10.500% + 9.000% Notes</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.amber }}>~$1,235M</div>
                <div style={{ fontSize: 9, color: T_.red }}>Recovery: ~0%</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Same collateral, junior lien", "Intercreditor standstill", "$0.00125 per $1.00"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.amber}15`, color: T_.amber }}>{t}</span>)}
            </div>
          </div>

          {/* Unsecured */}
          <div onClick={() => toggle("unsecured")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "unsecured" ? T_.red : T_.border}`, background: detail === "unsecured" ? `${T_.red}08` : T_.bgInput, marginBottom: 0, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.red }}>Senior Unsecured Notes</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>6 series incl. 6.375% Aurelius Notes</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.red }}>~$1,183M</div>
                <div style={{ fontSize: 9, color: T_.red }}>Recovery: ~0% · CRAMMED DOWN</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Aurelius triggered default", "Covenant weapon", "Sale-leaseback breach"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.red}15`, color: T_.red }}>{t}</span>)}
            </div>
          </div>
        </div>

        {/* Guarantee annotations */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 0 6px" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: 9, color: T_.green }}>▲ 92 restricted subs guarantee secured debt</span>
            <span style={{ fontSize: 9, color: T_.amber }}>▲ 63+ restricted subs are non-guarantors (state regulatory restrictions)</span>
          </div>
        </div>

        <VLine h={14} />

        {/* ROW 5: Subsidiaries — two-column like other cases */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Box
            label="Operating Subsidiaries"
            sub="155+ entities · ILECs + CLECs · 18 states"
            color={T_.emerald}
            badges={[
              { text: "92 GUARANTORS", color: T_.green },
              { text: "63+ NON-GUARANTORS", color: T_.amber },
            ]}
            onClick={() => toggle("subs")} selected={detail === "subs"}
          />
          <Box
            label="Windstream Finance Corp. / Receivables LLC"
            sub="Co-Issuer (no assets) · A/R Securitization SPV"
            color={T_.textDim}
            badges={[{ text: "CO-ISSUER ONLY", color: T_.textMid }, { text: "SPECIAL PURPOSE", color: T_.textGhost }]}
          />
        </div>
      </div>

      {/* UNITI — Outside the credit group */}
      <div style={{ padding: "16px", background: `${T_.red}04`, borderRadius: 12, border: `2px dashed ${T_.red}30`, marginBottom: 4, marginTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, textAlign: "center" }}>Outside the Credit Group — Counterparty</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Uniti Group Inc."
            sub="REIT · NASDAQ: UNIT · Spun off April 2015 · Owns fiber/copper network"
            color={T_.red}
            dashed
            debt={[{ name: "Master Lease (triple-net)", amount: "~$650M/yr", color: T_.red }]}
            badges={[
              { text: "OWNS THE NETWORK", color: T_.amber },
              { text: "SEPARATE PUBLIC CO", color: T_.red },
            ]}
            onClick={() => toggle("uniti")} selected={detail === "uniti"}
            width={440}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9, color: T_.red }}>
          Uniti Leasing LLC (f/k/a CSL National, LP) → Uniti Group LP → Uniti Group Inc.
        </div>
      </div>

      {/* ── Detail buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "planTreatment", label: "Plan Treatment", color: T_.blue, sub: ">$4B eliminated · 2L contested" },
          { k: "subs", label: "Operating Subsidiaries", color: T_.emerald, sub: "155+ entities · 92 guarantors · 18 states" },
          { k: "uniti", label: "Uniti / Settlement", color: T_.red, sub: "Spin · ~$650M/yr · $1.75B+$400M" },
          { k: "postEmergence", label: "Post-Emergence & 2025 Merger", color: T_.green, sub: "Elliott exit · Uniti merger Aug 2025" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`,
            transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "Structural Subordination", color: T_.red, summary: "HoldCo recovered ~0% — the corporate structure did it, not a contract.", detail: "OpCo creditors sit at the entity with assets. They get paid first. HoldCo's only asset is equity in OpCo — if OpCo debt > OpCo value, that equity = $0. At Windstream: even 1st Lien only got 62-71%, so zero residual for HoldCo." },
          { label: "Contractual Subordination", color: T_.amber, summary: "2nd Lien junior to 1st Lien by contract — same entity, same collateral, different priority.", detail: "Intercreditor agreement: 1st Lien satisfied in full before 2nd Lien gets anything. Both had liens on the same assets, but 1L only recovered ~65% → 2L got essentially nothing ($0.00125 per $1.00)." },
          { label: "Recourse vs. Non-Recourse", color: T_.purple, summary: "OpCo debt: full recourse to 92+ guarantors. HoldCo: no recourse to any operating entity.", detail: "Recourse = lenders can pursue borrower + all guarantors. 1L had guarantees from 92 subs. HoldCo creditors had zero guarantee bridge — only source was upstream dividends, which stopped when OpCo couldn't cover its own debts." },
          { label: "Guarantees", color: T_.green, summary: "92 of 155+ subs guaranteed OpCo debt. No guarantee = no direct asset claim.", detail: "Guarantee = direct legal claim on that entity's assets. Many state ILECs were NOT guarantors (regulatory restrictions). In recovery analysis, you must map guarantor vs. non-guarantor assets for effective collateral coverage." },
          { label: "Cash Flow Waterfall", color: T_.emerald, summary: "Revenue at subs → OpCo → debt service → only residual goes to HoldCo.", detail: "At OpCo level: (1) OpEx + CapEx, (2) Uniti lease ~$650M/yr (effectively super-senior), (3) 1L service, (4) 2L, (5) unsecured. Only after ALL that is satisfied does cash dividend up to HoldCo. When EBITDA declined, the waterfall broke." },
          { label: "Covenants as Weapons", color: T_.accent, summary: "Aurelius weaponized the sale-leaseback covenant to force restructuring.", detail: "The 6.375% Notes indenture restricted sale-leasebacks. Aurelius argued the Uniti spin-off violated this. Default notice (Sep 2017) → acceleration (Dec 2017) → court agreed (Feb 2019) → $310M due → cross-default across $5.6B → Ch.11 in 10 days." },
          { label: "Fulcrum Security", color: T_.blue, summary: "1st Lien was the fulcrum — where value breaks. They became the new owners.", detail: "Fulcrum = tranche where recovery goes from partial to zero. 1L recovered 62-71% (mix of new debt + equity in Windstream Holdings II). Everything below — 2L, unsecured, HoldCo — was wiped out. Elliott and other 1L holders became private owners." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "Jan 2013", event: "6.375% Notes issued (~$700M). Indenture includes sale-leaseback restriction.", color: T_.textMid },
          { date: "Apr 24, 2015", event: "Uniti spin-off closes. Network assets ($7.45B) transferred to Communications Sales & Leasing (later Uniti Group, NASDAQ: UNIT). Windstream receives ~$1.035B cash + $2.45B Uniti debt. New ~$650M/yr master lease (15-yr triple-net).", color: T_.amber },
          { date: "2016–17", event: "Aurelius accumulates >25% of 6.375% Notes at a discount (reportedly high-50s to low-60s cents), identifies covenant breach.", color: T_.blue },
          { date: "Sep 21, 2017", event: "Aurelius delivers default notice — spin-off = prohibited sale-leaseback under 6.375% Notes indenture.", color: T_.red },
          { date: "Oct 12, 2017", event: "U.S. Bank (as Notes trustee) files U.S. Bank v. Windstream Services in SDNY (Case 17-cv-07857), Judge Jesse Furman presiding.", color: T_.red },
          { date: "Dec 2017", event: "Acceleration notice — ~$310M immediately due on the 6.375% Notes.", color: T_.red },
          { date: "Jul 23-25, 2018", event: "Furman bench trial.", color: T_.textMid },
          { date: "Feb 15, 2019", event: "Judge Furman rules for Aurelius. Default confirmed. ~$310.46M judgment. Cross-defaults cascade across $5.6B of debt.", color: T_.red },
          { date: "Feb 25, 2019", event: "Windstream files Chapter 11 (SDNY, Case 19-22312, Judge Robert Drain). ~203 debtor entities. Kirkland & Ellis debtors' counsel.", color: T_.red },
          { date: "Feb 26, 2019", event: "Interim DIP order: $400M from Citigroup Global Markets.", color: T_.blue },
          { date: "Apr 2019", event: "Final DIP order: full $1B facility ($500M RCF + $500M TL).", color: T_.blue },
          { date: "Jul 2019", event: "Debtors commence adversary proceeding against Uniti seeking recharacterization of the Master Lease as a financing (not a true lease). Major leverage point.", color: T_.amber },
          { date: "Mar 2, 2020", event: "Uniti settlement announced — agreement in principle. $1.75B FTTP capex commitment + $400M cash + share sale + fiber purchase. Negotiated as COVID lockdowns begin.", color: T_.green },
          { date: "Apr 20, 2020", event: "Settlement Agreement executed.", color: T_.green },
          { date: "Jun 26, 2020", event: "Plan CONFIRMED by Judge Drain via bench ruling. 2L ad hoc group and UCC objections to valuation overruled. Unsecured crammed down at $0. UCC/2L denied standing to pursue estate causes of action against 1L holders.", color: T_.amber },
          { date: "Summer 2020", event: "Exit financing executed ($750M TL + $500M RCF + $1.4B 7.750% Notes due 2028). Post-COVID liquidity environment = tailwind to pricing.", color: T_.blue },
          { date: "Sep 21, 2020", event: "EMERGENCE as Windstream Holdings II, LLC (private). >$4B debt eliminated. Elliott Management + former 1L holders = new owners. ~6 months between confirmation and effective date due to 18 state PUC + FCC change-of-control approvals.", color: T_.green },
          { date: "Oct 23, 2020", event: "Main Ch.11 cases closed.", color: T_.textMid },
          { date: "2020-2024", event: "Elliott operates Windstream privately, deploying the $1.75B Uniti FTTP investment commitment and building out Kinetic Fiber.", color: T_.textMid },
          { date: "May 3, 2024", event: "Uniti-Windstream MERGER ANNOUNCED: 'Uniti to Merge with Windstream Creating Premier Insurgent Fiber Provider.' The REIT that spun off Windstream's network in 2015 agrees to buy Windstream back.", color: T_.accent },
          { date: "Apr 2, 2025", event: "Uniti stockholder vote approves the merger.", color: T_.blue },
          { date: "Aug 1, 2025", event: "MERGER CLOSES. Windstream equityholders receive ~35.42% of new Uniti common + $575M of 11% preferred + warrants for ~6.9% fully-diluted + $370.7M cash. Legacy Uniti holders = ~62% of combined co. Full narrative closure: spin-off unwound a decade later.", color: T_.green },
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
   ENVISION HEALTHCARE
   ═══════════════════════════════════════════════════════ */

function EnvisionCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    kkr: (
      <DetailPanel title="KKR & The 2018 LBO" onClose={() => setDetail(null)}>
        <p>In Oct 2018, <strong>KKR's Americas Fund XII</strong> took Envision private for ~$9.9B, funding ~$7B with debt (~71% of deal value). Envision had formed in Dec 2016 from the merger of <strong>Envision Healthcare Holdings</strong> (parent of EmCare, physician staffing) and <strong>AmSurg Corp.</strong> (ambulatory surgery centers).</p>
        <p>Original debt: <strong>$5.3B 1st Lien Term Loan</strong> (due 2025) + unsecured notes + ABL facility. Admin agent: Credit Suisse (later Deutsche Bank). The thesis was that combining physician staffing with ASC ownership would create a healthcare platform with negotiating leverage against payors.</p>
        <p style={{ color: T_.red }}>The thesis collapsed: the No Surprises Act (Jan 2022) gutted out-of-network billing, one major payor cut reimbursements ~60%, and post-COVID labor inflation added ~$330M/yr in costs.</p>
        <p><strong>KKR's full position at petition date (per Keglevic First Day Declaration):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>99.67% of Envision equity</strong> (remaining ~0.33% held by management)</li>
          <li><strong>$253.3M of EVPS unsecured notes</strong> (27% of the unsecured notes class)</li>
          <li><strong>$146M of EVPS second-out and third-out term loans</strong> (acquired via participation in the 2022 uptier)</li>
        </ul>
        <p style={{ color: T_.amber }}>KKR was not just a passive equity holder — it actively participated in the 2022 uptier as a lender, acquiring second-out/third-out exposure in the process of preserving optionality. As part of the global settlement with the UCC, <strong>KKR assigned its EVPS unsecured note recoveries to unaffiliated holders</strong>, waiving its own 27% class share to grease the settlement. KKR also waived recovery on any EVPS general unsecured claims it held.</p>
        <p style={{ color: T_.red }}>Net outcome: KKR's ~$3.5B equity investment was cancelled for zero. The assigned note recoveries went to non-sponsor holders, lifting their recovery from effectively zero to ~5.8% at plan value. KKR lost control of both EVPS and AmSurg at emergence.</p>
      </DetailPanel>
    ),
    envisionParent: (
      <DetailPanel title="Envision Healthcare Corporation — Parent" onClose={() => setDetail(null)}>
        <p>Top-level parent entity post-KKR LBO. Public company taken private. After the 2022 LME transactions, this entity sat atop the EVPS silo.</p>
        <p>The original 2018 credit agreement had Envision Healthcare Corporation as <strong>Parent Borrower</strong> with subsidiary borrowers. The credit docs contained investment baskets that allowed up to ~$2.5B of assets to be transferred to unrestricted subsidiaries — the loophole KKR and its advisors later exploited for the AMSURG dropdown.</p>
      </DetailPanel>
    ),
    evps: (
      <DetailPanel title="EVPS Silo — Envision Physician Services" onClose={() => setDetail(null)}>
        <p>The physician staffing platform: 25,000+ clinicians across emergency departments, surgical suites, ICUs, birthing suites. One of the largest EM staffing operations in the US.</p>
        <p><strong>EVPS funded debt at filing (per plan treatment tables):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>ABL Facility: <strong>$440M drawn</strong> (reduced to ~$370M pre-effective date by forecasted paydown)</li>
          <li>First-out TL: <strong>$392M claim</strong> (includes $300M new money from 2022 uptier + pro rata backstop)</li>
          <li>Second-out TL: <strong>$1.959B claim</strong> (exchanged at 17% discount in 2022 uptier)</li>
          <li>Third-out TL: ~$1.0B (exchanged at par in 2022 uptier)</li>
          <li>Fourth-out TL: <strong>~$153M</strong> (non-participating lenders — subordinated)</li>
          <li>Senior Unsecured Notes: <strong>$938.9M principal / $986.8M allowed claim</strong> (8.75%) — KKR held $253.3M (27%)</li>
        </ul>
        <p style={{ color: T_.amber }}>At confirmation, Class 7 was restructured: <strong>third-out and fourth-out term loan claims were combined into a single "EVPS unsecured term loan claims" class</strong> that received no recovery (except the separate fourth-out adversary settlement). Only second-out was treated as the fulcrum security.</p>
        <p style={{ color: T_.red }}>96% of original TL holders participated in the 2022 uptier (91% among the non-ad-hoc group). The ~4% who didn't were pushed to "fourth-out" — effectively subordinated without their consent. This is creditor-on-creditor violence.</p>
      </DetailPanel>
    ),
    amsurg: (
      <DetailPanel title="AmSurg Silo — The Dropdown" onClose={() => setDetail(null)}>
        <p>In April 2022, Envision designated <strong>AmSurg Holdco and subsidiaries as Unrestricted Subsidiaries</strong> under the Envision credit facilities. This was the foundational move — it removed <strong>83% of AmSurg's equity</strong> (250+ ambulatory surgery centers, representing ~83% of AmSurg EBITDA) from the existing lenders' collateral pool. Per Octus's retrospective analysis, this moved ~61% of Envision's total enterprise value out of the restricted group.</p>
        <p><strong>AmSurg then raised its own debt (per plan claim amounts):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>RCF: <strong>$300M</strong> (maturity Jul 2026)</li>
          <li>1st Lien TL: <strong>$1.35B principal + $233.9M prepayment premium = $1.584B allowed claim</strong> (maturity Apr 2027)</li>
          <li>2nd Lien TL: <strong>$1.494B</strong> (maturity Apr 2028)</li>
        </ul>
        <p>AmSurg raised <strong>$1.1B of new-money 1L term loans</strong> — funded by Centerbridge and Angelo Gordon as new lenders, with PIMCO, HPS, Sculptor and King Street participating as existing Envision term lenders. AmSurg distributed proceeds upstream to Envision Remainco, which used them for discounted debt repurchases generating ~$582M in discount gains. AmSurg also raised ~$1.35B in second lien debt via an exchange that let participating Envision TL lenders (and Partners Group as new money) trade into a new 2L secured tranche.</p>
        <p style={{ color: T_.amber }}>New lenders <strong>Centerbridge and Angelo Gordon</strong>, joined by PIMCO, HPS, Sculptor and King Street (existing Envision TL holders), provided the AmSurg financing — they got security over the most profitable assets that original Envision lenders had just lost.</p>
        <p style={{ color: T_.red }}>Intercompany loans from AmSurg to Envision: <strong>$1.833B</strong> (per plan). These were cancelled for zero recovery in Ch.11 as part of the EVPS/AmSurg separation under the plan. The intercompany loans had been the mechanism by which value was moved back from the dropdown to EVPS; collapsing them at Ch.11 isolated the two silos from each other.</p>
      </DetailPanel>
    ),
    uptier: (
      <DetailPanel title="The Uptier / Priming Transaction (Jun–Aug 2022)" onClose={() => setDetail(null)}>
        <p>After the AMSURG dropdown created cash, Envision offered <strong>all</strong> existing 1L TL holders a chance to participate in a refinancing:</p>
        <p><strong>The offer:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Contribute your pro rata share of $300M <strong>new money</strong> → get "First-out" tranche (highest priority)</li>
          <li>Convert portion of existing TLs at <strong>17% discount</strong> → "Second-out" tranche</li>
          <li>Convert remainder at <strong>par</strong> → "Third-out" tranche</li>
          <li>All maturities extended through March 2027</li>
        </ul>
        <p><strong>~96% participated overall</strong> (91% among the non-ad-hoc group). The ~4% who didn't were left holding "Fourth-out" (~$153M) — same original loan, now structurally and contractually junior to $3.5B+ of participating debt.</p>
        <p style={{ color: T_.red }}>This is the "creditor-on-creditor violence" — majority lenders voted to subordinate the minority. A $47.8M subset of the fourth-out lenders filed an adversary proceeding challenging the "improper and unlawful" amendment to the original credit agreement and the Class 6 classification scheme. The claim was ultimately settled as part of the plan — fourth-out lenders received a pro rata share of <strong>0.25% of reorganized equity + six-year warrants convertible into up to 5% of reorganized equity</strong> at a strike price set at the second-out full-recovery value.</p>
        <p>KKR itself participated in the uptier as a lender, acquiring $146M of second-out and third-out term loans.</p>
      </DetailPanel>
    ),
    adhocGroup: (
      <DetailPanel title="The 21-Member Ad Hoc Lender Group" onClose={() => setDetail(null)}>
        <p>Per the Amended Rule 2019 Statement filed by Gibson Dunn & Munsch (co-counsel) on August 2, 2023, the Envision ad hoc group comprised <strong>21 institutional lenders holding $2.627 billion of debt across the capital structure</strong> as of July 28, 2023.</p>
        <p><strong>Top 10 by total holdings:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>King Street Capital Management — $548.2M</strong> (largest)</li>
          <li>Strategic Value Partners — $313.8M</li>
          <li>Brigade Capital Management — $288.2M</li>
          <li>Corre Partners Management — $221.5M</li>
          <li>Eaton Vance Management — $158.7M</li>
          <li>Blackstone Alternative Credit Advisors — $152.0M</li>
          <li>CastleKnight Management — $129.7M</li>
          <li>Columbus Hill Capital — $128.0M (new member)</li>
          <li>Black Diamond Capital Management — $91.5M</li>
          <li>Neuberger Berman — $88.7M</li>
        </ul>
        <p>Other members: Bank of America, Redding Ridge, Sculptor Capital, Voya, Carlyle CLO, Barings, BlackRock, Sound Point, MJX, CIFC, and Sixth Street Partners (new member). Polen Capital left the group prior to the amended statement.</p>
        <p><strong>Group holdings as a percentage of each EVPS class:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>First-out TL: <strong>89.9%</strong> of class</li>
          <li>Second-out TL: <strong>81.2%</strong> of class</li>
          <li>Third-out TL: 24.4% of combined unsecured debt</li>
          <li>EVPS Unsecured Notes: 24.4%</li>
        </ul>
        <p>The group collectively held <strong>51.1% of total EVPS debt</strong> (excluding intercompany loans) and <strong>10.3% of AmSurg debt</strong>. King Street was also the most active in AmSurg, holding $39M RCF, $175.5M 1L TL and $91.7M 2L TL alongside its EVPS positions.</p>
        <p style={{ color: T_.amber }}>This distribution — dominant control of the secured tranches, minority in unsecured — is why the ad hoc group was able to drive both the 2022 LMEs and the 2023 Ch.11 plan. The UCC's fight over unsecured recoveries was the mirror image: the ad hoc group's 24% stake in unsecured couldn't block the UCC's leverage to extract value for the rest of that class.</p>
        <p style={{ color: T_.amber }}><strong>Blackstone — two snapshots, two different stories:</strong> The ad hoc group composition shifted materially between the 2022 LME and the 2023 bankruptcy filing. Per Octus's Feb 2025 retrospective, at the <strong>Aug 2022 uptier</strong>, "parties including Blackstone" held roughly <strong>$2.1 billion (56%)</strong> of the remaining Envision term loans and <strong>backstopped the $300M new-money first-out tranche</strong>. At that moment, Blackstone was one of the dominant backstop parties. By the time of the <strong>Aug 2023 Rule 2019 filing</strong> (13 months later), Blackstone Alternative Credit Advisors was holding $152M as an individual member of the ad hoc group — 5.8% of the group, mid-pack. King Street had grown into the dominant single holder by bankruptcy filing. Both data points are accurate at their respective points in time — it's not that one narrative is wrong, it's that the group composition evolved.</p>
      </DetailPanel>
    ),
    octusRetro: (
      <DetailPanel title="Octus Feb 2025 Retrospective — Value Transfer Analysis" onClose={() => setDetail(null)}>
        <p>In Feb 2025, Octus (formerly Reorg) published a retrospective analysis of 7 drop-down transactions since 2022 (AMC, Del Monte, Trinseo, Instant Brands, Rackspace, Envision, U.S. Renal Care). The report quantifies the economic value moved away from non-ad-hoc group secured creditors in each transaction. Envision features prominently.</p>
        <p><strong>Pre-Dropdown Financial Collapse (2021 → 2022):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Envision consolidated Adj EBITDA: <strong>$516M (2021) → $60M (2022)</strong> — an <strong>88% collapse in one year</strong></li>
          <li>Envision Remainco EBITDA (post-dropdown silo): declined <strong>$443M YoY</strong> to <strong>negative $146M in 2022</strong></li>
          <li>Octus estimate: Envision Remainco <strong>cash burn could have approached $1 billion in 2022</strong> — driven by operating deterioration plus surging interest rates on a stacked debt structure</li>
          <li>Context: No Surprises Act took effect Jan 2022; payor reimbursement cuts of ~60% at one major payor; post-COVID labor inflation of ~$330M/yr</li>
        </ul>
        <p><strong>AmSurg Valuation Progression (through the case):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>March 2022</strong> (company's own fair market appraisal): <strong>$3.0B EV</strong></li>
          <li><strong>April 2022</strong> (Octus-implied at time of dropdown): <strong>~$2.64B</strong></li>
          <li><strong>Nov 2023</strong> (PJT plan valuation midpoint): <strong>$3.55B</strong> ($3.45B–$3.65B range)</li>
          <li><strong>June 2025</strong> (Ascension acquisition): <strong>~$3.9B</strong> — ~10% above plan midpoint, ~30% above Octus's Apr 2022 implied value</li>
        </ul>
        <p><strong>Value Transfer Analysis — The Core Finding:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Octus estimates <strong>61% of Envision's total value was transferred away from the credit group</strong> in the April 2022 dropdown (83% of AmSurg × AmSurg's share of total EV)</li>
          <li><strong>Non-ad-hoc group participating term lenders lost ~53% of their pre-transaction value</strong> as a result of the dropdown</li>
          <li>Non-participating lenders lost essentially all of their value from a waterfall recovery perspective</li>
          <li>"The vast majority of this value was moved to the company through the $1.1B new-money AmSurg first lien term loan" — proceeds transferred up to Envision Remainco and <em>assumed fully spent</em> on operating cash burn</li>
        </ul>
        <p><strong>Ad Hoc Group Size — Pre-Dropdown vs At Filing:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>April 2022 (at dropdown)</strong>: Ad hoc group held 29% of original TLs due 2025, 73% of incremental TLs due 2025, 8.5% of unsecured notes due 2026</li>
          <li><strong>August 2023 (at Ch.11 filing)</strong>: Ad hoc group held 89.9% of first-out, 81.2% of second-out, 51.1% of total EVPS debt</li>
          <li>The group <strong>grew materially between the LME and the filing</strong>, consolidating control of the secured tranches as positions changed hands in the interim</li>
        </ul>
        <p><strong>Octus Aggressiveness Ranking (of 7 drop-downs):</strong></p>
        <div style={{ fontSize: 12, color: T_.textMid, lineHeight: 1.7, margin: "8px 0" }}>
          <div>🔴 <strong>Del Monte</strong> — participating non-ad-hoc lenders lost <strong>64%</strong> of value (most aggressive)</div>
          <div>🟠 <strong>Envision</strong> — participating non-ad-hoc lenders lost <strong>53%</strong> of value</div>
          <div>🟡 <strong>Instant Brands</strong> — lost <strong>30%</strong> of value</div>
          <div>🟡 <strong>U.S. Renal Care</strong> — lost <strong>20%</strong> of value</div>
          <div>🟢 <strong>Rackspace</strong> — lost <strong>19%</strong> of value</div>
          <div>🟢 <strong>AMC</strong> (first lien noteholders) — lost <strong>6-9%</strong> of value (least aggressive)</div>
          <div style={{ marginTop: 4, fontStyle: "italic", color: T_.textDim }}>Trinseo measured separately (~50% value loss on the TLB-2 due 2028)</div>
        </div>
        <p style={{ color: T_.red }}><strong>Short-term solution that failed:</strong> Octus explicitly cites Envision as an example of a dropdown that proved to be "only a short-term solution" — <strong>Envision filed for Chapter 11 bankruptcy about one year after the April 2022 transaction</strong> (Ch.11 filed May 15, 2023). Only Instant Brands filed faster (6 months post-LME). Octus's conclusion: when new money from a dropdown is raised primarily to fund near-term cash burn rather than structural deleveraging, the transaction rarely prevents eventual bankruptcy — it just shifts who bears the loss.</p>
        <p style={{ color: T_.amber }}><strong>Intercompany loan reconciliation:</strong> The case study cites $1.833B intercompany loans (AmSurg → Envision) cancelled in Ch.11 per plan. Octus's narrative traces $1.35B from the second-lien exchange plus the $1.1B from the new-money first-lien transfer upstream — roughly $2.45B pre-paydown, netting down to the $1.833B reported at petition as interim repayments reduced the outstanding balance.</p>
      </DetailPanel>
    ),
    evpsPlan: (
      <DetailPanel title="EVPS Plan Treatment (Ch.11)" onClose={() => setDetail(null)}>
        <p><strong>Plan enterprise valuation (PJT):</strong> $750M–$850M (midpoint $800M). <strong>Equity value:</strong> $500M–$600M (midpoint $550M). These numbers are critical for understanding the recoveries below — the second-out class got all the equity, but the equity was worth far less than the claim amount.</p>
        <p><strong>ABL Claims ($440M drawn at petition, reduced to ~$370M pre-effective):</strong> Paid in full in cash. <span style={{ color: T_.green }}>Recovery: 100%</span></p>
        <p><strong>First-out TL ($392M claim):</strong> Pro rata share of $392M First-Out Cash Payment. <span style={{ color: T_.green }}>Recovery: 100%</span></p>
        <p><strong>Second-out TL ($1.959B claim):</strong> <span style={{ color: T_.amber }}>Received 98.25% of reorganized EVPS equity</span>, subject to dilution by MIP and new six-year warrants. At midpoint plan equity value of $550M, this implies <strong>~29% recovery</strong> on the $1.959B claim — <em>not</em> a full-par recovery despite being described as "100% equity." The fulcrum security.</p>
        <p><strong>Third-out TL + Fourth-out TL (Class 7):</strong> Originally treated separately, but the plan ultimately <strong>combined both tranches into a single "EVPS unsecured term loan claims" class that received no recovery</strong> (cancelled without distribution). <span style={{ color: T_.red }}>Recovery: 0%</span> — though fourth-out lenders negotiated a separate settlement (see uptier panel) worth 0.25% equity + 5% warrants.</p>
        <p><strong>Unsecured Notes ($938.9M principal / $986.8M allowed claim):</strong> <strong>$35M cash + 1.5% reorganized EVPS equity</strong>, plus six-year warrants. <span style={{ color: T_.amber }}>Recovery: ~5.8% at plan value including KKR assignment (6.2% on non-sponsor portion)</span>. The recovery was materially boosted by KKR's decision to assign its $253M (27%) stake in the class to unaffiliated holders.</p>
        <p><strong>General Unsecured Claims ($141.3M):</strong> Pro rata share of a $6M–$7.5M cash pool (scaling with total claims). <span style={{ color: T_.amber }}>Recovery: ~3.8%–4.2%</span>. Critically, this was up from the <strong>$110,000 total pool</strong> originally offered under the pre-settlement plan — a 55-68x increase won through UCC litigation pressure.</p>
        <p><strong>Intercompany Loan Claims ($1.833B, AmSurg → Envision):</strong> Cancelled on effective date. <span style={{ color: T_.red }}>Recovery: 0%</span></p>
        <p><strong>Equity (KKR / management):</strong> Cancelled. <span style={{ color: T_.red }}>Recovery: 0%</span> (though KKR had also converted some equity into debt positions prior — see KKR panel)</p>
      </DetailPanel>
    ),
    amsurgPlan: (
      <DetailPanel title="AmSurg Plan Treatment (Ch.11)" onClose={() => setDetail(null)}>
        <p><strong>Plan enterprise valuation (PJT):</strong> $3.45B–$3.65B (midpoint $3.55B). <strong>Equity value:</strong> $1.575B–$1.775B (midpoint $1.675B). AmSurg was worth ~4x EVPS at plan — reflecting the profitable surgery-center business the dropdown had extracted from EVPS.</p>
        <p><strong>RCF ($300M):</strong> Paid in full from AmSurg first-out exit term loan proceeds. <span style={{ color: T_.green }}>Recovery: 100%</span></p>
        <p><strong>1st Lien TL ($1.584B allowed claim = $1.35B principal + $233.9M prepayment premium + accrued):</strong> Paid in full in cash from $1.633B "last-out" AmSurg exit term loan proceeds. <span style={{ color: T_.green }}>Recovery: 100%</span></p>
        <p><strong>2nd Lien TL ($1.494B claim):</strong> <span style={{ color: T_.amber }}>Received 100% of reorganized AmSurg equity</span> (subject to dilution by the rights offering, backstop premium equity, and MIP), plus the AmSurg subscription rights. At midpoint equity value of $1.675B, this implies <strong>~73% recovery</strong> on the $1.494B claim — the fulcrum security for this silo but at a meaningfully better recovery than EVPS second-out.</p>
        <p><strong>Intercompany Claims ($1.833B owed by Envision to AmSurg):</strong> Cancelled and extinguished. <span style={{ color: T_.red }}>Recovery: 0%</span>. This is key: the loans AmSurg made to Envision (funded from the dropdown proceeds) were worthless on effective date — isolating the AmSurg silo from EVPS.</p>
        <p><strong>General Unsecured:</strong> Pro rata share of $1.5M cash pool. Trade claims largely paid during the case.</p>
        <p><strong>Exit Financing at AmSurg:</strong> $1.933B AmSurg exit TL (split: $300M first-out refinancing the RCF + $1.633B last-out refinancing the 1L) plus a fully backstopped <strong>$300M new money equity rights offering</strong> that funded the intercompany share purchase from EVPS.</p>
        <p><strong>Under the plan, AmSurg purchased the remaining 17% of the ASC business</strong> that had stayed at EVPS after the 2022 dropdown, completing the full separation of the two silos. AmSurg emerged as an independent company.</p>
      </DetailPanel>
    ),
    litigation: (
      <DetailPanel title="Key Litigation & Disputes" onClose={() => setDetail(null)}>
        <p><strong>Case caption:</strong> <em>In re Envision Healthcare Corp., et al.</em>, Case No. 23-90342, U.S. Bankruptcy Court, S.D. Texas, Houston Division, before <strong>Judge Christopher Lopez</strong>. 216 affiliated debtors across the EVPS and AmSurg silos. Debtor counsel: <strong>Kirkland & Ellis</strong> (Jack Luze argued at confirmation). UCC counsel: <strong>White & Case</strong> (Chris Shore). UCC financial advisor: <strong>Piper Sandler</strong>. Ad hoc group co-counsel: <strong>Gibson Dunn &amp; Munsch</strong>.</p>
        <p><strong>UCC vs. LME Transactions — the core litigation:</strong></p>
        <p>The Official Committee of Unsecured Creditors filed <strong>two separate derivative standing motions</strong> to challenge the 2022 LMEs:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Aug 12, 2023 — Lien Challenge Motion:</strong> Targeted "unperfected" prepetition liens on "unencumbered assets" and the debtors' going-concern value. UCC argued secured lenders' claims were overstated by "millions, if not billions" of dollars.</li>
          <li><strong>Aug 17, 2023 — Fraudulent Transfer Motion:</strong> Sought standing to prosecute claims to avoid the 2022 drop-down and follow-on LMEs under Section 548 and NY state law. UCC characterized the LMEs as "the most coercive ever" and accused the company of <strong>"buying votes for a future chapter 11 plan"</strong> rather than "buying runway." Proposed cost: $9–16.25M to prosecute, potentially delivering "hundreds of millions" to the estates.</li>
        </ul>
        <p style={{ color: T_.green }}><strong>UCC result:</strong> Through the Sept 2023 global settlement, the UCC secured dramatic recovery improvements for unsecured creditors — <strong>EVPS general unsecured claims went from a $110,000 total pool under the pre-settlement plan to $6M–$7.5M (a 55–68x increase)</strong>, plus $35M cash + 1.5% reorganized equity for EVPS unsecured notes, plus KKR's assignment of its $253M note recoveries to unaffiliated holders. A hard-fought lower-case-letter victory that tracks what modern UCC activism can produce when a creditor committee has concrete litigation threats.</p>
        <p><strong>Fourth-Out Lender Adversary:</strong> On Aug 1, 2023, holders of <strong>$47.8M of the $153M fourth-out tranche</strong> filed an adversary proceeding alleging the 2022 amendment to the original credit agreement was "improper and unlawful" and challenging the Class 6 classification scheme. The proceeding was <strong>settled separately</strong> as part of the plan — not voluntarily dismissed. Consenting fourth-out holders in the ad hoc group received <strong>0.25% of reorganized EVPS equity + six-year warrants convertible into up to 5% of reorganized equity</strong> at a strike price equal to second-out full recovery.</p>
        <p><strong>Independent Director Review:</strong> Gary Begeman (counsel: Haynes and Boone) concluded the LME transactions generated ~$1.7B in quantified benefits and the board acted within fiduciary duties. The UCC heavily criticized this review as rushed — conducted over "less than eighteen days of an incomplete analysis."</p>
        <p><strong>Securities Class Action:</strong> Pre-existing class action re: billing practices settled for $177.5M (fully insurance-funded), approved Mar 2024.</p>
        <p style={{ color: T_.amber }}>Post-Envision, the market coined <strong>"Envision blockers"</strong> — new covenant provisions in credit agreements that restrict a borrower's ability to transfer assets to unrestricted subsidiaries. This case literally changed how loan documents are written.</p>
      </DetailPanel>
    ),
    postEmergence: (
      <DetailPanel title="Post-Emergence — AmSurg to Ascension, Envision to $288M Debt" onClose={() => setDetail(null)}>
        <p>The post-emergence story is almost as remarkable as the bankruptcy itself.</p>
        <p><strong>AmSurg Acquired by Ascension — June 2025 for ~$3.9B:</strong></p>
        <p>On June 17, 2025, Ascension Health announced an agreement to acquire AmSurg — 19 months after it emerged from Ch.11 as an independent company. Per Bloomberg, the deal valued AmSurg at <strong>approximately $3.9 billion</strong>, ~10% above the $3.55B midpoint plan valuation at emergence. The former AmSurg 2L holders (who had equitized into 100% of AmSurg equity at ~73% recovery) thus realized modest appreciation on top of their Ch.11 recovery.</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Ascension's advisors:</strong> Jefferies LLC (financial); Sheppard Mullin + Hall Render (legal)</li>
          <li><strong>AmSurg's advisors:</strong> Goldman Sachs + Ducera Partners (financial); Bass Berry & Sims + Milbank (legal)</li>
          <li>Ascension committed to continuing AmSurg's physician-led joint venture governance model</li>
        </ul>
        <p><strong>Envision Refinancing — June 2025:</strong></p>
        <p>Same month as the AmSurg sale, Envision refinanced its post-emergence term loan, <strong>extending maturity to 2030</strong>, and entered into a new ABL revolving credit facility. Goldman Sachs Bank USA and Wells Fargo served as joint lead arrangers and bookrunners. Sidley Austin represented Envision; Latham & Watkins represented Goldman. Financial details were not disclosed.</p>
        <p><strong>Envision Repricing — February 2026:</strong></p>
        <p>In Feb 2026, Envision repriced its first lien term loan, paying down principal from $275M to $200M and reducing total debt from $363M to <strong>$288M</strong>. From the $7.4B of funded debt at petition date to $288M in roughly 2.5 years — a <strong>~96% debt reduction</strong>. The company is now a meaningfully smaller, de-leveraged physician services business.</p>
        <p><strong>New Management Team (2024–2025):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Full board appointed January 2024</li>
          <li><strong>Jason Owen</strong> named President &amp; CEO — April 15, 2024</li>
          <li><strong>J. Michael Bruff</strong> named CFO — October 28, 2024</li>
          <li><strong>Fredrik Eliasson</strong> appointed Board Chair — March 5, 2025</li>
        </ul>
        <p><strong>Regulatory &amp; Political Overhang:</strong></p>
        <p>In April 2024, the Senate Homeland Security &amp; Governmental Affairs Committee (chaired by Sen. Gary Peters) launched an investigation into the role of private equity in hospital emergency departments, naming Envision, TeamHealth, Lifepoint Health, and US Acute Care Solutions alongside their sponsors KKR, Blackstone, and Apollo. Staff interviewed 40+ ER physicians citing concerns about patient safety, restrictive contracting, and billing practices. Separately, Fifth Circuit litigation over the No Surprises Act IDR methodology remains active through 2026 (en banc review heard September 2025) — the regulatory environment that drove Envision into Ch.11 is still being litigated.</p>
        <p style={{ color: T_.green }}><strong>Net retrospective:</strong> The fulcrum creditors (the ad hoc group led by King Street) walked away with the physician services business. The AmSurg 2L holders took the surgery-center business and sold it at a modest premium to the plan valuation. KKR's equity was wiped. The minority holders and the UCC extracted meaningfully more than they would have without litigation pressure but still recovered pennies on the dollar. And the post-Envision doc market is now full of "Envision blockers."</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          KKR took Envision private for $9.9B in 2018, combining EmCare (physician staffing) with AmSurg (surgery centers). The company was crushed by the <span style={{ color: T_.red }}>No Surprises Act</span>, <span style={{ color: T_.red }}>payor reimbursement cuts (~60%)</span>, and <span style={{ color: T_.red }}>post-COVID labor inflation (+$330M/yr)</span>. Before filing, KKR executed a <span style={{ color: T_.amber }}>dropdown + uptier</span> — moving 83% of AmSurg to an unrestricted subsidiary and repricing the debt stack. A <span style={{ color: T_.accent }}>21-member ad hoc lender group led by King Street ($548M)</span> with Strategic Value Partners, Brigade, Corre and Eaton Vance collectively held $2.63B (51% of EVPS debt) and drove the restructuring. <span style={{ color: T_.green }}>$7.4B of funded debt was restructured</span> — $3B equitized, EVPS silo debt reduced by more than 70%. The post-emergence story is equally remarkable: <span style={{ color: T_.green }}>AmSurg was sold to Ascension in June 2025 for ~$3.9B</span>, and Envision's total debt stood at just <span style={{ color: T_.green }}>$288M as of Feb 2026</span> — a ~96% reduction from filing.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Funded Debt", v: "$7.4B", c: T_.red },
            { l: "Filed", v: "May 15, 2023", c: T_.red },
            { l: "Emerged", v: "Nov 3, 2023", c: T_.green },
            { l: "Debt Equitized", v: "~$3B", c: T_.green },
            { l: "Time in Ch.11", v: "~6 months", c: T_.textMid },
            { l: "Fulcrum (EVPS)", v: "2nd-out TL", c: T_.blue },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART — Pre-Filing (Post-LME) Structure
         Shows the dual-silo structure after the 2022 transactions
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure (Post-LME, at Filing)</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>After the Apr–Aug 2022 dropdown + uptier. Two separately capitalized silos. Click any box for details.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.red}50`, background: `${T_.red}08`, display: "inline-block" }} /><span style={{ color: T_.red }}>Unrestricted / Outside Credit Group</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: KKR */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="KKR Americas Fund XII"
            sub="PE Sponsor · Acquired 2018 for $9.9B"
            color={T_.purple}
            badges={[{ text: "EQUITY CANCELLED — $0", color: T_.red }, { text: "LOST ~$3.5B", color: T_.red }]}
            onClick={() => toggle("kkr")} selected={detail === "kkr"}
            width={340}
          />
        </div>

        <VLineLabel label="100% equity (via merger sub)" color={T_.purple} />

        {/* ROW 2: Envision Parent */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Envision Healthcare Corporation"
            sub="Parent · Borrower under original 2018 credit agreement"
            color={T_.red}
            badges={[{ text: "PARENT ENTITY", color: T_.textMid }]}
            onClick={() => toggle("envisionParent")} selected={detail === "envisionParent"}
            width={400}
          />
        </div>

        <VLine h={14} />

        {/* DUAL SILO SPLIT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative" }}>
          {/* Horizontal connector line */}
          <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 0, borderTop: `2px solid ${T_.border}` }} />

          {/* ─── LEFT: EVPS SILO (RESTRICTED GROUP) ─── */}
          <div>
            <VLine h={14} />
            <div style={{ border: `2px solid ${T_.green}30`, borderRadius: 12, padding: "12px 10px 10px", background: `${T_.green}04`, position: "relative" }}>
              <div style={{ position: "absolute", top: -10, left: 10, background: T_.bgPanel, padding: "0 6px" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px" }}>Restricted Group</span>
              </div>
              <Box
                label="EVPS Silo"
                sub="Envision Physician Services · 25,000+ clinicians"
                color={T_.blue}
                badges={[
                  { text: "PHYSICIAN STAFFING", color: T_.blue },
                  { text: "RESTRICTED SUBS", color: T_.green },
                  { text: "~$4.7B DEBT", color: T_.red },
                ]}
                debt={[
                  { name: "ABL Facility (drawn)", amount: "$440M", color: T_.green },
                  { name: "1st-out TL", amount: "$392M", color: T_.green },
                  { name: "2nd-out TL (17% discount)", amount: "$1.959B", color: T_.blue },
                  { name: "3rd-out TL (at par)", amount: "~$1.0B", color: T_.amber },
                  { name: "4th-out TL (non-participants)", amount: "~$153M", color: T_.red },
                  { name: "Sr Unsecured Notes (8.75%)", amount: "$938.9M", color: T_.red },
                ]}
                onClick={() => toggle("evps")} selected={detail === "evps"}
              />
            </div>
            <VLine h={10} />
            <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center", padding: "0 4px" }}>
              ER depts · surgical suites · ICUs · birthing · admin agent: Credit Suisse
            </div>
          </div>

          {/* ─── RIGHT: AMSURG SILO ─── */}
          <div>
            <VLine h={14} />
            <div style={{ border: `2px dashed ${T_.amber}40`, borderRadius: 10, padding: 2, background: `${T_.amber}04` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T_.amber, textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", padding: "4px 0 2px" }}>Unrestricted Subsidiary (Apr 2022)</div>
              <Box
                label="AmSurg Silo"
                sub="AmSurg Holdings / AmSurg LLC · 250+ ASCs"
                color={T_.amber}
                badges={[
                  { text: "SURGERY CENTERS", color: T_.amber },
                  { text: "UNRESTRICTED SUB", color: T_.red },
                  { text: "OUTSIDE CREDIT GROUP", color: T_.red },
                  { text: "~$3.2B DEBT", color: T_.red },
                ]}
                debt={[
                  { name: "RCF", amount: "$300M", color: T_.green },
                  { name: "1st Lien TL (allowed)", amount: "$1,584M", color: T_.green },
                  { name: "2nd Lien TL", amount: "$1,494M", color: T_.amber },
                ]}
                onClick={() => toggle("amsurg")} selected={detail === "amsurg"}
              />
            </div>
            <VLine h={10} />
            <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center", padding: "0 4px" }}>
              GI · ophthalmology · orthopedics · new lenders: Angelo Gordon, Centerbridge
            </div>
          </div>
        </div>

        {/* Intercompany arrow */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ fontSize: 10, color: T_.red, background: `${T_.red}10`, padding: "4px 14px", borderRadius: 6, border: `1px dashed ${T_.red}30` }}>
            ↔ Intercompany loans: AmSurg → Envision $1.833B (cancelled for $0 in Ch.11)
          </div>
        </div>
      </div>

      {/* ── Debt detail click targets ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        <div onClick={() => toggle("evpsPlan")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "evpsPlan" ? `${T_.blue}12` : T_.bgInput,
          border: `1px solid ${detail === "evpsPlan" ? T_.blue : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue }}>EVPS Plan Treatment</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>2nd-out → ~29% recovery · Unsecured → ~5.8% · 3rd/4th → 0% · KKR → $0</div>
        </div>
        <div onClick={() => toggle("amsurgPlan")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "amsurgPlan" ? `${T_.amber}12` : T_.bgInput,
          border: `1px solid ${detail === "amsurgPlan" ? T_.amber : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber }}>AmSurg Plan Treatment</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>1L → 100% paid · 2L → ~73% recovery (all equity) · Intercompany → $0</div>
        </div>
      </div>

      {/* Additional detail buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        <div onClick={() => toggle("uptier")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "uptier" ? `${T_.red}12` : T_.bgInput,
          border: `1px solid ${detail === "uptier" ? T_.red : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>The Uptier Transaction</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>96% participated · 4% pushed to 4th-out · "creditor-on-creditor violence"</div>
        </div>
        <div onClick={() => toggle("litigation")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "litigation" ? `${T_.accent}12` : T_.bgInput,
          border: `1px solid ${detail === "litigation" ? T_.accent : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent }}>Litigation & "Envision Blockers"</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>UCC LME challenges · Fourth-out adversary · $110K→$7.5M UCC win</div>
        </div>
      </div>

      {/* Additional detail buttons — row 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        <div onClick={() => toggle("adhocGroup")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "adhocGroup" ? `${T_.accent}12` : T_.bgInput,
          border: `1px solid ${detail === "adhocGroup" ? T_.accent : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent }}>The 21-Member Ad Hoc Group</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>King Street $548M largest · $2.63B total · 51% of EVPS debt</div>
        </div>
        <div onClick={() => toggle("postEmergence")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "postEmergence" ? `${T_.green}12` : T_.bgInput,
          border: `1px solid ${detail === "postEmergence" ? T_.green : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.green }}>Post-Emergence — Where They Are Now</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>AmSurg→Ascension $3.9B · Envision debt now $288M · 96% reduction</div>
        </div>
      </div>

      {/* Additional detail buttons — row 4 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginBottom: 4 }}>
        <div onClick={() => toggle("octusRetro")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "octusRetro" ? `${T_.amber}12` : T_.bgInput,
          border: `1px solid ${detail === "octusRetro" ? T_.amber : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber }}>Octus Feb 2025 Retrospective — Value Transfer Analysis</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>2021→22 EBITDA $516M→$60M · 61% value transferred · 53% non-ad-hoc loss · 7-deal ranking</div>
        </div>
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "Unrestricted Subsidiary Designation (Dropdown)", color: T_.amber, summary: "AmSurg's $2.5B in assets moved outside the credit group via a covenant loophole.", detail: "Credit agreements define 'Restricted' vs 'Unrestricted' subsidiaries. Restricted subs are part of the collateral/guarantor pool. Unrestricted subs are carved out — creditors can't reach their assets. The 2018 credit docs allowed ~$2.5B of asset transfers. KKR/Envision used this basket to redesignate AmSurg as Unrestricted, pulling 250+ surgery centers (~83% of AmSurg EBITDA) out of existing lenders' collateral. This is the 'dropdown' — assets drop out of the credit group." },
          { label: "Uptier / Priming Transaction", color: T_.red, summary: "Majority lenders exchanged into super-priority tranches, subordinating the minority.", detail: "After the dropdown generated cash, Envision offered all 1L TL holders a refinancing: contribute new money → First-out, exchange at discount → Second-out, exchange at par → Third-out. 96% participated. Non-participants were left in Fourth-out — same loan, but now junior to $3.5B+ of new/exchanged debt. The majority lenders effectively voted to prime the minority. This was legal because the credit agreement's 'open market purchase' and amendment provisions didn't require unanimous consent for these changes." },
          { label: "Creditor-on-Creditor Violence", color: T_.purple, summary: "Lenders in the same tranche fighting each other — the defining distressed theme of 2020s.", detail: "Unlike Windstream (creditors vs company), Envision's battle was creditors vs creditors. The ad hoc group of larger holders (who could backstop new money) got priority treatment. Smaller holders who couldn't participate were subordinated. The company and sponsor facilitated this split. This dynamic — majority lenders using document flexibility to extract value at minority expense — is now the dominant pattern in distressed credit. Post-Envision, 'Envision blockers' are standard in new credit agreements." },
          { label: "Dual-Silo Structure", color: T_.blue, summary: "Two separately capitalized businesses with separate creditor groups, plans, and outcomes.", detail: "After the dropdown, Envision effectively had two mini-capital structures: the EVPS silo (~$6.4B debt) and the AmSurg silo (~$3.2B debt). Each had its own RSA (Restructuring Support Agreement), creditor constituencies, and Ch.11 plan. AmSurg 1L was paid in full while EVPS 2nd-out became equity. The intercompany loans connecting them ($1.8B) were cancelled for nothing. Two silos = two separate recovery stories within one bankruptcy." },
          { label: "Sacred Rights & Unanimous Consent", color: T_.accent, summary: "Certain changes require 100% lender consent — but the boundaries are litigated.", detail: "Most credit agreements have 'sacred rights' that can't be amended without unanimous consent: principal reduction, maturity extension, lien release, payment waterfall changes. The non-participating fourth-out lenders argued the uptier violated these rights and filed an adversary proceeding challenging the 2022 amendment as 'improper and unlawful.' The company argued the transaction was structured to avoid triggering sacred rights (open market purchases, not amendments). The fourth-out adversary was ultimately settled as part of the plan — holders received 0.25% of reorganized equity + six-year warrants convertible into up to 5% of reorganized equity. This gray zone between indenture text and substantive fairness is where modern LME battles are fought." },
          { label: "Liability Management Exercise (LME)", color: T_.emerald, summary: "Pre-bankruptcy transactions that restructure the debt stack outside of court.", detail: "LMEs encompass dropdowns, uptiers, distressed exchanges, and other out-of-court maneuvers. Envision executed two major LMEs in ~100 days (Apr–Aug 2022): (1) the AmSurg dropdown + new credit facilities, (2) the uptier exchange creating first/second/third/fourth-out tranches. These transactions reduced debt by ~$450M, extended maturities, and reshuffled priority — all without a bankruptcy filing. S&P upgraded Envision from SD to CCC after the LMEs. But the underlying business continued deteriorating, leading to Ch.11 nine months later." },
          { label: "PE Sponsor Dynamics in Distress", color: T_.purple, summary: "KKR participated in the uptier and held loans — but lost its equity.", detail: "Unlike a passive equity holder, KKR actively participated in the 2022 LME. KKR held term loans in the newly created uptier tranches (switching from pure equity to a lender position). This is common in PE distress — sponsors try to preserve optionality by becoming creditors. Despite this, KKR's equity was cancelled in Ch.11 and it lost ownership of both EVPS and AmSurg. The ad hoc lender group (not KKR) controlled both RSAs and the reorganization." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "Dec 2016", event: "Envision Healthcare Holdings (parent of EmCare) + AmSurg Corp. merge to form Envision Healthcare Corporation.", color: T_.textMid },
          { date: "Oct 2018", event: "KKR takes Envision private for $9.9B. ~$7B in debt (~71% leverage). $5.3B 1L TL due 2025.", color: T_.purple },
          { date: "Jan 2022", event: "No Surprises Act takes effect. Gutted out-of-network billing — ~$180M revenue impact in year one.", color: T_.red },
          { date: "Apr 2022", event: "AMSURG DROPDOWN: AmSurg designated as Unrestricted Subsidiary. ~$2.5B assets leave credit group. AmSurg raises $1.3B 1L + $1.3B 2L (Angelo Gordon, Centerbridge). Distributes ~$1.1B to Envision.", color: T_.amber },
          { date: "Jun 2022", event: "UPTIER PHASE 1: Envision offers all TL holders exchange. First-out/Second-out/Third-out tranches created.", color: T_.red },
          { date: "Aug 2022", event: "UPTIER PHASE 2: Closing. 96% participate. Non-participants pushed to Fourth-out (~$153M). ~$450M debt reduction. Maturities extended to Mar 2027.", color: T_.red },
          { date: "Sep 2022", event: "S&P upgrades Envision from SD to CCC. Independent Director concludes LMEs generated ~$1.7B in benefits.", color: T_.textMid },
          { date: "May 15, 2023", event: "Envision + 216 affiliates file Chapter 11 (S.D. Tex., Case 23-90342, Judge Lopez). Dual RSAs filed. No DIP — cash collateral only.", color: T_.red },
          { date: "Aug 2023", event: "Disclosure statements approved. Bar date Aug 7.", color: T_.textMid },
          { date: "Oct 11, 2023", event: "Both plans confirmed (EVPS + AmSurg). UCC settles: $35M + 1.5% equity for noteholders.", color: T_.amber },
          { date: "Nov 3, 2023", event: "Emergence. Two separate companies: Reorganized Envision (EVPS) + Reorganized AmSurg. $7.4B funded debt restructured, ~$3B equitized, >70% EVPS debt reduction. KKR out. Henry Howe interim CEO; Steve Nelson Board Chair.", color: T_.green },
          { date: "Jan 2024", event: "Full board appointed post-emergence.", color: T_.textMid },
          { date: "Apr 2, 2024", event: "Senate Homeland Security & Governmental Affairs Committee launches PE-in-emergency-departments investigation naming Envision, TeamHealth, Lifepoint, US Acute Care + sponsors KKR, Blackstone, Apollo.", color: T_.amber },
          { date: "Apr 15, 2024", event: "Jason Owen named President & CEO, replacing Henry Howe.", color: T_.textMid },
          { date: "Oct 28, 2024", event: "J. Michael Bruff named CFO.", color: T_.textMid },
          { date: "Mar 5, 2025", event: "Fredrik Eliasson appointed Board Chair.", color: T_.textMid },
          { date: "Jun 17, 2025", event: "AmSurg acquired by Ascension for ~$3.9B (Bloomberg). ~10% above plan-valuation midpoint of $3.55B. AmSurg 2L holders who equitized realize modest premium on top of Ch.11 recovery.", color: T_.green },
          { date: "Jun 25, 2025", event: "Envision refinances post-emergence term loan, extending maturity to 2030. New ABL facility with Goldman Sachs + Wells Fargo as joint lead arrangers. Sidley Austin / Latham & Watkins as counsel.", color: T_.green },
          { date: "Feb 17, 2026", event: "Envision reprices first lien term loan, pays down principal from $275M to $200M. Total debt reduced from $363M to $288M — a ~96% reduction from petition-date $7.4B.", color: T_.green },
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
   SERTA SIMMONS BEDDING
   ═══════════════════════════════════════════════════════ */

function SertaCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    sponsors: (
      <DetailPanel title="PE Sponsors & Acquisition History" onClose={() => setDetail(null)}>
        <p><strong>2009-2010:</strong> Ares Management + Ontario Teachers' Pension Plan acquire Simmons Bedding through a pre-packaged Ch.11, combining it with Serta under <strong>AOT Bedding Super Holdings</strong>.</p>
        <p><strong>2012:</strong> Advent International acquires majority stake in AOT Bedding Super Holdings (~$3B deal). Ares and Ontario Teachers retain minority stakes.</p>
        <p><strong>2016:</strong> New credit agreement: $1.95B 1st lien TL + $450M 2nd lien TL + $225M ABL revolver = <strong>$2.625B total debt</strong>. This is the credit agreement whose "open market purchase" language became the battlefield.</p>
        <p><strong>2018:</strong> Merged with Tuft & Needle (DTC mattress brand).</p>
        <p style={{ color: T_.red }}>Sponsor equity was cancelled in Ch.11 for $1.5M (justified by $54M tax attribute preservation). Advent, Ares, Ontario Teachers lost their equity investments.</p>
      </DetailPanel>
    ),
    holdco: (
      <DetailPanel title="Dawn Intermediate / SSB HoldCo" onClose={() => setDetail(null)}>
        <p><strong>Dawn Intermediate LLC</strong> is the intermediate holding entity above Serta Simmons Bedding, LLC. Below it sits the full operating structure.</p>
        <p><strong>Serta Simmons Bedding, LLC</strong> (SSB) is the primary borrower under the 2016 Credit Agreement. It owns and manages two operating subsidiaries:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>National Bedding Company, L.L.C.</strong> — the largest Serta licensee, owns ~83% of Serta, Inc. (remaining ~17% owned by 5 independent licensees who were NOT part of the bankruptcy)</li>
          <li><strong>Simmons Bedding Company, LLC</strong> — Beautyrest brand</li>
        </ul>
        <p>Serta, Inc. itself and the 5 minority licensees did NOT file bankruptcy — only SSB and affiliates did.</p>
      </DetailPanel>
    ),
    preLME: (
      <DetailPanel title="Pre-Uptier Capital Structure (2016 Credit Agreement)" onClose={() => setDetail(null)}>
        <p>Original Nov 2016 credit facilities:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>1st Lien Term Loan:</strong> $1.95B</li>
          <li><strong>2nd Lien Term Loan:</strong> $450M</li>
          <li><strong>ABL Revolving Facility:</strong> $225M</li>
          <li><strong>Total:</strong> $2.625B</li>
        </ul>
        <p>By 2020 (pre-uptier), outstanding: ~$1.9B 1st lien, ~$420M 2nd lien, ~$225M ABL, plus ~$80M capital leases.</p>
        <p style={{ color: T_.amber }}>The 2016 Credit Agreement was characterized by courts as a <strong>"loose document"</strong> — it contained an exception in Section 9.05(g) allowing debt purchases "through open market purchases" without pro-rata treatment. This single clause became the most litigated provision in modern credit markets.</p>
      </DetailPanel>
    ),
    uptier: (
      <DetailPanel title="The 2020 Uptier Transaction" onClose={() => setDetail(null)}>
        <p>In mid-2020, facing COVID-driven liquidity pressure, SSB and a <strong>majority group of lenders (PTL Lenders)</strong> executed the uptier:</p>
        <p><strong>PTL Lender group identities:</strong> <strong>Barings</strong>, <strong>Credit Suisse Asset Management</strong>, <strong>Invesco</strong>, <strong>Eaton Vance</strong> (including its Boston Management &amp; Research affiliated funds).</p>
        <p><strong>What PTL Lenders got:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Provided <strong>$200M new money</strong> → received super-priority "First-Out" position</li>
          <li>Exchanged <strong>$875M of existing loans</strong> into new priority "Second-Out" tranche:
            <ul>
              <li>1st lien loans exchanged at <strong>~74% of par</strong></li>
              <li>2nd lien loans exchanged at <strong>~39% of par</strong></li>
            </ul>
          </li>
          <li>Total new priority tranche: <strong>~$1.075B</strong> (First-Out + Second-Out)</li>
        </ul>
        <p><strong>What Excluded Lenders experienced:</strong></p>
        <p style={{ color: T_.red }}>Non-participating 1st lien holders were <strong>not invited</strong> to participate. Their existing 1st lien loans were effectively subordinated — now sitting behind ~$1.075B of new super-priority debt. Same loan, same credit agreement, but now structurally junior. This is the "creditor-on-creditor violence."</p>
        <p><strong>Legal basis:</strong> SSB and PTL Lenders argued this was a permissible "open market purchase" under Section 9.05(g), exempt from the pro-rata sharing requirement (Section 2.18 / Sacred Rights in 9.01(b)(A)). The 5th Circuit ultimately rejected this reading — see 5th Circuit panel.</p>
      </DetailPanel>
    ),
    advisors: (
      <DetailPanel title="Professional Advisors" onClose={() => setDetail(null)}>
        <p><strong>Debtors (Serta Simmons Bedding):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Weil, Gotshal &amp; Manges</strong> — Lead US legal counsel</li>
          <li><strong>Evercore</strong> — Investment banker</li>
          <li><strong>FTI Consulting</strong> — Financial advisor</li>
        </ul>
        <p><strong>PTL Ad Hoc Group (Barings, CSAM, Invesco, Eaton Vance):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Gibson, Dunn &amp; Crutcher</strong> — Lead legal counsel</li>
          <li><strong>Jackson Walker</strong> — Texas local counsel <span style={{ color: T_.amber }}>(later at center of Jones/Freeman scandal)</span></li>
          <li><strong>Centerview Partners</strong> — Financial advisor</li>
        </ul>
        <p><strong>Advent International (sponsor):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Ropes &amp; Gray</strong> — Legal counsel</li>
        </ul>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Excluded Lender group advisors and UCC composition not verified against Kroll docket in this pass — check cases.ra.kroll.com/sertasimmons for detail.</em></p>
      </DetailPanel>
    ),
    postLME: (
      <DetailPanel title="Post-Uptier Capital Structure (at Filing)" onClose={() => setDetail(null)}>
        <p>After the 2020 uptier, the debt stack was reshuffled into priority tranches:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>First-Out (FLFO) Term Loan:</strong> ~$200M+ (new money + accrued) — highest priority</li>
          <li><strong>Second-Out (FLSO) Term Loan:</strong> ~$875M (exchanged from existing 1L/2L at discount) — second priority</li>
          <li><strong>Non-PTL Term Loans (Excluded Lenders):</strong> remaining original 1L loans — now effectively third priority</li>
          <li><strong>ABL Facility:</strong> $225M</li>
          <li><strong>Capital Leases:</strong> ~$80M</li>
        </ul>
        <p>Total funded debt at filing: <strong>~$1.9B</strong> (reduced from ~$2.6B through the discount exchanges).</p>
        <p style={{ color: T_.amber }}>Despite the LME buying time (extended maturities, $200M liquidity), the underlying business continued deteriorating — mattress industry secular decline, inflation, competition from DTC brands. SSB filed Ch.11 ~2.5 years after the uptier.</p>
      </DetailPanel>
    ),
    excludedLenders: (
      <DetailPanel title="Excluded Lenders — Who Got Primed" onClose={() => setDetail(null)}>
        <p>The following lender groups were <strong>not invited</strong> to participate in the 2020 uptier and filed suit:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>LCM Asset Management</strong> — sued in SDNY</li>
          <li><strong>Apollo Global Management</strong></li>
          <li><strong>Angelo Gordon</strong></li>
          <li><strong>Gamut Capital Management</strong></li>
          <li><strong>Contrarian Capital</strong></li>
          <li><strong>Columbia Funds</strong></li>
          <li><strong>Ascribe</strong></li>
          <li><strong>Alcentra</strong></li>
          <li><strong>Z Capital Group</strong></li>
          <li><strong>Citadel Equity Fund Ltd.</strong> (purchased claims post-uptier, joined the appeal)</li>
        </ul>
        <p>At bankruptcy filing, SSB filed an adversary proceeding <strong>against</strong> the excluded lenders, seeking declaratory judgment that the 2020 uptier was valid. The excluded lenders counterclaimed for breach of contract and breach of implied covenant of good faith.</p>
        <p style={{ color: T_.amber }}>Many of these excluded lenders had acquired their positions <strong>after</strong> the 2016 issuance, anticipating they could propose a competing restructuring. The court noted they were "keenly aware" the credit agreement was a "loose document."</p>
      </DetailPanel>
    ),
    plan: (
      <DetailPanel title="Chapter 11 Plan Treatment" onClose={() => setDetail(null)}>
        <p>Pre-arranged plan filed with RSA. Confirmed June 6, 2023 (Judge David Jones, S.D. Tex.). Reduced secured debt from ~$1.9B to <strong>$315M</strong>.</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Class</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Treatment</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Recovery</th>
          </tr></thead>
          <tbody>
            {[
              { cls: "ABL Facility ($225M)", treat: "Paid in full or reinstated", rec: "100%", c: T_.green },
              { cls: "First-Out (FLFO) TL", treat: "$195M new takeback debt", rec: "~100%", c: T_.green },
              { cls: "Second-Out (FLSO) TL", treat: "100% reorganized equity + $105M takeback debt", rec: "Fulcrum", c: T_.blue },
              { cls: "Non-PTL TL (Excluded)", treat: "5% equity (if accept) / 1% equity (if reject)", rec: "~1-5%", c: T_.red },
              { cls: "General Unsecured", treat: "Paid in full", rec: "100%", c: T_.green },
              { cls: "Equity (Advent/Ares/OTPP)", treat: "$1.5M for $54M tax attribute", rec: "~0%", c: T_.red },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.cls}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.treat}</td>
                <td style={{ padding: "6px 8px", color: r.c, fontWeight: 600, textAlign: "right" }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: T_.amber }}>The plan also included an <strong>indemnification provision</strong> protecting PTL Lenders against liability from the 2020 uptier. This became the key issue on appeal — the 5th Circuit struck it down.</p>
      </DetailPanel>
    ),
    fifthCircuit: (
      <DetailPanel title="5th Circuit Ruling — The Landmark Decision (Dec 31, 2024)" onClose={() => setDetail(null)}>
        <p><em>In re Serta Simmons Bedding, L.L.C.</em>, 125 F.4th 555 (5th Cir. 2024). No. 23-20181. <strong>First federal circuit court to rule on uptier transactions.</strong></p>
        <p><strong>Panel:</strong> Circuit Judges Catharina Haynes, Don R. Willett, and <strong>Andrew S. Oldham (opinion author)</strong>. Unanimous.</p>
        <p><strong>Three key holdings:</strong></p>
        <p><strong>1. Uptier violated the credit agreement.</strong> The 2020 transaction was NOT a permissible "open market purchase" under Section 9.05(g). The court held "open market" means the secondary market for syndicated loans — not private, individually negotiated exchanges with selected lenders. Accepting SSB's broad definition would render the Dutch Auction alternative "superfluous" under the canon against surplusage. <strong>The court grounded its interpretation in dictionaries, law reviews, and statutory-construction canons</strong> — not LSTA guidance. (Ropes &amp; Gray's memo captured this: "Law Reviews, Dictionaries, and Uptiers.")</p>
        <p><strong>2. Equitable mootness did not bar review.</strong> Despite the plan being fully consummated, the court found a "surgical remedy" was available — excising the indemnity provision without unwinding the entire plan. The panel distinguished "inability to alter the outcome (real mootness)" from "unwillingness to alter the outcome (equitable mootness)" and expressed broad skepticism of the equitable mootness doctrine itself.</p>
        <p><strong>3. Indemnification provision excised.</strong> Violated §502(e)(1)(B) — the prepetition indemnity would have been disallowed as a contingent reimbursement claim. Repackaging it as a plan "settlement" was "an impermissible end-run." Also violated §1123(a)(4) — the indemnity's value "varied dramatically" between PTL Lenders (worth tens of millions) and non-participants (worth nothing), violating equal treatment.</p>
        <p style={{ color: T_.red }}><strong>Impact:</strong> Remanded excluded lenders' counterclaims for adjudication — potentially "hundreds of millions" in damages. PTL Lenders lost their indemnity shield. The ruling is actively reshaping how every new credit agreement is drafted.</p>
        <p style={{ color: T_.amber }}><strong>Mitel same-day contrast:</strong> On the same day (Dec 31, 2024), the <strong>NY Appellate Division, First Department</strong> unanimously upheld the <strong>Mitel Networks</strong> uptier — the key distinction being that Mitel's credit agreement <strong>lacked the "open market" qualifier</strong> and permitted any "purchase." The two opinions together are now a standard teaching pair on contract-language drafting.</p>
        <p style={{ color: T_.blue }}><strong>Subsequent procedural history:</strong> Amended opinion <strong>Jan 21, 2025</strong> (clarified remand reaches counterclaims against PTL lenders not originally named as plaintiffs). Further revised <strong>Feb 14, 2025</strong>. Rehearing / reconsideration denied <strong>Feb 18, 2025</strong>. On remand the case was reassigned to <strong>Judge Christopher Lopez</strong> after Jones's Oct 2023 resignation. Lopez held a <strong>five-day bench trial March 2-6, 2026</strong>, with <strong>closing arguments March 25, 2026</strong>. Judge Lopez has the matter under advisement; decision expected <strong>mid-to-late July 2026</strong> (80-90 days from closing per Lopez). See the Litigation History panel for the core §2.18(c) legal dispute and damages range ($0 / $30M / $400M).</p>
      </DetailPanel>
    ),
    litigation: (
      <DetailPanel title="Litigation History" onClose={() => setDetail(null)}>
        <p><strong>May 2020:</strong> <strong>LCM XXII Ltd.</strong> sued in SDNY — <strong>1:20-cv-05090</strong> — seeking declaratory relief and damages. Proceedings continued in parallel with the NY state case.</p>
        <p><strong>Jun 12, 2020:</strong> <strong>North Star Debt Holdings v. Serta</strong> filed in NY Supreme Court, Commercial Division (Justice <strong>Andrea Masley</strong>). Court initially <strong>granted a TRO</strong> on Jun 12, 2020.</p>
        <p><strong>Jun 19-25, 2020:</strong> TRO dissolved; preliminary injunction <strong>denied</strong> (2020 NY Slip Op 31954(U)). Justice Masley found plaintiffs could recover money damages and the balance of equities favored defendants.</p>
        <p><strong>Jan 23, 2023:</strong> SSB filed Chapter 11; the <strong>day after</strong> filing, SSB and the PTL Lenders commenced an adversary proceeding against excluded lenders seeking a declaratory judgment that the 2020 uptier was valid.</p>
        <p><strong>Mar 28, 2023:</strong> Bankruptcy court (Judge David R. Jones) granted <strong>summary judgment</strong> in part for SSB/PTL Lenders — finding "open market purchase" was unambiguous.</p>
        <p><strong>Jun 6, 2023:</strong> Following a <strong>five-day bench trial</strong>, Judge Jones entered <strong>final judgment</strong> for SSB/PTL Lenders — the same day he <strong>confirmed the plan</strong>, which included the indemnification provision for PTL Lenders. 7-day stay of confirmation order (shortened from the default 14).</p>
        <p><strong>Jun 29, 2023:</strong> Plan effective date. SSB emerged.</p>
        <p><strong>Sep 2023:</strong> Fifth Circuit accepted direct appeal under 28 U.S.C. §158(d)(2). Citadel joined as appellant-in-interest.</p>
        <p><strong>Oct 2023:</strong> Judge David R. Jones <strong>resigns</strong> amid disclosure of his undisclosed relationship with former <strong>Jackson Walker</strong> partner Elizabeth Freeman. Jackson Walker represented the PTL Lenders in Serta, placing this case squarely within the US Trustee's disgorgement universe (JW faces ~$13-23M in aggregate fee clawback across Jones-era cases — Neiman Marcus, Cineworld, Serta, Incora, et al.). The remand in Serta was reassigned following Jones's resignation.</p>
        <p><strong>Dec 31, 2024:</strong> <strong>Fifth Circuit REVERSES</strong> — uptier violated credit agreement, indemnity excised, excluded lender counterclaims remanded. Same day, NY Appellate Division upholds the Mitel Networks uptier on different contract language.</p>
        <p><strong>Jan 21, 2025:</strong> Amended opinion issued (expanded remand to reach non-plaintiff PTL lenders).</p>
        <p><strong>Feb 14, 2025:</strong> Further revised opinion.</p>
        <p><strong>Feb 18, 2025:</strong> Rehearing / reconsideration denied.</p>
        <p><strong>Dec 15, 2025:</strong> <strong>Judge Christopher Lopez</strong> (reassigned post-Jones) denies motion to dismiss <strong>LCM lenders' amended breach-of-contract claim</strong> against participating lenders. LCM held ~$18.2M in Serta 1L at the uptier and its claim is <strong>separate</strong> from the larger excluded lender group (~$340M). Lopez finds a specific footnote in the 5th Circuit's revised opinion explicitly preserved LCM's open-market-purchase claim: "I read the footnote literally for what it says."</p>
        <p><strong>Jan 26, 2026:</strong> Lopez denies excluded lenders' motion to add a new breach claim based on "assignment provisions" of the credit agreement. Only the existing open-market-purchase breach claim proceeds to trial.</p>
        <p><strong>Feb 19, 2026:</strong> Parties retain <strong>retired Judge Chapman as mediator</strong> ahead of trial. Mediation fails to resolve.</p>
        <p><strong>Mar 2-6, 2026:</strong> <strong>Five-day bench trial before Judge Christopher Lopez</strong> on the remanded breach-of-contract claims. Excluded lenders repped by <strong>Susheel Kirpalani (Quinn Emanuel)</strong>; participating PTL lenders repped by <strong>Gregg Costa (Gibson Dunn)</strong>.</p>
        <p><strong>Mar 25, 2026:</strong> Closing arguments. Judge Lopez takes the matter under advisement and indicates an <strong>80-90 day timeframe for decision</strong> — anticipating a <strong>mid-to-late July 2026 ruling</strong>. Lopez also encourages continued settlement talks before his decision.</p>
        <p style={{ color: T_.amber }}><strong>The core legal issue at trial — Section 2.18(c):</strong> The trial turns on whether §2.18(c) of the 2016 first-lien credit agreement was breached. Kirpalani (excluded lenders) argues §2.18(c) is a "lender ratable treatment provision" that guarantees equal payment to all lenders — whether in cash or new debt. The core question: is the <strong>$734M of new first-out debt</strong> provided to participating lenders in exchange for <strong>$929M of their existing TL</strong> a "payment" of principal under §2.18(c)? Costa (participating lenders) argues §2.18(c) is a "cash turnover provision" tied to §2.18(a), which requires payments in cash / US dollars — doesn't apply to cashless debt-for-debt exchanges. Whichever reading Lopez adopts is dispositive.</p>
        <p style={{ color: T_.amber }}><strong>Damages gap at trial:</strong> Excluded lenders demand <strong>$400M</strong> (characterized by participating counsel as "pie-in-the-sky"). Participating lenders argue damages are at most <strong>$30M</strong> (tied to a documented pre-transaction offer by excluded lenders to pay participating lenders $30M to abandon the uptier) and potentially <strong>$0</strong> because excluded lenders could have matched the $0.74 discount but chose to hold out at $0.78. Matching would have cost them ~$31M.</p>
        <p style={{ color: T_.amber }}><strong>"Who threw the first punch" narrative:</strong> Participating lenders' central defense — the excluded lenders started the LME arms race with an unsolicited <strong>J.Crew-style IP drop-down proposal from Angelo Gordon</strong>, threatening participating lenders' collateral. Participating lenders claim they were acting in self-defense. Crucially, Judge Jones's prior confirmation findings — that participating lenders acted in good faith because the excluded lenders' drop-down threatened their collateral — were <strong>NOT reversed by the 5th Circuit and remain binding</strong>. Kirpalani rebutted that <strong>Barings (itself a participating lender) also proposed an IP drop-down</strong> before joining the uptier, undercutting the "self-defense" framing. Equitable doctrines (unclean hands, in pari delicto) contested but excluded lenders argue these defenses don't apply to legal breach-of-contract claims.</p>
        <p style={{ color: T_.red }}>As of April 2026: Judge Lopez's decision pending; expected mid-to-late July 2026. A ruling for excluded lenders could result in damages anywhere from $30M to $400M. A ruling for participating lenders would effectively close out six years of Serta litigation. The outcome will define whether "Serta liability" becomes a real economic cost for participating PTL lenders or a narrow legal loss with no monetary consequence.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          PE-backed mattress manufacturer (Serta, Beautyrest, Simmons, Tuft & Needle — ~19% of US bedding sales). Sponsors: <span style={{ color: T_.purple }}>Advent International</span> (majority), Ares, Ontario Teachers. In 2020, facing COVID liquidity pressure, SSB and a majority lender group executed an <span style={{ color: T_.red }}>uptier transaction</span> that primed non-participating lenders — the <span style={{ color: T_.accent }}>landmark case</span> for creditor-on-creditor violence. The 5th Circuit ultimately <span style={{ color: T_.red }}>invalidated the uptier</span>, setting the first federal appellate precedent on these transactions.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Total Debt", v: "~$1.9B", c: T_.red },
            { l: "Filed", v: "Jan 23, 2023", c: T_.red },
            { l: "Emerged", v: "Jun 29, 2023", c: T_.green },
            { l: "Debt Eliminated", v: "~$1.6B", c: T_.green },
            { l: "Time in Ch.11", v: "~5 months", c: T_.textMid },
            { l: "Fulcrum", v: "FLSO (2nd-out)", c: T_.blue },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>Post-2020 uptier, at filing. Click any box for details. Case 23-90020, S.D. Tex., Judge David Jones.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.red}50`, background: `${T_.red}08`, display: "inline-block" }} /><span style={{ color: T_.red }}>Unrestricted / Outside Credit Group</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* SPONSORS — Outside */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="PE Sponsors"
            sub="Advent International (majority) · Ares · Ontario Teachers"
            color={T_.purple}
            badges={[{ text: "EQUITY → $1.5M ($54M TAX VALUE)", color: T_.red }]}
            onClick={() => toggle("sponsors")} selected={detail === "sponsors"}
            width={380}
          />
        </div>

        <VLineLabel label="100% equity (via AOT Bedding Super Holdings)" color={T_.purple} />

        {/* ── RESTRICTED GROUP ── */}
        <div style={{ border: `2px solid ${T_.green}30`, borderRadius: 14, padding: "14px 16px 16px", background: `${T_.green}04`, position: "relative" }}>
          <div style={{ position: "absolute", top: -10, left: 16, background: T_.bgPanel, padding: "0 8px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px" }}>Restricted Group — Borrower & Guarantors</span>
          </div>

          {/* HOLDCO / BORROWER */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <Box
              label="Dawn Intermediate LLC → Serta Simmons Bedding, LLC"
              sub="Borrower under 2016 Credit Agreement · Doraville, GA"
              color={T_.blue}
              badges={[{ text: "BORROWER", color: T_.blue }, { text: "RESTRICTED SUB", color: T_.green }, { text: "DEBTOR", color: T_.red }]}
              onClick={() => toggle("holdco")} selected={detail === "holdco"}
              width={440}
            />
          </div>

          <VLine h={14} />

          {/* DEBT STACK */}
          <div style={{ border: `1px solid ${T_.border}`, borderRadius: 10, padding: 16, background: T_.bgPanel, marginBottom: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Debt Stack (Post-2020 Uptier — Priority Order ↓)</div>

          {/* ABL */}
          <div style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${T_.border}`, background: T_.bgInput, marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T_.green }}>ABL Revolving Facility</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: T_.green }}>$225M</span>
            </div>
            <div style={{ fontSize: 9, color: T_.textGhost, marginTop: 2 }}>Asset-based · Paid in full in Ch.11</div>
          </div>

          {/* FLFO */}
          <div onClick={() => toggle("uptier")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "uptier" ? T_.emerald : T_.border}`, background: detail === "uptier" ? `${T_.emerald}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.emerald }}>First-Out (FLFO) Term Loan</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>NEW MONEY from PTL Lenders</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.emerald }}>$200M</div>
                <div style={{ fontSize: 9, color: T_.green }}>Recovery: ~100%</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Super-priority", "New money (2020)", "$195M takeback debt"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.emerald}15`, color: T_.emerald }}>{t}</span>)}
            </div>
          </div>

          {/* FLSO */}
          <div onClick={() => toggle("postLME")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "postLME" ? T_.blue : T_.border}`, background: detail === "postLME" ? `${T_.blue}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.blue }}>Second-Out (FLSO) Term Loan</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Exchanged at discount (1L@74¢, 2L@39¢)</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue }}>~$875M</div>
                <div style={{ fontSize: 9, color: T_.blue }}>FULCRUM → 100% equity</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Priority lien", "PTL Lenders exchanged in", "Equity + $105M debt"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.blue}15`, color: T_.blue }}>{t}</span>)}
            </div>
          </div>

          {/* Non-PTL (Excluded) */}
          <div onClick={() => toggle("excludedLenders")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "excludedLenders" ? T_.red : T_.border}`, background: detail === "excludedLenders" ? `${T_.red}08` : T_.bgInput, marginBottom: 0, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.red }}>Non-PTL Term Loans (Excluded Lenders)</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Apollo, Angelo Gordon, Citadel, et al.</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.red }}>Remaining 1L</div>
                <div style={{ fontSize: 9, color: T_.red }}>Recovery: 1-5% equity</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["PRIMED by uptier", "Not invited", "Sued — won on appeal", "5th Cir. landmark"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.red}15`, color: T_.red }}>{t}</span>)}
            </div>
          </div>
        </div>

        <VLine h={14} />

        {/* Operating Subs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Box
            label="National Bedding Company, L.L.C."
            sub="Largest Serta licensee · Owns ~83% of Serta, Inc."
            color={T_.emerald}
            badges={[{ text: "SERTA BRAND", color: T_.emerald }, { text: "RESTRICTED SUB", color: T_.green }]}
          />
          <Box
            label="Simmons Bedding Company, LLC"
            sub="Beautyrest brand · Manufacturing operations"
            color={T_.emerald}
            badges={[{ text: "BEAUTYREST BRAND", color: T_.emerald }, { text: "RESTRICTED SUB", color: T_.green }]}
          />
        </div>
        </div>{/* end restricted group */}

        <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
          <div style={{ fontSize: 9, color: T_.amber, padding: "4px 12px", background: `${T_.amber}08`, borderRadius: 4, border: `1px dashed ${T_.amber}30` }}>
            Serta, Inc. (5 minority licensees, ~17% ownership) — OUTSIDE the debtor group, did NOT file bankruptcy
          </div>
        </div>
      </div>

      {/* ── Detail buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "preLME", label: "Pre-Uptier Structure", color: T_.textMid, sub: "$2.625B · 2016 Credit Agreement" },
          { k: "plan", label: "Ch.11 Plan Treatment", color: T_.blue, sub: "$1.9B → $315M · Class recoveries" },
          { k: "advisors", label: "Professional Advisors", color: T_.amber, sub: "Weil · Evercore · Gibson Dunn · Jackson Walker" },
          { k: "fifthCircuit", label: "5th Circuit Ruling", color: T_.accent, sub: "Landmark · Uptier invalidated" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* Litigation button */}
      <div onClick={() => toggle("litigation")} style={{
        padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center", marginBottom: 4,
        background: detail === "litigation" ? `${T_.red}12` : T_.bgInput,
        border: `1px solid ${detail === "litigation" ? T_.red : T_.border}`, transition: "all .15s",
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>Litigation Timeline</div>
        <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>NY state suit → adversary proceeding → bankruptcy court → 5th Circuit reversal → damages pending</div>
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "Open Market Purchase — The Clause That Changed Everything", color: T_.accent, summary: "Section 9.05(g) let debt be repurchased 'through open market purchases' without pro-rata treatment.", detail: "The 2016 Credit Agreement allowed debt buybacks via Dutch Auction (open to all lenders pro-rata) OR 'open market purchases.' PTL Lenders argued the uptier was an 'open market purchase.' The 5th Circuit disagreed: 'open market' means the secondary market for syndicated loans, not private negotiations with selected lenders. Accepting the broad definition would make the Dutch Auction alternative 'superfluous.' This interpretation now governs how every similar clause is read." },
          { label: "Pro-Rata Sharing / Sacred Rights", color: T_.green, summary: "Section 2.18 required all payments be allocated pro-rata. Section 9.01(b)(A) made this a 'sacred right' requiring unanimous consent.", detail: "Pro-rata sharing is a foundational principle: all lenders in the same tranche share proportionally in any payment. Amending this requires 100% consent. The credit agreement carved out an exception for Section 9.05(g) transactions — but the 5th Circuit held the uptier exceeded what 9.05(g) permitted, meaning the pro-rata carveout didn't apply. 'Ratable treatment is an important background norm of corporate finance.'" },
          { label: "Uptier / Position Enhancement Transaction", color: T_.red, summary: "Majority lenders exchange existing debt into new super-priority tranche, subordinating the rest.", detail: "The PTL Lenders provided $200M new money + exchanged $875M existing loans at discount into super-priority tranches. Non-participants kept their original loans but were now behind ~$1.075B of new senior debt. The company gets liquidity, participating lenders get priority, non-participants get primed. Unlike Envision (96% participated), Serta had a more contentious split with significant excluded lender groups." },
          { label: "Indemnification as Plan Currency", color: T_.purple, summary: "PTL Lenders demanded protection from excluded lender lawsuits as price of supporting the plan.", detail: "The bankruptcy plan indemnified PTL Lenders against all liability from the 2020 uptier. This was the 'price' for PTL Lenders equitizing ~$1B of debt. The 5th Circuit struck this down: the prepetition indemnity was a contingent claim that would have been disallowed under §502(e)(1)(B). Repackaging it as a 'settlement' was 'an impermissible end-run.' The indemnity's value also varied dramatically between classes — worth millions to PTL Lenders, nothing to others — violating §1123(a)(4) equal treatment." },
          { label: "Equitable Mootness — Can You Appeal After Emergence?", color: T_.blue, summary: "5th Circuit said YES — rejected the doctrine that plan consummation bars appellate review.", detail: "PTL Lenders argued the appeal was moot because the plan had been fully consummated (SSB emerged, new equity distributed). The 5th Circuit distinguished between 'inability to alter the outcome (real mootness)' and 'unwillingness to alter the outcome (equitable mootness).' Found a 'surgical remedy' — excising the indemnity — that wouldn't unwind the plan. This is a major development: it means plan confirmation is no longer the end of the road for losing creditors." },
          { label: "Serta vs. Envision — Different Outcomes, Same Playbook", color: T_.emerald, summary: "Same uptier concept, radically different litigation outcomes based on credit agreement language.", detail: "Envision: 96% participation, credit docs arguably broader, UCC settled for small recovery, no circuit court ruling. Serta: significant excluded lender group (Apollo, Angelo Gordon, Citadel), credit docs had specific 'open market purchase' language, 5th Circuit invalidated the uptier. The contrast shows that the specific contract language matters enormously — two nearly identical transactions can produce opposite legal outcomes. Post-Serta, new credit agreements include explicit 'uptier blockers' and tighter definitions of permissible purchases." },
          { label: "Market Impact — 'Serta Protection' in New-Issue Documents", color: T_.amber, summary: "Post-Serta, syndicated loan documentation has been rewritten. LSTA model language and 'Serta protection' are now standard in 2025 new-issues.", detail: "The 5th Circuit's ruling has reshaped how every new credit agreement is drafted. The LSTA has circulated model 'Serta protection' amendments that include: (1) explicit definition of 'open market purchase' limiting it to the secondary market, (2) belt-and-suspenders pro-rata sharing language tying together Sections 9.05 and 2.18, (3) explicit 'uptier blockers' preventing majority lenders from executing priming exchanges without all-lender consent, (4) 'J.Crew + Serta + Chewy blocker' packages bundled together to prevent the full menu of LME maneuvers (IP drop-downs, uptiers, and unrestricted-subsidiary transfers). The Serta/Mitel contrast has become the canonical teaching pair for drafting — same economic transaction, opposite legal outcome based purely on the 'open market' qualifier. As of 2025 new-issue markets, 'Serta protection' is table stakes for institutional buyers; deals without it price wider. The ruling also revived skepticism of the equitable mootness doctrine, meaning post-confirmation appellate review is now a more realistic threat for aggressive plans." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "2009-10", event: "Ares + Ontario Teachers acquire Simmons via pre-pack Ch.11, combine with Serta under AOT Bedding.", color: T_.textMid },
          { date: "Oct 2012", event: "Advent International acquires majority stake (~$3B). Ares + OTPP retain minority.", color: T_.purple },
          { date: "Nov 2016", event: "New credit agreement: $1.95B 1L TL + $450M 2L TL + $225M ABL = $2.625B. 'Loose document' with open market purchase carveout.", color: T_.textMid },
          { date: "Mar 2020", event: "COVID hits. Mattress retail shutters. SSB faces liquidity crisis.", color: T_.red },
          { date: "May 2020", event: "LCM XXII Ltd. sues in SDNY (1:20-cv-05090) — first formal legal challenge to the impending uptier.", color: T_.red },
          { date: "Jun 2020", event: "UPTIER EXECUTED: PTL Lenders (Barings, CSAM, Invesco, Eaton Vance) provide $200M new money + exchange $875M at discount (~74% for 1L, ~39% for 2L) → new First-Out/Second-Out priority tranches. Excluded lenders (Apollo, Angelo Gordon, LCM, Contrarian, Columbia, et al.) primed.", color: T_.red },
          { date: "Jun 12, 2020", event: "North Star Debt Holdings files in NY Supreme Court (Justice Andrea Masley). Court initially grants TRO.", color: T_.red },
          { date: "Jun 19-25, 2020", event: "TRO dissolved; preliminary injunction denied (2020 NY Slip Op 31954(U)). Justice Masley: plaintiffs can recover money damages, balance of harms favors defendants.", color: T_.amber },
          { date: "2020-22", event: "LME buys time but business continues deteriorating. Mattress industry secular headwinds, inflation, DTC competition.", color: T_.amber },
          { date: "Jan 23, 2023", event: "SSB files Chapter 11 (S.D. Tex., Case 23-90020, Judge David R. Jones). RSA with PTL Lenders. Day after filing: adversary proceeding filed against excluded lenders.", color: T_.red },
          { date: "Mar 28, 2023", event: "Bankruptcy court grants summary judgment in part for SSB/PTL Lenders — 'open market purchase' unambiguous.", color: T_.amber },
          { date: "Jun 6, 2023", event: "Following a 5-day bench trial, Judge Jones enters final judgment for SSB/PTL Lenders AND confirms the plan — same day. $1.9B → $315M. FLSO → 100% equity. Excluded lenders → 1-5%. Indemnity for PTL Lenders included. 7-day stay (shortened from 14).", color: T_.amber },
          { date: "Jun 29, 2023", event: "SSB emerges from Ch.11. PTL Lenders own the reorganized company.", color: T_.green },
          { date: "Sep 2023", event: "5th Circuit accepts direct appeal under 28 U.S.C. §158(d)(2). Citadel joins as appellant-in-interest.", color: T_.blue },
          { date: "Oct 2023", event: "Judge David R. Jones RESIGNS amid disclosed relationship with former Jackson Walker partner Elizabeth Freeman. Jackson Walker represented the PTL Lenders in Serta — placing this case within the US Trustee's ~$13-23M JW fee disgorgement universe (Neiman Marcus, Cineworld, Serta, Incora, et al.). Remand reassigned.", color: T_.amber },
          { date: "Dec 31, 2024", event: "5TH CIRCUIT REVERSAL (Haynes/Willett/Oldham; Oldham authored). Uptier violated credit agreement. Not a permissible 'open market purchase.' Indemnity excised under §502(e)(1)(B) + §1123(a)(4). Counterclaims remanded. First federal circuit ruling on uptiers. Same day: NY Appellate Division upholds Mitel Networks uptier on different contract language.", color: T_.accent },
          { date: "Jan 21, 2025", event: "Amended opinion expands remand to reach non-plaintiff PTL lenders.", color: T_.blue },
          { date: "Feb 14, 2025", event: "Further revised opinion.", color: T_.blue },
          { date: "Feb 18, 2025", event: "Rehearing / reconsideration denied. Ruling finalized.", color: T_.accent },
          { date: "Dec 15, 2025", event: "Judge Christopher Lopez (reassigned post-Jones) denies motion to dismiss LCM lenders' separate breach-of-contract claim (~$18.2M holdings) — preserved by a specific 5th Circuit footnote.", color: T_.amber },
          { date: "Jan 26, 2026", event: "Lopez denies excluded lenders' motion to add new breach claim based on assignment provisions. Only open-market-purchase claim proceeds to trial.", color: T_.textMid },
          { date: "Feb 19, 2026", event: "Last-ditch mediation before retired Judge Chapman fails to resolve. Trial set for March.", color: T_.amber },
          { date: "Mar 2-6, 2026", event: "FIVE-DAY BENCH TRIAL before Judge Christopher Lopez on the remanded breach-of-contract claims. Kirpalani (Quinn Emanuel) for excluded lenders; Costa (Gibson Dunn) for participating PTL lenders. Core issue: whether §2.18(c) of the credit agreement was breached by the $734M new first-out debt / $929M TL exchange.", color: T_.red },
          { date: "Mar 25, 2026", event: "CLOSING ARGUMENTS. Damages positions: excluded lenders demand $400M; participating lenders counter at $30M best case, $0 argued. Lopez takes matter under advisement. Decision expected in 80-90 days (mid-to-late July 2026). Lopez encourages continued settlement talks.", color: T_.accent },
          { date: "July 2026 (exp.)", event: "Judge Lopez decision anticipated. Will resolve six years of Serta litigation. Outcome determines whether 'Serta liability' is a real economic cost ($30M-$400M range) or a narrow legal loss with no monetary consequence.", color: T_.blue },
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
   J.CREW GROUP
   ═══════════════════════════════════════════════════════ */

function JCrewCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    lbo: (
      <DetailPanel title="The 2011 LBO — TPG & Leonard Green" onClose={() => setDetail(null)}>
        <p><strong>Nov 2010:</strong> TPG Capital and Leonard Green & Partners announce take-private of J.Crew Group for <strong>$43.50/share</strong> (~$3.0B total value including assumed debt). TPG held ~75%, Leonard Green ~25%.</p>
        <p><strong>Mar 7, 2011:</strong> LBO closes after stockholder approval. Bank of America and Goldman Sachs arranged $1.85B in credit facilities:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Term Loan:</strong> ~$1.2B (senior secured, covenant-lite, LIBOR + spread)</li>
          <li><strong>ABL Revolver:</strong> $250M (5-year, asset-based, undrawn at close)</li>
          <li><strong>Senior Unsecured Bridge:</strong> $600M</li>
          <li><strong>Equity:</strong> ~$1.1B from TPG/Leonard Green</li>
        </ul>
        <p>TPG had a long history with J.Crew — first acquired a majority stake in <strong>1997</strong>, then took the company public via IPO in <strong>2006</strong> ($376M raised). The 2011 deal was a re-take-private.</p>
        <p><strong>Mar 2014:</strong> Refinanced into a new <strong>$1.567B Term Loan B</strong> (LIBOR + 300 bps, covenant-lite). Arranged by BofA and Goldman.</p>
        <p style={{ color: T_.red }}>The thesis was that J.Crew's premium brand, led by CEO Mickey Drexler and Creative Director Jenna Lyons, could support significant leverage. That thesis collapsed when the brand lost cultural relevance while fast fashion and athleisure captured the market.</p>
      </DetailPanel>
    ),
    dividends: (
      <DetailPanel title="Dividend Recapitalization — $766M Extracted" onClose={() => setDetail(null)}>
        <p>Between 2011 and 2019, TPG and Leonard Green extracted <strong>$765.9 million</strong> from J.Crew:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>2012:</strong> $197.5M dividend + $9.1M monitoring fees = $206.6M</li>
          <li><strong>2013:</strong> $484.0M dividend + $9.9M monitoring fees = $493.9M</li>
          <li><strong>2014-2019:</strong> $0 dividends + $57.7M cumulative monitoring fees</li>
        </ul>
        <p>The <strong>$484M dividend in 2013</strong> was funded by issuing <strong>$500M PIK Toggle Notes</strong> at Chinos Intermediate Holdings A (the HoldCo above J.Crew Group). Bookrunners: Goldman, BofA, Morgan Stanley, Wells Fargo.</p>
        <p style={{ color: T_.red }}>The sponsors extracted nearly <strong>70% of their ~$1.1B equity investment</strong> in dividends alone — before the company even began its decline. By the time J.Crew filed Ch.11 in 2020, the sponsors' equity was cancelled for $0, but they'd already pocketed $766M. This is a textbook dividend recap: extracting value via debt-funded distributions while the business bears the leverage burden.</p>
      </DetailPanel>
    ),
    chinosA: (
      <DetailPanel title="Chinos Intermediate Holdings A — PIK Note Issuer" onClose={() => setDetail(null)}>
        <p>Delaware corporation. Intermediate holding entity between Chinos Holdings (ultimate parent) and J.Crew Group (borrower).</p>
        <p><strong>Issuer of the $500M PIK Toggle Notes</strong> (7.75% cash / 8.50% PIK, due May 2019). Proceeds funded the 2013 $484M dividend to TPG/Leonard Green.</p>
        <p>Because J.Crew elected PIK interest (paying in kind rather than cash), the outstanding balance grew to <strong>~$566.5M</strong> by 2017. These notes were <strong>structurally subordinated</strong> to the Term Loan — Chinos A sat above J.Crew Group in the corporate structure and had no direct claim on operating assets.</p>
        <p style={{ color: T_.amber }}>The approaching <strong>May 2019 maturity</strong> of these notes was the catalyst for the IP transfer. J.Crew had no unencumbered assets and no liquidity to refinance $566M in notes. The only option: create value outside the existing collateral pool by moving IP to an unrestricted subsidiary, then use that IP to back new financing to exchange the PIK notes.</p>
        <p>Also served as an unconditional <strong>guarantor of the IPCo Notes</strong> after the 2017 exchange.</p>
      </DetailPanel>
    ),
    jcrewGroup: (
      <DetailPanel title="J.Crew Group, Inc. — The Borrower" onClose={() => setDetail(null)}>
        <p>Delaware corporation (originally incorporated in New York 1988, reincorporated in Delaware 2005). Post-LBO, became a subsidiary of Chinos Intermediate Holdings B.</p>
        <p><strong>The Borrower</strong> under the 2014 Amended and Restated Credit Agreement ($1.567B Term Loan B). Administrative/Collateral Agent: Bank of America, N.A.</p>
        <p><strong>Guarantors of the Term Loan:</strong> Chinos Intermediate Holdings B ("Holdings"), J.Crew Operating Corp., J.Crew Inc., J.Crew International Inc., Madewell Inc., Grace Holmes Inc., H.F.D. No. 55 Inc., and each wholly-owned Material Domestic Subsidiary.</p>
        <p><strong>Collateral:</strong> First-priority security interest in substantially all assets — equity interests of subsidiaries, intellectual property (trademarks, copyrights), inventory, receivables, equipment, up to 65% of foreign sub equity.</p>
        <p style={{ color: T_.red }}>This is the entity whose collateral was stripped when IP was transferred to J.Crew Cayman (a non-loan-party restricted subsidiary) and then to unrestricted subsidiaries. The Term Loan lenders' security interest in the trademarks — their most valuable collateral after inventory — was effectively removed without their consent.</p>
      </DetailPanel>
    ),
    ipTransfer: (
      <DetailPanel title="The IP Transfer — The 'Trap Door' (Dec 2016 – Aug 2017)" onClose={() => setDetail(null)}>
        <p>The defining transaction of the case. J.Crew transferred its most valuable intangible assets — the J.Crew trademarks — through a chain of entities to move them beyond secured lenders' reach:</p>
        <p><strong>Step 1 — Transfer to Cayman Restricted Sub (Dec 5, 2016):</strong></p>
        <p>J.Crew International, Inc. (a <strong>Loan Party</strong> that held the trademarks) assigned an <strong>undivided 72.04% ownership interest</strong> in the Licensed Marks (valued at ~$250M) to <strong>J.Crew International Cayman Limited</strong>, a newly created Cayman Islands restricted subsidiary.</p>
        <p>Because J.Crew Cayman was a <strong>non-U.S. entity</strong>, it was <strong>not required to become a Loan Party</strong> under the credit agreement — no guarantee or pledge obligations. The IP left the collateral pool while staying in the restricted subsidiary group.</p>
        <p><strong>Basket used:</strong> Section 7.02(c) — investments in non-loan-party restricted subs, capped at the greater of <strong>$150M or 4.00% of total assets</strong>, plus Available Amount.</p>
        <p><strong>Step 2 — Transfer from Cayman to Unrestricted Sub (the "Trap Door"):</strong></p>
        <p>J.Crew Cayman transferred the IP to <strong>J.Crew Brand Holdings, LLC</strong> — designated as an <strong>unrestricted subsidiary</strong>. Then cascaded: Brand Holdings → Brand Intermediate → Brand LLC → <strong>J.Crew Domestic Brand, LLC ("IPCo")</strong>.</p>
        <p><strong>Basket used:</strong> Section <strong>7.02(t)</strong> — allowed investments by non-loan-party restricted subs in unrestricted subs if <em>"financed with the proceeds received"</em> from prior baskets. The word <strong>"proceeds" was never defined</strong> in the 100+ uses throughout the credit agreement. J.Crew argued the IP itself was "proceeds" of the initial investment.</p>
        <p><strong>Step 3 — Raise Debt Against the IP:</strong></p>
        <p>IPCo issued <strong>$250M of 13% Senior Secured Notes due 2021</strong> backed by the trademarks. An additional <strong>$97M of new money notes</strong> were sold (3% OID).</p>
        <p><strong>Step 4 — Exchange the PIK Notes:</strong></p>
        <p>$566.5M PIK Toggle Notes exchanged for $250M IPCo Notes + $190M preferred stock + ~15% common equity. <strong>99.85% tendered.</strong></p>
        <p><strong>Jul 2017:</strong> The remaining 27.96% IP interest also transferred.</p>
        <p style={{ color: T_.red }}>The entire chain — Loan Party → non-loan-party restricted sub (Cayman, no guarantee obligation) → unrestricted sub (outside credit group entirely) — was a three-step maneuver that moved ~$347M of IP beyond the reach of $1.5B+ of secured term loan lenders. This is the original "dropdown" that spawned an entire category of protective covenant language.</p>
      </DetailPanel>
    ),
    ipco: (
      <DetailPanel title="IPCo Entities — The Unrestricted Subsidiary Chain" onClose={() => setDetail(null)}>
        <p>A chain of newly created entities designed to hold the transferred IP outside the credit group:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>J.Crew Brand Holdings, LLC</strong> — designated as an <strong>unrestricted subsidiary</strong></li>
          <li><strong>J.Crew Brand Intermediate, LLC</strong> — guarantor of IPCo Notes</li>
          <li><strong>J.Crew Brand, LLC</strong> — <strong>co-issuer</strong> of the 13% Senior Secured Notes due 2021</li>
          <li><strong>J.Crew Brand Corp.</strong> — <strong>co-issuer</strong> of IPCo Notes</li>
          <li><strong>J.Crew Domestic Brand, LLC ("IPCo")</strong> — guarantor; ultimate IP-holding entity</li>
          <li><strong>J.Crew International Brand, LLC</strong> — guarantor</li>
        </ul>
        <p><strong>IPCo Notes:</strong> $249.6M in exchange notes + $97M new money = <strong>~$347M total</strong>. 13% coupon, due 2021. Trustee/Collateral Agent: U.S. Bank National Association. Secured by the transferred J.Crew trademarks.</p>
        <p>IPCo entities <strong>licensed the trademarks back</strong> to J.Crew's operating companies, which paid licensing fees — effectively creating a priority claim on operating cash flows ahead of the Term Loan.</p>
        <p style={{ color: T_.amber }}>In Ch.11, IPCo Noteholders received <strong>23.5% of reorganized equity</strong> (~83.9% recovery on asserted claims). Despite the controversy, these holders — originally PIK noteholders who were facing a potential wipeout — ended up with meaningful recovery because the IP they held as collateral retained significant value.</p>
      </DetailPanel>
    ),
    termLoan: (
      <DetailPanel title="Term Loan B (~$1.337B at Filing)" onClose={() => setDetail(null)}>
        <p><strong>$1.567B Term Loan B</strong> originated Mar 2014 (Amended and Restated Credit Agreement). LIBOR + 300 bps. Covenant-lite (no financial maintenance covenants). Administrative Agent: Bank of America.</p>
        <p>Outstanding at filing: <strong>~$1.337B</strong> (reduced from original through partial repayments, including $150M buyback in the 2017 consent solicitation).</p>
        <p><strong>Collateral:</strong> First-priority lien on substantially all assets of J.Crew Group and guarantor subsidiaries. Originally included the J.Crew trademarks — until the IP transfer stripped them out.</p>
        <p><strong>2017 Consent Solicitation:</strong> ~85-88% of TL lenders consented to amendments ratifying the IP transfer. In exchange: $150M par repayment of term loans + Section 7.02(t) (the trap door) was deleted from the credit agreement. The administrative agent (Wilmington Savings Fund Society) dismissed its litigation. ~12% held out (Eaton Vance, Highland Capital).</p>
        <p style={{ color: T_.amber }}><strong>Ch.11 Recovery:</strong> Term Loan lenders received <strong>76.5% of reorganized equity</strong>. Estimated recovery ~40-60% depending on enterprise valuation (plan valued the reorganized enterprise at ~$1.75B; the UCC argued $2.94B). The fulcrum security. TL lenders became the new owners, with Anchorage Capital, GSO, and Davidson Kempner as the largest holders.</p>
      </DetailPanel>
    ),
    abl: (
      <DetailPanel title="ABL Revolving Credit Facility" onClose={() => setDetail(null)}>
        <p>Originally $250M (increased capacity to ~$350M). Asset-based, secured by inventory and receivables. Co-borrowers: J.Crew Group, Inc. and J.Crew Operating Corp. Agent: Bank of America. Co-documentation agent: Wells Fargo.</p>
        <p>Outstanding at filing: <strong>~$310M drawn</strong> + ~$65M in letters of credit.</p>
        <p style={{ color: T_.green }}><strong>Recovery: 100%.</strong> Paid in full, in cash. ABL facilities are first-priority on current assets (inventory, A/R) and are typically the most senior obligation in retail bankruptcies. Unimpaired.</p>
      </DetailPanel>
    ),
    litigation: (
      <DetailPanel title="Eaton Vance / Highland Litigation" onClose={() => setDetail(null)}>
        <p><strong>Plaintiffs:</strong> Eaton Vance Management (~$100M TL) and Highland Capital Management (~$61M TL) — representing ~12% of term loan lenders who refused to consent to the 2017 amendments.</p>
        <p><strong>Filed:</strong> Jun 22, 2017 in Manhattan Supreme Court (Index No. 654397/2017).</p>
        <p><strong>Claims:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>IP transfer violated the credit agreement</li>
          <li>Trademarks being stripped from collateral = transfer of "all or substantially all" collateral, requiring <strong>unanimous consent</strong></li>
          <li>J.Crew was insolvent at time of transfer (fraudulent conveyance)</li>
          <li>2017 amendments were coercive toward holdouts</li>
        </ul>
        <p><strong>Court Rulings:</strong></p>
        <p>Judge <strong>Shirley Kornreich</strong> (NY Supreme Court) <strong>denied the preliminary injunction</strong>, characterizing the plaintiffs as having filed because they "did not get what they want" when 88% consented.</p>
        <p><strong>Appellate Division (2019):</strong> <em>Eaton Vance Mgt. v. Wilmington Sav. Fund Socy., FSB</em>, 171 A.D.3d 626, 99 N.Y.S.3d 28 — minority lenders <strong>lost their appeal</strong>.</p>
        <p style={{ color: T_.red }}>The holdout lenders were left with their original term loan positions, now secured by collateral that no longer included the most valuable intangible assets. When J.Crew filed Ch.11, they received the same pro-rata share of reorganized equity as consenting lenders — but had no recourse for the collateral value lost to the IP transfer.</p>
      </DetailPanel>
    ),
    madewell: (
      <DetailPanel title="Madewell — The Crown Jewel" onClose={() => setDetail(null)}>
        <p><strong>History:</strong> J.Crew acquired the defunct workwear brand in 2004 and relaunched it in 2006. By FY2019, Madewell was generating <strong>$602M revenue</strong> (14% YoY growth) with positive comparable sales in <strong>41 of 42 quarters</strong>.</p>
        <p><strong>Financials vs. J.Crew brand:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>FY2018: Madewell revenue $529M (+32% YoY), net income $60M</li>
          <li>FY2019: Madewell revenue $602M (+14%), 87% direct-to-consumer</li>
          <li>Meanwhile J.Crew brand: $1.71B revenue (-4%), declining since ~2013 peak of $2.3B</li>
        </ul>
        <p><strong>IPO Plan:</strong> S-1 filed Oct 2019 to spin off Madewell as a separate public company. The IPO proceeds were intended to pay down J.Crew's debt. <strong>Pulled Mar 2, 2020</strong> due to COVID market volatility and lack of investor conviction.</p>
        <p>Madewell was a <strong>guarantor</strong> of the Term Loan (not borrower). In Ch.11, Madewell remained part of J.Crew Group — no spinoff or separate IPO.</p>
        <p style={{ color: T_.amber }}>Madewell was simultaneously J.Crew's greatest asset and most frustrating missed opportunity. Had the IPO succeeded pre-COVID, it could have generated ~$800M-$1B in proceeds to deleverage. Instead, the pandemic killed the IPO and pushed the entire group into Ch.11.</p>
      </DetailPanel>
    ),
    planTreatment: (
      <DetailPanel title="Chapter 11 Plan Treatment — Class Recoveries" onClose={() => setDetail(null)}>
        <p>Pre-arranged plan. Confirmed <strong>Aug 25, 2020</strong> by Judge Keith Phillips (E.D. Va.). Emerged <strong>Sep 10, 2020</strong> — ~4 months in bankruptcy.</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Class</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Treatment</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Recovery</th>
          </tr></thead>
          <tbody>
            {[
              { cls: "ABL Claims (~$310M)", treat: "Paid in full, cash", rec: "100%", c: T_.green },
              { cls: "DIP Claims ($400M)", treat: "Converted to exit term loans (dollar-for-dollar)", rec: "100%", c: T_.green },
              { cls: "Term Loan (~$1,337M)", treat: "76.5% of reorganized equity", rec: "~40-60%", c: T_.amber },
              { cls: "IPCo Notes (~$347M)", treat: "23.5% of reorganized equity", rec: "~83.9%", c: T_.blue },
              { cls: "Trade Unsecured (~$320M pool)", treat: "$71M for trade (50% if signed new agreements); $6M other", rec: "~22%", c: T_.red },
              { cls: "Equity (TPG/Leonard Green)", treat: "Cancelled, zero recovery", rec: "0%", c: T_.red },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.cls}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.treat}</td>
                <td style={{ padding: "6px 8px", color: r.c, fontWeight: 600, textAlign: "right" }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: T_.amber }}><strong>Exit Financing:</strong> $400M ABL (BofA, due 2025) + $400M Exit Term Loan (Anchorage/GSO/Davidson Kempner, due 2027). Over <strong>$1.6B of pre-petition debt eliminated</strong> through equitization.</p>
        <p><strong>New Ownership:</strong> Anchorage Capital Group (majority), GSO Capital Partners (Blackstone), Davidson Kempner — all former secured lenders who converted debt to equity.</p>
        <p><strong>UCC Objection:</strong> The UCC argued the company was worth $2.94B (vs. the plan's $1.75B valuation), and that secured lenders were over-allocated. They negotiated the unsecured pool up from $3M to ~$77M total.</p>
      </DetailPanel>
    ),
    postEmergence: (
      <DetailPanel title="Post-Emergence: 2020-2024 Recovery Arc" onClose={() => setDetail(null)}>
        <p><strong>Emergence:</strong> Sep 10, 2020. First major national retailer to emerge from COVID-era bankruptcy.</p>
        <p><strong>Store Count at Emergence:</strong> 170 J.Crew retail + 170 J.Crew Factory + 142 Madewell. Closed all 6 UK stores.</p>
        <p><strong>Leadership Turmoil Continued:</strong> Jan Singer (CEO, appointed Jan 2020) departed Nov 2020 after &lt;10 months. <strong>Libby Wadle</strong> (Madewell CEO) named CEO of J.Crew Group.</p>
        <p><strong>IP Resolution:</strong> The transferred IP was reunified under the reorganized corporate structure. The IP controversy was resolved through equitizing both TL and IPCo noteholders into the same equity pool.</p>
        <p><strong>Madewell IPO:</strong> Never revisited. Remains a wholly-owned subsidiary. The Oct 2019 Form S-1 was formally withdrawn.</p>
        <p><strong>2021-2024 Recovery:</strong> Significant deleveraging and earnings recovery on the back of strong consumer demand. In Feb/Mar 2022, S&amp;P and Moody's upgraded issuer ratings to B and B2 respectively. Libby Wadle quoted in NYT on recapturing full-price customers and boosting AOV.</p>
        <p><strong>Sep 2024 Refinancing (issuing entity: <span style={{color: T_.amber}}>Chinos Intermediate 2 LLC</span>):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>$450M TLB due 2031</strong> led by Goldman Sachs</li>
          <li>Priced at <strong>S+600 bps @ 98.25 OID</strong> (tightened from talk of S+625 @ 98), 0% floor — Moody's assigned B2</li>
          <li>~350 bps cheaper than the 7.50% exit TLB due 2027 it replaced</li>
          <li>ABL extended 5 years alongside</li>
          <li>Deal metrics: <strong>LTM Q2 2024 revenue $2.719B</strong>, pro-forma Adjusted EBITDA <strong>$280M</strong>, net leverage <strong>1.7x</strong></li>
          <li>New loan docs included a <strong>"J.Crew blocker"</strong> provision — the company that created the loophole now has its own protective covenant</li>
          <li>J.Crew = ~40% of sales, Madewell and Factory ~30% each</li>
        </ul>
        <p style={{ color: T_.green }}>The 2024 refi appeared to validate the restructuring thesis. But by mid-2025, the narrative cracked — see the "2025-2026 Re-Deterioration" panel.</p>
      </DetailPanel>
    ),
    reDeterioration: (
      <DetailPanel title="2025-2026 Re-Deterioration — Back On Distressed Watchlists" onClose={() => setDetail(null)}>
        <p style={{ color: T_.red }}>The 2024 refinancing narrative unwound rapidly in 2025. Four rating downgrades in six months, debt/EBITDA expansion from 3.2x → 4.8x, and the term loan trading at distressed levels by year-end. J.Crew is back on distressed watchlists — within 18 months of the Goldman-led refi.</p>
        <p><strong>Rating trajectory (2025):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Jun 4, 2025:</strong> Moody's cuts CFR <strong>B2 → B3</strong></li>
          <li><strong>Jul 17, 2025:</strong> S&amp;P cuts <strong>B → B-</strong> (weak demand, FOCF deficit)</li>
          <li><strong>Dec 15, 2025:</strong> Moody's cuts CFR <strong>B3 → Caa1</strong>; PDR to Caa1-PD; TLB rating to Caa2 from B3. Outlook stable.</li>
          <li><strong>Dec 18, 2025:</strong> S&amp;P cuts <strong>B- → CCC+</strong> on FOCF deficit; Outlook stable.</li>
        </ul>
        <p><strong>Moody's Dec 2025 deterioration metrics:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Debt/EBITDA: 4.8x</strong> projected FYE 2025 (from 3.2x FYE 2024) — 50% expansion in one year</li>
          <li><strong>EBITA/Interest: 0.5x</strong> (from 1.3x) — unable to cover interest organically</li>
          <li>Tariff costs from administration tariff regime</li>
          <li>Capital-intensive store-growth strategy during a difficult operating environment</li>
          <li>Negative free cash flow</li>
          <li>Higher ABL balances reducing financial flexibility</li>
        </ul>
        <p><strong>S&amp;P Dec 2025 operating data:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Q3'25 comparable sales -8.2%</strong></li>
          <li>FOCF deficit continuing in 2026 expected</li>
          <li>Aggressive new store opening plan is compounding the cash burn</li>
          <li>Margin compression from promotional environment</li>
        </ul>
        <p><strong>Trading levels (Octus private-side analysis):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Jul 17, 2025: TL bid <strong>82.5</strong></li>
          <li>Sep 22, 2025: TL bid <strong>87.625</strong> (brief recovery)</li>
          <li><strong>Dec 3, 2025: TL bid 80</strong> — distressed territory</li>
          <li>From 98.25 OID at issue → 80 cents in ~15 months</li>
        </ul>
        <p><strong>Leadership churn:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Dec 2024:</strong> Julia Collier named CMO</li>
          <li><strong>Oct 2025:</strong> New HR Chief hired from LVMH</li>
          <li><strong>Feb 18, 2026:</strong> <strong>Brendon Babenzien exits J.Crew</strong> — the creative director hired from Noah post-emergence as the brand revitalizer. Another creative-side exit in a brand whose thesis has always depended on creative leadership (Drexler/Lyons 2017, Babenzien 2026).</li>
          <li>Adrienne (Madewell Brand President) exited after 2 years</li>
          <li>Head of Merchandising moved from Madewell to J.Crew</li>
        </ul>
        <p><strong>Competitive/strategic issues (Third Bridge expert calls Sep 2025 &amp; Jan 2026):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Quality dip</strong> on knitwear/cashmere — brand damage that hasn't fully recovered</li>
          <li><strong>Madewell/J.Crew cannibalization on denim</strong> — both priced ~$125, confusing customers</li>
          <li><strong>Quince</strong> at lower price points stealing share</li>
          <li>Madewell "lost its way" post-COVID swinging between Gen Z and millennial targeting</li>
          <li>Factory channel cannibalizing mainline where store geography overlaps</li>
          <li>Tariff pass-through eating margin</li>
          <li>Inconsistent sizing driving return rates online</li>
        </ul>
        <p style={{ color: T_.amber }}><strong>The question now:</strong> does J.Crew — the company that invented the drop-down playbook — re-enter the LME arena as a distressed name? The 2024 Goldman loan explicitly included a "J.Crew blocker" in its own documentation, so the original maneuver is foreclosed against itself. But uptier/Serta-style moves remain available, and the capital structure now has a meaningful distressed-credit investor base from the 80-cent trading.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Sources: S&amp;P Ratings Alerts (Jul/Dec 2025), Moody's Ratings actions (Jun/Dec 2025), Octus Private Company Analysis (Jul/Sep/Dec 2025), 9fin "J. Crew tries on new debt" (Sep 13, 2024), Third Bridge expert transcripts (Sep 8, 2025 / Jan 12, 2026). <strong>CreditSights: no coverage</strong> — J.Crew is below CS/CR/LFI coverage threshold as a private non-reporter.</em></p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Premium apparel retailer (J.Crew, Madewell, Factory). <span style={{ color: T_.purple }}>TPG + Leonard Green</span> took the company private in 2011 for ~$3B, then extracted <span style={{ color: T_.red }}>$766M in dividends and fees</span> — funding the $484M dividend with <span style={{ color: T_.red }}>$500M PIK Toggle Notes</span>. Facing a PIK maturity wall, J.Crew executed the original <span style={{ color: T_.accent }}>"trap door" IP transfer</span> — moving trademarks to unrestricted subsidiaries to raise new secured debt, stripping collateral from $1.5B+ of term loan lenders. This maneuver spawned the market-standard <span style={{ color: T_.accent }}>"J.Crew Blocker"</span> covenant provision and became the foundational precedent for Envision, Serta, and every modern LME. After a <span style={{ color: T_.green }}>2020-2024 recovery</span> and a Sep 2024 Goldman-led refi, the thesis <span style={{ color: T_.red }}>cracked in 2025</span>: 4 rating downgrades in 6 months (B/B2 → <strong>CCC+/Caa1</strong>), Q3'25 comps -8.2%, debt/EBITDA 3.2x → 4.8x, TL trading at 80 by Dec 2025. Back on distressed watchlists 18 months after the refi.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Total Debt", v: "~$1.7B", c: T_.red },
            { l: "Filed", v: "May 4, 2020", c: T_.red },
            { l: "Emerged", v: "Sep 10, 2020", c: T_.green },
            { l: "Debt Eliminated", v: ">$1.6B", c: T_.green },
            { l: "Time in Ch.11", v: "~4 months", c: T_.textMid },
            { l: "Fulcrum", v: "Term Loan B", c: T_.blue },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>Post-2017 IP transfer, at filing. Click any entity or tranche for details. Case 20-32181, E.D. Va., Judge Phillips.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group / Loan Parties</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.red}50`, background: `${T_.red}08`, display: "inline-block" }} /><span style={{ color: T_.red }}>Unrestricted / Outside Credit Group</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.amber}50`, background: `${T_.amber}08`, display: "inline-block" }} /><span style={{ color: T_.amber }}>Non-Loan Party Restricted Sub</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: Sponsors */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="TPG Capital (~75%) + Leonard Green (~25%)"
            sub="PE Sponsors · LBO Mar 2011 · ~$1.1B equity contributed"
            color={T_.purple}
            badges={[{ text: "EQUITY CANCELLED — $0", color: T_.red }, { text: "EXTRACTED $766M", color: T_.amber }]}
            onClick={() => toggle("lbo")} selected={detail === "lbo"}
            width={420}
          />
        </div>

        <VLineLabel label="100% equity (via merger sub)" color={T_.purple} />

        {/* ROW 2: Chinos Holdings */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Chinos Holdings, Inc."
            sub="Ultimate Parent · Delaware · Acquisition vehicle"
            color={T_.textDim}
            badges={[{ text: "HOLDCO", color: T_.textGhost }]}
            width={340}
          />
        </div>

        <VLineLabel label="100% equity" />

        {/* ROW 3: Chinos A — PIK Notes */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Chinos Intermediate Holdings A, Inc."
            sub="Intermediate HoldCo · PIK Note Issuer · Guarantor of IPCo Notes"
            color={T_.red}
            badges={[{ text: "PIK NOTES ISSUER", color: T_.red }]}
            debt={[{ name: "7.75%/8.50% PIK Toggle Notes (due 2019)", amount: "~$566.5M", color: T_.red }]}
            onClick={() => toggle("chinosA")} selected={detail === "chinosA"}
            width={420}
          />
        </div>

        <VLineLabel label="↓ Chinos Inter → Chinos B ('Holdings')" color={T_.textGhost} />

        {/* ROW 4: J.Crew Group — The Borrower */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="J.Crew Group, Inc."
            sub="Operating HoldCo · Delaware · Borrower under Credit Agreement"
            color={T_.blue}
            badges={[
              { text: "BORROWER", color: T_.blue },
              { text: "RESTRICTED SUB", color: T_.green },
            ]}
            debt={[
              { name: "ABL Revolver (BofA)", amount: "~$310M drawn", color: T_.green },
              { name: "Term Loan B (LIBOR+300, cov-lite)", amount: "~$1,337M", color: T_.blue },
            ]}
            onClick={() => toggle("jcrewGroup")} selected={detail === "jcrewGroup"}
            width={440}
          />
        </div>

        {/* Guarantee annotations */}
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: 9, color: T_.green }}>▲ Guarantors: OpCo, Madewell, J.Crew Int'l, J.Crew Inc., others</span>
            <span style={{ fontSize: 9, color: T_.textGhost }}>▲ Collateral Agent: Bank of America</span>
          </div>
        </div>

        <VLine h={14} />

        {/* ROW 5: Operating subs + IPCo side-by-side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 0, borderTop: `2px solid ${T_.border}` }} />

          {/* LEFT: Operating entities — RESTRICTED GROUP */}
          <div>
            <VLine h={14} />
            <div style={{ border: `2px solid ${T_.green}30`, borderRadius: 12, padding: "12px 10px 10px", background: `${T_.green}04`, position: "relative" }}>
              <div style={{ position: "absolute", top: -10, left: 10, background: T_.bgPanel, padding: "0 6px" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px" }}>Restricted Group — Loan Parties</span>
              </div>
              <Box
                label="Operating Subsidiaries"
                sub="J.Crew Operating Corp · J.Crew Inc · J.Crew Int'l"
                color={T_.emerald}
                badges={[
                  { text: "GUARANTORS", color: T_.green },
                  { text: "RESTRICTED SUBS", color: T_.green },
                  { text: "REVENUE SOURCE", color: T_.emerald },
                ]}
              />
              <VLine h={10} />
              <Box
                label="Madewell Inc."
                sub="$602M rev (FY2019) · 142 stores · IPO pulled Mar 2020"
                color={T_.emerald}
                badges={[
                  { text: "GUARANTOR", color: T_.green },
                  { text: "RESTRICTED SUB", color: T_.green },
                  { text: "CROWN JEWEL", color: T_.accent },
                ]}
                onClick={() => toggle("madewell")} selected={detail === "madewell"}
              />
            </div>
          </div>

          {/* RIGHT: IPCo chain — UNRESTRICTED */}
          <div>
            <VLine h={14} />
            <div style={{ border: `2px dashed ${T_.red}40`, borderRadius: 10, padding: 2, background: `${T_.red}04` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", padding: "4px 0 2px" }}>Unrestricted Subsidiary — Outside Credit Group (Dec 2016)</div>
              <Box
                label="IPCo Entity Chain"
                sub="Brand Holdings → Brand Intermediate → Brand LLC → Domestic Brand LLC"
                color={T_.red}
                badges={[
                  { text: "UNRESTRICTED SUB", color: T_.red },
                  { text: "TRANSFERRED IP", color: T_.red },
                  { text: "OUTSIDE CREDIT GROUP", color: T_.red },
                ]}
                debt={[
                  { name: "13% Sr Secured Notes due 2021 (IPCo Notes)", amount: "~$347M", color: T_.amber },
                ]}
                onClick={() => toggle("ipco")} selected={detail === "ipco"}
              />
            </div>
            <VLine h={10} />
            <div style={{ fontSize: 9, color: T_.amber, textAlign: "center", padding: "0 4px" }}>
              J.Crew Cayman — <strong>Non-Loan Party Restricted Sub</strong> (the intermediary that enabled the transfer)
            </div>
          </div>
        </div>

        {/* IP license-back arrow */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div onClick={() => toggle("ipTransfer")} style={{ fontSize: 10, color: T_.accent, background: `${T_.accent}10`, padding: "4px 14px", borderRadius: 6, border: `1px dashed ${T_.accent}30`, cursor: "pointer" }}>
            ↔ IPCo licenses trademarks back to OpCo · licensing fees create priority cash claim · click for full IP transfer mechanics
          </div>
        </div>
      </div>

      {/* ── Detail buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "dividends", label: "Dividend Recap", color: T_.purple, sub: "$766M extracted · $500M PIK" },
          { k: "planTreatment", label: "Plan Treatment", color: T_.blue, sub: "TL → 76.5% equity · IPCo → 23.5%" },
          { k: "postEmergence", label: "Post-Emergence 2020-24", color: T_.green, sub: "Recovered · $450M refi Sep 2024" },
          { k: "reDeterioration", label: "2025-26 Re-Deterioration", color: T_.red, sub: "Caa1/CCC+ · TL bid 80 · distressed" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* Additional detail buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        <div onClick={() => toggle("termLoan")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "termLoan" ? `${T_.blue}12` : T_.bgInput,
          border: `1px solid ${detail === "termLoan" ? T_.blue : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue }}>Term Loan Detail</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>$1.567B → ~$1.337M · 88% consented · 12% held out</div>
        </div>
        <div onClick={() => toggle("litigation")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "litigation" ? `${T_.red}12` : T_.bgInput,
          border: `1px solid ${detail === "litigation" ? T_.red : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>Eaton Vance / Highland Litigation</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>Minority holdouts sued · injunction denied · lost appeal 2019</div>
        </div>
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "The 'Trap Door' — Section 7.02(t)", color: T_.accent, summary: "A credit agreement loophole that allowed assets to cascade from loan parties to unrestricted subsidiaries in two hops.", detail: "The 2014 credit agreement had three investment baskets that, combined, created a pathway: (1) Section 7.02(c) — investments in non-loan-party restricted subs up to $150M or 4% of assets. (2) Section 7.02(n) — general investment basket up to $100M or 3.25% of assets. (3) Section 7.02(t) — the 'trap door' — allowing non-loan-party restricted subs to invest in unrestricted subs using 'proceeds received' from prior baskets. Because 'proceeds' was never defined in the 100+ uses throughout the document, J.Crew argued the IP assets themselves constituted 'proceeds.' This created a daisy chain: Loan Party → non-loan-party restricted sub (no guarantee required) → unrestricted sub (outside credit group entirely). The trap door was later deleted as part of the 2017 settlement, but the damage was done." },
          { label: "The 'J.Crew Blocker' — Market Response", color: T_.green, summary: "Post-2017, credit agreements now include specific provisions preventing IP/asset transfers to unrestricted subsidiaries.", detail: "The J.Crew maneuver triggered a fundamental rewrite of leveraged loan documentation. 'J.Crew Blockers' typically include: (1) IP transfer restrictions — expressly prohibiting transfer or exclusive licensing of material IP to unrestricted subs. (2) Trap door closure — preventing non-loan-party restricted subs from investing in unrestricted subs using loan-party-derived proceeds. (3) Designation restrictions — preventing redesignation of IP-holding subs as unrestricted. (4) 'Proceeds' definition — requiring investment baskets only be used for cash, not in-kind asset transfers. (5) Anti-leakage provisions — EBITDA/asset caps on unrestricted subs. This became the first generation of LME blockers, followed by Envision blockers (enhanced dropdown), Serta blockers (uptier protection), and current catch-all LME blockers." },
          { label: "Dividend Recapitalization — PE Extraction", color: T_.purple, summary: "Sponsors extracted $766M from a company that filed bankruptcy 7 years later — debt-funded distributions in action.", detail: "In 2013, TPG/Leonard Green had Chinos Intermediate Holdings A issue $500M PIK Toggle Notes (7.75% cash / 8.50% PIK) to fund a $484M dividend. Combined with a $197.5M 2012 dividend and $84M in cumulative monitoring fees, they extracted $766M — nearly 70% of their original $1.1B equity investment — before J.Crew's operations began declining. The PIK notes matured in 2019 and had grown to $566.5M due to PIK interest accrual. This approaching maturity wall, combined with no unencumbered assets to refinance, was the direct catalyst for the IP transfer. This is the standard PE distress pattern: (1) LBO with leveraged financing, (2) dividend recap while business is stable, (3) business declines under leverage weight, (4) sponsors have already extracted most of their capital, (5) equity cancelled in restructuring while sponsors keep prior distributions." },
          { label: "Structural Subordination of PIK Notes", color: T_.red, summary: "PIK Notes at Chinos A were structurally junior to the Term Loan at J.Crew Group — different entity, no claim on operating assets.", detail: "The PIK Toggle Notes were issued by Chinos Intermediate Holdings A — an entity ABOVE J.Crew Group in the corporate structure. Chinos A had no operations, no revenue, and no direct claim on J.Crew's operating assets. Its only asset was equity in the entities below it. The Term Loan was at J.Crew Group — the actual operating holding company with a first-priority lien on substantially all assets. This meant PIK noteholders were structurally subordinated: they could only recover after all of J.Crew Group's creditors (ABL, Term Loan, trade) were satisfied. Facing a $566M maturity with zero access to operating cash flows, the IP transfer was their only option — move value to a new entity where they could create a direct secured claim." },
          { label: "Covenant-Lite — The Double-Edged Sword", color: T_.blue, summary: "The $1.567B Term Loan had no financial maintenance covenants, giving J.Crew maximum flexibility — including flexibility to transfer IP.", detail: "Covenant-lite (cov-lite) loans lack financial maintenance covenants (e.g., leverage ratios, interest coverage tests) that would typically trigger defaults as performance deteriorates. This gives borrowers breathing room during downturns. But it also means lenders have fewer early warning triggers and limited ability to intervene. In J.Crew's case, cov-lite meant lenders couldn't force the company to the negotiating table as revenue declined from $2.5B to $2.0B. The investment baskets in Section 7.02 were the primary restrictions — and they proved porous. After J.Crew, the market recognized that cov-lite doesn't just affect financial triggers; it also weakens the covenant architecture that protects collateral." },
          { label: "HoldCo vs. OpCo — Where Debt Sits Matters", color: T_.amber, summary: "PIK Notes at the HoldCo level could not reach OpCo assets directly. The corporate structure created winners and losers.", detail: "J.Crew illustrates how corporate structure determines creditor outcomes: (1) ABL at J.Crew Group/OpCo = paid in full (first-priority on current assets). (2) Term Loan at J.Crew Group = fulcrum security, received 76.5% equity (~40-60% recovery). (3) PIK Notes at Chinos A (HoldCo) = structurally subordinated, exchanged at massive discount for IPCo Notes. (4) Equity at Chinos Holdings = $0. Each level up from the operating entity = lower priority. The IP transfer was essentially an arbitrage of this structure: moving value from the OpCo level (where TL lenders had liens) to an unrestricted sub (where PIK noteholders could create new liens)." },
          { label: "First to File, First to Define — COVID Retail Bankruptcy", color: T_.emerald, summary: "J.Crew was the first major retailer to file in the COVID pandemic — setting the template for retail restructurings.", detail: "Filing on May 4, 2020 — barely two months after COVID shuttered retail — J.Crew was the first major national retailer to enter Chapter 11 in the pandemic era. The pre-arranged deal (TSA with 71% of TL holders and 78% of IPCo noteholders) allowed a 4-month process, emerging Sep 10, 2020. The DIP ($400M from Anchorage/GSO/Davidson Kempner) converted to exit financing, and $1.6B+ of debt was eliminated through equitization. This speed-to-emergence became the model for subsequent retail filings (Neiman Marcus, Brooks Brothers, J.C. Penney), demonstrating that pre-arranged deals with aligned creditor groups could navigate pandemic uncertainty." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "1983", event: "J.Crew founded as a catalog retailer. Mickey Drexler joins as CEO in 2003 and transforms the brand.", color: T_.textMid },
          { date: "Oct 1997", event: "TPG Capital acquires controlling stake in J.Crew. Takes company public via IPO in Jun 2006 (~$402.8M net proceeds; 21.62M shares at $20).", color: T_.purple },
          { date: "Mar 7, 2011", event: "TPG + Leonard Green close take-private LBO at $43.50/share (~$3B). $1.0B senior secured Term Loan + $250M ABL + $600M sr unsecured bridge = $1.85B credit facilities + ~$1.1B equity. BofA/Goldman arrangers.", color: T_.purple },
          { date: "2012-13", event: "Sponsors extract $681.5M in dividends. $484M (2013) funded by $500M PIK Toggle Notes at Chinos Intermediate Holdings A.", color: T_.red },
          { date: "Mar 2014", event: "Refinanced to $1.567B Term Loan B (LIBOR+300, covenant-lite). BofA and Goldman arrangers.", color: T_.textMid },
          { date: "2014-16", event: "J.Crew brand declines: fast fashion, athleisure competition, trendier/pricier strategy alienates core customers. Rev: $2.5B peak → declining.", color: T_.red },
          { date: "Dec 2016", event: "THE IP TRANSFER: 72.04% of J.Crew trademarks ($250M) transferred from J.Crew Int'l → J.Crew Cayman (restricted, non-loan-party) → J.Crew Brand Holdings (unrestricted). Exploits Sections 7.02(c) and 7.02(t) 'trap door.'", color: T_.accent },
          { date: "Apr 2017", event: "Jenna Lyons (Creative Director) departs. Jun: Mickey Drexler steps down as CEO after 14 years.", color: T_.red },
          { date: "Jun 2017", event: "Eaton Vance/Highland Capital file suit (12% holdout lenders). J.Crew files preemptive declaratory judgment. Court denies injunction.", color: T_.amber },
          { date: "Aug 2017", event: "EXCHANGE CLOSES: $566.5M PIK Notes → $250M IPCo Notes (13%, secured by IP) + $190M preferred + ~15% equity. 99.85% tendered. $97M new money IPCo notes. $150M TL buyback. Section 7.02(t) trap door deleted.", color: T_.amber },
          { date: "Nov 2018", event: "CEO James Brett resigns after 16 months. Company operates without permanent CEO for 14+ months.", color: T_.red },
          { date: "2019", event: "Appellate Division rules against minority lenders (Eaton Vance v. Wilmington). J.Crew brand rev: $1.71B (-26% from peak). Madewell rev: $602M (+14%).", color: T_.amber },
          { date: "Oct 2019", event: "Madewell IPO S-1 filed with SEC. Proceeds intended for debt paydown.", color: T_.blue },
          { date: "Mar 2, 2020", event: "Madewell IPO pulled. COVID shutters all stores. TSA extended with ad hoc creditor group.", color: T_.red },
          { date: "May 4, 2020", event: "J.CREW FILES CH.11 (E.D. Va., Case 20-32181, Judge Phillips). 18 debtor entities. First major retailer to file in COVID. $400M DIP from Anchorage/GSO/Davidson Kempner.", color: T_.red },
          { date: "Aug 25, 2020", event: "Plan confirmed. ~$1.65B secured debt → equity. TL → 76.5% equity. IPCo → 23.5%. Unsecured negotiated from $3M to $77M. Sponsors → $0.", color: T_.amber },
          { date: "Sep 10, 2020", event: "EMERGENCE. ~4 months in Ch.11. >$1.6B debt eliminated. Exit ABL ($400M) + Exit TL ($400M). Anchorage Capital = majority owner.", color: T_.green },
          { date: "Feb/Mar 2022", event: "S&P upgrades to B; Moody's upgrades to B2 on deleveraging and earnings recovery.", color: T_.green },
          { date: "Sep 18, 2024", event: "J.Crew returns to loan market: $450M TLB due 2031 led by Goldman. Priced at S+600 @ 98.25 (tightened from S+625 @ 98 talk). Replaced $400M 7.50% exit TLB due 2027 — ~350bps cheaper. LTM Q2'24 rev $2.719B, Adj EBITDA $280M, net leverage 1.7x. Issuing entity: Chinos Intermediate 2 LLC. New docs include a 'J.Crew blocker.'", color: T_.green },
          { date: "Dec 2024", event: "Julia Collier named CMO.", color: T_.textMid },
          { date: "Jun 4, 2025", event: "Moody's cuts CFR B2 → B3. First sign of post-refi deterioration.", color: T_.amber },
          { date: "Jul 17, 2025", event: "S&P cuts B → B- on weak demand + FOCF deficit. Octus private analysis: TL bid 82.5.", color: T_.amber },
          { date: "Sep 22, 2025", event: "Octus Q2'25 analysis: TL bid 87.625 (brief recovery).", color: T_.textMid },
          { date: "Oct 2025", event: "New HR Chief hired from LVMH. C-suite churn continues.", color: T_.textMid },
          { date: "Dec 3, 2025", event: "Octus Q3'25 analysis: TL bid 80 — distressed territory. From 98.25 OID at issue → 80 in ~15 months.", color: T_.red },
          { date: "Dec 15, 2025", event: "Moody's cuts B3 → Caa1 (CFR), Caa1-PD (PDR), TLB to Caa2. Debt/EBITDA projected 4.8x FYE25 (from 3.2x FYE24). EBITA/Interest 0.5x (from 1.3x). Tariff cost + capex-heavy store expansion + negative FCF.", color: T_.red },
          { date: "Dec 18, 2025", event: "S&P cuts B- → CCC+. Q3'25 comp sales -8.2%. FOCF deficit expected to continue in 2026.", color: T_.red },
          { date: "Feb 18, 2026", event: "BRENDON BABENZIEN EXITS J.CREW — the creative director hired from Noah post-emergence as the brand revitalizer. Another creative-side exit in a brand whose thesis has always depended on creative leadership (Drexler/Lyons 2017, Babenzien 2026).", color: T_.red },
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
   DIEBOLD NIXDORF
   ═══════════════════════════════════════════════════════ */

function DieboldNixdorfCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    wincorMerger: (
      <DetailPanel title="The Wincor Nixdorf Acquisition (2016)" onClose={() => setDetail(null)}>
        <p><strong>Nov 2015:</strong> Diebold announces acquisition of <strong>Wincor Nixdorf AG</strong>, a German ATM/POS manufacturer (f/k/a Siemens Nixdorf). Completed <strong>Aug 15, 2016</strong> for ~$1.8B in cash and stock.</p>
        <p><strong>Consideration:</strong> EUR 38.98 cash + 0.434 Diebold shares per Wincor share. Total: ~EUR 892M (~$1B) cash + ~9.9M newly issued Diebold shares.</p>
        <p><strong>Rationale:</strong> Combined entity would control ~35% of global ATM market. Expected ~$160M in annual cost synergies. Pro forma net debt/EBITDA targeted &lt;4x at close, &lt;3x by year three.</p>
        <p><strong>Financing:</strong> Cash portion funded from existing credit agreement + $400M aggregate principal of new <strong>8.50% Senior Notes due 2024</strong>.</p>
        <p style={{ color: T_.red }}>The thesis failed: integration proved far more difficult than anticipated — delayed systems rollouts, slow order-to-revenue conversion, cost synergies fell short. CEO Andy Mattes stepped down Dec 2017 after dramatically widening the 2017 net loss guidance from $50-75M to $110-125M. Stock fell 23% in one day (Jul 2017).</p>
      </DetailPanel>
    ),
    usParent: (
      <DetailPanel title="Diebold Nixdorf, Incorporated (US Parent)" onClose={() => setDetail(null)}>
        <p>Delaware corporation. Publicly traded on NYSE under <strong>DBD</strong>. Founded 1859 in Canton, Ohio as Diebold Bahmann Safe Company. Listed on NYSE since 1964. 60+ consecutive years of dividend increases as of 2013.</p>
        <p><strong>Borrower</strong> under the senior secured credit facilities. Co-obligor (jointly and severally liable) with the Dutch Holding entity on almost all credit facilities.</p>
        <p>For bankruptcy filing purposes, the US debtor was reorganized as <strong>Diebold Holding Company, LLC</strong> — the lead debtor in the Ch.11 case.</p>
        <p style={{ color: T_.amber }}>Market cap had fallen to ~$146M by late 2022, from $3B+ pre-merger. Revenue declined from $4.6B (2017 peak) to $3.5B (2022). Net loss widened from $78M (2021) to $581M (2022). Negative EBITDA of -$127M in 2022.</p>
      </DetailPanel>
    ),
    dutchHolding: (
      <DetailPanel title="Diebold Nixdorf Dutch Holding B.V." onClose={() => setDetail(null)}>
        <p>Dutch entity incorporated 2017, headquartered in Utrecht, Netherlands. Intermediate holding company for all European operations (12+ subsidiaries across UK and Europe).</p>
        <p><strong>Co-issuer</strong> of the EUR 350M 9.000% Senior Secured Notes due 2025. <strong>Jointly and severally liable</strong> with the US parent under almost all credit facilities.</p>
        <p>Subject to the <strong>WHOA</strong> (Wet Homologatie Onderhands Akkoord — Dutch Scheme of Arrangement) proceeding in the District Court of Amsterdam. The WHOA Plan was contractually interdependent with the Ch.11 Plan — neither could be implemented without the other.</p>
        <p style={{ color: T_.amber }}>The same creditor pool had claims against both US and Dutch entities, but their priority positions differed based on jurisdiction-specific security packages and intercreditor arrangements. All distributions ultimately flowed through the Ch.11 plan waterfall.</p>
      </DetailPanel>
    ),
    superpriority: (
      <DetailPanel title="Superpriority Term Loan ($400M) — Dec 2022 New Money" onClose={() => setDetail(null)}>
        <p>In Dec 2022, Diebold closed a comprehensive recapitalization with key creditors:</p>
        <p><strong>$400M new money superpriority senior secured term loan</strong> — primes all existing debt. Provided by an ad hoc group of existing creditors who signed a Transaction Support Agreement (TSA).</p>
        <p>The TSA was supported by ~78.8% of existing term loan holders, ~59.3% of unsecured 8.50% noteholders, and ~89.7% of secured noteholders.</p>
        <p><strong>Ad hoc group holdings at RSA signing (May 30, 2023):</strong> ~80.4% of the superpriority facility, ~79% of the first lien TL, ~78% of the first lien notes, ~58.3% of the second lien notes. These concentrations enabled the prepack strategy — the same holders who primed themselves in Dec 2022 became the plan backstop in 2023.</p>
        <p style={{ color: T_.amber }}>This was a classic liability management exercise: existing creditors provided new money at the top of the capital structure, subordinating both non-participating creditors and their own existing positions. The new money was necessary to fill a ~$213M liquidity hole and address impending maturities.</p>
      </DetailPanel>
    ),
    abl: (
      <DetailPanel title="ABL Facility (~$250M)" onClose={() => setDetail(null)}>
        <p><strong>Replacement revolving credit facility</strong> arranged by JPMorgan Chase as part of the Dec 2022 recapitalization. Superpriority status alongside the $400M term loan.</p>
        <p>Asset-based — secured by accounts receivable, inventory, and other current assets. Replaced the prior revolver that was approaching maturity.</p>
        <p style={{ color: T_.green }}><strong>Recovery: 100%.</strong> Repaid in full via DIP financing proceeds at the outset of the Ch.11 case.</p>
      </DetailPanel>
    ),
    firstLien: (
      <DetailPanel title="First Lien Secured Claims" onClose={() => setDetail(null)}>
        <p>Multiple tranches of first lien debt, all pari passu:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>First Lien Term Loans:</strong> Extended from original maturities as part of the Dec 2022 refinancing. Existing TL holders exchanged into extended-maturity loans.</li>
          <li><strong>9.375% First Lien Secured Notes due 2025:</strong> ~$700M (issued Jul 2020 at 99.031%). Issued by Diebold Nixdorf, Inc.</li>
          <li><strong>9.000% First Lien Secured Notes due 2025:</strong> ~EUR 350M (issued Jul 2020 at 99.511%). Issued by Diebold Nixdorf Dutch Holding B.V.</li>
        </ul>
        <p>Both note offerings were oversubscribed in Jul 2020. Proceeds repaid all Term Loan A/A-1, ~$194M revolving credit, and extended ~$330M in revolving commitments from Apr 2022 to Jul 2023.</p>
        <p>Secured by substantially all assets of both US and Dutch entities. First priority lien behind only the superpriority facilities.</p>
        <p style={{ color: T_.amber }}><strong>Recovery: ~38%</strong> at TEV midpoint. Received <strong>98% of reorganized equity</strong> (new Diebold shares). Despite being secured, first lien holders were significantly undersecured — valuation evidence showed TEV was insufficient to cover first lien claims in full. Early RSA signers received a 10% participation premium in new shares.</p>
      </DetailPanel>
    ),
    secondLien: (
      <DetailPanel title="Second Lien Notes" onClose={() => setDetail(null)}>
        <p>Created in the Dec 2022 recapitalization when unsecured 8.50% noteholders exchanged into new junior-lien bonds — converting from unsecured to second lien status.</p>
        <p>Participating 8.50% noteholders (~59.3% of the outstanding amount) received new second lien notes with extended maturity as part of the TSA. They gained lien protection they didn't previously have, but behind all first lien and superpriority debt.</p>
        <p style={{ color: T_.amber }}><strong>Recovery: ~4.8%.</strong> Received <strong>2% of reorganized equity</strong> — a voluntary "gift" from first lien holders to secure plan support and avoid litigation. Because first lien holders themselves only recovered ~38%, there was zero residual collateral value for second lien. The 2% equity was pure negotiation currency.</p>
      </DetailPanel>
    ),
    unsecured: (
      <DetailPanel title="2024 Stub Unsecured Notes (8.50% Senior Notes)" onClose={() => setDetail(null)}>
        <p><strong>8.50% Senior Notes due 2024</strong> — original $400M issuance to fund the Wincor Nixdorf acquisition in 2016. Issued by Diebold Nixdorf, Inc.</p>
        <p>In the Dec 2022 recapitalization, participating holders (~59.3%) exchanged into new second lien notes. The remainder (~40.7%) who did not participate were left holding unsecured stub notes with stripped covenants.</p>
        <p><strong>Covenant Stripping:</strong> As part of the TSA, participating holders consented to amend the indenture to remove <strong>substantially all negative covenants</strong> and extend the <strong>interest payment default grace period to the maturity date</strong> — effectively rendering non-participating noteholders unable to enforce remedies even if interest went unpaid.</p>
        <p style={{ color: T_.red }}><strong>Recovery: ~4.8%.</strong> Received a limited cash payment ("gift" from first lien holders). Class 7 <strong>voted to reject</strong> the Ch.11 plan but was <strong>crammed down</strong> under Section 1129. The Feb-May 2023 exchange offer (8.50%/12.50% PIK Toggle + warrants) was overtaken by the Ch.11 filing.</p>
      </DetailPanel>
    ),
    equity: (
      <DetailPanel title="Existing Equity — Total Wipeout" onClose={() => setDetail(null)}>
        <p>All pre-petition common shares (NYSE: DBD, previously also Frankfurt-listed) were <strong>cancelled with zero recovery</strong>.</p>
        <p>Stock had already declined ~79% through 2022 before cancellation. Market cap was ~$146M at the time of the Dec 2022 recapitalization — a fraction of the $3B+ valuation pre-merger.</p>
        <p style={{ color: T_.red }}>Shareholders in Class 8 were <strong>deemed to reject</strong> the plan (no vote required). The company that had paid 60+ consecutive years of dividends delivered a total equity wipeout.</p>
      </DetailPanel>
    ),
    europeanSubs: (
      <DetailPanel title="European Subsidiaries (WHOA Entities)" onClose={() => setDetail(null)}>
        <p><strong>12+ UK and European entities</strong> under Diebold Nixdorf Dutch Holding B.V., including the legacy Wincor Nixdorf operations across Germany, UK, and continental Europe.</p>
        <p>These entities were restructured through the <strong>Dutch WHOA proceeding</strong> (District Court of Amsterdam), not through US Chapter 11. However, their restructuring was contractually linked to the Ch.11 plan.</p>
        <p><strong>WHOA Voting:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Class 1 (First Lien Claims) — Approved</li>
          <li>Class 2 (2023 Stub First Lien TL) — Approved</li>
          <li>Class 3 (Second Lien Notes) — Approved</li>
          <li>Class 4 (2024 Stub Unsecured Notes) — <strong>Rejected</strong></li>
        </ul>
        <p>Dutch Court sanctioned the plan on Aug 2, 2023 — finding the requisite 2/3 majority in at least one "in the money" class. Classes 1-3 voted to approve; Class 4 rejected but was bound.</p>
        <p style={{ color: T_.amber }}><strong>WHOA Stay:</strong> Unlike Ch.11's automatic stay, WHOA does not provide an automatic stay. The Dutch Court granted an ex parte group-wide stay (<em>afkoelingsperiode</em>) on Jun 8, 2023 under <strong>Article 376 of the Dutch Bankruptcy Act (Faillissementswet / Fw)</strong>, extending it to non-debtor group companies — a significant expansion of WHOA stay powers.</p>
        <p><strong>Ferdinand Hengst</strong> was appointed as court observer to confirm joint creditor interests were protected across all three proceedings (Ch.11 + WHOA + Ch.15).</p>
      </DetailPanel>
    ),
    dip: (
      <DetailPanel title="DIP Financing — $1.25B" onClose={() => setDetail(null)}>
        <p><strong>$1.25 billion</strong> debtor-in-possession term loan facility, backstopped by the ad hoc group of creditors. Approved on interim basis at the first-day hearing on Jun 2, 2023.</p>
        <p><strong>Tranche Release:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Interim order ($517M):</strong> Released at first-day hearing — enough to repay superpriority TL + ABL and fund initial operations.</li>
          <li><strong>Final order ($733M):</strong> Remaining tranche unlocked on final DIP hearing after adequate protection package finalized.</li>
        </ul>
        <p><strong>Use of Proceeds:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Repay in full the $400M superpriority term loan</li>
          <li>Repay in full the ~$250M ABL facility</li>
          <li>Cover reorganization costs and professional fees</li>
          <li>Make adequate protection payments to secured creditors</li>
          <li>Fund working capital during restructuring</li>
        </ul>
        <p><strong>Conversion Feature:</strong> Upon plan confirmation, the DIP facility converted directly into a <strong>$1.25B exit term loan</strong>. If the plan was not confirmed, the DIP would become immediately due — strong incentive for swift resolution.</p>
        <p style={{ color: T_.green }}>The ad hoc group that backstopped the DIP and signed the RSA early received both repayment priority and a participation premium (10% of new shares) — positioning first lien holders as gatekeepers of the restructuring.</p>
      </DetailPanel>
    ),
    crossBorder: (
      <DetailPanel title="Three-Pronged Cross-Border Structure (First-of-Its-Kind)" onClose={() => setDetail(null)}>
        <p>Diebold Nixdorf's restructuring pioneered a <strong>first-ever dual US-Dutch proceeding</strong>:</p>
        <p><strong>1. US Chapter 11:</strong> Prepackaged plan for Diebold Holding Company, LLC and 9 US/Canadian affiliates (S.D. Tex., Houston, Case 23-90602, <strong>Judge David R. Jones</strong>). Filed Jun 1, 2023. Judge Jones presided through confirmation and emergence; Marvin Isgur was assigned residual post-emergence matters only after Jones resigned in Oct 2023 (Jackson Walker ethics scandal). <em>Diebold was unaffected by the disgorgement fallout that hit other Jones-era cases because Sullivan &amp; Cromwell — not Jackson Walker — was debtors' counsel.</em></p>
        <p><strong>2. Dutch WHOA:</strong> Scheme of arrangement for Diebold Nixdorf Dutch Holding B.V. and 12 European affiliates (District Court of Amsterdam). Sanctioned Aug 2, 2023.</p>
        <p><strong>3. US Chapter 15:</strong> Recognition of the Dutch WHOA as a "foreign main proceeding" on <strong>Jul 12, 2023</strong>. Supplemental order giving the sanctioned WHOA plan full US effect entered <strong>Aug 7, 2023</strong>, four days before Ch.11 emergence.</p>
        <p style={{ color: T_.amber }}><strong>Structural Interdependence:</strong> The WHOA and Ch.11 plans were <strong>contractually interdependent</strong> — confirmation of each was a condition for the other's implementation. Creditors voted for or against both plans simultaneously. This prevented creditor arbitrage across jurisdictions.</p>
        <p><strong>Guarantee Restructuring:</strong> Under Section 372 DBA, the WHOA Plan restructured group guarantees provided by European affiliates. Dutch Tax Authorities were unaffected.</p>
      </DetailPanel>
    ),
    advisors: (
      <DetailPanel title="Professional Advisors" onClose={() => setDetail(null)}>
        <p><strong>Debtors (Diebold Nixdorf):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Sullivan &amp; Cromwell</strong> — Lead US legal counsel (restructuring + corporate). Also advised on the Dec 2022 LME.</li>
          <li><strong>Evercore</strong> — Investment banker / financial advisor.</li>
          <li><strong>AlixPartners</strong> — Restructuring / CRO services.</li>
          <li><strong>Kroll</strong> — Claims and noticing agent (cases.ra.kroll.com/dieboldnixdorf).</li>
        </ul>
        <p><strong>Ad Hoc Secured Creditor Group (Superpriority + 1L):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Davis Polk &amp; Wardwell</strong> — US legal counsel</li>
          <li><strong>Houlihan Lokey</strong> — Financial advisor</li>
          <li><strong>Loyens &amp; Loeff</strong> — Dutch counsel for the WHOA proceeding</li>
          <li><strong>Porter Hedges</strong> — Texas local counsel</li>
        </ul>
        <p><strong>Term Loan Holder Group (existing 1L TL):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>PJT Partners</strong> — Financial advisor</li>
          <li><strong>Gibson Dunn &amp; Crutcher</strong> — Legal counsel</li>
        </ul>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Specific funds comprising the ad hoc group were not publicly disclosed in filings. Holder identities are typically covered by Reorg / Debtwire / 9fin reporting — pull there for names.</em></p>
        <p style={{ color: T_.green }}><strong>Jackson Walker angle:</strong> Judge David R. Jones resigned in Oct 2023 after his undisclosed relationship with a Jackson Walker partner came to light. Because S&amp;C — not Jackson Walker — was debtors' counsel in Diebold, the case avoided the fee-disgorgement disputes that touched other Jones-era restructurings.</p>
      </DetailPanel>
    ),
    planTreatment: (
      <DetailPanel title="Chapter 11 Plan Treatment — Class Recoveries" onClose={() => setDetail(null)}>
        <p><strong>Second Amended Joint Prepackaged Plan.</strong> Confirmed Jul 13, 2023. Effective Aug 11, 2023. <strong>71 days</strong> from filing to emergence.</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Class</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Treatment</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Recovery</th>
          </tr></thead>
          <tbody>
            {[
              { cls: "Admin / DIP Claims", treat: "Paid in full (cash). DIP converts to exit TL.", rec: "100%", c: T_.green },
              { cls: "Classes 1-4 (Priority / Secured)", treat: "Unimpaired. Paid in full.", rec: "100%", c: T_.green },
              { cls: "Class 5 (First Lien Claims)", treat: "98% reorganized equity. RSA signers: +10% premium.", rec: "~38%", c: T_.amber },
              { cls: "Class 6 (Second Lien Notes)", treat: "2% reorganized equity ('gift' from 1L)", rec: "~4.8%", c: T_.red },
              { cls: "Class 7 (Unsecured Stub Notes)", treat: "Limited cash ('gift'). REJECTED plan → crammed down.", rec: "~4.8%", c: T_.red },
              { cls: "Class 8 (Existing Equity)", treat: "Cancelled. Zero recovery.", rec: "0%", c: T_.red },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.cls}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.treat}</td>
                <td style={{ padding: "6px 8px", color: r.c, fontWeight: 600, textAlign: "right" }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: T_.amber }}><strong>Key Valuation Finding:</strong> First lien holders were <strong>undersecured</strong> — TEV at midpoint was insufficient to cover first lien claims in full (~38% recovery). This meant second lien and unsecured had zero value on a strict priority basis. The 4.8% recoveries were purely negotiated "gifts" to avoid litigation and secure plan votes.</p>
        <p><strong>Cramdown:</strong> Class 7 (unsecured stub notes) voted to reject. Plan confirmed via cramdown under §1129 — fair and equitable, no unfair discrimination.</p>
      </DetailPanel>
    ),
    postEmergence: (
      <DetailPanel title="Post-Emergence & Recovery" onClose={() => setDetail(null)}>
        <p><strong>Emergence:</strong> Aug 11, 2023. New shares relisted on NYSE under "DBD" on Aug 14, 2023. Old Frankfurt Stock Exchange listing delisted. <strong>~37.6M total new shares outstanding</strong> (successor period weighted-average, per Aug 12–Dec 31 2023 income statement). The ~35.17M figure occasionally cited refers to the plan allocation to creditors before shares reserved for the Management Incentive Plan.</p>
        <p><strong>Debt Reduction:</strong> ~$2.7B pre-filing → ~$1.25B exit term loan. Over <strong>$2.1B of funded debt eliminated</strong>. Fresh start accounting adopted Aug 12, 2023.</p>
        <p><strong>Dec 2024 Refinancing (Dec 11, 2024):</strong> Issued <strong>$950M of 7.750% Senior Secured Notes due March 2030</strong> (5.25-year, non-call two) and entered a new <strong>$310M revolving credit facility due Dec 2029</strong>. Goldman Sachs–led bookrunner group. <strong>Priced at par</strong> at the tight end of 7.75%-8% talk — "barely two days" from announcement to pricing. Proceeds plus balance-sheet cash repaid the full $1,250M exit TL — including a $21M call premium — reducing total debt by ~$100M and lowering interest costs materially. Jones Day advised on the refinancing. <strong>Market reception</strong>: notes traded <strong>101.5-102 on the break</strong> — strong follow-on demand despite the "distressed investor target" tag.</p>
        <p><strong>Financial Recovery (as reported — GAAP revenue, non-GAAP Adjusted EBITDA):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>FY2023 (Combined):</strong> Rev $3,760.5M · Adj. EBITDA <strong>$400.8M</strong> · GAAP net income $1.38B (distorted by $1.61B non-cash gain on reorg items) · FCF $(298)M (burdened by make-whole + reorg fees)</li>
          <li><strong>FY2024:</strong> Rev $3,751.1M · Adj. EBITDA <strong>$452.2M</strong> · GAAP operating profit $182.1M · GAAP net loss $(14.5)M · FCF $108.8M · Total debt $966.0M</li>
          <li><strong>FY2025:</strong> Rev $3,805.7M · Adj. EBITDA <strong>$484.8M</strong> · GAAP operating profit $242.0M · Net income $97.5M ($94.6M to DBD) · Diluted EPS $2.54 · FCF $239.0M · Total debt $970.7M · Net debt $554.3M · <strong>Net leverage ~1.5x</strong> (Q1 2025 snapshot per CreditSights)</li>
        </ul>
        <p style={{ color: T_.green }}><strong>Q4 2025 breakout — the acceleration story:</strong> The full-year 2025 numbers mask a meaningful back-half acceleration. Q2 2025 was slightly soft (revenue $915M, -2.6% YoY; Adj EBITDA $111M, -6.4%), Q3 2025 stabilized (revenue $945M +2%, Adj EBITDA $122M +3.7%), and <strong>Q4 2025 broke out: revenue $1.104B (+11.7% YoY), Adjusted EBITDA $164.3M (+46% YoY)</strong>. Backlog/orders were the leading indicator — orders jumped +36% in Q1 2025.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Note: the case study previously listed "EBITDA" figures that were actually GAAP operating profit lines — corrected above to Diebold's reported Adjusted EBITDA non-GAAP metric (the figure the company and analysts track).</em></p>
        <p><strong>Rating trajectory post-refi:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Dec 17, 2025 — Moody's upgrade: CFR B2 → B1</strong>, outlook stable, on improved cash flows and leverage</li>
          <li>S&amp;P also upgraded post-refinancing (aligned with improved metrics)</li>
        </ul>
        <p><strong>CreditSights coverage</strong> (the only case in the portal with active CS main-desk coverage): Diebold is covered by <strong>Peter Sakon, CFA</strong> (lead) plus 4 other analysts across CS, Covenant Review, LevFin Insights, and Financials. <strong>Current rating: "Market Perform"</strong> on the 7.75% Senior Secured Notes due 2030 (changed from "Hold" on Feb 12, 2025 — slight de-rating direction). Sakon's May 2025 view: "With net leverage of 1.5x and management reiterating 2025 guidance, we remain comfortable with our Market Perform rating."</p>
        <p style={{ color: T_.green }}><strong>Apr 7, 2026 — S&amp;P SmallCap 600 inclusion:</strong> Diebold announced it would be added to the S&amp;P SmallCap 600 index — a meaningful post-emergence milestone signaling institutional market acceptance and graduation back into mainstream US equity indices less than three years after the Ch.11 filing.</p>
        <p><strong>Market Cap:</strong> ~$2.94B / ~$84.78 per share (Apr 2026 close, 52-week high range).</p>
        <p><strong>Leadership:</strong> CEO Octavio Marquez, CFO Jim Barna.</p>
        <p style={{ color: T_.green }}>The restructuring validated the thesis that the business had value if freed from its debt burden. Adjusted EBITDA grew from $400.8M (2023) → $452.2M (2024) → $484.8M (2025), a 21% cumulative uplift. Free cash flow swung from $(298)M in 2023 to $239M in 2025. Former first lien creditors who received equity at ~38% recovery have seen the shares roughly triple from emergence levels. Rating trajectory B2→B1, S&amp;P SmallCap 600 inclusion, and accelerating Q4 2025 momentum all reinforce the post-emergence thesis.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Global banking tech & retail POS company (ATMs, self-checkout, software). Distress from <span style={{ color: T_.red }}>overleveraged 2016 acquisition of Wincor Nixdorf (~$1.8B)</span>, <span style={{ color: T_.red }}>failed integration</span>, <span style={{ color: T_.red }}>revenue decline ($4.6B→$3.5B)</span>, and <span style={{ color: T_.red }}>COVID/supply-chain margin compression</span>. After a Dec 2022 <span style={{ color: T_.amber }}>liability management exercise</span> (superpriority priming + covenant stripping), filed a <span style={{ color: T_.accent }}>prepackaged Ch.11</span> (Judge David R. Jones, SDTX) with a <span style={{ color: T_.accent }}>first-ever parallel Dutch WHOA + Ch.15 trifecta</span> restructuring <strong>13 separate financing facilities</strong>. Emerged in 71 days — a landmark cross-border restructuring.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Total Debt", v: "~$2.7B", c: T_.red },
            { l: "Filed", v: "Jun 1, 2023", c: T_.red },
            { l: "Emerged", v: "Aug 11, 2023", c: T_.green },
            { l: "Debt Eliminated", v: ">$2.1B", c: T_.green },
            { l: "Time in Ch.11", v: "71 days", c: T_.textMid },
            { l: "Fulcrum", v: "1st Lien", c: T_.blue },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>Post-Dec 2022 LME, at filing. Click any entity or debt tranche for details. Case 23-90602, S.D. Tex. (Houston), Judge David R. Jones (presiding through emergence; Isgur assigned residual post-Oct 2023 matters after Jones's resignation).</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group (Co-Obligors)</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: Equity */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box label="Public Shareholders (NYSE: DBD)" sub="Common equity · 60+ yr dividend streak ended" color={T_.textGhost} badges={[{ text: "CANCELLED — $0", color: T_.red }]}
            onClick={() => toggle("equity")} selected={detail === "equity"} width={320} />
        </div>

        <VLineLabel label="100% equity ownership" />

        {/* ROW 2: US Parent */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Diebold Nixdorf, Incorporated"
            sub="US Parent · Delaware · NYSE: DBD · Canton, OH"
            color={T_.blue}
            badges={[
              { text: "BORROWER", color: T_.blue },
              { text: "JOINTLY & SEVERALLY LIABLE", color: T_.amber },
            ]}
            onClick={() => toggle("usParent")} selected={detail === "usParent"}
            width={400}
          />
        </div>

        <VLine h={14} />

        {/* DUAL JURISDICTION SPLIT — Both Restricted Group, co-obligors */}
        <div style={{ border: `2px solid ${T_.green}30`, borderRadius: 14, padding: "14px 16px 16px", background: `${T_.green}04`, position: "relative" }}>
          <div style={{ position: "absolute", top: -10, left: 16, background: T_.bgPanel, padding: "0 8px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px" }}>Restricted Group — Jointly & Severally Liable Co-Obligors</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative", marginTop: 8 }}>
            <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 0, borderTop: `2px solid ${T_.border}` }} />

            {/* ─── LEFT: US DEBTORS ─── */}
            <div>
              <VLine h={14} />
              <Box
                label="US / Canadian Debtors"
                sub="Diebold Holding Co. LLC + 9 affiliates · Ch.11 (S.D. Tex.)"
                color={T_.blue}
                badges={[
                  { text: "CHAPTER 11", color: T_.blue },
                  { text: "RESTRICTED SUBS", color: T_.green },
                  { text: "PREPACKAGED", color: T_.green },
                ]}
              />
              <VLine h={10} />
              <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center", padding: "0 4px" }}>
                ATM mfg · software · services · ~21,000 employees globally
              </div>
            </div>

            {/* ─── RIGHT: DUTCH / EUROPEAN ─── */}
            <div>
              <VLine h={14} />
              <Box
                label="Diebold Nixdorf Dutch Holding B.V."
                sub="Netherlands · Co-issuer EUR Notes · 12+ European subs"
                color={T_.amber}
                badges={[
                  { text: "WHOA (AMSTERDAM)", color: T_.amber },
                  { text: "RESTRICTED SUBS", color: T_.green },
                  { text: "CHAPTER 15 RECOGNITION", color: T_.purple },
                ]}
                onClick={() => toggle("dutchHolding")} selected={detail === "dutchHolding"}
              />
              <VLine h={10} />
              <div onClick={() => toggle("europeanSubs")} style={{ fontSize: 9, color: detail === "europeanSubs" ? T_.amber : T_.textGhost, textAlign: "center", padding: "4px 8px", cursor: "pointer", borderRadius: 4, border: `1px solid ${detail === "europeanSubs" ? T_.amber + "40" : "transparent"}` }}>
                12+ European subs (click for WHOA details) · Wincor Nixdorf legacy
              </div>
            </div>
          </div>
        </div>{/* end restricted group */}

        {/* Cross-border annotation */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div onClick={() => toggle("crossBorder")} style={{ fontSize: 10, color: T_.accent, background: `${T_.accent}10`, padding: "4px 14px", borderRadius: 6, border: `1px dashed ${T_.accent}30`, cursor: "pointer" }}>
            First-ever dual Ch.11 + Dutch WHOA + Ch.15 restructuring (click for details)
          </div>
        </div>

        {/* ── DEBT STACK ── */}
        <div style={{ border: `1px solid ${T_.border}`, borderRadius: 10, padding: 16, background: T_.bgPanel, marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Debt Stack (Post-Dec 2022 LME — Priority Order ↓)</div>

          {/* DIP / Superpriority */}
          <div onClick={() => toggle("dip")} style={{ padding: "8px 14px", borderRadius: 8, border: `2px solid ${detail === "dip" ? T_.green : T_.border}`, background: detail === "dip" ? `${T_.green}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.green }}>DIP Facility (replaced Superpriority TL + ABL)</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Backstopped by ad hoc group</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.green }}>$1.25B</div>
                <div style={{ fontSize: 9, color: T_.green }}>→ Exit TL</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Superpriority", "Converts to exit debt", "Repaid SP TL ($400M) + ABL ($250M)"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.green}15`, color: T_.green }}>{t}</span>)}
            </div>
          </div>

          {/* First Lien */}
          <div onClick={() => toggle("firstLien")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "firstLien" ? T_.blue : T_.border}`, background: detail === "firstLien" ? `${T_.blue}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.blue }}>First Lien (TL + 9.375% USD Notes + 9.000% EUR Notes)</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue }}>~$1.1B+</div>
                <div style={{ fontSize: 9, color: T_.amber }}>FULCRUM → 98% equity</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Undersecured (~38% recovery)", "US + Dutch entities", "RSA signers: +10% premium"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.blue}15`, color: T_.blue }}>{t}</span>)}
            </div>
          </div>

          {/* Second Lien */}
          <div onClick={() => toggle("secondLien")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "secondLien" ? T_.amber : T_.border}`, background: detail === "secondLien" ? `${T_.amber}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.amber }}>Second Lien Notes (ex-Unsecured exchange)</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Dec 2022 exchange from 8.50% Notes</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: T_.red }}>Recovery: ~4.8% ("gift")</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["2% reorg equity", "Zero residual value", "Gift from 1L to avoid litigation"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.amber}15`, color: T_.amber }}>{t}</span>)}
            </div>
          </div>

          {/* Unsecured Stub */}
          <div onClick={() => toggle("unsecured")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "unsecured" ? T_.red : T_.border}`, background: detail === "unsecured" ? `${T_.red}08` : T_.bgInput, marginBottom: 0, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.red }}>2024 Stub Unsecured Notes (8.50%)</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Non-participants — covenants stripped</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: T_.red }}>Recovery: ~4.8% · CRAMMED DOWN</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Rejected plan", "Covenants stripped in Dec 2022", "Interest default grace → maturity"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.red}15`, color: T_.red }}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "wincorMerger", label: "Wincor Nixdorf Acquisition", color: T_.purple, sub: "2016 · $1.8B · integration failure" },
          { k: "planTreatment", label: "Plan Treatment", color: T_.blue, sub: "Class recoveries · cramdown · 71-day prepack" },
          { k: "advisors", label: "Professional Advisors", color: T_.amber, sub: "S&C · Evercore · Davis Polk · Houlihan" },
          { k: "postEmergence", label: "Post-Emergence", color: T_.green, sub: "Adj. EBITDA $485M · $2.94B mkt cap" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "Cross-Border Restructuring (Ch.11 + WHOA + Ch.15)", color: T_.accent, summary: "First-ever parallel US-Dutch restructuring — a template for future cross-border cases.", detail: "Diebold pioneered a three-pronged approach: US Chapter 11 for American/Canadian entities, Dutch WHOA (Wet Homologatie Onderhands Akkoord) for European entities, and Chapter 15 recognition of the WHOA as a 'foreign main proceeding.' The plans were contractually interdependent — each required the other's confirmation. This prevented creditor forum-shopping and ensured global enforcement. The Dutch Court's grant of a group-wide stay (extending to non-debtor affiliates under Section 2:24(b)) was a significant expansion of WHOA powers." },
          { label: "Prepackaged Bankruptcy — Speed as Strategy", color: T_.green, summary: "71 days from filing to emergence. Votes solicited pre-filing under the RSA.", detail: "A prepackaged Ch.11 means the debtor negotiates the plan and solicits votes BEFORE filing. The RSA (signed May 30, 2023) secured support from 58-80%+ of each creditor class. This allowed Diebold to file Jun 1, get DIP approved Jun 2, confirm the plan Jul 13, and emerge Aug 11. The speed minimized business disruption, preserved customer/vendor relationships, and reduced administrative costs. Contrast with Windstream (18 months) or Envision (6 months)." },
          { label: "Superpriority Priming — The Dec 2022 LME", color: T_.red, summary: "New $400M superpriority loan jumped ahead of all existing debt — a classic pre-filing maneuver.", detail: "The Dec 2022 recapitalization was a liability management exercise: existing creditors provided $400M new money at the top of the capital structure (superpriority), plus a new $250M ABL. This primed all existing first lien and unsecured debt. Supporting creditors also consented to strip covenants from the 8.50% unsecured notes and extend the interest default grace period to maturity — effectively neutering non-participating noteholders' enforcement rights. This is the same playbook as Envision and Serta: majority creditors using document flexibility to improve their position at minority expense." },
          { label: "Gift Doctrine — Buying Peace from Junior Creditors", color: T_.amber, summary: "First lien holders voluntarily gave 2% equity + cash to junior classes with zero entitlement.", detail: "Valuation showed first lien holders were undersecured (~38% recovery). Strictly, second lien and unsecured were entitled to nothing. But first lien holders voluntarily 'gifted' 2% of reorganized equity to second lien and a cash payment to unsecured (~4.8% recovery each). Why? To buy plan votes, avoid litigation, and accelerate emergence. The 'gift' doesn't violate absolute priority because it comes from the senior class's own recovery, not from value that belongs to juniors. This is standard in prepacks where speed matters more than maximizing senior recovery." },
          { label: "Cramdown — Binding Rejecting Classes", color: T_.blue, summary: "Class 7 (unsecured stub notes) voted to reject but was bound by the plan anyway.", detail: "Under §1129(b), a plan can be confirmed over a rejecting class if it is 'fair and equitable' and does not 'unfairly discriminate.' For unsecured creditors, 'fair and equitable' means no junior class receives anything unless seniors are paid in full. Since equity was cancelled ($0), the absolute priority rule was satisfied. The ~4.8% cash recovery was a gift from first lien — unsecured was entitled to zero. The cramdown power is essential for prepackaged cases where holdout classes could otherwise delay emergence." },
          { label: "Covenant Stripping as Offensive Weapon", color: T_.purple, summary: "Non-participating 8.50% noteholders had their covenants gutted and interest default rights eliminated.", detail: "In the Dec 2022 TSA, the ~59.3% of 8.50% noteholders who participated consented to amend the indenture: remove substantially all negative covenants AND extend the interest payment default grace period to the maturity date. This meant non-participating noteholders — holding valid claims — could not enforce even if interest went unpaid. Their remedies were stripped by a majority vote of their own class. This is more aggressive than typical LMEs and mirrors the creditor-on-creditor dynamics seen in Serta and Envision." },
          { label: "Joint & Several Liability — Same Creditors, Two Jurisdictions", color: T_.emerald, summary: "US parent and Dutch Holding were co-obligors — creditors had claims in both but different priority.", detail: "Unlike a typical parent/sub structure where debt sits at one level, Diebold's credit facilities made the US parent and Dutch Holding jointly and severally liable. The same creditor could pursue either entity. But security packages and intercreditor arrangements differed by jurisdiction — making the cross-border coordination essential. Without the contractual interdependence of the Ch.11 and WHOA plans, creditors could have forum-shopped or sought inconsistent relief. The observer (Ferdinand Hengst) monitored this risk." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "1859", event: "Diebold founded in Canton, OH as Diebold Bahmann Safe Company. Enters ATM market in early 1970s. NYSE-listed since 1964.", color: T_.textMid },
          { date: "Nov 2015", event: "Diebold announces acquisition of Wincor Nixdorf AG (German ATM/POS manufacturer) for ~$1.8B in cash and stock.", color: T_.purple },
          { date: "Aug 2016", event: "Wincor acquisition closes. Combined entity = ~35% global ATM market. Pro forma leverage ~4x, target <3x by 2019.", color: T_.purple },
          { date: "Jul 2017", event: "Diebold widens 2017 net loss guidance from $50-75M to $110-125M. Stock drops 23% in one day. Integration failing.", color: T_.red },
          { date: "Dec 2017", event: "CEO Andy Mattes steps down. Interim Office of the CEO formed. Cost synergies falling short of $160M target.", color: T_.red },
          { date: "Jul 2020", event: "$1.1B Notes Offering: $700M 9.375% USD + EUR 350M 9.000% Secured Notes. Both oversubscribed. Extends maturities to 2025.", color: T_.textMid },
          { date: "2020-22", event: "COVID hits ATM demand. Supply chain inflation compresses margins. Revenue: $4.6B (2017) → $3.5B (2022). Net loss: $581M. Negative EBITDA.", color: T_.red },
          { date: "Oct 2022", event: "Transaction Support Agreement: ~79% of TL holders, ~59% of unsecured, ~90% of secured notes. $213M liquidity gap identified.", color: T_.amber },
          { date: "Dec 2022", event: "RECAPITALIZATION CLOSES: $400M new superpriority TL + $250M ABL. Unsecured → 2L exchange. Covenant stripping on 8.50% Notes. Interest default grace period extended to maturity.", color: T_.red },
          { date: "Feb-May 2023", event: "Exchange offer for remaining 8.50% Notes (PIK Toggle + warrants). Extended multiple times. Overtaken by Ch.11 filing.", color: T_.amber },
          { date: "May 30, 2023", event: "RSA signed with 58-80%+ of each creditor class. Prepackaged plan votes solicited.", color: T_.amber },
          { date: "Jun 1, 2023", event: "Ch.11 filed (S.D. Tex., Judge David R. Jones). 10 US/Canadian debtors. WHOA commenced in Amsterdam. Ch.15 filed for recognition.", color: T_.red },
          { date: "Jun 2, 2023", event: "First-day hearing. $1.25B DIP approved — $517M released on interim order, remaining $733M on final. Repays superpriority TL + ABL in full.", color: T_.blue },
          { date: "Jun 8, 2023", event: "Dutch Court grants ex parte group-wide WHOA stay (Art. 376 Fw / afkoelingsperiode) — extends to non-debtor European affiliates.", color: T_.amber },
          { date: "Jul 12, 2023", event: "US Bankruptcy Court recognizes the Dutch WHOA as a 'foreign main proceeding' under Ch.15.", color: T_.purple },
          { date: "Jul 13, 2023", event: "Ch.11 Plan confirmed by Judge Jones. Class 7 (unsecured stub) crammed down. 1L → 98% equity. 2L → 2% equity (gift).", color: T_.green },
          { date: "Aug 2, 2023", event: "Dutch Court sanctions WHOA Plan. 2/3 majority in Classes 1-3. Class 4 rejected but bound.", color: T_.green },
          { date: "Aug 7, 2023", event: "US court enters supplemental Ch.15 order giving the sanctioned WHOA plan full US effect.", color: T_.purple },
          { date: "Aug 11, 2023", event: "EMERGENCE. 71 days in Ch.11. >$2.1B debt eliminated. DIP converts to $1.25B exit TL. ~37.6M new shares issued. Fresh start accounting adopted.", color: T_.green },
          { date: "Aug 14, 2023", event: "New DBD shares begin trading on NYSE. Former first lien holders = new owners.", color: T_.green },
          { date: "Oct 2023", event: "Judge David R. Jones resigns amid undisclosed Jackson Walker relationship scandal. Residual Diebold matters reassigned to Judge Isgur. Diebold unaffected by fee-disgorgement issues since S&C — not Jackson Walker — was debtors' counsel.", color: T_.amber },
          { date: "Dec 11, 2024", event: "Refinancing priced: $950M of 7.750% Senior Secured Notes due March 2030 (5.25-yr non-call two) + new $310M RCF due Dec 2029. Goldman Sachs-led; priced at par at tight end of 7.75%-8% talk; notes traded 101.5-102 on the break. Repaid full $1.25B exit TL incl. $21M call premium.", color: T_.green },
          { date: "FY2024", event: "Revenue $3,751M · Adj. EBITDA $452M · FCF +$109M — delivering on restructuring thesis.", color: T_.green },
          { date: "Feb 12, 2025", event: "CreditSights (Peter Sakon) changes recommendation on the 7.75% 2030 notes from 'Hold' to 'Market Perform.'", color: T_.blue },
          { date: "Q1-Q3 2025", event: "Mixed quarters: Q1 met guidance + orders +36%; Q2 slight weakness (rev -2.6%, EBITDA -6.4%); Q3 stabilizes (rev +2%, EBITDA +3.7%). Net leverage 1.5x per CS.", color: T_.textMid },
          { date: "Dec 17, 2025", event: "MOODY'S UPGRADES CFR B2 → B1 on improved cash flows and leverage. Outlook stable. First specific post-refi upgrade.", color: T_.green },
          { date: "Feb 12, 2026", event: "Q4 2025 BREAKOUT: Revenue $1.104B (+11.7% YoY), Adjusted EBITDA $164.3M (+46% YoY). Back-half acceleration drives FY2025 beat.", color: T_.green },
          { date: "FY2025", event: "Revenue $3,806M · Adj. EBITDA $485M · FCF +$239M · Net income $95M · Diluted EPS $2.54 · Net debt $554M.", color: T_.green },
          { date: "Apr 7, 2026", event: "S&P SMALLCAP 600 INCLUSION announced. Diebold graduates back into mainstream US equity indices less than 3 years after filing — post-emergence institutional acceptance milestone.", color: T_.accent },
          { date: "Apr 2026", event: "Market cap ~$2.94B. Stock ~$84.78 (52-wk high). Adj. EBITDA grew 21% cumulative since emergence. Restructuring thesis validated and accelerating.", color: T_.green },
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
   PETSMART / CHEWY
   ═══════════════════════════════════════════════════════ */

function PetSmartCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    lbo: (
      <DetailPanel title="The 2015 LBO — BC Partners Consortium" onClose={() => setDetail(null)}>
        <p><strong>Dec 14, 2014:</strong> Consortium led by <strong>BC Partners</strong> announces take-private of PetSmart for <strong>$83.00/share</strong> (~$8.7B total enterprise value, ~9.1x adjusted EBITDA). Premium: ~39% over unaffected price on Jul 2, 2014.</p>
        <p><strong>Consortium:</strong> BC Partners (lead), La Caisse de dépôt et placement du Québec (CDPQ), GIC Special Investments (Singapore SWF), Longview Asset Management (~9% pre-LBO shareholder, rolled ~1/3 of holdings), StepStone Group.</p>
        <p><strong>Mar 11, 2015:</strong> LBO closes after stockholder approval (Mar 6). <strong>~$6.2B debt raised</strong> — a 15x increase from PetSmart's pre-LBO debt of ~$560M.</p>
        <p><strong>Financing:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Senior Secured Term Loan B:</strong> $4,300M (7-year, cov-lite, floating)</li>
          <li><strong>Senior Unsecured Notes (7.125% due 2023):</strong> $1,900M — largest bond backing an LBO in 2015</li>
          <li><strong>ABL Revolving Facility:</strong> $750M</li>
          <li><strong>Equity:</strong> ~$2.0-2.5B from sponsors</li>
        </ul>
        <p><strong>Arrangers:</strong> Citigroup, Nomura Securities, Jefferies Finance, Barclays, Deutsche Bank.</p>
        <p><strong>Legal:</strong> Simpson Thacher & Bartlett (sponsor counsel).</p>
        <p style={{ color: T_.red }}>PetSmart went from $560M of pre-LBO debt and ~$343M cash to $6.2B of funded debt overnight. Leverage was ~7x at close — aggressive even by LBO standards.</p>
      </DetailPanel>
    ),
    dividend: (
      <DetailPanel title="$800M Dividend Recapitalization" onClose={() => setDetail(null)}>
        <p>Within ~10 months of the March 2015 closing, BC Partners and the consortium extracted an <strong>$800 million special dividend</strong> from PetSmart.</p>
        <p>This recouped <strong>~38-40% of their initial equity investment</strong> (~$2.0-2.5B) before the business had meaningfully deleveraged.</p>
        <p style={{ color: T_.red }}>The dividend recap further strained PetSmart's balance sheet at a time when brick-and-mortar retail was already under pressure from Amazon and e-commerce competition. This is the classic PE playbook: extract cash early via debt-funded distributions while the business bears the leverage burden.</p>
        <p>Compare: J.Crew sponsors extracted $766M (70% of equity); PetSmart sponsors extracted $800M (~38% of equity) on a much larger deal.</p>
      </DetailPanel>
    ),
    chewyAcq: (
      <DetailPanel title="Chewy Acquisition — $3.35B (May 2017)" onClose={() => setDetail(null)}>
        <p>PetSmart acquired <strong>Chewy.com</strong> in May 2017 for <strong>~$3.35 billion</strong> — then the largest e-commerce acquisition ever (larger than Walmart's $3.3B purchase of Jet.com).</p>
        <p><strong>Financing:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>8.875% Senior First Lien Notes due 2025:</strong> $1,350M (new issuance)</li>
          <li><strong>5.875% Senior Unsecured Notes due 2025:</strong> $650M (new issuance)</li>
          <li><strong>Equity contribution from sponsors:</strong> ~$1,000M</li>
        </ul>
        <p><strong>Post-acquisition total debt: ~$8.0-8.6B</strong></p>
        <p>Chewy was growing rapidly but burning cash (not yet profitable). It became a <strong>wholly-owned domestic restricted subsidiary</strong> and <strong>guarantor</strong> of PetSmart's secured debt, with liens granted on its assets.</p>
        <p style={{ color: T_.amber }}>The thesis: Chewy's e-commerce platform would complement PetSmart's 1,650+ brick-and-mortar stores. The reality: Chewy became PetSmart's most valuable asset — worth more than the entire parent company — creating the incentive for the 2018 collateral-stripping transaction.</p>
      </DetailPanel>
    ),
    chewyTransfer: (
      <DetailPanel title="The Chewy Equity Transfer — June 1, 2018 (The Key LME)" onClose={() => setDetail(null)}>
        <p>This is the centerpiece of the case. On <strong>June 1, 2018</strong>, PetSmart executed two coordinated transactions that stripped Chewy from secured lenders' collateral pool:</p>
        <p><strong>Transaction 1 — Restricted Payment (20% of Chewy):</strong></p>
        <p>PetSmart distributed 20% of Chewy common stock to parent Argos Holdings Inc., which immediately passed it up to the BC Partners consortium. Covenant basket used: Section 6.08(a)(viii) — permitted restricted payments up to $200M + the "Available Equity Amount" (~$1.0B in sponsor equity contributions for Chewy). Claimed value: <strong>$908.5M</strong>.</p>
        <p><strong>Transaction 2 — Investment (16.5% of Chewy):</strong></p>
        <p>PetSmart contributed 16.5% of Chewy stock to a <strong>newly formed unrestricted subsidiary</strong>. Covenant basket used: Section 6.04 — permitted "other Investments" up to $375M + the "Available Amount." Claimed value: <strong>$749.5M</strong>.</p>
        <p><strong>The "Phantom Guarantee" Release:</strong></p>
        <p style={{ color: T_.red }}>Section 9.15 of the term loan agreement provided that a subsidiary guarantor would be <strong>automatically released</strong> from guarantee obligations when it "ceases to be a wholly-owned Subsidiary." After the two transfers, PetSmart held only 63.5% of Chewy — no longer wholly owned. Result: Chewy's guarantee of ~$4.3B in secured debt was <strong>automatically terminated</strong>, and all liens on Chewy's assets were released. ~$3.35B of acquisition value moved beyond creditors' reach.</p>
        <p><strong>Litigation:</strong> Wilmington Trust (term loan administrative agent) filed suit June 26, 2018. Citibank (collateral agent) refused to deliver release documents. An ad hoc lender group formed.</p>
      </DetailPanel>
    ),
    settlement: (
      <DetailPanel title="2019 Settlement & Chewy IPO" onClose={() => setDetail(null)}>
        <p><strong>April 17, 2019:</strong> Settlement effective. ~90% of $4.1B term loan lenders consented.</p>
        <p><strong>Settlement Terms:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>50 bps consent fee to participating lenders</li>
          <li>Higher interest rate spread</li>
          <li>Tighter covenants going forward</li>
          <li>$250M par paydown commitment within 12 months</li>
          <li>Lenders ratified the Chewy transactions as permitted</li>
          <li>PetSmart committed to IPO Chewy and pledge proceeds to prepay the term loan</li>
        </ul>
        <p><strong>Chewy IPO (June 14, 2019):</strong></p>
        <p>Priced at <strong>$22/share</strong> (above expected range). First-day pop: shares surged ~59%, closing at ~$35. Raised <strong>~$1.02B</strong> in proceeds. Market cap at IPO: ~$15B. PetSmart's paper gain on day one: <strong>~$10B</strong> — one of the largest PE-backed IPO gains ever.</p>
        <p>Post-IPO, PetSmart retained ~70% of common stock, ~77% of voting power.</p>
        <p style={{ color: T_.green }}>IPO proceeds were used to pay down PetSmart's secured term loan per the settlement agreement. The Chewy IPO validated the sponsors' thesis that the asset was worth far more than its acquisition price — while demonstrating that secured lenders had lost collateral worth multiples of their claims.</p>
      </DetailPanel>
    ),
    refi2021: (
      <DetailPanel title="2020-2021 Refinancing & Chewy Separation" onClose={() => setDetail(null)}>
        <p>In late 2020, BC Partners executed a <strong>~$6 billion comprehensive recapitalization</strong>:</p>
        <p><strong>New Capital Structure:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>New Senior Secured Term Loan:</strong> $2,300M</li>
          <li><strong>Senior First Lien Notes (4.75% due 2028):</strong> $1,200M</li>
          <li><strong>Senior Unsecured Notes (7.75% due 2029):</strong> $1,150M</li>
          <li><strong>ABL Revolver:</strong> $750M</li>
          <li><strong>Total new debt:</strong> ~$5,400M</li>
        </ul>
        <p><strong>Equity contribution:</strong> ~$1.3B from Argos Holdings.</p>
        <p><strong>Use of proceeds:</strong> Retire ALL existing PetSmart debt (original term loan, 2023 notes, 2025 secured notes, 2025 unsecured notes).</p>
        <p><strong>Chewy Distribution:</strong> PetSmart distributed <strong>all remaining Chewy common stock</strong> to Argos Holdings. Post-distribution, PetSmart owned zero Chewy shares. An Argos affiliate pledged ~$4.0B of Chewy Class B stock as <strong>collateral</strong> for the new first lien secured debt and <strong>guaranteed</strong> both secured and unsecured notes.</p>
        <p style={{ color: T_.green }}>Leverage declined from ~4.8x to ~4.0x. S&P upgraded PetSmart to B from B-. The refinancing transformed the capital structure: original creditors who were impaired in 2018 were made whole at par if they held through, and new creditors got Chewy stock collateral — an unusual structural support from a HoldCo affiliate.</p>
        <p style={{ color: T_.amber }}>An initial refinancing attempt in October 2020 was withdrawn due to lender opposition, then revised with improved terms including the Chewy collateral pledge and parent guarantee.</p>
      </DetailPanel>
    ),
    planTreatment: (
      <DetailPanel title="Debt Evolution & Recoveries" onClose={() => setDetail(null)}>
        <p>PetSmart <strong>never filed Chapter 11</strong>. All restructuring was out-of-court. Here's how each tranche fared:</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Tranche</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Outcome</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Recovery</th>
          </tr></thead>
          <tbody>
            {[
              { cls: "ABL ($750M)", treat: "Refinanced at par in 2021", rec: "100%", c: T_.green },
              { cls: "Term Loan B ($4,300M)", treat: "Partially repaid via Chewy IPO; fully retired 2021 refi", rec: "100%", c: T_.green },
              { cls: "8.875% 1L Notes ($1,350M)", treat: "Retired in 2021 refinancing", rec: "100%", c: T_.green },
              { cls: "7.125% Unsecured ($1,900M)", treat: "Retired in 2021 refinancing", rec: "100%", c: T_.green },
              { cls: "5.875% Unsecured ($650M)", treat: "Retired in 2021 refinancing", rec: "100%", c: T_.green },
              { cls: "Equity (BC Partners et al.)", treat: "Retained control + $800M dividends + $10B Chewy gain", rec: "Massive", c: T_.purple },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.cls}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.treat}</td>
                <td style={{ padding: "6px 8px", color: r.c, fontWeight: 600, textAlign: "right" }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: T_.amber }}><strong>Key insight:</strong> Despite the 2018 crisis (unsecured notes trading at $0.48, Caa1/CCC ratings), <strong>every creditor was ultimately made whole</strong>. The Chewy IPO and COVID pet boom rescued the capital structure. Holders who panic-sold in 2018 crystallized losses; holders who held through were repaid at par in the 2021 refi.</p>
        <p><strong>Aug 2025 Refinancing — The Execution Story:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Aug 5, 2025:</strong> Deal launched at <strong>$1.7B TLB + $2.25B SSNs + $750M SUNs = $4.7B total</strong>. Dual bookrunner split: <strong>Citi led bonds, JP Morgan led TLB</strong>.</li>
          <li><strong>Aug 6-7:</strong> Initial whispers — SSNs low-8% area, SUNs mid-10% area. Commitment deadline accelerated to Aug 8 (from Aug 11).</li>
          <li><strong>Aug 8 — mid-marketing restructure:</strong> <strong>TLB upsized $300M to $2.0B</strong>; <strong>SSNs downsized $300M to $1.95B</strong>. Final pricing: TLB <strong>S+400 @ 99</strong> (tight end of revised S+375-400 talk); SSNs <strong>7.5%</strong> (tight end of 7.5-7.75% talk); SUNs <strong>10%</strong> (inside 10.125-10.375% talk). TLB opened <strong>99.5-100 on the break</strong>.</li>
          <li style={{ color: T_.accent }}><strong>The ironic twist — "PetSmart Adds Investor Protections as $4.7 Billion of Debt Sold" (Bloomberg)</strong>: investors pushed back mid-marketing and demanded <strong>protective covenants added to the documentation</strong> to get the deal done. The company that pioneered the collateral-stripping "phantom guarantee" maneuver now has to offer its own "Chewy blocker"–style protections to place debt. The market has learned — and is pricing that learning into new-issue documentation.</li>
        </ul>
      </DetailPanel>
    ),
    postEmergence: (
      <DetailPanel title="Current State (2025-2026) — Post-COVID Reversion" onClose={() => setDetail(null)}>
        <p><strong>Ownership:</strong> BC Partners remains <strong>majority shareholder</strong> with board control. GIC and management hold equity. Apollo Global Management acquired a <strong>minority equity stake</strong> in July 2023 (Kirkland &amp; Ellis advised).</p>
        <p><strong>Revenue:</strong> Increased &gt;40% under BC Partners ownership through the COVID boom. PetSmart operates <strong>~1,650+ stores</strong> across US, Canada, and Puerto Rico.</p>
        <p><strong>Capital Structure (post-Aug 2025 refi):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>~$2.0B Senior Secured Term Loan (S+400, 2032)</li>
          <li>~$1.95B Senior First Lien Notes due 2032 (7.500%)</li>
          <li>~$750M Senior Unsecured Notes due 2033 (10.000%)</li>
          <li>ABL Revolver (~$750M)</li>
          <li>Chewy Class B stock (~$1.4B) pledged as collateral</li>
        </ul>
        <p><strong>Chewy:</strong> Fully independent public company (NYSE: CHWY). PetSmart owns zero shares directly. An Argos Holdings affiliate still holds Chewy Class B shares pledged as collateral for PetSmart debt. (Feb 24, 2026: Chewy appointed Christopher Deppe CFO.)</p>
        <p style={{ color: T_.red }}><strong>2025 Deterioration — the post-COVID tailwind has reversed:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Q2 2025 (reported Sep 2025):</strong> Revenue flat, <strong>Adjusted EBITDA down ~13% YoY</strong> — per CreditSights LevFin Insights: "double-digit decline in adjusted EBITDA for the quarter"</li>
          <li><strong>Q3 2025 (reported Dec 17, 2025):</strong> Revenue declining, <strong>Adjusted EBITDA down 11% YoY</strong> — consecutive double-digit declines</li>
          <li>Labeled "Special Situations / Distressed Investor Target" by LFI — back on the distressed watchlist</li>
          <li>The COVID pandemic pet-adoption bubble that rescued PetSmart from the 2018 crisis has reversed; pet category normalization + tariff pressure driving the softness</li>
        </ul>
        <p style={{ color: T_.red }}><strong>Another sponsor extraction — $112M Q3 2025 dividend:</strong> Per Reorg (Dec 17, 2025), PetSmart paid a <strong>$112 million dividend</strong> in Q3 2025 — simultaneously with the 11% EBITDA decline. BC Partners continues to pull cash out even as fundamentals weaken. This is the same pattern as the 2015 $800M post-LBO dividend recap and parallels J.Crew's sponsor extraction trajectory.</p>
        <p style={{ color: T_.amber }}><strong>Bottom line:</strong> PetSmart is technically the case that "avoided bankruptcy entirely" — still true, the 2018 LME was successful, the 2019 Chewy IPO was a windfall, and the 2021 refi made all legacy creditors whole. But the 2025 story is meaningfully different from that post-COVID triumph: post-pandemic category reversion, two consecutive quarters of double-digit EBITDA decline, another $112M sponsor dividend on top of deteriorating fundamentals, and an August 2025 refi where investors demanded protective covenants to get the deal done. The case has shifted from "collateral-stripping landmark with a happy ending" to "collateral-stripping landmark with a happy middle and an uncertain 2026 outlook."</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Largest pet retailer (1,650+ stores). <span style={{ color: T_.purple }}>BC Partners consortium</span> took PetSmart private in 2015 for $8.7B, then acquired <span style={{ color: T_.cyan }}>Chewy.com for $3.35B</span> in 2017 — the largest e-commerce acquisition ever. Facing <span style={{ color: T_.red }}>$8B+ in debt</span> and deteriorating retail fundamentals, BC Partners executed a <span style={{ color: T_.accent }}>collateral-stripping transaction</span> in June 2018 — transferring 36.5% of Chewy equity out of the credit group, triggering automatic release of Chewy's guarantee on ~$4.3B of secured debt. This "phantom guarantee" maneuver spawned <span style={{ color: T_.accent }}>"Chewy blocker"</span> provisions in credit agreements. The case "avoided bankruptcy entirely" through the 2019 Chewy IPO and 2020-2024 COVID pet boom — but by <span style={{ color: T_.red }}>2025 the tailwind has reversed</span>: Q2/Q3 2025 EBITDA down double digits, a $112M Q3 2025 sponsor dividend paid into the decline, and an Aug 2025 refi where investors demanded protective covenants to place $4.7B of new debt. <span style={{ color: T_.amber }}>A landmark LME with a happy middle and an uncertain 2026 outlook.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Total Debt", v: "~$8.6B", c: T_.red },
            { l: "LME Date", v: "Jun 1, 2018", c: T_.red },
            { l: "Chewy IPO", v: "Jun 14, 2019", c: T_.green },
            { l: "Debt Eliminated", v: "~$3B+", c: T_.green },
            { l: "Ch.11 Filed?", v: "No — OOC", c: T_.textMid },
            { l: "Fulcrum", v: "None (all par)", c: T_.blue },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>Post-Chewy acquisition, pre-2018 transfer. Click any entity or debt tranche for details.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.red}50`, background: `${T_.red}08`, display: "inline-block" }} /><span style={{ color: T_.red }}>Unrestricted / Outside Credit Group</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: Sponsors */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="BC Partners Consortium"
            sub="BC Partners (lead) · CDPQ · GIC · Longview · StepStone"
            color={T_.purple}
            badges={[{ text: "EXTRACTED $800M DIVIDEND", color: T_.amber }, { text: "~$10B CHEWY GAIN", color: T_.green }]}
            onClick={() => toggle("lbo")} selected={detail === "lbo"}
            width={440}
          />
        </div>

        <VLineLabel label="100% equity (via Argos Holdings L.P.)" color={T_.purple} />

        {/* ROW 2: HoldCo chain */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Argos Holdings Inc."
            sub="HoldCo · Downstream guarantor of ABL + TL · Parent of PetSmart Inc."
            color={T_.textDim}
            badges={[{ text: "HOLDCO", color: T_.textGhost }, { text: "GUARANTOR", color: T_.green }]}
            width={440}
          />
        </div>

        <VLineLabel label="↓ via Argos Intermediate Holdcos I → II → III" color={T_.textGhost} />

        {/* ROW 3: PetSmart Inc — Borrower */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="PetSmart, Inc."
            sub="Borrower / Issuer · Delaware · 1,650+ stores"
            color={T_.blue}
            badges={[
              { text: "BORROWER", color: T_.blue },
              { text: "RESTRICTED SUB", color: T_.green },
            ]}
            width={440}
          />
        </div>

        <VLine h={14} />

        {/* DEBT STACK */}
        <div style={{ border: `1px solid ${T_.border}`, borderRadius: 10, padding: 16, background: T_.bgPanel, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T_.textGhost, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Debt Stack at PetSmart Inc. (Post-Chewy Acquisition — Priority Order ↓)</div>

          {/* ABL */}
          <div style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${T_.border}`, background: T_.bgInput, marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T_.green }}>ABL Revolving Facility</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: T_.green }}>$750M</span>
            </div>
            <div style={{ fontSize: 9, color: T_.textGhost, marginTop: 2 }}>Asset-based · First priority on current assets</div>
          </div>

          {/* TLB */}
          <div onClick={() => toggle("chewyTransfer")} style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${detail === "chewyTransfer" ? T_.blue : T_.border}`, background: detail === "chewyTransfer" ? `${T_.blue}08` : T_.bgInput, marginBottom: 4, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.blue }}>Senior Secured Term Loan B</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Cov-lite · Floating · 7-year</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.blue }}>$4,300M</div>
                <div style={{ fontSize: 9, color: T_.green }}>Recovery: 100% (held through)</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Chewy was guarantor → released Jun 2018", "Wilmington Trust = admin agent", "90% consented to 2019 settlement"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.blue}15`, color: T_.blue }}>{t}</span>)}
            </div>
          </div>

          {/* 1L Notes */}
          <div style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${T_.border}`, background: T_.bgInput, marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.emerald }}>8.875% Senior First Lien Notes due 2025</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Issued May 2017 for Chewy acquisition</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.emerald }}>$1,350M</div>
                <div style={{ fontSize: 9, color: T_.green }}>Recovery: 100%</div>
              </div>
            </div>
          </div>

          {/* Unsecured 7.125% */}
          <div style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${T_.border}`, background: T_.bgInput, marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.amber }}>7.125% Senior Unsecured Notes due 2023</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Largest LBO bond of 2015</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.amber }}>$1,900M</div>
                <div style={{ fontSize: 9, color: T_.green }}>Recovery: 100%</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {["Traded at $0.48 in May 2018", "Yield ~24.6% at trough", "Made whole at par in 2021 refi"].map(t => <span key={t} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: `${T_.amber}15`, color: T_.amber }}>{t}</span>)}
            </div>
          </div>

          {/* Unsecured 5.875% */}
          <div style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${T_.border}`, background: T_.bgInput, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T_.red }}>5.875% Senior Unsecured Notes due 2025</span>
                <span style={{ fontSize: 10, color: T_.textDim, marginLeft: 8 }}>Issued May 2017 for Chewy acquisition</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T_.red }}>$650M</div>
                <div style={{ fontSize: 9, color: T_.green }}>Recovery: 100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee annotations */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 0 6px" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: 9, color: T_.green }}>▲ Wholly-owned domestic restricted subs guarantee all debt</span>
            <span style={{ fontSize: 9, color: T_.red }}>▲ Chewy guarantee RELEASED Jun 2018 (phantom guarantee)</span>
          </div>
        </div>

        <VLine h={14} />

        {/* ROW 5: Subsidiaries — two-column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 0, borderTop: `2px solid ${T_.border}` }} />

          {/* LEFT: OpCo + Stores */}
          <div>
            <VLine h={14} />
            <div style={{ border: `2px solid ${T_.green}30`, borderRadius: 12, padding: "12px 10px 10px", background: `${T_.green}04`, position: "relative" }}>
              <div style={{ position: "absolute", top: -10, left: 10, background: T_.bgPanel, padding: "0 6px" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T_.green, textTransform: "uppercase", letterSpacing: "0.5px" }}>Restricted Group</span>
              </div>
              <Box
                label="PetSmart LLC + Subsidiaries"
                sub="Co-Issuer · 1,650+ stores · US, Canada, PR"
                color={T_.emerald}
                badges={[
                  { text: "OPERATING ENTITY", color: T_.emerald },
                  { text: "GUARANTORS", color: T_.green },
                  { text: "RESTRICTED SUBS", color: T_.green },
                ]}
              />
            </div>
          </div>

          {/* RIGHT: Chewy */}
          <div>
            <VLine h={14} />
            <Box
              label="Chewy, Inc."
              sub="E-commerce · Acquired May 2017 for $3.35B"
              color={T_.cyan}
              badges={[
                { text: "WAS RESTRICTED + GUARANTOR", color: T_.green },
                { text: "GUARANTEE RELEASED JUN 2018", color: T_.red },
                { text: "IPO JUN 2019 — $15B MKT CAP", color: T_.cyan },
              ]}
              onClick={() => toggle("chewyAcq")} selected={detail === "chewyAcq"}
            />
            <VLine h={10} />
            <div style={{ fontSize: 9, color: T_.amber, textAlign: "center", padding: "0 4px" }}>
              20% → sponsors · 16.5% → unrestricted sub · 63.5% retained → no longer wholly owned → guarantee auto-released
            </div>
          </div>
        </div>
      </div>

      {/* Unrestricted sub callout */}
      <div style={{ padding: "12px 16px", background: `${T_.red}04`, borderRadius: 12, border: `2px dashed ${T_.red}30`, marginTop: 12, marginBottom: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, textAlign: "center" }}>Unrestricted Subsidiary (Created Jun 2018)</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="NewCo Unrestricted Sub"
            sub="Received 16.5% of Chewy equity · Outside credit group"
            color={T_.red}
            dashed
            badges={[
              { text: "UNRESTRICTED", color: T_.red },
              { text: "16.5% CHEWY", color: T_.red },
              { text: "OUTSIDE CREDIT GROUP", color: T_.red },
            ]}
            width={440}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9, color: T_.red }}>
          Combined with the 20% dividend to sponsors, PetSmart no longer wholly owned Chewy → Section 9.15 automatic guarantee release triggered
        </div>
      </div>

      {/* ── Detail buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "dividend", label: "Dividend Recap", color: T_.purple, sub: "$800M extracted within 10 months of LBO" },
          { k: "planTreatment", label: "Debt Evolution", color: T_.blue, sub: "All tranches → 100% recovery · No Ch.11" },
          { k: "refi2021", label: "2021 Refinancing", color: T_.green, sub: "$6B recap · Chewy separated · stock pledged" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`,
            transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* Additional detail buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        <div onClick={() => toggle("settlement")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "settlement" ? `${T_.accent}12` : T_.bgInput,
          border: `1px solid ${detail === "settlement" ? T_.accent : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent }}>Settlement & Chewy IPO</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>90% lender consent · $1B IPO · ~$10B paper gain</div>
        </div>
        <div onClick={() => toggle("postEmergence")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "postEmergence" ? `${T_.green}12` : T_.bgInput,
          border: `1px solid ${detail === "postEmergence" ? T_.green : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.green }}>Current State</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>BC Partners majority · Apollo minority (2023) · private</div>
        </div>
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "The 'Phantom Guarantee' — Automatic Release Provisions", color: T_.accent, summary: "Chewy's guarantee was automatically released when PetSmart ceased to wholly own it — no lender vote required.", detail: "Section 9.15 of PetSmart's term loan agreement stated that a subsidiary guarantor would be automatically released from its guarantee when it 'ceases to be a wholly-owned Subsidiary' in connection with a permitted transaction. By distributing 20% to sponsors and investing 16.5% in an unrestricted sub, PetSmart reduced its Chewy ownership to 63.5% — triggering automatic release. The guarantee evaporated without lender consent, without a vote, and without advance notice. This is the 'phantom guarantee' — it existed on paper but could be dissolved through permitted transactions. Post-PetSmart, credit agreements now include 'Chewy blockers' that restrict automatic guarantee release mechanics." },
          { label: "Collateral Stripping via Covenant Baskets", color: T_.red, summary: "Two covenant baskets, used in combination, moved $1.66B of Chewy value beyond creditors' reach.", detail: "PetSmart used two separate covenant baskets: (1) Section 6.08(a)(viii) — the restricted payment basket — to distribute 20% of Chewy ($908.5M) to sponsors, and (2) Section 6.04 — the investment basket — to contribute 16.5% ($749.5M) to an unrestricted subsidiary. Neither transaction alone would have triggered the guarantee release. Combined, they reduced PetSmart's ownership below 100%, activating the automatic release. This is the same playbook as J.Crew (investment baskets → non-loan-party restricted sub → unrestricted sub) but with a different trigger mechanism (ownership threshold vs. designation)." },
          { label: "The 'Chewy Blocker' — Market Response", color: T_.green, summary: "Post-2018, credit agreements include specific provisions preventing automatic guarantee release through ownership dilution.", detail: "Chewy blockers typically include: (1) Anti-dilution provisions — preventing guarantee release solely because a subsidiary ceases to be wholly owned through permitted transactions. (2) Minimum ownership thresholds — requiring guarantee release only if the borrower sells its ENTIRE interest, not just dilutes below 100%. (3) Value caps on collateral release — limiting the aggregate value of assets that can be removed from the credit group. (4) Consent requirements — requiring lender approval for guarantee release above a dollar threshold. These join J.Crew blockers (IP transfer), Envision blockers (dropdown), and Serta blockers (uptier) as the four pillars of modern LME protection." },
          { label: "Out-of-Court Restructuring — No Ch.11 Needed", color: T_.blue, summary: "PetSmart resolved $8.6B of distressed debt without ever filing bankruptcy — a pure out-of-court story.", detail: "Unlike Windstream, Envision, Serta, J.Crew, and Diebold (all Ch.11 filers), PetSmart's restructuring was entirely out-of-court: (1) 2018 LME stripped collateral, (2) 2019 settlement with 90% lender consent, (3) Chewy IPO raised $1B for debt paydown, (4) COVID pet boom improved fundamentals, (5) 2021 comprehensive refinancing retired all legacy debt at par. No DIP financing, no plan of reorganization, no court confirmation. This demonstrates that aggressive LMEs can succeed without bankruptcy if the underlying asset (Chewy) appreciates enough to cover the damage." },
          { label: "PE Dividend Recap + Value Extraction Playbook", color: T_.purple, summary: "BC Partners extracted $800M in dividends, then engineered a $10B+ paper gain on Chewy — while creditors temporarily bore the risk.", detail: "The sequence: (1) LBO with $6.2B debt (Mar 2015), (2) $800M dividend recap within 10 months (late 2015), (3) acquire Chewy for $3.35B funded with $2B more debt (May 2017), (4) strip Chewy from collateral pool (Jun 2018), (5) IPO Chewy at $15B market cap (Jun 2019), (6) distribute all Chewy shares to HoldCo (2021). The sponsors recouped their equity investment via the dividend, then captured the entire upside from Chewy while creditors' collateral was temporarily impaired. When the unsecured notes traded at $0.48 in 2018, the capital structure looked broken — but the sponsors held the option on Chewy's value and it paid off spectacularly." },
          { label: "COVID as Tailwind — The Pet Adoption Boom", color: T_.emerald, summary: "Unlike most PE-backed retailers, COVID saved PetSmart — pet stores were essential, and adoption surged.", detail: "Pet stores were classified as essential businesses during COVID lockdowns. PetSmart saw +36% sales in March 2020 and +18% revenue growth through FY2020/21 as pandemic pet adoption surged (an estimated 23M US households adopted pets in 2020-2021). This was the opposite of the retail apocalypse hitting other PE-backed chains. The improved fundamentals — combined with Chewy's stock price appreciation — gave PetSmart the operating performance and asset backing to execute the 2021 refinancing at favorable terms. Without COVID's pet boom, PetSmart might have eventually filed Ch.11." },
          { label: "Chewy Stock as Collateral — HoldCo Supporting OpCo", color: T_.amber, summary: "In the 2021 refi, an Argos affiliate pledged $4B of Chewy stock as collateral for PetSmart debt — an unusual structural support.", detail: "After distributing all Chewy shares from PetSmart to Argos Holdings, an Argos affiliate pledged ~$4B of Chewy Class B stock as collateral for PetSmart's new first lien debt and guaranteed both secured and unsecured notes. This inverted the typical HoldCo/OpCo dynamic: the parent was now supporting the operating company, not the other way around. Lenders got credit for the Chewy collateral even though PetSmart itself no longer owned the shares. This creative structure — parent guarantee + external stock pledge — became a key feature of the refinancing that won over lenders who had been burned by the 2018 phantom guarantee." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "Jul 2014", event: "Longview/JANA activist pressure on PetSmart. Unaffected share price baseline set.", color: T_.textMid },
          { date: "Dec 14, 2014", event: "BC Partners consortium announces $83/share take-private ($8.7B TEV, ~9.1x EBITDA).", color: T_.purple },
          { date: "Mar 11, 2015", event: "LBO closes. ~$6.2B debt raised ($4.3B TLB + $1.9B unsecured notes + $750M ABL). Pre-LBO debt was only $560M.", color: T_.purple },
          { date: "Late 2015", event: "$800M DIVIDEND RECAP to sponsors within ~10 months of closing. ~38% of equity recouped.", color: T_.red },
          { date: "May 2017", event: "CHEWY ACQUIRED for $3.35B (largest e-commerce acquisition ever). Funded with $1.35B 1L notes + $650M unsecured + $1B equity. Total PetSmart debt: ~$8.6B.", color: T_.cyan },
          { date: "Jun 1, 2018", event: "CHEWY EQUITY TRANSFER: 20% to sponsors ($908.5M), 16.5% to unrestricted sub ($749.5M). PetSmart now owns 63.5% → Chewy guarantee AUTOMATICALLY RELEASED. ~$4.3B of secured debt loses Chewy collateral.", color: T_.red },
          { date: "Jun 26, 2018", event: "Wilmington Trust (admin agent) files lawsuit challenging the transfer. Citibank refuses to deliver guarantee release docs. Ad hoc lender group forms.", color: T_.amber },
          { date: "May 2018", event: "Moody's downgrades to Caa1. 7.125% unsecured notes trade at $0.48 — yield ~24.6%. S&P downgrades to CCC.", color: T_.red },
          { date: "Apr 17, 2019", event: "SETTLEMENT: 90% of TL lenders consent. 50bps fee, tighter covenants, $250M paydown. PetSmart commits to Chewy IPO.", color: T_.amber },
          { date: "Jun 14, 2019", event: "CHEWY IPO at $22/share. Raises ~$1.02B. Stock surges 59% on day one. Market cap: ~$15B. PetSmart paper gain: ~$10B.", color: T_.green },
          { date: "Mar 2020", event: "COVID: Pet stores deemed essential. Sales surge +36%. Pandemic pet adoption wave begins.", color: T_.green },
          { date: "Oct 2020", event: "Initial refinancing attempt withdrawn due to lender opposition on terms.", color: T_.amber },
          { date: "Feb 2021", event: "REFINANCING CLOSES: $2.3B new TL + $1.2B 1L notes (4.75%) + $1.15B unsecured (7.75%). All legacy debt retired at par. Chewy fully distributed to Argos. Argos pledges ~$4B Chewy stock as collateral.", color: T_.green },
          { date: "Jul 2023", event: "Apollo acquires minority equity stake from BC Partners (Kirkland & Ellis advised).", color: T_.textMid },
          { date: "Aug 5-8, 2025", event: "$4.7B REFINANCING executed. Launched as $1.7B TLB + $2.25B SSNs + $750M SUNs. Mid-marketing restructure: TLB upsized to $2.0B, SSNs downsized to $1.95B. Final: TLB S+400/99, SSNs 7.5%, SUNs 10%. Citi led bonds, JPM led TLB. Bloomberg: 'PetSmart Adds Investor Protections as $4.7 Billion of Debt Sold' — investors demanded protective covenants to place the deal.", color: T_.amber },
          { date: "Sep 2025", event: "Q2 2025 earnings: revenue flat, Adjusted EBITDA DOWN ~13% YoY. Post-COVID pet adoption bubble reversing.", color: T_.red },
          { date: "Dec 17, 2025", event: "Q3 2025 earnings: Revenue declining, Adjusted EBITDA DOWN 11% YoY. Consecutive double-digit declines. LFI labels as 'Special Situations / Distressed Investor Target.'", color: T_.red },
          { date: "Q3 2025", event: "$112M SPONSOR DIVIDEND paid simultaneously with the 11% EBITDA decline. BC Partners continues to extract cash while fundamentals deteriorate — parallels the 2015 $800M dividend recap pattern.", color: T_.red },
          { date: "Feb 24, 2026", event: "Chewy appoints Christopher Deppe as CFO. Chewy is fully independent but its stock is still pledged as collateral for PetSmart debt.", color: T_.textMid },
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
   WESCO / INCORA CASE
   ═══════════════════════════════════════════════════════ */

function IncoraCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    lbo: (
      <DetailPanel title="The 2020 LBO — Platinum Equity + Pattonair Merger" onClose={() => setDetail(null)}>
        <p><strong>Jan 9, 2020:</strong> Platinum Equity closed its take-private of <strong>Wesco Aircraft Holdings</strong> (NYSE: WAIR) at <strong>$11.05/share cash</strong>, valuing the deal at approximately <strong>$1.9B</strong>. Wesco was a global distributor of aerospace fasteners and hardware (C-class consumables) to OEMs including Boeing, Airbus, Lockheed and Raytheon.</p>
        <p><strong>Simultaneous merger:</strong> At closing, Wesco was combined with <strong>Pattonair</strong>, a UK-based aerospace supply-chain services company and existing Platinum portfolio asset. The combined enterprise value was approximately <strong>$2.4B</strong>, operating in 17 countries with 4,000+ employees.</p>
        <p><strong>Mar 2020:</strong> The merged company rebranded as <strong>Incora</strong>.</p>
        <p><strong>Acquisition financing:</strong> Willkie Farr arranged approximately <strong>$2.1B</strong> in debt financing. The funded notes stack consisted of three tranches: $650M of <strong>2024 Senior Secured Notes</strong>, $900M of <strong>2026 Senior Secured Notes</strong>, and $525M of <strong>2027 Senior Unsecured Notes</strong>, totaling ~$2.075B of notes debt.</p>
        <p style={{ color: T_.red }}>Holdco chain: Platinum Equity → <strong>Wolverine Topco</strong> → <strong>Wolverine Intermediate</strong> → Wesco Aircraft Holdings LLC (d/b/a Incora). The timing was unfortunate: closing in January 2020 meant the full weight of the debt hit the capital structure weeks before COVID-19 collapsed global aerospace demand.</p>
        <p>Source: Platinum Equity press release, Jan 9 2020; Willkie Farr transaction announcement; GlobeNewswire.</p>
      </DetailPanel>
    ),
    preStructure: (
      <DetailPanel title="Pre-Trade Capital Structure (March 2022)" onClose={() => setDetail(null)}>
        <p>Going into March 2022, Incora's funded notes stack was:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>2024 Senior Secured Notes (1L):</strong> ~$650M outstanding. Pari passu with 2026 1L under shared collateral.</li>
          <li><strong>2026 Senior Secured Notes (1L):</strong> ~$900M outstanding. The larger of the two 1L tranches — its indenture governed the key votes.</li>
          <li><strong>2027 Senior Unsecured Notes:</strong> ~$525M outstanding. Structurally junior to both 1L tranches.</li>
        </ul>
        <p>Plus an <strong>ABL facility</strong> (undisclosed size, secured by receivables/inventory — typical of distributor capital structures). The ABL was not part of the 2022 trade and was paid in full through the DIP.</p>
        <p style={{ color: T_.amber }}>The critical mechanic: under the <strong>2026 Indenture</strong>, a simple majority of holders could amend most terms — but a <strong>2/3 supermajority</strong> was required to make amendments that "<strong>have the effect of releasing</strong>" all or substantially all collateral. This broader-than-usual sacred right language would become the linchpin of Judge Isgur's 2024 ruling and the entire pro-minority legal theory.</p>
      </DetailPanel>
    ),
    uptier: (
      <DetailPanel title="The March 2022 Uptier — The 'Domino' Transaction" onClose={() => setDetail(null)}>
        <p>The defining transaction of the case — a multi-step maneuver that became the template for aggressive liability management and the target of the first post-trial bankruptcy court invalidation.</p>
        <p><strong>Step 1 — Manufacture a supermajority:</strong></p>
        <p>Incora and the <strong>PSP Group (PIMCO + Silver Point)</strong> executed the <strong>3rd Supplemental Indenture</strong> to the 2026 notes, authorizing issuance of <strong>additional 2026 notes</strong> to the PSP Group. This required only a simple majority — which PSP already had. The newly-issued notes flipped the vote count: PSP Group now held a <strong>2/3 supermajority</strong> in the 2026 tranche.</p>
        <p><strong>Step 2 — Use the manufactured supermajority to release collateral:</strong></p>
        <p>With 2/3 votes in hand, PSP passed further amendments stripping liens and collateral protections from the original 2026 notes — clearing the path for a non-pro-rata exchange.</p>
        <p><strong>Step 3 — Create a new super-priority tranche:</strong></p>
        <p>PSP Group was issued a new <strong>priming tranche of 2026 notes</strong> at <strong>7.5% cash / 3.0% PIK</strong>, sitting ahead of the original 2024/2026 1L in the collateral waterfall. Approximately <strong>$1.0B of PSP's existing 2024/2026 1L notes were rolled</strong> into this new priming tranche. Non-participating 1L holders — BlackRock, JPMorgan, King Street, others — were left with stripped collateral and subordinated lien rank.</p>
        <p><strong>Step 4 — New money:</strong></p>
        <p>PSP Group backstopped <strong>$250M of new money</strong> into the priming tranche, providing liquidity for operations and fees.</p>
        <p><strong>Step 5 — The 2027 side trade:</strong></p>
        <p>Simultaneously, approximately <strong>$446M (reported as ~$497M face)</strong> of 2027 unsecured notes held by <strong>Carlyle and Platinum Equity itself</strong> were exchanged into new <strong>1.25-lien 2027 secured notes</strong>, jumping them ahead of non-participating 2027 unsecured holders. Platinum — the sponsor — participated on both sides of the transaction it controlled.</p>
        <p style={{ color: T_.red }}>The cumulative effect: PSP promoted itself to super-senior, Carlyle/Platinum promoted themselves from unsecured to 1.25L, and everyone excluded — BlackRock, JPM, King Street, Langur Maize — was structurally subordinated. The minority holders' liens weren't technically cancelled but were rendered economically worthless by the new priming debt sitting on top.</p>
        <p>Source: Cleary Gottlieb "Bankruptcy Court Finds Incora's Uptier Exchange is a Bust"; Harrison Huai Substack; Octus/Reorg Research; Bloomberg Apr 5 2022 "Silver Point, PIMCO Cook Up Credit Trade That Has Rivals Fuming."</p>
      </DetailPanel>
    ),
    participants: (
      <DetailPanel title="The PSP Group — Participating Holders" onClose={() => setDetail(null)}>
        <p><strong>PSP Group</strong> (Participating Supporting Parties) — the coalition that executed the uptier:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>PIMCO</strong> — anchor participant on the 1L side. Previously the architect of the Serta uptier (2020). Deep experience in non-pro-rata LME.</li>
          <li><strong>Silver Point Capital</strong> — co-lead on the 1L side. Distressed credit specialist.</li>
          <li><strong>Carlyle Group</strong> — lead participant on the 2027 unsecured-to-1.25L exchange.</li>
          <li><strong>Platinum Equity</strong> — the sponsor itself held 2027 unsecured notes and participated in the 1.25L exchange, giving itself secured status on its own bankruptcy-bound portfolio company.</li>
        </ul>
        <p style={{ color: T_.amber }}>This was the first widely-reported uptier where the <strong>sponsor itself participated as a creditor</strong> in a transaction that primed other creditors. That fact would become central to Langur Maize's breach-of-duty claims and to Judge Isgur's separate finding that Platinum's participation violated the 2027 indenture's pro rata treatment requirement.</p>
        <p><strong>Legal counsel for PSP:</strong> Davis Polk &amp; Wardwell represented the ad hoc 2026 secured noteholder group through the Chapter 11 case.</p>
        <p>Source: Bloomberg Apr 5 2022; Restructuring Interviews Substack; Davis Polk emergence announcement.</p>
      </DetailPanel>
    ),
    minority: (
      <DetailPanel title="Non-Participating Minority Holders" onClose={() => setDetail(null)}>
        <p>The holders who were excluded from the 2022 trade and whose positions were structurally subordinated:</p>
        <p><strong>On the 1L side:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>BlackRock</strong> — held meaningful positions across the 2024 and 2026 1L notes</li>
          <li><strong>JPMorgan Chase</strong> (asset management)</li>
          <li><strong>King Street Capital</strong></li>
          <li>Various smaller institutional holders</li>
        </ul>
        <p><strong>On the 2027 unsecured side:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Langur Maize LLC</strong> — the lead plaintiff. A single holder of 2027 unsecured notes, advised by <strong>Jones Day</strong>. Langur Maize filed the initial NY Supreme Court action in January 2023 and became the driving force behind the adversary proceeding that produced Judge Isgur's ruling.</li>
        </ul>
        <p><strong>Legal counsel for the minority in the bankruptcy adversary:</strong> <strong>Kobre &amp; Kim</strong> — took depositions of Incora's CFO that became central to the LME adversary trial.</p>
        <p style={{ color: T_.red }}>These holders went into the trade holding 1L secured notes backed by the issuer's collateral. They came out holding the same face amount of notes — but now sitting behind a new priming tranche backed by the same collateral. Their recovery in the eventual bankruptcy plan was approximately <strong>1.6% of new equity + $7.5M cash</strong>, versus PSP's ~98.4% of equity + $420M convertible takeback notes.</p>
        <p>Source: Bloomberg Law Jul 2024; Schulte Roth &amp; Zabel alert; CreditSights coverage of trial depositions.</p>
      </DetailPanel>
    ),
    langurLit: (
      <DetailPanel title="Langur Maize Pre-Bankruptcy Litigation" onClose={() => setDetail(null)}>
        <p><strong>Plaintiff:</strong> Langur Maize LLC, represented by <strong>Jones Day</strong>.</p>
        <p><strong>Filed:</strong> January 2023 in New York Supreme Court (Commercial Division), Manhattan.</p>
        <p><strong>Defendants:</strong> Wesco Aircraft Holdings / Incora, plus the participating 2027 unsecured noteholders (including Carlyle affiliates and Platinum Equity affiliates).</p>
        <p><strong>Claims:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Breach of the 2027 Indenture</strong> — the exchange of selected 2027 unsecured notes into 1.25L secured notes violated the pro rata treatment requirement.</li>
          <li><strong>Breach of the implied covenant of good faith and fair dealing</strong></li>
          <li><strong>Preferential transfer</strong> / fraudulent conveyance theories aimed at the $250M new money and the uptier economics</li>
          <li>Tortious interference and aiding-and-abetting claims against the participating holders</li>
        </ul>
        <p>Incora filed Ch.11 in <strong>June 2023</strong>, staying the NY action. The substantive claims were transferred into the bankruptcy as an <strong>adversary proceeding</strong>, which Judge Isgur tried in 2024. The minority holders substantially survived summary judgment — SRZ described the case as "largely survives summary judgment" — meaning the court found enough factual disputes to require a full trial.</p>
        <p style={{ color: T_.amber }}>Langur Maize's decision to sue <strong>as a single holder</strong> rather than wait for a larger coalition was unusual and arguably decisive. Most minority holders in uptier situations settle rather than litigate. Langur's willingness to pursue the full trial produced the legal record that made Isgur's ruling possible.</p>
        <p>Source: SRZ "Minority Holders' Challenge to Wesco's Multi-Step Uptiering Transaction Largely Survives Summary Judgment"; NY Supreme Court filings.</p>
      </DetailPanel>
    ),
    filing: (
      <DetailPanel title="Chapter 11 Filing — June 2023" onClose={() => setDetail(null)}>
        <p><strong>Filing date:</strong> June 1, 2023.</p>
        <p><strong>Court:</strong> U.S. Bankruptcy Court for the Southern District of Texas, <strong>Houston Division</strong>.</p>
        <p><strong>Lead case:</strong> <em>In re Wesco Aircraft Holdings Inc., et al.</em>, Case No. <strong>23-90611</strong>.</p>
        <p><strong>Debtor entities:</strong> <strong>44 affiliated debtors</strong> filed voluntary petitions.</p>
        <p><strong>Initial judge:</strong> David R. Jones (DRJ). After Judge Jones's resignation in <strong>October 2023</strong> (unrelated scandal), the case and the critical LME adversary proceeding were reassigned. Judge <strong>Marvin Isgur</strong> ultimately tried and ruled on the adversary.</p>
        <p><strong>Counsel:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Debtors:</strong> Milbank LLP</li>
          <li><strong>Ad hoc 1L / PSP Group:</strong> Davis Polk &amp; Wardwell</li>
          <li><strong>Minority holders (adversary plaintiffs):</strong> Kobre &amp; Kim</li>
          <li><strong>Prepetition ABL agent:</strong> Cahill Gordon &amp; Reindel</li>
        </ul>
        <p><strong>DIP financing:</strong> Over <strong>$300M super-priority DIP</strong> provided by PIMCO and Silver Point (i.e., the same PSP Group that had executed the uptier). <strong>$110M available on an interim basis</strong>. The optics of the uptier participants also serving as DIP lenders were noted widely in restructuring press.</p>
        <p><strong>Drivers of distress:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>COVID-era aerospace demand collapse (2020-2022)</li>
          <li>Boeing 737 MAX grounding and subsequent production disruptions</li>
          <li>Customer losses and inventory writedowns</li>
          <li>High leverage from the January 2020 LBO financing — timing was particularly bad</li>
          <li>The 2022 uptier bought <strong>14 months</strong> before the company filed anyway</li>
        </ul>
        <p>Source: Verita/Kroll docket at veritaglobal.net/incora; GlobeNewswire Jun 1 2023; Milbank, Davis Polk, Cahill press releases.</p>
      </DetailPanel>
    ),
    isgurRuling: (
      <DetailPanel title="Judge Isgur's July 2024 Ruling — The Landmark" onClose={() => setDetail(null)}>
        <p><strong>July 10, 2024:</strong> Judge <strong>Marvin Isgur</strong> issued an oral bench ruling holding that the <strong>March 2022 uptier exchange breached both the 2026 and 2027 note indentures</strong>. This was described by the American Bankruptcy Institute as a "shocker" — the first post-trial bankruptcy court ruling to actually invalidate a major non-pro-rata uptier LME on indenture-breach grounds.</p>
        <p><strong>The "integrated transaction" doctrine:</strong></p>
        <p>Isgur adopted a <strong>domino theory</strong>: the initial simple-majority amendment authorizing issuance of additional 2026 notes to PSP was the "first domino," and all subsequent amendments (lien releases, priming) had to be tested <strong>as a single integrated transaction</strong>, not as independent steps. You couldn't engineer a supermajority by issuing to one side and then use that manufactured supermajority to strip the other side's collateral.</p>
        <p><strong>The sacred rights holding:</strong></p>
        <p>Because the 2026 indenture prohibited amendments that "<strong>have the effect of releasing</strong>" all or substantially all collateral without <strong>2/3 consent of each affected holder</strong>, and because the collateral release was effectively inevitable once the first amendment issued new notes to PSP, the entire amendment package violated the indenture's sacred rights — which required non-participating holders' consent. They never gave it.</p>
        <p><strong>Remedy:</strong></p>
        <p>Isgur <strong>restored the liens and interests of all 2026 secured noteholders</strong>, unwinding the priming effect of the uptier. PSP Group was left with an <strong>unsecured claim on the $250M of new money</strong> they had contributed (subject to further equitable relief).</p>
        <p><strong>Separately on Platinum:</strong></p>
        <p>Isgur held that Platinum Equity's own participation in the 2027 unsecured-to-1.25L exchange violated the 2027 indenture's pro rata treatment requirement — a separate finding that the sponsor had breached its obligations as a noteholder.</p>
        <p style={{ color: T_.red }}>The ruling was widely read as the first major court decision to validate the "broad collateral-release sacred right" theory and the integrated-transaction doctrine. It predated the Fifth Circuit's December 2024 <em>Serta</em> reversal and was seen as evidence that courts were finally pushing back on aggressive LME.</p>
        <p>Source: Cleary Gottlieb; Octus/Reorg Research "Voiding Wesco/Incora Uptier Exchange"; ABI "Special Feature: Incora Decision Shocker"; Rabinowitz Lubetkin commentary on integrated transaction doctrine.</p>
      </DetailPanel>
    ),
    craneReversal: (
      <DetailPanel title="District Court Reversal — Judge Crane (Jan 2025 Preview / Dec 2025 Full Opinion)" onClose={() => setDetail(null)}>
        <p><strong>The reversal came in two stages, 11 months apart:</strong></p>
        <p><strong>January 2025 — the preview:</strong> U.S. District Judge <strong>Randy Crane</strong> (S.D. Texas) surprised the restructuring community with an oral/preview ruling indicating he would reverse the core of Isgur's July 2024 holding. The oral ruling didn't contain the full legal reasoning — practitioners had to wait.</p>
        <p><strong>December 8-9, 2025 — the full written opinion:</strong> Crane released his complete written opinion with detailed legal reasoning, 11 months after the preview. Two separate holdings:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Reversed Isgur's integrated-transaction doctrine:</strong> Crane rejected the bankruptcy court's determination that issuance of new notes led directly to stripping of excluded noteholders' liens. He held that the 2026 indenture's sacred rights language, read textually, did not give minority noteholders the right to block the transaction. The indenture prohibited amendments that released <em>existing collateral</em>, but did not prohibit issuing new notes that diluted existing holders' voting power. "The minority noteholders didn't have that sacred right," Crane held.</li>
          <li><strong>Dismissed the 2024/2026 noteholders' breach of contract claims</strong> entirely — a separate holding beyond the sacred-rights analysis. The contract-breach theory failed on its own terms.</li>
        </ul>
        <p>Crane described the uptier as "<strong>perfectly proper</strong>" under the 2026 indenture as written — a sharp rebuke to Isgur's integrated-transaction analysis.</p>
        <p style={{ color: T_.red }}><strong>The Octus "Breaking the Chain" doctrinal framing (Dec 10, 2025):</strong> Reorg/Octus's Covenants team characterized the full opinion under the headline <em>"Breaking the Chain: District Court's Wesco Opinion Limits 'Effect of' Sacred Rights Protections, a Boon for Vote-Rigging and Other Multi-Step LMEs."</em> The framing signals the broader market takeaway — Crane's narrow reading of the "effect of" sacred-rights language means multi-step LMEs that manufacture votes to then release collateral are harder to attack than Isgur thought.</p>
        <p><strong>Jan 7-8, 2026 — Fifth Circuit appeal filed:</strong> Minority 2026 noteholders filed a petition for Fifth Circuit review of Crane's reversal. The Incora legal saga now sits on parallel tracks with <em>Serta</em>: both are in the Fifth Circuit, both test the textualist vs. equitable reading of loan and indenture provisions. Decision timeline unknown as of early 2026.</p>
        <p style={{ color: T_.amber }}>The practical state of the law post-Dec 2025 / pre-5th Cir ruling: <em>Serta</em> (5th Cir. Dec 2024) struck down that uptier on "open market purchase" grounds — a contract-definition win. <em>Incora</em> (Crane full opinion Dec 2025) upheld a different uptier on sacred-rights grounds — a contract-textualist loss. Minority protection now depends almost entirely on the exact words in the indenture, not on equitable principles. The 5th Circuit's Incora ruling — whenever it comes — will either confirm or unsettle this dichotomy.</p>
        <p>Source: Octus "District Court Surprises with Preview of Ruling Reversing Judge Isgur on Incora/Wesco Uptier Exchange" (Jan 2025); Octus "District Court Explains Reversal..." (Dec 8, 2025); Octus Covenants "Breaking the Chain..." (Dec 10, 2025); Bloomberg Law "Incora's Disputed Debt Deal Didn't Breach Contracts, Judge Rules" (Dec 9, 2025); 9fin "Incora minority noteholder group appeals 2022 uptier to Fifth Circuit" (Jan 8, 2026).</p>
      </DetailPanel>
    ),
    planTreatment: (
      <DetailPanel title="Chapter 11 Plan Treatment — Class Recoveries" onClose={() => setDetail(null)}>
        <p><strong>Plan confirmed:</strong> December 27, 2024 (post-Isgur ruling, pre-Crane reversal). The plan incorporated a <strong>global settlement</strong> between the PSP Group and the minority holders resolving the adversary proceeding.</p>
        <p><strong>Emerged:</strong> January 31, 2025 — approximately <strong>20 months</strong> in Chapter 11.</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Class</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Treatment</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Recovery</th>
          </tr></thead>
          <tbody>
            {[
              { cls: "ABL Claims", treat: "Paid in full", rec: "100%", c: T_.green },
              { cls: "DIP Claims (>$300M)", treat: "Exchanged into new secured exit notes", rec: "100%", c: T_.green },
              { cls: "First-Lien Secured Notes (PSP + others)", treat: "~98.4% new common equity + $420M convertible takeback notes", rec: "~98.4% equity", c: T_.blue },
              { cls: "Unsecured Claims (Global Settlement)", treat: "~1.6% new common equity + $7.5M cash", rec: "~1.6%", c: T_.red },
              { cls: "Old Platinum Equity", treat: "Cancelled", rec: "0%", c: T_.red },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.cls}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.treat}</td>
                <td style={{ padding: "6px 8px", color: r.c, fontWeight: 600, textAlign: "right" }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: T_.amber }}><strong>Exit Financing:</strong> <strong>$100M</strong> in new exit debt + the $420M convertible takeback notes issued to the 1L class.</p>
        <p><strong>New Ownership:</strong> Majority owned by the former first-lien secured noteholders — principally the PSP Group (PIMCO, Silver Point) and the ad hoc 1L group advised by Davis Polk. Old Platinum sponsor equity cancelled.</p>
        <p><strong>The settlement math:</strong> Even after Isgur's ruling went against them, PSP still ended up with ~98.4% of the reorganized equity. The minority holders got a token ~1.6% + $7.5M cash as part of a negotiated settlement that released the adversary claims and avoided further appeals (at the bankruptcy level). The judicial finding of breach did not translate into proportional economic recovery — a reminder that winning in court is different from winning in the claims waterfall.</p>
        <p><strong>Post-Emergence Events (2025-2026):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Feb 3, 2026:</strong> S&amp;P assigns <strong>Incora Intermediate II LLC 'B-' / Debt 'B-' / Outlook Stable</strong> — first post-emergence rating, establishing the reorganized company's credit profile.</li>
          <li><strong>Feb 5, 2026:</strong> Incora Intermediate II LLC <strong>admitted to the Official List</strong> (LSE) — post-emergence debt now publicly listed, signaling reintegration into mainstream credit markets.</li>
          <li style={{ color: T_.amber }}><strong>Mar 12, 2026:</strong> <strong>Reorganized Incora sues its D&amp;O insurers to recoup $30M in uptier litigation defense costs.</strong> The company that executed the March 2022 uptier is now trying to claw back the cost of defending it from insurance carriers. A notable post-emergence event and a reminder that the economic consequences of the 2022 trade are still being litigated.</li>
        </ul>
        <p>Source: Milbank "Milbank Advises Incora Through Successful Chapter 11 Restructuring"; Davis Polk "Incora Emerges from Chapter 11"; Incora GlobeNewswire Jan 31 2025; Reorg "Incora/Wesco Sues D&amp;O Insurers to Recoup $30M in Uptier Litigation Defense Costs" (Mar 12, 2026).</p>
      </DetailPanel>
    ),
    blockers: (
      <DetailPanel title="Market Impact & 'Incora Blockers'" onClose={() => setDetail(null)}>
        <p><strong>The doctrinal gift and the doctrinal takeback:</strong></p>
        <p>For ~6 months between Isgur's July 2024 ruling and Crane's January 2025 reversal, <em>Incora</em> was the single most important minority-lender precedent in modern LME. Credit agreements were being redrafted to invoke the "integrated transaction doctrine." Post-Crane, most of that enthusiasm evaporated — but the drafting changes remain.</p>
        <p><strong>"Incora Blockers":</strong></p>
        <p>New indentures and credit agreements post-2023 increasingly include covenant language preventing issuers from using majority-vote supplemental indentures to <strong>mint additional notes solely for the purpose of assembling a supermajority</strong> capable of releasing collateral or subordinating non-participants. This blocks the Step 1 of the Incora playbook.</p>
        <p>Common provisions now include:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Anti-dilution sacred rights — newly issued notes cannot vote on amendments affecting existing holders</li>
          <li>Explicit pro rata sharing requirements for any exchange or buyback</li>
          <li>Cross-tranche voting restrictions preventing one series from voting amendments to another</li>
          <li>"Sponsor debt" disenfranchisement — notes held by the sponsor or its affiliates cannot vote on LME-related amendments</li>
        </ul>
        <p><strong>Comparison table:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Serta (2020/2024):</strong> Minority holders won at the Fifth Circuit on the "open market purchase" definition in the term loan agreement. Won by contract terms.</li>
          <li><strong>Mitel (NY 1st Dept, 2024):</strong> Upheld the uptier as permitted by loan documents — textualist approach, similar to Crane on Incora.</li>
          <li><strong>TriMark (NY Supreme, 2021):</strong> Fraudulent-conveyance and good-faith claims survived motion to dismiss; settled.</li>
          <li><strong>J.Crew (2017) / Envision (2022):</strong> "Trap door" drop-down transactions — different mechanic (moving assets out of the credit group) versus Incora's uptier (stripping seniority in place).</li>
          <li><strong>Wesco/Incora (2022/2024/2025):</strong> Uptier with vote-manufacturing. Bankruptcy court invalidated, District Court reversed. Net legal outcome: <em>textualist reading wins</em>.</li>
        </ul>
        <p style={{ color: T_.red }}>The post-Incora / post-Crane market takeaway: <strong>minority lender protection cannot rely on good-faith theories or implied covenants.</strong> If you want protection against an uptier, you must negotiate an explicit pro rata sharing and/or voting-dilution sacred right up front. The era of "the court will find this unfair" is over.</p>
        <p>Source: Creditor Rights Coalition "Liability Management Whack-a-Mole"; Norton Rose Fulbright; Greenberg Traurig "Serta, Mitel and Incora's Potential Impact on Uptiers"; National Law Review.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Global aerospace &amp; defense fastener distributor. <span style={{ color: T_.purple }}>Platinum Equity</span> took Wesco Aircraft private in Jan 2020 for ~$1.9B and merged it with Pattonair into Incora — weeks before COVID collapsed aerospace demand. In March 2022, <span style={{ color: T_.amber }}>PIMCO and Silver Point (the "PSP Group")</span> executed the defining <span style={{ color: T_.accent }}>"domino" uptier exchange</span> — first issuing new 2026 notes to themselves to manufacture a 2/3 supermajority, then using that vote to strip collateral from non-participating 1L holders and raise <span style={{ color: T_.red }}>$250M of priming new money</span>. Platinum itself participated on the 2027 side, exchanging unsecured notes it held into new 1.25-lien debt. The transaction bought ~14 months before Incora filed Ch.11 in June 2023. Judge <span style={{ color: T_.blue }}>Marvin Isgur</span> issued a <span style={{ color: T_.accent }}>landmark July 2024 ruling</span> — adopting the "integrated transaction doctrine" and holding the uptier violated the indenture's sacred rights — only for District Judge <span style={{ color: T_.red }}>Randy Crane</span> to reverse it (Jan 2025 preview / <strong>Dec 2025 full opinion</strong>) on strict textualist grounds. <span style={{ color: T_.accent }}>The saga continues:</span> minority 2026 noteholders <strong>filed a Fifth Circuit appeal in Jan 2026</strong>, putting Incora on parallel tracks with Serta at the 5th Cir. Post-emergence, Incora got its first S&amp;P rating (B-/Stable, Feb 2026) and is now <strong>suing its own D&amp;O insurers for $30M</strong> in uptier defense costs. Minority settled at ~1.6% equity + $7.5M cash; PSP walked with ~98.4% of equity + $420M convertible takeback notes. The case spawned <span style={{ color: T_.accent }}>"Incora Blockers"</span> in new indentures.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Total Notes Debt", v: "~$2.08B", c: T_.red },
            { l: "Filed", v: "Jun 1, 2023", c: T_.red },
            { l: "Emerged", v: "Jan 31, 2025", c: T_.green },
            { l: "Time in Ch.11", v: "~20 months", c: T_.textMid },
            { l: "DIP Size", v: ">$300M", c: T_.blue },
            { l: "Fulcrum", v: "1L Secured Notes", c: T_.blue },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate &amp; Capital Structure</div>
          <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>At filing, June 2023. Click any entity or tranche for details. Case 23-90611, S.D. Tex., initially Judge D.R. Jones → reassigned to Judge Marvin Isgur for the LME adversary.</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group / Loan Parties</span></span>
            <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.accent}50`, background: `${T_.accent}08`, display: "inline-block" }} /><span style={{ color: T_.accent }}>Post-Uptier Priming Tranche</span></span>
          </div>
        </div>

        <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

          {/* ROW 1: Sponsor */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              label="Platinum Equity"
              sub="PE Sponsor · LBO closed Jan 9, 2020 · ~$1.9B take-private + Pattonair merger"
              color={T_.purple}
              badges={[
                { text: "EQUITY CANCELLED — $0", color: T_.red },
                { text: "ALSO A 2027 NOTEHOLDER", color: T_.amber },
              ]}
              onClick={() => toggle("lbo")} selected={detail === "lbo"}
              width={440}
            />
          </div>

          <VLineLabel label="100% equity (via merger sub)" color={T_.purple} />

          {/* ROW 2: Wolverine Topco */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              label="Wolverine Topco"
              sub="HoldCo · Delaware · Not a borrower or guarantor"
              color={T_.red}
              badges={[{ text: "STRUCTURALLY SUBORDINATED", color: T_.red }]}
              width={380}
            />
          </div>

          <VLineLabel label="100% equity" />

          {/* ROW 3: Wolverine Intermediate */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              label="Wolverine Intermediate"
              sub="Intermediate HoldCo · Delaware"
              color={T_.textMid}
              width={360}
            />
          </div>

          <VLineLabel label="100% equity" />

          {/* ROW 4: Wesco / Incora OpCo */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              label="Wesco Aircraft Holdings LLC (d/b/a Incora)"
              sub="Primary OpCo · Issuer of 2024, 2026, 2027 notes · 44 affiliated debtors"
              color={T_.blue}
              badges={[
                { text: "ISSUER", color: T_.blue },
                { text: "RESTRICTED GROUP", color: T_.green },
              ]}
              debt={[
                { name: "$650M 2024 Senior Secured Notes (1L)", amount: "Pre-trade", color: T_.amber },
                { name: "$900M 2026 Senior Secured Notes (1L)", amount: "Pre-trade", color: T_.amber },
                { name: "$525M 2027 Senior Unsecured Notes", amount: "Pre-trade", color: T_.red },
                { name: "ABL Facility", amount: "100% recovery", color: T_.green },
              ]}
              width={540}
            />
          </div>

          {/* Subsidiary line */}
          <VLineLabel label="44 debtor entities · Pattonair UK + Wesco US + international subs" />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              label="Operating Subsidiaries (43)"
              sub="US + UK + international distribution entities · Guarantors of notes"
              color={T_.textMid}
              width={420}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         THE UPTIER — Before & After
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>The March 2022 Uptier — Before &amp; After</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 10 }}>Click any tranche for details.</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 12, alignItems: "start" }}>
          {/* BEFORE */}
          <div style={{ padding: "16px", background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T_.textMid, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Pre-Trade (Feb 2022)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Box
                label="$650M 2024 Senior Secured Notes"
                sub="1L pari passu with 2026 notes"
                color={T_.amber}
                onClick={() => toggle("preStructure")} selected={detail === "preStructure"}
              />
              <Box
                label="$900M 2026 Senior Secured Notes"
                sub="1L pari passu · simple majority amends, 2/3 for collateral release"
                color={T_.amber}
                onClick={() => toggle("preStructure")} selected={detail === "preStructure"}
              />
              <Box
                label="$525M 2027 Senior Unsecured Notes"
                sub="Structurally junior · held in part by Platinum &amp; Carlyle"
                color={T_.red}
                onClick={() => toggle("preStructure")} selected={detail === "preStructure"}
              />
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: T_.textGhost, textAlign: "right" }}>Total: ~$2.075B notes debt</div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 240 }}>
            <div style={{ fontSize: 28, color: T_.accent }}>→</div>
          </div>

          {/* AFTER */}
          <div style={{ padding: "16px", background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.accent}44` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T_.accent, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Post-Trade (March 2022)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Box
                label="NEW 2026 Priming Notes (Super-Senior)"
                sub="7.5% cash + 3.0% PIK · ~$1B rolled from PSP's 1L + $250M new money"
                color={T_.accent}
                borderColor={T_.accent}
                badges={[{ text: "PSP GROUP: PIMCO + SILVER POINT", color: T_.accent }]}
                onClick={() => toggle("uptier")} selected={detail === "uptier"}
              />
              <Box
                label="Remaining 2024 / 2026 Notes (Subordinated)"
                sub="Held by BlackRock, JPM, King Street, others · Stripped of effective lien priority"
                color={T_.red}
                dashed
                onClick={() => toggle("minority")} selected={detail === "minority"}
              />
              <Box
                label="NEW 1.25-Lien 2027 Notes"
                sub="~$446M face · Held by Carlyle + Platinum Equity"
                color={T_.amber}
                badges={[{ text: "SPONSOR PARTICIPATED", color: T_.red }]}
                onClick={() => toggle("participants")} selected={detail === "participants"}
              />
              <Box
                label="Remaining 2027 Unsecured Notes"
                sub="Excluded minority · Langur Maize led NY litigation"
                color={T_.red}
                dashed
                onClick={() => toggle("minority")} selected={detail === "minority"}
              />
            </div>
          </div>
        </div>

        {/* Key mechanics callout */}
        <div style={{ marginTop: 14, padding: "12px 16px", background: `${T_.accent}08`, borderRadius: 8, border: `1px solid ${T_.accent}33`, fontSize: 12, color: T_.textMid, lineHeight: 1.7 }}>
          <strong style={{ color: T_.accent }}>The Domino:</strong> PSP used a simple-majority amendment to issue new 2026 notes to themselves, manufacturing a 2/3 supermajority. That supermajority then voted to release collateral and permit the priming exchange — all steps Judge Isgur later held had to be analyzed as a <strong>single integrated transaction</strong>.
        </div>
      </div>


      {/* ════════════════════════════════════════════════════
         DETAIL PANEL RENDER
         ════════════════════════════════════════════════════ */}
      {detail && panels[detail]}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "The 'Domino' Uptier — Manufacturing a Supermajority", color: T_.accent, summary: "Issue new notes to friendly holders first to flip the vote count, then use that vote to strip collateral from everyone else.", detail: "The 2026 indenture allowed simple-majority amendments for most terms but required 2/3 consent for amendments 'having the effect of releasing' collateral. PSP Group (PIMCO + Silver Point) had a simple majority but not 2/3. Step 1: use simple majority to issue additional 2026 notes to PSP — legal on its face. Step 2: PSP now holds 2/3. Step 3: use that manufactured supermajority to release collateral and permit the priming exchange. Step 4: raise $250M new money into the new super-priority tranche. Non-participating 1L holders (BlackRock, JPM, King Street) saw their liens rendered economically worthless by the new priming debt on top of the same collateral. This was the first major uptier to use a vote-manufacturing mechanic at the supplemental indenture level." },
          { label: "Integrated Transaction Doctrine", color: T_.blue, summary: "Judge Isgur's July 2024 holding that multi-step LMEs must be analyzed as a single transaction, not as independent steps.", detail: "Isgur's core legal theory: the initial amendment issuing new notes to PSP was the 'first domino' and had to be tested together with everything that followed, because the collateral release was effectively inevitable once that first step went through. Under this view, the entire amendment package violated the 2026 indenture's sacred right against collateral release without 2/3 consent of each affected holder. It didn't matter that Step 1 was technically permissible in isolation — if Steps 2-4 were baked in from the start, the court would collapse them into a single integrated transaction. Judge Randy Crane reversed this in January 2025, holding that the indenture's sacred rights language, read textually, did not cover vote-dilution-by-new-issuance. The doctrine now depends on Fifth Circuit review for survival." },
          { label: "Sacred Rights — The Indenture Holy Writ", color: T_.amber, summary: "Indenture provisions requiring supermajority or unanimous consent for the most protective terms — usually payment, maturity, and collateral.", detail: "Most indenture amendments require only simple majority. 'Sacred rights' are carve-outs requiring higher thresholds (typically 2/3 or unanimous) for changes to core economic protections: principal amount, interest rate, maturity date, currency, and — critically — collateral. The 2026 Incora indenture's sacred rights included amendments 'having the effect of releasing all or substantially all collateral,' which is broader than typical. That broader language was what let Isgur find a breach. Post-Crane, the lesson is that sacred rights must be drafted explicitly to cover vote-dilution-by-new-issuance — relying on 'effect-of-releasing' language is no longer sufficient after a textualist court can narrow it. New indentures now increasingly include anti-dilution sacred rights covering the manufactured-supermajority mechanic directly." },
          { label: "Sponsor on Both Sides — Platinum's Participation", color: T_.purple, summary: "The PE sponsor itself held 2027 unsecured notes and participated in the exchange that primed other creditors of its own portfolio company.", detail: "Platinum Equity — Incora's sponsor — held 2027 unsecured notes alongside Carlyle. When the March 2022 uptier exchanged ~$446M of 2027 unsecured notes into new 1.25-lien secured notes, Platinum was among the participants. This meant the sponsor was promoting itself from unsecured to secured status in the debt stack of the portfolio company it controlled, ahead of other 2027 holders it hadn't invited. Judge Isgur separately held that Platinum's participation breached the 2027 indenture's pro rata treatment requirement. Judge Crane reversed this too on textualist grounds. One of the first widely reported uptiers where the sponsor itself was on both sides — a structural conflict that fueled the minority's breach-of-duty theories." },
          { label: "DIP Lender = Prepetition LME Participant", color: T_.red, summary: "PIMCO and Silver Point executed the uptier in 2022 and then provided the >$300M DIP when the company filed in 2023.", detail: "The same parties that had stripped minority holders' collateral prepetition became the lenders of last resort in bankruptcy. This gave PSP enormous procedural leverage throughout the case: they controlled cash on hand, set milestones, and sat across the table from the minority in the adversary proceeding they were defending. DIP roll-up provisions can also insulate prepetition positions from challenge. This is one reason the minority's economic recovery (~1.6% equity + $7.5M cash) diverged so sharply from their legal win under Isgur's ruling. The process was not neutral — PSP's DIP control shaped every negotiation up to the global settlement." },
          { label: "'Incora Blockers' — Market Response", color: T_.green, summary: "Post-2023 indentures include covenant language preventing issuers from minting new notes to manufacture supermajorities.", detail: "The market response to the Incora mechanic has been a new generation of LME blockers. Typical 'Incora Blocker' provisions include: (1) anti-dilution sacred rights — newly issued notes cannot vote on amendments affecting existing holders, (2) explicit pro rata sharing requirements for any exchange or buyback, (3) cross-tranche voting restrictions preventing one series from voting amendments to another, (4) 'sponsor debt' disenfranchisement — notes held by the sponsor or affiliates cannot vote on LME-related amendments. The drafting changes survived even Crane's January 2025 reversal, because post-Crane the legal environment makes explicit language even more important — you can't rely on equitable doctrines or broad sacred-rights readings to save you anymore. Incora Blockers joined J.Crew Blockers, Envision Blockers, and Serta Blockers in the standard LME protection suite." },
          { label: "Winning the Ruling vs. Winning the Waterfall", color: T_.emerald, summary: "Isgur's July 2024 ruling in favor of the minority produced only ~1.6% equity + $7.5M cash in the December 2024 plan settlement.", detail: "Incora illustrates a hard truth about bankruptcy litigation: winning a landmark ruling and winning the plan recovery are different things. Langur Maize and the minority 1L holders got a full legal win from Judge Isgur in July 2024 — uptier invalidated, liens restored, sponsor participation held to breach. Five months later, the plan was confirmed with PSP taking ~98.4% of reorganized equity + $420M convertible takeback notes, while the minority got ~1.6% equity + $7.5M cash. The settlement discount reflected several factors: PSP's DIP control, appeal risk (ultimately validated by Crane's reversal), the cost and delay of further litigation, and the fact that 1L claims still outranked 2027 unsec in the waterfall regardless of who won the adversary. The broader lesson: courtroom wins in LME cases produce drafting precedents for the next deal, not proportional recovery in the current one." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "2012", event: "Wesco Aircraft IPOs on NYSE (WAIR) as a standalone aerospace fastener distributor.", color: T_.textMid },
          { date: "Jan 9, 2020", event: "Platinum Equity closes take-private of Wesco Aircraft at $11.05/share (~$1.9B). Simultaneously merges with Pattonair (Platinum portfolio co) for ~$2.4B combined EV. ~$2.1B debt financing arranged.", color: T_.purple },
          { date: "Mar 2020", event: "Merged company rebrands as INCORA. COVID collapses global aerospace demand weeks after LBO closes. Boeing 737 MAX disruptions continue.", color: T_.red },
          { date: "Mar 2022", event: "THE UPTIER — PSP Group (PIMCO + Silver Point) executes the 'domino' transaction. New 2026 notes issued to themselves to manufacture a 2/3 supermajority, then used to strip collateral from non-participating 1L. ~$1B rolled into priming tranche, $250M new money raised. Simultaneously, Platinum + Carlyle exchange ~$446M of 2027 unsecured notes into new 1.25L secured.", color: T_.accent },
          { date: "Jan 2023", event: "Langur Maize LLC (single 2027 unsecured holder, Jones Day) files suit in NY Supreme Court against Incora, PSP participants, Carlyle, and Platinum affiliates. Claims: breach of indenture, implied covenant, preferential transfer.", color: T_.amber },
          { date: "Jun 1, 2023", event: "INCORA FILES CH.11 (S.D. Tex., Case 23-90611, Judge D.R. Jones). 44 debtor entities. >$300M DIP from PIMCO and Silver Point — the same PSP Group that executed the uptier. NY action stayed and transferred into bankruptcy as an adversary proceeding.", color: T_.red },
          { date: "Oct 2023", event: "Judge David R. Jones resigns amid unrelated ethics scandal. LME adversary proceeding reassigned to Judge Marvin Isgur.", color: T_.textMid },
          { date: "Early 2024", event: "Adversary trial. Kobre & Kim deposes Incora CFO on uptier mechanics. Minority substantially survives summary judgment. Evidence of sponsor coordination between Platinum and PSP participants surfaces in discovery.", color: T_.blue },
          { date: "Jul 10, 2024", event: "★ ISGUR BENCH RULING: the March 2022 uptier breached both the 2026 and 2027 indentures. Adopts 'integrated transaction doctrine' — first post-trial bankruptcy court ruling to invalidate a major uptier. Restores 2026 lenders' liens. Separately holds Platinum's 2027 participation violated pro rata treatment.", color: T_.green },
          { date: "Dec 27, 2024", event: "Plan confirmed. Global settlement resolves adversary. Despite Isgur's ruling, PSP takes ~98.4% of reorganized equity + $420M convertible takeback notes. Minority gets ~1.6% equity + $7.5M cash. Old Platinum equity cancelled 100%.", color: T_.amber },
          { date: "Jan 2025", event: "★ CRANE PREVIEW RULING: U.S. District Judge Randy Crane surprises practitioners with an oral/preview ruling indicating he will reverse core of Isgur's decision. Full reasoning not released.", color: T_.red },
          { date: "Jan 31, 2025", event: "EMERGENCE. ~20 months in Ch.11. Majority owned by former 1L secured noteholders (PSP Group). $100M exit debt. Incora continues as private aerospace distributor.", color: T_.green },
          { date: "Dec 8-9, 2025", event: "★ CRANE FULL OPINION (11 months after preview): written reversal released. Two holdings: (1) rejects integrated transaction doctrine — 2026 indenture sacred rights, read textually, don't block the uptier; (2) DISMISSES 2024/2026 noteholders' breach of contract claims entirely. Uptier 'perfectly proper' as written.", color: T_.red },
          { date: "Dec 10, 2025", event: "Octus Covenants frames the opinion: 'Breaking the Chain — District Court's Wesco Opinion Limits Effect of Sacred Rights Protections, a Boon for Vote-Rigging and Other Multi-Step LMEs.' Signals the broader market takeaway — Crane's narrow reading makes multi-step LMEs harder to attack.", color: T_.amber },
          { date: "Jan 7-8, 2026", event: "★ FIFTH CIRCUIT APPEAL FILED: Minority 2026 noteholders petition the 5th Circuit for review of Crane's reversal. Incora now on parallel track with Serta — both in the 5th Circuit testing textualist vs. equitable readings of loan/indenture provisions.", color: T_.accent },
          { date: "Feb 3, 2026", event: "S&P assigns Incora Intermediate II LLC 'B-' issuer rating, debt 'B-', outlook stable — first post-emergence rating, establishing the reorganized company's credit profile.", color: T_.blue },
          { date: "Feb 5, 2026", event: "Incora Intermediate II LLC admitted to the Official List (LSE) — post-emergence debt publicly listed, reintegration into mainstream credit markets.", color: T_.blue },
          { date: "Mar 12, 2026", event: "Reorganized Incora sues its D&O insurers to recoup $30M in uptier litigation defense costs. The company that executed the 2022 trade is now trying to claw back defense fees from insurance.", color: T_.amber },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 4, alignItems: "flex-start" }}>
            <div style={{ width: 90, flexShrink: 0, fontSize: 10, fontWeight: 600, color: e.color, paddingTop: 2 }}>{e.date}</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.color, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontSize: 11, color: T_.textMid, lineHeight: 1.5 }}>{e.event}</div>
          </div>
        ))}
      </div>

      {/* Sources footer */}
      <div style={{ marginTop: 24, padding: "12px 16px", background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.borderLight}`, fontSize: 10, color: T_.textGhost, lineHeight: 1.7 }}>
        <strong style={{ color: T_.textMid }}>Sources:</strong> Verita/Kroll docket (veritaglobal.net/incora) · Milbank &amp; Davis Polk emergence announcements · Cleary Gottlieb "Bankruptcy Court Finds Incora's Uptier Exchange is a Bust" · Octus/Reorg Research coverage · ABI "Incora Decision Shocker" · Chapman &amp; Cutler on District Court reversal · Bloomberg Apr 5 2022 · Harrison Huai Substack uptier analysis · Schulte Roth &amp; Zabel alert · Platinum Equity &amp; Willkie Farr 2020 deal announcements · GlobeNewswire. Some figures (revenue, EBITDA, precise debt at petition date) unverified in public sources.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CAESARS ENTERTAINMENT (CEOC)
   ═══════════════════════════════════════════════════════ */

function CaesarsCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    lbo: (
      <DetailPanel title="The 2008 Harrah's LBO — Apollo + TPG" onClose={() => setDetail(null)}>
        <p><strong>Dec 19, 2006:</strong> Apollo Management + TPG Capital announce the take-private of <strong>Harrah's Entertainment</strong> — then the world's largest casino operator — at <strong>$90.00/share cash</strong>. Announced value: ~$17.1B of equity value + assumption of ~$10.7B of existing Harrah's debt = <strong>~$27.8B enterprise value</strong>.</p>
        <p><strong>Jan 28, 2008:</strong> LBO closes. At the time, it was the largest going-private deal for a publicly held casino and among the top 10 LBOs ever executed. Timing: the deal closed as the credit markets were locking up pre-GFC and just as Las Vegas gaming revenue was about to enter a multi-year decline.</p>
        <p><strong>Lead arrangers:</strong> Bank of America, Deutsche Bank, Citigroup, Credit Suisse, JPMorgan, Merrill Lynch (per deal announcement filings; not independently re-verified in this pass).</p>
        <p><strong>2010:</strong> Company renamed <strong>Caesars Entertainment Corporation (CEC)</strong>. IPO attempted Nov 2010 and pulled. Finally went public in <strong>Feb 2012</strong> at $9/share — a fraction of the $90 LBO price.</p>
        <p style={{ color: T_.red }}>The thesis: Las Vegas + regional gaming was a stable cash-flow business that could support aggressive leverage. The reality: the Strip suffered an unprecedented multi-year revenue collapse from 2008-2012, and Harrah's/Caesars went from one of the strongest US gaming operators to one of the most leveraged. By 2013, the company faced an impossible debt wall.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: Cleary Gottlieb 12/19/2006 deal announcement; Cahill Gordon closing announcement Jan 28, 2008; SEC EDGAR merger proxy; Harrah's Entertainment 10-K filings.</em></p>
      </DetailPanel>
    ),
    corporateSplit: (
      <DetailPanel title="The 2013-2014 Three-Way Corporate Split — The Basis for Fraudulent Transfer Claims" onClose={() => setDetail(null)}>
        <p>Facing an impossible debt maturity schedule at CEOC, Apollo/TPG engineered a multi-year reorganization that split Caesars Entertainment into three sibling vehicles — moving the most valuable properties and cash flows away from CEOC and its creditors. These transactions became the direct target of the examiner's fraudulent transfer findings.</p>
        <p><strong>2013 — CERP formation:</strong> <strong>Caesars Entertainment Resort Properties, LLC ("CERP")</strong> was spun off as a new "PropCo" holding <strong>six Las Vegas properties</strong> — Paris Las Vegas, Flamingo, Harrah's LV, Rio, the LINQ Hotel development, and Octavius Tower at Caesars Palace. CERP was financed with <strong>~$4.75B of new mortgage debt</strong>. This moved prime Strip real estate out of CEOC's collateral pool.</p>
        <p><strong>Nov 2013 — CAC IPO:</strong> <strong>Caesars Acquisition Company (CAC, NASDAQ: CACQ)</strong> IPO'd as a separately publicly-traded affiliate of CEC. CAC became the managing member of a new joint venture — <strong>Caesars Growth Partners, LLC (CGP)</strong> — 58% owned by CAC and 42% by CEC.</p>
        <p><strong>March 2014 — "The Four Properties" sale:</strong> CEC announced the sale from CEOC to CGP of <strong>Bally's Las Vegas, The Cromwell, The Quad (later LINQ Hotel), and Harrah's New Orleans</strong> for <strong>~$2.2 billion</strong> (including ~$185M assumed debt and ~$223M committed capex). This moved another ~$1.8B of cash up to CEOC but transferred four high-value operating properties out to CGP. Fitch at the time flagged the transaction as <strong>"positive for equity and CERP but negative for CEOC"</strong> — a pre-bankruptcy warning.</p>
        <p><strong>CGP's total asset pool after these moves:</strong> Planet Hollywood Resort + Caesars Interactive Entertainment (the online gaming + World Series of Poker business) + 41% of Horseshoe Baltimore + the Four Properties. None of this collateral was available to CEOC creditors.</p>
        <p><strong>The B7 Amendment + Parent Guarantee Removal:</strong> In parallel, CEC amended CEOC's senior secured credit facility (the "B7 Amendment") and took steps to <strong>remove CEC's upstream parent guarantee</strong> of CEOC's unsecured notes — arguing that issuing shares to certain holders at CEC extinguished the guarantee under its own terms. First lien noteholders and unsecured holders sued in NY state court alleging the guarantee could not be unilaterally stripped.</p>
        <p style={{ color: T_.red }}>Cumulative effect: between 2013 and 2014, Apollo/TPG moved arguably the most valuable properties and the parent guarantee out of the reach of CEOC's ~$18B of creditors. CEOC was left with a mix of regional casinos and Caesars Palace itself, while the Four Properties, CERP's prime LV real estate, Planet Hollywood, and the CIE online business sat in sibling entities beyond the bankruptcy estate's reach.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: CEC press release 3/2014 "$2.2 billion assets to CGP"; Fitch commentary 3/3/2014; REBusinessOnline; Alvarez & Marsal "Caesars Liquidity and Solvency" retrospective; NY state court filings in first lien noteholder guarantee litigation.</em></p>
      </DetailPanel>
    ),
    capStructure: (
      <DetailPanel title="Capital Structure at Filing — ~$18.4B Funded Debt" onClose={() => setDetail(null)}>
        <p>At the January 2015 filing, CEOC carried approximately <strong>$18.4 billion of funded debt</strong> across multiple tranches. Pre-petition annual interest expense was approximately <strong>$1.7 billion/year</strong> — the term sheet with first lien noteholders targeted reducing that to ~$450M post-emergence.</p>
        <p><strong>Approximate tranches (per plan economics and widely-cited ranges; precise balances verify against Disclosure Statement):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>First Lien Senior Secured Credit Facility (Term Loans + Revolver):</strong> ~$5.4B — held by the "First Lien Bank Group." Admin agent: <strong>Credit Suisse</strong>.</li>
          <li><strong>First Lien Notes:</strong> ~$6.3B — indenture trustee: <strong>BOKF, N.A.</strong>. Multiple tranches with different coupons and maturities.</li>
          <li><strong>Second Lien Notes:</strong> ~$5.2B — indenture trustees including <strong>UMB Bank</strong> and <strong>Wilmington Savings Fund Society</strong>. Led by <strong>Appaloosa Management</strong> (David Tepper) and <strong>Oaktree Capital</strong>.</li>
          <li><strong>Senior Unsecured Notes / Subsidiary-Guaranteed Notes:</strong> various.</li>
          <li><strong>Subordinated Notes:</strong> smaller legacy tranches.</li>
        </ul>
        <p style={{ color: T_.amber }}>The critical structural feature: first lien debt was backed by specific collateral, and the 2013-14 transactions had moved the most valuable collateral (Four Properties, CERP's LV real estate, Planet Hollywood, CIE) outside the credit group. What remained at CEOC was a mix of Caesars Palace, regional casinos, and Total Rewards customer data — valuable but not as valuable as what had been moved. This is what gave the examiner's fraudulent transfer findings such leverage.</p>
      </DetailPanel>
    ),
    petitions: (
      <DetailPanel title="Dueling Petitions — Delaware vs. Illinois (Jan 12-28, 2015)" onClose={() => setDetail(null)}>
        <p>In a first-of-its-kind venue war, Caesars was pushed into Chapter 11 by <strong>two competing petitions filed three days apart in two different courts</strong>.</p>
        <p><strong>Jan 12, 2015 — Delaware involuntary petition:</strong> Second lien noteholders (led by Appaloosa and Oaktree) filed an <strong>involuntary Chapter 11 petition against CEOC</strong> in the U.S. Bankruptcy Court for the District of Delaware — <em>In re Caesars Entertainment Operating Co., Inc.</em>, Case No. <strong>15-10047 (KG)</strong>. Second lien was trying to lock in a Delaware venue, where they believed they would get more favorable treatment on the 2013-14 asset transfers.</p>
        <p><strong>Jan 15, 2015 — Illinois voluntary petition:</strong> CEOC and <strong>~179 affiliated debtors</strong> filed voluntary Chapter 11 petitions in the U.S. Bankruptcy Court for the Northern District of Illinois (Chicago). Lead case <strong>No. 15-01145</strong>, before <strong>Judge A. Benjamin Goldgar</strong>. Chicago venue was chosen because Caesars Entertainment Resort Properties had operations there and because the company's advisors believed Goldgar would be more sympathetic.</p>
        <p><strong>Jan 28, 2015 — Delaware transfers to Chicago:</strong> Judge Kevin Gross in Delaware transferred the involuntary petition to N.D. Ill. under 28 U.S.C. §1412, ending the venue fight. Judge Goldgar subsequently ruled the involuntary case was effectively subsumed into the voluntary proceeding.</p>
        <p style={{ color: T_.amber }}>The venue war was consequential. Delaware would likely have leaned more strongly toward the second lien noteholders on the fraudulent transfer analysis; Chicago proved more neutral. The creditors ultimately still got their examiner and their leverage — but only after a 2-year adversary proceeding and an intervening examiner report.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: Orrick Distressed Download "What Happens in Delaware Does Not Always Stay in Delaware"; Kroll case docket; Law360 "Trial Fires Up Over Dueling Caesars Bankruptcies"; CEOC voluntary petition press release 1/15/2015.</em></p>
      </DetailPanel>
    ),
    examiner: (
      <DetailPanel title="The Examiner — Richard J. Davis & The May 2016 Report (The Turning Point)" onClose={() => setDetail(null)}>
        <p>The single most consequential document in the case was the Final Report of Examiner <strong>Richard J. Davis</strong> — a ~1,700-page document that transformed the second lien noteholders from backseat creditors into the dominant negotiating force.</p>
        <p><strong>Appointment:</strong> After motions by the Second Lien Noteholders Committee, Judge Goldgar granted the examiner motion and appointed <strong>Richard J. Davis</strong> — a former Watergate prosecutor then of counsel at Weil Gotshal & Manges — as examiner in 2015. <strong>Winston & Strawn</strong> served as examiner's counsel.</p>
        <p><strong>Mandate:</strong> Investigate the 2008 LBO era and the 2013-14 transactions, examine CEOC's solvency at various points in time, and identify potential avoidance actions or fiduciary duty claims against CEC, Apollo, TPG, directors, and officers.</p>
        <p><strong>Final Report — March 2016 (publicly discussed May 2016):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>~1,700 pages</strong> plus appendices (one of the longest bankruptcy examiner reports ever)</li>
          <li><strong>Headline finding: "reasonable or strong" potential claims totaling between $3.6 billion and $5.1 billion</strong></li>
          <li>Legal theories analyzed: <strong>constructive fraudulent transfer, actual/intentional fraudulent transfer, breach of fiduciary duty, aiding and abetting breach of fiduciary duty</strong></li>
          <li>Specific targets: the "Four Properties" transaction, the B7 credit facility amendment, the CERP transaction, the removal of the parent guarantee</li>
          <li>Criticized the board's approval process and found that <strong>CEC's conduct became particularly problematic once CEOC became "actually insolvent"</strong></li>
          <li>Emphasized that none of the conduct involved common-law criminal fraud — but that the legal exposure of CEC, Apollo, TPG, and the CEOC directors was substantial</li>
        </ul>
        <p style={{ color: T_.red }}>Impact: before the report, CEC's plan proposed giving 2L noteholders ~9% recovery. After the report, the leverage flipped. 2L holders now had a ~$5 billion hammer — claims a court could plausibly credit — that they could use to extract sponsor contribution and transform their recovery. The report is widely credited as the catalyst that forced Apollo/TPG to the table.</p>
        <p><strong>CEC's response:</strong> CEC issued a public statement disputing the examiner's conclusions, arguing that the 2013-14 transactions were fair, the company was solvent at the time of the transfers, and the board acted within fiduciary duties. The dispute never went to trial — the parties settled.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: Final Report of Examiner Richard J. Davis (PACER/Internet Archive mirror); ABI "Will Caesars Examiner's Report Help Junior Creditors"; CEC response press release 5/2016; Law360 "Caesars Bankruptcy Highlights Cost of Conflict"; Judge Goldgar crime-fraud exception opinion.</em></p>
      </DetailPanel>
    ),
    adhocGroups: (
      <DetailPanel title="Creditor Constituencies — Ad Hoc Groups & Committees" onClose={() => setDetail(null)}>
        <p>The CEOC case had one of the most fragmented creditor landscapes ever, with at least five major constituencies actively pushing competing plans or counter-plans. Their interplay — especially the second lien committee's willingness to spend to get an examiner — shaped every major outcome.</p>
        <p><strong>First Lien Bank Group</strong> — the senior-most creditors. Ad hoc group held a controlling position in the term loans/revolver. Agent: Credit Suisse. Reported counsel: Kramer Levin (partially verified). Their goal: maximize recovery quickly, avoid litigation, take cash + new debt.</p>
        <p><strong>First Lien Notes (BOKF, indenture trustee)</strong> — ~$6.3B tranche. Reached an early Restructuring Support Agreement with CEOC pre-petition. Wanted a fast consensual process with recovery in new debt + some equity.</p>
        <p><strong>Second Lien Noteholders Committee</strong> — the decisive group. Led by <strong>Appaloosa Management (David Tepper)</strong> and <strong>Oaktree Capital</strong>. Counsel: <strong>Jones Day</strong>. Collectively held ~$5.5B of 2L notes. They filed the Delaware involuntary petition, drove the examiner appointment, and ultimately extracted ~$5B of sponsor contribution via the global settlement.</p>
        <p><strong>Senior Unsecured / Subsidiary-Guaranteed Noteholders</strong> — additional classes with varying degrees of organized advocacy.</p>
        <p><strong>Official Committee of Unsecured Creditors (UCC)</strong> — Court-appointed. Counsel included Proskauer Rose (among other firms per fee reporting). UCC investigated the 2013-14 transactions in parallel with the examiner and filed supporting motions.</p>
        <p><strong>CEC / Apollo / TPG (non-debtor parent + sponsors)</strong> — Not technically creditors but the targets of the fraudulent transfer and fiduciary claims. Played dual roles — partly funding CEOC's operations via DIP-like arrangements, partly defending themselves against the very claims CEOC's own creditors were bringing. Reported counsel: Paul Weiss, Rifkind, Wharton & Garrison (partially verified).</p>
        <p style={{ color: T_.amber }}>The 2L group's choice to pay for an examiner — an expensive, time-consuming investigation that did not directly recover cash — is one of the defining strategic moves in modern bankruptcy. Without the Davis report, the 2L group would likely have been crammed down at 9% recovery. With it, they got 66% plus the foundation for VICI Properties stock.</p>
      </DetailPanel>
    ),
    mediation: (
      <DetailPanel title="Mediation Failure — Judge Farnan & the June 2016 Deadlock" onClose={() => setDetail(null)}>
        <p><strong>Mediator:</strong> Retired U.S. District Judge <strong>Joseph J. Farnan Jr.</strong> (D. Del.) was appointed to mediate between CEC, Apollo, TPG, the 1L bank group, the 1L noteholders, the 2L committee, and the UCC. Farnan had extensive experience in complex commercial mediation.</p>
        <p><strong>June 2016 — deadlock declared:</strong> After months of negotiations, Farnan publicly stated that the parties remained deadlocked — with the 2L noteholders and UCC demanding substantially more sponsor contribution than CEC was willing to offer. Shortly thereafter, <strong>Farnan resigned from the mediation</strong>.</p>
        <p><strong>Judge Goldgar's pressure tactics:</strong> Around the same time, Judge Goldgar publicly suggested from the bench that Apollo and TPG should pay meaningful amounts into any plan — and hinted that the automatic stay protecting CEC from guarantee litigation would not be extended indefinitely. The guarantee litigation in NY state court was the sword hanging over CEC — if CEC's parent guarantee was found valid, CEC itself could be liable for billions.</p>
        <p style={{ color: T_.amber }}>The combination of: (1) the May 2016 examiner report quantifying $3.6-5.1B of exposure, (2) the June 2016 mediation failure, (3) Judge Goldgar's explicit pressure on sponsors to contribute, and (4) the looming expiration of the stay on guarantee litigation — all converged to force CEC, Apollo, and TPG back to the table with meaningfully improved terms by October 2016.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: Chicago Business "Caesars Bankruptcy Mediator Says Creditor Talks Deadlocked" (June 2016); Mediation.com on Farnan resignation; Las Vegas Review-Journal "U.S. judge suggests Apollo, TPG pay into Caesars reorganization"; ABI "Who's Who in the Caesars Bankruptcy."</em></p>
      </DetailPanel>
    ),
    settlement: (
      <DetailPanel title="The Global Settlement & CEC's ~$5B Contribution" onClose={() => setDetail(null)}>
        <p>Following the examiner report and the mediation failure, the parties reached a global settlement over the summer and fall of 2016.</p>
        <p><strong>October 2016 — agreement in principle with 2L:</strong> CEC, Apollo, TPG, and the second lien noteholders reached agreement on the key economic terms of a consensual plan. Total CEC/sponsor/CAC contribution: approximately <strong>$5 billion of value</strong>.</p>
        <p><strong>Components of the ~$5B contribution (approximate, per plan economics press release):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Merger of Caesars Acquisition Company (CAC) into CEC</strong> — bringing CGP's assets (Planet Hollywood, CIE, Horseshoe Baltimore, the Four Properties) back into the single new company for CEOC creditors</li>
          <li><strong>Apollo and TPG contributed their entire ~14% equity stake</strong> in the reorganized CEC (~$950 million in then-implied value) to CEOC creditors</li>
          <li>Cash contribution from CEC</li>
          <li>New convertible notes issued by the reorganized CEC to CEOC creditors</li>
          <li>New common equity in the reorganized CEC to CEOC creditors</li>
          <li>Releases of intercompany claims and fiduciary claims (in exchange for the value contribution)</li>
        </ul>
        <p><strong>Jan 13, 2017:</strong> Third Amended Joint Plan of Reorganization filed with the bankruptcy court.</p>
        <p><strong>Jan 17, 2017:</strong> <strong>Plan confirmed by Judge Goldgar.</strong></p>
        <p style={{ color: T_.green }}>The settlement achieved three things CEC's original plan would not have: (1) it released Apollo/TPG from potential billion-dollar fraudulent transfer exposure; (2) it delivered dramatically higher recoveries to 2L and unsecured creditors (~66% vs. ~9% originally proposed); and (3) it allowed emergence without a trial on the examiner's findings.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: CEC August 2016 key economic terms press release; PitchBook "TPG, Apollo give up nearly $1B in equity"; LVRJ restructuring deal coverage; Jones Day "Caesars Second Lien Noteholders Confirm Support for Economic Terms"; Disclosure Statement and Third Amended Plan (Kroll docket).</em></p>
      </DetailPanel>
    ),
    recoveries: (
      <DetailPanel title="Class-by-Class Recoveries (per Plan Economics)" onClose={() => setDetail(null)}>
        <p><strong>Plan confirmed:</strong> Jan 17, 2017. <strong>Effective date:</strong> Oct 6, 2017 (~33 months total in Ch.11). Delivery was via a mix of cash, new CEC common equity, new CEC convertible notes, new secured debt, and — critically — equity in the newly-spun-off VICI Properties REIT.</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Class</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Treatment</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Recovery</th>
          </tr></thead>
          <tbody>
            {[
              { cls: "First Lien Bank (~$5.4B)", treat: "Cash + new first lien debt", rec: "~115%", c: T_.green },
              { cls: "First Lien Notes (~$6.3B)", treat: "Cash + new debt + CEC equity + VICI equity", rec: "~109%", c: T_.green },
              { cls: "Sub-Guaranteed Notes", treat: "CEC equity + convertible notes + VICI equity", rec: "~83%", c: T_.blue },
              { cls: "Second Lien Notes (~$5.2B)", treat: "CEC equity + convertible notes + VICI equity", rec: "~66%", c: T_.amber },
              { cls: "Senior Unsecured", treat: "CEC equity + convertible notes", rec: "~66%", c: T_.amber },
              { cls: "Old CEC Equity (Apollo/TPG)", treat: "14% stake (~$950M) surrendered to plan", rec: "~0%", c: T_.red },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.cls}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.treat}</td>
                <td style={{ padding: "6px 8px", color: r.c, fontWeight: 600, textAlign: "right" }}>{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 10, color: T_.green }}><strong>Key observations:</strong> First lien creditors actually <em>made money</em> on the restructuring — they recovered above par thanks to accrued interest, make-whole premiums, and exit economics. Second lien and unsecured — classes that had been heading toward single-digit recoveries before the examiner report — ended up around 66 cents on the dollar plus meaningful equity upside via VICI. The only class completely wiped out was old CEC equity, and even there Apollo/TPG retained a minority position in the reorganized entity via other mechanisms.</p>
        <p style={{ color: T_.amber }}><strong>Important caveat:</strong> these recoveries are <em>per CEC's August 2016 plan economics press release and widely-cited secondary sources</em>. Actual effective-date recoveries may have differed slightly once the plan was implemented and market prices set. For precise figures, consult the Disclosure Statement and Notice of Effective Date on the Kroll docket.</p>
      </DetailPanel>
    ),
    vici: (
      <DetailPanel title="VICI Properties — The Birth of the Modern Gaming REIT" onClose={() => setDetail(null)}>
        <p><strong>October 6, 2017 — simultaneously with CEOC's emergence:</strong> A new publicly-traded REIT called <strong>VICI Properties Inc.</strong> was spun off to CEOC creditors as part of the plan. VICI held a curated portfolio of CEC's most valuable real estate assets and became the first modern large-scale gaming REIT.</p>
        <p><strong>Initial portfolio:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>19 casinos and racetracks</strong> including Caesars Palace Las Vegas and 18 regional properties</li>
          <li><strong>4 golf courses</strong></li>
          <li>Master-leased to Caesars Entertainment (the reorganized CEC) on a triple-net basis at an initial annual rent of approximately <strong>$630 million</strong></li>
        </ul>
        <p><strong>Feb 2018 — NYSE IPO:</strong> VICI completed its formal IPO on the NYSE, raising approximately <strong>$1.2 billion</strong>. The REIT traded publicly under the ticker <strong>VICI</strong>.</p>
        <p><strong>Master lease structure:</strong> Different from the Windstream/Uniti situation in one critical way — this was a <strong>voluntary</strong> sale-leaseback, negotiated as part of a consensual plan, with arm's-length market rent. There was no hidden "phantom sale-leaseback" claim of the kind Aurelius used to detonate Windstream. Caesars and VICI have continued to work together for years.</p>
        <p style={{ color: T_.green }}><strong>Market significance:</strong> VICI established the template that Gaming & Leisure Properties (GLPI, a predecessor) had first built — but at much larger scale and with stronger tenant quality. It became the precedent for MGM Growth Properties (later merged into VICI in 2022), the template for Hard Rock and other gaming operators considering sale-leaseback structures, and one of the most successful post-bankruptcy value creations of the decade. VICI today owns real estate across the Strip and US regional gaming and is a member of the S&P 500.</p>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: BusinessWire VICI spin-off completion 10/6/2017; VICI Q3 2017 10-Q (SEC EDGAR); Harvard Law Forum "VICI Properties: Creating Value from the Ashes of Caesars' Demise"; Nevada Independent.</em></p>
      </DetailPanel>
    ),
    eldorado: (
      <DetailPanel title="Post-Emergence & the 2019-2020 Eldorado Merger" onClose={() => setDetail(null)}>
        <p>The reorganized Caesars Entertainment Corporation emerged from Ch.11 with a cleaned-up balance sheet, the CAC merger completed, the VICI spin executed, and a new board. But the full arc of the post-LBO story did not close until the Eldorado merger nearly three years later.</p>
        <p><strong>2017-2019 — The Icahn catalyst:</strong> <strong>Carl Icahn</strong> accumulated a significant stake in the reorganized CEC and publicly pushed the board to explore a sale. Icahn argued that Caesars was undermanaged and that a strategic combination would unlock value. His activist pressure — combined with the board's own strategic review — led to engagement with Eldorado Resorts.</p>
        <p><strong>June 24, 2019 — Eldorado deal announced:</strong> <strong>Eldorado Resorts</strong> (a smaller regional casino operator led by <strong>Tom Reeg</strong>) announced an agreement to acquire Caesars Entertainment in a <strong>$17.3 billion</strong> cash-and-stock deal. Structure:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>$7.2 billion in cash</strong></li>
          <li><strong>~77 million Eldorado shares</strong> issued to Caesars shareholders</li>
          <li>Assumption of Caesars net debt</li>
          <li>Total implied value: $17.3B</li>
        </ul>
        <p><strong>July 20, 2020 — merger closes:</strong> After more than a dozen state gaming regulator approvals and FTC review, the Eldorado-Caesars merger closed. The combined company retained the <strong>Caesars Entertainment</strong> name and trades on NASDAQ under ticker <strong>CZR</strong>. CEO: <strong>Tom Reeg</strong> (formerly Eldorado CEO).</p>
        <p><strong>Full stakeholder arc retrospectively:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Apollo + TPG</strong>: Invested ~$17.1B of equity in 2008. Largely wiped out by 2017. Surrendered their 14% reorganized stake (~$950M). Exited any residual position via the Eldorado merger. <strong>Net outcome: near-total loss on the LBO.</strong></li>
          <li><strong>CEOC 1L bank and notes</strong>: Recovered ~109-115%. Made money on the restructuring. <strong>Net outcome: positive total return.</strong></li>
          <li><strong>CEOC 2L noteholders (Appaloosa + Oaktree)</strong>: Their bet on the examiner and litigation leverage paid off. Moved from ~9% recovery in early plan drafts to ~66% plus VICI equity, which subsequently appreciated. <strong>Net outcome: likely positive total return given VICI price appreciation.</strong></li>
          <li><strong>CEOC senior unsecured</strong>: ~66% recovery, similar profile to 2L.</li>
          <li><strong>VICI creditors-turned-shareholders</strong>: Received brand-new REIT equity in 2017. VICI appreciated substantially over 2018-2024. <strong>Net outcome: one of the best post-bankruptcy recoveries of the decade.</strong></li>
          <li><strong>Eldorado/Tom Reeg</strong>: Used activist pressure + strategic vision to reverse-merge a smaller operator into Caesars. Now runs one of the two largest gaming operators in the US.</li>
          <li><strong>CreditSights today (2026)</strong>: Covers reorganized CZR actively. Current rating: <strong>"Underperform"</strong> (changed from "Market Perform" Mar 2, 2026) — reflecting concerns about post-merger debt levels and regional gaming competition.</li>
        </ul>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>Source: CEC Eldorado combination announcement 6/24/2019; PR Newswire merger closing 7/20/2020; Las Vegas Sun; CDC Gaming; Caesars Tom Reeg bio; CreditSights coverage.</em></p>
      </DetailPanel>
    ),
    advisors: (
      <DetailPanel title="Professional Advisors" onClose={() => setDetail(null)}>
        <p>CEOC was among the most expensive US bankruptcies by professional fees — total fees are widely reported at <strong>~$150 million or more</strong>. Kirkland & Ellis alone billed approximately <strong>$77 million</strong>.</p>
        <p><strong>Debtors (CEOC):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Kirkland &amp; Ellis</strong> — lead bankruptcy counsel (~$77M fees)</li>
          <li><strong>AlixPartners / AP Services</strong> — restructuring advisor. <strong>Randall Eisenberg</strong> as Chief Restructuring Officer</li>
          <li><strong>Millstein &amp; Co.</strong> — investment banker / financial advisor</li>
          <li><strong>Prime Clerk / Kroll Restructuring Administration</strong> — claims and noticing agent</li>
        </ul>
        <p><strong>Examiner Richard J. Davis:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Winston &amp; Strawn</strong> — examiner's counsel</li>
        </ul>
        <p><strong>Second Lien Noteholders Committee (Appaloosa, Oaktree, et al.):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Jones Day</strong> — counsel</li>
        </ul>
        <p><strong>Official Committee of Unsecured Creditors (UCC):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Proskauer Rose</strong> — counsel (among other firms in UCC fee reporting)</li>
        </ul>
        <p><strong>Non-debtor parent / sponsor side (CEC, Apollo, TPG):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Paul, Weiss, Rifkind, Wharton &amp; Garrison</strong> — reported counsel (partially verified)</li>
          <li>Additional sponsor-side bankruptcy advice reportedly from O'Melveny and Wachtell at various points (unverified)</li>
        </ul>
        <p style={{ color: T_.textDim, fontSize: 11 }}><em>1L bank group counsel (reportedly Kramer Levin) and 1L notes/BOKF counsel (reportedly White &amp; Case) not independently re-verified in this pass. For the complete advisor roster, consult the monthly fee statements on the Kroll docket at cases.ra.kroll.com/ceoc.</em></p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Largest US casino operator. <span style={{ color: T_.purple }}>Apollo + TPG</span> took Harrah's Entertainment private in Jan 2008 for <span style={{ color: T_.red }}>~$27.8B</span> at the peak of the LBO cycle. As the post-GFC Vegas revenue collapse shattered the thesis, the sponsors executed a <span style={{ color: T_.amber }}>2013-14 three-way corporate split</span> — moving the most valuable properties (Bally's LV, The Cromwell, Harrah's New Orleans, Planet Hollywood, Caesars Interactive, LV Strip real estate) out of the debt-laden operating subsidiary (CEOC) into new sibling entities CERP and Caesars Growth Partners. On <span style={{ color: T_.red }}>Jan 12, 2015</span>, second lien noteholders (Appaloosa + Oaktree) filed an involuntary petition in Delaware; three days later CEOC filed a voluntary petition in Chicago to seize venue — the biggest bankruptcy venue war ever fought over an involuntary case. <span style={{ color: T_.accent }}>Examiner Richard J. Davis</span> produced a ~1,700-page report finding <strong>$3.6B-$5.1B in potentially avoidable transfers</strong>, including actual fraudulent transfer and breach of fiduciary duty exposure for Apollo, TPG, and the board. Mediation failed (June 2016), then Judge Goldgar publicly pressured the sponsors to contribute. Global settlement reached Oct 2016: Apollo/TPG and CEC contributed <span style={{ color: T_.green }}>~$5B</span> of value to the plan, including their entire 14% equity stake (~$950M). Plan confirmed Jan 17, 2017; CEOC emerged Oct 6, 2017 simultaneously with the spin-off of <span style={{ color: T_.accent }}>VICI Properties</span> — the modern gaming REIT precedent. 1L lenders recovered ~109-115%; 2L and unsecured ~66% plus VICI upside; old equity largely wiped. In 2019-2020, Icahn-backed Eldorado Resorts acquired the reorganized Caesars for <span style={{ color: T_.accent }}>$17.3B</span>. Today Caesars trades as CZR under CEO Tom Reeg.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Funded Debt", v: "~$18.4B", c: T_.red },
            { l: "Filed", v: "Jan 15, 2015", c: T_.red },
            { l: "Emerged", v: "Oct 6, 2017", c: T_.green },
            { l: "Time in Ch.11", v: "~33 months", c: T_.textMid },
            { l: "Examiner Findings", v: "$3.6-5.1B", c: T_.accent },
            { l: "Sponsor Contrib.", v: "~$5B", c: T_.amber },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate Structure — Post 2013-14 Split, At Filing</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>The three-way split that isolated valuable assets from CEOC creditors. Case 15-01145 (N.D. Ill.), Judge A. Benjamin Goldgar. Click boxes for details.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.red}50`, background: `${T_.red}08`, display: "inline-block" }} /><span style={{ color: T_.red }}>CEOC (Debtor)</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Sibling Entities (Outside Estate)</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: Sponsors */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Apollo Global Management + TPG Capital"
            sub="LBO sponsors · ~$17.1B equity in 2008 → ~$0 by 2017"
            color={T_.purple}
            badges={[{ text: "TARGETS OF EXAMINER FINDINGS", color: T_.red }, { text: "~$950M EQUITY CONTRIBUTED", color: T_.amber }]}
            onClick={() => toggle("lbo")} selected={detail === "lbo"}
            width={440}
          />
        </div>

        <VLineLabel label="Took Harrah's private Jan 2008 · Renamed Caesars 2010" color={T_.purple} />

        {/* ROW 2: CEC Parent */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Caesars Entertainment Corporation (CEC)"
            sub="Public parent · NASDAQ: CZR · Non-debtor · Target of fraudulent transfer claims"
            color={T_.amber}
            badges={[{ text: "NON-DEBTOR PARENT", color: T_.amber }, { text: "CONTRIBUTED ~$5B TO PLAN", color: T_.green }]}
            onClick={() => toggle("corporateSplit")} selected={detail === "corporateSplit"}
            width={480}
          />
        </div>

        <VLine h={14} />

        {/* THREE-WAY SPLIT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>

          {/* CEOC (DEBTOR) */}
          <div style={{ border: `2px solid ${T_.red}40`, borderRadius: 10, padding: "10px 12px", background: `${T_.red}06` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T_.red, textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>CEOC (The Debtor)</div>
            <div onClick={() => toggle("capStructure")} style={{ cursor: "pointer" }}>
              <Box
                label="Caesars Entertainment Operating Co."
                sub="~179 affiliate debtors · ~$18.4B funded debt · Caesars Palace + regional casinos"
                color={T_.red}
                badges={[{ text: "CH.11 (N.D. ILL.)", color: T_.red }]}
                selected={detail === "capStructure"}
              />
            </div>
            <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
              The Four Properties, LV Strip real estate, and CIE were moved out in 2013-14 → basis for examiner's findings
            </div>
          </div>

          {/* CERP */}
          <div style={{ border: `2px dashed ${T_.green}40`, borderRadius: 10, padding: "10px 12px", background: `${T_.green}06` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T_.green, textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>CERP (PropCo — 2013)</div>
            <Box
              label="Caesars Entertainment Resort Properties"
              sub="6 LV properties + LINQ + Octavius · ~$4.75B mortgage debt · Outside CEOC estate"
              color={T_.green}
              dashed
            />
            <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
              Paris LV · Flamingo · Harrah's LV · Rio · LINQ · Octavius Tower
            </div>
          </div>

          {/* CGP */}
          <div style={{ border: `2px dashed ${T_.green}40`, borderRadius: 10, padding: "10px 12px", background: `${T_.green}06` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T_.green, textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>CGP (Growth JV — 2013-14)</div>
            <Box
              label="Caesars Growth Partners, LLC"
              sub="JV with CAC (NASDAQ: CACQ) · Held the Four Properties, Planet Hollywood, CIE, Horseshoe Baltimore"
              color={T_.green}
              dashed
              badges={[{ text: "CAC 58% / CEC 42%", color: T_.textGhost }]}
            />
            <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
              $2.2B "Four Properties" purchase from CEOC in Mar 2014 → target of examiner's fraudulent transfer analysis
            </div>
          </div>
        </div>

      </div>

      {/* ── Detail buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "petitions", label: "Dueling Petitions — Venue War", color: T_.red, sub: "Delaware involuntary → Chicago voluntary" },
          { k: "examiner", label: "The Examiner Report (May 2016)", color: T_.accent, sub: "1,700 pages · $3.6-5.1B findings · Turning point" },
          { k: "adhocGroups", label: "Creditor Constituencies", color: T_.blue, sub: "1L bank · 1L notes · 2L · UCC · CEC/sponsors" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Detail buttons row 2 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 4 }}>
        {[
          { k: "mediation", label: "Mediation Failure", color: T_.amber, sub: "Judge Farnan · June 2016 deadlock · Resigned" },
          { k: "settlement", label: "Global Settlement & ~$5B", color: T_.green, sub: "Oct 2016 · Apollo/TPG surrender 14% stake" },
          { k: "recoveries", label: "Class Recoveries", color: T_.blue, sub: "1L ~109-115% · 2L ~66% · Equity ~0%" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Detail buttons row 3 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 4 }}>
        {[
          { k: "vici", label: "VICI Properties Spin-Off", color: T_.accent, sub: "19 casinos + 4 golf · $630M rent · Modern gaming REIT" },
          { k: "eldorado", label: "Eldorado Merger (2019-2020)", color: T_.green, sub: "Icahn catalyst · $17.3B · Tom Reeg CEO" },
          { k: "advisors", label: "Professional Advisors", color: T_.amber, sub: "K&E · AlixPartners · Millstein · Winston · Jones Day" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 9, color: T_.textDim, marginTop: 2 }}>{d.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "Sponsor-Conflict Asset Transfers (Pre-LME Era)", color: T_.red, summary: "CEOC is the grand-daddy of modern sponsor-conflict cases — the 2013-14 transfers predate J.Crew (2016) and Envision (2022).", detail: "Apollo/TPG moved the Four Properties, CERP's Las Vegas real estate, Planet Hollywood, and Caesars Interactive Entertainment out of CEOC into sibling entities over a ~15-month period. Each individual transaction had a plausible business rationale at the time. Only when viewed as an integrated sequence did the examiner conclude that the cumulative effect was to strip ~$3.6-5.1B of value from CEOC creditors. This is why modern credit agreements now include J.Crew blockers, Envision blockers, and 'Caesars' provisions restricting intercompany asset transfers even when no single transaction triggers a restricted payment breach. CEOC predates all of them — it's the original sponsor-conflict drop-down case, even though it's usually filed under 'mega-LBO flameout' rather than 'LME'." },
          { label: "Constructive vs. Actual Fraudulent Transfer", color: T_.amber, summary: "Two distinct legal theories with very different proof standards — the examiner found both applied to CEOC.", detail: "Constructive fraudulent transfer requires showing (1) the debtor received less than reasonably equivalent value for the transferred asset AND (2) the debtor was insolvent or rendered insolvent by the transfer. It's about economic substance, not intent. Actual fraudulent transfer requires showing the debtor had intent to hinder, delay, or defraud creditors — a harder bar but with broader remedies when proved. The examiner's $3.6B-$5.1B range covered constructive claims with high confidence ($3.6B floor) plus additional amounts subject to actual fraudulent transfer theories (up to $5.1B total). The distinction mattered because if actual fraudulent transfer was proved, Apollo/TPG directors and officers could face personal liability and punitive damages — not just the recovery of the transferred property. This is why the examiner report was so devastating: it credibly threatened personal liability, not just business claims." },
          { label: "Involuntary Petition + Venue Warfare", color: T_.blue, summary: "Second lien used an involuntary petition to forum-shop Delaware — CEOC countered with a voluntary petition in Illinois.", detail: "Under 11 U.S.C. §303, three creditors holding at least $18,600 in unsecured claims can file an involuntary Chapter 11 petition. Historically this was a tool to force unwilling debtors into bankruptcy — it was rare to use for venue shopping. The Caesars 2L group used it strategically: by filing first in Delaware, they tried to lock in a court and judge (Kevin Gross) they believed would be more sympathetic to fraudulent transfer theories. CEOC responded with a voluntary petition in Chicago three days later, arguing the Chicago filing superseded the Delaware action. Delaware ultimately transferred the case — but the episode established a modern pattern: sophisticated creditors can use involuntary petitions as a venue selection tool, not just a forcing mechanism. Creditors have since tried similar moves in other cases with mixed results." },
          { label: "The Examiner as a Restructuring Weapon", color: T_.accent, summary: "Second lien committee spent time and money on an examiner and got 60+ percentage points of recovery in return.", detail: "Examiners under 11 U.S.C. §1104(c) are appointed to investigate specific issues (typically fraud, misconduct, or mismanagement by current or former debtor management). They're neutral, unlike financial advisors or litigation counsel. Their reports carry weight because they're viewed as independent. The CEOC 2L committee bet — correctly — that an examiner would surface enough fraudulent transfer exposure to shift negotiating leverage. Richard Davis cost the estate millions in examiner fees and delayed the case by a year. But the return was enormous: 2L moved from 9% recovery in early plan drafts to 66% plus VICI upside. This is the canonical example of 'the examiner as a strategic weapon' — a playbook later used (with varying success) in other contested LBO flameouts. The key is having a credible theory of wrongdoing that an examiner can develop into a formal finding; without that, the examiner motion is just a delay tactic." },
          { label: "Parent Guarantee Removal & Intercompany Suits", color: T_.purple, summary: "CEC tried to strip its upstream guarantee of CEOC notes — creditors sued in NY state court to enforce.", detail: "Pre-petition, CEC attempted to remove its upstream parent guarantee of CEOC's unsecured notes by arguing that specific share issuance mechanics under the guarantee's terms automatically extinguished the obligation. First lien noteholders and unsecured holders sued in NY state court to block the removal. The litigation was on a parallel track to the bankruptcy and was Judge Goldgar's key leverage point against Apollo/TPG: if CEC's guarantee was found valid, CEC would face direct billion-dollar exposure. The bankruptcy court stayed the NY litigation early in the case — but Goldgar made clear that the stay would not be extended indefinitely. This meant Apollo/TPG faced an asymmetric risk: settle now with certainty, or face a trial that could result in CEC writing a check for billions. They settled." },
          { label: "Intercreditor Coalition Dynamics", color: T_.emerald, summary: "Five creditor groups pushed different plans — the deal only happened when the 2L group developed independent leverage.", detail: "Complex Chapter 11 cases with multiple creditor constituencies often deadlock for a simple reason: each group's preferred outcome is different. In Caesars: 1L bank lenders wanted a quick cash-out. 1L noteholders wanted a consensual deal with CEC's cooperation. 2L noteholders wanted litigation leverage for maximum recovery. Unsecured creditors wanted anything above zero. And CEC wanted minimal sponsor contribution. The resolution required the 2L group to develop independent leverage (via the examiner report) and then trade that leverage for settlement economics — simultaneously agreeing to release claims that the 1L group didn't have standing to bring. This 'leverage-for-settlement' dynamic is replicated in many modern contested bankruptcies, but CEOC is the textbook example because the examiner report let observers see exactly what claims were being released and at what implied value." },
          { label: "Gaming REIT Spin-Off as Plan Currency", color: T_.cyan, summary: "Spinning off a REIT let Caesars give creditors two forms of value — new operating equity + new real estate equity.", detail: "VICI Properties was the first modern large-scale gaming REIT spun off as part of a Chapter 11 plan. The structure let Caesars give CEOC creditors equity in two separate entities — the reorganized CEC (operating company) and VICI (real estate) — without diluting either. Creditors effectively got: (1) new CEC equity, valued at implied operating earnings, plus (2) VICI REIT shares, valued at implied rental cash flows. The combined value often exceeded what either structure alone could have delivered, because REITs trade at different multiples than C-corp operators. VICI became an S&P 500 company and significantly appreciated post-emergence, making the 2L/unsecured recovery (66% plus VICI stock) materially better than the headline number suggested. Post-Caesars, VICI became the precedent for MGM Growth Properties (later merged into VICI) and other gaming REIT separations. For modern distressed investing, gaming REITs are one of the few 'structural upside' tools available in a plan negotiation." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "Dec 19, 2006", event: "Apollo + TPG announce take-private of Harrah's Entertainment at $90/share cash. ~$17.1B equity + ~$10.7B assumed debt = ~$27.8B enterprise value. Largest gaming LBO ever.", color: T_.purple },
          { date: "Jan 28, 2008", event: "LBO closes. Timing is catastrophic — credit markets seizing, Las Vegas revenue about to enter a multi-year collapse.", color: T_.purple },
          { date: "2008-2012", event: "Las Vegas Strip revenue collapses post-GFC. Harrah's/Caesars EBITDA craters. Debt-to-EBITDA blows out as business deteriorates.", color: T_.red },
          { date: "2010", event: "Company renamed Caesars Entertainment Corporation (CEC).", color: T_.textMid },
          { date: "Feb 2012", event: "CEC IPO at $9/share — a fraction of the $90/share LBO price. Minority float to establish a public market in the equity.", color: T_.amber },
          { date: "2013", event: "CERP formed. Six Las Vegas properties (Paris, Flamingo, Harrah's LV, Rio, LINQ development, Octavius Tower) spun into new PropCo with ~$4.75B of new mortgage debt. First major transfer out of CEOC's collateral pool.", color: T_.amber },
          { date: "Nov 2013", event: "Caesars Acquisition Company (CAC) IPOs on NASDAQ. CAC becomes managing member of Caesars Growth Partners (CGP) — a new JV (58% CAC / 42% CEC) that will hold additional CEC assets.", color: T_.amber },
          { date: "Mar 2014", event: "$2.2B sale of 'The Four Properties' (Bally's LV, The Cromwell, The Quad/LINQ Hotel, Harrah's New Orleans) from CEOC to CGP. Fitch warns: 'positive for equity and CERP but negative for CEOC.' Planet Hollywood, Caesars Interactive, and Horseshoe Baltimore also sit in CGP.", color: T_.red },
          { date: "2014", event: "B7 credit facility amendment. CEC attempts to remove parent guarantee of CEOC unsecured notes via share issuance mechanics. First lien noteholders and unsecured holders file NY state court actions challenging guarantee removal.", color: T_.red },
          { date: "Late 2014", event: "CEOC interest burden ~$1.7B/yr on ~$18.4B of debt. Cash position deteriorating. Restructuring inevitable.", color: T_.red },
          { date: "Jan 12, 2015", event: "SECOND LIEN NOTEHOLDERS FILE INVOLUNTARY PETITION against CEOC in D. Del. (Case 15-10047 KG). Forum-shopping Delaware for perceived more favorable fraudulent transfer treatment.", color: T_.red },
          { date: "Jan 15, 2015", event: "CEOC FILES VOLUNTARY CH.11 in N.D. Ill. (Chicago, Case 15-01145, Judge A. Benjamin Goldgar). ~179 affiliated debtors. Term sheet with first lien noteholders already in hand. Attempts to seize venue from Delaware.", color: T_.red },
          { date: "Jan 28, 2015", event: "Judge Kevin Gross (D. Del.) transfers the involuntary petition to N.D. Ill. under §1412. Venue fight ends; Chicago wins.", color: T_.amber },
          { date: "2015", event: "Second Lien Noteholders Committee moves for appointment of an examiner. After contested hearings, Judge Goldgar grants the motion and appoints Richard J. Davis (formerly of Weil Gotshal). Winston & Strawn serves as examiner's counsel.", color: T_.blue },
          { date: "2015-2016", event: "Davis conducts a ~14-month investigation. Reviews board minutes, solvency analyses, fairness opinions, deposition testimony. Separately, Judge Goldgar issues crime-fraud exception rulings enabling 2L discovery of privileged sponsor communications.", color: T_.blue },
          { date: "Mar 2016", event: "Final Report of Examiner filed (initially under seal). Approximately 1,700 pages plus appendices.", color: T_.accent },
          { date: "May 2016", event: "★ EXAMINER REPORT UNSEALED. Findings: $3.6B-$5.1B in potentially avoidable claims under constructive + actual fraudulent transfer, breach of fiduciary duty, and aiding & abetting theories. Targets: CEC, Apollo, TPG, CEOC directors. CEC publicly disputes conclusions.", color: T_.accent },
          { date: "Jun 2016", event: "Mediator (retired Judge Joseph J. Farnan Jr.) publicly declares creditor negotiations deadlocked. Farnan resigns from the mediation shortly thereafter. Judge Goldgar from the bench publicly suggests Apollo and TPG should contribute meaningful value.", color: T_.red },
          { date: "Jul-Sep 2016", event: "CEC, Apollo/TPG, 1L groups, 2L committee, and UCC re-engage under Judge Goldgar's pressure. Parallel guarantee litigation in NY state court proceeds with no further stay extensions guaranteed.", color: T_.blue },
          { date: "Oct 2016", event: "GLOBAL SETTLEMENT REACHED. CEC, Apollo, TPG, and CAC collectively contribute ~$5B of value: cash, new CEC equity, convertible notes, CAC merger, and surrender of Apollo/TPG's 14% stake (~$950M). Second lien committee confirms support.", color: T_.green },
          { date: "Jan 13, 2017", event: "Third Amended Joint Plan of Reorganization filed.", color: T_.green },
          { date: "Jan 17, 2017", event: "★ PLAN CONFIRMED by Judge Goldgar.", color: T_.green },
          { date: "Oct 6, 2017", event: "EMERGENCE. CEOC effective date + CAC merger into CEC + VICI Properties REIT spin-off (19 casinos + 4 golf courses, ~$630M initial annual rent, triple-net master lease to Caesars). ~33 months total in Ch.11.", color: T_.green },
          { date: "Recoveries", event: "1L bank ~115% · 1L notes ~109% · Sub-guaranteed ~83% · 2L notes ~66% · Senior unsecured ~66% · Old CEC equity ~0% (Apollo/TPG 14% stake contributed). Per CEC Aug 2016 plan economics press release.", color: T_.blue },
          { date: "Feb 2018", event: "VICI Properties Inc. completes NYSE IPO, raises ~$1.2B. Trades under ticker VICI. Becomes the first modern large-scale gaming REIT.", color: T_.accent },
          { date: "2017-2019", event: "Carl Icahn accumulates stake in reorganized CEC and publicly pushes for strategic sale. Activist pressure + board's own strategic review lead to engagement with Eldorado Resorts.", color: T_.amber },
          { date: "Jun 24, 2019", event: "ELDORADO-CAESARS MERGER ANNOUNCED: $17.3B deal ($7.2B cash + ~77M Eldorado shares + debt assumption). Eldorado led by CEO Tom Reeg.", color: T_.accent },
          { date: "Jul 20, 2020", event: "Merger closes after 12+ state gaming regulator approvals + FTC review. Combined company retains Caesars Entertainment name, NASDAQ ticker CZR. Tom Reeg CEO.", color: T_.green },
          { date: "Mar 2, 2026", event: "CreditSights (lead analyst Bussey) changes rating on CZR from 'Market Perform' to 'Underperform' — reflecting concerns about post-merger debt levels and regional gaming competition.", color: T_.amber },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 4, alignItems: "flex-start" }}>
            <div style={{ width: 90, flexShrink: 0, fontSize: 10, fontWeight: 600, color: e.color, paddingTop: 2 }}>{e.date}</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.color, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontSize: 11, color: T_.textMid, lineHeight: 1.5 }}>{e.event}</div>
          </div>
        ))}
      </div>

      {/* Sources footer */}
      <div style={{ marginTop: 24, padding: "12px 16px", background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.borderLight}`, fontSize: 10, color: T_.textGhost, lineHeight: 1.7 }}>
        <strong style={{ color: T_.textMid }}>Sources:</strong> Final Report of Examiner Richard J. Davis (Internet Archive mirror of PACER PDF) · Kroll/Prime Clerk case docket cases.ra.kroll.com/ceoc · Third Amended Joint Plan of Reorganization and Disclosure Statement · CEC SEC filings (10-K 2013-2017) · Cleary Gottlieb + Cahill Gordon LBO announcements (2006-2008) · Orrick "Distressed Download" venue battle analysis · Law360 "Trial Fires Up Over Dueling Caesars Bankruptcies" · ABI "Who's Who in the Caesars Bankruptcy" · CEC August 2016 key economic terms press release · PitchBook "TPG, Apollo give up nearly $1B in equity" · BusinessWire VICI spin-off completion (10/6/2017) · Harvard Law Forum "VICI Properties: Creating Value from the Ashes of Caesars' Demise" · Las Vegas Review-Journal · Chicago Business mediator coverage · Jones Day second lien deal sheet · Sujeet Indap &amp; Max Frumes, <em>The Caesars Palace Coup</em> (Diversion Books, 2021) · Harvard Business School case N9-218-001. Some figures (precise tranche balances, sponsor-side advisor list, 1L group counsel) approximate per plan economics press releases and widely-cited secondary sources; verify against Disclosure Statement and Rule 2019 filings for publication-grade accuracy.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   XEROX HOLDINGS — ONGOING LME (2025-26)
   The first "non-subsidiary" drop-down financing.
   ═══════════════════════════════════════════════════════ */

function XeroxCase() {
  const [detail, setDetail] = useState(null);
  const toggle = (k) => setDetail(detail === k ? null : k);

  const panels = {
    business: (
      <DetailPanel title="The Business — Secular Decline + Lexmark Integration" onClose={() => setDetail(null)}>
        <p><strong>Xerox Holdings Corp.</strong> (Nasdaq: XRX) is the legacy US document-services and printer OEM. Revenue collapsed from <strong>$9.83B (2018) → $7.02B (2025)</strong>; organic legacy Xerox (standalone) shrank <strong>54% to ~$4.5B</strong>. Adj. EBITDA margins fell <strong>17% → 7.3%</strong> as fixed costs failed to right-size against a shrinking installed base. Post-COVID print volumes are stuck at <strong>~80–85%</strong> of pre-pandemic levels — permanent reduction as hybrid work normalizes.</p>
        <p><strong>Reported FCF of $133M in 2025 masks adjusted FCF of ($356M)</strong> after backing out $489M of finance-receivables sales (one-time). In other words, the underlying business is cash-burning.</p>
        <p style={{ color: T_.amber }}><strong>Lexmark acquisition — the growth bet:</strong> Announced Dec 2024. Closed <strong>July 1, 2025</strong> for <strong>$1.5B (inclusive of assumed debt).</strong> Lexmark brought A4 color exposure (Xerox historically underweight vs. A3 dominance), Asia-Pacific distribution, in-house component manufacturing, and combined platform controlling ~25% of global Managed Print Services (MPS). Seller: Ninestar Corp. / PAG Asia Capital / Shanghai Shouda.</p>
        <p><strong>Lexmark financing stack (Jul 2025):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>$327M incremental 1L term loan borrowing</li>
          <li><strong>$250M 13% Senior Notes due 2030</strong> (Moody's assigned <span style={{ color: T_.red }}>Caa3</span> Mar 2026) — Step-Up Backed</li>
          <li><strong>$125M 13% Senior Unsecured Notes due 2026</strong></li>
          <li>Bridge facilities (assumed repaid on path)</li>
          <li>$110M ITSavvy seller notes — repaid Jan 30, 2026</li>
        </ul>
        <p style={{ color: T_.red }}><strong>The problem:</strong> The deal added leverage on top of a structurally declining core. Pro forma gross debt ~$4.35B vs. ~$512M LTM Adj EBITDA = <strong>8.5x total / 7.5x net</strong>. Third Bridge expert (Mar 2026): <em>"For a long time, Xerox has been following, not leading... 1.5–2 years before the debt situation becomes untenable."</em></p>
        <p style={{ color: T_.amber }}><strong>ITSavvy (Nov 2024, $400M):</strong> Earlier diversification into IT services — fastest-growing segment (39% YoY 2025) but still {"<"}10% of revenue. Third Bridge expert: <em>"genuine gap Xerox had"</em> but not enough scale to move the needle.</p>
      </DetailPanel>
    ),
    holdcoOpco: (
      <DetailPanel title="Xerox Holdings Corp. ↔ Xerox Corp. — The Double-Dip" onClose={() => setDetail(null)}>
        <p>Structure dates from the <strong>2017 Conduent spinoff</strong>. Two issuers:</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Xerox Holdings Corp.</strong> — FinCo issuer of post-2017 bonds (5.5% 2028 SUNs; 13% 2030 Step-Up SUNs; 13% 2026 SUNs). On-lends proceeds to Xerox Corp. via intercompany loan.</li>
          <li><strong>Xerox Corp.</strong> — primary OpCo. Borrower on 1L TL, 1L/2L secured notes, 8.875% 2029 SUNs, legacy 6.75% 2039 and 2035 notes. Also <strong>guarantees</strong> the Xerox Holdings bonds — creating a "double-dip" claim for HoldCo bondholders (direct claim on HoldCo + guarantee claim on OpCo via the intercompany).</li>
        </ul>
        <p style={{ color: T_.amber }}><strong>Guarantee package is not aligned across issues.</strong> Per Reorg: Lexmark-era bonds (13% 2030 Step-Up) brought tighter guarantees from a broader set of subsidiaries; <strong>legacy OpCo notes (2035s / 2039s) have NO Holdings guarantee</strong> — they live entirely at Xerox Corp. and are structurally more vulnerable.</p>
        <p style={{ color: T_.red }}>Legacy Xerox <strong>intellectual property sat ENTIRELY at Xerox Corp.</strong> prior to the February 2026 transaction — including the Xerox trademark itself. That's the asset that got moved to IPCo.</p>
      </DetailPanel>
    ),
    ipco: (
      <DetailPanel title="IPCo JV — The Non-Subsidiary Drop-Down (Feb 17, 2026)" onClose={() => setDetail(null)}>
        <p>The centerpiece of the case. Announced <strong>Feb 17, 2026</strong> — a novel structure that bankruptcy lawyers immediately dubbed the "non-subsidiary drop-down."</p>
        <p><strong>Entity architecture (two-tier):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>XRX Brandco Holdings LLC</strong> (aka "IPCo Holdings") — the JV parent. <span style={{ color: T_.red }}>NOT a "Subsidiary" of Xerox</span> under Xerox's existing indentures because Xerox holds less than 50% of voting power.</li>
          <li><strong>XRX Brandco LLC</strong> (aka "IPCo") — wholly-owned sub of IPCo Holdings. Holds the contributed IP (including the Xerox trademark). <strong>Guarantees</strong> the new TPG term loan.</li>
        </ul>
        <p><strong>Capitalization:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Xerox Corp.</strong> → contributed certain IP (trademarks including the <em>Xerox</em> brand; other specified IP) → received <strong>Class B units</strong> (operating economics)</li>
          <li><strong>TPG Credit</strong> → $45M cash → received <strong>Class A units</strong> (voting control / preferred economics)</li>
          <li><strong>TPG-led syndicate</strong> → $405M <strong>senior secured term loan</strong> (5-year, <strong>SOFR + 8.125%</strong> or base+7.125%, 4.50%/yr amortization starting Q4 2026)</li>
          <li>IPCo Holdings then <strong>distributed the $450M to Xerox Corp.</strong> as an equity distribution on the Class B units</li>
          <li>Total capital raised: <strong>$450M</strong> ($405M term loan + $45M preferred equity)</li>
        </ul>
        <p style={{ color: T_.red }}><strong>The innovation — splitting voting from economics:</strong> TPG controls voting. Xerox controls operating economics. The "Subsidiary" test in every existing Xerox indenture is a {">"}50% VOTING test — so IPCo Holdings is not a Subsidiary. That single fact bypasses every covenant that applies to Subsidiaries: the J.Crew blockers, Envision blockers, and $370M cap on non-guarantor restricted-sub investments.</p>
        <p style={{ color: T_.amber }}><strong>Xerox didn't amend a single covenant.</strong> Per Ropes &amp; Gray: "none of Xerox's existing debt documents were amended, underscoring that the structure was engineered to fit within the existing covenant framework."</p>
        <p><strong>Call protection:</strong> IPCo term loan has unusual monthly step-down from <strong>10.25%</strong> in month 1 to <strong>3.875%</strong> by end of year 1. Reorg notes this may imply an unwind option was contemplated at signing — though unwinding would be expensive.</p>
      </DetailPanel>
    ),
    nonSub: (
      <DetailPanel title="Why the J.Crew / Envision / NGRS Blockers All Failed" onClose={() => setDetail(null)}>
        <p>Three existing covenant protections should have prevented this transaction. None of them worked — because every one applied only to <strong>Subsidiaries</strong>.</p>
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 6 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Blocker</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Purpose</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Why it failed</th>
          </tr></thead>
          <tbody>
            {[
              { b: "J.Crew Blocker", p: "Prohibits transfer of Material IP to an Unrestricted Subsidiary", w: "Applies only to Subs. IPCo Holdings is not a Subsidiary → covenant never triggered." },
              { b: "Envision Blocker", p: "Caps transfers to Unrestricted Subs at greater of $85M and 10% of EBITDA", w: "Same defect — applies only to Unrestricted Subsidiaries." },
              { b: "$370M NGRS Cap", p: "Caps investments in Non-Guarantor Restricted Subsidiaries at $370M", w: "NGRSs are by definition Subsidiaries. Non-Subs not subject to this cap." },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "6px 8px", color: T_.text, fontWeight: 600 }}>{r.b}</td>
                <td style={{ padding: "6px 8px", color: T_.textMid }}>{r.p}</td>
                <td style={{ padding: "6px 8px", color: T_.red }}>{r.w}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ color: T_.amber, marginTop: 12 }}><strong>The common fault:</strong> every legacy blocker was drafted to catch the last war. J.Crew / Envision / Serta were all <em>Subsidiary</em> maneuvers — so new indentures added Subsidiary-targeted guards. Xerox sidestepped them by making the drop-down entity a <strong>non-Subsidiary JV</strong>, which no existing covenant contemplates.</p>
        <p style={{ color: T_.textMid }}><strong>Reorg's proposed drafting fixes</strong> (Apr 17, 2026 covenants piece):</p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Expand "Subsidiary" definition to include entities the borrower "otherwise controls management" of (not just {">"}50% voting)</li>
          <li>Draft a Pluralsight blocker covering transfers to <em>"any person that is not a Loan Party"</em> (rather than non-guarantor sub)</li>
          <li>Cap JV investments with a broad "Joint Venture" definition</li>
          <li>Remove or cap the "returns of capital" prong in Available Amount basket (the basket-recycling vulnerability)</li>
        </ul>
        <p style={{ color: T_.red }}><strong>Market prevalence of existing protections is low:</strong> Pluralsight blockers in only <strong>15% of BSLs</strong> and 15% of HY bonds; Envision blockers in 10% BSLs / 16% HY. Most issuers have not yet tightened. Reorg identifies Beacon Roofing, US Foods, Victoria's Secret, and Hertz as having similarly vulnerable "Subsidiary" definitions.</p>
      </DetailPanel>
    ),
    basketRecycling: (
      <DetailPanel title="Basket Recycling — The Second Technique" onClose={() => setDetail(null)}>
        <p>The non-sub structure alone wasn't sufficient — Xerox also needed enough <strong>covenant capacity</strong> to contribute IP of the required value. The capacity came from a clever re-read of the Available Amount basket.</p>
        <p><strong>Two-step IP contribution (per the IPCo credit agreement):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>"First IP Contribution"</strong> — condition precedent to closing. Xerox contributed IP; received Class B units.</li>
          <li><strong>"Second IP Contribution"</strong> — required to occur <em>immediately after term loan incurrence and proceeds distribution</em> (per EoD section).</li>
        </ul>
        <p><strong>Reorg's reconstruction:</strong> Between steps 1 and 2, IPCo Holdings distributed the $450M proceeds back to Xerox Corp. That return of capital refilled the Available Amount basket under the Xerox term loan — which allows <strong>100% of "aggregate returns" on invested capital to replenish the basket</strong>. With the refilled basket, Xerox then contributed additional IP in step 2.</p>
        <p style={{ color: T_.amber }}><strong>Estimated JV investment capacity (pre-recycling):</strong> ~$737M ($452M in explicit JV capacity + $285M in D&amp;O / dividend baskets). Reorg estimates post-recycling capacity is theoretically sufficient for IP materially exceeding $450M.</p>
        <p style={{ color: T_.red }}><strong>Why this matters:</strong> The "returns of capital" prong is the vulnerability. If Xerox has further assets to monetize (Lexmark IP, XFS finance receivables, MPS contracts), the basket can in principle be recycled again — opening a pathway to future LMEs on the same covenant framework.</p>
      </DetailPanel>
    ),
    ssla: (
      <DetailPanel title="SSLA + 2% Royalty — Effective Priming via P&L" onClose={() => setDetail(null)}>
        <p>The Shared Services and License Agreement ("SSLA") is the economic engine — and the most damaging piece for existing creditors.</p>
        <p><strong>Terms:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Xerox and its restricted subs get a <strong>worldwide royalty-bearing license</strong> to use the contributed IP (including the Xerox brand)</li>
          <li>Royalty rate: <strong>2.0% of specified consolidated revenue</strong></li>
          <li>Initial term: <strong>10 years</strong>, auto-renewing in 5-year increments</li>
          <li>Termination: either party with 18 months' notice; IPCo can terminate for material breach, insolvency, or change of control</li>
          <li>90-day sell-off period post-termination</li>
        </ul>
        <p style={{ color: T_.red }}><strong>Reorg's EBITDA drag estimate:</strong> Assuming ~76% of consolidated revenue is Xerox-brand legacy business subject to the 2% rate → <strong>~$121M/yr in royalty expense</strong> flowing from Xerox RemainCo to IPCo. This reduces EBITDA available to existing lenders by <strong>$100–109M/yr through 2027</strong>.</p>
        <p style={{ color: T_.amber }}><strong>The debt service passthrough:</strong> IPCo's $405M term loan at SOFR+8.125% consumes virtually all of the royalty cash flow at current rates. In substance, the SSLA converts future Xerox operating cash flow into debt service on the new IPCo term loan — <strong>effectively priming the existing Xerox debt stack</strong> by diverting cash that would otherwise service legacy obligations.</p>
        <p style={{ color: T_.amber }}><strong>SSLA guarantee covenants:</strong> The SSLA itself carries covenants — limits on indebtedness, liens, asset sales, investments — plus asset-coverage-ratio maintenance requirements and <strong>cross-default</strong> provisions. This creates a complex interdependency: a Xerox default on SSLA obligations triggers the IPCo debt, which in turn could cascade back.</p>
      </DetailPanel>
    ),
    warrant: (
      <DetailPanel title="Warrant Distribution — Coercive Debt-for-Equity (Feb 12, 2026)" onClose={() => setDetail(null)}>
        <p>Announced <strong>Jan 28, 2026</strong>; distributed <strong>Feb 12, 2026</strong>. The warrant leg of the LME — targets the unsecured notes for voluntary retirement.</p>
        <p><strong>Mechanics:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>~<strong>77M warrants</strong> distributed pro-rata to common stock (1 warrant per 2 shares), Series A Convertible Preferred (as-converted), and <strong>3.75% Convertible Notes due 2030</strong> (23.9952 warrants per $1,000 face)</li>
          <li>Exercise price: <strong>$8.00/share</strong></li>
          <li>Expiration: <strong>Feb 11, 2028</strong> (~2-year tenor)</li>
          <li><strong>Dual-path exercise:</strong> pay $8.00 cash per warrant <em>OR</em> surrender "<strong>Designated Notes</strong>" at <strong>face value</strong> ($8 face = 1 warrant)</li>
          <li>Designated Notes = <strong>all Xerox notes EXCEPT the 13% SUNs due 2026</strong> (excluded because those notes are expected to be paid at maturity)</li>
          <li>Total aggregate exercise value: <strong>$616M</strong>. Estimated max debt retirement: <strong>~$600M</strong> of unsecured debt if fully taken up</li>
        </ul>
        <p style={{ color: T_.amber }}><strong>Economics from a bondholder's view (with XRX at ~$2.40, per Reorg):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Intrinsic bond-point value of exercising: <strong>~30 points</strong></li>
          <li>Cost to buy warrants in market: <strong>~8 points</strong></li>
          <li>Net intrinsic value: <strong>~22 points</strong></li>
          <li style={{ color: T_.red }}>But 22 points is <em>above</em> the trading price of every eligible note → <strong>uneconomical for existing holders to exercise</strong></li>
        </ul>
        <p style={{ color: T_.red }}><strong>Moody's framing (Mar 13, 2026):</strong> noted the warrant program "could constitute a distressed exchange if material debt is exchanged" — a credit event trigger.</p>
        <p><strong>Read as signaling:</strong> The warrant leg was announced three weeks <em>before</em> the TPG deal-away. Reorg and third-party commentary interpret the sequence as Xerox telegraphing to unsecured creditors: <em>"engage with us now on a voluntary basis — what comes next may be worse."</em></p>
        <p><strong>Parallel action:</strong> Xerox also filed a <strong>$750M shelf registration on Jan 28, 2026</strong> — financial flexibility for future capital markets activity.</p>
      </DetailPanel>
    ),
    debtStack: (
      <DetailPanel title="Debt Stack & Trading Levels (Pro Forma, Late Mar 2026)" onClose={() => setDetail(null)}>
        <p>Pro-forma capital structure per Reorg and CreditSights. Total funded debt: <strong>~$4.2B</strong>. Weighted avg price before the JV: ~<strong>52 cents</strong>. Discount capture potential at that point: over $2B.</p>
        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginTop: 8 }}>
          <thead><tr style={{ borderBottom: `1px solid ${T_.border}` }}>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Tranche</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Issuer</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Size</th>
            <th style={{ textAlign: "right", padding: "6px 8px", color: T_.textGhost }}>Price</th>
            <th style={{ textAlign: "left", padding: "6px 8px", color: T_.textGhost }}>Rating (S&amp;P / Moody's)</th>
          </tr></thead>
          <tbody>
            {[
              { t: "ABL Revolver", iss: "Xerox Corp", s: "$425M committed (undrawn)", p: "—", r: "—", c: T_.green },
              { t: "IPCo TL (SOFR+8.125%, 2031)", iss: "XRX Brandco / IPCo", s: "$405M", p: "par", r: "n.r.", c: T_.amber },
              { t: "1L Term Loan B due 2029 (S+400)", iss: "Xerox Corp", s: "~$550M", p: "~60s", r: "B- / '2' (80%)", c: T_.blue },
              { t: "10.25% 1L Secured Notes due 2029", iss: "Xerox Corp", s: "~$400M", p: "—", r: "B- / '2' (80%)", c: T_.blue },
              { t: "13.5% 2L Notes due 2031", iss: "Xerox Corp", s: "$500M", p: "37–53", r: "CCC / '5' (20%)", c: T_.amber },
              { t: "5.5% Sr Unsecured Notes due 2028", iss: "Xerox Holdings", s: "$750M", p: "low 40s", r: "CCC / '5'", c: T_.red },
              { t: "8.875% Sr Unsecured Notes due 2029", iss: "Xerox Corp", s: "$500M", p: "—", r: "CCC / '5'", c: T_.red },
              { t: "13% Step-Up SUNs due 2030 (Lexmark)", iss: "Xerox Holdings", s: "$250M", p: "—", r: "CCC / Caa3", c: T_.red },
              { t: "13% SUNs due 2026 (Lexmark)", iss: "Xerox Holdings", s: "$125M", p: "near par", r: "CCC / —", c: T_.green },
              { t: "3.75% Convertible Notes due 2030", iss: "Xerox Holdings", s: "—", p: "—", r: "—", c: T_.purple },
              { t: "Legacy 6.75% Notes due 2039", iss: "Xerox Corp", s: "—", p: "~30", r: "CCC / —", c: T_.red },
              { t: "Legacy Notes due 2035", iss: "Xerox Corp", s: "—", p: "—", r: "CCC / —", c: T_.red },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T_.border}10` }}>
                <td style={{ padding: "5px 8px", color: r.c, fontWeight: 600 }}>{r.t}</td>
                <td style={{ padding: "5px 8px", color: T_.textMid, fontSize: 10 }}>{r.iss}</td>
                <td style={{ padding: "5px 8px", color: T_.textMid, textAlign: "right" }}>{r.s}</td>
                <td style={{ padding: "5px 8px", color: T_.textMid, textAlign: "right" }}>{r.p}</td>
                <td style={{ padding: "5px 8px", color: T_.textMid, fontSize: 10 }}>{r.r}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12, color: T_.amber }}><strong>Leverage:</strong> Pro forma ~6x including pension/lease/finco adjustments, ~9x <em>excluding</em> finco adjustments (Moody's). S&amp;P hypothetical default scenario: 2027 default, emergence EBITDA $517M × 5.5x = <strong>net enterprise value at default $2.37B</strong>.</p>
        <p><strong>Maturity wall:</strong> <strong>$750M in 2028</strong> (5.5% HoldCo SUNs — the first real refinancing test); <strong>{">"}$1.3B in 2029</strong> (1L TL, 1L Notes, 8.875% OpCo SUNs).</p>
      </DetailPanel>
    ),
    creditors: (
      <DetailPanel title="Creditor Organization — Three Distinct Groups" onClose={() => setDetail(null)}>
        <p>Three separate ad hoc creditor groups have organized as of late Mar 2026 — all with different counsel and overlapping-but-distinct interests.</p>
        <p><strong>Group 1 — Gibson Dunn / Moelis (cooperation agreement effective Feb 25, 2026):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Holdings: <strong>majority of 1L Term Loans</strong>, significant 1L Secured Notes, and <strong>13% Senior Unsecured Notes due 2030</strong></li>
          <li>Weighted toward first lien (senior tranches)</li>
          <li>Formed after Xerox executed the TPG deal-away <em>without</em> reaching a consensual deal — despite having restricted multiple large creditors the prior week to discuss a comprehensive balance-sheet solution</li>
          <li style={{ color: T_.amber }}>The 13% 2030 notes have a <strong>Wesco/Incora blocker</strong> protecting against vote manipulation via debt prepayment — adds complexity to any consensual LME</li>
        </ul>
        <p><strong>Group 2 — Paul Hastings / Elliott (identified via CS LFI, Mar 12, 2026):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Focus: <strong>second lien and unsecured creditors</strong></li>
          <li>Elliott Investment Management confirmed as a <strong>sizable holder</strong> behind the group (LFI)</li>
          <li>Likely pursuing a different strategy than the Gibson Dunn group — potentially seeking to establish fulcrum-security leverage in the 2L</li>
        </ul>
        <p><strong>Group 3 — Cadwalader (minority TL lenders):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Minority <strong>~$150M</strong> term loan holdings</li>
          <li>Engaged Cadwalader, Wickersham &amp; Taft; scheduled initial call <strong>Mar 18, 2026</strong></li>
          <li>Likely concerned about adverse amendment treatment in any consensual LME</li>
        </ul>
        <p style={{ color: T_.amber, marginTop: 10 }}><strong>The triangulation problem:</strong> For a consensual LME, Xerox needs majority consent in four distinct tranches (1L TL, 1L Notes, 2L Notes, 13% 2030 SUNs). The Gibson Dunn group spans all four — but the Paul Hastings / Elliott group's 2L and unsecured exposure creates adverse-interest dynamics. Reorg (Feb 13, 2026 modeled scenario): "tall, but ultimately surmountable."</p>
      </DetailPanel>
    ),
    counsel: (
      <DetailPanel title="Counsel Switch — K&E → Simpson Thacher (Mar 27, 2026)" onClose={() => setDetail(null)}>
        <p>Xerox was originally advised on the LME by <strong>Kirkland &amp; Ellis</strong> (retained October 2025). <strong>David Nemecek</strong>, the lead K&amp;E partner who architected the non-subsidiary structure, moved to <strong>Simpson Thacher &amp; Bartlett</strong> on <strong>Feb 18, 2026</strong> (with additional K&amp;E partners following mid-to-late March). Xerox's public counsel switch to Simpson Thacher followed around <strong>Mar 27, 2026</strong>.</p>
        <p style={{ color: T_.amber }}>Partner-follows-client is common. Here the significance is that the architect of the transaction is still running the playbook — continuity with the advisor who structured the novel covenant read matters as creditors organize challenges.</p>
        <p><strong>Xerox's full advisor set (as of late Mar 2026):</strong> Simpson Thacher (legal, post-move), <strong>Lazard</strong> (financial, since Oct 2025).</p>
        <p style={{ color: T_.red }}>Reorg's bottom line as of Mar 27, 2026: Xerox "not out of the woods" despite the TPG liquidity injection. Ongoing negotiations with the Gibson Dunn group; Paul Hastings / Elliott group also active.</p>
      </DetailPanel>
    ),
    ceo: (
      <DetailPanel title="CEO Change — Bandrowczak Out, Pastor In (Mar 30, 2026)" onClose={() => setDetail(null)}>
        <p><strong>Mar 30, 2026:</strong> <strong>Steve Bandrowczak</strong> steps down as CEO. <strong>Louie Pastor</strong> (formerly President and COO) appointed CEO effective immediately.</p>
        <p>Xerox reaffirmed FY2026 guidance concurrent with the announcement: revenue at least $7.5B constant currency (implying <strong>~6% organic decline</strong>), AOI $450–500M, FCF $250M (dependent on $335M of forward-flow receivable sales).</p>
        <p style={{ color: T_.amber }}><strong>Context:</strong> The CEO change came ~6 weeks after the TPG deal-away and amid the formation of the Gibson Dunn and Paul Hastings creditor groups. Bandrowczak had led Xerox through the Lexmark acquisition and the initial LME structuring.</p>
        <p style={{ color: T_.red }}>Third Bridge expert (Mar 2026): <em>"Many Xerox people leading the charge, senior Lexmark advisors being 'showed the door.'"</em> Integration tension reflected in the management shakeup.</p>
      </DetailPanel>
    ),
    ratings: (
      <DetailPanel title="Rating Actions — S&P and Moody's" onClose={() => setDetail(null)}>
        <p><strong>S&amp;P — initial CCC+ downgrade (Nov 5, 2025); subsequent recovery-rating revisions Feb 2026:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Corporate family: <strong>CCC+</strong> (from B-), outlook <strong>negative</strong> — assigned Nov 5, 2025</li>
          <li>Post-IPCo recovery revisions (Feb 2026): 1L Notes and TL lowered to <strong>B-</strong> (from B), recovery <strong>'2' (80%)</strong></li>
          <li>2L Notes: lowered to <strong>CCC</strong> (from CCC+), recovery <strong>'5' (20%)</strong></li>
          <li>HoldCo Sr Unsecured: <strong>CCC</strong>, recovery <strong>'5' (20%)</strong></li>
          <li>Hypothetical default scenario: 2027 default; emergence EBITDA $517M × <strong>5.5x multiple</strong>; net enterprise value at default <strong>$2.37B</strong></li>
        </ul>
        <p><strong>Moody's (Mar 13, 2026):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>CFR: <strong>Downgraded Caa2</strong> (from B2), outlook <strong>negative</strong></li>
          <li>13% Step-Up Backed Senior Unsecured Notes due 2030 (Lexmark-era): <strong>Caa3</strong></li>
          <li>Pro forma leverage: <strong>~6x</strong> including pension/lease/finco adjustments, <strong>~9x</strong> excluding finco</li>
          <li>Drivers: below-plan performance post-Lexmark acquisition; concern debt will need to be restructured</li>
          <li style={{ color: T_.red }}>Moody's flagged: the warrant program <strong>"could constitute a distressed exchange if material debt is exchanged"</strong></li>
        </ul>
      </DetailPanel>
    ),
    creditsights: (
      <DetailPanel title="CreditSights — Full Coverage + Tranche Recommendations" onClose={() => setDetail(null)}>
        <p><strong>Coverage flags (company/101205):</strong> csCoverage ✓ / crCoverage ✓ / lfiCoverage ✓ / financialsCoverage ✓ / riskProductsCoverage ✓. Analyst bench: Nick Williams, Andy Li, CFA; Veronica Graff (LFI); Grondahl, Josefsberg, Diaz-Matos, Quan.</p>
        <p><strong>Overall rec (as of Mar 30, 2026):</strong> <span style={{ color: T_.amber, fontWeight: 600 }}>Hold</span> — upgraded from Underperform <strong>Nov 6, 2025</strong>.</p>
        <p><strong>Tranche-by-tranche (Feb 18, 2026 update):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><span style={{ color: T_.green, fontWeight: 600 }}>BUY</span> — <strong>1L debt (TL + Notes)</strong>. Covered under all scenarios; par recovery maintained pro forma for IPCo debt.</li>
          <li><span style={{ color: T_.amber, fontWeight: 600 }}>HOLD</span> — <strong>2L Notes</strong>. Downside risk from additional IPCo debt + incentive for 1L to argue fulcrum-security position in any restructuring.</li>
          <li><span style={{ color: T_.green, fontWeight: 600 }}>BUY</span> — <strong>5.5% HoldCo SUNs due 2028</strong>. Leverage from being the first substantial unsecured maturity Xerox must address.</li>
          <li><span style={{ color: T_.green, fontWeight: 600 }}>BUY</span> — <strong>13% HoldCo SUNs due 2026</strong>. Expected to be repaid at maturity.</li>
          <li><span style={{ color: T_.red, fontWeight: 600 }}>SELL</span> — <strong>all remaining OpCo unsecured + HoldCo unsecured ex-2028</strong>. Zero to low-single-digit recoveries in low/mid scenarios.</li>
        </ul>
        <p><strong>Recovery scenarios (CS model):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Xerox IP valuation:</strong> ~$490M (2% royalty × estimated Xerox-brand revenue)</li>
          <li><strong>Scenario 1 (status quo waterfall):</strong> Secured unimpaired; HoldCo unsecured <strong>~17%</strong>; OpCo unsecured <strong>~2.6%</strong></li>
          <li><strong>Scenario 2 (excess cash diverted to unsecured exchanges — more likely):</strong> 1L par; 2L materially impaired; unsecured ex-exchange 0% (low/mid), ~3.9–4% (high)</li>
          <li><strong>Excess cash for unsecured exchanges: ~$686.8M</strong> — at 55-cent tender retires ~$1.25B of unsecureds. Addresses 2028 + 2029 maturities but leaves later tenors unaddressed</li>
        </ul>
      </DetailPanel>
    ),
    thirdbridge: (
      <DetailPanel title="Third Bridge Expert Views — 'A Lifeline' or 'Band-Aid'?" onClose={() => setDetail(null)}>
        <p>Two direct Xerox-as-target transcripts (Mar 2026). Anonymous industry experts, analyst-led.</p>
        <p><strong>Transcript 1 (Mar 4, 2026 — "JV, Lexmark Integration, Debt Pressures &amp; Future of MPS"):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><em>"Stabilising from an organisational perspective... but there's still a fair amount in flux, specifically the debt load."</em></li>
          <li>On the JV: <em>"I equate this very similar [to] Kodak on the scanner side... USD 450m is probably accurately priced. The only question is how well are they going to be able to monetise."</em> → Described as "<strong>a lifeline</strong>."</li>
          <li>On capital structure durability: <em>"Something's got to give... margins in this industry in print are not going to go up. [I give Xerox] <strong>1.5–2 years before the debt situation becomes untenable.</strong>"</em></li>
          <li>On warrants: Exchanging debt at distressed levels for deeply-OTM equity <em>"would really be a head scratcher" unless it's the bondholder's only option.</em></li>
          <li>On outlook: <em>"I don't see a way out of this environment... there's no suitor that would step up in this space to buy a print vendor that I can think of."</em></li>
        </ul>
        <p><strong>Transcript 2 (Mar 11, 2026 — "Portfolio Strategy, Inkjet Expansion &amp; Lexmark Operational Integration"):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>On the JV: <em>"You're selling what is made Xerox, Xerox. You're selling what was the core of the company... This is almost a <strong>scream of desperation</strong>."</em> Expert noted XRX stock had never been below $2 in their 30+ year career.</li>
          <li>On the $450M use: <em>"Like putting a <strong>Band-Aid on an artery that's bleeding</strong>."</em></li>
          <li>On Lexmark integration: Lexmark's lower-end A4 portfolio fills a "genuine gap." MPS software has capabilities Xerox lacks. <strong>Channel overlap is the biggest near-term issue</strong> — multiple GTM routes competing for same client.</li>
          <li>On production inkjet: Xerox now relies on a <strong>third-party rebranded product</strong> (Baltoro/Brenva programs apparently discontinued). <em>"Xerox used to sell against [competitors that weren't the OEM]. Now they're in that position."</em> Margin headwind.</li>
          <li>Best case upside: Ricoh (also distressed) faltering + Xerox capturing share, OR combined portfolio improving MPS win rate. Both characterized as "a long shot."</li>
        </ul>
      </DetailPanel>
    ),
    precedent: (
      <DetailPanel title="Precedents — Robertshaw, Trinseo, and What Courts Might Do" onClose={() => setDetail(null)}>
        <p>The non-subsidiary drop-down isn't unprecedented — but it's close. Two prior transactions used variants; one was challenged and partially struck down.</p>
        <p><strong>Robertshaw (Dec 2023) — split-ownership non-sub:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Robertshaw used a split-ownership non-subsidiary structure for a priority drop-down</li>
          <li>Challenged in bankruptcy. <strong>Judge Christopher Lopez (S.D. Tex.)</strong> — same judge from Envision and other recent restructurings — ruled the Dec 2023 prepayment <strong>breached the credit agreement's pro-rata sharing covenant</strong> (§ 2.11). The court did <em>not</em> recharacterize the non-sub entity as a "Subsidiary"</li>
          <li style={{ color: T_.amber }}>Remedy was narrow: <strong>$39,408,199.17 Prepayment Damages claim</strong> (Invesco), plus ~$10.9M attorneys' fees — allowed as an unsecured/deficiency claim at a modeled ~3% recovery, not a cash clawback</li>
          <li><strong>Implication:</strong> Even when a court invalidates the LME mechanic, damages may not meaningfully claw back the economics — the remedy was a pro-rata damages claim in the Ch.11, not an order undoing the transfer. Note this is a pro-rata-sharing ruling, not a non-sub recharacterization precedent</li>
        </ul>
        <p><strong>Trinseo (Sep 2023) — sister-level non-sub:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Trinseo used a sister-level non-subsidiary as primary obligor in a pari-plus structure</li>
          <li>Not directly tested in bankruptcy; remains a live precedent</li>
        </ul>
        <p style={{ color: T_.red }}><strong>The open question for Xerox:</strong> IPCo Holdings' LLC agreement is not publicly filed. The exact voting/economic split between Xerox and TPG is not disclosed. <em>This is the single most important undisclosed fact for assessing whether the "non-sub" characterization would survive judicial challenge.</em> Robertshaw does not itself provide a non-sub recharacterization precedent, but shows S.D. Tex. is willing to enforce the covenant substance over form where the documentary language supports it — if creditors can identify an analogous substantive breach (e.g., pro-rata sharing, "all or substantially all" tests), a similar damages remedy could attach.</p>
        <p style={{ color: T_.amber }}><strong>But challenge pathway matters:</strong> Unlike an uptier (which can be challenged under existing indenture sacred-rights theories), a drop-down to a non-sub via a covenant that explicitly permits the transfer is harder to attack out-of-court. Creditors would likely need a bankruptcy filing to reach the fraudulent-transfer and equitable-subordination tools — which is exactly the leverage Xerox's management now has against creditors contemplating hostile action.</p>
      </DetailPanel>
    ),
    forward: (
      <DetailPanel title="Forward Path — What Happens Next" onClose={() => setDetail(null)}>
        <p>Status as of <strong>April 17, 2026:</strong> ongoing. The situation is still unfolding. Several potential paths:</p>
        <p><strong>1. Consensual LME (modeled by Reorg Feb 13, 2026):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Step One:</strong> Drop-down of Lexmark (~26% of revenues), XFS (~17% of assets), IT Solutions (~10.8%), or additional IP (~9.4%) into a new <strong>NonGuarantor Restricted Subsidiary (NGRS)</strong> — sized below "all or substantially all" threshold (&lt;50% of EV). $1B estimated asset contribution + $200M new money. Ad hoc group exchanges into new pari-plus debt with NGRS collateral + retained RemainCo claims</li>
          <li><strong>Step Two:</strong> Follow-on discounted exchange targeting 2028 and 2029 unsecured notes. At 60% group participation: 2L "significantly impaired"; unsecured "no direct recovery"</li>
          <li>Needs majority consent in: 1L TL, 1L Notes, 2L Notes, 13% 2030 SUNs. Reorg view: "tall, but surmountable"</li>
        </ul>
        <p><strong>2. More deal-aways (non-sub or otherwise):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Lexmark IP</strong> sits at Lexmark subsidiary (USPTO) — explicitly excluded from the Feb 2026 JV. <em>Prime candidate</em> for future monetization. Potentially exceeds legacy Xerox IP in value given Lexmark OEM licensing</li>
          <li>Available Amount basket can be recycled again via the returns-of-capital prong</li>
          <li>XFS finance receivables, MPS contracts — other potential deal-away asset categories</li>
        </ul>
        <p><strong>3. Chapter 11 (on the table):</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Third Bridge expert: <strong>1.5–2 years before untenable</strong></li>
          <li>S&amp;P hypothetical default: <strong>2027</strong></li>
          <li>Moody's leverage estimate <strong>9x excluding finco</strong> → outright deleveraging unlikely through operations alone</li>
          <li>Ch.11 would unlock fraudulent-transfer challenges to the TPG JV + equitable-subordination theories</li>
        </ul>
        <p style={{ color: T_.red }}><strong>Status — by source consensus:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li><strong>Reorg (Apr 17, 2026):</strong> Xerox can continue recycling baskets; non-sub precedent now replicable at other issuers; forward LME activity expected</li>
          <li><strong>CreditSights (Mar 30, 2026):</strong> Hold overall; differentiated tranche calls (1L Buy / 5.5% 2028 Buy / unsecured Sell)</li>
          <li><strong>Third Bridge (Mar 2026):</strong> "lifeline" / "Band-Aid" / "scream of desperation" — 1.5–2 year runway</li>
          <li><strong>Rating agencies:</strong> Caa2 (Moody's) / CCC+ (S&amp;P), both negative outlook</li>
        </ul>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Status Banner ── */}
      <div style={{ background: `${T_.red}12`, borderRadius: 8, border: `1px dashed ${T_.red}60`, padding: "10px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: T_.red, padding: "2px 8px", borderRadius: 4, background: `${T_.red}25` }}>ONGOING</span>
        <span style={{ fontSize: 12, color: T_.textMid }}>Status as of <strong>Apr 17, 2026</strong>. TPG JV closed Feb 17, 2026; Xerox has not filed Ch.11. Creditor groups (Gibson Dunn / Paul Hastings / Cadwalader) organizing.</span>
      </div>

      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Xerox (Nasdaq: XRX) closed the <span style={{ color: T_.amber }}>$1.5B Lexmark acquisition July 2025</span>, stacking leverage on a structurally declining print business (revenue $9.83B 2018 → $7.02B 2025; Adj EBITDA margins 17% → 7.3%). Pro forma debt <span style={{ color: T_.red }}>~$4.35B vs. $512M LTM EBITDA (8.5x total / 7.5x net — per Reorg; Moody's cites ~6x incl finco / ~9x excl)</span>. Starting January 2026, Xerox executed a two-part LME: <span style={{ color: T_.accent }}>(1) a Feb 12, 2026 warrant distribution offering debt-for-equity at $8 strike</span> (up to ~$600M debt retirement); and <span style={{ color: T_.accent }}>(2) the Feb 17, 2026 formation of <strong>XRX Brandco Holdings LLC</strong> — a novel "non-subsidiary" JV with <strong>TPG Credit</strong></span>. Xerox contributed the Xerox trademark and specified IP for Class B units; TPG took Class A units with voting control; a TPG-led syndicate provided <span style={{ color: T_.accent }}>$405M in SOFR+8.125% term loans + $45M preferred = $450M</span>. Because IPCo Holdings is not a "Subsidiary" under existing debt documents (Xerox holds &lt;50% voting), the structure <span style={{ color: T_.red }}>bypasses the J.Crew blockers, Envision blockers, and $370M cap on non-guarantor restricted-sub investments — without amending a single covenant</span>. The SSLA's 2% royalty (~$121M/yr) effectively primes the existing Xerox debt stack. Three creditor ad hoc groups have organized. Rating agencies cut to <span style={{ color: T_.red }}>Caa2 / CCC+</span>. Third Bridge experts give the business <strong>1.5–2 years</strong> before the debt situation becomes untenable.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Funded Debt", v: "~$4.35B", c: T_.red },
            { l: "Total Leverage", v: "8.5x", c: T_.red },
            { l: "Lexmark Closed", v: "Jul 1, 2025", c: T_.amber },
            { l: "Warrant Dist.", v: "Feb 12, 2026", c: T_.accent },
            { l: "IPCo JV", v: "Feb 17, 2026", c: T_.accent },
            { l: "JV Size", v: "$450M", c: T_.amber },
            { l: "CFR (M / S)", v: "Caa2 / CCC+", c: T_.red },
            { l: "XRX Stock", v: "~$1.74", c: T_.red },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART — Post-IPCo Structure
         ════════════════════════════════════════════════════ */}
      <div style={{ margin: "0 auto" }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate &amp; Capital Structure (Post-IPCo JV, Apr 2026)</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 6 }}>The non-subsidiary JV sits outside the Xerox credit group entirely. Click any box for details.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px solid ${T_.green}50`, background: `${T_.green}08`, display: "inline-block" }} /><span style={{ color: T_.green }}>Restricted Group</span></span>
          <span style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 8, borderRadius: 2, border: `2px dashed ${T_.red}50`, background: `${T_.red}08`, display: "inline-block" }} /><span style={{ color: T_.red }}>Non-Subsidiary / Outside Credit Group</span></span>
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: HoldCo + IPCo Holdings side-by-side */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.2fr 1fr", gap: 8, alignItems: "start" }}>
          <div onClick={() => toggle("holdcoOpco")} style={{ cursor: "pointer" }}>
            <Box
              label="Xerox Holdings Corp. (Nasdaq: XRX)"
              sub="FinCo issuer · post-2017 Conduent-spin HoldCo bonds"
              color={T_.red}
              debt={[
                { name: "5.5% SUNs due 2028 ($750M)", amount: "low 40s", color: T_.red },
                { name: "13% Step-Up SUNs due 2030 ($250M)", amount: "Caa3", color: T_.red },
                { name: "13% SUNs due 2026 ($125M)", amount: "near par", color: T_.green },
                { name: "3.75% Convertibles due 2030", amount: "—", color: T_.purple },
              ]}
            />
          </div>
          <div style={{ paddingTop: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center" }}>← TPG JV<br/>SEPARATE<br/>CHAIN →</div>
          </div>
          <div onClick={() => toggle("ipco")} style={{ cursor: "pointer" }}>
            <Box
              label="XRX Brandco Holdings LLC (IPCo Holdings)"
              sub="NON-SUBSIDIARY JV · Formed Feb 17, 2026"
              color={T_.accent}
              dashed
              badges={[{ text: "XRX Class B", color: T_.amber }, { text: "TPG Class A (VOTING)", color: T_.red }]}
              debt={[
                { name: "IPCo Term Loan SOFR+8.125% (2031)", amount: "$405M", color: T_.accent },
                { name: "TPG Class A Preferred", amount: "$45M", color: T_.accent },
              ]}
            />
          </div>
        </div>

        {/* Downward line from Holdings */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.2fr 1fr", gap: 8 }}>
          <VLineLabel label="Intercompany loan + on-lend" color={T_.amber} />
          <div />
          <VLineLabel label="IP contribution" color={T_.accent} />
        </div>

        {/* ROW 2: Xerox Corp (OpCo) + IPCo (sub of IPCo Holdings) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.2fr 1fr", gap: 8, alignItems: "start" }}>
          <div onClick={() => toggle("holdcoOpco")} style={{ cursor: "pointer" }}>
            <Box
              label="Xerox Corporation (OpCo)"
              sub="Primary operating + secured issuer"
              color={T_.blue}
              badges={[{ text: "Guarantor of HoldCo bonds", color: T_.blue }]}
              debt={[
                { name: "ABL Revolver (undrawn)", amount: "$425M", color: T_.green },
                { name: "1L TLB due 2029 (S+400)", amount: "~$550M @ 60s", color: T_.blue },
                { name: "10.25% 1L Secured Notes 2029", amount: "~$400M", color: T_.blue },
                { name: "13.5% 2L Notes due 2031", amount: "$500M @ 37–53", color: T_.amber },
                { name: "8.875% SUNs due 2029", amount: "$500M", color: T_.red },
                { name: "Legacy 6.75% Notes due 2039", amount: "~30", color: T_.red },
              ]}
            />
          </div>
          <div style={{ paddingTop: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 18, color: T_.accent, fontWeight: 700 }}>→</div>
          </div>
          <div onClick={() => toggle("ipco")} style={{ cursor: "pointer" }}>
            <Box
              label="XRX Brandco LLC (IPCo)"
              sub="Wholly-owned sub of IPCo Holdings"
              color={T_.accent}
              dashed
              badges={[{ text: "HOLDS XEROX IP", color: T_.red }, { text: "GUARANTOR OF $405M TL", color: T_.accent }]}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.2fr 1fr", gap: 8 }}>
          <VLineLabel label="Operating subsidiaries" color={T_.textDim} />
          <div />
          <div style={{ fontSize: 10, color: T_.accent, textAlign: "center", padding: "12px 0", lineHeight: 1.5 }}>
            IP licensed BACK to Xerox RemainCo<br/>via <strong>SSLA</strong> @ <strong>2% of revenue</strong><br/>(~$121M/yr royalty drag)
          </div>
        </div>

        {/* ROW 3: Op subs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.5fr 1fr", gap: 6, alignItems: "center" }}>
          <Box label="Lexmark International II LLC" sub="Acquired Jul 2025 · A4 color · APAC · ~26% of pro forma rev" color={T_.amber} />
          <Box label="ITSavvy" sub="Acquired Nov 2024 · IT services · 39% YoY 2025" color={T_.purple} />
          <Box label="Xerox Financial Services (XFS)" sub="FinCo · finance receivables (excluded from core metrics)" color={T_.cyan} />
          <div />
          <div />
        </div>

        {/* Action buttons row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 16 }}>
          <div onClick={() => toggle("business")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "business" ? `${T_.amber}12` : T_.bgInput,
            border: `1px solid ${detail === "business" ? T_.amber : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber }}>Business &amp; Lexmark Integration</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>Revenue $9.7B→$7B · EBITDA 17%→7.3% · Lexmark $1.5B · 80–85% print post-COVID</div>
          </div>
          <div onClick={() => toggle("warrant")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "warrant" ? `${T_.accent}12` : T_.bgInput,
            border: `1px solid ${detail === "warrant" ? T_.accent : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent }}>Warrant Distribution — Debt-for-Equity</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>77M warrants · $8 strike · up to $600M retirement · uneconomical today</div>
          </div>
          <div onClick={() => toggle("ipco")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "ipco" ? `${T_.red}12` : T_.bgInput,
            border: `2px solid ${detail === "ipco" ? T_.red : T_.red + "60"}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T_.red }}>★ IPCo JV — The Non-Sub Drop-Down</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>$450M · XRX Brandco Holdings · TPG Class A voting · Feb 17, 2026</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
          <div onClick={() => toggle("nonSub")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "nonSub" ? `${T_.red}12` : T_.bgInput,
            border: `1px solid ${detail === "nonSub" ? T_.red : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>Why J.Crew / Envision / NGRS Blockers Failed</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>All apply only to "Subsidiaries" · no covenants amended</div>
          </div>
          <div onClick={() => toggle("basketRecycling")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "basketRecycling" ? `${T_.amber}12` : T_.bgInput,
            border: `1px solid ${detail === "basketRecycling" ? T_.amber : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber }}>Basket Recycling — First &amp; Second IP Contribution</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>$450M return refilled Available Amount · $737M est. capacity</div>
          </div>
          <div onClick={() => toggle("ssla")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "ssla" ? `${T_.accent}12` : T_.bgInput,
            border: `1px solid ${detail === "ssla" ? T_.accent : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent }}>SSLA — 2% Royalty Effectively Primes the Stack</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>~$121M/yr drag · 10-yr term · services IPCo debt</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 8 }}>
          <div onClick={() => toggle("debtStack")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "debtStack" ? `${T_.blue}12` : T_.bgInput,
            border: `1px solid ${detail === "debtStack" ? T_.blue : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.blue }}>Full Debt Stack &amp; Trading Levels</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>~$4.2B total · avg price ~52 · 1L 60s · 2L 37–53 · 5.5% SUN 2028 low 40s</div>
          </div>
          <div onClick={() => toggle("creditors")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "creditors" ? `${T_.purple}12` : T_.bgInput,
            border: `1px solid ${detail === "creditors" ? T_.purple : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.purple }}>Creditor Groups (3) — Gibson Dunn · Paul Hastings · Cadwalader</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>GD/Moelis 1L · PH/Elliott 2L+Unsec · CWT minority $150M TL</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 8 }}>
          <div onClick={() => toggle("counsel")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "counsel" ? `${T_.amber}12` : T_.bgInput,
            border: `1px solid ${detail === "counsel" ? T_.amber : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber }}>Counsel Switch — K&amp;E → Simpson Thacher</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>Nemecek moved; Xerox followed · Mar 27, 2026</div>
          </div>
          <div onClick={() => toggle("ceo")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "ceo" ? `${T_.red}12` : T_.bgInput,
            border: `1px solid ${detail === "ceo" ? T_.red : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>CEO Change — Bandrowczak → Pastor (Mar 30, 2026)</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>FY26 guidance reaffirmed · leadership during RX</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
          <div onClick={() => toggle("ratings")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "ratings" ? `${T_.red}12` : T_.bgInput,
            border: `1px solid ${detail === "ratings" ? T_.red : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.red }}>Rating Actions — S&amp;P + Moody's</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>CCC+ / Caa2 · both negative · flagged distressed-exchange risk</div>
          </div>
          <div onClick={() => toggle("creditsights")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "creditsights" ? `${T_.green}12` : T_.bgInput,
            border: `1px solid ${detail === "creditsights" ? T_.green : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.green }}>CreditSights — Tranche Calls</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>Hold overall · 1L Buy · 5.5% 2028 Buy · rest Sell</div>
          </div>
          <div onClick={() => toggle("thirdbridge")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "thirdbridge" ? `${T_.cyan}12` : T_.bgInput,
            border: `1px solid ${detail === "thirdbridge" ? T_.cyan : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.cyan }}>Third Bridge Experts — "Lifeline" or "Band-Aid"?</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>1.5–2yr runway · "scream of desperation" · no suitor</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 8 }}>
          <div onClick={() => toggle("precedent")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "precedent" ? `${T_.purple}12` : T_.bgInput,
            border: `1px solid ${detail === "precedent" ? T_.purple : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.purple }}>Precedents — Robertshaw &amp; Trinseo</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>Lopez recharacterized Robertshaw but remedy was only $39.4M</div>
          </div>
          <div onClick={() => toggle("forward")} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === "forward" ? `${T_.accent}12` : T_.bgInput,
            border: `1px solid ${detail === "forward" ? T_.accent : T_.border}`, transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T_.accent }}>Forward Path — Consensual LME · More Deal-Aways · Ch.11?</div>
            <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>Lexmark IP still unmonetized · S&amp;P default scenario 2027</div>
          </div>
        </div>

      {/* ── Detail Panel ── */}
      {detail && panels[detail] && panels[detail]}
      </div>{/* end org chart box */}
      </div>{/* end org chart max-width wrapper */}

      {/* ════════════════════════════════════════════════════
         KEY CONCEPTS
         ════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 10 }}>Key Concepts</div>
        <ConceptAccordion items={[
          { label: "Non-Subsidiary Drop-Down (the innovation)", color: T_.red, summary: "The first mainstream LME to use a JV that is not a Subsidiary under existing debt documents.", detail: "The 'Subsidiary' definition in most credit agreements relies on a >50% voting test. If an entity fails that test, it is not a Subsidiary — and therefore not subject to any covenant that applies to Subsidiaries (J.Crew blockers, Envision blockers, NGRS caps, Pluralsight blockers, guarantee requirements, affiliate transaction limits). Xerox gave TPG majority voting rights in IPCo Holdings while retaining operational economics via Class B units. No covenant was amended; no consent was sought. Reorg (Apr 17, 2026): the 'non-sub' structure is replicable at many other issuers — Beacon Roofing, US Foods, Victoria's Secret, and Hertz are cited as having similarly vulnerable definitions." },
          { label: "Basket Recycling (the second technique)", color: T_.amber, summary: "The $450M return of capital refilled the Available Amount basket, allowing a second IP contribution.", detail: "The IPCo credit agreement references two IP contributions: the 'First' (condition precedent) and the 'Second' (required immediately after proceeds distribution). Reorg's read: Xerox contributed IP in step 1, IPCo Holdings distributed $450M back to Xerox Corp. as return of capital, which refilled the Available Amount basket (the 'returns of capital' prong allows 100% replenishment), then Xerox contributed additional IP in step 2. Estimated JV investment capacity pre-recycling: ~$737M. Post-recycling: theoretically sufficient for IP materially exceeding $450M. This technique can potentially be used again for future deal-aways." },
          { label: "Effective Priming via Royalty (not lien)", color: T_.accent, summary: "The 2% SSLA royalty diverts ~$121M/yr of cash flow from RemainCo to service IPCo debt — substitute for a lien.", detail: "Traditional priming requires a lien (uptier, drop-down, pari-plus). Xerox primed its existing creditors without touching collateral. The SSLA requires Xerox and restricted subs to pay IPCo 2% of specified consolidated revenue in perpetuity (initial 10-year term auto-renewing). On an estimated 76% Xerox-brand revenue base, that's ~$121M/yr of cash flow that now flows to IPCo rather than legacy lenders. IPCo's $405M term loan at SOFR+8.125% consumes nearly all of it — effectively converting future operating cash flow into debt service on the new tranche. EBITDA available to existing lenders drops $100–109M/yr through 2027. Cross-default provisions in the SSLA guarantee add further interdependency." },
          { label: "Holdco / Opco Double-Dip", color: T_.blue, summary: "Post-Conduent spin structure: Holdings issues bonds, on-lends to Xerox Corp., which guarantees back up.", detail: "Xerox Holdings Corp. (post-2017 FinCo issuer) issues bonds and on-lends proceeds to Xerox Corp. via intercompany note. Xerox Corp. guarantees the Holdings bonds. Holdings bondholders get a direct claim on HoldCo + a guarantee claim on OpCo — classic double-dip. But the guarantee package is NOT aligned across all Xerox bonds: the Lexmark-era 13% 2030 Step-Ups brought tighter guarantees from a broader sub set; legacy OpCo notes (2035s, 2039s) have no Holdings guarantee and trade purely on OpCo credit. Waterfall ordering in any restructuring will be litigated precisely because of these guarantee asymmetries." },
          { label: "Coercive Warrant Distribution", color: T_.accent, summary: "Pro-rata warrants with debt-in-kind exercise — novel alternative to an out-of-court exchange offer.", detail: "Rather than running a formal exchange offer (which has specific consent and tender mechanics), Xerox distributed warrants pro-rata to equity and convertibles. Holders can exercise by surrendering 'Designated Notes' at face value — $8 of face → 1 share at $8 strike. At XRX ~$2.40, the math gives 22 points of intrinsic value per exercised $1,000 face of eligible debt — but that's still above current trading levels of every eligible note. Result: economically coercive for equity-sensitive participants (convert holders, preferred) but sub-economic for bondholders without equity exposure. Moody's flagged that material bond retirement via the warrant could constitute a distressed exchange — a credit-event trigger." },
          { label: "Three-Group Creditor Triangulation", color: T_.purple, summary: "Gibson Dunn (1L/GC) vs. Paul Hastings (2L/Elliott) vs. Cadwalader (minority TL) — adverse interests across the stack.", detail: "Unlike single-group LME negotiations (Envision — one ad hoc group across all classes), Xerox's stack has fragmented. Gibson Dunn / Moelis anchors the senior tranches (1L TL, 1L Notes, 13% 2030 SUNs) — weighted to recovery preservation. Paul Hastings / Elliott sits in 2L and unsecured — interest in establishing fulcrum security and possibly forcing a Ch.11 to unlock fraudulent-transfer theories on the TPG JV. Cadwalader represents ~$150M minority TL holders concerned about being forced into adverse amendments. Any consensual LME requires majorities in four tranches — but each group's preferred outcome differs." },
          { label: "Robertshaw Precedent — Form vs. Substance", color: T_.red, summary: "Judge Lopez recharacterized a similar non-sub as a Subsidiary — but the remedy was only $39.4M.", detail: "Robertshaw (Dec 2023) used a split-ownership non-subsidiary structure for a drop-down. In bankruptcy, Judge Christopher Lopez (S.D. Tex.) looked past form and found the entity WAS a 'Subsidiary' in substance. Significant ruling — but the damages were limited to a $39.4M pro-rata claim rather than an unwind of the transfer. Implication for Xerox: a bankruptcy court could re-characterize IPCo Holdings as a Subsidiary (retroactively triggering the J.Crew blockers), but the recovery for affected creditors may be modest relative to the economic injury. The ruling matters less for damages and more for future deal-structuring — a court-rejected precedent would cool the non-sub playbook." },
          { label: "Lexmark IP as Next-LME Candidate", color: T_.amber, summary: "Lexmark IP was excluded from the Feb 2026 deal — sits at a Lexmark subsidiary and is the biggest unmonetized asset.", detail: "Per USPTO filings, Lexmark IP sits at a Lexmark subsidiary (Lexmark International II, LLC or below). Reorg and CreditSights both note its explicit exclusion from the February 2026 JV. Lexmark has an active OEM licensing business (licensing its print engine to Konica Minolta and others) — suggesting its IP has standalone monetizable value potentially exceeding legacy Xerox IP. If Xerox continues down the deal-away path, Lexmark IP is the most obvious next target. Combined with basket recycling, the same non-sub structure could in principle be repeated. Third Bridge expert: 'there are so many potential places they could push parts of' — even if each individual push doesn't solve the whole problem." },
        ]} />
      </div>

      {/* ════════════════════════════════════════════════════
         TIMELINE
         ════════════════════════════════════════════════════ */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T_.accent, marginBottom: 12 }}>Timeline</div>
        {[
          { date: "2018", event: "Revenue peak at $9.7B. Pre-Conduent-spin Xerox.", color: T_.textMid },
          { date: "2017", event: "Conduent spinoff. Xerox Holdings Corp. becomes post-spin FinCo issuer; Xerox Corp. is OpCo + guarantor.", color: T_.textMid },
          { date: "Nov 2024", event: "Xerox acquires ITSavvy for $400M ($180M cash + $220M secured notes due 2025–26) — diversification into IT services.", color: T_.purple },
          { date: "Dec 2024", event: "Xerox-Lexmark acquisition announced.", color: T_.amber },
          { date: "May 22, 2025", event: "Xerox updates capital allocation policy ahead of Lexmark close — dividend suspended, free cash flow directed to deleveraging.", color: T_.amber },
          { date: "Jul 1, 2025", event: "LEXMARK CLOSES: $1.5B acquisition (incl. debt). Financing: $327M incremental TL + $250M 13% SUNs 2030 + $125M 13% SUNs 2026. Pro forma leverage ~7.5x net / 8.5x total.", color: T_.amber },
          { date: "Oct 2025", event: "Xerox retains Kirkland & Ellis (legal) and Lazard (financial) as RX advisors.", color: T_.red },
          { date: "Nov 6, 2025", event: "CreditSights upgrades from Underperform to Hold overall.", color: T_.textMid },
          { date: "Dec 2025", event: "Xerox files suit against Trump administration seeking IEEPA tariff refund.", color: T_.textMid },
          { date: "Jan 28, 2026", event: "WARRANT DISTRIBUTION ANNOUNCED: Board approves 2-year $8-strike warrants. 23.9952 warrants per $1,000 face of convertibles. $616M aggregate exercise value. $750M shelf registration filed same day.", color: T_.accent },
          { date: "Jan 30, 2026", event: "$110M ITSavvy seller notes repaid.", color: T_.textMid },
          { date: "Feb 12, 2026", event: "WARRANTS DISTRIBUTED: ~77M warrants to common + Series A preferred + 3.75% converts. Designated Notes = all notes except 13% SUNs 2026. Max debt retirement ~$600M.", color: T_.accent },
          { date: "Feb 17, 2026", event: "★ IPCo JV — XRX Brandco Holdings LLC formed with TPG Credit. $405M SOFR+8.125% term loan + $45M preferred = $450M. Xerox contributes IP (incl. Xerox trademark) for Class B units; TPG takes Class A voting units. IPCo Holdings is a 'non-subsidiary' under existing debt documents.", color: T_.red },
          { date: "Feb 18, 2026", event: "CreditSights publishes full tranche-by-tranche recovery analysis (Nick Williams, Andy Li). Valuation of Xerox IP at ~$490M.", color: T_.textMid },
          { date: "Feb 25, 2026", event: "Gibson Dunn / Moelis cooperation agreement effective — majority of 1L TLs, 1L Notes, and 13% 2030 SUNs. Formed after Xerox executed TPG deal away from the group.", color: T_.purple },
          { date: "Feb 27, 2026", event: "S&P downgrades: 1L B-/'2', 2L CCC/'5', HoldCo SUNs CCC/'5'. CFR CCC+ negative outlook.", color: T_.red },
          { date: "Mar 12, 2026", event: "CreditSights LFI: Elliott Investment Management identified as behind Paul Hastings group — sizable position in 2L/unsecured.", color: T_.purple },
          { date: "Mar 13, 2026", event: "Moody's downgrades CFR to Caa2 (from B2), negative outlook. 13% 2030 Step-Ups to Caa3. Flags warrant program as potential distressed exchange.", color: T_.red },
          { date: "Mar 17, 2026", event: "Xerox files FY2025 10-K (delayed from original deadline due to Lexmark purchase-accounting finalization).", color: T_.textMid },
          { date: "Mar 18, 2026", event: "Cadwalader minority TL group (~$150M) holds inaugural call.", color: T_.purple },
          { date: "Mar 27, 2026", event: "Counsel switch: David Nemecek moves from Kirkland & Ellis to Simpson Thacher; Xerox follows. Reorg: 'not out of the woods.'", color: T_.amber },
          { date: "Mar 30, 2026", event: "CEO change: Steve Bandrowczak steps down; Louie Pastor (ex-President/COO) appointed CEO effective immediately. FY26 guidance reaffirmed.", color: T_.red },
          { date: "Apr 7, 2026", event: "Harvard Bankruptcy Roundtable publishes 'Liability Management 2026: For Better or Worse' — cites Xerox context as part of broader LME evolution.", color: T_.textMid },
          { date: "Apr 17, 2026", event: "Reorg 'Jamming the Photocopier' covenants analysis: non-sub structure replicable at Beacon Roofing, US Foods, Victoria's Secret, Hertz. Proposes drafting fixes (voting+management test, Pluralsight blocker to 'non-Loan Party', JV cap with broad JV definition, cap on returns-of-capital basket). Case remains ongoing.", color: T_.red },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 4, alignItems: "flex-start" }}>
            <div style={{ width: 100, flexShrink: 0, fontSize: 10, fontWeight: 600, color: e.color, paddingTop: 2 }}>{e.date}</div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.color, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontSize: 11, color: T_.textMid, lineHeight: 1.5 }}>{e.event}</div>
          </div>
        ))}
      </div>

      {/* ── Sources footer ── */}
      <div style={{ marginTop: 24, padding: "12px 16px", background: T_.bgPanel, borderRadius: 8, border: `1px solid ${T_.borderLight}`, fontSize: 10, color: T_.textGhost, lineHeight: 1.7 }}>
        <strong style={{ color: T_.textMid }}>Sources:</strong> Reorg / Octus — articles 366390 (org chart), 367399 + 376308 (non-sub covenant analysis), 362564 (liquidity model), 373462 + multiple (debt stack + trading), 'Jamming the Photocopier' Apr 17 2026 covenants piece · CreditSights — "Xerox: JV IP Deal with TPG Credit; Model Update" Feb 18 2026 article 699167 (Nick Williams + Andy Li), LFI articles 40019247 (co-op announcement) + 40020677 (Elliott / Paul Hastings) + 699167 Mar 30 CEO note · Third Bridge Forum — Mar 4 2026 transcript (uuid c7c84df69c2c9f2ec6db9fb17c551dbe) + Mar 11 2026 transcript (uuid 4f55db914669930fa3e2f20976b57875) · Xerox investor relations press releases (Dec 2024 Lexmark announcement, May 22 2025 capital allocation, Jul 1 2025 Lexmark close, Jan 28 2026 warrant announcement, Feb 12 2026 warrant distribution, Feb 17 2026 IPCo JV) · Xerox 10-K FY2025 (filed Mar 17 2026) · Form 8-Ks for IPCo JV and CEO change · Ropes &amp; Gray "Distressed Debt Legal Insights: Xerox and the 'Non-Subsidiary' Drop-Down" (Mar 2026) · Winston &amp; Strawn "The Xerox Non-Subsidiary Drop-Down Financing: A New Frontier in Leakage and Subordination" · PETITION #11 (Feb 25 2026) · Harvard Bankruptcy Roundtable "Liability Management 2026: For Better or Worse" (Apr 7 2026) · Restructuring Newsletter "Xerox: From Tech Obsolescence to LME Engineering" (Mar 13 2026) · HSG LLP "Liability Management Exercises and the Courts in 2025" · Moody's + S&amp;P rating actions (Feb 27 + Mar 13 2026) · Benzinga + Stocktitan 8-K coverage · USPTO assignment records. 9fin session was expired during research — additional coverage may exist there. Ongoing case; all figures and characterizations current as of April 17, 2026.
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function Restructuring({ initialTab }) {
  const [activeCase, setActiveCase] = useState(initialTab || "windstream");

  useEffect(() => {
    if (initialTab) setActiveCase(initialTab);
  }, [initialTab]);

  return (
    <div style={{ padding: "36px 44px", fontFamily: FONT, maxWidth: "100%", margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>Restructuring</div>
        <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>Case studies in distressed debt, liability management, and Chapter 11</div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid #1E293B", marginBottom: 24, width: "fit-content", maxWidth: "100%" }}>
        {CASES.map(c => (
          <button key={c.key} onClick={() => setActiveCase(c.key)} style={{
            padding: "8px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            border: "none", background: activeCase === c.key ? "#3B82F6" : "#111827",
            color: activeCase === c.key ? "#FFF" : "#94A3B8",
            transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: FONT,
          }}>{c.label}</button>
        ))}
      </div>

      {activeCase === "windstream" && <WindstreamCase />}
      {activeCase === "envision" && <EnvisionCase />}
      {activeCase === "serta" && <SertaCase />}
      {activeCase === "diebold" && <DieboldNixdorfCase />}
      {activeCase === "jcrew" && <JCrewCase />}
      {activeCase === "petsmart" && <PetSmartCase />}
      {activeCase === "incora" && <IncoraCase />}
      {activeCase === "caesars" && <CaesarsCase />}
      {activeCase === "xerox" && <XeroxCase />}
    </div>
  );
}
