const fs = require("node:fs/promises");
const path = require("node:path");
const { isDeepStrictEqual } = require("node:util");
const { AndroidConfig, XML, withBaseMod } = require("expo/config-plugins");

const THEME = "Theme.App.SplashScreen";
const BEHAVIOR = "android:windowSplashScreenBehavior";

// Android chooses one qualified style, rather than merging its items with values/.
// Copy the complete generated splash theme so its colors/icon/post-theme survive.
function qualifySplashStyles(base, qualified = { resources: {} }) {
  const themes = base.resources?.style?.filter((style) => style.$?.name === THEME) ?? [];
  if (themes.length !== 1) {
    throw new Error("Expected exactly one Expo splash theme; run this plugin after expo-splash-screen.");
  }
  const theme = themes[0];
  const behaviors = (theme.item ?? []).filter((item) => item.$?.name === BEHAVIOR);
  if (behaviors.some((item) => item._ !== "icon_preferred")) {
    throw new Error("Expo splash behavior changed; review API33 compatibility before generating resources.");
  }
  const baseResult = structuredClone(base);
  const baseTheme = baseResult.resources.style.find((style) => style.$?.name === THEME);
  baseTheme.item = (baseTheme.item ?? []).filter((item) => item.$?.name !== BEHAVIOR);
  const api33 = structuredClone(qualified);
  api33.resources ??= {};
  const styles = api33.resources.style ?? [];
  const existing = styles.filter((style) => style.$?.name === THEME);
  if (existing.length > 1) throw new Error("Duplicate API33 splash themes require manual reconciliation.");
  const priorBehaviors = (existing[0]?.item ?? []).filter((item) => item.$?.name === BEHAVIOR);
  if (priorBehaviors.some((item) => item._ !== "icon_preferred") || priorBehaviors.length > 1) {
    throw new Error("Existing API33 splash behavior changed or duplicated; review before generating resources.");
  }
  // A missing upstream item is not permission to invent it. Only a complete
  // previously qualified theme proves that this is an idempotent rerun.
  if (behaviors.length === 0) {
    const validPrior = priorBehaviors.length === 1 &&
      existing[0].$?.parent === baseTheme.$?.parent &&
      baseTheme.item.every((item) => {
        const matches = (existing[0].item ?? []).filter((prior) => prior.$?.name === item.$?.name);
        return matches.length === 1 && isDeepStrictEqual(matches[0], item);
      });
    if (!validPrior) {
      throw new Error("Expo splash behavior is absent without a valid prior API33 theme; review upstream generation.");
    }
  }
  // Preserve unrelated API33 overrides; current base items remain authoritative.
  const baseNames = new Set(baseTheme.item.map((item) => item.$?.name));
  const extraItems = (existing[0]?.item ?? []).filter((item) =>
    item.$?.name !== BEHAVIOR && !baseNames.has(item.$?.name));
  const versionedTheme = structuredClone(baseTheme);
  versionedTheme.item.push(...extraItems, { $: { name: BEHAVIOR }, _: "icon_preferred" });
  api33.resources.style = [...styles.filter((style) => style.$?.name !== THEME), versionedTheme];
  return { base: baseResult, api33 };
}

function withAndroidSplashApi33(config) {
  // Ordinary style mods run in reverse registration order. Await the previous
  // chain so Expo has finished generating the theme before we qualify its item.
  return withBaseMod(config, {
    platform: "android",
    mod: "styles",
    async action(config) {
      const result = await config.modRequest.nextMod(config);
      const introspect = result.modRequest.introspect;
      const file = path.join(result.modRequest.platformProjectRoot, "app/src/main/res/values-v33/styles.xml");
      const qualified = introspect ? { resources: {} } :
        await AndroidConfig.Resources.readResourcesXMLAsync({ path: file });
      const output = qualifySplashStyles(result.modResults, qualified);
      if (!introspect) {
        await fs.mkdir(path.dirname(file), { recursive: true });
        await XML.writeXMLAsync({ path: file, xml: output.api33 });
      }
      result.modResults = output.base;
      return result;
    },
  });
}

module.exports = withAndroidSplashApi33;
module.exports.qualifySplashStyles = qualifySplashStyles;
