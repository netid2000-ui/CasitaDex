# Saved-memory Verify, Reference and lifecycle examples — November 15, 2026

Continues 82ce05d. Figma-only checkpoint; no device data changed.

Both saved-memory More menus now open dedicated Verify, Reference, Archive confirmation and Recently Deleted confirmation flows. Verify writes the displayed verification result. Reference keeps separate draft/saved values; Cancel rolls back, Save updates Details. Reference editing is a fixed MERV 11 → MERV 13 example, not free text entry.
Archive/delete require confirmation and have distinct retained-memory result states. Cancel keeps Active; Return to Active restores the same Details and saved Location. Back allows leaving the result without restoring.
Details and opt-in Share previews now bind Reference/Verification to these new saved values. Lifecycle result displays saved Location.
Fixed clipped recovery buttons and removed misleading trash icons from Return to Active.

52 prototype action/theme/binding checks passed: Verify cancel/confirm, Reference cancel/save, lifecycle confirm/cancel/restore, Location preservation, leave-without-restore, result bindings and theme. Final dark archived-result screenshot reviewed.
These evaluate action definitions; they do not establish real database lifecycle persistence, notification behavior, list filtering, or native accessibility. No device memory was archived/deleted and photo acceptance was not repeated.

Remaining: collection/list integration after leaving lifecycle results; cross-field editor and secondary-action state consistency across all historical variants; remaining category/search/create examples and full sweep. The new lifecycle variables model these isolated examples only.

Light More: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1490-216&starting-point-node-id=1490%3A216
Dark archive result: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1493-138&starting-point-node-id=1493%3A138
