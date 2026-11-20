# CasitaDex Plus store preflight — November 19, 2026

The approved US price is $25.99 once. The existing Xcode StoreKit configuration tests the offer locally. Store catalog pricing and store-backed transactions remain unverified.

## Android observations on FA-MAC-DEV-01

ADB reported both devices connected. The Play Store package was enabled on both. Installed-package inspection returned the following results.

| Device | Installed CasitaDex package suffixes | App version | Packages declaring com.android.vending.BILLING |
| --- | --- | --- | --- |
| Android emulator, emulator-5554 | accessibilityqa, refreshqa | 0.1.0 | 0 of 2 |
| Samsung Galaxy A16 5G | dev, refreshqa, sb32qa, staging | 0.1.0 | 0 of 4 |

All listed packages have the prefix com.designsbyfa.casitadex. Each reported a null installer. The source at 9d98eb2 registers the Plus store module for Apple only. The Android checkout and restore adapter still needs implementation. The installed packages were inspected in place.

## Store account checkpoint

Safari on the Mac mini showed the Google Play Console page titled “Creating a developer account”. App Store Connect opened, but the accessible page text did not show CasitaDex. Neither session yielded an app record, product ID or price. These observations do not establish whether a developer account or product exists.

Use the intended developer accounts to identify the app records and their registered identifiers. Match the Android billing build to the Play package, verify the one-time Plus catalog price, then exercise a test purchase and restore. Keep the local Xcode, Apple sandbox and Google Play license-test results separate.
