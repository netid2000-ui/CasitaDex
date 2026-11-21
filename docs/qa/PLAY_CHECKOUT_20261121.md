# CasitaDex Plus Android checkout QA • November 21, 2026

FA-MAC-DEV-01 compiled the Play ownership module and assembled an arm64 QA APK for com.designsbyfa.casitadex, version 0.1.0 (1). APK SHA-256 is 1e7e0f883b3a83a58a266ddced490dace94d1b67ee0d43fc666429493c64f148.

The module connects checkout, restore, foreground ownership refresh and acknowledgement to the existing Plus controller and feature gates. It verifies the signed purchase payload for the app and Plus product before granting access. This is a local QA verifier. Production billing approval and production verification architecture remain separate.

The checkout build configuration requires CASITADEX_PLAY_TEST_PRODUCT_ID=com.designsbyfa.casitadex.plus and CASITADEX_PLAY_TEST_PUBLIC_KEY containing the app's Base64 Play licensing public key. This build omitted the key and keeps checkout disabled. Preserve the installed Samsung catalog QA package until store testing is available.

TypeScript, ESLint, native compilation and APK assembly passed. The existing suite passed 545, skipped 1 and failed 0. A separate JVM check accepted a synthetic valid signature and rejected an altered payload, an unrelated signing key and an empty signature.

The Designs by FA Console reported identity review pending. Outstanding device acceptance includes a license-tester checkout with Google's test payment method, cancellation, pending payment, ownership after relaunch, acknowledgement and restore. Verify the Play record and U.S. price of $25.99 before testing.
