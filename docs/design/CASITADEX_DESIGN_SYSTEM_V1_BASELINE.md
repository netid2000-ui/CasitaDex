# CasitaDex Design System v1.0 — Approved Baseline
Approved by owner: 2026-10-16. Specification only; implementation and device acceptance remain separate gates.

## Reference
Approved three-screen design concept: Home, Add a Memory, Find Answers, with button styles, text-field states and bottom navigation. Use this as visual baseline, not literal example data.

## Visual language
- Primary: solid evergreen, high contrast, rounded, visible dimensional edge and soft shadow.
- Secondary: raised sage tonal surface, clearly unlike text entry.
- Outlined: low-emphasis action. Destructive: explicit semantic confirmation.
- Inputs: flat outlined surface, persistent label, visible focus/error/helper states; no raised-button shadows.
- Pressed, focused, selected, loading and disabled states must be distinct.
- Consistent spacing, typography, icons, corner radii and light/dark contrast.

## Screens
- Home: compact heading, search, prominent Save a memory action, contextual guidance, recent answer and See all, fixed Home/Find/Add/More navigation. No scroll at default font size on reference device.
- Add: labeled title, category/context, answer, optional notes, Save Memory and Cancel, keyboard safe.
- Find: clear search, optional filters, readable result cards.
- Navigation: system-bar-safe Home/Find/Add/More with unmistakable active state.

## Accessibility and devices
- Reference physical test: Samsung Galaxy A16 5G; rapid visual testing on desktop emulator; check newer Android widths.
- At least 48 x 48 dp touch targets; screen reader semantics, readable contrast, font scaling, focus order.
- At large fonts or constrained heights allow scrolling rather than clipping. Check light/dark and keyboard.
- Preserve offline-first behavior and existing local data. Do not store or illustrate passwords or access codes.

## Gates
1. Inventory controls and consolidate tokens and shared components.
2. Implement Home/Add/Find/More together in isolated Development/Staging.
3. Typecheck, lint, regressions, emulator visual/interaction checks.
4. Owner visual approval, then separately authorized physical phone acceptance.
5. No Production, remote push, data reset or changes to other projects.
Preserve existing owner changes in docs/RECOVERY_RUNBOOK.md.
