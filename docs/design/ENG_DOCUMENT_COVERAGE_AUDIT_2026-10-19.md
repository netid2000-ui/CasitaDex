## October 19 UTC - ENG application gaps implemented; acceptance gates remain

The identified Home/Find/Add/Detail/More application gaps I01-I13 are implemented and integrated (26 code/test/package files). WSL: 271 PASS; primary Windows: 269 PASS / 2 expected symlink SKIP / 0 FAIL. Compilation, lint, web export and both Development Android builds pass. The 215-component native runtime has no Firebase. All 69 frozen source/config/package hashes match primary.

Native checks cover durable photo/draft fields, Review/edit guards, independent sharing consent, explicit restores, actual full/text exports with independent filesystem/SQLite reopen, and 0/500/5000 collection flows. Final data/draft/attempts exactly match the preserved three-record/five-photo-draft snapshot.

Full ENG/SB-20 RELEASE acceptance remains PARTIAL: numerical storage policy, trusted-clock permanent cleanup, remaining real native failure/platform/human acceptance and publication gates stay open. Existing emulator System UI reboot ANR remains open. Expo Doctor reports five pre-existing SDK patch mismatches (20/21 checks). No commit/push/merge/deploy/phone/cloud activation occurred.

Current ledger: [ENG_COMPLETION_CHANGE_TEST_LEDGER_2026-10-19.md](ENG_COMPLETION_CHANGE_TEST_LEDGER_2026-10-19.md). More -> Backup & Restore contains full, limited text and previous-save recovery tools. Storage & Cleanup is first under Memory management. Earlier entries below are historical and retain their original scope.

---

# CasitaDex ENG document and change-coverage audit
Date: October 18, 2026, America/Chicago; artifact date October 19 UTC.
**Conclusion: Full ENG / SB-20 completion is NOT established. Core native persistence, media and full-backup work is integrated and has useful passing evidence, but approved behavior and integration tests are still missing. The previous blanket implementation-complete wording was too broad.**

## Review scope and evidence limits
Reviewed 37 repository design/integration records: all SB20 design, decision, signoff, R0-R7/readiness and ENG-A proposal files present, plus the native text-draft, full ENG and SB21-23 records. Also checked CURRENT_PROJECT_STATUS.md, CASITADEX_SUPER_BATCH_PLAN.md and the relevant RECOVERY_RUNBOOK.md sections. The document inventory records paths, byte sizes and SHA256 values before corrections.
Reviewed the saved Native ENG Integration, Integration and QA, SB22 Checkpoint reports and the October18 continuation handoff. Earlier October9-11 Library records were screened for literal ENG references; none identified additional ENG batch specifications. The old reports remain historical evidence, not current closure.
Inventoried all 42 *.test.mjs files, 236 named cases and import targets. Read the current consumer engine/UI/runtime, new test bodies and the older ENG test declarations/contracts. This is a requirements/coverage review, not a claim of an exhaustive security audit of every source line or every historical file anywhere.
Primary: C:\CasitaDex-Git, prototype/bootstrap, HEAD b940ccc5d605f35df6ac0aa31e7c2842a8694953. Current tested source also exists in /home/fa-dev/projects/casitadex-eng-native-20261018. No application source or installed data was changed in this audit.

## Why 236 passing tests did not mean complete coverage
| Test family | Cases | What the evidence establishes |
| --- | ---: | --- |
| Earlier baseline tests | 105 | Existing model/repository/media/format/UI contracts; not automatic coverage of replacement ENG screens |
| Isolated SB20 ENG-A..E and ENG-F-B..J | 95 | Synthetic/domain/disposable SQLite/Node filesystem protocols; many are not the native consumer implementation |
| Prior text-draft integration | 9 | Earlier text adapter/orchestrator; now chiefly legacy migration evidence |
| Current engine, stream and native boundaries | 27 | 21 engine/SQLite tests, 3 stream tests, 2 native-equivalent disk/process tests, 1 mocked Expo asynchronous-move test |
| Total | 236 | WSL 236 PASS; prior Windows 234 PASS/2 symlink-privilege SKIP, 0 FAIL |
There is no separate ENG-F-A test file in the inspected inventory; no missing batch is inferred solely from the filename sequence.
Seven older synthetic TypeScript modules remain excluded from application typecheck. The new consumer ENG modules are included. Neither the old test count nor the exclusions establish current screen behavior.
Existing native evidence remains valid for the exact flows and artifacts recorded in FULL_ENG_NATIVE_ACCEPTANCE_2026-10-19.md. A successful build, hash parity or backup round-trip does not prove verification transitions, all filters, sharing consent or signed UI conformance.

