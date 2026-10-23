# SB-28 — Apple Figma library import acceptance (2026-10-23)

## Owner action
Owner opened the Figma desktop website from iPhone Safari, navigated Assets > iOS and iPadOS 26 > Buttons > Button - Content Area, and used Insert instance on the resource review page. Screenshot confirms the selected instance with source library and variant controls.

## Live verification
UI Master file 39uzN0SZX8nlmcGDcHdQhr, Resource Intake page 143:2. Instance 174:359 `Button - Content Area`, position (-33,384), 66x28; linked main component variant `Size=Small, Style=Bordered - Prominent, Label Type=Symbol + Text, Enabled=True, Destructive=False`.
Automated figma.importComponentSetByKeyAsync(aa1e2901a821ff24d484362e7e8e70378ee7d388) now SUCCEEDS; imported component set 174:22, 144 variants. Previous `Not permitted to upsert from library` gate is closed for this iOS 26 asset. Exact first-use mechanism (license vs permission activation) remains unproven. Do not infer iOS 27 access or blanket license approval.

## Remaining gates
Review instance placement and native accessibility: 66x28 visual component needs appropriate 44pt iOS touch target. Audit color modes, contrast, text scaling, variants and A.2 semantic token mapping before promoting. Maintain approved masters unchanged. Android Material 3 reference 146:547 remains review-only. No app implementation, deployment or release accepted by this test.