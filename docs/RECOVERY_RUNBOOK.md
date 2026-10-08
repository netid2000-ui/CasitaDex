# CasitaDex recovery runbook
## Local development
Repository: this isolated casitadex directory. No remote configured. Node 24.19.0 and npm are host-provided. Dependencies live only in node_modules with package-lock.json for reproducibility. This batch's npm cache is ../../work/npm-cache. No system package upgrades are required.
Restore source from its local Git commit or recovery bundle. Run npm ci, npm test, npm run typecheck, npm run lint, npm run doctor, npm run export:web. A Git bundle is a second local copy, not an off-device backup.
Development preview uses loopback only. The static review server uses port 8765 and serves dist; stop its process/session to release the port. Start with npm run preview. No public tunnel, database, credentials or backend is needed.
Expo development preview uses the Expo CLI default port 8081; choose an unused port if occupied rather than terminating unrelated processes.

## User data
AsyncStorage key casitadex:development:v1 or casitadex:staging:v1. Web storage is browser-origin scoped, so different ports have separate data. Native variants also have separate app sandboxes. Use text export/import to transfer data intentionally.
Each successful replacement saves the previous primary JSON to the same key plus :recovery before replacing primary. A recovery-copy failure aborts the new write. A primary-write failure rejects the change and leaves the UI on its previous data.
A read failure blocks all editing; it never replaces unreadable data with empty defaults. Retry loading or choose Recover previous save. More offers confirmed recovery even after an accidental replacement.
Export before deleting browser/app data or uninstalling. No automatic cloud backup exists. Recovery copies may contain recently deleted cards until the next save. This prototype is unsuitable for credentials or confidential vault data.
Import accepts a maximum 2 MB, schema version 1, valid space/card references, real ISO dates and verified provenance. It excludes unknown properties. Media import is rejected rather than falsely restoring missing files.

## Dependencies and operational limits
Expo 57 and its SDK-compatible Router/safe-area/screens/links/constants packages; React 19.2.3; React Native 0.86.3; AsyncStorage 2.2.0; TypeScript 6.0.3. The lockfile is authoritative for resolved patches.
QA tools (lint, doctor, formatting, browser smoke) are development-only. No analytics or remote error reporting is added.
No EAS project ID, credentials, signing files or store provisioning. eas.json is inert configuration for future internal work, with no Production or submit profile.
Physical Android/iPhone screen-reader, system font scaling, cold-relaunch and native storage/share evidence must be collected before native acceptance; never infer those from browser success.

Browser QA uses pinned Playwright 1.62.1 and the installed Microsoft Edge in an isolated headless test profile. Start npm run preview, then npm run test:browser and node tests/accessibility-smoke.cjs. No personal browser session is read. The bundled runtime was used initially; the repository now pins Playwright so npm ci reproduces the runner. Edge must be installed. Expo Doctor 1.20.4 needs outbound Expo API access; a schema-request outage is a failed/unverified gate, not permission to suppress the check.
