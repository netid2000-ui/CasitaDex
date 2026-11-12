# CasitaDex SB40 — iOS Native Pinch Acceptance on Source 7f5d20c

Date: November 11, 2026 (America/Chicago)
Result: **PASS — genuine iOS two-finger pinch outward and inward on the isolated Release candidate**.
Application release remains **NO-GO** pending owner-approved SB40 Photos parity and other acceptance gates.

## Provenance
- Development/QA authority: `FA-MAC-DEV-01` only; isolated simulator `879C620A-5318-4BDF-98B9-904EE635B053`, iOS 27.0.
- Source implementation commit: `7f5d20c350d315317e38c171016d46483a5a2280`. The current branch contains only subsequent QA documentation, not further app source modifications.
- Installed app: `com.designsbyfa.casitadex.gestureqa`, **not** owner-accepted SB40.
- Bundled Release JS SHA-256: `62b383e9c18405adc1d250f84ffe24a60e559ae16a775c8aea23340ba3dd6044`.
- Synthetic saved fixture: `Gesture QA Synthetic Brand Photo` in isolated QA app data.
- Figma: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134 — design still REVIEW / owner approval pending.

## Real native UI gesture acceptance
- Created a *temporary QA-only* XCUITest target in `Apple-Builds/CasitaDex/gesture-a1989d8-ios-qa/stage/ios/CasitaDexDev.xcodeproj`. The Xcode project change is isolated from the product's accepted project.
- Test suite: `GesturePinchUITests.GesturePinchUITests.testPhotoPinchOutAndIn`.
- Test automated app launch, Find → synthetic memory → Memory Details → Open Photo Viewer, asserted initial zoom 1×.
- XCUITest `photo.pinch(withScale:1.8,velocity:0.7)` targeted the actual accessible *image* rather than the same-named heading.
- **PASS: pinch outward 1× → 4×** (4× maximum clamp), recorded `GESTURE_NATIVE_IOS_PINCH_OUT_ZOOM=4.0`.
- **PASS: pinch inward 4× → 2.4×**, recorded `GESTURE_NATIVE_IOS_PINCH_IN_ZOOM=2.4`.
- Test asserted zoom increases on outward pinch, does not exceed 4×, reduces on inward pinch, stays >=1×, and viewer retains its Close control.
- Xcode result: `** TEST SUCCEEDED **`, test case passed in 15.682 seconds. Detached job exited 0.
- Prior attempt failed because generic accessibility matching selected text heading instead of image, and pinch-in velocity sign was invalid. Fixed the test harness, not app source.
- Native iOS double-tap, button zoom and pan acceptance on same source has separate previous report `SB40_IOS_PINCH_SOURCE_NATIVE_REGRESSION_20261111.md`.

## Evidence
On Mac mini external SSD:
`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-a1989d8-native-20261111/ios-pinch-image.log`
`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-a1989d8-native-20261111/pinch-7f5d20c-image.xcresult/`

Reusable native test file in this branch: `qa/ios-ui/GesturePinchUITests.swift`. It is an example for a temporary QA UI-test target; do not assume the production Xcode project automatically includes it.

## Cross-platform status
- Isolated Android `medium_phone` clean source `7f5d20c`: genuine pinch-out/in, 4× clamp, double tap, pan and Reset PASS in prior report `SB40_ANDROID_NATIVE_PINCH_ACCEPTANCE_20261111.md` and clean-regression report.
- Isolated iOS same source: genuine pinch-out/in, button zoom 1–4×, double-tap, pan and Reset PASS.
- Scope limited to a synthetic one-photo viewer. Five-photo navigation, pan constraints at 4×, orientation, VoiceOver/TalkBack, large text, backup and release QA still require separate gates.

## Governance / next step
- **Do not promote** the isolated gesture branch to accepted SB40: its Photos tab is known to differ from the approved owner screenshots and corrected Page 47.
- Reconcile gesture implementation onto the exact owner-approved SB40 Photos baseline using feature-branch source mapping, then simulator/emulator regression, design approval and physical-device signoff.
- No accepted SB40 app or data modified. No production writes, live purchases, store submission, deployment, merges, or release authorization implied.
