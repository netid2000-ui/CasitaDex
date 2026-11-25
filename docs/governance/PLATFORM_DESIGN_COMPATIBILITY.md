# Platform design compatibility — 2026-11-25

Scope: FA-02, FA-04, FA-08, FA-13, FA-14. The existing approved product identity, navigation order, and guarded Save/Cancel/Back/return semantics remain authoritative. Platform visual changes belong in separate Figma review variants until approved; this checkpoint does not replace the accepted master.

## Implementation checkpoint — 2026-11-25, platform-native batch

The navigation control layer now actually uses SDK-matched native modules: Expo GlassView with runtime/API and Reduce Transparency gating on iOS, and Expo UI's Jetpack Compose Material 3 NavigationBar on compact portrait Android. The approved four destinations and guarded navigation callbacks are unchanged. Large-type and landscape layouts retain accessible fallback navigation; older iOS uses an opaque fallback. Product colors and content styling remain branded. The Material 3 navigation bar uses an active capsule indicator and native selection/ripple semantics; this is not a claim that every screen is Material 3 Expressive certified. Figma contains eight editable light/dark mobile review frames (four per app); these represent the implemented navigation layer while preserving source masters. See [current platform evidence](../qa/platform-native-20261125/README.md).

Predictive back remains opt-out because the existing dirty-edit BackHandler contract has not been migrated and independently accepted. VoiceOver requires a connected physical iPhone, and installed simulator runtimes only include iOS 27.0/27.1. No store or production action was taken. The historical pre-adoption observations below are retained for traceability.

## Historical pre-adoption QA platform profiles

| Platform | Actual observation on FA-MAC-DEV-01 |
|---|---|
| iOS | Xcode 27.2 (27B52); both QA apps built against iphonesimulator27.2, minimum OS 16.4, tested on iOS 27.0 simulator; UIDesignRequiresCompatibility absent. |
| Android | Emulator and Samsung SM_S166V run Android 16 (API 36); both QA APKs min SDK 24, target SDK 36. Both APKs opt out of predictive back using enableOnBackInvokedCallback=false. |
| Framework | Both projects use Expo SDK 57 / React Native. Current primary tabs are custom React Native controls, not native UITabBar or Material 3 navigation components. |

Minimum OS in metadata is not proof of functional support on every older release. The latest OS on an owner's other device has not been verified.

## Apple Liquid Glass

Apple's standard UIKit/SwiftUI controls gain the new material with the current SDK; custom RN surfaces do not thereby become native Liquid Glass. The inspected iOS Home/More screens retain their opaque branded custom tab bar. Native photo and file pickers continue to use the OS presentation. Full native Liquid Glass adoption is NOT complete.

Preferred design evaluation: native system navigation and control material selectively rather than translucent content cards. Preserve CasitaDex Home, Photos, Reminders, Find and Event Command Home, Guests, Tasks, More. Prototype only the navigation/control layer in a review design; preserve contrast, reduce transparency/motion, increased contrast, Dynamic Type, VoiceOver, keyboard, content insets, and older-iOS fallback. Evaluate Expo SDK 57 GlassEffect and Expo Router native tabs where appropriate, not a wholesale visual rewrite or imitation via opacity. No new module is installed here.

## Android Material 3 / Android 16

Use native Material guidance for an Android-specific variant, including adaptive navigation, accessible active/selected state, consistent touch targets and insets. Do not apply an iOS glass treatment to Android. Edge-to-edge is enforced on the tested Android 16/API 36 target; preserve safe areas and IME navigation. Both currently opt out of predictive back to retain existing guarded navigation; migration must preserve dirty form confirmations and contextual return before enabling it. API 36 targeting is not evidence of full Material 3 Expressive adoption. Native controls, keyboard, font scale, gesture navigation, TalkBack and contrast are separate QA dimensions.

## Current official references

- Apple: https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass
- Apple HIG materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Expo SDK 57 native glass: https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/
- Expo Router native tabs: https://docs.expo.dev/router/advanced/native-tabs/
- Android 16 behavior: https://developer.android.com/about/versions/16/behavior-changes-16
- Android edge-to-edge: https://developer.android.com/develop/ui/views/layout/edge-to-edge
- Android navigation and adaptive layouts: https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns

Record installed package identity, SDK, OS, actual native behavior, theme, accessibility configuration, and Figma reference separately. Do not claim full platform-native design, visual parity or accessibility acceptance from target SDK or a screenshot alone.
