# CasitaDex Native Reminders: Research and Implementation Record
Date: 2026-10-19. Development-only, local-first Android/iOS.

## Primary references
- Expo date/time picker: https://docs.expo.dev/versions/latest/sdk/date-time-picker/
- Expo notifications: https://docs.expo.dev/versions/latest/sdk/notifications/
- Android exact alarms: https://developer.android.com/develop/background-work/services/alarms
- Android 14 exact alarm denial: https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
- Apple calendar trigger: https://developer.apple.com/documentation/usernotifications/uncalendarnotificationtrigger
- Apple local notification scheduling/cancellation: https://developer.apple.com/documentation/usernotifications/scheduling-a-notification-locally-from-your-app

## Decisions
1. SQLite is authoritative; OS notifications are derived, cancellable state.
2. Native platform pickers, not Google Calendar; no calendar-account permissions.
3. Reminders save when notification permission is denied. Show separate delivery status.
4. Android 13+ requires notification authorization. Android 14+ may deny exact alarms. Do not promise exact delivery.
5. Default to best-effort alarms; do not claim Google Play eligibility for USE_EXACT_ALARM.
6. Recurrence: once, daily, weekly, monthly, yearly. Monthly end-of-month clamps to last valid day; yearly Feb 29 clamps to Feb 28.
7. Completion: one-off closes; recurring advances occurrence. Edit/delete must cancel old OS schedules.
8. Reconcile after permission changes, app restart, timezone changes, and reboot.
9. No cloud backend, push token or internet required.
10. Protect existing memories, photos and unfinished drafts during acceptance.

## Acceptance gates
- SQL migration from r9: retain rows; new due time defaults to 09:00.
- Invalid dates, DST, leap day, month-end, concurrent edits.
- Native pickers on Android and iOS; iOS acceptance pending.
- Airplane-mode delivery with app closed; reboot and notification denial.
- Edit, completion, reschedule and deletion cancel stale alerts.
- **Known gap:** standalone reminders are outside ENG full-backup snapshot. Resolve before release.

## Progress
- r9 standalone reminder CRUD: source implemented; full persistence QA pending.
- Native date/time pickers and SQLite time migration: source implemented, APK QA pending.
- Repeat and offline notification delivery: approved architecture; acceptance pending.
## 2026-10-19 implementation update
- Added repeat enum and pure calendar advancement: src/reminder-recurrence.ts.
- Added native SQLite repeat migration (default once), CRUD persistence and completion advancement.
- Added repeat choices to the Reminders editor.
- Added tests/reminder-recurrence.test.mjs; 2/2 passing.
- TypeScript and lint passed after the changes.
- Recurrence is not yet integrated with OS local notifications.
- Current recurrence advances from last due date; repeated month-end anchors can drift (Jan 31 -> Feb 28 -> Mar 28). Preserve original anchor day in a future migration before declaring recurrence fully accepted.
- r10 build was already underway when recurrence changes were made. Do not assume that APK includes this update without inspecting its bundle.
## r10 local-only security failure and corrective action
r10 Android assembleRelease succeeded, but verifyLocalOnlyRuntime rejected Firebase runtime transitive dependencies introduced by expo-notifications (including firebase-messaging 25.0.1). Build exit 1; APK not accepted or installed. Security gate MUST remain enabled.
Removed expo-notifications from package dependencies and Expo config; retained native date/time picker and recurrence code. Started r11 build with the same verifyLocalOnlyRuntime Gradle gate.
Offline notifications need an implementation without Firebase transitive dependencies (e.g. reviewed native Android AlarmManager + NotificationManager and iOS UNUserNotificationCenter bridge). Do not weaken local-only policy or claim offline alerts are implemented.
## r11 LT1 acceptance evidence
- r11 Gradle build succeeded; verifyLocalOnlyRuntime PASS (216 components, zero Firebase artifacts).
- APK SHA-256 901B7318993E817B9CC5F051015033D52D426ED25E7F56975D74A8F909ED40AF, 45,279,195 bytes; LT1 Tailscale transfer hash matched; adb install -r Success, no app data cleared.
- On LT1 emulator-5580: opened standalone Reminders; native Android date and time picker dialogs opened.
- Created isolated CASITA_R11_REMINDER_QA with Daily repeat at 2026-10-19 09:00. UI reported saved.
- Force-stop/relaunch and reopen: QA record and daily repeat/time persisted.
- Mark Complete advanced next occurrence to 2026-10-20 09:00 and remained active.
- Delete confirmation shown and confirmed; QA record absent; app reported deleted.
- No other saved records intentionally changed. Samsung untouched.
- r11 was built before the later anchor_day source fix; requires r12 rebuild to include it.
- Local notifications, backup coverage and iOS acceptance remain pending.
## r12 checkpoint
- Remote command execution recovered; AI Commander 1.6.0 online.
- Revalidated 277 tests, typecheck and lint, all PASS.
- r12 build started with local-only dependency gate enabled.
- Source audit found missing anchor_day in SELECT used on completion; corrected SELECT and synchronized to WSL while build was in progress. Verify APK bundle reflects correction or rebuild before acceptance.
- Standalone reminder backup/restore and Firebase-free local OS notifications still pending.


