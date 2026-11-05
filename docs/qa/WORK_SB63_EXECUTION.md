# WORK-SB63 security and release evidence

November 4, 2026 (America/Chicago) · FA-MAC-DEV-01 · Security and release lane · **NO-GO for both stores**

## Review scope and checkpoints

Reviewed the master charter, product charters, release SOP, SB56–59 return report, SB59 redacted findings and the checked-in build configuration. Event Command started at `4f4443e2c4362947fd3f0d9141a098e3e593f38f` and CasitaDex at `8fba66d7a5dee1ee37dababf20fd0fc268a66b6f`. AI Commander performed local read-only inspection and an isolated dependency candidate on the external SSD. The EC60 worker coordinated the lock commit and owns the push. SB59 evidence is under `QA-Evidence/WORK-SB59-20261104`. The three baseline lock hashes matched that evidence before triage.

| Scope | Baseline lock SHA256 | SB59 evidence |
| --- | --- | --- |
| Event Command root | `695a6b96326af7f3ac9b63e724b01f2e994b3df411a3a7d9cb89194ec540ff33` | 19 advisory instances |
| Event Command Functions | `8802da2187ee758ff54755850618b6f8316b91cbf18faa21186d18edcd1a7b23` | 1 advisory instance |
| CasitaDex root | `41f589351110c71dc95d05d90397dcdfd5091d30ed75fff8cb73ba76955fc30a` | 6 advisory instances |

## Findings disposition

