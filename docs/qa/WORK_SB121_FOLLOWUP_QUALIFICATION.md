# WORK-SB121 follow-up qualification

November 5–6, 2026, America/Chicago. FA-MAC-DEV-01 only, via AI Commander. Branch `work/cd-sb41-edit-targeting-20261104`. **Release remains NO-GO.** This report supplements, rather than replaces, the immutable [SB120–121 report](WORK_SB120_121_EXECUTION.md).

## Implemented and verified SDK 57 alignment

Application/dependency commit: `c2d123977b5fff3c20e695070340a90b2d4b6e1c`, based on published checkpoint `aecdde8c70e04f2e3737b9226aa6fa69c92a42fb`. Only package.json and package-lock.json changed. No unsupported major SDK migration, arbitrary dependency override, design change or production action.

Exactly pinned expo 57.0.32, expo-build-properties 57.0.23, expo-constants 57.0.23, expo-image-picker 57.0.21, expo-router 57.0.30, expo-sharing 57.0.25 and expo-splash-screen 57.0.11. Required ExpoModulesCore is 57.0.25 and autolinking 57.0.17. An unrelated optional gesture-handler refresh was excluded; 3.4.0 remains installed and locked. Lockfile SHA-256: `90c813cbe0d057b1473090e39a1d71e8678eb3773cac725a4bd447237734e00f`.

Verification:
- Online Expo Doctor 21/21, with EXPO_OFFLINE explicitly unset. The former seven-patch mismatch gate is closed for this graph.
- 389 tests: 384 pass, 5 existing optional fixture-dependent skips, 0 failures. Actual installed Router decode-contract tests 5/5 pass before and after.
- TypeScript, ESLint, installed dependency tree, diff checks, web export and scoped redacted secret scan pass.
- Published package metadata/diffs, graph review, logs and 61-file dependency manifest are under `QA-Evidence/WORK-SB121/followup-dependencies` on the external SSD. The existing skips are not represented as passes.

## Native graph and artifact provenance

A scoped official CocoaPods refresh aligned the changed SDK pods. Before/after locks are preserved. Mandatory native integration verification confirmed the custom reminder pod, module and app-delegate subscriber. Release arm64 iOS Simulator build a8bcdc1320cf3f36 exited 0 in 120 seconds using the shared heavy-build lock. No distribution signing was performed.

- Build: `Apple-Builds/CasitaDex-WORK-SB120/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app`.
- Executable SHA-256: `54b3d6e796ede11214321ea7a4aa27274c0339e7fce9e0945f03b5db115357e9`.
- JS SHA-256: `2dc3934db02fa1530c36c7b81c2abec5189c957c48200cd7ea15b340193f1aea`.
- Installed bundle: `com.designsbyfa.casitadex.dev`, dedicated simulator `7DB01BF8-2C97-486A-A908-DA8F9E81FE8C`. Installed executable/bundle were compared byte-for-byte with the build.
- Prior b30c951 app preserved at `QA-Evidence/WORK-SB121/followup-native/CasitaDexDev-sb120-b30c951.app`. Historical hashes/evidence remain historical; they do not certify the changed SDK graph.
- Build, generated-pod and web-export logs: `QA-Evidence/WORK-SB121/followup-native`.

## Native functional and accessibility checks

- Native photo viewer on the new artifact: open first photo, Next, Previous and Close all passed; existing saved answer persisted. Job dce8f55e1f6b6c3d exited 0.
- Full v4 backup preparation/verification and native share sheet passed with Save to Files offered. Share was deliberately canceled; no external provider save or fresh restore is claimed. The 6,643-byte archive at that checkpoint contains six memories, two photos and seven reminders, exactly matches the then-current collection/draft, and all photo hashes verify. SHA-256: `836d61b3e871f55af4e320370f4660e723fc812c0ca3def8ef45cd1140017311`. Later synthetic additions do not alter that historical archive proof. Earlier real provider-save/restore evidence remains in the original SB120 report.
- An isolated official XCTest UI target was built from a copied project using Swift/Foundation structural handling. Actual app source/project was not modified. Five useful per-view `.all` audits passed with no filtered or reported issues: linked-memory detail portrait, Home normal, blank Add, linked-memory detail landscape, and Home after a genuine maximum-text cold launch. All exact installed hashes matched.
- The first warm maximum-category run also passed, but unchanged heading geometry made it insufficient for enlarged-text evidence. The fresh cold launch produced a Home heading 350×719.7 points versus normal 350×40.3, and the repeat audit passed. This distinction is retained, not hidden.
- Native landscape screenshot `navigation/charlie-landscape-before-audit.png` shows full title/answer, Review answer and all five tabs. The XCTest-exported landscape screenshot has inconsistent orientation metadata and a cropped presentation; preserve it as a capture limitation, not an application defect or visual acceptance artifact.
- Full `.xcresult`, unfiltered issue JSON, before/after trees, native screenshots, provenance and reports are under `QA-Evidence/WORK-SB121/ios-accessibility-audit-harness-20261106`. SQLite logical dump remained unchanged during the audit navigation. Apple simulator duplicate accessibility-class warnings were retained; audits still completed successfully.
- Maximum-text native Add/Save passed on the actual enlarged cold process: scroll to Add Memory, fill both fields, reach and tap Save memory, then confirm the new synthetic record after normal-text cold relaunch. Job 13243617c40212d7 exited 0. New record `e_mw4cew75_5315guphpy`, title “SB121 maximum text follow-up”. All previous six memory records, seven standalone reminders and both photo files remained unchanged. Final app is terminated, simulator booted, portrait and original large category restored; all three linked native requests still match the future due instant. Evidence: `followup-native/maxtext-*` and `final-preservation-proof.json`.

