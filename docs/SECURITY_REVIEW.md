# Security review — 2026-10-07
Status: local prototype isolation checks PASS at source/resolved-graph level; native acceptance and dependency remediation remain OPEN.

## Isolation and an earlier blind spot
Production and unknown environments are rejected. Development and Staging use unique CasitaDex native IDs, schemes, legacy keys and SQLite filenames. No Event Command identity/secret, EAS project, Firebase configuration, F&A backend, account service, ad SDK or cloud resource was created.
The initial JavaScript-only dependency check was insufficient: unused expo-notifications 57.0.22 would include Android Firebase Messaging 25.0.1 and its MESSAGING_EVENT service. This batch removed the unused dependency and added scripts/verify-local-only.gradle. The resolved runtime graph checked 210 components with no com.google.firebase artifacts. Final native artifact/build evidence is recorded in NATIVE_BATCH_REPORT.md; do not substitute graph inspection for an installed-app result.
This is a reusable-starter follow-up finding for backendMode=none. Event Command was not modified, and neither its SB-12 gate nor final SB-12A acceptance is closed by this work.

## Data controls
The app has no background upload adapter in inspected source. Explicit sharing requires selection and a visible preview before invoking copy/OS sharing. No automated test sends a snapshot to another person.
Imports validate version, dates, references, UTF-8 byte size and explicit provenance, and allowlist fields before mutation. Native SQL uses parameter bindings, a private serialized connection and transactions. Corrupt primary data must not replace a known-good recovery copy; tests cover that behavior and interrupted transactions. Browser replacement remains two-key and non-atomic.
Local SQLite, retained legacy data and readable JSON backups are not an encrypted credential vault or automatic backup. Uninstall/device loss can remove them. A deleted current card can remain in previous-save/legacy recovery data; this is disclosed in the runbook. The product does not solicit passwords, door/alarm codes or a full address.

## Dependencies and release limits
See DEPENDENCY_REVIEW_2026-10-07.md and docs/qa/dependency-audit-final.json for the four root advisory families and 29 propagated entries (18 high, 11 moderate).
The Router URL-decoding path is runtime-reachable and remains an OPEN release blocker. Other inspected paths concern Metro/build patterns, certificate tooling and xcode's v4 UUID generation, with stated limits to that classification. No destructive cross-SDK audit fix was used. This is not a Production risk waiver or penetration test.
Doctor's online schema request remains unresolved because of a pre-TLS connection failure. No schema failure was demonstrated. Test-signing is only for local Staging; no store signing or distribution approval is implied.
