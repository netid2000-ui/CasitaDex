# WORK-SB48 — CasitaDex native regression preparation

Prepared November 4, 2026 (America/Chicago), on FA-MAC-DEV-01 through AI Commander. Input branch `work/cd-sb41-edit-targeting-20261104`, revision `582e3a9`. Existing accepted YAML and simulator data were preserved. These are additive source-derived flows; **native execution NOT RUN**. Syntax validation does not establish selectors, persistence, notification delivery or accessibility acceptance.

## Safe execution contract

Use a dedicated existing Development QA device; record its explicit UDID/serial, installed bundle ID, build/source SHA, lockfile SHA256, OS, appearance, orientation, font size, network and assistive technology state. The supplied app ID is `com.designsbyfa.casitadex.dev`; do not run against another package without identity reconciliation. Do not clear state, reinstall, reset simulator, delete drafts/photos or seed over existing data. Do not execute two flows on one device concurrently.

Before adding a fixture, inspect Home for an existing draft. The create flow fails if Resume Draft exists; preserve that draft and use another QA device or resolve it through an agreed normal workflow. Use a fresh unique fictional title containing only letters, digits and spaces (selectors use regular expressions), and a short unique answer. Check the fixture is not already present. Save a user-controlled full backup including photos and draft before native work; keep private data outside Git.

All flows require `TITLE` and `ANSWER`; reminder also requires future `DUE_DATE` in YYYY-MM-DD format and a fixture with no reminder. Run the helper only through the parent flow. Example (replace device with verified QA UDID):

```sh
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
MAESTRO=/Volumes/FA-Development/Designs-by-FA/Tools/MaestroCLI/bin/maestro
"$MAESTRO" --device VERIFIED_QA_UDID test -e TITLE="FA SB48 unique 001" -e ANSWER="Fictional blue filter" --test-output-dir /Volumes/FA-Development/Designs-by-FA/QA-Evidence/WORK-SB48/run-001 .maestro/work-sb48/create-draft-recover.yaml
```

Use distinct evidence output directories per run/configuration. Never interpret a successful script launch as a passing test. Capture Maestro inner exit code, remote job exit, assertions, screenshot paths and elapsed times. Fields currently use visible label index 1, based on accepted prior test conventions; native selector calibration remains required.

## Executable flows and dependencies

| Flow | Setup and assertions | Boundary |
| --- | --- | --- |
| create-draft-recover.yaml | No existing draft; create unique title/answer, Keep draft and leave, restart, resume, Save memory, restart and reopen exact fixture | Creates only one fictional memory. Fails closed when a prior draft is present. |
| edit-save-relaunch.yaml | Dedicated fixture whose answer is exactly ANSWER; append SB48 persisted, Save, restart, verify exact updated answer | Run once per fixture; it deliberately modifies only the fixture. No silent re-runs. |
| cancel-return.yaml | Open fixture, append unsaved title suffix, Cancel edits, restart and assert original fixture remains and suffix absent | Does not save temporary edit. Does not establish search/scroll return context. |
| five-photo-integrity.yaml | Dedicated saved fixture with exactly five fictional images; opens each numbered image and captures evidence before/after restart | Source labels verified; visual comparison of original images remains required. |
| photo-viewer.yaml | Dedicated fixture already containing a manually selected fictional image; open photo 1, Zoom in/out, Close, restart and reopen photo | Native image pixel integrity and photo picker acceptance require visual evidence. |
| linked-reminder-save.yaml | Dedicated no-reminder fixture; set future DUE_DATE, Save, restart and verify date | Date persistence only. Notification scheduling/delivery is a separate blocking gate. |
| responsive-reachability.yaml | Existing fixture; inspect Detail and Edit; scroll Save/Cancel into reach and cancel | Repeat at landscape and maximum supported OS/app text, light/dark; screenshot inspection required for clipping. |
| open-fixture.yaml | Shared launch/Memories/open/assert helper | Not a standalone acceptance scenario. |

Offline: disable networking on the **dedicated device** using supported device controls, record actual offline status, then run create-draft-recover and edit-save-relaunch with distinct fresh fixtures. Keep offline through stop/launch and image viewing. Restore only the prior network setting after evidence. A flow does not itself prove airplane mode. Repeat online and after supported device reboot; do not erase device state.

## Photos and viewer full scenario

1. Prepare five clearly distinguishable, fictional, non-sensitive sample images using the normal native picker; preserve existing device images. Use Add Photo Memory, set unique title, select one image; verify draft remains after picker Cancel. Add images 2–5 and verify Photos (5/5), all thumbnails and disabled sixth add. Save, reopen, restart offline, verify all five originals and orientation.
2. Run photo-viewer.yaml on that fixture. Inspect the rendered image and zoom boundaries (1x–4x), close returns to the same originating photo/list and all controls remain reachable at XL/landscape. Record individual image checks and attached/unattached-photo behavior.
3. **Implementation gap:** current src/eng-screens.tsx PhotoViewer only exposes Close photo and Zoom in/out, with one path. Next/Previous/swipe/pinch behavior requested by the owner is not implemented in this source. Do not author a misleading passing assertion or substitute repeated close/open for accepted gallery navigation. Add the missing viewer interaction and exact return context before native acceptance.
4. Native picker/camera permission granted, limited/denied and user cancellation require platform-specific execution and evidence. No test removes pre-existing photos.

