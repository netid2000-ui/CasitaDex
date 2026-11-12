# CasitaDex SB40 — Approved Photos First, Gesture Integration Review

Date: November 11, 2026 (America/Chicago)
Status: **Source integration PASS / Native integrated acceptance NOT TESTED / Figma owner approval pending**.

## Authorities and purpose
- Approved SB40 Photos source authority: `35e411eeb3757486b7a64432b6ecb24c9faf4823`, worktree `Development/CasitaDex/sb40-authority-source-20261108`.
- Verified separate gesture branch: `work/cd-photo-gestures-20261111` at `05e46c23a066b4d706583e36b953af42d3b4fcf6`; its Photos screen is the older design, and MUST NOT replace accepted SB40 UI.
- Integration feature branch: `work/cd-sb40-photo-gesture-integration-20261111` in its own worktree under `FA-Development` SSD. This is review/integration, not owner approval or native build promotion.
- Approved Photos source uses `src/app/photos.tsx` with `FigmaPhotos`, `PhotoWorkspaceControls`, preserved scroll/anchor restoration, cover selection/reorder, replace/add/remove confirmation, and direct associated Memory Details access.
- Figma gesture spec: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134 (REVIEW, not owner-approved). Figma owner SB40 reference remains corrected Page 47; page 45 withdrawn.

## Changes (additive, keep SB40 design)
- `src/photo-zoom.ts`: pure `boundedPhotoPan` clamps pan to ±(viewport×(scale−1)/2), zero at 1×, and `photoSwipeDirection` returns previous/next only for deliberate horizontal motion while zoom is 1×.
- `src/photo-memory-viewer.tsx`: preserves existing native PanResponder pinch and double-tap, dynamic 1×–4× zoom, actual viewport bounds from onLayout, bounded panning, and single-finger swipe navigation through onTouchEnd without replacing the accepted SB40 gallery, management UI or persistence.
- Changes to existing SB40 Home, four-tab order, Photos gallery, photo ownership, backup, reminders, search, database/persistence, and launch/bundle identity: **none**.
- `tests/sb40-photo-gesture-integration.test.mjs`: adds 1×,2×,4× bound tests, swipe thresholds and source-level preservation checks for gallery/management/associated Memory Details.

## Source QA results
- `npm run typecheck`: PASS
- ESLint on changed source `src/photo-memory-viewer.tsx`, `src/photo-zoom.ts`: PASS (0 warnings/errors)
- Full `npm test`: **435 total, 429 passed, 0 failed, 6 skipped**; six optional fixture skips remain.
- Targeted three-file selection: **17 passed, 0 failed**.
- `git diff --check`: PASS.
- Repository-wide `npm run lint` remains nonzero due to an existing unused `openFullScreenPhoto` function in untouched `src/eng-screens.tsx` line 52; do not conflate with new source lint failures.

## Missing approval/acceptance gates
- This integration source is **NOT YET BUILT OR NATIVE VERIFIED**; do not infer parity from previous native tests conducted on another branch's `PhotoViewer`.
- Must package isolated iOS and Android QA apps with unique bundle IDs, verify resulting compiled source SHA/artifact hashes and install only on dedicated QA simulator/emulator; preserve owner-approved SB40 builds and device data.
- Native test: pinch-out/in, double tap, bounded pan, swipe only at base zoom, five-photo counts and order, memory/gallery return preservation, cover/reorder and remove/replace negative paths, color/large text accessibility.
- Compare native screenshots with approved Figma Page 47 and owner accepted SB40 four-tab screenshots, obtain owner design approval before any promotion.
- No accepted build replacement, release merges, store submissions, purchases, or production Firebase writes are authorized.

Next task: isolated native build/installation and functional regression using integrated SB40 Photos screen, then Figma reconciliation.
