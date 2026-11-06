# Release preparation: refresh contract verified; native plan not executed

Application source remains **737eac13cfacae0086890f98f2197607244036d7**. The suspected refresh-order race was not reproduced: actual store serialization is covered by eight new deterministic tests. Full combined regression: **541 tests, 536 pass, five existing skips**. No application patch or native rebuild. [Finding and reviewed post-reminder plan](docs/qa/SB121_REFRESH_CONTRACT_PREPARATION.md).

The protected installed runtime remains **a8867c0** for the current 15:00 UTC test. New native artifact hashes are deliberately unset. Release remains **NO-GO**; no device or fixture action occurred.

## Previous source checkpoint retained

# Latest source: fixed memory actions and separate sharing; native acceptance pending

Application source **737eac13cfacae0086890f98f2197607244036d7** implements detail/edit action placement and a separate selected-sharing flow while preserving the approved four tabs. Full source gate: **533 tests, 528 pass, five existing skips**, TypeScript/lint, Doctor 21/21, web export and scoped Gitleaks PASS. Independent source review PASS. [Source report and remaining gates](docs/qa/SB121_DETAIL_SHARE_SOURCE_PARITY.md).

**Latest qualified and scheduled native runtime remains a8867c0.** No native build/install occurred for this source. Preserve the current 15:00 UTC reminder fixture and complete its existing handoff before any runtime replacement. Release **NO-GO**; native UI/keyboard/screen-reader/share acceptance and all earlier approval gates remain open.

## Previous source checkpoint retained

# Latest source: focused accessibility feedback fixes; native acceptance pending

Source 7d0dd6626287fd56d30b990f4a9c14036801a9a2 fixes three bounded accessibility feedback gaps. Source verification: 503 tests, 498 pass, five existing skips; TypeScript, lint and scoped Gitleaks pass. No new native build/install. [Source review and evidence](docs/qa/SB121_ACCESSIBILITY_FEEDBACK_REVIEW.md).

The installed/current scheduled runtime remains **a8867c0**, preserved and terminated for the existing November 6 15:00 UTC linked-reminder test. Do not replace it with this unbuilt source before that test. Release remains **NO-GO**; approval and native/manual gates below remain open.

## Previously verified native checkpoint

# Current checkpoint: a886 recovery verified, linked delivery pending

Application source a8867c06c7dd3ceab55bd1ac6705064a83de28f2 is pushed and remote-verified. Both current native builds pass. Android real killed-app/foreground/background notification targeting, return and no-replay pass; full Android lint has zero errors and 41 warnings. Current iOS preserving upgrade, ten route cases, actual terminated notification and portrait light/dark Home pass. Combined source checks: 492 tests, 487 pass, five existing skips.

Three current-build linked requests are prepared for November 6 at 15:00 UTC / 09:00 CST; actual delivery remains pending. Current app is terminated and its simulator reserved, with the historical fixture separately preserved. [Current evidence and gates](docs/qa/SB121_A886_RECOVERY_CHECKPOINT.md). [Current scheduled continuation](docs/qa/SB121_CURRENT_LINKED_0900_CONTINUATION.md).

Release remains **NO-GO**: OS-wide offline, current full-draft restore awaiting approval, remaining screen-reader/Figma/accessibility, security disposition, signing and physical/release gates remain open. Scoped app-transport denial passed on the explicitly separate a812 QA derivative. No physical testing before required virtual completion.

## Historical checkpoints retained below

# Current checkpoint: native a812 release fixes verified, release NO-GO

Both exact a8129e8 native artifacts passed targeted current-source acceptance. iOS: five maximum-text audit contexts, ten routing cases and three real normal-clock notification lifecycle taps. Android: 34 retained assertions, five-photo persistence/limits, encoded targets and maximum-text navigation. Existing data and frozen scheduled fixture preserved. [Current evidence and remaining gates](docs/qa/SB121_A812_NATIVE_CHECKPOINT.md).

Full Android lint and scoped-offline preparation continue separately. Strict OS-wide offline, manual screen readers, blocked current full-draft restore, linked 09:00 delivery, security disposition, signing and owner physical/release gates remain open. No physical testing before virtual completion.

## Earlier checkpoints, preserved for provenance

# CasitaDex - authoritative Mac integration status

