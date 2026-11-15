# Native accessibility activation probe — November 15, 2026

Superbatch remains incomplete. No product change retained in this checkpoint.

Attempted to distinguish gesture injection from native accessibility activation using an isolated QA URL handler calling UIKit accessibilityActivate on the requested editor control. Candidate source wired explicit accessibility callbacks and delayed focus targets. TypeScript/lint and 496 source tests passed, with 6 existing skips, but this did not establish native behavior.

Three native attempts failed before reaching the editor input. The final QA lookup found 3 windows but no matching target; activation returned false and focused element was nil. This is an unresolved harness target/lifecycle problem, not evidence that the application accessibility callback itself failed. Native result bundles: CasitaDex-Activation[-r2/-r3]-20261115.xcresult on Mac QA-Evidence.

All candidate product changes and the QA URL handler were removed. Retained prior regression tests unchanged. Diagnostic harness copies and result text are in [evidence](evidence/activation-probe-20261115/). Fresh simulator shut down; VoiceOver preference restored offline; prior QA simulator restored. No memories edited, saved or photos retested. No release actions.

Next remains: obtain reliable native focused-element/activation verification across all three editors, complete TalkBack acceptance, then perform the requested app/Figma discrepancy sweep. Previous controlled announcement playback pass remains valid. No new acceptance pass is claimed.
