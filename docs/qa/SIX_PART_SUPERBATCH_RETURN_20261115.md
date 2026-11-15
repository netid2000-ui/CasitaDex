# CasitaDex six-part sweep — super-batch return
Date: November 15, 2026
Branch: work/cd-plus-backup-safety-20261114
Starting commit: a276156
Execution: FA-MAC-DEV-01 only. Accepted SB40 lineage retained.

## Six-part result
This closes the enumerated prototype discrepancy work and the source/native checks listed below. Completion is scoped to the recorded examples and exercised routes; it is not a release approval or a claim that every historical frame received manual accessibility acceptance.

| Part | Completed work | Evidence |
| --- | --- | --- |
| 1. Global navigation and lists | Connected 88 collection entries with exact return origins. Integrated 55 active cards with archive/delete/restore visibility. Bound result counts and 30 Find filter states to retained Space/Categories and active state. Completed eight dark Photos grid/compact/sort combinations. | globalWire, activeList, filterFix, filterValidation, photoStates |
| 2. Older editor variants | Updated 16 older light editors to retain independent draft/saved Space, Categories and Location values; Save reads back matching values and Cancel restores saved values. Long category strings wrap. | legacyDynamic, locationUnify, finalGraphAudit |
| 3. Picker completeness | Unassigned/Garage/Hallway/Kitchen choices, Office creation example, independent Appliances/Maintenance/Manuals/Seasonal/Warranties toggles, None, Create/Cancel and scoped Location returns. Space changes preserve Location text, matching native behavior. | legacyDynamic, spaceParityFix, integrationValidation |
| 4. Secondary actions | Consistent 44-point picker row controls and Done actions, removal of misleading Close icons, persistent Photos controls, exact draft/collection return paths, and long-value layout review. | legacyPolish, locationUnify, wrapVisual |
| 5. App–Figma parity | Matched native Space/Location retention rule; checked source suite, typecheck/lint, native Android Home/Find/Photos/Settings/Storage in both themes. Retained earlier iOS scoped Location and management acceptance without rerunning completed photo acceptance. | tests.txt, typecheck.txt, lint.txt, android-navigation.txt, SCOPED_LOCATIONS_20261115.md |
| 6. Final verification and handoff | Recorded mutation IDs, evaluated prototype actions and return paths, reviewed representative Figma and native screenshots, audited all current-page destination references and both theme directions, and committed evidence. | figma-*.json and native screenshots |

## Verification results
- Source suite: 516 tests, 510 passed, six existing skips, zero failures.
- TypeScript and ESLint passed.
- Android: ten light/dark navigation screen checks passed on isolated refreshqa; System appearance restored.
- Legacy picker/value matrix: 18,192 assertions passed after matching native Location retention.
- Create/Cancel and list integration: 4,392 assertions passed, including 1,024 creation scenarios, 88 collection entries and 55 active cards.
- Find intersections: 19,200 assertions passed across 30 states, five Space values, 32 Category combinations and active/inactive status.
- Current Figma page: 1,218 top-level nodes; 12,517 destination references; zero missing destinations. Later filter edits changed variables/conditions only, not destinations.
- Theme audit: four intentional Light selection links and six intentional Dark/device-dark selection links cross palette. No unintended visible direct cross-palette navigation found.
- Representative visual review: dark Photos added-sort panel and compact view; light category picker after icon correction; Create Space; longest category strings in Edit/Details; native light Settings and dark Photos.
- One Figma validation request timed out. A retry using cached action snapshots completed and passed. The timeout was not counted as success.

## Changes and boundaries
This super-batch changed Figma prototype wiring/layout and added a repeatable Android verification script/evidence. It did not change production application source. The source suite confirms the existing implementation; it does not validate Figma behavior.

Figma assertions evaluate saved reaction definitions and bindings; they are not 41,784 manual clicks or native tests. Create-new screens remain finite Office/Warranties examples, not arbitrary text-entry/database implementations. Historical exploration frames remain in the file. Native sample content and prototype example content intentionally differ.

Earlier iOS scoped Location acceptance (testScopedLocationFlow20261115) and Android lifecycle/create/rename/removal/restart evidence remain valid for unchanged source; see SCOPED_LOCATIONS_20261115.md and SIX_PART_SWEEP_CONTINUATION_20261115.md. This batch did not rerun completed photo acceptance.

A full physical-device VoiceOver/TalkBack and large-text acceptance pass, owner iPhone sign-off, and release authorization remain separate gates. No production release, store submission, purchase, merge, or owner-data mutation was performed.

## Review links
- Photos: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1519-80
- Legacy picker: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=706-178
- Legacy editor: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=448-2
- Integrated dark collection: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1497-200

Evidence: docs/qa/evidence/six-part-final-20261115/
