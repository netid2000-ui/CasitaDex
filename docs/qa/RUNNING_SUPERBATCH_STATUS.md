# Designs by F&A — running super-batch and milestone status

Updated November 4, 2026 (America/Chicago), Work return checkpoint. Mac mini FA-MAC-DEV-01 remains sole active execution authority. Status is evidence-based; no release acceptance implied.

| Batch | Status | Owner / evidence / next gate |
| --- | --- | --- |
| CD-SB41 | In Progress; bounded iOS edit persistence Verified | Mac native QA. 0cfc4ef; Maestro job 7cc1e8c06faec23b exit 0: exact replacement title, Save, Details, restart, persisted title and original answer. Android, Cancel, other fields and owner iPhone remain open. |
| CD-SB42 | Pending | Mac native QA. Photos, linked notifications and offline media/reminder persistence not rerun; preserve existing data. |
| CD-SB43 | Pending | Mac native QA/design. Landscape, enlarged text, screen readers and Android parity remain unverified. |
| EC-SB36 | In Progress; native acceptance Blocked | Mac engineering. 7410a07 adds handled keyboard taps and drag dismissal to Guests. Typecheck PASS; guest preservation/permissions included in 28/28 Firestore tests. Restore isolated runtime and verify native keyboard-open Save/relaunch. |
| EC-SB37 | In Progress; implementation present | Mac engineering/native QA. MoreScreen.tsx and saveRunOfShow.ts already implement create/edit/delete and stable IDs. Domain and rules tests pass; native persistence, ordering, simultaneous activities and offline/reconnect acceptance open. |
| EC-SB38 | In Progress; full E2E Pending | Mac QA. 10-guest birthday and 1,000-guest wedding domain calculations PASS; native UI/Firestore/multi-role/offline/performance scenarios NOT RUN. |
| BOTH-SB44 | In Progress; incomplete | Mac design/workflow audit. Both live Figma authorities inspected; priority mappings in WORK_FLOW_RECONCILIATION_20261104.md (EC repo). CasitaDex accepted Edit fixed actions differ from tested bottom Save. Complete every-control matrix and native parity. |
| BOTH-SB45 | Blocked for operational billing | Mac engineering/commercial. EC purchaseGateway.configured=false; safety tests pass, store purchase/restore NOT configured or verified. Preserve approved lifetime CD and per-event/annual EC direction. |
| BOTH-SB46 | Pending; release NO-GO | Mac release/security. Signed release provenance, security scans, accessibility, native parity and owner iPhone signoff not established by this checkpoint. |

| Milestone | Status | Next acceptance |
| --- | --- | --- |
| M1 Core CRUD/Save/Return/persistence | In Progress | CD bounded iOS edit PASS; EC native guest save and both-platform journeys open. |
| M2 Complete end-to-end scenarios | Pending | Full native birthday/wedding and CD photos/reminders/offline flows. |
| M3 Figma authority parity | In Progress | Resolve confirmed Edit-action mismatch; finish all-screen/action mapping. |
| M4 Monetization | Blocked | Approved product configuration and native sandbox purchase/restore/lifecycle evidence. |
| M5 Accessibility/security/native parity | Pending | Current artifact scans, VoiceOver/TalkBack, large text, landscape and parity evidence. |
| M6 Store readiness | Blocked | M1–M5 gates, signed candidate provenance and owner acceptance. |

## References and coordination

- EC change: work/ec-sb36-keyboard-save-20261104, 7410a07bfcc406bc44289371998084090a4ef0c4, based on integration/mac-authority-ec35-20261104 at 2c06011.
- CD test: work/cd-sb41-edit-targeting-20261104, 0cfc4efe8789aa04a56b803dc8495ae0616a92eb, based on governance/mac-mini-authority-20261104 at 3ae1323 (same remote main at preflight).
- Canonical return report: Event Command docs/qa/DESIGNS_BY_FA_WORK_RETURN_REPORT_20261104.md. Original command-center chat must receive its separate handoff.
- External SSD writable, approximately 1.6 TiB available at preflight. Existing source and device data preserved; Windows not assigned new work.
- EC isolated Auth/Firestore/Functions and dedicated Metro listeners absent at preflight. Temporary Firestore rules run completed and shut down normally; native authenticated testing remains blocked until runtime isolation verified.
- No production writes, purchases, store submission or release promotion performed. Do not merge feature branches merely from automated checks.

