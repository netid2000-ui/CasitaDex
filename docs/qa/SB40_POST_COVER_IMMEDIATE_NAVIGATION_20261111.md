# CasitaDex SB40 — Post-Cover Immediate Navigation Fix

Date: November 11, 2026 (America/Chicago)
Execution: FA-MAC-DEV-01 only, external FA-Development SSD
Status: **PASS — immediate Next photo after selecting cover on isolated iOS and Android integrated SB40 QA packages.** Overall app release: **NO-GO**.

## Authority and change
- Owner-accepted baseline remains SB40 four-tab **Your Photos**, not the older Photos interface. Original accepted app/build is untouched.
- Source branch: `work/cd-sb40-photo-gesture-integration-20261111`, starting commit `7199487242cde935529cee3590c85c00908e8811`, derived from approved SB40 source.
- Change `src/photo-memory-viewer.tsx`: after **successful** `Cover photo saved.` or `Photo order saved.`, collapse the expanded photo-management panel and scroll its control ScrollView to y=0. This prevents lower-panel scroll offset from leaving the main Previous/Next controls in an unreliable interaction state.
- On failed save, the panel is NOT automatically collapsed; the error status remains visible. Image order/store semantics, photo selection, zoom, four-tab gallery and backup data are not changed by this patch.
- QA source contract extended in `tests/sb40-photo-gesture-integration.test.mjs` for post-arrange panel collapse and scroll restoration.
- No release merge, store submission, production write, physical-device installation or accepted-app replacement authorized.

## Reproduction before correction
- iOS QA simulator `879C620A-5318-4BDF-98B9-904EE635B053`, app ID `com.designsbyfa.casitadex.sb40gestureqa`.
- Native Maestro sequence: Photos -> seeded synthetic `[SAMPLE] Appliance manuals` -> photo 2 of 5 -> Manage photos -> Use as cover photo -> `Photo 1 of 5 · Cover` -> Next photo.
- **FAIL before fix:** Maestro tap completed but photo remained `Photo 1 of 5 · Cover`. Subsequent tap and scrolling the expanded management panel did not advance photo. Closing/reopening viewer did.
- Evidence: `repro-post-cover-ios-retry.log`, `postcover-scroll-first.log`, native hierarchy `postcover-repro-before-scroll.json`.
- Note: The observation supports the panel-interaction hypothesis, but does not independently prove which low-level hit-testing/scroll behavior occurred.

## Integrated iOS native verification after correction
- Rebuilt Release simulator app in isolated staging project using same `sb40gestureqa` bundle ID; verified embedded JS checksum:
  `a044ddf8f4d7d8b6cb219670e0fec8ad5810de05820a36c183552e303372a10e`.
- Xcode `BUILD SUCCEEDED`, installed only on isolated QA simulator.
- **PASS:** the exact previously failing Maestro sequence from `repro-post-cover-ios.yaml` completed, including photo 1 -> 2 without viewer close/reopen. Evidence `repro-post-cover-ios-after-fix.log`.
- **PASS:** follow-up Zoom In -> Next and Previous navigation checks reached expected photos. The same follow-up's `Move photo earlier` step did NOT show its expected `Photo order saved.` message: viewer instead showed photo 1 with old `Cover photo saved.` status. This is a separate ambiguous test interaction and remains OPEN; do not mark post-reorder navigation or reorder result independently accepted here.
- Full iOS gesture tests from earlier checkpoint remain source-specific to previous package; new change is not yet covered by complete XCUITest pinch/pan retest.

## Android native parity verification
- Built updated isolated Android Release APK `Android-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/sb40gestureqa-postcover-fix.apk`.
- SHA-256 `168b68527ad3a8ac6ac3e44d5919b322ff3f9264a979c9d94a4695794a4d5825`.
- Verified package ID `com.designsbyfa.casitadex.sb40gestureqa` and installed only on non-fold `medium_phone` AVD `emulator-5554`.
- **PASS:** exact native Android sequence: Your Photos -> seeded synthetic sample -> Photo 2 of 5 -> Manage photos -> Use as cover -> Photo 1 of 5 Cover -> **Next photo immediately -> Photo 2 of 5**. Process exited 0. Evidence `android-postcover-repro.log` and `android-postcover-runtime.xml`.
- No physical Samsung access or installation.

## Source validation
- TypeScript `npm run typecheck`: PASS.
- Changed-file ESLint `src/photo-memory-viewer.tsx`, `src/photo-zoom.ts`: PASS.
- Targeted tests: 17 passed, 0 failed.
- Full `npm test`: 435 total, **429 passed / 0 failed / 6 skipped** (optional fixture skips).
- `git diff --check`: PASS.

## Evidence paths and remaining work
- iOS, Android native QA evidence: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`.
- Isolated iOS build log: `Apple-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/ios-postcover-fix-release.log`.
- Isolated Android build log: `Android-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/gradle-postcover-fix.log`.
- Revalidate Move earlier/later immediately after saving and swipe/zoom after actions collapse, preferably with native instrumentation rather than a scroll-sensitive locator.
- Native accessibility (VoiceOver/TalkBack), large text, photo error and picker cancel, gallery scroll/sort persistence and real backup/restore remain open. Figma corrected SB40 approval and owner final iPhone signoff remain required.
- Both accepted SB40 physical builds and owner data were unchanged. **Release NO-GO**.
