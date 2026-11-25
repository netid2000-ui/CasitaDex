# Research-informed CasitaDex expert review and acceptance ledger

November 25, 2026. Desktop source and existing evidence review, not a fresh native run. Reviewed [Nov 24 professional review](professional-sweep-20261124/README.md), [native observations](professional-sweep-20261124/native-observations.md), [current Figma authority manifest](../design/figma-authority-manifest.json), and [historical source-control mapping](WORK_SB47_FIGMA_SOURCE_MAP.md). The former Nov 24 report records 546 tests passed, one skipped, zero failed; iOS traversal did not produce a final suite verdict. Do not carry those counts forward as current execution.

## Findings

| Priority | Finding | Disposition / current acceptance |
|---|---|---|
| P0 | Installed QA simulator identified but exact source/build pairing not proven | Verify current accepted SB40 lineage and later approved changes before rebuilding or testing. No new build installed. |
| P0 | Current iOS suite completion, physical owner iPhone backup/restore and approved store sandbox boundaries remain open | Confirm sandbox only; verify before/after photo/record/reminder counts and hashes from synthetic fixture, including return navigation and failure state. |
| P0 | Find archive/recently deleted and exact household search verified in prior Nov 24 Samsung walkthrough | Rerun with 75 synthetic household memories, similar terms, dimension searches, pagination and originating position. |
| P0 | Duplicate chooser names observed in Android accessibility tree | Treat as actionable accessibility finding; verify actual TalkBack and VoiceOver, then correct and retest labels on approved design. |
| P1 | Empty optional fields occupy Memory Details screen | Candidate compact layout only; preserve accepted functionality and obtain owner design decision before changing. |
| P1 | Photo viewer entry/return observed, all gestures not retested | Retest pinch/double-tap, prev/next, tapped return, attached/unattached and backup transfer. |
| P1 | Existing Figma page manifest mixes older baselines and newer separate nodes | Exact component mapping and current native comparisons are open; no claim of visual equivalence. |
| P1 | Java/ADB shell resolution blocks reliable Android automation | Reuse installed tooling with verified environment path; don't buy replacements. |

## Deliverables and next execution

The [workflow matrix](research-informed-workflow-matrix.json) defines 12 workflow groups, 27 unique source-test file references, historical evidence and current NOT_RUN statuses. It covers entry/exit, abnormal paths, and relevant Figma nodes when already documented. Use [source QA runner](../../scripts/fa-research-qa.mjs) for plan validation and Mac-only source checks. The first source check must also establish the candidate's exact source state and intended build. Native case rows are not automatically marked passed by a source run. Figma still needs exact current node/variant and native comparison for every applicable screen and control.

Owner decisions retained: the four primary tabs, required title, optional taxonomy, local-first/offline data, separate photos, Free 20 memories, $25.99 one-time Plus with backup/recovery, household sharing deferred. No app code or builds were changed by this governance review.
