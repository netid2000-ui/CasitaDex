# CasitaDex SB-20 R1 — Migration Compatibility and Rollback Review
Date: 2026-10-17. DESIGN ONLY, implementation not authorized.
Baseline: signed integrated SB-20 design; R0 restored source snapshot on E: verified.
Current v1 Data requires nonempty Spaces, valid card.spaceId, nonempty title and written answer, and fixed Context Buy/Fix/Find/Maintain. Verified needs source and date. Export parser allows only known fields and rejects media in text backup.
SQLite schema 1 persists Spaces and Cards, references Space via FK. Native media_v2 references Card, checks SHA256 and limits image to 10 MB; media manifest v2 and CDXM2 portable container max 110 MB. Existing media importer attaches after saving memory.
Target SB-20 requires optional Space, custom multi-Categories, photo-only saved memories, Archive/Recently Deleted, single staged unfinished draft, and versioned full portable backup with draft photos.
All below are migration proposals pending owner and engineering approval. No code edits, test builds, schema execution, commits or device access.

## Compatibility mapping
v1 card.id/title/answer/location/notes/source/confidence/history -> preserve byte-equivalent human information and stable identifiers. Never invent OCR/answer/source/verification history.
v1 spaceId -> preserve existing assigned Space. New model permits nullable/unassigned Space; old default My Home is not retroactively erased.
v1 context -> preserve legacy Context separately; introduce user-created Category IDs, no automatic merge or silent context loss.
v1 card status implicit Active -> Active, no invented archive/delete timestamps. New actions create lifecycle events. Deleted records and photos remain recoverable for 30 days.
v1 due/verifiedAt/history -> retain originals; additional reminder completion and verification event history only generated for future real actions.
v2 attached native media -> preserve image IDs, card association, path/mime/byte count/SHA256; no destructive recoding by migration.
v1 text export -> maintain legacy reader and honest photos-excluded notice.
CDXM2 full media export -> preserve old reader and validate hashes; introduce versioned future full backup for new Categories, states, draft+staged photos. Old backups must not fabricate missing new fields.
Draft staging -> independently durable incomplete data, never accepted as searchable saved memory until title+answer-or-photo invariant met and committed.

## Synthetic fixture matrix — specify first, do not touch real user data
F01 empty v1 collection with My Home Space, zero records -> valid new empty collection; old Space preserved.
F02 ordinary Buy record with title/answer -> exact title, answer, legacy context and source.
F03 record with Verified, source, verifiedAt and history -> no invented events and no status loss.
F04 record with due date -> preserve due field, no assumed completion state.
F05 multi-Space legacy cards -> stable per-card Space associations; optional unassigned new records accepted.
F06 existing photo attachment -> ID, hash, bytes and parent association intact across backup/restore.
F07 new photo-only record -> accepted only with meaningful title and valid durable image; no fictitious answer.
F08 new five-photo record and legacy >5 media -> five allowed for new saves, preserve legitimate old excess attachments.
F09 Active/Archived/Recently Deleted mix -> active query excludes other states; deleted data/photos recoverable 30 days.
F10 one unfinished draft with staged photo -> restorable from full backup, not returned in Find.
F11 target has current draft plus imported draft -> explicit keep-current/use-backup/cancel; never silently destroy one.
F12 bad/missing photo, checksum mismatch, truncated backup, invalid schema -> abort before current collection mutation.
F13 dates across clock rollback and expired deletion -> prevent early purge due solely to wall clock change.
F14 legacy v1 text versus CDXM2 image backup -> backward-compatible readers and honest import omissions.
F15 interrupted migration with media references -> last known good state recoverable; repeatable migration.
F16 custom Space/Category rename/removal -> memberships update without deleting underlying memories.

## Required assertions
Every fixture compares before/after IDs, count, title/answer, source/history, photo hashes, label associations, reminder states and backup manifests. Explicitly test stable sorting and offline search. Unknown unrecognized fields may not be silently dropped from claimed lossless backups; documented version rejection is safer.

## Migration and rollback protocol — proposed for later authorization
1. PRECHECK: verify owner-approved isolated workspace, current Git status, source snapshot, schema version, available storage, media manifest, original file hashes and legacy backup readability.
2. PREFLIGHT: dry-run logical conversion on synthetic fixtures; show records/Spaces/Categories/photos to be mapped and any unsupported content; fail closed on unknown version, reference inconsistency or unsafe capacity.
3. SAFETY COPY: export versioned source database PLUS all associated files to tested protected local staging; verify hashes and an isolated restore before modifying any test data.
4. PREPARE: construct new tables/indices/media references in separate staged store or transaction, preserving original IDs, timestamps and media bytes. Never upgrade authoritative user database in place without atomic rollback path.
5. VALIDATE: compare item counts, IDs and answer text, media hashes, history, reminder sources, archive state; re-run search and backup round-trip checks.
6. CUTOVER: only after approval and validated atomic switch, retain known-good snapshot/journal; detect interrupted conversion and choose original or verified new state, never mixed.
7. ROLLBACK: fail safely to original database and media references on mismatch; avoid rolling back new legitimate user actions after cutover. A downgrade after users create SB-20-only records requires export compatibility and explicit safe recovery instead of older code dropping new fields.
Stop criteria: missing media, wrong counts/hashes, conflicting IDs, insufficient space, uncertain recovery, unexpected schema or altered user data.

## Engineering and owner gates
Choose exact versioned schema, legacy Context UX, nullable Space representation, draft storage namespace and conflict dialogue; decide immutable/monotonic retention evidence and tested warning thresholds. Perform synthetic fixture review before live migration. R0 source snapshot does NOT capture physical Android app database; acquire independently verified Android test-data/backup safeguards under later separate authorization.
R1 outcome: design mapping and fixtures prepared; migration implementation and verification NOT run. Owner must separately authorize engineering implementation after approving exact schema/migration plan.

## Approved R1 amendment — 2026-10-17
Owner approves Option A safe defaults. New saved memory must have meaningful authored title and answer OR durable photo. New default Space Unassigned; Categories none; verification Unknown; lifecycle Active; no reminder or source. Real timestamps only. Unfinished drafts may be incomplete and are excluded from Find. 'Photo memory' is a display cue, not an answer field value. Historical Space assignments, Context, source, reminder and history must be preserved exactly. See SB20_R1_SAFE_DEFAULTS_OWNER_DECISION_2026-10-17.md. Engineering remains on hold.
