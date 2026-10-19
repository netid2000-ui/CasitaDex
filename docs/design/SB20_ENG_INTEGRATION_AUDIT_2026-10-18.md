# CasitaDex integration and SB-22 verification — 2026-10-18
Status: SB-22 PARTIAL PASS; SB-20 ENG isolated tests PASS, live integration OPEN.

## Verified engineering boundary
Primary: C:\CasitaDex-Git, prototype/bootstrap, HEAD b940ccc.
Existing dirty tracked/untracked work preserved.
Current rerun: node --test --test-reporter=dot tests/*.test.mjs exit 0;
TypeScript noEmit exit 0; ESLint src --max-warnings=0 exit 0.
Prior recorded aggregate remains 198 pass, 2 skipped, 0 failed. Current dot run confirms successful suite exit, not independently summarized skip counts.
src/state.tsx uses createRepository; persistence.native.ts uses v1 SQLite.
Application entry/screens/state/persistence do not import SB-20 ENG modules.
ENG-A contract, ENG-D adapter and ENG-E runtime explicitly remain isolated.
ENG-F bridge writes synthetic tables and is not a consumer persistence replacement.
Source presence and passing synthetic tests do not establish native integration.
Seven ENG TypeScript files are excluded from the main tsconfig; whole-app noEmit does not cover them.

## Build and source identity
LT1 installed Staging APK SHA256:
6F9BCF9608D95FDA22BD895360C9C1EA5622BA4A471F706C5051AEA6B7534A77
Independently hashed installed base.apk; matches recorded LT1 artifact.
LT1 member source at b940ccc has no sb20 modules; no parity claim.
Primary isolated WSL Development APK at
/home/fa-dev/projects/casitadex-sb21-20261018/android/app/build/outputs/apk/debug/app-debug.apk
SHA256 5539427D5C9AD8453DB284F16AB8AE3E050726558010CC047B646BC919383623
Gradle metadata applicationId com.designsbyfa.casitadex.dev, version 0.1.0.
Windows and WSL ui.tsx hashes match; screens.tsx hashes differ.
Primary emulator-5554 and Metro8081 were absent during inspection.
Do not represent LT1 Staging tests as acceptance of primary Development/ENG integration.


## Integration work still required
- Replace Node filesystem/path/crypto dependencies with native ports where runtime behavior is required; ENG-F-H/I currently import node:* and cannot simply be imported into React Native.
- Define reviewed v1-to-v2 persistence/migration and rollback wiring; retain IDs, metadata, history and media.
- Connect approved draft/photo-only/lifecycle UI actions to durable native ports.
- Verify native database/file failure paths, process-kill recovery and full backup compatibility.
- Rebuild from a frozen source snapshot and record source manifest, APK identity, signer and embedded-JS/Metro provenance before native acceptance.
- The observed Windows/WSL screens.tsx difference was narrowed by diff to a newline between a closing View and Save button near line 1074; no behavioral difference established. Hash parity remains absent.

## LT1 additional acceptance
Extra-large text: backup actions reachable by scrolling and visually readable; Find results reachable; verification/maintenance/history actions reachable. Setting returned to Off. Full accessibility and spoken TalkBack acceptance remain open.
Complex recovery: SB22 spare batteries received a maintenance-history entry dated 2026-10-18 and due 2026-11-18. Exported 3405-byte full backup containing 2 cards and 1 image. Changed live state to two history entries and no due date, then restored the export through preview/confirmation.
Verified due 2026-11-18 and exactly one history entry after restore and force-stop/relaunch, airplane mode 1.
Backup SHA256 36B22D79B5E72E3E09943EA9AF6B01ACAD4140C9CA351905C5426D52EE4F9963.
LT1 QA file: SB22-complex-full-backup.cdxm. UI evidence: SB22-complex-after-restart.xml.
All three prior backup hashes remained unchanged.
Android reboot repeat is in progress; do not claim final cold-boot stability.

## Boundaries
No consumer source changes, Git commit/push, member synchronization, install, data wipe, Windows restart or deployment.
Documentation added/updated only; disposable QA changes and Android app restart/reboot were performed.
Primary remains authoritative. Continue current chat; use milestone updates with fewer interruptions.


## Controlled reboot repeat — final
Android-only adb reboot completed: boot_completed=1, airplane mode=1.
am start -W returned Status ok and COLD launch ~6937 ms, but a System UI isn't responding dialog appeared. Selected Wait; CasitaDex recovered and displayed both original answers.
Due 2026-11-18 and exactly one 2026-10-18 maintenance history entry verified after reboot; source SB22_QA_label also visible.
Reboot data persistence PASS. Reboot stability FAIL/OPEN due repeated System UI stall; do not infer app crash or final AVD cold-boot acceptance.
lastanr initially returned no ANR while the dialog was visible; this is not sufficient to dismiss the observed failure.
LT1 free RAM at later checkpoint ~3.3 GiB; AVD 2048 MB, 4 CPU cores, GPU auto. No resource/settings changes made.
Evidence: LT1 qa/SB22-complex-after-reboot.xml and SB22-reboot-repeat-ui.xml (the latter captures recovered Home, not the prior dialog).
Launcher activity is com.designsbyfa.casitadex.staging/com.designsbyfa.casitadex.dev.MainActivity; package-relative .MainActivity failed resolution. Use resolved activity or launcher intent.

Remaining: live ENG integration/native porting, multi-space creation/assignment, full TalkBack/large-text acceptance, clean-device image recovery, emulator reboot stability and platform/release gates.

