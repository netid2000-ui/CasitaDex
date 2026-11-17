# CasitaDex — physical iPhone owner acceptance

Prepared November 16, 2026. Status: **physical QA app installed and launched; checklist execution and owner sign-off pending**.
Source candidate: `f761bad`, reminder corrections on top of accepted Samsung/search/keyboard/taxonomy work.

## Identity gate

- [ ] Record iPhone model, iOS version, app bundle ID, displayed version/build, source commit and installation method.
- [ ] Confirm this is a physical-device build of the intended candidate. The verified `plusstoreqa` simulator Debug app is not proof of a signed physical build.
- [ ] Preserve the owner's accepted app and data. Any required candidate provisioning/install must use the approved Mac mini workflow; never replace a different package or erase data as a shortcut.

## Focused acceptance

Run normal text/light first, then enlarged text/dark. Restore the owner's original settings afterward. Use clearly marked disposable QA records for tests that save changes.

| Check | Expected result | Owner result |
|---|---|---|
| Navigation | Home → Photos → Reminders → Find, in that order | Pending |
| Home search | Search Memories matches shared button system | Pending |
| Fresh Find | Empty query, Search memories… placeholder | Pending |
| Active search return | Query, Space/Category/Location/photo filters and page survive Details → Back | Pending |
| Results heading/paging | Heading and first result visible below sticky controls; Previous/Next work | Pending |
| Taxonomy | Choose Space, Choose Categories and Choose Location follow the unified picker pattern; Location remains scoped correctly to Space | Pending |
| Keyboard | Focused title, description, optional fields, picker search/create fields and reminder notes remain visible above keyboard | Pending |
| Add Photo | Explicit Cancel closes source selection and retains draft; camera/library/file cancellation does not discard it | Pending |
| Reminder controls | Add/Edit/More/Repeat/Save follow shared styling; no horizontal clipping | Pending |
| Date and time | Normal calendar and enlarged date wheels fit; time wheels fit; Done is reachable | Pending |
| Picker values | Change date/time in a disposable draft; Done returns with the chosen value. iOS applies changes to the unsaved editor as selection changes | Pending |
| Reminder Cancel | Unchanged editor returns directly; changed editor offers the appropriate discard protection | Pending |
| Linked reminder Save | Saves the QA reminder and returns to its originating Memory Details | Pending |
| Notification routing | For a disposable future reminder, tapping its notification opens the intended memory/reminder in foreground, background and terminated-app states | Pending |
| Photo viewer | Open thumbnail, pinch/double-tap zoom, close and return to originating item | Pending |
| Offline/cold start | QA memory and settings survive offline use and app restart | Pending |
| VoiceOver | Labels, focus order, picker controls and Save/Cancel understandable and operable | Pending |

## Separate release gates

- [ ] Complete remaining camera/library permission and import checks on physical devices.
- [ ] Complete TalkBack/VoiceOver acceptance; automated layout checks do not replace it.
- [ ] Verify backup/restore only with a protected backup and isolated QA data; do not overwrite owner data to test restoration.
- [ ] Reconcile the six recorded automated skips with their required fixtures/artifacts; do not mark them passed without execution.
- [ ] Review remaining store/billing/release requirements in the project release checklist. No live purchases or submissions are authorized by this checklist.

## Sign-off record

Owner: __________  Date/time: __________  Physical build identity: __________
Accepted cases: __________  Failed cases/evidence: __________
Release decision: __________

Passing this checklist does not itself authorize a main merge, store submission or production release.

## Historical physical-build preflight result (resolved below)

The connected iPhone 17 Pro Max / iOS 27.3 beta was detected on November 16. At that preflight, the candidate's signed build was blocked by Apple's updated Program License Agreement and the unavailable Push Notifications provisioning profile. See [physical build checkpoint](IPHONE_PHYSICAL_BUILD_CHECKPOINT_20261116.md). At that preflight, no candidate installation or owner acceptance had occurred. The later successful installation below supersedes this build blocker.

## Provisioning resolved and candidate installed

Successful retry installed CasitaDex Plus Store QA (`com.designsbyfa.casitadex.plusstoreqa`, 0.1.0/build 1) on the connected iPhone 17 Pro Max. The signed source candidate is f761bad. Process launch succeeded. Existing CasitaDex apps remain installed. All functional owner-result rows above remain Pending until actually executed.

## Physical reminder automation checkpoint

The physical iPhone passed the current-size dark-mode date/time presentation, unchanged-value Done, and editor Cancel/Home checks. See [physical reminder evidence](IPHONE_PHYSICAL_REMINDER_ACCEPTANCE_20261116.md). Owner-result rows remain pending; this limited automated check does not cover changed selections, enlarged physical text or notification routing.

## Physical reminder workflow follow-up

The physical iPhone also passed changed-date retention, exact-minute retention after settled native wheel selection, changed-draft discard protection, and linked reminder Save returning to the original Coffee filters sample memory. See [workflow results and limitations](IPHONE_PHYSICAL_REMINDER_WORKFLOW_20261116.md). The initial time test was strengthened after screenshot review; failed diagnostic attempts are retained. Notification routing remains unaccepted until a successful actual delivery and tap is observed. All Owner result rows remain Pending.

## Corrected notification route installed and verified

Source **593de3d** is now installed in the same isolated physical `.plusstoreqa` app. Actual foreground notification delivery and tap-to-exact-standalone-reminder passed; linked reminder Save return passed again (2/2 final physical tests). Full automated suite: 525 passed, 6 skipped, 0 failed; TypeScript and ESLint passed. Background/terminated and linked-memory notification taps, other remaining checklist rows, and owner sign-off remain Pending. See the workflow report above for failed diagnostic attempts, installation identity and evidence.

## November 17 approved visual update and lifecycle acceptance

The same isolated physical QA app now contains application source a39c37f. Current-size dark Home/selectors/photo Cancel, background and terminated standalone notification taps, and terminated linked-memory tap have passed. Existing data was compared before/after. See [release closure](RELEASE_CLOSURE_20261117.md) for exact identity, attempts, evidence and remaining gates. Owner checklist rows remain pending until the owner actually signs off.
