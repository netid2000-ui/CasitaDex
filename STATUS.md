# CasitaDex - authoritative Mac integration status

November 6, 2026 UTC. FA-MAC-DEV-01 exclusively. Authorized branch `work/cd-sb41-edit-targeting-20261104`. **Release NO-GO.**

## Corrected four-tab Android Home verified and visible
Application source `87cb5b12fac0e36642b070c9b4bc150f740218bc` is pushed and remote-verified. The owner-confirmed Home was selectively recovered from the preserved dirty prototype, retaining newer functional fixes. The explicit baseline gate compares owner pixels, editable Figma review frames, actual source/browser behavior, separate worktree inputs and the installed artifact, not SHA alone.

- PASS: 410 tests with 5 existing skips, 34 focused tests, typecheck/lint/browser; one clean-source Android Release build (1m33s), complete no-Firebase graph, unchanged QA signer and APK alignment.
- APK `c91444c61aba559e04a03dc366a194d6e8e5618aa4c18ad03137b6f0d316e174` was upgraded in place on the preserved virtual device after a verified complete rollback copy. Installed bytes match.
- PASS: live native Home has exactly Home / Photos / Reminders / Find, Settings and all four enabled actions. Find and Settings both reach Browse all memories, and the pre-upgrade memory opens with its exact answer. Returned to Home for display.
- Scope is bounded Home recovery. Other native journeys, corrected iOS acceptance, accessibility and release gates remain OPEN. No physical testing, old-source deletion, host-network change or frozen iOS mutation occurred. Exact operational reservation and raw device evidence remain private on the Mac.
- [Native baseline gate and evidence](docs/qa/SB121_CURRENT_NATIVE_HOME_GATE.json). [Source reconciliation](docs/qa/WORK_SB121_CURRENT_HOME_RECONCILIATION.md). No remote status checks/workflows were returned for the application commit.

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
