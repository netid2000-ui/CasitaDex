# Coordinated phone-independent super-batch checkpoint - 2026-10-15
Status PARTIAL. CasitaDex Charter v0.4 Amendment C. Repo C:\CasitaDex-Git, prototype/bootstrap.

## Implemented
- Android text-backup import now checks actual UTF-8 byte count after reading file selected by document provider, even if picker omitted or understated file size. Reject over 2MB before parse/restore preview.
- Two regression cases added to tests/backup-files.test.mjs: unknown size and underreported size (multibyte UTF-8).
- Proposed ADR-003 app-owned media and separate media-inclusive backup design. This is design, NOT implementation/acceptance.

## Evidence
- npm test 43/43 PASS; npm run typecheck PASS; npm run lint PASS; git diff --check PASS.
- Read-only accessibility source check found roles/labels/scaling signals, not a TalkBack or VoiceOver pass.
- iOS app.config.js contains separate staging/development bundle IDs. No physical iOS build or test was performed.
- Samsung not operated in this batch. Earlier physical backup/restore test and device replacement still OPEN.
- Preexisting dirty docs/RECOVERY_RUNBOOK.md edits are preserved and excluded from commit.

## Outstanding
Full Android TalkBack/scaling physical QA, backup export/restore, all iOS acceptance, CD-SB-04 media implementation, CD-SB-05 media-inclusive portable backup, secure encryption design, release audit. No Firebase, cloud account, Production, remote push, new installed SDK or phone data operations. No false acceptance.