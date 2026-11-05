# WORK-SB59 — cross-platform release and security execution
November 4, 2026 (America/Chicago). Mac mini FA-MAC-DEV-01; AI Commander. Status: **release NO-GO for both apps**.

## Scope, starting state and coordination
Starting revisions CD 8c3fbfa55376ef0a4cfd7dc8075021f1d453977d on work/cd-sb41-edit-targeting-20261104; EC f59f255b99f914760742b3e9fe1a23113ea0dd8e on work/ec-sb36-keyboard-save-20261104. Both clean at parent preflight.
Read current master charter, project commercial/release amendments, required design/tool instructions and SB50 evidence/matrix. Parent owns EC native simulator/runtime and SB56 integration; SB57 owns EC functional source; SB58 owns CD source/native. This lane owns WORK_SB59 docs only. No source/lockfile, simulator, credentials or store changes.
Mac external SSD remained mounted/writable; scans/evidence stored below QA-Evidence/WORK-SB59-20261104. Retired Ollama unused. No Windows jobs assigned. Independent scan/test jobs avoided active Auth19099/Firestore18080/Functions15001/Metro8084 and native device lanes.

## Executed checks
Job e3c7ba1c938242ff completed exit0, 2026-11-05T04:11:07Z–04:11:16Z (November 4 local), preserving individual scanner exit codes below. Locks work-sb59-security and sb49-emulator-18449 released at completion.
Job208116bc00209caa reran billing-boundary regressions; log assertions PASS CD1/1, EC3/3. These are model/boundary tests, not purchases.
| Check | CasitaDex | Event Command | Interpretation |
| --- | --- | --- | --- |
| Gitleaks tracked snapshot | PASS:0 detections, exit0 | FINDINGS:2, exit1 | Excludes docs/qa and docs/security; source snapshot includes tracked working-tree files at scan time, concurrent fixes not claimed scanned later. |
| Gitleaks Git history | FINDINGS:2, exit1 | FINDINGS:4, exit1 | CD2/EC2 identify public Figma fileKey fields in SB47 inventory/map; triage as public identifiers. EC additional2 are Firebase development/staging client-key patterns. |
| OSV root lock | FINDINGS:6 advisory instances,5 package-version rows, exit1 | FINDINGS:19 instances,16 package-version rows, exit1 | Matches prior SB50 counts. Instances are package/advisory combinations, not confirmed exploitable vulnerabilities. |
| OSV functions lock | N/A: no functions lock | FINDING:1 instance,1 row, exit1 | Newly covered uuid9.0.1 GHSA-w5hq-g745-h8pq; functions lock marks package non-dev. |
| Existing billing safety | PASS1/1 | PASS3/3 | Purchase/restore gateway remains configured=false in both apps; native store test NOT RUN. |
|10-guest birthday/1000-guest wedding | N/A | PASS2/2 emulator scenarios | Full-size local fixtures, role boundaries, RSVP/dietary preservation, timeline stable IDs/simultaneous activities/server readback. Native E2E/performance/offline NOT RUN by this lane. |
| Native accessibility | NOT RUN | NOT RUN | Parent/SB58 results must be recorded separately; no inference from static scanner. |

Gitleaks8.30.1 and OSV-Scanner2.7.0. Raw scanner reports use redaction, remain on external SSD; committed WORK_SB59_SECURITY_EVIDENCE_20261104.json contains sanitized paths/rules/advisory IDs, source and lock hashes, individual exits and artifact checksums. No raw key or match is reproduced.

Scale rerun command sh scripts/run-work-sb49.sh used demo-fa-sb49 and dedicated18449–18452 ports. Both tests passed, script exited0; emulators shut down normally. Expected permission-denied log entries are asserted negative tests, not unhandled failures. Birthday read104.31ms, wedding read128.27ms measure local emulator fetches only; no native rendering benchmark. Fixture creation deliberately uses local rules-disabled test setup, so event creation via native UI is not established.
No still-running jobs from this lane after completion. Existing parent runtime services preserved.