These checks do not replace complete VoiceOver, all-screen responsive/Figma acceptance, real offline testing or physical-device signoff. No accessibility issue was hidden merely to obtain a pass.

## Normal-clock linked reminders prepared

Three valid synthetic memories were created through the native Add Memory form on the new artifact, due November 6 at 09:00 CST / 15:00 UTC. Native OS pending-request readback confirmed all exact IDs, kind `memory`, and epoch 1793977200000. Request date plus time-interval trigger independently matches the due instant. Existing three memories, seven standalone reminders and two photo files remained unchanged through reinstall and fixture creation. A subsequent maximum-text test added one separate synthetic memory, leaving seven total; all original and linked-fixture records are unchanged.

The pushed [09:00 continuation handoff](SB121_LINKED_0900_CONTINUATION.md) records identifiers, runtime hashes, screenshots, preservation assertions, request plist and read-only decoder. Setup is PASS; actual delivery/taps remain PENDING until the real due time. Never substitute a changed host clock or injected push. Three alerts on one simulator permit taps in three lifecycle states, but cannot prove simultaneous delivery in three different states. Correlate generic notification taps with their exact OS request/source IDs.

## Strict offline boundary

Strict iOS radio-off/network-isolated native journeys were NOT RUN. Installed simctl UI/status-bar controls do not isolate network traffic, and Simulator uses the host network. No Network Link Conditioner was installed. App-local SQLite, photo paths, bundled JS and absence of direct product network calls are architectural evidence, not a runtime negative-network control.

The shared Mac's firewall, PF rules, routes, interfaces, proxies and security/network settings were not changed. Such changes could interrupt remote access and Event Command QA, and require separate action-time approval. Keep the true offline gate for an owner-controlled physical iPhone or another explicitly approved isolated test route: verify no connectivity, cold launch, retrieve/edit/save/relaunch, view local photos, and local Files backup/review/restore. Physical-iPhone final acceptance remains the owner’s decision.

## Dependency security review and limitations

Audit inventory improved 22 → 15 affected entries (4 high, 11 moderate, 0 critical). The npm production dependency graph has 7 affected entries (3 high); this graph also contains tooling and is not the same as the shipped native bundle. Counts include affected parent entries, not distinct vulnerabilities.

The remaining query-string/decode-uri-component chain is a runtime dependency. Native exploitability is **not established**: the configured Expo inbound parser uses URLSearchParams, and isolated probes made zero vulnerable-decoder calls on that path. A vendored React Navigation fallback invokes the decoder, but no app-specific activation of that fallback was found. This is a reachability caveat, not proof that all possible inputs are safe.

No bare override was applied. Officially fixed decode-uri-component 0.5.1 is ESM-only; inserting it under query-string 7.1.3 throws `decodeComponent is not a function`. query-string 9.5.1/10.0.0 likewise break Router 57’s named-member imports with `queryString.stringify is not a function`. Replayable executable probes and a 51-file hashed report are under `followup-dependencies/decoder-research`. A maintained interop backport or supported Router migration needs its own compatibility/native qualification. Even an adapter changes fragment-plus behavior.

Remaining tooling findings include glob/minimatch branches and development-only Zod. No `npm audit fix --force`, obsolete downgrade or unreviewed major migration was used. Advisory sources and exact installed-package reachability are in `DEPENDENCY_HANDOFF.md` and `decoder-research/DECODER_REMEDIATION_REVIEW.md`. The security release gate remains open pending a supported remediation or explicit risk disposition.

## Release gates and next steps

Closed here: seven SDK patch mismatches, online Doctor gate, new native graph integration/build/install, and the bounded tests explicitly reported above.

Still open: actual normal-clock linked 09:00 delivery/tap qualification; reminder permission recovery and untested save/failure deferral paths; strict iOS offline; full VoiceOver, responsive/all-screen and Figma acceptance; dependency-security disposition; signed distribution; owner physical-iPhone final signoff. Existing Android photo/backup/offline proof is preserved and was not needlessly repeated. Literal-percent transport defensive tests do not automatically qualify separate Android/in-app paths.

Shared Mac heavy builds were serialized, dedicated iOS resources reserved, and Event Command's emulator/ADB/Firebase jobs preserved. Master/product charters, mobile-design/tool-efficiency guidance and release SOP controlled scope. Implementation, architecture, dependency security, native QA, accessibility and documentation reviews are reflected above; product strategy, Figma design authority and commercial/distribution permissions did not change. No production deployment, release merge, store submission, live purchase, production Firebase write, other-machine job or destructive important-data change occurred.

## Evidence publication

The [follow-up evidence manifest](SB121_FOLLOWUP_EVIDENCE_MANIFEST.json) records hashes of retained evidence and principal native artifacts. Existing original-manifest files were not overwritten. Documentation-only commits after c2d1239 do not change the tested runtime. The authorized github feature branch is the only push destination; the local-bundle origin is not used. No remote CI success is inferred from a clean push.
