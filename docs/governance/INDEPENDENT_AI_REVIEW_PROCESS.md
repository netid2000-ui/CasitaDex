# Designs by F&A — three-reviewer decision process

**Owner approved November 27, 2026 (America/Chicago).** Applies to CasitaDex and Event Command by F&A. Francisco asked ChatGPT, Claude and local Ollama/Qwen Coder to independently challenge each other's work and give the other reviewers meaningful weight. If they cannot agree, research further and consult Francisco. This supplements the owner-approved professional standards, product decisions, Figma authority and existing release criteria; it is not release authorization.

## Standing and weight

- ChatGPT, Claude and Qwen have equal standing to raise an objection. No reviewer's opinion is automatically superior because of its brand, size, role, earlier acceptance or authorship. ChatGPT cannot unilaterally dismiss dissent. Do not reduce peer review to three votes or arbitrary confidence percentages: weight each claim by its actual source, reproducible observations, relevance to the exact candidate, explicit uncertainty, and severity.
- One credible minority objection is enough to reopen the affected claim, including a previously passed gate. A disagreement about interpretation does not erase a recorded executed PASS; it can narrow the scope, request a new assertion, or reopen the proposed release decision.
- Distinguish reviewer-executed checks, quoted source facts, model inference, other-agent test reports, native tests and owner acceptance. An unavailable reviewer or truncated response is not assent. Never fabricate agreement or label a reviewer as having executed tests it did not actually run.

## Required execution sequence

1. **Pin the authority:** owner-approved product decisions, Git SHA/tree, exact build/evidence and Figma nodes if relevant. Scope each reviewer to the same sanitized tracked source, tests and facts. Record access limitations, model/version and whether its source was live GitHub or a pinned snapshot.
2. **Independent first assessment:** each reviewer researches applicable authoritative sources before its final recommendation; independently selects paths, workflows, and test questions. Preserve raw responses before sharing other reviewers' positions. Local Qwen uses local source and provided primary-source excerpts when browsing is unavailable; note which sources were supplied rather than claiming independent web access. Do not lead a reviewer to desired conclusions.
3. **Constructive challenge:** exchange the actual findings and evidence, not a paraphrased favorable summary. Each reviewer identifies agreements, objections, missing evidence, counterarguments and what would change their mind. Include disagreement with ChatGPT's work and recommendations, not just new implementation details. Permit a reviewer to change its position, while preserving the original.
4. **Resolve using evidence:** consult current version-matched authoritative documentation and relevant FA professional disciplines; inspect complete affected source and tests, not merely the cited excerpt. Design a small benign deterministic regression or scoped native acceptance check where feasible; preserve negative results and missing coverage. Distinguish confirmed defect, verified intended behavior, credible open risk, refuted assertion with evidence, product decision and incomplete review. If uncertain, keep the relevant gate open. No offensive security tests, exploit development, live data, paid services or production experiments.
5. **Consult Francisco when unresolved:** present a concise decision card for substantive unresolved technical/product disagreements after feasible research, including all three positions (or reviewer not available), facts, alternatives, recommendation with rationale, user experience, cost, implementation and acceptance consequences, and the exact decision requested. Do not ask him to adjudicate every disproven factual claim or repeat routine approvals. Do not assume his silence equals agreement. His approved product choice governs implementation; it cannot make a failed/unexecuted test PASS.
6. **Record and follow through:** append raw reviewer input/output, exact source references, source links, separate reviewer positions, tests/observations, status and decision to the per-project GitHub ledger. Retain dissent even when resolved and do not edit it into consensus. Implement only authorized corrections on the appropriate feature branch, verify exact native candidate on the designated Mac mini, reconcile Figma changed scope and record retests. Francisco retains final release authority; no store submission/live purchase/release merge/production operation without authorization.

## Evidence and issue record

For each finding use a stable ID with:
- Project, current SHA/build, actual source path/line or symbol, reviewer/model, date, review scope/access.
- Original statement/objection, severity and evidence classification; raw transcript link.
- Each other reviewer's separate position and reasons; primary-source URLs, existing and new test outcomes plus their limits.
- Competing options, product/cost/privacy/reliability impact, remaining gate, owner decision if required.
- Status: OPEN, NEEDS_EVIDENCE, REFUTED_WITH_EVIDENCE, AGREED_RECOMMENDATION, OWNER_DECISION_REQUIRED, RESOLVED_VERIFIED, or BLOCKED. Preserve prior status history and links; do not use these review states to override the QA PASS/FAIL/NOT_RUN vocabulary.

## Roles and scope

- Claude: independent research and source review; existing Free account, read-only project access. No purchases or broad write-capable connector merely for review. If quota blocked, leave review pending and resume within free allowance.
- Qwen Coder: independent local source/test review on Mac mini via Ollama, no provider quota; actual model version, digest and context recorded, sequential to preserve build resources. Preserve uncensored relevant outputs and evaluate model limitations with evidence. No autonomous command execution, edits, or dispatch from model output.
- ChatGPT: independent technical assessment, coordination, research, implementation and verification when authorized. Not the final arbiter of disagreements. Preserve original peer findings and its own fallibility; seek reviewer response to contrary evidence.
- Francisco: final product/technology decision-maker, consulted on unresolved material differences and changes to approved specifications. Final native iPhone acceptance remains his authority.

Use the [professional standards and knowledge index](PROFESSIONAL_STANDARDS.md) and applicable project handoff. This process is additive to all established source/Figma/native QA/cost controls; it does not narrow any original must-have or declare either release ready.
