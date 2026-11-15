# Saved-memory collection integration — November 15, 2026

Continues 56d47b9. Figma-only checkpoint.

Added light/dark Archived Memories and Recently Deleted collections for the two saved-memory flows. Confirmation places the sample memory in the matching collection, hides it from the other, updates count/empty state, and preserves saved values.
Result View collection opens the correct list; its card reopens the exact recovery state. Return to Active removes the row and restores zero/empty state. More menus provide collection entries for revisiting after restore.
Cards bind to saved Location, Space and Categories. Collection controls and bottom navigation remain outside scrolling results.

52 evaluated action/binding/theme assertions passed. Empty light and temporarily populated dark archive screenshots reviewed; temporary defaults restored afterward. Corrected unnecessary wrapping of dark Back labels.
These are prototype checks, not native database tests. No device data changed and no repeated photo acceptance.

Remaining: global Home/Photos/Find/Settings collection entry integration and active-list filtering still use historical frames outside this scoped flow. Search/filter controls remain visual examples. Other historical editor variants and overall sweep remain open.

Light archive: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1497-62&starting-point-node-id=1497%3A62
Dark More flow: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1490-461&starting-point-node-id=1490%3A461
Evidence: evidence/scoped-locations-20261115/collection-audit.json.
