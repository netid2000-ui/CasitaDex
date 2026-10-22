## Acceptance update — 2026-10-19, candidate C
The approved implementation/design followup is built and installed as isolated Development on the Samsung A16 and Android emulator. Linux 275/275 tests; Windows 273 pass / 2 expected skips; TypeScript, lint, web export and Expo Doctor 21/21 pass. Native household, large-photo backup/recovery and preservation checks pass, including independent filesystem/SQLite reopen and photo hashes. The prior implementation/owner-work checkpoint is be4ae76f6f215b2dcf1da64d3fbac15ac18ce1f1. Current evidence supersedes older statements below about no checkpoint, no physical device or Doctor mismatches.

See [acceptance/design report](ACCEPTANCE_AND_DESIGN_REFINEMENT_2026-10-19.md) and docs/qa/acceptance-20261019. Apple runtime, spoken/human acceptance, storage policy/physical fault matrix, emulator ANR and pre-existing dependency security disposition remain release gates. No remote push, publication or production/cloud activation occurred.

# CasitaDex ENG change and test ledger
Date: 2026-10-19 UTC. Final candidate: H. Owner instruction: implement all documented ENG changes, list changes during work, and use fewer permission checkpoints.

Application changes identified by audit I01-I13 have been implemented and integrated. Full ENG release acceptance remains PARTIAL: the numerical storage policy, trusted-clock physical cleanup, remaining native fault/platform/human acceptance and publication gates are still open. Earlier synthetic PASS results do not substitute for native acceptance.

## Integrated result
- 26 application, test and package files changed in `C:\CasitaDex-Git`; the pre-existing owner work was preserved. Final source equality covers 69 source/config/package files.
- 271/271 WSL tests PASS. Primary Windows: 269 PASS / 2 expected symlink-privilege SKIPs / 0 FAIL. Compilation and ESLint pass. Web export passes.
- Android x86_64 emulator build and ARM64 review build have embedded JavaScript, Development package identity and the existing internal debug certificate. ARM64 was prepared for review; no physical-phone installation was performed.
- The only added dependency is `expo-sharing` (~57.0.22; resolved 57.0.23). The native release graph checks 215 components and contains no `com.google.firebase` artifacts.
- No commit, push, merge, deployment, production/cloud activation, purchase or recipient send was performed. HEAD remains `b940ccc5d605f35df6ac0aa31e7c2842a8694953`.

## Changes implemented
1. Answer, source and photo-answer changes require checking again and clear the current verification date. Metadata-only edits preserve confidence. Generic Edit cannot bypass Review.
2. Inline Review uses the saved source, requires a source for Verified, records real confirmations/status changes and never verifies a record merely by opening it.
3. Share starts with title and written answer (or an honest Photo memory cue). Location, notes, source, Space, Categories, verification, reminder and individual photos require explicit selection. Space and Category consent are independent. All 128 non-photo field combinations are checked. Selected photos appear in preview; only selected bytes and reviewed text enter the ZIP.
4. Reviewed restores are bound to the actual collection/draft state. Missing or stale confirmation tokens refuse replacement before cutover. Keep current, incoming and cancellation remain explicit.
5. Local calendar dates replace UTC truncation for household dates. Real creation/update/lifecycle instants and reminder history are retained; missing legacy dates/events are not fabricated.
6. Home has an adaptive original banner, unified search/GO control, two compact text-only recents and at most two due/overdue reminders in due order, with working See all routes.
7. Find has deterministic multiword/prefix ranking, exact digit-bearing identifiers, label/context search, Space plus ANY-category matching, Uncategorized, verification/reminder/attachment filters, removable chips and Clear filters preserving query.
8. Find restores query, filters, expanded filter state and scroll on return; background layout cannot replace the saved offset. Result rendering is bounded to 50 records per page.
9. Find cards put the saved answer first. Photo-only results use the actual saved thumbnail and Photo memory cue; Home remains text-only.
10. Add has durable notes/source/reminder text, optional Organize/More details sections, precise field limits, and durable partially typed reminder dates. A finished save still requires a valid date.
11. Image-file browsing joins camera and photo library. Draft photos can zoom, replace atomically and remove safely; replacement cancellation or failure preserves the original. New records retain the five-photo cap and photo-only empty-answer invariant.
12. Duplicate suggestions use normalized title plus answer, meaningful identifier evidence or matching photo hashes, include Archive/Recently Deleted, and offer viewing, Save anyway and continued editing without merging or consuming the draft.
13. Labels can be created/renamed in Add/Edit without losing input, and safely managed from More. Removal reviews affected saved/draft associations and never removes memories/photos. Confirmation is tied to the reviewed label ID, kind, name and revision; pending controls are disabled.
14. Detail offers selectable answers, a compact verification summary, inline history, reminder completion/rescheduling, edit guards for tab and Android Back navigation, and truthful Archive/Deleted behavior.
15. Bulk lifecycle actions confirm the affected count, reject stale state and update atomically while retaining photos, confidence and recovery.
16. More uses Memory management / Data protection / Preferences & help. Storage & Cleanup comes first, exposes measured usable space/protected references, largest photos, exact-match advisory and draft review, and does not claim Archive or soft deletion frees bytes.
17. Full backup retains all saved lifecycle states, labels, sources/history/reminders, optional timestamps/events and the unfinished draft/photos. Limited text backup explicitly lists excluded photo-only records and photo counts, retains written metadata/lifecycle/draft text, and is restorable. A separate readable text report is clearly not a backup.
18. Current consumer failure/ownership tests cover media journal, promotion, verification, SQLite cutover, lost acknowledgement/idempotent retry, recovery/legacy/draft owners and real native-adapter composition. Uncertain bytes remain retained.

