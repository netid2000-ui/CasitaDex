# Designs by F&A — Mobile Store Publication Standard v1.0
Date: 2026-10-24 | Scope: CasitaDex and future iOS/Android apps
Status: mandatory workflow policy, NOT evidence of store approval. Recheck official rules at each release candidate.

## Gate 0 — Product and accounts
- [ ] Decide markets, age audience, app category, pricing, legal developer identity, contact/support and tax/banking requirements.
- [ ] Verify Apple Developer membership, agreements, App Store Connect roles; verify Google Play developer account, identity and organization requirements.
- [ ] Identify whether Google account is personal and created after 2023-11-13: if yes, plan 12 continuously opted-in closed testers for at least 14 days and production access application.
- [ ] Record accessibility, localization, child-directed, regulated-content and export-compliance applicability; no blanket assumptions.

## Gate 1 — Architecture and privacy-by-design
- [ ] Inventory data flows: device storage, backups, logs, analytics, crash reporting, SDKs, networks, notifications, photos, documents, authentication.
- [ ] Document retention, user-controlled export, deletion, recovery, consent, encryption and threat model; test cancellation/rollback before release.
- [ ] Use native system photo/document pickers; justify each Android permission and iOS purpose string; do not request broad photo access without a defensible core use case.
- [ ] Audit every SDK/transitive dependency and outbound endpoint; verify Apple privacy manifest/required-reason API declarations and Google Data safety responses against actual binaries.
- [ ] Publish accessible privacy policy and support contact; Apple requires policy in-app and metadata, Google requires privacy policy even when no data collected.
- [ ] If accounts are offered, implement Apple in-app account deletion and Google in-app plus external web deletion request path; verify associated data handling.

## Gate 2 — Design, accessibility and product completeness
- [ ] Figma authoritative Apple and Android variants, final brand assets, navigation, empty/error/permission/denied/offline states and large text.
- [ ] Implement meaningful native utility, complete screens, no placeholder content or broken links; accessible labels, contrast, focus, tap targets and screen readers.
- [ ] Ensure screenshots are genuine app-in-use captures and descriptions accurately reflect released behavior.

## Gate 3 — Build and platform policies
- [ ] Android: confirm targetSdk >= 36 for new phone apps/updates as of 2026-08-31; inspect merged manifest and final AAB, not merely Expo config.
- [ ] Android: verify app signing, Play App Signing, version code, package name, 16 KB native library compatibility, AAB install and supported devices.
- [ ] Apple: as of 2026-10 use Xcode >= 26 and iOS >= 26 SDK; from April 2027 use SDK >= 27 and minimum deployment target iOS 15. Check current submission bulletin before upload.
- [ ] Apple: validate entitlements, capabilities, signing/provisioning, privacy manifests, required-reason APIs, third-party SDK manifests and signatures, export compliance.
- [ ] Check payment rules only after deciding monetization; digital features/subscriptions require separate IAP/Play Billing policy analysis.

## Gate 4 — Functional and security evidence
- [ ] Typecheck, lint, unit/integration tests, dependency/security scans and provenance in CI; block promotion on failures.
- [ ] Test airplane-mode create/find/edit, app termination/restart durability, restore, import/export, interrupted writes, storage exhaustion, permission denial and reconnection.
- [ ] Test notifications and recurrence with device timezone/DST, large text, screen readers, light/dark, phones/tablets, OS upgrades and low-memory behavior.
- [ ] Run OWASP MASVS-oriented security review; ensure no sensitive data in telemetry, screenshots, logs or crash reports.
- [ ] Apple TestFlight and Google internal/closed testing; retain tester feedback, crash/ANR evidence and regression results.

## Gate 5 — Store metadata and declarations
- [ ] Apple: final app name, subtitle, description, keywords, category, privacy answers, age-rating questionnaire, screenshots, support/privacy URLs, review notes and demo access if needed.
- [ ] Google: final store listing, screenshots, feature graphic, privacy policy, Data safety, ads declaration, content rating, target audience, app access instructions and permission declarations.
- [ ] Check any financial/health/children/AI-generated-content/advertising/UGC declarations only if features actually apply.
- [ ] Record all store answers with a versioned evidence matrix mapping declaration to implementation/test and owner approval.

## Gate 6 — Release authorization and monitoring
- [ ] Validate signed release artifacts on actual supported devices; compare exact uploaded binary/hash to tested release candidate.
- [ ] Owner approves privacy wording, monetization, target markets and final store metadata; no submission or production release without explicit approval.
- [ ] Monitor review feedback, crashes, ANRs, ratings, policy notices, SDK and target API changes; schedule revalidation for every update.
- [ ] A blocked store gate stops only promotion, not safe independent design/engineering/testing work.

## CasitaDex-specific findings / unresolved release gates
- Current app.json: ios.supportsTablet=true; iPad UI and required screenshots must be tested or tablet support consciously reconsidered.
- Current app.json: no explicit Android targetSdkVersion. Inspect generated native build and merged manifest before claiming API 36 compliance.
- Current development config: backendMode=none and productionAuthorized=false. Do not infer privacy answers solely from this flag; audit actual native SDK and network behavior.
- Existing Figma screens and brand exports remain provisional/unaccepted. Store screenshots must wait for approved native UI.
- Existing SB-24 cancellation-safety issue and incomplete device acceptance block release until independently closed with evidence.
- Monetization/account creation are unresolved product decisions: mark account deletion and purchase flows conditional until scope is fixed.

## Official sources — primary references, revalidate at release
Apple review: https://developer.apple.com/app-store/review/guidelines/
Apple upcoming: https://developer.apple.com/news/upcoming-requirements/
Apple submission: https://developer.apple.com/app-store/submitting/
Apple privacy manifest: https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk
Apple screenshots: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
Google target API: https://support.google.com/googleplay/android-developer/answer/11926878
Google closed testing: https://support.google.com/googleplay/android-developer/answer/14151465
Google Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
Google account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
Google photo permissions: https://support.google.com/googleplay/android-developer/answer/16935362
Google app content: https://support.google.com/googleplay/android-developer/answer/9859455

Policy owner: Chief Product & Technology Lead. Evidence is required to close each applicable checkbox; non-applicable items require rationale. This standard applies to future Designs by F&A apps, not only CasitaDex.
