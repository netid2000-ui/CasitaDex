# CasitaDex — authoritative Mac integration status

Updated November 5, 2026 (America/Chicago). Authority: FA-MAC-DEV-01, FA-Development external SSD. Branch: `work/cd-sb41-edit-targeting-20261104`.

**WORK-SB81 · PARTIAL · release NO-GO.** Linked memory reminders are visible in Reminders and grouped by calendar date. Their rows open the exact saved memory. Source `63abf3e9d6636fdbc4f7df5d5feb4f23b3e0babf` was pushed to GitHub.

- **Verified source:** TypeScript, lint and 348 tests passed; five existing skips. Regression verifies active/archived/demo filtering and past-date visibility independent of alert scheduling.
- **Verified Android:** Exact debug-signed QA APK; fresh disposable device verified native memory Save, linked grouping, force-stop/relaunch rearming, cold-boot rearming before app launch, exact Details and completion cancellation.
- **Open:** Actual linked alert delivery and tap destination, permission recovery and reschedule, fresh iOS native acceptance, full photo/memory/backup journeys, both-platform accessibility, verified store purchases and signed distribution.
- **Design:** Figma `39uzN0SZX8nlmcGDcHdQhr`, linked reminders mapped to `276:3` and Details `257:2` / `257:25`. The linked list layout remains pending Figma reconciliation.
- **Next:** Verify linked delivery and destination, then carry exact-source Android and iOS through photo and backup/restore journeys. Owner retains final physical iPhone and release signoff.

See [WORK-SB81 execution and evidence](docs/qa/WORK_SB81_EXECUTION.md) and the [release functional architecture audit](docs/qa/CASITADEX_RELEASE_FUNCTIONAL_ARCHITECTURE_AUDIT.md).