## Automated evidence
| Test group | Added cases | Main coverage |
| --- | ---: | --- |
| `eng-completion.test.mjs` | 22 | Verification, exact review targets, stale restore, local dates, draft fields/partial dates, labels, reminders, photo replacement, per-phase faults, lost acknowledgement, bulk state and 128 sharing combinations |
| `eng-find.test.mjs` | 5 | Ranking, identifiers, filter composition, Home ordering, 0/1/500/5000 indexing and duplicate advisory |
| `eng-share.test.mjs` | 2 | Independent Python ZIP/CRC/byte checks and damaged-photo refusal |
| `eng-consumer-media.test.mjs` | 3 | All protected owner types, journal restart, actual native-adapter composition and asynchronous promotion |
| `eng-disk-roundtrip.test.mjs` | 1 | Extended metadata/draft fields through independent filesystem/SQLite restore and reopen |
| `eng-text-backup.test.mjs` | 2 | Explicit exclusions, complete written metadata, real reader path and strict malformed/future refusal |
| Total new regression cases | 35 | Earlier 236 cases retained; final total 271 |

The four explicit media fault positions are after journal persistence, after private promotion, after private verification and before state commit. A separate lost-acknowledgement test proves a retry creates exactly one saved memory. Adapter-composition failures are injected tests, not claims of real device power-loss or full-disk acceptance.

## Bounded native acceptance
| Area | Observed result and limit |
| --- | --- |
| Upgrade/draft | Existing collection and five-photo draft survived upgrade and process restart; notes/source/reminder and labels stayed intact. Physical phone restart remains untested. |
| Home/Find | Blank/populated GO, two recent ordering, due deep-link, rescheduling, answer-first results and return position passed. 0/500/5000 synthetic collections loaded while the unfinished draft remained separate. |
| Search/filters | Exact CDX-0499 returned one result in 500 and 5000 records. On 5000 records, Category A gave 2500, A OR B gave 5000, and adding My Home gave 2500. These are functional checks, not a latency percentile or cold-memory benchmark. |
| Verification/Edit | Prefilled source -> explicit Verified -> metadata edit preserved status -> answer edit set Needs checking and cleared current verified date. Tab and Android Back guarded unsaved edits. |
| Images/dedup | File browser imported the known PNG; draft zoom reached 2x; canceled replacement retained the original. Matching-photo advisory included Recently Deleted; viewing it preserved the draft and intentional save retained all five photos. Atomic successful replacement is additionally covered by consumer tests. |
| Sharing | Default optional controls were unselected. Notes and one photo were opted in; actual selected-image preview appeared and Android showed one ZIP attachment. Sheet dismissed; no recipient selected. Final independent Space/Category consent: H preview showed Categories alone did not add the Space; enabling the separate Space control added My Home. The preview was canceled.. |
| Organization | Created a label inside Edit without losing the answer, renamed it, reviewed one saved record plus the draft, and removed only the label. The reviewed-target followup displayed the exact label name and 2500 affected records and canceled safely. |
| Backups | Actual full and limited text exports were saved and read-back verified, then independently restored and reopened on disk with field equality and photo hashes. Both conflict choices and cancel/recovery retain earlier bounded evidence; current tests additionally refuse stale review. |
| Appearance | Large app text and dark appearance remained readable; normal/System preferences restored. Spoken TalkBack, physical/foldable/tablet/iOS acceptance and the full OS-font/keyboard matrix remain open. |
| Final data | Original snapshot restored: 3 saved records (active/archive/deleted) and the original five-photo unfinished draft. Native re-export (21,887,379 bytes; SHA-256 dcbb951a33838400ea471c2c1b551ffe99b5ede7bf836eaabd3ec8d165d93bb6) exactly matches golden data, draft and attempts, with all photo frames verified; only revision differs as expected. Benchmark records are not left as the working collection. |

