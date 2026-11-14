# Native StoreKit verification reader — November 14, 2026

Implemented local Expo Apple module CasitaDexPlusStore with catalog, verifiedEntitlement and explicit-user-action restore methods. StoreKit currentEntitlements is the ownership source, not an exported backup flag or JavaScript purchase callback. Reader checks verified status, expected product and bundle, non-consumable type, environment, revocation and upgrade. Invalid verification throws so a caller can preserve its last verified state rather than treating a verification failure as an authoritative loss of ownership. StoreKit owns transaction persistence; no independent unverified entitlement cache was introduced.

Configuration requires native Info.plist CasitaDexPlusProductID and CasitaDexPlusStoreEnvironment. They are deliberately absent from current app config. Xcode local environment is permitted only under DEBUG with a bundle ending .plusstoreqa; release configuration rejects it. Production/sandbox remain distinct configured environments. Catalog returns StoreKit displayPrice instead of an invented localized price. Restore invokes AppStore.sync only through its explicit method; it is not run at startup.

Executed only on FA-MAC-DEV-01:
- Swift StoreKit reader/policy typecheck against real iPhoneSimulator27.2 SDK, arm64 iOS16.4 minimum: PASS, release and DEBUG.
- Compiled/executed native transaction policy: 8 assertions PASS.
- Compiled/executed native Bundle configuration guard tests: 7 assertions PASS each in release and DEBUG (14 total).
- Expo Apple autolinking resolve --json discovers CasitaDexPlusStore pod and CasitaDexPlusStoreModule.

Boundary: Expo bridge wrapper not yet compiled into a full native app. Existing JS-only QA shell cannot acquire a new native module. No signed transaction, StoreKit payment sheet, .storekit configuration session, sandbox account, purchase, restore authentication or physical-device test was run. No product ID/catalog configured in a store. Checkout intentionally absent; transaction delivery/finishing, update listener, foreground refresh, JS adapter wiring and full native build remain next. Android adapter remains pending. Plus preview stays disabled and unchanged. This is native verification-source progress, not purchase readiness.

References consulted:
- https://developer.apple.com/documentation/storekit/transaction/currententitlements
- https://developer.apple.com/documentation/storekit/verificationresult
- https://developer.apple.com/documentation/storekit/appstore/sync()
- https://developer.apple.com/documentation/Xcode/setting-up-storekit-testing-in-xcode
