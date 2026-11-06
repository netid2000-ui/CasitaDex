# WORK-SB120–121: CasitaDex iOS release qualification

Date: November 5–6, 2026. Machine: FA-MAC-DEV-01 only. Release decision: **NO-GO**.

## Source and scope

- Authorized branch: `work/cd-sb41-edit-targeting-20261104`.
- Starting source: `08398127d44fa346db6cbabe5aa30f0d33723aa6`.
- Final application/build source: `b30c95148136373d7079902013e5389d11152c64`.
- Final documentation commit can be obtained with `git log -1 -- docs/qa/WORK_SB120_121_EXECUTION.md`. Documentation changes do not represent a rebuilt application.
- Followed the master/product charters, mandatory design skills and release SOP. Continued from [SB116–119 return report](https://github.com/netid2000-ui/event-command-by-fa/blob/94d19d40ee6af6e8953ed22af80ee1cccbf764aa/docs/qa/DESIGNS_BY_FA_WORK_SB116_119_RETURN_REPORT.md).
- Preserved prior Android photo/backup/offline evidence rather than repeating those suites. Figma remains design authority; no Figma-master changes or new design acceptance claims.
- All fixtures are synthetic, in the already-designated disposable iOS simulator. No production, release merge, store submission, live purchase, production Firebase write, other-machine action, or destructive operation on important project data.

## Implementation delivered

1. `e544c52ecd46b6b4547324917d945bfa4c7268a7`: iOS notification response routing. Retains native response records until JS can consume them, validates owned requests and exact source identity, uses explicit memory/reminder destinations, waits for the root navigator, defers for active edit/save guards, and retries safely after guard release. Default taps only; unrelated notification behavior is forwarded. Notification copy remains generic.
2. `bc552aa6516d3d3e5ee7caaa1b59744d0dc4d033`: actual iOS backup/export fix. Reproduced use of Android-only StorageAccessFramework on iOS, then added verified private-cache files and the existing native iOS share sheet. Full-backup verification reopens bytes, checks framing, exact EOF, header hash and every photo size/hash. Success wording does not falsely claim an external provider saved the file. Android SAF is unchanged.
3. `00fe805fd51969e99aaa0f3f1434cea085bfb2d8`: native integration preflight. A successful initial build contained stale generated Pods and omitted the local reminder module entirely. The new documented prebuild script fails when the pod, module or app-delegate subscriber is absent; it is not an automatically enforced Xcode build phase. Scoped local pod refresh repaired generated integration before rebuild.
4. `b30c95148136373d7079902013e5389d11152c64`: adversarial native testing caught an additional exact-ID transport defect. Installed Expo Router 57 decodes query values twice; a real background notification for an ID containing literal `%2F` reached Reminders but failed matching. Normal UI-generated reminder IDs use the stricter backup-compatible format, so this is defensive transport hardening rather than evidence that normal IDs were failing. Added one outbound transport-encoding layer for both iOS notification destinations. Tests execute the actual installed resolver, parser and hook, not a simplified URL approximation.

## Build provenance

The current Release/arm64 simulator build is unsigned for distribution and uses `com.designsbyfa.casitadex.dev`.

- Device: `7DB01BF8-2C97-486A-A908-DA8F9E81FE8C`, “CasitaDex SB69 iOS 27.0 Disposable”, iOS 27.0.
- App: `Apple-Builds/CasitaDex-WORK-SB120/DerivedData/Build/Products/Release-iphonesimulator/CasitaDexDev.app`, relative to the authorized SSD root.
- Build source is b30c951; final build job `97dc5d606c19ca3c` exited 0. Full command, logs, timestamps and file hashes are retained under `QA-Evidence/WORK-SB120/build-final`.
- Installed executable and JS bundle compared byte-for-byte to that build before final native tests. Hashes are in the manifest and `mobilewright/final-installed.sha256`.
- Initial bc552aa and integrated 00fe805 app variants were retained before overwriting derived output.
- Generated `ios/` is ignored. `pod install --no-repo-update` first failed due stale ExpoModulesCore podspec constraints; scoped `pod update ExpoModulesCore ExpoModulesWorklets --no-repo-update` restored matching local podspec integration. No package.json/package-lock dependency upgrade was made.

## Verification results

### Final source checks

- TypeScript: PASS.
- Full unit/regression suite: **389 tests, 384 passed, 5 skipped, 0 failed**.
- ESLint, zero warnings: PASS.
- iOS native integration preflight: PASS.
- Current-source web export: PASS.
- Scoped Gitleaks scan from starting SHA to final source: PASS.
- **Online Expo Doctor: 20/21; FAILED** SDK patch alignment. Seven patch mismatches remain (expo, build-properties, constants, image-picker, router, sharing, splash-screen). The offline doctor run returned 21/21, but it is explicitly not used to override the online failure.
- Existing dependency-security and signed-distribution release gates remain open. No broad dependency migration was mixed into these fixes.

### Native reminder delivery and navigation

**PASS on b30c951 for standalone reminders in foreground, background and terminated states**, with real normal-clock local notification delivery and exact literal-percent/Unicode source IDs. Foreground delivery was at 19:05, background at 19:10 and terminated at 19:12 local November 5. Each final screen displayed the expected unique title and “Reminder opened from your notification.”

- Foreground final proof: job `0e682460fd011c2c`, exit 0; `final-foreground-exact-target.{json,png}`.
- Background and terminated final proof: job `e679940e0ca1e638`, exit 0; `final-background-exact-target.{json,png}` and `final-terminated-exact-target.{json,png}`.
- Fixture IDs, due times, scripts and final UI trees are retained in the evidence directory. Foreground driver attempts exposed a stale tree and an offscreen notification card; correcting those interactions preceded the successful activation.
- **Native dirty-edit defer/cancel PASS on b30c951.** A real alert delivered at 19:16 while a synthetic memory answer had an unsaved edit. Activating it preserved the editor and exact unsaved value; cancelling the edit then opened the exact queued reminder. Evidence: dirty-editor-preserved-after-tap and dirty-cancel-deferred-exact-target JSON/PNG, final activation job 49fe1af0a80d6698. Earlier setup stopped at the native deep-link confirmation and a driver viewport cutoff; those were resolved without source changes. Deferred Save and save-failure recovery remain untested.

The native notification fixtures were inserted into the disposable simulator’s local SQLite table to schedule timely, distinct cases. **The application itself then scheduled actual iOS local notifications**, with the normal clock and normal permission path. This is not UI date/time-creation acceptance, fake push delivery, host-clock advancement, or a synthetic call directly to the response handler. The deliberately adversarial SQL fixtures bypassed normal ID/anchor-day validation. Before final backup smoke, backup correctly rejected those fixtures. All seven owned rows were preserved in before evidence and normalized to r_[a-z0-9_] IDs and valid anchor days; title, notes, schedule and row count were retained. No product-data fix was needed for that rejection.

Earlier results retained:
- On 00fe805, foreground delivery at local 18:45 on November 5 was confirmed by iOS logs and Notification Center. `willPresent` returned 26 (banner + list + sound). Activating the alert opened the exact normal-ASCII standalone reminder.
- On the same build, a normal-ASCII terminated-app notification delivered at 18:59 and opened the exact reminder after cold startup.
- The literal-percent background transport failure is recorded, not erased by the later fix. The directly seeded adversarial fixture remained in the database while UI said the notification target was unavailable. Its identity was outside the normal reminder backup schema.
- Banner/Notification Center driver retries are separate from product results. The iOS notification card sometimes first exposed an “Open” action; completing that action was necessary before checking the destination.
- Linked memory reminders retain their product-defined 09:00 local schedule. **Real iOS linked-memory delivery/tap at that schedule was not run during this evening session.** Both destination transports are covered by installed-router tests, but that is not equivalent to native linked-memory acceptance.

### Photo, backup/restore and persistence

- Native Photos picker created “SB120 iOS Photo Memory” with two synthetic images.
- Reproduced old iOS full-export failure: `StorageAccessFramework.requestDirectoryPermissionsAsync is not available on ios`.
- Fixed bc552aa build opened native share sheet; Save to Files created a real `.cdxe` archive under On My iPhone.
- External Files copy and prepared private file were byte-identical: SHA-256 `0edbe54d529fc139e716d66db101fdd37bed346d029b851e7594ed4b542bebcc`.
- Selected that archive in the native picker, reviewed it and explicitly confirmed replacement of the known synthetic collection. UI reported “Full collection restored and verified.”
- After force-stop/relaunch, both restored photos opened. Previous/Next selected the correct image, and Close returned to the original memory.
- Read-only SQLite and media-file comparison verified the collection/draft equality and both restored image byte hashes.
- On final b30c951 installation, independent read-only persistence verification again found the saved large-text memory and both exact media hashes. The script initially assumed the wrong media root, failed without modifying data, then used the actual `Documents/casitadex-media-v2/media` location.
- Final b30c951 native smoke also verified restored Photo 1 → Photo 2 → Photo 1 and Close back to the matching saved-photo memory, the persisted large-text answer, and full-backup share-sheet opening with Save to Files available. The final share sheet was dismissed, and the app correctly stated that it cannot confirm an external save. A final prepared archive of the normalized synthetic collection is retained (SHA-256 32f29bd81530a1ab6347cdf3dfab85018398309456689d6df39db40d5e12e624). This final smoke did not repeat the external Save to Files/restore cycle; that proof remains explicitly on bc552aa. Automated smoke attempts stopped on an offscreen memory heading and the deliberately invalid SQL fixtures; direct UI/readback checks and the final normalized export completed the bounded verification.

### Large text and accessibility

- Maximum iOS Dynamic Type (`accessibility-extra-extra-extra-large`): reached Add Memory, both input fields and Save by scrolling, saved “SB121 Large text memory” / “Large text saved answer”, and observed the saved detail.
- Final-source SQLite readback confirms that record and answer survived application reinstalls and relaunches.
- Restored normal text size after testing.
- This is a bounded **large-text reachability/persistence pass**, not complete accessibility acceptance. The native driver sometimes reports stale/offscreen nodes, and its tree does not consistently expose custom bottom tabs even when visible. Do not convert driver limitations into either VoiceOver failures or passes.
- Final native landscape smoke displayed the persisted memory name, answer, Review action and all five navigation tabs in the 844×390 logical viewport (2532×1170 screenshot). Portrait was restored. This single-screen observation does not close full responsive/landscape acceptance.
- Full VoiceOver/TalkBack, focus order, all-screen large text, small-screen/landscape, Figma state reconciliation and owner physical-iPhone approval remain open.

### Offline scope

The installed Release app runs from its bundled JS and locally persisted data; no Metro server or cloud backend was needed for the tested local journeys. Prior Android offline evidence is preserved. **A strict network-disabled iOS journey was not executed.** Host networking was not changed because Event Command QA shared the Mac. Do not call this a radio-off/offline acceptance pass.

## Resource isolation and test-driver recovery

- Heavy builds serialized using `fa-mac-heavy-build`; no simultaneous Event Command Gradle build.
- Preserved existing SB118 Android emulator/ADB/Firebase jobs and ports. No cancellation or reuse of Event Command resources.
- Maestro hung during global Android enumeration despite the selected iOS device. Only the two new CasitaDex attempts were cancelled. Existing SB118 job was not touched.
- Recovered native iOS automation with installed Mobilewright and its existing official Device Kit agent, dedicated `ws://localhost:12220/ws`, device-specific locks. No user application reset.
- Raw screenshots, UI trees, scripts, readbacks and app-scoped OS logs remain under `QA-Evidence/WORK-SB120/mobilewright`. Final static logs are under `QA-Evidence/WORK-SB121/final`. Manifest records selected hashes.

## Honest remaining release gates

1. Real normal-clock linked-memory notification taps at 09:00 in required lifecycle states; native dirty-editor deferred Save/save-failure recovery and permission-denied → Settings → allowed recovery.
2. iOS strict offline recovery, wider provider failures/cancel/reimport, real camera/photo permissions, and household-scale media stress.
3. Full accessibility/responsive/Figma reconciliation and owner physical-iPhone final signoff.
4. Online SDK patch alignment and existing dependency-security migration; signed production-like distribution validation.
5. Separate Android/existing in-app link handling has an analogous literal-percent transport concern if such nonstandard identities are ever supported. Current reminder backup IDs are constrained; this is a separate hardening consideration, not evidence that normal IDs fail. This iOS fix does not newly accept those paths.
6. Rare simultaneous root remount plus failed acknowledgement can reopen a target because duplicate suppression is per drain instance. No record mutation follows, but that fault combination is untested. Add-memory asynchronous draft-flush interruption is also outside the edit-guard acceptance performed here.

No deployment, release merge or store submission is authorized by this report.
