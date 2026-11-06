import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
const require = createRequire(import.meta.url);
const plugin = require("../plugins/withAndroidSplashApi33");
const { qualifySplashStyles } = plugin;
const { verifyAndroidSplashApi33 } = require("../scripts/verify-android-splash-api33.cjs");
const { XML, AndroidConfig } = require("expo/config-plugins");
const { withAndroidSplashStyles } = require(path.join(path.dirname(require.resolve("expo-splash-screen/package.json")), "plugin/build/withAndroidSplashStyles.js"));
const THEME = "Theme.App.SplashScreen";
const BEHAVIOR = "android:windowSplashScreenBehavior";
const item = (name, value) => ({ $: { name }, _: value });
const splash = (xml) => xml.resources.style.find((s) => s.$.name === THEME);
const base = () => ({ resources: { style: [
  { $: { name: "AppTheme", parent: "Theme.AppCompat.DayNight.NoActionBar" }, item: [item("android:colorAccent", "#123456")] },
  { $: { name: THEME, parent: "Theme.SplashScreen" }, item: [
    item("windowSplashScreenBackground", "@color/splashscreen_background"),
    item("windowSplashScreenAnimatedIcon", "@drawable/splashscreen_logo"),
    item("postSplashScreenTheme", "@style/AppTheme"),
    item(BEHAVIOR, "icon_preferred"),
  ] },
] } });

test("API24-compatible base and complete API33 style preserve all splash visuals", () => {
  const input = base(), before = structuredClone(input);
  const result = qualifySplashStyles(input);
  assert.deepEqual(input, before);
  assert.equal(splash(result.base).item.some((i) => i.$.name === BEHAVIOR), false);
  assert.deepEqual(splash(result.api33), splash(before));
  assert.deepEqual(result.base.resources.style[0], before.resources.style[0]);
  assert.equal(splash(result.base).$.parent, "Theme.SplashScreen");
});

test("repeat generation is idempotent, deduplicates behavior and preserves unrelated API33 resources", () => {
  const input = base();
  splash(input).item.push(item(BEHAVIOR, "icon_preferred"));
  const qualified = { resources: { color: [{ $: { name: "other" }, _: "#abcdef" }], style: [
    { $: { name: "OtherStyle" }, item: [item("android:colorAccent", "#abcdef")] },
    { $: { name: THEME, parent: "stale" }, item: [item("android:windowLightStatusBar", "false"), item("postSplashScreenTheme", "@style/Stale"), item(BEHAVIOR, "icon_preferred")] },
  ] } };
  const before = structuredClone(qualified);
  const once = qualifySplashStyles(input, qualified);
  const twice = qualifySplashStyles(once.base, once.api33);
  assert.deepEqual(twice, once);
  assert.deepEqual(qualified, before);
  assert.deepEqual(once.api33.resources.color, before.resources.color);
  assert.deepEqual(once.api33.resources.style[0], before.resources.style[0]);
  assert.equal(splash(once.api33).item.filter((i) => i.$.name === BEHAVIOR).length, 1);
  assert.equal(splash(once.api33).item.find((i) => i.$.name === "postSplashScreenTheme")._, "@style/AppTheme");
  assert.equal(splash(once.api33).item.find((i) => i.$.name === "android:windowLightStatusBar")._, "false");
});

test("missing/duplicate themes and unexpected upstream behavior fail loudly", () => {
  assert.throws(() => qualifySplashStyles({ resources: {} }), /exactly one/);
  const duplicate = base(); duplicate.resources.style.push(structuredClone(splash(duplicate)));
  assert.throws(() => qualifySplashStyles(duplicate), /exactly one/);
  const changed = base(); splash(changed).item.at(-1)._ = "changed-upstream";
  assert.throws(() => qualifySplashStyles(changed), /behavior changed/);
  assert.throws(() => qualifySplashStyles(base(), duplicate), /Duplicate API33/);
});

test("absent upstream behavior requires a complete valid prior qualified theme", () => {
  const once = qualifySplashStyles(base());
  assert.deepEqual(qualifySplashStyles(once.base, once.api33), once);
  assert.throws(() => qualifySplashStyles(once.base), /absent without a valid prior/);
  const missing = structuredClone(once.api33);
  splash(missing).item = splash(missing).item.filter((i) => i.$.name !== BEHAVIOR);
  assert.throws(() => qualifySplashStyles(once.base, missing), /absent without a valid prior/);
  const incomplete = structuredClone(once.api33); splash(incomplete).item.shift();
  assert.throws(() => qualifySplashStyles(once.base, incomplete), /absent without a valid prior/);
  const changedParent = structuredClone(once.api33); splash(changedParent).$.parent = "Other";
  assert.throws(() => qualifySplashStyles(once.base, changedParent), /absent without a valid prior/);
  const changedVisual = structuredClone(once.api33); splash(changedVisual).item[0]._ = "@color/other";
  assert.throws(() => qualifySplashStyles(once.base, changedVisual), /absent without a valid prior/);
});

