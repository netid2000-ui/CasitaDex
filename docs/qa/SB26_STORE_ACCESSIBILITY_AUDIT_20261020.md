# SB26 Store and Accessibility Audit - 2026-10-20

Status: PARTIAL. Development-only evidence; not store approval.

## Verified
- Native disposable emulator-5582 uses font scale 1.3; two photo-bearing memory cards and first viewer were accessible in Android UI hierarchy. Spoken TalkBack and visual screenshot/pixel checks are NOT passed.
- TalkBack package com.google.android.marvin.talkback is installed, but enabled_accessibility_services was null; spoken acceptance remains pending.
- Development Android application package com.designsbyfa.casitadex.dev is targetSdk 36, minSdk 24, versionCode 1.
- Android INTERNET and CAMERA permissions are declared; CAMERA was not granted during inspection. Microphone was not observed in targeted manifest output.
- app.config.js specifies Android allowBackup false, photo-picker permission copy, microphonePermission false and Production configuration intentionally unavailable.
- Source regression 328 total: 321 passed, 0 failed, 7 skipped; TypeScript and ESLint passed. Real SB26 archive tests separately 5/5 passed.

## Official policy checks
- Google Play target API: as of August 31 2026 new standard mobile apps/updates require Android 16 (API 36) or higher. Verified target 36 meets this single requirement. Source: https://support.google.com/googleplay/android-developer/answer/11926878
- Apple App Privacy requires declarations of privacy practices for new submissions and updates. Source: https://developer.apple.com/app-store/user-privacy-and-data-use/

## Open release gates
- Verify actual network traffic and all SDK/vendor data collection before claiming no data collection or completing Apple App Privacy / Google Play Data safety forms.
- Author approved public privacy policy URL, accurate store listing, screenshots, age/content ratings, review notes, support contact.
- Signed release build identity/package, icon assets and adaptive icons, signing, AAB, device compatibility, crash/ANR, Play prelaunch, Apple iOS device and VoiceOver.
- Spoken TalkBack traversal and action labels; manually inspect 130 percent text, contrast, truncation, and focus ordering.
- SB25 global storage warning policy remains blocked pending owner scope decision. No Staging or Production action authorized.

No commits, pushes, submissions, deployment, source changes or physical phone operation in this audit.

## 2026-10-20 disposable emulator TalkBack service test

- Verified emulator-5582 booted and font scale remained 1.3. TalkBack package service found at `com.google.android.marvin.talkback/.TalkBackService`.
- Enabled TalkBack accessibility service temporarily on disposable emulator-5582 only. Android `dumpsys accessibility` confirmed its service listed among Enabled services.
- With TalkBack active, UI automation hierarchy of the native photo viewer exposed clickable controls with nonempty accessible names: `Close photo`, `Zoom in`, and `Zoom out`. These controls were programmatically discoverable.
- Restored emulator accessibility settings afterward: `accessibility_enabled=0`, `enabled_accessibility_services=null`, `Enabled services:{}`. Accepted emulator-5580 and physical Samsung never modified.
- PASS limited service activation and native viewer label presence. NOT PASS spoken output intelligibility, logical swipe reading order, TalkBack gesture completion, focus announcements, full-screen visual pixel audit or human accessibility signoff.

## 2026-10-20 privacy disclosure evidence extension

- Searched first-party src/*.ts and src/*.tsx recursively for fetch, axios, http URL, WebSocket, analytics, telemetry and Sentry. Only hit: existing help copy in src/screens.tsx stating no account, ads, analytics or cloud service. This is source-scan evidence only, not native network proof.
- Development config sets backendMode none and productionAuthorized false; network permission remains declared in Android manifest. SDKs, system frameworks, optional native network behavior and iOS still require validation.
- Apple official guidance requires App Privacy disclosure including integrated third-party partners; see https://developer.apple.com/app-store/user-privacy-and-data-use/ . Apple review also requires privacy policy URL in listing and inside app; see https://developer.apple.com/app-store/review/guidelines/ .
- Google Play Data safety responses remain developer responsibility including app/SDK practices; see https://developers.google.com/android/guides/play-data-disclosure .
- No claim of zero data collection or zero transmission is made; no store form submitted.

## Recommended nonrelease follow-through
- Capture network behavior under first launch, photos, backups, reminders, cold restart, offline mode; audit Expo/RN and native dependencies, distinguish OS or Play services traffic from app/SDK traffic.
- Draft precise privacy policy with local storage, optional user-directed sharing/backups, retention and deletion limitations, camera/photo permissions, and support contact only after full implementation review.
- Keep TalkBack human spoken acceptance, focus order, iOS VoiceOver and screenshot/pixel checks open.

## Final automated display variants
- Local-only disposable 5582 captures at font 1.3 light/dark and font 2.0 light saved under C:\cdr\sb26-final-a11y-20261020. Automated click-label scans: 130%-light 11/11 named; 130%-dark 11/11 named; 200%-light 10/10 named, with the three create actions plus navigation tabs detectable. Restored original font 1.3 and light appearance. Human spoken gestures, reading order, and screenshot pixel inspection remain OPEN.
