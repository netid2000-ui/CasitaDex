# Samsung physical full sweep — November 15, 2026

Status: completed physical test pass, with two UI follow-ups and explicit acceptance gaps below. Household implementation remains paused. Core workflows exercised on the phone passed; this is not a claim that every release gate is complete.

## Build and data safety
- Device: Samsung Galaxy A16 SM-S166V, Android 16, USB-connected to FA-MAC-DEV-01. All execution and evidence collection performed on the Mac mini.
- Installed isolated QA package: `com.designsbyfa.casitadex.refreshqa`, version 0.1.0 (1). Existing dev/staging/SB32 apps and their data were not replaced or cleared.
- APK SHA-256: `05f8c745963109c01177c73d9dd59a1e4f60b6b5cacf230ccfb9a9dcfa99e173`. This is the identical APK previously exercised on the Android emulator. QA copy `src` matched the active source tree.
- App baseline: `1e2f895e664a42db89fee3d9cdd33a92e6d49ee4`; test branch starts from `8aa2bfa` (additional household design documentation only). No application source changes or household implementation in this sweep.
- Collection: 90 fictional sample memories plus three dedicated QA memories. Full backup reviewed 93 memories and seven saved photos (four on the QA photo memory and three sample photos).

## Verified matrix
| Area | Result | Physical evidence |
|---|---|---|
| Home, Find, Photos, Settings, Storage | PASS | Ten light/dark screen checks; storage measurement |
| System large text | PASS | 200% font, seven representative screens/theme and reminder filter reachability; original scale restored |
| Locations | PASS | Create, rename, removal review/cancel/confirm, restart, scoped picker create/select, saved memory reopen |
| Spaces and Categories | PASS | Create, rename, restart, removal cancel/confirm |
| Memory lifecycle | PASS | Create/edit, archive/return active, delete cancel/confirm, Recently Deleted restore |
| Search | PASS | `20 x 25 x 1` matched `20x25x1`; photo-only filter and reset |
| Offline durability | PASS | Airplane-mode edit, process restart, search and persisted description; radios restored |
| Final cold restart | PASS | Original restored text, four QA photos, saved Location, Home return; original font/radio settings confirmed |
| Photo browsing | PASS with minor finding | Grid/Compact, sort, sticky controls, same-item return; dark exact scroll drift below |
| Photo gestures | PASS | Zoom buttons, double tap, actual two-pointer pinch in both themes; swipe navigation |
| Photo editing | PASS | Five-file imports, five-photo cap, first/last navigation boundaries, cover change, immediate Next, reorder, replace, remove cancel/confirm |
| Duplicate protection | PASS | Matching sample photos triggered review; all draft content retained; explicit Save as separate memory succeeded |
| Camera denial | PASS | Clear permission message and draft preservation |
| Linked reminder editor | PASS | Save returns to origin memory; both themes, date/time picker open/cancel, sticky controls |
| Notification tap lifecycle | PASS | Foreground, background, and genuinely terminated process each opened its saved linked memory |
| Full backup | PASS | Export to device folder, app verification, copied second QA backup, review/cancel, explicit draft-conflict choice |
| Full restore | PASS | Controlled post-backup edit reverted to original text; four-photo QA collection restored |
| Invalid backup | PASS | Unsupported format rejected; collection remained available |
| Text exports | PASS | Readable report and limited text backup saved, app read-back verified, exported files parsed as JSON; photo-exclusion review/cancel verified |
| Previous full save | PASS | Cancel, recover pre-restore edit, reverse recovery restores original state |
| Sharing | PASS (no delivery attempted) | Photo selection/preview, Android share sheet opened, cancellation returns to Details |
| Photo library/camera launch and cancel | PASS | Native Google photo picker and Samsung camera launch/cancel; no camera image captured |
| Help, privacy, in-app Large text | PASS | Settings screens, large-text Home and restore; limited-backup review/cancel |
| Reminder repeat and completion lifecycle | PASS | Weekly setting saved/reopened; Once, Complete/Mark Incomplete, delete cancel/confirm |

