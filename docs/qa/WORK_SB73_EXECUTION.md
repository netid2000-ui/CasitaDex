# WORK-SB73 · CasitaDex workflow integration and native reminders

November 5, 2026 (America/Chicago) · FA-MAC-DEV-01 · AI Commander

**PARTIAL · release NO-GO.** Started from clean hosted checkpoint 759a98651630e9479a4f8f1f58e64d0f377a293c on work/cd-sb41-edit-targeting-20261104. Reviewed product and umbrella charters, release SOP, mobile design/tool governance, SB68–71 return and SB69/SB70 native evidence. Existing accepted data and simulators were preserved.

## Changes and verification

- d01541e7adc00f5afdfd26e5a43512285a1c6899 adds a stable new/edit reminder baseline, scoped tabs and Android Back guards, prevents editing or mutating a second row while the editor is open, serializes operations synchronously, and preserves the editor on write failure. A committed write with failed list refresh gives explicit recovery guidance. TypeScript, ESLint and two targeted tests passed in f225bb9df4193012.
- f906e17bc3e86c66fd7176dacc2912c165ba663d reports photo picker cancellation without claiming the photo was saved or replaced. Reminder denial now exposes native Settings recovery with fallback guidance. TypeScript, ESLint and 346 tests passed, with five existing skips, in d8c2a61c93d05c10.
- The reminder and gallery behavior maps to the approved [reminder surface](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=276-3) and [iOS gallery checkpoint](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=257-98). Changes correct navigation, status, and permission recovery. No design canvas was edited. Native validation of these source changes awaits an updated APK and working iOS test lane.

## Native Android bounded acceptance

Job ae36bb44b8b1d33e booted a new disposable Pixel 7 profile fa_sb73_disposable_api35 on emulator-5570, Android 15/API35, serial mDNS-disabled ADB server 5066, and installed com.designsbyfa.casitadex.dev v0.1.0 (1), APK SHA-256 847195cf4dc30fe8f85e9a7cd2cec3968b780f1a02c4671a98205f1fd3f34977 (source 74bd2bc3d4cdde30e25cf8142eaf52c669733f37). This APK predates the SB73 source changes.

Native UI granted notifications, saved a standalone synthetic reminder, reopened the app after going Home, and marked it completed. AlarmManager showed one package-owned active RTC_WAKEUP at 09:00 after save and after reopen. The initial runner exited 1 because its alarm assertion matched a historical cancellation record. Independent audit cc0fe334bd68d8ed compared the active alarm sections and confirmed active counts 1/1/0, the native UI Completed text, and an explicit alarm_cancelled history entry. These observations verify scheduling and completion-triggered cancellation. Going Home/reopening exercised foreground navigation, while process-death durability remains open.

Raw device screenshots, XML, source runner and alarm dumps are in FA-Development QA-Evidence/WORK-SB73/android-journey. The three captured PNGs include permission-granted, reminder-saved and reminder-reopened. The completed state is retained in latest.xml. Android delivery and reboot were not exercised. The inexact 09:00 alarm window recorded by AlarmManager was approximately 58 minutes on that emulator. The Android lane was released to SB74.

## iOS toolchain status

Read-only job 7286be13197424f3 confirmed selected Xcode 27.2 (27B52), first-launch check exit 0, simctl present and iOS 27.0/27.1 runtimes visible. Neither a search inside the active Xcode and /Library/Developer nor Spotlight located Simulator.app. This confirms the component inventory gap, while the causal connection to SB69's media, screenshot, install and XCTest timeouts remains unknown. Accepted devices were neither reset nor altered, and shared Xcode components were not changed. A complete supported Xcode installation should be validated on an isolated disposable target before repeating stock acceptance. [Apple component documentation](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components)

## CasitaDex functional completion matrix

State is scoped to actual evidence. Historical and earlier-build evidence is not a PASS for newly edited code.

