# CasitaDex CD-SB-04/05 media manifest checkpoint - 2026-10-15
Status: PARTIAL, source-only verification. Owner: Designs by F&A. Charter v0.4 Amendment C.

## Change
- Added src/media-manifest.ts: isolated version-2 media metadata validator (no file I/O or database mutation).
- Version-1 text-only backup, existing SQLite schema, and installed Android remain unchanged.
- Validates allowed image MIME and path pairing; normalized managed paths; unique IDs; parent card references; per-entry/total byte limits; SHA-256 hexadecimal formatting and supported manifest version.
- Added eight tests in tests/media-manifest.test.mjs for acceptance/rejection boundaries.

## Fresh evidence
npm test: 51 PASS / 0 FAIL; npm run typecheck PASS; npm run lint PASS. No native builds, physical device tests, or iOS runtime tests performed.

## Still OPEN
- Real image format sniffing, SHA-256 file-content verification, file copy/stage/rollback, SQLite attachment references, media-inclusive archive import/export, actual backup restoration, on-device TalkBack and iOS VoiceOver acceptance.
- This validator checks digest format, NOT digest accuracy; it does not constitute media security or release acceptance.
- No Firebase, cloud account, Production, paid API, remote push, device data change or dependency installation.
- Preserve pre-existing uncommitted docs/RECOVERY_RUNBOOK.md edits.