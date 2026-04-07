import { useState, useEffect } from "react";

const T_ = {
  bg: "#0a0e17", bgPanel: "#111827", bgInput: "#161d2e",
  border: "#283347", borderLight: "#222d40",
  accent: "#f5a623", text: "#e8ecf1", textMid: "#b0bcc9", textDim: "#8a99ab", textGhost: "#6e7f93",
  green: "#34d673", blue: "#70b0fa", red: "#f87171", amber: "#f5a623",
  purple: "#a78bfa", cyan: "#22d3ee", emerald: "#34d399",
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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

// Horizontal split with branch lines from center
function BranchDown({ children, color }) {
  const count = Array.isArray(children) ? children.length : 1;
  if (count === 1) return <>{children}</>;
  return (
    <div>
      {/* Vertical stub down from parent */}
      <VLine h={14} color={color} />
      {/* Horizontal bar spanning all children */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 0 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%", height: 0,
              borderTop: `2px solid ${color || T_.border}`,
              ...(i === 0 ? { marginLeft: "50%" } : i === count - 1 ? { marginRight: "50%" } : {}),
            }} />
          </div>
        ))}
      </div>
      {/* Vertical stubs down to each child + the children */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 12 }}>
        {(Array.isArray(children) ? children : [children]).map((child, i) => (
          <div key={i}>
            <VLine h={14} color={color} />
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

// Guarantee arrow (horizontal, from subs pointing to a debt box)
function GuaranteeArrow({ from, to, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", fontSize: 9, color: color || T_.green }}>
      <span style={{ fontWeight: 600 }}>{from}</span>
      <span>{"─── guarantees ───▸"}</span>
      <span style={{ fontWeight: 600 }}>{to}</span>
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
        <p>Nebraska corp. Intermediate holding company between Holdings and Services. <strong>Guarantor</strong> of the credit facility.</p>
        <p>Issued its own <strong>6.750% Secured Notes due 2028</strong> — an unusual structural wrinkle. This creates a mini capital structure between HoldCo and OpCo. Treatment in the restructuring depended on this entity's standalone value vs. obligations.</p>
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
      <DetailPanel title="Uniti Group / Master Lease" onClose={() => setDetail(null)}>
        <p><strong>April 2015:</strong> Windstream spun off fiber/copper network into Communications Sales & Leasing, Inc. (renamed Uniti Group Inc., NASDAQ: UNIT).</p>
        <p><strong>Structure:</strong> Uniti Group Inc. → Uniti Group LP (f/k/a CSL Capital) → Uniti Leasing LLC (f/k/a CSL National, LP) [holds the assets].</p>
        <p><strong>Master Lease:</strong> 15-year triple-net, ~$659M/yr rent with escalators, expiring ~2030. This became effectively super-senior — an operating cost that must be paid to keep the business running.</p>
        <p style={{ color: T_.red }}>Aurelius argued this violated the 6.375% Notes indenture's sale-leaseback covenant. Judge Furman (SDNY) agreed Feb 15, 2019. ~$310M accelerated → cross-default → Ch.11 filed Feb 25, 2019.</p>
        <p><strong>Settlement:</strong> Uniti committed ~$1.75B in FTTP network upgrades + modified lease terms. Windstream was ~65% of Uniti's revenue — massive leverage in negotiation.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Rural/regional telecom (18 states). Distress from <span style={{ color: T_.red }}>secular decline</span> + <span style={{ color: T_.red }}>overleveraged M&A</span> + <span style={{ color: T_.red }}>2015 Uniti REIT spin-off</span> that moved network assets outside the credit group. Aurelius exploited a covenant breach to force Ch.11.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Revenue (2018)", v: "~$5.7B", c: T_.blue },
            { l: "Total Debt", v: "~$5.6B", c: T_.red },
            { l: "Filed", v: "Feb 25, 2019", c: T_.red },
            { l: "Emerged", v: "Sep 21, 2020", c: T_.green },
            { l: "Debt Cut", v: ">$4B", c: T_.green },
          ].map(m => (
            <div key={m.l} style={{ background: T_.bgInput, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T_.border}` }}>
              <div style={{ fontSize: 9, color: T_.textGhost, textTransform: "uppercase", fontWeight: 600 }}>{m.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         ORG CHART — Bond prospectus style
         Click boxes for detail panels below the chart.
         ════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 16 }}>Click any entity for details. Dashed = outside credit group.</div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* ROW 1: Equity */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box label="Public Shareholders" sub="Common equity" color={T_.textGhost} badges={[{ text: "CANCELLED — $0", color: T_.red }]} width={260} />
        </div>

        <VLineLabel label="100% equity ownership" />

        {/* ROW 2: HoldCo */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Windstream Holdings, Inc."
            sub="HoldCo · Delaware · No operations"
            color={T_.red}
            badges={[{ text: "STRUCTURALLY SUBORDINATED", color: T_.red }]}
            onClick={() => toggle("holdco")} selected={detail === "holdco"}
            width={320}
          />
        </div>

        <VLineLabel label="100% equity" />

        {/* ROW 3: Intermediate */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Windstream Holding of the Midwest, Inc."
            sub="Intermediate HoldCo · Nebraska · Guarantor"
            color={T_.purple}
            debt={[{ name: "6.750% Secured Notes due 2028", amount: "Secured", color: T_.purple }]}
            onClick={() => toggle("midwest")} selected={detail === "midwest"}
            width={360}
          />
        </div>

        <VLineLabel label="100% equity" />

        {/* ROW 4: OpCo */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Windstream Services, LLC"
            sub="OpCo · Delaware · Borrower & Co-Issuer"
            color={T_.blue}
            badges={[
              { text: "BORROWER", color: T_.blue },
              { text: "STRUCTURALLY SENIOR", color: T_.green },
            ]}
            debt={[
              { name: "1st Lien (RCF ~$800M + TL ~$1.8B + Notes $400M)", amount: "~$3,151M", color: T_.green },
              { name: "2nd Lien (10.5% + 9.0% Notes)", amount: "~$1,235M", color: T_.amber },
              { name: "Sr Unsecured (6 series)", amount: "~$1,183M", color: T_.red },
            ]}
            onClick={() => toggle("opco")} selected={detail === "opco"}
            width={400}
          />
        </div>

        {/* Guarantee & co-issuer annotations */}
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: 9, color: T_.green }}>▲ 92 subs guarantee secured debt</span>
            <span style={{ fontSize: 9, color: T_.textGhost }}>▲ Finance Corp. co-issues all notes</span>
          </div>
        </div>

        <VLine h={14} />

        {/* ROW 5: Three children — Finance Corp, Subs, and click-targets for debt detail */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "start" }}>

          {/* Finance Corp */}
          <Box
            label="Windstream Finance Corp."
            sub="Co-Issuer · Delaware · No assets"
            color={T_.textDim}
            badges={[{ text: "CO-ISSUER ONLY", color: T_.textMid }]}
          />

          {/* Operating Subs */}
          <Box
            label="Operating Subsidiaries"
            sub="155+ entities · ILECs + CLECs · 18 states"
            color={T_.emerald}
            badges={[
              { text: "92 GUARANTORS", color: T_.green },
              { text: "REVENUE SOURCE", color: T_.emerald },
            ]}
            onClick={() => toggle("subs")} selected={detail === "subs"}
          />

          {/* Receivables SPV */}
          <Box
            label="Windstream Receivables LLC"
            sub="A/R Securitization · Bankruptcy-remote SPV"
            color={T_.textDim}
            badges={[{ text: "SPECIAL PURPOSE", color: T_.textGhost }]}
          />
        </div>
      </div>

      {/* UNITI — Outside the credit group */}
      <div style={{ padding: "16px", background: `${T_.red}04`, borderRadius: 12, border: `2px dashed ${T_.red}30`, marginBottom: 4, marginTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, textAlign: "center" }}>Outside the Credit Group — Counterparty</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Uniti Group Inc."
            sub="REIT · NASDAQ: UNIT · Spun off April 2015"
            color={T_.red}
            dashed
            debt={[{ name: "Master Lease (triple-net)", amount: "~$659M/yr", color: T_.red }]}
            badges={[
              { text: "OWNS THE NETWORK", color: T_.amber },
              { text: "SEPARATE PUBLIC CO", color: T_.red },
            ]}
            onClick={() => toggle("uniti")} selected={detail === "uniti"}
            width={380}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 9, color: T_.red }}>
          Uniti Leasing LLC (f/k/a CSL National, LP) → Uniti Group LP → Uniti Group Inc.
        </div>
      </div>

      {/* ── Debt detail click targets ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "firstlien", label: "1st Lien Detail", color: T_.green, amount: "~$3,151M", recovery: "62.8–71.3%" },
          { k: "secondlien", label: "2nd Lien Detail", color: T_.amber, amount: "~$1,235M", recovery: "~0%" },
          { k: "unsecured", label: "Unsecured Detail", color: T_.red, amount: "~$1,183M", recovery: "~0%" },
        ].map(d => (
          <div key={d.k} onClick={() => toggle(d.k)} style={{
            padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: detail === d.k ? `${d.color}12` : T_.bgInput,
            border: `1px solid ${detail === d.k ? d.color : T_.border}`,
            transition: "all .15s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: d.color, marginTop: 2 }}>{d.amount}</div>
            <div style={{ fontSize: 9, color: d.recovery.includes("0%") ? T_.red : T_.amber }}>Recovery: {d.recovery}</div>
          </div>
        ))}
      </div>

      {/* ── Detail Panel (appears below chart when something is clicked) ── */}
      {detail && panels[detail] && panels[detail]}

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
          { label: "Cash Flow Waterfall", color: T_.emerald, summary: "Revenue at subs → OpCo → debt service → only residual goes to HoldCo.", detail: "At OpCo level: (1) OpEx + CapEx, (2) Uniti lease ~$659M/yr (effectively super-senior), (3) 1L service, (4) 2L, (5) unsecured. Only after ALL that is satisfied does cash dividend up to HoldCo. When EBITDA declined, the waterfall broke." },
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
          { date: "Apr 2015", event: "Windstream spins off network to Uniti Group (REIT) + enters ~$659M/yr master lease.", color: T_.amber },
          { date: "2016–17", event: "Aurelius accumulates 25%+ of 6.375% Notes at a discount, identifies covenant breach.", color: T_.blue },
          { date: "Sep 2017", event: "Aurelius delivers default notice — spin-off = prohibited sale-leaseback.", color: T_.red },
          { date: "Dec 2017", event: "Acceleration notice — ~$310M immediately due.", color: T_.red },
          { date: "Feb 15, 2019", event: "Judge Furman rules for Aurelius. Default confirmed. Cross-defaults cascade.", color: T_.red },
          { date: "Feb 25, 2019", event: "Windstream files Chapter 11. $1B DIP from Citigroup. 205 debtor entities.", color: T_.red },
          { date: "Jun 2020", event: "Plan confirmed. Unsecured crammed down. Uniti settlement (~$1.75B network investment).", color: T_.amber },
          { date: "Sep 21, 2020", event: "Emerges as Holdings II (private). >$4B debt eliminated. 1L holders = new owners.", color: T_.green },
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
        <p style={{ color: T_.red }}>The thesis collapsed: the No Surprises Act (Jan 2022) gutted out-of-network billing, one major payor cut reimbursements ~60%, and post-COVID labor inflation added ~$330M/yr in costs. KKR ultimately lost its entire ~$3.5B equity investment.</p>
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
        <p><strong>EVPS funded debt at filing: ~$6.4B</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>ABL Facility: up to $550M borrowing capacity</li>
          <li>First-out TL: $300M (new money, backstopped by ad hoc group)</li>
          <li>Second-out TL: ~$2.2B (exchanged at 17% discount)</li>
          <li>Third-out TL: ~$1.0B (exchanged at par)</li>
          <li>Fourth-out TL: ~$153M (non-participating lenders — subordinated)</li>
          <li>Senior Unsecured Notes: $938.9M (8.75%)</li>
        </ul>
        <p style={{ color: T_.red }}>96% of original TL holders participated in the uptier. The 4% who didn't were pushed to "fourth-out" — effectively subordinated without their consent. This is creditor-on-creditor violence.</p>
      </DetailPanel>
    ),
    amsurg: (
      <DetailPanel title="AmSurg Silo — The Dropdown" onClose={() => setDetail(null)}>
        <p>In April 2022, Envision designated <strong>AmSurg Holdco and subsidiaries as Unrestricted Subsidiaries</strong> under the Envision credit facilities. This was the foundational move — it removed ~$2.5B of AmSurg assets (250+ ambulatory surgery centers, ~83% of AmSurg EBITDA) from the existing lenders' collateral pool.</p>
        <p><strong>AmSurg then raised its own debt:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>RCF: $301M (maturity Jul 2026)</li>
          <li>1st Lien TL: $1,358M (maturity Apr 2027)</li>
          <li>2nd Lien TL: $1,494M (maturity Apr 2028)</li>
        </ul>
        <p>AmSurg distributed ~$1.1B to Envision (upstream cash). Then raised ~$1.3B more in 2L debt, loaning proceeds to Envision for debt buybacks. Envision repurchased ~$1.9B of existing TL at a discount, generating ~$582M in discount gains.</p>
        <p style={{ color: T_.amber }}>New lenders <strong>Angelo Gordon and Centerbridge</strong> (joined by PIMCO, HPS, Sculptor, King Street) provided the AmSurg financing — they got security over the most profitable assets that original Envision lenders had just lost. Davis Polk advised the administrative/collateral agent on the $600M new credit facilities.</p>
        <p>Intercompany loans from AmSurg to Envision: ~$1.8B (including accrued interest). These were cancelled for zero recovery in Ch.11.</p>
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
        <p><strong>~96% participated.</strong> The ~4% who didn't were left holding "Fourth-out" (~$153M) — same original loan, now structurally and contractually junior to $3.5B+ of participating debt.</p>
        <p style={{ color: T_.red }}>This is the "creditor-on-creditor violence" — majority lenders voted to subordinate the minority. The non-participating lenders (including <strong>Vibrant Capital, Saratoga Investment, Crescent Capital</strong>) sued, alleging breach of "Sacred Rights" (Section 13.1) requiring unanimous consent for principal reduction, maturity extension, or collateral release. Case was voluntarily dismissed post-emergence.</p>
        <p>KKR itself held term loans in the newly created uptier tranches.</p>
      </DetailPanel>
    ),
    evpsPlan: (
      <DetailPanel title="EVPS Plan Treatment (Ch.11)" onClose={() => setDetail(null)}>
        <p><strong>ABL Claims:</strong> Paid in full (cash or amended revolving commitments).</p>
        <p><strong>First-out TL ($300M):</strong> Pro rata share of First-Out Cash Payment + exit term loans. Near-par recovery.</p>
        <p><strong>Second-out TL (~$2.2B):</strong> Received <strong>100% reorganized equity</strong> in Reorganized Envision Parent. These holders became the new owners of the EVPS business. Fulcrum security.</p>
        <p><strong>Third-out TL (~$1.0B):</strong> Impaired. Received residual value below second-out.</p>
        <p><strong>Fourth-out TL (~$153M):</strong> Effectively wiped out — the non-participants from the uptier.</p>
        <p><strong>Unsecured Notes ($938.9M):</strong> Originally offered 3-year warrants if class voted to accept. UCC negotiated final settlement: <strong>$35M cash + 1.5% reorganized equity</strong> for noteholders, additional $5M for general unsecured.</p>
        <p><strong>General Unsecured:</strong> Pro rata share of $1M cash pool (if accepted). Eventually $5M via UCC settlement.</p>
        <p><strong>KKR Equity:</strong> Cancelled — $0. KKR lost its entire ~$3.5B investment.</p>
      </DetailPanel>
    ),
    amsurgPlan: (
      <DetailPanel title="AmSurg Plan Treatment (Ch.11)" onClose={() => setDetail(null)}>
        <p><strong>RCF ($301M):</strong> Paid in full, cash.</p>
        <p><strong>1st Lien TL ($1,358M):</strong> Paid in full, cash (from ~$1.6B exit term loan proceeds + $300M exit RCF).</p>
        <p><strong>2nd Lien TL ($1,494M):</strong> Received <strong>100% reorganized equity</strong> in Reorganized AmSurg Parent + subscription rights via backstop commitment + equity rights offering. Fulcrum security for this silo.</p>
        <p><strong>Intercompany Claims (~$1.8B owed by Envision to AmSurg):</strong> Cancelled and extinguished — $0 distribution. This is key: the loans AmSurg made to Envision (funded from the dropdown proceeds) were worthless.</p>
        <p><strong>General Unsecured:</strong> Pro rata share of $1.5M cash.</p>
        <p><strong>AmSurg purchased</strong> certain ASC assets from the Envision estate for $300M + waiver of intercompany loans.</p>
      </DetailPanel>
    ),
    litigation: (
      <DetailPanel title="Key Litigation & Disputes" onClose={() => setDetail(null)}>
        <p><strong>UCC vs. LME Transactions:</strong> The Official Committee of Unsecured Creditors sought standing to void the 2022 dropdown + uptier as fraudulent transfers (Section 548). Challenged lien validity and secured party releases. Resolved through plan negotiations — UCC secured $35M + 1.5% equity for noteholders.</p>
        <p><strong>Non-Participating Lender Suit:</strong> Vibrant Capital, Saratoga, Crescent Capital filed adversary proceeding alleging breach of "Sacred Rights" (unanimous consent required for principal reduction/maturity extension/collateral release). Voluntarily dismissed with prejudice post-emergence.</p>
        <p><strong>Independent Director Review:</strong> Gary Begeman (counsel: Haynes and Boone) concluded the LME transactions generated ~$1.7B in quantified benefits and the board acted within fiduciary duties. No actual fraud.</p>
        <p><strong>Securities Settlement:</strong> Pre-existing class action re: billing practices settled for $177.5M (fully insurance-funded), approved Mar 2024.</p>
        <p style={{ color: T_.amber }}>Post-Envision, the market coined <strong>"Envision blockers"</strong> — new covenant provisions in credit agreements that restrict a borrower's ability to transfer assets to unrestricted subsidiaries. This case literally changed how loan documents are written.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          KKR took Envision private for $9.9B in 2018, combining EmCare (physician staffing) with AmSurg (surgery centers). The company was crushed by the <span style={{ color: T_.red }}>No Surprises Act</span>, <span style={{ color: T_.red }}>payor reimbursement cuts (~60%)</span>, and <span style={{ color: T_.red }}>post-COVID labor inflation (+$330M/yr)</span>. Before filing, KKR executed a <span style={{ color: T_.amber }}>dropdown + uptier</span> — moving the profitable AmSurg business to an unrestricted subsidiary and repricing the debt stack, creating winners and losers among creditors.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "LBO Price", v: "$9.9B", c: T_.purple },
            { l: "Total Debt", v: "~$8B+", c: T_.red },
            { l: "Filed", v: "May 15, 2023", c: T_.red },
            { l: "Emerged", v: "Nov 3, 2023", c: T_.green },
            { l: "Debt Cut", v: "~$7B", c: T_.green },
            { l: "Debtor Entities", v: "216", c: T_.textMid },
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
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure (Post-LME, at Filing)</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 16 }}>After the Apr–Aug 2022 dropdown + uptier. Two separately capitalized silos. Click any box for details.</div>
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

          {/* ─── LEFT: EVPS SILO ─── */}
          <div>
            <VLine h={14} />
            <Box
              label="EVPS Silo"
              sub="Envision Physician Services · 25,000+ clinicians"
              color={T_.blue}
              badges={[
                { text: "PHYSICIAN STAFFING", color: T_.blue },
                { text: "~$6.4B DEBT", color: T_.red },
              ]}
              debt={[
                { name: "ABL Facility", amount: "≤$550M", color: T_.green },
                { name: "1st-out TL (new money)", amount: "$300M", color: T_.green },
                { name: "2nd-out TL (17% discount)", amount: "~$2.2B", color: T_.blue },
                { name: "3rd-out TL (at par)", amount: "~$1.0B", color: T_.amber },
                { name: "4th-out TL (non-participants)", amount: "~$153M", color: T_.red },
                { name: "Sr Unsecured Notes (8.75%)", amount: "$938.9M", color: T_.red },
              ]}
              onClick={() => toggle("evps")} selected={detail === "evps"}
            />
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
                  { text: "~$3.2B DEBT", color: T_.red },
                  { text: "DROPPED DOWN", color: T_.red },
                ]}
                debt={[
                  { name: "RCF", amount: "$301M", color: T_.green },
                  { name: "1st Lien TL", amount: "$1,358M", color: T_.green },
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
            ↔ Intercompany loans: AmSurg → Envision ~$1.8B (cancelled for $0 in Ch.11)
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
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>2nd-out → 100% equity · Unsecured → $35M + 1.5% · KKR → $0</div>
        </div>
        <div onClick={() => toggle("amsurgPlan")} style={{
          padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
          background: detail === "amsurgPlan" ? `${T_.amber}12` : T_.bgInput,
          border: `1px solid ${detail === "amsurgPlan" ? T_.amber : T_.border}`, transition: "all .15s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T_.amber }}>AmSurg Plan Treatment</div>
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>1L → paid in full · 2L → 100% equity · Intercompany → $0</div>
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
          <div style={{ fontSize: 10, color: T_.textDim, marginTop: 2 }}>UCC fraudulent transfer claims · Sacred Rights suit · market impact</div>
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
          { label: "Unrestricted Subsidiary Designation (Dropdown)", color: T_.amber, summary: "AmSurg's $2.5B in assets moved outside the credit group via a covenant loophole.", detail: "Credit agreements define 'Restricted' vs 'Unrestricted' subsidiaries. Restricted subs are part of the collateral/guarantor pool. Unrestricted subs are carved out — creditors can't reach their assets. The 2018 credit docs allowed ~$2.5B of asset transfers. KKR/Envision used this basket to redesignate AmSurg as Unrestricted, pulling 250+ surgery centers (~83% of AmSurg EBITDA) out of existing lenders' collateral. This is the 'dropdown' — assets drop out of the credit group." },
          { label: "Uptier / Priming Transaction", color: T_.red, summary: "Majority lenders exchanged into super-priority tranches, subordinating the minority.", detail: "After the dropdown generated cash, Envision offered all 1L TL holders a refinancing: contribute new money → First-out, exchange at discount → Second-out, exchange at par → Third-out. 96% participated. Non-participants were left in Fourth-out — same loan, but now junior to $3.5B+ of new/exchanged debt. The majority lenders effectively voted to prime the minority. This was legal because the credit agreement's 'open market purchase' and amendment provisions didn't require unanimous consent for these changes." },
          { label: "Creditor-on-Creditor Violence", color: T_.purple, summary: "Lenders in the same tranche fighting each other — the defining distressed theme of 2020s.", detail: "Unlike Windstream (creditors vs company), Envision's battle was creditors vs creditors. The ad hoc group of larger holders (who could backstop new money) got priority treatment. Smaller holders who couldn't participate were subordinated. The company and sponsor facilitated this split. This dynamic — majority lenders using document flexibility to extract value at minority expense — is now the dominant pattern in distressed credit. Post-Envision, 'Envision blockers' are standard in new credit agreements." },
          { label: "Dual-Silo Structure", color: T_.blue, summary: "Two separately capitalized businesses with separate creditor groups, plans, and outcomes.", detail: "After the dropdown, Envision effectively had two mini-capital structures: the EVPS silo (~$6.4B debt) and the AmSurg silo (~$3.2B debt). Each had its own RSA (Restructuring Support Agreement), creditor constituencies, and Ch.11 plan. AmSurg 1L was paid in full while EVPS 2nd-out became equity. The intercompany loans connecting them ($1.8B) were cancelled for nothing. Two silos = two separate recovery stories within one bankruptcy." },
          { label: "Sacred Rights & Unanimous Consent", color: T_.accent, summary: "Certain changes require 100% lender consent — but the boundaries are litigated.", detail: "Most credit agreements have 'sacred rights' that can't be amended without unanimous consent: principal reduction, maturity extension, lien release, payment waterfall changes. Non-participating Envision lenders (Vibrant, Saratoga, Crescent) argued the uptier violated these rights. The company argued the transaction was structured to avoid triggering sacred rights (open market purchases, not amendments). This gray zone is where modern LME battles are fought." },
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
          { date: "Nov 3, 2023", event: "Emergence. Two separate companies: Reorganized Envision (EVPS) + Reorganized AmSurg. ~$7B debt eliminated. KKR out.", color: T_.green },
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
        <p><strong>What PTL Lenders got:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>Provided <strong>$200M new money</strong> → received super-priority "First-Out" position</li>
          <li>Exchanged <strong>$875M of existing loans</strong> into new priority "Second-Out" tranche:
            <ul>
              <li>1st lien loans exchanged at <strong>74% of par</strong></li>
              <li>2nd lien loans exchanged at <strong>39% of par</strong></li>
            </ul>
          </li>
          <li>Total new priority tranche: <strong>~$1.075B</strong> (First-Out + Second-Out)</li>
        </ul>
        <p><strong>What Excluded Lenders experienced:</strong></p>
        <p style={{ color: T_.red }}>Non-participating 1st lien holders were <strong>not invited</strong> to participate. Their existing 1st lien loans were effectively subordinated — now sitting behind ~$1.075B of new super-priority debt. Same loan, same credit agreement, but now structurally junior. This is the "creditor-on-creditor violence."</p>
        <p><strong>Legal basis:</strong> SSB and PTL Lenders argued this was a permissible "open market purchase" under Section 9.05(g), exempt from the pro-rata sharing requirement (Section 2.18 / Sacred Rights in 9.01(b)(A)).</p>
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
        <p><em>In re Serta Simmons Bedding, LLC</em>, 125 F.4th 555 (5th Cir. 2024). <strong>First federal circuit court to rule on uptier transactions.</strong></p>
        <p><strong>Three key holdings:</strong></p>
        <p><strong>1. Uptier violated the credit agreement.</strong> The 2020 transaction was NOT a permissible "open market purchase" under Section 9.05(g). The court held "open market" means the secondary market for syndicated loans — not private negotiations with selected lenders. Accepting SSB's broad definition would render the Dutch Auction alternative "superfluous." Cited LSTA guidance as supporting a narrow definition.</p>
        <p><strong>2. Equitable mootness did not bar review.</strong> Despite the plan being fully consummated, the court found a "surgical remedy" was available — excising the indemnity provision without unwinding the entire plan. "We differentiate between inability to alter the outcome (real mootness) and unwillingness to alter the outcome (equitable mootness)."</p>
        <p><strong>3. Indemnification provision excised.</strong> Violated §502(e)(1)(B) — the prepetition indemnity would have been disallowed as a contingent reimbursement claim. Repackaging it as a plan "settlement" was "an impermissible end-run." Also violated §1123(a)(4) — the indemnity's value "varied dramatically" between PTL Lenders (worth tens of millions) and non-participants (worth nothing), violating equal treatment.</p>
        <p style={{ color: T_.red }}><strong>Impact:</strong> Remanded excluded lenders' counterclaims for adjudication — potentially "hundreds of millions" in damages. PTL Lenders lost their indemnity shield. The ruling is actively reshaping how every new credit agreement is drafted.</p>
        <p style={{ color: T_.amber }}><strong>Nuance:</strong> The court acknowledged "terms of the credit agreement in any particular case might warrant a different conclusion." Same day, a NY appellate court upheld an uptier under a different credit agreement (Mitel Networks) that lacked the "open market" qualifier.</p>
      </DetailPanel>
    ),
    litigation: (
      <DetailPanel title="Litigation History" onClose={() => setDetail(null)}>
        <p><strong>Jun 2020:</strong> Excluded lenders (Apollo, Angelo Gordon, et al.) sued in NY state court seeking injunction. Denied.</p>
        <p><strong>2020:</strong> LCM Asset Management sued separately in SDNY.</p>
        <p><strong>Jan 2023:</strong> SSB filed adversary proceeding against excluded lenders at bankruptcy filing, seeking declaratory judgment that 2020 uptier was valid.</p>
        <p><strong>Mar 2023:</strong> Bankruptcy court (Judge David Jones) granted summary judgment for SSB/PTL Lenders — found "open market purchase" was unambiguous, transaction permitted.</p>
        <p><strong>Jun 2023:</strong> Plan confirmed with indemnification for PTL Lenders. 7-day stay (shortened from 14). Plan went effective Jun 29, 2023.</p>
        <p><strong>Sep 2023:</strong> Fifth Circuit certified direct appeal.</p>
        <p><strong>Dec 31, 2024:</strong> Fifth Circuit reverses — uptier violated credit agreement, indemnity excised, excluded lender counterclaims remanded.</p>
        <p><strong>Feb 2025:</strong> Rehearing denied. Opinion finalized.</p>
        <p style={{ color: T_.red }}>Excluded lenders can now pursue damages — potentially hundreds of millions. This litigation continues post-emergence.</p>
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
            { l: "Original Debt", v: "$2.625B", c: T_.red },
            { l: "Debt at Filing", v: "~$1.9B", c: T_.red },
            { l: "Filed", v: "Jan 23, 2023", c: T_.red },
            { l: "Emerged", v: "Jun 29, 2023", c: T_.green },
            { l: "Debt Post-Ch.11", v: "$315M", c: T_.green },
            { l: "5th Cir. Ruling", v: "Dec 31, 2024", c: T_.accent },
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
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 16 }}>Post-2020 uptier, at filing. Click any box for details. Case 23-90020, S.D. Tex., Judge David Jones.</div>
      </div>

      <div style={{ padding: "24px 16px", background: T_.bgPanel, borderRadius: 12, border: `1px solid ${T_.border}`, marginBottom: 4 }}>

        {/* SPONSORS */}
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

        {/* HOLDCO */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            label="Dawn Intermediate LLC → Serta Simmons Bedding, LLC"
            sub="Borrower under 2016 Credit Agreement · Doraville, GA"
            color={T_.blue}
            badges={[{ text: "BORROWER", color: T_.blue }, { text: "DEBTOR", color: T_.red }]}
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
            badges={[{ text: "SERTA BRAND", color: T_.emerald }]}
          />
          <Box
            label="Simmons Bedding Company, LLC"
            sub="Beautyrest brand · Manufacturing operations"
            color={T_.emerald}
            badges={[{ text: "BEAUTYREST BRAND", color: T_.emerald }]}
          />
        </div>

        <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
          <div style={{ fontSize: 9, color: T_.textGhost, padding: "4px 12px", background: T_.bgInput, borderRadius: 4, border: `1px solid ${T_.border}` }}>
            Serta, Inc. (5 minority licensees, ~17% ownership) did NOT file bankruptcy
          </div>
        </div>
      </div>

      {/* ── Detail buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "preLME", label: "Pre-Uptier Structure", color: T_.textMid, sub: "$2.625B · 2016 Credit Agreement" },
          { k: "plan", label: "Ch.11 Plan Treatment", color: T_.blue, sub: "$1.9B → $315M · Class recoveries" },
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
          { date: "Jun 2020", event: "UPTIER EXECUTED: PTL Lenders provide $200M new money + exchange $875M at discount → new First-Out/Second-Out priority tranches. Excluded lenders (Apollo, Angelo Gordon, et al.) primed. Lawsuits filed in NY state court — injunction denied.", color: T_.red },
          { date: "2020-22", event: "LME buys time but business continues deteriorating. Mattress industry secular headwinds, inflation, DTC competition.", color: T_.amber },
          { date: "Jan 23, 2023", event: "SSB files Chapter 11 (S.D. Tex., Case 23-90020, Judge Jones). Adversary proceeding filed against excluded lenders. RSA with PTL Lenders.", color: T_.red },
          { date: "Mar 2023", event: "Bankruptcy court grants summary judgment: uptier was valid 'open market purchase.' Excluded lender counterclaims dismissed.", color: T_.amber },
          { date: "Jun 6, 2023", event: "Plan confirmed. $1.9B → $315M. FLSO → 100% equity. Excluded lenders → 1-5%. Indemnity for PTL Lenders included.", color: T_.amber },
          { date: "Jun 29, 2023", event: "SSB emerges from Ch.11. PTL Lenders own the reorganized company.", color: T_.green },
          { date: "Sep 2023", event: "5th Circuit certifies direct appeal. Citadel Equity Fund joins as appellant.", color: T_.blue },
          { date: "Dec 31, 2024", event: "5TH CIRCUIT REVERSAL: Uptier violated credit agreement. Not a permissible 'open market purchase.' Indemnity excised. Counterclaims remanded. First federal circuit ruling on uptiers.", color: T_.accent },
          { date: "Feb 2025", event: "Rehearing denied. Ruling finalized. Excluded lenders can pursue damages — potentially hundreds of millions.", color: T_.accent },
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
      <DetailPanel title="Post-Emergence & Current State" onClose={() => setDetail(null)}>
        <p><strong>Emergence:</strong> Sep 10, 2020. First major national retailer to emerge from COVID-era bankruptcy.</p>
        <p><strong>Store Count at Emergence:</strong> 170 J.Crew retail + 170 J.Crew Factory + 142 Madewell. Closed all 6 UK stores.</p>
        <p><strong>Leadership Turmoil Continued:</strong> Jan Singer (CEO, appointed Jan 2020) departed Nov 2020 after &lt;10 months. <strong>Libby Wadle</strong> (Madewell CEO) named CEO of J.Crew Group.</p>
        <p><strong>IP Resolution:</strong> The transferred IP was reunified under the reorganized corporate structure. The IP controversy was resolved through equitizing both TL and IPCo noteholders into the same equity pool.</p>
        <p><strong>Madewell IPO:</strong> Never revisited. Remains a wholly-owned subsidiary.</p>
        <p><strong>2024 Refinancing:</strong> J.Crew returned to the leveraged loan market with a <strong>$450M refinancing</strong> led by Goldman Sachs. Priced at SOFR + 625 bps at 98 cents (yielding &gt;11%). Notably, the new loan docs included a <strong>"J.Crew blocker"</strong> provision — the company that created the loophole now has its own protective covenant.</p>
        <p><strong>Revenue (LTM Q2 2024):</strong> $2.72B. Company remains privately held.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Premium apparel retailer (J.Crew, Madewell, Factory). <span style={{ color: T_.purple }}>TPG + Leonard Green</span> took the company private in 2011 for ~$3B, then extracted <span style={{ color: T_.red }}>$766M in dividends and fees</span> — funding the $484M dividend with <span style={{ color: T_.red }}>$500M PIK Toggle Notes</span>. Facing a PIK maturity wall, J.Crew executed the original <span style={{ color: T_.accent }}>"trap door" IP transfer</span> — moving trademarks to unrestricted subsidiaries to raise new secured debt, stripping collateral from $1.5B+ of term loan lenders. This maneuver spawned the market-standard <span style={{ color: T_.accent }}>"J.Crew Blocker"</span> covenant provision and became the foundational precedent for Envision, Serta, and every modern LME.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "LBO Price", v: "~$3.0B", c: T_.purple },
            { l: "Sponsor Extractions", v: "$766M", c: T_.red },
            { l: "Total Debt", v: "~$1.7B", c: T_.red },
            { l: "Filed", v: "May 4, 2020", c: T_.red },
            { l: "Emerged", v: "Sep 10, 2020", c: T_.green },
            { l: "Debt Cut", v: ">$1.6B", c: T_.green },
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
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 16 }}>Post-2017 IP transfer, at filing. Click any entity or tranche for details. Case 20-32181, E.D. Va., Judge Phillips.</div>
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
              { text: "TERM LOAN", color: T_.blue },
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

          {/* LEFT: Operating entities */}
          <div>
            <VLine h={14} />
            <Box
              label="Operating Subsidiaries"
              sub="J.Crew Operating Corp · J.Crew Inc · J.Crew Int'l"
              color={T_.emerald}
              badges={[
                { text: "GUARANTORS", color: T_.green },
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
                { text: "CROWN JEWEL", color: T_.accent },
              ]}
              onClick={() => toggle("madewell")} selected={detail === "madewell"}
            />
          </div>

          {/* RIGHT: IPCo chain */}
          <div>
            <VLine h={14} />
            <div style={{ border: `2px dashed ${T_.red}40`, borderRadius: 10, padding: 2, background: `${T_.red}04` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T_.red, textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", padding: "4px 0 2px" }}>Unrestricted Subsidiary (Dec 2016)</div>
              <Box
                label="IPCo Entity Chain"
                sub="Brand Holdings → Brand Intermediate → Brand LLC → Domestic Brand LLC"
                color={T_.red}
                badges={[
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
            <div style={{ fontSize: 9, color: T_.textGhost, textAlign: "center", padding: "0 4px" }}>
              J.Crew Cayman (restricted, non-loan party) was the intermediary
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "dividends", label: "Dividend Recap", color: T_.purple, sub: "$766M extracted · $500M PIK funded $484M dividend" },
          { k: "planTreatment", label: "Plan Treatment", color: T_.blue, sub: "TL → 76.5% equity · IPCo → 23.5% · Equity → $0" },
          { k: "postEmergence", label: "Post-Emergence", color: T_.green, sub: "Emerged Sep 2020 · $450M refi 2024 · now has its own blocker" },
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
          { date: "1997", event: "TPG Capital acquires majority stake in J.Crew. Takes company public via IPO in 2006 ($376M raised).", color: T_.purple },
          { date: "Mar 2011", event: "TPG + Leonard Green close take-private LBO at $43.50/share (~$3B). $1.2B Term Loan + $250M ABL + $600M bridge + $1.1B equity.", color: T_.purple },
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
          { date: "Sep 2024", event: "J.Crew returns to loan market: $450M refinancing (Goldman, SOFR+625bps). New docs include a 'J.Crew blocker' — the company that created the loophole now has its own protective covenant.", color: T_.green },
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
        <p style={{ color: T_.amber }}><strong>WHOA Stay:</strong> Unlike Ch.11's automatic stay, WHOA does not provide an automatic stay. The Dutch Court granted an ex parte group-wide stay on Jun 8, 2023, extending it to non-debtor group companies under Section 2:24(b) of the Dutch Civil Code — a significant expansion of WHOA stay powers.</p>
        <p><strong>Ferdinand Hengst</strong> was appointed as court observer to confirm joint creditor interests were protected across all three proceedings (Ch.11 + WHOA + Ch.15).</p>
      </DetailPanel>
    ),
    dip: (
      <DetailPanel title="DIP Financing — $1.25B" onClose={() => setDetail(null)}>
        <p><strong>$1.25 billion</strong> debtor-in-possession term loan facility, backstopped by the ad hoc group of creditors. Approved on interim basis at the first-day hearing on Jun 2, 2023.</p>
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
        <p><strong>1. US Chapter 11:</strong> Prepackaged plan for Diebold Holding Company, LLC and 9 US/Canadian affiliates (S.D. Tex., Houston, Case 4:23-bk-90602, Judge Marvin Isgur). Filed Jun 1, 2023.</p>
        <p><strong>2. Dutch WHOA:</strong> Scheme of arrangement for Diebold Nixdorf Dutch Holding B.V. and 12 European affiliates (District Court of Amsterdam). Sanctioned Aug 2, 2023.</p>
        <p><strong>3. US Chapter 15:</strong> Recognition of the Dutch WHOA as a "foreign main proceeding," granting US enforcement of Dutch restructuring orders.</p>
        <p style={{ color: T_.amber }}><strong>Structural Interdependence:</strong> The WHOA and Ch.11 plans were <strong>contractually interdependent</strong> — confirmation of each was a condition for the other's implementation. Creditors voted for or against both plans simultaneously. This prevented creditor arbitrage across jurisdictions.</p>
        <p><strong>Guarantee Restructuring:</strong> Under Section 372 DBA, the WHOA Plan restructured group guarantees provided by European affiliates. Dutch Tax Authorities were unaffected.</p>
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
        <p><strong>Emergence:</strong> Aug 11, 2023. New shares relisted on NYSE under "DBD" on Aug 14, 2023. Old Frankfurt Stock Exchange listing delisted. ~35.17M new shares outstanding.</p>
        <p><strong>Debt Reduction:</strong> ~$2.7B pre-filing → ~$1.25B exit term loan. Over <strong>$2.1B of funded debt eliminated</strong>. Fresh start accounting adopted.</p>
        <p><strong>2024 Refinancing:</strong> Completed $950M senior secured notes offering and repurchased all exit term loans — reducing debt by an additional $100M and lowering interest costs.</p>
        <p><strong>Financial Recovery:</strong></p>
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
          <li>2023 Rev: $3.76B · EBITDA: $87.8M (includes restructuring gains)</li>
          <li>2024 Rev: $3.75B · EBITDA: $184M · Operating income: $182M</li>
          <li>2025 Rev: $3.81B · EBITDA: $248.4M · Net income: $94.6M</li>
        </ul>
        <p><strong>Market Cap:</strong> ~$2.66B (as of Mar 2026), stock ~$75.57/share. S&P and Moody's credit upgrades received.</p>
        <p><strong>Leadership:</strong> CEO Octavio Marquez, CFO Jim Barna.</p>
        <p style={{ color: T_.green }}>The restructuring validated the thesis that the business had value if freed from its debt burden. EBITDA tripled from $87.8M to $248.4M in two years post-emergence. Former first lien creditors who received equity at ~38% recovery have seen significant appreciation.</p>
      </DetailPanel>
    ),
  };

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ background: T_.bgPanel, borderRadius: 10, border: `1px solid ${T_.border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.8, marginBottom: 12 }}>
          Global banking tech & retail POS company (ATMs, self-checkout, software). Distress from <span style={{ color: T_.red }}>overleveraged 2016 acquisition of Wincor Nixdorf (~$1.8B)</span>, <span style={{ color: T_.red }}>failed integration</span>, <span style={{ color: T_.red }}>revenue decline ($4.6B→$3.5B)</span>, and <span style={{ color: T_.red }}>COVID/supply-chain margin compression</span>. After a Dec 2022 <span style={{ color: T_.amber }}>liability management exercise</span> (superpriority priming + covenant stripping), filed a <span style={{ color: T_.accent }}>prepackaged Ch.11</span> with a <span style={{ color: T_.accent }}>first-ever parallel Dutch WHOA proceeding</span>. Emerged in 71 days — a landmark cross-border restructuring.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { l: "Acquisition", v: "~$1.8B", c: T_.purple },
            { l: "Total Debt", v: "~$2.7B", c: T_.red },
            { l: "Filed", v: "Jun 1, 2023", c: T_.red },
            { l: "Emerged", v: "Aug 11, 2023", c: T_.green },
            { l: "Debt Cut", v: ">$2.1B", c: T_.green },
            { l: "Days in Ch.11", v: "71", c: T_.accent },
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
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T_.text, marginBottom: 2 }}>Corporate & Capital Structure</div>
        <div style={{ fontSize: 10, color: T_.textGhost, marginBottom: 16 }}>Post-Dec 2022 LME, at filing. Click any entity or debt tranche for details. Case 4:23-bk-90602, S.D. Tex., Judge Isgur.</div>
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

        {/* DUAL JURISDICTION SPLIT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, marginBottom: 4 }}>
        {[
          { k: "wincorMerger", label: "Wincor Nixdorf Acquisition", color: T_.purple, sub: "2016 · $1.8B · integration failure" },
          { k: "planTreatment", label: "Plan Treatment", color: T_.blue, sub: "Class recoveries · cramdown · 71-day prepack" },
          { k: "postEmergence", label: "Post-Emergence", color: T_.green, sub: "Relisting · EBITDA tripled · $2.66B mkt cap" },
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
          { date: "Jun 1, 2023", event: "Ch.11 filed (S.D. Tex., Judge Isgur). 10 US/Canadian debtors. WHOA commenced in Amsterdam. Ch.15 filed for recognition.", color: T_.red },
          { date: "Jun 2, 2023", event: "First-day hearing. $1.25B DIP approved (interim). Repays superpriority TL + ABL in full.", color: T_.blue },
          { date: "Jun 8, 2023", event: "Dutch Court grants ex parte group-wide WHOA stay — extends to non-debtor European affiliates.", color: T_.amber },
          { date: "Jul 13, 2023", event: "Ch.11 Plan confirmed. Class 7 (unsecured stub) crammed down. 1L → 98% equity. 2L → 2% equity (gift).", color: T_.green },
          { date: "Aug 2, 2023", event: "Dutch Court sanctions WHOA Plan. 2/3 majority in Classes 1-3. Class 4 rejected but bound.", color: T_.green },
          { date: "Aug 11, 2023", event: "EMERGENCE. 71 days in Ch.11. >$2.1B debt eliminated. DIP converts to $1.25B exit TL. New shares issued.", color: T_.green },
          { date: "Aug 14, 2023", event: "New DBD shares begin trading on NYSE. Former first lien holders = new owners.", color: T_.green },
          { date: "2024", event: "$950M refinancing replaces exit TL. Debt reduced by additional $100M. S&P and Moody's upgrades.", color: T_.green },
          { date: "Mar 2026", event: "Market cap ~$2.66B. EBITDA $248M (vs. negative at filing). Stock ~$75.57. Restructuring thesis validated.", color: T_.green },
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
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function Restructuring({ initialTab }) {
  const [activeCase, setActiveCase] = useState(initialTab || "windstream");

  useEffect(() => {
    if (initialTab) setActiveCase(initialTab);
  }, [initialTab]);

  return (
    <div style={{ padding: "36px 44px", fontFamily: FONT, maxWidth: "100%", margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: T_.text, marginBottom: 4 }}>Restructuring</h1>

      <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
        {CASES.map(c => {
          const active = activeCase === c.key;
          return (
            <div key={c.key} onClick={() => setActiveCase(c.key)} style={{
              padding: "10px 18px", borderRadius: 8, cursor: "pointer", transition: "all .15s",
              background: active ? `${c.color}20` : T_.bgPanel,
              border: `1px solid ${active ? c.color : T_.border}`,
              color: active ? c.color : T_.textMid, fontSize: 13, fontWeight: active ? 600 : 400,
            }}>
              <div>{c.label}</div>
              <div style={{ fontSize: 11, color: T_.textGhost, marginTop: 2 }}>{c.sector} · {c.year}</div>
            </div>
          );
        })}
        <div style={{
          padding: "10px 18px", borderRadius: 8, border: `1px dashed ${T_.border}`,
          color: T_.textGhost, fontSize: 13, display: "flex", alignItems: "center", cursor: "default", opacity: 0.4,
        }}>
          + More coming
        </div>
      </div>

      {activeCase === "windstream" && <WindstreamCase />}
      {activeCase === "envision" && <EnvisionCase />}
      {activeCase === "serta" && <SertaCase />}
      {activeCase === "diebold" && <DieboldNixdorfCase />}
      {activeCase === "jcrew" && <JCrewCase />}
    </div>
  );
}
