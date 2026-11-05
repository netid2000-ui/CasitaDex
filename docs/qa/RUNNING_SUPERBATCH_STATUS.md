# Designs by F&A — running super-batch and milestone status

Updated 2026-11-04. Execution authority: FA-MAC-DEV-01 (Mac mini). This is a live checkpoint ledger, not an acceptance certificate. Update on each super-batch boundary, commit and push to GitHub, and link native evidence. Never equate a build with release acceptance.

| Batch | Scope | Status | Latest evidence / next gate |
| --- | --- | --- | --- |
| CD-SB41 | CasitaDex Add, Save, Details, Edit, Return, Relaunch | PARTIAL / EDIT BLOCKED | Create/Save PASS; edit navigation and prior save/relaunch PASS; edited title Save remains on edit form; see SCREEN_FLOW_ACCEPTANCE_20261104.md and commit 7229d2f. Diagnose validation and input target, rerun |
| CD-SB42 | Photos, linked reminders, offline persistence | PENDING | Native scenarios and notifications |
| CD-SB43 | Accessibility, landscape, large text, Figma, Android parity | PENDING | Native iOS and Android evidence |
| EC-SB36 | Guest edit, keyboard-safe Save, permissions | IN PROGRESS / INCOMPLETE | Emulator tests partial; native workflow acceptance outstanding |
| EC-SB37 | Persistent Run of Show editor | PENDING | Implement, persist, native regression |
| EC-SB38 | 10-guest birthday, 1000-guest wedding E2E | PENDING FULL E2E | Isolated Firebase and native scenarios |
| BOTH-SB44 | All Figma screens, interactions, processes and data maps | INCOMPLETE | Reconcile both Figma authorities with app code |
| BOTH-SB45 | Purchase, restore, entitlement and monetization | INCOMPLETE | Fail-closed until verified native billing |
| BOTH-SB46 | Security, accessibility, signed iOS/Android store builds | PENDING | Release acceptance evidence and owner signoff |

## Milestones
| Milestone | Outcome | Status |
| --- | --- | --- |
| M1 | Core CRUD and persistence | PARTIAL |
| M2 | Complete end-to-end scenarios | OPEN |
| M3 | Figma authority parity | OPEN |
| M4 | Monetization | OPEN |
| M5 | Accessibility, security and native parity | OPEN |
| M6 | App Store and Play Store readiness | OPEN |

## Governance
- Run charter/research/role preflight; assign parallel Mac mini jobs; verify actual simulator/emulator availability and visible UI; implement; run automated and native tests; reconcile Figma; record evidence; commit and push GitHub; report next gate.
- All development/build/testing jobs remain on Mac mini; Windows is disaster recovery, not an active worker without new approval.
- GitHub: CasitaDex main; Event Command integration/mac-authority-ec35-20261104 (draft PR #2). Track commits separately from accepted native gates.
- No production deployment, paid resources, data wipes, or unsupported acceptance claims.
