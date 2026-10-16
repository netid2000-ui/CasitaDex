# SB-18 — Concept-to-Native Implementation Readiness Map
Date: 2026-10-15. Status: DESIGN CONTRACT — native changes not yet made.

## Baseline architecture verified in repository
- Expo Router routes: src/app/index.tsx, answers.tsx, add.tsx, card.tsx, more.tsx and _layout.tsx.
- Current native top navigation: Today · Answers · Add · More, rendered by src/app/_layout.tsx. Proposed mobile tab placement changes are a later SB-19 implementation and QA gate, not a change in this prototype.
- src/screens.tsx already exposes Today, Answers, Add, Card and More flows with offline text data, share, confidence, dates and media picker.
- src/model.ts stores Space, Answer Card, confidence/source/location/history, and MediaReference. SQLite + file-managed photos and media backup are implemented for Android Staging; 20MB media export cap remains, not production-ready arbitrary media.
- src/ui.tsx and theme.ts implement light/dark styling and a manual large-text option. Dynamic OS text scaling, TalkBack/VoiceOver and native safe-area/contrast acceptance remain required.
- Direct camera shooting, voice recording, speech-to-text, on-device OCR, entitlement system, premium plan purchase and cloud provider OAuth are NOT implemented or authorized for cloud activation.

## Mapping from design to code and release gates
| Prototype | Native baseline | Implementation gate |
|---|---|---|
| First visit | Today empty state; optional examples | Improve language, simple one-answer task; no setup tour or paywall |
| Home | Today currently shows action buttons and Needs attention | Make search prominent, concise recent answers, quiet trust signal |
| Find + Spaces | Answers search; neutral Space data model | Show exact answer in results, Spaces browse in Find; A/B navigation before commitment |
| Answer detail | Card route, existing local photo picker | Make key fact visually strongest; photo zoom, context, trust, source |
| Add | Existing Add text and image attachment | Clear single-field start, draft interruption persistence; camera and voice require separate native permission/storage designs |
| Storage & backup | More and existing SAF media export/import | Full local counts, backup status distinctions, larger streaming format and encrypted export before premium cloud |
| Optional Complete / Cloud Care | No native paywall or billing | Design-only; no purchase route until entitlement/store/security ADR approved |
| Accessibility | Copy/useTheme large toggle | OS Dynamic Type, TalkBack, safe-area/foldable, keyboard focus and permission dialogs require native acceptance |

## Photo and voice architecture to research before implementation
Photo capture should save app-owned bytes with format/size checks; UI must show true original versus optimized copy status; permit denial fallback to manual text. Voice notes must store source audio in private local files, maintain duration/type/digest metadata and safe user deletion. Backup manifest must include voice and image payloads; streaming is required beyond 20MB; exact encryption and recovery design is unapproved. Transcription should be separate optional derived text, local-only by default and subject to device availability.

## Purchase boundary
Core records, storage schema, export/restore and accessibility never depend on premium entitlement. Store receipt, local cache, expiry/grace periods and disabled-network handling belong to an isolated capability service; cloud provider OAuth must not be coupled to reading local records. Paid automation is not sync. A provider failure must not corrupt or delete local originals.

## Design QA evidence and limitations
Interactive review file: SB18_household_memory_interactive_concept.html. Reproducible browser smoke: node docs/design/verify-sb18-prototype.mjs. Screenshot files are rendered example screens (390px mobile) and have fictitious data. This is a browser-only design demo, not a build artifact or proof of Android/iOS visual/accessibility acceptance. Screens and labels may change after moderated UX research.

## Status & next gate
Proceed with accessibility/state specs, moderated research and owner screen-review. Preserve dirty owner RECOVERY_RUNBOOK.md. Do not push/deploy Production, introduce paid third-party SDKs, open source connections, launch subscriptions, wipe emulator data, or disturb SB-17 Windows upgrade.