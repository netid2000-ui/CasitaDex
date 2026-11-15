# Location editor sweep — November 15, 2026

Continues d5e2b72. Figma-only corrections; app implementation and prior native acceptance unchanged.

## Completed
- Replaced canonical light Edit Memory Location text-editor links from Find (448:2) and Photos (448:44) with Hallway-scoped searchable picker examples.
- Added origin-specific current/None/new-selection states, blank and filled Create Location examples, and matching saved Details.
- Picker Cancel returns to its exact originating editor state. None/current/new choices return to their matching editor. Empty create Save is disabled; field opens filled example; Cancel retains prior selection.
- Save from None/new editor leads to matching Details; Details Edit reopens that selected editor. Existing Find/Photos return destinations remain distinct.
- Fixed long option-label wrapping.
- Discovered that six previous Location Details example frames lacked visible Location values; added Location to those light/dark frames and four new result frames.
- Corrected new Photos Details to 390×844 with fixed top navigation, separate scrolling content, proper insets and wrapped Location value column.

## Validation
Entry, Cancel and changed-editor Save routing assertions passed for both origins (zero failures).
Final picker and Photos saved Details screenshots reviewed; long Location value wraps into two lines without overlap. Original Space/Category values preserved in these examples.
This is a prototype example-state check, not persistence testing. Native iOS/Android tests were not repeated; no photo acceptance rerun.

## Still open
Other historical Add/Edit/draft variants and dark editor-entry routes remain to reconcile; this checkpoint does not certify the full sweep. Light legacy Unassigned/Kitchen and Appliances/Seasonal and create-new category parity remain as previously recorded. Other edits after Location selection can still leave these fixed examples via historical routes; full cross-field state preservation remains open.

## Links
Find picker: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1469-138&starting-point-node-id=1469%3A138
Photos picker: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1469-579&starting-point-node-id=1469%3A579
Saved Photos Details: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1469-767
