# Security review — 2026-10-07
Status: prototype isolation checks PASS; dependency hardening OPEN.

## Boundaries verified
Production/unknown environments are rejected. Development and Staging native IDs, schemes and storage keys differ. No EAS project ID, Firebase dependency/configuration, credentials, account service, analytics or network data adapter is used. Local server binds only 127.0.0.1. Cloud/store/build resources were not created.
User data is not sent by the app. Sharing requires selection and a visible exact preview; only explicit user activation invokes copy/share. Import validates schema, dates, references, size and provenance before changing storage and strips unknown fields.
Local storage and readable JSON exports are not a credential vault or automatic backup. The UI discloses this. No alarm/door/password data is solicited.

## Dependency audit
npm audit --omit=dev returned 29 affected dependency entries: 18 high, 11 moderate, 0 critical. These are propagated entries, not 29 independent advisories. Four underlying advisories:
- braces: stack-exhaustion denial of service in nested patterns — https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- decode-uri-component: malformed encoded-input denial of service — https://github.com/advisories/GHSA-vcc3-ghjq-m6fr
- node-forge: RSA signature verification issue — https://github.com/advisories/GHSA-86w9-cpqp-85rv
- uuid: buffer bounds issue — https://github.com/advisories/GHSA-w5hq-g745-h8pq

Expo includes build/development tooling within dependency chains, so --omit=dev alone does not establish shipped-code exploitability. Runtime reachability has not been fully audited; do not describe these as all harmless tooling-only findings.
Suggested npm fixes included switching Expo 57 to Expo 44, Router 58, or Splash Screen 55. No forced cross-SDK upgrade/downgrade was applied to the accepted SDK 57 baseline. Security/release acceptance remains open until supported fixes or documented mitigation and reachability review are complete.
The SDK-aligned animation dependencies were pinned to Reanimated 4.5.1 and Worklets 0.10.1 after npm initially chose an incompatible peer.
Npm left unrs-resolver's optional postinstall unapproved; no blanket script approval was applied. Lint completed without approving it.

## Not claimed
No penetration test, native encrypted-storage guarantee, signed build validation, store compliance, trademark clearance or Production approval.
