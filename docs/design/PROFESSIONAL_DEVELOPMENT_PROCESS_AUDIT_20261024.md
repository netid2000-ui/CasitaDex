# CasitaDex Professional Development Process Audit — 2026-10-24
Status: ADVISORY AUDIT; acceptance gates OPEN. No production approval.

## External standards
- NIST SSDF SP 800-218: https://csrc.nist.gov/pubs/sp/800/218/final
- OWASP MASVS: https://mas.owasp.org/MASVS/
- Figma design-to-code: https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/
- GitHub Actions secure use: https://docs.github.com/en/actions/reference/security/secure-use
- Apple App Review: https://developer.apple.com/app-store/review/guidelines/
- Android bundle testing: https://developer.android.com/guide/app-bundle/test

## Verified worktree observations
- Branch work/sb29-figma-first, HEAD d9fde46 at inspection.
- .github/workflows/quality.yml runs pull-request typecheck, tests, lint, doctor, web export with contents:read; checkout@v4 and setup-node@v4 are tag-based rather than SHA-pinned.
- src/figma-first contains provisional Home/Find components and view-models; no approved native route promotion verified.
- Figma authority and SOP exist, but owner/device acceptance remains open.
- Current 8 Figma-first tests are foundation checks, not complete native regression coverage.

## Mandatory promotion gates
1. Approved requirements and data-risk classification, owner decisions recorded.
2. Figma Apple/Android approved node IDs, variants, token version, asset SHA-256 manifest; fail closed on pending/rejected assets.
3. Isolated source branch, clean change scope, reviewed diff and typed domain boundary; protect real user data.
4. CI: dependency lock, least privilege, typecheck, lint, unit/integration/security tests, test results retained; review branch protection and pinned actions.
5. Migration/durability: offline restart, interrupted save, backup/restore, media integrity, cancellation/rollback, upgrade from preserved data.
6. Native QA: Android emulator and Samsung, iOS simulator and iPhone; accessibility, light/dark, large text, screenshots compared to approved Figma.
7. Release evidence: commit SHA, source/asset hashes, build artifact hash, platform version, test matrix, issues, rollback plan, explicit owner approval.

## Priority gaps
P0: Do not promote provisional Figma screens; close data safety/cancellation defects and migration preservation before live integration.
P1: Create machine-readable approved-design manifest and automated legacy-import/asset enforcement.
P1: Extend tests beyond static string assertions to behavior, accessibility and real persistence boundaries.
P1: Formal PR reviews and branch protection; pin CI actions or use action dependency lockfiles.
P2: Automate screenshot comparisons, native test evidence and artifact attestations.

No destructive action, commit, push, deployment or device install performed by this audit.
