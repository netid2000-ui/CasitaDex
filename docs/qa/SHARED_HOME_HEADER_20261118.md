# Shared Home header, 2026-11-18

Owner direction: Photos, Reminders and Find headers should match Home; remove the Photos olive branch rather than correct the asset.

Base: 2a8e7e38bb56e89a7c43ca9231b97b3bcbcd5019.
Branch: work/cd-shared-home-header-20261118.

## Change
All four primary tabs now use the existing Home logo, local date only, borderless Settings placement and responsive header. Page titles remain below the shared header. Removed Photos-only olive JPEG and Reminders' duplicate text brand/title. Navigation, domain/storage logic and Home assets are unchanged.

## Verification
- Typecheck and lint pass; 543 source tests: 542 pass, 1 skipped, 0 failed.
- Isolated native builds succeeded on FA-MAC-DEV-01. Both staging trees match feature source/assets (source-provenance.json).
- Android APK SHA-256: 88d7749200e48252e4f7184437a57636657b53dafbaf80c74a49aef405baf5b1. Installed hash verified; update-in-place, no clear or uninstall.
- iOS main.jsbundle SHA-256: f4c611334cab9caa4fb5cd8340dfaec4e74dbd90f2bd61493ed11836048fe88f. Installed bundle byte-compared to built artifact.
- Both platforms passed Home/Photos/Reminders/Find/Home and Settings return in light and dark modes. Assertions verify date and reachable Settings below, with logo present.
- Visually reviewed iOS light Photos and dark Reminders, Android light Find and dark Photos, plus desktop Photos view. Olive ornament absent and shared header intact.
- iOS before/after 11 database tables and 22 media hashes identical. Android retained 92 Find results and existing Photos; direct database comparison is unavailable for non-debuggable release APK. No data edit actions performed.
- Light mode restored after checks; both apps returned Home. No physical devices or release actions.

Evidence root on Mac external SSD: Apple-Builds/Shared-Home-Header-20261118. Includes build/source logs, provenance, APK backup, screenshots/XML, XCTest results and test harnesses.

## Retained failed attempts and limits
- Initial iOS assertion counted duplicate accessibility date nodes as two dates. Both nodes have identical label/frame; final test verifies one unique visible frame. Intermediate harness compile rejected NSStringFromCGRect; corrected to String(describing:).
- Android first attempt interrupted by intermittent ADB disconnection; second bounded run passed all light/dark tab checks. Failed logs retained.
- Existing Home logo PNG pale background remains visible, especially in dark mode, on both platforms. Preserved because this change was to match Home and remove the olive ornament, not redesign Home assets.
- No claim of full functional parity, spoken accessibility, new large-text validation, physical-device acceptance, or release readiness.
