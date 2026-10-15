# Secondary Android edit and invalid-import acceptance — 2026-10-15

Independent QA target: DESKTOP-MB70M1T, Android 15 emulator-5554, standalone CasitaDex Staging APK. No physical device.

PASS actual edit: Opened disposable QASecondary2026 detail, Edit answer, cleared original text and entered EditVerified2026; inspected editable field via UIAutomator, dismissed keyboard and scrolled Save edited answer fully into view, tapped and verified detail displays EditVerified2026 and Needs checking. PASS persistence: force-stopped CasitaDex, relaunched, verified UI displays QASecondary2026, EditVerified2026 and Needs checking.

PASS invalid-import refusal: More > Paste a CasitaDex backup to restore, typed InvalidQaBackup, pressed Check backup; UI showed JSON Parse error: Unexpected character: I. Returned to Answers and independently verified QASecondary2026 / EditVerified2026 / Needs checking were unchanged. This did not execute restore.

Prior secondary machine evidence: full reboot persisted original record after System UI ANR was dismissed with Wait; backup export/read-back, picker restore, alternate-data replacement and previous-save rollback all passed. Open gates remain simulated failed storage write, repeat reboot/system UI stability, attachment integration and media backup, accessibility, iOS. No Production deployment, remote push, destructive device changes or physical-device action. Pre-existing dirty docs/RECOVERY_RUNBOOK.md not staged or modified.
