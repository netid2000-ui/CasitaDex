# Reminders and Details layout checkpoint — November 14, 2026 (Chicago)

Branch work/cd-plus-backup-safety-20261114, following c7e249e.

## Implementation
Reminders list owns its scroll container and sticky header. Brand, title, Add Reminder and filter controls remain visible while content scrolls. Removed duplicate app-shell headings for Reminders and its form. Four filters use compact labels; their accessibility labels retain counts and selection state.
Reminder rows now use editorial headings and dividers, with existing Complete/Restore, linked-memory, Edit and Delete controls retained.
Add/Edit Reminder uses compact fixed Cancel/Save, shared icons, an explicit page heading, flat title field and vertically arranged date/time controls. Existing validation, native pickers, duplicate check, scheduling and linked-memory return logic remain.
Details Description/Location/Notes use dividers and compact Edit actions. This is a partial Details presentation update, not a claim of full screenshot parity; taxonomy, photo presentation and remaining action layout still need reconciliation.

Figma references: 434:2 and 975:119 (Reminders), 975:264 (Add Reminder), 1355:273 (Details), file 39uzN0SZX8nlmcGDcHdQhr.
Verified SB40 Home / Photos / Reminders / Find tabs retained despite conflicting exploratory footers.

## Checks
Mac mini only. TypeScript and ESLint PASS; 491 automated PASS, six existing SKIP, zero FAIL.
Initial iOS native flow PASS; visual inspection exposed duplicated heading, corrected before final verification.
Initial Android harness failed because its deep-link shell argument did not quote an ampersand; corrected URL quoting. This failed attempt is not counted as acceptance.
Final native results recorded below.

## Boundaries
Only disposable QA applications were changed. No completed photo import/gesture tests repeated. Physical phones, release/store operations untouched. Synthetic linked reminders may be saved as part of return-flow checks.
Remaining: full Details visual reconciliation; remaining exact reminder icon/field styling; production configuration and physical-device qualification.

## Final results
- iOS final XCTest PASS, one test / zero failures. Both themes, sticky list/form controls, Details inline edit and linked reminder Save return. Job bd36167983e7e595; CasitaDex-Reminder-Layout-r2-20261115.xcresult.
- Android final release build PASS (05755505005e785b). Light/dark layout and sticky-action checks PASS. Fresh-install notification permission interrupted the UI dump after Save; allowed permission in the disposable app, then verified the originating [SAMPLE] Extension cord Details screen. Jobs 510ba38f6e9a283b and af107a86aa4e7cc5. The interrupted run is not represented as an uninterrupted pass.
- System appearance restored; both QA apps returned Home.
- Original QA simulator: 90 memories and unchanged full-payload SHA. Disposable iOS: 20 memories retained. Linked-reminder testing changes synthetic reminder records only.
- Screenshots and bounded results: evidence/reminder-layout-20261115.
