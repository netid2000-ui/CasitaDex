# SB26-SB27 consolidated checkpoint — 2026-10-20

## Reverified
- Primary source at HEAD 0814c04, branch acceptance/eng-review-20261019; prior owner-modified files preserved.
- TypeScript and ESLint both PASS.
- Regression PASS: 328 tests, 321 passing, 0 failing, 7 skipped. Log C:\cdr\sb26-regression-recheck.log.
- Reconciled tests/config.test.mjs with approved Expo EAS CasitaDex project ID, while still rejecting cross-app Event Command identities, private keys and Firebase dependencies. No Production profile.
- No commit, push, deployment, paid build or device reset.

## Existing prior evidence (not rerun here)
- 90 fictional sample memories, saved and draft photos, reminders, full v4 export and disposable restore tested.
- Android enlarged font, accessibility hierarchy and TalkBack service/labels sampled; spoken auditory acceptance OPEN.
- iOS archive source inspection PASS but real CasitaDex iOS simulator build blocked by EAS Free quota until 2026-11-01.
- LT1 host GPU emulator cold launch about 9–11 seconds; not a finished performance optimization.

## Remaining gates
1. SB25 requires owner's separate storage-policy scope/numeric thresholds decision. Global alerts and permanent purge stay disabled.
2. SB26 complete spoken TalkBack, real visual pixel/contrast/truncation testing, and independent SDK network disclosure review.
3. SB27 resume iOS simulator build only once credits reset; do not upload proprietary build to Appetize or physical-device labs without separate authorization.
4. Store: release signing, vendor privacy disclosures, owner-approved privacy/support URLs and store media, real-device acceptance.

## Efficiency
Bundle TypeScript, lint, full regression and source-level QA in fewer checkpoints. Use Tailscale Taildrop plus SHA256. Keep accepted AVD fixtures intact. No redundant EAS build retries or paid lab activation.

## Follow-up consolidated batch — current IA and accessibility contract
- Reviewed existing tests/accessibility-smoke.cjs: Playwright smoke assumes obsolete 4-tab Home/Find/Add/More navigation and example HVAC filter, so do NOT claim it validates current 5-tab CasitaDex. Full browser accessibility/visual and native spoken acceptance remain OPEN.
- Added tests/sb26-ia-accessibility.test.mjs with three source-level regressions: exactly the approved Home, Memories, Photos, Reminders, Find route labels, tab accessibility role/selected state; all three Home creation actions; accessible photo Close/Zoom in/Zoom out labels. 3/3 PASS. This test is static and not a substitute for gestures/visual/human spoken testing.
- Reran full node --test suite: 331 tests, 324 PASS, 7 SKIP, 0 FAIL; evidence C:\cdr\sb26-current-ia-regression.log. Prior typecheck and lint PASS in this batch. Existing owner source and local data unchanged.
- No changes to application UI, protected test devices, release configs or policy values. No commit/push/deploy or paid credits.

## Next consolidated batch: modernized browser a11y test and privacy inventory
- Replaced obsolete tests/accessibility-smoke.cjs four-tab/HVAC browser flow with current five-tab Home/Memories/Photos/Reminders/Find navigation + selected-state checks, Home 3-action checks, horizontal clipping at 360px and reduced-motion browser context. Legacy script preserved locally C:\cdr\accessibility-smoke-legacy-20261020.cjs.
- New browser script parses successfully (`node --check` PASS); it is NOT runtime accepted: 8765 QA server not listening, and existing `dist/index.html` was generated 2026-10-16 before current UI. Do not run outdated dist to claim current UI acceptance; current web export/server and actual Playwright run remain OPEN.
- Latest consolidated `node --test tests/*.test.mjs`: 331 total, 324 PASS / 7 SKIP / 0 FAIL, log C:\cdr\sb26-batch-regression.log. TypeScript check exit 0; lint output has no reported errors but its combined prior remote command timed out before exit confirmation, so lint status in THIS batch unconfirmed (prior batch PASS).
- Read installed top-level npm packages; Expo/RN, document/image picker, file-system, crypto, async-storage present. Dependency inventory alone cannot certify SDK network behavior or Store privacy disclosures; actual native traffic audit remains OPEN.
- No release actions, cloud build attempts, proprietary archives transferred, AVD wipe or physical-device changes. Uncommitted owner files preserved.

