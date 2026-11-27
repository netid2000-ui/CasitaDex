module.exports = ({ config }) => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || "development";
  if (!["development", "staging"].includes(env))
    throw new Error(
      "Production configuration is intentionally unavailable; only development and staging runtime environments are permitted.",
    );
  const playProduct = process.env.CASITADEX_PLAY_TEST_PRODUCT_ID;
  if (playProduct && !/^[a-z0-9][a-z0-9._]*$/.test(playProduct)) throw new Error("Invalid Play product ID");
  const appleSandbox = process.env.CASITADEX_APPLE_SANDBOX === "1";
  const plusStore = process.env.CASITADEX_PLUS_STORE_QA === "1";
  const qa = process.env.CASITADEX_SB29_QA === "1";
  const platformQa = process.env.CASITADEX_PLATFORM_QA === "1";
  const sb39 = process.env.CASITADEX_SB39_QA === "1";
  const sb40 = process.env.CASITADEX_SB40_QA === "1";
  if ([qa, sb39, sb40, plusStore, appleSandbox, platformQa, Boolean(playProduct)].filter(Boolean).length > 1) throw new Error("Only one isolated QA identity can be selected.");
  const suffix = platformQa ? "platformqa" : plusStore ? "plusstoreqa" : sb40 ? "sb40qa" : sb39 ? "sb39qa" : qa ? "sb29qa" : env === "development" ? "dev" : "staging";
  return {
    ...config,
    name: "CasitaDex " + (platformQa ? "Platform QA" : plusStore ? "Plus Store QA" : sb40 ? "SB40 QA" : sb39 ? "SB39 QA" : qa ? "SB29 QA" : env === "development" ? "Dev" : "Staging"),
    owner: "netid2000-10",
    icon: "./assets/brand/icon-light.png",
    scheme: "casitadex-" + suffix,
    ios: {
      ...config.ios,
      ...(platformQa ? {buildNumber:"6"} : {}),
      icon: { light: "./assets/brand/icon-light.png", dark: "./assets/brand/icon-dark.png", tinted: "./assets/brand/icon-tinted.png" },
      ...(appleSandbox ? { infoPlist: { ...config.ios?.infoPlist, CasitaDexPlusProductID: "com.designsbyfa.casitadex.plus", CasitaDexPlusStoreEnvironment: "Sandbox" } } : plusStore ? { infoPlist: { ...config.ios?.infoPlist, CasitaDexPlusProductID: "local.casitadex.plus.qa", CasitaDexPlusStoreEnvironment: "Xcode" } } : {}),
      bundleIdentifier: appleSandbox ? "com.designsbyfa.casitadex" : "com.designsbyfa.casitadex." + suffix,
    },
    android: {
      ...config.android,
      ...(platformQa ? {versionCode:6} : {}),
      package: playProduct ? "com.designsbyfa.casitadex" : "com.designsbyfa.casitadex." + suffix,
      allowBackup: false,
      adaptiveIcon: { foregroundImage: "./assets/brand/adaptive-color.png", monochromeImage: "./assets/brand/adaptive-outline.png", backgroundColor: "#FAF8F2" },
    },
    plugins: [["expo-build-properties", { ios: { enableSceneSupport: true } }], "expo-router", "@react-native-community/datetimepicker", "./plugins/with-reminder-picker-theme", ["expo-notifications", {icon:"./assets/brand/adaptive-outline.png", color:"#003F30"}], ["expo-splash-screen", { image: "./assets/brand/splash-light.png", imageWidth: 160, resizeMode: "contain", backgroundColor: "#F6F7F4", dark: { image: "./assets/brand/splash-dark.png", backgroundColor: "#101C17" } }], ["expo-image-picker", {cameraPermission: "Allow CasitaDex to take a photo for your memory.", photosPermission: "Allow CasitaDex to choose a photo for your memory.", microphonePermission: false}]],
    web: { ...config.web, bundler: "metro", output: "single", favicon: "./public/brand/favicon-light-32.png" },
    extra: {
      ...config.extra,
      appEnvironment: env,
      playCatalogProduct: playProduct,
      backendMode: "none",
      // Isolated platform QA can exercise Free count without a live store purchase. No Plus grant.
      qaFreeMemoryLimit: platformQa,
      productionAuthorized: false,
      parityQaSeed: !sb39 && (qa || sb40 || plusStore || process.env.CASITADEX_PARITY_QA_SEED === "1"),
    },
  };
};
