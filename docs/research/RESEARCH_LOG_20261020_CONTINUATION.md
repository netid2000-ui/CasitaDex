# CasitaDex research continuation — October 20, 2026
Research-only. No code, device, deployment, cost, or gate changes.

## Newly verified in today's research (not necessarily newly published)
Android 12+ uses distinct cloud and device-to-device backup rules; allowBackup=false may not prevent OEM device transfer. https://developer.android.com/about/versions/12/behavior-changes-12
Android automated backup/restore test guidance distinguishes LOCAL, CLOUD_ENCRYPTED, CLOUD_UNENCRYPTED and DEVICE_TO_DEVICE. These tests do not replace CasitaDex custom Full v4 native acceptance. https://developer.android.com/studio/preview/backup-restore-testing
Apple documents encrypted local iPhone backups, distinct from application-level export. https://support.apple.com/en-ie/108353

## Current evidence
Charter docs/PRODUCT_CHARTER.md v0.7, 2026-10-15: fewer features, faster answers, home-first, offline-first.
SB24 docs/qa/SB24_ACCEPTANCE_20261020.md: targeted cancellation and injected low-storage checks passed; authoritative APK provenance, native interruption/restart, actual ENOSPC and media journal acceptance remain open. Previous full suite: 293 pass, 2 skip; not rerun here. SB25/26 remain gated.

## Nine discipline exercises
Product/project: evidence-led SB24 gate ledger.
Architecture: custom Full v4 versus OS backup responsibility map.
Android/iOS: manifest extraction policy and encrypted backup distinction.
UX: accurate restore preview, cancel and replacement language.
Accessibility: TalkBack/VoiceOver confirmation, focus and enlarged text.
Security/privacy: verify local-only promise against OS backup behavior.
Data protection: corruption, low storage, interruption, repeat restore matrix.
QA: fixture versus native evidence and source/APK provenance.
Market: observe answer-first completion and recovery comprehension.

## Priority proposals, not authorization
P0 SB24: provenance, native restart/interruption, media journal, OS backup policy inspection.
P1 SB25 after SB24 acceptance: retention, ownership, storage safeguards.
P1 SB26 after SB25 acceptance: accessible Home/Find/Answer and recovery UX.
P2 later: customer comprehension research.

## Additional read-only repository inspection, 2026-10-20
Observed app.config.js line 22: allowBackup: false. No android/ native manifest or extraction XML was present in the inspected repository path. This proves only the source configuration intent, NOT merged manifest or built APK behavior. Android documentation explicitly warns allowBackup=false can still permit D2D on some manufacturers. Source: https://developer.android.com/about/versions/12/behavior-changes-12
Next read-only gate: inspect generated/merged manifest and exact installed APK metadata when a traceable build is available. Do not install, uninstall, wipe, trigger bmgr, or change device settings during research.
Official experimental AGP automated backup testing clears app data before each test; not suitable to run on the owner's populated devices without separate explicit approval and disposable fixtures. https://developer.android.com/studio/preview/backup-restore-testing

## Read-only compiled APK inspection (2026-10-20)
Artifact C:\cdr\a\android\app\build\outputs\apk\release\app-release.apk, SHA256 83EC6AA965F64CF6F82A8D10F5D203A2C96CF1900D7BD438131B6AF67F39ECB9.
Android SDK aapt 36.0.0 reports compiled manifest android:allowBackup=false. No dataExtractionRules, fullBackupContent or backupAgent manifest attributes appeared in filtered output; no backup/extraction-named packaged resources were found. This is limited to the inspected APK, not proof of OS D2D exclusion or installed-device binary identity.
Source mismatch reconfirmed: authoritative src/eng-runtime.native.ts line 116 blocks Full v4 restore pending emulator recovery acceptance; isolated C:\cdr\a source lacks that gate. Do not promote isolated build to authoritative release or remove gate based on this inspection.
P0 follow-up: trace build provenance, compare exact installed APK when authorized, evaluate OEM transfer behavior on disposable device only, and finish native restore interruption acceptance. No device touched or app code modified.

## Read-only APK provenance reconciliation — 2026-10-20
Authoritative repo C:\CasitaDex-Git branch acceptance/eng-review-20261019 HEAD 0814c04; working tree dirty and preserved. Isolated C:\cdr\a has no .git metadata.
Identical SHA256 between directories: app.config.js 2DEB3188436041DC384FDF5F52241BAA9D94CBE585FBB61E518DE9BD16B91A1B; package-lock.json 14B4466AEF07B7DB35891414F60A4087A7AD2DFE8273239CAFB0623145AF4E65.
Different SHA256 for src/eng-runtime.native.ts: authoritative A9142231846FAAA400B80362138429B692156F82539D5D09FC579B12F16ED653; isolated F6E1FA8928A53D48BE79D2BED89553B6429E1CC1BE10F56DFD6D658411992C06. Line comparison identified the authoritative Full v4 restore safety gate absent in isolated source.
Gradle output-metadata.json: applicationId com.designsbyfa.casitadex.dev, variant release, versionName 0.1.0, versionCode 1, file app-release.apk. This metadata does not establish source commit provenance or identity of installed device APK.
Disposition: SB24 remains blocked from acceptance; no promotion, gate removal, or device action. Next authorized investigation is read-only provenance documentation and safe native-test planning.

## Build and QA readiness inspection — 2026-10-20
Read-only inspected scripts/build-android-staging-shortpath.ps1: it rejects dirty source checkouts and refuses to overwrite existing scratch build directory; do not bypass these guards. Authoritative repository currently has uncommitted changes.
Read-only inspected scripts/android-qa.cjs: defaults to ANDROID_SERIAL emulator-5554 and package com.designsbyfa.casitadex.staging; prior SB24 evidence concerns emulator-5580 and isolated APK package com.designsbyfa.casitadex.dev. Do not run helper unchanged or assume target equivalence.
Recommended gate: owner-reviewed preservation checkpoint and explicit disposable target selection before any build/native QA. Continue read-only artifact provenance inspection only; no device actions or code changes authorized by research.

## Read-only preservation readiness — 2026-10-20
Git HEAD 0814c0426c54876f523c2b45704cf7c8768d58ed; 11 modified tracked files and 52 untracked files (git ls-files count). Existing commit alone does not preserve this work.
Disk inventory: C: NTFS about 16.48 GB free; E: NTFS about 1.98 TB free; H: NTFS about 1.07 TB free; G: reports no filesystem/capacity. E:\Designs-by-FA\Backups exists; G:\Designs-by-FA\Backups unavailable. Do not assume G: backup readiness or encryption.
Preservation recommendation: owner-approved, verified, encrypted destination and immutable timestamped snapshot including tracked modifications and untracked files, with manifest/hash verification; exclude caches, secrets and live app data only after explicit inventory. No backup, file cleanup, git commit, device operation or build performed during this review.

## Preservation encryption preflight — 2026-10-20
Read-only inventory via git ls-files --cached --others --exclude-standard: 411 paths, 15,553,150 bytes for present regular files. E:\Designs-by-FA\Backups exists and has capacity. Get-BitLockerVolume E:,H: returned no usable status; manage-bde -status E: and H: returned access denied (administrative rights required). Therefore encryption and unlock state are UNKNOWN, not verified. No backup created. Owner decision or authorized elevated read-only check needed before copying to a destination required to be encrypted. No privilege escalation attempted.
