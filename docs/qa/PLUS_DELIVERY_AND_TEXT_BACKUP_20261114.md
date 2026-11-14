# Local Plus delivery and limited-text backup — 2026-11-14

## Delivered
- Added a local-QA-only acknowledgement method. After shared JS ownership is ready/Plus, native code rechecks current ownership, enumerates unfinished transactions, and finishes only verified matching nonconsumables with expected product, bundle and Xcode environment, without revocation/upgrade. Production checkout and finishing remain disabled.
- Startup and foreground verified refreshes retry acknowledgement; overlapping work is coalesced, errors preserve ownership, stopped coordinators do not start more work. StoreKit is the source of truth, not a durable custom entitlement flag.
- Added DEBUG-only, explicit environment-based acknowledgement failure injection, restricted by local checkout policy. It never grants ownership. QA diagnostics now identify the process, preventing stale evidence from masquerading as a new launch.

Apple references: https://developer.apple.com/documentation/storekit/transaction/unfinished and https://developer.apple.com/documentation/storekit/transaction/finish() — finish after delivering access; unfinished enumeration supports retry. Production release still requires full feature delivery and separate sandbox qualification.

## Passed
- Typecheck and targeted changed-TypeScript lint. 16 focused tests: delivery coordinator, entitlement state and backup gates.
- PlusDelivery-r2: native local StoreKit purchase -> actual JS ready/Plus -> native finish. Positive finish count belongs to the current process; unfinished queue drained; repeat acknowledgement returned zero; ownership remained Plus; refund became Free; revoked ownership and production-environment finishing refused. 1/1 native test passed.
- Limited-text native preview disclosed 90 included written memories, 3 saved photos excluded, zero photo-only memories omitted. Confirm save opened iOS share sheet and Save to Files completed.
- 75,577-byte JSON independently parsed, matched createTextBackup(current snapshot), contained no media references, matched its external Files copy byte for byte. Source collection retained revision 5 and its 3 photos. See PLUS_TEXT_BACKUP_NATIVE_20261114.json and native-gallery-evidence/plus-text-backup-preview.png. Supervised session passed 1/1; separate assertions establish content correctness.

## Cold-start recovery is NOT accepted
- PlusRecoverySeed-r2 intentionally caused acknowledgement failure while real local ownership was Plus. Native enumeration confirmed one unfinished transaction.
- A separately launched PlusRecoveryColdStart-r2 retained ownership and reached ready/Plus, but failed the requirement that the new process actually finished a transaction (diagnostic finish PID/count remained zero). No positive recovery claim is made.
- The earlier r1 cold-start test was too weak: it could read a previous process status and accept an empty queue. Its apparent pass is superseded and is not acceptance evidence.
- Determine whether local StoreKit test-session teardown consumed the unfinished queue or app recovery missed delivery. Next verification should keep the StoreKit test session alive in a separate runner while terminating/relaunching only the app, and verify the same transaction identity and finishing event. Do not enable public finishing based on this checkpoint.

## Evidence and scope
All builds/tests on FA-MAC-DEV-01, isolated com.designsbyfa.casitadex.plusstoreqa. Accepted SB40 unchanged; no repeated photo UI acceptance, no live purchases. Figma status 1006:17 reconciled.

Native result summaries: PlusDelivery-r2-summary.json (passed), PlusTextBackup-r1-summary.json (passed), PlusRecoverySeed-r2-summary.json (passed), PlusRecoveryColdStart-r2-summary.json (failed, retained honestly). Raw xcresults: QA-Evidence/CasitaDex-Plus-Window-20261114. Jobs: a204ca39dd690d7b, 8eda812472d442a8, 0776d9519bef7ade, 43c5f5168cc1aaf3.

Remaining: cold-start recovery acceptance, production/sandbox purchase integration, full approved Plus delivery, Android monetization parity and physical-device acceptance. Limited-text export acceptance does not claim a new native limited-text restore run.
