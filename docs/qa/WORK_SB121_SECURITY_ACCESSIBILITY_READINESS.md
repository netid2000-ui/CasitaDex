# WORK-SB121 security, accessibility and distribution preparation

November 6, 2026 UTC. FA-MAC-DEV-01 only, authorized feature branch `work/cd-sb41-edit-targeting-20261104`. **Release remains NO-GO.** Starting checkpoint: `f068a0d8895acb09168681824ea592d81a730ad5`.

## Source changes and verification

| Commit | Bounded change | Evidence |
| --- | --- | --- |
| `021b62c8c3588286d81feb3951fbb57096b3ee9d` | Fix the development-only Zod advisory by changing its supported lock entry from 3.25.76 to 4.6.6. | Exactly three lock-entry fields changed. Package.json and every other lock field are identical; real compiler/rule/schema consumer checks, lint, typecheck, tests, dependency tree and online Doctor passed. |
| `5d10e13c69fae9a83a5ea13a2ff8f0a9bf6528df` | Preserve inherited native plugins, including the declared iOS scene-support plugin, while keeping managed plugins unique and privacy options intact. | Config tests 4/4; original configuration fails the new regression. Actual Expo dev/staging evaluation passes; production, Production, prod and preview reject. Fresh isolated iOS generation reproduces the scene manifest and camera/photo purpose strings with no microphone purpose. |
| `3b526f6976d0d9becafd16ede2fd12ba89216ff4` | Add expanded disclosure semantics, bounded foreground iOS status announcements, photo accessibility escape and conservative Reduce Motion. | Focused behavioral tests 18/18; typecheck/lint pass; full suite 409 total, 404 passed, 5 existing optional skips, 0 failed. |

Final candidate lock SHA-256: `9497dfde8721e0ac91ea3d7acf7a597117917d7cd5b1b94bc1d433f49a5282ac`.

The announcement helper speaks only changed app-owned status copy, uses a generic message for unknown errors that may contain private content, stays quiet during autosave/loading and outside active iOS, and avoids replay after backgrounding. A reviewed background-deduplication edge case has an explicit regression. Existing populated statuses are deliberately quiet at mount; this does not establish announcement coverage for conditional initial error panels. Photo index/zoom speech was not added, avoiding pinch chatter. Actual VoiceOver delivery, focus and motion behavior still require current-candidate native testing.

## Native preparation and candidate build

The config defect was real: app.json declared expo-build-properties with enableSceneSupport=true, but app.config.js replaced the plugin array. The existing generated native tree could therefore mask fresh-generation divergence.

Fresh generation job `880ac459197d40b3` exited 0. It used an immutable archive of 5d10e13 in `Apple-Builds/CasitaDex-SB121-SceneRepro-5d10e13/source` and `expo prebuild --platform ios --no-install`. It generated a scene manifest and preserved camera/photo wording with no microphone permission. Existing generated Info.plist and AppDelegate hashes stayed unchanged. This was generation only: no Pods install, compile, signing or device action.

Candidate build job `9e68f86b8f380f13` exited 0 in 206.4 seconds, including web export. It compiled source `3b526f6976d0d9becafd16ede2fd12ba89216ff4` using the existing verified generated workspace, Release arm64 simulator, two build jobs and a separate DerivedData path. Native reminder integration preflight passed. It did not install or launch an app.

- Candidate: `Apple-Builds/CasitaDex-SB121-Readiness-3b526f6/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app`.
- Executable SHA-256: `9d7c35b41f5a7a65457b91f3772c380a9fa58fa101288ac77b7ca2fd64165a3a`.
- JS SHA-256: `c694559dd0db70f0de1685b3247d852eb8e594643c03dbfbf7306c65ad3ce68a`.
- Metadata: com.designsbyfa.casitadex.dev, version 0.1.0 (1), iphonesimulator27.2, minimum iOS 16.4, EXExpoAppSceneDelegate present.
- Xcode signing was disabled. Read-only codesign display reports the compiler/linker's ad-hoc signature, no team and no sealed resource signature. This is not a distribution-signed artifact, and no credential/account signing operation was performed.
- The original c2d1239 executable and bundle still match their independent frozen copy byte-for-byte. This build used neither the original DerivedData output nor any simulator.

The fresh-generation check and candidate compilation are separate proofs: the newly generated isolated project has not received a fresh Pods install/full compile. New candidate runtime/VoiceOver acceptance is NOT RUN. Build and web-export success are not substitutes for it. Full logs and artifact metadata are under `QA-Evidence/WORK-SB121/readiness-candidate-build`.

## Security assessment

npm audit improved from 15 to **14 affected entries**, now 3 high and 11 moderate. The npm production dependency inventory is unchanged at 7 affected entries; it includes build tooling and is not a shipped-binary inventory. Counts include affected parents, not distinct vulnerabilities.

Independent OSV Scanner 2.7.0 scanned 812 packages from the exact lock in 1.67 seconds. It found four advisories across decode-uri-component 0.2.2, glob 13.0.6 and minimatch 10.2.6, matching npm's remaining direct advisories exactly. No additional finding appeared.

