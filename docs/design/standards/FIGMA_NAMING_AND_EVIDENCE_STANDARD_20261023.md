# Designs by F&A — Figma Naming and Evidence Standard
Version 1.0 | 2026-10-23 | CasitaDex and future projects

## Authority
Brand: https://www.figma.com/design/PGhz4VYfakXbLh5BFev1PH
UI: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
Warm Editorial A.2 remains approved direction; Apple and Android review boards require independent acceptance. Naming never confers approval.

## Conventions for new work
- Page: `Platform / Feature / APPROVED|REVIEW|EXPLORATION|REJECTED`.
- Screen: `Platform / Feature / Screen / Light|Dark / State`.
- Component: `Component / Role / Platform`; properties `Platform`, `Theme`, `State`, `Size` when applicable. Use instances, not copied drawings.
- Semantic variables: `color/surface/page`, `color/text/primary`, `color/action/primary`, `space/medium`, `radius/control`; modes `Light`, `Dark`.
- Type roles: `type/platform/role`, with native scaling and fallback evidence.
- Assets: `casitadex_role_platform_theme_size.ext`; preserve approved geometry, source node and hash.
- QA: `SB##_YYYYMMDD_platform_screen_theme_gate.ext`.

## Mandatory traceability ledger
Platform | Figma file/page/node | approval state | feature/screen | component/variant | field/action | state/validation | domain adapter | offline | privacy/accessibility | source path | test evidence | reviewer/date.

## Acceptance gates
1. Structural: token bindings, instances, variants, Auto Layout, responsive/long-text behavior.
2. Interaction: real navigation, light/dark, loading/empty/error/focus/disabled states.
3. Handoff: annotations, asset provenance, source mapping and verified Dev Mode/Code Connect availability or documented manual equivalent.
4. Native: independent iOS/Android device QA, accessibility, offline/recovery and matched screenshots.
5. Owner approval: explicit acceptance before promotion or production.

Apply to NEW work now; do not bulk-rename existing Figma nodes or overwrite masters without impact review and owner approval. Distinguish RESEARCHED, IMPLEMENTED, VERIFIED and OWNER ACCEPTED.