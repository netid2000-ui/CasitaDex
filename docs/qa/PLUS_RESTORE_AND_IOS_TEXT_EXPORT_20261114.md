# Plus restore and iOS text export — 2026-11-14

## Change
The native text-export implementation called Android Storage Access Framework on iOS. iOS now writes a private Documents file, verifies exact readback, then offers the selected file through the native share sheet. Verified output is retained on share cancellation/failure; incomplete local output is removed. Messages do not claim an external destination was saved merely because sharing returned. Both readable reports and limited JSON backups use this branch; Android retains its existing SAF implementation.

## Native acceptance on Mac mini
Isolated bundle com.designsbyfa.casitadex.plusstoreqa, simulator 879C620A-5318-4BDF-98B9-904EE635B053. Accepted SB40 untouched. Existing photo UI acceptance not repeated; no live purchase.

- Typecheck and targeted src/eng-runtime.native.ts lint passed. Native build succeeded (job 8526e0c42602dd95).
- Free readable text report opened the real iOS share sheet. Save to Files completed. External copy matched the private file byte for byte: 67,760 bytes. See IOS_TEXT_EXPORT_NATIVE_20261114.json and native-gallery-evidence/ios-free-text-report-share.png.
- Actual local StoreKit test ownership activated Plus; no entitlement override. Added an explicitly opted-in supervised restore session harness. Its 1/1 pass asserts ownership and supervisor completion only; independent checks below establish correctness.
- Shared the retained Full v4 backup from the app to On My iPhone through Save to Files. External archive matched private archive byte for byte.
- Choose backup opened the native picker. Selected the exported archive, reviewed Full v4 preview (90 memories, 3 saved media entries, no draft, zero standalone reminders), then explicitly confirmed replacement in the isolated QA collection.
- App displayed Full collection restored and verified. Durable SQLite revision advanced from 4 to 5. Data, draft, and save-attempt history matched the archive exactly. Previous-state recovery payload matched the pre-restore snapshot. Restored state remained identical after host-test termination and app relaunch.
- Figma checkpoint text 1006:17 reconciled.

Evidence: PLUS_RESTORE_NATIVE_20261114.json, PlusOwnedRestore-r1-summary.json, native-gallery-evidence/plus-owned-restore-preview.png, native-gallery-evidence/plus-owned-restore-success.png. Raw xcresult and before/after snapshots remain in QA-Evidence/CasitaDex-Plus-Window-20261114. Job 8ac5d63422a99861.

## Limits / next
This was a restore of the existing QA snapshot, not a fresh-phone migration or a different collection. It qualifies the paid native picker/preview/confirm and persistence path. Nonzero reminders, conflict cases and broader backup integrity have separate prior coverage; this run does not expand those claims. Cloud-provider delivery and physical-device acceptance remain pending.

Limited-text backup shares the corrected iOS writer but still needs its native preview/confirmation acceptance. Verified private text exports currently have no retained-file reshare list; users can regenerate the report if they dismiss sharing. Transaction delivery acknowledgement/finish and unfinished-transaction recovery remain pending. Public checkout remains disabled.
