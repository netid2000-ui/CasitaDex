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
