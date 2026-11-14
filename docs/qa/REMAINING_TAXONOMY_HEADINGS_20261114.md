# Add/full-edit taxonomy inputs and reminder headings

All work runs on FA-MAC-DEV-01 using the disposable boundary QA simulator. The installed SB40 build and original QA collection are preserved. Completed photo acceptance is not repeated.

## Changes

Add Memory Space/Category creation and full-edit Space/Category creation opt into the existing QA-only iOS text-view workaround. The native baseline reproduced character loss in all four fields: Draft became D or Dft; Edit became Eit or E. No artificial typing delay was added.

The shell heading now distinguishes reminders-manage with an existing reminder ID (Editing a Reminder), mode=new (Adding a Reminder), and the management route (Your Reminders). This heading correction is a source change; no public build was deployed. Its Cancel/Save controls retain their fixed position.

## Verification scope

Four native workflows check exact rapid creation text, assignment and persistence after restarting. Add Memory Cancel retains the draft and its taxonomy choices by existing design. Full-edit Save persists assignments; changing the selection to None and canceling must restore the saved assignment. A fifth native test covers create/edit/manage reminder headings and fixed editor actions.

Full native results and independent SQLite evidence follow. Physical iPhone/Android qualification remains pending. This checkpoint does not cover renaming/deleting taxonomy labels or duplicate-label behavior.

## Recorded results

- r1: four baseline input failures, each missing characters.
- r2: four taxonomy workflows passed; heading assertion failed because the root shell read local parameters instead of the active child route parameters.
- The heading now reads global route parameters, scoped to reminder heading selection. Existing photo-mode parameter handling is unchanged. Only the heading test is rerun after this correction.
- SQLite: 19 saved memories, four exact new taxonomy labels, correct retained-draft and saved-memory assignments, prior categories retained, other 18 memories and media unchanged.
- Original 90-memory QA payload hash unchanged. Typecheck, scoped layout ESLint, Python syntax and whitespace checks pass.

[Evidence](evidence/remaining-taxonomy-20261114).

Final heading test r3: 1 passed / 0 failed, including fixed Cancel/Save coordinates during scroll. Figma QA status node 1006:17 reconciled.
