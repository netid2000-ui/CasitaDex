# WORK-SB121: recovered current Home and navigation

November 6, 2026 UTC. Mac mini only. **Source/test PASS; native acceptance NOT RUN; release NO-GO.** Reviewed source candidate; native qualification remains pending.

## Authority and correction
- Owner reference: `QA-Evidence/WORK-SB121/owner-visual-reference/IMG_0758.png`, SHA256 `812fff4b81e6e3b4cc53d06b2dc9885aa358757ceda802f7c8082e7e3be06876`. Actual image pixels inspected on the Mac before edits.
- The reference confirms Home, Photos, Reminders, Find; horizontal original house mark and wordmark; Home Settings; Find a Memory before the three create actions. The owner was correct.
- The four-tab implementation existed in preserved, dirty `figma-first-native-qa` at `d9fde466c76fab9212d881cbeb2e033aea95ab2a`, outside the authoritative branch. Its worktree status and selected source/asset hashes are unchanged.
- The November 4 four-tab acceptance statement was incorrect: the browser test clicked four labels without asserting the total. The source still declared five tabs, and its unit test explicitly required five. The old browser success was not four-tab acceptance. The historical report is annotated below, not silently rewritten.
- The separately recorded Android Development artifact `89a201dd5808dd07fd4eba32fb6d3623988c81b827830932152011e2c4a7c828` matched the five-tab source snapshot `9fd52ae1fac7d38babb57b393acebd426d830159`. Matching GitHub did not establish current design parity. Its bounded save/cold-restart evidence remains historical; newer UI acceptance and actual notification delivery were not established.
- Frozen scheduled iOS runtime `c2d123977b5fff3c20e695070340a90b2d4b6e1c` is intentionally older and was not changed.

## Bounded reconciliation
- Selective presentation recovery from `FigmaHome.tsx`, `HomeActionCard.tsx`, `tokens.ts`, `brand.tsx` and four-tab layout. No bulk source, store, package, lockfile, backup, media, reminder pipeline or guard replacement.
- Exactly four primary destinations in approved order. Memories remains reachable through Browse all memories in native Find and Settings; its screen and data behavior remain intact. Find is selected for its browse/detail routes.
- Original horizontal logo artwork copied unchanged, with real wordmark text. Original SVG/source/raster hashes and Brand Master nodes are in the manifest. Existing newer transparent outline icons from `6069d6f` remain byte-for-byte unchanged; older source icon copies were not adopted.
- White header, cream Home, gold Find/photo/reminder actions, green Add Memory and separate Settings gear follow the recovered source. No broader screen redesign.
- Retained loading/draft disable guards, Resume/Delete confirmation, guarded tab navigation, reminder response deferral and all newer data behavior. Disabled copy now distinguishes native-only web availability from an existing draft.
- Deliberate accessibility adjustments: full uncapped date instead of reference clipping; header stacks for narrow/enlarged text; Home remains scrollable; controls have flexible height; app-large text scales Home copy; 48-point Settings target; wrapped tabs use two rows of two. Brand exposes one accessible image with decorative descendants hidden.

## Evidence and verification
- Base: `7e60b138c8e620e7c318d5b622fb66da0a6eec1d`, branch `work/cd-sb41-edit-targeting-20261104`.
- Frozen source/test/asset fingerprint: `8b14277537d22f5895eeebf9ab6f0c8e1f7471884c6814c66ae16eed56b67412`. Per-file hashes and unchanged lockfile fingerprint: [manifest](SB121_CURRENT_HOME_RECONCILIATION_MANIFEST.json).
- Current screenshot: `QA-Evidence/WORK-SB121/current-home-reconciliation/current-home-web.png`, SHA256 `60e0af7a018ecf389816ec590dd67459d72c2447ef3d0aa7a7285fa43fe667c5`. Actual pixels independently inspected by implementation and independent review. Correct composition and outlined icons visible.
- Web is intentionally not native ENG. Native memory actions remain disabled and native-only status is visible. The screenshot proves layout/brand/nav only. No web route was changed to emulate native.
- Web export: `npx expo export --platform web --max-workers 2 --output-dir <evidence>/web-dist`, exit 0. Existing browser test supports `CASITADEX_WEB_ROOT` to serve that exact output on loopback and `CASITADEX_SCREENSHOT` to capture Home, then closes its server.
- Browser PASS: exact total/order/labels, four Home action labels, single accessible brand, mobile fit, tab routes, Home Find/Settings, Settings Browse, native-only editor boundary and no page errors. Native Find Browse is component-tested, not browser-qualified.
- Focused PASS: 34/34 tests across Home reconciliation, tab accessibility, reminder response routing and accessibility feedback. Full PASS: 415 tests, 410 passed, 5 existing skips, 0 failed. Typecheck and lint PASS.
- Logs remain in `QA-Evidence/WORK-SB121/current-home-reconciliation/`; manifest records SHA256s. No raw owner image, desktop screenshot, private chat or QA binary is committed.

## Remaining gates
One bounded corrected native candidate followed by normal/large text, dark/light and native route/guard acceptance on emulator/simulator. Physical phones remain gated behind complete required virtual testing. No native build or device action, production change, purchase or credential operation occurred during this reconciliation. Verified source publication is separate from native acceptance.

## Editable design reconciliation
The bounded new Home review frames preserve old masters and the owner-reference changes: [Apple Home](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=321-36) and [Android Home](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=321-163). They remain REVIEW, not extra owner or native acceptance.
