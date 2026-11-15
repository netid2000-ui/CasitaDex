# Accessibility superbatch — November 15, 2026

**INCOMPLETE.** Steps 1–5 have not all passed. The requested final app/Figma discrepancy sweep has not begun because its stated prerequisite is unfinished.

| Step | Result |
|---|---|
| 1. Focus return | Candidate Location return observed in UIKit focus samples, but full regression remains open; candidate code not promoted. |
| 2. Three-field opening | Location input focus observed after keyboard autofocus experiment. Notes/Reference incomplete. Three-field run cancelled after repeated scroll-helper attempts with VoiceOver and keyboard. |
| 3. Status announcements | Native controlled-hook test passed: iOS reported successful completion of Save twice and error once. Repeated shared-operation status now clears before the next operation so identical outcomes can be announced again. |
| 4. TalkBack | Updated disposable build succeeded. Native labels/values exposed; keyboard-driven activation opened Location. Keyboard focus also returned to title, so full activation/focus acceptance is NOT passed. |
| 5. Reconciliation | Evidence and unresolved status recorded; acceptance remains open. |

## Evidence and interpretation

The XCUIVoiceOverService currentSpeech value can lag actual focus in these runs. Direct UIKit UIAccessibility.focusedElement sampling observed Done editing Location followed by Edit Location after closing, while currentSpeech still reported Done. Earlier reports attributing every stale spoken result to an app focus defect are therefore inconclusive. Native hierarchy also showed the expanded input and Done control while service traversal continued through stale collapsed labels. This is diagnostic evidence, not proof that all app focus behavior is correct.

Candidate changes explored keyed expanded/collapsed views, delayed legacy and current-renderer accessibility focus calls, and keyboard autofocus. The final experiment reached Location input focus but exposed a keyboard/scroll-helper barrier. All experimental focus application changes were removed from source and staging. Retained tests are diagnostic and have not achieved a complete passing three-field run.

Native announcement result: `CasitaDex-Superbatch-Fabric-20261115.xcresult` includes the exact completion assertion: `Saved on this device.:true|Saved on this device.:true|Could not save. Your saved memory is unchanged.:true`. The combined run still failed its focus test; it is NOT an overall pass. These are controlled QA messages through the actual hook, not real saves or storage failures. Announcement timing under all production navigation remains outside this evidence.

[Evidence](evidence/superbatch-accessibility-20261115/) includes raw UIKit focus samples, native announcement completions, Android screenshot/hierarchy and QA-only instrumentation. Instrumentation was added only to generated staging and removed after capture; the fixture route is staged only for native tests, not added to production routes. Earlier failed results remain on the Mac QA evidence volume.

## Preservation and cleanup

No memory values entered or saved and no photo controls activated. Existing accepted installs untouched. Android disposable accessibility services read back null before emulator shutdown. Its Display speech output preference may remain enabled but the service is disabled. Fresh iOS simulator shut down and its VoiceOver preference restored/read back false offline; previous QA simulator boot restored. Experimental binaries remain only on shut-down disposable devices and are not accepted artifacts. No production release or purchase.

Next: repair the VoiceOver-aware native interaction harness, independently assert focused UIKit elements for all three fields, and separate TalkBack touch traversal from hardware-keyboard focus. Then finish steps 1–5 and perform the requested discrepancy sweep. No completion or release readiness claim.
