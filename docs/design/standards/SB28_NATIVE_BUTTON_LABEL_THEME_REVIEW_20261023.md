# SB-28 Native Button Label and Theme Review — 2026-10-23

Figma UI master 39uzN0SZX8nlmcGDcHdQhr; resource page 143:2; isolated review board 181:40, screenshot rendered.

## Linked native specimens
Apple iOS 26 Large button: source 180:19 92x50. Set published label property `Label#488:0` to `Add Photo Memory`: light instance 181:42 and dark-panel instance 181:46 both 207x50.
Android Material 3 Medium button: source 180:30 120x56. Set published label property `Label text#58650:306` to `Add Photo Memory`: light instance 181:50 and dark-panel instance 181:57 both 221x56.
All changes review-only; linked instances retain native component properties. The review panels use CasitaDex Semantic Colors collection explicit Light 29:0 / Dark 29:1 modes.

## Interpretation and remaining gates
Long label expands horizontally without height change; actual clipping and text scaling remain to be tested. Imported libraries have independent variable collections and inherited modes; setting the panel CasitaDex semantic mode does NOT prove native button light/dark adaptation. Verify library-specific modes, measured contrast, font scaling, VoiceOver/TalkBack, hitboxes, focus/pressed/disabled and platform runtime before promotion. Approved Warm Editorial A.2 source remains unchanged.