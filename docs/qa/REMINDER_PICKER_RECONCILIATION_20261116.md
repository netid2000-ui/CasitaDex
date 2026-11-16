# Reminder picker reconciliation — November 16, 2026

## Verified checkpoint

Application baseline: `f761bad` on `work/cd-reminder-controls-fix-20261116`.
This checkpoint reviews existing Figma work and records the remaining owner acceptance. No application source changes, native rebuilds, device tests or installs were performed for this documentation checkpoint.

The live Figma file already contained the completed native-reference board when inspected. It was preserved and verified rather than recreated. This supersedes the previous report's pending schematic-picker documentation gap.

[Native picker reference board](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1595-291)

- [x] Eight editable reference states: iOS normal/light calendar and time wheels; iOS enlarged/dark date and time wheels; Android normal/light date and time dialogs; Android 200%/dark date and time dialogs.
- [x] 482 editable descendant nodes; no image-filled nodes or flattened UI screenshots.
- [x] Font families reflect app/editorial and native references: Cormorant Garamond, Inter, SF Pro and Roboto.
- [x] Both original overlay IDs remain `986:44` and `986:53`; all 12 incoming overlay links remain present.
- [x] Both Done buttons close their overlay; no immediate child horizontally overflows either overlay.
- [x] Board visually reviewed against the prior native captures and recorded picker behavior.
- [x] iOS immediate unsaved-editor updates versus Android Cancel/OK behavior is explicitly distinguished.
- [x] Date adaptation rule is documented: inline only at width >=390, fontScale <1.35 and app Large off; otherwise wheels. Time uses wheels.

These are static editable visual references, not executable native pickers. They do not prove selection, scheduling, delivery, accessibility announcements or owner acceptance. Platform-controlled neutral surfaces and geometry remain documented. No new Figma mutation was necessary in this checkpoint.

## Installed candidate retained

Previously verified Android package: `com.designsbyfa.casitadex.refreshqa`.
Previously verified APK SHA-256: `579bbc47c05127d66030a65aadc716a7e25fc9b1f5d2fbacad2c4745ca777beb`.
Prior native and automated results remain in [the correction report](REMINDER_CONTROLS_FIX_20261116.md): 521 automated passes / 6 skips; four picker cases each on emulator and Samsung; two iOS simulator cases; two Samsung expanded-action cases.
These results are inherited evidence, not reruns performed today.

## Next acceptance

Use [the physical iPhone owner checklist](IPHONE_OWNER_ACCEPTANCE_20261116.md). A simulator app cannot be treated as an installable or accepted physical-device build. Record the physical build's exact identity before testing. No physical iPhone installation or owner approval is claimed here.

Release remains gated on the outstanding owner/native accessibility and release checks. Household sharing remains deferred; main merge, production release, store submission and purchases remain unauthorized.
