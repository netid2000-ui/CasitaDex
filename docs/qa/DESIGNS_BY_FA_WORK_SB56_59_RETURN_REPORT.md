# DESIGNS BY F&A — WORK-SB56–59 RETURN REPORT
November 4, 2026 (America/Chicago) · FA-MAC-DEV-01 via AI Commander

## A. Executive summary
Event Command advanced from first-use smoke to actual isolated native Auth/Firestore/Functions proof, authenticated event creation/relaunch, native guest creation and keyboard-open edit/save/return/relaunch with exact data preservation. Native guest dirty-form protection also passed. Run of Show now verifies full payload, handles optional end clearing and same-time ordering, and preserves ambiguous request identity during retry. One native timeline activity was saved and read back; the original post-Save viewport failed to return to the row. A targeted correction is committed and its final native result is recorded below.
CasitaDex passed native Edit → Cancel → Details → Relaunch on the accepted synthetic fixture. Source now supports ordered viewer navigation, swipe and pinch/zoom; unified linked/standalone reminder scheduling projection is tested, but not integrated with a native scheduler. Original and fresh disposable CD simulator tests failed at driver startup. Existing app/simulator data preserved.
Security scans, MASVS checklist, scale-emulator reruns and release evidence updated. **Both apps remain NO-GO.** No production/staging writes, live billing, store submission, deployment, merge, simulator reset or reinstall over an existing device.

## B. Super-batch outcomes
| Workstream | Starting point → work/result | Acceptance and remaining defect |
| --- | --- | --- |
| SB56 | Previous first-use only → native local correlation, create event/relaunch, create guest, reject0, keyboard-open Save and exact readback | Bounded iOS PASS; native Android/multi-role/offline/notification gates open. |
| SB57 | Partial timeline readback, unsaved form loss, undated schema mismatch → full payload/retry/order/end clearing, navigation guards, canonical Timestamp + undated schema | 121/121 domain,9/9 routing,6/6 canonical callable/rules PASS; native guest nav PASS. Timeline native Save/Return and two same-time rows after relaunch PASS after correction. Full native edit/Cancel/retry and broader modules open. |
| SB58 | Prior bounded Edit Save only, viewer and linked reminders gaps → native Cancel PASS, bounded viewer code, unified reminder planner | 31/31 viewer/media tests and11/11 overlapping final projection/viewer tests PASS, focused lint/typecheck PASS. Photo/attachment driver BLOCKED on both devices; native scheduler absent. |
| SB59 | Existing readiness matrices → source+history secrets scans, dependency root/functions scans, checklist and fixture reruns | 10/1000 emulator2/2 PASS, billing safety CD1/1 EC3/3. Actual purchases/restore, distribution signatures, privacy, accessibility, native scale remain open. |

### Changed files and reusable evidence
- EC isolation: App.tsx, nativeFirebaseEmulatorQa.ts, nativeQaEndpointPolicy.ts, NativeFirebaseQaRoutingGate.tsx, emulator-only Functions proof, EventSelectionGate stable field ID and keyboard taps, four SB56 Maestro flows, local fixture inspection and proof tests.
- EC functional: MoreScreen, timeline editor/adapter/projection/provider/model, Guest/Task/Budget/shell/event/account navigation guards, policy tests, canonical callable/rules/isolated runner, five SB57 Maestro flows. Return correction in a separate commit.
- CD: Eng screens, photo-viewer-state, reminder-notification-projection and corresponding tests; additive SB58 flows and manifests. Prior accepted tests unchanged.
- Both: WORK_SB59_RELEASE_SECURITY_EXECUTION_20261104.md + sanitized JSON, updated RUNNING_SUPERBATCH_STATUS.md with original9 batches, original6 milestones and appended workstreams.

## C. GitHub evidence
| App | Repository and branch | Start SHA | Implementation end and commits |
| --- | --- | --- | --- |
| EC | netid2000-ui/event-command-by-fa · work/ec-sb36-keyboard-save-20261104 | f59f255b99f914760742b3e9fe1a23113ea0dd8e | 4a7eefbf7944b244e1550e21efcd323af143d3e1 isolation/functional/schema; aec97624128b0592645ba6e8882e38af3400cc2a timeline Return correction |
| CD | netid2000-ui/CasitaDex · work/cd-sb41-edit-targeting-20261104 | 8c3fbfa55376ef0a4cfd7dc8075021f1d453977d | 2e56fc0a272fd20446bb381fcb0647a2b0f9fc1e viewer; 93d9414e02aebebc9aa4cb2531dab31bf3358e69 reminder projection |

The final documentation commit contains this report; its own SHA, hosted readback and worktree status are in the command-center message. Hosted remote github; origin is local intake. Both branches remain unmerged. Detailed changed code: https://github.com/netid2000-ui/event-command-by-fa/commit/4a7eefbf7944b244e1550e21efcd323af143d3e1 and https://github.com/netid2000-ui/CasitaDex/commit/2e56fc0a272fd20446bb381fcb0647a2b0f9fc1e .

