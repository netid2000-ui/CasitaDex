# WORK-SB50 — monetization and release implementation/acceptance matrix

Updated: November 4, 2026, America/Chicago. Owner: Mac release/security/commercial lead. Execution: FA-MAC-DEV-01 via AI Commander only. Supporting workstream for BOTH-SB45/46 and M4–M6; original milestones remain open. **Both apps remain NO-GO.**

## Scope, authority and provenance

Read product charters, master charter, required mobile-design/tool-efficiency instructions and dual-app release SOP. The November 4 exclusive-Mac amendment supersedes historical Windows/Ollama lane text. Preserve free local data access and all owner approvals. No production deployment, live billing, store submission, new spending or destructive data reset occurred. Final physical-iPhone signoff remains the owner's gate.

Inspected source inputs:
- CD: work/cd-sb41-edit-targeting-20261104 at 582e3a934d8619413bb5b05d9e40022b465637d9; root lock SHA256 41f589351110c71dc95d05d90397dcdfd5091d30ed75fff8cb73ba76955fc30a.
- EC: work/ec-sb36-keyboard-save-20261104 at 697801a819de6c4e7aba207af1f3d4c6e31d71b2; root lock SHA256 695a6b96326af7f3ac9b63e724b01f2e994b3df411a3a7d9cb89194ec540ff33.
- Execution logs: external SSD QA-Evidence/WORK-SB50-20261104/{CD,EC}/. Scanned immutable starting tracked-file snapshots excluding docs/qa and docs/security to avoid recursive scanner-output noise; scans do not cover Git history, ignored/untracked source, native binary behavior or signing credentials.
- Tools verified: Gitleaks 8.30.1, OSV-Scanner 2.7.0, Node v24.22.1. Detached scan/test job cd7de48e0f415fd8; summary.json records each exit. Initial wrapper 21afd7b3dfaa92dc failed at missing node PATH after scans; corrected run supersedes it.

## Implementation matrix

| ID / requirement | CasitaDex source evidence and current implementation | Event Command source evidence and current implementation | Action / owner |
| --- | --- | --- | --- |
| BILL-01 Apple purchase | src/purchaseGateway.ts configured=false; purchase throws. Lifetime Complete direction; optional convenience scope must preserve Amendment D/E free rights. | src/domain/purchaseGateway.ts configured=false; purchase throws. Per-event and annual direction approved; pricing/product catalog unverified. | Engineering: define approved product IDs/type/scope, connect native adapter, verify StoreKit environment; no client-only paid grant. BLOCKED operationally. |
| BILL-02 Google purchase | Same fail-closed boundary; native Play adapter/product configuration not established by this source. | Same boundary; no working checkout claimed. | Engineering: compatible native Billing integration, catalog retrieval/localized price, purchased/pending/cancel/error handling, acknowledgement after verified fulfillment. |
| BILL-03 Restore | restore throws; no successful restore possible. No cross-store entitlement promise. | restore throws; event/annual restoration scope unimplemented at gateway. | Engineering: user-triggered restore/query, trusted verification, idempotent grant, no-purchase result, account/store mismatch and error states. |
| BILL-04 Trusted entitlement | src/premiumEntitlement.ts requires active AND trustedVerification; canAccessExistingMemories always true. Boolean is a contract, not cryptographic verification. | src/domain/purchaseLifecycle.ts requires active AND verifiedByTrustedBackend. No concrete backend verifier proven. | Security/engineering: establish receipt/JWS/token authenticity, app/product/environment, account/event scope, replay prevention, revoke/expiry refresh and durable cache. CD remains local-first: do not introduce permanent backend without architecture authorization. |
| BILL-05 Lifecycle and continuity | Pending/cancel/fail/expired/revoked pure-state functions; free memories remain accessible. | Purchase/restore pending transitions, cancel/fail preservation, verified expire/revoke transitions. | QA: native lifecycle and storage evidence; retain planning, data/export/accessibility/event-day continuity without premium. |
| SEC-01 Secrets | Current scoped tracked-source Gitleaks PASS, 0 findings, exit 0. | 2 gcp-api-key pattern detections in config/firebase/{development,staging}/google-services.json, exit 1. Matches prior EC32 focused scan. | Security: verify API/app restrictions, authorized domains, rules and App Check posture; client keys alone do not prove compromise. Review history separately with redaction. |
| SEC-02 Dependencies | Root lock OSV exit 1: 6 advisory instances across 5 families. | Root lock OSV exit 1: 19 instances across 12 families. Functions lock not scanned in this run. | Security/engineering: dependency path, advisory severity, runtime/dev exposure, fixed version, compatibility, remediation and rerun. No blanket upgrades. |
| SEC-03 Native security | No fresh compiled-artifact MASVS/MobSF acceptance in SB50. | Prior documented MobSF WebView-debug finding requires current-artifact closure; SB50 does not establish closure. | Security: scan exact signed candidate, correlate findings with release variant, permissions/storage/backup/network and MASVS/MASTG checks. |
| PRIV-01 Disclosures | docs/qa/SB26_PRIVACY_DISCLOSURE_DRAFT_20261020.md and ios/CasitaDexDev/PrivacyInfo.xcprivacy exist; drafts/existence do not prove complete declarations. | ios/EventCommandbyFA/PrivacyInfo.xcprivacy exists; Firebase/account/guest content and SDK behavior require reconciliation. | Privacy lead: actual SDK/data-flow inventory; Apple privacy labels/manifests and Google Data safety; public policy/support URLs; verify deletion/export/retention. |
| A11Y-01 Accessibility | WORK-SB48 supports pending photos/reminders, enlarged text/landscape and VoiceOver/TalkBack evidence. | EC27 accessibility documentation exists; native screen-reader/parity gates remain open. | Accessibility/QA: native reading order, labels, hints, disabled/error/live states, contrast, target size, XL, reduced motion and orientation on both platforms. |
| STORE-01 Assets/metadata | Brand dark/light/tinted icons and splash files tracked. No listing acceptance inferred. | icon, Android foreground/background/monochrome, splash tracked. No listing acceptance inferred. | Design/release: accepted Figma brand, sizes/crop, current native screenshots, description/keywords/category/age/content ratings, support/privacy URLs and rights/provenance. |
| BUILD-01 Signed native builds | eas.json internal/simulator/local-credential profiles; a profile is not signed-store-artifact evidence. | eas.json includes production/submit profiles and emulator QA profile; configuration is not submission authorization or release proof. | Native/release: reproducible local signed archive/IPA and AAB, distribution identity and provisioning, version/build numbers, bundle IDs, lock/artifact hashes, exact Git SHA, clean tree and device install tests. Do not print credentials. |
| APPROVE-01 Final release | NO-GO pending native photo/reminder/offline/parity/security/owner gates. | NO-GO pending authenticated native functional E2E, isolation, parity/security/billing/store gates. | Release lead assembles evidence; owner alone approves final physical-iPhone and explicit release/store actions. |

