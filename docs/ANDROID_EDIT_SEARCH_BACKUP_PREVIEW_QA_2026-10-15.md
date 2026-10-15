# CasitaDex Android edit, search and backup preview QA - 2026-10-15

Environment DESKTOP-FP0BMH2 isolated Android API37 emulator-5554, CasitaDex standalone Staging APK from detached commit fccbb03. Physical Samsung never targeted.

PASS positive query: search QAFilter displayed saved QAFilter20261015 / Filter20x25. PASS negative search previously showed No matching answers. PASS edit: opened saved card, selected Edit answer, replaced Filter20x25 with Filter20x30, pressed Save edited answer; detail showed Filter20x30 and confidence Needs checking. PASS edited data durability: adb emulator-specific force-stop and relaunch, Answers still showed QAFilter20261015 / Filter20x30 / Needs checking.

PASS backup UI discovery and text preview only: More > Backup & recovery shows Save backup file, Choose backup file to restore, Prepare text backup, Recover the previous save and paste restore; selecting Prepare text backup exposed Complete backup text. Backup save-to-file, exact exported content, file-picker import, destructive restore and rollback NOT TESTED. Present UI explicitly warns this prototype contains no photos/files and backup is readable text; attachments remain not integrated, so never claim media backup.

Prior record durability across full emulator reboot already passed; edit-after-reboot not tested. No Production, cloud build, remote push or physical-device interaction. Existing uncommitted docs/RECOVERY_RUNBOOK.md preserved.
