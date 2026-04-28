import { useState, useEffect } from "react";
import { T_, FONT } from "./lib/theme";
import { supabase } from "./lib/supabase";

const MCP_SERVERS = [
  {
    name: "Gmail", provider: "claude.ai", status: "connected", color: "#EA4335",
    desc: "Search threads, read emails, create drafts, manage labels. Powers the research-ingest pipeline.",
    tools: ["search_threads", "get_thread", "create_draft", "list_drafts", "list_labels", "create_label", "label_message", "label_thread", "unlabel_message", "unlabel_thread"],
  },
  {
    name: "memory", provider: "npm", status: "connected", color: "#A78BFA",
    desc: "Persistent knowledge graph for entities, relations, and observations across conversations.",
    tools: ["create_entities", "create_relations", "add_observations", "delete_entities", "delete_relations", "delete_observations", "read_graph", "search_nodes", "open_nodes"],
  },
  {
    name: "sequential-thinking", provider: "npm", status: "connected", color: "#F59E0B",
    desc: "Dynamic, reflective reasoning tool for complex problem-solving with branching and revision.",
    tools: ["sequentialthinking"],
  },
  {
    name: "git", provider: "pip", status: "connected", color: "#F05032",
    desc: "Git operations — status, diff, log, branch, commit, checkout, reset, show.",
    tools: ["git_status", "git_diff", "git_diff_staged", "git_diff_unstaged", "git_log", "git_show", "git_branch", "git_checkout", "git_create_branch", "git_commit", "git_add", "git_reset"],
  },
];

const TOOLS = [
  {
    name: "Financial Modeling Prep", version: "stable", color: "#1A73E8",
    desc: "Forward financials API — analyst estimates, income statements, balance sheets, DCF, ratios for public companies.",
    install: "REST API (Vercel env: FMP_API_KEY)",
    usage: "https://financialmodelingprep.com/stable/",
    capabilities: ["Forward EPS & revenue estimates (consensus)", "Income statement, balance sheet, cash flow (standardized)", "Analyst price targets & recommendations", "Key ratios (P/E, PEG, ROE, margins)", "DCF & intrinsic value models", "Company profiles & sector data", "Historical & TTM financials"],
  },
  {
    name: "edgartools", version: "5.30.0", color: "#00A36C",
    desc: "SEC EDGAR filings, XBRL financials, 10-K/10-Q/8-K reports. Income statements, balance sheets, cash flows.",
    install: "pip install edgartools",
    usage: "from edgar import Company, set_identity",
    capabilities: ["Company filings (10-K, 10-Q, 8-K, S-1, etc.)", "XBRL financial statements", "Income statement, balance sheet, cash flow", "Insider transactions & institutional holdings", "Full-text search across EDGAR"],
  },
];

const CLI_TOOLS = [
  {
    name: "Reorg / Octus", path: "~/reorg-tools/",
    desc: "Articles, company coverage, and intelligence via authenticated session.",
    cmds: [
      { cmd: "lookup <name>", desc: "Search company ID" },
      { cmd: "articles <company_id>", desc: "Recent articles for a company" },
      { cmd: "article <id>", desc: "Full article text" },
      { cmd: "popular [hours]", desc: "Most popular articles (default 24h)" },
      { cmd: "api <path>", desc: "Raw Octus API call" },
    ],
  },
  {
    name: "Third Bridge Forum", path: "~/thirdbridge-tools/",
    desc: "Expert interview transcripts from Third Bridge Forum.",
    cmds: [
      { cmd: "search <keyword>", desc: "Search interviews" },
      { cmd: "recent [--count N]", desc: "Latest transcripts (default 20)" },
      { cmd: "interview <uuid>", desc: "Full transcript with speaker attribution" },
      { cmd: "meta <uuid>", desc: "Interview metadata" },
      { cmd: "api GET|POST <path>", desc: "Raw Forum API call" },
    ],
  },
  {
    name: "CreditSights / LevFin / Covenant Review", path: "~/creditsights-tools/",
    desc: "Research articles, morning comments, top-read via Fitch Group SSO. Note: CR loan reports may show locked (entitlement, not auth).",
    cmds: [
      { cmd: "lookup <name>", desc: "Search company tag ID (CS/CR/LFI)" },
      { cmd: "articles <tag_id>", desc: "Articles for a company" },
      { cmd: "article <id>", desc: "Full article text" },
      { cmd: "feed --list my_cs", desc: "Your personalized feed" },
      { cmd: "feed --list top_read", desc: "Most-read (24h)" },
      { cmd: "feed --list morning_comment", desc: "US morning comment" },
      { cmd: "api GET|POST <path>", desc: "Raw v2 API call" },
    ],
  },
  {
    name: "9fin", path: "~/9fin-tools/",
    desc: "News, articles, morning coffee, company search, and calendar. Note: click around in product before signaling done — sessions can be flaky.",
    cmds: [
      { cmd: "search <keyword>", desc: "Search companies, instruments, docs" },
      { cmd: "company <keyword>", desc: "Company lookup" },
      { cmd: "news [--company <id>]", desc: "Latest news, optionally by company" },
      { cmd: "article <uuid>", desc: "Full article text" },
      { cmd: "morningcoffee", desc: "Today's Morning Coffee" },
      { cmd: "calendar [--days N]", desc: "Upcoming events (default 7d)" },
      { cmd: "api GET|POST <path>", desc: "Raw 9fin API call" },
    ],
  },
];

