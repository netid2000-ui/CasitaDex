# Inline focus investigation — November 15, 2026

Mac mini, independent synthetic iOS simulator 189233C4-A360-49D7-AB2A-C9A7F02B9060 only. Rebuilt with status announcement source 0850ecb and existing keyboard correction. No memory values entered or saved; no photo operations.

## Observed

Actual XCUIVoiceOverService before activation: Edit Location with current value. Single-tap first attempt only focused the control; corrected harness uses double-tap. The second probe opened Location and found Done editing Location. After double-tapping Done, focused-element speech was Cancel Button, not Edit Location. Probe r2 completed, but it was diagnostic, not focus-return acceptance.

Added an explicit assertion requiring Edit Location after Done. Two proposed source fixes failed that assertion: focus event on remount (r3), and deferred setAccessibilityFocus (r4). Both unsuccessful application changes were removed from source and staging. The regression test is retained and currently FAILING; no focus fix is claimed. The disposable simulator retains the last experimental binary and is shut down, not promoted as a verified build.

Native results retained under QA-Evidence/CasitaDex-Inline-Focus[-r2/-r3/-r4]-20261115.xcresult. R4: one failed test. Source checks during candidate verification passed typecheck/lint and 496 tests with 6 existing skips; these do not supersede the failed native assertion.

## Scope and cleanup

Test cleanup did not restore VoiceOver: final preference readback was 1. After shutting down the disposable simulator, VoiceOverTouchEnabled was restored to false in its preference file and read back as false. Runtime behavior after reboot has not been independently checked. Fresh simulator shut down; prior QA simulator boot restored. Existing accepted installations not rebuilt. No user data edited. Status announcement module compiled into native build, but actual queued announcement playback remains UNVERIFIED: currentSpeech reports focused-element speech, not a reliable queue capture. Opening focus also needs further investigation; reported speech stayed Edit Location after the field appeared.

Next: isolate actual focused native element and activation transitions, then fix and pass the retained regression. TalkBack and queued-status audible verification remain open. Release acceptance is not granted.
