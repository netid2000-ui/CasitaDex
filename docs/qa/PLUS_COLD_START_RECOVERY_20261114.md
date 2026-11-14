# Local Plus cold-start recovery accepted — 2026-11-14

## Problem and fix
An interrupted local Plus purchase restored ownership after app restart but was not acknowledged by the new process. A separate UI test runner reproduced this while keeping the same StoreKit session alive, so the earlier result could not be dismissed solely as test-session teardown.

The module now retains verified transactions delivered by its observer until shared JavaScript ownership is ready/Plus. At acknowledgement it also obtains verified owned nonconsumable transaction handles from currentEntitlements, covering startup when updates/unfinished enumeration did not supply the needed handle. Native identity, environment, product type and revocation checks still apply. The acknowledgement queue deduplicates within the process; its IDs never authorize access. On a new process, an owned transaction can be acknowledged again after access is delivered. Production checkout and finishing remain disabled.

## Acceptance evidence
A separate XCTest UI runner holds one SKTestSession while terminating and relaunching only the isolated app. Its companion supervisor reads native diagnostics and releases stages only after exact transaction-ID and process-ID assertions pass. It does not grant entitlement or call finish itself.

- Seed transaction 15: app PID 99125 reported verified Plus, deferred acknowledgement, and transaction 15 present in verified unfinished transactions.
- App terminated; StoreKit session remained alive. New app PID 99184 reported verified Plus and a positive finish count containing transaction 15.
- The UI runner asserted there was still exactly one transaction with the same ID; no second purchase, restore sync, or synthetic entitlement was used.
- PlusRecoveryUI-r3 passed 1/1 native UI test; PlusRecoveryUI-r3-evidence.json records independent ID/PID assertions.
- PlusRecoveryRegression-r1 passed 2/2 native tests: normal delivery acknowledgement/idempotence/refund/production guard, and local purchase lifecycle with restore, delayed approval and injected error handling.
- git diff --check and supervisor syntax check passed. Swift changes compiled in both native targets.

Earlier UI r1/r2 runs observed missing acknowledgement and were cancelled after diagnosis; they are not completed passing XCTest runs. Their evidence JSON records the observed failure. The prior weak cross-session r1 result remains superseded. The stricter prior r2 failure is now resolved for the continuous-session local QA scenario.

## Reproduce
1. In the isolated generated QA worktree, run scripts/prepare-plus-recovery-ui-tests.rb once to create the separate UI runner target; the script refuses an existing target.
2. Run scheme PlusRecoveryUITests on the isolated simulator with the local StoreKit configuration and a unique xcresult path.
3. Once the runner reports the seed stage and native preferences report ready:plus/deferred IDs, run scripts/verify-plus-recovery-ui.py --simulator <QA UDID> --report <new evidence JSON> as a detached job. It can resume the restarted stage using the saved seed evidence.
4. Require both supervisor assertions and XCTest success. An empty unfinished queue or stale prior-process diagnostic is insufficient.

Raw evidence: QA-Evidence/CasitaDex-Plus-Window-20261114/PlusRecoveryUI-r3.xcresult and PlusRecoveryRegression-r1.xcresult. Jobs c341b00463088e03 (UI), 9216da02e5d65269 (supervisor), 623da14be3f683d7 (regression).

## Scope and next
Mac mini only; com.designsbyfa.casitadex.plusstoreqa; accepted SB40 untouched. No photo UI acceptance repeated, no live purchase, no release/store submission. Figma checkpoint 1006:17 updated.

This accepts local Xcode StoreKit recovery for the qualified QA delivery path, not production/sandbox rollout or the entire approved Plus feature set. Next: connect local purchase and Restore Purchases controls to the verified shared state in the QA interface; then qualify real store configuration, full Plus delivery, Android parity and physical-device acceptance.