## New controlled probes: 9 observations, 7 requirements unmet
These probes ran against current engine code using disposable in-memory SQLite and isolated evaluation of exact current UI expressions. They did not touch the emulator database, invoke sharing, alter source, or add failing cases to the regression suite. Process exit 0 means the diagnostic completed; it does NOT mean these acceptance requirements passed.
Reproduction: docs/qa/eng-coverage-audit-20261019/probes.mjs and probes.json. Run through the existing WSL Node24 environment; the script records current observations, so convert the unmet cases into normal regression tests while fixing them.
| Probe | Expected | Observed | Result |
| --- | --- | --- | --- |
| edit-answer | Substantial answer edit resets Needs checking, clears current verified date, preserves history and records real event | Remains Verified; verifiedAt=2026-10-18; history count unchanged at 1 | UNMET |
| edit-source | Changed source requires reconfirmation | Remains Verified with old date and unchanged history | UNMET |
| edit-notes | Metadata-only edit preserves factual confidence | Remains Verified | MET |
| stale-restore-preview | Reject/review an intervening local change before replacement | Accepted; live memories 2 -> 1; prior 2 remain in recovery | UNMET; recoverability exists but preview is stale |
| draft-notes | Optional authored notes persist in private draft | notes field rejected as unsupported | UNMET; feature absent, not silently lost |
| find-multiword | Query filter 20x25 matches title Filter replacement size + answer 20x25 | Current contiguous-substring predicate returns false | UNMET |
| share-default-privacy | Default title/answer, optional private fields separately selected | Payload contains Private shelf, Private notes and Verified | UNMET; no actual share sent |
| local-calendar-day | At 2026-10-19T04:23:18Z in Chicago, local date=2026-10-18 | Current day helper returns 2026-10-19 | UNMET |
| legacy-seven-photo-multispace-roundtrip | Preserve legacy excess attachments, two Spaces, original IDs/metadata and all image hashes | 2 memories, 2 Spaces, 7 photos; complete data equality after independent restore | MET at engine/format layer |

## Prioritized implementation and integration gaps
| ID | Priority | Finding and source | Required correction / acceptance |
| --- | --- | --- | --- |
| I01 | High | eng-store.updateMemory copies confidence/date/history unchanged; EngDetail has no material-edit transition | Enforce source/answer verification rules in domain transaction; real transition history; test answer/source vs metadata edits, failure and restart |
| I02 | High | EngDetail Share.share automatically includes location, notes, confidence, with no separate preview/field consent | Explicit preview and title/answer default; per-field/photo opt-ins; cancellation and payload assertions; do not send a real message during QA |
| I03 | High | EngMore preview stores no expected revision; restore validates against latest state rather than previewed state | Bind preview + draft choice to revision; re-review/reconfirm if changed, including during staging; preserve rollback |
| I04 | Medium | EngHome displays Needs checking queue, up to 5 items, unsorted; shared recent card includes location; no See all/deep links | Signed Home: max2 title+answer/photo cue recents; max2 due/overdue reminders oldest first; no checking queue; proper routes and empty states |
| I05 | Medium | EngFind uses contiguous substring, no relevance ordering or label-name search; single Category only; secondary filters/chips/clear state absent | Safe token/prefix/exact-identifier ranking, stable ties; ANY multi-category plus Space/query AND; Unassigned categories, verification/reminder/attachment filters; query/return-state tests |
| I06 | Medium | MemoryLink is title-first and has no image; used for Find photo-only records | Answer-first Find cards with real photo thumbnail/cue and labels; preserve Home's separate text-only card |
| I07 | Medium | EngDraft omits notes/reminder fields; Add lacks More details and Organize expanders | Versioned draft schema, optional fields and backup preservation; migration/default tests; no lost checkpoint on expand/collapse |
| I08 | Medium | chooseEngPhoto offers camera/library only; no image-file picker; draft thumbnails cannot zoom/replace directly | Photos + Browse image files, draft zoom/removal/replacement/orientation; cancellation, permission, format/size, native tests |
| I09 | Medium | Duplicate check is title-only, excludes Deleted, offers no View existing | Evidence-based advisory candidates; View/Save anyway/Cancel; preserve draft while reviewing active/archive/deleted; no auto-merge |
| I10 | Medium | taxonomy API only creates; no rename/removal, affected-association review or in-Edit creation | Safe label management across saved/draft/recovery/backup; no memory deletion; F16/T4 tests |
| I11 | Medium | Detail lacks inline Review workflow, automatic verification events and unsaved Edit route guard | Compact summary + expandable prefilled Review; preserve focus/input; intentional statuses and source; safe Edit cancel/leave/failure |
| I12 | Medium | More is a flat backup/audit/preferences page; management/help navigation and existing text-only export are not exposed | Signed three groups, Storage first, Archive/Trash/labels destinations, Help/About/privacy and retained clearly limited text export |
| I13 | Medium | day() uses UTC; model lacks new creation/update/archive timestamps and durable reminder completion/rescheduling events | Explicit compatible event/calendar design; local date/zone/DST tests; stable recent ordering; no fabricated legacy timestamps |
| I14 | Medium | Consumer eng-store replaces much of ENG-B..F logic; old fault/ownership proofs are not equivalent coverage | Map every phase/owner/replay/partial promotion/path guard to actual native ports; capture consumer failure evidence, not old synthetic PASS by association |
| I15 | Existing gate | Numeric storage policy, measured peaks/hysteresis/destination volume matrix incomplete | R4 measurements and owner-approved numerical policy; no invented thresholds |
| I16 | Existing gate | Trusted-clock/retention cleanup incomplete; UI purge disabled and bytes retained | Keep disabled until clock/provenance/shared-reference/interrupt/reclamation proofs; no unsafe purge to satisfy checklist |
| I17 | Existing gate | Spoken accessibility, physical Android/iOS, full-disk/power-loss and emulator reboot stability incomplete | Separate native/platform evidence; preserve existing gates and known System UI ANR |
I01-I03 block broad acceptance. R6 explicitly treats false verification and unsafe replacement/privacy behavior as material defects. None is excused by the 236-test aggregate.

