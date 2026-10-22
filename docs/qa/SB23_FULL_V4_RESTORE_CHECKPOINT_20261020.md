# SB-23 Full v4 restore checkpoint — 2026-10-20

Status: CODE INTEGRATED; NOT ACCEPTED for device recovery.

Scope: Development only. No physical Samsung, Staging or Production changes. No commits or pushes.

Implemented: Full v4 archive read/validation, ENG and standalone-reminder replacement inside a single SQLite transaction, previous ENG and reminder snapshots for recoverV4, staged/verified immutable media before commit, stale ENG review-token check, explicit incoming/current draft choice, legacy Full v3 restore preserving reminders, and recovery UI choosing v4 or legacy path.

Automated evidence: Full v4 tests, reminder validation, atomic ENG/reminder swap and recovery, stale ENG preview rejection, and injected failures after reminder write and after ENG write. TypeScript and ESLint clean.

Not yet proven: on-device SAF Full v4 selection, process-kill interruption recovery, reboot durability, true SQLite WAL behavior on Android, photo equality after real restore, and reminder preview staleness if reminders alone change. Do not accept SB-23 until those gates pass. Consumer Full v4 restore intentionally remains blocked in pickEngBackup.

Repository: C:\CasitaDex-Git, dirty owner checkout preserved. Build script rejects dirty checkout, so use an isolated non-destructive build snapshot rather than altering owner changes.

## 2026-10-20 SB-23 consolidated execution evidence
- Isolated Development-only Full v4 acceptance APK: Gradle 8.14.3 assembleRelease successful; package com.designsbyfa.casitadex.dev; installed on emulator-5580 with adb install -r, preserving data. Physical Samsung excluded.
- Native SAF picker opened independently inspected 65,246-byte Full v4 archive: 1 standalone reminder, 1 unfinished draft, 1 draft photo.
- Emulator restore UI reported Full collection restored and verified; Home showed SB22DraftFixture and one attached photo; Reminders displayed SB22ReminderFixture.
- Force-stop and relaunch retained SB22DraftFixture and photo count. Recovery UI reported Previous full save recovered and verified.
- Corrected ENG-only commit and damaged-state repair to invalidate stale Full v4 reminder recovery marker.
- Added transactional migration of old standalone reminder columns due_time, anchor_day, repeat before v4 restore.
- Targeted 7/7 tests; npm test 292 passed, 2 skipped, 0 failed; npm run typecheck and npm run lint passed.
- Pending: final fixed APK build/reinstall verification and additional post-recovery evidence; authoritative Full v4 gate remains enabled until completion.
- No commits, pushes, deployments, Production/Staging changes or physical-phone operations.

## 2026-10-20 final Development acceptance
- Fixed APK C:\cdr\a\android\app\build\outputs\apk\release\app-release.apk (107172648 bytes) built successfully: 607 tasks, 1m15s.
- adb -s emulator-5580 install -r: Success. Installed only com.designsbyfa.casitadex.dev, no data wipe.
- After updated APK install, Home displayed SB22DraftFixture and 1 attached photo; standalone Reminders displayed SB22ReminderFixture with 2026-10-19 09:00 once.
- Repeated native previous-save Full v4 recovery with fixed APK: UI reported Previous full save recovered and verified. Home again displayed draft and photo count.
- Authoritative Full v4 restore gate removed only after above acceptance; warning now requires second verified backup and explicit replacement confirmation.
- New regression tests for stale marker and legacy reminder columns both pass. Final full suite rerun started; capture completion separately.
- Physical Samsung, Staging, Production, commits and pushes untouched.
