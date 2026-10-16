# CasitaDex — V1 Product Charter

Version: 0.5 — 2026-10-15 (SB-18 optional BYOS monetization design amendment)
Status: WORKING PRODUCT NAME APPROVED / PRODUCT DESIGN AUTHORIZED / IMPLEMENTATION RESOURCE GATES STILL CLOSED
Owner: Designs by F&A

> **ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.**

## Product identity
**Working name:** CasitaDex
**Positioning:** **Remember your home. Find it in seconds.**
**Product loop:** **SAVE ONCE → FIND IN SECONDS → REMEMBER AUTOMATICALLY.**
**Core moments:** **BUY · FIX · FIND · MAINTAIN · SHARE**

CasitaDex is the owner-approved working product name. Initial screening has been encouraging, but it is **not formal legal clearance**. Before public launch, filing, store submission, paid branding, or major marketing spend, complete comprehensive trademark/common-law/store/domain review and obtain professional clearance if appropriate.

## Product thesis
People repeatedly need small, exact facts about the physical things they own: filter sizes, paint codes, model numbers, shutoff locations, part numbers, service history, where something is stored, and when something needs attention.

The problem is not a lack of databases. The problem is that the answer is often buried in photos, Notes, receipts, manuals, labels, paper folders or memory.

CasitaDex should feel like a **fast personal index of useful physical-world facts**, not another system the user has to manage.

## Governing product rule
**Fewer features. Faster answers.**

Do not optimize for time spent in the app. Optimize for:
- successful answers per opening;
- low setup burden;
- low support burden;
- trustworthy information;
- reliable offline use;
- portability and user control.

## Home-first, not home-limited
V1 is marketed and designed around **the home** because that is concrete, broadly useful and easy to understand.

The underlying architecture must not hard-code the concept of a house as the only possible container.

### Core neutral object: Space
A **Space** is a user-defined physical context that contains useful memory.

V1:
- My Home

Potential later Spaces:
- second home;
- condo;
- rental property;
- vehicle;
- RV / camper;
- boat;
- workshop;
- shed;
- storage unit;
- garden;
- hobby room;
- equipment collection.

A new user should not see this future complexity. V1 onboarding starts with **My Home**.

### Expansion rule
Expand CasitaDex when the new use shares the same basic job:

> **I own or manage something, need to remember useful facts about it, find those facts quickly, and know when something needs attention.**

Create a separate app when the customer job changes materially.

Examples that should remain separate:
- life-continuity / aging-family planning;
- full landlord/property-management workflows;
- tenant portals, rent collection and leases;
- contractor dispatch;
- regulated insurance/financial workflows.

## Core data model
Design the V1 schema around reusable neutral primitives:

### Space
A named physical context such as My Home.

### Answer Card
One useful remembered fact.

Examples:
- HVAC filter: **20 × 25 × 1**
- living-room paint: **SW 7036 · Eggshell**
- main water shutoff: **Garage · left wall**
- refrigerator filter: **EDR4RXD1**

### Reminder
Optional local reminder tied to a card or maintenance action.

### History Entry
A dated event such as installed, changed, serviced, painted, repaired or verified.

### Media Reference
App-owned photo/file attached to a card.

### Share Snapshot
An intentionally selected, previewed export of only the information the user wants to disclose.

These primitives should support later vehicle/RV/workshop templates without changing the fundamental engine.

## Context-first UX
Do not make users think in database categories first.

Ask what they are trying to do.

### BUY
Exact sizes, parts, paint, bulbs, batteries and replacement specs.

### FIX
Model, serial, warranty reference, manual location, service history and prior service contact.

### FIND
Shutoffs, panels, spare parts, tools, equipment or other locations, aided by photos.

### MAINTAIN
What is genuinely due and the last relevant service/change history.

### SHARE
Selectively show a contractor, household member, sitter or future owner only what they need.

## Context Modes
Context Modes transform the same stored facts for the immediate situation.

