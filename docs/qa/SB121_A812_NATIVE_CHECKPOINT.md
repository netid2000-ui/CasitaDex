# CasitaDex current native release checkpoint, 2026-11-06

Release status: **NO-GO**. This is verified feature-branch progress, not release approval.

## Exact runtime
Both current native artifacts were built from a8129e81aabb20e0112f39865a046372cb0d5130, branch work/cd-sb41-edit-targeting-20261104. The later SQLite preparation commit changes only scripts/documentation, not these runtimes. Exact package hashes and evidence fingerprints are in SB121_A812_NATIVE_CHECKPOINT.json.

The owner-approved Home / Photos / Reminders / Find design was checked against the separate newer worktree and visual reference before building. Current native pixels retain the house brand, full date, Settings and Find-first Home. Old checkouts, previous artifacts and the protected scheduled fixture remain preserved, not moved or deleted.

## Verified iOS
- Data-preserving upgrade: two memories, five saved photos, five draft photos and ten existing reminders unchanged, with exact media hashes. Current package bytes match the build.
- Maximum native text: Home, Photos, Reminders and Find in landscape, plus Backup in portrait passed official XCTest accessibility audits with no findings suppressed. Home actions, Find Browse and all five Backup controls were fully reachable in measured native scroll bounds. Photos/Reminders checks cover tab selection and the displayed audit context, not every action in those screens.
- Landscape now has two rows of navigation and 184pt of scrollable content instead of the earlier four-row/zero-content defect. All four tabs remain at least 44pt and fully hittable. Display preferences and existing data restored after every run.
- Ten native routing cases passed: fully encoded existing memory/reminder targets in warm and cold states; missing, malformed, duplicate, literal-percent and Unicode targets failed safely. Routes caused no logical data writes.
- Real normal-clock notifications at 07:52, 07:53 and 07:54 UTC opened the exact unique reminder from foreground, background and terminated states. Native pending/delivered records and actual banner taps were used, without clock changes, push simulation or route injection for delivery proof. Only three additive synthetic reminders were created; prior data/draft/photos/reminders unchanged.

## Verified Android
Thirty-four retained assertions passed on the exact current APK: data-preserving upgrade, approved four-tab Home, existing answer, warm/cold memory and encoded reminder destinations, missing/malformed fallbacks and return paths. Five actual photo bytes were selected through native Files; draft relaunch and saving preserved identity/hash data. Eight rendered picker entries were disabled at five while replacement/removal remained available. Font scale 2.0 portrait and landscape retained navigation/content and reachable Home actions. Original memory, settings and permissions stayed intact; SQLite integrity passed. Complete rollback and final AVD snapshots were retained; owned virtual session stopped safely.

These bounded checks do not repeat or relabel previous backup, offline or broader photo evidence. Actual Android tray delivery remains untested on this artifact.

## Build and test evidence
Combined source: 463 tests, 458 pass, 5 existing skips, 0 fail; TypeScript, ESLint, 8 geometry proxies and native reminder-integration guard passed. Native dependency versions and existing Xcode/Pod inputs did not change. Decoder security remediation removes high/critical findings; 4 production/11 full moderate toolchain entries remain open.

Clean npm install removed two official generated ExpoSQLite files. A hash-guarded Swift-only restoration plus fresh DerivedData fixed the build without Ruby/Pods/PBX changes. Portable helper and 19 isolated positive/negative scenarios are committed. It is not a fresh-clone Pods bootstrap.

Expo Doctor 20/21 reflects a CocoaPods-version check unavailable in this Swift-only lane. Full Android lint initially crashed in Worklets Kotlin UAST; an invocation-only FE10 analyzer fallback passed Worklets/production analysis, but final full lint remains pending dependency-resolution completion. No lint findings were suppressed.

## Honest limits and retained failures
The first landscape follow-up harness accidentally tapped an action with a 10pt drag. A second harness queried hittability for an offscreen Settings control and triggered XCTest's invalid activation-point error. Safe gutter dragging and querying hittability only when fully in bounds corrected harness behavior; all reachability/audit assertions remain. Both failed attempts are retained.

The first direct-URL test stopped at the OS's exact Open in CasitaDex confirmation; handling that ordinary app-open confirmation enabled the successful test. No unexpected permission was accepted.

The preceding 9e53 runtime saved and verified a full archive containing two memories, five saved plus five draft photos and ten reminders. Same-state full-draft restore remains blocked before confirmation; safe Cancel preserved all state. Prior 87cb replacement/recovery passes remain attributed to that runtime.

Still open: protected linked 09:00 delivery/taps, strict OS-wide offline, full screen-reader/accessibility and Figma reconciliation, remaining moderate security disposition, current Android tray delivery, blocked current full-draft restore, final full lint, distribution signing, and owner physical-iPhone signoff after all virtual gates. No production, store, live purchase, host-network or physical-phone action occurred.

Private device identifiers, raw data, binaries and desktop images are excluded from Git. Evidence remains in the governed external QA directory.
