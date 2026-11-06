# iOS bounded scroll extent source correction

Status: independently reviewed source milestone. Native acceptance remains pending on an uninstrumented artifact. No production release or physical-device acceptance is claimed.

A coordinate-only diagnostic reproduced the maximum-text landscape failure. The controller requested and received offset1292 from native content height1399 and viewport107, while the focused descendant began at inner y1687.667. The measured overflow extent8572 was not the native scroll range. This was an extent/clamping discrepancy, not an unacknowledged command. Diagnostic preparation differed in when system text size was raised, and instrumentation can affect timing.

The iOS ActionPage now clips independent action/content regions in bounded outer Views while preserving the actual ScrollViews' scroll-axis layout semantics. The action region retains intrinsic height up to40% of measured available space. The existing focus controller, keyboard behavior, fonts, navigation, persisted data, native graph and Android/web behavior are unchanged. No telemetry code is included.

Validation: final baseline component gate8 PASS/2 expected iOS failures; corrected candidate48/48 focused checks; full source suite590 tests,585 PASS,5 existing opt-in archive skips; typecheck and targeted lint PASS. A first test-only rounding expectation was corrected to preserve the existing floored40% budget, with all failed evidence retained. Structural and mock tests do not establish actual native height or caret visibility.

Reviewed patch SHA256:53da71fd2bf450865f9746df3afecd6d07bf0e429560984322a7f0a15ad961c4. Diagnostic coordinate trace SHA256:65ce447b89bfe6f01711175de2e6a77e94400b0c993963e2d9b0da33e46ebce8.

Remaining gates: exact uninstrumented simulator build, stable maximum-text same-editor keyboard rotation and caret visibility, both-direction rotation/show-hide, independently clipped/reachable actions, intrinsic normal-text action sizing, and normal Home/Detail/Edit/Share smoke.
