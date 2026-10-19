# CasitaDex — SB-20 Implementation Readiness Plan v1.0
Date: 2026-10-17 | Designs by F&A
STATUS: READINESS PLAN ONLY — NO IMPLEMENTATION AUTHORITY
Governing signed baseline: SB20_FINAL_INTEGRATED_DESIGN_OWNER_SIGNOFF_2026-10-17.md, Home v1.1, Find/Answer Detail v0.9, Add v1.0, More v0.9, cross-tab photo-only amendment. Principle: Fewer features. Faster answers. Offline-first; own data; no required account/cloud, ads, or core-feature paywall.
Repo evidence inspected read-only: C:\CasitaDex-Git branch prototype/bootstrap HEAD b940ccc as of review. Git worktree contains pre-existing modified docs/RECOVERY_RUNBOOK.md, src/app/_layout.tsx, src/screens.tsx, src/ui.tsx, untracked assets/ and design docs. DO NOT discard, overwrite, stage or commit without a subsequent explicit owner checkpoint.

## Gate R0 — Preservation and provenance (BLOCKING)
Before later authorized implementation: inventory and capture current git diff including untracked assets and design docs, SHA hashes, branch and HEAD; identify which pre-existing work is intentional, and obtain owner-authorized isolated dev working plan/worktree without overwriting files. Validate locally restorable snapshot INCLUDING untracked files before migration. Keep baseline and restore path separate, secure, encrypted if containing sensitive data. No source archive, worktree creation, clone, commit or backup is authorized by THIS plan.
Record tools/paths/runbook, dependency versions, Android environment, prior offline acceptance, and current test evidence. Never assume old commit b940ccc alone contains untracked approved assets.

## Gate R1 — Data contract and backwards compatibility (BLOCKING)
Design versioned model: Memory ID; meaningful title and optional answer with photo content invariant; zero/one optional Space; zero/many Categories; preserve old Context Buy/Fix/Find/Maintain; full source/verification histories, notes/location, reminder events; creation/update/due/deletion timestamps; Archive/Deleted states; media reference ownership; single unfinished Add draft with staged photos. Create exact schema/data version map for current v1 and historical import formats. No loss of existing IDs, answers, media or confidence. No synthetic Verified statuses or phantom history.
Produce before/after fixture examples, compatibility matrix (v1 -> new, old backups -> new, restore on clean device), deterministic rollback plan and owner review BEFORE running migrations. Leave unknown legacy values intact rather than forcing invalid Categories.

## Gate R2 — Persistence, draft/media lifecycle and recovery (BLOCKING)
Define transactional SQLite/persistence behavior and journal for record plus multiple media, interrupted image import, camera cancellation, file-picker staging, five-photo cap, document permissions, zoom and legibility. Source photo data must be app-owned and durable before success message; avoid revoked external URIs. One recoverable Add draft checkpointed after meaningful edits, never searchable until commit; backup includes draft and successfully staged media. Failure cannot erase last durable draft, duplicate Saved records, or create orphan photo refs. Media hash/manifest, reference integrity, cleanup and restore must be versioned and testable.
Lifecycle: Archive reversible and does not reclaim disk. Recently Deleted retains metadata/photos 30 days, safe eligible purge thereafter with clock-jump/interrupted cleanup protection, no active/archived auto-delete. Ensure deleted references remain recoverable until actual verified safe purge.

## Gate R3 — Cross-tab feature implementation sequencing (only AFTER explicit authorization)
Phase 0: isolated Development baseline/snapshot and tests; no Staging/Production/physical-device mutation.
Phase 1: model/data adapter and migration path with read-only previews, revert capability, fixture-driven tests.
Phase 2: durable media/draft/photo-only validation and backup-format upgrade; gate destructive migration.
Phase 3: Find/Detail, labels, verification and lifecycle; prove legacy lookup, search and recovery.
Phase 4: Add Quick Photo, five-photo cap, in-place labels, duplicate suggestions and single draft.
Phase 5: Home + More navigation/layout, storage/adaptive policies, backup and restore conflict UI.
Phase 6: end-to-end Android emulator tests, then separate owner-approved physical Android acceptance; no automatic production rollout.
Incremental gates must be passed before moving forward; allow splitting work into cohesive super-batches only once the owner separately approves implementation.

## Gate R4 — Adaptive storage and sensitive operations
Measure actual Android app/media space and usable device capacity; estimate final plus temporary write, backup and restore rollback headroom. Numerical warning/critical thresholds, hysteresis and API-failure fallback require measured emulator/physical-device evidence and owner approval. Check before photo imports, large saves, backup files and restore. Warn/review without forced deletion, and block only unsafe writes. Never report bytes freed from archive or soft-delete. No cloud integration, analytics, subscriptions or paid APIs.

## Gate R5 — Backup, restore and rollback (BLOCKING)
Portable FULL backup includes active/archived/recoverable-deleted records, media hashes/manifests, labels/verification/reminder data, one unfinished draft and successfully staged draft photos. Explicit backup schema versions; old format imports must be non-destructive and honest about omissions. Text-only export discloses excluded image media. Verify output file bytes/hash before 'backup created'. Test full restore in isolated environment; local file creation is not off-device disaster recovery. Confidential exports require owner-approved secure destination and encryption.
Restore: validate format, integrity, counts, projected storage, current collection and replacement scope. Preview and confirm; preserve recoverable original state and prove interruption rollback. After staged verified restore, switch authoritative collection safely. If existing draft and imported draft conflict: explicit Keep current draft / Use backup draft with old draft protected / Cancel; never silently overwrite, merge or drop. Imported deleted records retain deletion state and clock-safe 30-day recovery semantics.

## Gate R6 — Automated and native QA (all future, none executed)
Current package scripts include typecheck, test (node --test), lint, doctor and qa:ci; run ONLY after implementation authorization.
Unit/contract: photo-only Home text cue vs real Find/Detail photo; 1..5 photo import and six rejected; drafts survive interrupted writes/restart, safe identifiers/search, optional labels, legacy Context compatibility, verification transitions, due reminders, archive/30-day delete/clock change, full backup/versioned media plus conflict restore, low-space operation and truthful messages.
Android emulator for visual checks first, then separately owner-approved physical-device tests; airplane mode/reboot, TalkBack, font scale 130–200%, light/dark, keyboard, phone/landscape/foldable. Capture test artifacts, failure codes, screenshots and records; legacy Android offline acceptance does not automatically pass SB-20.

## Gate R7 — Separate owner implementation authorization
Implementation requires a new explicit owner authorization for isolated Development scope, protected dirty/untracked source, verified recovery, migration preflight, planned testing and stop conditions. Production, store, cloud, purchases and device modifications remain separately gated. Future authorized phase order: preservation -> versioned model/migration -> media+draft+backup -> Find/Detail -> Add -> Home/More -> emulator QA -> separately accepted physical-device QA.

## Readiness checkpoint
Design signed: PASS. Git branch/HEAD inventory: read-only PASS; preservation snapshot: OPEN. Safe migration contract: OPEN. Storage numerical policies: OPEN. Backup/version compatibility and rollback: OPEN. Native QA: OPEN. Owner implementation permission: NOT GRANTED.
No source changes, builds, schema migrations, commits, pushes or deployments authorized by this document.
