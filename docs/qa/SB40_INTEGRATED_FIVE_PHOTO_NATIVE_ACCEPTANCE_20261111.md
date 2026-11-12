# CasitaDex SB40 — Integrated Five-Photo Native Acceptance Return Report

**Date:** November 11, 2026 (America/Chicago)
**Execution authority:** FA-MAC-DEV-01 (Mac mini), exclusively
**Result:** Scoped native five-photo navigation, persistence, cover selection, and remove/cancel acceptance PASS on isolated iOS and Android QA builds. **Overall CasitaDex release remains NO-GO.**

## Identity and safety

- Integration source commit: `1ec4b7ff3bb15e363e0c25944312754852cff537` (latest branch checkpoint at start: `2e8be95c8f983b198dc4f91c0b3e726af01b25a5`).
- Feature branch: `work/cd-sb40-photo-gesture-integration-20261111`, separate from accepted SB40 source `35e411e`. The accepted physical iPhone application, accepted Android application, production data, and the original SB40 checkout were not modified.
- **Isolated QA bundle ID on both platforms:** `com.designsbyfa.casitadex.sb40gestureqa`.
- Android: non-fold `medium_phone`, emulator `emulator-5554`. Release APK SHA-256: `b7fab4c2c7f83f81f4a03fa9ad070359c46d90a451d174e3b8d530231c815b2d`.
- iOS: `CasitaDex FigmaFirst Isolated QA` simulator `879C620A-5318-4BDF-98B9-904EE635B053`, iOS 27.0. Release embedded JS SHA-256: `fa7cc59d9d854d0b73b22674b5dc33f815e1351f097ab77c4bef04f70ef20587`.
- Synthetic QA fixture: the seeded **[SAMPLE] Appliance manuals** memory; four extra photos were attached via native photo pickers. Images may be repeated and therefore do not independently validate visually distinct photo identities.
- Authoritative design: owner-approved SB40 **Your Photos** four-tab implementation. Figma gesture Page 49 board remains review-only and requires owner visual acceptance.

## Checkpoints

### 1. Five-photo attachment and limits

- [x] Android: Added four attachments in the **integrated** `PhotoMemoryViewer` using Manage photos → Add Photo → Choose from Library. Viewer incremented `Photo 1 of 3`, `Photo 1 of 4`, `Photo 1 of 5 · Cover`.
- [x] iOS: Added four attachments through the integrated viewer and native Photos picker. Native accessibility tree confirmed `Photo 1 of 5 · Cover`.
- [x] Android: Add Photo control observed disabled at 5/5.
- [ ] iOS disabled Add Photo control at 5/5: not separately asserted in this cycle.

### 2. Previous / Next and reset

- [x] Android full native sequence **1→2→3→4→5→4→3→2→1**, test process exit 0. Previous disabled on photo 1 and Next disabled on photo 5.
- [x] Android zoomed state reset to 1× on selecting another photo; confirmed by native `Zoom photo out` disabled state.
- [x] iOS full native sequence **1→2→3→4→5→4→3→2→1**, Maestro process exit 0.
- [x] iOS zoomed state reset to 1× on Next: native `Zoom photo out` disabled on photo 2 after Zoom In on photo 1.
- [ ] Integrated five-photo horizontal swipe navigation and pan-at-4× boundaries: remain separate gates.

### 3. Management safety

- [x] Android: Selected photo 3 as cover. Viewer then displayed `Photo 1 of 5 · Cover` and current-cover management state.
- [x] iOS: Selected photo 2 as cover; native assertion `Photo 1 of 5 · Cover` passed.
- [x] Android: Remove this photo displayed a confirmation; Cancel preserved all five photos.
- [x] iOS: Remove this photo displayed confirmation; Cancel returned to viewer preserving `Photo 1 of 5 · Cover`.
- [ ] Photo identity/order durability after cover rearrangement: not independently proven because some QA images were repeated. Distinct synthetic images should be used to verify exact cover and reorder identity.
- [ ] Replace photo, actual remove (including undo/recovery), move earlier/later persistence, and cancel from system picker: remain open.

### 4. Navigation and restart

- [x] Android: Force-stop and relaunch `sb40gestureqa`, return to Your Photos, reopen saved sample viewer; still `Photo 1 of 5 · Cover`.
- [x] iOS: Close viewer returns to **Your Photos** with original sample tile; terminate/relaunch the QA app, return to Photos, reopen sample; still `Photo 1 of 5 · Cover`.
- [ ] Gallery scroll anchor position after viewer close and Compact/Grid sort preference persistence: not measured in this cycle.
- [ ] Native VoiceOver/TalkBack, large text and reduced motion: not accepted in this cycle.

## Supporting evidence (Mac mini external SSD)

Android: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`
- `integrated-five-nav.log` (test exit 0), `integrated-five-ui.xml`
- `android-cover-before.xml`, `android-cover-after.xml`
- `android-remove-confirmation.xml`, `android-remove-canceled.xml`
- `android-after-relaunch-viewer.xml`
- `add-final-three-viewer-photos.py`, `integrated-five-nav.py`

iOS, same evidence directory:
- `ios-integrated-add-photo-preflight.log`, `ios-integrated-add-more.log`, `ios-integrated-five-ready.json`
- `ios-integrated-five-navigation.log` (test exit 0)
- `ios-integrated-zoom-switch-ui.json`
- `ios-integrated-cover-select.log`, `ios-integrated-remove-cancel.log`
- `ios-integrated-close-return.log`, `ios-integrated-after-relaunch.log`

Previously verified integrated native pinch, double-tap, zoom and pan are in `SB40_GESTURE_INTEGRATED_IOS_ANDROID_NATIVE_20261111.md`. Do not relabel the older gesture-prototype tests as approved SB40 integration results.

## Next implementation / QA boundary

1. Use **five visually distinct synthetic images** to verify actual image identity, cover selection, move earlier/later and durable photo ordering through a cold relaunch and backup/restore.
2. Test actual replace, remove, recovery, picker cancellation and error handling on the isolated QA app; preserve other memories and media.
3. Verify Figma approved SB40 gallery and PhotoMemoryViewer parity (including Compact/Grid, sort, scroll anchoring, accessibility and large text) with native screenshots. Do not replace owner-approved baseline with the obsolete Photos screen.
4. Finish emulator/simulator gates before physical Samsung; physical iPhone remains reserved for owner final acceptance.

**No production deploy, merge, store submission, live purchase, physical-device installation or accepted SB40 binary replacement performed.** Full app release remains **NO-GO**.
