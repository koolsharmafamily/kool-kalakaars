/**
 * LIGHTHOUSE — mobile profile, against the PRODUCTION build.
 *
 *   npm run build && npm start -- -p 3400
 *   node scripts/lighthouse.mjs [url] [label]
 *
 * Runs the default mobile config: a simulated slow 4G connection and a 4x CPU
 * slowdown, on a 412x823 viewport. Measuring the dev server instead would be
 * meaningless — dev ships unminified code and does no bundling.
 *
 * Prints the numbers that matter for this project and writes the full JSON
 * next to it so runs can be compared later.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const url = process.argv[2] ?? "http://localhost:3400/";
const label = process.argv[3] ?? "run";

const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  chromePath:
    process.env.CHROME_PATH ??
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

try {
  const result = await lighthouse(
    url,
    { port: chrome.port, output: "json", logLevel: "error" },
    // formFactor mobile + mobileSlow4G throttling is the Lighthouse default
    // for the mobile profile; stated explicitly so the run is reproducible.
    {
      extends: "lighthouse:default",
      settings: {
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 562.5,
          downloadThroughputKbps: 1474.56,
          uploadThroughputKbps: 675,
        },
        throttlingMethod: "simulate",
      },
    },
  );

  const lhr = result.lhr;
  const audit = (id) => lhr.audits[id];
  const ms = (id) => Math.round(audit(id)?.numericValue ?? 0);

  mkdirSync("lighthouse", { recursive: true });
  writeFileSync(`lighthouse/${label}.json`, JSON.stringify(lhr, null, 2));

  const perf = Math.round((lhr.categories.performance.score ?? 0) * 100);
  const a11y = Math.round((lhr.categories.accessibility.score ?? 0) * 100);
  const bp = Math.round((lhr.categories["best-practices"].score ?? 0) * 100);
  const seo = Math.round((lhr.categories.seo.score ?? 0) * 100);

  console.log(`\n  ── ${label} ──  ${url}`);
  console.log(`  Performance      ${perf}`);
  console.log(`  Accessibility    ${a11y}`);
  console.log(`  Best practices   ${bp}`);
  console.log(`  SEO              ${seo}`);
  console.log("");
  console.log(`  LCP              ${ms("largest-contentful-paint")} ms`);
  console.log(`  FCP              ${ms("first-contentful-paint")} ms`);
  console.log(`  Speed Index      ${ms("speed-index")} ms`);
  console.log(`  TBT              ${ms("total-blocking-time")} ms`);
  console.log(`  CLS              ${audit("cumulative-layout-shift")?.displayValue}`);
  console.log(`  TTI              ${ms("interactive")} ms`);

  const lcpEl = audit("largest-contentful-paint-element");
  const node = lcpEl?.details?.items?.[0]?.items?.[0]?.node;
  if (node) console.log(`\n  LCP element      ${node.snippet?.slice(0, 110)}`);

  const bytes = audit("total-byte-weight");
  if (bytes) console.log(`  Total bytes      ${bytes.displayValue}`);
  console.log("");
} finally {
  await chrome.kill();
}