## Actual exported-file independent proof
| File | Bytes | SHA-256 | Restored content |
| --- | ---: | --- | --- |
| Native post-QA full backup | 21,894,379 | `2d1a33a5d94dbbd2aeacffd943359a062bc5b9d4c663af1e0463dad7c1b3990f` | 4 saved records, 6 saved photos, 1 draft photo; actual new events and partial reminder text; exact disk restore/reopen PASS |
| Native limited text backup | 4,900 | `d6f495350171bc249045f37cfbf5f5877636b520a80b879b1a0e9f22b94d9924` | 3 written-answer records, no photo bytes; omissions disclosed; draft text retained; exact disk restore/reopen PASS |
| Preserved original draft snapshot | 21,887,378 | `d8bd4f2e217db8fef77c98eb1feba03de1db3bd71029e80b29e5747e2521a7d1` | 3 saved records (active/archive/deleted), 1 saved photo and 5 draft photos; exact disk restore/reopen PASS |

Independent proof directory: `/home/fa-dev/projects/casitadex-eng-independent-restore-Uq3xGk`. Evidence JSON: `actual-backup-disk-proof.json`. These restores used fresh SQLite/private filesystem directories and closed/reopened the database, not just parser success.

## Storage sample and remaining gates
A local SAF full backup of 21,894,379 bytes was sampled 150 times over approximately 91 seconds. Available bytes: initial 4,595,687,424; minimum 4,551,856,128; final 4,573,786,112. Observed maximum decrease: 43,831,296 bytes; retained decrease: 21,901,312 bytes. This one same-volume emulator observation is consistent with output plus read-back copy. It is not a calibrated warning/critical threshold, a destination-volume matrix or a physical low-space test.

| Gate | Disposition |
| --- | --- |
| I14 / native failure parity | Consumer/adaptor fault evidence improved; real native power-loss/full-disk/all-provider interruption matrix remains partial. |
| I15 / R4 / G4 numerical storage policy | OPEN. No warning/critical numbers or hysteresis policy self-approved. Actual capacity estimates/checks stay enabled. |
| I16 trusted-clock / physical cleanup | OPEN. Permanent cleanup remains unavailable. No physical source media swept; Archive/Recently Deleted reclaim no bytes. |
| I17 / G6 platforms and human acceptance | OPEN. ARM64 artifact is prepared only. No personal Samsung/Fold operations. iOS/foldable/tablet/spoken accessibility and full OS-font/keyboard matrix remain open. |
| Emulator reboot stability | Existing System UI ANR reappeared at AVD boot. It was not cleared by wiping/recreating the emulator and is not declared fixed. |
| Expo Doctor | 20/21 checks; five existing SDK patch-version mismatches. Baseline/current versions are identical: expo 57.0.27, constants 57.0.21, linking 57.0.12, router 57.0.25, splash-screen 57.0.9. No blanket CI-green claim. |
| G7 publication/cloud | No new authority inferred; no commit/push/merge/deploy/store/cloud work performed. |

## Final build provenance
Primary authority: `C:\CasitaDex-Git`. Build candidate: `/home/fa-dev/projects/casitadex-eng-native-20261018`. Final reviewed integration matches 69 source/config/package hashes. Original source/docs/assets were preserved before edits, including a verified 292-file pruned archive and Git history bundle.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| Development x86_64 H | 48,814,657 | `298a72b74ef4a4bd31b8dbf4d28e0113043789e3ad70ca00b3f62fe1af39deca` |
| Development ARM64 H (review only) | 48,336,814 | `2c94537092f87cb7be3b4046ed409da1a224ab9617cb75f22f02da5570b5bccd` |

