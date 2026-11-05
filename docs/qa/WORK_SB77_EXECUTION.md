# WORK-SB77 CasitaDex functional completion and current Android checkpoint

November 5, 2026 (America/Chicago) · FA-MAC-DEV-01 · AI Commander · **PARTIAL / release NO-GO**

## Source and changes

Started at clean `718a47bc1e779a7b01bc7af50f66d44cf35ec5b2` on `work/cd-sb41-edit-targeting-20261104`. The [functional architecture audit](CASITADEX_RELEASE_FUNCTIONAL_ARCHITECTURE_AUDIT.md) extends the SB73 matrix and SB47 source map. Figma A.2 baseline and SB40 responsive review were read only; the A.3 reminder proposal remains in review.

Commit `25ef5fc0365499cad1a351e587e5fd721f31f3ec` removes the obsolete Home reminder preview. The Reminders route still supplies the list and create entry. A committed store operation whose subsequent snapshot read fails now reports that the change was saved locally and instructs reopening to confirm, instead of overwriting that failure with a normal success message. The old source did not throw from `refresh`, so `run` previously masked this case.

A follow-on commit (see branch HEAD) chooses the next local 9:00 AM occurrence as the initial due date for a new standalone reminder. Previously a reminder opened after 9:00 AM with today's 9:00 AM prefilled; saving it produced a valid local row but the projection intentionally skipped the past alert. Edit of an existing reminder retains its stored date and time. This small change does not add snooze or alter the approved recurrence model.

## Checks

- For `25ef5fc`: TypeScript and ESLint PASS; Node suite **346 passed, 5 skipped, 0 failed**.
- Follow-on due-date fix: focused reminder draft tests **3 passed**, including before 9:00, exactly 9:00 and year rollover; TypeScript, ESLint and `git diff --check` PASS.
- Full native acceptance remains pending for the follow-on commit. The APK below is an exact archive of `25ef5fc`, so it does **not** contain the next-9AM default.

## Android native evidence for `25ef5fc` only

AI Commander build job `729a93745ed3b415` exited 0 on an isolated source archive. Gradle release QA build 608 tasks, `com.designsbyfa.casitadex.dev`, v0.1.0 (1), Android target SDK 36, arm64, Android Debug signer. APK SHA-256 `25fb2f33cdaf72fe64555526a7c600446df61f33906e28cdb3524b7254713477`, at `QA-Evidence/WORK-SB77/cd-android-25ef5fc/android/app/build/outputs/apk/release/app-release.apk`. This is a development QA APK, not a signed store artifact.

The first native job `f02bbb3c7c1b6a61` could not create the disposable AVD: `avdmanager` reported no valid installed image despite SDK files being present. A new AVD configuration was derived from the SB73 disposable configuration **without its userdata**. Retry job `0fd5896d43386420` booted a distinct Pixel 7 Android 15/API35 target with isolated ADB port 5066 and emulator 5570; no accepted device or EC service was touched.

The native UI opted in to notifications, saved synthetic `SB77 Local Alarm`, force-stopped and relaunched the app, found the same row, and marked it complete. Android `dumpsys alarm` active package alarm counts were **1 after save, 1 after process-death relaunch, 0 after completion**; the UI hierarchy contained `Completed`. Readback: `QA-Evidence/WORK-SB77/android-journey/readback.json`; raw `alarm-{saved,reopened,completed}.txt`, `latest.xml`, screenshots and scripts in the same folder. The scripted runner exited 1 only because its assertion searched historical alarm removal records as well as active alarms. The independent audit scoped to active alarms before `Removal history` and passed. This is bounded schedule/persistence/cancellation evidence; it is not delivery, reboot, linked reminder, theme, focus or full accessibility acceptance.

## Open release gates and next work

1. Build and run the follow-on HEAD to accept the corrected new-reminder default on native Android; check dirty Save/Cancel/Back and Home list removal on that exact binary.
2. Exercise linked and standalone due delivery, reschedule, permission denial/recovery, boot restoration, timezone and a notification tap destination on Android.
3. Recover a supported complete iOS Simulator installation on a disposable target, requiring stock screenshot/media import/XCTest before CasitaDex photo, reminder, edit and backup flows. Preserve earlier accepted data.
4. Execute full photo, memory Find and backup/restore journeys on current source at 200% text, light/dark and landscape, with VoiceOver/TalkBack; physical iPhone signoff remains with owner.
5. Native verified purchases, store products, production signing and privacy/store declarations remain blocked; neither app is release qualified.
