const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const click = (label) =>
    (["Home", "Find", "Add", "More"].includes(label)
      ? page.getByRole("tab", { name: label, exact: true })
      : page.getByRole("button", {
          name: label === "Find filter" ? "Find" : label,
          exact: true,
        })
    ).click();
  const field = (label) =>
    page.getByRole("textbox", { name: label, exact: true });
  const checks = [];
  const pass = (name) => {
    checks.push(name);
    console.log("PASS " + name);
  };
  const overflow = async () =>
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
  fs.mkdirSync("docs/qa", { recursive: true });
  await page.goto("http://127.0.0.1:8765");
  await click("Explore example home");
  await click("Find");
  await page.getByText("What are you looking for?", { exact: true }).waitFor();
  await click("Refine results");
  await click("Buy");
  await page.getByText("20 × 25 × 1", { exact: true }).waitFor();
  assert.equal(
    await page.getByText("Hall closet ceiling", { exact: true }).count(),
    0,
  );
  pass("Buy suppresses location");
  await click("Fix");
  await page.getByText("EDR4RXD1", { exact: true }).waitFor();
  pass("Fix references");
  await click("Find filter");
  await page.getByText("Garage · left wall", { exact: true }).waitFor();
  pass("Find location");
  await click("Maintain");
  await page.getByText("20 × 25 × 1", { exact: true }).waitFor();
  pass("Maintain due filter");
  await click("All");
  await field("Search answers").fill("no such answer");
  await page.getByText("No matching answers.", { exact: false }).waitFor();
  await field("Search answers").fill("");
  pass("Search and empty state");
  await click("Share selected");
  assert.equal(
    await page
      .getByRole("button", { name: "Preview 0 selected cards", exact: true })
      .isDisabled(),
    true,
  );
  await click("Select: HVAC filter");
  await click("Preview 1 selected cards");
  const preview = await page.getByText(/EXAMPLE DATA\nHVAC filter/).innerText();
  assert.ok(!preview.includes("Hall closet"));
  assert.ok(!preview.includes("Garage"));
  pass("Selected share preview excludes private details");
  await click("Add");
  await click("Save answer");
  await page
    .getByText("Add a name and an answer before saving.", { exact: true })
    .waitFor();
  await field("What do you want to remember?").fill("Workshop battery");
  await field("The answer").fill("AA rechargeable");
  await field("Where it is (optional)").fill("Shelf B");
  await click("Save answer");
  await page.getByText("AA rechargeable", { exact: true }).waitFor();
  pass("Add validation and save");
  await click("Mark Verified");
  await page
    .getByText("Name the source you checked, such as the equipment label.", {
      exact: true,
    })
    .waitFor();
  await field("Source you checked").fill("Package label");
  await click("Mark Verified");
  await page.getByText("Confidence updated.", { exact: true }).waitFor();
  pass("Verification requires explicit source");
  await page.reload();
  await page.getByText("AA rechargeable", { exact: true }).waitFor();
  pass("Cold page reload retains saved card");
  await click("Edit answer");
  await field("Updated answer").fill("AAA rechargeable");
  await click("Save edited answer");
  await page.getByText("Needs checking", { exact: true }).waitFor();
  pass("Edit resets confidence");
  await field("New due date (YYYY-MM-DD, blank to remove)").fill("2026-02-30");
  await click("Save due date");
  await page
    .getByText("Use a real date in YYYY-MM-DD format.", { exact: true })
    .waitFor();
  await field("New due date (YYYY-MM-DD, blank to remove)").fill("2026-10-01");
  await click("Save due date");
  await page
    .getByText("Current due date: 2026-10-01", { exact: true })
    .waitFor();
  await click("Record maintenance done today");
  await page.getByText("Current due date: None", { exact: true }).waitFor();
  pass("Maintenance validates dates and clears completed reminder");
  await click("More");
  await click("Prepare text backup");
  const backup = await field("Complete backup text").inputValue();
  await field("Paste a CasitaDex backup to restore").fill('{"version":2}');
  await click("Check backup");
  assert.equal(
    await page
      .getByRole("button", { name: "Confirm replace from backup", exact: true })
      .count(),
    0,
  );
  await field("Paste a CasitaDex backup to restore").fill(backup);
  await click("Check backup");
  await click("Confirm replace from backup");
  await page.getByText("Backup restored.", { exact: true }).waitFor();
  pass("Invalid import rejected; valid restore confirmed");
  await context.setOffline(true);
  await click("Find");
  await field("Search answers").fill("Workshop");
  await page.getByText("AAA rechargeable", { exact: true }).waitFor();
  pass("Loaded app works offline");
  await context.setOffline(false);
  await click("More");
  await click("Extra-large text: Off");
  await overflow();
  await page.screenshot({ path: "docs/qa/more-200-mobile.png" });
  for (const tab of ["Home", "Find", "Add"]) {
    await click(tab);
    await overflow();
    await page.getByRole("textbox").first().count();
    await page.screenshot({
      path: "docs/qa/" + tab.toLowerCase() + "-200-mobile.png",
    });
  }
  pass("200% text primary screens at 390px");
  await page.keyboard.press("Tab");
  assert.ok(
    await page.evaluate(() => document.activeElement !== document.body),
  );
  pass("Keyboard focus reaches controls");
  await click("More");
  await click("Extra-large text: On");
  await page.setViewportSize({ width: 1280, height: 900 });
  await click("Find");
  await field("Search answers").fill("");
  await click("All");
  await overflow();
  await page.screenshot({ path: "docs/qa/answers-desktop.png" });
  pass("Desktop reflow");
  await page.evaluate(() =>
    localStorage.setItem("casitadex:development:v1", "BROKEN"),
  );
  await page.reload();
  await page.getByText(/We could not read your saved answers/).waitFor();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("casitadex:development:v1")),
    "BROKEN",
  );
  await click("Recover previous save");
  await page.getByText("What are you looking for?", { exact: true }).waitFor();
  await page.getByText("AAA rechargeable", { exact: true }).waitFor();
  pass("Corrupt data blocks overwrite and restores previous save");
  assert.deepEqual(errors, []);
  pass("No page exceptions");
  fs.writeFileSync(
    "docs/qa/browser-results.json",
    JSON.stringify(
      { date: new Date().toISOString(), checks, pageErrors: errors },
      null,
      2,
    ),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