Package `com.designsbyfa.casitadex.dev`, version 0.1.0/code 1, min Android 24/target 36. Certificate SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`. Both architectures have embedded JS; ARM64 not installed on a phone.

Evidence and APKs: `C:\Users\franco\AppData\Local\Designs-by-FA\qa\eng-completion-20261019`. Source integration and followup proofs, manifests, regression logs, build jobs, native XML and backup capacity CSV are retained there or in the matching repository QA folder. Historical build iterations remain separate from final H.

## Audit issue disposition
I01-I13: application changes implemented, with evidence above and per-feature native limits stated. I14: stronger actual-consumer proofs but remaining real native fault matrix is partial. I15-I17: existing policy/platform gates remain open. Consequently this is implementation completion for the identified application gaps, not blanket Full ENG/SB-20 release approval.

## All 37 source records
Historical design signoffs and earlier test claims remain intact. The current status, superbatch plan, recovery runbook and native/audit records point here so their old gap wording is not mistaken for the current implementation state.

| Reviewed document | Implementation/evidence mapping |
| --- | --- |
| `FULL_ENG_NATIVE_ACCEPTANCE_2026-10-19.md` | Earlier native evidence retained; this ledger records current implementation and bounded acceptance. |
| `NATIVE_TEXT_DRAFT_ACCEPTANCE_2026-10-18.md` | Earlier native evidence retained; this ledger records current implementation and bounded acceptance. |
| `NATIVE_TEXT_DRAFT_INTEGRATION_2026-10-18.md` | Earlier native evidence retained; this ledger records current implementation and bounded acceptance. |
| `SB20_ADD_OWNER_DECISIONS_2026-10-17.md` | I07-I10: recoverable draft fields, image tools, duplicate advisory and organization. |
| `SB20_ADD_SPEC_V1_0_OWNER_REVIEW_2026-10-17.md` | I07-I10: recoverable draft fields, image tools, duplicate advisory and organization. |
| `SB20_ADD_V1_0_OWNER_SIGNOFF_2026-10-17.md` | I07-I10: recoverable draft fields, image tools, duplicate advisory and organization. |
| `SB20_CROSS_TAB_CONSISTENCY_REVIEW_V0_1_2026-10-17.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_CROSS_TAB_OWNER_DECISIONS_2026-10-17.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_ENG_A_FIRST_IMPLEMENTATION_SUPERBATCH_PROPOSAL_V0_1_2026-10-17.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_ENG_INTEGRATION_AUDIT_2026-10-18.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_FINAL_DESIGN_INTEGRATION_OWNER_REVIEW_2026-10-17.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_FINAL_INTEGRATED_DESIGN_OWNER_SIGNOFF_2026-10-17.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_FIND_ANSWER_DETAIL_SPEC_V0_9_OWNER_REVIEW_2026-10-17.md` | I01/I02/I05/I06/I10/I11: search, filters, Detail, Review, explicit sharing and edit safety. |
| `SB20_FIND_ANSWER_DETAIL_V0_9_OWNER_SIGNOFF_2026-10-17.md` | I01/I02/I05/I06/I10/I11: search, filters, Detail, Review, explicit sharing and edit safety. |
| `SB20_FIND_OWNER_DECISIONS_2026-10-17.md` | I01/I02/I05/I06/I10/I11: search, filters, Detail, Review, explicit sharing and edit safety. |
| `SB20_HOME_V1_1_OWNER_SIGNOFF_2026-10-17.md` | I04/I13: Home hierarchy, two recents, due reminders, local-day handling. |
| `SB20_IMPLEMENTATION_READINESS_PLAN_V1_0_2026-10-17.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_MORE_OWNER_DECISIONS_2026-10-17.md` | I10/I12/I15/I16: three groups, storage review, labels, full and limited exports; policy gates remain. |
| `SB20_MORE_SPEC_V0_1_RESEARCH_OWNER_REVIEW_2026-10-17.md` | I10/I12/I15/I16: three groups, storage review, labels, full and limited exports; policy gates remain. |
| `SB20_MORE_V0_9_CONSOLIDATED_OWNER_REVIEW_2026-10-17.md` | I10/I12/I15/I16: three groups, storage review, labels, full and limited exports; policy gates remain. |
| `SB20_MORE_V0_9_OWNER_SIGNOFF_2026-10-17.md` | I10/I12/I15/I16: three groups, storage review, labels, full and limited exports; policy gates remain. |
| `SB20_NONDESTRUCTIVE_PREFLIGHT_2026-10-17.md` | Integrated/cross-tab requirements and owner decisions mapped to I01-I17 below. |
| `SB20_R1_MIGRATION_REVIEW_2026-10-17.md` | Canonical schema/legacy IDs, optional extensions, migration and label associations. |
| `SB20_R1_SAFE_DEFAULTS_OWNER_DECISION_2026-10-17.md` | Canonical schema/legacy IDs, optional extensions, migration and label associations. |
| `SB20_R2_MEDIA_DRAFT_BACKUP_INTEGRITY_V0_1_2026-10-17.md` | Actual consumer media/draft journals, failure boundaries, ownership and restart protection. |
| `SB20_R2_TECHNICAL_DESIGN_OWNER_SIGNOFF_2026-10-17.md` | Actual consumer media/draft journals, failure boundaries, ownership and restart protection. |
| `SB20_R3_CONTROLLED_IMPLEMENTATION_PLAN_V0_1_2026-10-17.md` | Implementation sequence and preserved-baseline gates. |
| `SB20_R3_PLANNING_OWNER_APPROVAL_2026-10-17.md` | Implementation sequence and preserved-baseline gates. |
| `SB20_R4_ADAPTIVE_STORAGE_CALIBRATION_PLAN_V0_1_2026-10-17.md` | Capacity guards and measured local backup sample; numerical pressure policy remains open. |
| `SB20_R4_STORAGE_METHODOLOGY_OWNER_SIGNOFF_2026-10-17.md` | Capacity guards and measured local backup sample; numerical pressure policy remains open. |
| `SB20_R5_BACKUP_RESTORE_ACCEPTANCE_PLAN_V0_1_2026-10-17.md` | Portable full/limited backups, explicit draft choice, stale-review rejection and independent restore. |
| `SB20_R5_BACKUP_RESTORE_OWNER_SIGNOFF_2026-10-17.md` | Portable full/limited backups, explicit draft choice, stale-review rejection and independent restore. |
| `SB20_R6_QA_ACCEPTANCE_PLAN_V0_1_2026-10-17.md` | Automated/native matrix; physical, spoken, full-disk and power-loss limits remain explicit. |
| `SB20_R6_QA_OWNER_SIGNOFF_2026-10-17.md` | Automated/native matrix; physical, spoken, full-disk and power-loss limits remain explicit. |
| `SB20_R7_RELEASE_READINESS_GATES_V0_1_2026-10-17.md` | Readiness and authority gates; no publication or physical-device authority inferred. |
| `SB20_R7_RELEASE_READINESS_OWNER_SIGNOFF_2026-10-17.md` | Readiness and authority gates; no publication or physical-device authority inferred. |
| `SB21_23_MEDIUM_PHONE_EXECUTION_2026-10-18.md` | Earlier native evidence retained; this ledger records current implementation and bounded acceptance. |

## Recovery and review notes
Keep the independently verified full backup before any uninstall/reset/phone operation. The text format deliberately excludes photos and lists omitted photo-only saved records; it is not complete recovery. New readers retain old supported versions; older builds may refuse optional schema extensions, so do not downgrade against newly written state.

Review code and evidence within the existing dirty checkout. The baseline preservation, exact source hashes, actual-export proofs and unapproved gates are separate evidence categories. None should be replaced by an earlier synthetic-only PASS label.

## 2026-10-20 SB24/SB25 execution update
SB24 Development data-protection acceptance PASS: production restore path, native interruption/restart, true isolated Android ENOSPC, exact state retention and retry/recovery evidence recorded. SB25 safeguards implemented and tested: app-available capacity API, reminder/recovery-aware estimates, fail-closed ownership accounting, original exception retention and blocked legacy Development physical cleanup. Final suite328 total/326 pass/2 expected Windows skips/0 fail; typecheck/ESLint pass. Global warning/critical numeric policy remains an explicit owner gate under signed R4; SB25 full acceptance BLOCKED. See docs/qa/SB24_ACCEPTANCE_20261020.md, SB25_ACCEPTANCE_20261020.md, SB25_STORAGE_POLICY_DECISION_20261020.md and SB24_SB25_RISK_AND_NEXT_STEPS_20261020.md. Full v4 consumer picker gate removed only after SB24 native acceptance; archive validation and explicit replacement/draft choices remain. No Samsung, Staging/Production, commits, pushes or merges. Existing owner work preserved. SB26 not started.
