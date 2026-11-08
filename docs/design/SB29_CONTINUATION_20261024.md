# SB-29 — 2026-10-24 isolated Figma-first continuation

- Worktree: E:\Designs-by-FA\Development\CasitaDex-SB29-FigmaFirst (not the primary repository).
- Added `tests/figma-authority-gate.test.mjs` checking legacy import isolation and explicit provisional design status.
- Repaired the existing CTA focus regression test: it previously assumed unconditional focus colors, while implementation correctly gates colors on `showFocus`. Test now checks conditional expressions.
- Evidence: `node --test tests/figma-authority-gate.test.mjs tests/figma-first-boundary.test.mjs` => 8 pass / 0 fail; `npm run typecheck` => pass.
- No native screen routes have been switched. No app installed or rebuilt; no user data modified.
- UI source authority remains Figma 39uzN0SZX8nlmcGDcHdQhr, Warm Editorial A.2 accepted baseline. Brand authority remains Figma PGhz4VYfakXbLh5BFev1PH. Review-only screens and rejected icon previews are not release assets.
- NEXT: complete approved Apple/Android screen mapping, then wire typed domain adapters to the isolated Figma-first presentation, without importing legacy UI modules. Validate both platforms separately.
- Gate: foundation test pass only; product UI acceptance remains OPEN.
