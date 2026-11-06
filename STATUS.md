# CasitaDex - authoritative Mac integration status

November 6, 2026 UTC. FA-MAC-DEV-01 exclusively. Authorized branch `work/cd-sb41-edit-targeting-20261104`. **Release NO-GO.**

## Current Home recovery, pending review
The owner-confirmed four-tab Home existed in a separate dirty checkout. It is now selectively reconciled into this uncommitted candidate without replacing newer data/reminder/accessibility fixes. PASS: inspected web layout, exact tab/actions/browse checks, 34 focused tests, 415 full tests (410 pass, 5 existing skips), typecheck and lint. Native builds/acceptance NOT RUN for this candidate. [Reconciliation and correction](docs/qa/WORK_SB121_CURRENT_HOME_RECONCILIATION.md). Release remains NO-GO; frozen scheduled iOS runtime is unchanged.

## Verified source candidate

Source `3b526f6976d0d9becafd16ede2fd12ba89216ff4` adds a supported dev-only Zod advisory fix, preserves inherited iOS scene configuration, and adds bounded accessibility semantics.

- PASS: 409 tests (404 pass, 5 existing skips), 18 focused accessibility behavior tests, typecheck/lint, config regressions, online Doctor 21/21 at the unchanged SDK graph, native integration preflight, separate Release arm64 simulator compilation and web export.
- Fresh isolated iOS generation reproduces scene support and privacy strings. Its clean Pods/full compile is not yet qualified. Candidate compilation used the existing verified generated workspace.
- Candidate is not installed or native/VoiceOver accepted. Compiler ad-hoc signature is not distribution signing. See [security/accessibility/readiness report](docs/qa/WORK_SB121_SECURITY_ACCESSIBILITY_READINESS.md) and [manifest](docs/qa/SB121_READINESS_EVIDENCE_MANIFEST.json).
- npm inventory reduced 15 to 14 affected entries; OSV independently confirms the same four remaining advisories. Decoder reachability and tooling compatibility caveats remain, with security disposition open.

## Current Android artifact and virtual-first gate

- Fresh isolated staging Release arm64 APK built from clean snapshot `9fd52ae1fac7d38babb57b393acebd426d830159`; all 698 tracked files matched. SHA-256 `330b9acd883f4a6b6469a94b026dcc5aec049ac96f9b7123fb1371f17dcfe93d`.
- PASS: build, complete 217-component release graph without Firebase, non-debuggable staging identity, public QA signature verification, APK 16 KiB alignment and all 23 native ELF alignments. This is not a store-signed artifact or native acceptance.
- Current APK emulator tests NOT RUN; fresh dedicated virtual device is prepared, not booted, pending the shared Android lane. Prior Android runtime evidence remains historical.
- **Owner restriction: complete all required emulator/simulator tests before any physical-phone testing.** No physical install/test occurred. All builds and tests remain exclusively on the Mac mini. Host networking stays unchanged.
- See [Android preparation and remaining gates](docs/qa/WORK_SB121_ANDROID_CANDIDATE_PREPARATION.md) and [artifact manifest](docs/qa/SB121_ANDROID_CANDIDATE_EVIDENCE_MANIFEST.json).

## Frozen scheduled native test

Installed runtime remains `c2d123977b5fff3c20e695070340a90b2d4b6e1c`, with the previously verified photo, backup preparation/share, five bounded official accessibility contexts and actual maximum-text Add/Save/persistence evidence. Historical b30c951 provider-save/restore and notification evidence remains separately scoped.

Three linked-memory native requests are due November 6 at 09:00 CST / 15:00 UTC. **Do not replace this runtime with the newer candidate before delivery/tap qualification.** Follow the [09:00 continuation handoff](docs/qa/SB121_LINKED_0900_CONTINUATION.md). This continuation made no simulator/notification/data/clock changes.

Open gates: actual linked delivery/taps; candidate native/VoiceOver and focus/motion acceptance; strict iOS offline; fixed-action/navigation/share and broader Figma parity; permission recovery/untested deferrals; dependency-security disposition; distribution identity/signing, disclosures and owner physical-iPhone signoff. Prior Android evidence is preserved, not relabeled as current-candidate qualification.

No production deployment, release merge, store submission, live purchase, production Firebase write or other-machine work.
