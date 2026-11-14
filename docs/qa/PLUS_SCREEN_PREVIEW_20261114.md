# Plus screen preview — November 14, 2026

Settings now opens /plus from a CasitaDex Plus entry. The screen presents the approved Figma 1266:2 offer with a fixed Settings return above scrollable content, an unavailable checkout button, Restore Purchases feedback and Not now return. This is explicitly a preview: purchases and the free-plan limit remain disabled. Existing memories, drafts and photos are not touched.

Validation on FA-MAC-DEV-01: TypeScript and changed-file ESLint PASS; nine targeted policy/controller/screen tests PASS. Visible iOS Device Hub QA verified Home → Settings → Plus, scrolling while Settings stays fixed, tapping Restore Purchases and seeing the unavailable-preview message. Native evidence: native-gallery-evidence/plus-restore-unavailable.png. Tested only isolated com.designsbyfa.casitadex.pluswindowqa on simulator 879C620A-5318-4BDF-98B9-904EE635B053; JS/assets bundled into existing SB40 native shell, no native dependency changes. No photo acceptance repeated.

Native integration check: this checkout contains a local reminder-alerts module but no native purchase module. Store verification, product identifiers/catalog, localized store price, transaction completion and durable entitlement refresh remain unimplemented. Price shown is the approved design amount, not a fetched store offer. Restore Purchases currently exercises the unavailable adapter path only. No successful purchase/restore claim, store configuration, live transaction, production release or physical-device acceptance.

Next: implement and qualify the native store adapter, then replace preview-only purchase handling with verified catalog/purchase/restore state. Keep paid access enforcement disabled until those paths work.
