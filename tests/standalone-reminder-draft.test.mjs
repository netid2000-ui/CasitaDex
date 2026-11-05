import assert from "node:assert/strict";
import test from "node:test";
import { defaultReminderDay, isReminderDraftDirty, newReminderDraft } from "../src/standalone-reminder-draft.ts";

test("a loaded reminder starts clean and each editable field can make it dirty", () => {
  const saved = { title: "Filters", notes: "Check size", dueDate: "2026-11-07", dueTime: "10:45", repeat: "monthly" };
  assert.equal(isReminderDraftDirty({ ...saved }, saved), false);
  for (const change of [
    { title: "" }, { notes: "" }, { dueDate: "2026-11-08" }, { dueTime: "09:00" }, { repeat: "once" },
  ]) {
    assert.equal(isReminderDraftDirty({ ...saved, ...change }, saved), true);
  }
});

test("a new reminder's clean baseline stays tied to its opening date", () => {
  const opened = newReminderDraft("2026-11-05");
  assert.equal(isReminderDraftDirty({ ...opened }, opened), false);
  assert.equal(isReminderDraftDirty(newReminderDraft("2026-11-06"), opened), true);
});

test("new reminder defaults to the next 9 AM local occurrence", () => {
  assert.equal(defaultReminderDay(new Date(2026, 10, 5, 8, 59)), "2026-11-05");
  assert.equal(defaultReminderDay(new Date(2026, 10, 5, 9, 0)), "2026-11-06");
  assert.equal(defaultReminderDay(new Date(2026, 11, 31, 14, 0)), "2027-01-01");
});
