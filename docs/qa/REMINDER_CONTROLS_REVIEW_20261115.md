# Reminder controls and native picker review — November 15, 2026

Reviewed installed application source 82cf922 / evidence checkpoint 2f4877e on FA-MAC-DEV-01.
Review branch: work/cd-reminder-controls-review-20261115.
This batch adds review evidence and regression checks only. No application source change or new native installation.

## Answer

The Add Reminder Cancel/Save header and date/time entry fields follow the Add Memory design. The whole Reminders flow is **not yet fully consistent or large-text ready**.

### Confirmed matches

- Add Reminder uses the same shared editorial Cancel/Save components and icons as Add Memory.
- Date/time entry controls use labeled, rounded, minimum-48-point fields with icons and right chevrons.
- Add Reminder action and wrapping list tabs use the established typography, rounded controls and palette.
- Bottom navigation remains Home → Photos → Reminders → Find.

### Findings requiring correction

1. **iOS enlarged calendar is horizontally clipped.** At accessibility-large, the calendar's right edge is 438.67 points on a 402-point-wide simulator screen. The Saturday column and right navigation area extend offscreen. Reproduced twice, confirmed by screenshot, and captured by a failing XCTest geometry assertion. Relevant implementation: EngReminders inline date picker in src/eng-screens.tsx.
2. **Samsung native date/time dialog styling does not follow the app's selected palette.** Gray/teal Android dialogs appear even over CasitaDex Light mode. They are usable but do not visually match the new olive/cream controls. This differs from the in-app date/time trigger styling, which matches.
3. **Reminder row Edit action lacks the accepted chevron.** Expanded More actions still show plain “Edit”, rather than “Edit ›”. Verified on Samsung and in src/figma-first/FigmaReminders.tsx.

## Actual results

| Target | Date | Time | Return |
|---|---|---|---|
| Samsung normal text / Light | Opens; calendar and actions visible | Opens; clock and actions visible | Cancel preserves original displayed value |
| Samsung 200% text / Dark | Opens; calendar and actions visible | Opens; clock and actions visible | Cancel preserves original displayed value |
| iOS simulator normal text / Light | Opens; fits screen | Opens; fits screen | Done returns, unchanged values |
| iOS simulator accessibility-large / Dark | **FAIL: horizontal overflow** | Fits; selected time and Done visible | Done returns, unchanged values |

Samsung automated presentation/dismissal checks: **4 passed**.
iOS normal XCTest: **1 passed, 0 failed**.
iOS enlarged XCTest: **1 failed**, due to calendar overflow; second evidence run continued through the time-picker checks and reproduced only the calendar geometry failure. This is an actual app layout finding, not a dismissed test-driver error.

Tests opened/dismissed pickers and inspected existing reminder actions. No reminder was created, saved, completed, deleted or rescheduled. Alert delivery was not retested.
Samsung restored to font_scale=1.0 and System appearance; iOS restored to content size large and Light appearance. Both returned Home.

## Evidence

- Samsung logs: evidence/reminder-controls-review-20261115/samsung.txt and samsung-actions.txt.
- Samsung screenshots/hierarchies: evidence/keyboard-field-sweep-20261115/R5GL83X0K3N/reminder-review*, reminder-actions.
- iOS logs, summaries and PNG attachments: evidence/reminder-controls-review-20261115/.
- Complete iOS result bundles retained on the Mac under Apple-Builds/CasitaDex-Reminder-Review-{Normal,Large,Large-r2}.xcresult.
- Installed Android package remains com.designsbyfa.casitadex.refreshqa, APK SHA-256 c9cea12f3ed61de6e1856dcb486c4786308afbee3ac3ea3e46b83a391013d2b6.
- iOS bundle remains com.designsbyfa.casitadex.plusstoreqa. Physical iPhone acceptance is not claimed.

## Recommended correction order

Fix adaptive iOS calendar layout first, align Samsung native-picker theming with the selected app appearance, and normalize the reminder Edit action. Rebuild and repeat the targeted native checks before marking Reminders complete. Preserve existing reminders and accepted behavior throughout.
