# Shared Plus ownership and delayed updates — November 14, 2026

## Implemented
- Expo native module listens to StoreKit Transaction.updates from creation and cancels its task on destruction. Matching-product updates are invalidation signals, not grants; JavaScript queries verified current entitlements.
- App root starts a shared ownership store on every route, including the full-screen viewer. It also refreshes on foreground return. Startup never invokes purchase or AppStore.sync.
- Coalesces events during verification and discards stale responses. Errors retain the last verified state; a confirmed free result removes Plus. Stopped/restarted sessions ignore old responses. Snapshots are immutable.
- Unsupported or unconfigured builds remain unavailable. No plan limits or paid feature gates have been activated.

## Actual native-to-JavaScript acceptance
StoreKitBridge-r2.xcresult PASS, one hosted test case, zero failures/skips; job ca6c92fecc3031e6 exit 0. The test exercised actual StoreKit approval/refund events through the native Expo module into the running JavaScript singleton. It asserted ready:plus after approval and ready:free after refund, using a Debug/local-QA-only diagnostic callback. Diagnostic values are never read as app authorization.

Observed JavaScript log transitions:
- ready free
- checking free → ready plus after delayed approval
- checking plus → ready free after refund

The existing local purchase/restore/refund/pending/error scenarios also passed in the same run. Previously accepted actual sheet cancellation was not repeated. Full result remains under /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-Plus-Window-20261114/StoreKitBridge-r2.xcresult; summary committed alongside this report.

## Other checks
19 targeted JavaScript tests PASS (6 shared-state, 5 native-adapter, 8 policy/controller). Typecheck and lint for all changed TS/TSX files PASS. Full native build PASS after qualifying StoreKit.Transaction to resolve the Expo/SwiftUI name collision. The previously recorded unrelated full-lint warning remains outside this change.

## Remaining
Shared verified ownership is now connected, but paid feature delivery, UI ownership presentation, unfinished transaction recovery/acknowledgement, and finish-after-delivery remain to be implemented. No transaction is prematurely finished. Public checkout remains disabled. No live purchases, accepted-app data changes, or repeated photo acceptance.
