# CasitaDex SB40 — iOS Native QA on Pinch-Enabled Source 7f5d20c

Date: 2026-11-11 America/Chicago
Result: **iOS bundled Release build PASS; double-tap, Zoom buttons, Reset, and pan at 2× PASS; actual iOS two-finger pinch NOT TESTED**.
Overall release: **NO-GO**; no owner acceptance.

## Source and artifact provenance
- Mac authority: FA-MAC-DEV-01; QA build staged on FA-Development external SSD.
- Source implementation: `7f5d20c350d315317e38c171016d46483a5a2280` (pinch change in `src/eng-screens.tsx`).
- Git branch at execution: `work/cd-photo-gestures-20261111` (HEAD `7b257298583f2b1a9581e5efd905ae651cb9f959` includes documentation, no additional implementation changes after 7f5d20c).
- Isolated iOS simulator UDID: `879C620A-5318-4BDF-98B9-904EE635B053`, iOS 27.0.
- Bundle ID: `com.designsbyfa.casitadex.gestureqa`; accepted owner SB40 install not replaced.
- Bundled Release JS SHA-256: `62b383e9c18405adc1d250f84ffe24a60e559ae16a775c8aea23340ba3dd6044`.
- App directory: `/Volumes/FA-Development/Designs-by-FA/Apple-Builds/CasitaDex/gesture-a1989d8-ios-qa/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app`.
- Fixture: isolated saved `Gesture QA Synthetic Brand Photo`, synthetic image.

## Fresh native verification
- PASS: Xcode Release simulator build with embedded JavaScript; installed and launched under separate bundle ID.
- PASS: Maestro Find → synthetic Memory Details → photo viewer opens with `Zoom 1 times`.
- PASS: double-tap 1× → 2× → 1×. Evidence `ios-source-7f5d20c-doubletap.log`.
- PASS: Zoom In 1× → 2× → 3× → 4×; Reset Zoom → 1×. Evidence `ios-source-7f5d20c-bounds.log`.
- PASS: one-finger pan at 2×. Zoom remained 2× after swipe; 3,599 sampled screenshot pixels in the photo region showed 68.60% changed, mean RGB delta 0.20777. Evidence `ios-7f5d20c-pan-before.png`, `ios-7f5d20c-pan-after.png`, `ios-7f5d20c-pan-drag.log`.
- Not verified: actual two-finger iOS pinch. `mobilecli` pinch returned an accepted tool command in an earlier attempt but the foreground app was on the simulator Home screen; WebDriverAgent timed out. No reliable in-app two-finger pinch motion reached the tested viewer and no native zoom assertion was recorded.
- Not verified: photo swipe across 2–5 photos, pinch and pan combination, VoiceOver, large text, user physical iPhone.

## Android parity already verified (other checkpoint)
- Clean Android source 7f5d20c: genuine pinch-out 1× → 1.2×, pinch-in 1.2× → 1×, 4× clamp, pinch-in 4× → 3.4×; evidence in `SB40_ANDROID_NATIVE_PINCH_ACCEPTANCE_20261111.md` (commit `9f61cdb`).
- Follow-up Android double tap 1× ↔ 2×, pan 2× and Reset pass, `SB40_ANDROID_CLEAN_PINCH_REGRESSION_20261111.md` (commit `7b257298`).

## Design/release guardrails
- Figma gesture spec `1018:134` is REVIEW, not owner-approved: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134
- Source isolated Photos tab remains older than accepted SB40 photo gallery. Must reconcile before promoting to native accepted baseline.
- Physical Samsung and owner iPhone acceptance pending. No release merge, production writes, store submission or accepted QA binary replacement.
- Remaining native gate: qualify an actual iOS two-finger gesture via a reliable XCUITest/Simulator control, then confirm pinch-out/in and zoom bounds. No repeated unfounded PASS from tool-command success.
