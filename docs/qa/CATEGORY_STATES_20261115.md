# Legacy category state corrections — November 15, 2026

Continues abd8aae. Figma prototype correction only.

## Fixed
Legacy light Edit Memory category pickers sent Maintenance to Find / Maintenance and included All categories search-filter actions.
Hidden/disconnected All categories in eight originals and their new counterparts. Rewired Maintenance and Manuals as independent toggles.
Added eight missing editor/result states for None and Manuals only, retaining Hallway/Garage and Find/Photos provenance. Together with eight existing states, 16 states now represent all four category combinations for those spaces/origins.
New states include paired category and space pickers plus saved Details. Save targets the matching category result; Details Edit reopens that editor. Hallway/Garage transitions retain category selection.
Existing editor action bars and fields cloned; unrelated text retained. These are fixed example prototype states, not actual persistence.

## Verification
New-state structural checks: 8/8 Save destinations, 16 category links staying in editors with space preserved, 16 space links preserving categories; zero failures. Editor and Details category text checked.
Representative Garage / Manuals editor screenshot reviewed.
Mutation evidence includes all new and modified node IDs.
No app source changes, native builds, device-data mutations, or repeated photo testing.

## Remaining
Legacy light Unassigned/Kitchen and Appliances/Seasonal options and create-new parity remain incomplete. Other management variants and hands-on prototype/native parity still need review. This closes the Maintenance-to-Find defect and supported-category state gap; it does not certify all picker choices or full sweep completion.

Figma: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1442-430