- **Gitleaks source and history.** Reused SB59 evidence. Event Command source had two matches in the development and staging Android Firebase configuration files. The history scan added two Figma inventory/map file identifiers. CasitaDex source had zero matches and its history scan found two equivalent Figma identifiers. The Figma matches identify documents and carry no authentication credential. Firebase client keys identify the app/project and require the account-side restrictions audit below. Live key scopes and quotas remain **unverified**. The scanner reports remain redacted and available at the cited SSD directory.
- **Firebase key audit.** In an authorized read-only Google Cloud console review, match each dev/staging key to project, platform, app identity and Firebase-only API allowlist. Check Android package/signing fingerprints and iOS bundle restrictions where configured, exclude unrelated billable APIs, and document Auth quotas and App Check coverage. Capture project/key aliases and scope without key values. Changes require a separate staged retest. An authenticated Cloud inspection was unavailable on the Mac for this lane. [Firebase key guidance](https://firebase.google.com/docs/projects/api-keys)
- **Rules.** The default `firebase.json` points to checked-in deny-all Firestore and Storage rules. The dev/staging configs point to separate candidate files. Firestore candidate hash `0c32fc35f40f337658f5f7a9b73c8baffb4ebdb6f9022d333f5b3f0bd780e140` and Storage candidate hash `943ea9b128452230b2bf715b88dc381a8f6b171b206df6c4be44d434dfdefc0f` were observed at review. Source contains role and tenant gates, immutable uploads, metadata checks and size/type limits. Existing emulator evidence covers tested cases. Three positive/cross-service Storage tests are explicitly skipped in `tests/storage.rules.test.mjs`. Treat owner/editor delete, owner/viewer read and cross-event read rejection as open for a suitable authorized nonproduction bucket or upgraded isolated emulator. `functions/index.cjs` sets `enforceAppCheck: false` on event creation. Review App Check, quotas and abuse cases against the intended signed candidate before public traffic. The live rules and console policy were outside the evidence collected.

## Dependency triage and patch order

Severity and fixed-version records come from SB59's advisory JSON. Package scope below distinguishes development-only paths, tooling pulled in by production-marked Expo packages, and paths that may enter the runtime. Lock classification alone cannot establish bundle reachability. Review actual bundle composition, native SDKs and Functions deployment tree at distribution build.

| App and package | Advisory severity, exact affected lock version and fix | Decision |
| --- | --- | --- |
| EC re2js | HIGH `GHSA-gg6h-894w-4m9c`, 2.8.6, fix 2.8.7 | `@react-native-firebase/app → firebase → @firebase/firestore → re2js`. Firestore accepts `^2.8.3`. Advisory requires opt-in lookbehind and repeated matching. Application Firestore calls use native wrapper. Prioritize the in-range patch and verify shipped JS/SDK reachability. |
| CD decode-uri-component | HIGH `GHSA-qr28-fpjm-wq7f`, MODERATE `GHSA-vcc3-ghjq-m6fr`, 0.2.2, fixes 0.5.1 and 0.5.0 respectively | `expo-router → query-string 7.1.3 → decode-uri-component ^0.2.2`. Deep-link/query parsing can touch this path. Prefer compatible Expo Router/query-string release or a reviewed upstream-compatible fix. A blind major override crosses the declared range. Test malformed percent encodings plus regular link parameters on native builds. |
| Both zod | HIGH `GHSA-mrhx-c7xc-m3w5`, 3.25.76, fix 4.6.6. EC also 4.6.5 | Expo CLI 3.x in both trees. EC MCP/Firebase tooling also consumes zod and Firebase CLI 4.x can take the patch in range. Keep CLI exposure local. Resolve Expo CLI 3→4 through a compatible upstream release. |
| EC basic-ftp | HIGH `GHSA-c475-qrg2-pj4r`, 5.3.1, fix 6.2.1 | Development `get-uri ^5` chain. Update parent tooling together. |
| EC body-parser | HIGH `GHSA-27r3-jxmh-p828`, 1.20.8 and 2.3.0, fixes 1.20.9 and 2.4.0 | Development Express 4 and MCP/Express 5 paths. The inspected Functions lock does not carry this finding. Patch tooling within current major paths, then retest local emulators. |
| Both deepmerge | LOW `GHSA-gcqx-w48m-w2h4`, 4.3.1, no fix listed | Expo config path. Keep config inputs trusted and track upstream. |
| Both glob | MODERATE `GHSA-3g3m-2fjr-6pw4`, 13.0.6 and EC dev 10.5.0, fix 14.0.2 | Expo config/fingerprint/Metro and EC local tooling. Resolve compatible tooling upgrades. |
| Both minimatch | MODERATE `GHSA-g3hv-75wg-m249`, 10.2.6 and EC dev 9.0.9, fix 11.0.1 | Expo fingerprint/glob plus EC dev tools. Resolve with parent updates. |
| EC fast-uri | LOW `GHSA-333x-w4r6-6crp`, `GHSA-xhq7-xmqj-769h`; MODERATE `GHSA-w74x-v6f9-j3xg`, `GHSA-wjr9-j795-jxcr`; 3.1.8, fix 3.1.9 in current major | Development AJV path. Test compatible point release. |
| EC ip-address | MODERATE `GHSA-rxp7-6hxx-x8q5`, 10.7.3, fix 10.7.4 | Development rate limiting/SOCKS paths. Update within supported range. |
| EC qs | MODERATE `GHSA-6pq8-jhm2-2vcw`, 6.16.0, fix 6.16.1 | Development Express/body-parser/Google tooling. Coordinate patch with body-parser. |
| EC OpenTelemetry Core | MODERATE `GHSA-8988-4f7v-96qf`, 1.30.1, fix 2.8.0 | Local Google Cloud Pub/Sub tool chain. Upgrade the parent stack compatibly. |
| EC uuid | MODERATE `GHSA-w5hq-g745-h8pq`, 9.0.1 in dev root and optional Functions dependency, fixes 11.1.1/12.0.1/13.0.1 | SB59 inspected Functions dependents and found immediate v4 calls without an output buffer. Advisory names v3/v5/v6 with output buffer. Audit deployed tree and upgrade compatible parent SDKs. |

[RE2JS advisory](https://github.com/advisories/GHSA-gg6h-894w-4m9c) · [npm release metadata](https://registry.npmjs.org/re2js/2.8.7)

**Patch verified in isolated install and committed.** AI Commander job `0b4a471989ca2b45` exited 0 under the `sb63-security-candidate` lock. The candidate at `QA-Evidence/WORK-SB63-20261104/EC-re2js` used public npm metadata for version, tarball URL, integrity and Node engine. The only lock entry changed was `node_modules/re2js`. Node 24.22.1 satisfies the updated Node >=20 requirement. `npm ci --omit=dev --ignore-scripts --no-audit --no-fund` installed 598 packages. `npm ls re2js --omit=dev` resolved Firestore to 2.8.7. Plain and lookbehind regex matching passed through the Firestore-resolved module. OSV exit 1 records 18 remaining advisories, with `GHSA-gg6h-894w-4m9c` absent. Candidate hash `872618dd960b527d5020aceb65e9f8d1070425821acbf4c21fb4dfe002587f65`. Source commit `6386b5cb237f15db35db43e819e7ff3a201710e8` is part of the coordinated Event Command feature-branch push. The live EC root remains installed at 2.8.6 and active native runs retain their original dependency provenance. A rebuilt native candidate with the patched lock is an open release gate. Candidate evidence: `lock.diff`, `npm-ci.log`, `resolution.log`, `smoke.log`, `osv-candidate.json`, `osv-exit.txt`.

## OWASP MASVS and MASTG evidence

| Area | Current evidence and remaining verification |
| --- | --- |
| STORAGE | CD local SQLite, app media and user-selected export/restore code. EC event scoped Firebase data and document uploads plus native cache. Inspect shipped sandbox, backups, export visibility, residual data on account changes, and purge/restore behavior. |
| CRYPTO | Redacted source/history review only. Verify signed build Keychain/Keystore behavior and exported backup protection before disclosure. |
| AUTH | Local emulator role boundaries and SB56 native isolation accepted for scoped flows. Verify native session expiry, account switch, delete/export lifecycle and deployed enforcement. |
| NETWORK | Local emulator isolation evidence exists for EC. Inspect release network traffic, production endpoints, cleartext/debug overrides, SDK telemetry and CDN/storage requests. |
| PLATFORM | EC notification scheduling and permission request source exists. CD local media picker explicitly configures camera/photos text and disables microphone permission in plugin config. Verify generated manifests, permission refusal, delivery, deep links and export/share behavior on native artifacts. |
| CODE | Exact dependency/advisory review above. Verify remediation in a rebuilt candidate, inspect native dependencies and artifact-level security. |
| RESILIENCE | Local Keychain inspection found an Apple Development identity. Distribution signatures, debugger flags and tamper exposure remain unverified. |
| PRIVACY | CD disclosure draft documents local records and user-directed export boundaries. EC requires complete Firebase/SDK data inventory and end-to-end user and third-party guest data handling. Validate actual collected data and account/data deletion before store declarations. |

[OWASP MASVS](https://mas.owasp.org/MASVS/) · [OWASP MASTG](https://mas.owasp.org/MASTG/)

## Store and distribution gates

| Gate | Event Command | CasitaDex | Evidence required for GO |
| --- | --- | --- | --- |
| Version, bundle and store profile | 0.1.0, `com.designsbyfa.eventcommand`. EAS production auto-increments. Dynamic config maps Firebase for development and staging only. | 0.1.0. Dynamic config assigns `.dev` and `.staging` IDs and rejects production. EAS profiles are internal. | Resolve release environment, IDs and unique platform build versions. Record final effective config and environment along with artifact/source hashes. |
| Distribution signature and entitlements | Local Apple Development identity and prior ad-hoc simulator evidence. | Local Apple Development identity and prior simulator evidence. | Signed distribution archive/IPA and AAB with expected identities, entitlement checks and no debug packaging. Verify iOS notification/keychain and Android permissions in the actual signed build. |
| Local notifications and push | Source requests permission and schedules through Expo. Prior native entitlement failure still open. | Projection verified in earlier lane. SB61 scheduler status and native delivery evidence belong to that lane. | Allowed and denied permission, schedule, delivery, tap route, background/relaunch and reschedule/cancel/reboot on intended platforms. Verify signed distribution permissions independently. |
| Privacy and deletion | Sign-in, event/guest data, dietary fields, vendor/budget, documents, local persistence and linked Firebase services. Full account and related data deletion evidence pending. | Existing draft covers local memory, images, reminders, backups and share-sheet handoff. Exact retention/export behavior and final SDK inventory pending. | Verify real data paths and destinations including SDKs, retention and account deletion where applicable. Agree privacy/support URLs and actual iOS labels and Play Data safety declarations. Inspect generated privacy manifests and permission manifests. |
| Store assets and listing | Tracked 1024×1024 app icon plus Android adaptive and splash assets. | Tracked 1024×1024 light/dark/tinted iOS icons, adaptive and splash assets via app config. | Check artifact rendering and owner design authority. Capture accepted current native screenshots and prepare app text, content rating, review access and support details. |
| Purchase and restore | `src/domain/purchaseGateway.ts` deliberately fails closed with `configured: false`. | `src/purchaseGateway.ts` deliberately fails closed with `configured: false`. | Add approved products and trusted entitlement validation, then execute native Apple sandbox and Google license tester purchase, restore, cancel, pending, refund/revoke, subscription grace where applicable, identity binding and offline behavior. CD existing data remains accessible after entitlement loss. |
| Accessibility and native parity | SB60 and SB62 own current functional/native findings. Existing portrait configuration is a landscape gate. | SB61/SB62 own viewer, offline, responsive and native driver findings. | Physical and simulator coverage with exact candidate IDs, screen-reader/keyboard evidence and final owner iPhone acceptance. |

[Apple App Privacy](https://developer.apple.com/app-store/app-privacy-details/) · [Apple sandbox](https://developer.apple.com/help/app-store-connect/test-in-app-purchases/overview-of-testing-in-sandbox) · [Google Play app content](https://support.google.com/googleplay/android-developer/answer/9859455) · [Google Play billing tests](https://developer.android.com/google/play/billing/test)

## Next actions

Engineering owns dependency upgrades and compatible SDK retests. The release and security lane owns read-only authorized console restrictions review and distribution artifact inspection. App owners provide store product, privacy/support and distribution access as appropriate, then perform final physical-iPhone acceptance and explicit release sign-off. Routine internal verification can continue from the recorded evidence.
