import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const configure = require("../app.config.js");
const config = require("../app.json").expo;
test("environment allowlist and distinct native identities", () => {
  const old = process.env.EXPO_PUBLIC_APP_ENV;
  try {
    process.env.EXPO_PUBLIC_APP_ENV = "development";
    const dev = configure({ config });
    process.env.EXPO_PUBLIC_APP_ENV = "staging";
    const stage = configure({ config });
    assert.notEqual(dev.android.package, stage.android.package);
    assert.notEqual(dev.ios.bundleIdentifier, stage.ios.bundleIdentifier);
    assert.notEqual(dev.scheme, stage.scheme);
    for (const env of ["production", "Production", "preview", "prod"]) {
      process.env.EXPO_PUBLIC_APP_ENV = env;
      assert.throws(() => configure({ config }));
    }
    assert.equal(dev.extra.backendMode, "none");
    assert.equal(dev.extra.productionAuthorized, false);
    assert.equal(dev.extra.eas?.projectId, "79b93f15-c8ba-40b6-b7f4-30662c225bd8");
  } finally {
    if (old === undefined) delete process.env.EXPO_PUBLIC_APP_ENV;
    else process.env.EXPO_PUBLIC_APP_ENV = old;
  }
});
test("no backend identity, dependencies or Production profiles", () => {
  const pkg = require("../package.json"),
    eas = require("../eas.json");
  assert.ok(!Object.keys(pkg.dependencies).some((k) => /firebase/i.test(k)));
  assert.match(pkg.dependencies["expo-notifications"], /^~57\.0\./, "SDK 57 local notification module only");
  const localAlerts=fs.readFileSync(new URL("../src/reminder-alerts.native.ts",import.meta.url),"utf8");
  assert.doesNotMatch(localAlerts,/getExpoPushToken|getDevicePushToken|firebase|fcm|apns/i);
  assert.equal(eas.build.production, undefined);
  assert.equal(eas.submit, undefined);
  for (const p of [
    ".firebaserc",
    "firebase.json",
    "google-services.json",
    "GoogleService-Info.plist",
  ])
    assert.ok(!fs.existsSync(p));
  const a = JSON.stringify(config);
  assert.ok(!/eventcommand|event-command|private_key/i.test(a));
});
