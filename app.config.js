module.exports = ({ config }) => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || "development";
  if (!["development", "staging"].includes(env))
    throw new Error(
      "Production configuration is intentionally unavailable; only development and staging are permitted.",
    );
  const suffix = env === "development" ? "dev" : "staging";
  const managedPlugins = ["expo-router", "@react-native-community/datetimepicker", ["expo-splash-screen", { image: "./assets/brand/splash-light.png", imageWidth: 160, resizeMode: "contain", backgroundColor: "#F6F7F4", dark: { image: "./assets/brand/splash-dark.png", backgroundColor: "#101C17" } }], ["expo-image-picker", {cameraPermission: "Allow CasitaDex to take a photo for your memory.", photosPermission: "Allow CasitaDex to choose a photo for your memory.", microphonePermission: false}], "./plugins/withAndroidSplashApi33", "./plugins/withAndroidBackupPrivacy"];
  const managedPluginIds = new Set(
    managedPlugins.map((plugin) => Array.isArray(plugin) ? plugin[0] : plugin),
  );
  const inheritedPlugins = (config.plugins ?? []).filter(
    (plugin) => !managedPluginIds.has(Array.isArray(plugin) ? plugin[0] : plugin),
  );
  return {
    ...config,
    name: "CasitaDex " + (env === "development" ? "Dev" : "Staging"),
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
    plugins: [...inheritedPlugins, ...managedPlugins],
    web: { ...config.web, bundler: "metro", output: "single", favicon: "./public/brand/favicon-light-32.png" },
    extra: {
      ...config.extra,
      appEnvironment: env,
      backendMode: "none",
      productionAuthorized: false,
    },
  };
};
