import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Evaluate the actual screen expression so the test covers its platform branch.
const source = readFileSync(new URL('../src/eng-screens.tsx', import.meta.url), 'utf8');
const expression = source.match(/<Copy>Reminders are saved locally\. \{([\s\S]*?)\}<\/Copy>/)?.[1];
assert.ok(expression, 'The reminder delivery status must remain visible');
const copy = (os, permission) => vm.runInNewContext(expression, { Platform: { OS: os }, permission });

test('Android enabled status discloses best-effort delivery and linked reminder time', () => {
  assert.equal(copy('android', 'allowed'), 'Phone notifications are enabled. Android may delay alerts. Linked reminders use 9:00 AM local time.');
});

test('iOS enabled notification wording remains unchanged', () => {
  assert.equal(copy('ios', 'allowed'), 'Phone notifications are enabled. Linked reminders are scheduled for 9:00 AM local time.');
});

test('permission-denied, undetermined and unavailable guidance is unchanged on both platforms', () => {
  const expected = {
    denied: 'To receive alerts, allow CasitaDex notifications in Settings.',
    undetermined: 'Enable phone notifications to receive reminder alerts.',
    unavailable: 'Phone notifications are unavailable on this build.',
  };
  for (const os of ['android', 'ios']) {
    for (const [permission, text] of Object.entries(expected)) assert.equal(copy(os, permission), text);
  }
});
