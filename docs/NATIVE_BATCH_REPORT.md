# Native Acceptance + Data Durability — current evidence
Date: 2026-10-07. Governing standard: ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.

Application source: 6b13117d624f28139b48d16f69a18fe2c98fe746, preceded by 705bdedb29498621e8a1c42686739a30056c539c. Foundation: a774e986e70104d7e2b6a87eed4fa49aa0ce1103. Final documentation commit is recorded in the external completion handoff. No remote push or cloud build.

## Acceptance matrix
| Gate | Result | Evidence / limit |
| --- | --- | --- |
| TypeScript / lint | PASS | no type errors / zero warnings |
| Automated tests | PASS 26 | qa/native-batch-unit-results.txt; real Node SQLite, not device proof |
| Web export | PASS | qa/native-batch-web-export.txt; entry-f2d90e5d023d8d6645cd6b4b1d249957.js |
| Browser regression | PASS 18 | qa/browser-results.json |
| Browser enlarged text | PASS 6 | qa/accessibility-results.json |
| Browser durability journeys | PASS 8 | qa/durability-browser-results.json |
| Final appearance checks | PASS 3 | qa/appearance-browser-results.json; final screenshots |
| Native dependency isolation | PASS | 210 resolved components, no com.google.firebase; qa/android-runtime-dependencies.txt |
| Expo Doctor | OPEN, exit 1 | 20/21; online schema request fails before TLS; qa/native-batch-doctor-final.txt |
| Dependency remediation | OPEN | 29 entries, four root advisories; runtime decode-uri-component release blocker |
| Android build and runtime | BLOCKED / NOT RUN | Windows native build failures; no APK; final result below |
| Physical Android / iOS | NOT RUN, OPEN | no accessible physical device or Mac/Xcode |
| TalkBack / VoiceOver spoken acceptance | NOT RUN, OPEN | browser semantics do not establish native screen-reader acceptance |
| Native upgrade migration / failure injection | OPEN | Node SQLite spike passes; device acceptance separate |
| Media / file-provider backup / OS reminders | NOT IMPLEMENTED | text-only prototype, explicit text export |
| Human retrieval comparison | OPEN | automation timings are not human usability evidence |

## Reproduction
Run npm ci, npm run typecheck, npm run lint, npm test, npm run doctor, npm run export:web. Start npm run preview locally, then npm run test:browser, node tests/accessibility-smoke.cjs, node tests/durability-browser.cjs, node tests/appearance-browser.cjs. Browser tests use isolated profiles and synthetic data. Doctor remains an explicit unsuccessful command; the combined qa:ci pipeline is not represented as wholly green.

Database tests cover file reopen, interrupted uncommitted transaction, rollback, migration retry and idempotence, invalid-primary recovery preservation, future-schema rejection, foreign keys, serialized operations, environment isolation and UTF-8 limits. Compact export regression uses 850 cards: compact 1,889,516 bytes versus pretty 2,038,315; the canonical export round-trips under the 2,000,000-byte limit.

## Native build recovery history
The initial local attempts were stopped when source/dependencies changed, including removal of unused expo-notifications after discovery of Firebase Messaging. The isolation guard's relative init-script path and resolvedArtifacts variant ambiguity were corrected; the final guard examines resolved components and rejects unresolved dependencies.
The original workspace produced long CMake object paths. An exact local clone at C:/Users/franco/Documents/Codex/work/cdx preserved source commit 6b13117. Its first build failed in react-native-screens with Ninja Filename longer than 260 characters because the Gradle cache path was still long. A copied reconstructible cache at C:/Users/franco/Documents/Codex/work/g addresses that path. No global Windows or Git security configuration was changed.
Build command and signing/environment boundaries are in RECOVERY_RUNBOOK.md. Generated Android files and test signing keys are ignored and excluded from archives. Gradle release variant here is a bundled, internally test-signed Staging APK, not Production/store authorization.

## Core loop and scope
Saving and retrieving six realistic text records, editing, deleting, history/due dates, selective disclosure and explicit backup/restore passed in the browser. “Remember automatically” currently has in-app due-date presentation only; OS notification delivery is not implemented. Media and portable file-provider backup remain future gates. No fixed seconds target or human performance claim is made.
CasitaDex evidence does not close Event Command SB-12 physical Android or final reusable-starter acceptance. Record the unused-notifications/Firebase discovery as a starter follow-up; Event Command source was not modified. SB-13 was not started.
The short-cache attempt failed after 13m38s / 125 tasks at the generated gesture-handler object filename. Raw failures are in qa/android-short-clone-failed.log and qa/android-short-cache-failed.log. Mapping the clone directly to a drive root exposed Expo package discovery at the filesystem root; mapping its parent to R: and prebuilding under R:/cdx succeeded. The resulting local build is recorded in the final result.

## Final Android outcome
BLOCKED / NOT ACCEPTED. No APK was produced or installed. The short physical clone plus short Gradle cache failed after 13m38s (125 tasks) at :app:buildCMakeRelWithDebInfo[x86_64], with a generated gesture-handler object filename longer than 260 characters. The temporary-drive prebuild succeeded after moving the project beneath the mapped root, but its build failed after 4m26s (39 tasks): React Native codegen mixed R: and C: roots for AsyncStorage. The task-owned R: mapping was removed. No emulator network, font, appearance or accessibility settings were changed; no synthetic native records were created. Native QA scripts are prepared and syntax-checked, but NOT RUN.

Evidence: qa/android-short-clone-failed.log, qa/android-short-cache-failed.log, qa/android-drive-root-prebuild-failed.log, qa/android-drive-prebuild.txt and qa/android-drive-build-failed.log. No APK hash, installation result or device functional pass exists. tests/android-native.cjs is a prepared acceptance driver, not acceptance evidence. Further build recovery should investigate a consistently short physical checkout / compatible Windows native tooling; the mixed mapped/canonical roots must be resolved before emulator testing. Do not infer authorization for cloud builds or Production.

Evidence formatting: Git's whitespace check flags trailing spaces emitted by Gradle in the captured failure logs. Those log lines are retained as evidence. The source/documentation diff passes with captured .log files excluded; this is not a functional test failure.
