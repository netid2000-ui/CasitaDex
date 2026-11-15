# Scoped Locations and discrepancy sweep — November 15, 2026

## Delivered
Location now uses the same reusable-choice approach as Spaces/Categories: searchable alphabetical choices, Create new at the top, optional None, and inline editing. Locations belong to one Space (including Unassigned); identical names may exist in different Spaces. Settings exposes Spaces, categories & locations. Management supports scoped create, rename, impact review, cancel, and removal.

Legacy memory/draft text is retained exactly when indexing. Rename changes matching assignments in that Space; removal clears only those assignments and keeps memories/photos. Changing Space preserves location text and makes it reusable in the destination. Removing a Space moves reusable locations to Unassigned with duplicate consolidation. Full/text backups retain unused saved location labels; older backups derive their labels.

## Verification
- Automated: 516 tests; 510 passed, 6 existing skips, zero failures.
- TypeScript and lint passed.
- iOS: testScopedLocationFlow20261115 passed (134.206 seconds of test execution); create via inline edit, save, cold restart, None/Cancel, rename, removal cancel/confirm, light/dark. Original synthetic memory location restored.
- Android emulator: create/rename/restart/removal cancel/confirm; scoped picker create/select; saved memory location verified in Details after cold restart; light/dark passed.
- Fixed actual iOS modal safe-area defect discovered during native testing by giving the modal its own SafeAreaProvider and SafeAreaView.
- Only Mac mini used for builds/tests; isolated QA identities. Physical devices and owner acceptance were not rerun. Photo acceptance was not repeated.
- xcresult recorded a runtime QoS warning without a failure; retained in evidence.

## Figma reconciliation and sweep
Created 56 light/dark example states for scoped locations, selection/None, create/empty/duplicate, save result, rename, removal review/cancel, Kitchen/Unassigned scope, and renamed return states. Reused approved typography/colors and option components. Persistent top controls sit outside scrolling content.
Updated 71 existing Settings/management frames for Locations; added missing Locations entries to 13 management variants and matched Search labels wording.
Fixed renamed Detail Back returning the old label, scoped create destinations, matching save results, Settings backlinks, and theme-specific routes.
Final structural check: 56 frames, 239 direct navigation links, zero missing destinations, zero cross-theme links. Reviewed light picker, dark picker, dark renamed management, and large dark Settings screenshots. This is not a claim that every historical frame was visually verified.

Light picker: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1456-47&starting-point-node-id=1456%3A47
Dark picker: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1456-278&starting-point-node-id=1456%3A278
Management: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1456-2
Renamed dark list: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=1464-98

## Remaining sweep (not certified complete)
Historical Add/Edit Figma variants still include old Location text-editor links; they need scope/provenance-aware replacement rather than routing every variant to the Garage example. The new states are fixed examples, not dynamic persistence; selection/Cancel provenance across all historical variants remains to reconcile.
The prior CATEGORY_STATES_20261115.md checkpoint still has legacy light Unassigned/Kitchen and Appliances/Seasonal choices and create-new parity open. Remaining app-wide native/prototype accessibility and navigation sweep is not complete. No release approval or physical acceptance is implied.
Synthetic QA-only Android memory remains in the isolated refreshqa package. Device theme returned to System.

## Evidence
See evidence/scoped-locations-20261115/: automated-tests.txt, ios-results.json, android-results.json, native screenshots/accessibility XML, and figma-navigation-audit.json.
Feature branch: work/cd-plus-backup-safety-20261114; prior checkpoint 10bc673.