## D. Native and test evidence
EC iOS27.0 simulator100BBCE2-5DB6-4EAD-8C31-1ED478EB537C. Installed com.designsbyfa.eventcommand, dev Firebase event-command-fa-dev, v0.1.0/build1, SDK iphonesimulator27.2/Xcode27B52, installed executable hash96eb84b3ba33c5d2df1f5afd294be9af7dfa975918224b859603717f8b96bff1. Debug simulator signature only. Metro8084/IPv4 bridge, Auth19099/Firestore18080/Functions15001; exact callable nonce + server-only document verification and matching local Auth UID.
- Routing e4b5a449fd7c1abe exit0; event create/relaunch a53cee773a840245 exit0; guest create0a0d1a9d906268dc exit0; guest validation/edit/relaunch0afca425f3cd4357 exit0.
- Guest pre-Save screenshot inspected: numeric keyboard open and Save above it. Server fixture exact name FA SB56 Guest Edited/party3/attending/Fictional nut allergy; original guest ID retained.
- Guest guard native first flow of4545cc0ff7d51bc9 passed Switch event and Tasks Keep editing/discard/relaunch; combined job failed second timeline flow. Do not mark combined job PASS.
- Timeline bf82bab8feddbe56 exit1 after Save: persisted FA SB57 Native Arrival, exact UTC start, order0 and stable ID; post-Save row not visible. Return correction aec9762. Final committed-source rerun job58d8f9b5565b5432: **PASS**, exit0: form closed, “Activity saved” visible and new row reached. Job b8b54105ddde67b8 exit0 verified two distinct stable IDs, equal start, orders0/1 and both rows after native relaunch..
- Integrated typecheck/domain121/121, routing9/9: job00f1ad74b7006a16. Canonical real callable/Admin SDK/candidate rules6/6: job290cf52bd6068c15. EC lint command exit1 missing script/config, no lint PASS.
- EC raw artifacts /Volumes/FA-Development/Designs-by-FA/QA-Evidence/WORK-SB56 and WORK-SB57; screenshots, hierarchy/logs and before/after emulator JSON. WORK_SB56_NATIVE_EVIDENCE_20261104.json and WORK_SB57_NATIVE_NAVIGATION_EVIDENCE_20261104.md provide paths and provenance.

CD original iOS27.0 simulator879C620A-5318-4BDF-98B9-904EE635B053; fresh disposable8FA03782-311F-4B4A-B529-1F63D7E9AEF3. com.designsbyfa.casitadex.dev v0.1.0/build1, SDK27.2, executable b2b2217c46b10f38207d92826cc7149e4c6cd489508898ed769e7d998e634ae4 and dylib64759bbae40cb74524dc797cdf8a4b282289ae0809a58624964d73dbca945380 matched. Existing Metro8081 PID1580 preserved.
- Cancel → Details → relaunch PASS job5634f22b15f92b5c exit0, original title/answer preserved. Original accepted Edit Save pass carried forward separately.
- Original photo driver failures a7b64d5161e137a2 and988c2d0dc219a66c before app commands. Fresh boot/install PASS, synthetic addmedia hung; only owned import terminated, sample outcome unknown. Fresh launch timeout exit142 and Maestro driver timeout job687e2a6ab6296cf6 exit1 before steps. No new CD draft/photo/relaunch PASS. Viewer/attachment and notification delivery remain blocked.
- Raw artifacts /Volumes/FA-Development/Designs-by-FA/QA-Evidence/WORK-SB58-20261104; hashes and logs in WORK_SB58_EVIDENCE_20261104.json. Native accessible screenshots limited to inspected current Edit/Details; screen-reader, XL, landscape, light/dark, offline and Android NOT ACCEPTED. No current verified Android serial/build evidence; no new Android jobs.

SB59: Gitleaks source CD0/EC2 and history CD2/EC4; extra history results are public Figma key fields, EC source results are client Firebase patterns requiring restrictions review. OSV CD root6, EC root19 and Functions1 package/advisory instances. Counts do not establish exploitability; scanner findings exit codes preserved. No signing, privacy, billing or security GO inferred. Scan/scale job e3c7ba1c938242ff, billing job208116bc00209caa completed. SB59 evidence manifests and release checklist provide scope, MASVS mapping, logs/checksums and acceptance status.

