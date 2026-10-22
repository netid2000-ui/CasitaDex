# CasitaDex — SOP v1.0 adoption gate
Date: 2026-10-21 | Status: IN PROGRESS, not owner acceptance

## Authority
- Approved: Warm Editorial A.2; Home/Memories/Photos/Reminders/Find; Home has Add Memory, Add Photo Memory, Add Reminder; no recent memories.
- Figma brand master: https://www.figma.com/design/PGhz4VYfakXbLh5BFev1PH
- Figma UI master: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
- SOP: docs/design/standards/SOP-v1.0-20261021/Designs_by_FA_Figma_to_App_SOP_v1.0.md (62 checks).
- Git: acceptance/eng-review-20261019 HEAD 0814c04; working tree dirty, preserve it.

## Verified source evidence
- [x] SOP present with 62 open checks.
- [x] Android review present: SB26_ANDROID_EDITORIAL_A2_EMULATOR_REVIEW_20261021.md.
- [x] Review records typecheck/lint PASS, 329 tests pass, 7 skip, 0 fail; emulator-5582 isolated visual review.
- [ ] Live Figma Apple/Android authorities and node IDs independently inspected.
- [ ] Five-screen Figma-to-native discrepancy ledger complete.
- [ ] Dark mode, large text, screen reader and physical iOS/Android acceptance complete.

## Open UX gates
- Home saved-draft protection may disable creation actions; owner UX review required.
- Photos gallery responsive and large-text review.
- Find results, no-match, keyboard and screen-reader review.
- Reminders collapsed management and clear create CTA review.
- Buttons: focus, pressed, loading, error, disabled, light/dark and contrast review.

## Execution order
Inspect Figma -> compare five frames with native -> prioritize discrepancies -> bounded isolated fixes -> automated and device QA -> owner review. Preserve Samsung and acceptance emulator-5580. QA APK is not a store release. No production authorization.

## Live Figma evidence — October 21
- UI/UX master pages verified: Apple authority 25:2; Android authority 25:30; shared components/tokens 28:2; iOS candidate 28:37; Android candidate 28:264.
- Brand master file verified and includes foundations, logo masters, export board, corrected icon QA and UI icon masters.
- Shared tokens page lists forest #174C38, cream #F7F2E8, card #FFFFFF, strong border #8CA393, primary text #173D2E, gold #C29A62 and dark background #103C30.
- iOS Home frame 28:38 and Android Home frame 28:265 have compact brand header placeholder awaiting original PNG; do not treat placeholder as final brand compliance.
- Apple authority page says official Apple kit activation/license acceptance needs user action. Android authority says Material 3 kit enabling remains outstanding. Neither is a verified imported library.
- Next gate: inspect remaining four screen frames and compare native screenshots, then resolve branding placeholder and platform kit limitations without unauthorized asset recreation.

## Five-screen Figma frame inventory — verified live
| Screen | iOS candidate frame | Android candidate frame |
|---|---|---|
| Home | 28:38 | 28:265 |
| Memories | 28:87 | 28:314 |
| Photos | 28:130 | 28:357 |
| Reminders | 28:175 | 28:402 |
| Find | 28:224 | 28:451 |

All 10 frames were located as top-level candidates in the respective Figma adaptation pages; each is explicitly marked as needing Apple kit or Material 3 validation. Each platform page contains five logo placements labeled awaiting original PNG. These are candidate frames, not native QA approval. Compare against actual isolated emulator screenshots before recording visual PASS.

## Implementation checkpoint — approved color header logo
- Updated src/brand.tsx and src/brand.web.tsx to select existing logo-color-light.png or logo-color-dark.png according to appearance; full artwork includes CasitaDex name.
- Both PNGs confirmed 480x416; displayed with matching aspect ratio and accessible label.
- npm run typecheck PASS and npm run lint PASS after source change.
- Native emulator screenshot comparison, full regression tests, and Figma candidate placeholder replacement remain OPEN. No APK build or production release claimed.

## Regression and device readiness checkpoint
- npm test: 336 total; 329 pass, 0 fail, 7 skipped (2026-10-21 run).
- Android SDK adb absolute path resolves; devices attached: Samsung R5GL83X0K3N, acceptance emulator-5580, isolated QA emulator-5582.
- Existing isolated APK C:\cdv2\android\app\build\outputs\apk\release\app-release.apk predates the approved-color-logo source edit; DO NOT use it as evidence that new logo rendered on device.
- Next gate: synchronize changed source into isolated build tree with preservation checks, rebuild internal QA APK, install ONLY on emulator-5582, then compare screenshots to Figma. No production or physical-device install.

## Build blocker — 2026-10-21
- Persistent job bff8ff0ffe3448bd exited 1 (BUILD FAILED). Native clang compiler explicitly reported No space left on device. Android lint and JS bundle also failed; root cause not yet isolated beyond storage pressure.
- Drive inspection: C: 0 GB free; E: ~1830.6 GB free; G: ~3696.9 GB free; H: ~992.21 GB free.
- No cleanup, relocation, install, or production action performed. Do not rerun build until a preservation-safe capacity plan is approved and verified.

## Preservation-first storage assessment
- Read-only directory sizes: C:\cdv2 ~7.59 GB, user Temp ~3.23 GB, Android SDK ~6.90 GB, Gradle cache ~0.83 GB, authoritative CasitaDex repository ~0.51 GB.
- Preferred remediation: copy isolated C:\cdv2 build workspace to a new E:\Designs-by-FA\Builds\CasitaDex QA directory, verify file counts and hashes of critical source/config/assets, then rebuild from E: with cache/temp relocation as needed. Preserve C:\cdv2 until verified; do not remove SDK, Gradle or temp files blindly.
- C: remains full. No cleanup or migration performed in this assessment.

## Isolated workspace preservation copy verified
- Robocopy job f9d3cd1e83cd009e ended with exit 1 (Robocopy success: files copied), 65,629 files / 7.589 GB, zero failed and zero mismatched.
- Source C:\cdv2 retained; destination E:\Designs-by-FA\Builds\CasitaDex-QA-20261021.
- SHA-256 matched on native/web brand components, both approved logo PNGs, gradlew.bat, package.json.
- C: free ~1.57 GB; E: free ~1822.83 GB. No deletion performed.
- Next gate: verify E: build viability and control Gradle/NDK/Metro temp/cache paths before attempting rebuild; source paths may be embedded in generated Android files.
