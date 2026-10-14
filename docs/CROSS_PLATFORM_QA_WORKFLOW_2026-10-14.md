# CasitaDex cross-platform QA workflow
Date: 2026-10-14 | QA integration only
Branch at review: prototype/bootstrap | checkpoint: 75ea64f

## Governing boundaries
Review docs/PRODUCT_CHARTER.md, docs/CURRENT_PROJECT_STATUS.md and docs/QA_GATE_CHECKLIST.md before test changes.
Preserve local-first data, backup/restore contracts and existing staging artifacts. Do not upload real user or proprietary builds to third parties without separate approval. No production deploy.

## Approved test infrastructure
Windows test host DESKTOP-MB70M1T: Android 15 emulator FA_Android35_SmokeTest; local Expo/React Native Android APK build/install/launch.
iOS: non-production EAS simulator cloud compilation; Appetize browser-based iOS preview only following explicit owner upload approval.
Only a disposable expo-smoke-app was verified on these hosts; CasitaDex itself has NOT passed this QA gate.

## Per-batch procedure
1. Review charter, status, branch/commit, dirty worktree, QA evidence and intended test data.
2. Run project tests, typecheck/lint, backup and restore regression; do not assume generic Expo commands fit the repository.
3. Build CasitaDex development APK and verify emulator boot, install, launch, search, save/edit, persistence, airplane mode and restart/recovery.
4. Verify iOS build eligibility and EAS account/project/profile before non-production cloud compilation. If not configured, mark BLOCKED rather than inventing credentials.
5. Obtain separate approval for any CasitaDex Appetize upload, then test simulator navigation, text scaling, accessible labels and errors.
6. Record logs, emulator ID, build URL, app version/commit, screenshots, PASS/FAIL/BLOCKED/NOT TESTED and outstanding gates.
7. Report results to originating CasitaDex chat; release and physical-device acceptance remain independent.

## Evidence template
Use C:\DevSetup\CROSS-PLATFORM-QA-ACCEPTANCE-TEMPLATE.md on DESKTOP-MB70M1T; copy into project evidence before running actual app tests.
Current verdict: WORKFLOW ADOPTED; REAL-APP ANDROID AND IOS QA NOT EXECUTED IN THIS CHANGE.
