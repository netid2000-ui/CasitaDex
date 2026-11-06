import { reminderNotificationTarget } from "./reminder-notification-target.ts";

export type ReminderResponse = { token: string; kind: "memory" | "standalone"; sourceId: string };
export type ReminderResponseRoute = { pathname: "/card"; params: { id: string } }
  | { pathname: "/reminders"; params: { reminder: string } };
export function reminderResponseRoute(value: unknown): ReminderResponseRoute | null {
  if (!value || typeof value !== "object") return null;
  const response = value as Partial<ReminderResponse>;
  const sourceId = reminderNotificationTarget(response.sourceId);
  if (!sourceId || typeof response.token !== "string" || !response.token) return null;
  // Expo Router 57 decodes query values in both parseQueryParams and
  // useLocalSearchParams. Preserve literal percent sequences through that second
  // decode by adding one transport layer before resolveHref adds URL encoding.
  // Installed-router regression tests pin this contract for both destinations.
  let routeId: string;
  try { routeId = encodeURIComponent(sourceId); } catch { return null; }
  if (response.kind === "memory") return { pathname: "/card", params: { id: routeId } };
  if (response.kind === "standalone") return { pathname: "/reminders", params: { reminder: routeId } };
  return null;
}

/** Subscribe before the first drain. Native retains cold taps until successful guarded navigation.
 * A token already navigated is only acknowledged on retry, so an ack failure cannot navigate twice. */
export function createReminderResponseDrain(
  inbox: { pendingResponse(): Promise<ReminderResponse | null>; acknowledgeResponse(token: string): Promise<void> },
  navigate: (route: ReminderResponseRoute) => boolean,
) {
  let active = true, running = false, requested = false;
  let navigatedToken: string | undefined;
  return {
    stop() { active = false; },
    async refresh() {
      requested = true;
      if (running || !active) return;
      running = true;
      try {
        while (active && requested) {
          requested = false;
          const response = await inbox.pendingResponse();
          if (!active || !response) continue;
          const route = reminderResponseRoute(response);
          if (route && navigatedToken !== response.token) {
            if (!navigate(route)) continue;
            navigatedToken = response.token;
          }
          await inbox.acknowledgeResponse(response.token);
          requested = true;
        }
      } finally { running = false; }
    },
  };
}
