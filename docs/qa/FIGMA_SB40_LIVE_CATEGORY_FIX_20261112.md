# Figma SB40 live category checkpoint — 2026-11-12

Scope: Figma prototype only. SB40 app source and installed apps unchanged. No native photo tests repeated.
File: 39uzN0SZX8nlmcGDcHdQhr. Page: 398:2.

## Fixed
- Category toggles 987:133/136/139/142/145 now toggle their marker first and compute summary through 32 independent marker-based conditions. No mutable summary snapshot condition.
- Save 994:122 preserves existing markers and adds Warranties.
- Missing Maintenance indicator binding repaired at 987:138 -> VariableID:956:7.
- Created-category summary 994:81 bound to VariableID:956:4.
- Review board 1006:6 and 1006:17 updated.

The multi-block conditional attempted earlier persisted only two blocks; nested conditionals were rejected. Final saved approach uses supported flat conditions. Earlier static all-state results do not establish live browser acceptance.

## Live Safari evidence on FA-MAC-DEV-01
Real accessible prototype buttons clicked; observed URL and visible control text after each.
1. None clears selection.
2. Appliances shows checkmark.
3. Maintenance also shows checkmark.
4. Create new -> 994:112.
5. Cancel -> 987:74; both retained.
6. Create new -> 994:112.
7. Save -> 994:49; summary Appliances, Maintenance, Warranties.
8. Categories -> 987:74; all three checkmarks present.
9. Maintenance deselected; others retained.
10. Done -> 1005:2; summary Appliances, Warranties.

PASS for this bounded journey. Not all 32 combinations exercised live.
Earlier live run also observed Manuals and Seasonal selecting and surviving Create-new Cancel.

## Remaining
Dark Find to Memory Details and originating filtered-result return; live Space create/cancel/save; owner design approval. Native-photo evidence remains closed except previously documented bounded gaps.
