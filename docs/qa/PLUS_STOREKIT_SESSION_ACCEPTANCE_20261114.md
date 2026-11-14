# Local StoreKit session acceptance — November 14, 2026

## Verified on the Mac mini
Two hosted XCTest cases PASS against Apple's local StoreKit environment in the isolated com.designsbyfa.casitadex.plusstoreqa app. These call the actual PlusStoreReader, not a mocked purchase adapter.

| Scenario | Result |
| --- | --- |
| Load configured non-consumable and begin with free entitlement | PASS |
| Purchase returns completed; ownership verifies as Plus | PASS |
| Explicit AppStore.sync restore returns Plus | PASS |
| Refund eventually removes entitlement | PASS |
| Ask to Buy returns pending without granting Plus | PASS |
| Approve pending request; entitlement becomes Plus | PASS |
| Injected purchase error leaves entitlement free | PASS |
| Close actual Xcode purchase sheet; result cancelled, entitlement free | PASS |

## Evidence
- StoreKitSession-r4-summary.json: Passed, 1 case, 0 failures, 0 skipped. Job 539148d0c0df72dc exit 0.
- StoreKitSheet-r1-summary.json: Passed, 1 case, 0 failures, 0 skipped. Job ea749498062e40dd exit 0.
- native-gallery-evidence/plus-local-storekit-sheet.png shows Xcode, $19.99, and the explicit testing/no-charge notice. Closed using its X control.
- Full xcresults retained at /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-Plus-Window-20261114/StoreKitSession-r4.xcresult and StoreKitSheet-r1.xcresult.

## Harness and corrections
Added tests/storekit/CasitaDexPlus.storekit and PlusStoreSessionTests.swift, plus scripts/prepare-plus-store-tests.rb. The setup script creates a hosted test target only in the generated isolated project; the configuration is linked to its scheme and included in its test bundle. Use CocoaPods' installed xcodeproj gem with GEM_HOME=/opt/homebrew/Cellar/cocoapods/1.17.0_1/libexec and /opt/homebrew/opt/ruby/bin/ruby.

Run the generated PlusStoreSessionTests scheme with parallel testing disabled. Select PlusStoreSessionTests/PlusStoreSessionTests for automation. Select PlusStoreSessionTests/PlusStoreSheetTests with TEST_RUNNER_CASITADEX_INTERACTIVE_STOREKIT_QA=1 for interactive cancellation; otherwise that case skips explicitly. Use the established simulator-signing build flags. Each session clears only local simulated transactions and resets test settings in defer.

Initial harness attempts are not acceptance: a missing scheme reference caused an account prompt; it was cancelled without credentials. The first configured run queried refund/approval changes too quickly. Final tests wait up to five seconds for expected StoreKit entitlement changes. Injecting userCancelled produces StoreKit unknown on this SDK, so that tests failure without unlocking; actual sheet cancellation was verified separately. A lingering account prompt was dismissed before interacting with the clearly labeled Xcode sheet.

## Boundaries and next work
These tests compile the real Swift reader/policy into a hosted test bundle. They do not exercise the Expo-to-JavaScript bridge end to end or deliver app-wide Plus access. Production transaction observation, unfinished recovery, feature delivery and finish acknowledgement remain pending. The cancellation harness emits StoreKit's missing-listener/UI-anchor warnings; it still returned cancelled and free, but production observer and presentation integration are not qualified.

Public checkout remains disabled. No live purchase, account sign-in, store submission, accepted SB40 data modification, or repeated photo acceptance occurred. The isolated QA app was relaunched after testing.
