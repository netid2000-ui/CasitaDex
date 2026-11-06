# Post-reminder native qualification: memory detail and sharing

Prepared November 6, 2026 UTC. This is an **unexecuted plan**, not a build, install, or native acceptance result.

## Admission and timing

- Current reviewed application source: 737eac13cfacae0086890f98f2197607244036d7; documentation HEAD: 6dbde52a64f76696d291326201d2128c48318014. The focused refresh-order hypothesis was not reproduced; eight tests pass against the actual hook/store contract, with no application patch. Freeze and record the final reviewed application commit before building; do not automatically admit a later descendant.
- The current a8867c0 linked-reminder simulator stays untouched until the 15:00 UTC normal-clock delivery and required taps are completed and their evidence is checkpointed. Passing 15:00 on the clock alone does not release it. Obtain the coordinator's explicit lane release.
- The historical reminder simulator is never a fallback for this task. No physical phone testing until required virtual gates are complete.
- Work exclusively on the authorized Mac, external SSD mounted and writable. Re-read charters, mandatory skills, release SOP, current status, detail/share source report and the private current-reminder handoff. Verify running jobs and resource reservations before any action.
- Do not use a web export, old APK, screenshot in Preview, branch name or matching SHA alone as native-baseline proof.

## Build once at the frozen source

At plan preparation, Git shows no change from a8867c0 through 6dbde52 in package.json, package-lock.json, app config, plugins or tracked native inputs. Recheck this against the eventual frozen source. The lockfile is 7767f310cb183d9e2de29deed82d79ee7cd9a08dd29bddf5a979474fe7c856c7. Changes outside the reviewed JS/test scope invalidate automatic reuse of this build plan.

Use one serialized build per platform after source review. Reuse proven toolchains and unchanged dependency caches; preserve older source/artifacts. No new dependencies, Ruby, CocoaPods, PBX edits or broad generation. If the native graph is not current, stop and report the exact gap.

- iOS: existing verified workspace CasitaDexDev, Release arm64 iphonesimulator, unsigned, external unique DerivedData, two Xcode jobs. Revalidate Swift-only SQLite preparation, decoder bridge and local reminder native integration. Previous successful a886 job aa97de2081d46206 is a command reference, not authority to rerun its hardcoded source assertions or reuse its artifact.
- Android: new isolated source snapshot, the verified external Gradle cache and exact bundled-Maven allowlist, offline dependencies, two Gradle workers. Reuse the a886 build recipe only after replacing its source assertions and isolated destinations. Never use the known-corrupted shared default Gradle journal. Previous successful job4355598f65ca4dd5 is provenance only.
- Hold fa-mac-heavy-build with the platform build lock; never overlap heavy builds or another new Android boot. No simulator or physical-device action is part of compilation.
- Retain pre-Hermes JS, source maps and final bytecode together with hashes during these already-required builds. This closes an evidence gap for dependency reachability without ordering an extra security-only build.

## Exact-artifact receipt, required before installation

Record the immutable source commit, clean branch/status, complete tracked-source hashes, lockfile hash, native dependency inputs and generated integration checks. Record build start/end, command, exit code, variant, app identity and toolchain.

For Android retain APK SHA-256, size, package/version, signer fingerprint, non-debuggable status, architecture, target/min SDK, embedded JS/Hermes hash and the pre-Hermes/map chain. Check install compatibility against the existing synthetic QA app; no uninstall/reset. Verify ZIP/ELF alignment and the unchanged no-Firebase graph using the previously verified bounded checks.

For iOS retain app executable, main.jsbundle and relevant Info.plist hashes, bundle identifier, simulator platform/architecture and unchanged native-project/Pod input hashes. This is not a distribution-signed build.

The new artifact fields in the matrix remain null until a real successful build supplies them. Do not fill them with the older a886 artifact hashes. Source changes must appear in the bundled application, including the separate share route and current action labels.

## Preserving upgrade and visible baseline

After the reminder coordinator releases the current device, capture a consistent rollback copy and hashes of its current app data, drafts, saved media, reminders and preferences using the established read/copy procedure. Do not restore an older archive or overwrite new fixtures. Preserve the earlier installed app artifact and all previous acceptance data. The full-draft restore still requires its separate owner approval.

Use only the verified synthetic target reservation. Check exact installed identity before and after a same-identity preserving upgrade. Compare all pre-existing records and media bytes; allow only explicitly recorded new synthetic test writes. No clear-data, uninstall, reset, deletion or production target.

Bring the actual test device window into view on the Mac and verify live pixels plus current installed hashes. A static capture opened in Preview does not satisfy visible-emulator acceptance. Do not change host accessibility/security permissions to obtain a window. Coordinate the single new Android device lane with Event Command; never touch its reserved session or the historical Casita simulator.

Before wider testing verify actual Home pixels, artwork, Settings and exactly Home / Photos / Reminders / Find; compare current source, owner reference, Figma and installed artifact. Stop immediately on an old/wrong baseline.

