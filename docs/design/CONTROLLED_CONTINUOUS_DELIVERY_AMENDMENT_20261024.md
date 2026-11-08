# Designs by F&A — Controlled Continuous Delivery Amendment
Date: 2026-10-24
Status: Owner-approved operating direction; implementation ongoing.
Scope: CasitaDex and future Designs by F&A projects.

## Core rule
A blocked release gate must not become a blocked project. Continue safe independent work while preserving mandatory quality and data-protection gates.

## Execution
- Batch approved implementation, verification and documentation with minimal interruptions.
- Parallelize independent design, engineering, QA and documentation tasks; never bypass safety dependencies.
- Reserve owner approvals for destructive actions, new costs, significant scope/design changes and production promotion.
- On failure: capture evidence, attempt bounded safe recovery, then switch to another independent task; no indefinite retries.
- Preserve dirty source, user data, device state and Figma authority; use isolated worktrees.
- Require traceability from requirement to approved Figma nodes, code, tests, artifact and acceptance.
- Run fast deterministic checks before costly native builds; reuse valid evidence only for unchanged scope.
- Report blocker, affected gate, continuing tasks and owner decision only when needed.
- Close each super-batch with one consolidated return handoff and remaining gates.

## Stop-the-line exceptions
Stop the affected operation for suspected data loss, security incidents, destructive migration, unapproved release or unverifiable artifact provenance. Continue unrelated safe work.

## Performance metrics
Track lead time, blocked time, defect escape, repeated tool calls, test reliability, change failure and recovery time. Optimize accepted outcomes.

## SB-29
Continue isolated typed adapters and QA preparation. Do not promote candidate screens until approved platform design and preserved-data acceptance are evidenced.
