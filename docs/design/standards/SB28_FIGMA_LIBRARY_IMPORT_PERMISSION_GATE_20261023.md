# SB-28 — Figma library discovery and import permission gate (2026-10-23)
UI Master resource page 143:2, review register 144:2.

## Resolved discovery
Scoped search of subscribed iOS and iPadOS 26 library returned component set `Button - Content Area`, key aa1e2901a821ff24d484362e7e8e70378ee7d388.
Scoped search of subscribed Material 3 Design Kit returned component set `Button - outline`, key dd2040219668454df5aa170434636aa823624c1a.
The earlier unscoped search returned zero matches; scoped discovery works.

## Live import attempt
Tried figma.importComponentSetByKeyAsync(Apple key) in review-only resource page. Figma returned: `Not permitted to upsert from library` for the subscribed Apple kit. The script stopped at the first sample; no Apple or Android review instance created. This is an authorization/capability gate, not evidence that assets are absent or license-approved.

## Next safe steps
Check library permissions and supported linked-instance import workflow; do not bypass authorization, detach copied components or replace approved masters. After permission is resolved, import one bounded Apple and Android review instance and inspect editable properties, theme and accessibility. Owner-approved Warm Editorial A.2 remains authoritative.