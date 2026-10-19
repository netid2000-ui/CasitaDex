# CasitaDex SB-20 — ENG-A First Implementation Super-Batch Proposal v0.1
Date: 2026-10-17 | Designs by F&A
STATUS: FOR OWNER REVIEW ONLY — NOT AUTHORIZED FOR EXECUTION
Governed by signed integrated SB-20 design and R0–R7 planning/acceptance methodologies. This document is a future scope proposal, NOT instructions to execute today. Preserve existing original chat as command center, provide test evidence and return handoff here.

## Mission and boundaries
The first super-batch would prepare a separate, recoverable DEVELOPMENT environment and implement/test ONLY versioned data contracts and migration compatibility using synthetic fixture datasets. No consumer-facing tab redesign, new camera feature, physical device migration, cloud integration or production/staging deployment.
Original repo C:\CasitaDex-Git, branch prototype/bootstrap, HEAD at planning b940ccc5d605f35df6ac0aa31e7c2842a8694953. Existing modified tracked source and untracked branding/design files are OWNER WORK PRODUCT; do not reset, clean, overwrite, stash or stage them without separately approved handling.
Prior local R0 Git bundle plus overlay source restore was successfully verified on E: but PRE-DATES R1–R7 documents. Must REFRESH and VERIFY all current source and design artifacts before implementation and independently restore to a new isolated destination.

## Preconditions: no action before separately authorized execution
A1 Owner explicitly approves ENG-A exact file scope, isolated destination, test permission and stop conditions.
A2 Refresh repository recovery package INCLUDING latest dirty tracked files, untracked assets and all signed designs; verify SHA manifests and isolated clone plus overlay round-trip.
A3 Select new isolated Development location consistent with Designs by F&A directory policy; do not work in the existing dirty authoritative repo. Baseline must use exact currently observed source and owner-approved assets, not HEAD-only checkout losing local work.
A4 No real Android private user content, keys, cloud databases or confidential backup fixtures. Use synthetic test data only.
A5 Inventory relevant current test scripts, package version and state before first edit; save evidence and confirm no hidden ongoing build conflict. Define rollback location for isolated workspace.
A6 Verify space/OS permissions and security of snapshot destination, no assumptions that same-host backup is offsite/encrypted.

## Proposed engineering deliverables
D1 Versioned future-facing schema and explicit compatibility adapter for Data v1, preserving IDs, answers, legacy Context, Space assignments, sources, verifiedAt, reminders and history. Support new nullable/unassigned Space and optional custom Category IDs without silent conversion.
D2 Define saved-memory invariant: meaningful authored title AND (written answer OR durable validated photo), while incomplete Draft remains separate; default Unknown, Active, no Category/reminder/source or invented answer.
D3 Introduce versioned synthetic-only format/migration readers and immutable fixture comparison; legacy v1 text and CDXM2 media remain readable.
D4 Read-only migration preview showing counts, possible incompatibilities, metadata impacts and unsupported versions; do not run live database migration.
D5 Automated contract tests: synthetic zero/one/many, old Context, Verified history, reminder, missing Space, photo-only, invalid media reference, malformed/unsupported import, safe rollback and idempotence expectations.
D6 Technical design/test evidence and updated recovery runbook for isolated workspace, with explicit future gates for R2 media, R4 storage and R5 full backup.

## Allowed paths — PROPOSED only
After owner approval, changes may be limited to isolated Development copies of the model/schema adapters, fixture tests and tests/documentation for contract verification. Specific anticipated modules: src/model.ts, src/sqlite-repository.ts, targeted adapter(s) added for safe version parsing and tests/*.test.mjs, plus docs/design and runbook entries copied into isolation. Media source modules may be READ for contract discovery, not edited within ENG-A. Newly introduced files require declared purpose and owner-reviewed diff.
The existing C: authoritative repository, Android application installation/user databases, existing E: verified snapshot, Windows toolchain, cloud services and all Git remotes are READ-ONLY / out of scope. No physical device tests, emulator launch or production assets mutation in this phase. No blanket permission to add packages or start paid services.

## Stop/rollback gates
S0 Stop if original worktree changes unexpectedly, preservation snapshot is incomplete, or isolated restore fails checksums.
S1 Stop on a legacy record missing stable ID, losing an original Context, Space, source/date, history or original image linkage.
S2 Stop on unsupported version silently coerced into another model or photo-only placeholder answer fabricated.
S3 Stop on any attempted write to original repo/device or any real user's database.
S4 Stop on unverified write atomicity, orphan-media reference, failing migration tests or unbounded memory/capacity assumptions.
Rollback in this FIRST batch would discard or revert ONLY the newly isolated Development experiment after verifying recovery, never reset authoritative worktree. The pre-migration original source remains unchanged.

## Evidence and completion criteria
Report preserved baseline hash/branch and source diff, clean isolated restore verified, field-by-field v1 compatibility map, synthetic fixtures, parser/migration previews, pass/fail test logs, no missing original metadata, read-only native schema review, deterministic rollback, and open gates. No claim of completed SB-20 screens or native Android feature acceptance.
Git commits, remote pushes, Android builds, device modifications, migration against live data and deployments require EXTRA approval, even if ENG-A otherwise passes.

## Owner decision needed after proposal review
Choose Approve an explicitly bounded ENG-A execution authorization at a later turn, or request scope amendments. Until that explicit instruction is received ENG-A is PROPOSED ONLY. R6/R7 methodology signoffs are not code authorization.
