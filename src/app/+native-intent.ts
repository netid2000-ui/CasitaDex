import Constants from "expo-constants";
import { clearInitialURL, getLinkingURL } from "expo-linking";
import { Platform } from "react-native";
import { redirectReminderSystemPath } from "../android-reminder-intent";

export function redirectSystemPath(options: { path: string; initial: boolean }): string {
  return redirectReminderSystemPath(options, {
    platform: Platform.OS,
    scheme: Constants.expoConfig?.scheme,
    getLinkingURL,
    clearInitialURL,
  });
}
