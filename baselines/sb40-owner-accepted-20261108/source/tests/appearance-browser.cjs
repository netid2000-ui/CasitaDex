const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 740 } });
  const checks = [],
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const button = (t) => page.getByRole("button", { name: t, exact: true });
  await page.goto("http://127.0.0.1:8765/more");
  for (const [mode, color] of [
    ["Light", "rgb(113, 131, 119)"],
    ["Dark", "rgb(129, 155, 139)"],
  ]) {
    await button(mode).click();
    assert.equal(
      await button("Extra-large text: Off").evaluate(
        (e) => getComputedStyle(e).borderTopColor,
      ),
      color,
    );
    await button("Extra-large text: Off").click();
    await button("Extra-large text: On").waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    const small = await page.getByRole("button").evaluateAll((es) =>
      es
        .filter((e) => {
          let r = e.getBoundingClientRect();
          return r.width > 0 && (r.width < 48 || r.height < 48);
        })
        .map((e) => e.textContent),
    );
    assert.deepEqual(small, []);
    await page
      .getByText("Yours to keep.", { exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: "docs/qa/" + mode.toLowerCase() + "-more-200-final.png",
    });
    await button("Extra-large text: On").click();
    checks.push(mode + " control contrast, 320px/200% reflow and targets");
  }
  await button("System").click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("h1")).color ===
      "rgb(228, 239, 229)",
  );
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("h1")).color ===
      "rgb(25, 60, 51)",
  );
  checks.push("System appearance changes live after final palette correction");
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    "docs/qa/appearance-browser-results.json",
    JSON.stringify(
      { date: new Date().toISOString(), checks, pageErrors: errors },
      null,
      2,
    ),
  );
  console.log(checks.map((c) => "PASS " + c).join("\n"));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
