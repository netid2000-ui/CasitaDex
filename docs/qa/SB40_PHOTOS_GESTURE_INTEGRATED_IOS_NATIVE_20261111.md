# CasitaDex SB40 — Integrated Photos Native iOS QA Checkpoint

Date: November 11, 2026 (America/Chicago)
Result: **Isolated iOS Release build, installation and approved Photos workspace smoke PASS; full gesture integration native acceptance still OPEN.**

## Authority and provenance
- Source branch `work/cd-sb40-photo-gesture-integration-20261111`; implementation commit `1ec4b7ff3bb15e363e0c25944312754852cff537`.
- Accepted SB40 source base `35e411eeb3757486b7a64432b6ecb24c9faf4823`.
- Native execution host FA-MAC-DEV-01; external SSD build root `Apple-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/`.
- Release simulator app ID **`com.designsbyfa.casitadex.sb40gestureqa`**, not accepted SB40 and not the previous `gestureqa`.
- Bundled Release JS SHA-256 `fa7cc59d9d854d0b73b22674b5dc33f815e1351f097ab77c4bef04f70ef20587`.
- iOS simulator `879C620A-5318-4BDF-98B9-904EE635B053`, iOS 27.0, isolated QA device. Existing owner-accepted SB40 app and data not touched.
- Figma corrected SB40 page 47 and gesture review board `1018:134` remain design references; owner has not approved the integration yet.

## Native results
- PASS: Expo native project generation; CocoaPods installation; Xcode Release simulator build with embedded JavaScript; verified bundle ID and bundle checksum; installed and launched QA app on dedicated simulator.
- PASS: Home four primary tabs Home, Photos, Reminders, Find and accepted `The details that matter.` home.
- PASS: Photos tab shows **`Your Photos`**, `View and manage memory photos.`, Add Photo Memory, Grid photo view, Compact photo view, Recently updated, Recently added, and three synthetic/sample photo memories. It does **not** show older `Photos with a purpose.` screen.
- PASS: open sample photo from approved gallery into `PhotoMemoryViewer`. Close, Previous, Next, Reset photo zoom, Manage photos controls visible in native accessibility tree.
- PASS: Expand `Manage photos`, then scroll inside its lower control panel. Replace this photo, Remove this photo, Current cover photo, Move photo earlier, Move photo later all become visible and accessible.
- PASS: Close photo returns to `Your Photos` workspace, Grid view offered and Compact photo view action works; Recently updated remains visible.
- Initial Maestro `scrollUntilVisible` failed to expose Replace because swipe target was outside the short nested control panel. Native direct swipe within lower viewer controls proved they are reachable. Do not classify as an app missing-control failure.

## Source and test results
- Integration source testing: `npm test` 435 total / 429 pass / 0 fail / 6 skipped; typecheck PASS; modified-file ESLint PASS; git whitespace validation PASS.
- The accepted source has an existing unused-function warning in untouched `src/eng-screens.tsx` that prevents repository-wide zero-warning lint; not introduced by this integration.
- The source preserves approved `FigmaPhotos`, `PhotoWorkspaceControls`, gallery scroll anchor, cover/reorder/remove/replace, and associated-memory navigation. Additional safeguards added in `photo-memory-viewer.tsx` and `photo-zoom.ts`.

## Explicit open gates
- This integrated build has not yet executed an end-to-end native **pinch, double-tap, bounded pan, base-zoom swipe** regression. Previous gesture-branch results apply to DIFFERENT source and must not be relabeled as integrated native PASS.
- The integrated build has not yet been built/installed/tested on Android emulator. Do so after this iOS checkpoint without altering the accepted SB40 package.
- Large text and VoiceOver/TalkBack, five distinct photos, sort/view preference persistence, media error paths, cover/reorder persistence and offline/relaunch acceptance need separate tests.
- Owner Figma design signoff pending; accepted SB40 binaries and user data preserved. No release merges, store submissions, production backend writes, live purchases or physical-device deployment authorized.

## Evidence on Mac SSD
`/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/`
- `native-ios-home.json`, `ios-photos-layout.json`, `ios-photos-layout.log`, `ios-gallery-manage-direct-swipe.json`, `ios-gallery-management-success.log`.
- Native isolated build logs: `Apple-Builds/CasitaDex/SB40-GestureIntegration-1ec4b7f/prebuild.log`, `pods.log`, `ios-release.log`.
