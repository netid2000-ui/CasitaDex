# SB-29 — Figma skill v1.1 gate for isolated native foundation
Date 2026-10-23. Isolated branch work/sb29-figma-first at E:\Designs-by-FA\Development\CasitaDex-SB29-FigmaFirst. Original Windows authoritative tree untouched.
- New src/figma-first/tokens.ts and PrimaryCta.tsx exist as initial native implementation references from Figma 109:111; three local boundary checks previously passed. NOT connected to active routes, visually accepted or code-connected in Figma.
- Live Figma get_variable_defs(109:111) returned {}, so new component token binding is NOT verified. Component set has 12 platform/theme/state variants but lacks proved Pressed/Loading/Error.
- Live get_code_connect_map(109:111) returned {}, so do NOT call it Figma Code Connect-compliant. Documented native component path is candidate for linking only after versioned source and correct mapping is confirmed.
- Before marking foundation complete: audit semantic token bindings, correct pressed/loading/error states, responsive Auto Layout, brand asset geometry, actual accessibility interactions and native screen comparison. No legacy presentation imports allowed.
- Shared v1.1 Figma Expert Skill and independent audit stored on E: and primary repo; native code remains a provisional candidate, not a finished component library.

## Isolated implementation checkpoint — October 23, 2026
- Worktree: E:\Designs-by-FA\Development\CasitaDex-SB29-FigmaFirst, branch work/sb29-figma-first, starting HEAD fe3e57d. Primary worktree and protected installed applications NOT modified.
- Added NEW src/figma-first/HomeActionCard.tsx with three Figma-derived action variants, consistent dark-green background, accessible button labeling, pressed and disabled handling and no imports from legacy presentation.
- Existing provisional tokens.ts and PrimaryCta.tsx retained; no active routes wired; no installed APK/IPA generated. Icon glyphs in HomeActionCard are temporary component scaffolding, NOT approved Figma icons or final asset acceptance.
- Tests: node --test tests/figma-first-boundary.test.mjs: 4 pass / 0 fail. TypeScript tsc --noEmit: pass. eslint src/figma-first --max-warnings=0: pass after scoped UTF-8 BOM cleanup.
- Build dependencies reused from primary repo by an E: node_modules NTFS junction to C:\CasitaDex-Git\node_modules; NO npm install or destructive changes. This junction is a development-only dependency link, not source/provenance or a production deployment.
- Remaining gates: full semantic token definitions, original logo geometry at target slot, final icons, Figma Component/Code Connect linkage, Apple/Material native states, real route/domain wiring, complete device-level visual and accessibility tests.
- This checkpoint does NOT close the shared SOP 07.02/07.05: only new provisional components were tested, not a complete native screen or APK.
