# Release closure — November 17, 2026

Execution: FA-MAC-DEV-01 exclusively. Baseline bcd32bf; application source a39c37f. Branch work/cd-release-closure-20261117. Existing worktrees and QA data preserved.

## Owner acceptance

The owner reviewed the installed Samsung visual update and said, “Looks great. Let’s get this done.” This records acceptance of the approved Home artwork and horizontal action styling on Samsung. It does not imply physical iPhone sign-off, acceptance of every release scenario, or authorization to merge/release/submit.

## Reused verified evidence

- Approved editorial native batch: TypeScript/ESLint PASS; 538 tests PASS, 1 historical-artifact skip. Android emulator/Samsung normal and 200% light/dark targeted controls passed. iOS simulator normal/light and accessibility-large/dark passed. See APPROVED_EDITORIAL_NATIVE_20261117.md.
- Keyboard/Results sweep already complete for scoped portrait onscreen keyboards: 74 accepted Samsung observations. See KEYBOARD_FIELD_SWEEP_20261115.md; no need to repeat the entire sweep.
- Physical iPhone previous source 593de3d: actual foreground standalone notification tap and linked reminder Save return passed. Background/terminated notification taps require further evidence.
- Local Xcode StoreKit purchase, restore, pending/refund/error and delivery/unfinished-transaction recovery have passed scoped QA. PLUS_COLD_START_RECOVERY_20261114.md supersedes the older failed recovery checkpoint. These are local QA results, not production billing acceptance.

## Current work

Signed a39c37f physical iPhone QA build succeeded, signature verified, same com.designsbyfa.casitadex.plusstoreqa installed and launched. Private Documents backup taken before update. Physical iPhone 17 Pro Max now runs the approved source. Bundle SHA-256: 0aafd62494fe071f4d4561e1b2786cc0a27a5b93635225832c1d9790fc867e35. The first lifecycle run had 1 pass (terminated standalone) and 1 failure (background cleanup after exact destination already asserted). Screenshot review showed an unrelated third-party banner covering controls. The focused follow-up removes unrelated cleanup from the routing assertion and separately tests app controls: 2 passed, 0 failed (background exact reminder; Home/three selectors/photo Cancel). Original failed evidence is retained; no product source changes were required. Linked-memory terminated notification test passed after correcting the test title parser. Screenshot confirms the originating [SAMPLE] Coffee filters memory.

## Remaining release gates

| Gate | Status |
| --- | --- |
| Samsung visual owner acceptance | Accepted in this conversation |
| Physical iPhone updated visual/functional acceptance | Current-size dark Home/selectors/photo Cancel passed; owner sign-off and broader physical coverage pending |
| Background/terminated and linked-memory notification delivery/tap | Standalone background and terminated paths PASS; terminated linked-memory path PASS. Linked foreground/background permutations are not newly certified. |
| Physical camera/library permissions/import and VoiceOver/TalkBack | Not closed by the styling batch |
| Protected backup/restore, offline and failure-recovery final coverage | Reconcile existing scoped evidence; do not overwrite owner data |
| Real store products and billing | Public adapter is intentionally disabled; only local.casitadex.plus.qa is accepted by current checkout runtime |
| Android purchase parity and full Plus feature qualification | Open; local iOS StoreKit is not Android billing proof |
| Store assets/privacy/signing/distribution candidate | Final package review required after acceptance |
| Main merge/store submission/production release | Requires explicit owner authorization; none performed |

Household sharing remains deferred until native acceptance and release gates are closed.

## Test-attempt accounting

Initial lifecycle run: terminated standalone passed; background reached and asserted the exact reminder, then cleanup failed during an unrelated notification interruption. Focused follow-up: Home/selectors/photo Cancel and background destination passed, 2/2. Initial linked-memory run reached Memory Details but failed an incorrectly parsed title expectation (`photo` from `Open photo memory [SAMPLE] Coffee filters`). Corrected test extracts the full title after ` memory `; rerun passed, 1/1. These are retained failures, not retroactively counted as passing runs.

## Final preservation and status

Read-only before/after SQLite comparison: 90 memories unchanged, full state payload unchanged except revision 23→24, three image files hash-identical. All 11 pre-existing standalone reminder rows remain exactly present; five clearly marked QA reminders were added for the notification attempts. Remaining tables unchanged. Documents backups remain private on the Mac. Final QA app launch succeeded. Device appearance/text settings were not changed.

Four distinct physical cases accepted: approved Home/selectors/photo Cancel, standalone background notification, standalone terminated notification, terminated linked-memory notification. Across recorded attempts: four passing tests and two failed diagnostic attempts, both retained; do not describe all runs as passing. Physical tests used existing normal-size dark appearance; simulator light/enlarged evidence remains separate. The prior 538-pass/1-skip automated suite is reused because product source did not change in this checkpoint.

Evidence: [release-closure-20261117](evidence/release-closure-20261117/). Full xcresults and native build logs remain on the Mac under Apple-Builds/Release-Closure-20261117. No third-party notification screenshot or device diagnostics archive is published. No Figma design mutation was needed: the exact approved artwork and action controls were installed and reviewed on physical iPhone. Owner iPhone acceptance remains pending.

Next super-batch: qualify real-store product/entitlement configuration and Android billing parity; finish physical permission/accessibility and protected recovery acceptance; collect owner iPhone sign-off; prepare distribution metadata/artifacts for explicit submission approval. This checkpoint is progress toward release, not a release-ready or store-submitted claim.
