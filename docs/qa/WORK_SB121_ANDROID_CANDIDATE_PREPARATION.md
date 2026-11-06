# SB121 current Android QA candidate

Date: November 6, 2026 UTC. Machine: FA-MAC-DEV-01 only. Status: BUILD / ARTIFACT VERIFIED; current-candidate native acceptance NOT RUN. No physical-phone installation or test occurred.

## Current owner restrictions

All builds and testing stay on the Mac mini. All required emulator and simulator testing must finish before any physical-phone testing. Preparing artifacts is allowed. Keep the existing iOS reminder simulator, installed c2d1239 runtime, pending 09:00 CST linked reminders and data untouched. No production, release merge, store submission, purchase, production Firebase write, host-network/security change or destructive project/device-data operation is authorized. Physical-iPhone final signoff remains with the owner after virtual gates.

The directory name android-physical-preparation predates the virtual-first clarification; it is an artifact-preparation record, not physical-device acceptance. A passive readiness inventory observed an authorized Android phone but did not install, launch, query its app data or test it. Do not publish its identifier or mistake readiness for permission to test.

## Immutable provenance

- Branch: work/cd-sb41-edit-targeting-20261104. Clean source snapshot: 9fd52ae1fac7d38babb57b393acebd426d830159. Application implementation: 3b526f6976d0d9becafd16ede2fd12ba89216ff4; later commit is documentation only.
- Lockfile SHA-256: 9497dfde8721e0ac91ea3d7acf7a597117917d7cd5b1b94bc1d433f49a5282ac.
- Isolated source: Android-Builds/CasitaDex-SB121-Physical-9fd52ae/source. Git archive plus independent APFS copy-on-write node_modules; no symlink to the authoritative mutable dependency tree.
- Fresh Android generation: Expo SDK 57 prebuild --platform android --no-install, staging environment, no dotenv/telemetry/network fetch. Generation job 591f1f56a586c389 exited 0 in 5.9 seconds. All 698 tracked source files remained byte-identical to the immutable snapshot after generation/build.
- Artifact: Android-Builds/CasitaDex-SB121-Physical-9fd52ae/source/android/app/build/outputs/apk/release/app-release.apk. Size 44,415,180 bytes.
- APK SHA-256: 330b9acd883f4a6b6469a94b026dcc5aec049ac96f9b7123fb1371f17dcfe93d.
- Bundled Hermes JS SHA-256: 08a20213081d10876bc938e855396c47cbe7cb80248b3e6714f3b382340a6c0b.
- Package com.designsbyfa.casitadex.staging, label CasitaDex Staging, version 0.1.0 (1), Release, non-debuggable, arm64-v8a only. Minimum API 24, target/compile API 36.

## Executed build and artifact gates

Successful job 2c668c5da3b3a276 ran 03:17:16.863–03:19:42.138 UTC, exit 0. Gradle reported 2 min 24 sec, 609 tasks executed. Java 21 host runner with existing Temurin 17 toolchain; Gradle 9.3.1, SDK build-tools 36.0.0, NDK 27.1.12297006. Workers limited to 2, no parallel projects, offline dependencies, no persistent Gradle daemon. Shared fa-mac-heavy-build lock serialized heavy work.

The release verification hook checks exact candidate root, staging application ID, non-debuggable release and signing identity before assembling. It resolves releaseRuntimeClasspath completely, rejects unresolved dependencies and rejects com.google.firebase coordinates. 217 native coordinates passed. This is native dependency graph evidence, not proof of zero network transmissions.

APK Signature Scheme v2 verification PASS. Signer certificate SHA-256 fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c. The generated debug.keystore was compared byte-for-byte to the published Expo template archive before use. This public QA identity is not a protected release key or a distribution credential. No owner credential was accessed, created or imported. This artifact is not store-ready.

16 KiB APK zip alignment PASS. Independently parsed all 23 packaged ELF64 arm64 native libraries: every PT_LOAD segment alignment is at least16 KiB with compatible virtual/file offsets. This static packaging check does not replace execution on a16 KiB device.

Merged manifest confirms allowBackup=false, notification/boot receiver integration and unexported reminder receiver; microphone permission is absent. INTERNET and Expo-template SYSTEM_ALERT_WINDOW remain declared. The latter was not granted or used; unnecessary-permission review remains open. No production backend or app updates endpoint was enabled.

## Failures preserved and corrected

