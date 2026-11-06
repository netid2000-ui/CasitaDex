# Obsolete build quarantine, November 6, 2026

## Verified result

Between 14:13:50 and 14:18:33 UTC, five obsolete CasitaDex iOS app product bundles and two historical Android APK files were removed from their original build-product paths by reversible same-volume renames. All 595,963,240 bytes remain on the FA-Development SSD in labeled quarantine.

Nothing was deleted. No disk space was reclaimed. Each original `.app` or `.apk` is stored with a `.quarantined` suffix to reduce accidental reuse. Source, uncommitted work, build caches, logs, QA evidence, signing preparation, installed apps, simulator data and Android virtual-device data were not moved by this operation.

The owner requested removal of old builds and a GitHub record. Work was restricted to FA-MAC-DEV-01, with FA-Development as authoritative storage. No deployment, release merge, store submission, purchase, production Firebase operation, device shutdown or app uninstall occurred.

## Exact product moves

All paths below are relative to `/Volumes/FA-Development/Designs-by-FA`. The machine-readable companion JSON contains every file hash and each original-to-quarantine mapping.

- Original: `Apple-Builds/CasitaDex-DerivedData/Build/Products/Debug-iphonesimulator/CasitaDexDev.app`
  - Quarantine: `Quarantine/Obsolete-Builds/20261106T1413Z/Apple-Builds/CasitaDex-DerivedData/Build/Products/Debug-iphonesimulator/CasitaDexDev.app.quarantined`
  - Logical file bytes: 136212196. File-manifest SHA-256: `10e21705cd4040baea030e8fbff537e78d184698bdb745ac796fe93291db7f6d`.
- Original: `Apple-Builds/CasitaDex-SB41-20261104/Build/Products/Debug-iphonesimulator/CasitaDexDev.app`
  - Quarantine: `Quarantine/Obsolete-Builds/20261106T1413Z/Apple-Builds/CasitaDex-SB41-20261104/Build/Products/Debug-iphonesimulator/CasitaDexDev.app.quarantined`
  - Logical file bytes: 136494854. File-manifest SHA-256: `a484a0de7f8474edddeb36b8d5c619bd6207d35f8ed57e7e00f18a297bc8876e`.
- Original: `Apple-Builds/CasitaDex-Scene-QA-20261104/Build/Products/Debug-iphonesimulator/CasitaDexDev.app`
  - Quarantine: `Quarantine/Obsolete-Builds/20261106T1413Z/Apple-Builds/CasitaDex-Scene-QA-20261104/Build/Products/Debug-iphonesimulator/CasitaDexDev.app.quarantined`
  - Logical file bytes: 136497494. File-manifest SHA-256: `7806df6c1500e6966d7bbe24253297f7afbaa243afa14b9f33d52c6897ef7180`.
- Original: `Apple-Builds/CasitaDex-WORK-SB117/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app`
  - Quarantine: `Quarantine/Obsolete-Builds/20261106T1413Z/Apple-Builds/CasitaDex-WORK-SB117/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app.quarantined`
  - Logical file bytes: 48915726. File-manifest SHA-256: `695e788aa1a88d319524abd613feec22e8a0e084d521d092368e8bc2f9ba55ab`.
- Original: `Apple-Builds/CasitaDex-SB121-Readiness-3b526f6/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app`
  - Quarantine: `Quarantine/Obsolete-Builds/20261106T1413Z/Apple-Builds/CasitaDex-SB121-Readiness-3b526f6/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app.quarantined`
  - Logical file bytes: 49012626. File-manifest SHA-256: `79fa6abc7885718d29e48ac629e919497ac2ecb2c31214e89bc5d1db89da85bc`.

- Original: `Android-Builds/CasitaDex-SB121-Development-9fd52ae/source/android/app/build/outputs/apk/release/app-release.apk`
  - Quarantine: `Quarantine/Obsolete-Builds/20261106T1413Z/Android-Builds/CasitaDex-SB121-Development-9fd52ae/source/android/app/build/outputs/apk/release/app-release.apk.quarantined`
  - Logical file bytes: 44415164. APK SHA-256: `89a201dd5808dd07fd4eba32fb6d3623988c81b827830932152011e2c4a7c828`.
- Original: `Android-Builds/CasitaDex-SB121-Physical-9fd52ae/source/android/app/build/outputs/apk/release/app-release.apk`
  - Quarantine: `Quarantine/Obsolete-Builds/20261106T1413Z/Android-Builds/CasitaDex-SB121-Physical-9fd52ae/source/android/app/build/outputs/apk/release/app-release.apk.quarantined`
  - Logical file bytes: 44415180. APK SHA-256: `330b9acd883f4a6b6469a94b026dcc5aec049ac96f9b7123fb1371f17dcfe93d`.

The build-family names are historical labels, not independent proof of the old bundles’ source commits. All five bundles identify as `com.designsbyfa.casitadex.dev`, version `0.1.0`, build `1`; their contents are identified by hashes.

## Verification and limits

