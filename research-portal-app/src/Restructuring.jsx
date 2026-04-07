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
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function Restructuring({ initialTab }) {
  const [activeCase, setActiveCase] = useState(initialTab || "windstream");

  useEffect(() => {
    if (initialTab) setActiveCase(initialTab);
  }, [initialTab]);

  return (
    <div style={{ padding: "36px 44px", fontFamily: FONT, maxWidth: 900, margin: "0 auto" }}>
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
          color: T_.textGhost, fontSize: 13, display: "flex", alignItems: "center", cursor: "default", opacity: 0.5,
        }}>
          + More cases coming
        </div>
      </div>

      {activeCase === "windstream" && <WindstreamCase />}
      {activeCase === "envision" && <EnvisionCase />}
      {activeCase === "serta" && <SertaCase />}
    </div>
  );
}
