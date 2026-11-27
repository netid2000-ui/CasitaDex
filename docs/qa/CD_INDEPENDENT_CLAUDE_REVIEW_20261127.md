# CasitaDex — independently accountable Claude review

Date: November 27, 2026 (America/Chicago). Francisco explicitly directed that Claude receive independent access to both applications, challenge ChatGPT's work and recommendations, and that disagreements and findings be recorded in GitHub.

## Exact review baseline

- Source and evidence commit: `9b5752aab18bd71a1d79506843d06b3f944033eb` (verified on GitHub before this documentation-only branch).
- Previous evidence: [CD_JOINT_RELEASE_QUALITY_SUPERBATCH_20261126.md](CD_JOINT_RELEASE_QUALITY_SUPERBATCH_20261126.md). Previous Claude work reviewed excerpts/summaries or reported test evidence; this did **not** establish repository access or independent execution.
- [Snapshot manifest](evidence/independent-claude-review-20261127/source-manifest.json) lists actual tracked text blobs, hashes and exclusions. Source snapshot is prepared locally, credential scan reported zero findings; excludes binary assets, live user data, credentials and historical large evidence. No source has yet been sent through this fallback.
- [Access receipt](evidence/independent-claude-review-20261127/access-receipt.json). Claude Code installed but unauthenticated; existing Claude web account is Free. Official Anthropic GitHub integration located and initiated; GitHub sign-in is required. Direct access remains **UNVERIFIED** until Claude retrieves exact repository content. No paid upgrade, API, store submission, write access to production, or repo publication.

## Reviewer mandate

Claude is not subordinate to ChatGPT. Review actual files at the pinned commit and independently research relevant authoritative sources before conclusions. Choose files and workflows independently, inspect tests for validity and coverage, compare implementation to owner-approved decisions, and challenge prior conclusions rather than merely confirming them. Identify factual discrepancies, source-level defects, missing tests, cost, usability, accessibility, reliability, data portability and privacy concerns. For security, use defensive review only; no exploit reproduction, offensive testing, credentials or user data. Record file paths and line references, direct observations and source references. Distinguish static inference, reviewer-executed tests, ChatGPT-executed evidence, and owner acceptance. Explicitly report insufficient access. No release, purchases, destructive changes or production data operations.

## Accountability

- Preserve Claude's original responses verbatim (except unrelated private information/credentials) and identify exact reviewed SHA and access method; no selective editing or rewriting into consensus.
- Preserve ChatGPT's separate response, including explicit concessions, reasoned disagreements, supporting evidence, and any unsupported claims that are corrected.
- Each finding gets an ID, severity, source file/line, original reviewer statement, ChatGPT position, independent evidence, owner decision if required, status, and correction/test links. Do not mark resolved solely because an AI agrees.
- No source changes are authorized by this review request alone. Findings remain open until verified corrective work and appropriate acceptance. App builds/tests continue exclusively on Mac mini.

## Prior recorded disagreements carried forward (not new direct-source findings)

- Prior disagreement: Free cap originally counted archived and deleted items. Claude proposed blocking restores at cap; ChatGPT challenged data access and over-cap preservation. Owner-approved compromise: trash frees slot, restore gate at 19/20/21, read-only share remains available. Source and native acceptance are documented in the prior report. Do not assume agreement means all gates are closed.
- Physical iPhone, real store sandbox, full reminder lifecycle, interruption and accessibility are open.

## Current review ledger

| ID | Topic | Claude position | ChatGPT position | Evidence | Status |
|---|---|---|---|---|---|
| ACCESS-01 | Direct source access | Not yet received | Previous summary-based review insufficient | Access receipt; exact remote SHA | Open — awaiting GitHub sign-in and verified source retrieval |
| REVIEW-01 | Independent current source review | Pending | No new assertion | Exact manifest and prior evidence | Not started |
| COST-01 | Review cost | Pending | Existing Free account; no new paid usage authorized | Existing account state | No purchase |

This initial ledger documents setup, **not** a completed independent review. Any later Claude findings must be appended without silently removing disagreements. Production stays NO-GO until the existing release criteria are met.

## Access update — direct repository connection verified

- GitHub sign-in succeeded. Claude's official integration retrieved the exact pinned commit, displayed the repository and tree, and saved all 330 files in the `src`, `modules`, and `tests` folders to the dedicated [Claude project](https://claude.ai/project/01a21ef2-dd64-75c1-9a53-b273b6f85e0c). Selection screen showed 99% of that selection's capacity; after reload, the project context displayed the exact commit and GitHub source. No production write-capable app installed.
- Persistent independent reviewer instructions saved. [Project receipt](evidence/independent-claude-review-20261127/cd-project-status.txt).
- Separately, actual 573-file source ZIP accepted by Claude, and [review request submitted](https://claude.ai/chat/9d9b7876-9a33-4695-a120-661b74070a44). Claude UI reported ten commands, web search and memory read before pausing. [Raw progress and quota receipt](evidence/independent-claude-review-20261127/cd-claude-review-status.txt). This is proof of source delivery and actual review activity, not a completed review or validated finding.
- Free allowance pauses review until 6:00 PM local November 27. No plan upgrade, cost or artificial bypass. Resume at the free allowance; preserve actual independent output. No new findings were available to record when this checkpoint was saved.

| ID | Update | Status |
|---|---|---|
| ACCESS-01 | Direct pinned GitHub context and complete scoped source archive attached | PASS — repository context access; reviewer direct file proof still pending |
| REVIEW-01 | Claude actual review running, then quota pause | Incomplete — no findings yet |
| COST-01 | Free plan, no billing changes | PASS — $0 new charges |
