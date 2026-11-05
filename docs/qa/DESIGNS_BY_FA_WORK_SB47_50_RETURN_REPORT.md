# DESIGNS BY F&A — WORK-SB47–50 RETURN REPORT
November 4, 2026 (America/Chicago). Mac mini FA-MAC-DEV-01, AI Commander-only execution.

## Outcome
Completed supporting audit inventories, executable QA preparation, isolated scale checks, release matrices and evidence updates. No app implementation was promoted. WORK-SB47 remains IN PROGRESS for exact-control visual/native parity; metadata/source coverage does not establish full design parity. WORK-SB48 preparation complete, native NOT RUN. WORK-SB49 emulator/domain verification passed, full native E2E NOT RUN. WORK-SB50 matrices complete, operational monetization and release gates BLOCKED. Both apps remain NO-GO.

Original nine super-batches and six milestones preserved in both docs/qa/RUNNING_SUPERBATCH_STATUS.md; four supporting workstreams appended. No production, live billing, paid services, store submission, merge, simulator reset or existing data erasure.

## Git provenance
| App | Starting branch | Starting SHA | Supporting changes commit |
| --- | --- | --- | --- |
| CasitaDex | work/cd-sb41-edit-targeting-20261104 | 582e3a934d8619413bb5b05d9e40022b465637d9 | 7a57d0a0a061097254e5ca78848c50848c02262c |
| Event Command | work/ec-sb36-keyboard-save-20261104 | 697801a819de6c4e7aba207af1f3d4c6e31d71b2 | 6d56beef39cf58bf8f9e94b9f973ac443120a006 |

This report is a follow-up documentation commit. Its own immutable SHA is available in Git history and the command-center return handoff, avoiding a self-referential hash. Hosted remote is github; origin is a local intake bundle. Feature branches remain unmerged. Final push/readback recorded in command-center handoff.

## WORK-SB47 — Figma parity audit
Read-only live authorities:
- CD https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr — 25 functional/platform/accepted/review pages, 5,652 retained nodes.
- EC https://www.figma.com/design/WJCubVKVgPUH8kqa6aJ1gi — all 9 pages, 1,803 retained nodes.
- Session 6b4653dc-9020-44da-b223-3cc189338d13. No canvas edits.

Per-repo evidence: WORK_SB47_FIGMA_INVENTORY.json, WORK_SB47_SOURCE_INVENTORY.json, WORK_SB47_SOURCE_CONTROLS.md, WORK_SB47_SOURCE_AUDIT.md, WORK_SB47_FIGMA_SOURCE_MAP.{md,json}, WORK_SB47_PREFLIGHT_AND_FIGMA_FINDINGS.md.
Inventoried 310 CD and177 EC syntactic controls, source handlers/navigation, validation/data calls, route references and accessibility/disabled states. All487 source file/line references and referenced Figma IDs validated; zero missing frame IDs. Dynamic loops are templates, not one control per data row. Legacy/unreachable/shared rows explicitly classified. Crosswalk covers21 CD and19 EC screen families and identifies unmatched controls. Only9 CD and1 EC rows had literal label evidence in their matched families; exact behavior/style parity remains OPEN, not inferred.
CD historical artwork/exploration/library pages outside selected functional scope are not claimed audited. No pixel-level visual/native comparison performed in this checkpoint.

Actionable findings:
1. CD fixed top Edit actions differ from current bottom Save; viewer lacks next/previous/swipe/pinch; current branch lacks notification scheduling modules/dependency. Reconcile preserved candidate before implementing.
2. CD Home/form/draft/Find controls drift from later approved simplifications; taxonomy writes may outlive memory Cancel.
3. EC timeline readback/retry checks title/start only, optional end clearing and reorder UI incomplete; retry recovery needs review.
4. EC tab changes can lose local unsaved forms; Guests ScrollView renders all rows; budget display rounds cents; vendor creation is not full financial lifecycle.
5. Collaboration designs are candidates, billing gateways unconfigured, both-platform accessibility/visual states remain gates.

## WORK-SB48 — CasitaDex native QA preparation
Eight additive YAML files under .maestro/work-sb48 cover fixture opening, create/draft recovery, edit/save/relaunch, Cancel/Return, viewer zoom/close, all five photos after relaunch, linked reminder date, responsive action reachability.
WORK_SB48_CASITADEX_NATIVE_REGRESSION_PREPARATION.md contains device identity contract, unique fictional fixtures, manual native-picker setup, offline/reboot conditions, landscape/max-text/light/dark runs, notification permission/delivery cards and VoiceOver/TalkBack observer criteria.
Maestro syntax PASS8/8 (job58f6873e0488e5a5 exit0). Accepted tests unchanged (job905b391fe2a55934 diff exit0). No simulator operations. Source-derived selectors require native calibration; screen-reader visibility is not spoken acceptance. Linked date persistence is not notification delivery. Missing source functions are blocking gates rather than fabricated passing flows.

