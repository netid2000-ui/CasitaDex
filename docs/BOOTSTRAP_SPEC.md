# CasitaDex prototype super-batch — 2026-10-07
ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.

## Authority and scope
The current owner request authorizes isolated prototype/bootstrap implementation, superseding the earlier design-only gate in the preserved charter for this bounded batch only. Production, public launch, paid infrastructure, store submission, trademark filing, Firebase and other cloud resource creation remain unauthorized. SB-13 is not started.

## Source
Starter extracted without Event Command app files or credentials from netid2000-ui/event-command-by-fa at 8c5dd4e9d792fa408afaeaef568e1369ed547edc. Implementation baseline 3a6464f8a663237c10220e4b99a7340fe55fdcef. This is initial validated starter reuse, not a claim of final SB-12A acceptance.
Both starter variants and ten original guardrail tests passed locally before rendering.

## Acceptance specification
- Today: genuine due reminders and cards needing checking; first-run prompt.
- Answers: searchable answer-first cards; Buy/Store, Fix, Find, Maintain, Share projections.
- Add: short labeled form, required title/answer, explicit confidence, recoverable validation.
- More: text-size preference, disclosed versioned export/import, support and privacy.
- Share: default no selection; preview exact fields; explicit user action to invoke device sharing. No automatic send.
- Local persistence: save only confirmed writes; failed reads preserve stored data and block edits; import validates before replacing and keeps recovery copy.
- Accessible controls >=48 dp, headings, labels and selected states; uncapped system font scaling; wrapping layout; no motion dependency.
- Environment allowlist; independent Development/Staging native identifiers, schemes and storage keys; no Production profile/project ID/secrets.
- Run domain/recovery/config tests, TypeScript, lint, Expo Doctor, web export and browser smoke. Native device and screen-reader acceptance stays pending without actual evidence.

## Prototype decisions
Use the starter's AsyncStorage for a small versioned structured prototype dataset behind a repository boundary. SQLite remains the planned durable structured database evaluation before Local MVP acceptance; no SQLite durability claim is made here. Media capture, operating-system reminder scheduling and purchase restore are deferred and labeled unavailable. Reminder due dates and maintenance history work within the app.
Demo examples are opt-in, explicitly labeled, and never represented as facts about the user's home.

## Governing evidence
Inherited platform and accessibility standards: SB_12A_DESIGNS_BY_FA_APP_STARTER_2026-10-07.md and SB_10_ACCESSIBILITY_COMPLETION_2026-10-06.md at the pinned source revision.
Research: https://docs.expo.dev/versions/v57.0.0/ ; https://docs.expo.dev/router/installation/ ; https://reactnative.dev/docs/0.86/accessibility
