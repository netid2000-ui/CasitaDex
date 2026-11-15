# Samsung full sweep — execution checkpoint
Date: November 15, 2026 (America/Chicago)
Status: IN PROGRESS. Household implementation paused for physical acceptance.

Device: Samsung Galaxy A16 SM-S166V, Android 16, connected to FA-MAC-DEV-01 by USB.
Installed isolated package: com.designsbyfa.casitadex.refreshqa, version 0.1.0 (1).
APK SHA-256: 05f8c745963109c01177c73d9dd59a1e4f60b6b5cacf230ccfb9a9dcfa99e173.
This is the identical APK previously exercised on the Android emulator. Its QA source tree matches the active src tree. Existing dev/staging/SB32 packages were not replaced or cleared. Tests use fictional QA content.

## Verified at this checkpoint
- Ten light/dark Home, Find, Photos, Settings and Storage screen checks, including storage measurement.
- Location create, rename, removal review/cancel/confirm, scoped picker selection, save and reopen persistence.
- Light/dark reminder fixed controls and save return to the linked memory.
- Light/dark native date/time picker open/cancel, Details controls and direct reminder entry.
- 200% system font-size reachable controls in both themes; restored original 1.0 scale.
- Memory create/edit, normalized dimension search, photo-only filtering, cold restart, offline edit/restart, archive, deletion cancel/confirm and restore.

## Remaining
- Spaces/Categories management.
- Photo workspace, double tap/pinch, add/replace/remove/reorder and import paths.
- Backup/export, restore review/cancel/confirm, malformed-file rejection.
- Notification delivery/deep-link lifecycle and screen-reader/manual checks as feasible; distinguish unexercised cases explicitly.

## Interruptions investigated
1. Play Protect requested upload of unknown QA APK; declined upload without changing global protection. Install succeeded on retry. No production release/store purchase.
2. First navigation run lost foreground during a package update (Android exit reason PACKAGE UPDATED), not a recorded crash. Reran the interrupted dark storage check successfully.
3. Emulator text-entry helper sent Back without checking keyboard visibility; then keyboard covered the next field. Added input-focus/text assertions and conditional dismissal. Rechecked actual saved value.
4. ADB 37.0.1 service crashed with invalid compact unwind encoding. Resumed with the existing local 36.0.2 tool path. No device data reset.
5. Older test assertions expected the former inline Location editor. Updated them to the current scoped picker and its editor return before continuing.

## Scope boundaries
This is native QA, not a declaration of store readiness. Android refreshqa does not enable the Plus store-test gates; purchase/entitlement acceptance needs a separate store-test configuration. Full spoken TalkBack acceptance is not inferred from accessibility XML. No application source changed at this checkpoint.

Evidence and logs: evidence/samsung-full-sweep-20261115/.
Test helpers: scripts/samsung-sweep-20261115/.

## Product findings recorded during photo pass
- Photos toolbar target heights measure 43.73–44.09 dp at 450 dpi; source minHeight is 44 without hitSlop. Android recommends 48 dp. Follow up before release. See touch-target-review.json and https://developer.android.com/guide/topics/ui/accessibility/apps.
- Dark photo close returns to the same visible item, but exact clipped image bounds changed by 9px (3.2dp). Light clean-launch flow held exact bounds; the earlier uncontrolled assertion also failed. Keep this as a minor scroll-preservation finding, not a missing-item navigation failure. See photo-Dark-return-bounds.json.
- Both themes passed grid/compact, sort, sticky Add Photo control, zoom buttons, double tap and injected two-pointer pinch. Screen recordings retained.
