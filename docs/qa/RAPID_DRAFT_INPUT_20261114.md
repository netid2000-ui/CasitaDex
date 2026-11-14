# Rapid draft input — isolated iOS QA

## Finding

Rapid XCTest entry lost characters before saving: `Boundary` became `Bdary`, `Boy`, or `Bodary`. The same loss reproduced in a minimal uncontrolled React Native single-line TextInput with no application callbacks, validation or database. Disabling autocorrection, avoiding controlled value updates while focused, and waiting two seconds after keyboard presentation did not resolve it. Those unsuccessful application changes were reverted.

The simulator Settings search control preserved the exact burst input. A minimal React Native multiline TextInput also preserved it. This narrows the observed failure to the React Native single-line input path in this environment; it does not prove a particular upstream cause or physical-device behavior.

## Scoped workaround

Field accepts an opt-in `iosTextView` prop. In isolated local StoreKit QA only, the Add Memory name uses the iOS native text-view path while retaining its existing styling, controlled value, 200-character limit and Return-to-finish behavior (`blurAndSubmit`). Description already uses a text view. Other inputs, Android and public builds are unchanged. Accepted SB40 is untouched.

The workaround does not slow typing or disable autocorrect. The final application test uses the same whole-string burst calls as the failing baseline, without per-character pauses or an added keyboard wait.

## Evidence and limits

Retain failing comparisons as well as passing results. RapidInput-r5 preserved both fields exactly in the UI and SQLite, then failed because the test expected a Resume Draft button that this Home screen does not expose. r6 corrects that locator and adds a save after cold restart. Final r6: PASS, 1 test / 0 failures (27.193 seconds).

No completed photo acceptance was rerun. Only the guarded boundary simulator copy was prepared. Other single-line inputs (Find, inline editing and taxonomy) need focused acceptance before extending the workaround; physical iPhone and Android acceptance remain pending.

## Final verification

- Whole-string burst title and description exactly matched before leaving the form, after a cold restart, and in the final saved SQLite memory.
- Exactly 20 memories saved; draft consumed once. No per-character delay or artificial keyboard wait in the final application test.
- TypeScript, Field ESLint and diff whitespace checks passed. The scoped React changes preserve hook order, accessible labels and native maxLength enforcement.
- Screenshot reviewed: long name wraps visibly without clipping; existing fixed actions and visual styling retained. Return finishes editing instead of adding a newline. Physical accessibility acceptance is still required.
- Diagnostic-only input route was archived as evidence and removed from the build worktree. Original 90-memory QA snapshot independently checked against its saved baseline; boundary simulator stopped afterward.

[Final native summary](evidence/rapid-input-20261114/RapidInput-r6-summary.json) · [Saved text verification](evidence/rapid-input-20261114/saved-memory-verification.json) · [Screenshot](evidence/rapid-input-20261114/rapid-title-exact.png)

All comparison summaries and diagnostic source are retained in the evidence directory. Minimal-control tests are diagnostic artifacts, not active production routes. To rerun the application regression, prepare the named boundary simulator with `scripts/prepare-memory-boundary.py <evidence-folder> <boundary-uuid> --empty-draft`, then select `PlusRecoveryUITests/testRapidDraftInput`. Never prepare an original or accepted simulator.

Figma status board reconciled: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1006-17
