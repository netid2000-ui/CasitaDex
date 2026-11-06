import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
const require = createRequire(import.meta.url);
const plugin = require("../plugins/withAndroidBackupPrivacy");
const { XML, withAndroidManifest } = require("expo/config-plugins");
const expectedDomains = ["root", "file", "database", "sharedpref", "external", "device_root", "device_file", "device_database", "device_sharedpref"];
const manifest = () => ({ manifest: { $: { "xmlns:android": "http://schemas.android.com/apk/res/android" }, application: [{ $: { "android:name": ".MainApplication", "android:theme": "@style/AppTheme", "android:allowBackup": "true" }, activity: [{ $: { "android:name": ".MainActivity" } }] }] } });
const app = (m) => m.manifest.application[0];

test("modern XML excludes every credential/device-protected domain separately for both transports", async () => {
  const xml = await XML.parseXMLAsync(plugin.RULES);
  const rules = xml["data-extraction-rules"];
  for (const transport of ["cloud-backup", "device-transfer"]) {
    assert.equal(rules[transport].length, 1);
    const section = rules[transport][0];
    assert.equal(section.include, undefined);
    assert.deepEqual(section.exclude.map((e) => e.$), expectedDomains.map((domain) => ({ domain, path: "." })));
  }
  assert.equal(rules["cross-platform-transfer"], undefined, "No cross-platform transfer enrollment");
});

test("legacy policy remains disabled, unrelated components survive, custom agents fail for review", () => {
  const input = manifest(), before = structuredClone(input);
  const once = plugin.applyBackupPrivacy(input);
  assert.equal(app(once).$["android:allowBackup"], "false");
  assert.equal(app(once).$["android:fullBackupContent"], "false");
  assert.equal(app(once).$["android:dataExtractionRules"], "@xml/casitadex_data_extraction_rules");
  assert.equal(app(once).$["android:theme"], app(before).$["android:theme"]);
  assert.deepEqual(app(once).activity, app(before).activity);
  assert.deepEqual(plugin.applyBackupPrivacy(structuredClone(once)), once);
  const custom = manifest(); app(custom).$["android:backupAgent"] = ".CustomAgent";
  assert.throws(() => plugin.applyBackupPrivacy(custom), /separate privacy review/);
  assert.throws(() => plugin.applyBackupPrivacy({ manifest: {} }));
});

test("managed plugin is unique after splash fix in both environments; inherited input and iOS survive", () => {
  const configure = require("../app.config.js"), source = require("../app.json").expo;
  const name = "./plugins/withAndroidBackupPrivacy", id = (p) => Array.isArray(p) ? p[0] : p;
  const old = process.env.EXPO_PUBLIC_APP_ENV;
  try {
    for (const environment of ["development", "staging"]) {
      process.env.EXPO_PUBLIC_APP_ENV = environment;
      const inherited = { ...source, plugins: [...source.plugins, name, [name, {}]] };
      const before = structuredClone(inherited), output = configure({ config: inherited });
      assert.deepEqual(inherited, before);
      const ids = output.plugins.map(id);
      assert.equal(ids.filter((p) => p === name).length, 1);
      assert.ok(ids.indexOf(name) > ids.indexOf("./plugins/withAndroidSplashApi33"));
      assert.equal(output.android.allowBackup, false);
      assert.deepEqual(configure({ config: output }), output);
      assert.equal(plugin({ ios: { sentinel: true } }).mods.ios, undefined);
    }
  } finally {
    if (old === undefined) delete process.env.EXPO_PUBLIC_APP_ENV;
    else process.env.EXPO_PUBLIC_APP_ENV = old;
  }
});

test("real Expo mod chain applies privacy last and writes deterministic unqualified XML", async (t) => {
  // The runner selects external-SSD TMPDIR; cleanup owns only this fresh fixture.
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "casitadex-backup-privacy-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const android = path.join(root, "android");
  const resource = path.join(android, "app/src/main/res/xml/casitadex_data_extraction_rules.xml");
  const run = async () => {
    let config = withAndroidManifest({ ios: { sentinel: true } }, (c) => {
      app(c.modResults).$["android:allowBackup"] = "true";
      return c;
    });
    config = plugin(config);
    const modRequest = { platformProjectRoot: android, projectRoot: root, platform: "android", introspect: false };
    const result = await config.mods.android.manifest({ ...config, modRequest, modResults: manifest() });
    assert.equal(app(result.modResults).$["android:allowBackup"], "false");
    assert.deepEqual(result.ios, { sentinel: true });
    await config.mods.android.dangerous({ ...config, modRequest, modResults: {} });
    return fs.readFile(resource, "utf8");
  };
  assert.equal(await run(), plugin.RULES);
  assert.equal(await run(), plugin.RULES);
  assert.deepEqual(await fs.readdir(path.join(android, "app/src/main/res")), ["xml"]);
  const manifestFile = path.join(android, "app/src/main/AndroidManifest.xml");
  await XML.writeXMLAsync({ path: manifestFile, xml: plugin.applyBackupPrivacy(manifest()) });
  const { verifyAndroidBackupPrivacy } = require("../scripts/verify-android-backup-privacy.cjs");
  assert.equal((await verifyAndroidBackupPrivacy(android)).result, "PASS");
  await fs.writeFile(resource, plugin.RULES.replace('<exclude domain="device_database" path="."/>', ''));
  await assert.rejects(verifyAndroidBackupPrivacy(android));
  await fs.writeFile(resource, plugin.RULES);
  await XML.writeXMLAsync({ path: manifestFile, xml: manifest() });
  await assert.rejects(verifyAndroidBackupPrivacy(android));
  await XML.writeXMLAsync({ path: manifestFile, xml: plugin.applyBackupPrivacy(manifest()) });
});

test("introspection performs no filesystem writes", async () => {
  const config = plugin({});
  await config.mods.android.dangerous({ ...config, modResults: {}, modRequest: { platformProjectRoot: "/not-a-real-casitadex-project", introspect: true } });
});
