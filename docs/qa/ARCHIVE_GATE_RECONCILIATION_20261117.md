# Real Full v4 archive safety gate reconciliation

Executed exclusively on Mac mini against integrated source based on 3843528/593de3d, with the local chooser changes. No devices used.

Five tests previously skipped because CASITADEX_SB24_ARCHIVE was unset even though a tracked, disposable native QA archive exists at docs/qa/sb24-production-native-20261020/native-qa.cdxe. Its provenance is recorded in SB24_SB25_RETURN_HANDOFF_20261020.md. The archive SHA256 is d602284c9f658e164df1dc6418db990b13ee80fabf546fd3df075c14c38bb740, unchanged before/after execution.

## Implemented test-only correction
The real-archive suite now defaults to that checked-in fixture by URL relative to the test module. Explicit CASITADEX_SB24_ARCHIVE overrides remain supported. Missing/invalid fixtures fail instead of silently skipping safety coverage. No production source, native artifacts or archive bytes were changed for this correction.

## Verified
- Explicit existing fixture: 5 passed, 0 failed/skipped.
- Default fixture with environment variable unset: 5 passed, 0 failed/skipped.
- Integrated full suite: 539 total, 538 passed, 1 skipped, 0 failed.
- Negative configuration test using an intentionally absent override: nonzero exit and five failures as expected; no silent skips. This is expected test-configuration rejection, not an application failure.
- git diff --check passed.

Covered: every embedded media byte/hash, corrupted-photo rejection without modifying source, both-domain restore/recovery, nonmutating Cancel and stale reminder review rejection. Writes occur only in in-memory disposable SQLite and an in-memory media map.

## Remaining boundary
The one remaining skipped test requires its historical SB38 Release simulator artifact. These host-level results do not substitute for current native backup/restore, storage pressure, permission or owner acceptance. No original archive restore onto user data, device access, GitHub publication retry, production merge or release occurred. Raw logs and original test copy remain private outside repository. Changes and report are local/uncommitted.
