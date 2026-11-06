const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { XML, AndroidConfig } = require("expo/config-plugins");
const domains = ["root", "file", "database", "sharedpref", "external", "device_root", "device_file", "device_database", "device_sharedpref"];
async function verifyAndroidBackupPrivacy(androidRoot, manifestPath) {
  const main = path.join(androidRoot, "app/src/main");
  const manifest = await XML.parseXMLAsync(await fs.readFile(manifestPath || path.join(main, "AndroidManifest.xml"), "utf8"));
  const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest).$;
  assert.equal(application["android:allowBackup"], "false");
  assert.equal(application["android:fullBackupContent"], "false");
  assert.equal(application["android:dataExtractionRules"], "@xml/casitadex_data_extraction_rules");
  assert.equal(application["android:backupAgent"], undefined);
  const filename = "casitadex_data_extraction_rules.xml";
  const res = path.join(main, "res");
  const variants = [];
  for (const dir of await fs.readdir(res, { withFileTypes: true })) {
    if (!dir.isDirectory() || !/^xml(?:-|$)/.test(dir.name)) continue;
    if ((await fs.readdir(path.join(res, dir.name))).includes(filename)) variants.push(dir.name);
  }
  assert.deepEqual(variants, ["xml"], "Unexpected qualified extraction rules require review");
  const rules = (await XML.parseXMLAsync(await fs.readFile(path.join(res, "xml", filename), "utf8")))["data-extraction-rules"];
  for (const mode of ["cloud-backup", "device-transfer"]) {
    assert.equal(rules[mode].length, 1);
    assert.equal(rules[mode][0].include, undefined);
    assert.deepEqual(rules[mode][0].exclude.map((e) => e.$), domains.map((domain) => ({ domain, path: "." })));
  }
  assert.equal(rules["cross-platform-transfer"], undefined);
  return { result: "PASS", androidRoot: path.resolve(androidRoot), manifestPath: manifestPath || path.join(main, "AndroidManifest.xml"), domains: domains.length, transports: ["cloud-backup", "device-transfer"] };
}
module.exports = { verifyAndroidBackupPrivacy };
if (require.main === module) {
  if (process.argv.length < 3 || process.argv.length > 4) {
    console.error("Usage: node scripts/verify-android-backup-privacy.cjs <android-root> [merged-manifest-path]");
    process.exitCode = 1;
  } else verifyAndroidBackupPrivacy(process.argv[2], process.argv[3]).then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