## Evidence keys for the matrices
COVERED means covered at the explicitly named layer, not every platform. PARTIAL means only part of the scenario is covered. GAP means missing/contradictory current behavior. GATED means a declared policy/platform gate remains. No blanket native PASS is assigned.
E01..E21 = tests/full-eng.test.mjs in source order (case names below).
S01..S03 = tests/full-eng-stream.test.mjs in source order.
N01..N02 = tests/full-eng-native-boundaries.test.mjs; N02 kills an uncommitted SQLite writer, not a device at every media/restore phase.
A01 = tests/native-media-await.test.mjs, mocked Expo move boundary.
LT = bounded native evidence from the B22A acceptance record, including earlier 08B3/3368 observations explicitly identified there.
P = the new probes above. Earlier ENG-* tests remain isolated evidence unless the consumer mapping is explicitly established.

## R1 synthetic migration matrix
| Requirement | Coverage and limit |
| --- | --- |
| F01 empty legacy/default Space | COVERED: ENG-A, E02/E12 |
| F02 ordinary record/context | COVERED: E14/E17 + P legacy roundtrip |
| F03 Verified source/date/history preservation | COVERED for migration: E01 + P roundtrip; later transitions fail I01 |
| F04 existing due date | COVERED: E01 + P + LT backup metadata; reminder event model missing I13 |
| F05 multiple Spaces/Unassigned new | COVERED engine/format: P two Spaces + E02; LT creates/selects a new Space |
| F06 existing attached image associations | COVERED: E09/E14/N01/P + LT six-frame backup |
| F07 photo-only no invented answer | COVERED: E03/E04/E16 + LT |
| F08 five new/legacy excess | COVERED engine: E04 + P seven-photo roundtrip; native legacy >5 display remains NOT RUN |
| F09 lifecycle mix/default active exclusion | PARTIAL: E08 + LT; full search/reminder matrix I04/I05 |
| F10 private draft/photos portable, excluded from Find | COVERED core: E02/E09/E10 + LT; optional draft notes I07 |
| F11 both draft conflicts | COVERED explicit Keep/Use/Cancel/recover: E10 + LT; stale preview I03 |
| F12 damaged data/media/schema | COVERED selected engine/format failures: E05/E11/E12/E18-E21; native fault matrix incomplete |
| F13 clock rollback/forward/expired deletion | GATED/PARTIAL: E08 blocks short/backward intervals; no trusted forward-clock policy; I13/I16 |
| F14 v1/CDXM2 compatibility/disclosures | COVERED reader tests E12/E14; LT current .cdxe; native legacy import matrix NOT RUN |
| F15 interrupted migration/repeatability | PARTIAL: E06/E20/E21/N02; exact native migration at every cutover phase NOT RUN |
| F16 rename/remove label membership | GAP I10; no such consumer operation or test |

