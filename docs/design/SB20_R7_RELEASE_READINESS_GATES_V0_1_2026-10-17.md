# CasitaDex SB-20 — R7 Implementation Authorization and Release Gates v0.1
Date 2026-10-17 | OWNER REVIEW DRAFT — NO IMPLEMENTATION
This plan converts signed SB-20 product design and R0-R5 methodology into explicit future controlled approvals; preparing it does NOT grant permission to implement or test.

## Gates in strict order
G0 Owner approves isolated development scope, destination and handling of existing dirty/untracked files; capture and verify refreshed recovery checkpoint. Current R0 checkpoint predates later design documents: refresh source snapshot before implementation.
G1 Owner reviews precise versioned data schema, legacy v1/CDXM2 compatibility, nullable Space, legacy Context, staged photo/draft model and reversibility proof on synthetic fixture.
G2 Owner reviews media staging/hash/reference/cleanup invariants, idempotent save and rollback, photo-only validation, max-five new photos; no loss of legacy attachments.
G3 Owner reviews full backup schema, legacy imports, archived/deleted/draft/photo coverage, draft conflict UI and interrupted-restore recovery.
G4 Owner approves measured adaptive-storage warning/critical numerical thresholds after Android evidence. Never rely on untested arbitrary triggers or forced user deletion.
G5 Authorized Development-only Android emulator tests and R6 acceptance evidence; user-approved visual review and defect remediation. No cloud/account/paid work.
G6 Separate owner permission before installing to or modifying personal physical Samsung Android data; test user data must have verified preservation path.
G7 Separate explicit authority for any Git commit/push, staging/production deployment, marketplace submission, subscriptions or cloud services. Production deployment is never implied by design signoff.

## Evidence and stop conditions
At each gate record branch/HEAD, allowed files, before/after diffs and SHA values, synthetic inputs, test logs/results, exact rollback steps, open defects and owner go/no-go. Stop on unverified rollback, unexpected data loss, non-idempotent migration, missing media, broken offline usage, misleading verification, corruption or improper retention deletion.

## Proposed first implementation super-batch — authorization NOT requested in this document
SB20-ENG-A (suggested): protected isolated baseline and synthetic schema/migration contracts only; do not run real Android data migrations, modify native installation or introduce cloud services. Preconditions: refreshed verified source snapshot, owner-selected Development isolation directory, signed field-by-field schema and fixture expectations, measured rollback capacity, scope/failure stop policy. Exact allowed files and commits must be specified in separate approval. Later phases for media, backup, UI and Android acceptance require their own checkable internal gates, not blanket permission.
No automatic move to any subsequent phase because previous tests pass; owner retains go/no-go decisions for risky transitions.

## Current readiness status
Product design SIGNED; R0 earlier source recovery verified, needs refresh before implementation; R1 safe-default policy SIGNED and compatibility plan drafted; R2 media/draft design SIGNED, no tests; R3 phase methodology SIGNED, no implementation; R4 storage methodology SIGNED, numerical thresholds OPEN; R5 backup/restore acceptance SIGNED, native evidence OPEN; R6 QA plan DRAFT and R7 gate plan DRAFT.
Owner release authority: NONE; cloud, payments, device, deployment and commits remain ON HOLD.
Next owner decision: review R6+R7 gate methodologies, with no implementation authority implied. After their approval, request a separately scoped first development super-batch only when preconditions are actually satisfied.
