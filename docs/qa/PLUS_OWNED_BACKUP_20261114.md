# Plus owned backup checkpoint — 2026-11-14

Mac mini only. Isolated com.designsbyfa.casitadex.plusstoreqa; accepted SB40 unchanged. No live purchase or repeated photo acceptance.

## Passed
- Added explicitly opted-in PlusBackupAccessTests.testOwnedBackupExport using an actual local SKTestSession transaction, not an entitlement override.
- Native ownership and actual JS bridge both reported Plus.
- Tapped Save full backup in the native app; new retained archive created. XCTest 1/1 passed, zero failures (PlusOwnedBackup-r1-summary.json).
- Independently opened the resulting archive using production openEngStreamCompatible and read its media entries: Full v4, 132,183 bytes, 90 QA memories, 3 media entries, zero standalone reminders. Digest/counts in PlusOwnedBackup-r1-archive.json. This validates the export artifact; it is not another photo UI acceptance run.
- Local StoreKit session clears its test transactions on completion. No production checkout enabled.
- Figma status text 1006:17 reconciled with this checkpoint.

## Limits and next work
- Test detects a new file and asserts nonempty output/actual JS ownership; the separate parser check validates this run's artifact. Do not treat the XCTest alone as full archive validation.
- External Files/cloud destination completion has not been accepted. XCTest completion terminates its hosted app after observing the retained file; a completed external copy is not claimed.
- Paid restore through picker, preview, confirmation and durable readback remains pending.
- Transaction delivery acknowledgement/finish and unfinished-transaction recovery remain pending.
- Source inspection also identified iOS text-report export using the Android SAF path; reproduce and correct in the next backup batch.

Evidence: QA-Evidence/CasitaDex-Plus-Window-20261114/PlusOwnedBackup-r1.xcresult. Remote job db3bb824b9a42d9c. Native app relaunched after the test.
