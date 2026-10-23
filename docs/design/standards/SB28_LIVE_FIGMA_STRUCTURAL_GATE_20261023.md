# SB-28 Live Figma Structural Gate — 2026-10-23
UI master: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
Method: live read-only Figma Plugin API inspection; no Figma nodes altered.

## Verified inventory
- Semantic Colors collection 29:2: 12 COLOR variables; Light and Dark modes. Closure Primitives collection 47:2: 11 COLOR variables; one mode.
- Primary CTA component set 109:111: 12 COMPONENT variants, 12 TEXT nodes, 0 bound-variable nodes, 0 Auto Layout nodes. Do not call this token-bound or responsive.
- iOS Home 28:38: 52 inspected nodes, 18 frames, 31 text, 3 instances; 1 node with variable binding, 0 Auto Layout nodes; LOGO placeholder text node 28:43.
- Android Home 28:265: 52 inspected nodes, 18 frames, 31 text, 3 instances; 1 node with variable binding, 0 Auto Layout nodes; LOGO placeholder text node 28:270.
- Apple and Android authority pages 25:2 and 25:30 exist. Later review pages are not automatically owner-approved.

## Gate result: FAIL / remediation required
1. Design tokens exist but CTA and Home instances are not consistently bound; inspect actual intended fills and semantic roles before binding.
2. CTA variants and Home layouts are not Auto Layout; evaluate and refactor on isolated REVIEW candidates before approved-master adoption. Avoid geometry-changing bulk conversion.
3. Replace LOGO placeholders only using exact approved Figma Brand Master asset after provenance/geometry confirmation; no redrawing.
4. Verify state coverage, contrast, responsive long-text, Apple HIG/Material provenance, Dev Mode/Code Connect and independent native acceptance.
5. Owner approval is required before candidate promotion; do not claim screen approval, native acceptance or release readiness.

Evidence: live read-only inspection of named nodes and variable collections; structural counts recorded above. This file is an audit, not a claim of implementation.