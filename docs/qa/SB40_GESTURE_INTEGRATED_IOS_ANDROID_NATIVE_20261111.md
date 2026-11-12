# CasitaDex SB40 — Integrated Native iOS/Android Gesture Checkpoint

Date: November 11, 2026 (America/Chicago)
Status: **Isolated integrated iOS and Android native builds PASS, scoped gesture acceptance PASS; full integration and release remain NO-GO.**

## Immutable authority, provenance and guardrails
- Authoritative accepted SB40 source base: `35e411eeb3757486b7a64432b6ecb24c9faf4823`, from owner-approved 4-tab source worktree. No accepted app binary, owner iPhone, physical Samsung, or original source checkout was changed.
- Integrated gesture source implementation: `1ec4b7ff3bb15e363e0c25944312754852cff537`, branch `work/cd-sb40-photo-gesture-integration-20261111`; previous native iOS gallery checkpoint `09b9320c3aa08dbc0de575dd8f64941a86996370`.
- All builds on `FA-MAC-DEV-01`, external `FA-Development` SSD. Separate QA bundle/package **`com.designsbyfa.casitadex.sb40gestureqa`** for both platforms.
- Design references: Figma corrected owner-approved SB40 Page 47, and gesture specification Page 49 review board https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134 . The gesture design remains REVIEW and requires owner approval.

## Isolated iOS Release artifact and native tests
- Xcode Release build PASS, installed and launched on dedicated simulator `879C620A-5318-4BDF-98B9-904EE635B053`, iOS 27.0.
- Embedded JS bundle SHA-256: `fa7cc59d9d854d0b73b22674b5dc33f815e1351f097ab77c4bef04f70ef20587`.
- PASS: accepted 4-tab Home/Photos/Reminders/Find and `Your Photos` gallery, as reported in `SB40_PHOTOS_GESTURE_INTEGRATED_IOS_NATIVE_20261111.md`.
- PASS: native two double-taps on the actual photo view toggle from 1× to zoomed (Zoom photo out enabled) and back to 1× (Zoom photo out disabled), both states confirmed from native accessibility hierarchy.
- PASS: real two-finger **XCUITest** pinch outward on the approved SB40 viewer enables Zoom Out. Pinch inward with scale 0.25 and negative velocity returns to **1×** (Zoom Out disabled). Reset photo zoom control remains available and leaves zoom at 1×. Temporary isolated XCUITest target `GestureIntegrationUITests` in staging Xcode project; no product Xcode project modification.
- Stricter XCUITest `testSB40ApprovedPhotoNativePinch`: **TEST SUCCEEDED**, 1 case passed in 13.770 seconds, exit 0; saved result bundle `integrated-pinch-strict.xcresult` and log `ios-integrated-pinch-strict.log`.
- Reusable QA-only Swift test source committed under `qa/ios-ui/SB40GestureIntegrationUITests.swift`. It is not automatically wired into production builds.

## Isolated Android Release artifact and native tests
- Gradle `assembleRelease` PASS: 655 tasks, Android API 36, non-fold `medium_phone` AVD, emulator serial `emulator-5554`.
- APK path: `Android-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/sb40gestureqa-1ec4b7f-release.apk`, SHA-256 `b7fab4c2c7f83f81f4a03fa9ad070359c46d90a451d174e3b8d530231c815b2d`.
- PASS: APK identity `com.designsbyfa.casitadex.sb40gestureqa` verified, separate package installed and launched without replacing owner SB40.
- PASS: native accessibility hierarchy contains Home/Photos/Reminders/Find. Photos screen is **`Your Photos`** with Add Photo Memory, Grid, Compact, Recently updated, Recently added and 3 synthetic/sample seeded photo memories. It does not use the obsolete Photos with a purpose screen.
- PASS: open sample photo from grid to approved SB40 viewer, with Close/Previous/Next/Reset photo zoom/Zoom photo out/Zoom photo in/Manage photos controls.
- PASS: actual ADB double-tap on photo shows Zoom Out disabled → enabled; second double-tap returns Zoom Out disabled at 1×.
- PASS: macOS Android Emulator Command two-finger pinch-out performed inside visible image and toggled Zoom Out disabled → enabled, viewer retained. Pinch-in command delivered but Zoom Out remained enabled; decrease was **not quantified**, so integrated Android pinch-in 1× boundary is still unverified.
- PASS: Reset Zoom control returns Zoom Out disabled (1×).
- PASS: one-finger pan after zoom-in retained viewer and enabled Zoom Out; native screenshot comparison of 5,092 sampled pixels in photo region shows **70.90% changed**, mean RGB delta 0.25056. The sample image itself is visually distinct; photos/data remain synthetic.

## Source-level tests and limits
- Integrated source `npm test`: **435 tests / 429 passed / 0 failed / 6 skipped**; TypeScript PASS; lint on changed files PASS; approved source retains pre-existing unused-function lint warning in untouched eng-screens.tsx.
- The newly integrated native tests concern single-photo seeded memories and the app controls. Do not substitute previous separate gesture-branch five-photo QA for integrated SB40-native five-photo acceptance.
- Source-level native functionality is not equivalent to full platform accessibility acceptance.

## Evidence directories
- iOS `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`: `ios-integrated-doubletap-ui.json`, `ios-integrated-doubletap-reset-ui.json`, `ios-integrated-pinch-strict.log`, `integrated-pinch-strict.xcresult/`, gallery logs and snapshots.
- Android in same QA directory: `android-home.xml`, `android-photos.xml`, `android-viewer.xml`, `android-doubletap-ui.xml`, `android-doubletap-reset-ui.xml`, `android-integrated-before-pinch.xml`, `android-integrated-after-pinch.xml`, `android-integrated-after-pinch-in.xml`, `android-integrated-after-reset.xml`, `android-integrated-pan-before.png`, `android-integrated-pan-after.png`, `android-integrated-pan.xml`.
- Build logs: `Apple-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/ios-release.log` and `Android-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/gradle-release.log`.

## Next gates before any accepted SB40 promotion
1. Integrated SB40 five-photo navigation/sort persistence, cover/reorder, remove/replace negative paths, gallery scroll-origin restoration, real large-text and VoiceOver/TalkBack native acceptance, zoom at 4× pan bounds and orientation.
2. Quantify integrated Android two-finger pinch-in at 1× bound. Run any additional real photo-state tests using distinct synthetic images on isolated QA app only.
3. Figma source/screenshot reconciliation with owner-approved SB40 Page 47, review Page 49, and explicit owner visual approval. Avoid withdrawn Page 45.
4. After simulator/emulator completion: Samsung physical QA and owner iPhone final signoff. Release merge, production writes, app store submission and live purchases remain unapproved.

**Overall:** Integration advanced materially; **CasitaDex release remains NO-GO.**
