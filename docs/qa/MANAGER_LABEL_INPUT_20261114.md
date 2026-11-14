# Settings label creation and complete replacement

The Settings Label name field lost characters when typing into an empty input: Manager became Mger. The existing iOS QA native-owned text-view workaround is now enabled only for this field. Native editing retains text/selection while form state still receives changes for saving; selecting another label updates the displayed name through the shared Field synchronization.

## Native checks

The test creates a new Space and Category from Settings, restarts, selects each created label, uses Select All to replace the entire name, saves the rename, and restarts again. Both the empty-input burst and replacement text must match exactly.

r1 reproduced the empty Space input loss before creation. Final results and SQLite verification follow.

The change is gated to local Plus iOS QA. Public/Android behavior and installed SB40 remain untouched. Original QA data is preserved; no photo acceptance repeated. Physical devices and IME composition remain pending.

## Final results

r2 passed exact Space creation, save and restart, then stopped when the first long press focused the field without opening Select All. The test now focuses before long-pressing and uses the actual Select All control. r3 reused that saved Space and passed full replacement/save/restart; Category creation and full replacement also passed in r3. Native r3: 1 composite test passed / 0 failed.

SQLite independently verifies two exact renamed new labels, all pre-existing labels unchanged, all 19 memories unchanged, draft unchanged and media unchanged. Original 90-memory QA payload hash unchanged. Typecheck, Python syntax and whitespace checks pass. Figma status node 1006:17 reconciled.

[Evidence](evidence/manager-label-input-20261114).
