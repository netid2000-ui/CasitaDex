# Designs by F&A — super-batch milestone checkpoint (2026-11-04)

Authority: Mac mini / FA-Development; Git commits and QA evidence required. Do not mark a gate complete based on a build alone.

| Batch | Owner app | Acceptance gate | State |
| --- | --- | --- | --- |
| CD-SB41 | CasitaDex | Native Add, Save, Details, Edit, Save, Return | BLOCKED — title input / Save verification |
| CD-SB42 | CasitaDex | Photo viewer, linked reminders, offline persistence | PENDING native QA |
| CD-SB43 | CasitaDex | Landscape, large text, VoiceOver/TalkBack, Figma parity | PENDING |
| EC-SB36 | Event Command | Guest edit, Save/keyboard, permissions | IN PROGRESS, incomplete acceptance |
| EC-SB37 | Event Command | Persistent Run of Show editor | PENDING |
| EC-SB38 | Event Command | 10-guest birthday and 1000-guest wedding E2E | PENDING full E2E |
| BOTH-SB44 | Both | Figma all screens, data/process maps, design reconciliation | INCOMPLETE |
| BOTH-SB45 | Both | Native purchases, restore, entitlement tests | INCOMPLETE; no live billing claims |
| BOTH-SB46 | Both | Security, signed store builds, native device acceptance | PENDING |

## Milestones
M1 core CRUD and persistence; M2 complete E2E scenarios; M3 Figma authority parity; M4 monetization; M5 accessibility/security/native parity; M6 store submission readiness. All open until evidence is recorded.

## CD-SB41 implementation checkpoint
- `src/ui.tsx` Field now publishes `accessibilityValue.text` from the controlled value to support iOS native inspection; TypeScript `npx tsc --noEmit` PASS.
- This is a source-level testability change. Rebuild/install and rerun Maestro before claiming any native input or Save result.
- Preserve simulator QA data and unfinished drafts; no reset or discard without explicit acceptance.
