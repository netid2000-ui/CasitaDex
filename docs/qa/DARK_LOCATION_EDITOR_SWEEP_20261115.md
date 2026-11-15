# Dark Location editor reconciliation — November 15, 2026

Continues 4712c58. Figma-only sweep; application source, native builds and accepted photo testing unchanged.

## Completed
Nine dark editor variants now bind Location to shared draft/saved variables, alongside existing Space/Category variables. Opening the picker records the exact editor origin. Current/None/Tool drawer sample selection returns to that editor; picker Cancel leaves its draft intact.
Editor Save copies draft Location to saved Location before existing navigation. Editor Cancel restores the saved value before existing return navigation.
Twenty-one dark Details variants now display the saved Location and initialize the draft when Edit is opened. The original conditional Find/Photos return mechanism is preserved.
Added a dark picker plus blank/filled Create Location examples; empty Save is disabled, creation selects Tool drawer, and Cancel preserves previous selection. Scope heading binds to the existing draft Space variable.
Headers remain separate from scrolling bodies. Location wraps in a fixed label/value layout. No light-theme destination was introduced.

## Validation
238 action-logic assertions passed (178 editor/binding checks + 60 all-origin/create checks).
The checks evaluate retrieved Figma action definitions, including variable assignment and conditional navigation; they are not live pointer-driven prototype tests or native device tests.
321 nested/direct route references examined: no missing destinations and no light-theme crossover.
All 21 origin values exercised for main-editor Save and Cancel; all nine editor origins exercised for create return/cancel.
Final dark picker and dark Find Details screenshots reviewed after header compaction. Long location value wraps cleanly.
Prior app test checkpoint remains 510 passing / 6 existing skips, native iOS/Android passed at d5e2b72; no tests repeated for this design-only change.

## Scope remaining
Search is a visual field, and create text entry is a fixed example interaction. Full searchable label data and per-Space registry persistence are implemented in the app, not simulated by this prototype.
Older Add Memory/photo draft Location editors outside this group remain to reconcile. Legacy light Unassigned/Kitchen, Appliances/Seasonal and category create-new parity remain open, as does the overall app/Figma sweep.
The dark sample-memory Location state is shared across these variants consistently with their existing Space/Category mechanism. Existing static Location-edited examples now show the shared draft, rather than hardcoded alternative location text.

## Links
Picker: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1473-16&starting-point-node-id=1473%3A16
Dark Find Details: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1066-2&starting-point-node-id=1066%3A2
Create example: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1473-47

Evidence: evidence/scoped-locations-20261115/dark-editor-audit.json.
