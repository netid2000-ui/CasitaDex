import { test } from "node:test";
import assert from "node:assert/strict";
import { nextReminderDay, validReminderDay } from "../src/reminder-recurrence.ts";
test("valid Gregorian dates",()=>{
 assert.equal(validReminderDay("2024-02-29"),true);
 for(const s of ["2025-02-29","2026-13-01","2026-04-31","not-a-date"])assert.equal(validReminderDay(s),false);
});
test("repeat dates advance in local calendar units",()=>{
 assert.equal(nextReminderDay("2026-10-19","once"),null);
 assert.equal(nextReminderDay("2026-10-19","daily"),"2026-10-20");
 assert.equal(nextReminderDay("2026-10-19","weekly"),"2026-10-26");
 assert.equal(nextReminderDay("2026-01-31","monthly"),"2026-02-28");
 assert.equal(nextReminderDay("2024-02-29","yearly"),"2025-02-28");
 assert.equal(nextReminderDay("2026-12-31","monthly"),"2027-01-31");
 assert.equal(nextReminderDay("2026-02-28","monthly",31),"2026-03-31");
 assert.equal(nextReminderDay("2025-02-28","yearly",29),"2026-02-28");
 assert.equal(nextReminderDay("2027-02-28","yearly",29),"2028-02-29");
});

test('calendar year boundaries and overflow',()=>{
 assert.equal(validReminderDay('0004-02-29'),true);
 assert.equal(validReminderDay('0001-02-29'),false);
 assert.equal(nextReminderDay('0099-12-31','daily'),'0100-01-01');
 assert.throws(()=>nextReminderDay('9999-12-31','daily'),/range/);
 assert.throws(()=>nextReminderDay('9999-12-31','monthly'),/range/);
});


test("reminder timestamps reject the spring gap and select the first fall occurrence", async () => {
 const { reminderLocalTimestamp } = await import("../src/reminder-recurrence.ts");
 const previous = process.env.TZ;
 try {
  process.env.TZ = "America/Chicago";
  assert.equal(reminderLocalTimestamp("2026-03-08", "02:30"), null);
  assert.equal(reminderLocalTimestamp("2026-03-08", "03:30"), Date.parse("2026-03-08T08:30:00Z"));
  assert.equal(reminderLocalTimestamp("2026-11-01", "01:30"), Date.parse("2026-11-01T06:30:00Z"));
 } finally {
  if (previous === undefined) delete process.env.TZ;
  else process.env.TZ = previous;
 }
});


test("completion cannot silently advance a repeating reminder into the DST gap", async () => {
 const { nextReminderOccurrenceDay } = await import("../src/reminder-recurrence.ts");
 const previous = process.env.TZ;
 try {
  process.env.TZ = "America/Chicago";
  assert.throws(() => nextReminderOccurrenceDay("2026-03-07", "02:30", "daily"), /Edit the reminder time/);
  assert.throws(() => nextReminderOccurrenceDay("2026-03-01", "02:30", "weekly"), /Edit the reminder time/);
  assert.equal(nextReminderOccurrenceDay("2026-03-07", "03:30", "daily"), "2026-03-08");
  assert.equal(nextReminderOccurrenceDay("2026-03-07", "02:30", "once"), null);
  assert.equal(nextReminderOccurrenceDay("2026-10-31", "01:30", "daily"), "2026-11-01");
  assert.equal(nextReminderOccurrenceDay("2026-01-31", "09:00", "monthly", 31), "2026-02-28");
 } finally {
  if (previous === undefined) delete process.env.TZ;
  else process.env.TZ = previous;
 }
});
