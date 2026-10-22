# CasitaDex Cross-Device Physical QA Plan
Approved October 20, 2026. Simulator-first, physical acceptance second.

## Testing lanes
- Local Android emulator: rapid Development regression, synthetic sample data and accessibility.
- Samsung Remote Test Lab (https://developer.samsung.com/remote-test-lab): hosted real Samsung Galaxy devices for Android compatibility testing, including differing Galaxy S/A/Z sizes and form factors WHEN AVAILABLE. This is NOT an iPhone testing service.
- Owned Samsung Galaxy A16: final Android real-device acceptance and offline/persistence/media recovery; preserve current accepted data.
- Appetize with Expo EAS iOS simulator: iPhone-style simulator-first Development regression; proprietary external upload requires separate review/approval; EAS quota gate open.
- Physical iPhone: final iOS device-only camera/photo, VoiceOver, actual offline reboot durability, backup/share targets, performance and signed build QA.

## Samsung Remote Test Lab run matrix
Select up to three available representative Galaxy models: recent S slab, A midrange, Z foldable/flip. Record exact model, Android/One UI, screen size, reservation/session ID and APK SHA256. Test five tabs and three Home creation actions, memory edit/find/categories, photo attachment/view/zoom, reminders, light/dark, 130% text, offline behavior and app restart where supported, accessible labels and touch targets. Mark restricted lab functionality BLOCKED/NOT TESTED, never PASS by assumption.

## Privacy and acceptance
Use fictional sample data only; NEVER upload private backups, real household records, secrets or account credentials to shared hosted devices. Confirm lab terms, session limits and APK upload privacy before starting reservations. End sessions and clear disposable app data where platform permits. Log evidence/screenshots, outcomes PASS/FAIL/BLOCKED and defects without personal information. Hosted remote-lab success complements but does not replace owned Galaxy A16 and iPhone final acceptance.

No lab reservation, uploaded binary, hardware modification, purchase, repository commit or release authorized by this planning document. Originating CasitaDex chat remains command center.

## Hosted real-iPhone lab candidates (researched 2026-10-20)
- AWS Device Farm: browser-driven real iOS device remote access, IPA installation, screenshots/logs/network profile testing. One-time 1000 trial device-minutes advertised, then pay-as-you-go; never activate billable run without explicit approval. https://docs.aws.amazon.com/devicefarm/latest/developerguide/remote-access.html and https://aws.amazon.com/device-farm/pricing/
- BrowserStack App Live: interactive real-iPhone remote testing, upload IPA from PC or URL; trial limitations require verification. https://www.browserstack.com/docs/app-live/app-source/upload-apps
- Kobiton: real iOS devices, manual QA and VoiceOver testing; trial/pricing/cleanup require verification. https://docs.kobiton.com/manual-testing/
- Firebase Test Lab for iOS: automated XCTest / Game Loop / Robo matrix, rather than primary interactive manual testing. https://firebase.google.com/docs/test-lab/ios/get-started
Recommendation: first verify free/trial eligibility and security for AWS Device Farm and BrowserStack, evaluate Kobiton for VoiceOver. Never create paid subscription, upload proprietary IPA or start a session absent provider/privacy review. All hosted physical labs require compatible iOS device IPA, not simulator-only .app. Expo Free iOS cloud build quota blocked as of Oct 20, 2026; no iOS IPA produced yet. Hosted labs supplement, not replace owned physical iPhone acceptance.
