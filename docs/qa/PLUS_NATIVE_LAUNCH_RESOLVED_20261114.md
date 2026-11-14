# Plus native launch resolved — 2026-11-14

Supersedes the launch blocker in PLUS_NATIVE_BUILD_20261114.md.

## Result
Full native Debug simulator build and standalone launch PASS on FA-MAC-DEV-01. Home → Settings → CasitaDex Plus verified visibly in Device Hub. The app uses its own embedded JavaScript. The preview still disables checkout.

## Correction
Use Xcode signing during the build: CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=- DEVELOPMENT_TEAM=VSP8XSM3BK. Xcode generates a separate simulated-entitlements file with application-identifier and development APS environment, while the host signature uses an empty entitlement dictionary. Earlier builds disabled this step; manually adding restricted entitlements to the host signature was incorrect.

Added scripts/build-plus-store-native-qa.py to preserve the exact simulator build flags and invoke the existing embedded-bundle preparation. Accepts simulator ID, derived-data path and development team explicitly. No production signing or security-policy changes.

## Evidence
- Build job 7fdfd05d8faa4231: exit 0, BUILD SUCCEEDED.
- Installed only com.designsbyfa.casitadex.plusstoreqa on simulator 879C620A-5318-4BDF-98B9-904EE635B053; launch PID 54763.
- No KEYCHAIN/Error entries returned in the scoped process log check after navigation.
- Screenshot: native-gallery-evidence/plus-native-signed-launch.png.
- Generated CasitaDexPlusStoreQA.app-Simulated.xcent contains VSP8XSM3BK.com.designsbyfa.casitadex.plusstoreqa; host .xcent is empty.

## Remaining
Native purchase, transaction listener/finish, JavaScript adapter wiring and local StoreKit session testing are pending. Launch acceptance does not establish transaction acceptance. No purchases performed; accepted SB40 app/data untouched; completed photo acceptance not repeated.
