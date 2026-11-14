# Photo workspace indexing and large SQLite restore
Date:2026-11-14
Branch:work/cd-plus-backup-safety-20261114
Machine:FA-MAC-DEV-01

## Implemented
Active route src/app/photos.tsx now uses photoWorkspaceItems from photo-summaries.ts and memoizes it on snapshot and sort.
Previously each gallery item searched memories and filtered the full photo manifest. Now maps index memories and photo ownership once, preserving the memory's photo-ID order. No image bytes are loaded during metadata preparation.
No layout, controls, viewer, gestures, scroll-anchor behavior or persistence change.
Tests compare old and new projections for sorting, cover order, lifecycle exclusion, ownership isolation and non-mutation;1000-photo metadata test resolves each included URI once.

## Restore evidence
Extended the170MB archive integration test through production createEngStore stageRestore/restoreV4 into an independent disk-backed SQLite database with filesystem photo storage.
Closed/reopened database, compared restored data, verified all17 photo hashes, then recoverV4 restored the preceding empty collection.
Uses Node SQLite on Mac mini and filesystem adapters; it is not Expo native-device acceptance. Synthetic10MB payloads have PNG signatures and valid hashes, not decoded photographic image fixtures.
Existing corruption, truncation, failed-write, allocation-guard and capacity tests retained.

## Results
451 total tests:445pass,6skip,0fail.
TypeScript:PASS. Changed-file ESLint zero warnings:PASS. git diff whitespace:PASS.
Figma board1006:17 updated.
Completed owner photo acceptance not repeated; targeted metadata-order compatibility tested because implementation changed.

## Pending
The gallery still mounts all cards. Virtualized rendering/thumbnail caching is the next substantive performance change and needs targeted scroll/return-to-tapped-photo checks.
No phone/simulator deployment or native large-archive export/restore was performed. Native file-provider behavior, true low-space recovery, app termination and image memory usage remain acceptance items.
No production deployment or billing enabled.
