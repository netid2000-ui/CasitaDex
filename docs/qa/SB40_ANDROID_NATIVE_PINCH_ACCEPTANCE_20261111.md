# CasitaDex — Android Native Pinch Acceptance Checkpoint

Date: November 11, 2026 (America/Chicago)
Status: **Android pinch-out, pinch-in, and max zoom clamp PASS on isolated QA release; iOS pinch NOT VERIFIED; overall CasitaDex release NO-GO**.

## Traceable authorities
- Design review specification: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134 (review-only; owner approval pending).
- Source branch: `work/cd-photo-gestures-20261111`
- Exact implemented source commit: `7f5d20c350d315317e38c171016d46483a5a2280`
- Mac mini: `FA-MAC-DEV-01`, external SSD authoritative source and QA evidence.
- Android isolated AVD: `medium_phone`, device serial `emulator-5554`, no physical Samsung involved.
- Android isolated package: `com.designsbyfa.casitadex.gestureqa`.
- Clean release APK: `/Volumes/FA-Development/Designs-by-FA/Android-Builds/CasitaDex/gesture-b1b90e9/gestureqa-7f5d20c-clean.apk`.
- APK SHA256: `545402cd369eb5d5cd59358ff63f72f206aa6373decd66163e7b633679c4c824`.

## Defect and correction
- Initial pure source tests predicted pinch would work, but previous emulator injection showed zoom remained 1×.
- We validated the real Android Emulator GUI multi-touch gesture using the **Command modifier on macOS** and recorded the Android kernel's two simultaneous touch slots.
- Temporary isolated diagnostic instrumented the viewer. A real two-finger event reached React Native: `touchStart n=2 dist=433`. Zoom remained at 1× because `onResponderMove` was not granted on the native ScrollView gesture path.
- The app source now handles `onTouchMove` directly for two-finger distance, while preserving the existing pan, swipe, double-tap suppression, and bounded zoom logic. New regression test checks that multitouch move zooms without `onResponderMove`.
- Temporary diagnostic UI was NOT copied to the committed branch or to the clean QA APK.

## Verified clean native Android test
1. PASS: Android Release APK with exact app ID/source revision built, installed, and launched. Isolated synthetic QA memory opened via Find -> Memory Details -> photo viewer.
2. PASS: genuine Command + mouse multi-touch pinch-out increased reported zoom `1× -> 1.2×`. Evidence: `clean-7f5d20c-pinch-out.xml`.
3. PASS: genuine two-finger pinch-in reduced zoom `1.2× -> 1×`. Evidence: `clean-7f5d20c-pinch-in.xml`.
4. PASS: Zoom In buttons reached 4×; another native pinch-out stayed capped at 4×. Evidence: `clean-pinch-4x.xml`, `clean-pinch-max-clamped.xml`.
5. PASS: genuine pinch-in from the 4× bound reduced zoom to 3.4×. Evidence: `clean-pinch-in-from-4x.xml`.
6. PASS: photo viewer remained open during the pinch scenarios.
7. Source validation: `npm test` 602 total, **597 passed / 0 failed / 5 skipped** (optional archive fixture skips). `npm run typecheck` PASS, `npm run lint` PASS; explicit new test covers `onTouchMove` without JS responder claim.

## Open gates / guardrails
- Native iOS pinch-in/out: **NOT TESTED** on this source SHA. Previous iOS double-tap/pan native acceptance belongs to an earlier SHA and cannot substitute for fresh iOS pinch acceptance.
- Android double-tap/pan were verified on the preceding candidate; additional post-pinch reset regression on this new binary was interrupted (app ended up on Android Home). Process-exit history showed force stops but no recorded crash. Treat that run as NOT VERIFIED, not app PASS or FAIL.
- Android system photo source remains synthetic; no owner photos or accepted app data touched.
- UI full photo-management parity remains BLOCKED: isolated gesture source has the older Photos tab, not owner-approved SB40 Photos. Do not promote to accepted build.
- Device accessibility (TalkBack/VoiceOver), large text, five-photo swipes, bounds when panning at 4×, physical Samsung acceptance, and owner iPhone signoff remain open.
- No release merge, store submission, production writes, purchases, accepted build replacement, or photo deletion authorized.

## Evidence paths
Android QA artifacts and native console traces:
`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-73c88bf-android-20261111/`.
The snapshot and event evidence includes `diagnostic-pinch-before.xml`, `diagnostic-pinch-after.xml`, `touchmove-after.xml`, `clean-7f5d20c-pinch-out.xml`, `clean-7f5d20c-pinch-in.xml`, `clean-pinch-4x.xml`, `clean-pinch-max-clamped.xml`, `clean-pinch-in-from-4x.xml`.

## Recommended next controlled checkpoint
1. Build and install an isolated **iOS bundled Release** candidate from source SHA `7f5d20c` (separate bundle ID) and test real pinch/touch movement with a verified native driver, preserving accepted SB40.
2. Retest Android double-tap, Reset Zoom, and 2× pan on the same clean pinch artifact without overlapping other automation.
3. Reconcile new gesture code with the exact owner-accepted SB40 Photos screen and approved Figma before native promotion.
