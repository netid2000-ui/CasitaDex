import { requireOptionalNativeModule } from "expo";
import { AppState, Platform } from "react-native";
import { getEngStore, engEnabled } from "./eng-runtime.native";
import { listStandaloneReminders } from "./standalone-reminders.native";
import { subscribeReminderChanges } from "./reminder-notification-changes";
import {
  LINKED_REMINDER_TIME,
  projectReminderNotifications,
  reconcileReminderNotificationProjection,
  type ReminderNotification,
} from "./reminder-notification-projection";
import type { ReminderPermission } from "./reminder-alerts";

type ReminderBridge = {
  permission(): Promise<Exclude<ReminderPermission, "unavailable">>;
  requestPermission(): Promise<unknown>;
  pending(): Promise<{ reminders: ReminderNotification[]; otherCount: number; invalidOwned: string[] }>;
  cancel(identifiers: string[]): Promise<void>;
  schedule(identifier: string, kind: string, sourceId: string, at: number): Promise<void>;
};

const bridge = (Platform.OS === "ios" || Platform.OS === "android") && engEnabled
  ? requireOptionalNativeModule<ReminderBridge>("CasitaDexReminderAlerts")
  : null;

let queue = Promise.resolve();
let requested = false;
let pending = false;

function reconcile(): Promise<void> {
  if (!bridge) return Promise.resolve();
  const native = bridge;
  requested = true;
  if (pending) return queue;

  pending = true;
  queue = queue.then(async () => {
    try {
      while (requested) {
        requested = false;
        const permission = await native.permission();
        const previous = await native.pending();
        const desired = permission === "allowed"
          ? projectReminderNotifications(
            (await (await getEngStore()).load()).data.memories,
            await listStandaloneReminders(),
            {
              now: Date.now(),
              linkedDueTime: LINKED_REMINDER_TIME,
              limit: Math.max(0, 48 - previous.otherCount),
              pendingTimes: new Map(previous.reminders.map(item => [item.identifier, item.at])),
            },
          ).map(item => ({ ...item, title: "CasitaDex reminder" }))
          : [];
        const { cancel, schedule } = reconcileReminderNotificationProjection(previous.reminders, desired);
        const removals = [...cancel, ...previous.invalidOwned];
        if (removals.length > 0) await native.cancel(removals);
        for (const item of schedule) {
          await native.schedule(item.identifier, item.kind, item.sourceId, item.at);
        }
      }
    } finally {
      pending = false;
    }
  });
  const result = queue;
  queue = queue.catch(() => {});
  return result;
}

export function startReminderAlerts() {
  if (!bridge) return () => {};
  const refresh = () => {
    void reconcile().catch(() => { console.warn("CasitaDex could not refresh local reminder alerts."); });
  };
  const unsubscribe = subscribeReminderChanges(refresh);
  const foreground = AppState.addEventListener("change", state => {
    if (state === "active") refresh();
  });
  refresh();
  return () => {
    unsubscribe();
    foreground.remove();
  };
}

export async function getReminderPermission(): Promise<ReminderPermission> {
  return bridge ? bridge.permission() : "unavailable";
}

export async function enableReminderAlerts(): Promise<ReminderPermission> {
  if (!bridge) return "unavailable";
  if (await bridge.permission() === "undetermined") await bridge.requestPermission();
  await reconcile();
  return bridge.permission();
}
