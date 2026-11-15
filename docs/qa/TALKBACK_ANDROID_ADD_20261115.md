# Android accessibility checkpoint · 2026-11-15

## Scope and result

On disposable emulator-5554, existing synthetic Refresh QA Home was inspected with TalkBack 16.0.0.738667889 (60149341). The real TalkBack developer Display speech output overlay showed “CasitaDex logo, go to Home”, “Add Memory”, and “Add Photo Memory” during keyboard Tab focus changes. Retained screenshots show focus and actual output, not inferred accessibility labels. No photo control was activated or photo workflow retested.

- [Add Memory speech output](evidence/accessibility-gates-20261115/talkback-add-memory.png)
- [Add Photo Memory label only](evidence/accessibility-gates-20261115/talkback-add-photo-label.png)

Injected right swipes and Alt+Right did not visibly advance focus. This is scoped keyboard-focus speech-output evidence, NOT a touch-traversal, activation, audible-quality or full TalkBack acceptance pass. Other captured screenshots were not individually verified and do not expand these claims.

## Maximum-text Android parity: blocked before installation

Built a separate empty QA identity, `com.designsbyfa.casitadex.accessibilityqa`, with the maximum-text optional-field correction from source commit f9d5a34. Existing staging was copied to a new staging directory; parityQaSeed disabled. Existing packages were not replaced. Gradle arm64 release build succeeded in 1m 27s (701 tasks). APK manifest independently confirms the new package identity. APK SHA-256: `e7ec8fe42d6a356a3b5cb04ad6aa6256aff065806ec876cca145fb5cccb29d71`.

Installation returned `INSTALL_FAILED_INSUFFICIENT_STORAGE: Failed to override installation location`. `/data` has 365 MB available of 5.8 GB, 94% used. Subsequent package-path lookup returned no installed accessibilityqa package. No existing packages or records were deleted, cleared, or overwritten. Native Android verification of Reference wrapping and Location reachability remains OPEN. Build success alone does not close it. Next safe route is a separately provisioned disposable emulator with sufficient storage, not deleting accepted installs.

## Cleanup verified

Display speech output restored OFF via TalkBack preferences and switch state verified. Enabled accessibility services is `null`; accessibility_enabled is `0`; font_scale is unchanged at `1.0`. Existing Refresh QA returned to Home. No production, purchase, release or remote push occurred.

Build logs and original diagnostic captures are retained on the Mac QA evidence volume under CasitaDex-Add-Accessibility-20261115. This checkpoint is local evidence only while publication approval is pending.

## Follow-up: storage resolved; partial native parity verified

A new disposable AVD `casitadex_accessibility_20261115` was created using only the established medium-phone hardware configuration and installed system image, with a fresh 12 GB data partition. No existing userdata was copied or deleted. The original medium_phone was stopped before starting the new device; only one Android emulator ran at a time. New device reported 11 GB free. The new accessibilityqa package installed successfully.

At Android font_scale 2.0: Light Location, Notes and Reference open/Done controls were reachable and exercised; fixed Save/Cancel were reachable (Save correctly disabled on empty form). [Visually inspected native screenshot](evidence/accessibility-gates-20261115/android-2x-light-reference.png) confirms unbroken Reference label with Edit below. Dark Location open/Done passed. Subsequent Dark Notes/Reference checks were interrupted by ADB/UIAutomator transport failures, including exit 255. Resume attempts encountered stale route state and another transport failure. No full Dark parity pass is claimed.

No values were entered, records saved or photo controls activated. Keyboard/value/save behavior is outside this check. The screenshot also shows crowded bottom navigation labels at 2×; this narrow optional-field fix is not a claim that all maximum-text layout is accepted.

ADB initially crashed using libusb; the alternative backend recovered connectivity but interruptions persisted. New QA font_scale restored to 1.0 and enabled_accessibility_services verified null before shutdown. Final QA theme restoration could not be verified after the last transport failure; only the new disposable app may retain Dark. Original emulator data and theme were untouched. Original medium_phone restarted after new emulator stopped.
