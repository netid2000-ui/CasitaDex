# Native focus and Figma navigation checkpoint — 2026-11-15

Base: 21aa3df. Feature branch: work/cd-plus-backup-safety-20261114.
Mac mini execution only. No production release, purchase, submission, physical-device test, or repeated photo acceptance.

## Implemented and verified
- Shared buttons expose their existing action to native accessibility activation, respecting disabled state.
- Opening Location, Notes, or Reference focuses that input without forcing keyboard focus.
- Done returns accessibility focus to the matching Edit control.
- Native in-place probes: iOS 6/6 expected focused labels; Android 6/6, including current values after return. Host assertions validated the last six raw records on both platforms.
- iOS used UIKit accessibilityActivate and UIAccessibility.focusedElement with VoiceOver enabled. Android used ACTION_CLICK and View.isAccessibilityFocused with TalkBack enabled. Probes centered controls in their scroll view before activation.
- XCTest testNativeEditorTree20261115 passed (57.704 seconds), result bundle on Mac: /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-InPlaceActivation-r4-20261115.xcresult. Its assertion alone does not validate the focus sequence; raw native logs and host assertions do.
- TypeScript and lint passed. 502 tests: 496 passed, 6 existing skips, zero failures.
- Previous controlled announcement evidence remains valid: repeated save/save/error playback. See ACCESSIBILITY_SUPERBATCH_20261115.md. Those were fixture messages, not end-to-end real Save/failure transactions.

## Figma discrepancy correction
Audited 130 Primary navigation bars on page 398:2. Corrected 66 bars from stale Home / Find / Photos / Settings to approved Home / Photos / Reminders / Find. Settings remains accessible from Home. All 130 structurally match after correction.
Dark Reminders (975:119) and light Settings (480:2) screenshots visually reviewed: labels/icons/order fit, dark and light palettes remain distinct. Reminders selection appears on the dark Reminders screen. Existing navigation containers were retained.
Detailed mutation IDs and structural output: evidence/native-focus-20261115/figma-navigation-fix.json.
Design: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=975-119

## Evidence and cleanup
Raw native results and exact QA-only probe source are in evidence/native-focus-20261115/.
Probe instrumentation removed from generated iOS/Android staging sources after archiving; production source contains no probe.
Android accessibility services restored to null, accessibility_enabled=0, font_scale=1.0; disposable emulator stopped. TalkBack speech-display development preference was not reset; confined to disposable AVD.
Fresh iOS QA VoiceOver preference confirmed 0, simulator shut down; previous QA simulator 81FC3CCE-ACEB-4957-BE61-C9C653A4CE56 booted.
Installed instrumented binaries remain confined to stopped disposable QA devices. Accepted owner installation was not targeted.

## Scope still open
This supersedes the native focus blocker in ACTIVATION_PROBE_20261115.md. It is native-action verification, not manual screen-reader touch-gesture acceptance.
Full app/Figma discrepancy sweep is not complete. Remaining review includes page-by-page sticky actions, destinations, settings/photo configuration representation, and light/dark/large-text variants. No blanket parity or release certification is claimed.
