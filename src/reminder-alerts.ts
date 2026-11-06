export type ReminderPermission = "allowed" | "denied" | "undetermined" | "unavailable";
export function startReminderAlerts(): () => void { return () => {}; }
export async function getReminderPermission(): Promise<ReminderPermission> { return "unavailable"; }
export async function enableReminderAlerts(): Promise<ReminderPermission> { return "unavailable"; }

export function startReminderResponses(_navigate: (route: import("./reminder-response-routing").ReminderResponseRoute) => boolean): () => void { return () => {}; }
