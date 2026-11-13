# Limited-backup exclusions reconciled

Read-only source verification on Mac mini SB40 worktree at d1a34cb144501f590e8bdf09cd7666a057bf0539.
Evidence: src/eng-text-backup.ts:5,10 excludes photo-only memories, saved photos and draft photos; src/eng-screens.tsx:475 explicitly excludes standalone reminders; :478 distinguishes retained memory reminders. src/eng-runtime.native.ts:176 confirms limited-backup photo exclusions and report non-restorability.

Updated Figma 875:190 and 875:216 to consistently name photos, photo-only memories, and standalone reminders. Preview additionally recommends full backup for complete recovery. Board 1006:17 updated. Both post-edit screenshots reviewed; text fits, controls retained, completion Back remains persistent. Corrected wording awaits owner review; prior layout approvals retained.

No top-level error/invalid/failure/unavailable/corrupt-named screens found on review page 398:2. This is not proof of absence of nested error states. Next work: map exception presentation from source and existing nested states before creating missing screens.

No source edits, real exports, native tests or repeated photo testing.
