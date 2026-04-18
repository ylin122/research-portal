import { useState } from "react";
import { T_, FONT } from "./lib/theme";

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
    name: "codeverifier", color: "#34d673",
    desc: "Code correctness — syntax, build, structure, dead code, broken references",
    usage: "@codeverifier check the Restructuring.jsx changes",
    tools: "Read, Bash, Grep, Glob", mode: "Read-only",
  },
  {
    name: "fact-checker", color: "#70b0fa",
    desc: "Data accuracy — CONFIRM agent. Extracts factual claims and searches for supporting evidence from primary sources.",
    usage: "@fact-checker check the PetSmart case in Restructuring.jsx",
    tools: "Read, Bash, Grep, Glob, WebSearch, WebFetch", mode: "Read-only",
  },
  {
    name: "fact-disputer", color: "#f87171",
    desc: "Data accuracy — DISPUTE agent. Adversarial skeptic that actively tries to disprove every factual claim.",
    usage: "@fact-disputer check the PetSmart case in Restructuring.jsx",
    tools: "Read, Bash, Grep, Glob, WebSearch, WebFetch", mode: "Read-only",
  },
  {
    name: "fact-check-reconciler", color: "#f5a623",
    desc: "Reconciles @fact-checker and @fact-disputer results. Produces final VERIFIED / LIKELY CORRECT / CONFLICT / LIKELY WRONG / UNVERIFIABLE verdicts.",
    usage: "@fact-check-reconciler reconcile the results above",
    tools: "Read, Bash, Grep", mode: "Read-only. Runs after both fact agents return.",
  },
  {
    name: "deploy", color: "#06B6D4",
    desc: "Build, commit, push to GitHub, and verify Vercel deployment. Checks for secrets, runs vite build, won't push broken code.",
    usage: "@deploy ship the latest changes",
    tools: "Read, Bash, Grep, Glob", mode: "Read + Write (git operations)",
  },
  {
    name: "whatif", color: "#F97316",
    desc: "Scenario screener. Input a thesis or what-if and it screens every company in coverage for impact — positive, negative, or mixed.",
    usage: "@whatif massive delays in R100 launch date driven by supply chain shocks",
    tools: "Read, Bash, Grep, Glob, WebSearch, WebFetch", mode: "Read-only",
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
    name: "consistency", color: "#c084fc",
    desc: "Scans research content across tabs for missing fields, stale data, depth mismatches, and format/style inconsistencies.",
    usage: "@consistency check credit research",
    tools: "Read, Bash, Grep, Glob", mode: "Read-only",
  },
  {
    name: "sync-agents-pull", color: "#A78BFA",
    desc: "Pull agent definitions from Supabase to local ~/.claude/agents/ files. Run after editing agents in the research portal UI.",
    usage: "@sync-agents-pull",
    tools: "Bash", mode: "Read + Write (local files)",
  },
  {
    name: "sync-agents-push", color: "#A78BFA",
    desc: "Push local ~/.claude/agents/ files to Supabase. Run after editing agent .md files locally.",
    usage: "@sync-agents-push",
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

export default function DataVerificationAgent() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: "36px 44px", fontFamily: FONT }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: T_.text, marginBottom: 4 }}>Commands / Skills</h1>
      <p style={{ fontSize: 13, color: T_.textDim, marginBottom: 28 }}>
        Claude Code agents and skills. Run agents with <span style={{ color: T_.accent, fontFamily: "monospace" }}>@agent-name</span>, skills with <span style={{ color: "#E879F9", fontFamily: "monospace" }}>/skill-name</span>.
      </p>

      <div style={{ background: T_.bgPanel, border: `1px solid ${T_.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3, marginBottom: 14 }}>
          Agents
          <span style={{ fontSize: 11, color: T_.textGhost, fontWeight: 400, marginLeft: 12 }}>~/.claude/agents/</span>
        </div>

        {AGENTS.map(agent => (
          <div key={agent.name} style={{ marginBottom: 6 }}>
            <div
              style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: "10px 14px", cursor: agent.expandable ? "pointer" : "default" }}
              onClick={agent.expandable ? () => setExpanded(expanded === agent.name ? null : agent.name) : undefined}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: agent.color, fontFamily: "monospace" }}>@{agent.name}</span>
                <span style={{ fontSize: 11, color: T_.textDim, flex: 1 }}>{agent.desc}</span>
                {agent.expandable && (
                  <span style={{ fontSize: 10, color: T_.textGhost, transition: "transform .15s", transform: expanded === agent.name ? "rotate(90deg)" : "rotate(0)", display: "inline-block" }}>{"\u25B6"}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Usage:</span> <span style={{ fontFamily: "monospace", color: agent.color, background: `${agent.color}10`, padding: "1px 5px", borderRadius: 3 }}>{agent.usage}</span></span>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Tools:</span> {agent.tools}</span>
                <span><span style={{ fontWeight: 600, color: T_.textDim }}>Mode:</span> {agent.mode}</span>
              </div>
            </div>

            {/* Expanded CLI tools for third-party-research */}
            {agent.expandable && expanded === agent.name && (
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
        ))}

        {/* ── Skills (slash commands) ── */}
        <div style={{ fontSize: 13, fontWeight: 600, color: T_.textMid, letterSpacing: 0.3, marginBottom: 10, marginTop: 16 }}>
          Skills
          <span style={{ fontSize: 11, color: T_.textGhost, fontWeight: 400, marginLeft: 12 }}>~/.claude/skills/ — invoke with /name</span>
        </div>

        {SKILLS.map(skill => (
          <div key={skill.name} style={{ background: T_.bgInput, border: `1px solid ${T_.borderLight}`, borderRadius: 8, padding: "10px 14px", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: skill.color, fontFamily: "monospace" }}>{skill.usage}</span>
              <span style={{ fontSize: 11, color: T_.textDim, flex: 1 }}>{skill.desc}</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: T_.textGhost }}>
              <span><span style={{ fontWeight: 600, color: T_.textDim }}>Tools:</span> {skill.tools}</span>
              <span><span style={{ fontWeight: 600, color: T_.textDim }}>Mode:</span> {skill.mode}</span>
            </div>
          </div>
        ))}

        <div style={{ background: T_.bgInput, border: `1px dashed ${T_.accent}30`, borderRadius: 8, padding: "12px 14px", marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T_.accent, marginBottom: 6 }}>Recommended Workflow</div>
          <div style={{ fontSize: 11, color: T_.textMid, lineHeight: 1.8 }}>
            <strong>1.</strong> Update a tab → <span style={{ fontFamily: "monospace", color: "#14B8A6" }}>@refresh</span><br/>
            <strong>2.</strong> After code changes → <span style={{ fontFamily: "monospace", color: "#34d673" }}>@codeverifier</span><br/>
            <strong>3.</strong> After research content → <span style={{ fontFamily: "monospace", color: "#70b0fa" }}>@fact-checker</span> + <span style={{ fontFamily: "monospace", color: "#f87171" }}>@fact-disputer</span> in parallel<br/>
            <strong>4.</strong> Then → <span style={{ fontFamily: "monospace", color: "#f5a623" }}>@fact-check-reconciler</span> for final verdicts<br/>
            <strong>5.</strong> Fix CONFLICT / LIKELY WRONG items, re-verify<br/>
            <strong>6.</strong> Pull third-party research → <span style={{ fontFamily: "monospace", color: "#38BDF8" }}>@third-party-research</span><br/>
            <strong>7.</strong> Test a scenario → <span style={{ fontFamily: "monospace", color: "#F97316" }}>@whatif</span> screens all companies for impact
          </div>
        </div>
      </div>
    </div>
  );
}
