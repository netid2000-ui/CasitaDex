# Approved photo chooser implementation, 2026-11-16

## Authority and scope
Approved Figma [light chooser](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=557-47) and [dark chooser](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1000-249). No master layout changed for this implementation.

The shared chooser now uses the approved title, exact local light/dark SVG assets, bordered icon/text/inline-chevron rows and compact icon Cancel. Preserved callback mapping, native text scaling, accessible button names, Android Back, and Cancel outside scrolling content. Android maintains 48dp minimum targets; iOS 44pt. No storage or photo-provider behavior changed.

## Verification
- TypeScript and lint pass. Automated suite: 523 passed, 6 skipped, 0 failed (529 total).
- Isolated iOS and Android QA builds succeeded on Mac mini. Installed only on isolated iOS simulator and Android emulator. Installed bundles match retained build artifacts and staged component sources match this worktree.
- iOS normal: draft Cancel, repeated Cancel, saved Details and Edit Cancel passed.
- iOS dark accessibility-large: Add Photo Memory chooser Cancel passed, preserving draft title; all four controls visible and hittable. First attempt stopped before opening chooser because test scroll budget was too small; extended test-only budget passed. No app fix/rebuild was necessary.
- Android emulator: normal Cancel and Back, dark 200% Cancel passed; observed draft inputs unchanged. Native screenshots reviewed for light/dark layout, source icons, inline chevrons, wrapped text and visible Cancel.
- iOS: all 11 SQLite tables equal apart from state revision 94 to 96. All 22 media file hashes unchanged. Not a byte-identical database claim.
- Android: pre-install emulator snapshot retained. Package replacement only, no uninstall or data clear; UI-level draft preservation verified. Full private Android database equality was not verified because release package disallows run-as.
- Restored iOS content size large and appearance light; Android font scale 1.0 and night mode no.

## Boundaries
No physical device install or retest, no full Samsung suite repetition, no provider import/capture test, no store/TestFlight submission, no GitHub commit/push/publication retry. Existing unrelated Samsung passes remain prior evidence, not proof of this changed chooser. Later leading-session evidence (7222d43, 14:13 UTC) confirms the Apple provisioning blocker cleared and the f761bad baseline was installed/launched on physical iPhone. That physical build does not include this new chooser. Physical UI/notification acceptance remains pending; coordinate with leading session before any candidate replacement. Changes remain local on an isolated feature worktree; approval pending for publication. Raw screenshots, simulator data and test results remain private outside repository.

## Focused callback regression follow-up
The chooser test now transpiles the actual component with the existing TypeScript dependency and runs its handlers against minimal host/hook stubs. Eight focused tests pass, zero fail or skip. Each named source is asserted to close first and invoke selection exactly once with its expected value. Cancel and Android onRequestClose are asserted to close without selection, including after reopening. Mutation checks prove camera/library swaps, a wrong Files mapping and selection leaking through dismiss are rejected. The earlier loose label/value-presence assertion was removed.

This is bounded component-handler coverage, not native renderer, accessibility-service or provider integration coverage. No application source/assets, dependency manifests, devices, installed artifacts or prior test evidence changed. Full suite was not rerun for this test-only follow-up; the earlier 523-pass/6-skip result belongs to the prior suite version. Current focused result: 8/8. Logs retained privately on Mac.
