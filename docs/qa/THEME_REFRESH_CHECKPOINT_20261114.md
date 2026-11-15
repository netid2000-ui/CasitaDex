# CasitaDex theme refresh checkpoint

Owner review date: November 14, 2026 (America/Chicago).
Execution authority: FA-MAC-DEV-01. Read-only source and installed-build inspection; no native acceptance was run.

## Verified source and configuration

- `src/ui.tsx` uses the saved appearance preference and React Native `useColorScheme`. Dark is selected only for explicit Dark or System with device dark.
- `src/figma-first/tokens.ts` uses the same resolution rule.
- `src/app/_layout.tsx` derives status-bar appearance and shell colors from the resolved theme.
- `app.json` requests automatic interface appearance.
- Installed isolated QA bundle `com.designsbyfa.casitadex.plusstoreqa`, version 0.1.0, has `UIUserInterfaceStyle = Automatic` in its built Info.plist.
- No existing theme-specific check was found by the scoped string search of tests and scripts. This is not proof that no indirect coverage exists.

## Figma work recorded in this conversation

Design file: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr

- Updated primary review screens and Settings variants with independent scrolling and persistent controls.
- Prototype navigation uses Home, Find, Photos, Settings; Reminders remains accessible through Settings.
- Text exports remain expanded. Transfer wording uses device.
- Reconciled dark counterparts and origin-specific return routes; light originals retained.
- Direct-link scan of 71 dark review screens checked 282 destinations without a direct light destination. This is scoped prototype evidence, not an entire-file or native acceptance result.
- Corrected seven conditional Settings-return mismatches; checked 336 origin conditions.
- Added simulated device-light/device-dark System previews, standard and large text. Evaluated 48 appearance-choice and 108 System re-entry cases against stored Figma reaction rules, with no mismatches.
- Corrected four large-text Appearance previews that still used standard-size copy.

Theme review entry: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr?node-id=1366-112&starting-point-node-id=1366%3A112

## Outstanding acceptance and implementation

- Automatic OS-theme switching, foreground/background transitions, preference persistence after restart, and explicit Light/Dark overrides have not been demonstrated on native devices by this checkpoint.
- Current QA shell source still uses Home, Photos, Reminders, Find. It is not the refreshed four-tab design.
- The visual refresh has not been applied to app source. Complete design review and owner approval precede that work.
- Verify theme behavior only in an isolated QA build on the Mac mini; preserve accepted SB40 and existing user data. Do not repeat completed photo acceptance.
- After implementation: simulator/emulator checks, then Samsung acceptance, then owner iPhone final sign-off. No store release is authorized by this checkpoint.

Source revision inspected: 41ade59092434d09e2cce102aca87b7bbb391deb

## Follow-up
Native iOS simulator theme acceptance completed later on November 14: see [NATIVE_THEME_ACCEPTANCE_20261114.md](NATIVE_THEME_ACCEPTANCE_20261114.md). The earlier unverified-native status above is superseded for the isolated iOS simulator only.
