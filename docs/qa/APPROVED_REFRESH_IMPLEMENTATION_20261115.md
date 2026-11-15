# Approved refresh implementation — 2026-11-15

Implemented on `work/cd-plus-backup-safety-20261114` from `8614ae7`, exclusively on FA-MAC-DEV-01. Accepted SB40 installation and physical devices were not replaced.

## Applied

- Approved Cormorant Garamond / Inter foundation and separate light/dark palettes; shared 8px controls, aligned selection checkmarks and fixed action areas.
- Editorial Home, Find, Photos and Settings; working Find Space/Category filters and photo-only filter; retained draft/scroll/viewer behavior.
- Original Figma image/vector assets. The branch image was JPEG bytes mislabeled PNG: corrected extension without image alteration. SVG source is embedded for offline Android release rendering.
- Add/Details/Edit/reminder/settings/backup flows inherit shared styling. Full secondary-screen layout parity remains to be completed; this report does not certify every approved screen.
- Measured photo storage panel: device free space, saved photos, draft photos, disposable cache, largest photos and storage integrity feedback.
- Native 384px JPEG preview cache, capped at 64MiB; serial generation, pending-request deduplication, low-space refusal and derivative-only pruning. Copy is awaited before temporary cleanup; originals stay separate from database references.
- Replaced independent 1000-photo manifest bound with 25000, aligned with existing 5000-memory × 5-photo limits. The 10MB/photo and snapshot metadata limits remain. This is a structural bound, not proven phone capacity or an unlimited-storage promise.

## Navigation authority correction

The authoritative reconciliation `b33c5ca` explicitly preserves **Home / Photos / Reminders / Find**, with Settings accessed from Home. A stale conversation summary temporarily led this working refresh to Home / Find / Photos / Settings. Corrected before commit; r4/r5 and final Android package use the verified SB40 arrangement. Figma checkpoint records this correction. Never use the stale summary to change navigation again.

## Verification

- TypeScript PASS; full ESLint PASS with zero warnings.
- Full automated suite: 497 total, **491 passed, 6 existing skips, 0 failed**.
- iOS final `CasitaDex-Approved-Refresh-r5-20261115.xcresult`: **2 native tests passed**, 0 failed. Ten light/dark captures across Home, Find, Photos, Settings and Storage; fixed Settings header; create/edit/manage reminder headings and fixed Save/Cancel.
- Native thumbnail rendering inspected; dimensions recorded. Regression tests cover async copy order, low-space behavior and derivative-only pruning.
- Final stored payload hashes exactly match starting values: original QA 90 memories / 3 media; disposable QA 19 memories / 2 media. See before.json and after-final.json. These are complete payload comparisons, not a claim of physical-device acceptance.
- Android arm64 release build PASS in distinct `com.designsbyfa.casitadex.refreshqa`. Initial build caught mislabeled image and stale generated resource; corrected. Visual inspection caught release SVG loading; corrected by embedding original SVG XML.
- Android final: **10/10 core-screen checks passed** across Light/Dark Home, Find, Photos, Settings and Storage. Screenshots/XML saved; System preference restored. First harness failure was the exact Sort accessibility label (Android includes its current value); corrected locator, not an app defect. Final Home and dark Photos screenshots visually checked, including original vectors and rendered photo previews.
- Existing emulator lacked update staging space. Only this batch's newly installed disposable Refresh QA app was recreated; no older package/data was removed. ADB libusb mode avoided the host USB startup crash. Samsung was not targeted.
- Completed owner photo acceptance was not repeated. This batch checks changed rendering/storage, not a renewed gesture/order/replace acceptance cycle.

## Still pending

Full secondary-screen visual reconciliation; on-device photo-text search and photo-rich PDF Plus delivery; production store products/checkout qualification and Android billing; physical Samsung/iPhone acceptance; measured large-collection resource/capacity acceptance and full card virtualization. Public checkout remains disabled. No store submission, release or live purchase occurred.

## Sources and evidence

Figma: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1006-17

Core design references: Home 950:2; Find 975:2; Photos 975:52; light/dark Settings 806:2 / 806:113; storage 1244:2. Preserve reconciled navigation over conflicting exploratory footer variants.

Evidence: `docs/qa/evidence/approved-refresh-20261115/`. Native xcresult retained on FA-Development under QA-Evidence. Reproducible Android preparation/check scripts and iOS XCTest are included in source.
