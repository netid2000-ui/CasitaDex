# CasitaDex — Figma and design-governance recovery audit
Date: 2026-10-20. Classification: READ-ONLY RESEARCH / RECOMMENDATION, NOT NEW DESIGN APPROVAL.

## Evidence examined
- docs/PRODUCT_CHARTER.md v0.7 and amendments B-G, SB18 research brief/interactive approval, Oct 16 design-system baseline, SB20 integrated owner signoff, Oct 19 design refinement, SB26 architecture owner direction and efficiency plan, SB26 QA/acceptance documents. Reviewed repository docs inventory (269 Markdown/text/JSON candidates) and searched Figma references and .fig artifacts. Also consulted current official Apple Design Resources and Figma variables/developer handoff documentation.
- Repo branch acceptance/eng-review-20261019, HEAD 0814c04; authoritative dirty tree preserved.

## Governance findings
1. Charter principle: ART + FUNCTION + EXPERIENCE WITHOUT GIMMICKS; fewer features, faster answers; offline/local-first and universal accessibility. Keep source/control/approval gates separate.
2. SB18 interactive prototype approved as a visual interaction REFERENCE, not final native acceptance. Four destinations then Home/Find/Add/More.
3. Oct 16 design-system baseline approved: evergreen/sage, component states and responsive accessible layout; also four tabs. Oct 17 SB20 signed integrated four-tab design BASELINE with Home recent items (at most two), not license to implement.
4. Oct 20 SB26 approved a newer five-tab architecture Home/Memories/Photos/Reminders/Find and NO recent memories on Home; explicitly required Apple/Google official design resources, custom Figma shared tokens/components and store traceability. Older four-tab/recent-content approvals are historical superseded portions, not a reason to revert the latest architecture.
5. Owner later clarified Home MUST show Add Memory, Add Photo Memory, Add Reminder; this controls over SB26 earlier line suggesting two actions Add Memory and Find Something. The signed specification needs reconciliation into one definitive UI contract. Find remains a named fifth tab.
6. SB26 efficiency plan explicitly orders specification -> Figma-ready design system -> implementation -> QA. Continued detailed native visual acceptance before final Figma design was premature; preserve functional/security QA but pause per-pixel release testing.

## Figma evidence and capability
- No Figma file or Figma file URL discovered in inspected repository; no .fig file from candidate scan. This does NOT prove absence of a cloud file; team-level inventory/file link needed.
- Connected Figma account verified, Starter plan, VIEW seat. Connection does not prove ability to create/edit/publish Figma Design. Confirm permissions before promising an editable master; no paid upgrade without owner approval.
- Official Apple Design Resources include Figma iOS/iPadOS UI kits; Figma variables support semantic themes and modes, while advanced prototypes/library publishing can depend on plan. Official Google/Material resources should inform Android interaction patterns, not override CasitaDex identity.

## Proposed design-first super-batch (not new implementation authorization)
A. Record latest approved IA: five tabs; uncluttered Home; Add Memory, Add Photo Memory, Add Reminder; no recent memories; compact approved light/dark logo; Find distinct from Memories. Reconcile outdated two-action line in the Oct 20 document.
B. Inventory exact approved master branding assets, illustration provenance and file hashes; reuse rather than regenerate.
C. Verify editable Figma workspace/permissions. Establish reusable theme tokens, layout grid, component variants, focus/error/empty states, dynamic type, safe area handling and platform variants.
D. Produce linked prototypes for Home, Memories, Photos, Reminders, Find, Add/edit, photo viewer, answer/detail, share review, backup/restore, preferences, permissions, offline/empty/error states on iOS and Android.
E. Task-based usability review, owner review, revisions, definitive signoff and Figma-to-code handoff mapping before further visual acceptance.
F. After approval: isolated Development implementation and comprehensive visual, TalkBack and VoiceOver testing. Preserve security/functional QA.

No verified full Figma master, clickable complete prototype or signed SB26 Figma deliverable in reviewed sources. No production release, code patch, paid service, cloud, commit/push or protected device change authorized.

## Owner-approved creative flexibility rule (2026-10-20)
Owner explicitly confirms UI/UX is the appropriate phase for changes and agrees creativity/art should not be constrained by procedural rigidity. Treat earlier approved screens as reference baselines, not permanent artistic limits. Permit experimental alternatives and iterative review while retaining the CasitaDex core promise and user-owned offline data. New designs are explorations until owner selects one; selected designs are implementation baselines, not a ban on later improvement. No final visual acceptance until the current selected design is implemented. Keep security/backup correctness gates active and independent. Avoid unnecessary repeated emulator visual checks for intentionally evolving UI.

## Next design governance checkpoint
Before editing Figma, verify existing file URL/edit rights, locate approved logo/illustration originals, reconcile three Home creation actions and five tabs, and inventory current design tokens. Do not claim creation of an editable Figma design until file permissions and actual output are verified.

## Figma master created (owner authorized)
- Team: Designs by FA, Professional Full seat verified via connected Figma account.
- New file: CasitaDex — Designs by F&A — UI/UX Master (Exploration v0.1)
- URL: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
- Created editable exploration board including Home concept A with three direct creation actions, optional reminders, and five-tab navigation. 41 new editable nodes returned by Figma; page id 0:1, screen id 1:6. Colors/text are preliminary and exact approved logo/illustration originals are NOT imported. No claim of final prototype, design library, platform variants or approval.
- This is an exploratory new file, not evidence that previously unlocated Figma cloud masters are absent. Do not overwrite earlier files if subsequently located.

## Concept A.1 exploratory five-screen Figma design — 2026-10-21
- Owner preferred Warm Editorial (Concept A), authorized A.1 refinement and adaptation across the five destinations; original A, B and C remain untouched.
- Figma master https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=8-2; page 04 `Concept A.1 — Warm Editorial Refined`. Editable frame/text layouts created for Home, Memories, Photos, Reminders and Find. Home has Add Memory, Add Photo Memory, Add Reminder; optional upcoming reminder and five-tab navigation. Other screens share warm neutral / evergreen visual grammar.
- Original source logos and 3 artwork JPEGs verified at C:\CasitaDex-Git\assets\brand and src\brand.tsx; NOT yet imported into Figma. Header uses explicitly labeled logo placeholder, icons/photos likewise illustrative placeholders. No final vector assets, iOS variants, true Figma component library, working interactions or owner signoff claimed. All concepts exploratory; current application and acceptance environments untouched.

## A.1 phone-review navigation prototype — 2026-10-21
- Figma prototype link: https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr?node-id=8-5
- Design page 04. Figma verified 20 outgoing navigation reactions: four links from each of five frames Home 8:5, Memories 8:50, Photos 8:89, Reminders 8:130, Find 8:175. Current tab intentionally not linked to itself. This is an interactive NAVIGATION preview, not full functional flows.
- User will view on iPhone and provide screenshots for visual feedback. Real approved logo/illustration import, add flows, reminders interactions, component library and responsive platform acceptance remain pending. No changes to app source, accepted emulators or phone data.
