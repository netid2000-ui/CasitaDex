# Android native restore and strict OS-offline acceptance

Date: November 6, 2026. Bounded emulator-only PASS. Overall release remains NO-GO.

## Exact target and artifacts
- Android API 35 isolated emulator; virtual identity verified. No physical-device acceptance.
- Actual restore: source bb235cdf6f2bba63b1760038a379a2c09cdf32ab, APK SHA-256 41518e7db8705aec54f66668831097f97e6a052234b34e4295477609fd5e4456.
- Preserving upgrade and offline checks: source 5dc930e280b43e9ffe5553a8c5c63fc6aa86eacb, APK SHA-256 1d7ebf35cf1e90c5d0df8952bf4ad845bcdb8778c26ee6965fc7ef47e2a9706e.
- Package com.designsbyfa.casitadex.dev. Signer SHA-256 fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c, unchanged across upgrade. Development identity, nondebuggable Release QA artifact, not a store release.

## Actual native restore PASS
A complete stopped-process recovery copy retained SQLite, WAL and all app files. SQLite integrity was OK. A fresh native Full v4 export matched current revision 14, collection, draft, standalone reminder and photo bytes before replacement. The previous revision-13 archive was not reused.

Native review showed 1 memory, 0 saved photos, 1 unfinished draft, 1 draft photo and 1 standalone reminder. The backed-up draft was explicitly selected, replacement confirmed and the app reported “Full collection restored and verified.” Semantic equality, reminder rows and media hashes passed after restore and relaunch. Technical revisions advanced to 15 and 16 without content changes. The native photo rendered and the reminder date/time remained intact.

Fresh restore archive SHA-256: 42bea3491d6d43908afcfd9fd697677c1811d9f426674a89c156032317a9f2e7.

## Preserving current-artifact upgrade PASS
The exact new APK was verified against the builder receipt and same package/signer. A separate pre-upgrade recovery snapshot and old installed APK were retained. Installation used only adb install -r. Full semantic state, reminder rows and media bytes matched before first launch and after launch. No uninstall, reset or AVD restart occurred.

## Strict OS-offline acceptance PASS
Only this emulator’s airplane mode, virtual Wi-Fi and mobile data changed. A try/finally controller and independent watchdog bounded restoration.

- Original settings: airplane 0, Wi-Fi 1, mobile data 1.
- Offline settings: airplane 1, Wi-Fi 0, mobile data 0.
- Actual proof: no default network, no route, both virtual interfaces DOWN, and HTTP plus two IP controls reported Network unreachable. The same HTTP target returned a real response before and after the outage.
- Offline Find opened the existing saved answer.
- The original draft photo remained visible. One additional synthetic photo attachment was added and rendered without replacing the original photo or draft text.
- Full v4 native export succeeded through Android SAF in the existing scoped Documents folder.
- Relaunch while offline retained the saved collection, original draft text/identity, both photo files and standalone reminder. Full logical/media checks passed.
- Settings restored in 277.264 seconds. Actual network return verified in 280.800 seconds. Both virtual Wi-Fi and cellular connectivity were subsequently verified, and host HTTP/AI Commander remained functional.
- The independent watchdog verified controller restoration and exited successfully.

Offline archive SHA-256: 82cbc2865e26c5e6c676e42c78d6f65c4217ab1233a8f4f7a404dbf1d9c8509e. Its decoded Full v4 payload and both embedded media bytes match the post-reconnect native state.

## Preserved current state
Final app route Home. One saved memory, one unfinished draft with TWO synthetic photos, one standalone reminder. Engine revision 21, draft checkpoint 39. All original fixture data remains. Do not restore an earlier one-photo archive over this newer state without new authorization.

## Limits and retained evidence
No iOS, physical phone, host network, production, store, source, build or dependency changes were performed by this acceptance task. No notification-delivery, corruption-import or previous-save recovery-button claim. No broad regression suite was repeated.

Evidence directory: QA-Evidence/WORK-SB121/android-offline-restore-bb235cd-20261106.
Primary receipts: native-restore-receipt.json, preserving-upgrade-receipt.json, android-offline-restore-acceptance.json, radios-final.json, offline-export-equality.json and post-reconnect-preservation.json. Private synthetic snapshots, complete recovery tar files, native screenshots/XML and exact APK copies remain on the external SSD. Only this sanitized summary and checksum manifest should be published.

Verified receipt hashes and artifact attribution: [manifest](SB121_ANDROID_NATIVE_RESTORE_OFFLINE_MANIFEST.json).
