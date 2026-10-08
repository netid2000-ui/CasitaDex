const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 320, height: 740 },
  });
  const p = await context.newPage();
  const checks = [];
  const click = async (t) => {
    await p.getByRole("button", { name: t, exact: true }).click();
    const paths = {
      Today: "/",
      Answers: "/answers",
      Add: "/add",
      More: "/more",
      "Open HVAC filter": "/card",
      "Choose cards to share": "/answers",
    };
    if (paths[t]) await p.waitForURL((u) => u.pathname === paths[t]);
  };
  async function check(name) {
    const bad = await p.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "button,[role=button],h1,h2,h3,textarea,input",
        ),
      )
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
        })
        .map(
          (e) => e.textContent?.slice(0, 80) || e.getAttribute("aria-label"),
        ),
    );
    assert.deepEqual(bad, []);
    const small = await p.getByRole("button").evaluateAll((es) =>
      es
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && (r.width < 47 || r.height < 47);
        })
        .map((e) => e.textContent),
    );
    assert.deepEqual(small, []);
    checks.push(name);
    console.log("PASS " + name);
  }
  await p.goto("http://127.0.0.1:8765");
  await click("Explore example home");
  await click("More");
  await click("Extra-large text: Off");
  await check("More 200% at 320px, controls >=48");
  await click("Today");
  await check("Today 200% at 320px");
  await click("Answers");
  await click("Open HVAC filter");
  await check("Detail 200% at 320px");
  await p.getByText("20 × 25 × 1", { exact: true }).scrollIntoViewIfNeeded();
  await p.screenshot({ path: "docs/qa/detail-200-320.png" });
  await click("Choose cards to share");
  await click("Select: HVAC filter");
  await click("Preview 1 selected cards");
  await p
    .getByText("Exactly what you\u2019ll share", { exact: true })
    .scrollIntoViewIfNeeded();
  await check("Share preview 200% at 320px");
  await p.screenshot({ path: "docs/qa/share-200-320.png" });
  await click("Add");
  await check("Add 200% at 320px");
  await p.emulateMedia({ reducedMotion: "reduce" });
  await click("Today");
  await check("Reduced motion retains navigation");
  fs.writeFileSync(
    "docs/qa/accessibility-results.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        checks,
        nativeScreenReader: "not tested",
      },
      null,
      2,
    ),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
