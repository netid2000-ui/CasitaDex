# Android OS backup privacy hardening assessment

## Verdict and observed policy
Prepare for integration: bounded hardening of existing local-only/manual-export policy. This is not evidence that any backup/transfer occurred. No authoritative source, app data or device was changed.

Input: authoritative clean source 33dfc1954b1192c19a9808b7a7da9f4b098bc07a, plus reviewed splash API33 v2 patch (SHA256 da80ae4dd4a165232391d98f8f8622db1a1d1a1eb9d47eab70c68c6591ebeac2) only in this isolated candidate. Privacy patch is a delta ON TOP of that splash patch.

Verified baseline FE10 lint source and release merged manifest: Android minSdk24/targetSdk36; allowBackup=false; no dataExtractionRules, fullBackupContent or backupAgent attribute. Full lint emits DataExtractionRules Warning. Source app.config.js has allowBackup=false, and native Android files are not tracked. A generated-only XML edit would not reproduce after prebuild.

Read master charter, product charter, release SOP and delivery skill. PRODUCT_CHARTER.md requires local-only/no-backend V1 and user-controlled versioned export/import. SB18_BYOS_STORAGE_MONETIZATION_DECISION_2026-10-15.md retains free manual complete export/restore and OS document-provider save; provider automation remains separately gated. docs/research/RESEARCH_LOG_20261020_CONTINUATION.md already documented the exact OEM caveat and need to inspect policy. This makes explicit OS-transfer exclusion defensible hardening; it is not a new cloud feature or a claim that local-first alone legally prohibits every OS migration.

## Platform semantics and implementation
Android documents that allowBackup=false blocks cloud backup but may leave OEM D2D enabled on Android12+; explicit transport rules resolve the app's declared policy. Both cloud-backup and device-transfer exclude path '.' across all nine documented domains: root, file, database, sharedpref, external, and device_root/device_file/device_database/device_sharedpref. Device-protected storage must not be omitted. No encryption-only flag is used as a substitute for excluding content. Empty/missing sections would not mean opt-out.

A local Expo plugin applies manifest policy after preceding mods and writes deterministic res/xml/casitadex_data_extraction_rules.xml. The API31 manifest attribute consumes this format only on supported OS versions. An unqualified resource follows Android's documented layout and avoids a missing-default resource. Legacy allowBackup=false is retained and fullBackupContent=false explicitly disables the older full-data mechanism. No minimum-SDK, dependency, lockfile, iOS, permission, runtime database, backup/export implementation or splash visual change. A custom backupAgent causes generation to stop for review rather than silently assuming XML controls it.

These rules cover Android app-private OS transports, not user-selected exported files once copied to an external provider, privileged third-party extraction, or guarantees about every manufacturer's implementation. Manual export/restore stays available and unchanged. Current Android documentation also describes API36.1 cross-platform enrollment; no cross-platform section or app association is enabled by this fix. Reassess that separately if adopted.

Sources checked 2026-11-06:
- https://developer.android.com/identity/data/autobackup (transport sections, domains, recursive exclusions)
- https://developer.android.com/about/versions/12/behavior-changes-12#backup-restore (OEM allowBackup caveat)
- https://developer.android.com/guide/topics/manifest/application-element#fullBackupContent (legacy boolean opt-out)

## Tradeoff and user data
Future OS-managed migration will not transfer CasitaDex private content under conforming transports; users must make an explicit portable backup and restore it themselves. This matches existing source intent but removes accidental OEM convenience. It does not remove stored data, delete existing cloud copies, revoke a provider grant, or prove historical copies do not exist. Do not advertise automatic protection, guaranteed OEM enforcement or secure erasure.

## Verification on FA-MAC-DEV-01
PASS: revised focused run has 22 tests (5 privacy, 4 existing configuration, 8 reviewed splash-v2, 5 existing media privacy), zero skips/failures. Covers 18 XML exclusions, legacy false values, unrelated manifest/component preservation, custom-agent rejection, missing application rejection, both managed environments and idempotent registration, real Expo mod order, repeat byte-stable resource write, iOS untouched, introspection without writes, and verifier rejecting missing device_database exclusion and unsafe manifest.
PASS: TypeScript --noEmit; source ESLint src --max-warnings=0.
No full npm suite invoked because source candidate node_modules is a read-through link to existing dependencies and decoder tests can write shared caches. Parent must run full suite using its isolated dependency/cache strategy.
NOT RUN: full clean Expo prebuild, merged-manifest generation, AAPT/resource link, Android full lint, APK build, emulator OS backup/transfer behavior or native manual backup/import regression. Do not call the warning closed or the app releasable until generated and packaged output is verified. No build/device/physical-phone action performed.

Integration sequence: apply splash patch, then privacy-only patch; run isolated full tests and prebuild; run scripts/verify-android-backup-privacy.cjs <android-root> and again with release merged-manifest path as optional second argument; run splash verifier; rerun full Android lint using previously verified invocation-only FE10 workaround; inspect packaged manifest/resource. Native acceptance remains emulator/simulator-first, no destructive backup/restore test or settings change on populated devices. Official automated backup tests can clear app data and are not authorized here.

## Artifacts
Candidate: Development/CasitaDex/sb121-backup-privacy-candidate-33dfc19
Evidence: QA-Evidence/WORK-SB121/backup-privacy-fix
The privacy-only patch contains app.config.js, tests/config.test.mjs, plugins/withAndroidBackupPrivacy.js, tests/android-backup-privacy.test.mjs, scripts/verify-android-backup-privacy.cjs, and this report. No commit or push.

Test hygiene revision: temporary fixtures use os.tmpdir() with external-SSD TMPDIR supplied by the runner and t.after removes only its uniquely created test-owned directory. Previously preserved checkout fixtures are not deleted. Focused checks passed with isolated external-SSD TMPDIR, XDG_CACHE_HOME and npm_config_cache directories; no test fixture remained after completion (the later lint command retained only its isolated node-compile-cache). No full decoder suite was invoked. The candidate splash files were updated to the reviewed v2 baseline, without adding them to the privacy-only delta.
