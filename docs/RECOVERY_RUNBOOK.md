## October 19 UTC - ENG application gaps implemented; acceptance gates remain

The identified Home/Find/Add/Detail/More application gaps I01-I13 are implemented and integrated (26 code/test/package files). WSL: 271 PASS; primary Windows: 269 PASS / 2 expected symlink SKIP / 0 FAIL. Compilation, lint, web export and both Development Android builds pass. The 215-component native runtime has no Firebase. All 69 frozen source/config/package hashes match primary.

Native checks cover durable photo/draft fields, Review/edit guards, independent sharing consent, explicit restores, actual full/text exports with independent filesystem/SQLite reopen, and 0/500/5000 collection flows. Final data/draft/attempts exactly match the preserved three-record/five-photo-draft snapshot.

Full ENG/SB-20 RELEASE acceptance remains PARTIAL: numerical storage policy, trusted-clock permanent cleanup, remaining real native failure/platform/human acceptance and publication gates stay open. Existing emulator System UI reboot ANR remains open. Expo Doctor reports five pre-existing SDK patch mismatches (20/21 checks). No commit/push/merge/deploy/phone/cloud activation occurred.

Current ledger: [ENG_COMPLETION_CHANGE_TEST_LEDGER_2026-10-19.md](design/ENG_COMPLETION_CHANGE_TEST_LEDGER_2026-10-19.md). More -> Backup & Restore contains full, limited text and previous-save recovery tools. Storage & Cleanup is first under Memory management. Earlier entries below are historical and retain their original scope.

---

## October 19 UTC - ENG coverage correction: INCOMPLETE
Review of 37 design/integration records and the 236-case inventory found missing signed behavior. Nine disposable probes reproduced seven unmet requirements: answer/source verification reset, stale restore preview, draft notes, multiword search, default share privacy, and local-calendar dates. Two positive checks passed, including legacy seven-photo/two-Space portability.
Core native media/draft/full-backup evidence remains valid at its stated scope. Full ENG and SB-20 are NOT complete. Home/Find/Add/Detail/More conformance and consumer failure-path coverage also remain incomplete, beyond the existing platform/calibration/cleanup gates.
See docs/design/ENG_DOCUMENT_COVERAGE_AUDIT_2026-10-19.md and docs/qa/eng-coverage-audit-20261019/probes.json. This review changed documentation/evidence only; application/APK source unchanged. Prior completion wording below is superseded, historical evidence preserved.

## Full ENG Development recovery addendum - 2026-10-19 UTC
This addendum supersedes old v1-only backup/draft statements for Development. Staging/web retain their existing paths.
Native database remains casitadex-development-v1.db. New eng_state_v2 and eng_recovery_v2 hold validated version-3 wrapper snapshots with canonical DataV2, private draft, revision and idempotency attempts. eng_control_v2 marks initialization; eng_media_ops_v2 retains staged/uncertain ownership; eng_damaged_v2 preserves damaged raw snapshots during explicit repair. Original v1 tables/legacy data remain untouched. Never reset/remigrate merely because a primary row is missing.
More -> Save full backup writes .cdxe (CDXE3 magic), including draft photos, all saved lifecycle states, taxonomy and history. Preview counts before explicit replacement. If a current draft exists, choose Keep current or Use backed-up; Cancel changes nothing. Full previous-save recovery swaps complete state, including draft/photos. Legacy v1/CDXM2 imports disclose omitted draft/taxonomy/lifecycle semantics.
Corrupt/missing primary: preserve sandbox; retry load, recover known-good previous full state or explicitly restore a verified full backup. Repair retains raw damaged bytes and does not let them displace known-good recovery. Future versions fail closed. Keep current is unavailable if current draft cannot be read. Failed staging/write preserves previous metadata and retains uncertain files/journal. No automatic physical cleanup or permanent purge.
Archive/Recently Deleted reclaim zero bytes. Integrity/storage review hashes protected owners; do not infer that an unlisted file is safe to delete. Keep legacy/recovery/journal/damaged evidence. Numeric pressure thresholds remain unapproved; operation-specific capacity guards are enabled.
Full backup streams <=10 MB images in 64 KB chunks. SAF append uses scoped streams; read-back copies to private cache then validates hashes/frames/header. Capacity checks include destination plus verification copy. A failed export removes only its newly created incomplete output; never delete source media.
Before uninstall/reset/phone work, export and independently verify the user's current state. QA backup is synthetic evidence, not the owner's personal-device backup. Database copies require closed handles/WAL handling; source archives do not contain app data.
See docs/design/FULL_ENG_NATIVE_ACCEPTANCE_2026-10-19.md for final artifacts, hashes, native evidence and unresolved physical/iOS/reboot/accessibility/calibration gates. No commit, push, deployment or personal-phone installation occurred.

