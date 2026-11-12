# CasitaDex SB40 — Clean Pinch Candidate Follow-Up Native Regression

Date: 2026-11-11 (America/Chicago)
Result: **ANDROID QA REGRESSION PASS (scoped)**; iOS pinch not yet verified; app release NO-GO.

## Authority
- Source implementing native two-finger touch handling: `7f5d20c350d315317e38c171016d46483a5a2280`.
- Existing source/report checkpoint at start: `9f61cdbdb272b811742a77b3db9893ff17fd8447`.
- QA package: `com.designsbyfa.casitadex.gestureqa`, isolated Android emulator AVD `medium_phone` at serial `emulator-5554`.
- Clean APK: `/Volumes/FA-Development/Designs-by-FA/Android-Builds/CasitaDex/gesture-b1b90e9/gestureqa-7f5d20c-clean.apk`.
- SHA-256: `545402cd369eb5d5cd59358ff63f72f206aa6373decd66163e7b633679c4c824`.
- Synthetic-only saved QA memory: `GestureQAAndroidSynthetic`. Approved SB40 app, physical phones and production services remain untouched.

## Prior Android pinch results independently rechecked
On-disk native accessibility XML files for this exact clean APK were read and independently checked:
- `clean-7f5d20c-pinch-out.xml`: zoom 1.2×.
- `clean-7f5d20c-pinch-in.xml`: zoom 1×.
- `clean-pinch-4x.xml`: zoom 4×.
- `clean-pinch-max-clamped.xml`: remains 4×.
- `clean-pinch-in-from-4x.xml`: zoom 3.4×.
All five showed photo viewer still open. This corroborates the separate native gesture evidence already in `SB40_ANDROID_NATIVE_PINCH_ACCEPTANCE_20261111.md`; no duplicate pinch test PASS claimed from invalid console events.

## Fresh regression on same clean 7f5d20c APK
Using only direct ADB QA actions against `emulator-5554`, automatically navigated Find -> synthetic saved memory -> photo viewer, then checked each state in the real Android accessibility XML.
- PASS: initial zoom 1×.
- PASS: double tap -> 2×.
- PASS: double tap again -> 1×.
- PASS: Zoom In control -> 2×.
- PASS: one-finger drag at 2×, still same viewer/photo and zoom remains 2×.
- PASS: sampled photo-region screenshot delta: 3,599 pixels sampled, **70.69% changed**, mean RGB delta 0.24473.
- PASS: Reset Zoom -> 1×.
- Test exit code 0. Evidence log: `clean-7f5d20c-regression-result.log`. Screenshot evidence: `clean-7f5d20c-pan-before.png`, `clean-7f5d20c-pan-after.png`. Reproducible QA-only script: `clean-pinch-regression.py`.
- No app source changes for this follow-up test.

## Tooling qualification (not production test)
- A modern AndroidX UiAutomator 2.3.0 QA-only instrumentation APK built and installed. The legacy runner was incompatible with Android 16; the modern runner was unstable due UI automation service conflicts and ADB resets during self-navigation. Logs exist under `QA-Evidence/CasitaDex/gesture-73c88bf-android-20261111/`. Do not interpret those instrumentation failures as native app pinch defects. Use verified clean GUI pinch evidence above instead.
- Running arbitrary app commands from QA instrumentation and a competing `uiautomator dump` should not be mixed without device/session ownership.

## Open gates
- iOS **native two-finger pinch** on source 7f5d20c — NOT VERIFIED (prior iOS double-tap/pan belong to earlier source).
- Android five-photo swipe and pan-at-4× bounds, TalkBack/VoiceOver, large text and accessibility — not completely accepted.
- Accepted SB40 Photos design parity with this isolated gesture source remains blocked by its older Photos tab.
- Physical Samsung and owner iPhone final acceptance pending after emulator/simulator qualification.
- No merge, store submission, accepted build modification, or production write authorized.

## Evidence location
`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-73c88bf-android-20261111/`