## Supporting WORK-SB47–50 — November 4, 2026
These supporting workstreams preserve the original nine batches and six milestones above. No earlier native acceptance was expanded.

| Supporting workstream | Evidence-based status | Deliverables / next gate |
| --- | --- | --- |
| WORK-SB47 Figma parity | Static audit and inventories prepared; full native/visual parity OPEN | 487 source control nodes (CD310/EC177), all source references validated; live CD25 functional pages/5652 rows and EC9 pages/1803 rows. SOURCE_AUDIT/CONTROLS/INVENTORY, FIGMA_INVENTORY and crosswalk/findings. Exact-control and native state parity remain unverified where marked; implement discrepancy tasks then compare native screenshots. |
| WORK-SB48 CD native QA | Preparation VERIFIED; native NOT RUN | Eight additive Maestro files syntax PASS8/8; accepted tests unchanged. Full photos/offline/reminder/landscape/XL/assistive cards. Viewer navigation and scheduler integration blocked in starting branch. |
| WORK-SB49 EC functional E2E | Emulator/domain checks VERIFIED; native E2E NOT RUN | Dedicated demo-fa-sb49 Firestore birthday10/wedding1000 PASS2/2; existing targeted regressions PASS42/42; two new Maestro flows parse. Full native19-step scenarios, performance and role/offline cards prepared. Runtime identity/isolation, full payload/retry/reorder, dirty navigation and scale UI remain gates. |
| WORK-SB50 Monetization/release | Matrices complete; operational gates BLOCKED / release NO-GO | CD billing safety2/2 and EC3/3 PASS; both gateways unconfigured. Root-lock OSV CD6/EC19 package/advisory instances; Gitleaks CD0/EC2 client-key-pattern detections requiring triage/restrictions review. Privacy/signing/assets/accessibility/owner approval tracked separately. |

Milestone implications: M1 remains In Progress; M2 Pending native scenarios; M3 In Progress with broader structural/source evidence; M4 Blocked store/verifier configuration; M5 Pending native parity and security triage; M6 Blocked. No release promotion, live billing, production deployment, store submission, simulator reset or owner data deletion.

Canonical current return: docs/qa/DESIGNS_BY_FA_WORK_SB47_50_RETURN_REPORT.md. Hosted remote is named github; origin is a local intake bundle. Resume from pushed feature branches and recorded commits; original chat does not receive this automatically.

## WORK-SB56–59 — November 4, 2026 (America/Chicago)
These current results supersede older pending descriptions while retaining the nine original super-batches, six milestones and prior evidence.

| Workstream | Evidence-based result | Next gate |
| --- | --- | --- |
| WORK-SB56 Event Command isolation and authenticated E2E | **Bounded iOS PASS:** native Auth/Firestore/Functions proof, event create/relaunch, guest create, invalid party size0, keyboard-open guest Edit/Save/Return/relaunch with exact name/count and preserved RSVP/dietary. | Native editor/viewer/account matrix, Android, notifications and full offline remain open. |
| WORK-SB57 Event Command functional completion | **PARTIAL:** timeline full-payload/preservation/retry/ordering and dirty navigation implemented; native guest Switch event/tab guard PASS; native timeline Save/Return PASS after correction, two same-time rows verified after relaunch. Canonical undated event rules6/6 PASS. | Native full-field edit/optional end clear and both platforms; remaining module lifecycles, crash-durable draft, retry and full E2E. |
| WORK-SB58 CasitaDex completion | **PARTIAL/BLOCKED:** native Cancel/Details/relaunch PASS on original dedicated device. Viewer gestures/order and unified reminder projection static tests PASS. Native photo path blocked by driver on original and fresh simulator; no authoritative delivery adapter. | Recover CD driver independently; native viewer/picker/offline and accessibility, integrate and prove linked+standalone delivery. |
| WORK-SB59 Security/release | **BLOCKED/NO-GO:** redacted source/history scans, OSV root/functions, MASVS checklist, 10/1000 isolated Firestore rerun2/2. Billing safety CD1/1, EC3/3. | Triage findings, sandbox purchase/restore, distribution signing, privacy/assets, accessibility and native scenario gates. |

