# CasitaDex current Figma reconciliation
2026-11-06 UTC. REVIEW ONLY. No master promotion or new native/owner acceptance.

## Delivered
- [Review board 334:120](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=334-120).
- [Memory Detail 334:121](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=334-121): action region 334:124, content region 334:132.
- [Edit Memory 334:178](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=334-178): action region 334:181, content region 334:189.
- [Share Memory 334:256](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=334-256): action region 334:259, content region 334:267.
- [Authority, differences and acceptance notes 334:321](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=334-321).

All new frames are on existing page 321:2, positioned clear of prior artwork at x1600. Detail/Edit/Share are editable SF Pro text, Auto Layout, controls and linked navigation/icon instances, not flattened screenshots. Existing navigation component 321:125 and icon masters are reused. Existing paper/card variables are bound in Light mode; current source-specific ink, muted, primary and border colors are scoped overrides, not changed global tokens.

Final screenshot files and SHA-256:
- casitadex-detail-edit-share-review.png: 965ad82ef705102959a722155d997051e81979fef4236d07c161880772f2caa2.
- casitadex-reconciliation-notes.png: fe631fb9d1100de9fb819825bcff62e4eeb8fdc1559964c67584ff50fafdce00.

## Authority and provenance
The owner-provided Home reference was viewed as actual image pixels. SHA-256 812fff4b81e6e3b4cc53d06b2dc9885aa358757ceda802f7c8082e7e3be06876. It establishes current Home / Photos / Reminders / Find chrome and warm Home direction, not a new blanket Detail/Edit/Share approval.

Mac-only source read through AI Commander at Development/CasitaDex/app: initial clean docs HEAD 75e93e6, subsequent clean 5dc930e280b43e9ffe5553a8c5c63fc6aa86eacb. Runtime reference supplied by coordinator bb235cdf. Source files read: src/action-page.tsx, src/action-page-layout.ts, src/ui.tsx, src/theme.ts, src/app/_layout.tsx, src/eng-screens.tsx and SB121_DETAIL_SHARE_SOURCE_PARITY.md. The current focus controller repair remains outside this review's acceptance.

Retained normal iOS evidence at QA-Evidence/WORK-SB121/ios-detail-share-737eac1/native:
- 21-clean-detail-audit-ready.png/json
- 22-edit-audit-ready.png/json
- 23-share-audit-ready.png/json

Actual pixels of those three PNGs were inspected in Preview through remote_screenshot, after coordinating desktop availability. Only those exact QA documents were closed. The owner reference and simulators were untouched. Native evidence remains attributed to 737eac1, not borrowed as current bb235cdf acceptance.

## Reconciled structure
402×874 source-derived review viewport; top safe area 62; bottom navigation 105. Detail actions 126/content 581. Edit and Share actions 142/content 565. Native 737 JSON had Detail 126/content 581 and Edit/Share 142/content 564; the 1pt content variance is retained as review geometry, not exact pixel parity.

- Four tabs only, Find selected for all nested routes. No Memories fifth tab.
- Detail Back/Edit, Edit Cancel/Save & return to details, Share Memory details/Share selected details.
- Separate vertical action/content scrolling; action max 282pt is floor(707×0.4) for this viewport.
- Content-driven text/control heights. Long single-line editing values truncate visually like current TextInput rather than implying a multiline field.
- Share is separate, opt-in optional details/photos, default preview and Cancel below fold.
- Source normal action columns are represented. Large-text stacking and dynamic viewport changes are documented, not newly certified.
- Existing synthetic QA text is reused; no user household record was edited.

## Explicit differences and unresolved authority
Historical accepted Detail 263:2 and Edit 263:120 are dark, five-tab, absolute layouts. Share 257:126 differs in header and old selection presentation. Do not overwrite current source or owner Home by copying them wholesale.

Preserved nodes: Home 321:36/321:163, Detail 263:2/actions 263:44, Edit 263:120/actions 263:153/content 263:128, Share 257:126/257:152, workflow 267:2, registers 271:2/271:27. Only new 334:* review content was mutated. Existing masters and component definitions were untouched.

Historical differences for review, not newly established release blockers:
1. Current nested source screens omit branded date header. This is recorded, not newly approved.
2. Back versus historic Back to results depends on actual navigation origin; cold entry uses Find memories.
3. Source light ink #18382F/muted #52645C/primary #245C47/border #718377 differ from old master semantic values.
4. Historical SB37 register calls for compact photo thumbnails; source displays large photo panels. This is chiefly presentation density, with no functional defect observed in this lane.
5. Register calls for searchable, bounded Space/Category selectors adjacent to values. Source detail displays values; edit uses inline label buttons and creation controls. This differs from the historical selector pattern. High-volume and large-text reachability would require separate evidence before claiming a functional failure.
6. Normal source action wrappers use equal columns; older 737 Detail screenshot has unequal Back/Edit widths. This review uses current source columns.

### Current authority classification
The historical SB37 registers are titled APPROVED and the workflow describes those patterns. This lane found no current owner instruction specifically reaffirming compact thumbnails or searchable bounded selectors under the latest four-tab baseline. Their mandatory current acceptance status is NOT ESTABLISHED. Do not turn these historical differences into new release gates or change frozen source during exact native qualification. Existing functional, accessibility and owner-acceptance gates remain separately owned by the coordinator.

## QA and limits
PASS: actual owner PNG inspected; old authority/source inspected; editable review composition; final rendered board and notes visually inspected; independent scroll regions; four labels and selected Find; no master mutation.

NOT VERIFIED: latest focus-after-rotation controller; current keyboard/max-text/landscape geometry; dark mode; Android visual parity; manual VoiceOver/TalkBack; full product-state/prototype matrix; owner physical-iPhone acceptance. Release remains under coordinator's NO-GO gates. These visual reviews do not perform save, cancel, sharing, persistence, permissions, notification or data actions.

The first construction call hit unsupported instance minHeight and made no retained review nodes (canvas inspected before retry). Corrected construction then exposed fixed 1pt text sizing; those new review-only text heights and horizontal row sizing were repaired. Final screenshots passed visual inspection. No failing intermediate image is the delivered artifact.

## Governance
Read F&A professional governance, current master/product charters, mobile-design and tool-efficiency skills, Figma use/design/design-to-code guidance and existing same-day reconciliation reports. Current master supersedes older Windows/Ollama assignments; Ollama remains retired. Product/owner authority, design mapping, engineering source, accessibility/native QA, privacy/security, reliability/cost and release acceptance remain separate.

Official research reused from same-day valid report, not a new exhaustive research run:
- https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://m3.material.io/foundations/accessible-design/overview
- https://reactnative.dev/docs/0.86/accessibility
- https://developer.apple.com/videos/play/wwdc2023/10035/

Apple/Material full-content JS limitation remains. No paid generation, new library publication, source/build/device changes or production action.



Review source report SHA-256: d58140a6007032eaa466662ed5369863a8d11b32bc8160a81a233b85730908b0.
