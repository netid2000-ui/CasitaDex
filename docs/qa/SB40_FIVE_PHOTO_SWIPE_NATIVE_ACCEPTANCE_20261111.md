# CasitaDex SB40 — Five-Photo Viewer and Native Swipe Acceptance

Date: November 11, 2026 (America/Chicago)
Status: **Isolated Android and iOS five-photo navigation / swipe acceptance PASS (scoped). Accepted SB40 build and full Photos/Figma parity remain NO-GO.**

## Authority, design and safe boundaries
- Native build and QA authority: `FA-MAC-DEV-01`; source and builds on external `FA-Development` SSD.
- Feature branch: `work/cd-photo-gestures-20261111`; implementation builds on accepted gesture implementation commit `7f5d20c350d315317e38c171016d46483a5a2280` and last verified HEAD `8b172663f9edd66f0d75cc74cbe252d6e7898601` before swipe-fix change.
- Current change: direct single-touch `onTouchEnd` horizontal swipe recognizes deliberate photo navigation at 1×; removes duplicate navigation from responder release. Multi-finger pinch and pan suppression remain.
- Figma gesture **review-only** board: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134
- Owner-approved SB40 Photos source reference: isolated worktree `Development/CasitaDex/sb40-authority-source-20261108` at `35e411e` contains `src/app/photos.tsx` and `src/figma-first/FigmaPhotos.tsx`, plus `src/app/_layout.tsx` maps /photos to Your Photos. This is NOT the older Photos tab currently implemented in gesture feature branch. The accepted SB40 iPhone app/build must not be replaced or modified.

## Five-photo fixture and limit
- Both isolated QA app IDs: `com.designsbyfa.casitadex.gestureqa`, not accepted SB40.
- Android AVD: `medium_phone`, `emulator-5554`; synthetic saved memory `GestureQAAndroidSynthetic`.
- iOS simulator: `879C620A-5318-4BDF-98B9-904EE635B053`, iOS 27.0; synthetic saved memory `Gesture QA Synthetic Brand Photo`.
- Added four synthetic image attachments through each platform's real native photo picker to the existing one-photo QA memory. The test reused synthetic imagery; it verifies photo count/order/navigation, not unique visual content or production photos.
- Android and iOS both display saved photo 5 and `Five photos attached. Remove a photo before adding another.` The Android native accessibility tree shows Add a photo disabled at five.

## Previous/Next and zoom reset
- Android native five-photo run exit 0: photo 5→4→3→2→1, then photo 1→2→3→4→5; disabled Next at 5, disabled Previous at 1 (native enabled state); changing photo resets zoom 2×→1×; Close photo returns to original Memory Details and same saved QA memory. Evidence `five-viewer-acceptance-result.log`.
- iOS Maestro five-photo flow: 5→4→3→2→1→2→3→4→5; zoom reset when navigating; Close returns to Memory Details. The last assertion for visible title failed due scroll/viewport even though the full iOS accessibility hierarchy still contained `Gesture QA Synthetic Brand Photo` on Memory Details. Distinguish the offscreen title visibility issue from wrong navigation. Evidence `ios-five-viewer-acceptance.log`, `ios-five-after-close-hierarchy.json`.

## Defect found: horizontal swipe at 1×
- Initial iOS native test on previous gesture branch: swipe left while on photo 1 of 5 stayed on photo 1 (FAIL); screenshot/accessibility hierarchy confirmed.
- Fix in `src/eng-screens.tsx`: handle single-finger horizontal swipe in `handlePhotoTouchEnd` with existing `photoSwipeStep` 60px horizontal/vertical ratio and zoom guard, so navigation still works if native ScrollView does not grant `onResponderRelease`. Avoid double navigation from onResponderRelease. Preserve double-tap/pinch and pan behavior.
- New source regression in `tests/accessibility-feedback.test.mjs` invokes touch-start / touch-end without responder-release, verifies the five-photo gallery advances and preserves the existing native pinch regression.

## Fresh corrected native acceptance
- iOS rebuilt isolated Release with bundled JS SHA-256 `13261a927de837aa269872e9ae8ae10d28a06fbf30ffa9cffe56d5a53acefb92`. Installed separately under gestureqa bundle ID.
- iOS Maestro PASS: at 1× left swipe photo 1→2; at 2× left swipe stays on photo 2 and remains at 2×; Reset zoom then right swipe photo 2→1 at 1×; Close returns to Memory Details. Evidence `ios-five-swipe-after-fix-regex.log`; test exit 0.
- Android rebuilt isolated Release APK `Android-Builds/CasitaDex/gesture-b1b90e9/gestureqa-five-swipe-candidate.apk` SHA-256 `266fdd1f12a62391e94817b6b4ac0415450569a6b737a4d8e62941117523c12c`. Installed separately under gestureqa app ID.
- Android direct ADB native UI PASS: 1× left swipe photo 1→2; at 2× left swipe blocked; Reset then right swipe photo 2→1; Close returns to Memory Details. Evidence `five-swipe-regression-android.log`; test exited 0. Initial run hit a transient uiautomator/ADB interface failure before assertions; retry after device recovered passed.
- Source validation: `npm test`: 602 total, **597 pass / 0 fail / 5 skipped** optional archive fixtures. TypeScript check PASS; ESLint PASS; diff whitespace check PASS.
- Previously accepted iOS/Android genuine pinch-out/in, double-tap and pan behavior remain separately evidenced; this checkpoint tests swipe and five-photo navigation.

## Evidence paths
- Android QA: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-73c88bf-android-20261111/`. Repro scripts `complete-five-photos.py`, `five-viewer-acceptance.py`, `five-swipe-regression-android.py`, native XML and logs.
- iOS QA: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-a1989d8-native-20261111/`; YAML flow, native logs, accessibility hierarchy.

## Remaining gates — do not promote candidate
1. Reconcile source+flows with owner-approved SB40 four-tab Photos layout, Figma corrected Page 47 and related Page 49 review states, including visible photo titles, gallery filters and originating-memory context; obtain explicit owner design approval.
2. Large text, VoiceOver/TalkBack, photo picker/camera negative paths, photo removal/replace/cover, state persistence after relaunch/offline, 4× pan bounds and navigation across five visually distinct synthetic images.
3. Physical Samsung QA after simulators, physical iPhone reserved for owner final signoff; native release packaging, monetization and remaining CasitaDex release gates separately tracked.
4. Do not merge release branches, replace accepted SB40 app, submit stores, write production data or conduct live purchases without explicit authorization.

**Conclusion:** Five-photo viewer and touch-swipe behavior accepted on isolated iOS/Android QA builds only. Full CasitaDex release remains NO-GO; no owner-approved SB40 app modified.
