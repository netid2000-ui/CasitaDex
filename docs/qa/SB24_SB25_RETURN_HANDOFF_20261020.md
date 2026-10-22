# CasitaDex return handoff - 2026-10-20

SB-24: PASS (Development acceptance). SB-25: BLOCKED for full acceptance, pending the signed R4 storage-policy/scope decision. SB-26 not started.

## Implementation and evidence
SB-24: exercised actual production restoreV4 with native SQLite/media. Force-stop during reminder writes, ENG writes and after commit; fresh-process logical-state/media checks and integrity_check passed. Cancellation, draft choices, stale ENG/reminder reviews, retries and repeated recovery passed. Genuine isolated Android filesystem exhaustion demonstrated ENOSPC; failed restores retained previous state and successful retry/recovery followed. Consumer Full v4 gate removed only after this evidence. Native rollback errors now retain the original failure when rollback itself also fails.
SB-25: conservative minimum of File.freeSpace and StatFs app-available space; fail-closed capacity checks including reminder bytes; recovery preflight and in-transaction checks. Deduplicated ownership accounting protects active/archive/trash/draft/recovery/legacy/journal media; unknown ownership fails closed. Development legacy cleanup rejected; permanent purge unchanged/disabled. Storage UI separates logical photo bytes from device availability.
Measured exhausted-device discrepancy: File.freeSpace 145625088 bytes versus app-available 0. Corrected guard rejected a 4000000-byte operation. Production restore rejected its 5040505-byte requirement at zero available space without partial state; restart, retry and recovery passed. Healthy 1MiB write/readback calibration includes background-allocation noise and is not universal threshold calibration.

## Verification
node --test --test-concurrency=2 tests/*.test.mjs && npm run typecheck && npm run lint
328 total; 326 passed; 2 Windows symlink privilege skips; 0 failures. CASITADEX_SB24_ARCHIVE points to docs/qa/sb24-production-native-20261020/native-qa.cdxe. Final UI text also passed typecheck/lint. git diff --check passed.
Native matrix job eaad992838d4bb0d: 21 passing records. Final storage controller e3faba34674bbf44 passed. Final integrated suite job 74996bcc611b1e13 passed. Initial full-disk report writes were inconclusive; later coordinated-pressure JSON receipts passed. No power-loss claim.
Owner emulator-5580 retained draft/photo. Storage UI: 64303 protected and referenced bytes, 0 unreadable files; Draft 1, Previous save 1, retained operation 1. Labels, scroll and 52dp Measure target checked at font scale 1.3; spoken accessibility and visual pixel review not claimed.

## Artifact and provenance
C:\cdr\a\sb24-sb25-development-x86_64-20261020.apk
45047247 bytes; SHA-256 66F9DD8DB7BBDEEEEBF5C8C644BC8FA82689D3861F38216EE9B757A19350B0BB.
com.designsbyfa.casitadex.dev 0.1.0 (1), x86_64 non-debuggable internal debug-signed Release. Installed by adb -s emulator-5580 install -r; installed APK hash matches. 105 build inputs and seven changed bundled modules match authority. QA entry absent from consumer bundle.
Build: C:\cdr\a\android; EXPO_PUBLIC_APP_ENV=development; gradlew.bat :app:assembleRelease --offline --no-daemon --max-workers 1 -PreactNativeArchitectures=x86_64 "-Dorg.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=768m". Final job 404ca495f962cca2 passed, 571 tasks.

## Scoped files and documentation
Modified: src/eng-store.ts, src/eng-runtime.native.ts, src/eng-runtime.ts, src/eng-screens.tsx, src/media-attachment.native.ts, tests/eng-v4-atomic.test.mjs, tests/sb24-native-restore-gate.test.mjs.
Created: src/storage-safety.ts, src/storage-space.native.ts, src/sqlite-write-transaction.ts, tests/storage-safety.test.mjs, tests/legacy-media-cleanup-guard.test.mjs.
Updated records: docs/CURRENT_PROJECT_STATUS.md; docs/RECOVERY_RUNBOOK.md; docs/design/ENG_COMPLETION_CHANGE_TEST_LEDGER_2026-10-19.md; docs/qa/SB24_ACCEPTANCE_20261020.md; docs/qa/SB25_ACCEPTANCE_20261020.md.
Additional reports: docs/qa/SB25_STORAGE_POLICY_DECISION_20261020.md; docs/qa/SB24_SB25_RISK_AND_NEXT_STEPS_20261020.md; this return handoff.
Evidence: docs/qa/sb24-production-native-20261020 and docs/qa/sb25-storage-20261020, including scripts/templates, native JSON/logs, UI XML, source/bundle manifests, artifact-receipt.json and working-tree-final.txt.

## Restrictions and outstanding gate
Branch acceptance/eng-review-20261019; HEAD 0814c0426c54876f523c2b45704cf7c8768d58ed. Existing modified/untracked owner work preserved; no commits, pushes, merges, wipes or deployments. Samsung untouched. Disposable CasitaDex_SB24_Disposable_20261020/emulator-5582 stopped after isolated pressure testing.
SB-25 global warning/critical thresholds, reserves and hysteresis require separate owner approval under the signed SB20 R4 calibration plan. One API37 emulator does not establish universal/device peak-allocation thresholds. Recommended decision: accept current operation-specific safeguards as the Development baseline while keeping global alerts disabled and explicitly deferring broader calibration/policy. Until that scope decision is approved or the broader gate is fulfilled, SB-25 remains BLOCKED.
No physical-device, iOS, real power-loss, external SAF target-volume exhaustion or complete spoken accessibility acceptance claimed. Permanent deletion/unknown ownership cleanup remain disabled. Next action is the owner storage-policy decision; only then schedule SB-26 with authorization. SB-27 not initiated.
