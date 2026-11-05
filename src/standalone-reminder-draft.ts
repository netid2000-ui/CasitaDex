import type { RepeatSchedule } from "./reminder-recurrence";

export type ReminderDraft = {
  title: string;
  notes: string;
  dueDate: string;
  dueTime: string;
  repeat: RepeatSchedule;
};

export function newReminderDraft(today: string): ReminderDraft {
  return { title: "", notes: "", dueDate: today, dueTime: "09:00", repeat: "once" };
}

export function isReminderDraftDirty(draft: ReminderDraft, original: ReminderDraft): boolean {
  return draft.title !== original.title || draft.notes !== original.notes
    || draft.dueDate !== original.dueDate || draft.dueTime !== original.dueTime
    || draft.repeat !== original.repeat;
}

/** The new reminder opens on the next 9 AM local occurrence, including after 9 AM today. */
export function defaultReminderDay(now: Date = new Date()): string {
  const target = new Date(now);
  target.setHours(9, 0, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  const pad = (value: number) => String(value).padStart(2, "0");
  return [String(target.getFullYear()).padStart(4, "0"), pad(target.getMonth() + 1), pad(target.getDate())].join("-");
}