- Reused the prior inventory at `QA-Evidence/WORK-SB121/old-build-inventory/inventory.json` and its `dependencies.json`, then reconciled current task dependencies. The historical inventory alone did not authorize a move.
- The current CasitaDex acceptance owner confirmed that none of these exact seven product paths is required by the current builds, current acceptance work or reserved reminder fixtures.
- Immediately before moving, each bundle/APK had no matching open-file result from `lsof +D` or file-specific `lsof`, no candidate-path process reference and no match in the inspected active source, Release-Gates or Tools scripts/configuration. Historical documentation references are retained and resolved by the mapping. These are bounded checks, not a whole-machine proof that a path can never be referenced.
- Every regular file was SHA-256 hashed before and after moving. Relative paths, file types, symlink targets, inode/device identity, modes and modification timestamps also matched. No bundle or APK bytes were rewritten. The local full receipt retains inode/device verification; the published JSON omits those machine-specific identifiers.
- Each original product path was absent and each quarantine path present after moving. All source/dependency parent directories remained in place.
- No app behavior was retested for this housekeeping operation. Existing test results are not expanded into new acceptance claims.

## Current source versus runtime

Checkpoint observations during this operation:

- CasitaDex authority: `Development/CasitaDex/app`, clean at local source `d59bf8d684e564b1f4e6c036e3e0e53398eae9e0`. This is the Android keyboard fix being built and qualified separately. A source commit is not proof of an installed or accepted build.
- The previously published CasitaDex feature-branch head was `70cda06cf2cc0e6d4e0eebf60c568feacb69d3d9` at the publication preflight. This documentation branch starts there, so it does not publish the new local product change as a side effect.
- Current 737eac1 iOS/Android product families remain acceptance/donor dependencies. New d59bf8d build roots are reserved and untouched. The active acceptance task owns their exact runtime/hash verification.
- The frozen a8867c0 iOS linked-reminder fixture for November 6 at 09:00 CST / 15:00 UTC remains reserved. Its scheduled result was not checked or claimed here. The older c2d1239 historical fixture also remains untouched.
- Event Command source: `4115aa1621dc783705f6e5b2906471af393e3d07` in `Development/Event-Command/git-base-review-20261031`, with the uncommitted SB134 candidate still present. The last reported preserved runtime is 3f74283; cleanup did not reinstall or revalidate it.

Neither app receives release-ready, approved-design, CI-pass or new native-acceptance status from this record.

## Preserved dependencies and remaining cleanup

The following are expressly outside the completed move:

- All `Development/` source/checkouts, including unique uncommitted work and the current Android IME candidate.
- All `QA-Evidence/`, `Release-Gates/`, `Tools/Mobilewright`, test harnesses, logs and build parent directories. New cleanup receipts are additive evidence only.
- Every iOS simulator and Android AVD/data home, including the E459 reminder fixture, 7DB historical fixture, C88 current acceptance fixture, current Android session, preserved Android homes and stopped Event Command clone.
- `Apple-Builds/CasitaDex-WORK-SB120` and a8867c0/c2d1239/737eac1/d59bf8d artifacts and evidence.
- Current and donor Gradle homes, particularly `Android-Builds/CasitaDex-SB121-Physical-9fd52ae/gradle-user-home` and `Android-Builds/CasitaDex-SB121-LintFE10-a8129e8/gradle-user-home`.
- All Event Command build products. Current dependency/rollback clearance for their exact products is unresolved, so their age and names were not treated as permission to move them.
- All other Android APKs and old generated outputs. Their exact current dependency/rollback role must be cleared before any later move.

An older Event Command WORK-SB118 `native-storage-v5` test shell, emulator on port 5570 and test runner were visible in the process inventory. They were not stopped or changed. A paused current Event Command lane was not treated as evidence that every older Event process had ended.

Known Event Command products retained include `Apple-Builds/EventCommand-SB15-Derived/Build/Products/Debug-iphonesimulator/EventCommandbyFA.app` and the `ec44-ios-debug`, `EXEC-SB51-Disposable-Signed`, `WORK-SB67-patched`, `DerivedData/ec48-isolated` and `DerivedData/exec-sb51-fresh` product families under `Apple-Builds/Event-Command`. This is a bounded retained-candidate list, not a claim that all old builds have been inventoried or removed.

The two quarantined 9fd52ae APKs are not inputs to the current builds or virtual tests and will not be used as current Samsung test candidates. Their complete source/native folders and shared Gradle cache remain. No physical installed app was inspected or changed, and no physical-device rollback coverage is claimed.

## Recovery

Use the exact companion-JSON mapping. Before restoration, verify the original path is absent and no newer build is using it. Rename the quarantine directory back to the recorded original path without overwriting anything. The entire original bundle or APK is retained; no rebuild is required to undo this move.

Local detailed evidence:

- `QA-Evidence/Build-Cleanup/20261106T1413Z/before.json`
- `QA-Evidence/Build-Cleanup/20261106T1413Z/receipt.json`
- `QA-Evidence/Build-Cleanup/20261106T1413Z/android-before.json`
- `QA-Evidence/Build-Cleanup/20261106T1413Z/android-receipt.json`
- `QA-Evidence/Build-Cleanup/20261106T1413Z/publication-preflight.json`
- `Quarantine/Obsolete-Builds/20261106T1413Z/README.txt`

## Documentation checks

JSON parsing, original/quarantine path checks, manifest counts/byte totals, documentation-only review and a final rehash of all 422 regular files passed. Git whitespace checks and a basic secret-pattern review are performed before commit. The branch is documentation-only and does not match the repository’s current push-CI branch filters; no CI pass is claimed. Remote SHA verification is recorded in the local publication receipt after push. No product test suite is rerun for these two documentation files.
