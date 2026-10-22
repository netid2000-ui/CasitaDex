# CasitaDex nine-discipline skills curriculum
Updated 2026-10-20. Research-only; no app code, devices, deployment or approval gates changed.
Charter: PRODUCT_CHARTER.md v0.7 (2026-10-15). Rule: Fewer features. Faster answers. Home-first, offline-first, no Firebase/cloud in V1.
Evidence rule: distinguish verified official guidance, prior practice, hypothesis and actual native acceptance. Never infer device PASS from unit tests.

1. Product/project management: maintain dependency-gated super-batches and evidence ledger. Practice: SB24 source/APK reconciliation matrix. Exit: every PASS links a test and artifact.
2. Technical architecture: map SQLite, reminder, media, recovery transaction ownership and local source of truth. Practice: mutation/rollback dependency diagram. Exit: invariants and rollback documented.
3. Android/iOS engineering: audit Android cloud/D2D backup extraction rules and iOS file-protection lifecycle. Practice: platform backup policy matrix. Exit: version-specific plan, no unapproved code change.
4. UX and visual design: answer-first hierarchy, consistent verified/freshness signals, reversible actions. Practice: signed SB20 Home/Find/Answer gap review. Exit: answer is prominent and warnings match behavior.
5. Accessibility: Android 48dp targets, 4.5:1 normal-text contrast, TalkBack; Apple Dynamic Type up to 200%, VoiceOver. Practice: restore-preview spoken navigation and large text. Exit: recorded native evidence.

6. Security/privacy: document permissions, data flows and backup exclusions.

