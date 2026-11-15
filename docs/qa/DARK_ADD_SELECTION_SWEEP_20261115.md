# Dark Add Memory theme and selection sweep — November 15, 2026

Continues 8c4f693. Design-only correction.

Fixed both dark Add Memory links that opened light Space/Category screens. Space now offers Unassigned, Garage, Hallway, Kitchen and Office, plus blank/filled Create Space examples. Selection returns to the same Add Memory frame. Empty create Save is disabled.

Categories now has all 16 combinations of Appliances, Maintenance, Manuals and Seasonal. Toggling keeps the draft in dark selectors; Apply returns to Add Memory. Cancel restores the category selection from before opening. Space and Location values remain unchanged during category selection.

The Add Memory Space value and its Location picker/create scope captions share a dedicated variable. Changing Space keeps the Location value. Existing empty Add Memory Save remains disabled.

Validation: 183 evaluated prototype action assertions passed; zero missing destinations and zero cross-theme destinations in audited Add/selector routes. Final Space and Maintenance+Manuals picker screenshots reviewed. These are action-definition checks, not live pointer or native tests.

Remaining: Search is a visual prototype field. Create Space uses a fixed Office example; duplicate handling and category creation are not represented here. Saved-result integration, remaining historical Add/draft variants, light category parity and the full sweep remain open. No app source change, native rebuild or repeated photo acceptance.

Figma: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1481-13&starting-point-node-id=1481%3A13
Categories: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1481-229&starting-point-node-id=1481%3A229
