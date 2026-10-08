# CasitaDex prototype verification — 2026-10-07
## User story
Save a home fact → local repository validates/persists it → reload and retrieve it → selectively preview a share → export or recover the user-controlled collection.

## Evidence
- Pinned SB-12A source: see STARTER_PROVENANCE.json.
- Both starter render modes PASS; all 10 starter guardrails PASS before bootstrap.
- TypeScript PASS, exit 0.
- ESLint PASS with --max-warnings=0, exit 0, after correcting JSX punctuation and startup hydration effects.
- Domain/recovery/config tests: 12/12 PASS, exit 0.
- Expo web export PASS, 788 modules, one 1.1 MB JS bundle, 18 assets, index.html and metadata.json.
- Final web bundle: entry-62e8acefb9971caf3edbaeb96531987f.js.
- Initial browser smoke: 18/18 PASS, no page exceptions. Final screenshots/results are in qa/browser-results.json and qa/*.png.
- Expo Doctor 1.20.4: 20/21 checks passed. Online config-schema check failed in both attempts: TLS disconnect, then ETIMEDOUT 34.110.201.56:443. Local config tests, SDK version alignment, peer dependencies, duplicate detection, Metro/config checks and React Native Directory check passed. Overall Doctor remains FAILED/UNVERIFIED, not a clean pass.
- npm audit: open findings documented in SECURITY_REVIEW.md.

## Corrections made within batch
Hardened local-only environment allowlist and separated native IDs/schemes/storage. Aligned Router animation peers to Expo SDK 57. Added explicit keyboard focus and web toggle semantics. Reflowed 200% navigation into rows. Replaced synchronous startup-effect state changes with cancellable async hydration.
The initial lint attempt during dependency extraction failed on a missing transient tool module; after installation completed lint reported four source issues, all corrected before the final lint pass.

## Acceptance limits
This evidence is a local UX prototype gate only. Native signed build, physical Android/iPhone, TalkBack/VoiceOver, OS font scaling and native cold-relaunch/offline storage remain untested. Browser offline evidence covers an already-loaded app, not an offline browser cold start/service worker.
SQLite, app-owned media and device notification scheduling remain future Local MVP work. Today's reminders are in-app due dates.
No GitHub CI run, remote push, EAS build, Expo project, cloud backend, store record or Production deployment was created.
SB-12 physical Android closure remains pending independently. SB-12A final acceptance remains open. SB-13 not started.

## Final narrow-screen correction
The initial extra 320px test lacked a route assertion and incorrectly labeled an Answers screenshot as Detail. That evidence was rejected and replaced. Focus originally widened a button border from 1 to 3 pixels, allowing wrapped navigation to move during pointer activation. Focus now preserves geometry. Strengthened tests assert destination routes before checking content. All six extra checks subsequently passed; corrected screenshots show the actual Detail and Share screens.
Final export after this fix: entry-0b3857db16a366660a99e3a8ba8b0fbe.js (788 modules).
