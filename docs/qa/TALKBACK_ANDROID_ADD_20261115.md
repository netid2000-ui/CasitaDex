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
