# WORK-SB61 — CasitaDex native completion

**Status: PARTIAL.** Development branch `work/cd-sb41-edit-targeting-20261104`; starting checkpoint `8fba66d7a5dee1ee37dababf20fd0fc268a66b6f`. CasitaDex release remains **NO-GO**.

## Preflight and implementation

AI Commander on FA-MAC-DEV-01; authoritative checkout and raw QA evidence on the FA-Development SSD. Reviewed the product charter, local-only reminder architecture, and the prior SB56–59 handoff and SB58 execution report. Preserved the installed apps, both CasitaDex simulators, accepted fixtures, Metro 8081, and the historical dirty candidate checkout. Event Command held the host XCTest/Maestro lane initially; no simultaneous driver jobs were attempted.

Photo replacement already preserved the slot in the SQLite snapshot's `memory.mediaIds`. However, the photo manifest removes the old record and appends the new one. Using manifest order for rendering moved the replacement to the end after Save. Photos, photo-memory cards, Details, both saved-photo viewers, and Share now resolve referenced photos in memory order. The projection excludes unattached and foreign records. Existing draft order and persisted format are unchanged. A real store regression adds photos across two memories, replaces the first slot, reopens the store, and checks order, replacement bytes, and Share order.

Figma traceability: [Photos gallery/detail frames](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=257-98) and [gallery detail](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=257-112), with the existing [source mapping](WORK_SB47_FIGMA_SOURCE_MAP.md). This correction stabilizes the sequence displayed by those surfaces and introduces no new visual design. New screenshot-based parity remains pending.

| Gate | Result |
| --- | --- |
| Mac source test suite | PASS: 342 passed, 5 skipped, 0 failures |
| TypeScript / lint / whitespace | PASS; corrected pre-existing array type lint in photo viewer helper |
| Photo replacement order and private bytes after store reopen | PASS in SQLite-backed automated regression |
| Photo viewer gestures and actual picker/attachment | Native acceptance open; existing pure navigation, swipe, and zoom tests pass |
| Save/Cancel/Details/Relaunch | Prior acceptance retained; this patch did not edit form save, cancel, navigation guard, or durability paths |
| Linked and standalone notification permission/delivery/reboot | BLOCKED: no authoritative local OS module in installed binary |
| Offline native create/edit/search, enlarged text and responsive checks | OPEN; no current end-to-end acceptance inferred from store tests |

Automated evidence: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/WORK-SB61-20261104/automated.log`.

## Notification architecture decision

The product charter explicitly requires no Firebase. The r10 dependency audit in [the architecture record](casitadex-reminders-native-architecture-20261019.md) rejected the historical candidate because Expo Notifications introduced Android Firebase Messaging 25.0.1. That candidate's scheduler also reads standalone reminders only. Do not copy it or weaken `verifyLocalOnlyRuntime`. The authoritative app has no native adapter and no scheduler wiring; the pure unified projection remains available and passes tests.

Use a local [Expo module](https://docs.expo.dev/modules/get-started/) built in an isolated checkout, backed by [UNUserNotificationCenter](https://developer.apple.com/documentation/usernotifications/scheduling-a-notification-locally-from-your-app) on iOS and [inexact AlarmManager alarms](https://developer.android.com/develop/background-work/services/alarms) with NotificationManager on Android. Keep SQLite authoritative; load the latest committed linked and standalone data inside a serial reconcile queue. Reconcile on foreground/permission change and after committed edits/completions/restores. Read platform pending state, cancel only the projection's owned namespace, retry from refreshed inventory after partial failure, and separate record save from permission/delivery status. Android needs a private alarm receiver and a tested reboot reconciliation mechanism; avoid exact-alarm privileges. Validate linked date-only time and pending-cap policy before wiring; test permission denial, airplane mode, edit, cancel, reboot, and timezone changes on both platforms. Validate clean Android dependency graph and actual iOS/Android installation before enabling delivery. No alert delivery claimed in SB61.

## Native retry and recovery checkpoint

| Item | Evidence |
| --- | --- |
| Device / toolchain | CasitaDex SB58 Fresh Disposable QA `8FA03782-311F-4B4A-B529-1F63D7E9AEF3`, iOS 27.0; Xcode 27.2 (27B52), Maestro 2.12.1, OpenJDK 21 |
| Installed development build | `com.designsbyfa.casitadex.dev`, v0.1.0/build 1 from SB58; no reinstall/rebuild during SB61 |
| Raw logs | `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/WORK-SB61-20261104/disposable-retry.log` and `disposable-smoke/.maestro/tests/2026-11-04_231216/` |
| Reproduction | Verify Metro 8081 returns `packager-status:running`; on the disposable UDID, open the dev-client URL and import SB58's two synthetic PNGs with `simctl`; run `.maestro/casitadex-native-smoke.yaml` with `--reinstall-driver` and `MAESTRO_DRIVER_STARTUP_TIMEOUT=75000` |
| Result | AI Commander job `8d8e776483a3c28a` exited 1. URL and Photos import reached their 12-second bounds (exit 142); import result unknown. XCTest runner logged only its invocation and the driver status check repeatedly failed to connect to `127.0.0.1:61479` before `IOSDriverTimeoutException`. No Maestro steps ran. |
| Screenshot | `disposable-before.png` is a valid 1206×2622 screenshot showing SpringBoard and the CasitaDex Dev app icon. Capture command timed out after writing it; post-retry capture timed out without usable evidence. Neither is in-app QA. |
| Preservation | Reinstalled only the harness on the disposable target. Stopped only this job's still-running XCTest child (PID 46901); confirmed no remaining target XCTest process. No simulator erase, app uninstall, data reset, or Metro change. Released the shared lane to Event Command scale QA. |

The run localizes the current blocker to device services/test harness startup before application interaction: Metro responded, the device reported Booted, and Event Command used the host harness lane before this run. Exact root cause remains unproven. Keep the accepted device `879C620A-5318-4BDF-98B9-904EE635B053` untouched. Next, allocate a fresh disposable iOS 27.1 target, confirm SpringBoard launch, screenshot, photo import, and a minimal XCTest/stock-app smoke before installing CasitaDex. Compare device logs with the working Event Command target without modifying it. Then validate the existing photo viewer flow with synthetic distinguishable photos, add replacement and picker cancellation/recovery assertions, and capture gestures/landscape/text evidence. Build the Firebase-free notification adapter and Android parity in separate lanes. The iOS defect and unavailable notification delivery are release blockers; owner action is reserved for final physical-iPhone acceptance.
