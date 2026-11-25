# Designs by FA — Personalized theme material super-batch — 2026-11-25

## Scope
Mac mini FA-MAC-DEV-01 exclusively for implementation, builds and native verification; Figma is the design authority. Existing normal app identities, accepted data and prior signed packages retained. QA apps retain isolated .platformqa identifiers.

## Source and design
- Event Command: 34 personal styles, 36 event themes (including Standard); event-specific artwork accent precedence; themed navigation selected indicator, My events/Attention group, View event details, contextual Back, task Save/Cancel, photo-background scrim. Native iOS GlassView with OS, reduce-transparency and text-size fallback; Android native Compose Material 3 navigation and RN tonal contextual surfaces.
- CasitaDex: two existing approved editorial palettes; themed Find search controls, shared sticky actions, photo viewer header/controls and selected nav. Photo gestures and callbacks remain unchanged.
- Tones tested at >=4.5:1 for approved foregrounds. This is an opaque tone calculation, not a claim that every possible photograph/system blur combination has a measured contrast ratio.
- Event Command Figma editable checks: [light](https://www.figma.com/design/WJCubVKVgPUH8kqa6aJ1gi?node-id=288-538), [dark](https://www.figma.com/design/WJCubVKVgPUH8kqa6aJ1gi?node-id=288-575), Android 288:612 and 288:650, [all-theme board](https://www.figma.com/design/WJCubVKVgPUH8kqa6aJ1gi?node-id=288-704), [control board](https://www.figma.com/design/WJCubVKVgPUH8kqa6aJ1gi?node-id=291-642).
- CasitaDex Figma editable checks: 1679:793, 1679:873, 1679:953, 1679:1034, [context board](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1679-1119).
- Source regression: Event Command 1,284/1,284 pass; CasitaDex 550/551 pass, one skipped; both typecheck pass; CasitaDex lint pass.
- Event Command exact Mac source c432b41d18741e095ec68dca6f42e77d1fbc18ed, source tree 51f7c0f39702f4123c3352b1972fa661bb1429d3 reflected in GitHub source commit 5220a0ca649d673de2787c9e6c67e6c881a6ebda (GitHub connector commit metadata differs, tree identical).
- CasitaDex exact Mac source 83de0c45aaf05ea8a9f620b1f35a53cd0824daae, source tree 17701bde0b7ca2e177e507abb3a78e9e26435066. GitHub integration returned HTTP 403 on tree and reference writes. SSH port 22 timed out, SSH 443 rejected key, HTTPS lacked credentials. Source committed locally; verified incremental bundle at QA-Evidence/fa-theme-material-refinement-20261125/casitadex-refinement.bundle, SHA-256 7410cb07e92e41668738b43bdeadcac6042d24d92c3e3a6e6a219929b0ef851c. Do not call CasitaDex source remotely synced until permission is restored.

## First candidate
Both signed ad hoc packages and both Android APKs built and installed on target QA devices. Both first-candidate HTTPS IPA downloads matched the signed package hashes; previous URL not recorded. Event Command Thanksgiving selected in iOS and Android; navigation and task action verified; dark screenshot reviewed. CasitaDex iOS Find/Photos/Reminders/Add Memory + Cancel, Android Find and persisted photo reset/close; Samsung install/launch captured for both. Maximum iOS Dynamic Type exposed clipped/wrapped fixed header chrome and a pinned Find search area. This was not accepted as a pass.

## Refinement
Reflow Event Command brand/header at very large type without disabling text scaling; retain accessible Menu. CasitaDex scrolls Find search and filter controls at larger type and uses compact editorial heading/chrome. Both disable translucent contextual wrapper at large text. Refined signed package build number 2, separate artifacts from build 1; prior application data not cleared. Final execution evidence in QA-Evidence/fa-theme-material-refinement-20261125 on Mac mini. Both iOS simulators and both Android release APK builds PASS. Event Command normal iOS light/dark actions, Android emulator contextual actions, maximum Dynamic Type Home/More navigation, and actual Reduce Transparency fallback plus restoration PASS. CasitaDex normal iOS light/dark navigation, maximum Dynamic Type Find and Home scroll/reachability, Android emulator Find and persisted photo reset/close PASS. Both refined APKs installed/launched on Samsung and emulator. Extreme font size still causes individual long words to wrap (e.g., Event Command Home indicator and CasitaDex Add Memory); no claim of full visual accessibility acceptance. The Find filters are now scrollable rather than blocking the result content.

## Release disposition
QA-only, not App Store/Play production approval. Owner's physical iPhone final acceptance, exhaustive screen-reader/performance/large-text sweep, and CasitaDex GitHub write access remain open. Private installer credentials and registered device IDs are omitted from GitHub.

## Signed version 2 evidence
- Event Command IPA SHA-256: ede7f9d1f17f885092b46471ae036d82cbdcd02f86b7217c69de09fb8702fbe0
- CasitaDex IPA SHA-256: 4779aec548e490e0b190bf9529297bf4ab6e4374e2648625392770e55b85dada
- Both code signature verification, owner-device ad hoc provisioning, version 2 manifests and full internet download hashes PASS. Verified landing page with and without trailing slash.
- Cold Android launch single sample (ms, not a benchmark): Event Command emulator 462, Samsung 372; CasitaDex emulator 1065, Samsung 913. No crash during the tested navigation loops. Full performance profiling is not claimed.

