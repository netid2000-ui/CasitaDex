# CasitaDex SB40 — iOS Distinct-Photo Identity, Cover Order, and Removal QA

Date: November 11, 2026 (America/Chicago)
Execution: FA-MAC-DEV-01 only; isolated `sb40gestureqa` iOS simulator
Result: **Scoped iOS native QA PASS** for five distinct photo identities, cover selection, durable reorder, synthetic removal and readdition. Overall release remains **NO-GO**.

## Immutable authority and provenance
- Integrated accepted-SB40 source: `work/cd-sb40-photo-gesture-integration-20261111`, source implementation commit `1ec4b7ff3bb15e363e0c25944312754852cff537`, last report checkpoint `93a79f834015ee5aebf6242b02f7d0b1b9ee6909`. No application code was modified in this cycle.
- SB40-approved base: `35e411eeb3757486b7a64432b6ecb24c9faf4823`, unchanged.
- Test package: **`com.designsbyfa.casitadex.sb40gestureqa`** on isolated iOS 27.0 simulator `879C620A-5318-4BDF-98B9-904EE635B053`. Not the owner's SB40 installation.
- Existing iOS Release JavaScript SHA-256 `fa7cc59d9d854d0b73b22674b5dc33f815e1351f097ab77c4bef04f70ef20587`.
- Fixture: isolated seeded `[SAMPLE] Appliance manuals` memory. Five uniquely colored/labeled synthetic PNG files imported to the QA simulator photo library, with independent source SHA-256 checksums under external SSD evidence directory. No real personal photos used.

## Checkpoint A — Five distinct image replacements
- [x] Confirmed system Photos picker tile mapping by screenshot pixel samples, rather than ambiguous identical timestamp accessibility labels. Newest first order: purple, gold, green, blue, copper.
- [x] Used the native integrated SB40 viewer `Manage photos → Replace this photo → Choose from Library` to replace its five QA attachments, in order: copper, blue, green, gold, purple.
- [x] Captured the five corresponding iOS simulator screenshots. Center-sample RGB confirmed actual images, not only `Photo N of 5` counters.

## Checkpoint B — Cover identity and reorder persistence
- [x] Selected photo 3 (green), chose `Use as cover photo`. Viewer showed `Photo 1 of 5 · Cover`; native screenshot sampled green.
- [x] After closing and reopening the viewer, verified all five cover-order colors by pixels: **green, copper, blue, gold, purple**, maximum channel delta 0.000 compared with reference native screenshot samples.
- [x] Selected gold at position 4 and tapped `Move photo earlier`. Viewer displayed `Photo 3 of 5` and `Photo order saved.`
- [x] Closed viewer, terminated and relaunched isolated app, reopened approved `Your Photos` gallery and saved sample memory, captured all five positions.
- [x] Verified durable order by actual screenshot colors: **green, copper, gold, blue, purple**. Five position deltas 0.000 against reference screenshot colors.
- [ ] Remaining visual QA: five unrelated aspect ratios, orientation, large text and 4× pan bounds.

## Checkpoint C — Confirmed synthetic removal and readdition
- [x] On photo 5 (purple), `Remove this photo` displayed confirmation with explicit prior-save recovery description.
- [x] Confirmed removal using `Remove photo`; viewer changed from five to **`Photo 4 of 4`**.
- [x] Added the purple synthetic image again using `Add Photo → Choose from Library`. The first automated tap left system picker open; a second tap on the verified purple tile returned to viewer and count **`Photo 4 of 5`**.
- [x] Navigated to photo 5, captured screenshot and verified purple center RGB.
- [x] Terminated/relaunched the isolated iOS QA app, returned to Photos, reopened the sample viewer; `Photo 1 of 5 · Cover` remained saved.
- [ ] **Backup/restore of the pre-removal snapshot not tested**. Successful readdition is not backup recovery.

## Native test observations requiring follow-up
- Immediately after `Use as cover photo`, two Maestro `Next photo` taps appeared completed but viewer stayed at photo 1. Closing/reopening the gallery viewer restored navigation, and the five-photo cover-order assertion passed thereafter. Cause remains unproven; treat as a **post-cover navigation regression candidate** requiring manual native reproduction or dedicated instrumentation before owner promotion.
- The native iOS Photos picker occasionally remains open after an automated tile tap; a second tap at validated tile bounds completed selection. It is not yet established whether this is an application defect, native picker timing, or automation behavior.
- Do not mark these interaction uncertainties fixed or dismissed without reproduction evidence.

## Evidence location on Mac mini external SSD
`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`
- `distinct-fixtures/` five original synthetic labeled PNGs and image-generation source
- `ios-distinct-picker-screen.png`, `inspect-ios-picker-colors.swift`
- `ios-distinct-photo1-copper.png`, `ios-distinct-photo2-blue.png`, `ios-distinct-photo3-GREEN.png`, `ios-distinct-photo4-GOLD.png`, `ios-distinct-photo5-PURPLE.png`
- `ios-green-cover-photo1.png`, `ios-cover-order-photo2.png` through `ios-cover-order-photo5.png`, `verify-ios-cover-order.swift`
- `ios-move-gold-earlier.log`, `ios-reopen-reordered.log`, `ios-relaunch-ordered-photo1.png` through `ios-relaunch-ordered-photo5.png`, `verify-ios-relaunch-colors.swift`
- `ios-distinct-remove-confirmation.json`, `ios-distinct-remove-confirm.log`, `ios-readd-purple-result.json`, `ios-readded-purple-photo5.png`, `ios-readded-relaunch-open.log`

## Cross-platform comparison and open gates
- Android integrated distinct-photo, cover/reorder and remove/readd QA PASS documented in `SB40_DISTINCT_PHOTO_IDENTITY_ORDER_RECOVERY_20261111.md` (commit `93a79f8`).
- iOS integrated distinct-photo, cover/reorder and remove/readd scoped QA PASS **this checkpoint**.
- Still open: approved Figma parity and owner sign-off, gallery scroll anchor and Grid/Compact preferences, full native VoiceOver/TalkBack, large text, actual backup/restore, photo failure and picker cancellation negative paths, and post-cover Next behavior.
- All simulator/emulator gates to be completed before physical Samsung; physical iPhone reserved for owner final signoff.
- No accepted SB40 binary replacement, production writes, release merges, live purchases, or store submissions performed. Full CasitaDex release **NO-GO**.
