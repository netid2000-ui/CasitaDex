# Latest verified acceptance: Android restore/offline; iOS repair pending — November 6, 2026

Release **NO-GO**. [Updated acceptance ledger](docs/qa/SB121_CURRENT_NATIVE_ACCEPTANCE_20261106.md) preserves the original bb235 composite matrix and adds later exact-artifact receipts.

- **PASS, bounded Android:** actual same-current-state native restore on bb235; preserving upgrade and strict emulator OS-offline Find/photo append/local export/relaunch on **5dc930e**, APK **1d7ebf35cf1e90c5d0df8952bf4ad845bcdb8778c26ee6965fc7ef47e2a9706e**. Radios/network restored and watchdog exited 0. [Milestone](docs/qa/SB121_ANDROID_NATIVE_RESTORE_OFFLINE_20261106.md).
- Android retained state now contains one saved memory, one unfinished draft with **two photos**, one reminder. Matching archive **82cbc2865e26c5e6c676e42c78d6f65c4217ab1233a8f4f7a404dbf1d9c8509e**; older one-photo archives must not replace it without new authorization.
- **VERIFIED FAIL, iOS 5dc930e:** settled landscape focus remained outside the visible pane. Normal baseline and cleanup/data preservation passed; later acceptance cases were NOT_RUN.
- Latest source **9da76aaa391d423efc25de497c18e44eb2493c0e** is a narrow iOS-only follow-up: **586 tests, 581 passed, 5 skipped, 0 failed**; 53 focused checks, typecheck/lint passed. New iOS build/native acceptance is separate and not yet claimed.

iOS restore/offline, manual screen-reader, wider native/visual, physical/owner, signing and store gates remain open. No app source or tests changed in this documentation update.

## Earlier published checkpoints retained with original artifact scope

# Verified native evidence ledger and source follow-up — November 6, 2026

Release **NO-GO**. [Timestamped native acceptance ledger](docs/qa/SB121_CURRENT_NATIVE_ACCEPTANCE_20261106.md) preserves exact artifact attribution and the original planned matrix. The 18 bb235 composite cells are **9 PARTIAL, 1 FAIL, 8 NOT_RUN**, not a test-pass percentage. Android keyboard/rotation and both platforms' bounded one-photo workflows have verified receipts; the bb235 iOS landscape focus failure remains recorded.

Newer source **5dc930e280b43e9ffe5553a8c5c63fc6aa86eacb** has reviewed focus repair and **582 tests: 577 passed, 5 skipped, 0 failed**, plus typecheck/lint. Its exact iOS build and preserving upgrade passed, including equality of nine logical tables and media. The installed pair is iOS 5dc930e and Android bb235; iOS rotation/keyboard native acceptance is separately in progress. This docs-only checkpoint does not equate source/build success with native acceptance.

- [Figma REVIEW board reconciliation](docs/qa/SB121_FIGMA_CURRENT_REVIEW_20261106.md): editable Detail/Edit/Share, masters untouched. Historical thumbnail/selector differences add no new release gates.
- [Exact 5dc iOS mapped-JavaScript assessment](docs/qa/SB121_IOS_MAPPED_RUNTIME_REACHABILITY_20261106.md): affected tooling absent from 1,269 mapped sources; raw-map recomposition unavailable; both moderate build-tool advisories remain open.
- Approved Android native restore/offline work is separately in progress; no final result is recorded here. iOS restore/offline gates remain open. Manual screen-reader, wider native/visual, physical/owner, signing and store gates remain open.

## Historical checkpoints below retain their original dates, artifacts and wording

# Latest iOS milestone: exact build and preserving upgrade verified

November 6, 2026: **bb235cdf6f2bba63b1760038a379a2c09cdf32ab** iOS Release simulator build and preserving upgrade passed; current iOS and Android QA artifacts now match this source. Prior app/data retained and logical data/media unchanged. Portrait maximum-text ordinary typing/repeated focus passed after settling, but a persistent iOS landscape rotation focus-scroll defect remains **OPEN**. [Build, upgrade, hashes and limits](docs/qa/SB121_IOS_BB235_BUILD_UPGRADE_20261106.md). Release **NO-GO**.

## Earlier verified milestones retained

# Latest archive milestone: current Android Full v4 gate verified

November 6, 2026: a fresh native Full v4 export from exact **bb235cdf6f2bba63b1760038a379a2c09cdf32ab** Android runtime passed all five opt-in archive cases: **5 passed, 0 failed, 0 skipped**. Native file import/view/close, local SAF export and draft/reminder restart readback passed. Original archive/copy hashes stayed unchanged; pre-existing saved collection data matched its preserved native baseline. [Verified archive milestone and limits](docs/qa/SB121_CURRENT_NATIVE_ARCHIVE_20261106.md).

Restore/recovery tests ran only in disposable in-memory SQLite with Map photo storage. **No actual app collection restore occurred.** This focused result does not rerun or relabel the prior full-suite skips. Other exact-artifact iOS/native, accessibility, physical and release gates remain open; release **NO-GO**.

## Earlier milestone retained

# Latest reminder milestone: a886 normal-clock linked delivery and taps verified

November 6, 2026: three linked alerts delivered at 09:00 CST / 15:00 UTC with a886 terminated. Exact-target cold/background/foreground **tap** cases and cold-launch no-replay passed; protected data/media/preferences/artifact bytes were preserved. [Verified milestone, evidence hashes and limits](docs/qa/SB121_LINKED_0900_MILESTONE_20261106.md).

Reminder evidence belongs to **a8867c0**, not latest application source **bb235cdf6f2bba63b1760038a379a2c09cdf32ab**. Changed detail/navigation/keyboard UI still needs its own exact-artifact acceptance. Literal Return was not tested. [Latest source/build and bounded Android keyboard milestone](docs/qa/SB121_VERIFIED_KEYBOARD_MILESTONES_20261106.md). Release remains **NO-GO**; physical/store gates remain open.

## Historical checkpoints retained below

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
