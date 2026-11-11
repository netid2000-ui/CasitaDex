# CasitaDex Figma SB40 — Post-Mutation Zoom & Manage Review Checkpoint
Date: 2026-11-11
Status: Figma REVIEW candidate, not owner-approved and not native-tested.
Figma Page 49: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=398-2
Prior checkpoint: docs/qa/FIGMA_SB40_PHOTO_RESULT_CONTINUITY_20261111.md, GitHub commit 374328e47bc75150626eac7c509b2361d31975c2.

## Scope
Resolved remaining light-theme Zoom and Manage entry links in the 12 dark Photos removal/reorder result states, preserving each specific photo count, position, image and originating result state.

### New editable review designs
- 12 dark Zoom preview states: 1013:38, 1013:76, 1013:114, 1013:152, 1013:190, 1013:228, 1013:266, 1013:304, 1013:342, 1013:380, 1013:418, 1013:456.
- 12 dark Manage preview states: 1013:494, 1013:560, 1013:626, 1013:692, 1013:758, 1013:824, 1013:890, 1013:956, 1013:1022, 1013:1088, 1013:1154, 1013:1220.

### Verified Figma checks
- PASS: 12/12 original result states resolve to distinct matching dark Zoom destinations.
- PASS: 12/12 original result states resolve to distinct matching dark Manage destinations.
- PASS: 12/12 Zoom previews expose controls and Zoom out / Reset return to their exact original result frame.
- PASS: 12/12 Manage previews have Hide photo actions returning to their original result frame.
- PASS: 12/12 Manage previews clearly label follow-on editing controls as REVIEW ONLY. Move/Replace/Remove are muted and have no misleading actions, because subsequent mutation semantics are not simulated.
- PASS: Representative screenshots checked, including dark 2× preview and post-removal Manage panel.
- An initial attempt to wire Zoom in to itself was rejected by Figma as invalid; no edits were committed from that failed call; corrected non-self-linking write succeeded.

### Open / not tested
- The zoom preview labels indicate 2× as an illustrative state; this is not a validated pinch or image transform.
- Further photo mutations after a first remove/reorder must be modeled and browser-tested before enabling those controls; real persistence is not implemented by Figma.
- Cross-theme transitions elsewhere on Page 49, multi-category state, restore/recovery and full accessibility still have separate outstanding gates.
- No production/native iOS or Android app, accepted SB40 installation, Git source, stored memory, billing, or store state was changed.

### Governance
Owner acceptance remains pending. Preserve CasitaDex approved owner four-tab screenshots Page 44 (347:2), corrected SB40 inline Add/Edit Page 47 (360:2), and withdrawn wrong-source Page 45 (351:2). Record native verification against exact installed artifacts separately.
