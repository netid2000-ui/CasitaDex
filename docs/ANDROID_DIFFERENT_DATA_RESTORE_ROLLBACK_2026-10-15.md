# CasitaDex Android alternate-data backup restore and previous-save rollback - 2026-10-15

Environment: DESKTOP-FP0BMH2 Android API37 emulator-5554; Staging standalone APK from detached source fccbb03. Physical Samsung not touched.

Baseline verified in prior QA: disposable QAFilter20261015, answer Filter20x30, confidence Needs checking. Prepared valid version 1 text backup by copying and changing only disposable card title to QAAlternativeRestore, answer AlternativeValue42 and confidence Unknown; file C:\cq\qa-alternative-backup.json, 270 bytes, pushed via ADB to emulator Documents/qa-alternative-restore.json.

PASS different-dataset file import: More > Choose backup file to restore > qa-alternative-restore.json; app displayed preflight counts 1 current card -> 1 incoming card; pressed Confirm replace from backup. Answers UI showed QAALTERNATIVERESTORE, AlternativeValue42, Unknown (rather than original QAFilter record).

PASS previous-save recovery: More > Recover the previous save > Confirm recovery; Answers UI showed original QAFilter20261015, Filter20x30, Needs checking. This demonstrates successful rollback from a different-data restore on an emulator.

Not covered: simulated failed database write or process crash during replacement, multiple-record histories, media backup, physical device, or iOS. Do not claim failed-write rollback accepted. No Production, remote push or physical-device changes; pre-existing docs/RECOVERY_RUNBOOK.md changes preserved.