## R2 media/draft matrix
| Requirement | Coverage and limit |
| --- | --- |
| R2-01 title+answer/photo invariant | COVERED E03/E04/E16 + LT |
| R2-02 background/kill/phone restart typing | PARTIAL E02/N01/N02 + LT process restart; phone/power loss not covered |
| R2-03 cancel/deny picker/camera | PARTIAL LT denial/capture + checkpoint semantics; all cancellation/revoked-URI branches not evidenced |
| R2-04 1..5, sixth, legacy excess, readable labels | PARTIAL E04/P + LT cap/zoom; file browser/orientation/native excess I08 |
| R2-05 failures at every media state | PARTIAL E05/E06/E12/A01 + isolated ENG-B..F; actual per-phase native parity I14 |
| R2-06 uncertain commit retry exactly once | COVERED core E03/E06 + earlier protocols; native lost-ack injection NOT RUN |
| R2-07 archive/trash/restore/expiry/time shift | PARTIAL E08 + LT; safe physical cleanup gated I16 |
| R2-08 all lifecycle + draft/photos independent backup | COVERED supported current fields E09 + LT actual exported-file fresh SQLite/disk restore; unsupported intended fields I07/I13 |
| R2-09 explicit draft conflicts/repeat/cancel | COVERED E10 + LT; stale-preview case GAP I03 |
| R2-10 legacy/unsupported/corrupt readers | COVERED selected E11/E12/E14/E21/S02; native failure matrix incomplete |
| R2-11 offline Android/accessibility/physical | PARTIAL LT; I08/I17 |
| R2-12 destination/restore interruption/capacity | PARTIAL S02/E05/E15 + actual native failed SAF export preservation; all-stage/native full-disk I14/I15/I17 |

## R4 storage matrix
| Requirement | Coverage and limit |
| --- | --- |
| S01 healthy/quiet + storage view | PARTIAL LT truthful measurement; no calibrated state model, I12/I15 |
| S02 five large photos under pressure | PARTIAL E05 injected denial + LT large draft on healthy disk; actual low-space device NOT RUN |
| S03 export/destination failures preserve source | COVERED selected S02 + real SAF failure/retry; low-space destination/provider matrix NOT RUN |
| S04 restore peak + rollback/interruption | PARTIAL E15 + operation estimates; measured peaks/native interruption incomplete |
| S05 changing/unknown capacity | PARTIAL native guards inspected; full runtime injection/recheck matrix missing |
| S06 hysteresis/alert storm prevention | GATED numeric policy and tests absent |
| S07 safe deletion/no false reclamation | COVERED conservative no-delete behavior/zero Archive claims; actual cleanup GATED |
| S08 accessible pressure state messaging | NOT RUN full pressure/TalkBack matrix; limited fonts/dark reachability only |

## R5 backup matrix
| Requirement | Coverage and limit |
| --- | --- |
| B01 active/archive/deleted + metadata roundtrip | COVERED currently supported fields E09 + LT actual backup; timestamps/events/notes-in-draft missing I07/I13 |
| B02 exact unfinished draft/photos | COVERED E09/N01 + LT independent hashes; schema omissions remain I07 |
| B03 Keep/Use/Cancel + prior draft | COVERED E10 + LT |
| B04 empty answer + photo display/hash | COVERED storage/hash E03/E09/LT; Find thumbnail GAP I06 |
| B05 legacy text/CDXM2 omissions | COVERED E12/E14 reader layer; native matrix/text export reachability I12 |
| B06 malformed/future safe refusal | COVERED selected E11/E21/S02; stale replacement GAP I03 |
| B07 low-space/capacity change/destination failure | PARTIAL E05/S02/LT real SAF failure; measured native disk/provider cases open |
| B08 power loss stage/cutover/rollback | PARTIAL E15/N02/old synthetic faults; actual full sequence native NOT RUN |
| B09 deleted/archived query/reminder/clock | PARTIAL E08/LT active exclusion; I04/I05/I13/I16 |
| B10 traversal/duplicates/parents/MIME/hash | COVERED validators and selected ENG/format tests; every consumer ownership/path scenario I14 |
| B11 independent isolated restore | COVERED actual 21,818,091-byte .cdxe -> fresh SQLite/private files -> reopen and full-field equality; plus P legacy seven-photo roundtrip |
| B12 offline/reboot/TalkBack/font/foldable | PARTIAL LT process/font/dark/landscape; physical/iOS/foldable/spoken and reboot stability I17 |

