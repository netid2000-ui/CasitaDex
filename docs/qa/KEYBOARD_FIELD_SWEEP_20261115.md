# Keyboard entry-field sweep — November 15, 2026

Status: Final native checks in progress. App-field coverage is complete for the tested Samsung portrait configuration; Results, native time entry and post-update preservation are being finalized.

## Scope and source

Continued accepted Samsung corrections, search/Location corrections, and Add Photo Cancel fixes. Branch `work/cd-keyboard-field-sweep-20261115`. All implementation, builds and tests on FA-MAC-DEV-01. No main merge, production release, or household-sharing changes.

- `8421445`: enabled existing Android keyboard reveal across shared Page screens; remeasure on viewport/content layout changes; moved label-management list controls into scrollable content so enlarged labels leave space for entry.
- `ce0d09d`: corrected vertically stacked Memory Details actions and title. Horizontal `flex:1` sizing had been retained in column layout, allowing collapsed/overlapping Results/Edit/More touch areas at enlarged text. Column wrappers now use natural height.
- iOS retains automatic keyboard insets. Bottom navigation remains Home, Photos, Reminders, Find.

- `521a9a7` / `94cdd0c`: coalesce focus/layout measurements and recheck after native scrolling, correcting intermittent first-opening overlap in Reminder Notes and Add Reference at 200%. Earlier failed screenshots/results are retained.

## Test method

Inventory: `evidence/keyboard-field-sweep-20261115/source-inventory.json`. Legacy screens/draft components are distinguished from current routes; EngFind's old search field is dormant, with current Find implemented in FigmaFind.

Android focus-only checks measure the focused native EditText against the real nonzero IME window frame, require clearance above the keyboard, and compare values before/after. The intended probes do not enter form text or save labels, memories, or reminders. See the runner incident below for a transient draft change and its recovery. Find navigation tests only change search context. Light 100% and Dark 200% runs exercise Add/Edit names, Description, Notes, Reference, Space/Category creation, Location search/create, reminder title/Notes, label search/create/rename, verification reference, History note, next reminder, and Find. Additional Results tests check disjoint touch areas and return context. Screenshots and UI hierarchy are retained.

Early invalid attempts are retained, not silently promoted to passes: emulator Gboard stylus tutorial did not provide a real keyboard; some probes tapped visible text labels rather than EditText; one repeated iOS run stopped at the preserved draft prompt. The harness now targets input nodes and resumes the draft. Focused/unfocused Android input heights can change; screenshot review showed the original height-equality assertion falsely failed two fully visible label-search fields. Final checks require visible geometry and screenshot review instead.

## Current verification

- TypeScript and ESLint: PASS on final app source `94cdd0c` (`typecheck-scroll.txt`, `lint-scroll.txt`).
- Regression suite: 515 passed, 6 skipped, 0 failed.
- Android release build: PASS. APK SHA-256 `779f4feff00fd0ed2b4a7f8fedebcf3a03592e2f54f3b58047c8fc28c77c53a5`.
- Package: `com.designsbyfa.casitadex.refreshqa`; replacement installs only, never uninstall/data-clear.
- iOS core keyboard test r5: PASS (9 field checks). Header build r6: 3 tests PASS (keyboard, query/filter return, page-two return). r7 enlarged Dynamic Type (`accessibility-large`) core test: PASS, 9 field checks; restored original `large` setting. Installed iOS source includes ce0d09d; subsequent Android-only reveal changes do not alter the iOS path.
- Android focused timing regression: 6/6 PASS on final build, including the first opening of Reminder Notes. Final broad emulator sweep: 29/29 PASS at Dark 200%; edge entry fields 8/8 PASS across Light 100% and Dark 200%. Results navigation: 6/6 PASS across Light 100% and Dark 200%, including disjoint Results/Edit/More touch areas, keyboard-open return preserving query/photo filter, and page-two return. Samsung replacement installation succeeded; installed APK hash matches emulator exactly. Samsung app-field coverage: 64 distinct passing case/scale observations (29 main fields plus 3 additional entry paths, each at Light 100% and Dark 200%). `samsung-accepted-fields.json` indexes each accepted observation. Interrupted runs and duplicate History navigation failures are retained; they are not counted as complete passing runs.
- Samsung before/after replacement-install checkpoints: original saved text, four-photo memory and saved Location passed after cold start. Font scale restored to 1.0; airplane mode 0, Wi-Fi 1, mobile data 1 match the original settings. Evidence: `evidence/search-location-20261115/samsung-keyboard-before/` and `evidence/search-location-20261115/samsung-keyboard-after/`.

## Remaining acceptance boundaries

Physical iPhone owner acceptance is separate. Hardware/floating keyboards, landscape, and every third-party IME are outside this portrait onscreen-keyboard sweep. No new Figma layout was introduced; these changes restore accessible scrolling and non-overlapping controls. No Figma design-file edit was required for this keyboard correction; broader design reconciliation is not newly re-certified by this report. No owner acceptance is implied by automated passes.

## Samsung runner incident and recovery

The first physical Location sequence passed the focused search-field geometry check, but hardware Back closed the RN Location modal. The old runner then searched for a missing Create new Location control with scroll gestures; the keyboard reopened on the underlying empty draft Description and interpreted gestures as stray characters. The run was stopped. The initial `final-scroll/1.0-add-description.xml` and earlier photo-Cancel evidence record the original empty Description. Only the generated characters were removed; the original empty Description was verified and captured in `R5GL83X0K3N/picker-investigation/draft-restored.xml` and again after the corrected Location retry. No saved-memory Save action was invoked. This was a test-runner error, not an intentional app data edit.

The keyboard runner now confirms dismissal before each search/scroll gesture and reopens the Location picker if Back closed it. The Location search and name retry passed 2/2, and the draft remained empty afterward. The initial physical run is incomplete, not a full pass; completed field observations are retained and missing cases are resumed separately.

## Evidence interpretation

Some Samsung screenshots captured after UI hierarchy dumping show an unrendered keyboard surface. These alone are not visual keyboard proof. `samsung-live-ime.png` was captured while the IME reported shown and the window surface reported visible; it displays the actual Samsung keyboard with the focused field above it. Later probes record `imeShownBeforeDump` and take a live capture before hierarchy dumping. Automated geometry uses the nonzero native IME frame and focused input bounds.

## Release boundary and next batch

Implemented and installed are distinct from owner accepted. App source is `94cdd0c`; Android package/version is `com.designsbyfa.casitadex.refreshqa`, 0.1.0 (1). Installed base APK hashes on emulator and Samsung match the release artifact above. The iOS simulator build includes `ce0d09d`; later reveal changes are Android-only. No physical iPhone acceptance or production release is claimed. Next: owner review of Samsung Results/keyboard behavior and physical iPhone acceptance, then remaining release-readiness checks before household sharing.

## Samsung Results acceptance

`R5GL83X0K3N/final-results-r2/results.json`: 6/6 PASS across Light 100% and Dark 200%. Results/Edit/More touch rectangles are disjoint; Reference remains above the actual keyboard; tapping Results with keyboard open preserves query and With photos only; page-two navigation returns to page two and the originating result. The normal-size live screenshot was visually reviewed and shows the focused field, keyboard and separate header controls. The first final-results attempt failed because the runner incorrectly restricted non-input targets to the input-safe region; no app change was needed for the corrected retry.
