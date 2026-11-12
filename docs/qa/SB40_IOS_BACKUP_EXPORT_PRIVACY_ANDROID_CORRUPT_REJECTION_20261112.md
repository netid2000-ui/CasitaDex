# CasitaDex SB40 — iOS Full v4 Export Recovery and Corrupt Archive Rejection

**Date:** November 12, 2026 (America/Chicago)
**Execution authority:** FA-MAC-DEV-01 only; external FA-Development SSD
**Source:** `work/cd-sb40-photo-gesture-integration-20261111`; starting commit `a921a95f5ae5a785ac63c17a0803f03399c6b3c8`
**Release:** **NO-GO**. All native actions performed on isolated `sb40gestureqa` packages; approved SB40 owner installations and data unchanged.

## Checkpoint 1 — Android corrupt Full v4 archive is safely rejected

- [x] Made a byte-corrupted copy of the verified synthetic QA archive (296,545 bytes) in the QA evidence folder. The original was never modified.
- [x] Imported the corrupt `.cdxe` through the Android native Documents picker and the installed `com.designsbyfa.casitadex.sb40gestureqa` app, non-fold `medium_phone` emulator `emulator-5554`.
- [x] App correctly displayed **Media SHA-256 mismatch** after scrolling to the status area.
- [x] **Confirm replace with reviewed backup** was not offered for the rejected archive.
- [x] Returned to `Your Photos`; synthetic `[SAMPLE] Appliance manuals` viewer still showed **Photo 1 of 5 · Cover**. This verifies that rejection preceded collection mutation.
- [ ] A separate native low-space/interrupted restore injection was not run in this cycle. Prior source-level transactional tests remain a separate checkpoint.

**QA evidence:** `android-invalid-archive-result.xml`, `android-invalid-result-scrolled.xml`, `android-corrupt-rejected-photo-intact.xml`. The binary archives stay on the external QA SSD, **not in Git**.

## Checkpoint 2 — iOS Full v4 export defect found and corrected

- [x] Reproduced iOS export failure on the original integrated iOS QA app: tapping **Save full backup (with draft and photos)** displayed the error that `expo-file-system.StorageAccessFramework.requestDirectoryPermissionsAsync` was **not available on iOS**.
- [x] Added an iOS-specific path to `writeEngBackup` in `src/eng-runtime.native.ts`. It serializes the same Full v4 snapshot including reminders and attached photo bytes into `Paths.document` on iOS, uses `openEngStreamCompatible` to verify the complete local archive before sharing, and offers only that archive via `expo-sharing.shareAsync`.
- [x] On iOS, the success message correctly distinguishes **a verified private on-device backup** from **a separately saved Files copy**, which still requires an explicit user action and verification.
- [x] On Android, the existing native Storage Access Framework export and read-back verification path remains unchanged.
- [x] Native iOS Release rebuilt successfully under `com.designsbyfa.casitadex.sb40gestureqa`, installed only on the isolated iOS 27.0 simulator UDID `879C620A-5318-4BDF-98B9-904EE635B053`.
- [x] Native iOS share sheet displayed the **CasitaDex Full v4 archive (297 KB)** and **Save to Files** option. After dismissing sharing, the app displayed the accurate verified-private-backup message.
- [x] Verified generated archive in the QA app's persistent Documents directory, **296,759 bytes**, magic `CDXE4`, SHA-256 `640eda3aaf386b29d924f2ff1c5b3c7a231a4ff3f16aa365536b7e9f65740411`. Archive remained after app relaunch.
- [ ] Actual separate-copy completion in the iOS Files provider was **not verified**. A displayed share sheet / Save to Files button is not evidence of external delivery.
- [ ] iOS native restore by choosing this archive in an external Files provider, confirming replacement and recovering previous save is **not yet accepted**. Android native full round-trip PASS was previously recorded.

## Checkpoint 3 — Privacy safeguard discovered and enforced

- [x] During iOS Files-provider qualification, temporary staging-only `UIFileSharingEnabled` plus `LSSupportsOpeningDocumentsInPlace` exposed **SQLite and media folders** alongside the test backup. This broad document exposure is **unacceptable** for CasitaDex.
- [x] Removed both flags from the isolated native staging project and confirmed they are **absent from the rebuilt installed application's Info.plist**.
- [x] Source `app.config.js` remains unchanged and does **not** enable broad iOS document sharing.
- [x] Retained Full v4 archives inside private `Paths.document`; only the specifically selected archive is offered to the system share sheet. No unrestricted access to media/database folders is required.
- [x] Rebuilt and installed the final hardened QA build. Embedded Release JS bundle SHA-256 `c6460542c0b5195104a6e7d3c5d70076f52b52e77612fe0c6bb4c62dee9e6916`.
- [ ] Screen-reader interactions and app-level Files UI visual review require later native QA; Info.plist absence and private-container file verification were completed.

## Source quality
- [x] `npm test`: **438 total / 432 passed / 0 failed / 6 skipped** (optional fixture skips).
- [x] `npm run typecheck`: PASS.
- [x] Changed-file lint `src/eng-runtime.native.ts`: PASS.
- [x] Three focused iOS backup source guards PASS, including Android export preservation and refusal to expose all Documents through Files.
- [x] `git diff --check`: PASS.
- [ ] Native Android build was not rebuilt for this platform-specific change; Android package behavior was verified earlier and source contract preserved. Native Android regression on this exact revision remains a release gate.

## Evidence retained locally (not committed)

`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`
- `isolated-sb40-full-v4-pre-restore.cdxe` and `isolated-sb40-corrupted-DO-NOT-RESTORE.cdxe`.
- `isolated-ios-sb40-full-v4-verified.cdxe` plus latest private Documents archive within isolated simulator data container.
- `ios-backup-export-scrolled.json`, `ios-documents-export-share-ui.json`, `ios-private-documents-share-ui.json`, `ios-share-cancel-result.json`.
- `android-invalid-result-scrolled.xml`, `android-corrupt-rejected-photo-intact.xml`.
- Native build logs `ios-backup-sharefix-release.log`, `ios-files-documents-export.log`, `ios-private-backup-final.log`.
- `sb40-full-source-regression-after-ios-backup-fix.log`.

## Remaining acceptance
1. iOS external Files copy verification and full import/restore/previous-save recovery from an **independent** QA archive provider. Do not claim complete iOS backup parity until verified.
2. Native VoiceOver/TalkBack focus, spoken control traversal, accessibility hints, reduced motion, photo picker/camera cancellation and media-error handling.
3. Separate changed-state restore and byte-for-byte media validation after restore, not only count and source-level hash checks.
4. Native screenshot/Figma parity for accepted SB40 Page 47 and review Page 49, owner approval and remaining release engineering; only then physical Samsung QA and owner iPhone final signoff.

**All work isolated; no accepted SB40 build or owner personal data altered. Release NO-GO.**
