# SB-28 CTA review — theme and layout QA (2026-10-23)
Live Figma UI master: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
REVIEW component set: 141:2. Original: 109:111, unchanged.

## Implemented and verified structurally
- All 12 Apple/Android, Light/Dark, Enabled/Disabled/Focused variants have horizontal Auto Layout, centered content, explicit Light/Dark semantic collection mode and FILL-sized label.
- All variants restored to original reference width 366 and height 49 after Auto Layout initially shrank them; label width 340 (334 on Focused).
- Enabled/Focused 8 variants retain semantic background and foreground bindings; disabled 4 variants remain literal and require approved semantic role.
- Initial read of bound Dark variants showed Light-mode colors before explicit mode assignment; mode IDs now Light 29:0 / Dark 29:1.
- Existing disabled background/foreground contrast calculated from actual fill colors: Light ~3.01:1; Dark ~3.88:1. Disabled-control accessibility and surrounding-surface contrast still require assessment.

## Remaining gates
- Visual screenshot review, long text/dynamic type, minimum width and touch targets, pressed/loading/error, disabled semantic tokens, focus rings, owner review.
- No source replacement, screen wiring, native QA, Code Connect, push or production deployment.