| Module and required behavior | Implementation / data integration | iOS acceptance | Android acceptance | Accessibility | Automated evidence | Defect / release impact / next action |
| --- | --- | --- | --- | --- | --- | --- |
| Home and primary navigation | Implemented local memory/reminder summary, independent screens, persistent local data through SQLite | Earlier limited native evidence | SB70 launch, adaptive tab geometry and native icon evidence | 200% tab geometry verified on earlier APK. Full focus and speech open | TypeScript and lint | Complete VoiceOver/TalkBack and full navigation transition checks |
| Memory add/edit/details, validation, archive/recover and offline | Implemented draft and local revisioned SQLite model with Save, Cancel and retained draft | Prior edit/cancel/details preserved. Exact current app and offline acceptance blocked by simulator | Current exact edit/relaunch/offline journey open | Current workflow traversal open | Store, draft, compatibility and recovery suite | High. Verify fresh create/edit, failure, relaunch and offline recovery without touching accepted data |
| Find, filters and taxonomy | Implemented local search index, categories and spaces, label management and lifecycle filters | Current exact evidence blocked | Current exact end-to-end evidence open | Find and filter navigation focus open | Search/filter and store suites | Verify relaunch, full search and label mutation journey; review whether existing reference/location representations cover approved requirements |
| Photos, viewer, add/replace/remove, order and offline | Implemented SQLite/media-file integration, photo-only memories, local viewer and selected originals for Share. SB73 corrects picker cancellation reporting | Current gallery blocked on media import, screenshot and XCTest | Current full gallery acceptance open | Gesture alternatives exist. Focus and enlarged text open | Viewer math, order and SQLite/media regression suites | High. Verify viewer, ordered replacement, Photos/Details/Share and offline availability. Independent unattached-photo lifecycle needs explicit product/mapping confirmation |
| Standalone reminders | Implemented SQLite create/edit/complete/delete and recurrence. Baseline, draft guard and operation lock corrected | Current app installation blocked | Earlier exact APK verified grant, standalone schedule, foreground reopen and completion cancellation | Permission labels present. Assistive acceptance open | Draft regression, recurrence and projection suites | High. Verify newly edited Cancel/Save/tab guards, process-death, reschedule, delivery and reboot |
| Linked memory reminders | Implemented memory date, completion/reschedule and commit-driven platform reconciliation | iOS UserNotifications bridge built and linked at SB69. Installation and delivery open | Android AlarmManager module built. Linked runtime journey open | Current native linked and denied-state traversal open | Projection and commit signal suites | High. Native linked grant/deny, delivery, completion, date reschedule and reboot remain release gates |
| Settings, labels and backup/privacy | Implemented preferences, taxonomy, local backup, preview/restore/recovery and guarded premium messaging | Exact current acceptance open | Exact current acceptance open | SB70 adaptive navigation evidence; Settings traversal open | Backup/restore and ownership suites | Exercise Settings navigation, privacy controls and disposable restore end to end |
| Premium and release | Purchase and restore are gated pending native adapters and trusted verification | BLOCKED | BLOCKED | Premium screen traversal open | Existing premium safety test | Release NO-GO. Require real sandbox product configuration and verified entitlements |

## Resume

1. Build current CasitaDex source on the established Android QA path, then verify dirty/clean reminder Cancel, Settings recovery, picker cancellation and persistence without data loss.
2. Run a dedicated Android linked/standalone device flow that verifies notification delivery, process death, rescheduling, cancellation and reboot. Account for Android inexact scheduling delays.
3. Recover Simulator components in a separate supported toolchain, require stock I/O and XCTest first, then run product gallery, memory and reminder acceptance. No owner action is needed until physical-iPhone signoff.

## SB85–86 acceptance update · November 5, 2026

Application checkpoint `e281adbdb27c26189fd41014f5edc6bfb2873aec`.
On Xcode 27.2 (27B52), a bounded screenshot of disposable iOS 27.0
device `7DB01BF8-2C97-486A-A908-DA8F9E81FE8C` timed out after 18
seconds (exit 142). Log `QA-Evidence/WORK-SB85/screenshot.log`.
Current-source iOS product acceptance remains BLOCKED. Earlier Android
linked scheduling, cold-boot rearming, exact navigation from the app,
and completion cancellation are retained as scoped evidence. Alert delivery
and tap destination still require an actual posted notification.

| Module | Implementation and durable behavior | Permissions and recovery | Current iOS / Android / accessibility | Next release gate |
| --- | --- | --- | --- | --- |
| Memory, labels and Find | SQLite editing, search, archive and recovery paths exist | Local revision guards | Blocked / full journey open / open | Offline Save, Cancel, Return, archive and relaunch |
| Photos and share | Local media and five-photo policy exist | Picker and user-directed sharing | Blocked / open / open | Import, replacement, viewer, share and offline relaunch |
| Linked and standalone reminders | Local persistence and native bridges exist | Permission and scheduling paths exist | Blocked / prior bounded linked PASS / open | Delivery, tap, deny/regrant, reschedule, time zone and reboot |
| Settings, backup and restore | Preferences and local archive/restore exist | Preview and integrity checks exist | Blocked / open / open | Corrupt-file, interruption and media/reminder restore |
| Premium and distribution | Fail-closed baseline | Trusted sandbox verification open | Open / open / open | Sandbox identities, signed artifacts and owner acceptance |

