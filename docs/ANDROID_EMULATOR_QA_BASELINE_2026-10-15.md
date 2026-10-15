# CasitaDex shared Android emulator QA baseline — 2026-10-15
Authoritative source: DESKTOP-FP0BMH2 C:\CasitaDex-Git, prototype/bootstrap. Test machine: DESKTOP-MB70M1T, agent 1.6.0.

Live tests: C:\DevSetup\verify.ps1 executed using powershell.exe -NoProfile -ExecutionPolicy Bypass -File; Git/Node/npm/Java21/Python/VS Code/ADB/EAS/Firebase and Android API35/Build35/emulator all FOUND. FA_Android35_SmokeTest emulator-5554 ADB device; sys.boot_completed=1; 1080x2340, 440 dpi. ADB package search found no installed com.designsbyfa.casitadex package on this emulator.

This is test-machine readiness, NOT CasitaDex APK or feature QA. Current source has incomplete UI/media attachment integration; do not claim media acceptance. Before installing CasitaDex use separate QA clone from an immutable committed snapshot, documented app Staging identity and signer, exact dependency graph, QA-only data, and protect existing emulator projects. Do not run disposable Expo scripts against CasitaDex. Existing Android build on primary desktop predates CD-SB-04 media work. iOS EAS/Appetize must be separately authorized for proprietary app and third-party upload.

No Android package installed; existing emulator job/process preserved. No Production, remote push, cloud build, or screen sharing change. Unrelated dirty docs/RECOVERY_RUNBOOK.md preserved.