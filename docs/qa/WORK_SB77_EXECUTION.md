# WORK-SB77 CasitaDex functional completion and current Android checkpoint

November 5, 2026 (America/Chicago) · FA-MAC-DEV-01 · AI Commander · **PARTIAL / release NO-GO**

## Source and changes

Started at clean `718a47bc1e779a7b01bc7af50f66d44cf35ec5b2` on `work/cd-sb41-edit-targeting-20261104`. The [functional architecture audit](CASITADEX_RELEASE_FUNCTIONAL_ARCHITECTURE_AUDIT.md) extends the SB73 matrix and SB47 source map. Figma A.2 baseline and SB40 responsive review were read only; the A.3 reminder proposal remains in review.

Commit `25ef5fc0365499cad1a351e587e5fd721f31f3ec` removes the obsolete Home reminder preview. The Reminders route still supplies the list and create entry. A committed store operation whose subsequent snapshot read fails now reports that the change was saved locally and instructs reopening to confirm, instead of overwriting that failure with a normal success message. The old source did not throw from `refresh`, so `run` previously masked this case.

Follow-on commit `80596da4dcc49feb24abde2f09642be0c1fc5e4f` chooses the next local 9:00 AM occurrence as the initial due date for a new standalone reminder. Previously a reminder opened after 9:00 AM with today's 9:00 AM prefilled; saving it produced a valid local row but the projection intentionally skipped the past alert. Edit of an existing reminder retains its stored date and time. This small change does not add snooze or alter the approved recurrence model.

## Checks

- For `25ef5fc`: TypeScript and ESLint PASS; Node suite **346 passed, 5 skipped, 0 failed**.
- Follow-on due-date fix: focused reminder draft tests **3 passed**, including before 9:00, exactly 9:00 and year rollover; TypeScript, ESLint and `git diff --check` PASS.
- The first APK below is an exact archive of `25ef5fc`, so it does **not** contain the next-9AM default. The second APK below contains `80596da` and has bounded native acceptance for the morning default and Home flow.

## Android native evidence for `25ef5fc` only

AI Commander build job `729a93745ed3b415` exited 0 on an isolated source archive. Gradle release QA build 608 tasks, `com.designsbyfa.casitadex.dev`, v0.1.0 (1), Android target SDK 36, arm64, Android Debug signer. APK SHA-256 `25fb2f33cdaf72fe64555526a7c600446df61f33906e28cdb3524b7254713477`, at `QA-Evidence/WORK-SB77/cd-android-25ef5fc/android/app/build/outputs/apk/release/app-release.apk`. This is a development QA APK, not a signed store artifact.

The first native job `f02bbb3c7c1b6a61` could not create the disposable AVD: `avdmanager` reported no valid installed image despite SDK files being present. A new AVD configuration was derived from the SB73 disposable configuration **without its userdata**. Retry job `0fd5896d43386420` booted a distinct Pixel 7 Android 15/API35 target with isolated ADB port 5066 and emulator 5570; no accepted device or EC service was touched.

The native UI opted in to notifications, saved synthetic `SB77 Local Alarm`, force-stopped and relaunched the app, found the same row, and marked it complete. Android `dumpsys alarm` active package alarm counts were **1 after save, 1 after process-death relaunch, 0 after completion**; the UI hierarchy contained `Completed`. Readback: `QA-Evidence/WORK-SB77/android-journey/readback.json`; raw `alarm-{saved,reopened,completed}.txt`, `latest.xml`, screenshots and scripts in the same folder. The scripted runner exited 1 only because its assertion searched historical alarm removal records as well as active alarms. The independent audit scoped to active alarms before `Removal history` and passed. This is bounded schedule/persistence/cancellation evidence; it is not delivery, reboot, linked reminder, theme, focus or full accessibility acceptance.

## Exact follow-on Android native evidence

Build job `fb2ae848f557dd30` exited 0 from an isolated archive of `80596da4dcc49feb24abde2f09642be0c1fc5e4f`. Development QA APK SHA-256 `c34921c7dc095d133e2136161cd94e3f8a1f36e8a2c204cc9046106a45631ebb`, at `QA-Evidence/WORK-SB77/cd-android-80596da/android/app/build/outputs/apk/release/app-release.apk`. This second APK, not the prior one, contains the default-date fix.

The initial native flow `8739845f18b0157d` exited 1 because the disposable emulator shell refused a requested timezone property change. No production or accepted device settings were touched. Retry `5c62827f156c300c` exited 0 without changing the device timezone. At **08:39 CST**, native Add Reminder displayed **Due: 2026-11-05 at 09:00**, the next local 9 AM. It saved a synthetic `SB77 Next Morning` row; Home did not display the reminder list/title; returning to Reminders displayed the saved row. Captures `android-default/default-next-morning.png`, `reminder-saved.png`, `home-no-reminder-list.png`, XML and scripts are in the same evidence root. The after-9-AM rollover is tested in the pure focused test, not native on this morning device run. Dirty Cancel/Back and actual notification delivery remain open.

## Open release gates and next work

1. Check dirty Save/Cancel/Back on the exact HEAD Android binary; repeat a later-than-9-AM native default scenario on a disposable clock or real device without changing accepted data.
2. Exercise linked and standalone due delivery, reschedule, permission denial/recovery, boot restoration, timezone and a notification tap destination on Android.
3. Recover a supported complete iOS Simulator installation on a disposable target, requiring stock screenshot/media import/XCTest before CasitaDex photo, reminder, edit and backup flows. Preserve earlier accepted data.
4. Execute full photo, memory Find and backup/restore journeys on current source at 200% text, light/dark and landscape, with VoiceOver/TalkBack; physical iPhone signoff remains with owner.
5. Native verified purchases, store products, production signing and privacy/store declarations remain blocked; neither app is release qualified.
