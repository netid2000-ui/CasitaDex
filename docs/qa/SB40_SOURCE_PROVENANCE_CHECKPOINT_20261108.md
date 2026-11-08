# SB40 source-provenance checkpoint — 2026-11-08

## Outcome

An additive source snapshot is captured under [baselines/sb40-owner-accepted-20261108](../../baselines/sb40-owner-accepted-20261108/README.md), on scoped branch `work/cd-sb40-runtime-checkpoint-20261108`, in a separate SSD worktree. It contains **369 byte-preserved input files (14,421,700 bytes)**. No root application source was replaced. Two build-tool isolation additions exclude `baselines/` from root TypeScript inputs and EAS uploads; archived inputs remain byte-identical. The main checkout remains on `work/cd-sb41-edit-targeting-20261104` at `db129dee01acd63559929d7cbcfc59f9dbccfa3d`, with its seven pre-existing dirty files preserved exactly.

Owner acceptance still belongs to the [SB40 authority correction](SB40_OWNER_AUTHORITY_CORRECTION_20261108.md) and [75-item native journey](SB40_HOUSE75_OWNER_JOURNEY_20261108.md). This source checkpoint is not a new accepted runtime or a release promotion.

## Verified provenance

- All 738 files in retained Oct 31 source archive verify against its original manifest. Archive SHA-256: `1cbf1289635312b89637351eadf49b6aa59f61c18e0629567dd30dd91b740647`.
- Recovered workspace matches 736 of those archived files. The two exact deltas are SB40 identity configuration in `app.config.js`, and embedded synthetic-photo loading/startup logging in `src/app/index.tsx`. Additional native project inputs and later tests are itemized separately.
- Archive lineage `d9fde466c76fab9212d881cbeb2e033aea95ab2a` is a verified retained Git object, **not** a complete SB40 build-source commit: archive metadata explicitly includes dirty work. Selected snapshot comparison with that commit: {'equal': 184, 'not_tracked_at_lineage_commit': 153, 'changed': 32}.
- Accepted retained iOS executable: `8ad89040f3a092c4a57b1d4bf7747a55e1afdd19cfa264f0b3fe136c02ba9b4d`; packaged Hermes JS: `83326efc8d67c50748539becbe4f4f306e70efa233e8e3d44a5249260f9fb7aa`.
- Accepted retained Android APK: `01e40085176127b815b0870fabbd4d915f463acdea5d8d4e0eb830871467d3bf`; embedded JS: `90ec186824f37d79d90ce42b0ba0a8200247f2f61238f7057f5b2fb814f341cc`. The older worker APK `8256ec581ca1d7bb5062906fc7170c311aa68805de947fdfca206bc196879221` is distinct and is not substituted.
- npm lockfile: `e9b51355797d4d02769b04f61d2d2fe7acde74b2b9b47b24315f2befc841482d`. CocoaPods lockfile: `08420699fd05e5b92cce732ce715425453d4ed97d4f81e7b800b3b4159a2d540`. Embedded iOS identity is `com.designsbyfa.casitadex.sb40qa` 0.1.0 (1); SDK/toolchain metadata is recorded without invoking a build.

## Validation and preservation

Copied inputs are SHA-256/size/mode checked against the unchanged recovered source. Git staged blobs are checked independently to prevent line-ending normalization. The read-only verifier also checks the three retained artifacts and the original main branch, HEAD, index, diff and seven dirty-file hashes. Generated dependencies/caches/binaries, local overrides, signing material, CI workflows and raw device data are excluded. SHA manifests and exact source-lineage deltas are committed; binaries remain on the SSD.

Default Gitleaks 8.30.1 directory review of the final narrow checkpoint exits 0 with no findings and no allowlist. Commit-range review is retained in the SSD receipt. The initial broader local draft had two false-positive Figma file identifiers in a historical design document. All 183 recovered documentation files, four Figma rasterizer utilities and the old README are now excluded by scope. The full draft remains local-only at `d91bd5c4a4001368dcd62005f9ac6c947eebda1b`. No personal household data, signing material or secret is included in the narrow checkpoint.

Application tests, typecheck/lint, builds, installs and device tests are **NOT RUN** in this checkpoint. Existing native tests are reused with original artifact attribution. No simulator UI/data, physical device, network/security setting, production service or release state changed.

## Decisions and limitations

The accepted SB40 source is preserved as a nested baseline, not overlaid on newer `.dev` source. The six wrong-`.dev` source/test refinements and seventh existing handoff edit remain untouched. Synthetic seed behavior and its three baseline images are retained explicitly; they do not represent the 75 UI-entered household memories.

Matching artifacts, source hashes and archive lineage do not establish a reproducible build or a contemporaneous clean source-to-binary attestation. Dependency installations, omitted Gradle bootstrap/signing inputs and original environment provenance are not fully attested. Future source reconciliation must preserve accepted inline Add/edit/photo/reminder behavior and use a newly scoped acceptance plan.

The historical SB121 ledger and older current-looking status entries remain evidence for their own `.dev` artifacts, not SB40 authority. This checkpoint does not close organization acceptance or other native/physical/security/billing/distribution gates. Release remains **NO-GO**.

Evidence directory: `QA-Evidence/CasitaDex/sb40-source-checkpoint-20261108` on FA-MAC-DEV-01 external SSD. The separate checkpoint worktree is retained for further review and bounded documentation work.

## Publication boundary

The existing GitHub repository is public. This checkpoint publishes only the authorized recovered runtime/configuration/tests/assets/native inputs plus sanitized evidence and existing governance updates. Historical/private-seeming documentation is not included. `publication-review.json` records exact comparison with public base `db129dee01acd63559929d7cbcfc59f9dbccfa3d`. Publication remains contingent on final review and explicit remote SHA verification; no force push or release merge.
