# Recovered SB40 source checkpoint

Owner-selected SB40 is the authority. This isolated branch copies the recovered source, assets, runtime configuration and historical tests exactly; later-only runtime files are excluded. Household QA evidence remains preserved from the parent commit. The existing development worktree and its uncommitted changes remain untouched.

This checkpoint is not a new app release or proof that a rebuilt binary matches the owner’s physical iPhone. The installed SB40 QA executable is verified separately by SHA-256. Native projects and dependency caches remain in the recovered workspace; this branch records the JavaScript/configuration source. No installed package or user data is changed.

The manifest records every copied file hash. No regression fixes are mixed into this recovery commit. Historical tests can expose stale expectations and missing historical report dependencies; their results must be reported before treating this as a release candidate.

## Validation

All 277 copied source/configuration/asset/test files match the recovered workspace hashes. TypeScript passes. Historical tests: 419 total, 413 passed, 0 failed, 6 skipped after restoring their missing historical design/security/brand evidence dependencies. Those historical documents are test inputs, not current approval; the SB40 authority correction takes precedence. No native rebuild or physical-phone comparison was performed.

Recovery preserves pre-existing trailing whitespace in the source; diff whitespace checking reports those inherited lines. Git applies the repository’s existing CRLF-to-LF normalization on some files. Manifest hashes describe recovered working-file bytes, not normalized Git blobs.