## Bounded native test sequence, both platforms

1. **Origin and identity.** First verify that new creation will not replace a preserved unfinished draft. Create a new long-text synthetic memory through the UI only when no draft would be lost; its ID is the ordinary app-generated ID. Otherwise use an already authorized saved synthetic memory for read-only coverage, and mark new-creation-dependent cases BLOCKED. Reuse a verified preserved synthetic encoded/Unicode-ID fixture for route coverage; do not edit the database merely to invent its ID. Find the ordinary test memory through a retained query/filter and scroll position. Open details, verify exact answer, return once and retain context. Repeat entry from Reminders with an honest Back label, plus cold /card and missing-memory cases. No recursive decoding or wrong-memory fallback.
2. **Edit actions and durability.** Use only a separately authorized disposable synthetic memory with no protected reminder/photo-fixture dependency. If no such record is available and a preserved draft prevents safe creation, mark write-dependent cases BLOCKED; do not discard, restore or overwrite the draft. Confirm actions remain outside content scrolling. Edit then Cancel, proving no record write. Edit then Save & return to details, prove the exact memory/revision and retained origin; terminate/relaunch and reread. Test repeated taps and navigation attempts while saving. Use harmless field validation to test an actual refused save with draft retained. Real I/O/readback failures remain explicitly synthetic-test coverage unless a separately scoped non-destructive QA fault harness is approved; never fill disks or alter filesystem permissions.
3. **Separate sharing and return.** Open Share from the same memory. Check Find remains selected and there is no fifth tab. Name/answer are present; optional fields/photos default off. Check exact preview selection, collapse/expand, Cancel sharing and Memory details. Verify return to the same card and then the original result context. Test cold/direct Share and mismatched prior history, repeated exits, Back followed by a queued share action, and navigation during preparation.
4. **Native text and photo sheets.** Open the OS sheet only by explicit test gesture. Dismiss it without sending to contacts, email, AirDrop, cloud or another recipient. Verify correct return without a delivery claim. Use synthetic photos to validate the reviewed local ZIP text, selected count and byte hashes with the established private read/export path. Do not use a real third-party sharing target. Unexpected permissions or external transmission require the applicable approval.
5. **Privacy and stale work.** Confirm cancellation/backgrounding during preparation cannot present a later sheet or redirect another screen. Source-revision/photo-manifest mismatch must fail closed before presentation. If safe timing cannot be reproduced on the ordinary artifact, retain the deterministic source evidence and mark that native case NOT RUN; do not fake it with assertions on a different build.
6. **Layout and accessibility.** Detail, Edit and Share in light/dark, portrait/landscape, system maximum text plus app Large Text, and keyboard open where applicable. Verify both action and content scroll regions remain usable; do not require both actions to be simultaneously visible at extreme settings. Check real hit bounds, content visibility, long-text wrapping, focus order and return focus. Run permitted XCTest/native accessibility checks and actual VoiceOver/TalkBack where available. Do not change OS/host accessibility services or permissions without the required existing authority or confirmation. If unavailable, record the actual screen-reader case BLOCKED or NOT RUN, with no physical-phone fallback. Automated geometry or label checks are not screen-reader speech acceptance.
7. **Reminder integration regression.** Reuse the bounded current native target-routing cases against the new artifact, including retained encoded IDs, dirty edit deferral and no stale replay. Preserve the separately recorded a886 normal-clock delivery result with its original artifact attribution. Any actual new-artifact delivery/tap claim needs real OS evidence on that artifact; a deep link or injected response is not delivery proof. Do not reschedule or repurpose protected fixtures to shortcut this.
8. **Final preservation and return.** Restore only test presentation settings such as text size/orientation to their recorded starting values where already authorized. Return to visible Home. Compare all original records, draft/media bytes and reminder data to the pre-upgrade baseline, allowing only enumerated synthetic writes. Preserve evidence and userdata; do not delete test data as cleanup.

## Evidence and stop rules

For every case maintain a separate result for each platform, with exact source and installed artifact hashes, test ID, timestamp, actual action and result, relevant tree/screenshot and state comparison. Passing one platform never fills the other platform result. Distinguish PASS, FAIL, BLOCKED and NOT RUN. Capture failures once and stop at the first meaningful product or safety failure; correct the specific issue before repeating, rather than rerunning a broad suite blindly.

The data/readback failure tests, historical notification results and prior photo/backup passes retain their exact provenance. They are useful regression evidence, not automatic acceptance of these new screens. No fixture restore, OS-wide offline change, physical testing, signing/distribution or release approval is granted by this plan.

## Completion boundary

One verified new artifact per platform and the cases above can close this bounded detail/share native gate. The remaining full-draft restore approval, strict OS-wide offline, complete manual accessibility/Figma matrix, moderate advisory disposition, distribution signing and owner physical/release acceptance still govern release. Do not promise release readiness from this slice alone.