## Findings requiring follow-up
1. **Android touch targets:** Photos Grid, Compact and Sort measure about 43.73 dp, Add Photo about 44.09 dp at 450 dpi. Source uses `minHeight:44` without `hitSlop`. Increase Android targets to at least 48 dp and verify visually; retain the approved compact look. Evidence: `touch-target-review.json`. Official guidance: https://developer.android.com/guide/topics/ui/accessibility/apps.
2. **Minor photo return drift:** Dark full-gesture flow returned to the same visible photo, but clipped image bounds changed by 9 px (3.2 dp). Light clean-launch flow held exact bounds. This is a scroll-preservation finding, not lost content or the wrong item. Evidence: `extended/photo-Dark-return-bounds.json` and matching screenshots.

## Notification timing and corrected test expectation
Three reminders due at 14:54, 14:54 and 14:55 Central were all observed posted by approximately 15:00. Android alarm diagnostics showed inexact scheduling windows of roughly six to seven minutes. The app warns that device settings can affect timing; exact-minute delivery is not established.

The initial handwritten test expectation reversed two sample IDs. Backup snapshot inspection proved `sb26qa_001` is Coffee filters, `sb26qa_007` is Extension cord and `sb26qa_013` is Appliance manuals. All observed destinations match the actual saved reminder links. This was a test expectation error, not a confirmed routing defect. Evidence: `notification-first-pass.json`, `notification-memory-mappings.json`, `backup-reminder-mappings.json` and three destination screenshots.

For terminated-state acceptance, PID 17445 was ended using `am kill` after backgrounding; `pidof` returned empty. Tapping the notification launched PID 25704 and opened the correct linked memory. Force-stop was not used for this notification test.

## Interruptions and test-harness corrections
- Play Protect offered to upload the unknown QA APK. Upload declined without changing global protection. Isolated install succeeded on retry.
- Initial navigation was interrupted by a late package update, with Android exit reason PACKAGE UPDATED. The affected check was rerun successfully; no app crash was inferred from that interruption.
- ADB 37.0.1 crashed with a native unwind error. The existing local ADB 36.0.2 resumed testing; no device reset.
- Conditional keyboard dismissal and focused-input assertions replaced a blind Back action that could leave the editor. Incorrect intermediate QA values were corrected and verified after restart.
- Test assertions were updated for the current scoped Location picker and Samsung uppercase alert buttons.
- Bounded label lists required swipes inside their actual ScrollView, not full-screen swipes. A reminder moved upward when marked incomplete; reopening the list confirmed its state after the downward-only search missed it.
- Initial restore confirmation was correctly disabled by an unfinished camera-test draft; explicit backed-up-draft selection allowed verified restore. The blocked first attempt is not reported as a restore failure.
- Appearance settings were opened through the visible button after an unsupported test deep-link parameter returned the settings menu.
- Find follows the approved A3 continuous-list design; old pagination expectations were not reintroduced.

## Acceptance limits
- Spoken TalkBack traversal and physical camera capture of a deliberately framed test subject still need hands-on acceptance. Accessibility XML and camera launch alone do not establish those results.
- Photo-library selection/import is not yet claimed; Browse Files import is verified.
- This QA build does not enable Plus store-test gates. Real sandbox purchase, restore-purchase, expiry and entitlement acceptance require the appropriate store-test build. No purchase was attempted.
- Exact-minute/background battery-restriction delivery, device reboot, OS upgrade, extreme low-storage behavior and external recipient delivery are not claimed by this session.
- iPhone final acceptance remains with the owner. This Samsung report is not a production/store release approval.

## Evidence and reproducibility
Evidence: [samsung-full-sweep-20261115](evidence/samsung-full-sweep-20261115/). Helpers: [samsung-sweep-20261115](../../scripts/samsung-sweep-20261115/). Scripts are stateful QA flows and finish/recovery steps, not a single rerunnable unit suite. Saved screenshots contain app QA content; native picker/chooser private content was excluded.

## Final device state and outcome
The QA app is left on Home. System appearance is selected, system font scale is 1.0, airplane mode is off, and Wi-Fi/mobile data are enabled as originally recorded. Temporary camera permission was revoked to restore the original denied state. The read-only crash buffer review did not contain this package; exit-info entries reflect package installation, requested restarts/background kill and permission revocation. No crash-free guarantee beyond this observed session is implied.

Next engineering work: enlarge the measured Android photo controls and correct/recheck exact photo return positioning before household implementation. Complete the named manual and store-build acceptance gates separately. No production release, store submission or live purchase occurred.
