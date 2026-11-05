# WORK-SB47–50 preflight and live Figma findings
Date: November 4, 2026, America/Chicago. Execution: FA-MAC-DEV-01 only through AI Commander. No Windows dispatch. Ollama remains retired.

## Preflight
Master charter, product charters, required Mac design/efficiency instructions, dual-app release SOP, November 4 return and running ledgers read. Current owner/master amendments supersede historical Windows/Ollama instructions. Responsibilities retained: product/project, technical, event-domain, iOS/Android, design systems, accessibility, security/privacy, reliability/cost, QA/release, research.
Mac host and desktop user verified; external FA-Development mounted and writable, approximately 1.6 TiB available. Starting checkouts clean at CD 582e3a934d8619413bb5b05d9e40022b465637d9 and EC 697801a819de6c4e7aba207af1f3d4c6e31d71b2. Matching GitHub branch heads verified using the github remote. origin is a local intake bundle, not the hosted remote; all publishing must use github. Older dirty CasitaDex candidate preserved.
Four independent file-ownership lanes: source/design inventory, CD regression preparation, EC emulator/scenario tests, release/security matrix. Parent owns live Figma evidence, status and return report. No competing simulator jobs started. EC suite used dedicated 18449–18452 ports and demo-fa-sb49; emulators shut down normally.

## Live authority and scope
Read-only Figma session 6b4653dc-9020-44da-b223-3cc189338d13.
- CasitaDex file 39uzN0SZX8nlmcGDcHdQhr: 25 functional/platform/accepted/review pages, 5,652 frame/text/component/instance rows.
- Event Command file WJCubVKVgPUH8kqa6aJ1gi: all 9 pages, 1,803 rows.
Complete retained JSON includes exact page/node IDs, names, parent relationships and text. Prototype reactions/layout retained where available; large-page chunk reads contain basic identity/text only. This is structural/text inspection, not pixel-level or native acceptance. Historical artwork/exploration and token/library pages outside these selected CD functional pages are not represented as audited current screens. No canvas mutation, paid generation or library publication.

## Design/source discrepancies and actionable acceptance
| Task | Evidence | Implementation and acceptance |
| --- | --- | --- |
| CD-P01 Edit actions | 257:48/257:73, dark 260:221/260:274; current EngDetail | Reconcile fixed top Save/Cancel against tested bottom Save. Preserve exact-title persistence pass; rerun keyboard/XL/landscape Save/Cancel/Return after code changes. |
| CD-P02 Viewer | 257:98/257:112, 263:226/263:260; PhotoViewer source | Reconcile preserved candidate before implementing missing next/previous/swipe/pinch. Five images must retain order, close origin and relaunch integrity. Zoom buttons alone do not satisfy gesture navigation. |
| CD-P03 Notification integration | 86:103,90:180,276:2; standalone reminder adapter | Current branch lacks scheduler modules and expo-notifications dependency found in historical candidate. Review/reconcile source provenance; verify permission allowed/denied, linked vs detached delivery, tap routing, timezone/reboot and completion. Stored date is not delivery. |
| CD-P04 Simplicity drift | 271:2/271:27 change register vs current Home/form/Find | Remove/reconcile legacy Home reminders, draft options and Answer terminology against approved owner decisions; top/bottom paging, taxonomy ordering and action reachability need native verification. Do not silently adopt older approved-looking frames over later owner decisions. |
| CD-P05 Taxonomy Cancel | source audit EngDetail/EngAdd and store | Specify whether create/rename taxonomy survives memory Cancel; document separate writes, protect existing data, test recovery. |
| EC-P01 Guest durability | 104:39/104:60; GuestsScreen/saveGuestDetails | Native keyboard-open Save/relaunch, blank/0/21/fraction validation, failed write retaining draft, viewer denial; preservation/rules tests passed only at emulator level. |
| EC-P02 Timeline full payload | 104:207/104:228 activity start/end, 110:116 | Compare full requested payload on retry/readback; define clearing optional end time. Add edit controls for promised fields, stable-ID reorder and recoverable retry. Verify same-time activities and offline behavior natively. |
| EC-P03 Draft navigation | 68:36 contract, App.tsx conditional tabs | Guard tab/event/account navigation for dirty forms; assert Cancel/Return semantics and no cross-event writes. |
| EC-P04 Wedding scale | 103:110 search/filter/virtual list; GuestsScreen ScrollView | Profile actual 1,000-row native list; implement virtualization if needed with accessible search/focus/scroll preservation. Domain/emulator timing is not UI performance. |
| EC-P05 Budget/vendor completeness | 104:123/144,104:165/186 | Verify cents in display and input, vendor edit/payment lifecycle and permissions; current creation/readback is not complete financial workflow. |
| EC-P06 Collaboration | 107:116/136 explicitly functional candidate | Implement/authenticate invitation, accept/revoke and scope lifecycle before acceptance. Do not send real invitations during QA. |
| EC-P07 Billing |111:37/53/69,115:36,116:36; both configured=false gateways | Implement sandbox native stores and trusted verifier under approved lifetime CD/per-event+annual EC policy. Never grant from UI or untrusted receipt. |
| BOTH-P01 Accessibility | CD279:38/280:114/289:29; EC10:12/44:105/45:104 | Native large text, landscape, both appearances, focus, names, target sizes, reduced motion and VoiceOver/TalkBack. Visible text assertions cannot establish assistive support. |
| BOTH-P02 Privacy/release | source inventories and SB50 matrices | Complete lifecycle/security/privacy/assets/signing gates; owner physical-iPhone and release approvals remain open. |

Exact source control IDs, source lines, handlers, validation/data calls, route references and accessibility/disabled state are in WORK_SB47_SOURCE_*; live Figma IDs/text in WORK_SB47_FIGMA_INVENTORY.json. Crosswalk records screen-family matching separately from exact-control verification. No inference of approved prototype implementation or native PASS.

## Current research basis
Checked official sources November 4:
- https://developers.figma.com/docs/plugins/api/Reaction/ — prototype reactions require explicit actions; frame text is not functional wiring.
- https://developers.figma.com/docs/plugins/api/node-properties/ — node identity/layout/reaction metadata supports traceability, not native behavior.
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria — test every supported text size including accessibility sizes before disclosure.
- https://developer.apple.com/design/human-interface-guidelines/accessibility — adaptable, perceivable controls and platform assistive behavior require verification.
- https://m3.material.io/foundations/ — shared tokens/layout/accessibility foundations; do not treat a design-system label as acceptance.
Installed MCP skill/API guidance read. No subscription, limits, paid features or plan changes invoked. SB50 includes current store/security references. Remaining uncertainty is native visual/state behavior, not resolved by metadata.
