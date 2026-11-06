# ExpoSQLite native preparation after npm ci

Scope: CasitaDex, pinned expo-sqlite 57.0.4, existing reviewed plain-SQLite iOS native graph. This bounded recovery does not install or update dependencies, evaluate a podspec, run Ruby/CocoaPods, edit Xcode projects, or build an app.

## Why this is necessary

A clean npm ci removes the two generated package files ios/sqlite3.c and ios/sqlite3.h. The official ExpoSQLite.podspec copies them from vendor/sqlite3 when evaluated. Existing Pods references still point at these generated files. If the package header is missing, compilation can fall back to Apple's unprefixed SQLite header, then retain the wrong module in DerivedData. Restoring the exact vendor bytes and using fresh, isolated DerivedData fixed the observed build.

## Safe sequence

On the authorized Mac, from the repository root, with exclusive access to this checkout and native inputs:

1. Verify Swift: swift --version
2. Run the approved clean dependency install: npm ci
3. Read-only preflight: swift scripts/prepare-expo-sqlite.swift
4. After successful preflight: swift scripts/prepare-expo-sqlite.swift --apply
5. Use the reviewed native build command and a NEW external-volume -derivedDataPath. Retain old build output as evidence. Do not reuse a module cache created while the header was missing.

Do not add this as an automatic npm lifecycle hook. Native graph prerequisites must already exist. This script does not bootstrap Pods on a fresh clone. Missing inputs or any changed pin stop the process and require review, not regeneration or suppression of checks. It is bounded to the reviewed native graph, not a general dependency installer.

## Guarantees and limits

The portable script derives its root from the working directory. It preserves the reviewed recovery algorithm and pins; additional path checks reject symlink roots, input ancestors, vendor files and destination files. Existing Pods header links are checked against the expected package header destination. Both destination files are validated before either is written. Existing identical regular files are accepted, conflicting bytes and non-regular destinations are refused. Writes use Foundation's withoutOverwriting option. Re-running is idempotent and can complete a partial prior write.

Run in an exclusively owned checkout. Path checks are not a defense against a hostile concurrent process swapping directory entries. Do not run npm ci, native setup, or another preparation concurrently. The script never changes package manifests, lockfiles, project files, or existing destination bytes. It verifies protected inputs are unchanged afterward. Keep generated sqlite3.c/h out of Git.

Pins retained:
- Package name expo-sqlite and version 57.0.4, plus exact npm lockfile integrity.
- Official podspec and both vendor SHA-256 hashes.
- Podfile.lock, Pods Manifest.lock, and both existing Xcode project hashes.
- Plain SQLite properties, existing source/header graph entries, umbrella import, and exact Public/Private header link destinations.

The expected lockfile integrity string is checked; the script does not download or independently re-verify the npm tarball. Critical native bytes are independently SHA-256 checked.

## Verification and provenance

Reviewed recovery source: evidence sqlite-native-preparation-20261106/prepare-expo-sqlite.swift, SHA-256 6a4358bb2466bbfbdf3450ad804f5539ebbfe8813a074672701a590f3e93f955.
Baseline application revision: a8129e81aabb20e0112f39865a046372cb0d5130.
A prior independent Swift import probe passed all 48 names from the failing build.
Restored native preparation plus fresh DerivedData produced a successful unsigned arm64 iOS Simulator Release build on 2026-11-06. Executable SHA-256: cf6eb29756bb7c9030036a5e0fe55a44b9b0407a01e5689915a5f7e37a283caa.
That build predates this portable wrapper. No new native build or device acceptance is claimed for this change.

From the candidate root:
    swift scripts/test-prepare-expo-sqlite.swift <prepared-reference-root> <new-external-fixture-directory>

The test copies only required inputs, writes solely within a new fixture directory outside the reference checkout, retains fixtures/logs, and checks reference input bytes remain unchanged. Nineteen scenarios cover dry-run, apply, idempotence, partial recovery, bad arguments, package/integrity/vendor/podspec/native graph pins, SQLCipher/libSQL refusal, destination conflicts, live/dangling destination symlinks, source/parent symlinks and wrong Pods links. Tests do not build an app or alter the reference native cache.

Rollback: stop using the helper; preserve generated evidence. It performs no source or dependency update to undo. Do not delete caches or rewrite package files as an automatic rollback.
