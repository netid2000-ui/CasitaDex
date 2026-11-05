# WORK-SB65 · CasitaDex local reminder bridge and simulator diagnostics

November 4, 2026 (America/Chicago) · FA-MAC-DEV-01 · AI Commander

**PARTIAL.** Source and automated checks passed for the Firebase-free iOS reminder bridge. Native delivery, photo, offline relaunch and Android scheduling acceptance remain open. CasitaDex remains **NO-GO**.

## Authority and preserved resources

- Started on clean `work/cd-sb41-edit-targeting-20261104` at `45902b3ba8ef0cb9ef6077259980d4d647e78e25`, matching hosted GitHub. Read master and product charters, delivery/design standards, release SOP, SB60–63 return and reminder architecture before editing. FA-Development was mounted, writable and had about 1.6 TiB available.
- Kept accepted simulator `879C620A-5318-4BDF-98B9-904EE635B053`, SB58 simulator `8FA03782-311F-4B4A-B529-1F63D7E9AEF3`, existing app data and Metro untouched. SB64 owned the shared XCTest lane during this stock-service probe.
- CasitaDex [Reminders](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=276-3) and [iOS reminder detail](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=90-181) remain design authority. The existing Reminders page now uses its status area for opt-in and permission feedback. The new control and status variants require native design comparison. No Figma canvas was edited.

## Implementation

Source commit `8a6d3f512ee923bf5f90cd6d81da883ca13cd3e5` adds an iOS-only local Expo module backed by Apple UserNotifications. It requests permission only after explicit opt-in and uses a generic notification title and body to keep memory titles and notes off the lock screen. An Expo app-delegate subscriber supplies foreground presentation options for owned alerts when no other delegate is installed. It leaves an existing app-wide delegate intact. The generated OS requests have no Firebase, APNs registration, push tokens or network dependency.

The serialized reconciliation loop reads committed linked and standalone reminders, compares with native pending requests, and updates only the CasitaDex reminder namespace. Linked reminders are date-only and use 09:00 local time, the existing standalone default. The budget is at most 48 pending requests, reduced by other pending app requests. The bridge reconciles on startup, foreground, opt-in, committed mutation, and restore/recovery. Failed scheduling does not fail the data save. Retries reload current SQLite and native pending state. OS authorization, Focus, presentation policy and delivery timing are independent of saving reminders.

Changed files: `modules/casitadex-reminder-alerts/` module config, podspec and Swift source; `src/reminder-alerts.native.ts`, `src/reminder-alerts.ts`, `src/reminder-notification-changes.ts`, `src/app/_layout.tsx`, `src/eng-screens.tsx`, `src/eng-store.ts`, `src/standalone-reminders.native.ts` and `tests/reminder-notification-projection.test.mjs`. The development-only iOS bridge is optional at runtime. Android and web continue to save reminders with an unavailable-notifications status.

## Results and reproduction

| Gate | Result |
| --- | --- |
| TypeScript, lint and full regression | PASS. Job `4bc1a2b968d64388`, 343 passed and five skipped. New SQLite test shows linked reminder changes signal after durable commit and failed writes do not signal. |
| Expo autolinking and Swift native API typecheck | PASS. Jobs `586fe0669dfb666d` and `ab09419a2a6da900`. Used Xcode 27.2 (27B52) iOS Simulator SDK and existing matching CasitaDex Expo/React frameworks. Compile-time checks do not prove app installation or alert delivery. |
| iOS 27.1 device type validation | The available runtime 24A94425 supports iPhone Duo only. iPhone 17 Pro and 18 Pro attempts returned CoreSimulator code 403, Incompatible device. No devices were created by either attempt. |
| Fresh disposable boot and Settings launch | Partial. Duo `8F7929BB-D472-41C0-9CA0-9D2D3878610E`, job `cab586cc0121f336`. Settings returned PID 59441. Bootstatus logged Data Migration Failed. Screenshot needs an explicit display on Duo. |
| Stock screenshot and Photos import | FAIL. Display 1 capture timed out before photo import, job `7b56908a44391ab2`, exit 142. Separate stock Photos launch returned FBSOpenApplicationServiceErrorDomain code 4 and addmedia timed out exit 142, job `a840111a753760d6`. The job wrapper exited 0 after logging those failed step statuses. No usable screenshot. |
| Exact-source CocoaPods integration | First attempt `6191c0001532a57d` failed on local ExpoModulesCore snapshot compatibility in isolated source. Scoped pod reconciliation retried in `4feee8001adc207a`. |
| CasitaDex product-native photo and offline checks | BLOCKED in this lane. Stock Photos and screenshot failed before app installation. No product smoke, photo replacement gestures, accessibility or offline/relaunch claim. |
| Reminder OS delivery, cancel, reschedule, reboot | NOT RUN. Requires an installed candidate and healthy simulator or device. Android scheduler remains open. |

Raw logs are in `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/WORK-SB65/`. See `automated-final.log`, `swift-typecheck-with-frameworks.log`, `stock-simulator-duo.log`, `stock-photos.log` and `pod-install.log`. The isolated iOS candidate source is under `/Volumes/FA-Development/Designs-by-FA/Apple-Builds/CasitaDex-WORK-SB65/source`.

Next, prove boot migration and stock Photos services on an isolated target, then verify app launch, photo replacement, offline relaunch and accessibility. Build the exact reminder source with its native pod, validate granted and denied permission and linked/standalone delivery in the foreground/background, airplane mode, reschedule, cancellation and reboot. Confirm schedule policy after timezone change without app launch and reconcile foreground disclosure. Implement the Android inexact alarm/boot receiver path with the local-only dependency gate. No owner intervention is needed until final physical-iPhone acceptance.

References: [Apple scheduling](https://developer.apple.com/documentation/usernotifications/scheduling-a-notification-locally-from-your-app), [Apple foreground presentation](https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/usernotificationcenter(_:willpresent:withcompletionhandler:)), [Expo local modules](https://docs.expo.dev/more/create-expo-module/), [Expo autolinking](https://docs.expo.dev/modules/autolinking/).
