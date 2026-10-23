# SB-28 Two-Tone Dark Focus Review — 2026-10-23

Figma master 39uzN0SZX8nlmcGDcHdQhr, isolated board 195:54. Apple candidate button 195:55 and separate gold halo 195:57; Android candidate button 195:58 and separate halo 195:60. Screenshot rendered successfully. No approved source components or platform authority screens changed.

## Contrast calculation
Dark-mode light sage button fill RGB (.77255,.87451,.78039) vs semantic dark text/primary RGB (.090196,.239216,.180392): 8.46:1. Dark review surface RGB (.09412,.24706,.18824) vs gold halo RGB (.95,.65,.25): 5.74:1. Both exceed 3:1 for their respective directly adjacent boundaries. Deep stroke is paint-bound to text/primary token VariableID:29:6, Dark mode. Gold halo is a separate locked rectangle and NOT a functioning focus indicator.

## Open gate
Two-tone focus treatment is a contrast-verified design candidate for these colors only, not an accepted native focus implementation. Confirm halo stacking, non-occlusion, spacing, accessibility focus navigation, pressed feedback, text scaling and hitboxes on iOS/Android. Do not promote until device and owner visual acceptance.