## Executed evidence

| Check | CD | EC | Limit |
| --- | --- | --- | --- |
| Existing purchase/entitlement regressions | 2/2 PASS, exit 0 | 3/3 PASS, exit 0 | Pure/source billing safety checks; no store or native checkout acceptance. |
| Gitleaks tracked snapshot | 0 findings, exit 0 | 2 findings, exit 1 | Sanitized summaries only; no raw key values committed. Exclusions/scope above. |
| OSV root package-lock | 6 advisory instances, exit 1 | 19 advisory instances, exit 1 | Advisory/package instances are not unique exploitable vulnerabilities. No current functions/native lock scan. |
| Native billing, restore, entitlement lifecycle | NOT RUN | NOT RUN | Gateway unavailable. No transaction initiated. |
| Signed build, fresh binary scan, store console settings | NOT VERIFIED | NOT VERIFIED | No signed release artifact produced by SB50. |

CD OSV families: decode-uri-component 2, deepmerge 1, glob 1, minimatch 1, zod 1.
EC OSV families: @opentelemetry/core 1, basic-ftp 1, body-parser 2, deepmerge 1, fast-uri 4, glob 2, ip-address 1, minimatch 2, qs 1, re2js 1, uuid 1, zod 2.

## Acceptance matrix — all rows pending native/store evidence unless noted

