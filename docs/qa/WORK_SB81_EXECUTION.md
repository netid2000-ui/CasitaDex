# WORK-SB81 — CasitaDex linked reminder implementation

November 5, 2026 (America/Chicago) · FA-MAC-DEV-01 · AI Commander · **PARTIAL / release NO-GO**

## Starting point and implementation

- The authoritative Mac checkout and GitHub branch `work/cd-sb41-edit-targeting-20261104` started clean at `cfbd41c2d2221604e10fd3cd35c7852e9584a62d`. Reviewed the master and product charters, Mac-only authority amendment, release SOP, delivery/design procedures, SB76–79 return, functional audit and SB69/SB77 evidence. AI Commander Mac preflight job `7c14f899b358f539`. Existing services and accepted device data were preserved.
- Source commit `63abf3e9d6636fdbc4f7df5d5feb4f23b3e0babf` makes active linked reminders discoverable on the dedicated Reminders screen. Upcoming and past-due calendar dates are presented separately. A row opens the exact saved memory for review, completion or rescheduling. The section uses the stored memory snapshot and offers retry if the snapshot read fails.
- The shared linked eligibility rule omits completed, archived, deleted, demo and invalid-date memories. Past dates remain visible in the list while the native scheduler independently handles deliverability. Existing standalone edit and notification permission paths remain in place.
- Figma authority remains [CasitaDex A.2](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=62-122), with the [reminder surface](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=276-3) and [SB40 responsive review](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=279-38). The source mapping adds the two linked sections and the Details action. The canvas has not been updated. Reminders A.3 Snooze remains outside this implementation.

## Source and build evidence

| Gate | Result |
| --- | --- |
| Focused tests, TypeScript, ESLint, diff | PASS. 8 focused tests, job `3f1323ae9accd8b2`. |
| Full regression | PASS. 348 passed, 5 existing skips, zero failures, job `21ad108e3eec5c77`. |
| Hosted source | PASS. Non-force push and exact remote verification job `349e42a6607559de`. |
| Exact Android QA build | PASS. Build job `c6e69decd82f7eed` archived the source commit before prebuild. 608 tasks, 1m16s Gradle build. APK SHA-256 `d72bae4b25de193c85fbbcb0fed5a4994e42486727416eb73248ecb1283a772f`; npm lock SHA-256 `41f589351110c71dc95d05d90397dcdfd5091d30ed75fff8cb73ba76955fc30a`. |
| Android identity | `com.designsbyfa.casitadex.dev` 0.1.0 (1), target SDK 36, arm64, Android Debug signer. Artifact under `QA-Evidence/WORK-SB81/cd-android-63abf3e/android/app/build/outputs/apk/release/app-release.apk`. |

## Native scope
| Native step | Result and evidence |
| --- | --- |
| Install and isolated device | PASS. Exact hash verified, development package installed on disposable Pixel 7 Android 15/API 35, `emulator-5572`, isolated ADB port 5067. Device fingerprint `google/sdk_gphone64_arm64/emu64a:15/AE3A.240806.043/12960925:userdebug/dev-keys`. |
| Create, group and reopen | PASS. Corrected ADB job `9e2fd47bcf2dc86b` saved synthetic future and past-due memories through the app, showed distinct sections, and found exactly one alarm. Force-stop then app relaunch preserved the row and rearmed one alarm. The first runner `9f340a7bc01d7e8f` selected captions in place of EditText fields. The corrected runner used a fresh AVD without rebuilding the APK. |
| Boot restoration | PASS for a subsequent cold boot. The in-guest reboot check sampled too early to establish a defect: at 15.58 s after boot there was no alarm and the runner exited 1. Follow-up `4c4737ef7f9989cb` started the same disposable AVD and observed the real future alarm at 19.74 s after cold boot, before starting the app or injecting any broadcast. Package state was `stopped=false` and POST_NOTIFICATIONS was granted. This validates cold boot on the tested emulator. The original in-guest reboot remained sampled only in the initial interval. |
| Exact Details, completion and cancellation | PASS in `4c4737ef7f9989cb` (exit 0). The linked list item opened the stored memory with exact answer `Exact future answer` and exact due date `2026-11-06`. Complete removed the active alarm (1 → 0). Reminders displayed the remaining past-due row without the completed future row. |
| Delivery and tap | NOT RUN. The fixture intentionally used a future date. Native permission denial/recovery and notification tap routing are separate open gates. |
| iOS and accessibility | NOT RUN for the changed CasitaDex source. Current-source VoiceOver, TalkBack, 200% text, orientation, theme and keyboard reachability remain open. |