### Store Mode
Shows replacement facts only:
- filter sizes;
- part numbers;
- paint;
- bulbs;
- batteries;
- other purchase specs.

### Fix Mode
Shows technical/reference details relevant to repair or service.

### Emergency Reference
Surfaces user-recorded critical locations such as water shutoff and electrical panel without providing hazardous repair instructions.

### Contractor Snapshot
Creates a limited view/export for selected equipment and history.

Context Modes are presentation filters over user-owned data, not separate databases.

## Home Answer Card design
The **answer** is visually dominant.

Example:

**HVAC FILTER**

# 20 × 25 × 1

MERV 11
Hall closet ceiling
Verified from label · Sep 2026

Actions:
- Copy size
- Store Mode
- Share

Secondary metadata stays visually secondary.

## Verification / freshness
Home facts can become stale.

States:
- **Verified** — user affirmatively confirmed against a source.
- **Needs checking** — stale or no longer confidently current.
- **Unknown** — information is missing or never confirmed.

Possible source labels:
- label/photo;
- invoice;
- manual;
- user confirmed;
- previous-owner note.

The app never silently upgrades confidence.

Opening a card does not renew verification.

## V1 navigation
Keep the primary experience small:

**Today | Answers | Add | More**

### Today
Only useful reminders and genuinely relevant stale/verification prompts.

### Answers
Fast search and context entry.

### Add
Short answer-card creation.

### More
Backup/import, purchase restore, settings, support and later Space management.

Do not expose a giant inventory dashboard.

## First-run experience
Do not ask the user to inventory the house.

Prompt:
> **What's one thing you wish you could remember about your home?**

Examples:
- HVAC filter size;
- paint color;
- water shutoff;
- appliance model;
- last maintenance.

Save one useful answer. Then:
> **You're ready. Add more whenever something is worth remembering.**

No completion guilt and no forced household setup interview.

## Time-to-answer principle
CasitaDex may promise **find it in seconds**.

It must **not promise a specific number of seconds**.

During usability testing:
- measure actual unassisted retrieval times;
- compare CasitaDex with familiar alternatives such as Notes, Photos or paper;
- record distributions and failure points;
- improve navigation based on evidence.

The product promise should remain human and durable rather than a stopwatch guarantee.

## Accessibility
Accessibility is universal and never paywalled.

Requirements:
- Dynamic Type / Android font scaling;
- aging-eye readability;
- generous touch targets;
- high contrast;
- redundant cues beyond color;
- VoiceOver/TalkBack semantics;
- Reduce Motion support;
- no critical icon-only control;
- no critical swipe-only action;
- no clipping at enlarged text;
- plain-language errors and recovery.

## Safety and privacy
- Local-first by default.
- No required account in V1.
- No advertising SDK.
- No sale of user data.
- No required home address.
- Do not solicit alarm codes, door codes, passwords or credential-vault secrets.
- User-entered shutoff/electrical/gas information is reference data, not a safety guarantee.
- No hazardous DIY instructions.
- Backup/export must clearly disclose what will be included.
- Local-only must never be misrepresented as automatically backed up.

## V1 technical direction
- React Native + Expo + TypeScript.
- Generated from the accepted Designs by F&A starter.
- **Local-only / no-backend mode** by default.
- Durable local structured database; evaluate SQLite during implementation spike.
- App-scoped local files for images.
- Local notifications.
- User-controlled versioned export/import.
- No Firebase, Cloud Run, F&A-hosted sync or required server in V1.
- No AI/API dependency in V1.
- iOS + Android from one codebase.

CasitaDex is the first meaningful test that SB-12A must support an app that **does not need Firebase**.

## Explicitly out of V1
- live household sync;
- F&A account system;
- cloud backup service;
- contractor marketplace;
- repair diagnosis;
- AI chatbot;
- product catalog scraping;
- affiliate shopping;
- smart-home control;
- weather;
- insurance;
- mortgages;
- renovation budgeting/project management;
- tenant/rent/lease management.

## Monetization hypothesis
Prefer one-time purchase over subscription because the V1 architecture has no recurring application backend.