const AGENTS = [
  {
    name: "code-review", color: "#34d673",
    desc: "Code review — audits for bugs, duplication, dead code, inefficiency, structural issues. Reports numbered issues by severity, then fixes on command.",
    usage: "@code-review src/Primer.jsx",
    tools: "Read, Edit, Write, Bash, Grep, Glob", mode: "Audit (default) or Fix",
  },
  {
    name: "agent-review", color: "#A78BFA",
    desc: "Reviews Claude Code agent prompt files for routing fit, scope clarity, tool-fit, output contract, internal consistency, and prompt-injection surface. Reports numbered issues by severity, then rewrites on command. Use for new agents before install or periodic audits of ~/.claude/agents/.",
    usage: "@agent-review ~/.claude/agents/code-review.md",
    tools: "Read, Edit, Grep, Glob", mode: "Audit (default) or Rewrite",
  },
  {
    name: "numbers-audit", color: "#FBBF24",
    desc: "Single numbers/formulas auditor + refresher across PA + research portal. Modes: `formulas` (Sharpe/IR/vol/beta/PE/PEG vs canon), `data` (hardcoded values vs live sources), and refresh (full ETF_SENSITIVITY workflow with Yahoo + cross-checks). Numbers only.",
    usage: "@numbers-audit refresh ETF_SENSITIVITY",
    tools: "Read, Edit, Write, Bash, Grep, Glob, WebSearch, WebFetch", mode: "Audit (default) or Refresh/Fix",
  },
  {
    name: "deploy", color: "#06B6D4",
    desc: "Build, commit, push to GitHub, and verify Vercel deployment. Checks for secrets, runs vite build, won't push broken code.",
    usage: "@deploy ship the latest changes",
    tools: "Read, Bash, Grep, Glob", mode: "Read + Write (git operations)",
  },
  {
    name: "audit-mcp", color: "#F97316",
    desc: "Security audit on MCP servers, Claude Code skills, or plugins before installation. Checks for supply chain risk, prompt injection, and data exfiltration.",
    usage: "@audit-mcp review the new slack MCP",
    tools: "Read, Grep, Glob, Bash, Agent", mode: "Read-only",
  },
  {
    name: "security-reviewer", color: "#EF4444",
    desc: "Audits MCP servers, skills, subagents, and plugins for supply chain, prompt injection, and data exfiltration risk. Periodic or pre-install.",
    usage: "@security-reviewer audit all installed MCPs",
    tools: "Read, Grep, Glob, Bash", mode: "Read-only",
  },
  {
    name: "ratings-research", color: "#6366F1",
    desc: "Ratings-agency research sweep — queries Moody's and S&P Capital IQ in parallel for a company or topic.",
    usage: "@ratings-research pull Moody's and S&P on Carvana",
    tools: "Read, Bash, Grep, Glob", mode: "Read-only",
  },
  {
    name: "pa-refresh", color: "#10B981",
    desc: "Full PA dashboard data refresh — pulls live Yahoo Finance for all tickers, updates hardcoded blocks (prices, P/E, PEG, beta, returns, ETF sensitivity, news), triggers API refreshes.",
    usage: "@pa-refresh update all data",
    tools: "Bash, Read, Edit, Write, Grep, Glob, WebFetch", mode: "Read + Write",
  },
  {
    name: "refresh", color: "#14B8A6",
    desc: "Updates any tab with the latest info from the web. Searches for current news, data, and developments. Fact-checks existing content.",
    usage: "@refresh update the AI Research tab",
    tools: "Read, Bash, Grep, Glob, Edit, Write, WebSearch, WebFetch", mode: "Read + Write",
  },
  {
    name: "third-party-research", color: "#38BDF8", expandable: true,
    desc: "Queries Reorg, 9fin, CreditSights, and Third Bridge in parallel for a company or topic. Fetches full text, synthesizes findings.",
    usage: "@third-party-research pull everything on Perforce",
    tools: "Read, Bash, Grep, Glob", mode: "Read-only. Runs local Playwright-authenticated CLI tools.",
  },
  {
    name: "format", color: "#c084fc",
    desc: "Audits format/style/visual-context consistency across research portal and PA dashboard. Three layers — prose formatting, CSS/visual, and cross-page visual context. Read-only; reports issues by severity with file:line refs.",
    usage: "@format check credit research",
    tools: "Read, Bash, Grep, Glob", mode: "Read-only",
  },
  {
    name: "fact-check-reconciler", color: "#818CF8",
    desc: "Comprehensive single-agent fact-checker. Loads the Sources tab from Supabase first and uses those curated entries as Tier-0 verification. Extracts every checkable claim, runs internal verify + dispute passes, cross-checks internal consistency / math / citations / recency, and issues per-claim verdicts (VERIFIED / LIKELY CORRECT / CONFLICT / LIKELY WRONG / MISATTRIBUTED / STALE / NEEDS REVIEW). Reports which curated sources were consulted. Prioritizes thoroughness over speed. Read-only.",
    usage: "@fact-check-reconciler src/Restructuring.jsx",
    tools: "Read, Bash, Grep, Glob, WebSearch, WebFetch", mode: "Read-only",
  },
  {
    name: "sync-pull", color: "#A78BFA",
    desc: "Pull agent definitions from Supabase to local ~/.claude/agents/ files. Run after editing agents in the research portal UI.",
    usage: "@sync-pull",
    tools: "Bash", mode: "Read + Write (local files)",
  },
  {
    name: "sync-push", color: "#A78BFA",
    desc: "Push local ~/.claude/agents/ files to Supabase. Run after editing agent .md files locally.",
    usage: "@sync-push",
    tools: "Bash", mode: "Read + Write (Supabase)",
  },
];

