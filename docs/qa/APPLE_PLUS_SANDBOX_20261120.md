# Apple sandbox iPhone checkpoint

App Store Connect lists CasitaDex Plus as a non-consumable with product ID `com.designsbyfa.casitadex.plus`. Owner pricing evidence shows USD 25.99 in the US. The December 3 regional adjustment excludes the US.

On FA-MAC-DEV-01, generated the iOS project with CASITADEX_APPLE_SANDBOX=1, installed pods, and ran scripts/prepare-plus-store-native-qa.py. Built the Debug device app with the development team and an embedded JS bundle. Verified the signature, bundle identifier com.designsbyfa.casitadex, Plus product identifier and Sandbox environment before installation. The iPhone 17 Pro Max had no prior installation at that bundle identifier. Device Control confirmed installation and process launch.

TypeScript and ESLint passed. The JS suite passed 545 tests with one skipped and zero failures. The native StoreKit configuration assertions passed in Debug and release configurations.

Device catalog response, on-screen price, authenticated sandbox purchase, entitlement delivery, fresh-install restore, and owner acceptance remain pending. An Xcode-local transaction is tracked separately from an Apple sandbox transaction.
