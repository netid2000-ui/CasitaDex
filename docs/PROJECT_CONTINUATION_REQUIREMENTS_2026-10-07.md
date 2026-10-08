# CASITADEX — PROJECT CONTINUATION HANDOFF
Date: October 7, 2026

Continue development of **CasitaDex** for **Designs by F&A**.

Treat this as a direct continuation of the existing project. Do not restart discovery, rename the product, weaken previously accepted standards, or recreate work that already exists.

======================================================================
1. OWNER / PROJECT DIRECTION
======================================================================

Owner: Designs by F&A

Working product name:
**CasitaDex**

Current positioning:
**Remember your home. Find it in seconds.**

IMPORTANT:
Do NOT promise a specific number of seconds.

Approved product loop:
**SAVE ONCE → FIND IN SECONDS → REMEMBER AUTOMATICALLY**

Approved core situations:
**BUY · FIX · FIND · MAINTAIN · SHARE**

Governing design standard:
**ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.**

Core product principle:
**Fewer features. Faster answers.**

CasitaDex is intended to become a polished, mainstream consumer utility rather than a complicated home-management database.

======================================================================
2. EVENT COMMAND IS THE DEVELOPMENT MODEL
======================================================================

CasitaDex must follow the same engineering, governance, QA, accessibility, documentation, security, recovery, cost-control, and release discipline established for the Designs by F&A Event Command project.

Event Command is the PROCESS MODEL, not a product template.

Reuse:
- governance discipline;
- charter-first execution;
- environment discipline;
- documentation standards;
- QA rigor;
- accessibility standards;
- recovery/runbook requirements;
- security principles;
- testing methodology;
- change-control discipline;
- Production authorization gates;
- cost awareness;
- durable decision documentation.

Do NOT blindly copy:
- Event Command Firebase architecture;
- Event Command backend IDs;
- Event Command bundle/package IDs;
- Event Command product logic;
- Event Command event-planning data model;
- Event Command credentials;
- Event Command notifications;
- Event Command Firestore rules;
- Event Command cloud assumptions.

Every future Designs by F&A app must use the same professional standards while choosing architecture appropriate to the actual product.

======================================================================
3. REQUIRED DEVELOPMENT WORKFLOW
======================================================================

For every material change follow:

READ CHARTER
→ REVIEW CURRENT STATUS / PRIOR DECISIONS
→ RESEARCH WHEN NEEDED
→ DOCUMENT
→ SPECIFY
→ IMPLEMENT
→ STATIC QA
→ AUTOMATED TESTS
→ RUNTIME QA
→ VISUAL / DEVICE QA
→ COMPARE AGAINST REQUIREMENTS
→ CORRECT
→ RETEST
→ DOCUMENT RESULTS
→ COMMIT

Do not ask the owner to perform the first QA pass when the assistant/tooling can perform it.

Do not mark work complete merely because code compiles.

Acceptance must be evidence-based.

When new software, dependencies, services, processes, ports, runtime assumptions, or recovery dependencies are introduced, update the recovery/runbook documentation in the same bounded batch.

======================================================================
4. CURRENT CASITADEX PROTOTYPE
======================================================================

Current prototype commit:
**a774e98**

The isolated, local-only prototype has already been created.

Implemented:
- Today
- Answers
- Add
- More
- BUY flow
- FIX flow
- FIND flow
- MAINTAIN flow
- SHARE flow
- local saving
- local recovery
- selective sharing
- enlarged-text support

Current prototype navigation:
**Today | Answers | Add | More**

Existing prototype result reported:
- starter guardrails: PASS
- TypeScript: PASS
- lint: PASS
- web export: PASS
- 12 automated tests: PASS
- 24 browser/accessibility checks: PASS

Still open:
- Expo Doctor online schema check timed out; classify as unresolved, not failed
- dependency advisories require review/classification
- native Android QA
- native iOS QA
- device data-durability testing
- screen-reader/native accessibility acceptance

No Production resources were created.
No Firebase resources were created.
No paid cloud resources were created.
No store submission was created.

