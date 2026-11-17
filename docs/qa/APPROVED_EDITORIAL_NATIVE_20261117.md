# Approved Home hero and app action styling — November 17, 2026

## Implemented and approved
Owner approved the Home botanical artwork and carrying Home horizontal action lines throughout the app. Source commits: 8f67979, 658194c and a39c37f, branch work/cd-approved-editorial-native-20261117. All implementation/build/tests ran on FA-MAC-DEV-01.

- Integrated the exact approved transparent PNG from Figma into Home, with responsive contain sizing and the approved caption. Alpha transparency confirmed; no theme-dependent background blend.
- Shared secondary actions, memory selectors, Notes/Reference rows, taxonomy management, and reminder date/time triggers use horizontal rules. Primary save actions remain distinct; focus/selected indicators and touch targets retained.
- Integrated pending photo-source chooser fixes and accessible Cancel, including divider styling on its source actions. Existing uncommitted worktree preserved.
- Final visual review caught custom Photos view/sort/Add Photo and Reminder tab/Add Reminder controls bypassing shared styles; commit 658194c applies horizontal rules with a stronger bottom rule for selected controls. Rebuilt both native apps and ran focused delta acceptance. Commit a39c37f fixes the plus icon contrast on the now-transparent light action and left-aligns it.
- Navigation remains Home → Photos → Reminders → Find.

## Automated verification
TypeScript PASS; ESLint PASS. Full suite: **539 total, 538 passed, 1 skipped, 0 failed**. Remaining skip requires a historical SB38 Release simulator artifact. Native Android release and iOS simulator builds succeeded. This report supersedes the earlier source-only EDITORIAL_ACTION_LINES_20261117.md checkpoint.

## Native verification
- Android emulator: four targeted states passed (light/dark × 100%/200%). Home artwork/actions, navigation, Find Location control, three memory selectors, photo-source Cancel, reminder date/time dialogs. Final cleanup initially reopened a test-created invalid /home deep link; a separate MAIN cold launch and settings check passed. Raw log retains that failure; do not interpret its process exit as a clean full-run exit. Final custom Photos/Reminder controls also passed all four states; the final plus-icon color/alignment correction was installed and visually verified in light theme, and Add Photo Memory opened the editor successfully.
- iOS simulator: normal/light Home/selectors/photo-source test passed; dark accessibility-large Home/selectors/photo-source and date/time picker tests passed (2 tests). Screenshots visually reviewed. Final custom Photos/Reminder controls passed normal/light and dark/accessibility-large; the final plus-icon contrast correction passed the normal/light test again. Original light/large settings restored.
- Samsung: initial integrated Home/selectors/Cancel/picker matrix passed all four states. Final custom Photos/Reminder controls passed all four states on the final installed APK. All targeted controls remained reachable and screenshots showed no horizontal clipping. Original font 1.0 and dark theme restored; emulator restored font 1.0/light. Final installed identities are independently verified in evidence/approved-editorial-native-20261117/final-installed-identities.json.

Test development failures were retained privately: an incorrect Location label, system Home matched instead of app Home, iOS accessibility element-type assumptions and gestures scrolling nested text instead of the page. Tests were corrected to use app-scoped navigation and outer-page scrolling. Samsung photo Cancel initially failed during a device orientation change (the captured screenshot was landscape while the preceding UI bounds were portrait); direct recheck passed and the remaining matrix allows dismissal time. A later iOS test invocation named the wrong test target and did not run; the corrected target passed. No product changes were made to mask test-harness failures.

## Installed identities and preservation
Android package: com.designsbyfa.casitadex.refreshqa. Initial integrated APK SHA-256: 8c6f5b87df63ec377b05d74e3091caa44de760db7daee080bf6644670282f4ad. Final installed APK SHA-256: 38e97070a57eae4995dc8897128298dd52c1e91d9bd1839449b937d92c3b0591. Installed with replacement on emulator and Samsung. The initial integrated Samsung install command timed out; independent installed APK hashing confirmed it. The final installation returned Success, and independent hashes on both Android devices match the final APK. No uninstall or data clear.

iOS simulator bundle: com.designsbyfa.casitadex.plusstoreqa. Final installed main.jsbundle SHA-256: 648839befccb0ab8eae6dd0493cb45384062e89bc5802e77771e554af372f2c2. Physical iPhone unchanged.

Simulator data: all 11 SQLite tables compared; only eng_state_v2 revision changed 97→99, remaining payload equal. All 45 pre-existing image hashes unchanged. Full private backup retained on Mac. Android release sandbox does not permit the same database comparison; replacement install and observed retained QA state (including QA Samsung Photo Sweep with four photos and its unfinished photo draft) are evidence, not byte-for-byte preservation proof. Tests did not save new memories, change taxonomy values, or save reminders.

## Figma reconciliation
Approved Figma file: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
Home light/dark: 1624:291 / 1624:345. Exact hero asset integrated. Ten light/dark flow pairs are documented in EDITORIAL_ACTION_LINES_20261117.md (20 editable review frames). Current approval authorizes implementation. Original historical master/prototype screens remain preserved; review frames are not a claim that every historical prototype was rewritten.

## Remaining release gates
This is targeted styling/native acceptance, not a repeat of the whole earlier Samsung sweep. Complete keyboard traversal, all search/filter combinations and every older release gate are not newly certified by this batch. Physical iPhone acceptance and owner acceptance of the newly installed Samsung build remain pending. No main merge, store submission, production purchase, or household-sharing work performed.

Next batch: owner review of the installed visual update, physical iPhone parity/sign-off, and close remaining release checklist items using existing evidence before store preparation.

## Evidence
Screenshots, UI trees, verification scripts, build/test logs and package hashes: [approved-editorial-native-20261117](evidence/approved-editorial-native-20261117/). Tests were cumulative: integrated Home/editor/picker acceptance on 8f67979, custom-control matrix on 658194c, and icon contrast delta on a39c37f; Samsung custom-control matrix ran on a39c37f. Do not imply every previous suite was rerun on every artifact.
