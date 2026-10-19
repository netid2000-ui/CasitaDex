# CasitaDex SB-20 — R2 Technical Design Owner Signoff
Date: 2026-10-17 | Owner: Designs by F&A
STATUS: APPROVED TECHNICAL DESIGN BASELINE ONLY — IMPLEMENTATION ON HOLD

Owner agreed to approve the R2 Media, Draft and Backup Integrity v0.1 design following recommendation to record it as the technical baseline. Governing spec: SB20_R2_MEDIA_DRAFT_BACKUP_INTEGRITY_V0_1_2026-10-17.md.

Approved intent: verified app-private photo staging; at most five photos per newly saved memory; one durable private unfinished Add draft; no invented factual answers; journaled saved-media association; safe interrupted-write reconciliation; protect active, archived, 30-day recoverable-deleted and draft/rollback media references; full backup includes staged draft photographs and supports explicit draft-conflict decisions during restore. Existing infrastructure is not proof new contracts are implemented.

Open engineering gates: exact draft schema/autosave timing, idempotent saves, atomic filesystem/SQLite recovery, reference counts and retention clock handling, portable backup format/version limits, restore rollback, storage thresholds and photo handling/accessibility native QA. All R2-01 through R2-12 acceptance scenarios are specifications, not executed passes.

No authority to change application source, database/schema, migration, build, commit, push, deployment, cloud services, purchases or physical-device state. Next allowed work is documentation-only R3 scope and phased readiness planning. Any implementation requires separate express owner authorization.
