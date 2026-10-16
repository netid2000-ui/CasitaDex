# SB-18 — Household Memory UX System and Design Review
Date: 2026-10-15 CT | Designs by F&A | Status: **design review prototype**, not an approved UI, customer study, native build, payment or release.

## Product north star
**A household memory app people trust for years—not an inventory application that repeatedly asks them to upgrade.**

The primary user question is “What do I need to remember or find?” not “How many assets do I own?” Essential actions must work in airplane mode and without an account. The answer, its context and whether it was verified must appear before secondary metadata, monetization, or categorization.

### Non-negotiable product behavior
- **Find in seconds:** an answer-first result; searchable title/answer/location, not a product catalog. No guaranteed stopwatch promise before measured studies.
- **Capture in the moment:** write, photograph or record a voice note with minimal required fields. Voice and camera need an explicit user gesture and useful denied-permission fallback.
- **Trust status:** “Saved on this device,” “Needs checking,” “Verified [date]”; never imply cloud backup until a validated backup exists. User owns the content.
- **Calm, not gamified:** no streaks, badges for content quantity, inventory-completion bars, paid-upgrade interrupts, or notification noise.
- **No hostage data:** lifetime access to local facts and manual complete backup/restore; optional cloud automation separated from core. Basic camera, voice, editing, accessibility and retrieval are free.

## Source and design rationale
1. Charter v0.5: **ART + FUNCTION + EXPERIENCE WITHOUT GIMMICKS; Fewer features. Faster answers**; original navigational Today/Answers/Add/More.
2. Apple HIG design principles (https://developer.apple.com/design/human-interface-guidelines/design-principles/): purpose, agency, transparent permissions and recoverability.
3. Apple HIG onboarding (https://developer.apple.com/design/human-interface-guidelines/onboarding): optional and task-based first-run, not a required tutorial.
4. Apple HIG writing (https://developer.apple.com/design/human-interface-guidelines/writing): active plain-language labels and clear empty states.
5. Apple HIG privacy (https://developer.apple.com/design/human-interface-guidelines/privacy): request camera/microphone access contextually, never on launch.
6. Human validation NOT YET performed; designs are expert hypotheses and must be tested with 6–12 representative homeowners, including larger-type and screen-reader participants.

## Navigation and IA — provisional refinement
**Four primary destinations: Home · Find · Add · More.** “Spaces” is a lightweight browse/filter section within Find. This simplifies the earlier *five-tab* exploratory IA without deleting Spaces from the neutral data architecture; A/B-test four vs five destinations before visual signoff. The center Add affordance is prominent but does not obscure the bottom safe area.

### Content strategy
- **Home:** welcoming prompt; search as dominant action; “Save a memory”; recently used answers; only genuinely actionable “Needs checking.”
- **Find:** search with immediate local results and optional “Browse places” (Spaces); list cards show **the answer**, not just titles. An empty result encourages changing the search or saving the first memory.
- **Answer detail:** title, large key answer, where, visual/audio source if present, trust source/date, optional edit/share. “Last reviewed” distinct from creation. No ad beside the answer.
- **Add:** single required memorable title plus fact, optional photo/voice/source/space; text remains possible if permission denied. Support draft persistence after interruptions in eventual implementation.
- **More:** “Storage & backup,” “Privacy and accessibility,” “About,” and optional “Enhance CasitaDex” only here or in an unobtrusive relevant feature context.

## Provisional component tokens
| Token | Light value | Notes |
|---|---|---|
| Canvas | #F7F6F1 | Warm near-white, not pure gray |
| Surface | #FFFFFF | Primary cards |
| Ink | #193C33 | Deep evergreen |
| Muted ink | #50645D | Test WCAG contrast on each surface |
| Accent | #DCE9D7 | Soft sage; never stand-alone state indication |
| Key action | #204D42 | White on dark evergreen |
| Warning | #9A5C2A | Paired with text/icons |
| Border | #DADFD6 | Visible delineation |
| Grid | 8px | 8 / 16 / 24 / 32 |
| Corner | 18px | Content cards; controls 12–16px |
| Body | 16px minimum | Allow OS scaling; do not hardcode at 16 |
| Key answer | 25–32px | Primary fact shown in full where feasible |
| Target | 48dp Android minimum | Screen reader label, disabled semantics, generous gaps |

Typography intent: system-native legibility, measured warmth, no decorative scripts for data; dark theme and high contrast remain Free. Text expansion 1.3x and 2x must not clip action labels.

## Critical journeys
**Save photo:** Home → Save a memory → Take photo → contextual explanation/permission → preview/retake → title & key fact → Save on device → confirmation, optionally locate. Existing Android native *photo picker* is not a live camera; camera permission and direct capture are future implementation gates.

**Save voice:** Home → Save a memory → Record voice note → contextual microphone grant → visible timer and Stop/Pause controls → playback/replace/delete → title → Save on device. Speech-to-text is NOT implied or required; searchable title works offline. Voice capture remains a DESIGN concept, not an implemented mobile capability.

**Find:** Home/Find → type filter dimension or paint color → local answer-first result → open, inspect source/photo/audio if needed. No internet or subscription.

**Backup:** More → Storage & Backup → Free manual complete export and restore OR optional premium automated BYOS. Show local save and cloud VERIFIED backup as separate statuses; premium expiration never prevents full recovery.

**Share with a contractor:** Answer detail → select a small set of cards → preview exact disclosed fields and media → share through system sheet. Basic sharing free. Polished report templates may be paid.

## UX writing reference
Prefer “Save a memory” over “Create an asset.” “Find an answer” rather than “Inventory search.” “Where is it?” rather than “Storage location ID.” “Saved on this device” rather than “Synced.” “No results yet—try another phrase” rather than “No assets matched.” “Optional: enhance this report” rather than “Upgrade required.” Avoid auto-generated confidence claims or guessed facts.

## Acceptance gates for final UI
- Four-versus-five tab IA compared with actual tasks; search and first-save flow unassisted.
- Native light/dark, TalkBack, VoiceOver, font scale 1.3/2.0, 390px and foldable screens tested; navigation unobscured by system bar.
- Photo/voice permission and unavailable/offline/denied states designed, then independently tested when implemented.
- Premium comprehension tested: manual export free, BYOS premium separate from provider GB, cancelled subscription still allows personal data retrieval.
- Approved component/state inventory and user-research evidence before SB-19 implementation.
- Security and key recovery design still required before cloud feature implementation. Android SB-17 System UI ANR unresolved.
