# Optional Edit Memory rows — November 14, 2026 (Chicago)

Implemented the approved compact Location, Notes and Reference rows from Figma 1079:2. Each displays its current value and opens a working editor. Done returns to the compact row without saving; the parent editor retains control of Save and Cancel. Location/Notes Edit from Details opens the requested field immediately. Existing persistence and navigation remain intact.

Validation on FA-MAC-DEV-01:

- TypeScript, full lint and 491 automated tests passed; six existing skips.
- Native iOS `CasitaDex-Optional-Editor-r3-20261115.xcresult`: one test passed, no failures. All three rows expand, accept input and close. Cancel discards the edits; original values survive reopening and restart. Fixed Cancel remains reachable.
- First two harness attempts tapped a Done button partially beneath the keyboard. Native hierarchy identified the obstruction. Final harness uses the existing scroll-to-dismiss behavior before tapping; no timing workaround or application behavior change was needed.
- Screenshot visually reviewed for the scoped rows. Both existing 90-memory and disposable 19-memory QA payload hashes remain exactly unchanged.
- Android arm64 release compilation passed. Native Android acceptance of these new rows remains pending.

This is a scoped secondary-screen checkpoint, not complete Edit/Add/Details/Reminders visual parity. Header icons, remaining form layout, Android interaction and physical acceptance remain open. Save behavior uses the existing parent transaction; this new native test specifically proves edit/close/Cancel/restart, not a new save acceptance. No photo acceptance was repeated, no live purchases or releases, and accepted SB40 was not replaced.
