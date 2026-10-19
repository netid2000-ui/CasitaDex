# CasitaDex SB-20 — R5 Backup, Restore and Rollback Acceptance Plan v0.1
Date 2026-10-17 | DESIGN PLAN FOR OWNER REVIEW — NO IMPLEMENTATION
References: signed SB-20 integrated design, R1 safe defaults, signed R2 integrity, signed R3 planning and signed R4 storage methodology. Current runtime already has limited v1 text and CDXM2 photo backup; newly designed draft/lifecycle/category fields are NOT claimed to be supported yet.

## Acceptable backup contents — future versioned contract
Full portable backup: active+archived+30-day recoverable-deleted memories with real timestamps; source/verification history, location, notes, reminders; custom Spaces/Categories and preserved legacy Context; saved photos with SHA-256/byte count/type and parent associations; ONE unfinished durable Add draft with successfully staged photos. Never serialize 'Photo memory' as an invented answer. Empty answer allowed only with valid attached photo in saved record. Text-only export clearly warns photos excluded and separately discloses any other omitted metadata.
Version readers: retain supported v1 text and CDXM2 import without pretending older archives contain draft, Categories or deleted states. Unsupported future version fails safely before writes. Exact new format/size limits, schema IDs, metadata precedence and security posture need engineering review.

## Restore safety sequence and user decisions
1. Read-only inspect file magic/version/header/manifest and size limits, then validate record ID uniqueness and parent media associations. Unsupported version, missing bytes, bad hash, path traversal, corrupted file or ambiguous provenance must fail before any replacement.
2. Preview exact active/archived/deleted/photo/draft counts; show what will be replaced or retained, label/photo limitations and current draft presence. No silent deletion or resurrection of deleted items.
3. Preflight actual device capacity and peak staging plus rollback bytes, using R4 methodology. Unknown measurements lead to safe disclosure and fail-closed operation if risk cannot be bounded.
4. If both current and imported draft exist, user explicitly selects Keep current draft, Use backup draft with separately recoverable current draft, or Cancel. Never merge, discard or silently pick one.
5. Build staged target and validate media hashes and all references; protect authoritative old collection and its media until recovered state is demonstrated. Only then controlled cutover.
6. Recover consistently from interrupted preflight, staging, cutover or validation. Never mix two collections or purge prior media until rollback window is safely complete.
7. Verify imported records, media, draft, timestamps and full restored search semantics; report success only on durable completion. Never promise cloud or off-device backup merely from an exported local file.

## Retention and security
Recently Deleted retains eligible recoverability for 30 days. Archive preserves bytes. Backup creation does not alter either state. Imported deletion timestamps cannot automatically trigger premature photo deletion when device clock or provenance is uncertain. User-created sensitive backup files should not be sent to cloud, shared, or written to an unverified removable drive automatically. Off-device and encryption readiness require separate approvals.

## Future acceptance matrix — all NOT EXECUTED
B01 full backup round-trip across active/archived/deleted (30-day), categories, verification history, notes, reminders.
B02 single unfinished draft and staged photos recovered byte-for-byte; draft absent from default Find.
B03 current-vs-imported draft, test each Keep/Use/Cancel path and verify previous draft recoverability.
B04 photo-only memory restored with empty factual answer, correct attachment hash and 'Photo memory' display cue.
B05 v1 text-only import and CDXM2 full-media import preserve supported legacy data with explicit omissions.
B06 corrupt/hash-mismatched/truncated/oversized/unsupported file refuses mutation; original data searchable.
B07 low-space, simulated sudden capacity change and destination write failure preserve source.
B08 power interruption during stage, cutover and rollback yields one coherent recoverable state.
B09 restored archived/deleted records remain out of active Find and reminders; no early purge from clock changes.
B10 filename/path traversal, duplicate IDs, missing parents, wrong MIME and bad hashes fail closed.
B11 independent isolated restore on test device/workspace, compare record IDs, counts, photos and SHA-256 manifests; owner may inspect output.
B12 offline/reboot, TalkBack, 130–200% scaling, dark/light and landscape/foldable dialog/preview usability.
Evidence required per scenario: sanitized inputs, old/new counts, manifest/hashes, storage measurements, UI screens/logs, recovery result, test owner, pass/fail and defects. No PASS without actual execution.

## Open gates
Owner: approve this methodology later; define exact restore-draft conflict copy and safe handling of two drafts with only one active draft. Engineering: choose new archive format, size caps, trustworthy clock policy, rollback journal/cutover, backup destination verification and media retention. Platform: Android native/offline and physical acceptance to be separately authorized.
R5 currently ready for OWNER REVIEW only. No source, migration, tests or device changes authorized.