M1 advances with bounded iOS native evidence; M2 full native scenarios remain open; M3 native/Figma parity remains in progress; M4/M6 blocked; M5 security/native parity still in progress. Both apps NO-GO. No existing evidence or accepted test overwritten. Canonical return: docs/qa/DESIGNS_BY_FA_WORK_SB56_59_RETURN_REPORT.md.

## WORK-SB60–63 — November 4, 2026 (America/Chicago)

The original nine batches, six milestones and prior acceptance remain recorded above. Both apps remain release **NO-GO**.

| Workstream | Result | Evidence and next gate |
| --- | --- | --- |
| WORK-SB60 Event Command | PARTIAL | See the Event Command return report for exact native and emulator results. |
| WORK-SB61 CasitaDex | PARTIAL | Photo slot order regression passes across SQLite reopen. Disposable iOS driver failed before app steps. Recover XCTest before photo/offline acceptance and implement a Firebase-free notification bridge. |
| WORK-SB62 Platforms and accessibility | PARTIAL | Android 15/API35 disposable AVD passed boot and screenshot. CasitaDex prebuild passed, Gradle failed on a missing cached Kotlin parcelize dependency. Install and native parity/accessibility are open. |
| WORK-SB63 Release | PARTIAL | Scan findings triaged. CasitaDex decoder advisory, distribution signing, privacy, store assets and sandbox purchases/restore remain open. |

Evidence: WORK_SB61_EXECUTION.md, WORK_SB62_EXECUTION.md and WORK_SB63_EXECUTION.md. Canonical cross-project return: Event Command docs/qa/DESIGNS_BY_FA_WORK_SB60_63_RETURN_REPORT.md.

## WORK-SB64–67 — November 4, 2026 (America/Chicago)

The nine original super-batches and six milestones remain above. Both apps remain release **NO-GO**.

| Workstream | Result | CasitaDex checkpoint |
| --- | --- | --- |
| WORK-SB64 Event Command | PARTIAL | See the Event Command return for isolated native workflow and rules evidence. |
| WORK-SB65 CasitaDex | PARTIAL | Firebase-free iOS reminder source and pod integration verified. Stock iOS 27.1 Photos and XCTest are blocked. Device-level delivery, Android scheduling, photo and offline acceptance remain open. |
| WORK-SB66 Android and accessibility | PARTIAL | Android baseline APK build, install, launch and responsive smoke passed. Bottom-tab text wraps at 200% and opaque icon exports render as tinted squares. Full assistive acceptance remains open. |
| WORK-SB67 Release | PARTIAL | CasitaDex dependency, store, distribution and privacy gates remain open. |

Evidence: WORK_SB65_EXECUTION.md and WORK_SB66_EXECUTION.md. Canonical return: Event Command docs/qa/DESIGNS_BY_FA_WORK_SB64_67_RETURN_REPORT.md.

## WORK-SB68–71 — November 5, 2026 (America/Chicago)

The original nine batches, six milestones and prior acceptance remain recorded above. Both apps remain release **NO-GO**.

| Workstream | Result | Evidence and next gate |
| --- | --- | --- |
| SB68 Event Command | PARTIAL | iOS anchored guest edit, task lifecycle, full timeline edit, and keyboard-open Budget verified. Offline, collaboration and event-day acceptance remain open. |
| SB69 CasitaDex | PARTIAL | Firebase-free Android scheduling implemented, and the iOS bridge artifact built. Simulator I/O, install and XCTest block iOS product acceptance. Notification delivery and reboot remain open. |
| SB70 Accessibility | PARTIAL | Both Android candidates rebuilt with accessibility changes. Full assistive and platform acceptance remain open. |
| SB71 Release | PARTIAL | Verified tooling patches cleared six Event Command root advisory instances. Security, distribution, privacy, store, and sandbox billing gates remain open. |

Canonical return: Event Command docs/qa/DESIGNS_BY_FA_WORK_SB68_71_RETURN_REPORT.md.
