# CasitaDex physical iPhone reminder workflow checkpoint

November 16, 2026 (America/Chicago). Execution exclusively on FA-MAC-DEV-01.

## Installed candidate

Physical iPhone 17 Pro Max, iOS 27.3 beta (24C5037i). CasitaDex Plus Store QA, `com.designsbyfa.casitadex.plusstoreqa`, version 0.1.0/build 1, signed source candidate `f761bad`. Initial workflow tests used that candidate. Actual notification testing then exposed a standalone reminder routing gap, corrected in source commit `593de3d`; a signed replacement of the same isolated QA identity is being verified below. Existing owner apps and data were not reset or replaced.

## Verified workflow results

- Linked QA reminder Save returned to the originating **[SAMPLE] Coffee filters** Memory Details. The screenshot was visually checked and shows the original title and Results return control.
- Changed date retained November 28, 2026 after Done.
- Exact time selection retained **3:49 PM** after Done in the strengthened physical test. Screenshot visually checked.
- Cancel after changing the draft showed discard protection; Discard changes returned successfully and Home remained reachable.
- Approved Home → Photos → Reminders → Find order remains visible in the evidence.

Initial workflow run: **2 passed, 0 failed, 0 skipped**. Its time assertion only checked a changed value and was insufficient for exact-minute acceptance. Screenshot review caught that limitation.

Exact-minute follow-up: first attempt **failed** because XCTest's single wheel adjustment stopped at an intermediate minute. A full-label experiment also **failed** because native XCTest accepts `49`, not `49 minutes`. The final harness waits for wheel animation and retries the requested value at most four times, verifies the wheel value, then asserts that the editor retains the exact minute. Final targeted run: **1 passed, 0 failed, 0 skipped**. Logs show intermediate 28, 41 and 44 minutes before reaching 49. This demonstrates why a changed-value-only assertion was unsafe; it is not proof that ordinary manual wheel interaction has a product defect.

## Notification test

Initial foreground notification attempt: **0 passed, 1 failed, 0 skipped**, no visible banner within the observation window. The original harness had not verified its final scheduled minute, so this result does not isolate permission, scheduling, delivery or routing as the cause. The strengthened retry verified its exact schedule, received a banner and tapped it, but failed the destination assertion: the app opened the general Reminders list instead of the exact standalone reminder. Source inspection confirmed the fallback always used `/reminders`. Commit `593de3d` routes an existing standalone reminder to `/reminders-manage` with its saved ID; linked-memory and missing-reminder fallback behavior are preserved. Four focused route regressions were added. TypeScript and ESLint passed; the full suite passed **525 tests, 6 skipped, 0 failed**. Signed native verification of the correction follows below.

## Evidence

- `evidence/iphone-physical-reminder-workflow-20261116.txt` and matching directory: two initial workflow tests, summary and screenshots.
- `evidence/iphone-physical-exact-picker-20261116.txt` and matching summary: failed exact selection.
- `evidence/iphone-physical-exact-picker-20261116-r2.txt` and matching summary: invalid native full-label experiment.
- `evidence/iphone-physical-exact-picker-20261116-r3.txt` and matching directory: successful exact selection and screenshots.
- `evidence/iphone-physical-notification-20261116.txt` and matching summary: initial notification failure.
- Raw xcresult bundles remain under `/Volumes/FA-Development/Designs-by-FA/Apple-Builds/`.

## Data and remaining acceptance

Clearly marked QA reminders were created in the isolated QA app, including the Coffee filters save-return reminder and foreground notification reminder(s). These were intentionally retained for inspection. Existing memories were not edited or deleted. This is not a full database integrity audit.

Owner acceptance remains **pending**. Background/terminated notification routing, linked-memory notification routing, enlarged physical text, VoiceOver and the remaining owner checklist are not covered by these tests. The source correction was typechecked, linted and regression-tested as recorded above. No release, store submission or main merge was performed.

## Corrected installed candidate

Signed build and signature verification succeeded; the same `.plusstoreqa` identity was updated in place, without uninstalling or clearing data. Installed source: **593de3d**. Embedded JavaScript bundle SHA-256: `8b182d8d065c9b4456e0c69cedea37e17b0ebdc0d10f0541336e235d6819f6ac`. Source staging hashes and install JSON are recorded in `evidence/iphone-reminder-routing-{source,install}-20261116.json`. The build remains 0.1.0/build 1, so use the source and bundle hash to distinguish this installation.

This routing change does not alter the approved Figma controls or four-tab navigation. No Figma design mutation was required; this is not a renewed full Figma audit. Android/Samsung have not received this new routing patch yet; their previously recorded installed APK identity remains unchanged.

Next batch: background and terminated-app notification taps, linked-memory notification taps, Android native verification of this shared routing patch, remaining physical accessibility and owner sign-off. Household sharing remains deferred.

## Final physical verification — corrected installed build

**2 passed, 0 failed, 0 skipped** on the physical iPhone after installation of source 593de3d.

- Real foreground notification delivered; tapping it opened the exact saved standalone reminder. The test asserts its title matches `QA iPhone foreground notification 20261116`, then Cancel returns successfully.
- Linked reminder Save regression passed again on the corrected build, returning to the originating sample memory.
- Summary, screenshots and full test log: `evidence/iphone-physical-notification-fixed-20261116/` and `evidence/iphone-physical-notification-fixed-20261116.txt`.

The earlier failed attempts remain recorded; none were relabeled as passes. Background/terminated and linked-memory notification taps remain separate outstanding cases. Owner acceptance remains Pending.