# CasitaDex recovery runbook
Updated 2026-10-07 for the Native Acceptance + Data Durability batch.

## Source and local preview
Restore this isolated repository from its local Git commit or Git bundle; no remote or off-device backup is configured. Preserve your own export before uninstalling or clearing app/browser data. A source bundle contains code, not your app data.
Use Node 24.19.0 (also runs the node:sqlite technical spike), npm and the committed package-lock.json. Run npm ci, npm run typecheck, npm run lint, npm test, npm run doctor, npm run export:web. Review the Doctor result; do not suppress its online schema check.
Start npm run preview for the static web review on 127.0.0.1:8765. Expo development normally uses port 8081; choose an unused port rather than stopping unrelated software. No public tunnel or server is needed for installed native operation. The web preview requires its local server for cold page loads; loaded-offline browser evidence is not native offline-cold evidence.
Browser QA uses Playwright 1.62.1 and installed Microsoft Edge, isolated from personal browser sessions:
- npm run test:browser
- node tests/accessibility-smoke.cjs
- node tests/durability-browser.cjs

## Native structured data
Android/iOS use expo-sqlite 57.0.4. Each environment uses casitadex-development-v1.db or casitadex-staging-v1.db inside its app sandbox. On Android Expo places these under files/SQLite; the typical Staging path is /data/user/0/com.designsbyfa.casitadex.staging/files/SQLite/. iOS uses Expo's defaultDatabaseDirectory; do not hard-code a simulator UUID.
Tables: spaces, cards (one validated card document, including ordered history, per row), metadata (schema and previous-save snapshot). The private connection enables WAL, synchronous FULL and foreign keys. The repository serializes operations and uses BEGIN IMMEDIATE / COMMIT / ROLLBACK on that connection. No unrelated asynchronous operation can join a transaction.
Only a committed schema marker marks migration complete. Existing AsyncStorage casitadex:<environment>:v1 data is validated and migrated once; legacy bytes are left untouched. Invalid legacy primary data blocks ordinary loading/saving. Explicit recovery can import its valid :recovery copy. Failed migration rolls back and remains retryable. Future database schema versions fail closed.
To recover: retry loading; if unsuccessful, explicitly choose Recover previous save. Normal save first validates existing primary rows; corruption cannot displace known-good recovery. Recovery is transactional. If neither current nor recovery data is readable, preserve the sandbox and obtain a user-controlled export if one exists; do not clear storage or reset to empty.
Do not copy just a live .db file: WAL sidecars may contain committed data. Prefer the app's validated text export. Low-level diagnostic copies require a closed app/database and preservation of relevant sidecars. Device/emulator root inspection is not a consumer backup feature.

## Web data and reading preferences
The browser preview retains AsyncStorage's browser-origin storage, using casitadex:development:v1 or casitadex:staging:v1 plus :recovery. Native migration does not alter a browser origin. Ports/profiles are separate stores. The browser adapter validates the prior value before writing recovery, but its two-key write is not an atomic database transaction.
Reading preferences use casitadex:<environment>:preferences, separately from card exports. Light, Dark, System, and Extra-large text persist on the device. OS font scaling remains enabled. If preference writing fails, the UI explains that the current setting could not be persisted.

