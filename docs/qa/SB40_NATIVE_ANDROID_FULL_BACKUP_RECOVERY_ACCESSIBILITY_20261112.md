# CasitaDex SB40 — Android Full v4 Native Backup Round Trip & Accessibility Label Audit

**Date:** November 12, 2026 (America/Chicago)
**Host:** FA-MAC-DEV-01, authoritative Mac mini; external FA-Development SSD
**Branch:** `work/cd-sb40-photo-gesture-integration-20261111`; start `e201d3fc79118fe3f1b646cbedb4239286afb852`
**Status:** Native Android full-backup export / restore / previous-save recovery PASS (isolated QA). iOS/Android viewer label-state audit PASS. Overall release **NO-GO**.

## Scope, identity and non-production safeguards

- Native package `com.designsbyfa.casitadex.sb40gestureqa` only; not owner-accepted SB40 binary. iOS isolated simulator `879C620A-5318-4BDF-98B9-904EE635B053` iOS 27.0, Android non-fold emulator `emulator-5554` (API 36).
- Physical Samsung was visible but NOT touched; owner's accepted iPhone and installed SB40 build were NOT modified.
- Native Android backup contains **only the disposable seeded/synthetic QA collection**, including `[SAMPLE] Appliance manuals` with five test photos. The full archive was copied into the Mac mini external SSD QA evidence directory and **must not be uploaded to GitHub**.
- No production Firebase writes, releases, app-store submissions, live purchases or merge actions.

## Checkpoint A — Backup safety source tests

- [x] Focused seven-file source suite: `backup-files.test.mjs`, `media-backup-v2.test.mjs`, `media-native-restore-transaction.test.mjs`, `media-restore-gate.test.mjs`, `reminder-backup-v4.test.mjs`, `reminder-restore-v4.test.mjs`, `sb24-native-restore-gate.test.mjs`.
- [x] **31 tests passed, 0 failed, 0 skipped.** Includes photo-restore SQL rollback, previous-save recovery and reminder-preservation scenarios.
- [ ] Full source `npm test` not repeated this cycle: no code changed, prior 429/0/6 remains separate checkpoint.

## Checkpoint B — Native Android Full v4 backup, review, restore and previous-save recovery

- [x] Navigated the installed isolated SB40 app Home → Settings → Backup & restore and chose **Save full backup (with draft and photos)**. Android system Storage Access Framework folder chooser was used to select **Documents** on the QA emulator.
- [x] Granted the QA app folder access and confirmed the exported file under `/sdcard/Documents/CasitaDex-full-2026-11-12T13-36-30-892Z.cdxe`.
- [x] Pulled archive to Mac mini QA evidence path `QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/isolated-sb40-full-v4-pre-restore.cdxe`, **296,545 bytes**, CDXE4 magic `4344584534`, SHA-256 `865099e19432674009a808e7d4fac4f5b5c1e9c50140caceff9d5d5924995aea`. Archive stays local to QA SSD, not included in Git.
- [x] **Choose backup to review** using Android native Documents picker, selected that specific archive. App validated it and displayed **90 memories / 7 saved photos / no unfinished draft / 0 draft photos**, with **0 standalone reminders** for replacement.
- [x] Confirmed **Confirm replace with reviewed backup** on isolated QA app only; application displayed **Full collection restored and verified.**
- [x] Reopened synthetic sample on the restored QA app and confirmed **Photo 1 of 5 · Cover** still present after full restore.
- [x] Returned to Backup & restore, chose **Recover previous full save**; inspected confirmation and selected **Confirm full recovery**.
- [x] App displayed **Previous full save recovered and verified.** Reopened sample viewer and confirmed **Photo 1 of 5 · Cover** was still present.
- [ ] This run did NOT intentionally corrupt or change the collection between backup and restore. Therefore it confirms native archive round-trip + previous-save rollback; it does NOT fully prove different-state recovery, exact photo-byte/hash identity after restore, or rollback after injected media failure. SQL failure-path coverage is in separate tests.
- [ ] Native iOS full backup export/restore remains NOT TESTED. Source has different OS export methods and must be accepted separately before release.

## Checkpoint C — Native accessibility labels/states

- [x] Android at photo 1 / zoom 1×: native `uiautomator dump` revealed **8 clickable elements, 8 labeled, 0 unlabeled**. Close, Previous, Next, Reset, Zoom In/Out and Manage Photos found; Previous and Zoom Out correctly disabled.
- [x] iOS isolated SB40 viewer: Maestro accessibility hierarchy found all seven required controls, with Previous photo disabled and Zoom photo out disabled at starting 1×.
- [ ] These checks validate native exposed labels and enabled states, **NOT** actual VoiceOver spoken traversal, reading order, announcement timing, hints, accessible rotor actions, native TalkBack spoken navigation or focus traps.
- [ ] Android `enabled_accessibility_services` was null during inspection; TalkBack service was not enabled. No false screen-reader acceptance claimed.

## Evidence retained on Mac mini SSD

`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`
- `backup-recovery-targeted-tests.log`
- `isolated-sb40-full-v4-pre-restore.cdxe` — **local QA artifact, do not push or publish**
- `android-backup-folder-picker.xml`, `android-backup-documents-picker.xml`, `android-backup-permission.xml`
- `android-backup-reviewed.xml`, `android-restore-preview-actions.xml`, `android-restore-after-confirm.xml`, `android-after-restore-viewer.xml`
- `android-recovery-confirm-ui.xml`, `android-recovery-confirm-visible.xml`, `android-recovery-completed.xml`, `android-post-recovery-viewer.xml`
- `ios-access-viewer.log`, `ios-access-viewer.json`

## Next gates

1. Complete native VoiceOver/TalkBack control focus and spoken traversal, accessibility hints and contrast/reduced-motion where available.
2. iOS native full-backup archive creation, restore and previous-save recovery on the isolated QA app, without involving the accepted build. Validate byte identity and prior-state recovery using a second synthetic QA-only collection state.
3. Native picker cancellation, invalid/truncated archive negative-path and photo-failure error preservation, with synthetic data only.
4. Figma approved SB40 Page 47 / review Page 49 screenshot parity, owner design approval and remaining release engineering, then physical Samsung and owner final iPhone signoff.

**Conclusion:** Native Android Full v4 archive round-trip, reviewed restore and prior-full-save recovery PASSED; both platforms' viewer labels/states PASSED. Neither replaces full screen-reader or production release acceptance. **Release NO-GO**.
