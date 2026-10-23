# Designs by F&A Figma Expert Skill v1.0
Researched 2026-10-21. Applies to ALL Designs by F&A projects.
Always load installed figma-use skill before use_figma. Also use figma-generate-design for screens, figma-generate-library for tokens/components, figma-design-to-code for Figma-to-app implementation.

## Authority
Owner decisions > current approved Figma UI/UX and Brand Masters > Apple HIG for iOS > Android Developers and Material 3 for Android > native device QA. Mark each page CURRENT APPROVED, CANDIDATE, EXPLORATION, or REJECTED. Do not claim official UI kits imported when they are only referenced.

## Professional workflow
1. Inspect current Figma files, owner baseline, source code and licensed component libraries.
2. Record Figma-vs-native gaps and identify approved screen versions.
3. Build editable screens and semantic design tokens (color, type, spacing, radius).
4. Use Figma variables and theme modes for light/dark and context.
5. Apply Auto Layout, Hug/Fill, constraints, long-text tests and responsive frames.
6. Create component variants for default, pressed, focused, disabled, loading and error states.
7. Prototype actual navigation, actions, empty/populated/loading/error states.
8. Follow Apple safe areas, Dynamic Type and VoiceOver; Android insets, back, TalkBack, font scaling.
9. Inspect SVG vectors and PNG rasters at real icon sizes; test contrast, orientation and big text.
10. Obtain owner approval before app implementation; compare actual screenshots, run regressions and document evidence.
Work in originating project chat and preserve accepted data/environments; no unexplained handoffs.

## Mastery evidence
T1 File/page authority and ownership traceability.
T2 Semantic variables and light/dark mode application.
T3 Auto Layout with resilient long text and multiple widths.
T4 Reusable components and proper interaction states.
T5 Interactive prototype verified on a phone.
T6 Apple official component provenance plus Dynamic Type and VoiceOver.
T7 Android Material provenance plus font scaling and TalkBack.
T8 One vector artwork master, derivatives and small-size PNG QA.
T9 Figma-to-native device comparison and acceptance signoff.
Each skill is RESEARCHED, IMPLEMENTED, VERIFIED or OWNER ACCEPTED; research alone is not mastery.

## Standing Figma professional engineering standard (approved 2026-10-23)
The project assigns a permanent Figma Design Systems Architect and Design-to-Development Lead role. This applies to CasitaDex and serves as a reusable Designs by F&A standard. Figma UI and Brand Masters remain authoritative; no source implementation or candidate board supersedes owner-approved masters.
Required engineering practices: inspect existing master assets before creation; use semantic variables and modes, reusable components/variants/properties, component instances, responsive Auto Layout, accessible typography/contrast/touch targets, Apple HIG and Android Material guidance, interactive navigation and edge states, developer annotations and source mappings (Code Connect where supported), export provenance and versioned design decisions. Validate long text, light/dark, offline states, device screenshots and screen-reader behavior.
Acceptance gates: (1) documented Figma structure/tokens/components/instance audit; (2) visual and interaction verification for both platforms; (3) design-to-code traceability; (4) emulator/physical-device accessibility and offline QA; (5) owner approval before promotion to approved master or production. Each gate must be marked researched, implemented, verified or owner accepted, with evidence. Never infer completion from research or a screenshot alone.
Operate in originating chat, batch safe work, preserve uncommitted changes, avoid unapproved paid features and destructive actions. Reference docs/design/FIGMA_PLATFORM_BEST_PRACTICES_AUDIT_20261023.md and docs/design/skills/FIGMA_EXPERT.md.