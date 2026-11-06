# Current native acceptance ledger — November 6, 2026

**Verified partial milestone snapshot. Release remains NO-GO.**

This receipt-only consolidation preserves the historical planned matrix without changing its original NOT_RUN entries. Current runtime scope is bb235cdf6f2bba63b1760038a379a2c09cdf32ab; historical 737eac1 and a8867c0 evidence is separately attributed. No new tests, build, device actions or app/source edits were performed.

## Source and runtime separation

Newer reviewed source 5dc930e280b43e9ffe5553a8c5c63fc6aa86eacb fixes iOS focus after reflow in source only: 582 tests, 577 passed, 5 skipped, 0 failed; 49 focused checks, typecheck and lint passed. The native observations in this timestamped snapshot identify bb235 through the photo checkpoint at 15:58:24 UTC. Newer immutable-artifact rotation testing is tracked separately. The newer exact 5dc iOS build and same-identity preserving upgrade are verified separately: all nine logical tables and media matched immediately and after first launch, with the previous app/data retained. Rotation/keyboard acceptance is in progress. The bb235 landscape FAIL remains in its historical artifact cell and is not overwritten by source or build success. Oversized-field caret usability remains an explicit acceptance requirement.

The installed checkpoint is now iOS 5dc930e and Android bb235. This does not alter the older bb235 case results below.

## Exact bb235 snapshot artifacts

- Android QA APK: 41518e7db8705aec54f66668831097f97e6a052234b34e4295477609fd5e4456. Embedded Hermes: aa26242793e755dc29301b08d31e2bf50bfaf74fb4a1c1be37ee01abfff7d1e1.
- iOS unsigned Release arm64 Simulator executable: 92fafba2cb7340092388e9baf5bda9f37223e0707111823aaa010c02278441c8. Packaged Hermes: 6fe506779d254a58231c3d521cd85c05f45691bcb316da3f3fee40d1931330ba.
- Dependency lock: 7767f310cb183d9e2de29deed82d79ee7cd9a08dd29bddf5a979474fe7c856c7.

## Original composite journeys, bb235 artifact snapshot only

PARTIAL means useful bounded evidence exists, not that the named composite journey passed. NOT_RUN means no qualifying current-artifact receipt, even where historical evidence exists. Each cell's exact source, artifact reference, evidence hash, covered scope and remaining scope is recorded in [the accompanying ledger](SB121_CURRENT_NATIVE_ACCEPTANCE_LEDGER_20261106.json).

| Case | Journey | iOS | Android |
| --- | --- | --- | --- |
| D01 | Detail origin, exact identity and Find context | PARTIAL | PARTIAL |
| D02 | Edit Cancel, durable Save, validation failure and relaunch | PARTIAL | PARTIAL |
| S01 | Separate Share defaults, selection and correct return | PARTIAL | NOT_RUN |
| S02 | OS text/photo sheet cancellation and exact local payload | PARTIAL | NOT_RUN |
| S03 | Repeated exits, background/stale preparation and source change | NOT_RUN | NOT_RUN |
| A01 | Detail/Edit/Share maximum text, landscape, keyboard and contrast | FAIL | PARTIAL |
| A02 | Actual screen-reader focus, speech and return | NOT_RUN | NOT_RUN |
| R01 | Notification target routing and dirty-edit deferral | NOT_RUN | NOT_RUN |
| P01 | Pre-existing record, draft, media and reminder preservation | PARTIAL | PARTIAL |

Across these 18 composite cells only: 0 complete PASS, 9 PARTIAL, 1 FAIL, 8 NOT_RUN. These are coverage counts, not test totals or a native acceptance percentage.

## Verified progress and limits

- Current Android bounded keyboard/rotation/Cancel/Save/relaunch passed at system text 200% with app Large Text off. Combined extremes, broader Share/contrast/themes and manual TalkBack remain open.
- Current iOS preserving upgrade passed. Settled portrait typing/refocus passed at combined text extremes. Landscape rotation leaves the focused field outside the visible viewport: FAIL, repair and exact-artifact retest required.
- Current Android native PNG import/view/return, Full v4 SAF export, exact embedded photo bytes and draft/photo/reminder restart readback passed within a one-photo synthetic scope.
- The source gate remains 557 total: 552 passed, 5 skipped, 0 failed. The later fresh-archive engine run passed 5/5 with zero skips, separately. It did not rerun the full suite or restore the actual app.
- Historical a886 normal-clock delivery and cold/background/foreground notification taps passed only on the documented a886 artifact. All three alerts delivered while terminated; warm states describe tap lifecycle. Literal Return and current-artifact notification routing remain untested.
- Historical 737 Detail/Edit/Share and automated audit evidence is useful history, not current-artifact closure. Automated audits do not establish manual VoiceOver/TalkBack.
- Preservation receipts distinguish existing nonempty data from newly created synthetic domains. Empty media/reminder upgrade baselines cannot certify preserving pre-existing nonempty domains.
- Current iOS bounded one-photo workflow passed: image rendering, zoom buttons and Close, photo-only Save preserving the original record, selected-only ZIP/native-sheet cancellation, state/media equality after process relaunch and Find reopening. Pinch gestures, five-photo limit, wider edits/combinations, extreme text and manual reader acceptance remain untested.
- The bb235 photo preservation assertion covers the complete eng_state_v2 envelope and media, not an exhaustive all-table restore. The separate 5dc upgrade compares nine logical tables and media but does not perform collection restore.
- [Editable Figma REVIEW reconciliation](SB121_FIGMA_CURRENT_REVIEW_20261106.md) is complete with approved masters untouched. The review uses current source and explicitly historical 737 native pixels. Current broader visual/accessibility/owner acceptance is not implied. Compact-thumbnail and searchable-selector register differences are review opportunities with mandatory current status NOT ESTABLISHED, not newly imposed release gates.

## Remaining release gates

Approved Android native restore and offline runs are separately in progress; no result is incorporated here. iOS restore and strict offline acceptance remain open and untested. Manual screen-reader acceptance is NOT_RUN. Figma parity, current notification/return matrix, wider photo/limit/viewer cases, final virtual regression, physical-device acceptance, owner iPhone signoff, distribution signing and store release remain open.

Security is bounded: affected tooling exclusion is verified for exact bb235 Android packaged JavaScript. The bb235 iOS map gap remains historical. For the newer exact 5dc iOS build, strong build provenance and JS-to-Hermes binding now support mapped-inventory exclusion across 1,269 sources. Stock deletion of raw maps prevents independent recomposition. This supersedes the missing-inventory gap only for 5dc, not overall security or older artifacts. Both moderate build-tool advisories remain open. See [the exact iOS reachability report](SB121_IOS_MAPPED_RUNTIME_REACHABILITY_20261106.md).

## Integrity and coordination

The existing frozen manifests were rehashed successfully: Android keyboard 67/67, Android archive 69/69, a886 linked reminder 86/86 and current iOS photos 56/56. These 278 entry checks verify retained evidence integrity, not 222 app tests. The JSON catalog includes exact receipt hashes; raw data, screenshots, device identifiers and binaries remain outside Git.

The historical plan hash and source worktree state were captured. This documentation-only milestone preserves the original plan and all older artifact attributions. Newer 5dc native rotation results must be recorded separately when verified; this snapshot does not wait for or predict them. No release/main merge, production deployment or store submission follows.
