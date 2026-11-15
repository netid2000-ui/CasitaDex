# Editor spoken-label checkpoint — November 15, 2026

Continued from local checkpoint 990b23c on the existing feature branch. Preserved the newer Home VoiceOver, optional-field large-text correction and Android parity evidence; did not repeat those completed checks.

## Change

Space and Categories previously shared the spoken name `Choose ▾`. They now expose distinct `Choose Space` / `Choose Categories` names, current values, existing expanded/disabled states, and open/close hints. The old string remains only as an automation test identifier, not the spoken label. Collapsed Location/Notes/Reference controls now expose their current value (or None), plus an editing hint. Visual design, persistence and Save/Cancel behavior are unchanged.

## Verification

- Mac mini only; TypeScript and full ESLint PASS.
- Full automated suite: 500 total, 494 PASS, 6 existing SKIP, zero failures. New component tests verify distinct names, values, expansion/disabled semantics and callback preservation.
- Native iOS `testEditorVoiceOverLabels20261115`: one PASS, zero failures, 63.237 seconds. Rebuilt only the independent synthetic simulator 189233C4-A360-49D7-AB2A-C9A7F02B9060; actual XCUIVoiceOverService speech was captured after opening Edit Memory.
- Selected real utterances: `Choose Space Sample Garage Button Opens the choices`; `Choose Categories Garage Button Opens the choices`. Subsequent traversal read Description, Edit Location with its value, Edit Notes with its value, Edit Reference with its value, photo-related labels, then bottom navigation. No photo action was activated.
- The captured forward traversal began after the initially focused item, at Save; therefore it does not establish complete initial-focus/Cancel order. Longer returned utterances were truncated by the speech capture; no claim of complete hint playback or audio quality is made. Further forward moves repeated Find at the end.
- VoiceOver disabled after the run; preference VoiceOverTouchEnabled=0 independently read. Test cancelled editing and returned Home. No values were entered or saved.
- Existing QA simulator 81FC3CCE-ACEB-4957-BE61-C9C653A4CE56 was not rebuilt. Its ENG payload hash remains 829ae84e387b31d5c7585c026670a2d7a38b8bbb836daea0ce229d739a71bee8. Accepted SB40 and physical devices untouched. Fresh test simulator shut down and prior QA simulator boot restored.

Native result retained on Mac: QA-Evidence/CasitaDex-Editor-VoiceOver-20261115.xcresult. [Source test logs](evidence/editor-accessibility-20261115/).

## Remaining

Android native/TalkBack verification of these changed controls, activation and focus return when inline editors open/close, dynamic status/error announcements, complete screen traversal, and physical owner acceptance remain open. Earlier Home VoiceOver and Android optional-field parity have their own scope in the linked reports; this is not complete accessibility or release acceptance. Completed photo acceptance was not repeated.

Related: [Home VoiceOver](VOICEOVER_ADD_ACCESSIBILITY_20261115.md), [Add correction](ADD_ACCESSIBILITY_CORRECTION_20261115.md), [Android parity](TALKBACK_ANDROID_ADD_20261115.md).
