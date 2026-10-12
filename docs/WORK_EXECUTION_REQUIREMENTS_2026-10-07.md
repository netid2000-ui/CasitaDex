Current routing: Charter v0.4 Amendment C authorizes AI Commander directly from the project chat, replacing mandatory Work-mode handoffs. Read AI_COMMANDER_NEW_CHAT_HANDOFF_2026-10-11.md and all required charter/documentation/research/role obligations before continuation. Historical execution evidence below remains retained.

# CASITADEX — WORK EXECUTION & RETURN HANDOFF
**Date:** October 7, 2026
**Owner:** Designs by F&A
**Starting commit:** `a774e98`

## Mission

Continue the existing CasitaDex project and execute the **Prototype Native Acceptance + Data Durability Super-Batch**.

Use the attached CasitaDex Project Continuation Handoff as the authoritative requirements source.

Event Command is our governing model for development discipline, QA, accessibility, security, documentation, cost controls, and release procedures. It is not a blueprint for CasitaDex's architecture.

Act as Project Manager, Technical Lead, Product Lead, UX Lead, Accessibility Lead, QA Lead, and Security/Privacy Reviewer.

## 1. Restore and Verify Project State

1. Locate the existing CasitaDex repository and commit `a774e98`.
2. Read the Product Charter, Current Project Status, architecture decisions, existing QA evidence, and recovery runbook.
3. Verify the reported automated tests, browser checks, TypeScript, lint, and web export.
4. Inspect the current local data-storage implementation.
5. Review outstanding dependency advisories.
6. Rerun Expo Doctor where possible.

Do not rebuild the prototype or overwrite existing work.

## 2. Complete Local Data Durability

Test representative Answer Cards using actual CasitaDex functionality.

Include HVAC filters, refrigerator filters, paint formulas, water shutoffs, appliance models, and maintenance history.

Verify:

- Save, retrieve, edit, and delete
- Force-stop and cold relaunch
- Offline cold launch
- Media persistence and cleanup
- Local reminder persistence, where implemented
- Import/export and recovery behavior, where implemented
- Data isolation and selective sharing

Assess whether the existing persistence mechanism is suitable for V1. Document a technical decision before any material storage migration.

## 3. Complete Native Android and iOS Testing

Test both platforms as far as available tooling permits.

Cover navigation, Answer Cards, cold launch, offline use, sharing, local storage, light/dark/system appearance, enlarged text, screen readers, touch targets, clipping, focus order, and reduced motion.

Use Android TalkBack and iOS VoiceOver where possible.

Clearly distinguish automated, emulator/simulator, and physical-device evidence.

If physical-device testing is unavailable, leave that acceptance gate OPEN.

## 4. Validate Product Experience

Test the approved product loop:

**SAVE ONCE → FIND IN SECONDS → REMEMBER AUTOMATICALLY**

Evaluate the five contexts:

**BUY · FIX · FIND · MAINTAIN · SHARE**

The Answer Card must prioritize the answer, trust state, and next useful action.

Measure actual information-retrieval performance without introducing arbitrary time guarantees.

Preserve the simple **Today | Answers | Add | More** navigation and approved V1 scope unless evidence supports a documented correction.

## 5. Resolve Defects

Correct confirmed problems within the authorized scope.

For every material change:

Read Charter → Research → Document → Specify → Implement → Test → Device QA → Correct → Retest → Record Evidence → Commit.

Do not substitute successful compilation for functional acceptance.

## 6. Update Durable Documentation

Update as appropriate:

- Current Project Status
- QA acceptance matrix and evidence
- Architecture decisions
- Dependency classification
- Recovery/runbook
- Software and service inventory
- Remaining gates
- Next super-batch proposal

Record exact test commands, results, environment details, and commit hashes.

## 7. Mandatory Boundaries

- No Firebase or F&A-managed cloud backend
- No Production deployment
- No paid infrastructure
- No App Store or Google Play submission
- No forced accounts or advertising SDKs
- No unrelated Event Command modifications
- No Event Command SB-13 work
- No unsupported claims of acceptance

Preserve CasitaDex's local-first, offline-first, privacy-oriented architecture.

## 8. Required Return to ChatGPT

When the authorized work is complete, provide a **CASITADEX — WORK COMPLETION & CHATGPT RETURN HANDOFF** containing:

1. Executive summary and completion classification
2. Repository, branch, starting HEAD, and final commit hashes
3. Changes implemented
4. Tests passed, failed, blocked, and not run
5. Android acceptance evidence
6. iOS acceptance evidence
7. Persistence and recovery evidence
8. Accessibility findings
9. Dependency findings
10. Documents updated
11. Unresolved defects and risks
12. Exact remaining acceptance gates
13. Recommended next super-batch
14. Explicit confirmation that Production, Firebase, paid cloud, and app-store boundaries were respected

**Important:** Hand the project back to this ChatGPT conversation for review and next-step authorization. Do not begin another major super-batch automatically.

If return-to-chat automation is unavailable, provide the complete return handoff directly in Work for the owner to paste here.