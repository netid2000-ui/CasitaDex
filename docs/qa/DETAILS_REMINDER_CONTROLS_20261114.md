# Details structure and reminder controls — November 14, 2026 (Chicago)

Following 8ab9c4e on work/cd-plus-backup-safety-20261114.

## Changes
Reminder Date/Time controls now use original Figma SVG assets at their unchanged 16×16 dimensions, separate light/dark colors, readable date text, left-aligned values and chevrons. Underlying ISO date/time state and native pickers unchanged. Required title wording and More options styling aligned.
Details now puts Description and the existing ordered cover photo before metadata. The cover uses the existing stored file and viewer route; the existing full thumbnail list and all photo controls remain. Taxonomy/Reference/verification rows use divider styling. Fixed top actions are quieter; direct Set Reminder and Share actions are available alongside existing More actions. No share was sent.
No persistence/domain/navigation logic was rewritten.

## Design references
Figma 39uzN0SZX8nlmcGDcHdQhr: 626:2 (light reminder), 975:264 (dark reminder), 1355:273 (Details). Original assets are in assets/approved-refresh/reminder-*.svg; hashes and root dimensions recorded in evidence/details-final-20261115/assets.json.
Real data and inline-edit affordances are retained rather than hardcoding the sample's answer or removing existing controls.

## Verification
Mac mini only. TypeScript/ESLint PASS; 491 automated PASS, six existing SKIP, zero FAIL.
First iOS native picker/style run PASS before cover restructuring; final run adds existing-cover rendering and Details inline-edit checks. Native outcomes below.
Original accepted apps and physical phones untouched. Disposable Android refreshqa replaced to avoid emulator update-space failure. No photo imports, edits, ordering or gesture acceptance repeated.

## Remaining scope
Cross-screen visual/accessibility review, production configuration qualification and physical-device acceptance remain. This checkpoint is not release approval.

## Fixed-action defect
The longer Details page exposed that revealing the sticky memory title shifted the action row downward (23 points on iOS; also reproduced on Android). Moved the sticky title below the action row. Both failed pre-fix checks are retained as failures, not acceptance. Final runs verify stable action coordinates while scrolling.

## Final iOS result
PASS: testReminderPickerStyling, one test / zero failures on final source, both themes. Native date/time pickers open and close; existing cover renders; action-row position stays constant during scroll; Location inline editor opens and cancels. System appearance restored.
Job 2fc7594b00b13392; /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-Picker-Style-r3-20261115.xcresult.
Both original and disposable iOS ENG database payload SHA values exactly match the prior checkpoint. No memory/photo writes.

## Final Android result
Final build PASS (93068b87925116fe). Both theme checks PASS (85962fc20bf7c1a7): native date/time picker open/cancel, Details inline editor, stable action coordinates across scroll, direct Set Reminder route. Share action present; no share sent. System appearance restored and returned Home.
The pre-fix Android action-coordinate assertion failed and is superseded by the final passing run, not hidden.
