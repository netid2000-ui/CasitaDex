# Sticky controls and storage parity — November 15, 2026

Continues e700bfc. Figma changes only; no application source or data changes.

## Completed
Seven core light frames (Home 429:2, Photos 398:3, Reminders 434:2, Find 436:2, Details 438:2, Add 442:2, Edit 448:2) had no scrolling viewport/persistent controls. Reorganized their existing nodes into persistent top controls, independently scrolling content, and persistent bottom navigation where already present. Retained node IDs and reactions. Standard viewport is 390 × 844. All seven have positive-height vertical content viewports; root and control regions do not scroll. This matches the existing dark-screen structural pattern.
Photos and Edit screenshots visually checked: readable controls, no overlapping regions, long content clipped within its scroll viewport.
Source review confirms shared Page.stickyActions above its ScrollView for editor/details/settings; Photos controls outside gallery scroll; Find sticky first child. This is source verification, not a fresh native scrolling acceptance.

Light and dark base Privacy & storage frames (487:126, 901:2) omitted the storage breakdown and backup shortcut present in PhotoStoragePanel. Added illustrative saved-photo storage, device availability, thumbnails and draft storage; updated introduction; added full-backup temporary-space explanation and theme-correct Backup & restore actions (487:97 / 875:2).
Dark storage screenshot reviewed; old duplicate headings are hidden, not overlapping visible content. Example quantities are explicitly illustrative, not measured device data.
Existing photo acceptance was not repeated.

## Scope still open
Other state variants (measured/integrity/repeated-storage checks), legacy editor/management variants and large-text flows still need reconciliation. This checkpoint does not certify every Figma screen or manual prototype gesture. The broader app/Figma sweep remains open.

Figma Photos: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=398-3
Figma storage: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=901-2
