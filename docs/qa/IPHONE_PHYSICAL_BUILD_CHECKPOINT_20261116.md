# Physical iPhone candidate checkpoint

November 16, 2026. Executed on FA-MAC-DEV-01 only.

- Source: application `f761bad`; current documentation checkpoint `1781c4f`.
- Connected physical device: iPhone 17 Pro Max, iOS 27.3 beta (24C5037i); Developer Mode enabled.
- Installed CasitaDex identities inspected: `com.designsbyfa.casitadex.sb29appfirstqa`, `.dev`, `.sb39qa`, all version 0.1.0/build 1. No `.plusstoreqa` candidate was installed.
- Attempted separate `.plusstoreqa` Debug device build with automatic development signing, team VSP8XSM3BK, using existing isolated iOS staging source and a separate DerivedData directory.
- Result: **BUILD FAILED before installation**.

Xcode reports:

1. PLA Update available: the developer account must agree to the latest Program License Agreement before membership resources can be accessed.
2. The fallback wildcard profile lacks Push Notifications capability and the `aps-environment` entitlement.

Required owner action: the Apple Developer Account Holder must review and accept the updated agreement at https://developer.apple.com/account/. Then automatic provisioning can be retried for this exact QA bundle, retaining the intended capabilities.

No agreement was accepted, entitlement removed, alternate installed bundle replaced, application installed, or device data changed. No physical acceptance is claimed. The Samsung installed build and prior simulator evidence remain as recorded in REMINDER_CONTROLS_FIX_20261116.md.

Build log: `evidence/iphone-physical-candidate-20261116-build.txt`.
Next: retry signed physical-device build after account agreement resolution, install the separate QA identity, verify launch/build identity, then execute IPHONE_OWNER_ACCEPTANCE_20261116.md with owner sign-off.