Raw evidence includes `android-linked-retry/linked-sections.{png,xml}`, `alarms-{saved,force-stop-relaunched,reboot-before-launch}.txt` and `run.log`, plus `android-linked-reboot-probe/readback.json`, `alarms-cold-boot-before-launch.txt`, `exact-linked-memory.{png,xml}`, `completed-reminder-removed.{png,xml}`, package/user/broadcast logs and both runners in `QA-Evidence/WORK-SB81`. Android platform behavior reference: [Schedule alarms and restore on boot](https://developer.android.com/develop/background-work/services/alarms#boot).

## CasitaDex workflow matrix

| Workflow | Implementation / integration | Android evidence in SB81 | iOS / accessibility | Remaining |
| --- | --- | --- | --- | --- |
| Home and navigation | Existing actions and dedicated Reminders route | SB81 path from Home to memory and Reminders described above | Current-source iOS and assistive navigation open | Confirm orientation, large text, light/dark and focus |
| Memory and labels | Existing local SQLite save, browse, edit, Find, archive/recover and label management | Synthetic linked memory creation, exact Details and persisted relaunch verified | iOS blocked by native environment diagnostics, full accessibility open | Edit/Cancel/Return, Find/archive/recover, label impact and offline full journey |
| Linked reminders | Added active linked discovery and local-calendar grouping, exact memory entry, shared scheduler eligibility and read retry | See native scope above | Current-source native acceptance and screen reader open | Native delivery/tap, denial/recovery, calendar/timezone and reschedule beyond bounded evidence |
| Standalone reminders | Existing SQLite editor, recurrence and native scheduler | SB77 exact earlier APK evidence retained | Current-source native and accessibility open | Delivery, reboot, date/time/recurrence, dirty cancel and permission reversal |
| Photo memory and viewer | Existing local media, ordering, replace/remove, viewer and sharing | No current-source SB81 acceptance | iOS photo media/XCTest gate and assistive acceptance open | Pick/cancel, five-photo cap, replace, swipe/zoom, return, offline/relaunch and native share sheet |
| Settings, backup and recovery | Existing local preferences, versioned backup and restore preview/conflicts | No current-source SB81 acceptance | Native and accessibility open | Disposable end-to-end export/restore, corruption, conflicts, interrupted write and restored reminders |
| Premium and distribution | Existing fail-closed purchase policy and development-only configuration | Development QA package verified | Native store adapters, trusted proof and release artifacts open | Store configuration, signed artifacts, privacy declarations and owner iPhone signoff |

## Continuation

Reuse the exact debug-signed APK for unchanged-source repeatable Android device checks. Make the notification destination explicit and verify delivery, reschedule, denial/recovery, device clock/time-zone changes and tap routing. Run offline Find/Edit, photo and backup/restore journeys in disposable data. Require a working iOS simulator or supported isolated environment before iOS results can be promoted. Keep final physical iPhone signoff with the owner.

The prior functional audit, Figma map and SB77 build recipe were reused. Source verification preceded one exact build. The Android retry reused the identical APK, corrected only test selectors, and used a new non-fold disposable AVD. Current dependency files were unchanged. Raw screenshots, logs and test runner scripts are on FA-Development at `QA-Evidence/WORK-SB81`. No allowance or savings estimate is available.