Earlier automated evidence remains scoped to its recorded source. No new
CasitaDex application changes or test pass were recorded. Release NO-GO.

## SB89 acceptance update · November 5, 2026

**PARTIAL · Release NO-GO.** Source commit
`89d9e21851485cee43b15bd6d8b4af939cac0310` makes Android reminder
notifications open the dedicated Reminders screen. The intent is bound
to the application activity and matches its configured environment
scheme. Notification contents remain generic on the lock screen.

| Gate | Result |
| --- | --- |
| Starting checkpoint | Clean feature worktree and exact GitHub head `7392254520273e27727f9a0e3221ac7730719913`. The separate historical reconciliation worktree had 15 dirty entries and was preserved. |
| Automated | 21 focused reminder and backup tests, typecheck, ESLint and diff check passed. Job `176b4e3aaf586a03`. |
| Android development APK | Exact source archive built successfully in 4m24s, job `265aa4762a0f7b33`. SHA-256 `1c439006129fecfda24f4751ebd6775a58dcfe6abbba19c5ae0b52d502052acd`. Package `com.designsbyfa.casitadex.dev` 0.1.0 (1), target SDK 36, Android Debug signer, verified in job `335b21a63257c8e0`. |
| Linked delivery, first Android run | Job `5be297885bf6895b` on isolated `emulator-5588`, Pixel 7 Android 15/API 35. Installed exact APK, saved synthetic linked memory, granted permission and observed one pending alarm. At 09:00:41 CST it was still pending with an inexact delivery window of 21m58s. The one-minute observation ended without a posted notification. |
| Linked delivery, adjusted Android run | PASS for a warm app launched from the notification shade. Job `f84ca551a6235dd7` reused the exact APK on a fresh disposable `emulator-5588` AVD. Moving its local clock to 09:25 exceeded the observed inexact window. The OS posted the linked notification. A real tap opened Reminders, and the linked row opened its exact stored answer `SB89 exact reminder answer`. Raw notification dump, screenshots, UI XML, and `readback.json` are in `android-delivery-window`. |
| Standalone delivery after process death | PASS on the same Android APK and disposable `emulator-5588`. Initial job `2ef53cb844810c19` saved and scheduled the fixture. The OS kept the process alive after `am kill`, so that run ended before delivery. Job `796d82df8f59c1d6` reopened the exact stored fixture after a cold emulator boot and verified one active alarm. It ended only the verified disposable app PID without force-stopping its package. After advancing the clock beyond the inexact window, Android posted the standalone notification, a tap opened Reminders, and the exact stored note `SB89 exact standalone note` was visible. Evidence is in `android-standalone-retry`. |
| iOS infrastructure | Xcode 27.2 (27B52), Aqua console and CoreSimulator available. Fresh iPhone 17 / iOS 27.1 creation failed as incompatible in `1826823f9f2a6690`. Fresh supported iPhone Duo `E346A7C2-DFD7-4251-91AB-DE40AA74618F` booted in 21s and launched Settings (`2e61f07a28fbb166`). Photos launch returned FBS code 4 (`6693b121624955db)). Explicit primary display screenshot timed out at 18s (`bdcaf6190e52897e`). Fixture import and installation of an earlier diagnostic app both timed out at 15s (`f688e9c232a3ae3b`, `3b596c7963991c83`). Only the new disposable simulator was shut down after testing. |
| iOS app and accessibility | BLOCKED for iOS app acceptance. No current iOS binary, screenshots or assistive acceptance. Android TalkBack, enlarged text, appearance and orientation acceptance remain open. |

| Module | Implementation and persistence | Permissions and recovery | iOS / Android / accessibility | Remaining release gate |
| --- | --- | --- | --- | --- |
| Home, memory editor, Find and taxonomy | Existing local SQLite memory, revision and draft behavior | Existing local validation and edit guard | Blocked / scoped linked fixture save and readback / open | Full offline Save, Cancel, Return, archive, Find and relaunch journeys |
| Photos and share | Existing local media, five-photo limit and share preview | Existing picker and user-directed sharing | Blocked / open / open | Gallery selection, ordering, replacement, zoom, native share and offline readback |
| Linked reminders | Local memory date and Android notification destination; shared reminder projection | Android grant verified, prior scoped rearm preserved | Blocked / scoped linked delivery, tap and exact readback PASS / open | Denial/regrant, rescheduling, process death, reboot and calendar behavior on current source |
| Standalone reminders | Local SQLite recurrence and Android notification destination | Existing notification permission and operation guard | Blocked / scoped delivery, tap and exact relaunch readback after process death PASS / open | Denial/regrant, reschedule, complete/cancel and reboot before app launch |
| Settings, backup and restore | Existing local archive, restore preview and corruption checks | Existing media ownership and recovery checks; focused automated suites passed | Blocked / current full restore open / open | Disposable end-to-end restore, media and reminder recovery, low storage and interruption |
| Premium and distribution | Existing fail-closed development configuration | Trusted sandbox entitlement and signing dependencies remain | Blocked / development APK verified / open | Sandbox IDs, production distribution, privacy and physical iPhone sign-off |

Evidence remains under `QA-Evidence/WORK-SB89`. This cycle reused the
approved Figma mappings, previous Android fixture runner and earlier boot
evidence, built once from an exact archive, and changed a test input to
account for the observed Android alarm window. Prior tests retain their
original source and artifact scope. No additional owner action is needed
for the remaining engineering checks.

## SB97 reminder evidence

| Workflow | Implementation | Automated | Native iOS | Native Android | Accessibility and release |
| --- | --- | --- | --- | --- | --- |
| Standalone reminder DST validation | SQLite save validates that the selected wall time exists in the device time zone. Notification projection uses the same local timestamp conversion. Ambiguous fall time uses the first occurrence. | PASS, 19 focused recurrence, projection, backup and restore tests. Typecheck and lint PASS. | Open | Current-source validation open. | Native validation announcement and release remain open. |
| Notification permission transition | Existing Reminders permission control and native bridge. | Existing source coverage. | Open | Disposable API 35 job `b48a9c5afb96fb68` verified OS grant, revoke, and regrant and captured a screenshot. This reused the earlier SB89 APK, SHA-256 `1c439006129fecfda24f4751ebd6775a58dcfe6abbba19c5ae0b52d502052acd`. | App UI permission recovery and delivered notification after regrant remain open. |

## SB101 current-source Android candidate

| Workflow | Implementation and persistence | Automated | Native iOS | Native Android | Accessibility and release |
| --- | --- | --- | --- | --- | --- |
| Standalone reminder | Existing SQLite reminder and notification projection from source 172729d61845f4d534bb728d4652656298c7f3e5 | PASS, typecheck and 19 focused recurrence, projection, backup and restore tests. | BLOCKED, Simulator.app absent from selected Xcode. | PASS for save, one active alarm, actual notification after process death and advanced-clock trigger, tap to Reminders, exact persisted title and note. Job 56d9664fa10f1bb7, API 35 emulator-5588. | Current native DST error, Settings recovery, reschedule, cancel, completion, reboot, normal-clock window and assistive tests open. |
| Notification permission | Existing OS authorization and native permission control. | Prior source evidence retained. | BLOCKED | PASS for OS grant, revoke, regrant on current APK in job bf37850ac4a22cb0. A separate fresh target granted permission through the app and delivered a standalone reminder. | In-app Settings recovery after revocation remains open. |
| Memories, photos, backup and restore | Existing local persistence paths retained. | Focused backup and restore tests passed. | BLOCKED | Full current-source native journeys open. | Release open. |

Build job 86923e0e482aeada produced the ARM64 development release-mode QA APK, package com.designsbyfa.casitadex.dev, SHA-256 6e7b99d7bfe73a5c5d86365ec9f99150b612a4609be85a69d2418de55428a6ee, debug signer SHA-256 fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c. Logs, alarm dump, notification dump, UI screenshots and exact readback are in QA-Evidence/WORK-SB101 on FA-Development. The test advanced only the disposable device clock from 08:30 to 09:25. Native linked reminder evidence from the older APK retains its prior scope.

The proposed decode-uri-component 0.5.1 override failed an isolated query-string 7.1.3 test with an ordinary percent-encoded parameter. The shipped dependency chain remains open for remediation through a compatible parent upgrade.
