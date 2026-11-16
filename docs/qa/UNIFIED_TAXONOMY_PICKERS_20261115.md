# Unified Space, Categories and Location pickers — return report

Date: November 15–16, 2026. Execution: FA-MAC-DEV-01 only.
Branch: `work/cd-unified-taxonomy-pickers-20261115`.
Application source commit: `82cf922`.

## Implemented

- [x] Space, Categories and Location now use one full-screen picker component, with consistent entry fields, typography, chevrons, search, alphabetical choices, Create new, None and Cancel.
- [x] Empty values display **Choose Space**, **Choose Categories**, **Choose Location**.
- [x] Space and Location apply one choice and return immediately.
- [x] Categories stages multiple choices; **Done** applies them. Picker Cancel discards pending assignment changes. Cancelling Edit Memory restores the saved memory.
- [x] Location reuses existing taxonomy and stays scoped to the selected Space.
- [x] Creation failures keep entered text; selection failures keep pending choices.
- [x] Explicitly saving a new reusable label creates that label. Cancelling a later category assignment does not delete an explicitly created reusable label.
- [x] Notes and Reference remain inline. Navigation remains **Home → Photos → Reminders → Find**.

Continues the verified Samsung corrections (75398f0), search/Location corrections, photo-source Cancel correction, keyboard/Results report (540f8e3), and Figma filter reconciliation (4786214). Accepted work was not reset or repeated wholesale. Main checkout and unrelated worktrees were untouched.

## Automated verification

TypeScript PASS; ESLint PASS.
Full regression suite: **525 tests; 519 passed; 6 skipped; 0 failed; 0 cancelled**.
Focused shared-picker regressions cover sorting/scoping, None, Cancel/Back, creation failure, staged category creation and selection, failed Done retaining choices, and immediate single-choice return.
Logs: `evidence/unified-taxonomy-pickers-20261115/{typecheck,lint,tests}.txt`.

## Native verification

| Target | Result | Evidence |
|---|---|---|
| Android emulator | 32/32 targeted checks passed, normal/light and 200%/dark | `evidence/keyboard-field-sweep-20261115/emulator-5554/unified-pickers-r3/results.json` |
| Emulator native creation | Space, Category, Location created and selected; cancelling Edit preserved saved memory | `emulator-create.txt`; three explicitly named reusable QA labels retained on emulator only |
| Samsung normal/light | 16/16 targeted checks passed | `R5GL83X0K3N/unified-pickers-r3/results.json` |
| Samsung 200%/dark | 16/16 passed | `R5GL83X0K3N/unified-pickers-large/results.json` |
| iOS simulator category selection | 1 XCTest passed, 0 failed/skipped: Done, picker Cancel and Edit Cancel | `ios-selection-summary.json` and attachment |
| iOS simulator enlarged keyboard | 6 XTests passed, 0 failed/skipped: search and create-name fields for all three types | `ios-large-summary.json`, six screenshots |
| Samsung persistence | PASS: representative saved text, four photos, saved Location and settings unchanged | before/after saved text, four photos, saved Location and settings captures |

Keyboard checks measured the focused field against the visible software-keyboard frame and confirmed its text stayed unchanged. Android additionally checked minimum visible field height. iOS used accessibility-large and restored the original large content-size category. These are targeted checks of changed picker inputs, supplementing the previously completed full keyboard sweep; they are not a new claim of full-app acceptance.

Samsung tests did not save or delete memories or create taxonomy values. Add-draft text was checked before/after; temporary edits were cancelled. No package was uninstalled and no application data was cleared.

### Actual failed/incomplete test attempts

- Initial emulator run could not measure a visible software keyboard with hardware-keyboard settings. A later run hit a test locator/value assumption. Both were corrected; final 32-check run passed. Temporary emulator keyboard settings were restored.
- Samsung initial attempts found Android Back also dismissed the modal. The driver now reopens the picker before independently checking its Cancel action. This is recorded platform behavior, not an app change. The first complete normal-size pass then failed while transitioning to the appearance page after a font-size cold restart; readiness waits were corrected and only the enlarged run was repeated.
- A recovery diagnostic accidentally called the sweep's `labels()` routine instead of the imported read-only labels helper; it focused a label search field then stopped on an undefined diagnostic variable. No text or label was created or saved. The corrected diagnostic read the hierarchy directly.
- iOS early combined runs failed on Home or category-option locators (hardcoded/hidden fixture choices). Another run was cancelled after repeated 60-second simulator animation-idle waits; it is **not** reported as passed. Isolated final category and six enlarged-field tests passed. Failure/cancelled logs are retained.

## Built and installed identity

Android build PASS; iOS simulator build PASS.
Android QA package: `com.designsbyfa.casitadex.refreshqa`.
Built APK SHA-256:
`c9cea12f3ed61de6e1856dcb486c4786308afbee3ac3ea3e46b83a391013d2b6`.

The installed `base.apk` hashes on **emulator-5554** and **R5GL83X0K3N** exactly match this APK. Installation used `adb install -r`.
iOS simulator bundle: `com.designsbyfa.casitadex.plusstoreqa`, version 0.1.0/build 1, with installed JavaScript bundle hash recorded in `native-identities.json`.
No physical iPhone installation or owner acceptance is claimed.

## Figma reconciliation

[Approved CasitaDex file — Add Memory](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=442-2).

- [x] Primary Add Memory in light/dark and Edit Memory from Find/Photos (light), Photos (dark) use matching picker entry patterns.
- [x] Location now uses the same full-width labeled field and chevron.
- [x] 65 editable picker/create/state views support those five origins, including 40 category staging states.
- [x] Cancel returns without assigning pending Categories; Done assigns and returns; Space/Location return immediately; Location examples are scoped.
- [x] **375/375 structural action checks passed (330 selection/return + 45 creation/return/layout)** across the five flows.
- [x] Screenshots visually inspected; corrected Location width and header text bounds. Existing Inter/Cormorant Garamond and light/dark palettes retained. No flattened UI images.
- [x] Accepted bottom navigation preserved.

Scope limits: this is primary-screen reconciliation and a structural prototype audit, not an interactive playback certification of every historic alternate snapshot. Figma uses finite sample choices; arbitrary keyboard text entry, newly created-label persistence, and all historical prototype variants are not simulated completely. Native source and native tests cover actual taxonomy behavior. Node/variable IDs and scope are in `figma-reconciliation.json`.

## Remaining release gates and next batch

- Owner review of this Samsung build and physical iPhone acceptance remain pending.
- Spoken TalkBack/VoiceOver acceptance, remaining camera/library-import scenarios and store-readiness checks remain separate gates.
- Finish any remaining historic Figma prototype cleanup without changing accepted native behavior.
- No main merge, production release, store submission, purchase, household sharing, or production data mutation occurred.

Recommendation: complete owner/native acceptance and the remaining release gates before starting household sharing. **Implemented**, **tested** and **installed** above are verified separately; **owner accepted** is not claimed.
