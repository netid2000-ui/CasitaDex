# SB121 current recovery checkpoint

2026-11-06 UTC. Application source **a8867c06c7dd3ceab55bd1ac6705064a83de28f2**, authorized feature branch `work/cd-sb41-edit-targeting-20261104`. Source push and exact remote SHA verified. **Release NO-GO.** This is a bounded native qualification milestone, not release approval.

## Changes carried into the current builds

- Recover Android killed-app notification targets from the supported Expo launch-URL cache before Router hydration. Only an initial root fallback can be recovered; valid current/warm routes retain precedence and cached URLs are consumed to prevent replay. iOS remains pass-through. The prior a812 actual killed-app tray tap opened Home despite a correct PendingIntent; the rebuilt real-notification regression now passes.
- Qualify the API 33-only splash behavior in a complete `values-v33` style. Preserve the original icon, colors, parent and post-splash theme. Full lint no longer reports the prior NewApi error; no suppression or minimum-SDK change.
- Keep Android automatic backup disabled and explicitly exclude all nine app-private domains from both cloud backup and device transfer. Generated, merged and packaged policies were verified. Manual portable export/restore is unchanged. This declares policy for conforming Android transports, not proof of every OEM implementation or removal of historical copies. Device migration requires an explicit portable backup.
- Disclose that Android can delay alerts. The scheduler remains best-effort/inexact; no exact-alarm permission, special-access prompt or timing guarantee was added.

Combined source checks: **492 tests, 487 pass, five existing skips, zero failures**; TypeScript, ESLint and scoped Gitleaks pass. Lockfile SHA256 remains `7767f310cb183d9e2de29deed82d79ee7cd9a08dd29bddf5a979474fe7c856c7`. Approved four-tab layout, artwork and Home actions were compared against accepted native/source evidence and preserved older worktrees, not selected by SHA alone.

## Android current artifact and native evidence

Non-debuggable ARM64 Release variant, development application ID and published QA-template signer. APK SHA256 `9453355fc59c75135c663c2128e80439c9c7f9a526a6db74ecc3d478f8612a71`; bundled JS SHA256 `a29609ed99b75f56acbb0e487abc8806f5c1ac33ad5d166e11abc4a11adbce7a`. Build and full lint completed successfully at 08:54:55 UTC. APK 16 KiB alignment and all **23 native ELF** load-segment alignments pass. This is not distribution signing.

Targeted native acceptance: **19 PASS, 0 FAIL**.

- PASS: actual normal-clock delivered notifications, exact real tray taps and target isolation after process termination, foreground and background. Each sequence includes navigation back, retained reminders, and normal warm/cold launcher behavior without stale replay. No direct-link or injected-push substitute was used for this claim.
- PASS: same-signer upgrade and original logical data/photo bytes preserved; current four-tab Home, delay wording, bounded font-2.0 Reminders action/tab reachability, light/dark Home and splash rendering. Only the two owned synthetic reminders' due/updated times changed for the actual-delivery tests. Original display settings and permission state restored.
- Inexact posting delays were 49.812 seconds after process termination, 39.661 seconds in foreground and 56.956 seconds in background. Successful delivery is not punctual 09:00 acceptance.
- Remaining visual observation: white system indicators are low-contrast during the brief pale light splash; normal Home bars are readable. Do not claim complete system-bar accessibility acceptance.
- Owned virtual session stopped and ports verified closed at 09:33:24 UTC. Complete stopped checkpoint retained and verified; no reset, uninstall or deletion.

Full Android lint has **zero errors and 41 warnings**. Categories: 20 icon-extension, 5 launcher-shape, 7 unused-resource, 6 private-resource, and one each scoped-storage, unused-attribute and discouraged-API warning. Invocation-only `android.lint.useK2Uast=false` avoids the proven Kotlin UAST tool crash; no source lint exclusions or abort-on-error relaxation. Two earlier online newer-version notices were absent in the offline run; they were not separately fixed. The first combined attempt stopped at an incomplete coordinate guard, before acceptance. The retry used the exact previously verified dependency closure after all 18 bundled Maven repositories / 450 files matched, with no network or version change.

## iOS current artifact and native evidence

Unsigned arm64 iOS Simulator Release from the same a886 source. Executable SHA256 `a3af0f51c894a2ba9008aeea2bb37ba5ab585f0ad85653aa6b57ff1b0ce81133`; JS SHA256 `48477d73eb54470bfce1563e4ca290535b0d846cefcfd5f3da8fe76858b172f4`. Build completed 09:06:39 UTC using the existing verified workspace and fresh external DerivedData. All 757 protected source/native/previous-artifact inputs remained unchanged. Portable Swift SQLite preflight and reminder registration checks passed. No Ruby, CocoaPods, PBX changes or dependency regeneration.