## Findings and remediation order
1. **SB59-SEC01 dependency triage, severity pending advisory/reachability review; release gate OPEN.** CD affected families decode-uri-component/deepmerge/glob/minimatch/zod. EC root includes opentelemetry, basic-ftp, body-parser, deepmerge, fast-uri, glob, ip-address, minimatch, qs, re2js, uuid,zod. EC functions uuid is non-dev. Compare exact advisory affected ranges, call sites and shipped bundle/server dependency trees; propose compatible dependency updates; rerun functional/rules/native tests and scanners. No blanket force upgrades or suppressions made.
2. **SB59-SEC02 Firebase client-key restrictions, release impact OPEN.** Source2/history2 detections are config/firebase/{development,staging}/google-services.json. Firebase client API keys are identifiers rather than blanket proof of privileged-secret leakage; restrictions/API scope/quota/abuse protections must be checked through authorized account configuration. Do not rotate blindly or expose values. No claim restrictions are correct.
3. **SB59-SEC03 Figma history detections, probable false positives.** public fileKey fields in WORK_SB47_FIGMA_INVENTORY.json and WORK_SB47_FIGMA_SOURCE_MAP.json. Exact path/commit/line recorded. If an allowlist is approved, scope to this known public identifier/path/rule with rationale, never a broad generic-key suppression. No history rewriting.
4. **SB59-REL01 landscape configuration, release blocker.** EC app.json orientation=portrait. Inspected exec-sb51-fresh .app Info.plist UISupportedInterfaceOrientations lists Portrait and PortraitUpsideDown only. This cannot establish required landscape acceptance; implement/adapt responsive orientation and retest all flows. No config mutation made in this lane.
5. **SB59-REL02 release signing/provenance, BLOCKED.** EC fresh Debug simulator binary strict codesign verification returns0, but Signature=adhoc and TeamIdentifier not set; bundle com.designsbyfa.eventcommand, version0.1.0/build1, SDK iphonesimulator27.2. This is valid simulator evidence only. No signed distribution IPA/AAB, provisioning/team, store version/build uniqueness or release artifact scan verified. CD signed store build likewise NOT VERIFIED.
6. **SB59-REL03 privacy/assets, BLOCKED.** CD has tracked privacy disclosure draft docs/qa/SB26_PRIVACY_DISCLOSURE_DRAFT_20261020.md; no store-submission acceptance. No tracked native PrivacyInfo.xcprivacy/AndroidManifest.xml/entitlement file returned by git ls-files in either checkout, although generated native trees exist. Generated permissions/manifests and third-party SDK disclosures require hash-linked release-artifact validation. No tracked filenames matching app-store/play-store/store-listing/privacy-policy found by bounded filename check; absence of matching filename is not proof no content exists. Reconcile store metadata, public policy URL, support URL, data safety/privacy labels, age rating and screenshots to actual release behavior.
7. **SB59-REL04 billing, BLOCKED.** Both purchase and restore explicitly throw Store billing not configured. Keep approved CD additive lifetime direction and EC per-event+annual contract. Native sandbox purchase/pending/cancel/error/restore/no-purchases/refund/revoke/expiry/account-switch/offline reconciliation NOT RUN; no paid entitlement can be accepted from UI-only evidence.

## OWASP MASVS/MASTG assessment plan and current evidence
Official sources reviewed November4: https://mas.owasp.org/MASVS/ , https://mas.owasp.org/MASTG/0x03-Overview/ , https://devguide.owasp.org/en/04-design/03-mas-checklist/ . MASVS groups specify requirements, MASTG provides verification procedures, and the checklist maps them. This is a risk-based assessment plan, not a certification or full penetration test.
| Control group | App-specific requirement and executable assessment | Evidence / current disposition |
| --- | --- | --- |
| STORAGE | Inspect release sandbox/backups/cache/logs for memory photos, guest dietary data and auth tokens; verify deletion/export and no cross-account residual data | NOT RUN on signed artifacts; local privacy tests/architecture are partial evidence only |
| CRYPTO | Inventory secrets/keys, platform Keychain/Keystore use, encryption claims, export/import protection; validate key lifecycle without extracting private keys | Gitleaks source/history executed; cryptographic design/native validation NOT RUN |
| AUTH | Native emulator-only auth, account/event scope, server rules deny viewer/outsider/revoked users; tokens/session expiry/sign-out; no production QA writes | SB49 scale negative/positive rules tests PASS; SB56 native SDK routing/auth acceptance separate |
| NETWORK | Observe native Auth/Firestore/Functions emulator routing; inspect distribution TLS/cleartext/debug overrides and endpoint environment fail-closed guards | SB56 owns live runtime verification; production release network posture NOT VERIFIED |
| PLATFORM | Picker/media/notification least privilege, deep links/share/import boundaries, background and screenshot exposure, keyboard and notification tap routing | Generated manifest review and actual allow/deny permission/device tests OPEN |
| CODE | Lockfile/SDK/dependency inventory, inputs/URI/JSON validation, updates, release debug/logging flags and secrets | Gitleaks/OSV executed with findings; native dependency/SAST/compiled APK analysis OPEN |
| RESILIENCE | Risk-based integrity/tamper/debug exposure assessment of signed artifacts; no unsupported security claims | Debug simulator inspected; release binary tamper/debug assessment NOT RUN |
| PRIVACY | Data minimization, dietary/photo disclosure, deletion/export, consent, analytics SDK declarations, privacy labels and URLs | Charter/draft evidence only; full actual-behavior/store disclosure reconciliation OPEN |

