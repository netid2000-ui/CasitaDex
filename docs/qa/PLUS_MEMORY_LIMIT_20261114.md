# Free memory limit — isolated QA checkpoint

The native ENG store checks the free 20-memory limit inside its serialized save operation, after duplicate-save recovery and before committing a new memory. It receives verified ownership through the same runtime as backup gates. Enforcement is limited to the isolated local StoreKit QA app while public purchasing remains unavailable.

## Behavior

- Free: save memory 20; refuse memory 21 without changing the collection or durable draft.
- Plus: permit additional saved memories. A verified refund blocks only future additions.
- Existing oversized collections remain readable and editable; no automatic deletion or trimming.
- All retained saved records count, including archived and recently deleted. Drafts do not count.
- Duplicate-save retries succeed at the limit. Migration, restoration and local recovery do not discard existing records to meet a quota.
- Previously verified Plus remains usable during a temporary verification error; unknown ownership cannot authorize additions above the cap.
- Add Memory retains fixed Cancel/Save controls, shows inline status and a View CasitaDex Plus button at the limit. Opening Plus first flushes the draft.

## Verification

All checks ran on FA-MAC-DEV-01. TypeScript, targeted new-policy/runtime ESLint and diff whitespace checks passed. SQLite boundary/policy and backup-gate regressions: 9 passed. Native PlusMemoryLimit-r1: 1 passed, 0 failed; fixed upgrade controls after scrolling, correct destination, and notice removal after verified local purchase. Existing 90-record QA collection used without destructive reseeding. Screenshot inspected for clipping and overlap. Xcode emitted a QoS priority-inversion warning without a test failure.

[Native summary](evidence/plus-memory-limit-20261114/summary.json) · [Database and policy tests](evidence/plus-memory-limit-20261114/tests.txt) · [Fixed notice screenshot](evidence/plus-memory-limit-20261114/fixed-limit-notice.png)

Figma status board updated: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1006-17

## Remaining acceptance

The exact 20/21 boundary and preservation assertions ran against real SQLite through the store tests, not native UI taps. Native boundary-entry and physical-device acceptance remain pending. Android native purchasing, production store configuration and complete Plus feature delivery also remain pending. Accepted SB40 untouched; completed photo acceptance not repeated; no live purchases or release.
