# CasitaDex SB40 — Distinct-Photo Identity, Cover Order, and Removal Recovery QA

**Date:** November 11, 2026 (America/Chicago)
**Execution:** FA-MAC-DEV-01 only; isolated SB40 integration branch `work/cd-sb40-photo-gesture-integration-20261111`
**Status:** Android emulator scoped PASS; iOS distinct-photo parity remains OPEN; CasitaDex release NO-GO.

## Source and artifact provenance

- Source implementation `1ec4b7ff3bb15e363e0c25944312754852cff537`, branch head at start `1f5a4fda32dda00a3e7f1e2448926f6acf369609`.
- Approved SB40 source base `35e411eeb3757486b7a64432b6ecb24c9faf4823`; preserved without modification.
- Android QA app ID `com.designsbyfa.casitadex.sb40gestureqa`, non-fold `medium_phone` AVD `emulator-5554`.
- Android APK SHA-256 `b7fab4c2c7f83f81f4a03fa9ad070359c46d90a451d174e3b8d530231c815b2d`. No replacement of accepted SB40 Android package.
- Five 768×768 labeled synthetic QA PNGs generated on external SSD: copper, blue, green, gold, purple. Each image has a unique SHA-256 and text identifying it as synthetic QA material. Imported to the disposable Android emulator and iOS isolated simulator photo libraries; not personal user content.
- Fixture: the isolated seeded `[SAMPLE] Appliance manuals` memory. Its five existing photo attachments were replaced through the real Android system picker and SB40 native PhotoMemoryViewer. Production/backend writes were not used.

## Checkpoint A — Five distinct images

- [x] Replaced photo positions 1–5 with copper, blue, green, gold and purple respectively using **Manage photos → Replace this photo → Choose from Library**.
- [x] Captured native Android screenshots of each photo and verified five independent RGB sample triplets at photo image center. The five displayed colors were clearly distinguishable and matched the synthetic fixtures.
- [x] The prior test used repeated files and could not prove identity. This cycle explicitly tests **image identity**, not solely the `Photo N of 5` label.

## Checkpoint B — Cover photo and reorder identity

- [x] Selected **photo 3 (green)**, tapped **Use as cover photo**, observed `Photo 1 of 5 · Cover`.
- [x] Verified image-order screenshots for all five photos after cover change: **green → copper → blue → gold → purple**. The first color comparator had a QA-only color-profile conversion mistake; it was corrected to compare screenshot sRGB samples against prior captured screenshot samples, not NSColor color-space converted reference objects.
- [x] Selected **photo 4 (gold)** and tapped **Move photo earlier**; UI displayed `Photo 3 of 5` and `Photo order saved.`
- [x] Force-stopped and relaunched the isolated app, reopened the saved memory, captured screenshots for all positions 1–5.
- [x] **Durable saved order verified by pixels after cold relaunch:** **1 Green, 2 Copper, 3 Gold, 4 Blue, 5 Purple**; center RGB differences 0.000 against reference native screenshot samples.
- [x] Reopening the gallery and photo viewer preserved five positions and the selected cover.

## Checkpoint C — Confirmed removal and safe readdition

- [x] On isolated synthetic photo 5, opened **Remove this photo**, verified destructive confirmation and explicit information that the previous full save remains recoverable.
- [x] Confirmed removal of synthetic photo 5; viewer changed from 5 to **4** saved photos.
- [x] Added the purple synthetic image again through Add Photo → Choose from Library; returned to **5** saved photos.
- [x] Opened photo 5 and sampled its center pixel; purple presentation verified.
- [ ] **Full backup/restore recovery of the pre-removal snapshot is NOT tested.** Readding the QA image establishes local remove/readd workflow, not recovery from a previous backup.
- [ ] Replaced/moved photo identity after separate backup/restore and after app upgrades remains untested.

## Evidence retained on Mac mini SSD

`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`

- `distinct-fixtures/` (five unique labeled PNGs, source `create-five-fixtures.swift`).
- `android-distinct-replaced-1.png`, `distinct-photo2.png` through `distinct-photo5.png`.
- `distinct-green-after-cover.png`; `distinct-after-cover-photo1.png` through `distinct-after-cover-photo5.png`.
- `distinct-relaunch-photo1.png` through `distinct-relaunch-photo5.png`.
- `check-color-order-sRGB.swift`, `check-relaunch-color-order.swift`; `verify-distinct-relaunch-order.py`, `replace-four-distinct.py`.
- `android-after-move-earlier.xml`, `android-remove-canceled.xml`, `recovery-runtime.xml`, `readded-purple-last.png` and native screenshots.
- Android physical Samsung device was visible on ADB but **not accessed or installed**.

## Open gates before promotion

1. Repeat **five visually distinct photos, cover identity, reorder persistence, and replace/remove workflows on the isolated iOS integrated SB40 build**. The five QA image files are in its Photos library, but not yet linked to the app memory in this cycle.
2. Verify true backup/restore and photo recovery, image error and picker cancellation; use disposable QA data only.
3. Test gallery scroll anchor restoration, Grid/Compact sort persistence, 4× pan bounds, large text, native VoiceOver/TalkBack and reduced motion on integrated QA builds.
4. Reconcile approved Figma SB40 Page 47 plus Photo review Page 49 with native screenshot evidence; obtain owner design signoff. Do not substitute obsolete Page 45 design.
5. Only after simulator/emulator verification move to physical Samsung QA and final owner iPhone signoff.

**No accepted SB40 app, owner iPhone build, real saved memory, production service, release branch or app store submission changed. Overall release remains NO-GO.**
