# Home action-line styling — November 17, 2026

Owner direction: carry the approved Home horizontal-rule action treatment throughout CasitaDex, in light and dark themes.

## Implemented
- Shared non-primary Button now uses a transparent surface, square corners, a single bottom separator and normal-weight left-aligned labels.
- Space, Categories and Location share the divider-style selector through MemoryEditorChoice.
- Reminder Date and Time triggers use the same treatment.
- Optional memory fields and taxonomy management rows use horizontal separators.
- Existing primary actions, text entry fields, selected checkmarks, focus outlines, accessible labels, wrapping and hit-area dimensions retained.
- No persistence, picker logic, routing or bottom-navigation changes.

## Isolation
FA-MAC-DEV-01 exclusively. Feature worktree based on 3843528; verified descendant of 75398f0. Existing uncommitted photo-chooser/routing integration worktree preserved, not copied or overwritten. This branch must be integrated with that pending work before native release-candidate acceptance. Main checkout untouched.

## Verified
- TypeScript: PASS.
- ESLint: PASS.
- Existing suite: 531 tests; 525 pass, 6 skipped, 0 fail. Full output in evidence directory.
- Expo web production export: PASS; log in evidence directory.
- Figma: 20 editable REVIEW frames across 10 main flows, each light/dark. Rendered visual pass performed; corrected dark label/primary-surface colors, remaining repeat/backup buttons and duplicate Settings dividers. Fonts remain Inter and Cormorant Garamond. Photo imagery remains separate from editable UI.

## Figma review frames
File: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr

| Flow | Light | Dark |
| --- | --- | --- |
| Photos | 1632:291 | 1632:361 |
| Reminders | 1632:431 | 1632:486 |
| Find | 1632:541 | 1632:596 |
| Add Memory | 1632:651 | 1632:701 |
| Memory Details | 1632:751 | 1632:808 |
| Edit Memory | 1632:865 | 1632:929 |
| Add Photo Memory | 1632:993 | 1632:1058 |
| Edit Reminder | 1632:1123 | 1632:1180 |
| Settings | 1632:1237 | 1632:1361 |
| Backup and restore | 1632:1485 | 1632:1515 |

Original master screens preserved. REVIEW frames do not constitute a complete rewrite of all historical prototype states. The separately approved Home hero remains at 1624:291 / 1624:345; its image is not part of this source change.

## Not yet verified or installed
- Native emulator/simulator and physical Samsung/iPhone acceptance of these styling changes remain pending, including 200% text and keyboard traversal.
- A supplemental browser runtime probe was requested but has not returned a result; do not count it as passed. Web export is compilation evidence only.
- No APK/IPA built or installed in this change. Existing devices and data untouched.
- No owner acceptance of the new cross-app review screens yet; approval of Home artwork is recorded separately.

Next: integrate with the pending photo-chooser/routing candidate, add the approved Home hero, then verify light/dark, enlarged text, selectors and reminder pickers on emulator/simulator before Samsung acceptance. No merge to main or store release.
