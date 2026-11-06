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