## Export/import and deletion
More prepares a user-controlled version-1 text backup with spaces/cards/dates/confidence/history. Paste a backup, validate it, review counts, then explicitly confirm replacement. The limit is 2,000,000 UTF-8 bytes, not characters. Unknown fields are stripped; invalid dates, duplicate cards, missing references, or unsupported versions are rejected before mutation.
No media attachments, media cleanup, file-provider export or local notification scheduling are implemented. Imports containing media fail explicitly. Do not imply complete media/reminder acceptance.
Plain text exports and local data are not encrypted credential storage. Device loss, browser clearing or uninstall may erase current and recovery data. Deletion removes a card from the current collection; previous-save snapshots and preserved pre-migration legacy bytes can still contain it. Retaining legacy data is a deliberate reversible migration safeguard; cleanup requires a separately documented, verified post-migration step. Do not claim secure erasure or automatic cloud backup.

## Windows Android build tooling
Local inventory: Android Studio; SDK at C:/Users/franco/AppData/Local/Android/Sdk; Temurin JDK 21.0.12.101; Gradle wrapper 9.3.1; SDK/build tools 36; NDK 27.1.12297006; emulator Medium_Phone_API_37.0 (Android 17/API 37, x86_64). Exact build result is in NATIVE_BATCH_REPORT.md.
Set JAVA_HOME to the installed JDK 21 directory and ANDROID_HOME to that SDK directory. Use a task-owned ANDROID_USER_HOME (../../work/android-state) to avoid the restricted shell attempting to write /.android, and GRADLE_USER_HOME (../../work/gradle-cache). npm cache for this batch is ../../work/npm-cache. These caches are reconstructible downloads, not app backups.
Set EXPO_PUBLIC_APP_ENV=staging, EXPO_NO_TELEMETRY=1, CI=1.
1. node node_modules/expo/bin/cli prebuild --platform android --no-install
2. Resolve scripts/verify-local-only.gradle to an absolute path (Gradle resolves relative init scripts under android/).
3. android/gradlew.bat -p android --init-script <absolute-guard-path> verifyLocalOnlyRuntime :app:assembleRelease -PreactNativeArchitectures=x86_64 --max-workers=2 --console=plain --no-daemon
This is an internally tested Staging build with a generated debug/test signing key, despite Gradle's release-variant name. It is not Production authorization or store signing. It bundles JavaScript so no Metro server is required for offline-cold tests. Generated android/ and ios/ are ignored; do not commit generated test keys. No EAS/cloud build is used.
Use adb -s <verified emulator> install -r <test APK>, then launch com.designsbyfa.casitadex.staging. Never clear or uninstall other apps. Capture emulator settings before tests and restore changed font, appearance, accessibility and network settings afterward.
Original emulator state for this batch: font_scale=1.3, night mode=no, accessibility services=null, airplane=0, wifi=1, mobile_data=1, animator/transition/window animation scales=0.

## iOS and physical devices
Xcode and an accessible Mac/iOS simulator or a separately authorized signed device build are required. This Windows environment has no accessible Mac/Xcode, physical Android or physical iPhone test target. Keep those gates OPEN; do not substitute browser/Node/emulator results for physical-device acceptance.

## Security, processes and release boundaries
SDK baseline: Expo 57.0.27, React Native 0.86.3, React 19.2.3, TypeScript 6.0.3, AsyncStorage 2.2.0. Added expo-system-ui 57.0.4 and expo-sqlite 57.0.4; lockfile is authoritative.
No Firebase/backend, account, ads, analytics, paid resource, EAS project, public hosting, store submission or Production configuration. Production config intentionally throws. Stop only task-owned preview/build/test processes when finished. See DEPENDENCY_REVIEW_2026-10-07.md for unresolved advisories; local acceptance is not a distribution waiver.

## Windows build path recovery
The long projectless workspace path produced repeated CMake object-path warnings (object directory 209 characters; full object-path maximum 250) during native library generation. Cancel that attempt and build an exact local Git clone under C:/Users/franco/Documents/Codex/work/cdx. Keep the primary repository and its history intact; no source edits in the build clone. The first short-clone attempt still failed because a transformed React Native library under the original Gradle cache exceeded 260 characters. Use the short physical GRADLE_USER_HOME C:/Users/franco/Documents/Codex/work/g as well; npm may retain its original cache. The existing cache was copied without deleting the original. Build evidence must identify the source commit and clone path. This is local build recovery, not a cloud resource or another product repository.