## r12 build and LT1 installation
- r12 job 01dd64f9b2b6e4ca exit 0; Gradle assembleRelease and verifyLocalOnlyRuntime PASS, 216 components, zero Firebase artifacts.
- APK 45,279,655 bytes SHA256 ADFBCF28BDF5C7ED15DCB9E6B895C99F16D99B432CBD6EFF7B2F2C68820307CB; Tailscale LT1 SHA256 identical; adb install -r Success.
- UI reminder editor and native Android calendar picker opened. Automated calendar tapping did not establish reliable Jan31 date selection; Jan31-Feb28-Mar31 end-to-end device acceptance OPEN. Source recurrence tests PASS.
- Existing LT1 app data preserved; no physical Samsung, Staging or Production changes.


## r12 LT1 month-end acceptance PASS
- Isolated CASITA_R12_MONTHEND_QA monthly due 2027-01-31 09:00 saved on LT1 emulator-5580.
- First Mark Complete: 2027-02-28 09:00, monthly active; second Mark Complete: 2027-03-31 09:00, monthly active. Confirms persisted anchor_day query in installed r12 APK.
- QA reminder deleted using confirmation; UI reports Reminder deleted and QA title absent. Existing app data preserved.
- Android build local-only gate 216 checked/no Firebase; source tests 277 PASS. Standalone reminders backup and native local notifications NOT YET implemented.


## Post-r12 source hardening (not installed)
- Replaced Date.UTC year-0-to-99 coercion with setUTCFullYear and added zero-padded four-digit output; reject repeat dates beyond year 9999.
- Standalone reminder save validation now uses validReminderDay; typecheck, lint and all three recurrence test groups PASS after fixing test-discovered year padding bug.
- Audited ENG full v3 backup format: serializes EngSnapshot and media, not standalone_reminders_v1 SQLite rows. Standalone reminder loss on restore is a confirmed gap; no claim of backup coverage.
- Added explicit in-app Data Protection warning that standalone reminders are excluded from full/text backups until a verified migration/restore format is implemented. Typecheck and lint PASS.
- Local OS notification scheduling still unimplemented. Do not introduce expo-notifications/Firebase dependency or weaken verifyLocalOnlyRuntime.
- Changes require a later APK and device QA; r12 remains the accepted installed version.


## Reminder backup format design gate
- Existing .cdxe Full v3 stream has JSON EngSnapshot header followed by photo frames. Appending SQLite reminder records would be rejected by the existing trailing-bytes integrity gate; silently extending this format is unsafe.
- Approved implementation direction for next format: versioned .cdxe Full v4 envelope containing both ENG snapshot and standalone reminder records; preflight schema, date, time, repeat, anchor, IDs, duplicates and maximum counts before any mutation. Preserve v3/legacy import compatibility and explicitly disclose their missing standalone reminders.
- Restore must use a consistent snapshot and revision token across ENG and reminder SQLite tables, stage all media, and roll back both datasets on any failure. Do not overwrite existing reminders using current ENG-only restore path.
- Notifications: Android native AlarmManager/NotificationManager, Firebase-free and gated by verifyLocalOnlyRuntime; permission and reboot reconciliation remain pending.
- No backup v4 implementation or device restore acceptance yet. Current v3 remains ENG-only.