| Test IDs | Setup and action | Required outcome / durable evidence | Status / dependency |
| --- | --- | --- | --- |
| APL-01/02 | Isolated Xcode StoreKit config then Apple sandbox, each approved non-consumable/subscription product | Product and localized disclosures correct; verified successful transaction grants exact capability/scope once; finish transaction; restart/reinstall-on-separate-QA-device restore verified. Record environment, product ID and redacted transaction reference. | BLOCKED native adapter/catalog. Local StoreKit test is separate from signed App Store sandbox verification. |
| APL-03/04 | Pending/Ask to Buy, user cancel, forced failure, interrupted transaction; replay callback | No premature paid grant, clear pending/error text, retry safe, no duplicate grant or lost existing data. | NOT RUN. |
| GGL-01/02 | Play license testers/internal test build, approved products; successful and delayed payment | Verify token authenticity and eligibility; grant only PURCHASED; acknowledge after fulfillment within applicable deadline; duplicate token cannot grant twice. No real paid transaction. | BLOCKED adapter/catalog/verifier. |
| GGL-03/04 | Pending completes/cancels, billing unavailable, account mismatch, offline interruption | No grant while pending; eventual verified fulfillment or cancellation; preserved draft/data, useful recovery message. | NOT RUN. |
| RST-01..04 | Restore with existing purchase, no purchase, wrong account/store, network/verification failure | Existing valid entitlement restored once to proper user/event; empty result explicit; failure never unlocks; no cross-store promise; free rights unchanged. | BLOCKED working restore. |
| ENT-01..06 | Forged/unverified result, replay, wrong app/product/environment/event, expiry/refund/revocation, subscription grace/lifecycle, restart/offline | Trusted verification binds exact scope; counterfeit/replay rejected; trusted lifecycle updates remove optional paid access; cached entitlement policy explicit and bounded; local data/core planning never stranded. | Contract tests PASS only; native/verifier tests NOT RUN. |
| SEC-04..08 | Tracked-source + history Gitleaks; root/functions/native lock scans; exact signed binary scan; Auth/rules/tenant/MASVS negative tests | Findings triaged with severity and exposure; no unresolved release-impact critical/high risk; redacted logs and remediation/test reference; isolation proven. | OPEN findings; scoped scans completed above. |
| PRIV-02..05 | Review camera/photos/notifications/SDK/account/guest-data flows and denials; export/delete/retention; inspect manifests/listing | Actual collection/sharing/purposes match both store declarations, SDK manifests and privacy policy; permissions optional and denial usable; deletion/export work per app architecture. | Draft/inventory review pending; no declarations submitted. |
| AX-02..05 | VoiceOver on iOS and TalkBack on Android, XL, landscape, light/dark, reduced motion | Every critical flow reachable/readable; logical focus and announcements; validation and billing result accessible; no color-only meaning/clipping; device/build/test evidence. | NOT RUN by SB50; coordinates SB47–49. |
| META-01..04 | Compare assets/listing against accepted brand and current signed native views | Valid icon/screenshots; truthful pricing/features/offline claims; age/content/export compliance; support/privacy URLs and licensing reviewed. | NOT VERIFIED. |
| SIGN-01..04 | Clean immutable source + local iOS archive/IPA and Android AAB | Record branch/SHA, lock hash, bundle/application ID, build variant/version, signing identity fingerprint, artifact SHA256, device install and critical regression logs. | NOT RUN; do not confuse QA APK or simulator .app with store build. |
| GO-01 | Review M1–M6, original nine batches and supporting streams; owner physical-iPhone acceptance | All mandatory gates evidence-linked; unresolved blocker => NO-GO; explicit owner approval before live billing/deployment/store submission. | NO-GO. |

## Actionable next implementation order

1. Close native core workflows and Figma discrepancies through SB47–49 before expanding commercial implementation.
2. Security lead triages the current root-lock advisories and EC Firebase client-key restrictions; extend scans to functions/native lockfiles and Git history without exposing values.
3. Engineering specifies catalog/type/scope and trusted verification design separately for local-first CD and account/event-scoped EC; implement native adapters only inside authorized sandbox scope. No cloud/backend expansion for CD implied.
4. QA executes sandbox lifecycle/restore matrix against exact signed native candidates, then privacy/accessibility/assets/provenance reviews.
5. Release lead collects complete evidence and requests final owner release decision only after concrete candidate review. No release approval inferred from this matrix.

## Current official research basis

Checked November 4, 2026. These references guide acceptance, not implementation claims:
- Apple StoreKit testing environments: https://developer.apple.com/documentation/storekit/testing-at-all-stages-of-development-with-xcode-and-the-sandbox — Xcode and sandbox are distinct; sandbox tests do not charge users.
- Apple restoring products: https://developer.apple.com/documentation/storekit/restoring-purchased-products — expose a user-driven restore mechanism.
- Apple App Privacy: https://developer.apple.com/app-store/app-privacy-details/ — include integrated third-party SDK behavior; reconcile privacy manifests and declarations.
- Google Play purchase security: https://developer.android.com/google/play/billing/security — verify purchases before grants, reject pending-state grants and prevent token reuse.
- Google Play integration: https://developer.android.com/google/play/billing/integrate — only acknowledge PURCHASED transactions after verified fulfillment; initial purchase acknowledgement deadline applies.
- Google lifecycle: https://developer.android.com/google/play/billing/lifecycle/subscriptions — verify current subscription lifecycle and renewal state.

Research uncertainty: store-console product availability, current developer-account agreements, actual credential/provisioning state, privacy form completion and signed release eligibility were not accessed. Do not mark them configured from source profiles.
