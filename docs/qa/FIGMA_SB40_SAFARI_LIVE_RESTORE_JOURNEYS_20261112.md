# Safari live Figma restore/recovery journeys — November 12, 2026

## Authorization and environment
Owner explicitly authorized enabling Allow JavaScript from Apple Events. Safari requested local password authentication; assistant did not enter or obtain a password. On resumption, no authentication prompt remained and actual do JavaScript succeeded on existing Figma prototype tab 1, window 1. Previous Safari blocker is resolved.
Figma Adapt content for screen readers enabled via existing Options > Advanced settings > Accessibility settings to expose the real prototype controls. This preference remains enabled. No other Safari security settings changed.
Execution: FA-MAC-DEV-01 only, Safari existing authenticated Figma session. Actual DOM button clicks using data-prototype-a11y-clickable; destinations and rendered accessibility content checked after each action. These are browser interactions, not a static action interpreter.

## Thirteen observed prototype actions
1. Keep-current selected state 875:138 -> Restore backup -> 888:2; confirmation explicitly says current unfinished draft kept.
2. Cancel -> 875:138; checkmark retained on Keep current draft.
3. Use backed-up draft -> 875:153; selected checkmark changes.
4. Restore backup -> 888:31; confirmation explicitly says backed-up draft restored.
5. Cancel -> 875:153; selected choice retained.
6. Restore backup -> 888:31.
7. Confirm restore -> 875:290; correct backed-up-draft example completion text.
8. Back -> 875:2.
9. Recover previous full save -> confirmation overlay; URL stays 875:2, live content shows recovery question and Cancel/Recover full save.
10. Cancel -> Backup & restore content restored.
11. Reopen Recover previous full save -> same confirmation overlay.
12. Recover full save -> 875:222; recovery completion example and previous-state explanation.
13. Back -> 875:2; original backup controls available.

All thirteen observed actions passed their destination/content assertions. Keep-current Confirm completion was not executed in this cycle; only its confirmation and Cancel were exercised. Earlier static route verification remains separate.

## Scope and handoff
Figma review board 1006:2 updated to reflect live results and remove Safari blocker.
No native app tests, backup imports, real data recovery, builds, installations or app source edits performed. Completed photo testing remains closed. Accepted SB40 and owner devices unchanged.
Remaining: dark Find Memory Details/return routes (13 structural links), remaining deep theme routes, live category/create-new journeys. Full owner design approval and release acceptance remain pending.
