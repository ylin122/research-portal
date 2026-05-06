#!/usr/bin/env node
// Post-deploy smoke test for the research portal.
// Asserts that production endpoints behave the way the source code says they should.
//
// Run after every deploy:   npm run verify-deploy
// Exits non-zero on any failure so you can wire it into CI / a deploy hook.
//
// History: this script exists because /api/financials sat in production
// without auth for an unknown number of days even though the source had a
// JWT gate. A 30-second curl would have caught it on day one.

const HOST = process.env.SMOKE_HOST || "https://research-portal-one.vercel.app";

const checks = [
  {
    name: "GET /api/financials without auth returns 401",
    async run() {
      const res = await fetch(`${HOST}/api/financials?symbol=AAPL`);
      if (res.status !== 401) {
        throw new Error(`expected 401, got ${res.status}`);
      }
      const body = await res.json().catch(() => null);
      if (!body || !body.error) {
        throw new Error(`expected JSON error body, got ${JSON.stringify(body)}`);
      }
    },
  },
  {
    name: "GET /api/financials with bad JWT returns 401",
    async run() {
      const res = await fetch(`${HOST}/api/financials?symbol=AAPL`, {
        headers: { Authorization: "Bearer not-a-real-token" },
      });
      if (res.status !== 401) {
        throw new Error(`expected 401, got ${res.status}`);
      }
    },
  },
  {
    name: "GET / serves the SPA shell",
    async run() {
      const res = await fetch(HOST);
      if (!res.ok) throw new Error(`expected 2xx, got ${res.status}`);
      const text = await res.text();
      if (!text.includes("<div id=\"root\"")) {
        throw new Error("response does not look like the SPA shell");
      }
    },
  },
];

let failed = 0;
for (const check of checks) {
  process.stdout.write(`  ${check.name} ... `);
  try {
    await check.run();
    console.log("PASS");
  } catch (err) {
    console.log(`FAIL — ${err.message}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed against ${HOST}`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed against ${HOST}`);
