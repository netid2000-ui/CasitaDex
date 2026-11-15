# Search and Location correction acceptance

Run only on FA-MAC-DEV-01. Android scripts target `com.designsbyfa.casitadex.refreshqa`; specify `QA_SERIAL=emulator-5554` or `QA_SERIAL=R5GL83X0K3N`. No script resets app storage or edits saved memories.

- `acceptance.py`: new searches from Home and the Find tab, query restoration after Details, clear search, saved Location selection, combined filters, paging, four-tab order, light/dark at font scales 1.0/2.0. Restores font scale and System appearance.
- `extra-context.py`: query plus photo-filter restoration and page-two restoration. Asserts the first result is below sticky filters before opening it.
- `persistence.py`: Samsung cold-start comparison of the existing QA memory, four-photo memory, saved Location and device settings. `QA_PHASE=before` and `after` distinguish evidence.
- iOS XCTest source is under `qa/search-location-ios`. Tests run against the isolated `com.designsbyfa.casitadex.plusstoreqa` app; no purchases or saved-memory mutations occur.

The first Android harness run used an inherited Samsung-only screen-bottom cutoff and could not tap the emulator's navigation. The second selected a Space without Locations; that is a valid empty picker, not an app defect. The third matrix passed. A separate page-return check then exposed the first result beneath sticky filters; the final candidate fixes the Next scroll offset. Preserve those initial logs as diagnostic evidence.

The first Samsung streaming-install job was cancelled before its completion was observed. Package metadata subsequently showed that the intermediate APK had been installed. Do not treat that job as acceptance. The final candidate is installed with `--no-streaming -r` and checked independently.

The final Samsung acceptance run passed through Next, then its Previous tap used an accessibility node obscured by the sticky filter header and toggled the photo filter. Revealing the pager with a downward swipe before tapping verified Previous correctly. `resume-matrix.py` resumes at that checkpoint and runs the remaining theme/font matrix; it retains prior checkpoints. No application-source change was needed for this harness correction.