November 6, 2026 UTC. FA-MAC-DEV-01 exclusively. Authorized branch `work/cd-sb41-edit-targeting-20261104`. **Release NO-GO.**

## Photo-limit recovery in progress

Current corrected iOS native testing saved five photos, preserved their bytes through process relaunch, and passed viewer Next/Previous/Close. A sixth import was safely rejected by the data layer, but the picker buttons remained enabled. The bounded fix now disables all seven draft/detail picker entry points at five and explains how to add another, while preserving removal and replacement.

- PASS: 419 automated tests (414 pass, 5 existing skips), 4 focused photo-limit cases, typecheck, lint and diff checks.
- Native acceptance of this source change is PENDING a rebuilt artifact. Earlier corrected runtime photo results belong to `87cb5b1`, not this new fix.
- No source deletion, physical testing, production change or frozen reminder mutation.

## Corrected four-tab Android Home verified and visible
Application source `87cb5b12fac0e36642b070c9b4bc150f740218bc` is pushed and remote-verified. The owner-confirmed Home was selectively recovered from the preserved dirty prototype, retaining newer functional fixes. The explicit baseline gate compares owner pixels, editable Figma review frames, actual source/browser behavior, separate worktree inputs and the installed artifact, not SHA alone.

- PASS: 410 tests with 5 existing skips, 34 focused tests, typecheck/lint/browser; one clean-source Android Release build (1m33s), complete no-Firebase graph, unchanged QA signer and APK alignment.
- APK `c91444c61aba559e04a03dc366a194d6e8e5618aa4c18ad03137b6f0d316e174` was upgraded in place on the preserved virtual device after a verified complete rollback copy. Installed bytes match.
- PASS: live native Home has exactly Home / Photos / Reminders / Find, Settings and all four enabled actions. Find and Settings both reach Browse all memories, and the pre-upgrade memory opens with its exact answer. Returned to Home for display.
- Scope is bounded Home recovery. Other native journeys, corrected iOS acceptance, accessibility and release gates remain OPEN. No physical testing, old-source deletion, host-network change or frozen iOS mutation occurred. Exact operational reservation and raw device evidence remain private on the Mac.
- [Native baseline gate and evidence](docs/qa/SB121_CURRENT_NATIVE_HOME_GATE.json). [Source reconciliation](docs/qa/WORK_SB121_CURRENT_HOME_RECONCILIATION.md). No remote status checks/workflows were returned for the application commit.

## Corrected four-tab iOS Home and save/relaunch verified
Source `04f320257082c928706a6d6b1734c849f1c5ac92` is runtime-equivalent to `87cb5b1`. One Release arm64 simulator build passed in 3m08; installed executable and JS bytes match. Existing native project/locks, tracked source and frozen reminder artifacts remain unchanged.

- PASS: actual native Home pixels and exact four-tab labels independently confirmed by official XCTest; one Home accessibility audit, zero issues, default text only.
- PASS: Home Add Memory -> Save -> process relaunch -> Find -> Browse -> exact answer. Settings -> Browse also retains the saved item. Returned app to Home on the separate simulator.
- Display limitation: Device Hub still selects a stopped older device; live current-window selection is not claimed. Select the top current-four-tab QA row. Native tests and captured screenshot review completed independently.
- [iOS evidence and explicit limits](docs/qa/SB121_CURRENT_IOS_HOME_GATE.json). Full app, large-text/landscape, manual screen-reader, photo/backup/offline and release gates remain open. No physical testing or frozen-device mutation occurred.

## Historical security/readiness source candidate

Source `3b526f6976d0d9becafd16ede2fd12ba89216ff4` adds a supported dev-only Zod advisory fix, preserves inherited iOS scene configuration, and adds bounded accessibility semantics.

- PASS: 409 tests (404 pass, 5 existing skips), 18 focused accessibility behavior tests, typecheck/lint, config regressions, online Doctor 21/21 at the unchanged SDK graph, native integration preflight, separate Release arm64 simulator compilation and web export.
- Fresh isolated iOS generation reproduces scene support and privacy strings. Its clean Pods/full compile is not yet qualified. Candidate compilation used the existing verified generated workspace.
- Candidate is not installed or native/VoiceOver accepted. Compiler ad-hoc signature is not distribution signing. See [security/accessibility/readiness report](docs/qa/WORK_SB121_SECURITY_ACCESSIBILITY_READINESS.md) and [manifest](docs/qa/SB121_READINESS_EVIDENCE_MANIFEST.json).
- npm inventory reduced 15 to 14 affected entries; OSV independently confirms the same four remaining advisories. Decoder reachability and tooling compatibility caveats remain, with security disposition open.

