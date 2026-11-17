# Chooser and notification routing integration

Created locally on Mac mini from 3843528 (including application fix 593de3d), on work/cd-chooser-routing-integration-20261116. Prior chooser worktree and evidence preserved. No merge conflicts; only the shared chooser component, exact Figma assets and its tests were carried forward. Routing files are byte-identical to the verified base. Chooser component, eight SVGs and regression tests are byte-identical to prior chooser worktree.

## Verified on integrated source
- Focused chooser and notification destination tests: 12 passed, zero failed/skipped.
- Full automated suite: 539 total, 533 passed, 6 skipped, zero failed.
- Typecheck, lint and diff whitespace check passed.

## Boundaries
No device use, native rebuild/install, GitHub commit/push, main merge or publication retry. Previous chooser native simulator/emulator evidence and leading-session physical notification evidence remain valid for their recorded builds, not a claim of combined native acceptance. The integrated candidate requires a new isolated virtual native build/smoke before physical installation. Do not install older chooser artifacts over the corrected physical iPhone build. Background/terminated notification routing, linked-memory notification taps, physical accessibility and owner acceptance remain separate gates.

All new logs and source identity proof are retained privately outside the repository. This report and integrated changes remain local and uncommitted.

## Combined native checkpoint (partial, stopped for concurrent ownership)
Both native builds succeeded in separate staging/DerivedData directories. Staged src trees match integrated source byte-for-byte. Installed only on isolated iOS simulator and Android emulator, without uninstall/data clear. Physical devices were not touched by this work.

- iOS combined-build chooser draft/repeat, Details and Edit Cancel smoke passed (one XCTest containing four cases).
- iOS existing saved-reminder destination opened Edit Reminder, but title assertion observed an empty value. This test is failed/unresolved, not accepted as routing proof; no assertion retry performed while ownership was uncertain.
- Android combined-build first chooser Cancel passed and preserved observed draft fields. Subsequent Back test could not find Add Photo because another workflow had navigated emulator to Add Reminder. Enlarged chooser and route smoke did not execute.
- Leading user sent a new Next at 21:33:23 UTC, after preflight. Concurrent emulator input was subsequently observed from a different adb path, and a physical iPhone notification XCTest was active. Device interaction stopped immediately on recognizing the conflict. No competing process was cancelled or modified.
- Settings observed restored: iOS large/light; Android font scale 1.0/night mode no.
- iOS all 11 tables equal excluding revision 96 to 97; 22 media hashes unchanged. Installed iOS bundle matches built artifact.
- iOS main.jsbundle SHA256: 8e8fc5e66edaf4e16a598f2a0f9fda7b05ecd6bdcb32e1cae9e8b2454655e624.
- Android built APK SHA256: 3377b02981d10e5636344172c73e6405d9d646fcf3ae7d633b86650970586abc. Current installed Android identity was not rechecked during concurrent use.

Combined native acceptance remains incomplete. Coordinate exclusive virtual-device ownership (or a newly isolated virtual device) before completing remaining tests. Do not promote to physical on these partial results. All new raw logs/results and pre-install baseline/snapshot remain private; prior evidence preserved. No GitHub publication retry.

## Reconciled November 17 native evidence

Reviewed actual retained results, rather than rerunning completed checks. The earlier partial-checkpoint statements above are historical.

- `integrated-route-corrected-20261117-r1.xcresult`: XCTest summary confirms 1 passed, 0 failed/skipped on the isolated iOS simulator. This supersedes the unresolved saved-reminder-title test result for that corrected test.
- `combined-remaining-android-20261117-r1.txt`: exact combined APK 3377b02981d10e5636344172c73e6405d9d646fcf3ae7d633b86650970586abc verified; Android Back and large/dark chooser Cancel passed with draft preservation. Font 1.0/light restored.
- `combined-android-reminder-route-20261117-r2.txt`: saved reminder editor title matched the retained list and Cancel was tapped. The final Home lookup failed the helper's hard-coded y<2240 bound; the failed run remains failed.
- `combined-android-reminder-postcondition-20261117-r3.txt`: independent read-only postcondition confirmed Reminders overview, editor absent, four accepted tabs and counts 0 upcoming / 2 overdue / 0 completed / 13 memory dates. This verifies the return state; it does not rewrite the prior failed test as a wholly passing run.

All named artifacts remain under `/Volumes/FA-Development/Designs-by-FA/Apple-Builds/PhotoChooser-Routing-Integration-20261116/`. Source checks were freshly rerun in the preceding checkpoint: TypeScript/lint passed; 538 tests passed, 1 skipped, 0 failed.

No devices were modified during this reconciliation, no physical installation occurred, and no owner acceptance is implied. Combined candidate physical acceptance and its publication remain outstanding. Retain the separately verified notification-routing physical builds until the combined candidate is ready for controlled promotion.
