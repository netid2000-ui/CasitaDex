# SB-28 — Material 3 instance inspection (2026-10-23)

Live Figma file 39uzN0SZX8nlmcGDcHdQhr; Resource Intake page 143:2; linked review instance 146:547.

## Verified
Instance remains linked to main component 146:91 `Type=Round, Size=Small, State=Enabled`; instance is 95x48 and uses HORIZONTAL Auto Layout. Nested `Content` and `State-layer` are 95x40; `Icon` is 20x20; `Label` is 35x20, 14pt, text `Label`. Variant properties Type=Round, Size=Small, State=Enabled. This is an imported reference, not a CasitaDex-approved CTA.

## QA gate
48px outer height is promising for touch targets, but interactive hitbox, contrast, focus, disabled and dark mode have NOT been measured. Icon and label are generic placeholders. Must test actual CasitaDex copy, semantic token mapping, visual appearance, accessibility and publisher/license before adoption. Original A.2 design unchanged. Apple iOS 26/27 imports remain permission denied; manual Figma editor license/access check pending.