If available in the working environment, prior prototype artifacts were reported at:

Prototype:
http://127.0.0.1:8765

Prior handoff:
C:/Users/franco/Documents/Codex/2026-10-07/referenced-chatgpt-conversation-this-is-an/outputs/CASITADEX_HANDOFF.md

Prior source ZIP:
C:/Users/franco/Documents/Codex/2026-10-07/referenced-chatgpt-conversation-this-is-an/outputs/casitadex-prototype-source.zip

Do not assume those local paths are accessible in a different environment. Prefer the repository/current workspace and commit a774e98 when available.

======================================================================
5. CURRENT ACCEPTANCE CLASSIFICATION
======================================================================

Current status:

**CASITADEX V1 PROTOTYPE FOUNDATION: PASS**

**WEB / BROWSER PROTOTYPE QA: PASS**

**STARTER ISOLATION / LOCAL-ONLY ARCHITECTURE: PASS**

**NATIVE ACCEPTANCE: OPEN**

**DATA DURABILITY ACCEPTANCE: OPEN**

**DEPENDENCY REVIEW: OPEN**

**EXPO DOCTOR ONLINE VERIFICATION: OPEN**

Do not declare final prototype acceptance until native-device and data-durability testing are complete.

======================================================================
6. SB-12A / STARTER RELATIONSHIP
======================================================================

CasitaDex is also serving as the realistic App #2 validation for the Designs by F&A reusable starter.

SB-12A has already proven that the reusable starter must support:

backendMode = "firebase"

and

backendMode = "none"

CasitaDex uses:
**backendMode = "none"**

This was intentional.

CasitaDex V1 must NOT gain Firebase merely because Event Command uses Firebase.

The reusable starter should support cloud-connected products and local-only products without forcing either architecture.

The Event Command SB-12 physical Android offline-storage closure remains a separate pending gate.

Do not use CasitaDex testing as evidence that Event Command SB-12 is closed.

Do not start Event Command SB-13 as part of CasitaDex work.

======================================================================
7. CASITADEX TECHNICAL DIRECTION
======================================================================

Approved V1 direction:

- React Native
- Expo
- TypeScript
- iOS + Android from one codebase
- local-first
- offline-first
- no required account
- no Firebase
- no Firestore
- no Cloud Storage
- no Cloud Run
- no continuously running F&A backend
- no AI API dependency
- no advertising SDK
- no server required for normal V1 operation

Structured data should use a durable local database.

Evaluate SQLite or another appropriate durable device store through a documented technical spike.

Do NOT assume AsyncStorage alone is appropriate for the complete structured-data/media architecture.

Images/documents should live in app-scoped local files with durable references from structured data.

Use local notifications for reminders.

Export/import must be user controlled.

Users may choose destinations such as:
- Apple Files / iCloud Drive
- Google Drive
- OneDrive
- other device file providers

This is portable export/import, not F&A-managed cloud synchronization.

======================================================================
8. HOME-FIRST, NOT HOME-LIMITED
======================================================================

CasitaDex launches as a home utility.

The architecture must NOT hard-code "house" as the only possible use.

Core neutral container:
**Space**

V1:
**My Home**

Future Spaces may include:
- second home
- condo
- rental property
- vehicle
- RV / camper
- boat
- workshop
- shed
- storage unit
- garden
- equipment collection
- hobby space

Do NOT expose all this complexity during V1 onboarding.

The user should initially experience CasitaDex as a simple home-memory utility.

Expansion rule:

If the user still needs to:
**remember useful facts about something they own/manage, retrieve them quickly, and know when something needs attention,**
expand CasitaDex.

If the customer job becomes fundamentally different, create a separate app.

Examples that should NOT turn CasitaDex into a giant suite:
- tenant management
- rent collection
- leases
- contractor dispatch
- full property management
- insurance workflows
- financial planning
- aging/family continuity planning

The previously discussed Life Continuity / Aging Readiness product remains a separate future app concept.

======================================================================
9. CORE DATA MODEL
======================================================================

Design around reusable neutral primitives.

