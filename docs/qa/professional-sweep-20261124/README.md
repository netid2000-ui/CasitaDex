# CasitaDex household recall and design review

November 24, 2026 · Everyday recall branch · Mac mini FA-MAC-DEV-01

## Assessment

CasitaDex’s strongest interaction is retrieving a real household answer. The Samsung walkthrough saved a filter size and its location, found it again, and kept it recoverable after archiving. Home, Photos, Reminders and Find retain their approved order. Reminders and backup guidance now expose important information earlier.

| Household job | Evidence |
| --- | --- |
| Capture and find | Created Utility closet shelf QA and saved “Spare filter 20x25x1 above the washer.” Searched for the title, saw one result, and reopened the exact description. |
| Recover a memory | Reviewed Active, Archived and Recently deleted. Archived only the synthetic test memory, found it in Archived and reopened its details. No owner records were changed. |
| Use a photo | Opened the Photos tab, grid and compact controls, an existing cover photo, the full-screen viewer and its zoom, close and associated-memory controls. Returned to Home. This pass verified entry and return; it did not retest every pinch gesture. |
| Review reminders | With zero upcoming and one overdue item, the old screen displayed only “Overdue.” The count was already available to accessibility APIs. The new build visibly showed “Overdue (1).” Tapping it opened the overdue linked reminder. |
| Back up and return | Opened Settings and Backup & restore on the Samsung. The introduction now explains what a full backup contains and where to keep it. The replacement warning sits immediately before file selection. Existing review/confirm and recovery logic was retained. No destructive restore was performed on the Samsung. |
| Handle a recovered read | Home now clears an earlier load-error message after a subsequent successful load. This was found in source. The Samsung was not subjected to a forced storage failure. |
| Navigate on iOS | Updated the JavaScript bundle in the existing CasitaDex simulator QA runtime. XCTest opened Photos, Reminders, Find and Home and observed the Home search action again. The four-tab marker was reached; teardown did not produce a final test-suite verdict during the review. |

[Household answer](retrieved-new.jpg) · [Search result](search-new.jpg) · [Archived record](archive-new.jpg) · [Visible reminder count](visible-count.jpg) · [Backup overview](backup-updated.jpg) · [Native route labels](native-observations.md)

## Design and remaining acceptance

The Figma reminder examples now show the two scheduled items in the Upcoming label. The light and dark backup introductions match the app. Research into model-number locators and household records supports the existing optional Reference, photo and location controls. The app can stay quick for a single answer.

The synthetic record’s details still spend screen space displaying empty optional fields. A compact default with those fields accessible through Edit is a candidate for owner review. The Android accessibility tree also repeated some empty chooser prompts, for example “Choose Space, Choose Space.” Spoken assistive-technology verification is still open.

TypeScript passed. The suite reported 546 passes, one skip and zero failures. Real store checkout, physical-iPhone acceptance and a fresh physical-iPhone backup round trip remain open. No release submission or purchase was made.

[Reminder design](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1632-431) · [Backup design](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=487-97) · [Shared research register](https://github.com/netid2000-ui/event-command-by-fa/blob/work/private-device-planning/docs/research/professional-review-2026-11-24.md)