## E. Risks, reproduction and release impact
| Severity | Remaining gate | Evidence, cause or next action |
| --- | --- | --- |
| High | EC full timeline Return/edit/retry | Original native post-Save assertion showed Personalization instead of timeline. Scroll anchor correction passed native Save/Return, and both same-time rows survived relaunch. Verify full edit, optional clear and ambiguous retry. Crash-durable pending IDs still absent. |
| High | EC new-event final schema on native | Old native fixture created before Timestamp/undated fix. Real callable+rules6/6 passes. Create fresh undated event, rename/relaunch on committed candidate. |
| High | EC end-to-end missing modules/roles/offline | Basic guest/timeline iOS gates do not cover vendor/payment, budget cents, collaboration, document/account/data deletion, events offline, or native1000-row performance. Run complete fictional scenarios; triage each incomplete path. |
| High | EC notification keychain | Previous ERR_NOTIFICATIONS_KEYCHAIN_ACCESS missing entitlement; Expo ServerRegistration native Keychain queries and ad hoc empty simulator signature verified. Exact production cause not established. Verify generated entitlements/signed device and permission/local/APNs delivery without bypass. |
| High | CD native driver | Reproduce with photo or fresh create flow. IOSDriverTimeoutException before any commands; fresh simctl openurl times out despite installed matched binary. Stale own runners cleared; issue spans two CD simulators. Inspect host CoreSimulator/DevClient/XCTest, use a verified isolated bundled-JS candidate where appropriate, preserve old devices/data. |
| High | CD linked reminder delivery | No authoritative native Expo notification adapter. Historical candidate only projects standalone rows, so copying it leaves MemoryV2.due unscheduled. Integrate tested unified projection with explicit time/capacity/permission policy and native delivery, reboot, cancel/reschedule tests. |
| Medium | CD photo replacement order | Display follows media manifest order while replacement preserves memory mediaIds slot but can append manifest entry. Use mediaIds ordering and verify replace/Next/Close/relaunch before native acceptance. |
| High | Accessibility/platform parity | EC current app config and simulator plist portrait-only; landscape Figma contract unresolved. No VoiceOver/TalkBack or Android parity claim. Verify native accessibility and responsive orientation before privacy/store disclosures. |
| High | Security/signing/billing/store | Dependency triage, key restrictions, generated privacy/permissions, assets/distribution signature and unconfigured purchase gateways remain open; sandbox lifecycle not run. Separate owner final physical-device/release approvals. |

## F. Coordinator and resources
Read current charter/product decisions/local design and delivery guidance/AGENTS/release SOP and prior reports; verified Mac/SSD/branches and jobs before action. Design authorities reconfirmed read-only (EC104:207/110:116, CD257:98), retained SB47 maps. No canvas edits; exact native visual parity remains open. Existing Windows jobs left alone; no Windows dispatch, Ollama, cloud builds or heavy native rebuilds. Source/schema/security work overlapped, while host driver use was serialized once CD contention appeared.
Existing EC infrastructure preserved: d51916054011b48a isolated emulators,487b546db6e51610 Metro8084,da70fc9b27571e7b same-port IPv4 bridge; older f52d28a02cfa909a/36c05a0616c50004 relays,c22fe3e4fac069c0 Metro8083,a5fb87f5d3cba1a5 prior emulators. CD Metro8081 pre-existing. Do not stop these without ownership review. Both temporary SB49/SB57 test emulator jobs exited/shut down. Final EC same-time relaunch completed exit0; CD native test attempts exited. No new test/build jobs remain. Own failed CD orphan PIDs33024/35613/39438 and fresh synthetic import38308 were scoped/verified and terminated; no system service or existing job stopped. No unattended execution is claimed.

## G. Next work, in dependency order
1. SB60 EC native functional closeout: build on verified timeline Return/same-time relaunch; exercise full edit/clear end/cancel/retry and fresh undated create/rename, and native roles; preserve disposable fixture and use proof gate. Then complete event-day and 10/1000 native performance/E2E.
2. SB61 CD independent native recovery: isolate host driver issue and run already-prepared fresh fixture/viewer/offline/responsive flows. In parallel wire notification projection into reviewed native adapter, add ordered replacement behavior and validate linkage and delivery.
3. SB62 platform parity: qualify Mac Android or independently authorized verified QA device/artifact, then light/dark, XL, landscape, scrolling, VoiceOver/TalkBack and both apps’ native journeys. Preserve physical-iPhone owner acceptance.
4. SB63 release: triage/retest dependencies and client keys in parallel; sandbox-only StoreKit/Play entitlements, privacy/assets/signing and final acceptance after functional gates. No release GO until evidence.

## H. Owner action
None required for routine development or further isolated QA. Final physical-iPhone acceptance and explicit release decision are reserved for the owner when verified candidates are ready.

**RETURN HANDOFF — DESIGNS BY F&A COMMAND CENTER**
Resume the same feature branches at the hosted heads in the final Work response. Use the above native and emulator evidence without rerunning passed bounded journeys unless affected by source/build changes. Preserve active services and original simulator data. Both apps remain NO-GO. Paste the final handoff into the original command-center conversation; it is not transferred automatically.
