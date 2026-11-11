# CasitaDex SB40 Figma Page 49 — Removal/Reorder Continuity Checkpoint
Date: November 11, 2026
Status: Figma prototype REVIEW, owner approval NOT GRANTED, no native execution.
Figma master: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=398-2
Previous checkpoint: docs/qa/FIGMA_SB40_DARK_PHOTOS_DEEP_FLOW_20261111.md (GitHub commit b78dcdb390ad4ce72ef1d4cef0e5e9f6208c1312).

## Scoped work
Recovered exact dark photo-management result frames and traced Next/Previous/Close after photo removal and reorder. Those flows previously linked into light-mode result examples:
- Removed photo 1 1-of-2 -> light 2-of-2; removed photo 2/3 2-of-2 -> light 1-of-2
- Reorder 2–1–3 2-of-3 -> light 3-of-3; reorder 1–3–2 2-of-3 -> light 1-of-3

Created five editable dark review result frames, preserving sample photo artwork:
- 1010:2 — Removed photo 1, 2 of 2
- 1010:35 — Removed photo 2, 1 of 2
- 1010:68 — Removed photo 3, 1 of 2
- 1010:101 — Reorder 2–1–3, 3 of 3
- 1010:134 — Reorder 1–3–2, 1 of 3

Rewired Previous / Next across all 12 dark removal and reorder result states so they remain within their corresponding 2-photo/3-photo sequence. Close photo returns to the dark Memory Details review frame 1001:2.
Visual review: rendered dark Removed 1-of-2 surviving second photo and dark Reorder 3-of-3 result; readability, count labels and dark button treatment checked.

## Verification result
PASS Figma structural route check: 12 scoped frames, 27 checked Next/Previous/Close links, 0 missing nodes, 0 light-mode primary navigation destinations. This verifies Figma node wiring, not browser execution nor durable image mutation.
OPEN: 24 Zoom/Manage actions from these result states still lead to existing light-mode examples; scope next dark review variants by photo count/index, not arbitrary dark destinations. Browser-driven prototype scenario testing and Save/Cancel/recovery remain to be completed.
OPEN: full page dark-to-light classification, selected cover propagation after reorder/remove, native picker, local persistence, accessibility, owner approval.

## Governance
Preserved accepted CasitaDex SB40 Page 47 and four-tab owner reference Page 44. No source, simulator, native build, existing user data, production system, or owner-approved Figma frame changed. All new frames remain REVIEW. No release promotion or approval implied.