For Git ownership diagnostics in the task-created short clone, use a per-command safe.directory setting for that exact clone if needed; do not globally trust arbitrary directories. Native QA helper scripts are preparation, not a pass until their results are recorded.

The short clone plus short cache still failed at the generated gesture-handler object filename (13m38s, 125 tasks). A temporary R: mapping to that exact clone was then tested. Existing generated Android/.cxx directories were preserved under -before-drive names inside the clone; prebuild was regenerated through R:. Remove only this task's mapping with subst R: /D after the build; do not remove another mapping. No source was moved. See final native result before treating this recovery as successful.

### Final outcome of Windows recovery
BLOCKED / NOT ACCEPTED. No APK was produced or installed. The short physical clone plus short Gradle cache failed after 13m38s (125 tasks) at :app:buildCMakeRelWithDebInfo[x86_64], with a generated gesture-handler object filename longer than 260 characters. The temporary-drive prebuild succeeded after moving the project beneath the mapped root, but its build failed after 4m26s (39 tasks): React Native codegen mixed R: and C: roots for AsyncStorage. The task-owned R: mapping was removed. No emulator network, font, appearance or accessibility settings were changed; no synthetic native records were created. Native QA scripts are prepared and syntax-checked, but NOT RUN.
The last mapping was R: -> C:/Users/franco/Documents/Codex/work, with the project at R:/cdx. It was removed after failure. The physical short clone remains reconstructible build scratch; preserved -before-drive folders contain generated build material and must not be archived as source. No workaround here is a verified successful native build recipe. Next recovery needs one consistent physical root for all generated paths; preserve the application source commit while diagnosing. No cloud build is authorized.

## CD-SB-01 short physical path diagnostic (2026-10-08)
A guarded Windows helper is available at `scripts/build-android-staging-shortpath.ps1`. It begins as a **dry run**. After confirming SDK, JDK and free disk capacity, use `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-android-staging-shortpath.ps1 -RunBuild` from a trusted local checkout. It requires a **clean source** and refuses to overwrite `C:\cdx\a`; it clones an exact commit there without hardlinks, creates separate short Gradle/Android/npm caches under `C:\cdx`, selects Staging, uses the existing Gradle `verifyLocalOnlyRuntime` guard, and attempts an offline-capable non-Production APK. It does not change global Windows path settings or create a drive mapping. Never run without checking existing `C:\cdx` contents and adequate disk space. It leaves generated scratch content for diagnostics; remove only after archiving evidence and verifying ownership. A successful build still requires manifest/APK scan, install and native tests. **No successful execution of this helper is claimed from the Linux ChatGPT environment.** The earlier Windows build obstacle may persist even under this shorter root.

### 2026-10-08 CD-SB-01 Android staging build diagnostic
Run `scripts/build-android-staging-shortpath.ps1` in PowerShell on the authorized Windows Android development PC after source has been restored to a clean, exact Git checkout. Dry-run first; then use `-RunBuild` only after checking the isolated `C:\cdx\a` target is absent. The script clones to a short real C: physical path and prebuilds Android with `EXPO_PUBLIC_APP_ENV=staging`. It explicitly verifies the resolved no-Firebase runtime graph **before** invoking `:app:assembleDebug`; the resulting locally debug-signed output is `C:\cdx\a\android\app\build\outputs\apk\debug\app-debug.apk`. The APK is not Production-signed and may not be uploaded to an app store. Record the package ID, APK hash, Gradle log and emulator installation results. A successful compile does **not** close native usability/SQLite/lifecycle/accessibility gates. Avoid mapped/subst drives or mixed source roots. The correction itself has not yet been run on the Windows machine.