SPACE
A physical context such as My Home.

ANSWER CARD
One useful remembered fact.

Examples:
- HVAC filter: 20 × 25 × 1
- refrigerator filter model
- living-room paint code
- main water shutoff location
- appliance model/serial
- last service date
- replacement part number

REMINDER
Optional local reminder associated with a card or maintenance action.

HISTORY ENTRY
Dated action:
- installed
- changed
- serviced
- painted
- repaired
- verified

MEDIA REFERENCE
App-owned photo/file associated with an Answer Card.

SHARE SNAPSHOT
Explicitly selected information prepared for sharing.

Do not build live household collaboration into V1.

======================================================================
10. ANSWER CARD UX
======================================================================

The ANSWER must dominate the screen visually.

Example:

HVAC FILTER

20 × 25 × 1

MERV 11
Hall closet ceiling
Verified from label · Sep 2026

Actions:
- Copy size
- Store Mode
- Share

Secondary information must remain secondary.

Do not force users to navigate a database taxonomy merely to find one answer.

======================================================================
11. CONTEXT MODES
======================================================================

Approved contextual use model:

BUY
Replacement details:
- sizes
- parts
- paint
- bulbs
- batteries
- purchase specifications

FIX
Relevant service/reference details:
- model
- serial
- warranty reference
- manual location
- service history
- prior service contact

FIND
Physical location/reference:
- shutoffs
- panels
- spare parts
- tools
- equipment
- location photos

MAINTAIN
Only useful maintenance:
- what is due
- last completed date
- succinct service history

SHARE
Selectively disclose only what the user chooses.

Potential derived presentation modes:

Store Mode
Fix Mode
Emergency Reference
Contractor Snapshot

These are views over the same user-owned data, not separate databases.

======================================================================
12. VERIFICATION / TRUST MODEL
======================================================================

CasitaDex must help users know whether remembered information is still trustworthy.

Approved states:

**Verified**
User affirmatively confirmed against a source.

**Needs checking**
Information may be stale or has not been reconfirmed.

**Unknown**
Required information has not been recorded or confirmed.

Possible sources:
- label/photo
- invoice
- manual
- user confirmed
- previous-owner note

Rules:
- never silently upgrade confidence;
- opening a card does not renew verification;
- edits must not automatically imply verification;
- clearly distinguish user-entered data from app-confirmed facts.

======================================================================
13. FIRST-RUN EXPERIENCE
======================================================================

DO NOT make users inventory their whole house.

Approved prompt:

**What's one thing you wish you could remember about your home?**

Examples:
- HVAC filter size
- paint color
- water shutoff
- appliance model
- last maintenance date

The user should create one useful Answer Card quickly.

Then:

**You're ready. Add more whenever something is worth remembering.**

No:
- completion guilt
- 13% complete meter
- giant setup wizard
- home inventory interview
- forced account creation

CasitaDex should be useful after ONE meaningful saved answer.

======================================================================
14. TIME-TO-ANSWER RULE
======================================================================

CasitaDex may say:

**Find it in seconds.**

Do NOT say:
- five-second guarantee
- under five seconds
- exact stopwatch performance promise

Measure real retrieval time during usability testing.

Compare CasitaDex with realistic alternatives such as:
- Notes
- Photos
- paper folder
- memory

Use evidence to simplify the UX.

Do not manipulate testing to satisfy an arbitrary stopwatch metric.

======================================================================
15. ACCESSIBILITY STANDARD
======================================================================

Use the same high accessibility standard established for Event Command.

Accessibility is universal and must never be a paid feature.

Required from the beginning:

- iOS Dynamic Type
- Android font scaling
- enlarged-text support
- aging-eye readability
- generous touch targets
- strong contrast
- light mode
- dark mode
- system appearance
- color-blind-safe redundant cues
- VoiceOver
- TalkBack
- logical focus order
- Reduce Motion
- visible labels
- no critical icon-only actions
- no hidden swipe-only critical actions
- no critical clipping
- no color-only status meaning
- understandable success/error/recovery text

