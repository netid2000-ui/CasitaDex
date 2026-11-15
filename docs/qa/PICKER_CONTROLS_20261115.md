# Picker controls — November 15, 2026

Continues 1f6d2e8. Figma-only changes; no app source/data changes or repeated photo testing.

## Fixed
Create Space 1085:109 and Create Category 1085:125 previously scrolled the entire page including actions. Save and Cancel now occupy a persistent top row, with a separate 760px vertical content viewport at 390 × 844. Existing Save variable/conditional actions and Cancel BACK action retained. Create Space screenshot reviewed.
Eight older light Edit Memory Space-options frames contained an inappropriate All spaces search-filter option, which could navigate out to Find. These eight options are hidden and their actions cleared. Other existing choices and Close actions retained. This removes an invalid editor action; it does not add missing None/create-new behavior to legacy light pickers.

## Audit
24 Edit Memory Space/Category-options frames; 84 direct NODE destinations checked; none missing. Nested conditional branches, selection correctness, theme parity and all interactive return paths are not certified by this count.
Two creation screens have persistent action rows and positive-height scrolling content regions.

## Confirmed remaining discrepancy
Repeat-check prototypes still show modal result previews, while PhotoStoragePanel measures inline and the integrity action sets status text. Incoming references observed from measured/completed states to 844:2 and 913:* composites. Legacy proposed light frames also point to dark repeat-check previews. These need a coherent inline-result transition update rather than merely relabeling modal contents.
Hidden Reference checked / Confirm verified controls in inspected repeat-measurement dialogs are already invisible, so they were not treated as visible defects.
Remaining broader sweep: repeat-check transitions, incomplete older light picker choices, management variants and hands-on parity. No full completion or release claim.

Figma: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1085-109
