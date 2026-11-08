# SB40 four-item completion report

Date: November 8, 2026 (America/Chicago)
Branch: `work/cd-sb40-authority-source-20261108`
Implementation: [21b82e5](https://github.com/netid2000-ui/CasitaDex/commit/21b82e5b263554929ae89b83233d9f5e0a131582)

| Requested item | Result | Evidence |
|---|---|---|
| Normalize searches such as 20x25x1 | COMPLETE | Query and indexed content normalize numeric x/X/×/✕ separators and spacing; regression tests cover both directions, exact numeric matching, decimals and identifier boundaries. Native iOS passed four query forms; Android found the new spaced-dimension QA record using 20x25x1. |
| Return to originating memory after reminder Save | COMPLETE | Success destination preserves the exact memory ID. Native iOS and Android returned to that memory's Details. iOS read-only SQL confirms the reminder's memory_id. Unlinked destinations and failure/Cancel behavior remain separate. |
| Space/Category acceptance | COMPLETE for tested native iOS/Android matrix | Create/assign during Add; saved associations; multiple categories; Cancel preserving assignment; rename; removal impact review/cancel; confirmed label removal keeping memory and other labels; relaunch persistence. iOS additionally verified saving Space unassignment in full edit. |
| Remaining SB40 source/Figma reconciliation | COMPLETE for route/control-state mapping | All 14 actual routes; 80 states per platform, 160 total; two inline Add references; six reusable components; 474 valid cross-state links. Owner-approved primary and inline Add screens preserved. Pixel-perfect visual approval remains a separate release gate. |

## Source changes

- `src/eng-find.ts`: normalize numeric dimension separators on both query and saved-content tokenization. Ordinary model tokens still use exact comparison where they contain digits.
- `src/reminder-save-destination.ts`: deterministic linked/unlinked success destination.
- `src/eng-screens.tsx`: apply the destination only after the reminder write and refresh succeed.
- Removed the inherited newer-source `metro.config.js`, which referenced a decoder bridge absent from recovered SB40. Bundling now uses Expo defaults, matching the recovered workspace.
- Added regression tests. No unrelated fixes were ported from the newer development branch.

TypeScript: PASS. Source tests: **422 total, 416 passed, zero failed, six skipped**.

## Native artifacts and data preservation

These are SB40-based QA updates, produced by embedding the changed JavaScript into the verified SB40 native shells. No native compilation, store signing, physical-phone replacement or release promotion is claimed. Exact shell, old/new embedded bundle and APK hashes are recorded in [build provenance](../../tests/fixtures/sb40-four-items-20261108/build-provenance.json).

The original SB40 reference simulator and the physical iPhone remain unchanged. The isolated iOS household simulator received the QA update after its app data was copied to the external SSD. Its **165 pre-existing memory records remain unchanged**; one separate fictional acceptance record was added, making 166. Read-only SQLite corroborated writes; no records were inserted through SQL.

Android ran in a separate cloned AVD. The original medium_phone AVD and original APK remain preserved. One fictional Android acceptance record was entered through the UI. All label management used labels created for that record.

The Mac internal disk initially blocked temporary-file creation. An inactive SB39 DerivedData directory was moved intact to the external SSD and its former path replaced with a symlink; no app data was removed.

Android's emulator window was launched. The iOS simulator device ran and was controlled/captured through its native device agent, but Simulator.app was absent from both known Xcode application paths, so opening its normal live window was blocked. Native screenshots and accessibility trees remain the evidence; do not claim a visible iOS Simulator window.

## Figma reconciliation

[Secondary source/control map](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=372-2)
[Completion specification](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=376-1790)
[Versioned node manifest](SB40_FIGMA_RECONCILIATION_MANIFEST_20261108.json)

The new maps are editable control-state inventories with source components and linked destinations. They do not replace the owner-approved visual masters or certify every screen's pixel parity. System sheets are documented handoffs. Representative content, dates and counts are examples.

Corrected misleading earlier assumptions: active Find renders no pagination despite retaining unused page callbacks; actual verification choices are Unknown / Needs checking / Verified; direct taxonomy and full-edit taxonomy have distinct persistence and create labels. Older authority and route specs now point to the completed fixes and checks. The wrong .dev map remains withdrawn.

The Figma audit found 160 mapped states plus two Add references, 474 valid state links, no invalid/cross-page destinations, editable text/components/vectors, and no flattened UI screenshots. Representative iOS Details and Android linked-reminder maps were visually inspected. Body type uses SF Pro for iOS and Roboto for Android; preserved brand layers retain their brand styling.

## Remaining release work outside these four items

Source inspection identified a separate lifecycle-navigation defect: archived/recently-deleted management writes an old Find cache that the active Find wrapper does not consume. It is flagged in Figma; it was not silently certified or folded into this task.

Notification delivery/tap routing, complete backup/restore, full media/gesture limits, accessibility/maximum text/landscape, strict OS-offline testing, physical devices, billing and signed store builds remain independent acceptance gates. Release status remains NO-GO.

The native session scripts include exploratory attempts and resumptions. Some attempts stopped on automation focus, clipped off-screen bounds or Android placeholder interpretation; those failures were diagnosed before retrying. The final journals record only assertions that passed. They are evidence for this run, not unattended smoke tests that may be rerun indiscriminately against user data.

## References checked for the mapping workflow

- [Figma Plugin API](https://developers.figma.com/docs/plugins/)
- [Figma components](https://developers.figma.com/docs/plugins/api/ComponentNode/)
- [Figma Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout-in-Figma)
- [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)

No paid design generation, library publication, live purchase, production write, store submission or release merge was performed.
