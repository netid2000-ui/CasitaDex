# Owner-accepted SB40 source-provenance checkpoint

This is an additive, byte-preserving snapshot of the recovered SB40 workspace on FA-MAC-DEV-01. It does not replace the repository-root application, certify a release, or claim that a historical Git revision alone built the accepted binaries.

## Authority and provenance

- Owner authority: SB40, as recorded in `docs/qa/SB40_OWNER_AUTHORITY_CORRECTION_20261108.md` and the 75-item owner-journey report. Latest Work: https://chatgpt.com/c/6aeff364-d868-83e9-a4c3-51b7e7bf6db3.
- Recovered source: `/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/sb40-simulator-parity-20261108`, not a Git checkout and left unchanged.
- This feature branch starts at `db129dee01acd63559929d7cbcfc59f9dbccfa3d` only to preserve existing review history. The root source at that commit is a different, withdrawn `.dev` basis. Do not use that commit as the SB40 build-source SHA.
- The full original archive manifest stays on the SSD and is identified by hash/path in `lineage.json`. The Oct 31 archive has verified SHA-256 `1cbf1289635312b89637351eadf49b6aa59f61c18e0629567dd30dd91b740647`. All 738 archive members match its retained manifest; 736 archived files match the recovered workspace. The two changed paths are `app.config.js` (isolated SB40 identity) and `src/app/index.tsx` (embedded synthetic image bytes and startup logging). The exact delta is retained in `archive-to-recovered.patch`.
- Archive metadata identifies branch `integration/figma-first-native-qa-20261027`, revision `d9fde466c76fab9212d881cbeb2e033aea95ab2a`, **with dirty worktree included**. That Git object is verified in the retained `figma-first-native-qa` repository. The archive is not the clean tree of that commit. `lineage.json` records both comparisons without importing or changing that repository.

## Captured inputs

`source-manifest.json` defines every copied path, SHA-256, size and executable mode. It includes runtime TypeScript/JavaScript, configuration, npm and CocoaPods lockfiles, assets, native project source/configuration/resources, tests, quarantine tests, and build/QA scripts. `source/` is archival, not the default runnable application. Existing quarantine status is retained. Repository-root TypeScript and EAS upload configuration exclude `baselines/`; the archived configuration itself remains byte-identical.

`exclusions.json` records excluded classes and observed paths. All recovered historical documentation, the old README, and Figma rasterizer tooling are excluded from this narrow checkpoint. Dependencies, build products/caches, `.expo`, raw QA data/logs/screenshots, signing keys, local environment overrides and the Gradle wrapper JAR are absent. The latter is a dependency bootstrap binary, not source; it must be independently obtained and verified before any future authorized build. Do not copy credentials or signing material from the original. No dependency installation, prebuild, build, app install or device test was performed.

The baseline `.gitattributes` prevents Git line-ending normalization and whitespace rewriting of copied inputs. The recovered `.gitattributes` is recorded as text/hash in `exclusions.json` instead of being activated inside the snapshot. Original CRLF and executable modes are intentional archival bytes.

## Artifact identity

The retained `.app` executable, packaged Hermes bundle and Android APK were directly hashed and match the accepted identities:

- iOS `com.designsbyfa.casitadex.sb40qa`, 0.1.0 (1), executable `8ad89040f3a092c4a57b1d4bf7747a55e1afdd19cfa264f0b3fe136c02ba9b4d`.
- iOS packaged `main.jsbundle`: `83326efc8d67c50748539becbe4f4f306e70efa233e8e3d44a5249260f9fb7aa`.
- Android APK: `01e40085176127b815b0870fabbd4d915f463acdea5d8d4e0eb830871467d3bf`.

`artifact-provenance.json` includes retained paths, byte counts, embedded iOS configuration/toolchain metadata, dependency lock hashes, Android embedded JS hash and the distinct older worker APK. No installed app/container was read or changed in this task. The household simulator and original reference remain owned by their native acceptance lane.

## Synthetic QA seed boundary

The embedded iOS configuration confirms `parityQaSeed: true`, `backendMode: none`, `productionAuthorized: false`. The recovered `app.config.js` expresses `parityQaSeed: !sb39 && true`; it is not a safe production default. This existing behavior is preserved, not newly enabled.

`src/sb26-qa-seed.ts` and `src/eng-store.ts` define/check 90 fictional sample memories and 15 categories. Entry routes (`src/app/index.tsx`, `memories.tsx`, `photos.tsx`) contain opt-in-config seed behavior. `src/qa-illustration-bytes.ts` supplies the three synthetic baseline images. These 90 baseline records are distinct from the 75 household entries created through native UI. No SQLite database, private media container, owner data or personal record is captured here.

## Verification and safe reuse

From any working directory, run `python3 <baseline>/verify_snapshot.py` to check all copied bytes and modes. Add `--original --artifacts` only on the Mac with retained source/artifact paths. Add `--index` while reviewing a staged checkpoint to compare actual Git blob bytes. The verifier performs read-only hashing and Git queries; it never builds or touches devices.

`validation.json` records actual source/retained-artifact/preservation checks and redacted Gitleaks evidence. `publication-review.json` compares every selected input with the verified existing public base. Application tests, typecheck, lint, dependency installation and native builds were **NOT RUN** because this task changes no live runtime and explicitly reuses existing acceptance. Copied tests are evidence inputs, not a claim of current passing tests. Their historical document/screenshot/data references are deliberately not bundled.

## Remaining uncertainty

No contemporaneous clean Git source SHA, complete dependency-tree attestation, original environment capture or reproducible rebuild proves that every recovered input was exactly the input consumed by the accepted binaries. Matching retained artifacts plus archive lineage establishes a useful, reviewable provenance checkpoint, not mathematical source-to-binary equivalence. Physical-device byte identity and owner final acceptance remain separate. Future code changes require a deliberate source-port/reconciliation plan and newly scoped acceptance; do not silently merge the newer root source into SB40.

Release remains **NO-GO**. This checkpoint does not close notification delivery, complete photo gestures/limits, strict offline/backup, accessibility, physical-device, billing, security or distribution gates.
