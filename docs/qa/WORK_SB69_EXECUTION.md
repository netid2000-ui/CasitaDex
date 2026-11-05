# WORK-SB69 · CasitaDex native recovery and local reminder alerts

November 5, 2026 (America/Chicago) · FA-MAC-DEV-01 · AI Commander

**PARTIAL · release NO-GO.** Android local scheduling implementation and regression coverage landed. Stock iOS diagnostics narrowed the native acceptance blockers. Native photo and reminder delivery acceptance remain open.

## Authority and scope

Started on clean CasitaDex branch `work/cd-sb41-edit-targeting-20261104` at hosted checkpoint `19ba955adbaa661f7416eb49b4ca41b27e208667`. Reviewed the SB64–67 return, SB65 build checkpoint, umbrella and product charters, running evidence, and the prior reminder design reconciliation. The [reminder surface](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=276-3) retains the existing opt-in and permission states. No canvas changes. No accepted devices, data, live services or release settings changed.

## Android local reminder scheduling

Commit `3b259f6f307d669d4b8489b6a3177eb9efdb8397` adds the Android side of the local Expo module and shares the existing SQLite/foreground reconciliation path. The bridge uses an explicit opt-in, runtime POST_NOTIFICATIONS permission where required, a local notification channel, inexact AlarmManager wakeups, and an app-private registry for future alarm restoration on BOOT_COMPLETED. A non-exported receiver verifies app-owned IDs, uses generic notification text, and cancels/reschedules by stable PendingIntent identity. No Firebase, exact-alarm permission, push tokens or network dependency was added. Timing may be delayed by Android battery policies. Boot restoration skips already elapsed reminders and depends on Android allowing the package to receive boot broadcasts.

An inexact alarm can remain pending after its target time. The updated projection preserves that exact existing occurrence if the reminder stays active and unchanged. Removed, completed, archived or rescheduled reminders still cancel prior occurrences. A missing native pending occurrence is not recreated after its due time. Automated job `d2e39d6b0814c944` passed TypeScript, lint, Android Expo autolinking and 344 tests, with five existing skips. Native package and emulator evidence are tracked separately in SB70. Scheduling, cancellation, delivery, reboot and permission journeys need device acceptance.

Changed paths include `modules/casitadex-reminder-alerts/android`, the module's Expo platform config, `src/reminder-alerts.native.ts`, `src/reminder-notification-projection.ts` and `tests/reminder-notification-projection.test.mjs`. Expo platform dependency state remains pinned to the existing project lockfile.

## iOS recovery evidence

The active Xcode is 27.2 (27B52), with iOS runtimes 27.0 (24A434) and 27.1 (24A94425). SB65's Duo failed with a runtime build-number parser error and unsuccessful migration. SB69 instead created one disposable iPhone 17e on iOS 27.0, UUID `7DB01BF8-2C97-486A-A908-DA8F9E81FE8C`. The 27.0 probe demonstrates the remaining failures can also occur without the earlier Duo build-number symptom.

| Gate | Result |
| --- | --- |
| Boot/migration, Settings, Photos | PASS, job `4a4f9b0b2e4fac66`. Fresh migration completed in about 20 seconds, and both stock apps returned PIDs. Launch does not establish rendered or accessible UI. |
| Media import and screenshot | FAIL, 20-second step timeouts in `4a4f9b0b2e4fac66`. Retried in `44d943b902b6a8c3` with a verified 64×64 synthetic PNG and 35-second limits. Both steps timed out again, exit 142. No usable screenshot or confirmed import. |
| Stock XCTest/Maestro | FAIL, `d67919a1e6f4a4be`, exit 1 with IOSDriverTimeoutException before flow steps. Only the owned orphan Xcode runner PID 34463 was terminated. Shared driver handed back to SB68. |
| Simulator graphical component | FAIL, `2e1987bf56c8024d`. Standard Simulator.app path absent under the active Xcode, opening exited 1 with Cocoa error 260. Target-only capture and import still timed out. No Simulator.app found within active Xcode or /Library/Developer. This is a tooling integrity lead. Causal connection remains unverified. |
| Native photo and offline acceptance | BLOCKED. Verified photo fixture import and screenshot/XCTest services are required for the planned viewer, zoom, navigation, replacement, sharing and relaunch assertions. |

Raw evidence is on FA-Development at `QA-Evidence/WORK-SB69/`, including `stock-ios270.log`, `stock-media-retry.log`, `stock-with-simulator-ui.log`, `stock-xctest/maestro.log`, runner logs and the disposable device ID. Jobs wrapped individual diagnostics to record step exits, so a wrapper exit of zero does not establish a step pass.

## iOS reminder bridge candidate

Cold Xcode build job `75633873b3a39a0f` uses the SB65 prebuilt source archive at `8a6d3f512ee923bf5f90cd6d81da883ca13cd3e5`, matched npm and CocoaPods lock hashes, simulator Release configuration, development app identity and no signing. This archive includes the iOS UserNotifications bridge and predates the Android module and delayed-alarm projection changes. The job reserves the shared native heavy-compile lock. Logs are in `QA-Evidence/WORK-SB69/ios-build.log`. Build results and native launch evidence, when available, follow below.

## Next actions

Restore or identify a complete compatible Xcode/Simulator installation without altering accepted devices. On a disposable target, require boot migration, Settings and Photos launch, confirmed media import, screenshot and one XCTest handshake before gesture acceptance. Then run the existing photo fixture flow, verify local access offline after relaunch, and exercise granted/denied reminders, delivery, reschedule, cancellation and reboot. On Android use only a dedicated QA AVD and verify both alarm registry and rendered notifications, including reboot and battery-policy timing. No owner action is needed until final physical-iPhone acceptance.

References: [Android alarm scheduling](https://developer.android.com/develop/background-work/services/alarms) and [Android notification permission](https://developer.android.com/develop/ui/views/notifications/notification-permission).
