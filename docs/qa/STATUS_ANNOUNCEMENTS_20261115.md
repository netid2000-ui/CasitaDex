# Status announcements — November 15, 2026

Continued from e6c109e, preserving the Android keyboard visibility correction.

Shared ENG Status messages now explicitly queue changed, nonblank text for iOS screen readers. Android keeps the existing polite live-region behavior without a second explicit announcement. Re-rendering with unchanged text does not enqueue again. No visual, storage, navigation or photo behavior changed.

Mac mini source verification: TypeScript and full ESLint PASS; 502 tests total, 496 passed, 6 existing skips, zero failures. The new hook test covers iOS queuing, blank suppression, unchanged-text suppression and Android non-duplication. API compatibility checked against the installed React Native declaration.

This is a source-verified implementation checkpoint only. Actual spoken delivery, timing during navigation, repeated identical outcomes, editor focus return and changed-control TalkBack acceptance remain OPEN. No native build or device test was performed in this batch; earlier VoiceOver editor speech results do not verify this new hook. No photo acceptance repeated, saved data changed, release or purchase performed.