Perform accessibility QA continuously, not as a final cosmetic pass.

======================================================================
16. PRIVACY / SECURITY
======================================================================

CasitaDex should collect less data rather than build complex protections around unnecessary data.

Default:
local device storage.

Do NOT require:
- full street address
- SSN
- banking credentials
- alarm codes
- door codes
- passwords
- credential-vault information

A user-chosen label such as "My Home" is enough.

No ads.
No sale of user information.

Do not claim:
"local-only means backed up."

Clearly communicate device-loss risk and encourage user-controlled export/backup.

Selective sharing must preview what will be disclosed.

Do not accidentally include unrelated Answer Cards or media.

======================================================================
17. SAFETY BOUNDARY
======================================================================

CasitaDex records information.

It is NOT a DIY hazardous-repair advisor.

Examples such as:
- water shutoff
- electrical panel
- gas reference

are user-recorded reference information.

Do not provide unsafe electrical/gas/structural repair instructions.

Do not imply that user-entered safety-critical information is verified by Designs by F&A.

======================================================================
18. V1 OUT-OF-SCOPE
======================================================================

Do NOT add these without a separate owner-approved product decision:

- Firebase/cloud sync
- account/login system
- live household collaboration
- contractor marketplace
- contractor booking
- AI repair diagnosis
- AI chatbot
- product catalog scraping
- affiliate shopping links
- smart-home integrations
- weather integrations
- home values
- mortgage tools
- insurance quoting
- insurance claims
- full renovation project management
- landlord rent collection
- leases
- tenant portals
- social/community features

Protect V1 simplicity.

======================================================================
19. MONETIZATION DIRECTION
======================================================================

Current hypothesis:

- useful free tier
- one-time Complete unlock
- no ads
- no V1 subscription

Indicative price research hypothesis:
approximately $14.99–$19.99 introductory lifetime unlock, subject to testing.

Do NOT finalize pricing without willingness-to-pay and competitive testing.

Do not promise one purchase unlocks both iOS and Android unless cross-platform entitlement behavior is intentionally designed and proven.

Accessibility cannot be paywalled.

Previously saved data must not become inaccessible merely because a purchase state changes.

======================================================================
20. FUTURE EXPANSION
======================================================================

Preferred expansion:

V1
Home.

V1.x
Multiple Spaces:
- second home
- condo
- simple rental
- workshop
- storage

Potential V2:
Vehicle / RV / boat templates.

Examples:
- tire size
- oil
- filter
- battery
- service history
- registration reminders
- winterization
- stored equipment

Possible later internal capability packs:
- CasitaDex Auto
- CasitaDex RV
- CasitaDex Workshop

Prefer these inside the CasitaDex app rather than separate applications as long as the underlying job remains the same.

======================================================================
21. CURRENT NEXT SUPER-BATCH
======================================================================

Proceed next with:

**CASITADEX — PROTOTYPE NATIVE ACCEPTANCE + DATA DURABILITY SUPER-BATCH**

Scope should include:

A. Dependency / tool health
- rerun Expo Doctor when online schema service is available;
- classify dependency advisories;
- avoid destructive force downgrades merely to clear audit output;
- document acceptable/transitive/toolchain risk.

B. Local data durability
- confirm chosen persistence mechanism;
- save representative Answer Cards;
- force-stop;
- cold relaunch;
- verify persistence;
- test offline cold launch;
- edit;
- delete;
- verify media cleanup;
- verify reminder persistence as applicable.

C. Representative Answer Cards
Use realistic examples, not generic placeholders:
- HVAC filter
- refrigerator/water filter
- paint color/formula
- main water shutoff
- appliance model
- last service date

D. Android native acceptance
Test:
- launch
- navigation
- add/edit/delete
- local persistence
- cold relaunch
- offline cold launch
- sharing
- enlarged text
- dark/light/system
- back behavior
- TalkBack
- touch targets
- clipping
- reduced motion where applicable

E. iOS native acceptance
Test equivalent:
- launch/navigation
- persistence
- cold relaunch
- offline behavior
- sharing
- Dynamic Type
- VoiceOver
- Reduce Motion
- dark/light/system appearance
- touch targets
- clipping

