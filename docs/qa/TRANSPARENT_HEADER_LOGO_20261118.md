# Transparent shared-header logo, 2026-11-18

Owner authorized transparent backgrounds without changing the logo design. Base: 3c148342db39a0ca62f8b4a90b7253d220ffd292. Branch: work/cd-transparent-header-logo-20261118.

## Deterministic correction
Located the exact approved horizontal light/dark SVGs in Design-Assets/CasitaDex-Brand-20261117/svg. Their exported full-canvas rectangle (#F5F5F5) caused the visible pale box. Removed only that rectangle from copied source SVGs. Verified every remaining character, path and color is unchanged. HeaderLogo renders these vectors with the existing react-native-svg dependency, retaining 148x36 header dimensions. Old PNGs retained; no redesign or generative artwork. Original design package and Figma document were not modified.

## Verification
- Typecheck/lint pass. 545 tests: 544 passed, 1 skipped, zero failures. Added transparent-source/render-source consistency checks.
- Both isolated native staging source/assets match the feature source (source-provenance.json).
- Android APK SHA-256: 1538c7357106eb31e02c9d2f11a4d421131be4958acede737b2321f52ad9076d.
- iOS main.jsbundle SHA-256: f8e4f8466f32c14afd0841f50433db85927c87118d72f007f4251f3eb864f76e.
- Both installed artifacts verified against built artifacts. Update-in-place, no data clearing/uninstall.
- Both platforms passed all shared-header tabs (Home, Photos, Reminders, Find) and Settings return in light/dark.
- Visually inspected all 16 combinations: four tabs, two themes, two platforms. Pale logo rectangle absent; logo shapes/wordmark readable and unchanged. Photos olive ornament remains absent.
- iOS 11 database tables and 22 media hashes remain identical. Android retained photos and 92 Find results; binary database equality unavailable for non-debuggable release APK. No create/edit/delete/import actions performed.
- Both restored to light mode and returned Home. Physical devices and releases untouched.

Evidence: Mac external SSD Apple-Builds/Transparent-Header-Logo-20261118, including original screenshots/XCTest attachments, inspection thumbnails, source provenance, installed hashes and logs. Scope does not certify full functional parity, spoken accessibility, physical-device acceptance or release readiness.
