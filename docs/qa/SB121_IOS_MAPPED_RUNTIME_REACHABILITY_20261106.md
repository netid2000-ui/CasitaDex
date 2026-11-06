# CasitaDex 5dc930e iOS packaged-JavaScript reachability

## Result
The previously missing iOS packaged-graph evidence is now sufficient for a **strong exact-build provenance assessment**: affected tooling package sources are absent from the retained composed map for the exact requested 5dc930e iOS Simulator app. The map is linked by the successful stock build log to the compiler invocation, and retained compiler input is cryptographically bound to the packaged Hermes payload. This closes the narrow missing-inventory evidence gap for this artifact, not the overall security gate.
Independent raw-map recomposition is **NOT RUN / unavailable** because the unmodified stock React Native script deleted both intermediates after composition. This is a materially weaker reproducibility guarantee than Android's separately retained raw-map chain. It is not a signed or tamper-resistant build attestation.

## Identity and hashes
Runtime commit: 5dc930e280b43e9ffe5553a8c5c63fc6aa86eacb.
Variant: unsigned Release arm64 iOS Simulator, development bundle ID com.designsbyfa.casitadex.dev. It is not an owner physical-iPhone acceptance or store artifact.
App: Apple-Builds/CasitaDex-SB121-DetailShare-5dc930e/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app.
Executable SHA-256: 5ccb166102dbfc6bfa9bf8c27e2cb972df96db8709a2c837d0c7381d5a8d4543.
Packaged Hermes main.jsbundle SHA-256: 69b3b8a61de0d03f78310aeae628641c3d8a6ea7ba98ae3c6eda3e24debb547c.
Retained pre-Hermes main.jsbundle SHA-256: e7a9d162f672e2e596a17e5c50831ece3a03ec954d32e71a8fb6a188ea6e217b.
Retained composed source map SHA-256: 5b71240638b4a056b684bf932da36e8e8b0bbbd401a3aedacb30bbdfaa9c6bbe.
Every value matches the existing build-completion receipt. Pre-Hermes input SHA-1 f4b72643b3f0722f2836b55c8b33c6802558da90 exactly equals the packaged HBC's embedded input hash. SHA-256 file identities supplement Hermes' SHA-1 field.

## Exact-build map provenance
The original Xcode log records Metro exporting the retained input and intermediate Metro map at lines 46937–46943, Hermes compiling that input directly into this app/main.jsbundle with -output-source-map at line 46953, stock compose-source-maps.js composing the Metro and compiler maps into the retained QA-Evidence output at line 47073, then stock deletion of those raw maps at lines 47074–47075. The retained React Native react-native-xcode.sh lines 125–137 and 176–184 implement this supported SOURCEMAP_FILE flow. Exact source/log hashes and excerpts are preserved in evidence.json and build-chain-log-excerpts.json.
The retained JS sourceMappingURL names main.composed.jsbundle.map. Its debug ID is present in the JS trailer but not retained as a field in the composed map; no independent debug-ID equality claim is made. HBC header function count and composed-map function-offset count both equal 12692, a consistency check rather than a standalone binding proof.
The stock composition output is accepted on the corroborated successful-build provenance above, NOT represented as freshly recomposed or cryptographically signed. Neither missing raw map was regenerated; all inputs were preserved.

## Inventory and controls
The composed map lists 1269 sources. It contains zero paths under glob, minimatch, @expo/fingerprint, @typescript-eslint, eslint-config-expo or eslint-plugin-expo. This supports **not included in this exact mapped iOS packaged JavaScript graph** for the remaining affected tooling packages.
Positive controls were checked against actual retained source files: src/use-ios-focus-scroll.ts (current focus repair), patched query-string/index.js and official decode-uri-component/index.js each match their map sourcesContent SHA-256 exactly. The runtime decoder is not conflated with excluded build tooling. This is not a new functional or adversarial decoder test.
No claim covers native Swift/Objective-C/C++ dependencies, copied/renamed vulnerable algorithms outside package inventory, future bundles or every attack surface. A package's build ancestry alone was not used as evidence of runtime exclusion. This assessment supersedes the prior iOS missing-map limit only for this 5dc930e artifact; older artifacts are not retroactively requalified.

## Remaining risk
Dependency lock SHA-256 remains 7767f310cb183d9e2de29deed82d79ee7cd9a08dd29bddf5a979474fe7c856c7. The two moderate build-tool advisories remain OPEN and unsuppressed:
- GHSA-3g3m-2fjr-6pw4: expo 57.0.32 -> @expo/fingerprint 0.20.15 -> nested glob 13.0.6; first fixed glob 14.0.2.
- GHSA-g3hv-75wg-m249: minimatch 10.2.6 via fingerprint directly/nested glob and TypeScript-ESLint 8.71.1 tooling; first fixed minimatch 11.0.1.
Prior exact-graph historical audits reported 4 production-classified / 11 full moderate affected entries and 0 high/critical. That is not a fresh audit or evidence that all current advisories are absent. Existing source-callsite trigger/risk review remains in security-runtime-reachability-a8867c0-20261106/REVIEW.md. No dependency patch, risk waiver or release/security acceptance occurred here.
Use trusted repository/config inputs and bounded tooling jobs; prefer supported upstream dependency fixes. Preserve supported source-map outputs during future already-needed builds. No further build is requested for this assessment.

## Execution boundary
Read-only artifact/source inspection; private evidence retained outside Git. No build, bundle generation, audit, dependency change, device action, upload, source integration or publication. Authority was clean at report time; observed HEAD 5dc930e280b43e9ffe5553a8c5c63fc6aa86eacb.

## Evidence integrity

- Private REVIEW.md SHA-256: a6a91653486dcb27d4bd4fd120254d9145aaeb41f2a90dfefd3ba12f66a8d70e.
- Private evidence.json SHA-256: 36437c818babeeb09279311597336d48f35fa57742b6fe0affad6a80e4821d33.
- Private build-chain-log-excerpts.json SHA-256: 68a54363621befabd6f55442b2c1e16ab252f83dd46e91384a3cf4934a8825dd.
