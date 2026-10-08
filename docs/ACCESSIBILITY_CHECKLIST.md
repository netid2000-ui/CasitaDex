# Accessibility contract
Universal and never paywalled. Governing standard: ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.

Implemented: visible labels, heading roles, textual confidence states, minimum 48 dp control targets, uncapped OS font scaling, persisted Extra-large text, wrapping navigation/controls, scrollable content, keyboard focus indication, no swipe-only or icon-only required action, no animation, plain-language validation and recovery. Added persisted Light / Dark / System appearance with expo-system-ui and a matching status bar.

Light palette: paper #F5F2EA, text #203F36, panel #FFFFFF. Dark palette: paper #15241F, text #E4EFE5, panel #20382D. Selection reverses these text/panel roles, with explicit selected state. Color never carries meaning alone. Record measured contrast in QA evidence.

Required evidence: 320px and desktop browser widths, 200% app text on all major screens including details/share/import, keyboard access, no clipping, OS appearance changes, native system font scaling, TalkBack, VoiceOver, focus order and Reduce Motion. Browser/semantic-label checks cannot close native screen-reader acceptance. Exact results and open gates are in NATIVE_BATCH_REPORT.md.

Native batch outcome: no Android APK was produced. TalkBack, OS font scaling, native appearance/focus/touch/clipping and physical-device checks remain NOT RUN / OPEN. Browser screenshots/contrast and shared source do not close these gates. iOS/VoiceOver remain NOT RUN / OPEN.
