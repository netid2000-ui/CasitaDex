# CasitaDex Simplicity A.3 — Screen Audit

**2026-10-29.** Code inspection of isolated QA worktree; not a claim of Figma or owner acceptance. Governing standard: `CASITADEX_SIMPLICITY_A3_STANDARD_20261029.md`.

| Screen | Finding | Decision / gate | Status |
|---|---|---|---|
| Shared shell | Redundant Back to Home / Add Memory top row | Removed; bottom tabs and logo remain | Implemented; owner iPhone acceptance pending |
| Find | Page-size picker, page navigation, repeated count | Removed picker/pagination and redundant count; preserve query/scroll | Implemented; large-list performance not yet accepted |
| Add Memory | Taxonomy picker too tall; Search/Done and Create below list | Compact alphabetic bounded list, Create first, no Search/Done | Implemented; owner accepted improvement before latest cleanup |
| Add Memory | Non-actionable Verification Status and verbose backup copy | Remove initial verification panel and backup copy, preserve verification in details | Implemented; QA pending |
| Add Memory | Optional Space, Category, location, notes, source, photo, reminder fields still occupy full initial screen | Next: progressively disclose optional fields, retain draft checkpoints and Save | Open |
| Memory Details | Multiple panels, controls and contextual actions | Keep answer first; simplify cards and More Actions without losing edit guards | Open |
| Edit Memory | Repeated organization and metadata panels | Same compact selectors; reduce visual duplication while preserving save/cancel | Partial |
| Photos | Gallery + viewer already separated; Manage saved photos still visible | Keep browse/open/return, make management secondary | Open |
| Reminders | Title/date/time core is present; repeat and notes still prominent | Progressive disclosure, linked memory access, permission and notification acceptance | Open |
| Settings | Advanced backup, recovery and label management | Keep accessible under settings with clear safety confirmations | Open |
| Android | Platform parity not yet verified for A.3 | Build, accessibility and physical device QA after iPhone acceptance | Open |
| Figma | A.3 not yet reconciled into authoritative Apple/Android variants | Design-system update, screen mapping, approval evidence | Open |

## Execution safeguards

- Keep work isolated from original app and simulator; no destructive cleanup.
- No new feature expansion during simplicity pass unless necessary for safety or accessibility.
- QA automated gates are necessary but not sufficient: physical device usability and Figma authority must be checked separately.
- Large datasets: continuous scroll must be performant; consider virtualization rather than reintroducing pagination.

## Add/Edit/Details shared field order — 2026-10-29

Regular memory: Name → Space → Categories → Description → Location → Notes → Reference → Verification (existing records only) → Photos. Add uses the same visual card language and keeps Save visible at the top. Photo-first entry retains Photos before Name as the explicit approved exception. The memory store and draft checkpoints are unchanged. Full shared component extraction and Figma authority synchronization remain separate gates.

## Home — reminder list removal

Removed the Home reminder preview/list and its data fetch. The Set Reminder Home action and dedicated Reminders tab remain. No reminders are deleted or changed. Decorative artwork is deferred until separately approved and reconciled with Figma.