## R6 Q01-Q14
| Requirement | Coverage and limit |
| --- | --- |
| Q01 Home GO, due, photo cue | PARTIAL GO/photo cue covered; Home queue/reminder contract GAP I04 |
| Q02 relevance/identifiers/filters/return | GAP I05; current search is a simpler implementation |
| Q03 Detail verification/share/media | PARTIAL photo viewer covered; I01/I02/I11 |
| Q04 Add/media/duplicates/draft | PARTIAL core durable five-photo draft covered; I07/I08/I09 |
| Q05 legacy IDs/context/source/media | COVERED selected E01/E14/E17/P + native original migration; broad native matrix open |
| Q06 lifecycle/clock/reminder suppression | PARTIAL core lifecycle; I04/I13/I16 |
| Q07 adaptive capacity/unsafe interruption | PARTIAL estimates/measurements; I15 |
| Q08 full backup/legacy/rollback | PARTIAL strong current-format core; I03/I07/I13/I14 |
| Q09 TalkBack/semantics/touch/contrast/fonts | PARTIAL prior palette/roles and LT reachability; spoken/complete scaling NOT RUN |
| Q10 phone/landscape/foldable/keyboard/zoom | PARTIAL LT phone/landscape/zoom; full keyboard/foldable/tablet NOT RUN |
| Q11 airplane/restart/locale/timezone | PARTIAL LT offline/process restart; calendar defect P local-day; locale/DST matrix NOT RUN |
| Q12 0/1/500/5000 performance | PARTIAL S03 validates 5000-record metadata conversion; no measured native 500/5000 search/render/memory benchmark |
| Q13 corrupt/unsupported/permissions/traversal | PARTIAL unit + real camera denial/SAF failure; full native corruption/failure matrix open |
| Q14 no implicit sharing/false verification | GAP I01/I02; no unapproved backend introduced is separate positive evidence |

## R3 phase and R7 gate disposition
| Phase/gate | Current disposition |
| --- | --- |
| P0 / G0 preserve/isolate | Source recovery, owner-work preservation and authority recorded; same-host source backup is not off-device app recovery |
| P1 / G1 schema/migration | PARTIAL core v1 -> DataV2 implemented; draft notes/events/timestamps and F16 incomplete |
| P2 / G2 draft/media/journal | PARTIAL core supported; consumer fault/reconciliation parity incomplete |
| P3 / G3 full backup | PARTIAL strong roundtrip evidence; stale preview and missing intended fields prevent full closure |
| P4 Find/Detail | INCOMPLETE I01/I02/I05/I06/I10/I11/I13 |
| P5 Add | INCOMPLETE I07/I08/I09/I10 |
| P6 Home/More | INCOMPLETE I04/I12/I15 |
| P7 / G5 emulator/native acceptance | PARTIAL; known functional gaps plus remaining acceptance matrix |
| G4 numerical storage approval | OPEN; no arbitrary policy enabled |
| G6 personal physical Android | NOT RUN / separate authority and data safeguards required |
| G7 Git publication/deployment/cloud/store | No new authority inferred or action taken |

## Cross-tab T1-T8 and More M1-M7
| Requirement | Disposition |
| --- | --- |
| T1 Home/Find/search/filter/return | PARTIAL GO; I04/I05 |
| T2 Add invariant/photos/import/draft | PARTIAL core PASS; I07/I08 |
| T3 photo-only Home/Find/Detail/share | PARTIAL stored answer/cue/zoom; I02/I06 |
| T4 labels create/rename/remove/restore | PARTIAL create/backup; I10 |
| T5 verification/reminders/archive | GAP I01/I04/I05/I13 |
| T6 lifecycle/clock/purge/interrupt | PARTIAL I16/I17 |
| T7 full backups/conflicts/legacy/rollback | PARTIAL I03/I07/I13/I14 |
| T8 pressure/accessibility/offline/foldables | PARTIAL I15/I17 |
| M1 More grouping and retained features | GAP I12 |
| M2 honest device/app storage, unsafe writes | PARTIAL current measurement/guards; I15 |
| M3 archive/trash/reference/clock | PARTIAL I16 |
| M4 full vs text backup completeness | PARTIAL supported .cdxe strong; I07/I12/I13 |
| M5 explicit draft conflict | COVERED standard choices; stale-state exception I03 |
| M6 low space/corruption/stale/interruption | PARTIAL; I03/I14/I15 |
| M7 offline/reboot/spoken/scaling/layout | PARTIAL I17 |

