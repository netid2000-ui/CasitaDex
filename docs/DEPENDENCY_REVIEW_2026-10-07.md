# Dependency review — Native durability batch

Date: 2026-10-07. Status: CLASSIFIED, remediation gate OPEN. This is not a release waiver.

Starting audit (`npm audit --omit=dev --json`) reports 29 affected dependency entries: 18 high, 11 moderate. These are propagation entries for four root advisories, not 29 distinct vulnerabilities. Omitting dev dependencies does not remove Expo/Metro build tooling because Expo is an application dependency.

| Root package / advisory | Inspected use and exposure | Decision |
|---|---|---|
| braces 3.0.3 — GHSA-vfj7-8cjw-p6xm, high | micromatch → Metro file-map/build patterns. No application card/import API passes user data to glob matching. Build-tool exposure; hostile repository patterns remain relevant. | Temporarily tolerate for this local prototype with trusted source and loopback preview. Not a general claim of safety; require upstream compatible fix before release review. |
| decode-uri-component 0.2.2 — GHSA-vcc3-ghjq-m6fr, moderate | query-string → Expo Router path/query handling. Runtime reachable via navigation/deep-link input; must not classify as build-only. Malformed input can make the app unresponsive. | OPEN release blocker. Published fix 0.5.0 changes to ESM while installed query-string expects a CommonJS callable. Do not blindly override or force Router 58 into SDK 57. Track SDK-aligned update or reviewed compatible patch with malformed-URL regression tests. |
| node-forge 1.4.0 — GHSA-86w9-cpqp-85rv, high | Expo CLI / code-signing certificates. CasitaDex source has no certificate/signature verification feature or OTA update workflow. Build/signing-tool risk, not evidence of compromised app data. | Local test-key builds only in this batch. Review compatible upstream remediation before signing/distribution workflows. |
| uuid 7.x — GHSA-w5hq-g745-h8pq, moderate | xcode project generator. Installed xcode/lib/pbxProject.js calls uuid.v4(), whereas advisory concerns v3/v5/v6 with caller-supplied buffers. | Affected call pattern not found in inspected path; retain as toolchain advisory, no unsupported major-version override. |

Evidence: work/native-batch-audit.json, installed package source and lockfile. Public advisories verified during this batch:
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/advisories/GHSA-vcc3-ghjq-m6fr
- https://github.com/advisories/GHSA-86w9-cpqp-85rv
- https://github.com/advisories/GHSA-w5hq-g745-h8pq

No `npm audit fix --force` was used. Audit recommendations included SDK-incompatible downgrades/upgrades. Scope is local prototype testing; no public deployment or Production risk acceptance is implied. Static use classification is not exploit testing or a proof that all transitive paths are unreachable.

Added dependencies: expo-sqlite ~57.0.4 (native local database) and expo-system-ui ~57.0.4 (native appearance handling), matching installed Expo SDK 57 bundledNativeModules recommendations. No cloud, ads, AI, account, or telemetry library was added.

Expo Doctor: baseline command exits 1 because online schema verification encounters a network/TLS failure. Classify online verification as UNRESOLVED / OPEN, not a demonstrated schema defect. Other 20 checks passed. Final rerun and exact package versions are recorded in batch evidence.
Native dependency correction: removed unused expo-notifications 57.0.22 after its Android build file revealed Firebase Messaging 25.0.1. No existing reminder functionality depended on it. The final build adds scripts/verify-local-only.gradle to inspect resolved native runtime artifacts; a JavaScript manifest check alone was insufficient. Final audit snapshot is recorded separately after removal.
