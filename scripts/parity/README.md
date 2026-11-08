# Local SB40 parity checks

All tools and evidence stay on FA-Development. These flows target only the pinned CasitaDex SB40 QA package. Event Command still needs its own accepted-artifact manifest and flows.

## Tools

- Maestro CLI 2.12.0: existing SSD installation, executed locally with analytics disabled.
- Maestro Studio: existing SSD installation, retained; Studio itself was not acceptance-tested.
- Pixelmatch 8.0.0 and pngjs 7.0.0: installed in Tools/ParityTools. Exact lockfile in tools/parity. Install using `npm ci --ignore-scripts --no-audit --no-fund` in that external tool directory.
- Apple Accessibility Inspector: available in Xcode Contents/Applications; opened successfully. Availability does not mean an accessibility audit passed.
- Google Accessibility Scanner 2.5.1.896851528: installed from the official Google LLC Play Store listing after owner sign-in; opened and service/shortcut configured on sb40_four_items. First Home snapshot completed with six suggestions (five unexposed-text candidates, one touch-target candidate). Full audit and manual triage remain pending. No credentials entered by automation or APK mirrors used.
- Appium: optional second framework, deferred to avoid duplicating Maestro.

Scanner UI note: hierarchy inspection interrupts its accessibility overlay. For Snapshot, operate the observed scanner controls and inspect screenshots without attaching a hierarchy dumper until the results activity appears. Pause the Scanner service and its shortcut overlay for visual comparisons; do not mask app areas to hide testing controls.

The Android-only lifecycle flow uses the existing fictional `SB40 Parity shared-journey-v3-20261108` fixture and returns it to Active. Run only through the pinned guard: `python3 scripts/parity/run-parity.py android --flow lifecycle --run-id UNIQUE_ID`. iOS lifecycle evidence uses the corresponding v4 fictional fixture and the scoped native session script. Never substitute an owner record.

## Execute

From the repository, run:

```sh
python3 scripts/parity/run-parity.py android --flow capture --run-id UNIQUE_ID
python3 scripts/parity/run-parity.py ios --flow capture --run-id UNIQUE_ID
python3 scripts/parity/run-parity.py android --flow journey --run-id UNIQUE_ID
python3 scripts/parity/run-parity.py ios --flow journey --run-id UNIQUE_ID
```

Use unique IDs. The guard checks bundle/executable hashes on iOS and APK plus AVD on Android before UI execution. iOS additionally refuses to proceed over any existing draft. No flow clears app state. References permit capture only. Do not update sb40-targets.json to bypass a failed guard. Wrong-build negative checks use `--prove-guard-rejects`.

Capture checks Home, Add Memory, and inline Location editing, then cancels the unsaved blank form. Journey adds an explicitly fictional `SB40 Parity ...` memory and linked reminder through native controls, searches it, and checks that reminder Save returns to that memory. Test records are retained for inspection. References require explicit `--reference` with their own device booted; keep only one CasitaDex iOS simulator and one Android emulator active. Never reset, wipe, or uninstall to make a test pass.

Compare a verified same-platform reference and candidate:

```sh
node scripts/parity/compare-screens.mjs REFERENCE_DIR CANDIDATE_DIR ios
python3 scripts/parity/summarize.py
```

Capture file hashes are checked against their reports. Dimensions must match. Differences above the threshold require review; no automatic baseline promotion. Pixel differences between iOS and Android are not a valid visual baseline because native system rendering differs. Inspect visual masks and diff images before accepting any result.

This initial suite does not establish full release readiness, offline/media coverage, full accessibility acceptance, or Event Command parity. Historical `.dev` flows were withdrawn to docs/qa/withdrawn-maestro-dev-20261108 because they target the wrong baseline.
