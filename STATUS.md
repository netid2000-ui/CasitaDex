# CasitaDex — authoritative Mac integration status

November 5–6, 2026 · FA-MAC-DEV-01 exclusively · FA-Development external SSD · authorized branch `work/cd-sb41-edit-targeting-20261104`.

**WORK-SB120–121 · PARTIAL QUALIFICATION · Release NO-GO.** Current built application/dependency source is `c2d123977b5fff3c20e695070340a90b2d4b6e1c`. It includes the earlier iOS notification routing, native backup sharing and identity-transport fixes, plus verified supported SDK 57 patch alignment.

- Source gates pass: online Expo Doctor 21/21, TypeScript, ESLint, 389 tests (384 pass, 5 existing skips), installed Router 5/5, dependency tree, web export, native integration preflight and scoped secret scan.
- New Release arm64 simulator graph built, installed and hash-verified. Native photo viewer/persistence and full-backup preparation/share passed; share canceled honestly. Five bounded official accessibility audit contexts passed, including cold-launched maximum text; actual maximum-text Add/Save and persistence also passed. Full accessibility/VoiceOver/Figma acceptance remains open.
- Three linked memories and exact native requests are prepared for November 6 at 09:00 CST / 15:00 UTC. Delivery and exact tap targets remain pending; see [scheduled continuation handoff](docs/qa/SB121_LINKED_0900_CONTINUATION.md).
- Evidence: [current follow-up qualification](docs/qa/WORK_SB121_FOLLOWUP_QUALIFICATION.md), [original SB120–121 execution](docs/qa/WORK_SB120_121_EXECUTION.md) and [original manifest](docs/qa/SB120_121_EVIDENCE_MANIFEST.json). Historical b30c951 normal-clock standalone, real Photos/provider-save/restore and large-text proof remains scoped to that runtime. Prior Android evidence is preserved.
- Seven SDK patch mismatches are closed. Dependency audit improved 22 to 15 affected entries, but security disposition remains open. No incompatible plain override was applied; native exploitability of the remaining decoder chain is not established.
- Remaining gates: linked 09:00 delivery/taps, permission recovery and untested deferral paths, strict iOS offline, full accessibility/responsive/Figma acceptance, dependency-security disposition, signed distribution and owner physical-iPhone signoff. Shared-host network settings were not changed to imitate offline testing.

No production changes, release merge, store submission, live purchase, other-host job or production Firebase write.