### Short-path native build preflight
The `scripts/build-android-staging-shortpath.ps1 -RunBuild` command checks `ANDROID_HOME\platform-tools\adb.exe` and `JAVA_HOME\bin\java.exe` before creating its isolated `C:\cdx\a` checkout. A missing prerequisite now fails without leaving a partial clone. A failure *after* clone begins still requires inspection and manual preservation/removal of `C:\cdx\a` before retrying; never delete the original source repository.

## Android Staging recovery and Backup Phase A - 2026-10-09

The earlier blocked Android build attempts documented above are historical.

### Verified Android staging build

Repository: C:\CasitaDex-Git
Branch: prototype/bootstrap
Verified source baseline: 19ca392
Build checkout: C:\cdy\a
Build architecture: arm64-v8a
Environment: Staging only

Standalone APK:
C:\cdy\a\android\app\build\outputs\apk\release\app-release.apk

The APK was built successfully, verified as Firebase-free,
and installed using adb install -r without uninstalling the app.

The APK is locally test-signed, not Production-signed.

Metro is not required for standalone offline operation.

### Physical Android evidence

Samsung Galaxy A16 5G:
- Offline launch, creation, editing and search: PASS
- Full shutdown and restart durability: PASS
- Data retained after Wi-Fi reconnection: PASS

### Backup Phase A

The More screen now provides Android backup-file export and
document-picker import using user-controlled file locations.

Backups are version-1 JSON text with a 2 MB limit.
Export performs read-back verification.
Import validates the backup before presenting replacement confirmation.
Existing SQLite transactional persistence remains unchanged.

Backup files are NOT encrypted.
No automatic cloud backup or synchronization is provided.

41 automated tests passed, including 10 backup-file tests.

### Remaining gates

Physical backup-file export and restore: NOT RUN.
Encrypted backup, merge/conflict handling, and independent
integrity authentication: OPEN.
Device-replacement recovery and iOS acceptance: OPEN.

Do not uninstall CasitaDex, clear application storage, or
overwrite household records during acceptance testing.

No Production, Firebase, public repository, or cloud deployment
is authorized.

## Verified continuation — October 11, 2026
Source C:\CasitaDex-Git, prototype/bootstrap; source baseline 789bda3.
Existing E:\cdx\a build at 789bda3 passes artifact checks; APK under
android\app\build\outputs\apk\release\app-release.apk.
Helper supports short physical fixed NTFS paths, including E:. Never clone into
an existing build directory. No rebuild, cleanup or software installation needed.
C: approx 9.7 GiB free; E: approx 1.9 TiB. Node 24.19.0/npm 11.17.0 verified.
AI Commander 1.4.3 Primary connection works for scoped non-elevated commands.
Check session status first. Screen sharing remains off; no exposed port needed.
Prior account-link failure did not recur; original cause remains unknown.
Remote PowerShell scripts must stay below approximately 3001 characters;
larger payloads are rejected before execution. Split writes into bounded chunks.
ADB has no attached device. Check installed signer before install -r;
never uninstall or clear storage to resolve a mismatch.
Existing backup and safety copy on E: validate; they are not off-device backups.
See BACKUP_PHASE_A_CHECKPOINT_2026-10-11.md for exact paths, hashes and next device steps.
No service/port changes. Native restore remains OPEN.
## 2026-10-14 — Cross-project desktop location registry
Central read-only folder/file map: `C:\Users\franco\Documents\Designs-by-FA-DevOps\00_START_HERE_DESIGNS_BY_FA.md` and `PROJECT_FOLDER_MAP_2026-10-14.md`. This `C:\CasitaDex-Git` checkout remains the verified active source for CasitaDex. `C:\CasitaDex-Development`, dated Codex source outputs, short-path Android caches under C:/E:, and gateway/MCP/tunnel services on E: are **not** approved for removal or relocation without comparison, backup/restore and native QA. `E:\CasitaDex-Backups` and `E:\CasitaDex-Recovery-Safety` contain matching narrow 528-byte two-card JSON sample exports (zero media) and are not complete source/device backups. Preserve CasitaDex's Firebase-free data architecture and separate application identity. Any reorganization requires updates to this runbook, scripts, checksummed backups and actual device restore tests. No moves or cloud actions were taken in the directory audit.

