# Exact bb235cd iOS build and preserving upgrade — November 6, 2026

## Verified build and upgrade

Application source: bb235cdf6f2bba63b1760038a379a2c09cdf32ab. Both current virtual-platform QA targets now run this source. This is a bounded milestone, not full native acceptance or release approval.

- PASS: unsigned Release arm64 iOS Simulator build, exit 0, 15:08:25–15:11:49 UTC (204 seconds), on the Mac mini.
- All 769 immutable archive files and the existing native input fingerprints matched before and after compilation. Dependency lock, native project graph and generated configuration were unchanged. No dependency installation or project generation occurred.
- Pre-Hermes JavaScript was naturally retained by the existing build recipe. No compiler hooks or extra source-map generation were added.
- PASS: preserving upgrade on the separate current QA simulator, exit 0, 15:14:31–15:14:41 UTC (10 seconds). Installed executable and JavaScript hashes match the build. Application identity is unchanged.
- The previous 737eac1 app and data copy remain retained. Logical data and media matched before and after installation and launch. Protected reminder targets were not used for this upgrade.
- Initial read-only snapshot preflight encountered an absent optional standalone-reminder table and stopped before copy/install; the snapshot helper then handled that absence without database writes. No reset, erase or uninstall was used.

Exact source, dependency, binary, JavaScript and evidence fingerprints: [sanitized manifest](SB121_IOS_BB235_BUILD_UPGRADE_MANIFEST.json). Raw logs, screenshots, data and binaries remain in private evidence storage, outside this repository.

## Bounded current native observations

At combined app Large Text and OS maximum text, portrait ordinary typing and repeated focus passed after the keyboard frame settled. These are bounded observations, not whole-app accessibility approval.

**VERIFIED FAIL / OPEN:** rotating the same dirty editor into landscape leaves its focused field scrolled outside the visible content viewport. The defect persists after settling and requires a source repair plus exact-artifact retest. A visible/focused accessibility flag alone is not proof that the field is on screen. Earlier Android keyboard acceptance does not certify this iOS case.

Full iOS keyboard/rotation acceptance, broader manual accessibility, virtual regression, physical acceptance, signing and store gates remain open. Release remains **NO-GO**.

## Related evidence

- [Reviewed source, both-platform artifacts and bounded Android keyboard acceptance](SB121_VERIFIED_KEYBOARD_MILESTONES_20261106.md).
- [Current Android native archive milestone and restore limits](SB121_CURRENT_NATIVE_ARCHIVE_20261106.md).
- [Protected normal-clock linked reminder delivery/tap milestone](SB121_LINKED_0900_MILESTONE_20261106.md), belonging to its separately identified reminder runtime rather than bb235cd.

No production deployment, release merge, physical-phone testing or store submission is implied.
