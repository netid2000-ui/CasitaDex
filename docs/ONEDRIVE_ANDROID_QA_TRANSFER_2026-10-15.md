# OneDrive APK transfer and shared Android emulator smoke - 2026-10-15

Source: DESKTOP-FP0BMH2 C:\cq\a native staging APK at detached commit fccbb03. Transfer staged under C:\Users\franco\OneDrive\Designs-by-FA-QA-Transfer\casitadex-staging-fccbb03-x86_64.apk. Source SHA-256 D2C649E8E4E7BB4D0D3AC6F157E7D6D704C5EF5FC4F70FA29F9C6325CC1CD54A.

Destination: DESKTOP-MB70M1T C:\Users\Admin\OneDrive\Designs-by-FA-QA-Transfer\casitadex-staging-fccbb03-x86_64.apk; 80022727 bytes, exact same SHA-256 verified. Android 15 FA_Android35_SmokeTest emulator-5554 booted. adb -s emulator-5554 install succeeded; package com.designsbyfa.casitadex.staging verified; launcher monkey injected event and app process pid 16787 present five seconds later. Shared emulator native CasitaDex INSTALL AND PROCESS LAUNCH PASS only.

Not tested in this checkpoint: screen contents, CRUD, saved-record persistence, airplane-mode restart, backup/restore, accessibility, media integration, iOS and physical device. Existing apps, phone, production systems and shared QA toolchain untouched. No remote push. OneDrive is an approved file transfer channel here, NOT CasitaDex cloud storage/sync. Preserve uncommitted docs/RECOVERY_RUNBOOK.md.
