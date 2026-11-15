# Native iOS theme acceptance — November 14, 2026
## Result
PASS: one focused XCTest, zero failures, 12 rendered appearance checks on the isolated iPhone 18 Pro simulator (iOS 27.0), executed on FA-MAC-DEV-01.
This validates the existing QA implementation, not the pending Figma visual refresh or Android/physical-device parity.

## Verified cases
- System follows device light and dark while foregrounded.
- System follows a device-theme change while backgrounded, after returning to the app.
- Explicit Dark remains dark with a light or dark device theme.
- Explicit Light remains light with a dark or light device theme.
- Dark, Light and System preferences survive app termination/relaunch.
- System still follows the device after restart.
- Original preference (System) restored.

The UI test checks selected controls and samples rendered screenshot pixels against the app's semantic light/dark background colors. Each phase retains an XCTest screenshot. Light/dark screenshots were also visually inspected.

## Data preservation
Both complete eng_state_v2 payload hashes matched before/after:
- Original QA: 90 memories; d6ba01f3dfa95a06097d58870a686f85bb2c3373ecc430e20602df3ac3bf93c0.
- Disposable QA: 19 memories; 4ff5bd1002afdd5faa15737fc0fd61ef5351c7de031ca6c11f6f2d3d24d5d0e2.

No photo acceptance was repeated. No application source or accepted SB40 build was changed.

## Harness notes
- Initial supervisor setup attempted to resolve a shutdown simulator's container and stopped before testing. The setup was corrected.
- The successful UI run was Theme-r2. Its post-run wrapper encountered a moved data-container path after Xcode installation; the preservation check was completed separately using bundle metadata and passed. The wrapper cache was corrected without rerunning the successful UI test.
- Xcode emitted a thread QoS runtime warning; zero test failures.
- Device Hub replaces the unavailable Simulator application name on this Mac.
- The disposable simulator was shut down; the original QA simulator was restored.

## Evidence
Repository evidence: docs/qa/evidence/native-theme-20261114/
Raw result: /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-Plus-Window-20261114/Theme-r2/Theme.xcresult
Test: tests/storekit/PlusRecoveryUITests.swift, testNativeThemeSwitching
Supervisor: scripts/verify-native-theme.py

## Remaining work
Complete owner design review, then apply the approved Figma look and accepted Home/Find/Photos/Settings navigation to an isolated implementation branch. Recheck theme integration after that change, followed by Android and physical-device acceptance. This checkpoint is not a release approval.
