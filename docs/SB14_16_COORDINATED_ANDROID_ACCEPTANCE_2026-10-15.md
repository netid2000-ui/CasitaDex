# CasitaDex SB-14 / SB-15 / SB-16 coordinated Android staging acceptance
Date: October 15, 2026 (Central Time). Owner: Designs by F&A.

## Scope and decision
SB-14 data integrity, SB-15 live Android image attachments, and SB-16 portable media backup/restore were implemented and exercised together on Android Staging. This is an Android Staging functional-acceptance checkpoint, NOT a Production or whole-V1 release approval. Files remain private/device-local; there is no Firebase, cloud sync, account, analytics, or automatic backup.

## Implementation
- `src/media-attachment.native.ts` + `src/media-hash.native.ts`: Android picker, image signature/byte-limit checks, SHA-256, app-owned persistent storage, staged media with journal and SQLite metadata, rendering, removal and file-existence checking.
- `src/screens.tsx`: attachment picker, accessible image label, removal confirmation, separate full-backup export, preflight preview/confirmation, recovery; existing text-only export/import remains.
- `src/media-transfer.native.ts` + `src/media-portable-container.ts` + `src/media-restore-gate.ts`: length-delimited CDXM2 envelope, per-media hash/signature validation, SAF export/readback, corrupt-file refusal, staged restore then guarded SQLite commit, previous-save recovery of both text and image references.
- `src/sqlite-repository.ts`: real SQLite transactional recovery on failed writes; in-place ordinary edits when images are attached; blocks deleting an attached parent card via legacy text replacement.
- Images are JPEG/PNG/WebP, 10 MB per image; current native complete-backup SAF adapter enforces 20 MB total. Backup content is not encrypted; user selects destination. File/SQLite are not one atomic transaction: staged, journaled operations are reconciled, with interrupted operations retained for safe triage.

## Automated acceptance
- `node --test tests/*.test.mjs`: 105 PASS / 0 FAIL (including injected SQLite card-write rollback, media insert failure, media full-restore SQL rollback and recovery, Base64 boundaries, v2 hash/signature/container parsing, manifest guards, native-store contracts).
- `npx tsc --noEmit`: exit 0. `eslint src --max-warnings=0`: detached QA job `945adfca70e60f68`, exit 0.
- Native x86_64 Staging `:app:assembleRelease` from isolated `C:\cq\m`: first build job `04380e11aeaf5fc1` exit 0 (532 tasks), repeat job `604c15967aa4272a` exit 0. Runtime Gradle graph refused Firebase dependencies. APK SHA-256 `9E4387F1833A7A0950371ECC7145E889E025223A09C2299BC74F59ABE1E251BA`; 42,930,707 bytes. Debug/test-signed installable release Staging APK, not Production signing.

## Actual Android emulator QA (independent second desktop)
Machine `DESKTOP-MB70M1T`, Android 15 `emulator-5554`, package `com.designsbyfa.casitadex.staging`. APK obtained from user-owned OneDrive transfer and hash matched primary.
1. Original disposable card `QASecondary2026` / `EditVerified2026` persisted from earlier acceptance; attached 1,764-byte QA PNG through Android picker. Detail showed the image and removal control. No original/other app data altered.
2. Exported full media backup to Documents via SAF: `CasitaDex-media-2026-10-16T00-25-24-372Z.cdxm`, 2,280 bytes. UI reported successful readback with one image.
3. Separately generated an alternate valid package (2,320 bytes) and a corrupted digest variant (2,280 bytes) using verified original bytes. Selecting corrupt backup showed `Media SHA-256 mismatch`; original card remained intact.
4. Confirmed full restore from valid alternate. Answers displayed `QASecondaryAlternative` / `RestoredWithImage` and detail showed `Attached image`.
5. Used `Recover previous full save`; original `QASecondary2026` / `EditVerified2026` and its image returned. Offline Wi-Fi/data disabled plus app force-stop/relaunch retained card AND attached image; restored connectivity afterwards.
6. Removal required explicit native confirmation; after confirming, detail showed `No images attached`. Re-imported original independent `.cdxm` file through full restore; original card and image reappeared.

Primary independent emulator evidence: QA card `QAFilter20261015` accepted PNG picker and preview; full media export `CasitaDex-media-2026-10-16T00-19-30-822Z.cdxm` (1,453 bytes). Pulled to host and parsed envelope: one 942-byte PNG whose independently computed SHA-256 matched manifest.

## Safety and open release gates
- No Git push, Production deployment, Firebase, physical phone modification, emulator data wipe, or shared Metro interruption.
- Native full-disk/power-loss injection during file move and SQL commit remains for hardening; real Node SQLite failure-injection tests passed but are not equivalent to a forced Android power loss.
- Automatic media-orphan deletion is intentionally constrained; interrupted staged entries require journal/recoverability triage. Very large collections over current export cap are deliberately rejected, not silently truncated.
- iOS media integration/QA, TalkBack & large-text physical acceptance, additional Android compatibility, security review, encryption design, device-transfer rehearsal, and final store/release gates remain separate future batches. No overall app release acceptance is implied.
- Preexisting owner edit to `docs/RECOVERY_RUNBOOK.md` was preserved and excluded from commits.
