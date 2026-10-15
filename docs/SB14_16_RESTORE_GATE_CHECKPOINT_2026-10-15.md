# SB-14 to SB-16 coordinated continuation — verified restore gate

Added src/media-restore-gate.ts. The API accepts a v2 media container, SHA-256 adapter and caller-owned apply callback; no apply callback runs until version, card references, every image byte count, format signature and SHA-256 pass validation. This is a pure gate: caller still must implement transactional staging, database/media commit, recovery and rollback.

Added tests/media-restore-gate.test.mjs: valid envelope invokes apply once with text/manifest/readEntry; corrupt hash invokes apply zero times. TypeScript checked with exit 0; targeted tests 2/2; full Node suite 102 passed, 0 failed with exit 0.

OPEN and not accepted: SB-14 Expo SQLite failure injection and interrupted restoration; SB-15 live attachment picker and native card UI/storage wiring; SB-16 native SAF file export/import, atomic image+SQLite restore and independent emulation. Current installed APK remains text-only. Preserve owner-dirty docs/RECOVERY_RUNBOOK.md, no Production, remote push, or physical-device changes.
