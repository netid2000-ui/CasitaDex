# SB40 Android acceptance resumed

November 8, 2026. All execution on FA-MAC-DEV-01.local, existing FA-Development checkout, branch work/cd-sb40-authority-source-20261108. Starting repository revision **c864212ec1b5bf17f6eb15310b72ffbbb980276f**. Installed application implementation remains **c5eb43d** in retained SB40 native QA shells, package com.designsbyfa.casitadex.sb40qa. Android target emulator-5554 / sb40_four_items. No application implementation, native shell or artifact installation changed in this checkpoint. Harness-only change: journey.yaml uses on-drag keyboard dismissal instead of Android Back-based hideKeyboard.

## Passed

- [x] Exact Mac, SSD, checkout/branch and clean starting tree verified. Recent detached jobs and process activity reviewed; earlier read-only triage job had exited without changing the app. No duplicate job started.
- [x] Current installed Android APK and AVD passed pinned identity guard.
- [x] Android app full v4 backup exported through normal native Settings/Backup and Android folder picker, copied to SSD and decoded using the existing production archive reader. All media validated. No run-as retry, private-data access bypass or debug-flag modification.
- [x] Earlier Android journey failure reproduced: Back-based keyboard dismissal leaves Add Memory. The typed QA draft remained saved and could be resumed. A drag dismisses the keyboard while staying in Add Memory. This resolves the test-harness blocker; no product Back-behavior certification inferred.
- [x] Preserved fictional draft resumed, description entered, saved, searched and reopened. Save Reminder returned to its originating Memory Details. No duplicate fixture was created. The complete edited Maestro YAML has not been replayed from scratch; this is the passing native resumed journey evidence.
- [x] Android saved QA photo memory filled from two to five through native file picker using only SB40-QA colored images. Add Photo disabled at five. Existing two photo IDs retained. No sixth addition attempted.
- [x] Second native full v4 backup exported and decoded. All eight saved photo payloads verify against size/hash. Before/after: 95 → 96 memories, 5 → 8 saved photos, 3 → 4 standalone reminders; exact new memory/reminder link verified. Draft null.
- [x] All existing non-fixture memories, prior media metadata, standalone reminders, Spaces and Categories unchanged. Only intended QA memory/reminder and three fixture-photo additions account for differences.
- [x] Returned Android QA to Photos. No acceptance job left running by this work.

## Failures, limitations and open gates

- Previous failed Maestro result remains retained. The replacement drag was exercised through native controls; the revised full composite flow is not claimed as replayed.
- One bounded native command timed out while trying to reach the fixed More button; current screen was inspected before continuing. A later cap command timed out after its passing report was saved, before Close completed. Read-only inspection confirmed five photos and disabled Add before closing separately. No uncertain save/add action was retried.
- run-as remains unsupported by the retained non-debuggable Android QA package. Native exports provide a verified current before/after audit, but cannot retroactively establish snapshot equality across the earlier sticky-controls install. The historical private-snapshot audit remains unverified.
- Draft five-photo cap: NOT RUN here. Direct sixth-photo store rejection remains prior source evidence only.
- Manual two-finger pinch remains BLOCKED on the existing Mobilewright multitouch injection route. No human certification obtained.
- Full large-text, landscape, VoiceOver/TalkBack, broader offline/reconnect, actual restore, notification-tap lifecycle and broader security qualification remain open. Native full backup export/readback now has fresh Android passing evidence; restore was not attempted against this collection.
- Physical Samsung/iPhone and store gates remain pending separate authorization/availability. Release status remains NO-GO.

## Evidence

[Selected reports and screenshots](sb40-android-resume-20261108/). Raw command traces, snapshots and full v4 backups remain only on the development SSD at QA-Evidence/CasitaDex/sb40-android-resume-20261108. Backup files also remain in the QA emulator Documents folder. Backups/snapshots containing private collection data are not committed.

Next open checkpoint: draft cap and changed Photos surfaces at large text/landscape, followed by remaining final photo regression and broader offline/restore/notification/security qualification. Preserve manual-only and physical gates as open.
