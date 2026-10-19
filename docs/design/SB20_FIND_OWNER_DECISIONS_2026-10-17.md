# CasitaDex SB-20 — Find design decision log
Date: 2026-10-17. Owner: Designs by F&A.
Status: design in progress; NO app implementation authorized.
Baseline: Home Functional & Visual Specification v1.1 approved separately.

## DECISION 1 APPROVED — Instant local search
Find results update while entering or deleting query text. Home continues to use unified GO navigation into Find. No cloud search required and no inferred/fabricated household answers.

## DECISION 2 APPROVED — Optional Spaces and Categories
- Both organization methods are supported, created on demand and never mandatory before saving a memory.
- Space means WHERE: optional zero or one primary Space per memory (examples: Kitchen, Garage, Backyard).
- Categories mean WHAT: optional zero or more categories per memory (examples: Family, Recipes, Maintenance).
- Memories with neither still save, browse and search normally.
- Add must allow creating Space/Category while preserving an in-progress draft.
- Find must permit searching without filters; browsing/filtering by Space and Category alone or combined with text, with visible removable filter state.
- User-defined names can be renamed safely; deleting an organizational label must never delete a memory. Avoid orphaned records, duplicate labels and data-loss during migration/restore.
- Existing fixed Buy/Fix/Find/Maintain context values are not interchangeable with custom categories; decide their relationship before implementation.
- Current model has Spaces but no multi-category relationship: implementation will require backward-compatible persistence, local backup/restore and migration design, later and separately approved.
- Keep implementation on hold. Next design area: Find result-card hierarchy, answer-first presentation, filters and Add relationship. Final Find signoff remains pending.

## DECISION 3 APPROVED — Answer-first result cards
Find result cards prioritize the saved answer, with smaller title and optional Space and one Category for disambiguation. Truthful verification cue only when necessary. Cards remain single accessible tap targets to Answer Detail. No fabricated answer text. Owner also requests easy deletion and protection against an accumulating junk drawer: deletion, recovery, bulk organization, stale-data handling and retention are OPEN DESIGN ITEMS, not implementation authorizations. Do not implement irreversible deletion or data migrations before separate owner decision.

## DECISION 4 APPROVED — Memory cleanup and storage-pressure review
Owner chose Option B: Edit, Archive, Delete, Restore, optional multi-select bulk cleanup, and non-destructive duplicate suggestions. Add REQUIRED cleanup CHECK when local data size/storage pressure becomes an issue. This means a compulsory health check and prominent review path, NOT mandatory deletion; user retains control. App must calculate local storage use (records, media, trash and backup-related copies where accessible), distinguish app reclaimable bytes from device-wide free space, and provide per-group visibility. On thresholds: alert, open review, allow safe dismiss/snooze when not at critical risk, and protect saving/data integrity in genuinely insufficient-storage conditions. Recommend a transparent warning/critical state with percentage and absolute remaining free space, using platform-reported available capacity, and periodic/relevant-event checks. Threshold values and policy, 30-day Recently Deleted suggestion, media/backup retention, permanent deletion confirmations, and emergency write behavior remain pending owner signoff. No silent purge of memories or media. Archiving does not reclaim bytes. No source code, schema migration, cleanup or automated deletion authorized during SB-20 design.

## RETENTION POLICY APPROVED — 30-day Recently Deleted recovery
Owner selected Option B: Deleted memories move into a recoverable Recently Deleted state for 30 days. After 30 days, they are eligible for permanent purge under the disclosed retention policy, without silently deleting active or archived memories. Before engineering: define durable deletion timestamps and local calendar/clock-change behavior; atomic permanent cleanup of record/media associations; backup/restore boundaries, partial failure recovery and storage reclamation validation; explain that moving into Recently Deleted does not necessarily free bytes. Provide explicit restore and earlier permanent-delete controls. No implementation now.

## Mandatory storage pressure review remains APPROVED
A required storage health check/review path is triggered by significant device or CasitaDex storage pressure. Never force the user to choose a record to delete. Critical conditions require safe prewrite checks and avoid partial corruption; numerical thresholds are proposed, not signed off.

## DECISION 5 APPROVED — Weighted relevance and safe recovery
Owner approved Option B: deterministic offline relevance ranking favoring exact title and strong title/answer matches, including multi-word and prefix matches, with stable tie-breakers and honest no-results recovery. Case/spacing/punctuation normalization must avoid conflating materially different part/model numbers. Never fabricate or semantically invent household answers; optional correction suggestions must be clearly identified, not silent substitutions. Exclude Archived and Recently Deleted from default results; honor active Space/Category filters; preserve query/filter state upon navigation. Ranking weights and benchmarks are engineering evaluation items, not owner-approved numeric scores. Next design reviews: filter controls, Answer Detail, verification actions. No code implementation or migrations authorized.

## FILTER LAYOUT APPROVED — Spaces and Categories visible
Owner approved Option B: show Spaces and Categories directly under Find search; Verification, Reminders and Attachments under More filters. Active filter chips can be removed individually and Clear all removes filters while preserving query. Combined filters and state restoration remain subject to precise UX refinement. Find continues to exclude Archive and Recently Deleted from default active results. Next design: Answer Detail, user-directed verification statuses, source evidence, editing/sharing/archive/deletion actions. NO application implementation authorized.

## ANSWER DETAIL VERIFICATION PRESENTATION APPROVED — Option B compact summary
Owner approved Option B: compact verification summary within Answer Detail below the prominent answer, presenting accurate status (Verified / Needs checking / Unknown), existing known source description and last verified date where recorded, plus a one-tap Review action for changes and history. Omit missing metadata rather than inventing it. Verified is explicitly user-confirmed against a recorded source, not independently certified. An answer edit resets status to Needs checking; navigating/viewing does not. Source-history storage, field editing, sharing preview, archive/delete controls, recovery, and acceptance remain in owner design review. NO app code, schema changes, pushes, builds, or migrations authorized.

## EXPANDABLE VERIFICATION PANEL APPROVED — Option B
Owner approved Option B: Answer Detail displays compact true verification status, known source and last verified date immediately under answer; Review expands source details, intentional status controls and verification history inline, preserving Answer Detail context. Verified requires user source confirmation; substantive answer changes reset status to Needs checking. No implementation authorized. Consolidated Find/Answer Detail owner signoff remains pending.
