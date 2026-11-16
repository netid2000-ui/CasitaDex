# Find filter reconciliation — November 15, 2026

Status: scoped Figma Location reconciliation complete; release remains NO-GO pending separate acceptance gates.

## Baseline and ownership
- Execution/coordinator: FA-MAC-DEV-01, AI Commander; existing isolated search-location worktree.
- Branch: `work/cd-figma-filter-reconciliation-20261115`, from `540f8e3`.
- App source remains `94cdd0c`. No app-source changes, builds, installs, device interactions, data edits, production release, purchase or main merge in this batch.
- The only running job at preflight was the existing disposable Android emulator. Other worktrees and untracked Python caches were preserved.
- This agent retained responsibility for product scope, design, accessibility, technical parity, privacy, reliability and QA evidence. No worker delegation or paid asset generation.

## Design changes
Authoritative file: [CasitaDex](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=398-2).

- Added the approved Location control to 26 existing Light/Dark Space, Category and photo-filter variants.
- Created two reusable Location-control components from the existing approved Light/Dark controls; preserved Cormorant Garamond/Inter, colors, radii and editable content.
- Normalized the affected filter controls to 48-point height and retained wrapping.
- Added 22 selected-Location variants and 26 context-specific Location pickers. All returns to the originating filter state. Selecting Return grille retains existing query/filter state.
- Garage examples expose no Hallway Location choice. Changing a selected Hallway Location to incompatible Garage returns to the unselected Garage state.
- Added 20 context-preserving Space/Category picker variants for selected Location. Photo toggles and compatible filter changes retain Location.
- Result opening records the selected-Location frame as its return origin. Existing result visibility/count bindings remain intact.
- Preserved Home → Photos → Reminders → Find.

## Verified results
- 48 screen variants checked: 26 updated originals and 22 selected-Location variants.
- 192 filter-control geometry checks: no horizontal overflow; all affected controls at least 48 points high.
- 82 saved filter-transition assertions passed; 22 result-origin assertions passed.
- 492 saved links inspected; all 126 referenced destinations exist.
- Fonts verified against approved Cormorant Garamond/Inter.
- Editable layer/type and image inventory recorded. Images are existing 68×68 memory thumbnails, not flattened screen replacements.
- Visual review passed for Light combined filters (`686:312`), Dark selected Location (`1568:1518`) and context picker (`1568:518`).
- Initial broad read exceeded the Figma return-size limit and made no edits; narrowed read succeeded. First remote evidence-write request exceeded the request-size limit and did not run; a smaller snapshot and chunked manifest saved successfully.
- No native tests were rerun for this Figma-only change. Prior installed keyboard acceptance remains in [the keyboard report](KEYBOARD_FIELD_SWEEP_20261115.md): TypeScript/ESLint PASS, 515 tests passed, 6 skipped; Android installed APK hash `779f4feff00fd0ed2b4a7f8fedebcf3a03592e2f54f3b58047c8fc28c77c53a5`.

## Limits and remaining release gates
Saved-reaction assertions are not hundreds of manual clicks or native tests. These prototypes use the existing finite Hallway/Garage and category examples, not an arbitrary database or text-entry implementation. Existing legacy combined-filter examples retain their static “air filter” query; arbitrary query editing/clear combinations and exhaustive whole-file parity are not newly certified.

1. Owner review of the installed Samsung corrections and physical iPhone sign-off.
2. Complete spoken TalkBack/VoiceOver traversal and activation/focus acceptance; hierarchy and keyboard geometry alone do not establish spoken acceptance.
3. Physical camera capture and photo-library selection/import acceptance; launch/cancel and Browse Files imports were previously verified.
4. Appropriate store-test build and sandbox purchase/restore/expiry/entitlement acceptance. Current refreshqa APK does not enable those gates; no live purchase authorized.
5. Current production-signed release-candidate verification, store privacy/signing/assets and resolution or justified retention of six automated skips.
6. Explicit authorization before any main merge, release or store submission.

The historical report's missing Location-control discrepancy is resolved for its 26 named combined-filter variants. This is not a full-file Figma acceptance declaration. Household sharing remains paused until corrections and native acceptance are complete.

## Provenance and guidance
Code Connect discovery found no tracked mapping files. Library searches for CasitaDex Find filters and Location controls returned no matches; the existing approved file controls were reused, without importing unrelated library designs. Official Figma layout API and Android accessibility guidance were checked November 15; the relevant conclusion is wrapping layouts and 48 dp Android touch targets. No paid generation, new subscription or library publication occurred.
- https://developers.figma.com/docs/plugins/api/properties/nodes-layoutmode/
- https://developer.android.com/guide/topics/ui/accessibility/apps

Evidence: [manifest](evidence/figma-filter-reconciliation-20261115/manifest.json), [before snapshot](evidence/figma-filter-reconciliation-20261115/before.json).
Next batch: complete native assistive-technology and media-import gaps, then prepare the current candidate for owner iPhone review. Reuse prior completed persistence, backup, notification and gesture evidence where source remains unchanged.
