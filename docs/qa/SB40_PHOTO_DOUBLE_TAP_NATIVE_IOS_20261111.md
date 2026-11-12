# CasitaDex SB40 — Native Photo Double-Tap Acceptance, Isolated QA

Date: November 11, 2026 (America/Chicago)
Status: **iOS simulator scoped double-tap and zoom controls PASS**; entire photo feature and release remain **NO-GO**.

## Authority and scope
- Figma Page 49 gesture specification: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134
- Source branch: `work/cd-photo-gestures-20261111`, starting ref `b1b90e9515af225a1f8ac199648a622e22114480` plus this fix.
- Build host: FA-MAC-DEV-01 only, external SSD build root `Apple-Builds/CasitaDex/gesture-a1989d8-ios-qa`.
- iOS device: `879C620A-5318-4BDF-98B9-904EE635B053` — **CasitaDex FigmaFirst Isolated QA**, iOS 27.0.
- Installed bundle ID: `com.designsbyfa.casitadex.gestureqa` (not SB40, not main `.dev`).
- Release-simulator main.jsbundle SHA-256: `ac40d76bd10b5033750980f46731ddd79f3d559b2ba3b62f35b9124e1a0601cc`. No Metro required.
- Photo fixture: locally generated QA brand icon, saved as `Gesture QA Synthetic Brand Photo` on isolated simulator.

## Cause of failure, correction, and retest
- Prior builds `a1989d8`, `b1b90e9` and interim touch-end candidate failed true Maestro double tap (zoom remained 1×).
- Diagnosis from temporary QA-only UI instrumentation: both tap-end events reached view with valid origin and zero movement, but interval between taps was about 333 ms, exceeding previous 300-ms default.
- Fix: separate tap-start tracking from responder release, preserve pinch/pan suppression, widen same-location double-tap window to 450 ms; controls stay accessible. Removed temporary trace UI from source/build stage before release QA.
- Test: Maestro `doubleTapOn` on actual saved QA photo at 50%,65%, 100-ms configured delay. **PASS 1× → 2× → 1×**, independently confirmed with accessibility text assertions.
- Test: accessible Zoom In ×2 and Reset Zoom. **PASS 1× → 2× → 3× → 1×**.
- Code validation: `npm test` 602 total, **597 passed / 0 failed / 5 skipped**, TypeScript and ESLint both PASS. Five optional archive fixture skips are unrelated.

## Open gates and caveats
- Pinch gesture (real multitouch) and pan boundaries have source unit tests, but native gestures NOT YET ACCEPTED.
- Android emulator parity NOT TESTED. Physical Samsung and owner iPhone NOT TESTED.
- Existing older Photos tab in isolated source still deviates from accepted SB40 Photos design; do not promote this branch to the accepted build. In that older tab, View photo behavior remains an unresolved navigation concern; the tested viewer was entered via Find → saved Memory Details.
- Device data, source, native binary and QA image never touched the owner-accepted SB40 installation or production backend.
- Additional manual VoiceOver, large text, reduce-motion and five-photo viewer acceptance still OPEN.

## Evidence
Mac mini `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/gesture-a1989d8-native-20261111/`:
- `doubletap-450ms.log`: double-tap 1× → 2× → 1× PASS.
- `zoom-buttons-pass-450ms.log`: Zoom In and Reset PASS.
- `full-tests-450ms.log`: source regression results.
- Build logs and bundled artifact retained under external SSD build root.

Owner acceptance remains PENDING. No production or store authorization implied.