Working hypothesis:
- useful free tier;
- one **Complete** lifetime unlock;
- introductory range around $14.99–$19.99, subject to store/competitor/willingness-to-pay testing;
- no ads;
- no subscription in V1.

Do not promise that one purchase unlocks both Apple and Google storefronts unless cross-platform entitlement behavior is intentionally built and tested.

## Later expansion sequence
### V1 — Home
Answer Cards, search, context modes, local reminders, export/import.

### V1.x — Multiple physical Spaces
Second home, condo, simple rental, workshop or storage.

### V2 candidate — Vehicle / RV / boat templates
Reuse the same engine with relevant presets:
- tire size;
- oil/filter;
- battery;
- service history;
- registration reminders;
- stored equipment;
- winterization / seasonal items where applicable.

### Later — capability packs inside CasitaDex
If evidence supports them, expose optional templates such as:
- CasitaDex Auto;
- CasitaDex RV;
- CasitaDex Workshop.

These are **inside the same app**, not separate downloads, unless the workflow evolves into a fundamentally different customer job.

## Commercial differentiation
CasitaDex is not trying to hold the most home data.

It should win on:
- answer-first display;
- context-first entry;
- verification/freshness;
- no inventory tax;
- offline operation;
- low maintenance burden;
- broad future usefulness without V1 complexity.

## V1 acceptance questions
Before implementation acceptance:
1. Can first-time users understand what CasitaDex remembers?
2. Can users find a saved answer in seconds without knowing a database category?
3. Is the dominant answer visible without opening secondary metadata?
4. Do users understand Verified versus Needs checking?
5. Does Store Mode remove irrelevant information?
6. Can sharing be previewed and limited confidently?
7. Does the app remain useful offline?
8. Can all data and app-owned media be exported and restored reliably?
9. Does the experience remain usable at enlarged text and with screen readers?
10. Can the system add a future Space/template without rewriting the core data model?

## Build/resource gate
This charter authorizes product design, the existing isolated CasitaDex prototype, and bounded development/verification under the super-batch controls below. SB-12A is the reusable-starter program, not a CasitaDex product milestone.

It does **not** authorize:
- a Production environment;
- store submission;
- paid infrastructure;
- Firebase provisioning;
- a public trademark claim;
- public launch.

The existing isolated, local-only CasitaDex repository and Development/Staging identities are already created. This historical bootstrap gate is satisfied for the prototype only; it is not authorization for cloud, Production, store, or public launch.


## Amendment B — Chief Product & Technology Lead (2026-10-08)

**Owner-approved expert leadership model:** The assistant acts as **Chief Product & Technology Lead — Consumer Home Utility** for CasitaDex and coordinates nine complementary disciplines:

1. **Project Management:** super-batches, dependencies, owner decisions, acceptance evidence and recovery checkpoints.
2. **Consumer Product Strategy:** homeowner jobs-to-be-done, market positioning, competitive research, scope discipline and monetization hypotheses.
3. **Residential Home Systems:** practical homeowner reference needs across HVAC, plumbing, appliances, maintenance and physical locations; never substitute for licensed hazardous-repair guidance.
4. **Mobile Software Architecture:** React Native/Expo, native SQLite, offline operation, iOS/Android lifecycle and maintainability.
5. **UX/UI and Visual Direction:** answer-first interaction, warm premium visual design, clear trust cues and appropriate sensory treatment.
6. **Inclusive Accessibility:** aging-eye readability, Dynamic Type, TalkBack, VoiceOver, contrast, reduced motion and reachable controls; accessibility remains free.
7. **Privacy and Security:** data minimization, local data integrity, selective disclosure, portable backups and failure analysis.
8. **QA and Reliability:** first-pass independent verification, device tests, regression evidence, risk classification and defect closure.
9. **Consumer Business and Distribution:** honest pricing research, support economics, store-policy readiness and launch preparation without premature release.

