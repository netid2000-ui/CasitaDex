# CasitaDex Android text-only backup, restore and invalid-input QA - 2026-10-15

Machine DESKTOP-FP0BMH2, Android API 37 emulator-5554 only, standalone Staging APK built from detached source commit fccbb03. Physical Samsung untouched. Only disposable record QAFilter20261015 was present.

PASS: More > Save backup file, Android Storage Access Framework granted Documents directory to Staging app. File created /sdcard/Documents/CasitaDex-backup-2026-10-15T19-30-53-337Z.json (266 bytes). ADB readback JSON verified version=1, cards=1, title QAFilter20261015, answer Filter20x30, confidence Needs checking.
PASS: More > Choose backup file to restore; selected the JSON in Android system file picker. App displayed Backup checked. Review the counts before replacing your collection and one-card replacement preview. Pressed Confirm replace from backup; app displayed Backup restored. Answers showed QAFilter20261015, Filter20x30, Needs checking.
PASS: Pasted invalid text notValidBackup into restore field and pressed Check backup; UI displayed JSON Parse error: Unexpected character: o; Answers still retained prior card and updated answer. The invalid text did not initiate a restore.

Scope: This proves text-only export/import and a same-dataset restore, not a different-data replacement, failed-write rollback, corrupt valid-JSON semantic rejection, media-inclusive backup, physical Android or iOS. Existing remote repositories, services and user phone untouched. No remote push or Production. Preserve pre-existing dirty docs/RECOVERY_RUNBOOK.md.
