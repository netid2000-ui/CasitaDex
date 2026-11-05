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
