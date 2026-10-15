# CasitaDex Data Protection continuation - October 15, 2026
Status: PARTIAL, physical restore OPEN. Charter v0.4 Amendment C, Staging only.

## Verified today
- AI Commander DESKTOP-FP0BMH2 online v1.5.0. Samsung SM-S166V Android 16, ADB authorized serial R5GL83X0K3N.
- Installed `com.designsbyfa.casitadex.staging` 0.1.0/code 1, preserved without data clear or reinstall.
- Installed APK and E:\cdx\a\android\app\build\outputs\apk\release\app-release.apk have matching apksigner SHA256 certificate `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`.
- Saved APK SHA256 `66F2390117B512FB400C6D1B473AC8D7C508EF3D7E831843646B7B66A44768BB`.
- 41/41 npm tests PASS, TypeScript PASS, ESLint PASS.
- Historical E: two-card sample backup SHA256 `2272C7B85FFB8079E7E8BA56F2ABE76D9FDF998626B6463CF950D0F6C7312EC7`; it is NOT proof of fresh physical export or restore.
- Source review confirms Android SAF export with read-back, document picker validating before DB write, and preview/confirmation in More > Backup & recovery.

## Remaining physical gates - protect real records
1. In Samsung CasitaDex Staging > More > Backup & recovery > Save backup file, select Documents; verify success and independent exact copy/hash.
2. Cancel Restore picker; prove unchanged records. Then select validated file, inspect preview/counts and cancel replacement; prove unchanged records.
3. Run confirmed replacement ONLY with disposable isolated test data/device, not valuable saved household data. Verify cold restart, airplane-mode retrieval and expected records.
4. Record device screenshots/logs, update current status/runbook and close gates only with evidence. Device replacement, TalkBack, iOS, media and encrypted backups are still OPEN.

Existing uncommitted docs/RECOVERY_RUNBOOK.md preserved. No Firebase, cloud, Production, app-store, remote push or destructive action authorized or performed.