## ENG-A deliverables and consumer mapping
D1 compatibility is implemented for supported legacy fields; new event/timestamp/notes-draft/label management still incomplete. D2 saved invariant/defaults covered, but new timestamps and selected optional fields are not complete. D3 versioned readers and independent fixtures covered at stated layer. D4 read-only legacy preview exists as a synthetic helper; native migration itself is not a reviewed user-facing preview flow. D5 old contracts and new core fixtures exist; the behavioral omissions above show fixture matrix incomplete. D6 evidence and rollback docs exist, with the status correction and this traceability matrix closing the documentation gap, not the missing features.
The integration uses eng-store rather than importing every older synthetic coordinator. Reuse/replacement is acceptable only when invariant and failure-case parity is demonstrated. Do not mark ENG-F native parity complete merely because Node-only test modules still pass.

## Reviewed change files
| Contribution | Purpose and evidence |
| --- | --- |
| src/eng-types.ts | Current snapshot/draft ports; audit identified missing draft notes/events |
| src/eng-store.ts | Core migration/atomic state/media/journal/lifecycle/restore; E01-E21/N01-N02/P; I01/I03/I10/I13/I14 |
| src/eng-backup.ts | Buffer-format/legacy adapters; E09/E11/E12/E14/P |
| src/eng-stream.ts | Bounded stream framing/hash/legacy reader; S01-S03/LT |
| src/eng-runtime.ts | Web-disabled stub; platform selection reviewed, no new web acceptance inferred |
| src/eng-runtime.native.ts | SQLite/File/SAF/photo/capacity ports; LT/A01; file-browser/failure gaps remain |
| src/eng-screens.tsx | New native Home/Find/Add/Detail/More; most product gaps originate here |
| src/screens.tsx | Development wrappers retain legacy other environments; typecheck/native build, not complete functional proof |
| src/ui.tsx | Independent Page and keyboard submit support; LT GO/reachability |
| src/state.tsx | Development v1 shell avoids concurrent legacy load; core initial migration/legacy preservation |
| src/sb20-contract.ts | Shared canonical validator and Hermes-safe clone/legacy-ID compatibility; header still says synthetic-only and is stale |
| src/media-store.native.ts | Await asynchronous promote/move; A01/LT |
| package.json / package-lock.json / app.config.js | Compatible image-picker dependency/plugin/permission settings; build/graph evidence; no forced SDK upgrade |
| Four full-eng/native-media test files | 27 current-path tests; see exact named-case ledger |
| src/media-backup-v2.ts / src/media-portable-container.ts | Reviewed whitespace/line-ending parity changes, not functional features |

## Remediation order and required evidence
1. I01-I03 plus local-calendar defect: fix domain verification/history, consent-based sharing, revision-bound restore and local-day semantics; add tests that currently fail under these probes, then native rechecks.
2. Complete signed Home/Find/Detail behavior (I04-I06/I11), including relevance/identifier/filter/return tests and real photo cards.
3. Complete Add/organization (I07-I10), with versioned notes/reminder draft backup, image-file selection and safe label/duplicate review.
4. Complete More retained features and management hierarchy (I12), then actual consumer ENG-F failure/ownership mapping (I14).
5. Measured storage/retention and full platform matrix remain explicit gates. Keep safe conservative behavior until approved/tested.
Rebuild/reinstall is needed after application fixes, with new source hashes/APK evidence. The existing B22A artifact remains the artifact tested in the earlier record; this audit does not relabel it as fully accepted.
No broad regression rerun was needed for this documentation-only review: application source was unchanged. The new probes are additional evidence, not replacements for the prior suite.

## Documentation disposition
CURRENT_PROJECT_STATUS.md, CASITADEX_SUPER_BATCH_PLAN.md, RECOVERY_RUNBOOK.md and FULL_ENG_NATIVE_ACCEPTANCE_2026-10-19.md are corrected to point to this audit and state INCOMPLETE coverage. Historical signoffs and reports remain historical; design signoff is not a runtime PASS. Machine notes receive a superseding checkpoint.
No Git commit/push/merge, deployment, personal-phone install, paid/cloud work, AVD reset or app-data clearing occurred.


