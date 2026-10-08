# CasitaDex — V1 Product Charter

Version: 0.1 — 2026-10-07
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
This charter authorizes product design and SB-12A dry-run testing.

It does **not** authorize:
- a Production environment;
- store submission;
- paid infrastructure;
- Firebase provisioning;
- a public trademark claim;
- public launch.

A real CasitaDex repository/Expo identity should be created only after SB-12A starter validation is sufficiently green and the owner authorizes the bootstrap step.
