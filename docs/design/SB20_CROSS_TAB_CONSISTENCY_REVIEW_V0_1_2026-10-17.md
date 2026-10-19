# CasitaDex — SB-20 Cross-Tab Consistency Review v0.1
Date: 2026-10-17 | Designs by F&A
STATUS: DESIGN REVIEW — FINDINGS AND RECOMMENDATIONS, NOT IMPLEMENTED NOR NEW OWNER SIGNOFF
Inputs: signed Home v1.1; Find/Answer Detail v0.9; Add v1.0; More v0.9; Charter Amendments D-F.
Governance: no app code, migration, build, commit, push, deployment or device operations authorized.

## Invariants
NAVIGATION: Four tabs Home/Find/Add/More, Home GO trimmed query to Find, blank GO default Find, Save a memory to Add, recently saved See all to Find, reminder See all to due-filtered Find, cards to Detail; returning to Find should preserve query/filters/scroll.
ORGANIZATION: Space optional zero-or-one for where; Categories optional zero-or-many for what; no mandatory selection; create and rename/delete without deleting underlying records; visible in Find filters, Add/Edit and More management. Home remains compact.
CONTENTS: meaningful human title plus answer OR photo; max five photos per newly added memory; user-saved text always authoritative, no fabricated photo interpretation. Photo-only result needs actual thumbnail and 'Photo memory' cue, with searchable title/metadata. Earlier signed Home says title+answer ONLY and NO images: open cross-screen conflict F1.
VERIFICATION: New Unknown; user verification source required for Verified; material answer edits reset Needs checking; verification review inline Detail. Home never displays Needs checking queue/badge.
REMINDERS: Home due today/overdue up to 2, oldest overdue first; active reminder Find filter; Archive/Deleted suppress Home reminders.
LIFECYCLE: Archive separate, reversible and not byte reclamation; Recently Deleted 30-day recovery including media, safe expiry purge; More entry points.
DRAFT/MEDIA: One recoverable local autosaved draft; full backup includes draft+staged photos and restore conflict review. Share media opt-in.
STORAGE: Adaptive capacity+operation check; guided pressure review, never forced deletion.
BACKUP: Free manual full photo+text backup; text-only explicitly excludes photos; local-only never falsely called backed up.
ACCESSIBILITY: 48dp touch targets, safe insets, OS text scaling, TalkBack, light/dark and compact/landscape/foldable QA.

## Cross-tab findings
F1 HIGH — Home: signed compact recent card says title+answer only and NO image, but Add permits photo-only with no answer. Proposed bounded design amendment for photo-only records: title plus honest text cue 'Photo memory', no image, no invented answer. Text-bearing cards unchanged. Owner decision required.
F2 HIGH — Find/Detail: signed answer-first results primarily assume saved written answer; Add accepts photo-only. Use real thumbnail plus clear photo cue, user title/optional labels searchable; no OCR or fabricated text. Card schema/backup validation must handle empty answer when valid photo exists.
F3 MEDIUM — Legacy Buy/Fix/Find/Maintain context versus user-defined Categories and Spaces: keep existing metadata and search intact through versioned migration, no silent conversion or missing labels.
F4 HIGH — Full backup/restore: existing native photo+answer backup predates newly approved single draft, draft staged images, Archive and Recently Deleted. New portable version must preserve each lifecycle state, images/manifest, owner-approved draft conflict, rollback and old-format recovery. Do not claim current runtime supports them.
F5 MEDIUM — Reminders: Home due/overdue only, Find filters and Detail edits; Archive/Deleted suppress active reminders, restoring recomputes eligibility without fabricated completion events.
F6 MEDIUM — Duplicate review in Add, Find and More must use consistent high-confidence candidate rules, no automatic merge or visual-AI assumption.

F7 HIGH — Storage pressure logic in More must apply to Add photo imports and all large writes/restore/purge; honest metrics only, no forced deletion, no false reclamation from Archive or soft delete.
F8 LOW — Standardize visible terms: Memory, Photo, Answer (saved text), Space, Category, Needs checking, Recently Deleted. Legacy 'Card' and 'Context' may remain internal until safe migration.
F9 MEDIUM — Some approved specs still contain older 'awaiting owner signoff' text despite separate signoff artifacts. Treat signoff records as governing; reconcile stale internal status text in later docs-only cleanup with traceable amendments.

## Owner clarification — F1 only
Choose photo-only Home recently saved card: A title plus concise 'Photo memory' text cue (recommended; respects original NO-image signed Home), B title plus small photo thumbnail (requires explicit Home visual amendment), C exclude photo-only from Home recent (not recommended). No owner choice implied until explicitly stated.

## Cross-tab test coverage (not executed)
T1 Home GO query/blank; Find keyboard/live search, filter and return state.
T2 Add title+text, title+photo, five photos, import failure, one resumable draft.
T3 Photo-only Home recent, Find result, Detail view, and share preview with no fabricated answer.
T4 Space/Category create/rename/delete across Add, Find, More and after restore.
T5 Verification source and material edit transitions; reminder due filters and archive suppression.
T6 Archive/Recently Deleted/30-day restore and media retention; time jumps and purge interruption.
T7 Full backup with photo/draft/lifecycle and conflict/rollback, old-version compatibility.
T8 Adaptive storage and cleanup review; dark/light, 130-200% text, TalkBack, offline, restart, foldables.
All native QA gates remain OPEN. Cross-tab design review is not implementation or test acceptance.

## Governance
Home/Find/Add/More individually signed off; this cross-tab assessment identifies compatible amendments and engineering gates, does not revoke approval. Owner chooses F1; engineering verification follows separate implementation permission. No source edits, migrations, builds, commits, pushes or deployments.

## F1 RESOLVED BY OWNER — Photo-only Home recent fallback
2026-10-17 cross-tab owner choice A: compact Home recently saved card displays meaningful title and literal text cue 'Photo memory' when no written answer exists; still no Home thumbnail, and no fabricated answer. Text-bearing cards remain unchanged. No photo-only record excluded solely for lack of answer. Find/Detail photo preview policy per signed Add and Find specifications. See SB20_CROSS_TAB_OWNER_DECISIONS_2026-10-17.md. F1 design conflict CLOSED; implementation and native verification OPEN.
