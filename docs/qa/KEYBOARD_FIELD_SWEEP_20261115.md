# Keyboard entry-field sweep — November 15, 2026

Status: IN PROGRESS. This report does not claim full native acceptance.

## Scope and source

Continued accepted Samsung corrections, search/Location corrections, and Add Photo Cancel fixes. Branch `work/cd-keyboard-field-sweep-20261115`. All implementation, builds and tests on FA-MAC-DEV-01. No main merge, production release, or household-sharing changes.

- `8421445`: enabled existing Android keyboard reveal across shared Page screens; remeasure on viewport/content layout changes; moved label-management list controls into scrollable content so enlarged labels leave space for entry.
- `ce0d09d`: corrected vertically stacked Memory Details actions and title. Horizontal `flex:1` sizing had been retained in column layout, allowing collapsed/overlapping Results/Edit/More touch areas at enlarged text. Column wrappers now use natural height.
- iOS retains automatic keyboard insets. Bottom navigation remains Home, Photos, Reminders, Find.

- `521a9a7` / `94cdd0c`: coalesce focus/layout measurements and recheck after native scrolling, correcting intermittent first-opening overlap in Reminder Notes and Add Reference at 200%. Earlier failed screenshots/results are retained.

## Test method

Inventory: `evidence/keyboard-field-sweep-20261115/source-inventory.json`. Legacy screens/draft components are distinguished from current routes; EngFind's old search field is dormant, with current Find implemented in FigmaFind.

Android focus-only checks measure the focused native EditText against the real nonzero IME window frame, require clearance above the keyboard, and compare values before/after. No form text, label, memory, or reminder is saved. Find navigation tests only change search context. Light 100% and Dark 200% runs exercise Add/Edit names, Description, Notes, Reference, Space/Category creation, Location search/create, reminder title/Notes, label search/create/rename, verification reference, History note, next reminder, and Find. Additional Results tests check disjoint touch areas and return context. Screenshots and UI hierarchy are retained.

Early invalid attempts are retained, not silently promoted to passes: emulator Gboard stylus tutorial did not provide a real keyboard; some probes tapped visible text labels rather than EditText; one repeated iOS run stopped at the preserved draft prompt. The harness now targets input nodes and resumes the draft. Focused/unfocused Android input heights can change; screenshot review showed the original height-equality assertion falsely failed two fully visible label-search fields. Final checks require visible geometry and screenshot review instead.

## Current verification

- TypeScript and ESLint: PASS after Results fix.
- Regression suite: 515 passed, 6 skipped, 0 failed.
- Android release build: PASS. APK SHA-256 `779f4feff00fd0ed2b4a7f8fedebcf3a03592e2f54f3b58047c8fc28c77c53a5`.
- Package: `com.designsbyfa.casitadex.refreshqa`; replacement installs only, never uninstall/data-clear.
- iOS core keyboard test r5: PASS (9 field checks). Header build r6: 3 tests PASS (keyboard, query/filter return, page-two return). r7 enlarged Dynamic Type (`accessibility-large`) core test: PASS, 9 field checks; restored original `large` setting. Installed iOS source includes ce0d09d; subsequent Android-only reveal changes do not alter the iOS path.
- Android focused timing regression: 6/6 PASS on final build, including the first opening of Reminder Notes. Final broad emulator sweep: 29/29 PASS at Dark 200%; edge-case navigation checks and Samsung installation/verification remain pending.
- Samsung pre-update checkpoint: original saved text, four-photo memory, saved Location and settings passed.

## Remaining acceptance boundaries

Physical iPhone owner acceptance is separate. Hardware/floating keyboards, landscape, and every third-party IME are outside this portrait onscreen-keyboard sweep. No new Figma layout was introduced; these changes restore accessible scrolling and non-overlapping controls. Final evidence reconciliation remains pending. No owner acceptance is implied by automated passes.
