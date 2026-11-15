# Samsung UI corrections — November 15, 2026

Status: COMPLETE for the requested UI corrections. Final APK installed and verified on Samsung; household implementation remains paused.

## Changes
- Replaced legacy boxed Edit controls for Memory Name, Space, Categories and Reference with the approved quiet `Edit ›` treatment. Accessibility names identify each field. Verification actions follow the same visual treatment.
- Constrained shared button content to available width so long text wraps inside its control. Large-text memory titles and their Edit control stack vertically.
- Replaced horizontal Find-filter and Reminder-tab strips with wrapping rows, keeping every control available without horizontal scrolling. Reminder tabs match heights within each row and center multiline labels.
- Photos controls now have a minimum 48 dp height. Shared Android buttons use the same minimum.
- Moved the photo viewer modal outside the gallery ScrollView. Closing an unchanged gallery no longer replays an earlier scroll offset; only a changed item position triggers anchor compensation.

## Build identity
Built on FA-MAC-DEV-01. Isolated Android package `com.designsbyfa.casitadex.refreshqa`, version 0.1.0 (1).
APK SHA-256: `353914f84b88f0058ce95384349badd9e2c8b1e5c894398150ae4fa380f130fa`.
The installed Samsung APK hash matches the new build. Update installation preserved the existing QA collection. Owner dev/staging/SB32 packages were not changed.

## Validation
- TypeScript: PASS.
- Automated suite: 510 passed, 6 skipped, 0 failed (516 total).
- ESLint: PASS.
- Android release build: PASS.
- Emulator: normal-size Find, Reminders, Photos and Details geometry; contextual Edit controls; 48 dp photo targets; Reference editor open: PASS.
- Samsung: Find, Reminders, Photos and Details checks passed in Light/Dark at system font scales 1.0 and 2.0. Contextual Edit controls and Reference editor open passed in all four combinations.
- Final tab alignment: emulator 1.0/2.0 and Samsung Light/Dark at 1.0/2.0 passed, including equal row heights.
- Photo viewer: grid/compact, sort, sticky controls, zoom, double tap and real two-pointer pinch passed in both themes. Exact returned item bounds matched before/after in both themes.
- Final APK photo position: a 503-pixel-high visible photo returned to identical bounds in both themes after zoom/reset/close.
- Long selected Space label: full text wraps within its button at 1.0 and 2.0. The long full-backup button was also checked at 2.0. Temporary QA label cleanup is recorded separately.
- Final cold start: original saved text, four QA photos and saved Location retained. System font restored to 1.0, appearance to System, original radio settings confirmed. Temporary QA Space removed. App left on Home.

## Scope
These corrections implement the approved button treatment and responsive behavior within the existing navigation and page structure. No household sharing, storage migration, production release or purchase changes.

Physical iPhone acceptance has not been repeated for this shared-source change. The earlier sweep's manual TalkBack, camera capture/library import and store-purchase gates remain separate; this correction pass does not claim to close them.

Evidence: [samsung-ui-corrections-20261115](evidence/samsung-ui-corrections-20261115/).

## Evidence versions and test corrections
The first corrected APK (`5d08164…`) completed the four-way Samsung layout matrix and full photo gesture/return checks. Visual review then identified uneven wrapped tab heights. The final APK (`353914f…`) changes only Reminder tab height alignment and multiline centering from that first corrected build. Final-package tab, photo-position, long-label and persistence evidence is recorded separately. The installed APK hash is verified in `build-identity-final.json`.

Initial final-tab and long-label attempts changed font size and navigated before Android finished activity recreation; they returned to the original Appearance launch intent. Waiting for recreation and explicitly selecting the intended navigation tab produced the passing reruns. These were harness sequencing errors, not counted as successful attempts.

Figma review confirmed the established `Edit ›` language in the current warm editorial flow (for example Reference/Notes controls on frame 442:2). This pass restores that existing treatment; it does not introduce a new design direction. Native Android responsive evidence is linked here; no Figma prototype graph mutation was made.

During temporary-label cleanup, the test helper initially matched the search field's entered text instead of the same-named result button. Subsequent swipes landed on the keyboard. No saved label or memory content changed. Cleanup used a partial query, and the helper now excludes entered EditText values from button-text matching. The separate cleanup log records the result.

## Checked-off correction results
- [x] Legacy boxed Edit controls replaced with consistent `Edit ›` actions.
- [x] Horizontally cut filter/tab controls replaced by responsive wrapping layouts.
- [x] Long selected labels and backup buttons remain inside the viewport at 200% text.
- [x] Photos controls meet the measured 48 dp target.
- [x] Photo-close drift eliminated in the tested light/dark gesture flows and final-package visible-photo checks.
- [x] Final Samsung installation, data persistence and original settings verified.

The final read-only crash review did not contain this package. No store release, production merge or household implementation occurred.
