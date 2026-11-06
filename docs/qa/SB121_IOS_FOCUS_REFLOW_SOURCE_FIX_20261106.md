**Historical checkpoint.** Historical 5dc/9da source correction and native follow-up. Those failures remain retained; current uninstrumented 8cc bounded acceptance is recorded separately. [Current summary](SB121_CURRENT_8CC_NATIVE_MILESTONE_20261106.md) · [Central ledger](SB121_CURRENT_NATIVE_ACCEPTANCE_LEDGER_20261106.json).

# iOS focus after rotation: reviewed source correction

Date: November 6, 2026. Source milestone only; native acceptance remains OPEN.

## Verified problem

The installed bb235cd iOS candidate passed settled portrait focus, ordinary typing and keyboard reopening at app Large Text plus system maximum text. An early animation capture was transient and is not the defect.

A distinct same-editor rotation failure persisted in separate settled captures: landscape content occupied y71–178 while the retained focused input remained y1455–1628. Keyboard avoidance bounded the pane correctly, but large-text reflow did not bring the focused input into it. Unsaved text was retained.

## Correction

- Only the iOS content pane measures its current focused descendant after viewport/content reflow and completed keyboard-frame changes, then applies a bounded nonanimated scroll correction.
- Uses the actual pane and input window coordinates, not a helper that assumes a full-screen scroll view.
- Route/focus identity, native descendant ownership, observed offset and request generation guard asynchronous measurements.
- Native scroll commands are serialized until a matching requested or clamped target is acknowledged. Delayed unrelated scroll events cannot acknowledge a command.
- Manual dragging, route blur, keyboard hide and unmount cancel pending work. Interrupted dragging resets on refocus.
- Android and web receive no new navigation/keyboard listeners, content refs or scroll callbacks. KAV behavior, action allocation, tokens, font scaling, navigation, editor identity and stored data are unchanged.

When an input is taller than the pane, the fallback centers the control rectangle. This does not measure the caret or prove the entire control fits. Actual text/caret usability remains a native acceptance requirement.

## Verified source evidence

Independent bounded review approved the final four-file patch: SHA-256 ce5b54ef869dacdf1fb24501714afc11851785f4aea1fbfe9731f9fb341c61be.

- Focused component and guard checks: 49 passed.
- Full source regression: 582 tests, 577 passed, 5 skipped, 0 failed.
- Final typecheck and full lint: passed.
- Baseline actual-component checks: 17 expected failures, 2 passes.
- Independent-review races retained fail-before evidence: 3 failures before observed-offset/lifecycle repair, then 1 failure before strict acknowledgment repair. All pass in the final candidate.

The five skipped tests are the opt-in real-archive suite and are not certified by this run. Separately recorded archive work is not replaced by this source milestone.

## Still open

Build and install the exact committed source into the isolated iOS acceptance target, preserving data. Verify stable pixels and keyboard geometry through both rotation directions, repeat show/hide, ordinary typing/caret use, independent actions, Save/Cancel and return context. Retest any oversized input honestly. No new Android artifact or native acceptance is claimed by this source change.

Manual screen-reader, wider accessibility and remaining release gates retain their separate statuses. No physical-device test, release merge, store submission or production deployment is authorized or claimed by this record.


## Follow-up: preserve reconciliation after programmatic scroll completion

The exact 5dc930e iOS artifact did not close the native gate. Portrait settled focus passed, but the same dirty editor retained focus below the landscape pane: field y468–641 versus pane y71–178, with the keyboard open. Separate stable samples and pixels confirmed the partial correction persisted. Unsaved data survived and the original record was preserved during safe cancellation.

A specific source counterexample was then confirmed against installed React Native Fabric: nonanimated scrollTo emits onScroll followed by onMomentumScrollEnd. The controller could queue its needed follow-up measurement on onScroll, then cancel it in an unconditional end handler despite no user drag having begun.

The follow-up source change is a single guard: end handlers invalidate work only when an actual drag/momentum begin set the dragging latch. Real manual drag/inertia still suppresses automatic corrections. It does not change geometry, fonts, navigation, Android behavior, native configuration or data handling.

Independent review approved the two-file patch SHA-256 e31c99a36b264526643cb5985c738d832a23c0b675544652c49fac3290821a02.

- Native-event-order regression before the guard: 29 checks, 27 passed, 2 failed.
- Focused checks after the guard: 53 passed.
- Full source regression: 586 tests, 581 passed, 5 opt-in archive skips, 0 failed.
- Typecheck and full lint passed.
- Tests include partial outcome geometry, duplicate forced same-offset events, genuine user drag/inertia and no correction loop.

No internal event trace was captured from the failing native run. The controller counterexample is proven; its attribution as the sole native cause and the fix's real-device behavior are not yet proven. The next exact-source iOS build must repeat the stable landscape input/caret and both-direction rotation checks. Oversized-control usability and all other native/release limitations above remain OPEN. No native acceptance is claimed from these source tests.
