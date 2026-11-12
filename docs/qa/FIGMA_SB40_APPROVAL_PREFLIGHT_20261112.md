# SB40 Figma approval preflight — November 12, 2026

Status: IN PROGRESS; not final approval-ready. Design work only.
Baseline: accepted SB40; preserve owner reference Page 44 and corrected Page 47. Page 45 withdrawn.
File: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=398-2
Review board: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1006-2

## Verified this checkpoint
- Recovered audit branch at 2d17b6d; clean before this documentation change.
- Live Page 49 contains 777 top-level nodes and 177 top-level frames named Dark.
- Found gesture contract 1018:134: pinch 1–4x; double tap 1x/2x; bounded pan; swipe only at 1x; accessible button alternatives. This is a specification, not proof of native gestures.
- Corrected 12 Zoom-preview Manage controls that still navigated to old light examples. Exact state names matched before writing.
- Updated existing review board date, photo progress and open gates. Render inspected; text readable and within board.

## Corrected route mapping
| Zoom frame | Manage frame | Control |
|---|---|---|
|1013:38|1013:494|1013:67|
|1013:76|1013:560|1013:105|
|1013:114|1013:626|1013:143|
|1013:152|1013:692|1013:181|
|1013:190|1013:758|1013:219|
|1013:228|1013:824|1013:257|
|1013:266|1013:890|1013:295|
|1013:304|1013:956|1013:333|
|1013:342|1013:1022|1013:371|
|1013:380|1013:1088|1013:409|
|1013:418|1013:1154|1013:447|
|1013:456|1013:1220|1013:485|

## Audit interpretation
The broad scan returned 413 destination occurrences on 43 dark frames before correction. This is NOT a defect count: the API exposes both action and actions, duplicating simple destinations, and conditional Settings return branches legitimately include multiple themes. Removed the stale 83-link figure from the approval board rather than substituting an invalid count. Next audit must prefer actions and evaluate branch conditions before assigning defects.

## Remaining design work
1. Classify actual cross-theme routes, especially Find filter results, Photos compact/sort navigation, label management, storage previews and reminders.
2. Execute multi-category/create-new lifecycle prototype journeys.
3. Reconcile prototype photo states to COMPLETED native mutation/cover evidence. Do not rerun completed photo acceptance; see FIGMA_SB40_NATIVE_PHOTO_EVIDENCE_RECONCILIATION_20261112.md.
4. Verify restore draft choices, confirmation, cancellation and recovery journeys in the prototype.
5. Finish touch-target/contrast/large-text and reusable-component audit.
6. Present completed scoped design evidence for owner approval before implementation resumes.

No app source, build, simulator, accepted installation or user data changed. Existing native QA remains separate evidence; no native test was run in this checkpoint. Owner design approval pending; release NO-GO.
