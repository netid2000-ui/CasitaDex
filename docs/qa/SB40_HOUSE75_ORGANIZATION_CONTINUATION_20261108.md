# SB40 household organization continuation — 2026-11-08

## Result

**PASS, bounded native iOS acceptance.** On the already-installed, owner-accepted SB40 QA app, one existing household memory received a newly created Space and Category through native full Edit. Save persisted the assignment and returned to Memory Details. Canceling alternative Space/Category selections left every persisted snapshot field unchanged. Returning to Find preserved the query. A process termination/relaunch retained the saved state exactly.

All 165 memories remain, including the 75 fictional household records from the earlier owner-journey test. All 165 titles and descriptions are unchanged. The other 164 complete memory objects, all four media-file hashes and reminder rows are unchanged. No app build, reinstall, database insertion, bulk replay or original-device UI interaction occurred.

This advances only the previously unfinished creation/selection/save/cancel case. It does not establish collection-wide organization, rename/removal behavior or release readiness.

## Authority and isolation

- Accepted bundle: `com.designsbyfa.casitadex.sb40qa`.
- Test device: `A4ED0D8B-C90A-4940-9B71-4F570D7DC597`, CasitaDex SB40 Household75 QA.
- Executable SHA-256: `8ad89040f3a092c4a57b1d4bf7747a55e1afdd19cfa264f0b3fe136c02ba9b4d`.
- Packaged Hermes bundle SHA-256: `83326efc8d67c50748539becbe4f4f306e70efa233e8e3d44a5249260f9fb7aa`.
- Original SB40 reference `AD06A0B7-D723-4EE9-829C-03508DD1107B`: read-only before/after snapshots equal.
- Protected original `.dev` device `C88DEF5E-63F3-426C-9B50-8CF131C3C58F`: remained shut down. All 124 app-container and bundle-file hashes equal before/after. No clock change, boot, reminder modification or rescheduling.
- The separate Event Command control job and Android emulator were left running and untouched. There were no active CasitaDex build/test jobs before this bounded continuation.
- Main Git checkout stayed at `db129dee01acd63559929d7cbcfc59f9dbccfa3d` with its seven pre-existing dirty files untouched. Source provenance is a separate checkpoint; matching retained artifacts is not a reproducible-build claim.

## Native cases

| Case | Result | Evidence |
|---|---|---|
| Find existing HVAC record and enter full Edit | PASS | Correct accepted four-tab SB40 app |
| Create Space `House75 QA Home`, select it | PASS | Catalog gains one Space; all memory objects remain unchanged before Save |
| Create Category `House75 Maintenance`, select it | PASS | Full Edit uses `Create and select` |
| Save and return to Memory Details | PASS | Exact new IDs persist on HVAC record |
| Choose different existing Space and Category, then Cancel | PASS | Saved database/state/media/runtime snapshot remains exactly equal |
| Return to Find | PASS | Query remains `HVAC return filter size` with one result |
| Cold process relaunch | PASS | Before/after persisted snapshot exactly equal; Home opens normally |
| Other data and reference-device preservation | PASS | Counts, logical records, media and protected hashes verified |

The only changed memory is `HVAC return filter size`, ID `e_mw7fa5zc_n2srfp3rgt`. Its Space is `e_mw7y74r1_l13r8jomyu`; its Category is `e_mw7ybcs4_2rzc7pjwtf`. Changed fields are `spaceId`, `categoryIds`, `updatedAt` and one appended `labels_changed` audit event. Catalog counts become five Spaces and sixteen Categories. Store revision advances from 608 to 611 through the two catalog creations and the final save. Only `eng_state_v2` and its normal previous-save recovery table change. No unfinished draft remains.

The fixture intentionally retains these two new catalog values and the one saved assignment. The other 74 household records still have no structured Space/Category assignment. The original 90 baseline records are unchanged.

## Harness corrections, not app defects

The earlier owner-journey probe expected Add's `Create and assign` on full Edit, which actually uses `Create and select`. This run corrected that mismatch. Three bounded harness stops remain in the journal: a singular-versus-plural Category label, an overly conservative content-viewport bound, and an offscreen Space control omitted from the accessibility tree after re-entering Edit. Each continuation inspected current state and resumed only the unfinished step; no catalog creation or 75-record entry was repeated. The final Cancel/query continuation exited successfully.

Create-and-select commits the catalog item before the memory's Save, but readback confirms it does not prematurely change the memory assignment. Cancellation of a newly created catalog item itself was not tested.

## Remaining work and continuity

The prior Work run ended with a findings report at 06:36 UTC without a continuing CasitaDex job. The Mac was available; this was a handoff/ownership gap. This continuation reconciled the accepted runtime, resumed the uncompleted native case, and preserved a new evidence checkpoint instead of rerunning the 75-entry scenario or substituting the newer `.dev` UI.

Outstanding substantive work remains:

1. Establish a reviewable, narrowly scoped SB40 source checkpoint and then prove source-to-binary reproducibility before attributing new builds to that source.
2. Normalize dimension queries such as `20x25x1`, `20 × 25 × 1` and spaced forms without weakening exact model-number matching.
3. Return to the originating memory after saving its linked reminder.
4. Cover organization rename/removal impact and remaining selection cases, without destructive changes to protected fixtures.
5. Reconcile remaining SB40 Figma secondary screens and independently complete Android, strict OS-offline, accessibility, photo, backup/restore and notification delivery/tap gates.

Physical-device testing remains gated on simulator/emulator completion. Release remains **NO-GO**. No production or security/network settings were changed.

## Evidence

[Machine-readable verification](evidence/sb40-organization-20261108/verification.json), [evidence hash inventory](evidence/sb40-organization-20261108/evidence-sha256.json) and [screenshots](evidence/sb40-organization-20261108/) accompany this report. Full native scripts, accessibility captures, read-only before/after database snapshots, stopped-harness artifacts and SHA-256 manifest are retained on the development SSD under `QA-Evidence/CasitaDex/sb40-organization-continuation-20261108`.

- [01-selected-unsaved.png](evidence/sb40-organization-20261108/01-selected-unsaved.png): full Edit before Save.
- [02-assignment-saved.png](evidence/sb40-organization-20261108/02-assignment-saved.png): returned Memory Details after Save.
- [03-cancel-preserved.png](evidence/sb40-organization-20261108/03-cancel-preserved.png): returned Memory Details after Cancel.
- [04-query-return.png](evidence/sb40-organization-20261108/04-query-return.png): preserved Find query and correct result.
- [05-final-home.png](evidence/sb40-organization-20261108/05-final-home.png): Home after process relaunch.
- `verification.json`: exact count, delta and preservation assertions.
- `evidence-sha256.json`: full local evidence inventory.

An empty `protected-baseline.json` records an initial read attempt against the shut-down device; it is not evidence. The valid protected-device comparison uses `protected-static-baseline.json` and `protected-static-final.json` and did not boot the device.
