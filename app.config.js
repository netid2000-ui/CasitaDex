module.exports = ({ config }) => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || "development";
  if (!["development", "staging"].includes(env))
    throw new Error(
      "Production configuration is intentionally unavailable; only development and staging are permitted.",
    );
  const suffix = env === "development" ? "dev" : "staging";
  return {
    ...config,
    name: "CasitaDex " + (env === "development" ? "Dev" : "Staging"),
    owner: "netid2000-10",
    scheme: "casitadex-" + suffix,
    ios: {
      ...config.ios,
      bundleIdentifier: "com.designsbyfa.casitadex." + suffix,
    },
    android: {
      ...config.android,
      package: "com.designsbyfa.casitadex." + suffix,
      allowBackup: false,
    },
    plugins: ["expo-router", "expo-splash-screen", ["expo-image-picker", {cameraPermission: "Allow CasitaDex to take a photo for your memory.", photosPermission: "Allow CasitaDex to choose a photo for your memory.", microphonePermission: false}]],
    web: { bundler: "metro", output: "single" },
    extra: {
      appEnvironment: env,
      backendMode: "none",
      productionAuthorized: false,
    },
  };
};
