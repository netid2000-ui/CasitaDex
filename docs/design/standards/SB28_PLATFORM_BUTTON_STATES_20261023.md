# SB-28 Platform Button State Review — 2026-10-23

## Live Figma specimens
UI master 39uzN0SZX8nlmcGDcHdQhr; Resource Intake page 143:2; isolated QA board 180:17. Native linked Apple iOS 26 variants: Large enabled 180:19 (92x50), Large disabled 180:24 (92x50), component set 174:22. Native linked Android Material 3 variants: Medium enabled 180:30 (120x56), Medium disabled 180:42 (120x56), Medium focused 180:54 (120x56), component set 146:50. Figma board screenshot successfully rendered. Original A.2, source CTA and platform authority pages untouched.

## Assessment
Larger Apple and Android visual specimens exceed the respective 44pt and 48dp nominal target sizes in Figma coordinates, but effective interactive hit areas remain untested. Linked variants prove source component states exist; they do not prove native app behavior or visual contrast. Android source spells pressed state `Presssed` and needs source-aware mapping rather than silently changing external library.

## Remaining gates
Render light/dark modes; measure text contrast; test large/long labels and text scaling; verify focused, pressed, disabled, VoiceOver/TalkBack, hit areas and offline app behavior. Semantic CasitaDex token adaptation and owner review required before promotion. No production release authorized.