# Android killed-app reminder routing candidate

2026-11-06, FA-MAC-DEV-01. Base 33dfc1954b1192c19a9808b7a7da9f4b098bc07a, runtime-equivalent a8129e81aabb20e0112f39865a046372cb0d5130. Isolated branch work/cd-sb121-android-cold-intent. Release remains NO-GO. Candidate native acceptance NOT RUN.

## Verified failure and source trace

Actual native notifications on a812 passed foreground/background taps; the killed-app tap opened Home. Prior app PID was absent, notification delivery restarted a process, and tap used the retained Activity task via wm_new_intent. This is a killed-app notification flow, not a claim that no process existed at tap time. PendingIntent carried correct ACTION_VIEW, MainActivity and casitadex-dev:/reminders target. Evidence: QA-Evidence/WORK-SB121/android-current-notifications-a8129e8/REPORT.md, terminated/FAIL.json and notification-acceptance.json on the external Mac volume.

Installed pinned implementations show two potential initial-link loss paths:
- React Native 0.86.3 IntentModule.getInitialURL reads currentActivity.intent; ReactActivity/ReactActivityDelegate forward onNewIntent without updating Activity.intent. An early new-intent URL event can precede the JS listener while initial lookup returns the older MAIN intent.
- Expo Router 57.0.30 races Android Linking.getInitialURL against 150 ms and substitutes its root URL on null. This timeout is verified source behavior, not proven timing causality in the observed non-debuggable run.
- Expo Linking 57.0.13's ReactActivityLifecycleListener retains onCreate/onNewIntent data separately. Its public getLinkingURL and clearInitialURL APIs synchronously read/consume this cache.
- Expo Router's supported +native-intent redirectSystemPath runs on the initial URL before navigation-state hydration and caches its result. The candidate uses that integration point, not a delayed router.push or dependency patch.

Reference APIs: https://docs.expo.dev/router/advanced/native-intent/ and https://docs.expo.dev/versions/latest/sdk/linking/ . Exact installed dependency sources were inspected, rather than assuming latest documentation matches installed behavior.

## Bounded change

For Android only, consume the captured Expo launch URL on each native-intent interception. Recover a valid memory/reminder target only when initial=true and Router supplied the root fallback for the configured dev/staging scheme. Never replace a valid current route or warm navigation. Unsupported schemes, malformed IDs, missing targets, duplicate/extra query fields and foreign hosts fail closed. iOS returns its input without reading or clearing its cache, preserving the existing retained-response drain. Recovered IDs retain literal percent sequences through the installed Router's two decodes. No UI, scheduling, data, native-module, dependency or configuration change.

Clearing consumed warm/initial caches prevents replay on subsequent JS mounts. Cold process initialization clears native static state naturally. This does not promise to recover an intent that Expo never captured: ReactActivityDelegateWrapper can skip listener dispatch before loadAppReady. Actual rebuilt tray-tap verification is mandatory; native instrumentation may be needed if the cache is absent in that flow.

## Tests

- Focused: 25/25 pass, including 13 new tests. Actual installed Router initial-URL interception/memoization and query-parser/local-params implementations run with bounded native/React context seams. One/two/three-slash variants and actual wrapper wiring are covered.
- Full node suite: 476 total, 471 pass, five existing skips, zero failures.
- TypeScript, ESLint and diff check: pass.
- Lockfile unchanged: SHA-256 7767f310cb183d9e2de29deed82d79ee7cd9a08dd29bddf5a979474fe7c856c7.
- Evidence logs: QA-Evidence/WORK-SB121/android-cold-intent-fix/{focused,tests,typecheck,lint}.log and status.txt.
- Tests used an isolated APFS clone of node_modules and explicit external TMPDIR. No source-cache symlink writes, native builds, emulator/simulator changes, phone testing, host-network changes or frozen iOS mutations.

## Next acceptance

Combine with independently reviewed release patches, run aggregate checks, build on the reserved Mac Android lane, preserve data, then repeat actual delivered tray taps for foreground/background/killed-app memory and standalone targets. Include cold encoded-ID and launcher/no-replay negatives. Preserve iOS response tests and run native iOS regression against final combined artifact. Do not call the Android failure fixed until real tray-tap acceptance passes.
