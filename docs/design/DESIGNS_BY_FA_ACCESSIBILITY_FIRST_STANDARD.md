# Designs by F&A — Accessibility-First Design & Delivery Standard

**Status:** Owner-approved operating standard, 2026-10-30. Applies to every new Designs by F&A product and major new workflow; CasitaDex uses it as a remediation gate. **Principle:** ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.

## Phase 0 — Before first visual screen
- [ ] Identify primary workflows, audiences, assistive technologies, platform targets, and offline constraints.
- [ ] Define accessible acceptance criteria for iOS (Apple HIG/VoiceOver/Dynamic Type) and Android (Material 3/TalkBack/font scaling).
- [ ] Define minimum targets: iOS 44×44pt; Android 48×48dp, unless platform requirements are stricter.
- [ ] Define semantic colors and states with non-color-only cues; verify contrast against WCAG 2.2 AA (4.5:1 normal text, 3:1 large text and meaningful nontext UI).
- [ ] Define motion policy, reduced-motion behavior, keyboard/focus semantics, labels/roles/states and error announcements.

## Phase 1 — Authoritative Figma design system FIRST
- [ ] Create semantic variables for color, typography, spacing, radius, elevation, focus, and Light/Dark modes.
- [ ] Create accessible components and variants (default, pressed, selected, disabled, error, focus, large text) with documented usage.
- [ ] Use Auto Layout, wrapping text, constraints and scrolling from the start; avoid fixed-height text containers.
- [ ] Design each core screen at standard and accessibility-extra-large type sizes, compact width and landscape, in both Light and Dark.
- [ ] Maintain separate authoritative Apple and Android adaptations and interactive prototypes with screen-reader reading/focus order specifications.
- [ ] Review navigation, input, validation, destructive confirmation, offline state, and recovery for accessibility before approval.

## Phase 2 — Implementation and automated gates
- [ ] Map each approved Figma component/variable/state to code; record exceptions before coding.
- [ ] Implement semantic accessibility labels, roles, hints, focus order, announcements and supported platform accessibility preferences.
- [ ] Test typecheck, lint, unit/integration tests, and screen-level layout at default and enlarged text sizes.
- [ ] Never claim that explanatory copy implements a behavior; controls must actually work.

## Phase 3 — Native acceptance before owner signoff
- [ ] Capture simulator/emulator screenshots in both themes, compact/standard widths, portrait/landscape and enlarged text.
- [ ] Complete actual VoiceOver and TalkBack traversal, focus order, actionable controls, forms, errors and dialogs.
- [ ] Verify reduced motion, contrast, color-blind-safe cues, touch target size and offline functionality.
- [ ] Document defects, retest, reconcile Figma and implementation, and record signed acceptance evidence.
- [ ] Reserve final physical-device signoff for owner after internal gates pass.

## Governance
Figma is the approved design authority. Do not promote new variants to approved until source components, semantic tokens, native behavior and evidence are reconciled. Preserve user data and existing approved baselines. No new paid resources or destructive changes without owner approval. Repeat this standard as a Phase 0 checklist for every future Designs by F&A project.