F. Find-it-in-seconds usability
Do NOT optimize to a fixed number.

Test representative tasks such as:
- find HVAC filter size;
- find paint color;
- find water shutoff;
- find appliance model;
- find last service record.

Record actual retrieval time and confusion points.

G. Documentation
Update:
- Product Charter if decisions change
- Current Project Status
- QA evidence
- architecture decisions
- recovery/runbook
- dependencies/process inventory
- continuation handoff

H. Commit discipline
Commit clean bounded work with exact test evidence.

======================================================================
22. PRODUCT PROTOTYPE VISUAL STANDARD
======================================================================

CasitaDex should feel:

- warm
- premium
- calm
- practical
- approachable
- modern
- highly readable

Avoid:
- enterprise database appearance
- giant forms
- excessive cards
- dashboard clutter
- tiny text
- gamification
- anxiety-producing maintenance scoring
- gimmicky motion
- decorative effects that slow retrieval

Real user photos can be useful when they help answer:
"Where is it?"

Every screen should answer:

**What is the fact?**
**Why should I trust it?**
**What can I do with it?**

======================================================================
23. QUALITY / RELEASE RULES
======================================================================

No Production environment unless explicitly authorized by the owner.

No App Store submission unless explicitly authorized.

No Google Play submission unless explicitly authorized.

No paid cloud services unless separately justified and approved.

No Firebase merely because the starter supports Firebase.

No major architectural addition without documenting:
- need
- alternatives
- cost
- privacy
- support burden
- failure modes
- recovery
- acceptance tests

Do not mark a super-batch accepted until evidence is recorded.

======================================================================
24. RECOVERY / RUNBOOK REQUIREMENT
======================================================================

Follow the Event Command recovery standard.

Document:
- required software
- CLI versions
- Node version
- Expo/EAS requirements
- Android Studio/emulator dependencies
- Xcode/iOS requirements when applicable
- local ports
- dev-server commands
- build commands
- test commands
- restore procedures
- local database location/behavior
- export/import format
- app-data recovery expectations

If anything changes, update the runbook in the same batch.

======================================================================
25. GOVERNANCE BOUNDARIES
======================================================================

CasitaDex is an independent product.

Event Command remains independent.

Do not modify Event Command merely to support CasitaDex unless the change is explicitly part of the reusable Designs by F&A platform/starter and does not alter Event Command behavior.

Event Command SB-12 physical Android closure remains pending separately.

CasitaDex work does NOT authorize Event Command SB-13.

CasitaDex itself should use its own project milestones/super-batches rather than inheriting Event Command's product SB numbers blindly.

======================================================================
26. ASSISTANT ROLE
======================================================================

Act as:

- Project Manager
- Technical Lead
- Product Lead
- UX Lead
- Accessibility Lead
- QA Lead
- Security / privacy reviewer
- Cost / support-burden reviewer

Research when appropriate rather than guessing.

Surface meaningful problems before asking the owner to test.

Make recommendations when evidence supports them.

Do not add complexity simply because a technology is available.

======================================================================
27. IMMEDIATE INSTRUCTION
======================================================================

Begin by:

1. locating and reviewing the current CasitaDex prototype at commit **a774e98**;
2. reading the CasitaDex Product Charter and current status documentation;
3. verifying the existing test results rather than assuming them;
4. examining the current local persistence implementation;
5. reviewing dependency advisories;
6. rerunning Expo Doctor if network/schema access is available;
7. planning and executing the **Prototype Native Acceptance + Data Durability Super-Batch**;
8. correcting defects found;
9. documenting evidence;
10. committing the completed bounded batch.

Do not create Production, Firebase, store, public-launch, or paid infrastructure resources.

Report:
- what was inspected;
- what passed;
- what failed;
- what was changed;
- exact commit(s);
- test/build evidence;
- remaining gates;
- recommended next super-batch.

Proceed without repeatedly asking for authorization for work already covered by this handoff.