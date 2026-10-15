# CasitaDex CD-SB-04 through 08 combined continuation - 2026-10-15
Authority: Product Charter v0.4 Amendment C. Status PARTIAL; no release approval.

## Implemented and verified now
CD-SB-05 preview-only v2 media manifest preflight src/media-backup-v2.ts; four automated tests reject nonexistent parent card, unsafe paths, invalid v1 data; valid data computes media bytes. Does not read archive file bytes, extract archive, write restored files, encrypt backup, or replace data. Existing v1 JSON backup unchanged.
Fresh evidence: 93/93 Node tests PASS, typecheck PASS, lint PASS, Expo web export PASS. npm audit --omit=dev: 29 advisories (18 high, 11 moderate, 0 critical); release security gate OPEN.

## Gate decisions by super-batch
SB-04 BLOCKED full acceptance: app attachment UI/picker/real native digest, live SQLite coordination, offline view/delete and physical recovery not proven.
SB-05 PARTIAL: v2 manifest preview validation only; media bundle assembly, hash verification, native pick/export and staged restore OPEN.
SB-06 NOT IMPLEMENTED: notification package previously removed because it resolved Firebase Messaging. Research local-only native scheduling without reintroducing Firebase; no permission/delivery QA.
SB-07 PARTIAL: existing accessibility and contrast checks; no fresh unassisted retrieval timing, TalkBack/VoiceOver or full large-text layout QA.
SB-08 BLOCKED: npm audit contains high advisories, runtime reachability review and native no-Firebase graph for new build outstanding.
SB-09 NOT AUTHORIZED: Production, stores, cloud/paid builds and public distribution remain gated.

## Build threshold
Old locally signed Android Staging APK exists, built before current media changes. It cannot validate media features. New Android media testing build only after active app integration and fresh verified local Staging build; require hash, package, signing, resolved no-Firebase graph. iOS needs real Xcode/macOS signing/build capability or separately authorized cloud build; no iOS binary tested. Do not install/change Samsung until owner/device available.

No remote push, Production or Firebase. Preserve preexisting docs/RECOVERY_RUNBOOK.md edits. The originating conversation remains the command center.