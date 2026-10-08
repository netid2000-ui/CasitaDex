# CasitaDex — current status
Date: 2026-10-07 (America/Chicago)
Gate: CLICKABLE LOCAL UX PROTOTYPE IMPLEMENTED; CONDITIONAL QA, NOT V1/RELEASE ACCEPTED.

## Delivered
Isolated local Git repository on prototype/bootstrap, generated from the pinned SB-12A starter. backendMode=none, Production locked, unique CasitaDex identities, no Event Command app files or credentials.
Today | Answers | Add | More; opt-in labeled example cards; Buy/Fix/Find/Maintain/Share flows; search; add/edit; explicit confidence/source; in-app due dates and maintenance history; previewed selective sharing; disclosed JSON export/import; previous-save recovery. System font scaling, 200% reading preference, keyboard focus, wrapping, semantic labels and >=48 dp controls.

## Exact QA
- Starter modes: 2/2 PASS (generic Firebase temporary render and CasitaDex none; no services created).
- Starter fail-safe guardrails: 10/10 PASS.
- TypeScript: PASS.
- ESLint --max-warnings=0: PASS after corrections.
- Domain/recovery/environment tests: 12/12 PASS.
- Browser user-story checks: 18/18 PASS.
- Additional 320px / 200% text / touch-target / reduced-motion checks: 6/6 PASS, with explicit route assertions.
- Expo web export: PASS; 788 modules, 18 assets, 1.1 MB JS bundle.
- Current exported bundle: entry-0b3857db16a366660a99e3a8ba8b0fbe.js.
- Expo Doctor 1.20.4: 20/21 PASS; overall FAIL because online schema validation could not reach Expo API on either attempt (TLS disconnect, then ETIMEDOUT).
- npm audit --omit=dev: 29 affected entries (18 high, 11 moderate), derived from four underlying advisories. OPEN; see SECURITY_REVIEW.md.
- Native Android/iOS build, physical device, native screen reader/system font scaling: NOT RUN.
- GitHub CI/build ID: NONE; local-only work, no remote push.
- EAS build/Expo project/Production/store/cloud resources: NONE.

## Commit / build
The repository HEAD is the prototype implementation commit. The sibling CASITADEX_HANDOFF.md records its exact SHA after commit; casitadex-recovery.bundle preserves it independently within this workspace. Local web artifact is dist (ignored, reproducible with npm run export:web).
No remote backup is claimed. Current preview is loopback http://127.0.0.1:8765.

## Remaining gates
Online Expo schema validation, dependency hardening and native device acceptance remain open. SQLite evaluation, app-owned media, scheduled device notifications and native export/share acceptance belong to future Local MVP work.
Prototype backup is readable text, not encrypted or automatic. Browser offline checks cover already-loaded operation, not offline cold-start web hosting.
SB-12 physical Android closure: still pending, separate from CasitaDex.
SB-12A final acceptance: OPEN.
SB-13: NOT STARTED.
Production, store submission, public launch, paid infrastructure and trademark filing: NOT AUTHORIZED.
