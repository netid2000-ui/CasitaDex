# Scalable photo storage — owner requirement

Owner agreed that photos must scale or CasitaDex will be too restrictive. This supersedes presenting the current 100 MB collection cap and 154 MB backup cap as acceptable future product limits. Figma board 1006:17 updated; 1238:2 retained as historical SB40 behavior and renamed as withdrawn future requirement. No runtime limits changed in this checkpoint.

## Verified starting point

SB40 d1a34cb already separates app-owned media files from database references/metadata. media-manifest.ts validates relative media paths, hashes, byte counts, 1000 entries, 10 MB individual files and 100 MB aggregate saved media. eng-store.ts validates snapshots through validateV2 and enforces five photos per memory. eng-backup.ts and native/stream readers enforce 154010000 bytes. Picker quality is 1. These separate limits must be evaluated together; changing database fields alone does not solve capacity.

## Required engineering scope

1. Trace all count/size validators, database access patterns, media reads, thumbnails, backup readers/writers and recovery staging. Establish explicit collection-scale and memory-budget targets using device measurements; do not advertise unlimited storage or an unverified capacity.
2. Keep stable photo IDs and app-relative paths with app-owned originals/optimized copies. External photo-library URIs alone must not be durable references. Preserve existing files, ownership, hashes and backward compatibility.
3. Introduce thumbnail-based browsing, bounded image decoding/caching, and paginated queries as needed. Define an import optimization policy that preserves readable labels/documents and useful zoom; never silently recompress existing accepted media.
4. Coordinate removal/replacement of restrictive count and byte caps across import, validation, persistence, streaming export, restore and previous-save recovery. Bound allocations and untrusted archive reads; check free disk for temporary files and recovery copies. Do not merely increase constants. Review five-photo-per-memory and 10 MB input limits separately; no replacement figures approved yet.
5. Figma must expose understandable storage usage, low-space guidance, backup progress/cancel and actionable failure handling. Distinguish on-device file capacity from backup destination capacity.
6. Mac mini only: targeted large-library, bounded-memory, interruption, low-disk, restart, legacy restore and integrity verification. Preserve completed photo acceptance; repeat only tests affected by implementation changes, explicitly documenting why.

## Completion evidence

Demonstrate a collection materially above the old 100 MB ceiling; verified streaming backup/restore above 154 MB; photo reference and hash integrity; durable restart; graceful insufficient-space behavior; measured browsing and memory behavior. Final capacity claims require measured results. Feature-branch implementation and evidence must precede native owner acceptance. No production release authorized.

## Status

Requirement recorded and scope made concrete. Implementation, capacity measurements, revised storage Figma screens and native acceptance remain pending. This checkpoint made no app source changes and reran no photo tests.
