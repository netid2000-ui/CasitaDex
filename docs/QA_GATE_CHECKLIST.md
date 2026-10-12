# Native Acceptance + Data Durability — current evidence

## Latest checkpoint — October 11, 2026
Active: Android text-backup Phase A verification. Existing Staging APK checks,
41/41 tests, TypeScript and lint PASS. An existing two-card backup and safety copy
validate with matching hashes. No Android device is attached to ADB.
Native restore and installed-phone certificate checks remain OPEN.
See [BACKUP_PHASE_A_CHECKPOINT_2026-10-11.md](BACKUP_PHASE_A_CHECKPOINT_2026-10-11.md).
Earlier build-blocked/only-CD-SB-01-active statements below are historical.
Full Android accessibility, iOS and media-inclusive CD-SB-05 are not closed.

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


See NATIVE_BATCH_REPORT.md for exact failed attempts. Physical Event Command SB-12 and final reusable-starter acceptance remain separate.
