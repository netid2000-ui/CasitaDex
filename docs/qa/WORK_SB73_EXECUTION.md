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
