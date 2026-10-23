# SB-28 Native Button Comparison — 2026-10-23

## Live review board
UI Master file 39uzN0SZX8nlmcGDcHdQhr; Resource Intake page 143:2. Created isolated review board 176:10, with linked-instance clones Apple 176:13 (source 174:359) and Android 176:18 (source 146:547). Approved platform masters and CTA source were not replaced.

## Observed properties
Apple iOS 26 Button - Content Area: 66x28, horizontal Auto Layout; SF Pro Regular 15; variant Size Small, Style Bordered - Prominent, Label Type Symbol + Text, Enabled True, Destructive False; label Play. Imported component set 174:22 (144 variants).
Android Material 3 Button - outline: 95x48, horizontal Auto Layout; Roboto Medium 14; variant Type Round, Size Small, State Enabled; label Label. Imported component set 146:50 (50 variants).

## Decision gate
Both are REFERENCE ONLY, not approved CasitaDex UI components. Preserve platform-native differences while mapping semantic CasitaDex tokens and A.2 styling. Apple 28pt visual height requires confirmation of 44pt effective hit area or a larger variant. Android 48px visual height requires hitbox verification. Pending visual screenshots, light/dark contrast, dynamic type, focused/disabled states, offline QA, rights/provenance and owner acceptance.