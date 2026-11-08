# CasitaDex — Simplicity A.3 UX Standard

**Status:** Owner-approved design direction, 2026-10-29. Applies to all future CasitaDex changes and design-to-code reviews. Complements (does not supersede safety requirements in) the product charter, Warm Editorial A.2 visual identity, Figma design authority, Apple HIG, and Material 3.

## Product promise

**Remember something. Find it when needed. Get reminded when necessary.** ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.

## Mandatory interface rules

1. Prioritize the answer or task. One obvious primary action per view; secondary actions may be disclosed progressively.
2. Never add duplicate top navigation when the brand/home control or bottom navigation already provides the route. Preserve contextual Back to Results and unsaved-edit guards where needed.
3. No exposed page-size options (10/25/50/100), previous/next paging for ordinary memory browsing, or repeated count/explanation panels. Use a continuous scrollable list with performant virtualization for large collections.
4. Spaces and Categories: compact dropdown-like selectors; alphabetical choices; show roughly 4–5 options within a bounded scroll area; **Create new at the top** when supported; omit embedded Search and Done. Single-choice Space closes on selection. Multi-choice Categories keeps a clear Close affordance. Show current selection.
5. Keep creation of a memory minimal: title, answer and/or photo, Save. Spaces, categories, reminders, verification, and metadata are optional and unobtrusive.
6. Reduce repeated headings, oversized panels, and verbose instructional copy. Avoid hiding essential feedback or destructive-action confirmation.
7. Reminders: title, date, time, Save first; recurrence and notes secondary. A linked reminder must still open its original memory reliably.
8. All actions must remain accessible with VoiceOver, Dynamic Type, sufficient contrast, 44pt minimum touch targets, visible selected state, and non-color-only cues.
9. Preserve local-first behavior, existing records, photo protection, backups, edit guards, and safety confirmations. Simplification is not permission to delete data or silently change behavior.
10. Figma remains the design authority. Maintain separate iOS/Android platform variants and reconcile implementation only against approved screens; capture exceptions and acceptance evidence.

## Screen acceptance checklist

- [ ] Home: few clear actions, upcoming reminders only; no recent-memory clutter.
- [ ] Find: search and direct results, no page-size/paging controls, preserved return position.
- [ ] Add Memory: minimal initial form; compact optional taxonomy selectors.
- [ ] Memory Details/Edit: answer first; contextual actions only; no duplicate navigation.
- [ ] Photos: browse, open full-screen, return; no redundant zoom controls.
- [ ] Reminders: compact create/edit, clear notification and linked-memory behavior.
- [ ] Settings: plain-language, progressively disclosed advanced management.
- [ ] Apple and Android: independent accessibility and workflow acceptance.

## Governance

Before adding any UI element, ask: *Is this necessary for the current task? Can it be implicit, contextual, or secondary?* Reject unnecessary chrome. Verify on a real device before claiming owner acceptance. Keep Figma and code synchronized; do not treat a code-only change as Figma approval.
