# SB39 production dependency advisory triage — 2026-10-27

Status: RELEASE BLOCKED PENDING REMEDIATION OR EVIDENCE-BASED SECURITY SIGN-OFF. No waiver granted.

## Current observations
Run: `npm audit --omit=dev --json` in isolated Mac integration workspace after SDK-57 patch alignment; 6 vulnerability entries: high 3, moderate 3, critical 0. The six entries represent TWO underlying published advisory chains, not six independent defects.

| Chain | Packages reported | Root advisory | Observed installed version | Security consideration |
| --- | --- | --- | --- | --- |
| URI decoding | `expo-router`, `query-string`, `decode-uri-component` | GHSA-vcc3-ghjq-m6fr | `query-string@7.1.3` -> `decode-uri-component@0.2.2` | Malformed percent-encoded route/query input can trigger disproportionate decode work; app handles deep links and is potentially reachable. Must treat as runtime risk until proven otherwise. |
| Schema validation | `expo`, `@expo/cli`, `zod` | GHSA-mrhx-c7xc-m3w5 | `@expo/cli@57.0.32` -> `zod@3.25.76` | Unbounded schema validation can exhaust memory on crafted oversized constrained collections. Expo CLI is generally build/dev tooling; exact packaged/mobile runtime reachability still requires proof. |

`npm audit` proposed major/incompatible fix transitions (`expo@54.0.38` or `expo-router@58.0.27`) when constrained to this package graph. Such suggestions are NOT safe automatic SDK-57 updates.

## Verification and remediation gates
1. Validate whether each vulnerable function is included or reachable in the shipped native JavaScript bundle, especially malformed custom URI input through Expo Router. Create bounded malformed-link tests in isolated simulator, no production data.
2. Explore SDK-compatible Expo Router/query-string patch or vetted dependency override in a disposable integration branch, with app start, deep link parsing, navigation, typecheck, lint, full tests, Doctor, and native release rebuild. Do not force an incompatible major upgrade.
3. For Zod, establish whether usage exists only in Expo CLI/dev/install tooling; inspect native bundle dependency inclusion rather than inferring from a transitive package graph. Even a tooling-only advisory needs an accepted remediation or documented assessed exception before releasing.
4. Rerun `npm audit --omit=dev --json` AND complete release pipeline; do not equate zero npm audit findings with a comprehensive security review.
5. Final security disposition, store submission and production gates remain owner-controlled.

## Current safety evidence
Expo Doctor 21/21 PASS; TypeScript/lint PASS; 393 source tests (387 passed, 6 skipped, 0 failed); web export PASS. No SB39 native signed builds have been tested. No patch override, deletion, SDK migration, production deployment or device-data mutation during this triage.

## 2026-10-27 source-level reachability checkpoint
- Confirmed actual Expo Router JavaScript contains a `query-string` import in `build/fork/getPathFromState-forks.js` and this dependency imports vulnerable `decode-uri-component@0.2.2`. This is an application navigation dependency, NOT categorically tooling-only.
- Ran bounded, benign query parsing examples (spaces, UTF-8 checkmark, percent escaping, invalid percent) without a crash. **This does NOT prove immunity to crafted denial-of-service payloads**; deliberately avoided high-cost unbounded malicious inputs.
- Zod@3.25.76 is under `@expo/cli@57.0.32` and ESLint development tooling; no proof yet that its affected schema validation is included in a distributed native app. Native Release bundle not available in this SB39 source-only worktree. Treat runtime presence as unverified.
- No dependency overrides or major SDK changes applied. Native deep-link acceptance and security disposition remain blocked until native artifact inspection and compatible remediation.
- Added `tests/sb39-uri-route-safety.test.mjs` covering exact exposed dependency chain, bounded benign parsing, and the production-environment gate.

## Compatible decoder replacement feasibility (Oct 27)
- Latest fixed `decode-uri-component@0.5.1` is ESM (`"type":"module"`, default export). Current `query-string@7.1.3` calls `const decodeComponent = require('decode-uri-component')` followed by `decodeComponent(value)`, expecting the CommonJS function export of vulnerable 0.2.2.
- Examined the fixed package in a temporary, non-repo directory; in Node 24, `require()` returns a module namespace object with a `.default` function, NOT a directly callable function. Therefore forcing 0.5.1 into query-string 7.x is NOT a safe drop-in override; it risks runtime TypeError and failed route parsing. Did not install override.
- The planned remediation must replace the upstream consumer, use a compatibility-reviewed maintained decoder adapter, or accept a properly justified, owner-approved temporary security hold. Runtime app build acceptance remains blocked until addressed.

## SB39 iOS bundle preparation checkpoint
- Compared `query-string` 8.x and 9.x registry metadata: both ESM and use updated decoding dependency family; Expo Router 57.0.29 requires `query-string ^7.1.3`. Therefore replacing the entire query-string major line without direct end-to-end native navigation proof is unsupported. No override installed.
- Generated isolated SB39 iOS native project using Expo prebuild; generated files exist only under integration worktree `ios/`.
- Successfully exported standalone iOS Hermes bytecode to `dist-sb39-ios/_expo/static/js/ios/entry-61a79eb1a1de45ec340c8c9730f760d8.hbc` (4.6 MB). Hermes bytecode is not readable source; substring searching cannot establish vulnerability reachability. Need source map/module graph or native runtime instrumentation in an isolated app before declaring presence/absence. No simulator installation performed.
- Android and iOS accepted QA installations remain untouched. Production remains blocked.
