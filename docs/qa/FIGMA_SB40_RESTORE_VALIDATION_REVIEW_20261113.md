# Restore validation alerts prepared

Source inspected read-only in SB40 worktree: eng-runtime.native.ts:147 rejects backups above 154 MB before preview; eng-text-backup.ts:16 rejects unsupported version/fields; eng-store.ts:467 rejects changed standalone reminders during reviewed restore transaction.

New Figma review states: 1238:2 backup too large; 1238:43 unsupported text backup; 1238:84 reminders changed since review. Reused approved inline alert pattern from 1217:2 with plain-language design copy. Choose another backup / Review backup again routes to existing chooser 875:49. This restarts the prototype selection/review flow; no actual picker or native retry claimed.

All retain 91pt persistent Settings header and permanent export options. Structural mutation results and all three screenshots reviewed. Board 1006:17 updated. Owner approval pending. New friendly wording requires later native implementation.

No source edits, actual restore, native tests or repeated photo testing. Current-page text scan found no matching preexisting unsupported-backup or reminders-changed message; other pages were not exhaustively rescanned.