## WORK-SB49 — Event Command functional E2E
Six new files: two .maestro/work-sb49*.yaml, firebase.work-sb49.json, scripts/run-work-sb49.sh, tests/work-sb49-scenarios.rules.test.mjs, WORK_SB49_E2E_PREPARATION.md.
Dedicated loopback Firestore18449, hub18450, logging18451, websocket18452; demo-fa-sb49 only. Endpoint checks fail closed, unique fictional fixture IDs, no shared clearFirestore, preserved unrelated services; emulators shut down normally.
PASS2/2 full-scale emulator fixtures:10 birthday guests and1000 wedding guests; authenticated owner/editor writes, viewer denial/revocation, outsider isolation, RSVP/dietary preservation, invalid party sizes, same-time stable activity IDs, no duplicate idempotent write and fresh-client server readback. Fixture setup uses rules-disabled local test seeding; this does not prove native event creation.
PASS42/42 existing targeted domain/offline/cache/timeline tests. Both new native YAML parse. Full19-step per-platform birthday/wedding scenario prepared, including offline/reconnect, persistence, keyboard Save, permissions, RSVP/dietary, tasks/vendors/budget/documents/event-day and real UI performance. Emulator read times are not frame/interaction benchmarks. Native authenticated runtime and complete iOS/Android scenarios remain NOT RUN.
Evidence: QA-Evidence/work-sb49-emulator-final-20261104.log and work-sb49-domain-20261104.log.
Rules SHA256396fd45933c9b8aab5c76564d4f0169de3181829eec25856417fc1b0fdfcde8e; EC lock SHA256695a6b96326af7f3ac9b63e724b01f2e994b3df411a3a7d9cb89194ec540ff33.

## WORK-SB50 — monetization and release
Both repos contain WORK_SB50_MONETIZATION_RELEASE_MATRIX_20261104.md and sanitized WORK_SB50_SECURITY_EVIDENCE_20261104.json. Implementation/acceptance IDs cover Apple/Google purchases, restore, trusted entitlement validation, security/dependencies, privacy, accessibility, assets/metadata, signed native artifacts and owner release approval.
| Check | CD | EC |
| --- | --- | --- |
| Existing billing safety regressions | PASS2/2 | PASS3/3 |
| Purchase/restore gateway | configured=false; throws | configured=false; throws |
| Tracked source Gitleaks |0 findings; exit0 |2 Firebase client-key-pattern detections; exit1 |
| Root-lock OSV |6 advisory instances/5 families; exit1 |19 advisory instances/12 families; exit1 |
Scan wrapper exited0 while preserving individual nonzero scan exits; security scan PASS is not claimed. EC client keys need restrictions review; they are not automatically confirmed secret exposure. OSV instances are not confirmed exploitable vulnerabilities. Scope excluded QA/security docs, Git history, native and functions lockfiles; these remain required release review.
Evidence: external SSD QA-Evidence/WORK-SB50-20261104/{CD,EC}, scanner versions/exits/checksums in committed sanitized manifests. No raw credentials/findings reproduced.
Native sandbox purchase/restore/refund/revoke/expiry, store product configuration, signed builds, privacy disclosures, full security triage and owner acceptance remain BLOCKED/NOT VERIFIED.

## Next actions in dependency order
1. Reconcile installed native build identity against authoritative Git, restore EC isolated Auth/Firestore/Functions and dedicated Metro with verified demo-only routing; execute native keyboard-open guest Save/preservation/permissions/relaunch.
2. Implement/reconcile P0 viewer and scheduler gaps in CD, top Edit actions and source simplifications; reserve dedicated devices and execute prepared regression flows without clearing data.
3. Fix EC timeline full payload/readback, optional clearing/retry/reorder and dirty navigation; execute same-time activities and offline/reconnect natively.
4. Run complete birthday/wedding native journeys on both platforms with actual UI performance evidence; verify financial display and role scopes.
5. Triage OSV findings and client-key restrictions; extend scans to history/functions/native/artifacts. Configure sandbox purchases/verifier and execute purchase lifecycle without live billing.
6. Complete visual per-control parity, landscape/XL/light-dark/VoiceOver/TalkBack, signed provenance, store assets/privacy and owner physical-device/final release acceptance.

## RETURN HANDOFF — DESIGNS BY F&A COMMAND CENTER
Resume from the same two pushed feature branches. Supporting commits CD7a57d0a and EC6d56bee contain the work; follow-up report commit heads are provided in the final command-center message. Changes remain unmerged.
Mac mini FA-MAC-DEV-01 is exclusive authority; AI Commander used throughout. Older dirty candidates and simulator data preserved. No native device jobs were started by WORK-SB47–50. Dedicated SB49 emulators stopped normally. No unattended follow-on work is claimed.
Prepared:487 control inventory/crosswalk, live34-page Figma evidence,8 CD Maestro flows,2 EC Maestro flows, complete birthday/wedding runbook and dual-app release/monetization matrices.
Verified:8/8 CD syntax;2/2 EC emulator scenarios;42/42 targeted regressions;CD2/2+EC3/3 billing-safety checks; JSON/reference/diff checks. Security findings remain open. Native acceptance was NOT RUN and neither app is release-ready.
Original nine batches/six milestones preserved, four supporting workstreams appended in both ledgers.
Next: isolated EC native guest acceptance; CD candidate reconciliation/viewer/reminders; timeline/draft corrections; full native scenarios/accessibility; security/billing/signing gates. Owner physical-iPhone signoff remains reserved.
This handoff must be pasted into the original ChatGPT command-center conversation. Nothing transfers automatically.
