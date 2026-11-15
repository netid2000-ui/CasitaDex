# Add/draft Location sweep — November 15, 2026

Continues fcd4c69; Figma-only checkpoint.

Completed four legacy Location entry points: light Add Memory 442:2, dark Add Memory 975:171, light populated photo draft 453:42, dark resumed photo draft 917:218.
Each has a separate Location value and picker/create flow. Selection and Cancel return to the exact originating draft. None and fixed Tool drawer create example update that draft; empty create Save is disabled.
Resumed dark draft scope follows its existing Space variable. Other scope examples are fixed Unassigned/Hallway states.
Both populated draft pages now have fixed top Cancel/Save controls and separate vertically scrolling content. Final dark picker and resumed draft screenshots reviewed.
50 evaluated prototype action/theme assertions passed, zero failures. These evaluate Figma action definitions, not live pointer interactions or native tests.

Limits:
- Existing page Save behavior was preserved. Saved-memory result integration is not certified by this checkpoint.
- Search and create entry remain fixed prototype examples, not real typing or searchable persistence.
- Other historical variants and cross-field transitions still need reconciliation.
- Existing dark Add Memory Space navigation points to a light chooser; discovered and left open because replacing it with an unrelated photo-draft destination would lose context.
- Remaining category choices and full app/Figma sweep remain open.
- No app source/build changes or repeated photo acceptance.

Review: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1478-78&starting-point-node-id=1478%3A78
Evidence: evidence/scoped-locations-20261115/add-draft-audit.json.
