# CasitaDex SB-20 — Non-destructive Preflight
Date 2026-10-17. Documentation only; implementation on hold.
Repository C:\CasitaDex-Git, branch prototype/bootstrap, HEAD b940ccc5d605f35df6ac0aa31e7c2842a8694953.
Four modified tracked files: docs/RECOVERY_RUNBOOK.md, src/app/_layout.tsx, src/screens.tsx, src/ui.tsx.
22 untracked files examined: five branding images and seventeen design documents. Existing 26 modified/untracked files total about 10.6 MB before this report. Do not overwrite them.
Current Data model version 1 requires an existing Space ID and nonempty written answer. Categories are fixed Context values Buy/Fix/Find/Maintain. Native media_v2 stores attachments tied to saved card IDs, with 10 MB per-image constraint. Current portable media format CDXM2 has a 110 MB container size limit. These are migration compatibility gates.

## Migration compatibility matrix — proposal only
Existing v1 cards -> preserve exact IDs, title, answers, labels, existing reminder dates and source status. Empty answer in the new version only if valid associated photo exists; never synthesize photo-derived text.
Required existing Space -> preserve all existing assignments; allow unassigned in NEW schema only, without rewriting historical default assignments.
Fixed Buy/Fix/Find/Maintain Context -> preserve as distinct legacy metadata; introduce new user-defined Categories separately; do not automatically conflate them.
Existing cards -> default active on conversion; no invented archive or deletion timestamps.
Existing media_v2 IDs and hashes -> retain attachment references and contents; new draft photos staged privately with integrity journaling.
Existing v1 text backups -> version-aware safe legacy import, noting missing photo data.
Existing CDXM2 full media backups -> preserve decoder and media integrity, define new version with lifecycle, Categories and unfinished draft/photos.
Prior verification and due data -> carry exactly, no invented source evidence or reminder completion history.

## Recovery plan (proposal only)
1. Recheck branch, HEAD, tracked modifications and untracked assets before further work.
2. Record file size, hash and path for every changed or untracked artifact.
3. With separate approval, capture clean Git history, working-tree patches and ALL untracked art/docs in protected external snapshot. Git history alone is insufficient.
4. Independently verify the snapshot by hash and test restoring into an isolated location, never the authoritative repo.
5. Only later prepare an isolated development workspace, preserving the authoritative dirty worktree unchanged.
6. Stop on hash mismatch, incomplete recovery, unsafe storage, or migration incompatibility.

## Owner gates
R0: owner selects protected snapshot location and authorizes creation/restore verification.
R1: owner accepts versioned field mapping and old-backup compatibility tests.
R2: owner accepts media/draft integrity and rollback test plan.
Implementation remains on hold.