**Operating expectation:** Bring professional-depth research, judgment and proactive recommendations across these perspectives rather than simply implementing requests. Evaluate usefulness, safety, reliability, accessibility, privacy, complexity and support cost together. Identify when external specialist verification is warranted; do not misrepresent the assistant as a credentialed professional or fabricate device testing, user research or audit sign-off.

**Execution authority:** Within the owner-approved bounded super-batch, independently inspect, research, design, implement, test, correct and document. Flag material changes to scope, architecture, money, security, infrastructure or external commitments for owner decision. The owner retains final authority over those changes and all Production, distribution and commercial gates.

**Conversation continuity:** The originating CasitaDex conversation remains command center; execute here first with available tools. Any indispensable handoff must require a complete return report to that exact originating conversation and a copyable fallback. No completed batch is accepted without recorded evidence, clean source-control state or an explicit exception, and outstanding gates.

**Decision principles:** **ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS**; **Fewer features. Faster answers.** Protect the first-run one-answer experience and the BUY · FIX · FIND · MAINTAIN · SHARE contexts.

---

## Amendment A — Professional engineering and execution governance (2026-10-07)

CasitaDex follows the **Designs by F&A Event Command process standard**, not its Firebase architecture or event-planning product model. The assistant operates as project manager, technical lead, product/UX lead, accessibility and QA lead, security/privacy reviewer, and cost/recovery reviewer. **ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS** and **Fewer features. Faster answers.** govern tradeoffs.

### Charter-first and evidence-first change control

For every material batch: read this charter and latest status/ADRs; examine actual repository and accepted evidence; research affected tools and constraints; document options, risk and acceptance tests; implement the smallest bounded change; run static, automated, runtime and visual/device QA where accessible; correct and retest; update evidence/runbook/status; commit. Do not treat a build or browser test as native-device acceptance. Record PASS, FAIL, BLOCKED and NOT RUN separately. The owner does not serve as the first QA pass.

Preserve a **single originating-chat command center**. Execute directly in that conversation when tools permit. When another environment is indispensable, its instruction must mandate a self-contained return handoff to the originating chat (commits, changes, failures, tests, remaining gates and next decision), with copyable fallback if automatic return is unavailable. No unrequested scope expansion or automatic launch of the next major super-batch.

### Environment, security, resilience and cost gates

Keep unique Development/Staging identities and isolated local databases; Production remains locked until separately authorized. V1 uses `backendMode=none`, app-scoped SQLite/media, and user-controlled import/export. Neither Firebase nor another permanent backend is implied by the reusable starter. No cloud build, remote repository creation, store submission, paid service, public launch, account system, ads, or analytics is authorized by this amendment. Private GitHub backup is the preferred future durability mechanism but requires an explicit repository/access path; never mistake a local Git bundle for off-device backup. Never commit secrets, local user data, generated signing keys or private credentials.

Document new/changed software, runtime versions, dependencies, ports, build commands, fallback and restore procedures in the runbook **in the same batch**. Preserve source and commit integrity; do not overwrite interrupted work, silently migrate records, or mark open gates accepted. Critical accessibility (dynamic scaling, screen readers, contrast, reachability, redundant status cues, reduced motion) is free. The answer, confidence source and next action must remain obvious even at large text sizes.

### Super-batch authority and phase gates

The approved ordered work program is maintained in [`docs/CASITADEX_SUPER_BATCH_PLAN.md`](CASITADEX_SUPER_BATCH_PLAN.md). Each batch has deliverables, objective exit evidence, dependency gates and an explicit stop/return checkpoint. Owner approval to **proceed** authorizes execution of the next bounded, non-Production super-batch; it does not waive native acceptance or authorize Production/cloud/store spending. Scope or platform changes with new material cost/security implications require a documented decision before execution.

The current approved starting point is **CD-SB-01 — Native Build Recovery + Repository Durability**. It may validate and correct local builds, assemble audit evidence, and prepare a private-repository plan. Do not create any external repository automatically merely to overcome absent desktop access. The next gate **CD-SB-02** cannot be marked closed until the installable APK and required Android device evidence exist.

