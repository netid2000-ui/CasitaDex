# Current native milestone: both platforms on 8cc2862

November 6, 2026. **Bounded native PASS with explicit gaps. Release remains NO-GO.**

Both installed virtual artifacts identify **8cc2862eaf2791379518e440d3b9d5833543ab0a**. Earlier failures and narrower passes remain historical, not rewritten. The original planned matrix remains PLANNED_NOT_EXECUTED; the [central ledger](SB121_CURRENT_NATIVE_ACCEPTANCE_LEDGER_20261106.json) records subsequent evidence without promoting composite cells.

## Exact artifacts

- iOS: uninstrumented unsigned Release arm64 Simulator. Executable SHA-256 0bf79aa575f0839249e10a4b4c435355a753f73acd494fb8bbf4a84d7a3d969a; Hermes 402d084df76a730eab6c7fdfaeb695d24995ca4063a3a4f63ffe0f66d4575e77.
- Android: nondebuggable ARM64 Release QA APK. SHA-256 5aa21f511cfa6d0630ac76a4b0ffe854ef04ddeb031e3711073ccad63bac6048; Hermes a046919715a09b6e878c11f111ad48bf9f30f083eb10c206969289797abb107f. Same retained QA signer; not a store artifact.

## iOS: original focused-rotation defect closes within its tested scope

- **PASS:** system maximum plus app Large Text set before the same dirty focused editor rotates to landscape. Initial and independently repeated settled pixels show usable trailing text/caret above the keyboard. The oversized field spans y5–178 and intersects its pane y71–178; this does not claim the entire control fits.
- **PASS:** intrinsic normal action sizing, real keyboard key, two keyboard hide/refocus cycles, independent action/content clipping and scrolling. The latter interaction checks applied system maximum after mounting the editor at normal size; they do not establish all enlarged-label reachability.
- **PASS:** normal manual drag/hold/refocus and portrait return; Save with keyboard, cold relaunch and saved-value readback, UI restoration of the original title, dirty Cancel, and Share-preview/Cancel. Three held samples do not prove continuous zero-jitter motion. Share preview is not a new native sheet/export/send test.

Preserving upgrade and pre-Save controls matched all ten tables/media exactly. The deliberate Save and original-title restoration advanced revision **14 to 16**, changing only the original updatedAt and corresponding state/recovery tables. Original semantic fields/events, other data and photo bytes remained unchanged. The last bounded attempt then matched all ten tables/media exactly against revision 16. Final Home/portrait/system large/app Large Text off/no keyboard/no draft was verified.

**INCOMPLETE:** maximum-size manual hold/refocus. An earlier long seek stopped at its 48-swipe bound. The final observed-state setup confirmed stable Appearance/selection controls, but the original record remained below the viewport after two bounded setup swipes. No editor, system-maximum setting, rotation or manual interaction ran: **NOT_RUN**, not a newly demonstrated app defect. Preference-only recovery preserved all ten tables/media at revision 16; no further attempt is planned. The earlier display hold is superseded by remote-continuation authorization. Static native pixels were reviewed; live iOS desktop selection remains unverified.

## Android: current-source preserving upgrade and smoke

**PASS:** same-package/signer upgrade, Home/Photos/Reminders/Find navigation, Find opening the retained answer, both draft photo viewers/next/Close and return to the retained draft, reminder retention and relaunch. Actual live desktop Home/photo pixels were inspected. Collection/draft/reminder semantics and all media bytes matched across upgrade, smoke and relaunch.

Final state: **one saved memory, one draft with two photos, one reminder**; revision **21 to 23**, draft checkpoint **39**, with no semantic change. Radios remained airplane 0/Wi-Fi 1/mobile data 1. After acceptance, the virtual device was gracefully stopped at 18:51:14.935 UTC; absent ports/processes were independently verified at 18:51:48.981 UTC. Complete app data and the installed 8cc artifact were retained without reset, uninstall or radio change. The earlier live pixel observations remain valid; the final state is safely stopped.

Actual native restore remains the separately verified **bb235** run; strict OS-offline remains the **5dc** run. Neither was repeated or relabeled as 8cc. The retained two-photo export SHA-256 **82cbc2865e26c5e6c676e42c78d6f65c4217ab1233a8f4f7a404dbf1d9c8509e** was created on 5dc at revision 21, not freshly exported from revision 23. Older one-photo archives are not current-state replacements.

## Remaining gates and evidence

Broad maximum-size form reachability, maximum-size manual hold/refocus, actual VoiceOver/TalkBack, a new iOS XCTest all audit, iOS restore/strict offline, broader photo/notification/visual cases, dependency-security closure, physical/owner acceptance, signing and store readiness remain open. Approval-held work remains held. No full native/composite or release PASS is claimed.

The source gate remains **590 total, 585 passed, 5 opt-in archive skips**, plus 48 focused checks, typecheck and targeted lint. No application tests, builds or device actions were repeated for this documentation consolidation.

Final receipt integrity: iOS **271/271** frozen entries and Android **12/12** receipt hashes match. These are file-integrity counts, not test totals.
- iOS result SHA-256: bdee90b61e088dac039459a9527997c89a4d7d549a1ba3f13391ca18a9dabda7.
- iOS manifest SHA-256: 4bde77dbe4a768ed4ec14980e6f4ef389b1c1b14b9cac8e8ed60a3274552ebd0.
- Android result SHA-256: d90c2d0d2552ff656472447f0fbdd5a942320dd5ba1fb32be25a83ff35de115c.
- Android checksum manifest SHA-256: ee160b112ccc43e3e25eef2a3a2ff6bdf06b3fb16bc1f88938282712d8d71ef2.

The earlier coordinate diagnostic was not release accepted. Exact uninstrumented 8cc evidence supersedes its need for the original focused-rotation case only. Raw traces, private data, device identifiers and recovery copies remain outside Git.

Final Android handoff receipt SHA-256: 9e571eca91196d1222576bf654c45d460262dceb456461c296fe6534d0d1bec7. Retained complete recovery data SHA-256: d93a6251d2e4e4231a43c70123108f4e4352eb0bb83d9acc3a1caaa6716ae56a. This recovery copy is not a new app export or restore test.
