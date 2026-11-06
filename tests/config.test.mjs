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
  assert.equal(
    pkg.dependencies["expo-notifications"],
    undefined,
    "Unused Firebase Messaging dependency must not return without a new local-only reminder decision",
  );
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

test("development and staging preserve inherited scene support and unique managed privacy plugins", () => {
  const old = process.env.EXPO_PUBLIC_APP_ENV;
  const pluginId = (plugin) => Array.isArray(plugin) ? plugin[0] : plugin;
  try {
    for (const env of ["development", "staging"]) {
      process.env.EXPO_PUBLIC_APP_ENV = env;
      const inherited = {
        ...config,
        plugins: [
          ...config.plugins,
          "inherited-string-plugin",
          ["inherited-options-plugin", { custom: "preserve" }],
          "expo-router",
          ["expo-router", { stale: true }],
          "@react-native-community/datetimepicker",
          ["expo-splash-screen", { backgroundColor: "#ff0000" }],
          "expo-image-picker",
          ["expo-image-picker", { microphonePermission: "Do not retain this override" }],
        ],
      };
      const before = structuredClone(inherited);
      const actual = configure({ config: inherited });
      assert.deepEqual(inherited, before, "configuration must not mutate inherited input");
      assert.deepEqual(
        actual.plugins.find((plugin) => pluginId(plugin) === "expo-build-properties"),
        ["expo-build-properties", { ios: { enableSceneSupport: true } }],
      );
      assert.ok(actual.plugins.includes("inherited-string-plugin"));
      assert.deepEqual(
        actual.plugins.find((plugin) => pluginId(plugin) === "inherited-options-plugin"),
        ["inherited-options-plugin", { custom: "preserve" }],
      );
      for (const id of ["expo-router", "@react-native-community/datetimepicker", "expo-splash-screen", "expo-image-picker"]) {
        assert.equal(actual.plugins.filter((plugin) => pluginId(plugin) === id).length, 1, id + " must appear once");
      }
      assert.deepEqual(
        actual.plugins.find((plugin) => pluginId(plugin) === "expo-image-picker"),
        ["expo-image-picker", {
          cameraPermission: "Allow CasitaDex to take a photo for your memory.",
          photosPermission: "Allow CasitaDex to choose a photo for your memory.",
          microphonePermission: false,
        }],
      );
      const splash = actual.plugins.find((plugin) => pluginId(plugin) === "expo-splash-screen")[1];
      assert.equal(splash.backgroundColor, "#F6F7F4");
      assert.equal(splash.dark.backgroundColor, "#101C17");
      assert.equal(actual.extra.backendMode, "none");
      assert.equal(actual.extra.productionAuthorized, false);
      assert.equal(actual.ios.bundleIdentifier, "com.designsbyfa.casitadex." + (env === "development" ? "dev" : "staging"));
    }
  } finally {
    if (old === undefined) delete process.env.EXPO_PUBLIC_APP_ENV;
    else process.env.EXPO_PUBLIC_APP_ENV = old;
  }
});

test("managed plugin configuration also accepts an absent inherited plugin list", () => {
  const old = process.env.EXPO_PUBLIC_APP_ENV;
  try {
    process.env.EXPO_PUBLIC_APP_ENV = "development";
    const { plugins: ignored, ...withoutPlugins } = config;
    const actual = configure({ config: withoutPlugins });
    assert.equal(actual.plugins.length, 6);
    assert.equal(actual.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === "expo-image-picker")[1].microphonePermission, false);
  } finally {
    if (old === undefined) delete process.env.EXPO_PUBLIC_APP_ENV;
    else process.env.EXPO_PUBLIC_APP_ENV = old;
  }
});