## 2026-10-14 — Optional Windows Subsystem for Linux
Host Windows 11 26H2 has WSL engine 3.0.3 and WSL 2 default, but **no Linux distro installed**. This does not change CasitaDex's local-first native Windows Android build path, device storage, or Firebase-free architecture; no CasitaDex workloads were migrated to Linux. Shared Linux readiness / package security / distro backup instructions: `C:\Users\franco\Documents\Designs-by-FA-DevOps\WSL_LINUX_DEVELOPMENT_RUNBOOK_2026-10-14.md`. If a specific CasitaDex tool later needs Linux, document its native Linux path, cache, app/data isolation, backup export and QA before using it. Do not move active Git checkout or short-path Android workspace.

## 2026-10-14 — External Passport, third backup tier NOT ACCEPTED
WD My Passport external USB disk was identified on G:, exFAT, 4 TB. Important: `Get-Volume` reports Full Repair Needed/Warning and `fsutil dirty query` confirms dirty. Do NOT use this disk as a project backup, VM/WSL install target or source cleanup destination until its existing data is protected, filesystem repair separately approved and tested, and encryption/restore demonstrated. Physical disk reports Healthy but volume is not. See cross-project `C:\Users\franco\Documents\Designs-by-FA-DevOps\EXTERNAL_PASSPORT_BACKUP_READINESS_2026-10-14.md`; `Test-FAPassportReadiness.ps1` is read-only. Existing C: source and E: backups remain authoritative. No USB data writes or repair took place.

## October 14 late update — WD Passport formatted; earlier warning superseded
Owner authorized complete erase/quick-format of WD My Passport external 4 TB USB. Only its G: volume was formatted NTFS `FA-Backups`. Windows Get-Volume Healthy/OK; dirty flag NOT Dirty. `G:\Designs-by-FA\Backups` and `Restore-Tests` exist; a 1 MiB benign file survived cross-drive read-back with SHA-256 PASS. This **supersedes previous Full Repair Needed / dirty state**. Elevated BitLocker status: **unencrypted, protection OFF**. Do not copy confidential app data, credentials or sensitive repositories to Passport until removable-drive encryption and recovery-key storage are separately authorized and a full backup/restore test is completed. See `C:\Users\franco\Documents\Designs-by-FA-DevOps\PASSPORT_FORMAT_ACCEPTANCE_2026-10-14.md`. The Passport is not a WSL VHD location; existing source checkout paths unchanged.

## 2026-10-14 — BitLocker To Go password/recovery key user action pending
The external `FA-Backups` Passport is Healthy/NTFS but verified unencrypted: BitLocker Fully Decrypted 0.0%, Protection Off. Not yet approved for confidential archives or project backup automation. Owner must use local Windows BitLocker GUI to set unlock password and independently back up recovery key; never expose these through chat or remote logs. **Encrypt ENTIRE drive**, because it contained previous data before quick format. Keep auto-unlock OFF. Confirm 100% conversion/Protection On and restore ability before use. See shared `PASSPORT_BITLOCKER_SETUP_AND_VERIFICATION_2026-10-14.md`. No source, cloud or app deployment changes.

## BitLocker Passport latest status — 2026-10-14
External WD Passport `FA-Backups` owner-started BitLocker v2.0 encryption confirmed 0.1% progress (AES-128). Password and numerical-password protector types present; auto-unlock off; Protection Off while conversion in progress. Not yet a secure backup destination. Wait for full conversion, Protection On, independent key backup and a complete restore test. No secret values collected. Central procedure: `C:\Users\franco\Documents\Designs-by-FA-DevOps\PASSPORT_BITLOCKER_SETUP_AND_VERIFICATION_2026-10-14.md`.

