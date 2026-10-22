# CasitaDex Android Emulator Build Registry

Last inspected: 2026-10-22
Authority: primary repository C:\CasitaDex-Git, commit 44cf17b

| Host | Target | Last installed (device local) | Version | Build commit verified | Role |
|---|---|---|---|---|---|
| DESKTOP-MB70M1T | emulator-5554 | 2026-10-21 20:05:26 | 0.1.0 (1) | No | Newest installed by timestamp, not authoritative |
| DESKTOP-FP0BMH2 | emulator-5582 | 2026-10-21 18:36:28 | 0.1.0 (1) | No | Visual QA |
| DESKTOP-FP0BMH2 | emulator-5580 | 2026-10-20 15:32:30 | 0.1.0 (1) | No | Visual QA |
| LT1 | emulator-5580 | 2026-10-19 19:46:43 | 0.1.0 (1) | No | Preserve functional QA data |
| DESKTOP-FP0BMH2 | Samsung SM_S166V | 2026-10-19 08:16:49 | 0.1.0 (1) | No | Physical acceptance |

## Permanent release identification rules

- Treat device serials as unique only within a named host.
- Every APK must record source Git SHA, dirty/clean state, build UTC time, APK SHA-256, package ID, versionCode, versionName, environment, build machine and artifact path.
- Before installing, capture the existing device package/version/update timestamp and record target host and serial.
- After installing, verify package identity, APK hash/provenance, install timestamp, and app launch; update this registry.
- Newest authoritative build means highest verified build provenance, NOT the latest install time.
- Do not overwrite QA device data, uninstall apps, or upgrade physical phones without acceptance approval.
- Prefer one named Current Android QA target; keep other emulators labeled older or specialized.
- A build without an embedded Git SHA and traceable APK hash remains UNVERIFIED even if recently installed.

## Next gate

Build commit 44cf17b in an isolated, clean staging checkout, produce a signed/verified APK, then install on an explicitly selected QA emulator and record full provenance.