## Exact current-path test ledger

tests/full-eng.test.mjs

| Key | Existing case |
| --- | --- |
| E01 | legacy migration retains full authored metadata and does not mutate migration input |
| E02 | new draft uses Unassigned, no category, and resumes across a real database reopen |
| E03 | photo-only commit preserves truly empty answer, hash, ID, Unknown and duplicate-safe attempt |
| E04 | title alone fails; sixth photo fails without dropping five durable photos |
| E05 | low storage, invalid MIME, failed private copy preserve the last confirmed draft |
| E06 | injected SQLite commit failure rolls back memory, attempt, draft and recovery atomically |
| E07 | stale checkpoints and forged durable-photo metadata cannot replace draft |
| E08 | archive, recently deleted, restore and 30-day expiry retain private bytes and recovery owners |
| E09 | full backup restores saved and draft photos independently with IDs and bytes intact |
| E10 | draft conflict keep, incoming, cancel and previous full recovery preserve both choices |
| E11 | truncation, corrupt hash, future version and trailing bytes fail before target mutation |
| E12 | legacy text backup remains readable and disclosed; missing/corrupt live bytes block save and backup |
| E13 | stale edited memory cannot overwrite a newer revision; source/date evidence is validated |
| E14 | legacy CDXM2 image container imports authored card and exact image hash, without draft fabrication |
| E15 | failed restore cutover retains old state and previous full recovery, then retry succeeds |
| E16 | saved photo additions are journaled; photo-only last image cannot be removed |
| E17 | all supported legacy record and Space identifiers survive migration without renaming |
| E18 | explicit full recovery repairs corrupt primary JSON without destroying damaged bytes or known-good recovery |
| E19 | known portable state can replace corrupt primary only through explicit incoming-draft choice |
| E20 | missing primary after restart cannot silently remigrate v1; explicit recovery restores known full state |
| E21 | declared future primary and future initialization markers cannot be downgraded by recovery |

tests/full-eng-stream.test.mjs

| Key | Existing case |
| --- | --- |
| S01 | native streaming exports and preflights a valid >20 MB photo draft without full-buffer reads |
| S02 | stream write interruption and corrupt/truncated readback never mutate source draft |
| S03 | valid near-limit legacy text metadata converts without losing supported authored fields |

tests/full-eng-native-boundaries.test.mjs

| Key | Existing case |
| --- | --- |
| N01 | native-equivalent private bytes and draft ownership survive closing every database handle |
| N02 | OS-killed writer cannot leave an acknowledged mixed draft/memory snapshot |

tests/native-media-await.test.mjs

| Key | Existing case |
| --- | --- |
| A01 | native media promotion waits for Expo asynchronous move before acknowledging private ownership |

## Isolated ENG case inventory

| Test file | Named cases |
| --- | ---: |
| tests/sb20-eng-a.test.mjs | 9 |
| tests/sb20-eng-b.test.mjs | 10 |
| tests/sb20-eng-c.test.mjs | 8 |
| tests/sb20-eng-d.test.mjs | 4 |
| tests/sb20-eng-e.test.mjs | 7 |
| tests/sb20-eng-f-b.test.mjs | 6 |
| tests/sb20-eng-f-c.test.mjs | 6 |
| tests/sb20-eng-f-d.test.mjs | 6 |
| tests/sb20-eng-f-e.test.mjs | 5 |
| tests/sb20-eng-f-f.test.mjs | 8 |
| tests/sb20-eng-f-g.test.mjs | 7 |
| tests/sb20-eng-f-h.test.mjs | 8 |
| tests/sb20-eng-f-i.test.mjs | 9 |
| tests/sb20-eng-f-j.test.mjs | 2 |

## Repository document inventory
Names below are relative to C:\CasitaDex-Git. Pre-correction hashes and sizes are in docs/qa/eng-coverage-audit-20261019/inventory.json. All governing source records were read; historical drafts are interpreted using their later owner decisions/signoffs.