- PASS: same-ID preserving upgrade; original memories, reminders, five saved/five draft photo bytes, preferences and separate QA-app data unchanged.
- PASS: ten bounded canonical/encoded/missing-route cases and independent portrait Home pixel review in light/dark; all four tabs fit. This is not a new full-scroll, maximum-text, contrast measurement or screen-reader pass.
- PASS: actual 09:20 normal-clock process-terminated notification opened its exact literal-percent/Unicode target. Home navigation and launcher showed no stale response replay. The screen exposes Show all reminders, not a literal Return button; no literal Return-button claim.
- LIMITATION: external simctl URLs targeting the deliberately noncanonical synthetic identifier did not resolve under bounded encoding checks. Native notification response passed. This is not proven a new source regression. The synthetic-only ID was normalized afterward, all other fields preserved, and all 14 reminder backup rows validate. No parser redesign was made.
- Current linked fixture setup is verified for November 6 at 09:00 America/Chicago / 15:00 UTC. Three new linked requests and one preserved standalone request share that time. App is terminated and the current simulator remains booted. **Delivery/taps remain pending.** See [current continuation](SB121_CURRENT_LINKED_0900_CONTINUATION.md). The historical simulator remains untouched.

## Bounded transport-denial qualification

This evidence belongs to the separate QA derivative of **a8129e81aabb20e0112f39865a046372cb0d5130**, not the ordinary a886 artifact. Four native launches each produced 14/14 complete durable control outcomes with unique tokens, eight exactly attributed native events, and local-file/bundled-JS positives before product import. Text Save/cold relaunch/Find/exact-answer, one synthetic local photo/viewer/byte persistence, and full-v4 local export content/hash checks pass. The 1709-byte export was not saved to an external provider and was not restored. Actual captured photo pixels show the expected gold fixture rather than a placeholder. Ordinary app data remained unchanged.

Initial QA failed closed because RN emits a bare error Event followed by a close event carrying the native error reason. The corrected harness validates that documented pinned sequence without relaxing sentinel/path/token/counter checks, and persists complete receipts before importing product. The original failure is retained. **OS/radio-off remains OPEN.** Arbitrary native sockets, NWConnection, CFStream, unrelated/background sessions, WebViews, Photos/Files providers and share recipients are excluded. No host-network or clock changes.

## Security disposition

Existing CasitaDex audits of the identical lock graph report 0 high/critical, 4 production-classified and 11 full moderate affected-package entries, representing two distinct advisories: [glob GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) and [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249). Concrete inspected consumers are build/lint tooling; fixed patterns/default options do not exercise the described trigger at those inspected callsites. No native user-input route was demonstrated. This is scoped reachability analysis, not a patch or blanket safety finding.

Android generated maps recompose byte-identically, but retained pre-Hermes JS is missing, preventing complete cryptographic map-to-bytecode binding. Tooling-module absence in maps is therefore not accepted as conclusive runtime exclusion. iOS exact-map reachability is unassessed. Keep the security gate open; use trusted build inputs, supported upstream fixes and retain linked JS/maps/HBC at the next already-required build. No forced major override or new build solely for this review.

## Remaining gates and preservation

- Actual current-build linked 09:00 delivery and target/tap correlation. Alerts have generic text; correlate Delivered identifier changes and exact opened title/answer, never row order.
- Current full-draft restore requires owner approval. The earlier archive no longer matches newly added test fixtures; do not restore it. If approved, verify a fresh same-current-state archive first and preserve later fixtures.
- Strict OS-wide offline, manual VoiceOver/TalkBack and remaining full Figma/accessibility matrix, dependency-security disposition, distribution signing and owner physical-iPhone/release acceptance remain open. No physical-phone testing before required virtual gates complete.
- Older builds, unique/dirty worktrees, historical fixtures and all data remain preserved. Inventory is not deletion or completed physical quarantine. Current source and artifacts are explicitly identified above.
- GitHub combined statuses and the connector's PR-filtered workflow query returned no entries for a886; this is not CI PASS.
- No production, release merge, store submission, live purchase, production Firebase write, destructive data action or work on another machine.

## Evidence

External Mac evidence is indexed in the [sanitized manifest](SB121_A886_RECOVERY_CHECKPOINT.json). Raw device state, recordings, personal/device identifiers, binary artifacts and databases remain outside Git. Earlier a812/9e53/87cb results retain their original artifact attribution; unchanged-workflow evidence was preserved rather than broadly rerun.
