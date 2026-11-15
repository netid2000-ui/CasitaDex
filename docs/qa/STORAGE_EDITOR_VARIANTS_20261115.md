# Storage and editor variants — November 15, 2026

Continues 2e590e8; Figma-only reconciliation.

## Completed
- Six storage result screens: measured, integrity-only, and both-checks-complete in light and dark themes (547:2, 547:16, 547:30, 901:43, 901:91, 901:136).
- Added the current photo breakdown, backup-space explanation and theme-correct Backup & restore shortcut. Measurement states show illustrative availability/thumbnail values; integrity-only states retain Measure to check. Four measured states include protected-reference/recovery-overlap/database-exclusion caveats matching PhotoStoragePanel.
- Older storage result panels retained hidden for traceability. Existing action IDs and result-state navigation retained.
- All six now have persistent top controls and independently scrolling content at 390 × 844.
- Converted 31 older full-page Add/Edit variants to persistent Save/Cancel rows and independently scrolling content. Existing controls, values and reactions retained.
- Structural audit: 73 full-height Add/Edit or Large-named frames have a positive-height vertical Scrollable page content region; zero exceptions in this set.
- Representative Choose Space editor and dark combined-storage screenshots visually reviewed.

## Validation scope
Figma structural and screenshot checks only. No application source changes; no builds or repeated photo acceptance. Sample storage numbers are illustrative, not measurements of user data. The 73-frame audit validates scrolling structure, not every control, text size, interaction, or screen-reader gesture.

## Remaining
Repeat-check dialog prototypes and their result wording, smaller picker/dialog flows, remaining management variants, and end-to-end manual prototype/native parity remain outside this checkpoint. Full sweep remains open.
Evidence JSON includes all returned mutation IDs.
