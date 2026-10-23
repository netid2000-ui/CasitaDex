# SB-28 Native Button Contrast Audit — 2026-10-23

## Scope and method
Live Figma UI master 39uzN0SZX8nlmcGDcHdQhr, isolated review board 181:40. Read resolved solid paint colors for linked text and button backgrounds (or review panel for outlined buttons). WCAG relative luminance: linearize sRGB channel, L=0.2126R+0.7152G+0.0722B; contrast=(Llighter+0.05)/(Ldarker+0.05). Ratios rounded to 2 decimals. These are Figma specimen calculations, not device screenshots or full accessibility certification.

## Results
- Apple Light 181:42: white label #FFFFFF on native button #0088FF; 3.52:1, FAIL normal-text 4.5:1.
- Apple Dark 181:46: white label #FFFFFF on native button approximately #0091FF; 3.23:1, FAIL normal-text 4.5:1.
- Android Light 181:50: native label approximately #49454F on white review panel #FFFFFF; 9.34:1, PASS normal-text 4.5:1.
- Android Dark 181:57: native label approximately #CAC4D0 on CasitaDex review panel #17211F; 9.66:1, PASS normal-text 4.5:1. The review panel is not a verified native Material 3 surface token.

## Gate and remediation
BLOCK promotion of Apple blue/white prominent button styling until semantic CasitaDex color adaptation passes 4.5:1 in both modes (or an explicitly justified alternate WCAG category is verified). Do not modify source Apple kit or accepted A.2 CTA. Android text contrast passes only the tested specimen combinations; verify border contrast, focus, disabled usability, larger text, 44pt/48dp effective hitboxes and native rendering. No release or source promotion authorized.