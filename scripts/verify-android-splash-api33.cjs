const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { AndroidConfig } = require("expo/config-plugins");
const THEME = "Theme.App.SplashScreen";
const BEHAVIOR = "android:windowSplashScreenBehavior";

async function verifyAndroidSplashApi33(androidRoot) {
  const res = path.join(androidRoot, "app/src/main/res");
  const read = async (folder) => {
    const file = path.join(res, folder, "styles.xml");
    await fs.access(file); // Do not accept the resource reader's empty fallback.
    return AndroidConfig.Resources.readResourcesXMLAsync({ path: file });
  };
  const theme = (xml) => {
    const matches = (xml.resources.style ?? []).filter((s) => s.$?.name === THEME);
    assert.equal(matches.length, 1, "Expected exactly one splash theme");
    return matches[0];
  };
  const base = theme(await read("values"));
  const versioned = theme(await read("values-v33"));
  assert.equal(versioned.$.parent, base.$.parent, "API33 parent must preserve the base theme");
  const baseItems = base.item ?? [];
  assert.ok(!baseItems.some((i) => i.$?.name === BEHAVIOR), "Base splash contains API33-only behavior");
  for (const name of ["windowSplashScreenBackground", "windowSplashScreenAnimatedIcon", "postSplashScreenTheme"]) {
    assert.equal(baseItems.filter((i) => i.$?.name === name).length, 1, "Missing or duplicate splash visual: " + name);
  }
  for (const item of baseItems) {
    const matches = (versioned.item ?? []).filter((i) => i.$?.name === item.$?.name);
    assert.equal(matches.length, 1, "API33 lost or duplicated base item: " + item.$?.name);
    assert.deepEqual(matches[0], item, "API33 changed base item: " + item.$?.name);
  }
  const occurrences = [];
  for (const folder of await fs.readdir(res, { withFileTypes: true })) {
    if (!folder.isDirectory() || !/^values(?:-|$)/.test(folder.name)) continue;
    for (const file of await fs.readdir(path.join(res, folder.name))) {
      if (!file.endsWith(".xml")) continue;
      const xml = await AndroidConfig.Resources.readResourcesXMLAsync({ path: path.join(res, folder.name, file) });
      for (const style of xml.resources.style ?? []) {
        for (const item of style.item ?? []) {
          if (item.$?.name === BEHAVIOR) occurrences.push({ folder: folder.name, file, theme: style.$?.name, value: item._ });
        }
      }
    }
  }
  assert.deepEqual(occurrences, [{ folder: "values-v33", file: "styles.xml", theme: THEME, value: "icon_preferred" }], "API33 behavior must occur exactly once, only in values-v33/styles.xml");
  return { result: "PASS", androidRoot: path.resolve(androidRoot), baseItems: baseItems.length, behavior: occurrences[0] };
}
module.exports = { verifyAndroidSplashApi33 };
if (require.main === module) {
  if (process.argv.length !== 3) {
    console.error("Usage: node scripts/verify-android-splash-api33.cjs <android-project-root>");
    process.exitCode = 1;
  } else {
    verifyAndroidSplashApi33(process.argv[2]).then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