const SKILLS = [
  {
    name: "research-ingest", color: "#E879F9",
    desc: "Full research pipeline — Gmail ingest, analyze new articles, sync Obsidian, push to GitHub, verify Vercel deploy.",
    usage: "/research-ingest",
    tools: "Read, Bash, Grep, Glob, Edit, Write, WebSearch, WebFetch, Gmail", mode: "Read + Write. End-to-end pipeline.",
  },
];

const ARROW = "▶";

function reconstructFile(row) {
  return `---\nname: ${row.name || ""}\ndescription: ${row.description || ""}\ntools: ${row.tools || ""}\n---\n\n${row.body || ""}\n`;
}

function PromptBody({ row, color, copied, onCopy }) {
  if (!row) return <div style={{ marginTop: 8, fontSize: 11, color: T_.textGhost, fontFamily: "monospace" }}>Loading prompt from Supabase…</div>;
  return (
    <div style={{ marginTop: 8, position: "relative" }}>
      <button
        onClick={(e) => { e.stopPropagation(); onCopy(); }}
        style={{
          position: "absolute", top: 6, right: 6, zIndex: 1,
          background: copied ? `${color}25` : "#1E293B", border: `1px solid ${color}40`,
          color, fontSize: 10, fontFamily: "monospace", padding: "2px 8px",
          borderRadius: 4, cursor: "pointer", letterSpacing: 0.3,
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <pre style={{
        margin: 0, padding: 12, background: "#0B1120", border: `1px solid ${color}30`,
        borderRadius: 6, fontSize: 11, lineHeight: 1.55, color: "#CBD5E1",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 480, overflow: "auto",
      }}>{reconstructFile(row)}</pre>
    </div>
  );
}

export default function AgentsTools() {
  const [expanded, setExpanded] = useState(null);
  const [rows, setRows] = useState({});
  const [copied, setCopied] = useState(null);

  const copyPrompt = (id) => {
    const row = rows[id];
    if (!row) return;
    navigator.clipboard.writeText(reconstructFile(row));
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("agent_definitions")
        .select("id, name, description, tools, body");
      if (cancelled) return;
      if (error) { console.error("Failed to load agent prompts:", error.message); return; }
      const map = {};
      for (const r of data || []) map[r.id] = r;
      setRows(map);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ padding: "36px 44px", fontFamily: FONT }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: 4 }}>Agents / Tools</div>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 28 }}>
        Claude Code agents, skills, MCP servers, and installed tools. Agents: <span style={{ color: T_.accent, fontFamily: "monospace" }}>@agent-name</span> &nbsp; Skills: <span style={{ color: "#E879F9", fontFamily: "monospace" }}>/skill-name</span>
      </p>

      <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3, marginBottom: 14 }}>
          Agents
          <span style={{ fontSize: 11, color: T_.textGhost, fontWeight: 400, marginLeft: 12 }}>~/.claude/agents/ — click any row to view & copy its prompt</span>
        </div>

        {AGENTS.map(agent => {
          const isOpen = expanded === agent.name;
          return (
            <div key={agent.name} style={{ marginBottom: 6 }}>
              <div
                style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : agent.name)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: agent.color, fontFamily: "monospace" }}>@{agent.name}</span>
                  <span style={{ fontSize: 11, color: T_.textDim, flex: 1 }}>{agent.desc}</span>
                  <span style={{ fontSize: 10, color: T_.textGhost, transition: "transform .15s", transform: isOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>{ARROW}</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
                  <span><span style={{ fontWeight: 600, color: T_.textDim }}>Usage:</span> <span style={{ fontFamily: "monospace", color: agent.color, background: `${agent.color}10`, padding: "1px 5px", borderRadius: 3 }}>{agent.usage}</span></span>
                  <span><span style={{ fontWeight: 600, color: T_.textDim }}>Tools:</span> {agent.tools}</span>
                  <span><span style={{ fontWeight: 600, color: T_.textDim }}>Mode:</span> {agent.mode}</span>
                </div>
                {isOpen && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <PromptBody row={rows[agent.name]} color={agent.color} copied={copied === agent.name} onCopy={() => copyPrompt(agent.name)} />
                  </div>
                )}
              </div>

              {/* Expanded CLI tools for third-party-research */}
              {agent.expandable && isOpen && (
                <div style={{ marginTop: 4, marginLeft: 16, borderLeft: `2px solid ${agent.color}30`, paddingLeft: 14 }}>
                  {CLI_TOOLS.map(tool => (
                    <div key={tool.name} style={{ background: T_.bgInput, borderRadius: 6, border: `1px solid ${T_.borderLight}`, padding: "10px 14px", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{tool.name}</span>
                        <span style={{ fontSize: 10, color: T_.textGhost, fontFamily: "monospace" }}>{tool.path}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6 }}>{tool.desc}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 14px" }}>
                        {tool.cmds.map(c => (
                          <span key={c.cmd} style={{ fontSize: 11, color: "#94A3B8" }}>
                            <code style={{ color: "#E2E8F0", fontFamily: "monospace", fontSize: 11 }}>{c.cmd}</code>
                            <span style={{ color: "#64748B" }}> — {c.desc}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: T_.textGhost, lineHeight: 1.5, marginTop: 2, marginBottom: 4 }}>
                    Sessions expire periodically. Re-login: tell Claude "re-login to [tool name]" and complete the login in the browser window.
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Skills (slash commands) ── */}
        <div style={{ fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3, marginBottom: 10, marginTop: 16 }}>
          Skills
          <span style={{ fontSize: 11, color: T_.textGhost, fontWeight: 400, marginLeft: 12 }}>~/.claude/skills/ — invoke with /name</span>
        </div>

        {SKILLS.map(skill => {
          const skillId = `skill-${skill.name}`;
          const isOpen = expanded === skillId;
          return (
            <div
              key={skill.name}
              style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: "10px 14px", marginBottom: 6, cursor: "pointer" }}
              onClick={() => setExpanded(isOpen ? null : skillId)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: skill.color, fontFamily: "monospace" }}>{skill.usage}</span>
                <span style={{ fontSize: 11, color: T_.textDim, flex: 1 }}>{skill.desc}</span>
                <span style={{ fontSize: 10, color: T_.textGhost, transition: "transform .15s", transform: isOpen ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>{ARROW}</span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Tools:</span> {skill.tools}</span>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Mode:</span> {skill.mode}</span>
              </div>
              {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                  <PromptBody row={rows[skillId]} color={skill.color} copied={copied === skillId} onCopy={() => copyPrompt(skillId)} />
                </div>
              )}
            </div>
          );
        })}

        {/* ── MCP Servers ── */}
        <div style={{ fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3, marginBottom: 10, marginTop: 16 }}>
          MCP Servers
          <span style={{ fontSize: 11, color: T_.textGhost, fontWeight: 400, marginLeft: 12 }}>Model Context Protocol — external tool integrations</span>
        </div>

        {MCP_SERVERS.map(mcp => (
          <div key={mcp.name} style={{ marginBottom: 6 }}>
            <div
              style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: "10px 14px", cursor: mcp.tools.length ? "pointer" : "default" }}
              onClick={mcp.tools.length ? () => setExpanded(expanded === "mcp-" + mcp.name ? null : "mcp-" + mcp.name) : undefined}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: mcp.color, fontFamily: "monospace" }}>{mcp.name}</span>
                <span style={{
                  fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 3, letterSpacing: 0.5,
                  background: mcp.status === "connected" ? "#22c55e18" : "#f59e0b18",
                  color: mcp.status === "connected" ? "#22c55e" : "#f59e0b",
                  border: `1px solid ${mcp.status === "connected" ? "#22c55e30" : "#f59e0b30"}`,
                }}>{mcp.status === "connected" ? "CONNECTED" : "NEEDS AUTH"}</span>
                <span style={{ fontSize: 11, color: T_.textDim, flex: 1 }}>{mcp.desc}</span>
                {mcp.tools.length > 0 && (
                  <span style={{ fontSize: 10, color: T_.textGhost, transition: "transform .15s", transform: expanded === "mcp-" + mcp.name ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>{ARROW}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Provider:</span> {mcp.provider}</span>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Tools:</span> {mcp.tools.length}</span>
              </div>
            </div>
            {expanded === "mcp-" + mcp.name && mcp.tools.length > 0 && (
              <div style={{ marginTop: 4, marginLeft: 16, borderLeft: `2px solid ${mcp.color}30`, paddingLeft: 14, paddingTop: 4, paddingBottom: 4 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
                  {mcp.tools.map(t => (
                    <span key={t} style={{ fontSize: 11, fontFamily: "monospace", color: mcp.color, background: `${mcp.color}10`, padding: "2px 7px", borderRadius: 4, border: `1px solid ${mcp.color}20` }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── Tools ── */}
        <div style={{ fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3, marginBottom: 10, marginTop: 16 }}>
          Tools
          <span style={{ fontSize: 11, color: T_.textGhost, fontWeight: 400, marginLeft: 12 }}>APIs & packages available across projects</span>
        </div>

        {TOOLS.map(tool => (
          <div key={tool.name} style={{ marginBottom: 6 }}>
            <div
              style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
              onClick={() => setExpanded(expanded === "tool-" + tool.name ? null : "tool-" + tool.name)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: tool.color, fontFamily: "monospace" }}>{tool.name}</span>
                <span style={{ fontSize: 10, color: T_.textGhost, fontFamily: "monospace" }}>v{tool.version}</span>
                <span style={{ fontSize: 11, color: T_.textDim, flex: 1 }}>{tool.desc}</span>
                <span style={{ fontSize: 10, color: T_.textGhost, transition: "transform .15s", transform: expanded === "tool-" + tool.name ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>{ARROW}</span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Install:</span> <span style={{ fontFamily: "monospace" }}>{tool.install}</span></span>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Import:</span> <span style={{ fontFamily: "monospace" }}>{tool.usage}</span></span>
              </div>
            </div>
            {expanded === "tool-" + tool.name && (
              <div style={{ marginTop: 4, marginLeft: 16, borderLeft: `2px solid ${tool.color}30`, paddingLeft: 14, paddingTop: 4, paddingBottom: 4 }}>
                {tool.capabilities.map(cap => (
                  <div key={cap} style={{ fontSize: 11, color: T_.textMid, padding: "2px 0" }}>• {cap}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
