# Physical iPhone reminder checks — November 16, 2026

Candidate: f761bad application source, installed as CasitaDex Plus Store QA 0.1.0/build 1 (`com.designsbyfa.casitadex.plusstoreqa`). Device: physical iPhone 17 Pro Max, iOS 27.3 beta. Execution: FA-MAC-DEV-01.

## Verified

- 1 targeted XCTest passed; 0 failed, 0 skipped.
- Home → Reminders → Add Reminder opened successfully.
- Date calendar and time wheels opened in the phone's existing dark appearance.
- Both pickers' horizontal bounds stayed within the app screen.
- Done was present, hittable, and within the screen vertically.
- Closing each picker without changing its selection preserved the displayed value.
- Cancel returned from the unchanged reminder editor, followed by Home navigation.
- Date and time screenshots visually reviewed: visible controls, complete calendar columns and time wheels, no observed clipping.
- No reminder was saved, edited, completed, deleted or scheduled. Device text/theme settings were not changed.

The first attempt could not run because the prior audit project supported simulators only. A separate physical-device audit project was prepared; the actual physical test then passed. The initial harness failure remains in evidence and is not counted as an application failure.

## Limits

This verifies current-size dark-mode presentation and navigation on the physical phone. It does not establish physical enlarged-text/light-mode coverage, changed-value confirmation, notification delivery/routing, VoiceOver acceptance, or owner approval. Earlier simulator enlarged-text checks remain separate evidence.

Evidence: `evidence/iphone-physical-reminder-20261116/summary.json`, four PNG attachments and manifest; `iphone-physical-reminder-20261116-tests-r2.txt`. Full xcresult retained under FA-Development/Designs-by-FA/Apple-Builds/CasitaDex-Physical-Reminder-r2-20261116.xcresult.

Next: owner review of the installed app and the remaining cases in IPHONE_OWNER_ACCEPTANCE_20261116.md, prioritizing changed date/time, linked reminder Save and notification routing.
