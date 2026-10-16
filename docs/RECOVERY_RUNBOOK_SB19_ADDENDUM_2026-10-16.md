# CasitaDex Recovery Runbook Addendum — SB-19 Android Staging Build
Date: 2026-10-16. This addendum complements the owner-edited `docs/RECOVERY_RUNBOOK.md` without overwriting or staging its preexisting changes.

## Source of truth and isolation
- Authoritative repo: `C:\CasitaDex-Git`, branch `prototype/bootstrap`, SB-19 Phase A commit `025c1bf`. Do not deploy Production or push unapproved commits.
- Isolated disposable *build* worktree (not a project migration): `E:\Designs-by-FA\Builds\CasitaDex\SB19-20261016\source`, detached at 025c1bf. Generated `android/` stays inside that worktree only.
- Its `node_modules` is a Windows Junction pointing to authoritative `C:\CasitaDex-Git\node_modules` (not a second standalone dependency installation). Never delete target via junction; confirm it first. Worktree is registered with the authoritative Git repository.
- Gradle 9.3.1 initially downloaded as wrapper using dedicated `GRADLE_USER_HOME=E:\Designs-by-FA\Builds\CasitaDex\GradleCache`. Java 21 from Eclipse Adoptium, Android SDK at `C:\Users\franco\AppData\Local\Android\Sdk`.

## Staging build (NOT Production)
From the isolated worktree with `EXPO_PUBLIC_APP_ENV=staging`:
1. `node_modules\.bin\expo.cmd prebuild --platform android --no-install` (already generated for this build).
2. `android\gradlew.bat -p android :app:assembleRelease -PreactNativeArchitectures=x86_64 --max-workers=2 --no-daemon` with `ANDROID_HOME` and E: `GRADLE_USER_HOME` above.
3. If successful, confirm `android\app\build\outputs\apk\release\app-release.apk`, SHA-256, manifest applicationId `com.designsbyfa.casitadex.staging`, and DEBUG signing config. BuildType Release is internal QA only because generated Gradle signs with DEBUG key. Never distribute as a production release.
4. Use the independent secondary clean Pixel 8 AVD for Staging testing; original Pixel 5 QA AVD/data must not be replaced or wiped. Android 15 System UI ANR remains an open emulator defect.

## Recovery / cautions
If interrupted, first inspect current remote job/status, console log and Gradle daemon before retrying; an exit with unknown status does NOT prove a successful APK. Do not run duplicate concurrent builds. Primary C: has ~16GB remaining so keep intermediate Gradle files on E: and monitor Windows/other project health. Build worktree and Gradle cache persist for reproducibility; clean only after owner-directed retention/backup decision. Do not touch existing E: WSL/restored-distro images or Event Command/Trend Lab repositories.
