import { useState } from "react";
import { T_, FONT } from "./lib/theme";

const APIS = [
  {
    name: "Supabase",
    category: "Database",
    usage: "Primary database for both Research Portal and Portfolio Dashboard. Stores companies, research articles, notes, principles, prompts, sources, and cached prices.",
    tables: "companies, company_fields, company_notes, kb_articles, principles, prompts, sources, news_cache, sector_notes, prices",
    endpoint: "https://azhbbywzspflrxpqrdqw.supabase.co",
    auth: "Anon key (VITE_SUPABASE_ANON_KEY) + Row Level Security",
    projects: ["Research Portal", "Portfolio Dashboard"],
    status: "active",
  },
  {
    name: "Yahoo Finance",
    category: "Market Data",
    usage: "Live stock prices, P/E ratios (trailing + forward), EPS, market cap, and historical price data for portfolio holdings, ETF constituents (SMH, SOXX, DRAM), and research tickers.",
    tables: "N/A — serverless API via Vercel",
    endpoint: "/api/quote (live quotes), /api/history (historical prices), /api/refresh-prices (cron)",
    auth: "No auth required. yahoo-finance2 npm package. 80 ticker cap per request.",
    projects: ["Portfolio Dashboard"],
    status: "active",
  },
  {
    name: "Gmail API",
    category: "Research Ingest",
    usage: "Pulls emails tagged with [Research] from ylresearchwiki@gmail.com. Extracts article content, URLs, PDF attachments. Ingests to Supabase kb_articles table.",
    tables: "kb_articles",
    endpoint: "Gmail REST API v1 via google-api-python-client",
    auth: "OAuth 2.0 (credentials.json + token.json). Scope: gmail.readonly",
    projects: ["Research Portal"],
    status: "active",
  },
  {
    name: "Anthropic Claude API",
    category: "AI / Research",
    usage: "Powers research agents (Q&A, Thesis Tracker, Data Verification, Ideas). Used for web search via tool_use. Also used in portfolio dashboard for text-based tab refreshes (AI Labs, Capex, GPU/ASIC news).",
    tables: "N/A — direct API calls from frontend",
    endpoint: "https://api.anthropic.com/v1/messages",
    auth: "API key (VITE_ANTHROPIC_API_KEY). Model: claude-sonnet-4-20250514. Tools: web_search_20250305",
    projects: ["Research Portal", "Portfolio Dashboard"],
    status: "inactive — no API key configured",
  },
  {
    name: "Vercel",
    category: "Hosting / Serverless",
    usage: "Hosts both apps. Serverless functions for Yahoo Finance API endpoints. Cron job for daily price refresh (weekdays 11:30 UTC). Auto-deploys from GitHub on push.",
    tables: "N/A",
    endpoint: "research-portal-one.vercel.app (portal), dashboard-beta-seven-79.vercel.app (dashboard)",
    auth: "Vercel CLI token. GitHub auto-deploy connected.",
    projects: ["Research Portal", "Portfolio Dashboard"],
    status: "active",
  },
  {
    name: "GitHub",
    category: "Source Control",
    usage: "Source code repos. Auto-deploy to Vercel on push. Two repos: ylin122/research-portal, ylin122/portfolio-dashboard.",
    tables: "N/A",
    endpoint: "github.com/ylin122",
    auth: "Git credentials",
    projects: ["Research Portal", "Portfolio Dashboard"],
    status: "active",
  },
];

export default function ApiDirectory() {
  const [expanded, setExpanded] = useState(null);

  const statusColor = (s) => s === "active" ? T_.green : s.includes("inactive") ? T_.red : T_.accent;

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px" }}>APIs & Integrations</div>
        <div style={{ fontSize: 13, color: T_.textDim, marginTop: 4 }}>All APIs powering the Research Portal and Portfolio Dashboard.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {APIS.map((api, i) => (
          <div
            key={i}
            style={{
              background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10,
              overflow: "hidden", cursor: "pointer",
            }}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(api.status), flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T_.text }}>{api.name}</div>
                  <div style={{ fontSize: 11, color: T_.textDim, marginTop: 2 }}>{api.category}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {api.projects.map((p, j) => (
                  <span key={j} style={{ fontSize: 10, color: T_.blue, background: `${T_.blue}15`, padding: "3px 8px", borderRadius: 4 }}>{p}</span>
                ))}
              </div>
            </div>

            {expanded === i && (
              <div style={{ padding: "0 20px 16px", borderTop: `1px solid ${T_.borderLight}`, paddingTop: 14 }}>
                <div style={{ fontSize: 13, color: T_.textMid, lineHeight: 1.6, marginBottom: 12 }}>{api.usage}</div>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "6px 12px", fontSize: 12 }}>
                  <span style={{ color: T_.textDim }}>Endpoint</span>
                  <span style={{ color: T_.text, fontFamily: "monospace", fontSize: 11, wordBreak: "break-all" }}>{api.endpoint}</span>
                  <span style={{ color: T_.textDim }}>Auth</span>
                  <span style={{ color: T_.textMid }}>{api.auth}</span>
                  {api.tables !== "N/A" && <>
                    <span style={{ color: T_.textDim }}>Tables</span>
                    <span style={{ color: T_.textMid, fontFamily: "monospace", fontSize: 11 }}>{api.tables}</span>
                  </>}
                  <span style={{ color: T_.textDim }}>Status</span>
                  <span style={{ color: statusColor(api.status), fontWeight: 600 }}>{api.status}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
