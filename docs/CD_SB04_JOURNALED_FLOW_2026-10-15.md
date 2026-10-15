# CD-SB-04 journaled attachment workflow checkpoint - 2026-10-15
Status PARTIAL / source-only, opt-in and not wired to installed application.

New src/media-journal-flow.ts combines pending journal record, verified staging, promotion state, SQLite attach and committed journal state. It reports incomplete operations for inspection without automatic deletion. New tests/media-journal-flow.test.mjs verify ordering, stage failure, DB attach failure and reporting.

Evidence: 83/83 automated tests PASS, TypeScript PASS, lint PASS. The SQLite metadata insert and committed phase currently use separate transactions; a failure between them can leave metadata present with journal promoted. Native crash/restart handling, idempotent recovery and a true on-device file adapter remain OPEN. Neither UI nor original text-v1 data path was changed. Full CD-SB-04/05 acceptance is NOT claimed.

Pre-existing uncommitted docs/RECOVERY_RUNBOOK.md preserved. No installed phone changes, Firebase, cloud, Production, remote push or extra dependencies.