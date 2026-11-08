# SB-29 Native Store Configuration Audit — 2026-10-24
Scope: isolated worktree, read-only configuration inspection; no prebuild, build, signing or deployment.

## Evidence observed
- `app.config.js`: production environment rejected; only development/staging allowed. `extra.productionAuthorized=false` and `backendMode=none`.
- Staging `npx expo config --type public --json` resolved successfully. iOS bundle ID `com.designsbyfa.casitadex.staging`, Android package `com.designsbyfa.casitadex.staging`.
- iOS tablet support enabled. iOS icons declared light/dark/tinted.
- Android `allowBackup=false`, adaptive icon declared.
- `expo-image-picker` plugin declares camera and photo access descriptions, microphonePermission=false.
- `eas.json`: staging Android APK for internal distribution; staging iOS credentialsSource=local; no production profile defined.
- No generated native `android/` or `ios/` directory exists in this isolated worktree.

## Mandatory unresolved checks
- Android merged AndroidManifest.xml permissions, final targetSdk, native 16 KB support, AAB signing, and Play App Signing: NOT VERIFIED.
- Apple built Info.plist purpose strings, entitlements, privacy manifests, required-reason API usage, code signing, and SDK version: NOT VERIFIED.
- Transitive SDK collection and network behavior: NOT VERIFIED. Backend disabled is not sufficient evidence for privacy declarations.
- iPad functional and screenshot acceptance: NOT VERIFIED.
- Final approved brand PNG exports and owner-approved Figma UI: NOT VERIFIED.

## Recommended next safe step
Generate temporary native config outputs only in a disposable copied worktree or authorized QA environment; inspect resulting merged manifests and plist/privacy artifacts without touching installed devices or original repository. Do not certify until a signed release candidate is inspected and tested.
