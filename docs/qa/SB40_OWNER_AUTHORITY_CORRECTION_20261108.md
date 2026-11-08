# SB40 is the CasitaDex implementation authority

## Correction of the wrong-version mapping

Francisco reaffirmed that SB40 is the agreed build, including inline editing while adding a memory. The previous page 45 and its two specs were generated from the different current .dev Eng source. They are WITHDRAWN / WRONG SOURCE / DO NOT IMPLEMENT. The six entries from the aborted .dev household test do not count toward SB40 acceptance.

[Corrected SB40 inline Add map](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=360-2). [Preserved owner-reference primary screens](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=347-2). The optional monetization roadmap on page 46 remains a separate commercial concept, not proof that billing exists.

## Exact verified candidate

- QA bundle: `com.designsbyfa.casitadex.sb40qa`, version 0.1.0 (1).
- Executable SHA-256: `8ad89040f3a092c4a57b1d4bf7747a55e1afdd19cfa264f0b3fe136c02ba9b4d`.
- Existing SB40 reference simulator preserved; same artifact installed side-by-side into the isolated household simulator. No .dev data overwritten.
- Source reference: recovered isolated SB40 simulator-parity workspace. It is not a Git checkout or a new release-certified source commit.
- Native iOS checks: Adding a Memory, Memory name (Required), SPACE, CATEGORIES, Description, LOCATION / NOTES / REFERENCE with Edit pencil controls, PHOTOS 0/5 and Add Photo, sticky Cancel / Save. Location Edit exposes an inline Edit location input and Done control. No input was made in the reference simulator.
- Physical iPhone is connected; installed .dev app is labeled CasitaDex A2 QA 0.1.0 (1), shared identifiers across historical builds are not version proof. No phone agent was installed and no physical phone data or build was changed. Do not claim byte identity to the phone.

## SB40 Add behavior and actions

| **Area** | **SB40 behavior** |
|---|---|
| Entry | Opens Add directly with safe internal draft recovery; no separate resume page |
| Required name | Memory name (Required), max 200 characters |
| Description | Multiline Description; text or a photo required |
| Space | Choose opens inline chooser; Select Space or Create new Space; create and assign in context |
| Categories | Choose opens inline chooser; Select Category or Create new Category; selected chips can be removed |
| Location | Edit pencil expands Edit location inline; Done collapses within Add |
| Notes | Edit pencil expands Edit notes inline; Done collapses within Add |
| Reference | Edit pencil expands Edit source inline; displayed user label remains REFERENCE |
| Photos | Add Photo offers Take Photo, Choose from Library, Browse Files or Cancel; up to five; thumbnails open viewer |
| Save | Sticky at top; disabled until name plus description/photo; duplicate review when needed; returns Home after save |
| Cancel | Sticky at top; flushes/preserves internal unfinished work, returns Home; do not replace with generic destructive-discard behavior |
| Keyboard | Drag dismisses keyboard in this SB40 implementation |
| Saved details | Separate Memory Details includes inline edit controls; not the .dev ActionPage workflow |
| Native handoff | Camera/library/files and share remain system-controlled, with cancellation preserving relevant data |

## Route reconciliation

The SB40 source has distinct actual entry files: `index.tsx`, `add.tsx`, `card.tsx`, `answers.tsx`, `photos.tsx`, `reminders.tsx`, `more.tsx`, `photo-viewer.tsx`, `photos-manage.tsx`, `reminders-manage.tsx`, `settings-manage.tsx`, `share-memory.tsx`, and a secondary `memories.tsx`. Their implementation mixes owner-reference wrappers and Eng management views. Mapping every route directly to the newer .dev Eng components was incorrect.

Only the normal Add and inline Location control were runtime-inspected by this correction. Notes, Reference, taxonomy and photo variants on the corrected page are source-mapped; Android variants are not fresh native acceptance. Remaining secondary-page mapping must be reconciled to this SB40 source and artifact before being called authoritative.

## Acceptance boundary

The household run uses the exact SB40 QA artifact, native UI entry only, correct labels and app identity guards. Read-only SQLite corroborates writes after Save; it does not insert data. The SB40 QA package starts with its own 90 synthetic samples; these are baseline fixture data and do not count as newly entered household memories. The 75 requested new items are tracked separately.

No source-port, production deployment, live billing or release approval is implied. Do not substitute a newer branch, matching Home screen, four tabs, simulator name or identical bundle/version for full-flow identity.

## Additive source checkpoint — 2026-11-08

The recovered source is now captured in a separate, additive [source-provenance checkpoint](SB40_SOURCE_PROVENANCE_CHECKPOINT_20261108.md). The recovered folder and newer dirty `.dev` checkout are preserved. The nested baseline is reviewable Git source evidence, not a source-to-binary reproducibility certification or permission to promote the newer root source. Existing SB40 owner authority and native acceptance boundaries remain unchanged.
