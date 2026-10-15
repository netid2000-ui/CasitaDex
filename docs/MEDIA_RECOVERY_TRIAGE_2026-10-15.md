# CD-SB-04 media recovery triage - 2026-10-15
New read-only media-recovery.ts compares operation journal entries with committed media metadata, distinguishes pending, promoted, mismatch and complete. It never authorizes deletion or modifies a file/database. Four tests added. Fresh 89/89 tests PASS; TypeScript and lint PASS.

Still OPEN: native media picker and SHA-256 provider; attachment UI; integration of this triage with actual SQLite startup and filesystem inspection; power-kill recovery; card deletion retention; real Android/iOS acceptance; media-inclusive backups. Older Android APK predates these changes. Do not report CD-SB-04 as accepted or ask owner to install new media test build yet.

No Firebase, cloud, Production, remote push or device change. Preserve unrelated uncommitted recovery runbook.