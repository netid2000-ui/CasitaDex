# CasitaDex shared emulator starter-screen blocker - 2026-10-15

On DESKTOP-MB70M1T Android 15 emulator-5554, installed CasitaDex debug-signed Staging APK showed text: Open up App.tsx to start working on your app! UIAutomator evidence. Therefore prior PID/launcher smoke checks do not prove actual CasitaDex application rendered. This is a QA FAIL for functional startup, not passed CRUD.

Debug APK was built with :app:assembleDebug and needs Metro JavaScript, while the shared emulator already has ADB reverse host-17 tcp:8081 tcp:8081 from disposable Expo smoke workflow. Do not alter shared mapping or terminate Metro used by other projects. Root CasitaDex package.json entry is expo-router/entry; actual routes src/app/_layout.tsx. A standalone bundled JavaScript release build is needed to isolate which application executes.

Corrective isolated detached-build attempt C:\cq\build-standalone.cmd started via AI Commander job d8a1b991142802f3 on DESKTOP-FP0BMH2. Its result is not assumed. Require bundled asset, staging package, signing/install capability and UIAutomator actual CasitaDex text before CRUD QA. Existing Android device and Production untouched.
