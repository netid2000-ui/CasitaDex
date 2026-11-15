# Edit Memory form and header — November 14, 2026 (Chicago)

Continued from a76bea3 on the existing feature branch. Figma 448:2 (light) and 1079:2 (dark) define this scoped editor refresh; sticky top actions supersede the older light frame's scrolling placement.

## Applied

- Compact Cancel/Save, original 16px Figma icons and fixed action bar. Save keeps its existing accessible name and save-and-return behavior.
- Single-border title/description fields with regular labels, 48px single-line / 108px multiline minimums, and full-width Space/Categories choices. Existing taxonomy operations and IDs are unchanged.
- Existing Location/Notes/Reference draft rows retained; Done closes a row without saving. Save/Cancel remain owned by the parent transaction.
- Lighter photo section and Add Photo action using the original icon; existing photo picker, five-photo limit and dirty-edit guard preserved. Read-only verification status remains on Details rather than being duplicated in the editor.
- Fixed Android custom-heading fallback: supplied bold font already contains its weight, so Copy no longer requests an additional synthetic bold variant.
- Local SVG files remain unaltered. A Metro source transformer passes their original text to the SVG renderer at build time. This avoids invalid Android resource-name fetches without runtime network access, vector redrawing or new dependencies. Original root dimensions and file hashes are recorded in evidence.

## Verification

All builds/tests ran on FA-MAC-DEV-01.

- TypeScript and full lint PASS. Full suite: 491 pass, six existing skips, zero failures. Updated the existing source contract for approved Photos label casing.
- iOS layout r5 PASS: Light/Dark, Space/Category panels, fixed Save/Cancel during scrolling; four screenshot captures. System appearance restored.
- iOS optional-row r3 PASS: all three rows edit/close, Cancel rollback, reopen and cold restart. Earlier r1/r2 failures were retained as failed harness runs: partially visible controls and selection of the keyboard suggestion-strip ScrollView. Scoped helper now chooses the largest page scroll and checks visible bounds.
- Android final native check PASS: Location/Notes/Reference edit/Done, Cancel rollback and cold restart; Light/Dark captures. System appearance restored. Final light editor and dark photo-action screenshots visually verify the corrected fonts and all action icons.
- Android release build PASS. The initial visual check found missing SVGs and sans-serif heading fallback; both were corrected before final acceptance.
- Final iOS complete payload hashes equal the starting hashes for original 90-memory QA and disposable 19-memory QA. Accepted SB40 and physical devices were untouched.
- Android tests use only this batch's disposable Refresh QA identity. Emulator update staging lacked space, so only that fresh synthetic installation was recreated. Earlier Android harness Back actions correctly triggered the unsaved-edit warning; final harness uses Done directly.

This is editor layout/interaction acceptance, not repeated photo gesture/import acceptance or a new Save transaction acceptance. Native Android final results and screenshots are recorded alongside this report. Other Add Memory, Details and reminder layout reconciliation, remaining Plus features, large-text/physical acceptance and store qualification remain open. No release or live purchase.