## Historical staging Android artifact and virtual-first gate

- Fresh isolated staging Release arm64 APK built from clean snapshot `9fd52ae1fac7d38babb57b393acebd426d830159`; all 698 tracked files matched. SHA-256 `330b9acd883f4a6b6469a94b026dcc5aec049ac96f9b7123fb1371f17dcfe93d`.
- PASS: build, complete 217-component release graph without Firebase, non-debuggable staging identity, public QA signature verification, APK 16 KiB alignment and all 23 native ELF alignments. This is not a store-signed artifact or native acceptance.
- This staging artifact is historical and is not the corrected displayed APK. Its native Development-only feature restriction was preserved; it does not qualify current Home or full native journeys.
- **Owner restriction: complete all required emulator/simulator tests before any physical-phone testing.** No physical install/test occurred. All builds and tests remain exclusively on the Mac mini. Host networking stays unchanged.
- See [Android preparation and remaining gates](docs/qa/WORK_SB121_ANDROID_CANDIDATE_PREPARATION.md) and [artifact manifest](docs/qa/SB121_ANDROID_CANDIDATE_EVIDENCE_MANIFEST.json).

## Frozen scheduled native test

Installed runtime remains `c2d123977b5fff3c20e695070340a90b2d4b6e1c`, with the previously verified photo, backup preparation/share, five bounded official accessibility contexts and actual maximum-text Add/Save/persistence evidence. Historical b30c951 provider-save/restore and notification evidence remains separately scoped.

Three linked-memory native requests are due November 6 at 09:00 CST / 15:00 UTC. **Do not replace this runtime with the newer candidate before delivery/tap qualification.** Follow the [09:00 continuation handoff](docs/qa/SB121_LINKED_0900_CONTINUATION.md). This continuation made no simulator/notification/data/clock changes.

Open gates: actual linked delivery/taps; candidate native/VoiceOver and focus/motion acceptance; strict iOS offline; fixed-action/navigation/share and broader Figma parity; permission recovery/untested deferrals; dependency-security disposition; distribution identity/signing, disclosures and owner physical-iPhone signoff. Prior Android evidence is preserved, not relabeled as current-candidate qualification.

No production deployment, release merge, store submission, live purchase, production Firebase write or other-machine work.

## SB121 overnight release fixes, 2026-11-06
- Security source commit: 408d5958d1083f62b97c254e392a1981457b0140. Official decoder 0.5.1 replaces vulnerable 0.2.2 through a hash-guarded compatibility bridge; native package versions and Xcode/Pod inputs unchanged. Clean install, source integrity, negative drift, frozen differential oracle and actual Metro-load guards verified. Remaining moderate tooling advisories are open.
- Large-text landscape source: replaced percentage tab wrapping with explicit one-row/four-tab or two-row/two-tab layout, preserving Home, Photos, Reminders and Find. Browser geometry is supporting evidence, not native acceptance.
- Combined source: 463 tests, 458 passed, five existing skipped, zero failed; TypeScript, ESLint, eight geometry proxies and iOS reminder-integration guards pass. Expo Doctor is 20/21 in the authoritative Swift-only environment: CocoaPods version check fails. No Ruby/Pod installation or native regeneration was attempted.
- At that earlier checkpoint the installed runtime was 9e53d5b; the current a812 acceptance above supersedes this pending-build status. Its actual normal-clock foreground/background/terminated notification taps and maximum-text portrait Home audit passed. The landscape defect was then awaiting native verification; the current checkpoint above records its native closure. See docs/qa/SB121_CORRECTED_IOS_ACCEPTANCE_20261106.md.
- Release remains NO-GO: current iOS/Android native regression, landscape, offline, remaining accessibility/security, protected09:00 delivery, signing and owner physical acceptance gates remain open. No production or physical-phone action authorized by this checkpoint.
