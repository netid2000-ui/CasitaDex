# Reminder controls and native picker fixes — November 16, 2026

## Scope and baseline

- Execution: FA-MAC-DEV-01 only; isolated worktree `search-location-corrections-20261115`.
- Baseline: `bf93495f1a10e95a420857b4909f06145632b496`, the completed reminder audit, following accepted Samsung/source corrections.
- Feature branch: `work/cd-reminder-controls-fix-20261116`.
- Approved navigation remains Home → Photos → Reminders → Find.

## Implemented

- Reminder list actions now use the same shared editorial Button as Add Memory: typography, padding, radius, accessible labels, pressed state, and platform touch target.
- Expanded Edit action is `Edit ›`; repeat controls and iOS picker Done use shared editorial styling.
- iOS date picker uses native wheels for narrow layouts, enlarged Dynamic Type, or the app's large-text setting. The normal-size calendar remains available. This resolves the measured 438.7-point calendar overflow on a 402-point screen.
- Android native appearance follows the saved app Light/Dark/System preference. A reproducible Expo config plugin gives native date/time dialogs the editorial surface, text, and accent palette; native clock/header neutral treatments remain platform-controlled. Cancel/OK use the app text color.
- No storage schema, reminder scheduling, saved-memory data, or production identity changes.

## Automated verification

- TypeScript PASS; ESLint PASS.
- 527 tests: **521 passed, 6 skipped, 0 failed**. Includes two focused adaptive-picker regression tests.
- Android release build PASS; iOS simulator build PASS.
- Initial TypeScript run caught the installed React Native API requiring `unspecified`, rather than null, for System appearance. Corrected before final checks/builds.

## Native verification

| Device | Normal/light | Enlarged/dark | Outcome |
|---|---|---|---|
| Android emulator `emulator-5554` | Date and time dialogs | 200% date and time dialogs | 4/4 open, actions visible, Cancel retains original value |
| Samsung `R5GL83X0K3N` | Date and time dialogs | 200% date and time dialogs | 4/4 open, actions visible, Cancel retains original value |
| iOS simulator, iPhone 18 Pro / iOS 27 | Calendar and time | Accessibility-large date wheels and time | 2/2 XCTest cases pass; picker horizontal bounds and Done within screen |

Screenshots and logs are retained in `evidence/reminder-controls-fix-20261116` and `evidence/keyboard-field-sweep-20261115/{serial}/reminder-fix`.

The first emulator expanded-action check failed because its reminder list contains zero reminders; no More action exists. This is a fixture limitation, not a passing action test. The harness now records that case as skipped and preserves existing data. The first Samsung action run also exposed a harness label mismatch: the shared accessible button correctly announces `Complete`, without the decorative checkmark. Corrected the test locator; both initial failures remain in the evidence. Samsung rerun: **2/2 passed** (normal/light and 200%/dark), including Complete/Edit/Delete/Less control bounds, Edit opening, and Cancel returning. Existing counts remained 0 upcoming / 4 overdue / 0 completed / 13 memory dates. No Save, Complete, Delete or reschedule action was invoked. Emulator rerun: two explicitly skipped expanded-action cases because there are no reminders. Samsung font scale restored to 1.0 and app appearance to System; iOS restored to standard large content size and light appearance.

## Installed identity

- Android package: `com.designsbyfa.casitadex.refreshqa`, version 0.1.0/code 1.
- Built APK and installed APK on **both** emulator and Samsung independently hash to:
  `579bbc47c05127d66030a65aadc716a7e25fc9b1f5d2fbacad2c4745ca777beb`.
- Installed by `adb install -r`, without uninstall or data clear.
- iOS simulator: `com.designsbyfa.casitadex.plusstoreqa`, rebuilt and installed before the two XCTest runs.
- No physical iPhone build installation or owner acceptance is claimed.

## Figma reconciliation

File `39uzN0SZX8nlmcGDcHdQhr`, page `398:2`.
Compared Add Memory `442:2`, Add Reminder `461:2`, and Reminders light/dark `434:2` / `975:119`.
Updated the existing Add Reminder buttons (`434:6`, `975:123`, text `434:7`, `975:127`) to Add Memory's 14-point typography, 12-point horizontal padding, and 8-point radius. Expanded width to 156 so icon, label and chevron fit; visual review passed. Navigation preserved.

Remaining design documentation gap: Figma's existing date/time preview frames `986:44` and `986:53` are schematic previews with Close, not literal native platform dialogs. Native evidence documents Android Cancel/OK and iOS Done/adaptive wheels. No claim of full pixel-identical native-picker mockups.

## Release gates / next batch

- Implemented, built and installed are verified separately above. Owner acceptance remains pending.
- Physical iPhone acceptance is still the owner's separate sign-off.
- Complete owner review of this Samsung build, reconcile the schematic Figma picker previews, then continue the remaining release-readiness gates before household sharing.
- No merge to main, store submission, production release, purchase, or household-sharing implementation occurred.

## Subsequent design checkpoint — November 16

The live Figma picker references have now been verified and the schematic documentation gap is superseded by [the picker reconciliation checkpoint](REMINDER_PICKER_RECONCILIATION_20261116.md). Physical iPhone owner acceptance remains pending; see [the prepared checklist](IPHONE_OWNER_ACCEPTANCE_20261116.md). No new native test or installation is claimed by this documentation update.