## 2026-10-20 live current web a11y smoke
- Regenerated current local web export (`npm run export:web`) PASS, served via localhost only; updated tests/accessibility-smoke.cjs executed Playwright in Edge PASS.
- Found genuine web a11y omission: React Native accessibilityState selected did not produce aria-selected on browser tabs. Added explicit aria-selected={active} to five-tab Pressables in src/app/_layout.tsx. Verified actual selected state for Home/Memories/Photos/Reminders/Find, route navigation, and no horizontal clipping at 360px viewport. Native accessibilityState retained.
- Current web uses src/eng-runtime.ts engEnabled=false and legacy Home; browser explicitly records native Home Add Memory, Add Photo Memory, Add Reminder as NOT TESTED rather than silently claim them. Separate native/source-level tests cover actions. Full web parity should be a distinct approved scope if desired.
- Final live script output C:\cdr\sb26-web-a11y-final.log. Full node test suite 331 total, 324 pass, 7 skip, 0 fail; TypeScript PASS, lint PASS, web export PASS. No native APK rebuilt or iOS simulator run.
- Remaining: real TalkBack human spoken gestures, large-text pixel review, native SDK network traffic disclosure, iOS real simulator build, SB25 owner numeric policy. No commits/push/deployments or accepted-device data changes.

## Native disposable Android accessibility hierarchy follow-through
- Verified primary host emulator-5582 maps to CasitaDex_SB24_Disposable_20261020 (Android disposable), Android fully booted, font_scale=1.3, TalkBack disabled before/after; owner Samsung and accepted emulator-5580 untouched.
- App was already in native Document sleeves full-screen photo viewer. UIAutomator exposed Close photo, Zoom in, Zoom out accessible controls; tapped Close photo and confirmed saved Document sleeves photo entry plus all five navigation tabs.
- Navigated via accessible Home tab, confirmed native Home UI includes Add Memory, Add Photo Memory, Add Reminder and upcoming standalone reminder SB22ReminderFixture. Verified no Recent memories heading; existing unfinished draft SB22DraftFixture and 1 attached photo retained. No creation/edit/discard/restore performed.
- These are reliable native hierarchy and 130% font presence checks, not proof of visual truncation absence, spoken TalkBack audio or gestures. Network check attempted only via nonprivileged device dumpsys/proc endpoints; app-attributed SDK traffic not established, so privacy disclosure remains OPEN. No app data or connectivity settings modified.

## Disposable TalkBack activation and visual evidence — continuation
- Used ONLY primary disposable emulator-5582 (CasitaDex_SB24_Disposable_20261020), font_scale=1.3; no accepted emulator/owner Samsung interaction.
- Temporarily enabled com.google.android.marvin.talkback/.TalkBackService; Android dumpsys confirmed Enabled services. UIAutomator exposed Home actions Add Memory, Add Photo Memory, Add Reminder and all five navigation labels while service enabled.
- Captured unedited native 130% Home screenshot on primary C:\cdr\sb26-native-a11y-20261020\home-font130.png (135686 bytes). Screenshot captured but human pixel/contrast/visual review NOT claimed, nor spoken audio/gesture acceptance.
- Restored TalkBack settings accessibility_enabled=0 and enabled_accessibility_services=null on disposable afterward.
- Native manifest grants INTERNET and denies CAMERA at observed time. `dumpsys netstats` exposed broad device counters but not attributable CasitaDex SDK domain traces; do not claim zero network transmissions or privacy clearance.
- Remaining: human auditory TalkBack navigation/actions and visual screenshot approval, app-specific controlled network trace, SB25 policy signoff and iOS build quota gate. No accepted data, commits, push or release touched.