## App Store / Play Store readiness checklist
| Gate | Status | Required acceptance evidence |
| --- | --- | --- |
| Core native CRUD/Save/Cancel/Return and offline | OPEN; parent/SB56–58 own | Exact app/build/device/source IDs, final assertions, screenshots/logs and restart/reconnect results |
| Both-platform responsive accessibility | OPEN | Landscape/XL/light-dark/scroll/contrast/targets/VoiceOver/TalkBack on actual builds; keyboard and focus behavior |
| Native notifications | OPEN | Permission allowed/denied, scheduling/delivery/tap route, linked vs detached, foreground/background/relaunch/reboot |
| Authentication/data deletion/privacy | OPEN | Disposable emulator auth native lifecycle; real implemented deletion/export and honest policy |
| Security/dependencies | FINDINGS / NO-GO | Triaged advisories/restrictions, remediation verification and compiled distribution artifact checks |
| Purchases/restore/trusted entitlements | BLOCKED | Store products/verifier, native sandbox transaction and lifecycle evidence; no live billing |
| Signed artifacts | BLOCKED | Team-signed distribution IPA/archive and signed AAB, provenance/hashes, permissions/SDK/privacy manifests |
| Assets/metadata | NOT VERIFIED | Approved branding/icons, native current screenshots, descriptions/age ratings/support/privacy URLs/data safety labels |
| Store review credentials/demo | NOT VERIFIED | Review path coherent with privacy and account access; no production test fixture injection |
| Final physical iPhone and release approval | OWNER PENDING | Owner final iPhone acceptance and explicit release GO; separate Google/Apple approvals if needed |

## Next independent tasks
- Engineering lane: remediate timeline/navigation/native functional failures; preserve security evidence as baseline.
- Security lane: map advisory IDs to dependency paths and reachability; prioritize EC functions uuid; propose compatible reviewed updates, then rerun OSV/history/source/compiled checks.
- Release/docs lane: assemble source-traceable policy, metadata/assets and generated-manifest checklist without store submission.
- Native lane after functional candidate: orientation/accessibility/notification and final artifact acceptance; continue SB56/SB58 independently.
- Billing lane: implement verified sandbox store integration within approved product contract, preserving free existing-data access.
Owner action remains only genuine product decisions/physical-iPhone and final release approval. Routine remediation requires no additional checkpoint.

## Focused dependency triage — EC functions uuid
OSV advisory GHSA-w5hq-g745-h8pq is database-rated MODERATE; summary concerns missing buffer bounds checks in uuid v3/v5/v6 when an output buffer is provided. Advisory fixed ranges include11.1.1,12.0.1,13.0.1. functions/package-lock.json resolves uuid9.0.1 through gaxios6.7.1 (^9.0.1), google-gax4.6.1 (^9.0.1) and teeny-request9.0.0 (^9.0.0).
Read-only installed-source review found these immediate dependents call v4(), without an output buffer: gaxios/build/src/gaxios.js:417, google-gax/build/src/util.js:108, teeny-request/build/src/index.js:135. This is evidence of lower immediate reachability for the advisory's named v3/v5/v6 paths, **not a global non-exploitability or remediation claim**. Review the complete deployed dependency graph and input paths, then prefer compatible upstream SDK updates; a major uuid override may violate dependency ranges or module expectations. No dependency change or suppression made.
Primary advisory source returned by scanner: https://github.com/github/advisory-database/blob/main/advisories/github-reviewed/2026/04/GHSA-w5hq-g745-h8pq/GHSA-w5hq-g745-h8pq.json .
