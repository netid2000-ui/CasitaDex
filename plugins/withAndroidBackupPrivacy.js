const fs = require("node:fs/promises");
const path = require("node:path");
const { AndroidConfig, withBaseMod, withDangerousMod } = require("expo/config-plugins");

// Explicit app-private exclusions, including device-protected storage. A root
// exclusion alone must not be assumed to cover every Android backup domain.
const DOMAINS = Object.freeze([
  "root", "file", "database", "sharedpref", "external",
  "device_root", "device_file", "device_database", "device_sharedpref",
]);
const RESOURCE = "casitadex_data_extraction_rules";
const exclusions = DOMAINS.map((domain) => `    <exclude domain="${domain}" path="."/>`).join("\n");
const RULES = `<?xml version="1.0" encoding="utf-8"?>
<!-- OS transport policy only. User-initiated portable export/import is unchanged. -->
<data-extraction-rules>
  <cloud-backup>
${exclusions}
  </cloud-backup>
  <device-transfer>
${exclusions}
  </device-transfer>
</data-extraction-rules>
`;

function applyBackupPrivacy(manifest) {
  const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
  if (application.$["android:backupAgent"]) {
    throw new Error("Custom backup agent requires a separate privacy review.");
  }
  application.$["android:allowBackup"] = "false";
  application.$["android:fullBackupContent"] = "false";
  application.$["android:dataExtractionRules"] = `@xml/${RESOURCE}`;
  return manifest;
}

function withAndroidBackupPrivacy(config) {
  // Apply after preceding manifest mods so generated Expo defaults cannot undo
  // this policy. Preserve every unrelated manifest attribute/component.
  config = withBaseMod(config, {
    platform: "android", mod: "manifest",
    async action(config) {
      const result = await config.modRequest.nextMod(config);
      result.modResults = applyBackupPrivacy(result.modResults);
      return result;
    },
  });
  return withDangerousMod(config, ["android", async (config) => {
    if (!config.modRequest.introspect) {
      // Android 12+ reads this format through its API31 manifest attribute.
      // Use the documented unqualified XML location; older Android versions
      // retain allowBackup/fullBackupContent=false and do not parse these rules.
      const file = path.join(config.modRequest.platformProjectRoot,
        "app/src/main/res/xml", `${RESOURCE}.xml`);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, RULES, "utf8");
    }
    return config;
  }]);
}
module.exports = withAndroidBackupPrivacy;
module.exports.applyBackupPrivacy = applyBackupPrivacy;
module.exports.DOMAINS = DOMAINS;
module.exports.RULES = RULES;
