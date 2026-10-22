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

## 2026-10-22 cross-machine inspection
- Confirmed all four emulators online: primary emulator-5580 and emulator-5582; LT1 emulator-5580; MB70M1T emulator-5554.
- MB70M1T: WSL not installed; visual acceptance target only.
- LT1: Ubuntu-24.04 WSL2 running; Linux Node/npm/Java/Git and Android SDK available. Existing isolated SB-26 release APK (~43 MB) has SHA256 e5631e39c029ba8befbc24f35406f6e4fb50a872e81cd4907b8028e7c9fc7030; source provenance unverified.
- Primary: Ubuntu-24.04 stopped; C: ~30 MB free; no Android compilation allowed.
- Installed dev app all four emulators: version 0.1.0 (code 1), source commit unverified.
- Primary emulator-5580 also has sb24qa; emulator-5582 also has sb24qa and dev.netqa.
- LT1 emulator-5580 also has staging; preserve all existing QA packages/data.
- Current newest by dev-app install time remains MB70M1T emulator-5554 (2026-10-21 20:05:26), but no device is yet certified newest by source provenance.
- Build responsibility: LT1 WSL2; run newest verified APK on MB70M1T. No installs performed during inspection.

## 2026-10-22 verified LT1 WSL2 emulator build and install
- Source: primary Git archive e4c1d6f1b7206dbe755df5473ece613b81b2b78f; archive SHA256 572175F30847EB1C470930E29D95D47197B7B47C6C7111D3A3C994547C749D9A matched LT1 copy.
- Build: LT1 Ubuntu-24.04 WSL2; Gradle assembleRelease x86_64 BUILD SUCCESSFUL; APK lib/x86_64/libreactnative.so verified.
- Corrected APK SHA256 0345CF54E5F8FF80C3F2956C396D256FB4263C065F23E94E3071D2A099568EBF; size 45066567 bytes.
- Destination: DESKTOP-MB70M1T F:\Designs-by-FA\QA\CasitaDex\casitadex-e4c1d6f-x86_64.apk; transfer hash matched.
- Target: DESKTOP-MB70M1T emulator-5554, staging package com.designsbyfa.casitadex.staging version 0.1.0 code 1, installed 2026-10-22 13:28:57 local.
- Android adb install -r Success; explicit MainActivity launch; staging process PID 14714 and topResumedActivity staging after delay; no FATAL EXCEPTION in last 300 logcat lines.
- Existing com.designsbyfa.casitadex.dev package preserved; no QA data cleared.
- Initial arm64-only staging APK crashed on x86_64 emulator due to missing libreactnative.so; superseded by corrected APK.
- Visual Figma parity, navigation, reminder draft protection and functional acceptance still PENDING; launch smoke test PASS only.
