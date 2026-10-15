# CD-SB-04 SQLite attachment metadata checkpoint - 2026-10-15
Status PARTIAL, standalone opt-in source module, not integrated into active V1 app.

New src/media-sqlite.ts defines isolated media_v2 SQLite metadata table with unique path, parent-card FK, restrictive deletion, file-length bounds, validated manifest rows, and transactional insertion. Existing version-1 collection schema, parse/export and Android app installation remain unchanged. New tests/media-sqlite.test.mjs use real in-memory node:sqlite transaction operations, validating persistence, missing parent rollback, duplicate path and invalid manifest rejection.

Fresh evidence: 70/70 npm tests PASS; TypeScript and lint PASS. Runtime Android expo-sqlite adapter and staged file+database coordination not yet integrated. Filesystem and SQLite cannot be treated as one atomic commit; interrupted operation reconciliation, media-inclusive backup and physical acceptance remain OPEN. Do not delete any existing files without proven reference/recovery safety.

Preserve pre-existing uncommitted docs/RECOVERY_RUNBOOK.md. No phone changes, Firebase, cloud, Production or remote push.