test("unexpected prior qualified behavior is never silently overwritten", () => {
  const once = qualifySplashStyles(base());
  for (const input of [base(), once.base]) {
    const changed = structuredClone(once.api33); splash(changed).item.at(-1)._ = "changed-upstream";
    assert.throws(() => qualifySplashStyles(input, changed), /Existing API33 splash behavior changed/);
    const duplicate = structuredClone(once.api33); splash(duplicate).item.push(item(BEHAVIOR, "icon_preferred"));
    assert.throws(() => qualifySplashStyles(input, duplicate), /changed or duplicated/);
  }
});

test("managed configuration registers the fix once after Expo in both environments", () => {
  const configure = require("../app.config.js"), original = require("../app.json").expo;
  const old = process.env.EXPO_PUBLIC_APP_ENV;
  const id = (p) => Array.isArray(p) ? p[0] : p;
  const name = "./plugins/withAndroidSplashApi33";
  try {
    for (const env of ["development", "staging"]) {
      process.env.EXPO_PUBLIC_APP_ENV = env;
      const configured = configure({ config: { ...original, plugins: [...original.plugins, name, [name, {}]] } });
      const ids = configured.plugins.map(id);
      assert.equal(ids.filter((i) => i === name).length, 1);
      assert.ok(ids.indexOf(name) > ids.indexOf("expo-splash-screen"));
      assert.deepEqual(configure({ config: configured }), configured);
    }
  } finally {
    if (old === undefined) delete process.env.EXPO_PUBLIC_APP_ENV;
    else process.env.EXPO_PUBLIC_APP_ENV = old;
  }
});

test("installed Expo generator plus real mod chain writes qualified XML twice without changing iOS", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "casitadex-splash-api33-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const android = path.join(root, "android");
  const baseFile = path.join(android, "app/src/main/res/values/styles.xml");
  const v33File = path.join(android, "app/src/main/res/values-v33/styles.xml");
  await fs.mkdir(path.dirname(baseFile), { recursive: true });
  const ios = { bundleIdentifier: "untouched", infoPlist: { sentinel: true } };
  const run = async () => {
    let config = withAndroidSplashStyles({ ios: structuredClone(ios) }, { backgroundColor: "#F6F7F4", dark: { backgroundColor: "#101C17" } });
    config = plugin(config);
    assert.equal(config.mods.ios, undefined);
    const result = await config.mods.android.styles({
      ...config, modResults: base(),
      modRequest: { platformProjectRoot: android, projectRoot: root, platform: "android", modName: "styles", introspect: false },
    });
    assert.deepEqual(result.ios, ios);
    await XML.writeXMLAsync({ path: baseFile, xml: result.modResults });
    return [await fs.readFile(baseFile, "utf8"), await fs.readFile(v33File, "utf8")];
  };
  const once = await run();
  assert.deepEqual(await run(), once, "generated XML must be byte-stable");
  assert.ok(!once[0].includes(BEHAVIOR));
  assert.equal(once[1].split(BEHAVIOR).length - 1, 1);
  assert.ok(!once.join("").includes("tools:targetApi"));
  assert.deepEqual(splash(await AndroidConfig.Resources.readResourcesXMLAsync({ path: v33File })), splash(base()));
  assert.equal((await verifyAndroidSplashApi33(android)).result, "PASS");
  await XML.writeXMLAsync({ path: baseFile, xml: base() });
  await assert.rejects(verifyAndroidSplashApi33(android), /Base splash contains/);
  await run();
  const broken = base(); splash(broken).item.shift();
  await XML.writeXMLAsync({ path: v33File, xml: broken });
  await assert.rejects(verifyAndroidSplashApi33(android), /lost or duplicated/);
  await run();
  const nightFile = path.join(android, "app/src/main/res/values-night/styles.xml");
  await fs.mkdir(path.dirname(nightFile), { recursive: true });
  await XML.writeXMLAsync({ path: nightFile, xml: base() });
  await assert.rejects(verifyAndroidSplashApi33(android), /exactly once/);
});

test("introspection never writes native resources", async () => {
  const config = plugin(withAndroidSplashStyles({}, {}));
  const result = await config.mods.android.styles({
    ...config, modResults: base(), modRequest: { platformProjectRoot: "/not-a-real-casitadex-project", introspect: true },
  });
  assert.equal(splash(result.modResults).item.some((i) => i.$.name === BEHAVIOR), false);
});