### Non-goals and later product scope

Home-first, not home-limited remains architectural only. Multiple Spaces, vehicle/RV/boat packs, memberships, cloud sync and household collaboration are not part of the immediate native closure. Local device notifications must respect the strict no-Firebase dependency graph; any apparent Google/Firebase transitive dependency requires explicit technical review, not a quiet exception. Product claims and pricing remain hypotheses pending research and tests.


## Amendment C — AI Commander execution and continuation (2026-10-11)

Owner authorization: **AI Commander — CasitaDex is the authorized default Windows
execution path, replacing mandatory Work-mode handoffs.** Execute from the active
CasitaDex project conversation against aic-DESKTOP-FP0BMH2 (DESKTOP-FP0BMH2),
using the eligible Primary connection. Verify current link metadata and session
status; never assume old connection identifiers remain valid.

Within the approved bounded batch, use AI Commander for repository inspection,
research-supported implementation, tests, local Staging builds, evidence,
documentation and local commits. Prefer non-elevated, scoped commands. This
authority does not bypass connector approvals or expand release/security gates.
Do not send the owner to Work or another chat when connected tools suffice.
If a capability is genuinely missing, explain the exact blocker and use the
least disruptive supported alternative. An owner-requested new chat is permitted.

Before substantive continuation, read this charter, current status, roadmap,
applicable ADRs, acceptance evidence, security/dependency reviews, and runbook.
Verify actual branch, HEAD, worktree, artifacts and device state. Resolve stale
historical summaries against current evidence without discarding open gates.
Apply all nine Amendment B disciplines. Research affected capabilities, current
official documentation, limitations, compatibility, cost, privacy/security,
failure modes, recovery and accessibility as relevant; record sources, dates,
decisions and remaining uncertainty before material implementation. Mark
non-applicable disciplines with a reason; do not fabricate specialist sign-off.

Every handoff must include all nine roles, required reading, research obligations,
authorization boundaries, exact source/artifact evidence, completed work, open
gates and next action. A receiving chat must read these before making changes.
It must provide a complete return handoff addressed to the originating CasitaDex
conversation, with actions, commits, tests, failures, blockers and next steps;
provide copyable text if automatic return is unavailable.

Keep $0 recurring cost, no paid tunnels/billing activation, no exposed Windows
ports, local-only/no Firebase, no Production/store/public launch. Preserve
repositories, backups and household data. Agent uninstall, access-code reset,
account deletion and destructive recovery require explicit owner approval.
This amendment supersedes older mandatory Work-routing language only; all other
charter controls and owner acceptance gates remain in force.

## Amendment D — Local-first with optional monetized cloud convenience (2026-10-15)

Owner-approved PRODUCT DESIGN DIRECTION: core CasitaDex remains offline-first. Users may later pay for optional online storage/backup management, preferably using their own OneDrive, Google Drive, iCloud Drive or OS Files provider. F&A does not inherently provide cloud storage with this upgrade; provider capacity, accounts and fees are separate. See `SB18_BYOS_STORAGE_MONETIZATION_DECISION_2026-10-15.md`.

Non-negotiable FREE rights: local answer access, photo/voice access when released, accessibility, local search, manually exporting/restoring ALL supported personal data and backups, and recovery without a paid entitlement. Encryption of manual portable backups, when implemented, is not Pro-only. Pro monetizes convenience: optional direct account integration, consent-driven verified and potentially scheduled encrypted backup, version management and restore-assist, subject to OS/background constraints and explicit technical acceptance. Premium expiration must not strand the user's files or break local use.

This is NOT authority to implement network dependencies, OAuth/billing, backend/cloud storage, subscriptions, Production, or store listing under V1. Original V1 no-cloud and one-time Complete purchase *implementation gates* remain until separately amended after cost, security, platform-policy and willingness-to-pay research. Pricing and whether the premium offering is lifetime or recurring are OPEN decisions; no recurring infrastructure is authorized.