1. docs/design/FULL_ENG_NATIVE_ACCEPTANCE_2026-10-19.md
2. docs/design/NATIVE_TEXT_DRAFT_ACCEPTANCE_2026-10-18.md
3. docs/design/NATIVE_TEXT_DRAFT_INTEGRATION_2026-10-18.md
4. docs/design/SB20_ADD_OWNER_DECISIONS_2026-10-17.md
5. docs/design/SB20_ADD_SPEC_V1_0_OWNER_REVIEW_2026-10-17.md
6. docs/design/SB20_ADD_V1_0_OWNER_SIGNOFF_2026-10-17.md
7. docs/design/SB20_CROSS_TAB_CONSISTENCY_REVIEW_V0_1_2026-10-17.md
8. docs/design/SB20_CROSS_TAB_OWNER_DECISIONS_2026-10-17.md
9. docs/design/SB20_ENG_A_FIRST_IMPLEMENTATION_SUPERBATCH_PROPOSAL_V0_1_2026-10-17.md
10. docs/design/SB20_ENG_INTEGRATION_AUDIT_2026-10-18.md
11. docs/design/SB20_FINAL_DESIGN_INTEGRATION_OWNER_REVIEW_2026-10-17.md
12. docs/design/SB20_FINAL_INTEGRATED_DESIGN_OWNER_SIGNOFF_2026-10-17.md
13. docs/design/SB20_FIND_ANSWER_DETAIL_SPEC_V0_9_OWNER_REVIEW_2026-10-17.md
14. docs/design/SB20_FIND_ANSWER_DETAIL_V0_9_OWNER_SIGNOFF_2026-10-17.md
15. docs/design/SB20_FIND_OWNER_DECISIONS_2026-10-17.md
16. docs/design/SB20_HOME_V1_1_OWNER_SIGNOFF_2026-10-17.md
17. docs/design/SB20_IMPLEMENTATION_READINESS_PLAN_V1_0_2026-10-17.md
18. docs/design/SB20_MORE_OWNER_DECISIONS_2026-10-17.md
19. docs/design/SB20_MORE_SPEC_V0_1_RESEARCH_OWNER_REVIEW_2026-10-17.md
20. docs/design/SB20_MORE_V0_9_CONSOLIDATED_OWNER_REVIEW_2026-10-17.md
21. docs/design/SB20_MORE_V0_9_OWNER_SIGNOFF_2026-10-17.md
22. docs/design/SB20_NONDESTRUCTIVE_PREFLIGHT_2026-10-17.md
23. docs/design/SB20_R1_MIGRATION_REVIEW_2026-10-17.md
24. docs/design/SB20_R1_SAFE_DEFAULTS_OWNER_DECISION_2026-10-17.md
25. docs/design/SB20_R2_MEDIA_DRAFT_BACKUP_INTEGRITY_V0_1_2026-10-17.md
26. docs/design/SB20_R2_TECHNICAL_DESIGN_OWNER_SIGNOFF_2026-10-17.md
27. docs/design/SB20_R3_CONTROLLED_IMPLEMENTATION_PLAN_V0_1_2026-10-17.md
28. docs/design/SB20_R3_PLANNING_OWNER_APPROVAL_2026-10-17.md
29. docs/design/SB20_R4_ADAPTIVE_STORAGE_CALIBRATION_PLAN_V0_1_2026-10-17.md
30. docs/design/SB20_R4_STORAGE_METHODOLOGY_OWNER_SIGNOFF_2026-10-17.md
31. docs/design/SB20_R5_BACKUP_RESTORE_ACCEPTANCE_PLAN_V0_1_2026-10-17.md
32. docs/design/SB20_R5_BACKUP_RESTORE_OWNER_SIGNOFF_2026-10-17.md
33. docs/design/SB20_R6_QA_ACCEPTANCE_PLAN_V0_1_2026-10-17.md
34. docs/design/SB20_R6_QA_OWNER_SIGNOFF_2026-10-17.md
35. docs/design/SB20_R7_RELEASE_READINESS_GATES_V0_1_2026-10-17.md
36. docs/design/SB20_R7_RELEASE_READINESS_OWNER_SIGNOFF_2026-10-17.md
37. docs/design/SB21_23_MEDIUM_PHONE_EXECUTION_2026-10-18.md

## Saved records reviewed

- CasitaDex/CasitaDex-Native-ENG-Integration-20261018.md (libfile_0fc8d69eb9808191b9b03fde6da209f5)
- CasitaDex/CasitaDex-Integration-and-QA-20261018.md (libfile_a5646ef505488191a0ef4449cb4f1064)
- CasitaDex-SB22-Checkpoint-20261018.md (libfile_44e83f91aa748191bc82e63106b098fb)
- Pasted text(20261019-005015).txt, October18 development continuation handoff (libfile_a8c641ab9f888191b479d546a79fe96a)
