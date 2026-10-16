# SB-18 — Owner-Approved Household Memory Design Baseline
**Decision date:** 2026-10-15 (Central Time)
**Project:** CasitaDex / Designs by F&A
**Decision:** Owner approved the October 15 interactive prototype as the **visual and interaction baseline**. This is a baseline acceptance, **not** native implementation, final usability acceptance, commercial authorization or waiver of reliability gates.

## Exact accepted reference
- Source: `docs/design/SB18_household_memory_interactive_concept.html`
- SHA-256: `167C9452AF16BD30D87A2BFFD73FC0841FD2DF8B1D4637CAD3C5C1D359B05810`
- Reviewed prototype delivered in commit `5408ece`; use the same source and screenshots as comparison evidence.
- Reference screenshots: `SB18_mobile_first_visit.png`, `SB18_mobile_home.png`, `SB18_mobile_answer.png`, `SB18_mobile_photo.png`, `SB18_mobile_voice.png`, `SB18_mobile_storage.png`, `SB18_mobile_zoom_130pct.png`, `SB18_desktop_review.png`.
- Story: “A household memory app people can trust for years—not an inventory application that continually asks them to upgrade.”

## Accepted visual and interaction direction
1. Warm, calm, accessible visual language: near-white and muted sage surfaces, deep-green text and action styling, readable system typography, spacious answer cards, clear contrasting labels.
2. **Answer-first** content hierarchy: relevant fact large and immediate; title, location and trust/verification context secondary; photos and audio help recall rather than turn the app into a file library.
3. Simple four-destination initial navigation: **Home · Find · Add · More**; room/space browse discoverable inside Find. Test large-text reachability and candidate five-tab alternative before final native acceptance. Do not silently introduce a dedicated inventory tab.
4. Gentle first run: “Save your first answer”; no account, setup checklist, inventory wizard, payment demand or mandatory category.
5. Capture flow includes writing, photograph and voice as first-class choices. The prototype only **simulates** camera/voice, so native implementation needs permission, privacy, local file durability and interruption testing.
6. Storage and trust copy clearly distinguishes **Saved on device** from **Backup verified**. Free complete manual export/restore stays available. Cloud Care and Complete are optional and quiet, not an app storefront.
7. Existing accessibility expectations remain universal/free: dynamic type, screen readers, contrast, reduced motion and sufficiently large touch areas.

## Governed change policy
- **Design baseline frozen as reference, not UI pixels frozen forever.** Changes to structure or product character require recorded rationale and owner review. Correct accessibility defects, native platform affordances and actual usability findings without needing to restart product discovery.
- SB-19 should translate this approved system into React Native in bounded stages, preserve the existing SQLite/photo/backup code, test at Development/Staging before any larger migration, and keep core offline functionality intact.
- Proposed build sequence: (A) design tokens/shared components, safe-area bottom navigation and answer-first Home/Find; (B) Add/edit/Answer detail visual convergence with current local photo picker; (C) direct camera and optional voice capture as separately approved native features with robust local media/backup; (D) Storage/Backup displays and future premium **placeholders only**, not live OAuth or payment controls.
- **Do not equate visual-baseline approval with SB-18 completion.** Human moderated research, direct Android/iOS accessibility, final voice/camera capture, encrypted media backup, additional platform checks and SB-17 System UI ANR recovery remain open.
- No Git push, Production, app-store work, payments, paid services, cloud/OAuth integrations, device reset or disruption of the secondary Windows 26H2 upgrade authorized by this decision.

## Review / success evidence
Prototype smoke: `node docs/design/verify-sb18-prototype.mjs`; existing suite 105 PASS, TypeScript and lint previously PASS (from SB-18 design package). Use photo/voice simulated states only for design reference. Measure first-answer creation, retrieval ease, large-text navigation, offline operation and comprehension of data ownership with actual user studies and native device tests before declaring release ready.

**Next governed checkpoint:** SB-18 usability and accessibility review against this baseline, followed by owner-gated SB-19 native UI implementation; do not re-open general visual discovery unless findings warrant it.