- The decoder is a runtime dependency. CasitaDex's configured Expo incoming parser uses URLSearchParams and bypassed the vulnerable decoder in the recorded probes. Vendored fallback activation and native exploitability remain unproven; this is not an assertion of universal input safety.
- Fixed decoder 0.5.1 is ESM-only. A bare override breaks query-string 7.1.3; later query-string majors break Router 57 imports. A maintained interop backport needs separate installed-module, Metro/Hermes and native-routing qualification.
- Inspected glob/minimatch paths are build/lint tooling. No supported same-major fixes were found; cross-major overrides need compatibility work. No force audit fix, unreviewed major migration or deceptive severity suppression was applied.

Evidence: `QA-Evidence/WORK-SB121/security-continuation/SECURITY_CONTINUATION_HANDOFF.md`, its 72-file manifest, and separate `osv-review/OSV_REVIEW.md` with a 21-file manifest. The security release gate remains open for supported remediation or explicit risk disposition.

## Figma and accessibility reconciliation

Read-only inspection used the actual CasitaDex authority file `39uzN0SZX8nlmcGDcHdQhr`, not Event Command. Relevant verified targets:
- [A.2 Home 69:109](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=69-109)
- [Add Memory 124:3](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=124-3)
- [Detail 263:2](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=263-2) and [edit 263:120](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=263-120)
- [Approved register 271:2](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=271-2)

The SB40 large-text node 280:114 is an Appearance & Accessibility review screen, not Home/Add/detail acceptance. Its presence cannot certify those screens. Some approved frames are fixed/clipped rather than functional responsive prototypes; frame names are not native behavior proof.

Still-open parity findings include persistently visible Add Save; fixed detail Back/Edit and edit Save/Cancel; separate share flow; Home/logo navigation and exact token/exception reconciliation. These are older tracked gaps, not newly introduced regressions. Existing Add Save is reachable after scrolling, including proven maximum-text saving on frozen c2d1239; that does not satisfy fixed visibility. Do not reinstate old draft-choice popups or removed Home reminder previews contrary to later owner simplification.

The new semantic patch does not change these layouts or claim they are accepted. Full VoiceOver focus order/restoration, rotor behavior, modal containment, actual speech, every text-size/theme/orientation combination and owner physical-device acceptance remain open. Detailed node/source/native evidence matrix: `QA-Evidence/WORK-SB121/figma-voiceover-reconciliation-20261106/RECONCILIATION_REPORT.md` and `PATCH_HANDOFF.md`.

## Signing and distribution preparation

Current configuration deliberately permits only development/staging identities and internal/simulator EAS profiles. Production/store configuration remains unavailable. No private key, keystore, credential store, account console, certificate/profile import or provisioning action was used.

The read-only readiness audit inventories 10 privacy manifests from the existing simulator artifact and records concrete gaps: no verified distribution certificate/profile/team; no current Android generated release/signing graph; unresolved version/build policy, public privacy/support disclosures, export-compliance answers, naming/metadata and owner physical-iPhone acceptance. Simulator compilation does not qualify physical-device signing or store delivery. Local notifications alone do not justify adding an APNs entitlement.

Detailed checklist and safe later unsigned validation recipe: `QA-Evidence/WORK-SB121/distribution-preparation/DISTRIBUTION_READINESS_REPORT.md`, `CONFIG_FIX_COMPLETION.md` and `distribution-generation/fresh-generation-proof.json`. No distribution signing, credential setup, agreement acceptance, upload, submission or production action was performed. Owner decisions should be requested for precise consequential steps when needed, not as blanket access or release authority.

## Frozen normal-clock test and next gates

**Do not install the current source candidate onto the scheduled reminder simulator before the normal-clock test.** Simulator `7DB01BF8-2C97-486A-A908-DA8F9E81FE8C` retains the tested c2d1239 runtime and its seven memories, seven standalone reminders, two photos and three linked requests due November 6 at 09:00 CST / 15:00 UTC. This continuation performed no simulator launch, setting, notification, database, install, input or clock actions.

The existing [09:00 handoff](SB121_LINKED_0900_CONTINUATION.md) remains authoritative for that test. An additional byte-verified frozen app copy and original package manifests are retained at `QA-Evidence/WORK-SB121/security-continuation/frozen-c2d1239`. Historical native acceptance is not relabeled as acceptance of the new candidate.

Next: complete the scheduled exact-target delivery/tap evidence; then qualify the new candidate separately, including actual VoiceOver and motion behavior. Strict offline, full Figma/navigation parity, permission recovery/untested deferral paths, dependency-security disposition, distribution signing and owner physical-iPhone signoff remain open. Shared heavy tasks were serialized with Event Command and its devices/jobs preserved. No production deployment, release merge, store submission, live purchase, production Firebase write, other-machine work or destructive important-data change occurred.

## Evidence publication

The [readiness evidence manifest](SB121_READINESS_EVIDENCE_MANIFEST.json) identifies source, dependency lock, retained evidence and both new/frozen principal artifacts. Prior SB120 and SB121 follow-up evidence remains preserved. Only verified feature-branch source/documentation commits are pushed; no release merge or remote CI success is implied.
