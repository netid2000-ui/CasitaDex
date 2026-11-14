# Plus native build checkpoint — 2026-11-14

Status: native compilation PASS; standalone native launch acceptance BLOCKED.

## Changes
- Added exclusive CASITADEX_PLUS_STORE_QA identity: com.designsbyfa.casitadex.plusstoreqa, local.casitadex.plus.qa product, Xcode environment.
- Ordinary QA/default builds do not receive StoreKit configuration. Production remains blocked.
- Added a guarded preparation script for the generated isolated iOS project. It embeds production-mode JavaScript in a Debug native shell and loads that exact bundle, avoiding another worktree's Metro server. Debug native configuration is required for the local Xcode StoreKit environment guard.

## Verification
- Three actual app.config.js configuration tests PASS.
- Full xcodebuild Debug iphonesimulator compilation PASS on FA-MAC-DEV-01, including CasitaDexPlusStore Expo module. Generated ExpoModulesProvider imports and registers the module; compiled debug dylib contains module symbols.
- Separate detached build worktree: ../plus-store-native-qa-20261114 (base 9686cb1 plus QA config and generated preparation).
- Derived data: /Volumes/FA-Development/Designs-by-FA/Apple-Builds/CasitaDex-Plus-Store-Native-20261114.
- Final successful build job: 088de1cf8ae4cf88 (exit 0). Original native compilation: 86807057ddb321b4 (exit 0).
- Bundled app code present. Initial Debug bundle skipped; corrected using .xcode.env.updates. Development JS caused embedded devtools websocket error; --dev false corrected that error.

## Blocking evidence
Standalone launch subsequently reports expo-notifications ERR_NOTIFICATIONS_KEYCHAIN_ACCESS: required entitlement missing. Manual ad-hoc entitlements were rejected by AMFI as restricted; a development signing trial also failed launch. Trials were reverted to ad-hoc signing with empty entitlements. No keychain/security policy was relaxed. Native launch acceptance is NOT passed.

Previous working com.designsbyfa.casitadex.pluswindowqa was brought back to foreground. Accepted SB40 app and its data were not modified. Completed photo acceptance was not repeated.

## Next
Resolve the isolated simulator signing/keychain configuration. Then connect the JavaScript adapter, implement purchase/transaction updates/finish, create local StoreKit test configuration and exercise purchase/pending/cancel/restore/revocation. These transaction tests have NOT been performed. Checkout remains disabled and free-limit enforcement remains inactive.

Figma status board 1006:17 records compilation and launch blocker separately; approved offer frame 1266:2 unchanged.
