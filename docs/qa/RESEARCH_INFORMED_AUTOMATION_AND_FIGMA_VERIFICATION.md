# Research-informed automation and Figma verification

## Running the existing source suite

Plan: `node scripts/fa-research-qa.mjs --plan` from the repository. This validates matrix structure, IDs, referenced test files and existing source script names without running tests. It reports references not covered by the existing package test command; those are coverage gaps for review, not automated passes.

Execution on the designated Mac mini: `node scripts/fa-research-qa.mjs --run --expected-host <observed-hostname> --evidence-root <mounted-approved-evidence-folder>`. The evidence folder must already exist outside the checkout. Verify the package scripts are local/synthetic and no production endpoints are used before executing. Existing installed dependencies are required; the runner never installs them. It captures actual git SHA, tracked dirty state, Node/Expo, source command outputs, exit codes, duration and available TAP totals. Raw logs stay in the approved QA evidence folder; commit only reviewed, non-sensitive summaries. Failed, blocked, cancelled and skipped test outcomes must remain visible. Runner execution was not performed in the governance batch.

## Native/Figma verification method

For each matrix row, expand its workflow into individual controls and tuples: approved source and actual build ID, Figma file/node/revision or unmapped, entry point, action, valid and invalid inputs, expected state/return, source tests, platform/model, theme/text scale, observed result, screenshot/test log and disposition. Include all disabled, empty/loading/error states and preserve user-selected origin. Exact node vs family reference must be distinguished. Existing Figma mappings are historical, not current verified parity. Recheck the approved current node during execution.

Use actual source tests first. Then the already-owned Maestro/native frameworks with isolated synthetic fixtures; run one representative journey at a time and close unused emulators when appropriate. Verify installed build provenance against accepted source before native work. Native acceptance sequence: iOS simulator, Android emulator, physical Samsung, owner physical iPhone. No use of production data, destructive restore of owner data, live purchase, or unapproved production release. Preserve accepted builds; avoid rebuilding until exact authority is established. A native PASS requires explicit observed result and evidence, not merely navigation to a screen.

Do not rerun a test just to get a passing result. Record first failed outcome, fix the verified problem, then rerun the affected case. Reconcile Figma for each actual correction. New tools are candidates only after measurable gaps in existing automation.
