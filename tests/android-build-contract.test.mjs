import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const script = readFileSync(new URL('../scripts/build-android-staging-shortpath.ps1', import.meta.url), 'utf8');
const guard = readFileSync(new URL('../scripts/verify-local-only.gradle', import.meta.url), 'utf8');

test('preflight prerequisites run before isolated checkout creation', () => {
  for (const token of ['Get-Command $tool', 'platform-tools\\adb.exe', 'bin\\java.exe']) {
    assert.ok(script.includes(token), `missing prerequisite guard: ${token}`);
    assert.ok(script.indexOf(token) < script.indexOf('New-Item -ItemType Directory -Force -Path $folder'), `${token} must run before creating scratch dirs`);
  }
});

test('build is Staging debug and verifies actual APK identity', () => {
  assert.match(script, /EXPO_PUBLIC_APP_ENV = 'staging'/);
  assert.match(script, /:app:assembleDebug/);
  assert.match(script, /aapt dump badging|\$aapt dump badging/);
  assert.match(script, /com\\\.designsbyfa\\\.casitadex\\\.staging/);
});

test('matching debug runtime graph gate precedes compilation', () => {
  assert.match(guard, /debugRuntimeClasspath/);
  assert.match(guard, /com\.google\.firebase:/);
  assert.ok(script.indexOf('verifyLocalOnlyRuntime') < script.indexOf(':app:assembleDebug'));
});
