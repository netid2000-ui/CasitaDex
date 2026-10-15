# ADR-003 - Local media and portable backup architecture
2026-10-15. Status: proposed CD-SB-04/05 design, not implemented or native-accepted.

## Architecture
Preserve local-first SQLite, separate Development/Staging data, and zero mandatory cloud/Firebase/account. Import selected image bytes into app-owned persistent storage, not external picker URIs. Allowlist formats, enforce actual byte caps, validate file signatures and reject malformed content. Store opaque ID/card ID, relative managed path, MIME, byte length, and SHA-256 metadata in SQLite; portable exports never include private absolute paths.

## Crash safety
Copy into temporary app-owned file, verify size/hash, move to managed location, then transactionally attach metadata. On failure clean temporary files; idempotent orphan sweep must only remove files not referenced by committed or recovery records. On deletion unlink database references first and clean files after safe eligibility checks. Test process death between every stage; never claim filesystem and SQLite are one atomic transaction.

## Backup boundary
Keep existing schema-1 text-only JSON import supported. Media-inclusive export requires separately versioned container, manifest, per-entry content hashes and full backup read-back, not an expanded 2MB JSON string. Reject traversal paths, duplicate IDs, missing media, unsupported versions, oversized/archive-bomb entries and mismatched hashes. Stage all replacement data without touching committed collection; show explicit replacement preview and rollback plan. User-selected SAF/iOS Files providers only, no automatic uploads. Encryption and key recovery require separately approved design.

## Acceptance
Unit tests for malformed media, copy failure, orphan handling, missing attachment, migration, corrupt container, quota and interrupted restore. Native Android and iOS tests for picker permissions, offline restart, physical file-provider backup, clean-install restoration, accessibility and large text. Validate no Firebase in native dependency graph. No media or backup features are claimed complete by this design document.