## SB26 native privacy evidence follow-up
- Identified Development app Android UID appId=10236 on the isolated emulator, INTERNET manifest permission granted and CAMERA not granted. `dumpsys netstats detail` listed uid=10236 once as a counter grouping only; output did not establish endpoint, transmitted bytes, timing or attribution to integrated libraries.
- Scanned first-party src TypeScript/TSX recursively for fetch(), XMLHttpRequest, WebSocket, http(s) URLs, expo-updates, analytics and telemetry. Only matching source line was explanatory no-account/no-cloud text in screens.tsx. This is static evidence, NOT proof of zero app/SDK/OS transmissions.
- Captured original 130% Home screenshot is held at C:\cdr\sb26-native-a11y-20261020\home-font130.png. Human visual pixel review and spoken TalkBack remain unaccepted; must not mark accessibility PASS beyond service/label checks.
- No network settings, packet capture permissions, protected emulator data, physical devices, source or build artifacts modified in this privacy follow-up. Recommend narrow network trace on isolated Development device with approved local instrumentation before publishing Privacy/Data safety disclosures.

## 2026-10-20 owner approval reconciliation and remaining human gates
- Rechecked authoritative docs/qa/SB25_STORAGE_POLICY_DECISION_20261020.md. It explicitly records owner 2026-10-20 approval: SB25 PASS in LIMITED DEVELOPMENT SCOPE for verified operation-specific app-available write guards. Global warning/critical thresholds, reserve and hysteresis disabled/deferred pending further calibration and separate approval; permanent purge, unknown-owner cleanup, trusted-clock deletion disabled. Previous consolidated notes calling the entire SB25 owner decision pending are superseded; DO NOT reopen this signed scope decision.
- Emulator-5582 confirmed disposable CasitaDex_SB24_Disposable_20261020; appId=10236. tcpdump absent, no pcap/capture/mitm package found in targeted list. `dumpsys netstats` UID grouping lacks domain/process attribution. Do not represent this as a passed privacy network trace; no root, VPN setup, installed capture package, device network reconfiguration, or user archive export authorized or performed.
- Human accessibility acceptance checklist: at 130% text inspect saved Home screenshot C:\cdr\sb26-native-a11y-20261020\home-font130.png for clipped text, button separation, contrast and overlap; on disposable Android with TalkBack enabled, verify spoken Home/5 tabs/three add actions, navigation order, Photos image description/zoom, Reminders, Find, backup affordances and focus return after dialog. Human spoken audio and visual review remain OPEN; automation-only label PASS is distinct.
- Non-blocking app/SDK privacy engineering next gate: authorize a bounded, local-only capture mechanism on disposable QA Android, establish UID and endpoints by first launch/photo/backup/reminder flows, redact URLs/tokens/test content and isolate OS/Play services. No privacy store claims before that evidence. iOS simulator still gated on EAS quota reset 2026-11-01.
- No source edits, commit, push, production changes, accepted-device modifications or paid credits this verification.

## SB26 next bounded QA planning and hierarchy follow-up
- Prepared docs/qa/SB26_LOCAL_NETWORK_CAPTURE_PROTOCOL_20261020.md, with disposable AVD identity checks, short idle/QA capture windows, private local-only evidence, OS/Play-service separation, and stop criteria. Android Emulator v37.2.12 supports `-tcpdump <file>` as host-side launcher option (verified via emulator -help); this is candidate for the NEXT disposable reboot, NOT a trace already performed. Do not silently restart emulator, install VPN/root CA, expose packet payloads or claim no data collection.
- On disposable emulator-5582 with accessibility disabled and font scale 1.3, native UIAutomator Home hierarchy had 67 nodes and 11 clickable nodes, each with nonempty direct text/content-desc label; display 720x1280. Automated label-presence PASS for this single Home state only; spoken TalkBack, real visual pixel and global navigation focus order remain open.
- SB25 owner approval for limited Development operation-specific guards remains PASS, global pressure policy deferred.

## 2026-10-20 disposable emulator network capture — executed
- Owner approved bounded local-only capture. Primary accepted emulator-5580 and physical Samsung untouched. Stopped only disposable CasitaDex_SB24_Disposable_20261020 emulator-5582 normally; restarted same disposable AVD via Android Emulator `-tcpdump C:\cdr\sb26-network-qa-20261020\qa-disposable.pcap` with no proxy, VPN, root or custom certificates.
- Android boot completed. Idle capture header initially 24 bytes; after disposable app force-stop then cold-launch (am start -W PASS, 9744ms) and six seconds observation, captured packets. Capture stopped by graceful disposable emulator shutdown.
- Raw PCAP: 8537 bytes, 65 framed packets, 0 trailing bytes, SHA256 DB3C78061FAE2D69290D2D9A10CEA217990A6E0F3ADC40542BFB66DB186EBFAB. Raw capture remains locally on C:\cdr outside repository; NOT uploaded or published. This reflects emulator-level traffic, not verified CasitaDex-origin traffic.
- Relaunched disposable 5582 without -tcpdump to restore normal runtime; accepted 5580 stayed booted. App/SDK destination and traffic attribution NOT YET established, so Play/Apple privacy disclosure gate remains OPEN. Further traffic analysis must separate emulator boot, Android OS, Google Play and app UID and redact sensitive addresses/payloads.

