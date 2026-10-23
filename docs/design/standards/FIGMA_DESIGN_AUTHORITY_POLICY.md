# Designs by F&A — Figma Design Authority Policy
Approved by owner: 2026-10-21. Applies to CasitaDex and future Designs by F&A apps.

1. Figma is the authoritative source for approved visual design, branding, icons, typography, colors, tokens, components, layouts and Light/Dark modes. The code repository and exported assets implement approved Figma decisions; they do not supersede Figma.
2. CasitaDex Brand Master: https://www.figma.com/design/PGhz4VYfakXbLh5BFev1PH
3. CasitaDex UI Master: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
4. Preserve separate Apple and Android design authorities, adapting native conventions while maintaining shared CasitaDex identity.
5. Mandatory sequence: inspect both Figma masters -> identify approved assets/components -> reuse them -> propose changes only as clearly labeled review candidates -> obtain owner approval before master adoption -> implement in source -> validate in emulator/physical devices -> record evidence and traceability.
6. Do not redraw, invent or replace already approved logos/icons or create placeholder components before searching both Figma masters. Never silently promote review candidates.
7. Figma connector or external library import restrictions are technical blockers, not permission to replace approved design or assume a subscription upgrade is required.
8. Protect uncommitted source changes; use isolated workspaces and document verification, unresolved blockers, screenshots, hashes and acceptance status. No unverified claims of synchronization.
9. Every project handoff must repeat this policy and the authoritative Figma links.

## Standing Figma professional engineering standard (approved 2026-10-23)
The project assigns a permanent Figma Design Systems Architect and Design-to-Development Lead role. This applies to CasitaDex and serves as a reusable Designs by F&A standard. Figma UI and Brand Masters remain authoritative; no source implementation or candidate board supersedes owner-approved masters.
Required engineering practices: inspect existing master assets before creation; use semantic variables and modes, reusable components/variants/properties, component instances, responsive Auto Layout, accessible typography/contrast/touch targets, Apple HIG and Android Material guidance, interactive navigation and edge states, developer annotations and source mappings (Code Connect where supported), export provenance and versioned design decisions. Validate long text, light/dark, offline states, device screenshots and screen-reader behavior.
Acceptance gates: (1) documented Figma structure/tokens/components/instance audit; (2) visual and interaction verification for both platforms; (3) design-to-code traceability; (4) emulator/physical-device accessibility and offline QA; (5) owner approval before promotion to approved master or production. Each gate must be marked researched, implemented, verified or owner accepted, with evidence. Never infer completion from research or a screenshot alone.
Operate in originating chat, batch safe work, preserve uncommitted changes, avoid unapproved paid features and destructive actions. Reference docs/design/FIGMA_PLATFORM_BEST_PRACTICES_AUDIT_20261023.md and docs/design/skills/FIGMA_EXPERT.md.