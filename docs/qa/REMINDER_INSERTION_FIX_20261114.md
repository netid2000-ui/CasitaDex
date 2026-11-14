# Existing reminder title insertion — QA fix

The existing reminder title corrupted rapid inserted characters: INSERT became IRT NSE. The regression checks contiguous inserted text and preservation of the original text without assuming the tap places the cursor at the end.

## Implementation

Only the local Plus iOS QA reminder title opts into native-owned editing. UIKit retains its text and selection while typing; onChangeText still updates the form state used for saving. An effect updates native text only when the external value differs from the latest native value, including asynchronously loaded reminder titles. The initial default value uses stable state. Other inputs retain their existing controlled behavior; public builds, Android and SB40 do not opt in.

## Native evidence

- r1: reproduced corrupt insertion before Save.
- r2: could not find the fixture in Upcoming because its due time had elapsed; no input conclusion.
- r3: exact contiguous insertion, Save, cold restart, second insertion, and Cancel rollback passed.
- r4: final source verification includes existing-title regression and linked reminder prefill/insertion/submit, Save returning to the originating Memory Details, and restart persistence. Final totals appended below.

Only the disposable simulator fixture title was reset between r3 and r4; the original QA collection was not changed. No photo acceptance repeated. Evidence and raw native results are on the Mac external SSD under QA-Evidence/CasitaDex-Plus-Window-20261114.

## Limits / next

This closes the reproduced simulator insertion defect for reminder titles, subject to final checks. Physical iPhone typing/IME and Android acceptance remain pending. Full-edit/Add Memory taxonomy inputs and the existing Adding a Reminder header on an edit route remain separate work. Notification delivery/tap routing is not qualified here. No release approval.

## Final checks

Native r4: 2 passed / 0 failed. Independent SQLite verification passed: exact edited title, unchanged other fields, exact linked reminder title/notes and memory ID, canceled insertion absent, memory payload unchanged. Original 90-memory QA payload SHA-256 remains d6ba01f3dfa95a06097d58870a686f85bb2c3373ecc430e20602df3ac3bf93c0. TypeScript typecheck, ui.tsx ESLint, Python syntax and git whitespace checks passed. Figma status node 1006:17 records closure of the reproduced QA defect with physical qualification still pending.

[Evidence](evidence/reminder-insertion-20261114).