## Full v4 validator checkpoint
- Created src/reminder-backup-v4.ts with standalone reminder section version 1 validator, 10,000-record cap, duplicate ID rejection, date/time/anchor/repeat/content/timestamp checks.
- Added tests/reminder-backup-v4.test.mjs for valid section and malformed/duplicate/unsupported records.
- Corrected Node ESM import to explicit .ts suffix after initial module resolution failure; subsequent typecheck/lint PASS and full Linux npm test 280/280 PASS, 0 failed.
- This is an isolated validation module only. Not wired into .cdxe writer/reader, SQLite import, or app UI. No APK built, no restore executed, no device change.


## Full v4 reminder section serialization checkpoint
- Extended src/reminder-backup-v4.ts with bounded UTF-8 encode/decode (5 MB maximum), strict decode and review-count helper. No mutation or SQL restore performed.
- New round-trip/corrupt UTF-8/oversize regression test PASS; 3 reminder-backup tests PASS. Typecheck/lint PASS after preview addition.
- Section codec remains isolated: not yet integrated into .cdxe archive writer/reader or ENG restore. No new APK/device change, no push/deploy.


## Full v4 archive prototype checkpoint
- Added isolated src/eng-stream-v4.ts, distinct CDXE4 magic, bounded reminder section, legacy Full v3 collection/photo payload, and strict Full v4 reader that validates reminders before delegating photo verification to existing Full v3 reader.
- Writer precomputes bounded size and streams photo chunks without buffering entire archive; older Full v3 reader rejects v4.
- tests/full-eng-v4.test.mjs passes round-trip, corrupted reminder section, truncated payload and legacy reader rejection. Full Linux npm test 282/282 PASS; TypeScript/lint PASS.
- Not yet integrated into app Backup & Restore UI, native reminder SQLite snapshot, revision-bound atomic restore, or LT1 APK. No personal data touched.


## Full v4 native export and restore preflight
- Added read-only snapshotStandaloneRemindersForBackup to native reminder SQLite module; preserves recurrence anchor_day and validates exported rows.
- Added pure preflightReminderRestore collision detection and explicit replacement requirement, without writing SQLite.
- Regression test for ID collision and input immutability PASS; Linux full suite 283/283 PASS, typecheck/lint PASS.
- Critical remaining gates: consistent cross-domain snapshot, native v4 SAF integration, atomic recoverable reminder+ENG restore, on-device QA. Do not enable v4 restore until these pass.


## Full v4 compatible archive read checkpoint
- Added read-only openEngStreamCompatible to src/eng-stream-v4.ts; detects CDXE4 and otherwise delegates to existing legacy/v3 parser. Legacy archives return reminders:null, never fabricated reminder data.
- Added Full v3 compatibility test and v4 dispatcher assertions. WSL full suite 284/284 PASS; TypeScript and lint PASS.
- Existing native UI still uses v3 writer/reader and warns standalone reminders excluded. Full v4 native export+restore not enabled. No APK, personal data, commit, push, or deployment.


## Native Full v4 writer integration checkpoint
- eng-runtime.native.ts writeEngBackup now snapshots standalone SQLite reminders, writes CDXE4 via writeEngStreamV4 using SAF, copies to cache and verifies archive source, size, collection header hash and exact reminder section. Existing Full v3 reader retained via compatibility dispatcher.
- pickEngBackup explicitly rejects Full v4 restore before any restore mutation; older v3 restore remains available. eng-screens.tsx now warns v4 restore is not yet enabled, text export excludes standalone reminders.
- WSL typecheck/lint PASS and npm test 284/284 PASS. Native Android APK build and on-emulator SAF roundtrip NOT YET tested. Atomic cross-domain restore, snapshot concurrency and crash/power loss gates OPEN. No physical phone, commit, push or deployment.

