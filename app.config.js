module.exports = ({ config }) => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || "development";
  if (!["development", "staging"].includes(env))
    throw new Error(
      "Production configuration is intentionally unavailable; only development and staging runtime environments are permitted.",
    );
  const qa = process.env.CASITADEX_SB29_QA === "1";
  const sb39 = process.env.CASITADEX_SB39_QA === "1";
  const sb40 = process.env.CASITADEX_SB40_QA === "1";
  if ([qa, sb39, sb40].filter(Boolean).length > 1) throw new Error("Only one isolated QA identity can be selected.");
  const suffix = sb40 ? "sb40qa" : sb39 ? "sb39qa" : qa ? "sb29qa" : env === "development" ? "dev" : "staging";
  return {
    ...config,
    name: "CasitaDex " + (sb40 ? "SB40 QA" : sb39 ? "SB39 QA" : qa ? "SB29 QA" : env === "development" ? "Dev" : "Staging"),
    owner: "netid2000-10",
    icon: "./assets/brand/icon-light.png",
    scheme: "casitadex-" + suffix,
    ios: {
      ...config.ios,
      icon: { light: "./assets/brand/icon-light.png", dark: "./assets/brand/icon-dark.png", tinted: "./assets/brand/icon-tinted.png" },
      bundleIdentifier: "com.designsbyfa.casitadex." + suffix,
    },
    android: {
      ...config.android,
      package: "com.designsbyfa.casitadex." + suffix,
      allowBackup: false,
      adaptiveIcon: { foregroundImage: "./assets/brand/adaptive-color.png", monochromeImage: "./assets/brand/adaptive-outline.png", backgroundColor: "#FAF8F2" },
    },
    plugins: [["expo-build-properties", { ios: { enableSceneSupport: true } }], "expo-router", "@react-native-community/datetimepicker", ["expo-notifications", {icon:"./assets/brand/adaptive-outline.png", color:"#003F30"}], ["expo-splash-screen", { image: "./assets/brand/splash-light.png", imageWidth: 160, resizeMode: "contain", backgroundColor: "#F6F7F4", dark: { image: "./assets/brand/splash-dark.png", backgroundColor: "#101C17" } }], ["expo-image-picker", {cameraPermission: "Allow CasitaDex to take a photo for your memory.", photosPermission: "Allow CasitaDex to choose a photo for your memory.", microphonePermission: false}]],
    web: { ...config.web, bundler: "metro", output: "single", favicon: "./public/brand/favicon-light-32.png" },
    extra: {
      ...config.extra,
      appEnvironment: env,
      backendMode: "none",
      productionAuthorized: false,
      parityQaSeed: !sb39 && true,
    },
  };
};