1. First build stopped before app compilation. The evidence init hook incorrectly asserted an app project inside included Gradle plugin builds. Version2 restricts the hook to the exact main project; original hook/log retained. Shared ~/.gradle journal-1/file-access.bin also reported a CorruptedCacheException. The shared cache was not deleted, repaired or reset.
2. A fresh external Gradle home was seeded only with existing wrapper and modules-2 artifacts, excluding lockfiles, journals and transform caches. The second attempt stopped because this fresh home did not discover the existing JDK 17.
3. The successful attempt explicitly points its private gradle.properties at verified existing JDK 17 and JDK 21 and disables toolchain downloads. No new software install, source workaround or dependency version change was needed.

Repeatable build parameters: GRADLE_USER_HOME is Android-Builds/CasitaDex-SB121-Physical-9fd52ae/gradle-user-home; EXPO_PUBLIC_APP_ENV=staging, both Firebase flags=false, NODE_ENV=production, EXPO_NO_DOTENV/EXPO_NO_TELEMETRY/EXPO_OFFLINE/CI=1. Invoke ./gradlew --offline --no-daemon --max-workers=2 --no-parallel -PreactNativeArchitectures=arm64-v8a -I <evidence>/verify-qa-release-v2.gradle verifyCasitaDexQaRelease :app:assembleRelease. Inspect and preserve outputs before any retry.

## Native continuation and display state

Fresh synthetic AVD dedicated CasitaDex SDK57 virtual QA device is prepared only, with no userdata or snapshot copied. Reserved proposed lane a distinct emulator and ADB endpoint recorded in the local runbook, API 35 arm64 Google APIs,2 GiB RAM, 2 CPUs. The normal avdmanager command could not discover valid image paths despite the installed image. Preparation used only the already verified SB77 config template, validated image path and fresh registration, preserving original state. No new image was downloaded.

Do not boot while Event Command occupies the one-new-Android-device budget. Preserve old SB118 Android emulator and ADB endpoint and all Event Command Firebase jobs. The current EC virtual lane is reserved separately; obtain explicit lane handoff before booting CasitaDex. Use a visible GUI (never -no-window), exact AVD/serial/port and current APK hash. The prepared helpers.py is syntax-checked only; it does not start ADB, refuses absent server, and validates ro.kernel.qemu plus exact AVD name before tests. No physical-device serial is in the driver.

The existing iOS CoreSimulator remains booted. Xcode 27.2 uses DeviceHub.app rather than Simulator.app. Opening DeviceHub succeeded; System Events window inspection was denied because osascript lacks assistive access. No permissions were changed. An independently authorized desktop capture showed DeviceHub visible but selecting a stopped iPhone Duo, while the booted CasitaDex SB69 row was in its sidebar. Thus iOS display selection was not yet verified; do not click Start on another device.

## Acceptance boundaries and next gates

Current APK native launch, reminder creation/delivery/taps, draft guards, offline persistence, large text and native accessibility remain NOT RUN. Preserve earlier SB116 Android two-photo/offline and SB113 backup acceptance as historical evidence, not current-APK proof. Current source unit/type/lint/Doctor and security results remain in WORK_SB121_SECURITY_ACCESSIBILITY_READINESS.md. This build changes no app source.

Next virtual work: fresh launch; real UI memory save/reopen and draft preservation; notification permission and actual normal-clock standalone delivery with exact target correlation; large-text/landscape reachability; targeted photo/backup regressions only where current dependency/native changes require them. Do not label injected deep links or cosmetic radio icons as notification delivery/offline proof. All-screen Figma, TalkBack/VoiceOver and untested failure paths remain explicit gates.

Strict iOS simulator offline capability is still unresolved. Read-only current Xcode 27.2 help and Apple docs expose no simulator-only network disconnect; status-bar no-service is cosmetic. Host networking must stay unchanged. App-scoped transport-denial alternatives are being researched with precise coverage limits. No physical-phone substitution is authorized before virtual gates finish.

Roles: product/governance preserves local-first scope and owner gates; engineering/tooling delivered isolated reproducible candidate; QA verified build/artifact provenance but not runtime; security checked complete native graph/signature/ELF and retained open advisories; privacy reviewed merged permissions without claiming zero-transmission proof; accessibility and Figma specialists retain native/manual acceptance gates; documentation records immutable evidence and failures; release coordination remains NO-GO. No specialist/owner signoff is inferred.
