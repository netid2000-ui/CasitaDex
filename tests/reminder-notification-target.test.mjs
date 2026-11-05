import test from "node:test";
import assert from "node:assert/strict";
import queryString from "query-string";
import { reminderNotificationTarget } from "../src/reminder-notification-target.ts";

test("notification identifiers round trip through the installed query parser", () => {
 for (const id of ["r_one", "hall light", "café & filter", "literal%20value", "a/b?c#d"]) {
  const query = queryString.stringify({ reminder: id });
  assert.equal(reminderNotificationTarget(queryString.parse(query).reminder), id);
 }
});

test("malformed and duplicate notification parameters cannot select an unrelated reminder", () => {
 for (const value of [undefined, null, [], ["r_one", "r_two"], "", "x".repeat(513), "r_\nother", 42]) {
  assert.equal(reminderNotificationTarget(value), null);
 }
 assert.equal(reminderNotificationTarget(queryString.parse("reminder=r_one&reminder=r_two").reminder), null);
 for (const query of ["reminder=%", "reminder=%E0%A4%A", "reminder=%GG"]) {
  const parsed = queryString.parse(query).reminder;
  assert.doesNotThrow(() => reminderNotificationTarget(parsed));
  assert.notEqual(reminderNotificationTarget(parsed), "r_one");
 }
});
