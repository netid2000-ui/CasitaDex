# SB-28 Native Button Accessibility Gate — 2026-10-23

## Figma inspection
UI master 39uzN0SZX8nlmcGDcHdQhr, resource page 143:2, review board 176:10. Apple linked reference 176:13: 66x28, horizontal Auto Layout, SF Pro Regular 15, Play, bound fills, component set 144 variants. Android linked reference 176:18: 95x48, horizontal Auto Layout, Roboto Medium 14, Label, component set 50 variants, no top-level bound variables. Local CasitaDex Semantic Colors supports Light/Dark.

Added touch-target guide frame 179:17 with two 48x48 dashed outlines (179:18 and 179:20) and descriptive labels. These outlines are visual aids, not working hitboxes. Figma board screenshot rendered successfully; no screenshot-based contrast measurement or app QA performed.

## Open acceptance gates
Apple minimum effective 44x44pt interactive area; Android 48x48dp target. Verify native hit areas rather than equating component dimensions with touch targets. Verify text contrast in light/dark, large text/dynamic type, disabled/focused states, long labels, keyboard/screen reader interaction, semantic tokens and Warm Editorial A.2 styling. Do not promote review components before these checks and owner acceptance. No production files or approved masters changed.