# Space, Category and reminder input checkpoint

Local StoreKit iOS QA on FA-MAC-DEV-01, isolated simulator 81FC3CCE-ACEB-4957-BE61-C9C653A4CE56. Public builds, Android and accepted SB40 are unchanged. No photo acceptance repeated.

## Implemented

The existing QA-only native text-view workaround now covers inline Create Space / Create Category and Reminder title. All three baseline burst checks reproduced Boundary becoming Bndary. No typing delay or autocorrect disabling was introduced.

## Evidence and limits

- r1: 0 passed / 3 failed, each at exact rapid-input equality.
- r2: 1 passed / 2 failed. All three exact rapid-entry assertions passed. Space create/assign/restart passed. Category saved and assigned correctly but the test expected a standalone label; actual text combines existing Kitchen and the new category. Reminder title and notes saved exactly, but the test stopped at post-save return while the editor was busy.
- r3: both taxonomy assignments found after restart; exact saved reminder title and notes reopened; Save returned with permission handling. A later assertion failed: typing UNSAVED into an existing title produced ` VEDUNSABoundary rapid reminder 20x25x1`. Tap cursor position was not explicitly fixed to the end, but VEDUNSA character order is still incorrect. Existing-title insertion remains an open defect, not accepted.
- r4 isolates Cancel rollback using a confirmed dirty value, without claiming existing-title typing correctness. Final outcome recorded below.

Next priority: reproduce and repair existing reminder-title insertion/cursor behavior, then qualify full-edit and Add Memory taxonomy inputs. Physical iPhone/Android acceptance, linked reminder save-return and notification-tap behavior are not qualified by this checkpoint. Overall release remains NO-GO.

[Evidence](evidence/taxonomy-reminder-input-20261114). Raw xcresults remain under QA-Evidence/CasitaDex-Plus-Window-20261114 on the Mac external SSD.

## Final verification

r4: 1 passed / 0 failed. Both assignments survived restart; exact reminder title/notes reopened; Save returned; a confirmed dirty edit was canceled and reopening showed the original title. This does not resolve the r3 insertion defect. Independent SQLite verification passes: 19 memories, two exact assigned taxonomy additions, other 18 memories unchanged, exact reminder title/notes, no canceled title text persisted. Original 90-memory QA payload hash unchanged. Typecheck and whitespace checks passed. Figma status reconciled at node 1006:17.

Visual evidence: reopened title and fixed Cancel/Save controls are readable. The QA shell still labels this edit route Adding a Reminder above Edit reminder; label reconciliation remains open. Its navigation is not accepted SB40 parity.
