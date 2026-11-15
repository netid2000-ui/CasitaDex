# Rename Save actions — November 15, 2026

Continues fb89187.

## Fixed in Figma
Eight unchanged-name rename screens had enabled-looking Save buttons without reactions. Wired Save to the existing matching label-detail destination used by Cancel. These prototype states contain the original name, so no new name is fabricated.
Four light and four dark examples covered: Garage, Hallway, Kitchen and Maintenance. All eight targets exist and preserve the source background palette.
Changed-name examples already had Save destinations; preserved those. Empty-name Save states remain inert.

## Source evidence and important parity gap
src/eng-store.ts renameTaxonomy validates empty/overlength names and duplicates belonging to other IDs, then assigns the trimmed name. Saving the existing name is allowed.
src/eng-screens.ts LabelManager currently implements a combined panel: Spaces/Categories selector, label list, one Label name field, Create new label, Rename selected label and removal review. Figma instead represents separate management/list/detail/edit screens. Therefore structural Figma fixes do NOT establish native management-flow parity.
Next implementation priority is the actual label-management flow/layout reconciliation, with targeted regression/native verification. Existing persistence and removal protections must be retained.
Remaining legacy picker choices and hands-on parity also remain open.

No application source changes, builds, data mutations or repeated photo testing in this checkpoint.
Figma: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=505-75
