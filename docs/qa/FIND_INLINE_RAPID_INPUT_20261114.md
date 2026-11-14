# Find and inline editing — rapid input QA

The active Figma-first Find query, Location and Reference inputs reproduced missing characters during whole-string native typing. Memory-name editing passed both append and full replacement checks and was left unchanged.

## Change

In isolated local StoreKit iOS QA, Find now opts into the native text-view input while preserving Search-to-submit, keyboard dismissal, styling and controlled query updates. The shared Field workaround is enabled for Location and Reference in full editing and the separate inline Reference editor. Android, public builds and SB40 are unchanged. Long input can wrap rather than disappearing off-screen.

## Baseline evidence

- r1: Find and Reference lost characters; name append passed. Location missed the field during a large test scroll, so no input conclusion was drawn from that failure.
- r2: smaller scrolls reached Location and reproduced character loss. Full replacement of the existing name passed.
- No typing delay or autocorrect disabling was introduced. The source change is limited to inputs with reproduced failures; the separate inline Reference uses the same affected Field configuration.

## Acceptance scope

Native tests cover Find query integrity, Search submit, the matching result, details and return; full-edit name/Location/Reference save, cold restart and Cancel; and inline Reference save/restart. Final results and independent database verification follow.

Original QA collection protected through guarded simulator-copy setup. No completed photo acceptance repeated. Other taxonomy/reminder inputs and physical iPhone/Android checks remain pending.

## Final results

- Native r3: 4 passed, 1 failed. Full-edit name, Location, Reference and separate inline Reference passed. Find failed because the native text-view accessibility label includes its placeholder; no input conclusion from that locator failure.
- Native r4: 1 passed, 1 failed. Opening through the actual inline Edit Location action passed save/restart/Cancel. Find still failed its label-based locator.
- Native r5: 1 passed, 0 failed. A stable find-query test identifier resolved selection. Rapid whole-string query, Search submit without newline, one matching result, opening details and returning with the exact query all passed.
- Independent read-only SQLite verification: 19 saved records; four exact persisted edits; canceled UNSAVED text absent; no draft. The other 15 authored records are unchanged. Existing QA startup automatically replenished photos on sb26qa_007 and sb26qa_013; only their media IDs, updated timestamps and appended Photo added events differed. This was not photo acceptance testing.
- Original 90-record QA payload SHA-256 remains d6ba01f3dfa95a06097d58870a686f85bb2c3373ecc430e20602df3ac3bf93c0.
- Final screenshot visually checked: complete query and single matching result are readable. This isolated Plus QA shell shows Home/Photos/Reminders/Find tabs; that screenshot does not approve navigation parity with accepted SB40 Home/Find/Photos/Settings.
- TypeScript typecheck, scoped Find/answers ESLint and git diff whitespace checks pass.

Figma QA status updated at node 1006:17 in file 39uzN0SZX8nlmcGDcHdQhr. This records targeted input evidence only, not release approval. Source remains gated to local Plus QA. Next: remaining taxonomy/reminder input checks, followed by platform and physical-device qualification.

Evidence: [native summaries and database verification](evidence/find-inline-input-20261114), including [final Find screenshot](evidence/find-inline-input-20261114/find-query-preserved.png). Raw xcresults remain on the Mac external SSD under QA-Evidence/CasitaDex-Plus-Window-20261114.
