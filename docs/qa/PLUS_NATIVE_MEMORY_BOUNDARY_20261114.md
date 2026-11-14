# Native memory boundary — 2026-11-14

Scope: exercise the isolated iOS QA app at the free-plan boundary without changing accepted SB40. No production purchases or photo acceptance rerun.

## Test setup and recovery

A simulator copy named CasitaDex Memory Boundary Isolated QA was created from the existing QA simulator. Its initial container lookup unexpectedly pointed to the original simulator. Fixture preparation therefore briefly changed the original ENG snapshot. The saved original snapshot was restored byte-for-byte and independently verified: 90 memories, payload SHA-256 d6ba01f3dfa95a06097d58870a686f85bb2c3373ecc430e20602df3ac3bf93c0. This was a QA setup incident, not an SB40 data change.

The preparation script now requires the named, booted boundary device and rejects any container path lacking that device UUID before writing. The original simulator stays stopped while the copy is tested. The fixture uses 19 saved synthetic memories and a prefilled twentieth draft. No original photo files are removed.

## Attempts retained

- r1: launch stopped because the expected Simulator.app path was absent. The installed Xcode 27.2 uses DeviceHub.app.
- r2: failed against the wrong initial fixture; no boundary pass claimed.
- r3: twentieth save and twenty-first rejection succeeded, but the final draft-title assertion found missing characters from burst automated typing. This is not treated as a passing persistence test or proof of a fixed input issue.
- r4: paced character entry with explicit pre-save value assertions, then native save/rejection and cold restart. PASS: 1 native test, 0 failures, 50.49 seconds.

## Follow-up

Rapid-entry character loss needs a separate focused investigation; paced entry does not qualify rapid typing. Physical iPhone acceptance and Android purchase parity remain pending. Public checkout remains disabled.

## Final evidence

Native UI and independent SQLite verification passed: exactly 20 saved records, the twentieth saved once, no twenty-first saved record, both draft title and description preserved, and the blocked save attempt not consumed. The screenshot shows the inline refusal and fixed controls; keyboard remains open. Long status copy takes substantial vertical space and can be shortened in a later usability pass.

[Final native summary](evidence/plus-native-memory-boundary-20261114/r4-summary.json) · [Database assertions](evidence/plus-native-memory-boundary-20261114/database-verification.json) · [Original QA recovery verification](evidence/plus-native-memory-boundary-20261114/original-collection-verification.json) · [Screenshot](evidence/plus-native-memory-boundary-20261114/blocked-native-save.png)

Earlier failed native summaries remain alongside the passing summary. Scripts passed syntax and diff whitespace checks. Application source is unchanged in this checkpoint; additions are test, preparation guard, verification and evidence only.

Figma status board reconciled: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1006-17
