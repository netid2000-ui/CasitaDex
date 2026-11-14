# Native label editing and rename acceptance

Mac-only QA on FA-MAC-DEV-01 with the disposable boundary simulator. Test labels are synthetic; accepted SB40 and the original QA collection are preserved. Completed photo acceptance is not repeated.

## Coverage

Two native tests each exercise two labels: Space and Category labels assigned to a saved memory, and Space and Category labels assigned to the retained draft. Each selects an existing label, inserts RENAMED in one burst, checks exact character order and preservation of the original text, saves the rename, restarts, reopens the label editor, and verifies that the memory/draft displays the changed name.

The tests deliberately do not assume tapping an existing text field positions the cursor at the end. The inserted text must remain contiguous and removing it must reproduce the exact original value.

Independent SQLite verification requires all four label IDs to remain unchanged, only the intended names to differ, and all memories, the draft, media, and save-attempt state to remain identical.

No application source changes have been made in this checkpoint. This qualifies the tested native rename flow; whole-value replacement, blank-name creation in the manager, IME composition and physical-device acceptance remain outside this test.

## Initial results

r1: Category test passed both saved-memory and retained-draft labels. Space input and save succeeded, but the test expected a trailing space that the store correctly trims. The test now compares the normalized saved name after first verifying exact raw input. Only the disposable Edit Space fixture name was reset before rerunning the Space test; Category evidence is retained.

## Final verification

Category cases passed in r1; corrected Space test passed both cases in r2. All four intended renames are exact after normal trimming and survive restart. SQLite verifies stable label IDs, unchanged other labels, all 19 memories unchanged, draft unchanged, media unchanged and save-attempt state unchanged. The original 90-memory QA collection is unchanged. No application fix was needed. Python syntax and whitespace checks passed. Figma status reconciled at node 1006:17.

[Evidence](evidence/label-rename-20261114). Physical-device acceptance remains pending.