## Linked reminders and notifications

Run linked-reminder-save on a fresh synthetic fixture and separately create an equivalent standalone reminder through the actual UI with a near-future due time. Record timezone, OS clock, permission state, app foreground/background/terminated state, due time, delivered time, notification ID, linked record ID and destination after tapping. Compare linked versus detached delivery, restart/reboot, denied permissions, overdue/completed filtering, edit/reschedule and completion. Completion must suppress or replace obsolete requests without affecting another reminder.

**Blocking source finding:** this starting branch has no src/reminder-alert-plan.ts or src/reminder-alerts.native.ts, no expo-notifications dependency in package.json, and standalone-reminders.native.ts persists SQLite rows. Saving the linked date proves storage only. Trace the active installed build and any historical candidate implementation before adding a notification scheduler; do not import an unreviewed dirty candidate. linked-reminder-save intentionally does not assert delivery. Native notification automation is blocked until a verified scheduler and exact OS selectors exist.

## VoiceOver / TalkBack execution card

Maestro taps and accessible-tree visibility do not prove spoken announcements, focus order or usable screen-reader gestures. On dedicated iOS/Android QA devices enable VoiceOver/TalkBack through supported OS settings, record original setting and restore it afterward. With screen-reader gestures, execute Home→Find→Details→Edit→Save/Cancel→Return, Photos→viewer→Close, Reminders→Save→Details and failed-save recovery. Verify announced names/roles/value/disabled/selected/errors, heading navigation, logical focus, modal focus/escape and return focus, keyboard dismissal, no hidden focus targets, target size, non-color status cues and no critical gesture-only action. Record video/observer transcript privately and sanitized outcomes in Git. Run responsive-reachability with assistive technology only as a complementary structural check, not spoken acceptance.

## Save, Cancel, Return and recovery gates

| Gate | Required evidence |
| --- | --- |
| Save durable | Exact values persist after restart offline; previous accepted title test retained unchanged. |
| Cancel | cancel-return.yaml plus all other editable fields; no data write and return to correct Details. |
| Draft recovery | create-draft-recover.yaml; restart before Save; original draft/photos retained if any failure. |
| Failed Save | Safely inject a QA-only storage failure in a dedicated candidate (not by disk exhaustion or corruption); error announced, draft retained, retry once without duplicate. Not currently automated. |
| Return context | Search query/filter/page/scroll and originating photo preserved; inspect before/after. Helper reopening through Memories is not context evidence. |
| Dirty navigation | Attempt native Back while editing; Keep edits prompt and no silent loss; Cancel and Return separately. |
| Device reboot | Supported reboot of isolated QA device only after coordination; reopen and verify records/media/reminder settings, not merely app launch. |

## Evidence status and next actions

Preparation complete for eight YAML files; all native scenarios remain NOT RUN. Syntax validator results are recorded separately after execution. No accepted test overwritten, no app source modified, no simulator operated by this workstream.

Priorities: (1) match installed QA build to branch, calibrate selectors non-destructively; (2) run unique-fixture draft/offline/Cancel cases on a reserved device; (3) prepare five-photo fixture and resolve viewer navigation gap; (4) reconcile notification implementation before delivery testing; (5) execute responsive and human assistive-technology cards on both platforms. Final physical-iPhone signoff remains with the owner.

References: https://docs.maestro.dev/reference/commands-available/runflow ; https://docs.maestro.dev/reference/commands-available/scrolluntilvisible ; https://docs.maestro.dev/reference/commands-available/launchapp . Commands are validated against the installed Maestro parser; native selector and platform behavior remain unverified.

## Preparation verification

- Installed Maestro 2.12.0 with existing OpenJDK 21 at /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home.
- Initial check-syntax directory invocation failed because CLI accepts one YAML file; corrected to one invocation per file.
- Seven individual syntax checks passed, remote job e1552863dcee416f exit 0, 2026-11-05T00:44:20Z–00:44:32Z (November 4 local). Regex punctuation in field labels was then escaped and all seven checks rerun; final evidence is recorded below.
- No native runs or simulator changes occurred. Parsed flows are ready for device identity and selector calibration, not accepted native regressions.

Eight-flow final parser verification includes five-photo-integrity.yaml, which adds explicit coverage for opening all five saved photos before and after relaunch. The fixture must be created through the normal UI, and sample image appearance checked against captured screenshots. No fixture images are inserted automatically.

Final verification: job 58f6873e0488e5a5 exited 0; eight individual Maestro check-syntax results OK; 2026-11-05T00:45:36.702Z–00:45:48.895Z (November 4 America/Chicago). Prior accepted YAML diff exit 0 in job 905b391fe2a55934; no accepted flows modified.
