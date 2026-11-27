# CasitaDex independent review correction superbatch — QA Build 5

Owner-authorized November 26, 2026 (America/Chicago). Execution and evidence generated exclusively on FA-MAC-DEV-01, on FA-Development. Isolated QA package, not production, no store submission or purchase.

## Source lineage

- Independent review: [CD-IR report, exact Build 4](https://github.com/netid2000-ui/CasitaDex/blob/2bc31378aa1163908b3ac05543df26647531d6eb/docs/qa/CASITADEX_CLAUDE_BACKUP_REVIEW_1185D16_20261126.md).
- Build 4 source: `1185d16c776d30c4c4b64c63e9e9b4f0f4e3c7d3`; tree `4c90ce9bd546ca2e1d5f6c71cce2827057bc5b7d`. Recovered and preserved accepted lineage; no historical worktree modified.
- Build 5 exact executable source: `aa5304d300515cbeef9249a9f0ab919ee8553ed2`; tree `6dda67abad6677897a98d500e8c82e3f8c0961c7`. Branch `work/cd-claude-recovery-20261126`. Source push verified with git ls-remote. The later evidence-only commit does not change the compiled application.
- Both installed QA artifacts use `com.designsbyfa.casitadex.platformqa`, version 5. See [build and regression receipt](evidence/cd-claude-build5-20261126/build-and-regression-receipt.txt) for SHA-256 hashes, build results, and identity.

## Finding disposition

| ID | Disposition | Correction / verification |
|---|---|---|
| CD-IR-01 | Corrected | Full v4 requires an actual reminder review token, even for zero rows; collection and reminder tokens checked again within the final SQLite transaction before writes. |
| CD-IR-02 | Corrected | Shared reminder mapping preserves memoryId, all linked fields and migrated defaults both when creating backup and capturing previous save. Repeated recovery regression. |
| CD-IR-03 | Verified existing | Recovery-generation invalidation remains intact; new recovery kind/hash review adds fail-closed stale-review verification. |
| CD-IR-04 | Corrected | Collection, draft and standalone reminders captured together within one SQLite transaction; dedicated native connections and bounded busy timeout. |
| CD-IR-05 | Corrected | Commit journal ownership is exact and transactional; interrupted or uncertain staged media stays protected. Storage count shown, no automatic deletion of user or recovery media. |
| CD-IR-06 | Corrected | Dispose only SDK-owned picker copies, success/cancel/failure/navigation paths; 24-hour sweep only named application-owned temporary files. iPhone verified retained archives remain private and user-controlled; explicit named deletion confirmation. |
| CD-IR-07 | Corrected | Review shows retained labels and save-attempt conflict; saved-memory ID conflict disables keeping that draft. Stale/failed review must restart. |
| CD-IR-08 | Verified existing / scoped limitation | Existing archive size/limit enforcement retained and regressed. SDK disk-space checks do not guarantee quota/provider completion; no claim of provider capacity assurance. |
| CD-IR-09 | Corrected | Full vs collection-only recovery copy distinguishes standalone reminders; confirmation operates on reviewed recovery kind/token. |

## Regression and native verification

- Mac-only TypeScript and ESLint checks passed (zero lint warnings). 560 passed, 0 failed, 1 existing skip (561 total). Seven new dedicated tests plus expanded native-mock/retention coverage; existing full-restore tests now supply the required token.
- Both platform bundles and native compilations passed. Android first attempt lacked a generated SDK local.properties; reused the configured Mac SDK path and rebuilt successfully. iOS Release simulator native compile succeeded. QA installed without resetting or removing prior user/device applications.
- Android simulator emulator-5582: passed opening native picker, v4 review/cancel, v4 confirm restore, full recovery, repeated recovery, Find normalization and one-photo readback. [JUnit and screenshots](evidence/cd-claude-build5-20261126/).
- iPhone simulator CasitaDex Plus 25.99 Recovery QA: full native backup created and verified, share sheet opened, retained archive list and Cancel on named removal passed. Save to Files action dismissed without exposing its Save confirmation—external provider delivery not verified. The app correctly did not claim external backup success; retained archive was present. A known synthetic v4 fixture (same prior QA fixture as Android) was seeded into simulator-local Files for independent picker verification. Native picker browse succeeded; first label tap did not select; tapping the file icon selected it. Review, full restore and accurate full-recovery confirmation assertions succeeded. First confirm tap was partially under the bottom tab area; subsequent test centered the bottom control to verify it. See the step receipt and retry results. No private backup payloads are committed.
- iOS retry of the full recovery confirmation, centering the visible controls, then repeating the recovery and opening the synthetic memory's one restored photo: **PASS**, [JUnit](evidence/cd-claude-build5-20261126/ios-recovery.xml), [photo readback](evidence/cd-claude-build5-20261126/ios-readback.png). The first combined flow's failed assertion remains explicitly retained in its JUnit / step receipt; its restore assertions passed. No device-local .cdxe picker cache remained in the inspected iOS cache after successful restore.
- Android and iOS standard full recovery release-regression cases, including ordered linked reminders, are also proven in the domain suite, not asserted to be exhaustive native OS notification tests. Physical Samsung and owner iPhone were not changed. No production deploy, purchase, or submission.

## Figma reconciliation

Authoritative editable design file, page [49 · SB40 · Warm Editorial — Photos & Memory Details](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=398-2). Updated existing approved page rather than creating a new master; preserved accepted navigation and theme tokens. Screenshots of representative light/dark states visually checked.

| State | Figma nodes |
|---|---|
| Backup & restore entry | [487:97](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=487-97) |
| Review and draft selections | [light review](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=530-34), 530:46, 530:58, 540:31, 540:42; dark 875:60, 875:73, 875:87, 875:138, 875:153 |
| Draft conflict, keep disabled and cancel visible | [light](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1687-861), [dark](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1687-876) |
| Full recovery | 540:74, 875:177, light modal 891:2/891:31, dark modal 888:2/888:31 |
| Collection-only recovery | [light](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1686-62), [dark](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1686-73) |
| iPhone retained archive list | [light](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1686-84), [dark](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1686-114) |
| Named removal confirmation | [light](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1686-193), [dark](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1686-204) |
| Storage staging/protection count | 547:2, 547:30 |

Native platform control geometry is not required to be pixel-identical to the design canvas; this reconciliation covers changed copy, states, controls, semantics, and both themes. Existing Figma historical pages left intact.

## Gate

QA superbatch correction and targeted native validation completed. Release remains **NO-GO pending physical-device acceptance**, especially real iPhone Files destination/provider confirmation (including low storage/quota behavior), Samsung verification, owner final acceptance, and normal release checks. Keep Build 4 as a preserved rollback point; no production merge. Raw Mac logs retained on FA-Development under QA-Evidence/cd-claude-corrections-20261126; GitHub holds reproducible flows, JUnit, selected synthetic screenshots and exact build receipt. No private data or backup payloads included.
