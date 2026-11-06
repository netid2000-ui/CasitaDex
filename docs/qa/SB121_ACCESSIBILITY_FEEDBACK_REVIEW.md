# SB121 focused accessibility fixes and design/security review

November 6, 2026 UTC. Source 7d0dd6626287fd56d30b990f4a9c14036801a9a2, authorized feature branch work/cd-sb41-edit-targeting-20261104. **Source checks PASS; new native acceptance NOT RUN; release NO-GO.**

The installed and scheduled runtime remains a8867c06c7dd3ceab55bd1ac6705064a83de28f2. Neither current nor historical iOS reminder fixture was touched. The current 15:00 UTC test still follows [its existing handoff](SB121_CURRENT_LINKED_0900_CONTINUATION.md), not this unbuilt semantic candidate.

## Three bounded corrections

- Linked-memory reminder refresh failures now reach the existing iOS announcement mechanism when newly changed and visibly relevant. Previously, the conditional status mounted already populated and was intentionally treated as old content.
- Failed Appearance/Accessibility preference saves now have meaningful iOS recovery speech and Android live-region semantics, rather than plain text alone.
- Disabled Home creation controls now expose the same disabled reason as their visible copy, rather than the normal enabled-action hint.

A visibility-aware wrapper silently consumes hidden or unfocused changes and baselines old text when a panel becomes visible. Screen-lifetime hooks avoid replay from keyed/conditional panel remounts. Existing status/privacy/deduplication/background and Reduce Motion helper bodies remain unchanged; only two existing app-owned preference-error strings join the speech allowlist. No focus move, new queue, routing action, permission, persistence, notification scheduling, dependency, artwork, layout or visible-copy change occurred.

Identical preference errors across consecutive failed attempts remain deduplicated by the existing provider. The tests do not claim a distinct announcement for every failed retry.

## Verification

- Three behavioral regressions fail against the unchanged baseline: missing announcement calls for the actual rendered error paths, and an incorrect disabled-action hint.
- Focused tests: **35 pass, zero failures**. Independent synthetic lifecycle review: **11 pass**, no review-blocking defect.
- Full source regression: **503 tests, 498 pass, five existing skips, zero failures**.
- TypeScript and zero-warning ESLint pass. Scoped changed-file Gitleaks and Git diff checks pass.
- Exactly three source and two test files changed. All 745 other tracked files matched the tested isolated source; lockfile remains 7767f310cb183d9e2de29deed82d79ee7cd9a08dd29bddf5a979474fe7c856c7.
- An initial candidate lint failure caught render-time ref reads; the corrected derived-state implementation passes without suppression. Android live-region eligibility remains stable through unrelated renders.
- No native build or device action was performed for this change. Synthetic hooks/API mocks do not establish actual VoiceOver/TalkBack speech, focus, foreground-transition timing or native hint behavior. These remain required.

## Figma reconciliation and declared color checks

Fresh design context and returned render pixels were inspected in the CasitaDex UI authority:

- [Current Home review](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=321-36) preserves Home / Photos / Reminders / Find, all four Home actions and Settings. It remains editable REVIEW, not additional owner approval.
- [Historical accepted detail](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=263-2) requires fixed Back to results / Edit actions.
- [Historical accepted edit](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=263-120) requires fixed Cancel / Save actions above content.

Current detail/edit actions remain in the scroll flow, so fixed-action parity is still open. These older frames also retain five-tab chrome and another header/palette: wholesale adoption would regress the latest owner direction. No master was edited or silently promoted. Separate sharing-flow parity and the full responsive/screen-reader matrix remain open.

All **22** inspected declared source text/background pairs meet 4.5:1, with a minimum of **4.744:1** for Home secondary text on its gold surface. This is not a raster, opacity, imagery, OS-chrome or full-state contrast audit. The earlier light Android splash system-indicator observation remains open.

## Security disposition

The existing exact-lock review traces two moderate advisories to four production-classified and eleven full-audit affected entries. Installed consumers support build/lint exposure, with no demonstrated household-data runtime route. This is not a new advisory-database scan or proof of universal native exclusion.

- [Glob cancellation bypass](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): inspected fingerprint fallback uses fixed patterns without an AbortSignal.
- [Minimatch pattern amplification](https://github.com/advisories/GHSA-g3hv-75wg-m249): inspected direct consumers default below the triggering optimization level; nested glob uses that level but fixed patterns.

The retained Android maps omit these packages, but missing pre-Hermes input prevents a conclusive cryptographic map-to-binary exclusion claim. Keep the gate open; retain that input and the map/HBC chain during the next already-required build. No forced major override or risk acceptance occurred.

## Remaining release gates

Current normal-clock linked delivery/taps; approved same-current-state full-draft restore; strict OS-wide offline; new semantic native acceptance and full VoiceOver/TalkBack/Figma matrix; security disposition; distribution signing and owner physical-device acceptance after required virtual completion. Historical results retain their exact artifact attribution. No physical test, production, release merge, submission, purchase, host network/clock change or destructive data operation occurred.

[Sanitized evidence manifest](SB121_ACCESSIBILITY_FEEDBACK_MANIFEST.json). Raw logs and device data remain outside Git.
