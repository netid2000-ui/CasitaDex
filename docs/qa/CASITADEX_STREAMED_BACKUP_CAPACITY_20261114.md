# Streamed backup capacity checkpoint
Date:2026-11-14
Execution:FA-MAC-DEV-01 only
Branch:work/cd-plus-backup-safety-20261114

## Changes
Removed the100,000,000-byte aggregate cap from media-manifest validation. Retained safe-integer totals, file integrity/path/parent checks,1000 saved-entry limit and10,000,000-byte per-file limit.
Added backup-capacity.ts: shared native streaming bound derived from supported media-entry count plus5 draft photos, per-file bound,4MB snapshot metadata,5MB reminders, and frame overhead. This is a defensive format maximum, NOT a measured device capacity promise or new product quota.
Native v3/v4 streaming writers/readers and picker now use the shared bound instead of154010000. Native free-space preflight derives from archive size; existing restore staging capacity checks remain in force. Buffered eng-backup encoder/decoder retain154MB allocation guards.
Backup-screen copy no longer claims a universal154MB cap.

## Verification
27 targeted checks passed initially.
Disk-backed integration wrote and opened an archive with17 synthetic10MB photo payloads: archive exceeds170,000,000bytes. SHA verification and selected-photo readback passed.
Maximum streaming write<=65536bytes; largest read<=10000000bytes. These are observed adapter request sizes, NOT a process-RSS measurement.
Synthetic payloads contain recognized PNG signatures and checksums; this test does not validate image decoding or photo-viewer performance.
Truncated/corrupt archives rejected; writer interruption propagated without changing source snapshot. Low-space preflight rejected insufficient space. Buffered exporter still refuses oversized allocations.
Full suite:449 tests,443pass,6skip,0fail. During verification, an introduced dependency broke legacy VM test loaders; constants were moved to their owning manifest module, and the entire suite reran successfully.
Final TypeScript PASS; changed storage-module ESLint with zero warnings PASS; git diff whitespace PASS.
Project-wide strict ESLint retains the known pre-existing unused openFullScreenPhoto warning in eng-screens.tsx.
Figma checkpoint board1006:17 updated with verified evidence and limitations.

## Still limited / pending
1000 saved photos,5 per memory/draft,10MB per photo,5000 memories and4MB snapshot metadata remain technical restrictions. Actual supported collection depends on all constraints.
No change to Plus entitlement, billing, thumbnails, caching or pagination.
Large archive test validates streaming export/readback, not a170MB native SQLite restore cutover. Existing automated restore transaction/recovery tests passed in full suite.
Native iOS/Android file-provider export and restore acceptance above the old limits remain pending, including app termination/relaunch, resource use and genuinely constrained free space.
Older app versions may reject newly larger archives; use an updated compatible build for restore.
No simulator app replaced, production release made or completed photo acceptance repeated.
