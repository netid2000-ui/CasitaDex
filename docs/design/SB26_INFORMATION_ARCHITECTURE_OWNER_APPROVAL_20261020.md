# SB-26 Information Architecture - owner-approved direction
Date: 2026-10-20. Design approved; implementation and native acceptance not yet claimed.

## Navigation
Five destinations: Home, Memories, Photos, Reminders, Find. Answer is a result/detail, not a separate tab. Preserve edit guards and accessible navigation.

## Home: deliberately uncluttered
No Recent Memories, memory cards, photo galleries, statistics or duplicate editing controls. Show compact approved light/dark color logo. Two primary actions: Add Memory and Find Something. Show at most three upcoming/due reminders with View all. Collapse empty reminder content. Primary actions visible without scrolling on ordinary phone sizes, except accessibility scaling.

## Dedicated pages
Memories: list, create, edit, lifecycle, categories, optional cross-links. Photos: browse, capture, attach, replace, detach and open linked memory, with no duplicated asset or unsafe deletion. Reminders: Today, Upcoming, Overdue, Completed; standalone and optional memory links. Find: search, answer/detail and cross-links.

## Safety and design gates
Preserve SB24 restore/media recovery and SB25 storage/ownership safeguards. Do not invent memory-reminder links before schema and migration review. No false notification claims. Use official Apple and Google Material design references and custom CasitaDex Figma tokens. Accessibility and App Store/Play Store traceability required before release.
Development only, no Samsung, wipe, commit, push, merge or deployment.

## Current code inventory
src/app/_layout.tsx currently has Home/Find/Add/More; src/eng-screens.tsx already has EngHome, EngPhotos, EngReminders, EngFind. Existing Home has Photos/Reminders commands and due-memory links. This is a design specification, not a completed navigation implementation.

## SB26 expanded owner-approved scope: store readiness and design system
- Apple official Human Interface Guidelines and Apple Design Resources/Figma iOS kit: reference for native iOS layout, navigation, controls, Dynamic Type, VoiceOver, safe areas and review readiness.
- Google Material 3 and official Figma Material Design Kit: reference for Android components, navigation, adaptive layout, TalkBack and large text.
- Figma shared CasitaDex design system: approved exact logos/light-dark variants, typography, spacing, color/contrast tokens, components, states and handoff; avoid generic template copying.
- Store readiness traceability matrix: Apple App Review Guidelines and Google Play policies; map each applicable requirement to implementation, test, evidence, owner and status.
- Prepare privacy policy, App Privacy and Play Data safety disclosures from audited actual SDKs, permissions, data flows and backup behavior; do not assume no collection without audit.
- Verify app stability, offline behavior, restoration, permission prompts, platform accessibility, screenshots, metadata, support contact, account requirements, reviewer notes and target SDK at submission time.
- No UI kit or template guarantees Apple or Google approval; only the store review process decides.
- Acceptance: screen specifications, platform differences, accessible components, iOS and Android device QA, and store checklist; no release until release gates pass.
