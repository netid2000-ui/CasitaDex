# CasitaDex prototype
**ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.**

Independent, local-only Expo / React Native / TypeScript app generated from the accepted SB-12A starter. Read docs/PRODUCT_CHARTER.md, docs/PROJECT_CONTINUATION_REQUIREMENTS_2026-10-07.md, docs/ADR-002_NATIVE_DURABILITY.md and docs/CURRENT_PROJECT_STATUS.md before continuing.

## Run and verify locally
Use Node 24.19.0 and the committed lockfile. Run npm ci, npm run typecheck, npm run lint, npm test, npm run doctor, npm run export:web. Start npm run preview for loopback web review on port 8765. No Expo account/backend is needed. Native Staging build instructions, tool versions and Windows recovery are in docs/RECOVERY_RUNBOOK.md.
Run npm run test:browser, node tests/accessibility-smoke.cjs, node tests/durability-browser.cjs and node tests/appearance-browser.cjs against the preview. Native helper tests require an explicitly verified CasitaDex emulator build; do not infer native success from browser or Node SQLite results.

## Explore
Start empty or opt into a clearly labeled example home. Today | Answers | Add | More supports Buy/Fix/Find/Maintain/Share. Add one useful fact; check a source; edit; record a due date or completed maintenance; select and preview a snapshot. More offers persisted Light/Dark/System and Extra-large text, a compact versioned text backup, validated import and explicit previous-save recovery.
Native structured data uses transactional SQLite; the web preview retains separate origin-scoped storage. Migration preserves legacy data rather than erasing it. Device loss/uninstall can erase local data: export to somewhere you control.

## Boundaries
backendMode=none. Unique Development/Staging app identities; Production locked. No Firebase resource, cloud backend, account, ad SDK, public launch, store submission, paid service or trademark filing. The unused native Firebase Messaging dependency discovered during this batch was removed.
This is not full V1 or native acceptance. App-owned media, local OS notifications and file-provider backup remain unimplemented. Native/physical acceptance and dependency remediation remain open wherever no passing evidence is recorded. See docs/NATIVE_BATCH_REPORT.md for exact results.
Event Command SB-12 physical Android closure and final SB-12A acceptance remain separate/open. SB-13 has not started.
