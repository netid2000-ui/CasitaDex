# Samsung UI correction acceptance

Run from the CasitaDex worktree on FA-MAC-DEV-01 only. Tests use `com.designsbyfa.casitadex.refreshqa` on the connected Samsung or explicitly selected Android emulator, never owner packages. The shared phone helper lives in `../samsung-sweep-20261115`.

- `layout-check.py`: four theme/font combinations; QA_SMOKE narrows emulator work. Screenshots, accessible Edit controls, photo target measurements and horizontal button bounds.
- `tab-check.py`: final aligned tab rows; waits for Android font-change activity recreation before selecting Reminders.
- `photo-return.py`: full zoom/double-tap/pinch and before/after position checks in both themes.
- `photo-position-final.py`: final APK check with a large visible photo target (at least 180 pixels high).
- `long-label-check.py`: initial attempt created the named isolated QA Space. `long-label-finish.py` is its continuation, handles font-change recreation, tests selected-label wrapping, and removes that QA Space.
- `persistence-check.py`: final cold start, text/photo/Location checks, original settings and app-exit diagnostics.

Tests are stateful acceptance flows, not an all-purpose suite. Old failure logs remain evidence of corrected test sequencing. Never treat them as passing attempts. No sharing, purchases, production release or owner data reset.

`cleanup-label.py` finishes removal after the original helper matched the search input's entered value instead of the identically named label row. The helper now matches editable fields by accessibility label, not by their entered text. `long-label-finish.py` captures remain valid; successful cleanup is logged separately.
