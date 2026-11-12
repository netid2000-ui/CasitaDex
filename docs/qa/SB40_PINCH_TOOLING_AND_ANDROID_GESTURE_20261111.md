# CasitaDex — Pinch Acceptance Tooling Investigation and Android Gesture QA
Date: 2026-11-11 America/Chicago
Status: **PARTIAL PASS — Android QA build, launch, double-tap and pan checked; pinch NOT VERIFIED**.
Figma gesture specification (review-only): https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134

## Authority, revision, QA artifacts
- Mac: FA-MAC-DEV-01.
- Source branch: `work/cd-photo-gestures-20261111`, commit `0e33ff68d83b5d1af97e7eb9112d4c7b7b60823b` (clean working tree at entry).
- iOS test device: `879C620A-5318-4BDF-98B9-904EE635B053` iOS 27.0. iOS gestures already checked in prior checkpoint; this run did not establish new pinch acceptance.
- Android emulator: `emulator-5554`, AVD `medium_phone`; Samsung physical `R5GL83X0K3N` was visible in ADB but NOT used.
- Android APK: `/Volumes/FA-Development/Designs-by-FA/Android-Builds/CasitaDex/gesture-b1b90e9/gestureqa-panfix-candidate.apk`
- Android APK SHA-256: `fdeaa08019c408f949201d2147a880b8b6c0168bb1ca183128e6428b3cb91956`.
- App ID `com.designsbyfa.casitadex.gestureqa`, isolated synthetic fixture `GestureQAAndroidSynthetic`; owner-approved SB40 app ID and user memories were not changed.

## Android results
1. PASS: isolated Android Release APK built, ID/hash verified, installed and launched; native accessibility tree contains four tabs.
2. PASS: synthetic brand image selected through Android system photo picker, memory saved and photo viewer opened from Memory Details.
3. PASS: Zoom In button 1× -> 2×, and two consecutive ADB double-tap sequences 1× -> 2× -> 1×. Verified via native uiautomator zoom label.
4. PASS: pan after correction at zoom 2× produced visually different screenshot sample (3,599 pixels sampled; 70.74% changed); same photo and viewer remained at zoom 2×.
5. NOT VERIFIED: true multi-finger pinch. Emulator console accepted MT_SLOT/MT_POSITION_X commands, but `getevent -lt` did not show Y coordinate events; zoom did not change. A revised scaled-coordinate attempt similarly did not change zoom. Android `sendevent` on the isolated virtual multitouch device was denied permission; `adb root` explicitly replied `adbd cannot run as root in production builds`. This is **insufficient valid gesture injection**, not evidence of an app pinch defect.
6. Android Maestro server agent failed initialization; used ADB uiautomator XML and direct touch/screenshot to verify the other behavior.

## iOS instrumentation / limitations
- Isolated iOS QA simulator remained booted and approved SB40 reference simulator was not touched.
- `mobilecli io pinch` returned an accepted command for iOS, but the simulator was on the Home screen rather than photo viewer when checked; Mobilewright WDA agent timed out and interrupted foreground state.
- This cannot qualify pinch. Previous iOS double-tap and pan native PASS from commit `0e33ff6` remain the supported acceptance results.
- No native pinch 1×–4× boundary testing or full multi-touch handoff was completed.

## Next bounded gate
- Use a confirmed functioning two-finger input driver on an isolated QA simulator/emulator, verifying that both distinct touches and axis changes are delivered to the application's photo viewer (not only accepted by tooling). Then test pinch-out, pinch-in, min/max clamps and pan-plus-pinch without swiping to another image. A different emulator image supporting authorized QA input may be needed.
- Only after simulator/emulator gesture acceptance, use physical Samsung QA; owner final iPhone acceptance remains reserved for signoff.
- Separate known issue: source branch's older Photos tab differs from accepted SB40 four-tab Photos design; do not promote this candidate to accepted build.
- No production deployment, store submission, release merge, accepted app installation or user-data mutation performed.

## Evidence on external SSD
`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-73c88bf-android-20261111/` contains native UI XML, screenshot comparisons, and emulator pinch/getevent diagnostics.
Prior iOS logs and screenshots under `QA-Evidence/CasitaDex/gesture-a1989d8-native-20261111/`.

Release: **NO-GO**. Figma design review not owner-approved. Source PASS does not imply native pinch PASS.
