# CasitaDex notification lifecycle and Android parity

November 16, 2026. All execution on FA-MAC-DEV-01. Application source remains **593de3d**, based on evidence checkpoint 3843528. No new application code was required for the iPhone lifecycle checks.

## Physical iPhone

Installed: CasitaDex Plus Store QA, `com.designsbyfa.casitadex.plusstoreqa`, 0.1.0/build 1, source 593de3d; iPhone 17 Pro Max, iOS 27.3 beta. Prior installed bundle hash: `8b182d8d065c9b4456e0c69cedea37e17b0ebdc0d10f0541336e235d6819f6ac`.

| Scenario | Verified result |
|---|---|
| Standalone notification while backgrounded | PASS: verified background state, actual delivery, tap opens exact saved title, Cancel and Home |
| Standalone notification with app terminated | PASS: asserted not-running before delivery; tap cold-launches exact saved reminder; Cancel and Home |
| Linked-memory foreground notification | PASS: actual delivery and tap opens `[SAMPLE] Coffee filters` Memory Details |

Three distinct cases have passing runs. Initial run: 1 passed / 2 failed. Background state was checked synchronously before transition finished; cold routing reached the correct editor but cleanup failed with an accessibility-window error during a notification interruption. Second run: 1 passed / 1 failed; closed-app case passed after allowing the banner animation to settle, while a banner interrupted background setup. Final targeted background run: 1 passed / 0 failed. All failures remain recorded, not relabeled. A scoped device crash-log listing found no CasitaDex crash file; this does not prove every interruption's cause.

The XCTest harness now waits for background state and allows notification animation to settle before editor navigation. Newly scheduled reminders are clearly marked QA records. No existing reminders/memories were deleted or edited.

Evidence: `evidence/iphone-notification-lifecycle-20261116*` and `evidence/iphone-notification-background-20261116-r3*`. Raw xcresult bundles and full system screenshots remain on the Mac. Repository screenshots focus on the QA app rather than the device's personal Home screen.

## Android build and device ownership

Release build succeeded with installed Java 21. Initial build failed because Java was not on the remote shell's default path; the log is retained. Package is `com.designsbyfa.casitadex.refreshqa`, 0.1.0/code 1. Built APK SHA-256: `bcbfe8c27871d50782471914e4cc48ced2f0327e31168f7dd439d459335da561`.

The emulator initially contained APK `8a4961ab882dd841ab27f23f2a90745eab5f62b184654c65423f94f5b23c0545`; that APK was backed up before replacement. Another workflow subsequently installed its combined chooser/routing APK `3377b02981d10e5636344172c73e6405d9d646fcf3ae7d633b86650970586abc` while this workflow was active. That workflow's report records stopping device interaction after recognizing the collision. A notification check passed on the combined APK, but is explicitly excluded from acceptance of this batch's different APK. The combined APK was also preserved for restoration. The harness now checks the installed APK hash before and after the test. Separate chooser worktrees and uncommitted source were not modified.

Other Android harness failures: initial UIAutomator process exited 137; a subsequent keyboard-dismiss Back command opened discard protection. The corrected script uses the current ADB and validates native input directly without that unnecessary Back command. No failed attempt is counted as passing.

Samsung pre-update identity: `579bbc47c05127d66030a65aadc716a7e25fc9b1f5d2fbacad2c4745ca777beb`. Reminder counts before update: Upcoming 0, Overdue 4, Completed 0, Memory dates 13. Final exact-artifact emulator and Samsung results are recorded below when completed.

## Scope and remaining gates

Owner acceptance remains pending. This is actual notification delivery/routing verification, not a full repeat of the keyboard, photo, backup or accessibility sweeps. Linked-memory background/terminated combinations are not yet a complete cross-platform matrix. Figma visual language and Home → Photos → Reminders → Find remain unchanged by this test-only batch. No Figma mutation, household sharing, main merge, production release, purchase or store submission occurred.

## Exact Android artifact checkpoint

The routing-only APK passed actual background notification delivery, tap-to-exact-reminder and Cancel/Home on the emulator. The harness verifies APK SHA-256 before and after; both matched `bcbfe8c27871d50782471914e4cc48ced2f0327e31168f7dd439d459335da561`. The separately integrated chooser APK was then restored without data clear; restored hash `3377b02981d10e5636344172c73e6405d9d646fcf3ae7d633b86650970586abc` was verified. The emulator's final installed artifact therefore differs from the artifact tested in this batch.

After that emulator pass, the exact tested routing APK was installed on Samsung with `adb install -r`. Independent installed hash verification passed. All four reminder counts matched the pre-install values before creating the new QA reminder: Upcoming 0, Overdue 4, Completed 0, Memory dates 13. No uninstall/data-clear was used. These counts and the unchanged storage implementation support preservation, but are not a full database-content audit.

## Final Samsung and evidence results

Samsung **PASS**: actual background notification delivered; tap opened the exact marked reminder; Cancel and Home passed. Installed hash matched the tested APK before and after execution. Final reminder counts: Upcoming 0, Overdue 5, Completed 0, Memory dates 13, accounting for the one newly created QA reminder. The marked QA record was retained for inspection. Appearance and font-scale settings were not changed.

The tested APK is preserved on the Mac at `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/notification-routing-20261116/CasitaDex-refreshqa-593de3d.apk`. The emulator was restored to its combined chooser candidate; Samsung remains on the tested routing-only update.

The first passing iPhone background screenshot was captured during the launch transition and was clipped. The harness now captures after the animation-settling wait. One focused repeat passed (1/1) to provide settled evidence. This was a screenshot timing correction, not an application source change.

Automated source baseline remains **525 passed, 6 skipped, 0 failed**, TypeScript/ESLint passed at 593de3d (prior checkpoint, not rerun for these harness/evidence changes). Native totals by distinct requested scenario: physical iPhone **3/3**, exact-APK Android emulator **1/1**, Samsung **1/1**. Failed attempts and the unrelated combined-APK pass are separately documented above and in raw logs.

Next: coordinate one workflow per virtual/physical device; finish combined photo-chooser candidate acceptance without overwriting verified builds; complete remaining linked-memory lifecycle combinations, accessibility and owner sign-off. Household sharing remains deferred until corrections/native acceptance are complete.