## 2026-10-14 current WSL setup (supersedes earlier no-distro entry)
Ubuntu 24.04.5 LTS installed as WSL2 distro `Ubuntu-24.04`, actual live ext4 VHD `E:\Designs-by-FA\WSL\Ubuntu-24.04\ext4.vhdx`. Default Linux user `fa-dev` (UID 1000, sudo group), native Linux worktree root `/home/fa-dev/projects` mode 700; account password LOCKED pending local owner setup. Linux Git/Python 3.12/GCC/Make/jq/ripgrep installed; nvm v0.40.7, Linux Node v24.19.0/npm 11.17.0 installed. VS Code extension `ms-vscode-remote.remote-wsl` v0.104.3 installed, Linux VS Code Server present. Owner must set Linux password locally, visually confirm editor, and plan WSL export/off-device backup. Event Command, CasitaDex and Trend Lab source paths and cloud environments NOT migrated. Use shared `C:\Users\franco\Documents\Designs-by-FA-DevOps\WSL_UBUNTU_2404_ACCEPTANCE_2026-10-14.md`. New Linux-first projects require owner-approved exception to Windows `C:\FA\Projects` convention; never create two unmanaged authoritative copies.

## 2026-10-14 — WSL Linux password/sudo activation ACCEPTED
Ubuntu `fa-dev` standard account password set locally by owner (`passwd` success screenshot) and `sudo -v` returned successfully; independent `passwd -S fa-dev` P status, Linux toolchain retested PASS. No password or token logged. Shared current record: `C:\Users\franco\Documents\Designs-by-FA-DevOps\WSL_UBUNTU_2404_ACCEPTANCE_2026-10-14.md`. Remaining: graphical VS Code WSL owner acceptance, independent WSL export/restore validation. No code checkout moved/deployed.

## 2026-10-14 — Ubuntu WSL editor integration and local recovery export
VS Code screenshot from owner confirmed Explorer and status indicator `WSL: Ubuntu-24.04` with Linux `/home/fa-dev/projects`; editor integration accepted. VS Code workspace still showed Restricted Mode, owner decides trust only for known Linux path. A **local** Ubuntu WSL2 export at `E:\Designs-by-FA\Backups\WSL\Ubuntu-24.04\2026-10-14\Ubuntu-24.04-baseline-2026-10-14.tar` was created (2.71 GiB, export exit0, SHA-256 + Linux GNU tar structure check passed, restricted NTFS ACL). NOT ENCRYPTED; not off-device. Isolated import and restored-app toolchain checks still pending. This is a backup of the Ubuntu distro/toolchain, not Event Command/CasitaDex/Trend Lab repositories or production app data. No existing app repo was moved. Full evidence `C:\Users\franco\Documents\Designs-by-FA-DevOps\WSL_UBUNTU_2404_ACCEPTANCE_2026-10-14.md`.

## WSL Linux isolated restore acceptance — 2026-10-14
The owner-approved Ubuntu 24.04.5 LTS WSL2 backup import was independently tested as `FA-Ubuntu-RestoreTest-20261014` under `E:\Designs-by-FA\Restore-Tests\WSL\Ubuntu-24.04-2026-10-14`. Import exit 0; restored nonroot user, Git/Python/nvm/Node/npm, compilers, systemd and DNS PASS. Original authoritative `Ubuntu-24.04` independently retested PASS and remains the WSL default. Both distro registrations and virtual disks intentionally preserved; no Event Command, CasitaDex, Trend Lab source repos or cloud deployments modified. The 2.71 GiB tar backup remains UNENCRYPTED on internal E:, so independent encrypted off-device disaster recovery is still NOT ACCEPTED. Details: `C:\Users\franco\Documents\Designs-by-FA-DevOps\WSL_ISOLATED_RESTORE_ACCEPTANCE_2026-10-14.md`. Do not delete/unregister test without explicit owner authorization.
## October 18, 2026 — ENG integration audit / LT1 SB-22 partial pass
Primary ENG modules/tests are present but are NOT wired into live v1 persistence. Node-only synthetic verifiers need native ports; no claim of completed ENG runtime integration. Primary regression suite, TypeScript and lint passed this session.
LT1 installed Staging APK hash verified. Complex history/due-date full-backup restoration and offline process-restart/reboot data persistence PASS. Extra-large text reachability checks progressed; spoken TalkBack remains open. Controlled Android reboot reproduced System UI unresponsive dialog; Wait recovered the app. Stability remains OPEN.
Full source/artifact evidence and remaining gates: docs/design/SB20_ENG_INTEGRATION_AUDIT_2026-10-18.md. No app-source changes, commit, push, synchronization or deployment. Historical status entries below are provenance, not current closure.

