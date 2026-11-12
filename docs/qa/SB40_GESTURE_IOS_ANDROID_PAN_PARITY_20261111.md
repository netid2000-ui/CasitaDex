# CasitaDex SB40 — Isolated iOS/Android Gesture Parity Checkpoint

Date: November 11, 2026 (America/Chicago)
Status: **Double-tap and bounded one-finger pan PASS on isolated iOS simulator and Android emulator; pinch remains NOT VERIFIED; release remains NO-GO.**
Figma gesture review (not approved): https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134

## Source authority and change
- Repository: netid2000-ui/CasitaDex
- Feature branch: `work/cd-photo-gestures-20261111`
- Starting checkpoint: `73c88bfe9a19ebbe2963b781d553c388f9c55348`
- Correction: the viewer outer ScrollView is disabled when zoom >1×; the nested image gesture container claims the initial one-finger responder when zoomed, so panning is not swallowed by parent scrolling.
- Changes confined to `src/eng-screens.tsx`; no accepted SB40 code or native package was overwritten.

## Android native QA
- Machine: FA-MAC-DEV-01.
- QA emulator: `emulator-5554`, AVD `medium_phone`, Android API 36, non-fold phone.
- App ID: `com.designsbyfa.casitadex.gestureqa`.
- Isolated QA APK: `/Volumes/FA-Development/Designs-by-FA/Android-Builds/CasitaDex/gesture-b1b90e9/gestureqa-panfix-candidate.apk`
- APK SHA-256: `fdeaa08019c408f949201d2147a880b8b6c0168bb1ca183128e6428b3cb91956`
- Fixture: synthetic brand image attached to locally saved `GestureQAAndroidSynthetic` memory.
- PASS: APK built, package verified, installed, launched and viewer opened via Find -> Memory Details.
- PASS: Zoom In button from 1× to 2×.
- PASS: Double tap 1× -> 2× -> 1× via two ADB touch sequences, confirmed from live Android accessibility XML.
- FAIL in earlier APK: pan screenshot before/after at 2× was byte-identical (no visible movement).
- PASS corrected APK: one-finger drag at 2× produces different full screenshots. In the sampled photo area, 3,599 pixels sampled with 70.74% changed; viewer remains open, same saved photo selected, zoom stays 2×. Both PNGs saved to QA evidence directory.
- Android Maestro agent would not initialize; native Android uiautomator hierarchy and direct ADB touch/screenshot used.
- Pinch NOT VERIFIED: emulator-console sent MT slot commands; Android getevent log showed slot tracking/X events but lacked Y events, and app zoom did not change. Treat gesture input as not qualified, **not as a verified app pinch failure**.

## iOS native QA
- Simulator: `879C620A-5318-4BDF-98B9-904EE635B053`, CasitaDex FigmaFirst Isolated QA, iOS 27.0.
- App ID: `com.designsbyfa.casitadex.gestureqa`.
- Bundled Release main.jsbundle SHA-256: `8b0c6fe32d176fc75405e2904e006285932fc2a548921d95410f7e13fc50754b`.
- Synthetic QA memory: `Gesture QA Synthetic Brand Photo`.
- PASS: Zoom In to 2×; one-finger Maestro swipe across photo region keeps zoom 2× and viewer open. 3,599 pixels sampled from before/after screenshot photo area; 68.60% changed, mean RGB delta 0.20777.
- PASS after correction: Double tap 1× -> 2× -> 1× via Maestro, preserving previous native acceptance.
- Pinch NOT VERIFIED using a reliable two-finger simulator driver.

## Source QA
- `npm test`: 602 total; **597 passed, 0 failed, 5 skipped** (optional archive fixtures).
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `git diff --check`: PASS.

## Evidence
- iOS path: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-a1989d8-native-20261111/` contains `ios-panfix-before.png`, `ios-panfix-after.png`, `ios-panfix-drag.log`, `ios-doubletap-after-panfix.log`.
- Android path: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-73c88bf-android-20261111/` contains `panfix-before.png`, `panfix-after.png`, `android-panfix-after-ui.xml`, `android-panfix-doubletap-2x.xml`, `android-panfix-doubletap-1x.xml`, `source-regression-panfix.log`, and emulator pinch/getevent diagnostics.
- Staged isolated build and simulator artifacts on external SSD.

## Outstanding gates / safety
- Complete VALID two-finger native pinch-out/pinch-in and 1×-4× bounds testing. Do not claim pinch PASS from pure state-unit tests or invalid console injection.
- Confirm pan boundaries across axes and reset, 5-photo navigation/swipe, accessibility/large text/VoiceOver/TalkBack, and Android/iOS visual parity.
- The older Photos-tab layout in this isolated source differs from owner-approved SB40; must reconcile accepted baseline before a candidate can be promoted.
- Physical Samsung and owner iPhone signoff NOT TESTED. Do not submit, merge, deploy, or replace accepted SB40. QA memory/media is synthetic and in separate `gestureqa` application only.
