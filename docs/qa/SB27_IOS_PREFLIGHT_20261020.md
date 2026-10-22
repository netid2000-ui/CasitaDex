# SB-27 iOS Development Acceptance - Initial Preflight
Date: 2026-10-20 | Status: IN PROGRESS, build not yet submitted

Primary C:\CasitaDex-Git on DESKTOP-FP0BMH2, branch acceptance/eng-review-20261019 with owner dirty work preserved. Secondary DESKTOP-MB70M1T online with EAS CLI 24.13.0 and established disposable Expo smoke iOS simulator success.

Existing eas.json development profile has developmentClient:true/internal, but no ios.simulator:true. Separate staging-ios internal profile has local credentials and is not suitable for this simulator gate. App config maps Development iOS ID to com.designsbyfa.casitadex.dev, Staging to com.designsbyfa.casitadex.staging; production rejected. Expo icons include light, dark, tinted. Asset existence verified; image rendering and iOS build not yet verified.

Next: prepare an isolated simulator-only Development profile and inspect exact EAS upload file list for protected QA backups/fixtures before any cloud submission. Do not upload .cdxe, private data, Android binaries, machine notes, credentials or unreviewed repository artifacts. Run typecheck/lint, verify Expo app config. External Appetize upload specifically requires separate owner approval per cross-platform runbook. A successful simulator build does not establish physical iPhone acceptance.

Keep accepted Android emulator-5580 and physical Samsung unchanged. No release, store submission, commit, push, merge or deployment authorized. Return execution findings to originating CasitaDex chat.

## Development iOS simulator profile and cloud privacy gate
- Validated resolved Expo SDK57 Development config: CasitaDex Dev, iOS bundle com.designsbyfa.casitadex.dev, icons configured, backendMode none, productionAuthorized false.
- Added eas.json build profile ios-simulator-dev with ios.simulator true, internal distribution and Development-only environment variables. JSON parse and git diff --check passed.
- Created .easignore based on existing .gitignore plus docs, tests, private .cdxe backups, tar/bundle/zip, local databases and keys. Existing dirty files protected. This is a preliminary exclusion configuration, not independently verified EAS upload manifest.
- Detected protected archives in docs/qa including the 243790-byte Full v4 SB26 backup. Cloud build upload must NOT proceed until actual EAS bundle contents are independently inspected and private data absent. No EAS build submitted, account credential exposure or Appetize upload.
- Separate physical iPhone signing and proprietary Appetize upload remain authorization/privacy gates.

## Owner decision: simulator-first iOS testing
- Prioritize extensive CasitaDex Development iOS simulator testing before any physical iPhone installation or acceptance.
- Simulator matrix: five-tab navigation and Home creation actions; synthetic memory create/edit/search/filter; photo picker/attachment, photo browsing, zoom and media ownership; standalone reminders; persistence across force-stop/relaunch; full v4 backup/restore on disposable data; dark/light mode; large text, labels/focus hierarchy and accessibility; offline behavior and error/recovery states.
- Run automated unit/typecheck/lint and targeted simulator regressions; record actual iOS build ID/version, simulator OS/device, screenshot and test evidence; remediate issues on simulator first.
- Physical iPhone gate comes AFTER simulator stabilization, and focuses on real camera/photo permissions, device storage/backup location, physical performance, genuine VoiceOver spoken/gesture behavior, iOS lifecycle/offline durability and user experience. Never conflate simulator PASS with physical acceptance.
- All QA uses fictional data. No physical iPhone install, cloud build, proprietary Appetize upload or public release until individual privacy/build/authorization gates satisfied. Source branch and dirty owner work preserved.
2026-10-20: Started local non-upload EAS archive inspection via official eas build:inspect --platform ios --stage archive --profile ios-simulator-dev. Remote job 83d2946957bfcfca, target C:\cdr\sb27-eas-archive-20261020. Do not submit cloud build until package contents inspected and private files verified absent.

## October 20 EAS build submission outcome
- EAS archive inspection job 83d2946957bfcfca PASS. Local archive C:\cdr\sb27-eas-archive-20261020: 133 files, 12,854,190 bytes; zero files under docs/tests and zero matches for private archives, database, env/credential patterns. Source eng-screens.tsx SHA256 matches authoritative repository.
- EAS project @netid2000-10/casitadex created with UUID 79b93f15-c8ba-40b6-b7f4-30662c225bd8. Old CLI returned error after successful creation; app.json now contains project ID. app.config.js changed to merge config.extra so Development exposes this ID.
- Simulator build attempt job 7abec29d6bd56dd8 uploaded verified 11.4MB package to EAS, computed fingerprint, then exited 1 BEFORE build allocation. Service says monthly iOS Free builds exhausted; reset November 1, 2026. No simulator binary was produced and no Appetize upload occurred.
- Expo warns ITSAppUsesNonExemptEncryption has not been set; assess actual encryption and export-compliance declaration before physical App Store testing.
- Account reports 80 percent included overall build credits used. No subscription or paid upgrade authorized. Do not automatically retry builds, upgrade plan or invoke additional build credits.
- Continue local iOS static review and reusable QA plans. Cloud simulator build blocked by account quota until reset or separately approved account policy. Android/physical devices unchanged.
Owner approved Samsung Remote Test Lab as hosted REAL Galaxy compatibility lane in physical-device QA; see docs/qa/CROSS_DEVICE_PHYSICAL_QA_PLAN.md. It does not replace physical iPhone, owned Samsung, or iOS simulator. No session/upload initiated.