## October 18, 2026 — Native ENG text-draft slice verified
PASS within Development-only scope: native Add now uses the tested ENG-D orchestrator with a real SQLite recoverable text draft and atomic/idempotent save. Incomplete-save guard, draft exclusion from Find, restart recovery, saved-memory persistence, consumed-draft removal and confirmed/cancelled discard passed on LT1 offline.
Reviewed eight-file contribution is integrated into primary working tree. All primary source hashes match the tested APK source manifest. Linux 209/209 PASS; primary Windows 207 PASS/2 symlink-privilege SKIP/0 FAIL; TypeScript/lint PASS.
Installed Dev APK SHA256 CC361BA6B6496BAD8E72203F19B92EBC6A44BE27361C5B780F20BE466E45F8F7, 48,151,883 bytes, debug-signed Release with embedded JS. Package com.designsbyfa.casitadex.dev coexists with preserved LT1 Staging.
Full ENG/SB-22 remain OPEN: photo drafts/camera/photo-only save, v2/category/lifecycle and Space creation, draft-inclusive portable backup, full accessibility, physical platforms and emulator reboot stability. Drafts are Development-only and must be saved as memories before current portable backup.
Evidence: docs/design/NATIVE_TEXT_DRAFT_ACCEPTANCE_2026-10-18.md. HEAD still b940ccc; pre-existing and new working-tree changes retained intentionally; no commit/push/merge/Production action.


## Native draft integration recovery — October 18, 2026
Tested source authority is C:\CasitaDex-Git, with reviewed eight-file integration in the working tree. Full source parity was checked against /home/fa-dev/projects/casitadex-eng-native-20261018/docs/qa/native-draft/final-source-sha256.txt.
Candidate build directory: /home/fa-dev/projects/casitadex-eng-native-20261018. Frozen original overlay/history recovery: sibling casitadex-eng-native-preservation-20261018. Source and QA APKs are separate from user app backups.
Rebuild within Ubuntu as fa-dev, with ANDROID_HOME=/home/fa-dev/Android/Sdk, EXPO_PUBLIC_APP_ENV=development, NODE_ENV=production, CI=1 and CMAKE_BUILD_PARALLEL_LEVEL=2; from candidate android use ./gradlew :app:assembleRelease -PreactNativeArchitectures=x86_64 --max-workers 1 --no-daemon -Dorg.gradle.parallel=false '-Dorg.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=1024m'.
Keep Android lint enabled. The first 384 MB metaspace build failed; final 1 GB metaspace/one-worker build passed. Avoid piping aapt to head under pipefail; save complete badging to a file and select from it.
One-time preparation/whitespace-repair/integration scripts in LOCALAPPDATA Designs-by-FA/docs are guarded and must not be blindly rerun. Use the existing checked source for rebuilds.
Verified QA artifact: LOCALAPPDATA Designs-by-FA/qa/native-draft-20261018/CasitaDex-Dev-native-draft-20261018.apk on both primary and LT1; SHA256 CC361BA6B6496BAD8E72203F19B92EBC6A44BE27361C5B780F20BE466E45F8F7.
Private transport: tailscale file cp <explicit APK> LT1:. LT1 auto-receives to Downloads; independently hash before copying to QA and install only on emulator-5580. This was a fresh Dev install. For any future update, verify signer compatibility first; never uninstall or clear existing app data to bypass a mismatch.
New Development SQLite tables add_draft_v1/add_attempt_v1 are additive. Draft data is private/local and not yet in portable backups; save a draft as a memory first. Staging retains LegacyAdd because the draft capability is gated to development.
Acceptance report: docs/design/NATIVE_TEXT_DRAFT_ACCEPTANCE_2026-10-18.md. No new software installation, persistent listener, public port, paid service or Production configuration.
