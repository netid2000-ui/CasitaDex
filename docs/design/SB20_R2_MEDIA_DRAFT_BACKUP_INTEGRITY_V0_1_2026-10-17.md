# CasitaDex SB-20 — R2 Media, Draft and Backup Integrity v0.1
Date 2026-10-17 | TECHNICAL DESIGN / OWNER REVIEW | NO IMPLEMENTATION
Governing inputs: signed SB-20 integrated design, R1 safe-defaults owner approval, R1 compatibility matrix, R0 tested source snapshot. No device-data snapshots or native tests authorized by this document.
Current code research (READ ONLY): media-staging.ts verifies bytes before temp/promote; media-journal-flow.ts records pending/promoted/committed and commits metadata with journal; media-recovery.ts evaluates incomplete operations without deleting files; media-coordinator.ts retains promoted file on uncertain DB result; media-restore-gate.ts requires preflight before apply. These are existing foundations, not proof of new Add draft or full SB-20 restore.

## R2 architecture boundaries
A. Durable saved Memory: stored answer is authored or empty when an actual committed photo exists; title required. Default Unknown verification, Active lifecycle, Unassigned Space, no Categories/reminder/source. No placeholders in factual storage.
B. Private unfinished Draft: one recoverable record, may be missing title, answer and media. Its identity is independent of saved Memory IDs. Never included in Find/Home recents and cannot acquire Verified status automatically. Draft checkpoint only acknowledged after persistence success.
C. Draft staged media: app-controlled private temp references and validated bytes, integrity hash, MIME, byte count, file lifecycle and ownership to draft; no reference to a nonexistent saved memory. Photo count <=5 for new additions, legacy >5 preserved.
D. Saved media: immutable verified bytes associated with durable Memory ID, journaled promotion and metadata commit; deleting only when no live/archive/recoverable-deleted/draft/rollback or backup-recovery reference requires it.
E. Portable backup: separate schema version from v1 text, existing media manifest v2 and CDXM2. Full backup carries all supported memories/states/photos PLUS the unfinished draft and its staged photos. Text-only clearly excludes photo bytes.

## Draft and photo state machines (PROPOSED)
Draft: absent -> editing -> checkpoint pending -> durable draft; interruption leaves last confirmed checkpoint, never a false success. Return to Add offers Continue or explicit Discard. New capture/import, permission cancellation, invalid/oversize content, low space or app kill must retain prior durable draft and staged references. Save attempts transition through validation, media staging, record+media journal commit, postcommit verification; only after durable success mark draft consumed and display saved Detail. Do not clear draft before durable save.
Media: selected -> copied to app-owned temporary store -> bytes/type/size/hash validated -> durable draft stage -> eligible for commit -> promoted -> SQLite metadata/journal committed -> verified active attachment. Interrupted promotion yields inspectable journal, no arbitrary cleanup. Never delete on uncertain database outcome.
Photo count: new Add record up to 5; a sixth selection rejected without deleting five existing photos. Old records with more stay readable. External picker URI cannot serve as durable storage; app-owned copy must exist. Original label legibility and orientation preserved; destructive re-encoding not assumed safe.
No duplicate save or identical retry ID creation after interrupted commit; define idempotency token per save attempt. Photo-only save is valid only when >=1 independently verified photo is durably linked to the saved Memory.

## Cross-resource reference and cleanup policy
Keep a reference graph by owner: Active, Archived, Recently Deleted during 30-day recovery, durable Draft, verified prior-save recovery and staged restore. A media file eligible for physical removal only when no protected owner/reference remains, its operation journal is reconciled, and deletion is safe/idempotent. Soft delete and Archive do NOT reclaim bytes. Media hashes, byte counts and parent relation checked on restore and recovery; stale refs and missing bytes surfaced as integrity warnings, never silently replaced with another photo.
Retention uses trustworthy durable deletion event plus clock-anomaly precautions; automatic purge may occur after eligibility, not before verified retention expires. Avoid racing with backup export, draft Save or restore; serialize operations or use snapshot isolation.

## Backup / restore safety contract
Preflight full export: enumerate stable snapshot of active, archived, recoverable deleted, media entries and private Draft/staged photo manifest. Validate manifest uniqueness, referenced bytes and hashes. Only claim 'Backup created' after successful target write and appropriate integrity verification. A backup on the same device is NOT proof of independent disaster recovery.
Import: decode and validate supported version, check sizes and hashes, preview counts/old data impact, preflight storage headroom (temporary + rollback), and explicitly confirm replacement. If both current and incoming drafts exist, offer Keep current / Use backed-up draft with recoverable protection / Cancel. No silent overwrite. Stage all bytes and data separately; after successful full validation, cut over with recoverable prior state and verify result. Interrupted restore must not mix old records and imported photos or falsely claim success.
Old v1 text/CDXM2 readers retained with explicit disclosures where drafts, categories or deleted states did not exist. Unsupported future versions must fail before mutation.

## R2 engineering acceptance matrix (NOT EXECUTED)
R2-01 Title plus written answer; title plus photo-only, reject title alone; no synthetic answers.
R2-02 Background/app force-stop/phone restart during typing: last confirmed draft checkpoint resumes truthfully.
R2-03 Cancel camera/picker or deny permission: draft and previously staged photos preserved.
R2-04 Import five images; reject sixth; preserve legacy excess attached images and readable labels.
R2-05 Inject partial copy, media hash mismatch, revoked URI, full disk and journal interruption at every state; verify prior durable state recoverable.
R2-06 Retry save after uncertain commit: exactly one saved Memory, no orphan photos and no premature draft deletion.
R2-07 Archive, Recently Deleted, restore, expiry and time shifts: retain photos until eligible safe physical purge.
R2-08 Backup full collection with active/archive/trash plus unfinished draft photos; compare IDs, bytes and SHA256 after independent isolated restore.
R2-09 Existing draft vs incoming draft: test all conflict choices, repeated restore and cancel without losing either recovery option.
R2-10 Old text/portable media backup and unsupported/corrupt versions: truthful preview, no mutation on failed validation.
R2-11 Offline Android emulator and separately authorized physical phone tests; storage preflight, large fonts, TalkBack, rotation/foldable, safe photo metadata/sharing.
R2-12 Simulate backup destination failure, interrupted restore and insufficient rollback capacity; original collection remains recoverable.
Evidence must include before/after hashes, IDs, SQL/media rows, journal status, output artifact manifest, actual error states. Never infer PASS from design documentation.

## Gates / unresolved engineering choices
Exact draft persistence schema and autosave cadence; staged photo namespace and encryption/privacy posture; crash-safe media operation ordering; idempotency key; shared photo reference accounting; backup format version/limits; restore atomicity and safety copy; Android capacity API and hysteresis; 30-day clock anomaly handling and data-retention compliance. Decisions require owner review before actual implementation; current native proof not performed.
Current status: R1 owner safe defaults APPROVED; R2 contract documented for review; R0 source snapshot verified. Application implementation on HOLD.
