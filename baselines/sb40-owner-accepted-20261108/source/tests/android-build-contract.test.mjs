import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const script = readFileSync(
  new URL('../scripts/build-android-staging-shortpath.ps1', import.meta.url),
  'utf8',
);

test('preflight runs before isolated checkout creation', () => {
  for (const token of [
    'Get-Command $tool',
    'platform-tools\\adb.exe',
    'bin\\java.exe',
  ]) {
    assert.ok(script.includes(token), `missing prerequisite: ${token}`);
    assert.ok(
      script.indexOf(token) <
        script.indexOf('New-Item -ItemType Directory -Force -Path $folder'),
      `preflight must precede scratch creation: ${token}`,
    );
  }
});

test('build remains isolated and Staging-only', () => {
  assert.match(script, /EXPO_PUBLIC_APP_ENV = 'staging'/);
  assert.match(script, /--local --no-hardlinks/);
  assert.match(script, /Refusing to overwrite existing build directory/);
  assert.match(script, /:app:assembleRelease/);
  assert.doesNotMatch(script, /':app:assembleDebug'/);
});

test('release dependency gate precedes compilation', () => {
  assert.match(script, /releaseRuntimeClasspath/);
  assert.match(script, /:app:dependencies/);
  assert.match(script, /com\\\.google\\\.firebase:/);
  assert.match(script, /FAILED\|Could not resolve/);
  assert.match(script, /BUILD SUCCESSFUL/);
  assert.ok(
    script.indexOf('releaseRuntimeClasspath') <
      script.indexOf("':app:assembleRelease'"),
  );
  assert.doesNotMatch(script, /--init-script \$guard/);
});

test('APK package identity and bundled JavaScript are verified', () => {
  assert.match(script, /\$aapt dump badging/);
  assert.match(script, /com\\\.designsbyfa\\\.casitadex\\\.staging/);
  assert.match(script, /assets\/index\.android\.bundle/);
  assert.match(script, /Bundled JavaScript asset is missing or empty/);
});

test('APK signature is verified without installing on device', () => {
  assert.match(script, /apksigner verify --print-certs/);
  assert.match(script, /STOP before installing/);
  assert.doesNotMatch(script, /adb(?:\.exe)?\s+install\b/);
});
