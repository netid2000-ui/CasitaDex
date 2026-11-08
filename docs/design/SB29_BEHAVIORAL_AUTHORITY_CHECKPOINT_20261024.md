# SB-29 Behavioral QA and Authority Gate Checkpoint — 2026-10-24
- Added photo-summaries.ts pure read-only projection from DataV2 media and active memories; no media paths returned and no storage writes.
- Added figma-photo-behavior.test.mjs executable projection tests (two cases, including input immutability and empty gallery).
- Added qa:figma script and one CI step to .github/workflows/quality.yml; CI execution on GitHub is NOT verified because changes are uncommitted.
- Figma authority manifest remains fail-closed, both platform mappings explicitly require live Figma confirmation. No design promotion permitted.
- Validation: 19/19 focused tests pass; TypeScript passes; ESLint figma-first passes.
- Limitations: component rendering and on-device behavior not tested; visual comparison not performed. Current tests mix source-contract checks and executable projection tests.
- No app installation, device modification, data migration, commit, push or production deployment.
