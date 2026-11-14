# Plus local purchase adapter — November 14, 2026

## Implemented
- Native purchaseForLocalTesting retrieves the configured non-consumable and maps completed/pending/cancelled outcomes. A successful result must pass StoreKit verification and the existing product/app/environment/revocation policy.
- Native checkout guard only permits Debug + Xcode environment + .plusstoreqa identity + local.casitadex.plus.qa. Production and Sandbox checkout are blocked independently of JavaScript.
- Dependency-injected TypeScript adapter validates native return values and connects to the existing controller. Completed purchase and restore require a separate verified-entitlement query. Invalid results/errors preserve the last verified state.
- Transactions are deliberately NOT finished because feature delivery is not wired. No public checkout connection or purchase call was made.

## Verification on FA-MAC-DEV-01
- 16 targeted JavaScript tests PASS (5 adapter, 8 policy/controller, 3 build configuration).
- 24 compiled Swift configuration/checkout assertions PASS: 12 release, 12 Debug. These do not call the store.
- Typecheck PASS; new adapter lint PASS.
- Full lint blocked by existing unused openFullScreenPhoto in src/eng-screens.tsx:52. That file was not changed.
- Full native simulator build PASS, job 79344ca78e8ebd6e, exit 0.
- Installed isolated com.designsbyfa.casitadex.plusstoreqa and launched PID 88105. No transaction acceptance claimed.

## Outstanding
- Instantiate native module in a local QA harness and provide a local StoreKit configuration/session.
- Exercise real local StoreKit success, pending approval, cancellation, restore and revocation.
- Deliver verified Plus access, observe transaction updates/unfinished recovery, and finish only after delivery.
- Wire production UI only after qualification; checkout remains disabled. Photo acceptance was not repeated; accepted SB40 app/data untouched.

Apple reference: https://developer.apple.com/documentation/storekit/transaction/finish()