## 2026-10-20 offline local packet classification (no new capture)
- Parsed preserved local 8,537-byte 65-packet PCAP using a read-only local Python script C:\cdr\sb26-network-qa-20261020\analyze-local.py. Packet counts: TCP 36, UDP 11, non-IPv4 16 and other IPv4 2. Observed TCP flows on destination ports 443, 80, 853; DNS via UDP/53, plus multicast DNS via 5353. These are emulator-level network observations, not proof of app-originated activity.
- Offline DNS query extraction from captured bytes showed connectivitycheck.gstatic.com (2 queries) and www.google.com (2 queries), consistent with Android/Google connectivity checking. Query parsing helper stays in C:\cdr\sb26-network-qa-20261020\dns-summary.py. No packets were uploaded to outside analysis providers.
- No unexpected domain name was established among visible plaintext DNS questions in this very short capture. TLS/HTTPS and encrypted DNS may hide domains/payloads; process-level ownership cannot be determined by host-side PCAP alone. There is NO basis for a blanket no-collection/no-transmission declaration.
- Next targeted privacy acceptance: collect a comparable idle/control sample and explicit app flows with timestamps and compare, ideally process- or UID-correlated native counters or approved local-only instrumentation. Do not modify accepted AVD, owner Samsung, VPN, CA trust, firewall or release config.

## 2026-10-20 controlled idle-versus-app network comparison
- On disposable emulator-5582 only: force-stopped Development CasitaDex, gracefully restarted same AVD with emulator host `-tcpdump`, waited for boot_completed=1, then observed 10 seconds of idle before launch. During measured idle PCAP stayed header-only at 24 bytes. Marked app start epoch 1792547814 (UTC); `am start -W` returned Status ok / cold TotalTime 11926ms. After launch and 8 seconds, packet capture grew; gracefully stopped capture and relaunched disposable without packet capture.
- Captured 61 complete packets, 7941 bytes; SHA256 6187698D2DB2DE512D6AE6790BE86FFE2506EA20D079648AE9A9D30448FFEAAA. Raw `C:\cdr\sb26-network-qa-20261020\controlled-idle-app.pcap`, outside repository. Offline parsed: TCP 36, UDP 9, non-IPv4 14, other IPv4 2. Plaintext DNS names limited to connectivitycheck.gstatic.com (2 queries) and www.google.com (2 queries). TCP traffic includes 443, 80, 853. Pattern comparable to prior 65-packet sample.
- INTERPRETATION: traffic correlated with app launch timing but attribution to CasitaDex UID=10236 is NOT established; Android/Google connectivity checks are plausible and SSL/DNS over TLS may conceal additional domain names. Absence during idle does not establish absence during all background states. Do NOT assert no data collection or approve Play/App Store privacy disclosures from this capture.
- Next meaningful verification requires app-vs-OS process/UID correlation or approved local test instrumentation; run no repeated captures without solving that attribution gap. Human spoken TalkBack and visual pixel review remain open; SB25 limited Development PASS unchanged.

## UID-attribution feasibility checkpoint (read-only)
- Reconfirmed disposable AVD emulator-5582, Dev appId=10236; `adb shell` identity is uid=2000 (shell), no elevated privilege used.
- Android `cmd netstats help` returned No shell command implementation; older /proc/net/xt_qtaguid/stats does not exist. `/sys/fs/bpf/netd_shared` and `ss -tupn` netlink/UID socket details denied by OS permission. A subsequent `dumpsys netstats detail` search found 0 lines containing `uid=10236`, which does NOT establish zero network traffic (UID counter collection/history window and visibility vary).
- This development emulator does not expose dependable per-UID endpoint attribution via currently allowed read-only shell commands. Two prior PCAP files remain private, unmodified, and inconclusive for app/OS process attribution. Do NOT root/alter device privileges or repeat whole-device captures without approved attribution mechanism.
- Gate remains open: evaluate a deliberately instrumented disposable *debuggable* QA build (without altering accepted APK/release configuration) or a separate controlled Android network policy/test harness. Inspect and approve test method and privacy handling first. This is not permission to deploy or claim zero transmissions.

