import { reminderNotificationTarget } from "./reminder-notification-target.ts";

type IntentOptions = { path: string; initial: boolean };
type LaunchLink = {
  platform: string;
  scheme: unknown;
  getLinkingURL(): string | null;
  clearInitialURL(): void;
};

/** Recover only the initial Android root fallback, before Router hydrates.
 * Expo Linking retains onCreate/onNewIntent URLs even when RN's URL event
 * precedes its JS subscription or getInitialURL returns the old MAIN intent.
 * Consume the cache on warm links too, so a later JS mount cannot replay one.
 */
export function redirectReminderSystemPath(
  { path, initial }: IntentOptions,
  launch: LaunchLink,
): string {
  if (launch.platform !== "android") return path;
  try {
    const captured = launch.getLinkingURL();
    launch.clearInitialURL();
    const scheme = launch.scheme;
    if (!initial || !captured || (scheme !== "casitadex-dev" && scheme !== "casitadex-staging")) return path;
    if (path !== "/" && !new RegExp(`^${scheme}:/{1,3}$`).test(path)) return path;
    const match = new RegExp(`^${scheme}:/{1,3}(card|reminders)\\?(id|reminder)=([^&#]+)$`).exec(captured);
    if (!match || (match[1] === "card" ? match[2] !== "id" : match[2] !== "reminder")) return path;
    const sourceId = reminderNotificationTarget(decodeURIComponent(match[3].replace(/\+/g, " ")));
    if (!sourceId) return path;
    // Router 57's query parser and local-params hook both decode. Keep literal
    // percent sequences intact, as in the existing native response drain.
    return `/${match[1]}?${match[2]}=${encodeURIComponent(encodeURIComponent(sourceId))}`;
  } catch {
    // A missing cache API or malformed external URL must never prevent launch.
    return path;
  }
}
