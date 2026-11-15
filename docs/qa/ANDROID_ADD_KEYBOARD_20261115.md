# Android Add keyboard visibility · 2026-11-15

## Reproduced defect and correction

On the fresh disposable accessibilityqa package at Android font_scale 2.0 with onscreen keyboard enabled, Description and Location accepted synthetic draft text but remained obscured by the keyboard. Before: [Description](evidence/accessibility-gates-20261115/keyboard-description.png), [Location](evidence/accessibility-gates-20261115/keyboard-location.png). Native hierarchy confirmed focused Location at y1915–2089 while keyboard began around y1517.

Add now opts into Android-only keyboard handling in Page. A temporary bottom content inset makes room to scroll, and the focused input is measured in window coordinates against keyboard screenY. Only positive overlap is scrolled away, with 24 logical points clearance. Keyboard listeners are removed on unmount; keyboard hide clears the inset. iOS remains on its existing automatic-inset path. An initial use of the RN scroll responder helper was rejected after screenshots still showed occlusion: that helper assumes a fullscreen scroll view, whereas Add has fixed actions above it.

After on the same preserved synthetic draft: [Description](evidence/accessibility-gates-20261115/keyboard-fixed-r2-description.png), [Location](evidence/accessibility-gates-20261115/keyboard-fixed-r2-location.png). Visually inspected full input/value/caret above keyboard. Native bounds: Description y1253–1454, Location y1283–1457, keyboard top about1517. Fixed Save/Cancel remain visible. No Save or photo operation occurred. Earlier interrupted title injection produced a duplicated synthetic title; it was retained rather than clearing the draft. Description and Location values remained unchanged through rebuild/install updates.

## Verification boundary

- Native scoped Android Light 2× Description/Location focus reveal: PASS.
- TypeScript and touched-file ESLint: PASS.
- Source suite: 495 pass, 6 existing skips, 0 failures.
- Fresh iOS native regression: NOT RUN for this correction; Android-only guards/source checks are not an iOS native pass.
- Other fields, Dark keyboard behavior, hardware keyboards, orientation changes, full keyboard workflow/save, and TalkBack touch traversal remain outside this checkpoint. Existing no-keyboard Light/Dark optional-field results are separate.
- APK SHA-256: `559ef548051b9dad9269fe5ed9738d27059719c1ef5b0041aceb312891ce23a0`.

## Transport and preservation

Installed ADB37.0.1 repeatedly aborted with libunwind invalid compact encoding, even with USB disabled and foreground execution. Thus USB-only causation was not established. A separate official Google ADB36.0.2 (14143358), local port5040, USB discovery disabled, direct `127.0.0.1:5555` connection completed the probe and correction checks. Original SDK was not replaced; no system settings changed. Official archive provenance: [Android prebuilt upgrade](https://android.googlesource.com/platform/prebuilts/fullsdk-darwin/platform-tools/+/363dd67470a21f3308919d41d1236bfe6c292f89); archive SHA-256 `106a5d31fad8c1c0c5a180d06f5779767d129d7d5edbe629005c11a85eec5b4b`.

Only the disposable QA package was updated with `install -r`; draft retained. Existing medium_phone data/packages untouched. Final show_ime_with_hard_keyboard=0 and font_scale=1.0 readbacks verified. Returned QA app Home, stopped disposable emulator, then restored original emulator with no simultaneous emulator run. No push or release.