## SB26 instrumented QA super-batch (completed, limited)
- See docs/qa/SB26_NETQA_INSTRUMENTED_SUPERBATCH_20261020.md. Isolated .dev.netqa APK assembled and installed on disposable 5582 only; OkHttp listener proven with loopback-only probe. No other tagged OkHttp traffic seen during Home/tab smoke test. Native SDK/OS complete attribution remains OPEN; no zero-transmission privacy declaration. Scratch native build files restored from verified originals; accepted APK preserved; no commits or release operations.

## Native SDK coverage inventory extension
- Examined installed native Expo sources: expo-file-system legacy has independent OkHttp networking; expo-sharing has an HttpURLConnection path resolving inbound remote shared URLs. React Native OkHttp hook does not cover them. No evidence these paths were triggered in the limited tested CasitaDex flows. See SB26_NETQA_INSTRUMENTED_SUPERBATCH_20261020.md. Next targeted check should establish actual reachability of these paths before instrumenting anything further; no repeat opaque captures.

## SB26 actual media/backup native path review
- Traced photo pick, full v4 backup/restore, share and text export; local APIs only in first-party flow. Expo FileSystem network upload/download and Expo Sharing inbound remote URL resolving code are not directly reached by these traced functions. New 5 static contract tests PASS; full 336/329 PASS/7 SKIP/0 FAIL, TypeScript PASS. See SB26_NETQA_INSTRUMENTED_SUPERBATCH_20261020.md. No privacy release certification or spoken a11y acceptance implied.

## SB26 privacy draft and repeated native label check
- Internal unapproved draft at docs/qa/SB26_PRIVACY_DISCLOSURE_DRAFT_20261020.md, clearly distinguishes local records, optional user-directed sharing, separate receiving apps and unresolved full SDK attribution. No zero-collection declaration or publication.
- On disposable emulator-5582 at font scale=1.3, first UiAutomator attempt immediately after launch returned null root; retry succeeded with complete 24,806-character hierarchy and three labeled Home create actions plus five tabs. No human spoken TalkBack or visual pixel signoff.

## SB26 final accessibility automation: 130% light/dark and 200% system text
- Disposable emulator-5582 only, app com.designsbyfa.casitadex.dev. Captured local screenshots and UI hierarchy at 130% light, 130% dark, and 200% light: C:\cdr\sb26-final-a11y-20261020\{light,dark,font200}.{png,xml}. Evidence stayed local, no upload.
- At 130% light: 67 hierarchy nodes / 11 clickable / 0 clickable nodes without own text or content-desc. At 130% dark: 67 / 11 / 0. At 200%: 62 / 10 / 0. All three captures contained Home Add Memory, Add Photo Memory, Add Reminder and Photos, Reminders, Find labels. Different node count means not every screen state/control is proven equivalent at 200%.
- Restored disposable settings: system font_scale=1.3; Android night mode=no; accepted emulator-5580 still boot_completed=1. Physical Samsung untouched.
- PASS automated Home hierarchy labels under tested display conditions. NOT PASS human visual clipping, contrast/pixel review, spoken TalkBack focus traversal, full screen coverage or iOS VoiceOver. Saved screenshots do not themselves constitute visual review.

## SB26 accessibility geometry issue found
- XML audit from saved 130%-light/dark and 200%-light Home screen evidence identifies inverted vertical bounds: View all reminders at 130% [30,1156][690,1130], Add Reminder at 200% [30,1113][690,1075], plus related text nodes. Labeled-controls tests do NOT validate geometry. Need human visual inspection and spoken TalkBack focus before acceptance; potential clipped or scrolled elements, not yet confirmed rendering defects. Procedure: docs/qa/SB26_ACCESSIBILITY_MANUAL_GATE_20261020.md.
- Remote desktop screenshot blocked by Share Screen OFF. No changes to app or accepted devices; AVD remains 130% light TalkBack off.
