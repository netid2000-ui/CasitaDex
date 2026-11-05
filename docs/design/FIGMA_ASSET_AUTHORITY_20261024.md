# CasitaDex — Figma asset authority and release gate

**Authority:** Figma approved design; the local repository is a derived, versioned build artifact, never the design master.

**Figma Brand Master:** https://www.figma.com/design/PGhz4VYfakXbLh5BFev1PH

## Confirmed direct exports — October 24, 2026

| Active destination | Figma node | State |
|---|---|---|
| assets/brand/logo-color-light.png | 2:4, Primary full logo / light | Figma export applied; app-oriented crop |
| assets/brand/logo-color-dark.png | 2:15, Reverse full logo / dark | Figma export applied; app-oriented crop |
| assets/ui-icons/accepted-v1/home.png | 44:3 | Transparent raster from approved Figma vector export (SB70) |
| assets/ui-icons/accepted-v1/memories.png | 44:7 | Transparent raster from approved Figma vector export (SB70) |
| assets/ui-icons/accepted-v1/photos.png | 44:11 | Transparent raster from approved Figma vector export (SB70) |
| assets/ui-icons/accepted-v1/reminders.png | 44:16 | Transparent raster from approved Figma vector export (SB70) |
| assets/ui-icons/accepted-v1/find.png | 44:21 | Transparent raster from approved Figma vector export (SB70) |

Original full-logo Figma exports are retained on the Mac encrypted development volume under `Design-Assets/CasitaDex/Figma-Approved-20261024`.

## NOT YET PROVEN — BLOCKED for brand acceptance

- `assets/brand/icon-{light,dark,tinted}.png`: Apple launcher variants, require exact approved Figma icon master and native rebuild.
- `assets/brand/adaptive-{color,outline}.png`: Android launcher variants, require approved Figma icon master, mask-safe export and Android rebuild.
- `assets/brand/splash-{light,dark}.png`: splash screen variants require approved Figma export.
- `public/brand/*`, `public/favicon.ico`, `public/manifest.webmanifest`: website/PWA icons require approved master mapping and regeneration.
- `assets/brand/illustration-{home,find,backup}.jpg`: illustrations require original approved artwork/provenance evidence; not presumed Figma-native.
- `assets/brand/logo-outline-*.png`, `assets/brand/single-card-candidate.png`, `assets/branding/*`, `assets/house-*.png`, `assets/casitadex-branded-banner.png`, `src/draft-add.tsx`: legacy/candidate artwork; quarantine from shipping use until reconciled with Figma.
- `assets/ui-icons/accepted-v1-prefigma-20261024/*`: backup only, not runtime assets.

## Required gates

1. Verify approved Figma page/node and owner-approved state before exporting each asset. Figma pages labeled **REJECTED** or **QA CANDIDATE** are never automatically production-approved.
2. Maintain node ID, exported SHA-256, variant (light/dark/tinted/monochrome), target platform, dimensions, and approval in the asset manifest.
3. Do not infer approval from a matching filename, repository commit, or attractive screenshot.
4. Confirm the Apple and Android authorities separately. Verify all Home, Memories, Photos, Reminders, Find and Settings surfaces, including 200% text and accessibility.
5. Rebuild native icons/splash binaries, verify web favicons/PWA, and run automated checks and emulator/device visual QA before declaring parity.
6. Preserve the Windows primary source authority; Mac edits remain uncommitted until reviewed and synchronized through an approved path.

## SB70 transparent pictograms

The accepted Figma node shapes are unchanged. The app rasterizes the existing stroke-only evidence exports under `docs/design/evidence/figma-export-test/` with macOS `sips -s format png` at 144 × 144. Home uses `home-44-3-vector.svg`. This preserves a transparent background for runtime tinting.
